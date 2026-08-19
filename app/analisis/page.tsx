"use client";
import { useState, useEffect, useCallback } from "react";
import Icon from "@mdi/react";
import {
  mdiArrowLeft,
  mdiScale,
  mdiCalendarRange,
  mdiRuler,
  mdiGenderTransgender,
  mdiLoading,
  mdiCheckCircleOutline,
  mdiAlertCircleOutline,
  mdiShieldCheckOutline,
  mdiHelpCircleOutline,
  mdiDatabaseSearchOutline,
  mdiFlaskOutline,
  mdiAccount,
} from "@mdi/js";

import * as ort from "onnxruntime-web";
import Link from "next/link";
import AOS from "aos";
import "aos/dist/aos.css";
import { supabase } from "@/lib/supabase";

if (typeof window !== "undefined") {
  ort.env.wasm.wasmPaths =
    "https://cdn.jsdelivr.net/npm/onnxruntime-web/dist/";
}



// Dataset NHANES
const VALID_RANGES = {
  age:     { min: 12,   max: 80,   label: "Usia" },
  weight:  { min: 8,    max: 120,  label: "Berat Badan" },
  height:  { min: 100,  max: 200,  label: "Tinggi Badan" },
  waist:   { min: 45,   max: 170,  label: "Lingkar Pinggang" },
  glucose: { min: 47,   max: 451,  label: "Gula Darah Puasa" },
};




// Feature Engineering 
function computeDerivedFeatures(age: number, bmi: number, waist: number) {
  const ageGroup = age < 18 ? 0 : age < 40 ? 1 : age < 60 ? 2 : 3;
  const bmiCategory =
    bmi < 18.5 ? 0 : bmi < 25 ? 1 : bmi < 30 ? 2 : 3;
  const ageBmiInteraction = age * bmi;
  const waistBmiRatio = waist / bmi;
  return { ageGroup, bmiCategory, ageBmiInteraction, waistBmiRatio };
}

function computeBMI(weightKg: number, heightCm: number): number {
  const heightM = heightCm / 100;
  return weightKg / (heightM * heightM);
}





// ONNX output
function parseProbabilityFromONNX(results: any, session: ort.InferenceSession): number {
  const probOutput = results[session.outputNames[1]];

  if (Array.isArray(probOutput)) {
    const firstMap = probOutput[0]; 

    const probDiabetes = firstMap["1"] ?? firstMap[1] ?? 0;
    return Number(probDiabetes);
  }

  if (probOutput?.data) {
    return Number(probOutput.data[1]);
  }

  return 0;
}




