import React from 'react';
import { 
  Search, 
  X, 
  Filter, 
  HelpCircle,
  CheckCircle2,
  PlusCircle,
  Lock,
  AlertCircle
} from 'lucide-react';
import { useAcademicStore } from '../../store/useAcademicStore';
import { KNOWLEDGE_AREAS } from '../../data/curriculumPPC2023';
import { KnowledgeArea, StatusFilter, SeasonalityFilter } from '../../types/academic';

export const FiltersBar: React.FC = () => {
  const {
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    areaFilter,
    setAreaFilter,
    seasonalityFilter,
    setSeasonalityFilter,
  } = useAcademicStore();

  const areasList = Object.keys(KNOWLEDGE_AREAS) as KnowledgeArea[];

  return (
    <div className="w-full bg-slate-50/90 dark:bg-slate-900/60 border-b border-slate-200 dark:border-slate-800 py-3 px-4 sm:px-6 lg:px-8 transition-colors">
      <div className="max-w-7xl mx-auto flex flex-col gap-3">
        
        {/* Top row: Search input + Status Filters + Seasonality Filter */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          
          {/* Search Bar */}
          <div className="relative min-w-[220px] max-w-sm flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar por nome ou código (ex: COM201, Cálculo)..."
              className="w-full pl-9 pr-8 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Status Filter Buttons */}
          <div className="flex items-center gap-1 bg-white dark:bg-slate-800 p-1 rounded-lg border border-slate-200 dark:border-slate-700 text-xs">
            <span className="text-[11px] font-medium text-slate-400 px-2 flex items-center gap-1">
              <Filter className="w-3 h-3" />
              Status:
            </span>
            <button
              onClick={() => setStatusFilter('ALL')}
              className={`px-2.5 py-1 rounded-md transition font-medium ${
                statusFilter === 'ALL'
                  ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
              }`}
            >
              Todas
            </button>
            <button
              onClick={() => setStatusFilter('APPROVED')}
              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md transition font-medium ${
                statusFilter === 'APPROVED'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-emerald-700 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/40'
              }`}
            >
              <CheckCircle2 className="w-3 h-3" />
              Aprovadas
            </button>
            <button
              onClick={() => setStatusFilter('AVAILABLE')}
              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md transition font-medium ${
                statusFilter === 'AVAILABLE'
                  ? 'bg-amber-500 text-white shadow-xs'
                  : 'text-amber-700 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/40'
              }`}
            >
              <PlusCircle className="w-3 h-3" />
              Liberadas
            </button>
            <button
              onClick={() => setStatusFilter('LOCKED')}
              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md transition font-medium ${
                statusFilter === 'LOCKED'
                  ? 'bg-red-600 text-white shadow-xs'
                  : 'text-red-700 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40'
              }`}
            >
              <Lock className="w-3 h-3" />
              Bloqueadas
            </button>
          </div>

          {/* Seasonality (Semestres Ímpares / Pares) */}
          <div className="flex items-center gap-1 bg-white dark:bg-slate-800 p-1 rounded-lg border border-slate-200 dark:border-slate-700 text-xs">
            <span className="text-[11px] font-medium text-slate-400 px-2">Oferta:</span>
            {(['ALL', 'ODD', 'EVEN'] as SeasonalityFilter[]).map((mode) => {
              const label = mode === 'ALL' ? 'Todos' : mode === 'ODD' ? 'Ímpares' : 'Pares';
              return (
                <button
                  key={mode}
                  onClick={() => setSeasonalityFilter(mode)}
                  className={`px-2.5 py-1 rounded-md transition font-medium ${
                    seasonalityFilter === mode
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Bottom row: Knowledge Area pills + Semaphoric Legend */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-1 border-t border-slate-200/60 dark:border-slate-800/60">
          
          {/* Knowledge Area Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto py-1 scrollbar-none max-w-full">
            <span className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider whitespace-nowrap mr-1">
              Trilhas:
            </span>
            <button
              onClick={() => setAreaFilter('ALL')}
              className={`px-2.5 py-0.5 rounded-full text-xs font-medium whitespace-nowrap border transition ${
                areaFilter === 'ALL'
                  ? 'bg-slate-800 text-white border-slate-800 dark:bg-white dark:text-slate-900 dark:border-white'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-slate-400'
              }`}
            >
              Todas
            </button>
            {areasList.map((areaKey) => {
              const area = KNOWLEDGE_AREAS[areaKey];
              const isSelected = areaFilter === areaKey;
              return (
                <button
                  key={areaKey}
                  onClick={() => setAreaFilter(isSelected ? 'ALL' : areaKey)}
                  className={`px-2.5 py-0.5 rounded-full text-xs font-medium whitespace-nowrap border transition ${
                    isSelected
                      ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                      : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-slate-400'
                  }`}
                >
                  {area.label}
                </button>
              );
            })}
          </div>

          {/* Semaphoric Fixed Legend (Solução para os 40% de atrito nos testes) */}
          <div className="flex items-center gap-3 text-[11px] text-slate-600 dark:text-slate-300 bg-white/80 dark:bg-slate-800/80 px-3 py-1 rounded-lg border border-slate-200 dark:border-slate-700">
            <span className="font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider text-[10px] flex items-center gap-1">
              <HelpCircle className="w-3 h-3 text-blue-500" />
              Legenda:
            </span>
            <div className="flex items-center gap-1.5" title="Disciplina concluída e aprovada no histórico">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block ring-2 ring-emerald-500/20" />
              <span className="font-medium">Aprovado</span>
            </div>
            <div 
              className="flex items-center gap-1.5 bg-amber-50 dark:bg-amber-950/40 px-1.5 py-0.5 rounded border border-amber-200 dark:border-amber-800/50" 
              title="Atenção: Pré-requisitos cumpridos! Matéria livre para ser cursada no próximo semestre."
            >
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block ring-2 ring-amber-500/30 animate-pulse" />
              <span className="font-bold text-amber-700 dark:text-amber-300">Liberado (Pronto)</span>
            </div>
            <div className="flex items-center gap-1.5" title="Possui pré-requisito pendente. Não pode matricular ainda.">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500 inline-block ring-2 ring-red-500/20" />
              <span className="font-medium">Bloqueado</span>
            </div>
            <div className="flex items-center gap-1.5" title="Matéria que foi reprovada e deve ser recursada">
              <span className="w-2.5 h-2.5 rounded-full bg-orange-500 inline-block" />
              <span className="font-medium">Refazer</span>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
