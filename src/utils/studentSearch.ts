import { Siswa } from '../types';

/**
 * Normalizes text for clean search comparison:
 * lowercase, removes excess spaces, strips common Indonesian punctuation (dots, commas, hyphens).
 */
export function normalizeSearchText(text: string | null | undefined): string {
  if (!text) return '';
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // remove diacritics
    .replace(/[.,\-_/\\()]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Extracts initials from student name words.
 * E.g., "Muhammad Faqih Alamsyah" -> "mfa"
 */
export function getInitials(name: string): string {
  const norm = normalizeSearchText(name);
  if (!norm) return '';
  return norm
    .split(' ')
    .filter(Boolean)
    .map(w => w[0])
    .join('');
}

export interface StudentSearchResult {
  student: Siswa;
  score: number;
}

/**
 * Calculates a search relevance score for a student against a query.
 * Higher score = higher ranking in search results.
 * Returns 0 if there is no match.
 */
export function scoreStudentMatch(student: Partial<Siswa> | Siswa | null | undefined, rawQuery: string): number {
  if (!student) return 0;
  const qClean = normalizeSearchText(rawQuery);
  if (!qClean) return 1; // When query is empty, all students have base score 1

  const nameNorm = normalizeSearchText(student.nama || '');
  if (!nameNorm) return 0;

  const qDigits = rawQuery.replace(/\D/g, '');
  const nisStr = String(student.nis ?? '').trim();
  const nisnStr = String(student.nisn ?? '').trim();
  const isPlaceholderNis = !nisStr || nisStr === '12345678' || nisStr === '0' || nisStr === '-';

  // 1. Exact full name match
  if (nameNorm === qClean) {
    return 2000;
  }

  // 2. Full name starts with query (initials / huruf awal)
  // Example: query "faq" matches "faqih..."
  if (nameNorm.startsWith(qClean)) {
    return 1500 + Math.max(0, 50 - nameNorm.length);
  }

  const nameWords = nameNorm.split(' ').filter(Boolean);
  const qWords = qClean.split(' ').filter(Boolean);

  // 3. First name starts with query
  if (nameWords.length > 0 && nameWords[0].startsWith(qClean)) {
    return 1300 + Math.max(0, 30 - nameWords[0].length);
  }

  // 4. Any word starts with the query
  // Example: query "faqih" matches "muhammad faqih"
  const wordPrefixIndex = nameWords.findIndex(w => w.startsWith(qClean));
  if (wordPrefixIndex !== -1) {
    // Earlier words scored slightly higher
    return 1100 - wordPrefixIndex * 50;
  }

  // 5. Multi-token word-prefix matching
  // Example: query "m faq" matches "muhammad faqih", query "siti a" matches "siti aisyah"
  if (qWords.length > 1) {
    let wordIdx = 0;
    let allTokensMatched = true;
    for (const token of qWords) {
      let matchedToken = false;
      while (wordIdx < nameWords.length) {
        if (nameWords[wordIdx].startsWith(token)) {
          matchedToken = true;
          wordIdx++;
          break;
        }
        wordIdx++;
      }
      if (!matchedToken) {
        allTokensMatched = false;
        break;
      }
    }
    if (allTokensMatched) {
      return 1000;
    }
  }

  // 6. Initials exact matching (e.g. query "mf" matches "muhammad faqih")
  const initials = nameWords.map(w => w[0]).join('');
  const compactQuery = qClean.replace(/\s+/g, '');
  if (initials === compactQuery) {
    return 950;
  }

  // 7. Initials prefix matching (e.g. query "mf" matches "muhammad faqih kurniawan")
  if (initials.startsWith(compactQuery) && compactQuery.length >= 2) {
    return 900;
  }

  // 8. NISN match
  if (qDigits && nisnStr && nisnStr !== '0') {
    if (nisnStr === qDigits) return 850;
    if (nisnStr.startsWith(qDigits)) return 800;
    if (nisnStr.includes(qDigits)) return 600;
  }

  // 9. NIS match (ignoring default placeholder)
  if (qDigits && !isPlaceholderNis && nisStr) {
    if (nisStr === qDigits) return 750;
    if (nisStr.startsWith(qDigits)) return 700;
    if (nisStr.includes(qDigits)) return 550;
  }

  // 10. Substring match inside any word (fallback)
  if (nameNorm.includes(qClean)) {
    return 400;
  }

  // 11. All tokens match anywhere inside name
  if (qWords.length > 1 && qWords.every(token => nameNorm.includes(token))) {
    return 350;
  }

  return 0;
}

/**
 * Filters and sorts students with priority for initial letters, prefixes, and initials.
 */
export function searchAndRankStudents(
  students: Siswa[],
  query: string,
  options?: {
    limit?: number;
    preferredClassId?: string;
  }
): Siswa[] {
  if (!students || students.length === 0) return [];

  const rawQ = (query || '').trim();
  if (!rawQ) {
    // If no search query, return list sorted alphabetically
    return [...students].sort((a, b) => (a.nama || '').localeCompare(b.nama || '', 'id'));
  }

  const results: { student: Siswa; score: number }[] = [];

  for (const s of students) {
    if (!s) continue;
    let score = scoreStudentMatch(s, rawQ);
    if (score > 0) {
      // Small bonus if student matches preferred class
      if (options?.preferredClassId && s.kelasId === options.preferredClassId) {
        score += 20;
      }
      results.push({ student: s, score });
    }
  }

  // Sort by score descending; if tied, sort alphabetically by name
  results.sort((a, b) => {
    if (b.score !== a.score) {
      return b.score - a.score;
    }
    return (a.student.nama || '').localeCompare(b.student.nama || '', 'id');
  });

  const ranked = results.map(r => r.student);
  if (options?.limit && options.limit > 0) {
    return ranked.slice(0, options.limit);
  }
  return ranked;
}

/**
 * Checks whether a student or text matches a search query using smart prefix and initial matching.
 * Useful for filtering tables (pelanggaran, remisi, kehadiran, catatan).
 */
export function isStudentSearchMatch(
  student: Partial<Siswa> | Siswa | null | undefined,
  query: string,
  extraSearchableTexts: (string | null | undefined)[] = []
): boolean {
  const q = (query || '').trim();
  if (!q) return true;

  if (student) {
    const score = scoreStudentMatch(student, q);
    if (score > 0) return true;
  }

  // Check extra searchable texts (e.g. jenis pelanggaran, keterangan, bulan, etc.)
  const qClean = normalizeSearchText(q);
  for (const text of extraSearchableTexts) {
    if (!text) continue;
    const norm = normalizeSearchText(text);
    if (norm.includes(qClean) || norm.startsWith(qClean)) {
      return true;
    }
  }

  return false;
}
