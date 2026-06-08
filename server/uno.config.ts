import { defineConfig } from 'unocss';
import transformerDirectives from '@unocss/transformer-directives';
import transformerVariantGroup from '@unocss/transformer-variant-group';

export default defineConfig({
  transformers: [transformerDirectives(), transformerVariantGroup()],
  theme: {
    colors: {
      'ds-red': '#f51f1f',
      'ds-blue': '#4d40ff',
      'ds-black': '#000000',
      'ds-light': '#f8f9fa',
      'ds-sub': 'rgba(0,0,0,0.1)',
      'brand-primary': '#f51f1f',
      'brand-secondary': '#4d40ff',
    },
  },
});
