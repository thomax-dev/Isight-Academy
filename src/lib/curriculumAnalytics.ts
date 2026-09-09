import { Subject, SubjectStatesMap } from '../types/academic';
import { PPC_2023_SUBJECTS, SUBJECT_MAP } from '../data/curriculumPPC2023';
import { getAllDescendants, DEPENDENTS_MAP } from './graphEngine';

export interface CurriculumTrail {
  id: string;
  title: string;
  color: string; // Hex for progress bar
  bgBadge: string;
  textBadge: string;
  borderClass: string;
  cardBgClass: string;
  subjectIds: string[];
}

export const CURRICULUM_TRAILS: CurriculumTrail[] = [
  {
    id: 'matematica',
    title: 'Trilha de Matemática',
    color: '#3B82F6',
    bgBadge: 'bg-blue-500/20 text-blue-400 border-blue-500/40',
    textBadge: 'text-blue-400',
    borderClass: 'border-blue-500/40',
    cardBgClass: 'bg-blue-950/20 hover:bg-blue-950/30',
    subjectIds: ['MAT101', 'MAT201', 'MAT202', 'MAT301', 'MAT401'],
  },
  {
    id: 'hardware',
    title: 'Trilha de Hardware',
    color: '#F97316',
    bgBadge: 'bg-orange-500/20 text-orange-400 border-orange-500/40',
    textBadge: 'text-orange-400',
    borderClass: 'border-orange-500/40',
    cardBgClass: 'bg-orange-950/20 hover:bg-orange-950/30',
    subjectIds: ['HAR301', 'HAR401'],
  },
  {
    id: 'banco-dados',
    title: 'Trilha de Banco de Dados',
    color: '#A855F7',
    bgBadge: 'bg-purple-500/20 text-purple-400 border-purple-500/40',
    textBadge: 'text-purple-400',
    borderClass: 'border-purple-500/40',
    cardBgClass: 'bg-purple-950/20 hover:bg-purple-950/30',
    subjectIds: ['SIS401', 'SIS501', 'SIS702'],
  },
  {
    id: 'redes',
    title: 'Trilha de Redes',
    color: '#06B6D4',
    bgBadge: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/40',
    textBadge: 'text-cyan-400',
    borderClass: 'border-cyan-500/40',
    cardBgClass: 'bg-cyan-950/20 hover:bg-cyan-950/30',
    subjectIds: ['HAR601', 'HAR701', 'SIS701', 'HAR801'],
  },
  {
    id: 'software',
    title: 'Trilha de Software',
    color: '#10B981',
    bgBadge: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40',
    textBadge: 'text-emerald-400',
    borderClass: 'border-emerald-500/40',
    cardBgClass: 'bg-emerald-950/20 hover:bg-emerald-950/30',
    subjectIds: [
      'COM101', 'COM103', 'COM201', 'COM202', 'SOF301', 
      'SOF501', 'SIS601', 'SIS602', 'SOF601', 'SOF701', 
      'OPT801', 'SOF802'
    ],
  },
  {
    id: 'teoria-ia',
    title: 'Trilha de Teoria & IA',
    color: '#6366F1',
    bgBadge: 'bg-indigo-500/20 text-indigo-400 border-indigo-500/40',
    textBadge: 'text-indigo-400',
    borderClass: 'border-indigo-500/40',
    cardBgClass: 'bg-indigo-950/20 hover:bg-indigo-950/30',
    subjectIds: ['COM102', 'COM301', 'COM401', 'SIS502', 'SIS503', 'COM501', 'IA601', 'TCC601', 'TCC801'],
  },
  {
    id: 'formacao-geral',
    title: 'Trilha de Formação Geral',
    color: '#64748B',
    bgBadge: 'bg-slate-500/20 text-slate-300 border-slate-500/40',
    textBadge: 'text-slate-300',
    borderClass: 'border-slate-500/40',
    cardBgClass: 'bg-slate-900/40 hover:bg-slate-900/60',
    subjectIds: ['HUM101', 'HUM201', 'HUM202', 'HUM301', 'ADM401', 'HUM401', 'EST701', 'OPT802'],
  },
];

export interface TrailProgressResult {
  trail: CurriculumTrail;
  total: number;
  approved: number;
  percentage: number;
  subjects: Subject[];
}

export function calculateTrailsProgress(subjectStates: SubjectStatesMap): TrailProgressResult[] {
  return CURRICULUM_TRAILS.map((trail) => {
    const subjects = trail.subjectIds
      .map((id) => SUBJECT_MAP.get(id))
      .filter((s): s is Subject => s !== undefined);

    const total = subjects.length;
    const approved = subjects.filter((s) => subjectStates[s.id]?.status === 'APPROVED').length;
    const percentage = total > 0 ? Math.round((approved / total) * 100) : 0;

    return {
      trail,
      total,
      approved,
      percentage,
      subjects,
    };
  });
}

export interface ImpactSubjectItem {
  subject: Subject;
  lockedCount: number; // Number of future subjects blocked or directly unlocked
  isCritical: boolean;
}

export function getHighestImpactSubjects(
  subjectStates: SubjectStatesMap,
  limit: number = 4
): ImpactSubjectItem[] {
  // Find unapproved subjects with highest blocking power on remaining subjects
  const candidates: { subject: Subject; score: number; lockedCount: number }[] = [];

  PPC_2023_SUBJECTS.forEach((subject) => {
    const st = subjectStates[subject.id]?.status;
    if (st !== 'APPROVED') {
      const descendants = getAllDescendants(subject.id);
      
      // Count how many descendants are currently locked or would be unlocked
      let blockedCount = 0;
      descendants.forEach((dId) => {
        if (subjectStates[dId]?.status !== 'APPROVED') {
          blockedCount++;
        }
      });

      // Score: prioritizes high dependent counts, and then earlier phases
      const score = (blockedCount * 10) + (9 - subject.semester);

      candidates.push({
        subject,
        score,
        lockedCount: blockedCount > 0 ? blockedCount : (DEPENDENTS_MAP.get(subject.id)?.length || 1),
      });
    }
  });

  // Sort descending by score
  candidates.sort((a, b) => b.score - a.score);

  // Fallback if all or most are approved: return key milestone subjects
  if (candidates.length === 0) {
    const milestones = ['HAR601', 'TCC601', 'SIS501', 'SIS401', 'SOF501']
      .map((id) => SUBJECT_MAP.get(id))
      .filter((s): s is Subject => s !== undefined)
      .slice(0, limit);

    return milestones.map((subject) => ({
      subject,
      lockedCount: DEPENDENTS_MAP.get(subject.id)?.length || 1,
      isCritical: true,
    }));
  }

  return candidates.slice(0, limit).map((c) => ({
    subject: c.subject,
    lockedCount: Math.max(1, c.lockedCount),
    isCritical: true,
  }));
}
