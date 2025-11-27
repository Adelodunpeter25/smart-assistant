export interface ChatRequest {
  message: string
}

export interface ChatResponse {
  response: string
  tool_used?: string
  tool_result?: {
    success: boolean
    data?: any
    error?: string
  }
}

export interface Message {
  id: string
  content: string
  isUser: boolean
  timestamp: Date
  toolUsed?: string
}
