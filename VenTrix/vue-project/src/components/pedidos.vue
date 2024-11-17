<template>
    <h1>pedidos</h1>
    <div class="pedidos-container">
        <v-btn class="pedidos" color="green darken-1" large>
            <img src="./icons/table-svgrepo-com (1).svg" alt="Pedido Icon" />
            <span>nombre</span>
        </v-btn>
        <v-btn class="pedidos" color="green darken-1" large>
            <img src="./icons/table-svgrepo-com (1).svg" alt="Pedido Icon" />
            <span>nombre</span>
        </v-btn>
        <v-btn class="pedidos" color="green darken-1" large>
            <img src="./icons/table-svgrepo-com (1).svg" alt="Pedido Icon" />
            <span>nombre</span>
        </v-btn>
    </div>
</template>

<style scoped>
.pedidos-container {
    width: 80%;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-evenly;
    align-items: center;
}

.pedidos {
    padding: 10px;
    width: 10%;
    display: flex;
    justify-content: space-evenly;
    align-items: center;
    flex-direction: column;
    border: 3px solid var(--color_principal);
    border-radius: 15px;
}
.pedidos img {
    width: 100%;
}
</style>