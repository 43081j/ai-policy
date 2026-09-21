import {
  addServerHandler,
  addServerPlugin,
  createResolver,
  defineNuxtModule,
} from 'nuxt/kit';
import { writeSourceTypes } from 'comark-content/build';
import { content } from './content';

export default defineNuxtModule({
  meta: {
    name: 'comark-content',
  },
  async setup(_options, nuxt) {
    const { resolve } = createResolver(import.meta.url);

    await content.init();
    await writeSourceTypes(content, { outDir: resolve('../../shared') });

    addServerHandler({
      route: '/api/content/**',
      handler: resolve('./runtime/handler'),
    });

    if (nuxt.options.dev) {
      addServerPlugin(resolve('./runtime/watch'));
    }

    nuxt.hook('prerender:routes', async (ctx) => {
      for (const file of await content.list()) {
        const slug = file.path.split('/').pop() ?? file.path;

        if (slug.startsWith('_')) {
          continue;
        }

        ctx.routes.add(`/policies/${slug}`);
      }
    });
  },
});
