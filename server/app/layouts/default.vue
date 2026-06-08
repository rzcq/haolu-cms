<template>
  <div class="min-h-screen flex flex-col bg-gray-50">
    <NuxtLoadingIndicator :height="2" />
    <el-backtop :right="20" :bottom="70" />

    <!-- 悬浮 AI 搜索按钮 -->
    <ClientOnly>
      <nuxt-link
        v-if="!isAISearchPage"
        :to="localePath('/ai-search')"
        class="fixed right-6 bottom-40 z-50 flex items-center justify-center w-10 h-10 bg-gradient-to-r from-primary to-primary-dark text-white rounded-full shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-300 group"
        :title="t('common.aiSearch') || 'AI Search'"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-7 w-7 group-hover:rotate-12 transition-transform duration-300"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
        <span class="absolute inline-flex h-full w-full rounded-full bg-primary opacity-20 animate-ping"></span>
      </nuxt-link>
    </ClientOnly>

    <!-- 页头 -->
    <SiteHeader>
      <!-- 桌面端语言切换 -->
      <template #language-desktop>
        <div class="relative language-menu">
          <button
            class="bg-transparent flex items-center space-x-1 text-gray-600 hover:text-primary transition-colors"
            @click="showLanguageMenu = !showLanguageMenu"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
            </svg>
            <span class="text-sm font-medium">{{ currentLanguage }}</span>
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" :class="{ 'rotate-180': showLanguageMenu }" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          <div v-if="showLanguageMenu" class="absolute right-0 mt-2 w-32 bg-white rounded-md shadow-lg py-1 z-50 max-h-100 overflow-y-auto">
            <button
              v-for="lang in localesData"
              :key="lang.code"
              class="bg-transparent block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
              :class="{ 'bg-primary/10 text-primary': lang.localeCode === locale }"
              @click="switchLanguage(lang.code)"
            >
              {{ lang.name }}
            </button>
          </div>
        </div>
      </template>

      <!-- 移动端语言切换 -->
      <template #language-mobile>
        <button
          class="p-2 text-gray-600 hover:text-primary transition-colors"
          @click="showMobileLanguage = !showMobileLanguage"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
          </svg>
        </button>
      </template>
    </SiteHeader>

    <!-- 移动端语言弹出层 -->
    <div v-if="showMobileLanguage" class="lg:hidden fixed inset-0 z-[60] bg-black/30" @click="showMobileLanguage = false">
      <div class="absolute right-4 top-14 w-40 bg-white rounded-md shadow-lg py-2" @click.stop>
        <button
          v-for="lang in localesData"
          :key="lang.code"
          class="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
          :class="{ 'bg-primary/10 text-primary': lang.code === locale }"
          @click="switchLanguage(lang.code); showMobileLanguage = false"
        >
          {{ lang.name }}
        </button>
      </div>
    </div>

    <slot />

    <FloatingContact />
    <MobileBottomBar />
    <QuoteModal />

    <SiteFooter />
  </div>
</template>

<script setup>
import SiteHeader from '~/components/layout/SiteHeader.vue'
import SiteFooter from '~/components/layout/SiteFooter.vue'
import FloatingContact from '~/components/layout/FloatingContact.vue'
import MobileBottomBar from '~/components/layout/MobileBottomBar.vue'
import QuoteModal from '~/components/QuoteModal.vue'

const { locale, setLocale } = useI18n();
const localePath = useLocalePath();
const route = useRoute();

const showLanguageMenu = ref(false);
const showMobileLanguage = ref(false);

const isAISearchPage = computed(() => {
  return route.path === '/ai-search' || route.path === '/zh/ai-search' || route.path.endsWith('/ai-search');
});

const switchLanguage = langCode => {
  setLocale(langCode);
  showLanguageMenu.value = false;
};

const [{ t }, { data: localesData }] = await Promise.all([
  useI18nLoader(),
  useFetch('/api/public/i18n/list', {
    getCachedData: key => localCacheData(key),
  }),
]);

const currentLanguage = computed(() => {
  return localesData.value?.find(lang => lang.code === locale.value)?.name || 'Language';
});

onMounted(() => {
  /**
   * 处理点击事件，当点击区域不在语言菜单内时关闭语言菜单
   *
   * @param {Event} event - 点击事件对象
   */
  const handleClickOutside = event => {
    if (!event.target.closest('.language-menu')) {
      showLanguageMenu.value = false;
    }
  };
  document.addEventListener('click', handleClickOutside);
  onUnmounted(() => {
    document.removeEventListener('click', handleClickOutside);
  });
});
</script>
