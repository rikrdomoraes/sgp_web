<template>
  <div>

    <aside class="control-sidebar control-sidebar-light barraControle" ref="barraControle" style="position: fixed">

      <!-- tabs icones -->
      <ul class="nav nav-tabs nav-justified control-sidebar-tabs">
        <li class="active">
          <a href="#tab-agenda" data-toggle="tab" aria-expanded="true">
            <i class="fa fa-list-alt"></i>
          </a>
        </li>
        <!--<li class="">-->
          <!--<a href="#tab-chat" data-toggle="tab" aria-expanded="true">-->
            <!--<i class="fa fa-comments"></i>-->
          <!--</a>-->
        <!--</li>-->
        <!--<li class="">-->
          <!--<a href="#tab-configuracao" data-toggle="tab" aria-expanded="true">-->
            <!--<i class="fa fa-gears"></i>-->
          <!--</a>-->
        <!--</li>-->
      </ul>


      <!-- Tab panes -->
      <div class="tab-content">

        <!-- Agenda -->
        <div id="tab-agenda" class="tab-pane active">
          <h3 class="agendaTitulo">
            Agenda de Vencimentos
            <div class="agendaFiltros">
              <span @click="filtrar('Mandato dirigente')" :title="'<h5>Mandato de Dirigentes</h5>'" v-tippy="{inertia:true, arrow:true, animation:'perspective', distance:'1', size:'large', arrow:true}">
                <i :class="'fa ' + icones['Mandato dirigente'] + (_.includes(this.ocultarTipo, 'Mandato dirigente') ? ' filtroAtivo': '')"></i>
                <span class="agendaContador">{{ehNulo(contador['Mandato dirigente'], 0)}}</span>
              </span>
              <span @click="filtrar('Acompanhamento')" :title="'<h5>Acompanhamento de projeto</h5>'" v-tippy="{inertia:true, arrow:true, animation:'perspective', distance:'1', size:'large', arrow:true}">
                <i :class="'fa ' + icones['Acompanhamento'] + (_.includes(this.ocultarTipo, 'Acompanhamento') ? ' filtroAtivo': '')"></i>
                <span class="agendaContador">{{ehNulo(contador['Acompanhamento'], 0)}}</span>
              </span>
              <span @click="filtrar('Relatório de Execução')" :title="'<h5>Relatórios de Execução</h5>'" v-tippy="{inertia:true, arrow:true, animation:'perspective', distance:'1', size:'large', arrow:true}">
                <i :class="'fa ' + icones['Relatório de Execução'] + (_.includes(this.ocultarTipo, 'Relatório de Execução') ? ' filtroAtivo': '')"></i>
                <span class="agendaContador"> {{ehNulo(contador['Relatório de Execução'], 0)}}</span>
              </span>
              <span @click="filtrar('Documento')" :title="'<h5>Documentos diversos</h5>'" v-tippy="{inertia:true, arrow:true, animation:'perspective', distance:'1', size:'large', arrow:true}">
                <i :class="'fa ' + icones['Documento'] + (_.includes(this.ocultarTipo, 'Documento') ? ' filtroAtivo': '')"></i>
                <span class="agendaContador"> {{ehNulo(contador['Documento'], 0)}}</span>
              </span>

              <span :title="'<h5>Período de vencimentos de<br/>' + dataFormat(_.head(_.keys(agenda))) + ' (semana anterior)<br/>até ' + dataFormat(_.last(_.keys(agenda))) + ' (' + mesesDepois + ' meses)</h5>'" v-tippy="{inertia:true, arrow:true, animation:'perspective', distance:'1', size:'large', arrow:true}" style="float: right">
                <i class="fa fa-question"></i>
              </span>
            </div>
          </h3>
          <div class="listaVencimentos" v-bind:style="'height: 450px;'">

            <div v-show="loading" style="top: 20px;left: 50%;position: relative;font-size: 20px;"><i class="fa fa-refresh fa-spin"></i></div>

            <template v-for="data in _.keys(agenda)">

              <ul v-show="(_.filter(agenda[data], function (i) { return !_.has(i, 'mostrar') || i.mostrar })).length > 0">
                <div class="agendaData">{{data | moment("LL")}}
                  <span v-if="data === hoje" class="agendaHoje">hoje</span>
                </div>

                <template v-for="item in agenda[data]">

                  <li v-show="!_.has(item, 'mostrar') || item.mostrar" @click="verificar(item)" :title="'<h5>' + infoTooltip(item) + '</h5>'" v-tippy="{inertia:true, arrow:true, delay:800, duration:0, animation:'perspective', distance:'1', size:'large', arrow:true}">
                    <div class="agendaGrupo">
                      <i :class="'fa ' + icones[item.tipo]"></i>
                    </div>

                    <div class="agendaOrigem">{{origem(item)}}&nbsp;</div>

                    <div class="agendaDetalhe">
                      <span class="infoSubtipo">{{item.subtipo}}</span> {{item.info}}
                    </div>
                  </li>

                </template>

              </ul>

            </template>

          </div>

        </div>


        <!-- Usuários online -->
        <div id="tab-chat" class="tab-pane">
          <div>
            <h3 class="control-sidebar-heading">Usuários logados</h3>

            <ul>
              <template v-for="usuario in usuariosLogados">

                  <li>
                    <p>Nome: {{usuario.ds_nome_usuario}}</p>
                    <p>Login: {{usuario.ds_login}}</p>
                    <p>E-mail: {{usuario.ds_email}}</p>
                    <p>Tipo: {{usuario.ds_tipo_usuario}}</p>
                  </li>

                </template>
              </ul>

          </div>
        </div>


        <!-- Configurações -->
        <div id="tab-configuracao"class="tab-pane">
          <div>
            <h3 class="control-sidebar-heading">Configurações</h3>
          </div>
        </div>


      </div>


    </aside>

    <!-- /.control-sidebar -->
    <!-- Add the sidebar's background. This div must be placed
         immediately after the control sidebar -->
    <div class="control-sidebar-bg"></div>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import moment from 'moment'

  export default {
    name: 'ControlSidebar',
    data () {
      return {
        loading: true,
        mesesDepois: 3, // Qtde de meses após hoje que deve ser filtrado no BD
        agenda: [],
        contador: {},
        ocultarTipo: [],
        usuariosLogados: [],
        hoje: moment().format('YYYY-MM-DD'),
        icones: {'Mandato dirigente': 'fa-gavel', 'Acompanhamento': 'fa-pencil-square-o', 'Relatório de Execução': 'fa-calendar-check-o', 'Documento': 'fa-file-o'}
      }
    },
    created: function () {
      console.clear()
      if (this.usuarioLogado.userType === 'FUNDACAO') {
        axiosLaravel.get('vencimentos/listar/' + this.mesesDepois).then((response) => {
          this.agenda = _.groupBy(response.data, 'data')
          this.contador = _.countBy(_.flatMap(this.agenda), 'tipo')
          this.loading = false
        })
          .catch((error) => {
            this.$root.trataErro(error)
          })
      }
    },
    computed: {
      ...mapGetters([
        'usuarioLogado'
      ])
    },
    mounted: function () {
      // this.$refs['hoje'].scrollIntoView()
      this.assinaUsuariosLogados()
    },
    methods: {
      ehNulo (valor, opcao) {
        return _.isNull(valor) || _.isNil(valor) || _.isUndefined(valor) ? opcao : valor
      },
      verificar (item) {
        if (item.tipo === 'Relatório de Execução') {
          this.$router.push({name: 'visualiza-relatorio-execucao', params: {id: item.proposta_id}})
        } else if (_.includes(['Mandato dirigente', 'Documento'], item.tipo) && !_.isNull(item.entidade_id)) {
          this.$router.push({name: 'cadastro-entidade-edita', params: {id: item.entidade_id}, hash: (item.tipo === 'Documento' ? '#documentos' : '#dirigentes')})
        } else if (_.includes(['Acompanhamento', 'Documento'], item.tipo) && !_.isNull(item.projeto)) {
          if (!_.isNaN(_.toNumber(item.projeto.substr(0, 5)))) {
            this.$router.push({name: 'projeto', params: {numero: item.projeto.substr(0, 5)}})
          } else {
            this.$router.push({name: 'proposta-visualiza', params: {id: item.proposta_id}})
          }
        }
        this.$refs.barraControle.classList.remove('control-sidebar-open') // Fecha a barra de controles (aside)
      },
      filtrar (tipo) {
        let op
        if (_.includes(this.ocultarTipo, tipo)) {
          op = true
          _.remove(this.ocultarTipo, function (t) { return t === tipo })
        } else {
          op = false
          this.ocultarTipo.push(tipo)
        }
        let map = _.flatMap(this.agenda)
        _.forEach(map, function (i) {
          if (i.tipo === tipo) {
            _.set(i, 'mostrar', op)
          }
        })
        this.contador = _.countBy(_.filter(map, function (m) { return !_.has(map, 'mostrar') || map.mostrar }), 'tipo')
        this.$forceUpdate()
      },
      origem (item) {
        return (item.tipo === 'Mandato dirigente' ? item.entidade : (_.includes(['Relatório de Execução', 'Acompanhamento'], item.tipo) ? item.projeto : this.ehNulo(item.entidade, item.projeto)))
      },
      dataFormat (dt) {
        return moment(dt).format('DD/MM/YYYY')
      },
      infoTooltip (item) {
        let msg = this.origem(item) + '<hr>Em ' + this.dataFormat(item.data) + '<br/>'
        msg += 'Vencimento de ' + (_.includes(['Documento', 'Acompanhamento'], item.tipo) ? item.subtipo : (item.tipo === 'Mandato dirigente' ? 'mandato de ' + item.subtipo : item.tipo)) + '<br/>'
        msg += item.info + '</h5>'
        return msg
      },
      assinaUsuariosLogados () {
        Echo.leave('usuarios-logados')
        window.Echo.join('usuarios-logados')
          .here((users) => {
            this.usuariosLogados = users
            this.$forceUpdate()
          })
          .joining((user) => {
            this.usuariosLogados.push(user)
          })
          .leaving((user) => {
            this.usuariosLogados.splice(this.usuariosLogados.findIndex(logado => logado.id === user.id), 1)
          })
      }
    }
  }
