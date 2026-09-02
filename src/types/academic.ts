export type SemaphoreStatus = 'APPROVED' | 'AVAILABLE' | 'LOCKED' | 'RETAKE';

export type KnowledgeArea = 
  | 'PROGRAMMING' 
  | 'MATHEMATICS' 
  | 'SOFTWARE_ENGINEERING' 
  | 'SYSTEMS' 
  | 'HARDWARE_NETWORKS' 
  | 'THEORY' 
  | 'HUMANITIES_GENERAL';

export interface Subject {
  id: string;
  code: string;
  name: string;
  semester: number; // 1 to 8
  workloadHours: number;
  maxAbsencesHours: number; // 25% of workload
  area: KnowledgeArea;
  areaLabel: string;
  prerequisites: string[]; // Subject IDs that must be APPROVED
  corequisites?: string[]; // Co-requisites in the same semester
  description: string;
}

export interface SubjectRuntimeState {
  status: SemaphoreStatus;
  userOverridden?: boolean;
}

export type SubjectStatesMap = Record<string, SubjectRuntimeState>;

export type SeasonalityFilter = 'ALL' | 'ODD' | 'EVEN';
export type StatusFilter = 'ALL' | 'APPROVED' | 'AVAILABLE' | 'LOCKED';

export interface ImmediateImpact {
  subjectId: string;
  action: 'APPROVED' | 'REPROVED' | 'RESET';
  unlockedSubjects: Subject[];
  cascadeLockedSubjects: Subject[];
  delaySemesters: number;
  criticalPathNotice?: string;
}

export interface AcademicMetrics {
  totalHours: number;
  approvedHours: number;
  pendingHours: number;
  progressPercentage: number;
  totalSubjects: number;
  approvedSubjectsCount: number;
  availableSubjectsCount: number;
  lockedSubjectsCount: number;
  retakeSubjectsCount: number;
  estimatedSemestersRemaining: number;
  criticalPathLength: number;
  criticalPathSubjects: string[];
}
