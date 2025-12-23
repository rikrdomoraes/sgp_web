<template>
<!-- Modal -->
<div class="modal fade" id="visualizar" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
  <div class="modal-dialog" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body">
        <section class="content">
        <div class="box-header with-border">
          <h3 class="box-title"><i class="fa fa-caret-right" aria-hidden="true"></i> Consulta: Solicitação de {{textoTipo}}</h3>
        </div>
          <div  class="row" >
            <div class="col-sm-12" >
              <form name="frmSearch" class="form-horizontal" novalidate>
                <div class="form-group required" >
                  <div class="col-md-6 col-md-offset-1">
                    <dl class="proposal-definition-list">
                      <dt>Projeto: </dt>
                      <dd>{{nomeProjeto}}</dd>

                      <dt>Tipo de Solicitação:</dt>
                      <dd><span>{{textoTipo}}</span></dd>
                    </dl>
                  </div>


                  <div class="col-md-5">
                    <dl class="proposal-definition-list">
                      <dt>Etapa: </dt>
                      <dd>{{etapa}}</dd>

                      <dt>Situação:</dt>
                      <dd><span>{{situacao}}</span></dd>
                    </dl>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </section>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-dismiss="modal">Fechar</button>
      </div>
    </div>
  </div>
</div>
</template>
<script>
  export default {
    name: 'visualizar',
    data () {
      return {
        data: [],
        items: []
      }
    },
    created: function () {
      this.carregaTarefa()
    },
    mounted: function () {
    },
    methods: {
      carregaTarefa () {
        axiosLaravel.get('processos', this.row.id).then((response) => {
          this.req = response.data
        })
          .catch((error) => {
            console.log('error', error)
            this.$root.trataErro(error)
          })
      }
    }
  }
</script>

<style scoped>
</style>
