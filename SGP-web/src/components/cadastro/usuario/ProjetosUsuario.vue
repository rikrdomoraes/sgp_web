<template>
  <div class="content-wrapper" style="min-height: 870px;">

    <section class="content-header">
      <h1>
        <span>Usuários por Projeto</span>
        <span v-if="!loading.tela && _.isEmpty(usuarioEditando) && listaUsuarios.length > 0">
          <g-button-moema color="success" @click.native="permiteConcluir()" :title="'<h5>Grava todas as alterações realizadas nos usuários do projeto <span class=\'realce\'>' + projetoSelecionado.ds_codigo_projeto_erp + ' - ' + projetoSelecionado.ds_nome + '</span></h5>'" v-tippy="{inertia:true, arrow:true, animation:'perspective', distance:'1', size:'large', delay: [500, 0]}"><i class="fa fa-check-circle-o" aria-hidden="true"></i> Concluir</g-button-moema>
          <g-button-moema color="warning" @click.native="$router.go(-1)" type="button"><i class="fa fa-chevron-circle-left" aria-hidden="true"></i> Voltar</g-button-moema>
        </span>
      </h1>

      <b-breadcrumb :items="[{text: 'Inicial', href: '/'}, {text: 'Cadastro', href: '#'}, {text: 'Usuários por projeto', active: true}]"/>
    </section>


    <section class="content">

  <!-- Lista de entidades ---------------------------------------------------------------------------------------------------->
      <div class="row">
        <div class="box box-primary">
          <div v-show="loading.tela" class="overlay" style="position: absolute; top: 0px; left: 0px; width: 100%; height: 100%; display: block;"><i class="fa fa-refresh fa-spin"></i></div>

          <div v-if="_.isEmpty(usuarioEditando)">
            <div class="box-body">
              <div class="col-md-12 form-horizontal" id="listaProjetos">
                <multiselect v-model="projetoSelecionado"
                             :options="listaProjetos"
                             :multiple="false"
                             placeholder="Selecione um projeto"
                             track-by="id"
                             label="ds_nome"
                             :custom-label="(option) => { return `${option.ds_codigo_projeto_erp + option.ds_nome + option.ds_situacao_erp}`}"
                             :preselect-first="false"
                             :close-on-select="true"
                             selectLabel=""
                             deselectLabel=""
                             selectedLabel=""
                             name="projeto"
                             ref="listagemProjetos"
                             v-validate="'required'">
                  <template slot="option" slot-scope="props">
                    <strong>{{props.option.ds_codigo_projeto_erp}}</strong> {{props.option.ds_nome}} ({{props.option.ds_situacao_erp}})
                  </template>
                  <template slot="singleLabel" slot-scope="props">
                    <span class="identificadorIDProjeto">{{props.option.ds_codigo_projeto_erp}}</span> {{props.option.ds_nome}} ({{props.option.ds_situacao_erp}})
                  </template>
                  <template slot="noResult">Nenhum projeto localizado!</template>
                </multiselect>
              </div>

            </div>

            <!-- Alertas de Inicialização e conclusão -->
            <div class="box-body">
              <div class="form-horizontal">
                <div v-if="restricaoParaInicializar.length > 0" class="alert alert-warning alert-dismissible">
                  <button type="button" class="close" data-dismiss="alert" aria-hidden="true">×</button>
                  <h4><i class="fa fa-warning"></i> Alerta!</h4>
                  <p v-for="restricao in restricaoParaInicializar">{{restricao}}</p>
                </div>
              </div>
            </div>

            <!-- Tabela com lista de Usários e seus projetos --------------------------------------------------->
            <div class="box-body" id="alteracao_usuarios_entidade" v-if="!_.isEmpty(listaUsuarios)">

              <!-- Botão de novo usuário -->
              <div class="row">
                <div class="col-md-12">
                  <div class="col-md-4">
                    <g-button-moema color="primary" @click.native="novoUsuario()" type="button"
                                    :title="'<h5>Clicar para iniciar cadastro de novo usuário que será vinculado ao projeto <span class=\'realce\'>' + projetoSelecionado.ds_codigo_projeto_erp + ' - ' + projetoSelecionado.ds_nome + '</span></h5>'" v-tippy="{inertia:true, arrow:true, animation:'perspective', distance:'1', size:'large', delay: [500, 0]}">
                      <i class="fa fa-plus-circle" aria-hidden="true"></i> Novo usuário
                    </g-button-moema>
                  </div>

                  <div class="col-md-4">
                    <div class="input-group">
                      <input v-model="pesquisa" type="text" class="form-control" placeholder="Pesquisa..." v-on:keyup="ajustaPesquisa">
                      <span class="input-group-btn">
                        <button v-if="pesquisa.length > 0" :disabled="!tabelaUsuarios.filter" @click="pesquisa = ''; tabelaUsuarios.filter = null" type="button" class="btn btn-default btn-flat"><i class="fa fa-close"></i></button>
                      </span>
                    </div>
                  </div>

                  <div class="col-md-2 text-muted text-left">{{pesquisa.length > 0 ? tabelaUsuarios.totalRows + ' localizado(s)' : '&nbsp;'}}</div>

                  <div class="col-md-2 text-muted text-right" style="cursor: default"
                       :title="'<h5>Há três níveis de acesso aos projetos: <div class=\'legendas_acessos\'>' +
                               '<p class=\'tag_sem_acesso\'>Podem entrar no SGP, se estiver ativo,<br> mas não terá acesso a este projeto</p>' +
                               '<p class=\'tag_visualizacao_projeto\'>Terá acesso para ver o projeto e<br> acompanhar suas ações sem intervir</p>' +
                               '<p class=\'tag_inicia_solicitacao\'>Acesso completo. Permite pedir <br>liberação de recursos, alteração de projeto etc</p>'+
                               '</div></h5>'" v-tippy="{inertia:true, arrow:true, animation:'fade', distance:'1', size:'large', placement:'left'}">
                    <i class="fa fa-exclamation"></i>nformações
                  </div>

                </div>
              </div>

              <div class="col-md-12">&nbsp;</div> <!-- pula uma linha-->

              <div>
                <!-- tabela com usuarios a acessos -->
                <b-container fluid>
                  <b-table show-empty
                           stacked="md"
                           hover
                           :bordered="tabelaUsuarios.bordered"
                           :items="listaUsuarios"
                           :fields="tabelaUsuarios.fields"
                           :current-page="tabelaUsuarios.currentPage"
                           :per-page="tabelaUsuarios.perPage"
                           :sort-by.sync="tabelaUsuarios.sortBy"
                           :sort-desc.sync="tabelaUsuarios.sortDesc"
                           :filter="tabelaUsuarios.filter"
                           :filter-function="filtroPorItem"
                           @filtered="onFiltered"
                           :empty-filtered-text="'Não encontrei nada relacionado a ´' + pesquisa + '´ na pesquisa'"
                           :key="'tabelaUsuarios_' + tabelaUsuarios.numeroAtualizacao"
                           empty-text="Nenhum registro encontrado">

                    <template slot="ds_nome_usuario" scope="row">
                      <div class="truncar" style="width: 150px;" :title="'<h5>' + row.value + '</h5>'" v-tippy="{inertia:true, arrow:true, animation:'perspective', distance:'1', size:'large', delay: [500, 0]}">{{row.value}}</div>
                      <div v-if="row.item.id === 0" class="text-green">
                        usuário novo
                        <i class="fa fa-close botao_excluir_usuario_novo" @click="excluirUsuarioNovo(row.item.tempId)"
                           :title="'<h5>Exclue esse usuário novo, que ainda não foi consta nesse projeto</h5>'" v-tippy="{inertia:true, arrow:true, animation:'perspective', distance:'1', size:'large'}"></i>
                      </div>
                    </template>

                    <template slot="ds_email" scope="row">
                      <div class="truncar" style="max-width: 200px;" :title="'<h5>' + row.value + '</h5>'" v-tippy="{inertia:true, arrow:true, animation:'perspective', distance:'1', size:'large', delay: [500, 0]}">{{row.value}}</div>
                    </template>

                    <template slot="ds_telefone" scope="row">{{row.value | telefone}}</template>
                    <template slot="ds_cpf" scope="row">{{row.value | cpf}}</template>

                    <template slot="acessos" scope="row">
                      <div class="required-field" :class="{ 'has-error' : errors.first('acesso_' + row.item.tempId)}">
                        <multiselect v-model="row.item.acessos"
                                     :options="listaAcessos"
                                     :multiple="true"
                                     placeholder=""
                                     track-by="codigo"
                                     label="descricao"
                                     :preselect-first="false"
                                     :close-on-select="true"
                                     :max="1"
                                     :disabled="row.item.ds_cpf === null"
                                     selectLabel=""
                                     deselectLabel=""
                                     selectedLabel=""
                                     :name="'acesso_' + row.item.tempId"
                                     v-validate="'required'">
                          <template slot="option" slot-scope="props">{{props.option.descricao}}</template>
                          <template slot="singleLabel" slot-scope="props"><strong>{{props.option.descricao}}</strong></template>
                          <template slot="maxElements" slot-scope="props">Se quiser trocar, exclua antes</template>
                          <template slot="noResult">Nenhuma acesso localizada!</template>

                          <template slot="tag" slot-scope="props">
                            <span :class="'tag_acessos tag_' + _.toLower(props.option.codigo)">
                              <span>{{ props.option.descricao }}</span>
                              <span class="multiselect__tag-icon" @click="props.remove(props.option)"></span>
                            </span>
                          </template>
                        </multiselect>
                        <span v-if="errors.first('acesso_' + row.item.tempId)" class="label label-danger"> Deve selecionar um acesso</span>
                      </div>
                    </template>

                    <template slot="bt_ativo" scope="row">
                      <i :class="('' + row.value) === '0' ? 'fa fa-circle text-red' : 'fa fa-circle text-green'" aria-hidden="true" style="cursor: pointer"
                         :title="'<h5>Situação do usuário: <div class=\'legendas_acessos text-left\'>' +
                                 '<p><i class=\'fa fa-circle text-red\'></i> <span class=' + (('' + row.value) === '0' ? 'realce' : '') + '>Inativo</span>: Não pode entrar no SGP</p>' +
                                 '<p><i class=\'fa fa-circle text-green\'></i> <span class=' + (('' + row.value) === '1' ? 'realce' : '') + '>Ativo</span>: Pode entrar no SGP</p>' +
                                 '<p>Clique para alterar para <b>' + (('' + row.value) === '0' ? 'ATIVO' : 'INATIVO') + '</b>,<br/> depois conclua as alterações</p></div></h5>'"
                                 v-tippy="{inertia:true, arrow:true, animation:'fade', distance:'1', size:'large'}"
                         @click="row.item.bt_ativo = ('' + row.value) === '0' ? 1 : 0">
                      </i>
                    </template>

                    <template slot="actions" scope="row">
                      <b-button type="button" @click.stop="editaUsuario(row)" v-if="row.item.ds_cpf !== null" class="btn btn-primary btn-sm btn-flat"><i class="fa fa-pencil-square-o" aria-hidden="true"></i> Editar</b-button>
                    </template>

                  </b-table>

                  <b-row v-if="!_.isEmpty(listaUsuarios) && listaUsuarios.length > tabelaUsuarios.perPage && tabelaUsuarios.totalRows > tabelaUsuarios.perPage">
                    <b-col md="12" class="my-1" right>
                      <b-pagination :total-rows="listaUsuarios.length" :per-page="tabelaUsuarios.perPage" v-model="tabelaUsuarios.currentPage" class="my-3" />
                    </b-col>
                  </b-row>

                </b-container>

              </div>

            </div>

          </div>

    <!-- Formulario para inclusão e alteração de cadastro -->
          <div v-if="!_.isEmpty(usuarioEditando)">

            <div class="box-body">
              <div class="box-header">
                <h3 class="box-title"><i class="fa fa-pencil" aria-hidden="true"></i> {{_.isNull(usuarioEditando.id) ? 'Criando usuário para' : (usuarioEditando.id === 0 ? 'Alterando usuário novo de ' : 'Editando usuário de')}}<b> {{projetoSelecionado.ds_codigo_projeto_erp}} - {{projetoSelecionado.ds_nome}}</b></h3>
              </div>
              <div class="form-horizontal">
                <div class="col-md-12 well">
                  <div class="col-md-6">
                    <div class="form-group required-field" :class="{ 'has-error' : errors.first('nome')}">
                      <label for="nome" class="control-label col-md-4">Nome:</label>
                      <div class="">
                        <div class="col-md-8">
                          <input v-model="usuarioEditando.ds_nome_usuario" name="nome" id="nome" class="form-control" type="text" v-validate="'required|min:1|max:100'" :disabled="ehVisualizacao" ref="ds_nome_usuario">
                        </div>
                        <span v-if="errors.first('nome')" class="label label-danger"> {{('O campo Nome do Usuário é obrigatório') }}</span>
                      </div>
                    </div>

                    <div class="form-group required-field" :class="{ 'has-error' : errors.first('cpf')}">
                      <label for="cpf" class="control-label col-md-4">CPF:</label>
                      <div class="">
                        <div class="col-md-4">
                          <the-mask v-model="usuarioEditando.ds_cpf"
                                    name="cpf" data-vv-as="CPF" id="cpf" class="form-control" type="text" :disabled="ehVisualizacao"
                                    :mask="'###.###.###-##'" v-validate="'cpf|required'">
                          </the-mask>
                        </div>
                        <span v-if="errors.first('cpf')" class="label label-danger">{{ errors.first('cpf') }}</span>
                      </div>
                    </div>

                    <div class="form-group required-field" :class="{ 'has-error' : errors.first('login')}">
                      <label for="login" class="control-label col-md-4">Login:</label>
                      <div class="">
                        <div class="col-md-4">
                          <input v-model="usuarioEditando.ds_login" @blur="verificaLoginJaCadastrado()" name="login" id="login" class="form-control" type="text" :disabled="ehVisualizacao" v-validate="'required|min:5|max:14'">
                          <span v-if="errors.first('login')" class="label label-danger"> {{ errors.first('login') }}</span>
                        </div>
                        <span class="text-blue" v-if="loading.verifica.login"><i class="fa fa-refresh fa-spin"></i> verificando...</span>
                      </div>
                    </div>

                    <div class="form-group required-field" :class="{ 'has-error' : errors.first('Telefone')}">
                      <label for="Telefone" class="control-label col-md-4">Telefone:</label>
                      <div class="">
                        <div class="col-md-3">
                          <the-mask v-model="usuarioEditando.ds_telefone" name="Telefone" id="telefone" ref="Telefone" class="form-control" type="text" :masked="false"
                                    v-validate="'required|min:10|max:11'" :mask="['(##) ####-####', '(##) #####-####']">
                          </the-mask>
                        </div>
                        <span v-if="errors.first('Telefone')" class="label label-danger"> {{ errors.first('Telefone') }}</span>
                      </div>
                    </div>

                    <div class="form-group required-field" :class="{ 'has-error' : errors.first('email')}">
                      <label for="email" class="control-label col-md-4">E-Mail:</label>
                      <div class="">
                        <div class="col-md-5">
                          <input v-model="usuarioEditando.ds_email" name="email" id="email" data-vv-as="E-Mail" @blur="verificaLoginJaCadastrado()" class="form-control" type="text" :disabled="ehVisualizacao" v-validate="'required|email'">
                          <span v-if="errors.first('email')" class="label label-danger">{{ errors.first('email') }}</span>
                        </div>
                        <span class="text-blue float-right" v-if="loading.verifica.email"><i class="fa fa-refresh fa-spin"></i> verificando...</span>
                      </div>
                    </div>

                    <div class="form-group required-field" :class="{ 'has-error' : errors.first('status')}">
                      <label for="active" class="control-label col-md-4">Situação:</label>
                      <div class="">
                        <div class="col-md-6">
                          <label class="radio-inline new-control new-control-radio" style="padding-top: 7px;">
                            <input type="radio" name="status" :value="1" v-model="usuarioEditando.bt_ativo"> Ativo <i class="fa fa-circle text-green"></i><div class="new-control-indicator"></div>
                          </label>
                          <span style="margin-left: 15%;">&nbsp;</span>
                          <label class="radio-inline new-control new-control-radio" style="padding-top: 7px;">
                            <input type="radio" name="status" :value="0" v-model="usuarioEditando.bt_ativo"> Inativo <i class="fa fa-circle text-red"></i><div class="new-control-indicator"></div>
                          </label>
                        </div>
                        <span v-if="errors.first('status')" class="label label-danger"> {{('O campo Status do Usuário é obrigatório') }}</span>
                      </div>
                    </div>
                  </div>

                  <div class="col-md-6">
                    <div class="form-group required-field" :class="{ 'has-error' : errors.first('acesso_' + usuarioEditando.tempId)}">
                      <label for="nome" class="control-label col-md-2">Acesso:</label>

                      <div class="col-md-10">
                        <multiselect v-model="usuarioEditando.acessos"
                                     :options="listaAcessos"
                                     :multiple="true"
                                     placeholder=""
                                     track-by="codigo"
                                     label="descricao"
                                     :preselect-first="false"
                                     :close-on-select="true"
                                     :max="1"
                                     :disabled="usuarioEditando.ds_cpf === null"
                                     selectLabel=""
                                     deselectLabel=""
                                     selectedLabel=""
                                     :name="'acesso_' + usuarioEditando.tempId"
                                     v-validate="'required'">
                          <template slot="option" slot-scope="props">{{props.option.descricao}}</template>
                          <template slot="singleLabel" slot-scope="props"><strong>{{props.option.descricao}}</strong></template>
                          <template slot="maxElements" slot-scope="props">Se quiser trocar, exclua antes</template>

                          <template slot="tag" slot-scope="props">
                            <span :class="'tag_acessos tag_' + _.toLower(props.option.codigo)">
                              <span>{{ props.option.descricao }}</span>
                              <span class="multiselect__tag-icon" @click="props.remove(props.option)"></span>
                            </span>
                          </template>

                          <template slot="noResult">Nenhuma acesso localizada!</template>
                        </multiselect>
                        <span v-if="errors.first('acesso_' + usuarioEditando.tempId)" class="label label-danger"> Deve selecionar um acesso</span>
                      </div>

                    </div>
                    <div class="form-group">
                      <div class="col-md-10 col-md-offset-2 text-red">
                        Após concluir, este usuário novo será vinculado a este projeto e outro(s) {{listaProjetosEntidade.length - 1}} projeto(s) desta entidade.<br><br>Para o(s) outro(s) projeto(s), este usuário estará <b>Sem Acesso</b> até que entre no projeto específico e conceda o acesso
                      </div>
                    </div>
                  </div>
                  <div class="col-md-12">&nbsp;</div>
                  <div class="col-md-10 col-md-offset-2">
                    <button @click="_.isNull(usuarioEditando.id) ? adicionaUsuario() : alteraUsuario()" v-if="errors.items.length === 0 && _.keys(usuarioEditando).length >= 7 && !loading.verifica.login && !loading.verifica.email" type="button" class="btn btn-confirm btn-flat"><i class="fa fa-check" aria-hidden="true"></i> Ok</button>
                    <button @click.once="usuarioEditando = {}" type="button" class="btn btn-back btn-flat"><i class="fa fa-times-circle" aria-hidden="true"></i> Cancelar</button>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>

    </section>

  </div>


