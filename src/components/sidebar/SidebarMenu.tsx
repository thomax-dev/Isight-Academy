import React, { useState, useMemo } from 'react';
import { 
  GraduationCap, 
  PanelLeftClose, 
  PanelLeft,
  BookOpen, 
  Target, 
  Filter, 
  Calendar, 
  GitBranch, 
  ChevronDown, 
  ChevronUp, 
  Lock, 
  CheckCircle2, 
  PlusCircle,
  Sparkles
} from 'lucide-react';
import { useAcademicStore } from '../../store/useAcademicStore';
import { calculateTrailsProgress, getHighestImpactSubjects, CurriculumTrail } from '../../lib/curriculumAnalytics';

export const SidebarMenu: React.FC = () => {
  const {
    metrics,
    subjectStates,
    seasonalityFilter,
    setSeasonalityFilter,
    currentPhase,
    applySemesterOnboarding,
    setSelectedSubject,
    setHoveredSubject,
    sidebarOpen,
    toggleSidebar,
    areaFilter,
    setAreaFilter,
  } = useAcademicStore();

  const [expandedTrailId, setExpandedTrailId] = useState<string | null>(null);
  const [showAllTrails, setShowAllTrails] = useState(false);

  // Compute trails progress dynamically
  const trailsProgress = useMemo(() => {
    return calculateTrailsProgress(subjectStates);
  }, [subjectStates]);

  // Compute highest impact subjects dynamically
  const highestImpactSubjects = useMemo(() => {
    return getHighestImpactSubjects(subjectStates, 2);
  }, [subjectStates]);

  const handleSubjectClick = (subjectId: string) => {
    setHoveredSubject(subjectId);
    setSelectedSubject(subjectId);

    // Smooth scroll to card in graph
    const cardEl = document.getElementById(`subject-card-${subjectId}`);
    if (cardEl) {
      cardEl.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
    }
  };

  const handlePhaseClick = (phase: number) => {
    applySemesterOnboarding(phase);
  };

  const displayedTrails = showAllTrails ? trailsProgress : trailsProgress.slice(0, 5);

  if (!sidebarOpen) {
    return (
      <div className="hidden lg:flex flex-col items-center py-4 px-2 bg-slate-900 border-r border-slate-800 shrink-0 w-14 transition-all">
        <button
          onClick={toggleSidebar}
          className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition"
          title="Expandir Menu Lateral"
        >
          <PanelLeft className="w-5 h-5" />
        </button>
        <div className="mt-6 flex flex-col items-center gap-4 text-xs font-bold text-slate-400">
          <span className="[writing-mode:vertical-lr] tracking-wider uppercase text-[10px] text-slate-500">
            InsightAcademic
          </span>
        </div>
      </div>
    );
  }

  return (
    <aside className="w-[300px] shrink-0 h-screen overflow-y-auto bg-[#121417] text-slate-100 border-r border-slate-800/80 p-4 space-y-4 select-none flex flex-col transition-all duration-200 z-30">
      
      {/* 1. Header do Menu */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-800/60">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-slate-800/80 border border-slate-700/60 flex items-center justify-center text-white shadow-sm">
            <GraduationCap className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <h2 className="text-sm font-black tracking-tight text-white leading-tight">
              InsightAcademic
            </h2>
            <p className="text-[11px] font-medium text-slate-400">
              CC - UNEMAT
            </p>
          </div>
        </div>

        <button
          onClick={toggleSidebar}
          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          title="Recolher Menu"
        >
          <PanelLeftClose className="w-4 h-4" />
        </button>
      </div>

      {/* 2. Card: Integralização do Curso */}
      <div className="p-3.5 rounded-2xl bg-[#1b1e23] border border-slate-800/80 space-y-2.5">
        <div className="flex items-center gap-2 text-xs font-bold text-white tracking-wide">
          <BookOpen className="w-4 h-4 text-slate-300" />
          <span>Integralizacao do Curso</span>
        </div>

        {/* Progress bar */}
        <div className="w-full bg-slate-700/50 h-3 rounded-full overflow-hidden p-0.5">
          <div 
            className="bg-white h-full rounded-full transition-all duration-500 ease-out shadow-sm"
            style={{ width: `${Math.min(100, Math.max(0, metrics.progressPercentage))}%` }}
          />
        </div>

        {/* Total disciplines and percentage */}
        <div className="flex items-center justify-between text-xs text-slate-300 font-medium">
          <span>{metrics.approvedSubjectsCount} de {metrics.totalSubjects} disciplinas</span>
          <span className="text-base font-extrabold text-white">{metrics.progressPercentage}%</span>
        </div>

        {/* Workload integralizada */}
        <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-slate-800/60">
          <span>Carga horaria integralizada</span>
          <span className="font-semibold text-slate-200">
            {metrics.approvedHours}h / {metrics.totalHours}h
          </span>
        </div>
      </div>

      {/* 3. Card: Maior Impacto */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-xs font-bold text-white tracking-wide px-1">
          <Target className="w-4 h-4 text-slate-300" />
          <span>Maior Impacto</span>
        </div>

        <div className="space-y-2">
          {highestImpactSubjects.map((item) => (
            <div
              key={item.subject.id}
              onClick={() => handleSubjectClick(item.subject.id)}
              className="group p-3 rounded-2xl bg-[#1b1e23] border border-slate-800/80 hover:border-slate-700 hover:bg-[#22262d] cursor-pointer transition flex items-center justify-between gap-2"
            >
              <div className="min-w-0">
                <h4 className="text-xs font-bold text-white group-hover:text-blue-400 transition truncate">
                  {item.subject.name}
                </h4>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  {item.subject.semester}ª Fase
                </p>
              </div>

              {/* Lock Badge */}
              <div className="shrink-0 flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-400 border border-amber-500/30 text-xs font-bold">
                <Lock className="w-3 h-3" />
                <span>{item.lockedCount}</span>
              </div>
            </div>
          ))}
        </div>

        <p className="text-[11px] text-slate-500 text-center pt-0.5">
          Clique para destacar no grafo
        </p>
      </div>

      {/* 4. Card: Filtro de Sazonalidade */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-xs font-bold text-white tracking-wide px-1">
          <Filter className="w-4 h-4 text-slate-300" />
          <span>Filtro de Sazonalidade</span>
        </div>

        {/* 3 buttons row */}
        <div className="grid grid-cols-3 gap-1.5 p-1 rounded-xl bg-[#1b1e23] border border-slate-800/80">
          <button
            onClick={() => setSeasonalityFilter('ALL')}
            className={`py-1.5 rounded-lg text-xs font-bold transition ${
              seasonalityFilter === 'ALL'
                ? 'bg-white text-black shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            Todas
          </button>
          <button
            onClick={() => setSeasonalityFilter('ODD')}
            className={`py-1.5 rounded-lg text-xs font-bold transition ${
              seasonalityFilter === 'ODD'
                ? 'bg-white text-black shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            Impares
          </button>
          <button
            onClick={() => setSeasonalityFilter('EVEN')}
            className={`py-1.5 rounded-lg text-xs font-bold transition ${
              seasonalityFilter === 'EVEN'
                ? 'bg-white text-black shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            Pares
          </button>
        </div>

        <p className="text-[10px] text-slate-500 px-1 leading-tight">
          Fases impares = 1a, 3a, 5a, 7a | Fases pares = 2a, 4a, 6a, 8a
        </p>
      </div>

      {/* 5. Card: Fase Atual */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-xs font-bold text-white tracking-wide px-1">
          <Calendar className="w-4 h-4 text-slate-300" />
          <span>Fase Atual</span>
        </div>

        {/* 8 buttons in 4x2 grid */}
        <div className="grid grid-cols-4 gap-2">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => {
            const isSelected = currentPhase === sem;
            return (
              <button
                key={sem}
                onClick={() => handlePhaseClick(sem)}
                className={`py-2 rounded-xl text-xs font-bold transition-all ${
                  isSelected
                    ? 'bg-white text-black shadow-md scale-105'
                    : 'bg-[#1b1e23] border border-slate-800 text-slate-300 hover:bg-[#242930] hover:text-white'
                }`}
              >
                {sem}a
              </button>
            );
          })}
        </div>
      </div>

      {/* 6. Card: Caminhos Críticos / Trilhas de Conhecimento */}
      <div className="space-y-2 pt-1">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2 text-xs font-bold text-white tracking-wide">
            <GitBranch className="w-4 h-4 text-slate-300" />
            <span>Caminhos Criticos</span>
          </div>
          <button
            onClick={() => setShowAllTrails(!showAllTrails)}
            className="text-[10px] text-blue-400 hover:underline"
          >
            {showAllTrails ? 'Menos trilhas' : 'Ver todas'}
          </button>
        </div>

        {/* List of Trails */}
        <div className="space-y-2">
          {displayedTrails.map((trailData) => {
            const isExpanded = expandedTrailId === trailData.trail.id;
            return (
              <div
                key={trailData.trail.id}
                className={`rounded-2xl border ${trailData.trail.borderClass} ${trailData.trail.cardBgClass} p-3 space-y-2 transition`}
              >
                {/* Header row with Title + % Badge + Chevron */}
                <div 
                  onClick={() => setExpandedTrailId(isExpanded ? null : trailData.trail.id)}
                  className="flex items-center justify-between cursor-pointer"
                >
                  <span className={`text-xs font-extrabold ${trailData.trail.textBadge}`}>
                    {trailData.trail.title}
                  </span>

                  <div className="flex items-center gap-1.5">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${trailData.trail.bgBadge}`}>
                      {trailData.percentage}%
                    </span>
                    {isExpanded ? (
                      <ChevronUp className="w-3.5 h-3.5 text-slate-400" />
                    ) : (
                      <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                    )}
                  </div>
                </div>

                {/* Trail Progress bar */}
                <div className="w-full bg-slate-800/80 h-2 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500 ease-out"
                    style={{ 
                      width: `${trailData.percentage}%`,
                      backgroundColor: trailData.trail.color 
                    }}
                  />
                </div>

                {/* Subtitle / ratio */}
                <div className="flex items-center justify-between text-[10px] text-slate-400">
                  <span>{trailData.approved} de {trailData.total} concluídas</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      // Highlight trail on graph
                      if (areaFilter === 'ALL') {
                        // find matching area if applicable
                      }
                    }}
                    className="text-[10px] text-slate-500 hover:text-slate-300"
                  >
                    {isExpanded ? 'Recolher' : 'Ver matérias'}
                  </button>
                </div>

                {/* Expanded subjects list */}
                {isExpanded && (
                  <div className="pt-2 border-t border-slate-800/50 space-y-1.5 animate-in fade-in duration-150">
                    {trailData.subjects.map((s) => {
                      const st = subjectStates[s.id]?.status || 'LOCKED';
                      return (
                        <div
                          key={s.id}
                          onClick={() => handleSubjectClick(s.id)}
                          className="flex items-center justify-between py-1 px-2 rounded-lg bg-slate-900/60 hover:bg-slate-800 text-[11px] cursor-pointer transition"
                        >
                          <span className="truncate max-w-[170px] text-slate-300">
                            {s.code} • {s.name}
                          </span>
                          <span className="text-[10px] font-bold">
                            {st === 'APPROVED' ? (
                              <span className="text-emerald-400">OK</span>
                            ) : st === 'AVAILABLE' ? (
                              <span className="text-amber-400">Liberada</span>
                            ) : (
                              <span className="text-red-400">Bloqueada</span>
                            )}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

    </aside>
  );
};
