/**
 * ========================================================================
 * SISTEM HIMPUNAN DATA SISWA (HDS) BIMBINGAN DAN KONSELING
 * Google Apps Script - CONSOLIDATED MASTER SCRIPT (Satu File)
 * ========================================================================
 * 
 * CARA INSTALASI MUDAH (FOOLPROOF):
 * 1. Buka Google Spreadsheet baru atau yang sudah ada di Google Drive Anda.
 * 2. Klik menu "Extensions" -> "Apps Script" (Ekstensi -> Apps Script).
 * 3. Hapus seluruh kode default yang ada di editor (jika ada).
 * 4. Paste SELURUH KODE di bawah ini ke dalam editor tersebut (cukup di file Code.gs saja, tidak perlu buat banyak file).
 * 5. Klik ikon "Save" (Disket) untuk menyimpan proyek.
 * 6. Di menu dropdown fungsi di bagian atas, pilih "setupHDSDatabaseSheets", lalu klik tombol "Run" (Jalankan).
 * 7. Setujui dialog otorisasi (klik "Review Permissions", pilih akun Google Anda, klik "Advanced" / "Lanjutan", klik "Go to Untitled project (unsafe)", lalu klik "Allow" / "Izinkan").
 * 8. Spreadsheet Anda sekarang otomatis terbuat dengan seluruh sheet (tabel) dan baris header kolom yang sesuai!
 * 9. Klik tombol "Deploy" (Terapkan) -> "New deployment" (Penerapan baru) di pojok kanan atas.
 * 10. Klik ikon Gerigi di sebelah "Select type", pastikan "Web app" terpilih.
 * 11. Konfigurasi penting:
 *     - Execute as (Jalankan sebagai): Me (Surel Google Anda)
 *     - Who has access (Siapa yang memiliki akses): Anyone (Siapa saja, bahkan anonim)
 * 12. Klik "Deploy", salin "Web App URL" yang dihasilkan (akhiran /exec) dan simpan ke aplikasi Sistem BK Anda.
 */

// ==========================================
// KONFIGURASI SPREADSHEET ID (OPSIONAL)
// ==========================================
// Jika script ini dibuka langsung dari menu "Extensions > Apps Script" di Spreadsheet target,
// biarkan SPREADSHEET_ID kosong "" atau gunakan default. Script akan otomatis terhubung.
const SPREADSHEET_ID_CONFIG = "";



