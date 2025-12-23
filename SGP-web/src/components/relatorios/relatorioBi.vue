<template>
  <div class="content-wrapper" style="min-height: 870px;">

    <vue-headful :title="'SGP - Relatórios BI'"/>

    <div ng-view="" class="fade-transition ng-scope" style=""><!-- content header (page header) -->
      <!--Breadcrumb-->
      <section class="content-header ng-scope">
        <h1>Relatórios</h1>

      </section>
      <section class="content ng-scope">
        <div class="row">
          <div class="col-md-12">
            <div class="ng-scope ng-isolate-scope"><div class="box box-primary">
              <div class="box-header with-border">
                <h3 class="box-title"><i class="fa fa-picture-o" aria-hidden="true"></i> Relatórios BI</h3>
              </div>
              <div class="box-body" >
                <form name="frmRegNotice" class="form-horizontal ng-pristine ng-valid-mask ng-valid-maxlength ng-valid-minlength ng-valid-max ng-valid-date ng-valid ng-valid-required" novalidate="" _lpchecked="1" style="">
                  <div class="form-group required" :class="{ 'has-error' : errors.first('')}">
                    <label for="tipoDoRelatorio" class="control-label col-md-2">Relatório:</label>
                    <div class="col-md-4">
                      <select v-model="relatorio" name="tipoRelatorio" class="form-control ng-pristine ng-untouched ng-valid ng-empty">
                        <option :value="relatorio" v-for="relatorio in relatorios">{{relatorio.descricao}}</option>
                      </select>
                      <span v-if="errors.first('')" class="label label-danger"> {{ errors.first('') }}</span>
                    </div>
                  </div>
                </form>
                <div class="box-footer">
                  <g-button-moema color="success" @click.native="show = !show" type="button" size="button--size-ss"><i class="fa fa-check-circle-o" aria-hidden="true"></i> Gerar </g-button-moema>
                  <g-button-moema color="primary" @click.native="onClean" type="button" size="button--size-ss" ><i class="fa fa-eraser" aria-hidden="true"></i> Limpar</g-button-moema>
                  <!--<button @click="show = !show" type="button" class="btn btn-success btn-flat"><i class="fa fa-check-circle-o" aria-hidden="true"></i> Gerar</button>-->
                  <!-- <button @click="show = false" type="button"  class="btn btn-default btn-flat"><i class="fa fa-eraser" aria-hidden="true"></i> Limpar</button>-->
                </div>
                <div v-if="show" id="painel" > <!-- style="height:1000px; width:1000px" -->
                    <iframe style="height:1000px; width:10000px;" :src="relatorio.link" frameborder="0" allowfullscreen="true"></iframe>
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
    export default {
      name: 'relatorioBi',
      data () {
        return {
          loading: {
            show: false
          },
          relatorio: {},
          relatorios: [],
          show: null,
          iframe: {
            style: null,
            wrapperStyle: null,
            position: 'absolute'
          }
        }
      },
      created: function () {
        axios.get('proxy/utility/bi-report').then((response) => {
          this.relatorios = response.data.value
        })
          .catch((error) => {
            this.$root.trataErro(error)
          })
      },
      methods: {
        onShow () {
          this.show = true
        },
        onClean () {
          this.show = false
          this.relatorio.descricao = null
        }
      }
    }
</script>

<style scoped>

</style>
