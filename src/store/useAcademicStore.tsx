import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { 
  SubjectStatesMap, 
  SemaphoreStatus, 
  StatusFilter, 
  KnowledgeArea, 
  SeasonalityFilter, 
  ImmediateImpact,
  AcademicMetrics
} from '../types/academic';
import { PPC_2023_SUBJECTS, SUBJECT_MAP } from '../data/curriculumPPC2023';
import { 
  computeCurriculumStates, 
  calculateImmediateImpact, 
  computeAcademicMetrics, 
  getAllAncestors, 
  getAllDescendants,
  DEPENDENTS_MAP
} from '../lib/graphEngine';

interface AcademicContextType {
  subjectStates: SubjectStatesMap;
  metrics: AcademicMetrics;
  hoveredSubjectId: string | null;
  focusedSubjectIds: Set<string>;
  focusedPrereqIds: Set<string>;
  focusedDependentIds: Set<string>;
  selectedSubjectId: string | null;
  infoModalSubjectId: string | null;
  exportModalOpen: boolean;
  onboardingOpen: boolean;
  immediateImpact: ImmediateImpact | null;
  searchQuery: string;
  statusFilter: StatusFilter;
  areaFilter: KnowledgeArea | 'ALL';
  seasonalityFilter: SeasonalityFilter;
  isDarkMode: boolean;
  showAllConnections: boolean;
  canUndo: boolean;
  sidebarOpen: boolean;
  currentPhase: number;

  // Actions
  setSidebarOpen: (open: boolean) => void;
  toggleSidebar: () => void;
  setCurrentPhase: (phase: number) => void;
  approveSubject: (id: string) => void;
  reproveSubject: (id: string) => void;
  retakeSubject: (id: string) => void;
  resetSubject: (id: string) => void;
  setHoveredSubject: (id: string | null) => void;
  setSelectedSubject: (id: string | null) => void;
  setInfoModalSubject: (id: string | null) => void;
  setExportModalOpen: (open: boolean) => void;
  setOnboardingOpen: (open: boolean) => void;
  applySemesterOnboarding: (targetSemester: number) => void;
  resetSimulation: () => void;
  undo: () => void;
  setSearchQuery: (q: string) => void;
  setStatusFilter: (f: StatusFilter) => void;
  setAreaFilter: (a: KnowledgeArea | 'ALL') => void;
  setSeasonalityFilter: (s: SeasonalityFilter) => void;
  toggleDarkMode: () => void;
  toggleShowAllConnections: () => void;
}

const AcademicContext = createContext<AcademicContextType | undefined>(undefined);

