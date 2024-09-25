<template>
    <div class="tarjetaProducto">
        <div class="imagenProducto">
            <img src="./img/prueba_imagen_chef1.webp" alt="" class="imagen">
        </div>
        <p class="nombreProducto">Hamburguesa</p>
        <p class="valorProducto">25.000</p>
        
    </div>
</template>

<style>
.tarjetaProducto {
    display: flex;
    flex-direction: column;
    padding: 10px;
    gap: 1rem;
    align-items: center; 
    border: 2px solid var(--color_principal);
    border-radius: 8px;
    max-width: 150px; 
    margin: 20px;
}
.imagenProducto{
    height: 100px;
    width: 100px;
    overflow: hidden;
    border-radius: 50%;
}
.imagen{
    width: 100%;
    height: 100%;
    object-fit: cover;
}
.valorProducto{
    color: var(--color_principal)
}
.tarjetaProducto p{
    font-family: fuente_principal;
}
</style>