"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Icon from '@mdi/react';
import { 
  mdiDatabase, 
  mdiAlertCircle, 
  mdiCheckCircle, 
  mdiRefresh, 
  mdiChartDonut, 
  mdiFileExportOutline, 
  mdiGenderMale, 
  mdiGenderFemale, 
  mdiScale, 
  mdiRuler, 
  mdiTrendingUp, 
  mdiGenderTransgender,
  mdiChevronLeft,   // Icon baru untuk pagination
  mdiChevronRight   // Icon baru untuk pagination
} from '@mdi/js';

import { Doughnut, Bar, Line } from 'react-chartjs-2';
import { 
  Chart as ChartJS, 
  ArcElement, 
  Tooltip, 
  Legend, 
  CategoryScale, 
  LinearScale, 
  BarElement, 
  PointElement, 
  LineElement,
  Filler 
} from 'chart.js';

ChartJS.register(
  ArcElement, Tooltip, Legend, CategoryScale, 
  LinearScale, BarElement, PointElement, LineElement, Filler
);

export default function AdminOverview() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ total: 0, tinggi: 0, rendah: 0 });
  const [genderStats, setGenderStats] = useState({ male: 0, female: 0 });
  const [trendData, setTrendData] = useState<{labels: string[], values: number[]}>({ labels: [], values: [] });

  // STATE UNTUK PAGINATION
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const fetchData = async () => {
    setLoading(true);
    const { data: predictions, error } = await supabase
      .from('predictions')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && predictions) {
      setData(predictions);
      
      // DATA TINGGI RENDAH
      const tinggi = predictions.filter(x => String(x.prediction_result).trim() === "Tinggi").length;
      const rendah = predictions.filter(x => String(x.prediction_result).trim() === "Rendah").length;
      
      setStats({ 
        total: predictions.length, 
        tinggi: tinggi, 
        rendah: rendah 
      });

      // DATA JENIS KELAMIN
      const male = predictions.filter(x => Number(x.gender) === 0).length;
      const female = predictions.filter(x => Number(x.gender) === 1).length;
      setGenderStats({ male, female });

      // DATA PENGGUNAAN WEB APP
      const last7Days = [...Array(7)].map((_, i) => {
        const d = new Date();
        d.setDate(d.getDate() - i);
        return d.toISOString().split('T')[0];
      }).reverse();

      const counts = last7Days.map(date => 
        predictions.filter(p => p.created_at.startsWith(date)).length
      );
      setTrendData({ labels: last7Days.map(d => d.split('-').slice(1).reverse().join('/')), values: counts });
    }
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  // EKSPOR CSV
  const exportToCSV = () => {
    if (data.length === 0) return;
    const headers = ["Tanggal,Gender,Usia,BMI,Lingkar Pinggang,Gula Darah,Hasil AI,Probabilitas\n"];
    const rows = data.map(item => {
      const g = item.gender === 0 ? 'Laki-laki' : 'Perempuan';
      return `${new Date(item.created_at).toLocaleString()},${g},${item.age},${item.bmi},${item.waist},${item.glucose || '-'},${item.prediction_result},${(item.probability * 100).toFixed(2)}%\n`;
    });
    const blob = new Blob([headers + rows.join("")], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `data_diabetes_${new Date().getTime()}.csv`;
    a.click();
  };

  // LOGIKA PAGINATION
  const totalPages = Math.ceil(data.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentData = data.slice(startIndex, startIndex + itemsPerPage);

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  // CHART DATA TINGGI RENDAH
  const donutData = {
    labels: ['Tinggi', 'Rendah'],
    datasets: [{
      data: [stats.tinggi, stats.rendah],
      backgroundColor: ['#f43f5e', '#10b981'],
      borderWidth: 0,
      cutout: '75%',
      borderRadius: 15,
    }],
  };

  // CHART DATA JENIS KELAMIN
  const barData = {
    labels: ['Laki-laki', 'Perempuan'],
    datasets: [{
      data: [genderStats.male, genderStats.female],
      backgroundColor: ['#3b82f6', '#ec4899'],
      borderRadius: 10,
      barThickness: 35,
    }],
  };

  // CHART DATA PENGGUNAAN WEB APP
  const lineData = {
    labels: trendData.labels,
    datasets: [{
      label: 'Aktivitas Penggunaan Website',
      data: trendData.values,
      borderColor: '#00B7B5',
      backgroundColor: 'rgba(38, 204, 194, 0.1)',
      fill: true,
      tension: 0.4,
    }],
  };

  return (
    <div className="space-y-10 pb-20">
      {/* NAVBAR */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h2 className="text-3xl font-bold text-[#005461] tracking-tight">Dashboard</h2>
          <p className="text-slate-400 font-medium text-xs mt-1">Data Monitoring & Analytics</p>
        </div>
        <button onClick={fetchData} className="p-3 bg-white/60 backdrop-blur-md rounded-full text-[#00B7B5] shadow-sm">
          <Icon path={mdiRefresh} size={0.9} spin={loading} />
        </button>
      </div>

      {/* =========================================== */}
      {/* ================ CARD UTAMA =============== */}
      {/* =========================================== */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <StatCard label="Total Analisis" value={stats.total} icon={mdiDatabase} gradient="from-blue-500 to-cyan-400" />
        <StatCard label="Risiko Tinggi" value={stats.tinggi} icon={mdiAlertCircle} gradient="from-rose-500 to-pink-400" />
        <StatCard label="Kondisi Sehat" value={stats.rendah} icon={mdiCheckCircle} gradient="from-emerald-500 to-teal-400" />
      </div>
      
      {/* =========================================== */}
      {/* ================ DONUT CARD =============== */}
      {/* =========================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <ChartContainer title="Distribusi Risiko" icon={mdiChartDonut}>
          <div className="flex flex-col md:flex-row items-center justify-around w-full gap-6">
            <div className="relative w-44 h-44">
              {stats.total > 0 ? (
                <Doughnut data={donutData} options={{ maintainAspectRatio: false, plugins: { legend: { display: false } } }} />
              ) : <div className="w-full h-full rounded-full border-4 border-slate-100 border-dashed" />}
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-3xl font-bold text-[#005461]">{stats.total}</span>
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Entri</span>
              </div>
            </div>

            <div className="space-y-3 w-full max-w-45">
               <ChartLegend label="Tinggi" count={stats.tinggi} color="bg-rose-500" />
               <ChartLegend label="Rendah" count={stats.rendah} color="bg-emerald-500" />
            </div>
          </div>
        </ChartContainer>

        {/* =========================================== */}
        {/* ================ BAR CHART =============== */}
        {/* =========================================== */}
        <ChartContainer title="Jenis Kelamin" icon={mdiGenderTransgender}>
          <div className="w-full h-56 pt-2">
            <Bar data={barData} options={{ 
              maintainAspectRatio: false, 
              plugins: { legend: { display: false } },
              scales: { y: { beginAtZero: true, grid: { color: '#f1f5f9' } }, x: { grid: { display: false } } }
            }} />
          </div>
        </ChartContainer>
      </div>

      {/* =========================================== */}
      {/* ================ LINE CHART =============== */}
      {/* =========================================== */}
      <div className="w-full">
        <ChartContainer title="Aktivitas Penggunaan Web App Selama 7 Hari" icon={mdiTrendingUp}>
          <div className="w-full h-64 pt-4">
            <Line data={lineData} options={{ 
              maintainAspectRatio: false, 
              plugins: { legend: { display: false } },
              scales: { y: { beginAtZero: true, grid: { color: '#f1f5f9' } }, x: { grid: { display: false } } }
            }} />
          </div>
        </ChartContainer>
      </div>

      {/* =========================================== */}
      {/* ================== TABEL ================== */}
      {/* =========================================== */}
      <div className="bg-white/60 backdrop-blur-xl rounded-[3rem] border border-white/80 shadow-xl p-10 flex flex-col overflow-hidden">
        <div className="flex justify-between items-center mb-12">
            <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em]">Log Aktivitas Terbaru</h4>
            <button onClick={exportToCSV} className="flex items-center gap-3 px-8 py-3 bg-[#005461] text-white rounded-2xl text-[10px] font-bold uppercase tracking-widest shadow-lg shadow-[#005461]/20 transition-all">
              <Icon path={mdiFileExportOutline} size={0.7} /> Export CSV
            </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-separate border-spacing-y-4">
            <thead>
              <tr className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em]">
                <th className="px-6 pb-4 text-left">Profil</th>
                <th className="px-6 pb-4 text-left">Fisik (BMI/LP)</th>
                <th className="px-6 pb-4 text-left">Gula Darah</th>
                <th className="px-6 pb-4 text-center">Hasil AI</th>
              </tr>
            </thead>

            <tbody>
              {/* NOTE: Ubah data.map menjadi currentData.map */}
              {currentData.map((item) => (
                <tr key={item.id} className="group transition-all">
                  <td className="bg-white/40 group-hover:bg-white/80 border-y border-l border-white/50 px-6 py-6 rounded-l-4xl">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${item.gender === 0 ? 'bg-blue-50 text-blue-500' : 'bg-pink-50 text-pink-500'}`}>
                        <Icon path={item.gender === 0 ? mdiGenderMale : mdiGenderFemale} size={0.6} />
                      </div>
                      <span className="text-sm font-bold text-[#005461]">{item.age} Thn</span>
                    </div>
                  </td>

                  <td className="bg-white/40 group-hover:bg-white/80 border-y border-white/50 px-6 py-6 text-sm font-medium text-slate-500">
                    <div className="flex flex-col gap-1">
                      <span className="font-bold text-slate-600">{item.bmi?.toFixed(1)} BMI</span>
                      <span className="text-[10px] opacity-80">{item.waist} cm LP</span>
                    </div>
                  </td>
                  
                  <td className="bg-white/40 group-hover:bg-white/80 border-y border-white/50 px-6 py-6 text-sm font-bold text-[#005461]">
                    {item.glucose ? `${item.glucose} mg/dL` : '-'}
                  </td>

                  <td className="bg-white/40 group-hover:bg-white/80 border-y border-r border-white/50 px-6 py-6 rounded-r-4xl text-center">
                    <div className="flex flex-col items-center gap-1">
                      <span className={`px-5 py-1.5 rounded-xl text-[9px] font-bold uppercase tracking-widest transition-all
                        ${String(item.prediction_result).trim() === "Tinggi" 
                          ? "bg-rose-500 text-white border-rose-600 shadow-md shadow-rose-200" 
                          : "bg-emerald-500 text-white border-emerald-600 shadow-md shadow-emerald-200"
                        }`}>
                        {item.prediction_result}
                      </span>
                      <span className="text-[10px] font-medium text-slate-500">{(item.probability * 100).toFixed(0)}%</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* =========================================== */}
        {/* ======== UI CONTROLS PAGINATION =========== */}
        {/* =========================================== */}
        <div className="flex justify-between items-center mt-6 pt-6 border-t border-white/40 px-2">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">
            Menampilkan {data.length > 0 ? startIndex + 1 : 0} - {Math.min(startIndex + itemsPerPage, data.length)} dari {data.length} Data
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrevPage}
              disabled={currentPage === 1}
              className="p-2 bg-white/40 backdrop-blur-md rounded-2xl border border-white/70 text-[#005461] hover:bg-white hover:shadow-lg hover:-translate-y-0.5 disabled:opacity-40 disabled:hover:translate-y-0 disabled:cursor-not-allowed transition-all"
            >
              <Icon path={mdiChevronLeft} size={0.8} />
            </button>
            
            <div className="px-5 py-2 bg-white/40 backdrop-blur-md rounded-2xl border border-white/70 text-[10px] font-bold uppercase tracking-widest text-[#005461]">
              Hal {currentPage} / {totalPages || 1}
            </div>

            <button
              onClick={handleNextPage}
              disabled={currentPage === totalPages || totalPages === 0}
              className="p-2 bg-white/40 backdrop-blur-md rounded-2xl border border-white/70 text-[#005461] hover:bg-white hover:shadow-lg hover:-translate-y-0.5 disabled:opacity-40 disabled:hover:translate-y-0 disabled:cursor-not-allowed transition-all"
            >
              <Icon path={mdiChevronRight} size={0.8} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// User Inteface
function ChartContainer({ title, icon, children }: any) {
  return (
    <div className="bg-white/60 backdrop-blur-xl p-8 rounded-[3rem] border border-white/80 shadow-xl flex flex-col min-h-87.5">
      <div className="w-full flex justify-between items-center mb-6 px-2">
        <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">{title}</h4>
        <Icon path={icon} size={0.7} className="text-[#00B7B5]" />
      </div>
      <div className="grow flex items-center justify-center">
        {children}
      </div>
    </div>
  );
}

function StatCard({ label, value, icon, gradient }: any) {
  return (
    <div className="bg-white/60 backdrop-blur-xl p-8 rounded-[3rem] border border-white shadow-xl flex items-center gap-8 group">
      <div className={`p-5 bg-linear-to-tr ${gradient} text-white rounded-4xl shadow-lg group-hover:rotate-12 transition-all`}>
        <Icon path={icon} size={1.2} />
      </div>
      <div>
        <p className="text-[10px] font-bold opacity-50 uppercase tracking-[0.2em] mb-1 font-[poppins]">{label}</p>
        <h3 className="text-3xl font-bold text-[#005461] tracking-tighter leading-none">{value}</h3>
      </div>
    </div>
  );
}

function ChartLegend({ label, count, color }: any) {
  return (
    <div className="flex items-center justify-between px-6 py-3 bg-white/30 rounded-2xl border border-white/50 w-full">
      <div className="flex items-center gap-3">
        <div className={`w-2 h-2 ${color} rounded-full`}></div>
        <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest">{label}</span>
      </div>
      <span className="text-sm font-bold text-[#005461]">{count}</span>
    </div>
  );
}