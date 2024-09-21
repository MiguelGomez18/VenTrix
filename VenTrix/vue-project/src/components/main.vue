<template>
    <main>
        <div class="contenedor_padre_main1">
            <div class="texto_main1">
                <h1>Cada pedido, cada detalle. Todo en un solo lugar</h1>
                <h2>Potencia tu negocio con una organización inteligente y sencilla.</h2>
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
    margin: 10% 10% 8%;
}

.texto_main1 h1 {
    color: #1E6838;
    font-size: 4.2rem;
    margin: 0;
}

.texto_main1 h2 {
    padding: 25px 0;
    color: #4A4A4A;
    margin: 0;
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
