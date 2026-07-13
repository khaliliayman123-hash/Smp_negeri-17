/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * SISTEM HIMPUNAN DATA SISWA (HDS) BIMBINGAN DAN KONSELING
 * Google Apps Script - Counseling Services (Konseling.gs)
 */

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
