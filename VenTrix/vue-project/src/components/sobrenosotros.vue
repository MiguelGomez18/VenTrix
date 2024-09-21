<template>
    <section class="contenedor">
      
      <div class="caja-contenido">
        <div class="caja-imagen">
          <img src="./img/pngtree-mission-web-icon-template-png-image_6113420.png" alt="Imagen Misión">
        </div>
        <div class="caja-texto">
          <h2>Misión</h2>
          <p>Proporcionar soluciones de software innovadoras y personalizadas para restaurantes, bares y tiendas de ropa en línea, facilitando la gestión operativa, mejorando la experiencia del cliente y optimizando los procesos de negocio, a través de herramientas tecnológicas avanzadas y un soporte técnico confiable.</p>
        </div>
      </div>
  
     
      <div class="caja-contenido">
        <div class="caja-imagen">
          <img src="./img/60352794-icono-del-ojo-símbolo-de-la-visión-del-globo-del-ojo-botón-con-el-icono-de-banda-plana-en-el-fondo.jpg" alt="Imagen Visión">
        </div>
        <div class="caja-texto">
          <h2>Visión</h2>
          <p>Ser la plataforma líder en soluciones digitales para la industria de la hospitalidad y el comercio electrónico, ayudando a nuestros clientes a alcanzar el éxito mediante tecnología de vanguardia, con un enfoque en eficiencia, simplicidad y escalabilidad global.</p>
        </div>
      </div>
  
      
      <div class="caja-concepto">
         <div class="texto-concepto">
            <h2>Concepto</h2>
            <p>En VenTrix, nos especializamos en ofrecer soluciones de software diseñadas específicamente para satisfacer las necesidades únicas de restaurantes, bares y tiendas de ropa online. Nuestra misión es transformar la manera en que estos negocios operan mediante tecnología intuitiva y poderosa, permitiendo una gestión más eficiente y una experiencia de cliente excepcional. Desde sistemas de punto de venta hasta herramientas de gestión de inventario y análisis de datos, nuestro software está diseñado para simplificar procesos, impulsar el crecimiento y proporcionar una ventaja competitiva en un mercado en constante evolución. Nos comprometemos a brindar un servicio excepcional y soporte continuo para garantizar que cada cliente pueda maximizar su potencial y alcanzar sus objetivos empresariales.</p>
         </div>
      </div>

    </section>
  </template>

<style>

.contenedor {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 20px;
  padding: 20px;
  text-align: center;
}

.caja-contenido {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  width: 45%;
  overflow: hidden;
}

.caja-imagen img {
  width: 30%;
  height: auto;
  border-bottom: 2px solid #ddd;
}

.caja-texto {
  padding: 40px;
}

.caja-texto h2 {
  font-size: 1.5rem;
  margin-bottom: 10px;
  color: green;
}

.caja-texto p {
  font-size: 1rem;
  color: #555;
}

/* Contenedor de concepto */
.caja-concepto {
  width: 100%;
  background: url('./img/bannerConcepto.jpg') no-repeat center center;
  background-size: cover;
  padding: 40px;
  border-radius: 8px;
  color: #ddd;
  text-align: center;
}
.texto-concepto {
  background-color: rgba(20, 198, 20, 0.868);
  padding: 20px;
  border-radius: 8px;
  display: inline-block;
}

.texto-concepto h2 {
  font-size: 30px;
  margin-bottom: 15px;
  color: green;
}

.texto-concepto p {
  font-size: 20px;
}

</style>