<template>
  <section class="py-16 bg-ds-light">
    <div class="max-w-[1400px] mx-auto px-4 lg:px-6">
      <h2 class="text-2xl lg:text-3xl font-bold text-gray-800 text-center">{{ t('home.contact.title') }}</h2>
      <div class="flex items-center justify-center mt-3 mb-10">
        <div style="border-top: 5px solid #c40000; width: 10%;"></div>
        <div style="border-top: 5px solid #4d40ff; width: 10%;"></div>
      </div>

      <form class="max-w-2xl mx-auto space-y-4" @submit.prevent="submitContact">
        <!-- Name + Phone -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">{{ t('home.contact.form.name') }}</label>
            <input v-model="contactForm.name" type="text" class="w-full "
              :placeholder="t('home.contact.form.namePlaceholder')" required />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">{{ t('home.contact.form.phone') }}</label>
            <input v-model="contactForm.phone" type="tel" class="w-full "
              :placeholder="t('home.contact.form.phonePlaceholder')" required />
          </div>
        </div>
        <!-- Email -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">{{ t('home.contact.form.email') }}</label>
          <input v-model="contactForm.email" type="email" class="w-full "
            :placeholder="t('home.contact.form.emailPlaceholder')" required />
        </div>
        <!-- Subject -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">{{ t('home.contact.form.subject') }}</label>
          <select v-model="contactForm.subject" class="w-full " required>
            <option value="">{{ t('home.contact.form.subjectPlaceholder') }}</option>
            <option value="product">{{ t('home.contact.form.subjectProduct') }}</option>
            <option value="cooperation">{{ t('home.contact.form.subjectCooperation') }}</option>
            <option value="technical">{{ t('home.contact.form.subjectTechnical') }}</option>
            <option value="other">{{ t('home.contact.form.subjectOther') }}</option>
          </select>
        </div>
        <!-- Message -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">{{ t('home.contact.form.message') }}</label>
          <textarea v-model="contactForm.message" rows="4" class="w-full  resize-none"
            :placeholder="t('home.contact.form.messagePlaceholder')" required></textarea>
        </div>
        <!-- Submit -->
        <button type="submit" :disabled="submitting"
          class="w-full bg-[var(--brand-primary)] hover:bg-[var(--brand-primary-hover)] text-white font-medium py-3 rounded-md transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed">
          {{ submitting ? t('home.contact.form.submitting') : t('home.contact.form.submit') }}
        </button>
        <div v-if="submitSuccess" class="text-green-600 text-sm text-center">
          {{ t('home.contact.form.success') }}
        </div>
        <div v-if="submitError" class="text-red-600 text-sm text-center">
          {{ submitError }}
        </div>
      </form>
    </div>
  </section>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'

const [{ t }] = await Promise.all([
  useI18nLoader(),
])

const submitting = ref(false)
const submitSuccess = ref(false)
const submitError = ref('')

const contactForm = reactive({
  name: '',
  phone: '',
  email: '',
  subject: '',
  message: '',
})

async function submitContact() {
  submitting.value = true
  submitSuccess.value = false
  submitError.value = ''

  try {
    const { data: response }: any = await useFetch('/api/public/cms/contact', {
      method: 'POST',
      body: contactForm,
    })
    submitSuccess.value = true;
    // 重置表单
    Object.assign(contactForm, {
      name: '',
      phone: '',
      email: '',
      subject: '',
      message: '',
    })
    // 3秒后隐藏成功消息
    setTimeout(() => {
      submitSuccess.value = false;
    }, 3000);
  } catch (err: any) {
    submitError.value = err?.message || t('home.contact.form.error');
    console.log(submitError.value + "-------------");
  } finally {
    submitting.value = false
  }
}
</script>

<style scoped></style>
