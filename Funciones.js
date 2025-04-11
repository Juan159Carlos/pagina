// Variable para verificar si el usuario está logueado
let usuarioLogueado = false;

// Carrito de compras
let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

// Función para registrar un usuario
// Función para registrar un usuario
function registrarUsuario() {
    const email = document.getElementById('emailRegistro').value.trim();
    const password = document.getElementById('passwordRegistro').value.trim();
    const confirmPassword = document.getElementById('confirmPassword').value.trim();

    // Validar que los campos no estén vacíos y que las contraseñas coincidan
    if (!email || !password || password !== confirmPassword) {
        alert('Las contraseñas no coinciden o el email es inválido.');
        return;
    }

    // Obtener usuarios registrados
    let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

    // Verificar si el usuario ya está registrado
    if (usuarios.some(user => user.email === email)) {
        alert('Este email ya está registrado.');
        return;
    }

    // Si no existe un usuario administrador, creamos uno por defecto
    if (usuarios.length === 0) {
        usuarios.push({ email: "admin@tienda.com", password: "admin123", admin: true });
        alert('Administrador predeterminado creado: admin@tienda.com / admin123');
    }

    // Agregar el nuevo usuario
    usuarios.push({ email, password });
    localStorage.setItem("usuarios", JSON.stringify(usuarios));

    alert('Usuario registrado con éxito!');
    cerrarModal('registroModal');
}



// Función para validar el login
// Función para validar el login
function validarLogin() {
    const email = document.getElementById('emailLogin').value.trim();
    const password = document.getElementById('passwordLogin').value.trim();

    // Obtener usuarios registrados
    let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

    // Verificar si el usuario existe y la contraseña es correcta
    const usuarioEncontrado = usuarios.find(user => user.email === email && user.password === password);

    if (usuarioEncontrado) {
        alert('Inicio de sesión exitoso!');
        usuarioLogueado = true;
        localStorage.setItem("usuarioLogueado", "true");
        localStorage.setItem("usuarioActual", email); // Guardamos el email del usuario logueado
        
        // 👉 Detectar si es admin y guardarlo en localStorage
        if (usuarioEncontrado.admin === true) {
            localStorage.setItem("esAdmin", "true");
            alert("Has iniciado sesión como ADMINISTRADOR.");
            const adminMenu = document.getElementById("adminMenu");
            if (adminMenu) {
                adminMenu.style.display = "inline-block";  // Mostramos el botón
            }
        } else {
            localStorage.removeItem("esAdmin");
            const adminMenu = document.getElementById("adminMenu");
            if (adminMenu) {
                adminMenu.style.display = "none";  // Ocultamos el botón
            }
        }

        document.getElementById('userMenu').style.display = 'none';
        document.getElementById('logoutMenu').style.display = 'inline-block';

        const menuCarrito = document.getElementById("menuCarrito");
        if (menuCarrito) menuCarrito.style.display = "inline-block";

        // Mostrar saludo
        const saludo = document.getElementById('saludoUsuario');
        if (saludo) {
            saludo.textContent = `¡Hola, ${email}!`;
            saludo.style.display = 'inline-block';
        }

        cerrarModal('loginModal');

        // Recuperar el carrito guardado para este usuario
        const carritoGuardado = JSON.parse(localStorage.getItem(`carrito_${email}`));
        if (carritoGuardado) {
            carrito = carritoGuardado;
            actualizarCarrito();
        }
    } else {
        alert('Email o contraseña incorrectos.');
    }
}


// Función para cerrar sesión
function cerrarSesion() {
    const usuarioActual = localStorage.getItem("usuarioActual");

    // Guardamos el carrito actual en el almacenamiento local asociado al usuario
    if (usuarioActual) {
        localStorage.setItem(`carrito_${usuarioActual}`, JSON.stringify(carrito));
    }

    // Vaciamos el carrito y actualizamos la interfaz
    carrito = [];
    actualizarCarrito();

    usuarioLogueado = false;
    localStorage.removeItem("usuarioLogueado");
    localStorage.removeItem("usuarioActual");
    localStorage.removeItem("esAdmin");  // Limpiar si está marcado como admin

    document.getElementById('userMenu').style.display = 'inline-block';
    document.getElementById('logoutMenu').style.display = 'none';

    const menuCarrito = document.getElementById("menuCarrito");
    if (menuCarrito) menuCarrito.style.display = "none";

    // Ocultar el saludo de usuario
    const saludo = document.getElementById('saludoUsuario');
    if (saludo) {
        saludo.style.display = 'none';
    }

    // Ocultar el panel de administrador
    const panelAdmin = document.getElementById("adminPanel");
    if (panelAdmin) {
        panelAdmin.style.display = "none";
    }

    // Ocultar el botón de Panel Admin en el menú
    const adminMenu = document.getElementById("adminMenu");
    if (adminMenu) {
        adminMenu.style.display = "none"; // Ocultar el botón de Panel Admin
    }


    alert('Has cerrado sesión');
}