// ==========================================
// BAGIAN: Setup.gs
// ==========================================
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
    "Catatan_Perkembangan": [
      "id", "siswaId", "tanggal", "catatan", "rekomendasi", "guruBkId", "namaGuru", "roleGuru", "kategori"
    ],
    "Pengaduan_Siswa": [
      "id", "siswaId", "namaSiswa", "nis", "kelas", "tanggalKejadian", "tanggalPengaduan", "judulPengaduan", "kategori", "kronologis", "buktiFoto", "namaFoto", "status", "tanggapanBk", "tanggalTanggapan", "petugasBk"
    ],
    "Kehadiran": [
      "id", "siswaId", "mingguKe", "bulan", "tahun", "hadir", "sakit", "izin", "alfa", "keterangan"
    ],
    "LaporanKejadian": [
      "id", "tanggal", "pelaporId", "namaPelapor", "kelasId", "ringkasan", "detail", "status"
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

// ==========================================
// BAGIAN: Code.gs
// ==========================================
function doGet(e) {
  return handleRequest(e);
}

function doPost(e) {
  return handleRequest(e);
}

function handleRequest(e) {
  // Set CORS headers
  const output = ContentService.createTextOutput();
  output.setMimeType(ContentService.MimeType.JSON);
  
  // Jika dijalankan manual di editor Apps Script, 'e' akan bernilai undefined.
  // Kita cegah error 'Cannot read properties of undefined (reading 'parameter')'.
  if (!e || !e.parameter) {
    output.setContent(JSON.stringify({ 
      success: true, 
      message: "Koneksi Berhasil! Google Apps Script berjalan dengan baik. Silakan gunakan Web App URL di aplikasi untuk sinkronisasi data secara otomatis." 
    }));
    return output;
  }

  let postData = null;
  if (e.postData && e.postData.contents) {
    try {
      postData = JSON.parse(e.postData.contents);
    } catch (err) {
      Logger.log("Gagal parse JSON postData: " + err.toString());
    }
  }

  const action = e.parameter.action || (postData && postData.action);
  const spreadsheetId = e.parameter.spreadsheetId || (postData && postData.spreadsheetId);
  let responseData = { success: false, message: "Invalid Action" };
  
  try {
    const db = getDatabaseSheets(spreadsheetId);

    switch (action) {
      case "getFullDatabase":
        responseData = { success: true, data: fetchFullDatabase(db) };
        break;
        
      case "login":
        responseData = simulateLogin(db, e.parameter.username || (postData && postData.username));
        break;
        
      case "saveSiswaPackage":
        if (postData) {
          responseData = saveSiswaPackage(db, postData);
        } else {
          responseData = { success: false, message: "Payload kosong." };
        }
        break;
        
      case "deleteSiswa":
        responseData = deleteSiswaPackage(db, postData.id);
        break;
        
      case "saveTahunPelajaran":
        responseData = saveEntity(db, "TahunPelajaran", postData.tp, postData.isNew);
        break;
        
      case "deleteTahunPelajaran":
        responseData = deleteEntity(db, "TahunPelajaran", postData.id);
        break;
        
      case "saveKelas":
        responseData = saveEntity(db, "Kelas", postData.kl, postData.isNew);
        break;
        
      case "deleteKelas":
        responseData = deleteEntity(db, "Kelas", postData.id);
        break;
        
      case "saveUser":
        responseData = saveUser(db, postData.user, postData.isNew);
        break;
        
      case "deleteUser":
        responseData = deleteEntity(db, "Users", postData.id);
        break;
        
      case "savePrestasi":
        responseData = saveEntity(db, "Prestasi", postData.p, postData.isNew);
        break;
        
      case "deletePrestasi":
        responseData = deleteEntity(db, "Prestasi", postData.id);
        break;
        
      case "savePelanggaran":
        responseData = saveEntity(db, "Pelanggaran", postData.p, postData.isNew);
        break;
        
      case "deletePelanggaran":
        responseData = deleteEntity(db, "Pelanggaran", postData.id);
        break;

      case "saveRemisiPoin":
        responseData = saveEntity(db, "RemisiPoin", postData.r, postData.isNew);
        break;
        
      case "deleteRemisiPoin":
        responseData = deleteEntity(db, "RemisiPoin", postData.id);
        break;
        
      case "saveKonseling":
        responseData = saveEntity(db, "Konseling", postData.k, postData.isNew);
        break;
        
      case "deleteKonseling":
        responseData = deleteEntity(db, "Konseling", postData.id);
        break;
        
      case "saveAsesmen":
        responseData = saveEntity(db, "Asesmen", postData.a, postData.isNew);
        break;
        
      case "deleteAsesmen":
        responseData = deleteEntity(db, "Asesmen", postData.id);
        break;
        
      case "saveHomeVisit":
        responseData = saveEntity(db, "HomeVisit", postData.h, postData.isNew);
        break;
        
      case "deleteHomeVisit":
        responseData = deleteEntity(db, "HomeVisit", postData.id);
        break;
        
      case "saveSurat":
        responseData = saveEntity(db, "Surat", postData.s, postData.isNew);
        break;
        
      case "deleteSurat":
        responseData = deleteEntity(db, "Surat", postData.id);
        break;
        
      case "saveDokumen":
        responseData = saveEntity(db, "Dokumen", postData.d, postData.isNew);
        break;
        
      case "deleteDokumen":
        responseData = deleteEntity(db, "Dokumen", postData.id);
        break;
        
      case "saveCatatanPerkembangan":
        responseData = saveEntity(db, "Catatan_Perkembangan", postData.c, postData.isNew);
        break;
        
      case "deleteCatatanPerkembangan":
        responseData = deleteEntity(db, "Catatan_Perkembangan", postData.id);
        break;

      case "savePengaduan":
        responseData = saveEntity(db, "Pengaduan_Siswa", postData.p, postData.isNew);
        break;

      case "deletePengaduan":
        responseData = deleteEntity(db, "Pengaduan_Siswa", postData.id);
        break;

      case "updatePengaduanStatus":
        responseData = updatePengaduanStatusRow(db, postData.id, postData.status, postData.tanggapanBk, postData.petugasBk, postData.tanggalTanggapan);
        break;
        
      case "saveKehadiran":
        responseData = saveEntity(db, "Kehadiran", postData.k, postData.isNew);
        break;
        
      case "deleteKehadiran":
        responseData = deleteEntity(db, "Kehadiran", postData.id);
        break;
        
      case "saveLaporanKejadian":
        responseData = saveEntity(db, "LaporanKejadian", postData.l, postData.isNew);
        break;
        
      case "deleteLaporanKejadian":
        responseData = deleteEntity(db, "LaporanKejadian", postData.id);
        break;

      case "updateLaporanKejadianStatus":
        responseData = updateLaporanStatusRow(db, postData.id, postData.status);
        break;
        
      case "addLog":
        responseData = appendLog(db, postData);
        break;
        
      case "uploadFullDatabase":
        if (postData) {
          responseData = uploadFullDatabase(db, postData);
        } else {
          responseData = { success: false, message: "Payload kosong." };
        }
        break;
        
      default:
        responseData = { success: false, message: "Action '" + action + "' tidak dikenali." };
    }
  } catch (error) {
    responseData = { success: false, message: "Server Error: " + error.toString() };
  }
  
  output.setContent(JSON.stringify(responseData));
  return output;
}

// ==========================================
// BAGIAN: Helper.gs
// ==========================================
const SPREADSHEET_ID = SPREADSHEET_ID_CONFIG || "1GeBg6ZXwN4MhyfvFTFHw288wu2ZQ_qZy4u07zbjwKaI";

function getDatabaseSheets(spreadsheetId) {
  let db = null;
  const DEFAULT_IDS = [
    "1g3thopFbDdsvlXyidgq_PEiiEhY5cH3PngqGO5weHqc",
    "1GeBg6ZXwN4MhyfvFTFHw288wu2ZQ_qZy4u07zbjwKaI"
  ];
  
  // 1. Coba ambil spreadsheetId dari parameter/payload jika dikirim secara dinamis oleh client
  if (spreadsheetId && spreadsheetId !== "") {
    var cleanedId = spreadsheetId;
    if (spreadsheetId.indexOf("/d/") !== -1) {
      var parts = spreadsheetId.split("/d/");
      if (parts.length > 1) {
        cleanedId = parts[1].split("/")[0];
      }
    }
    
    var isDefaultPlaceholder = false;
    for (var i = 0; i < DEFAULT_IDS.length; i++) {
      if (cleanedId === DEFAULT_IDS[i]) {
        isDefaultPlaceholder = true;
        break;
      }
    }
    
    try {
      db = SpreadsheetApp.openById(cleanedId);
      if (db) return db;
    } catch (e) {
      Logger.log("Gagal membuka spreadsheet via parameter ID: " + e.message);
      // Jika ID yang dimasukkan adalah ID khusus milik user (bukan placeholder), lemparkan error secara eksplisit agar user tahu masalah hak aksesnya!
      if (!isDefaultPlaceholder) {
        throw new Error("Gagal mengakses Google Spreadsheet Anda dengan ID '" + cleanedId + "'. Pastikan: 1) Akun Google yang mendeploy Web App ini memiliki akses Edit ke spreadsheet tersebut, 2) ID Spreadsheet sudah benar. Detail error: " + e.message);
      }
    }
  }
  
  // 2. Coba ambil spreadsheet aktif terlebih dahulu (jika script ini dijalankan sebagai bound script)
  try {
    db = SpreadsheetApp.getActiveSpreadsheet();
    if (db) return db;
  } catch (e) {
    Logger.log("Bukan bound script, mencoba buka via ID.");
  }
  
  // 3. Jika gagal, atau jika SPREADSHEET_ID diubah secara custom oleh user (bukan placeholder developer)
  if (!db && SPREADSHEET_ID && SPREADSHEET_ID !== "" && SPREADSHEET_ID !== "1GeBg6ZXwN4MhyfvFTFHw288wu2ZQ_qZy4u07zbjwKaI") {
    try {
      db = SpreadsheetApp.openById(SPREADSHEET_ID);
      if (db) return db;
    } catch (e) {
      Logger.log("Gagal membuka spreadsheet berdasarkan ID: " + e.message);
      throw new Error("Gagal membuka spreadsheet berdasarkan SPREADSHEET_ID '" + SPREADSHEET_ID + "'. Pastikan ID tersebut benar, spreadsheet-nya ada, dan akun Google Anda memiliki akses edit ke Spreadsheet tersebut. Detail error: " + e.message);
    }
  }
  
  if (!db) {
    // 4. Jika masih null, coba paksa buka SPREADSHEET_ID bawaan sebagai fallback terakhir
    if (SPREADSHEET_ID && SPREADSHEET_ID !== "") {
      try {
        db = SpreadsheetApp.openById(SPREADSHEET_ID);
      } catch (e) {
        throw new Error("Spreadsheet tidak terhubung! Pastikan SPREADSHEET_ID di bagian atas file Helper.gs sudah diisi dengan ID Google Spreadsheet Anda yang valid atau kirimkan via parameter. Detail error: " + e.message);
      }
    } else {
      throw new Error("Spreadsheet tidak terhubung! Silakan hubungkan dengan membuka Google Sheets Anda lalu klik Extensions > Apps Script.");
    }
  }
  
  return db;
}

function fetchFullDatabase(db) {
  db = db || getDatabaseSheets();
  
  const schema = {
    "Users": ["id", "username", "nama", "role", "email", "isActive"],
    "Siswa": ["id", "nis", "nisn", "nama", "foto", "tempatLahir", "tanggalLahir", "jenisKelamin", "agama", "alamat", "desa", "kecamatan", "kabupaten", "provinsi", "nomorHp", "email", "kelasId", "tahunMasuk"],
    "OrangTua": ["id", "namaAyah", "statusAyah", "tempatLahirAyah", "tanggalLahirAyah", "alamatAyah", "agamaAyah", "pendidikanAyah", "pekerjaanAyah", "noHpAyah", "namaIbu", "statusIbu", "tempatLahirIbu", "tanggalLahirIbu", "alamatIbu", "agamaIbu", "pendidikanIbu", "pekerjaanIbu", "noHpIbu", "wali", "statusWali", "tempatLahirWali", "tanggalLahirWali", "alamatWali", "agamaWali", "pendidikanWali", "pekerjaanWali", "noHpWali", "penghasilan", "pendidikanOrangTua"],
    "Akademik": ["id", "semester", "rataRataRaport", "catatanWaliKelas"],
    "Kesehatan": ["id", "tinggiBadan", "beratBadan", "golonganDarah", "penyakit", "alergi", "disabilitas"],
    "Ekonomi": ["id", "statusRumah", "penghasilan", "kendaraan", "pip", "pkh", "kip"],
    "Psikologi": ["id", "minat", "bakat", "hobi", "gayaBelajar", "citaCita", "kepribadian"],
    "Sosial": ["id", "hubunganTeman", "organisasi", "masalahSosial"],
    "Prestasi": ["id", "siswaId", "namaPrestasi", "tingkat", "tahun", "juara", "sertifikat", "kategori"],
    "Pelanggaran": ["id", "siswaId", "tanggal", "jenisPelanggaran", "kategori", "poin", "guruPelapor", "tindakLanjut", "status"],
    "RemisiPoin": ["id", "siswaId", "tanggal", "jenisRemisi", "kategori", "poin", "guruPemberi", "keterangan"],
    "Konseling": ["id", "nomorKonseling", "siswaId", "tanggal", "jenis", "guruBkId", "permasalahan", "analisis", "solusi", "hasil", "tindakLanjut"],
    "Asesmen": ["id", "siswaId", "akpd", "dcm", "aum", "iq", "bakat", "minat"],
    "HomeVisit": ["id", "siswaId", "tanggal", "tujuan", "hasil", "dokumentasi"],
    "Surat": ["id", "siswaId", "nomorSurat", "tanggal", "jenisSurat", "perihal", "isiSurat"],
    "Dokumen": ["id", "siswaId", "jenisDokumen", "namaFile", "fileData", "tanggalUpload"],
    "Catatan_Perkembangan": ["id", "siswaId", "tanggal", "catatan", "rekomendasi", "guruBkId", "namaGuru", "roleGuru", "kategori"],
    "Pengaduan_Siswa": ["id", "siswaId", "namaSiswa", "nis", "kelas", "tanggalKejadian", "tanggalPengaduan", "judulPengaduan", "kategori", "kronologis", "buktiFoto", "namaFoto", "status", "tanggapanBk", "tanggalTanggapan", "petugasBk"],
    "Kehadiran": ["id", "siswaId", "mingguKe", "bulan", "tahun", "hadir", "sakit", "izin", "alfa", "keterangan"],
    "LaporanKejadian": ["id", "tanggal", "pelaporId", "namaPelapor", "kelasId", "ringkasan", "detail", "status"],
    "TahunPelajaran": ["id", "tahun", "semester", "isActive"],
    "Kelas": ["id", "namaKelas", "waliKelasId"],
    "LogAktivitas": ["id", "timestamp", "userId", "namaUser", "role", "aktivitas", "detail"]
  };

  // Ambil seluruh sheet sekali saja untuk optimasi performa tinggi (menghindari puluhan API call eksternal)
  const sheets = db.getSheets();
  const existingSheetNames = {};
  sheets.forEach(function(s) {
    existingSheetNames[s.getName().toString().trim()] = s;
  });

  // Pastikan seluruh sheet ada (Auto-heal / Auto-provision jika ada sheet yang kurang)
  // Menggunakan pencarian berbasis objek lokal yang sangat cepat!
  for (var sheetName in schema) {
    var s = existingSheetNames[sheetName];
    if (!s) {
      try {
        s = db.insertSheet(sheetName);
        existingSheetNames[sheetName] = s;
        sheets.push(s); // Tambahkan ke array agar ikut diproses di bawah
        var headers = schema[sheetName];
        s.getRange(1, 1, 1, headers.length).setValues([headers]);
        s.getRange(1, 1, 1, headers.length).setFontWeight("bold").setBackground("#e2e8f0");
        try {
          s.autoResizeColumns(1, headers.length);
        } catch(e) {}
      } catch (err) {
        Logger.log("Gagal auto-provision sheet '" + sheetName + "': " + err.toString());
      }
    } else {
      // Pastikan header ada dan valid
      var lastRow = s.getLastRow();
      if (lastRow === 0) {
        var headers = schema[sheetName];
        s.getRange(1, 1, 1, headers.length).setValues([headers]);
        s.getRange(1, 1, 1, headers.length).setFontWeight("bold").setBackground("#e2e8f0");
      }
    }
  }

  // Hapus sheet bawaan "Sheet1" jika ada dan kosong untuk merapikan
  try {
    var defaultSheet = existingSheetNames["Sheet1"];
    if (defaultSheet && defaultSheet.getLastRow() === 0 && defaultSheet.getLastColumn() === 0) {
      db.deleteSheet(defaultSheet);
      var idx = sheets.indexOf(defaultSheet);
      if (idx !== -1) sheets.splice(idx, 1);
    }
  } catch (e) {}

  const result = {};
  
  const sheetNameToKeyMap = {
    "Users": "users",
    "Siswa": "siswa",
    "OrangTua": "orangTua",
    "Akademik": "akademik",
    "Kesehatan": "kesehatan",
    "Ekonomi": "ekonomi",
    "Psikologi": "psikologi",
    "Sosial": "sosial",
    "Prestasi": "prestasi",
    "Pelanggaran": "pelanggaran",
    "RemisiPoin": "remisiPoin",
    "Konseling": "konseling",
    "Asesmen": "asesmen",
    "HomeVisit": "homeVisit",
    "Surat": "surat",
    "Dokumen": "dokumen",
    "Catatan_Perkembangan": "catatanPerkembangan",
    "CatatanPerkembangan": "catatanPerkembangan",
    "Pengaduan_Siswa": "pengaduanSiswa",
    "PengaduanSiswa": "pengaduanSiswa",
    "Pengaduan": "pengaduanSiswa",
    "Kehadiran": "kehadiran",
    "LaporanKejadian": "laporanKejadian",
    "TahunPelajaran": "tahunPelajaran",
    "Kelas": "kelas",
    "LogAktivitas": "logAktivitas"
  };

  sheets.forEach(function(sheet) {
    const rawName = sheet.getName().toString().trim();
    let stateKey = rawName.charAt(0).toLowerCase() + rawName.slice(1); // fallback
    
    for (var originalName in sheetNameToKeyMap) {
      if (originalName.toLowerCase() === rawName.toLowerCase()) {
        stateKey = sheetNameToKeyMap[originalName];
        break;
      }
    }
    
    result[stateKey] = getSheetDataAsJson(sheet);
  });
  
  return result;
}

function normalizeHeaderKey(header, standardHeaders) {
  if (!header) return "";
  var cleanHeader = header.toString().toLowerCase().trim().replace(/[\s_\-\.]/g, "");
  
  // Direct match against standard headers
  for (var i = 0; i < standardHeaders.length; i++) {
    var std = standardHeaders[i];
    var cleanStd = std.toLowerCase().replace(/[\s_\-\.]/g, "");
    if (cleanHeader === cleanStd) {
      return std;
    }
  }
  
  // Comprehensive aliases mapping for human input and common typos (e.g. siswald, siswaid, etc.)
  if (cleanHeader === "id" || cleanHeader === "kode" || cleanHeader === "nomor" || cleanHeader === "key") return "id";
  if (cleanHeader === "siswald" || cleanHeader === "siswaid" || cleanHeader === "idsiswa" || cleanHeader === "id_siswa" || cleanHeader === "siswa_id" || cleanHeader === "kodesiswa" || cleanHeader === "nissiswa") {
    for (var j = 0; j < standardHeaders.length; j++) {
      if (standardHeaders[j] === "siswaId") return "siswaId";
      if (standardHeaders[j] === "id") return "id";
    }
    return "siswaId";
  }
  if (cleanHeader === "nama" || cleanHeader === "namasiswa" || cleanHeader === "namalengkap") return "nama";
  if (cleanHeader === "nis" || cleanHeader === "nomorinduksiswa") return "nis";
  if (cleanHeader === "nisn" || cleanHeader === "nomorinduksiswanasional") return "nisn";
  if (cleanHeader === "kelas" || cleanHeader === "kelasid" || cleanHeader === "namakelas" || cleanHeader === "rombel") return "kelasId";
  if (cleanHeader === "namaprestasi" || cleanHeader === "prestasi" || cleanHeader === "judulprestasi" || cleanHeader === "kegiatan" || cleanHeader === "lomba") return "namaPrestasi";
  if (cleanHeader === "tingkat" || cleanHeader === "level" || cleanHeader === "jenjang") return "tingkat";
  if (cleanHeader === "tahun" || cleanHeader === "tahunprestasi" || cleanHeader === "periode") return "tahun";
  if (cleanHeader === "juara" || cleanHeader === "peringkat" || cleanHeader === "hasil" || cleanHeader === "posisi") return "juara";
  if (cleanHeader === "sertifikat" || cleanHeader === "piagam" || cleanHeader === "buktisertifikat" || cleanHeader === "url_sertifikat") return "sertifikat";
  if (cleanHeader === "kategori" || cleanHeader === "bidang" || cleanHeader === "jenis" || cleanHeader === "tipe") return "kategori";
  if (cleanHeader === "jenispelanggaran" || cleanHeader === "pelanggaran" || cleanHeader === "bentukpelanggaran" || cleanHeader === "kasus") return "jenisPelanggaran";
  if (cleanHeader === "poin" || cleanHeader === "bobotpoin" || cleanHeader === "skor" || cleanHeader === "bobot") return "poin";
  if (cleanHeader === "gurupelapor" || cleanHeader === "pelapor" || cleanHeader === "namapelapor") return "guruPelapor";
  if (cleanHeader === "tindaklanjut" || cleanHeader === "penanganan" || cleanHeader === "solusi") return "tindakLanjut";
  if (cleanHeader === "status" || cleanHeader === "statuspenanganan" || cleanHeader === "keadaan") return "status";
  if (cleanHeader === "gender" || cleanHeader === "jeniskelamin" || cleanHeader === "jk") return "jenisKelamin";
  if (cleanHeader === "nohp" || cleanHeader === "nomorhp" || cleanHeader === "telepon" || cleanHeader === "notelepon" || cleanHeader === "kontak") return "nomorHp";
  if (cleanHeader === "alamat" || cleanHeader === "alamatrumah" || cleanHeader === "domisili") return "alamat";
  if (cleanHeader === "foto" || cleanHeader === "urlfoto" || cleanHeader === "pasfoto" || cleanHeader === "linkfoto") return "foto";
  if (cleanHeader === "tahunmasuk") return "tahunMasuk";
  if (cleanHeader === "tempatlahir") return "tempatLahir";
  if (cleanHeader === "tanggallahir") return "tanggalLahir";
  if (cleanHeader === "agama") return "agama";
  if (cleanHeader === "desa" || cleanHeader === "kelurahan") return "desa";
  if (cleanHeader === "kecamatan") return "kecamatan";
  if (cleanHeader === "kabupaten" || cleanHeader === "kota") return "kabupaten";
  if (cleanHeader === "provinsi") return "provinsi";
  if (cleanHeader === "email" || cleanHeader === "surel") return "email";
  if (cleanHeader === "jenisremis" || cleanHeader === "jenisremisi" || cleanHeader === "remisi") return "jenisRemisi";
  if (cleanHeader === "gurupember" || cleanHeader === "gurupemberi") return "guruPemberi";
  if (cleanHeader === "nomorkonseling" || cleanHeader === "nokonseling") return "nomorKonseling";
  if (cleanHeader === "permasalahan" || cleanHeader === "masalah") return "permasalahan";
  if (cleanHeader === "catatan" || cleanHeader === "catatanperkembangan") return "catatan";
  if (cleanHeader === "rekomendasi") return "rekomendasi";
  if (cleanHeader === "mingguke") return "mingguKe";
  if (cleanHeader === "bulan") return "bulan";
  if (cleanHeader === "hadir") return "hadir";
  if (cleanHeader === "sakit") return "sakit";
  if (cleanHeader === "izin") return "izin";
  if (cleanHeader === "alfa" || cleanHeader === "alpha") return "alfa";
  
  return header;
}

function getSheetDataAsJson(sheet) {
  const data = sheet.getDataRange().getValues();
  if (data.length <= 1) return [];
  
  const headers = data[0];
  const sheetName = sheet.getName();
  
  const schema = {
    "Users": ["id", "username", "nama", "role", "email", "isActive"],
    "Siswa": ["id", "nis", "nisn", "nama", "foto", "tempatLahir", "tanggalLahir", "jenisKelamin", "agama", "alamat", "desa", "kecamatan", "kabupaten", "provinsi", "nomorHp", "email", "kelasId", "tahunMasuk"],
    "OrangTua": ["id", "namaAyah", "statusAyah", "tempatLahirAyah", "tanggalLahirAyah", "alamatAyah", "agamaAyah", "pendidikanAyah", "pekerjaanAyah", "noHpAyah", "namaIbu", "statusIbu", "tempatLahirIbu", "tanggalLahirIbu", "alamatIbu", "agamaIbu", "pendidikanIbu", "pekerjaanIbu", "noHpIbu", "wali", "statusWali", "tempatLahirWali", "tanggalLahirWali", "alamatWali", "agamaWali", "pendidikanWali", "pekerjaanWali", "noHpWali", "penghasilan", "pendidikanOrangTua"],
    "Akademik": ["id", "semester", "rataRataRaport", "catatanWaliKelas"],
    "Kesehatan": ["id", "tinggiBadan", "beratBadan", "golonganDarah", "penyakit", "alergi", "disabilitas"],
    "Ekonomi": ["id", "statusRumah", "penghasilan", "kendaraan", "pip", "pkh", "kip"],
    "Psikologi": ["id", "minat", "bakat", "hobi", "gayaBelajar", "citaCita", "kepribadian"],
    "Sosial": ["id", "hubunganTeman", "organisasi", "masalahSosial"],
    "Prestasi": ["id", "siswaId", "namaPrestasi", "tingkat", "tahun", "juara", "sertifikat", "kategori"],
    "Pelanggaran": ["id", "siswaId", "tanggal", "jenisPelanggaran", "kategori", "poin", "guruPelapor", "tindakLanjut", "status"],
    "RemisiPoin": ["id", "siswaId", "tanggal", "jenisRemisi", "kategori", "poin", "guruPemberi", "keterangan"],
    "Konseling": ["id", "nomorKonseling", "siswaId", "tanggal", "jenis", "guruBkId", "permasalahan", "analisis", "solusi", "hasil", "tindakLanjut"],
    "Asesmen": ["id", "siswaId", "akpd", "dcm", "aum", "iq", "bakat", "minat"],
    "HomeVisit": ["id", "siswaId", "tanggal", "tujuan", "hasil", "dokumentasi"],
    "Surat": ["id", "siswaId", "nomorSurat", "tanggal", "jenisSurat", "perihal", "isiSurat"],
    "Dokumen": ["id", "siswaId", "jenisDokumen", "namaFile", "fileData", "tanggalUpload"],
    "Catatan_Perkembangan": ["id", "siswaId", "tanggal", "catatan", "rekomendasi", "guruBkId", "namaGuru", "roleGuru", "kategori"],
    "CatatanPerkembangan": ["id", "siswaId", "tanggal", "catatan", "rekomendasi", "guruBkId", "namaGuru", "roleGuru", "kategori"],
    "Pengaduan_Siswa": ["id", "siswaId", "namaSiswa", "nis", "kelas", "tanggalKejadian", "tanggalPengaduan", "judulPengaduan", "kategori", "kronologis", "buktiFoto", "namaFoto", "status", "tanggapanBk", "tanggalTanggapan", "petugasBk"],
    "Kehadiran": ["id", "siswaId", "mingguKe", "bulan", "tahun", "hadir", "sakit", "izin", "alfa", "keterangan"],
    "LaporanKejadian": ["id", "tanggal", "pelaporId", "namaPelapor", "kelasId", "ringkasan", "detail", "status"],
    "TahunPelajaran": ["id", "tahun", "semester", "isActive"],
    "Kelas": ["id", "namaKelas", "waliKelasId"],
    "LogAktivitas": ["id", "timestamp", "userId", "namaUser", "role", "aktivitas", "detail"]
  };
  
  const standardHeaders = schema[sheetName] || [];
  const mappedHeaders = headers.map(function(h) {
    return normalizeHeaderKey(h, standardHeaders);
  });
  
  const jsonArray = [];
  const cleanSheetName = sheetName.toLowerCase().replace(/[^a-z0-9]/g, '');
  
  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    const obj = {};
    let hasAnyValue = false;
    
    mappedHeaders.forEach(function(header, idx) {
      if (header) {
        let val = row[idx];
        if (val !== undefined && val !== null && String(val).trim() !== "") {
          hasAnyValue = true;
        }
        if (val instanceof Date) {
          val = val.toISOString().split('T')[0];
        } else if (val === "true") {
          val = true;
        } else if (val === "false") {
          val = false;
        }
        obj[header] = val;
      }
    });
    
    // Skip completely empty rows
    if (!hasAnyValue) continue;

    // Filter CatatanPerkembangan / Catatan_Perkembangan: if ID is empty or catatan is blank, treat as deleted/invalid
    if (cleanSheetName === "catatanperkembangan") {
      const cleanId = String(obj.id || "").trim();
      const cleanCatatan = String(obj.catatan || "").trim();
      if (!cleanId || !cleanCatatan) {
        continue;
      }
    }
    
    // Normalize siswaId if aliased in row
    if (!obj.siswaId && (obj.siswald || obj.idSiswa || obj.siswa_id || obj.id_siswa)) {
      obj.siswaId = obj.siswald || obj.idSiswa || obj.siswa_id || obj.id_siswa;
    }

    // Auto-heal missing ID across ALL sheets to prevent dropping rows or sync mismatches
    if (!obj.id || obj.id.toString().trim() === "") {
      var prefix = "item";
      if (sheetName === "Siswa") {
        var cleanNis = (obj.nis || "").toString().trim();
        var cleanNisn = (obj.nisn || "").toString().trim();
        var cleanNama = (obj.nama || "").toString().trim().toLowerCase().replace(/[^a-z0-9]/g, "");
        if (cleanNis) obj.id = "sis-nis-" + cleanNis;
        else if (cleanNisn) obj.id = "sis-nisn-" + cleanNisn;
        else if (cleanNama) obj.id = "sis-name-" + cleanNama;
        else obj.id = "sis-row-" + i;
      } else {
        if (sheetName === "Prestasi") prefix = "pres";
        else if (sheetName === "Pelanggaran") prefix = "pel";
        else if (sheetName === "RemisiPoin") prefix = "rem";
        else if (sheetName === "Konseling") prefix = "kon";
        else if (sheetName === "Asesmen") prefix = "ase";
        else if (sheetName === "HomeVisit") prefix = "hv";
        else if (sheetName === "Surat") prefix = "sur";
        else if (sheetName === "Dokumen") prefix = "dok";
        else if (sheetName === "Catatan_Perkembangan" || sheetName === "CatatanPerkembangan") prefix = "cp";
        else if (sheetName === "Pengaduan_Siswa" || sheetName === "PengaduanSiswa") prefix = "peng";
        else if (sheetName === "Kehadiran") prefix = "keh";
        else if (sheetName === "LaporanKejadian") prefix = "lap";
        else if (["OrangTua", "Akademik", "Kesehatan", "Ekonomi", "Psikologi", "Sosial"].indexOf(sheetName) !== -1) {
          prefix = "sis";
        }

        var sRef = (obj.siswaId || obj.idSiswa || obj.nis || "").toString().trim().replace(/[^a-zA-Z0-9]/g, "");
        obj.id = prefix + "-" + (sRef ? sRef + "-" : "") + i;
      }

      // Persist the missing ID right back to the spreadsheet row cell if header exists
      try {
        var idColIdx = mappedHeaders.indexOf("id");
        if (idColIdx !== -1) {
          sheet.getRange(i + 1, idColIdx + 1).setValue(obj.id);
        }
      } catch (err) {
        Logger.log("Gagal auto-heal ID di baris " + (i + 1) + ": " + err.toString());
      }
    }
    
    jsonArray.push(obj);
  }
  
  return jsonArray;
}

