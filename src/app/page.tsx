import BookingForm from "@/components/BookingForm";
import { Truck, ShieldCheck, Clock, MapPin } from "lucide-react";

export default function Home() {
  return (
    <main className="flex-1 flex flex-col relative overflow-hidden">
      {/* Background glowing effects */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary-500/20 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-blue-500/10 blur-[100px] rounded-full pointer-events-none" />

      {/* Navbar Placeholder */}
      <nav className="w-full border-b border-white/5 glass sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-primary-500 rounded-xl flex items-center justify-center text-white font-bold shadow-lg shadow-primary-500/30">
              <Truck size={24} />
            </div>
            <span className="text-xl font-bold tracking-tight text-white">Towing<span className="text-primary-500">Pro</span></span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
            <a href="#" className="hover:text-white transition-colors">Layanan</a>
            <a href="#" className="hover:text-white transition-colors">Armada</a>
            <a href="#" className="hover:text-white transition-colors">Testimoni</a>
            <a href="#pesan" className="bg-primary-500 hover:bg-primary-600 text-white px-5 py-2.5 rounded-full transition-all shadow-lg shadow-primary-500/20">
              Pesan Sekarang
            </a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-24 pb-16 md:pt-32 md:pb-24 px-6 relative z-10">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
          <div className="flex flex-col gap-6 animate-fade-in">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass border-primary-500/30 text-primary-400 text-sm font-medium w-fit">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary-500"></span>
              </span>
              Layanan 24/7 Tersedia
            </div>
            <h1 className="text-5xl md:text-7xl font-bold text-white leading-[1.1] tracking-tight">
              Solusi Cepat <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-primary-600">
                Towing Darurat
              </span>
            </h1>
            <p className="text-lg md:text-xl text-slate-400 max-w-xl leading-relaxed">
              Layanan derek dan angkut kendaraan profesional. Tarif transparan, armada terawat, dan siap melayani Anda kapan pun, di mana pun.
            </p>
            
            <div className="flex flex-wrap items-center gap-6 mt-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full glass flex items-center justify-center text-primary-400">
                  <Clock size={24} />
                </div>
                <div>
                  <div className="font-bold text-white">Respon Cepat</div>
                  <div className="text-sm text-slate-400">Tiba &lt; 30 menit</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full glass flex items-center justify-center text-primary-400">
                  <ShieldCheck size={24} />
                </div>
                <div>
                  <div className="font-bold text-white">Aman & Berasuransi</div>
                  <div className="text-sm text-slate-400">Perlindungan 100%</div>
                </div>
              </div>
            </div>
          </div>

          <div id="pesan" className="lg:ml-auto w-full max-w-lg animate-slide-up">
            <BookingForm />
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="mt-auto border-t border-white/5 py-8 text-center text-slate-500 text-sm">
        &copy; {new Date().getFullYear()} TowingPro. All rights reserved.
      </footer>
    </main>
  );
}
