<template>
  <div class="chat-settings">
    <h3>💬 Chat Settings</h3>
    
    <div class="settings-section">
      <h4>Notifications</h4>
      <label class="setting-item">
        <input type="checkbox" v-model="settings.notifications" @change="saveSettings">
        <span>Enable message notifications</span>
      </label>
      
      <label class="setting-item">
        <input type="checkbox" v-model="settings.soundAlerts" @change="saveSettings">
        <span>Play sound for new messages</span>
      </label>
    </div>

    <div class="settings-section">
      <h4>Display</h4>
      <label class="setting-item">
        <input type="checkbox" v-model="settings.showTimestamps" @change="saveSettings">
        <span>Show message timestamps</span>
      </label>
      
      <label class="setting-item">
        <input type="checkbox" v-model="settings.compactMode" @change="saveSettings">
        <span>Compact message display</span>
      </label>
    </div>

    <div class="settings-section">
      <h4>Privacy</h4>
      <label class="setting-item">
        <input type="checkbox" v-model="settings.readReceipts" @change="saveSettings">
        <span>Send read receipts</span>
      </label>
      
      <label class="setting-item">
        <input type="checkbox" v-model="settings.typingIndicator" @change="saveSettings">
        <span>Show when typing</span>
      </label>
    </div>

    <div class="settings-info">
      <p>Chat data is stored locally on Gun.js P2P network</p>
      <p>No central server - your data stays with you</p>
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

interface ChatSettings {
  notifications: boolean
  soundAlerts: boolean
  showTimestamps: boolean
  compactMode: boolean
  readReceipts: boolean
  typingIndicator: boolean
}

const settings = ref<ChatSettings>({
  notifications: true,
  soundAlerts: false,
  showTimestamps: true,
  compactMode: false,
  readReceipts: true,
  typingIndicator: true
})

const userSettingsRef = props.gun.user().get('chat-settings')

const loadSettings = () => {
  userSettingsRef.once((data: any) => {
    if (data) {
      settings.value = { ...settings.value, ...data }
    }
  })
}

const saveSettings = () => {
  userSettingsRef.put(settings.value)
}

onMounted(() => {
  loadSettings()
})
</script>

<style scoped>
.chat-settings {
  padding: 1.5rem;
  max-width: 600px;
}

.chat-settings h3 {
  margin: 0 0 1.5rem 0;
  font-size: 1.5rem;
}

.settings-section {
  margin-bottom: 2rem;
}

.settings-section h4 {
  margin: 0 0 1rem 0;
  font-size: 1.1rem;
  color: var(--color-heading);
}

.setting-item {
  display: flex;
  align-items: center;
  margin-bottom: 0.75rem;
  cursor: pointer;
}

.setting-item input[type="checkbox"] {
  margin-right: 0.75rem;
  cursor: pointer;
}

.setting-item span {
  user-select: none;
}

.settings-info {
  margin-top: 2rem;
  padding: 1rem;
  background: var(--color-background-soft);
  border-radius: 4px;
  font-size: 0.9rem;
  color: var(--color-text-secondary);
}

.settings-info p {
  margin: 0.5rem 0;
}
</style>