// Universal Entity Save Row Handler
function saveRowEntity(db, sheetName, entity, isNew) {
  if (!entity || typeof entity !== "object") return;
  db = db || getDatabaseSheets();
  let sheet = db.getSheetByName(sheetName);
  
  // Check common aliases
  if (!sheet) {
    if (sheetName === "Pengaduan_Siswa") sheet = db.getSheetByName("PengaduanSiswa") || db.getSheetByName("Pengaduan");
    if (sheetName === "Catatan_Perkembangan") sheet = db.getSheetByName("CatatanPerkembangan");
    if (sheetName === "LaporanKejadian") sheet = db.getSheetByName("Laporan_Kejadian");
  }

  const schema = {
    "Users": ["id", "username", "nama", "role", "email", "isActive"],
    "Siswa": ["id", "nis", "nisn", "nama", "foto", "tempatLahir", "tanggalLahir", "jenisKelamin", "agama", "alamat", "desa", "kecamatan", "kabupaten", "provinsi", "nomorHp", "email", "kelasId", "tahunMasuk"],
    "OrangTua": ["id", "namaAyah", "statusAyah", "tempatLahirAyah", "tanggalLahirAyah", "alamatAyah", "agamaAyah", "pendidikanAyah", "pekerjaanAyah", "noHpAyah", "namaIbu", "statusIbu", "tempatLahirIbu", "tanggalLahirIbu", "alamatIbu", "agamaIbu", "pendidikanIbu", "pekerjaanIbu", "noHpIbu", "wali", "statusWali", "tempatLahirWali", "tanggalLahirWali", "alamatWali", "agamaWali", "pendidikanWali", "pekerjaanWali", "noHpWali", "penghasilan", "pendidikanOrangTua"],
    "Akademik": ["id", "semester", "rataRataRaport", "catatanWaliKelas"],
    "Kesehatan": ["id", "tinggiBadan", "beratBadan", "golonganDarah", "penyakit", "alergi", "disabilitas"],
    "Ekonomi": ["id", "statusRumah", "penghasilan", "kendaraan", "pip", "pkh", "kip"],
    "Psikologi": ["id", "minat", "bakat", "hobi", "gayaBelajar", "citaCita", "kepribadian"],
    "Sosial": ["id", "hubunganTeman", "organisasi", "masalahSosial"],
    "Prestasi": ["id", "siswaId", "namaPrestasi", "tingkat", "tahun", "juara", "sertifikat", "kategori"],
    "Pelanggaran": ["id", "siswaId", "tanggal", "jenisPelanggaran", "kategori", "poin", "guruPelapor", "tindakLanjut", "status"],
    "RemisiPoin": ["id", "siswaId", "tanggal", "jenisRemisi", "kategori", "poin", "guruPemberi", "keterangan"],
    "Konseling": ["id", "nomorKonseling", "siswaId", "tanggal", "jenis", "guruBkId", "permasalahan", "analisis", "solusi", "hasil", "tindakLanjut"],
    "Asesmen": ["id", "siswaId", "akpd", "dcm", "aum", "iq", "bakat", "minat"],
    "HomeVisit": ["id", "siswaId", "tanggal", "tujuan", "hasil", "dokumentasi"],
    "Surat": ["id", "siswaId", "nomorSurat", "tanggal", "jenisSurat", "perihal", "isiSurat"],
    "Dokumen": ["id", "siswaId", "jenisDokumen", "namaFile", "fileData", "tanggalUpload"],
    "Catatan_Perkembangan": ["id", "siswaId", "tanggal", "catatan", "rekomendasi", "guruBkId", "namaGuru", "roleGuru", "kategori"],
    "CatatanPerkembangan": ["id", "siswaId", "tanggal", "catatan", "rekomendasi", "guruBkId", "namaGuru", "roleGuru", "kategori"],
    "Pengaduan_Siswa": ["id", "siswaId", "namaSiswa", "nis", "kelas", "tanggalKejadian", "tanggalPengaduan", "judulPengaduan", "kategori", "kronologis", "buktiFoto", "namaFoto", "status", "tanggapanBk", "tanggalTanggapan", "petugasBk"],
    "Kehadiran": ["id", "siswaId", "mingguKe", "bulan", "tahun", "hadir", "sakit", "izin", "alfa", "keterangan"],
    "LaporanKejadian": ["id", "tanggal", "pelaporId", "namaPelapor", "kelasId", "ringkasan", "detail", "status"],
    "TahunPelajaran": ["id", "tahun", "semester", "isActive"],
    "Kelas": ["id", "namaKelas", "waliKelasId"],
    "LogAktivitas": ["id", "timestamp", "userId", "namaUser", "role", "aktivitas", "detail"]
  };

  // AUTO CREATE SHEET ON THE FLY IF IT DOES NOT EXIST
  if (!sheet) {
    try {
      sheet = db.insertSheet(sheetName);
      const defaultHeaders = schema[sheetName] || (entity ? Object.keys(entity) : ["id"]);
      sheet.getRange(1, 1, 1, defaultHeaders.length).setValues([defaultHeaders]);
      sheet.getRange(1, 1, 1, defaultHeaders.length).setFontWeight("bold").setBackground("#e2e8f0");
    } catch (e) {
      sheet = db.getSheetByName(sheetName);
      if (!sheet) throw new Error("Gagal membuat/menemukan Sheet '" + sheetName + "': " + e.toString());
    }
  }
  
  const headers = sheet.getDataRange().getValues()[0] || [];
  const standardHeaders = schema[sheetName] || [];
  const mappedHeaders = headers.map(function(h) {
    return normalizeHeaderKey(h, standardHeaders);
  });
  
  let rowIndex = -1;
  if (!isNew && entity.id) {
    // Edit Row - first search for existing row
    const dataRange = sheet.getDataRange();
    const values = dataRange.getValues();
    
    for (let i = 1; i < values.length; i++) {
      if (values[i][0] == entity.id) {
        rowIndex = i + 1; // 1-indexed and skip header
        break;
      }
    }
    
    // Safety fallback for Siswa sheet: If ID not found, check by NIS / NISN / Nama to prevent duplicate rows
    if (rowIndex === -1 && sheetName === "Siswa") {
      const nisColIdx = mappedHeaders.indexOf("nis");
      const nisnColIdx = mappedHeaders.indexOf("nisn");
      const namaColIdx = mappedHeaders.indexOf("nama");
      
      for (let i = 1; i < values.length; i++) {
        const rowNIS = values[i][nisColIdx];
        const rowNISN = values[i][nisnColIdx];
        const rowNama = values[i][namaColIdx];
        
        if (
          (entity.nis && rowNIS == entity.nis) ||
          (entity.nisn && rowNISN == entity.nisn) ||
          (entity.nama && rowNama && rowNama.toString().toLowerCase().trim() === entity.nama.toString().toLowerCase().trim())
        ) {
          rowIndex = i + 1;
          // Fill in the missing ID in the sheet directly to heal it!
          sheet.getRange(rowIndex, 1).setValue(entity.id);
          break;
        }
      }
    }
  }
  
  if (isNew || rowIndex === -1) {
    // Append Row (either explicitly new, or fallback because ID wasn't found in this sheet yet)
    const newRow = [];
    headers.forEach(function(header, idx) {
      const normKey = mappedHeaders[idx] || header;
      let val = entity[normKey] !== undefined ? entity[normKey] : (entity[header] !== undefined ? entity[header] : "");
      if (typeof val === 'string' && val.length > 45000) {
        val = val.substring(0, 45000) + "... (truncated)";
      }
      newRow.push(val);
    });
    sheet.appendRow(newRow);
  } else {
    // Edit Row
    headers.forEach(function(header, colIdx) {
      const normKey = mappedHeaders[colIdx] || header;
      const val = entity[normKey] !== undefined ? entity[normKey] : entity[header];
      if (val !== undefined) {
        let cleanVal = val;
        if (typeof cleanVal === 'string' && cleanVal.length > 45000) {
          cleanVal = cleanVal.substring(0, 45000) + "... (truncated)";
        }
        sheet.getRange(rowIndex, colIdx + 1).setValue(cleanVal);
      }
    });
  }
}

