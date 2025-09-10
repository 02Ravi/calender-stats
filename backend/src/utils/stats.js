function parseEventDurationMinutes(event) {
  const start = event.start?.dateTime || event.start?.date;
  const end = event.end?.dateTime || event.end?.date;
  if (!start || !end) return 0;
  const startDate = new Date(start);
  const endDate = new Date(end);
  const ms = endDate.getTime() - startDate.getTime();
  return Math.max(0, Math.round(ms / 60000));
}

function isAllDay(event) {
  return !!event.start?.date && !event.start?.dateTime;
}

function hasGuests(event) {
  const attendees = event.attendees || [];
  // Consider guests as attendees other than the organizer
  const others = attendees.filter((a) => a.self !== true && a.responseStatus !== 'declined');
  return others.length > 0;
}

export function computeStatistics(events) {
  const filtered = events.filter((e) => !isAllDay(e));
  const totalEvents = filtered.length;

  let totalMinutes = 0;
  let guestCount = 0;
  let soloCount = 0;
  const perDay = new Map();

  for (const e of filtered) {
    const minutes = parseEventDurationMinutes(e);
    totalMinutes += minutes;

    const dayKey = new Date(e.start?.dateTime || e.start?.date)
      .toISOString()
      .slice(0, 10);
    perDay.set(dayKey, (perDay.get(dayKey) || 0) + 1);

    if (hasGuests(e)) guestCount += 1; else soloCount += 1;
  }

  const avgMeetingLength = totalEvents > 0 ? Math.round(totalMinutes / totalEvents) : 0;

  let busiestDay = null;
  let busiestCount = 0;
  for (const [day, count] of perDay.entries()) {
    if (count > busiestCount) {
      busiestCount = count;
      busiestDay = day;
    }
  }

  const percentWithGuests = totalEvents > 0 ? Math.round((guestCount / totalEvents) * 100) : 0;

  const eventsPerDay = Array.from(perDay.entries())
    .sort(([a], [b]) => (a < b ? -1 : 1))
    .map(([date, count]) => ({ date, count }));

  return {
    totalEvents,
    avgMeetingLength,
    guestCount,
    soloCount,
    busiestDay,
    busiestCount,
    percentWithGuests,
    charts: {
      eventsPerDay,
      guestVsSolo: [
        { type: 'With guests', value: guestCount },
        { type: 'Solo', value: soloCount },
      ],
    },
  };
}

