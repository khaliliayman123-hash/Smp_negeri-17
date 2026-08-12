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
  TahunPelajaran,
  Kelas,
  LogAktivitas,
  DatabaseState,
  Kehadiran,
  LaporanKejadian,
} from '../types';

const LOCAL_STORAGE_KEY = 'hds_bk_database_v1';

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
  if (trimmed.includes('AKfycbw')) return true;
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

    // 3. Match by exact name
    match = db.siswa.find(s => s && s.nama && s.nama.toString().trim().toLowerCase() === targetLower);
    if (match) return match;
  }

  // 4. Match via itemObj fields if itemObj provided (nis, siswaNama, namaSiswa, nama, siswaId)
  if (itemObj) {
    const itemNis = (itemObj.nis || itemObj.nisSiswa || '').toString().trim();
    if (itemNis) {
      const match = db.siswa.find(s => s && s.nis && s.nis.toString().trim() === itemNis);
      if (match) return match;
    }

    const itemNama = (itemObj.siswaNama || itemObj.namaSiswa || itemObj.nama || itemObj.siswa || '').toString().trim().toLowerCase();
    if (itemNama && itemNama !== 'siswa') {
      const match = db.siswa.find(s => s && s.nama && s.nama.toString().trim().toLowerCase() === itemNama);
      if (match) return match;

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
    standardKelasMap[`${gradeNum}-${i}`] = klId;
    standardKelasMap[`Kelas ${gradeNum}-${i}`] = klId;
    standardKelasMap[`${gradeNum}.${i}`] = klId;
    standardKelasMap[`Kelas ${gradeNum}.${i}`] = klId;
    standardKelasMap[`${gradeNum}/${i}`] = klId;
    standardKelasMap[`Kelas ${gradeNum}/${i}`] = klId;
  }
};
mapGradeToMap(7, 1);   // kl-1 to kl-11
mapGradeToMap(8, 12);  // kl-12 to kl-22
mapGradeToMap(9, 23);  // kl-23 to kl-33

