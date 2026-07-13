/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * SISTEM HIMPUNAN DATA SISWA (HDS) BIMBINGAN DAN KONSELING
 * Google Apps Script - Disciplinary Violations (Pelanggaran.gs)
 */

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
