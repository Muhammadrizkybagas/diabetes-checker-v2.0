"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Icon from '@mdi/react';
import { 
  mdiPlus, 
  mdiTrashCanOutline, 
  mdiEyeOutline, 
  mdiCircle, 
  mdiPencilOutline,
  mdiTextBoxSearchOutline,
  mdiFileDocumentEditOutline
} from '@mdi/js';
import Link from 'next/link';

export default function RisetManagement() {
  const [research, setResearch] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchResearch();
  }, []);

  const fetchResearch = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('riset')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (!error && data) setResearch(data);
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Hapus artikel ini secara permanen?")) {
      await supabase.from('riset').delete().eq('id', id);
      fetchResearch();
    }
  };

  return (
    <div className="space-y-10" data-aos="fade-up">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h2 className="text-3xl font-bold text-[#005461] tracking-tight">Research Management</h2>
          <p className="text-slate-400 font-medium text-xs mt-1">Kelola publikasi, draft, dan statistik pembaca riset Anda.</p>
        </div>
        
        <Link href="/admin/riset/baru" className="flex items-center gap-3 px-8 py-4 bg-[#005461] text-[#26CCC2] rounded-2xl text-[11px] font-bold uppercase tracking-widest shadow-xl shadow-[#005461]/20 hover:scale-105 transition-all">
          <Icon path={mdiPlus} size={0.7} /> Tulis Artikel Baru
        </Link>
      </div>



      {/* =========================================== */}
      {/* ======= TOTAL PUBLIKASI DAN STATUS ======== */}
      {/* =========================================== */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white/40 backdrop-blur-md p-4 rounded-2xl border border-white/60">
           <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Total Publikasi</p>
           <p className="text-xl font-bold text-[#005461]">{research.filter(r => r.status === 'Publikasi').length}</p>
        </div>
        <div className="bg-white/40 backdrop-blur-md p-4 rounded-2xl border border-white/60">
           <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Draft / Pending</p>
           <p className="text-xl font-bold text-amber-500">{research.filter(r => r.status === 'Pending').length}</p>
        </div>
      </div>


      {/* =========================================== */}
      {/* ================== TABEL ================== */}
      {/* =========================================== */}
      <div className="bg-white/60 backdrop-blur-xl rounded-[3rem] border border-white/80 shadow-xl p-10">
        <div className="overflow-x-auto">
          <table className="w-full border-separate border-spacing-y-4">
            <thead>
              <tr className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em]">
                <th className="px-8 pb-4 text-left font-bold">Informasi Artikel</th>
                <th className="px-8 pb-4 text-center">Status</th>
                <th className="px-8 pb-4 text-center">Views</th>
                <th className="px-8 pb-4 text-center">Aksi</th>
              </tr>
            </thead>

            <tbody>
              {research.map((item) => (
                <tr key={item.id} className="group transition-all">
                  {/* KOLOM JUDUL & BADGE */}
                  <td className="bg-white/40 group-hover:bg-white/80 backdrop-blur-sm border-y border-l border-white/50 px-8 py-6 rounded-l-[2.5rem]">
                    <div className="flex flex-col gap-1">
                      <span className="text-[9px] font-bold text-[#00B7B5] bg-[#00B7B5]/10 px-2 py-0.5 rounded flex items-center gap-1 w-fit mb-1 italic uppercase tracking-widest">
                        {item.highlight_tag || 'HIGHLIGHT'}
                      </span>
                      <h5 className="font-bold text-[#005461] text-sm line-clamp-1">{item.judul}</h5>
                      <p className="text-[10px] text-slate-400 font-medium uppercase tracking-tighter">
                        {new Date(item.created_at).toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' })}
                      </p>
                    </div>
                  </td>


                  {/* KOLOM STATUS */}
                  <td className="bg-white/40 group-hover:bg-white/80 backdrop-blur-sm border-y border-white/50 px-8 py-6 text-center">
                    <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[9px] font-bold uppercase tracking-widest border ${
                      item.status === 'Publikasi' 
                      ? 'bg-emerald-50 text-emerald-500 border-emerald-100' 
                      : 'bg-amber-50 text-amber-500 border-amber-100'
                    }`}>
                      <Icon path={mdiCircle} size={0.3} />
                      {item.status}
                    </div>
                  </td>


                  {/* KOLOM VIEWS */}
                  <td className="bg-white/40 group-hover:bg-white/80 backdrop-blur-sm border-y border-white/50 px-8 py-6 text-center font-bold text-[#005461]">
                    <div className="flex items-center justify-center gap-1">
                      <Icon path={mdiEyeOutline} size={0.6} className="opacity-40" />
                      <span className="text-sm tracking-tighter">{item.views || 0}</span>
                    </div>
                  </td>


                  {/* KOLOM AKSI */}
                  <td className="bg-white/40 group-hover:bg-white/80 backdrop-blur-sm border-y border-r border-white/50 px-8 py-6 rounded-r-[2.5rem] text-center">
                    <div className="flex items-center justify-center gap-3">
                    <Link href={`/admin/riset/edit/${item.id}`} className="p-3 bg-white text-slate-400 hover:text-[#00B7B5] rounded-xl transition-all shadow-sm">
                    <Icon path={mdiPencilOutline} size={0.6} />
                    </Link>
                      <button 
                        onClick={() => handleDelete(item.id)}
                        className="p-3 bg-white text-slate-400 hover:text-rose-500 rounded-xl transition-all shadow-sm"
                      >
                        <Icon path={mdiTrashCanOutline} size={0.6} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {research.length === 0 && !loading && (
            <div className="text-center py-20">
              <Icon path={mdiTextBoxSearchOutline} size={2} className="mx-auto text-slate-200 mb-4" />
              <p className="text-slate-400 text-xs italic">Belum ada riset yang dibuat.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}