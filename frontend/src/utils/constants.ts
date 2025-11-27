export const INDEXEDDB_NAME = 'smart-assistant-db';
export const INDEXEDDB_VERSION = 1;

export const STORES = {
  TASKS: 'tasks',
  NOTES: 'notes',
  CALENDAR: 'calendar_events',
  TIMERS: 'timers',
  NOTIFICATIONS: 'notifications',
  CHAT_HISTORY: 'chat_history',
} as const;
