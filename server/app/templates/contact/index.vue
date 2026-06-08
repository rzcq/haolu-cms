<template>
  <div class="flex flex-col">
    <!-- 面包屑 -->
    <div class="bg-gray-50 border-b border-gray-200 py-4">
      <div class="container mx-auto px-4 sm:px-6 lg:px-8">
        <nav class="flex text-sm" aria-label="Breadcrumb">
          <ol class="flex items-center space-x-2">
            <li>
              <nuxt-link :to="localePath('/')" class="text-gray-600 hover:text-primary">{{
                t('common.home')
              }}</nuxt-link>
            </li>
            <li v-for="value in category.categoryMpath" :key="value.categoryId" class="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
              </svg>
              <nuxt-link
                v-if="value.categoryId !== categoryId"
                :to="localePath(`/${value.urlKey}`)"
                class="ml-2 text-gray-600 hover:text-primary"
              >
                {{ value.categoryName[locale] ?? value.categoryName['en'] }}
              </nuxt-link>
              <span v-else class="ml-2 text-primary">
                {{ value.categoryName[locale] ?? value.categoryName['en'] }}
              </span>
            </li>
          </ol>
        </nav>
      </div>
    </div>

    <!-- 主内容 -->
    <main class="flex-grow py-12">
      <div class="container mx-auto px-4 sm:px-6 lg:px-8">
        <div class="max-w-5xl mx-auto">
          <!-- 标题 -->
          <h1 class="text-2xl lg:text-3xl font-bold text-gray-800 mb-8">
            {{ category.categoryName?.[locale] || category.categoryName?.en || 'Contact Us' }}
          </h1>

          <!-- 联系信息 + 地图 -->
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <!-- 联系信息 -->
            <div class="bg-white rounded-lg shadow-sm p-6 lg:p-8">
              <h2 class="text-xl font-bold text-gray-800 mb-6">{{ t('home.contact.subtitle') }}</h2>
              <ul class="space-y-5">
                <li class="flex items-start gap-3">
                  <svg class="w-5 h-5 text-primary mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <div>
                    <p class="text-sm text-gray-500">{{ t('home.contact.info.address') }}</p>
                    <p class="text-gray-800">{{ t('footer.address') }}</p>
                  </div>
                </li>
                <li class="flex items-start gap-3">
                  <svg class="w-5 h-5 text-primary mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <div>
                    <p class="text-sm text-gray-500">{{ t('home.contact.info.phone') }}</p>
                    <p class="text-gray-800">{{ t('footer.phone') }}</p>
                  </div>
                </li>
                <li class="flex items-start gap-3">
                  <svg class="w-5 h-5 text-primary mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <div>
                    <p class="text-sm text-gray-500">{{ t('home.contact.info.email') }}</p>
                    <p class="text-gray-800">{{ t('footer.email') }}</p>
                  </div>
                </li>
              </ul>
            </div>

            <!-- 百度地图 -->
            <div class="bg-white rounded-lg shadow-sm overflow-hidden">
              <iframe
                src="https://api.map.baidu.com/marker?location=34.8135,113.2756&title=Henan%20Haolu&content=Henan%20Haolu%20Machinery&output=html&coordtype=wgs84ll&zoom=15"
                width="100%"
                height="100%"
                class="min-h-[400px]"
                frameborder="0"
                allowfullscreen
              ></iframe>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  category?: any
}>()

const config = useRuntimeConfig()
const route = useRoute()
const { locale, locales } = useI18n()
const localePath = useLocalePath()

const categoryId = props.category?.categoryId || undefined

const [{ t }] = await Promise.all([
  useI18nLoader(),
])

const links = computed(() => {
  return locales.value.map(loc => {
    return {
      rel: 'alternate',
      hreflang: loc.language,
      href: `${config.public.serverHost}/${loc.code}${route.path.replace(locale.value, '')}`,
    }
  })
})

useHead({
  title: pageTitle(props.category?.categoryName?.[locale.value] || props.category?.categoryName?.en),
  link: [
    { rel: 'canonical', href: `${config.public.serverHost}${route.path}` },
    ...links.value,
  ],
})
</script>
