import { writeFile } from 'node:fs/promises';
import {
  addServerHandler,
  addServerPlugin,
  createResolver,
  defineNuxtModule,
} from 'nuxt/kit';
import { generateSourceTypes } from 'comark-content';
import { content } from './content';

export default defineNuxtModule({
  meta: {
    name: 'comark-content',
  },
  async setup(_options, nuxt) {
    const { resolve } = createResolver(import.meta.url);

    await content.init();
    await writeFile(
      resolve('../../shared/comark-content.d.ts'),
      sortContentPaths(await generateSourceTypes(content)),
    );

    addServerHandler({
      route: '/api/content/**',
      handler: resolve('./runtime/handler'),
    });

    if (nuxt.options.dev) {
      addServerPlugin(resolve('./runtime/watch'));
    }

    nuxt.hook('prerender:routes', async (ctx) => {
      for (const file of await content.list()) {
        const [slug, version] = policyRoute(file.path);

        if (slug.startsWith('_')) {
          continue;
        }

        ctx.routes.add(
          version ? `/policies/${slug}/${version}` : `/policies/${slug}`,
        );
      }
    });
  },
});

function policyRoute(path: string): [slug: string, version?: string] {
  const [first = '', slug = '', version] = path.split('/').filter(Boolean);

  return first === 'versions' ? [slug, version] : [first];
}

// Nested version folders are listed in a random order, which would reorder
// the generated paths on every run.
function sortContentPaths(types: string): string {
  return types.replace(
    /(?:^ {6}'[^']+': \w+\n)+/gm,
    (paths) => `${paths.trimEnd().split('\n').toSorted().join('\n')}\n`,
  );
}
