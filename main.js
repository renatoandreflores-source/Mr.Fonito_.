document.addEventListener("DOMContentLoaded", () => {
    
    // 1. CATÁLOGO DE PRODUCTOS INTEGRADO (Evita errores de lectura de archivos locales)
    const productos = [
        {
            id: 1,
            nombre: "iPhone 15 Pro Max",
            descripcion: "Titanio, cámara 48MP, chip A17 Pro",
            precio: 5499,
            imagen: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=500&q=80"
        },
        {
            id: 2,
            nombre: "iPad Pro 12.9\"",
            descripcion: "Chip M2, pantalla Liquid Retina",
            precio: 4299,
            imagen: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=500&q=80"
        },
        {
            id: 3,
            nombre: "MacBook Pro 14\"",
            descripcion: "Chip M3 Pro, 18GB RAM",
            precio: 7999,
            imagen: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=500&q=80"
        },
        {
            id: 4,
            nombre: "Apple Watch Series 9",
            descripcion: "GPS y monitor de salud",
            precio: 1899,
            imagen: "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&w=500&q=80"
        }
    ];

    // VARIABLES DEL CARRITO DE COMPRAS (Persistencia local)
    let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

    // FUNCIÓN PARA ACTUALIZAR EL CONTADOR VISUAL DEL CARRITO EN EL HEADER
    const actualizarContadorCarrito = () => {
        const btnCarrito = document.querySelector(".btn-carrito");
        if (btnCarrito) {
            const totalItems = carrito.reduce((total, producto) => total + producto.cantidad, 0);
            btnCarrito.innerHTML = `<i class="fa-solid fa-cart-shopping"></i> Carrito (${totalItems})`;
        }
    };

    // 2. INYECCIÓN FORZADA E INMEDIATA DE PRODUCTOS EN LA INTERFAZ
    const contenedorProductos = document.getElementById("contenedor-productos");
    if (contenedorProductos) {
        contenedorProductos.innerHTML = ""; // Limpiar cualquier mensaje residual
        
        productos.forEach(item => {
            const card = document.createElement("div");
            card.className = "product-card";
            card.innerHTML = `
                <div class="product-img-holder">
                    <img src="${item.imagen}" alt="${item.nombre}" style="width: 100%; height: 100%; object-fit: contain;">
                </div>
                <div class="product-info">
                    <h3>${item.nombre}</h3>
                    <p>${item.descripcion}</p>
                    <div class="product-price">S/. ${item.precio.toLocaleString('es-PE')}</div>
                    <button class="btn-agregar-carrito" data-id="${item.id}">Añadir al Carrito</button>
                </div>
            `;
            contenedorProductos.appendChild(card);
        });

        // Activar escuchadores de clicks para la compra
        configurarBotonesCompra();
    }

    // 3. LÓGICA DE INTERACCIÓN DEL CARRITO
    function configurarBotonesCompra() {
        document.querySelectorAll(".btn-agregar-carrito").forEach(boton => {
            boton.addEventListener("click", (e) => {
                const idProducto = parseInt(e.target.getAttribute("data-id"));
                const productoSeleccionado = productos.find(p => p.id === idProducto);

                if (productoSeleccionado) {
                    const itemExistente = carrito.find(item => item.id === idProducto);
                    if (itemExistente) {
                        itemExistente.cantidad += 1;
                    } else {
                        carrito.push({ ...productoSeleccionado, cantidad: 1 });
                    }

                    // Guardar en el almacenamiento del navegador
                    localStorage.setItem("carrito", JSON.stringify(carrito));
                    actualizarContadorCarrito();

                    // Animación de éxito en el botón
                    e.target.innerText = "¡Añadido! ✓";
                    e.target.style.backgroundColor = "#22c55e"; 
                    setTimeout(() => {
                        e.target.innerText = "Añadir al Carrito";
                        e.target.style.backgroundColor = "#1ea1f2";
                    }, 1000);
                }
            });
        });
    }

    // 4. EVENTO PARA SIMULAR LA COMPRA (CLICK EN EL CARRITO DE LA CABECERA)
    const btnCarritoClick = document.querySelector(".btn-carrito");
    if (btnCarritoClick) {
        btnCarritoClick.addEventListener("click", (e) => {
            e.preventDefault();
            if (carrito.length === 0) {
                alert("Tu carrito está vacío. ¡Añade algunos productos destacados primero!");
                return;
            }

            let resumen = "🛒 Resumen de tu Pedido - Mr.Fonito:\n\n";
            let totalGeneral = 0;

            carrito.forEach(item => {
                const subtotal = item.precio * item.cantidad;
                resumen += `- ${item.nombre} (x${item.cantidad}): S/. ${subtotal.toLocaleString('es-PE')}\n`;
                totalGeneral += subtotal;
            });

            resumen += `\n💵 Total Neto: S/. ${totalGeneral.toLocaleString('es-PE')}`;
            resumen += "\n\n¿Deseas procesar el envío de tu compra?";

            if (confirm(resumen)) {
                alert("¡Pedido enviado con éxito! Nos comunicaremos contigo para la entrega.");
                carrito = [];
                localStorage.removeItem("carrito");
                actualizarContadorCarrito();
            }
        });
    }

    // Sincronizar el contador al arrancar
    actualizarContadorCarrito();
});