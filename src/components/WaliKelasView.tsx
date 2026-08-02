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
  Trash,
  Filter,
  Download,
  BarChart2,
  PieChart,
  FileDown,
  Eye,
  Plus,
  Edit,
  Trash2,
  Star,
  Check,
  CheckCircle2,
  Medal,
  Save
} from 'lucide-react';
import { DatabaseState, User, UserRole, Siswa, OrangTua, Kesehatan, Ekonomi, Psikologi, Sosial, Akademik, Asesmen, LaporanKejadian, Pelanggaran, RemisiPoin, Prestasi, Kehadiran } from '../types';

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
  onDownloadPdf?: (s: Siswa) => void;
}

function HdsDetailDrawer({ siswa, hds, onClose, getStudentClassName, onDownloadPdf }: HdsDetailDrawerProps) {
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
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
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
                  {onDownloadPdf && (
                    <button
                      onClick={() => onDownloadPdf(siswa)}
                      className="px-3 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-xs cursor-pointer self-start sm:self-auto"
                    >
                      <FileDown size={14} /> Unduh PDF HDS
                    </button>
                  )}
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
                      <p className="font-bold text-slate-700 mt-0.5">{siswa.agama && siswa.agama !== '-' ? siswa.agama : 'Islam'}</p>
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
                        {siswa.alamat || '-'}
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
                      {/* BIODATA AYAH */}
                      <div className="grid grid-cols-2 gap-3 bg-slate-50 p-3 rounded-xl border border-slate-100">
                        <div className="col-span-2 border-b border-slate-200/50 pb-1.5 flex justify-between items-center">
                          <div>
                            <p className="text-[10px] font-bold text-slate-500">BIODATA AYAH</p>
                            <p className="font-bold text-slate-800 mt-1">{hds.ortu.namaAyah || '-'}</p>
                          </div>
                          <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${
                            hds.ortu.statusAyah === 'Meninggal' ? 'bg-rose-50 text-rose-700' : 'bg-emerald-50 text-emerald-700'
                          }`}>
                            {hds.ortu.statusAyah || 'Hidup'}
                          </span>
                        </div>
                        <div>
                          <p className="text-[10px] text-slate-400 font-semibold">Agama Ayah</p>
                          <p className="font-bold text-slate-700 mt-0.5">
                            {hds.ortu.agamaAyah && hds.ortu.agamaAyah !== '-' ? hds.ortu.agamaAyah : (siswa.agama && siswa.agama !== '-' ? siswa.agama : 'Islam')}
                          </p>
                        </div>
                        <div>
                          <p className="text-[10px] text-slate-400 font-semibold">Pendidikan Ayah</p>
                          <p className="font-bold text-slate-700 mt-0.5">{hds.ortu.pendidikanAyah || '-'}</p>
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

                      {/* BIODATA IBU */}
                      <div className="grid grid-cols-2 gap-3 bg-slate-50 p-3 rounded-xl border border-slate-100">
                        <div className="col-span-2 border-b border-slate-200/50 pb-1.5 flex justify-between items-center">
                          <div>
                            <p className="text-[10px] font-bold text-slate-500">BIODATA IBU</p>
                            <p className="font-bold text-slate-800 mt-1">{hds.ortu.namaIbu || '-'}</p>
                          </div>
                          <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${
                            hds.ortu.statusIbu === 'Meninggal' ? 'bg-rose-50 text-rose-700' : 'bg-emerald-50 text-emerald-700'
                          }`}>
                            {hds.ortu.statusIbu || 'Hidup'}
                          </span>
                        </div>
                        <div>
                          <p className="text-[10px] text-slate-400 font-semibold">Agama Ibu</p>
                          <p className="font-bold text-slate-700 mt-0.5">
                            {hds.ortu.agamaIbu && hds.ortu.agamaIbu !== '-' ? hds.ortu.agamaIbu : (siswa.agama && siswa.agama !== '-' ? siswa.agama : 'Islam')}
                          </p>
                        </div>
                        <div>
                          <p className="text-[10px] text-slate-400 font-semibold">Pendidikan Ibu</p>
                          <p className="font-bold text-slate-700 mt-0.5">{hds.ortu.pendidikanIbu || '-'}</p>
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

                      {/* BIODATA WALI (IF ANY) */}
                      {hds.ortu.wali && (
                        <div className="grid grid-cols-2 gap-3 bg-slate-50 p-3 rounded-xl border border-slate-100">
                          <div className="col-span-2 border-b border-slate-200/50 pb-1.5 flex justify-between items-center">
                            <div>
                              <p className="text-[10px] font-bold text-slate-500">BIODATA WALI</p>
                              <p className="font-bold text-slate-800 mt-1">{hds.ortu.wali}</p>
                            </div>
                            <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${
                              hds.ortu.statusWali === 'Meninggal' ? 'bg-rose-50 text-rose-700' : 'bg-emerald-50 text-emerald-700'
                            }`}>
                              {hds.ortu.statusWali || 'Hidup'}
                            </span>
                          </div>
                          <div>
                            <p className="text-[10px] text-slate-400 font-semibold">Agama Wali</p>
                            <p className="font-bold text-slate-700 mt-0.5">
                              {hds.ortu.agamaWali && hds.ortu.agamaWali !== '-' ? hds.ortu.agamaWali : (siswa.agama && siswa.agama !== '-' ? siswa.agama : 'Islam')}
                            </p>
                          </div>
                          <div>
                            <p className="text-[10px] text-slate-400 font-semibold">Pekerjaan Wali</p>
                            <p className="font-bold text-slate-700 mt-0.5">{hds.ortu.pekerjaanWali || '-'}</p>
                          </div>
                        </div>
                      )}
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
  onSavePelanggaran?: (p: Pelanggaran, isNew: boolean) => Promise<boolean>;
  onDeletePelanggaran?: (id: string) => Promise<boolean>;
  onSaveRemisiPoin?: (r: RemisiPoin, isNew: boolean) => Promise<boolean>;
  onDeleteRemisiPoin?: (id: string) => Promise<boolean>;
  onSavePrestasi?: (p: Prestasi, isNew: boolean) => Promise<boolean>;
  onDeletePrestasi?: (id: string) => Promise<boolean>;
  onSaveKehadiran?: (k: Kehadiran, isNew: boolean) => Promise<boolean>;
  onDeleteKehadiran?: (id: string) => Promise<boolean>;
}

type ClassLevel = '7' | '8' | '9';

export default function WaliKelasView({ 
  db, 
  currentUser, 
  onNavigateToSiswa, 
  onSaveLaporanKejadian, 
  onDeleteLaporanKejadian,
  onSavePelanggaran,
  onDeletePelanggaran,
  onSaveRemisiPoin,
  onDeleteRemisiPoin,
  onSavePrestasi,
  onDeletePrestasi,
  onSaveKehadiran,
  onDeleteKehadiran
}: WaliKelasViewProps) {
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
  const [attendanceFilterBulan, setAttendanceFilterBulan] = useState<string>('ALL');
  const [attendanceFilterMinggu, setAttendanceFilterMinggu] = useState<string>('ALL');

  // Selected student for slide-over detail panel
  const [selectedSiswaId, setSelectedSiswaId] = useState<string | null>(null);

  // Integrated sub-feature tabs and chart hover state
  const [activeSubFeature, setActiveSubFeature] = useState<'hds' | 'kedisiplinan' | 'remisi' | 'ringkasan_remisi' | 'rekap_grafik' | 'prestasi' | 'kehadiran' | 'laporan'>('rekap_grafik');
  const [hoveredBar, setHoveredBar] = useState<{ month: string; value: number; x: number; y: number } | null>(null);

  // Filters for Ringkasan Remisi Poin
  const [filterRemisiClass, setFilterRemisiClass] = useState<string>('ALL');
  const [filterRemisiSiswaId, setFilterRemisiSiswaId] = useState<string>('ALL');

  // Modal State & Forms for Full Access CRUD
  const [showPelanggaranModal, setShowPelanggaranModal] = useState(false);
  const [editingPelanggaran, setEditingPelanggaran] = useState<Pelanggaran | null>(null);
  const [formPelanggaran, setFormPelanggaran] = useState({
    siswaId: '',
    tanggal: new Date().toISOString().split('T')[0],
    jenisPelanggaran: '',
    kategori: 'Ringan',
    poin: 5,
    guruPelapor: currentUser.nama || 'Wali Kelas',
    tindakLanjut: 'Pembinaan Wali Kelas',
    status: 'Selesai' as 'Selesai' | 'Proses' | 'Belum Ditindak'
  });

  const [showRemisiModal, setShowRemisiModal] = useState(false);
  const [editingRemisi, setEditingRemisi] = useState<RemisiPoin | null>(null);
  const [formRemisi, setFormRemisi] = useState({
    siswaId: '',
    tanggal: new Date().toISOString().split('T')[0],
    jenisRemisi: '',
    kategori: 'Karakter Baik',
    poin: 10,
    guruPemberi: currentUser.nama || 'Wali Kelas',
    keterangan: ''
  });

  const [showPrestasiModal, setShowPrestasiModal] = useState(false);
  const [editingPrestasi, setEditingPrestasi] = useState<Prestasi | null>(null);
  const [formPrestasi, setFormPrestasi] = useState({
    siswaId: '',
    namaPrestasi: '',
    tingkat: 'Sekolah',
    tahun: new Date().getFullYear().toString(),
    juara: 'Juara 1',
    kategori: 'Akademik' as 'Akademik' | 'Non Akademik',
    sertifikat: ''
  });

  const [showKehadiranModal, setShowKehadiranModal] = useState(false);
  const [editingKehadiran, setEditingKehadiran] = useState<Kehadiran | null>(null);
  const [formKehadiran, setFormKehadiran] = useState({
    siswaId: '',
    bulan: 'Juli',
    mingguKe: 'Minggu 1',
    tahun: '2026',
    hadir: 5,
    sakit: 0,
    izin: 0,
    alfa: 0
  });

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

  // Helper to normalize class names for perfect comparison (e.g. "Kelas 8-9", "8.9", "VIII-9" -> "8-9")
  const normalizeClassName = (name: string): string => {
    if (!name) return '';
    return name
      .toLowerCase()
      .replace(/kelas/g, '')
      .replace(/viii/g, '8')
      .replace(/vii/g, '7')
      .replace(/ix/g, '9')
      .replace(/[.\s/]+/g, '-')
      .replace(/[^0-9-]/g, '')
      .replace(/-+/g, '-')
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

  const handleDownloadHdsPdf = (siswa: Siswa) => {
    if (!db) return;
    
    const id = siswa.id;
    const kelasName = getStudentClassName(siswa);
    const ortu = db.orangTua?.find(o => o.id === id);
    const kes = db.kesehatan?.find(k => k.id === id);
    const eko = db.ekonomi?.find(e => e.id === id);
    const psi = db.psikologi?.find(p => p.id === id);
    const sos = db.sosial?.find(s => s.id === id);
    const aka = db.akademik?.find(a => a.id === id);
    const ase = db.asesmen?.find(a => a.siswaId === id);

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

    const kelasObj = db.kelas.find(c => c.id === siswa.kelasId || c.namaKelas.toLowerCase().trim() === siswa.kelasId?.toLowerCase().trim());
    const waliKelasUser = db.users.find(u => u.id === kelasObj?.waliKelasId) || currentUser;
    const waliKelasName = waliKelasUser?.nama || currentUser.nama || 'Wali Kelas';
    const guruBk = db.users.find(u => u.role === UserRole.GURU_BK);
    const guruBkName = guruBk?.nama || 'Guru Bimbingan Konseling';

    const dateTodayStr = new Date().toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });

    const docHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>HDS PDF - ${siswa.nama} (${kelasName})</title>
        <style>
          @page {
            size: A4;
            margin: 1.2cm 1.5cm 1.2cm 1.5cm;
          }
          body {
            font-family: Arial, Helvetica, sans-serif;
            color: #1e293b;
            line-height: 1.4;
            font-size: 9.5pt;
            background-color: #ffffff;
            margin: 0;
          }
          .kop-container {
            text-align: center;
            border-bottom: 3px double #0f172a;
            padding-bottom: 8px;
            margin-bottom: 14px;
          }
          .kop-container h1 {
            margin: 0;
            font-size: 11pt;
            font-weight: 800;
            text-transform: uppercase;
            color: #0f172a;
          }
          .kop-container h2 {
            margin: 2px 0 0 0;
            font-size: 10pt;
            font-weight: 700;
            text-transform: uppercase;
            color: #334155;
          }
          .kop-container h3 {
            margin: 2px 0 0 0;
            font-size: 12pt;
            font-weight: 900;
            text-transform: uppercase;
            color: #047857;
          }
          .kop-container p {
            margin: 4px 0 0 0;
            font-size: 8pt;
            color: #64748b;
            font-style: italic;
          }
          .title-box {
            text-align: center;
            margin-bottom: 14px;
            background-color: #f8fafc;
            border: 1px solid #e2e8f0;
            padding: 8px;
            border-radius: 6px;
          }
          .title-box h4 {
            margin: 0;
            font-size: 11pt;
            font-weight: 800;
            text-transform: uppercase;
            color: #0f172a;
            letter-spacing: 0.5px;
          }
          .title-box p {
            margin: 3px 0 0 0;
            font-size: 8.5pt;
            color: #64748b;
            font-weight: 600;
          }
          .sec-header {
            font-size: 8.5pt;
            font-weight: 800;
            text-transform: uppercase;
            background-color: #0f172a;
            color: #ffffff;
            padding: 4px 8px;
            margin-top: 12px;
            margin-bottom: 6px;
            border-radius: 4px;
          }
          .grid-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 8px;
          }
          .grid-table td {
            padding: 5px 8px;
            border: 1px solid #cbd5e1;
            font-size: 9pt;
            vertical-align: top;
          }
          .grid-table td.lbl {
            font-weight: 700;
            background-color: #f1f5f9;
            width: 25%;
            color: #334155;
          }
          .grid-table td.val {
            color: #0f172a;
            font-weight: 500;
            width: 25%;
          }
          .stat-summary {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 12px;
          }
          .stat-summary td {
            width: 33.33%;
            text-align: center;
            padding: 8px;
            border: 1px solid #cbd5e1;
            background-color: #f8fafc;
          }
          .stat-summary .stat-title {
            font-size: 7.5pt;
            text-transform: uppercase;
            font-weight: 700;
            color: #64748b;
          }
          .stat-summary .stat-val {
            font-size: 12pt;
            font-weight: 800;
            margin-top: 2px;
          }
          .sig-container {
            width: 100%;
            border-collapse: collapse;
            margin-top: 25px;
            page-break-inside: avoid;
          }
          .sig-container td {
            width: 33.33%;
            text-align: center;
            vertical-align: top;
            font-size: 8.5pt;
          }
          .sig-space {
            height: 48px;
          }
          .sig-name {
            font-weight: 700;
            text-decoration: underline;
          }
          .no-print-bar {
            background-color: #0f172a;
            color: white;
            padding: 10px 16px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            position: sticky;
            top: 0;
            z-index: 9999;
            box-shadow: 0 2px 8px rgba(0,0,0,0.2);
          }
          .btn-print {
            background-color: #10b981;
            color: white;
            border: none;
            padding: 6px 14px;
            border-radius: 6px;
            font-weight: bold;
            font-size: 12px;
            cursor: pointer;
          }
          .btn-close {
            background-color: #475569;
            color: white;
            border: none;
            padding: 6px 12px;
            border-radius: 6px;
            font-size: 12px;
            cursor: pointer;
          }
          @media print {
            .no-print-bar { display: none !important; }
            body { background: white; margin: 0; }
          }
        </style>
      </head>
      <body>
        <div class="no-print-bar">
          <div style="font-weight: bold; font-size: 13px;">
            📄 Dokumen Himpunan Data Siswa (HDS) Format PDF - ${siswa.nama}
          </div>
          <div style="display: flex; gap: 8px;">
            <button class="btn-print" onclick="window.print()">🖨️ Simpan sebagai PDF / Cetak</button>
            <button class="btn-close" onclick="window.close()">Tutup</button>
          </div>
        </div>

        <div style="padding: 15px;">
          <div class="kop-container">
            <h1>PEMERINTAH KOTA TANGERANG SELATAN</h1>
            <h2>DINAS PENDIDIKAN DAN KEBUDAYAAN</h2>
            <h3>UPTD SMP NEGERI 17 KOTA TANGERANG SELATAN</h3>
            <p>Jl. Melati III No.2, Komplek Batan Indah, Kec. Setu, Kota Tangerang Selatan, Banten 15314</p>
          </div>

          <div class="title-box">
            <h4>DOKUMEN HIMPUNAN DATA SISWA (HDS) KOMPREHENSIF</h4>
            <p>Tahun Pelajaran 2025/2026 - Rombongan Belajar: ${kelasName}</p>
          </div>

          <table class="stat-summary">
            <tr>
              <td>
                <div class="stat-title">Poin Disiplin Active</div>
                <div class="stat-val" style="color: ${points > 50 ? '#dc2626' : '#d97706'};">${points} Pts</div>
              </td>
              <td>
                <div class="stat-title">Layanan Konseling BK</div>
                <div class="stat-val" style="color: #0284c7;">${counselingCount} Kali</div>
              </td>
              <td>
                <div class="stat-title">Rekam Prestasi</div>
                <div class="stat-val" style="color: #059669;">${achievementsCount} Log</div>
              </td>
            </tr>
          </table>

          <div class="sec-header">1. BIODATA & IDENTITAS SISWA</div>
          <table class="grid-table">
            <tr>
              <td class="lbl">Nama Lengkap Siswa</td>
              <td class="val" style="font-size: 9.5pt; font-weight: bold;">${siswa.nama}</td>
              <td class="lbl">Jenis Kelamin</td>
              <td class="val">${siswa.jenisKelamin}</td>
            </tr>
            <tr>
              <td class="lbl">NIS / NISN</td>
              <td class="val">${siswa.nis || '-'} / ${siswa.nisn || '-'}</td>
              <td class="lbl">Kelas / Rombel</td>
              <td class="val"><b>${kelasName}</b></td>
            </tr>
            <tr>
              <td class="lbl">Tempat, Tanggal Lahir</td>
              <td class="val">${siswa.tempatLahir || '-'}, ${siswa.tanggalLahir || '-'}</td>
              <td class="lbl">Agama</td>
              <td class="val">${siswa.agama || '-'}</td>
            </tr>
            <tr>
              <td class="lbl">Nomor HP / Kontak</td>
              <td class="val">${siswa.nomorHp || '-'}</td>
              <td class="lbl">Alamat Lengkap</td>
              <td class="val">${siswa.alamat || '-'}</td>
            </tr>
          </table>

          <div class="sec-header">2. DATA ORANG TUA / WALI</div>
          <table class="grid-table">
            <tr>
              <td class="lbl">Nama Ayah Kandung</td>
              <td class="val"><b>${ortu?.namaAyah || '-'}</b></td>
              <td class="lbl">Pekerjaan Ayah</td>
              <td class="val">${ortu?.pekerjaanAyah || '-'}</td>
            </tr>
            <tr>
              <td class="lbl">Nama Ibu Kandung</td>
              <td class="val"><b>${ortu?.namaIbu || '-'}</b></td>
              <td class="lbl">Pekerjaan Ibu</td>
              <td class="val">${ortu?.pekerjaanIbu || '-'}</td>
            </tr>
            <tr>
              <td class="lbl">No. HP Orang Tua</td>
              <td class="val">${ortu?.noHpAyah || ortu?.noHpIbu || '-'}</td>
              <td class="lbl">Pendidikan / Penghasilan</td>
              <td class="val">${ortu?.pendidikanOrangTua || '-'} / ${ortu?.penghasilan || '-'}</td>
            </tr>
          </table>

          <div class="sec-header">3. KESEHATAN & PROFIL EKONOMI</div>
          <table class="grid-table">
            <tr>
              <td class="lbl">Fisik (Tinggi / Berat / GolDarah)</td>
              <td class="val">${kes?.tinggiBadan || '-'} cm / ${kes?.beratBadan || '-'} kg / Gol: ${kes?.golonganDarah || '-'}</td>
              <td class="lbl">Riwayat Penyakit / Alergi</td>
              <td class="val">${kes?.penyakit || 'Tidak ada'} / ${kes?.alergi || 'Tidak ada'}</td>
            </tr>
            <tr>
              <td class="lbl">Status Rumah & Kendaraan</td>
              <td class="val">${eko?.statusRumah || '-'} / ${eko?.kendaraan || '-'}</td>
              <td class="lbl">Penerima Bantuan Sosial</td>
              <td class="val">
                PIP: ${eko?.pip ? 'Ya' : 'Tidak'} | PKH: ${eko?.pkh ? 'Ya' : 'Tidak'} | KIP: ${eko?.kip ? 'Ya' : 'Tidak'}
              </td>
            </tr>
          </table>

          <div class="sec-header">4. PROFIL PSIKOLOGI, SOSIAL & ASESMEN</div>
          <table class="grid-table">
            <tr>
              <td class="lbl">Gaya Belajar & Cita-cita</td>
              <td class="val">${psi?.gayaBelajar || '-'} / ${psi?.citaCita || '-'}</td>
              <td class="lbl">Minat, Hobi & Bakat</td>
              <td class="val">${psi?.minat || '-'}, ${psi?.hobi || '-'} / Bakat: ${psi?.bakat || '-'}</td>
            </tr>
            <tr>
              <td class="lbl">Skor IQ / Asesmen DCM</td>
              <td class="val">IQ: ${ase?.iq || '-'} | DCM: ${ase?.dcm || '-'}</td>
              <td class="lbl">Hasil AKPD & AUM</td>
              <td class="val">AKPD: ${ase?.akpd || '-'} | AUM: ${ase?.aum || '-'}</td>
            </tr>
            <tr>
              <td class="lbl">Nilai Rapor & Catatan Wali Kelas</td>
              <td class="val" colspan="3">
                Rata-Rata Rapor: <b>${aka?.rataRataRaport || '-'}</b> | Catatan: ${aka?.catatanWaliKelas || '-'}
              </td>
            </tr>
          </table>

          <table class="sig-container">
            <tr>
              <td>
                <div>Mengetahui,</div>
                <div>Kepala UPTD SMPN 17 Tangsel</div>
                <div class="sig-space"></div>
                <div class="sig-name">...................................................</div>
                <div style="font-size: 8pt; color: #64748b; margin-top: 2px;">NIP. ...............................................</div>
              </td>
              <td>
                <div>Wali Kelas ${kelasName}</div>
                <div class="sig-space"></div>
                <div class="sig-name">${waliKelasName}</div>
                <div style="font-size: 8pt; color: #64748b; margin-top: 2px;">NIP. ...............................................</div>
              </td>
              <td>
                <div>Tangerang Selatan, ${dateTodayStr}</div>
                <div>Guru Bimbingan Konseling (BK)</div>
                <div class="sig-space"></div>
                <div class="sig-name">${guruBkName}</div>
                <div style="font-size: 8pt; color: #64748b; margin-top: 2px;">NIP. ...............................................</div>
              </td>
            </tr>
          </table>
        </div>

        <script>
          window.onload = function() {
            setTimeout(function() {
              window.print();
            }, 600);
          };
        </script>
      </body>
      </html>
    `;

    const win = window.open('', '_blank');
    if (win) {
      win.document.open();
      win.document.write(docHtml);
      win.document.close();
    } else {
      const blob = new Blob([docHtml], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `HDS_Lengkap_${siswa.nama.replace(/\s+/g, '_')}_${kelasName.replace(/\s+/g, '_')}.html`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  const handleDownloadKehadiranSiswaDoc = (siswaId: string) => {
    if (!db) return;
    const siswa = db.siswa.find(s => s.id === siswaId);
    if (!siswa) return;

    const kelas = db.kelas.find(c => c.id === siswa.kelasId || c.namaKelas.toLowerCase().trim() === siswa.kelasId?.toLowerCase().trim());
    const kelasName = kelas?.namaKelas || currentClassName || 'Kelas';
    const waliKelas = db.users.find(u => u.id === kelas?.waliKelasId) || currentUser;
    const waliKelasName = waliKelas?.nama || currentUser.nama || 'Wali Kelas';
    const guruBk = db.users.find(u => u.role === UserRole.GURU_BK);
    const guruBkName = guruBk?.nama || 'Guru Bimbingan Konseling';

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

  const handleDownloadKehadiranKelasDoc = (namaKelasTarget: string) => {
    if (!db) return;
    const targetKelas = db.kelas.find(c => c.namaKelas.toLowerCase().trim() === namaKelasTarget.toLowerCase().trim() || c.id === namaKelasTarget);
    const namaKelas = targetKelas?.namaKelas || namaKelasTarget || currentClassName;
    
    const siswaListInKelas = classStudents;

    const waliKelas = db.users.find(u => u.id === targetKelas?.waliKelasId) || currentUser;
    const waliKelasName = waliKelas?.nama || currentUser.nama || 'Wali Kelas';
    const guruBk = db.users.find(u => u.role === UserRole.GURU_BK);
    const guruBkName = guruBk?.nama || 'Guru Bimbingan Konseling';

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

  const handleDownloadKehadiranMingguDoc = (namaKelasTarget: string, targetMinggu: string, targetBulan: string) => {
    if (!db) return;
    const targetKelas = db.kelas.find(c => c.namaKelas.toLowerCase().trim() === namaKelasTarget.toLowerCase().trim() || c.id === namaKelasTarget);
    const namaKelas = targetKelas?.namaKelas || namaKelasTarget || currentClassName;
    
    const siswaListInKelas = classStudents;
    const waliKelas = db.users.find(u => u.id === targetKelas?.waliKelasId) || currentUser;
    const waliKelasName = waliKelas?.nama || currentUser.nama || 'Wali Kelas';
    const guruBkName = db.users.find(u => (u.role as string) === 'bk' || ((u as any).jabatan && String((u as any).jabatan).toLowerCase().includes('bk')))?.nama || 'Guru BK';

    const dateTodayStr = new Date().toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });

    let totalHadirMinggu = 0;
    let totalSakitMinggu = 0;
    let totalIzinMinggu = 0;
    let totalAlfaMinggu = 0;

    const studentRowsHtml = siswaListInKelas.length > 0 ? siswaListInKelas.map((s, idx) => {
      const records = (db.kehadiran || []).filter(k => 
        k.siswaId === s.id &&
        String(k.mingguKe || '').toLowerCase().trim() === String(targetMinggu).toLowerCase().trim() &&
        (targetBulan === 'ALL' || String(k.bulan || '').toLowerCase().trim() === String(targetBulan).toLowerCase().trim())
      );

      let h = 0, sk = 0, iz = 0, al = 0;
      let keterangan = '-';
      records.forEach(item => {
        h += Number(item.hadir || 0);
        sk += Number(item.sakit || 0);
        iz += Number(item.izin || (item as any).ijin || 0);
        al += Number(item.alfa || 0);
        if (item.keterangan) keterangan = item.keterangan;
      });

      totalHadirMinggu += h;
      totalSakitMinggu += sk;
      totalIzinMinggu += iz;
      totalAlfaMinggu += al;

      const tot = h + sk + iz + al;
      const pct = tot > 0 ? Math.round((h / tot) * 100) : 100;

      let statusBadge = '<span style="color: #047857; font-weight: bold;">Hadir Tepat</span>';
      if (pct < 75 || al >= 2) {
        statusBadge = '<span style="color: #dc2626; font-weight: bold;">Atensi Khusus (Alfa)</span>';
      } else if (pct < 85 || sk > 0 || iz > 0) {
        statusBadge = '<span style="color: #d97706; font-weight: bold;">Izin / Sakit</span>';
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
          <td style="text-align: center;">
            <div style="background-color: #e2e8f0; border-radius: 4px; overflow: hidden; height: 12px; width: 100px; display: inline-block;">
              <div style="background-color: ${pct >= 85 ? '#059669' : (pct >= 70 ? '#d97706' : '#dc2626')}; height: 100%; width: ${pct}%;"></div>
            </div>
            <br/><span style="font-size: 8.5pt; font-weight: bold;">${pct}%</span>
          </td>
          <td style="text-align: center;">${statusBadge}</td>
          <td>${keterangan}</td>
        </tr>
      `;
    }).join('') : `
      <tr>
        <td colspan="10" style="text-align: center; padding: 15px; color: #888;">Belum ada data presensi terdaftar untuk periode ini.</td>
      </tr>
    `;

    const totalHariMinggu = totalHadirMinggu + totalSakitMinggu + totalIzinMinggu + totalAlfaMinggu;
    const pctMinggu = totalHariMinggu > 0 ? Math.round((totalHadirMinggu / totalHariMinggu) * 100) : 100;

    const docHtml = `
      <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word" xmlns="http://www.w3.org/TR/REC-html40">
      <head>
        <meta charset="utf-8">
        <title>Laporan Kehadiran Mingguan - ${targetMinggu} ${targetBulan} - Kelas ${namaKelas}</title>
        <style>
          @page {
            size: A4 landscape;
            margin: 1.2cm 1.5cm 1.2cm 1.5cm;
          }
          body {
            font-family: 'Times New Roman', Times, serif;
            color: #000000;
            line-height: 1.4;
            font-size: 10pt;
          }
          .kop-text {
            text-align: center;
          }
          .doc-title {
            text-align: center;
            margin-bottom: 18px;
          }
          .doc-title h3 {
            margin: 0;
            font-size: 13pt;
            font-weight: bold;
            text-transform: uppercase;
            text-decoration: underline;
          }
          .kpi-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 15px;
          }
          .kpi-table td {
            padding: 8px;
            border: 1px solid #333333;
            text-align: center;
            background-color: #f8fafc;
          }
          .data-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 15px;
            font-size: 9.5pt;
          }
          .data-table th {
            background-color: #f1f5f9;
            color: #0f172a;
            font-weight: bold;
            text-transform: uppercase;
            font-size: 8.5pt;
            padding: 6px;
            border: 1px solid #000000;
            text-align: center;
          }
          .data-table td {
            padding: 5px 6px;
            border: 1px solid #000000;
            vertical-align: middle;
          }
          .sig-table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 25px;
            page-break-inside: avoid;
          }
          .sig-table td {
            width: 33%;
            text-align: center;
            vertical-align: top;
            font-size: 10pt;
          }
          .sig-space {
            height: 55px;
          }
          .sig-name {
            font-weight: bold;
            text-decoration: underline;
          }
        </style>
      </head>
      <body>
        <div class="kop-text" style="border-bottom: 3px double #000000; padding-bottom: 5px; margin-bottom: 15px;">
          <span style="font-size: 11pt; font-weight: bold; text-transform: uppercase;">PEMERINTAH KOTA TANGERANG SELATAN</span><br/>
          <span style="font-size: 10.5pt; font-weight: bold; text-transform: uppercase;">DINAS PENDIDIKAN DAN KEBUDAYAAN</span><br/>
          <span style="font-size: 13pt; font-weight: bold; text-transform: uppercase;">UPTD SMP NEGERI 17 KOTA TANGERANG SELATAN</span><br/>
          <span style="font-size: 8.5pt; font-style: italic;">Jl. Melati III No.2, Komplek Batan Indah, Kec. Setu, Kota Tangerang Selatan, Banten 15314</span>
        </div>

        <div class="doc-title">
          <h3>LAPORAN REKAPITULASI PRESENSI & GRAFIK KEHADIRAN MINGGUAN SISWA</h3>
          <p>PERIODE: <b>${targetMinggu.toUpperCase()} &ndash; BULAN ${targetBulan.toUpperCase()} 2026</b> | KELAS: <b>${namaKelas}</b></p>
          <p style="font-size: 8.5pt; color: #555;">Tanggal Cetak Laporan: ${dateTodayStr}</p>
        </div>

        <table class="kpi-table">
          <tr>
            <td>
              <div style="font-size: 8pt; font-weight: bold; color: #047857;">PERSENTASE KEHADIRAN</div>
              <div style="font-size: 14pt; font-weight: bold; color: #047857;">${pctMinggu}%</div>
            </td>
            <td>
              <div style="font-size: 8pt; font-weight: bold; color: #047857;">TOTAL HADIR</div>
              <div style="font-size: 14pt; font-weight: bold; color: #047857;">${totalHadirMinggu} Hari</div>
            </td>
            <td>
              <div style="font-size: 8pt; font-weight: bold; color: #0284c7;">TOTAL SAKIT</div>
              <div style="font-size: 14pt; font-weight: bold; color: #0284c7;">${totalSakitMinggu} Hari</div>
            </td>
            <td>
              <div style="font-size: 8pt; font-weight: bold; color: #d97706;">TOTAL IZIN</div>
              <div style="font-size: 14pt; font-weight: bold; color: #d97706;">${totalIzinMinggu} Hari</div>
            </td>
            <td>
              <div style="font-size: 8pt; font-weight: bold; color: #dc2626;">TOTAL ALFA</div>
              <div style="font-size: 14pt; font-weight: bold; color: #dc2626;">${totalAlfaMinggu} Hari</div>
            </td>
          </tr>
        </table>

        <div style="font-weight: bold; font-size: 10.5pt; margin-top: 15px; margin-bottom: 8px; background-color: #064e3b; color: #ffffff; padding: 5px 10px;">
          DAFTAR RINCIAN PRESENSI SISWA PERIODE ${targetMinggu.toUpperCase()} (${targetBulan.toUpperCase()})
        </div>

        <table class="data-table">
          <thead>
            <tr>
              <th style="width: 4%;">No</th>
              <th style="width: 22%;">Nama Siswa</th>
              <th style="width: 12%;">NIS / NISN</th>
              <th style="width: 9%;">Hadir</th>
              <th style="width: 9%;">Sakit</th>
              <th style="width: 9%;">Izin</th>
              <th style="width: 9%;">Alfa</th>
              <th style="width: 12%;">Diagram Visual (%)</th>
              <th style="width: 14%;">Status Presensi</th>
              <th style="width: 10%;">Keterangan</th>
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
              <div>NIP. Wali Kelas</div>
            </td>
            <td>
              <div>Mengetahui,</div>
              <div><b>Guru Bimbingan Konseling (BK)</b></div>
              <div class="sig-space"></div>
              <div class="sig-name">${guruBkName}</div>
              <div>NIP. Guru BK</div>
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
    const safeKelas = namaKelas.replace(/[^a-zA-Z0-9]/g, '_');
    const safeMinggu = targetMinggu.replace(/[^a-zA-Z0-9]/g, '_');
    link.download = `Laporan_Presensi_${safeKelas}_${safeMinggu}_${targetBulan}_${new Date().toISOString().split('T')[0]}.doc`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
    return classKehadiran.filter(k => {
      const student = db?.siswa.find(s => s.id === k.siswaId);
      const q = searchQuery.toLowerCase();
      const matchSearch = !q || (
        (student && student.nama.toLowerCase().includes(q)) ||
        k.mingguKe.toLowerCase().includes(q) ||
        k.bulan.toLowerCase().includes(q) ||
        (k.keterangan && k.keterangan.toLowerCase().includes(q))
      );

      let matchBulan = true;
      if (attendanceFilterBulan !== 'ALL') {
        matchBulan = String(k.bulan || '').toLowerCase().trim() === attendanceFilterBulan.toLowerCase().trim();
      }

      let matchMinggu = true;
      if (attendanceFilterMinggu !== 'ALL') {
        matchMinggu = String(k.mingguKe || '').toLowerCase().trim() === attendanceFilterMinggu.toLowerCase().trim();
      }

      return matchSearch && matchBulan && matchMinggu;
    });
  }, [classKehadiran, searchQuery, attendanceFilterBulan, attendanceFilterMinggu, db]);

  // Weekly attendance breakdown stats (Minggu 1 s.d. Minggu 5)
  const weeklyBreakdownStats = useMemo(() => {
    const weeks = ['Minggu 1', 'Minggu 2', 'Minggu 3', 'Minggu 4', 'Minggu 5'];
    return weeks.map(weekLabel => {
      const weekRecords = classKehadiran.filter(k => {
        const matchWeek = String(k.mingguKe || '').toLowerCase().trim() === weekLabel.toLowerCase().trim();
        let matchBulan = true;
        if (attendanceFilterBulan !== 'ALL') {
          matchBulan = String(k.bulan || '').toLowerCase().trim() === attendanceFilterBulan.toLowerCase().trim();
        }
        return matchWeek && matchBulan;
      });

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
  }, [classKehadiran, attendanceFilterBulan]);

  const classAttendanceMetrics = useMemo(() => {
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

    return {
      totalHadir,
      totalSakit,
      totalIzin,
      totalAlfa,
      totalHari,
      percentage
    };
  }, [classKehadiran]);

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
          let isLocked = false;
          if (currentUser.role === UserRole.GURU_BK && db && db.kelas && db.kelas.length > 0) {
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
        <div className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
          <span>Pilih Rombongan Belajar Kelas {activeLevel}:</span>
          {allowedClassName && (
            <span className="text-[10px] text-indigo-600 font-semibold bg-indigo-50 px-2 py-0.5 rounded-md">
              Akses Semua Sub-Rombel (Wali Kelas Utama: {allowedClassName})
            </span>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          {Array.from({ length: 11 }, (_, i) => `Kelas ${activeLevel}-${i + 1}`).map((cls) => {
            const isActive = currentClassName === cls;
            let isLocked = false;
            if (currentUser.role === UserRole.GURU_BK && db && db.kelas && db.kelas.length > 0) {
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
            onClick={() => { setActiveSubFeature('ringkasan_remisi'); setSearchQuery(''); }}
            className={`flex-1 min-w-[140px] py-2.5 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
              activeSubFeature === 'ringkasan_remisi' ? 'bg-amber-500 text-slate-950 shadow-xs border border-amber-400 font-black' : 'bg-amber-50/60 text-amber-800 hover:bg-amber-100/80 border border-amber-200/50'
            }`}
          >
            ⭐ Ringkasan Remisi Poin
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

          {/* TAB 1: Himpunan Data Siswa (HDS) */}
          {activeSubFeature === 'hds' && (
            <div className="space-y-4">
              <div className="bg-indigo-50/50 border border-indigo-100/30 p-3 rounded-xl flex items-center justify-between gap-2.5 text-[11px] text-indigo-800 font-medium">
                <div className="flex items-center gap-2">
                  <Info size={14} className="shrink-0 text-indigo-600" />
                  <span>Fitur Himpunan Data Siswa (HDS) kelas {currentClassName}. Anda dapat melihat detail biodata & mengunduh berkas format PDF per-siswa.</span>
                </div>
              </div>

              {filteredStudents.length === 0 ? (
                <div className="py-10 text-center border-2 border-dashed border-slate-100 rounded-xl">
                  <p className="text-xs text-slate-400 font-bold">Tidak ada data siswa ditemukan</p>
                </div>
              ) : (
                <div className="bg-white rounded-2xl border border-slate-100 shadow-xs overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                          <th className="p-3 text-center w-10">No</th>
                          <th className="p-3">Nama Siswa</th>
                          <th className="p-3">NIS / NISN</th>
                          <th className="p-3">Jenis Kelamin</th>
                          <th className="p-3">Kontak / Ortu</th>
                          <th className="p-3 text-center">Detail HDS</th>
                          <th className="p-3 text-center bg-indigo-50/60 text-indigo-900">Unduh Format PDF</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                        {filteredStudents.map((s, idx) => {
                          const ortu = db?.orangTua?.find(o => o.id === s.id);
                          return (
                            <tr key={s.id} className="hover:bg-slate-50/50 transition-colors">
                              <td className="p-3 text-center font-bold text-slate-400">{idx + 1}</td>
                              <td className="p-3">
                                <p className="font-bold text-slate-800">{s.nama}</p>
                                <p className="text-[10px] text-slate-400">Agama: {s.agama || 'Islam'}</p>
                              </td>
                              <td className="p-3 font-mono text-[11px]">
                                <p className="text-slate-700 font-semibold">{s.nis || '-'}</p>
                                <p className="text-[9px] text-slate-400">{s.nisn || '-'}</p>
                              </td>
                              <td className="p-3">
                                <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                                  s.jenisKelamin === 'Laki-laki' ? 'bg-teal-50 text-teal-700 border border-teal-100' : 'bg-rose-50 text-rose-700 border border-rose-100'
                                }`}>
                                  {s.jenisKelamin}
                                </span>
                              </td>
                              <td className="p-3 text-slate-600">
                                <p className="font-semibold">{s.nomorHp || '-'}</p>
                                <p className="text-[10px] text-slate-400">Ortu: {ortu?.namaAyah || ortu?.namaIbu || '-'}</p>
                              </td>
                              <td className="p-3 text-center">
                                <button
                                  onClick={() => setSelectedSiswaId(s.id)}
                                  className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-lg text-[10px] font-black transition cursor-pointer inline-flex items-center gap-1"
                                >
                                  <Eye size={12} /> Detail HDS
                                </button>
                              </td>
                              <td className="p-3 text-center bg-indigo-50/20">
                                <button
                                  onClick={() => handleDownloadHdsPdf(s)}
                                  className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-[10px] font-bold transition cursor-pointer inline-flex items-center gap-1.5 shadow-xs"
                                  title="Unduh HDS format PDF lengkap"
                                >
                                  <FileDown size={13} /> Unduh Format PDF
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: Catatan Kedisiplinan - FULL ACCESS (TAMBAH, EDIT, HAPUS) */}
          {activeSubFeature === 'kedisiplinan' && (
            <div className="space-y-4">
              <div className="bg-rose-50 border border-rose-100 p-3.5 rounded-2xl flex flex-wrap items-center justify-between gap-3 shadow-2xs">
                <div className="flex items-center gap-2.5 text-xs text-rose-900 font-semibold">
                  <ShieldAlert size={18} className="text-rose-600 shrink-0" />
                  <span>Akses Penuh Wali Kelas: Anda dapat melihat, menambah, mengedit, dan menghapus catatan kedisiplinan & poin siswa kelas <b>{currentClassName}</b>.</span>
                </div>
                <button
                  onClick={() => {
                    setEditingPelanggaran(null);
                    setFormPelanggaran({
                      siswaId: filteredStudents[0]?.id || '',
                      tanggal: new Date().toISOString().split('T')[0],
                      jenisPelanggaran: '',
                      kategori: 'Ringan',
                      poin: 5,
                      guruPelapor: currentUser.nama || 'Wali Kelas',
                      tindakLanjut: 'Pembinaan Wali Kelas',
                      status: 'Selesai'
                    });
                    setShowPelanggaranModal(true);
                  }}
                  className="px-3.5 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-extrabold transition flex items-center gap-1.5 shadow-xs cursor-pointer"
                >
                  <Plus size={14} /> Tambah Catatan Kedisiplinan
                </button>
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
                        <th className="p-3 text-center">Aksi (Ubah & Hapus)</th>
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
                            <td className="p-3 text-center">
                              <div className="flex items-center justify-center gap-1.5">
                                <button
                                  onClick={() => {
                                    setEditingPelanggaran(p);
                                    setFormPelanggaran({
                                      siswaId: p.siswaId,
                                      tanggal: p.tanggal,
                                      jenisPelanggaran: p.jenisPelanggaran,
                                      kategori: p.kategori,
                                      poin: p.poin,
                                      guruPelapor: p.guruPelapor || currentUser.nama || 'Wali Kelas',
                                      tindakLanjut: p.tindakLanjut || 'Pembinaan Wali Kelas',
                                      status: p.status || 'Selesai'
                                    });
                                    setShowPelanggaranModal(true);
                                  }}
                                  className="p-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-lg transition cursor-pointer"
                                  title="Ubah / Edit Data"
                                >
                                  <Edit size={13} />
                                </button>
                                <button
                                  onClick={async () => {
                                    if (confirm('Apakah Anda yakin ingin menghapus catatan pelanggaran ini?')) {
                                      if (onDeletePelanggaran) await onDeletePelanggaran(p.id);
                                    }
                                  }}
                                  className="p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-lg transition cursor-pointer"
                                  title="Hapus Data"
                                >
                                  <Trash2 size={13} />
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
          )}

          {/* TAB 3: Log Remisi Poin - FULL ACCESS (TAMBAH, EDIT, HAPUS) */}
          {activeSubFeature === 'remisi' && (
            <div className="space-y-4">
              <div className="bg-emerald-50 border border-emerald-100 p-3.5 rounded-2xl flex flex-wrap items-center justify-between gap-3 shadow-2xs">
                <div className="flex items-center gap-2.5 text-xs text-emerald-900 font-semibold">
                  <Sparkles size={18} className="text-emerald-600 shrink-0" />
                  <span>Akses Penuh Wali Kelas: Anda dapat melihat, menambah, mengedit, dan menghapus log remisi poin siswa kelas <b>{currentClassName}</b>.</span>
                </div>
                <button
                  onClick={() => {
                    setEditingRemisi(null);
                    setFormRemisi({
                      siswaId: filteredStudents[0]?.id || '',
                      tanggal: new Date().toISOString().split('T')[0],
                      jenisRemisi: '',
                      kategori: 'Karakter Baik',
                      poin: 10,
                      guruPemberi: currentUser.nama || 'Wali Kelas',
                      keterangan: ''
                    });
                    setShowRemisiModal(true);
                  }}
                  className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-extrabold transition flex items-center gap-1.5 shadow-xs cursor-pointer"
                >
                  <Plus size={14} /> Tambah Log Remisi Poin
                </button>
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
                        <th className="p-3">Bentuk Pembinaan / Perilaku Baik</th>
                        <th className="p-3">Kategori</th>
                        <th className="p-3 text-center">Poin Remisi</th>
                        <th className="p-3">Guru Pemberi</th>
                        <th className="p-3 text-center">Aksi (Ubah & Hapus)</th>
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
                            <td className="p-3 text-center">
                              <div className="flex items-center justify-center gap-1.5">
                                <button
                                  onClick={() => {
                                    setEditingRemisi(r);
                                    setFormRemisi({
                                      siswaId: r.siswaId,
                                      tanggal: r.tanggal,
                                      jenisRemisi: r.jenisRemisi,
                                      kategori: r.kategori,
                                      poin: r.poin,
                                      guruPemberi: r.guruPemberi || currentUser.nama || 'Wali Kelas',
                                      keterangan: r.keterangan || ''
                                    });
                                    setShowRemisiModal(true);
                                  }}
                                  className="p-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-lg transition cursor-pointer"
                                  title="Ubah / Edit Data"
                                >
                                  <Edit size={13} />
                                </button>
                                <button
                                  onClick={async () => {
                                    if (confirm('Apakah Anda yakin ingin menghapus log remisi poin ini?')) {
                                      if (onDeleteRemisiPoin) await onDeleteRemisiPoin(r.id);
                                    }
                                  }}
                                  className="p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-lg transition cursor-pointer"
                                  title="Hapus Data"
                                >
                                  <Trash2 size={13} />
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
          )}

          {/* TAB 4: ⭐ Ringkasan Remisi Poin Siswa (Semua Kelas 7-1 s.d. 9-11) */}
          {activeSubFeature === 'ringkasan_remisi' && (
            <div className="space-y-6">
              {/* Golden Star Appreciation Banner */}
              <div className="bg-gradient-to-r from-amber-500 via-amber-600 to-yellow-500 rounded-2xl p-5 text-slate-950 shadow-md relative overflow-hidden border border-amber-300">
                <div className="absolute -right-8 -bottom-8 w-40 h-40 bg-white/20 rounded-full blur-xl pointer-events-none" />
                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-1 text-amber-950 font-black text-xs uppercase tracking-wider mb-1">
                      <Star size={16} className="fill-slate-950 text-slate-950" />
                      <Star size={16} className="fill-slate-950 text-slate-950" />
                      <Star size={16} className="fill-slate-950 text-slate-950" />
                      <span className="ml-1 bg-slate-950 text-amber-400 px-2.5 py-0.5 rounded-full text-[10px]">APRESIASI BEHAVIOR & KARAKTER POSITIF</span>
                    </div>
                    <h3 className="text-xl font-black text-slate-950 flex items-center gap-2">
                      ⭐ Ringkasan Remisi Poin Siswa (Apresiasi Disiplin Positif)
                    </h3>
                    <p className="text-xs text-slate-900 font-medium mt-1 leading-relaxed max-w-3xl">
                      Menampilkan rekapitulasi siswa yang mendapatkan pengurangan poin pelanggaran (remisi) melalui pembinaan, kegiatan positif, serta perilaku terpuji di seluruh kelas 7-1 s.d. 9-11.
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1.5 bg-slate-950/90 text-amber-300 font-extrabold text-xs rounded-xl flex items-center gap-1.5 shadow-sm border border-amber-400/30">
                      <Sparkles size={14} className="text-amber-400" /> Pengurang Poin Aktif
                    </span>
                  </div>
                </div>
              </div>

              {/* Dropdown Search Controls Bar */}
              <div className="bg-white p-4 rounded-2xl border border-amber-200 shadow-xs space-y-3">
                <div className="text-xs font-bold text-slate-700 flex items-center gap-2">
                  <Search size={15} className="text-amber-600" />
                  <span>Filter Pencarian Ringkasan Remisi Poin:</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {/* Dropdown Filter Kelas */}
                  <div>
                    <label className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider block mb-1">
                      Pilih Kelas (Dropdown)
                    </label>
                    <select
                      value={filterRemisiClass}
                      onChange={(e) => {
                        setFilterRemisiClass(e.target.value);
                        setFilterRemisiSiswaId('ALL'); // Reset student filter when class changes
                      }}
                      className="w-full px-3.5 py-2.5 bg-amber-50/30 border border-amber-200 focus:border-amber-500 focus:bg-white rounded-xl text-xs font-bold text-slate-800 focus:outline-none"
                    >
                      <option value="ALL">🌟 Semua Kelas (Kelas 7-1 s.d. 9-11)</option>
                      {['7', '8', '9'].map(level => (
                        Array.from({ length: 11 }, (_, i) => `Kelas ${level}-${i + 1}`).map(clsName => (
                          <option key={clsName} value={clsName}>{clsName}</option>
                        ))
                      ))}
                    </select>
                  </div>

                  {/* Dropdown Filter Nama Siswa */}
                  <div>
                    <label className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider block mb-1">
                      Pilih Nama Siswa (Dropdown)
                    </label>
                    <select
                      value={filterRemisiSiswaId}
                      onChange={(e) => setFilterRemisiSiswaId(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-amber-50/30 border border-amber-200 focus:border-amber-500 focus:bg-white rounded-xl text-xs font-bold text-slate-800 focus:outline-none"
                    >
                      <option value="ALL">👤 Semua Siswa Penerima Remisi</option>
                      {db?.siswa
                        ?.filter(s => {
                          if (filterRemisiClass === 'ALL') return true;
                          return getStudentClassName(s).toLowerCase().trim() === filterRemisiClass.toLowerCase().trim();
                        })
                        .sort((a, b) => a.nama.localeCompare(b.nama))
                        .map(s => (
                          <option key={s.id} value={s.id}>
                            {s.nama} ({getStudentClassName(s)} - NIS: {s.nis || '-'})
                          </option>
                        ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Data Calculations */}
              {(() => {
                const allRemisi = db?.remisiPoin || [];
                const matchingRemisi = allRemisi.filter(r => {
                  const student = db?.siswa.find(s => s.id === r.siswaId);
                  if (!student) return false;

                  const studentClass = getStudentClassName(student);

                  if (filterRemisiClass !== 'ALL' && studentClass.toLowerCase().trim() !== filterRemisiClass.toLowerCase().trim()) {
                    return false;
                  }

                  if (filterRemisiSiswaId !== 'ALL' && r.siswaId !== filterRemisiSiswaId) {
                    return false;
                  }

                  return true;
                });

                const studentRemisiMap = new Map<string, { student: Siswa; totalRemisiPoints: number; records: RemisiPoin[] }>();

                matchingRemisi.forEach(r => {
                  const student = db?.siswa.find(s => s.id === r.siswaId);
                  if (!student) return;

                  if (!studentRemisiMap.has(student.id)) {
                    studentRemisiMap.set(student.id, {
                      student,
                      totalRemisiPoints: 0,
                      records: []
                    });
                  }
                  const entry = studentRemisiMap.get(student.id)!;
                  entry.totalRemisiPoints += (r.poin || 0);
                  entry.records.push(r);
                });

                const studentSummaries = Array.from(studentRemisiMap.values())
                  .sort((a, b) => b.totalRemisiPoints - a.totalRemisiPoints);

                const totalPointsGranted = matchingRemisi.reduce((sum, r) => sum + (r.poin || 0), 0);

                return (
                  <div className="space-y-6">
                    {/* Metrics Summary */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200/80 p-4 rounded-2xl flex items-center gap-3">
                        <div className="w-10 h-10 bg-amber-500 rounded-xl flex items-center justify-center text-slate-950 font-black shadow-xs shrink-0">
                          <Star size={20} className="fill-slate-950 text-slate-950" />
                        </div>
                        <div>
                          <p className="text-[10px] font-extrabold text-amber-800 uppercase tracking-wider">Total Siswa Apresiasi</p>
                          <p className="text-xl font-black text-slate-900">{studentSummaries.length} Siswa</p>
                        </div>
                      </div>

                      <div className="bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200/80 p-4 rounded-2xl flex items-center gap-3">
                        <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center text-white font-black shadow-xs shrink-0">
                          <Sparkles size={20} />
                        </div>
                        <div>
                          <p className="text-[10px] font-extrabold text-emerald-800 uppercase tracking-wider">Total Capaian Poin Remisi</p>
                          <p className="text-xl font-black text-emerald-700">-{totalPointsGranted} Poin</p>
                        </div>
                      </div>

                      <div className="bg-gradient-to-br from-indigo-50 to-sky-50 border border-indigo-200/80 p-4 rounded-2xl flex items-center gap-3">
                        <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-black shadow-xs shrink-0">
                          <Award size={20} />
                        </div>
                        <div>
                          <p className="text-[10px] font-extrabold text-indigo-800 uppercase tracking-wider">Total Catatan Log</p>
                          <p className="text-xl font-black text-indigo-900">{matchingRemisi.length} Log Kegiatan</p>
                        </div>
                      </div>
                    </div>

                    {/* Student Summaries List */}
                    {studentSummaries.length === 0 ? (
                      <div className="py-14 text-center bg-white border border-dashed border-amber-200 rounded-2xl text-slate-400 text-xs space-y-2">
                        <Star size={32} className="mx-auto text-amber-300 animate-bounce" />
                        <p className="font-semibold text-slate-600">Tidak ada data ringkasan remisi poin untuk filter pilihan saat ini.</p>
                        <p className="text-[11px] text-slate-400">Silakan ubah dropdown kelas atau nama siswa di atas.</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {studentSummaries.map(({ student, totalRemisiPoints, records }) => {
                          const clsName = getStudentClassName(student);
                          return (
                            <div key={student.id} className="bg-white rounded-2xl border border-amber-200 shadow-xs overflow-hidden transition hover:shadow-md">
                              {/* Header Card with Star Decorations */}
                              <div className="bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 p-4 border-b border-amber-300 flex flex-wrap items-center justify-between gap-3 text-slate-950">
                                <div className="flex items-center gap-3">
                                  <div className="w-10 h-10 bg-slate-950 text-amber-400 rounded-xl flex items-center justify-center font-black text-sm shadow-xs border border-amber-400/40 shrink-0">
                                    ⭐
                                  </div>
                                  <div>
                                    <div className="flex items-center gap-1.5 flex-wrap">
                                      <h4 className="text-sm font-extrabold text-slate-950">{student.nama}</h4>
                                      <span className="px-2 py-0.5 bg-slate-950 text-amber-300 rounded-md text-[10px] font-black uppercase tracking-wider">
                                        {clsName}
                                      </span>
                                      <span className="text-[10px] font-mono text-slate-900 font-bold">
                                        NIS: {student.nis || '-'} | NISN: {student.nisn || '-'}
                                      </span>
                                    </div>
                                    <p className="text-[11px] text-slate-900 font-medium mt-0.5 flex items-center gap-1">
                                      <span>Apresiasi Perilaku Positif & Disiplin Baik</span>
                                      <span className="text-amber-950">⭐⭐⭐⭐⭐</span>
                                    </p>
                                  </div>
                                </div>

                                <div className="bg-slate-950 text-emerald-400 px-3.5 py-1.5 rounded-xl font-black text-xs flex items-center gap-1.5 shadow-sm border border-emerald-400/30">
                                  <Sparkles size={14} className="text-emerald-400" />
                                  <span>Capaian Poin Remisi: -{totalRemisiPoints} Poin</span>
                                </div>
                              </div>

                              {/* Detailed Breakdown List */}
                              <div className="p-4 bg-slate-50/50">
                                <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-2.5 flex items-center gap-1">
                                  <CheckCircle2 size={12} className="text-emerald-600" /> Rincian Log Remisi Poin Siswa:
                                </p>

                                <div className="overflow-x-auto rounded-xl border border-slate-200/80 bg-white shadow-2xs">
                                  <table className="w-full text-left text-xs border-collapse">
                                    <thead>
                                      <tr className="bg-slate-100/70 border-b border-slate-200 text-slate-600 font-extrabold text-[10px] uppercase tracking-wider">
                                        <th className="p-2.5">Tanggal</th>
                                        <th className="p-2.5">Kategori Remisi</th>
                                        <th className="p-2.5">Bentuk Perilaku Baik / Kegiatan Positif</th>
                                        <th className="p-2.5 text-center">Capaian Poin Remisi</th>
                                        <th className="p-2.5">Guru Pemberi Remisi</th>
                                        <th className="p-2.5">Keterangan / Catatan Tambahan</th>
                                      </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                                      {records.map((r) => (
                                        <tr key={r.id} className="hover:bg-amber-50/30">
                                          <td className="p-2.5 font-mono text-[10px] text-slate-500 whitespace-nowrap">{r.tanggal}</td>
                                          <td className="p-2.5">
                                            <span className="px-2 py-0.5 rounded-md text-[9px] font-bold bg-amber-100 text-amber-900 border border-amber-200">
                                              {r.kategori || 'Karakter Baik'}
                                            </span>
                                          </td>
                                          <td className="p-2.5 font-bold text-slate-800">{r.jenisRemisi}</td>
                                          <td className="p-2.5 text-center font-extrabold text-emerald-600 whitespace-nowrap">
                                            -{r.poin} pts ⭐
                                          </td>
                                          <td className="p-2.5 text-slate-600 font-medium">{r.guruPemberi || '-'}</td>
                                          <td className="p-2.5 text-slate-500 text-[11px]">{r.keterangan || '-'}</td>
                                        </tr>
                                      ))}
                                    </tbody>
                                  </table>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })()}
            </div>
          )}

          {/* TAB 5: Rekam Prestasi - FULL ACCESS (TAMBAH, EDIT, HAPUS) */}
          {activeSubFeature === 'prestasi' && (
            <div className="space-y-4">
              <div className="bg-amber-50 border border-amber-100 p-3.5 rounded-2xl flex flex-wrap items-center justify-between gap-3 shadow-2xs">
                <div className="flex items-center gap-2.5 text-xs text-amber-900 font-semibold">
                  <Award size={18} className="text-amber-600 shrink-0" />
                  <span>Akses Penuh Wali Kelas: Anda dapat melihat, menambah, mengedit, dan menghapus rekam prestasi siswa kelas <b>{currentClassName}</b>.</span>
                </div>
                <button
                  onClick={() => {
                    setEditingPrestasi(null);
                    setFormPrestasi({
                      siswaId: filteredStudents[0]?.id || '',
                      namaPrestasi: '',
                      tingkat: 'Sekolah',
                      tahun: new Date().getFullYear().toString(),
                      juara: 'Juara 1',
                      kategori: 'Akademik',
                      sertifikat: ''
                    });
                    setShowPrestasiModal(true);
                  }}
                  className="px-3.5 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-extrabold transition flex items-center gap-1.5 shadow-xs cursor-pointer"
                >
                  <Plus size={14} /> Tambah Rekam Prestasi
                </button>
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
                        <th className="p-3 text-center">Aksi (Ubah & Hapus)</th>
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
                            <td className="p-3 text-center">
                              <div className="flex items-center justify-center gap-1.5">
                                <button
                                  onClick={() => {
                                    setEditingPrestasi(p);
                                    setFormPrestasi({
                                      siswaId: p.siswaId,
                                      namaPrestasi: p.namaPrestasi,
                                      tingkat: p.tingkat,
                                      tahun: p.tahun,
                                      juara: p.juara,
                                      kategori: p.kategori || 'Akademik',
                                      sertifikat: p.sertifikat || ''
                                    });
                                    setShowPrestasiModal(true);
                                  }}
                                  className="p-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-lg transition cursor-pointer"
                                  title="Ubah / Edit Data"
                                >
                                  <Edit size={13} />
                                </button>
                                <button
                                  onClick={async () => {
                                    if (confirm('Apakah Anda yakin ingin menghapus rekam prestasi ini?')) {
                                      if (onDeletePrestasi) await onDeletePrestasi(p.id);
                                    }
                                  }}
                                  className="p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-lg transition cursor-pointer"
                                  title="Hapus Data"
                                >
                                  <Trash2 size={13} />
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
          )}

          {/* TAB: Rekap Kehadiran - WITH CHARTS, FILTERS, AND DOC DOWNLOADS */}
          {activeSubFeature === 'kehadiran' && (
            <div className="space-y-6">
              {/* Analytics & Graphic Summary Header */}
              <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-cyan-900 rounded-2xl p-5 text-white shadow-md relative overflow-hidden">
                <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />
                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <span className="px-2.5 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-full text-[10px] font-bold uppercase tracking-wider inline-flex items-center gap-1 mb-2">
                      <BarChart2 size={12} /> Dashboard Presensi Kelas {currentClassName}
                    </span>
                    <h3 className="text-lg font-black text-white">Grafik & Analytics Rekap Kehadiran</h3>
                    <p className="text-xs text-emerald-200/80 mt-0.5">
                      Visualisasi persentase kehadiran siswa, rekap mingguan/bulanan, dan pengunduhan format dokumen resmi.
                    </p>
                  </div>

                  <div className="flex items-center gap-2 self-start md:self-auto">
                    <button
                      onClick={() => handleDownloadKehadiranKelasDoc(currentClassName)}
                      className="px-3.5 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-sm cursor-pointer"
                    >
                      <Download size={14} /> Unduh DOC Class Report
                    </button>
                  </div>
                </div>

                {/* Metrics Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mt-5">
                  <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 border border-white/10">
                    <p className="text-[10px] text-emerald-200 uppercase font-bold tracking-wider">Tingkat Kehadiran</p>
                    <p className="text-xl font-extrabold text-emerald-300 mt-0.5">{classAttendanceMetrics.percentage}%</p>
                    <div className="w-full bg-emerald-950/50 h-1.5 rounded-full overflow-hidden mt-1.5">
                      <div className="bg-emerald-400 h-full rounded-full" style={{ width: `${classAttendanceMetrics.percentage}%` }} />
                    </div>
                  </div>

                  <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 border border-white/10">
                    <p className="text-[10px] text-emerald-200 uppercase font-bold tracking-wider">Total Hadir</p>
                    <p className="text-xl font-extrabold text-emerald-300 mt-0.5">{classAttendanceMetrics.totalHadir} Hari</p>
                    <p className="text-[9px] text-emerald-300/70 mt-1">Siswa Presensi Tepat</p>
                  </div>

                  <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 border border-white/10">
                    <p className="text-[10px] text-sky-200 uppercase font-bold tracking-wider">Total Sakit</p>
                    <p className="text-xl font-extrabold text-sky-300 mt-0.5">{classAttendanceMetrics.totalSakit} Hari</p>
                    <p className="text-[9px] text-sky-300/70 mt-1">Izin Keterangan Dokter</p>
                  </div>

                  <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 border border-white/10">
                    <p className="text-[10px] text-amber-200 uppercase font-bold tracking-wider">Total Izin</p>
                    <p className="text-xl font-extrabold text-amber-300 mt-0.5">{classAttendanceMetrics.totalIzin} Hari</p>
                    <p className="text-[9px] text-amber-300/70 mt-1">Izin Kepentingan Ortu</p>
                  </div>

                  <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 border border-white/10 col-span-2 sm:col-span-1">
                    <p className="text-[10px] text-rose-200 uppercase font-bold tracking-wider">Total Alfa</p>
                    <p className="text-xl font-extrabold text-rose-300 mt-0.5">{classAttendanceMetrics.totalAlfa} Hari</p>
                    <p className="text-[9px] text-rose-300/70 mt-1">Tanpa Keterangan</p>
                  </div>
                </div>
              </div>

              {/* Rekap Presensi Mingguan (Diagram & Visualisasi Cards) */}
              <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
                  <div>
                    <h4 className="text-sm font-extrabold text-slate-800 flex items-center gap-2">
                      <BarChart2 size={16} className="text-emerald-600" />
                      Diagram & Visualisasi Rekapitulasi Kehadiran Mingguan
                    </h4>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Statistik kehadiran per minggu {attendanceFilterBulan !== 'ALL' ? `(Bulan ${attendanceFilterBulan})` : '(Semua Bulan)'} lengkap dengan tombol cetak format DOC mingguan.
                    </p>
                  </div>
                  <button
                    onClick={() => handleDownloadKehadiranKelasDoc(currentClassName)}
                    className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-extrabold transition flex items-center gap-1.5 shadow-xs cursor-pointer self-start sm:self-auto"
                  >
                    <Download size={14} /> Unduh Format DOC Rekap Kelas
                  </button>
                </div>

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

                          {/* Progress Bar */}
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

                        <button
                          onClick={() => handleDownloadKehadiranMingguDoc(currentClassName, wStat.weekLabel, attendanceFilterBulan)}
                          className="w-full py-1.5 bg-slate-800 hover:bg-slate-900 text-white rounded-lg text-[10px] font-bold transition flex items-center justify-center gap-1 cursor-pointer shadow-2xs"
                          title={`Unduh Laporan Format DOC untuk ${wStat.weekLabel}`}
                        >
                          <FileDown size={12} className="text-emerald-400" /> Unduh DOC {wStat.weekLabel}
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Filter Bar with Tambah Button */}
              <div className="bg-white p-3.5 rounded-2xl border border-slate-100 shadow-xs flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-xs text-slate-600 font-semibold">
                  <Info size={15} className="text-emerald-600 shrink-0" />
                  <span>Daftar rekapitulasi presensi siswa kelas <b>{currentClassName}</b>. Anda dapat memfilter mingguan/bulanan, menambah, mengedit, dan mengunduh format DOC resmi.</span>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-bold text-slate-500 flex items-center gap-1">
                    <Filter size={12} /> Bulan:
                  </span>
                  <select
                    value={attendanceFilterBulan}
                    onChange={(e) => setAttendanceFilterBulan(e.target.value)}
                    className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:border-indigo-500"
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

                  <span className="text-xs font-bold text-slate-500">Minggu:</span>
                  <select
                    value={attendanceFilterMinggu}
                    onChange={(e) => setAttendanceFilterMinggu(e.target.value)}
                    className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:border-indigo-500"
                  >
                    <option value="ALL">Semua Minggu</option>
                    <option value="Minggu 1">Minggu 1</option>
                    <option value="Minggu 2">Minggu 2</option>
                    <option value="Minggu 3">Minggu 3</option>
                    <option value="Minggu 4">Minggu 4</option>
                    <option value="Minggu 5">Minggu 5</option>
                  </select>

                  <button
                    onClick={() => {
                      setEditingKehadiran(null);
                      setFormKehadiran({
                        siswaId: classStudents[0]?.id || '',
                        bulan: 'Juli',
                        mingguKe: 'Minggu 1',
                        tahun: '2026',
                        hadir: 5,
                        sakit: 0,
                        izin: 0,
                        alfa: 0
                      });
                      setShowKehadiranModal(true);
                    }}
                    className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-extrabold transition flex items-center gap-1 shadow-xs cursor-pointer"
                  >
                    <Plus size={13} /> Input Presensi
                  </button>
                </div>
              </div>

              {filteredKehadiran.length === 0 ? (
                <div className="py-12 text-center bg-white border border-slate-100 rounded-2xl text-slate-400 text-xs italic space-y-2">
                  <Calendar size={28} className="mx-auto text-slate-300" />
                  <p>Belum ada rekap kehadiran terdaftar untuk kelas {currentClassName} dengan kriteria filter aktif.</p>
                </div>
              ) : (
                <div className="bg-white rounded-2xl border border-slate-100 shadow-xs overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                          <th className="p-3">Nama Siswa</th>
                          <th className="p-3">Minggu & Periode</th>
                          <th className="p-3 text-center">Hadir</th>
                          <th className="p-3 text-center">Sakit</th>
                          <th className="p-3 text-center">Izin</th>
                          <th className="p-3 text-center">Alfa</th>
                          <th className="p-3">Keterangan</th>
                          <th className="p-3 text-center bg-emerald-50/50 text-emerald-800">Unduh DOC Siswa</th>
                          <th className="p-3 text-center bg-teal-50/50 text-teal-800">Unduh DOC Minggu</th>
                          <th className="p-3 text-center">Aksi (Ubah & Hapus)</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                        {filteredKehadiran.map((att) => {
                          const student = db?.siswa.find(s => s.id === att.siswaId);
                          const studentKelas = student ? getStudentClassName(student) : currentClassName;
                          return (
                            <tr key={att.id} className="hover:bg-slate-50/50">
                              <td className="p-3">
                                <p className="font-bold text-slate-800">{student?.nama || 'Siswa Dihapus'}</p>
                                <p className="text-[9px] text-slate-400">NIS: {student?.nis || '-'}</p>
                              </td>
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
                              <td className="p-3 text-center bg-emerald-50/20">
                                <button
                                  onClick={() => handleDownloadKehadiranSiswaDoc(att.siswaId)}
                                  className="px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[10px] font-bold transition inline-flex items-center gap-1 shadow-xs cursor-pointer"
                                  title="Unduh Laporan Format DOC per-Siswa"
                                >
                                  <FileDown size={12} /> Doc Siswa
                                </button>
                              </td>
                              <td className="p-3 text-center bg-teal-50/20">
                                <button
                                  onClick={() => handleDownloadKehadiranMingguDoc(studentKelas, att.mingguKe, att.bulan || 'ALL')}
                                  className="px-2.5 py-1.5 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-[10px] font-bold transition inline-flex items-center gap-1 shadow-xs cursor-pointer"
                                  title="Unduh Laporan Format DOC Rekap Minggu Ini"
                                >
                                  <FileDown size={12} /> Doc Minggu
                                </button>
                              </td>
                              <td className="p-3 text-center">
                                <div className="flex items-center justify-center gap-1.5">
                                  <button
                                    onClick={() => {
                                      setEditingKehadiran(att);
                                      setFormKehadiran({
                                        siswaId: att.siswaId,
                                        bulan: att.bulan || 'Juli',
                                        mingguKe: att.mingguKe || 'Minggu 1',
                                        tahun: att.tahun || '2026',
                                        hadir: att.hadir,
                                        sakit: att.sakit,
                                        izin: att.izin,
                                        alfa: att.alfa
                                      });
                                      setShowKehadiranModal(true);
                                    }}
                                    className="p-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-lg transition cursor-pointer"
                                    title="Ubah / Edit Data"
                                  >
                                    <Edit size={13} />
                                  </button>
                                  <button
                                    onClick={async () => {
                                      if (confirm('Apakah Anda yakin ingin menghapus catatan presensi ini?')) {
                                        if (onDeleteKehadiran) await onDeleteKehadiran(att.id);
                                      }
                                    }}
                                    className="p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-lg transition cursor-pointer"
                                    title="Hapus Data"
                                  >
                                    <Trash2 size={13} />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
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

      {/* MODAL 1: Pelanggaran / Kedisiplinan (Tambah & Edit) */}
      {showPelanggaranModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 border border-slate-100 shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-rose-50 text-rose-600 rounded-xl font-bold">
                  <ShieldAlert size={18} />
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-slate-900">
                    {editingPelanggaran ? 'Ubah Catatan Kedisiplinan' : 'Tambah Catatan Kedisiplinan'}
                  </h3>
                  <p className="text-[10px] text-slate-500">Kelas {currentClassName}</p>
                </div>
              </div>
              <button
                onClick={() => setShowPelanggaranModal(false)}
                className="p-1.5 hover:bg-slate-100 text-slate-400 rounded-xl transition cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            <form
              onSubmit={async (e) => {
                e.preventDefault();
                if (!onSavePelanggaran) return;
                const payload: any = {
                  ...(editingPelanggaran ? { id: editingPelanggaran.id } : {}),
                  ...formPelanggaran
                };
                await onSavePelanggaran(payload, !editingPelanggaran);
                setShowPelanggaranModal(false);
              }}
              className="space-y-3 text-xs"
            >
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                  Pilih Siswa
                </label>
                <select
                  value={formPelanggaran.siswaId}
                  onChange={(e) => setFormPelanggaran({ ...formPelanggaran, siswaId: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800 focus:outline-none focus:border-rose-500"
                  required
                >
                  {filteredStudents.map((s) => (
                    <option key={s.id} value={s.id}>{s.nama} (NIS: {s.nis || '-'})</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                    Tanggal
                  </label>
                  <input
                    type="date"
                    value={formPelanggaran.tanggal}
                    onChange={(e) => setFormPelanggaran({ ...formPelanggaran, tanggal: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-800 focus:outline-none focus:border-rose-500"
                    required
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                    Kategori
                  </label>
                  <select
                    value={formPelanggaran.kategori}
                    onChange={(e) => setFormPelanggaran({ ...formPelanggaran, kategori: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-800 focus:outline-none focus:border-rose-500"
                  >
                    <option value="Ringan">Ringan</option>
                    <option value="Sedang">Sedang</option>
                    <option value="Berat">Berat</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                  Jenis Pelanggaran / Keterangan Kasus
                </label>
                <input
                  type="text"
                  placeholder="Misal: Datang terlambat ke sekolah, atribut tidak lengkap"
                  value={formPelanggaran.jenisPelanggaran}
                  onChange={(e) => setFormPelanggaran({ ...formPelanggaran, jenisPelanggaran: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-800 focus:outline-none focus:border-rose-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                    Poin Pelanggaran (+)
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={formPelanggaran.poin}
                    onChange={(e) => setFormPelanggaran({ ...formPelanggaran, poin: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-rose-600 focus:outline-none focus:border-rose-500"
                    required
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                    Guru Pelapor
                  </label>
                  <input
                    type="text"
                    value={formPelanggaran.guruPelapor}
                    onChange={(e) => setFormPelanggaran({ ...formPelanggaran, guruPelapor: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-800 focus:outline-none focus:border-rose-500"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowPelanggaranModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl font-bold transition cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-bold transition flex items-center gap-1 shadow-xs cursor-pointer"
                >
                  <Save size={14} /> Simpan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: Log Remisi Poin (Tambah & Edit) */}
      {showRemisiModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 border border-slate-100 shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl font-bold">
                  <Sparkles size={18} />
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-slate-900">
                    {editingRemisi ? 'Ubah Log Remisi Poin' : 'Tambah Log Remisi Poin'}
                  </h3>
                  <p className="text-[10px] text-slate-500">Kelas {currentClassName}</p>
                </div>
              </div>
              <button
                onClick={() => setShowRemisiModal(false)}
                className="p-1.5 hover:bg-slate-100 text-slate-400 rounded-xl transition cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            <form
              onSubmit={async (e) => {
                e.preventDefault();
                if (!onSaveRemisiPoin) return;
                const payload: any = {
                  ...(editingRemisi ? { id: editingRemisi.id } : {}),
                  ...formRemisi
                };
                await onSaveRemisiPoin(payload, !editingRemisi);
                setShowRemisiModal(false);
              }}
              className="space-y-3 text-xs"
            >
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                  Pilih Siswa
                </label>
                <select
                  value={formRemisi.siswaId}
                  onChange={(e) => setFormRemisi({ ...formRemisi, siswaId: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800 focus:outline-none focus:border-emerald-500"
                  required
                >
                  {filteredStudents.map((s) => (
                    <option key={s.id} value={s.id}>{s.nama} (NIS: {s.nis || '-'})</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                    Tanggal
                  </label>
                  <input
                    type="date"
                    value={formRemisi.tanggal}
                    onChange={(e) => setFormRemisi({ ...formRemisi, tanggal: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-800 focus:outline-none focus:border-emerald-500"
                    required
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                    Kategori Remisi
                  </label>
                  <input
                    type="text"
                    placeholder="Misal: Karakter Baik, Pembinaan Lanjutan"
                    value={formRemisi.kategori}
                    onChange={(e) => setFormRemisi({ ...formRemisi, kategori: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-800 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                  Bentuk Pembinaan / Perilaku Baik
                </label>
                <input
                  type="text"
                  placeholder="Misal: Melakukan aksi kebersihan lingkungan, mengikuti pembinaan sholat/doa"
                  value={formRemisi.jenisRemisi}
                  onChange={(e) => setFormRemisi({ ...formRemisi, jenisRemisi: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-800 focus:outline-none focus:border-emerald-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                    Besar Poin Remisi (-)
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={formRemisi.poin}
                    onChange={(e) => setFormRemisi({ ...formRemisi, poin: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-emerald-600 focus:outline-none focus:border-emerald-500"
                    required
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                    Guru Pemberi Remisi
                  </label>
                  <input
                    type="text"
                    value={formRemisi.guruPemberi}
                    onChange={(e) => setFormRemisi({ ...formRemisi, guruPemberi: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-800 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                  Catatan Tambahan
                </label>
                <textarea
                  rows={2}
                  placeholder="Catatan perkembangan atau rekomendasi wali kelas..."
                  value={formRemisi.keterangan}
                  onChange={(e) => setFormRemisi({ ...formRemisi, keterangan: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-800 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowRemisiModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl font-bold transition cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold transition flex items-center gap-1 shadow-xs cursor-pointer"
                >
                  <Save size={14} /> Simpan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: Rekam Prestasi (Tambah & Edit) */}
      {showPrestasiModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 border border-slate-100 shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-amber-50 text-amber-600 rounded-xl font-bold">
                  <Award size={18} />
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-slate-900">
                    {editingPrestasi ? 'Ubah Rekam Prestasi' : 'Tambah Rekam Prestasi'}
                  </h3>
                  <p className="text-[10px] text-slate-500">Kelas {currentClassName}</p>
                </div>
              </div>
              <button
                onClick={() => setShowPrestasiModal(false)}
                className="p-1.5 hover:bg-slate-100 text-slate-400 rounded-xl transition cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            <form
              onSubmit={async (e) => {
                e.preventDefault();
                if (!onSavePrestasi) return;
                const payload: any = {
                  ...(editingPrestasi ? { id: editingPrestasi.id } : {}),
                  ...formPrestasi
                };
                await onSavePrestasi(payload, !editingPrestasi);
                setShowPrestasiModal(false);
              }}
              className="space-y-3 text-xs"
            >
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                  Pilih Siswa
                </label>
                <select
                  value={formPrestasi.siswaId}
                  onChange={(e) => setFormPrestasi({ ...formPrestasi, siswaId: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800 focus:outline-none focus:border-amber-500"
                  required
                >
                  {filteredStudents.map((s) => (
                    <option key={s.id} value={s.id}>{s.nama} (NIS: {s.nis || '-'})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                  Nama Prestasi / Perlombaan
                </label>
                <input
                  type="text"
                  placeholder="Misal: Olimpiade Matematika, Lomba Pidato Bahasa Inggris"
                  value={formPrestasi.namaPrestasi}
                  onChange={(e) => setFormPrestasi({ ...formPrestasi, namaPrestasi: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-800 focus:outline-none focus:border-amber-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                    Capaian / Juara
                  </label>
                  <input
                    type="text"
                    placeholder="Misal: Juara 1, Harapan 2, Peserta Terbaik"
                    value={formPrestasi.juara}
                    onChange={(e) => setFormPrestasi({ ...formPrestasi, juara: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800 focus:outline-none focus:border-amber-500"
                    required
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                    Tingkat
                  </label>
                  <select
                    value={formPrestasi.tingkat}
                    onChange={(e) => setFormPrestasi({ ...formPrestasi, tingkat: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-800 focus:outline-none focus:border-amber-500"
                  >
                    <option value="Sekolah">Sekolah</option>
                    <option value="Kecamatan">Kecamatan</option>
                    <option value="Kota/Kabupaten">Kota/Kabupaten</option>
                    <option value="Provinsi">Provinsi</option>
                    <option value="Nasional">Nasional</option>
                    <option value="Internasional">Internasional</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                    Kategori
                  </label>
                  <select
                    value={formPrestasi.kategori}
                    onChange={(e) => setFormPrestasi({ ...formPrestasi, kategori: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-800 focus:outline-none focus:border-amber-500"
                  >
                    <option value="Akademik">Akademik</option>
                    <option value="Non-Akademik">Non-Akademik</option>
                    <option value="Seni & Budaya">Seni & Budaya</option>
                    <option value="Olahraga">Olahraga</option>
                    <option value="Keagamaan">Keagamaan</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                    Tahun
                  </label>
                  <input
                    type="text"
                    value={formPrestasi.tahun}
                    onChange={(e) => setFormPrestasi({ ...formPrestasi, tahun: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono text-slate-800 focus:outline-none focus:border-amber-500"
                    required
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowPrestasiModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl font-bold transition cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-bold transition flex items-center gap-1 shadow-xs cursor-pointer"
                >
                  <Save size={14} /> Simpan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 4: Kehadiran / Presensi (Tambah & Edit) */}
      {showKehadiranModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 border border-slate-100 shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl font-bold">
                  <Calendar size={18} />
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-slate-900">
                    {editingKehadiran ? 'Ubah Rekap Presensi' : 'Input Rekap Presensi'}
                  </h3>
                  <p className="text-[10px] text-slate-500">Kelas {currentClassName}</p>
                </div>
              </div>
              <button
                onClick={() => setShowKehadiranModal(false)}
                className="p-1.5 hover:bg-slate-100 text-slate-400 rounded-xl transition cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            <form
              onSubmit={async (e) => {
                e.preventDefault();
                if (!onSaveKehadiran) return;
                const isNew = !editingKehadiran;
                const payload: any = {
                  id: editingKehadiran ? editingKehadiran.id : `att-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
                  siswaId: formKehadiran.siswaId || classStudents[0]?.id || '',
                  bulan: formKehadiran.bulan || 'Juli',
                  mingguKe: formKehadiran.mingguKe || 'Minggu 1',
                  tahun: formKehadiran.tahun || '2026',
                  hadir: Number(formKehadiran.hadir || 0),
                  sakit: Number(formKehadiran.sakit || 0),
                  izin: Number(formKehadiran.izin || 0),
                  alfa: Number(formKehadiran.alfa || 0),
                  keterangan: formKehadiran.keterangan || ''
                };
                await onSaveKehadiran(payload, isNew);
                setShowKehadiranModal(false);
              }}
              className="space-y-3 text-xs"
            >
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                  Pilih Siswa
                </label>
                <select
                  value={formKehadiran.siswaId}
                  onChange={(e) => setFormKehadiran({ ...formKehadiran, siswaId: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800 focus:outline-none focus:border-emerald-500"
                  required
                >
                  {classStudents.map((s) => (
                    <option key={s.id} value={s.id}>{s.nama} (NIS: {s.nis || '-'})</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                    Bulan
                  </label>
                  <select
                    value={formKehadiran.bulan}
                    onChange={(e) => setFormKehadiran({ ...formKehadiran, bulan: e.target.value })}
                    className="w-full px-2.5 py-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-800 focus:outline-none focus:border-emerald-500"
                  >
                    {['Januari','Februari','Maret','April','Mei','Juni','Juli','Agustus','September','Oktober','November','Desember'].map(m => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                    Minggu Ke
                  </label>
                  <select
                    value={formKehadiran.mingguKe}
                    onChange={(e) => setFormKehadiran({ ...formKehadiran, mingguKe: e.target.value })}
                    className="w-full px-2.5 py-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-800 focus:outline-none focus:border-emerald-500"
                  >
                    {['Minggu 1', 'Minggu 2', 'Minggu 3', 'Minggu 4', 'Minggu 5'].map(w => (
                      <option key={w} value={w}>{w}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                    Tahun
                  </label>
                  <input
                    type="text"
                    value={formKehadiran.tahun}
                    onChange={(e) => setFormKehadiran({ ...formKehadiran, tahun: e.target.value })}
                    className="w-full px-2.5 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono text-slate-800 focus:outline-none focus:border-emerald-500"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-4 gap-2 bg-slate-50 p-3 rounded-xl border border-slate-200">
                <div>
                  <label className="text-[9px] font-bold text-emerald-700 uppercase block mb-1">
                    Hadir
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formKehadiran.hadir}
                    onChange={(e) => setFormKehadiran({ ...formKehadiran, hadir: Number(e.target.value) })}
                    className="w-full px-2 py-1.5 bg-white border border-slate-200 rounded-lg text-center font-bold text-emerald-700"
                    required
                  />
                </div>
                <div>
                  <label className="text-[9px] font-bold text-sky-700 uppercase block mb-1">
                    Sakit
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formKehadiran.sakit}
                    onChange={(e) => setFormKehadiran({ ...formKehadiran, sakit: Number(e.target.value) })}
                    className="w-full px-2 py-1.5 bg-white border border-slate-200 rounded-lg text-center font-bold text-sky-700"
                    required
                  />
                </div>
                <div>
                  <label className="text-[9px] font-bold text-amber-700 uppercase block mb-1">
                    Izin
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formKehadiran.izin}
                    onChange={(e) => setFormKehadiran({ ...formKehadiran, izin: Number(e.target.value) })}
                    className="w-full px-2 py-1.5 bg-white border border-slate-200 rounded-lg text-center font-bold text-amber-700"
                    required
                  />
                </div>
                <div>
                  <label className="text-[9px] font-bold text-rose-700 uppercase block mb-1">
                    Alfa
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formKehadiran.alfa}
                    onChange={(e) => setFormKehadiran({ ...formKehadiran, alfa: Number(e.target.value) })}
                    className="w-full px-2 py-1.5 bg-white border border-slate-200 rounded-lg text-center font-bold text-rose-700"
                    required
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowKehadiranModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl font-bold transition cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold transition flex items-center gap-1 shadow-xs cursor-pointer"
                >
                  <Save size={14} /> Simpan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Render modular detail drawer */}
      {selectedSiswaId && viewingSiswa && viewingSiswaHds && (
        <HdsDetailDrawer
          siswa={viewingSiswa}
          hds={viewingSiswaHds}
          onClose={() => setSelectedSiswaId(null)}
          getStudentClassName={getStudentClassName}
          onDownloadPdf={handleDownloadHdsPdf}
        />
      )}

    </div>
  );
}
