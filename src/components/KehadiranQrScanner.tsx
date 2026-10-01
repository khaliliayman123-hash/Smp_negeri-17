/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import jsQR from 'jsqr';
import QRCode from 'qrcode';
import { 
  Camera, 
  CameraOff, 
  X, 
  CheckCircle2, 
  AlertCircle, 
  Volume2, 
  VolumeX, 
  SwitchCamera, 
  Zap, 
  ZapOff, 
  Upload, 
  Search, 
  UserCheck, 
  Clock, 
  Sparkles, 
  RotateCcw,
  Check,
  Calendar,
  QrCode,
  Play,
  ShieldAlert,
  Lock,
  Settings,
  Smartphone,
  Laptop,
  HelpCircle,
  ExternalLink,
  ChevronRight,
  Info
} from 'lucide-react';
import { DatabaseState, User, Siswa, Kehadiran } from '../types';

interface KehadiranQrScannerProps {
  db: DatabaseState | null;
  currentUser: User;
  onSaveKehadiran?: (kehadiran: Kehadiran, isNew: boolean) => Promise<boolean>;
  onClose: () => void;
  defaultBulan?: string;
  defaultMinggu?: string;
}

interface ScannedRecord {
  id: string;
  siswa: Siswa;
  namaKelas: string;
  timestamp: string;
  status: 'Hadir' | 'Terlambat' | 'Sakit' | 'Izin' | 'Alfa';
  keterangan: string;
}

interface GuideStep {
  step: number;
  title: string;
  desc: string;
  badge?: string;
}

interface PlatformGuide {
  title: string;
  badge: string;
  steps: GuideStep[];
  tip?: string;
}

const BROWSER_GUIDES: Record<'desktop' | 'android' | 'ios', PlatformGuide> = {
  desktop: {
    title: 'Google Chrome / Microsoft Edge di Laptop & Komputer',
    badge: 'Desktop / PC',
    steps: [
      {
        step: 1,
        title: 'Klik Ikon Gembok / Setelan Situs di Bilah URL',
        desc: 'Lihat bilah alamat (URL) di sebelah kiri atas peramban Anda (tepat di samping alamat situs https://...). Klik ikon Gembok (🔒) atau ikon Pengaturan Situs (🎛️/Setelan Situs).'
      },
      {
        step: 2,
        title: 'Ubah Izin Kamera Menjadi "Izinkan" (Allow)',
        desc: 'Pada menu sembulan yang muncul, cari baris "Kamera" (Camera). Klik menu dropdown dan ubah dari "Blokir" (Block) menjadi "Izinkan" (Allow).'
      },
      {
        step: 3,
        title: 'Hubungkan Ulang Kamera',
        desc: 'Setelah izin diubah, klik tombol hijau "Hubungkan Ulang Kamera" di bawah atau tekan tombol Segarkan / Reload peramban (F5).'
      }
    ],
    tip: 'Jika Anda menggunakan webcam eksternal (USB), pastikan kabel tercolok dengan kencang dan lampu indikator webcam menyala.'
  },
  android: {
    title: 'Google Chrome di HP Android',
    badge: 'HP Android',
    steps: [
      {
        step: 1,
        title: 'Buka Ikon Gembok / Titik Tiga',
        desc: 'Ketuk ikon Gembok (🔒) di sebelah kiri bilah URL atau ketuk ikon Titik Tiga (⋮) di pojok kanan atas browser Chrome.'
      },
      {
        step: 2,
        title: 'Buka Setelan Situs (Site Settings)',
        desc: 'Pilih "Rincian" atau "Setelan Situs" (Site settings) lalu ketuk menu "Kamera" (Camera).'
      },
      {
        step: 3,
        title: 'Hapus Blokir & Izinkan Kamera',
        desc: 'Jika situs ini terdaftar di bagian "Diblokir", ketuk nama situs lalu pilih "Izinkan" (Allow) atau "Hapus & setel ulang".'
      },
      {
        step: 4,
        title: 'Kembali & Hubungkan Ulang',
        desc: 'Tutup menu setelan, kembali ke aplikasi, lalu ketuk tombol "Hubungkan Ulang Kamera" di bawah.'
      }
    ],
    tip: 'Pastikan juga izin kamera untuk aplikasi Chrome di Pengaturan HP Anda (Settings > Apps > Chrome > Permissions > Camera) sudah diaktifkan.'
  },
  ios: {
    title: 'Safari di iPhone & iPad (iOS)',
    badge: 'Apple iOS',
    steps: [
      {
        step: 1,
        title: 'Ketuk Ikon "aA" di Bilah Alamat',
        desc: 'Pada bilah alamat URL bagian bawah atau atas Safari, ketuk tombol ikon "aA" atau ikon gembok.'
      },
      {
        step: 2,
        title: 'Pilih Pengaturan Situs Web',
        desc: 'Ketuk opsi "Pengaturan Situs Web" (Website Settings) dari menu sembulan yang terbuka.'
      },
      {
        step: 3,
        title: 'Ubah Izin Kamera ke "Izinkan"',
        desc: 'Pada baris "Kamera", ubah pilihan dari "Tolak" atau "Tanya" menjadi "Izinkan" (Allow).'
      },
      {
        step: 4,
        title: 'Segarkan Halaman Safari',
        desc: 'Ketuk Selesai (Done), lalu muat ulang halaman Safari untuk mengaktifkan kamera secara penuh.'
      }
    ],
    tip: 'Bisa juga diperiksa lewat Pengaturan iPhone > Safari > Kamera > Ubah ke "Izinkan".'
  }
};

const BULAN_LIST = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
];

