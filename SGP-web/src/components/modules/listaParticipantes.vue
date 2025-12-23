<template>
  <div class="box-body">
    <!-- grid -->
    <div v-show="showgrid">

      <div class="row">
        <div class="col-md-12">

          <div class="col-md-4">

            <div class="col-md-4" style="padding: 0px">
              <!-- 69906 - Definicao de publico alvo -->
              <button v-if="disable === false" @click="novoParticipante()" :title="'<h5>Cadastrar novo participante</h5>'" v-tippy="{ inertia : true, arrow : true,  placement : 'top', animation : 'perspective', distance:'1', size: 'large', arrow : true }" type="button" class="btn btn-primary btn-flat"><i class="fa fa-plus-circle" aria-hidden="true"></i> <span style="font-family:Arial; font-size: small"> Novo Participante</span></button>              
            </div>
            <!-- // 67257 - Buscar participantes do relatório de execução -->
            <div v-if="usuarioLogado === 'FUNDACAO'" class="col-md-4" style="padding: 0px">
              <button @click="buscarParticipantes()" :title="'<h5>Busca Participantes de Relatórios Anteriores</h5>'" v-tippy="{ inertia : true, arrow : true,  placement : 'top', animation : 'perspective', distance:'1', size: 'large', arrow : true }" type="button" class="btn btn-primary btn-flat"><i class="fa fa-plus-circle" aria-hidden="true"></i> <span style="font-family:Arial; font-size: small"> Buscar(GETEC)</span></button>              
            </div>

            <div class="col-md-4">
              <div :title="'<h5>Exportar o conteúdo da listagem para Excel</h5>'" v-tippy="{ inertia : true, arrow : true,  placement : 'top', animation : 'perspective', distance:'1', size: 'large', arrow : true }" >
                <download-excel
                  class   = "btn btn-primary btn-flat"
                  :data   = "json_data"
                  :meta   = "json_meta"
                  type    = "xls"
                  :fields = "json_fields"
                  :name    = "nomeExcel">
                  <i class="fa fa-download" aria-hidden="true"></i> Exportar para Excel
                </download-excel>
              </div>
            </div>

          </div>

          <div class="col-md-4">
            <span class="box-title control-label" style="font-size: medium">{{table.items.length}} {{table.items.length > 1 ? 'participantes cadastrados':'participante cadastrado'}}
              <span v-if="$route.params.row.item.sequencia > 1" class="text-muted">
                <i v-if="propsRelatorio.tipo_relatorio === 'FINAL'" class="fa fa-question-circle icone_ajuda" aria-hidden="true" v-tippy="{inertia:true, arrow:true, animation:'perspective', distance:'1', size:'large', arrow:true}"
                   :title="'<h5>O sistema mostra todos os participantes cadastrados anteriormente, excluindo duplicidade de CPF e nome.<br/>A instituição poderá alterar ou excluir participantes neste Relatório Final.</h5>'"></i>
                <i v-else class="fa fa-question-circle icone_ajuda" aria-hidden="true" v-tippy="{inertia:true, arrow:true, animation:'perspective', distance:'1', size:'large', arrow:true}"
                   :title="'<h5>O sistema mostra todos os participantes cadastrados anteriormente, excluindo duplicidade de CPF e nome.<br/>A instituição poderá alterar ou excluir participantes somente no Relatório Final.</h5>'"></i>
              </span>
            </span>
          </div>

          <div class="col-md-4">
            <input v-model="table.filter" type="text" class="form-control ng-pristine ng-untouched ng-valid ng-empty" placeholder="Pesquisa...">
          </div>

        </div>

      </div>
      <br>
      <!--tabela-->
      <div class="row">
        <div class="col-md-12">
          <div class="table-responsive">

            <b-container fluid>
              <!-- Main table element -->
              <b-table show-empty
                       ref="tabelaUsuarios"
                       stacked="md"
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
                <template slot="data_nascimento" scope="row">{{row.value | moment("L")}}</template>
                <template slot="actions" scope="row">
                  <span v-if="disable || (_.has(row.item, 'editavel') && row.item.editavel === 0 && propsRelatorio.tipo_relatorio === 'PARCIAL')">
                    <!-- 69906 - Definicao de publico alvo -->
                    <g-button-ujarak color="success" @click.native="visualiza(row)" size="button--size-ss"><i class="fa fa-search" aria-hidden="true"></i> Visualizar</g-button-ujarak>
                  </span>
                  <span v-else>
                    <g-button-ujarak color="primary" @click.native="edita(row)" size="button--size-ss"><i class="fa fa-pencil-square-o" aria-hidden="true"></i> Editar</g-button-ujarak>
                    <g-button-ujarak color="error"   @click.native="exclui(row)" size="button--size-ss"><i class="fa fa-trash" aria-hidden="true"></i> Excluir</g-button-ujarak>
                  </span>
                </template>
              </b-table>
              <b-row>
                <b-col md="6" class="my-1" right>
                  <b-pagination :total-rows="table.totalRows" :per-page="table.perPage" v-model="table.currentPage" class="my-3" />
                </b-col>
              </b-row>
            </b-container>
          </div>
        </div>
      </div>
    </div>

    <!--Form-->
    <div v-if="!showgrid" style="padding-left:0" class="row well well-sm no-shadow animated fadeInDownOutUp">
      <div class="form-horizontal">

        <!--Nome-->
        <div class="row">
          <div class="col-md-8">
            <div class="form-group required-field"
                 :class="{ 'has-error' : errors.first('Nome do Participante')}">
              <label for="nomeParticipante" class="control-label col-md-3">Nome Completo:</label>
              <div class="col-md-8">
                <div>
                  <input v-model="participantes.nome" id="nomeParticipante" name="Nome do Participante" class="form-control" type="text" maxlength="255" :disabled="disable || (_.has(participantes, 'editavel') && participantes.editavel === 0)"
                         v-validate="'required'">
                </div>
                <span v-if="errors.first('Nome do Participante')" class="label label-danger"> {{ errors.first('Nome do Participante') }}</span>
              </div>
            </div>
          </div>
        </div>

        <!--CPF-->
        <div class="row" v-if="calculaIdade < 18">
          <div class="col-md-8">
            <div class="form-group">
              <label for="cpfParticipante" class="control-label col-md-3">CPF:</label>
              <div class="col-md-2">
                <div>
                  <the-mask v-model="participantes.cpf" id="cpfParticipante" ref="cpfParticipante" :disabled="disable || (_.has(participantes, 'editavel') && participantes.editavel === 0)"
                            name="CPF do Participante" class="form-control" type="text"
                            :mask="'###.###.###-##'" v-validate="'cpf'">
                  </the-mask>
                </div>
                <span v-if="errors.first('CPF do Participante')" class="label label-danger"> {{ errors.first('CPF do Participante') }}</span>
              </div>
            </div>
          </div>
        </div>
        <!--CPF-->
        <div class="row" v-if="calculaIdade > 18">
          <div class="col-md-8">
            <div class="form-group required-field"
                 :class="{ 'has-error' : errors.first('CPF do Participante')}">
              <label for="cpfParticipante" class="control-label col-md-3">CPF:</label>
              <div class="col-md-2">
                <div>
                  <the-mask v-model="participantes.cpf" ref="cpfParticipante" :disabled="disable || (_.has(participantes, 'editavel') && participantes.editavel === 0)"
                            name="CPF do Participante" class="form-control" type="text"
                            :mask="'###.###.###-##'" v-validate="'cpf|required'">
                  </the-mask>
                </div>
                <span v-if="errors.first('CPF do Participante')" class="label label-danger"> {{ errors.first('CPF do Participante') }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Data de nascimento -->
        <div class="row">
          <div class="col-md-8">
            <div class="form-group required-field"
                 :class="{ 'has-error' : errors.first('Data de nascimento')}">
              <label for="Data de nascimento" class="control-label col-md-3">
                Data de nascimento:</label>
              <div class="col-md-2">
                <!--<datepicker ref="Data de nascimento" name="Data de nascimento" v-model="participantes.data_nascimento" input-class="form-control datepicker"-->
                <!--:language="$datePickerPtBR" maxlength="20" :use-utc="true" placeholder="__ /__ /____" :disabled="disable || (_.has(participantes, 'editavel') && participantes.editavel === 0)"-->
                <!--format="dd/MM/yyyy" v-validate="'required'">-->
                <!--</datepicker>-->
                <input
                  type="text"
                  id="Data de nascimento"
                  ref="Data de nascimento"
                  name="Data de nascimento"
                  v-model="dt_nascimento_participante"
                  class="form-control"
                  v-mask="'##/##/####'"
                  data-vv-as="Data de nascimento"
                  :masked="masked"
                  v-validate="'required|validdate|dateeqpast'"
                  :disabled="disable || (_.has(participantes, 'editavel') && participantes.editavel === 0)"
                >
                <span v-if="errors.first('Data de nascimento')" class="label label-danger"> {{errors.first('Data de nascimento')}}</span>
              </div>
              <div class="col-md-2">
                <div class="box-body"><span v-if="dt_nascimento_participante"> Idade: <b>{{calculaIdade}}</b> anos</span></div>
              </div>
            </div>
          </div>
        </div>


        <!--Endereço-->
        <div class="row">
          <div class="col-md-8">
            <div class="form-group">
              <label for="foneParticipante" class="control-label col-md-3">Telefone:</label>
              <div class="col-md-2">
                <div>
                  <the-mask v-model="participantes.telefone" id="foneParticipante" name="Telefone do Participante" ref="foneParticipante" class="form-control" type="text"
                            :disabled="disable || (_.has(participantes, 'editavel') && participantes.editavel === 0)" :masked="false" :mask="['(##) ####-####', '(##) #####-####']">
                  </the-mask>
                </div>
                <!--<span v-if="errors.first('Telefone do Participante')" class="label label-danger"> {{ errors.first('Telefone do Participante') }}</span>-->
              </div>
            </div>
          </div>
        </div>

        <!--Sexo-->
        <div class="row">
          <div class="col-md-8">
            <div class="form-group required-field"
                 :class="{ 'has-error' : errors.first('Sexo do Participante')}">
              <label for="sexoParticipante" class="control-label col-md-3">Gênero:</label>
              <div class="col-md-2">
                <div>
                  <select v-model="participantes.sexo" id="sexoParticipante" name="Sexo do Participante" class="form-control" v-validate="'required'" ref="sexoParticipante" :disabled="disable || (_.has(participantes, 'editavel') && participantes.editavel === 0)">
                    <option value="Masculino">Masculino</option>
                    <option value="Feminino">Feminino</option>
                    <option value="Não Binário">Não Binário</option>
                  </select>
                </div>
                <span v-if="errors.first('Sexo do Participante')" class="label label-danger"> {{ errors.first('Sexo do Participante') }}</span>
              </div>
            </div>
          </div>
        </div>

        <!--Escolaridade-->
        <div class="row">
          <div class="col-md-8">
            <div class="form-group required-field"
                 :class="{ 'has-error' : errors.first('Escolaridade do Participante')}">
              <label for="escParticipante" class="control-label col-md-3">Escolaridade:</label>
              <div class="col-md-3">
                <div>
                  <select v-model="participantes.escolaridade" id="escParticipante" name="Escolaridade do Participante" class="form-control" :disabled="disable || (_.has(participantes, 'editavel') && participantes.editavel === 0)" v-validate="'required'" ref="escParticipante">
                    <option value="Analfabeto">Analfabeto</option>
                    <option value="Ensino Fundamental">Ensino Fundamental</option>
                    <option value="Ensino Médio">Ensino Médio</option>
                    <option value="Superior Incompleto">Superior Incompleto</option>
                    <option value="Superior Completo">Superior Completo</option>
                    <option value="Pós-graduação">Pós-graduação</option>
                  </select>
                </div>
                <span v-if="errors.first('Escolaridade do Participante')" class="label label-danger"> {{ errors.first('Escolaridade do Participante') }}</span>
              </div>
            </div>
          </div>
        </div>
        <!--UF-->
        <div class="row">
          <div class="col-md-8">
            <div class="form-group required-field"
                 :class="{ 'has-error' : errors.first('ufParticipante')}">
              <label for="ufParticipante" class="control-label col-md-3">UF:</label>
              <div class="col-md-3">
                <div>
                  <select v-model="participantes.UF" class="form-control" name="ufParticipante" id="ufParticipante" v-validate="'required'" @change="carregaMunicipios(participantes.UF)" :disabled="disable || (_.has(participantes, 'editavel') && participantes.editavel === 0)">
                    <option :value="participantes.UF" :selected="participantes.UF">{{participantes.UF}}</option>
                    <option v-for="uf in estados" :value="uf">{{uf}}</option>
                  </select>
                </div>
                <span v-if="errors.first('ufParticipante')" class="label label-danger"> {{('O campo UF do participante é obrigatório') }}</span>
              </div>
            </div>
          </div>
        </div>

        <!--Município-->
        <div class="row">
          <div class="col-md-8">
            <div class="form-group required-field"
                 :class="{ 'has-error' : errors.first('munParticipante')}">
              <label for="munParticipante" class="control-label col-md-3">Municipio:</label>
              <div class="col-md-3">
                <div>
                  <multiselect v-model="participantes.municipio" :options="municipios"
                               id="munParticipante"
                               :multiple="false"
                               :disabled="!participantes.UF || disable || (_.has(participantes, 'editavel') && participantes.editavel === 0)"
                               :close-on-select="true"
                               :clear-on-select="true"
                               :hide-selected="false"
                               :preserve-search="true"
                               placeholder="Selecione um Município"
                               track-by="codigo"
                               :custom-label="etiquetaListaMunicipios"
                               :preselect-first="false"
                               selectLabel=""
                               deselectLabel=""
                               selectedLabel="Selecionado"
                               name="munParticipante"
                               v-validate="'required'">
                    <span slot="noResult"><font color="red">Nenhum registro localizado!</font></span>
                  </multiselect>
                </div>
                <span v-if="errors.first('munParticipante')" class="label label-danger"> {{('O campo Município do participante é obrigatório') }}</span>
              </div>
            </div>
          </div>
        </div>
        <!--Definição Público-alvo-->
        <!-- 69906 - Definicao de publico alvo -->
        <!-- 71467 - Correção no parametro de id_proposta -->
        <div class="descricao-publico-alvo-container">
            <publicoAlvoDescricao 
              ref="publicoAlvoDescricao" 
              :proposta="propsRelatorio.id_proposta" 
              :idParticipante="idParticipante"
              :fixado="true" 
              :permiteEditar="permiteEditarDescricao"
              :abrirAbas="true" 
              :telaParticipante="true" 
              tipoDescricao="REALIZADO" 
              @descricaoParticipanteDefs="descricaoParticipante = $event"
              :dataNascimentoEdit="dt_nascimento_participante"
              :sexoEdit="participantes.sexo"
              :escolaridadeEdit="participantes.escolaridade"
              />
        </div>
        <!-- Botões -->
        <div class="row container-botoes">
          <div class="col-md-8">
            <div class="form-group">
              <div class="col-md-8">
                <button @click="onAdd" type="button" v-if="!(disable || (_.has(participantes, 'editavel') && participantes.editavel === 0))"
                        class="btn btn-confirm btn-flat" id="proposal-team-add">
                  <i class="fa fa-check" aria-hidden="true"></i> Ok
                </button>
                <button @click="onCancel" type="button"
                        class="btn btn-back btn-flat" id="proposal-team-cancel">
                  <i class="fa fa-times-circle" aria-hidden="true"></i> Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>

      </div>

    </div>



  </div>


</template>

<script>
  import moment from 'moment'
  import publicoAlvoDescricao from './publicoAlvoDescricao.vue'
  export default {
    name: 'listaParticipantes',
    components: {
      publicoAlvoDescricao
    },
    data () {
      return {
        showgrid: true,
        nomeExcel: '',
        table: {
          items: [],
          bloqueioCampos: false,
          filter: null,
          hover: true,
          bordered: true,
          currentPage: 1,
          perPage: 5,
          fields: [
            {key: 'nome', label: 'Nome', sortable: true, thStyle: 'text-align: center; width: 30%', class: 'text-center'},
            {key: 'cpf', label: 'CPF', sortable: true, thStyle: 'text-align: center; width: 10%', class: 'text-center'},
            {key: 'data_nascimento', label: 'Data de Nascimento', sortable: true, thStyle: 'text-align: center; width: 10%', class: 'text-center'},
            // {key: 'endereco', label: 'Endereço', sortable: true, thStyle: 'text-align: center; width: 13%', class: 'text-center'},
            {key: 'telefone', label: 'Telefone', sortable: true, thStyle: 'text-align: center; width: 10%', class: 'text-center'},
            // {key: 'idade', label: 'Idade', sortable: true, thStyle: 'text-align: center; width: 5%', class: 'text-center'},
            {key: 'sexo', label: 'Sexo', sortable: true, thStyle: 'text-align: center; width: 10%', class: 'text-center'},
            {key: 'escolaridade', label: 'Escolaridade', sortable: true, thStyle: 'text-align: center; width: 15%', class: 'text-center'},
            { key: 'actions', label: 'Ações', thStyle: 'text-align: center; width: 15%', class: 'text-center' }
          ]
        },
        json_data: [],
        json_fields: {
          'Nome': 'nome',
          'CPF': 'cpf',
          'Data_Nascimento': 'data_nascimento',
          'Telefone': 'telefone',
          'Sexo': 'sexo',
          'Escolaridade': 'escolaridade',
          'UF': 'municipio.uf',
          'Cidade': 'municipio.nome'
        },
        json_meta: [
          [{
            'key': 'charset',
            'value': 'utf-8'
          }]
        ],
        participantes: {
          telefone: ''
        },
        participantesTable: {},
        editandoIndex: null,
        dt_nascimento_participante: '', // Variável para formatar o campo
        estados: ['AC', 'AL', 'AM', 'AP', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MG', 'MS', 'MT', 'PA', 'PB', 'PE', 'PI', 'PR', 'RJ', 'RN', 'RO', 'RR', 'RS', 'SC', 'SE', 'SP', 'TO'],
        municipios: [],
        descricaoParticipante: [],
        idParticipante: null,
        permiteEditarDescricao: true
      }
    },
    props: ['propsParticipantes', 'disable', 'propsRelatorio', 'usuarioLogado', 'idRelatorio', 'idProposta'],
    watch: {
      propsParticipantes: function () {
        this.table.items = this.propsParticipantes || []
        this.table.totalRows = this.table.items.length
        this.json_data = this.table.items
        this.totalizaParticipantes()
      },
      dt_nascimento_participante: function (val) {
        let newdate = moment(val, 'DD/MM/YYYY', true)
        if (newdate.isValid()) {
          this.participantes.data_nascimento = newdate.format('YYYY-MM-DD')
        }
      }
    },
    computed: {
      calculaIdade () {
        let anoAtualFormatada = moment().format('YYYY')
        let idade = 0
        let dtNascimento = moment(this.dt_nascimento_participante, 'DD/MM/YYYY', true)
        if (dtNascimento.isValid()) {
          let anoNascimento = moment(dtNascimento).format('YYYY')
          idade = anoAtualFormatada - anoNascimento
        }
        return idade
      }
    },
    created () {
      this.nomeExcel = 'Lista de participantes' + '_Projeto:' + this.$route.params.row.item.numero + '_Relatório:' + this.$route.params.row.item.sequencia + '.xls'
    },
    methods: {
      onCancel () {
        this.participantes = {}
        this.showgrid = true
        this.editandoIndex = null
        this.dt_nascimento_participante = ''
      },
      onAdd () {
        this.$validator.validateAll().then((result) => {
          if (result) {
            if (!_.has(this.participantes, 'editavel')) {
              this.participantes['editavel'] = 1
            }
            // Se estiver em forma de edição então adiciona na tabela
            if (this.editandoIndex !== null) {
              for (let i in this.participantes) this.participantesTable[i] = this.participantes[i]
              // Salva Definições
              this.$refs.publicoAlvoDescricao.salvarSelecao()
            } else {
              // Verifica se o cpf já está cadastrado na listagem
              if (this.table.items) {
                this.table.items.forEach((item) => {
                  if (item.cpf) {
                    if (item.cpf.toString() === this.participantes.cpf) {
                      this.cpfExiste = true
                    } else {
                      this.cpfExiste = false
                    }
                  }
                })
              }
              if (this.cpfExiste === true) {
                this.$snotify.error('CPF já está cadastrado na lista de participantes!')
                return
              } else {
                // Cria objeto de definicao de publico-alvo
                // 69906 - Definicao de publico alvo
                if (this.descricaoParticipante.length === 0) {
                  this.descricaoParticipante = [32]
                }
                let definicao = {
                  proposta: this.propsRelatorio.id_proposta,
                  tipo: 'REALIZADO',
                  definicoes: this.descricaoParticipante
                }
                this.participantes.definicoes = definicao
                this.table.items.push(this.participantes)
                this.$emit('participantesAdicionado', this.table.items)
                this.totalizaParticipantes()
                this.json_data = _.cloneDeep(this.table.items)
                this.onCancel()
              }
            }
            this.onCancel()
          }
        })
      },
      totalizaParticipantes () {
        let vm = this
        let totais = {}
        let jovens = _.countBy(this.table.items, function (p) {
          return _.inRange(vm.calcIdade(p.data_nascimento), 14, 29)
        })
        let mulheres = _.countBy(this.table.items, function (p) {
          return p.sexo === 'Feminino'
        })
        totais['participantes'] = _.isEmpty(this.table.items) ? 0 : this.table.items.length
        totais['jovens'] = _.isNil(jovens['true']) ? 0 : jovens['true']
        totais['mulheres'] = _.isNil(mulheres['true']) ? 0 : mulheres['true']
        this.$emit('totalizadores', totais)
      },
      calcIdade (nascimentoParticipante) {
        let anoAtualFormatada = moment().format('YYYY')
        let idade = 0
        let dtNascimento = moment(nascimentoParticipante, 'YYYY-MM-DD', true)
        if (dtNascimento.isValid()) {
          let anoNascimento = moment(dtNascimento).format('YYYY')
          idade = anoAtualFormatada - anoNascimento
        }
        return idade
      },
      exclui (row) {
        this.table.items.splice(row.index, 1)
        this.json_data = _.cloneDeep(this.table.items)
      },
      edita (row) {
        this.permiteEditarDescricao = true
        this.editandoIndex = row.index
        this.carregaMunicipios(row.item.UF)
        this.participantes = _.cloneDeep(row.item)
        this.participantesTable = row.item
        this.showgrid = false
        this.dt_nascimento_participante = moment(this.participantes.data_nascimento).format('DD/MM/YYYY')
        this.idParticipante = row.item.id
        this.totalizaParticipantes()
      },
      soNumeros ($event) {
        let keyCode = ($event.keyCode ? $event.keyCode : $event.which)
        if ((keyCode < 48 || keyCode > 57)) {
          $event.preventDefault()
        }
      },
      carregaMunicipios (uf) {
        this.participantes.municipio = null
        this.municipios = []
        let cod = this.participantes.codigo_municipio
        console.log('cod', cod)
        axiosLaravel.get('municipios/' + uf).then((response) => {
          this.municipios = response.data
          let arr = this.municipios
          if (cod > 0) {
            this.selecionado = _.filter(arr, function (o) {
              if (o.codigo === cod) return o
            })
            this.participantes.municipio = this.selecionado
          }
        })
      },
      etiquetaListaMunicipios (option) {
        return `${option.nome}`
      },
      // 67257 - Buscar participantes do relatório de execução
      async buscarParticipantes () {
        await axiosLaravel.get('/relatorio_execucao/participantes/' + this.idRelatorio).then((response) => {
          this.table.items = response.data || []
          this.$emit('participantesAdicionado', this.table.items)
          this.table.totalRows = this.table.items.length
          this.json_data = this.table.items
          this.totalizaParticipantes()
          console.log(response.data)
        })
          .catch((error) => {
            console.log('error', error)
            this.$snotify.clear()
            this.$root.trataErro(error)
          })
      },
      // Reseta id participante
      // 69906 - Definicao de publico alvo
      novoParticipante () {
        this.showgrid = !this.showgrid
        this.idParticipante = null
      },
      visualiza (row) {
        this.edita(row)
        this.permiteEditarDescricao = false
      }
    }
  }
</script>

<style>
  .multiselect__select {
    width: 30px !important;
    height: 33px !important;
    text-align: right !important;
  }
  .descricao-publico-alvo-container {
    width: 100%;
    padding: 20px;
  }

  .container-botoes {
    padding-left: 30px;
  }
</style>
