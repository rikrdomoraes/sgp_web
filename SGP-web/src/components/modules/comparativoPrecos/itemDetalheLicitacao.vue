<template>
  <div class="column start-centered item-detalhe-container">
    <div class="row-flex centered-start item-detalhe-titulo">
        <i class="item-detalhe-icone fa" :class="icone"></i>
        <div>
            {{ titulo }}
        </div>
    </div>
    <div v-if="!formatarValor" class="item-detalhe-valor">
        {{ value }} <i class="fa fa-external-link" v-if="link"></i>
    </div>
    <div v-else class="item-detalhe-valor">
        {{ value | real }}
    </div>
  </div>
</template>
   
 <script>
 import moment from 'moment'
 export default {
   name: 'detalheItemLicitacao',
   components: {
   },
   data () {
     return {
       moment: moment
     }
   },
   props: {
     titulo: String,
     icone: String,
     value: String,
     formatarValor: Boolean,
     link: {type: Boolean, default: false}
   },
   methods: {
   }
 }
 </script>
   
 <style scoped>
    .item-detalhe-container {
        width: 100%;
        padding: 10px;
        gap: 10px;
    }
    .item-detalhe-titulo {
        width: 100%;
        padding-bottom: 5px;
        color: #1565C0;
        font-weight: 700;
        border-bottom: 1px solid #1565C0;
        gap: 5px;
    }
    .item-detalhe-valor {
        width: 100%;
        padding: 10px 20px;
        /* background-color: #e9eef7; */
        background-color: #eff4fd;
        border-radius: 20px;
        box-shadow: 0px 1px 0px rgba(198, 188, 188, 0.5);
    }
    .item-detalhe-icone {
        font-size: 2rem;
    }
    @keyframes fadeAndSlide {
    0% {
      opacity: 0;
      transform: translateY(-1000px);
    }
    100% {
      opacity: 1;
      transform: translateY(0);
    }
    }
    @keyframes fade {
    0% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
    }
 </style>