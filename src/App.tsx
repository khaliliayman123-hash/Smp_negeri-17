/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Users, 
  GraduationCap, 
  MessageSquare, 
  AlertTriangle, 
  Settings, 
  LogOut, 
  User as UserIcon, 
  Menu, 
  X, 
  FileSpreadsheet, 
  Upload, 
  Sparkles,
  Link2,
  Database,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Bell,
  Trash
} from 'lucide-react';

// Sub views
import { DatabaseState, User, UserRole, Siswa, OrangTua, Kesehatan, Ekonomi, Psikologi, Sosial, Akademik, Konseling, Pelanggaran, RemisiPoin, Prestasi, Asesmen, HomeVisit, Surat, Dokumen, LaporanKejadian } from './types';
import { apiService, WALI_KELAS_USERS } from './services/api';
import DashboardView from './components/DashboardView';
import SiswaView from './components/SiswaView';
import WaliKelasView from './components/WaliKelasView';
import KonselingView from './components/KonselingView';
import DokumenSuratView from './components/DokumenSuratView';
import MasterLaporanView from './components/MasterLaporanView';

export default function App() {
  // Session States
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    try {
      const saved = localStorage.getItem('hds_current_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [selectedUsername, setSelectedUsername] = useState('gurubk');
  const [password, setPassword] = useState('');
  const [loginTab, setLoginTab] = useState<'admin' | 'siswa'>('admin');

  // Application Data States
  const [db, setDb] = useState<DatabaseState | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Toast notification state
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToast({ message, type });
    const duration = type === 'error' ? 12000 : 3000;
    setTimeout(() => {
      setToast(prev => prev && prev.message === message ? null : prev);
    }, duration);
  };

  // Navigations routing states
  const [activeMenu, setActiveMenu] = useState<'dashboard' | 'siswa' | 'walikelas' | 'layanan' | 'dokumen' | 'master' | 'pengaturan'>(() => {
    try {
      const saved = localStorage.getItem('hds_current_user');
      if (saved) {
        const u = JSON.parse(saved);
        if (u.role === UserRole.SISWA) {
          return 'siswa';
        }
        if (u.role === UserRole.WALI_KELAS) {
          return 'walikelas';
        }
      }
    } catch {}
    return 'dashboard';
  });
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  
  // High-fidelity deep link states to traverse panels
  const [deepLinkSiswaId, setDeepLinkSiswaId] = useState<string | undefined>(() => {
    try {
      const saved = localStorage.getItem('hds_current_user');
      if (saved) {
        const u = JSON.parse(saved);
        if (u.role === UserRole.SISWA) {
          return u.id;
        }
      }
    } catch {}
    return undefined;
  });
  const [deepLinkSubTab, setDeepLinkSubTab] = useState<string | undefined>(undefined);

  // Settings URL inputs
  const [gasUrlInput, setGasUrlInput] = useState('');
  const [spreadsheetIdInput, setSpreadsheetIdInput] = useState('');

  // Connection testing states
  const [connStatus, setConnStatus] = useState<'idle' | 'checking' | 'connected' | 'failed'>('idle');
  const [connMessage, setConnMessage] = useState('');
  const [connCode, setConnCode] = useState('');

  // Initial load
  useEffect(() => {
    loadDatabase();
  }, []);

  // Enforce Wali Kelas restricted view
  useEffect(() => {
    if (currentUser && currentUser.role === UserRole.WALI_KELAS && activeMenu !== 'walikelas') {
      setActiveMenu('walikelas');
    }
  }, [currentUser, activeMenu]);

  const loadDatabase = async (checkConnection: boolean = false, localOnly: boolean = false, forceRemote: boolean = false) => {
    // Optimization for fast startup: If not checking connection, not explicitly localOnly, and not forceRemote,
    // load cached database instantly to unblock the UI and fetch remote data in background (SWR pattern)
    if (!checkConnection && !localOnly && !forceRemote) {
      try {
        const localData = await apiService.getData(false, true); // true = local only (extremely fast)
        setDb(localData);
        setGasUrlInput(localData.config.gasApiUrl || '');
        setSpreadsheetIdInput(localData.config.spreadsheetId || '');
        setIsLoading(false); // Instantly enters the app!

        if (localData.config.gasApiUrl) {
          setConnStatus('checking');
          setConnMessage('Menghubungkan ke awan...');
          
          // Background fetch from Google Sheets
          apiService.getData(false, false).then((remoteData) => {
            setDb(remoteData);
            setConnStatus('connected');
            setConnMessage('Koneksi berhasil dan data terbaru telah disinkronkan!');
          }).catch((err) => {
            console.warn('Background sync failed, using cached local data:', err);
            setConnStatus('failed');
            setConnMessage('Gagal sinkronisasi data awan. Berjalan dalam mode lokal offline.');
          });
        } else {
          setConnStatus('idle');
        }
      } catch (e) {
        console.error('Failed to load initial local database', e);
        setIsLoading(false);
      }
      return;
    }

    setIsLoading(true);
    try {
      const data = await apiService.getData(forceRemote, localOnly);
      setDb(data);
      setGasUrlInput(data.config.gasApiUrl || '');
      setSpreadsheetIdInput(data.config.spreadsheetId || '');
      
      if (data.config.gasApiUrl) {
        if (checkConnection) {
          setConnStatus('checking');
          const res = await apiService.testConnection();
          if (res.success) {
            setConnStatus('connected');
            setConnMessage(res.message);
          } else {
            setConnStatus('failed');
            setConnMessage(res.message);
            setConnCode(res.code || '');
          }
        } else {
          // Optimization: If the last API call was successful, keep/set 'connected' status
          if (apiService.getLastFetchStatus()) {
            setConnStatus('connected');
            setConnMessage('Koneksi berhasil dan aktif!');
          } else {
            setConnStatus('failed');
            setConnMessage('Gagal memuat database dari awan.');
          }
        }
      } else {
        setConnStatus('idle');
      }
    } catch (e) {
      console.error('Failed to load database state', e);
    } finally {
      setIsLoading(false);
    }
  };

  // Auth logins handlers
  const handleLogin = async (username: string, pass?: string) => {
    setIsLoggingIn(true);
    setLoginError('');
    try {
      const res = await apiService.login(username, pass);
      if (res.success && res.user) {
        setCurrentUser(res.user);
        try {
          localStorage.setItem('hds_current_user', JSON.stringify(res.user));
        } catch (err) {
          console.error('Failed to persist user session', err);
        }
        setPassword(''); // Clear password field
        if (res.user.role === UserRole.SISWA) {
          setActiveMenu('siswa');
          setDeepLinkSiswaId(res.user.id);
        } else {
          setActiveMenu('dashboard');
          setDeepLinkSiswaId(undefined);
        }
      } else {
        setLoginError(res.message || 'Login gagal.');
      }
    } catch (e: any) {
      setLoginError(e.message || 'Koneksi gagal.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = () => {
    if (currentUser) {
      apiService.addLog(currentUser.id, currentUser.nama, currentUser.role, 'Logout', 'Sesi diakhiri secara tertib.');
    }
    setCurrentUser(null);
    try {
      localStorage.removeItem('hds_current_user');
    } catch (err) {
      console.error('Failed to clear user session', err);
    }
  };

  // Notification management count & handlers
  const unreadReportsCount = React.useMemo(() => {
    if (!db || !db.laporanKejadian) return 0;
    return db.laporanKejadian.filter(l => l.status === 'Belum Dibaca').length;
  }, [db]);

  const handleMarkAsRead = async (reportId: string) => {
    setDb(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        laporanKejadian: (prev.laporanKejadian || []).map(item => 
          item.id === reportId ? { ...item, status: 'Dibaca' as const } : item
        )
      };
    });
    try {
      await apiService.updateLaporanKejadianStatus(reportId, 'Dibaca');
      showToast('Laporan ditandai sudah dibaca', 'success');
    } catch {
      showToast('Gagal mengubah status laporan.', 'error');
    }
  };

  const handleDeleteReport = async (reportId: string) => {
    setDb(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        laporanKejadian: (prev.laporanKejadian || []).filter(item => item.id !== reportId)
      };
    });
    try {
      await apiService.deleteLaporanKejadian(reportId);
      showToast('Laporan berhasil dihapus', 'success');
    } catch {
      showToast('Gagal menghapus laporan.', 'error');
    }
  };

  // Deep Link Routing helper to go from Dashboard to Student Detail directly
  const handleNavigateToSiswa = (siswaId: string, subTab: string) => {
    setDeepLinkSiswaId(siswaId);
    setDeepLinkSubTab(subTab);
    setActiveMenu('siswa');
  };

  // Universal Save/Sync wrapper helper
  const handleSaveSiswa = async (
    siswa: Siswa,
    orangTua: OrangTua,
    kesehatan: Kesehatan,
    ekonomi: Ekonomi,
    psikologi: Psikologi,
    sosial: Sosial,
    akademik: Akademik,
    isNew: boolean,
    silent: boolean = false,
    localOnly: boolean = false
  ) => {
    // 1. Optimistically update local database state for instant UI update
    setDb(prev => {
      if (!prev) return prev;
      let newSiswa = [...prev.siswa];
      let newOrangTua = [...prev.orangTua];
      let newKesehatan = [...prev.kesehatan];
      let newEkonomi = [...prev.ekonomi];
      let newPsikologi = [...prev.psikologi];
      let newSosial = [...prev.sosial];
      let newAkademik = [...prev.akademik];

      if (isNew) {
        newSiswa.push(siswa);
        newOrangTua.push(orangTua);
        newKesehatan.push(kesehatan);
        newEkonomi.push(ekonomi);
        newPsikologi.push(psikologi);
        newSosial.push(sosial);
        newAkademik.push(akademik);
      } else {
        const updateOrInsert = <T extends { id: string }>(arr: T[], item: T): T[] => {
          return arr.some(x => x.id === item.id)
            ? arr.map(x => x.id === item.id ? { ...x, ...item } : x)
            : [...arr, item];
        };
        newSiswa = updateOrInsert(newSiswa, siswa);
        newOrangTua = updateOrInsert(newOrangTua, orangTua);
        newKesehatan = updateOrInsert(newKesehatan, kesehatan);
        newEkonomi = updateOrInsert(newEkonomi, ekonomi);
        newPsikologi = updateOrInsert(newPsikologi, psikologi);
        newSosial = updateOrInsert(newSosial, sosial);
        newAkademik = updateOrInsert(newAkademik, akademik);
      }

      return {
        ...prev,
        siswa: newSiswa,
        orangTua: newOrangTua,
        kesehatan: newKesehatan,
        ekonomi: newEkonomi,
        psikologi: newPsikologi,
        sosial: newSosial,
        akademik: newAkademik
      };
    });

    // 2. Save locally first (instantaneous)
    await apiService.saveSiswa(siswa, orangTua, kesehatan, ekonomi, psikologi, sosial, akademik, isNew, true);

    if (!silent) {
      showToast('Menyimpan paket data siswa secara lokal...', 'info');
    }

    // 3. Sync to remote Google Sheets in the background (asynchronously)
    if (!localOnly && apiService.getGasUrl()) {
      apiService.saveSiswa(siswa, orangTua, kesehatan, ekonomi, psikologi, sosial, akademik, isNew, false)
        .then(res => {
          if (res.success) {
            showToast('Sinkronisasi Google Sheets berhasil!', 'success');
          } else {
            showToast(`Gagal sinkron Google Sheets: ${res.message || 'Koneksi ditolak.'}`, 'error');
          }
        })
        .catch((err) => {
          showToast(`Koneksi Google Sheets terputus: ${err.message || 'Error tidak diketahui.'}. Tersimpan di database lokal.`, 'error');
        });
    } else {
      if (!silent) {
        showToast('Siswa berhasil disimpan ke database lokal.', 'success');
      }
    }

    return true;
  };

  const handleDeleteSiswa = async (id: string) => {
    // 1. Optimistically update local database state for instant UI update
    setDb(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        siswa: prev.siswa.filter(s => s.id !== id),
        orangTua: prev.orangTua.filter(o => o.id !== id),
        kesehatan: prev.kesehatan.filter(k => k.id !== id),
        ekonomi: prev.ekonomi.filter(e => e.id !== id),
        psikologi: prev.psikologi.filter(p => p.id !== id),
        sosial: prev.sosial.filter(s => s.id !== id),
        akademik: prev.akademik.filter(a => a.id !== id),
        prestasi: prev.prestasi.filter(p => p.siswaId !== id),
        pelanggaran: prev.pelanggaran.filter(p => p.siswaId !== id),
        konseling: prev.konseling.filter(c => c.siswaId !== id),
        asesmen: prev.asesmen.filter(a => a.siswaId !== id),
        homeVisit: prev.homeVisit.filter(h => h.siswaId !== id),
        surat: prev.surat.filter(s => s.siswaId !== id),
        dokumen: prev.dokumen.filter(d => d.siswaId !== id),
        catatanPerkembangan: prev.catatanPerkembangan.filter(c => c.siswaId !== id)
      };
    });

    showToast('Menghapus siswa...', 'info');

    // 2. Perform delete in background
    apiService.deleteSiswa(id)
      .then(res => {
         if (res.success) {
           showToast('Siswa berhasil dihapus secara online di Google Sheets.', 'success');
         } else {
           showToast('Gagal menghapus dari Google Sheets. Terhapus secara lokal.', 'error');
         }
      })
      .catch(() => {
         showToast('Koneksi terputus. Terhapus secara lokal.', 'error');
      });

    return true;
  };

  // GAS url updater
  const handleSaveGasUrl = async () => {
    if (!gasUrlInput.trim()) {
      apiService.setGasUrl('');
      apiService.setSpreadsheetId('');
      setConnStatus('idle');
      alert('Konfigurasi Google Apps Script dihapus. Aplikasi berjalan kembali dalam Mode Offline Fallback.');
      loadDatabase();
      return;
    }

    apiService.setGasUrl(gasUrlInput);
    apiService.setSpreadsheetId(spreadsheetIdInput);
    
    setConnStatus('checking');
    try {
      const res = await apiService.testConnection();
      if (res.success) {
        setConnStatus('connected');
        setConnMessage(res.message);
        alert('🎉 SANGAT AKURAT & BERHASIL!\n\nKoneksi ke Google Apps Script dan Google Spreadsheet berhasil diuji dan berjalan lancar! Sinkronisasi otomatis online kini aktif.');
      } else {
        setConnStatus('failed');
        setConnMessage(res.message);
        setConnCode(res.code || '');
        alert(`⚠️ PERINGATAN: Konfigurasi disimpan, tetapi GAGAL TERHUBUNG.\n\nDetail Error: ${res.message}\n\nAplikasi sementara berjalan dalam Offline Fallback Mode. Silakan periksa pengaturan Deployment di Google Apps Script Anda.`);
      }
    } catch (err: any) {
      setConnStatus('failed');
      setConnMessage(err.message || 'Error koneksi tidak diketahui.');
      setConnCode('UNKNOWN_ERROR');
      alert(`⚠️ ERROR KONEKSI: ${err.message || 'Gagal menghubungi server.'}`);
    }
    loadDatabase();
  };

  const handleUploadLocalData = async () => {
    if (!db) return;
    setIsLoading(true);
    try {
      const res = await apiService.uploadFullDatabase(db);
      if (res.success) {
        alert('Sukses! Seluruh data lokal Anda telah berhasil diunggah ke Google Sheets.');
      } else {
        alert('Gagal mengunggah data: ' + res.message);
      }
    } catch (e: any) {
      alert('Error saat mengunggah: ' + e.toString());
    } finally {
      setIsLoading(false);
    }
  };

  const handleForceDownloadData = async () => {
    setIsLoading(true);
    try {
      const localUrl = apiService.getGasUrl();
      if (!localUrl) {
        alert('URL Google Apps Script belum disetel.');
        return;
      }
      const res = await apiService.getData(true);
      setDb(res);
      alert('Sukses! Data terbaru berhasil diambil dari Google Sheets dan disimpan di browser Anda.');
    } catch (e: any) {
      alert('Gagal mengambil data: ' + e.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading && !db) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-xs text-slate-400">
        <Sparkles size={48} className="text-emerald-600 animate-spin mb-4" />
        <p className="font-bold text-slate-700 text-sm">Menyiapkan Himpunan Data Siswa...</p>
        <p className="mt-1">Melakukan inisialisasi modul database lokal sekolah</p>
      </div>
    );
  }

  // A. AUTHENTICATION / LOGIN SCREEN
  if (!currentUser) {
    return (
      <div id="login-layout-wrapper" className="min-h-screen bg-slate-50 flex items-center justify-center p-4 relative overflow-hidden font-sans">
        {/* Abstract organic decoration shapes */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-100 rounded-full blur-3xl opacity-60 -translate-y-12 translate-x-12" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-indigo-100 rounded-full blur-3xl opacity-60 translate-y-12 -translate-x-12" />

        {/* Card Frame with glassmorphism styling */}
        <div id="login-card" className="bg-white/80 backdrop-blur-md w-full max-w-md p-8 rounded-2xl border border-slate-100 shadow-xl relative z-10 space-y-6">
          <div className="text-center space-y-2">
            <div className="w-16 h-16 bg-gradient-to-tr from-emerald-600 to-teal-700 text-white rounded-2xl flex items-center justify-center mx-auto shadow-md">
              <GraduationCap size={36} />
            </div>
            <h1 className="text-base md:text-lg font-extrabold text-slate-800 tracking-tight leading-snug uppercase">
              Sistem Himpunan Data Siswa (HDS)
            </h1>
            <h2 className="text-xs md:text-sm font-bold text-emerald-600 tracking-wide uppercase leading-normal">
              UPTD SMPN 17 KOTA TANGERANG SELATAN
            </h2>
            <p className="text-[11px] text-slate-400 max-w-[320px] mx-auto leading-relaxed">
              Portal Layanan Bimbingan Konseling dan Rekam Akademik UPTD SMPN 17 KOTA TANGERANG SELATAN.
            </p>
          </div>

          {/* Navigation Tabs for Admin & Siswa */}
          <div className="flex bg-slate-100 p-1 rounded-xl">
            <button
              onClick={() => { setLoginTab('admin'); setSelectedUsername('sulaiman'); setPassword(''); setLoginError(''); }}
              className={`flex-1 py-2.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                loginTab === 'admin' 
                  ? 'bg-white text-slate-800 shadow-xs' 
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Portal Staf & Admin
            </button>
            <button
              onClick={() => { setLoginTab('siswa'); setSelectedUsername(''); setPassword(''); setLoginError(''); }}
              className={`flex-1 py-2.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                loginTab === 'siswa' 
                  ? 'bg-white text-slate-800 shadow-xs' 
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Portal Siswa (HDS)
            </button>
          </div>

          {loginTab === 'admin' ? (
            <div className="space-y-4">
              <div className="space-y-2">
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block text-center">
                  PILIH AKUN STAF
                </span>
                <div className="grid grid-cols-3 gap-2 text-[10px] font-semibold">
                  <button 
                    type="button"
                    onClick={() => { setSelectedUsername('admin'); setLoginError(''); }}
                    className={`p-2 rounded-xl border transition flex flex-col items-center justify-center gap-1 cursor-pointer ${
                      selectedUsername === 'admin'
                        ? 'bg-emerald-50 border-emerald-500 text-emerald-700 shadow-sm font-bold'
                        : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    <Sparkles size={12} className={selectedUsername === 'admin' ? 'text-emerald-600' : 'text-slate-400'} /> Admin
                  </button>
                  <button 
                    type="button"
                    onClick={() => { setSelectedUsername('sulaiman'); setLoginError(''); }}
                    className={`p-2 rounded-xl border transition flex flex-col items-center justify-center gap-1 cursor-pointer ${
                      ['sulaiman', 'aulia', 'dwi', 'kholfi', 'novita', 'gurubk', 'jamilah'].includes(selectedUsername.toLowerCase())
                        ? 'bg-emerald-50 border-emerald-500 text-emerald-700 shadow-sm font-bold'
                        : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    <Sparkles size={12} className={['sulaiman', 'aulia', 'dwi', 'kholfi', 'novita', 'gurubk', 'jamilah'].includes(selectedUsername.toLowerCase()) ? 'text-emerald-600' : 'text-slate-400'} /> Guru BK
                  </button>
                  <div className="relative">
                    <select
                      value={db?.users.some(u => u.username === selectedUsername && u.role === UserRole.WALI_KELAS) ? selectedUsername : ""}
                      onChange={(e) => { 
                        if (e.target.value) {
                          setSelectedUsername(e.target.value); 
                          setLoginError(''); 
                        }
                      }}
                      className={`w-full p-2 h-full rounded-xl border transition text-[10px] font-semibold text-center cursor-pointer appearance-none bg-white ${
                        db?.users.some(u => u.username === selectedUsername && u.role === UserRole.WALI_KELAS)
                          ? 'bg-emerald-50 border-emerald-500 text-emerald-700 shadow-sm font-bold'
                          : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                      }`}
                      style={{ textAlignLast: 'center' }}
                    >
                      <option value="" disabled hidden>Wali Kelas ▼</option>
                      {(db?.users || WALI_KELAS_USERS)
                        .filter(u => u.role === UserRole.WALI_KELAS)
                        .map(u => (
                          <option key={u.id} value={u.username}>
                            {u.nama}
                          </option>
                        ))
                      }
                    </select>
                  </div>
                </div>
              </div>

              {/* Specific User Dropdown for Guru BK */}
              {['sulaiman', 'aulia', 'dwi', 'kholfi', 'novita', 'gurubk', 'jamilah'].includes(selectedUsername.toLowerCase()) && (
                <div className="space-y-1.5 text-xs">
                  <label className="block font-semibold text-slate-600">Pilih Nama Guru BK</label>
                  <select
                    value={['sulaiman', 'aulia', 'dwi', 'kholfi', 'novita'].includes(selectedUsername.toLowerCase()) ? selectedUsername : 'sulaiman'}
                    onChange={(e) => { setSelectedUsername(e.target.value); setLoginError(''); }}
                    className="p-2.5 bg-white border border-slate-200 rounded-xl w-full text-xs focus:outline-none focus:border-emerald-500 font-medium"
                  >
                    <option value="sulaiman">Sulaiman, S.Psi (sulaiman)</option>
                    <option value="aulia">Aulia Rohmah, S.Pd,.MM (aulia)</option>
                    <option value="dwi">Dwi Susanti, S.Pd (dwi)</option>
                    <option value="kholfi">Kholfi Aulia, S.Pd (kholfi)</option>
                    <option value="novita">Novita Kusuma Wardhani, S.Pd (novita)</option>
                  </select>
                </div>
              )}

              {/* Selected Wali Kelas Confirmation Banner */}
              {db?.users.some(u => u.username === selectedUsername && u.role === UserRole.WALI_KELAS) && (
                <div className="p-3 bg-emerald-50 border border-emerald-100 rounded-xl text-xs text-emerald-800 font-medium">
                  Wali Kelas Terpilih: <strong className="font-bold">{(db?.users || WALI_KELAS_USERS).find(u => u.username === selectedUsername)?.nama}</strong>
                </div>
              )}

              <div className="space-y-1.5 text-xs">
                <label className="block font-semibold text-slate-600">Password</label>
                <input 
                  type="password"
                  placeholder="Masukkan password staf..."
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="p-2.5 bg-white border border-slate-200 rounded-xl w-full text-xs focus:outline-none focus:border-emerald-500 font-medium"
                />
              </div>

              <button 
                onClick={() => handleLogin(selectedUsername, password)}
                disabled={isLoggingIn || !password}
                className="w-full py-2.5 bg-slate-800 hover:bg-slate-900 text-white rounded-xl font-bold transition disabled:opacity-50 text-xs cursor-pointer shadow-md"
              >
                {isLoggingIn ? 'Memproses...' : 'Masuk Sistem'}
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="space-y-1.5 text-xs">
                <label className="block font-semibold text-slate-600">Nama Lengkap / NIS / NISN</label>
                <input 
                  type="text"
                  placeholder="Masukkan nama lengkap, NIS, atau NISN siswa..."
                  value={selectedUsername}
                  onChange={(e) => { setSelectedUsername(e.target.value); setLoginError(''); }}
                  className="p-2.5 bg-white border border-slate-200 rounded-xl w-full text-xs focus:outline-none focus:border-emerald-500 font-medium"
                />
              </div>

              <div className="space-y-1.5 text-xs">
                <label className="block font-semibold text-slate-600">Password / Verifikasi (Nama Lengkap / NIS / NISN)</label>
                <input 
                  type="password"
                  placeholder="Masukkan nama lengkap, NIS, atau NISN sebagai verifikasi..."
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="p-2.5 bg-white border border-slate-200 rounded-xl w-full text-xs focus:outline-none focus:border-emerald-500 font-medium"
                />
                <p className="text-[9px] text-slate-400 mt-1">
                  *Gunakan kombinasi identitas siswa (<strong>Nama Lengkap</strong>, <strong>NIS</strong>, atau <strong>NISN</strong>) pada kedua input di atas untuk masuk.
                </p>
              </div>

              <button 
                onClick={() => handleLogin(selectedUsername, password)}
                disabled={isLoggingIn || !selectedUsername || !password}
                className="w-full py-2.5 bg-slate-800 hover:bg-slate-900 text-white rounded-xl font-bold transition disabled:opacity-50 text-xs cursor-pointer shadow-md"
              >
                {isLoggingIn ? 'Memproses...' : 'Masuk Sistem'}
              </button>
            </div>
          )}

          {loginError && (
            <div className="p-2.5 bg-rose-50 border border-rose-100 text-rose-700 text-center rounded-xl font-bold text-[11px] animate-pulse">
              {loginError}
            </div>
          )}
        </div>
      </div>
    );
  }

  // B. MAIN APPLICATION LAYOUT (AFTER LOGIN SUCCESS)
  return (
    <div id="app-layout" className="min-h-screen bg-slate-50 flex flex-col md:flex-row font-sans">
      
      {/* 1. SIDEBAR (DESKTOP) */}
      <aside id="sidebar-panel" className="hidden md:flex flex-col justify-between w-64 bg-slate-900 text-slate-300 p-5 border-r border-slate-800 flex-shrink-0">
        <div className="space-y-6">
          {/* App title */}
          <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
            <div className="w-10 h-10 bg-gradient-to-tr from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center text-white shadow-md">
              <GraduationCap size={22} />
            </div>
            <div>
              <h2 className="font-bold text-xs text-white uppercase tracking-wider">Sistem HDS BK</h2>
              <p className="text-[10px] text-slate-400">UPTD SMPN 17 Kota Tangerang Selatan</p>
            </div>
          </div>

          {/* Nav links */}
          <nav className="flex flex-col gap-1 text-xs font-semibold">
            {currentUser.role === UserRole.SISWA ? (
              <button 
                onClick={() => { setActiveMenu('siswa'); }}
                className={`p-3 rounded-xl text-left flex items-center gap-3 transition cursor-pointer ${activeMenu === 'siswa' ? 'bg-emerald-600 text-white font-bold' : 'hover:bg-slate-800 hover:text-white'}`}
              >
                <BookOpen size={16} /> Profil Saya (HDS)
              </button>
            ) : currentUser.role === UserRole.WALI_KELAS ? (
              <button 
                onClick={() => { setActiveMenu('walikelas'); setDeepLinkSiswaId(undefined); }}
                className={`p-3 rounded-xl text-left flex items-center gap-3 transition cursor-pointer ${activeMenu === 'walikelas' ? 'bg-emerald-600 text-white font-bold' : 'hover:bg-slate-800 hover:text-white'}`}
              >
                <GraduationCap size={16} /> Ruang Wali Kelas
              </button>
            ) : (
              <>
                <button 
                  onClick={() => { setActiveMenu('dashboard'); setDeepLinkSiswaId(undefined); }}
                  className={`p-3 rounded-xl text-left flex items-center gap-3 transition cursor-pointer ${activeMenu === 'dashboard' ? 'bg-emerald-600 text-white font-bold' : 'hover:bg-slate-800 hover:text-white'}`}
                >
                  <Users size={16} /> Dashboard Evaluasi
                </button>
                <button 
                  onClick={() => { setActiveMenu('siswa'); setDeepLinkSiswaId(undefined); }}
                  className={`p-3 rounded-xl text-left flex items-center gap-3 transition cursor-pointer ${activeMenu === 'siswa' ? 'bg-emerald-600 text-white font-bold' : 'hover:bg-slate-800 hover:text-white'}`}
                >
                  <BookOpen size={16} /> Direktori Siswa (HDS)
                </button>
                <button 
                  onClick={() => { setActiveMenu('walikelas'); setDeepLinkSiswaId(undefined); }}
                  className={`p-3 rounded-xl text-left flex items-center gap-3 transition cursor-pointer ${activeMenu === 'walikelas' ? 'bg-emerald-600 text-white font-bold' : 'hover:bg-slate-800 hover:text-white'}`}
                >
                  <GraduationCap size={16} /> Ruang Wali Kelas
                </button>
                <button 
                  onClick={() => { setActiveMenu('layanan'); }}
                  className={`p-3 rounded-xl text-left flex items-center gap-3 transition cursor-pointer ${activeMenu === 'layanan' ? 'bg-emerald-600 text-white font-bold' : 'hover:bg-slate-800 hover:text-white'}`}
                >
                  <MessageSquare size={16} /> Layanan BK & Disiplin
                </button>
                <button 
                  onClick={() => { setActiveMenu('dokumen'); }}
                  className={`p-3 rounded-xl text-left flex items-center gap-3 transition cursor-pointer ${activeMenu === 'dokumen' ? 'bg-emerald-600 text-white font-bold' : 'hover:bg-slate-800 hover:text-white'}`}
                >
                  <Upload size={16} /> Arsip & Surat Resmi
                </button>
                <button 
                  onClick={() => { setActiveMenu('master'); }}
                  className={`p-3 rounded-xl text-left flex items-center gap-3 transition cursor-pointer ${activeMenu === 'master' ? 'bg-emerald-600 text-white font-bold' : 'hover:bg-slate-800 hover:text-white'}`}
                >
                  <FileSpreadsheet size={16} /> Pelaporan & Master
                </button>
                <button 
                  onClick={() => { setActiveMenu('pengaturan'); }}
                  className={`p-3 rounded-xl text-left flex items-center gap-3 transition cursor-pointer ${activeMenu === 'pengaturan' ? 'bg-emerald-600 text-white font-bold' : 'hover:bg-slate-800 hover:text-white'}`}
                >
                  <Settings size={16} /> Koneksi Google Sheets
                </button>
              </>
            )}
          </nav>
        </div>

        {/* User profile section */}
        <div className="border-t border-slate-800 pt-4 flex flex-col gap-1.5 text-xs">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-full flex items-center justify-center shrink-0">
              <UserIcon size={16} />
            </div>
            <div className="truncate">
              <p className="font-bold text-white text-xs truncate">{currentUser.nama}</p>
              <p className="text-[10px] text-slate-400 truncate">{currentUser.role}</p>
            </div>
          </div>
          <p className="text-[9px] text-emerald-500/60 font-semibold px-0.5 tracking-wider uppercase">Sesi Aktif</p>
        </div>
      </aside>

      {/* 2. MOBILE HEADER & NAVIGATION */}
      <div id="mobile-navbar" className="md:hidden bg-slate-900 text-slate-200 p-4 flex items-center justify-between relative z-20">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center text-white font-bold">
            <GraduationCap size={18} />
          </div>
          <span className="font-bold text-xs uppercase tracking-wider">HDS BK</span>
        </div>
        
        <div className="flex items-center gap-2">
          {/* Mobile Bell Icon */}
          {currentUser && (currentUser.role === UserRole.ADMIN || currentUser.role === UserRole.GURU_BK) && (
            <div className="relative">
              <button 
                onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                className="p-1.5 text-slate-300 hover:text-white rounded-lg transition relative cursor-pointer"
              >
                <Bell size={18} className={unreadReportsCount > 0 ? "text-rose-500 animate-pulse" : ""} />
                {unreadReportsCount > 0 && (
                  <>
                    <span className="absolute top-1 right-1 w-2 h-2 bg-rose-500 rounded-full"></span>
                    <span className="absolute top-1 right-1 w-2 h-2 bg-rose-500 rounded-full animate-ping"></span>
                  </>
                )}
              </button>
              
              {/* Mobile Notifications Dropdown */}
              {isNotificationsOpen && (
                <div className="absolute right-0 mt-3 w-72 sm:w-80 bg-white text-slate-800 border border-slate-200 rounded-2xl shadow-xl z-50 overflow-hidden text-xs">
                  <div className="bg-slate-50 px-3.5 py-2.5 border-b border-slate-200 flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-slate-800">📋 Laporan Wali Kelas</span>
                      {unreadReportsCount > 0 && (
                        <span className="bg-rose-100 text-rose-700 font-extrabold px-1.5 py-0.5 rounded-full text-[9px]">
                          {unreadReportsCount} Baru
                        </span>
                      )}
                    </div>
                    <button 
                      onClick={() => setIsNotificationsOpen(false)}
                      className="text-slate-400 hover:text-slate-600 cursor-pointer"
                    >
                      <X size={12} />
                    </button>
                  </div>
                  
                  <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                    {!db?.laporanKejadian || db.laporanKejadian.length === 0 ? (
                      <div className="p-6 text-center text-slate-400 italic">
                        Belum ada laporan kejadian.
                      </div>
                    ) : (
                      [...db.laporanKejadian]
                        .sort((a, b) => new Date(b.timestamp || b.tanggal).getTime() - new Date(a.timestamp || a.tanggal).getTime())
                        .map((report) => {
                          const student = db?.siswa.find(s => s.id === report.siswaId);
                          return (
                            <div 
                              key={report.id} 
                              className={`p-3 transition hover:bg-slate-50/50 ${
                                report.status === 'Belum Dibaca' ? 'bg-indigo-50/25' : ''
                              }`}
                            >
                              <div className="flex justify-between items-start gap-2">
                                <div className="space-y-1">
                                  <div className="flex items-center gap-1">
                                    {report.status === 'Belum Dibaca' && (
                                      <span className="w-1.5 h-1.5 bg-rose-500 rounded-full shrink-0"></span>
                                    )}
                                    <span className="font-bold text-slate-800 text-[11px] truncate max-w-[120px] block">
                                      {student?.nama || 'Siswa Dihapus'}
                                    </span>
                                    <span className="text-[9px] bg-indigo-50 text-indigo-700 px-1 py-0.2 rounded-md font-bold">
                                      {db?.kelas.find(k => k.id === report.kelasId)?.namaKelas || report.kelasId}
                                    </span>
                                  </div>
                                  <p className="text-slate-600 text-[10px] leading-relaxed">
                                    {report.laporan}
                                  </p>
                                  <div className="flex flex-col text-[9px] text-slate-400">
                                    <span>Wali Kelas: {report.waliKelasNama}</span>
                                    <span>{report.tanggal}</span>
                                  </div>
                                </div>
                                
                                <div className="flex items-center gap-0.5">
                                  {report.status === 'Belum Dibaca' && (
                                    <button
                                      onClick={() => handleMarkAsRead(report.id)}
                                      className="p-1 text-emerald-600 hover:bg-emerald-50 rounded"
                                    >
                                      <CheckCircle2 size={12} />
                                    </button>
                                  )}
                                  <button
                                    onClick={() => handleDeleteReport(report.id)}
                                    className="p-1 text-rose-500 hover:bg-rose-50 rounded"
                                  >
                                    <Trash size={12} />
                                  </button>
                                </div>
                              </div>
                            </div>
                          );
                        })
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
          
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-1">
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Mobile menu panel */}
        {mobileMenuOpen && (
          <div className="absolute top-full left-0 right-0 bg-slate-900 border-b border-slate-800 p-4 flex flex-col gap-2 text-xs font-semibold">
            {currentUser.role === UserRole.SISWA ? (
              <button onClick={() => { setActiveMenu('siswa'); setMobileMenuOpen(false); }} className="p-2.5 rounded-lg text-left hover:bg-slate-800">Profil Saya (HDS)</button>
            ) : currentUser.role === UserRole.WALI_KELAS ? (
              <button onClick={() => { setActiveMenu('walikelas'); setMobileMenuOpen(false); }} className="p-2.5 rounded-lg text-left hover:bg-slate-800">Ruang Wali Kelas</button>
            ) : (
              <>
                <button onClick={() => { setActiveMenu('dashboard'); setMobileMenuOpen(false); }} className="p-2.5 rounded-lg text-left hover:bg-slate-800">Dashboard Evaluasi</button>
                <button onClick={() => { setActiveMenu('siswa'); setMobileMenuOpen(false); }} className="p-2.5 rounded-lg text-left hover:bg-slate-800">Direktori Siswa (HDS)</button>
                <button onClick={() => { setActiveMenu('walikelas'); setMobileMenuOpen(false); }} className="p-2.5 rounded-lg text-left hover:bg-slate-800">Ruang Wali Kelas</button>
                <button onClick={() => { setActiveMenu('layanan'); setMobileMenuOpen(false); }} className="p-2.5 rounded-lg text-left hover:bg-slate-800">Layanan BK & Disiplin</button>
                <button onClick={() => { setActiveMenu('dokumen'); setMobileMenuOpen(false); }} className="p-2.5 rounded-lg text-left hover:bg-slate-800">Arsip & Surat Resmi</button>
                <button onClick={() => { setActiveMenu('master'); setMobileMenuOpen(false); }} className="p-2.5 rounded-lg text-left hover:bg-slate-800">Pelaporan & Master</button>
                <button onClick={() => { setActiveMenu('pengaturan'); setMobileMenuOpen(false); }} className="p-2.5 rounded-lg text-left hover:bg-slate-800">Koneksi Google Sheets</button>
              </>
            )}
            <button onClick={handleLogout} className="p-2.5 text-rose-400 hover:bg-slate-800 rounded-lg text-left mt-2 border-t border-slate-800 font-bold">Keluar Sistem</button>
          </div>
        )}
      </div>

      {/* 3. MAIN WORKSPACE */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Desktop Top Header Bar containing the Log Out button in the top right */}
        <header className="hidden md:flex items-center justify-between bg-white border-b border-slate-200 px-8 py-3.5 shrink-0 shadow-xs">
          <div>
            <h1 className="text-xs font-semibold text-slate-500">
              Selamat datang kembali, <span className="text-slate-800 font-bold">{currentUser.nama}</span>
            </h1>
            <p className="text-[10px] text-slate-400 font-medium">Sistem Informasi HDS Bimbingan Konseling UPTD SMPN 17 Kota Tangerang Selatan</p>
          </div>
          
          <div className="flex items-center gap-4">
            {/* Desktop Notification Bell */}
            {currentUser && (currentUser.role === UserRole.ADMIN || currentUser.role === UserRole.GURU_BK) && (
              <div className="relative">
                <button 
                  onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                  className="p-2 text-slate-500 hover:text-indigo-600 hover:bg-slate-50 rounded-xl transition cursor-pointer relative"
                  title="Notifikasi Laporan Wali Kelas"
                >
                  <Bell size={20} className={unreadReportsCount > 0 ? "text-rose-500 animate-pulse animate-bounce" : ""} />
                  {unreadReportsCount > 0 && (
                    <>
                      <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full"></span>
                      <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full animate-ping"></span>
                    </>
                  )}
                </button>
                
                {/* Desktop Notifications Dropdown */}
                {isNotificationsOpen && (
                  <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white text-slate-800 border border-slate-200 rounded-2xl shadow-xl z-50 overflow-hidden text-xs">
                    <div className="bg-slate-50 px-4 py-3 border-b border-slate-200 flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-slate-800 text-xs">📋 Laporan Kejadian Wali Kelas</span>
                        {unreadReportsCount > 0 && (
                          <span className="bg-rose-100 text-rose-700 font-extrabold px-2 py-0.5 rounded-full text-[10px]">
                            {unreadReportsCount} Baru
                          </span>
                        )}
                      </div>
                      <button 
                        onClick={() => setIsNotificationsOpen(false)}
                        className="text-slate-400 hover:text-slate-600 cursor-pointer"
                      >
                        <X size={14} />
                      </button>
                    </div>
                    
                    <div className="max-h-96 overflow-y-auto divide-y divide-slate-100">
                      {!db?.laporanKejadian || db.laporanKejadian.length === 0 ? (
                        <div className="p-8 text-center text-slate-400 italic">
                          Belum ada laporan kejadian yang masuk.
                        </div>
                      ) : (
                        [...db.laporanKejadian]
                          .sort((a, b) => new Date(b.timestamp || b.tanggal).getTime() - new Date(a.timestamp || a.tanggal).getTime())
                          .map((report) => {
                            const student = db?.siswa.find(s => s.id === report.siswaId);
                            return (
                              <div 
                                key={report.id} 
                                className={`p-3.5 transition hover:bg-slate-50/50 ${
                                  report.status === 'Belum Dibaca' ? 'bg-indigo-50/20' : ''
                                }`}
                              >
                                <div className="flex justify-between items-start gap-2">
                                  <div className="space-y-1">
                                    <div className="flex items-center gap-1.5">
                                      {report.status === 'Belum Dibaca' && (
                                        <span className="w-2 h-2 bg-rose-500 rounded-full shrink-0 animate-pulse"></span>
                                      )}
                                      <span className="font-extrabold text-slate-800 text-xs">
                                        {student?.nama || 'Siswa Dihapus'}
                                      </span>
                                      <span className="text-[10px] bg-indigo-50 text-indigo-700 px-1.5 py-0.5 rounded-md font-bold">
                                        {db?.kelas.find(k => k.id === report.kelasId)?.namaKelas || report.kelasId}
                                      </span>
                                    </div>
                                    <p className="text-slate-600 text-[11px] leading-relaxed">
                                      {report.laporan}
                                    </p>
                                    <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[10px] text-slate-400 font-medium">
                                      <span>Wali Kelas: <strong className="text-slate-500">{report.waliKelasNama}</strong></span>
                                      <span>•</span>
                                      <span>{report.tanggal}</span>
                                    </div>
                                  </div>
                                  
                                  <div className="flex items-center gap-1 shrink-0">
                                    {report.status === 'Belum Dibaca' && (
                                      <button
                                        onClick={() => handleMarkAsRead(report.id)}
                                        className="p-1 hover:bg-emerald-50 text-emerald-600 rounded-lg transition cursor-pointer"
                                        title="Tandai Sudah Dibaca"
                                      >
                                        <CheckCircle2 size={14} />
                                      </button>
                                    )}
                                    <button
                                      onClick={() => handleDeleteReport(report.id)}
                                      className="p-1 hover:bg-rose-50 text-rose-500 rounded-lg transition cursor-pointer"
                                      title="Hapus Laporan"
                                    >
                                      <Trash size={14} />
                                    </button>
                                  </div>
                                </div>
                              </div>
                            );
                          })
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            <div className="flex items-center gap-2.5 text-xs border-r border-slate-200 pr-4">
              <div className="w-8 h-8 bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 rounded-full flex items-center justify-center shrink-0">
                <UserIcon size={14} />
              </div>
              <div className="text-left">
                <p className="font-bold text-slate-800 leading-tight">{currentUser.nama}</p>
                <p className="text-[9px] text-slate-500 font-medium leading-none mt-0.5">{currentUser.role}</p>
              </div>
            </div>
            
            <button 
              onClick={handleLogout}
              className="px-3.5 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 text-xs font-bold rounded-xl transition flex items-center gap-1.5 cursor-pointer border border-rose-100 shadow-sm"
            >
              <LogOut size={13} /> Keluar Sistem
            </button>
          </div>
        </header>

        <main id="main-content-panel" className="flex-1 p-4 md:p-8 overflow-y-auto max-w-7xl mx-auto w-full">
        {/* Dynamic content rendering based on activeMenu */}
        
        {/* VIEW 1: DASHBOARD */}
        {activeMenu === 'dashboard' && (
          <DashboardView 
            db={db} 
            currentUser={currentUser} 
            onNavigateToSiswa={handleNavigateToSiswa} 
          />
        )}

        {/* VIEW 2: SISWA (HDS) */}
        {activeMenu === 'siswa' && (
          <SiswaView 
            db={db} 
            currentUser={currentUser} 
            onSaveSiswa={handleSaveSiswa}
            onDeleteSiswa={handleDeleteSiswa}
            onSavePrestasi={async (p, isNew) => {
              setDb(prev => {
                if (!prev) return prev;
                const list = isNew 
                  ? [...prev.prestasi, p] 
                  : prev.prestasi.map(item => item.id === p.id ? { ...item, ...p } : item);
                return { ...prev, prestasi: list };
              });
              apiService.savePrestasi(p, isNew).then(res => {
                showToast(res.message, res.success ? 'success' : 'error');
              }).catch(() => {
                showToast('Gagal menyimpan data Prestasi.', 'error');
              });
              return true;
            }}
            onDeletePrestasi={async (id) => {
              setDb(prev => {
                if (!prev) return prev;
                return { ...prev, prestasi: prev.prestasi.filter(item => item.id !== id) };
              });
              apiService.deletePrestasi(id).then(res => {
                showToast(res.message, res.success ? 'success' : 'error');
              }).catch(() => {
                showToast('Gagal menghapus data Prestasi.', 'error');
              });
              return true;
            }}
            onRefresh={async () => {
              await loadDatabase(false, false, true);
            }}
            preSelectedSiswaId={deepLinkSiswaId}
            preSelectedSubTab={deepLinkSubTab}
            onSaveSurat={async (s, isNew) => {
              setDb(prev => {
                if (!prev) return prev;
                const list = isNew 
                  ? [...prev.surat, s] 
                  : prev.surat.map(item => item.id === s.id ? { ...item, ...s } : item);
                return { ...prev, surat: list };
              });
              apiService.saveSurat(s, isNew).then(res => {
                showToast(res.message, res.success ? 'success' : 'error');
              }).catch(() => {
                showToast('Gagal menyimpan dokumen surat.', 'error');
              });
              return true;
            }}
            onDeleteSurat={async (id) => {
              setDb(prev => {
                if (!prev) return prev;
                return { ...prev, surat: prev.surat.filter(item => item.id !== id) };
              });
              apiService.deleteSurat(id).then(res => {
                showToast(res.message, res.success ? 'success' : 'error');
              }).catch(() => {
                showToast('Gagal menghapus dokumen surat.', 'error');
              });
              return true;
            }}
          />
        )}

        {/* VIEW 2.5: WALI KELAS */}
        {activeMenu === 'walikelas' && (
          <WaliKelasView 
            db={db}
            currentUser={currentUser}
            onNavigateToSiswa={handleNavigateToSiswa}
            onSaveLaporanKejadian={async (l, isNew) => {
              setDb(prev => {
                if (!prev) return prev;
                const list = isNew 
                  ? [...(prev.laporanKejadian || []), l] 
                  : (prev.laporanKejadian || []).map(item => item.id === l.id ? l : item);
                return { ...prev, laporanKejadian: list };
              });
              try {
                const res = await apiService.saveLaporanKejadian(l, isNew);
                showToast(res.message, res.success ? 'success' : 'error');
                return res.success;
              } catch {
                showToast('Gagal mengirim laporan kejadian.', 'error');
                return false;
              }
            }}
            onDeleteLaporanKejadian={async (id) => {
              setDb(prev => {
                if (!prev) return prev;
                return {
                  ...prev,
                  laporanKejadian: (prev.laporanKejadian || []).filter(item => item.id !== id)
                };
              });
              try {
                const res = await apiService.deleteLaporanKejadian(id);
                showToast(res.message, res.success ? 'success' : 'error');
                return res.success;
              } catch {
                showToast('Gagal menghapus laporan kejadian.', 'error');
                return false;
              }
            }}
          />
        )}

        {/* VIEW 3: LAYANAN & DISIPLIN */}
        {activeMenu === 'layanan' && (
          <KonselingView 
            db={db}
            currentUser={currentUser}
            onSaveKonseling={async (k, isNew) => {
              setDb(prev => {
                if (!prev) return prev;
                const list = isNew 
                  ? [...prev.konseling, k] 
                  : prev.konseling.map(item => item.id === k.id ? k : item);
                return { ...prev, konseling: list };
              });
              apiService.saveKonseling(k, isNew).then(res => {
                showToast(res.message, res.success ? 'success' : 'error');
              }).catch(() => {
                showToast('Gagal menyimpan data Konseling.', 'error');
              });
              return true;
            }}
            onDeleteKonseling={async (id) => {
              setDb(prev => {
                if (!prev) return prev;
                return { ...prev, konseling: prev.konseling.filter(item => item.id !== id) };
              });
              apiService.deleteKonseling(id).then(res => {
                showToast(res.message, res.success ? 'success' : 'error');
              }).catch(() => {
                showToast('Gagal menghapus data Konseling.', 'error');
              });
              return true;
            }}
            onSavePelanggaran={async (p, isNew) => {
              setDb(prev => {
                if (!prev) return prev;
                const list = isNew 
                  ? [...prev.pelanggaran, p] 
                  : prev.pelanggaran.map(item => item.id === p.id ? p : item);
                return { ...prev, pelanggaran: list };
              });
              apiService.savePelanggaran(p, isNew).then(res => {
                showToast(res.message, res.success ? 'success' : 'error');
              }).catch(() => {
                showToast('Gagal menyimpan data Pelanggaran.', 'error');
              });
              return true;
            }}
            onDeletePelanggaran={async (id) => {
              setDb(prev => {
                if (!prev) return prev;
                return { ...prev, pelanggaran: prev.pelanggaran.filter(item => item.id !== id) };
              });
              apiService.deletePelanggaran(id).then(res => {
                showToast(res.message, res.success ? 'success' : 'error');
              }).catch(() => {
                showToast('Gagal menghapus data Pelanggaran.', 'error');
              });
              return true;
            }}
            onSaveRemisiPoin={async (r, isNew) => {
              setDb(prev => {
                if (!prev) return prev;
                const list = isNew 
                  ? [...prev.remisiPoin, r] 
                  : prev.remisiPoin.map(item => item.id === r.id ? r : item);
                return { ...prev, remisiPoin: list };
              });
              apiService.saveRemisiPoin(r, isNew).then(res => {
                showToast(res.message, res.success ? 'success' : 'error');
              }).catch(() => {
                showToast('Gagal menyimpan data Remisi Poin.', 'error');
              });
              return true;
            }}
            onDeleteRemisiPoin={async (id) => {
              setDb(prev => {
                if (!prev) return prev;
                return { ...prev, remisiPoin: prev.remisiPoin.filter(item => item.id !== id) };
              });
              apiService.deleteRemisiPoin(id).then(res => {
                showToast(res.message, res.success ? 'success' : 'error');
              }).catch(() => {
                showToast('Gagal menghapus data Remisi Poin.', 'error');
              });
              return true;
            }}
            onSavePrestasi={async (p, isNew) => {
              setDb(prev => {
                if (!prev) return prev;
                const list = isNew 
                  ? [...prev.prestasi, p] 
                  : prev.prestasi.map(item => item.id === p.id ? p : item);
                return { ...prev, prestasi: list };
              });
              apiService.savePrestasi(p, isNew).then(res => {
                showToast(res.message, res.success ? 'success' : 'error');
              }).catch(() => {
                showToast('Gagal menyimpan data Prestasi.', 'error');
              });
              return true;
            }}
            onDeletePrestasi={async (id) => {
              setDb(prev => {
                if (!prev) return prev;
                return { ...prev, prestasi: prev.prestasi.filter(item => item.id !== id) };
              });
              apiService.deletePrestasi(id).then(res => {
                showToast(res.message, res.success ? 'success' : 'error');
              }).catch(() => {
                showToast('Gagal menghapus data Prestasi.', 'error');
              });
              return true;
            }}
            onSaveAsesmen={async (a, isNew) => {
              setDb(prev => {
                if (!prev) return prev;
                const list = isNew 
                  ? [...prev.asesmen, a] 
                  : prev.asesmen.map(item => item.id === a.id ? a : item);
                return { ...prev, asesmen: list };
              });
              apiService.saveAsesmen(a, isNew).then(res => {
                showToast(res.message, res.success ? 'success' : 'error');
              }).catch(() => {
                showToast('Gagal menyimpan data Asesmen.', 'error');
              });
              return true;
            }}
            onDeleteAsesmen={async (id) => {
              setDb(prev => {
                if (!prev) return prev;
                return { ...prev, asesmen: prev.asesmen.filter(item => item.id !== id) };
              });
              apiService.deleteAsesmen(id).then(res => {
                showToast(res.message, res.success ? 'success' : 'error');
              }).catch(() => {
                showToast('Gagal menghapus data Asesmen.', 'error');
              });
              return true;
            }}
            onSaveHomeVisit={async (h, isNew) => {
              setDb(prev => {
                if (!prev) return prev;
                const list = isNew 
                  ? [...prev.homeVisit, h] 
                  : prev.homeVisit.map(item => item.id === h.id ? h : item);
                return { ...prev, homeVisit: list };
              });
              apiService.saveHomeVisit(h, isNew).then(res => {
                showToast(res.message, res.success ? 'success' : 'error');
              }).catch(() => {
                showToast('Gagal menyimpan data Kunjungan Rumah.', 'error');
              });
              return true;
            }}
            onDeleteHomeVisit={async (id) => {
              setDb(prev => {
                if (!prev) return prev;
                return { ...prev, homeVisit: prev.homeVisit.filter(item => item.id !== id) };
              });
              apiService.deleteHomeVisit(id).then(res => {
                showToast(res.message, res.success ? 'success' : 'error');
              }).catch(() => {
                showToast('Gagal menghapus data Kunjungan Rumah.', 'error');
              });
              return true;
            }}
            onSaveKehadiran={async (k, isNew) => {
              setDb(prev => {
                if (!prev) return prev;
                const list = isNew 
                  ? [...(prev.kehadiran || []), k] 
                  : (prev.kehadiran || []).map(item => item.id === k.id ? k : item);
                return { ...prev, kehadiran: list };
              });
              apiService.saveKehadiran(k, isNew).then(res => {
                showToast(res.message, res.success ? 'success' : 'error');
              }).catch(() => {
                showToast('Gagal menyimpan data Kehadiran.', 'error');
              });
              return true;
            }}
            onDeleteKehadiran={async (id) => {
              setDb(prev => {
                if (!prev) return prev;
                return { ...prev, kehadiran: (prev.kehadiran || []).filter(item => item.id !== id) };
              });
              apiService.deleteKehadiran(id).then(res => {
                showToast(res.message, res.success ? 'success' : 'error');
              }).catch(() => {
                showToast('Gagal menghapus data Kehadiran.', 'error');
              });
              return true;
            }}
          />
        )}

        {/* VIEW 4: DOKUMEN & SURAT GENERATOR */}
        {activeMenu === 'dokumen' && (
          <DokumenSuratView 
            db={db}
            currentUser={currentUser}
            onSaveSurat={async (s, isNew) => {
              setDb(prev => {
                if (!prev) return prev;
                const list = isNew 
                  ? [...prev.surat, s] 
                  : prev.surat.map(item => item.id === s.id ? s : item);
                return { ...prev, surat: list };
              });
              apiService.saveSurat(s, isNew).then(res => {
                showToast(res.message, res.success ? 'success' : 'error');
              }).catch(() => {
                showToast('Gagal menyimpan dokumen surat.', 'error');
              });
              return true;
            }}
            onDeleteSurat={async (id) => {
              setDb(prev => {
                if (!prev) return prev;
                return { ...prev, surat: prev.surat.filter(item => item.id !== id) };
              });
              apiService.deleteSurat(id).then(res => {
                showToast(res.message, res.success ? 'success' : 'error');
              }).catch(() => {
                showToast('Gagal menghapus dokumen surat.', 'error');
              });
              return true;
            }}
            onSaveDokumen={async (d, isNew) => {
              setDb(prev => {
                if (!prev) return prev;
                const list = isNew 
                  ? [...prev.dokumen, d] 
                  : prev.dokumen.map(item => item.id === d.id ? d : item);
                return { ...prev, dokumen: list };
              });
              apiService.saveDokumen(d, isNew).then(res => {
                showToast(res.message, res.success ? 'success' : 'error');
              }).catch(() => {
                showToast('Gagal mendaftarkan dokumen.', 'error');
              });
              return true;
            }}
            onDeleteDokumen={async (id) => {
              setDb(prev => {
                if (!prev) return prev;
                return { ...prev, dokumen: prev.dokumen.filter(item => item.id !== id) };
              });
              apiService.deleteDokumen(id).then(res => {
                showToast(res.message, res.success ? 'success' : 'error');
              }).catch(() => {
                showToast('Gagal menghapus dokumen.', 'error');
              });
              return true;
            }}
          />
        )}

        {/* VIEW 5: REPORTS & MASTER DATA CONFIG */}
        {activeMenu === 'master' && (
          <MasterLaporanView 
            db={db}
            currentUser={currentUser}
            onSaveTP={async (tp, isNew) => {
              setDb(prev => {
                if (!prev) return prev;
                let list = [...prev.tahunPelajaran];
                if (tp.isActive) {
                  list = list.map(item => ({ ...item, isActive: false }));
                }
                if (isNew) {
                  list.push(tp);
                } else {
                  list = list.map(item => item.id === tp.id ? { ...item, ...tp } : item);
                }
                return { ...prev, tahunPelajaran: list };
              });
              apiService.saveTahunPelajaran(tp, isNew).then(res => {
                showToast(res.message, res.success ? 'success' : 'error');
              }).catch(() => {
                showToast('Gagal menyimpan data Tahun Pelajaran.', 'error');
              });
              return true;
            }}
            onDeleteTP={async (id) => {
              setDb(prev => {
                if (!prev) return prev;
                return { ...prev, tahunPelajaran: prev.tahunPelajaran.filter(item => item.id !== id) };
              });
              apiService.deleteTahunPelajaran(id).then(res => {
                showToast(res.message, res.success ? 'success' : 'error');
              }).catch(() => {
                showToast('Gagal menghapus data Tahun Pelajaran.', 'error');
              });
              return true;
            }}
            onSaveKelas={async (kl, isNew) => {
              setDb(prev => {
                if (!prev) return prev;
                const list = isNew 
                  ? [...prev.kelas, kl] 
                  : prev.kelas.map(item => item.id === kl.id ? { ...item, ...kl } : item);
                return { ...prev, kelas: list };
              });
              apiService.saveKelas(kl, isNew).then(res => {
                showToast(res.message, res.success ? 'success' : 'error');
              }).catch(() => {
                showToast('Gagal menyimpan data Kelas.', 'error');
              });
              return true;
            }}
            onDeleteKelas={async (id) => {
              setDb(prev => {
                if (!prev) return prev;
                return { ...prev, kelas: prev.kelas.filter(item => item.id !== id) };
              });
              apiService.deleteKelas(id).then(res => {
                showToast(res.message, res.success ? 'success' : 'error');
              }).catch(() => {
                showToast('Gagal menghapus data Kelas.', 'error');
              });
              return true;
            }}

            onSaveUser={async (u, isNew) => {
              setDb(prev => {
                if (!prev) return prev;
                const list = isNew 
                  ? [...prev.users, u] 
                  : prev.users.map(item => item.id === u.id ? { ...item, ...u } : item);
                return { ...prev, users: list };
              });
              apiService.saveUser(u, isNew).then(res => {
                showToast(res.message, res.success ? 'success' : 'error');
              }).catch(() => {
                showToast('Gagal menyimpan data Pengguna.', 'error');
              });
              return true;
            }}
            onDeleteUser={async (id) => {
              setDb(prev => {
                if (!prev) return prev;
                return { ...prev, users: prev.users.filter(item => item.id !== id) };
              });
              apiService.deleteUser(id).then(res => {
                showToast(res.message, res.success ? 'success' : 'error');
              }).catch(() => {
                showToast('Gagal menghapus data Pengguna.', 'error');
              });
              return true;
            }}
          />
        )}

        {/* VIEW 6: GOOGLE SHEETS / GAS CONNECTION SETTINGS */}
        {activeMenu === 'pengaturan' && (
          <div className="space-y-6 text-xs">
            <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-4">
              <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
                <Link2 size={16} className="text-emerald-600" />
                Hubungkan Aplikasi dengan Google Sheets Anda (REST API)
              </h3>
              <p className="text-slate-500 leading-relaxed text-[11px]">
                Secara default, aplikasi menyimpan data secara lokal pada web browser Anda (<strong className="text-emerald-700">Offline Fallback Mode</strong>). Untuk menggunakan penyimpanan awan terintegrasi Google Spreadsheet, masukkan URL Google Apps Script Web App yang telah dideploy di bawah ini.
              </p>

              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    1. URL Web App Google Apps Script:
                  </label>
                  <input 
                    type="url" 
                    placeholder="https://script.google.com/macros/s/XXXXXX/exec" 
                    value={gasUrlInput}
                    onChange={(e) => setGasUrlInput(e.target.value)}
                    className={`p-3 bg-white border rounded-xl w-full text-xs font-mono transition-colors duration-200 ${
                      connStatus === 'connected' ? 'border-emerald-400 focus:ring-emerald-200' :
                      connStatus === 'failed' ? 'border-red-300 focus:ring-red-200' :
                      'border-slate-200 focus:ring-slate-100'
                    }`}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    2. URL / ID Google Spreadsheet Anda (Opsional):
                  </label>
                  <input 
                    type="text" 
                    placeholder="Contoh: https://docs.google.com/spreadsheets/d/XXXXXX/edit atau langsung ID-nya saja" 
                    value={spreadsheetIdInput}
                    onChange={(e) => setSpreadsheetIdInput(e.target.value)}
                    className={`p-3 bg-white border rounded-xl w-full text-xs font-mono transition-colors duration-200 ${
                      connStatus === 'connected' ? 'border-emerald-400 focus:ring-emerald-200' :
                      connStatus === 'failed' ? 'border-red-300 focus:ring-red-200' :
                      'border-slate-200 focus:ring-slate-100'
                    }`}
                  />
                  <p className="text-[10px] text-slate-400 mt-1">
                    Jika dikosongkan, Apps Script akan menggunakan spreadsheet aktif (jika bound script) atau SPREADSHEET_ID bawaan di Helper.gs.
                  </p>
                </div>
                <div className="flex justify-end pt-1 gap-2">
                  {gasUrlInput.trim() !== '' && (
                    <button 
                      onClick={async () => {
                        setConnStatus('checking');
                        const res = await apiService.testConnection();
                        if (res.success) {
                          setConnStatus('connected');
                          setConnMessage(res.message);
                        } else {
                          setConnStatus('failed');
                          setConnMessage(res.message);
                          setConnCode(res.code || '');
                        }
                      }}
                      disabled={connStatus === 'checking'}
                      className="px-4 py-2 bg-slate-100 hover:bg-slate-200 disabled:opacity-50 text-slate-700 font-bold rounded-xl flex items-center gap-1.5 cursor-pointer transition text-xs"
                    >
                      Uji Ulang Koneksi
                    </button>
                  )}
                  <button 
                    onClick={handleSaveGasUrl}
                    disabled={connStatus === 'checking'}
                    className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold rounded-xl flex items-center gap-1.5 cursor-pointer transition shadow-sm text-xs"
                  >
                    <CheckCircle2 size={14} /> Simpan & Sambungkan
                  </button>
                </div>
              </div>
              
              <div className="mt-4 border-t border-slate-100 pt-4 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-700 text-xs">Live Status Koneksi Google Sheets:</span>
                  {connStatus === 'checking' && (
                    <span className="px-3 py-1 bg-amber-50 text-amber-700 font-bold border border-amber-200 rounded-full flex items-center gap-1.5 animate-pulse text-[10px]">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-ping"></span>
                      Memverifikasi API...
                    </span>
                  )}
                  {connStatus === 'connected' && (
                    <span className="px-3 py-1 bg-emerald-50 text-emerald-700 font-bold border border-emerald-200 rounded-full flex items-center gap-1.5 text-[10px]">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                      Koneksi Aktif & Sinkron
                    </span>
                  )}
                  {connStatus === 'failed' && (
                    <span className="px-3 py-1 bg-red-50 text-red-700 font-bold border border-red-200 rounded-full flex items-center gap-1.5 text-[10px]">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
                      Koneksi Gagal
                    </span>
                  )}
                  {connStatus === 'idle' && (
                    <span className="px-3 py-1 bg-slate-50 text-slate-500 font-bold border border-slate-200 rounded-full flex items-center gap-1.5 text-[10px]">
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
                      Offline Fallback
                    </span>
                  )}
                </div>

                {/* Detail status / error panel */}
                {connStatus === 'connected' && (
                  <div className="p-3 bg-emerald-50/60 border border-emerald-100 rounded-xl space-y-1">
                    <p className="text-emerald-800 font-semibold flex items-center gap-1.5">
                      <CheckCircle2 size={14} className="text-emerald-600" />
                      Berhasil terhubung ke Google Apps Script Web App!
                    </p>
                    <p className="text-slate-500 text-[11px] leading-relaxed">
                      Respon Server: <code className="bg-emerald-100/80 text-emerald-900 px-1.5 py-0.5 rounded text-[10px] font-mono leading-none">{connMessage || 'Koneksi berhasil.'}</code>
                    </p>
                  </div>
                )}

                {connStatus === 'failed' && (
                  <div className="space-y-3">
                    <div className="p-3 bg-red-50/60 border border-red-100 rounded-xl space-y-1">
                      <p className="text-red-800 font-semibold flex items-center gap-1.5">
                        <AlertTriangle size={14} className="text-red-600" />
                        Gagal melakukan sinkronisasi dengan Google Sheets.
                      </p>
                      <p className="text-slate-600 text-[10px] leading-relaxed bg-white/70 p-2.5 rounded-lg border border-red-100 font-mono">
                        {connMessage}
                      </p>
                    </div>

                    {/* DIAGNOSTIC SOLUSI PANEL (SANGAT AKURAT) */}
                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/60 space-y-3">
                      <p className="font-bold text-slate-800 flex items-center gap-1 text-[11px]">
                        <Sparkles size={13} className="text-amber-500" />
                        PANDUAN SOLUSI DAN PENYELESAIAN MASALAH (SANGAT AKURAT):
                      </p>

                      {connCode === 'NETWORK_OR_CORS_ERROR' && (
                        <div className="space-y-2 text-[11px] text-slate-600 leading-relaxed">
                          <p className="text-amber-800 font-bold">👉 Masalah CORS / Hak Akses Web App (Paling Sering Terjadi)</p>
                          <p>Saat mendeploy di editor Google Apps Script, pastikan opsi berikut diatur secara tepat:</p>
                          <ol className="list-decimal pl-4 space-y-1">
                            <li>Klik tombol <strong className="text-slate-800">Deploy &gt; New deployment</strong>.</li>
                            <li>Ubah opsi <strong className="text-slate-800">Execute as (Jalankan sebagai)</strong> menjadi <strong className="text-emerald-700">Me (Surel Google Anda)</strong>.</li>
                            <li>Ubah opsi <strong className="text-slate-800">Who has access (Siapa yang memiliki akses)</strong> menjadi <strong className="text-emerald-700">Anyone (Siapa saja / Anonim)</strong>. *Jika Anda memilih 'Only myself' atau 'Anyone with Google Account', maka browser akan memblokir request karena alasan CORS.*</li>
                            <li>Klik <strong className="text-slate-800">Deploy</strong> dan setujui otorisasi akses Google. Salin URL baru yang muncul dan masukkan di atas.</li>
                          </ol>
                        </div>
                      )}

                      {connCode === 'NON_JSON_RESPONSE' && (
                        <div className="space-y-2 text-[11px] text-slate-600 leading-relaxed">
                          <p className="text-amber-800 font-bold">👉 Izin Otorisasi Belum Disetujui (Authorization Required)</p>
                          <p>Google meminta Anda untuk menyetujui izin akses data sebelum script dapat dieksekusi.</p>
                          <ol className="list-decimal pl-4 space-y-1">
                            <li>Buka editor Google Apps Script Anda.</li>
                            <li>Pada dropdown fungsi di bagian atas, pilih salah satu fungsi (misalnya <strong className="font-mono text-[10px]">getDatabaseSheets</strong> atau <strong className="font-mono text-[10px]">fetchFullDatabase</strong>) dan klik <strong className="text-slate-800">Run (Jalankan)</strong>.</li>
                            <li>Sebuah jendela pop-up otorisasi akan muncul. Klik <strong className="text-slate-800">Review Permissions</strong>, pilih akun Google Anda, klik <strong className="text-slate-800">Advanced</strong> di pojok bawah, lalu klik <strong className="text-slate-800">Go to Untitled project (unsafe)</strong> dan klik <strong className="text-slate-800">Allow</strong>.</li>
                            <li>Setelah selesai, lakukan deploy ulang (<strong className="text-slate-800">New deployment</strong>) dan ganti URL Anda di atas dengan URL yang baru.</li>
                          </ol>
                        </div>
                      )}

                      {connCode === 'INVALID_URL' && (
                        <div className="space-y-2 text-[11px] text-slate-600 leading-relaxed">
                          <p className="text-amber-800 font-bold">👉 Format URL Salah</p>
                          <p>Pastikan URL Anda diawali dengan <strong className="font-mono">https://script.google.com/macros/s/</strong> dan harus diakhiri dengan kata <strong className="text-emerald-700 font-mono">/exec</strong>.</p>
                        </div>
                      )}

                      {connCode === 'SERVER_FAIL' && (
                        <div className="space-y-2 text-[11px] text-slate-600 leading-relaxed">
                          <p className="text-amber-800 font-bold">👉 Spreadsheet ID Tidak Dapat Diakses</p>
                          <p>Google Apps Script berhasil dijalankan, tetapi gagal memuat Google Spreadsheet Anda.</p>
                          <ol className="list-decimal pl-4 space-y-1">
                            <li>Pastikan URL atau ID Google Spreadsheet yang Anda masukkan benar.</li>
                            <li>Pastikan akun Google yang Anda pilih pada langkah 'Execute as' memiliki hak akses sebagai Owner atau Editor terhadap Google Spreadsheet tersebut.</li>
                          </ol>
                        </div>
                      )}

                      {!['NETWORK_OR_CORS_ERROR', 'NON_JSON_RESPONSE', 'INVALID_URL', 'SERVER_FAIL'].includes(connCode) && (
                        <div className="space-y-2 text-[11px] text-slate-600 leading-relaxed">
                          <p className="text-slate-700 font-bold">👉 Langkah Pemecahan Umum:</p>
                          <p>1. Harap pastikan Anda telah menekan tombol "Deploy" &gt; "New deployment" pada editor Apps Script Anda (bukan sekedar menyimpan file).</p>
                          <p>2. Pastikan Anda menyalin URL Web App dari dialog sukses deployment, bukan URL editor Apps Script itu sendiri.</p>
                          <p>3. Jika baru saja mengubah kode, Anda wajib membuat deployment versi baru (pilih 'New version' atau 'New deployment').</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {connStatus === 'idle' && (
                  <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl">
                    <p className="text-slate-700 font-semibold flex items-center gap-1.5 text-[11px]">
                      <Database size={14} className="text-slate-500" />
                      Berjalan dalam Offline Fallback Mode (Data tersimpan di Browser ini)
                    </p>
                    <p className="text-slate-500 text-[10px] mt-1 leading-relaxed">
                      Aplikasi menyimpan seluruh data Anda secara aman di memori lokal browser. Anda dapat mendeploy Google Apps Script kapan saja untuk mengaktifkan sinkronisasi otomatis awan.
                    </p>
                  </div>
                )}
                
                {/* Sinkronisasi data manual utilities (hanya muncul jika ada URL dan koneksi bukan idle) */}
                {gasUrlInput.trim() !== '' && (
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/60 space-y-3 mt-3">
                    <p className="font-bold text-slate-700 text-[11px]">Utilitas Sinkronisasi Data Manual:</p>
                    <p className="text-slate-500 text-[10px] leading-relaxed">
                      Gunakan tombol di bawah untuk mengunggah paksa data lokal browser ke Spreadsheet Anda (mengisi sheet kosong baru) atau menarik ulang data Sheets ke browser.
                    </p>
                    
                    <div className="flex flex-col sm:flex-row gap-2 pt-1">
                      <button
                        onClick={handleUploadLocalData}
                        disabled={connStatus === 'checking'}
                        className="flex-1 p-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold rounded-xl flex items-center justify-center gap-1.5 cursor-pointer transition shadow-xs text-[11px]"
                      >
                        <Upload size={14} /> Unggah Data Lokal ke Google Sheets
                      </button>
                      
                      <button
                        onClick={handleForceDownloadData}
                        disabled={connStatus === 'checking'}
                        className="flex-1 p-3 bg-slate-700 hover:bg-slate-800 disabled:opacity-50 text-white font-bold rounded-xl flex items-center justify-center gap-1.5 cursor-pointer transition shadow-xs text-[11px]"
                      >
                        <Database size={14} /> Tarik Data dari Google Sheets
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Step-by-step Indonesian instructions manual */}
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4">
              <h4 className="font-bold text-slate-800 text-sm flex items-center gap-1.5">
                <Sparkles size={16} className="text-emerald-500" />
                Panduan Instalasi Lengkap Google Apps Script & Google Sheets
              </h4>

              <div className="space-y-4 text-slate-600 leading-relaxed">
                <div className="space-y-1">
                  <p className="font-bold text-slate-800">Langkah 1: Buat Google Spreadsheet Baru & Salin Linknya</p>
                  <p>Buat Google Spreadsheet kosong baru di Google Drive Anda. Beri nama bebas, misalnya <strong className="text-slate-800">"HDS BK Database"</strong>.</p>
                  <div className="text-emerald-700 font-bold bg-emerald-50 p-3 rounded-lg border border-emerald-100 mt-1">
                    ✨ FITUR AUTO-PROVISIONING: Anda TIDAK perlu membuat sheet (tabel) atau baris header secara manual! Cukup biarkan kosong. Salin URL Spreadsheet tersebut dari address bar browser Anda dan masukkan pada kolom input nomor 2 di atas. Sistem kami akan secara otomatis membuatkan 21 sheet beserta seluruh nama kolomnya secara akurat saat Anda melakukan sinkronisasi pertama kali!
                  </div>
                </div>

                <div className="space-y-1 border-t border-slate-100 pt-3">
                  <p className="font-bold text-slate-800">Langkah 2: Buka Editor Apps Script</p>
                  <p>Pada Google Spreadsheet Anda, klik menu <strong className="text-slate-800">Extensions (Ekstensi) &gt; Apps Script</strong>.</p>
                  <p>Hapus semua kode default dan buat file baru dengan nama-nama berikut sesuai di direktori proyek ini:</p>
                  <ul className="list-disc pl-5 space-y-1 font-mono text-[10px] text-emerald-700 font-bold">
                    <li>Code.gs</li>
                    <li>Auth.gs</li>
                    <li>Siswa.gs</li>
                    <li>Konseling.gs</li>
                    <li>Pelanggaran.gs</li>
                    <li>Prestasi.gs</li>
                    <li>Helper.gs</li>
                    <li>Validation.gs</li>
                  </ul>
                  <p>Copy-paste seluruh kode script dari masing-masing file yang ada di folder <strong className="font-mono text-slate-800">/google_apps_script/</strong> ke editor Google Apps Script tersebut.</p>
                </div>

                <div className="space-y-1 border-t border-slate-100 pt-3">
                  <p className="font-bold text-slate-800">Langkah 3: Deploy sebagai Web App</p>
                  <p>Di editor Apps Script, klik tombol <strong className="text-slate-800">Deploy (Terapkan) &gt; New Deployment (Penerapan Baru)</strong>.</p>
                  <p>Pilih jenis penerapan: <strong className="text-slate-800">Web App (Aplikasi Web)</strong>.</p>
                  <p>Konfigurasikan:</p>
                  <ul className="list-disc pl-5">
                    <li>Execute as (Jalankan sebagai): <strong className="text-slate-800">Me (Saya / Email Anda)</strong></li>
                    <li>Who has access (Siapa yang memiliki akses): <strong className="text-slate-800">Anyone (Siapa saja, bahkan anonim)</strong> <span className="text-rose-600 font-semibold">(Penting agar API dapat diakses dari luar)</span></li>
                  </ul>
                  <p>Klik Deploy. Berikan izin otorisasi akses Google Drive Anda.</p>
                  <p>Salin <strong className="text-slate-800 font-mono">Web App URL</strong> yang dihasilkan dan tempel pada input "Koneksi Google Sheets" di atas!</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
      </div>

      {/* Modern Floating Toast Notification */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-start gap-3 max-w-md px-4 py-3 bg-slate-900 text-white rounded-xl shadow-xl border border-slate-800 animate-bounce duration-300">
          <div className={`w-2.5 h-2.5 rounded-full shrink-0 mt-1.5 ${toast.type === 'success' ? 'bg-emerald-500' : toast.type === 'error' ? 'bg-rose-500' : 'bg-cyan-500'}`} />
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-slate-100 whitespace-pre-wrap leading-relaxed">{toast.message}</p>
          </div>
          <button 
            onClick={() => setToast(null)}
            className="text-slate-400 hover:text-white transition-colors cursor-pointer text-xs font-bold px-1 ml-1"
          >
            ×
          </button>
        </div>
      )}
    </div>
  );
}
