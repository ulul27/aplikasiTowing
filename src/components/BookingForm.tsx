"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Navigation, Info, ArrowRight, Loader2, Search } from "lucide-react";
import citiesData from "@/data/cities.json";

// Mock Map data
const MOCK_LOCATIONS = citiesData;

const VEHICLE_TYPES = [
  { id: "motor_kecil", label: "Motor Kecil (< 150cc)", fee: 0 },
  { id: "motor_besar", label: "Motor Besar (> 150cc)", fee: 50000 },
  { id: "mobil_kecil", label: "Mobil Kecil (City Car/Hatchback)", fee: 100000 },
  { id: "mobil_besar", label: "Mobil Besar (SUV/MPV)", fee: 150000 },
  { id: "mesin_industri", label: "Mesin Industri", fee: 500000 },
  { id: "alat_berat", label: "Alat Berat (Excavator, Buldozer, dll)", fee: 1000000 },
];

const BASE_PRICE = 150000;
const PRICE_PER_KM = 150000;

// Haversine formula to calculate distance in km
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371; // Radius of the earth in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * 
    Math.sin(dLon / 2) * Math.sin(dLon / 2); 
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)); 
  return R * c; // Distance in km
}

// Reusable Searchable Dropdown
function LocationSelect({ label, icon: Icon, value, onChange, placeholder, iconColorClass }: any) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) setIsOpen(false);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const filtered = MOCK_LOCATIONS.filter(l => l.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="relative" ref={dropdownRef}>
      <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
        <div className={`w-6 h-6 rounded-full flex items-center justify-center ${iconColorClass}`}>
          <Icon size={14} />
        </div>
        {label}
      </label>
      <div 
        className={`w-full bg-slate-800 border rounded-lg px-4 py-3 text-white cursor-pointer flex justify-between items-center transition-colors ${isOpen ? 'border-primary-500' : 'border-slate-700 hover:border-slate-500'}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className={value ? "text-white truncate" : "text-slate-500"}>{value ? value.name : placeholder}</span>
        <Search size={16} className="text-slate-500 shrink-0 ml-2" />
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.15 }}
            className="absolute z-50 mt-2 w-full bg-slate-800/95 backdrop-blur-xl border border-slate-700 rounded-xl shadow-2xl overflow-hidden"
          >
            <div className="p-2 border-b border-slate-700 bg-slate-900/50">
              <input 
                type="text" 
                autoFocus
                placeholder="Ketik nama kota..." 
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full bg-slate-900/80 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-primary-500"
              />
            </div>
            <div className="max-h-56 overflow-y-auto p-2 space-y-1 scrollbar-thin scrollbar-thumb-slate-600 scrollbar-track-transparent">
              {filtered.length > 0 ? filtered.map(loc => (
                <div 
                  key={loc.id}
                  onClick={() => { onChange(loc); setIsOpen(false); setSearch(""); }}
                  className="px-3 py-2.5 text-sm text-slate-300 hover:bg-primary-500/20 hover:text-white rounded-lg cursor-pointer transition-colors truncate"
                >
                  {loc.name}
                </div>
              )) : (
                <div className="px-3 py-6 text-center text-sm text-slate-500">Kota tidak ditemukan</div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function BookingForm() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: "",
    itemType: "",
    pickup: null as any,
    dropoff: null as any,
  });

  const [isCalculating, setIsCalculating] = useState(false);
  const [distance, setDistance] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    if (formData.pickup && formData.dropoff) {
      setIsCalculating(true);
      setTimeout(() => {
        const dist = calculateDistance(
          formData.pickup.lat, formData.pickup.lng,
          formData.dropoff.lat, formData.dropoff.lng
        );
        const roundedDist = Math.round(dist * 10) / 10;
        setDistance(roundedDist);

        const typeFee = VEHICLE_TYPES.find(v => v.id === formData.itemType)?.fee || 0;
        const distCost = roundedDist * PRICE_PER_KM;
        
        setTotalPrice(BASE_PRICE + typeFee + distCost);
        setIsCalculating(false);
      }, 800);
    }
  }, [formData.pickup, formData.dropoff, formData.itemType]);

  const handleNext = () => {
    if (step === 1 && formData.name && formData.itemType) setStep(2);
    if (step === 2 && formData.pickup && formData.dropoff) setStep(3);
  };

  const handleBook = () => {
    const adminPhone = "6285740004600";
    const typeLabel = VEHICLE_TYPES.find(v => v.id === formData.itemType)?.label;
    
    const text = `Halo Admin TowingPro,
Saya ingin memesan jasa towing dengan detail:

Nama: ${formData.name}
Jenis Kendaraan: ${typeLabel}
Lokasi Jemput: ${formData.pickup?.name}
Lokasi Antar: ${formData.dropoff?.name}
Jarak: ${distance} km
Total Harga: Rp ${totalPrice.toLocaleString("id-ID")}

Mohon info untuk pembayaran, terima kasih.`;

    const encodedText = encodeURIComponent(text);
    window.open(`https://wa.me/${adminPhone}?text=${encodedText}`, "_blank");
  };

  return (
    <div className="glass-card rounded-3xl p-8 relative overflow-visible">
      {/* Decorative gradient */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500/10 blur-[80px] rounded-full pointer-events-none" />

      <h2 className="text-2xl font-bold text-white mb-6">Pesan Jasa Towing</h2>
      
      {/* Step Indicators */}
      <div className="flex gap-2 mb-8">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex-1 h-1.5 rounded-full bg-slate-800 overflow-hidden">
            <motion.div 
              className="h-full bg-primary-500"
              initial={{ width: 0 }}
              animate={{ width: step >= i ? "100%" : "0%" }}
              transition={{ duration: 0.3 }}
            />
          </div>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div 
            key="step1"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="space-y-5"
          >
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Nama Pemesan</label>
              <input 
                type="text" 
                placeholder="Masukkan nama Anda"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Jenis Kendaraan / Barang</label>
              <div className="grid gap-3">
                {VEHICLE_TYPES.map(type => (
                  <button
                    key={type.id}
                    onClick={() => setFormData({...formData, itemType: type.id})}
                    className={`flex items-center justify-between px-4 py-3 rounded-xl border text-left transition-all ${
                      formData.itemType === type.id 
                        ? "bg-primary-500/10 border-primary-500 text-white" 
                        : "bg-slate-900/50 border-slate-700 text-slate-300 hover:border-slate-500"
                    }`}
                  >
                    <span>{type.label}</span>
                    {type.fee > 0 && <span className="text-xs text-slate-400">+ Rp {type.fee.toLocaleString('id-ID')}</span>}
                  </button>
                ))}
              </div>
            </div>

            <button 
              onClick={handleNext}
              disabled={!formData.name || !formData.itemType}
              className="w-full bg-primary-500 text-white rounded-xl py-3.5 font-bold mt-4 flex items-center justify-center gap-2 hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              Lanjutkan <ArrowRight size={18} />
            </button>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div 
            key="step2"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="space-y-5"
          >
            <div className="bg-slate-900/50 border border-slate-700 rounded-xl p-5 relative">
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 pointer-events-none rounded-xl"></div>
              
              <div className="relative space-y-6">
                <LocationSelect 
                  label="Titik Jemput"
                  icon={MapPin}
                  iconColorClass="bg-blue-500/20 text-blue-400"
                  placeholder="Pilih lokasi penjemputan..."
                  value={formData.pickup}
                  onChange={(val: any) => setFormData({...formData, pickup: val})}
                />

                <div className="relative pl-3">
                  <div className="absolute left-[11px] top-[-16px] bottom-[16px] w-[2px] bg-dashed border-l-2 border-slate-700 border-dashed"></div>
                </div>

                <LocationSelect 
                  label="Titik Antar"
                  icon={Navigation}
                  iconColorClass="bg-primary-500/20 text-primary-500"
                  placeholder="Pilih tujuan pengantaran..."
                  value={formData.dropoff}
                  onChange={(val: any) => setFormData({...formData, dropoff: val})}
                />
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button 
                onClick={() => setStep(1)}
                className="w-1/3 bg-slate-800 text-white rounded-xl py-3.5 font-bold hover:bg-slate-700 transition-all"
              >
                Kembali
              </button>
              <button 
                onClick={handleNext}
                disabled={!formData.pickup || !formData.dropoff}
                className="w-2/3 bg-primary-500 text-white rounded-xl py-3.5 font-bold flex items-center justify-center gap-2 hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                Kalkulasi Harga <ArrowRight size={18} />
              </button>
            </div>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div 
            key="step3"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="space-y-6"
          >
            {isCalculating ? (
              <div className="flex flex-col items-center justify-center py-10 space-y-4">
                <Loader2 className="w-10 h-10 text-primary-500 animate-spin" />
                <p className="text-slate-400">Menghitung jarak dan harga...</p>
              </div>
            ) : (
              <>
                <div className="bg-slate-900/50 border border-slate-700 rounded-xl p-5 space-y-4">
                  <div className="flex justify-between items-center pb-4 border-b border-slate-800">
                    <span className="text-slate-400">Jarak Tempuh</span>
                    <span className="text-xl font-bold text-white">{distance} km</span>
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Tarif Dasar</span>
                      <span className="text-white">Rp {BASE_PRICE.toLocaleString('id-ID')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Biaya Kendaraan</span>
                      <span className="text-white">Rp {(VEHICLE_TYPES.find(v => v.id === formData.itemType)?.fee || 0).toLocaleString('id-ID')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Tarif Jarak ({distance} km)</span>
                      <span className="text-white">Rp {(distance * PRICE_PER_KM).toLocaleString('id-ID')}</span>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-800 flex justify-between items-center">
                    <span className="font-medium text-slate-300">Total Pembayaran</span>
                    <span className="text-2xl font-black text-primary-400">Rp {totalPrice.toLocaleString('id-ID')}</span>
                  </div>
                </div>

                <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4 flex gap-3 text-blue-200 text-sm">
                  <Info className="shrink-0 mt-0.5" size={18} />
                  <p>Pesanan akan dikonfirmasi melalui WhatsApp. Mohon siapkan pembayaran via Transfer Bank.</p>
                </div>

                <div className="flex gap-3 mt-6">
                  <button 
                    onClick={() => setStep(2)}
                    className="w-1/3 bg-slate-800 text-white rounded-xl py-3.5 font-bold hover:bg-slate-700 transition-all"
                  >
                    Ubah
                  </button>
                  <button 
                    onClick={handleBook}
                    className="w-2/3 bg-green-500 text-white rounded-xl py-3.5 font-bold flex items-center justify-center gap-2 hover:bg-green-600 transition-all shadow-lg shadow-green-500/20"
                  >
                    Pesan via WhatsApp
                  </button>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
