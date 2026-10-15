import React, { useState, useMemo, useEffect } from 'react';
import { Search, X, Check, Filter } from 'lucide-react';
import { Siswa, Kelas } from '../types';
import { normalizeClassName } from '../services/api';
import { searchAndRankStudents } from '../utils/studentSearch';

export interface StudentSelectorProps {
  students: Siswa[];
  classes?: Kelas[];
  selectedStudentId: string;
  onSelectStudent: (studentId: string, student?: Siswa) => void;
  label?: string;
  required?: boolean;
  disabledClassSelection?: boolean;
  fixedClass?: string;
  initialClass?: string;
  theme?: 'rose' | 'emerald' | 'indigo' | 'sky' | 'amber' | 'slate';
  helperText?: string;
  autoSyncClass?: boolean;
}

// Standard 33 classes in SMPN 17 Tangerang Selatan
const ALL_STANDARD_CLASSES = [
  ...Array.from({ length: 11 }, (_, i) => ({ id: `kl-${i + 1}`, name: `Kelas 7-${i + 1}`, level: 7 })),
  ...Array.from({ length: 11 }, (_, i) => ({ id: `kl-${i + 12}`, name: `Kelas 8-${i + 1}`, level: 8 })),
  ...Array.from({ length: 11 }, (_, i) => ({ id: `kl-${i + 23}`, name: `Kelas 9-${i + 1}`, level: 9 })),
];

