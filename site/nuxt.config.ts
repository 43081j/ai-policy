import comark from 'comark-content/vite';
import { content } from './server/utils/content';

export default defineNuxtConfig({
  compatibilityDate: '2026-09-01',
  modules: ['@nuxt/fonts', '@unocss/nuxt'],
  css: ['~/assets/main.css'],
  vite: {
    plugins: [
      comark({
        content,
        server: false,
        prerender: false,
        types: { outDir: 'shared' },
      }),
    ],
  },
  fonts: {
    families: [
      {
        name: 'Geist',
        weights: ['400', '500', '600'],
        preload: true,
        global: true,
      },
      {
        name: 'Geist Mono',
        weights: ['400', '500'],
        preload: true,
        global: true,
      },
    ],
  },
  app: {
    head: {
      htmlAttrs: { lang: 'en' },
      title: 'AI Contribution Policies',
      meta: [
        {
          name: 'description',
          content:
            'Ready-to-use AI contribution policies for open source projects.',
        },
      ],
    },
  },
});
