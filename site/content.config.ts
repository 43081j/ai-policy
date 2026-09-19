import { resolve } from 'node:path'
import { defineCollection, defineContentConfig, z } from '@nuxt/content'

export default defineContentConfig({
  collections: {
    policies: defineCollection({
      type: 'page',
      source: {
        cwd: resolve(__dirname, '../policies'),
        include: '*.md',
        exclude: ['_template.md'],
        prefix: '/policies',
      },
      schema: z.object({
        // Untouched Markdown, used for copy and download (see policyMarkdown).
        rawbody: z.string(),
        tagline: z.string(),
        enforcement: z.string(),
        rules: z.array(z.string()),
      }),
    }),
  },
})
