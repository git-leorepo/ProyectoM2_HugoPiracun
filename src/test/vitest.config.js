import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: ['src/test/authors.test.js', 'src/test/posts.test.js'],
  },
});