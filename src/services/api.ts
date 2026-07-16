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
  { id: 'wk-8-6', username: 'annisa', nama: 'Annisa C. Wicikononing, S.Kom', role: UserRole.WALI_KELAS, email: 'annisa@sekolah.sch.id', isActive: true },
  { id: 'wk-8-7', username: 'haifa', nama: 'Haifa Suryati, S.Pd', role: UserRole.WALI_KELAS, email: 'haifa@sekolah.sch.id', isActive: true },
  { id: 'wk-8-8', username: 'santi', nama: 'Santi Ramadhani, S.Pd', role: UserRole.WALI_KELAS, email: 'santi@sekolah.sch.id', isActive: true },
  { id: 'wk-8-9', username: 'reni', nama: 'Reni Septiati, S.Pd', role: UserRole.WALI_KELAS, email: 'reni@sekolah.sch.id', isActive: true },
  { id: 'wk-8-10', username: 'dewi', nama: 'Dewi Sri Kusumaningrum, S.Pd', role: UserRole.WALI_KELAS, email: 'dewi@sekolah.sch.id', isActive: true },
  { id: 'wk-8-11', username: 'emi', nama: 'Emi Jamiah, M.Pd', role: UserRole.WALI_KELAS, email: 'emi@sekolah.sch.id', isActive: true },
  { id: 'wk-9-1', username: 'tere', nama: 'Theresia Erni Setyawati, S.Pd.MM', role: UserRole.WALI_KELAS, email: 'tere@sekolah.sch.id', isActive: true },
  { id: 'wk-9-2', username: 'ferry', nama: 'Ferry Ferdiansyah, S.Pd', role: UserRole.WALI_KELAS, email: 'ferry@sekolah.sch.id', isActive: true },
  { id: 'wk-9-3', username: 'sifah', nama: 'Sifah Fauziah, S.Pd', role: UserRole.WALI_KELAS, email: 'sifah@sekolah.sch.id', isActive: true },
  { id: 'wk-9-4', username: 'mia', nama: 'Mia Hardina, S.Pd', role: UserRole.WALI_KELAS, email: 'mia@sekolah.sch.id', isActive: true },
  { id: 'wk-9-5', username: 'nur', nama: 'Nur Komar, S.Pd.MM', role: UserRole.WALI_KELAS, email: 'nur@sekolah.sch.id', isActive: true },
  { id: 'wk-9-6', username: 'warsih', nama: 'Suwarsih, S.Pd.MM', role: UserRole.WALI_KELAS, email: 'warsih@sekolah.sch.id', isActive: true },
  { id: 'wk-9-7', username: 'tut', nama: 'Hastutiningsih, S.Pd', role: UserRole.WALI_KELAS, email: 'tut@sekolah.sch.id', isActive: true },
  { id: 'wk-9-8', username: 'kasrah', nama: 'Dra. Kasrah', role: UserRole.WALI_KELAS, email: 'kasrah@sekolah.sch.id', isActive: true },
  { id: 'wk-9-9', username: 'habib', nama: 'Habib Baehaqi, S.Kom', role: UserRole.WALI_KELAS, email: 'habib@sekolah.sch.id', isActive: true },
  { id: 'wk-9-10', username: 'pendi', nama: 'Pendi, S.Pd', role: UserRole.WALI_KELAS, email: 'pendi@sekolah.sch.id', isActive: true },
  { id: 'wk-9-11', username: 'hadi', nama: 'Hadi Suryadi, S.Pd', role: UserRole.WALI_KELAS, email: 'hadi@sekolah.sch.id', isActive: true }
];

