/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export enum UserRole {
  ADMIN = 'Admin',
  GURU_BK = 'Guru BK',
  WALI_KELAS = 'Wali Kelas',
  KEPALA_SEKOLAH = 'Kepala Sekolah',
  SISWA = 'Siswa',
}

export interface User {
  id: string;
  username: string;
  nama: string;
  role: UserRole;
  email: string;
  isActive: boolean;
}

export interface Siswa {
  id: string;
  nis: string;
  nisn: string;
  nama: string;
  foto?: string; // Base64 data URI
  tempatLahir: string;
  tanggalLahir: string;
  jenisKelamin: 'Laki-laki' | 'Perempuan';
  agama: string;
  alamat: string;
  desa: string;
  kecamatan: string;
  kabupaten: string;
  provinsi: string;
  nomorHp: string;
  email: string;
  kelasId: string;
  jurusanId: string;
  tahunMasuk: string;
  tahunPelajaran: string;
}

export interface OrangTua {
  id: string; // matches Siswa.id
  namaAyah: string;
  statusAyah?: 'Hidup' | 'Meninggal';
  tempatLahirAyah?: string;
  tanggalLahirAyah?: string;
  alamatAyah?: string;
  agamaAyah?: string;
  pendidikanAyah?: string;
  pekerjaanAyah?: string;
  noHpAyah?: string;

  namaIbu: string;
  statusIbu?: 'Hidup' | 'Meninggal';
  tempatLahirIbu?: string;
  tanggalLahirIbu?: string;
  alamatIbu?: string;
  agamaIbu?: string;
  pendidikanIbu?: string;
  pekerjaanIbu?: string;
  noHpIbu?: string;

  wali?: string;
  statusWali?: 'Hidup' | 'Meninggal';
  tempatLahirWali?: string;
  tanggalLahirWali?: string;
  alamatWali?: string;
  agamaWali?: string;
  pendidikanWali?: string;
  pekerjaanWali?: string;
  noHpWali?: string;

  penghasilan: string;
  pendidikanOrangTua: string;
}

export interface Akademik {
  id: string; // matches Siswa.id
  semester: string;
  rataRataRaport: number;
  catatanWaliKelas: string;
}

export interface Kesehatan {
  id: string; // matches Siswa.id
  tinggiBadan: number; // cm
  beratBadan: number; // kg
  golonganDarah: string;
  penyakit?: string;
  alergi?: string;
  disabilitas?: string;
}

export interface Ekonomi {
  id: string; // matches Siswa.id
  statusRumah: string; // Milik Sendiri, Sewa, dll.
  penghasilan: string;
  kendaraan: string;
  pip: boolean;
  pkh: boolean;
  kip: boolean;
}

export interface Psikologi {
  id: string; // matches Siswa.id
  minat: string;
  bakat: string;
  hobi: string;
  gayaBelajar: string; // Visual, Auditory, Kinestetik
  citaCita: string;
  kepribadian: string;
}

export interface Sosial {
  id: string; // matches Siswa.id
  hubunganTeman: string;
  organisasi?: string;
  masalahSosial?: string;
}

export interface Prestasi {
  id: string;
  siswaId: string;
  namaPrestasi: string;
  tingkat: string; // Sekolah, Kecamatan, Kabupaten, Provinsi, Nasional, Internasional
  tahun: string;
  juara: string;
  sertifikat?: string; // Base64 data or filename
  kategori?: 'Akademik' | 'Non Akademik';
}

export interface Pelanggaran {
  id: string;
  siswaId: string;
  tanggal: string;
  jenisPelanggaran: string;
  kategori: string; // Ringan, Sedang, Berat
  poin: number;
  guruPelapor: string;
  tindakLanjut: string;
  status: 'Selesai' | 'Proses' | 'Belum Ditindak';
}

export interface RemisiPoin {
  id: string;
  siswaId: string;
  tanggal: string;
  jenisRemisi: string;
  kategori: string; // e.g., 'Karakter Baik', 'Prestasi', 'Bantuan Sosial', 'Lainnya'
  poin: number;
  guruPemberi: string;
  keterangan: string;
}

