const IP_BASE = import.meta.env.VITE_IP_BASE;
const PUERTO = import.meta.env.VITE_PUERTO;
const TIEMPO_ESPERA_MS = parseInt(import.meta.env.VITE_TIEMPO_ESPERA_MS); 

interface ApiResponse {
	success: boolean;
	message: string;
	status?: number; // Código HTTP opcional
}

/**
 * Función genérica para manejar peticiones HTTP con Timeout.
 * @param endpoint - Ruta del servidor (ej: '/alert', '/message')
 * @param options - Opciones de fetch (method, headers, body, etc.)
 * @returns Promesa que resuelve a un objeto ApiResponse.
 */
async function fetchWithTimeout(url: string,endpoint: string, options: RequestInit = {}): Promise<ApiResponse> {
	const controller = new AbortController();
	// Configura el temporizador de aborto
	const timeoutId = setTimeout(() => controller.abort(), TIEMPO_ESPERA_MS);

	try {
		const response = await fetch(`${url}${endpoint}`, {
			...options,
			signal: controller.signal,
		});

		// Limpia el temporizador si la respuesta llega a tiempo
		clearTimeout(timeoutId);

		if (response.ok) {
			// Asume que el servidor devuelve un cuerpo de texto en caso de éxito
			const text = await response.text();
			return {
				success: true,
				message: text || `✅ Solicitud exitosa para ${endpoint}.`,
			};
		}

		// Manejo de errores HTTP (4xx, 5xx)
		const errorBody = await response.text();
		throw new Error(`❌ HTTP Error ${response.status} en ${endpoint}: ${errorBody || response.statusText}`);
	} catch (error) {
		// Limpia el temporizador ante cualquier error
		clearTimeout(timeoutId);

		// Manejo del error de AbortController (Timeout)
		if (error instanceof Error && error.name === 'AbortError') {
			return {
				success: false,
				message: `⌛ Tiempo de espera agotado (${TIEMPO_ESPERA_MS / 1000}s). El servidor no respondió.`,
				status: 408, // Código HTTP para Request Timeout
			};
		}

		// Manejo de otros errores de red (CORS, servidor no disponible)
		console.error('Error durante la petición:', error);
		return {
			success: false,
			message: `🚫 Error de red: El servidor no está disponible o hay un problema de CORS/Conexión.`,
			status: 0,
		};
	}
}

// --- FUNCIONES ESPECÍFICAS DE ENDPOINT ---

export async function sendMessage(lastOctet: string, mensaje: string): Promise<ApiResponse> {
	const fullUrl = `http://${IP_BASE}${lastOctet}:${PUERTO}`;
	return fetchWithTimeout(fullUrl, '/message', {
		method: 'POST',
		headers: {
			'Content-Type': 'text/plain',
		},
		body: mensaje,
	});
}

export async function sendAlert(lastOctet: string): Promise<ApiResponse> {
	const fullUrl = `http://${IP_BASE}${lastOctet}:${PUERTO}`;
	return fetchWithTimeout(fullUrl, '/alert', {
		method: 'GET',
	});
}