// Seed data to make the dashboard charts and widgets look spectacular and complete right away
const INITIAL_DATABASE: DatabaseState = {
  config: {
    gasApiUrl: 'https://script.google.com/macros/s/AKfycbwL5nTSIsbpgFE6JxD2STMWQiFezjN8Dw6xTg_ktbtVUOHTvLinLFuu6ojYe0QP9bZm/exec',
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
  siswa: [
    {
      id: 'sis-1',
      nis: '23241001',
      nisn: '0071234561',
      nama: 'Aditya Pratama',
      jenisKelamin: 'Laki-laki',
      tempatLahir: 'Jakarta',
      tanggalLahir: '2013-05-12',
      agama: 'Islam',
      alamat: 'Jl. Merdeka No. 45, Kebon Jeruk',
      desa: 'Kebon Jeruk',
      kecamatan: 'Kebon Jeruk',
      kabupaten: 'Jakarta Barat',
      provinsi: 'DKI Jakarta',
      nomorHp: '081234567890',
      email: 'aditya.pratama@student.sch.id',
      kelasId: 'kl-1',
      jurusanId: '',
      tahunMasuk: '2025',
      tahunPelajaran: '2025/2026',
    },
    {
      id: 'sis-2',
      nis: '23241002',
      nisn: '0071234562',
      nama: 'Bella Amanda',
      jenisKelamin: 'Perempuan',
      tempatLahir: 'Bandung',
      tanggalLahir: '2013-09-21',
      agama: 'Kristen',
      alamat: 'Perum Gading Indah Blok C/12',
      desa: 'Pasirjati',
      kecamatan: 'Ujung Berung',
      kabupaten: 'Bandung',
      provinsi: 'Jawa Barat',
      nomorHp: '082345678901',
      email: 'bella.amanda@student.sch.id',
      kelasId: 'kl-2',
      jurusanId: '',
      tahunMasuk: '2025',
      tahunPelajaran: '2025/2026',
    },
    {
      id: 'sis-3',
      nis: '23241003',
      nisn: '0071234563',
      nama: 'Candra Wijaya',
      jenisKelamin: 'Laki-laki',
      tempatLahir: 'Surabaya',
      tanggalLahir: '2012-11-03',
      agama: 'Islam',
      alamat: 'Jl. Diponegoro Gg. 3 No. 9',
      desa: 'Sawahan',
      kecamatan: 'Sawahan',
      kabupaten: 'Surabaya',
      provinsi: 'Jawa Timur',
      nomorHp: '083456789012',
      email: 'candra.wijaya@student.sch.id',
      kelasId: 'kl-12',
      jurusanId: '',
      tahunMasuk: '2024',
      tahunPelajaran: '2024/2025',
    },
    {
      id: 'sis-4',
      nis: '23241004',
      nisn: '0071234564',
      nama: 'Dian Lestari',
      jenisKelamin: 'Perempuan',
      tempatLahir: 'Yogyakarta',
      tanggalLahir: '2011-03-15',
      agama: 'Islam',
      alamat: 'Kampung Sastrodirjan GT II/412',
      desa: 'Sosromenduran',
      kecamatan: 'Gedongtengen',
      kabupaten: 'Yogyakarta',
      provinsi: 'DI Yogyakarta',
      nomorHp: '084567890123',
      email: 'dian.lestari@student.sch.id',
      kelasId: 'kl-13',
      jurusanId: '',
      tahunMasuk: '2023',
      tahunPelajaran: '2023/2024',
    },
  ],
  orangTua: [
    {
      id: 'sis-1',
      namaAyah: 'Suparno Pratama',
      statusAyah: 'Hidup',
      tempatLahirAyah: 'Jakarta',
      tanggalLahirAyah: '1978-04-15',
      alamatAyah: 'Jl. Merdeka No. 45, Kebon Jeruk',
      agamaAyah: 'Islam',
      pendidikanAyah: 'S1',
      pekerjaanAyah: 'Wiraswasta',
      noHpAyah: '081234567801',
      namaIbu: 'Endang Lestari',
      statusIbu: 'Hidup',
      tempatLahirIbu: 'Surakarta',
      tanggalLahirIbu: '1981-08-20',
      alamatIbu: 'Jl. Merdeka No. 45, Kebon Jeruk',
      agamaIbu: 'Islam',
      pendidikanIbu: 'SMA',
      pekerjaanIbu: 'Ibu Rumah Tangga',
      noHpIbu: '081234567802',
      wali: '',
      penghasilan: 'Rp 4.000.000 - Rp 6.000.000',
      pendidikanOrangTua: 'S1'
    },
    {
      id: 'sis-2',
      namaAyah: 'Herman Wijaya',
      statusAyah: 'Hidup',
      tempatLahirAyah: 'Bandung',
      tanggalLahirAyah: '1975-12-05',
      alamatAyah: 'Perum Gading Indah Blok C/12',
      agamaAyah: 'Kristen',
      pendidikanAyah: 'D3',
      pekerjaanAyah: 'Karyawan Swasta',
      noHpAyah: '082345678911',
      namaIbu: 'Maria Ulfa',
      statusIbu: 'Hidup',
      tempatLahirIbu: 'Bandung',
      tanggalLahirIbu: '1978-03-25',
      alamatIbu: 'Perum Gading Indah Blok C/12',
      agamaIbu: 'Kristen',
      pendidikanIbu: 'D3',
      pekerjaanIbu: 'Guru',
      noHpIbu: '082345678912',
      wali: '',
      penghasilan: 'Rp 6.000.000 - Rp 10.000.000',
      pendidikanOrangTua: 'D3'
    },
    {
      id: 'sis-3',
      namaAyah: 'Agus Wijaya',
      statusAyah: 'Hidup',
      tempatLahirAyah: 'Surabaya',
      tanggalLahirAyah: '1970-10-10',
      alamatAyah: 'Jl. Diponegoro Gg. 3 No. 9',
      agamaAyah: 'Islam',
      pendidikanAyah: 'SMA',
      pekerjaanAyah: 'Buruh',
      noHpAyah: '083456789021',
      namaIbu: 'Siti Aminah',
      statusIbu: 'Meninggal',
      tempatLahirIbu: 'Surabaya',
      tanggalLahirIbu: '1973-05-12',
      alamatIbu: 'Jl. Diponegoro Gg. 3 No. 9',
      agamaIbu: 'Islam',
      pendidikanIbu: 'SMP',
      pekerjaanIbu: 'Almarhumah',
      noHpIbu: '-',
      wali: '',
      penghasilan: 'Rp 2.000.000 - Rp 4.000.000',
      pendidikanOrangTua: 'SMA'
    },
    {
      id: 'sis-4',
      namaAyah: 'Rahmat Hidayat',
      statusAyah: 'Meninggal',
      tempatLahirAyah: 'Yogyakarta',
      tanggalLahirAyah: '1968-02-14',
      alamatAyah: 'Kampung Sastrodirjan GT II/412',
      agamaAyah: 'Islam',
      pendidikanAyah: 'SMP',
      pekerjaanAyah: 'Almarhum',
      noHpAyah: '-',
      namaIbu: 'Kartika Sari',
      statusIbu: 'Hidup',
      tempatLahirIbu: 'Yogyakarta',
      tanggalLahirIbu: '1974-09-09',
      alamatIbu: 'Kampung Sastrodirjan GT II/412',
      agamaIbu: 'Islam',
      pendidikanIbu: 'SMA',
      pekerjaanIbu: 'Pedagang',
      noHpIbu: '084567890124',
      wali: 'Bambang Sudewo',
      statusWali: 'Hidup',
      tempatLahirWali: 'Yogyakarta',
      tanggalLahirWali: '1965-06-20',
      alamatWali: 'Jl. Malioboro No. 12',
      agamaWali: 'Islam',
      pendidikanWali: 'S1',
      pekerjaanWali: 'PNS',
      noHpWali: '084567890125',
      penghasilan: 'Kurang dari Rp 2.000.000',
      pendidikanOrangTua: 'SMP'
    },
  ],
  akademik: [
    { id: 'sis-1', semester: '1', rataRataRaport: 85.5, catatanWaliKelas: 'Sangat baik dalam pemrograman dasar.' },
    { id: 'sis-2', semester: '1', rataRataRaport: 89.2, catatanWaliKelas: 'Pertahankan prestasi akademis.' },
    { id: 'sis-3', semester: '3', rataRataRaport: 78.0, catatanWaliKelas: 'Tingkatkan fokus saat praktikum jaringan.' },
    { id: 'sis-4', semester: '5', rataRataRaport: 92.4, catatanWaliKelas: 'Sangat berbakat di bidang desain grafis dan UI.' },
  ],
  kesehatan: [
    { id: 'sis-1', tinggiBadan: 172, beratBadan: 64, golonganDarah: 'O', penyakit: '-', alergi: 'Debu', disabilitas: '-' },
    { id: 'sis-2', tinggiBadan: 160, beratBadan: 52, golonganDarah: 'A', penyakit: '-', alergi: 'Seafood', disabilitas: '-' },
    { id: 'sis-3', tinggiBadan: 168, beratBadan: 75, golonganDarah: 'B', penyakit: 'Maag', alergi: '-', disabilitas: '-' },
    { id: 'sis-4', tinggiBadan: 158, beratBadan: 48, golonganDarah: 'AB', penyakit: 'Asma', alergi: 'Udara dingin', disabilitas: '-' },
  ],
  ekonomi: [
    { id: 'sis-1', statusRumah: 'Milik Sendiri', penghasilan: 'Rp 4.000.000 - Rp 6.000.000', kendaraan: 'Motor', pip: false, pkh: false, kip: false },
    { id: 'sis-2', statusRumah: 'Milik Sendiri', penghasilan: 'Rp 6.000.000 - Rp 10.000.000', kendaraan: 'Mobil & Motor', pip: false, pkh: false, kip: false },
    { id: 'sis-3', statusRumah: 'Sewa / Kontrak', penghasilan: 'Rp 2.000.000 - Rp 4.000.000', kendaraan: 'Motor', pip: true, pkh: false, kip: true },
    { id: 'sis-4', statusRumah: 'Sewa / Kontrak', penghasilan: 'Kurang dari Rp 2.000.000', kendaraan: 'Sepeda', pip: true, pkh: true, kip: true },
  ],
  psikologi: [
    { id: 'sis-1', minat: 'Coding & Robotics', bakat: 'Logika & Analitis', hobi: 'Gaming, Membaca', gayaBelajar: 'Visual', citaCita: 'Software Engineer', kepribadian: 'Introvert (INTJ)' },
    { id: 'sis-2', minat: 'Public Speaking', bakat: 'Komunikasi', hobi: 'Menulis, Organisasi', gayaBelajar: 'Auditory', citaCita: 'HR Manager', kepribadian: 'Extrovert (ENFJ)' },
    { id: 'sis-3', minat: 'Hardware & Network', bakat: 'Keterampilan Mekanik', hobi: 'Bermain Musik', gayaBelajar: 'Kinestetik', citaCita: 'Network Engineer', kepribadian: 'Introvert (ISTP)' },
    { id: 'sis-4', minat: 'Desain Komunikasi Visual', bakat: 'Seni Rupa & Estetika', hobi: 'Menggambar, Fotografi', gayaBelajar: 'Visual', citaCita: 'Art Director', kepribadian: 'Introvert (INFP)' },
  ],
  sosial: [
    { id: 'sis-1', hubunganTeman: 'Sangat Baik', organisasi: 'OSIS (Staff IT)', masalahSosial: '-' },
    { id: 'sis-2', hubunganTeman: 'Sangat Baik', organisasi: 'Pramuka (Bantara)', masalahSosial: '-' },
    { id: 'sis-3', hubunganTeman: 'Kurang Bersosialisasi', organisasi: '-', masalahSosial: 'Sering menyendiri' },
    { id: 'sis-4', hubunganTeman: 'Baik', organisasi: 'Majalah Dinding', masalahSosial: '-' },
  ],
  prestasi: [
    { id: 'pres-1', siswaId: 'sis-4', namaPrestasi: 'Juara 1 Lomba Desain Poster Nasional', tingkat: 'Nasional', tahun: '2025', juara: 'Juara I', kategori: 'Non Akademik' },
    { id: 'pres-2', siswaId: 'sis-1', namaPrestasi: 'Juara 2 Hackathon Pelajar Provinsi', tingkat: 'Provinsi', tahun: '2025', juara: 'Juara II', kategori: 'Akademik' },
  ],
  pelanggaran: [
    { id: 'pel-1', siswaId: 'sis-3', tanggal: '2026-06-15', jenisPelanggaran: 'Merokok di area sekolah', kategori: 'Berat', poin: 75, guruPelapor: 'Arta Polta, S.Pd', tindakLanjut: 'Pemanggilan Orang Tua', status: 'Proses' },
    { id: 'pel-2', siswaId: 'sis-3', tanggal: '2026-06-20', jenisPelanggaran: 'Terlambat masuk sekolah lebih dari 3 kali', kategori: 'Ringan', poin: 15, guruPelapor: 'Piket Guru', tindakLanjut: 'Teguran lisan & pembinaan', status: 'Selesai' },
    { id: 'pel-3', siswaId: 'sis-3', tanggal: '2026-06-25', jenisPelanggaran: 'Bolos sekolah pada jam pelajaran produktif', kategori: 'Sedang', poin: 30, guruPelapor: 'Arta Polta, S.Pd', tindakLanjut: 'Konseling Individu & SP 1', status: 'Belum Ditindak' },
    // Total points for sis-3 (Candra) will be 75 + 15 + 30 = 120 (Triggers the > 100 points alert!)
    { id: 'pel-4', siswaId: 'sis-1', tanggal: '2026-06-10', jenisPelanggaran: 'Terlambat masuk sekolah', kategori: 'Ringan', poin: 5, guruPelapor: 'Piket Guru', tindakLanjut: 'Teguran lisan', status: 'Selesai' },
  ],
  remisiPoin: [
    { id: 'rem-1', siswaId: 'sis-3', tanggal: '2026-06-26', jenisRemisi: 'Membantu Kerapian Perpustakaan', kategori: 'Karakter Baik', poin: 15, guruPemberi: 'Nur Jamilah Purwaningsih, S.Psi', keterangan: 'Siswa sangat rajin merapikan buku di perpustakaan sebagai bentuk perubahan perilaku positif.' }
  ],
  konseling: [
    { id: 'kon-1', nomorKonseling: 'BK-2026-001', siswaId: 'sis-3', tanggal: '2026-06-18', jenis: 'Individu', guruBkId: 'usr-2', permasalahan: 'Merokok di area sekolah dan kedapatan membawa rokok.', analisis: 'Siswa mengalami tekanan pergaulan luar sekolah dan merasa stres karena masalah ekonomi keluarga.', solusi: 'Melakukan konseling relaksasi, menyepakati kontrak perilaku untuk berhenti merokok, dan menghubungkan ke program beasiswa sekolah.', hasil: 'Siswa kooperatif, berjanji mengurangi rokok, dan bersedia dipantau perkembangannya.', tindakLanjut: 'Pemantauan berkala bersama Wali Kelas.' },
  ],
  asesmen: [
    { id: 'ase-1', siswaId: 'sis-1', akpd: 'Tinggi pemahaman diri, sedang penyesuaian sosial', dcm: 'Visual & Auditori', aum: 'Hambatan belajar ringan', iq: 125, bakat: 'Komputasi, Logika', minat: 'Sains, Teknologi' },
    { id: 'ase-2', siswaId: 'sis-4', akpd: 'Tinggi minat seni, tinggi kemampuan karir', dcm: 'Kinestetik', aum: 'Tidak ada masalah berarti', iq: 118, bakat: 'Artistik, Komunikasi', minat: 'Seni Kreatif, Media' },
  ],
  homeVisit: [
    { id: 'hv-1', siswaId: 'sis-3', tanggal: '2026-06-19', tujuan: 'Mengetahui kondisi lingkungan rumah dan dukungan orang tua terkait kasus pelanggaran merokok.', hasil: 'Orang tua menyambut baik dan berjanji akan memperketat pengawasan di rumah, serta berterima kasih atas informasi dari sekolah.' },
  ],
  surat: [
    { id: 'sur-1', siswaId: 'sis-3', nomorSurat: '045/BK-SMK/VI/2026', tanggal: '2026-06-16', jenisSurat: 'Surat Panggilan', perihal: 'Undangan Pertemuan Wali Murid', isiSurat: 'Mengharap kehadiran Bapak/Ibu Wali Murid dari siswa Candra Wijaya ke ruang BK sekolah untuk membicarakan mengenai perkembangan putra Bapak/Ibu.' },
  ],
  dokumen: [
    { id: 'dok-1', siswaId: 'sis-1', jenisDokumen: 'KK', namaFile: 'kk_aditya.pdf', tanggalUpload: '2025-07-15' },
    { id: 'dok-2', siswaId: 'sis-1', jenisDokumen: 'Akta', namaFile: 'akta_aditya.pdf', tanggalUpload: '2025-07-15' },
  ],
  catatanPerkembangan: [
    { id: 'cp-1', siswaId: 'sis-3', tanggal: '2026-06-22', catatan: 'Candra menunjukkan perilaku lebih rapi dan masuk kelas tepat waktu selama 3 hari terakhir.', guruBkId: 'usr-2' },
  ],
  logAktivitas: [
    { id: 'log-1', timestamp: '2026-06-28T09:00:00Z', userId: 'usr-1', namaUser: 'Sulaiman, S.Psi', role: 'Admin', aktivitas: 'Login', detail: 'Berhasil masuk ke dalam sistem.' },
    { id: 'log-2', timestamp: '2026-06-28T09:15:00Z', userId: 'usr-2', namaUser: 'Nur Jamilah Purwaningsih, S.Psi', role: 'Guru BK', aktivitas: 'Tambah Konseling', detail: 'Membuat rekaman konseling individu untuk Candra Wijaya.' },
  ],
  kehadiran: [
    { id: 'att-1', siswaId: 'sis-1', mingguKe: 'Minggu 1', bulan: 'Juli', tahun: '2026', hadir: 5, sakit: 0, izin: 0, alfa: 0, keterangan: 'Hadir penuh' },
    { id: 'att-2', siswaId: 'sis-3', mingguKe: 'Minggu 1', bulan: 'Juli', tahun: '2026', hadir: 4, sakit: 0, izin: 1, alfa: 0, keterangan: 'Izin urusan keluarga' }
  ],
  laporanKejadian: []
};

// Local cache
let currentDatabase: DatabaseState | null = null;

export function sanitizeDatabaseState(parsed: any): { sanitized: DatabaseState; migrated: boolean } {
  if (parsed && parsed._sanitized_v7 && parsed.laporanKejadian) {
    return { sanitized: parsed as DatabaseState, migrated: false };
  }
  let migrated = false;

  if (!parsed || typeof parsed !== 'object') {
    return { sanitized: { ...INITIAL_DATABASE }, migrated: true };
  }

  // Ensure config block is present
  if (!parsed.config || typeof parsed.config !== 'object') {
    parsed.config = { 
      gasApiUrl: (import.meta as any).env.VITE_GAS_API_URL || 'https://script.google.com/macros/s/AKfycbwL5nTSIsbpgFE6JxD2STMWQiFezjN8Dw6xTg_ktbtVUOHTvLinLFuu6ojYe0QP9bZm/exec', 
      spreadsheetId: (import.meta as any).env.VITE_SPREADSHEET_ID || '1g3thopFbDdsvlXyidgq_PEiiEhY5cH3PngqGO5weHqc' 
    };
    migrated = true;
  } else {
    const originalGas = parsed.config.gasApiUrl;
    const originalSpreadsheet = parsed.config.spreadsheetId;
    parsed.config = {
      gasApiUrl: (parsed.config.gasApiUrl && parsed.config.gasApiUrl.trim() !== '' ? parsed.config.gasApiUrl : (import.meta as any).env.VITE_GAS_API_URL || 'https://script.google.com/macros/s/AKfycbwL5nTSIsbpgFE6JxD2STMWQiFezjN8Dw6xTg_ktbtVUOHTvLinLFuu6ojYe0QP9bZm/exec').toString().trim(),
      spreadsheetId: (parsed.config.spreadsheetId || (import.meta as any).env.VITE_SPREADSHEET_ID || '1g3thopFbDdsvlXyidgq_PEiiEhY5cH3PngqGO5weHqc').toString().trim()
    };
    if (parsed.config.gasApiUrl !== originalGas || parsed.config.spreadsheetId !== originalSpreadsheet) {
      migrated = true;
    }
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
      parsed[key] = INITIAL_DATABASE[key as keyof DatabaseState] ? [...(INITIAL_DATABASE[key as keyof DatabaseState] as any[])] : [];
      migrated = true;
    }
  });

  // Self-healing: Check if the new BK users and 33 Wali Kelas exist in database. If not, reset users and kelas arrays to make sure accounts are loaded.
  const hasSulaiman = parsed.users.some((u: any) => u && u.username && u.username.toString().toLowerCase() === 'sulaiman');
  if (!hasSulaiman) {
    parsed.users = [...INITIAL_DATABASE.users];
    parsed.kelas = [...INITIAL_DATABASE.kelas];
    migrated = true;
  } else {
    // Ensure every Wali Kelas user in WALI_KELAS_USERS exists in parsed.users
    WALI_KELAS_USERS.forEach((wku) => {
      const exists = parsed.users.some((u: any) => u && u.username === wku.username);
      if (!exists) {
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

  // Update remisiPoin where the teacher giving it is old BK name
  parsed.remisiPoin = parsed.remisiPoin.map((r: any) => {
    if (!r) return r;
    const normG = (r.guruPemberi || '').toString().toLowerCase();
    if (normG.includes('sulaiman') || normG.includes('siti rahma')) {
      r.guruPemberi = 'Nur Jamilah Purwaningsih, S.Psi';
      migrated = true;
    }
    return r;
  });

  // Update class Wali Kelas distribution and repair Google Sheets date/time formatting errors in class names (e.g. Jam 8-5 -> Kelas 8-5)
  const redirectKelasIdMap: { [oldId: string]: string } = {};
  const standardKelasMap: { [key: string]: string } = {};
  
  // Map our standard 33 class short names to standard IDs 'kl-1' through 'kl-33'
  for (let i = 1; i <= 11; i++) {
    standardKelasMap[`7-${i}`] = `kl-${i}`;
    standardKelasMap[`Kelas 7-${i}`] = `kl-${i}`;
  }
  for (let i = 1; i <= 11; i++) {
    standardKelasMap[`8-${i}`] = `kl-${i + 11}`;
    standardKelasMap[`Kelas 8-${i}`] = `kl-${i + 11}`;
  }
  for (let i = 1; i <= 11; i++) {
    standardKelasMap[`9-${i}`] = `kl-${i + 22}`;
    standardKelasMap[`Kelas 9-${i}`] = `kl-${i + 22}`;
  }

  // Helper function to normalize any class name, handling all Google Sheets locale time and date parsing side-effects
  const normalizeClassName = (rawName: string): string => {
    let name = String(rawName || '').trim();
    
    // Remove prefixes first to ensure standard parsing
    if (name.startsWith('Jam ')) {
      name = name.slice(4).trim();
    }
    if (name.startsWith('Kelas ')) {
      name = name.slice(6).trim();
    }
    
    // 1. Check if it matches a standard grade-rombel format e.g., "7-1" to "9-11"
    const stdPattern = /^([789])-([1-9]|1[01])$/;
    const stdMatch = name.match(stdPattern);
    if (stdMatch) {
      return `Kelas ${stdMatch[1]}-${stdMatch[2]}`;
    }

    // 2. If it already matches "Kelas 7-1" to "Kelas 9-11"
    const kelasPattern = /^Kelas\s+([789])-([1-9]|1[01])$/i;
    const kelasMatch = name.match(kelasPattern);
    if (kelasMatch) {
      return `Kelas ${kelasMatch[1]}-${kelasMatch[2]}`;
    }
    
    // 3. Time/date parser conversion: e.g. "07:01:00", "08:05:00", "08.05", "8:5" -> "Kelas 8-5"
    const timePattern = /^0?([789])[:.]0?([1-9]|1[01])(?:[:.]00)?$/;
    const timeMatch = name.match(timePattern);
    if (timeMatch) {
      const grade = parseInt(timeMatch[1], 10);
      const rombel = parseInt(timeMatch[2], 10);
      return `Kelas ${grade}-${rombel}`;
    }
    
    // 4. Date parser conversion: e.g. "2026-01-07", "2026-07-01", "2026-01-03", "07/01/2026", "1/7/2026"
    // Match standard YYYY-MM-DD or DD/MM/YYYY or MM/DD/YYYY
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
      // A. If Month is 7, 8, or 9 (Grade) and Day is 1-11 (Rombel)
      if ((month === 7 || month === 8 || month === 9) && (day >= 1 && day <= 11)) {
        return `Kelas ${month}-${day}`;
      }
      // B. If Day is 7, 8, or 9 (Grade) and Month is 1-11 (Rombel)
      if ((day === 7 || day === 8 || day === 9) && (month >= 1 && month <= 11)) {
        return `Kelas ${day}-${month}`;
      }
      // C. If Month is 1, 2, or 3 (Grade - 6) and Day is 1-11 (Rombel)
      if ((month === 1 || month === 2 || month === 3) && (day >= 1 && day <= 11)) {
        return `Kelas ${month + 6}-${day}`;
      }
      // D. If Day is 1, 2, or 3 (Grade - 6) and Month is 1-11 (Rombel)
      if ((day === 1 || day === 2 || day === 3) && (month >= 1 && month <= 11)) {
        return `Kelas ${day + 6}-${month}`;
      }
    }
    
    return rawName;
  };

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
    
    // 2. Also handle if the student's kelasId is a raw name string instead of an ID (some Google Sheets sync can return name string)
    if (s.kelasId && !s.kelasId.startsWith('kl-')) {
      const cleanName = normalizeClassName(s.kelasId);
      const standardId = standardKelasMap[cleanName];
      if (standardId) {
        s.kelasId = standardId;
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
    }
    return s;
  }).filter(Boolean);

  // Double check that all mock siswa records have expanded parent fields initialized
  parsed.orangTua = parsed.orangTua.map((ot: any) => {
    if (!ot) return ot;
    const matchingSeed = INITIAL_DATABASE.orangTua.find(s => s.id === ot.id);
    if (matchingSeed && !ot.statusAyah) {
      migrated = true;
      return { ...matchingSeed };
    }
    return ot;
  });

  // Self-heal secondary records for every student to ensure complete data integrity across all sheets
  const secondaryKeys = [
    { key: 'orangTua', defaultObj: { namaAyah: '', statusAyah: '', namaIbu: '', statusIbu: '', wali: '', statusWali: '', penghasilan: '', pendidikanOrangTua: '' } },
    { key: 'akademik', defaultObj: { semester: 'Ganjil', rataRataRaport: '', catatanWaliKelas: '' } },
    { key: 'kesehatan', defaultObj: { tinggiBadan: '', beratBadan: '', golonganDarah: '-', penyakit: '', alergi: '', disabilitas: '' } },
    { key: 'ekonomi', defaultObj: { statusRumah: '', penghasilan: '', kendaraan: '', pip: '-', pkh: '-', kip: '-' } },
    { key: 'psikologi', defaultObj: { minat: '', bakat: '', hobi: '', gayaBelajar: '', citaCita: '', kepribadian: '' } },
    { key: 'sosial', defaultObj: { hubunganTeman: 'Baik', organisasi: '-', masalahSosial: '-' } }
  ];

  parsed.siswa.forEach((s: any) => {
    secondaryKeys.forEach(({ key, defaultObj }) => {
      const exists = parsed[key] && parsed[key].some((item: any) => item && item.id === s.id);
      if (!exists) {
        if (!parsed[key]) parsed[key] = [];
        parsed[key].push({ id: s.id, ...defaultObj });
        migrated = true;
      }
    });
  });

  parsed._sanitized_v7 = true;
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
      const { sanitized, migrated } = sanitizeDatabaseState(parsed);
      if (migrated) {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(sanitized));
      }
      currentDatabase = sanitized;
      return sanitized;
    } catch (e) {
      console.error('Failed to parse local database, resetting to seed data.', e);
    }
  }
  const { sanitized } = sanitizeDatabaseState(INITIAL_DATABASE);
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
  if (envUrl && envUrl.trim() !== '') {
    return envUrl.trim();
  }
  return currentDatabase?.config?.gasApiUrl || 'https://script.google.com/macros/s/AKfycbwL5nTSIsbpgFE6JxD2STMWQiFezjN8Dw6xTg_ktbtVUOHTvLinLFuu6ojYe0QP9bZm/exec';
};

