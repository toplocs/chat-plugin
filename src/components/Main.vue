<template>
  <div class="chat-plugin">
    <div class="chat-container">
      <div class="chat-sidebar">
        <div class="chat-header">
          <h3>💬 P2P Chat</h3>
          <button @click="showCreateRoom = true" class="btn-create">
            <i class="fas fa-plus"></i> New Room
          </button>
        </div>
        
        <div class="chat-rooms">
          <div 
            v-for="room in rooms" 
            :key="room.id"
            @click="selectRoom(room)"
            :class="['chat-room-item', { active: selectedRoom?.id === room.id }]"
          >
            <div class="room-name">{{ room.name }}</div>
            <div class="room-meta">
              <span class="member-count">{{ room.memberCount || 0 }} members</span>
              <span v-if="room.lastMessage" class="last-activity">
                {{ formatTime(room.lastMessage.timestamp) }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div class="chat-main">
        <div v-if="selectedRoom" class="chat-messages-container">
          <div class="chat-room-header">
            <h3>{{ selectedRoom.name }}</h3>
            <span class="room-info">{{ selectedRoom.description }}</span>
          </div>
          
          <ChatMessages :messages="messages" :currentUser="currentUser" />
          
          <ChatPanel 
            :roomId="selectedRoom.id" 
            @sendMessage="sendMessage"
          />
        </div>
        
        <div v-else class="no-room-selected">
          <i class="fas fa-comments fa-3x"></i>
          <p>Select a chat room to start messaging</p>
        </div>
      </div>
    </div>

    <!-- Create Room Modal -->
    <div v-if="showCreateRoom" class="modal-overlay" @click.self="showCreateRoom = false">
      <div class="modal">
        <h3>Create New Chat Room</h3>
        <input 
          v-model="newRoom.name" 
          placeholder="Room name"
          class="input"
        />
        <textarea 
          v-model="newRoom.description" 
          placeholder="Room description (optional)"
          class="input"
          rows="3"
        ></textarea>
        <div class="modal-actions">
          <button @click="showCreateRoom = false" class="btn-cancel">Cancel</button>
          <button @click="createRoom" class="btn-primary">Create</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import ChatMessages from './ChatMessages.vue'
import ChatPanel from './ChatPanel.vue'
import { useChatProvider } from '../composables/chatProvider'
import type { ChatRoom, ChatMessage, User } from '../types/chat'

// Get Gun instance from plugin props
const props = defineProps<{
  gun: any
  user: any
  space: string
}>()

const { 
  rooms, 
  messages, 
  selectedRoom,
  loadRooms, 
  loadMessages, 
  createChatRoom,
  sendChatMessage,
  joinRoom,
  selectRoom: setSelectedRoom
} = useChatProvider(props.gun, props.space)

const showCreateRoom = ref(false)
const newRoom = ref({ name: '', description: '' })

// Current user from Gun
const currentUser = computed(() => ({
  pub: props.user?.is?.pub || 'anonymous',
  alias: props.user?.is?.alias || 'Anonymous'
}))

const formatTime = (timestamp: number) => {
  const date = new Date(timestamp)
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  
  if (diff < 60000) return 'just now'
  if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`
  if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`
  return date.toLocaleDateString()
}

const selectRoom = async (room: ChatRoom) => {
  setSelectedRoom(room)
  await loadMessages(room.id)
}

const sendMessage = async (text: string) => {
  if (!selectedRoom.value || !text.trim()) return
  
  await sendChatMessage(selectedRoom.value.id, {
    text: text.trim(),
    user: currentUser.value,
    timestamp: Date.now()
  })
}

const createRoom = async () => {
  if (!newRoom.value.name.trim()) return
  
  await createChatRoom({
    name: newRoom.value.name.trim(),
    description: newRoom.value.description.trim(),
    createdBy: currentUser.value.pub,
    space: props.space
  })
  
  newRoom.value = { name: '', description: '' }
  showCreateRoom.value = false
}

onMounted(() => {
  loadRooms()
})
</script>

<style scoped>
.chat-plugin {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.chat-container {
  flex: 1;
  display: flex;
  gap: 1rem;
  height: 100%;
  overflow: hidden;
}

.chat-sidebar {
  width: 300px;
  background: var(--color-background-soft);
  border-radius: 8px;
  display: flex;
  flex-direction: column;
}

.chat-header {
  padding: 1rem;
  border-bottom: 1px solid var(--color-border);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.chat-header h3 {
  margin: 0;
  font-size: 1.2rem;
}

.btn-create {
  background: var(--color-primary);
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
}

.btn-create:hover {
  background: var(--color-primary-hover);
}

.chat-rooms {
  flex: 1;
  overflow-y: auto;
  padding: 0.5rem;
}

.chat-room-item {
  padding: 0.75rem;
  margin-bottom: 0.5rem;
  border-radius: 4px;
  cursor: pointer;
  transition: background 0.2s;
}

.chat-room-item:hover {
  background: var(--color-background-mute);
}

.chat-room-item.active {
  background: var(--color-primary);
  color: white;
}

.room-name {
  font-weight: 500;
  margin-bottom: 0.25rem;
}

.room-meta {
  font-size: 0.85rem;
  opacity: 0.7;
  display: flex;
  justify-content: space-between;
}

.chat-main {
  flex: 1;
  background: var(--color-background-soft);
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.chat-messages-container {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.chat-room-header {
  padding: 1rem;
  border-bottom: 1px solid var(--color-border);
}

.chat-room-header h3 {
  margin: 0 0 0.25rem 0;
}

.room-info {
  font-size: 0.9rem;
  opacity: 0.7;
}

.no-room-selected {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  opacity: 0.5;
}

.no-room-selected i {
  margin-bottom: 1rem;
}

/* Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal {
  background: var(--color-background);
  padding: 2rem;
  border-radius: 8px;
  width: 90%;
  max-width: 500px;
}

.modal h3 {
  margin: 0 0 1rem 0;
}

.input {
  width: 100%;
  padding: 0.75rem;
  margin-bottom: 1rem;
  border: 1px solid var(--color-border);
  border-radius: 4px;
  background: var(--color-background-soft);
  color: var(--color-text);
}

.modal-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
}

.btn-cancel {
  padding: 0.5rem 1rem;
  border: 1px solid var(--color-border);
  background: transparent;
  border-radius: 4px;
  cursor: pointer;
}

.btn-primary {
  padding: 0.5rem 1rem;
  border: none;
  background: var(--color-primary);
  color: white;
  border-radius: 4px;
  cursor: pointer;
}

.btn-primary:hover {
  background: var(--color-primary-hover);
}
</style>