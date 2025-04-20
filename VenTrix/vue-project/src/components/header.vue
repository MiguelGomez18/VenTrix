<template>
  <header id="header" class="header">
    <nav class="nav">
      <div class="logo">
        <img src="../components/img/logo.png" alt="Logo Ventrix" />
        <a href="">VENTRIX</a>
      </div>
      
      <button class="menu-toggle" @click="toggleMenu">
        <span class="bar"></span>
        <span class="bar"></span>
        <span class="bar"></span>
      </button>
      
      <div class="desktop-content">
        <ul class="links">
          <li><router-link class="link" to="/registro">Iniciar Sesión</router-link></li>
          <li><a class="a1 link" href="#cuadro2">Nosotros</a></li>
          <li><a class="a1 link" href="#cuadro">Servicios</a></li>
        </ul>
        
        <div class="social-icons">
          <a href="https://wa.me/573507113526"><img src="../components/icons/icons8-whatsapp-50.png" alt="WhatsApp"></a>
          <a href=""><img src="../components/icons/icons8-instagram-50.png" alt="Instagram"></a>
          <a href=""><img src="../components/icons/icons8-facebook-nuevo-50 (1).png" alt="Facebook"></a>
        </div>
      </div>
      
      <div class="mobile-menu" :class="{ 'active': isMenuOpen }">
        <div class="mobile-menu-header">
          <img src="../components/img/logo.png" alt="Logo Ventrix" class="mobile-logo" />
          <h3>VENTRIX</h3>
        </div>
        
        <ul class="mobile-links">
          <li>
            <router-link class="link" to="/registro" @click="closeMenu">
              <span class="menu-icon">👤</span> Iniciar Sesión
            </router-link>
          </li>
          <li>
            <a class="a1 link" href="#cuadro2" @click="closeMenu">
              <span class="menu-icon">🏢</span> Nosotros
            </a>
          </li>
          <li>
            <a class="a1 link" href="#cuadro" @click="closeMenu">
              <span class="menu-icon">🛠️</span> Servicios
            </a>
          </li>
          
          <li class="contact-section">
            <h4>Contáctanos</h4>
            <p>¿Necesitas ayuda? Estamos aquí para ti</p>
            <div class="contact-methods">
              <a href="tel:+573507113526" class="contact-link">
                <span class="contact-icon">📞</span> Llamar
              </a>
              <a href="mailto:info@ventrix.com" class="contact-link">
                <span class="contact-icon">✉️</span> Email
              </a>
            </div>
          </li>
          
          <li class="social-mobile">
            <p>Síguenos en:</p>
            <div class="social-icons">
              <a href="https://wa.me/573507113526" aria-label="WhatsApp">
                <img src="../components/icons/icons8-whatsapp-48.png" alt="WhatsApp">
              </a>
              <a href="" aria-label="Instagram">
                <img src="../components/icons/icons8-instagram-48.png" alt="Instagram">
              </a>
              <a href="" aria-label="Facebook">
                <img src="../components/icons/icons8-facebook-48 (1).png" alt="Facebook">
              </a>
            </div>
          </li>
        </ul>
        
        <!-- Footer del menú móvil -->
        <div class="mobile-menu-footer">
          <p>© 2025 VENTRIX</p>
          <p>Todos los derechos reservados</p>
        </div>
      </div>
      <div class="menu-overlay" :class="{ 'active': isMenuOpen }" @click="closeMenu"></div>
    </nav>
  </header>
</template>

<script setup>
import { ref } from 'vue';

const isMenuOpen = ref(false);

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value;
};

const closeMenu = () => {
  isMenuOpen.value = false;
};
</script>

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
  position: relative;
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
  white-space: nowrap;
}

.desktop-content {
  display: flex;
  align-items: center;
  gap: 20px;
}

.links {
  list-style: none;
  display: flex;
  gap: 30px;
  justify-content: right;
  align-items: center;
}

.links li a {
  text-decoration: none;
  color: var(--color_letra);
  font-size: 18px;
  font-family: fuente_principal;
  transition: 0.7s;
  white-space: nowrap;
}

.links li a:hover {
  color: var(--color_letra);
  border-radius: 10px;
  font-size: 18px;
  font-family: fuente_principal;
  filter: drop-shadow(0px 0px 10px var(--color_principal));
}

.social-icons {
  display: flex;
  gap: 10px;
}

.social-icons a img {
  width: 24px;
  height: 24px;
  transition: transform 0.3s;
}

.social-icons a:hover img {
  transform: scale(1.1);
}

