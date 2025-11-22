import './main.tw.css';
import { sendAlert, sendMessage } from './api'; // Asumiendo que crea un archivo de API
import { DEVICES, type Device, getDeviceOctet } from './mockData';

// --- REFERENCIAS DEL DOM ---
const alertButton = document.querySelector<HTMLButtonElement>('#alert-button');
const messageButton = document.querySelector<HTMLButtonElement>('#message-button');
const messageInput = document.querySelector<HTMLInputElement>('#message-input');
const alertStatus = document.querySelector<HTMLParagraphElement>('#alert-status');

const ipInput = document.querySelector<HTMLInputElement>('#ip-input');
const ipError = document.querySelector<HTMLParagraphElement>('#ip-error');

// --- REFERENCIAS DE DISPOSITIVOS ---
const searchInput = document.querySelector<HTMLInputElement>('#search-input');
const autocompleteResults = document.querySelector<HTMLDivElement>('#autocomplete-results');
const deviceDetails = document.querySelector<HTMLDivElement>('#device-details');

// --- ESTADO GLOBAL ---
let selectedDevice: Device | null = null;
const ALERT_COOLDOWN_SECONDS = 10;
let isAlertCoolingDown = false;

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
	} else {
		// info
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

// --- LÓGICA DE DISPOSITIVOS Y BÚSQUEDA ---

const recortarTexto = (texto: string, limite: number) => {
	if (!texto) return '';
	
  return texto.length > limite
    ? texto.substring(0, limite) + "..."
    : texto;
}

/**
 * Filtra los dispositivos y renderiza los resultados en el dropdown personalizado.
 */
function handleAutocompleteSearch() {
	if (!searchInput || !autocompleteResults) return;

	const searchTerm = searchInput.value.toLowerCase().trim();
	autocompleteResults.innerHTML = '';

	if (searchTerm.length < 2) {
		autocompleteResults.classList.add('hidden');
		return;
	}

	const filtered = DEVICES.filter(
		(device) =>
			device.equipo?.toLowerCase().includes(searchTerm) ||
			device.usuario?.toLowerCase().includes(searchTerm) ||
			device.aliasUsuario?.toLowerCase().includes(searchTerm) ||
			device.ip.includes(searchTerm) // Permitir búsqueda por IP
	);

	if (filtered.length === 0) {
		autocompleteResults.classList.add('hidden');
		return;
	}
	// 
	// 1. Renderizar los resultados
	filtered.slice(0, 10).forEach((device) => {
		// Limitar a 10 resultados para no sobrecargar
		const resultItem = document.createElement('div');
		resultItem.className =
			'p-3 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition flex justify-between items-center';
		resultItem.dataset.ip = device.ip;

		// const resultDefaultUser = `<p class="font-semibold">${device.usuario ||device.aliasUsuario || 'N/A'}</p>`
		const resultDefaultUser = `<p class="font-semibold">Default User</p>`
		const marianoResult = device.usuario + " - " + recortarTexto(device.aliasUsuario, 14)
		
		resultItem.innerHTML = `
            <div>
                ${/^mariano\d+/.test(device.usuario.toLowerCase()) ? marianoResult : resultDefaultUser}
                <p class="text-xs text-gray-500 dark:text-gray-400">${device.equipo} | ${device.ip}</p>
            </div>
        `;
		autocompleteResults.appendChild(resultItem);
	});

	// 2. Mostrar el dropdown
	autocompleteResults.classList.remove('hidden');
}

/**
 * Maneja el clic en uno de los resultados del autocompletado.
 */
function handleResultClick(event: MouseEvent) {
	const target = event.target as HTMLElement;
	// Buscar el elemento padre que tenga el atributo data-ip
	const resultItem = target.closest('div[data-ip]');

	if (resultItem) {
		const selectedIp = resultItem.getAttribute('data-ip');
		if (!selectedIp || !searchInput || !ipInput || !autocompleteResults) return;

		// 1. Encontrar el dispositivo
		selectedDevice = DEVICES.find((d) => d.ip === selectedIp) || null;

		// 2. Rellenar el input de búsqueda y el input de IP
		if (selectedDevice) {
			searchInput.value = selectedDevice.aliasUsuario || selectedDevice.usuario || selectedDevice.equipo;
			ipInput.value = getDeviceOctet(selectedDevice.ip);
			renderDeviceDetails(selectedDevice);
		}

		// 3. Ocultar el dropdown
		autocompleteResults.classList.add('hidden');
		if (ipError) ipError.textContent = '';
	}
}

/**
 * Muestra los detalles del dispositivo seleccionado.
 */
function renderDeviceDetails(device: Device | null) {
	if (!deviceDetails) return;

	if (device) {
		deviceDetails.innerHTML = `
            <h4 class="font-semibold text-base mb-1">${device.usuario || device.aliasUsuario || 'N/A'}</h4>
            <p class="text-sm">
                <strong>Equipo:</strong> ${device.equipo} (${device.modelo})<br>
                <strong>IP:</strong> <code class="bg-yellow-100 dark:bg-yellow-900 px-1 rounded">${device.ip}</code><br>
                <strong>Usuario:</strong> ${device.usuario || 'N/A'}
                ${device.aliasUsuario ? `<br><strong>Alias:</strong> ${device.aliasUsuario}` : ''}
            </p>
        `;
	} else {
		deviceDetails.innerHTML = `<p class="text-gray-500 dark:text-gray-400">Seleccione un dispositivo para ver los detalles.</p>`;
	}
}

// Ocultar el dropdown al hacer clic fuera
document.addEventListener('click', (e) => {
	if (!autocompleteResults || !searchInput) return;
	if (!autocompleteResults.contains(e.target as Node) && e.target !== searchInput) {
		autocompleteResults.classList.add('hidden');
	}
});

// --- INICIALIZACIÓN DE LA APLICACIÓN ---
// 1. Eventos de Dispositivos y Búsqueda
// Usar 'input' para filtrar en tiempo real
searchInput?.addEventListener('input', handleAutocompleteSearch);

// Asignar listener para manejar la selección de un resultado
autocompleteResults?.addEventListener('click', handleResultClick);

// 2. Eventos de Alerta
alertButton?.addEventListener('click', handleSendAlert);
updateAlertStatus('Listo para enviar la alerta.', 'info');

// 3. Eventos de Mensaje
messageButton?.addEventListener('click', handleSendMessage);
