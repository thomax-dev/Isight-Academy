import { Subject, SubjectStatesMap, SemaphoreStatus, AcademicMetrics, ImmediateImpact } from '../types/academic';
import { PPC_2023_SUBJECTS, SUBJECT_MAP, TOTAL_CURRICULUM_HOURS } from '../data/curriculumPPC2023';

/**
 * Adjacency maps for fast graph traversal
 */
// Dependencies: subjectId -> list of prerequisite subjectIds
export const PREREQUISITES_MAP = new Map<string, string[]>();
// Reverse dependencies: subjectId -> list of subjects that require this subject
export const DEPENDENTS_MAP = new Map<string, string[]>();

PPC_2023_SUBJECTS.forEach((subject) => {
  PREREQUISITES_MAP.set(subject.id, subject.prerequisites);
  if (!DEPENDENTS_MAP.has(subject.id)) {
    DEPENDENTS_MAP.set(subject.id, []);
  }
});

PPC_2023_SUBJECTS.forEach((subject) => {
  subject.prerequisites.forEach((prereqId) => {
    const list = DEPENDENTS_MAP.get(prereqId) || [];
    list.push(subject.id);
    DEPENDENTS_MAP.set(prereqId, list);
  });
});

/**
 * Returns all direct and indirect ancestors (prerequisites) of a subject
 */
export function getAllAncestors(subjectId: string, visited = new Set<string>()): Set<string> {
  const prereqs = PREREQUISITES_MAP.get(subjectId) || [];
  for (const p of prereqs) {
    if (!visited.has(p)) {
      visited.add(p);
      getAllAncestors(p, visited);
    }
  }
  return visited;
}

/**
 * Returns all direct and indirect descendants (dependents) of a subject
 */
export function getAllDescendants(subjectId: string, visited = new Set<string>()): Set<string> {
  const deps = DEPENDENTS_MAP.get(subjectId) || [];
  for (const d of deps) {
    if (!visited.has(d)) {
      visited.add(d);
      getAllDescendants(d, visited);
    }
  }
  return visited;
}

/**
 * Computes all subject states based on manual approvals or retakes
 */
export function computeCurriculumStates(
  manualStatuses: Record<string, SemaphoreStatus>
): SubjectStatesMap {
  const result: SubjectStatesMap = {};

  // Sort subjects by semester (1 to 8) to ensure topological order
  const sortedSubjects = [...PPC_2023_SUBJECTS].sort((a, b) => a.semester - b.semester);

  for (const subject of sortedSubjects) {
    const manual = manualStatuses[subject.id];

    if (manual === 'APPROVED') {
      result[subject.id] = { status: 'APPROVED', userOverridden: true };
      continue;
    }

    if (manual === 'RETAKE') {
      result[subject.id] = { status: 'RETAKE', userOverridden: true };
      continue;
    }

    // Check prerequisites
    const prereqs = subject.prerequisites;
    if (prereqs.length === 0) {
      // Semester 1 subjects with no prerequisites are AVAILABLE by default unless approved or retake
      result[subject.id] = { status: 'AVAILABLE' };
    } else {
      const allPrereqsApproved = prereqs.every((pId) => result[pId]?.status === 'APPROVED');
      if (allPrereqsApproved) {
        result[subject.id] = { status: 'AVAILABLE' };
      } else {
        result[subject.id] = { status: 'LOCKED' };
      }
    }
  }

  return result;
}

/**
 * Computes the immediate impact report (Dominó effect) when a status change is simulated
 */
export function calculateImmediateImpact(
  subjectId: string,
  newAction: 'APPROVED' | 'REPROVED' | 'RESET',
  previousStates: SubjectStatesMap,
  newStates: SubjectStatesMap
): ImmediateImpact {
  const unlockedSubjects: Subject[] = [];
  const cascadeLockedSubjects: Subject[] = [];

  const descendants = getAllDescendants(subjectId);

  // Compare previous and new states
  PPC_2023_SUBJECTS.forEach((subj) => {
    const prev = previousStates[subj.id]?.status;
    const next = newStates[subj.id]?.status;

    if (prev !== next) {
      if (next === 'AVAILABLE' && (prev === 'LOCKED' || prev === 'RETAKE')) {
        unlockedSubjects.push(subj);
      } else if (next === 'LOCKED' && (prev === 'AVAILABLE' || prev === 'APPROVED')) {
        if (descendants.has(subj.id)) {
          cascadeLockedSubjects.push(subj);
        }
      }
    }
  });

  // Critical path delay impact calculation
  let delaySemesters = 0;
  let criticalPathNotice: string | undefined;

  if (newAction === 'REPROVED') {
    // If the reproved subject has a long descendant chain, it directly pushes graduation back
    const chainDepth = getLongestRemainingPath(subjectId, newStates);
    const targetSubj = SUBJECT_MAP.get(subjectId);
    if (targetSubj) {
      // An uncompleted subject in semester S with path length L pushes minimum remaining semesters
      const neededSemesters = chainDepth;
      const nominalRemaining = 9 - targetSubj.semester;
      if (neededSemesters >= nominalRemaining) {
        delaySemesters = 1;
      } else {
        delaySemesters = 1;
      }
      criticalPathNotice = `A reprovação em "${targetSubj.name}" trava uma cadeia de ${descendants.size} disciplina(s) futura(s). Adiciona no mínimo +1 semestre ao planejamento.`;
    }
  }

  return {
    subjectId,
    action: newAction,
    unlockedSubjects,
    cascadeLockedSubjects,
    delaySemesters,
    criticalPathNotice,
  };
}

