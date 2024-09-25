<template>
    <div class="contenedorProductos">
      <div class="titulobuscar">
        <h1>GESTIÓN DE PRODUCTOS</h1>
        <input 
        type="text" 
        v-model="consultaBusqueda" 
        placeholder="Buscar Producto" 
        />
      </div>
     
      <div class="contenedorformulario">
        <form class="formulario" @submit.prevent="estaEditando ? actualizarProducto() : agregarProducto()">
          <input type="text" v-model="producto.nombre" placeholder="Nombre del producto" required />
          <input type="number" v-model="producto.precio" placeholder="Precio" required />
          <input type="text" v-model="producto.categoria" placeholder="Categoría" required />
          <input type="number" v-model="producto.cantidad" placeholder="Cantidad" required />
          <button class="btnAggAct" type="submit">{{ estaEditando ? 'Actualizar' : 'Agregar' }}</button>
          <button class="btncancelar" type="button" @click="cancelarEdicion" v-if="estaEditando">Cancelar</button>
        </form>
      </div>
    
      
      <table>
        <thead class="encabezado">
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Precio</th>
            <th>Categoría</th>
            <th>Cantidad</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(prod, indice) in productosFiltrados" :key="prod.id">
            <td>{{ prod.id }}</td>
            <td>{{ prod.nombre }}</td>
            <td>{{ prod.precio }}</td>
            <td>{{ prod.categoria }}</td>
            <td>{{ prod.cantidad }}</td>
            <td>
              <button class="btnEditar" @click="editarProducto(indice)">Editar</button>
              <button class="btnEliminar" @click="eliminarProducto(indice)">Eliminar</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        productos: [], 
        producto: {
          nombre: '',
          precio: '',
          categoria: '',
          cantidad: ''
        },
        estaEditando: false, 
        indiceEdicion: null, 
        consultaBusqueda: '', 
        siguienteId: 1 
      };
    },
    computed: {
      productosFiltrados() {
    
        return this.productos.filter(prod => 
          prod.nombre.toLowerCase().includes(this.consultaBusqueda.toLowerCase())
        );
      }
    },
    methods: {
      agregarProducto() {
        const nuevoProducto = { id: this.siguienteId++, ...this.producto }; 
        this.productos.push(nuevoProducto);
        this.resetearFormulario();
      },
      editarProducto(indice) {
        this.producto = { ...this.productos[indice] };
        this.estaEditando = true;
        this.indiceEdicion = indice;
      },
      actualizarProducto() {
  
        this.productos[this.indiceEdicion] = { id: this.productos[this.indiceEdicion].id, ...this.producto };
        this.resetearFormulario();
      },
      eliminarProducto(indice) {
        this.productos.splice(indice, 1);
      },
      cancelarEdicion() {
        this.resetearFormulario();
      },
      resetearFormulario() {
        this.producto = { nombre: '', precio: '', categoria: '', cantidad: '' };
        this.estaEditando = false;
        this.indiceEdicion = null;
      }
    }
  };
  </script>
  
  <style>
  .titulobuscar{
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
  }
  .titulobuscar h1{
    font-size: 25px;
    color: var(--color_principal);
  
  }
  .encabezado{
    background-color: var(--color_principal);
    color: var(--color_letra_blanca);
  }
  .contenedorformulario{
    display: flex;
    justify-content: center;
    align-items: center;
    
  }
  .formulario input{
    width: 100%;
  }
  .formulario {
    width: 100%;
    display: flex ;
    align-items: center;
    border: solid var(--color_principal);
    border-radius: 10px;
    gap: 10px;
    padding: 10px;
  }
  .contenedorProductos{
    width: 80%;
    height: auto;
    border-radius: 10px;
    padding: 30px;
    border: solid 3px var(--color_principal);
  }
  table {
    width: 100%;
    border-collapse: collapse;
    color: var(--color_letra_negra);
    margin-top: 20px;
  }
  table, th, td {
    border: 2px solid rgb(215, 226, 215);
  }
  th, td {
    padding: 5px;
    text-align: center;
  }
  .btnEditar {
    background-color: var(--color_principal);
    color: var(--color_letra_blanca);
    margin-right: 4px;
    padding: 5px;
    border-radius: 10px;
  }
  .btnEliminar {
    background-color: red;
    color: var(--color_letra_blanca);
    margin-left: 5px;
    padding: 5px;
    border-radius: 10px;
  }
  .btnAggAct{
    width: 30%;
    background-color: var(--color_principal);
    color: var(--color_letra_blanca);
    border-radius: 10px;
    padding: 4px;
  }
  
  .btncancelar{
    width: 30%;
    background-color:red;
    color: var(--color_letra_blanca);
    border-radius: 10px;
    padding: 4px;
  }
  </style>