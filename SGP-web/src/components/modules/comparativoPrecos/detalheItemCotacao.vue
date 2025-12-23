<template>
    <!-- Comparativo de preços -->
  <div class="column centered-start detalhe-item-container">
    <div class="row-flex centered-between detalhe-titulo">
      <div class="row-flex centered-start gap-10">
        <i class="item-detalhe-icone fa fa-dollar"></i> Detalhamento de Cotação de Item de Despesa
      </div>
      <i class="item-detalhe-icone button-icone fa fa-remove" @click="toggleDetalharItem(false)"></i>
    </div>
    <div class="row-flex centered-between detalhe-titulo-sessao">
        <div>
          <i class="fa fa-object-ungroup"></i> Composição da Cotação
        </div>
        <div class="row-flex centered-end detalhe-mostrar-button" @click="showAll = !showAll">
          <div v-if="!showAll">
            <i class="fa fa-folder"></i> Detalhar Tudo
          </div>
          <div v-else>
            <i class="fa fa-folder-open"></i> Esconder Detalhes
          </div>
        </div>
    </div>

    <div v-for="item, index in itemCotacao['cotacao']" class="column all-centered detalhe-item-cotacao-container">
        <detalheItemLicitacao :itemLicitacao="item" :relatorioCotacao="true" :index="index + 1" :total="itemCotacao['cotacao'].length" :showAll="showAll"/>
    </div>

    <div class="row-flex centered-start detalhe-titulo-sessao" v-if="itemCotacao.remocaoManual.length > 0">
        <i class="fa fa-user-times"></i> Itens Removidos Manualmente Pelo Usuário
    </div>

    <div v-if="itemCotacao.remocaoManual.length > 0" class="column all-centered detalhe-item-remocao-manual-container">
      <div v-for="item, index in itemCotacao.remocaoManual" class="column start-centered w-100">
        <div class="detalhe-justificativa-divider"></div>
        <div class="row-flex centered-start detalhe-justificativa">
          <i class="fa fa-exclamation-circle"></i> Justificativa: <b>{{item.justificativa}}</b>
        </div>
        <div class="row-flex centered-start detalhe-justificativa">
          <i class="fa fa-user"></i> Responsável: <b>{{item.responsavel}}</b>
        </div>
        <detalheItemLicitacao :itemLicitacao="item.item" :relatorioCotacao="true" :index="index + 1" :total="itemCotacao.remocaoManual.length" :showAll="showAll" :removidoManual="true"/>
      </div>
    </div>

    <div class="row-flex centered-start detalhe-titulo-sessao">
        <i class="fa fa-calculator"></i> Detalhamento do Calculo
    </div>

    <div class="column all-centered cotacao-calculo-container">          
        <div class="row-flex all-centered cotacao-calculo-tabela-container">
            <div class="row-flex all-centered cotacao-tabelas">
                <tr class="column centered-start cotacao-tabela">
                <td class="cotacao-tabela-header">Variáveis</td>
                <td class="cotacao-tabela-linha">Média</td>
                <td class="cotacao-tabela-linha">Desvio Padrão (DP):</td>
                <td class="cotacao-tabela-linha">Coeficiente de Variação (CV):</td>
                <td class="cotacao-tabela-linha">Limite Superior (LS):</td>
                <td class="cotacao-tabela-linha">Limite Inferior (LI):</td>
                </tr>
                <tr class="column centered-start cotacao-tabela">
                <td class="cotacao-tabela-header">Universo Amostral Selecionado</td>
                <td class="cotacao-tabela-linha">{{calculoAmostral.media | real}}</td>
                <td class="cotacao-tabela-linha">{{calculoAmostral.DP | real}}</td>
                <td class="cotacao-tabela-linha">{{calculoAmostral.CV}}%</td>
                <td class="cotacao-tabela-linha">{{calculoAmostral.LS | real}}</td>
                <td class="cotacao-tabela-linha">{{calculoAmostral.LI | real}}</td>
                </tr>
                <tr class="column centered-start cotacao-tabela">
                <td class="cotacao-tabela-header">Universo Amostral Saneado</td>
                <td class="cotacao-tabela-linha"><b>{{calculoFinal.media | real}} (Média Saneada)</b></td>
                <td class="cotacao-tabela-linha">-</td>
                <td class="cotacao-tabela-linha"><b>{{calculoFinal.CV}}% (CV Saneado)*</b></td>
                <td class="cotacao-tabela-linha">-</td>
                <td class="cotacao-tabela-linha">-</td>
                </tr>
            </div>

            <div class="column all-centered cotacao-indicativo">
                <div class="column all-centered cotacao-resumo">
                <div class="row-flex centered-start cotacao-titulo">
                    <i class="fa fa-map-pin"></i> Resumo:
                </div>

                <div class="column all-end resumo-container">
                    <div>
                    <b>{{itemCotacao.cotacao.length + itemCotacao.universoAmostralSaneado.length}} </b> Itens Encontrados
                    </div>
                    <div>
                    <b>{{itemCotacao.universoAmostralSaneado.length}} </b> Itens Saneados
                    </div>
                    <div>
                    <b>{{itemCotacao.cotacao.length}} </b> Itens Cotados
                    </div>
                    <div>
                    <b>{{calculoFinal.CV}}% </b> Coeficiente de Variação
                    </div>
                </div>

                <div v-if="calculoFinal.CV <= 25 && calculoFinal.CV !== 0" class="row-flex all-centered diagnostico-card diagnostico-ok">
                    <i class="fa fa-thumbs-up"></i> CV calculado indica razoável homogeneização do Valor.
                </div>

                <div v-if="calculoFinal.CV > 25" class="row-flex all-centered diagnostico-card diagnostico-atencao">
                    <i class="fa fa-exclamation-circle"></i> O CV calculado indica baixa homogeneização do Valor, atenção. Sujeito a análise.
                </div>
                </div>
            </div>
          </div>
          <div class="row-flex centered-between preco-referencia-container">
            <div class="column start-centered">
              <div class="preco-referencia-titulo">Preço de Referência:</div>
              <div class="preco-referencia-subtitulo">Universo Amostral: {{ itemCotacao.cotacao.length + itemCotacao.universoAmostralSaneado.length }}</div>
            </div>
            <div class="preco-referencia-calculo-final">
              {{ calculoFinal.media | real }}
            </div>
          </div>
     </div>
  </div>
