<template>
  <div class="content-wrapper" style="min-height: 870px;">

    <vue-headful :title="'SGP - Cadastro de Formulários'"/>

    <div>
      <section class="content-header">
        <h1>Cadastro de Formulários</h1>
        <b-breadcrumb :items="[{text: 'Inicial', href: '/'}, {text: 'Cadastro', href: '#'}, {text: 'Formulários', active: true}]"/>
      </section>

      <section class="content">

        <div class="row" id="listaFormularios">

          <div class="col-md-12">

            <div class="box box-primary">

              <div class="box-header with-border">
                <h3 class="box-title">
                  <i class="fa fa-pencil" aria-hidden="true"></i> Cadastro de formulários <span v-if="!loading.tela" class="info_discreto">{{tabelaFormularios.totalRows}} localizado(s)</span>
                </h3>
              </div>

              <div class="box-body" >
                <div class="row">
                  <div class="box-body">
                    <div class="form-horizontal">

                      <div class="col-md-3">
                        <g-button-ujarak color="primary" size="button--size-ss" type="button" @click.native="$router.push({name: 'edita-formulario', params: {id: null}})"><i class="fa fa-plus-circle" aria-hidden="true"></i> Novo formulário </g-button-ujarak>
                      </div>

                      <div class="col-md-5">
                        <div class="col-md-12">
                          <div class="input-group">
                            <input v-model="pesquisa" type="text" class="form-control" placeholder="Pesquisa..." v-on:keyup="ajustaPesquisa">
                            <span class="input-group-btn">
                              <button :disabled="!tabelaFormularios.filter" @click="tabelaFormularios.filter = ''" type="button" class="btn btn-default btn-flat"><i class="fa fa-search"></i></button>
                            </span>
                          </div>
                        </div>
                      </div>

                      <div class="col-md-4">&nbsp;</div>

                    </div>
                  </div>
                </div>

                <!--Lista de Formulários -->
                <div class="row box-body">
                  <b-container fluid>
                    <b-table show-empty
                             stacked="md"
                             hover
                             :ref="'tabelaDetalhe'"
                             :bordered="tabelaFormularios.bordered"
                             :items="formularios"
                             :fields="camposFormularios"
                             :filter="tabelaFormularios.filter"
                             :filter-function="filtroPorItem"
                             @filtered="onFiltered"
                             :current-page="tabelaFormularios.currentPage"
                             :per-page="tabelaFormularios.perPage"
                             :sort-by.sync="tabelaFormularios.sortBy"
                             :sort-desc.sync="tabelaFormularios.sortDesc"
                             empty-filtered-text="Nada foi encontrado. Refaça sua pesquisa!"
                             empty-text="Nenhum registro encontrado">

                      <template slot="id" scope="row">
                        <span @click="mostrarDetalhes(row)" style="cursor: pointer;">{{row.value}}</span>
                      </template>

                      <template slot="criacao" scope="row">
                        <span @click="mostrarDetalhes(row)" style="cursor: pointer;">
                          {{(_.has(row.item.cadastro, 'inicio') ? row.item.cadastro.inicio : row.item.created_at) | moment("DD/MM/YYYY  HH:mm")}}
                        </span>
                      </template>

                      <template slot="nome" scope="row">
                        <span @click="mostrarDetalhes(row)" style="cursor: pointer;">
                          {{row.value}}
                          <span v-if="row.item.opcoes.vinculo.programas.length > 0" style="font-size: x-small; color: var(--cor-atencao)">
                            <br/>{{_.join(_.map(row.item.opcoes.vinculo.programas, 'descricao'), ' | ')}}
                          </span>
                        </span>

                        <span v-if="!_.isEmpty(row.item.link_acesso)" class="link_acesso" @click="copiaUrl(row)"
                              :title="'<h5>Clique para copiar link para uso externo ao SGP</h5>'" v-tippy="{inertia:true, arrow:true, placement:'top', animation:'perspective', distance:'1', size:'large', arrow:true, delay: [500, 0]}">
                          <br/>{{ _.split(row.item.link_acesso, '-')[0] }}
                          <i class="fa fa-clone"></i>
                          <span v-if="_.has(row.item, 'link_copia')" :class="_.get(row.item, 'link_copia.classe')">{{_.get(row.item, 'link_copia.msg')}}</span>
                        </span>
                      </template>

                      <template slot="tipo" scope="row">
                        <span @click="mostrarDetalhes(row)" style="cursor: pointer;">
                          {{ _.find(tipoFormulario, ['codigo', row.value])['descricao'] }}
                        </span>
                      </template>

                      <template slot="situacao" scope="row">
                        <span v-if="_.includes(['Inativo', 'Ativo'], row.item.situacao)">
                          <div class="indicadores-cb-inline">
                            <div class="juntos" v-if="_.has(row.item, 'situacao')">
                                <i @click="alteraConfiguracaoFormulario(row.item, {situacao: row.item.situacao === 'Ativo' ? 'Inativo' : 'Ativo'})" :class="(row.item.situacao === 'Ativo' ? 'fa fa-check-square-o selecionado' : 'fa fa-square-o')" aria-hidden="true"></i>
                                <span :class="row.item.situacao === 'Ativo' ? 'selecionado' : 'Inativo'">{{row.item.situacao}}</span>
                            </div>
                            <div class="juntos" v-if="_.has(row.item, 'opcoes.bi') && _.includes(['AVALIACAO_APROVACAO', 'AVALIACAO_ENCERRAMENTO'], row.item.tipo)">
                                <i @click="alteraConfiguracaoFormulario(row.item, {'opcoes.bi': !row.item.opcoes.bi})" :class="(row.item.opcoes.bi ? 'fa fa-check-square-o selecionado' : 'fa fa-square-o')" aria-hidden="true"></i>
                                <span :class="row.item.opcoes.bi ? 'selecionado' : 'Inativo'">BI</span>
                            </div>
                          </div>
                        </span>
                        <span v-else style="color: var(--cor-atencao)">Erro</span>
                      </template>

                      <template slot="uso" scope="row" :class="row.item.uso === 0 ? 'text-muted' : ''">
                          {{_.has(detalhamentoFormulario[row.item.id], 'listaProjetosDisponiveis') ?
                              (_.filter(_.get(detalhamentoFormulario, [row.item.id, 'listaProjetosVinculadosFormulario'], []), function(f) { return _.includes(['FEITO', 'EM_EXECUCAO'], f.processo.situacao) && f.andamento !== 'Não iniciado' })).length :
                              row.item.uso}}
                      </template>

                      <template slot="actions" scope="row">
                        <g-button-ujarak color="primary" size="button--size-ss" @click.native="$router.push({name: 'edita-formulario', params: {id: row.item.id}})"
                                         v-if="(_.has(detalhamentoFormulario[row.item.id], 'listaProjetosDisponiveis') ?
                                                 (_.filter(_.get(detalhamentoFormulario, [row.item.id, 'listaProjetosVinculadosFormulario'], []), function(f) { return _.includes(['FEITO', 'EM_EXECUCAO'], f.processo.situacao) && f.andamento !== 'Não iniciado' })).length :
                                                  row.item.uso) === 0"> <i class="fa fa-pencil" aria-label="false"></i> Editar</g-button-ujarak>
                        <g-button-ujarak color="success" size="button--size-ss" @click.native="$router.push({name: 'edita-formulario', params: {id: row.item.id, visualizacao: true}})" v-if="_.includes(['Ativo', 'Inativo'], row.item.situacao)"> <i class="fa fa-search" aria-label="false"></i> Visualizar</g-button-ujarak>
                      </template>


                <!-- Seção de detalhes do formulário que conterá lista de projetos que podem ser vinculados e tabela com projetos vinculados ao formulário detalhado -->
                      <template slot="row-details" scope="row">
                        <div class="row detalhamentoFormulario">
                         <div class="col-md-12">
                          <div v-show="loading.detalhes" class="overlay" style="position: absolute; top: 0px; left: 0px; width: 100%; height: 100%; display: block;"><i class="fa fa-refresh fa-spin"></i></div>

                          <div class="row" v-if="true">
                            <div class="col-md-12">
                              <span v-if="!_.has(detalhamentoFormulario[row.item.id], 'listaProjetosDisponiveis')">
                                <div class="box-header"><i class="fa fa-refresh fa-spin"></i> Projetos que podem receber este formulário ...</div>
                              </span>
                              <span v-else>
                                <div v-if="(_.get(detalhamentoFormulario, [row.item.id, 'listaProjetosDisponiveis'], [])).length === 0" class="box-header bg-info">
                                  Não há projetos disponíveis para enviar este formulário
                                </div>
                                <div v-else class="row">
                                  <div class="col-sm-8" :title="'<h5>Se desejar enviar este formulário para um projeto, então selecione o projeto desejado e clique em Enviar</h5>'" v-tippy="{inertia:true, arrow:true, placement:'top', animation:'perspective', distance:'1', size:'large', arrow:true, delay: [500, 0]}" >

                                    <!-- Listagem de Projetos disponíveis para enviar -->
                                    <multiselect v-model="projetoSelecionadoEnvioManual[row.item.id]"
                                                :options="_.get(detalhamentoFormulario, [row.item.id, 'listaProjetosDisponiveis'], [])"
                                                :multiple="false"
                                                :close-on-select="true"
                                                :placeholder="'Projetos disponíveis para este formulário'"
                                                :custom-label="(option) => { return `${option.ds_codigo_projeto_erp + ' - ' + option.ds_nome}`}"
                                                selectedLabel="selecionado"
                                                selectLabel=""
                                                deselectLabel=""
                                                track-by="ds_codigo_projeto_erp"
                                                label="ds_nome"
                                                name="projetos_disponiveis"
                                                data-vv-as="projetos_disponiveis">

                                      <template slot="option" slot-scope="props">
                                        <div>
                                          <strong>{{props.option.ds_codigo_projeto_erp}}</strong>  {{props.option.ds_nome}} <span class="text-gray"> {{props.option.ds_situacao_erp}} </span>
                                        </div>
                                      </template>

                                      <template slot="noResult" slot-scope="props">
                                        Não encontrei nesta lista de projetos disponíveis
                                      </template>
                                    </multiselect>
                                  </div>


                                  <div class="col-sm-2">
                                    <span v-if="projetoSelecionadoEnvioManual[row.item.id]">
                                      <g-button-ujarak color="primary" size="button--size-ss" @click.native="vincularFormularioAoProjeto(row.item.id)"><i class="fa fa-list-alt" aria-hidden="true"></i> Enviar</g-button-ujarak>
                                    </span>
                                    <span v-else class="info_discreto">
                                      {{(_.get(detalhamentoFormulario, [row.item.id, 'listaProjetosDisponiveis'], [])).length}} projeto(s)
                                    </span>
                                  </div>

                                  <div class="col-sm-2" v-if="(_.get(detalhamentoFormulario, [row.item.id, 'listaProjetosVinculadosFormulario'], [])).length > 0">
                                    <g-button-ujarak color="success" @click.native="exportarExcel(_.get(detalhamentoFormulario, [row.item.id, 'listaProjetosVinculadosFormulario'], []))" size="button--size-ss"
                                       :title="'<h5>Ao clicar será gerado um Excel com todos os <span class=\'realce\'>' + ((_.get(detalhamentoFormulario, [row.item.id, 'listaProjetosVinculadosFormulario'], [])).length) + '</span> formulário(s) preenchido(s) deste modelo</h5>'" v-tippy="{inertia:true, arrow:true, placement:'top', animation:'perspective', distance:'1', size:'large', arrow:true}"><i class="fa fa-download" aria-hidden="true"></i> Excel</g-button-ujarak>
                                  </div>

                                </div>

                              </span>

                            </div>
                          </div>

                          <br/>

                      <!-- Lista de projetos que tem o formulário vinculado que está sendo detalhado -->
                          <span v-if="!_.has(detalhamentoFormulario[row.item.id], 'listaProjetosVinculadosFormulario')">
                            <div class="box-header"><i class="fa fa-refresh fa-spin"></i> Projetos que tem este formulário ...</div>
                          </span>
                          <span v-else>
                            <div class="row" v-if="(_.get(detalhamentoFormulario, [row.item.id, 'listaProjetosVinculadosFormulario'], [])).length > 0">

                              <b-container fluid>
                                <b-table show-empty
                                         striped
                                         :ref="'DETALHAMENTO-' + row.item.id + '(' + numeroAtualizacao + ')'"
                                         :bordered="tabelaDetalhamento.bordered"
                                         :items="_.get(detalhamentoFormulario, [row.item.id, 'listaProjetosVinculadosFormulario'], [])"
                                         :fields="camposDetalhamento"
                                         empty-filtered-text="Nada foi encontrado. Refaça sua pesquisa!"
                                         empty-text="Nenhum registro encontrado"
                                         :sort-by.sync="tabelaDetalhamento.sortBy"
                                         :sort-desc.sync="tabelaDetalhamento.sortDesc"
                                         :current-page="tabelaDetalhamento.currentPage"
                                         :per-page="tabelaDetalhamento.perPage"
                                         :filter="tabelaDetalhamento.filter">

                                  <template slot="processo" scope="row">
                                    {{ row.item.processo.id }}
                                  </template>

                                  <template slot="projeto" scope="row">
                                    <span v-if="_.has(row.item, 'projeto')">
                                      {{ row.item.projeto['ds_codigo_projeto_erp'] + ' - ' + row.item.projeto['ds_nome']}} ( {{ row.item.projeto.ds_situacao_erp }} )
                                      <br/>
                                    </span>

                                    <span>
                                      <span class="link_acesso" @click="copiaUrl(row)" :title="'<h5>Clique para copiar link do formulário para preenchido</h5>'" v-tippy="{inertia:true, arrow:true, placement:'top', animation:'perspective', distance:'1', size:'large', arrow:true, delay: [500, 0]}">
                                        {{row.item['link_externo']}}
                                        <i class="fa fa-clone"></i>
                                        <span v-if="_.has(row.item, 'link_copia')" :class="_.get(row.item, 'link_copia.classe')">{{_.get(row.item, 'link_copia.msg')}}</span>
                                      </span>
                                    </span>

                                  </template>

                                  <template slot="situacao" scope="row">
                                    <span v-if="row.item.processo.situacao === 'CANCELADO'" class="text-danger">Cancelado</span>
                                    <span v-else-if="row.item.processo.situacao === 'FEITO'" class="text-success">Concluído</span>
                                    <span v-else-if="row.item.processo.situacao === 'EM_EXECUCAO'" class="text-blue">Em Execução</span>
                                    <br/>
                                    <span :class="row.item.andamento === 'Não iniciado' ? 'text-gray' : 'text-bold'">
                                      {{row.item.andamento}}
                                    </span>
                                  </template>

                                  <template slot="actions" scope="row">
                                    <span v-if="_.get(row.item, '_rowVariant', '') === 'form-salvando'">Salvando...</span>
                                    <span v-else-if="_.get(row.item, '_rowVariant', '') === 'form-fechando'">Fechando...</span>
                                    <span v-else>
                                      <span v-if="!_.get(row.item, '_rowVariant')">
                                        <g-button-ujarak color="primary" @click.native="abreFormulario(row.item['link_edicao'])" type="button" v-if="row.item.processo.situacao === 'EM_EXECUCAO'"><i class="fa fa-pencil" aria-hidden="true"></i> Preencher</g-button-ujarak>
                                      </span>
                                      <span v-else>Em uso agora!</span>
                                      <g-button-ujarak color="success" @click.native="abreFormulario(row.item['link_visualizacao'])" type="button"><i class="fa fa-search" aria-hidden="true"></i> Visualizar</g-button-ujarak>
                                      <g-button-ujarak color="error"   v-confirm="{ok: retorno => cancelaProcessoPreenchimento(row), cancel: doNothing, message: '<span class=\'avisoAlerta\'>Deseja <b>Cancelar</b> este preenchimento?</span>'}" v-if="row.item.processo.situacao !== 'CANCELADO'" type="button"
                                                       :title="'<h5>Utilize essa opção para cancelar a vinculação</h5>'" v-tippy="{inertia:true, arrow:true, placement:'top', animation:'perspective', distance:'1', size:'large', arrow:true}"><i class="fa fa-ban" aria-hidden="true"></i> Cancelar</g-button-ujarak>
                                    </span>
                                  </template>

                                </b-table>

                                <b-row style="display: flex; align-items: center;">
                                  <b-col md="6" class="my-1" right>
                                    <b-pagination :total-rows="tabelaDetalhamento.totalRows" :per-page="tabelaDetalhamento.perPage" v-model="tabelaDetalhamento.currentPage" class="my-3" />
                                  </b-col>
                                  <b-col md="6" right>
                                    <strong>{{(_.get(detalhamentoFormulario, [row.item.id, 'listaProjetosVinculadosFormulario'], [])).length}}</strong> formulário(s) disponibilizado(s) sendo: <br/>
                                    <span v-for="(forms, situacao) in _.groupBy(_.get(detalhamentoFormulario, [row.item.id, 'listaProjetosVinculadosFormulario'], []), 'processo.situacao')">
                                      <span v-if="situacao === 'CANCELADO'" class="text-danger"><strong>{{ forms.length }}</strong> cancelado(s)  </span>
                                      <span v-if="situacao === 'FEITO'" class="text-success"><strong>{{ forms.length }}</strong> concluído(s)  </span>
                                      <span v-if="situacao === 'EM_EXECUCAO'" class="text-blue"><strong>{{ forms.length }}</strong> em execução(s)  </span>
                                    </span>
                                  </b-col>
                                </b-row>

                              </b-container>

                            </div>
                            <div v-else>
                              Não há prenchimento para este formulário
                            </div>
                          </span>

                        </div>
                        </div>
                      </template>

                    </b-table>

                    <b-row>
                      <b-col md="6" class="my-1" right>
                        <b-pagination :total-rows="tabelaFormularios.totalRows" :per-page="tabelaFormularios.perPage" v-model="tabelaFormularios.currentPage" class="my-3" />
                      </b-col>
                    </b-row>

                  </b-container>

                  <div v-show="loading.tela" class="overlay" style="position: absolute; top: 0px; left: 0px; width: 100%; height: 100%; display: block;"><i class="fa fa-refresh fa-spin"></i></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>