</script>

<style scoped>
  .barraControle.control-sidebar-open {
    width: 30%;
    box-shadow: 1px 5px 10px rgba(112,112,112,0.5);
  }
  #tab-agenda {
    margin: -10px;
  }
  .agendaTitulo {
    margin: 10px;
    font-size: 16px;
    border-bottom: 1px solid silver;
  }
  .agendaFiltros {
    margin: 10px 0px;
  }
  .agendaFiltros span {
    margin-right: 10px;
    cursor: pointer;
  }
  .agendaFiltros .filtroAtivo {
    color: lightgrey;
  }
  .agendaFiltros span:hover {
    color: steelblue !important;
  }
  .agendaContador {
    color: steelblue;
    font-variant: diagonal-fractions;
    margin-left: 0 !important;
  }
  .listaVencimentos {
    min-height: auto;
    overflow-y: auto;
  }
  #tab-agenda ul {
    margin: 10px 5px;
    padding: 0;
    list-style: none;
  }
  .agendaData {
    font-weight: bold;
  }
  .agendaHoje {
    float: right;
    background: gold;
    padding: 0 20px;
    border-radius: 14px;
  }
  .agendaGrupo {
    float: left;
    margin: 10px 5px;
  }
  #tab-agenda li {
    border-bottom: 1px solid silver;
    padding: 2px;
    cursor: pointer;
  }
  #tab-agenda li:hover {
    color: steelblue;
  }
  .agendaOrigem, .agendaDetalhe {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .infoSubtipo {
    color: silver;
    font-style: italic;
  }

  .control-sidebar-bg {
    width: 0;
  }
</style>