export interface Konseling {
  id: string;
  nomorKonseling: string;
  siswaId: string;
  tanggal: string;
  jenis: 'Individu' | 'Kelompok' | 'Klasikal';
  guruBkId: string;
  permasalahan: string;
  analisis: string;
  solusi: string;
  hasil: string;
  tindakLanjut: string;
}

export interface Asesmen {
  id: string;
  siswaId: string;
  akpd?: string; // Angket Kebutuhan Peserta Didik
  dcm?: string; // Gaya Belajar (Sebelumnya DCM / Daftar Cek Masalah, disimpan sebagai dcm demi kompatibilitas)
  aum?: string; // Alat Ungkap Masalah
  iq?: number;
  bakat?: string;
  minat?: string;
}

export interface HomeVisit {
  id: string;
  siswaId: string;
  tanggal: string;
  tujuan: string;
  hasil: string;
  dokumentasi?: string; // Base64 data URI
}

export interface Surat {
  id: string;
  siswaId: string;
  nomorSurat: string;
  tanggal: string;
  jenisSurat: 'Surat Panggilan' | 'Surat Kontrak Perilaku' | 'Surat Home Visit' | 'Surat Rujukan';
  perihal: string;
  isiSurat: string;
}

export interface Dokumen {
  id: string;
  siswaId: string;
  jenisDokumen: 'KK' | 'Akta' | 'Raport' | 'Sertifikat' | 'Foto Rumah' | 'Lainnya';
  namaFile: string;
  fileData?: string; // Base64 data URI
  tanggalUpload: string;
}

export interface CatatanPerkembangan {
  id: string;
  siswaId: string;
  tanggal: string;
  catatan: string;
  guruBkId: string;
}

export interface TahunPelajaran {
  id: string;
  tahun: string; // e.g., 2023/2024
  semester: 'Ganjil' | 'Genap';
  isActive: boolean;
}

export interface Kelas {
  id: string;
  namaKelas: string; // e.g., X RPL 1
  waliKelasId: string;
}

export interface Jurusan {
  id: string;
  namaJurusan: string; // e.g., Rekayasa Perangkat Lunak
  singkatan: string; // e.g., RPL
}

export interface LogAktivitas {
  id: string;
  timestamp: string;
  userId: string;
  namaUser: string;
  role: string;
  aktivitas: string;
  detail: string;
}

export interface Kehadiran {
  id: string;
  siswaId: string;
  mingguKe: string; // e.g., "Minggu 1", "Minggu 2"
  bulan: string;    // e.g., "Juli"
  tahun: string;    // e.g., "2026"
  hadir: number;
  sakit: number;
  izin: number;
  alfa: number;
  keterangan?: string;
}

export interface DatabaseState {
  users: User[];
  siswa: Siswa[];
  orangTua: OrangTua[];
  akademik: Akademik[];
  kesehatan: Kesehatan[];
  ekonomi: Ekonomi[];
  psikologi: Psikologi[];
  sosial: Sosial[];
  prestasi: Prestasi[];
  pelanggaran: Pelanggaran[];
  remisiPoin: RemisiPoin[];
  konseling: Konseling[];
  asesmen: Asesmen[];
  homeVisit: HomeVisit[];
  surat: Surat[];
  dokumen: Dokumen[];
  catatanPerkembangan: CatatanPerkembangan[];
  tahunPelajaran: TahunPelajaran[];
  kelas: Kelas[];
  jurusan: Jurusan[];
  logAktivitas: LogAktivitas[];
  kehadiran?: Kehadiran[];
  _sanitized?: boolean;
  _sanitized_v3?: boolean;
  _sanitized_v4?: boolean;
  _sanitized_v5?: boolean;
  _sanitized_v6?: boolean;
  config: {
    gasApiUrl: string;
    spreadsheetId?: string;
  };
}

