<template>
  <div id="124568189198">
    <span class="titulo-texto">{{ titulo }}:</span>
    <span class="valor-texto">{{ valor }}</span>
  </div>
</template>

<script>
export default {
  props: ['titulo', 'valor']
}
</script>

<style scoped>
.titulo-texto {
  font-weight: 700;
  font-size: 10px;
}

.valor-texto {
  font-size: 10px;
}

@media print {
  .titulo-texto {
    font-weight: 700;
    font-size: 10px;
  }

  .valor-texto {
    font-size: 10px;
  }
}
</style>
