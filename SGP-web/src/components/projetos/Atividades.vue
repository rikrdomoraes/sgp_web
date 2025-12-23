<template>
  <div class="box-body" style="overflow: auto" >

        <!-- TODO: undefined quando não há relatório deve ser desconsiderado-->
    <div v-show="mostrarOpcoes" class="row">
      <div class="col-md-12">

        <div class="quadro_opcoes" v-bind:style="'min-height: ' + ((atividades.length * 30 ) + 20) + 'px;'">

          <div class="zoom">Zoom no gantt <select v-model="zoom"><option v-for="z in _.range([start=1], 3, [step=.5])">{{z}}</option></select></div>

          <div class="margem">Distância das atividades <select v-model="tamanho_nome_atividade"><option v-for="d in _.range([start=400], 700, [step=50])">{{d}}</option></select></div>

          <div class="tipo_barra">Mostrar execução por <select v-model="tipo_barra"><option value="financeiro">% do orçado / liberado</option><option value="declarado">% informado no relatório</option></select></div>

          <div class="mostrar_exec_financeira">Mostrar Valor Liberado e Orçado <select v-model="mostrar_execucao_financeira"><option v-bind:value="true">Sim</option><option v-bind:value="false">Não</option></select></div>

          <div class="mostrar_exec_declarada">Mostrar Percentual Declarado <select v-model="mostrar_execucao_declarada"><option v-bind:value="true">Sim</option><option v-bind:value="false">Não</option></select></div>

          <div>
            <button @click="carregaAtividades" :title="'<h5>Clique para trazer os dados salvos até o momento</h5>'" v-tippy="{ inertia : true, arrow : true,  animation : 'fade', distance:'1', size: 'large'}" class="btn btn-primary btn-flat"><i :class="'fa fa-refresh'"></i> Atualizar o gráfico</button>
          </div>

        </div>

      </div>

    </div>


    <div>
      <div class="col-md-12 gantt_atividades" v-bind:style="projeto.hoje_dias ? '' : 'margin-left: -15px'">
        <div>

          <div class="cabecalho">
            <div class="linha_marcadoras" v-bind:style="'height: ' + ((atividades.length * 30 ) + 30) + 'px;'">

              <div class="titulo" v-bind:style="'width: ' + tamanho_nome_atividade + 'px'">Atividades</div>

              <div v-for="periodo in projeto.periodos"
                class="periodos_projeto" v-bind:style="'margin-left: ' + (parseInt(tamanho_nome_atividade) + ((30 * zoom) * (periodo - 1))) + 'px;' + 'width: ' + (30 * zoom) + 'px;'">{{periodo}}
              </div>

              <div v-show="projeto.hoje_dias" class="hoje" v-bind:style="'margin-left: ' + (parseInt(tamanho_nome_atividade) + ((projeto.hoje_dias < ((projeto.periodos * 30) + 30) ? projeto.hoje_dias : ((projeto.periodos * 30) + 30))) * zoom) + 'px; height: ' + ((atividades.length * 30 ) + 60) + 'px; padding: ' + ((atividades.length * 30 ) + 40) + 'px 10px 0px 5px;'">
                <span :title="'<h5>' + (dia_noite === 'DIA' ? 'Bom dia!' : dia_noite === 'TARDE' ? 'Boa Tarde!' : 'Boa noite!') + '<br/> Já se passaram <b>' + projeto.hoje_dias + ' dias' + '</b> do início do projeto</h5>'"
                      v-tippy="{ inertia : true, arrow : true,  animation : 'fade', distance:'1', size: 'large', theme: 'light'}">

                  <i :class="dia_noite === 'DIA' ?  'fa fa-sun-o' : dia_noite === 'TARDE' ?  'fa fa-sun-o' : 'fa fa-moon-o'"></i> Hoje</span>
              </div>

            </div>

          </div>

          <div class="atividades" v-bind:style="'width: ' + ((30 * projeto.periodos * zoom) + parseInt(tamanho_nome_atividade) + 150) + 'px'">

              <div v-for="atividade in atividades" class="atividade">

                <div class="nome_atividade quebrar_texto" v-bind:style="'width: ' + tamanho_nome_atividade + 'px'">{{atividade.descricao}}</div>

                <div class="barra" v-bind:style="'margin-left: ' + (atividade.dias_inicio * zoom) + 'px; width: ' + (((atividade.dias_termino - atividade.dias_inicio) * zoom)) + 'px'"
                    :title="projeto.hoje_dias === null ? '<h5>' + atividade.descricao + '</h5>' : ('<h5>' +
                    atividade.descricao +
                    '<hr>' +
                    'Duração: ' + atividade.dias_termino + ' dias<br/>' +
                    '% Tempo decorrido: <span class=\'realce\'>' + (projeto.hoje_dias <= atividade.dias_inicio ? 0 : projeto.hoje_dias >= atividade.dias_termino ? 100 : ((projeto.hoje_dias / atividade.dias_termino) * 100 ) | percentage) + '%</span>' +
                    '<hr>' +
                    'Orçado: R$ '   + (parseFloat(atividade.orcado) | real) + '<br/>' +
                    'Liberado: R$ ' + (parseFloat(atividade.executado) | real) + '<br/>' +
                    '% Lib. Financeira: <span class=\'realce\'>' + (percentualExecutado(atividade.orcado, atividade.executado) | percentage) + '%</span>' +
                    '<hr>' +
                    '% Execução da Atividade: <span class=\'realce\'>' + (_.isNil(atividade.execucao) ? '0' : atividade.execucao) + '%' + '</span></h5>')"

                     v-tippy="{ inertia : true, arrow : true,  animation : 'fade', distance:'1', size: 'large'}">


                <!-- Barra 'Executada' -->
                  <div :class="(tipo_barra === 'declarado' ? atividade.execucao : percentualExecutado(atividade.orcado, atividade.executado)) >= 0 &&
                               (tipo_barra === 'declarado' ? atividade.execucao : percentualExecutado(atividade.orcado, atividade.executado)) < 100 ? 'atividade_executada alinha_esquerda sem_tamanho':
                                  (tipo_barra === 'declarado' ? atividade.execucao : percentualExecutado(atividade.orcado, atividade.executado)) >= 100 ? 'atividade_completa' : 'atividade_erro alinha_esquerda sem_tamanho'"

                       v-bind:style="'width: ' + (tipo_barra === 'declarado' ? atividade.execucao : percentualExecutado(atividade.orcado, atividade.executado)) + '% !important'">

                    <span v-if="mostrar_execucao_financeira && parseFloat(atividade.executado) > 0 && (parseFloat(atividade.executado) < parseFloat(atividade.orcado))">{{parseFloat(atividade.executado) | real}}</span>
                    <span v-else>&nbsp;</span>
                  </div>


                <!-- Barra 'Previsto' -->
                  <div class="atividade_prevista alinha_esquerda"
                       v-bind:style="'width: ' + (100 - (tipo_barra === 'declarado' && !_.isNil(atividade.execucao) ? atividade.execucao : percentualExecutado(atividade.orcado, atividade.executado))) + '% !important'">
                    <span>&nbsp;</span>
                  </div>


                </div>

                <div class="info_adicional">
                  <span v-if="mostrar_execucao_financeira">{{parseFloat(atividade.orcado) | real}}</span>
                  <span v-if="mostrar_execucao_declarada" class="percentual_execucao">{{atividade.execucao}}%</span>
                </div>

              </div>

          </div>


          <div class="rodape" v-show="projeto.hoje_dias">

            <div class="opcoes" @click="mostrarOpcoes = !mostrarOpcoes">
              <i class="fa fa-gears"></i> Opções
            </div>

            <div class="legenda"
                :title="'<table class=\'legenda_tabela\'>' +
                          '<tr><td class=\'atividade_executada\'>&nbsp;</td><td>Total liberado em pagamento, prestação de contas e contrapartidas</td></tr>' +
                          '<tr><td class=\'atividade_prevista\'>&nbsp;</td><td> Atividade prevista, valor não liberado </td></tr>' +
                          '<tr><td class=\'atividade_completa\'>&nbsp;</td><td> Atividade financeiramente completada </td></tr>' +
                          '<tr><td class=\'atividade_erro\'>&nbsp;</td><td> Erro de preenchimento da execução da atividade no relatório </td></tr>' +
                          '<tr><td style= \'background: #ca1b1b61\'>&nbsp;</td><td> Data atual no projeto </td></tr>' +
                        '</table>'"

                 v-tippy="{ inertia : true, arrow : true,  animation : 'fade', distance:'1', size: 'large', interactive: true, theme: 'light', trigger: 'click'}">

              <i class="fa fa-list"></i> Legenda
            </div>


          </div>

        </div>

        <div v-show="loadingShow" class="overlay" style="position: absolute; top: 0px; left: 0px; width: 100%; height: 100%; display: block; z-index: 100">
          <i class="fa fa-refresh fa-spin"></i>
        </div>

      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'visualiza-gantt',
    data () {
      return {
        atividades: [],
        tipo_barra: 'declarado', // escolha 'financeiro' quando o andamento da barra for ref. as liberações financeiras do projeto ou 'declarado' quando for os percentuais informados no último relatório
        zoom: 1, // proporção de zoom da barra de atividade (valores >=1)
        tamanho_nome_atividade: 400, // tamanho em px que será adicionado ao início da ativcidade para a descrição da atividade
        mostrar_execucao_financeira: false, // true mostra valores de execução financeira e false oculta
        mostrar_execucao_declarada: true, // true mostra o percentual declarado no último relatório de execução e false oculta
        projeto: {},
        relatorio_execucao_atividades: [],
        mostrarOpcoes: false,
        loadingShow: false,
        dia_noite: 'fa fa-sun-o'
      }
    },
    props: ['numeroProjeto', 'tipoBarra', 'mostrarExecFinanc', 'mostrarExecDeclarada', 'propsProposta'],
    watch: {
      'propsProposta.atividades': {
        handler: function (after, before) {
          this.carregaAtividades()
        },
        deep: true
      }
    },
    computed: {
    },
    mounted () {
    },
    created () {
      this.carregaAtividades()
    },
    methods: {
      carregaAtividades () {
        this.loadingShow = true
        // let vm = this
        //
        if (this.numeroProjeto) {
          axiosLaravel.get('atividade/gantt/' + this.numeroProjeto).then((response) => {
            this.projeto = response.data.projeto[0]
            this.atividades = response.data.atividades
            this.relatorio_execucao_atividades = response.data.relatorio_execucao_atividades
            //
            this.preparandoGantt()
          })
            .catch((error) => {
              console.log('error', error)
              this.$root.trataErro(error)
              this.loadingShow = false
            })
        } else {
          this.projeto['hoje_dias'] = null  // Indicando dias_hoje como null serão ocultados todos os objetos do gantt que se referem a execução (gráfico mais simples para proposta)
          this.projeto['inicio'] = this.propsProposta.dt_data_inicial // cortar 10 caracteres
          this.projeto['periodos'] = parseInt(this.propsProposta.nr_periodos)
          //
          // Inclusão de toFixed(2) para formatar saída do valor com 2 casas após a vírgula
          this.atividades = this.propsProposta.atividades
          _.forEach(this.atividades, function (o) {
            o['descricao'] = o['ds_nome']
            o['inicio'] = o['nr_periodo_inicial']
            o['termino'] = o['nr_periodo_final']
            o['executado'] = 0
            o['execucao'] = 0
            o['id'] = 0
            o['orcado'] = parseFloat((_.sumBy(o['itens_orcamentos'], function (i) { return (parseInt(i.quantidade) * i.valor_unitario) })).toFixed(2))
            o['dias_inicio'] = (o['inicio'] - 1) * 30
            o['dias_termino'] = o['termino'] * 30
          })
          this.relatorio_execucao_atividades = []
          this.preparandoGantt()
        }
      },
      // renomearPropriedade (obj, antes, depois) {
      //   if (_.hasIn(obj, antes)) {
      //     obj[depois] = _.clone(obj[antes], true)
      //     delete obj[antes]
      //   }
      //   return obj
      // },
      preparandoGantt () {
        if (!(_.isEmpty(this.relatorio_execucao_atividades))) {
          this.atividades.forEach((atividade) => {
            atividade['execucao'] = this.relatorio_execucao_atividades.find(exec => exec.id === atividade.id).execucao
          })
        }
        this.zoom = this.projeto.periodos > 20 ? 1 : 1.5 // Zoom iniciará com 1 quando houver mais de 20 meses ou 1.5 quando houver menos meses
        this.tipo_barra = this.tipoBarra
        this.mostrar_execucao_financeira = this.mostrarExecFinanc
        this.mostrar_execucao_declarada = this.mostrarExecDeclarada
        // this.dia_noite = (new Date().getHours() >= 18 ? 'NOITE' : 'DIA')
        if (new Date().getHours() >= 18) {
          this.dia_noite = 'NOITE'
        }
        if (new Date().getHours() < 18 && new Date().getHours() >= 12) {
          this.dia_noite = 'TARDE'
        }
        if (new Date().getHours() < 12 && new Date().getHours() >= 6) {
          this.dia_noite = 'DIA'
        }
        this.loadingShow = false
      },
      cor (situacao) {
        return (this.cores[situacao] === undefined) ? this.cores['NAO_HA'] : this.cores[situacao]
      },
      percentualExecutado (orcado, realizado) {
        return (parseFloat(realizado) / (parseFloat(orcado) === 0 ? 1 : parseFloat(orcado)) * 100)
      }
    }
  }