export const AcademicProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Manual overrides state: subjectId -> 'APPROVED' | 'RETAKE'
  const [manualStatuses, setManualStatuses] = useState<Record<string, SemaphoreStatus>>({});
  // History stack for undo functionality
  const [history, setHistory] = useState<Record<string, SemaphoreStatus>[]>([]);

  // Selection & hover states
  const [hoveredSubjectId, setHoveredSubjectId] = useState<string | null>(null);
  const [selectedSubjectId, setSelectedSubjectId] = useState<string | null>(null);
  const [infoModalSubjectId, setInfoModalSubjectId] = useState<string | null>(null);
  const [exportModalOpen, setExportModalOpen] = useState<boolean>(false);
  const [onboardingOpen, setOnboardingOpen] = useState<boolean>(true); // Opens on start
  const [immediateImpact, setImmediateImpact] = useState<ImmediateImpact | null>(null);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('ALL');
  const [areaFilter, setAreaFilter] = useState<KnowledgeArea | 'ALL'>('ALL');
  const [seasonalityFilter, setSeasonalityFilter] = useState<SeasonalityFilter>('ALL');
  const [showAllConnections, setShowAllConnections] = useState<boolean>(false);
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(true);
  const [currentPhase, setCurrentPhase] = useState<number>(1);

  // Dark Mode
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Compute states dynamically via Graph Engine
  const subjectStates = useMemo(() => {
    return computeCurriculumStates(manualStatuses);
  }, [manualStatuses]);

  // Compute metrics dynamically
  const metrics = useMemo(() => {
    return computeAcademicMetrics(subjectStates);
  }, [subjectStates]);

  // Compute focused IDs for Hover Focus
  const { focusedSubjectIds, focusedPrereqIds, focusedDependentIds } = useMemo(() => {
    if (!hoveredSubjectId) {
      return {
        focusedSubjectIds: new Set<string>(),
        focusedPrereqIds: new Set<string>(),
        focusedDependentIds: new Set<string>(),
      };
    }

    const prereqs = getAllAncestors(hoveredSubjectId);
    const dependents = getAllDescendants(hoveredSubjectId);
    const allFocused = new Set<string>([hoveredSubjectId, ...prereqs, ...dependents]);

    return {
      focusedSubjectIds: allFocused,
      focusedPrereqIds: prereqs,
      focusedDependentIds: dependents,
    };
  }, [hoveredSubjectId]);

  // Push state to undo history
  const pushHistory = useCallback((current: Record<string, SemaphoreStatus>) => {
    setHistory((prev) => [...prev.slice(-20), current]);
  }, []);

  // Approve Subject
  const approveSubject = useCallback((id: string) => {
    const prevState = { ...manualStatuses };
    pushHistory(prevState);

    const prevComputed = computeCurriculumStates(prevState);
    const nextManual = { ...prevState, [id]: 'APPROVED' as SemaphoreStatus };
    const nextComputed = computeCurriculumStates(nextManual);

    setManualStatuses(nextManual);

    const impact = calculateImmediateImpact(id, 'APPROVED', prevComputed, nextComputed);
    setImmediateImpact(impact);
    setSelectedSubjectId(id); // Open drawer with impact
  }, [manualStatuses, pushHistory]);

  // Reprove / Fail Subject
  const reproveSubject = useCallback((id: string) => {
    const prevState = { ...manualStatuses };
    pushHistory(prevState);

    const prevComputed = computeCurriculumStates(prevState);

    // Reproving means removing approval from this subject and any subsequent dependent subjects
    const descendants = getAllDescendants(id);
    const nextManual = { ...prevState };
    delete nextManual[id]; // removes approved status
    descendants.forEach((dId) => {
      delete nextManual[dId];
    });

    const nextComputed = computeCurriculumStates(nextManual);
    setManualStatuses(nextManual);

    const impact = calculateImmediateImpact(id, 'REPROVED', prevComputed, nextComputed);
    setImmediateImpact(impact);
    setSelectedSubjectId(id);
  }, [manualStatuses, pushHistory]);

  // Mark for Retake
  const retakeSubject = useCallback((id: string) => {
    const prevState = { ...manualStatuses };
    pushHistory(prevState);

    const prevComputed = computeCurriculumStates(prevState);
    const nextManual = { ...prevState, [id]: 'RETAKE' as SemaphoreStatus };
    const nextComputed = computeCurriculumStates(nextManual);

    setManualStatuses(nextManual);
    const impact = calculateImmediateImpact(id, 'REPROVED', prevComputed, nextComputed);
    setImmediateImpact(impact);
    setSelectedSubjectId(id);
  }, [manualStatuses, pushHistory]);

  // Reset Subject
  const resetSubject = useCallback((id: string) => {
    const prevState = { ...manualStatuses };
    pushHistory(prevState);

    const nextManual = { ...prevState };
    delete nextManual[id];

    setManualStatuses(nextManual);
    setImmediateImpact(null);
  }, [manualStatuses, pushHistory]);

  // Onboarding Wizard - Set current semester
  const applySemesterOnboarding = useCallback((targetSemester: number) => {
    pushHistory({ ...manualStatuses });
    const newStatuses: Record<string, SemaphoreStatus> = {};

    PPC_2023_SUBJECTS.forEach((subject) => {
      if (subject.semester < targetSemester) {
        newStatuses[subject.id] = 'APPROVED';
      }
      // Semester = targetSemester will be AVAILABLE naturally
      // Semesters > targetSemester will be computed dynamically by graph engine
    });

    setManualStatuses(newStatuses);
    setCurrentPhase(targetSemester);
    setOnboardingOpen(false);
    setImmediateImpact(null);
  }, [manualStatuses, pushHistory]);

  // Reset entire simulation
  const resetSimulation = useCallback(() => {
    pushHistory({ ...manualStatuses });
    setManualStatuses({});
    setCurrentPhase(1);
    setImmediateImpact(null);
    setSelectedSubjectId(null);
    setHoveredSubjectId(null);
  }, [manualStatuses, pushHistory]);

  // Undo last action
  const undo = useCallback(() => {
    if (history.length === 0) return;
    const previous = history[history.length - 1];
    setHistory((prev) => prev.slice(0, -1));
    setManualStatuses(previous);
    setImmediateImpact(null);
  }, [history]);

  const toggleDarkMode = useCallback(() => {
    setIsDarkMode((prev) => !prev);
  }, []);

  const toggleShowAllConnections = useCallback(() => {
    setShowAllConnections((prev) => !prev);
  }, []);

  const toggleSidebar = useCallback(() => {
    setSidebarOpen((prev) => !prev);
  }, []);

  const value = {
    subjectStates,
    metrics,
    hoveredSubjectId,
    focusedSubjectIds,
    focusedPrereqIds,
    focusedDependentIds,
    selectedSubjectId,
    infoModalSubjectId,
    exportModalOpen,
    onboardingOpen,
    immediateImpact,
    searchQuery,
    statusFilter,
    areaFilter,
    seasonalityFilter,
    isDarkMode,
    showAllConnections,
    canUndo: history.length > 0,
    sidebarOpen,
    currentPhase,

    setSidebarOpen,
    toggleSidebar,
    setCurrentPhase,
    approveSubject,
    reproveSubject,
    retakeSubject,
    resetSubject,
    setHoveredSubject: setHoveredSubjectId,
    setSelectedSubject: setSelectedSubjectId,
    setInfoModalSubject: setInfoModalSubjectId,
    setExportModalOpen,
    setOnboardingOpen,
    applySemesterOnboarding,
    resetSimulation,
    undo,
    setSearchQuery,
    setStatusFilter,
    setAreaFilter,
    setSeasonalityFilter,
    toggleDarkMode,
    toggleShowAllConnections,
  };

  return <AcademicContext.Provider value={value}>{children}</AcademicContext.Provider>;
};

export const useAcademicStore = (): AcademicContextType => {
  const context = useContext(AcademicContext);
  if (!context) {
    throw new Error('useAcademicStore must be used within an AcademicProvider');
  }
  return context;
};
