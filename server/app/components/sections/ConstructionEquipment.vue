<template>
  <section class="py-16 bg-ds-light">
    <div class="max-w-[1400px] mx-auto px-4 lg:px-6">
      <!-- 标题 -->
      <h2 class="text-2xl lg:text-3xl font-bold text-gray-800 text-center">
        {{ categoryInfo?.data?.categoryName?.[locale] || categoryInfo?.data?.categoryName?.en || 'Customer Cases' }}
      </h2>
      <div class="flex items-center justify-center mt-3 mb-8">
        <div style="border-top: 5px solid #c40000; width: 10%;"></div>
        <div style="border-top: 5px solid #4d40ff; width: 10%;"></div>
      </div>
      <!-- 加载状态 -->
      <div v-if="pending" class="text-center py-12 text-gray-400">Loading...</div>

      <!-- 案例网格：桌面3列，移动2列 -->
      <div v-else class="grid grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
        <nuxt-link v-for="item in newsList" :key="item.newsId" :to="newsLink(item)"
          class="group bg-white rounded overflow-hidden hover:shadow-lg transition-shadow">
          <!-- 封面图 -->
          <div class="overflow-hidden aspect-[16/9]">
            <nuxt-img v-if="item.coverImage" format="webp" :src="item.coverImage"
              :alt="item.title?.[locale] || item.title?.en || ''"
              class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" loading="lazy" />
            <div v-else class="w-full h-full bg-gray-200 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 text-gray-400" fill="none" viewBox="0 0 24 24"
                stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          </div>

          <!-- 文字区 -->
          <div class="p-3 lg:p-4">
            <h3
              class="text-sm lg:text-base font-semibold text-gray-800 line-clamp-2 group-hover:text-primary transition-colors">
              {{ item.title?.[locale] || item.title?.en || '' }}
            </h3>
            <p class="hidden lg:block text-xs text-gray-500 mt-1 line-clamp-2">
              {{ item.summary?.[locale] || item.summary?.en || '' }}
            </p>
          </div>
        </nuxt-link>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const { locale } = useI18n()
const localePath = useLocalePath()

const [{ data: categoryInfo }, { data: newsData }]: any = await Promise.all([
  useFetch('/api/public/cms/category/by-urlkey/CaseStudies', {
    getCachedData: (key: string) => localCacheData(key),
  }),
  useFetch('/api/public/cms/news/list', {
    query: { limit: 9, categoryId: 7 },
    getCachedData: (key: string) => localCacheData(key),
  }),
])

const pending = computed(() => !newsData.value)
const newsList = computed(() => newsData.value?.rows || [])

// 构建新闻详情链接（基于分类 mpath）
function newsLink(news: any) {
  if (!news.categoryMpath || news.categoryMpath.length === 0) {
    return localePath(`/CaseStudies/${news.newsId}`)
  }
  let categoryUrl = ''
  news.categoryMpath.forEach((item: any) => {
    categoryUrl += `/${item.urlKey}`
  })
  return localePath(`${categoryUrl}/${news.newsId}`)
}
</script>
