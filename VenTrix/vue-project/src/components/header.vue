<template>
  <header id="header" class="header">
    <nav class="nav">
      <div class="logo">
        <img src="../components/img/logo.png" alt="" />
        <a href="">VENTRIX</a>
      </div>
      <a href="#menu" class="target">
        <img
          src="../components/icons/Menu_icon_2_icon-icons.com_71856.svg"
          class="icon"
        />
      </a>
      <ul class="links" id="menu">
        <li><a id="a1" class="a1" href="/ingresar">Ingresar</a></li>
        <li><a class="a1" href="/servicios">Servicios</a></li>
        <li><a class="a1" href="/contacto">Contacto</a></li>
        <li><a class="a1" href="/acerca_de">Acerca de</a></li>
      </ul>
      <div>
        <a href="">
          <img src="" alt="" />
        </a>
        <a href="">
          <img src="" alt="" />
        </a>
        <a href="">
          <img src="" alt="" />
        </a>
      </div>
    </nav>
  </header>
</template>

<style>
.header {
  background-color: var(--color_secundario);
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  padding: 0 30px;
  box-shadow: 0px 2px 10px 4px gray;
  border-bottom-left-radius: 10px;
  border-bottom-right-radius: 10px;
  z-index: 3;
}

.header:hover {
  border-bottom: 4px outset rgb(50, 169, 50);
  transition: 0.4s;
}

.nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 3px 30px;
}

.logo {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 60%;
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

.links {
  list-style: none;
  display: flex;
  gap: 30px;
  width: 40%;
  justify-content: right;
}

.links li a {
  text-decoration: none;
  color: var(--color_letra);
  font-size: 18px;
  font-family: fuente_principal;
  transition: 0.7s;
}

.links li a:hover {
  color: var(--color_letra);
  border-radius: 10px;
  font-size: 18px;
  font-family: fuente_principal;
  filter: drop-shadow(0px 0px 10px var(--color_principal));
}

/*letter-spacing: 0.10em;*/

.icon {
  width: 0;
  height: 0;
}

@media screen and (min-width: 280px) and (max-width: 490px) {
  .header {
    padding: 0;
  }

  .logo {
    display: flex;
    align-items: center;
    justify-content: start;
    gap: 10px;
    width: 60%;
  }

  .logo img {
    width: 25%;
  }

  .logo a {
    text-decoration: none;
    font-size: 20px;
    font-family: fuente_principal;
    color: var(--color_principal);
  }

  .links {
    position: fixed;
    left: 0;
    bottom: 0;
    top: 0;
    right: 0;
    background-color: var(--color_principal);
    display: grid;
    place-content: space-around;
    clip-path: circle(0% at top right);
    transition: clip-path 1.4s;
  }

  .a1 {
    text-decoration: none;
    color: var(--color_letra);
  }

  .target > img {
    height: 28px;
    width: 28px;
  }

  .links:target {
    clip-path: circle(150% at top right);
    text-align: center;
    width: 100%;
  }
}
</style>
