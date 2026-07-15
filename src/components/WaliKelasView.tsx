/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { 
  Users, 
  GraduationCap, 
  Search, 
  Award, 
  AlertTriangle, 
  Heart, 
  Activity, 
  FileText, 
  ChevronRight, 
  Info, 
  TrendingUp, 
  MapPin, 
  User as UserIcon,
  ShieldAlert,
  ChevronLeft,
  Calendar,
  X,
  Sparkles,
  Smile,
  AlertCircle,
  Lock,
  Send,
  Trash
} from 'lucide-react';
import { DatabaseState, User, UserRole, Siswa, OrangTua, Kesehatan, Ekonomi, Psikologi, Sosial, Akademik, Asesmen, LaporanKejadian } from '../types';

interface HdsDetailDrawerProps {
  siswa: Siswa;
  hds: {
    ortu?: OrangTua;
    kes?: Kesehatan;
    eko?: Ekonomi;
    psi?: Psikologi;
    sos?: Sosial;
    aka?: Akademik;
    ase?: Asesmen;
    points: number;
    counselingCount: number;
    achievementsCount: number;
  };
  onClose: () => void;
  getStudentClassName: (s: Siswa) => string;
}

function HdsDetailDrawer({ siswa, hds, onClose, getStudentClassName }: HdsDetailDrawerProps) {
  if (!siswa || !hds) return null;
  return (
    <div className="fixed inset-0 z-50 overflow-hidden" role="dialog" aria-modal="true">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity" onClick={onClose} />
        <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
          <div className="pointer-events-auto w-screen max-w-xl">
            <div className="flex h-full flex-col overflow-y-scroll bg-white shadow-2xl border-l border-slate-100">
              {/* Header */}
              <div className="bg-slate-900 px-5 py-6 text-white shrink-0 relative">
                <button onClick={onClose} className="absolute right-4 top-4 text-slate-400 hover:text-white transition p-1 bg-slate-800/50 rounded-lg">
                  <X size={18} />
                </button>
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 bg-emerald-500 text-white rounded-full flex items-center justify-center font-bold text-base shadow-sm">
                    {siswa.nama.charAt(0)}
                  </div>
                  <div>
                    <h2 className="text-sm font-bold tracking-tight">{siswa.nama}</h2>
                    <p className="text-[10px] text-slate-300 mt-0.5">
                      NIS: {siswa.nis} | NISN: {siswa.nisn} | {getStudentClassName(siswa)}
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t border-slate-800 text-center">
                  <div className="bg-slate-800/50 p-2 rounded-lg">
                    <p className="text-[9px] text-slate-400 uppercase tracking-wider font-semibold">Poin Disiplin</p>
                    <p className="text-sm font-bold text-amber-400 mt-0.5">{hds.points} pts</p>
                  </div>
                  <div className="bg-slate-800/50 p-2 rounded-lg">
                    <p className="text-[9px] text-slate-400 uppercase tracking-wider font-semibold">Konseling BK</p>
                    <p className="text-sm font-bold text-white mt-0.5">{hds.counselingCount} kali</p>
                  </div>
                  <div className="bg-slate-800/50 p-2 rounded-lg">
                    <p className="text-[9px] text-slate-400 uppercase tracking-wider font-semibold">Prestasi</p>
                    <p className="text-sm font-bold text-emerald-400 mt-0.5">{hds.achievementsCount} Log</p>
                  </div>
                </div>
              </div>

              {/* Scrollable Content */}
              <div className="flex-1 p-5 space-y-6 text-xs text-slate-700">
                {/* 1. INFORMASI UTAMA & BIODATA */}
                <div className="space-y-2.5">
                  <h3 className="font-bold text-slate-800 border-b border-slate-100 pb-1 flex items-center gap-1.5 text-[11px] uppercase tracking-wider">
                    <UserIcon size={13} className="text-slate-400" /> 1. INFORMASI UTAMA & BIODATA SISWA
                  </h3>
                  <div className="grid grid-cols-2 gap-3 bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <div>
                      <p className="text-[10px] text-slate-400 font-semibold">Tempat, Tanggal Lahir</p>
                      <p className="font-bold text-slate-700 mt-0.5">{siswa.tempatLahir}, {siswa.tanggalLahir}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-400 font-semibold">Jenis Kelamin</p>
                      <p className="font-bold text-slate-700 mt-0.5">{siswa.jenisKelamin}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-400 font-semibold">Agama</p>
                      <p className="font-bold text-slate-700 mt-0.5">{siswa.agama}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-400 font-semibold">No. HP / Kontak</p>
                      <p className="font-bold text-slate-700 mt-0.5">{siswa.nomorHp || '-'}</p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-[10px] text-slate-400 font-semibold">Email</p>
                      <p className="font-bold text-slate-700 mt-0.5 break-all">{siswa.email || '-'}</p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-[10px] text-slate-400 font-semibold">Alamat Lengkap</p>
                      <p className="font-bold text-slate-700 mt-0.5 leading-normal">
                        {siswa.alamat}, Desa {siswa.desa}, Kec. {siswa.kecamatan}, {siswa.kabupaten}, {siswa.provinsi}
                      </p>
                    </div>
                  </div>
                </div>

                {/* 2. DATA ORANG TUA / WALI */}
                <div className="space-y-2.5">
                  <h3 className="font-bold text-slate-800 border-b border-slate-100 pb-1 flex items-center gap-1.5 text-[11px] uppercase tracking-wider">
                    <Users size={13} className="text-slate-400" /> 2. DATA ORANG TUA / WALI
                  </h3>
                  {hds.ortu ? (
                    <div className="space-y-3">
                      <div className="grid grid-cols-2 gap-3 bg-slate-50 p-3 rounded-xl border border-slate-100">
                        <div className="col-span-2 border-b border-slate-200/50 pb-1.5">
                          <p className="text-[10px] font-bold text-slate-500">BIODATA AYAH</p>
                          <p className="font-bold text-slate-800 mt-1">{hds.ortu.namaAyah || '-'}</p>
                        </div>
                        <div>
                          <p className="text-[10px] text-slate-400 font-semibold">Pekerjaan Ayah</p>
                          <p className="font-bold text-slate-700 mt-0.5">{hds.ortu.pekerjaanAyah || '-'}</p>
                        </div>
                        <div>
                          <p className="text-[10px] text-slate-400 font-semibold">No. HP Ayah</p>
                          <p className="font-bold text-slate-700 mt-0.5">{hds.ortu.noHpAyah || '-'}</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-3 bg-slate-50 p-3 rounded-xl border border-slate-100">
                        <div className="col-span-2 border-b border-slate-200/50 pb-1.5">
                          <p className="text-[10px] font-bold text-slate-500">BIODATA IBU</p>
                          <p className="font-bold text-slate-800 mt-1">{hds.ortu.namaIbu || '-'}</p>
                        </div>
                        <div>
                          <p className="text-[10px] text-slate-400 font-semibold">Pekerjaan Ibu</p>
                          <p className="font-bold text-slate-700 mt-0.5">{hds.ortu.pekerjaanIbu || '-'}</p>
                        </div>
                        <div>
                          <p className="text-[10px] text-slate-400 font-semibold">No. HP Ibu</p>
                          <p className="font-bold text-slate-700 mt-0.5">{hds.ortu.noHpIbu || '-'}</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-3 bg-emerald-50/50 p-3 rounded-xl border border-emerald-100/50">
                        <div>
                          <p className="text-[10px] text-emerald-600/80 font-bold">Pendidikan Terakhir Ortu</p>
                          <p className="font-bold text-slate-700 mt-0.5">{hds.ortu.pendidikanOrangTua || '-'}</p>
                        </div>
                        <div>
                          <p className="text-[10px] text-emerald-600/80 font-bold">Penghasilan Bulanan</p>
                          <p className="font-bold text-slate-700 mt-0.5">{hds.ortu.penghasilan || '-'}</p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <p className="text-slate-400 italic text-center">Belum ada data orang tua/wali.</p>
                  )}
                </div>

                {/* 3. DATA KESEHATAN SISWA */}
                <div className="space-y-2.5">
                  <h3 className="font-bold text-slate-800 border-b border-slate-100 pb-1 flex items-center gap-1.5 text-[11px] uppercase tracking-wider">
                    <Activity size={13} className="text-slate-400" /> 3. DATA KESEHATAN SISWA
                  </h3>
                  {hds.kes ? (
                    <div className="grid grid-cols-3 gap-3 bg-slate-50 p-3 rounded-xl border border-slate-100">
                      <div>
                        <p className="text-[10px] text-slate-400 font-semibold">Tinggi Badan</p>
                        <p className="font-bold text-slate-700 mt-0.5">{hds.kes.tinggiBadan || '-'} cm</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-slate-400 font-semibold">Berat Badan</p>
                        <p className="font-bold text-slate-700 mt-0.5">{hds.kes.beratBadan || '-'} kg</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-slate-400 font-semibold">Golongan Darah</p>
                        <p className="font-bold text-slate-700 mt-0.5 uppercase">{hds.kes.golonganDarah || '-'}</p>
                      </div>
                      <div className="col-span-3">
                        <p className="text-[10px] text-slate-400 font-semibold">Riwayat Penyakit & Alergi</p>
                        <p className="font-bold text-slate-700 mt-0.5">
                          {hds.kes.penyakit || 'Tidak ada'} / {hds.kes.alergi || 'Tidak ada'}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <p className="text-slate-400 italic text-center">Belum ada data kesehatan.</p>
                  )}
                </div>

                {/* 4. DATA EKONOMI KELUARGA */}
                <div className="space-y-2.5">
                  <h3 className="font-bold text-slate-800 border-b border-slate-100 pb-1 flex items-center gap-1.5 text-[11px] uppercase tracking-wider">
                    <TrendingUp size={13} className="text-slate-400" /> 4. DATA EKONOMI KELUARGA
                  </h3>
                  {hds.eko ? (
                    <div className="grid grid-cols-2 gap-3 bg-slate-50 p-3 rounded-xl border border-slate-100">
                      <div>
                        <p className="text-[10px] text-slate-400 font-semibold">Kepemilikan Rumah</p>
                        <p className="font-bold text-slate-700 mt-0.5">{hds.eko.statusRumah || '-'}</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-slate-400 font-semibold">Kendaraan Utama</p>
                        <p className="font-bold text-slate-700 mt-0.5">{hds.eko.kendaraan || '-'}</p>
                      </div>
                      <div className="col-span-2 pt-1">
                        <p className="text-[10px] text-slate-400 mb-1.5 font-semibold text-slate-500">Status Kepesertaan Bantuan</p>
                        <div className="flex gap-2">
                          <span className={`px-2 py-1 rounded-md text-[9px] font-bold border ${hds.eko.pip ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-slate-50 text-slate-400'}`}>
                            PIP: {hds.eko.pip ? 'Menerima' : 'Tidak'}
                          </span>
                          <span className={`px-2 py-1 rounded-md text-[9px] font-bold border ${hds.eko.pkh ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-slate-50 text-slate-400'}`}>
                            PKH: {hds.eko.pkh ? 'Menerima' : 'Tidak'}
                          </span>
                          <span className={`px-2 py-1 rounded-md text-[9px] font-bold border ${hds.eko.kip ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-slate-50 text-slate-400'}`}>
                            KIP: {hds.eko.kip ? 'Menerima' : 'Tidak'}
                          </span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <p className="text-slate-400 italic text-center">Belum ada data ekonomi keluarga.</p>
                  )}
                </div>

                {/* 5. DATA MINAT & PSIKOLOGIS */}
                <div className="space-y-2.5">
                  <h3 className="font-bold text-slate-800 border-b border-slate-100 pb-1 flex items-center gap-1.5 text-[11px] uppercase tracking-wider">
                    <Heart size={13} className="text-slate-400" /> 5. DATA MINAT & PSIKOLOGIS
                  </h3>
                  <div className="space-y-3">
                    {hds.psi ? (
                      <div className="grid grid-cols-2 gap-3 bg-slate-50 p-3 rounded-xl border border-slate-100">
                        <div>
                          <p className="text-[10px] text-slate-400 font-semibold">Gaya Belajar</p>
                          <p className="font-bold text-slate-700 mt-0.5">{hds.psi.gayaBelajar || '-'}</p>
                        </div>
                        <div>
                          <p className="text-[10px] text-slate-400 font-semibold">Cita-Cita</p>
                          <p className="font-bold text-slate-700 mt-0.5">{hds.psi.citaCita || '-'}</p>
                        </div>
                        <div>
                          <p className="text-[10px] text-slate-400 font-semibold">Minat & Hobi</p>
                          <p className="font-bold text-slate-700 mt-0.5">{hds.psi.minat || '-'} / {hds.psi.hobi || '-'}</p>
                        </div>
                        <div>
                          <p className="text-[10px] text-slate-400 font-semibold">Bakat Dominan</p>
                          <p className="font-bold text-slate-700 mt-0.5">{hds.psi.bakat || '-'}</p>
                        </div>
                        <div className="col-span-2">
                          <p className="text-[10px] text-slate-400 font-semibold">Kepribadian & Hubungan Sosial</p>
                          <p className="font-bold text-slate-700 mt-0.5 leading-normal">
                            Kepribadian: {hds.psi.kepribadian || '-'} | Hubungan teman: {hds.sos?.hubunganTeman || '-'}. Organisasi: {hds.sos?.organisasi || '-'}.
                          </p>
                        </div>
                      </div>
                    ) : (
                      <p className="text-slate-400 italic text-center">Belum ada data psikologi.</p>
                    )}
                    {hds.ase && (
                      <div className="bg-indigo-50/50 border border-indigo-100/40 p-3 rounded-xl space-y-2">
                        <p className="text-[9px] font-bold text-indigo-700 uppercase tracking-wider">Hasil Asesmen BK / Instrumentasi</p>
                        <div className="grid grid-cols-2 gap-2 text-[11px]">
                          <div><span className="text-slate-400 font-mono">Skor IQ:</span> <strong className="text-slate-700">{hds.ase.iq || '-'}</strong></div>
                          <div><span className="text-slate-400 font-mono">DCM:</span> <strong className="text-slate-700">{hds.ase.dcm || '-'}</strong></div>
                          <div className="col-span-2"><span className="text-slate-400">AKPD:</span> <p className="font-semibold text-slate-700 mt-0.5 leading-relaxed">{hds.ase.akpd || '-'}</p></div>
                          <div className="col-span-2"><span className="text-slate-400">AUM:</span> <p className="font-semibold text-slate-700 mt-0.5 leading-relaxed">{hds.ase.aum || '-'}</p></div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* 6. NILAI AKADEMIS RAPOR */}
                <div className="space-y-2.5">
                  <h3 className="font-bold text-slate-800 border-b border-slate-100 pb-1 flex items-center gap-1.5 text-[11px] uppercase tracking-wider">
                    <FileText size={13} className="text-slate-400" /> 6. NILAI AKADEMIS RAPOR
                  </h3>
                  {hds.aka ? (
                    <div className="grid grid-cols-2 gap-3 bg-slate-50 p-3 rounded-xl border border-slate-100">
                      <div>
                        <p className="text-[10px] text-slate-400 font-semibold">Semester Aktif</p>
                        <p className="font-bold text-slate-700 mt-0.5">{hds.aka.semester || 'Semester Ganjil'}</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-slate-400 font-semibold">Rata-Rata Rapor</p>
                        <p className="font-extrabold text-indigo-700 mt-0.5 text-base font-mono">{hds.aka.rataRataRaport || '-'}</p>
                      </div>
                      <div className="col-span-2 pt-1">
                        <p className="text-[10px] text-slate-400 font-semibold">Catatan Wali Kelas</p>
                        <p className="font-semibold text-slate-600 mt-0.5 leading-normal italic bg-white p-2 rounded-lg border border-slate-100">
                          "{hds.aka.catatanWaliKelas || 'Belum ada catatan.'}"
                        </p>
                      </div>
                    </div>
                  ) : (
                    <p className="text-slate-400 italic text-center">Belum ada data nilai akademis rapor.</p>
                  )}
                </div>
              </div>

              {/* Footer Button */}
              <div className="bg-slate-50 px-5 py-4 border-t border-slate-200 shrink-0">
                <button onClick={onClose} className="px-4 py-2.5 bg-slate-950 hover:bg-slate-900 text-white font-extrabold rounded-xl transition cursor-pointer w-full text-center shadow-xs">
                  Tutup Detail HDS Siswa
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

interface WaliKelasViewProps {
  db: DatabaseState | null;
  currentUser: User;
  onNavigateToSiswa: (siswaId: string, subTab: string) => void;
  onSaveLaporanKejadian?: (l: LaporanKejadian, isNew: boolean) => Promise<boolean>;
  onDeleteLaporanKejadian?: (id: string) => Promise<boolean>;
}

type ClassLevel = '7' | '8' | '9';

export default function WaliKelasView({ db, currentUser, onNavigateToSiswa, onSaveLaporanKejadian, onDeleteLaporanKejadian }: WaliKelasViewProps) {
  // Allowed class lookup for each Wali Kelas
  const allowedClassName = useMemo(() => {
    if (currentUser.role !== UserRole.WALI_KELAS) return null;

    // Try dynamic lookup in database classes
    if (db && db.kelas) {
      const cls = db.kelas.find(k => k.waliKelasId === currentUser.id);
      if (cls) return cls.namaKelas;
    }

    const username = (currentUser.username || '').toLowerCase();
    
    // Map username to the assigned class
    const mapping: Record<string, string> = {
      // Old ones
      damianus: 'Kelas 7-1',
      albert: 'Kelas 7-2',
      novie: 'Kelas 7-3',
      ira: 'Kelas 7-4',
      yulia: 'Kelas 7-5',
      terra: 'Kelas 7-6',
      lidya: 'Kelas 7-7',
      sri: 'Kelas 8-1',
      farah: 'Kelas 8-2',
      eva: 'Kelas 8-3',
      nur: 'Kelas 9-5',
      selfi: 'Kelas 8-5',
      gerry: 'Kelas 8-6',
      ibnu: 'Kelas 8-7',
      nani: 'Kelas 9-1',
      ana: 'Kelas 9-2',
      monica: 'Kelas 9-3',
      indri: 'Kelas 9-4',
      wahyunis: 'Kelas 9-5',
      titin: 'Kelas 9-6',
      ifah: 'Kelas 9-7',

      // New 33 ones
      fay: 'Kelas 7-1',
      aida: 'Kelas 7-2',
      viika: 'Kelas 7-3',
      sribarnetti: 'Kelas 7-4',
      viny: 'Kelas 7-5',
      lia: 'Kelas 7-6',
      yanah: 'Kelas 7-7',
      srirahayu: 'Kelas 7-8',
      putri: 'Kelas 7-9',
      sari: 'Kelas 7-10',
      rifal: 'Kelas 7-11',

      neneng: 'Kelas 8-1',
      meli: 'Kelas 8-2',
      tiar: 'Kelas 8-3',
      joko: 'Kelas 8-4',
      danang: 'Kelas 8-5',
      annisa: 'Kelas 8-6',
      haifa: 'Kelas 8-7',
      santi: 'Kelas 8-8',
      reni: 'Kelas 8-9',
      dewi: 'Kelas 8-10',
      emi: 'Kelas 8-11',

      tere: 'Kelas 9-1',
      ferry: 'Kelas 9-2',
      sifah: 'Kelas 9-3',
      mia: 'Kelas 9-4',
      warsih: 'Kelas 9-6',
      tut: 'Kelas 9-7',
      kasrah: 'Kelas 9-8',
      habib: 'Kelas 9-9',
      pendi: 'Kelas 9-10',
      hadi: 'Kelas 9-11'
    };
    
    return mapping[username] || null;
  }, [currentUser, db]);

  // Determine allowed level tab
  const allowedClassLevel = useMemo(() => {
    if (!allowedClassName) return null;
    const match = allowedClassName.match(/\d+/);
    return match ? match[0] as ClassLevel : null;
  }, [allowedClassName]);

  // Level Tab state: '7', '8', '9'
  const [activeLevel, setActiveLevel] = useState<ClassLevel>(() => {
    if (currentUser.role === UserRole.WALI_KELAS) {
      const username = (currentUser.username || '').toLowerCase();
      const mapping: Record<string, string> = {
        // Old
        damianus: '7', albert: '7', novie: '7', ira: '7', yulia: '7', terra: '7', lidya: '7',
        sri: '8', farah: '8', eva: '8', selfi: '8', gerry: '8', ibnu: '8',
        nani: '9', ana: '9', monica: '9', indri: '9', wahyunis: '9', titin: '9', ifah: '9',

        // New
        fay: '7', aida: '7', viika: '7', sribarnetti: '7', viny: '7', lia: '7', yanah: '7', srirahayu: '7', putri: '7', sari: '7', rifal: '7',
        neneng: '8', meli: '8', tiar: '8', joko: '8', danang: '8', annisa: '8', haifa: '8', santi: '8', reni: '8', dewi: '8', emi: '8',
        tere: '9', ferry: '9', sifah: '9', mia: '9', nur: '9', warsih: '9', tut: '9', kasrah: '9', habib: '9', pendi: '9', hadi: '9'
      };
      const mappedVal = mapping[username];
      if (mappedVal) return mappedVal as ClassLevel;
    }
    return '7';
  });

  // Selected Class in the dropdowns (Class format is "Kelas X-Y")
  const [selectedClass7, setSelectedClass7] = useState(() => {
    if (currentUser.role === UserRole.WALI_KELAS) {
      const username = (currentUser.username || '').toLowerCase();
      const mapping: Record<string, string> = {
        damianus: 'Kelas 7-1', albert: 'Kelas 7-2', novie: 'Kelas 7-3', ira: 'Kelas 7-4', yulia: 'Kelas 7-5', terra: 'Kelas 7-6', lidya: 'Kelas 7-7',
        fay: 'Kelas 7-1', aida: 'Kelas 7-2', viika: 'Kelas 7-3', sribarnetti: 'Kelas 7-4', viny: 'Kelas 7-5', lia: 'Kelas 7-6', yanah: 'Kelas 7-7', srirahayu: 'Kelas 7-8', putri: 'Kelas 7-9', sari: 'Kelas 7-10', rifal: 'Kelas 7-11'
      };
      const mappedVal = mapping[username];
      if (mappedVal) return mappedVal;
    }
    return 'Kelas 7-1';
  });

  const [selectedClass8, setSelectedClass8] = useState(() => {
    if (currentUser.role === UserRole.WALI_KELAS) {
      const username = (currentUser.username || '').toLowerCase();
      const mapping: Record<string, string> = {
        sri: 'Kelas 8-1', farah: 'Kelas 8-2', eva: 'Kelas 8-3', selfi: 'Kelas 8-5', gerry: 'Kelas 8-6', ibnu: 'Kelas 8-7',
        neneng: 'Kelas 8-1', meli: 'Kelas 8-2', tiar: 'Kelas 8-3', joko: 'Kelas 8-4', danang: 'Kelas 8-5', annisa: 'Kelas 8-6', haifa: 'Kelas 8-7', santi: 'Kelas 8-8', reni: 'Kelas 8-9', dewi: 'Kelas 8-10', emi: 'Kelas 8-11'
      };
      const mappedVal = mapping[username];
      if (mappedVal) return mappedVal;
    }
    return 'Kelas 8-1';
  });

  const [selectedClass9, setSelectedClass9] = useState(() => {
    if (currentUser.role === UserRole.WALI_KELAS) {
      const username = (currentUser.username || '').toLowerCase();
      const mapping: Record<string, string> = {
        nani: 'Kelas 9-1', ana: 'Kelas 9-2', monica: 'Kelas 9-3', indri: 'Kelas 9-4', wahyunis: 'Kelas 9-5', titin: 'Kelas 9-6', ifah: 'Kelas 9-7',
        tere: 'Kelas 9-1', ferry: 'Kelas 9-2', sifah: 'Kelas 9-3', mia: 'Kelas 9-4', nur: 'Kelas 9-5', warsih: 'Kelas 9-6', tut: 'Kelas 9-7', kasrah: 'Kelas 9-8', habib: 'Kelas 9-9', pendi: 'Kelas 9-10', hadi: 'Kelas 9-11'
      };
      const mappedVal = mapping[username];
      if (mappedVal) return mappedVal;
    }
    return 'Kelas 9-1';
  });

  // Sync selected class dropdown state with the allowedClassName once loaded
  React.useEffect(() => {
    if (allowedClassName) {
      if (allowedClassName.startsWith('Kelas 7')) {
        setSelectedClass7(allowedClassName);
        setActiveLevel('7');
      } else if (allowedClassName.startsWith('Kelas 8')) {
        setSelectedClass8(allowedClassName);
        setActiveLevel('8');
      } else if (allowedClassName.startsWith('Kelas 9')) {
        setSelectedClass9(allowedClassName);
        setActiveLevel('9');
      }
    }
  }, [allowedClassName]);

  // Sync selected class dropdown state for Guru BK when db is loaded
  React.useEffect(() => {
    if (!db || !db.kelas || db.kelas.length === 0) return;

    if (currentUser.role === UserRole.GURU_BK) {
      const class7 = db.kelas.find(k => k.namaKelas.startsWith('Kelas 7'));
      const class8 = db.kelas.find(k => k.namaKelas.startsWith('Kelas 8'));
      const class9 = db.kelas.find(k => k.namaKelas.startsWith('Kelas 9'));

      if (class7) setSelectedClass7(class7.namaKelas);
      if (class8) setSelectedClass8(class8.namaKelas);
      if (class9) setSelectedClass9(class9.namaKelas);

      // Set active level to the level of the first available class
      const firstClass = db.kelas[0].namaKelas;
      const match = firstClass.match(/\d+/);
      if (match) {
        setActiveLevel(match[0] as ClassLevel);
      }
    }
  }, [db, currentUser.role]);

  // Search input within the filtered class
  const [searchQuery, setSearchQuery] = useState('');

  // Selected student for slide-over detail panel
  const [selectedSiswaId, setSelectedSiswaId] = useState<string | null>(null);

  // Integrated sub-feature tabs and chart hover state
  const [activeSubFeature, setActiveSubFeature] = useState<'hds' | 'kedisiplinan' | 'remisi' | 'rekap_grafik' | 'prestasi' | 'kehadiran' | 'laporan'>('rekap_grafik');
  const [hoveredBar, setHoveredBar] = useState<{ month: string; value: number; x: number; y: number } | null>(null);

  // Determine currently selected full class name based on active level
  const currentClassName = useMemo(() => {
    if (activeLevel === '7') return selectedClass7;
    if (activeLevel === '8') return selectedClass8;
    return selectedClass9;
  }, [activeLevel, selectedClass7, selectedClass8, selectedClass9]);

  // Helper to resolve student class name
  const getStudentClassName = (s: Siswa): string => {
    if (!db || !db.kelas) return s.kelasId || '';
    const match = db.kelas.find(
      (k) => k.id === s.kelasId || k.namaKelas.toLowerCase().trim() === s.kelasId?.toLowerCase().trim()
    );
    return match ? match.namaKelas : s.kelasId;
  };

  // Helper to normalize class names for perfect comparison (e.g. "kelas7-1" -> "7-1")
  const normalizeClassName = (name: string): string => {
    return name
      .toLowerCase()
      .replace(/kelas/g, '')
      .replace(/vii/g, '7')
      .replace(/viii/g, '8')
      .replace(/ix/g, '9')
      .replace(/[^0-9-]/g, '') // Keep only digits and hyphens (like "7-1")
      .trim();
  };

  // Function to download Student HDS Data and Remisi Poin as Word Doc
  const handleDownloadDoc = (siswa: Siswa) => {
    if (!db) return;
    
    const id = siswa.id;
    const kelasName = getStudentClassName(siswa);
    
    const pelanggaranList = db.pelanggaran ? db.pelanggaran.filter(p => p.siswaId === id) : [];
    const totalPelanggaran = pelanggaranList.reduce((sum, p) => sum + (p.poin || 0), 0);
    
    const remisiList = db.remisiPoin ? db.remisiPoin.filter(r => r.siswaId === id) : [];
    const totalRemisi = remisiList.reduce((sum, r) => sum + (r.poin || 0), 0);
    
    const sisaPoin = Math.max(0, totalPelanggaran - totalRemisi);
    
    // Define level and behavior recommendation
    let statusLabel = 'Sangat Baik (Sadar Disiplin)';
    
    if (sisaPoin > 0 && sisaPoin <= 20) {
      statusLabel = 'Baik';
    } else if (sisaPoin > 20 && sisaPoin <= 50) {
      statusLabel = 'Cukup (Pembinaan Ringan)';
    } else if (sisaPoin > 50 && sisaPoin <= 75) {
      statusLabel = 'Peringatan I (Pembinaan BK)';
    } else if (sisaPoin > 75 && sisaPoin <= 150) {
      statusLabel = 'Peringatan II / SP';
    } else if (sisaPoin > 150) {
      statusLabel = 'Sanksi Berat / Skorsing';
    }

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
    const a = document.createElement('a');
    a.href = url;
    a.download = `Lembar_Keterangan_${siswa.nama.replace(/\s+/g, '_')}_${dateTodayStr.replace(/\s+/g, '_')}.doc`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Filter students belonging to the current selected class
  const classStudents = useMemo(() => {
    if (!db || !db.siswa) return [];
    
    const targetNorm = normalizeClassName(currentClassName);
    
    return db.siswa.filter(s => {
      const sClassName = getStudentClassName(s);
      const sNorm = normalizeClassName(sClassName);
      
      // Matches if normalized form is identical (e.g., "7-1" === "7-1")
      return sNorm === targetNorm;
    });
  }, [db, currentClassName]);

  // Apply search query filter over class students
  const filteredStudents = useMemo(() => {
    if (!searchQuery.trim()) return classStudents;
    const q = searchQuery.toLowerCase();
    return classStudents.filter(s => 
      s.nama.toLowerCase().includes(q) || 
      s.nis.toLowerCase().includes(q) || 
      s.nisn.toLowerCase().includes(q)
    );
  }, [classStudents, searchQuery]);

  // Filter class violations (Kedisiplinan Tab)
  const classViolations = useMemo(() => {
    if (!db || !db.pelanggaran) return [];
    const studentIds = new Set(classStudents.map(s => s.id));
    return db.pelanggaran.filter(p => studentIds.has(p.siswaId));
  }, [db, classStudents]);

  // Search filter for Violations
  const filteredViolations = useMemo(() => {
    if (!searchQuery.trim()) return classViolations;
    const q = searchQuery.toLowerCase();
    return classViolations.filter(p => {
      const student = db?.siswa.find(s => s.id === p.siswaId);
      return (
        (student && student.nama.toLowerCase().includes(q)) ||
        p.jenisPelanggaran.toLowerCase().includes(q) ||
        p.kategori.toLowerCase().includes(q)
      );
    });
  }, [classViolations, searchQuery, db]);

  // Filter class remisi (Remisi Tab)
  const classRemisi = useMemo(() => {
    if (!db || !db.remisiPoin) return [];
    const studentIds = new Set(classStudents.map(s => s.id));
    return db.remisiPoin.filter(r => studentIds.has(r.siswaId));
  }, [db, classStudents]);

  // Search filter for Remisi
  const filteredRemisi = useMemo(() => {
    if (!searchQuery.trim()) return classRemisi;
    const q = searchQuery.toLowerCase();
    return classRemisi.filter(r => {
      const student = db?.siswa.find(s => s.id === r.siswaId);
      return (
        (student && student.nama.toLowerCase().includes(q)) ||
        r.jenisRemisi.toLowerCase().includes(q) ||
        r.kategori.toLowerCase().includes(q)
      );
    });
  }, [classRemisi, searchQuery, db]);

  // Filter class prestasi (Prestasi Tab)
  const classPrestasi = useMemo(() => {
    if (!db || !db.prestasi) return [];
    const studentIds = new Set(classStudents.map(s => s.id));
    return db.prestasi.filter(p => studentIds.has(p.siswaId));
  }, [db, classStudents]);

  // Search filter for Prestasi
  const filteredPrestasi = useMemo(() => {
    if (!searchQuery.trim()) return classPrestasi;
    const q = searchQuery.toLowerCase();
    return classPrestasi.filter(p => {
      const student = db?.siswa.find(s => s.id === p.siswaId);
      return (
        (student && student.nama.toLowerCase().includes(q)) ||
        p.namaPrestasi.toLowerCase().includes(q) ||
        p.tingkat.toLowerCase().includes(q) ||
        p.juara.toLowerCase().includes(q)
      );
    });
  }, [classPrestasi, searchQuery, db]);

  // Filter class kehadiran (Kehadiran Tab)
  const classKehadiran = useMemo(() => {
    if (!db || !db.kehadiran) return [];
    const studentIds = new Set(classStudents.map(s => s.id));
    return db.kehadiran.filter(k => studentIds.has(k.siswaId));
  }, [db, classStudents]);

  // Search filter for Kehadiran
  const filteredKehadiran = useMemo(() => {
    if (!searchQuery.trim()) return classKehadiran;
    const q = searchQuery.toLowerCase();
    return classKehadiran.filter(k => {
      const student = db?.siswa.find(s => s.id === k.siswaId);
      return (
        (student && student.nama.toLowerCase().includes(q)) ||
        k.mingguKe.toLowerCase().includes(q) ||
        k.bulan.toLowerCase().includes(q) ||
        (k.keterangan && k.keterangan.toLowerCase().includes(q))
      );
    });
  }, [classKehadiran, searchQuery, db]);

  // Monthly violation points calculation for the selected class
  const monthlyChartData = useMemo(() => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
    const dataMap = months.map((m, idx) => ({ monthLabel: m, points: 0, index: idx }));
    if (!db || !db.pelanggaran || classStudents.length === 0) return dataMap;
    const studentIds = new Set(classStudents.map(s => s.id));
    db.pelanggaran.forEach(p => {
      if (studentIds.has(p.siswaId) && p.tanggal) {
        const parts = p.tanggal.split('-');
        if (parts.length >= 2) {
          const monthVal = parseInt(parts[1], 10) - 1;
          if (monthVal >= 0 && monthVal < 12) {
            dataMap[monthVal].points += Number(p.poin || 0);
          }
        }
      }
    });
    return dataMap;
  }, [db, classStudents]);

  // Calculate metrics for the selected class
  const classMetrics = useMemo(() => {
    const total = classStudents.length;
    let male = 0;
    let female = 0;
    let totalPoinPelanggaran = 0;
    let totalLayananBk = 0;
    let totalPrestasi = 0;

    const studentIds = new Set(classStudents.map(s => s.id));

    classStudents.forEach(s => {
      if (s.jenisKelamin === 'Laki-laki') male++;
      else if (s.jenisKelamin === 'Perempuan') female++;
    });

    if (db) {
      // 1. Violations sum minus remisi
      const violationMap: Record<string, number> = {};
      db.pelanggaran.forEach(p => {
        if (studentIds.has(p.siswaId)) {
          violationMap[p.siswaId] = (violationMap[p.siswaId] || 0) + Number(p.poin);
        }
      });
      if (db.remisiPoin) {
        db.remisiPoin.forEach(r => {
          if (studentIds.has(r.siswaId) && violationMap[r.siswaId] !== undefined) {
            violationMap[r.siswaId] = Math.max(0, violationMap[r.siswaId] - Number(r.poin));
          }
        });
      }
      totalPoinPelanggaran = Object.values(violationMap).reduce((sum, v) => sum + v, 0);

      // 2. Counseling count
      totalLayananBk = db.konseling.filter(k => studentIds.has(k.siswaId)).length;

      // 3. Achievements count
      totalPrestasi = db.prestasi.filter(p => studentIds.has(p.siswaId)).length;
    }

    // Resolve Wali Kelas for selected class
    let waliKelasNama = 'Tidak ditugaskan';
    if (db && db.kelas && db.users) {
      const cls = db.kelas.find(k => normalizeClassName(k.namaKelas) === normalizeClassName(currentClassName));
      if (cls) {
        const user = db.users.find(u => u.id === cls.waliKelasId);
        if (user) {
          waliKelasNama = user.nama;
        }
      }
    }

    return {
      total,
      male,
      female,
      totalPoinPelanggaran,
      totalLayananBk,
      totalPrestasi,
      waliKelasNama
    };
  }, [db, classStudents, currentClassName]);

  // Detailed student lookups for the slide-over
  const viewingSiswa = useMemo(() => {
    if (!selectedSiswaId || !db) return null;
    return db.siswa.find(s => s.id === selectedSiswaId) || null;
  }, [selectedSiswaId, db]);

  const viewingSiswaHds = useMemo(() => {
    if (!viewingSiswa || !db) return null;
    
    const id = viewingSiswa.id;
    const ortu = db.orangTua?.find(o => o.id === id);
    const kes = db.kesehatan?.find(k => k.id === id);
    const eko = db.ekonomi?.find(e => e.id === id);
    const psi = db.psikologi?.find(p => p.id === id);
    const sos = db.sosial?.find(s => s.id === id);
    const aka = db.akademik?.find(a => a.id === id);
    const ase = db.asesmen?.find(a => a.siswaId === id);

    // Calculate individual student points
    let points = 0;
    if (db.pelanggaran) {
      db.pelanggaran.filter(p => p.siswaId === id).forEach(p => {
        points += Number(p.poin);
      });
    }
    if (db.remisiPoin) {
      db.remisiPoin.filter(r => r.siswaId === id).forEach(r => {
        points = Math.max(0, points - Number(r.poin));
      });
    }

    const counselingCount = db.konseling?.filter(k => k.siswaId === id).length || 0;
    const achievementsCount = db.prestasi?.filter(p => p.siswaId === id).length || 0;

    return {
      ortu,
      kes,
      eko,
      psi,
      sos,
      aka,
      ase,
      points,
      counselingCount,
      achievementsCount
    };
  }, [viewingSiswa, db]);

  // Laporan Kejadian states & helpers
  const [selectedStudentForReport, setSelectedStudentForReport] = useState('');
  const [reportText, setReportText] = useState('');
  const [reportDate, setReportDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [isSubmittingReport, setIsSubmittingReport] = useState(false);
  const [reportError, setReportError] = useState('');
  const [reportSuccessMsg, setReportSuccessMsg] = useState('');

  // Find reports for students in this class
  const classReports = useMemo(() => {
    if (!db || !db.laporanKejadian) return [];
    const studentIds = new Set(classStudents.map(s => s.id));
    return db.laporanKejadian.filter(l => studentIds.has(l.siswaId));
  }, [db, classStudents]);

  const handleSubmitReport = async () => {
    setReportError('');
    setReportSuccessMsg('');

    if (!selectedStudentForReport) {
      setReportError('Pilih siswa yang bersangkutan terlebih dahulu.');
      return;
    }
    if (!reportText.trim()) {
      setReportError('Tuliskan rincian laporan kejadian terlebih dahulu.');
      return;
    }
    if (!reportDate) {
      setReportError('Masukkan tanggal kejadian.');
      return;
    }

    const currentClassObj = db?.kelas.find(k => k.namaKelas === currentClassName);
    const newReport: LaporanKejadian = {
      id: `rep-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      siswaId: selectedStudentForReport,
      kelasId: currentClassObj?.id || currentClassName,
      laporan: reportText.trim(),
      tanggal: reportDate,
      waliKelasNama: currentUser.nama,
      status: 'Belum Dibaca',
      timestamp: new Date().toISOString()
    };

    setIsSubmittingReport(true);
    try {
      if (onSaveLaporanKejadian) {
        const success = await onSaveLaporanKejadian(newReport, true);
        if (success) {
          setReportSuccessMsg('Laporan kejadian berhasil dikirim ke Admin & BK!');
          setReportText('');
          setSelectedStudentForReport('');
          setReportDate(new Date().toISOString().split('T')[0]);
        } else {
          setReportError('Gagal mengirim laporan kejadian.');
        }
      } else {
        setReportError('Sistem pelaporan tidak terhubung.');
      }
    } catch (err) {
      setReportError('Terjadi kesalahan saat mengirim laporan.');
    } finally {
      setIsSubmittingReport(false);
    }
  };

  return (
    <div id="walikelas-container" className="space-y-6">
      
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-slate-900 to-indigo-950 text-white rounded-2xl p-6 shadow-md border border-slate-800 relative overflow-hidden">
        <div className="absolute right-0 bottom-0 translate-x-12 translate-y-12 opacity-10">
          <Users size={200} />
        </div>
        <div className="relative z-10 max-w-2xl">
          <span className="bg-indigo-500/20 text-indigo-300 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider border border-indigo-500/25">
            Sistem Terpadu Wali Kelas
          </span>
          <h1 className="text-xl md:text-2xl font-black mt-2 tracking-tight uppercase">
            RUANG WALI KELAS
          </h1>
          <p className="text-slate-300 mt-1 text-xs md:text-sm leading-relaxed">
            Akses klasifikasi kelas rombongan belajar secara terintegrasi. Pantau himpunan data siswa (HDS), evaluasi catatan kedisiplinan & poin, remisi, serta rekapitulasi lengkap dengan grafik perkembangan bulanan.
          </p>
        </div>
      </div>

      {/* Main Tabs - Levels 7, 8, 9 */}
      <div className="grid grid-cols-3 bg-slate-100 p-1 rounded-2xl border border-slate-200/50 shadow-sm max-w-xl">
        {(['7', '8', '9'] as ClassLevel[]).map((level) => {
          let isLocked = allowedClassLevel !== null && allowedClassLevel !== level;
          if (currentUser.role === UserRole.GURU_BK && db && db.kelas) {
            isLocked = !db.kelas.some(k => k.namaKelas.startsWith(`Kelas ${level}`));
          }
          return (
            <button
              key={level}
              disabled={isLocked}
              onClick={() => {
                if (!isLocked) {
                  setActiveLevel(level);
                  setSearchQuery('');
                }
              }}
              className={`py-3 rounded-xl text-xs font-black transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer ${
                isLocked
                  ? 'opacity-40 cursor-not-allowed bg-slate-50 text-slate-300'
                  : activeLevel === level
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-600 hover:bg-white hover:text-slate-800'
              }`}
            >
              {isLocked ? <Lock size={13} className="text-slate-300" /> : <GraduationCap size={15} />}
              KELAS {level}
            </button>
          );
        })}
      </div>

      {/* Classroom Tabs - X-1 to X-11 */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 space-y-3">
        <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
          Pilih Rombongan Belajar Kelas {activeLevel}:
        </div>
        <div className="flex flex-wrap gap-2">
          {Array.from({ length: 11 }, (_, i) => `Kelas ${activeLevel}-${i + 1}`).map((cls) => {
            const isActive = currentClassName === cls;
            let isLocked = allowedClassName !== null && allowedClassName !== cls;
            if (currentUser.role === UserRole.GURU_BK && db && db.kelas) {
              isLocked = !db.kelas.some(k => k.namaKelas === cls);
            }
            return (
              <button
                key={cls}
                disabled={isLocked}
                onClick={() => {
                  if (!isLocked) {
                    if (activeLevel === '7') setSelectedClass7(cls);
                    else if (activeLevel === '8') setSelectedClass8(cls);
                    else setSelectedClass9(cls);
                    setSearchQuery('');
                  }
                }}
                className={`px-4 py-2.5 rounded-xl text-xs font-black transition-all cursor-pointer border flex items-center gap-1.5 ${
                  isLocked
                    ? 'opacity-40 cursor-not-allowed bg-slate-50 text-slate-300 border-slate-100'
                    : isActive
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                      : 'bg-slate-50 hover:bg-slate-100 text-slate-600 hover:text-slate-800 border-slate-200/50'
                }`}
              >
                {isLocked && <Lock size={12} className="text-slate-300" />}
                {cls}
              </button>
            );
          })}
        </div>
      </div>

      {/* Integrated Class Dashboard Area */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 md:p-6 space-y-6">
        
        {/* Class Info Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-5">
          <div>
            <h2 className="font-extrabold text-base text-slate-800 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 animate-pulse"></span>
              Rombel Aktif: {currentClassName}
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">Integrasi data kependidikan, riwayat pelanggaran dan rekapitulasi poin kelas terkait</p>
          </div>
          <div className="bg-indigo-50 border border-indigo-100/50 text-indigo-700 px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 self-start">
            <UserIcon size={14} />
            <span>Wali Kelas: <b>{classMetrics.waliKelasNama}</b></span>
          </div>
        </div>

        {/* Real-time Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 flex items-center justify-between">
            <div>
              <span className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">Anggota Kelas</span>
              <p className="text-xl font-extrabold text-slate-800 mt-1">{classMetrics.total} Siswa</p>
              <p className="text-[10px] text-slate-400 font-medium">L: {classMetrics.male} | P: {classMetrics.female}</p>
            </div>
            <div className="bg-white p-2.5 rounded-lg border border-slate-200/50 text-slate-500 shadow-xs">
              <Users size={16} />
            </div>
          </div>

          <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 flex items-center justify-between">
            <div>
              <span className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">Akumulasi Pelanggaran</span>
              <p className="text-xl font-extrabold text-rose-600 mt-1">{classMetrics.totalPoinPelanggaran} Poin</p>
              <p className="text-[10px] text-slate-400 font-medium">Total poin kedisiplinan rombel</p>
            </div>
            <div className="bg-white p-2.5 rounded-lg border border-slate-200/50 text-rose-600 shadow-xs">
              <ShieldAlert size={16} />
            </div>
          </div>

          <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 flex items-center justify-between">
            <div>
              <span className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">Layanan Terlaksana</span>
              <p className="text-xl font-extrabold text-indigo-600 mt-1">{classMetrics.totalLayananBk} Sesi</p>
              <p className="text-[10px] text-slate-400 font-medium">{classMetrics.totalPrestasi} Catatan Prestasi Terukir</p>
            </div>
            <div className="bg-white p-2.5 rounded-lg border border-slate-200/50 text-indigo-600 shadow-xs">
              <Award size={16} />
            </div>
          </div>
        </div>

        {/* Feature Navigation Tabs */}
        <div className="flex flex-wrap gap-1 bg-slate-50 p-1 rounded-xl border border-slate-100">
          <button
            onClick={() => { setActiveSubFeature('rekap_grafik'); setSearchQuery(''); }}
            className={`flex-1 min-w-[140px] py-2.5 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
              activeSubFeature === 'rekap_grafik' ? 'bg-white text-indigo-700 shadow-xs border border-slate-100 font-black' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            📊 Rekap & Grafik Bulanan
          </button>
          <button
            onClick={() => { setActiveSubFeature('hds'); setSearchQuery(''); }}
            className={`flex-1 min-w-[140px] py-2.5 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
              activeSubFeature === 'hds' ? 'bg-white text-indigo-700 shadow-xs border border-slate-100 font-black' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            📁 Himpunan Data Siswa (HDS)
          </button>
          <button
            onClick={() => { setActiveSubFeature('kedisiplinan'); setSearchQuery(''); }}
            className={`flex-1 min-w-[140px] py-2.5 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
              activeSubFeature === 'kedisiplinan' ? 'bg-white text-indigo-700 shadow-xs border border-slate-100 font-black' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            ⚠️ Catatan Kedisiplinan & Poin
          </button>
          <button
            onClick={() => { setActiveSubFeature('remisi'); setSearchQuery(''); }}
            className={`flex-1 min-w-[140px] py-2.5 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
              activeSubFeature === 'remisi' ? 'bg-white text-indigo-700 shadow-xs border border-slate-100 font-black' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            🌱 Log Remisi Poin
          </button>
          <button
            onClick={() => { setActiveSubFeature('prestasi'); setSearchQuery(''); }}
            className={`flex-1 min-w-[140px] py-2.5 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
              activeSubFeature === 'prestasi' ? 'bg-white text-indigo-700 shadow-xs border border-slate-100 font-black' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            🏆 Rekam Prestasi
          </button>
          <button
            onClick={() => { setActiveSubFeature('kehadiran'); setSearchQuery(''); }}
            className={`flex-1 min-w-[140px] py-2.5 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
              activeSubFeature === 'kehadiran' ? 'bg-white text-indigo-700 shadow-xs border border-slate-100 font-black' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            📅 Rekap Kehadiran
          </button>
          <button
            onClick={() => { setActiveSubFeature('laporan'); setSearchQuery(''); }}
            className={`flex-1 min-w-[140px] py-2.5 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
              activeSubFeature === 'laporan' ? 'bg-white text-indigo-700 shadow-xs border border-slate-100 font-black' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            📋 Kirim Laporan Kejadian
          </button>
        </div>

        {/* Sub Feature Main Workspace */}
        <div className="space-y-4 pt-2">
          
          {/* SEARCH BAR (For search-applicable tabs) */}
          {activeSubFeature !== 'rekap_grafik' && activeSubFeature !== 'laporan' && (
            <div className="relative max-w-md">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={15} />
              <input
                type="text"
                placeholder={`Cari siswa atau materi di ${currentClassName}...`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-indigo-500 focus:bg-white"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                  <X size={14} />
                </button>
              )}
            </div>
          )}

          {/* TAB 1: Himpunan Data Siswa (HDS) - READ ONLY */}
          {activeSubFeature === 'hds' && (
            <div className="space-y-4">
              <div className="bg-indigo-50/50 border border-indigo-100/30 p-3 rounded-xl flex items-center gap-2.5 text-[11px] text-indigo-800 font-medium">
                <Info size={14} className="shrink-0" />
                <span>Mode Lihat Saja. Anda dapat mengeksplorasi Himpunan Data Siswa (HDS) lengkap tanpa hak modifikasi.</span>
              </div>

              {filteredStudents.length === 0 ? (
                <div className="py-10 text-center border-2 border-dashed border-slate-100 rounded-xl">
                  <p className="text-xs text-slate-400 font-bold">Tidak ada data siswa ditemukan</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredStudents.map((s) => (
                    <div key={s.id} className="bg-white rounded-xl border border-slate-100 p-4 shadow-2xs hover:border-indigo-100 transition flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-slate-100 text-slate-600 rounded-full flex items-center justify-center font-black text-xs uppercase">
                          {s.nama.charAt(0)}
                        </div>
                        <div>
                          <p className="font-bold text-slate-800 text-xs">{s.nama}</p>
                          <p className="text-[10px] text-slate-400 mt-0.5 font-mono">NIS: {s.nis} | NISN: {s.nisn}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => setSelectedSiswaId(s.id)}
                        className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-lg text-[10px] font-black transition cursor-pointer"
                      >
                        🔍 Detail HDS
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: Catatan Kedisiplinan - READ ONLY */}
          {activeSubFeature === 'kedisiplinan' && (
            <div className="space-y-4">
              <div className="bg-amber-50/50 border border-amber-100/30 p-3 rounded-xl flex items-center gap-2.5 text-[11px] text-amber-800 font-medium">
                <Info size={14} className="shrink-0" />
                <span>Mode Lihat Saja. Daftar rekam riwayat kasus pelanggaran disiplin siswa di kelas {currentClassName}.</span>
              </div>

              {filteredViolations.length === 0 ? (
                <div className="py-10 text-center border border-slate-100 rounded-xl text-slate-400 text-xs italic">
                  Belum ada catatan pelanggaran terdaftar di kelas ini.
                </div>
              ) : (
                <div className="overflow-x-auto rounded-xl border border-slate-100">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 font-bold">
                        <th className="p-3">Tanggal</th>
                        <th className="p-3">Nama Siswa</th>
                        <th className="p-3">Jenis Pelanggaran</th>
                        <th className="p-3">Kategori</th>
                        <th className="p-3 text-center">Poin</th>
                        <th className="p-3">Pelapor</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                      {filteredViolations.map((p) => {
                        const student = db?.siswa.find(s => s.id === p.siswaId);
                        return (
                          <tr key={p.id} className="hover:bg-slate-50/50">
                            <td className="p-3 font-mono text-[10px] text-slate-500">{p.tanggal}</td>
                            <td className="p-3 font-bold text-slate-800">{student?.nama || 'Siswa Dihapus'}</td>
                            <td className="p-3 text-slate-600">{p.jenisPelanggaran}</td>
                            <td className="p-3">
                              <span className={`px-2 py-0.5 rounded-md text-[9px] font-bold ${
                                p.kategori === 'Berat' ? 'bg-rose-100 text-rose-700' : p.kategori === 'Sedang' ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-600'
                              }`}>{p.kategori}</span>
                            </td>
                            <td className="p-3 text-center font-extrabold text-rose-600">+{p.poin} pts</td>
                            <td className="p-3 text-slate-500">{p.guruPelapor || '-'}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: Log Remisi Poin - READ ONLY */}
          {activeSubFeature === 'remisi' && (
            <div className="space-y-4">
              <div className="bg-emerald-50/50 border border-emerald-100/30 p-3 rounded-xl flex items-center gap-2.5 text-[11px] text-emerald-800 font-medium">
                <Info size={14} className="shrink-0" />
                <span>Mode Lihat Saja. Riwayat pemberian remisi poin untuk siswa di kelas {currentClassName}.</span>
              </div>

              {filteredRemisi.length === 0 ? (
                <div className="py-10 text-center border border-slate-100 rounded-xl text-slate-400 text-xs italic">
                  Belum ada log remisi poin terdaftar di kelas ini.
                </div>
              ) : (
                <div className="overflow-x-auto rounded-xl border border-slate-100">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 font-bold">
                        <th className="p-3">Tanggal</th>
                        <th className="p-3">Nama Siswa</th>
                        <th className="p-3">Bentuk Pembinaan / Remisi</th>
                        <th className="p-3">Kategori</th>
                        <th className="p-3 text-center">Poin</th>
                        <th className="p-3">Guru BK / Wali Kelas</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                      {filteredRemisi.map((r) => {
                        const student = db?.siswa.find(s => s.id === r.siswaId);
                        return (
                          <tr key={r.id} className="hover:bg-slate-50/50">
                            <td className="p-3 font-mono text-[10px] text-slate-500">{r.tanggal}</td>
                            <td className="p-3 font-bold text-slate-800">{student?.nama || 'Siswa Dihapus'}</td>
                            <td className="p-3 text-slate-600">{r.jenisRemisi}</td>
                            <td className="p-3 text-slate-500">{r.kategori}</td>
                            <td className="p-3 text-center font-extrabold text-emerald-600">-{r.poin} pts</td>
                            <td className="p-3 text-slate-500">{r.guruPemberi || '-'}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* TAB: Rekam Prestasi - READ ONLY */}
          {activeSubFeature === 'prestasi' && (
            <div className="space-y-4">
              <div className="bg-amber-50/50 border border-amber-100/30 p-3 rounded-xl flex items-center gap-2.5 text-[11px] text-amber-800 font-medium">
                <Info size={14} className="shrink-0" />
                <span>Mode Lihat Saja. Daftar rekam riwayat prestasi siswa di kelas {currentClassName}.</span>
              </div>

              {filteredPrestasi.length === 0 ? (
                <div className="py-10 text-center border border-slate-100 rounded-xl text-slate-400 text-xs italic">
                  Belum ada catatan prestasi terdaftar di kelas ini.
                </div>
              ) : (
                <div className="overflow-x-auto rounded-xl border border-slate-100">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 font-bold">
                        <th className="p-3">Nama Siswa</th>
                        <th className="p-3">Nama Prestasi</th>
                        <th className="p-3">Juara</th>
                        <th className="p-3">Tingkat</th>
                        <th className="p-3">Tahun</th>
                        <th className="p-3">Kategori</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                      {filteredPrestasi.map((p) => {
                        const student = db?.siswa.find(s => s.id === p.siswaId);
                        return (
                          <tr key={p.id} className="hover:bg-slate-50/50">
                            <td className="p-3 font-bold text-slate-800">{student?.nama || 'Siswa Dihapus'}</td>
                            <td className="p-3 text-slate-600">{p.namaPrestasi}</td>
                            <td className="p-3">
                              <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-100 text-amber-800">
                                {p.juara}
                              </span>
                            </td>
                            <td className="p-3 text-slate-600">{p.tingkat}</td>
                            <td className="p-3 font-mono text-slate-500">{p.tahun}</td>
                            <td className="p-3">
                              <span className="px-2 py-0.5 rounded-md text-[9px] font-bold bg-slate-100 text-slate-600">
                                {p.kategori || 'Akademik'}
                              </span>
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

          {/* TAB: Rekap Kehadiran - READ ONLY */}
          {activeSubFeature === 'kehadiran' && (
            <div className="space-y-4">
              <div className="bg-cyan-50/50 border border-cyan-100/30 p-3 rounded-xl flex items-center gap-2.5 text-[11px] text-cyan-800 font-medium">
                <Info size={14} className="shrink-0" />
                <span>Mode Lihat Saja. Rekap kehadiran mingguan siswa di kelas {currentClassName}.</span>
              </div>

              {filteredKehadiran.length === 0 ? (
                <div className="py-10 text-center border border-slate-100 rounded-xl text-slate-400 text-xs italic">
                  Belum ada rekap kehadiran terdaftar di kelas ini.
                </div>
              ) : (
                <div className="overflow-x-auto rounded-xl border border-slate-100">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 font-bold uppercase tracking-wider">
                        <th className="p-3">Nama Siswa</th>
                        <th className="p-3">Minggu & Periode</th>
                        <th className="p-3 text-center">Hadir</th>
                        <th className="p-3 text-center">Sakit</th>
                        <th className="p-3 text-center">Izin</th>
                        <th className="p-3 text-center">Alfa</th>
                        <th className="p-3">Keterangan</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                      {filteredKehadiran.map((att) => {
                        const student = db?.siswa.find(s => s.id === att.siswaId);
                        return (
                          <tr key={att.id} className="hover:bg-slate-50/50">
                            <td className="p-3 font-bold text-slate-800">{student?.nama || 'Siswa Dihapus'}</td>
                            <td className="p-3">
                              <p className="font-semibold text-slate-700">{att.mingguKe}</p>
                              <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">{att.bulan} {att.tahun}</p>
                            </td>
                            <td className="p-3 text-center">
                              <span className="bg-emerald-50 text-emerald-700 font-bold px-2 py-0.5 rounded-md border border-emerald-100 text-[10px]">
                                {att.hadir} Hari
                              </span>
                            </td>
                            <td className="p-3 text-center">
                              <span className="bg-sky-50 text-sky-700 font-bold px-2 py-0.5 rounded-md border border-sky-100 text-[10px]">
                                {att.sakit} Hari
                              </span>
                            </td>
                            <td className="p-3 text-center">
                              <span className="bg-amber-50 text-amber-700 font-bold px-2 py-0.5 rounded-md border border-amber-100 text-[10px]">
                                {att.izin || (att as any).ijin || att.izin === 0 ? att.izin : 0} Hari
                              </span>
                            </td>
                            <td className="p-3 text-center">
                              <span className="bg-rose-50 text-rose-700 font-bold px-2 py-0.5 rounded-md border border-rose-100 text-[10px]">
                                {att.alfa} Hari
                              </span>
                            </td>
                            <td className="p-3 text-slate-500 max-w-xs truncate" title={att.keterangan || '-'}>
                              {att.keterangan || '-'}
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

          {/* TAB 4: Rekap & Grafik Bulanan */}
          {activeSubFeature === 'rekap_grafik' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              
              {/* Left Column: Monthly Violation Progress Chart (5 cols) */}
              <div className="lg:col-span-5 bg-white p-5 rounded-2xl border border-slate-100 shadow-xs space-y-4">
                <div>
                  <h4 className="font-extrabold text-slate-800 text-xs uppercase tracking-wider flex items-center gap-1.5">
                    <TrendingUp size={14} className="text-indigo-600" />
                    Grafik Perkembangan Pelanggaran Bulanan
                  </h4>
                  <p className="text-[10px] text-slate-400 mt-0.5">Akumulasi sebaran poin pelanggaran bulan demi bulan</p>
                </div>

                {/* SVG Chart Container */}
                <div className="relative h-64 pt-6 flex flex-col justify-between select-none">
                  
                  {/* Grid Lines */}
                  <div className="absolute inset-0 flex flex-col justify-between pointer-events-none pb-8 pt-6">
                    {[0, 1, 2, 3, 4].map((idx) => {
                      const maxPts = Math.max(10, ...monthlyChartData.map(d => d.points));
                      const val = Math.round((maxPts / 4) * (4 - idx));
                      return (
                        <div key={idx} className="w-full flex items-center gap-2">
                          <span className="text-[9px] font-mono text-slate-400 w-6 text-right">{val}</span>
                          <div className="flex-1 border-t border-slate-100 border-dashed"></div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Bars */}
                  <div className="flex-1 flex justify-around items-end relative z-10 pl-8 pb-8 h-full">
                    {monthlyChartData.map((mItem, mIdx) => {
                      const maxPts = Math.max(10, ...monthlyChartData.map(d => d.points));
                      const barHeightPct = maxPts > 0 ? (mItem.points / maxPts) * 100 : 0;
                      
                      return (
                        <div key={mIdx} className="flex-1 flex flex-col items-center group/bar h-full justify-end relative px-0.5">
                          {/* Colored bar */}
                          <div 
                            className="w-full rounded-t-sm bg-gradient-to-t from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 transition-all duration-300 relative cursor-pointer"
                            style={{ height: `${Math.max(3, barHeightPct)}%` }}
                            onMouseEnter={(e) => {
                              const rect = e.currentTarget.getBoundingClientRect();
                              const parentRect = e.currentTarget.parentElement?.parentElement?.getBoundingClientRect();
                              if (parentRect) {
                                setHoveredBar({
                                  month: mItem.monthLabel,
                                  value: mItem.points,
                                  x: rect.left - parentRect.left + rect.width / 2,
                                  y: rect.top - parentRect.top - 8
                                });
                              }
                            }}
                            onMouseLeave={() => setHoveredBar(null)}
                          />
                          <span className="text-[8px] font-mono font-bold text-slate-400 mt-2">
                            {mItem.monthLabel}
                          </span>
                        </div>
                      );
                    })}

                    {/* Chart Tooltip */}
                    {hoveredBar && (
                      <div 
                        className="absolute z-20 bg-slate-900 text-white text-[10px] px-2 py-1.5 rounded-lg shadow-md border border-slate-800 pointer-events-none -translate-x-1/2 whitespace-nowrap transition-all duration-150"
                        style={{ left: hoveredBar.x, top: hoveredBar.y - 20 }}
                      >
                        <p className="font-bold">{hoveredBar.month}</p>
                        <p className="text-indigo-300 font-mono mt-0.5">{hoveredBar.value} Poin Pelanggaran</p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="bg-slate-50 rounded-xl p-3 text-[10px] text-slate-500 leading-normal font-medium border border-slate-100">
                  💡 <b>Informasi:</b> Grafik di atas merekam fluktuasi kumulatif poin yang dialami rombel <b>{currentClassName}</b>.
                </div>
              </div>

              {/* Right Column: Student Rekapitulasi Table (7 cols) */}
              <div className="lg:col-span-7 bg-white p-5 rounded-2xl border border-slate-100 shadow-xs space-y-4">
                <div>
                  <h4 className="font-extrabold text-slate-800 text-xs uppercase tracking-wider flex items-center gap-1.5">
                    <Users size={14} className="text-indigo-600" />
                    Tabel Rekapitulasi Status Siswa & Dokumen Resmi
                  </h4>
                  <p className="text-[10px] text-slate-400 mt-0.5">Daftar rekap skor bersih kedisiplinan dan cetak lembar keterangan resmi (.doc)</p>
                </div>

                {classStudents.length === 0 ? (
                  <div className="py-10 text-center text-slate-400 italic text-xs">
                    Tidak ada siswa di kelas ini.
                  </div>
                ) : (
                  <div className="overflow-x-auto border border-slate-100 rounded-xl">
                    <table className="w-full text-left text-[11px] border-collapse">
                      <thead>
                        <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 font-bold">
                          <th className="p-3">Nama Lengkap</th>
                          <th className="p-3 text-center">Pelanggaran</th>
                          <th className="p-3 text-center">Remisi</th>
                          <th className="p-3 text-center">Net</th>
                          <th className="p-3">Status</th>
                          <th className="p-3 text-right">Aksi</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                        {classStudents.map((s) => {
                          let totalPelanggaran = 0;
                          if (db?.pelanggaran) {
                            db.pelanggaran.filter(p => p.siswaId === s.id).forEach(p => { totalPelanggaran += Number(p.poin); });
                          }
                          let totalRemisi = 0;
                          if (db?.remisiPoin) {
                            db.remisiPoin.filter(r => r.siswaId === s.id).forEach(r => { totalRemisi += Number(r.poin); });
                          }
                          const sisaPoin = Math.max(0, totalPelanggaran - totalRemisi);

                          let statusBadge = 'Sangat Baik';
                          let badgeClass = 'bg-emerald-50 text-emerald-700 border-emerald-100/50';
                          
                          if (sisaPoin > 150) {
                            statusBadge = 'Sanksi Berat';
                            badgeClass = 'bg-rose-100 text-rose-800 border-rose-200';
                          } else if (sisaPoin > 75) {
                            statusBadge = 'Peringatan II';
                            badgeClass = 'bg-rose-50 text-rose-700 border-rose-100';
                          } else if (sisaPoin > 50) {
                            statusBadge = 'Peringatan I';
                            badgeClass = 'bg-amber-100 text-amber-800 border-amber-200';
                          } else if (sisaPoin > 20) {
                            statusBadge = 'Pembinaan';
                            badgeClass = 'bg-amber-50 text-amber-700 border-amber-100';
                          } else if (sisaPoin > 0) {
                            statusBadge = 'Baik';
                            badgeClass = 'bg-emerald-100 text-emerald-800 border-emerald-200';
                          }

                          return (
                            <tr key={s.id} className="hover:bg-slate-50/50">
                              <td className="p-3">
                                <p className="font-bold text-slate-800 leading-tight">{s.nama}</p>
                                <p className="text-[9px] text-slate-400 mt-0.5">NIS: {s.nis}</p>
                              </td>
                              <td className="p-3 text-center text-rose-600 font-mono">{totalPelanggaran} pts</td>
                              <td className="p-3 text-center text-indigo-600 font-mono">-{totalRemisi} pts</td>
                              <td className="p-3 text-center font-bold text-slate-800 font-mono">{sisaPoin} pts</td>
                              <td className="p-3">
                                <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold border ${badgeClass}`}>
                                  {statusBadge}
                                </span>
                              </td>
                              <td className="p-3 text-right">
                                <button
                                  onClick={() => handleDownloadDoc(s)}
                                  className="px-2.5 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-100/40 rounded-lg text-[10px] font-bold transition flex items-center gap-1 cursor-pointer ml-auto"
                                  title="Unduh Lembar Keterangan"
                                >
                                  <FileText size={11} /> Unduh .doc
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

            </div>
          )}

          {/* TAB 7: Laporan Kejadian */}
          {activeSubFeature === 'laporan' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              
              {/* Form Column (5 cols) */}
              <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-5">
                <div>
                  <h4 className="font-extrabold text-slate-800 text-xs uppercase tracking-wider flex items-center gap-1.5">
                    <Send size={14} className="text-indigo-600" />
                    Kirim Laporan Baru
                  </h4>
                  <p className="text-[10px] text-slate-400 mt-0.5">Isi detail kejadian di bawah untuk dikirim ke Admin & Guru BK</p>
                </div>

                {reportError && (
                  <div className="p-3 bg-rose-50 border border-rose-100 rounded-xl flex items-center gap-2 text-rose-600 text-[11px] font-medium animate-bounce">
                    <AlertCircle size={14} className="shrink-0" />
                    <span>{reportError}</span>
                  </div>
                )}

                {reportSuccessMsg && (
                  <div className="p-3 bg-emerald-50 border border-emerald-100 rounded-xl flex items-center gap-2 text-emerald-700 text-[11px] font-medium">
                    <Smile size={14} className="shrink-0" />
                    <span>{reportSuccessMsg}</span>
                  </div>
                )}

                <div className="space-y-4">
                  {/* Student Select */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Pilih Siswa <span className="text-rose-500">*</span></label>
                    <select
                      value={selectedStudentForReport}
                      onChange={(e) => {
                        setSelectedStudentForReport(e.target.value);
                        setReportError('');
                        setReportSuccessMsg('');
                      }}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:bg-white rounded-xl text-xs focus:outline-none font-semibold transition-all text-slate-700"
                    >
                      <option value="">-- Pilih Siswa Kelas {currentClassName} --</option>
                      {classStudents.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.nama} ({s.nis || 'Tanpa NIS'})
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Incident Date */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Tanggal Kejadian <span className="text-rose-500">*</span></label>
                    <input
                      type="date"
                      value={reportDate}
                      onChange={(e) => {
                        setReportDate(e.target.value);
                        setReportError('');
                        setReportSuccessMsg('');
                      }}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:bg-white rounded-xl text-xs focus:outline-none font-semibold transition-all text-slate-700 font-mono"
                    />
                  </div>

                  {/* Report Text */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Keterangan / Kejadian <span className="text-rose-500">*</span></label>
                    <textarea
                      value={reportText}
                      onChange={(e) => {
                        setReportText(e.target.value);
                        setReportError('');
                        setReportSuccessMsg('');
                      }}
                      placeholder="Jelaskan secara detail kejadian, masalah, kronologi, tindakan sementara yang telah diambil wali kelas..."
                      rows={5}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:bg-white rounded-xl text-xs focus:outline-none font-medium transition-all text-slate-700 leading-relaxed"
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                    onClick={handleSubmitReport}
                    disabled={isSubmittingReport}
                    className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-extrabold text-xs rounded-xl transition flex items-center justify-center gap-2 shadow-sm cursor-pointer border border-indigo-700"
                  >
                    {isSubmittingReport ? (
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    ) : (
                      <>
                        <Send size={13} /> Kirim Laporan ke Admin & BK
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* History Column (7 cols) */}
              <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4">
                <div>
                  <h4 className="font-extrabold text-slate-800 text-xs uppercase tracking-wider flex items-center gap-1.5">
                    <FileText size={14} className="text-indigo-600" />
                    Riwayat Laporan Kelas {currentClassName} ({classReports.length})
                  </h4>
                  <p className="text-[10px] text-slate-400 mt-0.5">Daftar kejadian siswa di kelas Anda yang dilaporkan ke Guru BK & Admin</p>
                </div>

                {classReports.length === 0 ? (
                  <div className="p-8 text-center text-slate-400 italic bg-slate-50/50 rounded-2xl border border-dashed border-slate-200 text-xs">
                    Belum ada laporan kejadian yang dibuat untuk kelas ini.
                  </div>
                ) : (
                  <div className="space-y-3.5 max-h-[450px] overflow-y-auto pr-1">
                    {[...classReports]
                      .sort((a, b) => new Date(b.timestamp || b.tanggal).getTime() - new Date(a.timestamp || a.tanggal).getTime())
                      .map((report) => {
                        const student = classStudents.find(s => s.id === report.siswaId);
                        return (
                          <div
                            key={report.id}
                            className={`p-4 border rounded-xl transition ${
                              report.status === 'Belum Dibaca' 
                                ? 'bg-amber-50/15 border-amber-100/70' 
                                : 'bg-slate-50/30 border-slate-100'
                            }`}
                          >
                            <div className="flex justify-between items-start gap-4 text-left">
                              <div className="space-y-1.5">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <span className="font-extrabold text-slate-800 text-xs">
                                    {student?.nama || 'Siswa Dihapus'}
                                  </span>
                                  <span className="text-[9px] font-mono text-slate-400">
                                    {report.tanggal}
                                  </span>
                                  <span className={`px-2 py-0.5 rounded-full text-[9px] font-extrabold tracking-wider uppercase border ${
                                    report.status === 'Belum Dibaca'
                                      ? 'bg-amber-50 border-amber-100 text-amber-600 animate-pulse'
                                      : 'bg-emerald-50 border-emerald-100 text-emerald-600'
                                  }`}>
                                    {report.status}
                                  </span>
                                </div>
                                <p className="text-slate-600 text-xs leading-relaxed">
                                  {report.laporan}
                                </p>
                                <div className="text-[10px] text-slate-400 font-medium">
                                  Dilaporkan oleh Wali Kelas: <strong className="text-slate-500">{report.waliKelasNama}</strong>
                                </div>
                              </div>

                              {onDeleteLaporanKejadian && (
                                <button
                                  onClick={async () => {
                                    if (confirm('Apakah Anda yakin ingin menarik/menghapus laporan ini?')) {
                                      await onDeleteLaporanKejadian(report.id);
                                    }
                                  }}
                                  className="p-1.5 hover:bg-rose-50 text-rose-500 rounded-lg transition shrink-0 cursor-pointer border border-transparent hover:border-rose-100"
                                  title="Tarik/Hapus Laporan"
                                >
                                  <Trash size={13} />
                                </button>
                              )}
                            </div>
                          </div>
                        );
                      })}
                  </div>
                )}
              </div>

            </div>
          )}

        </div>
      </div>

      {/* Render modular detail drawer */}
      {selectedSiswaId && viewingSiswa && viewingSiswaHds && (
        <HdsDetailDrawer
          siswa={viewingSiswa}
          hds={viewingSiswaHds}
          onClose={() => setSelectedSiswaId(null)}
          getStudentClassName={getStudentClassName}
        />
      )}

    </div>
  );
}
