  <!-- 74213 - Módulo de Prestação de Contas para Processo Simplificado-->
<template>
    <div class="content-wrapper column centered-start" style="min-height: 870px;" v-if="usuarioLogado.userType == 'FUNDACAO'">
        <section class="content-header">
            <h1>Processo Simplificado</h1>
            <b-breadcrumb :items="[{text: 'Inicial', href: '/'}, {text: 'Cadastro', href: '#'}, {text: 'Proposta Simplificada', active: true}]"/>
        </section>
        <div class="column all-centered prop-simp-container" v-if="loading">
          <h4 class="box-body text-center"><i class="fa fa-refresh sa-spin"></i></h4>
          <span>Carregando...</span>
        </div>
        <div class="column centered-start prop-simp-container" v-if="!loading">
            <div class="column all-start log-title-container">
                <h3 class="log-title row-flex centered-start">
                  <i class="fa fa-pencil" aria-hidden="true"></i>
                      Gerenciador de Proposta Simplificada
                </h3>
                <span class="prop-simp-span">Atenção: as propostas vinculadas a editais aparecerão aqui conforme <b>análise</b> (propostas já cadastradas no sistema), conforme <b>liberação de propostas</b> (novas propostas liberadas pelo usuário) e/ou conforme <b> autocredenciamento</b>.</span>
            </div>
            <div class="row-flex start-centered prop-simp-navbar-container" v-if="!adicionarRegistro">
                <div class="row-flex all-centered" :class="tabSelect == 'Proposta' ? 'prop-simp-button-selected' : 'prop-simp-button'" @click="handleTab('Proposta')">
                    <i class="fa fa-user" aria-hidden="true"></i> Propostas
                </div>
                <div class="row-flex all-centered" :class="tabSelect == 'Edital' ? 'prop-simp-button-selected' : 'prop-simp-button'" @click="handleTab('Edital')">
                    <i class="fa fa-users" aria-hidden="true"></i> Editais
                </div>
            </div>


            <!-- Adicionar Registro -->

            <div v-if="adicionarRegistro" class="column centered-start prop-simp-cadastro-container">

            <div class="column all-start log-title-container">
                <h3 class="log-title row-flex centered-start">
                  <i class="fa fa-plus-circle" aria-hidden="true"></i>
                      Adicionar novo registro de {{ tabSelect }}
                </h3>

              <div class="row-flex centered-start prop-simp-aviso">
                <div class="column all-centered prest-declaracoes-icon">
                  <i class="fa fa-exclamation-circle" aria-hidden="true" ></i>
                </div>
                <div v-if="tabSelect == 'Proposta'">
                  AVISO: as propostas adicionadas <b>manualmente</b> ficam <b>pendentes</b> de <b>acertos manuais</b> por <b>parte do usuário</b>, tanto no <b>cronograma</b> quanto na <b>análise</b>, a depender do seu <b>status</b>. Para propostas já aprovadas, será habilitado apenas a <b>prestação de contas</b> do processo simplificado e os acertos de cronograma, caso necessário, devem ser feitos através da ferramenta de <b>alteração de projetos</b>.
                </div>
                <div v-if="tabSelect == 'Edital'">
                  AVISO: para propostas de editais que já estão em fase de Análise, informamos que caso seja necessário, o acerto do cronograma deve ser feito manualmente. Para propostas já aprovadas, o cronograma, caso seja necessário, deverá ser alterado pela funcionalidade de alteração de projetos.
                </div>
              </div>

              <div class="column start-centered prop-simp-pesquisa-container">
                <div v-if="tabSelect == 'Proposta'">
                  <i>Pesquise por <b>número de projeto</b>, <b>número da proposta</b> ou <b>nome do projeto</b> e clique em Pesquisar.</i>
                </div>
                <div v-if="tabSelect == 'Edital'">
                  <i>Pesquise por <b>número do edital</b> ou <b>nome do edital</b> e clique em Pesquisar.</i>
                </div>
                <div class="row-flex centered-start prop-simp-pesquisa">
                  <input v-model="termoPesquisa" type="text" class="form-control ng-pristine ng-untouched ng-valid ng-empty prop-simp-input" placeholder="Pesquisar..." @keyup.enter="pesquisarNovoRegistro()">
                  <g-button-moema color="primary" @click.native="pesquisarNovoRegistro()" type="button"><i class="fa fa-search" aria-hidden="true"></i> Pesquisar</g-button-moema>
                </div>
              </div>
              <div class="column all-centered log-title-container" v-if="loadingPesquisa">
                <h4 class="box-body text-center"><i class="fa fa-refresh sa-spin"></i></h4>
                <span>Pesquisando...</span>
              </div>
                <b-container fluid class="table-simp-container" v-if="!loadingPesquisa">
                  <b-table show-empty
                              stacked="md"
                              :key="tableDataKey"
                              striped
                              :bordered="true"
                              :items="tablePesquisa.items"
                              :fields="tablePesquisa.fields"
                              :current-page="tablePesquisa.currentPage"
                              :per-page="tablePesquisa.perPage"
                              :filter="tablePesquisa.filter"
                              empty-text="Nenhum registro encontrado"
                              :sort-by.sync="tablePesquisa.sortBy"
                              :sort-desc.sync="tablePesquisa.sortDesc">
                              <template slot="actions" scope="row">
                                  <g-button-ujarak  color="success" size="button--size-ss" @click.native="cadastraRegistroSimplificado(row.item)" :title="'<h5> Adiciona registro no processo simplificado. </h5>'" v-tippy="{ arrow: false, followCursor: true, theme: 'light' }"><i class="fa fa-check" aria-hidden="true"></i> </g-button-ujarak>
                              </template>
                              <template slot="nome" scope="row">
                                <span class="prop-simp-span-proj" v-if="row.item.numero_projeto"><b>[ {{ row.item.numero_projeto }} ]</b> </span> {{ row.value }} <router-link v-if="row.item.numero_projeto" :title="'<h5>Ir para a página do Projeto</h5>'" v-tippy="{ inertia : true, arrow : true,  placement : 'right', animation : 'perspective', distance:'1', size: 'small', arrow : true }" :to="{name: 'projeto', params: { numero: row.item.numero_projeto }}" target="_blank">&nbsp<i class="fa fa-external-link"></i></router-link>
                              </template>

                  </b-table>
                  <div class="row-flex all-end prest-total-documentos">
                      <div>
                          Total de Registros: <b>{{ tablePesquisa.items.length }}</b>
                      </div>
                  </div>
                  <b-row>
                      <b-col md="8" class="my-1" right>
                          <b-pagination :total-rows="tablePesquisa.items.length" :per-page="tablePesquisa.perPage" v-model="tablePesquisa.currentPage" class="my-3" />
                      </b-col>
                  </b-row>
              </b-container>
              
            </div>
              <div class="row-flex all-end prest-simp-busca-botoes">
                <g-button-moema color="warning" @click.native="toggleNovoRegistro(false)" type="button"><i class="fa fa-arrow-left" aria-hidden="true"></i> Voltar</g-button-moema>
              </div>
            </div>
            

            <!-- Registros Cadastrados -->
            <b-container fluid class="table-simp-container" v-if="tabSelect == 'Proposta' && !adicionarRegistro">
                <div class="row-flex all-centered prop-simp-input-container">
                  <input v-model="table.filter" type="text" class="form-control ng-pristine ng-untouched ng-valid ng-empty prop-simp-input" placeholder="Pesquisa propostas...">
                  <g-button-moema color="primary" @click.native="toggleNovoRegistro(true)" type="button"><i class="fa fa-user" aria-hidden="true"></i> Adicionar Proposta</g-button-moema>
                </div>
                <b-table show-empty
                            stacked="md"
                            :key="tableDataKey"
                            :striped="true"
                            :bordered="true"
                            :items="table.items"
                            :fields="table.fields"
                            :current-page="table.currentPage"
                            :per-page="table.perPage"
                            :filter="table.filter"
                            empty-text="Nenhum registro encontrado"
                            :sort-by.sync="table.sortBy"
                            :sort-desc.sync="table.sortDesc">
                            <template slot="simplificado" scope="row">
                                <g-button-ujarak  :color="row.value == 0 ? 'warning': 'success'" size="button--size-ss" @click.native="alteraProcessoSimplificado(row.item)" :title="row.value == 0 ? '<h5> Ativa processo simplificado. </h5>': '<h5> Desativa processo simplificado. </h5>'" v-tippy="{ arrow: false, followCursor: true, theme: 'light' }"><i :class="row.value == 0 ? 'fa fa-warning':'fa fa-check' " aria-hidden="true"></i> {{row.value == 0 ? 'Inativo' : 'Ativo'}}</g-button-ujarak>
                            </template>
                            <template slot="nome_proposta" scope="row">
                              <div class="column start-centered">
                                <div>
                                  <span class="prop-simp-span-id">[<b>{{ row.item.fk_proposta }}</b>] </span>  {{ row.value }} <span class="prop-simp-span-proj" v-if="row.item.ds_codigo_projeto_erp"><b>({{ row.item.ds_codigo_projeto_erp }})<router-link :title="'<h5>Ir para a página do Projeto</h5>'" v-tippy="{ inertia : true, arrow : true,  placement : 'right', animation : 'perspective', distance:'1', size: 'small', arrow : true }" :to="{name: 'projeto', params: { numero: row.item.ds_codigo_projeto_erp }}" target="_blank">&nbsp<i class="fa fa-external-link"></i></router-link></b> </span>
                                </div>
                                <div class="row-flex all-end prop-simp-entidade-container break">
                                  <div class="row-flex">
                                    {{ row.item.nome_entidade }}
                                  </div>
                                  <div class="row-flex gap-5">
                                    [ {{ row.item.ds_cnpj | cnpj }} ] <b> <router-link :title="'<h5>Ir para o Cadastro da entidade</h5>'" v-tippy="{ inertia : true, arrow : true,  placement : 'right', animation : 'perspective', distance:'1', size: 'large', arrow : true }" :to="{name: 'cadastro-entidade-visualiza', params: { id: row.item.id_entidade }}" target="_blank"> <i class="fa fa-user"></i></router-link></b>
                                  </div>
                                </div>
                              </div>
                            </template>
                            <template slot="valor_fbb" scope="row">
                                {{ row.value | real }}
                            </template>
                            <template slot="edital" scope="row">
                              <div v-if="row.item.id_edital">
                                ({{ row.item.id_edital }}) {{ row.value }}
                              </div>
                              <div v-else>
                                Prospecção Direta
                              </div>
                            </template>
                </b-table>
                <div class="row-flex all-end prest-total-documentos">
                    <div>
                        Total de Registros: <b>{{ table.items.length }}</b>
                    </div>
                </div>
                <b-row>
                    <b-col md="8" class="my-1" right>
                        <b-pagination :total-rows="table.totalRows" :per-page="table.perPage" v-model="table.currentPage" class="my-3" />
                    </b-col>
                </b-row>
            </b-container>
            <b-container fluid class="table-simp-container" v-if="tabSelect == 'Edital' && !adicionarRegistro">
                <div class="row-flex all-centered prop-simp-input-container">
                  <input v-model="tableEdital.filter" type="text" class="form-control ng-pristine ng-untouched ng-valid ng-empty" placeholder="Pesquisa editais...">
                  <g-button-moema color="primary" @click.native="toggleNovoRegistro(true)" type="button"><i class="fa fa-users" aria-hidden="true"></i> Adicionar Edital</g-button-moema>
                </div>
                <b-table show-empty
                          stacked="md"
                          :key="tableDataKey"
                          striped
                          :bordered="true"
                          :items="tableEdital.items"
                          :fields="tableEdital.fields"
                          :current-page="tableEdital.currentPage"
                          :per-page="tableEdital.perPage"
                          :filter="tableEdital.filter"
                          empty-text="Nenhum registro encontrado"
                          :sort-by.sync="tableEdital.sortBy"
                          :sort-desc.sync="tableEdital.sortDesc">
                          <template slot="simplificado" scope="row">
                              <g-button-ujarak  :color="row.value == 0 ? 'warning': 'success'" size="button--size-ss" @click.native="alteraProcessoSimplificado(row.item)" :title="row.value == 0 ? '<h5> Ativa processo simplificado. </h5>': '<h5> Desativa processo simplificado. </h5>'" v-tippy="{ arrow: false, followCursor: true, theme: 'light' }"><i :class="row.value == 0 ? 'fa fa-warning':'fa fa-check' " aria-hidden="true"></i> {{row.value == 0 ? 'Inativo' : 'Ativo'}}</g-button-ujarak>
                          </template>
                </b-table>
                <div class="row-flex all-end prest-total-documentos">
                    <div>
                        Total de Registros: <b>{{ tableEdital.items.length }}</b>
                    </div>
                </div>
                <b-row>
                    <b-col md="8" class="my-1" right>
                        <b-pagination :total-rows="tableEdital.items.length" :per-page="tableEdital.perPage" v-model="tableEdital.currentPage" class="my-3" />
                    </b-col>
                </b-row>
            </b-container>
        </div>
    </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import moment from 'moment'
  export default {
    components: {
    },
    name: 'GerenciadorPropostaSimplificada',
    data () {
      return {
        loading: false,
        loadingPesquisa: false,
        tabSelect: 'Proposta',
        adicionarRegistro: false,
        novoRegistro: {
          tipo: '',
          id: ''
        },
        termoPesquisa: '',
        moment: moment,
        table: {
          items: [],
          currentPage: 1,
          perPage: 10,
          totalRows: 0,
          sortBy: 'id',
          sortDesc: true,
          filter: null,
          emptyText: 'Sem registros de propostas',
          fields: [
              // { key: 'fk_proposta', label: 'ID', sortable: true, thStyle: 'text-align: center', class: 'text-center' },
              { key: 'nome_proposta', label: 'Nome', sortable: true, thStyle: 'text-align: center', class: 'text-left' },
              // { key: 'valor_fbb', label: 'Valor', sortable: true, thStyle: 'text-align: center', class: 'text-center' },
              { key: 'ds_fase', label: 'Fase', sortable: true, thStyle: 'text-align: center', class: 'text-center' },
              { key: 'edital', label: 'Edital', sortable: true, thStyle: 'text-align: center', class: 'text-center' },
              { key: 'simplificado', label: 'Simplificado?', sortable: true, thStyle: 'text-align: center', class: 'text-center' }
          ]
        },
        tableEdital: {
          items: [],
          currentPage: 1,
          perPage: 10,
          totalRows: 0,
          sortBy: 'id',
          sortDesc: true,
          filter: null,
          emptyText: 'Sem registros de editais',
          fields: [
              { key: 'fk_edital', label: 'ID', sortable: true, thStyle: 'text-align: center', class: 'text-center' },
              { key: 'nome_edital', label: 'Edital', sortable: true, thStyle: 'text-align: center', class: 'text-center' },
              { key: 'simplificado', label: 'Simplificado?', sortable: true, thStyle: 'text-align: center', class: 'text-center' }
          ]
        },
        tablePesquisa: {
          items: [],
          currentPage: 1,
          perPage: 10,
          totalRows: 0,
          sortBy: 'id',
          sortDesc: true,
          filter: null,
          emptyText: 'Sem registros de pesquisa',
          fields: [
              { key: 'identificador', label: 'ID', sortable: true, thStyle: 'text-align: center', class: 'text-center' },
              { key: 'nome', label: 'Nome', sortable: true, thStyle: 'text-align: center', class: 'text-left' },
              { key: 'tipo', label: 'Tipo', sortable: true, thStyle: 'text-align: center', class: 'text-center' },
              { key: 'actions', label: 'Ações', sortable: true, thStyle: 'text-align: center', class: 'text-center' }
          ]
        }
      }
    },
    props: ['numeroProposta'],
    computed: {
      ...mapGetters([
        'usuarioLogado'
      ]),
      chiefActive () {
        return this.usuarioLogado.entity.chiefs.some(chefe => {
          return chefe.active === true && moment(new Date()).isSameOrAfter(moment(chefe.initialMandateDate)) && moment(new Date()).isSameOrBefore(moment(chefe.endMandateDate))
        })
      }
    },
    created: function () {
    },
    mounted: function () {
      this.consultaPropostaSimplificada()
    },
    methods: {
      handleTab (aba) {
        this.tabSelect = aba
      },
      // Consulta propostas e edital simplificado
      async consultaPropostaSimplificada () {
        console.log('consultando propostas Simplificadas...')
        this.loading = true
        await axiosLaravel.get('/simplificado/getPropostaSimplificada/')
          .then((response) => {
            console.log(response.data)
            this.table.items = response.data.propostas
            this.tableEdital.items = response.data.editais
            this.table.currentPage = 1
            this.table.totalRows = response.data.propostas.length
            this.tableEdital.currentPage = 1
            this.tableEdital.totalRows = response.data.propostas.length
            this.$forceUpdate()
            this.loading = false
          })
          .catch((error) => {
            this.loading = false
            console.log(error)
          })
      },
      async pesquisarNovoRegistro () {
        this.loadingPesquisa = true
        // Verifica se o campo não está vazio
        if (this.termoPesquisa === '') {
          this.$snotify.error('Atenção, informe um termo de pesquisa antes de continuar.')
          this.loadingPesquisa = false
          return
        }
        let obj = {
          termoPesquisa: this.termoPesquisa,
          tipo: this.tabSelect
        }
        await axiosLaravel.post('/simplificado/pesquisarRegistroParaCadastro', obj)
          .then((response) => {
            console.log(response.data)
            this.tablePesquisa.items = response.data
            this.tablePesquisa.currentPage = 1
            this.tablePesquisa.totalRows = response.data.length
            this.$forceUpdate()
            this.loadingPesquisa = false
          })
          .catch((error) => {
            this.loadingPesquisa = false
            console.log(error)
          })
      },
      toggleNovoRegistro (valor) {
        this.adicionarRegistro = valor
        this.limparPesquisa()
      },
      limparPesquisa () {
        this.tablePesquisa.items = []
        this.termoPesquisa = ''
      },
      alteraProcessoSimplificado (item) {
        // Recarrega valores
        if (this.tabSelect === 'Proposta') {
          this.$dialog.confirm(`Confirma a alteração na proposta simplificada? <b>Atenção</b>: é de responsabilidade do usuário o acompanhamento do cronograma e a análise da proposta para adequação, em sua ativação e desativação. Confirma?`, {html: true, animation: 'fade', customClass: 'avisoAlerta'})
          .then(dialog => {
            this.alterarProposta(item)
          }).catch(() => {
            this.$snotify.warning('Operação não realizada.')
          })
        } else {
          this.$dialog.confirm(`Confirma a alteração no edital simplificado? <b>Atenção</b>: <b>todas as propostas vinculadas</b> ao edital sofrerão alteração, sendo de responsabilidade do usuário o acompanhamento do cronograma e da análise para adequação, em sua ativação e desativação. Confirma?`, {html: true, animation: 'fade', customClass: 'avisoAlerta'})
          .then(dialog => {
            this.alterarEdital(item)
          }).catch(() => {
            this.$snotify.warning('Operação não realizada.')
          })
        }
      },
      async alterarProposta (item) {
        // Altera registro da proposta na base de dados
        this.loadingPesquisa = true
        this.$snotify.async('Atualizando a proposta. Por favor, aguarde...', {timeout: 0})
        let obj = {
          idProposta: item.fk_proposta,
          usuario: this.usuarioLogado.ds_login + ' ' + this.usuarioLogado.ds_nome_usuario,
          alteracao: String(item.simplificado) === '0' ? '1' : '0'
        }
        await axiosLaravel.post('/simplificado/atualizarPropostaSimplificada', obj)
          .then((response) => {
            this.loadingPesquisa = false
            if (response.data.codigo === 'ERRO') {
              this.$snotify.clear()
              this.$snotify.error(response.data.mensagem)
              return
            }
            this.$snotify.clear()
            this.$snotify.success(response.data.mensagem)
            this.consultaPropostaSimplificada()
          })
          .catch((error) => {
            this.$snotify.clear()
            this.$snotify.error('Erro na alteracao da proposta. Tente novamente mais tarde.')
            this.loadingPesquisa = false
            console.log(error)
          })
      },
      async alterarEdital (item) {
        // Altera registro de edital na base de dados
        this.loadingPesquisa = true
        this.$snotify.async('Atualizando a proposta. Por favor, aguarde...', {timeout: 0})
        let obj = {
          idEdital: item.fk_edital,
          usuario: this.usuarioLogado.ds_login + ' ' + this.usuarioLogado.ds_nome_usuario,
          alteracao: String(item.simplificado) === '0' ? '1' : '0'
        }
        console.log(item)
        console.log('OBJ', obj)
        await axiosLaravel.post('/simplificado/atualizarEditalSimplificado', obj)
          .then((response) => {
            this.loadingPesquisa = false
            if (response.data.codigo === 'ERRO') {
              this.$snotify.clear()
              this.$snotify.error(response.data.mensagem)
              return
            }
            this.$snotify.clear()
            this.$snotify.success(response.data.mensagem)
            this.consultaPropostaSimplificada()
          })
          .catch((error) => {
            this.$snotify.clear()
            this.$snotify.error('Erro na alteracao da proposta. Tente novamente mais tarde.')
            this.loadingPesquisa = false
            console.log(error)
          })
      },
      confirmarAdicaoEdital (item) {
        // Altera registro de edital na base de dados
        this.$dialog.confirm(`Confirma o cadastro do edital? Lembrando que ao confirmar, todas as propostas vinculadas a ele <b>entrarão no processo simplificado</b> e é de responsabilidade do usuário <b>monitorar</b> e <b>adequar</b> as propostas que já passaram em algum momento pela fase de <b>análise</b> ou que já possuem <b>cronograma</b> físico financeiro registrado.`, {html: true, animation: 'fade', customClass: 'avisoAlerta'})
          .then(dialog => {
            this.cadastraEdital(item)
          }).catch(() => {
            this.$snotify.warning('Operação não realizada.')
          })
      },
      cadastraRegistroSimplificado (item) {
        // Verifica que tipo está sendo incluído
        // Caso seja proposta, inclui na tabela
        // Caso seja edital, vai pegar todas as propostas vinculadas ao edital e adicionar a tabela, incluindo tambem a tabela de editais
        if (this.tabSelect === 'Proposta') {
          this.cadastraProposta(item)
        } else {
          this.confirmarAdicaoEdital(item)
        }
      },
      async cadastraProposta (item) {
        this.loadingPesquisa = true
        // Cadastra proposta na base de dados
        // Se nao tiver dado erro, fecha tela de cadastro e recarrega valores
        this.$snotify.async('Inserindo a proposta no modelo simplificado. Por favor, aguarde...', {timeout: 0})
        let obj = {
          idProposta: item.identificador,
          numero_projeto: item.numero_projeto,
          usuario: this.usuarioLogado.ds_login + ' ' + this.usuarioLogado.ds_nome_usuario,
          tipo: this.tabSelect
        }
        await axiosLaravel.post('/simplificado/cadastrarPropostaSimplificada', obj)
          .then((response) => {
            this.loadingPesquisa = false
            if (response.data.codigo === 'ERRO') {
              this.$snotify.clear()
              this.$snotify.error(response.data.mensagem)
              return
            }
            this.$snotify.clear()
            this.$snotify.success(response.data.mensagem)
            this.limparPesquisa()
            this.toggleNovoRegistro(false)
            this.consultaPropostaSimplificada()
          })
          .catch((error) => {
            this.$snotify.clear()
            this.$snotify.error('Erro no cadastro da proposta. Tente novamente mais tarde.')
            this.loadingPesquisa = false
            console.log(error)
          })
      },
      async cadastraEdital (item) {
        console.log('Cadastro edital ', item)
        this.loadingPesquisa = true
        // Cadastra proposta na base de dados
        // Se nao tiver dado erro, fecha tela de cadastro e recarrega valores
        this.$snotify.async('Inserindo a edital e suas propostas no modelo simplificado. Por favor, aguarde...', {timeout: 0})
        let obj = {
          idEdital: item.identificador,
          nome: item.nome,
          usuario: this.usuarioLogado.ds_login + ' ' + this.usuarioLogado.ds_nome_usuario,
          tipo: this.tabSelect
        }
        await axiosLaravel.post('/simplificado/cadastrarEditalSimplificado', obj)
          .then((response) => {
            this.loadingPesquisa = false
            if (response.data.codigo === 'ERRO') {
              this.$snotify.clear()
              this.$snotify.error(response.data.mensagem)
              return
            }
            this.$snotify.clear()
            this.$snotify.success(response.data.mensagem)
            this.limparPesquisa()
            this.toggleNovoRegistro(false)
            this.consultaPropostaSimplificada()
          })
          .catch((error) => {
            this.$snotify.clear()
            this.$snotify.error('Erro no cadastro do edital. Tente novamente mais tarde.')
            this.loadingPesquisa = false
            console.log(error)
          })
      }
    }
  }
