export interface User {
  pub: string
  alias: string
  avatar?: string
}

export interface ChatMessage {
  id: string
  roomId: string
  text: string
  user: User
  timestamp: number
  edited?: boolean
  editedAt?: number
  deleted?: boolean
  deletedAt?: number
}

export interface ChatRoom {
  id: string
  name: string
  description?: string
  createdBy: string
  createdAt: number
  space: string
  memberCount?: number
  lastMessage?: {
    text: string
    timestamp: number
    user: User
  }
  private?: boolean
  members?: string[] // For private rooms
}