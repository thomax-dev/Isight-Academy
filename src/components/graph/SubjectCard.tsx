import React, { useState, useRef, useEffect } from 'react';
import { 
  CheckCircle2, 
  PlusCircle, 
  Lock, 
  AlertCircle, 
  Info, 
  Clock, 
  ChevronRight,
  MoreVertical,
  RotateCcw,
  Check,
  Ban
} from 'lucide-react';
import { Subject, SemaphoreStatus } from '../../types/academic';
import { useAcademicStore } from '../../store/useAcademicStore';
import { KNOWLEDGE_AREAS } from '../../data/curriculumPPC2023';

interface SubjectCardProps {
  subject: Subject;
}

export const SubjectCard: React.FC<SubjectCardProps> = ({ subject }) => {
  const {
    subjectStates,
    hoveredSubjectId,
    focusedSubjectIds,
    focusedPrereqIds,
    focusedDependentIds,
    selectedSubjectId,
    searchQuery,
    statusFilter,
    areaFilter,
    seasonalityFilter,
    setHoveredSubject,
    setSelectedSubject,
    setInfoModalSubject,
    approveSubject,
    reproveSubject,
    retakeSubject,
    resetSubject,
  } = useAcademicStore();

  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const runtimeState = subjectStates[subject.id] || { status: 'LOCKED' };
  const status: SemaphoreStatus = runtimeState.status;

  // Close menu on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };
    if (menuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [menuOpen]);

  // Determine if card matches active search/filter
  const matchesSearch = !searchQuery || 
    subject.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    subject.code.toLowerCase().includes(searchQuery.toLowerCase());

  const matchesStatus = statusFilter === 'ALL' || status === statusFilter;
  const matchesArea = areaFilter === 'ALL' || subject.area === areaFilter;
  const isOddSemester = subject.semester % 2 !== 0;
  const matchesSeasonality = seasonalityFilter === 'ALL' || 
    (seasonalityFilter === 'ODD' && isOddSemester) || 
    (seasonalityFilter === 'EVEN' && !isOddSemester);

  const isDimmedByFilter = !matchesSearch || !matchesStatus || !matchesArea || !matchesSeasonality;

  // Hover Focus Logic
  const isCurrentlyHovered = hoveredSubjectId === subject.id;
  const isSelected = selectedSubjectId === subject.id;
  const hasGlobalHover = hoveredSubjectId !== null;

  let isDimmedByHover = false;
  let isPrereqOfHovered = false;
  let isDependentOfHovered = false;

  if (hasGlobalHover) {
    if (isCurrentlyHovered) {
      // Direct focus
    } else if (focusedPrereqIds.has(subject.id)) {
      isPrereqOfHovered = true;
    } else if (focusedDependentIds.has(subject.id)) {
      isDependentOfHovered = true;
    } else {
      isDimmedByHover = true;
    }
  }

  const isDimmed = isDimmedByFilter || isDimmedByHover;

  // Color & styling configuration based on Semaphore Status
  let statusBadgeColor = 'bg-slate-100 text-slate-700 border-slate-300';
  let cardBg = 'bg-white dark:bg-slate-800/90 border-slate-200 dark:border-slate-700';
  let statusIcon = <Lock className="w-4 h-4 text-red-500" />;
  let statusLabel = 'Bloqueado';

  if (status === 'APPROVED') {
    cardBg = 'bg-emerald-50/90 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-600/80 shadow-xs';
    statusBadgeColor = 'bg-emerald-100 dark:bg-emerald-900/80 text-emerald-800 dark:text-emerald-200 border-emerald-300 dark:border-emerald-700';
    statusIcon = <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />;
    statusLabel = 'Aprovado';
  } else if (status === 'AVAILABLE') {
    cardBg = 'bg-amber-50/95 dark:bg-amber-950/40 border-amber-300 dark:border-amber-500/80 shadow-xs ring-1 ring-amber-400/30';
    statusBadgeColor = 'bg-amber-100 dark:bg-amber-900/80 text-amber-800 dark:text-amber-200 border-amber-300 dark:border-amber-700';
    statusIcon = <PlusCircle className="w-4 h-4 text-amber-600 dark:text-amber-400 animate-pulse" />;
    statusLabel = 'Disponível';
  } else if (status === 'RETAKE') {
    cardBg = 'bg-orange-50/90 dark:bg-orange-950/40 border-orange-400 dark:border-orange-600/80 shadow-xs';
    statusBadgeColor = 'bg-orange-100 dark:bg-orange-900/80 text-orange-800 dark:text-orange-200 border-orange-300 dark:border-orange-700';
    statusIcon = <AlertCircle className="w-4 h-4 text-orange-600 dark:text-orange-400" />;
    statusLabel = 'Refazer';
  } else {
    // LOCKED
    cardBg = 'bg-slate-50/80 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 opacity-90';
    statusBadgeColor = 'bg-red-50 dark:bg-red-950/50 text-red-700 dark:text-red-300 border-red-200 dark:border-red-900';
    statusIcon = <Lock className="w-4 h-4 text-red-500 dark:text-red-400" />;
    statusLabel = 'Bloqueado';
  }

  // Knowledge area info
  const areaConfig = KNOWLEDGE_AREAS[subject.area] || KNOWLEDGE_AREAS.HUMANITIES_GENERAL;

  return (
    <div
      id={`subject-card-${subject.id}`}
      onMouseEnter={() => setHoveredSubject(subject.id)}
      onMouseLeave={() => setHoveredSubject(null)}
      onDoubleClick={() => setInfoModalSubject(subject.id)}
      onClick={() => setSelectedSubject(subject.id)}
      className={`relative group rounded-xl p-3 border transition-all duration-200 select-none cursor-pointer flex flex-col justify-between min-h-[140px] ${cardBg} ${
        isDimmed ? 'opacity-20 blur-[0.2px] scale-[0.98]' : 'opacity-100 scale-100'
      } ${
        isCurrentlyHovered 
          ? 'ring-2 ring-blue-500 dark:ring-blue-400 shadow-lg shadow-blue-500/20 z-30 scale-[1.02]' 
          : isPrereqOfHovered
          ? 'ring-2 ring-amber-400 shadow-md shadow-amber-400/20 z-20'
          : isDependentOfHovered
          ? 'ring-2 ring-purple-500 shadow-md shadow-purple-500/20 z-20'
          : isSelected
          ? 'ring-2 ring-blue-600 z-10'
          : 'hover:border-slate-400 dark:hover:border-slate-600'
      }`}
    >
      {/* Indicator Pills on Hover Connection */}
      {isPrereqOfHovered && (
        <span className="absolute -top-2 left-2 px-1.5 py-0.2 rounded-full text-[9px] font-bold bg-amber-500 text-white shadow-xs z-30">
          Pré-requisito
        </span>
      )}
      {isDependentOfHovered && (
        <span className="absolute -top-2 right-2 px-1.5 py-0.2 rounded-full text-[9px] font-bold bg-purple-600 text-white shadow-xs z-30">
          Sucessor
        </span>
      )}

      {/* 1. Header (Topo) */}
      <div className="flex items-center justify-between gap-1.5">
        <div className="flex items-center gap-1.5">
          <span title={`Status: ${statusLabel}`}>{statusIcon}</span>
          <span className="font-mono text-xs font-bold tracking-tight text-slate-800 dark:text-slate-200">
            {subject.code}
          </span>
        </div>

        <div className="flex items-center gap-1">
          {/* Workload Hours Badge */}
          <span 
            className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-700/60 text-slate-600 dark:text-slate-300"
            title={`Carga Horária: ${subject.workloadHours}h | Teto máximo de faltas: ${subject.maxAbsencesHours}h`}
          >
            {subject.workloadHours}h
          </span>

          {/* Quick Context Menu Button */}
          <div className="relative" ref={menuRef}>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setMenuOpen(!menuOpen);
              }}
              className="p-1 rounded-md text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-slate-700 transition"
              title="Ações de simulação"
            >
              <MoreVertical className="w-3.5 h-3.5" />
            </button>

            {/* Context Pop-over Menu */}
            {menuOpen && (
              <div 
                onClick={(e) => e.stopPropagation()}
                className="absolute right-0 top-6 w-44 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 py-1.5 z-50 text-xs font-medium animate-in fade-in zoom-in-95 duration-100"
              >
                <div className="px-3 py-1 text-[10px] font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-100 dark:border-slate-700/60">
                  {subject.code} • Simular
                </div>

                {/* Action: Aprovar */}
                <button
                  onClick={() => {
                    approveSubject(subject.id);
                    setMenuOpen(false);
                  }}
                  className="w-full text-left px-3 py-1.5 flex items-center gap-2 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 transition"
                >
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  Aprovar Matéria
                </button>

                {/* Action: Reprovar */}
                <button
                  onClick={() => {
                    reproveSubject(subject.id);
                    setMenuOpen(false);
                  }}
                  className="w-full text-left px-3 py-1.5 flex items-center gap-2 hover:bg-red-50 dark:hover:bg-red-950/40 text-red-700 dark:text-red-400 transition"
                >
                  <Ban className="w-3.5 h-3.5 text-red-600" />
                  Reprovar / Trancar
                </button>

                {/* Action: Refazer */}
                <button
                  onClick={() => {
                    retakeSubject(subject.id);
                    setMenuOpen(false);
                  }}
                  className="w-full text-left px-3 py-1.5 flex items-center gap-2 hover:bg-orange-50 dark:hover:bg-orange-950/40 text-orange-700 dark:text-orange-400 transition"
                >
                  <AlertCircle className="w-3.5 h-3.5 text-orange-600" />
                  Marcar p/ Refazer
                </button>

                <div className="my-1 border-t border-slate-100 dark:border-slate-700" />

                {/* Action: Ficha Detalhada */}
                <button
                  onClick={() => {
                    setInfoModalSubject(subject.id);
                    setMenuOpen(false);
                  }}
                  className="w-full text-left px-3 py-1.5 flex items-center gap-2 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition"
                >
                  <Info className="w-3.5 h-3.5 text-blue-500" />
                  Ver Ficha e Faltas
                </button>

                {/* Action: Resetar */}
                {runtimeState.userOverridden && (
                  <button
                    onClick={() => {
                      resetSubject(subject.id);
                      setMenuOpen(false);
                    }}
                    className="w-full text-left px-3 py-1.5 flex items-center gap-2 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400 transition"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    Restaurar Padrão
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 2. Body (Centro) */}
      <div className="my-2">
        <h3 className="text-xs font-semibold leading-snug text-slate-900 dark:text-slate-100 line-clamp-2">
          {subject.name}
        </h3>
        
        {/* Knowledge Area Pill */}
        <div className="mt-1.5">
          <span 
            className={`inline-block px-1.5 py-0.2 rounded text-[10px] font-medium border ${areaConfig.bgLight} ${areaConfig.bgDark}`}
          >
            {areaConfig.label}
          </span>
        </div>
      </div>

      {/* 3. Footer (Base) */}
      <div className="pt-2 border-t border-slate-200/50 dark:border-slate-700/50 flex items-center justify-between text-[10px] text-slate-500 dark:text-slate-400">
        <div className="truncate max-w-[170px]" title={subject.prerequisites.length > 0 ? `Pré-requisitos: ${subject.prerequisites.join(', ')}` : 'Sem pré-requisitos'}>
          {subject.prerequisites.length === 0 ? (
            <span className="text-emerald-600 dark:text-emerald-400 font-medium">Sem pré-req.</span>
          ) : (
            <span className="font-mono">
              Req: <strong className="text-slate-700 dark:text-slate-300">{subject.prerequisites.join(', ')}</strong>
            </span>
          )}
        </div>

        {/* Info Trigger Icon */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            setInfoModalSubject(subject.id);
          }}
          className="p-1 rounded hover:bg-slate-200/80 dark:hover:bg-slate-700 text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition"
          title="Ver detalhes da disciplina e faltas permitidas"
        >
          <Info className="w-3 h-3" />
        </button>
      </div>

    </div>
  );
};
