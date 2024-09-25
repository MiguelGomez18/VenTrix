<template>
    <div class="mesas">
      <img src="./icons/table-svgrepo-com (1).svg" alt="">
      <h1>mesa 1</h1>
    </div>
  </template>
  
  <style>
    .mesas {
    width: 100px ;
    height: 100px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 20px;
    background-color: #f0f0f0;
    border: 5px solid var(--color_principal);
    border-radius: 10px; 
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2); 
    cursor: pointer;
    margin: 20px;
    }
  
    .mesas img {
      width: 100px; 
      height: 100px;
      
    }
  
    .mesas h1 {
      font-size: 20px;
      font-weight:lighter;
      font-family: 'Lucida Sans', 'Lucida Sans Regular', 'Lucida Grande', 'Lucida Sans Unicode', Geneva, Verdana, sans-serif;
      text-align: center;
      
    }
</style>