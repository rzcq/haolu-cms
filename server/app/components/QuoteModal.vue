<template>
  <Teleport to="body">
    <Transition name="fade">
      <div
        v-if="showQuoteModal"
        class="fixed inset-0 z-[999] flex items-center justify-center"
        @click.self="showQuoteModal = false"
      >
        <div class="absolute inset-0 bg-black/50"></div>
        <div class="relative bg-white rounded-lg shadow-xl w-[95%] max-w-2xl max-h-[90vh] overflow-y-auto">
          <button
            class="absolute top-3 right-3 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
            @click="showQuoteModal = false"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
          <RequestAQuote />
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import RequestAQuote from '~/components/sections/RequestAQuote.vue'

const { showQuoteModal } = useQuoteModal()
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
