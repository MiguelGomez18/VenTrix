<template>
    <div id="cuadro">
       <h1>Elige tu plan Estándar</h1>
       <h2>¿QUÉ ESTÁ INCLUIDO?</h2>
       <section id="content">
        <article class="cua">
            <h2>6 meses</h2>
            <h1>$54.900</h1>
            <ul class="menu">
                <li class="li">Accede al registro de todas tus ventas al instante.</li>
                <li class="li">Visualiza el rendimiento de todos tus restaurantes en un solo panel.</li>
                <li class="li">Ideal para dueños que gestionan múltiples sucursales.</li>
            </ul>
            <h3>Igual a $17.633,33 al mes</h3>
            <a class="plan" @click.prevent="seleccionarPlan">CREAR CUENTA</a>
        </article>
        <article class="cua">
            <h2>12 meses</h2>
            <h1>$169.900</h1>
            <ul class="menu">
                <li class="li">Accede al registro de todas tus ventas al instante.</li>
                <li class="li">Visualiza el rendimiento de todos tus restaurantes en un solo panel.</li>
                <li class="li">Ideal para dueños que gestionan múltiples sucursales.</li>
            </ul>
            <h3>Igual a $14.158,33 al mes</h3>
            <a class="plan" @click.prevent="seleccionarPlan">CREAR CUENTA</a>
        </article>
        <article class="cua1">
            <h2>3 meses</h2>
            <h1>$24.900</h1>
            <ul class="menu1">
                <li class="li">Accede al registro de todas tus ventas al instante.</li>
                <li class="li">Visualiza el rendimiento de todos tus restaurantes en un solo panel.</li>
                <li class="li">Ideal para dueños que gestionan múltiples sucursales.</li>
            </ul>
            <a class="plan" @click.prevent="seleccionarPlan">CREAR CUENTA</a>
        </article>
      </section>
      <h3>*Requiere pago anticipado. Ahorro basado en el precio del plan estándar anual comparado con el precio del plan estándar mensual por 12 meses, excluyendo impuestos. Aplican términos.</h3>
    </div>
</template>

<script>
import { useRouter } from 'vue-router';

export default {
    setup() {
        const router = useRouter();

        const seleccionarPlan = () => {
            router.push('/registro'); // Redirige a la página de registro
        };

        return { seleccionarPlan };
    },
};
</script>


<style scoped>
#cuadro{
    margin-top: 50px;
    padding: 30px 0;
    width: 100%;
    height: auto;
    display: flex;
    align-items: center;
    flex-direction: column;
}

#cuadro >h1{
    font-weight: 600;
    color: var(--color_letra);
    font-size: 31px;
    font-family: fuente_principal;
}

#cuadro >h2{
    color: var(--color_letra);
    font-size: 12px;
    margin-top: 50px;
    letter-spacing: 0.15em;
    font-family: fuente_principal;
}

#cuadro >h3{
    font-weight: 200;
    color: var(--color_letra);
    font-size: 12px;
    letter-spacing: 0.06em;
    width: 53%;
    text-align: center;
    font-family: fuente_principal;
    margin-top: 30px;
}

#content{
    width: 100%;
    display: flex;
    flex-wrap: nowrap;
    justify-content: space-evenly;
    align-items: center;
    gap: 10px;
    margin-left: auto;
    margin-right: auto;
    text-align: center;
    margin-top: 40px;
}

.cua{
    width: 30%;
    background: linear-gradient(180deg, rgba(255, 255, 255, 0.12) 0%, rgba(255, 255, 255, 0) 100%);
    border-radius: 8px;
    display: flex;
    justify-content: space-evenly;
    align-items: center;
    flex-direction: column;
    padding: 15px 0;
    overflow: hidden;
    transition: transform 0.3s ease;
}

.cua:hover{
    transform: translateY(-15px);
}

.cua >h2{
    font-family: fuente_principal;
    color: var(--color_letra);
    font-size: 32px;
}

