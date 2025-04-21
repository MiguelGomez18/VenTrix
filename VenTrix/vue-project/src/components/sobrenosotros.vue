<template>
  <section id="cuadro2" class="contenedor">
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
        <img src="./img/visionventrix.jpg" alt="Visión">
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
  gap: 40px;
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
  transform: translateY(-15px);
}

.caja-imagen{
  display: flex;
  justify-content: center;
  align-items: center;
}

.caja-imagen img {
  max-width: 30%;
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
  color: #444;
  line-height: 1.4;
}

.caja-concepto {
  width: 100%;
  background: url('./img/imagenparalax.jpg') no-repeat center center;
  background-size: cover;
  padding: 60px;
  border-radius: 10px;
  color: white;
  text-align: center;
  background-attachment: fixed;
}

.texto-concepto {
  background-color: rgba(0, 0, 0, 0.7);
  padding: 30px;
  border-radius: 8px;
  display: inline-block;
  max-width: 100%;
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

@media (max-width: 819px) {
  .contenedor {
    flex-direction: column;
    gap: 20px;
    padding: 30px;
  }

  .caja-imagen img {
    max-width: 60%;
    height: auto;
    object-fit: cover;
  }

  .caja-contenido {
    width: 100%;
  }

  .caja-concepto {
    width: 100%;
    max-width: 90%;
    padding: 40px 20px; 
    border-radius: 10px;
  }

  .texto-concepto {
    
    padding: 20px;
  }

  .texto-concepto h2 {
    font-size: 1.5rem;
  }

  .texto-concepto p {
    font-size: 0.9rem;
  }
}

@media (max-width: 1024px) and (min-width: 820px) {
  .contenedor {
    flex-wrap: wrap;
    gap: 20px;
    padding: 30px;
  }

  .caja-imagen img {
    max-width: 60%;
    height: auto;
    object-fit: cover;
  }

  .caja-contenido {
    width: 48%;
  }

  .caja-concepto {
    width: 100%;
    padding: 40px 20px; 
    border-radius: 10px;
  }

  .texto-concepto {
    padding: 20px;
  }

  .texto-concepto h2 {
    font-size: 1.5rem;
  }

  .texto-concepto p {
    font-size: 0.9rem;
  }
}
</style>
