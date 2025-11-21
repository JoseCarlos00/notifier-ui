// import './style.css';
import './main.tw.css';
// import { sentAlert, sendMessage } from './api'; // Asumiendo que crea un archivo de API

// 1. Referenciar Elementos del DOM (¡Usando TypeScript!)
const alertButton = document.querySelector<HTMLButtonElement>('#alert-button');
const messageButton = document.querySelector<HTMLButtonElement>('#message-button');
const messageInput = document.querySelector<HTMLInputElement>('#message-input');
const alertStatus = document.querySelector<HTMLParagraphElement>('#alert-status');

// 2. Lógica de Eventos
if (alertButton && alertStatus) {
	alertButton.addEventListener('click', () => {
		// Implementar la lógica de envío, timeout y rate limit aquí
		console.log('Se hizo click en Alerta');
		// Ejemplo: sendAlert();
	});
}

if (messageButton && messageInput) {
	messageButton.addEventListener('click', () => {
		const message = messageInput.value.trim();
		if (message.length > 0) {
			// Implementar la lógica de envío aquí
			console.log('Mensaje a enviar:', message);
			// Ejemplo: sendMessage(message);
		} else {
			// Mostrar error de validación
			console.error('El mensaje no puede estar vacío.');
		}
	});
}

// 3. (Opcional) Inicialización o más lógica de componentes...
// main.ts

// --- 1. Lógica de Persistencia del Modo Oscuro ---

const htmlElement = document.documentElement; // Es el elemento <html>
const toggleButton = document.querySelector<HTMLButtonElement>('#theme-toggle');

/**
 * Aplica el tema guardado en localStorage o el modo preferido del sistema.
 */
function applyTheme() {
	// Prioridad 1: Comprobar si hay un tema guardado explícitamente por el usuario.
	const savedTheme = localStorage.getItem('theme');
	if (savedTheme === 'light') {
		htmlElement.classList.remove('dark');
		updateToggleButton('☀️');
		return; // Salimos para no aplicar más lógica
	}
	if (savedTheme === 'dark') {
		htmlElement.classList.add('dark');
		updateToggleButton('🌙');
		return; // Salimos
	}
	// Prioridad 2: Si no hay nada guardado, respetar la clase inicial del HTML o la preferencia del sistema.
	if (htmlElement.classList.contains('dark')) {
		updateToggleButton('🌙'); // El HTML ya está en modo oscuro, solo actualizamos el botón.
	} else {
        htmlElement.classList.remove('dark');
        updateToggleButton('☀️'); // Actualiza el icono a sol
    }
}

/**
 * Actualiza el icono del botón para reflejar el modo actual.
 */
function updateToggleButton(icon: string) {
    if (toggleButton) {
        toggleButton.textContent = icon;
        toggleButton.setAttribute('aria-label', icon === '☀️' ? 'Cambiar a modo oscuro' : 'Cambiar a modo claro');
    }
}

/**
 * Alterna entre modo claro y oscuro.
 */
function toggleTheme() {
  console.log('toggle Theme');
  
    if (htmlElement.classList.contains('dark')) {
        // Cambiar a claro
        htmlElement.classList.remove('dark');
        localStorage.setItem('theme', 'light');
        updateToggleButton('☀️');
    } else {
        // Cambiar a oscuro
        htmlElement.classList.add('dark');
        localStorage.setItem('theme', 'dark');
        updateToggleButton('🌙');
    }
}

// --- 2. Inicialización y Event Listeners ---

// Aplica el tema tan pronto como se carga el script
applyTheme(); 

// Asigna el evento al botón de alternancia
if (toggleButton) {
    toggleButton.addEventListener('click', toggleTheme);
}

// --- 3. (Aquí iría su lógica de Alerta y Mensaje, como en el ejemplo anterior) ---
// const alertButton = document.querySelector<HTMLButtonElement>('#alert-button');
// ... el resto de su código de la aplicación
