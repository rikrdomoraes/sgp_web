<template>
  <div class="content-wrapper" style="min-height: 870px;">
    <!-- ngView: --><div ng-view="" class="fade-transition ng-scope" style=""><!-- content header (page header) -->
    <section class="content-header ng-scope">
      <h1>Detalhamento da Aprovação de Entidade</h1>
      <b-breadcrumb :items="breadcrumb"/>
    </section>

    <!-- main content -->
    <section class="content ng-scope">
      <div class="row">
        <div class="col-md-12">
        <div class="box box-primary">
        <div class="box-header with-border">
          <h3 v-if="detalhe.entityApprovalType" class="box-title">
            <i class="fa fa-caret-right" aria-hidden="true"></i>
								<span v-if="detalhe.entityApprovalType === 'FIRST_APPROVAL' && detalhe.eventStatus !== 'DONE'">Primeira Aprovação</span>
								<span v-if="detalhe.entityApprovalType === 'SECOND_APPROVAL' && detalhe.eventStatus !== 'DONE'">Segunda Aprovação</span>
                <span v-if="detalhe.eventStatus === 'DONE'">Aprovação Finalizada</span>
          </h3>
        </div>
        <div class="box-body no-padding" ssm-lte-loading="loading-info">
          <div v-if="!analise.approvalResult" class="mailbox-controls with-border text-center">
            <!-- /.btn-group -->
          </div>
          <div class="mailbox-read-info">
            <div class="form-horizontal">
              <span class="col-md-2 control-label link-muted">Status:</span>
              <div class="col-md-10">
                <p v-if="detalhe.eventStatus === 'DONE'" class="form-control-static text-success">APROVADO</p>
                <p v-if="analise.approvalResult === 'REJECTED'" class="form-control-static text-danger">REJEITADO</p>
                <p v-if="analise.approvalResult === '' && detalhe.eventStatus !== 'DONE'" class="form-control-static text-primary">AGUARDANDO VALIDAÇÃO</p>
              </div>
              <div v-if="detalhe.updatedAt" >
                <span class="col-md-2 control-label link-muted">Data da operação:</span>
                <div class="col-md-10">
                  <label class="form-control-static">{{ dataAtualizacao }}</label>
                </div>
              </div>
              <div v-if="analise.justify" >
                <span class="col-md-2 control-label link-muted">Justificativa:</span>
                <div class="col-md-10">
                  <label class="form-control-static">{{ analise.justify }}</label>
                </div>
              </div>
              <div v-if="detalhe.proposalRelease" >
                <span class="col-md-2 control-label link-muted">Liberado para proposta:</span>
                <div class="col-md-10">
                  <label v-if="detalhe.proposalRelease === 'true'" class="form-control-static text-success">SIM</label>
                  <label v-if="detalhe.proposalRelease === 'false'" class="form-control-static text-danger">NÃO</label>
                </div>
              </div>
              <div v-if="detalhe.user" >
                <span class="col-md-2 control-label link-muted">Atendido por:</span>
                <div class="col-md-10">
                  <label class="form-control-static">{{ detalhe.user.userName }}</label>
                </div>
              </div>
              <div>
                <span class="col-md-2 control-label link-muted">Entidade:</span>
                <div class="col-md-10">
                  <label class="form-control-static">{{ detalhe.entity.businessName }}</label>
                </div>
              </div>
              <div ng-if="mainEntDetAppCtrl.approval.entity.codForERp != null" >
                <span class="col-md-2 control-label link-muted">Código no Sapiens:</span>
                <div class="col-md-10">
                  <label class="form-control-static">{{ detalhe.entity.codForERp }}</label>
                </div>
              </div>
              <div >
                <span class="col-md-2 control-label link-muted">Criado em:</span>
                <div class="col-md-10">
                  <label class="form-control-static">{{ dataCriacao }}</label>
                </div>
              </div>
              <div >
                <span class="col-md-2 control-label link-muted">Atualizado em:</span>
                <div class="col-md-10">
                  <label class="form-control-static">{{ dataAtualizacao }}</label>
                </div>
              </div>
            </div>
          </div>
        </div>
          <div v-if="detalhe.entityApprovalType">
            <a @click="$router.go(-1)" class="btn btn-default btn-sm">
              <i class="fa fa-reply" aria-hidden="true"></i> Voltar à tela anterior
            </a>
          </div>
      </div>
      </div>
      </div>
    </section>
  </div>
  </div>
  <!-- /.box -->
</template>
<script>
  import { mapGetters } from 'vuex'
  import moment from 'moment'

  export default {
    components: {
    },
    name: 'DetalheValidaEntidade',
    data () {
      return {
        campoErro: null,
        detalhe: {},
        analise: {
          approvalResult: '',
          justify: ''
        },
        usuarios: {}
      }
    },
    computed: {
      ...mapGetters([
        'usuarioLogado'
      ]),
      dataCriacao: function () {
        return moment(this.detalhe.createdAt).format('DD/MM/YYYY')
      },
      dataAtualizacao: function () {
        return moment(this.detalhe.updatedAt).format('DD/MM/YYYY')
      }
    },
    created () {
      this.loadApproval()
    },
    methods: {
      loadApproval () {
        axios.get('/proxy/account/approval-entity/' + this.$route.params.id).then((response) => {
          this.detalhe = response.data.value
        })
          .catch((error) => {
            this.$root.trataErro(error)
          })
      },
      onUnassign () {
        let url = 'proxy/account/approval-entity/'
        axios.put(url + this.$route.params.id + '/unassign', '').then((response) => {
          this.onSearch()
        })
          .catch((error) => {
            this.$root.trataErro(error)
          })
      },
      onAssign () {
        let url = 'proxy/account/approval-entity/'
        axios.put(url + this.$route.params.id + '/assign', '').then((response) => {
          this.onSearch()
        })
          .catch((error) => {
            this.$root.trataErro(error)
          })
      }
    }
  }
</script>

<style scoped>


</style>
