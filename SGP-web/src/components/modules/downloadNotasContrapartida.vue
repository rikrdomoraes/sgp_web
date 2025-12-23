<template>
  <div>
    <div class="row">
      <div class="col-md-12">

        <!-- file:STATE_VIEW -->
        <div v-if="propsValidacao.counterpartRequestApprovalPhase === 'ANALYSIS'" class="form-group">
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
      name: 'download-notas-contrapartida',
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
          axios.get('proxy/project/requests/' + this.propsValidacao.counterpartRequest.id + '/receipts/download', {
            responseType: 'arraybuffer', // Precisa desse header -> arraybuffer para fazer o download funcionar direito
            onDownloadProgress: progressEvent => {
              this.percentCompleted = (progressEvent.loaded / progressEvent.total).toFixed(2)
              this.$refs.progressBar.animate(this.percentCompleted)
              this.$refs.progressBar.setText(this.percentCompleted * 100 + '%')
              if (progressEvent.loaded === progressEvent.total) {
                setTimeout(() => {
                  this.dowloading = false
                }, 1000)
              }
            }
          }).then((response) => {
            let ie = !!window.MSInputMethodContext && !!document.documentMode
            if (!ie) {
              let blob = new Blob([response.data], { type: 'application/zip' })
              let link = document.createElement('a')
              link.href = window.URL.createObjectURL(blob)
              link.download = 'download.zip'
              document.body.appendChild(link)
              link.click()
              document.body.removeChild(link)
            } else {
              let blob = new Blob([response.data], { type: 'application/zip' })
              let link = document.createElement('blob')
              link.href = window.navigator.msSaveOrOpenBlob(blob, 'download.zip')
              link.download = 'download.zip'
              link.click()
            }
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
