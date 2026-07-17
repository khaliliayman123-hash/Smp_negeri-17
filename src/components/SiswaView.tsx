/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useEffect } from 'react';
import * as XLSX from 'xlsx';
import { 
  Search, 
  UserPlus, 
  Eye, 
  Edit2, 
  Trash2, 
  Camera, 
  ChevronRight, 
  ChevronLeft, 
  Plus,
  Shield,
  FileText,
  Activity,
  Heart,
  DollarSign,
  Brain,
  X,
  Sparkles,
  Award,
  FileSpreadsheet,
  Download,
  Upload,
  RefreshCw,
  ExternalLink,
  AlertCircle,
  Mail,
  Printer,
  FileDown
} from 'lucide-react';
import { 
  DatabaseState, 
  Siswa, 
  OrangTua, 
  Kesehatan, 
  Ekonomi, 
  Psikologi, 
  Sosial, 
  Akademik, 
  User, 
  UserRole,
  Prestasi,
  Surat
} from '../types';
import { apiService } from '../services/api';

interface SiswaViewProps {
  db: DatabaseState;
  currentUser: User;
  onSaveSiswa: (
    siswa: Siswa,
    orangTua: OrangTua,
    kesehatan: Kesehatan,
    ekonomi: Ekonomi,
    psikologi: Psikologi,
    sosial: Sosial,
    akademik: Akademik,
    isNew: boolean,
    silent?: boolean,
    localOnly?: boolean
  ) => Promise<boolean>;
  onDeleteSiswa: (id: string) => Promise<boolean>;
  onSavePrestasi?: (p: Prestasi, isNew: boolean) => Promise<boolean>;
  onDeletePrestasi?: (id: string) => Promise<boolean>;
  onRefresh?: () => Promise<void>;
  preSelectedSiswaId?: string;
  preSelectedSubTab?: string;
  onSaveSurat?: (s: Surat, isNew: boolean) => Promise<boolean>;
  onDeleteSurat?: (id: string) => Promise<boolean>;
}

