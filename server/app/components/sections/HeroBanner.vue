<template>
  <!-- 视频背景（暂时注释，客户可能切换回用）
  <section class="relative w-full h-[60vh] lg:h-[80vh] overflow-hidden bg-black">
    <video
      class="absolute inset-0 w-full h-full object-cover"
      src="https://daswell.com/wp-content/uploads/2026/01/banners.mp4"
      autoplay
      muted
      loop
      playsinline
    ></video>
    <div class="absolute inset-0 bg-black/40"></div>
    <div class="relative z-10 h-full flex items-center justify-center text-center">
      <div>
        <h1 class="hero-title text-white text-center text-[clamp(1.1rem,0.995rem+0.326vw,1.25rem)] lg:text-[40px] leading-tight mb-8 mx-4 pt-[5rem] pb-[0.5rem] lg:pt-0 lg:pb-0">
          {{ t('home.banner.description') }}
        </h1>
        <div class="hidden lg:flex items-center justify-center">
          <a href="javascript:void(0)" class="btn-hero-left text-white px-8 py-3 transition-colors">{{ t('home.banner.learnMore') }}</a>
          <a href="javascript:void(0)" rel="noopener" class="btn-hero-right text-white px-8 py-3 transition-colors">{{ t('home.banner.viewProducts') }}</a>
        </div>
        <div class="flex lg:hidden items-center justify-center">
          <a href="javascript:void(0)" class="btn-hero-left text-white w-1/2 py-2.5 transition-colors inline-flex items-center justify-center">
            {{ t('home.banner.learnMore') }}
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" /></svg>
          </a>
          <a href="javascript:void(0)" rel="noopener" class="btn-hero-right text-white w-1/2 py-2.5 transition-colors inline-flex items-center justify-center">
            {{ t('home.banner.viewProducts') }}
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" /></svg>
          </a>
        </div>
      </div>
    </div>
  </section>
  -->

  <!-- 轮播图区域 -->
  <swiper
    v-if="bannerListData?.length"
    :modules="modules"
    navigation
    :pagination="{ clickable: true }"
    :autoplay="{ delay: 5000 }"
  >
    <swiper-slide v-for="(banner, index) in bannerListData" :key="index">
      <div class="h-[60vh] md:h-[70vh] relative">
        <img
          :src="banner.imageUrl"
          :alt="banner.title?.[locale] ?? banner.title?.en"
          class="w-full h-full object-contain"
        />
        <div class="absolute inset-0  flex items-center">
          <div class="container mx-auto px-4 sm:px-6 lg:px-8">
            <div class="max-w-2xl text-white">
              <h1 class="text-[clamp(2rem,5vw,3.5rem)] font-bold leading-tight mb-4">
                {{ banner.title?.[locale] ?? banner.title?.en }}
              </h1>
              <p class="text-[clamp(1rem,2vw,1.25rem)] mb-6 text-gray-100">
                {{ banner.description?.[locale] ?? banner.description?.en }}
              </p>
              <nuxt-link
                v-if="banner.linkUrl"
                :to="localePath(banner.linkUrl)"
                class="inline-block bg-primary hover:bg-primary/90 text-white font-medium px-6 py-3 rounded-md transition-all duration-300 transform hover:scale-105"
              >
                {{ (banner.buttonText?.[locale] ?? banner.buttonText?.en) || 'Learn More' }}
              </nuxt-link>
            </div>
          </div>
        </div>
      </div>
    </swiper-slide>
  </swiper>

  <!-- 无轮播图时的占位 -->
  <section v-else class="relative w-full h-[60vh] lg:h-[80vh] overflow-hidden bg-black">
    <div class="absolute inset-0 bg-black/40"></div>
    <div class="relative z-10 h-full flex items-center justify-center text-center">
      <h1 class="hero-title text-white text-[clamp(1.1rem,0.995rem+0.326vw,1.25rem)] lg:text-[40px] leading-tight">
        {{ t('home.banner.description') }}
      </h1>
    </div>
  </section>
</template>

<script setup lang="ts">
import { Swiper, SwiperSlide } from 'swiper/vue'
import { Navigation, Pagination, Autoplay } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'

const { locale } = useI18n()
const localePath = useLocalePath()

const modules = [Navigation, Pagination, Autoplay]

const [{ t }, { data: bannerListData }]: any = await Promise.all([
  useI18nLoader(),
  useFetch('/api/public/cms/banner/list', {
    getCachedData: (key: string) => localCacheData(key),
  }),
])
</script>

<style scoped>
.hero-title {
  text-shadow: 1px 1px 1px rgba(0, 0, 0, 0.2);
}
</style>
