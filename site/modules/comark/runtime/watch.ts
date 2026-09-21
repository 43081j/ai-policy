import { defineNitroPlugin } from 'nitropack/runtime';
import { content } from '../content';

// dev only
export default defineNitroPlugin(async () => {
  await content.watch();
});
