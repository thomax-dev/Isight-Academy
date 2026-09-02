import React from 'react';
import { 
  GraduationCap, 
  RotateCcw, 
  RefreshCw, 
  Sparkles, 
  FileDown, 
  Sun, 
  Moon, 
  Network
} from 'lucide-react';
import { useAcademicStore } from '../../store/useAcademicStore';

export const Navbar: React.FC = () => {
  const {
    isDarkMode,
    toggleDarkMode,
    canUndo,
    undo,
    resetSimulation,
    setOnboardingOpen,
    setExportModalOpen,
    showAllConnections,
    toggleShowAllConnections,
  } = useAcademicStore();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 dark:border-slate-800 bg-white/85 dark:bg-slate-900/85 backdrop-blur-md transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Left Brand */}
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/20">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold tracking-tight text-slate-900 dark:text-white">
                Insight<span className="text-blue-600 dark:text-blue-400">Academic</span>
              </h1>
              <span className="hidden md:inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 dark:bg-blue-900/60 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                PPC 2023
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 hidden sm:block">
              UNEMAT • Ciência da Computação (Cáceres - Jane Vanini)
            </p>
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2">
          {/* Onboarding Trigger */}
          <button
            onClick={() => setOnboardingOpen(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition"
            title="Alterar modo ou semestre inicial"
          >
            <Sparkles className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
            <span className="hidden sm:inline">Modo Inicial</span>
          </button>

          {/* Toggle Connections Mode */}
          <button
            onClick={toggleShowAllConnections}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition ${
              showAllConnections 
                ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/30' 
                : 'text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
            title={showAllConnections ? 'Exibindo todas as setas (modo global)' : 'Modo Foco Inteligente (exibe setas ao passar o mouse)'}
          >
            <Network className="w-3.5 h-3.5" />
            <span className="hidden lg:inline">{showAllConnections ? 'Todas Conexões' : 'Foco Inteligente'}</span>
          </button>

          {/* Undo Button */}
          <button
            onClick={undo}
            disabled={!canUndo}
            className={`p-2 text-xs font-medium rounded-lg border transition ${
              canUndo
                ? 'text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 active:scale-95'
                : 'text-slate-300 dark:text-slate-600 border-slate-100 dark:border-slate-800/50 cursor-not-allowed'
            }`}
            title="Desfazer última simulação (Undo)"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {/* Reset Simulation */}
          <button
            onClick={resetSimulation}
            className="p-2 text-xs font-medium rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition active:scale-95"
            title="Resetar Simulação"
          >
            <RefreshCw className="w-4 h-4" />
          </button>

          <div className="h-5 w-px bg-slate-200 dark:bg-slate-800 mx-1 hidden sm:block" />

          {/* Export PDF Plan */}
          <button
            onClick={() => setExportModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-blue-600 text-white hover:bg-blue-700 shadow-sm shadow-blue-500/20 active:scale-95 transition"
          >
            <FileDown className="w-3.5 h-3.5" />
            <span>Exportar Plano</span>
          </button>

          {/* Dark / Light Mode Toggle */}
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            title={isDarkMode ? 'Mudar para Modo Claro' : 'Mudar para Modo Escuro'}
          >
            {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
          </button>
        </div>
      </div>
    </header>
  );
};