function findSheetFlexible(db, sheetName) {
  if (!db || !sheetName) return null;
  let sheet = db.getSheetByName(sheetName);
  if (sheet) return sheet;
  
  const cleanTarget = sheetName.toLowerCase().replace(/[^a-z0-9]/g, '');
  const allSheets = db.getSheets();
  for (let i = 0; i < allSheets.length; i++) {
    const sName = allSheets[i].getName();
    const cleanS = sName.toLowerCase().replace(/[^a-z0-9]/g, '');
    if (cleanS === cleanTarget) {
      return allSheets[i];
    }
  }
  return null;
}

function saveEntity(db, sheetName, entity, isNew) {
  db = db || getDatabaseSheets();
  try {
    saveRowEntity(db, sheetName, entity, isNew);
    return { success: true, message: sheetName + " berhasil disimpan." };
  } catch (error) {
    return { success: false, message: "Error simpan " + sheetName + ": " + error.toString() };
  }
}

function deleteEntity(db, sheetName, id, extraSearch) {
  db = db || getDatabaseSheets();
  if ((id === undefined || id === null || id === '') && !extraSearch) {
    return { success: false, message: "ID kosong." };
  }
  const sheet = findSheetFlexible(db, sheetName);
  if (!sheet) {
    return { success: false, message: "Sheet '" + sheetName + "' tidak ditemukan." };
  }
  
  const lastRow = sheet.getLastRow();
  if (lastRow <= 1) {
    return { success: true, message: "Data sudah tidak ada di sheet " + sheetName };
  }

  const values = sheet.getDataRange().getValues();
  if (values.length <= 1) {
    return { success: true, message: "Data sudah tidak ada di sheet " + sheetName };
  }

  const headers = values[0];
  let idCol = -1;
  const targetIdStr = id !== undefined && id !== null ? String(id).trim().toLowerCase() : "";

  for (let c = 0; c < headers.length; c++) {
    const h = String(headers[c] || "").trim().toLowerCase();
    if (h === "id" || h === "id_" + sheetName.toLowerCase() || h === sheetName.toLowerCase() + "id") {
      idCol = c;
      break;
    }
  }
  if (idCol === -1) idCol = 0;

  let deletedCount = 0;
  for (let i = values.length - 1; i >= 1; i--) {
    const cellVal = String(values[i][idCol] !== undefined ? values[i][idCol] : "").trim().toLowerCase();
    let isMatch = (targetIdStr !== "" && cellVal === targetIdStr);
    
    // Extra fallback search if ID wasn't matched (e.g. by title, description, or student ID)
    if (!isMatch && extraSearch && typeof extraSearch === 'object') {
      let allMatch = true;
      let checkedFields = 0;
      for (let key in extraSearch) {
        if (!extraSearch[key] || key === 'id') continue;
        const searchKey = String(key).trim().toLowerCase();
        const searchVal = String(extraSearch[key]).trim().toLowerCase();
        let matchCol = -1;
        for (let c = 0; c < headers.length; c++) {
          if (String(headers[c] || "").trim().toLowerCase() === searchKey) {
            matchCol = c;
            break;
          }
        }
        if (matchCol !== -1) {
          checkedFields++;
          const rowVal = String(values[i][matchCol] !== undefined ? values[i][matchCol] : "").trim().toLowerCase();
          if (rowVal !== searchVal) {
            allMatch = false;
            break;
          }
        }
      }
      if (allMatch && checkedFields > 0) {
        isMatch = true;
      }
    }

    if (isMatch) {
      sheet.deleteRow(i + 1);
      deletedCount++;
    }
  }
  
  if (deletedCount > 0) {
    return { success: true, message: sheetName + " berhasil dihapus permanen (" + deletedCount + " baris)." };
  }
  return { success: true, message: "ID tidak ditemukan di sheet " + sheetName + " (sudah terhapus)." };
}

