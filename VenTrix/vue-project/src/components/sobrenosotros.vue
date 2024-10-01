<template>
  <section class="contenedor">
    <div class="caja-contenido">
      <div class="caja-imagen">
        <img src="./img/pngtree-mission-web-icon-template-png-image_6113420.png" alt="Misión">
      </div>
      <div class="caja-texto">
        <h2>Misión</h2>
        <p>
          Proporcionar soluciones de software innovadoras y personalizadas para restaurantes, bares y tiendas en línea. 
          Facilitamos la gestión operativa, mejoramos la experiencia del cliente y optimizamos procesos a través de tecnología avanzada y soporte técnico confiable.
        </p>
      </div>
    </div>

    <div class="caja-contenido">
      <div class="caja-imagen">
        <img src="./img/60352794-icono-del-ojo-símbolo-de-la-visión-del-globo-del-ojo-botón-con-el-icono-de-banda-plana-en-el-fondo.jpg" alt="Visión">
      </div>
      <div class="caja-texto">
        <h2>Visión</h2>
        <p>
          Convertirnos en la plataforma líder en soluciones digitales para la industria de la hospitalidad y el comercio electrónico, impulsando a nuestros clientes hacia el éxito mediante tecnología de vanguardia con enfoque en eficiencia, simplicidad y escalabilidad global.
        </p>
      </div>
    </div>

    <div class="caja-concepto">
      <div class="texto-concepto">
        <h2>Concepto</h2>
        <p>
          En VenTrix, nos especializamos en ofrecer soluciones de software diseñadas específicamente para las necesidades de restaurantes, bares y tiendas online. Nuestro software, desde sistemas de punto de venta hasta herramientas de análisis, simplifica procesos, impulsa el crecimiento y proporciona una ventaja competitiva. Nos comprometemos a brindar soporte continuo para garantizar que cada cliente maximice su potencial.
        </p>
      </div>
    </div>
  </section>
</template>

<style>
.contenedor {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 20px;
  padding: 40px;
  background-color: #f9f9f9;
}

.caja-contenido {
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  width: 45%;
  overflow: hidden;
  transition: transform 0.3s ease;
}

.caja-contenido:hover {
  transform: translateY(-5px);
}

.caja-imagen{
  display: flex;
  justify-content: center;
  align-items: center;
}
.caja-imagen img {
  width: 30%;
  height: auto;
  object-fit: cover;

}

.caja-texto {
  padding: 30px;
  text-align: left;
}

.caja-texto h2 {
  font-size: 1.8rem;
  color: #2c3e50;
  margin-bottom: 15px;
}

.caja-texto p {
  font-size: 1.1rem;
  color: #7f8c8d;
}

.caja-concepto {
  width: 100%;
  background: url('./img/bannerConcepto.jpg') no-repeat center center;
  background-size: cover;
  padding: 60px;
  border-radius: 10px;
  color: white;
  text-align: center;
}

.texto-concepto {
  background-color: rgba(0, 0, 0, 0.7);
  padding: 30px;
  border-radius: 8px;
  display: inline-block;
  max-width: 800px;
  margin: 0 auto;
}

.texto-concepto h2 {
  font-size: 2rem;
  margin-bottom: 20px;
}

.texto-concepto p {
  font-size: 1.2rem;
  line-height: 1.6;
}

@media (max-width: 768px) {
  .caja-contenido {
    width: 100%;
  }

  .texto-concepto h2 {
    font-size: 1.5rem;
  }

  .texto-concepto p {
    font-size: 1rem;
  }
}
</style>
