import { useMemo, useState } from 'react';
import { useMonthAttendance } from '@/hooks/useMonthAttendance';
import { buildMonthGrid, getDateStatus, type CalendarCell } from '@/lib/calendar';
import { todayISO } from '@/lib/date';
import type { AttendanceRecord, DateAttendanceStatus } from '@/types';

interface CalendarGridProps {
  selectedDate: string | null;
  onSelectDate: (dateISO: string) => void;
}

const MONTH_LABELS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

const WEEKDAY_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const dotClasses: Record<Exclude<DateAttendanceStatus, 'none'>, string> = {
  'all-present': 'bg-good',
  'all-absent': 'bg-critical',
  mixed: 'bg-warning',
};

export function CalendarGrid({ selectedDate, onSelectDate }: CalendarGridProps) {
  const today = todayISO();
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth()); // 0-indexed

  const records = useMonthAttendance(year, month);
  const cells = useMemo(() => buildMonthGrid(year, month, today), [year, month, today]);

  // Group records by date once per fetch, not once per cell — O(n) instead
  // of O(cells * records).
  const recordsByDate = useMemo(() => {
    const map = new Map<string, AttendanceRecord[]>();
    for (const record of records ?? []) {
      const list = map.get(record.date);
      if (list) {
        list.push(record);
      } else {
        map.set(record.date, [record]);
      }
    }
    return map;
  }, [records]);

  function goToPrevMonth() {
    if (month === 0) {
      setYear((y) => y - 1);
      setMonth(11);
    } else {
      setMonth((m) => m - 1);
    }
  }

  function goToNextMonth() {
    if (month === 11) {
      setYear((y) => y + 1);
      setMonth(0);
    } else {
      setMonth((m) => m + 1);
    }
  }

  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <button
          onClick={goToPrevMonth}
          aria-label="Previous month"
          className="rounded-md p-2 text-ink-muted hover:bg-canvas-subtle hover:text-ink"
        >
          ‹
        </button>
        <span className="text-sm font-medium text-ink">
          {MONTH_LABELS[month]} {year}
        </span>
        <button
          onClick={goToNextMonth}
          aria-label="Next month"
          className="rounded-md p-2 text-ink-muted hover:bg-canvas-subtle hover:text-ink"
        >
          ›
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1">
        {WEEKDAY_LABELS.map((label) => (
          <div key={label} className="py-1 text-center text-[11px] text-ink-faint">
            {label}
          </div>
        ))}

        {cells.map((cell) => (
          <DayCell
            key={cell.dateISO}
            cell={cell}
            status={getDateStatus(recordsByDate.get(cell.dateISO) ?? [])}
            selected={cell.dateISO === selectedDate}
            onSelect={() => onSelectDate(cell.dateISO)}
          />
        ))}
      </div>
    </div>
  );
}

function DayCell({
  cell,
  status,
  selected,
  onSelect,
}: {
  cell: CalendarCell;
  status: DateAttendanceStatus;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      onClick={onSelect}
      className={`flex aspect-square flex-col items-center justify-center gap-0.5 rounded-md text-sm transition-colors ${
        selected
          ? 'bg-accent text-canvas font-medium'
          : cell.inCurrentMonth
            ? 'text-ink hover:bg-canvas-subtle'
            : 'text-ink-faint hover:bg-canvas-subtle'
      } ${cell.isToday && !selected ? 'ring-1 ring-inset ring-accent' : ''}`}
    >
      <span>{cell.day}</span>
      <span
        className={`h-1 w-1 rounded-full ${
          status === 'none' ? '' : selected ? 'bg-canvas' : dotClasses[status]
        }`}
        aria-hidden="true"
      />
    </button>
  );
}
