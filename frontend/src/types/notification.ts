export interface Notification {
  id: number
  user_id: number
  title?: string
  message: string
  is_read: boolean
  created_at: string
}

export interface WebSocketNotification {
  type: 'notification'
  message: string
}
