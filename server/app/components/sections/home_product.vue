<template>
  <section class="py-16 bg-ds-light">
    <div class="max-w-[1400px] mx-auto px-4 lg:px-6">
      <!-- 标题 -->
      <h2 class="text-2xl lg:text-3xl font-bold text-gray-800 text-center">{{ t('home.products.title') }}</h2>
      <div class="flex items-center justify-center mt-3 mb-8">
        <div style="border-top: 5px solid #c40000; width: 10%;"></div>
        <div style="border-top: 5px solid #4d40ff; width: 10%;"></div>
      </div>

      <!-- 卡片网格 -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <a
          v-for="(item, index) in productListData?.rows || []"
          :key="index"
          :href="productLink(item)"
          class="group flex bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
        >
          <div class="w-[270px] flex-shrink-0 overflow-hidden">
            <nuxt-img
              format="webp"
              loading="lazy"
              :src="item.mainImage || ''"
              :alt="item.productName?.[locale] ?? item.productName?.zh"
              class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>
          <div class="p-4 flex flex-col justify-center">
            <h3 class="text-base font-semibold text-gray-800 mb-1">
              {{ item.productName?.[locale] ?? item.productName?.en }}
            </h3>
            <p v-if="item.summary" class="text-sm text-gray-500">
              {{ item.summary?.[locale] ?? item.summary?.en }}
            </p>
            <span class="btn-outline details_btn text-sm font-medium mt-2">{{ t('home.products.viewDetails') }}</span>
          </div>
        </a>
      </div>

      <!-- 查看全部 -->
      <div class="text-center">
        <nuxt-link :to="localePath('/products')" class="hover:underline text-sm font-medium">
          {{ t('home.products.viewMore') }} &gt;
        </nuxt-link>
      </div>
    </div>
  </section>
</template>
<style>
.details_btn{
  border-radius: 20px;
  line-height: 30px;
  border-width: 1px 1px 1px 1px;
  padding-top: 4px;
  padding-right: 20px;
  padding-bottom: 4px;
  padding-left: 20px;
  margin-top: 10px;
  margin-right: 0px;
  margin-bottom: 10px;
  margin-left: 0px;
  width:130px
}
</style>
<script setup lang="ts">
const { locale } = useI18n()
const localePath = useLocalePath()

const [{ t }, { data: productListData }] = await Promise.all([
  useI18nLoader(),
  useFetch('/api/public/cms/product/list', {
    query: { isRecommend: '1', limit: 8 },
    getCachedData: (key: string) => localCacheData(key),
  }),
])


function productLink(product: any) {
  let categoryUrl = ''
  product.categoryMpath?.forEach((item: any) => {
    categoryUrl += `/${item.urlKey}`
  })
  return localePath(`${categoryUrl}/${product.productId}`)
}
</script>