export const normalizeClassName = (rawName: string): string => {
  let name = String(rawName || '').trim();
  if (!name) return '';

  // Check kl-X IDs (e.g. kl-1 to kl-11 -> Kelas 7-1 to 7-11, kl-12 to kl-22 -> Kelas 8-1 to 8-11, kl-23 to kl-33 -> Kelas 9-1 to 9-11)
  const klMatch = name.match(/^kl-(\d+)$/i);
  if (klMatch) {
    const num = parseInt(klMatch[1], 10);
    if (num >= 1 && num <= 11) return `Kelas 7-${num}`;
    if (num >= 12 && num <= 22) return `Kelas 8-${num - 11}`;
    if (num >= 23 && num <= 33) return `Kelas 9-${num - 22}`;
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

  // Try finding grade 7-9 and rombel 1-12 anywhere in string
  const matchAny = name.match(/([789])\s*[-.\/:_]?\s*(1[0-2]|[1-9])\b/i);
  if (matchAny) {
    const g = parseInt(matchAny[1], 10);
    const r = parseInt(matchAny[2], 10);
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

  if (parsed._sanitized_v11 && !migrated) {
    return { sanitized: parsed as DatabaseState, migrated: false };
  }

  // Safety initialize lists
  const listKeys = [
    'users', 'siswa', 'orangTua', 'akademik', 'kesehatan', 'ekonomi', 
    'psikologi', 'sosial', 'prestasi', 'pelanggaran', 'remisiPoin', 
    'konseling', 'asesmen', 'homeVisit', 'surat', 'dokumen', 
    'catatanPerkembangan', 'tahunPelajaran', 'kelas', 'jurusan', 'logAktivitas', 'kehadiran', 'laporanKejadian'
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
    
    // 2. Resolve standard class ID and clean class name from any class property (kelas, namaKelas, rombel, kelasId)
    const rawClassVal = (s.kelas || s.namaKelas || s.rombel || s.kelasId || '').toString().trim();
    if (rawClassVal) {
      const cleanName = normalizeClassName(rawClassVal);
      const standardId = standardKelasMap[cleanName] || standardKelasMap[rawClassVal];

      if (standardId && (s.kelasId !== standardId || !s.kelasId || !s.kelasId.startsWith('kl-'))) {
        s.kelasId = standardId;
        migrated = true;
      }
      if (cleanName && s.kelas !== cleanName) {
        s.kelas = cleanName;
        migrated = true;
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

  // Ensure user attendance records are preserved and valid
  if (parsed.kehadiran && Array.isArray(parsed.kehadiran)) {
    parsed.kehadiran = parsed.kehadiran.filter((k: any) => k && (k.id || k.siswaId));
  }

  parsed._sanitized_v11 = true;
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
      if (migrated || !stored.includes('_sanitized_v11')) {
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
  clonedInitial._sanitized_v11 = true;
  const { sanitized } = sanitizeDatabaseState(clonedInitial);
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(sanitized));
  currentDatabase = sanitized;
  return sanitized;
}

// Initialize currentDatabase immediately to guarantee it is populated
currentDatabase = loadLocalDatabase();

function saveLocalDatabase(db: DatabaseState) {
  const { sanitized } = sanitizeDatabaseState(db);
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
    const localDb = loadLocalDatabase();
    if (localOnly) {
      return localDb;
    }
    if (getGasApiUrl()) {
      const res = await apiCall<DatabaseState>('getFullDatabase');
      if (res.success && res.data) {
        // Sanitize the remote data first to filter out empty/invalid rows!
        const { sanitized, migrated } = sanitizeDatabaseState(res.data);

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
          const updated = { ...localDb, config: { ...localDb.config, gasApiUrl: getGasApiUrl() } };
          saveLocalDatabase(updated);
          return updated;
        }

        // Intelligent Merge: Preserve any locally created records (e.g. Kehadiran, Pelanggaran, Laporan, etc.)
        // that exist in localDb but are not yet present in Google Sheets response.
        const collectionsToPreserve: (keyof DatabaseState)[] = [
          'kehadiran', 'pelanggaran', 'remisiPoin', 'laporanKejadian',
          'konseling', 'prestasi', 'surat', 'dokumen', 'catatanPerkembangan',
          'asesmen', 'homeVisit', 'siswa', 'orangTua', 'akademik',
          'kesehatan', 'ekonomi', 'psikologi', 'sosial', 'users', 'kelas', 'tahunPelajaran'
        ];

        const mergedData = { ...sanitized };

        collectionsToPreserve.forEach((collKey) => {
          const localItems = Array.isArray((localDb as any)[collKey]) ? (localDb as any)[collKey] : [];
          const remoteItems = Array.isArray((sanitized as any)[collKey]) ? (sanitized as any)[collKey] : [];

          if (localItems.length > 0) {
            const remoteMap = new Map<string, any>();
            remoteItems.forEach((item: any) => {
              if (item && item.id) {
                remoteMap.set(item.id.toString(), item);
              }
            });

            const combined = [...remoteItems];

            localItems.forEach((localItem: any) => {
              if (localItem && localItem.id) {
                const strId = localItem.id.toString();
                if (!remoteMap.has(strId)) {
                  combined.push(localItem);

                  // Auto background sync to GAS so Google Sheets catches up!
                  if (collKey === 'kehadiran') {
                    apiCall('saveKehadiran', { k: localItem, isNew: true }).catch(() => {});
                  } else if (collKey === 'pelanggaran') {
                    apiCall('savePelanggaran', { p: localItem, isNew: true }).catch(() => {});
                  } else if (collKey === 'laporanKejadian') {
                    apiCall('saveLaporanKejadian', { l: localItem, isNew: true }).catch(() => {});
                  } else if (collKey === 'prestasi') {
                    apiCall('savePrestasi', { p: localItem, isNew: true }).catch(() => {});
                  } else if (collKey === 'konseling') {
                    apiCall('saveKonseling', { k: localItem, isNew: true }).catch(() => {});
                  } else if (collKey === 'remisiPoin') {
                    apiCall('saveRemisiPoin', { r: localItem, isNew: true }).catch(() => {});
                  }
                }
              }
            });

            (mergedData as any)[collKey] = combined;
          }
        });

        // Update local cache with remote authoritative data + merged local items
        const updated = {
          ...mergedData,
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

    saveLocalDatabase(db);

    if (getGasApiUrl()) {
      const res = await apiCall('deleteSiswa', { id: siswaId });
      if (res.success) {
        return { success: true, message: 'Siswa berhasil dihapus secara online di Google Sheets.' };
      } else {
        return { 
          success: false, 
          message: `Gagal menghapus siswa dari Google Sheets secara permanen.\n\nDetail Error: ${res.message || 'Koneksi ditolak oleh Google Apps Script.'}\n\nLangkah Solusi:\n1. Buka editor Google Apps Script Anda.\n2. Pastikan file 'Code.gs' dan 'Siswa.gs' sudah sesuai dengan kode terbaru.\n3. Anda WAJIB membuat penerapan baru: Klik "Terapkan" -> "Penerapan baru" -> Pilih Jenis "Aplikasi Web" -> Set akses "Siapa saja" -> Klik "Terapkan".\n4. Salin URL Aplikasi Web baru tersebut dan simpan di menu Pengaturan aplikasi.` 
        };
      }
    }
    return { success: true, message: 'Siswa berhasil dihapus secara lokal.' };
  },

  // 2. TAHUN PELAJARAN CRUD
  saveTahunPelajaran: async (tp: TahunPelajaran, isNew: boolean): Promise<{ success: boolean; message: string }> => {
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
    const db = loadLocalDatabase();
    db.tahunPelajaran = db.tahunPelajaran.filter(item => item.id !== id);
    saveLocalDatabase(db);
    if (getGasApiUrl()) await apiCall('deleteTahunPelajaran', { id });
    return { success: true, message: 'Tahun Pelajaran berhasil dihapus.' };
  },

  // 3. KELAS CRUD
  saveKelas: async (kl: Kelas, isNew: boolean): Promise<{ success: boolean; message: string }> => {
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
    const db = loadLocalDatabase();
    db.kelas = db.kelas.filter(item => item.id !== id);
    saveLocalDatabase(db);
    if (getGasApiUrl()) await apiCall('deleteKelas', { id });
    return { success: true, message: 'Kelas berhasil dihapus.' };
  },

  // 5. USER CRUD (Guru BK / Users)
  saveUser: async (user: User, isNew: boolean): Promise<{ success: boolean; message: string }> => {
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
    const db = loadLocalDatabase();
    db.users = db.users.filter(item => item.id !== id);
    saveLocalDatabase(db);
    if (getGasApiUrl()) await apiCall('deleteUser', { id });
    return { success: true, message: 'User berhasil dihapus.' };
  },

  // 6. PRESTASI CRUD
  savePrestasi: async (p: Prestasi, isNew: boolean): Promise<{ success: boolean; message: string }> => {
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

  deletePrestasi: async (id: string): Promise<{ success: boolean; message: string }> => {
    const db = loadLocalDatabase();
    db.prestasi = db.prestasi.filter(item => item.id !== id);
    saveLocalDatabase(db);
    if (getGasApiUrl()) await apiCall('deletePrestasi', { id });
    return { success: true, message: 'Data Prestasi berhasil dihapus.' };
  },

  // 7. PELANGGARAN CRUD
  savePelanggaran: async (p: Pelanggaran, isNew: boolean): Promise<{ success: boolean; message: string }> => {
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

  deletePelanggaran: async (id: string): Promise<{ success: boolean; message: string }> => {
    const db = loadLocalDatabase();
    db.pelanggaran = db.pelanggaran.filter(item => item.id !== id);
    saveLocalDatabase(db);
    if (getGasApiUrl()) await apiCall('deletePelanggaran', { id });
    return { success: true, message: 'Data Pelanggaran berhasil dihapus.' };
  },

  // 7b. REMISI POIN CRUD
  saveRemisiPoin: async (r: RemisiPoin, isNew: boolean): Promise<{ success: boolean; message: string }> => {
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
    const db = loadLocalDatabase();
    if (!db.remisiPoin) db.remisiPoin = [];
    db.remisiPoin = db.remisiPoin.filter(item => item.id !== id);
    saveLocalDatabase(db);
    if (getGasApiUrl()) {
      const remoteRes = await apiCall('deleteRemisiPoin', { id });
      if (!remoteRes.success) {
        return {
          success: false,
          message: `Gagal menghapus Remisi Poin dari Google Sheets: ${remoteRes.message}`
        };
      }
    }
    return { success: true, message: 'Data Remisi Poin berhasil dihapus.' };
  },

  // 8. KONSELING CRUD
  saveKonseling: async (k: Konseling, isNew: boolean): Promise<{ success: boolean; message: string }> => {
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
    const db = loadLocalDatabase();
    db.konseling = db.konseling.filter(item => item.id !== id);
    saveLocalDatabase(db);
    if (getGasApiUrl()) await apiCall('deleteKonseling', { id });
    return { success: true, message: 'Data Konseling berhasil dihapus.' };
  },

  // 9. ASESMEN CRUD
  saveAsesmen: async (a: Asesmen, isNew: boolean): Promise<{ success: boolean; message: string }> => {
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
    const db = loadLocalDatabase();
    db.asesmen = db.asesmen.filter(item => item.id !== id);
    saveLocalDatabase(db);
    if (getGasApiUrl()) await apiCall('deleteAsesmen', { id });
    return { success: true, message: 'Data Asesmen berhasil dihapus.' };
  },

  // 10. HOME VISIT CRUD
  saveHomeVisit: async (h: HomeVisit, isNew: boolean): Promise<{ success: boolean; message: string }> => {
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
    const db = loadLocalDatabase();
    db.homeVisit = db.homeVisit.filter(item => item.id !== id);
    saveLocalDatabase(db);
    if (getGasApiUrl()) await apiCall('deleteHomeVisit', { id });
    return { success: true, message: 'Data Kunjungan Rumah berhasil dihapus.' };
  },

  // 11. SURAT CRUD
  saveSurat: async (s: Surat, isNew: boolean): Promise<{ success: boolean; message: string }> => {
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
    const db = loadLocalDatabase();
    db.surat = db.surat.filter(item => item.id !== id);
    saveLocalDatabase(db);
    if (getGasApiUrl()) await apiCall('deleteSurat', { id });
    return { success: true, message: 'Dokumen Surat berhasil dihapus.' };
  },

  // 12. DOKUMEN CRUD
  saveDokumen: async (d: Dokumen, isNew: boolean): Promise<{ success: boolean; message: string }> => {
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
    const db = loadLocalDatabase();
    db.dokumen = db.dokumen.filter(item => item.id !== id);
    saveLocalDatabase(db);
    if (getGasApiUrl()) await apiCall('deleteDokumen', { id });
    return { success: true, message: 'Dokumen Siswa berhasil dihapus.' };
  },

  // 13. CATATAN PERKEMBANGAN CRUD
  saveCatatanPerkembangan: async (c: CatatanPerkembangan, isNew: boolean): Promise<{ success: boolean; message: string }> => {
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
    const db = loadLocalDatabase();
    db.catatanPerkembangan = db.catatanPerkembangan.filter(item => item.id !== id);
    saveLocalDatabase(db);
    if (getGasApiUrl()) await apiCall('deleteCatatanPerkembangan', { id });
    return { success: true, message: 'Catatan Perkembangan berhasil dihapus.' };
  },

  // 14. HEALTH, PSYCHOLOGY, ACADEMIC, ECONOMIC Sub-CRUD (direct updates for specific tabs)
  saveKesehatan: async (k: Kesehatan): Promise<{ success: boolean; message: string }> => {
    const db = loadLocalDatabase();
    db.kesehatan = db.kesehatan.map(item => item.id === k.id ? k : item);
    if (!db.kesehatan.some(item => item.id === k.id)) db.kesehatan.push(k);
    saveLocalDatabase(db);
    if (getGasApiUrl()) await apiCall('saveKesehatanOnly', k);
    return { success: true, message: 'Kesehatan berhasil diperbarui.' };
  },

  saveEkonomi: async (e: Ekonomi): Promise<{ success: boolean; message: string }> => {
    const db = loadLocalDatabase();
    db.ekonomi = db.ekonomi.map(item => item.id === e.id ? e : item);
    if (!db.ekonomi.some(item => item.id === e.id)) db.ekonomi.push(e);
    saveLocalDatabase(db);
    if (getGasApiUrl()) await apiCall('saveEkonomiOnly', e);
    return { success: true, message: 'Ekonomi berhasil diperbarui.' };
  },

  savePsikologi: async (p: Psikologi): Promise<{ success: boolean; message: string }> => {
    const db = loadLocalDatabase();
    db.psikologi = db.psikologi.map(item => item.id === p.id ? p : item);
    if (!db.psikologi.some(item => item.id === p.id)) db.psikologi.push(p);
    saveLocalDatabase(db);
    if (getGasApiUrl()) await apiCall('savePsikologiOnly', p);
    return { success: true, message: 'Psikologi berhasil diperbarui.' };
  },

  // 15. KEHADIRAN (REKAP KEHADIRAN PERMINGGU) CRUD
  saveKehadiran: async (k: Kehadiran, isNew: boolean): Promise<{ success: boolean; message: string }> => {
    const db = loadLocalDatabase();
    if (!db.kehadiran) db.kehadiran = [];
    if (!k.id) {
      k.id = `att-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    }

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
    const db = loadLocalDatabase();
    if (!db.kehadiran) db.kehadiran = [];
    db.kehadiran = db.kehadiran.filter(item => item.id !== id);
    saveLocalDatabase(db);
    if (getGasApiUrl()) {
      try {
        await apiCall('deleteKehadiran', { id });
      } catch (err) {
        console.warn('Google Sheets deleteKehadiran warning:', err);
      }
    }
    return { success: true, message: 'Rekap Kehadiran berhasil dihapus.' };
  },

  // 16. LAPORAN KEJADIAN CRUD
  saveLaporanKejadian: async (l: LaporanKejadian, isNew: boolean): Promise<{ success: boolean; message: string }> => {
    const db = loadLocalDatabase();
    if (!db.laporanKejadian) db.laporanKejadian = [];
    if (isNew) {
      db.laporanKejadian.push(l);
    } else {
      db.laporanKejadian = db.laporanKejadian.map(item => item.id === l.id ? l : item);
    }
    saveLocalDatabase(db);
    // Since Google sheets won't have standard support for LaporanKejadian unless we update GAS,
    // we safely send it to Gas but wrap it so it doesn't crash if the endpoint isn't there.
    if (getGasApiUrl()) {
      try {
        await apiCall('saveLaporanKejadian', { l, isNew });
      } catch (e) {
        console.warn('Google Sheet does not support saveLaporanKejadian yet, saved locally.', e);
      }
    }
    return { success: true, message: 'Laporan Kejadian berhasil dikirim ke Admin & Guru BK.' };
  },

  deleteLaporanKejadian: async (id: string): Promise<{ success: boolean; message: string }> => {
    const db = loadLocalDatabase();
    if (!db.laporanKejadian) db.laporanKejadian = [];
    db.laporanKejadian = db.laporanKejadian.filter(item => item.id !== id);
    saveLocalDatabase(db);
    if (getGasApiUrl()) {
      try {
        await apiCall('deleteLaporanKejadian', { id });
      } catch (e) {
        console.warn('Google Sheet does not support deleteLaporanKejadian yet.', e);
      }
    }
    return { success: true, message: 'Laporan Kejadian berhasil dihapus.' };
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
  }
};