export const setGasApiUrl = (url: string) => {
  const db = { ...currentDatabase };
  db.config.gasApiUrl = url ? url.trim() : '';
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
        if (password !== 'admin123') {
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

      // Password must match student's NIS or NISN (case-insensitive)
      const pLower = (password || '').toString().trim().toLowerCase();
      const sNis = s.nis ? s.nis.toString().trim().toLowerCase() : '';
      const sNisn = s.nisn ? s.nisn.toString().trim().toLowerCase() : '';

      const validPassword = 
        (sNis && pLower === sNis) ||
        (sNisn && pLower === sNisn);

      if (!validPassword) {
        return { success: false, message: 'Password salah. Masukkan NIS atau NISN Anda.' };
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
        // Cegah penimpaan data lokal jika database di Google Sheets kosong (belum di-seeding)
        const isEmptyRemote = 
          (!res.data.users || res.data.users.length === 0) && 
          (!res.data.siswa || res.data.siswa.length === 0);

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

        // Update local cache with remote data, preserving the config block and sanitizing it
        const { sanitized, migrated } = sanitizeDatabaseState(res.data);
        const updated = { ...sanitized, config: { ...localDb.config, gasApiUrl: getGasApiUrl() } };
        saveLocalDatabase(updated);
        lastFetchSuccessful = true;

        if (migrated) {
          console.log('Sinkronisasi data terdeteksi: mengunggah data kelas dan relasi yang diperbaiki kembali ke Google Sheets secara otomatis...');
          apiCall('uploadFullDatabase', updated).catch((err) => {
            console.error('Gagal mengunggah pembaruan sinkronisasi ke Google Sheets:', err);
          });
        }

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
    return { success: true, message: 'Data Remisi Poin berhasil disimpan.' };
  },

  deleteRemisiPoin: async (id: string): Promise<{ success: boolean; message: string }> => {
    const db = loadLocalDatabase();
    if (!db.remisiPoin) db.remisiPoin = [];
    db.remisiPoin = db.remisiPoin.filter(item => item.id !== id);
    saveLocalDatabase(db);
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
    if (isNew) {
      db.kehadiran.push(k);
    } else {
      db.kehadiran = db.kehadiran.map(item => item.id === k.id ? k : item);
    }
    saveLocalDatabase(db);
    if (getGasApiUrl()) await apiCall('saveKehadiran', { k, isNew });
    return { success: true, message: 'Rekap Kehadiran berhasil disimpan.' };
  },

  deleteKehadiran: async (id: string): Promise<{ success: boolean; message: string }> => {
    const db = loadLocalDatabase();
    if (!db.kehadiran) db.kehadiran = [];
    db.kehadiran = db.kehadiran.filter(item => item.id !== id);
    saveLocalDatabase(db);
    if (getGasApiUrl()) await apiCall('deleteKehadiran', { id });
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
