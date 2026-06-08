<template>
  <!-- Why Choose Daswell -->
  <section class="py-16 bg-ds-light">
    <div class="max-w-[1400px] mx-auto px-4 lg:px-6">
      <h2 class="text-2xl lg:text-3xl font-bold text-gray-800 text-center">
        {{ whyChooseData?.title?.[locale] || whyChooseData?.title?.en || '' }}
      </h2>
      <div class="flex items-center justify-center mt-3 mb-4">
        <div style="border-top: 5px solid #c40000; width: 10%;"></div>
        <div style="border-top: 5px solid #4d40ff; width: 10%;"></div>
      </div>
      <p class="text-center text-gray-600 mb-10">
        {{ whyChooseData?.subtitle?.[locale] || whyChooseData?.subtitle?.en || '' }}
      </p>

      <!-- 4 列桌面，2列移动 -->
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-6">
        <div v-for="(item, idx) in whyChooseData?.features || []" :key="idx" class="text-center">
          <img
            :src="item.icon"
            :alt="item.iconAlt"
            width="56"
            height="56"
            class="mx-auto mb-3"
          />
          <h3 class="font-bold text-gray-800 mb-1">{{ item.title?.[locale] || item.title?.en || '' }}</h3>
          <p class="text-sm text-gray-500">{{ item.desc?.[locale] || item.desc?.en || '' }}</p>
        </div>
      </div>
    </div>
  </section>

  <!-- Global Branches -->
  <!-- <section class="py-16 bg-white">
    <div class="max-w-[1400px] mx-auto px-4 lg:px-6">
      <h2 class="text-2xl lg:text-3xl font-bold text-gray-800 text-center">
        {{ categoryInfo?.data?.categoryName?.[locale] || categoryInfo?.data?.categoryName?.en || 'Global Branches' }}
      </h2>
      <div class="flex items-center justify-center mt-3 mb-10">
        <div style="border-top: 5px solid #c40000; width: 10%;"></div>
        <div style="border-top: 5px solid #4d40ff; width: 10%;"></div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <nuxt-link
          v-for="item in branchList"
          :key="item.newsId"
          :to="newsLink(item)"
          class="group block rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
          style="background: rgba(0,0,0,0.05);"
        >
          <div class="overflow-hidden">
            <nuxt-img
              v-if="item.coverImage"
              format="webp"
              :src="item.coverImage"
              :alt="item.title?.[locale] || item.title?.en || ''"
              class="w-full aspect-video object-cover group-hover:scale-105 transition-transform duration-300"
              loading="lazy"
            />
            <div v-else class="w-full aspect-video bg-gray-200 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
          <div>
            <h3 class="text-lg font-bold text-gray-800 mb-2 text-center">
              {{ item.title?.[locale] || item.title?.en || '' }}
            </h3>
            <ul class="list-disc list-inside text-sm text-gray-600 space-y-1">
              <li>{{ item.summary?.[locale] || item.summary?.en || '' }}</li>
            </ul>
          </div>
        </nuxt-link>
      </div>
    </div>
  </section> -->
</template>
<style>
ul{
  padding-inline-start: 40px;
}
</style>
<script setup lang="ts">
const { locale } = useI18n()
const localePath = useLocalePath()

const [{ data: whyChooseData }, { data: categoryInfo }, { data: branchData }]: any = await Promise.all([
  useFetch('/data/whyChoose.json'),
  useFetch('/api/public/cms/category/by-urlkey/SuccessStories', {
    getCachedData: (key: string) => localCacheData(key),
  }),
  useFetch('/api/public/cms/news/list', {
    query: { limit: 3, categoryId: 34 },
    getCachedData: (key: string) => localCacheData(key),
  }),
])

const branchList = computed(() => branchData.value?.rows || [])

function newsLink(news: any) {
  if (!news.categoryMpath || news.categoryMpath.length === 0) {
    return localePath(`/news/${news.newsId}`)
  }
  let categoryUrl = ''
  news.categoryMpath.forEach((item: any) => {
    categoryUrl += `/${item.urlKey}`
  })
  return localePath(`${categoryUrl}/${news.newsId}`)
}
</script>
