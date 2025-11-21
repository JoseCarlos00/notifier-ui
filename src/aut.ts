// TODO(developer): Set to client ID and API key from the Developer Console
const CLIENT_ID = import.meta.env.VITE_CLIENT_ID;
const API_KEY = import.meta.env.VITE_API_KEY;

// Discovery doc URL for APIs used by the quickstart
const DISCOVERY_DOC = 'https://sheets.googleapis.com/$discovery/rest?version=v4';

// Authorization scopes required by the API; multiple scopes can be
// included, separated by spaces.
const SCOPES = 'https://www.googleapis.com/auth/spreadsheets.readonly';

// Declaraciones para las librerías de Google que se cargan globalmente
declare const gapi: any;
declare const google: any;

const gapiLoadedStorage = JSON.parse(window.localStorage.getItem('gapiLoaded') || 'false');
const gisLoadedStorage = JSON.parse(window.localStorage.getItem('gisLoaded') || 'false');


let tokenClient: any;
let gapiInited = false;
let gisInited = false;

document.querySelector('#gapi')?.addEventListener('load', gapiLoaded);
document.querySelector('#gis')?.addEventListener('load', gisLoaded);

const authorizeButton = document.getElementById('authorize_button');
const signoutButton = document.getElementById('signout_button');
const content = document.getElementById('content');

authorizeButton?.addEventListener('click', handleAuthClick);
signoutButton?.addEventListener('click', handleSignoutClick);

authorizeButton && (authorizeButton.style.visibility = 'hidden');
signoutButton && (signoutButton.style.visibility = 'hidden');


/**
 * Enables user interaction after all libraries are loaded.
 */
function maybeEnableButtons() {
	if (gapiInited && gisInited) {
		authorizeButton && (authorizeButton.style.visibility = 'visible');
	}
}

/**
 *  Sign in the user upon button click.
 */
function handleAuthClick() {
	tokenClient.callback = async (resp: any) => {
		if (resp.error !== undefined) {
			throw resp;
		}
		signoutButton && (signoutButton.style.visibility = 'visible');
		authorizeButton && (authorizeButton.innerText = 'Refresh');
		await listMajors();
	};

	if (gapi.client.getToken() === null) {
		// Prompt the user to select a Google Account and ask for consent to share their data
		// when establishing a new session.
		tokenClient.requestAccessToken({ prompt: 'consent' });
	} else {
		// Skip display of account chooser and consent dialog for an existing session.
		tokenClient.requestAccessToken({ prompt: '' });
	}
}

/**
 *  Sign out the user upon button click.
 */
function handleSignoutClick() {
	const token = gapi.client.getToken();
	if (token !== null) {
		google.accounts.oauth2.revoke(token.access_token);
		gapi.client.setToken('');
		content && (content.innerText = '');
		authorizeButton && (authorizeButton.innerText = 'Authorize');
		signoutButton && (signoutButton.style.visibility = 'hidden');
	}
}

/**
 * Print the names and majors of students in a sample spreadsheet:
 * https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit
 */
async function listMajors() {
	let response;
	try {
		// Fetch first 10 files
		response = await gapi.client.sheets.spreadsheets.values.get({
			spreadsheetId: '1jYpuNqcyb8RVOgGJ2tXOKZuJ8hnoFsq7Dp2hX8ddczM',
			range: 'RF!C:I',
		});
	} catch (err: any) {
		content && (content.innerText = err.message);
		return;
	}
	const range = response.result;
	if (!range || !range.values || range.values.length == 0) {
		content && (content.innerText = 'No values found.');
		return;
	}
	// Flatten to string to display
  console.log(range.values);
  
	// const output = range.values.reduce((str: string, row: string[]) => `${str}${row[0]}, ${row[4]}\n`, 'Name, Major:\n');
	content && (content.innerText = 'Output In Console');
}


/**
 * Callback after api.js is loaded.
 */
function gapiLoaded() {
	console.log('gapiLoaded function');

	gapi.load('client', initializeGapiClient);
}

/**
 * Callback after the API client is loaded. Loads the
 * discovery doc to initialize the API.
 */
async function initializeGapiClient() {
	await gapi.client.init({
		apiKey: API_KEY,
		discoveryDocs: [DISCOVERY_DOC],
	});
	gapiInited = true;
	maybeEnableButtons();
}

/**
 * Callback after Google Identity Services are loaded.
 */
function gisLoaded() {
  console.log('gisLoaded function');
  
	tokenClient = google.accounts.oauth2.initTokenClient({
		client_id: CLIENT_ID,
		scope: SCOPES,
		callback: '', // defined later
	});
	gisInited = true;
	maybeEnableButtons();
}

if (gapiLoadedStorage) {
	gapiLoaded();
}

if (gisLoadedStorage) {
	gisLoaded();
}


console.log({ gapiLoadedStorage, gisLoadedStorage, tokenClient });
