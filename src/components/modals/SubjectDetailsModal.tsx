import React from 'react';
import { 
  X, 
  Clock, 
  AlertTriangle, 
  BookOpen, 
  CheckCircle2, 
  Lock, 
  ArrowRight, 
  Layers,
  Calendar,
  Check,
  Ban,
  RotateCcw,
  Sparkles
} from 'lucide-react';
import { useAcademicStore } from '../../store/useAcademicStore';
import { SUBJECT_MAP, KNOWLEDGE_AREAS } from '../../data/curriculumPPC2023';
import { DEPENDENTS_MAP } from '../../lib/graphEngine';

export const SubjectDetailsModal: React.FC = () => {
  const { 
    infoModalSubjectId, 
    setInfoModalSubject, 
    subjectStates,
    approveSubject,
    reproveSubject,
    retakeSubject,
    resetSubject,
    metrics,
  } = useAcademicStore();

  if (!infoModalSubjectId) return null;

  const subject = SUBJECT_MAP.get(infoModalSubjectId);
  if (!subject) return null;

  const currentStatus = subjectStates[subject.id]?.status || 'LOCKED';
  const areaConfig = KNOWLEDGE_AREAS[subject.area] || KNOWLEDGE_AREAS.HUMANITIES_GENERAL;
  const directDependents = (DEPENDENTS_MAP.get(subject.id) || [])
    .map((id) => SUBJECT_MAP.get(id))
    .filter(Boolean);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Modal Header */}
        <div className="p-6 border-b border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-850 flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-900/60 text-blue-800 dark:text-blue-200 border border-blue-200 dark:border-blue-800">
                {subject.code}
              </span>
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                Matriz Curricular • {subject.semester}º Semestre
              </span>
            </div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mt-1.5 leading-snug">
              {subject.name}
            </h2>
          </div>

          <button
            onClick={() => setInfoModalSubject(null)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          
          {/* Ficha de Carga Horária e Teto Máximo de Faltas (v0 feature + feedback) */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
              <span className="text-[11px] font-semibold text-slate-400 uppercase flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-blue-500" />
                Carga Horária Total
              </span>
              <p className="text-base font-extrabold text-slate-900 dark:text-white mt-1">
                {subject.workloadHours} horas
              </p>
              <p className="text-[10px] text-slate-500 mt-0.5">
                {Math.round(subject.workloadHours / 18)} créditos teóricos/práticos
              </p>
            </div>

            <div className="p-3 rounded-xl bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/60">
              <span className="text-[11px] font-semibold text-amber-700 dark:text-amber-400 uppercase flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
                Limite de Faltas
              </span>
              <p className="text-base font-extrabold text-amber-600 dark:text-amber-400 mt-1">
                Máx. {subject.maxAbsencesHours} horas
              </p>
              <p className="text-[10px] text-amber-700/80 dark:text-amber-400/80 mt-0.5">
                25% legal permitido pelo regimento
              </p>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
              <span className="text-[11px] font-semibold text-slate-400 uppercase flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-indigo-500" />
                Período e Trilha
              </span>
              <p className="text-xs font-bold text-slate-900 dark:text-white mt-1 truncate">
                {areaConfig.label}
              </p>
              <p className="text-[10px] text-slate-500 mt-0.5">
                Oferta: {subject.semester % 2 !== 0 ? 'Semestres Ímpares' : 'Semestres Pares'}
              </p>
            </div>
          </div>

          {/* Ementa Resumida */}
          <div className="space-y-1.5">
            <h3 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-blue-500" />
              Ementa e Objetivos do PPC 2023
            </h3>
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/70 text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
              {subject.description}
            </div>
          </div>

            {/* Pré-requisitos Exigidos */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-red-500" />
              Pré-requisitos Exigidos para Matrícula
            </h3>

            {/* Requisito de percentual de créditos */}
            {subject.minCreditsPercentage && (
              <div className={`p-2.5 rounded-xl border flex items-center justify-between text-xs ${
                metrics.progressPercentage >= subject.minCreditsPercentage
                  ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200'
                  : 'bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-900 text-amber-800 dark:text-amber-200'
              }`}>
                <div>
                  <span className="font-bold block">
                    Carga Horária Mínima Integralizada
                  </span>
                  <span className="text-[11px] opacity-90">
                    Requer no mínimo <strong>{subject.minCreditsPercentage}% dos créditos</strong> do curso (Você possui {metrics.progressPercentage}%).
                  </span>
                </div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  metrics.progressPercentage >= subject.minCreditsPercentage
                    ? 'bg-emerald-200 dark:bg-emerald-900 text-emerald-900 dark:text-emerald-100'
                    : 'bg-amber-200 dark:bg-amber-900 text-amber-900 dark:text-amber-100'
                }`}>
                  {metrics.progressPercentage >= subject.minCreditsPercentage ? 'Atingido' : 'Pendente'}
                </span>
              </div>
            )}

            {subject.prerequisites.length === 0 && !subject.minCreditsPercentage ? (
              <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                Nenhum pré-requisito exigido. Matéria de entrada ou livre!
              </p>
            ) : null}

            {subject.prerequisites.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {subject.prerequisites.map((prereqId) => {
                  const pSubj = SUBJECT_MAP.get(prereqId);
                  const isApproved = subjectStates[prereqId]?.status === 'APPROVED';
                  return (
                    <div
                      key={prereqId}
                      className={`p-2.5 rounded-xl border flex items-center justify-between text-xs ${
                        isApproved
                          ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200'
                          : 'bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-900 text-red-800 dark:text-red-200'
                      }`}
                    >
                      <div>
                        <span className="font-mono font-bold text-[11px] block">
                          {pSubj?.code || prereqId}
                        </span>
                        <span className="line-clamp-1 font-medium text-[11px]">
                          {pSubj?.name || prereqId}
                        </span>
                      </div>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        isApproved 
                          ? 'bg-emerald-200 dark:bg-emerald-900 text-emerald-900 dark:text-emerald-100' 
                          : 'bg-red-200 dark:bg-red-900 text-red-900 dark:text-red-100'
                      }`}>
                        {isApproved ? 'Cumprido' : 'Pendente'}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Disciplinas que esta desbloqueia */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-purple-500" />
              Disciplinas Futuras que Dependem Desta
            </h3>
            {directDependents.length === 0 ? (
              <p className="text-xs text-slate-500">
                Nenhuma disciplina futura possui esta matéria como pré-requisito direto.
              </p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {directDependents.map((dep) => {
                  if (!dep) return null;
                  return (
                    <div
                      key={dep.id}
                      className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/40 flex items-center gap-2 text-xs"
                    >
                      <ArrowRight className="w-3.5 h-3.5 text-purple-500 shrink-0" />
                      <div>
                        <span className="font-mono font-bold text-[11px] text-slate-800 dark:text-slate-200 block">
                          {dep.code} • {dep.semester}º Semestre
                        </span>
                        <span className="text-slate-600 dark:text-slate-400 line-clamp-1 text-[11px]">
                          {dep.name}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Ações de Simulação do Modal */}
          <div className="pt-3 border-t border-slate-200 dark:border-slate-800 space-y-2">
            <h3 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
              Ações Rápidas de Simulação
            </h3>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => approveSubject(subject.id)}
                className={`py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition ${
                  currentStatus === 'APPROVED'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 hover:bg-emerald-100'
                }`}
              >
                <Check className="w-3.5 h-3.5" />
                Aprovar
              </button>

              <button
                onClick={() => reproveSubject(subject.id)}
                className={`py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition ${
                  currentStatus === 'LOCKED'
                    ? 'bg-red-600 text-white shadow-sm'
                    : 'bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300 border border-red-200 hover:bg-red-100'
                }`}
              >
                <Ban className="w-3.5 h-3.5" />
                Reprovar
              </button>

              <button
                onClick={() => retakeSubject(subject.id)}
                className={`py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition ${
                  currentStatus === 'RETAKE'
                    ? 'bg-orange-500 text-white shadow-sm'
                    : 'bg-orange-50 dark:bg-orange-950/40 text-orange-700 dark:text-orange-300 border border-orange-200 hover:bg-orange-100'
                }`}
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Refazer
              </button>
            </div>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-850 flex justify-end">
          <button
            onClick={() => setInfoModalSubject(null)}
            className="px-5 py-2 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-bold hover:bg-slate-800 dark:hover:bg-slate-100 transition"
          >
            Fechar
          </button>
        </div>

      </div>
    </div>
  );
};
