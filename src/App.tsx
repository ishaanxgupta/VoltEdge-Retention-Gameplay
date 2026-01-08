import { useState } from 'react';
import Sidebar from './components/layout/Sidebar';
import Header from './components/layout/Header';
import ExecutiveOverview from './pages/ExecutiveOverview';
import RetentionFunnel from './pages/RetentionFunnel';
import CohortAnalysis from './pages/CohortAnalysis';
import SegmentPerformance from './pages/SegmentPerformance';
import EngagementChurn from './pages/EngagementChurn';
import ActionableInsights from './pages/ActionableInsights';

interface Page {
  id: string;
  name: string;
  component: React.ComponentType;
}

const pages: Page[] = [
  { id: 'overview', name: 'Executive Overview', component: ExecutiveOverview },
  { id: 'funnel', name: 'Retention Funnel', component: RetentionFunnel },
  { id: 'cohort', name: 'Cohort Analysis', component: CohortAnalysis },
  { id: 'segments', name: 'Segment Performance', component: SegmentPerformance },
  { id: 'engagement', name: 'Engagement & Churn', component: EngagementChurn },
  { id: 'insights', name: 'Actionable Insights', component: ActionableInsights },
];

function App() {
  const [activePage, setActivePage] = useState<string>('overview');
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(false);

  const ActiveComponent = pages.find(p => p.id === activePage)?.component || ExecutiveOverview;

  return (
    <div className="flex min-h-screen bg-slate-950">
      {/* Sidebar Navigation */}
      <Sidebar 
        pages={pages}
        activePage={activePage}
        onPageChange={setActivePage}
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
      />
      
      {/* Main Content Area */}
      <div className={`flex-1 transition-all duration-300 ${sidebarCollapsed ? 'ml-20' : 'ml-64'}`}>
        <Header 
          title={pages.find(p => p.id === activePage)?.name || 'Dashboard'}
        />
        
        <main className="p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            <ActiveComponent />
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;