</template>

<script>
  import { mapGetters } from 'vuex'
  export default {
    components: {
    },
    name: 'projetos-usuarios',
    data () {
      return {
        loading: {
          tela: false,
          usuarios: false,
          projetos: true,
          verifica: {
            login: false,
            email: false
          }
        },
        listaProjetos: [],
        listaProjetosEntidade: [],
        projetoSelecionado: [],
        listaUsuarios: [],
        listaUsuariosBackup: [],
        restricaoParaInicializar: [],
        usuarioEditando: {},
        ehVisualizacao: false,
        pesquisa: '',
        tabelaUsuarios: {
          currentPage: 1,
          perPage: 10,
          totalRows: 0,
          sortBy: 'ds_nome_usuario',
          sortDesc: true,
          filter: null,
          bordered: true,
          numeroAtualizacao: 0,
          fields: [
            {key: 'ds_nome_usuario', label: 'Nome', sortable: true, thStyle: 'text-align: center; width: 150px', class: 'text-center'},
            {key: 'ds_cpf', label: 'CPF', sortable: true, thStyle: 'text-align: center', class: 'text-center'},
            {key: 'ds_login', label: 'Login', sortable: true, thStyle: 'text-align: center; width: 5%', class: 'text-center'},
            {key: 'ds_telefone', label: 'Telefone', sortable: true, thStyle: 'text-align: center', class: 'text-center'},
            {key: 'ds_email', label: 'E-mail', sortable: true, thStyle: 'text-align: center', class: 'text-center'},
            {key: 'bt_ativo', label: 'Ativo', thStyle: 'text-align: center', class: 'text-center'},
            {key: 'acessos', label: 'Acesso ao projeto', thStyle: 'text-align: center; width: 10%', class: 'text-center'},
            {key: 'actions', label: 'Ações', thStyle: 'text-align: center; width: 50px', class: 'text-center'}
          ]
        },
        listaAcessos: [{'codigo': 'SEM_ACESSO', 'descricao': 'Sem Acesso'}, {'codigo': 'VISUALIZACAO_PROJETO', 'descricao': 'Só visualização'}, {'codigo': 'INICIA_SOLICITACAO', 'descricao': 'Inicia solicitações'}]
      }
    },
    computed: {
      ...mapGetters([
        'usuarioLogado'
      ])
    },
    watch: {
      projetoSelecionado () {
        this.buscaUsuariosEntidade()
      }
    },
    mounted () {
    },
    created () {
      console.clear()
      this.carregarlistagemProjetos()
    },
    methods: {
      carregarlistagemProjetos () {
        this.loading.tela = true
        axiosLaravel.post('usuarios/projetos').then((response) => {
          if (_.has(response.data, 'codigo') && response.data.codigo === 'OK') {
            this.listaProjetos = response.data.retorno
            this.$refs.listagemProjetos.activate()
          } else {
            this.$snotify.error(response.data.mensagem[0])
          }
          this.$forceUpdate()
          this.loading.tela = false
        })
          .catch((error) => {
            this.loading.tela = false
            console.log('error', error)
            this.$root.trataErro(error)
          })
      },
      buscaUsuariosEntidade () {
        this.loading.tela = true
        axiosLaravel.post('usuarios/entidade', {'id': this.projetoSelecionado.fk_entidade}).then((response) => {
          if (_.has(response.data, 'codigo') && response.data.codigo === 'OK') {
            axiosLaravel.post('usuarios/entidade/projetos', {'id': this.projetoSelecionado.fk_entidade}).then((response) => {
              if (_.has(response.data, 'codigo') && response.data.codigo === 'OK') {
                this.listaProjetosEntidade = response.data.retorno
              } else {
                this.$snotify.error(response.data.mensagem[0])
              }
              this.$forceUpdate()
              this.loading.tela = false
            })
              .catch((error) => {
                this.loading.tela = false
                console.log('error', error)
                this.$root.trataErro(error)
              })
            response.data.retorno.forEach((usuario) => {
              _.set(usuario, 'tempId', _.uniqueId()) // Adiciona um id unico para facilitar na edição, alteração e tratamento de retorno de novos usuários
              _.set(usuario, 'configuracoes.acesso_projetos', _.get(usuario, 'configuracoes.acesso_projetos', [])) // Se tem configurações e acesso a projetos, seta o que já tem senão seta array vazio
              //
              let acessoPadrao = _.find(this.listaAcessos, ['codigo', (_.isNull(usuario.ds_cpf) ? 'VISUALIZACAO_PROJETO' : 'INICIA_SOLICITACAO')]) // Acesso base para vinculko automatico de projeto não existente na lista de acesso do usuário
              let acessoProjetoAtual = _.find(usuario.configuracoes.acesso_projetos, ['numero', this.projetoSelecionado.ds_codigo_projeto_erp])
              let acesso = acessoProjetoAtual ? acessoProjetoAtual.acesso : acessoPadrao // Se tem acesso ao projeto selecionado, então indica o acesso na tela, senão atribui o acesso padrão
              _.set(usuario, 'acessos', !_.isArray(acesso) ? [acesso] : acesso)
            })
            // Inicializa pesquisa e tabela
            this.tabelaUsuarios.currentPage = 1
            this.tabelaUsuarios.totalRows = response.data.retorno.length
            this.tabelaUsuarios.filter = null
            this.pesquisa = ''
            //
            this.listaUsuarios = response.data.retorno
            this.listaUsuariosBackup = _.cloneDeep(this.listaUsuarios)
          } else {
            this.$snotify.error(response.data.mensagem[0])
          }
          this.$forceUpdate()
          this.loading.tela = false
        })
          .catch((error) => {
            this.loading.tela = false
            console.log('error', error)
            this.$root.trataErro(error)
          })
      },
      novoUsuario () {
        this.usuarioEditando = {id: null, bt_ativo: 1}
      },
      adicionaUsuario () {
        this.$validator.validateAll().then(validado => {
          if (validado && this.errors.items.length === 0) {
            this.loading.tela = true
            this.listaUsuarios.push({
              'id': 0,
              'ds_nome_usuario': this.usuarioEditando.ds_nome_usuario,
              'ds_cpf': this.usuarioEditando.ds_cpf,
              'ds_login': this.usuarioEditando.ds_login,
              'ds_telefone': this.usuarioEditando.ds_telefone,
              'ds_email': this.usuarioEditando.ds_email,
              'bt_ativo': parseInt(this.usuarioEditando.bt_ativo),
              'configuracoes': this.usuarioEditando.configuracoes,
              'acessos': this.usuarioEditando.acessos,
              'fk_entidade': this.projetoSelecionado.fk_entidade,
              'ds_tipo_usuario': 'ENTIDADE',
              'tempId': _.uniqueId()
            })
            this.usuarioEditando = {}
            this.$forceUpdate()
            this.loading.tela = false
          }
        })
      },
      alteraUsuario () {
        this.$validator.validateAll().then(validado => {
          if (validado && this.errors.items.length === 0) {
            let index = _.findIndex(this.listaUsuarios, ['tempId', this.usuarioEditando.tempId])
            this.listaUsuarios[index] = _.clone(this.usuarioEditando)
            this.usuarioEditando = {}
          }
        })
      },
      editaUsuario (row) {
        this.usuarioEditando = _.cloneDeep(row.item)
        this.$forceUpdate()
      },
      excluirUsuarioNovo (tempId) {
        _.remove(this.listaUsuarios, ['tempId', tempId])
        this.tabelaUsuarios.numeroAtualizacao++
      },
      salvarConfiguracoes (usuario) {
        axiosLaravel.post('/usuario/configuracoes', {'configuracoes': usuario.configuracoes, 'id': usuario.id}).then((response) => {
          console.log('configuracoes salvo', usuario)
        })
          .catch((error) => {
            if (error) {
              console.log('error', error)
              this.$root.trataErro(error)
            }
          })
      },
      permiteConcluir () {
        // TODO comparar os dados de antes e depois
        console.log('backup', this.listaUsuariosBackup)
        console.log('alterado', this.listaUsuarios)
        let vm = this
        if (this.errors.items.length === 0) {
          this.$validator.validateAll().then(validado => {
            if (validado && this.errors.items.length === 0) {
              this.listaUsuarios.forEach((usuario) => {
                _.set(usuario, 'configuracoes.acesso_projetos', _.get(usuario, 'configuracoes.acesso_projetos', [])) // Se tem configurações e acesso a projetos, seta o que já tem senão seta array vazio
                if (usuario.id !== 0) {
                  let acessoProjetoAtual = _.find(usuario.configuracoes.acesso_projetos, ['numero', this.projetoSelecionado.ds_codigo_projeto_erp])
                  if (acessoProjetoAtual) {
                    _.set(acessoProjetoAtual, 'acesso', usuario.acessos)
                  } else {
                    _.set(usuario, 'configuracoes.acesso_projetos', [{'numero': this.projetoSelecionado.ds_codigo_projeto_erp, 'nome': this.projetoSelecionado.ds_nome, 'acesso': usuario.acessos}])
                  }
                } else {
                  _.set(usuario, 'configuracoes.acesso_projetos', [{'numero': this.projetoSelecionado.ds_codigo_projeto_erp, 'nome': this.projetoSelecionado.ds_nome, 'acesso': usuario.acessos}])
                  this.listaProjetosEntidade.forEach((projeto) => {
                    if (!_.isNull(projeto.ds_codigo_projeto_erp) && projeto.ds_codigo_projeto_erp !== this.projetoSelecionado.ds_codigo_projeto_erp) {
                      usuario.configuracoes.acesso_projetos.push({'numero': projeto.ds_codigo_projeto_erp, 'nome': projeto.ds_nome, 'acesso': [{'codigo': 'SEM_ACESSO', 'descricao': 'Sem Acesso'}]})
                    }
                  })
                }
              })
              let usuariosNovos = _.filter(this.listaUsuarios, ['id', 0])
              if (usuariosNovos.length > 0) {
                this.$dialog.confirm('Há ' + usuariosNovos.length + ' usuário(s) novo(s). Após concluir, o sistema enviará e-mail com login e pedirá para eles criarem suas senhas pessoais', {html: true, animation: 'fade', customClass: 'avisoConfirmacao'}).then(function (dialog) {
                  vm.concluir()
                }).catch(function () {
                })
              } else {
                this.concluir()
              }
            } else {
              this.$snotify.error('Há ' + this.errors.items.length + ' item(ns) obrigatório(s) não preenchido(s)')
            }
          })
        } else {
          this.$snotify.error('Há ' + this.errors.items.length + ' item(ns) obrigatório(s) não preenchido(s)')
        }
      },
      concluir () {
        this.loading.tela = true
        axiosLaravel.post('/usuarios/entidade/atualizar', {'id': this.projetoSelecionado.fk_entidade, 'usuarios': this.listaUsuarios}).then((response) => {
          if (_.has(response.data, 'codigo') && response.data.codigo === 'OK') {
            // Atualiza dados da tela com base no historico recebido.. novos registros
            response.data.retorno.incluido.forEach((usuario) => {
              _.set(_.find(this.listaUsuarios, ['tempId', usuario.tempId]), 'id', usuario.id) // Atualizar só o id criado
            })
            this.$snotify.success('Processado com sucesso', {timeout: 3000})
            this.listaUsuariosBackup = _.cloneDeep(this.listaUsuarios)
          } else {
            this.$snotify.error(response.data.mensagem[0])
          }
          this.loading.tela = false
        })
          .catch((error) => {
            if (error) {
              console.log('error', error)
              this.loading.tela = false
              this.$root.trataErro(error)
            }
          })
      },
      verificaLoginJaCadastrado () {
        let verificar = {'email': 'ds_email', 'login': 'ds_login'} // Lista de pares "nome" e "campo" para pesquisar
        _.keys(verificar).forEach((campo) => {
          _.set(this.loading.verifica, [campo], true)
          axiosLaravel.post('/verifica-usuario/', {'parametro': verificar[campo], 'valor': _.get(this.usuarioEditando, [verificar[campo]]), 'idUsuario': this.usuarioEditando.id}).then((response) => {
            if (response.data.length > 0) {
              let field = this.$validator.fields.find({name: campo})
              field.setFlags({invalid: true})
              this.errors.add({field: campo, msg: 'Já em uso neste sistema. Informe outro.', id: field.id, scope: field.scope})
            }
            _.set(this.loading.verifica, [campo], false)
            this.$forceUpdate()
          })
            .catch((error) => {
              _.set(this.loading.verifica, [campo], false)
              if (error) {
                this.$root.trataErro(error)
              }
            })
        })
      },
      filtroPorItem (row, filter) {
        let saida = true
        if (filter !== 'retornar_todos_registros') { // Se receber a string para filtrar tudo, então retorna o filtro como '' e não acrescenta a pesquisa por termo
          let termos = _.split(_.toLower(filter), ' ')
          termos.forEach((termo) => {
            saida = saida && (_.toLower(row.ds_nome_usuario).indexOf(termo) !== -1 || _.toLower(row.ds_email).indexOf(termo) !== -1 || _.toLower(row.ds_login).indexOf(termo) !== -1 || ('' + row.ds_cpf).indexOf(termo) !== -1)
          })
        }
        return saida
      },
      onFiltered (filteredItems) {
        this.tabelaUsuarios.totalRows = filteredItems.length
        this.tabelaUsuarios.currentPage = 1
        this.$forceUpdate()
      },
      ajustaPesquisa () {
        // Para o b-table uma string vazia significa "não pesquise", então para efeito de forçar pesquisa deve sempre ter um valor quando for ''
        this.tabelaUsuarios.filter = (_.isNull(this.pesquisa) || this.pesquisa === '') ? 'retornar_todos_registros' : this.pesquisa
      }
    }
  }
