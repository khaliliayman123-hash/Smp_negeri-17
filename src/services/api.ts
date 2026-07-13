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
} from '../types';

const LOCAL_STORAGE_KEY = 'hds_bk_database_v1';

// List of 21 Wali Kelas requested by user
export const WALI_KELAS_USERS: User[] = [
  { id: 'wk-7-1', username: 'damianus', nama: 'Damianus, S.Pd', role: UserRole.WALI_KELAS, email: 'damianus@sekolah.sch.id', isActive: true },
  { id: 'wk-7-2', username: 'albert', nama: 'Albert Allen, M.A.Ed', role: UserRole.WALI_KELAS, email: 'albert@sekolah.sch.id', isActive: true },
  { id: 'wk-7-3', username: 'novie', nama: 'Novie Maryadiati, S.E', role: UserRole.WALI_KELAS, email: 'novie@sekolah.sch.id', isActive: true },
  { id: 'wk-7-4', username: 'ira', nama: 'Ira Riswana Maha, S.Pd', role: UserRole.WALI_KELAS, email: 'ira@sekolah.sch.id', isActive: true },
  { id: 'wk-7-5', username: 'yulia', nama: 'Yulia Mawarini, S.Pd', role: UserRole.WALI_KELAS, email: 'yulia@sekolah.sch.id', isActive: true },
  { id: 'wk-7-6', username: 'terra', nama: 'Terra Meira. S. A. S, S.Pd', role: UserRole.WALI_KELAS, email: 'terra@sekolah.sch.id', isActive: true },
  { id: 'wk-7-7', username: 'lidya', nama: 'Lidya Septi Setyowati, S.Pd', role: UserRole.WALI_KELAS, email: 'lidya@sekolah.sch.id', isActive: true },
  { id: 'wk-8-1', username: 'sri', nama: 'Sri Lawati, S.Pd', role: UserRole.WALI_KELAS, email: 'sri@sekolah.sch.id', isActive: true },
  { id: 'wk-8-2', username: 'farah', nama: 'Farah Muthia Zadfa, S.Pd', role: UserRole.WALI_KELAS, email: 'farah@sekolah.sch.id', isActive: true },
  { id: 'wk-8-3', username: 'eva', nama: 'Eva SYarifatul Maesyaroh, S.Pdi', role: UserRole.WALI_KELAS, email: 'eva@sekolah.sch.id', isActive: true },
  { id: 'wk-8-4', username: 'nur', nama: 'Nur Sakinah, S.Pd', role: UserRole.WALI_KELAS, email: 'nur@sekolah.sch.id', isActive: true },
  { id: 'wk-8-5', username: 'selfi', nama: 'Selfi Widiardin, S.Pd', role: UserRole.WALI_KELAS, email: 'selfi@sekolah.sch.id', isActive: true },
  { id: 'wk-8-6', username: 'gerry', nama: 'Gerry Adinagara, S.Pd', role: UserRole.WALI_KELAS, email: 'gerry@sekolah.sch.id', isActive: true },
  { id: 'wk-8-7', username: 'ibnu', nama: 'Ibnu, S.Pd', role: UserRole.WALI_KELAS, email: 'ibnu@sekolah.sch.id', isActive: true },
  { id: 'wk-9-1', username: 'nani', nama: 'Nani Saidah, S.Pd', role: UserRole.WALI_KELAS, email: 'nani@sekolah.sch.id', isActive: true },
  { id: 'wk-9-2', username: 'ana', nama: 'A. A. Ana Dian Kahayani, M.Pd', role: UserRole.WALI_KELAS, email: 'ana@sekolah.sch.id', isActive: true },
  { id: 'wk-9-3', username: 'monica', nama: 'Monica Herlina, S.Pdi', role: UserRole.WALI_KELAS, email: 'monica@sekolah.sch.id', isActive: true },
  { id: 'wk-9-4', username: 'indri', nama: 'Indri Purnamasari Yusuf, S.Pd', role: UserRole.WALI_KELAS, email: 'indri@sekolah.sch.id', isActive: true },
  { id: 'wk-9-5', username: 'wahyunis', nama: 'Wahyunis Argowati, S.Pd', role: UserRole.WALI_KELAS, email: 'wahyunis@sekolah.sch.id', isActive: true },
  { id: 'wk-9-6', username: 'titin', nama: 'Titin Octa Rahma, S.Pd', role: UserRole.WALI_KELAS, email: 'titin@sekolah.sch.id', isActive: true },
  { id: 'wk-9-7', username: 'ifah', nama: 'Ifah Siti Latifah. A. K, S.Pd', role: UserRole.WALI_KELAS, email: 'ifah@sekolah.sch.id', isActive: true }
];