// Función para guardar el carrito en localStorage
function guardarCarrito() {
    localStorage.setItem("carrito", JSON.stringify(carrito));
}

// Función para actualizar el contador de productos en el carrito
function actualizarContadorCarrito() {
    const contadorCarrito = document.getElementById("contador-carrito");
    if (contadorCarrito) {
        contadorCarrito.textContent = carrito.reduce((total, item) => total + item.cantidad, 0);
    }
}

// Función para actualizar el carrito en la interfaz
function actualizarCarrito() {
    const listaCarrito = document.getElementById("lista-carrito");
    const totalCarrito = document.getElementById("total-carrito");

    if (!listaCarrito || !totalCarrito) return;

    listaCarrito.innerHTML = "";
    let total = 0;

    carrito.forEach((item, index) => {
        let subtotal = item.precio * item.cantidad;
        total += subtotal;

        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${item.nombre}</td>
            <td>Bs${item.precio.toFixed(2)}</td>
            <td>
                <button onclick="cambiarCantidad(${index}, 'disminuir')">➖</button>
                ${item.cantidad}
                <button onclick="cambiarCantidad(${index}, 'aumentar')">➕</button>
            </td>
            <td>Bs${subtotal.toFixed(2)}</td>
            <td><button onclick="eliminarProducto(${index})">❌</button></td>
        `;
        listaCarrito.appendChild(tr);
    });

    totalCarrito.textContent = `${total.toFixed(2)}`;
    guardarCarrito();
    actualizarContadorCarrito();
}

// Función para agregar productos al carrito
function agregarAlCarrito(nombre, precio) {
    if (!usuarioLogueado) { // Verifica si el usuario está logueado
        alert('¡Debes iniciar sesión para agregar productos al carrito!');
        return;
    }

    precio = parseFloat(precio);
    const itemExistente = carrito.find(item => item.nombre === nombre);

    if (itemExistente) {
        itemExistente.cantidad++;
    } else {
        carrito.push({ nombre, precio, cantidad: 1 });
    }

    actualizarCarrito();
}

// Función para cambiar la cantidad de un producto en el carrito
function cambiarCantidad(index, accion) {
    if (accion === "aumentar") {
        carrito[index].cantidad++;
    } else if (accion === "disminuir") {
        carrito[index].cantidad > 1 ? carrito[index].cantidad-- : eliminarProducto(index);
    }

    actualizarCarrito();
}

// Función para eliminar un producto del carrito
function eliminarProducto(index) {
    carrito.splice(index, 1);
    actualizarCarrito();
}

// Función para vaciar el carrito
function vaciarCarrito() {
    carrito = [];
    actualizarCarrito();
}
/////////////////////////////////////////////////////////////
// Función para guardar el historial de compras en localStorage
function guardarHistorialCompra() {
    const usuarioActual = localStorage.getItem("usuarioActual");
    if (!usuarioActual) {
        alert("Debes iniciar sesión para realizar una compra.");
        return;
    }

    // Obtener historial de compras del usuario o crear un arreglo vacío
    let historial = JSON.parse(localStorage.getItem(`historial_${usuarioActual}`)) || [];

    // Agregar productos del carrito al historial
    const productosComprados = carrito.map(item => ({
        nombre: item.nombre,
        precio: item.precio,
        cantidad: item.cantidad,
        total: item.precio * item.cantidad,
        fecha: new Date().toLocaleString()
        
    }));

    // Agregar los productos al historial
    historial.push(...productosComprados);

    // Guardar el historial actualizado
    localStorage.setItem(`historial_${usuarioActual}`, JSON.stringify(historial));

    // Vaciar el carrito después de la compra
    vaciarCarrito();
    actualizarCarrito();
}

// Función para mostrar el historial de compras
function mostrarHistorialCompras() {
    const usuarioActual = localStorage.getItem("usuarioActual");
    if (!usuarioActual) {
        alert("Debes iniciar sesión para ver tu historial de compras.");
        return;
    }

    // Obtener el historial de compras del usuario
    let historial = JSON.parse(localStorage.getItem(`historial_${usuarioActual}`)) || [];

    const historialDiv = document.getElementById('historial-compras');
    const historialLista = document.getElementById('historial-lista');
    
    if (!historialDiv || !historialLista) return;

    // Limpiar el contenido del historial antes de mostrarlo
    historialLista.innerHTML = "";

    // Si no hay historial, mostrar mensaje
    if (historial.length === 0) {
        historialLista.innerHTML = "<p>No has realizado ninguna compra aún.</p>";
        historialDiv.style.display = 'block'; // Mostrar el contenedor
        return;
    }

    // Mostrar el historial de compras
    historial.forEach(compra => {
        const compraDiv = document.createElement('div');
        compraDiv.classList.add('compra-item');
        compraDiv.innerHTML = `
            <p><strong>Producto:</strong> ${compra.nombre}</p>
            <p><strong>Cantidad:</strong> ${compra.cantidad}</p>
            <p><strong>Total:</strong> Bs${compra.total.toFixed(2)}</p>
            <p><strong>Fecha:</strong> ${compra.fecha}</p>
            <hr>
        `;
        historialLista.appendChild(compraDiv);
    });

    // Mostrar el contenedor del historial
    historialDiv.style.display = 'block';
}

// Función para ocultar el historial
function ocultarHistorial() {
    const historialDiv = document.getElementById('historial-compras');
    if (historialDiv) {
        historialDiv.style.display = 'none'; // Ocultar el historial
    }
}

// Función para simular el pago y guardar el historial
function simularPago() {
    if (!usuarioLogueado) {
        alert('¡Debes iniciar sesión para realizar el pago!');
        return;
    }

    if (carrito.length === 0) {
        alert('Tu carrito está vacío. Agrega productos antes de realizar el pago.');
        return;
    }

    const totalPago = carrito.reduce((total, item) => total + (item.precio * item.cantidad), 0);

    // Mostrar un alert antes de continuar
    alert('Esta seguro de realizar el pago. Total a pagar: Bs' + totalPago.toFixed(2));

    const metodoPago = prompt("Introduce tu método de pago (Ej: tarjeta, Efectivo, QR)");

    if (metodoPago) {
        alert(`Pago exitoso de Bs${totalPago.toFixed(2)} con ${metodoPago}`);
        
        // Guardar el historial de compra
        guardarHistorialCompra();

        cerrarModal('modalPago');
    } else {
        alert('No se ha proporcionado un método de pago.');
    }
}



// Inicializar la página y agregar los eventos a los botones
document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll(".agregar-carrito").forEach(boton => {
        boton.addEventListener("click", function () {
            const producto = this.closest(".producto-item");
            if (producto) {
                const nombre = producto.getAttribute("data-nombre");
                const precio = producto.getAttribute("data-precio");
                agregarAlCarrito(nombre, precio);
            }
        });
    });

    actualizarCarrito();

    // Ocultar carrito si no ha iniciado sesión
    const menuCarrito = document.getElementById("menuCarrito");
    if (!usuarioLogueado && menuCarrito) {
        menuCarrito.style.display = "none";
    }
});

// Cerrar cualquier modal al hacer clic fuera de él
window.onclick = (event) => {
    const modales = document.querySelectorAll('.modal');
    modales.forEach(modal => {
        if (modal && event.target === modal) {
            cerrarModal(modal.id);
        }
    });
};


// Función para mostrar la sección seleccionada
function mostrarSeccion(seccionId) {
    document.querySelectorAll('.seccion').forEach(seccion => {
        seccion.style.display = 'none';
    });

    const seccionSeleccionada = document.getElementById(seccionId);
    if (seccionSeleccionada) {
        seccionSeleccionada.style.display = 'block';
    }
}

// Función para abrir y cerrar modales
function abrirModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) modal.style.display = 'block';
}

function cerrarModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) modal.style.display = 'none';
}

function toggleMenu() {
    const menu = document.querySelector('.menu');
    menu.classList.toggle('show');

    // Cerrar cualquier modal abierto al abrir el menú
    const modales = document.querySelectorAll('.modal');
    modales.forEach(modal => {
        if (modal) modal.style.display = 'none';
    });
} 
