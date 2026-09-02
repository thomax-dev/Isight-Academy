import React, { useRef } from 'react';
import { SemesterColumn } from './SemesterColumn';
import { GraphConnections } from './GraphConnections';
import { PPC_2023_SUBJECTS } from '../../data/curriculumPPC2023';

export const CurriculumGraph: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  // Group subjects by semester (1 to 8)
  const semesters = [1, 2, 3, 4, 5, 6, 7, 8].map((semNum) => {
    return {
      number: semNum,
      subjects: PPC_2023_SUBJECTS.filter((s) => s.semester === semNum),
    };
  });

  return (
    <div className="relative w-full flex-1 overflow-hidden bg-slate-50 dark:bg-slate-950 transition-colors">
      
      {/* Scrollable Curriculum Board */}
      <div 
        ref={containerRef}
        className="relative w-full h-full overflow-x-auto overflow-y-auto p-4 sm:p-6 lg:p-8 select-none"
      >
        {/* Dynamic SVG Connections Overlay */}
        <GraphConnections containerRef={containerRef} />

        {/* 8 Columns Grid Container */}
        <div className="relative z-20 flex gap-4 min-w-max pb-12">
          {semesters.map((sem) => (
            <SemesterColumn
              key={sem.number}
              semesterNumber={sem.number}
              subjects={sem.subjects}
            />
          ))}
        </div>
      </div>

    </div>
  );
};
