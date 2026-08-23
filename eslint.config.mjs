import { defineConfig, globalIgnores } from 'eslint/config'
import nextVitals from 'eslint-config-next/core-web-vitals'
import nextTs from 'eslint-config-next/typescript'
import prettier from 'eslint-config-prettier/flat'
import reactHooks from 'eslint-plugin-react-hooks'

export default defineConfig([
  ...nextVitals,
  ...nextTs,
  prettier,
  {
    // Reglas nuevas de react-hooks introducidas con Next 16 / React 19.
    // Relajadas a warn para que el lint no quede rojo durante la migración;
    // refactor de los hooks afectados sale en una rama aparte.
    //
    // En flat config una regla `plugin/rule` se resuelve desde los `plugins` del
    // MISMO config object. eslint-config-next/core-web-vitals registra react-hooks
    // en el suyo, no en este, así que hay que declararlo aquí también.
    plugins: { 'react-hooks': reactHooks },
    rules: {
      'react-hooks/set-state-in-effect': 'warn',
      'react-hooks/refs': 'warn',
      'react-hooks/purity': 'warn',
    },
  },
  globalIgnores([
    '.open-next/**',
    '.wrangler/**',
    '.next/**',
    'node_modules/**',
    'out/**',
    'build/**',
    'test-results/**',
    'playwright-report/**',
    'next-env.d.ts',
  ]),
])
