/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * SISTEM HIMPUNAN DATA SISWA (HDS) BIMBINGAN DAN KONSELING
 * Google Apps Script Web App - REST API Entry Point (Code.gs)
 */

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
        responseData = deleteEntity(db, "Prestasi", postData.id, postData);
        break;
        
      case "savePelanggaran":
        responseData = saveEntity(db, "Pelanggaran", postData.p, postData.isNew);
        break;
        
      case "deletePelanggaran":
        responseData = deleteEntity(db, "Pelanggaran", postData.id, postData);
        break;

      case "saveRemisiPoin":
        responseData = saveEntity(db, "RemisiPoin", postData.r, postData.isNew);
        break;
        
      case "deleteRemisiPoin":
        responseData = deleteEntity(db, "RemisiPoin", postData.id, postData);
        break;
        
      case "saveKonseling":
        responseData = saveEntity(db, "Konseling", postData.k, postData.isNew);
        break;
        
      case "deleteKonseling":
        responseData = deleteEntity(db, "Konseling", postData.id, postData);
        break;
        
      case "saveAsesmen":
        responseData = saveEntity(db, "Asesmen", postData.a, postData.isNew);
        break;
        
      case "deleteAsesmen":
        responseData = deleteEntity(db, "Asesmen", postData.id, postData);
        break;
        
      case "saveHomeVisit":
        responseData = saveEntity(db, "HomeVisit", postData.h, postData.isNew);
        break;
        
      case "deleteHomeVisit":
        responseData = deleteEntity(db, "HomeVisit", postData.id, postData);
        break;
        
      case "saveSurat":
        responseData = saveEntity(db, "Surat", postData.s, postData.isNew);
        break;
        
      case "deleteSurat":
        responseData = deleteEntity(db, "Surat", postData.id, postData);
        break;
        
      case "saveDokumen":
        responseData = saveEntity(db, "Dokumen", postData.d, postData.isNew);
        break;
        
      case "deleteDokumen":
        responseData = deleteEntity(db, "Dokumen", postData.id, postData);
        break;
        
      case "saveCatatanPerkembangan":
        responseData = saveEntity(db, "Catatan_Perkembangan", postData.c, postData.isNew);
        break;
        
      case "deleteCatatanPerkembangan":
        responseData = deleteEntity(db, "Catatan_Perkembangan", postData.id, postData);
        break;

      case "savePengaduan":
        responseData = saveEntity(db, "Pengaduan_Siswa", postData.p, postData.isNew);
        break;
        
      case "deletePengaduan":
        responseData = deleteEntity(db, "Pengaduan_Siswa", postData.id, postData);
        break;

      case "updatePengaduanStatus":
        responseData = updatePengaduanStatusRow(db, postData.id, postData.status, postData.tanggapanBk, postData.petugasBk, postData.tanggalTanggapan);
        break;

      case "saveKehadiran":
        responseData = saveEntity(db, "Kehadiran", postData.k, postData.isNew);
        break;

      case "deleteKehadiran":
        responseData = deleteEntity(db, "Kehadiran", postData.id, postData);
        break;

      case "saveLaporanKejadian":
        responseData = saveEntity(db, "LaporanKejadian", postData.l, postData.isNew);
        break;

      case "deleteLaporanKejadian":
        responseData = deleteEntity(db, "LaporanKejadian", postData.id, postData);
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
