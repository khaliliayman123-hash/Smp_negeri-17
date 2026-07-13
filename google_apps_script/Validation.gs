/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * SISTEM HIMPUNAN DATA SISWA (HDS) BIMBINGAN DAN KONSELING
 * Google Apps Script - Input Sanitation & Validation (Validation.gs)
 */

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
