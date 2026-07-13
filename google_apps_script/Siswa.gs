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
  if (!siswaId) {
    Logger.log("Peringatan: Fungsi deleteSiswaPackage dijalankan tanpa parameter siswaId.");
    return { success: false, message: "siswaId kosong." };
  }
  
  // List of sheets where the student ID is the first column (id)
  const idSheets = ["Siswa", "OrangTua", "Kesehatan", "Ekonomi", "Psikologi", "Sosial", "Akademik"];
  
  // List of sheets where the student ID is the second column (siswaId)
  const siswaIdSheets = ["Prestasi", "Pelanggaran", "RemisiPoin", "Konseling", "Asesmen", "HomeVisit", "Surat", "Dokumen", "CatatanPerkembangan"];
  
  let deletedCount = 0;
  
  // 1. Delete from idSheets
  idSheets.forEach(function(sheetName) {
    const sheet = db.getSheetByName(sheetName);
    if (sheet) {
      const values = sheet.getDataRange().getValues();
      for (let i = values.length - 1; i >= 1; i--) {
        if (values[i][0] == siswaId) {
          sheet.deleteRow(i + 1);
          deletedCount++;
        }
      }
    }
  });
  
  // 2. Delete from siswaIdSheets
  siswaIdSheets.forEach(function(sheetName) {
    const sheet = db.getSheetByName(sheetName);
    if (sheet) {
      const values = sheet.getDataRange().getValues();
      for (let i = values.length - 1; i >= 1; i--) {
        if (values[i][1] == siswaId) {
          sheet.deleteRow(i + 1);
          deletedCount++;
        }
      }
    }
  });
  
  return { success: true, message: "Siswa dan seluruh rekam data terkait berhasil dihapus secara online (" + deletedCount + " baris)." };
}
