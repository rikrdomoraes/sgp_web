<template>
  <div class="column centered-start" :class="relatorioCotacao ? 'detalhe-item-container-cotacao' : 'detalhe-item-container'">
    <div class="row-flex centered-between detalhe-titulo" :class="removidoManual ? 'detalhe-titulo-removido-manual' : ''">
      <div class="row-flex centered-start gap-10">
        <i class="item-detalhe-icone fa fa-arrow-circle-right"></i> Detalhamento de Item de Licitação [{{ itemLicitacao['id'] }}]
      </div>
      <i class="item-detalhe-icone button-icone fa fa-remove" @click="toggleDetalhe(false)" v-if="!relatorioCotacao"></i>
    </div>
    <div class="row-flex start-centered detalhe-item-row" v-if="itemLicitacao['descricao_lote'] !== '0' && showAll">
      <itemDetalheLicitacao titulo="Descrição Lote" :value="itemLicitacao['descricao_lote']" icone="fa-bars" />
    </div>
    <div class="row-flex start-centered detalhe-item-row">
      <itemDetalheLicitacao titulo="Produto" :value="itemLicitacao['descricao_item']" icone="fa-cube" />
    </div>
    <div class="row-flex start-centered detalhe-item-row" v-if="showAll">
      <itemDetalheLicitacao titulo="Descrição Adicional" :value="itemLicitacao['descricao_simplificada_item']" icone="fa-cubes" />
    </div>
    <div class="row-flex start-centered detalhe-item-row">
      <itemDetalheLicitacao titulo="Valor do Item" :value="itemLicitacao['valor_item']" :formatarValor="true" icone="fa-dollar" />
    </div>
    <div class="row-flex start-centered detalhe-item-row" v-if="showAll">
      <itemDetalheLicitacao titulo="Quantidade Aprovada" :value="itemLicitacao['quantidade_item_aprovado']" icone="fa-tags" />
      <itemDetalheLicitacao titulo="Valor do Lote" :value="itemLicitacao['valor_total_lote_item']" :formatarValor="true" icone="fa-money" />
    </div>

    <div class="row-flex start-centered detalhe-item-row" v-if="showAll">
      <itemDetalheLicitacao titulo="Licitação" :value="itemLicitacao['codigo_licitacao']" icone="fa-balance-scale" />
      <itemDetalheLicitacao titulo="Data Licitação" :value="moment.utc(itemLicitacao['data_resultado_licitacao']).format('MM/YYYY')" icone="fa-calendar" />
    </div>
    <div class="row-flex start-centered detalhe-item-row" v-if="itemLicitacao['sigla_uf'] !== '0' && showAll">
      <itemDetalheLicitacao titulo="UF" :value="itemLicitacao['sigla_uf']" icone="fa-map"/>
    </div>
    <a :href="linkLicitacao(itemLicitacao['nome_fonte_dado'])" target="_blank" class="row-flex start-centered detalhe-item-row" v-if="showAll">
      <itemDetalheLicitacao titulo="Fonte de Dados" :value="itemLicitacao['nome_fonte_dado']" icone="fa-commenting" link/>
    </a>
    <div class="row-flex start-centered detalhe-item-row" v-if="showAll">
      <itemDetalheLicitacao titulo="Fornecedor" :value="itemLicitacao['nome_fornecedor']" icone="fa-cog" />
      <itemDetalheLicitacao titulo="CNPJ Fornecedor" :value="itemLicitacao['codigo_cnpj_fornecedor']" icone="fa-cogs" />
    </div>
    <div class="row-flex start-centered detalhe-item-row" v-if="showAll">
      <itemDetalheLicitacao titulo="Comprador" :value="itemLicitacao['nome_orgao_comprador']" icone="fa-shopping-cart" />
    </div>
    <div class="row-flex start-centered detalhe-item-row" v-if="showAll">
      <itemDetalheLicitacao titulo="Setor" :value="itemLicitacao['nome_setor_item']" icone="fa-object-group" v-if="itemLicitacao['nome_setor_item'] !== '0'"/>
      <itemDetalheLicitacao titulo="Categoria" :value="itemLicitacao['nome_categoria_item']" icone="fa-sliders" v-if="itemLicitacao['nome_categoria_item'] !== '0'"/>
      <itemDetalheLicitacao titulo="Grupo" :value="itemLicitacao['nome_grupo_item']" icone="fa-sort-alpha-asc" v-if="itemLicitacao['nome_grupo_item'] !== '0'"/>
      <itemDetalheLicitacao titulo="Classificação" :value="itemLicitacao['nome_classificacao_item']" icone="fa-tasks" v-if="itemLicitacao['nome_classificacao_item'] !== '0'"/>
    </div>
    <div class="row-flex all-end detalhe-rodape" v-if="relatorioCotacao">
      0{{ index }} / 0{{ total }}
    </div>
  </div>
