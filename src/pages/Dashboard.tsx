import { useState } from 'react';
import { SubjectList } from '@/components/subjects';
import { CalendarPage } from './CalendarPage';

type Tab = 'subjects' | 'calendar';

export function Dashboard() {
  const [tab, setTab] = useState<Tab>('subjects');

  return (
    <div>
      <div className="mb-5 flex gap-1 rounded-md border border-border bg-canvas-subtle p-1">
        <TabButton active={tab === 'subjects'} onClick={() => setTab('subjects')}>
          Subjects
        </TabButton>
        <TabButton active={tab === 'calendar'} onClick={() => setTab('calendar')}>
          Calendar
        </TabButton>
      </div>

      {tab === 'subjects' ? <SubjectList /> : <CalendarPage />}
    </div>
  );
}

function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex-1 rounded px-3 py-1.5 text-sm transition-colors ${
        active ? 'bg-accent text-canvas font-medium' : 'text-ink-muted hover:text-ink'
      }`}
    >
      {children}
    </button>
  );
}
