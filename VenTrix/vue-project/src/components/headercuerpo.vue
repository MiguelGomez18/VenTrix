<template>
    <header class="header1">
        <nav class="nav1">
      <div class="logo1">
        <img src="" alt="" />
        <a href="">VENTRIX</a>
      </div>
      <a href="#menu" class="target">
        <img
          src="../components/icons/Menu_icon_2_icon-icons.com_71856.svg"
          class="icon"
        />
      </a>
      <ul class="links1" id="menu">
        <img src="../components/icons/icons8-whatsapp-48.png" alt="WhatsApp">
        <img src="../components/icons/icons8-instagram-48.png" alt="Instagram">
        <img src="../components/icons/icons8-facebook-48 (1).png" alt="Facebook">
        <li><a class="a1" href=""><router-link class="link" to="">SOPORTE</router-link></a></li>
        <li><a class="a1" href=""><router-link class="link" to="/inicio">login</router-link></a></li>
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
.header1 {
  background-color: var(--color_principal);
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  padding: 0 30px;
  box-shadow: 0px 2px 10px 4px gray;
  border-bottom-left-radius: 10px;
  border-bottom-right-radius: 10px;
  color: var(--color_letra_blanca);
  z-index: 3;
}

.nav1 {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 3px 30px;
}

.logo1 {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 60%;
}

.logo1 img {
  width: 6%;
}

.logo1 a {
  text-decoration: none;
  font-size: 33px;
  font-family: fuente_principal;
  color: var(--color_letra_blanca);
}

.links1 {
  list-style: none;
  display: flex;
  gap: 10px;
  width: 40%;
  justify-content: right;
}

.links1 img{
    width: 5%;
}

.links1 li a {
  text-decoration: none;
  color: var(--color_letra);
  font-size: 18px;
  font-family: fuente_principal;
  transition: 0.7s;
  margin: 0 6px;
}

.links1 li a:hover {
  color: var(--color_letra);
  border-radius: 10px;
  font-size: 18px;
  font-family: fuente_principal;
  filter: drop-shadow(0px 0px 3px rgb(51, 51, 51));
}
</style>