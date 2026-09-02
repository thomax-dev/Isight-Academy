import React, { useState } from 'react';
import { 
  Sparkles, 
  Hand, 
  Calendar, 
  ArrowRight, 
  CheckCircle2, 
  X,
  GraduationCap
} from 'lucide-react';
import { useAcademicStore } from '../../store/useAcademicStore';

export const OnboardingModal: React.FC = () => {
  const { onboardingOpen, setOnboardingOpen, applySemesterOnboarding, resetSimulation } = useAcademicStore();
  
  // Wizard step: 1 = Choice, 2 = Semester Picker
  const [step, setStep] = useState<1 | 2>(1);
  const [selectedSemester, setSelectedSemester] = useState<number>(1);

  if (!onboardingOpen) return null;

  const handleManualStart = () => {
    resetSimulation();
    setOnboardingOpen(false);
  };

  const handleConfirmSemester = () => {
    applySemesterOnboarding(selectedSemester);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col">
        
        {/* Header */}
        <div className="p-6 border-b border-slate-200 dark:border-slate-800 bg-gradient-to-r from-blue-50 to-indigo-50/50 dark:from-slate-850 dark:to-slate-900">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-blue-600 text-white shadow-md shadow-blue-500/20">
                <GraduationCap className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-lg font-extrabold text-slate-900 dark:text-white">
                  Bem-vindo ao InsightAcademic
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Simulador de Trajetória Acadêmica • UNEMAT CC PPC 2023
                </p>
              </div>
            </div>

            <button
              onClick={() => setOnboardingOpen(false)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6">
          {step === 1 ? (
            /* ETAPA 1: ESCOLHA DO MODO DE INÍCIO */
            <div className="space-y-4">
              <div className="text-center space-y-1">
                <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">
                  Como você deseja iniciar sua simulação acadêmica?
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Escolha uma forma rápida de configurar o estado atual do seu curso.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {/* Opção A: Manual */}
                <div
                  onClick={handleManualStart}
                  className="group p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/60 dark:bg-slate-800/40 hover:border-blue-500 dark:hover:border-blue-500 hover:bg-blue-50/40 dark:hover:bg-blue-950/20 cursor-pointer transition-all duration-150 flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="w-9 h-9 rounded-lg bg-blue-100 dark:bg-blue-900/60 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                      <Hand className="w-5 h-5" />
                    </div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition">
                      Marcar Manualmente
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                      Inicie com a grade limpa e selecione individualmente as matérias já aprovadas.
                    </p>
                  </div>
                  <div className="mt-4 flex items-center gap-1 text-xs font-semibold text-blue-600 dark:text-blue-400">
                    Começar do zero
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition" />
                  </div>
                </div>

                {/* Opção B: Selecionar Semestre */}
                <div
                  onClick={() => setStep(2)}
                  className="group p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/60 dark:bg-slate-800/40 hover:border-indigo-500 dark:hover:border-indigo-500 hover:bg-indigo-50/40 dark:hover:bg-indigo-950/20 cursor-pointer transition-all duration-150 flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="w-9 h-9 rounded-lg bg-indigo-100 dark:bg-indigo-900/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                      <Calendar className="w-5 h-5" />
                    </div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition">
                      Selecionar por Fase Atual
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                      Informe em qual semestre você está. As matérias anteriores serão marcadas como concluídas.
                    </p>
                  </div>
                  <div className="mt-4 flex items-center gap-1 text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                    Preencher automático
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition" />
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* ETAPA 2: SELEÇÃO DO SEMESTRE ATUAL */
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="text-center space-y-1">
                <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">
                  Em qual semestre você está matriculado atualmente?
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Semestres anteriores serão aprovados automaticamente no grafo.
                </p>
              </div>

              {/* Grid de 8 Semestres */}
              <div className="grid grid-cols-4 gap-2.5 pt-2">
                {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => {
                  const isSelected = selectedSemester === sem;
                  return (
                    <button
                      key={sem}
                      onClick={() => setSelectedSemester(sem)}
                      className={`p-3 rounded-xl border text-center font-bold text-xs transition-all ${
                        isSelected
                          ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-500/20 scale-105'
                          : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-blue-400'
                      }`}
                    >
                      <div className="text-base">{sem}º</div>
                      <div className="text-[10px] font-normal opacity-80">Semestre</div>
                    </button>
                  );
                })}
              </div>

              {/* Resumo da Ação */}
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-300 space-y-1">
                <p className="font-semibold flex items-center gap-1.5 text-slate-900 dark:text-white">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                  Ao selecionar o {selectedSemester}º Semestre:
                </p>
                <ul className="list-disc list-inside space-y-0.5 text-[11px] text-slate-500 dark:text-slate-400 pl-1">
                  {selectedSemester > 1 ? (
                    <li>Todas as matérias dos semestres 1 a {selectedSemester - 1} ficarão <strong>Aprovadas (Verde)</strong>.</li>
                  ) : (
                    <li>Semestres anteriores: nenhum (início do curso).</li>
                  )}
                  <li>As matérias do {selectedSemester}º Semestre ficarão <strong>Disponíveis para Cursar (Amarelo)</strong>.</li>
                  <li>Semestres futuros terão os pré-requisitos calculados automaticamente.</li>
                </ul>
              </div>

              {/* Botões de Ação da Etapa 2 */}
              <div className="flex items-center justify-between pt-3 border-t border-slate-200 dark:border-slate-800">
                <button
                  onClick={() => setStep(1)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition"
                >
                  Voltar
                </button>

                <button
                  onClick={handleConfirmSemester}
                  className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-500/20 active:scale-95 transition"
                >
                  Confirmar e Carregar Grafo
                </button>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
