/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  User,
  UserRole,
  Siswa,
  OrangTua,
  Akademik,
  Kesehatan,
  Ekonomi,
  Psikologi,
  Sosial,
  Prestasi,
  Pelanggaran,
  RemisiPoin,
  Konseling,
  Asesmen,
  HomeVisit,
  Surat,
  Dokumen,
  CatatanPerkembangan,
  PengaduanSiswa,
  TahunPelajaran,
  Kelas,
  LogAktivitas,
  DatabaseState,
  Kehadiran,
  LaporanKejadian,
} from '../types';

const LOCAL_STORAGE_KEY = 'hds_bk_database_v1';
const LOCAL_STORAGE_TOMBSTONES_KEY = 'hds_bk_deleted_tombstones_v1';
const LOCAL_STORAGE_DELETE_QUEUE_KEY = 'hds_bk_pending_deletions_v1';

export function getDeletedTombstones(): Set<string> {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_TOMBSTONES_KEY);
    if (!raw) return new Set();
    const arr = JSON.parse(raw);
    return new Set(Array.isArray(arr) ? arr.map(String) : []);
  } catch (e) {
    return new Set();
  }
}

export function addDeletedTombstone(id: string | number | undefined | null) {
  if (id === undefined || id === null || id === '') return;
  try {
    const idStr = String(id).trim();
    if (!idStr) return;
    const current = getDeletedTombstones();
    current.add(idStr);
    const arr = Array.from(current);
    if (arr.length > 2000) {
      arr.splice(0, arr.length - 2000);
    }
    localStorage.setItem(LOCAL_STORAGE_TOMBSTONES_KEY, JSON.stringify(arr));
  } catch (e) {
    console.warn('Failed to save tombstone', e);
  }
}

export function removeDeletedTombstone(id: string | number | undefined | null) {
  if (id === undefined || id === null || id === '') return;
  try {
    const idStr = String(id).trim();
    const current = getDeletedTombstones();
    if (current.has(idStr)) {
      current.delete(idStr);
      localStorage.setItem(LOCAL_STORAGE_TOMBSTONES_KEY, JSON.stringify(Array.from(current)));
    }
  } catch (e) {
    console.warn('Failed to remove tombstone', e);
  }
}

export function clearTombstonesForExistingItems(remoteData: any) {
  if (!remoteData || typeof remoteData !== 'object') return;
  const listKeys = [
    'siswa', 'orangTua', 'akademik', 'kesehatan', 'ekonomi', 'psikologi', 'sosial',
    'prestasi', 'pelanggaran', 'remisiPoin', 'konseling', 'asesmen', 'homeVisit',
    'surat', 'dokumen', 'catatanPerkembangan', 'pengaduanSiswa', 'kehadiran',
    'laporanKejadian', 'users', 'kelas', 'tahunPelajaran'
  ];
  listKeys.forEach(k => {
    if (Array.isArray(remoteData[k])) {
      remoteData[k].forEach((item: any) => {
        if (item && item.id) {
          removeDeletedTombstone(item.id);
        }
      });
    }
  });
}

export interface PendingDeletionTask {
  id: string;
  action: string;
  payload: any;
  timestamp: number;
}

export function getPendingDeletionsQueue(): PendingDeletionTask[] {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_DELETE_QUEUE_KEY);
    if (!raw) return [];
    const arr = JSON.parse(raw);
    return Array.isArray(arr) ? arr : [];
  } catch (e) {
    return [];
  }
}

export function addToDeletionQueue(id: string, action: string, payload: any = { id }) {
  try {
    const queue = getPendingDeletionsQueue();
    const idStr = String(id).trim();
    const existingIdx = queue.findIndex(item => item.action === action && String(item.id).trim() === idStr);
    const task: PendingDeletionTask = {
      id: idStr,
      action,
      payload: { ...payload, id: idStr },
      timestamp: Date.now()
    };
    if (existingIdx >= 0) {
      queue[existingIdx] = task;
    } else {
      queue.push(task);
    }
    localStorage.setItem(LOCAL_STORAGE_DELETE_QUEUE_KEY, JSON.stringify(queue));
  } catch (e) {
    console.warn('Failed to add to deletion queue', e);
  }
}

let isProcessingQueue = false;

export async function processPendingDeletionsQueue(): Promise<{ processed: number; remaining: number }> {
  if (isProcessingQueue) return { processed: 0, remaining: getPendingDeletionsQueue().length };
  const url = getGasApiUrl();
  if (!url) return { processed: 0, remaining: getPendingDeletionsQueue().length };

  const queue = getPendingDeletionsQueue();
  if (queue.length === 0) return { processed: 0, remaining: 0 };

  isProcessingQueue = true;
  let processedCount = 0;
  const remainingTasks: PendingDeletionTask[] = [];

  for (const task of queue) {
    try {
      const res = await apiCall(task.action, task.payload);
      if (res && res.success) {
        processedCount++;
      } else {
        const msg = (res?.message || '').toLowerCase();
        if (msg.includes('tidak ditemukan') || msg.includes('sudah tidak ada') || msg.includes('sudah terhapus')) {
          processedCount++;
        } else {
          remainingTasks.push(task);
        }
      }
    } catch (e) {
      console.warn(`Failed to execute deletion task for ${task.action} (${task.id}):`, e);
      remainingTasks.push(task);
    }
  }

  localStorage.setItem(LOCAL_STORAGE_DELETE_QUEUE_KEY, JSON.stringify(remainingTasks));
  isProcessingQueue = false;
  return { processed: processedCount, remaining: remainingTasks.length };
}

export function isTombstoned(id?: string | number | null): boolean {
  if (!id && id !== 0) return false;
  const tombstones = getDeletedTombstones();
  return tombstones.has(String(id).trim());
}

export function filterOutTombstones(db: DatabaseState): DatabaseState {
  const tombstones = getDeletedTombstones();
  if (tombstones.size === 0) return db;

  return {
    ...db,
    siswa: (db.siswa || []).filter(s => !isTombstoned(s.id)),
    orangTua: (db.orangTua || []).filter(o => !isTombstoned(o.id)),
    kesehatan: (db.kesehatan || []).filter(k => !isTombstoned(k.id)),
    ekonomi: (db.ekonomi || []).filter(e => !isTombstoned(e.id)),
    psikologi: (db.psikologi || []).filter(p => !isTombstoned(p.id)),
    sosial: (db.sosial || []).filter(s => !isTombstoned(s.id)),
    akademik: (db.akademik || []).filter(a => !isTombstoned(a.id)),
    prestasi: (db.prestasi || []).filter(p => !isTombstoned(p.id) && !isTombstoned(p.siswaId)),
    pelanggaran: (db.pelanggaran || []).filter(p => !isTombstoned(p.id) && !isTombstoned(p.siswaId)),
    remisiPoin: (db.remisiPoin || []).filter(r => !isTombstoned(r.id) && !isTombstoned(r.siswaId)),
    konseling: (db.konseling || []).filter(k => !isTombstoned(k.id) && !isTombstoned(k.siswaId)),
    asesmen: (db.asesmen || []).filter(a => !isTombstoned(a.id) && !isTombstoned(a.siswaId)),
    homeVisit: (db.homeVisit || []).filter(h => !isTombstoned(h.id) && !isTombstoned(h.siswaId)),
    surat: (db.surat || []).filter(s => !isTombstoned(s.id) && !isTombstoned(s.siswaId)),
    dokumen: (db.dokumen || []).filter(d => !isTombstoned(d.id) && !isTombstoned(d.siswaId)),
    catatanPerkembangan: (db.catatanPerkembangan || []).filter(c => !isTombstoned(c.id) && !isTombstoned(c.siswaId)),
    pengaduanSiswa: (db.pengaduanSiswa || []).filter(p => !isTombstoned(p.id) && !isTombstoned(p.siswaId)),
    kehadiran: (db.kehadiran || []).filter(k => !isTombstoned(k.id) && !isTombstoned(k.siswaId)),
    laporanKejadian: (db.laporanKejadian || []).filter(l => !isTombstoned(l.id) && (!l.siswaId || !isTombstoned(l.siswaId))),
    tahunPelajaran: (db.tahunPelajaran || []).filter(t => !isTombstoned(t.id)),
    kelas: (db.kelas || []).filter(k => !isTombstoned(k.id)),
    users: (db.users || []).filter(u => !isTombstoned(u.id))
  };
}

// List of 33 Wali Kelas requested by user
export const WALI_KELAS_USERS: User[] = [
  { id: 'wk-7-1', username: 'fay', nama: 'Nurrifa`ah Fairuz, S.Pd', role: UserRole.WALI_KELAS, email: 'fay@sekolah.sch.id', isActive: true },
  { id: 'wk-7-2', username: 'aida', nama: 'Aida Sri Rahayu, S.Pd', role: UserRole.WALI_KELAS, email: 'aida@sekolah.sch.id', isActive: true },
  { id: 'wk-7-3', username: 'viika', nama: 'Viika Amalia Ainuna, M.Pd', role: UserRole.WALI_KELAS, email: 'viika@sekolah.sch.id', isActive: true },
  { id: 'wk-7-4', username: 'sribarnetti', nama: 'Sri Barnetti, S.Pd.MM', role: UserRole.WALI_KELAS, email: 'sribarnetti@sekolah.sch.id', isActive: true },
  { id: 'wk-7-5', username: 'viny', nama: 'Viny Krisni Rahmi Maulani, S.Pd', role: UserRole.WALI_KELAS, email: 'viny@sekolah.sch.id', isActive: true },
  { id: 'wk-7-6', username: 'lia', nama: 'Amalia, S.Pd', role: UserRole.WALI_KELAS, email: 'lia@sekolah.sch.id', isActive: true },
  { id: 'wk-7-7', username: 'yanah', nama: 'Maryanah, S.Pd', role: UserRole.WALI_KELAS, email: 'yanah@sekolah.sch.id', isActive: true },
  { id: 'wk-7-8', username: 'srirahayu', nama: 'Sri Rahayu, S.Pd.MM', role: UserRole.WALI_KELAS, email: 'srirahayu@sekolah.sch.id', isActive: true },
  { id: 'wk-7-9', username: 'putri', nama: 'Putri Pradipta, S.Pd', role: UserRole.WALI_KELAS, email: 'putri@sekolah.sch.id', isActive: true },
  { id: 'wk-7-10', username: 'sari', nama: 'Prammita Sari, S.Kom', role: UserRole.WALI_KELAS, email: 'sari@sekolah.sch.id', isActive: true },
  { id: 'wk-7-11', username: 'rifal', nama: 'Rifalfi Hamdi, S.Pd', role: UserRole.WALI_KELAS, email: 'rifal@sekolah.sch.id', isActive: true },
  { id: 'wk-8-1', username: 'neneng', nama: 'Neneng Fitria, M.Pd', role: UserRole.WALI_KELAS, email: 'neneng@sekolah.sch.id', isActive: true },
  { id: 'wk-8-2', username: 'meli', nama: 'Meliana Nursanti, S.Pd', role: UserRole.WALI_KELAS, email: 'meli@sekolah.sch.id', isActive: true },
  { id: 'wk-8-3', username: 'tiar', nama: 'Riztiary Pranacita, S.Pd', role: UserRole.WALI_KELAS, email: 'tiar@sekolah.sch.id', isActive: true },
  { id: 'wk-8-4', username: 'joko', nama: 'Marjoko, S.Pd', role: UserRole.WALI_KELAS, email: 'joko@sekolah.sch.id', isActive: true },
  { id: 'wk-8-5', username: 'danang', nama: 'Danang Bayu Permadi, S.Pd', role: UserRole.WALI_KELAS, email: 'danang@sekolah.sch.id', isActive: true },
  { id: 'wk-8-6', username: 'sahdiana', nama: 'Sahdiana Tumanggor, S.Pd', role: UserRole.WALI_KELAS, email: 'sahdiana@sekolah.sch.id', isActive: true },
  { id: 'wk-8-7', username: 'haifa', nama: 'Haifa Suryati, S.Pd', role: UserRole.WALI_KELAS, email: 'haifa@sekolah.sch.id', isActive: true },
  { id: 'wk-8-8', username: 'santi', nama: 'Santi Ramadhani, S.Pd', role: UserRole.WALI_KELAS, email: 'santi@sekolah.sch.id', isActive: true },
  { id: 'wk-8-9', username: 'reni', nama: 'Reni Septiati, S.Pd', role: UserRole.WALI_KELAS, email: 'reni@sekolah.sch.id', isActive: true },
  { id: 'wk-8-10', username: 'dewi', nama: 'Dewi Sri Kusumaningrum, S.Pd', role: UserRole.WALI_KELAS, email: 'dewi@sekolah.sch.id', isActive: true },
  { id: 'wk-8-11', username: 'annisa', nama: 'Annisa C. Wicikononing, S.Kom', role: UserRole.WALI_KELAS, email: 'annisa@sekolah.sch.id', isActive: true },
  { id: 'wk-9-1', username: 'tere', nama: 'Theresia Erni Setyawati, S.Pd.MM', role: UserRole.WALI_KELAS, email: 'tere@sekolah.sch.id', isActive: true },
  { id: 'wk-9-2', username: 'ferry', nama: 'Ferry Ferdiansyah, S.Pd', role: UserRole.WALI_KELAS, email: 'ferry@sekolah.sch.id', isActive: true },
  { id: 'wk-9-3', username: 'sifah', nama: 'Sifah Fauziah, S.Pd', role: UserRole.WALI_KELAS, email: 'sifah@sekolah.sch.id', isActive: true },
  { id: 'wk-9-4', username: 'mia', nama: 'Mia Hardina, S.Pd', role: UserRole.WALI_KELAS, email: 'mia@sekolah.sch.id', isActive: true },
  { id: 'wk-9-5', username: 'habib', nama: 'Habib Baehaqi, S.Kom', role: UserRole.WALI_KELAS, email: 'habib@sekolah.sch.id', isActive: true },
  { id: 'wk-9-6', username: 'warsih', nama: 'Suwarsih, S.Pd.MM', role: UserRole.WALI_KELAS, email: 'warsih@sekolah.sch.id', isActive: true },
  { id: 'wk-9-7', username: 'tut', nama: 'Hastutiningsih, S.Pd', role: UserRole.WALI_KELAS, email: 'tut@sekolah.sch.id', isActive: true },
  { id: 'wk-9-8', username: 'nur', nama: 'Nur Komar, S.Pd,.MM', role: UserRole.WALI_KELAS, email: 'nur@sekolah.sch.id', isActive: true },
  { id: 'wk-9-9', username: 'emi', nama: 'Emi Jamiah, M.Pd', role: UserRole.WALI_KELAS, email: 'emi@sekolah.sch.id', isActive: true },
  { id: 'wk-9-10', username: 'pendi', nama: 'Pendi, S.Pd', role: UserRole.WALI_KELAS, email: 'pendi@sekolah.sch.id', isActive: true },
  { id: 'wk-9-11', username: 'hadi', nama: 'Hadi Suryadi, S.Pd', role: UserRole.WALI_KELAS, email: 'hadi@sekolah.sch.id', isActive: true }
];

