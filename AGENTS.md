# Aturan dan Konfigurasi Tetap Proyek Sistem HDS SMPN 17 Tangerang Selatan

Dokumen ini memuat aturan teknis dan konfigurasi permanen untuk pengembangan aplikasi HDS Bimbingan dan Konseling UPTD SMPN 17 Kota Tangerang Selatan.

## 1. Integrasi Google Sheets & Google Apps Script
- **Web App URL Utama**: Terhubung langsung ke Web App Google Apps Script resmi sekolah.
- **Koneksi Spreadsheet Aktif (PENTING)**: 
  - Web App Google Apps Script sudah terikat (*bound*) secara otomatis ke Google Spreadsheet aktif yang memuat **seluruh 1.386 data siswa** (Kelas 7, 8, dan 9).
  - **DILARANG KERAS** menyisipkan atau melakukan *hardcode* terhadap ID Spreadsheet lama (`1g3thopFbDdsvlXyidgq_PEiiEhY5cH3PngqGO5weHqc`). Mengirimkan ID lama tersebut akan memaksa Google Apps Script membuka arsip usang yang hanya berisi 859 siswa.
  - Parameter `spreadsheetId` harus selalu dibiarkan kosong (`''`) agar Google Apps Script selalu menggunakan `SpreadsheetApp.getActiveSpreadsheet()`.

## 2. Struktur Kelas & Siswa
- **Total Siswa**: 1.386 siswa.
- **Total Rombel**: 33 Kelas lengkap:
  - Kelas 7: 7-1 s.d. 7-11 (ID: `kl-1` s.d. `kl-11`)
  - Kelas 8: 8-1 s.d. 8-11 (ID: `kl-12` s.d. `kl-22`)
  - Kelas 9: 9-1 s.d. 9-11 (ID: `kl-23` s.d. `kl-33`)

## 3. Sistem Penyimpanan Multi-Device & Kuota Browser
- Database siswa berukuran ~3,1 MB.
- Sistem menggunakan **IndexedDB** (`hds_bk_idb_v1`) sebagai media penyimpanan utama di perangkat agar tidak terkena batas kuota 5MB *localStorage* browser perangkat seluler (HP) maupun laptop.
- *LocalStorage* (`hds_bk_database_v1`) difungsikan sebagai cadangan ringkas (*compact backup*).
- Mekanisme *self-healing* otomatis mendeteksi jika perangkat masih menyimpan cache di bawah 1.300 siswa dan langsung mengunduh data penuh dari Google Sheets.
