<template>
   <div class="flex items-end justify-end">
      <div class="flex flex-col space-y-2 text-xs max-w-xs mx-2 mb-2 order-1 items-end">
         <div>
            <span class="px-4 py-2 rounded-lg inline-block rounded-br-none bg-blue-600 text-white ">
               {{ message.text }}
            </span>
         </div>
      </div>
      <div class="order-2">
         <div class="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white text-sm font-medium">
            {{ message.user.alias.charAt(0).toUpperCase() }}
         </div>
      </div>
   </div>
</template>

<script setup lang="ts">
import type { ChatMessage } from '../types/chat';

const props = defineProps<{
   message: ChatMessage
}>();
</script>