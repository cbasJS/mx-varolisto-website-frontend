import { defineConfig, globalIgnores } from 'eslint/config'
import nextVitals from 'eslint-config-next/core-web-vitals'
import nextTs from 'eslint-config-next/typescript'
import prettier from 'eslint-config-prettier/flat'

export default defineConfig([
  ...nextVitals,
  ...nextTs,
  prettier,
  {
    // Reglas nuevas de react-hooks introducidas con Next 16 / React 19.
    // Relajadas a warn para que el lint no quede rojo durante la migración;
    // refactor de los hooks afectados sale en una rama aparte.
    rules: {
      'react-hooks/set-state-in-effect': 'warn',
      'react-hooks/refs': 'warn',
      'react-hooks/purity': 'warn',
    },
  },
  globalIgnores([
    '.next/**',
    'node_modules/**',
    'out/**',
    'build/**',
    'test-results/**',
    'playwright-report/**',
    'next-env.d.ts',
  ]),
])