export default function KehadiranQrScanner({
  db,
  currentUser,
  onSaveKehadiran,
  onClose,
  defaultBulan,
  defaultMinggu
}: KehadiranQrScannerProps) {
  // Determine current Indonesian month and week
  const today = new Date();
  const currentMonthName = BULAN_LIST[today.getMonth()];
  const currentWeekNumber = Math.min(5, Math.max(1, Math.ceil(today.getDate() / 7)));
  const currentWeekName = `Minggu ${currentWeekNumber}`;
  const currentYear = today.getFullYear().toString();

  // Target Attendance Session States
  const [selectedBulan, setSelectedBulan] = useState<string>(defaultBulan && defaultBulan !== 'ALL' ? defaultBulan : currentMonthName);
  const [selectedMinggu, setSelectedMinggu] = useState<string>(defaultMinggu && defaultMinggu !== 'ALL' ? defaultMinggu : currentWeekName);
  const [selectedTahun, setSelectedTahun] = useState<string>(currentYear);

  // Scanner Config States
  const [autoSubmitHadir, setAutoSubmitHadir] = useState<boolean>(true);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');
  const [torchOn, setTorchOn] = useState<boolean>(false);
  const [hasTorch, setHasTorch] = useState<boolean>(false);

  // Camera & Stream States
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [cameraActive, setCameraActive] = useState<boolean>(false);
  const [isInitializingCamera, setIsInitializingCamera] = useState<boolean>(true);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [cameraErrorType, setCameraErrorType] = useState<'not_allowed' | 'not_found' | 'in_use' | 'overconstrained' | 'unsupported' | 'unknown' | null>(null);
  const [permissionStatus, setPermissionStatus] = useState<'prompt' | 'granted' | 'denied' | 'unknown'>('unknown');
  const [guidePlatform, setGuidePlatform] = useState<'desktop' | 'android' | 'ios'>('desktop');
  const [showTroubleshootModal, setShowTroubleshootModal] = useState<boolean>(false);
  const [isScanning, setIsScanning] = useState<boolean>(true);

  // Detection & Confirmation States
  const [detectedStudent, setDetectedStudent] = useState<Siswa | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<'Hadir' | 'Terlambat' | 'Sakit' | 'Izin' | 'Alfa'>('Hadir');
  const [customNote, setCustomNote] = useState<string>('');
  const [isSaving, setIsSaving] = useState<boolean>(false);

  // Success Notification Banner
  const [flashSuccess, setFlashSuccess] = useState<{
    nama: string;
    kelas: string;
    status: string;
    nis: string;
  } | null>(null);

  // Anti-duplicate scan cooldown
  const lastScannedIdRef = useRef<{ id: string; time: number } | null>(null);

  // Session Scan History
  const [sessionHistory, setSessionHistory] = useState<ScannedRecord[]>([]);

  // Fallback modes: Manual Search vs Demo QR Card
  const [activeTab, setActiveTab] = useState<'camera' | 'manual' | 'demo'>('camera');
  const [manualQuery, setManualQuery] = useState<string>('');
  
  // Demo QR Code student state
  const [demoStudentId, setDemoStudentId] = useState<string>(() => db?.siswa?.[0]?.id || '');
  const [demoQrDataUrl, setDemoQrDataUrl] = useState<string>('');

  // Audio Beep generator using Web Audio API
  const playBeep = useCallback((type: 'success' | 'alert' = 'success') => {
    if (!soundEnabled) return;
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      if (type === 'success') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(880, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(1174.66, ctx.currentTime + 0.12);
        gain.gain.setValueAtTime(0.2, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.16);
      } else {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(440, ctx.currentTime);
        gain.gain.setValueAtTime(0.25, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.22);
      }
    } catch {}
  }, [soundEnabled]);

  // Haptic feedback
  const triggerVibrate = useCallback(() => {
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate([70, 30, 70]);
      } catch {}
    }
  }, []);

  // Helper to extract student class
  const getClassNameForSiswa = useCallback((s: Siswa): string => {
    if (!db || !s) return 'Kelas -';
    if (s.kelasId) {
      const cls = db.kelas.find(k => k.id === s.kelasId || k.namaKelas === s.kelasId);
      if (cls) return cls.namaKelas;
    }
    return s.kelasId || 'Kelas -';
  }, [db]);

  // Student resolution logic: matches QR content to student record
  const resolveStudentFromCode = useCallback((codeText: string): Siswa | null => {
    if (!db || !db.siswa || !codeText) return null;
    const cleanRaw = codeText.trim();
    if (!cleanRaw) return null;

    // 1. Try parsing JSON format: { id?: "...", nis?: "...", nisn?: "..." }
    try {
      if (cleanRaw.startsWith('{') && cleanRaw.endsWith('}')) {
        const parsed = JSON.parse(cleanRaw);
        if (parsed.id) {
          const match = db.siswa.find(s => s.id === parsed.id);
          if (match) return match;
        }
        if (parsed.nis) {
          const match = db.siswa.find(s => s.nis && String(s.nis).trim() === String(parsed.nis).trim());
          if (match) return match;
        }
        if (parsed.nisn) {
          const match = db.siswa.find(s => s.nisn && String(s.nisn).trim() === String(parsed.nisn).trim());
          if (match) return match;
        }
      }
    } catch {}

    // 2. Extract potential NIS / ID from text with prefix (e.g., "NIS: 12345", "ID: sis-1", "PANDA:12345")
    let target = cleanRaw;
    const prefixMatch = cleanRaw.match(/(?:nis|nisn|id|panda|hds)\s*[:=-]\s*([a-zA-Z0-9-]+)/i);
    if (prefixMatch) {
      target = prefixMatch[1].trim();
    }

    const targetLower = target.toLowerCase();

    // 3. Exact match on student ID
    const byId = db.siswa.find(s => s.id && s.id.toLowerCase() === targetLower);
    if (byId) return byId;

    // 4. Exact match on NIS (ensuring string comparison)
    const byNis = db.siswa.find(s => s.nis && String(s.nis).trim().toLowerCase() === targetLower);
    if (byNis) return byNis;

    // 5. Exact match on NISN
    const byNisn = db.siswa.find(s => s.nisn && String(s.nisn).trim().toLowerCase() === targetLower);
    if (byNisn) return byNisn;

    // 6. Name match
    const byName = db.siswa.find(s => s.nama && s.nama.toLowerCase().trim() === cleanRaw.toLowerCase());
    if (byName) return byName;

    // 7. Numeric digits match on NIS / NISN
    const digits = cleanRaw.replace(/\D/g, '');
    if (digits.length >= 4) {
      const byDigits = db.siswa.find(s => {
        const sNisDigits = String(s.nis || '').replace(/\D/g, '');
        const sNisnDigits = String(s.nisn || '').replace(/\D/g, '');
        return (sNisDigits !== '' && sNisDigits === digits) || (sNisnDigits !== '' && sNisnDigits === digits);
      });
      if (byDigits) return byDigits;
    }

    return null;
  }, [db]);

  // Record Attendance into database / App State
  const recordAttendance = useCallback(async (
    student: Siswa, 
    status: 'Hadir' | 'Terlambat' | 'Sakit' | 'Izin' | 'Alfa',
    noteText: string = ''
  ): Promise<boolean> => {
    if (!db) return false;
    setIsSaving(true);

    try {
      const namaKelas = getClassNameForSiswa(student);
      const timeStr = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      const statusNote = noteText.trim() 
        ? noteText.trim() 
        : `Scan QR Piket (${timeStr} WIB) - ${status}`;

      // Check if student already has a record for this bulan, mingguKe, and tahun
      const existing = (db.kehadiran || []).find(k => 
        k.siswaId === student.id &&
        String(k.bulan || '').toLowerCase().trim() === selectedBulan.toLowerCase().trim() &&
        String(k.mingguKe || '').toLowerCase().trim() === selectedMinggu.toLowerCase().trim() &&
        String(k.tahun || '').trim() === selectedTahun.trim()
      );

      let payload: Kehadiran;
      let isNew = false;

      if (existing) {
        // Increment according to chosen status
        const isHadir = status === 'Hadir' || status === 'Terlambat';
        const isSakit = status === 'Sakit';
        const isIzin = status === 'Izin';
        const isAlfa = status === 'Alfa';

        payload = {
          ...existing,
          hadir: Number(existing.hadir || 0) + (isHadir ? 1 : 0),
          sakit: Number(existing.sakit || 0) + (isSakit ? 1 : 0),
          izin: Number(existing.izin || 0) + (isIzin ? 1 : 0),
          alfa: Number(existing.alfa || 0) + (isAlfa ? 1 : 0),
          keterangan: existing.keterangan 
            ? `${existing.keterangan}; ${statusNote}`
            : statusNote
        };
      } else {
        isNew = true;
        const isHadir = status === 'Hadir' || status === 'Terlambat';
        const isSakit = status === 'Sakit';
        const isIzin = status === 'Izin';
        const isAlfa = status === 'Alfa';

        payload = {
          id: `khd-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
          siswaId: student.id,
          kelas: namaKelas,
          bulan: selectedBulan,
          mingguKe: selectedMinggu,
          tahun: selectedTahun,
          hadir: isHadir ? 1 : 0,
          sakit: isSakit ? 1 : 0,
          izin: isIzin ? 1 : 0,
          alfa: isAlfa ? 1 : 0,
          keterangan: statusNote
        };
      }

      if (onSaveKehadiran) {
        await onSaveKehadiran(payload, isNew);
      }

      // Add to session history list
      setSessionHistory(prev => [
        {
          id: `${Date.now()}-${student.id}`,
          siswa: student,
          namaKelas,
          timestamp: timeStr,
          status,
          keterangan: statusNote
        },
        ...prev
      ]);

      // Trigger visual flash
      setFlashSuccess({
        nama: student.nama,
        kelas: namaKelas,
        status,
        nis: String(student.nis || '-')
      });
      setTimeout(() => setFlashSuccess(null), 3500);

      playBeep('success');
      triggerVibrate();

      return true;
    } catch (err) {
      console.error('Failed to record attendance:', err);
      playBeep('alert');
      return false;
    } finally {
      setIsSaving(false);
    }
  }, [db, getClassNameForSiswa, onSaveKehadiran, playBeep, triggerVibrate, selectedBulan, selectedMinggu, selectedTahun]);

  // Handle detected QR Code payload
  const handleDetectedCode = useCallback((codeRaw: string) => {
    if (!isScanning) return;

    const student = resolveStudentFromCode(codeRaw);
    if (!student) {
      return;
    }

    // Check anti-duplicate cooldown (ignore same student within 4 seconds)
    const now = Date.now();
    if (lastScannedIdRef.current && lastScannedIdRef.current.id === student.id && (now - lastScannedIdRef.current.time) < 4000) {
      return;
    }
    lastScannedIdRef.current = { id: student.id, time: now };

    if (autoSubmitHadir) {
      // Direct auto-record as Hadir!
      recordAttendance(student, 'Hadir');
    } else {
      // Pause scanner & show confirmation card
      setIsScanning(false);
      setDetectedStudent(student);
      setSelectedStatus('Hadir');
      setCustomNote('');
      playBeep('success');
      triggerVibrate();
    }
  }, [isScanning, resolveStudentFromCode, autoSubmitHadir, recordAttendance, playBeep, triggerVibrate]);

  // Real-time camera loop with requestAnimationFrame and jsQR
  const tick = useCallback(() => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });

    if (video.readyState === video.HAVE_ENOUGH_DATA && ctx) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      try {
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const code = jsQR(imageData.data, imageData.width, imageData.height, {
          inversionAttempts: 'dontInvert'
        });

        if (code && code.data) {
          handleDetectedCode(code.data);
        }
      } catch (e) {
        // Ignored read error
      }
    }

    if (cameraActive) {
      animationFrameRef.current = requestAnimationFrame(tick);
    }
  }, [cameraActive, handleDetectedCode]);

  // Proactively check browser camera permission state
  const checkPermissionState = useCallback(async () => {
    if (typeof navigator !== 'undefined' && navigator.permissions && navigator.permissions.query) {
      try {
        const pStatus = await navigator.permissions.query({ name: 'camera' as any });
        setPermissionStatus(pStatus.state as any);
        if (pStatus.state === 'denied') {
          setCameraErrorType('not_allowed');
          setCameraError('Akses kamera diblokir oleh peramban. Ikuti petunjuk manual untuk membuka izin kamera.');
        }
        pStatus.onchange = () => {
          setPermissionStatus(pStatus.state as any);
          if (pStatus.state === 'granted') {
            setCameraError(null);
            setCameraErrorType(null);
            startCamera();
          } else if (pStatus.state === 'denied') {
            setCameraErrorType('not_allowed');
            setCameraError('Akses kamera diblokir oleh peramban. Ikuti petunjuk manual untuk membuka izin kamera.');
          }
        };
      } catch {
        // query with name 'camera' might fail in some browser variants
      }
    }
  }, []);

  // Start Camera Stream with Robust Fallbacks and Error Categorization
  const startCamera = useCallback(async () => {
    setIsInitializingCamera(true);
    setCameraError(null);
    setCameraErrorType(null);

    // Stop previous stream if any
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => {
        try { t.stop(); } catch {}
      });
      streamRef.current = null;
    }

    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setCameraErrorType('unsupported');
        throw new Error('Kamera tidak didukung oleh browser pada perangkat ini atau dibatasi oleh pengaturan keamanan iframe.');
      }

      // Proactive check if physical video devices exist
      if (navigator.mediaDevices.enumerateDevices) {
        try {
          const devices = await navigator.mediaDevices.enumerateDevices();
          const videoInputs = devices.filter(d => d.kind === 'videoinput');
          if (videoInputs.length === 0) {
            setCameraErrorType('not_found');
            setCameraError('Tidak ada perangkat webcam atau kamera yang terdeteksi pada laptop/komputer ini.');
            setCameraActive(false);
            setIsInitializingCamera(false);
            return;
          }
        } catch {
          // If enumerateDevices fails before permission, continue to getUserMedia
        }
      }

      let stream: MediaStream | null = null;

      // Attempt 1: Optimal constraints with ideal facingMode
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: { ideal: facingMode },
            width: { ideal: 1280 },
            height: { ideal: 720 }
          },
          audio: false
        });
      } catch (attempt1Err: any) {
        if (attempt1Err.name === 'NotAllowedError' || attempt1Err.name === 'PermissionDeniedError') {
          throw attempt1Err;
        }
        console.warn('Attempt 1 with ideal facingMode failed, falling back to basic video:', attempt1Err);
        
        // Attempt 2: Basic video constraint
        stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: false
        });
      }

      if (!stream) {
        throw new Error('Tidak dapat memperoleh stream video dari kamera.');
      }

      streamRef.current = stream;

      // Check torch capability
      const track = stream.getVideoTracks()[0];
      if (track) {
        const capabilities: any = track.getCapabilities ? track.getCapabilities() : {};
        setHasTorch(Boolean(capabilities.torch));
      }

      // Attach stream to video element
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.muted = true;
        videoRef.current.setAttribute('playsinline', 'true');
        videoRef.current.onloadedmetadata = () => {
          videoRef.current?.play().catch(e => console.warn('video.play() warning:', e));
        };
        await videoRef.current.play().catch(e => console.warn('video.play() direct warning:', e));
      }

      setCameraActive(true);
      setIsScanning(true);
      setPermissionStatus('granted');
      setCameraError(null);
      setCameraErrorType(null);
      setIsInitializingCamera(false);
    } catch (err: any) {
      console.warn('Camera error:', err);
      let msg = 'Gagal mengakses kamera perangkat.';
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        setCameraErrorType('not_allowed');
        setPermissionStatus('denied');
        msg = 'Akses kamera ditolak oleh browser. Ikuti petunjuk manual untuk membuka izin kamera.';
      } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
        setCameraErrorType('not_found');
        msg = 'Tidak ada perangkat kamera yang terdeteksi pada laptop/komputer ini.';
      } else if (err.name === 'NotReadableError' || err.name === 'TrackStartError') {
        setCameraErrorType('in_use');
        msg = 'Kamera sedang digunakan oleh aplikasi lain (seperti Zoom, Google Meet, atau tab lain).';
      } else if (err.name === 'OverconstrainedError') {
        setCameraErrorType('overconstrained');
        msg = 'Konfigurasi kamera tidak didukung oleh perangkat Anda.';
      } else if (err.message) {
        setCameraErrorType('unknown');
        msg = err.message;
      }
      setCameraError(msg);
      setCameraActive(false);
      setIsInitializingCamera(false);
    }
  }, [facingMode]);

  // Stop Camera Stream
  const stopCamera = useCallback(() => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => {
        try {
          t.stop();
        } catch {}
      });
      streamRef.current = null;
    }
    setCameraActive(false);
    setTorchOn(false);
  }, []);

  // Toggle Torch/Flashlight
  const toggleTorch = async () => {
    if (!streamRef.current) return;
    const track = streamRef.current.getVideoTracks()[0];
    if (!track) return;
    try {
      const nextTorch = !torchOn;
      await (track as any).applyConstraints({
        advanced: [{ torch: nextTorch }]
      });
      setTorchOn(nextTorch);
    } catch (err) {
      console.warn('Torch failed:', err);
    }
  };

  // Switch between front and rear cameras
  const switchCameraFacing = () => {
    stopCamera();
    setFacingMode(prev => (prev === 'environment' ? 'user' : 'environment'));
  };

  // Upload/Snap Photo file scanner
  const handleFileScan = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        ctx.drawImage(img, 0, 0);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const code = jsQR(imageData.data, imageData.width, imageData.height);
        if (code && code.data) {
          handleDetectedCode(code.data);
        } else {
          alert('QR Code tidak terdeteksi pada gambar yang diunggah. Pastikan gambar jelas dan tidak buram.');
        }
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // Auto-detect client platform (Laptop, Android, iOS) for tailored instructions
  useEffect(() => {
    if (typeof navigator !== 'undefined') {
      const ua = (navigator.userAgent || '').toLowerCase();
      if (ua.includes('android')) {
        setGuidePlatform('android');
      } else if (ua.includes('iphone') || ua.includes('ipad') || ua.includes('ipod')) {
        setGuidePlatform('ios');
      } else {
        setGuidePlatform('desktop');
      }
    }
    checkPermissionState();
  }, [checkPermissionState]);

  // Mount/Unmount camera cycle
  useEffect(() => {
    startCamera();
    return () => {
      stopCamera();
    };
  }, [startCamera, stopCamera]);

  // Run tick loop when camera is active
  useEffect(() => {
    if (cameraActive) {
      animationFrameRef.current = requestAnimationFrame(tick);
    }
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [cameraActive, tick]);

  // Generate Demo QR Code for testing inside the modal
  useEffect(() => {
    if (!demoStudentId || !db?.siswa) return;
    const target = db.siswa.find(s => s.id === demoStudentId);
    if (!target) return;

    const payload = String(target.nis || target.id || 'SISWA-17').trim();
    QRCode.toDataURL(payload, {
      width: 260,
      margin: 1,
      color: {
        dark: '#064e3b',
        light: '#ffffff'
      }
    }, (err, url) => {
      if (!err && url) {
        setDemoQrDataUrl(url);
      }
    });
  }, [demoStudentId, db]);

  // Filtered manual students list for search fallback
  const manualStudents = useMemo(() => {
    if (!db || !db.siswa || !manualQuery.trim()) return [];
    const q = manualQuery.toLowerCase().trim();
    return db.siswa.filter(s => 
      (s.nama && s.nama.toLowerCase().includes(q)) ||
      (s.nis && String(s.nis).includes(q)) ||
      (s.nisn && String(s.nisn).includes(q))
    ).slice(0, 10);
  }, [db, manualQuery]);

  const demoStudentObj = useMemo(() => {
    return db?.siswa?.find(s => s.id === demoStudentId) || db?.siswa?.[0] || null;
  }, [db, demoStudentId]);

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[96vh] text-white">
        
        {/* Scanner Top Bar */}
        <div className="p-4 sm:px-6 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-600 flex items-center justify-center text-white shadow-md">
              <Camera size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-black text-sm sm:text-base text-white tracking-tight">
                  Pindai QR Code Presensi
                </h3>
                <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-full text-[10px] font-extrabold uppercase tracking-wide">
                  Piket Cepat
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Arahkan kamera ke QR Code Kartu Pelajar untuk merekam kehadiran siswa.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {/* Audio Toggle */}
            <button
              type="button"
              onClick={() => setSoundEnabled(!soundEnabled)}
              className={`p-2 rounded-xl border transition cursor-pointer ${
                soundEnabled 
                  ? 'bg-slate-800 border-slate-700 text-emerald-400 hover:bg-slate-700' 
                  : 'bg-slate-800/50 border-slate-800 text-slate-500 hover:text-slate-300'
              }`}
              title={soundEnabled ? 'Suara Beep Aktif' : 'Suara Beep Nonaktif'}
            >
              {soundEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
            </button>

            {/* Close Button */}
            <button
              type="button"
              onClick={() => {
                stopCamera();
                onClose();
              }}
              className="p-2 bg-slate-800 hover:bg-rose-900/50 border border-slate-700 hover:border-rose-500/50 text-slate-300 hover:text-rose-300 rounded-xl transition cursor-pointer"
              title="Tutup Pemindai"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Target Session Settings Bar */}
        <div className="px-4 sm:px-6 py-2.5 bg-slate-950/60 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="text-slate-400 font-bold flex items-center gap-1 text-[11px]">
              <Calendar size={13} className="text-emerald-400" /> Sesi:
            </span>

            {/* Bulan Selector */}
            <select
              value={selectedBulan}
              onChange={(e) => setSelectedBulan(e.target.value)}
              className="bg-slate-800 border border-slate-700 text-white rounded-lg px-2.5 py-1 text-[11px] font-bold focus:outline-none focus:ring-1 focus:ring-emerald-500 cursor-pointer"
            >
              {BULAN_LIST.map(b => (
                <option key={b} value={b}>{b}</option>
              ))}
            </select>

            {/* Minggu Selector */}
            <select
              value={selectedMinggu}
              onChange={(e) => setSelectedMinggu(e.target.value)}
              className="bg-slate-800 border border-slate-700 text-white rounded-lg px-2.5 py-1 text-[11px] font-bold focus:outline-none focus:ring-1 focus:ring-emerald-500 cursor-pointer"
            >
              <option value="Minggu 1">Minggu 1</option>
              <option value="Minggu 2">Minggu 2</option>
              <option value="Minggu 3">Minggu 3</option>
              <option value="Minggu 4">Minggu 4</option>
              <option value="Minggu 5">Minggu 5</option>
            </select>

            <span className="text-slate-500 font-semibold text-[11px]">Thn {selectedTahun}</span>
          </div>

          {/* Mode Switch: Auto Hadir vs Konfirmasi Manual */}
          <div className="flex items-center gap-2 bg-slate-800/80 border border-slate-700/80 px-2.5 py-1 rounded-xl">
            <span className="text-[11px] text-slate-300 font-medium hidden sm:inline">Mode Otomatis:</span>
            <button
              type="button"
              onClick={() => setAutoSubmitHadir(!autoSubmitHadir)}
              className={`px-2.5 py-0.5 rounded-lg text-[10px] font-extrabold transition cursor-pointer flex items-center gap-1 ${
                autoSubmitHadir 
                  ? 'bg-emerald-500 text-slate-950 shadow-sm' 
                  : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
              }`}
            >
              <Sparkles size={11} />
              {autoSubmitHadir ? 'Auto-Hadir (Cepat)' : 'Konfirmasi Manual'}
            </button>
          </div>
        </div>

        {/* Flash Confirmation Banner on Scan */}
        {flashSuccess && (
          <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 p-3 text-white flex items-center justify-between gap-3 shadow-lg animate-in slide-in-from-top-3 duration-200">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center font-bold">
                <Check size={18} className="text-white" />
              </div>
              <div>
                <p className="text-xs font-black text-white leading-tight">
                  {flashSuccess.nama} ({flashSuccess.kelas})
                </p>
                <p className="text-[10px] text-emerald-100 font-medium">
                  NIS: {flashSuccess.nis} • Status: <strong className="underline uppercase">{flashSuccess.status}</strong> Berhasil Dicatat!
                </p>
              </div>
            </div>
            <span className="px-2.5 py-1 bg-white/20 rounded-lg text-[10px] font-black tracking-wider uppercase">
              Tercatat
            </span>
          </div>
        )}

        {/* Tabs to switch between Live Camera, Manual Input, and Demo Test QR */}
        <div className="flex items-center border-b border-slate-800 bg-slate-950/40 px-4 sm:px-6">
          <button
            type="button"
            onClick={() => setActiveTab('camera')}
            className={`py-2 px-3 text-xs font-extrabold border-b-2 transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'camera'
                ? 'border-emerald-500 text-emerald-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Camera size={14} />
            <span>Kamera Pemindai</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('manual')}
            className={`py-2 px-3 text-xs font-extrabold border-b-2 transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'manual'
                ? 'border-emerald-500 text-emerald-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Search size={14} />
            <span>Input Manual NIS</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('demo')}
            className={`py-2 px-3 text-xs font-extrabold border-b-2 transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'demo'
                ? 'border-emerald-500 text-emerald-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <QrCode size={14} />
            <span>Contoh QR Siswa / Uji Coba</span>
          </button>
        </div>

        {/* Main Workspace */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 overflow-y-auto flex-1">
          
          {/* Left Column: Interactive View (Camera, Manual, or Demo QR) */}
          <div className="lg:col-span-7 bg-black p-4 flex flex-col items-center justify-center relative min-h-[320px] sm:min-h-[380px]">
            
            {activeTab === 'camera' && (
              <div className="w-full max-w-md flex flex-col items-center">
                {/* VIDEO & CANVAS ELEMENT ALWAYS PRESENT IN DOM */}
                <video
                  ref={videoRef}
                  playsInline
                  autoPlay
                  muted
                  className={`w-full h-full object-cover transition-opacity duration-300 ${
                    cameraActive ? 'opacity-100 block' : 'opacity-0 absolute pointer-events-none'
                  }`}
                />
                <canvas ref={canvasRef} className="hidden" />

                {/* Initializing Spinner */}
                {isInitializingCamera && !cameraActive && (
                  <div className="w-full aspect-4/3 rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 shadow-2xl flex flex-col items-center justify-center p-6 space-y-3">
                    <div className="w-10 h-10 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto" />
                    <p className="font-extrabold text-xs text-emerald-300">Menghubungkan Kamera Perangkat...</p>
                    <p className="text-[10px] text-slate-400">Pastikan izin kamera sudah diizinkan di peramban Anda.</p>
                  </div>
                )}

                {/* Active Viewfinder Box & Animated Laser */}
                {cameraActive && (
                  <div className="relative w-full aspect-4/3 rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 shadow-2xl flex items-center justify-center">
                    <div className="absolute inset-0 pointer-events-none flex items-center justify-center p-8">
                      <div className="w-56 h-56 sm:w-64 sm:h-64 relative border-2 border-emerald-400/50 rounded-2xl shadow-[0_0_0_9999px_rgba(0,0,0,0.4)]">
                        <div className="absolute -top-1 -left-1 w-6 h-6 border-t-4 border-l-4 border-emerald-400 rounded-tl-lg" />
                        <div className="absolute -top-1 -right-1 w-6 h-6 border-t-4 border-r-4 border-emerald-400 rounded-tr-lg" />
                        <div className="absolute -bottom-1 -left-1 w-6 h-6 border-b-4 border-l-4 border-emerald-400 rounded-bl-lg" />
                        <div className="absolute -bottom-1 -right-1 w-6 h-6 border-b-4 border-r-4 border-emerald-400 rounded-br-lg" />
                        <div className="w-full h-0.5 bg-gradient-to-r from-transparent via-emerald-400 to-transparent shadow-[0_0_8px_#34d399] absolute top-1/2 -translate-y-1/2 animate-pulse" />
                      </div>

                      <div className="absolute bottom-3 left-0 right-0 text-center pointer-events-none px-4">
                        <span className="px-3 py-1 bg-black/60 backdrop-blur-md rounded-full text-[10px] font-bold text-emerald-300 border border-emerald-500/30">
                          Arahkan QR Code Kartu Siswa ke dalam kotak
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Robust Error & Manual Instruction Guidance Panel when Camera is Inactive */}
                {!isInitializingCamera && !cameraActive && (
                  <div className="w-full bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 space-y-4 shadow-xl">
                    {/* Diagnostic Alert Banner */}
                    <div className={`p-3.5 rounded-xl border flex items-start gap-3 ${
                      cameraErrorType === 'not_allowed'
                        ? 'bg-rose-950/40 border-rose-800/80 text-rose-200'
                        : cameraErrorType === 'not_found'
                        ? 'bg-amber-950/40 border-amber-800/80 text-amber-200'
                        : cameraErrorType === 'in_use'
                        ? 'bg-sky-950/40 border-sky-800/80 text-sky-200'
                        : 'bg-slate-800/80 border-slate-700 text-slate-200'
                    }`}>
                      <div className="p-2 rounded-lg bg-black/30 shrink-0 mt-0.5">
                        {cameraErrorType === 'not_allowed' ? (
                          <ShieldAlert size={20} className="text-rose-400" />
                        ) : cameraErrorType === 'not_found' ? (
                          <CameraOff size={20} className="text-amber-400" />
                        ) : (
                          <AlertCircle size={20} className="text-sky-400" />
                        )}
                      </div>
                      <div className="space-y-1 min-w-0 flex-1">
                        <h4 className="font-extrabold text-sm text-white flex items-center gap-2">
                          {cameraErrorType === 'not_allowed'
                            ? 'Akses Kamera Ditolak / Diblokir Browser'
                            : cameraErrorType === 'not_found'
                            ? 'Perangkat Kamera Tidak Terdeteksi'
                            : cameraErrorType === 'in_use'
                            ? 'Kamera Sedang Dipakai Aplikasi Lain'
                            : 'Kamera Belum Terhubung'}
                        </h4>
                        <p className="text-xs text-slate-300 leading-relaxed">
                          {cameraError || 'Tidak dapat memulai kamera perangkat. Silakan ikuti instruksi manual di bawah:'}
                        </p>
                      </div>
                    </div>

                    {/* Platform Selector Tabs */}
                    <div className="space-y-3 bg-slate-950/70 p-3.5 rounded-xl border border-slate-800">
                      <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                        <span className="text-[11px] font-black uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                          <HelpCircle size={13} className="text-emerald-400" /> Petunjuk Sesuai Perangkat Anda:
                        </span>
                        <span className="text-[10px] text-emerald-400 font-bold bg-emerald-950/80 px-2 py-0.5 rounded-full border border-emerald-800/60">
                          {guidePlatform === 'desktop' ? 'Laptop/PC' : guidePlatform === 'android' ? 'Android' : 'iOS Safari'}
                        </span>
                      </div>

                      <div className="grid grid-cols-3 gap-1.5 text-xs">
                        <button
                          type="button"
                          onClick={() => setGuidePlatform('desktop')}
                          className={`py-2 px-2.5 rounded-lg font-bold flex items-center justify-center gap-1.5 transition cursor-pointer text-[11px] border ${
                            guidePlatform === 'desktop'
                              ? 'bg-emerald-600 text-white border-emerald-500 shadow-xs'
                              : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                          }`}
                        >
                          <Laptop size={13} />
                          <span>Laptop / PC</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => setGuidePlatform('android')}
                          className={`py-2 px-2.5 rounded-lg font-bold flex items-center justify-center gap-1.5 transition cursor-pointer text-[11px] border ${
                            guidePlatform === 'android'
                              ? 'bg-emerald-600 text-white border-emerald-500 shadow-xs'
                              : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                          }`}
                        >
                          <Smartphone size={13} />
                          <span>Android</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => setGuidePlatform('ios')}
                          className={`py-2 px-2.5 rounded-lg font-bold flex items-center justify-center gap-1.5 transition cursor-pointer text-[11px] border ${
                            guidePlatform === 'ios'
                              ? 'bg-emerald-600 text-white border-emerald-500 shadow-xs'
                              : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                          }`}
                        >
                          <Smartphone size={13} />
                          <span>iPhone / iPad</span>
                        </button>
                      </div>

                      {/* Step by Step Manual Instructions */}
                      <div className="space-y-2 pt-1 text-xs">
                        {BROWSER_GUIDES[guidePlatform].steps.map((st) => (
                          <div key={st.step} className="flex items-start gap-2.5 bg-slate-900/80 p-2.5 rounded-xl border border-slate-800">
                            <span className="w-5 h-5 rounded-full bg-emerald-500 text-slate-950 font-black flex items-center justify-center text-[10px] shrink-0 mt-0.5 shadow-xs">
                              {st.step}
                            </span>
                            <div className="space-y-0.5 min-w-0">
                              <p className="font-bold text-white text-[11px]">{st.title}</p>
                              <p className="text-[10px] text-slate-400 leading-relaxed">{st.desc}</p>
                            </div>
                          </div>
                        ))}

                        {BROWSER_GUIDES[guidePlatform].tip && (
                          <div className="p-2 bg-emerald-950/30 border border-emerald-800/40 rounded-lg text-[10px] text-emerald-300 flex items-center gap-2">
                            <Info size={13} className="shrink-0 text-emerald-400" />
                            <span>{BROWSER_GUIDES[guidePlatform].tip}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Primary Action Buttons */}
                    <div className="space-y-2 pt-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <button
                          type="button"
                          onClick={startCamera}
                          className="flex-1 py-2.5 px-3.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs rounded-xl transition cursor-pointer shadow-md inline-flex items-center justify-center gap-2"
                        >
                          <RotateCcw size={15} /> Hubungkan Ulang Kamera
                        </button>
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="py-2.5 px-3.5 bg-slate-800 hover:bg-slate-700 text-sky-300 font-bold text-xs rounded-xl transition cursor-pointer border border-slate-700 inline-flex items-center gap-1.5"
                          title="Buka Kamera HP Langsung lewat Ambil Foto"
                        >
                          <Upload size={15} /> Jepret / Unggah Foto
                        </button>
                      </div>

                      <div className="flex items-center justify-between gap-2 text-xs pt-1 border-t border-slate-800">
                        <span className="text-[10px] text-slate-500">Alternatif Cepat:</span>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => setActiveTab('manual')}
                            className="text-[11px] text-emerald-400 hover:underline font-bold inline-flex items-center gap-1 cursor-pointer"
                          >
                            <Search size={12} /> Input Manual NIS
                          </button>
                          <span className="text-slate-600">•</span>
                          <button
                            type="button"
                            onClick={() => setActiveTab('demo')}
                            className="text-[11px] text-indigo-400 hover:underline font-bold inline-flex items-center gap-1 cursor-pointer"
                          >
                            <QrCode size={12} /> Contoh QR & Uji Coba
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Camera Floating Controls Bar */}
            {activeTab === 'camera' && (
              <div className="flex items-center justify-center gap-2 mt-4 flex-wrap">
                <button
                  type="button"
                  onClick={switchCameraFacing}
                  className="px-3 py-1.5 bg-slate-800/90 hover:bg-slate-700 border border-slate-700 text-slate-200 rounded-xl text-xs font-semibold transition cursor-pointer flex items-center gap-1.5"
                >
                  <SwitchCamera size={14} className="text-emerald-400" />
                  <span className="text-[11px]">{facingMode === 'environment' ? 'Kamera Belakang' : 'Kamera Depan'}</span>
                </button>

                {hasTorch && (
                  <button
                    type="button"
                    onClick={toggleTorch}
                    className={`px-3 py-1.5 rounded-xl border text-xs font-semibold transition cursor-pointer flex items-center gap-1.5 ${
                      torchOn 
                        ? 'bg-amber-400 text-slate-950 border-amber-400 font-bold' 
                        : 'bg-slate-800/90 hover:bg-slate-700 text-slate-200 border-slate-700'
                    }`}
                  >
                    {torchOn ? <Zap size={14} /> : <ZapOff size={14} />}
                    <span className="text-[11px]">Senter</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-3 py-1.5 bg-slate-800/90 hover:bg-slate-700 border border-slate-700 text-slate-200 rounded-xl text-xs font-semibold transition cursor-pointer flex items-center gap-1.5"
                >
                  <Upload size={14} className="text-sky-400" />
                  <span className="text-[11px]">Pilih Foto QR</span>
                </button>
                <button
                  type="button"
                  onClick={() => setShowTroubleshootModal(true)}
                  className="px-3 py-1.5 bg-slate-800/90 hover:bg-slate-700 border border-slate-700 text-amber-300 rounded-xl text-xs font-semibold transition cursor-pointer flex items-center gap-1.5"
                  title="Buka Panduan Bantuan Izin Kamera"
                >
                  <HelpCircle size={14} className="text-amber-400" />
                  <span className="text-[11px]">Bantuan Izin</span>
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileScan}
                />
              </div>
            )}

            {/* Manual Search Tab */}
            {activeTab === 'manual' && (
              <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
                <div className="space-y-1">
                  <h4 className="font-extrabold text-sm text-white flex items-center gap-1.5">
                    <Search size={15} className="text-emerald-400" /> Pencarian Siswa & Presensi Langsung
                  </h4>
                  <p className="text-[11px] text-slate-400">
                    Cari berdasarkan nama lengkap atau nomor NIS siswa untuk mencatat kehadiran seketika.
                  </p>
                </div>

                <div className="relative">
                  <Search size={15} className="absolute left-3 top-3 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Ketik Nama atau NIS siswa..."
                    value={manualQuery}
                    onChange={(e) => setManualQuery(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    autoFocus
                  />
                </div>

                <div className="max-h-60 overflow-y-auto divide-y divide-slate-800 rounded-xl bg-slate-950 border border-slate-800 text-xs">
                  {manualStudents.length === 0 ? (
                    <div className="p-4 text-center text-xs text-slate-500">
                      {manualQuery.trim() ? 'Tidak ada siswa yang cocok.' : 'Ketik nama siswa atau nomor NIS untuk melihat hasil.'}
                    </div>
                  ) : (
                    manualStudents.map(s => {
                      const sKelas = getClassNameForSiswa(s);
                      return (
                        <div
                          key={s.id}
                          className="p-3 hover:bg-slate-800/80 transition flex items-center justify-between gap-2"
                        >
                          <div className="min-w-0">
                            <p className="font-bold text-white text-xs truncate">{s.nama}</p>
                            <p className="text-[10px] text-slate-400">NIS: {s.nis || '-'} • {sKelas}</p>
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              if (autoSubmitHadir) {
                                recordAttendance(s, 'Hadir');
                              } else {
                                setDetectedStudent(s);
                                setActiveTab('camera');
                              }
                            }}
                            className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-[11px] rounded-lg transition shrink-0 cursor-pointer shadow-xs"
                          >
                            + Hadir
                          </button>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            )}

            {/* Demo QR Tab: View & Test Scan on Screen */}
            {activeTab === 'demo' && (
              <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 text-center">
                <div className="space-y-1">
                  <h4 className="font-extrabold text-sm text-white flex items-center justify-center gap-1.5">
                    <QrCode size={16} className="text-emerald-400" /> Contoh Barcode QR & Uji Coba Presensi
                  </h4>
                  <p className="text-[11px] text-slate-400">
                    Pilih siswa untuk melihat QR Code-nya di layar atau klik 'Simulasi Scan' untuk menguji alur presensi.
                  </p>
                </div>

                {/* Student Selector Dropdown */}
                <div className="text-left space-y-1">
                  <label className="block text-[11px] font-bold text-slate-400">Pilih Siswa Contoh:</label>
                  <select
                    value={demoStudentId}
                    onChange={(e) => setDemoStudentId(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:ring-1 focus:ring-emerald-500 font-bold cursor-pointer"
                  >
                    {(db?.siswa || []).slice(0, 50).map(s => (
                      <option key={s.id} value={s.id}>
                        {s.nama} ({getClassNameForSiswa(s)} - NIS: {s.nis || '-'})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Display QR Code */}
                <div className="p-3 bg-white rounded-2xl inline-block mx-auto border-2 border-emerald-400/40 shadow-xl">
                  {demoQrDataUrl ? (
                    <img 
                      src={demoQrDataUrl} 
                      alt="Demo QR" 
                      className="w-40 h-40 object-contain mx-auto rounded-lg"
                    />
                  ) : (
                    <div className="w-40 h-40 flex items-center justify-center text-slate-400 text-xs">
                      Memuat QR...
                    </div>
                  )}
                </div>

                {demoStudentObj && (
                  <div className="space-y-1">
                    <p className="font-black text-sm text-white">{demoStudentObj.nama}</p>
                    <p className="text-[11px] text-emerald-400 font-bold">
                      {getClassNameForSiswa(demoStudentObj)} • NIS: {demoStudentObj.nis || '-'}
                    </p>
                  </div>
                )}

                {/* Instant Simulation Button */}
                <button
                  type="button"
                  disabled={!demoStudentObj || isSaving}
                  onClick={() => {
                    if (demoStudentObj) {
                      recordAttendance(demoStudentObj, 'Hadir');
                    }
                  }}
                  className="w-full py-2.5 bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-black rounded-xl text-xs transition cursor-pointer flex items-center justify-center gap-1.5 shadow-md"
                >
                  <Play size={14} /> Simulasi Scan Siswa Ini (Presensi Hadir)
                </button>
              </div>
            )}

          </div>

          {/* Right Column: Confirmation Card or Session History */}
          <div className="lg:col-span-5 bg-slate-900 p-4 sm:p-5 flex flex-col justify-between border-t lg:border-t-0 lg:border-l border-slate-800 space-y-4">
            
            {/* If a student was detected in Confirmation Mode */}
            {detectedStudent && !autoSubmitHadir ? (
              <div className="bg-slate-800/90 border border-slate-700 rounded-2xl p-4 space-y-4 animate-in fade-in zoom-in-95 duration-150">
                <div className="flex items-center justify-between border-b border-slate-700/80 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                    <h4 className="font-black text-xs uppercase tracking-wider text-emerald-300">
                      Siswa Terdeteksi
                    </h4>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setDetectedStudent(null);
                      setIsScanning(true);
                    }}
                    className="text-slate-400 hover:text-white p-1 rounded-lg"
                  >
                    <X size={15} />
                  </button>
                </div>

                {/* Student Profile Card */}
                <div className="flex items-center gap-3 bg-slate-900/60 p-3 rounded-xl border border-slate-700/50">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-700 flex items-center justify-center text-white font-black text-base shrink-0 shadow-sm">
                    {detectedStudent.nama ? detectedStudent.nama.charAt(0).toUpperCase() : 'S'}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-black text-sm text-white truncate">{detectedStudent.nama}</p>
                    <p className="text-[11px] text-slate-300">
                      Kelas: <strong className="text-emerald-400 font-extrabold">{getClassNameForSiswa(detectedStudent)}</strong>
                    </p>
                    <p className="text-[10px] text-slate-400">
                      NIS: {detectedStudent.nis || '-'} • NISN: {detectedStudent.nisn || '-'}
                    </p>
                  </div>
                </div>

                {/* Status Options */}
                <div className="space-y-1.5">
                  <label className="block text-[11px] font-bold text-slate-300">Pilih Status Presensi:</label>
                  <div className="grid grid-cols-3 gap-1.5 text-xs">
                    {(['Hadir', 'Terlambat', 'Sakit', 'Izin', 'Alfa'] as const).map(st => {
                      const isActive = selectedStatus === st;
                      let activeStyle = 'bg-emerald-600 text-white border-emerald-500';
                      if (st === 'Terlambat') activeStyle = 'bg-amber-600 text-white border-amber-500';
                      if (st === 'Sakit') activeStyle = 'bg-sky-600 text-white border-sky-500';
                      if (st === 'Izin') activeStyle = 'bg-indigo-600 text-white border-indigo-500';
                      if (st === 'Alfa') activeStyle = 'bg-rose-600 text-white border-rose-500';

                      return (
                        <button
                          key={st}
                          type="button"
                          onClick={() => setSelectedStatus(st)}
                          className={`py-2 px-2 rounded-xl text-center font-bold text-xs border transition cursor-pointer ${
                            isActive 
                              ? activeStyle 
                              : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                          }`}
                        >
                          {st}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Custom Note */}
                <div className="space-y-1">
                  <label className="block text-[11px] font-bold text-slate-300">Catatan / Keterangan (Opsional):</label>
                  <input
                    type="text"
                    value={customNote}
                    onChange={(e) => setCustomNote(e.target.value)}
                    placeholder={selectedStatus === 'Terlambat' ? 'Cth: Terlambat 15 menit' : 'Cth: Presensi gerbang piket pagi'}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                {/* Submit & Cancel Buttons */}
                <div className="flex items-center gap-2 pt-1">
                  <button
                    type="button"
                    disabled={isSaving}
                    onClick={async () => {
                      const success = await recordAttendance(detectedStudent, selectedStatus, customNote);
                      if (success) {
                        setDetectedStudent(null);
                        setIsScanning(true);
                      }
                    }}
                    className="flex-1 py-2.5 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-slate-950 font-black rounded-xl text-xs transition cursor-pointer flex items-center justify-center gap-1.5 shadow-md"
                  >
                    <CheckCircle2 size={15} />
                    <span>{isSaving ? 'Menyimpan...' : 'Simpan Presensi'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setDetectedStudent(null);
                      setIsScanning(true);
                    }}
                    className="px-3 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-xl text-xs transition cursor-pointer"
                  >
                    Batal
                  </button>
                </div>
              </div>
            ) : (
              /* Session Scan History List */
              <div className="space-y-3 flex flex-col h-full">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <div className="flex items-center gap-1.5">
                    <UserCheck size={16} className="text-emerald-400" />
                    <h4 className="font-extrabold text-xs text-white">
                      Riwayat Pindai Sesi Ini
                    </h4>
                  </div>
                  <span className="px-2.5 py-0.5 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-full text-[10px] font-black">
                    {sessionHistory.length} Siswa Terpindai
                  </span>
                </div>

                {sessionHistory.length === 0 ? (
                  <div className="py-12 text-center text-slate-500 space-y-2 flex-1 flex flex-col items-center justify-center">
                    <Clock size={28} className="text-slate-600" />
                    <p className="text-xs font-semibold text-slate-400">Belum ada siswa yang dipindai pada sesi ini.</p>
                    <p className="text-[10px] text-slate-500 max-w-xs leading-relaxed">
                      Arahkan QR Code Kartu Pelajar siswa ke kamera. Sistem akan otomatis mencatat presensi secara instan.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2 max-h-72 lg:max-h-96 overflow-y-auto pr-1">
                    {sessionHistory.map((item, idx) => (
                      <div
                        key={item.id}
                        className="bg-slate-800/70 border border-slate-700/60 rounded-xl p-2.5 flex items-center justify-between gap-2.5 text-xs hover:border-slate-600 transition"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <span className="w-5 h-5 rounded-full bg-slate-700 text-slate-300 flex items-center justify-center text-[10px] font-bold shrink-0">
                            {sessionHistory.length - idx}
                          </span>
                          <div className="min-w-0">
                            <p className="font-bold text-white text-xs truncate">{item.siswa.nama}</p>
                            <p className="text-[10px] text-slate-400 truncate">
                              {item.namaKelas} • {item.timestamp} WIB
                            </p>
                          </div>
                        </div>

                        <span className={`px-2 py-0.5 rounded-md text-[10px] font-extrabold shrink-0 ${
                          item.status === 'Hadir' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
                          item.status === 'Terlambat' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' :
                          item.status === 'Sakit' ? 'bg-sky-500/20 text-sky-300 border border-sky-500/30' :
                          item.status === 'Izin' ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30' :
                          'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                        }`}>
                          {item.status}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                {sessionHistory.length > 0 && (
                  <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
                    <span>Semua data presensi tersimpan permanen.</span>
                    <button
                      type="button"
                      onClick={() => setSessionHistory([])}
                      className="text-slate-400 hover:text-rose-400 text-[10px] font-semibold underline cursor-pointer"
                    >
                      Bersihkan Riwayat Sesi
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Footer Info & Instructions */}
        <div className="p-3 sm:px-6 bg-slate-950 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-slate-400">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>PANDA BK17 • Sistem Presensi Cepat Guru Piket & Rekapitulasi</span>
          </div>
          <div className="flex items-center gap-3">
            <span>UPTD SMPN 17 Kota Tangerang Selatan</span>
          </div>
        </div>

        {/* Dedicated Troubleshooting Modal */}
        {showTroubleshootModal && (
          <div className="fixed inset-0 z-60 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-150">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-lg p-5 sm:p-6 text-white space-y-4 shadow-2xl overflow-y-auto max-h-[90vh]">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
                    <ShieldAlert size={20} />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-sm sm:text-base text-white">Panduan Mengaktifkan Izin Kamera</h4>
                    <p className="text-[11px] text-slate-400">Petunjuk resmi membuka blokir izin kamera di browser</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowTroubleshootModal(false)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Platform Selector Tabs */}
              <div className="grid grid-cols-3 gap-1.5 text-xs">
                <button
                  type="button"
                  onClick={() => setGuidePlatform('desktop')}
                  className={`py-2 px-2 rounded-lg font-bold flex items-center justify-center gap-1.5 transition cursor-pointer text-[11px] border ${
                    guidePlatform === 'desktop'
                      ? 'bg-emerald-600 text-white border-emerald-500'
                      : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-white'
                  }`}
                >
                  <Laptop size={13} />
                  <span>Laptop / PC</span>
                </button>

                <button
                  type="button"
                  onClick={() => setGuidePlatform('android')}
                  className={`py-2 px-2 rounded-lg font-bold flex items-center justify-center gap-1.5 transition cursor-pointer text-[11px] border ${
                    guidePlatform === 'android'
                      ? 'bg-emerald-600 text-white border-emerald-500'
                      : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-white'
                  }`}
                >
                  <Smartphone size={13} />
                  <span>Android</span>
                </button>

                <button
                  type="button"
                  onClick={() => setGuidePlatform('ios')}
                  className={`py-2 px-2 rounded-lg font-bold flex items-center justify-center gap-1.5 transition cursor-pointer text-[11px] border ${
                    guidePlatform === 'ios'
                      ? 'bg-emerald-600 text-white border-emerald-500'
                      : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-white'
                  }`}
                >
                  <Smartphone size={13} />
                  <span>iPhone / iPad</span>
                </button>
              </div>

              {/* Step list */}
              <div className="space-y-2.5 pt-1 text-xs">
                {BROWSER_GUIDES[guidePlatform].steps.map((st) => (
                  <div key={st.step} className="flex items-start gap-3 bg-slate-950/80 p-3 rounded-xl border border-slate-800">
                    <span className="w-5 h-5 rounded-full bg-emerald-500 text-slate-950 font-black flex items-center justify-center text-[10px] shrink-0 mt-0.5">
                      {st.step}
                    </span>
                    <div className="space-y-0.5">
                      <p className="font-extrabold text-white text-xs">{st.title}</p>
                      <p className="text-[11px] text-slate-300 leading-relaxed">{st.desc}</p>
                    </div>
                  </div>
                ))}

                {BROWSER_GUIDES[guidePlatform].tip && (
                  <div className="p-3 bg-emerald-950/40 border border-emerald-800/50 rounded-xl text-[11px] text-emerald-200 flex items-start gap-2">
                    <Info size={15} className="shrink-0 text-emerald-400 mt-0.5" />
                    <span>{BROWSER_GUIDES[guidePlatform].tip}</span>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => {
                    setShowTroubleshootModal(false);
                    startCamera();
                  }}
                  className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold rounded-xl text-xs transition cursor-pointer flex items-center gap-1.5"
                >
                  <RotateCcw size={14} /> Hubungkan Ulang Kamera
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
