<template>
    <main>
        <div class="contenedor_padre_main1">
            <div class="texto_main1">
                <h1>Cada pedido, cada detalle. Todo en un solo lugar</h1>
                <h2>Gestiona fácilmente cada aspecto de tus pedidos y sus detalles en un solo lugar. Optimiza tu flujo de trabajo con una plataforma que simplifica la organización y te permite tener el control total de tu negocio. Desde el primer contacto con el cliente hasta la entrega del producto, todo está diseñado para maximizar la eficiencia y potenciar el crecimiento de tu empresa. ¡Empieza a organizarte de manera inteligente hoy mismo!</h2>
                <div class="botones">
                    <button class="boton_prueba_gratis">Prueba gratis</button>
                    <button>Hablar con un asesor</button>
                </div>
            </div>
            <div class="img_main1">
                <div class="slider">
                    <img v-for="(image, index) in images" :key="index" :src="image" alt="">
                </div>
            </div>
        </div>
    </main>
</template>
<style>
.contenedor_padre_main1 {
    display: grid;
    grid-template-columns: 60% 40%; /* Define las proporciones de las columnas */
    gap: 4rem; /* Espacio entre las columnas */
    margin: 6% 10% 8%;
}

.texto_main1 h1 {
    color: #1E6838;
    font-size: 4.2rem;
    margin: 0;
}

.texto_main1 h2 {
    font-size: 1.3rem;
    line-height: 1.6;
    max-width: 600px;
  margin-top: 50px;
  margin-bottom: 70px;
    color: #444;
}

.botones {
    margin: 30px 0; /* Ajusta el margen si es necesario */
}

.botones button {
    margin-right: 10px;
    padding: 10px 20px;
    border: none;
    border-radius: 5px;
    font-size: 1rem;
    cursor: pointer;
    transition: background-color 0.3s, color 0.3s;
}

.boton_prueba_gratis {
    background-color: #1E6838;
    color: #ffffff;
}

.boton_prueba_gratis:hover {
    background-color: #155e34;
}

.img_main1 {
    display: flex;
    align-items: center;
    overflow: hidden; /* Oculta las partes de las imágenes fuera del contenedor */
    position: relative; /* Necesario para posicionar el slider */
    width: 100%; /* Asegura que el contenedor ocupe todo el espacio disponible */
}

.slider {
    display: flex;
    width: 100%; /* Ajusta el ancho del slider al 100% del contenedor */
    transition: transform 1s ease-in-out; /* Transición suave entre imágenes */
}

.slider img {
    flex: 0 0 100%; /* Cada imagen ocupa el 100% del ancho del slider */
    max-height: 80vh; /* Mantiene la altura máxima definida */
    height: 70vh; /* Mantiene la proporción de la imagen */
    border-radius: 10%;
    object-fit: cover; /* Ajusta la imagen para cubrir el contenedor sin distorsionarse */
}

@media (max-width: 1024px) and (min-width: 920px) {
    .contenedor_padre_main1 {
        grid-template-columns: 60% 40%; /* Cambia a una sola columna */
        gap: 2rem; /* Reduce el espacio entre columnas */
        margin: 5% 5%;
        padding: 40px 20px;
        align-items: start;
    }

    .texto_main1 h1 {
        font-size: 3.5rem; /* Ajusta el tamaño del texto */
    }

    .texto_main1 h2 {
        font-size: 1.2rem; /* Ajusta el tamaño del subtítulo */
        max-width: 100%; /* Asegura que el texto no se corte */
    }

    .slider img {
        max-height: 80vh;
        height: 80vh;
        max-width: 100%;
    }
 
}

/* Para teléfonos (pantallas menores a 768px) */
@media (max-width: 913px) or (height: 1366px) {
    .contenedor_padre_main1 {
        display: flex;
        flex-direction: column; /* Cambia a una disposición en columna */
        gap: 1rem;
        margin: 15% 0%;
        padding: 10px 20px;
    }

    .texto_main1 h1 {
        font-size: 2.8rem; /* Reduce el tamaño del título */
        text-align: center; /* Centra el texto */
    }

    .texto_main1 h2 {
        font-size: 1rem; /* Ajusta el tamaño del subtítulo */
        line-height: 1.4; /* Mejora la legibilidad */
        margin: 20px auto; /* Ajusta los márgenes */
        max-width: 100%; /* Asegura que el texto no se corte */
        text-align: center; /* Centra el texto */
    }

    .botones {
        display: flex;
        flex-direction: column; /* Botones en una columna */
        align-items: center;
    }

    .botones button {
        margin-bottom: 10px; /* Espaciado entre botones */
        width: 90%; /* Asegura que los botones ocupen la mayor parte del ancho */
    }

    .img_main1 {
        width: 100%;
    }

    .slider img {
        height: 60vh; /* Reduce aún más la altura de las imágenes */
        max-width: 100%;
    }
}

</style>
<script>
import pruebaImagenChef1 from '@/components/img/prueba_imagen_chef1.webp';
import pruebaImagenChef2 from '@/components/img/prueba_imagen_chef2.jpg';
import pruebaImagenChef3 from '@/components/img/prueba_imagen_chef3.jpg';

export default {
    data() {
        return {
            images: [
                pruebaImagenChef1,
                pruebaImagenChef2,
                pruebaImagenChef3
            ],
            currentIndex: 0
        };
    },
    mounted() {
        this.startSlider();
    },
    methods: {
        startSlider() {
            setInterval(() => {
                this.currentIndex = (this.currentIndex + 1) % this.images.length;
                const offset = -this.currentIndex * 100;
                this.$el.querySelector('.slider').style.transform = `translateX(${offset}%)`;
            }, 3000); // Cambia la imagen cada 3 segundos
        }
    }
};
</script>
