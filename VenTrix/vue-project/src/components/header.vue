<template>
  <header class="header">
    <nav class="navbar">
      <div class="logo">
        <img src="../components/img/logo.png" alt="">
        <a href="/inicio">VENTRIX</a>
      </div>
      <ul class="nav-links">
        <li><a href="/inicio">Inicio</a></li>
        <li><a href="/nosotros">Nosotros</a></li>
        <li><a href="/servicios">Servicios</a></li>
        <li><a href="/contacto">Contacto</a></li>
      </ul>
    </nav>
  </header>
</template>

<style>
.header {
  background-color: #f2e2ce;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  background-attachment: fixed;
}

.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 3px 30px;
}
.logo {
  display: flex;
  align-items: center;
  gap: 10px;
}
.logo img {
  width: 6%;
}

.logo a {
  text-decoration: none;
  font-size: 33px;
  font-family: fuente_principal;
  color: var(--color_principal);
}

.nav-links {
  list-style: none;
  display: flex;
  gap: 30px;
}

.nav-links li a {
  text-decoration: none;
  color: var(--color_principal);
  font-size: 18px;
  transition: color 0.3s;
  font-family: fuente_principal;
}

</style>

