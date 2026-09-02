import React from 'react';
import { AcademicProvider } from './store/useAcademicStore';
import { Navbar } from './components/header/Navbar';
import { MetricsBar } from './components/header/MetricsBar';
import { FiltersBar } from './components/header/FiltersBar';
import { CurriculumGraph } from './components/graph/CurriculumGraph';
import { ImpactDrawer } from './components/drawer/ImpactDrawer';
import { OnboardingModal } from './components/modals/OnboardingModal';
import { SubjectDetailsModal } from './components/modals/SubjectDetailsModal';
import { ExportPlanModal } from './components/modals/ExportPlanModal';

export const AppContent: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      {/* Top Header Controls */}
      <Navbar />
      <MetricsBar />
      <FiltersBar />

      {/* Main Interactive Graph Canvas */}
      <main className="flex-1 flex flex-col relative overflow-hidden">
        <CurriculumGraph />
      </main>

      {/* Slide-over Drawer for Immediate Domino Impact */}
      <ImpactDrawer />

      {/* Modals */}
      <OnboardingModal />
      <SubjectDetailsModal />
      <ExportPlanModal />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <AcademicProvider>
      <AppContent />
    </AcademicProvider>
  );
};

export default App;