/* Estilos para el menú hamburguesa */
.menu-toggle {
  display: none;
  flex-direction: column;
  justify-content: space-between;
  width: 30px;
  height: 21px;
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 0;
  z-index: 11;
}

.menu-toggle .bar {
  width: 100%;
  height: 4px;
  background-color: var(--color_principal);
  transition: all 0.3s ease;
}

.menu-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.3); /* Reducí la opacidad para mejor visibilidad del blur */
  backdrop-filter: blur(3px); /* Efecto blur */
  -webkit-backdrop-filter: blur(3px); /* Soporte para Safari */
  z-index: 9;
  opacity: 0;
  visibility: hidden;
  transition: all 0.3s ease;
}

.menu-overlay.active {
  opacity: 1;
  visibility: visible;
}

.mobile-menu {
  position: fixed;
  top: 0;
  right: 0;
  width: 70%;
  height: 100%;
  background-color: var(--color_principal);
  z-index: 10;
  transform: translateX(100%);
  transition: transform 0.3s ease-in-out;
  overflow-y: auto;
}

/* Estilos para el menú móvil mejorado */
.mobile-menu-header {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.mobile-logo {
  width: 40px;
  height: auto;
}

.mobile-menu-header h3 {
  color: white;
  margin: 0;
  font-size: 1.5rem;
}

.menu-icon {
  margin-right: 10px;
  font-size: 1.2rem;
}

.contact-section {
  padding: 15px;
  margin-top: 20px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
}

.contact-section h4 {
  color: white;
  margin-bottom: 8px;
  font-size: 1.1rem;
}

.contact-section p {
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.9rem;
  margin-bottom: 12px;
}

.contact-methods {
  display: flex;
  gap: 15px;
}

.contact-link {
  display: flex;
  align-items: center;
  color: white;
  text-decoration: none;
  font-size: 0.95rem;
  padding: 8px 12px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 6px;
  transition: background 0.3s;
}

.contact-link:hover {
  background: rgba(255, 255, 255, 0.2);
}

.contact-icon {
  margin-right: 8px;
  font-size: 1rem;
}

.social-mobile p {
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.9rem;
  margin-bottom: 10px;
}

.social-icons {
  display: flex;
  justify-content: center;
  gap: 20px;
}

.social-icons a img {
  width: 28px;
  height: 28px;
  transition: transform 0.3s;
}

.social-icons a:hover img {
  transform: scale(1.1);
}

.mobile-menu-footer {
  padding: 15px;
  text-align: center;
  margin-top: auto;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.mobile-menu-footer p {
  color: rgba(255, 255, 255, 0.6);
  font-size: 0.8rem;
  margin: 5px 0;
}

.mobile-menu.active {
  transform: translateX(0);
}

.mobile-links {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 20px;
}

.mobile-links li a {
  text-decoration: none;
  color: var(--color_letra_blanca);
  font-size: 18px;
  font-family: fuente_principal;
  display: block;
  padding: 10px;
  border-radius: 5px;
  transition: background-color 0.3s;
}

.mobile-links li a:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.social-mobile {
  display: flex;
  justify-content: center;
  gap: 20px;
  padding: 20px 0;
  border-top: 1px solid rgba(255, 255, 255, 0.2);
  margin-top: 20px;
}

.social-mobile a img {
  width: 30px;
  height: 30px;
}

/* Animación para el botón de menú */
.menu-toggle.active .bar:nth-child(1) {
  transform: translateY(9px) rotate(45deg);
}

.menu-toggle.active .bar:nth-child(2) {
  opacity: 0;
}

.menu-toggle.active .bar:nth-child(3) {
  transform: translateY(-9px) rotate(-45deg);
}

@media (max-width: 1024px) {
  .desktop-content {
    gap: 15px;
  }
  
  .links {
    gap: 15px;
  }
  
  .social-icons {
    gap: 8px;
  }
}

@media (max-width: 768px) {
  .nav {
    padding: 3px 15px;
  }
  
  .logo {
    width: 60%;
  }
  
  .logo a {
    font-size: 24px;
  }
  
  .desktop-content {
    display: none;
  }
  
  .menu-toggle {
    display: flex;
  }
}

@media (max-width: 540px) {
  .header {
    padding: 5px 15px;
    height: 6vh;
  }
  
  .logo {
    width: 100%;
    gap: 10px;
  }
  
  .logo img {
    width: 100%;
    height: 30px;
  }
  
  .mobile-menu {
    width: 80%;
  }
  
  .mobile-links li a {
    font-size: 16px;
  }
}
</style>