</template>


<script>
  import { mapGetters } from 'vuex'
  import * as XLSX from 'xlsx'
  import moment from 'moment'

  export default {
    name: 'CadastroFormsAvaliacao',
    data () {
      return {
        loading: {
          tela: false,
          detalhes: false
        },
        numeroAtualizacao: 0,
        pesquisa: '',
        hoje: new Date(),
        camposFormularios: [
          { key: 'id', label: 'ID', thStyle: 'width: 5%; text-align: center', sortable: true, 'class': 'text-center' },
          { key: 'criacao', label: 'Criado em', thStyle: 'width: 10%; text-align: center', sortable: true, 'class': 'word-wrap:break-word text-center' },
          { key: 'nome', label: 'Nome', thStyle: 'width: 25%; text-align: center', sortable: true, 'class': 'word-wrap:break-word text-center' },
          { key: 'tipo', label: 'Tipo de formulário', thStyle: 'width: 10%; text-align: center', sortable: true, 'class': 'word-wrap:break-word text-center' },
          { key: 'situacao', label: 'Situação', thStyle: 'width: 15%; text-align: center', sortable: false, 'class': 'word-wrap:break-word text-center' },
          { key: 'uso', label: 'Preenchido', thStyle: 'width: 10%; text-align: center', sortable: false, 'class': 'word-wrap:break-word text-center' },
          { key: 'actions', label: 'Ações', thStyle: 'width: 20%; text-align: center', sortable: false, 'class': 'text-center' }
        ],
        tabelaFormularios: {
          currentPage: 1,
          perPage: 10,
          totalRows: 0,
          sortBy: 'id',
          sortDesc: true,
          filter: null,
          bordered: true
        },
        camposDetalhamento: [
          { key: 'processo', label: 'Processo', thStyle: 'width: 10%; text-align: center', sortable: true, 'class': 'text-center' },
          { key: 'projeto', label: 'Projeto', thStyle: 'text-align: center', sortable: true, 'class': 'word-wrap:break-word text-center' },
          { key: 'situacao', label: 'Situação', thStyle: 'width: 10%; text-align: center', sortable: true, 'class': 'text-center' },
          { key: 'actions', label: 'Ações', thStyle: 'width: 30%; text-align: center', sortable: false, 'class': 'text-center' }
        ],
        tabelaDetalhamento: {
          currentPage: 1,
          perPage: 10,
          totalRows: 0,
          sortBy: 'processo.id',
          sortDesc: true,
          filter: null,
          bordered: true
        },
        tipoFormulario: [{codigo: 'AVALIACAO_APROVACAO', descricao: 'Marco zero'}, {codigo: 'AVALIACAO_ENCERRAMENTO', descricao: 'Marco um'}, {codigo: 'AVALIACAO_GENERICO', descricao: 'Genérico'}, {codigo: 'AVALIACAO_PARTICIPANTE', descricao: 'Participante'}],
        detalhamentoFormulario: {}, // Cada key é o id do formulário no array de formularios. A propriedade (id) é criado a medida que é carregado ao abrir um detalhe do b-table (mostrarDetalhes)
        projetoSelecionadoEnvioManual: {}, // Cada key é o id do formulário no array de formularios. A propriedade (id) é criado a medida que é seleionado um projeto na lista de projeto disponíveis para vincular a um formulário
        formularios: [],
        alertasFormulariosCadastrados: []
      }
    },
    created () {
      this.listaFormsAvaliacao()
    },
    computed: {
      ...mapGetters([
        'usuarioLogado',
        'urlLaravel'
      ])
    },
    mounted: function () {
    },
    methods: {
      assinaCanais () {
        // Notificações do canal dos formulários que estão sendo PREENCHIDOs
        let vm = this
        if (!_.isEmpty(vm.detalhamentoFormulario)) {
          _.forEach(vm.detalhamentoFormulario, function (formCadastroDetalhado) {
            _.get(formCadastroDetalhado, 'listaProjetosVinculadosFormulario', []).forEach((formPreenchido) => {
              let canalFormPreenchimento = 'formulario.preenchido.' + formPreenchido.id
              window.Echo.channel(canalFormPreenchimento)
                .listen('FormularioEvents', (notificacao) => {
                  let form
                  _.forEach(vm.detalhamentoFormulario, function (formCad) {
                    if (form) {
                      return false
                    } else {
                      _.forEach(formCad.listaProjetosVinculadosFormulario, function (formPre) {
                        if (formPre.id === notificacao.id) {
                          form = formPre
                          return false
                        }
                      })
                    }
                  })
                  //
                  if (form) {
                    if (notificacao.mensagem.acao === 'FORMULARIO_ABERTO') {
                      _.set(form, '_rowVariant', 'form-aberto')
                      // _.set(form, 'visualizando', true)
                    } else if (notificacao.mensagem.acao === 'FORMULARIO_FECHADO') {
                      _.set(form, '_rowVariant', 'form-fechando')
                      setTimeout(() => { _.unset(form, '_rowVariant'); vm.numeroAtualizacao += 1 }, 4000)
                    } else if (notificacao.mensagem.acao === 'FORMULARIO_SALVANDO') {
                      _.set(form, '_rowVariant', 'form-salvando')
                      setTimeout(() => { _.set(form, '_rowVariant', 'form-aberto'); vm.numeroAtualizacao += 1 }, 4000)
                      //
                    } else if (notificacao.mensagem.acao === 'FORMULARIO_EDITANDO') {
                      let andamento = _.get(form, 'andamento')
                      _.set(form, 'andamento', 'Preenchendo...')
                      setTimeout(() => { _.set(form, 'andamento', andamento); vm.numeroAtualizacao += 1 }, 800)
                    } else if (notificacao.mensagem.acao === 'PERCENTUAL_PREENCHIDO') {
                      _.set(form, 'andamento', notificacao.mensagem.percentagem)
                    }
                    vm.numeroAtualizacao += 1
                  }
                })
            })
          })
        }
      },
      notificacaoDeFormCadastrado (canal, id, mensagem) {
        let msg = {canal: canal, id: id, mensagem: mensagem}
        axiosLaravel.post('formulario/mensageria', msg).then((response) => {
          if (_.has(response.data, 'codigo') && response.data.codigo === 'OK') {
            console.log('Mensagem enviada!')
          } else {
            console.log('Erro de mensageria!')
          }
        })
          .catch((error) => {
            this.$snotify.clear()
            this.$root.trataErro(error)
          })
      },
      listaFormsAvaliacao () {
        this.loading.tela = true
        axiosLaravel.get('formulario/lista/simples').then((response) => {
          this.formularios = response.data
          this.tabelaFormularios.totalRows = this.formularios.length
          this.verificaIrregularidadesFormsCadastrados()
          this.assinaCanais()
          this.$forceUpdate()
          this.loading.tela = false
        })
          .catch((error) => {
            this.$snotify.clear()
            this.$root.trataErro(error)
            this.loading.tela = false
          })
      },
      verificaIrregularidadesFormsCadastrados () {
        this.formularios.forEach((formulario) => {
          let mesmoNome = _.filter(this.formularios, ['nome', formulario.nome])
          if (mesmoNome.length > 1) {
            this.alertasFormulariosCadastrados.push('Formulários com mesmo nome "' + formulario.nome + '" repetido nos id\'s ' + _.join(_.map(mesmoNome, 'id'), ', '))
          }
        })
        this.formularios.forEach((formulario) => {
          let mesmoTipoEPrograma = _.filter(this.formularios, function (f) {
            return f.tipo === formulario.tipoFormulario
          })
          if (mesmoTipoEPrograma.length > 1) {
            this.alertasFormulariosCadastrados.push('Formulários com mesmo tipo "' + formulario.nome + '" repetido nos id\'s ' + _.join(_.map(mesmoTipoEPrograma, 'id'), ', '))
          }
        })
      },
      mostrarDetalhes (row) {
        row.toggleDetails()
        if (!row.detailsShowing) {
          this.carregarProcessosPreenchimentoPorFormulario(row.item.id)
        }
      },
      carregarProcessosPreenchimentoPorFormulario (idFormulario) {
        this.loading.detalhes = true
        axiosLaravel.get('formulario/' + idFormulario + '/projetos/vinculados').then((response) => {
          if (_.has(response.data, 'codigo') && response.data.codigo === 'OK') {
            _.set(this.detalhamentoFormulario, [idFormulario, 'listaProjetosVinculadosFormulario'], response.data.retorno)
            this.assinaCanais()
          } else {
            this.$snotify.error(response.data.mensagem)
          }
          this.loading.detalhes = false
          this.carregarProjetosDisponiveisPorFormulario(idFormulario)
          this.$forceUpdate()
        })
          .catch((error) => {
            this.loading.detalhes = false
            this.$snotify.clear()
            this.$root.trataErro(error)
          })
      },
      carregarProjetosDisponiveisPorFormulario (idFormulario) {
        axiosLaravel.get('formulario/' + idFormulario + '/projetos/disponiveis').then((response) => {
          if (_.has(response.data, 'codigo') && response.data.codigo === 'OK') {
            _.set(this.detalhamentoFormulario, [idFormulario, 'listaProjetosDisponiveis'], response.data.retorno)
          } else {
            this.$snotify.error(response.data.mensagem)
          }
          this.$forceUpdate()
        })
          .catch((error) => {
            this.$snotify.clear()
            this.$root.trataErro(error)
          })
      },
      vincularFormularioAoProjeto (idFormulario) {
        this.loading.tela = true
        let vm = this
        let projetoSelecionado = _.get(this.projetoSelecionadoEnvioManual, [idFormulario])
        let projetoJaVinculado = _.find(_.get(this.detalhamentoFormulario, [idFormulario, 'listaProjetosVinculadosFormulario']), function (p) {
          // Procura se há projeto igual ao que está sendo vinculado, que esteja em execução e seja do formulário tipo AVALIACAO_APROVACAO ou AVALIACAO_ENCERRAMENTO
          return _.includes(['AVALIACAO_APROVACAO', 'AVALIACAO_ENCERRAMENTO'], _.find(vm.formularios, ['id', idFormulario])['tipo']) && _.has(p.projeto, 'ds_codigo_projeto_erp') && ('' + p.projeto.ds_codigo_projeto_erp) === ('' + projetoSelecionado.ds_codigo_projeto_erp) && _.includes(['EM_EXECUCAO'], p.processo.situacao)
        })
        let formSelecionado = _.find(this.formularios, ['id', idFormulario])
        let msg = projetoJaVinculado
          ? 'Este formulário <br/><b>' + formSelecionado.id + '</b> - <b>' + formSelecionado.nome + '</b><br/>está atualmente vinculado ao projeto <br/><b>' + projetoSelecionado.ds_codigo_projeto_erp + '</b> - <b>' + projetoSelecionado.ds_nome + '</b>.<br/><br/>Somente pode ter um deste tipo por projeto.<br/><br/>Então, se continuar, o formulário atual será cancelado e um novo será vinculado ao projeto!'
          : 'Deseja vincular o formulário <br/><b>' + formSelecionado.id + '</b> - <b>' + formSelecionado.nome + '</b><br/> ao projeto <br/><b>' + projetoSelecionado.ds_codigo_projeto_erp + '</b> - <b>' + projetoSelecionado.ds_nome + '</b>'
        //
        this.$dialog.confirm(msg, {html: true, animation: 'fade', customClass: 'avisoAlerta'})
          .then(dialog => {
            axiosLaravel.post('formulario/vincula/', {'idFormularioCadastrado': idFormulario, 'numeroProjeto': vm.projetoSelecionadoEnvioManual[idFormulario]['ds_codigo_projeto_erp']}).then((response) => {
              if (_.has(response.data, 'codigo') && response.data.codigo === 'OK') {
                this.carregarProcessosPreenchimentoPorFormulario(idFormulario)
                this.loading.tela = false
                this.projetoSelecionadoEnvioManual[idFormulario] = null
              } else {
                this.aviso(response.data)
              }
            })
              .catch((error) => {
                this.loading.tela = false
                this.$root.trataErro(error)
              })
          })
          .catch(() => {
            this.loading.tela = false
            console.log('Cancelou a vinculação do formulário ao projeto')
          })
      },
      abreFormulario (chave) {
        window.open(location.protocol + '//' + location.host + '/formulario/' + chave, '_blank')
      },
      cancelaProcessoPreenchimento (row) {
        this.loading.tela = true
        axiosLaravel.put('formulario/processo/' + row.item.processo.id + '/cancelar/').then((response) => {
          if (_.has(response.data, 'codigo') && response.data.codigo === 'OK') {
            let idFormCadastrado = _.findKey(this.detalhamentoFormulario, function (detalhamentos) {
              return _.find(detalhamentos.listaProjetosVinculadosFormulario, function (formVinculado) {
                return formVinculado.fk_processo === row.item.processo.id
              })
            })
            this.notificacaoDeFormCadastrado('preenchido', row.item.id, {acao: 'FORMULARIO_CANCELADO', valor: null})
            this.carregarProcessosPreenchimentoPorFormulario(idFormCadastrado)
            // row.item.processo.situacao = 'CANCELADO'
          }
          this.loading.tela = false
        })
          .catch((error) => {
            this.loading.tela = false
            this.$root.trataErro(error)
          })
      },
      copiaUrl (row) {
        let link = row.item['link_externo'] || _.split(row.item.link_acesso, '-')[0]
        let linkCompleto = location.protocol + '//' + location.host + '/form/' + link
        navigator.clipboard.writeText(linkCompleto)
          .then(() => {
            _.set(row, 'item.link_copia', {classe: 'label label-success', msg: 'Copiado!'})
            this.$forceUpdate()
            setTimeout(() => { _.unset(row, 'item.link_copia'); this.$forceUpdate() }, 2000)
          })
          .catch(err => {
            _.set(row, 'item.link_copia', {classe: 'label label-danger', msg: 'Erro: ' + err})
            this.$forceUpdate()
          })
      },
      //
      exportarExcel (lista) {
        this.loading.tela = true
        axiosLaravel.post('formulario/completo/', {'lista': _.map(lista, 'fk_processo')}).then((response) => {
          if (_.has(response.data, 'codigo') && response.data.codigo === 'OK') {
            let planilhaPrincipal = []
            response.data.retorno.listaFormulariosPrincipais.forEach((form) => {
              let formularioTemp = {}
              // Adiciona a planilha o ID do Projetoo
              _.set(formularioTemp, 'ID Processo', form['fk_processo'])
              // Adicionará a planilha o Número do Projeto se o processo for de Avaliação de Projeto ou null se for outro processo
              _.set(formularioTemp, 'Nr Projeto', form['processo']['nome'] === 'AVALIACAO_PROJETO' ? form['processo']['documentos_liberacao'][0]['numero'] : null)
              form.formulario.forEach((controle) => {
                if (_.includes(['CONTROLE', 'PERSONALIZADO'], controle.grupo)) {
                  if (!_.isNull(controle.valor)) {
                    if (controle.elemento === 'UF_MUNICIPIO' && _.has(controle.valor, 'nomcid') && _.has(controle.valor, 'sigufs')) {
                      controle.valor = controle.valor.nomcid + ' (' + controle.valor.sigufs + ')'
                    } else if (controle.elemento === 'DATA') {
                      controle.valor = moment(controle.valor).add(1, 'day').format('DD/MM/YYYY')
                    } else if (controle.elemento === 'PERIODO' && _.has(controle.valor, 'inicio') && _.has(controle.valor, 'termino')) {
                      controle.valor = moment(controle.valor.inicio).format('DD/MM/YYYY') + ' - ' + moment(controle.valor.termino).format('DD/MM/YYYY')
                    } else if (controle.elemento === 'LIKERT' && _.values(controle.valor).length > 0) {
                      // O likert já é uma matriz de perguntas e respostas, então aqui já é convertido cada par pergunta x resposta em colunas e linhas para o Excel
                      _.forEach(controle.valor, function (resposta, pergunta) {
                        _.set(formularioTemp, [('' + pergunta).replace(/(<([^>]+)>)/ig, '')], resposta)
                      })
                    } else if (controle.elemento === 'SELECAO_MULTIPLA') {
                      // 65587 - Correção na exportação de excel para componentes de múltipla escolha
                      controle.valor = _.toString(controle.valor)
                    }
                  }
                  if (controle.elemento !== 'LIKERT') { // O Likert já adicionaou as colunas necessárias para cada pergunta dele, acima e não precisa fazer aqui de novo
                    _.set(formularioTemp, [('' + controle.titulo).replace(/(<([^>]+)>)/ig, '')], controle.valor)
                  }
                }
              })
              planilhaPrincipal.push(formularioTemp)
            })
            let principal = XLSX.utils.json_to_sheet(planilhaPrincipal)
            //
            let wb = XLSX.utils.book_new() // Cria a pasta de trabalho (conjunto de planilhas) no Excel
            XLSX.utils.book_append_sheet(wb, principal, 'Formulario Principal') // A primeira planilha será a que contém os dados do formulário
            //
            response.data.retorno.subformularios.forEach((subForm) => {
              // Adiciona as planilhas a pasta de trabalho
              let planilhaSubForm = XLSX.utils.json_to_sheet(subForm.preenchido) // Coverte o json para planilha
              let tituloPlanilhaSubForm = subForm.titulo.substring(0, 30) // Corta o titulo por limitação do Excel
              tituloPlanilhaSubForm = _.isNull(tituloPlanilhaSubForm) ? tituloPlanilhaSubForm : ('' + tituloPlanilhaSubForm).replace(/(<([^>]+)>)/ig, '') // Titulo não pode ter tag html que impede a conversão para Excel
              XLSX.utils.book_append_sheet(wb, planilhaSubForm, tituloPlanilhaSubForm) // Adiciona esta planilha de subformulario a pasta de trabalho (arquivo) Excel
            })
            //
            // Gerando dados para registro de download (extração de informação do  SGP)
            let dados = [
              {'Registro': 'ID do formulário', 'Informação': response.data.retorno.listaFormulariosPrincipais[0]['fk_formulario']},
              {'Registro': 'Quem gerou a planilha', 'Informação': this.usuarioLogado.userName},
              {'Registro': 'Quando foi gerada', 'Informação': (Date(Date.now())).toString()},
              {'Registro': 'Autenticação', 'Informação': response.data.retorno.autenticacao}
            ]
            let extracao = XLSX.utils.json_to_sheet(dados)
            XLSX.utils.book_append_sheet(wb, extracao, 'Extração') // Esta planilha conterá os dados de quem e quando foi feita a extração destas informações do SGP para Excel
            //
            XLSX.writeFile(wb, 'Preenchimentos_formulario_id_' + response.data.retorno.listaFormulariosPrincipais[0]['fk_formulario'] + '.xlsx') // Cria o arquivo com a pasta de trabalho do Excel e faz download
          } else {
            this.$snotify.error(response.data.mensagem)
          }
          this.loading.tela = false
        })
          .catch((error) => {
            this.$snotify.clear()
            this.$root.trataErro(error)
            this.loading.tela = false
          })
      },
      alteraConfiguracaoFormulario (item, alteracoes) {
        let itemBackup = _.cloneDeep(item)
        _.forEach(alteracoes, function (v, k) { _.set(item, k, v) }) // Altera as propriedades desejadas do item
        this.loading.tela = true
        axiosLaravel.post('formulario/salva/', item).then((response) => {
          if (_.has(response.data, 'codigo') && response.data.codigo === 'ERRO') { // Em caso de erro procede rollback
            _.remove(this.formularios, function (f) { return f.id === item.id }) // Elimina o item atual
            this.formularios.push(itemBackup) // Reinclui o item do backup realizado antes da alteração
            this.$forceUpdate()
            this.aviso(response.data)
          } else {
            this.notificacaoDeFormCadastrado('cadastro', item.id, {acao: 'SITUACAO_FORMULARIO_CADASTRO_ALTERADA', valor: item.situacao})
          }
          this.loading.tela = false
        })
          .catch((error) => {
            this.$root.trataErro(error)
            this.loading.tela = false
          })
      },
      aviso (retorno) {
        if (_.has(retorno, 'codigo')) {
          let mensagens = (_.has(retorno, 'mensagem') && !_.isNull(retorno.mensagem) && !_.isEmpty(retorno.mensagem)) ? retorno.mensagem : ['Erro de processamento. Não sei o que houve']
          mensagens.forEach((msg) => {
            if (retorno.codigo === 'ERRO') {
              this.$snotify.error(msg)
            } else if (_.includes(['OK', 'AVISO'], retorno.codigo)) {
              // this.$snotify.success(mensagem, {timeout: 30000})
              this.$snotify.success(msg)
            }
          })
        }
      },
      filtroPorItem (row, filter) {
        let saida = true
        if (filter !== 'retornar_todos_registros') { // Se receber a string para filtrar tudo, então retorna o filtro como '' e não acrescenta a pesquisa por termo
          let termos = _.split(_.toLower(filter), ' ')
          termos.forEach((termo) => {
            saida = saida && (_.toLower(row.nome).indexOf(termo) !== -1 || _.toLower(row.tipo).indexOf(termo) !== -1 || _.toLower(row.id).indexOf(termo) !== -1 || _.toLower(row.situacao).indexOf(termo) !== -1 ||
              _.toLower(_.join(_.map(row.opcoes.vinculo.programas, 'descricao'), ' | ')).indexOf(termo) !== -1)
          })
        }
        return saida
      },
      onFiltered (filteredItems) {
        this.tabelaFormularios.totalRows = filteredItems.length
        this.tabelaFormularios.currentPage = 1
      },
      ajustaPesquisa () {
        // Para o b-table uma string vazia significa "não pesquise", então para efeito de forçar pesquisa deve sempre ter um valor quando for ''
        this.tabelaFormularios.filter = (_.isNull(this.pesquisa) || this.pesquisa === '') ? 'retornar_todos_registros' : this.pesquisa
      }
    }
  }
</script>

<style>
  .detalhamentoFormulario {
    /*background: var(--cor-destaque);*/
  }

  .info_discreto {
    font-size: small;
    color: var(--cor-fraca)
  }

  .link_acesso {
    color: var(--cor-destaque);
    cursor: pointer;
  }
  .link_acesso:hover {
    text-shadow: 0 0 10px var(--cor-destaque);
    color: var( --cor-destaque-dark);
  }

  /* Formatação do detalhamento com formularios vinculados, realcando no salvamento, fechamento e quando aberto */
  .table-form-salvando {
    animation: salvando 4s ease;
  }
  @keyframes salvando {
    50% {
      background: var(--cor-sucesso-dark);
      color: whitesmoke;
    }
  }

  .table-form-fechando {
    animation: fechando 4s ease;
  }
  @keyframes fechando {
    50% {
      background: var(--cor-borda-dark);
      color: white;
    }
  }

  .table-form-aberto td {
    background: var(--cor-destaque-dark);
    color: white;
  }

</style>
