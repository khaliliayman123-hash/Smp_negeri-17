/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * SISTEM HIMPUNAN DATA SISWA (HDS) BIMBINGAN DAN KONSELING
 * Google Apps Script - Achievements Services (Prestasi.gs)
 */

function getStudentAchievements(db, studentId) {
  db = db || getDatabaseSheets();
  const sheet = db.getSheetByName("Prestasi");
  if (!sheet) return [];
  
  const data = getSheetDataAsJson(sheet);
  return data.filter(function(item) {
    return item.siswaId === studentId;
  });
}
