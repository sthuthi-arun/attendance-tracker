import { useState } from 'react';
import { CalendarGrid, DayDetail } from '@/components/calendar';

export function CalendarPage() {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  return (
    <div>
      <h1 className="mb-4 text-lg font-semibold text-ink">Calendar</h1>
      <CalendarGrid selectedDate={selectedDate} onSelectDate={setSelectedDate} />

      {selectedDate && (
        <DayDetail dateISO={selectedDate} onClose={() => setSelectedDate(null)} />
      )}
    </div>
  );
}
