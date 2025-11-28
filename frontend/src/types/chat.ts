export interface ChatRequest {
  message: string
  template?: string
}

export interface ChatResponse {
  response: string
  tool_used?: string
  tool_result?: {
    success: boolean
    data?: any
    error?: string
  }
  tool_calls?: any
}

export interface Message {
  id: string
  content: string
  isUser: boolean
  role?: string
  timestamp: Date | string
  toolUsed?: string
  tool_calls?: string[]
}
