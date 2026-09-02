import React from 'react';
import { 
  X, 
  Sparkles, 
  Lock, 
  CheckCircle2, 
  AlertTriangle, 
  ArrowRight, 
  Clock, 
  Layers, 
  Calendar,
  AlertCircle,
  Check,
  Ban,
  RotateCcw,
  Info
} from 'lucide-react';
import { useAcademicStore } from '../../store/useAcademicStore';
import { SUBJECT_MAP, KNOWLEDGE_AREAS } from '../../data/curriculumPPC2023';

export const ImpactDrawer: React.FC = () => {
  const {
    selectedSubjectId,
    setSelectedSubject,
    immediateImpact,
    subjectStates,
    approveSubject,
    reproveSubject,
    retakeSubject,
    resetSubject,
    setInfoModalSubject,
  } = useAcademicStore();

  if (!selectedSubjectId) return null;

  const subject = SUBJECT_MAP.get(selectedSubjectId);
  if (!subject) return null;

  const currentStatus = subjectStates[subject.id]?.status || 'LOCKED';
  const areaConfig = KNOWLEDGE_AREAS[subject.area] || KNOWLEDGE_AREAS.HUMANITIES_GENERAL;

  return (
    <aside className="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col transition-colors animate-in slide-in-from-right duration-200">
      
      {/* Drawer Header */}
      <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 flex items-start justify-between gap-3 bg-slate-50/70 dark:bg-slate-800/40">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 px-2 py-0.5 rounded border border-blue-200 dark:border-blue-800">
              {subject.code}
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              {subject.semester}º Semestre
            </span>
          </div>
          <h2 className="text-base font-bold text-slate-900 dark:text-white mt-1 leading-snug">
            {subject.name}
          </h2>
        </div>

        <button
          onClick={() => setSelectedSubject(null)}
          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-800 transition"
          title="Fechar painel"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Drawer Scrollable Content */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-5">
        
        {/* Ficha Técnica Rápida */}
        <div className="grid grid-cols-2 gap-2.5">
          <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/60">
            <span className="text-[10px] text-slate-400 font-semibold uppercase flex items-center gap-1">
              <Clock className="w-3 h-3 text-slate-400" />
              Carga Horária
            </span>
            <p className="text-sm font-bold text-slate-800 dark:text-slate-200 mt-0.5">
              {subject.workloadHours} horas
            </p>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/60">
            <span className="text-[10px] text-slate-400 font-semibold uppercase flex items-center gap-1">
              <AlertCircle className="w-3 h-3 text-amber-500" />
              Teto de Faltas
            </span>
            <p className="text-sm font-bold text-amber-600 dark:text-amber-400 mt-0.5">
              Até {subject.maxAbsencesHours}h (25%)
            </p>
          </div>
        </div>

        {/* Trilha do Conhecimento */}
        <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/60 text-xs">
          <span className="text-slate-500 dark:text-slate-400 font-medium">Trilha / Eixo:</span>
          <span className={`px-2 py-0.5 rounded-md font-semibold border ${areaConfig.bgLight} ${areaConfig.bgDark}`}>
            {areaConfig.label}
          </span>
        </div>

        {/* Simulador de Ações Rápidas */}
        <div className="space-y-2">
          <h3 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
            Simular Status desta Disciplina
          </h3>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => approveSubject(subject.id)}
              className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-semibold transition shadow-xs ${
                currentStatus === 'APPROVED'
                  ? 'bg-emerald-600 text-white ring-2 ring-emerald-500/50'
                  : 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100'
              }`}
            >
              <Check className="w-3.5 h-3.5" />
              Aprovar Matéria
            </button>

            <button
              onClick={() => reproveSubject(subject.id)}
              className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-semibold transition shadow-xs ${
                currentStatus === 'LOCKED'
                  ? 'bg-red-600 text-white ring-2 ring-red-500/50'
                  : 'bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-900 hover:bg-red-100'
              }`}
            >
              <Ban className="w-3.5 h-3.5" />
              Reprovar / Trancar
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => retakeSubject(subject.id)}
              className={`flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-xl text-xs font-medium transition ${
                currentStatus === 'RETAKE'
                  ? 'bg-orange-500 text-white'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              <AlertCircle className="w-3.5 h-3.5 text-orange-500" />
              Marcar p/ Refazer
            </button>

            <button
              onClick={() => resetSubject(subject.id)}
              className="flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-xl text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Restaurar Padrão
            </button>
          </div>
        </div>

        {/* EFEITO DOMINÓ / REAÇÃO EM CADEIA EM TEMPO REAL */}
        <div className="space-y-3 pt-2 border-t border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              Efeito Dominó (Reação em Cadeia)
            </h3>
          </div>

          {/* Feedback Seção 1: Matérias Liberadas */}
          {immediateImpact && immediateImpact.unlockedSubjects.length > 0 && (
            <div className="p-3 rounded-xl bg-emerald-50/90 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/60 space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-800 dark:text-emerald-300">
                <Sparkles className="w-4 h-4 text-emerald-600 animate-spin" />
                Matérias Desbloqueadas ({immediateImpact.unlockedSubjects.length})
              </div>
              <p className="text-[11px] text-emerald-700 dark:text-emerald-400">
                A aprovação cumpriu todos os pré-requisitos pendentes das seguintes matérias:
              </p>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {immediateImpact.unlockedSubjects.map((unl) => (
                  <span
                    key={unl.id}
                    onClick={() => setSelectedSubject(unl.id)}
                    className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-semibold bg-emerald-100 dark:bg-emerald-900/80 text-emerald-800 dark:text-emerald-200 border border-emerald-300 dark:border-emerald-700 cursor-pointer hover:scale-105 transition"
                  >
                    <ArrowRight className="w-3 h-3 text-emerald-600" />
                    {unl.code} • {unl.name}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Feedback Seção 2: Matérias Travadas em Cascata */}
          {immediateImpact && immediateImpact.cascadeLockedSubjects.length > 0 && (
            <div className="p-3 rounded-xl bg-red-50/90 dark:bg-red-950/30 border border-red-200 dark:border-red-900/60 space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-red-800 dark:text-red-300">
                <Lock className="w-4 h-4 text-red-600" />
                Matérias Travadas em Cascata ({immediateImpact.cascadeLockedSubjects.length})
              </div>
              <p className="text-[11px] text-red-700 dark:text-red-400">
                Esta pendência bloqueou todas as disciplinas que dependem dela:
              </p>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {immediateImpact.cascadeLockedSubjects.map((casc) => (
                  <span
                    key={casc.id}
                    onClick={() => setSelectedSubject(casc.id)}
                    className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-semibold bg-red-100 dark:bg-red-900/80 text-red-800 dark:text-red-200 border border-red-300 dark:border-red-800 cursor-pointer hover:scale-105 transition"
                  >
                    <Lock className="w-3 h-3 text-red-600" />
                    {casc.code} • {casc.name}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Impacto no Tempo de Formatura */}
          {immediateImpact && immediateImpact.delaySemesters > 0 && (
            <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 flex items-start gap-2.5">
              <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-bold text-amber-800 dark:text-amber-300">
                  Impacto: +{immediateImpact.delaySemesters} Semestre no tempo de formatura
                </p>
                <p className="text-[11px] text-amber-700 dark:text-amber-400/90 mt-0.5">
                  {immediateImpact.criticalPathNotice || 'A retenção nesta matéria prolonga a cadeia de pré-requisitos para conclusão do curso.'}
                </p>
              </div>
            </div>
          )}

          {!immediateImpact && (
            <div className="p-4 rounded-xl border border-dashed border-slate-200 dark:border-slate-800 text-center text-xs text-slate-400 dark:text-slate-500">
              Altere o status acima para simular a reação em cadeia e verificar matérias liberadas ou travadas.
            </div>
          )}
        </div>

      </div>

      {/* Drawer Footer */}
      <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-850">
        <button
          onClick={() => setInfoModalSubject(subject.id)}
          className="w-full py-2.5 px-4 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-bold flex items-center justify-center gap-2 hover:bg-slate-800 dark:hover:bg-slate-100 transition shadow-sm"
        >
          <Info className="w-4 h-4" />
          Ver Ementa e Detalhes Completos
        </button>
      </div>

    </aside>
  );
};
