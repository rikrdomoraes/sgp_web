<template>
  <div class="box-body avaliacoesProjeto">

    <div v-show="loading.tela" class="overlay" style="position: absolute; top: 0px; left: 0px; width: 100%; height: 100%; display: block;"><i class="fa fa-refresh fa-spin"></i></div>

    <!-- Grid com processos de avaliação -->
    <div class="col-md-12">
      <div class="row" v-if="usuarioLogado.userType === 'FUNDACAO'">
        <div class="col-md-12">
          <span v-if="loading.formulariosDisponiveis">
            <div class="box-header"><i class="fa fa-refresh fa-spin"></i> Buscando formulários disponíveis para este projeto</div>
          </span>
          <span v-else>
            <div v-if="listaFormulariosDisponiveis.length === 0" class="box-header bg-info">
              Não há formulário disponível para avaliação deste projeto {{numeroProjeto}}
            </div>

            <div v-else :title="'<h5>Se desejar enviar um formulário de avaliação para a entidade parceira neste projeto ' + numeroProjeto + ', então selecione o formulário desejado e clique em Enviar</h5>'" v-tippy="{inertia:true, arrow:true, placement:'top', animation:'perspective', distance:'1', size:'large', arrow:true}" class="row">
              <div class="col-sm-9">
                <!-- Listagem de formulários disponíveis para enviar -->
                <multiselect v-model="formularioSelecionadoEnvioManual"
                             :options="listaFormulariosDisponiveis"
                             :multiple="false"
                             :close-on-select="true"
                             :placeholder="'Formulários disponíveis para envio'"
                             track-by="id"
                             label="nome"
                             selectedLabel="selecionado"
                             selectLabel=""
                             deselectLabel=""
                             name="formularios_disponiveis"
                             data-vv-as="formularios_disponiveis">

                  <template slot="option" slot-scope="props">
                    <table class="w100">
                      <tr>
                        <td class="w40"><span class="text-warning text-bold">{{ props.option.id }} </span> {{ props.option.nome }} <br/></td>
                        <td class="w20" style="font-style: italic">{{ _.find(tipoFormulario, ['codigo', props.option.tipo])['descricao'] }}</td>
                        <td class="w20"><span :class="props.option.uso === 0 ? 'text-danger' : 'text-info'">{{props.option.uso === 0 ? 'Nenhum' : props.option.uso + ' preenchido' + (props.option.uso > 1 ? 's' : '')}}</span></td>
                      </tr>
                    </table>
                  </template>

                  <template slot="noResult" slot-scope="props">
                    Não encontrei formulário com este nome
                  </template>

                </multiselect>
              </div>
              <div class="col-sm-3" v-if="!_.isNull(formularioSelecionadoEnvioManual)">
                <g-button-ujarak color="primary" size="button--size-ss" @click.native="encaminharFormularioParaEntidade"><i class="fa fa-list-alt" aria-hidden="true"></i> Enviar</g-button-ujarak>
              </div>

            </div>

          </span>
        </div>
      </div>

      <br v-if="usuarioLogado.userType === 'FUNDACAO'">

      <div class="row"><div class="col-md-12" style="color: var(--cor-fraca)">Formulários vinculados neste projeto</div></div>

      <div class="row">
        <div class="table-responsive">
          <div class="container-fluid">
            <table class="table b-table table-hover table-bordered b-table-stacked-md">
              <thead>
              <tr>
                <th class="centralizado w10">ID</th>
                <th class="centralizado">Formulário</th>
                <th class="centralizado w20">Situação</th>
                <th class="centralizado w30" v-if="usuarioLogado.userType === 'FUNDACAO'">Ação</th>
              </tr>
              </thead>
              <tbody>
              <tr v-for="(processo, idx) in avaliacoesProjeto">
                <td class="centralizado"><strong>{{processo.avaliacao.id}}</strong></td>
                <td class="text-left">
                  {{processo.formularioCadastrado.id + ' - ' + processo.formularioCadastrado.nome}}<br/>
                  <i>{{ _.find(tipoFormulario, ['codigo', processo.formularioCadastrado.tipo])['descricao'] }}</i>
                </td>
                <td class="centralizado">
                  <span v-if="processo.avaliacao.situacao === 'FEITO'" style="color: var(--cor-sucesso)">Concluído</span>
                  <span v-else-if="processo.avaliacao.situacao === 'CANCELADO'" style="color: var(--cor-atencao)">Cancelado</span>
                  <span v-else-if="processo.avaliacao.situacao === 'EM_EXECUCAO'" style="color: var(--cor-destaque)">Em Execução</span>
                </td>
                <td class="centralizado">
                  <span v-if="usuarioLogado.userType === 'FUNDACAO'">
                    <g-button-ujarak color="primary" size="button--size-ss" @click.native="$router.push({name: 'preenche-formulario', params: {id: _.split(processo.formularioPreenchido.link_acesso, '-')[0]}})" v-if="processo.avaliacao.situacao === 'EM_EXECUCAO' && processo.ultimaTarefa.nome === 'ANALISE'"><i class="fa fa-gavel" aria-hidden="true"></i> Validar</g-button-ujarak>
                    <g-button-ujarak color="warning" size="button--size-ss" @click.native="reativar(idx)" v-if="_.includes(['FEITO', 'CANCELADO'], processo.avaliacao.situacao)"><i class="fa fa-play" aria-hidden="true"></i> Reativar</g-button-ujarak>
                    <g-button-ujarak color="error"   size="button--size-ss" v-confirm="{ok: retorno => cancelar(processo.avaliacao.id), cancel: doNothing, message: '<span class=\'avisoAlerta\'>Deseja <b>Cancelar</b> esta avaliação?</span>'}" v-if="processo.avaliacao.situacao !== 'CANCELADO'"><i class="fa fa-ban" aria-hidden="true"></i> Cancelar</g-button-ujarak>
                  </span>
                  <span v-if="usuarioLogado.userType === 'ENTIDADE' && processo.avaliacao.situacao === 'EM_EXECUCAO' && _.includes(['SOLICITACAO', 'REVISAO'], processo.ultimaTarefa.nome)">
                    <g-button-ujarak color="primary" size="button--size-ss" @click.native="$router.push({name: 'preenche-formulario', params: {id: _.split(processo.formularioPreenchido.link_acesso, '-')[1]}})"><i class="fa fa-pencil-square-o" aria-hidden="true"></i> Editar</g-button-ujarak>
                  </span>
                  <g-button-ujarak color="success" size="button--size-ss" @click.native="$router.push({name: 'preenche-formulario', params: {id: _.split(processo.formularioPreenchido.link_acesso, '-')[2]}})"><i class="fa fa-search" aria-hidden="true"></i> Visualizar</g-button-ujarak>
                </td>
              </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>



  </div>
