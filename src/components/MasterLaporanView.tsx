/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import * as XLSX from 'xlsx';
import { 
  FileSpreadsheet, 
  Printer, 
  Plus, 
  Trash2, 
  Edit3, 
  CheckCircle, 
  Settings,
  Database,
  Users,
  GraduationCap,
  Calendar,
  X,
  TrendingUp,
  BarChart2,
  Download,
  Award,
  BookOpen,
  AlertCircle
} from 'lucide-react';
import { 
  DatabaseState, 
  User, 
  UserRole,
  TahunPelajaran,
  Kelas
} from '../types';

interface MasterLaporanViewProps {
  db: DatabaseState;
  currentUser: User;
  
  // Master Data Callback Actions
  onSaveTP: (tp: TahunPelajaran, isNew: boolean) => Promise<boolean>;
  onDeleteTP: (id: string) => Promise<boolean>;
  onSaveKelas: (kl: Kelas, isNew: boolean) => Promise<boolean>;
  onDeleteKelas: (id: string) => Promise<boolean>;
  onSaveUser: (u: User, isNew: boolean) => Promise<boolean>;
  onDeleteUser: (id: string) => Promise<boolean>;
}

export default function MasterLaporanView({
  db,
  currentUser,
  onSaveTP,
  onDeleteTP,
  onSaveKelas,
  onDeleteKelas,
  onSaveUser,
  onDeleteUser
}: MasterLaporanViewProps) {

  const isAdmin = currentUser.role === UserRole.ADMIN;

  // Active top level tab: 'laporan' or 'master'
  const [activeTab, setActiveTab] = useState<'laporan' | 'master'>('laporan');

  // REPORT FILTERS
  const [filterKelasId, setFilterKelasId] = useState<string>('All');
  const [filterSemester, setFilterSemester] = useState<string>('All');
  const [filterTahunText, setFilterTahunText] = useState<string>('');
  const [filterGuruBkId, setFilterGuruBkId] = useState<string>('All');

  // MASTER DATA STATE NAVIGATION
  const [activeMasterTab, setActiveMasterTab] = useState<'tp' | 'kelas' | 'users'>('tp');
  const [isMasterFormOpen, setIsMasterFormOpen] = useState(false);
  const [editingMasterId, setEditingMasterId] = useState<string | null>(null);

  // NEW CHARTING & ANALYTICAL STATES
  const [laporanSubTab, setLaporanSubTab] = useState<'tabel' | 'grafik'>('tabel');
  const [chartGrouping, setChartGrouping] = useState<'tingkat' | 'rombel'>('tingkat');
  const [chartMetric, setChartMetric] = useState<'poin' | 'kasus'>('poin');
  const [hoveredBar, setHoveredBar] = useState<{ month: string; series: string; value: number; x: number; y: number } | null>(null);

  // Custom Delete Confirmation state
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Unified master entity payload form state
  const [formTP, setFormTP] = useState<Partial<TahunPelajaran>>({});
  const [formKelas, setFormKelas] = useState<Partial<Kelas>>({});
  const [formUser, setFormUser] = useState<Partial<User>>({});

  // Compile matched report data based on filters
  const reportSiswaList = useMemo(() => {
    return db.siswa.filter(s => {
      const matchKelas = filterKelasId === 'All' || s.kelasId === filterKelasId;
      
      const ak = db.akademik.find(a => a.id === s.id);
      const matchSemester = filterSemester === 'All' || ak?.semester === filterSemester;
      
      // Filter by counselor of the class
      const kelasObj = db.kelas.find(k => k.id === s.kelasId);
      const matchGuru = filterGuruBkId === 'All' || kelasObj?.waliKelasId === filterGuruBkId;

      // Filter by school year (text matching on student's entry year or available academic state)
      const queryLower = filterTahunText.toLowerCase().trim();
      const matchTahun = !filterTahunText.trim() || 
        (s.tahunMasuk && String(s.tahunMasuk).toLowerCase().includes(queryLower)) ||
        (s.tahunPelajaran && String(s.tahunPelajaran).toLowerCase().includes(queryLower));

      return matchKelas && matchSemester && matchGuru && matchTahun;
    });
  }, [db, filterKelasId, filterSemester, filterTahunText, filterGuruBkId]);

  // Compile matched chart data grouped by class and month
  const chartData = useMemo(() => {
    // 1. Determine which months to show (school year starts in July)
    let monthsToInclude: number[] = []; // month indices 0-11
    if (filterSemester === '1') {
      monthsToInclude = [6, 7, 8, 9, 10, 11]; // Juli - Des (Ganjil)
    } else if (filterSemester === '2') {
      monthsToInclude = [0, 1, 2, 3, 4, 5]; // Jan - Jun (Genap)
    } else {
      monthsToInclude = [6, 7, 8, 9, 10, 11, 0, 1, 2, 3, 4, 5]; // Juli - Juni (Semua)
    }

    const indonesianMonthNames = [
      'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
      'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
    ];

    // 2. Filter violations based on the same active filters
    const filteredViolations = db.pelanggaran.filter(p => {
      const s = db.siswa.find(x => x.id === p.siswaId);
      if (!s) return false;

      // Filter by KelasId
      const matchKelas = filterKelasId === 'All' || s.kelasId === filterKelasId;

      // Filter by Semester
      const ak = db.akademik.find(a => a.id === s.id);
      const matchSemester = filterSemester === 'All' || ak?.semester === filterSemester;

      // Filter by Counselor / BK Guru of the class
      const kelasObj = db.kelas.find(k => k.id === s.kelasId);
      const matchGuru = filterGuruBkId === 'All' || kelasObj?.waliKelasId === filterGuruBkId;

      // Filter by school year (text matching on student's entry year or available academic state or date)
      const queryLower = filterTahunText.toLowerCase().trim();
      const matchTahun = !filterTahunText.trim() || 
        (s.tahunMasuk && String(s.tahunMasuk).toLowerCase().includes(queryLower)) ||
        (s.tahunPelajaran && String(s.tahunPelajaran).toLowerCase().includes(queryLower)) ||
        (p.tanggal && String(p.tanggal).toLowerCase().includes(queryLower));

      return matchKelas && matchSemester && matchGuru && matchTahun;
    });

    // 3. Define series names based on grouping choice
    let seriesNames: string[] = [];
    if (chartGrouping === 'tingkat') {
      seriesNames = ['Kelas 7', 'Kelas 8', 'Kelas 9'];
    } else {
      // Find classes that have violations, sorted by total metric descending, to select top 5
      const classScores: { [kelasId: string]: number } = {};
      filteredViolations.forEach(p => {
        const s = db.siswa.find(x => x.id === p.siswaId);
        if (s && s.kelasId) {
          classScores[s.kelasId] = (classScores[s.kelasId] || 0) + (chartMetric === 'poin' ? Number(p.poin) : 1);
        }
      });

      // Sort classes by score descending
      const sortedClassIds = Object.keys(classScores).sort((a, b) => classScores[b] - classScores[a]);
      
      // Take top 5 classes, other classes are lumped in "Lainnya"
      const topClassIds = sortedClassIds.slice(0, 5);
      const topClassNames = topClassIds.map(cid => db.kelas.find(k => k.id === cid)?.namaKelas || 'Unknown');
      
      seriesNames = [...topClassNames];
      if (sortedClassIds.length > 5) {
        seriesNames.push('Lainnya');
      }
      
      // Fallback to active classes if no violations exist
      if (seriesNames.length === 0) {
        seriesNames = db.kelas.slice(0, 5).map(k => k.namaKelas);
      }
    }

    // 4. Construct the final monthly structured data
    const monthlyDataList = monthsToInclude.map(mIdx => {
      const dataObj: { [key: string]: any } = {
        monthLabel: indonesianMonthNames[mIdx],
        monthIdx: mIdx,
        totals: 0
      };

      // Init all series values to 0
      seriesNames.forEach(name => {
        dataObj[name] = 0;
      });

      // Violations matching this specific month
      const monthViolations = filteredViolations.filter(p => {
        if (!p.tanggal) return false;
        const parts = p.tanggal.split('-');
        if (parts.length >= 2) {
          return parseInt(parts[1], 10) - 1 === mIdx;
        }
        const d = new Date(p.tanggal);
        return d.getMonth() === mIdx;
      });

      // Populate series values
      monthViolations.forEach(p => {
        const s = db.siswa.find(x => x.id === p.siswaId);
        if (!s) return;
        const k = db.kelas.find(x => x.id === s.kelasId);
        if (!k) return;

        const val = chartMetric === 'poin' ? Number(p.poin) : 1;
        dataObj.totals += val;

        if (chartGrouping === 'tingkat') {
          const nameLower = k.namaKelas.toLowerCase();
          if (nameLower.includes('7') || nameLower.includes('vii')) {
            dataObj['Kelas 7'] += val;
          } else if (nameLower.includes('8') || nameLower.includes('viii')) {
            dataObj['Kelas 8'] += val;
          } else if (nameLower.includes('9') || nameLower.includes('ix')) {
            dataObj['Kelas 9'] += val;
          } else {
            dataObj['Kelas 7'] += val; // Fallback
          }
        } else {
          if (seriesNames.includes(k.namaKelas)) {
            dataObj[k.namaKelas] += val;
          } else if (seriesNames.includes('Lainnya')) {
            dataObj['Lainnya'] += val;
          }
        }
      });

      return dataObj;
    });

    return {
      seriesNames,
      monthlyDataList,
      chartMetric,
      chartGrouping
    };
  }, [db, filterKelasId, filterSemester, filterTahunText, filterGuruBkId, chartGrouping, chartMetric]);

  // EXPORT TO EXCEL COMPLIANT XLSX IMPLEMENTATION
  const handleExportExcel = () => {
    if (reportSiswaList.length === 0) {
      alert('Tidak ada data laporan untuk diekspor!');
      return;
    }

    const headers = ['NIS', 'NISN', 'Nama Siswa', 'Kelas', 'Gender', 'Sebab Pelanggaran Poin', 'Rata-Rata Rapor', 'Penghasilan Orang Tua'];
    const rows = reportSiswaList.map(s => {
      const kelas = db.kelas.find(k => k.id === s.kelasId)?.namaKelas || '-';
      const originalPts = db.pelanggaran.filter(p => p.siswaId === s.id).reduce((sum, p) => sum + Number(p.poin), 0);
      const remisiPts = (db.remisiPoin || []).filter(r => r.siswaId === s.id).reduce((sum, r) => sum + Number(r.poin), 0);
      const pts = Math.max(0, originalPts - remisiPts);
      const raport = db.akademik.find(a => a.id === s.id)?.rataRataRaport || 0;
      const ot = db.orangTua.find(o => o.id === s.id)?.penghasilan || '-';

      return [
        s.nis,
        s.nisn,
        s.nama,
        kelas,
        s.jenisKelamin,
        `${pts} Poin`,
        raport,
        ot
      ];
    });

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet([headers, ...rows]);
    XLSX.utils.book_append_sheet(wb, ws, 'Laporan BK Siswa');
    XLSX.writeFile(wb, `laporan_siswa_bk_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  const handlePrintLaporan = () => {
    const filterText = `Semester: ${filterSemester === 'All' ? 'Semua Semester' : 'Semester ' + filterSemester} | Kelas: ${filterKelasId === 'All' ? 'Semua Kelas' : db.kelas.find(k => k.id === filterKelasId)?.namaKelas || '-'} | TP: ${filterTahunText || 'Semua'}`;

    const printDate = new Date().toLocaleDateString('id-ID', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    // Programmatically construct rows for high fidelity
    let rowsHTML = '';
    reportSiswaList.forEach((s, idx) => {
      const kelasObj = db.kelas.find(k => 
        k.id === s.kelasId || 
        k.namaKelas.toLowerCase().trim() === s.kelasId?.toLowerCase().trim()
      );
      const kelas = kelasObj?.namaKelas || s.kelasId || '-';
      const originalPts = db.pelanggaran.filter(p => p.siswaId === s.id).reduce((sum, p) => sum + Number(p.poin), 0);
      const remisiPts = (db.remisiPoin || []).filter(r => r.siswaId === s.id).reduce((sum, r) => sum + Number(r.poin), 0);
      const pts = Math.max(0, originalPts - remisiPts);
      const raport = db.akademik.find(a => a.id === s.id)?.rataRataRaport || '-';
      const ot = db.orangTua.find(o => o.id === s.id)?.pendidikanOrangTua || '-';

      rowsHTML += `
        <tr>
          <td style="text-align: center; padding: 8px; border: 1px solid #000000;">${idx + 1}</td>
          <td style="padding: 8px; border: 1px solid #000000; font-weight: bold;">${s.nama}</td>
          <td style="text-align: center; padding: 8px; border: 1px solid #000000; font-family: monospace;">${s.nis}</td>
          <td style="text-align: center; padding: 8px; border: 1px solid #000000;">${kelas}</td>
          <td style="text-align: center; padding: 8px; border: 1px solid #000000; font-weight: bold;">${pts} Poin</td>
          <td style="text-align: center; padding: 8px; border: 1px solid #000000; font-weight: bold;">${raport}</td>
          <td style="padding: 8px; border: 1px solid #000000;">${ot}</td>
        </tr>
      `;
    });

    if (reportSiswaList.length === 0) {
      rowsHTML = `
        <tr>
          <td colspan="7" style="text-align: center; padding: 20px; border: 1px solid #000000; color: #555555;">
            Tidak ada catatan penarikan laporan cocok dengan filter di atas.
          </td>
        </tr>
      `;
    }

    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Laporan Rekapitulasi BK - ${new Date().toISOString().split('T')[0]}</title>
            <style>
              @page {
                size: A4 portrait;
                margin: 1.5cm;
              }
              body {
                font-family: 'Times New Roman', Times, serif;
                color: #000000;
                margin: 0;
                padding: 0;
                line-height: 1.4;
                font-size: 10.5pt;
              }
              .header-container {
                border-bottom: 4px double #000000;
                padding-bottom: 12px;
                margin-bottom: 20px;
                text-align: center;
              }
              .institution-header {
                font-size: 11pt;
                font-weight: bold;
                text-transform: uppercase;
                margin: 0;
                letter-spacing: 0.5px;
              }
              .school-title {
                font-size: 14pt;
                font-weight: bold;
                text-transform: uppercase;
                margin: 4px 0 0 0;
                letter-spacing: 1px;
              }
              .school-address {
                font-size: 8.5pt;
                font-weight: normal;
                font-style: italic;
                margin: 4px 0 0 0;
                color: #333333;
              }
              .doc-title {
                text-align: center;
                font-size: 12pt;
                font-weight: bold;
                text-transform: uppercase;
                margin: 20px 0 5px 0;
                letter-spacing: 0.5px;
              }
              .meta-text {
                text-align: center;
                font-size: 9.5pt;
                margin-bottom: 25px;
                font-style: italic;
                color: #111111;
              }
              .data-table {
                width: 100%;
                border-collapse: collapse;
                font-size: 9.5pt;
                margin-top: 10px;
                margin-bottom: 35px;
              }
              .data-table th {
                background-color: #f2f2f2;
                font-weight: bold;
                text-transform: uppercase;
                font-size: 9pt;
                padding: 10px 8px;
                border: 1px solid #000000;
                text-align: center;
              }
              .sig-section {
                margin-top: 40px;
                width: 100%;
                page-break-inside: avoid;
              }
              .sig-table {
                width: 100%;
                border: none;
              }
              .sig-table td {
                width: 50%;
                text-align: center;
                vertical-align: top;
                font-size: 10.5pt;
                border: none;
                padding: 0;
              }
              .sig-space {
                height: 65px;
              }
              .sig-line {
                display: inline-block;
                width: 200px;
                border-bottom: 1px solid #000000;
                margin-bottom: 5px;
              }
              .sig-title {
                margin-bottom: 5px;
              }
            </style>
          </head>
          <body>
            <!-- Kop Surat Resmi -->
            <div class="header-container">
              <div class="institution-header">PEMERINTAH KOTA TANGERANG SELATAN</div>
              <div class="institution-header">DINAS PENDIDIKAN DAN KEBUDAYAAN</div>
              <div class="school-title">UPTD SMP NEGERI 17 KOTA TANGERANG SELATAN</div>
              <div class="school-address">Komplek Pamulang Permai I, RT.003/RW.010, Kelurahan Pamulang Barat, Kecamatan Pamulang, Kota Tangerang Selatan, Banten 15417</div>
            </div>

            <!-- Judul Dokumen -->
            <div class="doc-title">LAPORAN REKAPITULASI BIMBINGAN KONSELING SISWA</div>
            <div class="meta-text">
              Filter Parameter: ${filterText}<br/>
              Dicetak Pada: ${printDate}
            </div>

            <!-- Tabel Data -->
            <table class="data-table">
              <thead>
                <tr>
                  <th style="width: 5%;">No</th>
                  <th style="width: 25%; text-align: left;">Nama Siswa</th>
                  <th style="width: 12%;">NIS</th>
                  <th style="width: 12%;">Kelas</th>
                  <th style="width: 15%;">Poin Disiplin</th>
                  <th style="width: 13%;">Rapor (Rata-rata)</th>
                  <th style="width: 18%; text-align: left;">Pendidikan Orang Tua</th>
                </tr>
              </thead>
              <tbody>
                ${rowsHTML}
              </tbody>
            </table>

            <!-- Tanda Tangan Seksi -->
            <div class="sig-section">
              <table class="sig-table">
                <tr>
                  <td>
                    <div class="sig-title">Mengetahui,</div>
                    <div class="sig-title">Kepala Sekolah</div>
                    <div class="sig-space"></div>
                    <div class="sig-line"></div>
                    <div>NIP. &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;</div>
                  </td>
                  <td>
                    <div class="sig-title">Tangerang Selatan, ${new Date().toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
                    <div class="sig-title">Guru BK</div>
                    <div class="sig-space"></div>
                    <div class="sig-line"></div>
                    <div>NIP. &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;</div>
                  </td>
                </tr>
              </table>
            </div>

            <script>
              window.onload = function() {
                window.print();
                setTimeout(function() {
                  window.close();
                }, 500);
              };
            </script>
          </body>
        </html>
      `);
      printWindow.document.close();
    }
  };

  const handlePrintChartPDF = () => {
    const indonesianMonthNames = [
      'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
      'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
    ];

    const { seriesNames, monthlyDataList } = chartData;

    // Chart scale & sizing specs
    const width = 720;
    const height = 360;
    const paddingLeft = 60;
    const paddingRight = 40;
    const paddingTop = 40;
    const paddingBottom = 50;
    const chartWidth = width - paddingLeft - paddingRight;
    const chartHeight = height - paddingTop - paddingBottom;

    // Find the maximum value to scale Y axis
    const maxVal = Math.max(
      10,
      ...monthlyDataList.map(item => Math.max(...seriesNames.map(name => Number(item[name] || 0))))
    );
    const roundToNiceNumber = (val: number) => {
      if (val <= 10) return 10;
      if (val <= 50) return 50;
      if (val <= 100) return 100;
      if (val <= 500) return Math.ceil(val / 50) * 50;
      return Math.ceil(val / 100) * 100;
    };
    const niceMaxY = roundToNiceNumber(maxVal);

    // Color definitions for printing
    const seriesColorsPrint: { [key: string]: string } = {
      'Kelas 7': '#0ea5e9',
      'Kelas 8': '#f43f5e',
      'Kelas 9': '#8b5cf6',
      'Lainnya': '#64748b',
    };
    const defaultPalettePrint = ['#0ea5e9', '#f43f5e', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#14b8a6', '#6366f1'];
    const getColPrint = (name: string, idx: number) => seriesColorsPrint[name] || defaultPalettePrint[idx % defaultPalettePrint.length];

    // Create gridlines SVG code
    let gridLinesHTML = '';
    const ticks = 4;
    for (let t = 0; t <= ticks; t++) {
      const val = (niceMaxY / ticks) * t;
      const y = paddingTop + chartHeight - (val / niceMaxY) * chartHeight;
      gridLinesHTML += `
        <line x1="${paddingLeft}" y1="${y}" x2="${width - paddingRight}" y2="${y}" stroke="#e2e8f0" stroke-dasharray="3,3" stroke-width="1" />
        <text x="${paddingLeft - 8}" y="${y + 3}" font-size="9" font-family="sans-serif" text-anchor="end" fill="#64748b">${val}</text>
      `;
    }

    // Create bars and X label axis markers
    let barsHTML = '';
    let xLabelsHTML = '';
    const numSeries = seriesNames.length;
    const groupWidth = chartWidth / monthlyDataList.length;

    monthlyDataList.forEach((item, i) => {
      const monthX = paddingLeft + i * groupWidth;
      const innerSpacing = 3;
      const groupPadding = 10;
      const availableWidth = groupWidth - groupPadding * 2;
      const barWidth = Math.max(3, (availableWidth - innerSpacing * (numSeries - 1)) / numSeries);

      // X Label
      const labelX = monthX + groupWidth / 2;
      xLabelsHTML += `
        <text x="${labelX}" y="${height - paddingBottom + 18}" font-size="9" font-family="sans-serif" text-anchor="middle" font-weight="600" fill="#475569">${item.monthLabel}</text>
      `;

      seriesNames.forEach((name, sIdx) => {
        const val = Number(item[name] || 0);
        const barHeight = (val / niceMaxY) * chartHeight;
        const barX = monthX + groupPadding + sIdx * (barWidth + innerSpacing);
        const barY = paddingTop + chartHeight - barHeight;
        const col = getColPrint(name, sIdx);

        if (val > 0) {
          barsHTML += `
            <rect x="${barX}" y="${barY}" width="${barWidth}" height="${barHeight}" fill="${col}" rx="1.5" ry="1.5" />
            <text x="${barX + barWidth / 2}" y="${barY - 3}" font-size="8" font-family="sans-serif" text-anchor="middle" font-weight="bold" fill="#334155">${val}</text>
          `;
        }
      });
    });

    // Create Legend items
    let legendsHTML = '';
    seriesNames.forEach((name, idx) => {
      const col = getColPrint(name, idx);
      legendsHTML += `
        <div style="display: flex; align-items: center; gap: 6px; font-size: 11px; font-weight: 600; font-family: sans-serif; color: #334155;">
          <div style="width: 12px; height: 12px; background-color: ${col}; border-radius: 3px;"></div>
          <span>${name}</span>
        </div>
      `;
    });

    const svgString = `
      <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" style="background-color: #ffffff; display: block; margin: 0 auto;">
        ${gridLinesHTML}
        <line x1="${paddingLeft}" y1="${paddingTop}" x2="${paddingLeft}" y2="${height - paddingBottom}" stroke="#cbd5e1" stroke-width="1" />
        <line x1="${paddingLeft}" y1="${height - paddingBottom}" x2="${width - paddingRight}" y2="${height - paddingBottom}" stroke="#cbd5e1" stroke-width="1" />
        ${barsHTML}
        ${xLabelsHTML}
      </svg>
    `;

    // Construct table data
    let tableRowsHTML = '';
    monthlyDataList.forEach(item => {
      let cellsHTML = ``;
      seriesNames.forEach(name => {
        cellsHTML += `<td style="padding: 6px 8px; border: 1px solid #cbd5e1; text-align: center;">${item[name] || 0}</td>`;
      });
      tableRowsHTML += `
        <tr style="border-bottom: 1px solid #cbd5e1;">
          <td style="padding: 6px 8px; border: 1px solid #cbd5e1; font-weight: bold; background-color: #f8fafc;">${item.monthLabel}</td>
          ${cellsHTML}
          <td style="padding: 6px 8px; border: 1px solid #cbd5e1; text-align: center; font-weight: bold; background-color: #f1f5f9;">${item.totals}</td>
        </tr>
      `;
    });

    let tableHeaderCellsHTML = '';
    seriesNames.forEach(name => {
      tableHeaderCellsHTML += `<th style="padding: 8px 8px; border: 1px solid #cbd5e1; background-color: #f1f5f9; color: #1e293b;">${name}</th>`;
    });

    const filterText = `
      Semester: ${filterSemester === 'All' ? 'Semua Semester' : 'Semester ' + filterSemester} | 
      Kelas: ${filterKelasId === 'All' ? 'Semua Kelas' : db.kelas.find(k => k.id === filterKelasId)?.namaKelas || '-'} | 
      Tahun Pelajaran: ${filterTahunText || 'Semua'}
    `;

    const printDate = new Date().toLocaleDateString('id-ID', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Laporan Grafik Tingkat Pelanggaran - ${new Date().toISOString().split('T')[0]}</title>
            <style>
              @page {
                size: A4 portrait;
                margin: 1.2cm 1.5cm 1.2cm 1.5cm;
              }
              body {
                font-family: 'Times New Roman', Times, serif;
                color: #000000;
                margin: 0;
                padding: 0;
                line-height: 1.3;
                font-size: 10.5pt;
              }
              .header-container {
                border-bottom: 4px double #000000;
                padding-bottom: 8px;
                margin-bottom: 15px;
                text-align: center;
              }
              .school-title {
                font-size: 14pt;
                font-weight: bold;
                text-transform: uppercase;
                margin: 0;
              }
              .school-subtitle {
                font-size: 11pt;
                margin: 3px 0 0 0;
                text-transform: uppercase;
                font-weight: bold;
              }
              .doc-title {
                text-align: center;
                font-size: 12pt;
                font-weight: bold;
                text-transform: uppercase;
                margin: 15px 0 5px 0;
                text-decoration: underline;
              }
              .meta-text {
                text-align: center;
                font-size: 9pt;
                margin-bottom: 20px;
                font-style: italic;
              }
              .chart-wrapper {
                border: 1px solid #000000;
                border-radius: 6px;
                padding: 12px;
                margin-bottom: 20px;
                background-color: #ffffff;
              }
              .legend-container {
                display: flex;
                justify-content: center;
                gap: 15px;
                margin-top: 12px;
                flex-wrap: wrap;
              }
              .data-table {
                width: 100%;
                border-collapse: collapse;
                font-size: 9.5pt;
                margin-top: 10px;
                margin-bottom: 25px;
              }
              .data-table th, .data-table td {
                border: 1px solid #000000;
              }
              .sig-section {
                margin-top: 30px;
                width: 100%;
                page-break-inside: avoid;
              }
              .sig-table {
                width: 100%;
                border: none;
              }
              .sig-table td {
                width: 50%;
                text-align: center;
                vertical-align: top;
                font-size: 10.5pt;
                border: none;
              }
              .sig-space {
                height: 50px;
              }
              .sig-name {
                font-weight: bold;
              }
              .sig-nip {
                font-size: 9pt;
              }
            </style>
          </head>
          <body>
            <div class="doc-title" style="margin-top: 20px;">LEMBAR ANALISIS RINGKASAN GRAFIK PELANGGARAN SISWA</div>
            <div class="meta-text">
              Parameter Filter: ${filterText}<br/>
              Dicetak Pada: ${printDate}
            </div>
            
            <div class="chart-wrapper">
              <h4 style="margin: 0 0 10px 0; text-align: center; font-size: 10pt; text-transform: uppercase; font-weight: bold;">
                Tren Akumulasi ${chartMetric === 'poin' ? 'Poin Pelanggaran' : 'Jumlah Kasus'} Per Rombel Kelas
              </h4>
              ${svgString}
              <div class="legend-container">
                ${legendsHTML}
              </div>
            </div>

            <h4 style="margin: 15px 0 5px 0; font-size: 10pt; text-transform: uppercase; font-weight: bold;">Rincian Angka Pelanggaran Bulanan</h4>
            <table class="data-table">
              <thead>
                <tr style="background-color: #f1f5f9;">
                  <th style="padding: 6px 8px; text-align: left; background-color: #f1f5f9; font-weight: bold;">Bulan</th>
                  ${tableHeaderCellsHTML}
                  <th style="padding: 6px 8px; background-color: #e2e8f0; font-weight: bold;">Total Akumulasi</th>
                </tr>
              </thead>
              <tbody>
                ${tableRowsHTML}
              </tbody>
            </table>

            <div class="sig-section">
              <table class="sig-table">
                <tr>
                  <td>
                    <div>Mengetahui,</div>
                    <div>Kepala Sekolah,</div>
                    <div class="sig-space"></div>
                    <div class="sig-name">......................................................</div>
                    <div class="sig-nip">NIP. ......................................................</div>
                  </td>
                  <td>
                    <div>Tangerang Selatan, ${new Date().getDate()} ${indonesianMonthNames[new Date().getMonth()]} ${new Date().getFullYear()}</div>
                    <div>Koordinator Bimbingan Konseling,</div>
                    <div class="sig-space"></div>
                    <div class="sig-name">......................................................</div>
                    <div class="sig-nip">NIP. ......................................................</div>
                  </td>
                </tr>
              </table>
            </div>

            <script>
              window.onload = function() {
                window.print();
                window.close();
              };
            </script>
          </body>
        </html>
      `);
      printWindow.document.close();
    } else {
      alert('Gagal membuka jendela cetak. Pastikan pop-up tidak diblokir oleh browser.');
    }
  };

  // MASTER DATA MODAL TRIGGER
  const openMasterEditor = (entity: any | null) => {
    if (!isAdmin) return;
    const isNew = !entity;
    setEditingMasterId(isNew ? null : entity.id);

    if (activeMasterTab === 'tp') {
      setFormTP(isNew ? {
        id: `tp-${Date.now()}`,
        tahun: `${new Date().getFullYear()}/${new Date().getFullYear() + 1}`,
        semester: 'Ganjil',
        isActive: true
      } : entity);
    } else if (activeMasterTab === 'kelas') {
      setFormKelas(isNew ? {
        id: `kl-${Date.now()}`,
        namaKelas: '',
        waliKelasId: db.users[0]?.id || ''
      } : entity);
    } else if (activeMasterTab === 'users') {
      setFormUser(isNew ? {
        id: `usr-${Date.now()}`,
        username: '',
        nama: '',
        role: UserRole.GURU_BK,
        email: '',
        isActive: true
      } : entity);
    }

    setIsMasterFormOpen(true);
  };

  const handleMasterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const isNew = !editingMasterId;
    let success = false;

    if (activeMasterTab === 'tp') {
      success = await onSaveTP(formTP as TahunPelajaran, isNew);
    } else if (activeMasterTab === 'kelas') {
      success = await onSaveKelas(formKelas as Kelas, isNew);
    } else if (activeMasterTab === 'users') {
      success = await onSaveUser(formUser as User, isNew);
    }

    if (success) {
      setIsMasterFormOpen(false);
    }
  };

  const handleMasterDelete = (id: string) => {
    if (!isAdmin) return;
    setDeleteConfirmId(id);
  };

  const confirmDeleteMaster = async () => {
    if (!deleteConfirmId) return;
    setIsDeleting(true);
    try {
      if (activeMasterTab === 'tp') await onDeleteTP(deleteConfirmId);
      else if (activeMasterTab === 'kelas') await onDeleteKelas(deleteConfirmId);
      else if (activeMasterTab === 'users') await onDeleteUser(deleteConfirmId);
    } catch (err) {
      console.error('Error deleting master item:', err);
    } finally {
      setIsDeleting(false);
      setDeleteConfirmId(null);
    }
  };

  return (
    <div id="master-laporan-panel" className="space-y-6">
      
      {/* Tab Switcher */}
      <div className="flex bg-white p-1 rounded-xl border border-slate-100 shadow-sm w-fit text-xs font-semibold text-slate-500">
        <button 
          onClick={() => setActiveTab('laporan')}
          className={`px-4 py-2 rounded-lg flex items-center gap-1.5 transition ${activeTab === 'laporan' ? 'bg-emerald-600 text-white shadow-sm' : 'hover:bg-slate-50'}`}
        >
          <FileSpreadsheet size={14} /> Pusat Pelaporan Siswa
        </button>
        {isAdmin && (
          <button 
            onClick={() => setActiveTab('master')}
            className={`px-4 py-2 rounded-lg flex items-center gap-1.5 transition ${activeTab === 'master' ? 'bg-emerald-600 text-white shadow-sm' : 'hover:bg-slate-50'}`}
          >
            <Settings size={14} /> Pengaturan Master Data
          </button>
        )}
      </div>

      {activeTab === 'laporan' ? (
        /* ==================== A. RAPORT & LAPORAN SECTION ==================== */
        <div className="space-y-6">
          {/* Filters card */}
          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm text-xs space-y-4">
            <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
              <FileSpreadsheet size={16} className="text-emerald-600" />
              Filter Penarikan Laporan Konseling & Perkembangan Siswa
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 mb-1">Kelas / Rombel</label>
                <select 
                  value={filterKelasId}
                  onChange={(e) => setFilterKelasId(e.target.value)}
                  className="p-2.5 border border-slate-200 bg-white rounded-xl w-full"
                >
                  <option value="All">Semua Kelas</option>
                  {db.kelas.map(k => <option key={k.id} value={k.id}>{k.namaKelas}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 mb-1">Semester</label>
                <select 
                  value={filterSemester}
                  onChange={(e) => setFilterSemester(e.target.value)}
                  className="p-2.5 border border-slate-200 bg-white rounded-xl w-full"
                >
                  <option value="All">Semua Semester</option>
                  <option value="1">Semester 1 (Ganjil)</option>
                  <option value="2">Semester 2 (Genap)</option>
                  <option value="3">Semester 3</option>
                  <option value="4">Semester 4</option>
                  <option value="5">Semester 5</option>
                  <option value="6">Semester 6</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 mb-1">Tahun Pelajaran</label>
                <input 
                  type="text"
                  value={filterTahunText}
                  onChange={(e) => setFilterTahunText(e.target.value)}
                  placeholder="Ketik Tahun (misal: 2025)"
                  className="p-2.5 border border-slate-200 bg-white rounded-xl w-full"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 mb-1">Wali Kelas / Guru BK</label>
                <select 
                  value={filterGuruBkId}
                  onChange={(e) => setFilterGuruBkId(e.target.value)}
                  className="p-2.5 border border-slate-200 bg-white rounded-xl w-full"
                >
                  <option value="All">Semua Konselor</option>
                  {db.users.filter(u => u.role === UserRole.GURU_BK || u.role === UserRole.WALI_KELAS).map(u => (
                    <option key={u.id} value={u.id}>{u.nama}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Export buttons */}
            <div className="flex justify-end gap-2 pt-2 border-t border-slate-50">
              <button 
                onClick={handlePrintLaporan}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl flex items-center gap-1.5 transition"
              >
                <Printer size={14} /> Cetak / Print PDF
              </button>
              <button 
                onClick={handleExportExcel}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl flex items-center gap-1.5 transition shadow-sm"
              >
                <FileSpreadsheet size={14} /> Ekspor Format Excel (CSV)
              </button>
            </div>
          </div>

          {/* Sub Tab Switcher: Tabel vs Grafik */}
          <div className="flex bg-slate-100 p-1.5 rounded-xl border border-slate-200/60 w-fit text-xs font-semibold text-slate-600 shadow-inner">
            <button
              onClick={() => setLaporanSubTab('tabel')}
              className={`px-4 py-2 rounded-lg flex items-center gap-1.5 transition-all duration-200 ${
                laporanSubTab === 'tabel'
                  ? 'bg-white text-slate-900 shadow-sm font-bold'
                  : 'hover:text-slate-900 hover:bg-white/40'
              }`}
            >
              <FileSpreadsheet size={14} className="text-slate-500" />
              Tabel Rekapitulasi Siswa
            </button>
            <button
              onClick={() => setLaporanSubTab('grafik')}
              className={`px-4 py-2 rounded-lg flex items-center gap-1.5 transition-all duration-200 ${
                laporanSubTab === 'grafik'
                  ? 'bg-white text-slate-900 shadow-sm font-bold'
                  : 'hover:text-slate-900 hover:bg-white/40'
              }`}
            >
              <BarChart2 size={14} className="text-slate-500" />
              Grafik Tren Bulanan
            </button>
          </div>

          {laporanSubTab === 'tabel' ? (
            /* Report Tabular Data Table */
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
              <div id="printable-report-wrapper" className="p-4">
                {/* Formal Report Header (Visible when printed) */}
                <div className="hidden print:block text-center border-b pb-3 mb-4 space-y-1">
                  <p className="font-bold text-sm">LAPORAN REKAPITULASI BIMBINGAN KONSELING SISWA</p>
                  <p className="text-xs text-slate-500">Periode Akademik {new Date().getFullYear()}</p>
                </div>

                <div className="overflow-x-auto text-xs">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 font-bold uppercase tracking-wider">
                        <th className="py-3 px-4">Nama Siswa</th>
                        <th className="py-3 px-4">NIS</th>
                        <th className="py-3 px-4">Rombel Kelas</th>
                        <th className="py-3 px-4">Total Poin Disiplin</th>
                        <th className="py-3 px-4">Rata-Rata Rapor</th>
                        <th className="py-3 px-4">Pendidikan Orang Tua</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50 text-slate-700">
                      {reportSiswaList.length > 0 ? (
                        reportSiswaList.map(s => {
                          const kelas = db.kelas.find(k => k.id === s.kelasId)?.namaKelas || '-';
                          const originalPts = db.pelanggaran.filter(p => p.siswaId === s.id).reduce((sum, p) => sum + Number(p.poin), 0);
                          const remisiPts = (db.remisiPoin || []).filter(r => r.siswaId === s.id).reduce((sum, r) => sum + Number(r.poin), 0);
                          const pts = Math.max(0, originalPts - remisiPts);
                          const raport = db.akademik.find(a => a.id === s.id)?.rataRataRaport || '-';
                          const ot = db.orangTua.find(o => o.id === s.id)?.pendidikanOrangTua || '-';
                          return (
                            <tr key={s.id} className="hover:bg-slate-50/20">
                              <td className="py-3.5 px-4 font-bold text-slate-800">{s.nama}</td>
                              <td className="py-3.5 px-4 font-mono">{s.nis}</td>
                              <td className="py-3.5 px-4 font-semibold text-slate-600">{kelas}</td>
                              <td className="py-3.5 px-4">
                                <span className={`px-2 py-0.5 rounded font-black ${
                                  pts > 100 ? 'bg-rose-100 text-rose-800' : pts > 50 ? 'bg-amber-100 text-amber-800' : 'bg-emerald-50 text-emerald-800'
                                }`}>{pts} Poin</span>
                              </td>
                              <td className="py-3.5 px-4 font-bold text-slate-700">{raport}</td>
                              <td className="py-3.5 px-4">{ot}</td>
                            </tr>
                          );
                        })
                      ) : (
                        <tr>
                          <td colSpan={6} className="py-8 text-center text-slate-400 font-medium">
                            Tidak ada catatan penarikan laporan cocok dengan filter di atas.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          ) : (
            /* Elegant Interactive Chart Dashboard layout */
            <div className="space-y-6">
              {/* Top Row: Metric & Grouping Selection Controls */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm text-xs space-y-2">
                  <p className="font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5 text-[10px]">
                    <TrendingUp size={12} className="text-emerald-600" />
                    Metrik Sumbu Y (Jumlah Pelanggaran)
                  </p>
                  <div className="flex gap-1 bg-slate-50 p-1 rounded-lg">
                    <button
                      onClick={() => setChartMetric('poin')}
                      className={`flex-1 py-1.5 px-3 rounded-md transition font-semibold text-center ${
                        chartMetric === 'poin'
                          ? 'bg-emerald-600 text-white shadow-sm'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                      }`}
                    >
                      Akumulasi Poin
                    </button>
                    <button
                      onClick={() => setChartMetric('kasus')}
                      className={`flex-1 py-1.5 px-3 rounded-md transition font-semibold text-center ${
                        chartMetric === 'kasus'
                          ? 'bg-emerald-600 text-white shadow-sm'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                      }`}
                    >
                      Jumlah Kasus
                    </button>
                  </div>
                  <p className="text-[10px] text-slate-400 italic">
                    * "Akumulasi Poin" menghitung jumlah total poin pelanggaran, sedangkan "Jumlah Kasus" menghitung frekuensi kejadian.
                  </p>
                </div>

                <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm text-xs space-y-2">
                  <p className="font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5 text-[10px]">
                    <Users size={12} className="text-emerald-600" />
                    Pengelompokan (Kategori Seri)
                  </p>
                  <div className="flex gap-1 bg-slate-50 p-1 rounded-lg">
                    <button
                      onClick={() => setChartGrouping('tingkat')}
                      className={`flex-1 py-1.5 px-3 rounded-md transition font-semibold text-center ${
                        chartGrouping === 'tingkat'
                          ? 'bg-emerald-600 text-white shadow-sm'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                      }`}
                    >
                      Tingkat Kelas (7/8/9)
                    </button>
                    <button
                      onClick={() => setChartGrouping('rombel')}
                      className={`flex-1 py-1.5 px-3 rounded-md transition font-semibold text-center ${
                        chartGrouping === 'rombel'
                          ? 'bg-emerald-600 text-white shadow-sm'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                      }`}
                    >
                      Rombel Kelas Terbanyak
                    </button>
                  </div>
                  <p className="text-[10px] text-slate-400 italic">
                    * Mengelompokkan tren pelanggaran berdasarkan akumulasi rombel tertentu atau akumulasi tingkat jenjang umum.
                  </p>
                </div>

                {/* PDF Action card */}
                <div className="bg-gradient-to-br from-emerald-700 to-teal-800 p-4 rounded-xl text-white shadow-sm flex flex-col justify-between space-y-3">
                  <div className="space-y-1">
                    <h4 className="font-bold text-xs flex items-center gap-1.5">
                      <Download size={14} className="animate-bounce" />
                      Unduh Dokumen PDF Resmi
                    </h4>
                    <p className="text-[10.5px] text-emerald-100 leading-relaxed">
                      Sistem akan menyusun Lembar Analisis Grafik formal A4 lengkap dengan Kop Sekolah, Tabel Rekap Bulanan, serta tanda tangan pengesahan.
                    </p>
                  </div>
                  <button
                    onClick={handlePrintChartPDF}
                    className="w-full py-2 bg-white text-emerald-800 hover:bg-emerald-50 transition font-extrabold text-xs rounded-lg shadow-sm flex items-center justify-center gap-1.5"
                  >
                    <Download size={13} />
                    Download PDF Sekarang
                  </button>
                </div>
              </div>

              {/* Interactive SVG Chart Card */}
              <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
                  <div>
                    <h4 className="font-bold text-slate-800 text-sm flex items-center gap-1.5">
                      <BarChart2 size={16} className="text-emerald-600" />
                      Grafik Perkembangan Pelanggaran Bulanan
                    </h4>
                    <p className="text-[11px] text-slate-400">
                      Menampilkan data pelanggaran bulan demi bulan berdasarkan filter aktif.
                    </p>
                  </div>
                  {/* Legend Indicators */}
                  <div className="flex flex-wrap gap-3 text-[11px] font-bold text-slate-600 bg-slate-50 p-2 rounded-lg border border-slate-100/70">
                    {chartData.seriesNames.map((name, idx) => {
                      // Match colors nicely
                      const colors = [
                        'bg-sky-500', 'bg-rose-500', 'bg-emerald-500', 'bg-amber-500', 
                        'bg-violet-500', 'bg-pink-500', 'bg-teal-500', 'bg-indigo-500'
                      ];
                      let colClass = colors[idx % colors.length];
                      if (chartGrouping === 'tingkat') {
                        if (name === 'Kelas 7') colClass = 'bg-sky-500';
                        if (name === 'Kelas 8') colClass = 'bg-rose-500';
                        if (name === 'Kelas 9') colClass = 'bg-violet-500';
                      }
                      return (
                        <div key={name} className="flex items-center gap-1.5">
                          <span className={`w-3 h-3 rounded-full ${colClass}`}></span>
                          <span>{name}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Real Chart Area */}
                <div className="relative h-80 w-full pt-6 flex flex-col justify-between select-none">
                  {/* Background Grid Lines */}
                  <div className="absolute inset-0 flex flex-col justify-between pointer-events-none pb-8 pt-6">
                    {[0, 1, 2, 3, 4].map((idx) => {
                      const lineVal = Math.round((Math.max(10, ...chartData.monthlyDataList.map(item => Math.max(...chartData.seriesNames.map(name => Number(item[name] || 0))))) / 4) * (4 - idx));
                      return (
                        <div key={idx} className="w-full flex items-center gap-3">
                          <span className="text-[10px] font-mono text-slate-400 w-8 text-right">{lineVal}</span>
                          <div className="flex-1 border-t border-slate-100 border-dashed"></div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Bars Plotting Grid */}
                  <div className="flex-1 flex justify-around items-end relative z-10 pl-11 pb-8">
                    {chartData.monthlyDataList.map((mItem, mIdx) => {
                      const numSeries = chartData.seriesNames.length;
                      const maxSeriesValue = Math.max(10, ...chartData.monthlyDataList.map(item => Math.max(...chartData.seriesNames.map(name => Number(item[name] || 0)))));
                      return (
                        <div key={mIdx} className="flex-1 flex flex-col items-center group/month h-full justify-end relative px-1">
                          {/* Bars Group */}
                          <div className="flex items-end justify-center w-full gap-1 h-full pt-6">
                            {chartData.seriesNames.map((seriesName, sIdx) => {
                              const val = Number(mItem[seriesName] || 0);
                              const valPercentage = maxSeriesValue > 0 ? (val / maxSeriesValue) * 100 : 0;
                              
                              // Base color styling matching legend colors
                              const bgColors = [
                                'from-sky-400 to-sky-500 hover:from-sky-500 hover:to-sky-600',
                                'from-rose-400 to-rose-500 hover:from-rose-500 hover:to-rose-600',
                                'from-emerald-400 to-emerald-500 hover:from-emerald-500 hover:to-emerald-600',
                                'from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600',
                                'from-violet-400 to-violet-500 hover:from-violet-500 hover:to-violet-600',
                                'from-pink-400 to-pink-500 hover:from-pink-500 hover:to-pink-600',
                                'from-teal-400 to-teal-500 hover:from-teal-500 hover:to-teal-600',
                                'from-indigo-400 to-indigo-500 hover:from-indigo-500 hover:to-indigo-600'
                              ];
                              let barColorClass = bgColors[sIdx % bgColors.length];
                              if (chartGrouping === 'tingkat') {
                                if (seriesName === 'Kelas 7') barColorClass = 'from-sky-400 to-sky-500 hover:from-sky-500 hover:to-sky-600';
                                if (seriesName === 'Kelas 8') barColorClass = 'from-rose-400 to-rose-500 hover:from-rose-500 hover:to-rose-600';
                                if (seriesName === 'Kelas 9') barColorClass = 'from-violet-400 to-violet-500 hover:from-violet-500 hover:to-violet-600';
                              }

                              return (
                                <div
                                  key={seriesName}
                                  className="flex-1 flex flex-col justify-end items-center group/bar relative h-full"
                                  onMouseEnter={(e) => {
                                    const rect = e.currentTarget.getBoundingClientRect();
                                    const parentRect = e.currentTarget.parentElement?.parentElement?.getBoundingClientRect();
                                    if (parentRect) {
                                      setHoveredBar({
                                        month: mItem.monthLabel,
                                        series: seriesName,
                                        value: val,
                                        x: rect.left - parentRect.left + rect.width / 2,
                                        y: rect.top - parentRect.top - 10
                                      });
                                    }
                                  }}
                                  onMouseLeave={() => setHoveredBar(null)}
                                >
                                  {val > 0 && (
                                    <>
                                      {/* Hover bar value pill */}
                                      <span className="opacity-0 group-hover/bar:opacity-100 transition-opacity absolute -top-5 text-[9px] font-black bg-slate-800 text-white py-0.5 px-1.5 rounded shadow-sm z-50 pointer-events-none">
                                        {val}
                                      </span>
                                      {/* Column Bar element */}
                                      <div
                                        style={{ height: `${valPercentage}%` }}
                                        className={`w-full bg-gradient-to-t ${barColorClass} rounded-t transition-all duration-300 shadow-md border-t border-white/10`}
                                      ></div>
                                    </>
                                  )}
                                </div>
                              );
                            })}
                          </div>

                          {/* Month X label */}
                          <span className="absolute bottom-0 text-[10px] font-bold text-slate-500 pt-2 border-t border-slate-100 w-full text-center truncate">
                            {mItem.monthLabel}
                          </span>
                        </div>
                      );
                    })}
                  </div>

                  {/* HTML Tooltip following hover */}
                  {hoveredBar && (
                    <div
                      style={{ left: `${hoveredBar.x}px`, top: `${hoveredBar.y}px` }}
                      className="absolute -translate-x-1/2 -translate-y-full bg-slate-900/95 backdrop-blur text-white text-[10.5px] p-2.5 rounded-xl shadow-xl border border-slate-700/50 z-50 w-44 pointer-events-none transition-all duration-100 space-y-1"
                    >
                      <div className="font-bold border-b border-slate-700/60 pb-1 text-slate-300 text-[10px] flex justify-between">
                        <span>{hoveredBar.month}</span>
                        <span className="text-emerald-400 font-extrabold uppercase text-[9px]">DIAGRAM</span>
                      </div>
                      <div className="flex justify-between font-bold pt-1">
                        <span className="text-slate-400">{hoveredBar.series}:</span>
                        <span className="text-white text-xs font-black">{hoveredBar.value} {chartMetric === 'poin' ? 'Poin' : 'Kasus'}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Comprehensive Summary Table under the Chart */}
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                  <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider flex items-center gap-1.5">
                    <Award size={13} className="text-emerald-600" />
                    Rincian Angka Pelanggaran Bulanan
                  </h4>
                  <span className="text-[10px] font-bold px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded-full">
                    Unit: {chartMetric === 'poin' ? 'Akumulasi Poin' : 'Jumlah Kasus'}
                  </span>
                </div>
                <div className="overflow-x-auto text-xs">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 font-bold uppercase tracking-wider">
                        <th className="py-3 px-4">Bulan</th>
                        {chartData.seriesNames.map(name => (
                          <th key={name} className="py-3 px-4 text-center">{name}</th>
                        ))}
                        <th className="py-3 px-4 text-center bg-slate-100/50 text-slate-700">Total Akumulasi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
                      {chartData.monthlyDataList.map((mItem, idx) => (
                        <tr key={idx} className="hover:bg-slate-50/50 transition">
                          <td className="py-3 px-4 font-bold text-slate-800">{mItem.monthLabel}</td>
                          {chartData.seriesNames.map(name => (
                            <td key={name} className="py-3 px-4 text-center">{mItem[name] || 0}</td>
                          ))}
                          <td className="py-3 px-4 text-center bg-emerald-50/40 text-emerald-800 font-black">{mItem.totals}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* ==================== B. MASTER DATA CONFIGS (ADMIN ONLY) ==================== */
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          
          {/* Master Side Tabs */}
          <div className="bg-white p-2.5 rounded-2xl border border-slate-100 shadow-sm flex flex-col gap-1 text-xs font-semibold text-slate-500 h-fit">
            <button 
              onClick={() => setActiveMasterTab('tp')}
              className={`p-2.5 rounded-xl text-left flex items-center gap-2 transition ${activeMasterTab === 'tp' ? 'bg-emerald-50 text-emerald-700 font-bold' : 'hover:bg-slate-50'}`}
            >
              <Calendar size={14} /> Tahun Pelajaran
            </button>
            <button 
              onClick={() => setActiveMasterTab('kelas')}
              className={`p-2.5 rounded-xl text-left flex items-center gap-2 transition ${activeMasterTab === 'kelas' ? 'bg-emerald-50 text-emerald-700 font-bold' : 'hover:bg-slate-50'}`}
            >
              <GraduationCap size={14} /> Kelas / Rombel
            </button>
            <button 
              onClick={() => setActiveMasterTab('users')}
              className={`p-2.5 rounded-xl text-left flex items-center gap-2 transition ${activeMasterTab === 'users' ? 'bg-emerald-50 text-emerald-700 font-bold' : 'hover:bg-slate-50'}`}
            >
              <Users size={14} /> Staf / Users
            </button>

            <button 
              onClick={() => openMasterEditor(null)}
              className="mt-4 w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-center shadow-sm flex items-center justify-center gap-1"
            >
              <Plus size={12} /> Tambah Data
            </button>
          </div>

          {/* Master Directory Listings */}
          <div className="md:col-span-3 bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-slate-100 bg-slate-50/50">
              <span className="font-bold text-slate-800 text-xs uppercase tracking-wider">Direktori Master - {activeMasterTab.toUpperCase()}</span>
            </div>

            <div className="overflow-x-auto text-xs">
              {activeMasterTab === 'tp' && (
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-slate-50 text-slate-500 font-bold border-b border-slate-100 py-2 px-4"><th className="p-3">Tahun Pelajaran</th><th className="p-3">Semester</th><th className="p-3">Status</th><th className="p-3 text-center">Aksi</th></tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50 text-slate-700">
                    {db.tahunPelajaran.map(item => (
                      <tr key={item.id} className="hover:bg-slate-50/30">
                        <td className="p-3 font-semibold">{item.tahun}</td>
                        <td className="p-3">{item.semester}</td>
                        <td className="p-3">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${item.isActive ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-slate-100 text-slate-400'}`}>
                            {item.isActive ? 'Aktif' : 'Non-aktif'}
                          </span>
                        </td>
                        <td className="p-3 text-center flex justify-center gap-2">
                          <button onClick={() => openMasterEditor(item)} className="p-1 text-slate-500 hover:text-slate-800"><Edit3 size={12} /></button>
                          <button onClick={() => handleMasterDelete(item.id)} className="p-1 text-rose-500 hover:text-rose-700"><Trash2 size={12} /></button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}

              {activeMasterTab === 'kelas' && (
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-slate-50 text-slate-500 font-bold border-b border-slate-100 py-2 px-4"><th className="p-3">Nama Kelas</th><th className="p-3">Staf Pengampu / BK</th><th className="p-3 text-center">Aksi</th></tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50 text-slate-700">
                    {db.kelas.map(item => {
                      const staff = db.users.find(u => u.id === item.waliKelasId);
                      return (
                        <tr key={item.id} className="hover:bg-slate-50/30">
                          <td className="p-3 font-bold text-slate-800">{item.namaKelas}</td>
                          <td className="p-3 font-semibold text-slate-600">{staff?.nama || '-'}</td>
                          <td className="p-3 text-center flex justify-center gap-2">
                            <button onClick={() => openMasterEditor(item)} className="p-1 text-slate-500 hover:text-slate-800"><Edit3 size={12} /></button>
                            <button onClick={() => handleMasterDelete(item.id)} className="p-1 text-rose-500 hover:text-rose-700"><Trash2 size={12} /></button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}

              {activeMasterTab === 'users' && (
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-slate-50 text-slate-500 font-bold border-b border-slate-100 py-2 px-4"><th className="p-3">Username</th><th className="p-3">Nama Lengkap</th><th className="p-3">Hak Akses Role</th><th className="p-3">E-mail</th><th className="p-3 text-center">Aksi</th></tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50 text-slate-700">
                    {db.users.map(item => (
                      <tr key={item.id} className="hover:bg-slate-50/30">
                        <td className="p-3 font-semibold text-slate-700">{item.username}</td>
                        <td className="p-3 font-bold text-slate-800">{item.nama}</td>
                        <td className="p-3">
                          <span className="bg-indigo-50 text-indigo-700 font-extrabold px-2 py-0.5 rounded text-[10px]">{item.role}</span>
                        </td>
                        <td className="p-3 font-mono">{item.email}</td>
                        <td className="p-3 text-center flex justify-center gap-2">
                          <button onClick={() => openMasterEditor(item)} className="p-1 text-slate-500 hover:text-slate-800"><Edit3 size={12} /></button>
                          <button onClick={() => handleMasterDelete(item.id)} className="p-1 text-rose-500 hover:text-rose-700"><Trash2 size={12} /></button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>

        </div>
      )}

      {/* COMPACT MASTER FORM MODAL */}
      {isMasterFormOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-sm overflow-hidden flex flex-col shadow-2xl border border-slate-100 text-xs">
            <div className="p-4 border-b border-slate-100 bg-slate-50/80 flex items-center justify-between">
              <h4 className="font-bold text-slate-800">Sempurnakan Data {activeMasterTab.toUpperCase()}</h4>
              <button onClick={() => setIsMasterFormOpen(false)} className="p-1 rounded-full hover:bg-slate-200"><X size={14} /></button>
            </div>

            <form onSubmit={handleMasterSubmit} className="p-4 space-y-4">
              
              {/* Form fields based on activeMasterTab */}
              {activeMasterTab === 'tp' && (
                <div className="space-y-3">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 mb-1">Tahun Pelajaran (e.g., 2025/2026)</label>
                    <input type="text" value={formTP.tahun || ''} onChange={(e) => setFormTP(prev => ({ ...prev, tahun: e.target.value }))} className="p-2.5 border border-slate-200 rounded-xl w-full" required />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 mb-1">Semester</label>
                    <select value={formTP.semester || 'Ganjil'} onChange={(e) => setFormTP(prev => ({ ...prev, semester: e.target.value as any }))} className="p-2.5 border border-slate-200 bg-white rounded-xl w-full">
                      <option value="Ganjil">Ganjil</option>
                      <option value="Genap">Genap</option>
                    </select>
                  </div>
                  <div className="flex items-center gap-1.5 cursor-pointer">
                    <input type="checkbox" checked={!!formTP.isActive} onChange={(e) => setFormTP(prev => ({ ...prev, isActive: e.target.checked }))} id="tp-active-check" className="rounded text-emerald-600" />
                    <label htmlFor="tp-active-check">Set Sebagai Tahun Pelajaran Aktif Sekarang</label>
                  </div>
                </div>
              )}

              {activeMasterTab === 'kelas' && (
                <div className="space-y-3">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 mb-1">Nama Rombel / Kelas (e.g., Kelas 7-1)</label>
                    <input type="text" value={formKelas.namaKelas || ''} onChange={(e) => setFormKelas(prev => ({ ...prev, namaKelas: e.target.value }))} className="p-2.5 border border-slate-200 rounded-xl w-full" required />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 mb-1">Guru Pengampu BK / Staf</label>
                    <select value={formKelas.waliKelasId || ''} onChange={(e) => setFormKelas(prev => ({ ...prev, waliKelasId: e.target.value }))} className="p-2.5 border border-slate-200 bg-white rounded-xl w-full" required>
                      {db.users.map(u => <option key={u.id} value={u.id}>{u.nama} ({u.role})</option>)}
                    </select>
                  </div>
                </div>
              )}

              {activeMasterTab === 'users' && (
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 mb-1">Username Login</label>
                      <input type="text" value={formUser.username || ''} onChange={(e) => setFormUser(prev => ({ ...prev, username: e.target.value }))} className="p-2.5 border border-slate-200 rounded-xl w-full" required />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 mb-1">Role Akses</label>
                      <select value={formUser.role || UserRole.GURU_BK} onChange={(e) => setFormUser(prev => ({ ...prev, role: e.target.value as any }))} className="p-2.5 border border-slate-200 bg-white rounded-xl w-full">
                        <option value={UserRole.ADMIN}>Admin</option>
                        <option value={UserRole.GURU_BK}>Guru BK</option>
                        <option value={UserRole.WALI_KELAS}>Wali Kelas</option>
                        <option value={UserRole.KEPALA_SEKOLAH}>Kepala Sekolah</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 mb-1">Nama Lengkap & Gelar</label>
                    <input type="text" value={formUser.nama || ''} onChange={(e) => setFormUser(prev => ({ ...prev, nama: e.target.value }))} className="p-2.5 border border-slate-200 rounded-xl w-full" required />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 mb-1">Alamat Email</label>
                    <input type="email" value={formUser.email || ''} onChange={(e) => setFormUser(prev => ({ ...prev, email: e.target.value }))} className="p-2.5 border border-slate-200 rounded-xl w-full" required />
                  </div>
                </div>
              )}

              {/* Submit panel */}
              <div className="flex justify-end gap-1.5 pt-3 border-t border-slate-50">
                <button type="button" onClick={() => setIsMasterFormOpen(false)} className="px-3.5 py-1.5 bg-slate-100 text-slate-500 hover:bg-slate-200 rounded-lg">Batal</button>
                <button type="submit" className="px-4 py-1.5 bg-slate-800 text-white font-bold rounded-lg hover:bg-slate-900">Simpan</button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* Custom Master Data Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-xl border border-slate-100 space-y-4 animate-scale-up">
            <div className="flex items-center gap-3 text-rose-600">
              <div className="w-10 h-10 bg-rose-50 rounded-xl flex items-center justify-center flex-shrink-0">
                <AlertCircle size={20} />
              </div>
              <h3 className="font-bold text-slate-800 text-sm">Konfirmasi Hapus Data Master</h3>
            </div>
            
            <p className="text-xs text-slate-500 leading-relaxed">
              Apakah Anda yakin ingin menghapus data master ini secara permanen? Tindakan ini tidak dapat dibatalkan dan dapat mempengaruhi relasi data siswa yang terhubung.
            </p>

            <div className="flex justify-end gap-2 pt-2">
              <button 
                type="button" 
                onClick={() => {
                  setDeleteConfirmId(null);
                }}
                disabled={isDeleting}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl font-semibold text-xs transition disabled:opacity-50"
              >
                Batal
              </button>
              <button 
                type="button" 
                onClick={confirmDeleteMaster}
                disabled={isDeleting}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-bold text-xs shadow-sm transition flex items-center gap-1.5 disabled:opacity-50"
              >
                {isDeleting ? 'Menghapus...' : 'Ya, Hapus Permanen'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
