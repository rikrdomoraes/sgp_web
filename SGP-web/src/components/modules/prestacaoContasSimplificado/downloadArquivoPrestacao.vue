  <!-- 74213 - Módulo de Prestação de Contas para Processo Simplificado-->
  <template>
    <div class="content-wrapper" style="min-height: 870px;">
      <section class="content-header ng-scope">
        <vue-headful :title="'SGP - Solicitações'"/>
        <h1> <i class="fa fa-file-pdf-o" aria-hidden="true"></i> BAIXANDO ARQUIVO... {{ $route.params.id }}</h1>
       </section>
       <div class="column all-centered overlay-loading">
            <i class="fa fa-cloud-download prest-scale"></i>
            Aguarde...
       </div>
    </div>  
  </template>
  
  <script>
    import { mapGetters } from 'vuex'
    import moment from 'moment'
    export default {
      components: {
      },
      name: 'downloadArquivoPrestacao',
      data () {
        return {
          layoutExtrato: 'classico',
          documentoBaixado: {}
        }
      },
      props: {
      },
      computed: {
        ...mapGetters([
          'usuarioLogado'
        ]),
        chiefActive () {
          return this.usuarioLogado.entity.chiefs.some(chefe => {
            return chefe.active === true && moment(new Date()).isSameOrAfter(moment(chefe.initialMandateDate)) && moment(new Date()).isSameOrBefore(moment(chefe.endMandateDate))
          })
        }
      },
      created: function () {
      },
      mounted: function () {
        console.log('BAIXANDO ARQUIVO...')
        if (this.usuarioLogado.userType === 'FUNDACAO') {
          this.getDocumento(this.$route.params.id)
        } else {
          this.$snotify.error('Você não tem permissão para acessar esta rota.')
          this.$router.push({name: '/dashboard'})
        }
      },
      methods: {
        getDocumento (id) {
          this.$snotify.async('Procurando informações sobre o arquivo...')
          axiosLaravel.get('prestacaoSimplificada/getDocumento/' + id).then((response) => {
            this.documentoBaixado = response.data
            this.downloadAnexo(id)
          })
            .catch((error) => {
              this.$snotify.clear()
              this.$snotify.error('Erro ao encontrar informações sobre o arquivo. Tente novamente mais tarde.')
              console.log(error)
              this.$root.trataErro(error)
            })
        },
        downloadAnexo (id) {
          this.$snotify.async('Baixando anexo...')
          axiosLaravel.get('prestacaoSimplificada/downloadArquivoPorId/' + id, {responseType: 'arraybuffer'}).then((response) => {
            console.log(response.data)
            let ie = !!window.MSInputMethodContext && !!document.documentMode
            let documento = this.documentoBaixado
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
            this.fecharAba()
            this.$snotify.clear()
          })
            .catch((error) => {
              this.$snotify.clear()
              this.$snotify.error('Erro ao baixar o arquivo. Tente novamente mais tarde.')
              console.log(error)
              this.$root.trataErro(error)
            })
        },
        fecharAba () {
          setTimeout(() => {
            this.$snotify.clear()
            this.$router.push({name: '/dashboard'})
            window.close()
          }, 2000)
        }
      }
    }
  </script>
  
  <style src="../../../../static/css/prestacaoContasNovo.css">
  </style>
  