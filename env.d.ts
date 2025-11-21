/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string;
  // Agrega aquí otras variables de entorno que uses con el prefijo VITE_
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
