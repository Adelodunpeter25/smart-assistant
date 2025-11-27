export interface Note {
  id: number
  user_id: number
  content: string
  tags?: string
  created_at: string
  updated_at: string
}

export interface NoteCreate {
  content: string
  tags?: string
}

export interface NoteUpdate {
  content?: string
  tags?: string
}
