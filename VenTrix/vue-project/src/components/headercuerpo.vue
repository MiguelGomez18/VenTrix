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
      <ul class="ul">
        <a href=""><img src="../components/icons/icons8-whatsapp-48.png" alt="WhatsApp"></a>
        <a href=""><img src="../components/icons/icons8-instagram-48.png" alt="Instagram"></a>
        <a href=""><img src="../components/icons/icons8-facebook-48 (1).png" alt="Facebook"></a>
        <li><a class="a1" href=""><router-link class="link" to="">SOPORTE</router-link></a></li>
      </ul>
      <a href=""><router-link class="link1" to="/"><img class="user1" src="./icons/icons8-user-48.png" alt=""/></router-link></a>
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
  padding: 0 15px 0 30px;
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
  padding: 3px;
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

.ul {
  list-style: none;
  display: flex;
  width: 40%;
  justify-content: right;
  align-items: center;
}

.ul img{
  width: 100%;
  height: 28px;
}

.user1{
  width: 60%;
}

.user1:hover{
  background-image: url(./icons/icons8-usuario-48.png);
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
}

.ul a{
  padding: 2px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.ul a:hover {
  border-radius: 10px;
  filter: drop-shadow(0px 0px 3px rgb(51, 51, 51));
}

.ul li{
  text-decoration: none;
  color: var(--color_letra);
  font-size: 18px;
  font-family: fuente_principal;
  transition: 0.7s;
  margin: 0 15px;
}

.ul li a:hover {
  color: var(--color_letra);
  border-radius: 10px;
  font-size: 18px;
  font-family: fuente_principal;
  filter: drop-shadow(0px 0px 3px rgb(51, 51, 51));
}
</style>