function updatePengaduanStatusRow(db, id, status, tanggapanBk, petugasBk, tanggalTanggapan) {
  db = db || getDatabaseSheets();
  let sheet = db.getSheetByName("Pengaduan_Siswa") || db.getSheetByName("PengaduanSiswa") || db.getSheetByName("Pengaduan");
  if (!sheet) {
    return { success: false, message: "Sheet Pengaduan_Siswa tidak ditemukan." };
  }
  
  const headers = sheet.getDataRange().getValues()[0];
  const statusCol = headers.indexOf("status");
  const tanggapanCol = headers.indexOf("tanggapanBk");
  const petugasCol = headers.indexOf("petugasBk");
  const tanggalCol = headers.indexOf("tanggalTanggapan");
  
  const values = sheet.getDataRange().getValues();
  for (let i = 1; i < values.length; i++) {
    if (values[i][0] == id) {
      const row = i + 1;
      if (statusCol !== -1 && status) sheet.getRange(row, statusCol + 1).setValue(status);
      if (tanggapanCol !== -1 && tanggapanBk !== undefined) sheet.getRange(row, tanggapanCol + 1).setValue(tanggapanBk);
      if (petugasCol !== -1 && petugasBk !== undefined) sheet.getRange(row, petugasCol + 1).setValue(petugasBk);
      if (tanggalCol !== -1 && tanggalTanggapan) sheet.getRange(row, tanggalCol + 1).setValue(tanggalTanggapan);
      return { success: true, message: "Status & Tanggapan pengaduan berhasil diperbarui." };
    }
  }
  return { success: false, message: "Pengaduan tidak ditemukan." };
}

