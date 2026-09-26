import { watch } from 'node:fs';
import { relative } from 'node:path';
import {
  addServerHandler,
  addServerPlugin,
  createResolver,
  defineNuxtModule,
  useLogger,
} from 'nuxt/kit';
import { writeSourceTypes } from 'comark-content/build';
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
      for (const file of await syncPolicyVersions()) {
        logger.info(`Wrote ${relative(nuxt.options.rootDir, file)}`);
      }
    };

    await snapshotPolicies();
    await content.init();
    await writeSourceTypes(content, { outDir: resolve('../../shared') });

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
        timeout = setTimeout(() => {
          snapshotPolicies().catch((error) => logger.error(error.message));
        }, 100);
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
