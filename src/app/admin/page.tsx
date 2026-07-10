import { cookies } from "next/headers";
import { Lock, LogOut, Search, MapPin, Truck } from "lucide-react";
import { redirect } from "next/navigation";

// MOCK DATA
const MOCK_ORDERS = [
  {
    id: "ORD-001",
    name: "Budi Santoso",
    type: "Mobil Kecil (City Car)",
    pickup: "Jakarta Pusat",
    dropoff: "Bekasi",
    distance: 14.5,
    total: 2425000,
    status: "Menunggu Konfirmasi",
    date: "10 Jul 2026, 14:30"
  },
  {
    id: "ORD-002",
    name: "Andi Wijaya",
    type: "Motor Besar (> 150cc)",
    pickup: "Depok",
    dropoff: "Jakarta Selatan",
    distance: 8.2,
    total: 1430000,
    status: "Selesai",
    date: "09 Jul 2026, 09:15"
  }
];

export default async function AdminPage() {
  const cookieStore = await cookies();
  const isLoggedIn = cookieStore.get("admin_session")?.value === "true";

  async function handleLogin(formData: FormData) {
    "use server";
    const password = formData.get("password");
    if (password === "admin123") {
      const cookieStore = await cookies();
      cookieStore.set("admin_session", "true", { maxAge: 60 * 60 * 24 });
      redirect("/admin");
    }
  }

  async function handleLogout() {
    "use server";
    const cookieStore = await cookies();
    cookieStore.delete("admin_session");
    redirect("/admin");
  }

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6">
        <div className="w-full max-w-md glass-card rounded-3xl p-8 relative overflow-hidden">
          <div className="absolute -top-20 -right-20 w-40 h-40 bg-primary-500/20 blur-[50px] rounded-full pointer-events-none" />
          
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-primary-500/20 rounded-2xl flex items-center justify-center text-primary-500">
              <Lock size={32} />
            </div>
          </div>
          
          <h1 className="text-2xl font-bold text-center text-white mb-2">Admin Dashboard</h1>
          <p className="text-center text-slate-400 mb-8 text-sm">Masukkan password untuk mengakses data pesanan.</p>

          <form action={handleLogin} className="space-y-4">
            <div>
              <input 
                type="password" 
                name="password"
                placeholder="Password (admin123)"
                className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-primary-500 transition-all text-center"
              />
            </div>
            <button 
              type="submit"
              className="w-full bg-primary-500 text-white rounded-xl py-3 font-bold hover:bg-primary-600 transition-all shadow-lg shadow-primary-500/20"
            >
              Masuk
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Admin Navbar */}
      <nav className="w-full border-b border-slate-800 bg-slate-900/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center text-white">
              <Lock size={16} />
            </div>
            <span className="font-bold text-white tracking-tight">Admin<span className="text-primary-500">Panel</span></span>
          </div>
          
          <form action={handleLogout}>
            <button type="submit" className="text-sm font-medium text-slate-400 hover:text-white flex items-center gap-2 transition-colors">
              <LogOut size={16} /> Logout
            </button>
          </form>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-6 md:p-8 space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white">Daftar Pesanan</h1>
            <p className="text-slate-400 text-sm">Kelola semua pesanan towing yang masuk.</p>
          </div>
          
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
            <input 
              type="text" 
              placeholder="Cari nama atau ID..."
              className="bg-slate-900 border border-slate-700 rounded-lg pl-10 pr-4 py-2 text-white text-sm focus:outline-none focus:border-primary-500 w-full md:w-64"
            />
          </div>
        </div>

        {/* Table/Cards */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="bg-slate-800/50 text-slate-400 uppercase text-xs">
                <tr>
                  <th className="px-6 py-4 font-medium">ID & Waktu</th>
                  <th className="px-6 py-4 font-medium">Pelanggan & Kendaraan</th>
                  <th className="px-6 py-4 font-medium">Rute & Jarak</th>
                  <th className="px-6 py-4 font-medium">Total Harga</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {MOCK_ORDERS.map((order) => (
                  <tr key={order.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-medium text-white">{order.id}</div>
                      <div className="text-xs text-slate-500">{order.date}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-white">{order.name}</div>
                      <div className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                        <Truck size={12} /> {order.type}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1 text-white">
                        <div className="w-2 h-2 rounded-full bg-blue-500 shrink-0" /> {order.pickup}
                      </div>
                      <div className="flex items-center gap-1 text-white mt-1">
                        <div className="w-2 h-2 rounded-full bg-primary-500 shrink-0" /> {order.dropoff}
                      </div>
                      <div className="text-xs text-slate-500 mt-1">Jarak: {order.distance} km</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-bold text-primary-400">Rp {order.total.toLocaleString('id-ID')}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-md text-xs font-medium border ${
                        order.status === 'Selesai' 
                          ? 'bg-green-500/10 text-green-400 border-green-500/20' 
                          : 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