</template>
   
 <script>
 import { mapGetters } from 'vuex'
 import detalheItemLicitacao from './detalheItemLicitacao.vue'
 import moment from 'moment'
 export default {
   name: 'detalheItemCotacao',
   components: {
     detalheItemLicitacao
   },
   data () {
     return {
       moment: moment,
       calculoFinal: [],
       calculoAmostral: [],
       showAll: false
     }
   },
   props: {
     itemCotacao: Object,
     toggleDetalharItem: Function
   },
   computed: {
     ...mapGetters([
       'usuarioLogado'
     ])
   },
   watch: {
   },
   mounted: function () {
     this.calculoFinal = this.itemCotacao.calculoFinal
     this.calculoAmostral = this.itemCotacao.calculoAmostral
   },
   methods: {
    //  toggleAdicionarItem (valor) {
    //    this.abrirCotacaoPrecos = valor
    //  }
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
        padding: 20px;
        border-radius: 10px;
        gap: 10px;
        box-shadow: 0px 1px 0px rgba(198, 188, 188, 0.5);
        animation: fade 0.5s ease;
    }

    .detalhe-item-cotacao-container {
        width: 100%;
    }

    .detalhe-titulo {
      width: 100%;
      gap: 10px;
      font-size: 1.5rem;
      font-weight: 700;
      padding: 20px;
      background-color: #158ac0;
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
    .detalhe-titulo-sessao {
        width: 100%;
        font-weight: 700;
        color: #158ac0;
        font-size: 2rem;
        border-bottom: 2px dashed #158ac0;
        padding: 20px;
        gap: 10px;
    }
    .cotacao-calculo-container {
    width: 100%;
    background-color: #fcfcfc;
    box-sizing: border-box;
    box-shadow: 0px 1px 0px rgba(198, 188, 188, 0.5);
    border-radius: 10px;
    padding: 20px;
  }
  .cotacao-calculo-tabela-container {
    width: 100%;
    border:1px solid  #c7dafc;
    box-sizing: border-box;
    box-shadow: 0px 1px 0px rgba(198, 188, 188, 0.5);
    border-radius: 10px;
    gap: 10px;
    padding: 20px;
    margin-bottom: 10px;
  }
  .cotacao-tabelas {
    width: 60%;
    height: 250px;
    padding: 20px;
    background-color: #FFFFFF;
    border-bottom: 1px solid #cbe0ff;
    box-shadow: 0px 1px 0px rgba(198, 188, 188, 0.5);
  }
  .cotacao-tabela {
    width: 100%;
  }
  .cotacao-tabela-linha {
    width: 100%;
    border-bottom: 1px solid #cbe0ff;
    padding: 5px;
    text-align: right;
  }
  .cotacao-tabela-linha:nth-child(even) {
    background-color: #eff4fc; 
  }
  .cotacao-tabela-linha:nth-child(odd) {
    background-color: #ffffff; 
  }
  .cotacao-tabela-header {
    background-color: #e3eeff;
    color: #158ac0;
    border-bottom: 1px solid #cbe0ff;
    width: 100%;
    padding: 5px;
    font-weight: 700;
    text-align: right;
  }
  .cotacao-indicativo {
    width: 40%;
    height: 250px;
    box-sizing: border-box;
    border-radius: 10px;
    padding: 20px;
    background-color: #eff4fd;
  }

  .cotacao-titulo-container {
    width: 100%;
    padding-bottom: 10px;
    margin-bottom: 10px;
    border-bottom: 2px solid #158ac0;
  }

  .cotacao-titulo {
    width: 100%;
    gap: 5px;
    font-weight: 700;
    color: #158ac0;
  }

  .cotacao-subtitulo {
    width: 100%;
  }

  .cotacao-resumo {
    width: 100%;
    gap: 10px;
  }

  .resumo-container {
    width: 100%;
    background-color: #fcfcfc;
    border-bottom: 1px solid #cbe0ff;
    padding: 10px;
    /* border-radius: 10px; */
    box-shadow: 0px 1px 0px rgba(198, 188, 188, 0.5);
  }

  .diagnostico-card {
    width: 100%;
    padding: 10px 30px;
    border-radius: 10px;
    color: #FFFFFF;
    font-weight: 700;
    gap: 5px;
    box-shadow: 0px 1px 0px rgba(198, 188, 188, 0.5);
  }
  .diagnostico-card i {
    font-size: 3rem;
    margin-right: 10px;
  }
  .diagnostico-ok {
    background-color: #2E7D32;
  }
  .diagnostico-atencao {
    background-color: #FF9900;
  }

  .detalhe-mostrar-button {
    background-color: #158ac0;
    color: #FFFFFF;
    padding: 10px 20px;
    border-radius: 20px;
    transition: 0.2s ease;
    cursor: pointer;
    gap: 5px;
    font-size: 1.2rem;
  }
  .detalhe-mostrar-button:hover {
    scale: 1.1;
  }
  .preco-referencia-container {
    width: 100%;
    background-color: #FFEC86;
    padding: 20px;
    box-shadow: 0px 1px 0px rgba(198, 188, 188, 0.5);
  }
  .preco-referencia-titulo {
    font-weight: 700;
    font-size: 2rem;
  }
  .preco-referencia-calculo-final {
    font-size: 2.5rem;
  }
  .detalhe-item-remocao-manual-container {
        width: 100%;
        box-shadow: 0px 1px 0px rgba(198, 188, 188, 0.5);
        border: 1px solid #D2D6DE;
        padding: 10px;
        background-color: #f5f5f5;
        border-radius: 10px;
    }
  
  .detalhe-justificativa-divider {
    width: 100%;
    border-bottom: 2px dashed #D2D6DE;
    margin-top: 10px;
    margin-bottom: 10px;
  }
  .detalhe-justificativa {
    width: 100%;
    background-color: #eee7e7;
    margin: 5px 0px;
    gap: 5px;
    padding: 10px;
    box-shadow: 0px 1px 0px rgba(198, 188, 188, 0.5);
    border: 1px solid #D2D6DE;
  }
 </style>