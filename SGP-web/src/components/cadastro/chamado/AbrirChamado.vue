<template>
  <div class="content-wrapper" style="min-height: 870px;">

    <vue-headful :title="'SGP - Abrindo chamado'"/>

    <div class="fade-transition" style=""><!-- content header (page header) -->
      <!--Breadcrumb-->
      <section class="content-header">
        <h1>Chamados</h1>
        <b-breadcrumb :items="[{
          text: 'Inicial',
          href: '/'
          }, {
          text: 'Cadastro',
          href: '#'
          }, {
          text: 'Chamados',
          active: true
          }]"/>
      </section>


      <!-- main content -->
      <section class="content ">
        <div class="row" id="row1">

          <div class="col-md-12">
            <div class="">
              <div class="box box-primary">
                <div class="box-header with-border">
                  <h3 class="box-title"><i class="fa fa-pencil" aria-hidden="true"></i> Abrir Chamado</h3>
                </div>
                <div class="box-body" >
                  <div v-show="loading.tela" class="overlay" style="position: absolute; top: 0px; left: 0px; width: 100%; height: 100%; display: block;">
                    <i class="fa fa-refresh fa-spin"></i>
                  </div>
                  <div>
                    <form name="frmCommonRegister" class="form-horizontal" novalidate >
                      <div class="col-md-6" id="chamado">
                        <fieldset>
                          <legend>
                            O chamado é para um projeto específico?
                          </legend>
                          <div class="row">
                            <div class="box-body" style="padding-top: 0px;">
                              <div class="col-md-12 form-group required" :class="{ 'has-error' : errors.first('projetoSN')}">
                                <span>
                                  <label class="radio-inline new-control new-control-radio" style="padding-top: 7px;"><input v-validate="'required'" type="radio" name="projetoSN" v-model="projetoEspecifico" value="SIM"> Sim <div class="new-control-indicator"></div></label>
                                  <label class="radio-inline new-control new-control-radio" style="padding-top: 7px;"><input v-validate="'required'" type="radio" name="projetoSN" v-model="projetoEspecifico" value="NAO"> Não <div class="new-control-indicator"></div></label>
                                  <span v-if="errors.first('projetoSN')" class="label label-danger"> {{('O campo acima deve ser marcado com Sim ou Não') }}</span>
                                </span>
                              </div>
                            </div>
                          </div>
                          <!-- projeto -->
                          <div class="row" v-if="projetoEspecifico === 'SIM'">
                            <div class="col-md-12">
                              <div class="form-group required-field" :class="{ 'has-error' : errors.first('projeto')}">
                                <label for="projeto" class="control-label col-md-2 tl">Projeto:</label>
                                <div class="col-md-10" v-if="loading.projetos"><span class="etiquetaCarregando"><i class="fa fa-refresh fa-spin"></i> Carregando projetos...</span></div>
                                <div class="col-md-10" v-else>
                                  <multiselect v-model="projeto" :options="projetos"
                                               :multiple="false"
                                               :close-on-select="true"
                                               :clear-on-select="false"
                                               :hide-selected="false"
                                               :preserve-search="true"
                                               placeholder="Selecione um projeto"
                                               @select="changeProjeto($event)"
                                               :preselect-first="false"
                                               :custom-label="etiquetaTipos"
                                               selectLabel=""
                                               label="Projeto"
                                               track-by="Projeto"
                                               deselectLabel=""
                                               selectedLabel=""
                                               name="projeto"
                                               data-vv-as="Projeto"
                                               :disabled="false"
                                               v-validate="{required: projetoEspecifico === 'SIM'}">
                                    <template slot="noOptions"><span class="text-red">Nenhum registro localizado!</span></template>
                                    <template slot="singleLabel" slot-scope="props"><div class="truncar"><span class="identificadorIDProjeto">{{props.option.Projeto.substr(0, 5)}}</span>{{props.option.Projeto.substring(7)}}</div></template>
                                  </multiselect>
                                  <span v-if="errors.first('projeto')" class="label label-danger"> {{('O campo Projeto deve ser selecionado') }}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                          <legend v-if="projetoEspecifico === 'SIM' && projeto.Numero_projeto">
                            O chamado é para um ID específico?
                          </legend>
                          <div class="row" v-if="projetoEspecifico === 'SIM' && projeto.Numero_projeto">
                            <div class="box-body" style="padding-top: 0px;">
                              <div class="col-md-12 form-group required-field" :class="{ 'has-error' : errors.first('tarefaSN')}">
                                <span>
                                  <label class="radio-inline new-control new-control-radio" style="padding-top: 7px;"><input v-validate="'required'" type="radio" name="tarefaSN" v-model="tarefaEspecifica" value="SIM"> Sim <div class="new-control-indicator"></div></label>
                                  <label class="radio-inline new-control new-control-radio" style="padding-top: 7px;"><input v-validate="'required'" type="radio" name="tarefaSN" v-model="tarefaEspecifica" value="NAO"> Não <div class="new-control-indicator"></div></label>
                                  <span v-if="errors.first('tarefaSN')" class="label label-danger"> {{('O campo acima deve ser marcado com Sim ou Não') }}</span>
                                </span>
                              </div>
                            </div>
                          </div>
                          <div class="row" v-if="projetoEspecifico === 'SIM' && tarefaEspecifica === 'SIM'">
                            <div class="col-md-12">
                              <div class="form-group required-field" :class="{ 'has-error' : errors.first('tarefa')}">
                                <label for="tarefa" class="control-label col-md-2 tl">ID:</label>
                                <div class="col-md-10" v-if="loading.ids"><span class="etiquetaCarregando"><i class="fa fa-refresh fa-spin"></i> Carregando solicitações...</span></div>
                                <div class="col-md-10" v-else>
                                  <multiselect v-model="tarefa" :options="tarefas"
                                               :multiple="false"
                                               :close-on-select="true"
                                               :clear-on-select="false"
                                               :hide-selected="false"
                                               :preserve-search="true"
                                               placeholder="Selecione um ID"
                                               @select="changeTarefa($event)"
                                               :preselect-first="false"
                                               :custom-label="etiquetaTarefas"
                                               selectLabel=""
                                               label="id"
                                               track-by="id"
                                               deselectLabel=""
                                               selectedLabel=""
                                               name="tarefa"
                                               data-vv-as="Tarefa"
                                               :disabled="false"
                                               v-validate="{required: tarefaEspecifica === 'SIM'}">

                                    <template slot="option" slot-scope="props">
                                      <div v-if="props.option.projeto === 'Cabeçalho de tarefas'" class="col-md-12"><div class="etiquetaTarefa"><span>ID</span><span>Tipo</span><span>Valor</span></div></div>
                                      <div v-else class="col-md-12"><div class="etiquetaTarefa"><span><strong>{{ props.option.id }}</strong></span><span style="margin-left: 10px">{{ props.option.tipo_solicitacao }}</span><span>{{ props.option.valor | real }}</span></div></div>
                                    </template>
                                    <template slot="noResult">Nenhum registro localizado!</template>
                                    <template slot="noOptions"><span class="text-red">Não há solicitações para selecionado</span></template>
                                    <template slot="singleLabel" slot-scope="props"><div class="etiquetaTarefa"><span><span class="identificadorIDProjeto">{{ props.option.id }}</span><span>{{ props.option.tipo_solicitacao }}</span></span><span>{{ props.option.valor | real }}</span></div></template>
                                  </multiselect>
                                  <span v-if="errors.first('tarefa')" class="label label-danger"> {{('O campo ID deve ser selecionado') }}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div class="row">
                            <div class="col-md-12">
                              <div class="form-group required-field" :class="{ 'has-error' : errors.first('assunto')}">
                                <label for="assunto" class="control-label col-md-2 tl">Assunto:</label>
                                <div class="col-md-10" v-if="loading.assuntos"><span class="etiquetaCarregando"><i class="fa fa-refresh fa-spin"></i> Carregando assuntos ...</span></div>
                                <div class="col-md-10" v-else>
                                  <multiselect v-model="assunto" :options="listaAssuntos"
                                               :multiple="false"
                                               :close-on-select="true"
                                               :clear-on-select="false"
                                               :hide-selected="false"
                                               :preserve-search="true"
                                               placeholder="Selecione um assunto"
                                               @select="changeAssunto($event)"
                                               :custom-label="etiquetaAssuntos"
                                               :preselect-first="false"
                                               selectLabel=""
                                               label="id"
                                               track-by="id"
                                               deselectLabel=""
                                               selectedLabel="Selecionado"
                                               name="assunto"
                                               data-vv-as="assunto"
                                               :disabled="false"
                                               v-validate="'required'">
                                    <span slot="noOptions"><font color="red">Nenhum registro localizado!</font></span>
                                  </multiselect>
                                  <span v-if="errors.first('assunto')" class="label label-danger"> {{('O campo Assunto é obrigatório') }}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        <div v-if="assunto.id === 22">
                          <legend >
                            O Projeto possui parcerias?
                          </legend>
                          <div class="row">
                            <div class="box-body" style="padding-top: 0px;">
                              <div class="col-md-12 form-group required" :class="{ 'has-error' : errors.first('projetoSN')}">
                                <span>
                                  <label class="radio-inline new-control new-control-radio" style="padding-top: 7px;"><input v-validate="'required'" type="radio" name="projetoSN" v-model="parcerias" value="SIM"> Sim <div class="new-control-indicator"></div></label>
                                  <label class="radio-inline new-control new-control-radio" style="padding-top: 7px;"><input v-validate="'required'" type="radio" name="projetoSN" v-model="parcerias" value="NAO"> Não <div class="new-control-indicator"></div></label>
                                  <span v-if="errors.first('projetoSN')" class="label label-danger"> {{('O campo acima deve ser marcado com Sim ou Não') }}</span>
                                </span>
                              </div>
                            </div>
                          </div>
                          <div class="row" v-if="parcerias === 'SIM'">
                            <div class="col-md-12">
                              <div class="form-group required-field" :class="{ 'has-error' : errors.first('projeto')}">
                                <label for="projeto" class="control-label col-md-2 tl">Parcerias:</label>
                                <textarea v-model="parceiros" style="height:40px;resize:none;border: #0a568c;border: 1px solid #a8a3a5;" name="descricao" class="form-control"
                                    :placeholder="'Escreva o nome dos parceiros separados por vírgula.'"
                                    v-validate="'required'"></textarea>
                                </div>
                              </div>
                          </div>
                        </div>
                        </fieldset>
                      </div>
                      <div class="col-md-6" id="chamado2">
                        <div class="required-field" :class="{ 'has-error' : errors.first('descricao')}">
                          <label class="control-label">Descrição do problema ou dúvida:</label>
                          <textarea v-model="chamadoObj.descricao" style="height:175px;resize:none;border: #0a568c;border: 1px solid #a8a3a5;" name="descricao" class="form-control"
                                    :placeholder="place"
                                    v-validate="'required'"></textarea>
                        </div>
                        <span v-if="errors.first('descricao')" class="label label-danger"> {{('O campo Descrição é obrigatório') }}</span>
                        <br>
                        <div class="large-12 medium-12 small-12 cell">
                          <div class="box-header with-border">
                            <h3 class="box-title">Anexo</h3>
                          </div>
                          <upload-documentos-chamado :propDocumentos="chamadoObj.anexos"></upload-documentos-chamado>
                        </div>
                      </div>
                    </form>
                  </div>

                  <div class="col-md-12">&nbsp;</div> <!-- linha em branco -->

                  <div class="col-md-12">
                    <g-button-ujarak color="error" size="button--size-ss" @click.native="$router.push({ name: 'cadastro-chamado-lista'})"><i class="fa fa-ban" aria-hidden="true"></i> Cancelar</g-button-ujarak>
                    <g-button-ujarak color="success" size="button--size-ss" @click.native="salvaChamado()"><i class="fa fa-floppy-o" aria-hidden="true"></i> Enviar</g-button-ujarak>
                  </div>

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
  import UploadDocumentosChamado from '../../modules/uploadDocumentosChamado'
  export default {
    name: 'abrir-chamado',
    components: {UploadDocumentosChamado},
    data () {
      return {
        data: [],
        items: [],
        projeto: [],
        projetos: [],
        tarefas: [],
        tarefa: [],
        edital: null,
        assuntos: [{
          id: 1,
          nome: 'Geral'
        }],
        listaAssuntos: [],
        assunto: [],
        projetoSuperior: '',
        filtros: {
          createdAt: null,
          createdAtDate: null,
          entityId: null,
          project: null,
          requestType: null
        },
        place: 'Descreva de forma objetiva e sucinta qual o problema ou dúvida que deseja enviar para a Fundação Banco do Brasil.',
        chamadoObj: {
          anexos: [],
          status_id: null,
          fk_documento: null,
          entidade_id: null,
          processo_id: null,
          projeto_id: null,
          tarefa_id: null,
          assunto_id: null,
          descricao: null
        },
        projetoEspecifico: null,
        parcerias: null,
        parceiros: null,
        listaParceiros: [],
        tarefaEspecifica: null,
        pesquisa: '',
        loading: {
          tela: false,
          projetos: false,
          assuntos: false,
          ids: false
        }
      }
    },
    props: ['propsProjetos'],
    watch: {
      projetos () {
        this.preencheDadosExternos()
      },
      listaAssuntos () {
        this.preencheDadosExternosAssunto()
        console.log('assuntos: ', this.listaAssuntos)
      },
      tarefas () {
        this.preencheTarefasExterno()
      }
    },
    computed: {
      ...mapGetters([
        'usuarioLogado'
      ])
    },
    async created () {
      await this.buscaAssuntosAtivos()
      await this.buscaProjetos()
      if (this.usuarioLogado.userType === 'ENTIDADE') {
        this.chamadoObj.entidade_id = this.usuarioLogado.entidade.id
      }
    },
    methods: {
      changeProjeto: async function (projeto) {
        this.loading.ids = true
        this.pesquisa = projeto.Numero_projeto
        this.chamadoObj.projeto_id = projeto.Id_proposta
        this.chamadoObj.entidade_id = projeto.fk_entidade
        await axiosLaravel.get('processos/projeto/' + this.pesquisa).then((response) => {
          if (response.data) {
            this.tarefas = response.data
            this.tarefas.unshift({'projeto': 'Cabeçalho de tarefas', $isDisabled: true})
          }
          this.pesquisa = ''
          this.loading.ids = false
          this.$forceUpdate()
        })
          .catch((error) => {
            if (error) {
              this.loading.ids = false
              this.$root.trataErro(error)
            }
          })
      },
      showAlert () {
        this.$swal({
          title: '<font color="red"><b>Atenção!</b></font>',
          html:
            '<div align="left"> A tarefa selecionada se encontra em Revisão pela sua entidade. Gentileza se manifestar na própria tarefa!</div>'
        })
      },
      changeTarefa: async function (tarefa) {
        this.chamadoObj.processo_id = tarefa.id
        this.chamadoObj.tarefa_id = tarefa.id_tarefa
        this.tarefaSelecionada = tarefa
        console.log('tarefa', tarefa)
        if (tarefa.etapa === 'Revisão' || tarefa.etapa === 'Revisão pela entidade') {
          this.showAlert(tarefa)
        }
      },
      changeAssunto: async function (assunto) {
        this.chamadoObj.assunto_id = assunto.id
        console.log('assunto selecionado', assunto.id)
      },
      async buscaProjetos () {
        this.loading.projetos = true
        axiosLaravel.post('processos/projetos', {processo: 'PAGAMENTO', 'tipoBusca': 'simples'}).then((response) => {
          // Limitar acesso a projetos
          let listaProjetos = response.data
          let acessosProjetos = _.get(this.usuarioLogado, 'configuracoes.acesso_projetos')
          if (acessosProjetos) {
            acessosProjetos.forEach((projeto) => {
              if (_.find(projeto.acesso, ['codigo', 'SEM_ACESSO'])) {
                _.remove(listaProjetos, ['Numero_projeto', projeto.numero])
              }
            })
          }
          this.projetos = listaProjetos
          this.loading.projetos = false
          this.$forceUpdate() // força o update da tela para não ter problema
        })
          .catch((error) => {
            this.loading.projetos = false
            console.log('error', error)
            this.$root.trataErro(error)
          })
      },
      etiquetaTarefas (option) {
        let valor = parseFloat(option.valor).toFixed(2)
        return `ID: ${option.id} - Tipo: ${option.tipo_solicitacao} - Valor: R$ ${valor}`
      },
      etiquetaAssuntos (option) {
        return `${option.assunto}`
      },
      async salvaChamado (tarefa) {
        if (this.chamadoObj.assunto_id === 17) {
          await this.buscaNumProjetoSuperior()
          this.chamadoObj.descricao += ' [Projeto Superior] ' + this.projetoSuperior
          // if (this.projeto.edital !== null) {
          //   this.chamadoObj.descricao += '. [Edital] ' + this.projeto.edital
          // }
          // console.log('Descrição modificada', this.chamadoObj.descricao)
        }

        // if (this.tarefaSelecionada && ((this.tarefaSelecionada.etapa === 'Revisão') || (this.tarefaSelecionada.etapa === 'Revisão pela entidade'))) {
        //   this.showAlert(tarefa)
        // } else {
        // Chamado novo sempre 1 - Aguardando Atendimento
        this.chamadoObj.status_id = 1
        // Se o usuário que abrir o chamado for FBB, inicia com 2 - Suporte 62762
        if (this.usuarioLogado.userType === 'FUNDACAO') {
          this.chamadoObj.status_id = 2
          this.chamadoObj.usuario_atendimento = this.usuarioLogado.id
        }
        this.$validator.validateAll().then((result) => {
          if (result) {
            this.$snotify.async('Salvando o Chamado. Por favor, aguarde...', {timeout: 0})
            this.loading.tela = true
            axiosLaravel.post('chamado/grava', this.chamadoObj).then((response) => {
              this.$snotify.clear()
              this.$snotify.success('Chamado salvo com sucesso! Você receberá um e-mail de confirmação com o número.')
              if (_.includes([1, 2, 3, 4], _.get(response.data, ['status_id'], 0)) && _.includes([15, 16], _.get(response.data, ['assunto_id'], 0))) {
                // Se o chamado esta aguardando ou em atendimento, avaliando ou avaliado e é dos assuntos 15 ou 16, então será encerrado automaticamente
                this.encerrarAtendimento(response.data.id)
              } else {
                this.loading.tela = false
                this.$emit('fechaModal', false)
                this.$router.push('/cadastro/chamado/lista/')
              }
            })
              .catch((error) => {
                this.$snotify.clear()
                this.loading.tela = false
                this.$root.trataErro(error)
              })
          } else {
            this.$snotify.error('O formulário possui erros. Favor verificar!')
          }
        })
        // }
      },
      encerrarAtendimento (id) {
        this.loading.tela = true
        axiosLaravel.post('chamado/encerrarAtendimento/', {'parametro': id}).then((response) => {
          console.log('   encerrado FEITO', response.data)
          this.$snotify.clear()
          this.$snotify.success('Chamado encerrado automaticamente!', {timeout: 3000})
          this.loading.tela = false
          this.$emit('fechaModal', false)
          this.$router.push('/cadastro/chamado/lista/')
        })
          .catch((error) => {
            this.$snotify.clear()
            this.loading.tela = false
            this.$root.trataErro(error)
          })
      },
      async buscaAssuntosAtivos () {
        this.loading.assuntos = true
        if (typeof Storage !== 'undefined') { // Ver se o browser suporta localStorage/sessionStorage.
          // Se sim, guardará a lista de assuntos (raramente muda) junto com um timestamp da ultima atualizacao
          let listaAssuntos = JSON.parse(window.localStorage.getItem('assuntos-chamado'))
          // Calcula a diferenca em dias do timestamp de agora e do que foi gravadp no storage (que se não tiver ainda considera o inicio de 2023 para forçar atualização)
          let diferenca = Math.floor((((new Date()).getTime()) / 86400000) - ((_.get(listaAssuntos, 'atualizado', (new Date('2023-01-01')).getTime())) / 86400000))
          if (diferenca >= 1) { // Se não tiver lista ou a lista estiver desatualizada (com mais de 1 dia).. atualiza ela
            await axiosLaravel.post('assuntos/ativos').then((response) => {
              if (response.data) {
                this.listaAssuntos = this.usuarioLogado.userType !== 'FUNDACAO' ? _.filter(response.data, function (assunto) { return !_.includes([15, 16], assunto.id) }) : response.data
                window.localStorage.setItem('assuntos-chamado', JSON.stringify({'atualizado': Math.floor((new Date()).getTime()), 'lista': this.listaAssuntos}))
              }
              //
              this.loading.assuntos = false
              this.$forceUpdate()
            })
              .catch((error) => {
                this.loading.assuntos = false
                if (error) {
                  this.$root.trataErro(error)
                }
              })
          } else {
            this.listaAssuntos = listaAssuntos.lista
            this.loading.assuntos = false
          }
        }
      },
      onDownload (documento) {
        if (documento.file) {
          download(documento.file, documento.ds_nome_arquivo, documento.ds_content_type)
        } else {
          axiosLaravel.get('documentos/download/' + documento.id, {responseType: 'arraybuffer'}).then((response) => {
            let ie = !!window.MSInputMethodContext && !!document.documentMode
            if (!ie) {
              let blob = new Blob([response.data], {type: documento.ds_content_type})
              let link = document.createElement('a')
              link.href = window.URL.createObjectURL(blob)
              link.download = documento.ds_nome_arquivo
              document.body.appendChild(link)
              link.click()
              document.body.removeChild(link)
            } else {
              var bytes = new Uint8Array(resultByte)
              let blob = new Blob([bytes], {type: documento.ds_content_type})
              let link = document.createElement('blob')
              link.href = window.navigator.msSaveOrOpenBlob(blob, documento.ds_nome_arquivo)
              link.download = documento.ds_nome_arquivo
              link.click()
            }
          })
            .catch((error) => {
              this.$root.trataErro(error)
            })
        }
      },
      preencheDadosExternos () {
        let idTarefa = this.$route.query.idTarefa
        let projeto = this.$route.query.projeto
        if (typeof idTarefa === 'undefined') {
          return
        } else {
          // Preenche dados
          this.projetoEspecifico = 'SIM'
          let indexProjeto = this.projetos.map(e => e.Numero_projeto).indexOf(projeto)
          let projetoSelecionado = this.projetos[indexProjeto]
          this.changeProjeto(projetoSelecionado)
          this.projeto = projetoSelecionado
        }
      },
      preencheDadosExternosAssunto () {
        let idTarefa = this.$route.query.idTarefa
        let processo = this.$route.query.processo
        if (typeof idTarefa === 'undefined') {
          return
        }
        if (processo === 'PRESTACAO_DE_CONTAS') {
          processo = 'Prestação de Contas de Recursos Adiantados'
        } else if (processo === 'DEVOLUCAO_DE_ADIANTAMENTO') {
          processo = 'Devolução de Adiantamento'
        } else {
          processo = processo[0].toUpperCase() + processo.slice(1).toLowerCase()
        }
        let indexAssunto = this.listaAssuntos.map(e => e.assunto).indexOf(processo)
        let assuntoSelecionado = this.listaAssuntos[indexAssunto]

        this.changeAssunto(assuntoSelecionado)
        this.assunto = assuntoSelecionado
      },
      preencheTarefasExterno () {
        let idTarefa = this.$route.query.idTarefa
        if (idTarefa !== 'null') {
          this.tarefaEspecifica = 'SIM'
          let indexTarefa = this.tarefas.map(e => e.id).indexOf(parseInt(idTarefa))
          let tarefaSelecionada = this.tarefas[indexTarefa]
          this.tarefa = tarefaSelecionada
          this.changeTarefa(tarefaSelecionada)
        } else {
          this.tarefaEspecifica = 'NAO'
        }
      },
      async buscaNumProjetoSuperior () {
        try {
          const response = await axiosLaravel.get(`chamado/projetoSuperior/${this.projeto.Numero_projeto}`)
          this.projetoSuperior = response.data
        } catch (error) {
          this.$snotify.clear()
          this.$root.trataErro(error)
          throw error
        }
      }
    }
  }
</script>

<style scoped>
  .footer{
    width: 100%;
    height: 100px;
    position: relative;
    bottom: 0%;
    left: 0;
  }
  .etiquetaTarefa {
    display: flex;
    justify-content: space-between;
  }

  #chamado .tl {
    text-align: left;
  }
</style>
