export type TimerType = 'timer' | 'alarm'
export type TimerStatus = 'active' | 'completed' | 'cancelled'

export interface Timer {
  id: number
  user_id: number
  type: TimerType
  duration_seconds?: number
  trigger_time: string
  label?: string
  status: TimerStatus
  is_notified: boolean
  created_at: string
  completed_at?: string
}

export interface TimerCreate {
  type: TimerType
  duration_seconds?: number
  trigger_time: string
  label?: string
}