function saveUser(db, user, isNew) {
  db = db || getDatabaseSheets();
  const sheet = db.getSheetByName("Users");
  if (!sheet) return { success: false, message: "Sheet Users tidak ditemukan." };
  
  const data = getSheetDataAsJson(sheet);
  if (isNew && data.some(function(u) { return u.username.toLowerCase() === user.username.toLowerCase(); })) {
    return { success: false, message: "Username sudah terdaftar." };
  }
  
  return saveEntity(db, "Users", user, isNew);
}

function appendLog(db, logPayload) {
  db = db || getDatabaseSheets();
  const sheet = db.getSheetByName("LogAktivitas");

  if (!sheet) return { success: false };
  
  const headers = ["id", "timestamp", "userId", "namaUser", "role", "aktivitas", "detail"];
  const newRow = [
    logPayload.id || ("log-" + Date.now()),
    logPayload.timestamp || new Date().toISOString(),
    logPayload.userId || "system",
    logPayload.namaUser || "Sistem HDS",
    logPayload.role || "System",
    logPayload.aktivitas || "System Event",
    logPayload.detail || "-"
  ];
  
  sheet.appendRow(newRow);
  return { success: true };
}

function uploadFullDatabase(db, payload) {
  db = db || getDatabaseSheets();
  
  if (!payload || typeof payload !== "object") {
    return { success: false, message: "Payload pengunggahan tidak valid atau kosong." };
  }
  
  // Safety guard: if payload has no siswa, or no users, do not overwrite to prevent permanent data loss!
  if (!payload.siswa || !Array.isArray(payload.siswa) || payload.siswa.length === 0) {
    var siswaSheet = db.getSheetByName("Siswa");
    if (siswaSheet && siswaSheet.getLastRow() > 5) { // If there are already >5 students in sheet, abort!
      return { success: false, message: "Sinkronisasi dibatalkan demi keamanan: Payload pengunggahan kosong tetapi Google Sheets memiliki data siswa yang tersimpan." };
    }
  }
  
  const schema = {
    "Users": ["id", "username", "nama", "role", "email", "isActive"],
    "Siswa": ["id", "nis", "nisn", "nama", "foto", "tempatLahir", "tanggalLahir", "jenisKelamin", "agama", "alamat", "desa", "kecamatan", "kabupaten", "provinsi", "nomorHp", "email", "kelasId", "tahunMasuk"],
    "OrangTua": ["id", "namaAyah", "statusAyah", "tempatLahirAyah", "tanggalLahirAyah", "alamatAyah", "agamaAyah", "pendidikanAyah", "pekerjaanAyah", "noHpAyah", "namaIbu", "statusIbu", "tempatLahirIbu", "tanggalLahirIbu", "alamatIbu", "agamaIbu", "pendidikanIbu", "pekerjaanIbu", "noHpIbu", "wali", "statusWali", "tempatLahirWali", "tanggalLahirWali", "alamatWali", "agamaWali", "pendidikanWali", "pekerjaanWali", "noHpWali", "penghasilan", "pendidikanOrangTua"],
    "Akademik": ["id", "semester", "rataRataRaport", "catatanWaliKelas"],
    "Kesehatan": ["id", "tinggiBadan", "beratBadan", "golonganDarah", "penyakit", "alergi", "disabilitas"],
    "Ekonomi": ["id", "statusRumah", "penghasilan", "kendaraan", "pip", "pkh", "kip"],
    "Psikologi": ["id", "minat", "bakat", "hobi", "gayaBelajar", "citaCita", "kepribadian"],
    "Sosial": ["id", "hubunganTeman", "organisasi", "masalahSosial"],
    "Prestasi": ["id", "siswaId", "namaPrestasi", "tingkat", "tahun", "juara", "sertifikat", "kategori"],
    "Pelanggaran": ["id", "siswaId", "tanggal", "jenisPelanggaran", "kategori", "poin", "guruPelapor", "tindakLanjut", "status"],
    "RemisiPoin": ["id", "siswaId", "tanggal", "jenisRemisi", "kategori", "poin", "guruPemberi", "keterangan"],
    "Konseling": ["id", "nomorKonseling", "siswaId", "tanggal", "jenis", "guruBkId", "permasalahan", "analisis", "solusi", "hasil", "tindakLanjut"],
    "Asesmen": ["id", "siswaId", "akpd", "dcm", "aum", "iq", "bakat", "minat"],
    "HomeVisit": ["id", "siswaId", "tanggal", "tujuan", "hasil", "dokumentasi"],
    "Surat": ["id", "siswaId", "nomorSurat", "tanggal", "jenisSurat", "perihal", "isiSurat"],
    "Dokumen": ["id", "siswaId", "jenisDokumen", "namaFile", "fileData", "tanggalUpload"],
    "Catatan_Perkembangan": ["id", "siswaId", "tanggal", "catatan", "rekomendasi", "guruBkId", "namaGuru", "roleGuru", "kategori"],
    "CatatanPerkembangan": ["id", "siswaId", "tanggal", "catatan", "rekomendasi", "guruBkId", "namaGuru", "roleGuru", "kategori"],
    "Pengaduan_Siswa": ["id", "siswaId", "namaSiswa", "nis", "kelas", "tanggalKejadian", "tanggalPengaduan", "judulPengaduan", "kategori", "kronologis", "buktiFoto", "namaFoto", "status", "tanggapanBk", "tanggalTanggapan", "petugasBk"],
    "Kehadiran": ["id", "siswaId", "mingguKe", "bulan", "tahun", "hadir", "sakit", "izin", "alfa", "keterangan"],
    "LaporanKejadian": ["id", "tanggal", "pelaporId", "namaPelapor", "kelasId", "ringkasan", "detail", "status"],
    "TahunPelajaran": ["id", "tahun", "semester", "isActive"],
    "Kelas": ["id", "namaKelas", "waliKelasId"],
    "LogAktivitas": ["id", "timestamp", "userId", "namaUser", "role", "aktivitas", "detail"]
  };

  for (var key in payload) {
    if (key === "config" || key === "action") continue;
    
    // Capitalize first letter to get sheet name
    var sheetName = key.charAt(0).toUpperCase() + key.slice(1);
    
    // Mapping khusus
    if (key === "logAktivitas") sheetName = "LogAktivitas";
    if (key === "pengaduanSiswa") sheetName = "Pengaduan_Siswa";
    if (key === "catatanPerkembangan") sheetName = "Catatan_Perkembangan";
    if (key === "laporanKejadian") sheetName = "LaporanKejadian";
    if (key === "kehadiran") sheetName = "Kehadiran";
    
    if (!schema[sheetName]) continue; // Skip keys that are not part of the schema (like 'action')
    
    var sheet = db.getSheetByName(sheetName);
    
    // Jika sheet tidak ada, buat otomatis
    if (!sheet) {
      try {
        sheet = db.insertSheet(sheetName);
        var headers = schema[sheetName];
        sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
        sheet.getRange(1, 1, 1, headers.length).setFontWeight("bold").setBackground("#e2e8f0");
        try {
          sheet.autoResizeColumns(1, headers.length);
        } catch(e) {}
      } catch (err) {
        Logger.log("Gagal membuat sheet saat upload: " + err.toString());
      }
    }
    
    if (sheet) {
      // Clear all rows below header (using clearContent is thousands of times faster than deleteRows)
      var lastRow = sheet.getLastRow();
      var lastCol = sheet.getLastColumn();
      if (lastRow > 1 && lastCol > 0) {
        sheet.getRange(2, 1, lastRow - 1, lastCol).clearContent();
      } else if (lastRow === 0 || lastCol === 0) {
        // Terapkan headers jika kosong total
        var headers = schema[sheetName];
        sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
        sheet.getRange(1, 1, 1, headers.length).setFontWeight("bold").setBackground("#e2e8f0");
      }
      
      var items = payload[key];
      if (items && items.length > 0) {
        var rawHeaders = sheet.getDataRange().getValues()[0] || [];
        var standardHeaders = schema[sheetName] || rawHeaders;
        var mappedHeaders = rawHeaders.map(function(h) {
          return normalizeHeaderKey(h, standardHeaders);
        });
        
        var rowsToAdd = [];
        items.forEach(function(item) {
          var row = [];
          rawHeaders.forEach(function(header, idx) {
            var normKey = mappedHeaders[idx] || header;
            var val = item[normKey] !== undefined ? item[normKey] : (item[header] !== undefined ? item[header] : "");
            if (typeof val === 'string' && val.length > 45000) {
              val = val.substring(0, 45000) + "... (truncated)";
            }
            row.push(val);
          });
          rowsToAdd.push(row);
        });
        
        if (rowsToAdd.length > 0 && rawHeaders.length > 0) {
          sheet.getRange(2, 1, rowsToAdd.length, rawHeaders.length).setValues(rowsToAdd);
        }
      }
    }
  }
  
  // Hapus sheet bawaan "Sheet1" jika ada dan kosong untuk merapikan
  try {
    var defaultSheet = db.getSheetByName("Sheet1");
    if (defaultSheet && defaultSheet.getLastRow() === 0 && defaultSheet.getLastColumn() === 0) {
      db.deleteSheet(defaultSheet);
    }
  } catch (e) {}
  
  return { success: true, message: "Seluruh data lokal berhasil diunggah dan disinkronkan ke Google Spreadsheet!" };
}