const MOCK_FIRST_NAMES_MALE = ['Aditya', 'Ahmad', 'Budi', 'Candra', 'Dimas', 'Eka', 'Farhan', 'Gilang', 'Hafiz', 'Irfan', 'Jonathan', 'Kenzie', 'Luqman', 'Muhammad', 'Naufal', 'Oktavian', 'Pratama', 'Rizky', 'Satria', 'Taufik', 'Utama', 'Vino', 'Wahyu', 'Yusuf', 'Zainal'];
const MOCK_FIRST_NAMES_FEMALE = ['Amanda', 'Bella', 'Citra', 'Dhea', 'Elvira', 'Fitri', 'Grace', 'Hana', 'Indah', 'Jihan', 'Kirana', 'Larasati', 'Maya', 'Nabila', 'Olivia', 'Putri', 'Qonita', 'Rania', 'Siti', 'Tania', 'Ufa', 'Vina', 'Winda', 'Yasmin', 'Zahra'];
const MOCK_LAST_NAMES = ['Pratama', 'Lestari', 'Wijaya', 'Saputra', 'Hidayat', 'Ramadhan', 'Salsabila', 'Maulana', 'Alfarizi', 'Kurniawan', 'Santoso', 'Permata', 'Handayani', 'Anggara', 'Putra', 'Kusuma', 'Nugraha', 'Wibowo', 'Riyadi', 'Utami'];

export const generateAllSampleStudents = (): Siswa[] => {
  return [];
};

export const DEFAULT_GAS_API_URL = 'https://script.google.com/macros/s/AKfycbzmKCjxxtUQBqQrC_SrnpRWWB_88voYQeUOiWG_XhDX6m-Yvy9QfdnPITfSJDkULZGy/exec';

export const isOldOrDefaultUrl = (url?: string): boolean => {
  if (!url || typeof url !== 'string') return true;
  const trimmed = url.trim();
  if (trimmed === '') return true;
  if (trimmed === DEFAULT_GAS_API_URL) return false;
  if (trimmed.includes('AKfycbwL5nTSIsbpgFE6JxD2STMWQiFezjN8Dw6xTg_ktbtVUOHTvLinLFuu6ojYe0QP9bZm')) return true;
  if (trimmed.includes('AKfycbwBbd5COo3yw1rij0XNuqSR62c22IuaFf7ty5Zqb-7PcCnTvHD1nHzss4gjKQWNiF10')) return true;
  return false;
};

// Clean initial database state without sample data
const INITIAL_DATABASE: DatabaseState = {
  config: {
    gasApiUrl: DEFAULT_GAS_API_URL,
    spreadsheetId: '1g3thopFbDdsvlXyidgq_PEiiEhY5cH3PngqGO5weHqc',
  },
  users: [
    { id: 'usr-1', username: 'admin', nama: 'Sulaiman, S.Psi', role: UserRole.ADMIN, email: 'sulaiman.admin@sekolah.sch.id', isActive: true },
    { id: 'usr-piket', username: 'Guru Piket', nama: 'Guru Piket', role: UserRole.GURU_PIKET, email: 'piket@sekolah.sch.id', isActive: true },
    { id: 'bk-sulaiman', username: 'sulaiman', nama: 'Sulaiman, S.Psi', role: UserRole.GURU_BK, email: 'sulaiman@sekolah.sch.id', isActive: true },
    { id: 'bk-aulia', username: 'aulia', nama: 'Aulia Rohmah, S.Pd,.MM', role: UserRole.GURU_BK, email: 'aulia@sekolah.sch.id', isActive: true },
    { id: 'bk-dwi', username: 'dwi', nama: 'Dwi Susanti, S.Pd', role: UserRole.GURU_BK, email: 'dwi@sekolah.sch.id', isActive: true },
    { id: 'bk-kholfi', username: 'kholfi', nama: 'Kholfi Aulia, S.Pd', role: UserRole.GURU_BK, email: 'kholfi@sekolah.sch.id', isActive: true },
    { id: 'bk-novita', username: 'novita', nama: 'Novita Kusuma Wardhani, S.Pd', role: UserRole.GURU_BK, email: 'novita@sekolah.sch.id', isActive: true },
    { id: 'usr-4', username: 'kepsek', nama: 'Salim, S.Pd., M.Hum.', role: UserRole.KEPALA_SEKOLAH, email: 'salim.kepsek@sekolah.sch.id', isActive: true },
    ...WALI_KELAS_USERS
  ],
  tahunPelajaran: [
    { id: 'tp-1', tahun: '2025/2026', semester: 'Ganjil', isActive: true },
    { id: 'tp-2', tahun: '2024/2025', semester: 'Genap', isActive: false },
    { id: 'tp-3', tahun: '2024/2025', semester: 'Ganjil', isActive: false },
  ],
  jurusan: [],
  kelas: [
    // Kelas 7-1 s.d. 7-11
    { id: 'kl-1', namaKelas: 'Kelas 7-1', waliKelasId: 'wk-7-1' },
    { id: 'kl-2', namaKelas: 'Kelas 7-2', waliKelasId: 'wk-7-2' },
    { id: 'kl-3', namaKelas: 'Kelas 7-3', waliKelasId: 'wk-7-3' },
    { id: 'kl-4', namaKelas: 'Kelas 7-4', waliKelasId: 'wk-7-4' },
    { id: 'kl-5', namaKelas: 'Kelas 7-5', waliKelasId: 'wk-7-5' },
    { id: 'kl-6', namaKelas: 'Kelas 7-6', waliKelasId: 'wk-7-6' },
    { id: 'kl-7', namaKelas: 'Kelas 7-7', waliKelasId: 'wk-7-7' },
    { id: 'kl-8', namaKelas: 'Kelas 7-8', waliKelasId: 'wk-7-8' },
    { id: 'kl-9', namaKelas: 'Kelas 7-9', waliKelasId: 'wk-7-9' },
    { id: 'kl-10', namaKelas: 'Kelas 7-10', waliKelasId: 'wk-7-10' },
    { id: 'kl-11', namaKelas: 'Kelas 7-11', waliKelasId: 'wk-7-11' },
    // Kelas 8-1 s.d. 8-11
    { id: 'kl-12', namaKelas: 'Kelas 8-1', waliKelasId: 'wk-8-1' },
    { id: 'kl-13', namaKelas: 'Kelas 8-2', waliKelasId: 'wk-8-2' },
    { id: 'kl-14', namaKelas: 'Kelas 8-3', waliKelasId: 'wk-8-3' },
    { id: 'kl-15', namaKelas: 'Kelas 8-4', waliKelasId: 'wk-8-4' },
    { id: 'kl-16', namaKelas: 'Kelas 8-5', waliKelasId: 'wk-8-5' },
    { id: 'kl-17', namaKelas: 'Kelas 8-6', waliKelasId: 'wk-8-6' },
    { id: 'kl-18', namaKelas: 'Kelas 8-7', waliKelasId: 'wk-8-7' },
    { id: 'kl-19', namaKelas: 'Kelas 8-8', waliKelasId: 'wk-8-8' },
    { id: 'kl-20', namaKelas: 'Kelas 8-9', waliKelasId: 'wk-8-9' },
    { id: 'kl-21', namaKelas: 'Kelas 8-10', waliKelasId: 'wk-8-10' },
    { id: 'kl-22', namaKelas: 'Kelas 8-11', waliKelasId: 'wk-8-11' },
    // Kelas 9-1 s.d. 9-11
    { id: 'kl-23', namaKelas: 'Kelas 9-1', waliKelasId: 'wk-9-1' },
    { id: 'kl-24', namaKelas: 'Kelas 9-2', waliKelasId: 'wk-9-2' },
    { id: 'kl-25', namaKelas: 'Kelas 9-3', waliKelasId: 'wk-9-3' },
    { id: 'kl-26', namaKelas: 'Kelas 9-4', waliKelasId: 'wk-9-4' },
    { id: 'kl-27', namaKelas: 'Kelas 9-5', waliKelasId: 'wk-9-5' },
    { id: 'kl-28', namaKelas: 'Kelas 9-6', waliKelasId: 'wk-9-6' },
    { id: 'kl-29', namaKelas: 'Kelas 9-7', waliKelasId: 'wk-9-7' },
    { id: 'kl-30', namaKelas: 'Kelas 9-8', waliKelasId: 'wk-9-8' },
    { id: 'kl-31', namaKelas: 'Kelas 9-9', waliKelasId: 'wk-9-9' },
    { id: 'kl-32', namaKelas: 'Kelas 9-10', waliKelasId: 'wk-9-10' },
    { id: 'kl-33', namaKelas: 'Kelas 9-11', waliKelasId: 'wk-9-11' },
  ],
  siswa: [],
  orangTua: [],
  akademik: [],
  kesehatan: [],
  ekonomi: [],
  psikologi: [],
  sosial: [],
  prestasi: [],
  pelanggaran: [],
  remisiPoin: [],
  konseling: [],
  asesmen: [],
  homeVisit: [],
  surat: [],
  dokumen: [],
  catatanPerkembangan: [],
  pengaduanSiswa: [],
  logAktivitas: [],
  kehadiran: [],
  laporanKejadian: []
};

// Local cache
let currentDatabase: DatabaseState | null = null;

export function findSiswa(db: DatabaseState | null | undefined, targetIdOrRef: string | undefined | null, itemObj?: any): Siswa | null {
  if (!db || !db.siswa || db.siswa.length === 0) return null;
  const target = (targetIdOrRef || '').toString().trim();
  const targetLower = target.toLowerCase();

  if (target) {
    // 1. Direct match by id
    let match = db.siswa.find(s => s && s.id === target);
    if (match) return match;

    // 2. Match by NIS or NISN
    match = db.siswa.find(s => s && ((s.nis && s.nis.toString().trim() === target) || (s.nisn && s.nisn.toString().trim() === target)));
    if (match) return match;

    // 3. Match by partial ID pattern (e.g. target="12345", s.id="sis-nis-12345")
    match = db.siswa.find(s => s && s.id && (s.id.toLowerCase().includes(targetLower) || targetLower.includes(s.id.toLowerCase())));
    if (match) return match;

    // 4. Match by exact name
    match = db.siswa.find(s => s && s.nama && s.nama.toString().trim().toLowerCase() === targetLower);
    if (match) return match;

    // 5. Match by normalized name (removing spaces and punctuation)
    const normTarget = targetLower.replace(/[^a-z0-9]/g, '');
    if (normTarget && normTarget.length >= 3) {
      match = db.siswa.find(s => s && s.nama && s.nama.toString().trim().toLowerCase().replace(/[^a-z0-9]/g, '') === normTarget);
      if (match) return match;
    }
  }

  // 6. Match via itemObj fields if itemObj provided (nis, siswaNama, namaSiswa, nama, siswaId, siswald, idSiswa)
  if (itemObj) {
    const itemNis = (itemObj.nis || itemObj.nisSiswa || '').toString().trim();
    if (itemNis) {
      const match = db.siswa.find(s => s && ((s.nis && s.nis.toString().trim() === itemNis) || (s.nisn && s.nisn.toString().trim() === itemNis)));
      if (match) return match;
    }

    const itemNama = (itemObj.siswaNama || itemObj.namaSiswa || itemObj.nama || itemObj.siswa || '').toString().trim().toLowerCase();
    if (itemNama && itemNama !== 'siswa' && itemNama !== '-') {
      let match = db.siswa.find(s => s && s.nama && s.nama.toString().trim().toLowerCase() === itemNama);
      if (match) return match;

      const normItemNama = itemNama.replace(/[^a-z0-9]/g, '');
      if (normItemNama && normItemNama.length >= 3) {
        match = db.siswa.find(s => s && s.nama && s.nama.toString().trim().toLowerCase().replace(/[^a-z0-9]/g, '') === normItemNama);
        if (match) return match;
      }

      const partialMatch = db.siswa.find(s => s && s.nama && (s.nama.toString().trim().toLowerCase().includes(itemNama) || itemNama.includes(s.nama.toString().trim().toLowerCase())));
      if (partialMatch) return partialMatch;
    }
  }

  return null;
}

export function getSiswaInfo(db: DatabaseState | null | undefined, targetIdOrRef: string | undefined | null, itemObj?: any): { nama: string; nis: string; kelasName: string; foundSiswa: Siswa | null } {
  const found = findSiswa(db, targetIdOrRef, itemObj);
  if (found) {
    const kName = db?.kelas?.find(k => k.id === found.kelasId || k.namaKelas.toLowerCase().trim() === found.kelasId?.toLowerCase().trim())?.namaKelas || found.kelasId || '-';
    const formattedKName = kName !== '-' ? (kName.startsWith('Kelas ') ? kName : `Kelas ${kName}`) : '-';
    return {
      nama: found.nama,
      nis: found.nis || '-',
      kelasName: formattedKName,
      foundSiswa: found
    };
  }

  // Fallback if not found in db.siswa:
  const rawNama = itemObj?.siswaNama || itemObj?.namaSiswa || itemObj?.nama || (targetIdOrRef && !targetIdOrRef.startsWith('sis-') && !targetIdOrRef.startsWith('pel-') ? targetIdOrRef : '');
  const fallbackNama = rawNama && rawNama.trim() !== '' && rawNama.trim().toLowerCase() !== 'siswa' ? rawNama.trim() : 'Siswa';
  const fallbackNis = itemObj?.nis || itemObj?.nisSiswa || '-';
  const rawKelas = itemObj?.kelas || itemObj?.kelasId || itemObj?.namaKelas || '-';
  const fallbackKelas = rawKelas !== '-' ? (rawKelas.startsWith('Kelas ') ? rawKelas : `Kelas ${rawKelas}`) : '-';

  return {
    nama: fallbackNama,
    nis: fallbackNis,
    kelasName: fallbackKelas,
    foundSiswa: null
  };
}

export const standardKelasMap: { [key: string]: string } = {};

const mapGradeToMap = (gradeNum: number, startKlIndex: number) => {
  for (let i = 1; i <= 11; i++) {
    const klId = `kl-${startKlIndex + (i - 1)}`;
    const roman = gradeNum === 7 ? 'VII' : gradeNum === 8 ? 'VIII' : 'IX';
    
    // Arabic variations
    standardKelasMap[`${gradeNum}-${i}`] = klId;
    standardKelasMap[`Kelas ${gradeNum}-${i}`] = klId;
    standardKelasMap[`${gradeNum}.${i}`] = klId;
    standardKelasMap[`Kelas ${gradeNum}.${i}`] = klId;
    standardKelasMap[`${gradeNum}/${i}`] = klId;
    standardKelasMap[`Kelas ${gradeNum}/${i}`] = klId;
    standardKelasMap[`${gradeNum} ${i}`] = klId;
    standardKelasMap[`Kelas ${gradeNum} ${i}`] = klId;
    standardKelasMap[`${gradeNum}_${i}`] = klId;
    standardKelasMap[`Kelas ${gradeNum}_${i}`] = klId;

    // Two-digit format (01..11)
    const padI = i < 10 ? `0${i}` : `${i}`;
    standardKelasMap[`${gradeNum}-${padI}`] = klId;
    standardKelasMap[`Kelas ${gradeNum}-${padI}`] = klId;
    standardKelasMap[`${gradeNum}.${padI}`] = klId;
    standardKelasMap[`Kelas ${gradeNum}.${padI}`] = klId;

    // Roman numeral variations
    standardKelasMap[`${roman}-${i}`] = klId;
    standardKelasMap[`Kelas ${roman}-${i}`] = klId;
    standardKelasMap[`${roman}.${i}`] = klId;
    standardKelasMap[`Kelas ${roman}.${i}`] = klId;
    standardKelasMap[`${roman} ${i}`] = klId;
    standardKelasMap[`Kelas ${roman} ${i}`] = klId;
    standardKelasMap[`${roman}/${i}`] = klId;
    standardKelasMap[`Kelas ${roman}/${i}`] = klId;
    standardKelasMap[`${roman}_${i}`] = klId;
    standardKelasMap[`Kelas ${roman}_${i}`] = klId;
    standardKelasMap[`${roman}-${padI}`] = klId;
    standardKelasMap[`Kelas ${roman}-${padI}`] = klId;
    standardKelasMap[`${roman}.${padI}`] = klId;
    standardKelasMap[`Kelas ${roman}.${padI}`] = klId;
  }
};
mapGradeToMap(7, 1);   // kl-1 to kl-11
mapGradeToMap(8, 12);  // kl-12 to kl-22
mapGradeToMap(9, 23);  // kl-23 to kl-33

