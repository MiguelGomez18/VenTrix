<template>
  <header id="header" class="header">
    <nav class="nav">
      <div class="logo">
        <img src="../components/img/logo.png" alt="" />
        <a href="">VENTRIX</a>
      </div>
      <a href="#menu" class="target">
        <img
          src="../components/icons/icons8-menú-24.png"
          class="icon"
        />
      </a>
      <ul class="links" id="menu">
        <li><a href=""><router-link class="link" to="/registro">Iniciar Sesion</router-link></a></li>
        <li><a class="a1 link" href="#cuadro2">Nosotros</a></li>
        <li><a class="a1 link" href="#cuadro">Servicios</a></li>
      </ul>
    </nav>
  </header>
</template>

<style scoped>
.header {
  background-color: var(--color_secundario);
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 5vh;
  padding: 10px 30px;
  box-shadow: 0px 2px 10px 4px gray;
  border-bottom-left-radius: 10px;
  border-bottom-right-radius: 10px;
  z-index: 3;
  max-height: 5vh;
  display: flex;
  align-items: center;
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
  width: 100%;
  max-height: 100%;
}

.logo {
  display: grid;
  grid-template-columns: 15% 85%;
  align-items: center;
  gap: 15px;
  width: 50%;
}

.logo img {
  width: 100%;
  height: 50%;
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
  align-items: center;
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

@media (max-width: 540px) {
  .header {
    padding: 5px;
  }

  .logo {
    display: flex;
    align-items: center;
    justify-content: start;
    gap: 10px;
    width: 60%;
  }

  .logo img {
    width: 20%;
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
    justify-content: center;
    align-content: center;
    clip-path: circle(0% at top right);
    transition: clip-path 0.8s;
    text-align: center;
    width: 100%;
    padding: 0px;
    gap: 180px;
  }

  .links li a {
    font-size: 25px;
  }

  .a1 {
    text-decoration: none;
    color: var(--color_letra_negra);
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
