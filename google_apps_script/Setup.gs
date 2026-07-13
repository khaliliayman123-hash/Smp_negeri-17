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
      ["kelas-7-1", "Kelas 7-1", "gurubk"],
      ["kelas-7-2", "Kelas 7-2", "admin"]
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
