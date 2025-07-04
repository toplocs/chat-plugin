<template>
  <div ref="container" class="chat-messages">
    <div v-for="message in messages" :key="message.id">
      <ChatMessage1 v-if="message.user.pub === currentUser.pub" :message="message" />
      <ChatMessage2 v-else :message="message" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue';
import ChatMessage1 from './ChatMessage1.vue';
import ChatMessage2 from './ChatMessage2.vue';
import type { ChatMessage, User } from '../types/chat';

const props = defineProps<{
  currentUser: User
  messages: ChatMessage[]
}>();

const container = ref<HTMLElement | null>(null);

function scrollToBottom() {
  if (container.value.offsetHeight < window.innerHeight-200) return;
  setTimeout(() => {
    window.scrollTo({
      top: document.documentElement.scrollHeight,
      behavior: 'smooth'
    });
  }, 60);
};

watch(() => props.messages, () => {
  scrollToBottom();
}, { deep: true });

onMounted(() => {
  scrollToBottom();
});
</script>

<style scoped>
.chat-messages {
  flex: 1;
  overflow-y: auto;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
</style>
