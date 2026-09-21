import { defineConfig, globalIgnores } from 'eslint/config';
import coreWebVitals from 'eslint-config-next/core-web-vitals';
import typescript from 'eslint-config-next/typescript';

const config = defineConfig([
  globalIgnores(['.next/**', 'out/**', 'node_modules/**', 'public/**']),
  ...coreWebVitals,
  ...typescript,
]);

export default config;
