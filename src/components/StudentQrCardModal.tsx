/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import { 
  X, 
  Download, 
  Printer, 
  QrCode, 
  GraduationCap, 
  Check, 
  Share2, 
  ChevronLeft,
  ChevronRight,
  Search,
  Sparkles
} from 'lucide-react';
import { Siswa, DatabaseState } from '../types';

interface StudentQrCardModalProps {
  siswa: Siswa;
  db: DatabaseState | null;
  onClose: () => void;
  onSelectAnotherStudent?: (student: Siswa) => void;
}

export default function StudentQrCardModal({
  siswa,
  db,
  onClose,
  onSelectAnotherStudent
}: StudentQrCardModalProps) {
  const [currentSiswa, setCurrentSiswa] = useState<Siswa>(siswa);
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState<boolean>(true);
  const [copied, setCopied] = useState<boolean>(false);
  const [searchOpen, setSearchOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');

  const cardRef = useRef<HTMLDivElement | null>(null);

  const getClassName = (s: Siswa): string => {
    if (!db || !s) return 'Kelas -';
    if (s.kelasId) {
      const cls = db.kelas.find(k => k.id === s.kelasId || k.namaKelas === s.kelasId);
      if (cls) return cls.namaKelas;
    }
    return s.kelasId || 'Kelas -';
  };

  const namaKelas = getClassName(currentSiswa);

  // Generate high-resolution QR Code (ensuring payload is strictly String)
  useEffect(() => {
    let active = true;
    setIsGenerating(true);

    const generateQr = async () => {
      try {
        const rawNis = currentSiswa.nis !== undefined && currentSiswa.nis !== null ? String(currentSiswa.nis).trim() : '';
        const rawNisn = currentSiswa.nisn !== undefined && currentSiswa.nisn !== null ? String(currentSiswa.nisn).trim() : '';
        const rawId = currentSiswa.id !== undefined && currentSiswa.id !== null ? String(currentSiswa.id).trim() : '';
        
        // Use NIS as primary scan payload (standard across school scanners), fallback to NISN or ID
        const payload = rawNis || rawNisn || rawId || 'SISWA-17';

        const url = await QRCode.toDataURL(payload, {
          width: 400,
          margin: 1,
          color: {
            dark: '#064e3b', // Deep emerald
            light: '#ffffff'
          },
          errorCorrectionLevel: 'M'
        });

        if (active) {
          setQrDataUrl(url);
          setIsGenerating(false);
        }
      } catch (err) {
        console.error('QR code generation error:', err);
        // Fallback with default black color
        try {
          const fallbackPayload = String(currentSiswa.id || 'SISWA');
          const fallbackUrl = await QRCode.toDataURL(fallbackPayload, { width: 360, margin: 1 });
          if (active) {
            setQrDataUrl(fallbackUrl);
            setIsGenerating(false);
          }
        } catch {
          if (active) setIsGenerating(false);
        }
      }
    };

    generateQr();

    return () => {
      active = false;
    };
  }, [currentSiswa]);

  // Robust download handler for the QR Code image
  const handleDownloadQr = () => {
    if (!qrDataUrl) {
      alert('QR Code masih diproses, silakan tunggu sesaat.');
      return;
    }

    try {
      const safeName = (currentSiswa.nama || 'Siswa').replace(/[^a-zA-Z0-9]/g, '_');
      const safeNis = String(currentSiswa.nis || currentSiswa.id || '17').replace(/[^a-zA-Z0-9]/g, '_');
      const fileName = `QR_Presensi_${safeName}_${safeNis}.png`;

      const link = document.createElement('a');
      link.href = qrDataUrl;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      setTimeout(() => {
        if (document.body.contains(link)) {
          document.body.removeChild(link);
        }
      }, 200);
    } catch (e) {
      console.error('Download error:', e);
      // Fallback: open in new tab
      const win = window.open();
      if (win) {
        win.document.write(`<img src="${qrDataUrl}" alt="QR Code" /><p>Klik kanan dan pilih 'Simpan Gambar Sebagai' untuk mengunduh.</p>`);
      }
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleCopyNis = () => {
    const val = String(currentSiswa.nis || currentSiswa.id || '');
    if (val) {
      navigator.clipboard?.writeText(val);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Navigating to next or previous student
  const allStudents = db?.siswa || [];
  const currentIndex = allStudents.findIndex(s => s.id === currentSiswa.id);
  const hasPrev = currentIndex > 0;
  const hasNext = currentIndex < allStudents.length - 1;

  const handlePrev = () => {
    if (hasPrev) {
      const prevStudent = allStudents[currentIndex - 1];
      setCurrentSiswa(prevStudent);
      onSelectAnotherStudent?.(prevStudent);
    }
  };

  const handleNext = () => {
    if (hasNext) {
      const nextStudent = allStudents[currentIndex + 1];
      setCurrentSiswa(nextStudent);
      onSelectAnotherStudent?.(nextStudent);
    }
  };

  // Student search filter
  const searchResults = searchQuery.trim()
    ? allStudents.filter(s => 
        (s.nama && s.nama.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (s.nis && String(s.nis).includes(searchQuery)) ||
        (s.nisn && String(s.nisn).includes(searchQuery))
      ).slice(0, 8)
    : [];

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 w-full max-w-md overflow-hidden relative flex flex-col">
        
        {/* Top Header */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-700 text-white flex items-center justify-center shadow-xs">
              <QrCode size={18} />
            </div>
            <div>
              <h3 className="font-extrabold text-sm text-slate-800">Kartu QR Presensi Siswa</h3>
              <p className="text-[10px] text-slate-500 font-medium">UPTD SMPN 17 Kota Tangerang Selatan</p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setSearchOpen(!searchOpen)}
              className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-200/60 rounded-xl transition cursor-pointer"
              title="Cari Siswa Lain"
            >
              <Search size={16} />
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-xl transition cursor-pointer"
              title="Tutup"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Quick Search Student Drawer */}
        {searchOpen && (
          <div className="p-3 bg-slate-100/80 border-b border-slate-200 space-y-2 animate-in slide-in-from-top-2 duration-150">
            <div className="relative">
              <Search size={14} className="absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                placeholder="Ketik Nama atau NIS siswa..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-2xs"
                autoFocus
              />
            </div>

            {searchQuery.trim() && (
              <div className="max-h-40 overflow-y-auto divide-y divide-slate-200 rounded-xl bg-white border border-slate-200 shadow-sm text-xs">
                {searchResults.length === 0 ? (
                  <div className="p-3 text-center text-slate-400 text-xs">
                    Tidak ditemukan siswa yang cocok.
                  </div>
                ) : (
                  searchResults.map(s => (
                    <div
                      key={s.id}
                      onClick={() => {
                        setCurrentSiswa(s);
                        onSelectAnotherStudent?.(s);
                        setSearchOpen(false);
                        setSearchQuery('');
                      }}
                      className="p-2.5 hover:bg-emerald-50 transition cursor-pointer flex items-center justify-between gap-2"
                    >
                      <div className="min-w-0">
                        <p className="font-bold text-slate-800 truncate">{s.nama}</p>
                        <p className="text-[10px] text-slate-500">NIS: {s.nis || '-'} • {getClassName(s)}</p>
                      </div>
                      <span className="text-[10px] font-bold text-emerald-600 shrink-0">Pilih</span>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        )}

        {/* Printable Card Area */}
        <div className="p-6 flex flex-col items-center justify-center space-y-4 print:p-0">
          
          {/* Physical ID Card Mockup */}
          <div 
            ref={cardRef}
            id="student-qr-card-print"
            className="w-full max-w-xs bg-gradient-to-b from-emerald-800 via-teal-900 to-slate-900 text-white rounded-3xl p-5 shadow-2xl border border-emerald-700/50 relative overflow-hidden text-center space-y-3.5"
          >
            {/* Background Watermark Pattern */}
            <div className="absolute top-0 right-0 w-36 h-36 bg-emerald-400/10 rounded-full blur-2xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-36 h-36 bg-teal-400/10 rounded-full blur-2xl pointer-events-none" />

            {/* School Header */}
            <div className="border-b border-emerald-600/40 pb-2.5">
              <div className="flex items-center justify-center gap-1.5 text-emerald-300 text-[10px] font-black uppercase tracking-wider">
                <GraduationCap size={14} />
                <span>UPTD SMPN 17 KOTA TANGERANG SELATAN</span>
              </div>
              <p className="text-[9px] text-emerald-200/80 font-semibold tracking-wide mt-0.5">
                KARTU PRESENSI DIGITAL & KARTU PELAJAR
              </p>
            </div>

            {/* QR Code Container with High Contrast & Guaranteed Display */}
            <div className="bg-white p-3 rounded-2xl shadow-inner inline-block mx-auto border-2 border-emerald-400/40">
              {isGenerating ? (
                <div className="w-44 h-44 bg-slate-50 rounded-xl flex flex-col items-center justify-center text-slate-400 text-xs gap-1.5">
                  <div className="w-6 h-6 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin" />
                  <span className="font-semibold text-[11px]">Membuat QR...</span>
                </div>
              ) : qrDataUrl ? (
                <img 
                  src={qrDataUrl} 
                  alt={`QR Code Presensi ${currentSiswa.nama}`}
                  className="w-44 h-44 object-contain mx-auto rounded-lg"
                />
              ) : (
                <div className="w-44 h-44 bg-slate-50 flex items-center justify-center text-rose-500 text-xs font-bold p-3 text-center">
                  Gagal memuat QR Code. Silakan coba lagi.
                </div>
              )}
            </div>

            {/* Student Info Details */}
            <div className="space-y-1">
              <h4 className="font-black text-sm text-white tracking-tight leading-snug">
                {currentSiswa.nama}
              </h4>
              <div className="inline-block px-3 py-0.5 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-full text-[11px] font-black">
                {namaKelas}
              </div>
              <p className="text-[11px] text-emerald-100/90 font-medium pt-0.5">
                NIS: <strong className="font-extrabold text-white">{currentSiswa.nis || '-'}</strong>
                {currentSiswa.nisn && (
                  <span> • NISN: <strong className="font-extrabold text-white">{currentSiswa.nisn}</strong></span>
                )}
              </p>
            </div>

            {/* Footer Notice */}
            <div className="border-t border-emerald-600/40 pt-2 text-[9px] text-emerald-200/70 font-semibold leading-relaxed">
              Scan kartu ini pada kamera Guru Piket untuk merekam kehadiran siswa.
            </div>
          </div>

          {/* Student Selector Switcher (Prev/Next) */}
          <div className="w-full flex items-center justify-between gap-2 px-2 text-xs">
            <button
              type="button"
              disabled={!hasPrev}
              onClick={handlePrev}
              className="px-2.5 py-1.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 disabled:opacity-30 disabled:pointer-events-none transition flex items-center gap-1 font-semibold text-[11px] cursor-pointer"
            >
              <ChevronLeft size={14} /> Sebelumnya
            </button>

            <span className="text-[10px] text-slate-400 font-semibold">
              {currentIndex + 1} dari {allStudents.length} Siswa
            </span>

            <button
              type="button"
              disabled={!hasNext}
              onClick={handleNext}
              className="px-2.5 py-1.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 disabled:opacity-30 disabled:pointer-events-none transition flex items-center gap-1 font-semibold text-[11px] cursor-pointer"
            >
              Selanjutnya <ChevronRight size={14} />
            </button>
          </div>
        </div>

        {/* Action Buttons Bar */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-2">
          <button
            type="button"
            onClick={handleCopyNis}
            className="px-3 py-2 bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-2xs"
            title="Salin NIS untuk input manual"
          >
            {copied ? <Check size={14} className="text-emerald-600" /> : <Share2 size={14} />}
            <span>{copied ? 'Tersalin!' : 'Salin NIS'}</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleDownloadQr}
              disabled={!qrDataUrl || isGenerating}
              className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white rounded-xl text-xs font-extrabold transition flex items-center gap-1.5 shadow-sm cursor-pointer"
              title="Unduh file gambar QR Code (.PNG)"
            >
              <Download size={14} /> Unduh QR (.PNG)
            </button>

            <button
              type="button"
              onClick={handlePrint}
              className="px-3.5 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-extrabold transition flex items-center gap-1.5 shadow-sm cursor-pointer"
              title="Cetak Kartu Presensi"
            >
              <Printer size={14} /> Cetak
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
