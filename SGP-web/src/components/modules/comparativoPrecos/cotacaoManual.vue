<template>
    
    <div class="column centered-start cotacao-manual-main-container">
        <div class="row-flex centered-start cotacao-header-container">
          <i class="fa fa-dollar"></i> Cotação Manual
        </div>
        <div class="row-flex all-start w-100 gap-5">
          <div class="column all-start cotacao-input-container" ref="nomeItemCotacao">
              <label class="f-required">Item de cotação:</label>
              <input v-model="nomeItem" :disabled="this.visualizacao" type="text" class="form-control" :class="errorInput ? 'error-input' : ''" placeholder="Digite o nome do item a ser cotado, ref. histórico do cronograma." @input="errorInput = false">
          </div>
          <div class="column all-start cotacao-input-container" ref="nomeItemCotacao">
              <label class="f-required">Valor:</label>
              <money v-model="valor" class="form-control" :disabled="this.visualizacao"></money>
          </div>
        </div>

        <div class="column start-centered cotacao-manual-anexo-container">
              <label class="control-label f-required">Anexo:</label>
              <uploadCotacaoManual v-if="!carregandoAnexos" 
                :propDocumentos="anexos"
                class="w-100" 
                localUso="COTACAO_MANUAL"
                :maxFiles="3"
                :disable="this.visualizacao"
              ></uploadCotacaoManual>
              <div v-else>
                <i class="fa fa-refresh fa-spin" style="top: 50%; left: 50%; position: absolute; font-size: 30px"></i>
                Carregando Anexos...
              </div>
        </div>
        <div class="column all-start cotacao-input-container" ref="nomeItemCotacao">
            <label class="f-required">Justificativa:</label>
            <textarea v-model="justificativa" type="text" :disabled="this.visualizacao" class="form-control justificativa-input" placeholder="Escreva a Justificativa para cotação Manual ( ex: Produto não encontrado no sistema de cotação | Meu valor é melhor)"></textarea>
        </div>

        <div class="row-flex centered-end w-100 gap-5" v-if="!visualizacao">
            <g-button-ujarak color="success" @click.native="gravarResultado()"><i class="fa fa-save" aria-hidden="true"></i> Salvar </g-button-ujarak>
            <g-button-ujarak color="error" @click.native="toggleCotacaoManual(false)"><i class="fa fa-close" aria-hidden="true"></i> Cancelar </g-button-ujarak>
        </div>
        <div v-else class="row-flex centered-end w-100 gap-5">
          <g-button-ujarak color="primary" @click.native="toggleCotacaoManual(false)"><i class="fa fa-close" aria-hidden="true"></i> Voltar </g-button-ujarak>
        </div>
    </div>
 </template>
   
 <script>
 import { mapGetters } from 'vuex'
 import moment from 'moment'
 import uploadCotacaoManual from './uploadCotacaoManual.vue'
 export default {
   name: 'cotacaoItens',
   components: {
     uploadCotacaoManual
   },
   data () {
     return {
       moment: moment,
       carregandoAnexos: false,
       errorInput: false,
       nomeItem: '',
       justificativa: '',
       valor: 0,
       loading: {
         show: false
       },
       anexos: []
     }
   },
   props: {
     toggleCotacaoManual: Function,
     adicionarItemManual: Function,
     visualizacao: { type: Boolean, default: false },
     itemVisualizacao: { type: Object, default: {} }
   },
   computed: {
     ...mapGetters([
       'usuarioLogado'
     ])
   },
   watch: {
   },
   mounted: function () {
     this.initVisualizacao()
   },
   methods: {
     gravarResultado (item) {
      //  console.log('anexo', this.anexos)
      //  console.log('nomeItem', this.nomeItem)
      //  console.log('valor', this.valor)
      //  console.log('justificativa', this.justificativa)

       if (this.verificaCamposEmBranco()) {
         console.log('CAMPOS EM BRANCO')
         return
       }

       this.adicionarItemManual(this.valor, this.nomeItem, this.justificativa, this.anexos)
       this.toggleCotacaoManual(false)
     },
     verificaCamposEmBranco () {
       if (this.anexos.length < 2) {
        // Verifica se tem orçamento na lista
         console.log(this.anexos.length)
         if (this.anexos.length === 0) {
           this.$snotify.error('Anexe o documento referente ao Item antes de continuar.')
           return true
         }
         console.log(this.anexos[0].tipo_documento.ds_tipo)
         // Verifica se foi selecionado um orçamento e se possui mais de dois registros
         let orcamentos = this.anexos.filter(anexo => anexo.tipo_documento.ds_tipo === 'Orçamentos')
         if (orcamentos.length < 2 && orcamentos.length !== 0) {
           this.$snotify.error('Adicione pelo menos 02 (DOIS) orçamentos antes de continuar.')
           return true
         }
       }

       if (this.nomeItem === '') {
         this.$snotify.error('Preencha o NOME do Item de cotação antes de continuar.')
         return true
       }
       if (this.valor === 0) {
         this.$snotify.error('Preencha o VALOR do Item de cotação antes de continuar.')
         return true
       }
       if (this.justificativa === '') {
         this.$snotify.error('Preencha a JUSTIFICATIVA antes de continuar.')
         return true
       }
     },
     initVisualizacao () {
       console.log('INIT')
       if (!this.visualizacao && _.isEmpty(this.itemVisualizacao)) {
        //  console.log('é cadastro')
         return
       } else {
        //  console.log('é pra visualizar')
        //  descricao: descricao,
        //  valorMedio: valorMedio,
        //  justificativa: justificativa,
        //  anexos: anexos
         this.buscaAnexos(this.itemVisualizacao.id)
         this.nomeItem = this.itemVisualizacao.descricao
         this.justificativa = this.itemVisualizacao.justificativa
         this.valor = this.itemVisualizacao.valorMedio
         // Busca Anexos na Base de Dados
         // this.anexos = await this.buscaAnexos(this.itemVisualizacao.id)
        //  console.log('ANEXOS', this.anexos)
        //  console.log('ITEM VIS', this.itemVisualizacao)
         this.$forceUpdate()
       }
     },
     async buscaAnexos (fkCotacao) {
       this.carregandoAnexos = true
       await axiosLaravel.get('cotacao/getAnexosCotacaoManual/' + fkCotacao).then((response) => {
         this.anexos = response.data
         this.carregandoAnexos = false
       })
         .catch((error) => {
           console.log('error', error)
           // this.$root.trataErro(error)
           this.carregandoAnexos = false
         })
     }
   }
 }
 </script>

 <style scoped>

    .cotacao-manual-main-container {
        width: 100%;
        box-sizing: border-box;
        overflow-y: auto;
        overflow-x: hidden;
        max-height: 600px;
        padding: 20px;
        background-color: #fdfdfd;
        border-radius: 10px;
        gap: 10px;
        box-shadow: 0px 1px 0px rgba(198, 188, 188, 0.5);
        animation: fade 0.3s ease;
    }

    .cotacao-header-container {
      width: 100%;
      height: 50px;
      border-radius: 5px;
      padding: 20px;
      background-color: #1565C0;
      gap: 5px;
      color: #FFFFFF;
      font-size: 1.5rem;
      margin-bottom: 20px;
      margin-top: 20px;
    }

    .cotacao-input-container {
        width: 100%;
        gap: 5px;
        margin-bottom: 10px;
    }

    .justificativa-input {
        min-height: 50px;
    }

    .cotacao-manual-anexo-container {
        width: 100%;
        padding: 30px;
        background-color: #fffcea;
        border-radius: 10px;
        box-shadow: 0px 1px 0px rgba(198, 188, 188, 0.5);
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