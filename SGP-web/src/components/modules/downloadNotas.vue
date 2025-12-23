<template>
  <div>
    <div class="row">
      <div class="col-md-12">

        <!-- file:STATE_VIEW -->
        <div v-if="propsValidacao.tarefas[0].nome === 'Análise' || propsValidacao.tarefas[0].nome === 'Autorização'" class="form-group">
          <div class="col-md-6 col-lg-4">
            <a @click="onDownload" href="javascript:void(0)"><i class="fa fa-download" aria-hidden="true"></i> Download das Notas Fiscais</a><br/>
          </div>
        </div>
        <div class="col-md-12">
          <progress-bar v-if="dowloading" type="line" ref="progressBar" :options="options"></progress-bar>
        </div>

        <!-- file:DOWNLOADING -->
        <!--<div ng-if="$ctrl.state == 'STATE_DOWNLOADING'" class="form-group">-->
          <!--<div class="col-md-6 col-lg-4">-->
            <!--<div class="progress-group">-->
              <!--<span class="progress-text">Download</span>-->
              <!--<span class="progress-number"><b>{{$ctrl.progress | number:2}}%</b></span>-->
              <!--<div class="progress sm">-->
                <!--<div class="progress-bar" style="background-color:#0038a8; width:{{$ctrl.progress}}%"></div>-->
              <!--</div>-->
            <!--</div>-->
          <!--</div>-->
        <!--</div>-->

      </div>
    </div>
  </div>
</template>

<script>
    export default {
      name: 'download-notas',
      data () {
        return {
          state: null,
          dowloading: false,
          percentCompleted: null,
          options: {
            color: '#007AFF',
            strokeWidth: 2.0,
            trailColor: '#eeeeee',
            svgStyle: {
              // display: 'block',
              width: '20%'
            }

          }
        }
      },
      props: ['propsValidacao'],
      methods: {
        onDownload () {
          this.dowloading = true
          axiosLaravel.get('processos/documentos/download/' + this.propsValidacao.id).then((response) => {
            this.items = response.data
            this.table.totalRows = response.data.length
            this.loading.show = false
            this.$forceUpdate()
          })
            .catch((error) => {
              if (error) {
                this.$root.trataErro(error)
              }
            })
        }
      }
    }
</script>

<style scoped>

</style>
