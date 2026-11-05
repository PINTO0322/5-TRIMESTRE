import { ApiService } from './core/ApiService.js';
import { Loader } from './core/Loader.js';
import { LocalStorage } from './core/LocalStorage.js';

const login = document.querySelector('#login-container');
const panel = document.querySelector('#main-layout');
const navbar = document.querySelector('#navbar');
const contenido = document.querySelector('#app-content');

login.innerHTML = `
    <form class="card shadow-sm p-4 mx-auto" style="width: min(100%, 26rem)">
        <h1 class="h4 mb-3">Iniciar sesión en PQRS</h1>
        <label class="form-label" for="usuario">Usuario o correo</label>
        <input class="form-control mb-3" id="usuario" name="username"
               autocomplete="username" required>
        <label class="form-label" for="clave">Contraseña</label>
        <input class="form-control mb-3" id="clave" name="password"
               type="password" autocomplete="current-password" required>
        <button class="btn btn-primary" type="submit">Entrar</button>
        <p class="text-danger mt-3 mb-0" role="alert" hidden></p>
    </form>
`;

navbar.classList.add('d-flex', 'justify-content-between', 'align-items-center', 'p-3');
navbar.innerHTML = `
    <strong>PQRS</strong>
    <button class="btn btn-outline-secondary btn-sm" type="button">Cerrar sesión</button>
`;
contenido.innerHTML = '<h1 class="h3">Panel de PQRS</h1><p id="saludo"></p>';

const formulario = login.querySelector('form');
const mensaje = formulario.querySelector('[role="alert"]');
const entrar = formulario.querySelector('button');

function mostrarLogin() {
    LocalStorage.remove('token');
    panel.classList.add('d-none');
    login.classList.remove('d-none');
    formulario.reset();
    mensaje.hidden = true;
}

async function mostrarPanel(usuario) {
    const sidebar = document.querySelector('#sidebar');
    sidebar.replaceChildren();

    const respuesta = await ApiService.get('/auth/permissions');
    if (respuesta.status === 401) {
        mostrarLogin();
        return;
    }

    const modulos = Array.isArray(respuesta.data?.data) ? respuesta.data.data : [];
    const visibles = modulos.filter(modulo => modulo.permissions?.includes('view'));

    const menu = document.createElement('nav');
    menu.className = 'p-3 text-white';
    menu.setAttribute('aria-label', 'Módulos de PQRS');

    if (!respuesta.ok || visibles.length === 0) {
        const aviso = document.createElement('p');
        aviso.textContent = respuesta.ok
            ? 'Tu cuenta no tiene módulos asignados.'
            : 'No se pudieron cargar tus módulos.';
        menu.append(aviso);
    }

    for (const modulo of visibles) {
        const opcion = document.createElement('div');
        opcion.className = 'px-2 py-2';
        opcion.textContent = modulo.module_name;
        menu.append(opcion);
    }

    sidebar.append(menu);
    document.querySelector('#saludo').textContent = `Bienvenido, ${usuario.username}`;
    formulario.reset();
    login.classList.add('d-none');
    panel.classList.remove('d-none');
}

formulario.addEventListener('submit', async (evento) => {
    evento.preventDefault();
    mensaje.hidden = true;
    entrar.disabled = true;

    try {
        const datos = Object.fromEntries(new FormData(formulario));
        const respuesta = await ApiService.post('/auth/login', datos);

        if (!respuesta.ok || !respuesta.data?.token || !respuesta.data?.user) {
            mensaje.textContent = respuesta.status === 401
                ? 'Usuario o contraseña incorrectos.'
                : 'No se pudo iniciar sesión. Revisa los datos y vuelve a intentar.';
            mensaje.hidden = false;
            return;
        }

        LocalStorage.set('token', respuesta.data.token);
        await mostrarPanel(respuesta.data.user);
    } finally {
        entrar.disabled = false;
    }
});

navbar.querySelector('button').addEventListener('click', mostrarLogin);

async function iniciar() {
    try {
        if (LocalStorage.get('token')) {
            const respuesta = await ApiService.get('/auth/me');
            if (respuesta.ok && respuesta.data?.user) {
                await mostrarPanel(respuesta.data.user);
                return;
            }
        }

        mostrarLogin();
    } finally {
        Loader.hide();
    }
}

iniciar();