// Función para mostrar usuarios en el panel de administrador
function mostrarUsuarios() {
    const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
    const listaUsuarios = document.getElementById("tabla-usuarios").getElementsByTagName('tbody')[0];
    const listaUsuariosDiv = document.getElementById("lista-usuarios");

    if (!listaUsuarios) return;

    listaUsuarios.innerHTML = ""; // Limpiar lista antes de mostrarla

    if (usuarios.length === 0) {
        listaUsuarios.innerHTML = "<tr><td colspan='4'>No hay usuarios registrados.</td></tr>";
    } else {
        usuarios.forEach((user, index) => {
            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td>${user.email}</td>
                <td><input type="text" value="${user.password}" id="password-${index}" /></td>
                <td>${user.admin ? "Administrador" : "Usuario regular"}</td>
                <td>
                    <button onclick="editarUsuario(${index})" class="editar">Editar</button>
                    <button onclick="eliminarUsuario('${user.email}')" class="eliminar">Eliminar</button>
                </td>
            `;
            listaUsuarios.appendChild(tr);
        });
    }

    listaUsuariosDiv.style.display = 'block';  // Mostrar tabla de usuarios
}

// Función para eliminar un usuario
function eliminarUsuario(email) {
    let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
    usuarios = usuarios.filter(user => user.email !== email);

    // No permitir eliminar al administrador predeterminado
    if (email === "admin@tienda.com") {
        alert("No puedes eliminar al administrador predeterminado.");
        return;
    }

    localStorage.setItem("usuarios", JSON.stringify(usuarios));
    alert(`Usuario ${email} eliminado exitosamente.`);
    mostrarUsuarios();  // Actualizar la lista de usuarios
}

// Función para editar un usuario (cambiar contraseña y/o email)
function editarUsuario(index) {
    const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
    const usuario = usuarios[index];
    const nuevaPassword = document.getElementById(`password-${index}`).value;

    // Solicitar nuevo email si se desea cambiar
    const nuevoEmail = prompt("Nuevo email (deja vacío para no cambiar)", usuario.email);
    if (nuevoEmail) {
        usuario.email = nuevoEmail;
    }

    // Si la contraseña cambia, la actualizamos
    if (nuevaPassword !== usuario.password) {
        usuario.password = nuevaPassword;
    }

    localStorage.setItem("usuarios", JSON.stringify(usuarios));
    alert("Usuario actualizado exitosamente.");
    mostrarUsuarios();  // Actualizar la lista de usuarios
}


// Función para mostrar historial de compras de todos los usuarios
function mostrarHistorialUsuarios() {
    const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
    const historialDiv = document.getElementById('historial-usuarios');
    const historialLista = document.getElementById('historial-usuarios-lista');

    // Verificar que los elementos DOM existan antes de continuar
    if (!historialDiv || !historialLista) return;

    // Mostrar u ocultar panel
    historialDiv.style.display = 'block'; // Mostrar historial
    document.getElementById("lista-usuarios").style.display = "none";
    document.getElementById("lista-productos-admin").style.display = "none";

    // Limpiar el contenido antes de mostrar el historial
    historialLista.innerHTML = "";

    let hayHistorial = false;

    // Recorrer cada usuario y mostrar su historial
    usuarios.forEach(user => {
        const historial = JSON.parse(localStorage.getItem(`historial_${user.email}`)) || [];

        // Si no hay historial, saltar al siguiente usuario
        if (historial.length === 0) return;

        hayHistorial = true;

        const divUsuarioHistorial = document.createElement('div');
        divUsuarioHistorial.classList.add('usuario-historial');
        divUsuarioHistorial.innerHTML = `
            <h3>Historial de compras de ${user.email}</h3>
            <ul>
                ${historial.map(compra => `
                    <li>
                        <strong>Producto:</strong> ${compra.nombre}, 
                        <strong>Total:</strong> Bs${compra.total.toFixed(2)}, 
                        <strong>Fecha:</strong> ${compra.fecha}
                        
                    </li>
                `).join('')}
            </ul>
            <hr>
        `;
        historialLista.appendChild(divUsuarioHistorial);
    });

    // Si no hay historial para ningún usuario, mostrar mensaje
    if (!hayHistorial) {
        historialLista.innerHTML = "<p>No hay historial de compras registrado.</p>";
    }
}


// Función para agregar un producto
function agregarProducto() {
    const nombre = prompt("Nombre del producto:");
    const precio = parseFloat(prompt("Precio del producto:"));
    const imagen = prompt("URL de la imagen del producto:");

    if (!nombre || isNaN(precio) || !imagen) {
        alert("Por favor ingrese nombre, precio y una imagen válida.");
        return;
    }

    // Guardar en localStorage
    let productos = JSON.parse(localStorage.getItem("productos")) || [];
    productos.push({ nombre, precio, imagen });
    localStorage.setItem("productos", JSON.stringify(productos));

    // Mostrar dinámicamente en la sección productos
    const container = document.querySelector(".productos-container");
    const nuevoProducto = document.createElement("div");
    nuevoProducto.classList.add("producto-item");
    nuevoProducto.setAttribute("data-nombre", nombre);
    nuevoProducto.setAttribute("data-precio", precio.toFixed(2));
    nuevoProducto.innerHTML = `
        <img src="${imagen}" alt="${nombre}">
        <h3>${nombre}</h3>
        <p>Bs${precio.toFixed(2)}</p>
        <button class="btn agregar-carrito">Agregar al carrito</button>
    `;

    container.appendChild(nuevoProducto);

    alert("Producto agregado correctamente.");
}
// funcion para mostrar  productos guardados en localstorage
function mostrarProductosDesdeLocalStorage() {
    const productos = JSON.parse(localStorage.getItem("productos")) || [];
    const contenedor = document.querySelector(".productos-container");

    contenedor.innerHTML = ""; // Limpiar antes de cargar

    productos.forEach((producto, index) => {
        const item = document.createElement("div");
        item.className = "producto-item";
        item.dataset.nombre = producto.nombre;
        item.dataset.precio = producto.precio;

        item.innerHTML = `
            <img src="${producto.imagen || 'https://via.placeholder.com/150'}" alt="${producto.nombre}">
            <h3>${producto.nombre}</h3>
            <p>Bs${producto.precio.toFixed(2)}</p>
            <button class="btn agregar-carrito">Agregar al carrito</button>
            <button class="btn eliminar-producto" onclick="eliminarProducto(${index})">🗑️ Eliminar</button>
        `;

        contenedor.appendChild(item);
    });
}
function eliminarProducto(index) {
    let productos = JSON.parse(localStorage.getItem("productos")) || [];
    const eliminado = productos.splice(index, 1); // Quitar el producto

    localStorage.setItem("productos", JSON.stringify(productos));
    alert(`Producto "${eliminado[0].nombre}" eliminado del catálogo.`);

    mostrarProductosDesdeLocalStorage(); // Recargar vista
}
// Función para eliminar un producto del catálogo
function eliminarProductoDelCatalogo() {
    const contenedor = document.getElementById("lista-productos-admin");
    const tabla = document.getElementById("tabla-productos-admin");
    tabla.innerHTML = ""; // Limpiar tabla

    let productos = JSON.parse(localStorage.getItem("productos")) || [];

    productos.forEach((producto, index) => {
        const fila = document.createElement("tr");

        fila.innerHTML = `
            <td>${producto.nombre}</td>
            <td>${producto.precio}</td>
            <td><button onclick="eliminarProducto(${index})">Eliminar</button></td>
        `;

        tabla.appendChild(fila);
    });

    contenedor.style.display = "block"; // Mostrar tabla
}
function eliminarProducto(index) {
    let productos = JSON.parse(localStorage.getItem("productos")) || [];
    const eliminado = productos.splice(index, 1); // Quitar el producto

    localStorage.setItem("productos", JSON.stringify(productos));
    alert(`Producto "${eliminado[0].nombre}" eliminado del catálogo.`);

    eliminarProductoDelCatalogo(); // Recargar vista
}


// Función para mostrar u ocultar el panel de administración
function mostrarPanelAdmin() {
    const panelAdmin = document.getElementById('adminPanel');
    panelAdmin.style.display = panelAdmin.style.display === 'none' || panelAdmin.style.display === '' ? 'block' : 'none';
}

function mostrarProductosDesdeLocalStorage() {
    const productos = JSON.parse(localStorage.getItem("productos")) || [];
    const container = document.querySelector(".productos-container");

    productos.forEach(producto => {
        const item = document.createElement("div");
        item.classList.add("producto-item");
        item.setAttribute("data-nombre", producto.nombre);
        item.setAttribute("data-precio", producto.precio.toFixed(2));
        item.innerHTML = `
            <img src="${producto.imagen}" alt="${producto.nombre}">
            <h3>${producto.nombre}</h3>
            <p>Bs${producto.precio.toFixed(2)}</p>
            <button class="btn agregar-carrito">Agregar al carrito</button>
        `;
        container.appendChild(item);
    });
}
/////////////////////////////////////////////////////////////
// Agregar novedad
function agregarNovedad() {
    const imagen = prompt("URL de la imagen de la novedad:");
    const titulo = prompt("Título de la novedad:");
    const descripcion = prompt("Descripción de la novedad:");
    const enlace = prompt("Enlace para ver más:");

    if (!imagen || !titulo || !descripcion || !enlace) {
        alert("Por favor ingrese todos los campos.");
        return;
    }

    let novedades = JSON.parse(localStorage.getItem("novedades")) || [];
    novedades.push({ imagen, titulo, descripcion, enlace });
    localStorage.setItem("novedades", JSON.stringify(novedades));

    mostrarNovedadesDesdeLocalStorage();
    alert("Novedad agregada correctamente.");
}

function mostrarNovedadesDesdeLocalStorage() {
    const novedades = JSON.parse(localStorage.getItem("novedades")) || [];
    const contenedor = document.querySelector(".novedades-container");

    // Limpiamos solo las novedades generadas dinámicamente
    contenedor.querySelectorAll(".novedad-item[data-dinamico]").forEach(item => item.remove());

    // Verificamos si el usuario es admin
    const usuario = JSON.parse(localStorage.getItem("usuario"));
    const esAdmin = usuario && usuario.rol === "admin";

    novedades.forEach((novedad, index) => {
        const item = document.createElement("div");
        item.className = "novedad-item";
        item.dataset.dinamico = "true";
        item.dataset.titulo = novedad.titulo;
        item.dataset.descripcion = novedad.descripcion;
        item.innerHTML = `
            <img src="${novedad.imagen}" alt="${novedad.titulo}">
            <div class="novedad-info">
                <h3>🔥 ${novedad.titulo}</h3>
                <p>${novedad.descripcion}</p>
                <a href="${novedad.enlace}" target="_blank" class="btn">Ver Más</a>
                ${esAdmin ? `<button class="btn eliminar-novedad" onclick="eliminarNovedad(${index})">🗑️ Eliminar</button>` : ""}
            </div>
        `;
        contenedor.appendChild(item);
    });
}

// Mostrar novedades en el panel de administración
function mostrarNovedadesEnPanelAdmin() {
    const novedades = JSON.parse(localStorage.getItem("novedades")) || [];
    const tabla = document.getElementById("tabla-novedades-admin");

    tabla.innerHTML = ""; // Limpiar antes de cargar

    novedades.forEach((novedad, index) => {
        const fila = document.createElement("tr");
        fila.innerHTML = `
            <td>${novedad.titulo}</td>
            <td>${novedad.descripcion}</td>
            <td><button class="btn" onclick="eliminarNovedad(${index})">🗑️ Eliminar</button></td>
        `;
        tabla.appendChild(fila);
    });

    document.getElementById("lista-novedades-admin").style.display = "block";
}

// Eliminar novedad
function eliminarNovedad(index) {
    let novedades = JSON.parse(localStorage.getItem("novedades")) || [];
    const eliminado = novedades.splice(index, 1);
    localStorage.setItem("novedades", JSON.stringify(novedades));
    alert(`Novedad "${eliminado[0].titulo}" eliminada.`);

    // Actualizar ambas vistas
    mostrarNovedadesDesdeLocalStorage();
    mostrarNovedadesEnPanelAdmin();
}


// Cargar novedades al inicio
document.addEventListener("DOMContentLoaded", () => {
    mostrarNovedadesDesdeLocalStorage();
});

// para que no habra otra pestaña en las referencias
document.querySelectorAll('a[target="_blank"]').forEach(function(link) {
    link.removeAttribute('target');
});