// Component Utama
export default function AnalisisPage() {
  const [loading, setLoading] = useState(false);
  const [hasil, setHasil] = useState<{
    label: "Tinggi" | "Rendah";
    probability: number;
    modelUsed: string;
  } | null>(null);
  const [metadata, setMetadata] = useState<any>(null);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    AOS.init({ duration: 800 });
    fetch("/model/model_metadata.json")
      .then((res) => res.json())
      .then((data) => setMetadata(data))
      .catch((err) => console.error("Metadata load error:", err));
  }, []);

  const [formData, setFormData] = useState({
    gender: "0",
    age: "",
    weight: "", 
    height: "",
    waist: "",
    glucose: "",
  });



  // Hitung BMI 
  const computedBMI = useCallback(() => {
    const w = parseFloat(formData.weight);
    const h = parseFloat(formData.height);
    if (w > 0 && h > 0) return computeBMI(w, h);
    return null;
  }, [formData.weight, formData.height]);



  // Validasi
  function validateForm(): boolean {
    const errors: Record<string, string> = {};
    const fields = [
      { key: "age", value: formData.age },
      { key: "weight", value: formData.weight },
      { key: "height", value: formData.height },
      { key: "waist", value: formData.waist },
    ];



    // Tambahkan glucose
    if (formData.glucose !== "") {
      fields.push({ key: "glucose", value: formData.glucose });
    }

    fields.forEach(({ key, value }) => {
      const num = parseFloat(value);
      const range = VALID_RANGES[key as keyof typeof VALID_RANGES];
      if (!value || isNaN(num)) {
        errors[key] = `${range.label} wajib diisi.`;
      } else if (num < range.min || num > range.max) {
        errors[key] = `${range.label} harus antara ${range.min}–${range.max}.`;
      }
    });

    // Validasi BMI
    const bmi = computedBMI();
    if (bmi !== null && (bmi < 13 || bmi > 87)) {
      errors["bmi_computed"] =
        "Kombinasi berat/tinggi menghasilkan BMI di luar range valid (13–87). Cek ulang input.";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  }



  // Handle Predict
  const handlePredict = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!metadata) return alert("Sistem belum siap, mohon tunggu sebentar.");
    if (!validateForm()) return; // Stop kalau ada validation error

    setLoading(true);
    setHasil(null);

    // Delay untuk UX
    await new Promise((resolve) => setTimeout(resolve, 1200));

    try {
      const hasLab = formData.glucose !== "";
      const modelPath = hasLab
        ? "model/model_A_with_lab.onnx"
        : "model/model_B_no_lab.onnx";
      const modelMeta = hasLab ? metadata.model_A : metadata.model_B;
      const optimalThreshold: number = modelMeta.optimal_threshold;

      // Load ONNX
      const session = await ort.InferenceSession.create(modelPath, {
        executionProviders: ["wasm"],
      });

      // Persiapan Input
      const gender = parseFloat(formData.gender);
      const age = parseFloat(formData.age);
      const weight = parseFloat(formData.weight);
      const height = parseFloat(formData.height);
      const waist = parseFloat(formData.waist);
      const bmi = computeBMI(weight, height);
      const glucose = hasLab ? parseFloat(formData.glucose) : null;

      const { ageGroup, bmiCategory, ageBmiInteraction, waistBmiRatio } =
        computeDerivedFeatures(age, bmi, waist);

      let inputArray: number[];
      if (hasLab) {
        inputArray = [
          gender,
          age,
          bmi,
          waist,
          glucose!,
          ageBmiInteraction,
          waistBmiRatio,
          ageGroup,
          bmiCategory,
        ];
      } else {
        inputArray = [
          gender,
          age,
          bmi,
          waist,
          ageBmiInteraction,
          waistBmiRatio,
          ageGroup,
          bmiCategory,
        ];
      }

      const tensor = new ort.Tensor(
        "float32",
        Float32Array.from(inputArray),
        [1, inputArray.length]
      );

      // Inferensi
      const results = await session.run({
        [session.inputNames[0]]: tensor,
      });

      const probDiabetes = parseProbabilityFromONNX(results, session);

      const label: "Tinggi" | "Rendah" =
        probDiabetes >= optimalThreshold ? "Tinggi" : "Rendah";

      setHasil({
        label,
        probability: probDiabetes,
        modelUsed: hasLab ? "Model A (Klinis)" : "Model B (Skrining)",
      });

      // PERBAIKAN
      await supabase.from("predictions").insert([
        {
          gender: gender,               
          age: age,                     
          weight: weight,               
          height: height,               
          bmi: parseFloat(bmi.toFixed(2)),
          waist: waist,
          glucose: hasLab ? glucose : null,
          prediction_result: label,   
          probability: parseFloat(probDiabetes.toFixed(4)),
          model_version: modelMeta.name,
        },
      ]);
    } catch (err: any) {
      console.error("AI Error:", err);
      alert(
        "Web sedang dalam perbaikan, silahkan coba kembali setelah perbaikan selesai."
      );
    } finally {
      setLoading(false);
    }
  };

  const bmiDisplay = computedBMI();

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-[poppins] pb-20 selection:bg-[#00B7B5] selection:text-white relative overflow-hidden">

      <div className="absolute top-[-10%] right-[-5%] w-[40rem] h-[40rem] bg-gradient-to-br from-[#00B7B5]/10 to-transparent rounded-full blur-[100px] -z-10"></div>
      <div className="absolute bottom-[-10%] left-[-5%] w-[30rem] h-[30rem] bg-gradient-to-tr from-[#26CCC2]/10 to-transparent rounded-full blur-[100px] -z-10"></div>


      <nav className="fixed top-0 w-full z-[100] bg-white/70 backdrop-blur-xl border-b border-slate-200 px-6">
        <div className="max-w-7xl mx-auto h-20 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-3 text-[#005461] font-bold hover:text-[#00B7B5] transition-all group"
          >
            <div className="p-2 bg-slate-100 rounded-lg group-hover:bg-[#00B7B5]/10 transition-colors">
              <Icon path={mdiArrowLeft} size={0.8} />
            </div>
            <span className="uppercase tracking-[0.2em] text-[10px] hidden md:block">
              Beranda
            </span>
          </Link>

          <div className="flex items-center gap-4 bg-white px-5 py-2.5 rounded-2xl border border-slate-100 shadow-sm">
            <div
              className={`w-2 h-2 rounded-full ${
                loading ? "bg-amber-500 animate-pulse" : "bg-[#00B7B5]"
              }`}
            ></div>
            <span className="text-[10px] font-bold text-[#005461] uppercase tracking-[0.15em]">
              {loading ? "Sedang Cek Diabetes" : "EDD AI Aktif"}
            </span>
          </div>

        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 mt-32 space-y-8">


        {/* =========================================== */}
        {/* ================= HEADER ================== */}
        {/* =========================================== */}

        <div className="w-full bg-gradient-to-r from-[#004d57] to-[#008e9a] rounded-3xl p-6 md:px-10 md:py-7 text-white shadow-lg relative overflow-hidden" data-aos="fade-up">
          <div className="absolute top-0 right-0 w-32 h-full bg-white/5 -skew-x-12 translate-x-10"></div>
          <div className="relative z-10 flex flex-col items-center md:flex-row md:items-center justify-between gap-5">
            
            {/* LEFT */}
            <div className="flex flex-col items-center md:flex-row md:items-start gap-3 md:gap-5">
  
            <div className="flex p-3 bg-white/10 rounded-xl backdrop-blur-md border border-white/20 shrink-0">
                <Icon path={mdiShieldCheckOutline} size={0.9} className="text-[#26CCC2]" />
              </div>
              
              <div className="text-center md:text-left">
                <h1 className="text-lg md:text-2xl font-bold tracking-tight leading-tight">
                  CEK DIABETES
                </h1>
                <p className="text-white/60 text-[9px] md:text-xs uppercase tracking-[0.2em] font-medium mt-1">
                  Cek Risiko Diabetes Dengan Mudah
                </p>
              </div>
            </div>

            {/*RIGHT */}
            <div className="max-w-xl">
              <p className="text-white/80 text-xs md:text-sm leading-relaxed text-center md:text-right md:not-italic">
                Gunakan data fisik Anda untuk cek apakah ada risiko diabetes. Sistem ini akan membantu Anda mendeteksi risiko diabetes secara mandiri.
              </p>
            </div>

          </div>
        </div>

        <div className="grid lg:grid-cols-12 gap-8 items-stretch">

          {/* FORM */}
          <div className="lg:col-span-7" data-aos="fade-right">
            <div className="bg-white h-full rounded-[3rem] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.05)] border border-slate-100 p-8 md:p-12">
              <form onSubmit={handlePredict} className="space-y-8">
                <div className="grid md:grid-cols-2 gap-8">


                  {/* GENDER */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 text-[#00B7B5]">
                      <Icon path={mdiGenderTransgender} size={0.7} />
                      <label className="text-[11px] font-bold uppercase tracking-widest text-slate-400">
                        Jenis Kelamin
                      </label>
                    </div>
                    <select
                      value={formData.gender}
                      onChange={(e) =>
                        setFormData({ ...formData, gender: e.target.value })
                      }
                      className="w-full bg-slate-50 border-2 border-transparent focus:border-[#00B7B5] focus:bg-white px-6 py-4 rounded-2xl text-lg font-bold text-[#005461] outline-none transition-all shadow-sm"
                    >
                      <option value="0">Laki-laki</option>
                      <option value="1">Perempuan</option>
                    </select>
                  </div>


                  {/* USIA */}
                  <InputGroup
                    label="Usia"
                    icon={mdiCalendarRange}
                    value={formData.age}
                    onChange={(v: string) =>
                      setFormData({ ...formData, age: v })
                    }
                    placeholder="Contoh: 45"
                    unit="Tahun"
                    hint="Rentang: 12–80 tahun"
                    error={validationErrors.age}
                  />


                  {/* BERAT BADAN */}
                  <InputGroup
                    label="Berat Badan"
                    icon={mdiScale}
                    value={formData.weight}
                    onChange={(v: string) =>
                      setFormData({ ...formData, weight: v })
                    }
                    placeholder="Contoh: 75"
                    unit="kg"
                    hint="Rentang: 8–120 kg"
                    error={validationErrors.weight}
                  />


                  {/* TINGGI BADAN */}
                  <InputGroup
                    label="Tinggi Badan"
                    icon={mdiAccount}
                    value={formData.height}
                    onChange={(v: string) =>
                      setFormData({ ...formData, height: v })
                    }
                    placeholder="Contoh: 170"
                    unit="cm"
                    hint="Rentang: 100–200 cm"
                    error={validationErrors.height}
                  />


                  {/* LINGKAR PINGGANG */}
                  <InputGroup
                    label="Lingkar Pinggang"
                    icon={mdiRuler}
                    value={formData.waist}
                    onChange={(v: string) =>
                      setFormData({ ...formData, waist: v })
                    }
                    placeholder="Contoh: 95"
                    unit="cm"
                    hint="Ukur di titik pusar"
                    error={validationErrors.waist}
                  />


                  {/* BMI OTOMATIS */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 text-[#00B7B5]">
                      <Icon path={mdiScale} size={0.7} />
                      <label className="text-[11px] font-bold uppercase tracking-widest text-slate-400">
                        Index Massa Tubuh (Otomatis)
                      </label>
                    </div>
                    <div
                      className={`w-full px-6 py-4 rounded-2xl text-lg font-bold shadow-sm border-2 transition-all
                        ${
                          bmiDisplay
                            ? "bg-[#00B7B5]/5 border-[#00B7B5]/30 text-[#005461]"
                            : "bg-slate-50 border-transparent text-slate-300"
                        }`}
                    >
                      {bmiDisplay ? bmiDisplay.toFixed(1) : "—"}
                      <span className="text-[9px] font-bold text-slate-300 uppercase italic ml-2">
                        kg/m²
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-400 italic px-2 opacity-80 leading-none">
                      Dihitung dari Berat ÷ Tinggi²
                    </p>
                    {validationErrors.bmi_computed && (
                      <p className="text-[10px] text-red-500 font-semibold px-2">
                        ⚠ {validationErrors.bmi_computed}
                      </p>
                    )}
                  </div>
                </div>


                {/* GLUKOSA RUN MODEL A */}
                <div className="border-t border-slate-100 pt-6">
                  <InputGroup
                    label="Gula Darah (Opsional)"
                    icon={mdiFlaskOutline}
                    value={formData.glucose}
                    onChange={(v: string) =>
                      setFormData({ ...formData, glucose: v })
                    }
                    placeholder="Contoh: 110"
                    unit="mg/dL"
                    hint="Isi untuk akurasi klinis. Rentang: 47–451 mg/dL"
                    error={validationErrors.glucose}
                    optional
                  />
                </div>

                {/* SUBMIT */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#005461] hover:bg-[#00B7B5] py-6 rounded-2xl text-white font-bold text-lg shadow-xl shadow-[#005461]/20 transition-all flex items-center justify-center gap-4 active:scale-[0.98] disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <Icon path={mdiLoading} size={1} spin /> Memproses
                      Data...
                    </>
                  ) : (
                    <>
                      <Icon path={mdiShieldCheckOutline} size={0.8} /> Lihat Hasil
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>


          {/* HASIL PREDIKSI */}
          <div
            className="lg:col-span-5 flex flex-col space-y-6"
            data-aos="fade-left"
          >
            <div
              className={`flex-grow flex flex-col items-center justify-center rounded-[3rem] border-2 transition-all duration-700 p-10 
              ${
                hasil
                  ? hasil.label === "Tinggi"
                    ? "bg-red-50 border-red-100 shadow-xl"
                    : "bg-emerald-50 border-emerald-100 shadow-xl"
                  : "bg-white border-dashed border-slate-200 shadow-sm"
              }`}
            >
              {/* BELUM PREDIKSI */}
              {!hasil && !loading && (
                <div className="text-center space-y-6">
                  <div className="w-20 h-20 bg-slate-50 rounded-[2rem] flex items-center justify-center mx-auto">
                    <Icon
                      path={mdiDatabaseSearchOutline}
                      size={1.5}
                      className="text-slate-200"
                    />
                  </div>
                  <div className="space-y-2 px-4">
                    <h3 className="text-[#005461] font-bold text-sm uppercase tracking-widest">
                      Siap Menganalisis
                    </h3>
                    <p className="text-slate-400 text-[11px]">
                      Masukkan data medis Anda untuk memulai perhitungan risiko diabetes.
                    </p>
                  </div>
                </div>
              )}


              {/* LOADING */}
              {loading && (
                <div className="text-center space-y-6">
                  <div className="w-20 h-20 border-4 border-slate-100 border-t-[#00B7B5] rounded-full animate-spin mx-auto"></div>
                  <p className="text-[#018790] font-bold uppercase tracking-[0.3em] text-[10px] animate-pulse">
                    Menganalisis...
                  </p>
                </div>
              )}


              {/* HASIL */}
              {hasil && !loading && (
                <div className="text-center space-y-6 w-full">

                  <div
                    className={`w-24 h-24 rounded-[2rem] flex items-center justify-center rotate-6 shadow-lg mx-auto ${
                      hasil.label === "Tinggi"
                        ? "bg-red-500 text-white"
                        : "bg-[#00B7B5] text-white"
                    }`}
                  >
                    <Icon
                      path={
                        hasil.label === "Tinggi"
                          ? mdiAlertCircleOutline
                          : mdiCheckCircleOutline
                      }
                      size={2}
                    />
                  </div>

                  <div className="space-y-1">
                    <p className="text-slate-400 font-bold uppercase tracking-[0.4em] text-[10px]">
                      Level Risiko Diabetes
                    </p>
                    <h2
                      className={`text-5xl font-bold tracking-tighter uppercase ${
                        hasil.label === "Tinggi"
                          ? "text-red-600"
                          : "text-[#005461]"
                      }`}
                    >
                      {hasil.label}
                    </h2>
                  </div>

                  {/* PROBABILITAS GARIS BAR */}
                  <div className="w-full bg-white rounded-2xl border border-slate-100 p-4 space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        Analisa Diabetes
                      </span>
                      <span
                        className={`text-[11px] font-bold ${
                          hasil.label === "Tinggi"
                            ? "text-red-600"
                            : "text-[#005461]"
                        }`}
                      >
                        {(hasil.probability * 100).toFixed(1)}%
                      </span>
                    </div>
                    <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-1000 ${
                          hasil.label === "Tinggi"
                            ? "bg-red-500"
                            : "bg-[#00B7B5]"
                        }`}
                        style={{ width: `${hasil.probability * 100}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* REKOMENDASI */}
                  <p className="text-slate-600 text-xs leading-relaxed font-medium bg-white/40 p-5 rounded-3xl border border-white/60">
                    {hasil.label === "Tinggi"
                      ? "Dari data yang Anda masukkan, terlihat adanya kemungkinan risiko diabetes. Untuk memastikan kondisi kesehatan Anda, sebaiknya lakukan pemeriksaan gula darah di fasilitas kesehatan terdekat."
                      : "Data yang Anda masukkan menunjukkan risiko diabetes yang rendah. Tetap jaga pola makan dan biasakan berolahraga agar kesehatan tetap terjaga."}
                  </p>
                </div>
              )}
            </div>

            {/* INDIKATOR MODEL */}
            <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 flex gap-4 items-center shadow-sm">
              <div className="bg-[#00B7B5]/10 p-2 rounded-lg text-[#00B7B5]">
                <Icon path={mdiHelpCircleOutline} size={0.8} />
              </div>
              <p className="text-[10px] text-slate-400 italic">
                Model aktif:{" "}
                <span className="font-bold text-[#005461]">
                  {hasil
                    ? hasil.modelUsed
                    : formData.glucose
                    ? "Model A (Klinis)"
                    : "Model B (Skrining)"}
                </span>
                . Sistem memilih secara otomatis berdasarkan data yang diisi.
              </p>
            </div>
          </div>
        </div>
      </main>

      <footer className="mt-20 py-8 text-center border-t border-slate-100 max-w-7xl mx-auto opacity-40">
        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.5em]">
          Institut Teknologi Sains Bandung - Fakultas Digital, Sains dan Bisnis
        </p>
      </footer>
    </div>
  );
}


{/* =========================================== */}
{/* ============== KOMPONEN GRUB ============== */}
{/* =========================================== */}
function InputGroup({
  label,
  icon,
  value,
  onChange,
  placeholder,
  unit,
  hint,
  error,
  optional,
}: {
  label: string;
  icon: string;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  unit: string;
  hint?: string;
  error?: string;
  optional?: boolean;
}) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3 text-[#00B7B5]">
        <Icon path={icon} size={0.7} />
        <label className="text-[11px] font-bold uppercase tracking-widest text-slate-400">
          {label}
        </label>
      </div>
      <div className="relative">
        <input
          type="number"
          step="any"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          required={!optional}
          className={`w-full bg-slate-50 border-2 focus:bg-white px-6 py-4 rounded-2xl text-lg font-bold text-[#005461] outline-none transition-all shadow-sm
            ${
              error
                ? "border-red-300 focus:border-red-400"
                : "border-transparent focus:border-[#00B7B5]"
            }`}
        />
        <span className="absolute right-6 top-1/2 -translate-y-1/2 text-[9px] font-bold text-slate-300 uppercase italic">
          {unit}
        </span>
      </div>
      {error && (
        <p className="text-[10px] text-red-500 font-semibold px-2">
          ⚠ {error}
        </p>
      )}
      {hint && !error && (
        <p className="text-[10px] text-slate-400 italic px-2 opacity-80 leading-none">
          {hint}
        </p>
      )}
    </div>
  );
}
