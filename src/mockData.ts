// @ts-ignore
import rawData from './mockData.json';


export interface Device {
	equipo: string;
	modelo: string;
	usuario: string;
	correo: string;
	aliasUsuario: string;
	ip: string;
	macAddress: string;
}


// Función para transformar los datos a un formato de objeto más utilizable
const transformData = (data: string[][]): Device[] => {
	return data.map((item) => ({
		equipo: item[0] ?? 'N/A',
		modelo: item[1] ?? 'N/A',
		usuario: item[2] ?? 'N/A',
		correo: item[3] ?? 'N/A',
		aliasUsuario: item[4] ?? 'N/A',
		ip: item[5] ?? 'N/A',
		macAddress: item[6] ?? 'N/A',
	}));
};

export const DEVICES: Device[] = transformData(rawData);
console.log(DEVICES);



// Función para obtener el último octeto de la IP
export const getDeviceOctet = (ip: string): string => ip.split('.').pop() || '';
