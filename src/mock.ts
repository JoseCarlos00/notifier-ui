// src/mockData.ts

export interface Device {
	equipo: string;
	modelo: string;
	usuario: string;
	correo: string;
	aliasUsuario: string;
	ip: string;
	macAddress: string;
}

// Datos brutos, con la misma estructura que su tabla
const rawData: string[][] = [
	// El primer array de datos (FM00001) no se incluyó en su mock, lo agrego para completar la estructura:
	[
		'FM00001',
		'MEMOR10',
		'DavidGordillo',
		'david.gordillo@fantasiasmiguel.com.mx',
		'',
		'192.168.15.173',
		'D0:4E:50:F8:50:11',
	],
	// ... (el resto de sus datos) ...
	[
		'FM00002',
		'MEMOR10',
		'Mariano03',
		'mariano03@fantasiasmiguel.com.mx',
		'Edith Ortega',
		'192.168.15.174',
		'D0:4E:50:F8:5F:28',
	],
	[
		'FM00003',
		'MEMOR10',
		'Mariano04',
		'mariano04@fantasiasmiguel.com.mx',
		'Jorgue Ezpinoza Martinez',
		'192.168.15.175',
		'D0:4E:50:F8:5F:62',
	],
	[
		'FM00004',
		'MEMOR10',
		'Mariano05',
		'mariano05@fantasiasmiguel.com.mx',
		'Diana Castillo',
		'192.168.15.176',
		'D0:4E:50:F8:4D:07',
	],
	['FM00005', 'MEMOR10', '', '', '', '192.168.15.177', 'D0:4E:50:F8:63:46'],
	[
		'FM00006',
		'MEMOR10',
		'Mariano07',
		'mariano07@fantasiasmiguel.com.mx',
		'Adrian Esquivel',
		'192.168.15.178',
		'D0:4E:50:F8:66:62',
	],
	[
		'FM00007',
		'MEMOR10',
		'Mariano01',
		'mariano01@fantasiasmiguel.com.mx',
		'Angel Rodrigo Rocha Martinez',
		'192.168.15.179',
		'D0:4E:50:F8:67:DC',
	],
	[
		'FM00008',
		'MEMOR10',
		'Mariano08',
		'mariano08@fantasiasmiguel.com.mx',
		'Sadoc Luna',
		'192.168.15.180',
		'D0:4E:50:F8:6B:EA',
	],
	[
		'FM00009',
		'MEMOR10',
		'Mariano09',
		'mariano09@fantasiasmiguel.com.mx',
		'Eduardo Reyes',
		'192.168.15.181',
		'D0:4E:50:F8:69:2E',
	],
	[
		'FM00010',
		'MEMOR10',
		'Mariano10',
		'mariano10@fantasiasmiguel.com.mx',
		'Itzel 2do Piso',
		'192.168.15.183',
		'D0:4E:50:F8:63:E2',
	],
	['FM00011', 'MEMOR10', 'Ana Garcia', 'Ana.garcia@fantasiasmiguel.com.mx', '', '192.168.15.185', 'D0:4E:50:F8:69:0E'],
	[
		'FM00012',
		'MEMOR10',
		'Mariano11',
		'mariano11@fantasiasmiguel.com.mx',
		'Fernando Vazquez',
		'192.168.15.186',
		'D0:4E:50:F8:6A:D6',
	],
	[
		'FM00013',
		'MEMOR11',
		'Mariano12',
		'mariano12@fantasiasmiguel.com.mx',
		'Israel Mendez',
		'192.168.15.53',
		'4C: 11:54:7A:49:F1',
	],
	[
		'FM00014',
		'MEMOR11',
		'Mariano13',
		'mariano13@fantasiasmiguel.com.mx',
		'Rodolfo de la Riva',
		'192.168.15.54',
		'4C: 11:54:7A:4D:5C',
	],
	['FME00100', 'UROVO DT50', 'Prestado Jesus Morales', '', '', '192.168.15.55', 'b4:29:3d:86:9d:30'],
	[
		'FME00101',
		'UROVO DT50',
		'Yostin Nathanael Arias Cruz',
		'yac@fantasiasmiguel.com.mx',
		'',
		'192.168.15.56',
		'b4:29:3d:86:9d:12',
	],
	[
		'FME00102',
		'UROVO DT50',
		'Victoria Rodriguez',
		'victoria.rodriguez@fantasiasmiguel.com.mx',
		'',
		'192.168.15.57',
		'b4:29:3d:86:9c:b3',
	],
];

// Función para transformar los datos a un formato de objeto más utilizable
const transformData = (data: string[][]): Device[] => {
	return data.map((item) => ({
		equipo: item[0],
		modelo: item[1],
		usuario: item[2],
		correo: item[3],
		aliasUsuario: item[4],
		ip: item[5],
		macAddress: item[6],
	}));
};

export const DEVICES: Device[] = transformData(rawData);

// Función para obtener el último octeto de la IP
export const getDeviceOctet = (ip: string): string => ip.split('.').pop() || '';
