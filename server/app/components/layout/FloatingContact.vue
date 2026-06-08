<template>
  <!-- 桌面端右侧浮动客服面板 -->
  <div class="hidden lg:block fixed right-[15px] z-[999] w-[130px]" :style="{ bottom: '350px' }">
    <div class="rounded-lg shadow-lg overflow-hidden bg-[#f8f9fa]">
      <!-- 时间图标 -->
      <div class="p-2 text-center">
        <img src="/images/time.avif" alt="" class="mx-auto" width="120" height="43" />
      </div>

      <!-- 客服头像 -->
      <div class="px-2">
        <img
          src="/images/whatsapp-lenka.jpg"
          :alt="'WhatsApp: ' + t('home.contact.phone')"
          class="w-full"
        />
      </div>

      <!-- 按钮组 -->
      <div class="flex flex-col gap-1.5 p-2">
        <a
          :href="whatsappUrl"
          target="_blank"
          rel="noopener"
          class="kb-button w-full text-center py-[.3em] px-[1em] text-[.9rem] rounded-[3px] no-underline transition-all duration-300"
          style="background: var(--global-palette-btn-bg, #f51f1f); color: var(--global-palette-btn, #f8f9fa)"
        >
          WhatsApp
        </a>
        <a
          href="javascript:void(0)"
          class="kb-button w-full text-center py-[.3em] px-[1em] text-[.9rem] rounded-[3px] no-underline transition-all duration-300"
          style="background: var(--global-palette-btn-bg, #f51f1f); color: var(--global-palette-btn, #f8f9fa)"
          @click="showQuoteModal = true"
        >
          Message
        </a>
        <a
          :href="'mailto:' + t('footer.email')"
          class="kb-button w-full text-center py-[.3em] px-[1em] text-[.9rem] rounded-[3px] no-underline transition-all duration-300"
          style="background: var(--global-palette-btn-bg, #f51f1f); color: var(--global-palette-btn, #f8f9fa)"
        >
          Email us
        </a>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { t } = useI18n()
const { showQuoteModal } = useQuoteModal()

const whatsappText = 'Hi, I saw your products on the website and would like to inquire about [Product Name].'

const whatsappUrl = computed(() => {
  const phone = t('home.contact.phone')
  const params = new URLSearchParams({
    phone,
    text: whatsappText,
    type: 'phone_number',
    app_absent: '0',
  })
  return `https://api.whatsapp.com/send/?${params.toString()}`
})
</script>
