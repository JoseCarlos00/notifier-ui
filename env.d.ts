/// <reference types="vite/client" />

interface ImportMetaEnv {
	readonly VITE_IP_BASE: string;
  readonly VITE_PUERTO: string;
  readonly VITE_TIEMPO_ESPERA_MS: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
