<template>
  <!-- 桌面端右侧浮动客服面板 -->
  <div v-if="visible" class="hidden lg:block fixed right-[15px] z-[999] w-[130px]" :style="{ bottom: '350px' }">
    <div class="rounded-lg shadow-lg overflow-hidden bg-[#f8f9fa]">
      <!-- 时间图标 -->
      <div class="p-2 text-center">
        <img src="/images/time.avif" alt="" class="mx-auto" width="120" height="43" />
      </div>

      <!-- QR 码 -->
      <div class="px-3 py-2 flex justify-center">
        <template v-if="locale === 'zh'">
          <img src="/images/whatsapp-lenka.jpg" alt="微信二维码" class="w-[100px] h-[100px] object-contain" />
        </template>
        <template v-else>
          <div ref="qrContainer"></div>
        </template>
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

    <!-- 关闭按钮 -->
    <div class="flex justify-center -mt-3 relative z-10">
      <button
        class="w-6 h-6 rounded-full bg-white border border-gray-300 shadow flex items-center justify-center text-gray-500 hover:text-gray-800 hover:border-gray-500 transition-all duration-200"
        @click="visible = false"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
const { t } = await useI18nLoader()
const { showQuoteModal } = useQuoteModal()
const { locale } = useI18n()

const visible = ref(true)
const qrContainer = ref<HTMLElement | null>(null)

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

onMounted(() => {
  if (qrContainer.value && typeof QRCode !== 'undefined') {
    new QRCode(qrContainer.value, {
      text: whatsappUrl.value,
      width: 100,
      height: 100,
      colorDark: '#000000',
      colorLight: '#ffffff',
      correctLevel: QRCode.CorrectLevel.M,
    })
  }
})
</script>
