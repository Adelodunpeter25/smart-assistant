export interface CalendarEvent {
  id: number
  user_id: number
  title: string
  description?: string
  start_time: string
  end_time: string
  created_at: string
}

export interface CalendarEventCreate {
  title: string
  description?: string
  start_time: string
  end_time: string
}