</template>

<script>
  import { mapGetters } from 'vuex'

  export default {
    name: 'avaliacoesProjeto',
    data () {
      return {
        avaliacoesProjeto: [],
        listaFormulariosDisponiveis: [],
        formularioSelecionadoEnvioManual: null,
        tipoFormulario: [{codigo: 'AVALIACAO_APROVACAO', descricao: 'Marco zero'}, {codigo: 'AVALIACAO_ENCERRAMENTO', descricao: 'Marco um'}, {codigo: 'AVALIACAO_GENERICO', descricao: 'Genérico'}, {codigo: 'AVALIACAO_PARTICIPANTE', descricao: 'Participante'}],
        loading: {
          tela: false,
          formulariosDisponiveis: false
        }
      }
    },
    props: ['numeroProjeto', 'editavel'],
    computed: {
      ...mapGetters([
        'usuarioLogado',
        'urlLaravel'
      ])
    },
    mounted () {
    },
    watch: {
    },
    created () {
      this.buscaAvaliacoes()
      this.buscaFormsDisponiveis()
    },
    methods: {
      buscaAvaliacoes () {
        this.loading.tela = true
        axiosLaravel.get('formulario/projeto/' + this.numeroProjeto + '/listar').then((response) => {
          if (_.has(response.data, 'codigo') && response.data.codigo === 'OK') {
            this.avaliacoesProjeto = response.data.retorno
          } else {
            this.$snotify.error(response.data.mensagem)
          }
          this.loading.tela = false
        })
          .catch((error) => {
            this.loading.tela = false
            this.$root.trataErro(error)
          })
      },
      buscaFormsDisponiveis () {
        this.loading.formulariosDisponiveis = true
        axiosLaravel.get('formulario/projeto/' + this.numeroProjeto + '/disponivel').then((response) => {
          if (_.has(response.data, 'codigo') && response.data.codigo === 'OK') {
            this.listaFormulariosDisponiveis = response.data.retorno
          } else {
            this.$snotify.error(response.data.mensagem)
          }
          this.loading.formulariosDisponiveis = false
        })
          .catch((error) => {
            this.loading.formulariosDisponiveis = false
            this.$root.trataErro(error)
          })
      },
      encaminharFormularioParaEntidade () {
        this.loading.tela = true
        let vm = this
        let formularioIgualAtivo = _.find(this.avaliacoesProjeto, function (form) { // Verifica se há formulário sendo preenchido (em execução) com o mesmo id do form selecionado
          return form.avaliacao.situacao !== 'CANCELADO' && form.formularioCadastrado.id === vm.formularioSelecionadoEnvioManual.id
        })
        let nomeFormSelecionado = this.formularioSelecionadoEnvioManual.id + ' - ' + this.formularioSelecionadoEnvioManual.nome
        let msg = formularioIgualAtivo ? 'Este formulário (<b>' + nomeFormSelecionado + '</b>) está atualmente vinculado ao projeto.<br/>Se continuar, então o atual será cancelado!' : 'Deseja vincular o formulário selecionado (<b>' + nomeFormSelecionado + '</b>) a este projeto?'
        this.$dialog.confirm(msg, {html: true, animation: 'fade', customClass: 'avisoAlerta'})
          .then(dialog => {
            axiosLaravel.post('formulario/vincula/', {'idFormularioCadastrado': vm.formularioSelecionadoEnvioManual.id, 'numeroProjeto': vm.numeroProjeto}).then((response) => {
              if (_.has(response.data, 'codigo') && response.data.codigo === 'OK') {
                this.buscaAvaliacoes()
                this.formularioSelecionadoEnvioManual = null
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
      reativar (idx) {
        this.loading.tela = true
        let idFormCadastrado = this.avaliacoesProjeto[idx]['formularioCadastrado']['id']
        let idProcessoParaReativar = this.avaliacoesProjeto[idx]['avaliacao']['id']
        let formularioIgualAtivo = _.find(this.avaliacoesProjeto, function (form) { // Verifica se há formulário sendo preenchido (em execução) com o mesmo id do form cadastado e fluxos do marco 0 ou 1
          return form.avaliacao.situacao !== 'CANCELADO' && form.formularioCadastrado.id === idFormCadastrado
        })
        let msg = formularioIgualAtivo ? 'A avaliação <b>' + idProcessoParaReativar + '</b> que deseja Reativar já tem um formulário igual (<b>' + formularioIgualAtivo.avaliacao.id + '</b>) não cancelado e vinculado a este projeto.<br/>Se continuar, então o processo atual será cancelado em favor do novo reativado!' : 'Deseja reativar esta avaliação <b>' + idProcessoParaReativar + '</b> ?'
        this.$dialog.confirm(msg, {html: true, animation: 'fade', customClass: 'avisoAlerta'})
          .then(dialog => {
            axiosLaravel.put('formulario/processo/' + idProcessoParaReativar + '/reativar/').then((response) => {
              if (_.has(response.data, 'codigo') && response.data.codigo === 'OK') {
                this.buscaAvaliacoes()
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
            console.log('Cancelou a reativação de processo de avaliação neste projeto')
          })
      },
      cancelar (id) {
        this.loading.tela = true
        axiosLaravel.put('formulario/processo/' + id + '/cancelar/').then((response) => {
          if (_.has(response.data, 'codigo') && response.data.codigo === 'OK') {
            this.buscaAvaliacoes()
            this.buscaFormsDisponiveis()
          } else {
            this.aviso(response.data)
          }
        })
          .catch((error) => {
            this.loading.tela = false
            this.$root.trataErro(error)
          })
      }
    }
  }
</script>

<style scoped>
  .avaliacoesProjeto .centralizado {
    text-align: center !important;
  }
</style>
