/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * SISTEM HIMPUNAN DATA SISWA (HDS) BIMBINGAN DAN KONSELING
 * Google Apps Script - Spreadsheet ORM & Utility Helpers (Helper.gs)
 */

const SPREADSHEET_ID = "1GeBg6ZXwN4MhyfvFTFHw288wu2ZQ_qZy4u07zbjwKaI";

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
    "CatatanPerkembangan": ["id", "siswaId", "tanggal", "catatan", "rekomendasi", "guruBkId", "namaGuru", "roleGuru", "kategori"],
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
  
  // Direct match
  for (var i = 0; i < standardHeaders.length; i++) {
    var std = standardHeaders[i];
    var cleanStd = std.toLowerCase().replace(/[\s_\-\.]/g, "");
    if (cleanHeader === cleanStd) {
      return std;
    }
  }
  
  // Custom aliases mapping for human input
  if (cleanHeader === "id") return "id";
  if (cleanHeader === "nama" || cleanHeader === "namasiswa" || cleanHeader === "namalengkap") return "nama";
  if (cleanHeader === "nis" || cleanHeader === "nomorinduksiswa") return "nis";
  if (cleanHeader === "nisn" || cleanHeader === "nomorinduksiswanasional") return "nisn";
  if (cleanHeader === "kelas" || cleanHeader === "kelasid" || cleanHeader === "namakelas") return "kelasId";
  if (cleanHeader === "gender" || cleanHeader === "jeniskelamin" || cleanHeader === "jk") return "jenisKelamin";
  if (cleanHeader === "nohp" || cleanHeader === "nomorhp" || cleanHeader === "telepon" || cleanHeader === "notelepon") return "nomorHp";
  if (cleanHeader === "alamat" || cleanHeader === "alamatrumah") return "alamat";
  if (cleanHeader === "foto" || cleanHeader === "urlfoto" || cleanHeader === "pasfoto") return "foto";
  if (cleanHeader === "tahunmasuk" || cleanHeader === "tahun") return "tahunMasuk";
  if (cleanHeader === "tempatlahir") return "tempatLahir";
  if (cleanHeader === "tanggallahir") return "tanggalLahir";
  if (cleanHeader === "agama") return "agama";
  if (cleanHeader === "desa" || cleanHeader === "kelurahan") return "desa";
  if (cleanHeader === "kecamatan") return "kecamatan";
  if (cleanHeader === "kabupaten" || cleanHeader === "kota") return "kabupaten";
  if (cleanHeader === "provinsi") return "provinsi";
  if (cleanHeader === "email" || cleanHeader === "surel") return "email";
  if (cleanHeader === "jenisremis" || cleanHeader === "jenisremisi") return "jenisRemisi";
  if (cleanHeader === "gurupember" || cleanHeader === "gurupemberi") return "guruPemberi";
  
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
  
  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    const obj = {};
    
    mappedHeaders.forEach(function(header, idx) {
      if (header) {
        let val = row[idx];
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
    
    // Auto-heal missing ID in Siswa row to keep database references secure and prevent duplicate sync rows
    if (sheetName === "Siswa" && (!obj.id || obj.id.toString().trim() === "")) {
      var cleanNis = (obj.nis || "").toString().trim();
      var cleanNisn = (obj.nisn || "").toString().trim();
      var cleanNama = (obj.nama || "").toString().trim().toLowerCase().replace(/[^a-z0-9]/g, "");
      
      let generatedId = "";
      if (cleanNis) {
        generatedId = "sis-nis-" + cleanNis;
      } else if (cleanNisn) {
        generatedId = "sis-nisn-" + cleanNisn;
      } else if (cleanNama) {
        generatedId = "sis-name-" + cleanNama;
      } else {
        generatedId = "sis-row-" + i;
      }
      
      obj.id = generatedId;
      
      // Persist the missing ID right back to the spreadsheet row cell
      try {
        var idColIdx = mappedHeaders.indexOf("id");
        if (idColIdx !== -1) {
          sheet.getRange(i + 1, idColIdx + 1).setValue(generatedId);
        }
      } catch (err) {
        Logger.log("Gagal auto-heal ID siswa di baris " + (i + 1) + ": " + err.toString());
      }
    }
    
    jsonArray.push(obj);
  }
  
  return jsonArray;
}

// Universal Entity Save Row Handler
function saveRowEntity(db, sheetName, entity, isNew) {
  db = db || getDatabaseSheets();
  let sheet = db.getSheetByName(sheetName);
  
  // Check common aliases
  if (!sheet) {
    if (sheetName === "Pengaduan_Siswa") sheet = db.getSheetByName("PengaduanSiswa") || db.getSheetByName("Pengaduan");
    if (sheetName === "Catatan_Perkembangan") sheet = db.getSheetByName("CatatanPerkembangan");
    if (sheetName === "LaporanKejadian") sheet = db.getSheetByName("Laporan_Kejadian");
  }

  // AUTO CREATE SHEET ON THE FLY IF IT DOES NOT EXIST
  if (!sheet) {
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
  
  const headers = sheet.getDataRange().getValues()[0];
  
  let rowIndex = -1;
  if (!isNew) {
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
      const nisColIdx = headers.indexOf("nis");
      const nisnColIdx = headers.indexOf("nisn");
      const namaColIdx = headers.indexOf("nama");
      
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
    headers.forEach(function(header) {
      let val = entity[header] !== undefined ? entity[header] : "";
      if (typeof val === 'string' && val.length > 45000) {
        val = val.substring(0, 45000) + "... (truncated)";
      }
      newRow.push(val);
    });
    sheet.appendRow(newRow);
  } else {
    // Edit Row
    headers.forEach(function(header, colIdx) {
      if (entity[header] !== undefined) {
        let val = entity[header];
        if (typeof val === 'string' && val.length > 45000) {
          val = val.substring(0, 45000) + "... (truncated)";
        }
        sheet.getRange(rowIndex, colIdx + 1).setValue(val);
      }
    });
  }
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

function deleteEntity(db, sheetName, id) {
  db = db || getDatabaseSheets();
  const sheet = db.getSheetByName(sheetName);
  if (!sheet) {
    return { success: false, message: "Sheet tidak ditemukan." };
  }
  
  const values = sheet.getDataRange().getValues();
  for (let i = 1; i < values.length; i++) {
    if (values[i][0] == id) {
      sheet.deleteRow(i + 1);
      return { success: true, message: sheetName + " berhasil dihapus." };
    }
  }
  
  return { success: false, message: "ID tidak ditemukan di sheet " + sheetName };
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
      if (lastRow > 1) {
        sheet.getRange(2, 1, lastRow - 1, schema[sheetName].length).clearContent();
      } else if (lastRow === 0) {
        // Terapkan headers jika kosong total
        var headers = schema[sheetName];
        sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
        sheet.getRange(1, 1, 1, headers.length).setFontWeight("bold").setBackground("#e2e8f0");
      }
      
      var items = payload[key];
      if (items && items.length > 0) {
        var headers = sheet.getDataRange().getValues()[0];
        var rowsToAdd = [];
        
        items.forEach(function(item) {
          var row = [];
          headers.forEach(function(header) {
            row.push(item[header] !== undefined ? item[header] : "");
          });
          rowsToAdd.push(row);
        });
        
        if (rowsToAdd.length > 0) {
          sheet.getRange(2, 1, rowsToAdd.length, headers.length).setValues(rowsToAdd);
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

function updatePengaduanStatusRow(db, id, status, tanggapanBk, petugasBk) {
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
        sheet.getRange(rowIndex, tanggalColIdx + 1).setValue(new Date().toISOString().split('T')[0]);
      }
      if (petugasColIdx !== -1 && petugasBk) {
        sheet.getRange(rowIndex, petugasColIdx + 1).setValue(petugasBk);
      }
      return { success: true, message: "Status pengaduan siswa berhasil diperbarui." };
    }
  }
  
  return { success: false, message: "Data pengaduan siswa dengan ID '" + id + "' tidak ditemukan." };
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
