<template>
    <div class="box-widget">

      <label class="control-label f-required">Indicador de Projeto para Avaliação</label>

      <div v-show="loading.show" class="overlay">
        <i class="fa fa-refresh fa-spin" style="top: 50%; left: 50%; position: absolute; font-size: 30px"></i>
      </div>

      <div class="column all-centered questoes-container" v-if="questoes.length > 0">

        <div class="column start-centered questoes-itens-container">
          <div v-for="item in questoes" class="questoes-itens-detail">
            <!-- <span v-if="item.pergunta.peso > 0">(peso: {{ item.pergunta.peso }})</span>  -->
            <i class="fa fa-exclamation-circle icon-obs" aria-hidden="true" :title="item.pergunta.obs" v-tippy="{ inertia : true, arrow : true,  placement : 'right', animation : 'perspective', distance:'1', size: 'large', arrow : true }"></i> <label class="control-label f-required questao-item">{{item.pergunta.id}} - {{ item.pergunta.questao }}</label> 
              <select class="form-control questao-select" v-model="respostasProposta[item.pergunta.id - 1]">
                <option value="" disabled>Selecione</option>
                <option v-for="resposta in item.respostas" :value="item.pergunta.id === 7 ? resposta.resposta : resposta.pontuacao" @click="handleRespostas(resposta, item.pergunta.id - 1)">{{resposta.resposta}}</option>
              </select>
          </div>
        </div>

        <div class="row start-centered questoes-indicado-container" :class="statusClass(indicativo)">
          <i class="fa fa-list" aria-hidden="true"></i> ({{ pontuacaoTotal }})  Projeto indicado para avaliação? <b>{{ indicativo }}</b>
        </div>

        <!-- <button @click="salvarPontuacao()">
          Salvar
        </button>
        <button @click="carregarPontuacao()">
          Carregar
        </button> -->
      </div>

    </div>
 </template>
   
 <script>
 import moment from 'moment'
 import { mapGetters } from 'vuex'
 export default {
   name: 'questoesAvaliacaoProjeto',
   components: {
   },
   data () {
     return {
       moment: moment,
       loading: {
         show: false
       },
       indicativo: 'Pendente de Preenchimento',
       indicativoCodigo: '',
       questoes: [],
       respostasProposta: ['', '', '', '', '', '', ''],
       respostasString: ['', '', '', '', '', '', ''],
       pontuacaoTotal: 0
     }
   },
   props: {
     idProposta: Number,
     resultadoAprovacao: String,
     proximaEtapa: String
   },
   computed: {
     ...mapGetters([
       'usuarioLogado'
     ])
   },
   watch: {
     respostasProposta () {
       this.calcularPontuacao()
     },
     indicativoCodigo (newVal) {
       this.$emit('indicativo-codigo-updated', newVal)
     },
     idProposta () {
       this.carregarPontuacao()
     }
   },
   mounted: function () {
     this.consultaQuestoes()
   },
   methods: {
     async consultaQuestoes () {
       console.log('Consulta questões')
       this.loading.show = true
       await axiosLaravel.get('/avaliacao/questoes/').then((response) => {
         console.log(response.data)
         this.questoes = response.data
         this.loading.show = false
         this.carregarPontuacao()
         return true
       })
        .catch((error) => {
          this.$root.trataErro(error)
          this.$snotify.clear()
          this.$snotify.error(error)
          this.loading.show = false
          return false
        })
     },
     statusClass (indicativo) {
       if (indicativo === 'Pendente de Preenchimento') {
         return 'questoes-pendente'
       }
       if (indicativo === 'Indicado para avaliação preferencialmente pela Proponente') {
         return 'questoes-indicado'
       }
       if (indicativo === 'Indicado para avaliação pela FBB') {
         return 'questoes-indicado'
       }
       if (indicativo === 'Não indicado para avaliação') {
         return 'questoes-nao-indicado'
       }
     },
     calcularPontuacao () {
      //  console.log(this.respostasProposta)
      //  console.log(this.respostasString)
       if (this.respostasProposta.includes('')) {
         this.indicativo = 'Pendente de Preenchimento'
         return
       }
       let pontuacaoTotal = this.respostasProposta.map((valor, index) => {
         if (valor === '' || valor === 'sim' || valor === 'não') {
           return 0
         }
         // Multiplicar o valor pelo peso da questão correspondente
         return parseFloat(valor) * this.questoes[index].pergunta.peso
       }).reduce((total, valor) => total + valor, 0) // Somar os valores ponderados

       this.pontuacaoTotal = pontuacaoTotal

       if (this.pontuacaoTotal > 13 && this.respostasProposta[6] === 'sim') {
         this.indicativo = 'Indicado para avaliação preferencialmente pela Proponente'
         this.indicativoCodigo = '2'
       }
       if (this.pontuacaoTotal > 13 && this.respostasProposta[6] === 'não') {
         this.indicativo = 'Indicado para avaliação pela FBB'
         this.indicativoCodigo = '1'
       }
       if (this.pontuacaoTotal <= 13) {
         this.indicativo = 'Não indicado para avaliação'
         this.indicativoCodigo = '3'
       }
     },
     async carregarPontuacao () {
       console.log('CARREGANDO PONTUAÇÃO ...', this.idProposta)
       if (this.idProposta === undefined) {
         return
       }
       console.log('Consulta questões')
       this.loading.show = true
       await axiosLaravel.get('/avaliacao/carregarRespostas/' + this.idProposta).then((response) => {
         if (!_.isEmpty(response.data)) {
           this.initRespostas(response.data)
         }
         this.loading.show = false
       })
        .catch((error) => {
          this.$root.trataErro(error)
          this.$snotify.clear()
          this.$snotify.error(error)
          this.loading.show = false
        })
     },
     initRespostas (valores) {
       // Preenche as respostas
       console.log('initRespostas', valores)
       this.respostasProposta.forEach((resposta, index) => {
         console.log(valores[index].pontuacao)
         this.respostasProposta[index] = valores[index].pontuacao
         this.respostasString[index] = valores[index].resposta
         this.$forceUpdate()
       })
       //  console.log('RESPOSTAS PROPOSTA', this.respostasProposta)
       // Refaz o Calculo
       this.calcularPontuacao()
     },
     salvarPontuacao (salvando = false) {
       if (this.respostasProposta.includes('') && this.resultadoAprovacao !== 'DEVOLVER_ENTIDADE' && this.proximaEtapa !== 'SALVAR') {
         // 74288 - Salvamento do indicativo de avaliação
         if (salvando === false) {
           this.$snotify.error('Preencha os indicadores de avaliação antes de continuar.')
         }
         return false
       }
       if (this.respostasProposta.includes('') && this.resultadoAprovacao === 'DEVOLVER_ENTIDADE') {
         return true
       }
       if (this.respostasProposta.includes('') && this.proximaEtapa === 'SALVAR') {
         return true
       }
       // Cria objeto de respostas para cada resposta
       let respostas = []
       this.respostasProposta.forEach((pontuacao, index) => {
         let respostaItem = {
           fk_proposta: this.idProposta,
           id_questao: index + 1,
           resposta: this.respostasString[index],
           pontuacao: pontuacao
         }
         respostas.push(respostaItem)
       })
       console.log('Grava questões ')
       this.loading.show = true
       let obj = {
         indicativo: this.indicativo,
         idProposta: this.idProposta,
         respostas: respostas
       }
       // Grava Respostas
       axiosLaravel.post('/avaliacao/gravarRespostas/', obj).then((response) => {
         console.log(response.data)
         this.loading.show = false
         return true
       })
        .catch((error) => {
          this.$root.trataErro(error)
          this.$snotify.clear()
          this.$snotify.error(error)
          this.loading.show = false
          return false
        })
     },
     handleRespostas (item, index) {
       // Grava a referencia da resposta para apresentar no relatório de analise
       this.respostasString[index] = item.resposta
     }
   }
 }
 </script>
   
 <style scoped>
    .questoes-container {
        width: 100%;
        padding: 20px;
        border: 1px solid #DDDDDD;
    }
    .questoes-itens-container {
      width: 100%;
      gap: 10px;
    }
    .questoes-itens-detail {
      width: 100%;
    }
    .questao-item {
      margin-bottom: 5px;
    }
    .questao-select {
      width: 100%;
    }

    .questoes-indicado-container {
      width: 100%;
      margin-top: 20px;
      box-sizing: border-box;
      padding: 30px;
    }

    .questoes-indicado {
      background-color: #B7DEE8;
    }

    .questoes-nao-indicado {
      background-color: #FFCCCC;
    }

    .questoes-pendente {
      background-color: #FFFF99;
    }

    .icon-obs {
      cursor: pointer;
    }
 </style>