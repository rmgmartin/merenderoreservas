// Configuración de Google API
const CLIENT_ID = '105103493358360477836.apps.googleusercontent.com'';
const API_KEY = '877ae34213ed93839ae7ff96068a15abba1ed5e0';
const DISCOVERY_DOC = 'https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest';
const SCOPES = 'https://www.googleapis.com/auth/calendar.events';

const authorizeButton = document.getElementById('authorize_button');
const signoutButton = document.getElementById('signout_button');
const eventForm = document.getElementById('eventForm');

function handleClientLoad() {
    gapi.load('client:auth2', initClient);
}

function initClient() {
    gapi.client.init({
        apiKey: API_KEY,
        clientId: CLIENT_ID,
        discoveryDocs: [DISCOVERY_DOC],
        scope: SCOPES,
    }).then(() => {
        // Manejar cambios de inicio de sesión
        gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);

        // Actualizar UI basado en el estado actual
        updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());

        authorizeButton.onclick = handleAuthClick;
        signoutButton.onclick = handleSignoutClick;
    });
}

function updateSigninStatus(isSignedIn) {
    if (isSignedIn) {
        authorizeButton.style.display = 'none';
        signoutButton.style.display = 'block';
        eventForm.style.display = 'block';
    } else {
        authorizeButton.style.display = 'block';
        signoutButton.style.display = 'none';
        eventForm.style.display = 'none';
    }
}

function handleAuthClick() {
    gapi.auth2.getAuthInstance().signIn();
}

function handleSignoutClick() {
    gapi.auth2.getAuthInstance().signOut();
}

eventForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const event = {
        summary: document.getElementById('summary').value,
        location: document.getElementById('location').value,
        description: document.getElementById('description').value,
        start: {
            dateTime: new Date(document.getElementById('start').value).toISOString(),
            timeZone: 'America/Los_Angeles',
        },
        end: {
            dateTime: new Date(document.getElementById('end').value).toISOString(),
            timeZone: 'America/Los_Angeles',
        },
    };

    gapi.client.calendar.events.insert({
        calendarId: 'primary',
        resource: event,
    }).then((response) => {
        alert(`Evento creado: ${response.result.htmlLink}`);
    }).catch((error) => {
        console.error('Error al crear evento:', error);
    });
});

// Cargar cliente al iniciar la página
document.addEventListener('DOMContentLoaded', handleClientLoad);