function updatePengaduanStatusRow(db, id, status, tanggapanBk, petugasBk, tanggalTanggapan) {
  db = db || getDatabaseSheets();
  var sheet = db.getSheetByName("Pengaduan_Siswa") || db.getSheetByName("PengaduanSiswa") || db.getSheetByName("Pengaduan");
  if (!sheet) {
    return { success: false, message: "Sheet Pengaduan_Siswa tidak ditemukan." };
  }
  
  var headers = sheet.getDataRange().getValues()[0];
  var idColIdx = headers.indexOf("id");
  var statusColIdx = headers.indexOf("status");
  var tanggapanColIdx = headers.indexOf("tanggapanBk");
  var tanggalColIdx = headers.indexOf("tanggalTanggapan");
  var petugasColIdx = headers.indexOf("petugasBk");
  
  if (idColIdx === -1) {
    return { success: false, message: "Kolom 'id' tidak ditemukan pada sheet Pengaduan_Siswa." };
  }
  
  var data = sheet.getDataRange().getValues();
  for (var i = 1; i < data.length; i++) {
    if (data[i][idColIdx] == id) {
      var rowIndex = i + 1;
      if (statusColIdx !== -1 && status) {
        sheet.getRange(rowIndex, statusColIdx + 1).setValue(status);
      }
      if (tanggapanColIdx !== -1 && tanggapanBk !== undefined) {
        sheet.getRange(rowIndex, tanggapanColIdx + 1).setValue(tanggapanBk);
      }
      if (tanggalColIdx !== -1) {
        sheet.getRange(rowIndex, tanggalColIdx + 1).setValue(tanggalTanggapan || new Date().toISOString().split('T')[0]);
      }
      if (petugasColIdx !== -1 && petugasBk) {
        sheet.getRange(rowIndex, petugasColIdx + 1).setValue(petugasBk);
      }
      return { success: true, message: "Status pengaduan siswa berhasil diperbarui di Google Sheets." };
    }
  }
  
  return { success: false, message: "Data pengaduan siswa dengan ID '" + id + "' tidak ditemukan di Google Sheets." };
}

function updateLaporanKejadianStatusRow(db, id, status) {
  return updateLaporanStatusRow(db, id, status);
}

