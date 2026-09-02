import React from 'react';
import { SubjectCard } from './SubjectCard';
import { Subject } from '../../types/academic';
import { useAcademicStore } from '../../store/useAcademicStore';

interface SemesterColumnProps {
  semesterNumber: number;
  subjects: Subject[];
}

export const SemesterColumn: React.FC<SemesterColumnProps> = ({ semesterNumber, subjects }) => {
  const { subjectStates } = useAcademicStore();

  const totalHours = subjects.reduce((sum, s) => sum + s.workloadHours, 0);
  const approvedCount = subjects.filter((s) => subjectStates[s.id]?.status === 'APPROVED').length;
  const isAllApproved = approvedCount === subjects.length && subjects.length > 0;
  const isOdd = semesterNumber % 2 !== 0;

  return (
    <div className="flex flex-col w-[260px] shrink-0 bg-slate-100/70 dark:bg-slate-900/40 rounded-2xl p-3 border border-slate-200/80 dark:border-slate-800/80 transition-colors">
      
      {/* Column Header */}
      <div className="sticky top-0 z-20 pb-3 mb-1 border-b border-slate-200/80 dark:border-slate-800/80 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-1.5">
            <span className="font-extrabold text-sm text-slate-800 dark:text-white">
              {semesterNumber}º Semestre
            </span>
            <span className={`text-[10px] font-semibold px-1.5 py-0.2 rounded-full ${
              isOdd 
                ? 'bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300' 
                : 'bg-indigo-100 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300'
            }`}>
              {isOdd ? 'Ímpar' : 'Par'}
            </span>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
            {totalHours}h totais • {approvedCount}/{subjects.length} concluídas
          </p>
        </div>

        {/* Status Pill for the whole semester */}
        {isAllApproved && (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
            100% OK
          </span>
        )}
      </div>

      {/* Cards List */}
      <div className="flex flex-col gap-3 pt-2">
        {subjects.map((subject) => (
          <SubjectCard key={subject.id} subject={subject} />
        ))}
      </div>

    </div>
  );
};
