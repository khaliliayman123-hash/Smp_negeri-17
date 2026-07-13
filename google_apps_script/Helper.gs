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
  
  // 1. Coba ambil spreadsheetId dari parameter/payload jika dikirim secara dinamis oleh client
  if (spreadsheetId && spreadsheetId !== "") {
    var cleanedId = spreadsheetId;
    if (spreadsheetId.indexOf("/d/") !== -1) {
      var parts = spreadsheetId.split("/d/");
      if (parts.length > 1) {
        cleanedId = parts[1].split("/")[0];
      }
    }
    try {
      db = SpreadsheetApp.openById(cleanedId);
      if (db) return db;
    } catch (e) {
      Logger.log("Gagal membuka spreadsheet via parameter ID: " + e.message);
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
    "CatatanPerkembangan": ["id", "siswaId", "tanggal", "catatan", "guruBkId"],
    "TahunPelajaran": ["id", "tahun", "semester", "isActive"],
    "Kelas": ["id", "namaKelas", "waliKelasId"],
    "LogAktivitas": ["id", "timestamp", "userId", "namaUser", "role", "aktivitas", "detail"]
  };

  // Pastikan seluruh sheet ada (Auto-heal / Auto-provision jika ada sheet yang kurang)
  for (var sheetName in schema) {
    var s = db.getSheetByName(sheetName);
    if (!s) {
      try {
        s = db.insertSheet(sheetName);
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
    var defaultSheet = db.getSheetByName("Sheet1");
    if (defaultSheet && defaultSheet.getLastRow() === 0 && defaultSheet.getLastColumn() === 0) {
      db.deleteSheet(defaultSheet);
    }
  } catch (e) {}

  const result = {};
  const sheets = db.getSheets();
  
  sheets.forEach(function(sheet) {
    const name = sheet.getName();
    // Camelcase name for state keys
    const stateKey = name.charAt(0).toLowerCase() + name.slice(1);
    result[stateKey] = getSheetDataAsJson(sheet);
  });
  
  return result;
}

function getSheetDataAsJson(sheet) {
  const data = sheet.getDataRange().getValues();
  if (data.length <= 1) return [];
  
  const headers = data[0];
  const jsonArray = [];
  
  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    const obj = {};
    headers.forEach(function(header, idx) {
      if (header) {
        let val = row[idx];
        if (val instanceof Date) {
          // Convert date to ISO String date portion
          val = val.toISOString().split('T')[0];
        } else if (val === "true") {
          val = true;
        } else if (val === "false") {
          val = false;
        }
        obj[header] = val;
      }
    });
    jsonArray.push(obj);
  }
  
  return jsonArray;
}

// Universal Entity Save Row Handler
function saveRowEntity(db, sheetName, entity, isNew) {
  db = db || getDatabaseSheets();
  const sheet = db.getSheetByName(sheetName);
  if (!sheet) {
    throw new Error("Sheet '" + sheetName + "' tidak ditemukan.");
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
    "CatatanPerkembangan": ["id", "siswaId", "tanggal", "catatan", "guruBkId"],
    "TahunPelajaran": ["id", "tahun", "semester", "isActive"],
    "Kelas": ["id", "namaKelas", "waliKelasId"],
    "LogAktivitas": ["id", "timestamp", "userId", "namaUser", "role", "aktivitas", "detail"]
  };

  for (var key in payload) {
    if (key === "config" || key === "action") continue;
    
    // Capitalize first letter to get sheet name
    var sheetName = key.charAt(0).toUpperCase() + key.slice(1);
    
    // Khusus logAktivitas -> LogAktivitas
    if (key === "logAktivitas") {
      sheetName = "LogAktivitas";
    }
    
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
      // Clear all rows below header
      var lastRow = sheet.getLastRow();
      if (lastRow > 1) {
        sheet.deleteRows(2, lastRow - 1);
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
