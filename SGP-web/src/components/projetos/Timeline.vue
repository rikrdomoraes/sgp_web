<template>
  <div class="box-body timeline_box" style="overflow: auto" id="time" >
    <div v-show="loading" class="overlay" style="position: absolute; top: 0px; left: 0px; width: 100%; height: 100%; display: block;"><i class="fa fa-refresh fa-spin"></i></div>
    <div v-show="mostrarTotalizador || mostrarOpcoes" class="row">
      <div class="col-md-12">

      <!-- Quadro com opções de configuração do timeline -->
        <div v-show="mostrarOpcoes" class="quadro_opcoes">
          <span class="titulo_grupo">Opções do timeline:</span>
          <div class="visao">Visão <select v-model="posicao"><option v-bind:value="'absoluto'">Distâncias representam dias</option><option v-bind:value="'relativo'">Cada marcador virá atras do outro</option></select></div>
          <div v-show="posicao === 'absoluto'" class="zoom">Zoom <select v-model="zoom"><option v-for="z in _.range([start=1], 6.5, [step=.5])">{{z}}</option></select></div>
          <div v-show="posicao === 'absoluto'" class="mostrar_escala">Mostrar escala <select v-model="mostrarEscala"><option v-bind:value="true">Sim</option><option v-bind:value="false">Não</option></select></div>
          <div class="linha_situacoes">Mostrar situação do projeto na linha <select v-model="mostrarSituacoesHistoricas"><option v-bind:value="true">Sim</option><option v-bind:value="false">Não</option></select></div>
        </div>

      <!-- Quadro com totalizadores -->
        <div v-show="mostrarTotalizador" class="quadro_totalizador">

        <!-- Ocorrências -->
              <div class="grupo">
                <div class="cabecalho_grupo">
                  <div class="titulo_grupo">Ocorrências</div>
                  <div v-if="haRegistros(this.totalizador.total_acompanhamento, ['INFORMACAO', 'OCORRENCIA_IMPEDITIVA'])">
                    <div>Em Ser</div>
                    <div>Baixadas</div>
                  </div>
                  <div v-else>
                    <div>Não houve</div>
                  </div>
                </div>
                <div v-for="item in _.filter(totalizador.total_acompanhamento, o => _.includes(['INFORMACAO', 'OCORRENCIA_IMPEDITIVA'], o.codigo))" class="coluna_grupo">
                  <div>
                    <div :title="'<h5>' + item.descricao + '</h5>'"
                         v-tippy="{ inertia : true, arrow : true,  animation : 'fade', distance:'1', size: 'large', placement: 'top'}">
                      <i :class="'marcador ' + icone(item.codigo)" @click="filtrarTimeline(item.codigo)"></i></div>
                    <div :class="item.ocorrencia_em_ser > 0 ? 'realce': 'esmaecer'">{{item.ocorrencia_em_ser}}</div>
                    <div :class="item.ocorrencia_baixada > 0 ? 'realce': 'esmaecer'">{{item.ocorrencia_baixada}}</div>
                  </div>
                </div>
              </div>

              <!-- Demandas -->
              <div class="grupo">
                <div class="cabecalho_grupo">
                  <div class="titulo_grupo">Demandas</div>
                  <div v-if="haRegistros(this.totalizador.total_acompanhamento, ['DEMANDA_FBB', 'DEMANDA_PARCEIRO'])">
                    <div>Em Condução</div>
                    <div>Concluídas</div>
                  </div>
                  <div v-else>
                    <div>Não houve</div>
                  </div>
                </div>
                <div v-for="item in _.filter(totalizador.total_acompanhamento, o => _.includes(['DEMANDA_FBB', 'DEMANDA_PARCEIRO'], o.codigo))" class="coluna_grupo">
                  <div>
                    <div :title="'<h5>' + item.descricao + '</h5>'"
                         v-tippy="{ inertia : true, arrow : true,  animation : 'fade', distance:'1', size: 'large', placement: 'top'}">
                      <i :class="'marcador ' + icone(item.codigo)" @click="filtrarTimeline(item.codigo)"></i></div>
                    <div :class="item.demanda_em_conducao > 0 ? 'realce': 'esmaecer'">{{item.demanda_em_conducao}}</div>
                    <div :class="item.demanda_concluida > 0 ? 'realce': 'esmaecer'">{{item.demanda_concluida}}</div>
                  </div>
                </div>
              </div>

              <!-- Contatos -->
              <div class="grupo" ref="totalizador_contatos">
                <div class="cabecalho_grupo">
                  <div class="titulo_grupo">Contatos</div>
                  <div v-if="haRegistros(this.totalizador.total_acompanhamento, ['CONTATO'])">
                    <div>Total realizado</div>
                  </div>
                  <div v-else>
                    <div>Não houve</div>
                  </div>
                </div>
                <div v-for="item in _.filter(totalizador.total_acompanhamento, o => _.includes(['CONTATO'], o.codigo))" class="coluna_grupo">
                  <div>
                    <div :title="'<h5>' + item.descricao + '</h5>'"
                         v-tippy="{ inertia : true, arrow : true,  animation : 'fade', distance:'1', size: 'large', placement: 'top'}">
                      <i :class="'marcador ' + icone(item.codigo)" @click="filtrarTimeline(item.codigo)"></i></div>
                    <div :class="item.contatos > 0 ? 'realce': 'esmaecer'">{{item.contatos}}</div>
                  </div>
                </div>
              </div>

              <!-- Alterações em projetos -->
              <div class="grupo">
                <div class="cabecalho_grupo">
                  <div class="titulo_grupo">Alterações em projetos</div>
                  <div v-if="haRegistros(this.totalizador.total_alteracoes, null)">
                    <div>Eficiência</div>
                    <div>Externalidade</div>
                    <div>FBB</div>
                    <div>Falha planejamento</div>
                  </div>
                  <div v-else>
                    <div>Não houve</div>
                  </div>
                </div>
                <div v-for="item in totalizador.total_alteracoes" class="coluna_grupo">
                  <div>
                    <div :title="'<h5>' + item.descricao + '</h5>'"
                         v-tippy="{ inertia : true, arrow : true,  animation : 'fade', distance:'1', size: 'large', placement: 'top'}">
                      <i :class="'marcador ' + icone(item.codigo)" @click="filtrarTimeline(item.codigo)"></i></div>
                    <div :class="item.eficiencia > 0 ? 'realce': 'esmaecer'">{{item.eficiencia}}</div>
                    <div :class="item.externalidade > 0 ? 'realce': 'esmaecer'">{{item.externalidade}}</div>
                    <div :class="item.fbb > 0 ? 'realce': 'esmaecer'">{{item.fbb}}</div>
                    <div :class="item.falha > 0 ? 'realce': 'esmaecer'">{{item.falha}}</div>
                  </div>
                </div>
              </div>

              <!-- Relatórios de Execução -->
              <div class="grupo">
                <div class="cabecalho_grupo">
                  <div class="titulo_grupo">Relatórios de Execução</div>
                  <div v-if="haRegistros(this.totalizador.total_relatorios_execucao, null)">
                    <div>Entregue</div>
                    <div>Pendente</div>
                  </div>
                  <div v-else>
                    <div>Não há</div>
                  </div>
            </div>
            <div v-for="item in totalizador.total_relatorios_execucao" class="coluna_grupo">
              <div>
                <div :title="'<h5>' + item.descricao + '</h5>'"
                     v-tippy="{ inertia : true, arrow : true,  animation : 'fade', distance:'1', size: 'large', placement: 'top'}">
                  <i :class="'marcador ' + icone(item.codigo)" @click="filtrarTimeline(item.codigo)"></i></div>
                <div class="realce">{{item.entregue}}</div>
                <div class="realce">{{item.pendente}}</div>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>


    <div class="row" v-if="!loading">
      <div class="col-md-12">
        <div class="ng-isolate-scope novo_timeline">

          <div class="linha_tempo" ref="timeline">

            <!--<div v-show="mostrarEscala && posicao === 'absoluto'" v-for="dias in _.range([start=0], eventos[eventos.length - 1].referencia + 30, [step=30])"-->
            <div v-show="mostrarEscala && posicao === 'absoluto'" v-for="dias in _.range([start=0], qdtEventos + 30, [step=30])"
                 class="marcacao_escala" v-bind:style="'margin-left: ' + ((dias * parseInt(zoom)) + 56) + 'px; width: ' + (zoom) + 'px;'">

              <span class="texto_vertical">{{diasData(projeto.inicio, dias)}}</span>
            </div>

            <div class="eventos" v-bind:style="'width: ' + ((posicao === 'absoluto') ? ((eventos[eventos.length - 1].referencia + 75) * zoom) : (eventos.length * 160)) + 'px'">

              <div class="linha" v-bind:style="'width: ' + ((posicao === 'absoluto') ? ((eventos[eventos.length - 1].referencia + 75) * zoom) : (eventos.length * 160) + 80) + 'px'">
                <div class="situacao_projeto" v-show="mostrarSituacoesHistoricas">

                    <div v-if="posicao === 'absoluto'" v-for="(evento, eventoIndex) in eventos" :class="situacaoProjeto(evento.data)" v-bind:style="'width: ' + (eventoIndex === eventos.length -1 ? 75 : (eventoIndex > 0 ? (evento.referencia - eventos[eventoIndex - 1].referencia) * zoom : 0)) + 'px'">&nbsp;</div>
                    <div v-if="posicao === 'relativo'" v-for="(evento, eventoIndex) in eventos" :class="situacaoProjeto(evento.data)" style="width: 160px;">&nbsp;</div>

                </div>
              </div>


              <div v-for="evento in eventos" :class="'evento posicao_' + posicao" :id="evento.tag + '_' + evento.id">

                <div v-bind:style="posicao === 'absoluto' ? 'margin-left: ' + (evento.referencia * zoom) + 'px' : ''" :ref="_.startsWith(evento.tag, 'HOJE') ? 'HOJE' : evento.id">

                  <div :class="'marcador' + (evento.id === temp ? ' evento_sinalizado' : '')" v-bind:style="'background:' + cor(evento.situacao) + '; cursor: ' + (evento.grupo === 'projeto' ? 'unset' : 'pointer')"
                       :title="'<h5>' + evento.descricao + '<br/>' + evento.info + '</h5>'"
                       v-tippy="{ inertia : true, arrow : true,  animation : 'fade', distance:'1', size: 'large', placement: 'top'}"
                       @click="filtrarGrids(evento.grupo, evento.id)">
                    <i :class="icone(evento.tag)" v-bind:style="'vertical-align: middle;text-align: center;'">&nbsp;</i>
                  </div>

                  <div :class="'info_superior' + (data_vertical ? ' texto_vertical' : '')">{{ posicao === 'absoluto' ? '' : evento.data | moment('DD/MMM/YY')}}</div>

                  <div class="info_inferior" v-bind:style="'padding-top: ' + (data_vertical ? 70 : 20) + 'px'"><span v-html="posicao === 'absoluto' ? '' : evento.descricao"></span></div>

                </div>

              </div>
            </div>
          </div>


          <div class="botoes_timeline">

          <!-- Opções -->
            <div class="opcoes" @click="mostrarOpcoes = !mostrarOpcoes, mostrarTotalizador = false">
              <i class="fa fa-gears"></i> Opções
            </div>

          <!-- Legendas -->
            <div class="legenda"
                 :title="'<table class=\'legenda_tabela\'>' +
                            '<tr><td style=\'background:' + cor('FEITO') + '\'>&nbsp;</td><td>Datas de aprovação, início de execução, alterações no projeto, data do término da execução, data do encerramento; Relatório de execuação aprovado</td></tr>' +
                            '<tr><td style=\'background:' + cor('CONCLUIDO') + '\'>&nbsp;</td><td>Registros de contato, demandas concluídas, informações, ocorrências baixadas</td></tr>' +
                            '<tr><td style=\'background:' + cor('EM_CONDUCAO') + '\'>&nbsp;</td><td>Demandas FBB ou Parceiro com status “Em condução”; ocorrências impeditivas em ser; relatório de execução não disponível</td></tr>' +
                            '<tr><td style=\'background:' + cor('NORMAL') + '\'>&nbsp;</td><td>Relatório de execução disponível</td></tr>' +
                            '<tr><td style=\'font-size: xx-large; color:' + cor('FEITO') + '\'>_</td><td>Situação do projeto regular</td></tr>' +
                            '<tr><td style=\'font-size: xx-large; color:' + cor('EM_CONDUCAO') + '\'>_</td><td>Situação não regular do projeto</td></tr>' +
                          '</table>' + '<br>* Obs: Ao selecionar um registro de acompanhamento ou de alteração de projeto, a borda do evento na linha do tempo, ficará <span class=evento_sinalizado>assim</span>'"

                 v-tippy="{ inertia : true, arrow : true,  animation : 'fade', distance:'1', size: 'large', interactive: true, theme: 'light', trigger: 'click', position: 'top'}">

              <i class="fa fa-list"></i> Legenda
            </div>

          <!-- Totalizador e Filtro  -->
            <div class="totalizador" @click="mostrarTotalizador = !mostrarTotalizador, mostrarOpcoes = false">
              <i class="fa fa-question"></i> Totais
            </div>

          <!-- Hoje  -->
            <div class="hoje" @click="moverParaHoje"
                 :title="'<h5>' + (projeto.turno === 'HOJE_DIA' ? 'Bom dia!' : 'Boa noite!') + '<br/>Duração do projeto de ' + projeto.periodos + ' meses<br/>' + ((projeto.hoje_dias / (projeto.periodos * 30)) <= 1 ? 'Já passou <b>' + parseInt(projeto.hoje_dias / (projeto.periodos * 30) * 100) + '%</b> desde seu início' : '') + '</h5>'"
                 v-tippy="{ inertia : true, arrow : true,  animation : 'fade', distance:'1', size: 'large', placement: 'top', theme: 'light'}">
              <i :class="'fa ' + (icone(projeto.turno))"></i> Hoje {{diasData (new Date(), 0)}}
            </div>

          <!-- Reload  -->
            <div v-show="eventos.length !== eventosBackup.length" class="reload" @click="voltarBackupEventos">
              <i :class="'fa fa-refresh'"></i> Recarregar
            </div>

          </div>

        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'visualiza-timeline',
    data () {
      return {
        loading: true,
        eventos: [],
        eventosBackup: [],
        qdtEventos: 0,
        projeto: {},
        historicoSituacoes: {},
        eventData: {
        },
        temp: 0,
        selecLinha: 0,
        numero: null,
        posicao: 'relativo', // 'relativo' ou 'absoluto' para posicionar os eventos um ao lado do outro ou proporcional as suas datas
        zoom: 2, // proporção de espaçamento dos eventos quando a posição é 'absoluto' tal como zoom
        tamanho: 1500, // será tamanho em px do timeline
        distancia_centro: 10, // distancia em px da linha de tempo
        data_vertical: false, // colocar data na posição vertical
        mostrarOpcoes: false,
        mostrarEscala: false,
        mostrarSituacoesHistoricas: true,
        mostrarTotalizador: false,
        mostrarQuadro: false,
        totalizador: {},
        icones: {
          'NAO_HA': 'fa fa-question',
          'HOJE_DIA': 'fa fa-sun-o',
          'HOJE_NOITE': 'fa fa-moon-o',
          'PROJETO_APROVACAO': 'fa fa-check',
          'ASSINATURA_CONVENIO': 'fa fa-pencil',
          'PROJETO_INICIO': 'fa fa-rocket',
          'PROJETO_TERMINO': 'fa fa-home',
          'PROJETO_ENCERRAMENTO': 'fa fa-hourglass-end',
          'RELATORIO_DE_EXECUCAO': 'fa fa-calendar-check-o',
          'CONTATO': 'fa fa-phone',
          'INFORMACAO': 'fa fa-info',
          'DEMANDA_FBB': 'fa fa-file-text-o',
          'DEMANDA_PARCEIRO': 'fa fa-file-text',
          'OCORRENCIA_IMPEDITIVA': 'fa fa-ban',
          'ALTERACAO_DE_METAS': 'fa fa-flag-checkered',
          'ALTERACAO_CONTRAPARTIDA': 'fa fa-thumbs-o-up',
          'AJUSTE_QUANTIDADE_ITENS_DE_DESPESA': 'fa fa-cubes',
          'INCLUSAO_DE_ITENS_DE_DESPESA': 'fa fa-cart-plus',
          'SUBSTITUICAO_DE_ITENS_DE_DESPESA': 'fa fa-cart-arrow-down',
          'ALTERACAO_DA_LOCALIZACAO_DE_IMPLEMENTACAO_DO_PROJETO': 'fa fa-map-o',
          'REMANEJAMENTO': 'fa fa-retweet',
          'SUPLEMENTACAO_DE_RECURSOS': 'fa fa-plus',
          'PRORROGACAO_DE_PRAZO': 'fa fa-calendar',
          'ALTERACAO_DA_FORMA_DE_LIBERACAO_DOS_RECURSOS': 'fa fa-money',
          'OUTRAS_ALTERACOES': 'fa fa-asterisk',
          'EXTERNALIDADE': 'fa fa-sign-in',
          'EFICIENCIA': 'fa fa-line-chart',
          'FBB': 'fa fa-building',
          'FALHA_PLANEJAMENTO': 'fa fa-bomb'
        },
        cores: { // Usando a paleta de cores padrão do SGP
          'NORMAL': '#1565c0',
          'ATENCAO': '#ff9900',
          'EM_SER': '#c62828',
          'EM_CONDUCAO': '#c62828',
          'BAIXADA': '#808080',
          'CONCLUIDO': '#808080',
          'NAO_HA': '#808080',
          'FEITO': '#2e7d32'
        }
      }
    },
    props: ['numeroProjeto', 'atualizar'],
    watch: {
      atualizar: function () {
        this.carregaTimeline()
      },
      selecLinha: function () {
        let i = 0
        if (this.eventos) {
          for (i = 0; i < this.eventos.length; i++) {
            if (this.eventos[i].id === this.selecLinha) {
              this.$nextTick(() => {
                this.temp = this.selecLinha
                // this.$refs['timeline'].scrollIntoView()
                this.$refs[this.selecLinha][0].scrollIntoView()
              })
            }
          }
        }
      }
    },
    computed: {
    },
    mounted () {
      let vm = this
      vm.$events.listen('linhaSelecionada', function (eventData) {
        vm.selecLinha = eventData.id
      })
      this.selecLinha = vm.selecLinha
    },
    created () {
      this.numero = this.$route.params.numero
      if (this.numero) {
        this.carregaTimeline()
      }
    },
    methods: {
      carregaTimeline () {
        this.loading = true
        axiosLaravel.get('timeline/' + this.numero).then((response) => {
          this.projeto = response.data.projeto[0]
          this.eventos = _.sortBy(response.data.timeline, 'referencia')
          this.qdtEventos = this.eventos[this.eventos.length - 1].referencia
          this.historicoSituacoes = _.sortBy(response.data.historico_situacoes, 'data').reverse()
          this.eventosBackup = this.eventos
          this.totalizador['total_acompanhamento'] = response.data.total_acompanhamento
          this.totalizador['total_alteracoes'] = response.data.total_alteracoes
          this.totalizador['total_relatorios_execucao'] = response.data.total_relatorios_execucao
          this.loading = false
        })
          .catch((error) => {
            this.$root.trataErro(error)
          })
        this.zoom = this.eventos[this.eventos.length - 1].referencia < 550 ? 2.5 : this.eventos[this.eventos.length - 1].referencia < 900 ? 2 : 1 // Zoom iniciará dependendo do último evento da linha de tempo
      },
      icone (tag) {
        return (this.icones[tag] === undefined) ? this.icones['NAO_HA'] : this.icones[tag]
      },
      cor (situacao) {
        return (this.cores[situacao] === undefined) ? this.cores['NAO_HA'] : this.cores[situacao]
      },
      filtrarGrids (origem, id) {
        if (origem === 'acompanhamento') {
          this.$emit('idAcompanhamento', id)
        } else if (origem === 'alteracoes') {
          this.$emit('idAlteracoes', id)
        } else if (origem === 'relatorio_execucao') {
          let pagina = this.$router.resolve({name: 'visualiza-relatorio-execucao', params: { id: this.numero }})
          window.open(pagina.href, '_blank')
        }
      },
      filtrarTimeline (filtro) {
        if (this.eventos.length !== this.eventosBackup.length) {
          this.voltarBackupEventos()
        }
        this.eventos = _.sortBy(_.union(_.filter(this.eventos, ['tag', filtro]), _.filter(this.eventosBackup, ['grupo', 'projeto'])), 'referencia')
      },
      haRegistros (lista, filtro) {
        let saida = false
        if (!_.isUndefined(lista)) {
          if (_.isNull(filtro)) {
            saida = (lista.length > 0)
          } else {
            saida = (_.filter(lista, o => _.includes(filtro, o.codigo)).length > 0)
          }
        }
        return saida
      },
      voltarBackupEventos () {
        this.eventos = this.eventosBackup
      },
      situacaoProjeto (data) {
        let situacaoAlterada = _.find(this.historicoSituacoes, function (o) { return o.data < data })
        if (_.isUndefined(situacaoAlterada)) {
          return 'conducao_normal'
        }
        return _.includes(['APR', 'DEF', 'ANA', 'ETO', 'ENC', 'ANU', 'CAN', 'ESE'], situacaoAlterada.situacao) ? 'conducao_normal' : 'conducao_suspenso'
      },
      diasData (inicio, dias) {
        let data = new Date(inicio)
        data.setDate(data.getDate() + dias)
        return data.toLocaleDateString('de', { year: '2-digit', month: '2-digit', day: '2-digit' })
      },
      moverParaHoje () {
        this.$refs['HOJE'][0].scrollIntoView()
      }
    }
  }