</script>

<style>
    .prop-simp-container {
        width: 99%;
        min-height: 1000px;
        margin-top: 120px;
        margin-bottom: 20px;
        box-sizing: border-box;
        padding: 30px;
        border-radius: 10px;
        background-color: #FFFFFF;
        border: 1px solid #c0c0c0;
        animation: appear-sa 0.5s ease;
    }
    .table-simp-container {
        width: 95%;
    }

    .log-title {
        width: 100%;
        font-size: 2rem;
        height: 25px;
        border-left: 5px solid #1565C0;
        padding-left: 10px;
        gap: 10px;
    }
    .log-title-container {
        width: 95%;
        /* margin-bottom: 30px; */
    }

    .prop-simp-navbar-container {
      width: 100%;
      gap: 10px;
      margin-bottom: 30px;
    }

    .prop-simp-button {
      user-select: none;
      width: 200px;
      height: 30px;
      border-radius: 10px;
      background-color: #FCFC30;
      color: #1565C0;
      font-weight: 700;
      cursor: pointer;
      gap: 5px;
      transition: 0.2s ease;
    }

    .prop-simp-button-selected {
      user-select: none;
      width: 200px;
      height: 35px;
      border-radius: 10px;
      background-color: #1565C0;
      color: #FFFFFF;
      font-weight: 700;
      cursor: pointer;
      gap: 5px;
      transition: 0.2s ease;
    }

    .prop-simp-button:hover {
      scale: 0.98;
    }

    .prop-simp-button-selected:hover {
      scale: 0.98;
    }

    .prop-simp-span {
      padding: 10px;
      margin-bottom: 10px;
    }

    .sa-spin {
      /* scale: 2; */
      font-size: 5rem;
      animation: spin-exec-sa 0.4s linear infinite;
    }

    .prop-simp-input-container input {
      max-width: 85%;
    }
    .prop-simp-input-container {
      width: 100%;
      gap: 10px;
      margin-bottom: 10px;
    }

    .prop-simp-entidade-container {
      color: #858585;
      width: 100%;
      font-size: 1.2rem;
      gap: 5px;
    }

    .prop-simp-span-id {
      color: #858585;
    }
    .prop-simp-span-proj {
      color: #b3b3b3;
    }
    .prop-simp-cadastro-container {
      width: 95%;
      min-height: 400px;
      background-color: #eeeeee;
      border-radius: 10px;
      box-sizing: border-box;
      padding: 20px;
      animation: appear-sa 0.3s ease;
    }

    .prop-simp-aviso {
      margin: 20px 0px;
      width: 100%;
      border: 1px solid rgba(198, 188, 188, 0.5);
      background-color: #ffe551;
      color: #303030;
      border-radius: 8px !important;
      box-sizing: border-box;
      gap: 10px;
      padding: 20px;
    }

    .prop-simp-pesquisa-container {
      width: 100%;
      gap: 10px;
      margin-bottom: 10px;
    }

    .prop-simp-pesquisa {
      width: 100%;
      gap: 10px;
    }

    .prop-simp-pesquisa input {
      width: 90%;
    }

    .prest-simp-busca-botoes {
      width: 100%;
      gap: 5px;
    }

    @keyframes spin-exec-sa {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
    @keyframes appear-sa {
      0% { transform: translateY(-100px); opacity: 0; }
      100% { transform: translateY(0px); opacity: 1;}
    }

</style>
