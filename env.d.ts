/// <reference types="vite/client" />

interface ImportMetaEnv {
	readonly VITE_GOOGLE_SCRIPT_URL: string;
	readonly VITE_GOOGLE_SCRIPT_BIBLIOTECA_URL: string;
	readonly VITE_IP_BASE: string;
	readonly VITE_PUERTO: string;
	readonly VITE_TIEMPO_ESPERA_MS: string;
	readonly VITE_CLIENT_ID: string;
	readonly VITE_API_KEY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
