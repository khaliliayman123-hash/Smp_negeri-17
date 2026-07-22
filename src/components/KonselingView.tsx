/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { 
  Plus, 
  Search, 
  MessageSquare, 
  AlertTriangle, 
  Award, 
  Heart, 
  Home, 
  Trash2, 
  Edit3, 
  Calendar,
  User,
  Activity,
  FileSpreadsheet,
  X,
  Printer,
  FileText,
  Calculator,
  TrendingDown,
  FileDown,
  BarChart2,
  PieChart,
  Users,
  CheckCircle2,
  Filter,
  Download
} from 'lucide-react';
import html2canvas from 'html2canvas';
import { 
  DatabaseState, 
  User as AppUser, 
  UserRole,
  Konseling,
  Pelanggaran,
  RemisiPoin,
  Prestasi,
  Asesmen,
  HomeVisit,
  Kehadiran
} from '../types';

interface KonselingViewProps {
  db: DatabaseState;
  currentUser: AppUser;
  onSaveKonseling: (k: Konseling, isNew: boolean) => Promise<boolean>;
  onDeleteKonseling: (id: string) => Promise<boolean>;
  onSavePelanggaran: (p: Pelanggaran, isNew: boolean) => Promise<boolean>;
  onDeletePelanggaran: (id: string) => Promise<boolean>;
  onSaveRemisiPoin: (r: RemisiPoin, isNew: boolean) => Promise<boolean>;
  onDeleteRemisiPoin: (id: string) => Promise<boolean>;
  onSavePrestasi: (p: Prestasi, isNew: boolean) => Promise<boolean>;
  onDeletePrestasi: (id: string) => Promise<boolean>;
  onSaveAsesmen: (a: Asesmen, isNew: boolean) => Promise<boolean>;
  onDeleteAsesmen: (id: string) => Promise<boolean>;
  onSaveHomeVisit: (h: HomeVisit, isNew: boolean) => Promise<boolean>;
  onDeleteHomeVisit: (id: string) => Promise<boolean>;
  onSaveKehadiran?: (k: Kehadiran, isNew: boolean) => Promise<boolean>;
  onDeleteKehadiran?: (id: string) => Promise<boolean>;
}

type CounselingSubTab = 'konseling' | 'pelanggaran' | 'remisi' | 'prestasi' | 'asesmen' | 'homevisit' | 'kehadiran';