// Seed data to make the dashboard charts and widgets look spectacular and complete right away
const INITIAL_DATABASE: DatabaseState = {
  config: {
    gasApiUrl: 'https://script.google.com/macros/s/AKfycbwL5nTSIsbpgFE6JxD2STMWQiFezjN8Dw6xTg_ktbtVUOHTvLinLFuu6ojYe0QP9bZm/exec',
    spreadsheetId: '1g3thopFbDdsvlXyidgq_PEiiEhY5cH3PngqGO5weHqc',
  },
  users: [
    { id: 'usr-1', username: 'admin', nama: 'Holfi Aulia, S.Pd', role: UserRole.ADMIN, email: 'holfi.aulia@sekolah.sch.id', isActive: true },
    { id: 'usr-2', username: 'Jamilah', nama: 'Nur Jamilah Purwaningsih, S.Psi', role: UserRole.GURU_BK, email: 'nurjamilah.bk@sekolah.sch.id', isActive: true },
    { id: 'usr-3-bk', username: 'Arta', nama: 'Arta Polta, S.Pd', role: UserRole.GURU_BK, email: 'artapolta.bk@sekolah.sch.id', isActive: true },
    { id: 'usr-5-bk', username: 'Nanda', nama: 'Nanda Putri Utami, S.Pd', role: UserRole.GURU_BK, email: 'nandaputri.bk@sekolah.sch.id', isActive: true },
    { id: 'usr-3', username: 'artapolta', nama: 'Arta Polta, S.Pd', role: UserRole.WALI_KELAS, email: 'artapolta@sekolah.sch.id', isActive: true },
    { id: 'usr-4', username: 'kepsek', nama: 'Salim, S.Pd., M.Hum.', role: UserRole.KEPALA_SEKOLAH, email: 'salim.kepsek@sekolah.sch.id', isActive: true },
    { id: 'usr-5', username: 'nandaputri', nama: 'Nanda Putri Utami, S.Pd', role: UserRole.WALI_KELAS, email: 'nandaputri@sekolah.sch.id', isActive: true },
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
    { id: 'kl-1', namaKelas: 'Kelas 7-1', waliKelasId: 'usr-3' },
    { id: 'kl-2', namaKelas: 'Kelas 7-2', waliKelasId: 'usr-3' },
    { id: 'kl-3', namaKelas: 'Kelas 7-3', waliKelasId: 'usr-3' },
    { id: 'kl-4', namaKelas: 'Kelas 7-4', waliKelasId: 'usr-3' },
    { id: 'kl-5', namaKelas: 'Kelas 7-5', waliKelasId: 'usr-3' },
    { id: 'kl-6', namaKelas: 'Kelas 7-6', waliKelasId: 'usr-3' },
    { id: 'kl-7', namaKelas: 'Kelas 7-7', waliKelasId: 'usr-3' },
    { id: 'kl-8', namaKelas: 'Kelas 7-8', waliKelasId: 'usr-3' },
    { id: 'kl-9', namaKelas: 'Kelas 7-9', waliKelasId: 'usr-3' },
    { id: 'kl-10', namaKelas: 'Kelas 7-10', waliKelasId: 'usr-3' },
    { id: 'kl-11', namaKelas: 'Kelas 7-11', waliKelasId: 'usr-3' },
    // Kelas 8-1 s.d. 8-11
    { id: 'kl-12', namaKelas: 'Kelas 8-1', waliKelasId: 'usr-5' },
    { id: 'kl-13', namaKelas: 'Kelas 8-2', waliKelasId: 'usr-5' },
    { id: 'kl-14', namaKelas: 'Kelas 8-3', waliKelasId: 'usr-5' },
    { id: 'kl-15', namaKelas: 'Kelas 8-4', waliKelasId: 'usr-5' },
    { id: 'kl-16', namaKelas: 'Kelas 8-5', waliKelasId: 'usr-5' },
    { id: 'kl-17', namaKelas: 'Kelas 8-6', waliKelasId: 'usr-5' },
    { id: 'kl-18', namaKelas: 'Kelas 8-7', waliKelasId: 'usr-5' },
    { id: 'kl-19', namaKelas: 'Kelas 8-8', waliKelasId: 'usr-5' },
    { id: 'kl-20', namaKelas: 'Kelas 8-9', waliKelasId: 'usr-5' },
    { id: 'kl-21', namaKelas: 'Kelas 8-10', waliKelasId: 'usr-5' },
    { id: 'kl-22', namaKelas: 'Kelas 8-11', waliKelasId: 'usr-5' },
    // Kelas 9-1 s.d. 9-11
    { id: 'kl-23', namaKelas: 'Kelas 9-1', waliKelasId: 'usr-3' },
    { id: 'kl-24', namaKelas: 'Kelas 9-2', waliKelasId: 'usr-3' },
    { id: 'kl-25', namaKelas: 'Kelas 9-3', waliKelasId: 'usr-3' },
    { id: 'kl-26', namaKelas: 'Kelas 9-4', waliKelasId: 'usr-3' },
    { id: 'kl-27', namaKelas: 'Kelas 9-5', waliKelasId: 'usr-3' },
    { id: 'kl-28', namaKelas: 'Kelas 9-6', waliKelasId: 'usr-3' },
    { id: 'kl-29', namaKelas: 'Kelas 9-7', waliKelasId: 'usr-3' },
    { id: 'kl-30', namaKelas: 'Kelas 9-8', waliKelasId: 'usr-3' },
    { id: 'kl-31', namaKelas: 'Kelas 9-9', waliKelasId: 'usr-3' },
    { id: 'kl-32', namaKelas: 'Kelas 9-10', waliKelasId: 'usr-3' },
    { id: 'kl-33', namaKelas: 'Kelas 9-11', waliKelasId: 'usr-3' },
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
    { id: 'log-1', timestamp: '2026-06-28T09:00:00Z', userId: 'usr-1', namaUser: 'Holfi Aulia, S.Pd', role: 'Admin', aktivitas: 'Login', detail: 'Berhasil masuk ke dalam sistem.' },
    { id: 'log-2', timestamp: '2026-06-28T09:15:00Z', userId: 'usr-2', namaUser: 'Nur Jamilah Purwaningsih, S.Psi', role: 'Guru BK', aktivitas: 'Tambah Konseling', detail: 'Membuat rekaman konseling individu untuk Candra Wijaya.' },
  ],
  kehadiran: [
    { id: 'att-1', siswaId: 'sis-1', mingguKe: 'Minggu 1', bulan: 'Juli', tahun: '2026', hadir: 5, sakit: 0, izin: 0, alfa: 0, keterangan: 'Hadir penuh' },
    { id: 'att-2', siswaId: 'sis-3', mingguKe: 'Minggu 1', bulan: 'Juli', tahun: '2026', hadir: 4, sakit: 0, izin: 1, alfa: 0, keterangan: 'Izin urusan keluarga' }
  ],
};

