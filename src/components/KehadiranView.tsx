import React, { useState, useMemo } from 'react';
import { 
  Calendar, 
  Users, 
  CheckCircle2, 
  Plus, 
  Search, 
  Filter, 
  Download, 
  FileDown, 
  Edit, 
  Trash2, 
  Info, 
  BarChart2, 
  GraduationCap, 
  X,
  BookOpen,
  Printer
} from 'lucide-react';
import { DatabaseState, User, UserRole, Kehadiran, Siswa } from '../types';
import { findSiswa, getSiswaInfo } from '../services/api';

interface KehadiranViewProps {
  db: DatabaseState | null;
  currentUser: User;
  onSaveKehadiran?: (kehadiran: Kehadiran, isNew: boolean) => Promise<boolean>;
  onDeleteKehadiran?: (id: string) => Promise<boolean>;
}

export default function KehadiranView({
  db,
  currentUser,
  onSaveKehadiran,
  onDeleteKehadiran
}: KehadiranViewProps) {
  // Determine assigned classes for Wali Kelas
  const assignedClasses = useMemo(() => {
    if (!db || !db.kelas) return [];

    if (currentUser.role === UserRole.WALI_KELAS) {
      const byWaliId = db.kelas.filter(k => k.waliKelasId === currentUser.id);
      if (byWaliId.length > 0) return byWaliId;

      const username = (currentUser.username || '').toLowerCase().trim();
      const mapping: Record<string, string> = {
        fay: 'Kelas 7-1', aida: 'Kelas 7-2', viika: 'Kelas 7-3', sribarnetti: 'Kelas 7-4', viny: 'Kelas 7-5', lia: 'Kelas 7-6', yanah: 'Kelas 7-7', srirahayu: 'Kelas 7-8', putri: 'Kelas 7-9', sari: 'Kelas 7-10', rifal: 'Kelas 7-11',
        neneng: 'Kelas 8-1', meli: 'Kelas 8-2', tiar: 'Kelas 8-3', joko: 'Kelas 8-4', danang: 'Kelas 8-5', sahdiana: 'Kelas 8-6', haifa: 'Kelas 8-7', santi: 'Kelas 8-8', reni: 'Kelas 8-9', dewi: 'Kelas 8-10', emi: 'Kelas 8-11',
        tere: 'Kelas 9-1', ferry: 'Kelas 9-2', sifah: 'Kelas 9-3', mia: 'Kelas 9-4', habib: 'Kelas 9-5', warsih: 'Kelas 9-6', tut: 'Kelas 9-7', nur: 'Kelas 9-8', pendi: 'Kelas 9-10', hadi: 'Kelas 9-11'
      };
      const targetName = mapping[username];
      if (targetName) {
        return db.kelas.filter(k => (k.namaKelas || '').toLowerCase().trim() === targetName.toLowerCase().trim());
      }
    }
    return db.kelas;
  }, [db, currentUser]);

  // Selected class state
  const [selectedClassId, setSelectedClassId] = useState<string>(() => {
    if (assignedClasses.length > 0) {
      return assignedClasses[0].namaKelas;
    }
    return 'ALL';
  });

  // Filter states
  const [attendanceFilterBulan, setAttendanceFilterBulan] = useState<string>('ALL');
  const [attendanceFilterMinggu, setAttendanceFilterMinggu] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Modal states
  const [showModal, setShowModal] = useState<boolean>(false);
  const [editingItem, setEditingItem] = useState<Kehadiran | null>(null);
  const [formKehadiran, setFormKehadiran] = useState<{
    siswaId: string;
    kelas: string;
    bulan: string;
    mingguKe: string;
    tahun: string;
    hadir: number;
    sakit: number;
    izin: number;
    alfa: number;
    keterangan: string;
  }>({
    siswaId: '',
    kelas: '',
    bulan: 'Juli',
    mingguKe: 'Minggu 1',
    tahun: '2026',
    hadir: 5,
    sakit: 0,
    izin: 0,
    alfa: 0,
    keterangan: 'Presensi minggu terdata'
  });

  // Normalize class name for robust matching
  const normalizeClassName = (name: string): string => {
    if (!name) return '';
    return name
      .toLowerCase()
      .replace(/kelas/g, '')
      .replace(/vii/g, '7')
      .replace(/viii/g, '8')
      .replace(/ix/g, '9')
      .replace(/[^0-9-]/g, '')
      .trim();
  };

  // Helper to extract student's class name
  const getStudentClassName = (student: Siswa): string => {
    if (!db || !student) return '';
    if (student.kelasId) {
      const clsObj = db.kelas.find(c => c.id === student.kelasId || c.namaKelas === student.kelasId);
      if (clsObj) return clsObj.namaKelas;
    }
    return student.kelasId || '';
  };

  // Filter students for the current active selection
  const activeStudents = useMemo(() => {
    if (!db || !db.siswa) return [];
    if (selectedClassId === 'ALL') return db.siswa;

    const targetNorm = normalizeClassName(selectedClassId);
    return db.siswa.filter(s => {
      const sNorm = normalizeClassName(getStudentClassName(s));
      return sNorm === targetNorm;
    });
  }, [db, selectedClassId]);

  // Filter attendance records
  const filteredKehadiran = useMemo(() => {
    if (!db || !db.kehadiran) return [];

    const activeStudentIds = new Set(activeStudents.map(s => s.id));
    const targetNorm = normalizeClassName(selectedClassId);

    return db.kehadiran.filter(k => {
      // 1. Match class
      if (selectedClassId !== 'ALL') {
        const studentMatch = activeStudentIds.has(k.siswaId);
        const kNorm = normalizeClassName(k.kelas || '');
        const classMatch = kNorm && targetNorm && kNorm === targetNorm;
        if (!studentMatch && !classMatch) return false;
      }

      // 2. Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const student = findSiswa(db, k.siswaId, k);
        const matchName = student && student.nama.toLowerCase().includes(q);
        const matchNis = student && (student.nis.toLowerCase().includes(q) || (student.nisn && student.nisn.toLowerCase().includes(q)));
        const matchKet = k.keterangan && k.keterangan.toLowerCase().includes(q);
        if (!matchName && !matchNis && !matchKet) return false;
      }

      // 3. Month filter
      if (attendanceFilterBulan !== 'ALL') {
        if (String(k.bulan || '').toLowerCase().trim() !== attendanceFilterBulan.toLowerCase().trim()) {
          return false;
        }
      }

      // 4. Week filter
      if (attendanceFilterMinggu !== 'ALL') {
        if (String(k.mingguKe || '').toLowerCase().trim() !== attendanceFilterMinggu.toLowerCase().trim()) {
          return false;
        }
      }

      return true;
    });
  }, [db, activeStudents, selectedClassId, searchQuery, attendanceFilterBulan, attendanceFilterMinggu]);

  // Attendance metrics
  const classAttendanceMetrics = useMemo(() => {
    let totalHadir = 0;
    let totalSakit = 0;
    let totalIzin = 0;
    let totalAlfa = 0;

    filteredKehadiran.forEach(k => {
      totalHadir += Number(k.hadir || 0);
      totalSakit += Number(k.sakit || 0);
      totalIzin += Number(k.izin || (k as any).ijin || 0);
      totalAlfa += Number(k.alfa || 0);
    });

    const totalHari = totalHadir + totalSakit + totalIzin + totalAlfa;
    const percentage = totalHari > 0 ? Math.round((totalHadir / totalHari) * 100) : 100;

    return {
      totalHadir,
      totalSakit,
      totalIzin,
      totalAlfa,
      totalHari,
      percentage
    };
  }, [filteredKehadiran]);

  // Weekly breakdown stats
  const weeklyBreakdownStats = useMemo(() => {
    const weeks = ['Minggu 1', 'Minggu 2', 'Minggu 3', 'Minggu 4', 'Minggu 5'];
    return weeks.map(weekLabel => {
      const weekRecords = filteredKehadiran.filter(k => 
        String(k.mingguKe || '').toLowerCase().trim() === weekLabel.toLowerCase().trim()
      );

      let h = 0, sk = 0, iz = 0, al = 0;
      weekRecords.forEach(r => {
        h += Number(r.hadir || 0);
        sk += Number(r.sakit || 0);
        iz += Number(r.izin || (r as any).ijin || 0);
        al += Number(r.alfa || 0);
      });

      const tot = h + sk + iz + al;
      const percentage = tot > 0 ? Math.round((h / tot) * 100) : 100;

      return {
        weekLabel,
        recordCount: weekRecords.length,
        hadir: h,
        sakit: sk,
        izin: iz,
        alfa: al,
        totalHari: tot,
        percentage
      };
    });
  }, [filteredKehadiran]);

  // Document download handlers
  const handleDownloadSiswaDoc = (siswaId: string) => {
    if (!db) return;
    const student = db.siswa.find(s => s.id === siswaId);
    if (!student) return;

    const records = db.kehadiran.filter(k => k.siswaId === siswaId);
    const kelasObj = db.kelas.find(c => c.id === student.kelasId || c.namaKelas === student.kelasId);
    const namaKelas = kelasObj?.namaKelas || getStudentClassName(student) || 'Semua Kelas';
    const waliKelasObj = db.users.find(u => u.id === kelasObj?.waliKelasId) || currentUser;
    const waliKelasName = waliKelasObj?.nama || 'Wali Kelas';
    const guruBkName = db.users.find(u => (u.role as string) === 'bk' || ((u as any).jabatan && String((u as any).jabatan).toLowerCase().includes('bk')))?.nama || 'Guru BK';

    const dateTodayStr = new Date().toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });

    let totalHadir = 0, totalSakit = 0, totalIzin = 0, totalAlfa = 0;
    records.forEach(r => {
      totalHadir += Number(r.hadir || 0);
      totalSakit += Number(r.sakit || 0);
      totalIzin += Number(r.izin || (r as any).ijin || 0);
      totalAlfa += Number(r.alfa || 0);
    });
    const totalHari = totalHadir + totalSakit + totalIzin + totalAlfa;
    const pct = totalHari > 0 ? Math.round((totalHadir / totalHari) * 100) : 100;

    const rowsHtml = records.length > 0 ? records.map((r, idx) => `
      <tr>
        <td style="text-align: center;">${idx + 1}</td>
        <td style="text-align: center;"><b>${r.mingguKe}</b></td>
        <td style="text-align: center;">${r.bulan} ${r.tahun}</td>
        <td style="text-align: center; color: #047857; font-weight: bold;">${r.hadir} Hari</td>
        <td style="text-align: center; color: #0284c7;">${r.sakit} Hari</td>
        <td style="text-align: center; color: #d97706;">${r.izin || 0} Hari</td>
        <td style="text-align: center; color: #dc2626; font-weight: bold;">${r.alfa} Hari</td>
        <td>${r.keterangan || '-'}</td>
      </tr>
    `).join('') : `
      <tr>
        <td colspan="8" style="text-align: center; padding: 15px; color: #888;">Belum ada catatan presensi terdaftar untuk siswa ini.</td>
      </tr>
    `;

    const docHtml = `
      <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word" xmlns="http://www.w3.org/TR/REC-html40">
      <head>
        <meta charset="utf-8">
        <title>Laporan Presensi Siswa - ${student.nama}</title>
        <style>
          @page { size: A4 portrait; margin: 1.5cm; }
          body { font-family: 'Times New Roman', Times, serif; color: #000; line-height: 1.4; font-size: 10pt; }
          .kop-text { text-align: center; }
          .doc-title { text-align: center; margin-bottom: 15px; }
          .doc-title h3 { margin: 0; font-size: 13pt; font-weight: bold; text-transform: uppercase; text-decoration: underline; }
          .data-table { width: 100%; border-collapse: collapse; margin-bottom: 15px; font-size: 9.5pt; }
          .data-table th { background-color: #f1f5f9; font-weight: bold; padding: 6px; border: 1px solid #000; text-align: center; }
          .data-table td { padding: 5px; border: 1px solid #000; }
          .sig-table { width: 100%; border-collapse: collapse; margin-top: 25px; page-break-inside: avoid; }
          .sig-table td { width: 33%; text-align: center; vertical-align: top; font-size: 10pt; }
          .sig-space { height: 50px; }
          .sig-name { font-weight: bold; text-decoration: underline; }
        </style>
      </head>
      <body>
        <div class="kop-text" style="border-bottom: 3px double #000; padding-bottom: 5px; margin-bottom: 15px;">
          <span style="font-size: 11pt; font-weight: bold; text-transform: uppercase;">PEMERINTAH KOTA TANGERANG SELATAN</span><br/>
          <span style="font-size: 10.5pt; font-weight: bold; text-transform: uppercase;">DINAS PENDIDIKAN DAN KEBUDAYAAN</span><br/>
          <span style="font-size: 13pt; font-weight: bold; text-transform: uppercase;">UPTD SMP NEGERI 17 KOTA TANGERANG SELATAN</span><br/>
          <span style="font-size: 8.5pt; font-style: italic;">Jl. Melati III No.2, Komplek Batan Indah, Kec. Setu, Kota Tangerang Selatan, Banten 15314</span>
        </div>

        <div class="doc-title">
          <h3>LAPORAN REKAPITULASI PRESENSI INDIVIDUAL SISWA</h3>
          <p>NAMA: <b>${student.nama.toUpperCase()}</b> | NIS: <b>${student.nis || '-'}</b> | KELAS: <b>${namaKelas}</b></p>
        </div>

        <table style="width:100%; border-collapse:collapse; margin-bottom:12px; background:#f8fafc; border:1px solid #ccc; font-size:9.5pt;">
          <tr>
            <td style="padding:6px; font-bold">Total Kehadiran: <b>${totalHadir} Hari</b></td>
            <td style="padding:6px;">Total Sakit: <b>${totalSakit} Hari</b></td>
            <td style="padding:6px;">Total Izin: <b>${totalIzin} Hari</b></td>
            <td style="padding:6px;">Total Alfa: <b>${totalAlfa} Hari</b></td>
            <td style="padding:6px; font-weight:bold; color:#047857;">Persentase: <b>${pct}%</b></td>
          </tr>
        </table>

        <table class="data-table">
          <thead>
            <tr>
              <th style="width: 5%;">No</th>
              <th style="width: 15%;">Minggu</th>
              <th style="width: 15%;">Bulan / Tahun</th>
              <th style="width: 12%;">Hadir</th>
              <th style="width: 12%;">Sakit</th>
              <th style="width: 12%;">Izin</th>
              <th style="width: 12%;">Alfa</th>
              <th style="width: 17%;">Keterangan</th>
            </tr>
          </thead>
          <tbody>
            ${rowsHtml}
          </tbody>
        </table>

        <table class="sig-table">
          <tr>
            <td>
              <div>Mengetahui,</div>
              <div><b>Kepala Sekolah</b></div>
              <div class="sig-space"></div>
              <div class="sig-name">Drs. H. M. Syarif, M.Pd</div>
              <div>NIP. 19680512 199412 1 002</div>
            </td>
            <td>
              <div>Tangerang Selatan, ${dateTodayStr}</div>
              <div><b>Wali Kelas ${namaKelas}</b></div>
              <div class="sig-space"></div>
              <div class="sig-name">${waliKelasName}</div>
            </td>
            <td>
              <div>Mengetahui,</div>
              <div><b>Guru Bimbingan Konseling (BK)</b></div>
              <div class="sig-space"></div>
              <div class="sig-name">${guruBkName}</div>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `;

    const blob = new Blob(['\ufeff' + docHtml], { type: 'application/msword;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    const safeName = student.nama.replace(/[^a-zA-Z0-9]/g, '_');
    link.download = `Laporan_Presensi_Siswa_${safeName}.doc`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleDownloadKelasDoc = (targetClassName: string) => {
    if (!db) return;
    const targetKelas = db.kelas.find(c => c.namaKelas.toLowerCase().trim() === targetClassName.toLowerCase().trim() || c.id === targetClassName);
    const namaKelas = targetKelas?.namaKelas || targetClassName;
    const waliKelas = db.users.find(u => u.id === targetKelas?.waliKelasId) || currentUser;
    const waliKelasName = waliKelas?.nama || 'Wali Kelas';
    const guruBkName = db.users.find(u => (u.role as string) === 'bk' || ((u as any).jabatan && String((u as any).jabatan).toLowerCase().includes('bk')))?.nama || 'Guru BK';

    const dateTodayStr = new Date().toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });

    const studentRowsHtml = activeStudents.length > 0 ? activeStudents.map((s, idx) => {
      const records = db.kehadiran.filter(k => k.siswaId === s.id);
      let h = 0, sk = 0, iz = 0, al = 0;
      records.forEach(item => {
        h += Number(item.hadir || 0);
        sk += Number(item.sakit || 0);
        iz += Number(item.izin || (item as any).ijin || 0);
        al += Number(item.alfa || 0);
      });
      const tot = h + sk + iz + al;
      const pct = tot > 0 ? Math.round((h / tot) * 100) : 100;

      return `
        <tr>
          <td style="text-align: center;">${idx + 1}</td>
          <td><b>${s.nama}</b></td>
          <td style="text-align: center;">${s.nisn || s.nis || '-'}</td>
          <td style="text-align: center; color: #047857; font-weight: bold;">${h} Hari</td>
          <td style="text-align: center; color: #0284c7;">${sk} Hari</td>
          <td style="text-align: center; color: #d97706;">${iz} Hari</td>
          <td style="text-align: center; color: #dc2626; font-weight: bold;">${al} Hari</td>
          <td style="text-align: center; font-weight: bold;">${pct}%</td>
        </tr>
      `;
    }).join('') : `
      <tr>
        <td colspan="8" style="text-align: center; padding: 15px; color: #888;">Belum ada siswa terdaftar di kelas ini.</td>
      </tr>
    `;

    const docHtml = `
      <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word" xmlns="http://www.w3.org/TR/REC-html40">
      <head>
        <meta charset="utf-8">
        <title>Laporan Kehadiran Kelas - ${namaKelas}</title>
        <style>
          @page { size: A4 landscape; margin: 1.2cm 1.5cm; }
          body { font-family: 'Times New Roman', Times, serif; color: #000; line-height: 1.4; font-size: 10pt; }
          .kop-text { text-align: center; }
          .doc-title { text-align: center; margin-bottom: 15px; }
          .doc-title h3 { margin: 0; font-size: 13pt; font-weight: bold; text-transform: uppercase; text-decoration: underline; }
          .data-table { width: 100%; border-collapse: collapse; margin-bottom: 15px; font-size: 9.5pt; }
          .data-table th { background-color: #f1f5f9; font-weight: bold; padding: 6px; border: 1px solid #000; text-align: center; }
          .data-table td { padding: 5px; border: 1px solid #000; }
          .sig-table { width: 100%; border-collapse: collapse; margin-top: 25px; page-break-inside: avoid; }
          .sig-table td { width: 33%; text-align: center; vertical-align: top; font-size: 10pt; }
          .sig-space { height: 50px; }
          .sig-name { font-weight: bold; text-decoration: underline; }
        </style>
      </head>
      <body>
        <div class="kop-text" style="border-bottom: 3px double #000; padding-bottom: 5px; margin-bottom: 15px;">
          <span style="font-size: 11pt; font-weight: bold; text-transform: uppercase;">PEMERINTAH KOTA TANGERANG SELATAN</span><br/>
          <span style="font-size: 10.5pt; font-weight: bold; text-transform: uppercase;">DINAS PENDIDIKAN DAN KEBUDAYAAN</span><br/>
          <span style="font-size: 13pt; font-weight: bold; text-transform: uppercase;">UPTD SMP NEGERI 17 KOTA TANGERANG SELATAN</span><br/>
          <span style="font-size: 8.5pt; font-style: italic;">Jl. Melati III No.2, Komplek Batan Indah, Kec. Setu, Kota Tangerang Selatan, Banten 15314</span>
        </div>

        <div class="doc-title">
          <h3>LAPORAN REKAPITULASI PRESENSI KELAS KESELURUHAN</h3>
          <p>KELAS: <b>${namaKelas.toUpperCase()}</b> | TANGGAL CETAK: <b>${dateTodayStr}</b></p>
        </div>

        <table class="data-table">
          <thead>
            <tr>
              <th style="width: 5%;">No</th>
              <th style="width: 30%;">Nama Siswa</th>
              <th style="width: 15%;">NIS / NISN</th>
              <th style="width: 10%;">Hadir</th>
              <th style="width: 10%;">Sakit</th>
              <th style="width: 10%;">Izin</th>
              <th style="width: 10%;">Alfa</th>
              <th style="width: 10%;">% Kehadiran</th>
            </tr>
          </thead>
          <tbody>
            ${studentRowsHtml}
          </tbody>
        </table>

        <table class="sig-table">
          <tr>
            <td>
              <div>Mengetahui,</div>
              <div><b>Kepala Sekolah</b></div>
              <div class="sig-space"></div>
              <div class="sig-name">Drs. H. M. Syarif, M.Pd</div>
              <div>NIP. 19680512 199412 1 002</div>
            </td>
            <td>
              <div>Tangerang Selatan, ${dateTodayStr}</div>
              <div><b>Wali Kelas ${namaKelas}</b></div>
              <div class="sig-space"></div>
              <div class="sig-name">${waliKelasName}</div>
            </td>
            <td>
              <div>Mengetahui,</div>
              <div><b>Guru Bimbingan Konseling (BK)</b></div>
              <div class="sig-space"></div>
              <div class="sig-name">${guruBkName}</div>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `;

    const blob = new Blob(['\ufeff' + docHtml], { type: 'application/msword;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Laporan_Rekap_Kehadiran_Kelas_${namaKelas.replace(/\s+/g, '_')}.doc`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleOpenAddModal = () => {
    setEditingItem(null);
    const defaultSiswa = activeStudents[0]?.id || (db?.siswa[0]?.id || '');
    const defaultKelas = selectedClassId !== 'ALL' ? selectedClassId : (activeStudents[0] ? getStudentClassName(activeStudents[0]) : 'Kelas 8-1');

    setFormKehadiran({
      siswaId: defaultSiswa,
      kelas: defaultKelas,
      bulan: attendanceFilterBulan !== 'ALL' ? attendanceFilterBulan : 'Juli',
      mingguKe: attendanceFilterMinggu !== 'ALL' ? attendanceFilterMinggu : 'Minggu 1',
      tahun: '2026',
      hadir: 5,
      sakit: 0,
      izin: 0,
      alfa: 0,
      keterangan: 'Presensi mingguan terdata'
    });
    setShowModal(true);
  };

  const handleOpenEditModal = (item: Kehadiran) => {
    setEditingItem(item);
    setFormKehadiran({
      siswaId: item.siswaId,
      kelas: item.kelas || selectedClassId,
      bulan: item.bulan || 'Juli',
      mingguKe: item.mingguKe || 'Minggu 1',
      tahun: item.tahun || '2026',
      hadir: Number(item.hadir || 0),
      sakit: Number(item.sakit || 0),
      izin: Number(item.izin || (item as any).ijin || 0),
      alfa: Number(item.alfa || 0),
      keterangan: item.keterangan || ''
    });
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formKehadiran.siswaId) {
      alert('Silakan pilih siswa terlebih dahulu.');
      return;
    }

    const isNew = !editingItem;
    const selectedStudent = db?.siswa.find(s => s.id === formKehadiran.siswaId);
    const targetKelas = selectedStudent ? getStudentClassName(selectedStudent) : formKehadiran.kelas;

    const payload: Kehadiran = {
      id: editingItem ? editingItem.id : `khd-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      siswaId: formKehadiran.siswaId,
      kelas: targetKelas,
      bulan: formKehadiran.bulan,
      mingguKe: formKehadiran.mingguKe,
      tahun: formKehadiran.tahun || '2026',
      hadir: Number(formKehadiran.hadir || 0),
      sakit: Number(formKehadiran.sakit || 0),
      izin: Number(formKehadiran.izin || 0),
      alfa: Number(formKehadiran.alfa || 0),
      keterangan: formKehadiran.keterangan || 'Presensi mingguan terdata'
    };

    if (onSaveKehadiran) {
      await onSaveKehadiran(payload, isNew);
    }
    setShowModal(false);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus data rekap kehadiran ini?')) {
      if (onDeleteKehadiran) {
        await onDeleteKehadiran(id);
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 rounded-2xl p-6 text-white shadow-md relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 w-56 h-56 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-full text-[10px] font-extrabold uppercase tracking-wider inline-flex items-center gap-1.5">
                <Calendar size={13} /> Fitur Utama Rekap Kehadiran
              </span>
              {currentUser.role === UserRole.WALI_KELAS && (
                <span className="px-3 py-1 bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-full text-[10px] font-extrabold uppercase tracking-wider inline-flex items-center gap-1">
                  <GraduationCap size={13} /> Akses Wali Kelas
                </span>
              )}
            </div>
            <h2 className="text-xl md:text-2xl font-black text-white">
              Rekapitulasi Kehadiran Siswa
            </h2>
            <p className="text-xs text-emerald-200/80 mt-1 max-w-2xl leading-relaxed">
              Kelola data presensi mingguan, pantau statistik kehadiran siswa, cetak laporan resmi format DOC, dan input data kehadiran yang tersimpan secara permanen.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 self-start md:self-auto">
            <button
              onClick={() => handleDownloadKelasDoc(selectedClassId)}
              className="px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-xl text-xs font-black transition flex items-center gap-1.5 shadow-sm cursor-pointer"
            >
              <Download size={15} /> Unduh DOC Rekap Kelas
            </button>
            <button
              onClick={handleOpenAddModal}
              className="px-4 py-2.5 bg-white hover:bg-slate-100 text-slate-900 rounded-xl text-xs font-black transition flex items-center gap-1.5 shadow-sm cursor-pointer"
            >
              <Plus size={15} className="text-emerald-600" /> Input Presensi
            </button>
          </div>
        </div>

        {/* Metrics Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mt-6">
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-3.5 border border-white/10">
            <p className="text-[10px] text-emerald-200 uppercase font-extrabold tracking-wider">Persentase Kehadiran</p>
            <p className="text-2xl font-black text-emerald-300 mt-0.5">{classAttendanceMetrics.percentage}%</p>
            <div className="w-full bg-emerald-950/50 h-1.5 rounded-full overflow-hidden mt-2">
              <div className="bg-emerald-400 h-full rounded-full transition-all duration-500" style={{ width: `${classAttendanceMetrics.percentage}%` }} />
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-xl p-3.5 border border-white/10">
            <p className="text-[10px] text-emerald-200 uppercase font-extrabold tracking-wider">Total Hadir</p>
            <p className="text-2xl font-black text-emerald-300 mt-0.5">{classAttendanceMetrics.totalHadir} <span className="text-xs font-normal text-emerald-200">Hari</span></p>
            <p className="text-[9px] text-emerald-300/70 mt-1">Presensi Tepat Hari</p>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-xl p-3.5 border border-white/10">
            <p className="text-[10px] text-sky-200 uppercase font-extrabold tracking-wider">Total Sakit</p>
            <p className="text-2xl font-black text-sky-300 mt-0.5">{classAttendanceMetrics.totalSakit} <span className="text-xs font-normal text-sky-200">Hari</span></p>
            <p className="text-[9px] text-sky-300/70 mt-1">Sakit Keterangan Dokter</p>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-xl p-3.5 border border-white/10">
            <p className="text-[10px] text-amber-200 uppercase font-extrabold tracking-wider">Total Izin</p>
            <p className="text-2xl font-black text-amber-300 mt-0.5">{classAttendanceMetrics.totalIzin} <span className="text-xs font-normal text-amber-200">Hari</span></p>
            <p className="text-[9px] text-amber-300/70 mt-1">Izin Kepentingan Keluarga</p>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-xl p-3.5 border border-white/10 col-span-2 sm:col-span-1">
            <p className="text-[10px] text-rose-200 uppercase font-extrabold tracking-wider">Total Alfa</p>
            <p className="text-2xl font-black text-rose-300 mt-0.5">{classAttendanceMetrics.totalAlfa} <span className="text-xs font-normal text-rose-200">Hari</span></p>
            <p className="text-[9px] text-rose-300/70 mt-1">Tanpa Keterangan</p>
          </div>
        </div>
      </div>

      {/* Class & Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-xs space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Class Selection Dropdown */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-extrabold text-slate-700 flex items-center gap-1.5 shrink-0">
              <Users size={15} className="text-emerald-600" /> Kelas:
            </span>
            {currentUser.role === UserRole.WALI_KELAS ? (
              <select
                value={selectedClassId}
                onChange={(e) => setSelectedClassId(e.target.value)}
                className="px-3.5 py-2 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-xl text-xs font-extrabold focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
              >
                {assignedClasses.map(c => (
                  <option key={c.id} value={c.namaKelas}>
                    {c.namaKelas} (Wali Kelas)
                  </option>
                ))}
              </select>
            ) : (
              <select
                value={selectedClassId}
                onChange={(e) => setSelectedClassId(e.target.value)}
                className="px-3.5 py-2 bg-slate-50 border border-slate-200 text-slate-800 rounded-xl text-xs font-extrabold focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
              >
                <option value="ALL">Semua Kelas (Tampilkan Semua)</option>
                {db?.kelas.map(c => (
                  <option key={c.id} value={c.namaKelas}>
                    {c.namaKelas}
                  </option>
                ))}
              </select>
            )}
            <span className="text-[11px] text-slate-400 font-semibold hidden sm:inline">
              ({activeStudents.length} siswa terdaftar)
            </span>
          </div>

          {/* Month & Week Filters + Search Input */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5">
              <span className="text-[11px] font-bold text-slate-500">Bulan:</span>
              <select
                value={attendanceFilterBulan}
                onChange={(e) => setAttendanceFilterBulan(e.target.value)}
                className="bg-transparent text-xs font-bold text-slate-700 focus:outline-none cursor-pointer"
              >
                <option value="ALL">Semua Bulan</option>
                <option value="Januari">Januari</option>
                <option value="Februari">Februari</option>
                <option value="Maret">Maret</option>
                <option value="April">April</option>
                <option value="Mei">Mei</option>
                <option value="Juni">Juni</option>
                <option value="Juli">Juli</option>
                <option value="Agustus">Agustus</option>
                <option value="September">September</option>
                <option value="Oktober">Oktober</option>
                <option value="November">November</option>
                <option value="Desember">Desember</option>
              </select>
            </div>

            <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5">
              <span className="text-[11px] font-bold text-slate-500">Minggu:</span>
              <select
                value={attendanceFilterMinggu}
                onChange={(e) => setAttendanceFilterMinggu(e.target.value)}
                className="bg-transparent text-xs font-bold text-slate-700 focus:outline-none cursor-pointer"
              >
                <option value="ALL">Semua Minggu</option>
                <option value="Minggu 1">Minggu 1</option>
                <option value="Minggu 2">Minggu 2</option>
                <option value="Minggu 3">Minggu 3</option>
                <option value="Minggu 4">Minggu 4</option>
                <option value="Minggu 5">Minggu 5</option>
              </select>
            </div>

            <div className="relative flex-1 sm:w-48">
              <Search size={14} className="absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                placeholder="Cari siswa / NIS..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Weekly Breakdown Cards */}
      <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs space-y-4">
        <h3 className="text-sm font-extrabold text-slate-800 flex items-center gap-2">
          <BarChart2 size={16} className="text-emerald-600" />
          Visualisasi & Ringkasan Presensi Per Minggu
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
          {weeklyBreakdownStats.map((wStat) => {
            const pct = wStat.percentage;
            let pctBg = 'bg-emerald-500';
            let pctText = 'text-emerald-700';
            let cardBorder = 'border-slate-100';

            if (pct < 70) {
              pctBg = 'bg-rose-500';
              pctText = 'text-rose-700';
              cardBorder = 'border-rose-200 bg-rose-50/20';
            } else if (pct < 85) {
              pctBg = 'bg-amber-500';
              pctText = 'text-amber-700';
              cardBorder = 'border-amber-200 bg-amber-50/20';
            }

            return (
              <div key={wStat.weekLabel} className={`p-3.5 rounded-xl border ${cardBorder} bg-white shadow-2xs hover:shadow-md transition flex flex-col justify-between space-y-3`}>
                <div>
                  <div className="flex items-center justify-between gap-1 mb-1.5">
                    <span className="font-black text-xs text-slate-800">{wStat.weekLabel}</span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${pctText} bg-slate-100`}>
                      {pct}%
                    </span>
                  </div>

                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden mb-2">
                    <div className={`${pctBg} h-full rounded-full transition-all duration-500`} style={{ width: `${pct}%` }} />
                  </div>

                  <div className="grid grid-cols-2 gap-1 text-[10px] pt-1">
                    <div className="bg-emerald-50 text-emerald-800 px-2 py-1 rounded font-semibold text-center">
                      Hadir: <b>{wStat.hadir}</b>
                    </div>
                    <div className="bg-sky-50 text-sky-800 px-2 py-1 rounded font-semibold text-center">
                      Sakit: <b>{wStat.sakit}</b>
                    </div>
                    <div className="bg-amber-50 text-amber-800 px-2 py-1 rounded font-semibold text-center">
                      Izin: <b>{wStat.izin}</b>
                    </div>
                    <div className="bg-rose-50 text-rose-800 px-2 py-1 rounded font-semibold text-center">
                      Alfa: <b>{wStat.alfa}</b>
                    </div>
                  </div>
                </div>

                <div className="text-[10px] text-slate-400 font-medium text-center border-t border-slate-100 pt-2">
                  {wStat.recordCount} catatan siswa
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Attendance Table */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-xs overflow-hidden">
        <div className="p-4 bg-slate-50/60 border-b border-slate-100 flex items-center justify-between gap-3">
          <div>
            <h3 className="font-extrabold text-slate-800 text-xs flex items-center gap-2">
              <Calendar size={15} className="text-emerald-600" />
              Daftar Rekapitulasi Presensi Terdaftar ({filteredKehadiran.length} data)
            </h3>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Data presensi yang diinput tersimpan secara permanen dan dapat diubah/dihapus sewaktu-waktu.
            </p>
          </div>

          <button
            onClick={handleOpenAddModal}
            className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-extrabold transition flex items-center gap-1.5 shadow-xs cursor-pointer shrink-0"
          >
            <Plus size={14} /> Input Presensi Baru
          </button>
        </div>

        {filteredKehadiran.length === 0 ? (
          <div className="py-14 text-center p-6 space-y-3">
            <Calendar size={36} className="mx-auto text-slate-300" />
            <div className="space-y-1">
              <p className="font-extrabold text-slate-700 text-sm">Belum Ada Rekap Presensi Terdaftar</p>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                Silakan klik tombol <strong className="text-slate-600">"Input Presensi Baru"</strong> di atas untuk menginput catatan presensi siswa kelas Anda.
              </p>
            </div>
            <button
              onClick={handleOpenAddModal}
              className="mt-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition inline-flex items-center gap-1.5 cursor-pointer"
            >
              <Plus size={14} /> Input Presensi Sekarang
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                  <th className="p-3.5">Nama Siswa & NIS</th>
                  <th className="p-3.5">Kelas</th>
                  <th className="p-3.5">Minggu & Periode</th>
                  <th className="p-3.5 text-center">Hadir</th>
                  <th className="p-3.5 text-center">Sakit</th>
                  <th className="p-3.5 text-center">Izin</th>
                  <th className="p-3.5 text-center">Alfa</th>
                  <th className="p-3.5">Keterangan</th>
                  <th className="p-3.5 text-center bg-emerald-50/50 text-emerald-800">Unduh DOC Siswa</th>
                  <th className="p-3.5 text-center">Aksi (Ubah & Hapus)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {filteredKehadiran.map((att) => {
                  const info = getSiswaInfo(db, att.siswaId, att);
                  return (
                    <tr key={att.id} className="hover:bg-slate-50/50 transition">
                      <td className="p-3.5">
                        <p className="font-bold text-slate-900">{info.nama}</p>
                        <p className="text-[10px] text-slate-400">NIS: {info.nis}</p>
                      </td>
                      <td className="p-3.5">
                        <span className="px-2.5 py-1 rounded-md text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-100">
                          {att.kelas || info.kelasName || selectedClassId}
                        </span>
                      </td>
                      <td className="p-3.5">
                        <p className="font-extrabold text-slate-800">{att.mingguKe}</p>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{att.bulan} {att.tahun}</p>
                      </td>
                      <td className="p-3.5 text-center">
                        <span className="bg-emerald-50 text-emerald-700 font-extrabold px-2.5 py-1 rounded-md border border-emerald-100 text-[10px]">
                          {att.hadir} Hari
                        </span>
                      </td>
                      <td className="p-3.5 text-center">
                        <span className="bg-sky-50 text-sky-700 font-extrabold px-2.5 py-1 rounded-md border border-sky-100 text-[10px]">
                          {att.sakit} Hari
                        </span>
                      </td>
                      <td className="p-3.5 text-center">
                        <span className="bg-amber-50 text-amber-700 font-extrabold px-2.5 py-1 rounded-md border border-amber-100 text-[10px]">
                          {att.izin || (att as any).ijin || att.izin === 0 ? att.izin : 0} Hari
                        </span>
                      </td>
                      <td className="p-3.5 text-center">
                        <span className="bg-rose-50 text-rose-700 font-extrabold px-2.5 py-1 rounded-md border border-rose-100 text-[10px]">
                          {att.alfa} Hari
                        </span>
                      </td>
                      <td className="p-3.5 text-slate-600 max-w-xs truncate" title={att.keterangan || '-'}>
                        {att.keterangan || '-'}
                      </td>
                      <td className="p-3.5 text-center bg-emerald-50/20">
                        <button
                          onClick={() => handleDownloadSiswaDoc(att.siswaId)}
                          className="px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[10px] font-extrabold transition inline-flex items-center gap-1 shadow-xs cursor-pointer"
                          title="Unduh Laporan Format DOC per-Siswa"
                        >
                          <FileDown size={12} /> Doc Siswa
                        </button>
                      </td>
                      <td className="p-3.5 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => handleOpenEditModal(att)}
                            className="p-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-lg transition cursor-pointer"
                            title="Ubah / Edit Data Presensi"
                          >
                            <Edit size={14} />
                          </button>
                          <button
                            onClick={() => handleDelete(att.id)}
                            className="p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-lg transition cursor-pointer"
                            title="Hapus Data Presensi"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Input / Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl overflow-hidden border border-slate-100 my-8">
            <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-emerald-500/20 text-emerald-400 rounded-xl">
                  <Calendar size={18} />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm text-white">
                    {editingItem ? 'Edit Rekap Presensi Siswa' : 'Input Presensi Siswa Baru'}
                  </h3>
                  <p className="text-[10px] text-slate-400">
                    Formulir penginputan kehadiran siswa yang tersimpan secara permanen.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg transition cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
              {/* Student Selector */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Pilih Siswa <span className="text-rose-500">*</span>
                </label>
                <select
                  value={formKehadiran.siswaId}
                  onChange={(e) => setFormKehadiran({ ...formKehadiran, siswaId: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  required
                >
                  <option value="">-- Pilih Siswa --</option>
                  {activeStudents.map(s => (
                    <option key={s.id} value={s.id}>
                      {s.nama} ({s.nis ? `NIS: ${s.nis}` : 'Tidak ada NIS'})
                    </option>
                  ))}
                </select>
              </div>

              {/* Bulan & Minggu & Tahun */}
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Bulan</label>
                  <select
                    value={formKehadiran.bulan}
                    onChange={(e) => setFormKehadiran({ ...formKehadiran, bulan: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    {['Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember', 'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni'].map(m => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Minggu Ke</label>
                  <select
                    value={formKehadiran.mingguKe}
                    onChange={(e) => setFormKehadiran({ ...formKehadiran, mingguKe: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    {['Minggu 1', 'Minggu 2', 'Minggu 3', 'Minggu 4', 'Minggu 5'].map(w => (
                      <option key={w} value={w}>{w}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Tahun</label>
                  <input
                    type="text"
                    value={formKehadiran.tahun}
                    onChange={(e) => setFormKehadiran({ ...formKehadiran, tahun: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              {/* Attendance Breakdown (Hadir, Sakit, Izin, Alfa) */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
                <p className="font-extrabold text-slate-800 text-[11px] uppercase tracking-wider">
                  Rincian Presensi Mingguan (Jumlah Hari)
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div>
                    <label className="block font-bold text-emerald-800 mb-1">Hadir</label>
                    <input
                      type="number"
                      min="0"
                      max="7"
                      value={formKehadiran.hadir}
                      onChange={(e) => setFormKehadiran({ ...formKehadiran, hadir: Number(e.target.value) })}
                      className="w-full px-3 py-2 bg-white border border-emerald-300 rounded-xl font-extrabold text-emerald-900 text-center"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-sky-800 mb-1">Sakit</label>
                    <input
                      type="number"
                      min="0"
                      max="7"
                      value={formKehadiran.sakit}
                      onChange={(e) => setFormKehadiran({ ...formKehadiran, sakit: Number(e.target.value) })}
                      className="w-full px-3 py-2 bg-white border border-sky-300 rounded-xl font-extrabold text-sky-900 text-center"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-amber-800 mb-1">Izin</label>
                    <input
                      type="number"
                      min="0"
                      max="7"
                      value={formKehadiran.izin}
                      onChange={(e) => setFormKehadiran({ ...formKehadiran, izin: Number(e.target.value) })}
                      className="w-full px-3 py-2 bg-white border border-amber-300 rounded-xl font-extrabold text-amber-900 text-center"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-rose-800 mb-1">Alfa</label>
                    <input
                      type="number"
                      min="0"
                      max="7"
                      value={formKehadiran.alfa}
                      onChange={(e) => setFormKehadiran({ ...formKehadiran, alfa: Number(e.target.value) })}
                      className="w-full px-3 py-2 bg-white border border-rose-300 rounded-xl font-extrabold text-rose-900 text-center"
                    />
                  </div>
                </div>
              </div>

              {/* Keterangan */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">Keterangan / Catatan Presensi</label>
                <input
                  type="text"
                  placeholder="Contoh: Presensi mingguan terdata..."
                  value={formKehadiran.keterangan}
                  onChange={(e) => setFormKehadiran({ ...formKehadiran, keterangan: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-xl transition shadow-xs cursor-pointer flex items-center gap-1.5"
                >
                  <CheckCircle2 size={15} /> Simpan Presensi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