</template>
   
 <script>
 import { mapGetters } from 'vuex'
 import moment from 'moment'
 import itemDetalheLicitacao from './itemDetalheLicitacao.vue'
 export default {
   name: 'detalheItemLicitacao',
   components: {
     itemDetalheLicitacao
   },
   data () {
     return {
       moment: moment
     }
   },
   props: {
     itemLicitacao: Object,
     toggleDetalhe: Function,
     relatorioCotacao: Boolean,
     index: { type: Number, default: 0 },
     total: { type: Number, default: 0 },
     showAll: {type: Boolean, default: true},
     removidoManual: {type: Boolean, default: false}
   },
   computed: {
     ...mapGetters([
       'usuarioLogado'
     ])
   },
   watch: {
   },
   mounted: function () {
   },
   methods: {
     linkLicitacao (fonteDados) {
       if (fonteDados === 'AOP') {
         return 'https://www.licitacoes-e.com.br/aop/'
       }
       if (fonteDados === 'PNCP') {
         return 'https://pncp.gov.br/app/editais?pagina=1'
       }
       if (fonteDados === 'Portal da transparencia') {
         return 'https://portaldatransparencia.gov.br/licitacoes/consulta'
       }
       return ''
     }
   }
 }
 </script>
   
 <style scoped>
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
    .detalhe-item-container {
        background-color: #FFFFFF;
        width: 100%;
        height: 800px;
        overflow: auto;
        padding: 30px;
        gap: 10px;
        border-radius: 10px;
        box-shadow: 0px 1px 0px rgba(198, 188, 188, 0.5);
        border: 1px solid #D2D6DE;
        animation: fade 0.5s ease;
    }
    .detalhe-item-container-cotacao {
        background-color: #FFFFFF;
        width: 100%;
        /* height: 600px;
        overflow: auto; */
        padding: 30px;
        gap: 10px;
        border-radius: 10px;
        box-shadow: 0px 1px 0px rgba(198, 188, 188, 0.5);
        border: 1px solid #D2D6DE;
        animation: fade 0.5s ease;
    }
    .detalhe-item-row {
      width: 100%;
      gap: 5px;
      /* border: 1px solid #D2D6DE; */
      text-decoration: none !important;
      border-radius: 10px;
      animation: fade 0.5s ease;
    }

    .detalhe-titulo {
      width: 100%;
      gap: 10px;
      font-size: 1.5rem;
      font-weight: 700;
      padding: 20px;
      border-bottom: 2px solid #1565C0;
      background-color: #1565C0;
      color: #F0F0F0;
    }
    .detalhe-titulo-removido-manual {
      border-bottom: 2px solid #c01515;
      background-color: #c01515;
      color: #F0F0F0;
    }

    .item-detalhe-icone {
      font-size: 2.5rem;
    }

    .button-icone {
      transition: 0.2s ease;
      cursor: pointer;
    }

    .button-icone:hover {
      scale: 1.1;
    }

    .detalhe-rodape {
      font-weight: 700;
      width: 100%;
      color: #D2D6DE;
    }
 </style>