/**
 * Calculates the longest path of uncompleted courses from a given subject to graduation
 */
export function getLongestRemainingPath(
  subjectId: string,
  currentStates: SubjectStatesMap,
  memo = new Map<string, number>()
): number {
  if (memo.has(subjectId)) return memo.get(subjectId)!;

  const deps = DEPENDENTS_MAP.get(subjectId) || [];
  if (deps.length === 0) {
    memo.set(subjectId, 1);
    return 1;
  }

  let maxChildPath = 0;
  for (const depId of deps) {
    const childPath = getLongestRemainingPath(depId, currentStates, memo);
    if (childPath > maxChildPath) {
      maxChildPath = childPath;
    }
  }

  const path = 1 + maxChildPath;
  memo.set(subjectId, path);
  return path;
}

/**
 * Identifies the global critical path (the longest prerequisite chain in the PPC)
 */
export function calculateGlobalCriticalPath(): string[] {
  const memo = new Map<string, string[]>();

  function findLongest(subjectId: string): string[] {
    if (memo.has(subjectId)) return memo.get(subjectId)!;
    const deps = DEPENDENTS_MAP.get(subjectId) || [];
    if (deps.length === 0) {
      const res = [subjectId];
      memo.set(subjectId, res);
      return res;
    }

    let longestChild: string[] = [];
    for (const depId of deps) {
      const childPath = findLongest(depId);
      if (childPath.length > longestChild.length) {
        longestChild = childPath;
      }
    }

    const res = [subjectId, ...longestChild];
    memo.set(subjectId, res);
    return res;
  }

  let bestPath: string[] = [];
  // Roots are semester 1 subjects
  const roots = PPC_2023_SUBJECTS.filter((s) => s.prerequisites.length === 0);
  for (const root of roots) {
    const path = findLongest(root.id);
    if (path.length > bestPath.length) {
      bestPath = path;
    }
  }

  return bestPath;
}

/**
 * Computes all academic dashboard metrics
 */
export function computeAcademicMetrics(states: SubjectStatesMap): AcademicMetrics {
  let approvedHours = 0;
  let approvedSubjectsCount = 0;
  let availableSubjectsCount = 0;
  let lockedSubjectsCount = 0;
  let retakeSubjectsCount = 0;

  PPC_2023_SUBJECTS.forEach((s) => {
    const st = states[s.id]?.status;
    if (st === 'APPROVED') {
      approvedHours += s.workloadHours;
      approvedSubjectsCount++;
    } else if (st === 'AVAILABLE') {
      availableSubjectsCount++;
    } else if (st === 'LOCKED') {
      lockedSubjectsCount++;
    } else if (st === 'RETAKE') {
      retakeSubjectsCount++;
    }
  });

  const pendingHours = TOTAL_CURRICULUM_HOURS - approvedHours;
  const progressPercentage = Math.round((approvedHours / TOTAL_CURRICULUM_HOURS) * 100);

  // Critical path calculation among remaining unapproved subjects
  const criticalPath = calculateGlobalCriticalPath();
  const unapprovedInCriticalPath = criticalPath.filter((id) => states[id]?.status !== 'APPROVED');

  // Estimate remaining semesters based on longest chain of uncompleted subjects
  let maxRemainingChain = 0;
  PPC_2023_SUBJECTS.forEach((s) => {
    if (states[s.id]?.status !== 'APPROVED') {
      const chain = getLongestRemainingPath(s.id, states);
      if (chain > maxRemainingChain) {
        maxRemainingChain = chain;
      }
    }
  });

  const estimatedSemestersRemaining = approvedSubjectsCount === PPC_2023_SUBJECTS.length 
    ? 0 
    : Math.max(1, maxRemainingChain);

  return {
    totalHours: TOTAL_CURRICULUM_HOURS,
    approvedHours,
    pendingHours,
    progressPercentage,
    totalSubjects: PPC_2023_SUBJECTS.length,
    approvedSubjectsCount,
    availableSubjectsCount,
    lockedSubjectsCount,
    retakeSubjectsCount,
    estimatedSemestersRemaining,
    criticalPathLength: criticalPath.length,
    criticalPathSubjects: unapprovedInCriticalPath,
  };
}
