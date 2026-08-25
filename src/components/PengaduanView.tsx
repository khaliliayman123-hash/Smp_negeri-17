/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useRef } from 'react';
import {
  DatabaseState,
  User,
  UserRole,
  PengaduanSiswa,
  Siswa
} from '../types';
import { 
  AlertCircle, 
  Send, 
  Upload, 
  Download, 
  Eye, 
  Trash2, 
  CheckCircle2, 
  Clock, 
  Filter, 
  Search, 
  Image as ImageIcon, 
  FileText, 
  MessageSquare, 
  UserCheck, 
  X, 
  PlusCircle, 
  CheckCircle,
  AlertTriangle,
  RefreshCw,
  ExternalLink
} from 'lucide-react';

interface PengaduanViewProps {
  db: DatabaseState;
  currentUser: User;
  onSavePengaduan: (p: PengaduanSiswa, isNew: boolean) => Promise<boolean>;
  onDeletePengaduan: (id: string) => Promise<boolean>;
  onUpdateStatus: (
    id: string, 
    status: 'Menunggu Respon' | 'Sedang Ditangani' | 'Selesai' | 'Ditolak', 
    tanggapan?: string, 
    petugas?: string
  ) => Promise<boolean>;
}

export default function PengaduanView({
  db,
  currentUser,
  onSavePengaduan,
  onDeletePengaduan,
  onUpdateStatus
}: PengaduanViewProps) {
  const isStudent = currentUser.role === UserRole.SISWA;
  const isTeacherOrAdmin = 
    currentUser.role === UserRole.ADMIN || 
    currentUser.role === UserRole.GURU_BK || 
    currentUser.role === UserRole.WALI_KELAS || 
    currentUser.role === UserRole.GURU_PIKET;

  // Student matching with strict null safety
  const currentSiswa = useMemo(() => {
    if (!isStudent || !db) return null;
    const siswaList = db.siswa || [];
    const username = (currentUser.username || '').trim().toLowerCase();
    const userNama = (currentUser.nama || '').trim().toLowerCase();

    return (
      siswaList.find(s => s && s.id === currentUser.id) ||
      siswaList.find(s => s && s.nis && s.nis.toString().trim().toLowerCase() === username) ||
      siswaList.find(s => s && s.nisn && s.nisn.toString().trim().toLowerCase() === username) ||
      siswaList.find(s => s && s.nama && s.nama.toString().trim().toLowerCase() === userNama) ||
      null
    );
  }, [db, currentUser, isStudent]);

  // Tab State
  const [activeTab, setActiveTab] = useState<'form' | 'list'>(isStudent ? 'form' : 'list');

  // Form State for new complaint
  const [judulPengaduan, setJudulPengaduan] = useState('');
  const [kategori, setKategori] = useState('Perundungan / Bullying');
  const [tanggalKejadian, setTanggalKejadian] = useState(() => new Date().toISOString().split('T')[0]);
  const [kronologis, setKronologis] = useState('');
  const [buktiFoto, setBuktiFoto] = useState<string | undefined>(undefined);
  const [namaFoto, setNamaFoto] = useState<string | undefined>(undefined);
  const [ukuranFoto, setUkuranFoto] = useState<number | undefined>(undefined);
  const [fileError, setFileError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Filter & Search State (For Teachers/Admins)
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('Semua');
  const [kategoriFilter, setKategoriFilter] = useState('Semua');
  const [kelasFilter, setKelasFilter] = useState('Semua');

  // Modal State for Photo Viewer
  const [viewingPhoto, setViewingPhoto] = useState<{ src: string; title: string; filename?: string } | null>(null);
  
  // Modal State for Full Chronology Details
  const [viewingKronologis, setViewingKronologis] = useState<PengaduanSiswa | null>(null);

  // Modal State for Teacher Response / Status Change
  const [respondingItem, setRespondingItem] = useState<PengaduanSiswa | null>(null);
  const [responseStatus, setResponseStatus] = useState<'Menunggu Respon' | 'Sedang Ditangani' | 'Selesai' | 'Ditolak'>('Sedang Ditangani');
  const [tanggapanText, setTanggapanText] = useState('');
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  // Modal State for Delete Confirmation (no native confirm in iframe)
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Max photo size = 1 MB (1024 * 1024 bytes)
  const MAX_FILE_SIZE = 1 * 1024 * 1024;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setFileError(null);
    if (!file) return;

    // Validate size (max 1 MB)
    if (file.size > MAX_FILE_SIZE) {
      const sizeMB = (file.size / (1024 * 1024)).toFixed(2);
      setFileError(`⚠️ Ukuran foto melebihi batas maksimal 1 MB (Ukuran foto Anda: ${sizeMB} MB). Silakan pilih foto lain yang ukurannya maksimal 1 MB atau kompres foto terlebih dahulu.`);
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    // Validate type (images only)
    if (!file.type.startsWith('image/')) {
      setFileError('⚠️ Format file tidak didukung. Mohon unggah file foto berformat JPG, PNG, atau WEBP.');
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setBuktiFoto(reader.result as string);
      setNamaFoto(file.name);
      setUkuranFoto(file.size);
      setFileError(null);
    };
    reader.onerror = () => {
      setFileError('Gagal membaca file foto. Silakan coba lagi.');
    };
    reader.readAsDataURL(file);
  };

  const handleRemovePhoto = () => {
    setBuktiFoto(undefined);
    setNamaFoto(undefined);
    setUkuranFoto(undefined);
    setFileError(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmitPengaduan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!judulPengaduan.trim()) {
      alert('Mohon isi Judul / Topik Pengaduan.');
      return;
    }
    if (!kronologis.trim()) {
      alert('Mohon isi kolom Kronologis Kejadian secara lengkap.');
      return;
    }

    const studentName = isStudent 
      ? (currentSiswa?.nama || currentUser.nama)
      : currentUser.nama;
    const studentNis = isStudent 
      ? (currentSiswa?.nis || currentUser.username)
      : '-';
    
    let studentClass = '-';
    if (isStudent && currentSiswa?.kelasId) {
      const cls = (db?.kelas || []).find(k => k && (k.id === currentSiswa.kelasId || k.namaKelas === currentSiswa.kelasId));
      studentClass = cls ? cls.namaKelas : currentSiswa.kelasId;
    }

    const newPengaduan: PengaduanSiswa = {
      id: `aduan-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      siswaId: isStudent ? (currentSiswa?.id || currentUser.id) : currentUser.id,
      namaSiswa: studentName,
      nis: studentNis,
      kelas: studentClass,
      tanggalKejadian: tanggalKejadian || new Date().toISOString().split('T')[0],
      tanggalPengaduan: new Date().toISOString().split('T')[0],
      judulPengaduan: judulPengaduan.trim(),
      kategori,
      kronologis: kronologis.trim(),
      buktiFoto,
      namaFoto: namaFoto || (buktiFoto ? 'bukti-foto.jpg' : undefined),
      ukuranFoto,
      status: 'Menunggu Respon'
    };

    setIsSubmitting(true);
    try {
      const success = await onSavePengaduan(newPengaduan, true);
      if (success) {
        // Reset form
        setJudulPengaduan('');
        setKronologis('');
        setBuktiFoto(undefined);
        setNamaFoto(undefined);
        setUkuranFoto(undefined);
        if (fileInputRef.current) fileInputRef.current.value = '';
        setActiveTab('list');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Filter complaints list
  const complaintsList = useMemo(() => {
    let list = (db && db.pengaduanSiswa) ? [...db.pengaduanSiswa] : [];

    // If student, only show complaints submitted by this student
    if (isStudent) {
      const sId = currentSiswa?.id || currentUser.id;
      const sName = (currentSiswa?.nama || currentUser.nama || '').toLowerCase().trim();
      const sNis = (currentSiswa?.nis || currentUser.username || '').toString().trim();
      list = list.filter(item => 
        item && (
          item.siswaId === sId || 
          (item.nis && item.nis.toString().trim() === sNis) ||
          (item.namaSiswa && item.namaSiswa.toLowerCase().trim() === sName)
        )
      );
    }

    // Filters for teachers/admin
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(item => 
        item && (
          (item.judulPengaduan && item.judulPengaduan.toString().toLowerCase().includes(q)) ||
          (item.namaSiswa && item.namaSiswa.toString().toLowerCase().includes(q)) ||
          (item.nis && item.nis.toString().toLowerCase().includes(q)) ||
          (item.kronologis && item.kronologis.toString().toLowerCase().includes(q)) ||
          (item.kelas && item.kelas.toString().toLowerCase().includes(q))
        )
      );
    }

    if (statusFilter !== 'Semua') {
      list = list.filter(item => item && item.status === statusFilter);
    }

    if (kategoriFilter !== 'Semua') {
      list = list.filter(item => item && item.kategori === kategoriFilter);
    }

    if (kelasFilter !== 'Semua') {
      list = list.filter(item => item && item.kelas === kelasFilter);
    }

    return list;
  }, [db, isStudent, currentSiswa, currentUser, searchQuery, statusFilter, kategoriFilter, kelasFilter]);

  // Summary counts
  const totalCount = complaintsList.length;
  const waitingCount = complaintsList.filter(c => c.status === 'Menunggu Respon').length;
  const inProgressCount = complaintsList.filter(c => c.status === 'Sedang Ditangani').length;
  const resolvedCount = complaintsList.filter(c => c.status === 'Selesai').length;

  const handleDownloadPhoto = (dataUrl: string, filename: string = 'bukti-pengaduan.jpg') => {
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleOpenResponseModal = (item: PengaduanSiswa) => {
    setRespondingItem(item);
    setResponseStatus(item.status || 'Sedang Ditangani');
    setTanggapanText(item.tanggapanBk || '');
  };

  const handleSaveResponse = async () => {
    if (!respondingItem) return;
    setIsUpdatingStatus(true);
    try {
      const teacherName = currentUser.nama || 'Guru BK / Wali Kelas';
      await onUpdateStatus(
        respondingItem.id,
        responseStatus,
        tanggapanText.trim() || undefined,
        teacherName
      );
      setRespondingItem(null);
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-700 via-teal-700 to-slate-800 text-white rounded-2xl p-6 shadow-sm relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full text-xs font-semibold backdrop-blur-xs mb-2">
              <MessageSquare size={14} className="text-emerald-300" />
              <span>Layanan Terpadu Bimbingan & Konseling</span>
            </div>
            <h1 className="text-xl md:text-2xl font-bold tracking-tight">
              {isStudent ? 'Portal Pengaduan & Aspirasi Siswa' : 'Pusat Layanan Pengaduan Siswa'}
            </h1>
            <p className="text-slate-200 text-xs md:text-sm mt-1 max-w-2xl">
              {isStudent 
                ? 'Sampaikan kendala, masalah perundungan/bullying, atau laporan sekolah secara aman. Laporan Anda langsung terhubung ke Guru BK & Wali Kelas.'
                : 'Pantau, tangani kronologis kejadian, dan verifikasi bukti foto pengaduan yang diajukan oleh siswa secara terintegrasi.'}
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {isStudent && (
              <div className="flex bg-white/10 backdrop-blur-md p-1 rounded-xl border border-white/20">
                <button
                  onClick={() => setActiveTab('form')}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                    activeTab === 'form' 
                      ? 'bg-white text-emerald-800 shadow-sm' 
                      : 'text-white hover:bg-white/10'
                  }`}
                >
                  <PlusCircle size={14} /> Ajukan Pengaduan
                </button>
                <button
                  onClick={() => setActiveTab('list')}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                    activeTab === 'list' 
                      ? 'bg-white text-emerald-800 shadow-sm' 
                      : 'text-white hover:bg-white/10'
                  }`}
                >
                  <FileText size={14} /> Riwayat Aduan Saya ({complaintsList.length})
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Stats row for Teachers/Admins */}
      {isTeacherOrAdmin && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-xs flex items-center justify-between">
            <div>
              <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Total Pengaduan</p>
              <p className="text-2xl font-bold text-slate-800 mt-0.5">{totalCount}</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center">
              <FileText size={20} />
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-amber-100 shadow-xs flex items-center justify-between">
            <div>
              <p className="text-[11px] font-semibold text-amber-600 uppercase tracking-wider">Menunggu Respon</p>
              <p className="text-2xl font-bold text-amber-600 mt-0.5">{waitingCount}</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Clock size={20} />
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-sky-100 shadow-xs flex items-center justify-between">
            <div>
              <p className="text-[11px] font-semibold text-sky-600 uppercase tracking-wider">Sedang Ditangani</p>
              <p className="text-2xl font-bold text-sky-600 mt-0.5">{inProgressCount}</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center">
              <AlertCircle size={20} />
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-emerald-100 shadow-xs flex items-center justify-between">
            <div>
              <p className="text-[11px] font-semibold text-emerald-600 uppercase tracking-wider">Selesai / Teratasi</p>
              <p className="text-2xl font-bold text-emerald-600 mt-0.5">{resolvedCount}</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle size={20} />
            </div>
          </div>
        </div>
      )}

      {/* VIEW 1: STUDENT FORM (AJUKAN PENGADUAN) */}
      {isStudent && activeTab === 'form' && (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-xs overflow-hidden">
          <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
            <div>
              <h2 className="font-bold text-slate-800 text-sm md:text-base flex items-center gap-2">
                <Send size={18} className="text-emerald-600" />
                Formulir Pengaduan & Laporan Kejadian Siswa
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Isi kronologis kejadian secara rinci dan lampirkan bukti foto (maksimal 1 MB).
              </p>
            </div>
            <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 text-[11px] font-bold rounded-lg">
              Kerahasiaan Terjamin
            </span>
          </div>

          <form onSubmit={handleSubmitPengaduan} className="p-6 space-y-5">
            {/* Student Info Bar */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/60 grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
              <div>
                <span className="text-slate-400 block text-[10px] font-semibold uppercase">Nama Pengadu</span>
                <span className="font-bold text-slate-800">{currentSiswa?.nama || currentUser.nama}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] font-semibold uppercase">NIS / Username</span>
                <span className="font-medium text-slate-700">{currentSiswa?.nis || currentUser.username}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] font-semibold uppercase">Kelas</span>
                <span className="font-bold text-emerald-700">
                  {(() => {
                    if (currentSiswa?.kelasId) {
                      const cls = (db?.kelas || []).find(k => k && (k.id === currentSiswa.kelasId || k.namaKelas === currentSiswa.kelasId));
                      return cls ? cls.namaKelas : currentSiswa.kelasId;
                    }
                    return '-';
                  })()}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Judul Pengaduan */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Judul / Topik Pengaduan <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Perundungan / ejekan di jam istirahat"
                  value={judulPengaduan}
                  onChange={(e) => setJudulPengaduan(e.target.value)}
                  className="w-full text-xs p-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-hidden transition"
                />
              </div>

              {/* Kategori Pengaduan */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Kategori Pengaduan <span className="text-rose-500">*</span>
                </label>
                <select
                  value={kategori}
                  onChange={(e) => setKategori(e.target.value)}
                  className="w-full text-xs p-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-hidden transition"
                >
                  <option value="Perundungan / Bullying">Perundungan / Bullying</option>
                  <option value="Fasilitas Belajar">Fasilitas Belajar & Sarana Sekolah</option>
                  <option value="Kedisiplinan & Ketertiban">Kedisiplinan & Ketertiban</option>
                  <option value="Masalah Akademik & Kelas">Masalah Akademik & Kelas</option>
                  <option value="Lainnya">Lainnya</option>
                </select>
              </div>
            </div>

            {/* Tanggal Kejadian */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Tanggal & Waktu Kejadian <span className="text-rose-500">*</span>
              </label>
              <input
                type="date"
                required
                value={tanggalKejadian}
                onChange={(e) => setTanggalKejadian(e.target.value)}
                className="w-full md:w-1/2 text-xs p-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-hidden transition"
              />
            </div>

            {/* Kolom Kronologis Kejadian (Format Teks) */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center justify-between">
                <span>
                  Kronologis Kejadian (Format Teks) <span className="text-rose-500">*</span>
                </span>
                <span className="text-[10px] font-normal text-slate-400">Jelaskan waktu, tempat, dan alur kejadian secara runut</span>
              </label>
              <textarea
                required
                rows={6}
                placeholder="Tuliskan kronologis kejadian secara lengkap di sini. Ceritakan apa yang terjadi, kapan, di mana, siapa saja yang terlibat atau melihat, serta akibat yang Anda alami..."
                value={kronologis}
                onChange={(e) => setKronologis(e.target.value)}
                className="w-full text-xs p-3.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-hidden transition leading-relaxed"
              />
            </div>

            {/* Kolom Unggah Bukti Foto (Batas Maksimal 1 MB) */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <ImageIcon size={15} className="text-emerald-600" />
                  Unggah Bukti Foto (Opsional)
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 bg-amber-100 text-amber-800 rounded-md">
                  Batas Maksimal: 1 MB
                </span>
              </label>

              {fileError && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-start gap-2">
                  <AlertTriangle size={16} className="text-rose-600 shrink-0 mt-0.5" />
                  <span>{fileError}</span>
                </div>
              )}

              {!buktiFoto ? (
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-slate-200 hover:border-emerald-500 rounded-2xl p-6 text-center cursor-pointer transition bg-slate-50/50 hover:bg-emerald-50/30 group"
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/png, image/jpeg, image/jpg, image/webp"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                  <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto mb-2 text-slate-400 group-hover:text-emerald-600 group-hover:scale-105 transition shadow-xs border border-slate-100">
                    <Upload size={20} />
                  </div>
                  <p className="text-xs font-bold text-slate-700 group-hover:text-emerald-700">
                    Klik untuk memilih foto bukti atau seret file ke sini
                  </p>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Format yang didukung: JPG, PNG, WEBP • Ukuran maksimal: <strong>1.00 MB</strong>
                  </p>
                </div>
              ) : (
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-16 h-16 rounded-xl overflow-hidden bg-slate-200 border border-slate-300 shrink-0 relative group">
                      <img 
                        src={buktiFoto} 
                        alt="Pratinjau Bukti Foto" 
                        className="w-full h-full object-cover" 
                      />
                      <button
                        type="button"
                        onClick={() => setViewingPhoto({ src: buktiFoto, title: 'Pratinjau Bukti Foto', filename: namaFoto })}
                        className="absolute inset-0 bg-black/40 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
                      >
                        <Eye size={16} />
                      </button>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-800 truncate max-w-[200px] sm:max-w-xs">{namaFoto || 'foto-bukti.jpg'}</p>
                      <p className="text-[10px] text-slate-500 mt-0.5">
                        Ukuran: {ukuranFoto ? (ukuranFoto / (1024 * 1024)).toFixed(2) + ' MB' : '< 1 MB'} • <span className="text-emerald-600 font-semibold">Siap diunggah</span>
                      </p>
                      <button
                        type="button"
                        onClick={() => setViewingPhoto({ src: buktiFoto, title: 'Pratinjau Bukti Foto', filename: namaFoto })}
                        className="text-[11px] text-indigo-600 hover:text-indigo-800 font-semibold mt-1 inline-flex items-center gap-1 cursor-pointer"
                      >
                        <Eye size={12} /> Lihat Pratinjau Penuh
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="px-3 py-1.5 bg-white hover:bg-slate-100 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 transition cursor-pointer"
                    >
                      Ganti Foto
                    </button>
                    <button
                      type="button"
                      onClick={handleRemovePhoto}
                      className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-xl text-xs font-semibold text-rose-600 transition cursor-pointer"
                    >
                      Hapus
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Action buttons */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs transition shadow-sm flex items-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <RefreshCw size={14} className="animate-spin" /> Menyimpan...
                  </>
                ) : (
                  <>
                    <Send size={14} /> Kirim Pengaduan Sekarang
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* VIEW 2: LIST & TABLE OF COMPLAINTS */}
      {(!isStudent || activeTab === 'list') && (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-xs overflow-hidden space-y-4">
          {/* Header & Controls */}
          <div className="p-5 border-b border-slate-100 space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div>
                <h3 className="font-bold text-slate-800 text-sm md:text-base flex items-center gap-2">
                  <FileText size={18} className="text-emerald-600" />
                  {isStudent ? 'Riwayat Pengaduan & Status Respon' : 'Daftar Laporan & Pengaduan Siswa'}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  {isStudent 
                    ? 'Pantau perkembangan dan tanggapan resmi dari Guru BK/Wali Kelas atas laporan Anda.'
                    : 'Seluruh pengaduan tersimpan secara permanen di database Google Sheets pada sheet Pengaduan_Siswa.'}
                </p>
              </div>

              {isStudent && (
                <button
                  onClick={() => setActiveTab('form')}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-xs self-start md:self-auto"
                >
                  <PlusCircle size={14} /> Ajukan Pengaduan Baru
                </button>
              )}
            </div>

            {/* Filter Bar (for Teachers / BK) */}
            {isTeacherOrAdmin && (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 pt-2">
                <div className="relative">
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Cari siswa, judul, kronologis..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-hidden transition"
                  />
                </div>

                <div>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="w-full py-2 px-3 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-hidden transition"
                  >
                    <option value="Semua">Semua Status</option>
                    <option value="Menunggu Respon">Menunggu Respon</option>
                    <option value="Sedang Ditangani">Sedang Ditangani</option>
                    <option value="Selesai">Selesai</option>
                    <option value="Ditolak">Ditolak</option>
                  </select>
                </div>

                <div>
                  <select
                    value={kategoriFilter}
                    onChange={(e) => setKategoriFilter(e.target.value)}
                    className="w-full py-2 px-3 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-hidden transition"
                  >
                    <option value="Semua">Semua Kategori</option>
                    <option value="Perundungan / Bullying">Perundungan / Bullying</option>
                    <option value="Fasilitas Belajar">Fasilitas Belajar</option>
                    <option value="Kedisiplinan & Ketertiban">Kedisiplinan</option>
                    <option value="Masalah Akademik & Kelas">Masalah Akademik</option>
                    <option value="Lainnya">Lainnya</option>
                  </select>
                </div>

                <div>
                  <select
                    value={kelasFilter}
                    onChange={(e) => setKelasFilter(e.target.value)}
                    className="w-full py-2 px-3 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-hidden transition"
                  >
                    <option value="Semua">Semua Kelas</option>
                    {(db?.kelas || []).map(k => (
                      <option key={k.id} value={k.namaKelas}>{k.namaKelas}</option>
                    ))}
                  </select>
                </div>
              </div>
            )}
          </div>

          {/* Table / Cards List */}
          {complaintsList.length === 0 ? (
            <div className="p-12 text-center text-slate-400 space-y-2">
              <FileText size={36} className="mx-auto text-slate-300" />
              <p className="text-sm font-bold text-slate-600">Belum Ada Data Pengaduan</p>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                {isStudent 
                  ? 'Anda belum pernah mengajukan pengaduan. Klik tombol "Ajukan Pengaduan" di atas jika ada keluhan atau laporan.'
                  : 'Tidak ada data pengaduan yang sesuai dengan kriteria filter yang dipilih.'}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-600 font-bold text-[11px] uppercase tracking-wider">
                    <th className="p-3.5 pl-5">Tanggal & Siswa</th>
                    <th className="p-3.5">Judul & Kategori</th>
                    <th className="p-3.5 min-w-[220px]">Kronologis Kejadian (Teks)</th>
                    <th className="p-3.5 text-center">Kolom Bukti Foto</th>
                    <th className="p-3.5 text-center">Status</th>
                    <th className="p-3.5 min-w-[200px]">Tanggapan Guru BK</th>
                    <th className="p-3.5 pr-5 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {complaintsList.map((item) => {
                    const hasPhoto = Boolean(item.buktiFoto);
                    return (
                      <tr key={item.id} className="hover:bg-slate-50/60 transition">
                        {/* 1. Tanggal & Siswa */}
                        <td className="p-3.5 pl-5 align-top">
                          <div className="space-y-0.5">
                            <span className="font-bold text-slate-800 block text-xs">{item.namaSiswa || 'Siswa'}</span>
                            <span className="text-[10px] text-slate-500 block">Kelas: <strong className="text-emerald-700">{item.kelas || '-'}</strong></span>
                            <span className="text-[10px] text-slate-400 block flex items-center gap-1 mt-1">
                              <Clock size={11} /> {item.tanggalPengaduan || item.tanggalKejadian || '-'}
                            </span>
                          </div>
                        </td>

                        {/* 2. Judul & Kategori */}
                        <td className="p-3.5 align-top">
                          <div className="space-y-1">
                            <span className="font-bold text-slate-800 block text-xs leading-snug">{item.judulPengaduan}</span>
                            <span className="inline-block px-2 py-0.5 bg-slate-100 text-slate-600 rounded text-[10px] font-semibold">
                              {item.kategori || 'Pengaduan'}
                            </span>
                          </div>
                        </td>

                        {/* 3. Kronologis Kejadian (Teks) */}
                        <td className="p-3.5 align-top">
                          <div className="space-y-1">
                            <p className="text-slate-600 line-clamp-3 leading-relaxed text-[11px]">
                              {item.kronologis}
                            </p>
                            {item.kronologis && item.kronologis.length > 120 && (
                              <button
                                type="button"
                                onClick={() => setViewingKronologis(item)}
                                className="text-[10px] text-emerald-600 hover:text-emerald-800 font-bold inline-flex items-center gap-0.5 cursor-pointer"
                              >
                                Baca Selengkapnya <ExternalLink size={10} />
                              </button>
                            )}
                          </div>
                        </td>

                        {/* 4. Kolom Unduh Bukti Foto */}
                        <td className="p-3.5 align-top text-center">
                          {hasPhoto ? (
                            <div className="inline-flex flex-col items-center gap-1.5">
                              <div 
                                onClick={() => setViewingPhoto({ src: item.buktiFoto!, title: item.judulPengaduan, filename: item.namaFoto })}
                                className="w-12 h-12 rounded-lg overflow-hidden bg-slate-100 border border-slate-200 cursor-pointer hover:opacity-80 transition relative group shadow-2xs"
                                title="Klik untuk memperbesar foto"
                              >
                                <img 
                                  src={item.buktiFoto} 
                                  alt="Bukti Foto" 
                                  className="w-full h-full object-cover" 
                                />
                                <div className="absolute inset-0 bg-black/40 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                                  <Eye size={14} />
                                </div>
                              </div>
                              <button
                                type="button"
                                onClick={() => handleDownloadPhoto(item.buktiFoto!, item.namaFoto || `bukti-${item.id}.jpg`)}
                                className="px-2 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-md text-[10px] font-bold transition flex items-center gap-1 cursor-pointer border border-emerald-100 shadow-2xs"
                                title="Unduh file bukti foto (Maks 1 MB)"
                              >
                                <Download size={11} /> Unduh Foto
                              </button>
                            </div>
                          ) : (
                            <span className="text-[10px] text-slate-400 italic">Tanpa Foto</span>
                          )}
                        </td>

                        {/* 5. Status Badge */}
                        <td className="p-3.5 align-top text-center">
                          {item.status === 'Selesai' ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-100 text-emerald-800 rounded-full text-[10px] font-bold">
                              <CheckCircle2 size={11} /> Selesai
                            </span>
                          ) : item.status === 'Sedang Ditangani' ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-sky-100 text-sky-800 rounded-full text-[10px] font-bold">
                              <Clock size={11} /> Ditangani
                            </span>
                          ) : item.status === 'Ditolak' ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-rose-100 text-rose-800 rounded-full text-[10px] font-bold">
                              <X size={11} /> Ditolak
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-100 text-amber-800 rounded-full text-[10px] font-bold">
                              <Clock size={11} /> Menunggu Respon
                            </span>
                          )}
                        </td>

                        {/* 6. Tanggapan Guru BK / Wali Kelas */}
                        <td className="p-3.5 align-top">
                          {item.tanggapanBk ? (
                            <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/70 text-[11px] space-y-1">
                              <p className="text-slate-700 leading-relaxed font-medium">{item.tanggapanBk}</p>
                              <div className="flex items-center justify-between text-[9.5px] text-slate-400 pt-1 border-t border-slate-200/50">
                                <span>Oleh: <strong className="text-slate-600">{item.petugasBk || 'Guru BK'}</strong></span>
                                <span>{item.tanggalTanggapan || '-'}</span>
                              </div>
                            </div>
                          ) : (
                            <span className="text-[10.5px] text-slate-400 italic">Belum ada respon</span>
                          )}
                        </td>

                        {/* 7. Aksi */}
                        <td className="p-3.5 pr-5 align-top text-right">
                          <div className="inline-flex items-center gap-1.5">
                            {isTeacherOrAdmin && (
                              <button
                                type="button"
                                onClick={() => handleOpenResponseModal(item)}
                                className="px-2.5 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-lg text-[11px] font-bold transition flex items-center gap-1 cursor-pointer border border-indigo-100"
                                title="Beri Tanggapan / Update Status"
                              >
                                <MessageSquare size={12} /> Respon
                              </button>
                            )}

                            {(isTeacherOrAdmin || isStudent) && (
                              <button
                                type="button"
                                onClick={() => setDeletingId(item.id)}
                                className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition cursor-pointer"
                                title="Hapus Pengaduan"
                              >
                                <Trash2 size={14} />
                              </button>
                            )}
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
      )}

      {/* MODAL 1: FULLSCREEN PHOTO VIEWER */}
      {viewingPhoto && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2">
                <ImageIcon size={18} className="text-emerald-600" />
                <h4 className="font-bold text-slate-800 text-sm truncate max-w-md">{viewingPhoto.title}</h4>
              </div>
              <button
                onClick={() => setViewingPhoto(null)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg transition cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-4 flex-1 overflow-auto flex items-center justify-center bg-slate-900/5">
              <img 
                src={viewingPhoto.src} 
                alt="Bukti Foto Penuh" 
                className="max-h-[60vh] max-w-full object-contain rounded-lg shadow-xs" 
              />
            </div>

            <div className="p-4 border-t border-slate-100 bg-white flex items-center justify-between">
              <span className="text-[11px] text-slate-500 font-medium">Batas Maksimal 1 MB (Tervalidasi)</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleDownloadPhoto(viewingPhoto.src, viewingPhoto.filename || 'bukti-pengaduan.jpg')}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <Download size={14} /> Unduh Bukti Foto
                </button>
                <button
                  onClick={() => setViewingPhoto(null)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition cursor-pointer"
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: FULL CHRONOLOGY DETAIL */}
      {viewingKronologis && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full overflow-hidden shadow-2xl flex flex-col max-h-[85vh]">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2">
                <FileText size={18} className="text-emerald-600" />
                <h4 className="font-bold text-slate-800 text-sm">Detail Kronologis Kejadian</h4>
              </div>
              <button
                onClick={() => setViewingKronologis(null)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg transition cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4 text-xs">
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/60 space-y-1">
                <p className="font-bold text-slate-800 text-sm">{viewingKronologis.judulPengaduan}</p>
                <p className="text-slate-500 text-[11px]">
                  Pelapor: <strong>{viewingKronologis.namaSiswa}</strong> ({viewingKronologis.kelas || '-'}) • Tanggal: {viewingKronologis.tanggalPengaduan || viewingKronologis.tanggalKejadian}
                </p>
              </div>

              <div>
                <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">Isi Kronologis Lengkap (Format Teks):</p>
                <div className="bg-white p-4 rounded-xl border border-slate-200 text-slate-700 leading-relaxed whitespace-pre-wrap">
                  {viewingKronologis.kronologis}
                </div>
              </div>

              {viewingKronologis.buktiFoto && (
                <div>
                  <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">Bukti Foto Terlampir:</p>
                  <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200">
                    <img 
                      src={viewingKronologis.buktiFoto} 
                      alt="Thumbnail" 
                      className="w-14 h-14 object-cover rounded-lg border border-slate-200" 
                    />
                    <div>
                      <p className="font-bold text-slate-800 text-xs">{viewingKronologis.namaFoto || 'bukti-foto.jpg'}</p>
                      <button
                        onClick={() => handleDownloadPhoto(viewingKronologis.buktiFoto!, viewingKronologis.namaFoto || 'bukti-foto.jpg')}
                        className="mt-1 text-[11px] text-emerald-700 font-bold hover:underline inline-flex items-center gap-1 cursor-pointer"
                      >
                        <Download size={11} /> Unduh Bukti Foto
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="p-4 border-t border-slate-100 bg-white flex justify-end">
              <button
                onClick={() => setViewingKronologis(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition cursor-pointer"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: TEACHER / BK RESPONSE MODAL */}
      {respondingItem && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl flex flex-col">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2">
                <UserCheck size={18} className="text-emerald-600" />
                <h4 className="font-bold text-slate-800 text-sm">Respon & Penanganan Guru BK</h4>
              </div>
              <button
                onClick={() => setRespondingItem(null)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg transition cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs">
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/60">
                <p className="font-bold text-slate-800 text-xs">{respondingItem.judulPengaduan}</p>
                <p className="text-slate-500 text-[11px] mt-0.5">
                  Siswa: <strong>{respondingItem.namaSiswa}</strong> ({respondingItem.kelas}) • Kategori: {respondingItem.kategori}
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Status Penanganan</label>
                <select
                  value={responseStatus}
                  onChange={(e) => setResponseStatus(e.target.value as any)}
                  className="w-full text-xs p-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-hidden transition"
                >
                  <option value="Menunggu Respon">Menunggu Respon</option>
                  <option value="Sedang Ditangani">Sedang Ditangani (Dalam Proses Bimbingan)</option>
                  <option value="Selesai">Selesai (Sudah Teratasi)</option>
                  <option value="Ditolak">Ditolak / Tidak Terbukti</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Tanggapan & Solusi Guru BK / Wali Kelas
                </label>
                <textarea
                  rows={4}
                  placeholder="Tuliskan catatan tindak lanjut, solusi, atau instruksi pemanggilan konseling untuk siswa yang bersangkutan..."
                  value={tanggapanText}
                  onChange={(e) => setTanggapanText(e.target.value)}
                  className="w-full text-xs p-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-hidden transition"
                />
              </div>
            </div>

            <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setRespondingItem(null)}
                className="px-4 py-2 bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                disabled={isUpdatingStatus}
                onClick={handleSaveResponse}
                className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-xs disabled:opacity-50"
              >
                {isUpdatingStatus ? <RefreshCw size={13} className="animate-spin" /> : <CheckCircle2 size={14} />}
                Simpan Tanggapan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 4: DELETE CONFIRMATION MODAL */}
      {deletingId && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full overflow-hidden shadow-2xl p-5 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
                <Trash2 size={20} />
              </div>
              <div>
                <h4 className="font-bold text-slate-800 text-sm">Hapus Pengaduan?</h4>
                <p className="text-xs text-slate-500">Tindakan ini tidak dapat dibatalkan.</p>
              </div>
            </div>

            <p className="text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-200">
              Apakah Anda yakin ingin menghapus data pengaduan ini secara permanen?
            </p>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                disabled={isDeleting}
                onClick={() => setDeletingId(null)}
                className="px-4 py-2 bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                disabled={isDeleting}
                onClick={async () => {
                  setIsDeleting(true);
                  try {
                    await onDeletePengaduan(deletingId);
                    setDeletingId(null);
                  } finally {
                    setIsDeleting(false);
                  }
                }}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-xs disabled:opacity-50"
              >
                {isDeleting ? <RefreshCw size={12} className="animate-spin" /> : <Trash2 size={13} />}
                Ya, Hapus
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
