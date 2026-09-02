import React from 'react';
import { 
  CheckCircle2, 
  Clock, 
  Hourglass, 
  Lock, 
  AlertTriangle, 
  Sparkles,
  Award
} from 'lucide-react';
import { useAcademicStore } from '../../store/useAcademicStore';

export const MetricsBar: React.FC = () => {
  const { metrics } = useAcademicStore();

  return (
    <div className="w-full bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 py-3.5 px-4 sm:px-6 lg:px-8 transition-colors">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
          
          {/* Card 1: Integralização (%) */}
          <div className="col-span-2 sm:col-span-1 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 flex flex-col justify-between">
            <div className="flex items-center justify-between text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">
              <span className="flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                Integralização
              </span>
              <span className="font-bold text-blue-600 dark:text-blue-400">{metrics.progressPercentage}%</span>
            </div>
            <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden mt-1">
              <div 
                className="bg-gradient-to-r from-blue-500 to-indigo-600 h-full rounded-full transition-all duration-500 ease-out"
                style={{ width: `${Math.min(100, Math.max(0, metrics.progressPercentage))}%` }}
              />
            </div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1.5 flex justify-between">
              <span>{metrics.approvedSubjectsCount} de {metrics.totalSubjects} matérias</span>
            </div>
          </div>

          {/* Card 2: Carga Horária */}
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 flex flex-col justify-between">
            <div className="flex items-center justify-between text-xs font-medium text-slate-500 dark:text-slate-400">
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-indigo-500" />
                Carga Horária
              </span>
              <span className="text-[10px] font-semibold text-slate-400">Total: {metrics.totalHours}h</span>
            </div>
            <div className="mt-1 flex items-baseline gap-1">
              <span className="text-xl font-extrabold text-slate-900 dark:text-white">
                {metrics.approvedHours}h
              </span>
              <span className="text-xs text-slate-500">concluídas</span>
            </div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
              <span>{metrics.pendingHours}h pendentes</span>
            </div>
          </div>

          {/* Card 3: Disciplinas Disponíveis (Amarelo) */}
          <div className="p-3 rounded-xl bg-amber-50/70 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/50 flex flex-col justify-between">
            <div className="flex items-center justify-between text-xs font-medium text-amber-800 dark:text-amber-300">
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                Prontas p/ Cursar
              </span>
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
            </div>
            <div className="mt-1 flex items-baseline gap-1">
              <span className="text-xl font-extrabold text-amber-600 dark:text-amber-400">
                {metrics.availableSubjectsCount}
              </span>
              <span className="text-xs text-amber-700/80 dark:text-amber-400/80">liberadas</span>
            </div>
            <div className="text-[11px] text-amber-600/90 dark:text-amber-400/80 mt-0.5">
              Pré-requisitos 100% OK
            </div>
          </div>

          {/* Card 4: Disciplinas Bloqueadas (Vermelho) */}
          <div className="p-3 rounded-xl bg-red-50/60 dark:bg-red-950/20 border border-red-200 dark:border-red-900/50 flex flex-col justify-between">
            <div className="flex items-center justify-between text-xs font-medium text-red-800 dark:text-red-300">
              <span className="flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-red-500" />
                Trancadas
              </span>
              {metrics.retakeSubjectsCount > 0 && (
                <span className="text-[10px] bg-orange-200 dark:bg-orange-900/80 text-orange-800 dark:text-orange-200 px-1.5 py-0.2 rounded font-semibold">
                  {metrics.retakeSubjectsCount} refazer
                </span>
              )}
            </div>
            <div className="mt-1 flex items-baseline gap-1">
              <span className="text-xl font-extrabold text-red-600 dark:text-red-400">
                {metrics.lockedSubjectsCount}
              </span>
              <span className="text-xs text-red-700/80 dark:text-red-400/80">bloqueadas</span>
            </div>
            <div className="text-[11px] text-red-600/80 dark:text-red-400/80 mt-0.5">
              Pré-requisitos pendentes
            </div>
          </div>

          {/* Card 5: Previsão de Formatura / Caminho Crítico */}
          <div className="col-span-2 md:col-span-4 lg:col-span-1 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 flex flex-col justify-between">
            <div className="flex items-center justify-between text-xs font-medium text-slate-500 dark:text-slate-400">
              <span className="flex items-center gap-1.5">
                <Hourglass className="w-3.5 h-3.5 text-blue-500" />
                Tempo p/ Conclusão
              </span>
              <span className="text-[10px] text-slate-400 font-medium">Caminho Crítico</span>
            </div>
            <div className="mt-1 flex items-baseline gap-1">
              <span className="text-xl font-extrabold text-blue-600 dark:text-blue-400">
                {metrics.estimatedSemestersRemaining === 0 ? 'Concluído 🎉' : `~${metrics.estimatedSemestersRemaining} sem.`}
              </span>
            </div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 truncate">
              {metrics.estimatedSemestersRemaining === 0 
                ? 'Todas as 3.200h cumpridas!' 
                : `Maior cadeia: ${metrics.criticalPathSubjects.length} matérias`}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
