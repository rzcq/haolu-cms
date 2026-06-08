<template>
  <header
    class="sticky top-0 z-50 bg-white transition-shadow duration-300"
    :class="{ 'shadow-md': isScrolled, 'shadow-sm': !isScrolled }"
  >
    <!-- ===== 桌面端 ===== -->
    <div class="hidden lg:block">
      <!-- 上行：Logo + 分类导航 + 搜索 + 语言切换 -->
      <div class="max-w-[1400px] mx-auto px-6 flex items-center justify-between h-[70px]">
        <!-- Logo -->
        <nuxt-link :to="localePath('/')" class="flex-shrink-0 flex items-center">
          <div class="w-10 h-10 bg-brand-primary rounded-md flex items-center justify-center text-white font-bold text-xl">
            N
          </div>
          <span class="ml-2 text-xl font-semibold text-gray-800">{{ t('site.name') }}</span>
        </nuxt-link>

        <!-- 分类导航 -->
        <nav class="flex items-center h-full">
          <div v-for="item in categoryList" :key="item.categoryId" class="relative group h-full flex items-center">
            <nuxt-link
              :to="categoryLink(item.categoryMpath)"
              class="nav-link relative flex items-center h-full px-[0.75em] py-[0.6em] text-[15px] text-ds-black transition-colors"
            >
              {{ item.categoryName?.[locale] || item.categoryName?.en }}
            </nuxt-link>
          </div>
        </nav>

        <!-- 搜索 + 语言 -->
        <div class="flex items-center gap-3">
          <nuxt-link
            :to="localePath('/ai-search')"
            class="p-2 text-ds-black hover:text-ds-black transition-colors"
            aria-label="Search"
          >
            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </nuxt-link>
          <!-- 语言切换占位 -->
          <slot name="language-desktop" />
        </div>
      </div>

      <!-- 下行：分类导航（红色背景） -->
      <div class="bg-ds-red">
        <div class="max-w-[1400px] mx-auto px-6 flex items-center h-[50px]">
          <nav class="flex items-center h-full">
            <div v-for="item in recommendCategoryList" :key="'b-' + item.categoryId" class="relative group h-full flex items-center">
              <nuxt-link
                :to="categoryLink(item.categoryMpath)"
                class="nav-link relative flex items-center h-full px-[0.75em] py-[0.6em] text-[15px] font-semibold text-white hover:text-white/90 transition-colors"
              >
                {{ item.categoryName?.[locale] || item.categoryName?.en }}
                <!-- <svg class="w-3 h-3 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
                </svg> -->
              </nuxt-link>
            </div>
          </nav>

          <!-- CTA 按钮（暂无链接） -->
          <div class="flex items-center gap-3 ml-auto">
            <a href="javascript:void(0)" class="bg-ds-black text-white text-sm font-bold px-4 py-1.5 rounded hover:bg-ds-blue transition-colors">Get a Quote</a>
            <a href="javascript:void(0)" class="bg-ds-black text-white text-sm font-bold px-4 py-1.5 rounded hover:bg-ds-blue transition-colors">WhatsApp:{{ t('home.contact.phone') }}</a>
          </div>
        </div>
      </div>
    </div>

    <!-- ===== 移动端 ===== -->
    <div class="lg:hidden">
      <div class="flex items-center justify-between h-14 px-4">
        <!-- Logo -->
        <nuxt-link :to="localePath('/')" class="flex-shrink-0 flex items-center">
          <div class="w-8 h-8 bg-brand-primary rounded-md flex items-center justify-center text-white font-bold text-sm">
            N
          </div>
          <span class="ml-2 text-lg font-semibold text-gray-800">{{ t('site.name') }}</span>
        </nuxt-link>

        <!-- 右侧按钮组 -->
        <div class="flex items-center gap-2">
          <!-- 语言切换占位 -->
          <slot name="language-mobile" />
          <!-- 汉堡按钮 -->
          <button
            class="p-2 text-gray-600"
            aria-label="Toggle Menu"
            @click="mobileMenuOpen = !mobileMenuOpen"
          >
            <svg v-if="!mobileMenuOpen" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
            <svg v-else class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      <!-- 移动端抽屉 -->
      <div
        v-show="mobileMenuOpen"
        class="bg-white border-t shadow-lg max-h-[80vh] overflow-y-auto"
      >
        <nav class="px-4 py-3">
          <nuxt-link
            :to="localePath('/ai-search')"
            class="block py-3 text-gray-700 border-b border-gray-100"
            @click="mobileMenuOpen = false"
          >
            🔍 {{ t('common.aiSearch') || 'AI Search' }}
          </nuxt-link>
          <nuxt-link
            v-for="item in categoryList"
            :key="item.categoryId"
            :to="categoryLink(item.categoryMpath)"
            class="block py-3 text-gray-700 border-b border-gray-100"
            @click="mobileMenuOpen = false"
          >
            {{ item.categoryName?.[locale] || item.categoryName?.en }}
          </nuxt-link>
        </nav>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
const { locale } = useI18n();
const localePath = useLocalePath();

const mobileMenuOpen = ref(false);
const isScrolled = ref(false);

const [{ t }, { data: categoryList }, { data: recommendCategoryList }] = await Promise.all([
  useI18nLoader(),
  useFetch('/api/public/cms/category/list', {
    query: { parentCategoryId: 0, status: '1' },
    getCachedData: (key: string) => localCacheData(key),
  }),
  useFetch('/api/public/cms/category/list', {
    query: { isRecommend: '1', status: '1' },
    getCachedData: (key: string) => localCacheData(key),
  }),
]);

function categoryLink(categoryMpath: any[]) {
  let categoryUrl = '';
  categoryMpath.forEach((item: any) => {
    categoryUrl += `/${item.urlKey}`;
  });
  return localePath(categoryUrl);
}

function handleScroll() {
  isScrolled.value = window.scrollY > 50;
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll);
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
});
</script>

<style scoped>
.nav-link {
  transition: all 0.2s ease-in-out;
  border-radius: 2px;
}
.nav-link:hover {
  background: rgba(0, 0, 0, 0.1);
}
</style>
