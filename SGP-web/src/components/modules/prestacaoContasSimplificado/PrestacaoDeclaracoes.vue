  <!-- 74213 - Módulo de Prestação de Contas para Processo Simplificado-->
<template>
    <div class="column all-centered prest-declaracao-container">
      <div class="row-flex all-start w-100">
        <h3 class="prest-box-title row-flex centered-start">
          Declarações
          <i class="fa fa-check" aria-hidden="true"></i>
        </h3>
      </div>
      <!-- loader -->
      <div v-if="loading" class="overlay-loading"><i class="fa fa-refresh fa-spin"></i></div>
      <div class="column all-start prest-item-declaracao" 
        :class="item.aceito == 'S' ? (item.declaracao.includes('AVISO DE CONCLUSÃO') ? 'prest-aceito-conclusao' : 'prest-aceito') : (item.declaracao.includes('AVISO DE CONCLUSÃO') ? 'prest-neutro-conclusao' : 'prest-neutro')" 
        v-for="item in declaracoes" v-if="!item.declaracao.includes('AVISO DE CONCLUSÃO') || (item.declaracao.includes('AVISO DE CONCLUSÃO') && ehUltimaParcela)">
        <!-- <div class="column all-start prest-item-declaracao" :class="item.aceito == 'S' ? 'prest-aceito' : 'prest-neutro'" v-for="item in declaracoes"> -->
        <div class="row-flex all-start prest-declaracao">
          <i v-if="usuarioLogado.userType === 'ENTIDADE' && chiefActive()" class="fa" :class="item.aceito == 'S' ? 'fa-check-square-o' : 'fa-square-o'" aria-hidden="true" @click="aceitarDeclaracao(item)"></i>
          <div v-html="item.declaracao"></div>
        </div>
          <div v-if="item.usuario && item.aceito == 'S'" class="row-flex all-start prest-declaracao-usuario">
            <span class="prest-declaracao-usuario">
              <i class="fa fa-user" aria-hidden="true"></i>
              Aceito por: 
              <b>{{ item.usuario }} {{ item.updated_at | moment('DD/MM/YYYY HH:mm') }}</b>
            </span>
          </div>
          <div v-if="item.aceito == 'N'" class="row-flex all-start prest-declaracao-usuario">
            <span class="prest-declaracao-usuario row-flex all-centered">
              <i class="fa fa-exclamation" aria-hidden="true"></i>
              <b>Pendente de adesão para parcela de adiantamento. (representante legal)</b>
            </span>
          </div>
      </div>
    </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import moment from 'moment'
  export default {
    components: {
    },
    name: 'PrestacaoDeclaracoes',
    data () {
      return {
        loading: false,
        moment: moment,
        mostrarHistorico: true,
        declaracoes: [],
        ehUltimaParcela: false
      }
    },
    props: {
      dadosComplementares: Object,
      parcelaSelecionada: Object,
      infoParcelasAdiantamento: Array,
      idPrestacao: Number
    },
    computed: {
      ...mapGetters([
        'usuarioLogado'
      ])
    },
    created: function () {
    },
    mounted: function () {
      this.getDeclaracoes()
      this.verificaUltimaParcela()
    },
    methods: {
      chiefActive () {
        // Verifica se o nome do usuario ds_nome é igual ao nome do chefe que está no mesmo objeto em um array usuarioLogado.entidade.dirigentes, precisa ter bt_ativo = 1 e bt_representante_legal = 1
        let chefe = this.usuarioLogado.entity.dirigentes.find(dirigente => {
          return (dirigente.bt_ativo === 1 && dirigente.bt_representante_legal === 1)
        })
        if (chefe) {
          return String(chefe.ds_cpf).trim() === String(this.usuarioLogado.ds_cpf).trim()
        }
      },
      verificaUltimaParcela () {
        // Em infoParcelasAdiantamento, verifica se a parcela selecionada é a última, verificamos isso pelo campo parcela, e pegamos a maior
        let parcelas = this.infoParcelasAdiantamento.map(item => item.parcela)
        let maiorParcela = Math.max(...parcelas)
        // Converte pra string para comparar
        this.ehUltimaParcela = String(maiorParcela) === String(this.parcelaSelecionada.parcela)
      },
      getDeclaracoes () {
        console.log('buscando declaracoes')
        this.loading = true
        // Pega as declarações no banco de dados axiosLaravel post getDeclaracoes
        let obj = {
          idProposta: this.$route.params.id,
          idPrestacao: this.idPrestacao
        }
        axiosLaravel.post('/prestacaoSimplificada/getDeclaracoes', obj)
          .then(response => {
            this.declaracoes = response.data
            console.log('declaracoes', this.declaracoes)
            this.loading = false
          })
          .catch(error => {
            console.error('Erro ao buscar declarações:', error)
            this.loading = false
          })
      },
      aceitarDeclaracao (item) {
        item.aceito = item.aceito === 'S' ? 'N' : 'S'
        if (item.aceito === 'N') {
          item.usuario = null
        }
        let obj = {
          idProposta: this.$route.params.id,
          idPrestacao: this.idPrestacao,
          aceito: item.aceito,
          idDeclaracao: item.id,
          usuario: this.usuarioLogado.ds_nome_usuario
        }
        this.loading = true
        this.$snotify.async('Gravando decisão...', {timeout: 0})
        axiosLaravel.post('/prestacaoSimplificada/atualizarDeclaracao', obj)
          .then(response => {
            this.$snotify.clear()
            this.$snotify.success('Decisão gravada com sucesso!')
            this.loading = false
            console.log('declaracoes', this.declaracoes)
          })
          .catch(error => {
            this.$snotify.clear()
            this.$snotify.error('Erro ao gravar decisão!')
            this.loading = false
            console.error('Erro ao aceitar declaração:', error)
          })
      },
      validarDeclaracoes () {
        console.log('validarDeclaracoes')
        let validar = true
        this.declaracoes.forEach(item => {
          if (item.aceito === 'N' && !item.declaracao.includes('AVISO DE CONCLUSÃO')) {
            validar = false
          }
          if (item.aceito === 'N' && item.declaracao.includes('AVISO DE CONCLUSÃO') && this.ehUltimaParcela) {
            validar = false
          }
        })
        console.log(validar)
        return validar
      }
    }
  }
</script>

<style src="../../../../static/css/prestacaoContasNovo.css">
</style>
