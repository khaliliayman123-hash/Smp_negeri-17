/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * SISTEM HIMPUNAN DATA SISWA (HDS) BIMBINGAN DAN KONSELING
 * Google Apps Script - Authentication & Session Management (Auth.gs)
 */

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