// Local cache
let currentDatabase: DatabaseState | null = null;

export function sanitizeDatabaseState(parsed: any): { sanitized: DatabaseState; migrated: boolean } {
  if (parsed && parsed._sanitized_v6) {
    return { sanitized: parsed as DatabaseState, migrated: false };
  }
  let migrated = false;

  if (!parsed || typeof parsed !== 'object') {
    return { sanitized: { ...INITIAL_DATABASE }, migrated: true };
  }

  // Ensure config block is present
  if (!parsed.config || typeof parsed.config !== 'object') {
    parsed.config = { 
      gasApiUrl: 'https://script.google.com/macros/s/AKfycbwL5nTSIsbpgFE6JxD2STMWQiFezjN8Dw6xTg_ktbtVUOHTvLinLFuu6ojYe0QP9bZm/exec', 
      spreadsheetId: ((import.meta as any).env?.VITE_SPREADSHEET_ID as string) || '1g3thopFbDdsvlXyidgq_PEiiEhY5cH3PngqGO5weHqc' 
    };
    migrated = true;
  } else {
    const originalGas = parsed.config.gasApiUrl;
    const originalSpreadsheet = parsed.config.spreadsheetId;
    parsed.config = {
      gasApiUrl: (parsed.config.gasApiUrl && parsed.config.gasApiUrl.trim() !== '' ? parsed.config.gasApiUrl : 'https://script.google.com/macros/s/AKfycbwL5nTSIsbpgFE6JxD2STMWQiFezjN8Dw6xTg_ktbtVUOHTvLinLFuu6ojYe0QP9bZm/exec').toString().trim(),
      spreadsheetId: (parsed.config.spreadsheetId || ((import.meta as any).env?.VITE_SPREADSHEET_ID as string) || '1g3thopFbDdsvlXyidgq_PEiiEhY5cH3PngqGO5weHqc').toString().trim()
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
    'catatanPerkembangan', 'tahunPelajaran', 'kelas', 'jurusan', 'logAktivitas', 'kehadiran'
  ];

  listKeys.forEach(key => {
    if (!parsed[key] || !Array.isArray(parsed[key])) {
      parsed[key] = INITIAL_DATABASE[key as keyof DatabaseState] ? [...(INITIAL_DATABASE[key as keyof DatabaseState] as any[])] : [];
      migrated = true;
    }
  });

  // Self-healing: Ensure users array has critical admin/Jamilah accounts
  const hasAdmin = parsed.users.some((u: any) => u && u.username && u.username.toString().toLowerCase() === 'admin');
  if (!hasAdmin) {
    parsed.users.push({ 
      id: 'usr-1', 
      username: 'admin', 
      nama: 'Holfi Aulia, S.Pd', 
      role: UserRole.ADMIN, 
      email: 'holfi.aulia@sekolah.sch.id', 
      isActive: true 
    });
    migrated = true;
  }

  const hasJamilah = parsed.users.some((u: any) => u && u.username && u.username.toString().toLowerCase() === 'jamilah');
  if (!hasJamilah) {
    const gbkIdx = parsed.users.findIndex((u: any) => u && (u.id === 'usr-2' || u.username?.toString().toLowerCase() === 'gurubk'));
    if (gbkIdx >= 0) {
      parsed.users[gbkIdx].id = 'usr-2';
      parsed.users[gbkIdx].username = 'Jamilah';
      parsed.users[gbkIdx].role = UserRole.GURU_BK;
      parsed.users[gbkIdx].nama = 'Nur Jamilah Purwaningsih, S.Psi';
      parsed.users[gbkIdx].email = 'nurjamilah.bk@sekolah.sch.id';
    } else {
      parsed.users.push({ 
        id: 'usr-2', 
        username: 'Jamilah', 
        nama: 'Nur Jamilah Purwaningsih, S.Psi', 
        role: UserRole.GURU_BK, 
        email: 'nurjamilah.bk@sekolah.sch.id', 
        isActive: true 
      });
    }
    migrated = true;
  }

  const hasArtaBk = parsed.users.some((u: any) => u && u.id === 'usr-3-bk');
  if (!hasArtaBk) {
    parsed.users.push({ 
      id: 'usr-3-bk', 
      username: 'Arta', 
      nama: 'Arta Polta, S.Pd', 
      role: UserRole.GURU_BK, 
      email: 'artapolta.bk@sekolah.sch.id', 
      isActive: true 
    });
    migrated = true;
  }

  const hasNandaBk = parsed.users.some((u: any) => u && u.id === 'usr-5-bk');
  if (!hasNandaBk) {
    parsed.users.push({ 
      id: 'usr-5-bk', 
      username: 'Nanda', 
      nama: 'Nanda Putri Utami, S.Pd', 
      role: UserRole.GURU_BK, 
      email: 'nandaputri.bk@sekolah.sch.id', 
      isActive: true 
    });
    migrated = true;
  }

  // Update BK teacher name and Admin name and Kepala Sekolah
  let hasUsr3 = false;
  let hasUsr5 = false;

  parsed.users = parsed.users.map((u: any) => {
    if (!u) return null;
    if (u.id === 'usr-6') return null; // Remove usr-6 completely to ensure we only have 2 Wali Kelas
    if (u.id === 'usr-1') {
      if (u.nama !== 'Holfi Aulia, S.Pd' || u.username !== 'admin' || u.role !== UserRole.ADMIN || u.isActive !== true) {
        u.nama = 'Holfi Aulia, S.Pd';
        u.username = 'admin';
        u.role = UserRole.ADMIN;
        u.email = 'holfi.aulia@sekolah.sch.id';
        u.isActive = true;
        migrated = true;
      }
    }
    if (u.id === 'usr-2') {
      if (u.nama !== 'Nur Jamilah Purwaningsih, S.Psi' || u.username !== 'Jamilah' || u.role !== UserRole.GURU_BK || u.isActive !== true) {
        u.nama = 'Nur Jamilah Purwaningsih, S.Psi';
        u.username = 'Jamilah';
        u.role = UserRole.GURU_BK;
        u.email = 'nurjamilah.bk@sekolah.sch.id';
        u.isActive = true;
        migrated = true;
      }
    } else {
      // Dynamic fallback check for user objects representing the BK teacher from sheets/offline
      const normalizedName = (u.nama || '').toString().toLowerCase();
      const normalizedUser = (u.username || '').toString().toLowerCase();
      if (normalizedUser === 'gurubk' || normalizedName.includes('sulaiman') || normalizedName.includes('siti rahma')) {
        u.nama = 'Nur Jamilah Purwaningsih, S.Psi';
        u.role = UserRole.GURU_BK;
        u.username = 'Jamilah';
        u.email = 'nurjamilah.bk@sekolah.sch.id';
        migrated = true;
      }
    }
    if (u.id === 'usr-3') {
      hasUsr3 = true;
      if (u.nama !== 'Arta Polta, S.Pd' || u.role !== UserRole.WALI_KELAS || u.username !== 'artapolta') {
        u.nama = 'Arta Polta, S.Pd';
        u.username = 'artapolta';
        u.email = 'artapolta@sekolah.sch.id';
        u.role = UserRole.WALI_KELAS;
        migrated = true;
      }
    }
    if (u.id === 'usr-4') {
      if (u.nama !== 'Salim, S.Pd., M.Hum.') {
        u.nama = 'Salim, S.Pd., M.Hum.';
        u.email = 'salim.kepsek@sekolah.sch.id';
        migrated = true;
      }
    }
    if (u.id === 'usr-5') {
      hasUsr5 = true;
      if (u.nama !== 'Nanda Putri Utami, S.Pd' || u.role !== UserRole.WALI_KELAS || u.username !== 'nandaputri') {
        u.nama = 'Nanda Putri Utami, S.Pd';
        u.username = 'nandaputri';
        u.role = UserRole.WALI_KELAS;
        u.email = 'nandaputri@sekolah.sch.id';
        migrated = true;
      }
    }
    // Convert isActive string to boolean
    const prevActive = u.isActive;
    u.isActive = u.isActive === undefined || u.isActive === true || String(u.isActive).toLowerCase() === 'true';
    if (u.isActive !== prevActive) {
      migrated = true;
    }
    return u;
  }).filter(Boolean);

  if (!hasUsr3) {
    parsed.users.push({ id: 'usr-3', username: 'artapolta', nama: 'Arta Polta, S.Pd', role: UserRole.WALI_KELAS, email: 'artapolta@sekolah.sch.id', isActive: true });
    migrated = true;
  }
  if (!hasUsr5) {
    parsed.users.push({ id: 'usr-5', username: 'nandaputri', nama: 'Nanda Putri Utami, S.Pd', role: UserRole.WALI_KELAS, email: 'nandaputri@sekolah.sch.id', isActive: true });
    migrated = true;
  }

  // Ensure all 21 Wali Kelas are present
  WALI_KELAS_USERS.forEach((wku) => {
    const exists = parsed.users.some((u: any) => u && u.username === wku.username);
    if (!exists) {
      parsed.users.push(wku);
      migrated = true;
    }
  });

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
      l.namaUser = 'Holfi Aulia, S.Pd';
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

    // Assign appropriate wali kelas
    const idNum = parseInt(k.id.replace('kl-', ''), 10);
    if (!isNaN(idNum)) {
      if (idNum >= 1 && idNum <= 7) {
        const expectedId = `wk-7-${idNum}`;
        if (k.waliKelasId !== expectedId) {
          k.waliKelasId = expectedId;
          migrated = true;
        }
      } else if (idNum >= 12 && idNum <= 18) {
        const expectedId = `wk-8-${idNum - 11}`;
        if (k.waliKelasId !== expectedId) {
          k.waliKelasId = expectedId;
          migrated = true;
        }
      } else if (idNum >= 23 && idNum <= 29) {
        const expectedId = `wk-9-${idNum - 22}`;
        if (k.waliKelasId !== expectedId) {
          k.waliKelasId = expectedId;
          migrated = true;
        }
      } else {
        // Fallback for classes 8-11
        if (idNum >= 8 && idNum <= 11) {
          if (k.waliKelasId !== 'wk-7-7') {
            k.waliKelasId = 'wk-7-7';
            migrated = true;
          }
        } else if (idNum >= 19 && idNum <= 22) {
          if (k.waliKelasId !== 'wk-8-7') {
            k.waliKelasId = 'wk-8-7';
            migrated = true;
          }
        } else if (idNum >= 30 && idNum <= 33) {
          if (k.waliKelasId !== 'wk-9-7') {
            k.waliKelasId = 'wk-9-7';
            migrated = true;
          }
        }
      }
    }

    return k;
  }).filter(Boolean);

  // Now, deduplicate classes based on their normalized namaKelas
  // We want to make sure we keep only one class per name, prioritizing standard id "kl-X"
  const seenClassNames = new Set<string>();
  const uniqueClasses: any[] = [];

  // Sort them so that standard IDs ('kl-1' through 'kl-33') come first, ensuring they are preserved as the primary objects
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
    
    // Determine the target ID for this class name
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
      // If its current ID is not standard but we have a standard ID for it, redirect it to standard ID
      if (k.id !== standardId && !parsed.kelas.some((x: any) => x && x.id === standardId)) {
        // Only redirect if the standard ID isn't already taken by something else
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

    // Check if classes are high school (e.g., has 'RPL', 'TKJ', 'DKV') or if they don't match our new grades (33 rombel)
    const hasHighSchoolClasses = parsed.kelas.some((k: any) => 
      k && k.namaKelas && (k.namaKelas.includes('RPL') || k.namaKelas.includes('TKJ') || k.namaKelas.includes('DKV'))
    );
    if (hasHighSchoolClasses || parsed.kelas.length < 33 || parsed.siswa.length === 0) {
      parsed.kelas = [...INITIAL_DATABASE.kelas];
      parsed.siswa = [...INITIAL_DATABASE.siswa];
      parsed.orangTua = [...INITIAL_DATABASE.orangTua];
      migrated = true;
    }
  }

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

  // Ensure every student record matches standard types and has basic info
  parsed.siswa = parsed.siswa.map((s: any) => {
    if (s) {
      if (!s.id) {
        s.id = `sis-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        migrated = true;
      }
      if (s.nis === undefined) { s.nis = ''; migrated = true; }
      if (s.nisn === undefined) { s.nisn = ''; migrated = true; }
      if (!s.nama) { s.nama = 'Siswa Tanpa Nama'; migrated = true; }
    }
    return s;
  }).filter(Boolean);

  parsed._sanitized_v6 = true;
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
  return currentDatabase.config.gasApiUrl || ((import.meta as any).env?.VITE_GAS_API_URL as string) || 'https://script.google.com/macros/s/AKfycbwL5nTSIsbpgFE6JxD2STMWQiFezjN8Dw6xTg_ktbtVUOHTvLinLFuu6ojYe0QP9bZm/exec';
};

export const setGasApiUrl = (url: string) => {
  const db = { ...currentDatabase };
  db.config.gasApiUrl = url ? url.trim() : '';
  saveLocalDatabase(db);
};

export const getSpreadsheetId = (): string => {
  return currentDatabase.config.spreadsheetId || ((import.meta as any).env?.VITE_SPREADSHEET_ID as string) || '1g3thopFbDdsvlXyidgq_PEiiEhY5cH3PngqGO5weHqc';
};

export const setSpreadsheetId = (id: string) => {
  const db = { ...currentDatabase };
  db.config.spreadsheetId = id ? id.trim() : '';
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

      if (isAdmin) {
        if (password !== 'admin123') {
          return { success: false, message: 'Password Admin salah.' };
        }
      } else if (isGuruBk) {
        const uNameLower = (user.username || '').toString().toLowerCase();
        if (uNameLower === 'jamilah' || uNameLower === 'gurubk') {
          if (password !== 'Nur123') {
            return { success: false, message: 'Password Guru BK Jamilah salah.' };
          }
        } else if (uNameLower === 'arta') {
          if (password !== 'Arta123') {
            return { success: false, message: 'Password Guru BK Arta salah.' };
          }
        } else if (uNameLower === 'nanda') {
          if (password !== 'Putri123') {
            return { success: false, message: 'Password Guru BK Nanda salah.' };
          }
        } else {
          // fallback
          if (password !== 'bk123') {
            return { success: false, message: 'Password Guru BK salah.' };
          }
        }
      } else if (roleStr === UserRole.WALI_KELAS.toLowerCase() || roleStr === 'wali kelas') {
        const uNameLower = (user.username || '').toString().toLowerCase();
        const wkPasswords: Record<string, string> = {
          damianus: 'damianus123',
          albert: 'albert123',
          novie: 'novie123',
          ira: 'ira123',
          yulia: 'yulia123',
          terra: 'terra123',
          lidya: 'lidya123',
          sri: 'sri123',
          farah: 'farah123',
          eva: 'eva123',
          nur: 'nur123',
          selfi: 'selfi123',
          gerry: 'gerry123',
          ibnu: 'ibnu123',
          nani: 'nani123',
          ana: 'ana123',
          monica: 'monica123',
          indri: 'indri123',
          wahyunis: 'wahyunis123',
          titin: 'titin123',
          ifah: 'ifah123'
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

    // 2. Check in student database (by NIS, NISN or Name)
    const s = db.siswa.find((student) => {
      const uLower = (username || '').toString().trim().toLowerCase();
      const sNis = student.nis ? student.nis.toString().trim().toLowerCase() : '';
      const sNisn = student.nisn ? student.nisn.toString().trim().toLowerCase() : '';
      const sNama = student.nama ? student.nama.toString().trim().toLowerCase() : '';
      return sNis === uLower || sNisn === uLower || sNama === uLower;
    });

    if (s) {
      if (!password) {
        return { success: false, message: 'Password wajib diisi.' };
      }

      // Password must match student's NIS, NISN or Nama (case-insensitive)
      const pLower = (password || '').toString().trim().toLowerCase();
      const sNis = s.nis ? s.nis.toString().trim().toLowerCase() : '';
      const sNisn = s.nisn ? s.nisn.toString().trim().toLowerCase() : '';
      const sNama = s.nama ? s.nama.toString().trim().toLowerCase() : '';

      const validPassword = 
        pLower === sNis ||
        pLower === sNisn || 
        pLower === sNama;

      if (!validPassword) {
        return { success: false, message: 'Password salah. Masukkan NIS, NISN, atau nama lengkap Anda.' };
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
        const { sanitized } = sanitizeDatabaseState(res.data);
        const updated = { ...sanitized, config: { ...localDb.config, gasApiUrl: getGasApiUrl() } };
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
  }
};
