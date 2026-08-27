/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * SISTEM HIMPUNAN DATA SISWA (HDS) BIMBINGAN DAN KONSELING
 * Google Apps Script - Student Management Services (Siswa.gs)
 */

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
    const sheet = typeof findSheetFlexible === "function" ? findSheetFlexible(db, sheetName) : db.getSheetByName(sheetName);
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
    const sheet = typeof findSheetFlexible === "function" ? findSheetFlexible(db, sheetName) : db.getSheetByName(sheetName);
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
