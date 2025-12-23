<template>
  <div class="box-body" ref="form">

    <div v-show="loading" class="overlay" style="position: absolute; top: 0px; left: 0px; width: 100%; height: 100%; display: block;">
      <i class="fa fa-refresh fa-spin"></i>
    </div>

    <div v-if="!loading" v-show="showgrid">

      <div class="row">
        <div class="col-md-12">
          <div class="col-sm-4">
            <button @click="irMetas" :title="'<h5>Ir para Metas</h5>'" v-tippy="{ inertia : true, arrow : true,  placement : 'top', animation : 'perspective', distance:'1', size: 'large', arrow : true }" type="button" class="btn btn-primary btn-flat"><i class="" aria-hidden="true"></i> <span style="font-family:Arial; font-size: small"> Metas</span></button>
            <button @click="irAtividades" :title="'<h5>Ir para Atividades</h5>'" v-tippy="{ inertia : true, arrow : true,  placement : 'top', animation : 'perspective', distance:'1', size: 'large', arrow : true }" type="button" class="btn btn-primary btn-flat"><i class="" aria-hidden="true"></i> <span style="font-family:Arial; font-size: small"> Atividades</span></button>
          </div>
          <div class="col-sm-4">
            <input v-model="table.filter" type="text" class="form-control ng-pristine ng-untouched ng-valid ng-empty" placeholder="Pesquisa...">
          </div>
          <!-- 69223 - Alteração da posição dos botões SALVAR e NOVO REGISTRO -->
          <div align="right" class="col-sm-4">
            <button :disabled="contador === 0" @click="salvar" :title="'<h5>Salvar</h5>'" v-tippy="{ inertia : true, arrow : true,  placement : 'top', animation : 'perspective', distance:'1', size: 'large', arrow : true }" type="button" class="btn btn-success btn-flat"><i class="fa fa-floppy-o" aria-hidden="true"></i> <span style="font-family:Arial; font-size: small"> Salvar</span></button>
            <button @click="showgrid = !showgrid" @click.stop="onNew" :title="'<h5>Novo registro</h5>'" v-tippy="{ inertia : true, arrow : true,  placement : 'top', animation : 'perspective', distance:'1', size: 'large', arrow : true }" type="button" class="btn btn-success btn-flat"><i class="fa fa-plus-circle" aria-hidden="true"></i> <span style="font-family:Arial; font-size: small"> Novo registro</span></button>
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
              <b-table
                id="tabelaAlteracao"
                ref="tabelaAlteracao"
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
                @row-clicked="linha"
                empty-text="Nenhum registro encontrado"
              >
                <template slot="actions" scope="row">
                  <div>
                    <div v-if="!temId(row.item.detalhamento)">
                      <button type="button" :disabled="false" @click.stop="edita(row)" class="btn btn-primary btn-sm btn-flat"><i class="fa fa-pencil-square-o" aria-hidden="true"></i> Editar</button>
                    </div>
                  </div>
                </template>
                <template slot="tipo" scope="row">
                  <span>{{row.value.descricao}}</span>
                </template>
                <template slot="motivo" scope="row">
                  <span>{{row.value.descricao}}</span>
                </template>
                <template slot="responsavel.ds_nome_usuario" scope="row">
                  <span>{{row.value}}</span>
                </template>
                <template slot="documentos" scope="row">
                  <!--<div v-for="item of row.value">-->
                    <!--<span v-if="item.id"><a @click="onDownload(item)" href="javascript:void(0)" class="ng-binding"><i class="fa fa-download" aria-hidden="true"></i> {{item.ds_nome_arquivo}}</a></span>-->
                    <!--<span v-else> {{item.ds_nome_arquivo}}</span>-->
                  <!--</div>-->
                  <i v-if="row.item.documentos.length > 0" class="glyphicon glyphicon-duplicate"
                     :title="'<h5>Existe(m) ' + '<b>' + row.item.documentos.length + '</b>' +' documento(s) em anexo. Clique em editar para visualizar o(s) documento(s).</h5>'"
                     v-tippy="{ inertia : true, arrow : true,  animation : 'perspective', distance:'1', size: 'large', arrow : true }"
                     aria-en="true" style="font-size: large;">
                  </i>
                </template>
                <template slot="detalhamento" scope="row">
                  <span v-if="temId(row.item.detalhamento)" @click="abrirLink('/solicitacao/alteracoesprojeto/' + temId(row.item.detalhamento), true)" class="grupoMostrarOcultar">{{ temId(row.item.detalhamento) }} <i class="fa fa-external-link"></i></span>
                  <span v-html="(row.item.detalhamento).replace('#' + temId(row.item.detalhamento) + '# ', '')"></span>
                </template>
                <template slot="dt_registro" scope="row">
                  {{row.value | moment("L")}}</template>
                <template slot="prazo" scope="row">{{row.value | moment("L")}}</template>
                <template slot="id_processo" scope="row">
                  <div class="linkProcesso">
                    <router-link :to="{name: 'solicitacao-alteracoes-projeto-visualizacao', params: {id: row.value}}">{{row.value}}</router-link>
                  </div>
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
    <div v-if="!showgrid" style="margin: 0px" class="form-horizontal row well well-sm no-shadow animated fadeInDownOutUp" name="frmAddAt">
      <div class="col-md-6">

        <!--Data-->
        <div class="form-group required-field"
             :class="{ 'has-error' : errors.first('data')}">
          <label for="data" class="control-label col-md-2">Data:</label>
          <div class="col-md-4">
            <div v-if="alteracao.id">
              <datepicker ref="data" name="data" v-model="alteracao.dt_registro" input-class="form-control"
                          :language="$datePickerPtBR" maxlength="20"  placeholder="__ /__ /____" :highlighted="highlighted" :disabled="alteracao.id"
                          format="dd/MM/yyyy" v-validate="'required'">
              </datepicker>
            </div>
            <div v-if="!alteracao.id">
              <datepicker ref="data" name="data" v-model="alteracao.dt_registro" input-class="form-control datepicker"
                          :language="$datePickerPtBR" maxlength="20"  placeholder="__ /__ /____" :highlighted="highlighted" :disabled="alteracao.id"
                          format="dd/MM/yyyy" v-validate="'required'">
              </datepicker>
            </div>
            <span v-if="errors.first('data')" class="label label-danger"> {{ errors.first('data') }}</span>
          </div>
        </div>
        <!-- Tipo -->
        <div class="form-group required-field"
             :class="{ 'has-error' : errors.first('tipo')}">
          <label for="tipo" class="control-label col-md-2">Tipo:</label>
          <div class="col-md-8">
            <div>
              <multiselect v-model="alteracao.tipo" :options="tipos"
                           :multiple="false"
                           :close-on-select="true"
                           :clear-on-select="true"
                           :hide-selected="false"
                           :preserve-search="true"
                           placeholder="Selecione um Tipo de Alteração"
                           track-by="codigo"
                           :custom-label="etiquetaTipos"
                           @select="onSelect($event, alteracao.tipo)"
                           :preselect-first="false"
                           selectLabel=""
                           deselectLabel=""
                           selectedLabel="Selecionado"
                           name="tipo"
                           :disabled="alteracao.id"
                           data-vv-as="Tipo de alteração"
                           v-validate="'required'">
                <span slot="noResult"><font color="red">Nenhum registro localizado!</font></span>
              </multiselect>
            </div>
            <span v-if="errors.first('tipo')" class="label label-danger"> {{ errors.first('tipo') }}</span>
          </div>
        </div>
        <!-- Detalhamento Ant -->
        <div class="form-group">
          <label for="detalhamentoBloq" class="control-label col-md-2">Histórico Detalhe:</label>
          <div class="col-md-8">
            <div>
              <font v-html="alteracao.detalhamento"></font>
            </div>
          </div>
        </div>
        <!-- Detalhamento -->
        <div class="form-group required-field"
             :class="{ 'has-error' : errors.first('detalhamento')}">
          <label for="detalhamento" class="control-label col-md-2">Detalhe:</label>
          <div class="col-md-8">
            <div>
              <textarea v-model="detalhamentoAnt" :placeholder="place" name="detalhamento" class="form-control" type="text" maxlength="1000" cols="10" rows="8" v-validate="'required'">
              </textarea>
            </div>
            <span v-if="errors.first('detalhamento')" class="label label-danger"> {{ errors.first('detalhamento') }}</span>
          </div>
        </div>
        <!--Motivo-->
        <div class="form-group required-field"
             :class="{ 'has-error' : errors.first('motivo')}">
          <label for="motivo" class="control-label col-md-2">Motivo:</label>
          <div class="col-md-8">
            <!-- 66888 - Desativar edicao de arquivos para Prorrogacao de Prazo -->
            <multiselect v-model="alteracao.motivo" :options="motivos"
                         :multiple="false"
                         :close-on-select="true"
                         :clear-on-select="true"
                         :hide-selected="false"
                         :preserve-search="true"
                         placeholder="Selecione um Motivo"
                         track-by="codigo"
                         :custom-label="etiquetaMotivos"
                         :preselect-first="false"
                         selectLabel=""
                         deselectLabel=""
                         selectedLabel="Selecionado"
                         name="tipo"
                         data-vv-as="Motivo da alteração"
                         v-validate="'required'"
                         :disabled="prorrogacaoEdit">
              <span slot="noResult"><font color="red">Nenhum registro localizado!</font></span>
            </multiselect>
          </div>
          <span v-if="errors.first('motivo')" class="label label-danger"> {{ errors.first('motivo') }}</span>
        </div>
        <!-- Responsável -->
        <div class="form-group required-field"  v-if="alteracao.responsavel.ds_nome_usuario">
          <label for="responsavel" class="control-label col-md-2">Responsável:</label>
          <div class="col-md-8">
            <div>
              <input v-model="alteracao.responsavel.ds_nome_usuario" name="responsavel" class="form-control" type="text" maxlength="255" :disabled="true"/>
            </div>
          </div>
        </div>
        <!-- Anexos -->
        <div class="form-group">
          <label for="responsavel" class="control-label col-md-2">Anexos:</label>
          <div class="col-md-10">
            <div>
              <!-- 66888 - Desativar exclusão de anexo para Alterações no Projeto/Demais Ajustes -->
              <!-- 66888 - Desativar edicao de arquivos para Prorrogacao de Prazo -->
              <upload-documentos-php-novo :propDocumentos="alteracao.documentos" :documentTypes="''" :disable="''" :localUso="'TODOS'" :salvouOK="salvouOK" :editandoAlteracaoProjeto="editandoItem" :editandoProrrogacao="prorrogacaoEdit"></upload-documentos-php-novo>
            </div>
          </div>
        </div>
        <div><br><br></div>
        <!-- Botões -->
        <div class="form-group" style="margin-bottom:0">
          <div class="col-md-8 col-md-offset-2">
            <g-button-ujarak color="success" size="button--size-ss" @click.native="onAdd(frmAddAt)"><i class="fa fa-check" aria-hidden="true"></i> Ok</g-button-ujarak >
            <g-button-ujarak color="warning" size="button--size-ss" @click.native="onCancel(frmAddAt)"><i class="fa fa-times-circle" aria-hidden="true"></i> Cancelar</g-button-ujarak>
          </div>
        </div>

      </div>
    </div>
  </div>


