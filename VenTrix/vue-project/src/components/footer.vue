<script setup>

</script>

<template>
  <section class="footer">
    <article class="cuadro">
      <article class="numero">
        <div><a class="telefono" href="https://wa.me/573507113526"><img class="img" src="../components/icons/icons8-teléfono-50.png" alt=""><p>​ +1 (234) 567-8910</p></a></div>
      </article>
      <article class="chatear">
        <div><a class="whatsapp" href="https://wa.me/573507113526"><img class="img" src="../components/icons/whatsapp.svg" alt=""><p>​Chatear ahora</p></a></div>
      </article>
    </article>
    
    <article class="descripcion">
      <p>​WhatsAppp +57 30152428362</p>
      <p>VenTrix.com</p>
      <p>Software Punto de venta VenTrix es un Sistema de Punto de Venta para restaurantes y tiendas hecho para Colombia. Ideal para  cafeterías, restaurantes, bares y comercio en general.</p>
    </article>

  </section>
</template>

<style scoped>
.footer {
  background-color: var(--color_terciario);
  padding: 40px 30px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: var(--color_letra_blanca);
}

.cuadro {
  width: 40%;
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding-left: 60px;
  font-size: 15px;
  font-family: 'Courier New', Courier, monospace;
  font-weight: 800;
}

div a {
  display: flex;
  justify-content: start;
  align-items: center;
  color: var(--color_letra_blanca);
  text-decoration: none;
}

.img{
  position: relative;
  width: 5%;
  padding: 10px 10px 10px 3px;
}

.telefono:hover {
  background-image: url(../components/icons/icons8-teléfono-48.png);
  background-position: 2px;
  background-size: 5%;
  background-repeat: no-repeat;
  filter: drop-shadow(0px 2px 1px white);
}

.whatsapp:hover{
  background-image: url(../components/icons/icons8-whatsapp.svg);
  background-position: left;
  background-size: 6%;
  background-repeat: no-repeat;
  filter: drop-shadow(0px 2px 1px white);
}

.descripcion {
  width: 60%;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.descripcion p{
  text-align: center;
  width: 60%;
  font-family: 'Courier New', Courier, monospace;
  font-weight: 500;
  font-size: 15px;
}


@media screen and (min-width: 280px) and (max-width: 490px){

  .footer {
    background-color: var(--color_terciario);
    padding: 15px 15px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .cuadro {
    width: 40%;
    display: flex;
    flex-direction: column;
    gap: 5px;
    padding-left: 5px;
    font-size: 6px;
    font-family: 'Courier New', Courier, monospace;
    font-weight: 800;
  }

  .descripcion {
    width: 70%;
    display: flex;
    flex-direction: column;
    gap: 5px;
  }

  .descripcion p{
    text-align: center;
    width: 100%;
    font-family: 'Courier New', Courier, monospace;
    font-weight: 500;
    font-size: 8px;
  }

}

</style>
