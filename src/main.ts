import './main.tw.css';
import { sendAlert, sendMessage } from './api'; // Asumiendo que crea un archivo de API

const alertButton = document.querySelector<HTMLButtonElement>('#alert-button');
const messageButton = document.querySelector<HTMLButtonElement>('#message-button');
const messageInput = document.querySelector<HTMLInputElement>('#message-input');
const alertStatus = document.querySelector<HTMLParagraphElement>('#alert-status');

const ipInput = document.querySelector<HTMLInputElement>('#ip-input');
const ipError = document.querySelector<HTMLParagraphElement>('#ip-error');

function getLastOctet(): string | null {
	if (!ipInput || !ipError) return null;

	const value = ipInput.value.trim();
	const num = parseInt(value);

	// Validación: debe ser un número entero entre 1 y 254
	if (isNaN(num) || num < 1 || num > 254 || value.includes('.')) {
		ipError.textContent = '❗ IP inválida. Debe ser un número entre 1 y 254.';
		return null;
	}

	ipError.textContent = ''; // Limpiar errores
	return value;
}

const ALERT_COOLDOWN_SECONDS = 10;
let isAlertCoolingDown = false; // Bandera para controlar el rate limit

/**
 * Muestra un mensaje de estado en el elemento de la alerta.
 * @param message - El mensaje a mostrar.
 * @param type - 'success', 'error', 'info', o 'loading'.
 */
function updateAlertStatus(message: string, type: 'success' | 'error' | 'info' | 'loading' = 'info') {
    if (!alertStatus) return;

    alertStatus.className = 'mt-3 text-sm text-center transition-colors duration-200';

    if (type === 'success') {
        alertStatus.classList.add('text-green-600', 'dark:text-green-400');
    } else if (type === 'error') {
        alertStatus.classList.add('text-red-600', 'dark:text-red-400', 'font-bold');
    } else if (type === 'loading') {
        alertStatus.classList.add('text-blue-600', 'dark:text-blue-400');
        // Aquí podría agregar un spinner si quisiera
    } else { // info
        alertStatus.classList.add('text-gray-500', 'dark:text-gray-400');
    }
    alertStatus.textContent = message;
}

// --- FUNCIÓN PRINCIPAL DE ALERTA ---

async function handleSendAlert() {
	if (!alertButton || isAlertCoolingDown) return;

	// Obtener el último octeto
	const lastOctet = getLastOctet();
	if (!lastOctet) return; // Detener si la IP no es válida

	isAlertCoolingDown = true;
	alertButton.disabled = true;

	// Muestra estado de carga
	updateAlertStatus('⏳ Enviando alerta...', 'loading');

	try {
		const result = await sendAlert(lastOctet);

		if (result.success) {
			updateAlertStatus(result.message, 'success');
		} else {
			// Muestra el mensaje de error de la API (incluye Timeout y errores de red)
			updateAlertStatus(result.message, 'error');
		}
	} catch (e) {
		// En caso de un error inesperado en la llamada a sendAlert
		updateAlertStatus('❗ Error interno al procesar la solicitud.', 'error');
	}

	let timeRemaining = ALERT_COOLDOWN_SECONDS;
	const interval = setInterval(() => {
		timeRemaining -= 1;
		if (timeRemaining > 0) {
			// Muestra la cuenta regresiva en el botón
			alertButton.textContent = `Reintentar en (${timeRemaining}s)`;
		} else {
			clearInterval(interval);
			isAlertCoolingDown = false;
			alertButton.disabled = false;
			alertButton.textContent = 'Disparar Alerta'; // Texto original
			updateAlertStatus('Listo para una nueva alerta.', 'info');
		}
	}, 1000);
}


// --- FUNCIÓN PRINCIPAL DE MENSAJE ---

async function handleSendMessage() {
	if (!messageInput || !messageButton) return;

	const message = messageInput.value.trim();
	if (message.length === 0) {
		updateAlertStatus('El mensaje no puede estar vacío.', 'error');
		return;
	}

	// Obtener el último octeto
	const lastOctet = getLastOctet();
	if (!lastOctet) return; // Detener si la IP no es válida

	messageButton.disabled = true;
	const originalText = messageButton.textContent;
	messageButton.textContent = 'Enviando...';
	updateAlertStatus('⏳ Enviando mensaje...', 'loading');

	try {
		const result = await sendMessage(lastOctet, message);

		if (result.success) {
			updateAlertStatus(result.message, 'success');
			messageInput.value = ''; // Limpiar el input al éxito
		} else {
			updateAlertStatus(result.message, 'error');
		}
	} catch (e) {
		updateAlertStatus('❗ Error interno al procesar el mensaje.', 'error');
	} finally {
		messageButton.disabled = false;
		messageButton.textContent = originalText;
	}
}


// --- ASIGNACIÓN DE EVENTOS ---
if (alertButton) {
    alertButton.addEventListener('click', handleSendAlert);
    updateAlertStatus('Listo para enviar la alerta.', 'info'); // Estado inicial
}

if (messageButton) {
    messageButton.addEventListener('click', handleSendMessage);
}