export const normalizeClassName = (rawName: string): string => {
  let name = String(rawName || '').trim();
  if (!name) return '';

  // Ignore IDs, URLs, or non-class identifiers
  if (name.startsWith('sis-') || name.startsWith('usr-') || name.startsWith('tp-') || name.startsWith('wk-') || name.startsWith('http')) {
    return '';
  }

  // Check kl-X IDs (e.g. kl-1 to kl-11 -> Kelas 7-1 to 7-11, kl-12 to kl-22 -> Kelas 8-1 to 8-11, kl-23 to kl-33 -> Kelas 9-1 to 9-11)
  const klMatch = name.match(/^kl-(\d+)$/i);
  if (klMatch) {
    const num = parseInt(klMatch[1], 10);
    if (num >= 1 && num <= 11) return `Kelas 7-${num}`;
    if (num >= 12 && num <= 22) return `Kelas 8-${num - 11}`;
    if (num >= 23 && num <= 33) return `Kelas 9-${num - 22}`;
    return '';
  }

  // Direct lookup in standardKelasMap for raw name
  if (standardKelasMap[name]) {
    const stdKl = standardKelasMap[name];
    const stdMatch = stdKl.match(/^kl-(\d+)$/i);
    if (stdMatch) {
      const num = parseInt(stdMatch[1], 10);
      if (num >= 1 && num <= 11) return `Kelas 7-${num}`;
      if (num >= 12 && num <= 22) return `Kelas 8-${num - 11}`;
      if (num >= 23 && num <= 33) return `Kelas 9-${num - 22}`;
    }
  }

  // Convert Roman numerals (VII, VIII, IX) to Arabic (7, 8, 9)
  name = name.replace(/\bVII\b/gi, '7').replace(/\bVIII\b/gi, '8').replace(/\bIX\b/gi, '9');

  // Remove prefixes "Jam ", "Kelas ", "Rombel "
  name = name.replace(/^(jam|kelas|rombel)\s+/i, '').trim();

  // Flexible extraction of Grade (7, 8, 9) and Rombel (1 to 12) with any separator (-, ., :, /, _, spaces)
  const flexMatch = name.match(/^0?([789])\s*[-.\/:_]?\s*0?(1[0-2]|[1-9])(?:[:.]00)?$/i);
  if (flexMatch) {
    const g = parseInt(flexMatch[1], 10);
    const r = parseInt(flexMatch[2], 10);
    return `Kelas ${g}-${r}`;
  }

  // Strict standalone class pattern (e.g. "7-1" to "9-11", "7.1" to "9.11", "7/1" to "9/11")
  const strictMatch = name.match(/^([789])\s*[-.\/:_ ]\s*0?(1[0-2]|[1-9])$/i);
  if (strictMatch) {
    const g = parseInt(strictMatch[1], 10);
    const r = parseInt(strictMatch[2], 10);
    return `Kelas ${g}-${r}`;
  }

  // Date parser conversion for Excel/Google Sheets ISO dates or date strings
  const datePattern = /^(\d{4})[-/](\d{1,2})[-/](\d{1,2})(?:T.*)?$/;
  const datePatternDMY = /^(\d{1,2})[-/](\d{1,2})[-/](\d{4})(?:T.*)?$/;
  let match = name.match(datePattern);
  let year = 0, month = 0, day = 0;
  if (match) {
    year = parseInt(match[1], 10);
    month = parseInt(match[2], 10);
    day = parseInt(match[3], 10);
  } else {
    match = name.match(datePatternDMY);
    if (match) {
      day = parseInt(match[1], 10);
      month = parseInt(match[2], 10);
      year = parseInt(match[3], 10);
    }
  }
  if (year > 0 && month > 0 && day > 0) {
    if ((month >= 7 && month <= 9) && (day >= 1 && day <= 11)) return `Kelas ${month}-${day}`;
    if ((day >= 7 && day <= 9) && (month >= 1 && month <= 11)) return `Kelas ${day}-${month}`;
    if ((month >= 1 && month <= 3) && (day >= 1 && day <= 11)) return `Kelas ${month + 6}-${day}`;
    if ((day >= 1 && day <= 3) && (month >= 1 && month <= 11)) return `Kelas ${day + 6}-${month}`;
  }

  return rawName;
};

export const getStudentsForClass = (allSiswa: Siswa[], kelasIdOrName: string, allKelas: Kelas[] = []): Siswa[] => {
  if (!allSiswa || !Array.isArray(allSiswa) || !kelasIdOrName) return [];

  const cleanInput = kelasIdOrName.trim();
  const selectedKelasObj = (allKelas || []).find(k => k.id === cleanInput || (k.namaKelas && k.namaKelas.toLowerCase().trim() === cleanInput.toLowerCase().trim()));
  const targetId = (selectedKelasObj?.id || cleanInput).toLowerCase().trim();
  const targetName = (selectedKelasObj?.namaKelas || cleanInput).toLowerCase().trim();
  const targetNorm = normalizeClassName(targetName || targetId);

  return allSiswa.filter((s) => {
    if (!s) return false;
    const sKlId = (s.kelasId || '').toString().toLowerCase().trim();
    const sKlName = ((s as any).kelas || (s as any).namaKelas || (s as any).rombel || '').toString().toLowerCase().trim();

    // 1. Exact class ID match (e.g. "kl-2" === "kl-2")
    if (sKlId && targetId && sKlId === targetId) return true;

    // 2. Direct name match (e.g. "kelas 7-2" === "kelas 7-2")
    if (sKlName && targetName && sKlName === targetName) return true;

    // 3. Match normalized class names
    const normSName = normalizeClassName(sKlName);
    const normSId = sKlId.startsWith('kl-') ? normalizeClassName(sKlId) : '';
    const normS = normSName || normSId;
    if (normS && targetNorm && normS.toLowerCase() === targetNorm.toLowerCase()) {
      return true;
    }

    // 4. Match using standardKelasMap
    const stdSId = standardKelasMap[sKlName] || (normS ? standardKelasMap[normS] : undefined);
    if (stdSId && targetId && stdSId.toLowerCase() === targetId) {
      return true;
    }

    // 5. Match if target is standardKelasMap of sKlId
    const stdTargetId = standardKelasMap[targetName] || (targetNorm ? standardKelasMap[targetNorm] : undefined);
    if (stdTargetId && sKlId && stdTargetId.toLowerCase() === sKlId) {
      return true;
    }

    return false;
  }).sort((a, b) => (a.nama || '').localeCompare(b.nama || '', undefined, { sensitivity: 'base', numeric: true }));
};

