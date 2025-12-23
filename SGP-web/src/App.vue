<template>
  <div id="app" class="wrapper">
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'App',
  data () {
    return {
      data: [],
      mensagens: []
    }
  },
  // updated () {
  //   this.mensagens = []
  //   axiosLaravel.get('notificacoes/').then((response) => {
  //     if (response.data) {
  //       let msg = response.data
  //       let contador = 0
  //       for (let i = 0; i < msg.length; i++) {
  //         this.mensagens.push(msg[i].data.mensagem)
  //         contador = msg.length
  //       }
  //       let mostraMsg = this.mensagens.toString().split(',').join('<br>')
  //       if (contador > 0) {
  //         this.$swal({
  //           title: '<font color="red"><i><u>Notificações' + '</i></u></font>',
  //           html:
  //             '<br><br><div align="left">Quantidade: <b>' + contador + '</b> não lida(s).</div><br>' +
  //             '<div align="left"><b>' + mostraMsg + '</b></div>',
  //           showCloseButton: true,
  //           showCancelButton: false,
  //           showLoaderOnConfirm: true,
  //           animation: 'zoom',
  //           focusConfirm: false
  //         })
  //       }
  //     }
  //   })
  //     .catch((error) => {
  //       if (error) {
  //         this.$root.trataErro(error)
  //       }
  //     })
  // },
  methods: {
    show () {
      this.$modal.show('visualizar')
      this.$forceUpdate()
    },
    hide () {
      this.$modal.hide('visualizar')
    }
  }
}
</script>
<style scoped>
  .topo {
    top: 0.4%;
    height: 50%;
  }
  .modal-wrapper {
    display: table-cell;
    vertical-align: middle;
  }
</style>