</script>

<style>
  .linha_tempo {
    height: 130px;
    float: left;
    text-align: center;
  }

  .novo_timeline {
    /*margin-left: 30px;*/
    height: 160px;
  }

  .novo_timeline .eventos {
    height: 100px;
    position: absolute;
  }

  .novo_timeline .linha {
    margin-top: 50px;
    height: 2px;
    border-bottom: 2px solid white;
    position: absolute;
    width: 100%;
    box-shadow: 2px 2px 4px 1px rgba(0, 0, 0, 0.2), 0px 1px 1px 0px rgba(0, 0, 0, 0.14), 0px 1px 3px 0px rgba(0, 0, 0, 0.12);
  }

  .novo_timeline .evento {
    width: 160px;
    height: 100px;
  }

  .novo_timeline .posicao_relativo {
    position: relative;
    float: left;
  }

  .novo_timeline .posicao_absoluto {
    position: absolute;
  }

  .novo_timeline .marcador {
    width: 28px;
    height: 28px;
    float: left;
    margin-left: 65px;
    margin-top: 35px;
    position: absolute;
    z-index: 100;
    border-radius: 25px;
    background: gray;
    box-shadow: 2px 2px 4px 1px rgba(0, 0, 0, 0.2), 0px 1px 1px 0px rgba(0, 0, 0, 0.14), 0px 1px 3px 0px rgba(0, 0, 0, 0.12);
    color: white;
    border: 2px solid white;
    padding-left: 3px;
  }

  .novo_timeline div.marcador:hover {
    z-index: 800;
  }

  .info_superior {
    height: 50px;
    line-height: 15px;
    z-index: 20;
    padding-top: 15px;
  }

  .novo_timeline .info_inferior {
    /*background: #ff002687;*/
    width: 100%;
    height: 50px;
    line-height: 15px;
    z-index: 50;
    padding-top: 20px;
  }

  .novo_timeline .texto_vertical {
    transform: rotate(-90deg);
    transform-origin: right, top;
    -ms-transform: rotate(-90deg);
    -ms-transform-origin: right, top;
    -webkit-transform: rotate(-90deg);
    -webkit-transform-origin: right, top;
    -moz-transform: rotate(-90deg);
    -o-transform: rotate(-90deg);
    position: absolute;
  }

  .timeline_box .quadro_opcoes {
    width: 350px;
    margin-left: 20px;
    height: 150px;
    float: left;
  }

  .quadro_opcoes div {
    line-height: 30px;
    margin-left: 20px;
  }

  .timeline_box .quadro_totalizador {
    float: left;
    height: 180px;
  }

  .quadro_totalizador .marcador {
    width: 28px;
    height: 28px;
    border-radius: 25px;
    background: gray;
    box-shadow: 2px 2px 4px 1px rgba(0, 0, 0, 0.2), 0px 1px 1px 0px rgba(0, 0, 0, 0.14), 0px 1px 3px 0px rgba(0, 0, 0, 0.12);
    color: white;
    border: 2px solid white;
    padding-top: 5px;
    font-size: 14px;
    cursor: pointer;
    text-align: center;
  }

  .quadro_totalizador i.marcador:hover {
    background: silver;
  }

  .quadro_totalizador .realce {
    color: #1565c0;
    font-weight: bold;
  }

  .quadro_totalizador .esmaecer {
    color: #ccc;
  }

  .quadro_totalizador .grupo {
    /*width: 100%;*/
    float: left;
    margin-left: 20px;
    text-align: left;
    font-size: 15px;
    line-height: 28px;
  }

  .quadro_totalizador .grupo div {
    border-bottom: 1px solid silver;
  }

  .quadro_totalizador .cabecalho_grupo {
    float: left;
    width: 170px !important;
  }

  .quadro_totalizador .coluna_grupo {
    float: left;
    width: 40px;
    text-align: center;
  }
  .quadro_totalizador .cabecalho_grupo div, .quadro_totalizador .coluna_grupo div {
    float: left;
    width: 100%;
  }

  .timeline_box .titulo_grupo {
    font-weight: bold;
  }

  .novo_timeline .botoes_timeline {
    position: absolute;
    top: 140px;
  }

  .novo_timeline .opcoes, .novo_timeline .legenda, .novo_timeline .hoje, .novo_timeline .totalizador, .novo_timeline .reload {
    cursor: pointer;
    border: 1px solid #ddd;
    border-radius: 25px;
    padding: 0px 10px;
    margin-right: 10px;
    z-index: 1000;
    background: #eee;
    float: left;
  }

  .novo_timeline div.opcoes:hover, .novo_timeline div.legenda:hover, .novo_timeline div.totalizador:hover, .novo_timeline div.hoje:hover, .novo_timeline div.reload:hover {
    color: black;
    background: white;
    border: 1px solid silver;
  }

  .novo_timeline .marcacao_escala {
    position: absolute;
    font-size: 12px;
    color: gray;
    margin-top: 5px;
  }

  .novo_timeline p.tipoco1, .novo_timeline p.tipoco2, .novo_timeline p.tipoco3, .novo_timeline p.tipoco4 {
    font-size: smaller;
  }

  .novo_timeline p.tipoco1 {
    color: #00304b;
  }

  .novo_timeline p.tipoco2 {
    color: #4b2e00;
  }

  .novo_timeline p.tipoco3 {
    color: #4b0000;
  }

  .novo_timeline p.tipoco4 {
    color: #4b0000;
  }

  .novo_timeline .legenda_tabela td {
    padding: 5px;
    text-align: left;
    font-size: 14px;
    line-height: 15px;
  }

  div.evento_sinalizado {
    border: 3px solid #1565c0 !important;
  }
  span.evento_sinalizado {
    border: 2px solid #1565c0;
    border-radius: 50%;
    padding: 5px 0px;
    line-height: 25px;
  }

  .situacao_projeto {
    z-index: 100;
    margin-left: 80px;
  }

  .conducao_normal {
    height: 2px;
    background: #2e7d32b5;
    float: left;
  }

  .conducao_suspenso {
    height: 2px;
    background: #c62828b5;
    float: left;
  }

</style>