export default function KonselingView({
  db,
  currentUser,
  onSaveKonseling,
  onDeleteKonseling,
  onSavePelanggaran,
  onDeletePelanggaran,
  onSaveRemisiPoin,
  onDeleteRemisiPoin,
  onSavePrestasi,
  onDeletePrestasi,
  onSaveAsesmen,
  onDeleteAsesmen,
  onSaveHomeVisit,
  onDeleteHomeVisit,
  onSaveKehadiran,
  onDeleteKehadiran
}: KonselingViewProps) {

  // Tabs routing state
  const [activeTab, setActiveTab] = useState<CounselingSubTab>(() => {
    if (currentUser.role === UserRole.GURU_PIKET) return 'pelanggaran';
    return 'konseling';
  });

  const canModify = currentUser.role === UserRole.ADMIN || 
                    currentUser.role === UserRole.GURU_BK ||
                    (currentUser.role === UserRole.GURU_PIKET && (activeTab === 'pelanggaran' || activeTab === 'remisi'));
  const [searchQuery, setSearchQuery] = useState('');
  const [attendanceFilterKelas, setAttendanceFilterKelas] = useState<string>('ALL');
  const [attendanceFilterBulan, setAttendanceFilterBulan] = useState<string>('ALL');

  // State for Remisi and Poin summary dashboard
  const [selectedSummarySiswaId, setSelectedSummarySiswaId] = useState<string>('');

  // States for PNG generation of Lembar Keterangan
  const [generatedPngUrl, setGeneratedPngUrl] = useState<string | null>(null);
  const [isGeneratingPng, setIsGeneratingPng] = useState(false);
  const [generatedSiswaNama, setGeneratedSiswaNama] = useState<string>('');

  // Selected entities for edit modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Custom delete confirmation states
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Form states depending on activeTab
  const [formKonseling, setFormKonseling] = useState<Partial<Konseling>>({});
  const [formPelanggaran, setFormPelanggaran] = useState<Partial<Pelanggaran>>({});
  const [formRemisiPoin, setFormRemisiPoin] = useState<Partial<RemisiPoin>>({});
  const [formPrestasi, setFormPrestasi] = useState<Partial<Prestasi>>({});
  const [formAsesmen, setFormAsesmen] = useState<Partial<Asesmen>>({});
  const [formHomeVisit, setFormHomeVisit] = useState<Partial<HomeVisit>>({});
  const [formKehadiran, setFormKehadiran] = useState<Partial<Kehadiran>>({});

  // Reset states and open editor modal
  const openEditor = (entity: any | null) => {
    if (!canModify) return;
    const isNew = !entity;
    setEditingId(isNew ? null : entity.id);

    if (activeTab === 'konseling') {
      setFormKonseling(isNew ? {
        id: `kon-${Date.now()}`,
        nomorKonseling: `BK-${new Date().getFullYear()}-${Math.floor(Math.random() * 900) + 100}`,
        siswaId: db.siswa[0]?.id || '',
        tanggal: new Date().toISOString().split('T')[0],
        jenis: 'Individu',
        guruBkId: currentUser.id,
        permasalahan: '',
        analisis: '',
        solusi: '',
        hasil: '',
        tindakLanjut: ''
      } : entity);
    } else if (activeTab === 'pelanggaran') {
      setFormPelanggaran(isNew ? {
        id: `pel-${Date.now()}`,
        siswaId: db.siswa[0]?.id || '',
        tanggal: new Date().toISOString().split('T')[0],
        jenisPelanggaran: '',
        kategori: 'Ringan',
        poin: 5,
        guruPelapor: currentUser.nama,
        tindakLanjut: '',
        status: 'Belum Ditindak'
      } : entity);
    } else if (activeTab === 'remisi') {
      setFormRemisiPoin(isNew ? {
        id: `rem-${Date.now()}`,
        siswaId: db.siswa[0]?.id || '',
        tanggal: new Date().toISOString().split('T')[0],
        jenisRemisi: '',
        kategori: 'Karakter Baik',
        poin: 10,
        guruPemberi: currentUser.nama,
        keterangan: ''
      } : entity);
    } else if (activeTab === 'prestasi') {
      setFormPrestasi(isNew ? {
        id: `pres-${Date.now()}`,
        siswaId: db.siswa[0]?.id || '',
        namaPrestasi: '',
        tingkat: 'Sekolah',
        tahun: new Date().getFullYear().toString(),
        juara: 'Juara I'
      } : entity);
    } else if (activeTab === 'asesmen') {
      setFormAsesmen(isNew ? {
        id: `ase-${Date.now()}`,
        siswaId: db.siswa[0]?.id || '',
        akpd: '-',
        dcm: '-',
        aum: '-',
        iq: 100,
        bakat: '-',
        minat: '-'
      } : entity);
    } else if (activeTab === 'homevisit') {
      setFormHomeVisit(isNew ? {
        id: `hv-${Date.now()}`,
        siswaId: db.siswa[0]?.id || '',
        tanggal: new Date().toISOString().split('T')[0],
        tujuan: '',
        hasil: ''
      } : entity);
    } else if (activeTab === 'kehadiran') {
      setFormKehadiran(isNew ? {
        id: `att-${Date.now()}`,
        siswaId: db.siswa[0]?.id || '',
        mingguKe: 'Minggu 1',
        bulan: 'Juli',
        tahun: '2026',
        hadir: 5,
        sakit: 0,
        izin: 0,
        alfa: 0,
        keterangan: ''
      } : entity);
    }

    setIsModalOpen(true);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const isNew = !editingId;
    let success = false;

    if (activeTab === 'konseling') {
      success = await onSaveKonseling(formKonseling as Konseling, isNew);
    } else if (activeTab === 'pelanggaran') {
      success = await onSavePelanggaran(formPelanggaran as Pelanggaran, isNew);
    } else if (activeTab === 'remisi') {
      success = await onSaveRemisiPoin(formRemisiPoin as RemisiPoin, isNew);
    } else if (activeTab === 'prestasi') {
      success = await onSavePrestasi(formPrestasi as Prestasi, isNew);
    } else if (activeTab === 'asesmen') {
      success = await onSaveAsesmen(formAsesmen as Asesmen, isNew);
    } else if (activeTab === 'homevisit') {
      success = await onSaveHomeVisit(formHomeVisit as HomeVisit, isNew);
    } else if (activeTab === 'kehadiran' && onSaveKehadiran) {
      success = await onSaveKehadiran(formKehadiran as Kehadiran, isNew);
    }

    if (success) {
      setIsModalOpen(false);
    }
  };

  const handleDelete = (id: string) => {
    if (!canModify) return;
    setDeleteConfirmId(id);
  };

  const confirmDelete = async () => {
    if (!deleteConfirmId) return;
    setIsDeleting(true);
    try {
      const id = deleteConfirmId;
      if (activeTab === 'konseling') await onDeleteKonseling(id);
      else if (activeTab === 'pelanggaran') await onDeletePelanggaran(id);
      else if (activeTab === 'remisi') await onDeleteRemisiPoin(id);
      else if (activeTab === 'prestasi') await onDeletePrestasi(id);
      else if (activeTab === 'asesmen') await onDeleteAsesmen(id);
      else if (activeTab === 'homevisit') await onDeleteHomeVisit(id);
      else if (activeTab === 'kehadiran' && onDeleteKehadiran) await onDeleteKehadiran(id);
    } catch (e) {
      console.error(e);
    } finally {
      setIsDeleting(false);
      setDeleteConfirmId(null);
    }
  };

  // Memoized lists filtered by Search
  const filteredList = useMemo(() => {
    const q = searchQuery.toLowerCase();
    
    if (activeTab === 'konseling') {
      return db.konseling.filter(k => {
        const siswa = db.siswa.find(s => s.id === k.siswaId);
        const siswaNama = String(siswa?.nama || '').toLowerCase();
        const nomorKonseling = String(k.nomorKonseling || '').toLowerCase();
        const permasalahan = String(k.permasalahan || '').toLowerCase();
        return (siswaNama.includes(q) || nomorKonseling.includes(q) || permasalahan.includes(q));
      });
    } else if (activeTab === 'pelanggaran') {
      return db.pelanggaran.filter(p => {
        const siswa = db.siswa.find(s => s.id === p.siswaId);
        const siswaNama = String(siswa?.nama || '').toLowerCase();
        const jenisPelanggaran = String(p.jenisPelanggaran || '').toLowerCase();
        const kategori = String(p.kategori || '').toLowerCase();
        return (siswaNama.includes(q) || jenisPelanggaran.includes(q) || kategori.includes(q));
      });
    } else if (activeTab === 'remisi') {
      return (db.remisiPoin || []).filter(r => {
        const siswa = db.siswa.find(s => s.id === r.siswaId);
        const siswaNama = String(siswa?.nama || '').toLowerCase();
        const jenisRemisi = String(r.jenisRemisi || '').toLowerCase();
        const kategori = String(r.kategori || '').toLowerCase();
        return (siswaNama.includes(q) || jenisRemisi.includes(q) || kategori.includes(q));
      });
    } else if (activeTab === 'prestasi') {
      return db.prestasi.filter(p => {
        const siswa = db.siswa.find(s => s.id === p.siswaId);
        const siswaNama = String(siswa?.nama || '').toLowerCase();
        const namaPrestasi = String(p.namaPrestasi || '').toLowerCase();
        const tingkat = String(p.tingkat || '').toLowerCase();
        return (siswaNama.includes(q) || namaPrestasi.includes(q) || tingkat.includes(q));
      });
    } else if (activeTab === 'asesmen') {
      return db.asesmen.filter(a => {
        const siswa = db.siswa.find(s => s.id === a.siswaId);
        const siswaNama = String(siswa?.nama || '').toLowerCase();
        const akpd = String(a.akpd || '').toLowerCase();
        const iq = String(a.iq || '').toLowerCase();
        return (siswaNama.includes(q) || akpd.includes(q) || iq.includes(q));
      });
    } else if (activeTab === 'homevisit') {
      return db.homeVisit.filter(h => {
        const siswa = db.siswa.find(s => s.id === h.siswaId);
        const siswaNama = String(siswa?.nama || '').toLowerCase();
        const tujuan = String(h.tujuan || '').toLowerCase();
        const hasil = String(h.hasil || '').toLowerCase();
        return (siswaNama.includes(q) || tujuan.includes(q) || hasil.includes(q));
      });
    } else if (activeTab === 'kehadiran') {
      return (db.kehadiran || []).filter(h => {
        const siswa = db.siswa.find(s => s.id === h.siswaId);
        const siswaNama = String(siswa?.nama || '').toLowerCase();
        const mingguKe = String(h.mingguKe || '').toLowerCase();
        const bulan = String(h.bulan || '').toLowerCase();
        const keterangan = String(h.keterangan || '').toLowerCase();

        const matchSearch = (siswaNama.includes(q) || mingguKe.includes(q) || bulan.includes(q) || keterangan.includes(q));

        let matchKelas = true;
        if (attendanceFilterKelas !== 'ALL') {
          const targetKelas = db.kelas.find(c => c.id === attendanceFilterKelas);
          if (targetKelas) {
            matchKelas = siswa?.kelasId === targetKelas.id || siswa?.kelasId === targetKelas.namaKelas || targetKelas.namaKelas.toLowerCase().trim() === String(siswa?.kelasId).toLowerCase().trim();
          } else {
            matchKelas = siswa?.kelasId === attendanceFilterKelas;
          }
        }

        let matchBulan = true;
        if (attendanceFilterBulan !== 'ALL') {
          matchBulan = String(h.bulan || '').toLowerCase().trim() === attendanceFilterBulan.toLowerCase().trim();
        }

        return matchSearch && matchKelas && matchBulan;
      });
    }
    return [];
  }, [db, activeTab, searchQuery, attendanceFilterKelas, attendanceFilterBulan]);

  // Memoized calculations for students who have violations or remissions
  const studentPointSummaries = useMemo(() => {
    return db.siswa.map(siswa => {
      const kelas = db.kelas.find(c => c.id === siswa.kelasId || c.namaKelas.toLowerCase().trim() === siswa.kelasId?.toLowerCase().trim());
      const kelasName = kelas?.namaKelas || siswa.kelasId || 'Kelas Tidak Terdata';
      const pelanggaranList = db.pelanggaran.filter(p => p.siswaId === siswa.id);
      const totalPelanggaran = pelanggaranList.reduce((sum, p) => sum + (p.poin || 0), 0);
      
      const remisiList = (db.remisiPoin || []).filter(r => r.siswaId === siswa.id);
      const totalRemisi = remisiList.reduce((sum, r) => sum + (r.poin || 0), 0);
      
      const sisaPoin = Math.max(0, totalPelanggaran - totalRemisi);
      
      // Define level and behavior recommendation
      let statusColor = 'bg-emerald-50 text-emerald-700 border-emerald-100';
      let statusLabel = 'Sangat Baik (Sadar Disiplin)';
      let rekomendasi = 'Siswa menunjukkan sikap kepatuhan yang luar biasa dan sadar tata tertib.';
      
      if (sisaPoin > 0 && sisaPoin <= 20) {
        statusColor = 'bg-teal-50 text-teal-700 border-teal-100';
        statusLabel = 'Baik';
        rekomendasi = 'Tingkatkan kesadaran disiplin dan pertahankan prestasi perilaku terpuji.';
      } else if (sisaPoin > 20 && sisaPoin <= 50) {
        statusColor = 'bg-amber-50 text-amber-700 border-amber-100';
        statusLabel = 'Cukup (Pembinaan Ringan)';
        rekomendasi = 'Siswa memerlukan bimbingan ringan dari wali kelas untuk mereduksi potensi pelanggaran.';
      } else if (sisaPoin > 50 && sisaPoin <= 75) {
        statusColor = 'bg-orange-50 text-orange-700 border-orange-100';
        statusLabel = 'Peringatan I (Pembinaan BK)';
        rekomendasi = 'Siswa wajib mengikuti konseling terprogram bersama konselor BK untuk refleksi perilaku.';
      } else if (sisaPoin > 75 && sisaPoin <= 150) {
        statusColor = 'bg-rose-50 text-rose-700 border-rose-100';
        statusLabel = 'Peringatan II / SP';
        rekomendasi = 'Siswa dalam kondisi kritis kedisiplinan. Surat Perjanjian Khusus dan pemanggilan orang tua diperlukan.';
      } else if (sisaPoin > 150) {
        statusColor = 'bg-red-50 text-red-700 border-red-100';
        statusLabel = 'Sanksi Berat / Skorsing';
        rekomendasi = 'Kasus siswa dirujuk ke sidang dewan guru dan kepala sekolah untuk penetapan sanksi akademik.';
      }

      return {
        siswa,
        kelasName,
        totalPelanggaran,
        totalRemisi,
        sisaPoin,
        pelanggaranList,
        remisiList,
        statusColor,
        statusLabel,
        rekomendasi
      };
    });
  }, [db]);

  const handlePrintKeteranganPoin = (siswaId: string) => {
    const summary = studentPointSummaries.find(s => s.siswa.id === siswaId);
    if (!summary) {
      alert('Tidak ada ringkasan poin kedisiplinan untuk siswa yang dipilih.');
      return;
    }

    const { siswa, kelasName, totalPelanggaran, totalRemisi, sisaPoin, pelanggaranList, remisiList, statusLabel } = summary;
    
    const dateTodayStr = new Date().toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });

    const docHtml = `
      <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word" xmlns="http://www.w3.org/TR/REC-html40">
      <head>
        <meta charset="utf-8">
        <title>Lembar Keterangan - ${siswa.nama}</title>
        <style>
          @page {
            size: A4;
            margin: 1.2cm 1.5cm 1.2cm 1.5cm;
          }
          body {
            font-family: 'Times New Roman', Times, serif;
            color: #000000;
            line-height: 1.3;
            font-size: 10.5pt;
          }
          .doc-title {
            text-align: center;
            margin-bottom: 15px;
          }
          .doc-title h3 {
            margin: 0;
            font-size: 11pt;
            font-weight: bold;
            text-transform: uppercase;
            text-decoration: underline;
          }
          .doc-title p {
            margin: 3px 0 0 0;
            font-size: 9.5pt;
            font-family: 'Courier New', Courier, monospace;
          }
          .preamble {
            font-size: 10.5pt;
            margin-bottom: 12px;
            text-align: justify;
            text-indent: 1cm;
          }
          .data-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 15px;
          }
          .data-table td {
            padding: 4px 8px;
            border: 1px solid #000000;
            font-size: 10.5pt;
          }
          .data-table td.label {
            font-weight: bold;
            background-color: #f2f2f2;
            width: 35%;
          }
          .data-table td.value {
            font-weight: normal;
          }
          .scoreboard-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 15px;
          }
          .scoreboard-table td {
            width: 33.33%;
            padding: 8px;
            text-align: center;
            border: 1px solid #000000;
          }
          .score-label {
            font-size: 8.5pt;
            font-weight: bold;
            text-transform: uppercase;
            color: #333333;
            margin-bottom: 2px;
            display: block;
          }
          .score-value {
            font-size: 11.5pt;
            font-weight: bold;
          }
          .status-box {
            padding: 6px 10px;
            border: 1px solid #000000;
            background-color: #f9f9f9;
            margin-bottom: 15px;
          }
          .status-title {
            font-size: 8.5pt;
            font-weight: bold;
            text-transform: uppercase;
            color: #333333;
          }
          .status-value-text {
            font-size: 10.5pt;
            font-weight: bold;
            margin-top: 1px;
          }
          .logs-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 15px;
          }
          .logs-table td {
            width: 50%;
            vertical-align: top;
            border: 1px solid #000000;
            padding: 8px;
          }
          .log-column-title {
            font-size: 9.5pt;
            font-weight: bold;
            text-transform: uppercase;
            border-bottom: 2px solid #000000;
            padding-bottom: 3px;
            margin-bottom: 8px;
            text-align: center;
          }
          .log-item {
            border-bottom: 1px solid #cccccc;
            padding-bottom: 4px;
            margin-bottom: 4px;
            font-size: 9pt;
          }
          .log-item:last-child {
            border-bottom: none;
          }
          .log-item-title {
            font-weight: bold;
          }
          .log-item-pts {
            font-weight: bold;
            float: right;
          }
          .log-item-meta {
            font-size: 8pt;
            color: #555555;
            margin-top: 1px;
          }
          .log-empty {
            font-style: italic;
            color: #777777;
            text-align: center;
            padding: 10px;
          }
          .recommendation-box {
            padding: 8px 10px;
            border: 1px solid #000000;
            background-color: #fdfdfd;
            font-style: italic;
            font-size: 10pt;
            margin-bottom: 20px;
          }
          .sig-table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 25px;
          }
          .sig-table td {
            width: 50%;
            text-align: center;
            vertical-align: top;
            font-size: 10.5pt;
          }
          .sig-space {
            height: 50px;
          }
          .sig-name {
            font-weight: bold;
            text-decoration: underline;
          }
          .sig-nip {
            font-size: 9pt;
            margin-top: 2px;
          }
        </style>
      </head>
      <body>
        <div class="doc-title">
          <h3>LEMBAR KETERANGAN AKUMULASI POIN KEDISIPLINAN DAN REMISI</h3>
          <p>Nomor: Reg.BK/Remisi/${new Date().getFullYear()}/${Math.floor(Math.random() * 9000) + 1000}</p>
        </div>

        <div class="preamble">
          Yang bertanda tangan di bawah ini, Guru bimbingan konseling dan ketertiban siswa UPTD SMPN 17 Kota Tangerang Selatan menerangkan bahwasanya siswa tersebut di bawah ini telah tercatat dalam sistem poin pembinaan kedisiplinan dan pengurangan remisi:
        </div>

        <table class="data-table">
          <tr>
            <td class="label">Nama Lengkap Siswa</td>
            <td class="value"><strong>${siswa.nama}</strong></td>
          </tr>
          <tr>
            <td class="label">NIS / NISN</td>
            <td class="value">${siswa.nis || '-'} / ${siswa.nisn || '-'}</td>
          </tr>
          <tr>
            <td class="label">Kelas</td>
            <td class="value"><strong>${kelasName}</strong></td>
          </tr>
          <tr>
            <td class="label">Jenis Kelamin</td>
            <td class="value">${siswa.jenisKelamin}</td>
          </tr>
        </table>

        <div style="font-size: 10.5pt; font-weight: bold; margin-top: 15px; margin-bottom: 8px; text-transform: uppercase;">AKUMULASI SKOR POIN KEDISIPLINAN</div>
        <table class="scoreboard-table">
          <tr>
            <td class="score-rose" style="background-color: #fff1f2;">
              <span class="score-label" style="color: #be123c;">Total Pelanggaran</span>
              <span class="score-value" style="color: #9f1239;">${totalPelanggaran} Pts</span>
            </td>
            <td class="score-sky" style="background-color: #f0f9ff;">
              <span class="score-label" style="color: #0369a1;">Poin Remisi</span>
              <span class="score-value" style="color: #0369a1;">-${totalRemisi} Pts</span>
            </td>
            <td class="score-emerald" style="background-color: #ecfdf5;">
              <span class="score-label" style="color: #047857;">Sisa Akumulasi Poin</span>
              <span class="score-value" style="color: #065f46;">${sisaPoin} Pts</span>
            </td>
          </tr>
        </table>

        <div class="status-box">
          <span class="status-title">Predikat Evaluasi Perilaku</span>
          <div class="status-value-text">${statusLabel}</div>
          <div style="font-size: 8pt; color: #555555; margin-top: 2px; font-style: italic;">
            * Tata tertib batas maksimal akumulasi poin pelanggaran siswa adalah 100 Pts.
          </div>
        </div>

        <table class="logs-table">
          <tr>
            <td>
              <div class="log-column-title" style="color: #be123c; border-bottom: 2px solid #be123c;">RINCIAN PELANGGARAN (${pelanggaranList.length})</div>
              ${pelanggaranList.length > 0 ? pelanggaranList.map(p => `
                <div class="log-item">
                  <div>
                    <span class="log-item-title">${p.jenisPelanggaran}</span>
                    <span class="log-item-pts" style="color: #be123c;">+${p.poin} Pts</span>
                  </div>
                  <div class="log-item-meta">
                    Tgl: ${p.tanggal} | Kat: ${p.kategori}
                  </div>
                </div>
              `).join('') : '<div class="log-empty">Tidak ada catatan pelanggaran disiplin.</div>'}
            </td>
            <td>
              <div class="log-column-title" style="color: #0369a1; border-bottom: 2px solid #0369a1;">RINCIAN REMISI POIN (${remisiList.length})</div>
              ${remisiList.length > 0 ? remisiList.map(r => `
                <div class="log-item">
                  <div>
                    <span class="log-item-title">${r.jenisRemisi}</span>
                    <span class="log-item-pts" style="color: #0369a1;">-${r.poin} Pts</span>
                  </div>
                  <div class="log-item-meta">
                    Tgl: ${r.tanggal} | Kat: ${r.kategori}
                  </div>
                </div>
              `).join('') : '<div class="log-empty">Belum memiliki pengurang remisi poin.</div>'}
            </td>
          </tr>
        </table>

        <div class="recommendation-box">
          <strong>Rekomendasi Bimbingan Konseling (BK):</strong> Siswa dengan sisa poin aktif sebanyak <strong>${sisaPoin} Poin</strong> direkomendasikan untuk senantiasa dibimbing, didampingi secara persuasif, dan didorong untuk aktif berpartisipasi dalam program kebaikan/aksi sosial sekolah guna mereduksi akumulasi poin pelanggaran.
        </div>

        <table class="sig-table">
          <tr>
            <td>
              <div>Mengetahui,</div>
              <div>Guru Bimbingan Konseling</div>
              <div class="sig-space"></div>
              <div class="sig-name">......................................................</div>
              <div class="sig-nip">NIP. ......................................................</div>
            </td>
            <td>
              <div>Tangerang Selatan, ${dateTodayStr}</div>
              <div>Kepala Sekolah,</div>
              <div class="sig-space"></div>
              <div class="sig-name">......................................................</div>
              <div class="sig-nip">NIP. ......................................................</div>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `;

    const blob = new Blob(['\ufeff' + docHtml], {
      type: 'application/msword;charset=utf-8'
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Lembar_Keterangan_${siswa.nama.replace(/\s+/g, '_')}_${dateTodayStr.replace(/\s+/g, '_')}.doc`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleDownloadKonselingDoc = (k: Konseling) => {
    const siswa = db.siswa.find(s => s.id === k.siswaId);
    const kelas = db.kelas.find(c => c.id === siswa?.kelasId || c.namaKelas.toLowerCase().trim() === siswa?.kelasId?.toLowerCase().trim());
    const kelasName = kelas?.namaKelas || siswa?.kelasId || 'Kelas Tidak Terdata';
    const guruBk = db.users.find(u => u.id === k.guruBkId);
    const guruBkName = guruBk?.nama || currentUser.nama || 'Guru Bimbingan Konseling';

    const dateTodayStr = new Date().toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });

    let formattedCounselingDate = k.tanggal;
    try {
      const d = new Date(k.tanggal);
      if (!isNaN(d.getTime())) {
        formattedCounselingDate = d.toLocaleDateString('id-ID', {
          day: 'numeric',
          month: 'long',
          year: 'numeric'
        });
      }
    } catch (e) {}

    const docHtml = `
      <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word" xmlns="http://www.w3.org/TR/REC-html40">
      <head>
        <meta charset="utf-8">
        <title>Layanan Bimbingan Konseling - ${siswa?.nama || 'Siswa'}</title>
        <style>
          @page {
            size: A4;
            margin: 1.5cm 2cm 1.5cm 2cm;
          }
          body {
            font-family: 'Times New Roman', Times, serif;
            color: #000000;
            line-height: 1.5;
            font-size: 11pt;
          }
          .kop-text {
            text-align: center;
          }
          .doc-title {
            text-align: center;
            margin-bottom: 25px;
          }
          .doc-title h3 {
            margin: 0;
            font-size: 12pt;
            font-weight: bold;
            text-transform: uppercase;
            text-decoration: underline;
          }
          .doc-title p {
            margin: 5px 0 0 0;
            font-size: 10pt;
          }
          .data-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
          }
          .data-table td {
            padding: 6px 10px;
            border: 1px solid #000000;
            font-size: 11pt;
            vertical-align: top;
          }
          .data-table td.label {
            font-weight: bold;
            background-color: #f2f2f2;
            width: 30%;
          }
          .section-title {
            font-weight: bold;
            font-size: 11pt;
            text-transform: uppercase;
            margin-top: 15px;
            margin-bottom: 8px;
            border-bottom: 1px solid #000000;
            padding-bottom: 3px;
          }
          .content-box {
            padding: 10px;
            border: 1px solid #000000;
            background-color: #fafafa;
            margin-bottom: 15px;
            min-height: 80px;
            font-size: 11pt;
            text-align: justify;
          }
          .sig-table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 40px;
          }
          .sig-table td {
            width: 50%;
            text-align: center;
            vertical-align: top;
            font-size: 11pt;
          }
          .sig-space {
            height: 70px;
          }
          .sig-name {
            font-weight: bold;
            text-decoration: underline;
          }
        </style>
      </head>
      <body>
        <div class="kop-text" style="border-bottom: 3px double #000000; padding-bottom: 5px; margin-bottom: 20px;">
          <span style="font-size: 12pt; font-weight: bold; text-transform: uppercase;">PEMERINTAH KOTA TANGERANG SELATAN</span><br/>
          <span style="font-size: 11pt; font-weight: bold; text-transform: uppercase;">DINAS PENDIDIKAN DAN KEBUDAYAAN</span><br/>
          <span style="font-size: 13pt; font-weight: bold; text-transform: uppercase;">UPTD SMP NEGERI 17 KOTA TANGERANG SELATAN</span><br/>
          <span style="font-size: 9pt; font-style: italic;">Jl. Melati III No.2, Komplek Batan Indah, Kec. Setu, Kota Tangerang Selatan, Banten 15314</span>
        </div>

        <div class="doc-title">
          <h3>LAPORAN LAYANAN BIMBINGAN KONSELING</h3>
          <p>Nomor Registrasi BK: ${k.nomorKonseling || '-'}</p>
        </div>

        <div class="section-title">A. IDENTITAS PESERTA DIDIK</div>
        <table class="data-table">
          <tr>
            <td class="label">Nama Lengkap Siswa</td>
            <td class="value"><strong>${siswa?.nama || 'Siswa'}</strong></td>
          </tr>
          <tr>
            <td class="label">NIS / NISN</td>
            <td class="value">${siswa?.nis || '-'} / ${siswa?.nisn || '-'}</td>
          </tr>
          <tr>
            <td class="label">Kelas / Rombel</td>
            <td class="value"><strong>${kelasName}</strong></td>
          </tr>
          <tr>
            <td class="label">Jenis Kelamin</td>
            <td class="value">${siswa?.jenisKelamin || '-'}</td>
          </tr>
        </table>

        <div class="section-title">B. INFORMASI LAYANAN</div>
        <table class="data-table">
          <tr>
            <td class="label">Tanggal Pelaksanaan</td>
            <td class="value">${formattedCounselingDate}</td>
          </tr>
          <tr>
            <td class="label">Jenis Layanan Konseling</td>
            <td class="value"><strong>Bimbingan Konseling ${k.jenis || 'Individu'}</strong></td>
          </tr>
          <tr>
            <td class="label">Konselor / Guru BK</td>
            <td class="value">${guruBkName}</td>
          </tr>
        </table>

        <div class="section-title">C. URAIAN PERMASALAHAN / KELUHAN SISWA</div>
        <div class="content-box">
          ${k.permasalahan || '<i>Tidak ada rincian permasalahan yang diisi.</i>'}
        </div>

        <div class="section-title">D. ANALISIS KASUS DAN DIAGNOSIS BK</div>
        <div class="content-box">
          ${k.analisis || '<i>Tidak ada rincian analisis kasus yang diisi.</i>'}
        </div>

        <div class="section-title">E. ALTERNATIF SOLUSI DAN REKOMENDASI</div>
        <div class="content-box">
          ${k.solusi || '<i>Tidak ada solusi/rekomendasi yang diisi.</i>'}
        </div>

        <div class="section-title">F. HASIL EVALUASI DAN TINDAK LANJUT</div>
        <table class="data-table">
          <tr>
            <td class="label">Hasil Konseling</td>
            <td class="value">${k.hasil || '-'}</td>
          </tr>
          <tr>
            <td class="label">Tindak Lanjut</td>
            <td class="value">${k.tindakLanjut || '-'}</td>
          </tr>
        </table>

        <table class="sig-table">
          <tr>
            <td>
              <div>Mengetahui,</div>
              <div>Kepala Sekolah</div>
              <div class="sig-space"></div>
              <div class="sig-name">......................................................</div>
              <div>NIP. .................................................</div>
            </td>
            <td>
              <div>Tangerang Selatan, ${dateTodayStr}</div>
              <div>Guru Bimbingan Konseling (BK)</div>
              <div class="sig-space"></div>
              <div class="sig-name">${guruBkName}</div>
              <div>NIP. .................................................</div>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `;

    const blob = new Blob(['\ufeff' + docHtml], {
      type: 'application/msword;charset=utf-8'
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Layanan_Konseling_${siswa?.nama.replace(/\s+/g, '_') || 'Siswa'}_${k.nomorKonseling.replace(/\//g, '_')}.doc`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleDownloadKehadiranSiswaDoc = (siswaId: string) => {
    const siswa = db.siswa.find(s => s.id === siswaId);
    if (!siswa) return;

    const kelas = db.kelas.find(c => c.id === siswa.kelasId || c.namaKelas.toLowerCase().trim() === siswa.kelasId?.toLowerCase().trim());
    const kelasName = kelas?.namaKelas || siswa.kelasId || 'Kelas Tidak Terdata';
    const waliKelas = db.users.find(u => u.id === kelas?.waliKelasId);
    const waliKelasName = waliKelas?.nama || 'Wali Kelas';
    const guruBk = db.users.find(u => u.role === UserRole.GURU_BK) || currentUser;
    const guruBkName = guruBk?.nama || currentUser.nama || 'Guru Bimbingan Konseling';

    const list = (db.kehadiran || []).filter(k => k.siswaId === siswaId);
    
    let totalHadir = 0;
    let totalSakit = 0;
    let totalIzin = 0;
    let totalAlfa = 0;

    list.forEach(item => {
      totalHadir += Number(item.hadir || 0);
      totalSakit += Number(item.sakit || 0);
      totalIzin += Number(item.izin || (item as any).ijin || 0);
      totalAlfa += Number(item.alfa || 0);
    });

    const totalHari = totalHadir + totalSakit + totalIzin + totalAlfa;
    const persentaseHadir = totalHari > 0 ? Math.round((totalHadir / totalHari) * 100) : 100;

    const dateTodayStr = new Date().toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });

    let statusKehadiran = 'SANGAT BAIK';
    let rekomendasiBk = 'Siswa memiliki tingkat disiplin presensi yang sangat baik. Diharapkan untuk terus mempertahankan tingkat kehadiran terpuji.';
    if (persentaseHadir < 75 || totalAlfa >= 3) {
      statusKehadiran = 'PERLU PERHATIAN KHUSUS (PEMBINAAN BK)';
      rekomendasiBk = 'Siswa memiliki tingkat ketidakhadiran tinggi / alfa berturut-turut. Diperlukan pemanggilan orang tua dan bimbingan konseling terstruktur.';
    } else if (persentaseHadir < 85 || totalAlfa > 0) {
      statusKehadiran = 'CUKUP (DIPERLUKAN PEMANTAUAN)';
      rekomendasiBk = 'Siswa memerlukan pemantauan kehadiran secara berkala oleh Wali Kelas dan Guru BK.';
    }

    const tableRowsHtml = list.length > 0 ? list.map((item, idx) => {
      const h = Number(item.hadir || 0);
      const s = Number(item.sakit || 0);
      const i = Number(item.izin || (item as any).ijin || 0);
      const a = Number(item.alfa || 0);
      const tot = h + s + i + a;
      const pct = tot > 0 ? Math.round((h / tot) * 100) : 100;
      return `
        <tr>
          <td style="text-align: center;">${idx + 1}</td>
          <td style="text-align: center;"><b>${item.mingguKe}</b><br/><span style="font-size: 9pt; color: #555;">${item.bulan} ${item.tahun}</span></td>
          <td style="text-align: center; color: #047857; font-weight: bold;">${h} Hari</td>
          <td style="text-align: center; color: #0284c7;">${s} Hari</td>
          <td style="text-align: center; color: #d97706;">${i} Hari</td>
          <td style="text-align: center; color: #dc2626; font-weight: bold;">${a} Hari</td>
          <td style="text-align: center; font-weight: bold;">${pct}%</td>
          <td>${item.keterangan || '-'}</td>
        </tr>
      `;
    }).join('') : `
      <tr>
        <td colspan="8" style="text-align: center; padding: 15px; color: #888;">Belum ada rekap catatan kehadiran terdaftar untuk siswa ini.</td>
      </tr>
    `;

    const docHtml = `
      <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word" xmlns="http://www.w3.org/TR/REC-html40">
      <head>
        <meta charset="utf-8">
        <title>Laporan Kehadiran Siswa - ${siswa.nama}</title>
        <style>
          @page {
            size: A4;
            margin: 1.5cm 2cm 1.5cm 2cm;
          }
          body {
            font-family: 'Times New Roman', Times, serif;
            color: #000000;
            line-height: 1.5;
            font-size: 11pt;
          }
          .kop-text {
            text-align: center;
          }
          .doc-title {
            text-align: center;
            margin-bottom: 20px;
          }
          .doc-title h3 {
            margin: 0;
            font-size: 13pt;
            font-weight: bold;
            text-transform: uppercase;
            text-decoration: underline;
          }
          .doc-title p {
            margin: 4px 0 0 0;
            font-size: 10pt;
          }
          .data-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 18px;
          }
          .data-table td, .data-table th {
            padding: 6px 8px;
            border: 1px solid #000000;
            font-size: 10.5pt;
            vertical-align: middle;
          }
          .data-table th {
            background-color: #f2f2f2;
            font-weight: bold;
            text-transform: uppercase;
            font-size: 9.5pt;
          }
          .data-table td.label {
            font-weight: bold;
            background-color: #fafafa;
            width: 32%;
          }
          .section-title {
            font-weight: bold;
            font-size: 11pt;
            text-transform: uppercase;
            margin-top: 15px;
            margin-bottom: 8px;
            border-bottom: 1px solid #000000;
            padding-bottom: 3px;
          }
          .stat-box {
            border: 1px solid #000000;
            background-color: #f8fafc;
            padding: 10px;
            margin-bottom: 15px;
          }
          .sig-table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 35px;
          }
          .sig-table td {
            width: 50%;
            text-align: center;
            vertical-align: top;
            font-size: 11pt;
          }
          .sig-space {
            height: 65px;
          }
          .sig-name {
            font-weight: bold;
            text-decoration: underline;
          }
        </style>
      </head>
      <body>
        <div class="kop-text" style="border-bottom: 3px double #000000; padding-bottom: 5px; margin-bottom: 20px;">
          <span style="font-size: 12pt; font-weight: bold; text-transform: uppercase;">PEMERINTAH KOTA TANGERANG SELATAN</span><br/>
          <span style="font-size: 11pt; font-weight: bold; text-transform: uppercase;">DINAS PENDIDIKAN DAN KEBUDAYAAN</span><br/>
          <span style="font-size: 13pt; font-weight: bold; text-transform: uppercase;">UPTD SMP NEGERI 17 KOTA TANGERANG SELATAN</span><br/>
          <span style="font-size: 9pt; font-style: italic;">Jl. Melati III No.2, Komplek Batan Indah, Kec. Setu, Kota Tangerang Selatan, Banten 15314</span>
        </div>

        <div class="doc-title">
          <h3>LAPORAN REKAPITULASI KEHADIRAN INDIVIDUAL SISWA</h3>
          <p>Tahun Pelajaran 2025/2026 - Layanan Bimbingan Konseling & Kedisiplinan</p>
        </div>

        <div class="section-title">A. IDENTITAS PESERTA DIDIK</div>
        <table class="data-table">
          <tr>
            <td class="label">Nama Lengkap Siswa</td>
            <td><strong>${siswa.nama}</strong></td>
          </tr>
          <tr>
            <td class="label">NIS / NISN</td>
            <td>${siswa.nis || '-'} / ${siswa.nisn || '-'}</td>
          </tr>
          <tr>
            <td class="label">Kelas / Rombel</td>
            <td><strong>${kelasName}</strong></td>
          </tr>
          <tr>
            <td class="label">Wali Kelas</td>
            <td>${waliKelasName}</td>
          </tr>
        </table>

        <div class="section-title">B. RINGKASAN AKUMULASI PRESENSI SISWA</div>
        <div class="stat-box">
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="width: 20%; text-align: center; border-right: 1px solid #ccc;">
                <span style="font-size: 9pt; color: #555;">Tingkat Kehadiran</span><br/>
                <span style="font-size: 16pt; font-weight: bold; color: #047857;">${persentaseHadir}%</span>
              </td>
              <td style="width: 20%; text-align: center; border-right: 1px solid #ccc;">
                <span style="font-size: 9pt; color: #555;">Hadir</span><br/>
                <span style="font-size: 14pt; font-weight: bold; color: #047857;">${totalHadir} Hari</span>
              </td>
              <td style="width: 20%; text-align: center; border-right: 1px solid #ccc;">
                <span style="font-size: 9pt; color: #555;">Sakit</span><br/>
                <span style="font-size: 14pt; font-weight: bold; color: #0284c7;">${totalSakit} Hari</span>
              </td>
              <td style="width: 20%; text-align: center; border-right: 1px solid #ccc;">
                <span style="font-size: 9pt; color: #555;">Izin</span><br/>
                <span style="font-size: 14pt; font-weight: bold; color: #d97706;">${totalIzin} Hari</span>
              </td>
              <td style="width: 20%; text-align: center;">
                <span style="font-size: 9pt; color: #555;">Alfa</span><br/>
                <span style="font-size: 14pt; font-weight: bold; color: #dc2626;">${totalAlfa} Hari</span>
              </td>
            </tr>
          </table>
        </div>

        <div class="section-title">C. RINCIAN CATATAN KEHADIRAN PER MINGGU / BULAN</div>
        <table class="data-table">
          <thead>
            <tr>
              <th style="width: 5%;">No</th>
              <th style="width: 20%;">Periode</th>
              <th style="width: 10%;">Hadir</th>
              <th style="width: 10%;">Sakit</th>
              <th style="width: 10%;">Izin</th>
              <th style="width: 10%;">Alfa</th>
              <th style="width: 10%;">% Hadir</th>
              <th style="width: 25%;">Keterangan / Catatan</th>
            </tr>
          </thead>
          <tbody>
            ${tableRowsHtml}
          </tbody>
        </table>

        <div class="section-title">D. EVALUASI DAN CATATAN BIMBINGAN KONSELING</div>
        <table class="data-table">
          <tr>
            <td class="label">Status Presensi Siswa</td>
            <td><strong>${statusKehadiran}</strong></td>
          </tr>
          <tr>
            <td class="label">Rekomendasi Bimbingan</td>
            <td>${rekomendasiBk}</td>
          </tr>
        </table>

        <table class="sig-table">
          <tr>
            <td>
              <div>Mengetahui,</div>
              <div>Kepala Sekolah</div>
              <div class="sig-space"></div>
              <div class="sig-name">......................................................</div>
              <div>NIP. .................................................</div>
            </td>
            <td>
              <div>Tangerang Selatan, ${dateTodayStr}</div>
              <div>Guru Bimbingan Konseling (BK)</div>
              <div class="sig-space"></div>
              <div class="sig-name">${guruBkName}</div>
              <div>NIP. .................................................</div>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `;

    const blob = new Blob(['\ufeff' + docHtml], {
      type: 'application/msword;charset=utf-8'
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Laporan_Kehadiran_Siswa_${siswa.nama.replace(/\s+/g, '_')}_${kelasName.replace(/\s+/g, '_')}.doc`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleDownloadKehadiranKelasDoc = (targetKelasId: string) => {
    let targetKelas = db.kelas.find(c => c.id === targetKelasId || c.namaKelas.toLowerCase().trim() === targetKelasId.toLowerCase().trim());
    if (!targetKelas && targetKelasId !== 'ALL' && db.kelas.length > 0) {
      targetKelas = db.kelas[0];
    }

    const namaKelas = targetKelas?.namaKelas || (targetKelasId === 'ALL' ? 'Seluruh Kelas' : targetKelasId);
    
    // Students in this class
    const siswaListInKelas = (targetKelasId === 'ALL' || !targetKelas) 
      ? db.siswa 
      : db.siswa.filter(s => s.kelasId === targetKelas.id || s.kelasId === targetKelas.namaKelas || targetKelas.namaKelas.toLowerCase().trim() === String(s.kelasId).toLowerCase().trim());

    const waliKelas = db.users.find(u => u.id === targetKelas?.waliKelasId);
    const waliKelasName = waliKelas?.nama || 'Wali Kelas';
    const guruBk = db.users.find(u => u.role === UserRole.GURU_BK) || currentUser;
    const guruBkName = guruBk?.nama || currentUser.nama || 'Guru Bimbingan Konseling';

    const dateTodayStr = new Date().toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });

    let totalHadirKelas = 0;
    let totalSakitKelas = 0;
    let totalIzinKelas = 0;
    let totalAlfaKelas = 0;

    const studentRowsHtml = siswaListInKelas.length > 0 ? siswaListInKelas.map((s, idx) => {
      const list = (db.kehadiran || []).filter(k => k.siswaId === s.id);
      let h = 0, sk = 0, iz = 0, al = 0;
      list.forEach(item => {
        h += Number(item.hadir || 0);
        sk += Number(item.sakit || 0);
        iz += Number(item.izin || (item as any).ijin || 0);
        al += Number(item.alfa || 0);
      });
      totalHadirKelas += h;
      totalSakitKelas += sk;
      totalIzinKelas += iz;
      totalAlfaKelas += al;

      const tot = h + sk + iz + al;
      const pct = tot > 0 ? Math.round((h / tot) * 100) : 100;

      let statusBadge = '<span style="color: #047857; font-weight: bold;">Sangat Baik</span>';
      if (pct < 75 || al >= 3) {
        statusBadge = '<span style="color: #dc2626; font-weight: bold;">Pembinaan BK</span>';
      } else if (pct < 85 || al > 0) {
        statusBadge = '<span style="color: #d97706; font-weight: bold;">Perlu Perhatian</span>';
      }

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
          <td style="text-align: center;">${statusBadge}</td>
        </tr>
      `;
    }).join('') : `
      <tr>
        <td colspan="9" style="text-align: center; padding: 15px; color: #888;">Belum ada data siswa terdaftar di kelas ini.</td>
      </tr>
    `;

    const totalHariKelas = totalHadirKelas + totalSakitKelas + totalIzinKelas + totalAlfaKelas;
    const persentaseHadirKelas = totalHariKelas > 0 ? Math.round((totalHadirKelas / totalHariKelas) * 100) : 100;

    const docHtml = `
      <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word" xmlns="http://www.w3.org/TR/REC-html40">
      <head>
        <meta charset="utf-8">
        <title>Laporan Rekapitulasi Kehadiran Kelas ${namaKelas}</title>
        <style>
          @page {
            size: A4 landscape;
            margin: 1.5cm 1.5cm 1.5cm 1.5cm;
          }
          body {
            font-family: 'Times New Roman', Times, serif;
            color: #000000;
            line-height: 1.4;
            font-size: 10.5pt;
          }
          .kop-text {
            text-align: center;
          }
          .doc-title {
            text-align: center;
            margin-bottom: 20px;
          }
          .doc-title h3 {
            margin: 0;
            font-size: 13pt;
            font-weight: bold;
            text-transform: uppercase;
            text-decoration: underline;
          }
          .doc-title p {
            margin: 4px 0 0 0;
            font-size: 10pt;
          }
          .data-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 18px;
          }
          .data-table td, .data-table th {
            padding: 5px 7px;
            border: 1px solid #000000;
            font-size: 10pt;
            vertical-align: middle;
          }
          .data-table th {
            background-color: #f2f2f2;
            font-weight: bold;
            text-transform: uppercase;
            font-size: 9pt;
          }
          .section-title {
            font-weight: bold;
            font-size: 11pt;
            text-transform: uppercase;
            margin-top: 15px;
            margin-bottom: 8px;
            border-bottom: 1px solid #000000;
            padding-bottom: 3px;
          }
          .stat-box {
            border: 1px solid #000000;
            background-color: #f8fafc;
            padding: 10px;
            margin-bottom: 15px;
          }
          .sig-table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 35px;
          }
          .sig-table td {
            width: 33%;
            text-align: center;
            vertical-align: top;
            font-size: 10.5pt;
          }
          .sig-space {
            height: 60px;
          }
          .sig-name {
            font-weight: bold;
            text-decoration: underline;
          }
        </style>
      </head>
      <body>
        <div class="kop-text" style="border-bottom: 3px double #000000; padding-bottom: 5px; margin-bottom: 15px;">
          <span style="font-size: 12pt; font-weight: bold; text-transform: uppercase;">PEMERINTAH KOTA TANGERANG SELATAN</span><br/>
          <span style="font-size: 11pt; font-weight: bold; text-transform: uppercase;">DINAS PENDIDIKAN DAN KEBUDAYAAN</span><br/>
          <span style="font-size: 13pt; font-weight: bold; text-transform: uppercase;">UPTD SMP NEGERI 17 KOTA TANGERANG SELATAN</span><br/>
          <span style="font-size: 9pt; font-style: italic;">Jl. Melati III No.2, Komplek Batan Indah, Kec. Setu, Kota Tangerang Selatan, Banten 15314</span>
        </div>

        <div class="doc-title">
          <h3>LAPORAN REKAPITULASI KEHADIRAN SISWA PER-KELAS</h3>
          <p>Rombongan Belajar: <strong>${namaKelas}</strong> | Wali Kelas: <strong>${waliKelasName}</strong> | Tahun Pelajaran 2025/2026</p>
        </div>

        <div class="stat-box">
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="width: 20%; text-align: center; border-right: 1px solid #ccc;">
                <span style="font-size: 9pt; color: #555;">Rata-rata Kelas</span><br/>
                <span style="font-size: 16pt; font-weight: bold; color: #047857;">${persentaseHadirKelas}%</span>
              </td>
              <td style="width: 20%; text-align: center; border-right: 1px solid #ccc;">
                <span style="font-size: 9pt; color: #555;">Total Hadir Kelas</span><br/>
                <span style="font-size: 14pt; font-weight: bold; color: #047857;">${totalHadirKelas} Hari</span>
              </td>
              <td style="width: 20%; text-align: center; border-right: 1px solid #ccc;">
                <span style="font-size: 9pt; color: #555;">Total Sakit Kelas</span><br/>
                <span style="font-size: 14pt; font-weight: bold; color: #0284c7;">${totalSakitKelas} Hari</span>
              </td>
              <td style="width: 20%; text-align: center; border-right: 1px solid #ccc;">
                <span style="font-size: 9pt; color: #555;">Total Izin Kelas</span><br/>
                <span style="font-size: 14pt; font-weight: bold; color: #d97706;">${totalIzinKelas} Hari</span>
              </td>
              <td style="width: 20%; text-align: center;">
                <span style="font-size: 9pt; color: #555;">Total Alfa Kelas</span><br/>
                <span style="font-size: 14pt; font-weight: bold; color: #dc2626;">${totalAlfaKelas} Hari</span>
              </td>
            </tr>
          </table>
        </div>

        <div class="section-title">DAFTAR PRESENSI DAN REKAPITULASI SISWA (${namaKelas})</div>
        <table class="data-table">
          <thead>
            <tr>
              <th style="width: 4%;">No</th>
              <th style="width: 25%;">Nama Siswa</th>
              <th style="width: 12%;">NISN / NIS</th>
              <th style="width: 9%;">Hadir</th>
              <th style="width: 9%;">Sakit</th>
              <th style="width: 9%;">Izin</th>
              <th style="width: 9%;">Alfa</th>
              <th style="width: 10%;">% Kehadiran</th>
              <th style="width: 13%;">Catatan Presensi</th>
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
              <div>Kepala Sekolah</div>
              <div class="sig-space"></div>
              <div class="sig-name">......................................................</div>
              <div>NIP. .................................................</div>
            </td>
            <td>
              <div>Mengetahui,</div>
              <div>Wali Kelas ${namaKelas}</div>
              <div class="sig-space"></div>
              <div class="sig-name">${waliKelasName}</div>
              <div>NIP. .................................................</div>
            </td>
            <td>
              <div>Tangerang Selatan, ${dateTodayStr}</div>
              <div>Guru Bimbingan Konseling (BK)</div>
              <div class="sig-space"></div>
              <div class="sig-name">${guruBkName}</div>
              <div>NIP. .................................................</div>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `;

    const blob = new Blob(['\ufeff' + docHtml], {
      type: 'application/msword;charset=utf-8'
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Laporan_Kehadiran_Kelas_${namaKelas.replace(/\s+/g, '_')}.doc`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const overallAttendanceStats = useMemo(() => {
    const list = db.kehadiran || [];
    let totalHadir = 0;
    let totalSakit = 0;
    let totalIzin = 0;
    let totalAlfa = 0;

    list.forEach(k => {
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
  }, [db.kehadiran]);

  const classAttendanceStats = useMemo(() => {
    return (db.kelas || []).map(cls => {
      const classStudents = (db.siswa || []).filter(s => 
        s.kelasId === cls.id || s.kelasId === cls.namaKelas || cls.namaKelas.toLowerCase().trim() === String(s.kelasId).toLowerCase().trim()
      );
      const studentIds = new Set(classStudents.map(s => s.id));

      const classKehadiran = (db.kehadiran || []).filter(k => studentIds.has(k.siswaId));

      let totalHadir = 0;
      let totalSakit = 0;
      let totalIzin = 0;
      let totalAlfa = 0;

      classKehadiran.forEach(k => {
        totalHadir += Number(k.hadir || 0);
        totalSakit += Number(k.sakit || 0);
        totalIzin += Number(k.izin || (k as any).ijin || 0);
        totalAlfa += Number(k.alfa || 0);
      });

      const totalHari = totalHadir + totalSakit + totalIzin + totalAlfa;
      const percentage = totalHari > 0 ? Math.round((totalHadir / totalHari) * 100) : 100;

      const waliKelas = (db.users || []).find(u => u.id === cls.waliKelasId);

      return {
        classId: cls.id,
        className: cls.namaKelas,
        studentCount: classStudents.length,
        waliKelasName: waliKelas?.nama || 'Wali Kelas',
        totalHadir,
        totalSakit,
        totalIzin,
        totalAlfa,
        totalHari,
        percentage
      };
    });
  }, [db.kelas, db.siswa, db.kehadiran, db.users]);

  // Selected summary details
  const defaultSelectedId = selectedSummarySiswaId || studentPointSummaries[0]?.siswa.id || db.siswa[0]?.id || '';
  const currentSelectedSummary = studentPointSummaries.find(s => s.siswa.id === defaultSelectedId);

  return (
    <div id="konseling-panel" className="space-y-6">
      
      {/* Dynamic Sub Tab Selector Navigation */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex flex-wrap bg-white p-1 rounded-xl border border-slate-100 shadow-sm text-xs font-semibold text-slate-500">
          {currentUser.role !== UserRole.GURU_PIKET && (
            <button 
              onClick={() => { setActiveTab('konseling'); setSearchQuery(''); }}
              className={`px-4 py-2 rounded-lg flex items-center gap-1.5 transition ${activeTab === 'konseling' ? 'bg-emerald-600 text-white shadow-sm' : 'hover:bg-slate-50'}`}
            >
              <MessageSquare size={14} /> Layanan Konseling
            </button>
          )}
          <button 
            onClick={() => { setActiveTab('pelanggaran'); setSearchQuery(''); }}
            className={`px-4 py-2 rounded-lg flex items-center gap-1.5 transition ${activeTab === 'pelanggaran' ? 'bg-rose-600 text-white shadow-sm' : 'hover:bg-slate-50'}`}
          >
            <AlertTriangle size={14} /> Kedisiplinan & Poin
          </button>
          <button 
            onClick={() => { setActiveTab('remisi'); setSearchQuery(''); }}
            className={`px-4 py-2 rounded-lg flex items-center gap-1.5 transition ${activeTab === 'remisi' ? 'bg-sky-600 text-white shadow-sm' : 'hover:bg-slate-50'}`}
          >
            <Heart size={14} className={activeTab === 'remisi' ? 'text-white' : 'text-sky-500'} /> Remisi Poin
          </button>
          {currentUser.role !== UserRole.GURU_PIKET && (
            <>
              <button 
                onClick={() => { setActiveTab('prestasi'); setSearchQuery(''); }}
                className={`px-4 py-2 rounded-lg flex items-center gap-1.5 transition ${activeTab === 'prestasi' ? 'bg-amber-600 text-white shadow-sm' : 'hover:bg-slate-50'}`}
              >
                <Award size={14} /> Rekam Prestasi
              </button>
              <button 
                onClick={() => { setActiveTab('asesmen'); setSearchQuery(''); }}
                className={`px-4 py-2 rounded-lg flex items-center gap-1.5 transition ${activeTab === 'asesmen' ? 'bg-teal-600 text-white shadow-sm' : 'hover:bg-slate-50'}`}
              >
                <Activity size={14} /> Asesmen BK
              </button>
              <button 
                onClick={() => { setActiveTab('homevisit'); setSearchQuery(''); }}
                className={`px-4 py-2 rounded-lg flex items-center gap-1.5 transition ${activeTab === 'homevisit' ? 'bg-indigo-600 text-white shadow-sm' : 'hover:bg-slate-50'}`}
              >
                <Home size={14} /> Kunjungan Rumah
              </button>
              <button 
                onClick={() => { setActiveTab('kehadiran'); setSearchQuery(''); }}
                className={`px-4 py-2 rounded-lg flex items-center gap-1.5 transition ${activeTab === 'kehadiran' ? 'bg-cyan-600 text-white shadow-sm' : 'hover:bg-slate-50'}`}
              >
                <FileSpreadsheet size={14} /> Rekap Kehadiran
              </button>
            </>
          )}
        </div>

        {canModify && (
          <button 
            onClick={() => openEditor(null)}
            className={`text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-sm flex items-center gap-1.5 cursor-pointer hover:-translate-y-0.5 transition-all duration-200 ${
              activeTab === 'konseling' ? 'bg-emerald-600 hover:bg-emerald-700' :
              activeTab === 'pelanggaran' ? 'bg-rose-600 hover:bg-rose-700' :
              activeTab === 'remisi' ? 'bg-sky-600 hover:bg-sky-700' :
              activeTab === 'prestasi' ? 'bg-amber-600 hover:bg-amber-700' :
              activeTab === 'asesmen' ? 'bg-teal-600 hover:bg-teal-700' :
              activeTab === 'homevisit' ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-cyan-600 hover:bg-cyan-700'
            }`}
          >
            <Plus size={14} /> Tambah Data {
              activeTab === 'konseling' ? 'Konseling' :
              activeTab === 'pelanggaran' ? 'Pelanggaran' :
              activeTab === 'remisi' ? 'Remisi Poin' :
              activeTab === 'prestasi' ? 'Prestasi' :
              activeTab === 'asesmen' ? 'Asesmen' :
              activeTab === 'homevisit' ? 'Home Visit' : 'Kehadiran'
            }
          </button>
        )}
      </div>

      {/* Attendance Charts and Analytics Dashboard */}
      {activeTab === 'kehadiran' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                <BarChart2 className="text-emerald-600" size={18} />
                Grafik & Analytics Rekap Kehadiran Siswa
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Visualisasi statistik presensi keseluruhan dan per-rombongan belajar
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleDownloadKehadiranKelasDoc(attendanceFilterKelas)}
                className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-2 shadow-sm"
              >
                <Download size={14} />
                Unduh Doc Kelas ({attendanceFilterKelas === 'ALL' ? 'Semua Kelas' : (db.kelas.find(c => c.id === attendanceFilterKelas)?.namaKelas || attendanceFilterKelas)})
              </button>
            </div>
          </div>

          {/* Key KPI Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            <div className="bg-emerald-50/70 p-3.5 rounded-xl border border-emerald-100">
              <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider block">Tingkat Kehadiran</span>
              <span className="text-xl font-extrabold text-emerald-800 mt-1 block">{overallAttendanceStats.percentage}%</span>
              <span className="text-[10px] text-emerald-600 font-medium">Rata-rata Sekolah</span>
            </div>
            <div className="bg-emerald-50/40 p-3.5 rounded-xl border border-emerald-100/60">
              <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider block">Total Hadir</span>
              <span className="text-xl font-extrabold text-emerald-900 mt-1 block">{overallAttendanceStats.totalHadir} Hari</span>
              <span className="text-[10px] text-emerald-600 font-medium">Presensi Masuk</span>
            </div>
            <div className="bg-sky-50/60 p-3.5 rounded-xl border border-sky-100">
              <span className="text-[10px] font-bold text-sky-600 uppercase tracking-wider block">Total Sakit</span>
              <span className="text-xl font-extrabold text-sky-800 mt-1 block">{overallAttendanceStats.totalSakit} Hari</span>
              <span className="text-[10px] text-sky-600 font-medium">Dengan Surat Dokter/Keterangan</span>
            </div>
            <div className="bg-amber-50/60 p-3.5 rounded-xl border border-amber-100">
              <span className="text-[10px] font-bold text-amber-600 uppercase tracking-wider block">Total Izin</span>
              <span className="text-xl font-extrabold text-amber-800 mt-1 block">{overallAttendanceStats.totalIzin} Hari</span>
              <span className="text-[10px] text-amber-600 font-medium">Keperluan Keluarga/Izin Resmi</span>
            </div>
            <div className="bg-rose-50/60 p-3.5 rounded-xl border border-rose-100 col-span-2 md:col-span-1">
              <span className="text-[10px] font-bold text-rose-600 uppercase tracking-wider block">Total Tanpa Keterangan (Alfa)</span>
              <span className="text-xl font-extrabold text-rose-800 mt-1 block">{overallAttendanceStats.totalAlfa} Hari</span>
              <span className="text-[10px] text-rose-600 font-medium">Perlu Tindak Lanjut BK</span>
            </div>
          </div>

          {/* Bar Chart Visualization per Class */}
          <div className="space-y-3 pt-2">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              <PieChart size={14} className="text-emerald-600" />
              Persentase Kehadiran per Rombongan Belajar / Kelas
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {classAttendanceStats.map(cls => (
                <div key={cls.classId} className="bg-slate-50/60 p-3.5 rounded-xl border border-slate-100 space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-slate-800">{cls.className}</span>
                    <span className="font-extrabold text-emerald-700 bg-emerald-100/60 px-2 py-0.5 rounded text-[11px]">{cls.percentage}% Hadir</span>
                  </div>
                  <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden flex">
                    <div style={{ width: `${cls.percentage}%` }} className="bg-emerald-500 h-full transition-all duration-500" />
                    <div style={{ width: `${100 - cls.percentage}%` }} className="bg-rose-400 h-full transition-all duration-500" />
                  </div>
                  <div className="flex justify-between items-center text-[11px] text-slate-500 pt-0.5">
                    <span>{cls.studentCount} Siswa | Wali: {cls.waliKelasName}</span>
                    <div className="flex gap-2">
                      <span className="text-emerald-700 font-semibold">H: {cls.totalHadir}</span>
                      <span className="text-sky-700 font-semibold">S: {cls.totalSakit}</span>
                      <span className="text-amber-700 font-semibold">I: {cls.totalIzin}</span>
                      <span className="text-rose-700 font-semibold">A: {cls.totalAlfa}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Main search and content list */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        {/* Search header bar */}
        <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-md">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder={`Cari di tabel ${activeTab.toUpperCase()} berdasarkan nama siswa / kata kunci...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs w-full focus:outline-none focus:border-slate-400"
            />
          </div>

          {activeTab === 'kehadiran' && (
            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center gap-1.5 bg-white border border-slate-200 px-3 py-1.5 rounded-xl text-xs text-slate-600">
                <Filter size={13} className="text-slate-400" />
                <span className="font-semibold text-slate-500">Kelas:</span>
                <select
                  value={attendanceFilterKelas}
                  onChange={(e) => setAttendanceFilterKelas(e.target.value)}
                  className="bg-transparent font-bold text-slate-700 focus:outline-none cursor-pointer"
                >
                  <option value="ALL">Semua Kelas</option>
                  {db.kelas.map(c => (
                    <option key={c.id} value={c.id}>{c.namaKelas}</option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-1.5 bg-white border border-slate-200 px-3 py-1.5 rounded-xl text-xs text-slate-600">
                <Calendar size={13} className="text-slate-400" />
                <span className="font-semibold text-slate-500">Bulan:</span>
                <select
                  value={attendanceFilterBulan}
                  onChange={(e) => setAttendanceFilterBulan(e.target.value)}
                  className="bg-transparent font-bold text-slate-700 focus:outline-none cursor-pointer"
                >
                  <option value="ALL">Semua Bulan</option>
                  {['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'].map(m => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Conditional Lists based on activeTab */}
        <div className="overflow-x-auto text-xs">
          
          {/* A. KONSELING LIST */}
          {activeTab === 'konseling' && (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 font-bold uppercase tracking-wider">
                  <th className="py-3 px-4">Siswa & No BK</th>
                  <th className="py-3 px-4">Tanggal / Jenis</th>
                  <th className="py-3 px-4">Permasalahan</th>
                  <th className="py-3 px-4">Solusi & Hasil</th>
                  <th className="py-3 px-4 text-center">Format DOC</th>
                  <th className="py-3 px-4 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 text-slate-700">
                {filteredList.length > 0 ? (
                  filteredList.map((k: any) => {
                    const siswa = db.siswa.find(s => s.id === k.siswaId);
                    return (
                      <tr key={k.id} className="hover:bg-slate-50/30">
                        <td className="py-3 px-4 font-semibold">
                          <p className="text-slate-800 font-bold">{siswa?.nama || 'Siswa'}</p>
                          <p className="text-[10px] text-slate-400">{k.nomorKonseling}</p>
                        </td>
                        <td className="py-3 px-4">
                          <p className="font-mono">{k.tanggal}</p>
                          <span className="bg-emerald-50 text-emerald-700 text-[10px] font-bold px-1.5 py-0.5 rounded">{k.jenis}</span>
                        </td>
                        <td className="py-3 px-4 max-w-xs truncate" title={k.permasalahan}>{k.permasalahan}</td>
                        <td className="py-3 px-4 max-w-xs">
                          <p className="text-emerald-700 font-medium truncate" title={k.solusi}>S: {k.solusi}</p>
                          <p className="text-slate-400 text-[10px] italic truncate">H: {k.hasil}</p>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <button
                            onClick={() => handleDownloadKonselingDoc(k)}
                            className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 hover:bg-blue-100 transition rounded px-2 py-1 text-[10px] font-bold cursor-pointer border border-blue-100 shadow-xs"
                            title="Unduh Laporan Layanan dalam format Word (.doc)"
                          >
                            <FileText size={12} />
                            <span>Unduh .doc</span>
                          </button>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <div className="flex justify-center gap-1.5">
                            {canModify && (
                              <>
                                <button onClick={() => openEditor(k)} className="p-1 text-slate-500 hover:text-slate-800"><Edit3 size={14} /></button>
                                <button onClick={() => handleDelete(k.id)} className="p-1 text-rose-500 hover:text-rose-700"><Trash2 size={14} /></button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr><td colSpan={6} className="py-6 text-center text-slate-400">Belum ada data konseling masuk.</td></tr>
                )}
              </tbody>
            </table>
          )}

          {/* B. PELANGGARAN LIST */}
          {activeTab === 'pelanggaran' && (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 font-bold uppercase tracking-wider">
                  <th className="py-3 px-4">Siswa</th>
                  <th className="py-3 px-4">Tanggal & Jenis Pelanggaran</th>
                  <th className="py-3 px-4">Kategori & Poin</th>
                  <th className="py-3 px-4">Tindak Lanjut & Pelapor</th>
                  <th className="py-3 px-4 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 text-slate-700">
                {filteredList.length > 0 ? (
                  filteredList.map((p: any) => {
                    const siswa = db.siswa.find(s => s.id === p.siswaId);
                    return (
                      <tr key={p.id} className="hover:bg-slate-50/30">
                        <td className="py-3 px-4 font-bold text-slate-800">{siswa?.nama || 'Siswa'}</td>
                        <td className="py-3 px-4">
                          <p className="font-mono text-[10px] text-slate-400">{p.tanggal}</p>
                          <p className="font-semibold text-slate-700">{p.jenisPelanggaran}</p>
                        </td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold mr-2 ${
                            p.kategori === 'Berat' ? 'bg-rose-100 text-rose-800' : p.kategori === 'Sedang' ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                          }`}>{p.kategori}</span>
                          <span className="bg-slate-100 text-slate-800 font-black px-2 py-0.5 rounded">{p.poin} Pts</span>
                        </td>
                        <td className="py-3 px-4">
                          <p className="font-medium text-rose-700">{p.tindakLanjut}</p>
                          <p className="text-[10px] text-slate-400">Dilaporkan: {p.guruPelapor}</p>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <div className="flex justify-center gap-1.5">
                            {canModify && (
                              <>
                                <button onClick={() => openEditor(p)} className="p-1 text-slate-500 hover:text-slate-800"><Edit3 size={14} /></button>
                                <button onClick={() => handleDelete(p.id)} className="p-1 text-rose-500 hover:text-rose-700"><Trash2 size={14} /></button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr><td colSpan={5} className="py-6 text-center text-slate-400">Belum ada catatan pelanggaran disiplin.</td></tr>
                )}
              </tbody>
            </table>
          )}

          {/* B2. REMISI POIN LIST */}
          {activeTab === 'remisi' && (
            <>
              {/* Remisi & Poin Summary Dashboard */}
              {currentSelectedSummary && (
                <div className="bg-slate-50/50 p-5 border-b border-slate-100 grid grid-cols-1 lg:grid-cols-12 gap-6">
                  {/* Selector and Scorecard */}
                  <div className="lg:col-span-5 bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-4">
                    <div className="flex items-center gap-2 text-sky-600 mb-2">
                      <Calculator size={16} />
                      <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider">Kalkulator & Lembar Keterangan</h4>
                    </div>
                    
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Pilih Siswa untuk Dievaluasi</label>
                      <select
                        value={defaultSelectedId}
                        onChange={(e) => setSelectedSummarySiswaId(e.target.value)}
                        className="p-2.5 border border-slate-200 bg-white rounded-xl text-xs w-full font-semibold focus:outline-none focus:border-sky-500 transition"
                      >
                        <option value="" disabled>-- Pilih Siswa --</option>
                        {db.siswa.map(s => {
                          const summary = studentPointSummaries.find(sum => sum.siswa.id === s.id);
                          const pointsText = summary ? `(${summary.totalPelanggaran} Pts Pelanggaran, -${summary.totalRemisi} Pts Remisi)` : '(0 Pts)';
                          return (
                            <option key={s.id} value={s.id}>
                              {s.nama} {pointsText}
                            </option>
                          );
                        })}
                      </select>
                    </div>

                    {/* Big numbers scoreboard */}
                    <div className="grid grid-cols-3 gap-2 pt-2">
                      <div className="p-2.5 bg-rose-50 border border-rose-100 rounded-xl text-center">
                        <span className="block text-[8px] font-bold text-rose-500 uppercase">Pelanggaran</span>
                        <span className="text-sm font-extrabold text-rose-600">{currentSelectedSummary.totalPelanggaran} <span className="text-[9px] font-normal">Pts</span></span>
                      </div>
                      <div className="p-2.5 bg-sky-50 border border-sky-100 rounded-xl text-center">
                        <span className="block text-[8px] font-bold text-sky-500 uppercase">Remisi</span>
                        <span className="text-sm font-extrabold text-sky-600">-{currentSelectedSummary.totalRemisi} <span className="text-[9px] font-normal">Pts</span></span>
                      </div>
                      <div className="p-2.5 bg-emerald-50 border border-emerald-100 rounded-xl text-center">
                        <span className="block text-[8px] font-bold text-emerald-500 uppercase">Sisa Poin</span>
                        <span className="text-sm font-extrabold text-emerald-600">{currentSelectedSummary.sisaPoin} <span className="text-[9px] font-normal">Pts</span></span>
                      </div>
                    </div>

                    {/* Behavior Status Tag */}
                    <div className={`p-3 rounded-xl border flex items-center justify-between text-xs transition-all ${currentSelectedSummary.statusColor}`}>
                      <div>
                        <span className="text-[8px] font-bold uppercase tracking-wider block opacity-70">Predikat Perilaku</span>
                        <span className="font-extrabold">{currentSelectedSummary.statusLabel}</span>
                      </div>
                      <TrendingDown size={18} className="opacity-80" />
                    </div>

                    {/* Download Statement Button */}
                    <button
                      type="button"
                      onClick={() => handlePrintKeteranganPoin(defaultSelectedId)}
                      className="w-full py-2.5 px-4 rounded-xl font-bold text-xs shadow-sm transition duration-200 flex items-center justify-center gap-2 cursor-pointer bg-sky-600 hover:bg-sky-700 text-white hover:shadow-md hover:-translate-y-0.5"
                    >
                      <FileText size={14} />
                      Unduh Lembar Keterangan (Word .doc)
                    </button>
                  </div>

                  {/* Mini Details Log Preview */}
                  <div className="lg:col-span-7 bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between">
                    <div className="flex items-center gap-2 text-slate-500 mb-3">
                      <FileText size={16} className="text-slate-400" />
                      <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider">Pratinjau Catatan Buku Saku Siswa</h4>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-full max-h-[180px] overflow-y-auto mb-3 pr-1">
                      {/* Violations Preview Column */}
                      <div className="space-y-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-rose-500 block border-b border-rose-100 pb-1">
                          Catatan Pelanggaran ({currentSelectedSummary.pelanggaranList.length})
                        </span>
                        {currentSelectedSummary.pelanggaranList.length > 0 ? (
                          <div className="space-y-1.5">
                            {currentSelectedSummary.pelanggaranList.map(p => (
                              <div key={p.id} className="p-2 bg-slate-50 border border-slate-100 rounded-lg text-[10px] space-y-0.5 hover:bg-slate-100 transition">
                                <div className="flex justify-between font-bold text-slate-700">
                                  <span className="truncate pr-1">{p.jenisPelanggaran}</span>
                                  <span className="text-rose-600 shrink-0">+{p.poin}</span>
                                </div>
                                <div className="flex justify-between text-slate-400 text-[9px] font-mono">
                                  <span>{p.tanggal}</span>
                                  <span>{p.kategori}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-[10px] text-slate-400 italic py-4 text-center bg-slate-50 rounded-lg border border-dashed border-slate-200">Siswa bersih dari pelanggaran.</p>
                        )}
                      </div>

                      {/* Remissions Preview Column */}
                      <div className="space-y-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-sky-500 block border-b border-sky-100 pb-1">
                          Catatan Remisi ({currentSelectedSummary.remisiList.length})
                        </span>
                        {currentSelectedSummary.remisiList.length > 0 ? (
                          <div className="space-y-1.5">
                            {currentSelectedSummary.remisiList.map(r => (
                              <div key={r.id} className="p-2 bg-slate-50 border border-slate-100 rounded-lg text-[10px] space-y-0.5 hover:bg-slate-100 transition">
                                <div className="flex justify-between font-bold text-slate-700">
                                  <span className="truncate pr-1">{r.jenisRemisi}</span>
                                  <span className="text-sky-600 shrink-0">-{r.poin}</span>
                                </div>
                                <div className="flex justify-between text-slate-400 text-[9px] font-mono">
                                  <span>{r.tanggal}</span>
                                  <span>{r.kategori}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-[10px] text-slate-400 italic py-4 text-center bg-slate-50 rounded-lg border border-dashed border-slate-200">Belum mendapat remisi poin.</p>
                        )}
                      </div>
                    </div>

                    <div className="text-[10px] text-slate-500 bg-amber-50 border border-amber-100 rounded-xl p-2 italic leading-relaxed">
                      <strong>Rekomendasi BK:</strong> {currentSelectedSummary.rekomendasi}
                    </div>
                  </div>
                </div>
              )}

              {/* Table section header */}
              <div className="p-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
                <span className="font-extrabold text-slate-700 text-xs uppercase tracking-wider">Riwayat Log Registrasi Remisi Poin</span>
                <span className="text-[10px] text-slate-400">Total: {filteredList.length} transaksi</span>
              </div>

              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 font-bold uppercase tracking-wider">
                    <th className="py-3 px-4">Siswa</th>
                    <th className="py-3 px-4">Tanggal & Jenis Remisi</th>
                    <th className="py-3 px-4">Kategori & Poin Pengurang</th>
                    <th className="py-3 px-4">Keterangan & Pemberi</th>
                    <th className="py-3 px-4 text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 text-slate-700">
                  {filteredList.length > 0 ? (
                    filteredList.map((r: any) => {
                      const siswa = db.siswa.find(s => s.id === r.siswaId);
                      return (
                        <tr key={r.id} className="hover:bg-slate-50/30">
                          <td className="py-3 px-4 font-bold text-slate-800">{siswa?.nama || 'Siswa'}</td>
                          <td className="py-3 px-4">
                            <p className="font-mono text-[10px] text-slate-400">{r.tanggal}</p>
                            <p className="font-semibold text-slate-700">{r.jenisRemisi}</p>
                          </td>
                          <td className="py-3 px-4">
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold mr-2 bg-sky-100 text-sky-800">{r.kategori}</span>
                            <span className="bg-sky-50 text-sky-700 font-black px-2 py-0.5 rounded">-{r.poin} Pts</span>
                          </td>
                          <td className="py-3 px-4">
                            <p className="font-medium text-slate-600">{r.keterangan}</p>
                            <p className="text-[10px] text-slate-400">Pemberi: {r.guruPemberi}</p>
                          </td>
                          <td className="py-3 px-4 text-center">
                            <div className="flex justify-center gap-1.5">
                              {canModify && (
                                <>
                                  <button onClick={() => openEditor(r)} className="p-1 text-slate-500 hover:text-slate-800"><Edit3 size={14} /></button>
                                  <button onClick={() => handleDelete(r.id)} className="p-1 text-rose-500 hover:text-rose-700"><Trash2 size={14} /></button>
                                </>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr><td colSpan={5} className="py-6 text-center text-slate-400">Belum ada catatan remisi poin pelanggaran.</td></tr>
                  )}
                </tbody>
              </table>
            </>
          )}

          {/* C. PRESTASI LIST */}
          {activeTab === 'prestasi' && (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 font-bold uppercase tracking-wider">
                  <th className="py-3 px-4">Siswa</th>
                  <th className="py-3 px-4">Nama Prestasi</th>
                  <th className="py-3 px-4">Tingkat & Tahun</th>
                  <th className="py-3 px-4">Juara / Hasil</th>
                  <th className="py-3 px-4 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 text-slate-700">
                {filteredList.length > 0 ? (
                  filteredList.map((pr: any) => {
                    const siswa = db.siswa.find(s => s.id === pr.siswaId);
                    return (
                      <tr key={pr.id} className="hover:bg-slate-50/30">
                        <td className="py-3 px-4 font-bold text-slate-800">{siswa?.nama || 'Siswa'}</td>
                        <td className="py-3 px-4 font-medium text-slate-700">{pr.namaPrestasi}</td>
                        <td className="py-3 px-4">
                          <p className="font-semibold text-slate-600">{pr.tingkat}</p>
                          <p className="text-[10px] text-slate-400">{pr.tahun}</p>
                        </td>
                        <td className="py-3 px-4 font-bold text-amber-600">{pr.juara}</td>
                        <td className="py-3 px-4 text-center">
                          <div className="flex justify-center gap-1.5">
                            {canModify && (
                              <>
                                <button onClick={() => openEditor(pr)} className="p-1 text-slate-500 hover:text-slate-800"><Edit3 size={14} /></button>
                                <button onClick={() => handleDelete(pr.id)} className="p-1 text-rose-500 hover:text-rose-700"><Trash2 size={14} /></button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr><td colSpan={5} className="py-6 text-center text-slate-400">Belum ada rekaman prestasi terdaftar.</td></tr>
                )}
              </tbody>
            </table>
          )}

          {/* D. ASESMEN LIST */}
          {activeTab === 'asesmen' && (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 font-bold uppercase tracking-wider">
                  <th className="py-3 px-4">Siswa</th>
                  <th className="py-3 px-4">Hasil AKPD & Gaya Belajar</th>
                  <th className="py-3 px-4">AUM & IQ</th>
                  <th className="py-3 px-4">Bakat & Minat Asesmen</th>
                  <th className="py-3 px-4 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 text-slate-700">
                {filteredList.length > 0 ? (
                  filteredList.map((a: any) => {
                    const siswa = db.siswa.find(s => s.id === a.siswaId);
                    return (
                      <tr key={a.id} className="hover:bg-slate-50/30">
                        <td className="py-3 px-4 font-bold text-slate-800">{siswa?.nama || 'Siswa'}</td>
                        <td className="py-3 px-4">
                          <p className="font-semibold text-indigo-700">AKPD: {a.akpd || '-'}</p>
                          <p className="text-slate-500">Gaya Belajar: {a.dcm || '-'}</p>
                        </td>
                        <td className="py-3 px-4">
                          <p className="font-semibold text-slate-600">AUM: {a.aum || '-'}</p>
                          <p className="text-emerald-700 font-bold">IQ: {a.iq || '-'}</p>
                        </td>
                        <td className="py-3 px-4">
                          <p className="text-slate-700">Bakat: {a.bakat || '-'}</p>
                          <p className="text-slate-500 font-medium">Minat: {a.minat || '-'}</p>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <div className="flex justify-center gap-1.5">
                            {canModify && (
                              <>
                                <button onClick={() => openEditor(a)} className="p-1 text-slate-500 hover:text-slate-800"><Edit3 size={14} /></button>
                                <button onClick={() => handleDelete(a.id)} className="p-1 text-rose-500 hover:text-rose-700"><Trash2 size={14} /></button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr><td colSpan={5} className="py-6 text-center text-slate-400">Belum ada hasil asesmen terdaftar.</td></tr>
                )}
              </tbody>
            </table>
          )}

          {/* E. HOME VISIT LIST */}
          {activeTab === 'homevisit' && (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 font-bold uppercase tracking-wider">
                  <th className="py-3 px-4">Siswa</th>
                  <th className="py-3 px-4">Tanggal Kunjungan</th>
                  <th className="py-3 px-4">Tujuan Home Visit</th>
                  <th className="py-3 px-4">Hasil & Penilaian</th>
                  <th className="py-3 px-4 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 text-slate-700">
                {filteredList.length > 0 ? (
                  filteredList.map((hv: any) => {
                    const siswa = db.siswa.find(s => s.id === hv.siswaId);
                    return (
                      <tr key={hv.id} className="hover:bg-slate-50/30">
                        <td className="py-3 px-4 font-bold text-slate-800">{siswa?.nama || 'Siswa'}</td>
                        <td className="py-3 px-4 font-mono font-semibold">{hv.tanggal}</td>
                        <td className="py-3 px-4 max-w-xs truncate" title={hv.tujuan}>{hv.tujuan}</td>
                        <td className="py-3 px-4 max-w-xs truncate font-medium text-emerald-800" title={hv.hasil}>{hv.hasil}</td>
                        <td className="py-3 px-4 text-center">
                          <div className="flex justify-center gap-1.5">
                            {canModify && (
                              <>
                                <button onClick={() => openEditor(hv)} className="p-1 text-slate-500 hover:text-slate-800"><Edit3 size={14} /></button>
                                <button onClick={() => handleDelete(hv.id)} className="p-1 text-rose-500 hover:text-rose-700"><Trash2 size={14} /></button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr><td colSpan={5} className="py-6 text-center text-slate-400">Belum ada catatan kunjungan rumah (home visit).</td></tr>
                )}
              </tbody>
            </table>
          )}

          {/* F. REKAP KEHADIRAN LIST */}
          {activeTab === 'kehadiran' && (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 font-bold uppercase tracking-wider">
                  <th className="py-3 px-4">Siswa</th>
                  <th className="py-3 px-4">Minggu & Periode</th>
                  <th className="py-3 px-4 text-center">Hadir</th>
                  <th className="py-3 px-4 text-center">Sakit</th>
                  <th className="py-3 px-4 text-center">Ijin</th>
                  <th className="py-3 px-4 text-center">Alfa</th>
                  <th className="py-3 px-4">Keterangan</th>
                  <th className="py-3 px-4 text-center">Unduh Doc Siswa</th>
                  <th className="py-3 px-4 text-center">Unduh Doc Kelas</th>
                  <th className="py-3 px-4 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 text-slate-700">
                {filteredList.length > 0 ? (
                  filteredList.map((att: any) => {
                    const siswa = db.siswa.find(s => s.id === att.siswaId);
                    const kelasId = siswa?.kelasId || 'ALL';
                    const kelas = db.kelas.find(c => c.id === kelasId || c.namaKelas.toLowerCase().trim() === String(kelasId).toLowerCase().trim());
                    const namaKelasDisplay = kelas?.namaKelas || siswa?.kelasId || 'Kelas';

                    return (
                      <tr key={att.id} className="hover:bg-slate-50/30">
                        <td className="py-3 px-4 font-bold text-slate-800">
                          <p>{siswa?.nama || 'Siswa'}</p>
                          <p className="text-[10px] text-slate-400 font-normal">Kelas: {namaKelasDisplay}</p>
                        </td>
                        <td className="py-3 px-4">
                          <p className="font-semibold text-slate-700">{att.mingguKe}</p>
                          <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">{att.bulan} {att.tahun}</p>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <span className="bg-emerald-50 text-emerald-700 font-bold px-2.5 py-1 rounded-lg border border-emerald-100 text-[11px]">
                            {att.hadir} Hari
                          </span>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <span className="bg-sky-50 text-sky-700 font-bold px-2.5 py-1 rounded-lg border border-sky-100 text-[11px]">
                            {att.sakit} Hari
                          </span>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <span className="bg-amber-50 text-amber-700 font-bold px-2.5 py-1 rounded-lg border border-amber-100 text-[11px]">
                            {att.izin || att.ijin || att.izin === 0 ? att.izin : 0} Hari
                          </span>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <span className="bg-rose-50 text-rose-700 font-bold px-2.5 py-1 rounded-lg border border-rose-100 text-[11px]">
                            {att.alfa} Hari
                          </span>
                        </td>
                        <td className="py-3 px-4 text-slate-500 max-w-xs truncate" title={att.keterangan || '-'}>
                          {att.keterangan || '-'}
                        </td>
                        <td className="py-3 px-4 text-center">
                          <button
                            onClick={() => handleDownloadKehadiranSiswaDoc(att.siswaId)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 rounded-lg text-[11px] font-bold transition shadow-xs"
                            title="Unduh Laporan Kehadiran Persiswa (Format DOC)"
                          >
                            <FileDown size={13} />
                            Doc Siswa
                          </button>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <button
                            onClick={() => handleDownloadKehadiranKelasDoc(kelas?.id || kelasId)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-lg text-[11px] font-bold transition shadow-xs"
                            title="Unduh Laporan Kehadiran Perkelas (Format DOC)"
                          >
                            <FileText size={13} />
                            Doc Kelas
                          </button>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <div className="flex justify-center gap-1.5">
                            {canModify && (
                              <>
                                <button onClick={() => openEditor(att)} className="p-1 text-slate-500 hover:text-slate-800" title="Edit"><Edit3 size={14} /></button>
                                <button onClick={() => handleDelete(att.id)} className="p-1 text-rose-500 hover:text-rose-700" title="Hapus"><Trash2 size={14} /></button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr><td colSpan={10} className="py-6 text-center text-slate-400">Belum ada rekap kehadiran terdaftar.</td></tr>
                )}
              </tbody>
            </table>
          )}

        </div>
      </div>

      {/* DYNAMIC FORM MODAL BASED ON SELECTED TAB */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-hidden flex flex-col shadow-2xl border border-slate-100">
            {/* Header */}
            <div className="p-4 border-b border-slate-100 bg-slate-50/80 flex items-center justify-between">
              <h3 className="font-bold text-slate-800 text-sm">
                {editingId ? 'Edit Catatan' : 'Tambah Catatan Baru'} - {activeTab.toUpperCase()}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="p-1 text-slate-400 hover:bg-slate-200 rounded-full"><X size={16} /></button>
            </div>

            {/* Scrollable form container */}
            <form onSubmit={handleFormSubmit} className="flex-1 overflow-y-auto p-5 space-y-4 text-xs">
              
              {/* Common field: Student selection */}
              <div>
                <label className="block text-[10px] font-bold text-slate-500 mb-1">Pilih Siswa</label>
                <select 
                  value={
                    activeTab === 'konseling' ? formKonseling.siswaId :
                    activeTab === 'pelanggaran' ? formPelanggaran.siswaId :
                    activeTab === 'remisi' ? formRemisiPoin.siswaId :
                    activeTab === 'prestasi' ? formPrestasi.siswaId :
                    activeTab === 'asesmen' ? formAsesmen.siswaId :
                    activeTab === 'homevisit' ? formHomeVisit.siswaId : formKehadiran.siswaId
                  } 
                  onChange={(e) => {
                    const val = e.target.value;
                    if (activeTab === 'konseling') setFormKonseling(prev => ({ ...prev, siswaId: val }));
                    else if (activeTab === 'pelanggaran') setFormPelanggaran(prev => ({ ...prev, siswaId: val }));
                    else if (activeTab === 'remisi') setFormRemisiPoin(prev => ({ ...prev, siswaId: val }));
                    else if (activeTab === 'prestasi') setFormPrestasi(prev => ({ ...prev, siswaId: val }));
                    else if (activeTab === 'asesmen') setFormAsesmen(prev => ({ ...prev, siswaId: val }));
                    else if (activeTab === 'homevisit') setFormHomeVisit(prev => ({ ...prev, siswaId: val }));
                    else if (activeTab === 'kehadiran') setFormKehadiran(prev => ({ ...prev, siswaId: val }));
                  }}
                  className="p-2.5 border border-slate-200 bg-white rounded-xl w-full"
                  required
                >
                  {db.siswa.map(s => <option key={s.id} value={s.id}>{s.nama} ({db.kelas.find(k => k.id === s.kelasId)?.namaKelas})</option>)}
                </select>
              </div>

              {/* A. KONSELING FIELDS */}
              {activeTab === 'konseling' && (
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 mb-1">Tanggal</label>
                      <input type="date" value={formKonseling.tanggal || ''} onChange={(e) => setFormKonseling(prev => ({ ...prev, tanggal: e.target.value }))} className="p-2.5 border border-slate-200 rounded-xl w-full" required />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 mb-1">Jenis Layanan</label>
                      <select value={formKonseling.jenis || 'Individu'} onChange={(e) => setFormKonseling(prev => ({ ...prev, jenis: e.target.value as any }))} className="p-2.5 border border-slate-200 bg-white rounded-xl w-full">
                        <option value="Individu">Individu</option>
                        <option value="Kelompok">Kelompok</option>
                        <option value="Klasikal">Klasikal</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 mb-1">Permasalahan Utama</label>
                    <textarea rows={2} value={formKonseling.permasalahan || ''} onChange={(e) => setFormKonseling(prev => ({ ...prev, permasalahan: e.target.value }))} className="p-2.5 border border-slate-200 rounded-xl w-full" required />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 mb-1">Analisis Guru BK</label>
                    <textarea rows={2} value={formKonseling.analisis || ''} onChange={(e) => setFormKonseling(prev => ({ ...prev, analisis: e.target.value }))} className="p-2.5 border border-slate-200 rounded-xl w-full" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 mb-1">Solusi & Rekomendasi</label>
                    <textarea rows={2} value={formKonseling.solusi || ''} onChange={(e) => setFormKonseling(prev => ({ ...prev, solusi: e.target.value }))} className="p-2.5 border border-slate-200 rounded-xl w-full" />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 mb-1">Hasil Evaluasi</label>
                      <input type="text" value={formKonseling.hasil || ''} onChange={(e) => setFormKonseling(prev => ({ ...prev, hasil: e.target.value }))} className="p-2.5 border border-slate-200 rounded-xl w-full" />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 mb-1">Tindak Lanjut</label>
                      <input type="text" value={formKonseling.tindakLanjut || ''} onChange={(e) => setFormKonseling(prev => ({ ...prev, tindakLanjut: e.target.value }))} className="p-2.5 border border-slate-200 rounded-xl w-full" />
                    </div>
                  </div>
                </div>
              )}

              {/* B. PELANGGARAN FIELDS */}
              {activeTab === 'pelanggaran' && (
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 mb-1">Tanggal</label>
                      <input type="date" value={formPelanggaran.tanggal || ''} onChange={(e) => setFormPelanggaran(prev => ({ ...prev, tanggal: e.target.value }))} className="p-2.5 border border-slate-200 rounded-xl w-full" required />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 mb-1">Kategori Pelanggaran</label>
                      <select 
                        value={formPelanggaran.kategori || 'Ringan'} 
                        onChange={(e) => {
                          const kat = e.target.value;
                          const defaultPoin = kat === 'Berat' ? 75 : kat === 'Sedang' ? 30 : 5;
                          setFormPelanggaran(prev => ({ ...prev, kategori: kat, poin: defaultPoin }));
                        }} 
                        className="p-2.5 border border-slate-200 bg-white rounded-xl w-full"
                      >
                        <option value="Ringan">Ringan (5-15 Poin)</option>
                        <option value="Sedang">Sedang (16-50 Poin)</option>
                        <option value="Berat">Berat (51-150 Poin)</option>
                      </select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 mb-1">Poin Pelanggaran</label>
                      <input type="number" value={formPelanggaran.poin || 0} onChange={(e) => setFormPelanggaran(prev => ({ ...prev, poin: Number(e.target.value) }))} className="p-2.5 border border-slate-200 rounded-xl w-full" required />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 mb-1">Status Penanganan</label>
                      <select value={formPelanggaran.status || 'Belum Ditindak'} onChange={(e) => setFormPelanggaran(prev => ({ ...prev, status: e.target.value as any }))} className="p-2.5 border border-slate-200 bg-white rounded-xl w-full">
                        <option value="Belum Ditindak">Belum Ditindak</option>
                        <option value="Proses">Sedang Diproses</option>
                        <option value="Selesai">Selesai / Terbina</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 mb-1">Bentuk Pelanggaran</label>
                    <input type="text" placeholder="e.g., Terlambat masuk sekolah, bolos" value={formPelanggaran.jenisPelanggaran || ''} onChange={(e) => setFormPelanggaran(prev => ({ ...prev, jenisPelanggaran: e.target.value }))} className="p-2.5 border border-slate-200 rounded-xl w-full" required />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 mb-1">Tindak Lanjut & Sanksi</label>
                    <textarea rows={2} value={formPelanggaran.tindakLanjut || ''} onChange={(e) => setFormPelanggaran(prev => ({ ...prev, tindakLanjut: e.target.value }))} className="p-2.5 border border-slate-200 rounded-xl w-full" required />
                  </div>
                </div>
              )}

              {/* B2. REMISI POIN FIELDS */}
              {activeTab === 'remisi' && (
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 mb-1">Tanggal</label>
                      <input type="date" value={formRemisiPoin.tanggal || ''} onChange={(e) => setFormRemisiPoin(prev => ({ ...prev, tanggal: e.target.value }))} className="p-2.5 border border-slate-200 rounded-xl w-full" required />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 mb-1">Kategori Remisi</label>
                      <select 
                        value={formRemisiPoin.kategori || 'Karakter Baik'} 
                        onChange={(e) => {
                          const kat = e.target.value;
                          const defaultPoin = kat === 'Prestasi Luar Biasa' ? 50 : kat === 'Membantu Guru' ? 20 : 10;
                          setFormRemisiPoin(prev => ({ ...prev, kategori: kat, poin: defaultPoin }));
                        }} 
                        className="p-2.5 border border-slate-200 bg-white rounded-xl w-full"
                      >
                        <option value="Karakter Baik">Karakter Baik (10 Poin)</option>
                        <option value="Membantu Guru">Membantu Tugas Guru (20 Poin)</option>
                        <option value="Prestasi Luar Biasa">Prestasi Luar Biasa (50 Poin)</option>
                      </select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 mb-1">Poin Remisi (Pengurang Pelanggaran)</label>
                      <input type="number" value={formRemisiPoin.poin || 0} onChange={(e) => setFormRemisiPoin(prev => ({ ...prev, poin: Number(e.target.value) }))} className="p-2.5 border border-slate-200 rounded-xl w-full" required />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 mb-1">Guru Pemberi Remisi</label>
                      <input type="text" value={formRemisiPoin.guruPemberi || ''} onChange={(e) => setFormRemisiPoin(prev => ({ ...prev, guruPemberi: e.target.value }))} className="p-2.5 border border-slate-200 rounded-xl w-full" required />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 mb-1">Bentuk Perilaku Baik / Kegiatan Positif</label>
                    <input type="text" placeholder="e.g., Kerja bakti sukarela, mengembalikan dompet hilang" value={formRemisiPoin.jenisRemisi || ''} onChange={(e) => setFormRemisiPoin(prev => ({ ...prev, jenisRemisi: e.target.value }))} className="p-2.5 border border-slate-200 rounded-xl w-full" required />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 mb-1">Keterangan / Catatan Tambahan</label>
                    <textarea rows={2} value={formRemisiPoin.keterangan || ''} onChange={(e) => setFormRemisiPoin(prev => ({ ...prev, keterangan: e.target.value }))} className="p-2.5 border border-slate-200 rounded-xl w-full" required />
                  </div>
                </div>
              )}

              {/* C. PRESTASI FIELDS */}
              {activeTab === 'prestasi' && (
                <div className="space-y-3">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 mb-1">Nama Prestasi / Piagam</label>
                    <input type="text" value={formPrestasi.namaPrestasi || ''} onChange={(e) => setFormPrestasi(prev => ({ ...prev, namaPrestasi: e.target.value }))} className="p-2.5 border border-slate-200 rounded-xl w-full" required />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 mb-1">Tingkat Perlombaan</label>
                      <select value={formPrestasi.tingkat || 'Sekolah'} onChange={(e) => setFormPrestasi(prev => ({ ...prev, tingkat: e.target.value }))} className="p-2.5 border border-slate-200 bg-white rounded-xl w-full">
                        <option value="Sekolah">Sekolah</option>
                        <option value="Kecamatan">Kecamatan</option>
                        <option value="Kabupaten">Kabupaten</option>
                        <option value="Provinsi">Provinsi</option>
                        <option value="Nasional">Nasional</option>
                        <option value="Internasional">Internasional</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 mb-1">Tahun Perolehan</label>
                      <input type="text" value={formPrestasi.tahun || ''} onChange={(e) => setFormPrestasi(prev => ({ ...prev, tahun: e.target.value }))} className="p-2.5 border border-slate-200 rounded-xl w-full" required />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 mb-1">Juara Ke-</label>
                    <input type="text" placeholder="e.g., Juara I Utama, Harapan II" value={formPrestasi.juara || ''} onChange={(e) => setFormPrestasi(prev => ({ ...prev, juara: e.target.value }))} className="p-2.5 border border-slate-200 rounded-xl w-full" required />
                  </div>
                </div>
              )}

              {/* D. ASESMEN FIELDS */}
              {activeTab === 'asesmen' && (
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 mb-1">Hasil AKPD</label>
                      <input type="text" value={formAsesmen.akpd || ''} onChange={(e) => setFormAsesmen(prev => ({ ...prev, akpd: e.target.value }))} className="p-2.5 border border-slate-200 rounded-xl w-full" />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 mb-1">Gaya Belajar</label>
                      <input type="text" placeholder="e.g., Visual, Auditori, Kinestetik" value={formAsesmen.dcm || ''} onChange={(e) => setFormAsesmen(prev => ({ ...prev, dcm: e.target.value }))} className="p-2.5 border border-slate-200 rounded-xl w-full" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 mb-1">Alat Ungkap Masalah (AUM)</label>
                      <input type="text" value={formAsesmen.aum || ''} onChange={(e) => setFormAsesmen(prev => ({ ...prev, aum: e.target.value }))} className="p-2.5 border border-slate-200 rounded-xl w-full" />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 mb-1">IQ Score</label>
                      <input type="number" value={formAsesmen.iq || 100} onChange={(e) => setFormAsesmen(prev => ({ ...prev, iq: Number(e.target.value) }))} className="p-2.5 border border-slate-200 rounded-xl w-full" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 mb-1">Bakat Terdeteksi</label>
                      <input type="text" value={formAsesmen.bakat || ''} onChange={(e) => setFormAsesmen(prev => ({ ...prev, bakat: e.target.value }))} className="p-2.5 border border-slate-200 rounded-xl w-full" />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 mb-1">Minat Terdeteksi</label>
                      <input type="text" value={formAsesmen.minat || ''} onChange={(e) => setFormAsesmen(prev => ({ ...prev, minat: e.target.value }))} className="p-2.5 border border-slate-200 rounded-xl w-full" />
                    </div>
                  </div>
                </div>
              )}

              {/* E. HOME VISIT FIELDS */}
              {activeTab === 'homevisit' && (
                <div className="space-y-3">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 mb-1">Tanggal Kunjungan Rumah</label>
                    <input type="date" value={formHomeVisit.tanggal || ''} onChange={(e) => setFormHomeVisit(prev => ({ ...prev, tanggal: e.target.value }))} className="p-2.5 border border-slate-200 rounded-xl w-full" required />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 mb-1">Tujuan Kunjungan</label>
                    <textarea rows={2} placeholder="e.g., Menelusuri kendala belajar..." value={formHomeVisit.tujuan || ''} onChange={(e) => setFormHomeVisit(prev => ({ ...prev, tujuan: e.target.value }))} className="p-2.5 border border-slate-200 rounded-xl w-full" required />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 mb-1">Hasil & Temuan Lapangan</label>
                    <textarea rows={3} placeholder="e.g., Kondisi keluarga kooperatif..." value={formHomeVisit.hasil || ''} onChange={(e) => setFormHomeVisit(prev => ({ ...prev, hasil: e.target.value }))} className="p-2.5 border border-slate-200 rounded-xl w-full" required />
                  </div>
                </div>
              )}

              {/* F. KEHADIRAN FIELDS */}
              {activeTab === 'kehadiran' && (
                <div className="space-y-3">
                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 mb-1">Minggu Ke</label>
                      <select value={formKehadiran.mingguKe || 'Minggu 1'} onChange={(e) => setFormKehadiran(prev => ({ ...prev, mingguKe: e.target.value }))} className="p-2 border border-slate-200 bg-white rounded-xl w-full">
                        <option value="Minggu 1">Minggu 1</option>
                        <option value="Minggu 2">Minggu 2</option>
                        <option value="Minggu 3">Minggu 3</option>
                        <option value="Minggu 4">Minggu 4</option>
                        <option value="Minggu 5">Minggu 5</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 mb-1">Bulan</label>
                      <select value={formKehadiran.bulan || 'Juli'} onChange={(e) => setFormKehadiran(prev => ({ ...prev, bulan: e.target.value }))} className="p-2 border border-slate-200 bg-white rounded-xl w-full">
                        {['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'].map(m => (
                          <option key={m} value={m}>{m}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 mb-1">Tahun</label>
                      <input type="text" value={formKehadiran.tahun || '2026'} onChange={(e) => setFormKehadiran(prev => ({ ...prev, tahun: e.target.value }))} className="p-2 border border-slate-200 rounded-xl w-full" required />
                    </div>
                  </div>

                  <div className="grid grid-cols-4 gap-2">
                    <div>
                      <label className="block text-[10px] font-bold text-emerald-600 mb-1">Hadir (Hari)</label>
                      <input type="number" min="0" max="7" value={formKehadiran.hadir === undefined ? 5 : formKehadiran.hadir} onChange={(e) => setFormKehadiran(prev => ({ ...prev, hadir: Number(e.target.value) }))} className="p-2 border border-slate-200 rounded-xl w-full text-center" required />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-sky-600 mb-1">Sakit (Hari)</label>
                      <input type="number" min="0" max="7" value={formKehadiran.sakit === undefined ? 0 : formKehadiran.sakit} onChange={(e) => setFormKehadiran(prev => ({ ...prev, sakit: Number(e.target.value) }))} className="p-2 border border-slate-200 rounded-xl w-full text-center" required />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-amber-600 mb-1">Ijin (Hari)</label>
                      <input type="number" min="0" max="7" value={formKehadiran.izin === undefined ? 0 : formKehadiran.izin} onChange={(e) => setFormKehadiran(prev => ({ ...prev, izin: Number(e.target.value), ijin: Number(e.target.value) }))} className="p-2 border border-slate-200 rounded-xl w-full text-center" required />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-rose-600 mb-1">Alfa (Hari)</label>
                      <input type="number" min="0" max="7" value={formKehadiran.alfa === undefined ? 0 : formKehadiran.alfa} onChange={(e) => setFormKehadiran(prev => ({ ...prev, alfa: Number(e.target.value) }))} className="p-2 border border-slate-200 rounded-xl w-full text-center" required />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 mb-1">Keterangan / Alasan Ketidakhadiran</label>
                    <textarea rows={2} placeholder="e.g., Sakit demam berdarah, ada acara keluarga besar..." value={formKehadiran.keterangan || ''} onChange={(e) => setFormKehadiran(prev => ({ ...prev, keterangan: e.target.value }))} className="p-2.5 border border-slate-200 rounded-xl w-full" />
                  </div>
                </div>
              )}

              {/* Submit Buttons */}
              <div className="p-4 bg-slate-50 border-t border-slate-100 -mx-5 -mb-5 flex justify-end gap-2 rounded-b-2xl">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 bg-slate-200 text-slate-600 rounded-xl hover:bg-slate-300 font-semibold">Batal</button>
                <button type="submit" className="px-5 py-2 bg-slate-800 hover:bg-slate-900 text-white font-bold rounded-xl shadow-sm">Simpan Data</button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* Custom Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-xl border border-slate-100 space-y-4 animate-scale-up">
            <div className="flex items-center gap-3 text-rose-600">
              <div className="w-10 h-10 bg-rose-50 rounded-xl flex items-center justify-center">
                <AlertTriangle size={20} />
              </div>
              <h3 className="font-bold text-slate-800 text-sm">Konfirmasi Hapus</h3>
            </div>
            
            <p className="text-xs text-slate-500 leading-relaxed">
              Apakah Anda yakin ingin menghapus data ini secara permanen? Tindakan ini tidak dapat dibatalkan dan akan terhapus dari sistem.
            </p>

            <div className="flex justify-end gap-2 pt-2">
              <button 
                type="button" 
                onClick={() => setDeleteConfirmId(null)}
                disabled={isDeleting}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl font-semibold text-xs transition disabled:opacity-50"
              >
                Batal
              </button>
              <button 
                type="button" 
                onClick={confirmDelete}
                disabled={isDeleting}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-bold text-xs shadow-sm transition flex items-center gap-1.5 disabled:opacity-50"
              >
                {isDeleting ? 'Menghapus...' : 'Ya, Hapus'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Custom Modal for PNG download preview */}
      {generatedPngUrl && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 space-y-4 animate-scale-up my-8">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2 text-sky-600">
                <FileDown size={20} />
                <h3 className="font-bold text-slate-800 text-sm">Lembar Keterangan Siap Diunduh</h3>
              </div>
              <button 
                type="button" 
                onClick={() => setGeneratedPngUrl(null)}
                className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 font-bold text-lg leading-none"
              >
                &times;
              </button>
            </div>
            
            <div className="bg-amber-50 border border-amber-100 rounded-xl p-3.5 text-xs text-slate-600 leading-relaxed space-y-1.5">
              <p className="font-semibold text-amber-800">⚠️ Petunjuk Unduh Manual:</p>
              <p>
                Jika file gambar tidak terunduh otomatis (karena proteksi browser/iframe), silakan lakukan unduhan manual dengan cara:
              </p>
              <ul className="list-disc pl-4 space-y-1 mt-1 text-slate-700">
                <li><strong>Pada Komputer:</strong> Klik kanan pada gambar di bawah, pilih <span className="font-bold text-slate-800">"Simpan gambar sebagai..."</span> (Save Image As...).</li>
                <li><strong>Pada HP/Tablet:</strong> Tekan dan tahan gambar di bawah selama beberapa detik, lalu pilih <span className="font-bold text-slate-800">"Simpan Gambar"</span> atau <span className="font-bold text-slate-800">"Unduh Gambar"</span>.</li>
              </ul>
            </div>

            <div className="border border-slate-200 rounded-xl overflow-hidden shadow-sm bg-slate-100 max-h-[300px] overflow-y-auto flex justify-center p-2">
              <img 
                src={generatedPngUrl} 
                alt="Pratinjau Lembar Keterangan" 
                className="w-full h-auto object-contain border border-slate-200 bg-white shadow-sm rounded-lg"
                referrerPolicy="no-referrer"
              />
            </div>

            <div className="flex justify-between items-center pt-2">
              <p className="text-[10px] text-slate-400 truncate max-w-[180px]">File: Lembar_Keterangan_{generatedSiswaNama.replace(/\s+/g, '_')}.png</p>
              <div className="flex gap-2">
                <button 
                  type="button" 
                  onClick={() => setGeneratedPngUrl(null)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl font-semibold text-xs transition cursor-pointer"
                >
                  Tutup
                </button>
                <a 
                  href={generatedPngUrl}
                  download={`Lembar_Keterangan_${generatedSiswaNama.replace(/\s+/g, '_')}.png`}
                  className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-xl font-bold text-xs shadow-sm transition flex items-center gap-1.5 cursor-pointer"
                >
                  <FileDown size={14} />
                  Unduh PNG
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Hidden high-fidelity component for PNG generation (positioned off-screen, not display:none) */}
      <div 
        id="print-section-png-target"
        className="absolute bg-white text-slate-800 p-8 border border-slate-100"
        style={{
          width: '794px',
          minHeight: '1123px',
          fontFamily: 'sans-serif',
          top: '-9999px',
          left: '-9999px',
          position: 'absolute',
          pointerEvents: 'none'
        }}
      >
        {currentSelectedSummary && (
          <div style={{ width: '730px' }}>
            {/* Kop Surat */}
            <div className="flex items-center justify-between pb-4 border-b-4 border-double border-slate-900 mb-6 text-center">
              <div className="w-16 h-16 border-2 border-slate-800 rounded-full flex items-center justify-center font-bold text-slate-800 text-[10px] shrink-0">
                LOGO
              </div>
              <div className="flex-1 px-4">
                <p className="text-[11px] uppercase tracking-widest font-bold text-slate-500">Pemerintah Provinsi Banten</p>
                <h1 className="text-lg font-extrabold text-slate-900 leading-tight">DINAS PENDIDIKAN DAN KEBUDAYAAN</h1>
                <h2 className="text-base font-bold text-slate-800">UPTD SMPN 17 KOTA TANGERANG SELATAN</h2>
                <p className="text-[10px] text-slate-500 italic mt-0.5">Komplek Pamulang Permai I, RT.003/RW.010, Kelurahan Pamulang Barat, Kecamatan Pamulang, Kota Tangerang Selatan, Banten 15417. Telp: (021) 7560555</p>
              </div>
              <div className="w-16 h-16 shrink-0"></div>
            </div>

            {/* Document Title */}
            <div className="text-center mb-6 space-y-1">
              <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-900">LEMBAR KETERANGAN AKUMULASI POIN KEDISIPLINAN DAN REMISI</h3>
              <p className="text-xs text-slate-400 font-mono">Nomor: Reg.BK/Remisi/{new Date().getFullYear()}/{Math.floor(Math.random() * 9000) + 1000}</p>
            </div>

            {/* Preamble */}
            <p className="text-xs text-slate-700 leading-relaxed mb-4">
              Yang bertanda tangan di bawah ini, Guru bimbingan konseling dan ketertiban siswa UPTD SMPN 17 Kota Tangerang Selatan menerangkan bahwasanya siswa tersebut di bawah ini telah tercatat dalam sistem poin pembinaan kedisiplinan dan pengurangan remisi:
            </p>

            {/* Siswa Data Table */}
            <table className="w-full text-xs border border-slate-200 rounded-xl overflow-hidden mb-6">
              <tbody>
                <tr className="bg-slate-50 border-b border-slate-100">
                  <td className="px-4 py-2.5 font-bold text-slate-500 w-1/3">Nama Lengkap Siswa</td>
                  <td className="px-4 py-2.5 font-bold text-slate-800">{currentSelectedSummary.siswa.nama}</td>
                </tr>
                <tr className="border-b border-slate-100">
                  <td className="px-4 py-2.5 font-bold text-slate-500">NIS / NISN</td>
                  <td className="px-4 py-2.5 font-mono text-slate-800">{currentSelectedSummary.siswa.nis || '-'} / {currentSelectedSummary.siswa.nisn || '-'}</td>
                </tr>
                <tr className="bg-slate-50 border-b border-slate-100">
                  <td className="px-4 py-2.5 font-bold text-slate-500">Kelas</td>
                  <td className="px-4 py-2.5 font-semibold text-slate-800">{currentSelectedSummary.kelasName}</td>
                </tr>
                <tr>
                  <td className="px-4 py-2.5 font-bold text-slate-500">Jenis Kelamin</td>
                  <td className="px-4 py-2.5 text-slate-800">{currentSelectedSummary.siswa.jenisKelamin}</td>
                </tr>
              </tbody>
            </table>

            {/* Scoreboard Summary Card */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="p-3 bg-rose-50 border border-rose-100 rounded-xl text-center">
                <span className="block text-[10px] font-bold text-rose-500 uppercase tracking-wider mb-1">Total Pelanggaran</span>
                <span className="text-xl font-extrabold text-rose-700">{currentSelectedSummary.totalPelanggaran} <span className="text-[11px] font-normal">Pts</span></span>
              </div>
              <div className="p-3 bg-sky-50 border border-sky-100 rounded-xl text-center">
                <span className="block text-[10px] font-bold text-sky-500 uppercase tracking-wider mb-1">Poin Remisi</span>
                <span className="text-xl font-extrabold text-sky-700">-{currentSelectedSummary.totalRemisi} <span className="text-[11px] font-normal">Pts</span></span>
              </div>
              <div className="p-3 bg-emerald-50 border border-emerald-100 rounded-xl text-center">
                <span className="block text-[10px] font-bold text-emerald-600 uppercase tracking-wider mb-1">Sisa Akumulasi Poin</span>
                <span className="text-xl font-extrabold text-emerald-800">{currentSelectedSummary.sisaPoin} <span className="text-[11px] font-normal">Pts</span></span>
              </div>
            </div>

            {/* Status Box */}
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 mb-6 flex justify-between items-center text-xs">
              <div>
                <span className="font-bold text-slate-400 block text-[9px] uppercase tracking-wider">Predikat Evaluasi Perilaku</span>
                <span className="text-sm font-bold text-slate-800">{currentSelectedSummary.statusLabel}</span>
              </div>
              <div className="text-right text-[10px] text-slate-400 italic">
                * Tata tertib batas maksimal pelanggaran: 100 Pts
              </div>
            </div>

            {/* History Logs Split View */}
            <div className="grid grid-cols-2 gap-6 mb-6">
              {/* Violations Log Column */}
              <div className="space-y-2">
                <h4 className="text-xs font-extrabold uppercase tracking-wide text-red-600 border-b border-red-100 pb-1.5 flex justify-between">
                  <span>Rincian Pelanggaran</span>
                  <span>({currentSelectedSummary.pelanggaranList.length})</span>
                </h4>
                {currentSelectedSummary.pelanggaranList.length > 0 ? (
                  <div className="space-y-2">
                    {currentSelectedSummary.pelanggaranList.map(p => (
                      <div key={p.id} className="p-2.5 bg-slate-50 border border-slate-100 rounded-lg text-xs space-y-1">
                        <div className="flex justify-between font-bold text-slate-700">
                          <span className="truncate pr-1" style={{ maxWidth: '140px', display: 'inline-block' }}>{p.jenisPelanggaran}</span>
                          <span className="text-red-600 shrink-0">+{p.poin} Pts</span>
                        </div>
                        <div className="flex justify-between text-slate-400 text-[10px] font-mono">
                          <span>Tgl: {p.tanggal}</span>
                          <span>Kategori: {p.kategori}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-400 italic text-center py-6 bg-slate-50 rounded-lg border border-dashed border-slate-200">Tidak ada catatan pelanggaran disiplin.</p>
                )}
              </div>

              {/* Remissions Log Column */}
              <div className="space-y-2">
                <h4 className="text-xs font-extrabold uppercase tracking-wide text-sky-600 border-b border-sky-100 pb-1.5 flex justify-between">
                  <span>Rincian Remisi Poin</span>
                  <span>({currentSelectedSummary.remisiList.length})</span>
                </h4>
                {currentSelectedSummary.remisiList.length > 0 ? (
                  <div className="space-y-2">
                    {currentSelectedSummary.remisiList.map(r => (
                      <div key={r.id} className="p-2.5 bg-slate-50 border border-slate-100 rounded-lg text-xs space-y-1">
                        <div className="flex justify-between font-bold text-slate-700">
                          <span className="truncate pr-1" style={{ maxWidth: '140px', display: 'inline-block' }}>{r.jenisRemisi}</span>
                          <span className="text-sky-600 shrink-0">-{r.poin} Pts</span>
                        </div>
                        <div className="flex justify-between text-slate-400 text-[10px] font-mono">
                          <span>Tgl: {r.tanggal}</span>
                          <span>Kategori: {r.kategori}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-400 italic text-center py-6 bg-slate-50 rounded-lg border border-dashed border-slate-200">Belum memiliki pengurang remisi poin.</p>
                )}
              </div>
            </div>

            {/* Legal / Recommendation Statement */}
            <div className="p-4 bg-amber-50 border border-amber-100 rounded-xl text-xs text-slate-600 italic leading-relaxed mb-8">
              <strong>Catatan Rekomendasi BK:</strong> Siswa dengan poin aktif akhir sebanyak <strong>{currentSelectedSummary.sisaPoin} Poin</strong> direkomendasikan untuk senantiasa dibimbing dan didorong untuk berpartisipasi dalam aksi-aksi sosial/kebaikan sekolah guna mengikis poin akumulasi pelanggaran.
            </div>

            {/* Signature Block */}
            <div className="grid grid-cols-3 gap-4 text-xs text-center mt-12 pt-8">
              <div>
                <p className="text-slate-400 mb-14">Orang Tua / Wali Siswa</p>
                <div className="w-32 mx-auto border-b border-slate-400 h-5"></div>
                <p className="text-[10px] text-slate-400 mt-1">Nama Jelas & Ttd</p>
              </div>
              <div>
                <p className="text-slate-400 mb-14">Guru Bimbingan Konseling</p>
                <p className="font-bold text-slate-800 underline">{currentUser.nama}</p>
                <p className="text-[10px] text-slate-400">NIP. 19850325 201101 2 003</p>
              </div>
              <div>
                <p className="text-slate-400 mb-14">Tangerang Selatan, {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                <p className="font-bold text-slate-800 underline">Drs. H. Mulyadi, M.Pd</p>
                <p className="text-[10px] text-slate-400">Kepala Sekolah / NIP. 19740112 199903 1 002</p>
              </div>
            </div>
          </div>
        )}
      </div>

    </div>
  );
}