export function sanitizeDatabaseState(parsed: any): { sanitized: DatabaseState; migrated: boolean } {
  if (!parsed || typeof parsed !== 'object') {
    return { sanitized: JSON.parse(JSON.stringify(INITIAL_DATABASE)), migrated: true };
  }

  let migrated = false;

  // Ensure config block is present and always sanitized to latest URL
  if (!parsed.config || typeof parsed.config !== 'object') {
    parsed.config = { 
      gasApiUrl: DEFAULT_GAS_API_URL, 
      spreadsheetId: (import.meta as any).env.VITE_SPREADSHEET_ID || '1g3thopFbDdsvlXyidgq_PEiiEhY5cH3PngqGO5weHqc' 
    };
    migrated = true;
  } else {
    const originalGas = parsed.config.gasApiUrl;
    const originalSpreadsheet = parsed.config.spreadsheetId;
    let gas = (parsed.config.gasApiUrl && typeof parsed.config.gasApiUrl === 'string' && parsed.config.gasApiUrl.trim() !== '' ? parsed.config.gasApiUrl : DEFAULT_GAS_API_URL).toString().trim();
    if (isOldOrDefaultUrl(gas)) {
      gas = DEFAULT_GAS_API_URL;
    }
    parsed.config = {
      gasApiUrl: gas,
      spreadsheetId: (parsed.config.spreadsheetId || (import.meta as any).env.VITE_SPREADSHEET_ID || '1g3thopFbDdsvlXyidgq_PEiiEhY5cH3PngqGO5weHqc').toString().trim()
    };
    if (parsed.config.gasApiUrl !== originalGas || parsed.config.spreadsheetId !== originalSpreadsheet) {
      migrated = true;
    }
  }

  if (parsed._sanitized_v12 && !migrated) {
    return { sanitized: parsed as DatabaseState, migrated: false };
  }

  // Safety initialize lists
  const listKeys = [
    'users', 'siswa', 'orangTua', 'akademik', 'kesehatan', 'ekonomi', 
    'psikologi', 'sosial', 'prestasi', 'pelanggaran', 'remisiPoin', 
    'konseling', 'asesmen', 'homeVisit', 'surat', 'dokumen', 
    'catatanPerkembangan', 'pengaduanSiswa', 'tahunPelajaran', 'kelas', 'jurusan', 'logAktivitas', 'kehadiran', 'laporanKejadian'
  ];

  listKeys.forEach(key => {
    if (!parsed[key] || !Array.isArray(parsed[key])) {
      parsed[key] = [];
      migrated = true;
    }
  });

  // Check if the parsed database is fundamentally empty (to prevent overwriting real local data with empty remote sheets)
  const isParsedEmpty = parsed.siswa.length === 0 || parsed.users.length === 0;

  if (isParsedEmpty) {
    parsed._sanitized_v7 = true;
    return { sanitized: parsed as DatabaseState, migrated };
  }

  // Self-healing: Check if the new BK users and 33 Wali Kelas exist in database. If not, reset users and kelas arrays to make sure accounts are loaded.
  const hasSulaiman = parsed.users.some((u: any) => u && u.username && u.username.toString().toLowerCase() === 'sulaiman');
  if (!hasSulaiman) {
    parsed.users = [...INITIAL_DATABASE.users];
    parsed.kelas = [...INITIAL_DATABASE.kelas];
    migrated = true;
  } else {
    // Ensure every Wali Kelas user in WALI_KELAS_USERS exists and is synchronized in parsed.users
    WALI_KELAS_USERS.forEach((wku) => {
      const localUser = parsed.users.find((u: any) => u && u.id === wku.id);
      if (localUser) {
        if (localUser.nama !== wku.nama || localUser.username !== wku.username || localUser.email !== wku.email) {
          localUser.nama = wku.nama;
          localUser.username = wku.username;
          localUser.email = wku.email;
          migrated = true;
        }
      } else {
        parsed.users.push(wku);
        migrated = true;
      }
    });
  }

  // Ensure Admin user is updated to Sulaiman, S.Psi
  const adminUser = parsed.users.find((u: any) => u && u.id === 'usr-1');
  if (adminUser) {
    if (adminUser.nama !== 'Sulaiman, S.Psi') {
      adminUser.nama = 'Sulaiman, S.Psi';
      adminUser.email = 'sulaiman.admin@sekolah.sch.id';
      migrated = true;
    }
  }

  // Ensure Guru Piket exists in database
  const hasGuruPiket = parsed.users.some((u: any) => u && u.id === 'usr-piket');
  if (!hasGuruPiket) {
    parsed.users.push({ id: 'usr-piket', username: 'Guru Piket', nama: 'Guru Piket', role: UserRole.GURU_PIKET, email: 'piket@sekolah.sch.id', isActive: true });
    migrated = true;
  }

  // Update log activities with old BK/Admin names and Kepala Sekolah
  parsed.logAktivitas = parsed.logAktivitas.map((l: any) => {
    if (!l) return l;
    const normUser = (l.namaUser || '').toString().toLowerCase();
    if (
      l.namaUser === 'Siti Rahma, S.Pd., M.Psi.' || 
      l.namaUser === 'Koordinator BK Sulaiman, S.Psi.,MM' || 
      l.namaUser === 'Koordinator BK Sulaiman, S.Psi., MM' || 
      l.namaUser === 'Sulaiman, S.Psi.,MM' || 
      l.namaUser === 'Sulaiman, S.Psi., MM' || 
      l.namaUser === 'Sulaiman, S.Psi,.MM' || 
      l.namaUser === 'Nur Jamilah Purwaningsih, S.Psi' ||
      normUser.includes('sulaiman') ||
      normUser.includes('siti rahma')
    ) {
      l.namaUser = 'Nur Jamilah Purwaningsih, S.Psi';
      l.role = 'Guru BK';
      migrated = true;
    }
    if (l.namaUser === 'Budi Santoso, S.Kom.') {
      l.namaUser = 'Sulaiman, S.Psi';
      migrated = true;
    }
    if (l.namaUser === 'Dr. H. Suprapto, M.Pd.') {
      l.namaUser = 'Salim, S.Pd., M.Hum.';
      migrated = true;
    }
    if (l.namaUser === 'Ahmad Dahlan, S.Pd.' || l.namaUser === 'Aulia Rohmah, S.Pd,.MM') {
      l.namaUser = 'Arta Polta, S.Pd';
      migrated = true;
    }
    if (l.namaUser === 'Novita Kusuma Wardhani, S.Pd' || l.namaUser === 'Dwi Susanti, S.Pd') {
      l.namaUser = 'Nanda Putri Utami, S.Pd';
      migrated = true;
    }
    return l;
  });

  // Update remisiPoin where column names or teacher names need normalization
  if (parsed.remisiPoin && Array.isArray(parsed.remisiPoin)) {
    parsed.remisiPoin = parsed.remisiPoin.map((r: any) => {
      if (!r || typeof r !== 'object') return r;
      if (!r.jenisRemisi && r.jenisRemis) r.jenisRemisi = r.jenisRemis;
      if (!r.guruPemberi && r.guruPember) r.guruPemberi = r.guruPember;
      if (!r.id) r.id = 'rem-' + Math.random().toString(36).substr(2, 9);
      const normG = (r.guruPemberi || '').toString().toLowerCase();
      if (normG.includes('sulaiman') || normG.includes('siti rahma')) {
        r.guruPemberi = 'Nur Jamilah Purwaningsih, S.Psi';
        migrated = true;
      }
      return r;
    });
  }

  // Update class Wali Kelas distribution and repair Google Sheets date/time formatting errors in class names (e.g. Jam 8-5 -> Kelas 8-5)
  const redirectKelasIdMap: { [oldId: string]: string } = {};

  // Pre-process and normalize class names
  parsed.kelas = parsed.kelas.map((k: any) => {
    if (!k) return k;

    const name = normalizeClassName(k.namaKelas);

    if (k.namaKelas !== name) {
      k.namaKelas = name;
      migrated = true;
    }
    return k;
  }).filter(Boolean);

  // Now, ensure all 33 standard classes from INITIAL_DATABASE are present with standard IDs, correct names, and correct waliKelasId
  INITIAL_DATABASE.kelas.forEach((c) => {
    // Check if class with standard ID exists
    const existingById = parsed.kelas.find((k: any) => k && k.id === c.id);
    if (existingById) {
      const normalizedName = normalizeClassName(existingById.namaKelas);
      const targetName = normalizeClassName(c.namaKelas);
      if (normalizedName !== targetName) {
        existingById.namaKelas = c.namaKelas;
        migrated = true;
      }
      if (existingById.waliKelasId !== c.waliKelasId) {
        existingById.waliKelasId = c.waliKelasId;
        migrated = true;
      }
    } else {
      // Find if there is a class with the same name but different ID (e.g., 'kelas-7-1' or raw 'Kelas 7-1')
      const existingByName = parsed.kelas.find((k: any) => k && k.namaKelas && normalizeClassName(k.namaKelas) === normalizeClassName(c.namaKelas));
      if (existingByName) {
        redirectKelasIdMap[existingByName.id] = c.id;
        existingByName.id = c.id;
        existingByName.namaKelas = c.namaKelas;
        existingByName.waliKelasId = c.waliKelasId;
        migrated = true;
      } else {
        // If not found by ID or Name, insert the standard class!
        parsed.kelas.push({ ...c });
        migrated = true;
      }
    }
  });

  // Deduplicate and filter classes to ensure clean unique list
  const seenClassNames = new Set<string>();
  const uniqueClasses: any[] = [];

  // Sort standard IDs ('kl-1' through 'kl-33') first to make sure they are prioritized
  const sortedClasses = [...parsed.kelas].sort((a: any, b: any) => {
    const isAStandard = a && a.id && a.id.startsWith('kl-');
    const isBStandard = b && b.id && b.id.startsWith('kl-');
    if (isAStandard && !isBStandard) return -1;
    if (!isAStandard && isBStandard) return 1;
    return 0;
  });

  sortedClasses.forEach((k: any) => {
    if (!k) return;
    const name = k.namaKelas;
    const standardId = standardKelasMap[name] || k.id;

    if (seenClassNames.has(name)) {
      // It's a duplicate! Redirect its ID to the first one seen (or its standard ID)
      const primaryClass = uniqueClasses.find((uc: any) => uc.namaKelas === name);
      const targetId = primaryClass ? primaryClass.id : standardId;
      if (k.id !== targetId) {
        redirectKelasIdMap[k.id] = targetId;
        migrated = true;
      }
    } else {
      // First time we see this class name!
      if (k.id !== standardId && !parsed.kelas.some((x: any) => x && x.id === standardId)) {
        redirectKelasIdMap[k.id] = standardId;
        k.id = standardId;
        migrated = true;
      }
      seenClassNames.add(name);
      uniqueClasses.push(k);
    }
  });

  parsed.kelas = uniqueClasses;

  // Update students' kelasId if they match a redirect mapping, or if we need to clean them
  parsed.siswa = parsed.siswa.map((s: any) => {
    if (!s) return s;
    
    // 1. Check if student's kelasId needs redirecting
    if (s.kelasId && redirectKelasIdMap[s.kelasId]) {
      s.kelasId = redirectKelasIdMap[s.kelasId];
      migrated = true;
    }
    
    // 2. Resolve standard class ID and clean class name from explicit class properties (rombel, namaKelas, kelas, or valid kl- ID)
    const rawClassVal = (s.rombel || s.namaKelas || s.kelas || (s.kelasId && (s.kelasId.startsWith('kl-') || !s.kelasId.startsWith('sis-')) ? s.kelasId : '') || '').toString().trim();
    if (rawClassVal) {
      const cleanName = normalizeClassName(rawClassVal);
      const standardId = standardKelasMap[cleanName] || standardKelasMap[rawClassVal];

      if (standardId) {
        if (s.kelasId !== standardId) {
          s.kelasId = standardId;
          migrated = true;
        }
        if (cleanName && s.kelas !== cleanName) {
          s.kelas = cleanName;
          migrated = true;
        }
      }
    }
    
    return s;
  });

  // Update guruPelapor in violations
  parsed.pelanggaran = parsed.pelanggaran.map((p: any) => {
    if (p) {
      if (p.guruPelapor === 'Ahmad Dahlan, S.Pd.' || p.guruPelapor === 'Aulia Rohmah, S.Pd,.MM') {
        p.guruPelapor = 'Arta Polta, S.Pd';
        migrated = true;
      } else if (p.guruPelapor === 'Novita Kusuma Wardhani, S.Pd' || p.guruPelapor === 'Dwi Susanti, S.Pd') {
        p.guruPelapor = 'Nanda Putri Utami, S.Pd';
        migrated = true;
      }
    }
    return p;
  });

  // If jurusan is not empty, clear it (only in offline mode, so we don't wipe out real sheet data)
  const activeGasUrl = (parsed?.config?.gasApiUrl || currentDatabase?.config?.gasApiUrl || '').toString().trim();
  if (!activeGasUrl) {
    if (parsed.jurusan && parsed.jurusan.length > 0) {
      parsed.jurusan = [];
      migrated = true;
    }
  }

  // Ensure every student record matches standard types, has basic info, and uses stable deterministic IDs
  parsed.siswa = parsed.siswa.map((s: any) => {
    if (s) {
      // 1. If it's a completely empty/blank row from Google Sheets, filter it out
      const hasNoName = !s.nama || s.nama.toString().trim() === '';
      const hasNoNis = !s.nis || s.nis.toString().trim() === '';
      const hasNoNisn = !s.nisn || s.nisn.toString().trim() === '';
      const hasNoId = !s.id || s.id.toString().trim() === '';
      
      if (hasNoName && hasNoNis && hasNoNisn && hasNoId) {
        return null;
      }

      // 2. Generate a stable, deterministic, permanent ID based on NIS / NISN / Name if missing
      if (!s.id || s.id.toString().trim() === '') {
        const cleanNis = (s.nis || '').toString().trim();
        const cleanNisn = (s.nisn || '').toString().trim();
        const cleanNama = (s.nama || '').toString().trim().toLowerCase().replace(/[^a-z0-9]/g, '');
        
        if (cleanNis) {
          s.id = `sis-nis-${cleanNis}`;
        } else if (cleanNisn) {
          s.id = `sis-nisn-${cleanNisn}`;
        } else if (cleanNama) {
          s.id = `sis-name-${cleanNama}`;
        } else {
          s.id = `sis-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        }
        migrated = true;
      }

      if (s.nis === undefined) { s.nis = ''; migrated = true; }
      if (s.nisn === undefined) { s.nisn = ''; migrated = true; }
      if (!s.nama || s.nama.toString().trim() === '') { 
        s.nama = 'Siswa Tanpa Nama'; 
        migrated = true; 
      }
      if (!s.agama || s.agama.toString().trim() === '' || s.agama === '-') {
        s.agama = 'Islam';
        migrated = true;
      }
    }
    return s;
  }).filter(Boolean);

  // Heal siswaId references across all sub-collections
  const relCollections = ['pelanggaran', 'laporanKejadian', 'remisiPoin', 'konseling', 'kehadiran', 'asesmen', 'homeVisit', 'surat', 'dokumen', 'catatanPerkembangan', 'prestasi'];
  relCollections.forEach((collName) => {
    if (parsed[collName] && Array.isArray(parsed[collName])) {
      parsed[collName].forEach((item: any) => {
        if (!item) return;
        const targetId = item.siswaId || item.idSiswa;
        if (targetId) {
          const matched = findSiswa(parsed as DatabaseState, targetId, item);
          if (matched && matched.id !== item.siswaId) {
            item.siswaId = matched.id;
            migrated = true;
          }
        }
      });
    }
  });

  // Helper to identify known sample/dummy data titles from initial templates
  const isSampleTitle = (title?: string) => {
    if (!title) return false;
    const t = title.toLowerCase();
    return t.includes('hackathon') || 
           t.includes('desain poster') || 
           t.includes('panjat pinang') || 
           t.includes('kripca') || 
           t.includes('contoh prestasi') || 
           t.includes('sample prestasi');
  };

  // Process PRESTASI - auto-heal IDs and match student IDs without dropping valid records
  if (parsed.prestasi && Array.isArray(parsed.prestasi)) {
    parsed.prestasi = parsed.prestasi.filter((p: any, idx: number) => {
      if (!p || typeof p !== 'object') return false;
      const hasContent = !!(p.namaPrestasi || p.tingkat || p.tahun || p.juara || p.kategori || p.siswaId || p.nama || p.siswaNama || p.namaSiswa || p.nis);
      if (!hasContent) return false;

      let id = String(p.id || '').trim();
      let sId = String(p.siswaId || p.idSiswa || p.siswald || '').trim();
      
      if (!id) {
        id = `pres-${sId ? sId.replace(/[^a-zA-Z0-9]/g, '') : 'row'}-${idx + 1}`;
        p.id = id;
      }
      
      if (isTombstoned(id) || (sId && isTombstoned(sId))) return false;
      
      // Filter out known sample template items only on dummy students
      if (isSampleTitle(p.namaPrestasi) && (!sId || sId.startsWith('sis-sample') || sId === 'sis-1' || sId === 'sis-2')) {
        addDeletedTombstone(id);
        addToDeletionQueue(id, 'deletePrestasi', { id, namaPrestasi: p.namaPrestasi, siswaId: sId });
        migrated = true;
        return false;
      }

      // Map to canonical student ID if match found
      if (parsed.siswa && parsed.siswa.length > 0) {
        const student = findSiswa(parsed as DatabaseState, sId, p);
        if (student && student.id !== p.siswaId) {
          p.siswaId = student.id;
          migrated = true;
        }
      }
      return true;
    });
  } else {
    parsed.prestasi = [];
  }

  // Process PELANGGARAN - auto-heal IDs and match student IDs without dropping valid records
  if (parsed.pelanggaran && Array.isArray(parsed.pelanggaran)) {
    parsed.pelanggaran = parsed.pelanggaran.filter((p: any, idx: number) => {
      if (!p || typeof p !== 'object') return false;
      const hasContent = !!(p.jenisPelanggaran || p.kategori || p.poin || p.tindakLanjut || p.siswaId || p.nama || p.siswaNama || p.namaSiswa || p.nis);
      if (!hasContent) return false;

      let id = String(p.id || '').trim();
      let sId = String(p.siswaId || p.idSiswa || p.siswald || '').trim();

      if (!id) {
        id = `pel-${sId ? sId.replace(/[^a-zA-Z0-9]/g, '') : 'row'}-${idx + 1}`;
        p.id = id;
      }

      if (isTombstoned(id) || (sId && isTombstoned(sId))) return false;

      if (parsed.siswa && parsed.siswa.length > 0) {
        const student = findSiswa(parsed as DatabaseState, sId, p);
        if (student && student.id !== p.siswaId) {
          p.siswaId = student.id;
          migrated = true;
        }
      }
      return true;
    });
  } else {
    parsed.pelanggaran = [];
  }

  // Process REMISI POIN - auto-heal IDs and match student IDs without dropping valid records
  if (parsed.remisiPoin && Array.isArray(parsed.remisiPoin)) {
    parsed.remisiPoin = parsed.remisiPoin.filter((r: any, idx: number) => {
      if (!r || typeof r !== 'object') return false;
      const hasContent = !!(r.jenisRemisi || r.kategori || r.poin || r.keterangan || r.siswaId || r.nama || r.siswaNama || r.namaSiswa || r.nis);
      if (!hasContent) return false;

      let id = String(r.id || '').trim();
      let sId = String(r.siswaId || r.idSiswa || r.siswald || '').trim();

      if (!id) {
        id = `rem-${sId ? sId.replace(/[^a-zA-Z0-9]/g, '') : 'row'}-${idx + 1}`;
        r.id = id;
      }

      if (isTombstoned(id) || (sId && isTombstoned(sId))) return false;

      if (parsed.siswa && parsed.siswa.length > 0) {
        const student = findSiswa(parsed as DatabaseState, sId, r);
        if (student && student.id !== r.siswaId) {
          r.siswaId = student.id;
          migrated = true;
        }
      }
      return true;
    });
  } else {
    parsed.remisiPoin = [];
  }

  // Process KONSELING - auto-heal IDs and match student IDs without dropping valid records
  if (parsed.konseling && Array.isArray(parsed.konseling)) {
    parsed.konseling = parsed.konseling.filter((k: any, idx: number) => {
      if (!k || typeof k !== 'object') return false;
      const hasContent = !!(k.permasalahan || k.nomorKonseling || k.analisis || k.solusi || k.hasil || k.tindakLanjut || k.siswaId || k.nama || k.siswaNama || k.namaSiswa || k.nis);
      if (!hasContent) return false;

      let id = String(k.id || '').trim();
      let sId = String(k.siswaId || k.idSiswa || k.siswald || '').trim();

      if (!id) {
        id = `kon-${sId ? sId.replace(/[^a-zA-Z0-9]/g, '') : 'row'}-${idx + 1}`;
        k.id = id;
      }

      if (isTombstoned(id) || (sId && isTombstoned(sId))) return false;

      if (parsed.siswa && parsed.siswa.length > 0) {
        const student = findSiswa(parsed as DatabaseState, sId, k);
        if (student && student.id !== k.siswaId) {
          k.siswaId = student.id;
          migrated = true;
        }
      }
      return true;
    });
  } else {
    parsed.konseling = [];
  }

  // Process ASESMEN - auto-heal IDs and match student IDs without dropping valid records
  if (parsed.asesmen && Array.isArray(parsed.asesmen)) {
    parsed.asesmen = parsed.asesmen.filter((a: any, idx: number) => {
      if (!a || typeof a !== 'object') return false;
      const hasContent = !!(a.akpd || a.dcm || a.aum || a.iq || a.minat || a.bakat || a.siswaId || a.id || a.nama || a.siswaNama || a.nis);
      if (!hasContent) return false;

      let id = String(a.id || '').trim();
      let sId = String(a.siswaId || a.idSiswa || a.siswald || a.id || '').trim();

      if (!id) {
        id = sId || `asm-row-${idx + 1}`;
        a.id = id;
      }

      if (isTombstoned(id) || (sId && isTombstoned(sId))) return false;

      if (parsed.siswa && parsed.siswa.length > 0) {
        const student = findSiswa(parsed as DatabaseState, sId, a);
        if (student && student.id !== a.siswaId) {
          a.siswaId = student.id;
          migrated = true;
        }
      }
      return true;
    });
  } else {
    parsed.asesmen = [];
  }

  // Process HOME VISIT - auto-heal IDs and match student IDs without dropping valid records
  if (parsed.homeVisit && Array.isArray(parsed.homeVisit)) {
    parsed.homeVisit = parsed.homeVisit.filter((h: any, idx: number) => {
      if (!h || typeof h !== 'object') return false;
      const hasContent = !!(h.tujuan || h.hasil || h.tanggal || h.siswaId || h.nama || h.siswaNama || h.namaSiswa || h.nis);
      if (!hasContent) return false;

      let id = String(h.id || '').trim();
      let sId = String(h.siswaId || h.idSiswa || h.siswald || '').trim();

      if (!id) {
        id = `hv-${sId ? sId.replace(/[^a-zA-Z0-9]/g, '') : 'row'}-${idx + 1}`;
        h.id = id;
      }

      if (isTombstoned(id) || (sId && isTombstoned(sId))) return false;

      if (parsed.siswa && parsed.siswa.length > 0) {
        const student = findSiswa(parsed as DatabaseState, sId, h);
        if (student && student.id !== h.siswaId) {
          h.siswaId = student.id;
          migrated = true;
        }
      }
      return true;
    });
  } else {
    parsed.homeVisit = [];
  }

  // Process SURAT - auto-heal IDs and match student IDs without dropping valid records
  if (parsed.surat && Array.isArray(parsed.surat)) {
    parsed.surat = parsed.surat.filter((s: any, idx: number) => {
      if (!s || typeof s !== 'object') return false;
      const hasContent = !!(s.nomorSurat || s.jenisSurat || s.perihal || s.isiSurat || s.siswaId || s.nama || s.siswaNama || s.namaSiswa || s.nis);
      if (!hasContent) return false;

      let id = String(s.id || '').trim();
      let sId = String(s.siswaId || s.idSiswa || s.siswald || '').trim();

      if (!id) {
        id = `srt-${sId ? sId.replace(/[^a-zA-Z0-9]/g, '') : 'row'}-${idx + 1}`;
        s.id = id;
      }

      if (isTombstoned(id) || (sId && isTombstoned(sId))) return false;

      if (parsed.siswa && parsed.siswa.length > 0) {
        const student = findSiswa(parsed as DatabaseState, sId, s);
        if (student && student.id !== s.siswaId) {
          s.siswaId = student.id;
          migrated = true;
        }
      }
      return true;
    });
  } else {
    parsed.surat = [];
  }

  // Process DOKUMEN - auto-heal IDs and match student IDs without dropping valid records
  if (parsed.dokumen && Array.isArray(parsed.dokumen)) {
    parsed.dokumen = parsed.dokumen.filter((d: any, idx: number) => {
      if (!d || typeof d !== 'object') return false;
      const hasContent = !!(d.namaFile || d.jenisDokumen || d.fileData || d.siswaId || d.nama || d.siswaNama || d.namaSiswa || d.nis);
      if (!hasContent) return false;

      let id = String(d.id || '').trim();
      let sId = String(d.siswaId || d.idSiswa || d.siswald || '').trim();

      if (!id) {
        id = `dok-${sId ? sId.replace(/[^a-zA-Z0-9]/g, '') : 'row'}-${idx + 1}`;
        d.id = id;
      }

      if (isTombstoned(id) || (sId && isTombstoned(sId))) return false;

      if (parsed.siswa && parsed.siswa.length > 0) {
        const student = findSiswa(parsed as DatabaseState, sId, d);
        if (student && student.id !== d.siswaId) {
          d.siswaId = student.id;
          migrated = true;
        }
      }
      return true;
    });
  } else {
    parsed.dokumen = [];
  }

  // Process KEHADIRAN - auto-heal IDs and match student IDs without dropping valid records
  if (parsed.kehadiran && Array.isArray(parsed.kehadiran)) {
    parsed.kehadiran = parsed.kehadiran.filter((k: any, idx: number) => {
      if (!k || typeof k !== 'object') return false;
      const hasContent = !!(k.mingguKe || k.bulan || k.hadir !== undefined || k.siswaId || k.nama || k.siswaNama || k.namaSiswa || k.nis);
      if (!hasContent) return false;

      let id = String(k.id || '').trim();
      let sId = String(k.siswaId || k.idSiswa || k.siswald || '').trim();

      if (!id) {
        id = `khd-${sId ? sId.replace(/[^a-zA-Z0-9]/g, '') : 'row'}-${idx + 1}`;
        k.id = id;
      }

      if (isTombstoned(id) || (sId && isTombstoned(sId))) return false;

      if (parsed.siswa && parsed.siswa.length > 0) {
        const student = findSiswa(parsed as DatabaseState, sId, k);
        if (student && student.id !== k.siswaId) {
          k.siswaId = student.id;
          migrated = true;
        }
      }
      return true;
    });
  } else {
    parsed.kehadiran = [];
  }

  // Process Catatan Perkembangan - auto-heal IDs and match student IDs without dropping valid records
  if (parsed.catatanPerkembangan && Array.isArray(parsed.catatanPerkembangan)) {
    parsed.catatanPerkembangan = parsed.catatanPerkembangan.filter((c: any, idx: number) => {
      if (!c || typeof c !== 'object') return false;
      const cleanCatatan = String(c.catatan || '').trim();
      const hasContent = !!(cleanCatatan || c.siswaId || c.idSiswa || c.nama || c.siswaNama || c.namaSiswa || c.nis);
      if (!hasContent) return false;

      let cleanId = String(c.id || '').trim();
      let cleanSiswaId = String(c.siswaId || c.idSiswa || c.siswald || '').trim();

      if (!cleanId) {
        cleanId = `cp-${cleanSiswaId ? cleanSiswaId.replace(/[^a-zA-Z0-9]/g, '') : 'row'}-${idx + 1}`;
        c.id = cleanId;
      }

      if (isTombstoned(cleanId) || (cleanSiswaId && isTombstoned(cleanSiswaId))) return false;

      if (parsed.siswa && parsed.siswa.length > 0) {
        const student = findSiswa(parsed as DatabaseState, cleanSiswaId, c);
        if (student && student.id !== c.siswaId) {
          c.siswaId = student.id;
          migrated = true;
        }
      }
      return true;
    });
  } else {
    parsed.catatanPerkembangan = [];
  }
  if (!parsed.akademik) parsed.akademik = [];

  parsed.siswa.forEach((s: any) => {
    if (!s || !s.id) return;

    let aka = parsed.akademik.find((a: any) => a && (a.id === s.id || a.siswaId === s.id));
    if (!aka) {
      aka = {
        id: s.id,
        siswaId: s.id,
        semester: '1',
        rataRataRaport: 80,
        catatanWaliKelas: ''
      };
      parsed.akademik.push(aka);
      migrated = true;
    } else {
      if (!aka.siswaId) aka.siswaId = s.id;
      if (!aka.id) aka.id = s.id;
    }

    const cpList = parsed.catatanPerkembangan.filter((c: any) => c && (c.siswaId === s.id || c.idSiswa === s.id));
    const latestCp = cpList.sort((a: any, b: any) => (b.tanggal || '').localeCompare(a.tanggal || ''))[0];

    // Synchronize latest catatanPerkembangan with akademik.catatanWaliKelas
    // If Catatan Perkembangan was deleted in Google Sheet / app, clear catatanWaliKelas so no stale note persists
    if (latestCp && latestCp.catatan && latestCp.catatan.toString().trim() !== '') {
      if (aka.catatanWaliKelas !== latestCp.catatan) {
        aka.catatanWaliKelas = latestCp.catatan;
        migrated = true;
      }
    } else {
      if (aka.catatanWaliKelas && aka.catatanWaliKelas.toString().trim() !== '' && aka.catatanWaliKelas !== '-') {
        aka.catatanWaliKelas = '';
        migrated = true;
      }
    }
  });

  // Ensure user attendance and complaint records are preserved and valid
  if (parsed.kehadiran && Array.isArray(parsed.kehadiran)) {
    parsed.kehadiran = parsed.kehadiran.filter((k: any) => k && (k.id || k.siswaId));
  }

  if (!parsed.pengaduanSiswa || !Array.isArray(parsed.pengaduanSiswa)) {
    parsed.pengaduanSiswa = [];
  } else {
    parsed.pengaduanSiswa = parsed.pengaduanSiswa.filter((p: any) => p && (p.id || p.judulPengaduan || p.kronologis));
  }

  parsed._sanitized_v12 = true;
  return { sanitized: parsed as DatabaseState, migrated };
}

function loadLocalDatabase(): DatabaseState {
  if (currentDatabase) {
    return currentDatabase;
  }
  const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
  if (stored) {
    try {
      const parsed = JSON.parse(stored);
      if (!parsed._cleaned_default_data_v2) {
        parsed._cleaned_default_data_v2 = true;
      }
      const { sanitized, migrated } = sanitizeDatabaseState(parsed);
      if (migrated || !stored.includes('_sanitized_v12')) {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(sanitized));
      }
      currentDatabase = sanitized;
      return sanitized;
    } catch (e) {
      console.error('Failed to parse local database, resetting to clean initial data.', e);
    }
  }
  const clonedInitial = JSON.parse(JSON.stringify(INITIAL_DATABASE));
  clonedInitial._cleaned_default_data_v2 = true;
  clonedInitial._sanitized_v12 = true;
  const { sanitized } = sanitizeDatabaseState(clonedInitial);
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(sanitized));
  currentDatabase = sanitized;
  return sanitized;
}

// Initialize currentDatabase immediately to guarantee it is populated
currentDatabase = loadLocalDatabase();

function saveLocalDatabase(db: DatabaseState) {
  const filtered = filterOutTombstones(db);
  const { sanitized } = sanitizeDatabaseState(filtered);
  currentDatabase = sanitized;
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(sanitized));
}

export const getGasApiUrl = (): string => {
  const envUrl = (import.meta as any).env.VITE_GAS_API_URL;
  if (envUrl && typeof envUrl === 'string' && envUrl.trim() !== '' && !isOldOrDefaultUrl(envUrl)) {
    return envUrl.trim();
  }
  const current = currentDatabase?.config?.gasApiUrl;
  if (current && typeof current === 'string' && current.trim() !== '' && !isOldOrDefaultUrl(current)) {
    return current.trim();
  }
  if (currentDatabase && currentDatabase.config) {
    currentDatabase.config.gasApiUrl = DEFAULT_GAS_API_URL;
  }
  return DEFAULT_GAS_API_URL;
};

export const setGasApiUrl = (url: string) => {
  const db = loadLocalDatabase();
  let cleanUrl = url ? url.trim() : '';
  if (isOldOrDefaultUrl(cleanUrl)) {
    cleanUrl = DEFAULT_GAS_API_URL;
  }
  db.config.gasApiUrl = cleanUrl;
  saveLocalDatabase(db);
};

export const extractSpreadsheetId = (input: string): string => {
  if (!input) return '';
  const trimmed = input.trim();
  if (trimmed.includes('/d/')) {
    const parts = trimmed.split('/d/');
    if (parts.length > 1) {
      return parts[1].split('/')[0];
    }
  }
  return trimmed;
};

export const getSpreadsheetId = (): string => {
  const envId = (import.meta as any).env.VITE_SPREADSHEET_ID;
  if (envId && envId.trim() !== '') {
    return extractSpreadsheetId(envId);
  }
  const rawId = currentDatabase?.config?.spreadsheetId || '1g3thopFbDdsvlXyidgq_PEiiEhY5cH3PngqGO5weHqc';
  return extractSpreadsheetId(rawId);
};

export const setSpreadsheetId = (id: string) => {
  const db = { ...currentDatabase } as DatabaseState;
  db.config.spreadsheetId = id ? extractSpreadsheetId(id) : '';
  saveLocalDatabase(db);
};

// Universal network request wrapper
async function apiCall<T>(action: string, payload: any = {}): Promise<{ success: boolean; data?: T; message?: string }> {
  const url = getGasApiUrl();
  if (!url) {
    // Falls back seamlessly to offline CRUD simulation
    return { success: false, message: 'Google Apps Script URL is not configured. Running in offline fallback mode.' };
  }

  const trimmedUrl = url.trim();
  const spreadsheetId = getSpreadsheetId();

  try {
    // Combine payload, action, and spreadsheetId into body to ensure parameter is preserved on 302 redirects
    const bodyPayload = typeof payload === 'object' && payload !== null
      ? { ...payload, action, spreadsheetId }
      : { payload, action, spreadsheetId };

    const queryParams = `?action=${action}&spreadsheetId=${encodeURIComponent(spreadsheetId)}`;
    const response = await fetch(`${trimmedUrl}${queryParams}`, {
      method: 'POST',
      mode: 'cors',
      headers: {
        'Content-Type': 'text/plain',
      },
      body: JSON.stringify(bodyPayload),
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const text = await response.text();
    let result: any;
    try {
      result = JSON.parse(text);
    } catch (e) {
      console.warn('Response is not valid JSON:', text);
      const isHtml = text.trim().startsWith('<') || text.includes('<html') || text.includes('<!DOCTYPE html>');
      if (isHtml) {
        throw new Error('Server mengembalikan respon HTML (bukan JSON). Ini biasanya terjadi jika: 1) Anda belum melakukan otorisasi hak akses (klik Review Permissions) di editor Google Apps Script Anda, ATAU 2) Opsi "Who has access" pada deployment Web App diatur secara salah (seharusnya set ke "Anyone", jangan "Only myself").');
      } else {
        throw new Error(`Gagal memproses respon data dari server: ${text.slice(0, 100)}...`);
      }
    }
    return result;
  } catch (error: any) {
    console.error('API Call Error:', error);
    return { success: false, message: error.message || 'Koneksi ke Google Apps Script gagal.' };
  }
}

/**
 * REST API & LocalStorage Fallback Methods
 */
let lastFetchSuccessful = false;

export const apiService = {
  // Config
  getGasUrl: () => getGasApiUrl(),
  getGasApiUrl: () => getGasApiUrl(),
  setGasUrl: (url: string) => setGasApiUrl(url),
  getSpreadsheetId: () => getSpreadsheetId(),
  setSpreadsheetId: (id: string) => setSpreadsheetId(id),
  getLastFetchStatus: () => lastFetchSuccessful,
  isOnlineMode: () => !!getGasApiUrl(),

  testConnection: async (): Promise<{ success: boolean; message: string; code?: string }> => {
    const url = getGasApiUrl();
    if (!url) {
      return { success: false, message: 'URL Google Apps Script belum diset.', code: 'NO_URL' };
    }
    
    const trimmedUrl = url.trim();
    if (!trimmedUrl.startsWith('https://script.google.com/')) {
      return { success: false, message: 'URL tidak valid. URL Google Apps Script yang benar harus diawali dengan "https://script.google.com/"', code: 'INVALID_URL' };
    }
    
    try {
      const spreadsheetId = getSpreadsheetId();
      const queryParams = `?action=getFullDatabase&spreadsheetId=${encodeURIComponent(spreadsheetId)}`;
      
      const response = await fetch(`${trimmedUrl}${queryParams}`, {
        method: 'POST',
        mode: 'cors',
        headers: {
          'Content-Type': 'text/plain',
        },
        body: JSON.stringify({ action: 'getFullDatabase', spreadsheetId }),
      });
      
      if (!response.ok) {
        return { success: false, message: `Server mengembalikan HTTP status ${response.status}.`, code: 'HTTP_ERROR' };
      }
      
      const text = await response.text();
      let json: any;
      try {
        json = JSON.parse(text);
      } catch (e) {
        return { 
          success: false, 
          message: `Gagal membaca format data. Server mengembalikan respon non-JSON (biasanya berupa halaman login atau izin otorisasi yang belum disetujui). Respon: ${text.slice(0, 150)}...`,
          code: 'NON_JSON_RESPONSE'
        };
      }
      
      if (json && typeof json === 'object') {
        if (json.success) {
          // Flush pending deletions in background
          processPendingDeletionsQueue().catch(err => console.warn('Queue flush warning:', err));
          return { success: true, message: json.message || 'Koneksi berhasil dan aktif!' };
        } else {
          return { success: false, message: json.message || 'Server mengembalikan status gagal.', code: 'SERVER_FAIL' };
        }
      } else {
        return { success: false, message: 'Format data dari server tidak dikenali.', code: 'UNKNOWN_FORMAT' };
      }
    } catch (error: any) {
      console.error('Test Connection Error:', error);
      return { 
        success: false, 
        message: `Gagal terhubung (CORS Error atau Network Offline). Pastikan Anda telah mengatur konfigurasi Web App di Google Apps Script Anda ke "Execute as: Me" dan "Who has access: Anyone".`,
        code: 'NETWORK_OR_CORS_ERROR'
      };
    }
  },

  uploadFullDatabase: async (payload: DatabaseState): Promise<{ success: boolean; message: string }> => {
    if (!getGasApiUrl()) {
      return { success: false, message: 'Google Apps Script URL belum dikonfigurasi.' };
    }
    const res = await apiCall<any>('uploadFullDatabase', payload);
    return { success: res.success, message: res.message || 'Selesai memproses unggah data.' };
  },

  // Log activity helper
  addLog: (userId: string, namaUser: string, role: string, aktivitas: string, detail: string) => {
    const db = loadLocalDatabase();
    const newLog: LogAktivitas = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString(),
      userId,
      namaUser,
      role,
      aktivitas,
      detail,
    };
    db.logAktivitas.unshift(newLog);
    if (db.logAktivitas.length > 200) db.logAktivitas.pop(); // Keep log sizes managed
    saveLocalDatabase(db);
    
    // Attempt online sync if configured
    if (getGasApiUrl()) {
      apiCall('addLog', newLog);
    }
  },

  // Auth / Login Simulation
  login: async (username: string, password?: string): Promise<{ success: boolean; user?: User; message?: string }> => {
    const db = loadLocalDatabase();
    
    // 1. Check in standard users (with extremely robust status checks for Boolean/String)
    const user = db.users.find((u) => {
      const uNameStr = (u.username || '').toString().toLowerCase();
      const inputNameStr = (username || '').toString().toLowerCase();
      
      // Determine if active (can be Boolean true or String "true"/"TRUE", or default true if undefined)
      const isActive = u.isActive === undefined || 
                       u.isActive === true || 
                       String(u.isActive).toLowerCase() === 'true';
                       
      return uNameStr === inputNameStr && isActive;
    });

    if (user) {
      if (!password) {
        return { success: false, message: 'Password wajib diisi.' };
      }
      
      const roleStr = (user.role || '').toString().toLowerCase();
      const isAdmin = roleStr === 'admin' || roleStr === UserRole.ADMIN.toLowerCase();
      const isGuruBk = roleStr === 'gurubk' || roleStr === 'koordinator bk' || roleStr === 'guru bk' || roleStr === UserRole.GURU_BK.toLowerCase();
      const isGuruPiket = roleStr === 'guru piket' || roleStr === UserRole.GURU_PIKET.toLowerCase();

      if (isAdmin) {
        if (password !== 'admin17') {
          return { success: false, message: 'Password Admin salah.' };
        }
      } else if (isGuruPiket) {
        if (password !== 'piket123') {
          return { success: false, message: 'Password Guru Piket salah.' };
        }
      } else if (isGuruBk) {
        const uNameLower = (user.username || '').toString().toLowerCase();
        const bkPasswords: Record<string, string> = {
          sulaiman: 'ayman123',
          aulia: 'aulia123',
          dwi: 'dwi123',
          kholfi: 'kholfi123',
          novita: 'novita123',
        };
        const expectedPassword = bkPasswords[uNameLower] || 'bk123';
        if (password !== expectedPassword) {
          return { success: false, message: `Password Guru BK ${user.nama} salah.` };
        }
      } else if (roleStr === UserRole.WALI_KELAS.toLowerCase() || roleStr === 'wali kelas') {
        const uNameLower = (user.username || '').toString().toLowerCase();
        const wkPasswords: Record<string, string> = {
          fay: 'fay123',
          aida: 'aida123',
          viika: 'viika123',
          sribarnetti: 'sri123',
          viny: 'viny123',
          lia: 'lia123',
          yanah: 'yanah123',
          srirahayu: 'sri123',
          putri: 'putri123',
          sari: 'sari123',
          rifal: 'rifal123',
          neneng: 'neneng123',
          meli: 'meli123',
          tiar: 'tiar123',
          joko: 'joko123',
          danang: 'danang123',
          sahdiana: 'ana123',
          annisa: 'annisa123',
          haifa: 'haifa123',
          santi: 'santi123',
          reni: 'reni123',
          dewi: 'dewi123',
          emi: 'emi123',
          tere: 'tere23',
          ferry: 'ferry123',
          sifah: 'sifah123',
          mia: 'mia123',
          nur: 'nur123',
          warsih: 'warsih123',
          tut: 'tut123',
          kasrah: 'kasrah123',
          habib: 'habib123',
          pendi: 'pendi123',
          hadi: 'hadi123'
        };
        const expectedPassword = wkPasswords[uNameLower] || '123';
        if (password !== expectedPassword) {
          return { success: false, message: `Password Wali Kelas ${user.nama} salah.` };
        }
      } else {
        // Fallback for any other user role
        if (password !== '123') {
          return { success: false, message: 'Password salah.' };
        }
      }

      apiService.addLog(user.id, user.nama, user.role, 'Login', 'Siswa, guru, atau staf berhasil masuk.');
      return { success: true, user };
    }

    // 2. Check in student database (by ID, NIS, NISN or Name)
    const s = db.siswa.find((student) => {
      const uLower = (username || '').toString().trim().toLowerCase();
      const sId = student.id ? student.id.toString().trim().toLowerCase() : '';
      const sNis = student.nis ? student.nis.toString().trim().toLowerCase() : '';
      const sNisn = student.nisn ? student.nisn.toString().trim().toLowerCase() : '';
      const sNama = student.nama ? student.nama.toString().trim().toLowerCase() : '';
      return sId === uLower || sNis === uLower || sNisn === uLower || sNama === uLower;
    });

    if (s) {
      if (!password) {
        return { success: false, message: 'Password wajib diisi.' };
      }

      // Password MUST match student's NIS or NISN (or password field if set in Google Sheets)
      const pLower = (password || '').toString().trim().toLowerCase();
      const sNis = s.nis ? s.nis.toString().trim().toLowerCase() : '';
      const sNisn = s.nisn ? s.nisn.toString().trim().toLowerCase() : '';
      const sPass = (s as any).password ? (s as any).password.toString().trim().toLowerCase() : '';

      const validPassword = 
        (sNis && pLower === sNis) ||
        (sNisn && pLower === sNisn) ||
        (sPass && pLower === sPass) ||
        (!sNis && !sNisn && pLower === s.id.toString().trim().toLowerCase());

      if (!validPassword) {
        return { success: false, message: 'Password salah. Gunakan nomor NIS atau NISN resmi siswa.' };
      }

      const studentUser: User = {
        id: s.id,
        username: s.nis ? s.nis.toString() : s.id,
        nama: s.nama,
        role: UserRole.SISWA,
        email: s.email || `${s.nis || s.id}@student.sch.id`,
        isActive: true
      };
      apiService.addLog(s.id, s.nama, UserRole.SISWA, 'Login', 'Siswa berhasil login menggunakan NIS/NISN.');
      return { success: true, user: studentUser };
    }

    return { success: false, message: 'Username / NIS tidak ditemukan.' };
  },

  // GET Dynamic Data (Combines offline state + optional remote load)
  getData: async (force: boolean = false, localOnly: boolean = false): Promise<DatabaseState> => {
    let localDb = loadLocalDatabase();
    localDb = filterOutTombstones(localDb);
    if (localOnly) {
      return localDb;
    }
    if (getGasApiUrl()) {
      // 1. Process any pending deletions in the background queue first
      try {
        await processPendingDeletionsQueue();
      } catch (err) {
        console.warn('Queue flush warning during getData:', err);
      }

      const res = await apiCall<DatabaseState>('getFullDatabase');
      if (res.success && res.data) {
        // Clear tombstones for any items that exist in the remote database
        clearTombstonesForExistingItems(res.data);

        // Sanitize the remote data first to ensure types and mappings are consistent
        const { sanitized } = sanitizeDatabaseState(res.data);

        // Cegah penimpaan data lokal jika database di Google Sheets kosong (belum di-seeding)
        const isEmptyRemote = 
          (!sanitized.users || sanitized.users.length === 0) || 
          (!sanitized.siswa || sanitized.siswa.length === 0);

        if (isEmptyRemote) {
          lastFetchSuccessful = true;
          if (force) {
            throw new Error('Database di Google Sheets kosong atau belum di-seeding. Silakan gunakan tombol "Unggah Data Lokal ke Google Sheets" terlebih dahulu.');
          }
          // Tetap gunakan data lokal agar user tidak keluar/terkunci dan data tidak hilang!
          const updated = filterOutTombstones({ ...localDb, config: { ...localDb.config, gasApiUrl: getGasApiUrl() } });
          saveLocalDatabase(updated);
          return updated;
        }

        // Google Sheets is the authoritative remote database.
        // Filter out tombstoned items that were deleted by the user
        const cleanRemote = filterOutTombstones(sanitized);

        const updated: DatabaseState = {
          ...cleanRemote,
          config: { ...localDb.config, gasApiUrl: getGasApiUrl(), spreadsheetId: getSpreadsheetId() }
        };
        saveLocalDatabase(updated);
        lastFetchSuccessful = true;

        return updated;
      } else {
        lastFetchSuccessful = false;
        if (force) {
          throw new Error(res.message || 'Koneksi ke Google Apps Script gagal.');
        }
      }
    } else {
      lastFetchSuccessful = false;
      if (force) {
        throw new Error('URL Google Apps Script belum disetel.');
      }
    }
    return localDb;
  },

  resetDatabase: async (): Promise<DatabaseState> => {
    const currentConfig = currentDatabase?.config || { gasApiUrl: '', spreadsheetId: '' };
    localStorage.removeItem(LOCAL_STORAGE_KEY);
    currentDatabase = null;
    const restored = loadLocalDatabase();
    
    // Selalu pertahankan konfigurasi Google Sheets yang sudah disetel user
    restored.config = {
      gasApiUrl: currentConfig.gasApiUrl || restored.config.gasApiUrl,
      spreadsheetId: currentConfig.spreadsheetId || restored.config.spreadsheetId
    };
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(restored));
    currentDatabase = restored;
    return restored;
  },

  // CRUD Operations with dynamic routing (Remote first, else LocalStorage)
  
  // 1. SISWA + ORANG TUA + KESEHATAN + EKONOMI + PSIKOLOGI + SOSIAL + AKADEMIK (Unified Student Package)
  saveSiswa: async (
    siswaData: Siswa,
    orangTuaData: OrangTua,
    kesehatanData: Kesehatan,
    ekonomiData: Ekonomi,
    psikologiData: Psikologi,
    sosialData: Sosial,
    akademikData: Akademik,
    isNew: boolean,
    localOnly: boolean = false
  ): Promise<{ success: boolean; message: string }> => {
    // Un-tombstone if re-created
    removeDeletedTombstone(siswaData.id);
    const db = loadLocalDatabase();
    
    if (isNew) {
      // Check for duplicate NIS (only for other students)
      if (siswaData.nis && db.siswa.some(s => s.nis === siswaData.nis && s.id !== siswaData.id)) {
        return { success: false, message: `Siswa dengan NIS ${siswaData.nis} sudah terdaftar.` };
      }
      if (!db.siswa.some(s => s.id === siswaData.id)) {
        db.siswa.push(siswaData);
        db.orangTua.push(orangTuaData);
        db.kesehatan.push(kesehatanData);
        db.ekonomi.push(ekonomiData);
        db.psikologi.push(psikologiData);
        db.sosial.push(sosialData);
        db.akademik.push(akademikData);
      } else {
        // Fallback: update existing record to avoid duplicate elements in the arrays
        db.siswa = db.siswa.map(s => s.id === siswaData.id ? siswaData : s);
        db.orangTua = db.orangTua.map(o => o.id === orangTuaData.id ? orangTuaData : o);
        db.kesehatan = db.kesehatan.map(k => k.id === kesehatanData.id ? kesehatanData : k);
        db.ekonomi = db.ekonomi.map(e => e.id === ekonomiData.id ? ekonomiData : e);
        db.psikologi = db.psikologi.map(p => p.id === psikologiData.id ? psikologiData : p);
        db.sosial = db.sosial.map(s => s.id === sosialData.id ? sosialData : s);
        db.akademik = db.akademik.map(a => a.id === akademikData.id ? akademikData : a);
      }
    } else {
      const updateOrInsert = <T extends { id: string }>(arr: T[], item: T): T[] => {
        return arr.some(x => x.id === item.id)
          ? arr.map(x => x.id === item.id ? item : x)
          : [...arr, item];
      };
      db.siswa = updateOrInsert(db.siswa, siswaData);
      db.orangTua = updateOrInsert(db.orangTua, orangTuaData);
      db.kesehatan = updateOrInsert(db.kesehatan, kesehatanData);
      db.ekonomi = updateOrInsert(db.ekonomi, ekonomiData);
      db.psikologi = updateOrInsert(db.psikologi, psikologiData);
      db.sosial = updateOrInsert(db.sosial, sosialData);
      db.akademik = updateOrInsert(db.akademik, akademikData);
    }

    if (akademikData && akademikData.catatanWaliKelas && akademikData.catatanWaliKelas.toString().trim() !== '' && akademikData.catatanWaliKelas.toString().trim() !== '-') {
      if (!db.catatanPerkembangan) db.catatanPerkembangan = [];
      const cpIndex = db.catatanPerkembangan.findIndex(c => c.siswaId === siswaData.id);
      const todayStr = new Date().toISOString().split('T')[0];
      if (cpIndex >= 0) {
        db.catatanPerkembangan[cpIndex].catatan = akademikData.catatanWaliKelas;
        db.catatanPerkembangan[cpIndex].tanggal = todayStr;
      } else {
        db.catatanPerkembangan.push({
          id: `cp-${siswaData.id}-${Date.now()}`,
          siswaId: siswaData.id,
          tanggal: todayStr,
          catatan: akademikData.catatanWaliKelas,
          guruBkId: 'walikelas'
        });
      }
    }

    saveLocalDatabase(db);

    if (localOnly) {
      return { success: true, message: 'Siswa berhasil disimpan secara lokal.' };
    }

    if (getGasApiUrl()) {
      const remoteRes = await apiCall<{ success: boolean }>('saveSiswaPackage', {
        siswa: siswaData,
        orangTua: orangTuaData,
        kesehatan: kesehatanData,
        ekonomi: ekonomiData,
        psikologi: psikologiData,
        sosial: sosialData,
        akademik: akademikData,
        isNew,
      });
      if (remoteRes.success) {
        return { success: true, message: 'Siswa berhasil disimpan secara online di Google Sheets.' };
      } else {
        return { success: false, message: `Gagal menyimpan data ke Google Sheets.\n\nDetail Error: ${remoteRes.message || 'Koneksi ditolak oleh Google Apps Script.'}\n\nLangkah Solusi:\n1. Buka editor Google Apps Script Anda.\n2. Pastikan file 'Code.gs' dan 'Siswa.gs' sudah sesuai dengan kode terbaru.\n3. Anda WAJIB membuat penerapan baru: Klik "Terapkan" -> "Penerapan baru" -> Pilih Jenis "Aplikasi Web" -> Set akses "Siapa saja" -> Klik "Terapkan".\n4. Salin URL Aplikasi Web baru tersebut dan simpan di menu Pengaturan aplikasi.` };
      }
    }

    return { success: true, message: 'Siswa berhasil disimpan secara offline.' };
  },

  deleteSiswa: async (siswaId: string): Promise<{ success: boolean; message: string }> => {
    // 1. Mark as permanently tombstoned
    addDeletedTombstone(siswaId);

    // 2. Add to persistent sync deletion queue
    addToDeletionQueue(siswaId, 'deleteSiswa', { id: siswaId });

    // 3. Remove immediately from local database state
    const db = loadLocalDatabase();
    db.siswa = db.siswa.filter(s => s.id !== siswaId);
    db.orangTua = db.orangTua.filter(o => o.id !== siswaId);
    db.kesehatan = db.kesehatan.filter(k => k.id !== siswaId);
    db.ekonomi = db.ekonomi.filter(e => e.id !== siswaId);
    db.psikologi = db.psikologi.filter(p => p.id !== siswaId);
    db.sosial = db.sosial.filter(s => s.id !== siswaId);
    db.akademik = db.akademik.filter(a => a.id !== siswaId);
    db.prestasi = db.prestasi.filter(p => p.siswaId !== siswaId);
    db.pelanggaran = db.pelanggaran.filter(p => p.siswaId !== siswaId);
    db.konseling = db.konseling.filter(k => k.siswaId !== siswaId);
    db.asesmen = db.asesmen.filter(a => a.siswaId !== siswaId);
    db.homeVisit = db.homeVisit.filter(h => h.siswaId !== siswaId);
    db.surat = db.surat.filter(s => s.siswaId !== siswaId);
    db.dokumen = db.dokumen.filter(d => d.siswaId !== siswaId);
    db.catatanPerkembangan = db.catatanPerkembangan.filter(c => c.siswaId !== siswaId);
    if (db.kehadiran) db.kehadiran = db.kehadiran.filter(k => k.siswaId !== siswaId);
    if (db.pengaduanSiswa) db.pengaduanSiswa = db.pengaduanSiswa.filter(p => p.siswaId !== siswaId);

    saveLocalDatabase(db);

    // 4. Trigger queue process in background
    processPendingDeletionsQueue().catch(err => console.warn('Queue flush warning in deleteSiswa:', err));

    return { success: true, message: 'Siswa dan seluruh berkas terkait berhasil dihapus permanen di aplikasi & antrean Google Sheets.' };
  },

  // 2. TAHUN PELAJARAN CRUD
  saveTahunPelajaran: async (tp: TahunPelajaran, isNew: boolean): Promise<{ success: boolean; message: string }> => {
    removeDeletedTombstone(tp.id);
    const db = loadLocalDatabase();
    if (tp.isActive) {
      // Deactivate all others
      db.tahunPelajaran = db.tahunPelajaran.map(item => ({ ...item, isActive: false }));
    }
    if (isNew) {
      db.tahunPelajaran.push(tp);
    } else {
      db.tahunPelajaran = db.tahunPelajaran.map(item => item.id === tp.id ? tp : item);
    }
    saveLocalDatabase(db);

    if (getGasApiUrl()) {
      await apiCall('saveTahunPelajaran', { tp, isNew });
    }
    return { success: true, message: 'Tahun Pelajaran berhasil disimpan.' };
  },

  deleteTahunPelajaran: async (id: string): Promise<{ success: boolean; message: string }> => {
    addDeletedTombstone(id);
    addToDeletionQueue(id, 'deleteTahunPelajaran', { id });
    const db = loadLocalDatabase();
    db.tahunPelajaran = db.tahunPelajaran.filter(item => item.id !== id);
    saveLocalDatabase(db);
    processPendingDeletionsQueue().catch(err => console.warn('Queue error:', err));
    return { success: true, message: 'Tahun Pelajaran berhasil dihapus permanen.' };
  },

  // 3. KELAS CRUD
  saveKelas: async (kl: Kelas, isNew: boolean): Promise<{ success: boolean; message: string }> => {
    removeDeletedTombstone(kl.id);
    const db = loadLocalDatabase();
    if (isNew) {
      db.kelas.push(kl);
    } else {
      db.kelas = db.kelas.map(item => item.id === kl.id ? kl : item);
    }
    saveLocalDatabase(db);
    if (getGasApiUrl()) await apiCall('saveKelas', { kl, isNew });
    return { success: true, message: 'Kelas berhasil disimpan.' };
  },

  deleteKelas: async (id: string): Promise<{ success: boolean; message: string }> => {
    addDeletedTombstone(id);
    addToDeletionQueue(id, 'deleteKelas', { id });
    const db = loadLocalDatabase();
    db.kelas = db.kelas.filter(item => item.id !== id);
    saveLocalDatabase(db);
    processPendingDeletionsQueue().catch(err => console.warn('Queue error:', err));
    return { success: true, message: 'Kelas berhasil dihapus permanen.' };
  },

  // 5. USER CRUD (Guru BK / Users)
  saveUser: async (user: User, isNew: boolean): Promise<{ success: boolean; message: string }> => {
    removeDeletedTombstone(user.id);
    const db = loadLocalDatabase();
    if (isNew) {
      if (db.users.some(u => u.username.toLowerCase() === user.username.toLowerCase())) {
        return { success: false, message: 'Username sudah digunakan.' };
      }
      db.users.push(user);
    } else {
      db.users = db.users.map(item => item.id === user.id ? user : item);
    }
    saveLocalDatabase(db);
    if (getGasApiUrl()) await apiCall('saveUser', { user, isNew });
    return { success: true, message: 'User berhasil disimpan.' };
  },

  deleteUser: async (id: string): Promise<{ success: boolean; message: string }> => {
    addDeletedTombstone(id);
    addToDeletionQueue(id, 'deleteUser', { id });
    const db = loadLocalDatabase();
    db.users = db.users.filter(item => item.id !== id);
    saveLocalDatabase(db);
    processPendingDeletionsQueue().catch(err => console.warn('Queue error:', err));
    return { success: true, message: 'User berhasil dihapus permanen.' };
  },

  // 6. PRESTASI CRUD
  savePrestasi: async (p: Prestasi, isNew: boolean): Promise<{ success: boolean; message: string }> => {
    removeDeletedTombstone(p.id);
    const db = loadLocalDatabase();
    if (isNew) {
      db.prestasi.push(p);
    } else {
      db.prestasi = db.prestasi.map(item => item.id === p.id ? p : item);
    }
    saveLocalDatabase(db);
    if (getGasApiUrl()) await apiCall('savePrestasi', { p, isNew });
    return { success: true, message: 'Data Prestasi berhasil disimpan.' };
  },

  deletePrestasi: async (id: string, extraPayload?: any): Promise<{ success: boolean; message: string }> => {
    addDeletedTombstone(id);
    const db = loadLocalDatabase();
    const targetItem = db.prestasi.find(item => item.id === id);
    addToDeletionQueue(id, 'deletePrestasi', { 
      id, 
      namaPrestasi: targetItem?.namaPrestasi, 
      siswaId: targetItem?.siswaId, 
      ...(extraPayload || {}) 
    });
    db.prestasi = db.prestasi.filter(item => item.id !== id);
    saveLocalDatabase(db);
    processPendingDeletionsQueue().catch(err => console.warn('Queue error:', err));
    return { success: true, message: 'Data Prestasi berhasil dihapus permanen.' };
  },

  // 7. PELANGGARAN CRUD
  savePelanggaran: async (p: Pelanggaran, isNew: boolean): Promise<{ success: boolean; message: string }> => {
    removeDeletedTombstone(p.id);
    const db = loadLocalDatabase();
    if (isNew) {
      db.pelanggaran.push(p);
    } else {
      db.pelanggaran = db.pelanggaran.map(item => item.id === p.id ? p : item);
    }
    saveLocalDatabase(db);
    if (getGasApiUrl()) await apiCall('savePelanggaran', { p, isNew });
    return { success: true, message: 'Data Pelanggaran berhasil disimpan.' };
  },

  deletePelanggaran: async (id: string, extraPayload?: any): Promise<{ success: boolean; message: string }> => {
    addDeletedTombstone(id);
    const db = loadLocalDatabase();
    const targetItem = db.pelanggaran.find(item => item.id === id);
    addToDeletionQueue(id, 'deletePelanggaran', { 
      id, 
      jenisPelanggaran: targetItem?.jenisPelanggaran, 
      siswaId: targetItem?.siswaId, 
      ...(extraPayload || {}) 
    });
    db.pelanggaran = db.pelanggaran.filter(item => item.id !== id);
    saveLocalDatabase(db);
    processPendingDeletionsQueue().catch(err => console.warn('Queue error:', err));
    return { success: true, message: 'Data Pelanggaran berhasil dihapus permanen.' };
  },

  // 7b. REMISI POIN CRUD
  saveRemisiPoin: async (r: RemisiPoin, isNew: boolean): Promise<{ success: boolean; message: string }> => {
    removeDeletedTombstone(r.id);
    const db = loadLocalDatabase();
    if (!db.remisiPoin) db.remisiPoin = [];
    if (isNew) {
      db.remisiPoin.push(r);
    } else {
      db.remisiPoin = db.remisiPoin.map(item => item.id === r.id ? r : item);
    }
    saveLocalDatabase(db);
    if (getGasApiUrl()) {
      const remoteRes = await apiCall('saveRemisiPoin', { r, isNew });
      if (!remoteRes.success) {
        return {
          success: false,
          message: `Gagal menyimpan Remisi Poin ke Google Sheets.\n\nDetail Error: ${remoteRes.message || 'Koneksi ditolak.'}\n\nLangkah Solusi:\n1. Buka menu Pengaturan > Google Apps Script Integration.\n2. Unduh atau salin kode 'MASTER_CONSOLIDATED_Code.gs' terbaru.\n3. Tempelkan di editor Google Apps Script Anda, lalu Deploy ulang sebagai "Penerapan Baru" (Akses: Siapa Saja).`
        };
      }
    }
    return { success: true, message: 'Data Remisi Poin berhasil disimpan.' };
  },

  deleteRemisiPoin: async (id: string): Promise<{ success: boolean; message: string }> => {
    addDeletedTombstone(id);
    addToDeletionQueue(id, 'deleteRemisiPoin', { id });
    const db = loadLocalDatabase();
    if (!db.remisiPoin) db.remisiPoin = [];
    db.remisiPoin = db.remisiPoin.filter(item => item.id !== id);
    saveLocalDatabase(db);
    processPendingDeletionsQueue().catch(err => console.warn('Queue error:', err));
    return { success: true, message: 'Data Remisi Poin berhasil dihapus permanen.' };
  },

  // 8. KONSELING CRUD
  saveKonseling: async (k: Konseling, isNew: boolean): Promise<{ success: boolean; message: string }> => {
    removeDeletedTombstone(k.id);
    const db = loadLocalDatabase();
    if (isNew) {
      db.konseling.push(k);
    } else {
      db.konseling = db.konseling.map(item => item.id === k.id ? k : item);
    }
    saveLocalDatabase(db);
    if (getGasApiUrl()) await apiCall('saveKonseling', { k, isNew });
    return { success: true, message: 'Data Konseling berhasil disimpan.' };
  },

  deleteKonseling: async (id: string): Promise<{ success: boolean; message: string }> => {
    addDeletedTombstone(id);
    addToDeletionQueue(id, 'deleteKonseling', { id });
    const db = loadLocalDatabase();
    db.konseling = db.konseling.filter(item => item.id !== id);
    saveLocalDatabase(db);
    processPendingDeletionsQueue().catch(err => console.warn('Queue error:', err));
    return { success: true, message: 'Data Konseling berhasil dihapus permanen.' };
  },

  // 9. ASESMEN CRUD
  saveAsesmen: async (a: Asesmen, isNew: boolean): Promise<{ success: boolean; message: string }> => {
    removeDeletedTombstone(a.id);
    const db = loadLocalDatabase();
    if (isNew) {
      db.asesmen.push(a);
    } else {
      db.asesmen = db.asesmen.map(item => item.id === a.id ? a : item);
    }
    saveLocalDatabase(db);
    if (getGasApiUrl()) await apiCall('saveAsesmen', { a, isNew });
    return { success: true, message: 'Data Asesmen berhasil disimpan.' };
  },

  deleteAsesmen: async (id: string): Promise<{ success: boolean; message: string }> => {
    addDeletedTombstone(id);
    addToDeletionQueue(id, 'deleteAsesmen', { id });
    const db = loadLocalDatabase();
    db.asesmen = db.asesmen.filter(item => item.id !== id);
    saveLocalDatabase(db);
    processPendingDeletionsQueue().catch(err => console.warn('Queue error:', err));
    return { success: true, message: 'Data Asesmen berhasil dihapus permanen.' };
  },

  // 10. HOME VISIT CRUD
  saveHomeVisit: async (h: HomeVisit, isNew: boolean): Promise<{ success: boolean; message: string }> => {
    removeDeletedTombstone(h.id);
    const db = loadLocalDatabase();
    if (isNew) {
      db.homeVisit.push(h);
    } else {
      db.homeVisit = db.homeVisit.map(item => item.id === h.id ? h : item);
    }
    saveLocalDatabase(db);
    if (getGasApiUrl()) await apiCall('saveHomeVisit', { h, isNew });
    return { success: true, message: 'Data Kunjungan Rumah berhasil disimpan.' };
  },

  deleteHomeVisit: async (id: string): Promise<{ success: boolean; message: string }> => {
    addDeletedTombstone(id);
    addToDeletionQueue(id, 'deleteHomeVisit', { id });
    const db = loadLocalDatabase();
    db.homeVisit = db.homeVisit.filter(item => item.id !== id);
    saveLocalDatabase(db);
    processPendingDeletionsQueue().catch(err => console.warn('Queue error:', err));
    return { success: true, message: 'Data Kunjungan Rumah berhasil dihapus permanen.' };
  },

  // 11. SURAT CRUD
  saveSurat: async (s: Surat, isNew: boolean): Promise<{ success: boolean; message: string }> => {
    removeDeletedTombstone(s.id);
    const db = loadLocalDatabase();
    if (isNew) {
      db.surat.push(s);
    } else {
      db.surat = db.surat.map(item => item.id === s.id ? s : item);
    }
    saveLocalDatabase(db);
    if (getGasApiUrl()) await apiCall('saveSurat', { s, isNew });
    return { success: true, message: 'Dokumen Surat berhasil disimpan.' };
  },

  deleteSurat: async (id: string): Promise<{ success: boolean; message: string }> => {
    addDeletedTombstone(id);
    addToDeletionQueue(id, 'deleteSurat', { id });
    const db = loadLocalDatabase();
    db.surat = db.surat.filter(item => item.id !== id);
    saveLocalDatabase(db);
    processPendingDeletionsQueue().catch(err => console.warn('Queue error:', err));
    return { success: true, message: 'Dokumen Surat berhasil dihapus permanen.' };
  },

  // 12. DOKUMEN CRUD
  saveDokumen: async (d: Dokumen, isNew: boolean): Promise<{ success: boolean; message: string }> => {
    removeDeletedTombstone(d.id);
    const db = loadLocalDatabase();
    if (isNew) {
      db.dokumen.push(d);
    } else {
      db.dokumen = db.dokumen.map(item => item.id === d.id ? d : item);
    }
    saveLocalDatabase(db);
    if (getGasApiUrl()) await apiCall('saveDokumen', { d, isNew });
    return { success: true, message: 'Dokumen Siswa berhasil diunggah.' };
  },

  deleteDokumen: async (id: string): Promise<{ success: boolean; message: string }> => {
    addDeletedTombstone(id);
    addToDeletionQueue(id, 'deleteDokumen', { id });
    const db = loadLocalDatabase();
    db.dokumen = db.dokumen.filter(item => item.id !== id);
    saveLocalDatabase(db);
    processPendingDeletionsQueue().catch(err => console.warn('Queue error:', err));
    return { success: true, message: 'Dokumen Siswa berhasil dihapus permanen.' };
  },

  // 13. CATATAN PERKEMBANGAN CRUD
  saveCatatanPerkembangan: async (c: CatatanPerkembangan, isNew: boolean): Promise<{ success: boolean; message: string }> => {
    removeDeletedTombstone(c.id);
    const db = loadLocalDatabase();
    if (isNew) {
      db.catatanPerkembangan.push(c);
    } else {
      db.catatanPerkembangan = db.catatanPerkembangan.map(item => item.id === c.id ? c : item);
    }
    saveLocalDatabase(db);
    if (getGasApiUrl()) await apiCall('saveCatatanPerkembangan', { c, isNew });
    return { success: true, message: 'Catatan Perkembangan berhasil disimpan.' };
  },

  deleteCatatanPerkembangan: async (id: string): Promise<{ success: boolean; message: string }> => {
    addDeletedTombstone(id);
    addToDeletionQueue(id, 'deleteCatatanPerkembangan', { id });
    const db = loadLocalDatabase();
    const targetCp = (db.catatanPerkembangan || []).find(item => item.id === id);
    db.catatanPerkembangan = (db.catatanPerkembangan || []).filter(item => item.id !== id);

    // Also update/clear corresponding catatanWaliKelas in akademik
    if (targetCp && targetCp.siswaId && db.akademik) {
      const ak = db.akademik.find(a => a.id === targetCp.siswaId || (a as any).siswaId === targetCp.siswaId);
      if (ak) {
        const remainingCp = db.catatanPerkembangan
          .filter(c => c.siswaId === targetCp.siswaId)
          .sort((a, b) => (b.tanggal || '').localeCompare(a.tanggal || ''))[0];
        ak.catatanWaliKelas = remainingCp ? remainingCp.catatan : '';
      }
    }

    saveLocalDatabase(db);
    processPendingDeletionsQueue().catch(err => console.warn('Queue error:', err));
    return { success: true, message: 'Catatan Perkembangan berhasil dihapus permanen.' };
  },

  // 14. HEALTH, PSYCHOLOGY, ACADEMIC, ECONOMIC Sub-CRUD (direct updates for specific tabs)
  saveKesehatan: async (k: Kesehatan): Promise<{ success: boolean; message: string }> => {
    removeDeletedTombstone(k.id);
    const db = loadLocalDatabase();
    db.kesehatan = db.kesehatan.map(item => item.id === k.id ? k : item);
    if (!db.kesehatan.some(item => item.id === k.id)) db.kesehatan.push(k);
    saveLocalDatabase(db);
    if (getGasApiUrl()) await apiCall('saveKesehatanOnly', k);
    return { success: true, message: 'Kesehatan berhasil diperbarui.' };
  },

  saveEkonomi: async (e: Ekonomi): Promise<{ success: boolean; message: string }> => {
    removeDeletedTombstone(e.id);
    const db = loadLocalDatabase();
    db.ekonomi = db.ekonomi.map(item => item.id === e.id ? e : item);
    if (!db.ekonomi.some(item => item.id === e.id)) db.ekonomi.push(e);
    saveLocalDatabase(db);
    if (getGasApiUrl()) await apiCall('saveEkonomiOnly', e);
    return { success: true, message: 'Ekonomi berhasil diperbarui.' };
  },

  savePsikologi: async (p: Psikologi): Promise<{ success: boolean; message: string }> => {
    removeDeletedTombstone(p.id);
    const db = loadLocalDatabase();
    db.psikologi = db.psikologi.map(item => item.id === p.id ? p : item);
    if (!db.psikologi.some(item => item.id === p.id)) db.psikologi.push(p);
    saveLocalDatabase(db);
    if (getGasApiUrl()) await apiCall('savePsikologiOnly', p);
    return { success: true, message: 'Psikologi berhasil diperbarui.' };
  },

  // 15. KEHADIRAN (REKAP KEHADIRAN PERMINGGU) CRUD
  saveKehadiran: async (k: Kehadiran, isNew: boolean): Promise<{ success: boolean; message: string }> => {
    if (!k.id) {
      k.id = `att-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    }
    removeDeletedTombstone(k.id);
    const db = loadLocalDatabase();
    if (!db.kehadiran) db.kehadiran = [];

    // Ensure numeric fields are numbers
    k.hadir = Number(k.hadir || 0);
    k.sakit = Number(k.sakit || 0);
    k.izin = Number(k.izin || (k as any).ijin || 0);
    k.alfa = Number(k.alfa || (k as any).alpha || 0);

    // Derive class name if missing or empty
    if (!k.kelas && k.siswaId) {
      const student = db.siswa.find(s => s.id === k.siswaId);
      if (student) {
        if (student.kelasId) {
          const cls = db.kelas.find(c => c.id === student.kelasId);
          k.kelas = cls ? cls.namaKelas : student.kelasId;
        } else {
          k.kelas = (student as any).kelas || (student as any).namaKelas || '-';
        }
      }
    }
    if (!k.kelas) {
      k.kelas = '-';
    }

    if (isNew) {
      // Check if item with same ID or same (siswaId + bulan + mingguKe) already exists locally
      const existingIdx = db.kehadiran.findIndex(item => item.id === k.id || (item.siswaId === k.siswaId && item.bulan === k.bulan && item.mingguKe === k.mingguKe));
      if (existingIdx !== -1) {
        db.kehadiran[existingIdx] = k;
      } else {
        db.kehadiran.push(k);
      }
    } else {
      db.kehadiran = db.kehadiran.map(item => item.id === k.id ? k : item);
    }

    saveLocalDatabase(db);

    if (getGasApiUrl()) {
      try {
        const res = await apiCall<{ success: boolean; message?: string }>('saveKehadiran', { k, isNew });
        if (res && res.success === false) {
          console.warn('Google Sheets saveKehadiran returned error:', res.message);
          return { success: false, message: 'Gagal menyimpan ke Google Sheets: ' + (res.message || 'Error tidak diketahui') };
        }
      } catch (err: any) {
        console.warn('Google Sheets saveKehadiran network error:', err);
        return { success: false, message: 'Gagal terhubung ke Google Sheets: ' + (err?.message || 'Error jaringan') };
      }
    }
    return { success: true, message: 'Rekap Kehadiran berhasil disimpan permanen di aplikasi & Google Sheets.' };
  },

  deleteKehadiran: async (id: string): Promise<{ success: boolean; message: string }> => {
    addDeletedTombstone(id);
    addToDeletionQueue(id, 'deleteKehadiran', { id });
    const db = loadLocalDatabase();
    if (!db.kehadiran) db.kehadiran = [];
    db.kehadiran = db.kehadiran.filter(item => item.id !== id);
    saveLocalDatabase(db);
    processPendingDeletionsQueue().catch(err => console.warn('Queue error:', err));
    return { success: true, message: 'Rekap Kehadiran berhasil dihapus permanen.' };
  },

  // 16. LAPORAN KEJADIAN CRUD
  saveLaporanKejadian: async (l: LaporanKejadian, isNew: boolean): Promise<{ success: boolean; message: string }> => {
    if (!l.id) {
      l.id = `lap-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    }
    removeDeletedTombstone(l.id);
    const db = loadLocalDatabase();
    if (!db.laporanKejadian) db.laporanKejadian = [];
    if (isNew) {
      const existingIdx = db.laporanKejadian.findIndex(item => item.id === l.id);
      if (existingIdx !== -1) {
        db.laporanKejadian[existingIdx] = l;
      } else {
        db.laporanKejadian.unshift(l);
      }
    } else {
      db.laporanKejadian = db.laporanKejadian.map(item => item.id === l.id ? l : item);
    }
    saveLocalDatabase(db);
    
    if (getGasApiUrl()) {
      try {
        const res = await apiCall('saveLaporanKejadian', { l, isNew });
        if (res.success) {
          return { success: true, message: 'Laporan Kejadian berhasil dikirim dan tersimpan di Google Sheets & Aplikasi.' };
        } else {
          return { success: true, message: 'Laporan Kejadian tersimpan di aplikasi. Status Sheets: ' + (res.message || 'Harap update script Apps Script.') };
        }
      } catch (e: any) {
        console.warn('Google Sheet saveLaporanKejadian warning:', e);
        return { success: true, message: 'Laporan Kejadian tersimpan lokal di aplikasi. Hubungkan/perbarui Apps Script untuk sinkronisasi Google Sheets.' };
      }
    }
    return { success: true, message: 'Laporan Kejadian berhasil dikirim ke Admin & Guru BK.' };
  },

  deleteLaporanKejadian: async (id: string): Promise<{ success: boolean; message: string }> => {
    addDeletedTombstone(id);
    addToDeletionQueue(id, 'deleteLaporanKejadian', { id });
    const db = loadLocalDatabase();
    if (!db.laporanKejadian) db.laporanKejadian = [];
    db.laporanKejadian = db.laporanKejadian.filter(item => item.id !== id);
    saveLocalDatabase(db);
    processPendingDeletionsQueue().catch(err => console.warn('Queue error:', err));
    return { success: true, message: 'Laporan Kejadian berhasil dihapus permanen.' };
  },

  updateLaporanKejadianStatus: async (id: string, status: 'Belum Dibaca' | 'Dibaca'): Promise<{ success: boolean; message: string }> => {
    const db = loadLocalDatabase();
    if (!db.laporanKejadian) db.laporanKejadian = [];
    db.laporanKejadian = db.laporanKejadian.map(item => item.id === id ? { ...item, status } : item);
    saveLocalDatabase(db);
    if (getGasApiUrl()) {
      try {
        await apiCall('updateLaporanKejadianStatus', { id, status });
      } catch (e) {
        console.warn('Google Sheet does not support updateLaporanKejadianStatus yet.', e);
      }
    }
    return { success: true, message: 'Status laporan berhasil diperbarui.' };
  },

  // 17. PENGADUAN SISWA CRUD (Sheets: Pengaduan_Siswa)
  savePengaduan: async (p: PengaduanSiswa, isNew: boolean): Promise<{ success: boolean; message: string }> => {
    if (!p.id) {
      p.id = `aduan-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    }
    removeDeletedTombstone(p.id);
    const db = loadLocalDatabase();
    if (!db.pengaduanSiswa) db.pengaduanSiswa = [];
    if (isNew) {
      // Avoid duplicate ID if already exists
      const existingIdx = db.pengaduanSiswa.findIndex(item => item.id === p.id);
      if (existingIdx !== -1) {
        db.pengaduanSiswa[existingIdx] = p;
      } else {
        db.pengaduanSiswa.unshift(p);
      }
    } else {
      db.pengaduanSiswa = db.pengaduanSiswa.map(item => item.id === p.id ? p : item);
    }
    saveLocalDatabase(db);
    
    if (getGasApiUrl()) {
      try {
        const res = await apiCall('savePengaduan', { p, isNew });
        if (res.success) {
          return { success: true, message: 'Pengaduan siswa berhasil dikirim dan tersimpan di Google Sheets & Aplikasi.' };
        } else {
          return { 
            success: true, 
            message: 'Pengaduan tersimpan di aplikasi. Catatan Sheets: ' + (res.message || 'Harap update script Apps Script Anda.') 
          };
        }
      } catch (e: any) {
        console.warn('Google Sheets savePengaduan warning:', e);
        return { 
          success: true, 
          message: 'Pengaduan tersimpan di aplikasi (Offline/Lokal). Hubungkan atau perbarui Apps Script untuk sinkronisasi Google Sheets.' 
        };
      }
    }
    return { success: true, message: 'Pengaduan siswa berhasil dikirim dan tersimpan secara permanen di aplikasi.' };
  },

  deletePengaduan: async (id: string): Promise<{ success: boolean; message: string }> => {
    addDeletedTombstone(id);
    addToDeletionQueue(id, 'deletePengaduan', { id });
    const db = loadLocalDatabase();
    if (!db.pengaduanSiswa) db.pengaduanSiswa = [];
    db.pengaduanSiswa = db.pengaduanSiswa.filter(item => item.id !== id);
    saveLocalDatabase(db);
    processPendingDeletionsQueue().catch(err => console.warn('Queue error:', err));
    return { success: true, message: 'Data Pengaduan berhasil dihapus permanen.' };
  },

  updatePengaduanStatus: async (
    id: string, 
    status: 'Menunggu Respon' | 'Sedang Ditangani' | 'Selesai' | 'Ditolak',
    tanggapanBk?: string,
    petugasBk?: string
  ): Promise<{ success: boolean; message: string }> => {
    const db = loadLocalDatabase();
    if (!db.pengaduanSiswa) db.pengaduanSiswa = [];
    const tgl = new Date().toISOString().split('T')[0];
    db.pengaduanSiswa = db.pengaduanSiswa.map(item => {
      if (item.id === id) {
        return {
          ...item,
          status,
          ...(tanggapanBk !== undefined ? { tanggapanBk } : {}),
          ...(petugasBk !== undefined ? { petugasBk } : {}),
          tanggalTanggapan: tgl
        };
      }
      return item;
    });
    saveLocalDatabase(db);
    if (getGasApiUrl()) {
      try {
        await apiCall('updatePengaduanStatus', { id, status, tanggapanBk, petugasBk, tanggalTanggapan: tgl });
      } catch (e) {
        console.warn('Google Sheets updatePengaduanStatus warning:', e);
      }
    }
    return { success: true, message: 'Tanggapan & Status Pengaduan berhasil diperbarui.' };
  },

  // 18. PEMBERSIHAN DATA SAMPEL & SINKRONISASI PERMANEN
  purgeAllLegacySampleData: async (): Promise<{ success: boolean; message: string; purgedCount: number }> => {
    let db = loadLocalDatabase();
    let purgedCount = 0;
    
    // Purge known mock/sample prestasis and orphaned records
    const sampleKeywords = ['hackathon', 'desain poster', 'panjat pinang', 'kripca', 'sample', 'contoh'];
    
    const initialPrestasiLen = db.prestasi ? db.prestasi.length : 0;
    const initialPelanggaranLen = db.pelanggaran ? db.pelanggaran.length : 0;
    const initialKonselingLen = db.konseling ? db.konseling.length : 0;
    const initialRemisiLen = db.remisiPoin ? db.remisiPoin.length : 0;
    
    if (db.prestasi && Array.isArray(db.prestasi)) {
      db.prestasi = db.prestasi.filter(p => {
        if (!p) return false;
        const isSample = sampleKeywords.some(kw => (p.namaPrestasi || '').toLowerCase().includes(kw));
        const hasStudent = db.siswa.some(s => s.id === p.siswaId || (s.nama && s.nama.toLowerCase() === (p as any).namaSiswa?.toLowerCase()));
        if (isSample || (!hasStudent && db.siswa.length > 0)) {
          addDeletedTombstone(p.id);
          addToDeletionQueue(p.id, 'deletePrestasi', { id: p.id, namaPrestasi: p.namaPrestasi, siswaId: p.siswaId });
          return false;
        }
        return true;
      });
    }
    
    if (db.pelanggaran && Array.isArray(db.pelanggaran)) {
      db.pelanggaran = db.pelanggaran.filter(p => {
        if (!p) return false;
        const isSample = sampleKeywords.some(kw => (p.jenisPelanggaran || '').toLowerCase().includes(kw));
        const hasStudent = db.siswa.some(s => s.id === p.siswaId);
        if (isSample || (!hasStudent && db.siswa.length > 0)) {
          addDeletedTombstone(p.id);
          addToDeletionQueue(p.id, 'deletePelanggaran', { id: p.id, jenisPelanggaran: p.jenisPelanggaran, siswaId: p.siswaId });
          return false;
        }
        return true;
      });
    }

    if (db.konseling && Array.isArray(db.konseling)) {
      db.konseling = db.konseling.filter(k => {
        if (!k) return false;
        const hasStudent = db.siswa.some(s => s.id === k.siswaId);
        if (!hasStudent && db.siswa.length > 0) {
          addDeletedTombstone(k.id);
          addToDeletionQueue(k.id, 'deleteKonseling', { id: k.id, nomorKonseling: k.nomorKonseling, siswaId: k.siswaId });
          return false;
        }
        return true;
      });
    }

    if (db.remisiPoin && Array.isArray(db.remisiPoin)) {
      db.remisiPoin = db.remisiPoin.filter(r => {
        if (!r) return false;
        const hasStudent = db.siswa.some(s => s.id === r.siswaId);
        if (!hasStudent && db.siswa.length > 0) {
          addDeletedTombstone(r.id);
          addToDeletionQueue(r.id, 'deleteRemisiPoin', { id: r.id, jenisRemisi: r.jenisRemisi, siswaId: r.siswaId });
          return false;
        }
        return true;
      });
    }

    purgedCount += (initialPrestasiLen - (db.prestasi?.length || 0)) + 
                   (initialPelanggaranLen - (db.pelanggaran?.length || 0)) + 
                   (initialKonselingLen - (db.konseling?.length || 0)) +
                   (initialRemisiLen - (db.remisiPoin?.length || 0));
                   
    saveLocalDatabase(db);
    
    // Sync clean state to Google Sheets immediately if connected
    if (getGasApiUrl()) {
      try {
        await processPendingDeletionsQueue();
        const uploadRes = await apiService.uploadFullDatabase(db);
        if (uploadRes.success) {
          return {
            success: true,
            purgedCount,
            message: `Pembersihan berhasil! ${purgedCount} data lama bawaan aplikasi telah dihapus permanen dan seluruh data baru telah tersimpan permanen di Google Sheets & aplikasi.`
          };
        }
      } catch (err: any) {
        console.warn('Sync warning after purge:', err);
      }
    }
    
    return {
      success: true,
      purgedCount,
      message: `Pembersihan berhasil! ${purgedCount} data lama bawaan aplikasi telah dihapus permanen dari memori aplikasi.`
    };
  }
};
