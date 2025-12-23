<template>
    <!-- Comparativo de preços -->
  <div class="column centered-start modal-overlay">
    <div class="column all-start cotacao-itens-main-container" @click.stop>
      <div class="box-body column centered-start cotacao-itens-container"  v-if="!abrirCotacaoPrecos &&  !abrirDetalheItem && !abrirCotacaoManual">
        <div class="row-flex centered-start cotacao-header-container">
          <i class="fa fa-dollar"></i> [{{ idProposta }}] <i>#{{ idCotacao }}</i> Resumo da cotação
        </div>
        
        <div class="row-flex centered-between cotacao-adicionar-container">
          <div>
            <label><i class="fa fa-cubes"></i> Itens cadastrados para cotação</label>
            <div>
              *Caso o produto ou serviço tenha mais de um item contido nele, ex: '<i>P1115/Ferramentas (pode ter uma furadeira, uma parafusadeira, etc.)</i>'
            </div>
          </div>
          <div v-if="this.itensCotacaoManual.length !== 0 || this.itensCotacao.length !== 0 && !validandoCotacao ">
            <g-button-ujarak v-if="this.itensCotacaoManual.length === 0 && !visualizandoCotacao" color="primary" @click.native="toggleAdicionarItem(true)" title="Abre o Busca Preço, sistema de banco de dados de preços de Licitações."><i class="fa fa-shopping-cart" aria-hidden="true"></i> Cotação Automática </g-button-ujarak>
            <g-button-ujarak v-if="this.itensCotacao.length === 0 && !visualizandoCotacao" color="warning" @click.native="novaCotacaoManual(true)" title="Não encontrou o item desejado, ou conseguiu um preço melhor? Cadastre aqui."><i class="fa fa-files-o" aria-hidden="true"></i> Cotação Manual </g-button-ujarak>
          </div>
        </div>

        <div v-show="loading.showTable" class="overlay" style="position: absolute;top: 0px;left: 0px;width: 100%;height: 100%;display: none; background: rgba(255, 255, 255, 0.7); z-index: 1000">
          <i class="fa fa-refresh fa-spin" style="top: 50%; left: 50%; position: absolute; font-size: 30px"></i>
        </div>
        <div class="descricao-cotacao-container column all-centered gap-5" v-if="this.itensCotacaoManual.length === 0 && this.itensCotacao.length === 0">
          <div class="row-flex all-centered w-100 gap-5">
            <div class="row-flex all-centered button-cotacao button-azul" @mouseover="textoInstrucao = 'Abre o Busca Preço, sistema de banco de dados de preços de Licitações.'" @mouseleave="textoInstrucao = 'Selecione uma opção para começar o cadastro da cotação.'" v-if="this.itensCotacaoManual.length === 0" @click="toggleAdicionarItem(true)" title="Abre o Banco de Cotações, sistema de banco de dados de preços de Licitações."><i class="fa fa-shopping-cart" aria-hidden="true"></i> Cotação Automática </div>
            <div class="row-flex all-centered button-cotacao button-amarelo" @mouseover="textoInstrucao = 'Não encontrou o item desejado, ou conseguiu um preço melhor? Cadastre aqui.'" @mouseleave="textoInstrucao = 'Selecione uma opção para começar o cadastro da cotação.'" v-if="this.itensCotacao.length === 0" @click="novaCotacaoManual(true)" title="Não encontrou o item desejado, ou conseguiu um preço melhor? Cadastre aqui."><i class="fa fa-files-o" aria-hidden="true"></i> Cotação Manual </div>
          </div>
          <div class="row-flex all-centered gap-10 cotacao-texto-instrucao">
            <i class="fa fa-comments"></i> {{ textoInstrucao }}
          </div>
        </div>
        <div class="descricao-cotacao-container" v-if="this.itensCotacaoManual.length !== 0 || this.itensCotacao.length !== 0">
          <label class="control-label"><i class="fa fa-send"></i> Descrição da Cotação:</label>
          <input type="text" class="form-control" placeholder="Descrição da Cotação (Será gerada automaticamente, mas você pode editar)" v-model="descricaoCotacao" :disabled="validandoCotacao"/>
        </div>
        <div class="column all-centered cotacao-table-container" v-if="this.itensCotacaoManual.length > 0 || this.itensCotacao.length > 0">
          <b-container fluid class="w-100" v-if="this.itensCotacaoManual.length === 0">
                  <label>
                    <i class="fa fa-bar-chart"></i>  Banco de Cotações:
                  </label>
                  <!-- Itens -->
                  <b-table show-empty
                          stacked="md"
                          striped
                          :bordered="table.bordered"
                          :items="table.items"
                          :hover="table.hover"
                          :fields="table.fields"
                          :filter="table.filter"
                          :current-page="table.currentPage"
                          :per-page="table.perPage"
                          :sort-by.sync="table.sortBy"
                          :sort-desc.sync="table.sortDesc"
                          empty-text="Nenhum registro encontrado"
                  >
                  <template  slot="actions" scope="row">
                      <g-button-ujarak v-if="!validandoCotacao" color="error" v-confirm="{ok: retorno => removerItem(row.item), cancel: doNothing,
                                message: 'Confirma Exclusão do Produto/Serviço: ' + row.item.descricao + ' ?'}"><i class="fa fa-close" aria-hidden="true"></i> Excluir </g-button-ujarak>
                      <g-button-ujarak color="primary" @click.native="detalharItem(row.item)"><i class="fa fa-eye" aria-hidden="true"></i> Detalhe </g-button-ujarak>
                  </template>
                  <template  slot="descricao" scope="row">
                      #{{row.item.id}} {{ row.value }}
                  </template>
                  <template  slot="valorMedio" scope="row">
                      {{ row.value | real }}
                  </template>
                  <template  slot="CV" scope="row">
                    <div class="row-flex all-centered gap-5" :class="row.value > 25 ? 'cv-atencao' : 'cv-ok'">
                      <i class="fa" :class="row.value > 25 ? 'fa-exclamation-circle' : 'fa-thumbs-up'"></i> {{ row.value }}%
                    </div>
                  </template>
                  </b-table>
            </b-container>
  
            <b-container fluid class="w-100" v-if="this.itensCotacao.length === 0">  
                  <label>
                    <i class="fa fa-bar-chart"></i>  Orçamento Manual:
                  </label>
                  <!-- Itens -->
                  <b-table show-empty
                          stacked="md"
                          striped
                          :bordered="tableManual.bordered"
                          :items="tableManual.items"
                          :hover="tableManual.hover"
                          :fields="tableManual.fields"
                          :filter="tableManual.filter"
                          :current-page="tableManual.currentPage"
                          :per-page="tableManual.perPage"
                          :sort-by.sync="tableManual.sortBy"
                          :sort-desc.sync="tableManual.sortDesc"
                          empty-text="Nenhum registro encontrado"
                  >
                  <template  slot="actions" scope="row">
                      <g-button-ujarak v-if="!validandoCotacao" color="error" v-confirm="{ok: retorno => removerItem(row.index, true), cancel: doNothing,
                                message: 'Confirma Exclusão do Produto/Serviço: ' + row.item.descricao + ' ?'}"><i class="fa fa-close" aria-hidden="true"></i> Excluir </g-button-ujarak>
                      <g-button-ujarak color="primary" @click.native="detalharItemManual(row.item)"><i class="fa fa-eye" aria-hidden="true"></i> Detalhe </g-button-ujarak>
                  </template>
                  <template  slot="descricao" scope="row">
                      #{{row.item.id}} {{ row.value }}
                  </template>
                  <template  slot="valorMedio" scope="row">
                      {{ row.value | real }}
                  </template>
                  </b-table>
            </b-container>
            <div class="column start-centered cotacao-status-container">
              <!-- <div>
                Status: <b>{{ itemCotacaoValidado ? 'Validado' : 'Pendente de Validação' }}</b>  {{ horaValidacao }}
              </div> -->
              <div v-if="itemCotacaoResponsavelValidacao !== '' && !_.isNull(itemCotacaoResponsavelValidacao)">
                Responsável: <b>{{ itemCotacaoResponsavelValidacao }}</b>
              </div>
            </div>
        </div>

        <div class="row-flex centered-between resumo-container">
          <b>Total:</b>  {{ totalItens | real }}
        </div>

        <div class="row-flex centered-start w-100 gap-5 button-cotacao-container">
          <g-button-ujarak v-if="!validandoCotacao" color="success" @click.native="salvarCotacao()"><i class="fa fa-save" aria-hidden="true"></i> Salvar Cotação </g-button-ujarak>
          <g-button-ujarak v-if="validandoCotacao && !itemCotacaoValidado && usuarioLogado.userType === 'FUNDACAO' && !telaProjeto" color="success" @click.native="validarCotacao()"><i class="fa fa-check" aria-hidden="true"></i> Validar Cotação </g-button-ujarak>
          <g-button-ujarak v-if="validandoCotacao" color="primary" @click.native="cancelar()"><i class="fa fa-close" aria-hidden="true"></i> Fechar </g-button-ujarak>
          <g-button-ujarak v-if="!validandoCotacao" color="error" @click.native="cancelar()"><i class="fa fa-close" aria-hidden="true"></i> Cancelar </g-button-ujarak>
        </div>
      </div>
  
      <div class="box-body column centered-start cotacao-itens-container" v-if="abrirCotacaoPrecos">
          <cotacaoPrecos :toggleAdicionarItem="toggleAdicionarItem" :adicionarItem="adicionarItem"></cotacaoPrecos>
      </div>

      <div class="box-body column centered-start cotacao-itens-container" v-if="abrirCotacaoManual">
          <cotacaoManual :toggleCotacaoManual="toggleCotacaoManual" :adicionarItemManual="adicionarItemManual" :visualizacao="visualizacaoManual" :itemVisualizacao="itemSelecionadoDetalhe"></cotacaoManual>
      </div>

      <div class="box-body column centered-start cotacao-itens-container" v-if="abrirDetalheItem">
          <detalheItemCotacao :itemCotacao="itemSelecionadoDetalhe" :toggleDetalharItem="toggleDetalharItem"></detalheItemCotacao>
      </div>
        
  
    </div>
  </div>   
 </template>
   
 <script>
 import { mapGetters } from 'vuex'
 import moment from 'moment'
 import cotacaoPrecos from './cotacaoPrecos.vue'
 import cotacaoManual from './cotacaoManual.vue'
 import detalheItemCotacao from './detalheItemCotacao.vue'
 export default {
   name: 'cotacaoItens',
   components: {
     cotacaoPrecos,
     cotacaoManual,
     detalheItemCotacao
   },
   data () {
     return {
       moment: moment,
       loading: {
         show: false
       },
       idCotacao: '',
       textoInstrucao: 'Selecione uma opção para começar o cadastro da cotação.',
       table: {
         items: [],
         filter: null,
         hover: true,
         bordered: true,
         currentPage: 1,
         perPage: 100,
         sortBy: 'valorMedio',
         sortDesc: true,
         sortDirection: 'desc',
         fields: [
             { key: 'descricao', label: 'Produto/Serviço', sortable: true, thStyle: 'text-align:', class: 'text-left' },
             { key: 'valorMedio', label: 'Média Saneada', sortable: true, thStyle: 'text-align: right', class: 'text-right' },
             { key: 'CV', label: 'Variação', sortable: true, thStyle: 'text-align: center; width: 10%', class: 'text-right' },
             { key: 'actions', label: 'Ações', sortable: true, thStyle: 'text-align: center; width: 20%', class: 'text-center' }
         ]
       },
       tableManual: {
         items: [],
         filter: null,
         hover: true,
         bordered: true,
         currentPage: 1,
         perPage: 100,
         sortBy: 'valorMedio',
         sortDesc: true,
         sortDirection: 'desc',
         fields: [
             { key: 'descricao', label: 'Produto/Serviço', sortable: true, thStyle: 'text-align:', class: 'text-left' },
             { key: 'valorMedio', label: 'Valor', sortable: true, thStyle: 'text-align: right', class: 'text-right' },
             { key: 'justificativa', label: 'Justificativa', sortable: true, thStyle: 'text-align: right', class: 'text-right' },
             { key: 'actions', label: 'Ações', sortable: true, thStyle: 'text-align: center; width: 20%', class: 'text-center' }
         ]
       },
       itensCotacao: [],
       itensCotacaoManual: [],
       itensCotacaoBackup: [],
       itensCotacaoManualBackup: [],
       itemSelecionadoDetalhe: {},
       totalItens: 0,
       abrirCotacaoPrecos: false,
       abrirDetalheItem: false,
       abrirCotacaoManual: false,
       visualizacaoManual: false,
       itemCotacaoValidado: false,
       itemCotacaoResponsavelValidacao: '',
       horaValidacao: '',
       descricaoCotacao: '',
       itemCotacaoResponsavelValidacaoBackup: '',
       horaValidacaoBackup: '',
       descricaoCotacaoBackup: '',
       itensRemocao: []
     }
   },
   props: {
     fk_cotacao: Number,
     idProposta: Number,
     toggleCotacao: Function,
     setDescricaoValor: Function,
     indexItem: Number,
     atividadeIndex: Number,
     cotacaoGravada: Array,
     cotacaoManualGravada: Array,
     cotacaoValidada: Object,
     editarCotacao: Boolean,
     validandoCotacao: Boolean,
     visualizandoCotacao: {type: Boolean, default: false},
     telaProjeto: {type: Boolean, default: false},
     fecharValidacao: Function,
     onAdd: Function,
     gravarValidacaoRow: Function,
     atividade: Object,
     item: Object,
     itemIndex: Number
   },
   computed: {
     ...mapGetters([
       'usuarioLogado'
     ])
   },
   watch: {
   },
   mounted: function () {
     this.initEdicao()
   },
   methods: {
     toggleAdicionarItem (valor) {
       this.abrirCotacaoPrecos = valor
       this.abrirCotacaoManual = false
     },
     toggleDetalharItem (valor) {
       this.abrirDetalheItem = valor
     },
     toggleCotacaoManual (valor) {
       this.abrirCotacaoManual = valor
       this.abrirCotacaoPrecos = false
     },
     adicionarItem (cotacao, universoAmostralSaneado, universoAmostralContaminado, valorMedio, descricao, CV, calculoAmostral, calculoFinal, remocaoManual) {
       let itemCotacao = {
         cotacao: cotacao,
         universoAmostralSaneado: universoAmostralSaneado,
         universoAmostralContaminado: universoAmostralContaminado,
         descricao: descricao,
         valorMedio: valorMedio,
         CV: CV,
         calculoAmostral: calculoAmostral,
         calculoFinal: calculoFinal,
         remocaoManual: remocaoManual
       }
       this.itensCotacao.push(itemCotacao)
       this.table.items = this.itensCotacao
       this.resetarValidacao()
       this.atualizaDescricaoCotacaoGeral()
       this.calcularTotalItens()
       this.verificaValidacaoAutomatica()
       this.$forceUpdate()
     },
     adicionarItemManual (valorMedio, descricao, justificativa, anexos) {
      // let descricao = Array.from(descricoesUnicas).join(' - ')
       let itemCotacao = {
         descricao: descricao,
         valorMedio: valorMedio,
         justificativa: justificativa,
         anexos: anexos
       }
       this.itensCotacaoManual.push(itemCotacao)
       this.tableManual.items = this.itensCotacaoManual
       this.atualizaDescricaoCotacaoGeral()
       this.calcularTotalItens()
       this.resetarValidacao()
       this.verificaValidacaoAutomatica()
       this.$forceUpdate()
     },
     calcularTotalItens () {
       let soma = 0
       if (this.itensCotacao.length <= 0 && this.itensCotacaoManual.length <= 0) {
         this.totalItens = soma
         return
       }
       this.itensCotacao.forEach((item) => {
         soma += parseFloat(item.valorMedio)
       })
       this.itensCotacaoManual.forEach((item) => {
         soma += parseFloat(item.valorMedio)
       })
       this.totalItens = soma
       this.$forceUpdate()
     },
     atualizaDescricaoCotacaoGeral () {
       this.descricaoCotacao = ''
       this.itensCotacao.forEach((item) => {
         this.descricaoCotacao = this.descricaoCotacao + item.descricao + ', '
       })
       this.itensCotacaoManual.forEach((item) => {
         this.descricaoCotacao = this.descricaoCotacao + item.descricao + ', '
       })
       if (this.itensCotacao.length < 2 && this.itensCotacaoManual.length < 2 && (this.itensCotacaoManual.length + this.itensCotacao.length) < 2) {
         console.log('atualizar descrição')
         this.descricaoCotacao = this.descricaoCotacao.replace(',', '')
       } else {
         this.descricaoCotacao = this.descricaoCotacao.slice(0, -2)
       }
       this.descricaoCotacao.trim()
     },
     removerItem (item, manual = false) {
       if (item.hasOwnProperty('id')) {
         console.log('removendo..', item.id)
         this.itensRemocao.push(item.id)
       }
       if (manual) {
         const index = this.tableManual.items.findIndex(itemTable => itemTable === item)
         if (index !== -1) {
           // Excluí da tabela o index
           this.tableManual.items.splice(index, 1)
           // Atualiza itensCotacao
           this.itensCotacaoManual = this.tableManual.items
         }
       } else {
         const index = this.table.items.findIndex(itemTable => itemTable === item)
         if (index !== -1) {
           // Excluí da tabela o index
           this.table.items.splice(index, 1)
           // Atualiza itensCotacao
           this.itensCotacao = this.table.items
         }
       }
       // Refaz o Calculo
       this.calcularTotalItens()
       this.resetarValidacao()
       this.atualizaDescricaoCotacaoGeral()
       this.verificaValidacaoAutomatica()
       this.$forceUpdate()
     },
     detalharItem (item) {
       this.itemSelecionadoDetalhe = {}
      //  console.log('detalhando item', item)
       this.itemSelecionadoDetalhe = item
       this.toggleDetalharItem(true)
     },
     detalharItemManual (item) {
       this.visualizacaoManual = true
       this.itemSelecionadoDetalhe = {}
      //  console.log('detalhando item', item)
       this.itemSelecionadoDetalhe = item
       this.toggleCotacaoManual(true)
     },
     novaCotacaoManual (value) {
       this.visualizacaoManual = false
       this.itemSelecionadoDetalhe = {}
       this.toggleCotacaoManual(value)
     },
     initEdicao () {
       if (this.editarCotacao || this.validandoCotacao) {
         this.idCotacao = this.fk_cotacao
         this.itensCotacao = _.cloneDeep(this.cotacaoGravada[0])
         this.table.items = this.itensCotacao
         this.itensCotacaoBackup = _.cloneDeep(this.itensCotacao)
         this.itensCotacaoManual = _.cloneDeep(this.cotacaoManualGravada[0])
         this.itensCotacaoManualBackup = _.cloneDeep(this.itensCotacaoManual)
         this.tableManual.items = this.itensCotacaoManual
         this.itemCotacaoValidado = this.cotacaoValidada.validado
         this.itemCotacaoResponsavelValidacao = this.cotacaoValidada.responsavel
         this.horaValidacao = this.cotacaoValidada.horaValidacao
         this.itemCotacaoValidadoBackup = this.cotacaoValidada.validado
         this.itemCotacaoResponsavelValidacaoBackup = this.cotacaoValidada.responsavel
         this.horaValidacaoBackup = this.cotacaoValidada.horaValidacao
         this.calcularTotalItens()
         this.atualizaDescricaoCotacaoGeral()
         this.$forceUpdate()
       }
     },
     cancelar () {
       if (this.editarCotacao) {
         this.itensCotacao = this.itensCotacaoBackup
         this.itensCotacaoManual = this.itensCotacaoManualBackup
         this.table.items = this.itensCotacao
         this.tableManual.items = this.itensCotacaoManual
         console.log('itens cotacao', this.itensCotacao)
         console.log('itens cotacao manual', this.itensCotacaoManual)
         this.calcularTotalItens()
         this.atualizaDescricaoCotacaoGeral()
         this.$forceUpdate()
         this.retornaValoresEdicaoForm()
       } else if (this.validandoCotacao) {
         this.fecharValidacao()
       } else {
         this.toggleCotacao(false)
       }
     },
     salvarCotacao () {
       this.$snotify.async('Gravando Cotação. Por favor, aguarde...', {timeout: 0})
       this.gravarCotacaoBase()
     },
     validarCotacao () {
       this.$snotify.async('Gravando Validação. Por favor, aguarde...', {timeout: 0})
       this.itemCotacaoResponsavelValidacao = this.usuarioLogado.ds_login + ' ' + this.usuarioLogado.ds_nome_usuario
       this.itemCotacaoValidado = true
       this.horaValidacao = moment(new Date()).format('DD/MM/YYYY HH:mm:ss')
      //  this.item.itemCotacaoValidado = {
      //    responsavel: this.itemCotacaoResponsavelValidacao,
      //    validado: this.itemCotacaoValidado,
      //    horaValidacao: this.horaValidacao
      //  }
      // console.log(this.item)
       this.gravarValidacao()
     },
     verificaValidacaoAutomatica () {
      // Verifica se todos os itens de cotação automatica possuem CV menor que 25% e nenhum item removido manualmente, caso seja verdadeiro, seta validação para sistema
      // Se houverem itens de cotação manual, a validação fica pendente
       let validacaoAutomatica = true
       if (this.itemCotacaoValidado) {
         return
       }
       if (this.itensCotacaoManual.length > 0) {
         return
       }
       this.itensCotacao.forEach(item => {
         console.log('item cotacao', item.remocaoManual)
         if (item.remocaoManual.length > 0) {
           validacaoAutomatica = false
           return
         }
         if (item.CV > 25) {
           validacaoAutomatica = false
           return
         }
       })

       if (!validacaoAutomatica) {
         return
       }

       this.itemCotacaoValidado = true
       this.itemCotacaoResponsavelValidacao = 'SISTEMA / DE ACORDO COM COEFICIENTE DE VARIAÇÃO'
       this.horaValidacao = moment(new Date()).format('DD/MM/YYYY HH:mm:ss')
     },
     async gravarCotacaoBase () {
       let obj = {
         fk_cotacao: this.idCotacao,
         fk_proposta: this.idProposta,
         validado: this.itemCotacaoValidado,
         valor_cotacao: this.totalItens,
         descricao: this.descricaoCotacao,
         responsavel_validacao: this.itemCotacaoResponsavelValidacao,
         data_validacao: this.horaValidacao
       }
       await axiosLaravel.post('/cotacao/gravarCotacao/', obj).then((response) => {
         console.log(response.data)
         let id = response.data
         if (!isNaN(id)) {
           this.idCotacao = id
           if (this.itensCotacao.length > 0) {
             this.gravaItensCotacaoBase(this.itensCotacao, false)
           } else if (this.itensCotacaoManual.length > 0) {
             this.gravaItensCotacaoBase(this.itensCotacaoManual, true)
           } else {
             this.$snotify.error('Erro no cadastro de banco de dados. Tente novamente mais tarde.')
             return
           }
         } else {
           this.$snotify.error('Erro no cadastro de banco de dados. Tente novamente mais tarde.')
         }

         if (this.itensRemocao.length > 0) {
           console.log('existem itens para marcar como excluído', this.itensRemocao)
           this.removerItensBase()
         }
         // Grava itens
         this.$forceUpdate()
       })
        .catch((error) => {
          this.$root.trataErro(error)
        })
     },
     async gravarValidacao () {
       let obj = {
         fk_cotacao: this.idCotacao,
         validado: this.itemCotacaoValidado,
         responsavel_validacao: this.itemCotacaoResponsavelValidacao,
         data_validacao: this.horaValidacao
       }
       await axiosLaravel.post('/cotacao/gravarValidacaoCotacao/', obj).then((response) => {
         console.log(response.data)
          // Grava itens
         this.$snotify.clear()
         this.$snotify.success(response.data)
         this.gravarValidacaoRow(obj.fk_cotacao, obj)
         this.fecharValidacao()
         this.$forceUpdate()
       })
        .catch((error) => {
          this.$root.trataErro(error)
        })
     },
     async removerItensBase () {
       let obj = {
         ids: this.itensRemocao
       }
       await axiosLaravel.post('/cotacao/excluirItensCotacao/', obj).then((response) => {
         console.log(response.data)
       })
        .catch((error) => {
          this.$root.trataErro(error)
        })
     },
     async gravaItensCotacaoBase (itensCotacao, manual) {
       // Grava itens cotação na base de dados
       for (const item of itensCotacao) {
         item.fk_cotacao = this.idCotacao
         await axiosLaravel.post('/cotacao/gravarItemCotacao/', item).then((response) => {
           console.log(response.data)
           let id = response.data
           if (!isNaN(id)) {
             item.id = id
             if (manual) {
               this.gravaAnexos(item.anexos, item.id)
             }
           } else {
             this.$snotify.error('Erro no cadastro de banco de dados. Tente novamente mais tarde.')
           }
           // Grava itens
           this.$forceUpdate()
         })
        .catch((error) => {
          this.$root.trataErro(error)
        })
       }
       // Retorna valores para o form de edição de item
       this.retornaValoresEdicaoForm()
     },
     async gravaAnexos (anexos, idItemCotacao) {
       // Grava itens cotação na base de dados
       for (const item of anexos) {
         item.fk_item_cotacao = idItemCotacao
         let obj = {
           idItemCotacao: idItemCotacao,
           documento: item
         }
         await axiosLaravel.post('/cotacao/gravarAnexo/', obj).then((response) => {
           console.log(response.data)
           let id = response.data
           if (!isNaN(id)) {
             item.id = id
           } else {
             this.$snotify.error('Erro no cadastro de banco de dados. Tente novamente mais tarde.')
           }
           // Grava itens
           this.$forceUpdate()
         })
        .catch((error) => {
          this.$root.trataErro(error)
        })
       }
     },
     retornaValoresEdicaoForm () {
       let cotacaoValidado = {
         responsavel: this.itemCotacaoResponsavelValidacaoBackup,
         validado: this.itemCotacaoValidadoBackup,
         horaValidacao: this.horaValidacaoBackup
       }
       this.$snotify.clear()
       this.$snotify.success('Cotação Salva! Não esqueça de salvar a proposta.')
       this.setDescricaoValor(this.descricaoCotacao, this.totalItens, this.itensCotacao, this.itensCotacaoManual, cotacaoValidado, this.idCotacao)
       this.toggleCotacao(false)
     },
     resetarValidacao () {
       this.itemCotacaoValidado = false
       this.itemCotacaoResponsavelValidacao = null
       this.horaValidacao = null
     }
   }
 }
 </script>
   
 <style scoped>
     .modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.8); /* Fundo semitransparente */
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 5000; /* Certifique-se de que o modal esteja acima de outros elementos */
      animation: fade 0.3s ease;
    }
    .cotacao-itens-main-container {
      width: 90%;
      z-index: 10000;
      animation: fadeAndSlide 0.5s ease;
    }
    .cotacao-itens-container {
        background-color: #F5F5F5;
        width: 100%;
        min-height: 500px;
        border-radius: 10px;
        padding: 40px;
    }
    .cotacao-adicionar-container {
      gap: 10px;
      width: 100%;
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
    .button-cotacao-container {
      padding: 10px 20px;
    }
    .resumo-container {
      width: 100%;
      font-size: 2rem;
      border-radius: 5px;
      border-top: 1px solid #D2D6DE;
      background-color: #FFEC86;
      box-shadow: 0px 1px 0px rgba(198, 188, 188, 0.5);
      padding: 20px;
    }
    @keyframes fadeAndSlide {
    0% {
      opacity: 0;
      transform: translateY(-100px);
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
    .detalhamento-container {
      width: 100%;
      padding: 30px;
      border: 1px solid #D2D6DE;
      background-color: #fdfbef;
      border-radius: 10px;
      margin-bottom: 10px;
      animation: fadeAndSlide 0.3s ease;
    }
    .detalhe-container {
      gap: 25px;
      padding: 10px;
      padding-bottom: 15px;
      border-radius: 5px;
      margin-bottom: 5px;
      border: 1px solid #D2D6DE;
      background-color: #FFFFFF;
    }
    .detalhe-valores {
      /* margin-top: 30px; */
      width: 100%;
      padding: 30px;
      border: 1px solid #D2D6DE;
      border-radius: 5px;
      background-color: #fff4b4;
    }
    .detalhe-valor-titulo {
      width: 50%;
      padding: 10px;
      border-radius: 5px;
      color: #FFFFFF;
      background-color: #1565C0;
      margin-bottom: 20px;
    }
    .desc-text {
      text-align: left;
    }
    .grupo-item {
      height: 50px;
      width: 200px;
      padding: 20px;
      background-color: #FFFFFF;
      border-left: 10px solid #1565C0;
      border-radius: 5px;
    }
    .valor-item {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: flex-start;
      text-align: center;
    }
    .descricao-cotacao-container {
      width: 100%;
      margin-bottom: 10px;
      margin-top: 10px;
      padding: 20px;
      background-color: #eff7fd;
      border-radius: 10px;
      border: 1px solid #7acce0;
      box-shadow: 0px 1px 0px rgba(198, 188, 188, 0.5);
    }

    .cotacao-table-container {
      width: 100%;
      padding: 20px;
      background-color: #eff7fd;
      margin-bottom: 10px;
      border-radius: 10px;
      border: 1px solid #7acce0;
      box-shadow: 0px 1px 0px rgba(198, 188, 188, 0.5);
    }
    .button-cotacao {
      width: 250px;
      cursor: pointer;
      border: 2px solid #FeFeFe;
      box-shadow: 0px 1px 0px rgba(198, 188, 188, 0.5);
      border-radius: 10px;
      font-size: 1.5rem;
      gap: 10px;
      padding: 30px;
      transition: 0.2s ease;
      margin: 10px;
    }
    .button-cotacao:hover {
      scale: 1.05;
    }
    .button-azul {
      background-color: #1565C0;
      color: #FFFFFF;
    }
    .button-amarelo {
      background-color: #f59221;
      color: #FFFFFF;
    }

    .cv-atencao {
      background-color: #f59221;
      font-weight: 700;
      color: #FFFFFF;
      padding: 10px;
      border-radius: 10px;
    }

    .cv-ok {
      background-color: #008a0b;
      font-weight: 700;
      color: #FFFFFF;
      padding: 10px;
      border-radius: 10px;
    }

    .cotacao-texto-instrucao {
      background-color: #fafafa;
      padding: 20px;
      color: #353636;
      border: 1px solid #353636;
      border-radius: 10px;
      transition: 0.2s ease;
      box-shadow: 0px 1px 0px rgba(198, 188, 188, 0.5);
    }

    .cotacao-status-container {
      width: 100%;
      padding: 5px;
      color: #1565C0;
    }
    label {
      color: #1565C0;
    }
 </style>