</script>

<style>
  .gantt_atividades {
    margin-left: -15px;
  }

  .gantt_atividades .atividades {
    width: 1500px;
    margin-top: 40px;
  }

  .gantt_atividades .atividade {
    width: 100%;
    float: left;
    z-index: 100;
    position: relative;
  }

  .gantt_atividades .nome_atividade {
    float: left;
    width: 200px;
    text-align: right;
    margin: 5px 0px;
    padding: 0px 10px;
  }

  .gantt_atividades .barra {
    margin: 5px;
    float: left;
    cursor: pointer;
    height: 20px;
  }

  .gantt_atividades .info_adicional {
    float: left;
    font-weight: bold;
    margin-top: 5px;
  }

  .gantt_atividades .linha_tempo {
    height: 50px;
    position: fixed;
    width: 100%;
  }

  .atividade_prevista {
    background: #808080;
    color: white;
  }

  .atividade_executada {
    background: #1565C0;
    color: white;
  }

  .atividade_erro {
    background: #c62828;
    color: white;
  }

  .atividade_completa {
    background: #2E7D32;
    color: white;
  }

  .gantt_atividades .alinha_esquerda {
    float: left;
  }

  .gantt_atividades .sem_tamanho {
    width: 0px
  }

  .gantt_atividades .cabecalho {
    position: absolute;
    top: 15px;
  }

  .gantt_atividades .titulo {
    font-weight: bold;
    text-align: right;
    border-top: 1px solid #ddd;
    padding-right: 10px;
    z-index: 10;
    float: left;
  }

  .gantt_atividades .linha_marcadoras{
    display: block;
    background: transparent;
    float: left;
    border-bottom: 1px solid #ddd;
    border-left: 1px solid #ddd;
  }

  .gantt_atividades .periodos_projeto {
    text-align: center;
    font-weight: bold;
    height: 100%;
    min-width: 30px;
    border-right: 1px solid #ddd;
    border-bottom: 1px solid #ddd;
    border-top: 1px solid #ddd;
    position: absolute;
    z-index: 20;
  }

  .gantt_atividades .hoje {
    width: 80px;
    position: absolute;
    z-index: 40;
    border-left: 4px solid #ca1b1b61;
    color: #b32b2b;
    vertical-align: bottom;
    padding: 114% 5px 0px 2px;
  }

  .gantt_atividades .percentual_execucao {
    background: lightgray;
    border-radius: 25px;
    padding: 0px 10px;
  }

  span.realce {
    font-weight: bold;
    color: gold;
  }

  .gantt_atividades .rodape {
    float: left;
    width: 100%;
    margin: 10px;
  }

  .gantt_atividades .rodape span, .gantt_atividades .rodape div {
    float: left;
    margin-right: 10px;
  }

  .gantt_atividades .legenda, .gantt_atividades .opcoes {
    cursor: pointer;
    border: 1px solid #ddd;
    border-radius: 25px;
    padding: 0px 10px;
    margin-right: 10px;
    color: #333333;
    z-index: 1000;
    float: left;
    background: #eee;
  }

  .gantt_atividades div.legenda:hover, .gantt_atividades div.opcoes:hover {
    color: black;
    background: white;
    border: 1px solid silver;
  }

  .legenda_tabela td {
    padding: 5px;
    text-align: left;
    font-size: 14px;
  }

  .quadro_opcoes {
    width: 350px;
    padding: 5px;
    z-index: 2000;
  }

  .quebrar_texto {
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
  }

</style>
