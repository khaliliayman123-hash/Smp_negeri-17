/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
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
  ArrowRight,
  Calendar,
  ShieldAlert,
  BarChart3,
  PieChart as PieChartIcon,
  LineChart as LineChartIcon,
  Filter,
  Layers,
  Sparkles,
  Info,
  Check,
  Clock,
  UserCheck,
  TrendingDown
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';
import { DatabaseState, User, Siswa } from '../types';
import { getSiswaInfo, normalizeClassName } from '../services/api';

interface DashboardViewProps {
  db: DatabaseState;
  currentUser: User;
  onNavigateToSiswa: (siswaId: string, activeTab: string) => void;
}

const BULAN_URUTAN = [
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember',
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni'
];

const BULAN_KALENDER = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
];

export default function DashboardView({ db, currentUser, onNavigateToSiswa }: DashboardViewProps) {
  // Chart Configuration & Filter States
  const [attendanceGradeFilter, setAttendanceGradeFilter] = useState<'ALL' | '7' | '8' | '9'>('ALL');
  const [attendanceChartType, setAttendanceChartType] = useState<'bar' | 'area' | 'pie'>('bar');

  const [violationGradeFilter, setViolationGradeFilter] = useState<'ALL' | '7' | '8' | '9'>('ALL');
  const [violationMetric, setViolationMetric] = useState<'kasus' | 'poin'>('kasus');
  const [violationChartType, setViolationChartType] = useState<'classBar' | 'gradePie' | 'monthlyTrend'>('classBar');

  // Basic KPI Calculations
  const totalSiswa = db.siswa.length;
  const totalKelas = db.kelas.length;
  const totalKonseling = db.konseling.length;
  const totalPelanggaran = db.pelanggaran.length;

  // Compute student violations totals with remisi reduction
  const siswaViolationMap: Record<string, number> = {};
  db.pelanggaran.forEach(p => {
    siswaViolationMap[p.siswaId] = (siswaViolationMap[p.siswaId] || 0) + Number(p.poin || 0);
  });
  if (db.remisiPoin) {
    db.remisiPoin.forEach(r => {
      if (siswaViolationMap[r.siswaId] !== undefined) {
        siswaViolationMap[r.siswaId] = Math.max(0, siswaViolationMap[r.siswaId] - Number(r.poin || 0));
      }
    });
  }

  // High risk students with > 100 points
  const highRiskStudents = db.siswa.map(s => {
    const pts = siswaViolationMap[s.id] || 0;
    return { ...s, pts };
  }).filter(s => s.pts > 100);

  // Students with no counseling logged
  const studentsWithNoCounseling = db.siswa.filter(s => {
    return !db.konseling.some(k => k.siswaId === s.id);
  });

  // Students with no assessments logged
  const studentsWithNoAssessments = db.siswa.filter(s => {
    return !db.asesmen.some(a => a.siswaId === s.id);
  });

  // Latest achievements
  const recentAchievements = [...db.prestasi]
    .slice(-3)
    .map(p => {
      const info = getSiswaInfo(db, p.siswaId, p);
      return { ...p, siswaNama: info.nama };
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

  // Category violations counts
  const violationDist = db.pelanggaran.reduce((acc, p) => {
    const kat = p.kategori || 'Ringan';
    acc[kat] = (acc[kat] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // ==========================================
  // 1. DATA RECHARTS: DISTRIBUSI KEHADIRAN BULANAN
  // ==========================================
  const monthlyAttendanceData = useMemo(() => {
    const monthMap: Record<string, { hadir: number; sakit: number; izin: number; alfa: number; total: number }> = {};
    BULAN_URUTAN.forEach(b => {
      monthMap[b] = { hadir: 0, sakit: 0, izin: 0, alfa: 0, total: 0 };
    });

    const kehadiranRecords = db.kehadiran || [];

    kehadiranRecords.forEach(k => {
      // Filter by Grade if selected
      if (attendanceGradeFilter !== 'ALL') {
        const student = db.siswa.find(s => s.id === k.siswaId);
        const sKelasId = student?.kelasId || k.kelasId || '';
        const sKelasName = db.kelas.find(c => c.id === sKelasId)?.namaKelas || k.kelas || '';
        const norm = normalizeClassName(sKelasName);
        if (!norm.includes(`Kelas ${attendanceGradeFilter}-`)) {
          return;
        }
      }

      // Match month name
      const rawMonth = (k.bulan || '').trim();
      const matchedMonth = BULAN_URUTAN.find(b => b.toLowerCase() === rawMonth.toLowerCase()) || rawMonth;
      if (!monthMap[matchedMonth]) {
        monthMap[matchedMonth] = { hadir: 0, sakit: 0, izin: 0, alfa: 0, total: 0 };
      }

      const h = Number(k.hadir || 0);
      const s = Number(k.sakit || 0);
      const i = Number(k.izin || 0);
      const a = Number(k.alfa || 0);

      monthMap[matchedMonth].hadir += h;
      monthMap[matchedMonth].sakit += s;
      monthMap[matchedMonth].izin += i;
      monthMap[matchedMonth].alfa += a;
      monthMap[matchedMonth].total += (h + s + i + a);
    });

    return BULAN_URUTAN.map(bulan => {
      const item = monthMap[bulan] || { hadir: 0, sakit: 0, izin: 0, alfa: 0, total: 0 };
      const totalRec = item.total;
      const persentase = totalRec > 0 ? Math.round((item.hadir / totalRec) * 100) : (item.hadir > 0 ? 100 : 0);
      return {
        bulan,
        shortBulan: bulan.substring(0, 3),
        hadir: item.hadir,
        sakit: item.sakit,
        izin: item.izin,
        alfa: item.alfa,
        total: item.total,
        persentase
      };
    });
  }, [db.kehadiran, db.siswa, db.kelas, attendanceGradeFilter]);

  // Aggregate Total Attendance Metrics
  const attendanceTotals = useMemo(() => {
    let totalHadir = 0;
    let totalSakit = 0;
    let totalIzin = 0;
    let totalAlfa = 0;

    monthlyAttendanceData.forEach(m => {
      totalHadir += m.hadir;
      totalSakit += m.sakit;
      totalIzin += m.izin;
      totalAlfa += m.alfa;
    });

    const grandTotal = totalHadir + totalSakit + totalIzin + totalAlfa;
    const avgPersen = grandTotal > 0 ? ((totalHadir / grandTotal) * 100).toFixed(1) : '0';

    return { totalHadir, totalSakit, totalIzin, totalAlfa, grandTotal, avgPersen };
  }, [monthlyAttendanceData]);

  // Pie Chart Attendance Composition Data
  const attendancePieData = useMemo(() => [
    { name: 'Hadir', value: attendanceTotals.totalHadir, color: '#10b981' },
    { name: 'Sakit', value: attendanceTotals.totalSakit, color: '#0ea5e9' },
    { name: 'Izin', value: attendanceTotals.totalIzin, color: '#f59e0b' },
    { name: 'Alfa', value: attendanceTotals.totalAlfa, color: '#f43f5e' }
  ].filter(d => d.value > 0), [attendanceTotals]);

  // ==========================================
  // 2. DATA RECHARTS: TREN PELANGGARAN BERDASARKAN KELAS
  // ==========================================
  const classViolationStats = useMemo(() => {
    const statsMap: Record<string, {
      kelasId: string;
      namaKelas: string;
      shortName: string;
      tingkat: '7' | '8' | '9';
      ringan: number;
      sedang: number;
      berat: number;
      totalKasus: number;
      totalPoin: number;
    }> = {};

    // 1. Initialize for all 33 official classes
    (db.kelas || []).forEach(k => {
      const norm = normalizeClassName(k.namaKelas);
      const short = norm.replace('Kelas ', '');
      const tingkat = (short.charAt(0) as '7' | '8' | '9') || '7';
      statsMap[k.id] = {
        kelasId: k.id,
        namaKelas: norm || k.namaKelas,
        shortName: short || k.namaKelas,
        tingkat,
        ringan: 0,
        sedang: 0,
        berat: 0,
        totalKasus: 0,
        totalPoin: 0
      };
    });

    // 2. Tally violations per class
    (db.pelanggaran || []).forEach(p => {
      const student = db.siswa.find(s => s.id === p.siswaId);
      if (!student) return;

      let targetKelasId = student.kelasId;
      if (!statsMap[targetKelasId]) {
        const found = db.kelas.find(k => k.id === targetKelasId || normalizeClassName(k.namaKelas) === normalizeClassName(student.kelasId));
        if (found) targetKelasId = found.id;
      }

      if (statsMap[targetKelasId]) {
        const kat = (p.kategori || 'Ringan').toLowerCase();
        const poin = Number(p.poin || 0);

        if (kat.includes('berat')) {
          statsMap[targetKelasId].berat += 1;
        } else if (kat.includes('sedang')) {
          statsMap[targetKelasId].sedang += 1;
        } else {
          statsMap[targetKelasId].ringan += 1;
        }
        statsMap[targetKelasId].totalKasus += 1;
        statsMap[targetKelasId].totalPoin += poin;
      }
    });

    // Sort classes numerically (7-1 to 7-11, 8-1 to 8-11, 9-1 to 9-11)
    const list = Object.values(statsMap);
    list.sort((a, b) => {
      const [tA, rA] = a.shortName.split('-').map(Number);
      const [tB, rB] = b.shortName.split('-').map(Number);
      if (tA !== tB) return tA - tB;
      return (rA || 0) - (rB || 0);
    });

    return list;
  }, [db.kelas, db.pelanggaran, db.siswa]);

  // Filtered Class Violations
  const filteredClassViolations = useMemo(() => {
    if (violationGradeFilter === 'ALL') {
      return classViolationStats;
    }
    return classViolationStats.filter(c => c.tingkat === violationGradeFilter);
  }, [classViolationStats, violationGradeFilter]);

  // Aggregate by Grade Level (7, 8, 9)
  const gradeViolationStats = useMemo(() => {
    const summary: Record<string, { name: string; kasus: number; poin: number; ringan: number; sedang: number; berat: number; color: string }> = {
      '7': { name: 'Kelas 7 (11 Rombel)', kasus: 0, poin: 0, ringan: 0, sedang: 0, berat: 0, color: '#10b981' },
      '8': { name: 'Kelas 8 (11 Rombel)', kasus: 0, poin: 0, ringan: 0, sedang: 0, berat: 0, color: '#f59e0b' },
      '9': { name: 'Kelas 9 (11 Rombel)', kasus: 0, poin: 0, ringan: 0, sedang: 0, berat: 0, color: '#f43f5e' }
    };

    classViolationStats.forEach(c => {
      if (summary[c.tingkat]) {
        summary[c.tingkat].kasus += c.totalKasus;
        summary[c.tingkat].poin += c.totalPoin;
        summary[c.tingkat].ringan += c.ringan;
        summary[c.tingkat].sedang += c.sedang;
        summary[c.tingkat].berat += c.berat;
      }
    });

    return Object.values(summary);
  }, [classViolationStats]);

  // Monthly Violation Trend Data
  const monthlyViolationStats = useMemo(() => {
    const map: Record<string, { bulan: string; shortBulan: string; ringan: number; sedang: number; berat: number; total: number; poin: number }> = {};
    BULAN_URUTAN.forEach(b => {
      map[b] = { bulan: b, shortBulan: b.substring(0, 3), ringan: 0, sedang: 0, berat: 0, total: 0, poin: 0 };
    });

    (db.pelanggaran || []).forEach(p => {
      let m = (p.bulan || '').trim();
      if (!m && p.tanggal) {
        try {
          const d = new Date(p.tanggal);
          if (!isNaN(d.getTime())) {
            m = BULAN_KALENDER[d.getMonth()];
          }
        } catch {}
      }
      const matched = BULAN_URUTAN.find(b => b.toLowerCase() === m.toLowerCase()) || 'Juli';
      if (!map[matched]) {
        map[matched] = { bulan: matched, shortBulan: matched.substring(0, 3), ringan: 0, sedang: 0, berat: 0, total: 0, poin: 0 };
      }

      const kat = (p.kategori || 'Ringan').toLowerCase();
      const poin = Number(p.poin || 0);

      if (kat.includes('berat')) map[matched].berat += 1;
      else if (kat.includes('sedang')) map[matched].sedang += 1;
      else map[matched].ringan += 1;

      map[matched].total += 1;
      map[matched].poin += poin;
    });

    return BULAN_URUTAN.map(b => map[b]);
  }, [db.pelanggaran]);

  // Class Discipline Highlights
  const mostDisciplinedClass = useMemo(() => {
    if (classViolationStats.length === 0) return null;
    const sorted = [...classViolationStats].sort((a, b) => a.totalKasus - b.totalKasus || a.totalPoin - b.totalPoin);
    return sorted[0];
  }, [classViolationStats]);

  const highestViolationClass = useMemo(() => {
    if (classViolationStats.length === 0) return null;
    const sorted = [...classViolationStats].sort((a, b) => b.totalPoin - a.totalPoin || b.totalKasus - a.totalKasus);
    return sorted[0].totalKasus > 0 ? sorted[0] : null;
  }, [classViolationStats]);

  return (
    <div id="dashboard-container" className="space-y-6">
      
      {/* Welcome Banner */}
      <div id="welcome-banner" className="bg-gradient-to-r from-emerald-600 via-teal-700 to-emerald-800 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 bottom-0 translate-x-10 translate-y-10 opacity-10 pointer-events-none">
          <GraduationCap size={260} />
        </div>
        <div className="relative z-10 max-w-2xl space-y-2">
          <div className="inline-flex items-center gap-2 bg-emerald-500/30 text-emerald-100 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider backdrop-blur-sm border border-emerald-400/20">
            <Sparkles size={13} className="text-amber-300" />
            <span>Dashboard Evaluasi & Analitik Terintegrasi</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-black tracking-tight">
            Selamat Datang, {currentUser.nama}!
          </h1>
          <p className="text-emerald-100 text-xs md:text-sm leading-relaxed">
            Anda masuk sebagai <strong className="text-white underline">{currentUser.role}</strong>. Pantau himpunan data siswa, evaluasi perkembangan kehadiran berkala, serta peta sebaran disiplin 33 rombongan belajar SMPN 17 Tangerang Selatan.
          </p>
        </div>
      </div>

      {/* Statistics Cards */}
      <div id="stats-grid" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Siswa */}
        <div id="card-total-siswa" className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex items-center justify-between hover:shadow-md transition-all">
          <div className="space-y-1">
            <span className="text-slate-400 text-xs font-bold uppercase tracking-wider">Total Siswa</span>
            <p className="text-2xl font-black text-slate-800">{totalSiswa.toLocaleString('id-ID')}</p>
            <span className="text-emerald-600 text-xs flex items-center font-bold">
              <TrendingUp size={12} className="mr-1" /> 1.386 Siswa Terdata
            </span>
          </div>
          <div className="bg-emerald-50 text-emerald-600 p-3.5 rounded-2xl border border-emerald-100">
            <Users size={24} />
          </div>
        </div>

        {/* Total Kelas */}
        <div id="card-total-kelas" className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex items-center justify-between hover:shadow-md transition-all">
          <div className="space-y-1">
            <span className="text-slate-400 text-xs font-bold uppercase tracking-wider">Total Rombel / Kelas</span>
            <p className="text-2xl font-black text-slate-800">{totalKelas}</p>
            <span className="text-blue-600 text-xs flex items-center font-bold">
              <CheckCircle2 size={12} className="mr-1" /> 33 Rombel (7, 8, 9)
            </span>
          </div>
          <div className="bg-blue-50 text-blue-600 p-3.5 rounded-2xl border border-blue-100">
            <GraduationCap size={24} />
          </div>
        </div>

        {/* Layanan Konseling */}
        <div id="card-total-konseling" className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex items-center justify-between hover:shadow-md transition-all">
          <div className="space-y-1">
            <span className="text-slate-400 text-xs font-bold uppercase tracking-wider">Layanan Konseling</span>
            <p className="text-2xl font-black text-slate-800">{totalKonseling}</p>
            <span className="text-indigo-600 text-xs flex items-center font-bold">
              <MessageSquare size={12} className="mr-1" /> Terlaksana & Terekam
            </span>
          </div>
          <div className="bg-indigo-50 text-indigo-600 p-3.5 rounded-2xl border border-indigo-100">
            <MessageSquare size={24} />
          </div>
        </div>

        {/* Total Pelanggaran */}
        <div id="card-total-pelanggaran" className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex items-center justify-between hover:shadow-md transition-all">
          <div className="space-y-1">
            <span className="text-slate-400 text-xs font-bold uppercase tracking-wider">Kasus Disiplin</span>
            <p className="text-2xl font-black text-rose-600">{totalPelanggaran}</p>
            <span className="text-rose-600 text-xs flex items-center font-bold">
              <AlertTriangle size={12} className="mr-1" /> Pembinaan Karakter
            </span>
          </div>
          <div className="bg-rose-50 text-rose-600 p-3.5 rounded-2xl border border-rose-100">
            <ShieldAlert size={24} />
          </div>
        </div>
      </div>

      {/* Main Dashboard Layout */}
      <div id="dashboard-details-grid" className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Visual Analytics Charts with Recharts */}
        <div id="charts-panel" className="lg:col-span-2 space-y-6">
          
          {/* ========================================================= */}
          {/* CHART 1: DISTRIBUSI KEHADIRAN BULANAN (RECHARTS)         */}
          {/* ========================================================= */}
          <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-5">
            {/* Header & Controls */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100">
                    <Calendar size={18} />
                  </div>
                  <h3 className="font-extrabold text-slate-800 text-base">
                    Distribusi Kehadiran Bulanan Siswa
                  </h3>
                </div>
                <p className="text-xs text-slate-500">
                  Agregasi tingkat kehadiran (Hadir, Sakit, Izin, Alfa) sepanjang tahun ajaran
                </p>
              </div>

              {/* View & Filter Toggle Buttons */}
              <div className="flex flex-wrap items-center gap-2">
                {/* Grade Level Selector */}
                <div className="flex items-center bg-slate-100 p-1 rounded-xl text-xs font-bold">
                  {(['ALL', '7', '8', '9'] as const).map(g => (
                    <button
                      key={g}
                      type="button"
                      onClick={() => setAttendanceGradeFilter(g)}
                      className={`px-2.5 py-1 rounded-lg transition cursor-pointer text-[11px] ${
                        attendanceGradeFilter === g 
                          ? 'bg-emerald-600 text-white shadow-xs font-black' 
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      {g === 'ALL' ? 'Semua' : `Kls ${g}`}
                    </button>
                  ))}
                </div>

                {/* Chart Type Selector */}
                <div className="flex items-center bg-slate-100 p-1 rounded-xl text-xs">
                  <button
                    type="button"
                    onClick={() => setAttendanceChartType('bar')}
                    className={`p-1.5 rounded-lg transition cursor-pointer ${
                      attendanceChartType === 'bar' ? 'bg-white text-emerald-700 shadow-xs font-bold' : 'text-slate-500 hover:text-slate-800'
                    }`}
                    title="Grafik Batang Bertumpuk (Hadir, Sakit, Izin, Alfa)"
                  >
                    <BarChart3 size={15} />
                  </button>
                  <button
                    type="button"
                    onClick={() => setAttendanceChartType('area')}
                    className={`p-1.5 rounded-lg transition cursor-pointer ${
                      attendanceChartType === 'area' ? 'bg-white text-emerald-700 shadow-xs font-bold' : 'text-slate-500 hover:text-slate-800'
                    }`}
                    title="Grafik Area Tren Persentase Kehadiran"
                  >
                    <LineChartIcon size={15} />
                  </button>
                  <button
                    type="button"
                    onClick={() => setAttendanceChartType('pie')}
                    className={`p-1.5 rounded-lg transition cursor-pointer ${
                      attendanceChartType === 'pie' ? 'bg-white text-emerald-700 shadow-xs font-bold' : 'text-slate-500 hover:text-slate-800'
                    }`}
                    title="Diagram Donat Proporsi Kehadiran"
                  >
                    <PieChartIcon size={15} />
                  </button>
                </div>
              </div>
            </div>

            {/* Attendance Summary Badges */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
              <div className="p-3 bg-emerald-50/80 rounded-2xl border border-emerald-100 flex flex-col justify-between">
                <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider flex items-center gap-1">
                  <UserCheck size={12} /> Total Hadir
                </span>
                <p className="text-lg font-black text-emerald-800 mt-1">
                  {attendanceTotals.totalHadir.toLocaleString('id-ID')}
                </p>
                <span className="text-[10px] text-emerald-600 font-semibold">
                  Presensi Terekam
                </span>
              </div>

              <div className="p-3 bg-sky-50/80 rounded-2xl border border-sky-100 flex flex-col justify-between">
                <span className="text-[10px] font-bold text-sky-700 uppercase tracking-wider flex items-center gap-1">
                  <Clock size={12} /> Izin & Sakit
                </span>
                <p className="text-lg font-black text-sky-800 mt-1">
                  {(attendanceTotals.totalSakit + attendanceTotals.totalIzin).toLocaleString('id-ID')}
                </p>
                <span className="text-[10px] text-sky-600 font-semibold">
                  S: {attendanceTotals.totalSakit} • I: {attendanceTotals.totalIzin}
                </span>
              </div>

              <div className="p-3 bg-rose-50/80 rounded-2xl border border-rose-100 flex flex-col justify-between">
                <span className="text-[10px] font-bold text-rose-700 uppercase tracking-wider flex items-center gap-1">
                  <AlertTriangle size={12} /> Alfa / Nihil
                </span>
                <p className="text-lg font-black text-rose-800 mt-1">
                  {attendanceTotals.totalAlfa.toLocaleString('id-ID')}
                </p>
                <span className="text-[10px] text-rose-600 font-semibold">
                  Tanpa Keterangan
                </span>
              </div>

              <div className="p-3 bg-teal-50/80 rounded-2xl border border-teal-100 flex flex-col justify-between">
                <span className="text-[10px] font-bold text-teal-700 uppercase tracking-wider flex items-center gap-1">
                  <Check size={12} /> Rata Kehadiran
                </span>
                <p className="text-lg font-black text-teal-800 mt-1">
                  {attendanceTotals.avgPersen}%
                </p>
                <span className="text-[10px] text-teal-600 font-semibold">
                  Target: &gt;90%
                </span>
              </div>
            </div>

            {/* Recharts Canvas */}
            <div className="h-72 w-full pt-2">
              {attendanceChartType === 'bar' && (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={monthlyAttendanceData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis 
                      dataKey="shortBulan" 
                      tick={{ fontSize: 11, fill: '#64748b', fontWeight: 600 }} 
                      axisLine={{ stroke: '#cbd5e1' }}
                      tickLine={false}
                    />
                    <YAxis 
                      tick={{ fontSize: 11, fill: '#64748b' }} 
                      axisLine={false}
                      tickLine={false}
                    />
                    <Tooltip 
                      content={({ active, payload, label }) => {
                        if (active && payload && payload.length) {
                          const data = payload[0].payload;
                          return (
                            <div className="bg-slate-900 text-white p-3 rounded-2xl shadow-xl border border-slate-700 text-xs space-y-1.5 min-w-[150px]">
                              <p className="font-extrabold text-sm border-b border-slate-700 pb-1 text-emerald-400">
                                Bulan {data.bulan}
                              </p>
                              <div className="space-y-1 text-[11px]">
                                <p className="flex justify-between"><span className="text-emerald-300 font-medium">Hadir:</span> <strong className="text-white font-bold">{data.hadir}</strong></p>
                                <p className="flex justify-between"><span className="text-sky-300 font-medium">Sakit:</span> <strong className="text-white font-bold">{data.sakit}</strong></p>
                                <p className="flex justify-between"><span className="text-amber-300 font-medium">Izin:</span> <strong className="text-white font-bold">{data.izin}</strong></p>
                                <p className="flex justify-between"><span className="text-rose-300 font-medium">Alfa:</span> <strong className="text-white font-bold">{data.alfa}</strong></p>
                                <p className="flex justify-between pt-1 border-t border-slate-800 text-emerald-400 font-black">
                                  <span>Kehadiran:</span> <span>{data.persentase}%</span>
                                </p>
                              </div>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Legend 
                      verticalAlign="top" 
                      align="right" 
                      iconType="circle"
                      iconSize={8}
                      wrapperStyle={{ fontSize: '11px', paddingBottom: '10px' }}
                    />
                    <Bar dataKey="hadir" name="Hadir" stackId="a" fill="#10b981" radius={[0, 0, 0, 0]} />
                    <Bar dataKey="sakit" name="Sakit" stackId="a" fill="#0ea5e9" radius={[0, 0, 0, 0]} />
                    <Bar dataKey="izin" name="Izin" stackId="a" fill="#f59e0b" radius={[0, 0, 0, 0]} />
                    <Bar dataKey="alfa" name="Alfa" stackId="a" fill="#f43f5e" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}

              {attendanceChartType === 'area' && (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={monthlyAttendanceData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                    <defs>
                      <linearGradient id="hadirGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/>
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0.0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis 
                      dataKey="shortBulan" 
                      tick={{ fontSize: 11, fill: '#64748b', fontWeight: 600 }} 
                      axisLine={{ stroke: '#cbd5e1' }}
                      tickLine={false}
                    />
                    <YAxis 
                      domain={[0, 100]} 
                      tick={{ fontSize: 11, fill: '#64748b' }} 
                      unit="%" 
                      axisLine={false}
                      tickLine={false}
                    />
                    <Tooltip 
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          const data = payload[0].payload;
                          return (
                            <div className="bg-slate-900 text-white p-3 rounded-2xl shadow-xl border border-slate-700 text-xs space-y-1">
                              <p className="font-extrabold text-emerald-400">{data.bulan}</p>
                              <p className="text-white font-black text-sm">{data.persentase}% Kehadiran</p>
                              <p className="text-[10px] text-slate-400">Total Hadir: {data.hadir} sesi</p>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="persentase" 
                      name="Persentase Kehadiran (%)" 
                      stroke="#059669" 
                      strokeWidth={3} 
                      fillOpacity={1} 
                      fill="url(#hadirGrad)" 
                    />
                  </AreaChart>
                </ResponsiveContainer>
              )}

              {attendanceChartType === 'pie' && (
                <div className="h-full flex flex-col sm:flex-row items-center justify-center gap-6">
                  <div className="h-60 w-60">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={attendancePieData.length > 0 ? attendancePieData : [{ name: 'Belum Ada Data', value: 1, color: '#cbd5e1' }]}
                          innerRadius={55}
                          outerRadius={85}
                          paddingAngle={3}
                          dataKey="value"
                        >
                          {(attendancePieData.length > 0 ? attendancePieData : [{ name: 'Belum Ada Data', value: 1, color: '#cbd5e1' }]).map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="space-y-2 text-xs">
                    <p className="font-extrabold text-slate-700">Proporsi Presensi Total:</p>
                    {attendancePieData.map(item => (
                      <div key={item.name} className="flex items-center gap-2 text-xs">
                        <span className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                        <span className="text-slate-600 font-medium">{item.name}:</span>
                        <strong className="text-slate-800 font-bold">{item.value.toLocaleString('id-ID')} sesi</strong>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* ========================================================= */}
          {/* CHART 2: TREN PELANGGARAN DISIPLIN BERDASARKAN KELAS     */}
          {/* ========================================================= */}
          <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-5">
            {/* Header & Controls */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-rose-50 text-rose-600 border border-rose-100">
                    <ShieldAlert size={18} />
                  </div>
                  <h3 className="font-extrabold text-slate-800 text-base">
                    Tren Pelanggaran Disiplin Berdasarkan Kelas & Rombel
                  </h3>
                </div>
                <p className="text-xs text-slate-500">
                  Pemetaan kedisiplinan siswa per rombongan belajar (Kelas 7, 8, dan 9)
                </p>
              </div>

              {/* View & Metric Controls */}
              <div className="flex flex-wrap items-center gap-2">
                {/* Metric Selector: Kasus vs Poin */}
                <div className="flex items-center bg-slate-100 p-1 rounded-xl text-xs font-bold">
                  <button
                    type="button"
                    onClick={() => setViolationMetric('kasus')}
                    className={`px-2.5 py-1 rounded-lg transition cursor-pointer text-[11px] ${
                      violationMetric === 'kasus' 
                        ? 'bg-rose-600 text-white shadow-xs font-black' 
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Jumlah Kasus
                  </button>
                  <button
                    type="button"
                    onClick={() => setViolationMetric('poin')}
                    className={`px-2.5 py-1 rounded-lg transition cursor-pointer text-[11px] ${
                      violationMetric === 'poin' 
                        ? 'bg-rose-600 text-white shadow-xs font-black' 
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Akumulasi Poin
                  </button>
                </div>

                {/* Grade Filter */}
                <div className="flex items-center bg-slate-100 p-1 rounded-xl text-xs font-bold">
                  {(['ALL', '7', '8', '9'] as const).map(g => (
                    <button
                      key={g}
                      type="button"
                      onClick={() => setViolationGradeFilter(g)}
                      className={`px-2.5 py-1 rounded-lg transition cursor-pointer text-[11px] ${
                        violationGradeFilter === g 
                          ? 'bg-slate-900 text-white shadow-xs font-black' 
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      {g === 'ALL' ? 'Semua' : `Kls ${g}`}
                    </button>
                  ))}
                </div>

                {/* Chart Mode */}
                <div className="flex items-center bg-slate-100 p-1 rounded-xl text-xs">
                  <button
                    type="button"
                    onClick={() => setViolationChartType('classBar')}
                    className={`p-1.5 rounded-lg transition cursor-pointer ${
                      violationChartType === 'classBar' ? 'bg-white text-rose-700 shadow-xs font-bold' : 'text-slate-500 hover:text-slate-800'
                    }`}
                    title="Per Rombel (Bar Chart)"
                  >
                    <BarChart3 size={15} />
                  </button>
                  <button
                    type="button"
                    onClick={() => setViolationChartType('monthlyTrend')}
                    className={`p-1.5 rounded-lg transition cursor-pointer ${
                      violationChartType === 'monthlyTrend' ? 'bg-white text-rose-700 shadow-xs font-bold' : 'text-slate-500 hover:text-slate-800'
                    }`}
                    title="Tren Waktu Bulanan (Line Chart)"
                  >
                    <LineChartIcon size={15} />
                  </button>
                  <button
                    type="button"
                    onClick={() => setViolationChartType('gradePie')}
                    className={`p-1.5 rounded-lg transition cursor-pointer ${
                      violationChartType === 'gradePie' ? 'bg-white text-rose-700 shadow-xs font-bold' : 'text-slate-500 hover:text-slate-800'
                    }`}
                    title="Komposisi Tingkat 7, 8, 9"
                  >
                    <PieChartIcon size={15} />
                  </button>
                </div>
              </div>
            </div>

            {/* Highlights Card */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3 bg-emerald-50/80 rounded-2xl border border-emerald-100 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider block">
                    🏆 Rombel Terdisiplin
                  </span>
                  <p className="text-sm font-black text-emerald-900 mt-0.5">
                    {mostDisciplinedClass ? mostDisciplinedClass.namaKelas : '-'}
                  </p>
                  <span className="text-[10px] text-emerald-600 font-semibold">
                    {mostDisciplinedClass ? `${mostDisciplinedClass.totalKasus} Kasus (${mostDisciplinedClass.totalPoin} Poin)` : 'Zero Kasus'}
                  </span>
                </div>
                <div className="w-9 h-9 rounded-xl bg-emerald-500 text-white flex items-center justify-center font-bold">
                  ✓
                </div>
              </div>

              <div className="p-3 bg-rose-50/80 rounded-2xl border border-rose-100 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold text-rose-700 uppercase tracking-wider block">
                    ⚠️ Atensi Khusus
                  </span>
                  <p className="text-sm font-black text-rose-900 mt-0.5">
                    {highestViolationClass ? highestViolationClass.namaKelas : 'Belum Ada Kasus'}
                  </p>
                  <span className="text-[10px] text-rose-600 font-semibold">
                    {highestViolationClass ? `${highestViolationClass.totalKasus} Kasus (${highestViolationClass.totalPoin} Poin)` : 'Tertib'}
                  </span>
                </div>
                <div className="w-9 h-9 rounded-xl bg-rose-500 text-white flex items-center justify-center font-bold">
                  !
                </div>
              </div>

              <div className="p-3 bg-amber-50/80 rounded-2xl border border-amber-100 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold text-amber-700 uppercase tracking-wider block">
                    ⚖️ Rasio Kategori
                  </span>
                  <p className="text-sm font-black text-amber-900 mt-0.5">
                    R: {violationDist['Ringan'] || 0} • S: {violationDist['Sedang'] || 0} • B: {violationDist['Berat'] || 0}
                  </p>
                  <span className="text-[10px] text-amber-600 font-semibold">
                    Total {totalPelanggaran} Kasus Dicatat
                  </span>
                </div>
                <div className="w-9 h-9 rounded-xl bg-amber-500 text-white flex items-center justify-center font-bold">
                  📊
                </div>
              </div>
            </div>

            {/* Recharts Canvas for Violations */}
            <div className="h-80 w-full pt-2">
              {violationChartType === 'classBar' && (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={filteredClassViolations} margin={{ top: 10, right: 10, left: -20, bottom: 25 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis 
                      dataKey="shortName" 
                      angle={-45} 
                      textAnchor="end"
                      height={45}
                      tick={{ fontSize: 10, fill: '#64748b', fontWeight: 600 }} 
                      axisLine={{ stroke: '#cbd5e1' }}
                      tickLine={false}
                    />
                    <YAxis 
                      tick={{ fontSize: 11, fill: '#64748b' }} 
                      axisLine={false}
                      tickLine={false}
                    />
                    <Tooltip 
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          const data = payload[0].payload;
                          return (
                            <div className="bg-slate-900 text-white p-3 rounded-2xl shadow-xl border border-slate-700 text-xs space-y-1 min-w-[160px]">
                              <p className="font-extrabold text-sm border-b border-slate-700 pb-1 text-rose-400">
                                {data.namaKelas}
                              </p>
                              <p className="flex justify-between"><span className="text-slate-300">Total Kasus:</span> <strong className="text-white">{data.totalKasus}</strong></p>
                              <p className="flex justify-between"><span className="text-slate-300">Akumulasi Poin:</span> <strong className="text-rose-300">{data.totalPoin} Poin</strong></p>
                              <div className="pt-1 border-t border-slate-800 text-[10px] space-y-0.5 text-slate-400">
                                <p>• Ringan: {data.ringan}</p>
                                <p>• Sedang: {data.sedang}</p>
                                <p>• Berat: {data.berat}</p>
                              </div>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Legend 
                      verticalAlign="top" 
                      align="right" 
                      iconType="circle"
                      iconSize={8}
                      wrapperStyle={{ fontSize: '11px', paddingBottom: '10px' }}
                    />
                    {violationMetric === 'kasus' ? (
                      <>
                        <Bar dataKey="ringan" name="Ringan" stackId="v" fill="#10b981" radius={[0, 0, 0, 0]} />
                        <Bar dataKey="sedang" name="Sedang" stackId="v" fill="#f59e0b" radius={[0, 0, 0, 0]} />
                        <Bar dataKey="berat" name="Berat" stackId="v" fill="#f43f5e" radius={[4, 4, 0, 0]} />
                      </>
                    ) : (
                      <Bar dataKey="totalPoin" name="Total Poin Pelanggaran" fill="#e11d48" radius={[4, 4, 0, 0]} />
                    )}
                  </BarChart>
                </ResponsiveContainer>
              )}

              {violationChartType === 'monthlyTrend' && (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={monthlyViolationStats} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis 
                      dataKey="shortBulan" 
                      tick={{ fontSize: 11, fill: '#64748b', fontWeight: 600 }} 
                      axisLine={{ stroke: '#cbd5e1' }}
                      tickLine={false}
                    />
                    <YAxis 
                      tick={{ fontSize: 11, fill: '#64748b' }} 
                      axisLine={false}
                      tickLine={false}
                    />
                    <Tooltip 
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          const data = payload[0].payload;
                          return (
                            <div className="bg-slate-900 text-white p-3 rounded-2xl shadow-xl border border-slate-700 text-xs space-y-1">
                              <p className="font-extrabold text-amber-400">{data.bulan}</p>
                              <p className="text-white font-bold">{data.total} Total Kasus</p>
                              <p className="text-rose-300 font-medium">Akumulasi: {data.poin} Poin</p>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Legend 
                      verticalAlign="top" 
                      align="right" 
                      iconType="circle"
                      iconSize={8}
                      wrapperStyle={{ fontSize: '11px', paddingBottom: '10px' }}
                    />
                    <Line type="monotone" dataKey="ringan" name="Ringan" stroke="#10b981" strokeWidth={2} dot={{ r: 3 }} />
                    <Line type="monotone" dataKey="sedang" name="Sedang" stroke="#f59e0b" strokeWidth={2} dot={{ r: 3 }} />
                    <Line type="monotone" dataKey="berat" name="Berat" stroke="#f43f5e" strokeWidth={3} dot={{ r: 4 }} />
                  </LineChart>
                </ResponsiveContainer>
              )}

              {violationChartType === 'gradePie' && (
                <div className="h-full flex flex-col sm:flex-row items-center justify-center gap-6">
                  <div className="h-60 w-60">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={gradeViolationStats}
                          innerRadius={50}
                          outerRadius={80}
                          paddingAngle={4}
                          dataKey={violationMetric === 'kasus' ? 'kasus' : 'poin'}
                        >
                          {gradeViolationStats.map((entry, index) => (
                            <Cell key={`grade-cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="space-y-2.5 text-xs">
                    <p className="font-extrabold text-slate-800">
                      Distribusi Tingkat ({violationMetric === 'kasus' ? 'Kasus' : 'Poin'}):
                    </p>
                    {gradeViolationStats.map(item => (
                      <div key={item.name} className="flex items-center gap-2.5 bg-slate-50 p-2 rounded-xl border border-slate-100">
                        <span className="w-3.5 h-3.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                        <div className="min-w-0 flex-1">
                          <p className="font-bold text-slate-800">{item.name}</p>
                          <p className="text-[10px] text-slate-500">
                            {item.kasus} Kasus • {item.poin} Poin (R: {item.ringan}, S: {item.sedang}, B: {item.berat})
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Demographics & Academic Services Bar */}
          <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-800 flex items-center gap-2 text-sm">
                <Activity size={17} className="text-teal-600" />
                Rasio Demografi Gender Siswa
              </h3>
              <span className="text-xs text-slate-400 font-semibold">Total {totalSiswa} Siswa</span>
            </div>

            <div className="p-4 bg-emerald-50/50 rounded-2xl border border-emerald-100/50 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="space-y-0.5">
                <p className="text-xs font-semibold text-slate-500">Keseimbangan Siswa SMPN 17</p>
                <p className="text-sm font-extrabold text-emerald-900">
                  Laki-laki: {genderCounts.laki} Siswa ({totalSiswa > 0 ? Math.round((genderCounts.laki / totalSiswa) * 100) : 50}%) | Perempuan: {genderCounts.perempuan} Siswa ({totalSiswa > 0 ? Math.round((genderCounts.perempuan / totalSiswa) * 100) : 50}%)
                </p>
              </div>
              <div className="flex-1 w-full max-w-xs bg-slate-200 h-4 rounded-full overflow-hidden flex shadow-inner">
                <div 
                  style={{ width: `${totalSiswa > 0 ? (genderCounts.laki / totalSiswa) * 100 : 50}%` }} 
                  className="bg-teal-500 h-full flex items-center justify-center text-[10px] text-white font-black"
                  title="Laki-laki"
                >
                  L
                </div>
                <div 
                  style={{ width: `${totalSiswa > 0 ? (genderCounts.perempuan / totalSiswa) * 100 : 50}%` }} 
                  className="bg-rose-400 h-full flex items-center justify-center text-[10px] text-white font-black"
                  title="Perempuan"
                >
                  P
                </div>
              </div>
            </div>
          </div>

          {/* Quick Stats Grid: Counseling Layout Services */}
          <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
            <h3 className="font-bold text-slate-800 flex items-center gap-2 text-sm">
              <Award size={18} className="text-amber-500" />
              Layanan Pendukung & Prestasi Siswa
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="bg-slate-50 p-4 rounded-2xl text-center space-y-1 border border-slate-100">
                <p className="text-xs font-bold text-slate-400">PRESTASI</p>
                <p className="text-2xl font-black text-slate-800">{db.prestasi.length}</p>
                <p className="text-[10px] text-slate-500 font-medium">Piagam & Sertifikat Siswa</p>
              </div>
              <div className="bg-slate-50 p-4 rounded-2xl text-center space-y-1 border border-slate-100">
                <p className="text-xs font-bold text-slate-400">HOME VISIT</p>
                <p className="text-2xl font-black text-slate-800">{db.homeVisit.length}</p>
                <p className="text-[10px] text-slate-500 font-medium">Kunjungan Rumah Terjadwal</p>
              </div>
              <div className="bg-slate-50 p-4 rounded-2xl text-center space-y-1 border border-slate-100">
                <p className="text-xs font-bold text-slate-400">KORESPONDENSI</p>
                <p className="text-2xl font-black text-slate-800">{db.surat.length}</p>
                <p className="text-[10px] text-slate-500 font-medium">Surat Panggilan & Rujukan</p>
              </div>
            </div>
          </div>

        </div>

        {/* Right Column: Alerts & Realtime School Notifications */}
        <div id="alerts-panel" className="space-y-6">
          
          {/* Notifications Card */}
          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
            <div className="p-5 border-b border-slate-100 bg-slate-50/70 flex items-center justify-between">
              <h3 className="font-extrabold text-slate-800 flex items-center gap-2 text-sm">
                <Bell size={18} className="text-rose-500 animate-pulse" />
                Notifikasi Prioritas BK
              </h3>
              <span className="bg-rose-100 text-rose-700 text-[10px] font-black px-2.5 py-0.5 rounded-full">
                Sistem Deteksi
              </span>
            </div>
            
            <div className="p-5 space-y-4 max-h-[560px] overflow-y-auto">
              
              {/* Alert 1: Violations > 100 Points */}
              {highRiskStudents.length > 0 ? (
                <div className="space-y-2">
                  <span className="text-[10px] uppercase font-black text-rose-600 tracking-wider flex items-center gap-1">
                    <AlertTriangle size={12} /> Siswa Pelanggaran Kritis (&gt;100 poin)
                  </span>
                  {highRiskStudents.map(s => (
                    <div key={s.id} className="p-3 bg-rose-50 border border-rose-100 rounded-2xl flex flex-col space-y-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-bold text-xs text-rose-900">{s.nama}</p>
                          <p className="text-[10px] text-rose-700">
                            NIS: {s.nis || '-'} | {(() => { const name = db.kelas.find(k => k.id === s.kelasId)?.namaKelas || '-'; return name.startsWith('Kelas ') ? name : `Kelas ${name}`; })()}
                          </p>
                        </div>
                        <span className="bg-rose-600 text-white text-xs font-black px-2.5 py-0.5 rounded-full shadow-xs">
                          {s.pts} Pts
                        </span>
                      </div>
                      <button 
                        type="button"
                        onClick={() => onNavigateToSiswa(s.id, 'pelanggaran')}
                        className="text-[10px] font-black text-rose-700 hover:text-rose-900 flex items-center justify-end gap-1 mt-1 transition cursor-pointer"
                      >
                        Buka Detail Kasus <ArrowRight size={11} />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-3.5 bg-emerald-50 border border-emerald-100 rounded-2xl flex items-center gap-2.5">
                  <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
                  <span className="text-xs font-bold text-emerald-800">
                    Tidak ada siswa kritis di atas 100 poin kedisiplinan!
                  </span>
                </div>
              )}

              {/* Alert 2: Uncounseled Students */}
              {studentsWithNoCounseling.length > 0 && (
                <div className="space-y-2 pt-2 border-t border-slate-100">
                  <span className="text-[10px] uppercase font-black text-indigo-600 tracking-wider flex items-center gap-1">
                    <MessageSquare size={12} /> Siswa Belum Menempuh Konseling
                  </span>
                  <div className="p-3 bg-indigo-50/50 border border-indigo-100/40 rounded-2xl space-y-2">
                    {studentsWithNoCounseling.slice(0, 3).map(s => (
                      <div key={s.id} className="flex justify-between items-center text-xs">
                        <span className="font-semibold text-slate-700 truncate max-w-[150px]">{s.nama}</span>
                        <button 
                          type="button"
                          onClick={() => onNavigateToSiswa(s.id, 'konseling')}
                          className="text-[10px] font-bold text-indigo-600 hover:underline cursor-pointer"
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
                  <span className="text-[10px] uppercase font-black text-amber-600 tracking-wider flex items-center gap-1">
                    <Activity size={12} /> Siswa Belum Diasesmen (AKPD / Gaya Belajar)
                  </span>
                  <div className="p-3 bg-amber-50/50 border border-amber-100/40 rounded-2xl space-y-2">
                    {studentsWithNoAssessments.slice(0, 3).map(s => (
                      <div key={s.id} className="flex justify-between items-center text-xs">
                        <span className="font-semibold text-slate-700 truncate max-w-[150px]">{s.nama}</span>
                        <button 
                          type="button"
                          onClick={() => onNavigateToSiswa(s.id, 'asesmen')}
                          className="text-[10px] font-bold text-amber-600 hover:underline cursor-pointer"
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
                  <span className="text-[10px] uppercase font-black text-teal-600 tracking-wider flex items-center gap-1">
                    <Award size={12} /> Prestasi Siswa Terbaru
                  </span>
                  <div className="space-y-2">
                    {recentAchievements.map(p => (
                      <div key={p.id} className="p-2.5 bg-emerald-50/40 border border-emerald-100/30 rounded-2xl text-xs">
                        <p className="font-bold text-slate-800">{p.namaPrestasi}</p>
                        <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                          <span>Siswa: {p.siswaNama}</span>
                          <span className="font-bold text-emerald-600">{p.tingkat} ({p.juara})</span>
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
