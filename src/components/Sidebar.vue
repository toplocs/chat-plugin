<template>
  <div class="chat-sidebar-widget">
    <h4>💬 Recent Chats</h4>
    
    <div v-if="recentChats.length === 0" class="no-chats">
      <p>No recent chats</p>
      <button @click="$emit('openChat')" class="btn-start-chat">
        Start chatting
      </button>
    </div>
    
    <div v-else class="recent-chats">
      <div 
        v-for="chat in recentChats" 
        :key="chat.roomId"
        @click="$emit('openChat', chat.roomId)"
        class="recent-chat-item"
      >
        <div class="chat-info">
          <div class="chat-name">{{ chat.roomName }}</div>
          <div class="last-message">{{ chat.lastMessage }}</div>
        </div>
        <div class="chat-time">{{ formatTime(chat.timestamp) }}</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

const props = defineProps<{
  gun: any
  user: any
  space: string
}>()

const emit = defineEmits<{
  openChat: [roomId?: string]
}>()

interface RecentChat {
  roomId: string
  roomName: string
  lastMessage: string
  timestamp: number
}

const recentChats = ref<RecentChat[]>([])

const formatTime = (timestamp: number) => {
  const date = new Date(timestamp)
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  
  if (diff < 60000) return 'now'
  if (diff < 3600000) return `${Math.floor(diff / 60000)}m`
  if (diff < 86400000) return `${Math.floor(diff / 3600000)}h`
  return date.toLocaleDateString()
}

const loadRecentChats = () => {
  // Load user's recent chats from Gun
  props.gun.user().get('recent-chats').map().on((chat: any, id: string) => {
    if (!chat || chat === null) return
    
    const existingIndex = recentChats.value.findIndex(c => c.roomId === id)
    const chatData: RecentChat = {
      roomId: id,
      roomName: chat.roomName || 'Unnamed',
      lastMessage: chat.lastMessage || '',
      timestamp: chat.timestamp || Date.now()
    }
    
    if (existingIndex >= 0) {
      recentChats.value[existingIndex] = chatData
    } else {
      recentChats.value.push(chatData)
    }
    
    // Sort by timestamp
    recentChats.value.sort((a, b) => b.timestamp - a.timestamp)
    
    // Keep only 5 most recent
    recentChats.value = recentChats.value.slice(0, 5)
  })
}

onMounted(() => {
  loadRecentChats()
})
</script>

<style scoped>
.chat-sidebar-widget {
  padding: 1rem;
}

.chat-sidebar-widget h4 {
  margin: 0 0 1rem 0;
  font-size: 1.1rem;
}

.no-chats {
  text-align: center;
  padding: 1rem;
  color: var(--color-text-secondary);
}

.no-chats p {
  margin-bottom: 1rem;
}

.btn-start-chat {
  background: var(--color-primary);
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
}

.btn-start-chat:hover {
  background: var(--color-primary-hover);
}

.recent-chats {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.recent-chat-item {
  display: flex;
  justify-content: space-between;
  padding: 0.75rem;
  background: var(--color-background-soft);
  border-radius: 4px;
  cursor: pointer;
  transition: background 0.2s;
}

.recent-chat-item:hover {
  background: var(--color-background-mute);
}

.chat-info {
  flex: 1;
  min-width: 0;
}

.chat-name {
  font-weight: 500;
  margin-bottom: 0.25rem;
}

.last-message {
  font-size: 0.85rem;
  color: var(--color-text-secondary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.chat-time {
  font-size: 0.8rem;
  color: var(--color-text-secondary);
}
</style>