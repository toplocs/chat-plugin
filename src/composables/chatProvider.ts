import { ref, Ref } from 'vue'
import type { ChatRoom, ChatMessage } from '../types/chat'

export function useChatProvider(gun: any, space: string) {
  const rooms = ref<ChatRoom[]>([])
  const messages = ref<ChatMessage[]>([])
  const selectedRoom = ref<ChatRoom | null>(null)
  
  // Gun references
  const chatRoomsRef = gun.get('chat-rooms').get(space)
  const chatMessagesRef = gun.get('chat-messages')
  
  // Active listeners for cleanup
  const listeners: any[] = []

  // Load all chat rooms
  const loadRooms = () => {
    const listener = chatRoomsRef.map().on((room: any, id: string) => {
      if (!room || room === null) return
      
      const existingIndex = rooms.value.findIndex(r => r.id === id)
      const roomData: ChatRoom = {
        id,
        name: room.name || 'Unnamed Room',
        description: room.description || '',
        createdBy: room.createdBy,
        createdAt: room.createdAt || Date.now(),
        space: room.space || space,
        memberCount: room.memberCount || 0,
        lastMessage: room.lastMessage
      }
      
      if (existingIndex >= 0) {
        rooms.value[existingIndex] = roomData
      } else {
        rooms.value.push(roomData)
      }
      
      // Sort by last activity
      rooms.value.sort((a, b) => {
        const aTime = a.lastMessage?.timestamp || a.createdAt
        const bTime = b.lastMessage?.timestamp || b.createdAt
        return bTime - aTime
      })
    })
    
    listeners.push(listener)
  }

  // Load messages for a specific room
  const loadMessages = (roomId: string) => {
    // Clear previous messages
    messages.value = []
    
    // Clean up previous message listener
    if (listeners.length > 1) {
      const messageListener = listeners.pop()
      if (messageListener) messageListener.off()
    }
    
    const listener = chatMessagesRef.get(roomId).map().on((msg: any, id: string) => {
      if (!msg || msg === null) return
      
      const messageData: ChatMessage = {
        id,
        roomId,
        text: msg.text,
        user: msg.user,
        timestamp: msg.timestamp || Date.now(),
        edited: msg.edited,
        editedAt: msg.editedAt
      }
      
      const existingIndex = messages.value.findIndex(m => m.id === id)
      if (existingIndex >= 0) {
        messages.value[existingIndex] = messageData
      } else {
        messages.value.push(messageData)
      }
      
      // Sort by timestamp
      messages.value.sort((a, b) => a.timestamp - b.timestamp)
    })
    
    listeners.push(listener)
  }

  // Create a new chat room
  const createChatRoom = async (roomData: Partial<ChatRoom>) => {
    const roomId = Gun.node.Soul.uuid()
    const room = {
      name: roomData.name,
      description: roomData.description || '',
      createdBy: roomData.createdBy,
      createdAt: Date.now(),
      space: roomData.space || space,
      memberCount: 1
    }
    
    chatRoomsRef.get(roomId).put(room)
    
    // Auto-join the created room
    await joinRoom(roomId)
    
    return roomId
  }

  // Send a message
  const sendChatMessage = async (roomId: string, message: Partial<ChatMessage>) => {
    const messageId = Gun.node.Soul.uuid()
    const messageData = {
      text: message.text,
      user: message.user,
      timestamp: Date.now()
    }
    
    // Save message
    chatMessagesRef.get(roomId).get(messageId).put(messageData)
    
    // Update room's last message
    chatRoomsRef.get(roomId).put({
      lastMessage: {
        text: message.text,
        timestamp: messageData.timestamp,
        user: message.user
      }
    })
  }

  // Join a room (increment member count)
  const joinRoom = async (roomId: string) => {
    const room = await new Promise<any>((resolve) => {
      chatRoomsRef.get(roomId).once((data: any) => resolve(data))
    })
    
    if (room) {
      chatRoomsRef.get(roomId).put({
        memberCount: (room.memberCount || 0) + 1
      })
    }
  }

  // Leave a room (decrement member count)
  const leaveRoom = async (roomId: string) => {
    const room = await new Promise<any>((resolve) => {
      chatRoomsRef.get(roomId).once((data: any) => resolve(data))
    })
    
    if (room && room.memberCount > 0) {
      chatRoomsRef.get(roomId).put({
        memberCount: room.memberCount - 1
      })
    }
  }

  // Edit a message
  const editMessage = async (roomId: string, messageId: string, newText: string) => {
    chatMessagesRef.get(roomId).get(messageId).put({
      edited: true,
      editedAt: Date.now(),
      text: newText
    })
  }

  // Delete a message (mark as deleted)
  const deleteMessage = async (roomId: string, messageId: string) => {
    chatMessagesRef.get(roomId).get(messageId).put({
      deleted: true,
      deletedAt: Date.now(),
      text: '[Message deleted]'
    })
  }

  // Select a room
  const selectRoom = (room: ChatRoom | null) => {
    selectedRoom.value = room
  }

  // Cleanup listeners
  const cleanup = () => {
    listeners.forEach(listener => listener.off())
    listeners.length = 0
  }

  return {
    rooms,
    messages,
    selectedRoom,
    loadRooms,
    loadMessages,
    createChatRoom,
    sendChatMessage,
    joinRoom,
    leaveRoom,
    editMessage,
    deleteMessage,
    selectRoom,
    cleanup
  }
}