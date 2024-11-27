const API_URL = 'http://localhost:3000/reservas';
const form = document.getElementById('reservaForm');
const historial = document.getElementById('reservaHistorial');

// Enviar reserva al servidor
function enviarReservaAlServidor(reserva) {
    return fetch(API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(reserva),
    }).then((response) => {
        if (!response.ok) throw new Error('Error al guardar la reserva en el servidor.');
        return response.json();
    });
}

// Obtener reservas desde el servidor
function obtenerReservasDelServidor() {
    return fetch(API_URL)
        .then((response) => {
            if (!response.ok) throw new Error('Error al obtener las reservas del servidor.');
            return response.json();
        });
}

// Manejar el envío del formulario
form.addEventListener('submit', function (e) {
    e.preventDefault();

    const nombre = document.getElementById('nombre').value;
    const fecha = document.getElementById('fecha').value;
    const horarios = Array.from(document.querySelectorAll('input[name="horarios"]:checked')).map((input) => input.value);

    if (horarios.length === 0) {
        alert('Por favor, selecciona al menos un horario.');
        return;
    }

    const reserva = { nombre, fecha, horarios };

    // Guardar reserva en el servidor
    enviarReservaAlServidor(reserva)
        .then(() => {
            alert('Reserva enviada correctamente.');
            form.reset();
            actualizarHistorial(); // Actualizar historial después de enviar
        })
        .catch((error) => {
            console.error('Error:', error);
        });
});

// Actualizar el historial de reservas
function actualizarHistorial() {
    obtenerReservasDelServidor()
        .then((reservas) => {
            historial.innerHTML = '';
            reservas.forEach((reserva) => {
                const li = document.createElement('li');
                li.textContent = `Nombre: ${reserva.nombre}, Fecha: ${reserva.fecha}, Horarios: ${reserva.horarios.join(', ')}`;
                historial.appendChild(li);
            });
        })
        .catch((error) => {
            console.error('Error:', error);
        });
}

// Inicializar historial al cargar
actualizarHistorial();