export const StudentSelector: React.FC<StudentSelectorProps> = ({
  students = [],
  classes = [],
  selectedStudentId,
  onSelectStudent,
  label = 'Pilih Siswa',
  required = true,
  disabledClassSelection = false,
  fixedClass,
  initialClass,
  theme = 'rose',
  helperText,
  autoSyncClass = true,
}) => {
  const [selectedClass, setSelectedClass] = useState<string>(() => {
    if (fixedClass) return normalizeClassName(fixedClass) || fixedClass;
    if (initialClass) return normalizeClassName(initialClass) || initialClass;
    if (selectedStudentId) {
      const found = students.find(s => s.id === selectedStudentId);
      if (found?.kelasId) {
        return normalizeClassName(found.kelasId) || found.kelasId;
      }
    }
    return 'ALL';
  });

  const [searchQuery, setSearchQuery] = useState<string>('');

  // Sync selectedClass if fixedClass changes or selectedStudentId is initialized
  useEffect(() => {
    if (fixedClass) {
      setSelectedClass(normalizeClassName(fixedClass) || fixedClass);
    }
  }, [fixedClass]);

  useEffect(() => {
    if (autoSyncClass && selectedStudentId && selectedClass === 'ALL') {
      const found = students.find(s => s.id === selectedStudentId);
      if (found?.kelasId) {
        const norm = normalizeClassName(found.kelasId);
        if (norm) setSelectedClass(norm);
      }
    }
  }, [selectedStudentId, students, autoSyncClass]);

  // Selected student object
  const selectedStudentObj = useMemo(() => {
    if (!selectedStudentId) return null;
    return students.find(s => s && s.id === selectedStudentId) || null;
  }, [students, selectedStudentId]);

  // Classes list
  const availableClasses = useMemo(() => {
    if (classes && classes.length > 0) {
      return classes.map(c => ({
        id: c.id,
        name: normalizeClassName(c.namaKelas || c.id) || c.namaKelas,
        level: c.namaKelas.includes('7') ? 7 : c.namaKelas.includes('8') ? 8 : 9,
      }));
    }
    return ALL_STANDARD_CLASSES;
  }, [classes]);

  // Group classes by grade
  const kelas7List = useMemo(() => availableClasses.filter(c => c.name.includes('7-') || c.level === 7), [availableClasses]);
  const kelas8List = useMemo(() => availableClasses.filter(c => c.name.includes('8-') || c.level === 8), [availableClasses]);
  const kelas9List = useMemo(() => availableClasses.filter(c => c.name.includes('9-') || c.level === 9), [availableClasses]);

  // Filter students based on selected class and search query with smart initial & prefix ranking
  const filteredStudents = useMemo(() => {
    let pool = students || [];

    // Filter by class
    if (selectedClass && selectedClass !== 'ALL') {
      const targetNorm = normalizeClassName(selectedClass);
      pool = pool.filter(s => {
        if (!s) return false;
        const sNorm = normalizeClassName(s.kelasId || '');
        return sNorm === targetNorm || s.kelasId === selectedClass;
      });
    }

    return searchAndRankStudents(pool, searchQuery);
  }, [students, selectedClass, searchQuery]);

  // Theme-based ring and border accents
  const themeClasses = useMemo(() => {
    switch (theme) {
      case 'rose':
        return {
          focusRing: 'focus:border-rose-500 focus:ring-1 focus:ring-rose-500',
          badgeBg: 'bg-rose-50 border-rose-200 text-rose-700',
          avatarBg: 'bg-rose-600',
        };
      case 'sky':
        return {
          focusRing: 'focus:border-sky-500 focus:ring-1 focus:ring-sky-500',
          badgeBg: 'bg-sky-50 border-sky-200 text-sky-700',
          avatarBg: 'bg-sky-600',
        };
      case 'indigo':
        return {
          focusRing: 'focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500',
          badgeBg: 'bg-indigo-50 border-indigo-200 text-indigo-700',
          avatarBg: 'bg-indigo-600',
        };
      case 'amber':
        return {
          focusRing: 'focus:border-amber-500 focus:ring-1 focus:ring-amber-500',
          badgeBg: 'bg-amber-50 border-amber-200 text-amber-700',
          avatarBg: 'bg-amber-600',
        };
      case 'slate':
        return {
          focusRing: 'focus:border-slate-500 focus:ring-1 focus:ring-slate-500',
          badgeBg: 'bg-slate-50 border-slate-200 text-slate-700',
          avatarBg: 'bg-slate-700',
        };
      case 'emerald':
      default:
        return {
          focusRing: 'focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500',
          badgeBg: 'bg-emerald-50 border-emerald-200 text-emerald-700',
          avatarBg: 'bg-emerald-600',
        };
    }
  }, [theme]);

  return (
    <div className="space-y-2.5">
      {/* SECTION 1: Dual Filter Controls (Dropdown Kelas + Kolom Pencarian Siswa Format Teks) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 bg-slate-50/80 p-2.5 rounded-xl border border-slate-200/90 shadow-2xs">
        {/* Dropdown Kelas */}
        <div>
          <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wider mb-1 flex items-center gap-1">
            <Filter size={11} className="text-slate-400" />
            Filter Kelas
          </label>
          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            disabled={disabledClassSelection}
            className={`w-full p-2 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 focus:outline-none ${themeClasses.focusRing} disabled:opacity-60 disabled:bg-slate-100 cursor-pointer shadow-2xs`}
          >
            <option value="ALL">-- Semua Kelas (33 Rombel) --</option>
            <optgroup label="Kelas 7 (Tingkat VII)">
              {kelas7List.map(k => (
                <option key={k.id} value={k.name}>{k.name}</option>
              ))}
            </optgroup>
            <optgroup label="Kelas 8 (Tingkat VIII)">
              {kelas8List.map(k => (
                <option key={k.id} value={k.name}>{k.name}</option>
              ))}
            </optgroup>
            <optgroup label="Kelas 9 (Tingkat IX)">
              {kelas9List.map(k => (
                <option key={k.id} value={k.name}>{k.name}</option>
              ))}
            </optgroup>
          </select>
        </div>

        {/* Kolom Pencarian Siswa Format Teks */}
        <div>
          <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wider mb-1 flex items-center gap-1">
            <Search size={11} className="text-slate-400" />
            Cari Siswa (Format Teks)
          </label>
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Ketik nama atau NIS/NISN siswa..."
              className={`w-full pl-8 pr-7 py-2 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-800 focus:outline-none ${themeClasses.focusRing} shadow-2xs placeholder:text-slate-400`}
            />
            <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-0.5 text-slate-400 hover:text-slate-600 rounded-full cursor-pointer"
                title="Hapus pencarian"
              >
                <X size={12} />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* SECTION 2: Dropdown Pilih Siswa Terfilter */}
      <div>
        <div className="flex items-center justify-between mb-1">
          <label className="block text-[10px] font-bold text-slate-700 uppercase tracking-wider">
            {label} {required && <span className="text-rose-500 font-bold">*</span>}
          </label>
          <span className="text-[10px] font-medium text-slate-400">
            {filteredStudents.length} siswa cocok {selectedClass !== 'ALL' ? `(${selectedClass})` : ''}
          </span>
        </div>

        <select
          value={selectedStudentId || ''}
          onChange={(e) => {
            const val = e.target.value;
            const chosen = students.find(s => s && s.id === val);
            onSelectStudent(val, chosen);
          }}
          className={`w-full p-2.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none ${themeClasses.focusRing} cursor-pointer shadow-2xs`}
          required={required}
        >
          <option value="">
            {filteredStudents.length === 0
              ? '-- Tidak ada siswa yang sesuai pencarian/filter --'
              : `-- Pilih Siswa dari Daftar (${filteredStudents.length} Siswa) --`}
          </option>

          {/* If the current student is not in the filtered subset, keep them selectable so current selection is never lost */}
          {selectedStudentObj && !filteredStudents.some(s => s.id === selectedStudentObj.id) && (
            <option key={selectedStudentObj.id} value={selectedStudentObj.id}>
              {selectedStudentObj.nama} - {normalizeClassName(selectedStudentObj.kelasId) || 'Kelas'} (NIS: {selectedStudentObj.nis || '-'}) [Siswa Terpilih Saat Ini]
            </option>
          )}

          {filteredStudents.map(s => {
            const sKelas = normalizeClassName(s.kelasId) || s.kelasId || 'Kelas -';
            return (
              <option key={s.id} value={s.id}>
                {s.nama} - {sKelas} ({s.nis ? `NIS: ${s.nis}` : 'Tanpa NIS'})
              </option>
            );
          })}
        </select>
        {helperText && (
          <p className="text-[9px] text-slate-400 mt-1">{helperText}</p>
        )}
      </div>

      {/* SECTION 3: Confirmation Pill Card if Student is Selected */}
      {selectedStudentObj && (
        <div className={`p-2.5 rounded-xl border flex items-center justify-between text-xs animate-in fade-in duration-150 ${themeClasses.badgeBg}`}>
          <div className="flex items-center gap-2.5 min-w-0">
            <div className={`w-7 h-7 rounded-lg ${themeClasses.avatarBg} text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-2xs`}>
              {selectedStudentObj.nama ? selectedStudentObj.nama.charAt(0).toUpperCase() : 'S'}
            </div>
            <div className="truncate">
              <p className="font-bold text-slate-800 text-xs leading-tight truncate">
                {selectedStudentObj.nama}
              </p>
              <p className="text-[10px] text-slate-600 font-medium truncate mt-0.5">
                {normalizeClassName(selectedStudentObj.kelasId) || selectedStudentObj.kelasId || 'Kelas -'} • NIS: {selectedStudentObj.nis || '-'} • NISN: {selectedStudentObj.nisn || '-'}
              </p>
            </div>
          </div>
          <span className="text-[9px] font-extrabold px-2 py-0.5 bg-white/80 border border-current rounded-md shrink-0 flex items-center gap-1 shadow-2xs">
            <Check size={10} /> Terpilih
          </span>
        </div>
      )}
    </div>
  );
};
