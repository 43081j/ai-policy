import { defineEventHandler, toWebRequest } from 'h3';
import { content } from '../content';

export default defineEventHandler((event) =>
  content.handler(toWebRequest(event)),
);