</template>

<script>
  import { mapGetters } from 'vuex'
  import UploadDocumentosPhpNovo from '../modules/uploadDocumentosPhpNovo'
  import moment from 'moment'

  export default {
    components: {
      UploadDocumentosPhpNovo
    },
    name: 'alteracoesProjetos',
    data () {
      return {
        disabledDates: {
          customPredictor: function (date) {
            if (date.getDate() < new Date().getDate()) {
              return true
            }
          }
        },
        highlighted: {
          customPredictor: function (date) {
            let d1 = moment(date).format('YYYYMMDD')
            let d2 = moment(new Date()).format('YYYYMMDD')
            if (d1 === d2) {
              return true
            }
          }
        },
        loading: true,
        numero: null,
        projeto: [],
        contador: 0,
        objBackend: [],
        atProp: [],
        place: '',
        mostraOcor: false,
        editandoIndex: null,
        alteracao: {
          documentos: []
        },
        detalhamentoAnt: '',
        salvouOK: false,
        dadosTime: [],
        documento: [],
        showgrid: true,
        table: {
          items: [],
          bloqueioCampos: false,
          filter: null,
          hover: true,
          bordered: true,
          currentPage: 1,
          perPage: 10,
          sortBy: 'dt_registro',
          sortDesc: true,
          alteracaoTable: [],
          fields: [
            {key: 'id', label: 'id', sortable: true, thStyle: 'text-align: center; width: 50px', class: 'text-center'},
            {key: 'dt_registro', label: 'Data', sortable: true, thStyle: 'text-align: center; width: 5%', class: 'text-center'},
            {key: 'tipo', label: 'Tipo', sortable: true, thStyle: 'text-align: center; width: 15%', class: 'text-center'},
            {key: 'detalhamento', label: 'Detalhe', sortable: true, thStyle: 'text-align: left; width: 50%', class: 'text-left'},
            {key: 'motivo', label: 'Motivo', sortable: true, thStyle: 'text-align: center; width: 10%', class: 'text-center'},
            {key: 'responsavel.ds_nome_usuario', label: 'Responsavel', sortable: true, thStyle: 'text-align: center; width: 15%', class: 'text-center'},
            {key: 'id_processo', label: 'Processo', thStyle: 'text-align: center; width: 5%', class: 'text-center'},
            {key: 'documentos', label: 'Anexos', sortable: true, thStyle: 'text-align: center; width: 5%', class: 'text-center'},
            {key: 'actions', label: 'Ações', thStyle: 'text-align: center; width: 5%', class: 'text-center'}
          ]
        },
        prorrogacaoEdit: false
      }
    },
    props: ['ParmProjetos', 'ParmAlteracao', 'filtro'],
    watch: {
      ParmProjetos: function () {
        this.projeto = this.ParmProjetos
      },
      filtro: function () {
        this.table.filter = this.filtro
        this.$nextTick(() => {
          this.$parent.$refs['alteracoes'].scrollIntoView()
        })
      }
    },
    computed: {
      // Busca dados do usuário que está logado
      ...mapGetters([
        'usuarioLogado'
      ]),
      // 66888 - Desativar exclusão de anexo para Alterações no Projeto/Demais Ajustes
      editandoItem () {
        if (this.editandoIndex != null) {
          return true
        } else {
          return false
        }
      }
    },
    mounted () {
    },
    created () {
      this.numero = this.$route.params.numero
      if (this.numero) {
        this.projeto = this.ParmProjetos
        this.buscaAlteracaoProp()
        this.buscaTipos()
        this.alteracao.responsavel.ds_nome_usuario = this.usuarioLogado.userName
      }
    },
    methods: {
      buscaTipos () {
        axiosLaravel.get('tipo-registros/').then((response) => {
          this.tipos = _.filter(response.data, function (tipo) {
            // 66888/68639 - Alteracao de periodo de execucao do projeto
            return tipo.grupo === 'ALTERACAO' && (tipo.codigo !== 'PRORROGACAO_DE_PRAZO' || _.includes(['ALTERACAO_DA_FORMA_DE_LIBERACAO_DOS_RECURSOS', 'OUTRAS_ALTERACOES'], tipo.codigo))
          })
          this.motivos = _.filter(response.data, ['grupo', 'ALTERACAO_MOTIVO'])
        })
          .catch((error) => {
            console.log('error', error)
            this.$root.trataErro(error)
          })
      },
      temId (detalhamento) {
        return detalhamento.substr(0, 1) === '#' ? _.chain(detalhamento).split('#').nth(1).trim().value() : false // retorna o id (integer) ou false ou undefined
      },
      abrirLink (caminho, novaJanela) {
        window.open(location.protocol + '//' + location.host + caminho, (novaJanela ? '_blank' : '_self'))
      },
      etiquetaTipos (option) {
        return `${option.descricao}`
      },
      etiquetaMotivos (option) {
        return `${option.descricao}`
      },
      onSelect (selectedOption, tipos) {
        this.place = 'Descreva de forma assertiva a justificativa para a alteração realizada.\n' +
          'Exemplos: \n' +
          '1. O excesso de chuvas prejudicou a realização das oficinas de campo. Desse modo o prazo de execução será prorrogado em 4 meses para conclusão das atividades.\n' +
          '2. Tendo em vista a economicidade observada durante a execução do projeto, que resultou em sobra de recursos, elevamos de 80 para 90 a quantidade de barraginhas a serem implementadas.'
      },
      linha (data) {
        let vm = this
        vm.eventData = data
        vm.$events.emit('linhaSelecionada', vm.eventData)
      },
      buscaAlteracaoProp () {
        this.loading = true
        axiosLaravel.get('/alteracao/' + this.numero).then((response) => {
          this.atProp = response.data
          this.table.items = this.atProp
          this.table.totalRows = this.table.items.length
          this.loading = false
          this.$refs.tabelaAlteracao.refresh()
        })
          .catch((error) => {
            console.log('error', error)
            this.$root.trataErro(error)
          })
      },
      onCancel () {
        this.alteracao = {}
        this.showgrid = true
        this.editandoIndex = null
        this.mostraOcor = false
        this.$nextTick(() => {
          this.$refs['form'].scrollIntoView()
        })
      },
      onNew () {
        this.alteracao = {}
        this.alteracao.documentos = []
        this.alteracao.documentos = []
        this.alteracao.responsavel = {}
        this.alteracao.responsavel.ds_nome_usuario = this.usuarioLogado.userName
        this.editandoIndex = null
        this.alteracao.detalhamento = ''
        this.detalhamentoAnt = ''
        this.$emit('atualizarTimeline', new Date())
        this.$refs.tabelaAlteracao.refresh()
        this.$nextTick(() => {
          this.$parent.$refs['alteracoes'].scrollIntoView()
        })
      },
      onAdd () {
        let currentDate = new Date()
        let aux = this.usuarioLogado.userName
        this.objBackend = []
        this.alteracao.responsavel.ds_nome_usuario = this.usuarioLogado.userName
        this.alteracao.fk_usuario_responsavel = this.usuarioLogado.id
        this.$validator.validateAll().then((result) => {
          if (result) {
            this.alteracao.detalhamento = this.alteracao.detalhamento + '- <b>' + this.detalhamentoAnt + '</b> <br><i>(' + aux + ', ' + moment(currentDate).format('DD/MM/YYYY') + ')' + '</i><br>'
            // Se estiver em forma de edição então adiciona na tabela
            if (this.editandoIndex !== null) {
              for (let i in this.alteracao) this.tabelaAlteracao[i] = this.alteracao[i]
            } else {
              this.table.items.push(this.alteracao)
            }
            this.objBackend.push(this.atProp)
            this.objBackend.fk_proposta = this.projeto.proposta.id
            this.contador = this.contador + 1
            this.onCancel()
          } else {
            this.$snotify.error('O formulário possui erros. Favor verificar!')
          }
        })
      },
      edita (row) {
        this.detalhamentoAnt = ''
        console.log('ROW', row.item.tipo.codigo)
        // 66888 - Acertos no sistema de atualizacao de periodo de execucao
        if (row.item.tipo.codigo === 'PRORROGACAO_DE_PRAZO') {
          this.prorrogacaoEdit = true
        } else {
          this.prorrogacaoEdit = false
        }
        this.$nextTick(() => {
          this.$refs['form'].scrollIntoView()
        })
        this.editandoIndex = row.index
        this.alteracao = Object.assign({}, row.item)
        this.detalhamentoAnt = ''
        this.tabelaAlteracao = row.item
        this.showgrid = false
      },
      exclui (row) {
        this.table.items.splice(row.index, 1)
        // this.atProp.splice(row.index, 1)
        this.objBackend.push(this.table.items)
      },
      irMetas () {
        this.$nextTick(() => {
          this.$parent.$refs['metas'].scrollIntoView()
          if (_.has(this.$parent, 'mostrar')) this.$parent.mostrar.metas = true
        })
      },
      irAtividades () {
        this.$nextTick(() => {
          this.$parent.$refs['atividades'].scrollIntoView()
          if (_.has(this.$parent, 'mostrar')) this.$parent.mostrar.atividades = true
        })
      },
      onDownload (documento) {
        axiosLaravel.get('documentos/download/' + documento.id, {responseType: 'arraybuffer'}).then((response) => {
          let ie = !!window.MSInputMethodContext && !!document.documentMode
          if (!ie) {
            let blob = new Blob([response.data], { type: documento.ds_content_type })
            let link = document.createElement('a')
            link.href = window.URL.createObjectURL(blob)
            link.download = documento.ds_nome_arquivo
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
          } else {
            var bytes = new Uint8Array(resultByte)
            let blob = new Blob([bytes], { type: documento.ds_content_type })
            let link = document.createElement('blob')
            link.href = window.navigator.msSaveOrOpenBlob(blob, documento.ds_nome_arquivo)
            link.download = documento.ds_nome_arquivo
            link.click()
          }
        })
          .catch((error) => {
            this.$root.trataErro(error)
          })
      },
      salvar () {
        // console.log('this.objBackend', this.objBackend)
        let arr = this.objBackend
        arr = _.map(arr, o => _.extend({fk_proposta: this.projeto.proposta.id}, o))
        this.$snotify.async('Salvando alteração do projeto. Por favor, aguarde...', {timeout: 0})
        axiosLaravel.post('/alteracao/', arr).then((response) => {
          this.salvouOK = true
          this.buscaAlteracaoProp()
          this.$forceUpdate()
          this.$snotify.clear()
          this.$snotify.success('Alteração do projeto gravado com sucesso!')
          this.contador = 0
          this.$emit('atualizarTimeline', new Date())
        })
          .catch((error) => {
            this.$snotify.clear()
            console.log('error', error)
            this.$root.trataErro(error)
          })
      },
      abrirProcesso (idProcesso) {
        this.$router.push({name: 'solicitacao-alteracoes-projeto', params: {id: idProcesso, visualizacao: true}})
      }
    }
  }
</script>

<style>
  #tabelaAlteracao td:nth-of-type(1), #tabelaAlteracao th:nth-of-type(1) {
    display: none;
  }

  .linkProcesso {
    cursor: pointer;
    text-decoration: underline;
    color: #6495ED;
  }

</style>
