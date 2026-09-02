import React from 'react';
import { 
  X, 
  Printer, 
  FileDown, 
  CheckCircle2, 
  Clock, 
  Award, 
  GraduationCap
} from 'lucide-react';
import { useAcademicStore } from '../../store/useAcademicStore';
import { PPC_2023_SUBJECTS } from '../../data/curriculumPPC2023';

export const ExportPlanModal: React.FC = () => {
  const { exportModalOpen, setExportModalOpen, subjectStates, metrics } = useAcademicStore();

  if (!exportModalOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const currentDate = new Date().toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Modal Controls Header (Hidden on Print) */}
        <div className="no-print p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-850 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileDown className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">
              Exportação do Plano de Trajetória Acadêmica
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-500/20 active:scale-95 transition"
            >
              <Printer className="w-4 h-4" />
              Imprimir / Salvar em PDF
            </button>
            <button
              onClick={() => setExportModalOpen(false)}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Document Area */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6 text-slate-900 bg-white">
          
          {/* Institutional Header */}
          <div className="border-b-2 border-slate-800 pb-4 text-center space-y-1">
            <p className="text-[11px] font-bold uppercase tracking-widest text-slate-600">
              Governo do Estado de Mato Grosso • Universidade do Estado de Mato Grosso (UNEMAT)
            </p>
            <p className="text-xs font-bold uppercase text-slate-800">
              Campus Universitário Jane Vanini — Cáceres - MT
            </p>
            <h1 className="text-base sm:text-lg font-black uppercase text-blue-900 pt-1">
              Bacharelado em Ciência da Computação — PPC 2023
            </h1>
            <p className="text-xs font-semibold text-slate-600">
              Relatório de Simulação Estratégica de Trajetória Acadêmica (InsightAcademic)
            </p>
            <p className="text-[10px] text-slate-500 pt-1">
              Documento gerado em: <strong>{currentDate}</strong>
            </p>
          </div>

          {/* Academic Indicators Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs">
            <div>
              <span className="text-[10px] font-bold uppercase text-slate-500">Integralização</span>
              <p className="text-lg font-black text-blue-700">{metrics.progressPercentage}%</p>
              <span className="text-[10px] text-slate-500">{metrics.approvedSubjectsCount} de {metrics.totalSubjects} disciplinas</span>
            </div>

            <div>
              <span className="text-[10px] font-bold uppercase text-slate-500">Carga Horária</span>
              <p className="text-lg font-black text-slate-800">{metrics.approvedHours}h</p>
              <span className="text-[10px] text-slate-500">de {metrics.totalHours}h totais</span>
            </div>

            <div>
              <span className="text-[10px] font-bold uppercase text-slate-500">Prontas p/ Matrícula</span>
              <p className="text-lg font-black text-amber-600">{metrics.availableSubjectsCount}</p>
              <span className="text-[10px] text-slate-500">disciplinas liberadas</span>
            </div>

            <div>
              <span className="text-[10px] font-bold uppercase text-slate-500">Previsão Restante</span>
              <p className="text-lg font-black text-slate-800">
                {metrics.estimatedSemestersRemaining === 0 ? 'Concluído' : `~${metrics.estimatedSemestersRemaining} semestres`}
              </p>
              <span className="text-[10px] text-slate-500">via Caminho Crítico</span>
            </div>
          </div>

          {/* Detailed Course Table by Semesters */}
          <div className="space-y-4">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-800 border-b pb-1">
              Quadro de Disciplinas e Situação Simulada
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse border border-slate-300">
                <thead>
                  <tr className="bg-slate-100 text-slate-800 border-b border-slate-300">
                    <th className="p-2 border border-slate-300 font-bold">Sem.</th>
                    <th className="p-2 border border-slate-300 font-bold">Código</th>
                    <th className="p-2 border border-slate-300 font-bold">Disciplina</th>
                    <th className="p-2 border border-slate-300 font-bold text-center">CH</th>
                    <th className="p-2 border border-slate-300 font-bold text-center">Teto Faltas</th>
                    <th className="p-2 border border-slate-300 font-bold">Pré-requisitos</th>
                    <th className="p-2 border border-slate-300 font-bold text-center">Situação</th>
                  </tr>
                </thead>
                <tbody>
                  {PPC_2023_SUBJECTS.map((subj) => {
                    const status = subjectStates[subj.id]?.status || 'LOCKED';
                    let statusBadge = (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-100 text-red-800">
                        Bloqueada
                      </span>
                    );

                    if (status === 'APPROVED') {
                      statusBadge = (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                          Aprovada
                        </span>
                      );
                    } else if (status === 'AVAILABLE') {
                      statusBadge = (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300">
                          Liberada
                        </span>
                      );
                    } else if (status === 'RETAKE') {
                      statusBadge = (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-orange-100 text-orange-800">
                          Refazer
                        </span>
                      );
                    }

                    return (
                      <tr key={subj.id} className="border-b border-slate-200 hover:bg-slate-50/60">
                        <td className="p-2 border border-slate-300 font-bold text-center">{subj.semester}º</td>
                        <td className="p-2 border border-slate-300 font-mono font-semibold">{subj.code}</td>
                        <td className="p-2 border border-slate-300 font-medium text-slate-900">{subj.name}</td>
                        <td className="p-2 border border-slate-300 text-center">{subj.workloadHours}h</td>
                        <td className="p-2 border border-slate-300 text-center text-slate-600">{subj.maxAbsencesHours}h</td>
                        <td className="p-2 border border-slate-300 font-mono text-[11px] text-slate-600">
                          {subj.prerequisites.length > 0 ? subj.prerequisites.join(', ') : 'Nenhum'}
                        </td>
                        <td className="p-2 border border-slate-300 text-center">{statusBadge}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Legal / Institutional Footer */}
          <div className="pt-6 border-t border-slate-300 text-[10px] text-slate-500 space-y-1">
            <p>
              * Documento consultivo emitido para planejamento de rematrícula e simulação de dependências curriculares.
            </p>
            <p>
              Em conformidade com o Projeto Pedagógico do Curso de Ciência da Computação (PPC 2023) — UNEMAT Campus Universitário Jane Vanini.
            </p>
          </div>

        </div>

        {/* Modal Bottom Actions (Hidden on Print) */}
        <div className="no-print p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-850 flex justify-end gap-2">
          <button
            onClick={() => setExportModalOpen(false)}
            className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            Fechar
          </button>
          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-500/20 active:scale-95 transition"
          >
            <Printer className="w-4 h-4" />
            Imprimir / Salvar em PDF
          </button>
        </div>

      </div>
    </div>
  );
};
