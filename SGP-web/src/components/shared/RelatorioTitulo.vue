<template>
  <div class="box box-primary">
    <div class="box-header with-border">
      <span class="titulo-especial">{{ valor }}</span>
    </div>
    <div class="box-body" style="padding-top: 0px;">
      <slot/>
    </div>
  </div>
</template>

<script>
export default {
  props: ['valor']
}
</script>

<style scoped>
.titulo-especial {
  font-size: 15px;
}
</style>
