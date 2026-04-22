/**
 * Módulo server-only de configuración por ambiente.
 *
 * IMPORTANTE: nunca importar este archivo desde componentes "use client".
 * Las variables sin prefijo NEXT_PUBLIC_ no se incluyen en el bundle del cliente.
 *
 * Sandbox (desarrollo): definir las variables en .env.local
 * Producción:           definir las variables en el dashboard de Vercel
 *                       (Project Settings → Environment Variables)
 */
export const env = {
  copomex: {
    /** Token de autenticación de la API de Copomex. Lanza un error descriptivo si no está definido. */
    get token(): string {
      const value = process.env.COPOMEX_TOKEN;
      if (!value)
        throw new Error(
          "Missing env var: COPOMEX_TOKEN. " +
            "Agrega COPOMEX_TOKEN=pruebas en .env.local para desarrollo, " +
            "o configura la variable en Vercel para producción.",
        );
      return value;
    },
    /** URL base de la API de Copomex. Usa el valor de COPOMEX_BASE_URL o el default de producción. */
    get baseUrl(): string {
      return (
        process.env.COPOMEX_BASE_URL ?? "https://api.copomex.com/query"
      );
    },
  },
} as const;