.cua >h1{
    font-family: fuente_principal;
    color: var(--color_letra);
    font-size: 50px;
}

.cua >h3{
    font-family: fuente_principal;
    color: var(--color_letra);
    font-size: 16px;
    margin-bottom: 15px;
}

.cua1{
    width: 30%;
    background: linear-gradient(180deg, rgba(255, 255, 255, 0.12) 0%, rgba(255, 255, 255, 0) 100%);
    border-radius: 8px;
    display: flex;
    justify-content: space-evenly;
    align-items: center;
    flex-direction: column;
    padding: 15px 0;
    overflow: hidden;
    transition: transform 0.3s ease;
}

.cua1:hover{
    transform: translateY(-15px);
}

.cua1 >h2{
    font-family: fuente_principal;
    color: var(--color_letra);
    font-size: 32px;
}

.cua1 >h1{
    font-family: fuente_principal;
    color: var(--color_letra);
    font-size: 50px;
}

.cua1 >h3{
    font-family: fuente_principal;
    color: var(--color_letra);
    font-size: 16px;
    margin-bottom: 15px;
}

.menu{
    list-style:disc;
    text-align: left;
    margin: 15px 0;
    color: var(--color_letra);
    font-family: fuente_principal;
}

.menu1{
    list-style:disc;
    text-align: left;
    margin: 32px 0;
    color: var(--color_letra);
    font-family: fuente_principal;
}

.li{
    margin: 10px 0;
}

.plan{
    z-index: 2;
    background-image: linear-gradient(345deg, rgb(21, 109, 4) 0%, rgb(38, 168, 24) 33%, rgba(255, 255, 255, 0) 66%, rgba(255, 255, 255, 0) 100%);
    background-position: 99% 50%;
    background-size: 400% 400%;
    border-radius: 67px;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: white;
    max-width: 337px;
    line-height: 46px;
    display: inline-block;
    text-align: center;
    font-size: 15px;
    width: 80%;
    border: 2px solid transparent;
    -webkit-transition: all 4s;
    transition: all 1.5s;
    font-family: fuente_principal;
}

.plan:hover{
    background: transparent;
    border-radius: 67px;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: black;
    max-width: 337px;
    line-height: 46px;
    display: inline-block;
    text-align: center;
    font-size: 16px;
    width: 80%;
    border: 2px solid ;
    overflow: hidden;
    -webkit-transition: all 0.80s;
    transition: all 0.2s;
    font-weight: 700;
}

/* Para tablets (pantallas entre 768px y 1024px) */
@media (max-width: 1024px) and (min-width: 768px) {
    #content {
        flex-wrap: wrap; 
        gap: 20px;
        justify-content: center; 
    }

    .cua, .cua1 {
        width: 30%; 
        padding: 20px;
    }

    .cua > h1, .cua1 > h1 {
        font-size: 40px;
    }

    .cua > h2, .cua1 > h2 {
        font-size: 28px; 
    }
}

/* Para teléfonos pantallas menores a 768px */
@media (max-width: 767px) {
    #cuadro {
        padding: 20px 0px; 
    }

    #cuadro > h1 {
        font-size: 24px; 
        text-align: center; 
    }

    #cuadro > h2 {
        font-size: 10px; 
        margin-top: 30px; 
    }

    #cuadro > h3 {
        font-size: 10px; 
        width: 90%; 
    }

    #content {
        flex-wrap: wrap; 
        flex-direction: column; 
        align-items: center; 
        gap: 15px; 
    }

    .cua, .cua1 {
        width: 80%;
        padding: 15px; 
    }

    .cua > h1, .cua1 > h1 {
        font-size: 36px; 
    }

    .cua > h2, .cua1 > h2 {
        font-size: 24px;
    }

    .menu, .menu1 {
        text-align: center;
        margin: 10px 0; 
    }

    .plan {
        width: 100%; 
        font-size: 14px; 
    }
}

</style>