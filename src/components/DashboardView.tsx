/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { 
  Users, 
  GraduationCap, 
  MessageSquare, 
  AlertTriangle, 
  Bell, 
  TrendingUp, 
  Award, 
  CheckCircle2, 
  Activity,
  ArrowRight
} from 'lucide-react';
import { DatabaseState, User, UserRole, Siswa } from '../types';

interface DashboardViewProps {
  db: DatabaseState;
  currentUser: User;
  onNavigateToSiswa: (siswaId: string, activeTab: string) => void;
}

export default function DashboardView({ db, currentUser, onNavigateToSiswa }: DashboardViewProps) {
  // Calculations
  const totalSiswa = db.siswa.length;
  const totalKelas = db.kelas.length;
  const totalKonseling = db.konseling.length;
  const totalPelanggaran = db.pelanggaran.length;

  // Compute student violations totals
  const siswaViolationMap: Record<string, number> = {};
  db.pelanggaran.forEach(p => {
    siswaViolationMap[p.siswaId] = (siswaViolationMap[p.siswaId] || 0) + Number(p.poin);
  });
  if (db.remisiPoin) {
    db.remisiPoin.forEach(r => {
      if (siswaViolationMap[r.siswaId] !== undefined) {
        siswaViolationMap[r.siswaId] = Math.max(0, siswaViolationMap[r.siswaId] - Number(r.poin));
      }
    });
  }

  // Notifications logic
  // 1. Violations > 100 points
  const highRiskStudents = db.siswa.map(s => {
    const pts = siswaViolationMap[s.id] || 0;
    return { ...s, pts };
  }).filter(s => s.pts > 100);

  // 2. Students with no counseling logged
  const studentsWithNoCounseling = db.siswa.filter(s => {
    return !db.konseling.some(k => k.siswaId === s.id);
  });

  // 3. Students with no assessments logged
  const studentsWithNoAssessments = db.siswa.filter(s => {
    return !db.asesmen.some(a => a.siswaId === s.id);
  });

  // 4. Latest achievements
  const recentAchievements = [...db.prestasi]
    .slice(-3)
    .map(p => {
      const siswa = db.siswa.find(s => s.id === p.siswaId);
      return { ...p, siswaNama: siswa ? siswa.nama : 'Siswa' };
    });

  // Gender Calculations
  const genderCounts = db.siswa.reduce(
    (acc, s) => {
      if (s.jenisKelamin === 'Laki-laki') acc.laki++;
      else acc.perempuan++;
      return acc;
    },
    { laki: 0, perempuan: 0 }
  );

  // Class distribution for SVG Chart
  const classDist = db.kelas.map(k => {
    const count = db.siswa.filter(s => s.kelasId === k.id).length;
    return { name: k.namaKelas, count };
  });

  // Category violations for SVG Chart
  const violationDist = db.pelanggaran.reduce((acc, p) => {
    acc[p.kategori] = (acc[p.kategori] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div id="dashboard-container" className="space-y-6">
      {/* Welcome Banner */}
      <div id="welcome-banner" className="bg-gradient-to-r from-emerald-600 to-teal-700 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
        <div className="absolute right-0 bottom-0 translate-x-10 translate-y-10 opacity-10">
          <GraduationCap size={240} />
        </div>
        <div className="relative z-10 max-w-2xl">
          <span className="bg-emerald-500/30 text-emerald-100 text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider">
            Sistem Informasi BK
          </span>
          <h1 className="text-2xl md:text-3xl font-bold mt-2">
            Selamat Datang, {currentUser.nama}!
          </h1>
          <p className="text-emerald-100 mt-1 text-sm md:text-base">
            Anda masuk sebagai <strong className="text-white">{currentUser.role}</strong>. Kelola himpunan data siswa, evaluasi perkembangan bimbingan, konseling, serta cetak laporan terintegrasi secara cepat.
          </p>
        </div>
      </div>

      {/* Statistics Cards */}
      <div id="stats-grid" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Siswa */}
        <div id="card-total-siswa" className="bg-white rounded-xl p-5 border border-slate-100 shadow-sm flex items-center justify-between hover:shadow-md transition-all duration-200">
          <div className="space-y-1">
            <span className="text-slate-400 text-xs font-medium uppercase tracking-wider">Total Siswa</span>
            <p className="text-2xl font-bold text-slate-800">{totalSiswa}</p>
            <span className="text-emerald-600 text-xs flex items-center font-medium">
              <TrendingUp size={12} className="mr-1" /> Terdaftar aktif
            </span>
          </div>
          <div className="bg-emerald-50 text-emerald-600 p-3 rounded-xl">
            <Users size={24} />
          </div>
        </div>

        {/* Total Kelas */}
        <div id="card-total-kelas" className="bg-white rounded-xl p-5 border border-slate-100 shadow-sm flex items-center justify-between hover:shadow-md transition-all duration-200">
          <div className="space-y-1">
            <span className="text-slate-400 text-xs font-medium uppercase tracking-wider">Total Rombel / Kelas</span>
            <p className="text-2xl font-bold text-slate-800">{totalKelas}</p>
            <span className="text-blue-600 text-xs flex items-center font-medium">
              <CheckCircle2 size={12} className="mr-1" /> Aktif
            </span>
          </div>
          <div className="bg-blue-50 text-blue-600 p-3 rounded-xl">
            <GraduationCap size={24} />
          </div>
        </div>

        {/* Total Konseling */}
        <div id="card-total-konseling" className="bg-white rounded-xl p-5 border border-slate-100 shadow-sm flex items-center justify-between hover:shadow-md transition-all duration-200">
          <div className="space-y-1">
            <span className="text-slate-400 text-xs font-medium uppercase tracking-wider">Layanan Konseling</span>
            <p className="text-2xl font-bold text-slate-800">{totalKonseling}</p>
            <span className="text-indigo-600 text-xs flex items-center font-medium">
              <MessageSquare size={12} className="mr-1" /> Individu & Kelompok
            </span>
          </div>
          <div className="bg-indigo-50 text-indigo-600 p-3 rounded-xl">
            <MessageSquare size={24} />
          </div>
        </div>

        {/* Total Pelanggaran */}
        <div id="card-total-pelanggaran" className="bg-white rounded-xl p-5 border border-slate-100 shadow-sm flex items-center justify-between hover:shadow-md transition-all duration-200">
          <div className="space-y-1">
            <span className="text-slate-400 text-xs font-medium uppercase tracking-wider">Poin Pelanggaran</span>
            <p className="text-2xl font-bold text-rose-600">{totalPelanggaran}</p>
            <span className="text-rose-600 text-xs flex items-center font-medium">
              <AlertTriangle size={12} className="mr-1" /> Perlu bimbingan khusus
            </span>
          </div>
          <div className="bg-rose-50 text-rose-600 p-3 rounded-xl">
            <AlertTriangle size={24} />
          </div>
        </div>
      </div>

      {/* Main Dashboard Layout */}
      <div id="dashboard-details-grid" className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Visual Analytics Charts */}
        <div id="charts-panel" className="lg:col-span-2 space-y-6">
          
          {/* Chart 1: Rombel Student Distribution & Violations */}
          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-800 flex items-center gap-2">
                <Activity size={18} className="text-emerald-600" />
                Sebaran Siswa & Pelanggaran
              </h3>
              <span className="text-xs text-slate-400 font-medium">Update real-time</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
              {/* Custom SVG Bar Chart - Siswa per Kelas */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex flex-col justify-between">
                <p className="text-xs font-semibold text-slate-500 mb-3">Distribusi Siswa per Kelas</p>
                <div className="h-44 w-full flex items-end justify-around px-2 relative border-b border-slate-200">
                  {classDist.map((item, idx) => {
                    const maxVal = Math.max(...classDist.map(c => c.count), 1);
                    const percent = (item.count / maxVal) * 80; // Scale to max 80% height
                    return (
                      <div key={idx} className="flex flex-col items-center group w-8 relative">
                        <span className="absolute -top-6 text-[10px] font-bold text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-800 text-white rounded px-1.5 py-0.5 z-10">
                          {item.count} Siswa
                        </span>
                        <div 
                          style={{ height: `${Math.max(percent, 8)}%` }} 
                          className="w-full bg-emerald-500 hover:bg-emerald-600 rounded-t-sm transition-all duration-300"
                        />
                        <span className="text-[10px] font-semibold text-slate-500 mt-2 truncate w-full text-center">
                          {item.name}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Custom SVG Pie Chart / Indicators - Kategori Pelanggaran */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex flex-col justify-between">
                <p className="text-xs font-semibold text-slate-500 mb-3">Kategori Disiplin & Poin</p>
                <div className="space-y-3 flex-1 flex flex-col justify-center">
                  {['Ringan', 'Sedang', 'Berat'].map((kat) => {
                    const count = violationDist[kat] || 0;
                    const total = Math.max(db.pelanggaran.length, 1);
                    const percentage = Math.round((count / total) * 100);
                    const color = kat === 'Berat' ? 'bg-rose-500' : kat === 'Sedang' ? 'bg-amber-500' : 'bg-emerald-500';
                    return (
                      <div key={kat} className="space-y-1">
                        <div className="flex justify-between text-xs font-medium text-slate-600">
                          <span>Kategori {kat}</span>
                          <span className="font-bold">{count} Kasus ({percentage}%)</span>
                        </div>
                        <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                          <div className={`h-full ${color}`} style={{ width: `${percentage}%` }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Gender Demographics Dashboard Bar */}
            <div className="p-4 bg-emerald-50/50 rounded-xl border border-emerald-100/50 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="space-y-1">
                <p className="text-xs font-semibold text-slate-500">Rasio Demografi Gender Siswa</p>
                <p className="text-sm font-bold text-emerald-800">
                  Laki-laki: {genderCounts.laki} | Perempuan: {genderCounts.perempuan}
                </p>
              </div>
              <div className="flex-1 w-full max-w-xs bg-slate-200 h-4 rounded-full overflow-hidden flex">
                <div 
                  style={{ width: `${totalSiswa > 0 ? (genderCounts.laki / totalSiswa) * 100 : 50}%` }} 
                  className="bg-teal-500 h-full flex items-center justify-center text-[10px] text-white font-bold"
                  title="Laki-laki"
                >
                  L
                </div>
                <div 
                  style={{ width: `${totalSiswa > 0 ? (genderCounts.perempuan / totalSiswa) * 100 : 50}%` }} 
                  className="bg-rose-400 h-full flex items-center justify-center text-[10px] text-white font-bold"
                  title="Perempuan"
                >
                  P
                </div>
              </div>
            </div>
          </div>


          {/* Quick Stats Grid: Counseling Layout Services */}
          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-4">
            <h3 className="font-bold text-slate-800 flex items-center gap-2">
              <Award size={18} className="text-amber-500" />
              Prestasi & Dukungan Akademik Terbaru
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-slate-50 p-4 rounded-xl text-center space-y-1">
                <p className="text-xs font-semibold text-slate-400">PRESTASI</p>
                <p className="text-2xl font-bold text-slate-800">{db.prestasi.length}</p>
                <p className="text-[10px] text-slate-500 font-medium">Piagam & Sertifikat</p>
              </div>
              <div className="bg-slate-50 p-4 rounded-xl text-center space-y-1">
                <p className="text-xs font-semibold text-slate-400">HOME VISIT</p>
                <p className="text-2xl font-bold text-slate-800">{db.homeVisit.length}</p>
                <p className="text-[10px] text-slate-500 font-medium">Kunjungan Rumah</p>
              </div>
              <div className="bg-slate-50 p-4 rounded-xl text-center space-y-1">
                <p className="text-xs font-semibold text-slate-400">KORESPONDENSI</p>
                <p className="text-2xl font-bold text-slate-800">{db.surat.length}</p>
                <p className="text-[10px] text-slate-500 font-medium">Surat Panggilan & Rujukan</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Alerts & Realtime School Notifications */}
        <div id="alerts-panel" className="space-y-6">
          
          {/* Notifications Card */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
              <h3 className="font-bold text-slate-800 flex items-center gap-2">
                <Bell size={18} className="text-rose-500 animate-pulse" />
                Notifikasi Utama
              </h3>
              <span className="bg-rose-100 text-rose-700 text-[10px] font-bold px-2 py-0.5 rounded-full">
                Sistem Deteksi
              </span>
            </div>
            
            <div className="p-5 space-y-4 max-h-[500px] overflow-y-auto">
              
              {/* Alert 1: Violations > 100 Points */}
              {highRiskStudents.length > 0 ? (
                <div className="space-y-2">
                  <span className="text-[10px] uppercase font-bold text-rose-600 tracking-wider flex items-center gap-1">
                    <AlertTriangle size={12} /> Pelanggaran kritis (&gt;100 poin)
                  </span>
                  {highRiskStudents.map(s => (
                    <div key={s.id} className="p-3 bg-rose-50 border border-rose-100 rounded-xl flex flex-col space-y-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-bold text-xs text-rose-900">{s.nama}</p>
                          <p className="text-[10px] text-rose-700">NIS: {s.nis} | {(() => { const name = db.kelas.find(k => k.id === s.kelasId)?.namaKelas || '-'; return name.startsWith('Kelas ') ? name : `Kelas ${name}`; })()}</p>
                        </div>
                        <span className="bg-rose-600 text-white text-xs font-black px-2.5 py-0.5 rounded-full">
                          {s.pts} Pts
                        </span>
                      </div>
                      <button 
                        onClick={() => onNavigateToSiswa(s.id, 'pelanggaran')}
                        className="text-[10px] font-bold text-rose-700 hover:text-rose-900 flex items-center justify-end gap-1 mt-1 transition-all"
                      >
                        Buka Detail Kasus <ArrowRight size={10} />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-3 bg-emerald-50 border border-emerald-100 rounded-xl flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-emerald-600" />
                  <span className="text-xs font-semibold text-emerald-800">Tidak ada siswa kritis di atas 100 poin!</span>
                </div>
              )}

              {/* Alert 2: Uncounseled Students */}
              {studentsWithNoCounseling.length > 0 && (
                <div className="space-y-2 pt-2 border-t border-slate-100">
                  <span className="text-[10px] uppercase font-bold text-indigo-600 tracking-wider flex items-center gap-1">
                    <MessageSquare size={12} /> Siswa Belum Menempuh Konseling
                  </span>
                  <div className="p-3 bg-indigo-50/50 border border-indigo-100/30 rounded-xl space-y-1.5">
                    {studentsWithNoCounseling.slice(0, 3).map(s => (
                      <div key={s.id} className="flex justify-between items-center text-xs">
                        <span className="font-semibold text-slate-700 truncate max-w-[150px]">{s.nama}</span>
                        <button 
                          onClick={() => onNavigateToSiswa(s.id, 'konseling')}
                          className="text-[10px] font-bold text-indigo-600 hover:underline"
                        >
                          Mulai BK
                        </button>
                      </div>
                    ))}
                    {studentsWithNoCounseling.length > 3 && (
                      <p className="text-[9px] text-slate-400 italic text-right">+ {studentsWithNoCounseling.length - 3} siswa lainnya</p>
                    )}
                  </div>
                </div>
              )}

              {/* Alert 3: Unassessed Students */}
              {studentsWithNoAssessments.length > 0 && (
                <div className="space-y-2 pt-2 border-t border-slate-100">
                  <span className="text-[10px] uppercase font-bold text-amber-600 tracking-wider flex items-center gap-1">
                    <Activity size={12} /> Siswa Belum Diasesmen (AKPD / Gaya Belajar)
                  </span>
                  <div className="p-3 bg-amber-50/50 border border-amber-100/30 rounded-xl space-y-1.5">
                    {studentsWithNoAssessments.slice(0, 3).map(s => (
                      <div key={s.id} className="flex justify-between items-center text-xs">
                        <span className="font-semibold text-slate-700 truncate max-w-[150px]">{s.nama}</span>
                        <button 
                          onClick={() => onNavigateToSiswa(s.id, 'asesmen')}
                          className="text-[10px] font-bold text-amber-600 hover:underline"
                        >
                          Asesmen
                        </button>
                      </div>
                    ))}
                    {studentsWithNoAssessments.length > 3 && (
                      <p className="text-[9px] text-slate-400 italic text-right">+ {studentsWithNoAssessments.length - 3} siswa lainnya</p>
                    )}
                  </div>
                </div>
              )}

              {/* Alert 4: Recent achievements */}
              {recentAchievements.length > 0 && (
                <div className="space-y-2 pt-2 border-t border-slate-100">
                  <span className="text-[10px] uppercase font-bold text-teal-600 tracking-wider flex items-center gap-1">
                    <Award size={12} /> Prestasi Terbaru Masuk
                  </span>
                  <div className="space-y-2">
                    {recentAchievements.map(p => (
                      <div key={p.id} className="p-2.5 bg-emerald-50/30 border border-emerald-100/20 rounded-xl text-xs">
                        <p className="font-bold text-slate-800">{p.namaPrestasi}</p>
                        <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                          <span>Siswa: {p.siswaNama}</span>
                          <span className="font-semibold text-emerald-600">{p.tingkat} ({p.juara})</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
