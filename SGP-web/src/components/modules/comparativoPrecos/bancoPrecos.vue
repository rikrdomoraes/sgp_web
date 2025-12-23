<template>
    <!-- Comparativo de preços -->
   <div class="box-body column centered-start banco-precos-main-container">

    <div class="row-flex centered-start banco-precos-header-container" ref="topo">
        <i class="fa fa-cubes"></i> <b>BUSCA PREÇO</b>
    </div>
    <div class="column centered-start banco-precos-filtro-container">
      <div class="column centered-start banco-precos-base-container">
      
        <div class="row-flex centered-between banco-precos-titulo">
          <div class="row-flex all-centered gap-5">
            <i class="fa fa-filter"></i>
            <label>Filtros (Comece por aqui)</label>
          </div>
          <div class="column all-centered">
            <i class="fa fa-caret-up"></i>
          </div>
        </div>
        <div class="row-flex centered-start w-100 gap-5">
          <div class="form-item-container">
            <label class="f-required"><i class="fa fa-cubes"></i> Tipo de Item:</label>
            <multiselect 
                class="select-container-sm"
                v-model="selecaoTipoItens" 
                :options="selectOptions.tipoItem" 
                :searchable="false" 
                :close-on-select="true" 
                :show-labels="false"
                placeholder="Selecione o Tipo de Item"
                @input="clearClassificadores()"
            >
            </multiselect>
          </div>
          <div class="form-item-container">
            <label><i class="fa fa-map-o"></i> UF (opcional):</label>
            <multiselect 
                class="select-container-sm"
                v-model="selecaoUfs" 
                :options="selectOptions.uf" 
                :searchable="false" 
                :close-on-select="true" 
                :show-labels="false"
                placeholder="Selecione o UF"
                @input="clearClassificadores()"
            >
            </multiselect>
          </div>
        </div>
        <div class="row-flex all-start w-100 gap-5 banco-precos-aparecer banco-precos-aviso-filtro">
            <label><i class="fa fa-bell"></i> Filtros Avançados </label>
            <input type="checkbox" v-model="abrirFiltrosAvancados">
        </div>
        <div v-if="abrirFiltrosAvancados" class="row-flex centered-start banco-precos-aparecer banco-precos-filtros-avancados-container">
          <!-- <div class="form-item-container">
            <label><i class="fa fa-hand-o-down"></i> Valor mínimo:</label>
            <money v-model="valorMinimo" class="form-control"></money>
          </div> -->
          <div class="form-item-container">
            <label><i class="fa fa-hand-o-up"></i> Valor máximo:</label>
            <money v-model="valorMaximo" class="form-control"></money>
          </div>
        </div>
      </div>
      
      <div class="column centered-start banco-precos-refinadores-container">
        <div class="row-flex centered-between banco-precos-titulo">
          <div class="row-flex all-centered gap-5">
            <i class="fa fa-tags"></i>
            <label>Classificadores (Utilize as opções abaixo para afunilar sua pesquisa, selecione até 5 tags de cada tipo)</label>
          </div>
          <div class="column all-centered">
            <!-- TODO: Fazer abrir e fechar -->
            <i class="fa fa-caret-up"></i>
          </div>
        </div>
        <div class="row-flex all-start w-100 gap-5 banco-precos-aparecer banco-precos-aviso">
            <label><i class="fa fa-question-circle" style="cursor: pointer;" title="Filtros específicos" v-tippy="{ inertia : true, arrow : true,  placement : 'right', animation : 'perspective', distance:'1', size: 'large', arrow : true }"></i> Pesquisar por categorizadores </label>
            <input type="checkbox" v-model="procuraCategorizadores" @change="handleCategorizadores()">
        </div>
        <div class="column centered-start w-100 gap-5" v-if="!procuraIndividual">
          <div class="row-flex centered-start w-100 gap-5 banco-precos-aparecer">
            <div class="form-item-container">
              <label>I - Categoria (Seleção Múltipla):</label>
              <multiselect 
                  class="select-container-md"
                  v-model="selecaoCategoria" 
                  :options="selectOptions.categoria" 
                  :searchable="true" 
                  :multiple="true"
                  :close-on-select="true" 
                  :show-labels="true"
                  :hide-selected="true"
                  :max="5"
                  :loading="loading.categoria"
                  placeholder="Pesquisar, a categoria geral do item desejado (Ex: MATERIAL, MEDICAMENTO, MAQUINAS, INFORMATICA, etc.)"
                  @search-change="debounceFiltro($event, 'categoria')"
                  @input="consultarGrupoItem()"
              >
              <template #maxElements>
                Número máximo de elementos selecionados. Primeiro remova algum para adicionar novamente.
              </template>
              <template #noOptions>
                Lista Vazia, utilize os controles para pesquisar ou digite.
              </template>
              <template #noResult>
                Termo não encontrado, tente outro termo ou utilize os controladores para refazer a pesquisa.
              </template>
              </multiselect>
            </div>
          </div>
          <div class="row-flex centered-start w-100 gap-5 banco-precos-aparecer" v-if="selectOptions.grupo.length > 0">
            <div class="form-item-container">
              <label>II - Grupo (Seleção Múltipla):</label>
              <multiselect 
                  class="select-container-md"
                  v-model="selecaoGrupos" 
                  :options="selectOptions.grupo" 
                  :searchable="true" 
                  :multiple="true"
                  :close-on-select="true" 
                  :show-labels="true"
                  :hide-selected="true"
                  :max="5"
                  :loading="loading.grupo"
                  placeholder="O grupo no qual o item pertence (Ex: CONSTRUCAO, HOSPITALAR, INDUSTRIAL, ACESSORIOS, etc.)"
                  @search-change="debounceFiltro($event, 'grupo')"
                  @input="consultarClassificacaoItem()"
              >
              <template #maxElements>
                Número máximo de elementos selecionados. Primeiro remova algum para adicionar novamente.
              </template>
              <template #noOptions>
                Lista Vazia, utilize os controles para pesquisar ou digite.
              </template>
              <template #noResult>
                Termo não encontrado, tente outro termo ou utilize os controladores para refazer a pesquisa.
              </template>
              </multiselect>
            </div>
         </div>
         
         <div class="row-flex centered-start w-100 gap-5 banco-precos-aparecer" v-if="selectOptions.classificacao.length > 0">
            <div class="form-item-container">
              <label>III - Classificação (Seleção Múltipla):</label>
              <multiselect 
                  class="select-container-md"
                  v-model="selecaoClassificacoes" 
                  :options="selectOptions.classificacao" 
                  :searchable="true" 
                  :multiple="true"
                  :close-on-select="true" 
                  :show-labels="true"
                  :hide-selected="true"
                  :max="5"
                  :loading="loading.classificacao"
                  placeholder="Classificação mais específica do item."
                  @search-change="debounceFiltro($event, 'classificacao')"
                  @input="consultarItens()"
              >
              <template #maxElements>
                Número máximo de elementos selecionado. Primeiro remova algum para adicionar novamente.
              </template>
              <template #noOptions>
                Lista Vazia, utilize os controles para pesquisar ou digite.
              </template>
              <template #noResult>
                Termo não encontrado, tente outro termo ou utilize os controladores para refazer a pesquisa.
              </template>
              </multiselect>
            </div>
          </div>
        </div>
        <div class="column centered-start banco-precos-item-container banco-precos-aparecer" v-if="selecaoCategoria.length > 0 || procuraIndividual">
          <div class="row-flex centered-start w-100 gap-5">
            <div class="form-item-container">
              <label><i class="fa fa-cube"></i> Item (Seleção Múltipla):</label>
              <multiselect
                  class="select-container-xl"
                  v-model="selecaoItems" 
                  :options="selectOptions.item"
                  :loading="loading.item"
                  :searchable="true" 
                  :multiple="true"
                  :close-on-select="true" 
                  :show-labels="true"
                  :hide-selected="true"
                  :max="5"
                  placeholder="Pesquisar o Item"
                  @search-change="debounceFiltro($event, 'item')"
              >
              <template #maxElements>
                Número máximo de elementos selecionado. Primeiro remova algum para adicionar novamente.
              </template>
              <template #noOptions>
                Lista Vazia, utilize os controles para pesquisar ou digite.
              </template>
              <template #noResult>
                Termo não encontrado, tente outro termo ou utilize os controladores para refazer a pesquisa.
              </template>
              </multiselect>
            </div>
          </div>
        </div>
      </div>

      <div class="row-flex centered-end w-100 gap-5">
        <g-button-ujarak color="primary" @click.native="consultarItensLicitacao()" v-if="selecaoItems.length > 0 || (selecaoCategoria.length > 0)"><i class="fa fa-database" aria-hidden="true"></i> Pesquisar </g-button-ujarak>
        <g-button-ujarak color="warning" @click.native="clearTipoSelection()"><i class="fa fa-trash" aria-hidden="true"></i> Limpar Filtros </g-button-ujarak>
      </div>

    </div>

    <div class="column all-centered w-100 banco-precos-inferior-container"  v-if="resultadoItems.length > 0">
      <div class="row-flex centered-start banco-precos-titulo">
          <i class="fa fa-paperclip"></i>
          <label>Resultados</label>
      </div>

      <div class="row-flex start-centered w-100 gap-5">
        <div class="column centered-start banco-precos-caracteristicas-container">

          <div class="column centered-start banco-precos-titulo-container">
            <div class="banco-precos-titulo-resultado">
              <i class="fa fa-barcode"></i> Explorador de caracteristicas
            </div>
            <div class="banco-precos-subtitulo">
              Selecione uma ou mais características para refinar sua pesquisa
            </div>
          </div>

          <div class="column centered-start banco-precos-titulo-container">

            <!-- <div class="banco-precos-titulo-resultado row-flex centered-between">
              <div>
                <i class="fa fa-umbrella"></i> Filtros de característica
              </div>
              <div @click="mostrarFiltroDetalhe = !mostrarFiltroDetalhe" class="banco-precos-filtro-carecteristica-button"><i class="fa" :class="mostrarFiltroDetalhe ? 'fa-caret-down' : 'fa-caret-left'"></i></div>
            </div> -->

            <div class="column all-start banco-precos-filtro-caracteristica-container banco-precos-aparecer" v-if="mostrarFiltroDetalhe">

              <div class="row-flex all-start form-item-container gap-10">
                <label>Tipo de Filtro: </label>
                <div class="row-flex all-start">
                  <span class="row-flex all-centered span-filtro"><i class="fa fa-question-circle" style="cursor: pointer;" title="As características selecionadas serão" v-tippy="{ inertia : true, arrow : true,  placement : 'right', animation : 'perspective', distance:'1', size: 'large', arrow : true }"></i>Inclusivo </span>
                  <input type="radio" value="INCLUSIVO" v-model="tipoFiltroCaracteristica">
                </div>
                <div class="row-flex all-start">
                  <span class="row-flex all-centered span-filtro"><i class="fa fa-question-circle" style="cursor: pointer;" title="Os resultados podem ser genéricos" v-tippy="{ inertia : true, arrow : true,  placement : 'right', animation : 'perspective', distance:'1', size: 'large', arrow : true }"></i>Exclusivo </span>
                  <input type="radio" value="EXCLUSIVO" v-model="tipoFiltroCaracteristica">
                </div>
              </div>
  
              <div class="row-flex all-centered form-item-container gap-10">
                <input type="text" class="form-control" placeholder="Pesquise uma caracteristica aqui.">
                <button title="Limpar Filtro" class="banco-precos-filtro-carecteristica-button"><i class="fa fa-trash"></i></button>
              </div>
            </div>

          </div>

          <div class="banco-precos-caracteristicas-items-container">
            <div v-for="(items, key) in filtroItensCaracteristica" :key="key" class="column all-start w-100">
              <div  @click="toggleVisibility(key)" class="row-flex centered-between banco-precos-item-tipo-caracteristica" :class="isSelected(key) ? 'banco-precos-item-tipo-caracteristica-selecionada' : ''">
                <div @click.stop @click="toggleTodasCaracteristicas(key)">
                  <i class="fa fa-power-off" :class="isSelected(key) ? 'icon-selected' : 'icon-deselected'"></i> {{ key.replace(/_/g, ' ') }} ({{ items.length }})
                </div>
                <i class="fa" :class="isVisible(key) ? 'fa-caret-down' : 'fa-caret-left'"></i> 
              </div>
  
              <div v-show="isVisible(key)" class="column banco-precos-selecao-caracteristicas-container">
                <div v-for="(item, index) in items" :key="`${key}-${item.caracteristica}-${index}`" class="row-flex centered-end banco-precos-caracteristica" :class="item.selecionado ? 'banco-precos-caracteristica-selecionada' : ''" @click="atualizarSelecaoCaracteristicas(key, item, index)">
                  {{ item.caracteristica }} <i class="fa fa-power-off" :class="item.selecionado ? 'icon-selected' : 'icon-deselected'"></i>
                </div>
              </div>
  
            </div>
          </div>
          
        </div>

        <div class="column centered-start banco-precos-resultados-container">
          <div class="column centered-start banco-precos-titulo-container">
            <div class="banco-precos-titulo-resultado">
              <i class="fa fa-feed"></i> Itens encontrados
            </div>
            <div class="row-flex centered-between banco-precos-subtitulo">
              Confira os ({{ table.items.length }}) itens encontrados a partir dos filtros
              <g-button-ujarak color="warning" @click.native="resetarItensTabela()"><i class="fa fa-eraser" aria-hidden="true"></i> Limpar Seleção </g-button-ujarak>
            </div>
          </div>

          <b-container fluid class="column centered-start w-100 gap-10 banco-precos-table-container" ref="itemsEncontrados">
                <!-- Itens -->
                <b-table
                        class="banco-precos-tabela"
                        show-empty
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
                    <g-button-ujarak color="primary" @click.native="detalharItem(row.item)"><i class="fa fa-eye" aria-hidden="true"></i></g-button-ujarak>
                </template>
                <template  slot="descricao_item" scope="row">
                  <div class="row-flex all-start banco-precos-table-descricao-container">
                    <div :title="row.value" class="banco-precos-table-descricao">
                      [{{ row.item.id }}] {{row.value}}
                    </div>
                  </div>
                </template>
                <template  slot="valor_item" scope="row">
                    {{ row.value | real }}
                </template>
                <template  slot="selecionado" scope="row">
                    <input v-model="row.item.selecionado" type="checkbox" @change="verificaExclusaoManual(row.item)" :key="row.item.id">
                </template>
                <template  slot="data_resultado_licitacao" scope="row">
                    {{ row.value !== '' ? moment.utc(row.value).format('MM/YYYY') : '-' }}
                </template>
                <template  slot="sigla_uf" scope="row">
                    {{ row.value !== '0' ? row.value : '-' }}
                </template>
                </b-table>
                <b-row>
                    <b-col class="w-100">
                      <b-pagination :total-rows="table.totalRows" :per-page="table.perPage" v-model="table.currentPage" class="my-3" />
                    </b-col>
                </b-row>
                <div class="column all-centered banco-precos-justificativa-modal" v-if="abrirJustificativa" @click="cancelaRemocaoManual(itemJustificativa)">
                  <div class="column all-centered banco-precos-justificativa-container"@click.stop>
                    <div class="form-item-container">
                      <label><i class="fa fa-cube"></i> Selecione o Motivo para desconsiderar o item:</label>
                      <multiselect
                          class="select-container-xl"
                          v-model="selecaoJustificativa" 
                          :options="selectJustificativa"
                          :multiple="false"
                          :close-on-select="true" 
                          placeholder="Selecione o Motivo"
                      >
                      </multiselect>
                    </div>
                    <div class="row-flex centered-end w-100 gap-5">
                      <g-button-ujarak color="success" @click.native="gravaRemocaoManual(itemJustificativa)"><i class="fa fa-save" aria-hidden="true"></i> Confirmar </g-button-ujarak>
                      <g-button-ujarak color="error" @click.native="cancelaRemocaoManual(itemJustificativa)"><i class="fa fa-close" aria-hidden="true"></i> Cancelar </g-button-ujarak>
                    </div>
                  </div>
                </div>
              </b-container>
        </div>
      </div>
    </div>
    <div v-if="loading.show" class="column all-centered w-100 banco-precos-inferior-container" ref="loadingItems">
      <div class="row-flex all-centered banco-precos-titulo">
        Pesquisando Items... 
        <i class="fa fa-hourglass-end banco-precos-spin" style="font-size: 30px"></i>
      </div>
    </div>

    <div class="column all-centered banco-precos-detalhamento-item" v-if="abrirDetalheItem" ref="detalhamentoContainer">
      <detalheItemLicitacao :itemLicitacao="itemDetalheSelecionado" :toggleDetalhe="toggleDetalhe"></detalheItemLicitacao>
    </div>

    <div class="row-flex centered-end w-100 gap-5">
        <g-button-ujarak color="success" @click.native="gravarResultado()"><i class="fa fa-save" aria-hidden="true"></i> Utilizar Resultado </g-button-ujarak>
        <g-button-ujarak color="error" @click.native="toggleBancoPrecos(false)"><i class="fa fa-close" aria-hidden="true"></i> Cancelar </g-button-ujarak>
    </div>

   </div>
 </template>
   
 <script>
 import { mapGetters } from 'vuex'
 import moment from 'moment'
 import detalheItemLicitacao from './detalheItemLicitacao.vue'

 export default {
   name: 'bancoPrecos',
   components: {
     detalheItemLicitacao
   },
   data () {
     return {
       moment: moment,
       debounceTimer: null,
       loading: {
         show: false,
         categoria: false,
         grupo: false,
         classificacao: false,
         item: false
       },
       selectOptions: {
         tipoItem: ['PRODUTO', 'SERVICO'],
         uf: ['AC', 'AL', 'AM', 'AP', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MG', 'MS', 'MT', 'PA', 'PB', 'PE', 'PI', 'PR', 'RJ', 'RN', 'RO', 'RR', 'RS', 'SC', 'SE', 'SP', 'TO'],
         categoria: [],
         grupo: [],
         classificacao: [],
         item: []
       },
       selectJustificativa: ['Item está diferente do selecionado.', 'Item com valor MUITO acima do mercado', 'Item com valor MUITO abaixo do mercado'],
       selecaoJustificativa: [],
       itemJustificativa: {},
       indexJustificativa: '',
       selecaoTipoItens: [],
       selecaoUfs: [],
       selecaoCategoria: [],
       selecaoGrupos: [],
       selecaoClassificacoes: [],
       selecaoItems: [],
       abrirFiltrosAvancados: true,
       abrirJustificativa: false,
       procuraIndividual: true,
       procuraCategorizadores: false,
       definicaoItem: '',
       table: {
         items: this.resultadoSelecionadoItems,
         totalRows: 0,
         filter: null,
         hover: true,
         bordered: true,
         currentPage: 1,
         perPage: 100,
         sortBy: 'valor_item',
         sortDesc: true,
         sortDirection: 'desc',
         fields: [
             { key: 'selecionado', label: 'Selecionar', sortable: true, thStyle: 'text-align: center', class: 'text-center' },
             { key: 'actions', label: 'Detalhe', sortable: true, thStyle: 'text-align: center', class: 'text-center' },
             { key: 'descricao_item', label: 'Item', sortable: true, thStyle: 'text-align: left', class: 'text-left' },
             { key: 'quantidade_item_aprovado', label: 'Qtd', sortable: true, thStyle: 'text-align: left', class: 'text-left' },
             { key: 'sigla_uf', label: 'UF', sortable: true, thStyle: 'text-align: center', class: 'text-right' },
             { key: 'valor_item', label: 'Valor Un.', sortable: true, thStyle: 'text-align: center', class: 'text-center' },
             { key: 'data_resultado_licitacao', label: 'Data', thStyle: 'text-align: center', class: 'text-center' }
         ]
       },
       resultadoCaracteristicas: [],
       resultadoItems: [],
       resultadoSelecionadoItems: [],
       remocaoManual: [],
       itemDetalheSelecionado: {},
       visibilidade: {},
       filtroItensCaracteristica: [],
       filtroKeysCaracteristica: {},
       idItemsFiltro: [],
       tipoFiltroCaracteristica: 'INCLUSIVO',
       mostrarFiltroDetalhe: false,
       abrirDetalheItem: false,
       valorMinimo: 0,
       valorMaximo: 8000
     }
   },
   props: {
     gravaSelecaoItens: Function,
     toggleBancoPrecos: Function
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
     toggleVisibility (key) {
       this.$set(this.visibilidade, key, !this.visibilidade[key])
     },
     toggleJustificativa (valor) {
       this.abrirJustificativa = valor
     },
     toggleTodasCaracteristicas (key) {
       this.$set(this.filtroKeysCaracteristica, key, !this.filtroKeysCaracteristica[key])
       this.$set(this.visibilidade, key, this.filtroKeysCaracteristica[key])
       this.atualizarSelecaoCaracteristicas(key, [], 0, true, this.filtroKeysCaracteristica[key])
     },
     isVisible (key) {
       return !!this.visibilidade[key]
     },
     isSelected (key) {
       return !!this.filtroKeysCaracteristica[key]
     },
     detalharItem (item) {
       console.log(item)
       this.itemDetalheSelecionado = item
       setTimeout(() => this.$refs.detalhamentoContainer.scrollIntoView({ behavior: 'smooth' }), 100)
       this.toggleDetalhe(true)
     },
     toggleDetalhe (valor) {
       this.abrirDetalheItem = valor
     },
     // Aguarda 500ms antes de enviar a solicitação
     debounceFiltro (search, tipo) {
       if (tipo !== 'categoria' && !this.procuraIndividual) {
         return
       }
       clearTimeout(this.debounceTimer)
       this.debounceTimer = setTimeout(() => {
         if (search === '') {
           return
         }
         this.pesquisarGeral(search, tipo)
       }, 1000)
     },
     // Pesquisar sem dependência
     pesquisarGeral (termo, tipo) {
       console.log('Pesquisa de Cotação')
       // Debounce de input
       this.loading[tipo] = true
       let obj = {
         campoConsulta: tipo,
         termoQuery: termo,
         tipoItem: this.selecaoTipoItens,
         uf: this.selecaoUfs
       }
       axiosLaravel.post('/cotacao/pesquisarGeral/', obj).then((response) => {
         console.log(response.data)
         response.data.map((item) => {
           if (!this.selectOptions[tipo].includes(item[tipo])) {
             this.selectOptions[tipo].push(item[tipo])
           }
         })
         this.loading[tipo] = false
         this.selectOptions[tipo].sort()
         this.$forceUpdate()
       })
        .catch((error) => {
          this.$root.trataErro(error)
          this.loading[tipo] = false
        })
     },
     consultarGrupos () {
       this.selectOptions.grupo = []
       this.selecaoGrupos = []
       this.selecaoClassificacoes = []
       this.selectOptions.classificacao = []
       console.log('[CONSULTANDO GRUPOS]', this.selecaoCategoria, this.selecaoCategoria.length)
       this.loading['grupo'] = true
       if (this.selecaoCategoria.length === 0) {
         this.selectOptions['grupo'] = []
         this.loading['grupo'] = false
         return
       }
       let obj = {
         categorias: this.selecaoCategoria,
         tipoItem: this.selecaoTipoItens,
         uf: this.selecaoUfs
       }
       axiosLaravel.post('/cotacao/pesquisarGrupos/', obj).then((response) => {
         console.log(response.data)
         response.data.map((item) => {
           if (!this.selectOptions['grupo'].includes(item['grupo'])) {
             this.selectOptions['grupo'].push(item['grupo'])
           }
         })
         this.loading['grupo'] = false
         this.selectOptions['grupo'].sort()
         this.$forceUpdate()
       })
        .catch((error) => {
          this.$root.trataErro(error)
          this.loading['grupo'] = false
        })
     },
     consultarClassificacoes () {
       this.selectOptions.classificacao = []
       console.log('[CONSULTANDO CLASSIFICACOES]')
       this.loading['classificacao'] = true

       if (this.selecaoGrupos.length === 0) {
         this.selectOptions['classificacao'] = []
         this.loading['classificacao'] = false
         return
       }

       let obj = {
         categorias: this.selecaoCategoria,
         grupos: this.selecaoGrupos,
         tipoItem: this.selecaoTipoItens,
         uf: this.selecaoUfs
       }
       axiosLaravel.post('/cotacao/pesquisarClassificacao/', obj).then((response) => {
         console.log(response.data)
         response.data.map((item) => {
           if (!this.selectOptions['classificacao'].includes(item['classificacao'])) {
             this.selectOptions['classificacao'].push(item['classificacao'])
           }
         })
         this.loading['classificacao'] = false
         this.selectOptions['classificacao'].sort()
         this.$forceUpdate()
       })
        .catch((error) => {
          this.$root.trataErro(error)
          this.loading['classificacao'] = false
        })
     },
     consultarItens () {
       this.selectOptions.item = []
       this.selecaoItems = []
       console.log('[CONSULTANDO ITEMS]')
       this.loading['item'] = true
       if (this.selecaoCategoria.length === 0) {
         this.selectOptions['item'] = []
         this.loading['item'] = false
         return
       }
       let obj = {
         categorias: this.selecaoCategoria,
         grupos: this.selecaoGrupos,
         classificacoes: this.selecaoClassificacoes,
         tipoItem: this.selecaoTipoItens,
         uf: this.selecaoUfs
       }
       axiosLaravel.post('/cotacao/pesquisarItens/', obj).then((response) => {
         console.log(response.data)
         response.data.map((item) => {
           if (!this.selectOptions['item'].includes(item['item'])) {
             this.selectOptions['item'].push(item['item'])
           }
         })
         this.loading['item'] = false
         this.selectOptions['item'].sort()
         this.$forceUpdate()
       })
        .catch((error) => {
          this.$root.trataErro(error)
          this.loading['item'] = false
        })
     },

     consultarGrupoItem () {
       this.consultarGrupos()
       this.consultarItens()
     },
     consultarClassificacaoItem () {
       this.consultarClassificacoes()
       this.consultarItens()
     },
     clearTipoSelection () {
       this.clearClassificadores()
       this.selecaoTipoItens = []
       this.selecaoUfs = []
       setTimeout(() => this.$refs.topo.scrollIntoView({ behavior: 'smooth' }), 300)
       this.resultadoCaracteristicas = []
       this.resultadoItems = []
       this.resultadoSelecionadoItems = []
       this.$forceUpdate()
     },
     clearClassificadores () {
       this.selectOptions.categoria = []
       this.selectOptions.grupo = []
       this.selectOptions.classificacao = []
       this.selectOptions.item = []
       this.selecaoCategoria = []
       this.selecaoClassificacoes = []
       this.selecaoGrupos = []
       this.selecaoItems = []
       this.procuraIndividual = true
       this.procuraCategorizadores = false
     },
     consultarItensLicitacao () {
       this.loading.show = true
       setTimeout(() => this.$refs.loadingItems.scrollIntoView({ behavior: 'smooth' }), 300)
       console.log('CONSULTANDO ITENS DE LICITACAO')
       this.resultadoCaracteristicas = []
       this.resultadoItems = []
       this.resultadoSelecionadoItems = []
       this.resultadoSelecionadoItemsFiltro = []
       this.filtroItensCaracteristica = []
       let obj = {
         categorias: this.selecaoCategoria,
         grupos: this.selecaoGrupos,
         classificacoes: this.selecaoClassificacoes,
         tipoItem: this.selecaoTipoItens,
         items: this.selecaoItems,
         uf: this.selecaoUfs,
         valorMaximo: this.valorMaximo,
         valorMinimo: this.valorMinimo
       }
       axiosLaravel.post('/cotacao/pesquisarItensLicitacao/', obj).then((response) => {
         console.log(response.data)
         this.resultadoItems = response.data.items
         this.resultadoCaracteristicas = _.groupBy(response.data.caracteristicas, 'tipo_caracteristica')
         // Ordena chaves alfabeticamente
         let sortedKeys = Object.keys(this.resultadoCaracteristicas).sort()
         let groupedItems = sortedKeys.reduce((acc, key) => {
           acc[key] = this.resultadoCaracteristicas[key]
           return acc
         }, {})
         this.resultadoCaracteristicas = groupedItems
         this.filtroItensCaracteristica = _.cloneDeep(this.resultadoCaracteristicas)
         console.log('filtro caracteristicas', this.filtroItensCaracteristica)
         this.resultadoSelecionadoItems = response.data.items
         this.resultadoSelecionadoItemsFiltro = _.cloneDeep(this.resultadoSelecionadoItems)
         this.table.items = this.resultadoSelecionadoItems
         this.table.totalRows = this.table.items.length
         this.loading.show = false
         setTimeout(() => this.$refs.itemsEncontrados.scrollIntoView({ behavior: 'smooth' }), 300)
         this.$forceUpdate()
       })
        .catch((error) => {
          this.loading.show = false
          this.$root.trataErro(error)
        })
     },
     atualizarSelecaoCaracteristicas (key, item = [], index, todos = false, valorTodos = false) {
       console.log(key, item, index)
       if (!todos) {
         // Marca como selecionado ou deselecionado
         this.filtroItensCaracteristica[key][index].selecionado = !this.filtroItensCaracteristica[key][index].selecionado
       } else {
         this.filtroItensCaracteristica[key].forEach(element => {
           console.log(element)
           element.selecionado = valorTodos
         })
       }
       // Filtra resultados
       this.filtroCaracteristicas()
     },
     filtroCaracteristicas () {
       console.log('FILTRANDO ...')
       this.idItemsFiltro = []
       // Verifica todas as caracteristicas que estão com TRUE
       Object.keys(this.filtroItensCaracteristica).forEach(key => {
         this.filtroItensCaracteristica[key].forEach(caracteristica => {
           // Puxa os ids
           if (caracteristica.selecionado) {
             if (!this.idItemsFiltro.includes(caracteristica.fk_banco_precos_tratado)) {
               this.idItemsFiltro.push(caracteristica.fk_banco_precos_tratado)
               console.log(this.idItemsFiltro)
             }
           }
         })
       })
       const resultadoFiltrado = this.resultadoSelecionadoItemsFiltro.filter(item => {
         return this.idItemsFiltro.includes(item.id.toString())
       })
       // Filtra a tabela de itens encontrados
       this.table.items = resultadoFiltrado
       this.$forceUpdate()
       console.log(this.idItemsFiltro)
       console.log(resultadoFiltrado)
     },
     resetarItensTabela () {
       this.table.items = this.resultadoSelecionadoItemsFiltro
       this.resetarCaracteristicas()
       this.$forceUpdate()
     },
     resetarCaracteristicas () {
       Object.keys(this.filtroItensCaracteristica).forEach(key => {
         this.$set(this.filtroKeysCaracteristica, key, false)
         this.$set(this.visibilidade, key, false)
         this.filtroItensCaracteristica[key].forEach(caracteristica => {
           caracteristica.selecionado = false
         })
       })
     },
     gravarResultado () {
       if (this.resultadoItems.length <= 0) {
         this.$snotify.error('Atenção, pesquise primeiro antes de gravar o resultado.')
       }
       let itensSelecionados = []
       this.table.items.forEach(item => {
         if (item.selecionado) {
           itensSelecionados.push(item)
         }
       })
       if (itensSelecionados.length < 3) {
         this.$snotify.error('Atenção, a amostra deve conter ao menos 3(TRÊS) itens de cotação.')
         return
       }
       this.gravaSelecaoItens(itensSelecionados, this.criarDefinicaoItem(), this.remocaoManual)
       console.log('Gravando resultado..')
       this.toggleBancoPrecos(false)
     },
     handleCategorizadores () {
       if (this.procuraCategorizadores) {
         this.procuraIndividual = false
       } else {
         this.procuraIndividual = true
       }
     },
     criarDefinicaoItem () {
       // Cria uma string a partir do resultado pesquisado
       console.log('Criando definição de item')
       let nomeItem = ''
       if (this.selecaoItems.length > 0) {
         nomeItem = nomeItem + ' ' + this.selecaoItems[0]
       } else {
         if (this.selecaoCategoria.length > 0) {
           nomeItem = nomeItem + ' ' + this.selecaoCategoria[0]
         }
         if (this.selecaoGrupos.length > 0) {
           nomeItem = nomeItem + ' ' + this.selecaoGrupos[0]
         }
         if (this.selecaoClassificacoes.length > 0) {
           nomeItem = nomeItem + ' ' + this.selecaoClassificacoes[0]
         }
       }

       return nomeItem.toUpperCase()
     },
     verificaExclusaoManual (item) {
       this.itemJustificativa = {}
       this.selecaoJustificativa = ''
       // Se não for true, abre janela de justificativa
       if (!item.selecionado) {
         this.toggleJustificativa(true)
         this.itemJustificativa = item
       } else {
         // Se for true, remove o item da lista
         this.remocaoManual = this.remocaoManual.filter((objRemocao) => objRemocao.item.id !== item.id)
       }
     },
     gravaRemocaoManual (item) {
       if (this.selecaoJustificativa === '') {
         this.$snotify.error('Atenção, selecione um motivo antes de concluir.')
         return
       }
       let obj = {
         item: item,
         justificativa: this.selecaoJustificativa,
         responsavel: this.usuarioLogado.ds_nome_usuario
       }
       this.remocaoManual.push(obj)
       this.toggleJustificativa(false)
     },
     cancelaRemocaoManual (item) {
       this.table.items.forEach((tableItem) => {
         if (tableItem.id === item.id) {
           tableItem.selecionado = true
         }
       })
       this.toggleJustificativa(false)
     }
   }
 }
 </script>
   
 <style scoped>
  .banco-precos-main-container {
    position: relative;
    gap: 10px;
    background-color: #eeeeee;
    width: 100%;
    max-height: 95vh;
    overflow: auto;
    border-radius: 10px;
    padding: 20px;
    animation: fade 0.3s ease;
   }
  .banco-precos-header-container {
    width: 100%;
    background-color: #41B883;
    gap: 5px;
    color: #ffffff;
    font-size: 1.5rem;
    border-radius: 10px;
    box-sizing: border-box;
    padding: 20px;
    box-shadow: 0px 1px 0px rgba(198, 188, 188, 0.5);
  }
  .select-container-sm {
    width: 100%;
  }
  .select-container-md {
    width: 100%;
  }
  .select-container-xl {
    width: 100%;
  }

  .form-item-container {
    width: 100%;
    color: #36976b;
  }

  .banco-precos-inferior-container {
    width: 100%;
    background-color: #FCFCFC;
    border-radius: 10px;
    box-sizing: border-box;
    padding: 20px;
    border: 1px solid #d6d6d6;
    box-shadow: 0px 1px 0px rgba(198, 188, 188, 0.5);
    gap: 5px;
  }

  .banco-precos-caracteristicas-container {
    width: 30%;
    height: 500px;
    overflow: auto;
    background-color: #FFF7CE;
    border-radius: 10px;
    border: 1px solid #F0F0F0;
    box-sizing: border-box;
    padding: 20px;
    box-shadow: 0px 1px 0px rgba(198, 188, 188, 0.5);
    gap: 5px;
  }

  .banco-precos-resultados-container {
    width: 70%;
    height: 500px;
    overflow: auto;
    background-color: #FCFCFC;
    border-radius: 10px;
    border: 1px solid #F0F0F0;
    box-sizing: border-box;
    padding: 20px;
    box-shadow: 0px 1px 0px rgba(198, 188, 188, 0.5);
    gap: 5px;
  }

  .banco-precos-filtro-container {
    width: 100%;
    gap: 10px;
    background-color: #FCFCFC;
    border-radius: 10px;
    border: 1px solid #d6d6d6;
    box-sizing: border-box;
    padding: 20px;
    box-shadow: 0px 1px 0px rgba(198, 188, 188, 0.5);
  }

  .banco-precos-titulo {
    width: 100%;
    gap: 5px;
    font-weight: 700;
    color: #36976b;
    border-bottom: 1px solid #36976b;
    padding-bottom: 5px;
    margin-bottom: 5px;
  }
  .banco-precos-titulo-resultado {
    width: 100%;
    gap: 5px;
    font-weight: 700;
    color: #36976b;
  }

  .banco-precos-refinadores-container {
    width: 100%;
    gap: 10px;
    background-color: #fcffeb;
    border-radius: 10px;
    border: 1px solid #d6d6d6;
    box-sizing: border-box;
    padding: 20px;
    box-shadow: 0px 1px 0px rgba(198, 188, 188, 0.5);
  }
  .banco-precos-item-container {
    width: 100%;
    gap: 10px;
    background-color: #c7eecc;
    border-radius: 10px;
    border: 1px solid #d6d6d6;
    box-sizing: border-box;
    padding: 20px;
    box-shadow: 0px 1px 0px rgba(198, 188, 188, 0.5);
  }
  .banco-precos-base-container {
    width: 100%;
    gap: 10px;
    background-color: #fcffeb;
    border-radius: 10px;
    border: 1px solid #d6d6d6;
    box-sizing: border-box;
    padding: 20px;
    box-shadow: 0px 1px 0px rgba(198, 188, 188, 0.5);
  }

  .banco-precos-aparecer {
    animation: fadeAndSlideX 0.3s ease;
  }

  .banco-precos-tabela {
    border-radius: 10px !important;
  }

  .banco-precos-table-descricao {
    max-width: 600px;
    cursor:help;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .banco-precos-titulo-container {
    width: 100%;
    padding-bottom: 10px;
    margin-bottom: 10px;
    border-bottom: 2px solid #36976b;
  }

  .banco-precos-subtitulo {
    width: 100%;
  }

  .banco-precos-item-tipo-caracteristica {
    background-color: #36976b;
    color: #FFFFFF;
    width: 100%;
    padding: 10px;
    font-size: 1.5rem;
    border-radius: 10px;
    margin-bottom: 5px;
    margin-top: 5px;
    cursor: pointer;
    font-weight: 700;
    box-shadow: 0px 1px 0px rgba(198, 188, 188, 0.5);
  }

  .banco-precos-caracteristicas-items-container {
    width: 100%;
    height: 500px;
    overflow: auto;
    padding-right: 20px;
    box-shadow: 0px 1px 0px rgba(198, 188, 188, 0.5);
  }

  .banco-precos-table-container {
    width: 100%;
    height: 500px;
    overflow: hidden;
    overflow-y: scroll;
    box-shadow: 0px 1px 0px rgba(198, 188, 188, 0.5);
  }

  .banco-precos-selecao-caracteristicas-container {
    width: 95%;
    border-right: 2px dashed #4bbb89;
    box-sizing: border-box;
    padding: 10px;
    gap: 5px;
  }

  .banco-precos-caracteristica {
    gap: 10px;
    background-color: #4bbb89;
    color: #FFFFFF;
    padding: 5px;
    border-radius: 10px;
    cursor: pointer;
    animation: fadeAndSlideX 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
    transition: 0.2s cubic-bezier(0.68, -0.55, 0.265, 1.55);
  }

  .banco-precos-caracteristica:hover {
    transform: translateX(-5px);
    background-color: #54a5ca;
  }

  .banco-precos-caracteristica-selecionada {
    background-color: #3f83a3;
    padding: 10px;
  }
  .banco-precos-caracteristica-selecionada:hover {
    transform: translateX(-5px);
    background-color: #ca5454;
  }

  .icon-selected {
    transition: 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55);
    transform: rotate(-90deg);
  }

  .icon-deselected {
    transition: 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55);
    transform: rotate(0deg);
  }

  .banco-precos-detalhamento-item {
    position: absolute;
    top: 30%;
    right: 0;
    left: 0;
    z-index: 9999;
  }

  .span-filtro {
    width: 100%;
    margin-right: 5px;
    gap: 5px;
  }

  .banco-precos-filtro-caracteristica-container {
    margin-top: 10px;
    width: 100%;
    gap: 10px;
  }

  .banco-precos-filtro-carecteristica-button {
    all: unset;
    color: #FFFFFF;
    background-color: #36976b;
    padding: 10px 20px;
    border-radius: 10px;
    cursor: pointer;
    transition: 0.2s ease;
  }

  .banco-precos-item-tipo-caracteristica-selecionada {
     background-color: #3f83a3;
  }

  .banco-precos-aviso {
    background-color: #36976b;
    border-radius: 10px;
    padding: 20px;
    color: #FFFFFF;
  }
  .banco-precos-aviso-filtro {
    background-color: #4fb889;
    border-radius: 10px;
    padding: 10px 20px;
    color: #FFFFFF;
  }

  .banco-precos-spin {
    margin: 10px;
    animation: spin 0.5s ease-out infinite;
  }

  .banco-precos-filtros-avancados-container {
    width: 100%;
    gap: 10px;
  }

  .banco-precos-justificativa-container {
     /* position: absolute; */
     width: 40%;
     height: 200px;
     box-shadow: 0px 1px 0px rgba(198, 188, 188, 0.5);
     background-color: #ffffff;
     border-radius: 10px;
     padding: 20px;
     gap: 10px;
     z-index: 9999;
  }

  .banco-precos-justificativa-modal {
    position: absolute;
    cursor: pointer;
    background-color: rgba(0,0,0,0.3);
    padding: 20px;
    width: 1040px;
    height: 380px;
    z-index: 9998;
    border-radius: 10px;
    animation: fadeOpacity 0.5s ease;
    backdrop-filter: blur(5px);
  }

  @keyframes fadeAndSlide {
    0% {
      opacity: 0;
      transform: translateY(-10px);
    }
    100% {
      opacity: 1;
      transform: translateY(0);
    }
    }

  @keyframes fadeOpacity {
    0% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
    }
    @keyframes fadeAndSlideX {
    0% {
      opacity: 0;
      transform: translateX(-50px);
    }
    100% {
      opacity: 1;
      transform: translateX(0);
    }
    }

    @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
      }

 </style>
 