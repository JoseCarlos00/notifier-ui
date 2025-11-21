const ipDispositivo = '192.168.15.94'; // Reemplaza con la IP real del dispositivo Android
const puerto = 3000;
const mensajeDefault = 'Hay pedido de Mariano';


export async function sendMessage(mensaje = mensajeDefault) {
	await fetch(`http://${ipDispositivo}:${puerto}/message`, {
		method: 'POST',
		// Opcional: Especifica que el cuerpo es texto plano
		headers: {
			'Content-Type': 'text/plain',
		},
		// El cuerpo es el string del mensaje
		body: mensaje,
	})
		.then((response) => {
			if (response.ok) {
				console.log('✅ Mensaje enviado con éxito. El servidor Android respondió 200 OK.');
				return response.text();
			}
			// Manejo de errores si el servidor responde 400, 404, etc.
			throw new Error(`❌ Error ${response.status}: El servidor no aceptó el mensaje.`);
		})
		.then((text) => console.log('Respuesta:', text))
		.catch((error) => console.error('Error de red o CORS:', error));
}

export async function sentAlert() {
	await fetch(`http://${ipDispositivo}:${puerto}/alert`, {
		method: 'GET',
	})
		.then((response) => {
			if (response.ok) {
				console.log('✅ Alerta enviada con. El servidor Android respondió 200 OK.');
				console.log(response);
			}
			// Manejo de errores si el servidor responde 400,
		})
		.catch((error) => console.error('Error de red o CORS:', error));
}
