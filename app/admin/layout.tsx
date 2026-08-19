"use client";
import { useEffect, useState } from "react";
import Icon from '@mdi/react';
import { 
    mdiViewDashboard, 
    mdiNotebookEditOutline, 
    mdiHistory, 
    mdiLogout, 
    mdiShieldCheckOutline, 
    mdiEyeSettingsOutline,
    mdiMenu,
    mdiClose
} from '@mdi/js';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import AOS from 'aos';
import 'aos/dist/aos.css';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
  }, []);

  // SIDEBAR MOBILE
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  return (
    <div className="flex min-h-screen bg-[#f8fafc] font-[poppins] text-slate-700 overflow-hidden relative">
      
      <div className="fixed top-[-10%] left-[-10%] w-[40rem] h-[40rem] bg-cyan-200/20 rounded-full blur-[120px] animate-pulse pointer-events-none"></div>
      <div className="fixed bottom-[-10%] right-[-10%] w-[30rem] h-[30rem] bg-teal-200/10 rounded-full blur-[100px] pointer-events-none"></div>

      {/* BURGER ICON TAMPILAN MOBILE */}
      <div className="lg:hidden fixed top-6 right-6 z-[100]">
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="p-3 bg-white/60 backdrop-blur-xl border border-white/80 rounded-2xl shadow-xl text-[#005461] hover:scale-110 active:scale-95 transition-all"
        >
          <Icon path={isOpen ? mdiClose : mdiMenu} size={1} />
        </button>
      </div>

      {isOpen && (
        <div 
          className="fixed inset-0 bg-[#005461]/20 backdrop-blur-sm z-[60] lg:hidden"
          onClick={() => setIsOpen(false)}
        ></div>
      )}

      <aside className={`
        fixed lg:sticky top-0 left-0 h-screen z-[70]
        flex flex-col w-72 p-8
        bg-white/40 backdrop-blur-2xl border-r border-white/60
        transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>

        <div className="flex items-center gap-3 mb-16 px-2">
          <div className="bg-gradient-to-br from-[#005461] to-[#00B7B5] p-2.5 rounded-2xl shadow-lg shadow-[#00B7B5]/20">
            <Icon path={mdiShieldCheckOutline} size={1} className="text-white" />
          </div>
          <div className="leading-none text-[#005461]">
            <span className="font-bold text-sm uppercase tracking-tight">Intelligence</span>
            <p className="text-[10px] font-medium opacity-50 tracking-[0.2em] mt-1 uppercase">Diabetes AI</p>
          </div>
        </div>


        {/* NAVIGASI */}
        <nav className="flex-grow space-y-2">
          <SidebarLink href="/admin" icon={mdiViewDashboard} label="Overview" active={pathname === '/admin'} />
          <SidebarLink href="/admin/riset" icon={mdiNotebookEditOutline} label="Hasil Riset" active={pathname.startsWith('/admin/riset')} />
          <SidebarLink href="/admin/history" icon={mdiHistory} label="History Log" active={pathname === '/admin/history'} />
          <SidebarLink href="/admin/setting" icon={mdiEyeSettingsOutline} label="Model Settings" active={pathname === '/admin/settings'} />
        </nav>


        {/* LOGOUT */}
        <div className="mt-10 pt-6 border-t border-white/40">
            <button className="w-full flex items-center gap-4 p-4 text-slate-400 hover:text-rose-500 hover:bg-rose-50/50 rounded-2xl transition-all font-bold text-[10px] uppercase tracking-widest group">
              <Icon path={mdiLogout} size={0.7} className="group-hover:rotate-12 transition-transform" />
              <span>Sign Out</span>
            </button>
        </div>
      </aside>


      <main className={`
        flex-grow relative z-10 p-6 md:p-12 
        overflow-y-auto max-h-screen transition-all duration-500
        ${isOpen ? 'blur-sm lg:blur-0' : ''}
      `}>
        <div className="max-w-7xl mx-auto" data-aos="fade-in">
            {children}
        </div>
      </main>

    </div>
  );
}

// LHOVER
function SidebarLink({ href, icon, label, active }: any) {
  return (
    <Link 
      href={href} 
      className={`
        flex items-center gap-4 p-4 rounded-2xl transition-all duration-300 group
        ${active 
          ? 'bg-white/80 shadow-[0_10px_25px_-5px_rgba(0,183,181,0.15)] text-[#005461] border border-white translate-x-1' 
          : 'text-slate-400 hover:text-[#00B7B5] hover:bg-white/50 hover:translate-x-1'
        }
      `}
    >
      <div className={`
        transition-all duration-300 
        ${active ? 'scale-110 text-[#00B7B5]' : 'group-hover:scale-110'}
      `}>
        <Icon path={icon} size={0.8} />
      </div>
      <span className="font-bold text-[10px] uppercase tracking-[0.2em]">{label}</span>
      
      {active && (
        <div className="ml-auto w-1.5 h-1.5 bg-[#00B7B5] rounded-full shadow-[0_0_10px_#00B7B5]"></div>
      )}
    </Link>
  );
}