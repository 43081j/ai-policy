import { watch } from 'node:fs';
import { writeFile } from 'node:fs/promises';
import { relative } from 'node:path';
import {
  addServerHandler,
  addServerPlugin,
  createResolver,
  defineNuxtModule,
  useLogger,
} from 'nuxt/kit';
import { generateSourceTypes } from 'comark-content';
import {
  policiesDir,
  syncPolicyVersions,
} from '../../../scripts/policy-versions.ts';
import { content } from './content';

export default defineNuxtModule({
  meta: {
    name: 'comark-content',
  },
  async setup(_options, nuxt) {
    const { resolve } = createResolver(import.meta.url);
    const logger = useLogger('policy-versions');

    const snapshotPolicies = async () => {
      try {
        for (const file of await syncPolicyVersions()) {
          logger.info(`Wrote ${relative(nuxt.options.rootDir, file)}`);
        }
      } catch (error) {
        logger.warn((error as Error).message);
      }
    };

    if (nuxt.options.dev) {
      await snapshotPolicies();
    }

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

      let timeout: ReturnType<typeof setTimeout> | undefined;
      const watcher = watch(policiesDir, (_event, file) => {
        if (!file?.endsWith('.md')) {
          return;
        }

        clearTimeout(timeout);
        timeout = setTimeout(snapshotPolicies, 100);
      });

      nuxt.hook('close', () => watcher.close());
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
