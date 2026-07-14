/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * SISTEM HIMPUNAN DATA SISWA (HDS) BIMBINGAN DAN KONSELING
 * Google Apps Script - Database Setup & Initializer (Setup.gs)
 * 
 * CARA PENGGUNAAN:
 * 1. Buka Google Spreadsheet baru atau yang sudah ada.
 * 2. Klik menu "Ekstensi" -> "Apps Script".
 * 3. Hapus semua kode default, lalu salin seluruh file kode .gs dari proyek ini (Code.gs, Helper.gs, Siswa.gs, Setup.gs, dll.).
 * 4. Pilih fungsi "setupHDSDatabaseSheets" di menu atas editor Apps Script, lalu klik tombol "Jalankan".
 * 5. Berikan izin otorisasi yang diminta.
 * 6. Spreadsheet Anda akan otomatis terbuat dengan seluruh 21 tabel (sheet) dan header kolom yang sesuai!
 */

function setupHDSDatabaseSheets() {
  const db = getDatabaseSheets();
  
  const schema = {
    "Users": [
      "id", "username", "nama", "role", "email", "isActive"
    ],
    "Siswa": [
      "id", "nis", "nisn", "nama", "foto", "tempatLahir", "tanggalLahir", "jenisKelamin", "agama", "alamat", "desa", "kecamatan", "kabupaten", "provinsi", "nomorHp", "email", "kelasId", "tahunMasuk"
    ],
    "OrangTua": [
      "id", "namaAyah", "statusAyah", "tempatLahirAyah", "tanggalLahirAyah", "alamatAyah", "agamaAyah", "pendidikanAyah", "pekerjaanAyah", "noHpAyah", "namaIbu", "statusIbu", "tempatLahirIbu", "tanggalLahirIbu", "alamatIbu", "agamaIbu", "pendidikanIbu", "pekerjaanIbu", "noHpIbu", "wali", "statusWali", "tempatLahirWali", "tanggalLahirWali", "alamatWali", "agamaWali", "pendidikanWali", "pekerjaanWali", "noHpWali", "penghasilan", "pendidikanOrangTua"
    ],
    "Akademik": [
      "id", "semester", "rataRataRaport", "catatanWaliKelas"
    ],
    "Kesehatan": [
      "id", "tinggiBadan", "beratBadan", "golonganDarah", "penyakit", "alergi", "disabilitas"
    ],
    "Ekonomi": [
      "id", "statusRumah", "penghasilan", "kendaraan", "pip", "pkh", "kip"
    ],
    "Psikologi": [
      "id", "minat", "bakat", "hobi", "gayaBelajar", "citaCita", "kepribadian"
    ],
    "Sosial": [
      "id", "hubunganTeman", "organisasi", "masalahSosial"
    ],
    "Prestasi": [
      "id", "siswaId", "namaPrestasi", "tingkat", "tahun", "juara", "sertifikat", "kategori"
    ],
    "Pelanggaran": [
      "id", "siswaId", "tanggal", "jenisPelanggaran", "kategori", "poin", "guruPelapor", "tindakLanjut", "status"
    ],
    "RemisiPoin": [
      "id", "siswaId", "tanggal", "jenisRemisi", "kategori", "poin", "guruPemberi", "keterangan"
    ],
    "Konseling": [
      "id", "nomorKonseling", "siswaId", "tanggal", "jenis", "guruBkId", "permasalahan", "analisis", "solusi", "hasil", "tindakLanjut"
    ],
    "Asesmen": [
      "id", "siswaId", "akpd", "dcm", "aum", "iq", "bakat", "minat"
    ],
    "HomeVisit": [
      "id", "siswaId", "tanggal", "tujuan", "hasil", "dokumentasi"
    ],
    "Surat": [
      "id", "siswaId", "nomorSurat", "tanggal", "jenisSurat", "perihal", "isiSurat"
    ],
    "Dokumen": [
      "id", "siswaId", "jenisDokumen", "namaFile", "fileData", "tanggalUpload"
    ],
    "CatatanPerkembangan": [
      "id", "siswaId", "tanggal", "catatan", "guruBkId"
    ],
    "TahunPelajaran": [
      "id", "tahun", "semester", "isActive"
    ],
    "Kelas": [
      "id", "namaKelas", "waliKelasId"
    ],
    "LogAktivitas": [
      "id", "timestamp", "userId", "namaUser", "role", "aktivitas", "detail"
    ]
  };

  const initialData = {
    "Users": [
      ["admin", "admin", "Administrator Utama", "Admin", "admin@sekolah.sch.id", true],
      ["gurubk", "gurubk", "Nur Jamilah Purwaningsih, S.Psi", "Koordinator BK", "nurjamilah.bk@sekolah.sch.id", true]
    ],
    "TahunPelajaran": [
      ["tp-2023-ganjil", "2023/2024", "Ganjil", true]
    ],
    "Kelas": [
      ["kl-1", "Kelas 7-1", "wk-7-1"],
      ["kl-2", "Kelas 7-2", "wk-7-2"],
      ["kl-3", "Kelas 7-3", "wk-7-3"],
      ["kl-4", "Kelas 7-4", "wk-7-4"],
      ["kl-5", "Kelas 7-5", "wk-7-5"],
      ["kl-6", "Kelas 7-6", "wk-7-6"],
      ["kl-7", "Kelas 7-7", "wk-7-7"],
      ["kl-8", "Kelas 7-8", "wk-7-8"],
      ["kl-9", "Kelas 7-9", "wk-7-9"],
      ["kl-10", "Kelas 7-10", "wk-7-10"],
      ["kl-11", "Kelas 7-11", "wk-7-11"],
      ["kl-12", "Kelas 8-1", "wk-8-1"],
      ["kl-13", "Kelas 8-2", "wk-8-2"],
      ["kl-14", "Kelas 8-3", "wk-8-3"],
      ["kl-15", "Kelas 8-4", "wk-8-4"],
      ["kl-16", "Kelas 8-5", "wk-8-5"],
      ["kl-17", "Kelas 8-6", "wk-8-6"],
      ["kl-18", "Kelas 8-7", "wk-8-7"],
      ["kl-19", "Kelas 8-8", "wk-8-8"],
      ["kl-20", "Kelas 8-9", "wk-8-9"],
      ["kl-21", "Kelas 8-10", "wk-8-10"],
      ["kl-22", "Kelas 8-11", "wk-8-11"],
      ["kl-23", "Kelas 9-1", "wk-9-1"],
      ["kl-24", "Kelas 9-2", "wk-9-2"],
      ["kl-25", "Kelas 9-3", "wk-9-3"],
      ["kl-26", "Kelas 9-4", "wk-9-4"],
      ["kl-27", "Kelas 9-5", "wk-9-5"],
      ["kl-28", "Kelas 9-6", "wk-9-6"],
      ["kl-29", "Kelas 9-7", "wk-9-7"],
      ["kl-30", "Kelas 9-8", "wk-9-8"],
      ["kl-31", "Kelas 9-9", "wk-9-9"],
      ["kl-32", "Kelas 9-10", "wk-9-10"],
      ["kl-33", "Kelas 9-11", "wk-9-11"]
    ]
  };

  for (let sheetName in schema) {
    let sheet = db.getSheetByName(sheetName);
    if (!sheet) {
      sheet = db.insertSheet(sheetName);
      Logger.log("Membuat sheet baru: " + sheetName);
    } else {
      Logger.log("Sheet sudah ada: " + sheetName);
    }
    
    // Terapkan headers
    const headers = schema[sheetName];
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    sheet.getRange(1, 1, 1, headers.length).setFontWeight("bold").setBackground("#e2e8f0");
    
    // Auto-protect header row
    try {
      sheet.autoResizeColumns(1, headers.length);
    } catch(e) {}
    
    // Isi data awal jika sheet masih kosong (hanya ada baris header)
    if (sheet.getLastRow() === 1 && initialData[sheetName]) {
      const rows = initialData[sheetName];
      sheet.getRange(2, 1, rows.length, rows[0].length).setValues(rows);
      Logger.log("Mengisi data awal untuk sheet: " + sheetName);
    }
  }

  // Hapus sheet bawaan "Sheet1" jika ada dan kosong untuk merapikan
  const defaultSheet = db.getSheetByName("Sheet1");
  if (defaultSheet && defaultSheet.getLastRow() === 0 && defaultSheet.getLastColumn() === 0) {
    db.deleteSheet(defaultSheet);
    Logger.log("Menghapus sheet bawaan kosong 'Sheet1' untuk kerapihan.");
  }

  Logger.log("SUKSES: Seluruh 21 tabel HDS Bimbingan dan Konseling telah sukses dibuat dan dikonfigurasi di Google Spreadsheet ini!");
}
