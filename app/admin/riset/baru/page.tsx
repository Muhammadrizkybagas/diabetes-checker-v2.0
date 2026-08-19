"use client";
import { useState, useRef } from "react";
import { supabase } from "@/lib/supabase";
import Icon from '@mdi/react';
import { 
  mdiFormatBold, 
  mdiFormatItalic, 
  mdiFormatListNumbered, 
  mdiFormatListBulleted, 
  mdiImagePlus, 
  mdiChevronLeft, 
  mdiCloudUploadOutline, 
  mdiFormatAlignLeft,
  mdiFormatAlignCenter, 
  mdiFormatAlignRight, 
  mdiCloseCircle,
  mdiFormatUnderline, 
  mdiPublish, 
  mdiContentSave, 
  mdiFormatAlignJustify
} from '@mdi/js';

import { useRouter } from 'next/navigation';

export default function CreateResearch() {
  const router = useRouter();
  const editorRef = useRef<HTMLDivElement>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [charCount, setCharCount] = useState(0);
  const [form, setForm] = useState({
    judul: '',
    highlight_tag: '',
    status: 'Pending',
    kategori: 'Edukasi Kesehatan',
    cover_url: ''
  });

  const execCommand = (command: string, value: string = "") => {
    document.execCommand(command, false, value);
    editorRef.current?.focus();
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
        setForm({ ...form, cover_url: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async (status: string) => {
    const content = editorRef.current?.innerHTML || "";
    if (!form.judul || content === "") {
      alert("Lengkapi judul dan isi riset terlebih dahulu!");
      return;
    }

    const { error } = await supabase.from('riset').insert([{ ...form, konten: content, status }]);
    if (!error) router.push('/admin/riset');
    else alert("Error: " + error.message);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-20" data-aos="fade-up">
      {/* HEADER */}
      <div className="flex justify-between items-center bg-white/40 backdrop-blur-md p-4 rounded-3xl border border-white/60 shadow-sm">
        <button onClick={() => router.back()} className="flex items-center gap-2 text-slate-500 hover:text-[#005461] transition-all cursor-pointer font-bold text-[10px] uppercase tracking-widest ml-2">
          <Icon path={mdiChevronLeft} size={0.8} /> Kembali
        </button>
        <div className="flex gap-2">
          <button onClick={() => handleSave('Pending')} className="flex items-center gap-2 px-5 py-2.5 bg-white text-slate-500 rounded-xl text-[10px] font-bold uppercase tracking-widest border border-slate-200 cursor-pointer hover:bg-slate-50 transition-all">
            <Icon path={mdiContentSave} size={0.6} /> Draft
          </button>
          <button onClick={() => handleSave('Publikasi')} className="flex items-center gap-2 px-6 py-2.5 bg-[#005461] text-[#26CCC2] rounded-xl text-[10px] font-bold uppercase tracking-widest shadow-lg shadow-[#005461]/20 cursor-pointer hover:scale-105 transition-all">
            <Icon path={mdiPublish} size={0.6} /> Publish
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* KOLOM KIRI */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-white/60 backdrop-blur-xl rounded-[2.5rem] border border-white/80 shadow-xl overflow-hidden">
            
            {/* LIVE PREVIEW */}
            <div className="relative h-48 bg-slate-100/50 flex items-center justify-center border-b border-white/50 group">
              {imagePreview ? (
                <>
                  <img src={imagePreview} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <label className="p-3 bg-white rounded-full text-[#005461] cursor-pointer hover:scale-110 transition-all shadow-xl">
                      <Icon path={mdiCloudUploadOutline} size={1} />
                      <input type="file" className="hidden" onChange={handleImageChange} accept="image/*" />
                    </label>
                    <button onClick={() => setImagePreview(null)} className="p-3 bg-white text-rose-500 rounded-full cursor-pointer hover:scale-110 transition-all shadow-xl">
                      <Icon path={mdiCloseCircle} size={1} />
                    </button>
                  </div>
                </>
              ) : (
                <label className="cursor-pointer flex flex-col items-center gap-2 group/btn">
                  <div className="p-4 bg-white rounded-2xl text-slate-400 group-hover/btn:text-[#00B7B5] transition-all shadow-sm">
                    <Icon path={mdiImagePlus} size={1.2} />
                  </div>
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em]">Pilih Cover Artikel</span>
                  <input type="file" className="hidden" onChange={handleImageChange} accept="image/*" />
                </label>
              )}
            </div>

            {/* EDITOR CONTENT */}
            <div className="p-8 md:p-12 space-y-6">
              <input 
                type="text" 
                placeholder="Judul Publikasi Riset..."
                className="w-full bg-transparent text-3xl font-bold text-[#005461] outline-none placeholder:text-slate-200 tracking-tight cursor-text"
                onChange={(e) => setForm({...form, judul: e.target.value})}
              />

              {/* TOOL BAR CONTENT */}
              <div className="flex flex-wrap items-center gap-1 p-1.5 bg-slate-100/50 rounded-2xl border border-slate-200/50 sticky top-4 z-20 backdrop-blur-md w-fit">
                <ToolbarBtn onClick={() => execCommand('bold')} icon={mdiFormatBold} />
                <ToolbarBtn onClick={() => execCommand('italic')} icon={mdiFormatItalic} />
                <ToolbarBtn onClick={() => execCommand('underline')} icon={mdiFormatUnderline} />
                <div className="w-[1px] h-4 bg-slate-300 mx-1"></div>
                <ToolbarBtn onClick={() => execCommand('justifyLeft')} icon={mdiFormatAlignLeft} />
                <ToolbarBtn onClick={() => execCommand('justifyCenter')} icon={mdiFormatAlignCenter} />
                <ToolbarBtn onClick={() => execCommand('justifyFull')} icon={mdiFormatAlignJustify} />
                <ToolbarBtn onClick={() => execCommand('justifyRight')} icon={mdiFormatAlignRight} />
                <div className="w-[1px] h-4 bg-slate-300 mx-1"></div>
                <ToolbarBtn onClick={() => execCommand('insertUnorderedList')} icon={mdiFormatListBulleted} />
                <ToolbarBtn onClick={() => execCommand('insertOrderedList')} icon={mdiFormatListNumbered} />
              </div>


              <div 
                ref={editorRef}
                contentEditable
                onInput={(e) => setCharCount(e.currentTarget.innerText.length)}
                className="editor-content w-full min-h-[400px] outline-none text-slate-600 text-md leading-relaxed cursor-text"
              ></div>
            </div>
          </div>
        </div>

        {/* KOLOM KANAN */}
        <div className="lg:col-span-4 space-y-6 sticky top-6">
          <div className="bg-white/60 backdrop-blur-xl p-8 rounded-[2.5rem] border border-white/80 shadow-xl">
            <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-6">Informasi Tambahan</h4>
            <div className="space-y-5">
              <div>
                <label className="text-[9px] font-bold text-slate-400 block mb-2 uppercase tracking-widest">Tag Highlight</label>
                <input 
                  type="text" 
                  placeholder="Misal: EDUKASI"
                  className="w-full p-3.5 bg-white/50 border border-white rounded-xl text-xs font-bold text-[#005461] outline-none shadow-sm cursor-text focus:bg-white transition-all"
                  onChange={(e) => setForm({...form, highlight_tag: e.target.value})}
                />
              </div>
              <div>
                <label className="text-[9px] font-bold text-slate-400 block mb-2 uppercase tracking-widest">Kategori</label>
                <select 
                  className="w-full p-3.5 bg-white/50 border border-white rounded-xl text-xs font-bold text-[#005461] outline-none cursor-pointer appearance-none"
                  onChange={(e) => setForm({...form, kategori: e.target.value})}
                >
                  <option>Edukasi Kesehatan</option>
                  <option>Hasil Penelitian</option>
                  <option>Statistik Medis</option>
                </select>
              </div>
              <div className="pt-4 flex justify-between text-[9px] font-bold text-slate-300 uppercase">
                <span>{charCount} Karakter</span>
                <span>~{Math.ceil(charCount / 800)} Min Baca</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        .editor-content ul { list-style-type: disc; padding-left: 2rem; margin-bottom: 1rem; }
        .editor-content ol { list-style-type: decimal; padding-left: 2rem; margin-bottom: 1rem; }
        .editor-content li { margin-bottom: 0.25rem; }
        .editor-content:empty:before { content: 'Mulai menulis riset di sini...'; color: #cbd5e1; }
      `}</style>
    </div>
  );
}

function ToolbarBtn({ onClick, icon }: any) {
  return (
    <button onClick={onClick} className="p-2 hover:bg-white hover:text-[#00B7B5] text-slate-500 rounded-lg transition-all cursor-pointer">
      <Icon path={icon} size={0.6} />
    </button>
  );
}