function updateLaporanStatusRow(db, id, status) {
  db = db || getDatabaseSheets();
  var sheet = db.getSheetByName("LaporanKejadian") || db.getSheetByName("Laporan_Kejadian");
  if (!sheet) {
    return { success: false, message: "Sheet LaporanKejadian tidak ditemukan." };
  }
  
  var headers = sheet.getDataRange().getValues()[0];
  var idColIdx = headers.indexOf("id");
  var statusColIdx = headers.indexOf("status");
  
  if (idColIdx === -1 || statusColIdx === -1) {
    return { success: false, message: "Kolom 'id' atau 'status' tidak ditemukan." };
  }
  
  var data = sheet.getDataRange().getValues();
  for (var i = 1; i < data.length; i++) {
    if (data[i][idColIdx] == id) {
      var rowIndex = i + 1;
      sheet.getRange(rowIndex, statusColIdx + 1).setValue(status);
      return { success: true, message: "Status laporan kejadian berhasil diperbarui di Google Sheets." };
    }
  }
  
  return { success: false, message: "Data laporan kejadian tidak ditemukan di Google Sheets." };
}

// ==========================================
// BAGIAN: Siswa.gs
// ==========================================
function saveSiswaPackage(db, payload) {
  db = db || getDatabaseSheets();
  if (!payload) {
    Logger.log("Peringatan: Fungsi saveSiswaPackage dijalankan tanpa parameter payload. Jika Anda menjalankan fungsi ini secara manual di editor Apps Script untuk memberikan izin akses (otorisasi), hal ini wajar dan sukses!");
    return { success: false, message: "Payload kosong. Fungsi ini seharusnya dipanggil dari aplikasi web." };
  }
  const siswa = payload.siswa;

  const orangTua = payload.orangTua;
  const kesehatan = payload.kesehatan;
  const ekonomi = payload.ekonomi;
  const psikologi = payload.psikologi;
  const sosial = payload.sosial;
  const akademik = payload.akademik;
  const isNew = payload.isNew;

  try {
    if (!siswa) {
      throw new Error("Data siswa tidak ditemukan dalam payload.");
    }
    saveRowEntity(db, "Siswa", siswa, isNew);
    saveRowEntity(db, "OrangTua", orangTua, isNew);
    saveRowEntity(db, "Kesehatan", kesehatan, isNew);
    saveRowEntity(db, "Ekonomi", ekonomi, isNew);
    saveRowEntity(db, "Psikologi", psikologi, isNew);
    saveRowEntity(db, "Sosial", sosial, isNew);
    saveRowEntity(db, "Akademik", akademik, isNew);
    
    return { success: true, message: "Paket Data Siswa berhasil disimpan secara utuh." };
  } catch (e) {
    return { success: false, message: "Kesalahan transaksi siswa: " + e.toString() };
  }
}

function deleteSiswaPackage(db, siswaId) {
  db = db || getDatabaseSheets();
  if (siswaId === undefined || siswaId === null || siswaId === '') {
    Logger.log("Peringatan: Fungsi deleteSiswaPackage dijalankan tanpa parameter siswaId.");
    return { success: false, message: "siswaId kosong." };
  }
  
  const targetIdStr = String(siswaId).trim().toLowerCase();

  // 1. Sheets where primary key is the student ID (id)
  const primaryIdSheets = ["Siswa", "OrangTua", "Kesehatan", "Ekonomi", "Psikologi", "Sosial", "Akademik"];
  
  // 2. Child/Relational sheets where the foreign key is siswaId (or pelaporId/id)
  const relatedSheets = [
    "Prestasi", 
    "Pelanggaran", 
    "RemisiPoin", 
    "Konseling", 
    "Asesmen", 
    "HomeVisit", 
    "Surat", 
    "Dokumen", 
    "Catatan_Perkembangan", 
    "Pengaduan_Siswa", 
    "Kehadiran", 
    "LaporanKejadian"
  ];
  
  let deletedCount = 0;
  
  // 1. Delete from primary sheets
  primaryIdSheets.forEach(function(sheetName) {
    const sheet = findSheetFlexible(db, sheetName);
    if (sheet && sheet.getLastRow() > 1) {
      const values = sheet.getDataRange().getValues();
      const headers = values[0];
      let idCol = 0;
      for (let c = 0; c < headers.length; c++) {
        if (String(headers[c] || "").trim().toLowerCase() === "id") {
          idCol = c;
          break;
        }
      }
      for (let i = values.length - 1; i >= 1; i--) {
        const val = String(values[i][idCol] !== undefined ? values[i][idCol] : "").trim().toLowerCase();
        if (val === targetIdStr) {
          sheet.deleteRow(i + 1);
          deletedCount++;
        }
      }
    }
  });
  
  // 2. Delete from related/child sheets
  relatedSheets.forEach(function(sheetName) {
    const sheet = findSheetFlexible(db, sheetName);
    if (sheet && sheet.getLastRow() > 1) {
      const values = sheet.getDataRange().getValues();
      const headers = values[0];
      let sCol = -1;
      
      for (let c = 0; c < headers.length; c++) {
        const h = String(headers[c] || "").trim().toLowerCase();
        if (h === "siswaid" || h === "siswa_id" || h === "id_siswa" || h === "pelaporid" || h === "idsiswa") {
          sCol = c;
          break;
        }
      }
      if (sCol === -1) {
        sCol = values[0].length > 1 ? 1 : 0;
      }
      
      for (let i = values.length - 1; i >= 1; i--) {
        const val = String(values[i][sCol] !== undefined ? values[i][sCol] : "").trim().toLowerCase();
        if (val === targetIdStr) {
          sheet.deleteRow(i + 1);
          deletedCount++;
        }
      }
    }
  });
  
  return { 
    success: true, 
    message: "Siswa dan seluruh rekam data terkait berhasil dihapus permanen di Google Sheets (" + deletedCount + " baris)." 
  };
}

// ==========================================
// BAGIAN: Prestasi.gs
// ==========================================
function getStudentAchievements(db, studentId) {
  db = db || getDatabaseSheets();
  const sheet = db.getSheetByName("Prestasi");
  if (!sheet) return [];
  
  const data = getSheetDataAsJson(sheet);
  return data.filter(function(item) {
    return item.siswaId === studentId;
  });
}

// ==========================================
// BAGIAN: Pelanggaran.gs
// ==========================================
function getStudentTotalPoints(db, studentId) {
  db = db || getDatabaseSheets();
  const sheet = db.getSheetByName("Pelanggaran");
  if (!sheet) return 0;
  
  const data = getSheetDataAsJson(sheet);
  let total = 0;
  
  data.forEach(function(item) {
    if (item.siswaId === studentId) {
      total += parseInt(item.poin || 0);
    }
  });
  
  return total;
}

// ==========================================
// BAGIAN: Konseling.gs
// ==========================================
// Inherits from universal saveEntity and deleteEntity helper functions.
// Adds custom reporting or validation queries specific to Counseling if required.
function fetchCounselingByStudent(db, studentId) {
  db = db || getDatabaseSheets();
  const sheet = db.getSheetByName("Konseling");
  if (!sheet) return [];
  const data = getSheetDataAsJson(sheet);
  return data.filter(function(item) {
    return item.siswaId === studentId;
  });
}

// ==========================================
// BAGIAN: Validation.gs
// ==========================================
function sanitizeString(str) {
  if (typeof str !== 'string') return str;
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function validateSiswa(siswa) {
  if (!siswa.nis || siswa.nis.toString().trim() === "") {
    return "NIS wajib diisi.";
  }
  if (!siswa.nama || siswa.nama.toString().trim() === "") {
    return "Nama siswa wajib diisi.";
  }
  return null;
}

// ==========================================
// BAGIAN: Auth.gs
// ==========================================
function simulateLogin(db, username) {
  db = db || getDatabaseSheets();
  if (!username) {

    return { success: false, message: "Username wajib diisi." };
  }
  
  const sheet = db.getSheetByName("Users");
  if (!sheet) {
    return { success: false, message: "Sheet Users tidak ditemukan." };
  }
  
  const data = getSheetDataAsJson(sheet);
  const user = data.find(function(u) {
    return u.username.toString().toLowerCase() === username.toString().toLowerCase() && u.isActive === "true";
  });
  
  if (user) {
    appendLog(db, {
      userId: user.id,
      namaUser: user.nama,
      role: user.role,
      aktivitas: "Login (Cloud)",
      detail: "Berhasil masuk ke dalam sistem menggunakan otentikasi Google Sheets."
    });
    return { success: true, user: user };
  }
  
  return { success: false, message: "Username tidak terdaftar atau tidak aktif." };
}