export default defineNuxtConfig({
  compatibilityDate: '2026-09-01',
  modules: ['@nuxt/fonts', '@unocss/nuxt'],
  css: ['~/assets/main.css'],
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
      link: [
        {
          key: 'favicon',
          rel: 'icon',
          type: 'image/svg+xml',
          href: '/favicon.svg',
        },
      ],
    },
  },
});
