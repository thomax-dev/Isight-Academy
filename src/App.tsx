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
import { SidebarMenu } from './components/sidebar/SidebarMenu';

export const AppContent: React.FC = () => {
  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      {/* Menu Lateral Estratégico (% Trilhas, Maior Impacto, Sazonalidade, Fase Atual) */}
      <SidebarMenu />

      {/* Painel Principal */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        {/* Top Header Controls */}
        <Navbar />
        <MetricsBar />
        <FiltersBar />

        {/* Grafo Interativo Principal */}
        <main className="flex-1 flex flex-col relative overflow-hidden">
          <CurriculumGraph />
        </main>
      </div>

      {/* Slide-over Drawer de Impacto Imediato */}
      <ImpactDrawer />

      {/* Modais */}
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