</script>

<style>
  .detalhamentoProjetosEntidade table {
    /*background: white !important;*/
  }

  .detalhamentoProjetosEntidade thead {
    display: none;
  }

  #alteracao_usuarios_entidade .detalheAbreFecha {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    cursor: pointer;
  }
  #alteracao_usuarios_entidade .detalheAbreFecha div:first-child {
    padding: 2px 10px;
    margin-right: 10px;
  }

  .tag_acessos {
    color: #fff;
    position: relative;
    display: inline-block;
    padding: 4px 26px 4px 10px;
    border-radius: 5px;
    margin-right: 10px;
    line-height: 1;
    margin-bottom: 5px;
    white-space: nowrap;
    overflow: hidden;
    max-width: 100%;
    text-overflow: ellipsis;
  }
  .tag_acessos .multiselect__tag-icon:after {
    color: white !important;
  }
  .tag_sem_acesso {
    background: tomato;
  }
  .tag_inicia_solicitacao {
    background: seagreen;
  }
  .tag_visualizacao_projeto {
    background: steelblue;
  }
  .legendas_acessos {
    display: flex;
    flex-direction: column;
    margin-top: 5px;
  }
  .legendas_acessos p {
    border-radius: 5px;
    padding: 3px;
  }

  .identificadorIDProjeto {
    color: var(--cor-destaque-dark);
    font-weight: bold;
    margin-right: 10px;
  }

  .botao_excluir_usuario_novo {
    border-radius: 50%;
    padding: 2px 3px;
    background: tomato;
    color: white;
    cursor: pointer;
  }
  .botao_excluir_usuario_novo:hover {
    background: #80000f;
    border: 1px solid white;
  }
</style>
