// Password Supabase
// Bagas%0206##&/
"use client";
import { useState, useEffect } from "react";
import Icon from '@mdi/react';
import { 
  mdiArrowRight,
  mdiShieldCheck,
  mdiSchool,
  mdiDatabaseSearch,
  mdiInformationOutline,
  mdiShieldCheckOutline,
  mdiChartTimelineVariant,
  mdiCheckDecagram,
  mdiMenu,
  mdiClose,
  mdiWaterAlert,
  mdiFoodApple,
  mdiRunFast,
  mdiHeartPulse,
  mdiDatabaseSearchOutline,
  mdiAutoFix,
  mdiArrowUp,
  mdiChevronRight
} 

from '@mdi/js';
import AOS from 'aos';
import 'aos/dist/aos.css';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

export default function LandingPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home"); 
  const [showScrollTop, setShowScrollTop] = useState(false);


  // ===========================================
  // ================= ANIMASI =================
  // ===========================================

  const handleBackToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };


  useEffect(() => {
    AOS.init({ duration: 800, once: true });

    // Navbar
    const observerOptions = {
      root: null,
      rootMargin: "-45% 0px -45% 0px",
      threshold: 0,
    };

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);
    const sections = ["home", "tentang", "riset", "edukasi", "cara-kerja"];
    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });


    // Button Scroll pojok kanan bawah
    const handleScroll = () => {
      if (window.scrollY > 400) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);


  // function handleBackToTop(event: MouseEvent<HTMLButtonElement, MouseEvent>): void {
  //   throw new Error("Function not implemented.");
  // }

  // ======================================================================
  // ======================================================================
  // ======================================================================

  return (
    <div className="min-h-screen bg-[#F4F4F4] text-[#333333] font-[poppins] overflow-x-hidden scroll-smooth selection:bg-[#00B7B5] selection:text-white">

      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-[#26CCC2]/10 rounded-full blur-[120px]"></div>
      </div>

      {/* --- NAVIGASI --- */}
      <nav className="fixed top-0 w-full z-[100] bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <img src="/img/logo/himasada.png" alt="ITSB Logo" className="h-10 md:h-12 w-auto object-contain" />
            <div className="h-6 w-[1.5px] bg-slate-300"></div>
            <span className="text-xl font-bold tracking-tight text-[#005461]">Early Detection<span className="text-[#00B7B5]"> Diabetes</span></span>
          </div>


          {/* MENU TAMPILAN DESKTOP */}
          <div className="hidden lg:flex items-center gap-8 text-[13px] font-semibold uppercase tracking-wider">
            {[
              { id: "home", label: "Home" },
              { id: "tentang", label: "Tentang" },
              { id: "riset", label: "Hasil Riset" },
              { id: "edukasi", label: "Edukasi" },
              { id: "cara-kerja", label: "Cara Kerja" },
            ].map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                className={`transition-colors duration-300 ${
                  activeSection === item.id 
                  ? "text-[#00B7B5]" 
                  : "text-[#018790] hover:text-[#00B7B5]"
                }`}
              >
                {item.label}
              </a>
            ))}
            <Link 
              href="/analisis" 
              className="bg-[#005461] text-white px-6 py-2.5 rounded-lg hover:bg-[#018790] shadow-md transition-all active:scale-95"
            >
              Cek Diabetes
            </Link>
          </div>


          {/* BUTTON TAMPILAN MOBILE */}
          <button className="lg:hidden text-[#005461]" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            <Icon path={isMenuOpen ? mdiClose : mdiMenu} size={1.5} />
          </button>
        </div>


        {/* DROPDOWN TAMPILAN MOBILE */}
        {isMenuOpen && (
          <div className="lg:hidden bg-white border-b border-slate-200 p-6 flex flex-col gap-4 font-bold uppercase text-sm animate-in slide-in-from-top duration-300">
            {[
              { id: "home", label: "Home" },
              { id: "tentang", label: "Tentang" },
              { id: "riset", label: "Hasil Riset" },
              { id: "edukasi", label: "Edukasi" },
              { id: "cara-kerja", label: "Cara Kerja" },
            ].map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                onClick={() => setIsMenuOpen(false)}
                className={`transition-colors ${
                  activeSection === item.id ? "text-[#00B7B5]" : "text-[#018790]"
                }`}
              >
                {item.label}
              </a>
            ))}
            <Link 
              href="/analisis" 
              onClick={() => setIsMenuOpen(false)}
              className="text-[#00B7B5] border-t pt-4"
            >
              Mulai Cek Diabetes
            </Link>
          </div>
        )}
      </nav>


      {/* BANNER */}
      <section id="home" className="relative pt-30 pb-25 px-6">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <div data-aos="fade-up">

            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#26CCC2]/10 text-[#018790] rounded-md text-[12px] font-bold uppercase tracking-wider mb-6">
              <Icon path={mdiCheckDecagram} size={0.6} /> Early Detection Diabetes
            </div>

            <h1 className="text-4xl lg:text-5xl font-bold leading-tight text-[#005461] mb-6">
              Solusi Digital Untuk <br />
              <span className="text-[#00B7B5]">Pencegahan Diabetes</span>
            </h1>

            <p className="text-base text-slate-600 max-w-xl leading-relaxed mb-8">
              Inovasi kesehatan cerdas dari <strong className="text-[#005461]">INTUVIA</strong>. Platform deteksi dini risiko diabetes berbasis Machine Learning yang dikembangkan oleh <strong className="text-[#00B7B5]">Program Studi Sains Data</strong>, di bawah naungan <strong className="text-[#005461]">Fakultas Digital, Desain, dan Bisnis</strong> — <strong className="text-[#00B7B5]">Institut Teknologi Sains Bandung</strong> untuk mewujudkan masyarakat yang lebih sehat dan preventif.
            </p>

            <div className="flex flex-wrap gap-4">
              <Link href="/analisis" className="px-8 py-4 bg-[#00B7B5] text-white rounded-xl font-bold flex items-center gap-3 hover:bg-[#005461] transition-all shadow-lg group">
                CEK DIABETES <Icon path={mdiArrowRight} size={0.8} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

          </div>
          
          <div className="relative" data-aos="fade-left" data-aos-delay="200">

            <div className="relative rounded-3xl overflow-hidden shadow-2xl border-[12px] border-white">
              <img src="/img/filler/doctor.jpg" alt="Medical Doctor" className="w-full h-[400px] object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#005461]/40 to-transparent"></div>
            </div>

          <div className="absolute -bottom-6 -left-6 bg-white p-5 rounded-2xl shadow-xl flex items-center gap-4 border border-slate-100 animate-pulse">
              <div className="w-10 h-10 bg-[#00B7B5] rounded-full flex items-center justify-center text-white">
                <Icon path={mdiShieldCheck} size={1} />
              </div>
              <div>
                <p className="text-[10px] text-slate-400 font-bold uppercase">Status Sistem</p>
                <p className="text-sm font-bold text-[#005461]">Under Riview</p>
              </div>
            </div>
          </div>

        </div>
      </section>


      {/* =========================================== */}
      {/* ================= TENTANG ================= */}
      {/* =========================================== */}

     
      <section id="tentang" className="py-20 px-6 relative overflow-hidden">

          <div className="absolute top-1/2 left-0 -translate-y-1/2 w-64 h-64 bg-[#26CCC2]/5 rounded-full blur-[80px] -z-10"></div>
          
          <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
            
            {/* KOLOM KIRI */}
            <div className="order-2 lg:order-1" data-aos="fade-right">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                    <h3 className="text-3xl font-bold text-[#00B7B5] mb-1">98%</h3>
                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Akurasi Model</p>
                  </div>
                  <div className="bg-[#005461] p-6 rounded-3xl shadow-lg text-white">
                    <h3 className="text-3xl font-bold mb-1">24/7</h3>
                    <p className="text-[11px] font-bold text-white/60 uppercase tracking-widest">Akses Mandiri</p>
                  </div>
                </div>
                <div className="pt-8">
                  <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 h-full flex flex-col justify-center">
                    <Icon path={mdiSchool} size={1.5} className="text-[#018790] mb-4" />
                    <p className="text-sm font-medium text-slate-600 leading-relaxed">
                      Dikembangkan di bawah naungan <strong>Institut Teknologi Sains Bandung</strong>.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* KOLOM KANAN */}
            <div className="order-1 lg:order-2 space-y-6" data-aos="fade-left">
              <div className="inline-flex items-center gap-2 text-[#00B7B5] font-bold text-sm uppercase tracking-[0.3em]">
                <span className="w-8 h-[2px] bg-[#00B7B5]"></span> Tentang Early Detection
              </div>
              <h2 className="text-3xl lg:text-4xl font-bold text-[#005461] leading-tight">
                Membangun Masa Depan <br /> 
                <span className="text-[#018790]">Kesehatan Digital Indonesia</span>
              </h2>
              <div className="space-y-6">
                <p className="text-slate-600 leading-relaxed text-justify">
                  Early Detection Diabetes dikembangkan oleh tim <strong className="text-[#005461]">INTUVIA</strong> dari Program Studi <strong>Sains Data ITSB</strong> sebagai upaya membantu masyarakat mengenali risiko kesehatan lebih dini. Kami menyadari bahwa banyak orang membutuhkan cara yang sederhana namun tetap berbasis data untuk mulai peduli terhadap pencegahan diabetes.
                </p>
                
                <p className="text-slate-600 leading-relaxed text-justify">
                  Saat ini platform kami masih dalam tahap <span className="text-[#00B7B5] font-semibold">pengembangan dan evaluasi mandiri</span>. Meski begitu, kami berupaya menyediakan alat analisis awal yang bisa digunakan siapa saja untuk mendapatkan gambaran kesehatan sebagai langkah waspada, sebelum nantinya melakukan konsultasi lebih lanjut dengan tenaga medis profesional.
                </p>
              </div>
              
              <div className="pt-4 flex flex-col sm:flex-row gap-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#26CCC2]/10 flex items-center justify-center text-[#00B7B5]">
                    <Icon path={mdiShieldCheck} size={0.8} />
                  </div>
                  <span className="text-sm font-bold text-[#005461]">Privasi Terjamin</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#26CCC2]/10 flex items-center justify-center text-[#00B7B5]">
                    <Icon path={mdiDatabaseSearch} size={0.8} />
                  </div>
                  <span className="text-sm font-bold text-[#005461]">Data Terintegrasi</span>
                </div>
              </div>
            </div>

          </div>
        </section>


        {/* =========================================== */}
        {/* =============== HASIL RISET =============== */}
        {/* =========================================== */}

      <section id="riset" className="py-24 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          
          {/* HEADER */}
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6" data-aos="fade-up">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 text-[#00B7B5] font-bold text-sm uppercase tracking-[0.3em]">
                <span className="w-8 h-[2px] bg-[#00B7B5]"></span> Research & Insights
              </div>
              <h2 className="text-3xl lg:text-4xl font-bold text-[#005461]">
                Hasil Riset & <br /> <span className="text-[#018790]">Analisis Kedokteran Digital</span>
              </h2>
            </div>
            <p className="text-slate-500 max-w-sm text-sm leading-relaxed border-l-2 border-slate-100 pl-6">
              Eksplorasi mendalam mengenai implementasi kecerdasan buatan dalam mendeteksi pola diabetes pada populasi Asia Tenggara.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                kategori: "Machine Learning",
                judul: "Optimasi Model Logistic Regression pada Dataset Pima Indians",
                ringkasan: "Penelitian ini fokus pada peningkatan akurasi prediksi hingga 92% dengan teknik preprocessing data yang ketat.",
                img: "img/riset/hasil-1.jpg",
                date: "Jan 2026"
              },
              {
                kategori: "Public Health",
                judul: "Tren Peningkatan Risiko Diabetes Dini di Kawasan Industri",
                ringkasan: "Analisis korelasi antara gaya hidup sedentari dan kadar gula darah pada pekerja usia produktif di Cikarang.",
                img: "img/riset/hasil-2.jpg",
                date: "Des 2025"
              },
              {
                kategori: "AI Ethics",
                judul: "Transparansi Algoritma AI dalam Diagnosis Penyakit Tidak Menular",
                ringkasan: "Bagaimana Early Detection AI menjaga objektivitas data dan menghindari bias dalam memberikan hasil prediksi.",
                img: "img/riset/hasil-3.jpg",
                date: "Nov 2025"
              }
            ].map((artikel, i) => (
              <div 
                key={i} 
                data-aos="fade-up" 
                data-aos-delay={i * 150}
                className="group bg-[#F4F4F4] rounded-[2.5rem] overflow-hidden border border-transparent hover:border-[#00B7B5]/20 hover:bg-white hover:shadow-2xl transition-all duration-500 cursor-pointer"
              >
                {/* GAMBAR HASIL RISET */}
                <div className="relative h-56 overflow-hidden">
                  <img 
                    src={artikel.img} 
                    alt={artikel.judul} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-90" 
                  />
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-4 py-1.5 rounded-full text-[10px] font-black text-[#005461] uppercase tracking-widest shadow-sm">
                    {artikel.kategori}
                  </div>
                </div>

                {/* ISI KONTEN */}
                <div className="p-8 space-y-4">
                  <div className="text-[11px] font-bold text-[#018790] opacity-60 italic">{artikel.date}</div>
                  <h3 className="text-xl font-bold text-[#005461] leading-snug group-hover:text-[#00B7B5] transition-colors">
                    {artikel.judul}
                  </h3>
                  <p className="text-sm text-slate-500 leading-relaxed line-clamp-3">
                    {artikel.ringkasan}
                  </p>
                  <div className="pt-4 flex items-center gap-2 text-[#00B7B5] font-bold text-xs uppercase tracking-wider group-hover:gap-4 transition-all">
                    Baca Selengkapnya <Icon path={mdiArrowRight} size={0.6} />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* FOOTER RISET */}
          <div className="mt-16 text-center" data-aos="zoom-in">
             <button className="px-8 py-4 border-2 border-[#005461] text-[#005461] rounded-xl font-bold hover:bg-[#005461] hover:text-white transition-all">
               Lihat Semua Publikasi Ilmiah
             </button>
          </div>

        </div>
      </section>




      {/* =========================================== */}
      {/* ================= EDUKASI ================= */}
      {/* =========================================== */}

      <section id="edukasi" className="py-24 px-6 relative overflow-hidden bg-white/10">

        <div className="absolute top-[-10%] left-[-5%] w-72 h-72 bg-[#26CCC2]/10 rounded-full blur-[100px] -z-10"></div>
        <div className="absolute bottom-[-10%] right-[-5%] w-96 h-96 bg-cyan-100/20 rounded-full blur-[120px] -z-10 animate-pulse"></div>
        
        <div className="max-w-7xl mx-auto">
          {/* HEADER */}
          <div className="text-center max-w-2xl mx-auto mb-20" data-aos="fade-up">
            <div className="inline-flex items-center gap-3 px-4 py-1.5 bg-white/40 backdrop-blur-md border border-white/60 rounded-full shadow-sm mb-6">
              <div className="w-1.5 h-1.5 bg-[#00B7B5] rounded-full"></div>
              <span className="text-[9px] font-semibold text-slate-500 uppercase tracking-[0.3em]">Health Literacy</span>
            </div>
            
            <h2 className="text-3xl lg:text-4xl font-semibold text-[#005461] mb-6 leading-tight tracking-tight">
              Pahami Gejala & <br /> 
              <span className="text-[#00B7B5]">Langkah Pencegahan</span>
            </h2>
            
            <p className="text-[15px] font-medium text-slate-500 leading-relaxed text-justify md:text-center">
              Edukasi adalah langkah pertama menuju hidup yang lebih sehat. Pelajari poin-poin penting mengenai manajemen risiko diabetes untuk masa depan yang lebih baik.
            </p>
          </div>

          {/* CARD EDUKASI */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                judul: "Deteksi Dini",
                desc: "Mengenali gejala awal seperti sering haus (polidipsia), sering buang air kecil, dan luka yang lambat sembuh.",
                icon: mdiWaterAlert,
                color: "#00B7B5"
              },
              {
                judul: "Pola Makan",
                desc: "Mengatur asupan karbohidrat kompleks, protein sehat, dan serat tinggi untuk menjaga stabilitas gula darah.",
                icon: mdiFoodApple,
                color: "#018790"
              },
              {
                judul: "Aktivitas Fisik",
                desc: "Rutin berolahraga minimal 150 menit per minggu untuk meningkatkan sensitivitas insulin dan metabolisme tubuh.",
                icon: mdiRunFast,
                color: "#005461"
              },
              {
                judul: "Kontrol Rutin",
                desc: "Melakukan pengecekan kadar gula darah secara berkala menggunakan teknologi Early Detection AI kami.",
                icon: mdiHeartPulse,
                color: "#26CCC2"
              }
            ].map((item, i) => (
              <div 
                key={i} 
                data-aos="fade-up" 
                data-aos-delay={i * 150}
                className="group bg-white/40 backdrop-blur-xl p-10 rounded-[3rem] border transition-all duration-500 border-white/80 shadow-[0_20px_40px_rgba(0,0,0,0.02)] flex flex-col items-center text-center hover:-translate-y-3 hover:bg-white/60 transition-all duration-500 ease-out cursor-default"
              >
                <div 
                  className="w-20 h-20 rounded-[2rem] flex items-center justify-center mb-8 transition-all duration-500 group-hover:rotate-[10deg] shadow-lg shadow-slate-200/50"
                  style={{ backgroundColor: `${item.color}10`, color: item.color }}
                >
                  <Icon path={item.icon} size={1.3} className="transition-transform duration-500 group-hover:scale-110" />
                </div>
                
                <h3 className="text-[17px] font-semibold text-[#005461] mb-4 tracking-tight">{item.judul}</h3>
                
                <p className="text-[13px] font-medium text-slate-500 leading-relaxed text-justify opacity-90">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>

          {/* BANNER */}
          <div 
            className="mt-20 bg-gradient-to-br from-[#005461] to-[#018790] rounded-[3.5rem] p-10 md:p-16 flex flex-col md:flex-row items-center justify-between gap-10 text-white relative overflow-hidden shadow-2xl shadow-[#005461]/20"
            data-aos="zoom-in-up"
          >

            <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-cyan-400/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>

            <div className="relative z-10 space-y-4 text-center md:text-left">
              <h4 className="text-3xl font-semibold tracking-tight">Ingin panduan lengkap?</h4>
              <p className="text-white/80 text-[15px] font-medium max-w-lg leading-relaxed italic">
                Unduh E-Book "Hidup Sehat Bersama Diabetes" yang disusun secara ilmiah oleh tim riset ITSB tanpa biaya.
              </p>
            </div>

            <button className="relative z-10 px-10 py-5 bg-[#00B7B5] hover:bg-white hover:text-[#005461] hover:scale-105 active:scale-95 transition-all duration-300 rounded-[2rem] font-bold uppercase tracking-[0.15em] text-[11px] shadow-xl shadow-black/10">
              Unduh Panduan Gratis
            </button>
          </div>
        </div>
      </section>


      {/* =========================================== */}
      {/* ================ CARA KERJA =============== */}
      {/* =========================================== */}

      <section id="cara-kerja" className="py-24 px-6 relative overflow-hidden bg-white/30">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[#26CCC2]/5 rounded-full blur-[120px] -z-10"></div>

        <div className="max-w-7xl mx-auto">
          
          {/* HEADER */}
          <div className="text-center mb-24" data-aos="fade-up">
            <div className="inline-flex items-center gap-3 px-4 py-1.5 bg-white/40 backdrop-blur-md border border-white/60 rounded-full shadow-sm mb-6">
              <div className="w-1.5 h-1.5 bg-[#00B7B5] rounded-full"></div>
              <span className="text-[9px] font-semibold text-slate-500 uppercase tracking-[0.3em]">Simple Process</span>
            </div>
            <h2 className="text-3xl lg:text-4xl font-semibold text-[#005461] tracking-tight leading-tight">
              Bagaimana <span className="text-[#00B7B5]">Early Detection AI</span> Bekerja?
            </h2>
          </div>

          {/* TIMELINE */}
          <div className="relative">
            <div className="hidden lg:block absolute top-[40%] left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-slate-200 to-transparent -z-10"></div>

            <div className="grid lg:grid-cols-3 gap-12 relative z-10">
              {[
                {
                  step: "01",
                  judul: "Input Data Medis",
                  desc: "Lengkapi data kesehatan harian Anda seperti usia, berat badan, lingkar pinggang, hingga hasil laboratorium kadar gula darah pada form digital yang tersedia.",
                  icon: mdiDatabaseSearchOutline
                },
                {
                  step: "02",
                  judul: "Analisis Kecerdasan Buatan",
                  desc: "Algoritma Machine Learning Random Forest kami memproses data secara instan di browser Anda menggunakan standar performa tinggi ONNX Runtime.",
                  icon: mdiAutoFix
                },
                {
                  step: "03",
                  judul: "Hasil & Rekomendasi",
                  desc: "Dapatkan interpretasi risiko diabetes secara transparan beserta saran tindakan medis preventif untuk menjaga kesehatan jangka panjang Anda.",
                  icon: mdiShieldCheckOutline
                }
              ].map((item, i) => (
                <div key={i} className="group relative" data-aos="fade-up" data-aos-delay={i * 200}>
                  {/* CARD */}
                  <div className="bg-white/40 backdrop-blur-xl border border-white/80 p-10 rounded-[3.5rem] transition-all duration-500 shadow-[0_15px_35px_rgba(0,0,0,0.02)] group-hover:shadow-2xl group-hover:shadow-[#00B7B5]/10 group-hover:-translate-y-4 flex flex-col items-center text-center h-full">
                    
                    {/* BADGE */}
                    <div className="absolute -top-5 left-1/2 -translate-x-1/2 w-12 h-12 bg-white shadow-xl rounded-2xl flex items-center justify-center text-[#00B7B5] font-bold text-lg group-hover:bg-[#00B7B5] group-hover:text-white transition-all duration-500 border border-slate-50">
                      {item.step}
                    </div>

                    {/* ICON */}
                    <div className="mt-4 mb-8 p-6 bg-[#00B7B5]/5 rounded-[2rem] text-[#00B7B5] group-hover:scale-110 group-hover:bg-[#00B7B5]/10 transition-all duration-500">
                      <Icon path={item.icon} size={1.8} />
                    </div>

                    <h3 className="text-[18px] font-semibold text-[#005461] mb-5 tracking-tight">
                      {item.judul}
                    </h3>
                    
                    <p className="text-[13px] font-medium text-slate-500 leading-relaxed text-justify opacity-90">
                      {item.desc}
                    </p>
                  </div>

                  {/* ARROW INDIKATOR */}
                  {i < 2 && (
                    <div className="hidden lg:flex absolute top-[35%] -right-8 z-20 text-slate-200 group-hover:text-[#00B7B5] transition-colors duration-500">
                      <Icon path={mdiChevronRight} size={1.5} />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* CTA SECTION */}
          <div className="mt-24 text-center" data-aos="zoom-in">
            <div className="inline-block p-1.5 bg-white/30 backdrop-blur-md rounded-[2.5rem] border border-white/60 shadow-lg">
              <Link 
                href="/analisis" 
                className="px-10 py-5 bg-[#005461] text-white rounded-[2rem] font-bold text-[11px] uppercase tracking-[0.2em] flex items-center gap-4 hover:bg-[#00B7B5] transition-all active:scale-95 shadow-xl shadow-[#005461]/20 group"
              >
                Mulai Analisis Sekarang 
                <Icon path={mdiChevronRight} size={0.7} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
            <div className="mt-8 flex items-center justify-center gap-2 text-slate-400">
              <Icon path={mdiInformationOutline} size={0.5} />
              <p className="text-[10px] font-medium">
                Privasi Terjamin. Data diproses secara lokal dan tidak memerlukan pendaftaran.
              </p>
            </div>
          </div>

        </div>
      </section>

      
      {/* =========================================== */}
      {/* ================== FOOTER ================= */}
      {/* =========================================== */}
      <footer className="bg-white border-t border-slate-100 pt-20 pb-10 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-16">
            
            
            {/* DESKRIPSI */}
            <div className="md:col-span-5 space-y-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-[#005461] rounded-xl shadow-lg shadow-[#005461]/20">
                  <Icon path={mdiShieldCheckOutline} size={1} className="text-[#26CCC2]" />
                </div>
                <span className="text-xl font-bold tracking-tight text-[#005461]">
                  Early Detection<span className="text-[#00B7B5]"> Diabetes</span>
                </span>
              </div>
              <p className="text-slate-500 text-sm leading-relaxed max-w-sm font-medium">
                Inovasi kesehatan digital berbasis kecerdasan buatan untuk mendukung deteksi dini risiko diabetes di Indonesia.
              </p>
            </div>


            {/* IDENTITAS AKADEMIK */}
            <div className="md:col-span-4 space-y-6">
              <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em]">Program & Fakultas</h4>
              <div className="space-y-4">
                <div className="group">
                  <p className="text-[11px] text-slate-400 font-medium">Program Studi</p>
                  <p className="text-sm font-bold text-[#005461] group-hover:text-[#00B7B5] transition-colors uppercase tracking-wider">
                    Sains Data
                  </p>
                </div>
                <div className="group">
                  <p className="text-[11px] text-slate-400 font-medium">Institut Teknologi Sains Bandung</p>
                  <p className="text-sm font-bold text-[#005461] group-hover:text-[#00B7B5] transition-colors uppercase tracking-wider">
                    Fakultas Digital, Desain, dan Bisnis
                  </p>
                </div>
              </div>
            </div>


            {/* NAVBAR BAWAH */}
            <div className="md:col-span-3 space-y-6">
              <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em]">Navigasi</h4>
              <ul className="space-y-3 text-sm font-bold text-slate-500 uppercase tracking-widest text-[11px]">
                <li><a href="#tentang" className="hover:text-[#00B7B5] transition-colors">Tentang</a></li>
                <li><a href="#riset" className="hover:text-[#00B7B5] transition-colors">Hasil Riset</a></li>
                <li><a href="#edukasi" className="hover:text-[#00B7B5] transition-colors">Edukasi</a></li>
                <li><Link href="/analisis" className="text-[#00B7B5]">Mulai Analisis</Link></li>
              </ul>
            </div>
          </div>
          

          {/* WM */}
          <div className="pt-10 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-4 grayscale opacity-40 hover:opacity-100 hover:grayscale-0 transition-all duration-500">
               <img src="/img/logo/itsb.png" alt="ITSB Logo" className="h-8 md:h-10 object-contain" />
            </div>
            
            <div className="text-center md:text-right">
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-1">
                © 2026 Early Detection Diabetes • All Rights Reserved
              </p>
              <p className="text-[12px] font-medium text-slate-500 italic">
                Created with ❤️ by <span className="text-[#005461] font-bold not-italic">INTUVIA</span>
              </p>
            </div>
          </div>
        </div>
      </footer>


      {/* BACK BUTTON */}
      <button
        onClick={handleBackToTop}
        className={`
          fixed bottom-8 right-8 z-[110] 
          w-14 h-14 rounded-full 
          bg-[#EBF4F6]/60 backdrop-blur-xl border border-white/80 
          shadow-[0_15px_35px_rgba(0,0,0,0.1)] 
          flex items-center justify-center 
          text-[#005461] hover:text-[#00B7B5] 
          transition-all duration-500 transform
          ${showScrollTop 
            ? "translate-y-0 opacity-100 visible scale-100" 
            : "translate-y-10 opacity-0 invisible scale-50"}
          active:scale-90 group
        `}
      >

        <div className="absolute inset-0 rounded-full bg-[#00B7B5]/10 scale-0 group-hover:scale-100 transition-transform duration-500"></div>
        
        <Icon 
          path={mdiArrowUp} 
          size={1.2} 
          className="relative z-10 group-hover:-translate-y-1 transition-transform" 
        />
      </button>

    </div> 
  );
}
