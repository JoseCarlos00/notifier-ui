// Obtenemos la URL base desde las variables de entorno de Vite.
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

interface ApiResponse {
	success: boolean;
	message: string;
}

/**
 * Envía una alerta al ESP32.
 * @param lastOctet - El último octeto de la dirección IP.
 */
export async function sendAlert(lastOctet: string): Promise<ApiResponse> {
	try {
		const response = await fetch(`${API_BASE_URL}.${lastOctet}/alert`, {
			method: 'POST',
			// Puedes agregar headers si tu API los requiere
			// headers: { 'Content-Type': 'application/json' },
		});

		if (!response.ok) {
			return { success: false, message: `Error de red: ${response.statusText}` };
		}
		return { success: true, message: '✅ ¡Alerta enviada con éxito!' };
	} catch (error) {
		console.error('Error al enviar alerta:', error);
		return { success: false, message: '❗ No se pudo conectar con el dispositivo.' };
	}
}

/**
 * Envía un mensaje al ESP32.
 * @param lastOctet - El último octeto de la dirección IP.
 * @param message - El mensaje a enviar.
 */
export async function sendMessage(lastOctet: string, message: string): Promise<ApiResponse> {
	// La implementación sería muy similar a sendAlert,
	// probablemente cambiando el endpoint y enviando el mensaje en el cuerpo.
	console.log(`Enviando mensaje "${message}" a ${API_BASE_URL}.${lastOctet}`);
	// Simulación de éxito
	return Promise.resolve({ success: true, message: '✅ ¡Mensaje enviado!' });
}
