import '@testing-library/jest-dom/vitest';
import { afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';
import { setSqlLoader } from '../lib/sqlrun';

// In Node, sql.js finds its WebAssembly file by itself.
setSqlLoader(async () => {
  const { default: init } = await import('sql.js');
  return init();
});

afterEach(() => { cleanup(); if (typeof localStorage !== 'undefined') localStorage.clear(); });