export default function SiswaView({ 
  db, 
  currentUser, 
  onSaveSiswa, 
  onDeleteSiswa,
  onSavePrestasi,
  onDeletePrestasi,
  onRefresh,
  preSelectedSiswaId,
  preSelectedSubTab,
  onSaveSurat,
  onDeleteSurat
}: SiswaViewProps) {
  
  const canModify = currentUser.role === UserRole.ADMIN || currentUser.role === UserRole.GURU_BK;
  const isStudent = currentUser.role === UserRole.SISWA;

  const [isSyncing, setIsSyncing] = useState(false);

  const handleSyncData = async () => {
    if (!onRefresh) {
      alert('Fitur sinkronisasi tidak aktif atau belum diatur.');
      return;
    }
    setIsSyncing(true);
    try {
      await onRefresh();
      alert('🔄 DATA DIPERBARUI!\n\nHimpunan data siswa berhasil disinkronisasikan dan diperbarui dengan data terbaru dari Google Sheets/Database.');
    } catch (err: any) {
      alert('Gagal memperbarui data: ' + err.toString());
    } finally {
      setIsSyncing(false);
    }
  };

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedKelas, setSelectedKelas] = useState('All');
  const [selectedGender, setSelectedGender] = useState('All');
  
  // Sorting State
  const [sortBy, setSortBy] = useState<'nama' | 'nis' | 'kelas'>('nama');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Selected Student for detail view or edit
  const [viewingSiswa, setViewingSiswa] = useState<Siswa | null>(
    isStudent 
      ? (db.siswa.find(s => s.id === currentUser.id) || null)
      : preSelectedSiswaId ? (db.siswa.find(s => s.id === preSelectedSiswaId) || null) : null
  );

  useEffect(() => {
    if (isStudent) {
      const mySiswa = db.siswa.find(s => s.id === currentUser.id);
      if (mySiswa) setViewingSiswa(mySiswa);
    }
  }, [currentUser.id, db.siswa, isStudent]);

  useEffect(() => {
    if (viewingSiswa) {
      const updated = db.siswa.find(s => s.id === viewingSiswa.id);
      if (updated && JSON.stringify(updated) !== JSON.stringify(viewingSiswa)) {
        setViewingSiswa(updated);
      }
    }
  }, [db.siswa]);
  const [activeDetailTab, setActiveDetailTab] = useState<string>(preSelectedSubTab || 'bio');
  
  // CRUD Form State
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingSiswaId, setEditingSiswaId] = useState<string | null>(null);

  // Unified Multi-Sheet Form State (Zod/Hook form mapped fields)
  const [formSiswa, setFormSiswa] = useState<Partial<Siswa>>({});
  const [formOrangTua, setFormOrangTua] = useState<Partial<OrangTua>>({});
  const [formKesehatan, setFormKesehatan] = useState<Partial<Kesehatan>>({});
  const [formEkonomi, setFormEkonomi] = useState<Partial<Ekonomi>>({});
  const [formPsikologi, setFormPsikologi] = useState<Partial<Psikologi>>({});
  const [formSosial, setFormSosial] = useState<Partial<Sosial>>({});
  const [formAkademik, setFormAkademik] = useState<Partial<Akademik>>({});
  const [photoPreview, setPhotoPreview] = useState<string>('');

  // Custom Delete Confirmation States
  const [deleteConfirmSiswaId, setDeleteConfirmSiswaId] = useState<string | null>(null);
  const [isDeletingSiswa, setIsDeletingSiswa] = useState(false);
  const [deleteConfirmPrestasiId, setDeleteConfirmPrestasiId] = useState<string | null>(null);
  const [isDeletingPrestasi, setIsDeletingPrestasi] = useState(false);

  // Prestasi Form State
  const [isPrestasiFormOpen, setIsPrestasiFormOpen] = useState(false);
  const [editingPrestasiId, setEditingPrestasiId] = useState<string | null>(null);
  const [formPrestasi, setFormPrestasi] = useState<Partial<Prestasi>>({
    namaPrestasi: '',
    tingkat: 'Sekolah',
    tahun: new Date().getFullYear().toString(),
    juara: '',
    kategori: 'Akademik',
  });

  // Spreadsheet / Excel View State
  const [isSpreadsheetViewOpen, setIsSpreadsheetViewOpen] = useState(false);
  const [spreadsheetCategory, setSpreadsheetCategory] = useState<'all' | 'biodata' | 'orangtua' | 'akademik' | 'kesehatan' | 'ekonomi' | 'psikologi' | 'prestasi'>('all');
  const [spreadsheetSearch, setSpreadsheetSearch] = useState('');

  // Excel Import / Template States
  const [isImporting, setIsImporting] = useState(false);
  const [importStatus, setImportStatus] = useState<{ success: number; failed: number; details: string[] } | null>(null);

  // Generator Surat BK State in Student Detail
  const [selectedLetterType, setSelectedLetterType] = useState<string>('Surat Panggilan');
  const [letterNo, setLetterNo] = useState<string>('');
  const [letterSubject, setLetterSubject] = useState<string>('');
  const [letterBody, setLetterBody] = useState<string>('');
  const [letterDate, setLetterDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [printLetterData, setPrintLetterData] = useState<Surat | null>(null);

  useEffect(() => {
    if (!viewingSiswa) return;
    const year = new Date().getFullYear();
    const count = (db.surat || []).length + 1;
    const paddedCount = String(count).padStart(3, '0');
    
    // Generate nomor surat
    let code = 'PANG';
    if (selectedLetterType === 'Surat Kontrak Perilaku') code = 'KONT';
    else if (selectedLetterType === 'Surat Home Visit') code = 'HOME';
    else if (selectedLetterType === 'Surat Rujukan') code = 'RUJU';
    
    setLetterNo(`${paddedCount}/BK-SMP17/${code}/${year}`);
    
    // Generate perihal and isi
    if (selectedLetterType === 'Surat Panggilan') {
      setLetterSubject('Undangan Bimbingan & Koordinasi Perkembangan Karakter Siswa');
      setLetterBody('Sehubungan dengan program bimbingan perkembangan karakter peserta didik UPTD SMPN 17 Kota Tangerang Selatan, kami bermaksud mengundang Bapak/Ibu sekalian selaku orang tua/wali murid untuk hadir di ruang BK guna berkoordinasi dan mencari solusi terbaik atas kedisiplinan dan perkembangan masa depan putra/putri Bapak/Ibu.');
    } else if (selectedLetterType === 'Surat Kontrak Perilaku') {
      setLetterSubject('Surat Perjanjian & Kontrak Komitmen Perilaku Siswa');
      setLetterBody('Berdasarkan hasil pemantauan dan evaluasi perilaku harian, kami menyusun lembar kesepakatan komitmen perilaku ini secara tertulis. Surat ini mengikat komitmen siswa untuk mematuhi peraturan tata tertib sekolah secara disiplin, konsisten, serta bersedia menerima konsekuensi pembinaan sesuai aturan yang berlaku apabila melanggar perjanjian.');
    } else if (selectedLetterType === 'Surat Home Visit') {
      setLetterSubject('Surat Pemberitahuan Pelaksanaan Kunjungan Rumah (Home Visit)');
      setLetterBody('Dalam rangka menyelaraskan program pendidikan sekolah dengan lingkungan keluarga serta memahami secara mendalam latar belakang perkembangan siswa, tim Bimbingan Konseling (BK) UPTD SMPN 17 Kota Tangerang Selatan merencanakan kunjungan silaturahmi langsung ke kediaman Bapak/Ibu (Home Visit) pada waktu yang disepakati.');
    } else if (selectedLetterType === 'Surat Rujukan') {
      setLetterSubject('Surat Rujukan Penanganan Masalah & Perkembangan Siswa');
      setLetterBody('Untuk memaksimalkan penanganan komprehensif atas aspek-aspek tumbuh kembang, emosional, atau kebutuhan khusus siswa yang bersangkutan, dengan ini pihak sekolah memberikan rekomendasi rujukan koordinasi bantuan kepada pihak profesional terkait eksternal (psikolog/tenaga medis/lembaga berwenang) demi kebaikan siswa.');
    }
  }, [selectedLetterType, viewingSiswa, db.surat]);

  // Quotes-aware CSV parsing engine
  const parseCSV = (text: string): string[][] => {
    const lines: string[][] = [];
    let row: string[] = [];
    let cell = '';
    let inQuotes = false;
    
    for (let i = 0; i < text.length; i++) {
      const char = text[i];
      const nextChar = text[i + 1];
      
      if (inQuotes) {
        if (char === '"') {
          if (nextChar === '"') {
            cell += '"';
            i++; // skip next quote
          } else {
            inQuotes = false;
          }
        } else {
          cell += char;
        }
      } else {
        if (char === '"') {
          inQuotes = true;
        } else if (char === ',') {
          row.push(cell.trim());
          cell = '';
        } else if (char === '\n' || char === '\r') {
          if (char === '\r' && nextChar === '\n') {
            i++;
          }
          row.push(cell.trim());
          lines.push(row);
          row = [];
          cell = '';
        } else {
          cell += char;
        }
      }
    }
    
    if (cell || row.length > 0) {
      row.push(cell.trim());
      lines.push(row);
    }
    
    return lines.filter(r => r.some(c => c !== ''));
  };

  // Generate and download a pristine Excel Template pre-filled with examples
  const handleDownloadExcelTemplate = () => {
    const headers = [
      'NIS', 'NISN', 'Nama Lengkap', 'Jenis Kelamin (Laki-laki/Perempuan)', 'Tempat Lahir', 'Tanggal Lahir (YYYY-MM-DD)', 'Agama', 'Nomor HP', 'Email', 'Alamat', 'Tahun Masuk', 'Nama Kelas', 'Tahun Pelajaran',
      'Nama Ayah', 'Status Ayah (Hidup/Meninggal)', 'Pekerjaan Ayah', 'No HP Ayah', 'Alamat Ayah', 'Nama Ibu', 'Status Ibu (Hidup/Meninggal)', 'Pekerjaan Ibu', 'No HP Ibu', 'Alamat Ibu', 'Nama Wali', 'Pekerjaan Wali', 'Penghasilan Orang Tua', 'Pendidikan Orang Tua',
      'Rata-Rata Rapor', 'Catatan Wali Kelas',
      'Tinggi Badan (cm)', 'Berat Badan (kg)', 'Golongan Darah', 'Riwayat Penyakit', 'Disabilitas', 'Alergi',
      'Status Kepemilikan Rumah', 'Transportasi Sekolah', 'Penerima KIP (Ya/Tidak)',
      'Minat & Hobi', 'Bakat Khusus', 'Cita-Cita', 'Kepribadian', 'Gaya Belajar (Visual/Auditory/Kinestetik)'
    ];

    const sampleRow = [
      '123456', '0098765432', 'Budi Pratama', 'Laki-laki', 'Jakarta', '2010-04-12', 'Islam', '081234567890', 'budi.pratama@email.com', 'Jl. Melati No. 15, Ciputat', '2024', 'Kelas 7-1', '2025/2026',
      'Ahmad Supriatna', 'Hidup', 'PNS', '081299998888', 'Jl. Melati No. 15, Ciputat', 'Siti Aminah', 'Hidup', 'Ibu Rumah Tangga', '081277776666', 'Jl. Melati No. 15, Ciputat', '-', '-', 'Rp 3.000.000 - Rp 5.000.000', 'S1',
      '85.5', 'Budi memiliki perkembangan akademis yang sangat baik dan aktif berorganisasi',
      '165', '55', 'O', 'Tidak Ada', 'Tidak Ada', 'Tidak Ada',
      'Milik Sendiri', 'Sepeda Motor', 'Tidak',
      'Membaca Buku', 'Seni Musik', 'Insinyur', 'Sanguinis', 'Visual'
    ];

    const sampleRow2 = [
      '123457', '0102345678', 'Siti Rahmawati', 'Perempuan', 'Tangerang', '2011-09-22', 'Islam', '085712345678', 'siti.rahma@email.com', 'Komp. Griya Asri Blok C-2, Pamulang', '2024', 'Kelas 7-2', '2025/2026',
      'Hadi Wijaya', 'Hidup', 'Wiraswasta', '085799991111', 'Komp. Griya Asri Blok C-2, Pamulang', 'Dewi Lestari', 'Hidup', 'Guru', '085722223333', 'Komp. Griya Asri Blok C-2, Pamulang', '-', '-', 'Rp 5.000.000 - Rp 10.000.000', 'S1',
      '89.2', 'Siti sangat rajin dan teliti di kelas',
      '158', '48', 'A', 'Asma', 'Tidak Ada', 'Alergi Dingin',
      'Milik Sendiri', 'Antar Jemput', 'Ya',
      'Menggambar', 'Seni Lukis', 'Dokter', 'Melankolis', 'Visual'
    ];

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet([headers, sampleRow, sampleRow2]);
    XLSX.utils.book_append_sheet(wb, ws, 'Template HDS Siswa');
    XLSX.writeFile(wb, 'template_hds_siswa_excel.xlsx');
  };

  // Read, validate, and bulk-import student records from Excel (XLSX/XLS) or CSV
  const handleImportExcel = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsImporting(true);
    setImportStatus(null);

    const reader = new FileReader();
    const isXlsx = file.name.endsWith('.xlsx') || file.name.endsWith('.xls');

    reader.onload = async (event) => {
      try {
        let rows: string[][] = [];

        if (isXlsx) {
          const data = new Uint8Array(event.target?.result as ArrayBuffer);
          const workbook = XLSX.read(data, { type: 'array' });
          const firstSheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[firstSheetName];
          const rawRows = XLSX.utils.sheet_to_json<any[]>(worksheet, { header: 1, defval: '' });
          rows = rawRows.map(r => r.map(c => String(c)));
        } else {
          const text = event.target?.result as string;
          if (!text) {
            alert('File kosong atau rusak!');
            setIsImporting(false);
            return;
          }
          rows = parseCSV(text);
        }

        if (rows.length < 2) {
          alert('Template tidak sesuai atau tidak memiliki baris data!');
          setIsImporting(false);
          return;
        }

        const headers = rows[0].map(h => h ? h.toLowerCase().trim() : '');
        const expectedPrefix = ['nis', 'nisn', 'nama lengkap'];
        const isValid = expectedPrefix.every(h => headers.includes(h));
        if (!isValid) {
          alert('Header template tidak sesuai! Gunakan template resmi yang diunduh.');
          setIsImporting(false);
          return;
        }

        let successCount = 0;
        let failedCount = 0;
        const details: string[] = [];

        for (let i = 1; i < rows.length; i++) {
          const row = rows[i];
          if (row.length === 0 || row.every(cell => cell === '')) continue;

          const nis = row[0] || '';
          const nisn = row[1] || '';
          const nama = row[2] || '';
          
          if (!nis || !nama) {
            failedCount++;
            details.push(`Baris ${i + 1}: Gagal (NIS dan Nama Lengkap wajib diisi)`);
            continue;
          }

          if (nis === '123456' || nis === '123457') {
            details.push(`Baris ${i + 1}: Dilewati (Baris contoh/template)`);
            continue;
          }

          try {
            const existingSiswa = db.siswa.find(s => s.nis === nis || s.nisn === nisn);
            const id = existingSiswa ? existingSiswa.id : `sis-${Date.now()}-${i}`;
            const isNew = !existingSiswa;

            const rawKelas = row[11] || '';
            const normalizeClassNameLocal = (raw: string): string => {
              let val = String(raw || '').trim();
              if (val.startsWith('Jam ')) val = val.slice(4).trim();
              if (val.startsWith('Kelas ')) val = val.slice(6).trim();
              
              const stdPattern = /^([789])-([1-9]|1[01])$/;
              const stdMatch = val.match(stdPattern);
              if (stdMatch) return `Kelas ${stdMatch[1]}-${stdMatch[2]}`;
              
              const kelasPattern = /^Kelas\s+([789])-([1-9]|1[01])$/i;
              const kelasMatch = val.match(kelasPattern);
              if (kelasMatch) return `Kelas ${kelasMatch[1]}-${kelasMatch[2]}`;
              
              const timePattern = /^0?([789])[:.]0?([1-9]|1[01])(?:[:.]00)?$/;
              const timeMatch = val.match(timePattern);
              if (timeMatch) {
                return `Kelas ${parseInt(timeMatch[1], 10)}-${parseInt(timeMatch[2], 10)}`;
              }
              
              const datePattern = /^(\d{4})[-/](\d{1,2})[-/](\d{1,2})(?:T.*)?$/;
              const datePatternDMY = /^(\d{1,2})[-/](\d{1,2})[-/](\d{4})(?:T.*)?$/;
              let m = val.match(datePattern);
              let y = 0, mo = 0, d = 0;
              if (m) {
                y = parseInt(m[1], 10); mo = parseInt(m[2], 10); d = parseInt(m[3], 10);
              } else {
                m = val.match(datePatternDMY);
                if (m) {
                  d = parseInt(m[1], 10); mo = parseInt(m[2], 10); y = parseInt(m[3], 10);
                }
              }
              if (y > 0 && mo > 0 && d > 0) {
                if ((mo === 7 || mo === 8 || mo === 9) && (d >= 1 && d <= 11)) return `Kelas ${mo}-${d}`;
                if ((d === 7 || d === 8 || d === 9) && (mo >= 1 && mo <= 11)) return `Kelas ${d}-${mo}`;
                if ((mo === 1 || mo === 2 || mo === 3) && (d >= 1 && d <= 11)) return `Kelas ${mo + 6}-${d}`;
                if ((d === 1 || d === 2 || d === 3) && (mo >= 1 && mo <= 11)) return `Kelas ${d + 6}-${mo}`;
              }
              return raw;
            };
            const cleanRawKelas = normalizeClassNameLocal(rawKelas);
            const matchKelas = db.kelas.find(k => k.namaKelas.toLowerCase().trim() === cleanRawKelas.toLowerCase().trim());
            const kelasId = matchKelas ? matchKelas.id : (db.kelas[0]?.id || 'kelas-vii-a');
            const defaultTP = db.tahunPelajaran.find(tp => tp.isActive)?.tahun || '2025/2026';

            const sPack: Siswa = {
              id,
              nis,
              nisn,
              nama,
              jenisKelamin: (row[3] === 'Perempuan' ? 'Perempuan' : 'Laki-laki'),
              tempatLahir: row[4] || '-',
              tanggalLahir: row[5] || '2011-01-01',
              agama: row[6] || 'Islam',
              nomorHp: row[7] || '-',
              email: row[8] || '-',
              alamat: row[9] || '-',
              tahunMasuk: row[10] || new Date().getFullYear().toString(),
              tahunPelajaran: row[12] || defaultTP,
              kelasId,
              jurusanId: '',
              desa: '-',
              kecamatan: '-',
              kabupaten: '-',
              provinsi: '-',
              foto: existingSiswa?.foto || ''
            };

            const oPack: OrangTua = {
              id,
              namaAyah: row[13] || '-',
              statusAyah: (row[14] === 'Meninggal' ? 'Meninggal' : 'Hidup'),
              pekerjaanAyah: row[15] || '-',
              noHpAyah: row[16] || '-',
              alamatAyah: row[17] || sPack.alamat,
              namaIbu: row[18] || '-',
              statusIbu: (row[19] === 'Meninggal' ? 'Meninggal' : 'Hidup'),
              pekerjaanIbu: row[20] || '-',
              noHpIbu: row[21] || '-',
              alamatIbu: row[22] || sPack.alamat,
              wali: row[23] || '-',
              pekerjaanWali: row[24] || '-',
              penghasilan: row[25] || 'Rp 2.000.000 - Rp 4.000.000',
              pendidikanOrangTua: row[26] || 'SMA'
            };

            const aPack: Akademik = {
              id,
              semester: '1',
              rataRataRaport: parseFloat(row[27]) || 80,
              catatanWaliKelas: row[28] || '-'
            };

            const kPack: Kesehatan = {
              id,
              tinggiBadan: parseInt(row[29]) || 160,
              beratBadan: parseInt(row[30]) || 50,
              golonganDarah: row[31] || 'O',
              penyakit: row[32] || '-',
              disabilitas: row[33] || '-',
              alergi: row[34] || '-'
            };

            const ePack: Ekonomi = {
              id,
              statusRumah: row[35] || 'Milik Sendiri',
              penghasilan: oPack.penghasilan,
              kendaraan: row[36] || 'Motor',
              pip: false,
              pkh: false,
              kip: row[37]?.toLowerCase() === 'ya'
            };

            const pPack: Psikologi = {
              id,
              hobi: row[38] || '-',
              bakat: row[39] || '-',
              citaCita: row[40] || '-',
              kepribadian: row[41] || '-',
              gayaBelajar: row[42] || 'Visual',
              minat: row[38] || '-'
            };

            const s2Pack: Sosial = {
              id,
              hubunganTeman: 'Baik',
              organisasi: '-',
              masalahSosial: '-'
            };

            const ok = await onSaveSiswa(sPack, oPack, kPack, ePack, pPack, s2Pack, aPack, isNew, true, true);
            if (ok) {
              successCount++;
              details.push(`Baris ${i + 1}: Berhasil (${nama} - ${isNew ? 'Siswa Baru' : 'Perbarui Data'})`);
            } else {
              failedCount++;
              details.push(`Baris ${i + 1}: Gagal menyimpan database untuk ${nama}`);
            }
          } catch (err: any) {
            failedCount++;
            details.push(`Baris ${i + 1}: Gagal memproses data (${err.message})`);
          }
        }

        // Jalankan sinkronisasi / muat ulang database sekali saja di akhir proses impor
        if (onRefresh) {
          if (apiService.isOnlineMode()) {
            try {
              const currentDbState = await apiService.getData();
              await apiService.uploadFullDatabase(currentDbState);
            } catch (err) {
              console.error('Failed bulk database upload:', err);
            }
          }
          await onRefresh();
        }

        setImportStatus({
          success: successCount,
          failed: failedCount,
          details
        });
      } catch (err: any) {
        alert('Gagal membaca file: ' + err.message);
      } finally {
        setIsImporting(false);
        e.target.value = '';
      }
    };

    if (isXlsx) {
      reader.readAsArrayBuffer(file);
    } else {
      reader.readAsText(file);
    }
  };

  // Handle local state changes with automatic client-side compression to satisfy Google Sheets cell limit of 50,000 characters
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024) {
        alert('Batas upload foto maksimal 10KB! Silakan lakukan compress pada Simple Image Resizer.');
        e.target.value = '';
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        const img = new Image();
        img.onload = () => {
          // Limit to max 180px while maintaining aspect ratio
          const maxDim = 180;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > maxDim) {
              height = Math.round(height * (maxDim / width));
              width = maxDim;
            }
          } else {
            if (height > maxDim) {
              width = Math.round(width * (maxDim / height));
              height = maxDim;
            }
          }

          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(img, 0, 0, width, height);
            // Save as JPEG with quality 0.7 which yields an extremely small string (usually 4KB - 8KB)
            const compressedBase64 = canvas.toDataURL('image/jpeg', 0.7);
            setPhotoPreview(compressedBase64);
            setFormSiswa(prev => ({ ...prev, foto: compressedBase64 }));
          }
        };
        img.src = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  };

  // Open Editor for ADD or EDIT
  const openSiswaEditor = (siswa: Siswa | null) => {
    if (!canModify && !(isStudent && siswa && siswa.id === currentUser.id)) return;

    if (siswa) {
      // Load current student data pack
      setEditingSiswaId(siswa.id);
      setFormSiswa({
        ...siswa,
        tahunPelajaran: siswa.tahunPelajaran || db.tahunPelajaran.find(tp => tp.isActive)?.tahun || '2025/2026'
      });
      
      const otData: Partial<OrangTua> = db.orangTua.find(o => o.id === siswa.id) || {};
      setFormOrangTua({
        id: siswa.id,
        namaAyah: otData.namaAyah || '',
        statusAyah: otData.statusAyah || 'Hidup',
        tempatLahirAyah: otData.tempatLahirAyah || '',
        tanggalLahirAyah: otData.tanggalLahirAyah || '',
        alamatAyah: otData.alamatAyah || '',
        agamaAyah: otData.agamaAyah || '',
        pendidikanAyah: otData.pendidikanAyah || '',
        pekerjaanAyah: otData.pekerjaanAyah || '',
        noHpAyah: otData.noHpAyah || '',
        
        namaIbu: otData.namaIbu || '',
        statusIbu: otData.statusIbu || 'Hidup',
        tempatLahirIbu: otData.tempatLahirIbu || '',
        tanggalLahirIbu: otData.tanggalLahirIbu || '',
        alamatIbu: otData.alamatIbu || '',
        agamaIbu: otData.agamaIbu || '',
        pendidikanIbu: otData.pendidikanIbu || '',
        pekerjaanIbu: otData.pekerjaanIbu || '',
        noHpIbu: otData.noHpIbu || '',

        wali: otData.wali || '',
        statusWali: otData.statusWali || 'Hidup',
        tempatLahirWali: otData.tempatLahirWali || '',
        tanggalLahirWali: otData.tanggalLahirWali || '',
        alamatWali: otData.alamatWali || '',
        agamaWali: otData.agamaWali || '',
        pendidikanWali: otData.pendidikanWali || '',
        pekerjaanWali: otData.pekerjaanWali || '',
        noHpWali: otData.noHpWali || '',

        penghasilan: otData.penghasilan || 'Rp 2.000.000 - Rp 4.000.000',
        pendidikanOrangTua: otData.pendidikanOrangTua || 'SMA',
      });

      setFormKesehatan(db.kesehatan.find(k => k.id === siswa.id) || { id: siswa.id });
      setFormEkonomi(db.ekonomi.find(e => e.id === siswa.id) || { id: siswa.id });
      setFormPsikologi(db.psikologi.find(p => p.id === siswa.id) || { id: siswa.id });
      setFormSosial(db.sosial.find(s => s.id === siswa.id) || { id: siswa.id });
      setFormAkademik(db.akademik.find(a => a.id === siswa.id) || { id: siswa.id });
      setPhotoPreview(siswa.foto || '');
    } else {
      // New Student Template
      const newId = `sis-${Date.now()}`;
      setEditingSiswaId(null);
      setFormSiswa({
        id: newId,
        nis: '',
        nisn: '',
        nama: '',
        tempatLahir: '',
        tanggalLahir: '',
        jenisKelamin: 'Laki-laki',
        agama: 'Islam',
        alamat: '',
        desa: '',
        kecamatan: '',
        kabupaten: '',
        provinsi: '',
        nomorHp: '',
        email: '',
        kelasId: db.kelas[0]?.id || '',
        jurusanId: '',
        tahunMasuk: new Date().getFullYear().toString(),
        tahunPelajaran: db.tahunPelajaran.find(tp => tp.isActive)?.tahun || '2025/2026',
      });
      setFormOrangTua({
        id: newId,
        namaAyah: '',
        statusAyah: 'Hidup',
        tempatLahirAyah: '',
        tanggalLahirAyah: '',
        alamatAyah: '',
        agamaAyah: '',
        pendidikanAyah: '',
        pekerjaanAyah: '',
        noHpAyah: '',
        
        namaIbu: '',
        statusIbu: 'Hidup',
        tempatLahirIbu: '',
        tanggalLahirIbu: '',
        alamatIbu: '',
        agamaIbu: '',
        pendidikanIbu: '',
        pekerjaanIbu: '',
        noHpIbu: '',

        wali: '',
        statusWali: 'Hidup',
        tempatLahirWali: '',
        tanggalLahirWali: '',
        alamatWali: '',
        agamaWali: '',
        pendidikanWali: '',
        pekerjaanWali: '',
        noHpWali: '',

        penghasilan: 'Rp 2.000.000 - Rp 4.000.000',
        pendidikanOrangTua: 'SMA'
      });
      setFormKesehatan({ id: newId, tinggiBadan: 165, beratBadan: 55, golonganDarah: 'O', penyakit: '-', alergi: '-', disabilitas: '-' });
      setFormEkonomi({ id: newId, statusRumah: 'Milik Sendiri', penghasilan: 'Rp 2.000.000 - Rp 4.000.000', kendaraan: 'Motor', pip: false, pkh: false, kip: false });
      setFormPsikologi({ id: newId, minat: '-', bakat: '-', hobi: '-', gayaBelajar: 'Visual', citaCita: '-', kepribadian: '-' });
      setFormSosial({ id: newId, hubunganTeman: 'Baik', organisasi: '-', masalahSosial: '-' });
      setFormAkademik({ id: newId, semester: '1', rataRataRaport: 80, catatanWaliKelas: '-' });
      setPhotoPreview('');
    }
    setIsEditorOpen(true);
  };

  const handleSaveSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formSiswa.nis || !formSiswa.nama) {
      alert('NIS dan Nama Siswa wajib diisi!');
      return;
    }

    const sPack = formSiswa as Siswa;
    const oPack = formOrangTua as OrangTua;
    const kPack = formKesehatan as Kesehatan;
    const ePack = formEkonomi as Ekonomi;
    const pPack = formPsikologi as Psikologi;
    const s2Pack = formSosial as Sosial;
    const aPack = formAkademik as Akademik;

    const isNew = !editingSiswaId;
    const success = await onSaveSiswa(sPack, oPack, kPack, ePack, pPack, s2Pack, aPack, isNew);
    if (success) {
      setIsEditorOpen(false);
      // Keep the updated student data active on the screen
      setViewingSiswa(sPack);
    }
  };

  const handleDeleteClick = (siswaId: string) => {
    if (!canModify) return;
    setDeleteConfirmSiswaId(siswaId);
  };

  const confirmDeleteSiswa = async () => {
    if (!deleteConfirmSiswaId) return;
    setIsDeletingSiswa(true);
    try {
      const success = await onDeleteSiswa(deleteConfirmSiswaId);
      if (success) {
        setViewingSiswa(null);
      }
    } catch (err) {
      console.error('Error deleting student:', err);
    } finally {
      setIsDeletingSiswa(false);
      setDeleteConfirmSiswaId(null);
    }
  };

  const confirmDeletePrestasi = async () => {
    if (!deleteConfirmPrestasiId) return;
    setIsDeletingPrestasi(true);
    try {
      if (onDeletePrestasi) {
        await onDeletePrestasi(deleteConfirmPrestasiId);
      }
    } catch (err) {
      console.error('Error deleting achievement:', err);
    } finally {
      setIsDeletingPrestasi(false);
      setDeleteConfirmPrestasiId(null);
    }
  };

  // Filter and Sort Students
  const filteredStudents = useMemo(() => {
    return db.siswa
      .filter((s) => {
        const nameStr = s.nama ? String(s.nama).toLowerCase() : '';
        const nisStr = s.nis ? String(s.nis) : '';
        const nisnStr = s.nisn ? String(s.nisn) : '';
        const q = searchQuery.toLowerCase();
        const matchesSearch = nameStr.includes(q) || 
                              nisStr.includes(searchQuery) || 
                              nisnStr.includes(searchQuery);
        const matchesKelas = selectedKelas === 'All' || s.kelasId === selectedKelas;
        const matchesGender = selectedGender === 'All' || s.jenisKelamin === selectedGender;
        return matchesSearch && matchesKelas && matchesGender;
      })
      .sort((a, b) => {
        let fieldA: any = a.nama;
        let fieldB: any = b.nama;
        if (sortBy === 'nis') {
          fieldA = a.nis;
          fieldB = b.nis;
        } else if (sortBy === 'kelas') {
          fieldA = db.kelas.find(k => k.id === a.kelasId)?.namaKelas || '';
          fieldB = db.kelas.find(k => k.id === b.kelasId)?.namaKelas || '';
        }
        
        if (fieldA < fieldB) return sortOrder === 'asc' ? -1 : 1;
        if (fieldA > fieldB) return sortOrder === 'asc' ? 1 : -1;
        return 0;
      });
  }, [db.siswa, searchQuery, selectedKelas, selectedGender, sortBy, sortOrder]);

  // Paginated lists
  const totalPages = Math.ceil(filteredStudents.length / itemsPerPage);
  const paginatedStudents = useMemo(() => {
    const startIdx = (currentPage - 1) * itemsPerPage;
    return filteredStudents.slice(startIdx, startIdx + itemsPerPage);
  }, [filteredStudents, currentPage]);

  // SPREADSHEET EXCEL INTEGRATION DATA AGGREGATION
  const spreadsheetRows = useMemo(() => {
    return db.siswa.map((s, idx) => {
      const kelas = db.kelas.find(k => k.id === s.kelasId || k.namaKelas.toLowerCase().trim() === s.kelasId?.toLowerCase().trim())?.namaKelas || s.kelasId || '-';
      const ot = (db.orangTua.find(o => o.id === s.id) || {}) as Partial<OrangTua>;
      const akad = (db.akademik.find(a => a.id === s.id) || {}) as Partial<Akademik>;
      const kes = (db.kesehatan.find(h => h.id === s.id) || {}) as Partial<Kesehatan>;
      const eko = (db.ekonomi.find(e => e.id === s.id) || {}) as Partial<Ekonomi>;
      const psi = (db.psikologi.find(p => p.id === s.id) || {}) as Partial<Psikologi>;
      const pr = db.prestasi.filter(p => p.siswaId === s.id);
      
      const daftarPrestasi = pr.map(p => `${p.namaPrestasi} (${p.juara} - ${p.tingkat} ${p.tahun} [${p.kategori || 'Akademik'}])`).join('; ');
      const totalRemisi = (db.remisiPoin || [])
        .filter(r => r.siswaId === s.id)
        .reduce((sum, r) => sum + Number(r.poin), 0);
      const totalPoinPelanggaran = Math.max(0, db.pelanggaran
        .filter(p => p.siswaId === s.id)
        .reduce((sum, p) => sum + Number(p.poin), 0) - totalRemisi);

      return {
        // Core/Biodata
        no: idx + 1,
        id: s.id,
        nis: s.nis || '-',
        nisn: s.nisn || '-',
        nama: s.nama || '-',
        kelas,
        gender: s.jenisKelamin || '-',
        tempatLahir: s.tempatLahir || '-',
        tanggalLahir: s.tanggalLahir || '-',
        agama: s.agama || '-',
        noHp: s.nomorHp || '-',
        email: s.email || '-',
        alamat: s.alamat || '-',
        tahunMasuk: s.tahunMasuk || '-',
        tahunPelajaran: s.tahunPelajaran || db.tahunPelajaran.find(tp => tp.isActive)?.tahun || '2025/2026',
        
        // Orang Tua
        namaAyah: ot.namaAyah || '-',
        statusAyah: ot.statusAyah || '-',
        pekerjaanAyah: ot.pekerjaanAyah || '-',
        noHpAyah: ot.noHpAyah || '-',
        alamatAyah: ot.alamatAyah || '-',
        namaIbu: ot.namaIbu || '-',
        statusIbu: ot.statusIbu || '-',
        pekerjaanIbu: ot.pekerjaanIbu || '-',
        noHpIbu: ot.noHpIbu || '-',
        alamatIbu: ot.alamatIbu || '-',
        wali: ot.wali || '-',
        statusWali: ot.statusWali || '-',
        pekerjaanWali: ot.pekerjaanWali || '-',
        penghasilan: ot.penghasilan || '-',
        pendidikanKeluarga: ot.pendidikanOrangTua || '-',
        
        // Akademik
        rataRataRapor: akad.rataRataRaport || 0,
        catatanWaliKelas: akad.catatanWaliKelas || '-',
        poinPelanggaran: totalPoinPelanggaran,
        
        // Kesehatan
        tinggi: kes.tinggiBadan || '-',
        berat: kes.beratBadan || '-',
        golDarah: kes.golonganDarah || '-',
        riwayatPenyakit: kes.penyakit || '-',
        kelainanFisik: kes.disabilitas || '-',
        catatanMedis: kes.alergi ? `Alergi: ${kes.alergi}` : '-',
        
        // Ekonomi
        statusRumah: eko.statusRumah || '-',
        sumberAir: '-',
        fasilitasBelajar: '-',
        transportasi: eko.kendaraan || '-',
        kip: eko.kip ? 'Penerima KIP' : 'Tidak',
        catatanEkonomi: '-',
        
        // Psikologi
        hobi: psi.hobi || '-',
        bakat: psi.bakat || '-',
        citaCita: psi.citaCita || '-',
        kepribadian: psi.kepribadian || '-',
        catatanPsikologi: psi.gayaBelajar ? `Gaya Belajar: ${psi.gayaBelajar}` : '-',
        
        // Prestasi
        jumlahPrestasi: pr.length,
        daftarPrestasi
      };
    });
  }, [db.siswa, db.kelas, db.orangTua, db.akademik, db.kesehatan, db.ekonomi, db.psikologi, db.prestasi, db.pelanggaran, db.remisiPoin]);

  const filteredSpreadsheetRows = useMemo(() => {
    if (!spreadsheetSearch) return spreadsheetRows;
    const query = spreadsheetSearch.toLowerCase();
    return spreadsheetRows.filter(row => 
      String(row.nama || '').toLowerCase().includes(query) ||
      String(row.nis || '').toLowerCase().includes(query) ||
      String(row.nisn || '').toLowerCase().includes(query) ||
      String(row.kelas || '').toLowerCase().includes(query)
    );
  }, [spreadsheetRows, spreadsheetSearch]);

  const handleExportSpreadsheetCSV = (exportAll = false) => {
    const wb = XLSX.utils.book_new();
    const cat = exportAll ? 'all' : spreadsheetCategory;

    if (cat === 'all') {
      // Define all tabs/sheets configuration for a comprehensive workbook
      const sheetsConfig = [
        {
          name: 'HDS Komprehensif',
          headers: [
            'No', 'ID Siswa', 'NIS', 'NISN', 'Nama Siswa', 'Kelas', 'Jenis Kelamin', 'Tempat Lahir', 'Tanggal Lahir', 'Agama', 'No HP', 'Email', 'Alamat', 'Tahun Masuk', 'Tahun Pelajaran',
            'Nama Ayah', 'Status Ayah', 'Pekerjaan Ayah', 'No HP Ayah', 'Alamat Ayah', 'Nama Ibu', 'Status Ibu', 'Pekerjaan Ibu', 'No HP Ibu', 'Alamat Ibu', 'Nama Wali', 'Status Wali', 'Pekerjaan Wali', 'Penghasilan Gabungan', 'Pendidikan Keluarga',
            'Rata-Rata Rapor', 'Catatan Wali Kelas', 'Total Poin Pelanggaran',
            'Tinggi Badan (cm)', 'Berat Badan (kg)', 'Golongan Darah', 'Riwayat Penyakit', 'Kelainan Fisik', 'Catatan Medis',
            'Status Kepemilikan Rumah', 'Sumber Air', 'Fasilitas Belajar', 'Transportasi Sekolah', 'Penerima KIP/Beasiswa', 'Catatan Ekonomi',
            'Minat/Hobi', 'Bakat Khusus', 'Cita-Cita', 'Kepribadian/Karakter', 'Catatan Psikologis',
            'Jumlah Prestasi', 'Daftar Prestasi'
          ],
          keys: [
            'no', 'id', 'nis', 'nisn', 'nama', 'kelas', 'gender', 'tempatLahir', 'tanggalLahir', 'agama', 'noHp', 'email', 'alamat', 'tahunMasuk', 'tahunPelajaran',
            'namaAyah', 'statusAyah', 'pekerjaanAyah', 'noHpAyah', 'alamatAyah', 'namaIbu', 'statusIbu', 'pekerjaanIbu', 'noHpIbu', 'alamatIbu', 'wali', 'statusWali', 'pekerjaanWali', 'penghasilan', 'pendidikanKeluarga',
            'rataRataRapor', 'catatanWaliKelas', 'poinPelanggaran',
            'tinggi', 'berat', 'golDarah', 'riwayatPenyakit', 'kelainanFisik', 'catatanMedis',
            'statusRumah', 'sumberAir', 'fasilitasBelajar', 'transportasi', 'kip', 'catatanEkonomi',
            'hobi', 'bakat', 'citaCita', 'kepribadian', 'catatanPsikologi',
            'jumlahPrestasi', 'daftarPrestasi'
          ]
        },
        {
          name: 'Biodata Siswa',
          headers: ['No', 'NIS', 'NISN', 'Nama Siswa', 'Kelas', 'Gender', 'Tempat Lahir', 'Tanggal Lahir', 'Agama', 'No HP', 'Email', 'Alamat', 'Tahun Masuk', 'Tahun Pelajaran'],
          keys: ['no', 'nis', 'nisn', 'nama', 'kelas', 'gender', 'tempatLahir', 'tanggalLahir', 'agama', 'noHp', 'email', 'alamat', 'tahunMasuk', 'tahunPelajaran']
        },
        {
          name: 'Data Orang Tua',
          headers: ['No', 'Nama Siswa', 'Nama Ayah', 'Status Ayah', 'Pekerjaan Ayah', 'No HP Ayah', 'Nama Ibu', 'Status Ibu', 'Pekerjaan Ibu', 'No HP Ibu', 'Wali', 'Penghasilan Gabungan', 'Pendidikan Keluarga'],
          keys: ['no', 'nama', 'namaAyah', 'statusAyah', 'pekerjaanAyah', 'noHpAyah', 'namaIbu', 'statusIbu', 'pekerjaanIbu', 'noHpIbu', 'wali', 'penghasilan', 'pendidikanKeluarga']
        },
        {
          name: 'Akademik Siswa',
          headers: ['No', 'Nama Siswa', 'Kelas', 'Rata-Rata Rapor', 'Catatan Wali Kelas', 'Total Poin Pelanggaran'],
          keys: ['no', 'nama', 'kelas', 'rataRataRapor', 'catatanWaliKelas', 'poinPelanggaran']
        },
        {
          name: 'Kesehatan Siswa',
          headers: ['No', 'Nama Siswa', 'Tinggi (cm)', 'Berat (kg)', 'Golongan Darah', 'Riwayat Penyakit', 'Kelainan Fisik', 'Catatan Medis'],
          keys: ['no', 'nama', 'tinggi', 'berat', 'golDarah', 'riwayatPenyakit', 'kelainanFisik', 'catatanMedis']
        },
        {
          name: 'Kondisi Ekonomi',
          headers: ['No', 'Nama Siswa', 'Status Rumah', 'Sumber Air', 'Fasilitas Belajar', 'Transportasi Sekolah', 'Beasiswa/KIP', 'Catatan Ekonomi'],
          keys: ['no', 'nama', 'statusRumah', 'sumberAir', 'fasilitasBelajar', 'transportasi', 'kip', 'catatanEkonomi']
        },
        {
          name: 'Profil Psikologi',
          headers: ['No', 'Nama Siswa', 'Minat & Hobi', 'Bakat Khusus', 'Cita-Cita', 'Karakter & Kepribadian', 'Catatan Psikologis'],
          keys: ['no', 'nama', 'hobi', 'bakat', 'citaCita', 'kepribadian', 'catatanPsikologi']
        },
        {
          name: 'Prestasi Siswa',
          headers: ['No', 'Nama Siswa', 'Jumlah Prestasi', 'Rincian Prestasi'],
          keys: ['no', 'nama', 'jumlahPrestasi', 'daftarPrestasi']
        }
      ];

      sheetsConfig.forEach(sheetConf => {
        const aoaData = [sheetConf.headers];
        filteredSpreadsheetRows.forEach(row => {
          const values = sheetConf.keys.map(key => {
            const val = (row as any)[key];
            return val === null || val === undefined ? '' : val;
          });
          aoaData.push(values);
        });
        const ws = XLSX.utils.aoa_to_sheet(aoaData);
        XLSX.utils.book_append_sheet(wb, ws, sheetConf.name);
      });

      XLSX.writeFile(wb, `hds_komprehensif_excel_${new Date().toISOString().split('T')[0]}.xlsx`);
    } else {
      // Export single active sheet
      let headers: string[] = [];
      let keys: string[] = [];
      let sheetName = 'Sheet1';
      let fileName = '';

      if (cat === 'biodata') {
        headers = ['No', 'NIS', 'NISN', 'Nama Siswa', 'Kelas', 'Gender', 'Tempat Lahir', 'Tanggal Lahir', 'Agama', 'No HP', 'Email', 'Alamat', 'Tahun Masuk', 'Tahun Pelajaran'];
        keys = ['no', 'nis', 'nisn', 'nama', 'kelas', 'gender', 'tempatLahir', 'tanggalLahir', 'agama', 'noHp', 'email', 'alamat', 'tahunMasuk', 'tahunPelajaran'];
        sheetName = 'Biodata Siswa';
        fileName = `hds_biodata_siswa_${new Date().toISOString().split('T')[0]}.xlsx`;
      } else if (cat === 'orangtua') {
        headers = ['No', 'Nama Siswa', 'Nama Ayah', 'Status Ayah', 'Pekerjaan Ayah', 'No HP Ayah', 'Nama Ibu', 'Status Ibu', 'Pekerjaan Ibu', 'No HP Ibu', 'Wali', 'Penghasilan Gabungan', 'Pendidikan Keluarga'];
        keys = ['no', 'nama', 'namaAyah', 'statusAyah', 'pekerjaanAyah', 'noHpAyah', 'namaIbu', 'statusIbu', 'pekerjaanIbu', 'noHpIbu', 'wali', 'penghasilan', 'pendidikanKeluarga'];
        sheetName = 'Data Orang Tua';
        fileName = `hds_data_orangtua_${new Date().toISOString().split('T')[0]}.xlsx`;
      } else if (cat === 'akademik') {
        headers = ['No', 'Nama Siswa', 'Kelas', 'Tahun Pelajaran', 'Rata-Rata Rapor', 'Catatan Wali Kelas', 'Total Poin Pelanggaran'];
        keys = ['no', 'nama', 'kelas', 'tahunPelajaran', 'rataRataRapor', 'catatanWaliKelas', 'poinPelanggaran'];
        sheetName = 'Akademik Siswa';
        fileName = `hds_akademik_siswa_${new Date().toISOString().split('T')[0]}.xlsx`;
      } else if (cat === 'kesehatan') {
        headers = ['No', 'Nama Siswa', 'Tinggi (cm)', 'Berat (kg)', 'Golongan Darah', 'Riwayat Penyakit', 'Kelainan Fisik', 'Catatan Medis'];
        keys = ['no', 'nama', 'tinggi', 'berat', 'golDarah', 'riwayatPenyakit', 'kelainanFisik', 'catatanMedis'];
        sheetName = 'Kesehatan Siswa';
        fileName = `hds_kesehatan_siswa_${new Date().toISOString().split('T')[0]}.xlsx`;
      } else if (cat === 'ekonomi') {
        headers = ['No', 'Nama Siswa', 'Status Rumah', 'Sumber Air', 'Fasilitas Belajar', 'Transportasi Sekolah', 'Beasiswa/KIP', 'Catatan Ekonomi'];
        keys = ['no', 'nama', 'statusRumah', 'sumberAir', 'fasilitasBelajar', 'transportasi', 'kip', 'catatanEkonomi'];
        sheetName = 'Kondisi Ekonomi';
        fileName = `hds_kondisi_ekonomi_${new Date().toISOString().split('T')[0]}.xlsx`;
      } else if (cat === 'psikologi') {
        headers = ['No', 'Nama Siswa', 'Minat & Hobi', 'Bakat Khusus', 'Cita-Cita', 'Karakter & Kepribadian', 'Catatan Psikologis'];
        keys = ['no', 'nama', 'hobi', 'bakat', 'citaCita', 'kepribadian', 'catatanPsikologi'];
        sheetName = 'Profil Psikologi';
        fileName = `hds_profil_psikologi_${new Date().toISOString().split('T')[0]}.xlsx`;
      } else if (cat === 'prestasi') {
        headers = ['No', 'Nama Siswa', 'Jumlah Prestasi', 'Rincian Prestasi'];
        keys = ['no', 'nama', 'jumlahPrestasi', 'daftarPrestasi'];
        sheetName = 'Prestasi Siswa';
        fileName = `hds_prestasi_siswa_${new Date().toISOString().split('T')[0]}.xlsx`;
      }

      const aoaData = [headers];
      filteredSpreadsheetRows.forEach(row => {
        const values = keys.map(key => {
          const val = (row as any)[key];
          return val === null || val === undefined ? '' : val;
        });
        aoaData.push(values);
      });

      const ws = XLSX.utils.aoa_to_sheet(aoaData);
      XLSX.utils.book_append_sheet(wb, ws, sheetName);
      XLSX.writeFile(wb, fileName);
    }
  };

  return (
    <div id="siswa-management-panel" className="space-y-6">
      
      {/* Header section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Himpunan Data Siswa (HDS)</h2>
          <p className="text-xs text-slate-500">Kelola informasi komprehensif, biodata, rekam psikologis, medis, dan akademis siswa.</p>
        </div>
        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          {!isStudent && (
            <button
              type="button"
              onClick={handleDownloadExcelTemplate}
              className="flex-1 sm:flex-initial bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200 font-semibold text-xs px-4 py-2.5 rounded-xl shadow-sm flex items-center justify-center gap-2 hover:-translate-y-0.5 transition-all duration-200 cursor-pointer"
              title="Unduh template Excel resmi (format CSV)"
            >
              <Download size={16} /> Unduh Template Excel
            </button>
          )}
          {canModify && (
            <label className="flex-1 sm:flex-initial bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 font-semibold text-xs px-4 py-2.5 rounded-xl shadow-sm flex items-center justify-center gap-2 hover:-translate-y-0.5 transition-all duration-200 cursor-pointer select-none">
              <Upload size={16} />
              <span>{isImporting ? 'Mengimpor...' : 'Impor dari Excel'}</span>
              <input
                type="file"
                accept=".csv"
                onChange={handleImportExcel}
                disabled={isImporting}
                className="hidden"
              />
            </label>
          )}
          {!isStudent && (
            <button
              type="button"
              onClick={() => setIsSpreadsheetViewOpen(true)}
              className="flex-1 sm:flex-initial bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 font-semibold text-xs px-4 py-2.5 rounded-xl shadow-sm flex items-center justify-center gap-2 hover:-translate-y-0.5 transition-all duration-200 cursor-pointer"
            >
              <FileSpreadsheet size={16} className="text-emerald-600" /> Integrasi Excel (Grid)
            </button>
          )}
          {onRefresh && (
            <button
              type="button"
              onClick={handleSyncData}
              disabled={isSyncing}
              className="flex-1 sm:flex-initial bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 font-semibold text-xs px-4 py-2.5 rounded-xl shadow-sm flex items-center justify-center gap-2 hover:-translate-y-0.5 transition-all duration-200 cursor-pointer disabled:opacity-60 disabled:hover:translate-y-0"
              title="Perbarui & Sinkronisasikan Data dari Google Sheets"
            >
              <RefreshCw size={16} className={isSyncing ? 'animate-spin' : ''} />
              <span>{isSyncing ? 'Memperbarui...' : 'Perbarui & Sinkron Data'}</span>
            </button>
          )}
          {canModify && (
            <button 
              type="button"
              onClick={() => openSiswaEditor(null)}
              className="flex-1 sm:flex-initial bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs px-4 py-2.5 rounded-xl shadow-sm flex items-center justify-center gap-2 hover:-translate-y-0.5 transition-all duration-200 cursor-pointer"
            >
              <UserPlus size={16} /> Tambah Siswa Baru
            </button>
          )}
        </div>
      </div>

      {/* Main layout splitting List and Detail Overlay */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        {/* Left 2 Columns: Directory List */}
        {!isStudent && (
          <div className="xl:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden flex flex-col justify-between">
          <div>
            {/* Filter and Search Bar */}
            <div className="p-4 bg-slate-50/50 border-b border-slate-100 grid grid-cols-1 sm:grid-cols-4 gap-3">
              <div className="relative sm:col-span-1">
                <Search className="absolute left-3 top-2.5 text-slate-400" size={16} />
                <input 
                  type="text" 
                  placeholder="Cari nama, NIS, NISN..." 
                  value={searchQuery}
                  onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                  className="pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-xl text-xs w-full focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/30"
                />
              </div>

              {/* Class Filter */}
              <div>
                <select 
                  value={selectedKelas} 
                  onChange={(e) => { setSelectedKelas(e.target.value); setCurrentPage(1); }}
                  className="px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs w-full focus:outline-none focus:border-emerald-500"
                >
                  <option value="All">Semua Kelas</option>
                  {db.kelas.map(k => <option key={k.id} value={k.id}>{k.namaKelas}</option>)}
                </select>
              </div>

              {/* Sorting Filter */}
              <div>
                <select 
                  value={`${sortBy}-${sortOrder}`} 
                  onChange={(e) => { 
                    const [field, order] = e.target.value.split('-');
                    setSortBy(field as any);
                    setSortOrder(order as any);
                  }}
                  className="px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs w-full focus:outline-none focus:border-emerald-500"
                >
                  <option value="nama-asc">Nama (A-Z)</option>
                  <option value="nama-desc">Nama (Z-A)</option>
                  <option value="nis-asc">NIS Terkecil</option>
                  <option value="nis-desc">NIS Terbesar</option>
                </select>
              </div>
            </div>

            {/* Students List Grid */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 font-bold uppercase tracking-wider">
                    <th className="py-3 px-4">Siswa</th>
                    <th className="py-3 px-4">NIS / NISN</th>
                    <th className="py-3 px-4">Kelas / Rombel</th>
                    <th className="py-3 px-4">Gender</th>
                    <th className="py-3 px-4 text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {paginatedStudents.length > 0 ? (
                    paginatedStudents.map((s) => {
                      const kelasNama = db.kelas.find(k => k.id === s.kelasId || k.namaKelas.toLowerCase().trim() === s.kelasId?.toLowerCase().trim())?.namaKelas || s.kelasId || '-';
                      return (
                        <tr key={s.id} className="hover:bg-slate-50/50 transition-all">
                          <td className="py-3.5 px-4 flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-slate-100 flex-shrink-0 overflow-hidden border border-slate-200/50 flex items-center justify-center">
                              {s.foto ? (
                                <img src={s.foto} alt={s.nama} className="w-full h-full object-cover" />
                              ) : (
                                <span className="font-bold text-slate-500 uppercase">{s.nama.slice(0, 2)}</span>
                              )}
                            </div>
                            <div>
                              <p className="font-bold text-slate-700">{s.nama}</p>
                              <div className="flex flex-wrap items-center gap-1.5 text-[10px] text-slate-400 font-medium">
                                <span>Masuk: {s.tahunMasuk}</span>
                                <span>•</span>
                                <span>TP: {s.tahunPelajaran || db.tahunPelajaran.find(tp => tp.isActive)?.tahun || '2025/2026'}</span>
                              </div>
                            </div>
                          </td>
                          <td className="py-3.5 px-4 font-mono text-slate-600">
                            <div>{s.nis}</div>
                            <div className="text-[10px] text-slate-400">{s.nisn}</div>
                          </td>
                          <td className="py-3.5 px-4 font-semibold text-slate-600">
                            {kelasNama}
                          </td>
                          <td className="py-3.5 px-4">
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              s.jenisKelamin === 'Laki-laki' ? 'bg-teal-50 text-teal-700' : 'bg-rose-50 text-rose-700'
                            }`}>
                              {s.jenisKelamin}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-center">
                            <div className="flex justify-center items-center gap-1.5">
                              <button 
                                onClick={() => { setViewingSiswa(s); setActiveDetailTab('bio'); }}
                                title="Lihat Profil"
                                className="p-1.5 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 rounded-lg transition"
                              >
                                <Eye size={14} />
                              </button>
                              {canModify && (
                                <>
                                  <button 
                                    onClick={() => openSiswaEditor(s)}
                                    title="Edit Siswa"
                                    className="p-1.5 bg-slate-100 text-slate-600 hover:bg-slate-200 rounded-lg transition"
                                  >
                                    <Edit2 size={14} />
                                  </button>
                                  <button 
                                    onClick={() => handleDeleteClick(s.id)}
                                    title="Hapus Siswa"
                                    className="p-1.5 bg-rose-50 text-rose-600 hover:bg-rose-100 rounded-lg transition"
                                  >
                                    <Trash2 size={14} />
                                  </button>
                                </>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-slate-400 font-medium">
                        Tidak ada data siswa ditemukan.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination bar */}
          {totalPages > 1 && (
            <div className="p-4 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs text-slate-500 font-medium">
                Menampilkan {(currentPage - 1) * itemsPerPage + 1} - {Math.min(currentPage * itemsPerPage, filteredStudents.length)} dari {filteredStudents.length} siswa
              </span>
              <div className="flex items-center gap-1.5">
                <button 
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  className="p-1.5 bg-slate-100 hover:bg-slate-200 disabled:opacity-50 disabled:pointer-events-none rounded-lg text-slate-600 transition"
                >
                  <ChevronLeft size={16} />
                </button>
                <span className="text-xs font-bold px-3 text-slate-700">Halaman {currentPage} dari {totalPages}</span>
                <button 
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  className="p-1.5 bg-slate-100 hover:bg-slate-200 disabled:opacity-50 disabled:pointer-events-none rounded-lg text-slate-600 transition"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}
        </div>
        )}

        {/* Right 1 Column: Complete Profile Context Detail Viewer */}
        <div className={`${isStudent ? 'xl:col-span-3' : ''} bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden min-h-[500px]`}>
          {viewingSiswa ? (
            <div className="flex flex-col h-full">
              {/* Cover profile header */}
              <div className="bg-gradient-to-br from-emerald-500 to-teal-600 p-5 text-white flex flex-col items-center text-center relative animate-fade-in">
                {(isStudent || canModify) && (
                  <button 
                    onClick={() => openSiswaEditor(viewingSiswa)}
                    title="Ubah Data HDS"
                    className="absolute left-3 top-3 px-3 py-1.5 bg-white/15 hover:bg-white/25 active:bg-white/35 text-white text-[10px] font-bold rounded-xl border border-white/20 transition duration-200 flex items-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <Edit2 size={12} />
                    <span>Ubah Data HDS</span>
                  </button>
                )}
                
                {!isStudent && (
                  <button 
                    onClick={() => setViewingSiswa(null)}
                    className="absolute right-3 top-3 p-1.5 bg-white/10 hover:bg-white/20 rounded-full transition text-white"
                  >
                    <X size={16} />
                  </button>
                )}
                
                <div className="w-20 h-20 rounded-full bg-white/20 border-2 border-white/50 overflow-hidden flex items-center justify-center shadow-md">
                  {viewingSiswa.foto ? (
                    <img src={viewingSiswa.foto} alt={viewingSiswa.nama} className="w-full h-full object-cover" />
                  ) : (
                    <span className="font-bold text-2xl uppercase text-white">{viewingSiswa.nama.slice(0, 2)}</span>
                  )}
                </div>
                
                <h3 className="font-bold text-sm mt-3">{viewingSiswa.nama}</h3>
                <p className="text-[10px] text-emerald-100">NIS: {viewingSiswa.nis} | {(() => { const name = db.kelas.find(k => k.id === viewingSiswa.kelasId || k.namaKelas.toLowerCase().trim() === viewingSiswa.kelasId?.toLowerCase().trim())?.namaKelas || viewingSiswa.kelasId || '-'; return name.startsWith('Kelas ') ? name : `Kelas ${name}`; })()}</p>
                
                {/* Visual points tracker */}
                {(() => {
                  const originalPts = db.pelanggaran.filter(p => p.siswaId === viewingSiswa.id).reduce((sum, p) => sum + Number(p.poin), 0);
                  const remisiPts = (db.remisiPoin || []).filter(r => r.siswaId === viewingSiswa.id).reduce((sum, r) => sum + Number(r.poin), 0);
                  const pts = Math.max(0, originalPts - remisiPts);
                  return (
                    <span className={`mt-3 text-[10px] font-bold px-3 py-1 rounded-full ${
                      pts > 100 ? 'bg-rose-600 text-white animate-pulse' : pts > 50 ? 'bg-amber-500 text-white' : 'bg-emerald-700/50 text-emerald-100'
                    }`}>
                      Pelanggaran: {pts} Poin {remisiPts > 0 ? `(Remisi: -${remisiPts})` : ''}
                    </span>
                  );
                })()}
              </div>

              {/* Nested Navigation Tabs inside Detail Card */}
              <div className="flex bg-slate-50 border-b border-slate-100 text-[11px] font-semibold text-slate-500 overflow-x-auto">
                <button 
                  onClick={() => setActiveDetailTab('bio')}
                  className={`flex-1 py-2 px-3 border-b-2 text-center transition truncate ${
                    activeDetailTab === 'bio' ? 'border-emerald-600 text-emerald-600 bg-white font-bold' : 'border-transparent hover:bg-slate-100'
                  }`}
                >
                  Biodata
                </button>
                <button 
                  onClick={() => setActiveDetailTab('health')}
                  className={`flex-1 py-2 px-3 border-b-2 text-center transition truncate ${
                    activeDetailTab === 'health' ? 'border-emerald-600 text-emerald-600 bg-white font-bold' : 'border-transparent hover:bg-slate-100'
                  }`}
                >
                  Kesehatan
                </button>
                <button 
                  onClick={() => setActiveDetailTab('economy')}
                  className={`flex-1 py-2 px-3 border-b-2 text-center transition truncate ${
                    activeDetailTab === 'economy' ? 'border-emerald-600 text-emerald-600 bg-white font-bold' : 'border-transparent hover:bg-slate-100'
                  }`}
                >
                  Ekonomi
                </button>
                <button 
                  onClick={() => setActiveDetailTab('psycho')}
                  className={`flex-1 py-2 px-3 border-b-2 text-center transition truncate ${
                    activeDetailTab === 'psycho' ? 'border-emerald-600 text-emerald-600 bg-white font-bold' : 'border-transparent hover:bg-slate-100'
                  }`}
                >
                  Psikologi
                </button>
                <button 
                  onClick={() => setActiveDetailTab('history')}
                  className={`flex-1 py-2 px-3 border-b-2 text-center transition truncate ${
                    activeDetailTab === 'history' ? 'border-emerald-600 text-emerald-600 bg-white font-bold' : 'border-transparent hover:bg-slate-100'
                  }`}
                >
                  Riwayat
                </button>
                <button 
                  onClick={() => setActiveDetailTab('achievement')}
                  className={`flex-1 py-2 px-3 border-b-2 text-center transition truncate ${
                    activeDetailTab === 'achievement' ? 'border-emerald-600 text-emerald-600 bg-white font-bold' : 'border-transparent hover:bg-slate-100'
                  }`}
                >
                  Prestasi
                </button>
                <button 
                  onClick={() => setActiveDetailTab('surat_bk')}
                  className={`flex-1 py-2 px-3 border-b-2 text-center transition truncate ${
                    activeDetailTab === 'surat_bk' ? 'border-emerald-600 text-emerald-600 bg-white font-bold' : 'border-transparent hover:bg-slate-100'
                  }`}
                >
                  Surat BK
                </button>
              </div>

              {/* Sub-tab Detail Displays */}
              <div className="p-4 text-xs space-y-4 overflow-y-auto max-h-[350px]">
                
                {/* 1. BIODATA VIEW */}
                {activeDetailTab === 'bio' && (() => {
                  const ot = db.orangTua.find(o => o.id === viewingSiswa.id);
                  const ak = db.akademik.find(a => a.id === viewingSiswa.id);
                  return (
                    <div className="space-y-3">
                      <div>
                        <p className="text-[10px] text-slate-400 uppercase font-semibold">NISN</p>
                        <p className="font-medium text-slate-700">{viewingSiswa.nisn || '-'}</p>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <p className="text-[10px] text-slate-400 uppercase font-semibold">Tahun Masuk</p>
                          <p className="font-medium text-slate-700">{viewingSiswa.tahunMasuk || '-'}</p>
                        </div>
                        <div>
                          <p className="text-[10px] text-slate-400 uppercase font-semibold">Tahun Pelajaran</p>
                          <p className="font-medium text-slate-700">{viewingSiswa.tahunPelajaran || db.tahunPelajaran.find(tp => tp.isActive)?.tahun || '2025/2026'}</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <p className="text-[10px] text-slate-400 uppercase font-semibold">Tempat/Tgl Lahir</p>
                          <p className="font-medium text-slate-700">{viewingSiswa.tempatLahir || '-'}, {viewingSiswa.tanggalLahir}</p>
                        </div>
                        <div>
                          <p className="text-[10px] text-slate-400 uppercase font-semibold">Agama</p>
                          <p className="font-medium text-slate-700">{viewingSiswa.agama}</p>
                        </div>
                      </div>
                      <div>
                        <p className="text-[10px] text-slate-400 uppercase font-semibold">Kontak</p>
                        <p className="font-medium text-slate-700">{viewingSiswa.nomorHp} | {viewingSiswa.email}</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-slate-400 uppercase font-semibold">Alamat Rumah</p>
                        <p className="font-medium text-slate-700 leading-relaxed">
                          {viewingSiswa.alamat}, Ds. {viewingSiswa.desa}, Kec. {viewingSiswa.kecamatan}, {viewingSiswa.kabupaten} - {viewingSiswa.provinsi}
                        </p>
                      </div>
                      {/* Detailed Parent Info */}
                      <div className="border-t border-slate-100 pt-3 space-y-3">
                        <p className="text-[10px] text-indigo-800 uppercase font-bold tracking-wider">Data Orang Tua / Wali</p>
                        
                        {/* Ayah Card */}
                        <div className="bg-slate-50/50 border border-slate-100 p-3 rounded-xl space-y-2">
                          <div className="flex justify-between items-center border-b border-slate-100 pb-1">
                            <span className="font-bold text-[11px] text-slate-700 flex items-center gap-1">👴 BIODATA AYAH</span>
                            <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold uppercase ${
                              ot?.statusAyah === 'Meninggal' ? 'bg-rose-50 text-rose-700' : 'bg-emerald-50 text-emerald-700'
                            }`}>
                              {ot?.statusAyah || 'Hidup'}
                            </span>
                          </div>
                          <div className="grid grid-cols-2 gap-2 text-[11px]">
                            <div>
                              <p className="text-[9px] text-slate-400 font-semibold uppercase">Nama</p>
                              <p className="font-bold text-slate-700">{ot?.namaAyah || '-'}</p>
                            </div>
                            <div>
                              <p className="text-[9px] text-slate-400 font-semibold uppercase">Tempat/Tgl Lahir</p>
                              <p className="font-medium text-slate-700">{(ot?.tempatLahirAyah && ot?.tanggalLahirAyah) ? `${ot.tempatLahirAyah}, ${ot.tanggalLahirAyah}` : (ot?.tempatLahirAyah || ot?.tanggalLahirAyah || '-')}</p>
                            </div>
                            <div>
                              <p className="text-[9px] text-slate-400 font-semibold uppercase">Agama</p>
                              <p className="font-medium text-slate-700">{ot?.agamaAyah || '-'}</p>
                            </div>
                            <div>
                              <p className="text-[9px] text-slate-400 font-semibold uppercase">Pendidikan Terakhir</p>
                              <p className="font-medium text-slate-700">{ot?.pendidikanAyah || '-'}</p>
                            </div>
                            <div>
                              <p className="text-[9px] text-slate-400 font-semibold uppercase">Pekerjaan</p>
                              <p className="font-medium text-slate-700">{ot?.pekerjaanAyah || '-'}</p>
                            </div>
                            <div>
                              <p className="text-[9px] text-slate-400 font-semibold uppercase">No Kontak</p>
                              <p className="font-medium text-slate-700">{ot?.noHpAyah || '-'}</p>
                            </div>
                          </div>
                          <div>
                            <p className="text-[9px] text-slate-400 font-semibold uppercase">Alamat</p>
                            <p className="font-medium text-slate-600 leading-relaxed">{ot?.alamatAyah || '-'}</p>
                          </div>
                        </div>

                        {/* Ibu Card */}
                        <div className="bg-slate-50/50 border border-slate-100 p-3 rounded-xl space-y-2">
                          <div className="flex justify-between items-center border-b border-slate-100 pb-1">
                            <span className="font-bold text-[11px] text-slate-700 flex items-center gap-1">👵 BIODATA IBU</span>
                            <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold uppercase ${
                              ot?.statusIbu === 'Meninggal' ? 'bg-rose-50 text-rose-700' : 'bg-emerald-50 text-emerald-700'
                            }`}>
                              {ot?.statusIbu || 'Hidup'}
                            </span>
                          </div>
                          <div className="grid grid-cols-2 gap-2 text-[11px]">
                            <div>
                              <p className="text-[9px] text-slate-400 font-semibold uppercase">Nama</p>
                              <p className="font-bold text-slate-700">{ot?.namaIbu || '-'}</p>
                            </div>
                            <div>
                              <p className="text-[9px] text-slate-400 font-semibold uppercase">Tempat/Tgl Lahir</p>
                              <p className="font-medium text-slate-700">{(ot?.tempatLahirIbu && ot?.tanggalLahirIbu) ? `${ot.tempatLahirIbu}, ${ot.tanggalLahirIbu}` : (ot?.tempatLahirIbu || ot?.tanggalLahirIbu || '-')}</p>
                            </div>
                            <div>
                              <p className="text-[9px] text-slate-400 font-semibold uppercase">Agama</p>
                              <p className="font-medium text-slate-700">{ot?.agamaIbu || '-'}</p>
                            </div>
                            <div>
                              <p className="text-[9px] text-slate-400 font-semibold uppercase">Pendidikan Terakhir</p>
                              <p className="font-medium text-slate-700">{ot?.pendidikanIbu || '-'}</p>
                            </div>
                            <div>
                              <p className="text-[9px] text-slate-400 font-semibold uppercase">Pekerjaan</p>
                              <p className="font-medium text-slate-700">{ot?.pekerjaanIbu || '-'}</p>
                            </div>
                            <div>
                              <p className="text-[9px] text-slate-400 font-semibold uppercase">No Kontak</p>
                              <p className="font-medium text-slate-700">{ot?.noHpIbu || '-'}</p>
                            </div>
                          </div>
                          <div>
                            <p className="text-[9px] text-slate-400 font-semibold uppercase">Alamat</p>
                            <p className="font-medium text-slate-600 leading-relaxed">{ot?.alamatIbu || '-'}</p>
                          </div>
                        </div>

                        {/* Wali Card */}
                        {(ot?.wali) && (
                          <div className="bg-slate-50/50 border border-slate-100 p-3 rounded-xl space-y-2">
                            <div className="flex justify-between items-center border-b border-slate-100 pb-1">
                              <span className="font-bold text-[11px] text-slate-700 flex items-center gap-1">👤 BIODATA WALI</span>
                              <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold uppercase ${
                                ot?.statusWali === 'Meninggal' ? 'bg-rose-50 text-rose-700' : 'bg-emerald-50 text-emerald-700'
                              }`}>
                                {ot?.statusWali || 'Hidup'}
                              </span>
                            </div>
                            <div className="grid grid-cols-2 gap-2 text-[11px]">
                              <div>
                                <p className="text-[9px] text-slate-400 font-semibold uppercase">Nama</p>
                                <p className="font-bold text-slate-700">{ot?.wali || '-'}</p>
                              </div>
                              <div>
                                <p className="text-[9px] text-slate-400 font-semibold uppercase">Tempat/Tgl Lahir</p>
                                <p className="font-medium text-slate-700">{(ot?.tempatLahirWali && ot?.tanggalLahirWali) ? `${ot.tempatLahirWali}, ${ot.tanggalLahirWali}` : (ot?.tempatLahirWali || ot?.tanggalLahirWali || '-')}</p>
                              </div>
                              <div>
                                <p className="text-[9px] text-slate-400 font-semibold uppercase">Agama</p>
                                <p className="font-medium text-slate-700">{ot?.agamaWali || '-'}</p>
                              </div>
                              <div>
                                <p className="text-[9px] text-slate-400 font-semibold uppercase">Pendidikan Terakhir</p>
                                <p className="font-medium text-slate-700">{ot?.pendidikanWali || '-'}</p>
                              </div>
                              <div>
                                <p className="text-[9px] text-slate-400 font-semibold uppercase">Pekerjaan</p>
                                <p className="font-medium text-slate-700">{ot?.pekerjaanWali || '-'}</p>
                              </div>
                              <div>
                                <p className="text-[9px] text-slate-400 font-semibold uppercase">No Kontak</p>
                                <p className="font-medium text-slate-700">{ot?.noHpWali || '-'}</p>
                              </div>
                            </div>
                            <div>
                              <p className="text-[9px] text-slate-400 font-semibold uppercase">Alamat</p>
                              <p className="font-medium text-slate-600 leading-relaxed">{ot?.alamatWali || '-'}</p>
                            </div>
                          </div>
                        )}
                      </div>
                      {ak && (
                        <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                          <p className="text-[10px] text-emerald-800 font-bold uppercase mb-1">Catatan Akademik</p>
                          <p className="font-medium text-slate-700">Rata-rata Rapor: <span className="font-bold text-emerald-600">{ak.rataRataRaport}</span></p>
                          <p className="text-slate-500 mt-1 italic">&ldquo;{ak.catatanWaliKelas}&rdquo;</p>
                        </div>
                      )}
                    </div>
                  );
                })()}

                {/* 2. KESEHATAN VIEW */}
                {activeDetailTab === 'health' && (() => {
                  const ks = db.kesehatan.find(k => k.id === viewingSiswa.id);
                  return ks ? (
                    <div className="space-y-3">
                      <div className="grid grid-cols-3 gap-2">
                        <div className="bg-slate-50 p-2 rounded-xl text-center">
                          <p className="text-[10px] text-slate-400 font-semibold">Tinggi</p>
                          <p className="font-bold text-slate-700 text-sm">{ks.tinggiBadan} cm</p>
                        </div>
                        <div className="bg-slate-50 p-2 rounded-xl text-center">
                          <p className="text-[10px] text-slate-400 font-semibold">Berat</p>
                          <p className="font-bold text-slate-700 text-sm">{ks.beratBadan} kg</p>
                        </div>
                        <div className="bg-slate-50 p-2 rounded-xl text-center">
                          <p className="text-[10px] text-slate-400 font-semibold">Gol Darah</p>
                          <p className="font-bold text-slate-700 text-sm">Gol {ks.golonganDarah || '-'}</p>
                        </div>
                      </div>
                      <div>
                        <p className="text-[10px] text-slate-400 uppercase font-semibold">Penyakit Bawaan</p>
                        <p className="font-semibold text-rose-700">{ks.penyakit || '-'}</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-slate-400 uppercase font-semibold">Alergi</p>
                        <p className="font-semibold text-amber-700">{ks.alergi || '-'}</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-slate-400 uppercase font-semibold">Kondisi Disabilitas</p>
                        <p className="font-medium text-slate-700">{ks.disabilitas || '-'}</p>
                      </div>
                    </div>
                  ) : (
                    <p className="text-center text-slate-400 py-4">Data kesehatan belum diisi.</p>
                  );
                })()}

                {/* 3. EKONOMI VIEW */}
                {activeDetailTab === 'economy' && (() => {
                  const ek = db.ekonomi.find(e => e.id === viewingSiswa.id);
                  const ot = db.orangTua.find(o => o.id === viewingSiswa.id);
                  return ek ? (
                    <div className="space-y-3">
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <p className="text-[10px] text-slate-400 uppercase font-semibold">Status Kepemilikan Rumah</p>
                          <p className="font-medium text-slate-700">{ek.statusRumah}</p>
                        </div>
                        <div>
                          <p className="text-[10px] text-slate-400 uppercase font-semibold">Kendaraan Keluarga</p>
                          <p className="font-medium text-slate-700">{ek.kendaraan}</p>
                        </div>
                      </div>
                      <div>
                        <p className="text-[10px] text-slate-400 uppercase font-semibold">Penghasilan Bulanan Orang Tua</p>
                        <p className="font-semibold text-slate-700">{ot?.penghasilan || ek.penghasilan || '-'}</p>
                      </div>
                      <div className="border-t border-slate-100 pt-3 space-y-2">
                        <p className="text-[10px] text-slate-400 uppercase font-bold">Penerima Bantuan Pemerintah</p>
                        <div className="flex flex-wrap gap-1.5">
                          <span className={`px-2 py-0.5 rounded font-bold text-[10px] ${ek.pip ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-slate-50 text-slate-400'}`}>
                            PIP: {ek.pip ? 'Ya' : 'Tidak'}
                          </span>
                          <span className={`px-2 py-0.5 rounded font-bold text-[10px] ${ek.pkh ? 'bg-indigo-50 text-indigo-700 border border-indigo-200' : 'bg-slate-50 text-slate-400'}`}>
                            PKH: {ek.pkh ? 'Ya' : 'Tidak'}
                          </span>
                          <span className={`px-2 py-0.5 rounded font-bold text-[10px] ${ek.kip ? 'bg-teal-50 text-teal-700 border border-teal-200' : 'bg-slate-50 text-slate-400'}`}>
                            KIP Kuliah: {ek.kip ? 'Ya' : 'Tidak'}
                          </span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <p className="text-center text-slate-400 py-4">Data ekonomi belum diisi.</p>
                  );
                })()}

                {/* 4. PSIKOLOGI VIEW */}
                {activeDetailTab === 'psycho' && (() => {
                  const pk = db.psikologi.find(p => p.id === viewingSiswa.id);
                  return pk ? (
                    <div className="space-y-3">
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <p className="text-[10px] text-slate-400 uppercase font-semibold">Hobi</p>
                          <p className="font-medium text-slate-700">{pk.hobi || '-'}</p>
                        </div>
                        <div>
                          <p className="text-[10px] text-slate-400 uppercase font-semibold">Cita-Cita</p>
                          <p className="font-semibold text-emerald-700">{pk.citaCita || '-'}</p>
                        </div>
                      </div>
                      <div>
                        <p className="text-[10px] text-slate-400 uppercase font-semibold">Minat</p>
                        <p className="font-medium text-slate-700">{pk.minat || '-'}</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-slate-400 uppercase font-semibold">Bakat Dominan</p>
                        <p className="font-medium text-slate-700">{pk.bakat || '-'}</p>
                      </div>
                      <div className="grid grid-cols-2 gap-2 border-t border-slate-100 pt-2">
                        <div>
                          <p className="text-[10px] text-slate-400 uppercase font-semibold">Gaya Belajar</p>
                          <p className="font-semibold text-indigo-700">{pk.gayaBelajar || '-'}</p>
                        </div>
                        <div>
                          <p className="text-[10px] text-slate-400 uppercase font-semibold">Kepribadian</p>
                          <p className="font-medium text-slate-700">{pk.kepribadian || '-'}</p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <p className="text-center text-slate-400 py-4">Data psikologis belum diisi.</p>
                  );
                })()}

                {/* 5. HISTORY (DISCIPLINARY AND COUNSELING TIMELINE) */}
                {activeDetailTab === 'history' && (() => {
                  const vl = db.pelanggaran.filter(p => p.siswaId === viewingSiswa.id);
                  const cs = db.konseling.filter(c => c.siswaId === viewingSiswa.id);
                  return (
                    <div className="space-y-4">
                      {/* Counseling logs */}
                      <div className="space-y-2">
                        <p className="text-[10px] uppercase font-bold text-emerald-800 tracking-wider">Histori Layanan Konseling ({cs.length})</p>
                        {cs.length > 0 ? (
                          cs.map(c => (
                            <div key={c.id} className="p-2 bg-emerald-50/50 border border-emerald-100/30 rounded-xl space-y-1">
                              <p className="font-bold text-[10px] text-slate-800">{c.nomorKonseling} - {c.tanggal}</p>
                              <p className="text-slate-600">Masalah: {c.permasalahan}</p>
                              <p className="text-emerald-700 font-semibold italic">Solusi: {c.solusi}</p>
                            </div>
                          ))
                        ) : (
                          <p className="text-[10px] text-slate-400 italic">Belum pernah menempuh konseling.</p>
                        )}
                      </div>

                      {/* Disciplinary violation logs */}
                      <div className="space-y-2 pt-2 border-t border-slate-100">
                        <p className="text-[10px] uppercase font-bold text-rose-800 tracking-wider">Catatan Pelanggaran ({vl.length})</p>
                        {vl.length > 0 ? (
                          vl.map(p => (
                            <div key={p.id} className="p-2 bg-rose-50/30 border border-rose-100/20 rounded-xl flex justify-between items-start">
                              <div>
                                <p className="font-bold text-[10px] text-slate-800">{p.tanggal} - {p.jenisPelanggaran}</p>
                                <p className="text-[10px] text-rose-700">Tindak Lanjut: {p.tindakLanjut}</p>
                              </div>
                              <span className="bg-rose-100 text-rose-700 font-bold px-1.5 py-0.5 rounded text-[10px]">
                                {p.poin} Poin
                              </span>
                            </div>
                          ))
                        ) : (
                          <p className="text-[10px] text-slate-400 italic">Bersih dari catatan pelanggaran.</p>
                        )}
                      </div>

                      {/* Remisi Poin logs */}
                      {(() => {
                        const rems = (db.remisiPoin || []).filter(r => r.siswaId === viewingSiswa.id);
                        return (
                          <div className="space-y-2 pt-2 border-t border-slate-100">
                            <p className="text-[10px] uppercase font-bold text-sky-800 tracking-wider">Catatan Remisi Poin ({rems.length})</p>
                            {rems.length > 0 ? (
                              rems.map(r => (
                                <div key={r.id} className="p-2 bg-sky-50/30 border border-sky-100/20 rounded-xl flex justify-between items-start">
                                  <div>
                                    <p className="font-bold text-[10px] text-slate-800">{r.tanggal} - {r.jenisRemisi}</p>
                                    <p className="text-[10px] text-sky-700">Keterangan: {r.keterangan}</p>
                                    <p className="text-[9px] text-slate-400 mt-0.5">Pemberi: {r.guruPemberi}</p>
                                  </div>
                                  <span className="bg-sky-100 text-sky-700 font-bold px-1.5 py-0.5 rounded text-[10px] whitespace-nowrap">
                                    -{r.poin} Poin
                                  </span>
                                </div>
                              ))
                            ) : (
                              <p className="text-[10px] text-slate-400 italic">Belum ada catatan remisi poin.</p>
                            )}
                          </div>
                        );
                      })()}
                    </div>
                  );
                })()}

                {/* 6. ACHIEVEMENT (PRESTASI) VIEW */}
                {activeDetailTab === 'achievement' && (() => {
                  const pr = db.prestasi.filter(p => p.siswaId === viewingSiswa.id);
                  return (
                    <div className="space-y-4">
                      <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                        <p className="text-[10px] uppercase font-bold text-amber-800 tracking-wider flex items-center gap-1">
                          <Award size={12} className="text-amber-500" /> Raihan Prestasi Siswa ({pr.length})
                        </p>
                        {canModify && !isPrestasiFormOpen && (
                          <button
                            type="button"
                            onClick={() => {
                              setFormPrestasi({
                                siswaId: viewingSiswa.id,
                                namaPrestasi: '',
                                tingkat: 'Sekolah',
                                tahun: new Date().getFullYear().toString(),
                                juara: '',
                                kategori: 'Akademik',
                              });
                              setEditingPrestasiId(null);
                              setIsPrestasiFormOpen(true);
                            }}
                            className="text-[10px] bg-amber-600 text-white font-bold px-2 py-1 rounded-lg hover:bg-amber-700 transition flex items-center gap-1 shadow-sm"
                          >
                            <Plus size={10} /> Tambah Prestasi
                          </button>
                        )}
                      </div>

                      {/* Prestasi Form */}
                      {canModify && isPrestasiFormOpen && (
                        <div className="p-3 bg-amber-50/50 border border-amber-200/50 rounded-xl space-y-3">
                          <p className="font-bold text-[10px] text-amber-900 flex items-center gap-1">
                            🏆 {editingPrestasiId ? 'EDIT PRESTASI' : 'TAMBAH PRESTASI BARU'}
                          </p>
                          <div className="grid grid-cols-2 gap-2">
                            <div className="col-span-2">
                              <label className="block text-[9px] font-bold text-slate-500 mb-0.5">Nama Prestasi / Kegiatan</label>
                              <input
                                type="text"
                                value={formPrestasi.namaPrestasi || ''}
                                onChange={(e) => setFormPrestasi(prev => ({ ...prev, namaPrestasi: e.target.value }))}
                                className="p-2 border border-slate-200 bg-white rounded-lg w-full text-[11px]"
                                placeholder="Contoh: Juara 1 Lomba Matematika"
                                required
                              />
                            </div>
                            <div>
                              <label className="block text-[9px] font-bold text-slate-500 mb-0.5">Kategori</label>
                              <select
                                value={formPrestasi.kategori || 'Akademik'}
                                onChange={(e) => setFormPrestasi(prev => ({ ...prev, kategori: e.target.value as any }))}
                                className="p-2 border border-slate-200 bg-white rounded-lg w-full text-[11px]"
                              >
                                <option value="Akademik">Akademik</option>
                                <option value="Non Akademik">Non Akademik</option>
                              </select>
                            </div>
                            <div>
                              <label className="block text-[9px] font-bold text-slate-500 mb-0.5">Tingkat</label>
                              <select
                                value={formPrestasi.tingkat || 'Sekolah'}
                                onChange={(e) => setFormPrestasi(prev => ({ ...prev, tingkat: e.target.value }))}
                                className="p-2 border border-slate-200 bg-white rounded-lg w-full text-[11px]"
                              >
                                <option value="Sekolah">Sekolah</option>
                                <option value="Kecamatan">Kecamatan</option>
                                <option value="Kabupaten">Kabupaten</option>
                                <option value="Provinsi">Provinsi</option>
                                <option value="Nasional">Nasional</option>
                                <option value="Internasional">Internasional</option>
                              </select>
                            </div>
                            <div>
                              <label className="block text-[9px] font-bold text-slate-500 mb-0.5">Juara / Penghargaan</label>
                              <input
                                type="text"
                                value={formPrestasi.juara || ''}
                                onChange={(e) => setFormPrestasi(prev => ({ ...prev, juara: e.target.value }))}
                                className="p-2 border border-slate-200 bg-white rounded-lg w-full text-[11px]"
                                placeholder="Contoh: Juara I, Harapan III"
                                required
                              />
                            </div>
                            <div>
                              <label className="block text-[9px] font-bold text-slate-500 mb-0.5">Tahun Perolehan</label>
                              <input
                                type="text"
                                value={formPrestasi.tahun || ''}
                                onChange={(e) => setFormPrestasi(prev => ({ ...prev, tahun: e.target.value }))}
                                className="p-2 border border-slate-200 bg-white rounded-lg w-full text-[11px]"
                                placeholder="Contoh: 2026"
                                required
                              />
                            </div>
                          </div>
                          <div className="flex justify-end gap-1.5 pt-1">
                            <button
                              type="button"
                              onClick={() => setIsPrestasiFormOpen(false)}
                              className="px-2 py-1 border border-slate-200 hover:bg-slate-50 rounded-lg font-bold text-[10px]"
                            >
                              Batal
                            </button>
                            <button
                              type="button"
                              onClick={async () => {
                                if (!formPrestasi.namaPrestasi || !formPrestasi.juara || !formPrestasi.tahun) {
                                  alert('Nama Prestasi, Juara, dan Tahun wajib diisi!');
                                  return;
                                }
                                if (onSavePrestasi) {
                                  const payload: Prestasi = {
                                    id: editingPrestasiId || 'pres-' + Date.now(),
                                    siswaId: viewingSiswa.id,
                                    namaPrestasi: formPrestasi.namaPrestasi || '',
                                    tingkat: formPrestasi.tingkat || 'Sekolah',
                                    tahun: formPrestasi.tahun || '',
                                    juara: formPrestasi.juara || '',
                                    sertifikat: formPrestasi.sertifikat || '',
                                    kategori: formPrestasi.kategori || 'Akademik',
                                  };
                                  const ok = await onSavePrestasi(payload, !editingPrestasiId);
                                  if (ok) {
                                    setIsPrestasiFormOpen(false);
                                  }
                                }
                              }}
                              className="px-2.5 py-1 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-lg text-[10px]"
                            >
                              Simpan
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Prestasi List */}
                      <div className="space-y-2">
                        {pr.length > 0 ? (
                          pr.map(p => (
                            <div key={p.id} className="p-2.5 bg-amber-50/20 border border-amber-100/30 rounded-xl flex justify-between items-start gap-2">
                              <div className="space-y-1 flex-1">
                                <div className="flex items-center gap-1.5 flex-wrap">
                                  <span className="font-bold text-[11px] text-slate-800">{p.namaPrestasi}</span>
                                  <span className="bg-amber-100 text-amber-800 text-[9px] px-1.5 py-0.5 rounded-full font-bold">
                                    {p.tingkat}
                                  </span>
                                  <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-bold ${
                                    p.kategori === 'Non Akademik'
                                      ? 'bg-purple-100 text-purple-800'
                                      : 'bg-blue-100 text-blue-800'
                                  }`}>
                                    {p.kategori || 'Akademik'}
                                  </span>
                                </div>
                                <div className="text-[10px] text-slate-500 space-y-0.5">
                                  <p>🏆 Penghargaan: <span className="font-semibold text-amber-700">{p.juara}</span></p>
                                  <p>📅 Tahun: <span className="font-semibold text-slate-600">{p.tahun}</span></p>
                                </div>
                              </div>
                              {canModify && (
                                <div className="flex items-center gap-1">
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setFormPrestasi(p);
                                      setEditingPrestasiId(p.id);
                                      setIsPrestasiFormOpen(true);
                                    }}
                                    className="p-1 text-slate-400 hover:text-blue-600 hover:bg-slate-100 rounded-lg transition"
                                    title="Edit Prestasi"
                                  >
                                    <Edit2 size={10} />
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setDeleteConfirmPrestasiId(p.id);
                                    }}
                                    className="p-1 text-slate-400 hover:text-rose-600 hover:bg-slate-100 rounded-lg transition"
                                    title="Hapus Prestasi"
                                  >
                                    <Trash2 size={10} />
                                  </button>
                                </div>
                              )}
                            </div>
                          ))
                        ) : (
                          <p className="text-[10px] text-slate-400 italic text-center py-4">Siswa belum memiliki catatan prestasi.</p>
                        )}
                      </div>
                    </div>
                  );
                })()}

              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center p-6 text-center text-slate-400 space-y-3">
              <Eye size={40} className="text-slate-300 stroke-1" />
              <div>
                <p className="font-bold text-xs text-slate-600">Profil Siswa Kosong</p>
                <p className="text-[10px] text-slate-400 mt-1 max-w-[200px] mx-auto">Pilih salah satu siswa dari direktori kiri untuk menampilkan rincian komprehensif.</p>
              </div>
            </div>
          )}
        </div>

      </div>

      {/* COMPREHENSIVE CRUD EDITOR MODAL (Multi-tab structure to allow neat forms) */}
      {isEditorOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl border border-slate-100">
            {/* Header */}
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
              <div>
                <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
                  <Sparkles size={16} className="text-emerald-600" />
                  {editingSiswaId ? 'Ubah Informasi HDS Siswa' : 'Daftarkan Siswa Baru'}
                </h3>
                <p className="text-[10px] text-slate-400 mt-0.5">Semua data terintegrasi multi-sheet disimpan dalam satu waktu.</p>
              </div>
              <button 
                onClick={() => setIsEditorOpen(false)}
                className="p-1.5 hover:bg-slate-200 rounded-full transition text-slate-400"
              >
                <X size={18} />
              </button>
            </div>

            {/* Scrollable multi-part form */}
            <form onSubmit={handleSaveSubmit} className="flex-1 overflow-y-auto p-6 space-y-6 text-xs">
              
              {/* Part 1: Biodata & Photo */}
              <div className="space-y-4">
                <span className="font-bold text-emerald-800 flex items-center gap-1.5 text-[11px] uppercase tracking-wider">
                  <FileText size={14} /> 1. Informasi Utama & Biodata Siswa
                </span>
                
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  {/* Photo picker container */}
                  <div className="md:col-span-1 flex flex-col items-center space-y-2">
                    <div className="w-28 h-32 rounded-xl bg-slate-100 border border-slate-200 overflow-hidden flex items-center justify-center relative group">
                      {photoPreview ? (
                        <img src={photoPreview} alt="Siswa Preview" className="w-full h-full object-cover" />
                      ) : (
                        <div className="text-center p-3 text-slate-400">
                          <Camera size={24} className="mx-auto mb-1 stroke-1" />
                          <span className="text-[9px]">Pilih Foto Siswa</span>
                        </div>
                      )}
                      <label className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 flex items-center justify-center cursor-pointer transition text-white text-[10px] font-bold">
                        Ubah Foto
                        <input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
                      </label>
                    </div>
                    {photoPreview && (
                      <button 
                        type="button" 
                        onClick={() => { setPhotoPreview(''); setFormSiswa(prev => ({ ...prev, foto: '' })); }}
                        className="text-[9px] text-rose-600 hover:underline font-semibold"
                      >
                        Hapus Foto
                      </button>
                    )}
                    <div className="text-center max-w-[140px] mt-1 bg-amber-50/70 border border-amber-200 rounded-lg p-1.5">
                      <p className="text-[9px] text-amber-800 leading-normal">
                        Batas upload foto maksimal <strong>10KB</strong>. Silakan lakukan compress pada{' '}
                        <a 
                          href="https://www.simpleimageresizer.com" 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="text-indigo-600 hover:underline font-bold"
                        >
                          Simple Image Resizer
                        </a>
                      </p>
                    </div>
                  </div>

                  {/* Identity Fields */}
                  <div className="md:col-span-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 mb-1">NIS (Nomor Induk Siswa) <span className="text-rose-500">*</span></label>
                      <input 
                        type="text" 
                        value={formSiswa.nis || ''} 
                        onChange={(e) => setFormSiswa(prev => ({ ...prev, nis: e.target.value }))}
                        className="p-2.5 border border-slate-200 rounded-xl w-full"
                        required
                        disabled={!!editingSiswaId}
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 mb-1">NISN <span className="text-rose-500">*</span></label>
                      <input 
                        type="text" 
                        value={formSiswa.nisn || ''} 
                        onChange={(e) => setFormSiswa(prev => ({ ...prev, nisn: e.target.value }))}
                        className="p-2.5 border border-slate-200 rounded-xl w-full"
                        required
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-[10px] font-bold text-slate-500 mb-1">Nama Lengkap Siswa <span className="text-rose-500">*</span></label>
                      <input 
                        type="text" 
                        value={formSiswa.nama || ''} 
                        onChange={(e) => setFormSiswa(prev => ({ ...prev, nama: e.target.value }))}
                        className="p-2.5 border border-slate-200 rounded-xl w-full capitalize"
                        required
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-[10px] font-bold text-slate-500 mb-1">Kelas <span className="text-rose-500">*</span></label>
                      <select 
                        value={formSiswa.kelasId || ''} 
                        onChange={(e) => setFormSiswa(prev => ({ ...prev, kelasId: e.target.value }))}
                        className="p-2.5 border border-slate-200 bg-white rounded-xl w-full"
                        required
                      >
                        {db.kelas.map(k => <option key={k.id} value={k.id}>{k.namaKelas}</option>)}
                      </select>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 mb-1">Jenis Kelamin</label>
                    <select 
                      value={formSiswa.jenisKelamin || 'Laki-laki'} 
                      onChange={(e) => setFormSiswa(prev => ({ ...prev, jenisKelamin: e.target.value as any }))}
                      className="p-2.5 border border-slate-200 bg-white rounded-xl w-full"
                    >
                      <option value="Laki-laki">Laki-laki</option>
                      <option value="Perempuan">Perempuan</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 mb-1">Tempat Lahir</label>
                    <input 
                      type="text" 
                      value={formSiswa.tempatLahir || ''} 
                      onChange={(e) => setFormSiswa(prev => ({ ...prev, tempatLahir: e.target.value }))}
                      className="p-2.5 border border-slate-200 rounded-xl w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 mb-1">Tanggal Lahir</label>
                    <input 
                      type="date" 
                      value={formSiswa.tanggalLahir || ''} 
                      onChange={(e) => setFormSiswa(prev => ({ ...prev, tanggalLahir: e.target.value }))}
                      className="p-2.5 border border-slate-200 rounded-xl w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 mb-1">Agama</label>
                    <select 
                      value={formSiswa.agama || 'Islam'} 
                      onChange={(e) => setFormSiswa(prev => ({ ...prev, agama: e.target.value }))}
                      className="p-2.5 border border-slate-200 bg-white rounded-xl w-full"
                    >
                      <option value="Islam">Islam</option>
                      <option value="Kristen">Kristen</option>
                      <option value="Katolik">Katolik</option>
                      <option value="Hindu">Hindu</option>
                      <option value="Buddha">Buddha</option>
                      <option value="Khonghucu">Khonghucu</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 mb-1">No HP</label>
                    <input 
                      type="tel" 
                      value={formSiswa.nomorHp || ''} 
                      onChange={(e) => setFormSiswa(prev => ({ ...prev, nomorHp: e.target.value }))}
                      className="p-2.5 border border-slate-200 rounded-xl w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 mb-1">Email</label>
                    <input 
                      type="email" 
                      value={formSiswa.email || ''} 
                      onChange={(e) => setFormSiswa(prev => ({ ...prev, email: e.target.value }))}
                      className="p-2.5 border border-slate-200 rounded-xl w-full"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                  <div className="sm:col-span-2">
                    <label className="block text-[10px] font-bold text-slate-500 mb-1">Alamat Jalan</label>
                    <input 
                      type="text" 
                      value={formSiswa.alamat || ''} 
                      onChange={(e) => setFormSiswa(prev => ({ ...prev, alamat: e.target.value }))}
                      className="p-2.5 border border-slate-200 rounded-xl w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 mb-1">Desa / Kelurahan</label>
                    <input 
                      type="text" 
                      value={formSiswa.desa || ''} 
                      onChange={(e) => setFormSiswa(prev => ({ ...prev, desa: e.target.value }))}
                      className="p-2.5 border border-slate-200 rounded-xl w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 mb-1">Kecamatan</label>
                    <input 
                      type="text" 
                      value={formSiswa.kecamatan || ''} 
                      onChange={(e) => setFormSiswa(prev => ({ ...prev, kecamatan: e.target.value }))}
                      className="p-2.5 border border-slate-200 rounded-xl w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 mb-1">Kabupaten</label>
                    <input 
                      type="text" 
                      value={formSiswa.kabupaten || ''} 
                      onChange={(e) => setFormSiswa(prev => ({ ...prev, kabupaten: e.target.value }))}
                      className="p-2.5 border border-slate-200 rounded-xl w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 mb-1">Provinsi</label>
                    <input 
                      type="text" 
                      value={formSiswa.provinsi || ''} 
                      onChange={(e) => setFormSiswa(prev => ({ ...prev, provinsi: e.target.value }))}
                      className="p-2.5 border border-slate-200 rounded-xl w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 mb-1">Tahun Masuk</label>
                    <input 
                      type="text" 
                      value={formSiswa.tahunMasuk || ''} 
                      onChange={(e) => setFormSiswa(prev => ({ ...prev, tahunMasuk: e.target.value }))}
                      className="p-2.5 border border-slate-200 rounded-xl w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 mb-1">Tahun Pelajaran <span className="text-rose-500">*</span></label>
                    <input 
                      type="text" 
                      value={formSiswa.tahunPelajaran || ''} 
                      onChange={(e) => setFormSiswa(prev => ({ ...prev, tahunPelajaran: e.target.value }))}
                      className="p-2.5 border border-slate-200 rounded-xl w-full"
                      placeholder="e.g., 2025/2026"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Part 2: Parents information */}
              <div className="space-y-4 pt-4 border-t border-slate-100">
                <span className="font-bold text-indigo-800 flex items-center gap-1.5 text-[11px] uppercase tracking-wider">
                  <Plus size={14} /> 2. Data Orang Tua / Wali
                </span>
                
                {/* 2.1 BIODATA AYAH */}
                <div className="p-4 bg-slate-50/50 border border-slate-200/60 rounded-xl space-y-3">
                  <p className="font-bold text-[11px] text-slate-700 flex items-center gap-1">👴 FORM BIODATA AYAH</p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 mb-1">Nama Ayah</label>
                      <input 
                        type="text" 
                        value={formOrangTua.namaAyah || ''} 
                        onChange={(e) => setFormOrangTua(prev => ({ ...prev, namaAyah: e.target.value }))}
                        className="p-2.5 border border-slate-200 rounded-xl w-full text-xs"
                        placeholder="Nama Lengkap Ayah"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 mb-1">Status Ayah</label>
                      <select 
                        value={formOrangTua.statusAyah || 'Hidup'} 
                        onChange={(e) => setFormOrangTua(prev => ({ ...prev, statusAyah: e.target.value as any }))}
                        className="p-2.5 border border-slate-200 bg-white rounded-xl w-full text-xs"
                      >
                        <option value="Hidup">Hidup</option>
                        <option value="Meninggal">Meninggal</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 mb-1">Tempat Lahir</label>
                      <input 
                        type="text" 
                        value={formOrangTua.tempatLahirAyah || ''} 
                        onChange={(e) => setFormOrangTua(prev => ({ ...prev, tempatLahirAyah: e.target.value }))}
                        className="p-2.5 border border-slate-200 rounded-xl w-full text-xs"
                        placeholder="Tempat Lahir"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 mb-1">Tanggal Lahir</label>
                      <input 
                        type="date" 
                        value={formOrangTua.tanggalLahirAyah || ''} 
                        onChange={(e) => setFormOrangTua(prev => ({ ...prev, tanggalLahirAyah: e.target.value }))}
                        className="p-2.5 border border-slate-200 rounded-xl w-full text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 mb-1">Agama</label>
                      <select 
                        value={formOrangTua.agamaAyah || 'Islam'} 
                        onChange={(e) => setFormOrangTua(prev => ({ ...prev, agamaAyah: e.target.value }))}
                        className="p-2.5 border border-slate-200 bg-white rounded-xl w-full text-xs"
                      >
                        <option value="Islam">Islam</option>
                        <option value="Kristen">Kristen</option>
                        <option value="Katolik">Katolik</option>
                        <option value="Hindu">Hindu</option>
                        <option value="Buddha">Buddha</option>
                        <option value="Khonghucu">Khonghucu</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 mb-1">Pendidikan Terakhir</label>
                      <select 
                        value={formOrangTua.pendidikanAyah || 'SMA'} 
                        onChange={(e) => setFormOrangTua(prev => ({ ...prev, pendidikanAyah: e.target.value }))}
                        className="p-2.5 border border-slate-200 bg-white rounded-xl w-full text-xs"
                      >
                        <option value="SD">SD</option>
                        <option value="SMP">SMP</option>
                        <option value="SMA">SMA / Sederajat</option>
                        <option value="D3">Diploma (D3)</option>
                        <option value="S1">Sarjana (S1)</option>
                        <option value="S2/S3">Pascasarjana (S2 / S3)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 mb-1">Pekerjaan</label>
                      <input 
                        type="text" 
                        value={formOrangTua.pekerjaanAyah || ''} 
                        onChange={(e) => setFormOrangTua(prev => ({ ...prev, pekerjaanAyah: e.target.value }))}
                        className="p-2.5 border border-slate-200 rounded-xl w-full text-xs"
                        placeholder="Pekerjaan"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 mb-1">No Kontak (HP)</label>
                      <input 
                        type="tel" 
                        value={formOrangTua.noHpAyah || ''} 
                        onChange={(e) => setFormOrangTua(prev => ({ ...prev, noHpAyah: e.target.value }))}
                        className="p-2.5 border border-slate-200 rounded-xl w-full text-xs"
                        placeholder="No HP"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 mb-1">Alamat Ayah</label>
                      <input 
                        type="text" 
                        value={formOrangTua.alamatAyah || ''} 
                        onChange={(e) => setFormOrangTua(prev => ({ ...prev, alamatAyah: e.target.value }))}
                        className="p-2.5 border border-slate-200 rounded-xl w-full text-xs"
                        placeholder="Alamat Lengkap"
                      />
                    </div>
                  </div>
                </div>

                {/* 2.2 BIODATA IBU */}
                <div className="p-4 bg-slate-50/50 border border-slate-200/60 rounded-xl space-y-3">
                  <p className="font-bold text-[11px] text-slate-700 flex items-center gap-1">👵 FORM BIODATA IBU</p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 mb-1">Nama Ibu</label>
                      <input 
                        type="text" 
                        value={formOrangTua.namaIbu || ''} 
                        onChange={(e) => setFormOrangTua(prev => ({ ...prev, namaIbu: e.target.value }))}
                        className="p-2.5 border border-slate-200 rounded-xl w-full text-xs"
                        placeholder="Nama Lengkap Ibu"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 mb-1">Status Ibu</label>
                      <select 
                        value={formOrangTua.statusIbu || 'Hidup'} 
                        onChange={(e) => setFormOrangTua(prev => ({ ...prev, statusIbu: e.target.value as any }))}
                        className="p-2.5 border border-slate-200 bg-white rounded-xl w-full text-xs"
                      >
                        <option value="Hidup">Hidup</option>
                        <option value="Meninggal">Meninggal</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 mb-1">Tempat Lahir</label>
                      <input 
                        type="text" 
                        value={formOrangTua.tempatLahirIbu || ''} 
                        onChange={(e) => setFormOrangTua(prev => ({ ...prev, tempatLahirIbu: e.target.value }))}
                        className="p-2.5 border border-slate-200 rounded-xl w-full text-xs"
                        placeholder="Tempat Lahir"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 mb-1">Tanggal Lahir</label>
                      <input 
                        type="date" 
                        value={formOrangTua.tanggalLahirIbu || ''} 
                        onChange={(e) => setFormOrangTua(prev => ({ ...prev, tanggalLahirIbu: e.target.value }))}
                        className="p-2.5 border border-slate-200 rounded-xl w-full text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 mb-1">Agama</label>
                      <select 
                        value={formOrangTua.agamaIbu || 'Islam'} 
                        onChange={(e) => setFormOrangTua(prev => ({ ...prev, agamaIbu: e.target.value }))}
                        className="p-2.5 border border-slate-200 bg-white rounded-xl w-full text-xs"
                      >
                        <option value="Islam">Islam</option>
                        <option value="Kristen">Kristen</option>
                        <option value="Katolik">Katolik</option>
                        <option value="Hindu">Hindu</option>
                        <option value="Buddha">Buddha</option>
                        <option value="Khonghucu">Khonghucu</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 mb-1">Pendidikan Terakhir</label>
                      <select 
                        value={formOrangTua.pendidikanIbu || 'SMA'} 
                        onChange={(e) => setFormOrangTua(prev => ({ ...prev, pendidikanIbu: e.target.value }))}
                        className="p-2.5 border border-slate-200 bg-white rounded-xl w-full text-xs"
                      >
                        <option value="SD">SD</option>
                        <option value="SMP">SMP</option>
                        <option value="SMA">SMA / Sederajat</option>
                        <option value="D3">Diploma (D3)</option>
                        <option value="S1">Sarjana (S1)</option>
                        <option value="S2/S3">Pascasarjana (S2 / S3)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 mb-1">Pekerjaan</label>
                      <input 
                        type="text" 
                        value={formOrangTua.pekerjaanIbu || ''} 
                        onChange={(e) => setFormOrangTua(prev => ({ ...prev, pekerjaanIbu: e.target.value }))}
                        className="p-2.5 border border-slate-200 rounded-xl w-full text-xs"
                        placeholder="Pekerjaan"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 mb-1">No Kontak (HP)</label>
                      <input 
                        type="tel" 
                        value={formOrangTua.noHpIbu || ''} 
                        onChange={(e) => setFormOrangTua(prev => ({ ...prev, noHpIbu: e.target.value }))}
                        className="p-2.5 border border-slate-200 rounded-xl w-full text-xs"
                        placeholder="No HP"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 mb-1">Alamat Ibu</label>
                      <input 
                        type="text" 
                        value={formOrangTua.alamatIbu || ''} 
                        onChange={(e) => setFormOrangTua(prev => ({ ...prev, alamatIbu: e.target.value }))}
                        className="p-2.5 border border-slate-200 rounded-xl w-full text-xs"
                        placeholder="Alamat Lengkap"
                      />
                    </div>
                  </div>
                </div>

                {/* 2.3 BIODATA WALI (OPSIONAL) */}
                <div className="p-4 bg-slate-50/50 border border-slate-200/60 rounded-xl space-y-3">
                  <p className="font-bold text-[11px] text-slate-700 flex items-center gap-1">👤 FORM BIODATA WALI (OPSIONAL)</p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 mb-1">Nama Wali</label>
                      <input 
                        type="text" 
                        value={formOrangTua.wali || ''} 
                        onChange={(e) => setFormOrangTua(prev => ({ ...prev, wali: e.target.value }))}
                        className="p-2.5 border border-slate-200 rounded-xl w-full text-xs"
                        placeholder="Nama Lengkap Wali"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 mb-1">Status Wali</label>
                      <select 
                        value={formOrangTua.statusWali || 'Hidup'} 
                        onChange={(e) => setFormOrangTua(prev => ({ ...prev, statusWali: e.target.value as any }))}
                        className="p-2.5 border border-slate-200 bg-white rounded-xl w-full text-xs"
                      >
                        <option value="Hidup">Hidup</option>
                        <option value="Meninggal">Meninggal</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 mb-1">Tempat Lahir</label>
                      <input 
                        type="text" 
                        value={formOrangTua.tempatLahirWali || ''} 
                        onChange={(e) => setFormOrangTua(prev => ({ ...prev, tempatLahirWali: e.target.value }))}
                        className="p-2.5 border border-slate-200 rounded-xl w-full text-xs"
                        placeholder="Tempat Lahir"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 mb-1">Tanggal Lahir</label>
                      <input 
                        type="date" 
                        value={formOrangTua.tanggalLahirWali || ''} 
                        onChange={(e) => setFormOrangTua(prev => ({ ...prev, tanggalLahirWali: e.target.value }))}
                        className="p-2.5 border border-slate-200 rounded-xl w-full text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 mb-1">Agama</label>
                      <select 
                        value={formOrangTua.agamaWali || 'Islam'} 
                        onChange={(e) => setFormOrangTua(prev => ({ ...prev, agamaWali: e.target.value }))}
                        className="p-2.5 border border-slate-200 bg-white rounded-xl w-full text-xs"
                      >
                        <option value="Islam">Islam</option>
                        <option value="Kristen">Kristen</option>
                        <option value="Katolik">Katolik</option>
                        <option value="Hindu">Hindu</option>
                        <option value="Buddha">Buddha</option>
                        <option value="Khonghucu">Khonghucu</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 mb-1">Pendidikan Terakhir</label>
                      <select 
                        value={formOrangTua.pendidikanWali || 'SMA'} 
                        onChange={(e) => setFormOrangTua(prev => ({ ...prev, pendidikanWali: e.target.value }))}
                        className="p-2.5 border border-slate-200 bg-white rounded-xl w-full text-xs"
                      >
                        <option value="SD">SD</option>
                        <option value="SMP">SMP</option>
                        <option value="SMA">SMA / Sederajat</option>
                        <option value="D3">Diploma (D3)</option>
                        <option value="S1">Sarjana (S1)</option>
                        <option value="S2/S3">Pascasarjana (S2 / S3)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 mb-1">Pekerjaan</label>
                      <input 
                        type="text" 
                        value={formOrangTua.pekerjaanWali || ''} 
                        onChange={(e) => setFormOrangTua(prev => ({ ...prev, pekerjaanWali: e.target.value }))}
                        className="p-2.5 border border-slate-200 rounded-xl w-full text-xs"
                        placeholder="Pekerjaan"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 mb-1">No Kontak (HP)</label>
                      <input 
                        type="tel" 
                        value={formOrangTua.noHpWali || ''} 
                        onChange={(e) => setFormOrangTua(prev => ({ ...prev, noHpWali: e.target.value }))}
                        className="p-2.5 border border-slate-200 rounded-xl w-full text-xs"
                        placeholder="No HP"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 mb-1">Alamat Wali</label>
                      <input 
                        type="text" 
                        value={formOrangTua.alamatWali || ''} 
                        onChange={(e) => setFormOrangTua(prev => ({ ...prev, alamatWali: e.target.value }))}
                        className="p-2.5 border border-slate-200 rounded-xl w-full text-xs"
                        placeholder="Alamat Lengkap"
                      />
                    </div>
                  </div>
                </div>

                {/* GENERAL FAMILY ECONOMIC INFO */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 bg-slate-50/50 border border-slate-200/60 rounded-xl">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 mb-1">Penghasilan Gabungan Orang Tua</label>
                    <select 
                      value={formOrangTua.penghasilan || 'Rp 2.000.000 - Rp 4.000.000'} 
                      onChange={(e) => setFormOrangTua(prev => ({ ...prev, penghasilan: e.target.value }))}
                      className="p-2.5 border border-slate-200 bg-white rounded-xl w-full text-xs"
                    >
                      <option value="Kurang dari Rp 2.000.000">Kurang dari Rp 2.000.000</option>
                      <option value="Rp 2.000.000 - Rp 4.000.000">Rp 2.000.000 - Rp 4.000.000</option>
                      <option value="Rp 4.000.000 - Rp 6.000.000">Rp 4.000.000 - Rp 6.000.000</option>
                      <option value="Rp 6.000.000 - Rp 10.000.000">Rp 6.000.000 - Rp 10.000.000</option>
                      <option value="Lebih dari Rp 10.000.000">Lebih dari Rp 10.000.000</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 mb-1">Tingkat Pendidikan Keluarga</label>
                    <select 
                      value={formOrangTua.pendidikanOrangTua || 'SMA'} 
                      onChange={(e) => setFormOrangTua(prev => ({ ...prev, pendidikanOrangTua: e.target.value }))}
                      className="p-2.5 border border-slate-200 bg-white rounded-xl w-full text-xs"
                    >
                      <option value="SD">SD</option>
                      <option value="SMP">SMP</option>
                      <option value="SMA">SMA / Sederajat</option>
                      <option value="D3">Diploma (D3)</option>
                      <option value="S1">Sarjana (S1)</option>
                      <option value="S2/S3">Pascasarjana (S2 / S3)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Part 3: Nested Tabs Health, Economy, Psycho, Academic */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-100">
                {/* Kesehatan */}
                <div className="space-y-3">
                  <span className="font-bold text-rose-800 flex items-center gap-1.5 text-[11px] uppercase tracking-wider">
                    <Heart size={14} className="text-rose-500" /> 3. Data Kesehatan Siswa
                  </span>
                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label className="block text-[10px] text-slate-500">Tinggi (cm)</label>
                      <input 
                        type="number" 
                        value={formKesehatan.tinggiBadan || 0} 
                        onChange={(e) => setFormKesehatan(prev => ({ ...prev, tinggiBadan: Number(e.target.value) }))}
                        className="p-2 border border-slate-200 rounded-lg w-full"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-slate-500">Berat (kg)</label>
                      <input 
                        type="number" 
                        value={formKesehatan.beratBadan || 0} 
                        onChange={(e) => setFormKesehatan(prev => ({ ...prev, beratBadan: Number(e.target.value) }))}
                        className="p-2 border border-slate-200 rounded-lg w-full"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-slate-500">Gol Darah</label>
                      <input 
                        type="text" 
                        value={formKesehatan.golonganDarah || ''} 
                        onChange={(e) => setFormKesehatan(prev => ({ ...prev, golonganDarah: e.target.value }))}
                        className="p-2 border border-slate-200 rounded-lg w-full"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-500">Penyakit Serius</label>
                    <input 
                      type="text" 
                      value={formKesehatan.penyakit || ''} 
                      onChange={(e) => setFormKesehatan(prev => ({ ...prev, penyakit: e.target.value }))}
                      className="p-2 border border-slate-200 rounded-lg w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-500">Alergi</label>
                    <input 
                      type="text" 
                      value={formKesehatan.alergi || ''} 
                      onChange={(e) => setFormKesehatan(prev => ({ ...prev, alergi: e.target.value }))}
                      className="p-2 border border-slate-200 rounded-lg w-full"
                    />
                  </div>
                </div>

                {/* Ekonomi */}
                <div className="space-y-3">
                  <span className="font-bold text-amber-800 flex items-center gap-1.5 text-[11px] uppercase tracking-wider">
                    <DollarSign size={14} className="text-amber-500" /> 4. Data Ekonomi Keluarga
                  </span>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[10px] text-slate-500">Status Rumah</label>
                      <select 
                        value={formEkonomi.statusRumah || 'Milik Sendiri'} 
                        onChange={(e) => setFormEkonomi(prev => ({ ...prev, statusRumah: e.target.value }))}
                        className="p-2 border border-slate-200 bg-white rounded-lg w-full"
                      >
                        <option value="Milik Sendiri">Milik Sendiri</option>
                        <option value="Sewa / Kontrak">Sewa / Kontrak</option>
                        <option value="Milik Dinas">Milik Dinas</option>
                        <option value="Menumpang">Menumpang</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] text-slate-500">Transportasi</label>
                      <input 
                        type="text" 
                        value={formEkonomi.kendaraan || ''} 
                        onChange={(e) => setFormEkonomi(prev => ({ ...prev, kendaraan: e.target.value }))}
                        className="p-2 border border-slate-200 rounded-lg w-full"
                      />
                    </div>
                  </div>
                  
                  <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 flex justify-between">
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={!!formEkonomi.pip} 
                        onChange={(e) => setFormEkonomi(prev => ({ ...prev, pip: e.target.checked }))}
                        className="rounded text-emerald-600 focus:ring-emerald-500"
                      />
                      <span>Penerima PIP</span>
                    </label>
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={!!formEkonomi.pkh} 
                        onChange={(e) => setFormEkonomi(prev => ({ ...prev, pkh: e.target.checked }))}
                        className="rounded text-emerald-600 focus:ring-emerald-500"
                      />
                      <span>Penerima PKH</span>
                    </label>
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={!!formEkonomi.kip} 
                        onChange={(e) => setFormEkonomi(prev => ({ ...prev, kip: e.target.checked }))}
                        className="rounded text-emerald-600 focus:ring-emerald-500"
                      />
                      <span>Penerima KIP</span>
                    </label>
                  </div>
                </div>

                {/* Psikologi */}
                <div className="space-y-3 pt-2">
                  <span className="font-bold text-indigo-800 flex items-center gap-1.5 text-[11px] uppercase tracking-wider">
                    <Brain size={14} className="text-indigo-500" /> 5. Data Minat & Psikologis
                  </span>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[10px] text-slate-500">Minat / Hobi</label>
                      <input 
                        type="text" 
                        value={formPsikologi.minat || ''} 
                        onChange={(e) => setFormPsikologi(prev => ({ ...prev, minat: e.target.value, hobi: e.target.value }))}
                        className="p-2 border border-slate-200 rounded-lg w-full"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-slate-500">Cita-Cita</label>
                      <input 
                        type="text" 
                        value={formPsikologi.citaCita || ''} 
                        onChange={(e) => setFormPsikologi(prev => ({ ...prev, citaCita: e.target.value }))}
                        className="p-2 border border-slate-200 rounded-lg w-full"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[10px] text-slate-500">Bakat Dominan</label>
                      <input 
                        type="text" 
                        value={formPsikologi.bakat || ''} 
                        onChange={(e) => setFormPsikologi(prev => ({ ...prev, bakat: e.target.value }))}
                        className="p-2 border border-slate-200 rounded-lg w-full"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-slate-500">Gaya Belajar</label>
                      <select 
                        value={formPsikologi.gayaBelajar || 'Visual'} 
                        onChange={(e) => setFormPsikologi(prev => ({ ...prev, gayaBelajar: e.target.value }))}
                        className="p-2 border border-slate-200 bg-white rounded-lg w-full"
                      >
                        <option value="Visual">Visual</option>
                        <option value="Auditory">Auditory</option>
                        <option value="Kinestetik">Kinestetik</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Akademik */}
                <div className="space-y-3 pt-2">
                  <span className="font-bold text-teal-800 flex items-center gap-1.5 text-[11px] uppercase tracking-wider">
                    <Activity size={14} className="text-teal-500" /> 6. Nilai Akademis Rapor
                  </span>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[10px] text-slate-500">Semester</label>
                      <input 
                        type="text" 
                        value={formAkademik.semester || '1'} 
                        onChange={(e) => setFormAkademik(prev => ({ ...prev, semester: e.target.value }))}
                        className="p-2 border border-slate-200 rounded-lg w-full"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-slate-500">Rata-rata Nilai</label>
                      <input 
                        type="number" 
                        step="0.01"
                        value={formAkademik.rataRataRaport || 80} 
                        onChange={(e) => setFormAkademik(prev => ({ ...prev, rataRataRaport: Number(e.target.value) }))}
                        className="p-2 border border-slate-200 rounded-lg w-full"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-500">Catatan Khusus Wali Kelas</label>
                    <textarea 
                      value={formAkademik.catatanWaliKelas || ''} 
                      onChange={(e) => setFormAkademik(prev => ({ ...prev, catatanWaliKelas: e.target.value }))}
                      rows={2}
                      className="p-2 border border-slate-200 rounded-lg w-full"
                    />
                  </div>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="p-4 bg-slate-50 border-t border-slate-100 -mx-6 -mb-6 flex justify-end gap-2 rounded-b-2xl">
                <button 
                  type="button" 
                  onClick={() => setIsEditorOpen(false)}
                  className="px-4 py-2 bg-slate-200 text-slate-600 rounded-xl hover:bg-slate-300 font-semibold"
                >
                  Batal
                </button>
                <button 
                  type="submit" 
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-sm transition"
                >
                  Simpan Paket Data Siswa
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* EXCEL IMPORTING LOADING INDICATOR */}
      {isImporting && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-[70] flex flex-col items-center justify-center p-4">
          <div className="bg-white p-6 rounded-2xl shadow-xl flex flex-col items-center gap-4 text-center border border-slate-100 max-w-xs">
            <div className="relative flex items-center justify-center">
              <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
              <Upload size={20} className="absolute text-blue-600 animate-pulse" />
            </div>
            <div>
              <h4 className="font-bold text-slate-800 text-sm">Mengimpor Data Excel...</h4>
              <p className="text-xs text-slate-500 mt-1">Sistem sedang memetakan kelas, menyinkronkan data, dan memperbarui rekam siswa BK.</p>
            </div>
          </div>
        </div>
      )}

      {/* EXCEL IMPORT STATUS MODAL */}
      {importStatus && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden flex flex-col max-h-[80vh]">
            <div className="p-4 bg-slate-900 text-white flex justify-between items-center flex-shrink-0">
              <div className="flex items-center gap-2">
                <Sparkles size={18} className="text-amber-400" />
                <h3 className="font-bold text-sm">Hasil Impor Data Excel</h3>
              </div>
              <button
                type="button"
                onClick={() => setImportStatus(null)}
                className="p-1 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition"
              >
                <X size={16} />
              </button>
            </div>
            
            <div className="p-5 overflow-y-auto space-y-4 flex-1">
              <div className="grid grid-cols-2 gap-3 text-center">
                <div className="p-3 bg-emerald-50 border border-emerald-100 rounded-xl">
                  <p className="text-xs text-slate-500 font-medium">Berhasil</p>
                  <p className="text-2xl font-black text-emerald-600">{importStatus.success}</p>
                </div>
                <div className="p-3 bg-rose-50 border border-rose-100 rounded-xl">
                  <p className="text-xs text-slate-500 font-medium font-semibold">Gagal / Lewat</p>
                  <p className="text-2xl font-black text-rose-600">{importStatus.failed}</p>
                </div>
              </div>

              <div className="space-y-1.5">
                <p className="text-xs font-bold text-slate-700">Rincian Log Proses:</p>
                <div className="bg-slate-55 border border-slate-150 rounded-xl p-3 max-h-48 overflow-y-auto font-mono text-[10px] space-y-1 bg-slate-50">
                  {importStatus.details.map((detail, index) => (
                    <div 
                      key={index} 
                      className={`py-0.5 border-b border-slate-100 last:border-0 ${
                        detail.includes('Berhasil') ? 'text-emerald-700' : detail.includes('Dilewati') ? 'text-amber-700 font-semibold' : 'text-rose-700 font-semibold'
                      }`}
                    >
                      {detail}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end flex-shrink-0">
              <button
                type="button"
                onClick={() => setImportStatus(null)}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold shadow transition cursor-pointer"
              >
                Selesai
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SPREADSHEET EXCEL INTEGRATION MODAL */}
      {isSpreadsheetViewOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full h-[90vh] flex flex-col overflow-hidden max-w-[95vw]">
            
            {/* Modal Header */}
            <div className="p-4 bg-slate-900 text-white flex justify-between items-center flex-shrink-0">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-emerald-600 rounded-lg text-white">
                  <FileSpreadsheet size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-sm">Lembar Kerja HDS (Integrasi Google Sheets & Excel)</h3>
                  <p className="text-[10px] text-slate-300">Tampilan grid interaktif & terintegrasi untuk seluruh himpunan data siswa</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsSpreadsheetViewOpen(false)}
                className="p-1 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition"
              >
                <X size={18} />
              </button>
            </div>

            {/* Connection Sync Banner & Actions bar */}
            <div className="bg-slate-50 border-b border-slate-150 p-3 flex flex-col md:flex-row md:items-center justify-between gap-3 flex-shrink-0">
              {/* Connection Status Badge */}
              <div className="flex items-center gap-2">
                {db.config.gasApiUrl ? (
                  <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs px-3 py-1.5 rounded-xl font-medium flex items-center gap-1.5 shadow-sm">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span>Terintegrasi Google Sheets (REST API Aktif)</span>
                  </div>
                ) : (
                  <div className="bg-amber-50 border border-amber-200 text-amber-800 text-xs px-3 py-1.5 rounded-xl font-medium flex items-center gap-1.5 shadow-sm">
                    <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                    <span>Offline Fallback Mode (Penyimpanan Lokal Browser)</span>
                  </div>
                )}
                <span className="text-[10px] text-slate-400 hidden lg:inline">Double-click baris siswa untuk membuka detail profil.</span>
              </div>

              {/* Top control and actions */}
              <div className="flex flex-wrap items-center gap-2">
                {/* Search in spreadsheet */}
                <div className="relative">
                  <Search className="absolute left-2.5 top-2 text-slate-400" size={12} />
                  <input
                    type="text"
                    placeholder="Cari siswa di sheet..."
                    value={spreadsheetSearch}
                    onChange={(e) => setSpreadsheetSearch(e.target.value)}
                    className="pl-8 pr-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs w-48 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                {/* Reload / Sync Button */}
                {onRefresh && (
                  <button
                    type="button"
                    onClick={handleSyncData}
                    disabled={isSyncing}
                    className="p-1.5 bg-white border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 text-xs flex items-center gap-1 font-medium shadow-sm cursor-pointer disabled:opacity-50"
                    title="Muat ulang & Sinkronisasi data"
                  >
                    <RefreshCw size={12} className={isSyncing ? 'animate-spin' : ''} />
                    <span className="hidden sm:inline">{isSyncing ? 'Sinkronisasi...' : 'Sinkronkan'}</span>
                  </button>
                )}

                {/* Download Template inside Grid */}
                <button
                  type="button"
                  onClick={handleDownloadExcelTemplate}
                  className="p-1.5 bg-amber-50 text-amber-700 border border-amber-200 rounded-lg hover:bg-amber-100 text-xs flex items-center gap-1 font-bold shadow-sm cursor-pointer"
                  title="Unduh template Excel resmi (format CSV)"
                >
                  <Download size={12} />
                  <span>Unduh Template</span>
                </button>

                {/* Import Excel inside Grid */}
                {canModify && (
                  <label className="p-1.5 bg-blue-50 text-blue-700 border border-blue-200 rounded-lg hover:bg-blue-100 text-xs flex items-center gap-1 font-bold shadow-sm cursor-pointer select-none">
                    <Upload size={12} />
                    <span>{isImporting ? 'Mengimpor...' : 'Impor Excel'}</span>
                    <input
                      type="file"
                      accept=".csv"
                      onChange={handleImportExcel}
                      disabled={isImporting}
                      className="hidden"
                    />
                  </label>
                )}

                {/* Export Active Sheet */}
                <button
                  type="button"
                  onClick={() => handleExportSpreadsheetCSV(false)}
                  className="p-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-lg hover:bg-emerald-100 text-xs flex items-center gap-1 font-bold shadow-sm cursor-pointer"
                  title="Unduh halaman aktif ini dalam format Excel"
                >
                  <Download size={12} />
                  <span>Ekspor Sheet Aktif</span>
                </button>

                {/* Export Comprehensive Data */}
                <button
                  type="button"
                  onClick={() => handleExportSpreadsheetCSV(true)}
                  className="p-1.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 text-xs flex items-center gap-1 font-bold shadow-sm cursor-pointer"
                  title="Unduh seluruh data himpunan siswa komprehensif (gabungan seluruh sheet)"
                >
                  <Download size={12} />
                  <span>Ekspor Komprehensif (Excel)</span>
                </button>
              </div>
            </div>

            {/* Excel Tabs Selector */}
            <div className="bg-slate-100 border-b border-slate-200 px-3 flex gap-1 overflow-x-auto py-1 scrollbar-thin flex-shrink-0">
              <button
                type="button"
                onClick={() => setSpreadsheetCategory('all')}
                className={`px-3 py-1 text-xs font-semibold rounded-t-lg border-t border-x transition flex items-center gap-1.5 ${
                  spreadsheetCategory === 'all'
                    ? 'bg-white border-slate-200 text-emerald-700 font-bold'
                    : 'bg-slate-50 border-transparent text-slate-600 hover:bg-slate-200'
                }`}
              >
                <span>📁 Semua Kolom</span>
              </button>
              <button
                type="button"
                onClick={() => setSpreadsheetCategory('biodata')}
                className={`px-3 py-1 text-xs font-semibold rounded-t-lg border-t border-x transition flex items-center gap-1.5 ${
                  spreadsheetCategory === 'biodata'
                    ? 'bg-white border-slate-200 text-emerald-700 font-bold'
                    : 'bg-slate-50 border-transparent text-slate-600 hover:bg-slate-200'
                }`}
              >
                <span>👤 1. Biodata Siswa</span>
              </button>
              <button
                type="button"
                onClick={() => setSpreadsheetCategory('orangtua')}
                className={`px-3 py-1 text-xs font-semibold rounded-t-lg border-t border-x transition flex items-center gap-1.5 ${
                  spreadsheetCategory === 'orangtua'
                    ? 'bg-white border-slate-200 text-emerald-700 font-bold'
                    : 'bg-slate-50 border-transparent text-slate-600 hover:bg-slate-200'
                }`}
              >
                <span>👥 2. Orang Tua</span>
              </button>
              <button
                type="button"
                onClick={() => setSpreadsheetCategory('akademik')}
                className={`px-3 py-1 text-xs font-semibold rounded-t-lg border-t border-x transition flex items-center gap-1.5 ${
                  spreadsheetCategory === 'akademik'
                    ? 'bg-white border-slate-200 text-emerald-700 font-bold'
                    : 'bg-slate-50 border-transparent text-slate-600 hover:bg-slate-200'
                }`}
              >
                <span>🎓 3. Akademik</span>
              </button>
              <button
                type="button"
                onClick={() => setSpreadsheetCategory('kesehatan')}
                className={`px-3 py-1 text-xs font-semibold rounded-t-lg border-t border-x transition flex items-center gap-1.5 ${
                  spreadsheetCategory === 'kesehatan'
                    ? 'bg-white border-slate-200 text-emerald-700 font-bold'
                    : 'bg-slate-50 border-transparent text-slate-600 hover:bg-slate-200'
                }`}
              >
                <span>🩺 4. Kesehatan</span>
              </button>
              <button
                type="button"
                onClick={() => setSpreadsheetCategory('ekonomi')}
                className={`px-3 py-1 text-xs font-semibold rounded-t-lg border-t border-x transition flex items-center gap-1.5 ${
                  spreadsheetCategory === 'ekonomi'
                    ? 'bg-white border-slate-200 text-emerald-700 font-bold'
                    : 'bg-slate-50 border-transparent text-slate-600 hover:bg-slate-200'
                }`}
              >
                <span>💰 5. Ekonomi & Fasilitas</span>
              </button>
              <button
                type="button"
                onClick={() => setSpreadsheetCategory('psikologi')}
                className={`px-3 py-1 text-xs font-semibold rounded-t-lg border-t border-x transition flex items-center gap-1.5 ${
                  spreadsheetCategory === 'psikologi'
                    ? 'bg-white border-slate-200 text-emerald-700 font-bold'
                    : 'bg-slate-50 border-transparent text-slate-600 hover:bg-slate-200'
                }`}
              >
                <span>🧠 6. Psikologi</span>
              </button>
              <button
                type="button"
                onClick={() => setSpreadsheetCategory('prestasi')}
                className={`px-3 py-1 text-xs font-semibold rounded-t-lg border-t border-x transition flex items-center gap-1.5 ${
                  spreadsheetCategory === 'prestasi'
                    ? 'bg-white border-slate-200 text-emerald-700 font-bold'
                    : 'bg-slate-50 border-transparent text-slate-600 hover:bg-slate-200'
                }`}
              >
                <span>🏆 7. Prestasi Siswa</span>
              </button>
            </div>

            {/* Interactive Grid (Spreadsheet Layout) */}
            <div className="flex-1 overflow-auto bg-slate-200 p-1 select-none">
              <div className="inline-block min-w-full align-middle">
                <table className="min-w-full border-collapse bg-white shadow-inner font-mono text-[10px] text-slate-700">
                  
                  {/* Excel Column Letters (A, B, C...) */}
                  <thead>
                    <tr className="bg-slate-100 divide-x divide-slate-300 border-b border-slate-300">
                      <th className="bg-slate-150 text-slate-500 font-normal py-1 px-1.5 text-center border-b border-slate-300 w-10"></th>
                      {(() => {
                        let colCount = 0;
                        if (spreadsheetCategory === 'all') colCount = 19;
                        else if (spreadsheetCategory === 'biodata') colCount = 14;
                        else if (spreadsheetCategory === 'orangtua') colCount = 13;
                        else if (spreadsheetCategory === 'akademik') colCount = 7;
                        else if (spreadsheetCategory === 'kesehatan') colCount = 8;
                        else if (spreadsheetCategory === 'ekonomi') colCount = 8;
                        else if (spreadsheetCategory === 'psikologi') colCount = 7;
                        else if (spreadsheetCategory === 'prestasi') colCount = 4;

                        return Array.from({ length: colCount }).map((_, i) => {
                          let label = '';
                          let temp = i;
                          while (temp >= 0) {
                            label = String.fromCharCode((temp % 26) + 65) + label;
                            temp = Math.floor(temp / 26) - 1;
                          }
                          return (
                            <th key={i} className="py-1 px-3 text-center text-slate-400 font-normal w-40 min-w-[120px]">
                              {label}
                            </th>
                          );
                        });
                      })()}
                    </tr>

                    {/* Dynamic Headers based on active sheet */}
                    <tr className="bg-slate-50 divide-x divide-slate-200 border-b border-slate-300">
                      <th className="bg-slate-150 text-slate-500 font-bold py-1.5 px-1.5 text-center border-b border-slate-300 w-10">
                        Row
                      </th>
                      {spreadsheetCategory === 'all' && (
                        <>
                          <th className="py-1.5 px-3 text-left font-bold text-slate-600 bg-slate-50/80">ID Siswa</th>
                          <th className="py-1.5 px-3 text-left font-bold text-slate-600 bg-slate-50/80">NIS</th>
                          <th className="py-1.5 px-3 text-left font-bold text-slate-600 bg-slate-50/80">NISN</th>
                          <th className="py-1.5 px-3 text-left font-bold text-slate-600 bg-slate-50/80">Nama Siswa</th>
                          <th className="py-1.5 px-3 text-left font-bold text-slate-600 bg-slate-50/80">Kelas</th>
                          <th className="py-1.5 px-3 text-left font-bold text-slate-600 bg-slate-50/80">Tahun Pelajaran</th>
                          <th className="py-1.5 px-3 text-left font-bold text-slate-600 bg-slate-50/80">Gender</th>
                          <th className="py-1.5 px-3 text-left font-bold text-slate-600 bg-slate-50/80">Penghasilan Orang Tua</th>
                          <th className="py-1.5 px-3 text-left font-bold text-slate-600 bg-slate-50/80">Nama Ayah</th>
                          <th className="py-1.5 px-3 text-left font-bold text-slate-600 bg-slate-50/80">Nama Ibu</th>
                          <th className="py-1.5 px-3 text-left font-bold text-slate-600 bg-slate-50/80">Rata-Rata Rapor</th>
                          <th className="py-1.5 px-3 text-left font-bold text-slate-600 bg-slate-50/80">Poin Pelanggaran</th>
                          <th className="py-1.5 px-3 text-left font-bold text-slate-600 bg-slate-50/80">Gol. Darah</th>
                          <th className="py-1.5 px-3 text-left font-bold text-slate-600 bg-slate-50/80">Beasiswa / KIP</th>
                          <th className="py-1.5 px-3 text-left font-bold text-slate-600 bg-slate-50/80">Cita-Cita</th>
                          <th className="py-1.5 px-3 text-left font-bold text-slate-600 bg-slate-50/80">Kepribadian</th>
                          <th className="py-1.5 px-3 text-left font-bold text-slate-600 bg-slate-50/80">Jml Prestasi</th>
                          <th className="py-1.5 px-3 text-left font-bold text-slate-600 bg-slate-50/80">Rincian Prestasi</th>
                        </>
                      )}
                      {spreadsheetCategory === 'biodata' && (
                        <>
                          <th className="py-1.5 px-3 text-left font-bold text-slate-600 bg-slate-50/80">NIS</th>
                          <th className="py-1.5 px-3 text-left font-bold text-slate-600 bg-slate-50/80">NISN</th>
                          <th className="py-1.5 px-3 text-left font-bold text-slate-600 bg-slate-50/80">Nama Lengkap</th>
                          <th className="py-1.5 px-3 text-left font-bold text-slate-600 bg-slate-50/80">Kelas</th>
                          <th className="py-1.5 px-3 text-left font-bold text-slate-600 bg-slate-50/80">Tahun Pelajaran</th>
                          <th className="py-1.5 px-3 text-left font-bold text-slate-600 bg-slate-50/80">Gender</th>
                          <th className="py-1.5 px-3 text-left font-bold text-slate-600 bg-slate-50/80">Tempat Lahir</th>
                          <th className="py-1.5 px-3 text-left font-bold text-slate-600 bg-slate-50/80">Tanggal Lahir</th>
                          <th className="py-1.5 px-3 text-left font-bold text-slate-600 bg-slate-50/80">Agama</th>
                          <th className="py-1.5 px-3 text-left font-bold text-slate-600 bg-slate-50/80">No HP</th>
                          <th className="py-1.5 px-3 text-left font-bold text-slate-600 bg-slate-50/80">Email</th>
                          <th className="py-1.5 px-3 text-left font-bold text-slate-600 bg-slate-50/80">Alamat Lengkap</th>
                          <th className="py-1.5 px-3 text-left font-bold text-slate-600 bg-slate-50/80">Tahun Masuk</th>
                        </>
                      )}
                      {spreadsheetCategory === 'orangtua' && (
                        <>
                          <th className="py-1.5 px-3 text-left font-bold text-slate-600 bg-slate-50/80">Nama Siswa</th>
                          <th className="py-1.5 px-3 text-left font-bold text-slate-600 bg-slate-50/80">Nama Ayah</th>
                          <th className="py-1.5 px-3 text-left font-bold text-slate-600 bg-slate-50/80">Status Ayah</th>
                          <th className="py-1.5 px-3 text-left font-bold text-slate-600 bg-slate-50/80">Pekerjaan Ayah</th>
                          <th className="py-1.5 px-3 text-left font-bold text-slate-600 bg-slate-50/80">No HP Ayah</th>
                          <th className="py-1.5 px-3 text-left font-bold text-slate-600 bg-slate-50/80">Nama Ibu</th>
                          <th className="py-1.5 px-3 text-left font-bold text-slate-600 bg-slate-50/80">Status Ibu</th>
                          <th className="py-1.5 px-3 text-left font-bold text-slate-600 bg-slate-50/80">Pekerjaan Ibu</th>
                          <th className="py-1.5 px-3 text-left font-bold text-slate-600 bg-slate-50/80">No HP Ibu</th>
                          <th className="py-1.5 px-3 text-left font-bold text-slate-600 bg-slate-50/80">Nama Wali</th>
                          <th className="py-1.5 px-3 text-left font-bold text-slate-600 bg-slate-50/80">Pekerjaan Wali</th>
                          <th className="py-1.5 px-3 text-left font-bold text-slate-600 bg-slate-50/80">Penghasilan Gabungan</th>
                          <th className="py-1.5 px-3 text-left font-bold text-slate-600 bg-slate-50/80">Pendidikan Keluarga</th>
                        </>
                      )}
                      {spreadsheetCategory === 'akademik' && (
                        <>
                          <th className="py-1.5 px-3 text-left font-bold text-slate-600 bg-slate-50/80">Nama Siswa</th>
                          <th className="py-1.5 px-3 text-left font-bold text-slate-600 bg-slate-50/80">Kelas</th>
                          <th className="py-1.5 px-3 text-left font-bold text-slate-600 bg-slate-50/80">Tahun Pelajaran</th>
                          <th className="py-1.5 px-3 text-left font-bold text-slate-600 bg-slate-50/80">Rata-Rata Rapor</th>
                          <th className="py-1.5 px-3 text-left font-bold text-slate-600 bg-slate-50/80">Catatan Wali Kelas</th>
                          <th className="py-1.5 px-3 text-left font-bold text-slate-600 bg-slate-50/80">Poin Pelanggaran</th>
                          <th className="py-1.5 px-3 text-left font-bold text-slate-600 bg-slate-50/80">Tahun Masuk</th>
                        </>
                      )}
                      {spreadsheetCategory === 'kesehatan' && (
                        <>
                          <th className="py-1.5 px-3 text-left font-bold text-slate-600 bg-slate-50/80">Nama Siswa</th>
                          <th className="py-1.5 px-3 text-left font-bold text-slate-600 bg-slate-50/80">Tinggi (cm)</th>
                          <th className="py-1.5 px-3 text-left font-bold text-slate-600 bg-slate-50/80">Berat (kg)</th>
                          <th className="py-1.5 px-3 text-left font-bold text-slate-600 bg-slate-50/80">Golongan Darah</th>
                          <th className="py-1.5 px-3 text-left font-bold text-slate-600 bg-slate-50/80">Riwayat Penyakit</th>
                          <th className="py-1.5 px-3 text-left font-bold text-slate-600 bg-slate-50/80">Kelainan Fisik</th>
                          <th className="py-1.5 px-3 text-left font-bold text-slate-600 bg-slate-50/80">Catatan Medis</th>
                          <th className="py-1.5 px-3 text-left font-bold text-slate-600 bg-slate-50/80">Kelas</th>
                        </>
                      )}
                      {spreadsheetCategory === 'ekonomi' && (
                        <>
                          <th className="py-1.5 px-3 text-left font-bold text-slate-600 bg-slate-50/80">Nama Siswa</th>
                          <th className="py-1.5 px-3 text-left font-bold text-slate-600 bg-slate-50/80">Status Rumah</th>
                          <th className="py-1.5 px-3 text-left font-bold text-slate-600 bg-slate-50/80">Sumber Air</th>
                          <th className="py-1.5 px-3 text-left font-bold text-slate-600 bg-slate-50/80">Fasilitas Belajar</th>
                          <th className="py-1.5 px-3 text-left font-bold text-slate-600 bg-slate-50/80">Transportasi</th>
                          <th className="py-1.5 px-3 text-left font-bold text-slate-600 bg-slate-50/80">Beasiswa / KIP</th>
                          <th className="py-1.5 px-3 text-left font-bold text-slate-600 bg-slate-50/80">Catatan Ekonomi</th>
                          <th className="py-1.5 px-3 text-left font-bold text-slate-600 bg-slate-50/80">Kelas</th>
                        </>
                      )}
                      {spreadsheetCategory === 'psikologi' && (
                        <>
                          <th className="py-1.5 px-3 text-left font-bold text-slate-600 bg-slate-50/80">Nama Siswa</th>
                          <th className="py-1.5 px-3 text-left font-bold text-slate-600 bg-slate-50/80">Minat & Hobi</th>
                          <th className="py-1.5 px-3 text-left font-bold text-slate-600 bg-slate-50/80">Bakat Khusus</th>
                          <th className="py-1.5 px-3 text-left font-bold text-slate-600 bg-slate-50/80">Cita-Cita</th>
                          <th className="py-1.5 px-3 text-left font-bold text-slate-600 bg-slate-50/80">Kepribadian</th>
                          <th className="py-1.5 px-3 text-left font-bold text-slate-600 bg-slate-50/80">Catatan Psikologis</th>
                          <th className="py-1.5 px-3 text-left font-bold text-slate-600 bg-slate-50/80">Kelas</th>
                        </>
                      )}
                      {spreadsheetCategory === 'prestasi' && (
                        <>
                          <th className="py-1.5 px-3 text-left font-bold text-slate-600 bg-slate-50/80">Nama Siswa</th>
                          <th className="py-1.5 px-3 text-left font-bold text-slate-600 bg-slate-50/80">Kelas</th>
                          <th className="py-1.5 px-3 text-left font-bold text-slate-600 bg-slate-50/80">Jumlah Prestasi</th>
                          <th className="py-1.5 px-3 text-left font-bold text-slate-600 bg-slate-50/80">Rincian Prestasi</th>
                        </>
                      )}
                    </tr>
                  </thead>

                  {/* Spreadsheet rows rendering */}
                  <tbody className="divide-y divide-slate-200">
                    {filteredSpreadsheetRows.length > 0 ? (
                      filteredSpreadsheetRows.map((row, index) => {
                        const originalSiswa = db.siswa.find(s => s.id === row.id)!;
                        return (
                          <tr
                            key={row.id}
                            onDoubleClick={() => {
                              setViewingSiswa(originalSiswa);
                              setActiveDetailTab('bio');
                              setIsSpreadsheetViewOpen(false);
                            }}
                            className="hover:bg-blue-50/60 divide-x divide-slate-150 transition-colors cursor-pointer group"
                            title="Klik ganda untuk membuka detail"
                          >
                            {/* Row number indicator */}
                            <td className="bg-slate-100 text-slate-400 font-normal py-1 px-1.5 text-center w-10 border-r border-slate-300 group-hover:bg-blue-100 group-hover:text-blue-700 select-none">
                              {index + 1}
                            </td>

                            {/* Spreadsheet fields based on category */}
                            {spreadsheetCategory === 'all' && (
                              <>
                                <td className="py-1 px-3 text-left truncate max-w-[100px] font-semibold text-slate-400">{row.id}</td>
                                <td className="py-1 px-3 text-left font-semibold text-slate-600">{row.nis}</td>
                                <td className="py-1 px-3 text-left text-slate-500">{row.nisn}</td>
                                <td className="py-1 px-3 text-left font-bold text-slate-800">{row.nama}</td>
                                <td className="py-1 px-3 text-left font-bold text-emerald-700">{row.kelas}</td>
                                <td className="py-1 px-3 text-left font-bold text-teal-700">{row.tahunPelajaran}</td>
                                <td className="py-1 px-3 text-left text-slate-500">{row.gender}</td>
                                <td className="py-1 px-3 text-left font-semibold text-teal-600">{row.penghasilan}</td>
                                <td className="py-1 px-3 text-left text-slate-600">{row.namaAyah}</td>
                                <td className="py-1 px-3 text-left text-slate-600">{row.namaIbu}</td>
                                <td className="py-1 px-3 text-center font-bold text-blue-600">{row.rataRataRapor}</td>
                                <td className="py-1 px-3 text-center font-bold text-rose-600">{row.poinPelanggaran} Pts</td>
                                <td className="py-1 px-3 text-center text-slate-600">{row.golDarah}</td>
                                <td className="py-1 px-3 text-left font-semibold text-amber-700">{row.kip}</td>
                                <td className="py-1 px-3 text-left text-slate-600">{row.citaCita}</td>
                                <td className="py-1 px-3 text-left truncate max-w-[120px] text-slate-600">{row.kepribadian}</td>
                                <td className="py-1 px-3 text-center font-bold bg-amber-50/50 text-amber-800">{row.jumlahPrestasi}</td>
                                <td className="py-1 px-3 text-left text-slate-500 truncate max-w-[200px]" title={row.daftarPrestasi}>{row.daftarPrestasi || '-'}</td>
                              </>
                            )}

                            {spreadsheetCategory === 'biodata' && (
                              <>
                                <td className="py-1 px-3 text-left font-semibold text-slate-600">{row.nis}</td>
                                <td className="py-1 px-3 text-left text-slate-500">{row.nisn}</td>
                                <td className="py-1 px-3 text-left font-bold text-slate-800">{row.nama}</td>
                                <td className="py-1 px-3 text-left font-bold text-emerald-700">{row.kelas}</td>
                                <td className="py-1 px-3 text-left font-bold text-teal-700">{row.tahunPelajaran}</td>
                                <td className="py-1 px-3 text-left text-slate-500">{row.gender}</td>
                                <td className="py-1 px-3 text-left text-slate-600">{row.tempatLahir}</td>
                                <td className="py-1 px-3 text-left text-slate-600">{row.tanggalLahir}</td>
                                <td className="py-1 px-3 text-left text-slate-600">{row.agama}</td>
                                <td className="py-1 px-3 text-left text-slate-600">{row.noHp}</td>
                                <td className="py-1 px-3 text-left text-slate-600">{row.email}</td>
                                <td className="py-1 px-3 text-left text-slate-600 truncate max-w-[150px]" title={row.alamat}>{row.alamat}</td>
                                <td className="py-1 px-3 text-left text-slate-500">{row.tahunMasuk}</td>
                              </>
                            )}

                            {spreadsheetCategory === 'orangtua' && (
                              <>
                                <td className="py-1 px-3 text-left font-bold text-slate-800">{row.nama}</td>
                                <td className="py-1 px-3 text-left text-slate-700">{row.namaAyah}</td>
                                <td className="py-1 px-3 text-left text-slate-500">{row.statusAyah}</td>
                                <td className="py-1 px-3 text-left text-slate-600">{row.pekerjaanAyah}</td>
                                <td className="py-1 px-3 text-left text-slate-600">{row.noHpAyah}</td>
                                <td className="py-1 px-3 text-left text-slate-700">{row.namaIbu}</td>
                                <td className="py-1 px-3 text-left text-slate-500">{row.statusIbu}</td>
                                <td className="py-1 px-3 text-left text-slate-600">{row.pekerjaanIbu}</td>
                                <td className="py-1 px-3 text-left text-slate-600">{row.noHpIbu}</td>
                                <td className="py-1 px-3 text-left text-slate-600">{row.wali}</td>
                                <td className="py-1 px-3 text-left text-slate-600">{row.pekerjaanWali}</td>
                                <td className="py-1 px-3 text-left font-bold text-teal-600">{row.penghasilan}</td>
                                <td className="py-1 px-3 text-left text-slate-500">{row.pendidikanKeluarga}</td>
                              </>
                            )}

                            {spreadsheetCategory === 'akademik' && (
                              <>
                                <td className="py-1 px-3 text-left font-bold text-slate-800">{row.nama}</td>
                                <td className="py-1 px-3 text-left font-bold text-emerald-700">{row.kelas}</td>
                                <td className="py-1 px-3 text-left font-bold text-teal-700">{row.tahunPelajaran}</td>
                                <td className="py-1 px-3 text-center font-bold text-blue-600 bg-blue-50/30">{row.rataRataRapor}</td>
                                <td className="py-1 px-3 text-left text-slate-600 truncate max-w-[200px]" title={row.catatanWaliKelas}>{row.catatanWaliKelas}</td>
                                <td className="py-1 px-3 text-center font-bold text-rose-600 bg-rose-50/30">{row.poinPelanggaran} Poin</td>
                                <td className="py-1 px-3 text-left text-slate-500">{row.tahunMasuk}</td>
                              </>
                            )}

                            {spreadsheetCategory === 'kesehatan' && (
                              <>
                                <td className="py-1 px-3 text-left font-bold text-slate-800">{row.nama}</td>
                                <td className="py-1 px-3 text-center text-slate-600">{row.tinggi} cm</td>
                                <td className="py-1 px-3 text-center text-slate-600">{row.berat} kg</td>
                                <td className="py-1 px-3 text-center font-bold text-blue-700">{row.golDarah}</td>
                                <td className="py-1 px-3 text-left text-slate-600">{row.riwayatPenyakit}</td>
                                <td className="py-1 px-3 text-left text-slate-600">{row.kelainanFisik}</td>
                                <td className="py-1 px-3 text-left text-slate-500 truncate max-w-[150px]" title={row.catatanMedis}>{row.catatanMedis}</td>
                                <td className="py-1 px-3 text-left text-slate-500">{row.kelas}</td>
                              </>
                            )}

                            {spreadsheetCategory === 'ekonomi' && (
                              <>
                                <td className="py-1 px-3 text-left font-bold text-slate-800">{row.nama}</td>
                                <td className="py-1 px-3 text-left text-slate-600">{row.statusRumah}</td>
                                <td className="py-1 px-3 text-left text-slate-600">{row.sumberAir}</td>
                                <td className="py-1 px-3 text-left text-slate-600">{row.fasilitasBelajar}</td>
                                <td className="py-1 px-3 text-left text-slate-600">{row.transportasi}</td>
                                <td className="py-1 px-3 text-left font-semibold text-amber-700">{row.kip}</td>
                                <td className="py-1 px-3 text-left text-slate-500 truncate max-w-[150px]" title={row.catatanEkonomi}>{row.catatanEkonomi}</td>
                                <td className="py-1 px-3 text-left text-slate-500">{row.kelas}</td>
                              </>
                            )}

                            {spreadsheetCategory === 'psikologi' && (
                              <>
                                <td className="py-1 px-3 text-left font-bold text-slate-800">{row.nama}</td>
                                <td className="py-1 px-3 text-left text-slate-600">{row.hobi}</td>
                                <td className="py-1 px-3 text-left text-slate-600">{row.bakat}</td>
                                <td className="py-1 px-3 text-left text-slate-600">{row.citaCita}</td>
                                <td className="py-1 px-3 text-left text-slate-600">{row.kepribadian}</td>
                                <td className="py-1 px-3 text-left text-slate-500 truncate max-w-[200px]" title={row.catatanPsikologi}>{row.catatanPsikologi}</td>
                                <td className="py-1 px-3 text-left text-slate-500">{row.kelas}</td>
                              </>
                            )}

                            {spreadsheetCategory === 'prestasi' && (
                              <>
                                <td className="py-1 px-3 text-left font-bold text-slate-800">{row.nama}</td>
                                <td className="py-1 px-3 text-left text-slate-500">{row.kelas}</td>
                                <td className="py-1 px-3 text-center font-bold text-amber-800 bg-amber-50/50">{row.jumlahPrestasi} Prestasi</td>
                                <td className="py-1 px-3 text-left text-slate-600 truncate max-w-[300px]" title={row.daftarPrestasi}>{row.daftarPrestasi || '-'}</td>
                              </>
                            )}
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan={20} className="py-8 text-center text-slate-400 italic">
                          Tidak ada data yang cocok dengan pencarian atau filter.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Excel Sheet Footer info */}
            <div className="bg-slate-100 border-t border-slate-300 px-4 py-2 text-[10px] text-slate-500 flex justify-between items-center flex-shrink-0">
              <div className="flex items-center gap-3">
                <span className="font-semibold text-slate-700">Total Baris: {filteredSpreadsheetRows.length} dari {db.siswa.length} siswa</span>
                <span>•</span>
                <span className="text-emerald-700 font-medium">Lokal & Google Sheets Terpadu</span>
              </div>
              <div>
                <span>Gunakan mouse scroll untuk geser horizontal / vertikal</span>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Custom Delete Student Confirmation Modal */}
      {deleteConfirmSiswaId && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-xl border border-slate-100 space-y-4 animate-scale-up">
            <div className="flex items-center gap-3 text-rose-600">
              <div className="w-10 h-10 bg-rose-50 rounded-xl flex items-center justify-center flex-shrink-0">
                <AlertCircle size={20} />
              </div>
              <h3 className="font-bold text-slate-800 text-sm">Konfirmasi Hapus Siswa</h3>
            </div>
            
            <p className="text-xs text-slate-500 leading-relaxed">
              Apakah Anda yakin ingin menghapus siswa <strong>{db.siswa.find(s => s.id === deleteConfirmSiswaId)?.nama}</strong> ini secara permanen beserta seluruh rekam datanya (kesehatan, orang tua, ekonomi, prestasi, pelanggaran, konseling, dll.)? Tindakan ini tidak dapat dibatalkan.
            </p>

            <div className="flex justify-end gap-2 pt-2">
              <button 
                type="button" 
                onClick={() => {
                  setDeleteConfirmSiswaId(null);
                }}
                disabled={isDeletingSiswa}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl font-semibold text-xs transition disabled:opacity-50"
              >
                Batal
              </button>
              <button 
                type="button" 
                onClick={confirmDeleteSiswa}
                disabled={isDeletingSiswa}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-bold text-xs shadow-sm transition flex items-center gap-1.5 disabled:opacity-50"
              >
                {isDeletingSiswa ? 'Menghapus...' : 'Ya, Hapus Permanen'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Custom Delete Achievement Confirmation Modal */}
      {deleteConfirmPrestasiId && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-xl border border-slate-100 space-y-4 animate-scale-up">
            <div className="flex items-center gap-3 text-rose-600">
              <div className="w-10 h-10 bg-rose-50 rounded-xl flex items-center justify-center flex-shrink-0">
                <AlertCircle size={20} />
              </div>
              <h3 className="font-bold text-slate-800 text-sm">Konfirmasi Hapus Prestasi</h3>
            </div>
            
            <p className="text-xs text-slate-500 leading-relaxed">
              Apakah Anda yakin ingin menghapus data prestasi siswa ini secara permanen? Tindakan ini tidak dapat dibatalkan.
            </p>

            <div className="flex justify-end gap-2 pt-2">
              <button 
                type="button" 
                onClick={() => {
                  setDeleteConfirmPrestasiId(null);
                }}
                disabled={isDeletingPrestasi}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl font-semibold text-xs transition disabled:opacity-50"
              >
                Batal
              </button>
              <button 
                type="button" 
                onClick={confirmDeletePrestasi}
                disabled={isDeletingPrestasi}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-bold text-xs shadow-sm transition flex items-center gap-1.5 disabled:opacity-50"
              >
                {isDeletingPrestasi ? 'Menghapus...' : 'Ya, Hapus'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
