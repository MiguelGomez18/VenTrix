<template>
    <div class="boton">
        <a href="#pago" @click="openModal" class="target">PAGAR</a>
    </div>
   <section class="modal" v-if="showModal" id="pago">
        <h2>Información de forma de pago</h2>
        <article class="division">
            <h3>Total a pagar</h3>
        </article>
        <article class="division1">
            <span>54000</span>
        </article>
        <span class="linea"></span>
        <button class="agregar" @click="addPaymentMethod">Agregar Forma de pago</button>

        <div v-for="(method, index) in paymentMethods" :key="index" class="payment-method">
            <select class="pagos" v-model="method.type">
                <option value="">Seleccionar forma de pago</option>
                <option value="">Efectivo</option>
                <option value="">Credito</option>
                <option value="">Nota Credito</option>
                <option value="">Puntos</option>
                <option value="">Tarjeta de credito</option>
                <option value="">Tajeta debito</option>
                <option value="">Tranferencias bancarias</option>
                <option value="">Nequi</option>
                <option value="">Daviplata</option>
            </select>
            <input type="number" class="pago">
        </div>
        
        <button class="pagar" @click="closeModal">Pagar</button>
   </section>
</template>

<script>
import Swal from 'sweetalert2';
export default {
  data() {
    return {
      showModal: true, // Mostrar o no el modal
      paymentMethods: [
        {
          type: "",
          amount: 54000
        }
      ]
    };
  },
  methods: {
    openModal() {
      // Mostrar el modal
      this.showModal = true;
    },
    addPaymentMethod() {
      // Agregar una nueva forma de pago
      this.paymentMethods.push({
        type: "",
        amount: 0 // Por ahora el monto es fijo
      });
    },
    closeModal() {
      // Cerrar el modal
      this.showModal = false;

      Swal.fire({
            icon: 'success',
            title: 'Pago exitoso',
            text: 'Gracias por comprar con nosotros'
        });

      this.paymentMethods = [
    {
      type: "", // Tipo de pago vacío
      amount: 0 // El monto inicial
    }
  ];
    }
  }
};
</script>

<style>
.boton {
    padding: 20px;
    margin: 30px;
    width: 70px;
    background-color: chartreuse;
    border-radius: 20px;
    font-family: fuente_principal;
    font-size: 20px;
}

.modal {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: white;
    box-shadow: 0px 0px 10px 1000px rgba(75, 75, 75, 0.486);
    display: flex;
    justify-content: space-around;
    align-items: center;
    flex-wrap: wrap;
    text-align: center;
    width: 42%;
    transition: opacity 0.4s;
    opacity: 0;
    z-index: 1;
    padding: 15px 10px;
}

.modal:target {
    opacity: 1;
}

.modal h2{
    width: 100%;
    border-radius: 10px;
    padding: 10px 0px;
    background-color: var(--color_principal);
    font-family: fuente_principal;
    color: var(--color_letra_blanca);
}

.modal .division{
    width: 40%;
    margin: 30px 30px 15px;
    text-align: left;
    font-size: 20px;
}

.modal .division1{
    width: 40%;
    margin: 30px 20px 5px;
    text-align: right;
    font-size: 50px;
    font-family: fuente_principal;
    color: green;
    padding: 10px 10px;
}

.linea {
    width: 90%;
    margin-bottom: 50px;
    border-bottom: 1px solid rgba(67, 67, 67, 0.234);
}

.modal .agregar{
    width: 80%;
    padding: 10px 0px;
    background-color: var(--color_principal);
    border: 0;
    color: var(--color_letra_blanca);
    margin-bottom: 30px;
}

.payment-method {
    width: 100%;
    display: flex;
    flex-wrap: nowrap;
    justify-content: space-evenly;
    align-items: center;
    gap: 20px;
}

.pagos{
    width: 40%;
    border: 1px solid rgba(67, 67, 67, 0.234);
    padding: 10px 5px;
    margin: 10px 0;
}

.pago{
    width: 40%;
    text-align: right;
    border: 1px solid rgba(67, 67, 67, 0.234);
    padding: 10px 10px;
}

.pagar {
    margin-top: 30px;
    padding: 15px;
    background-color: var(--color_principal);
    font-size: 15px;
    border: 0;
    border-radius: 5px;
    color: var(--color_letra_blanca);
}
</style>