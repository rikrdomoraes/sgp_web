<template>

  <div class="content-wrapper">

    <vue-headful v-if="proposta.fep && proposta.fep.id" :title="'SGP - FEP ' + proposta.fep.ano + '/' + proposta.fep.numero"/>

    <section class="content-header ng-scope">

      <h1 v-if="proposta.fep">Ficha de Enquadramento de Projetos  -  FEP  Nº  {{proposta.fep.ano}}/{{proposta.fep.numero}}
        <span :title="'<h5>Gera a FEP abaixo de forma resumida em Excel</h5>'" v-tippy="{ inertia : true, arrow : true,  animation : 'perspective', distance:'1', size: 'large', arrow : true }" style="display: inline-block;">
          <download-excel
            :data   = "json_data"
            :meta   = "json_meta"
            type    = "xls"
            :fields = "json_fields"
            :name    = "fepExcel">
            <g-button-ujarak color="primary" size="button--size-ss">
              <i class="fa fa-download" aria-hidden="true"></i>
            </g-button-ujarak>
          </download-excel>
        </span>
        <g-button-ujarak color="warning" size="button--size-ss" @click.native="imprimirRelatorio"><i class="fa fa-print" aria-hidden="true"></i>  Imprimir </g-button-ujarak>
        <g-button-ujarak color="success" size="button--size-ss" @click.native="salvaFep"><i class="fa fa-print" aria-hidden="true"></i>  Salvar </g-button-ujarak>
        <g-button-ujarak color="error" @click.native="closewindow" size="button--size-ss"><i class="fa fa-sign-out" aria-hidden="true"></i> Sair do relatório </g-button-ujarak>
      </h1>
      <b-breadcrumb :items="[{
            text: 'Validação',
            href: '/'
            }, {
            text: 'Propostas',
            href: '#'
            }, {
            text: 'FEP',
            active: true
            }]"/>
    </section>

    <!-- main content -->
    <section class="content ng-scope">

      <div class="row">

          <div id="relatorio_fep">

            <div class="col-md-12">

              <div class="box box-primary">
                <div>
                  <div v-show="loading.show" class="overlay" style="position: absolute; top: 0px; left: 0px; width: 100%; height: 100%; display: block;">
                    <i class="fa fa-refresh fa-spin"></i>
                  </div>
                  <table class="table">
                    <tr>
                      <td><img src="/static/img/logo-login.png" class="logo_relatorio"></td>
                      <td></td>
                      <td class="fep_titulo">
                        <div>Ficha de Enquadramento de projetos</div>
                        <div v-if="proposta.fep.id">FEP - Nº <span class="ressaltar titulo"> {{proposta.fep.ano}}/{{proposta.fep.numero}}</span></div>
                      </td>
                    </tr>
                  </table>

                  <!-- Dados do Projeto -->
                  <div class="form-group box-body">
                    <div>
                      <label class="control-label">Dados do Projeto</label>
                    </div>
                    <div>
                      <table class="table table-condensed table-bordered table-striped">
                        <tbody>
                        <tr>
                          <td class="cabecalho">Título</td>
                          <td class="ressaltar">{{nome}}</td>
                        </tr>
                        <tr>
                          <td class="cabecalho">Proponente</td>
                          <td class="ressaltar">{{nomeEntidade}}</td>
                        </tr>
                        <tr>
                          <td class="cabecalho">CNPJ</td>
                          <td class="ressaltar">{{cnpj | cnpj}}</td>
                        </tr>
                        <tr>
                          <td class="cabecalho required-fep">Ano da Fep</td>
                          <td class="ressaltar">
                            <div class="required-field"
                                 :class="{ 'has-error' : errors.first('ano')}">
                              <input type="number" v-model="proposta.fep.ano" name="ano"
                                     v-validate="'required'">
                              <span v-if="errors.first('ano')" class="label label-danger"> {{ errors.first('ano') }}</span>
                            </div>
                          </td>
                        </tr>
                        <tr>
                          <td class="cabecalho required-fep">Número da Fep</td>
                          <td class="ressaltar">
                            <div class="required-field"
                                 :class="{ 'has-error' : errors.first('numero')}">
                              <input type="number" v-model="proposta.fep.numero" name="numero"
                                     v-validate="'required'">
                              <span v-if="errors.first('numero')" class="label label-danger"> {{ errors.first('numero') }}</span>
                            </div>
                          </td>
                        </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <!-- Enquadramento na árvore de projetos -->
                  <div class="form-group box-body">
                    <div>
                      <label class="control-label">Enquadramento na Árvore de Projetos</label>
                    </div>
                    <div>
                      <table class="table table-condensed table-bordered table-striped">
                        <tbody>
                        <tr>
                          <td class="cabecalho">Projeto Superior</td>
                          <td class="ressaltar">{{projetoSuperior}}</td>
                        </tr>
                        <tr>
                          <td class="cabecalho">Eixo de Atuação</td>
                          <td class="ressaltar">{{troca('CAMPOS_DE_ATUACAO', proposta.ds_categ_campo_atuacao)}}</td>
                        </tr>
                        <tr>
                          <td class="cabecalho">Programa</td>
                          <td class="ressaltar">{{troca('PROGRAMA', proposta.ds_fep_programa)}}</td>
                        </tr>
                        <tr>
                          <td class="cabecalho">Ação</td>
                          <td class="ressaltar">{{troca('ACAO', proposta.ds_categ_acao)}}</td>
                        </tr>
                        <tr>
                          <td class="cabecalho">Parceria Estratégica (Vínculo)</td>
                          <td class="ressaltar">{{vinculoParcerias}}</td>
                        </tr>
                        <tr>
                          <td class="cabecalho">Tipo de Ação</td>
                          <td class="ressaltar">{{troca('TIPO_ACAO', proposta.ds_fep_tipo_acao)}}</td>
                        </tr>
                        <tr>
                          <td class="cabecalho">Abrangência</td>
                          <td class="ressaltar">{{abrangencia}}</td>
                        </tr>
                        <tr>
                          <td class="cabecalho">Participantes Diretos</td>
                          <td class="ressaltar">{{publicoAlvo}}</td>
                        </tr>
                        <tr>
                          <td class="cabecalho">Prospecção</td>
                          <td class="ressaltar">{{troca('PROSPECCAO', proposta.ds_categ_prospeccao)}}</td>
                        </tr>
                        <tr>
                          <td class="cabecalho">Se Seleção, Nº/Nome Processo</td>
                          <td class="ressaltar">{{troca('EDITAL', proposta.ds_categ_edital)}}</td>
                        </tr>
                        <tr>
                          <td class="cabecalho">Cadeia Produtiva</td>
                          <td class="ressaltar">{{troca('CADEIAS_PRODUTIVAS', proposta.ds_categ_atividade)}}</td>
                        </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <!-- Orçamento -->
                  <div class="form-group box-body">
                    <div>
                      <label class="control-label">Orçamento</label>
                    </div>
                    <div>
                      <table class="table table-condensed table-bordered table-striped orcamento">
                        <thead>
                          <tr>
                            <th class="cabecalho">Recursos</th>
                            <th class="centralizado">Valor</th>
                            <th class="centralizado">% Valor</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td>Próprios FBB</td>
                            <td class="centralizado">{{totalFBB | real}}</td>
                            <td class="centralizado">{{totalFBB / (totalContrapartida + totalFBB + totalParceiro) | percentage}}</td>
                          </tr>
                          <tr>
                            <td>Terceiros - Parcerias Estratégicas</td>
                            <td class="centralizado">{{totalParceiro | real}}</td>
                            <td class="centralizado">{{totalParceiro / (totalContrapartida + totalFBB + totalParceiro) | percentage}}</td>
                          </tr>
                          <tr>
                            <td>Contrapartida - Proponente</td>
                            <td class="centralizado">{{totalContrapartida | real}}</td>
                            <td class="centralizado">{{totalContrapartida/ (totalContrapartida + totalFBB + totalParceiro) | percentage}}</td>
                          </tr>
                          <tr>
                            <td>Contrapartida - Outros Parceiros</td>
                            <td class="centralizado">{{0 | real}}</td>
                            <td class="centralizado">{{0 / (totalContrapartida + totalFBB + totalParceiro) | percentage}}</td>
                          </tr>
                          <tr>
                            <td>Total</td>
                            <td class="centralizado">{{totalContrapartida + totalFBB + totalParceiro | real}}</td>
                            <td class="centralizado">{{(totalContrapartida + totalFBB + totalParceiro) / (totalContrapartida + totalFBB + totalParceiro)| percentage}}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <!-- Observações -->
                  <div class="form-group box-body">
                    <div>
                      <label class="control-label">Observações</label>
                    </div>
                    <div class="nao_imprimir">
                      <textarea  :disabled="true" v-model="proposta.ds_fep_observacao" name="ds_fep_observacao" v-resizable @input="resizable" class="form-control"></textarea>
                    </div>
                    <div v-html="proposta.ds_fep_observacao" class="imprimir bloco_texto"></div>
                  </div>


                  <div class="form-group box-body">
                    <div>
                      <label class="control-label">Enquadramento Orçamentário</label>
                    </div>

                    <table class="bloco">
                      <tr>
                        <td>
                          <textarea class="form-control">Enquadramento validado em {{hoje}}</textarea>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <div class="assinatura">
                            <!--<span>Assessor Formalização - Orçamento</span>-->
                            <span>Assessor Gerência de Análise e  Avaliação - Orçamento</span>
                          </div>
                        </td>
                      </tr>
                    </table>
                  </div>


                </div>

              </div>

            </div>

          </div>

      </div>
      <div class="float">
        <!--<b-button type="button" :disabled="false" @click="imprimirRelatorio" class="btn btn-warning btn-sm btn-flat"><i class="fa fa-print" aria-hidden="true"></i>  Imprimir </b-button>-->
      </div>

    </section>

  </div>
</template>

<script>
  import html2pdf from 'html2pdf.js'
  import {mapGetters} from 'vuex'
  import moment from 'moment'

  export default {
    name: 'relatorio-fep',
    data () {
      return {
        showgrid: true,
        relatorioFep: {
          itensFbb: [],
          itensContrapartida: [],
          itensParceiro: []
        },
        loading: {
          show: false
        },
        fepExcel: 'fep.xls',
        categorizadores: {},
        vinculoParcerias: '',
        json_data: [],
        json_fields: {
          'Título': 'ds_nome',
          'Proponente': 'entidade.ds_nome',
          'CNPJ': 'entidade.ds_cnpj',
          'Projeto Superior': 'nr_projeto_duplicacao',
          'Eixo de Atuação': 'ds_categ_campo_atuacao',
          'Programa': 'ds_fep_programa',
          'Ação': 'ds_categ_acao',
          'Parceria Estratégica': 'ds_categ_acao',
          'Tipo Ação': 'ds_fep_tipo_acao',
          'Abrangência': 'abrangencia',
          'Participantes Diretos': 'participantes_diretos',
          'Prospecção': 'ds_categ_prospeccao',
          'Nome do Processo': 'ds_categ_edital',
          'Cadeia Produtiva': 'ds_categ_vetor',
          'Orçamento FBB': 'totalFBB',
          'Terceiros': 'totalParceiro',
          'Observação': 'ds_fep_observacao'
        },
        json_meta: [
          [{
            'key': 'charset',
            'value': 'utf-8'
          }]
        ],
        hoje: moment().format('DD/MM/YYYY'),
        nome: '',
        nomeEntidade: '',
        cnpj: '',
        projetoSuperior: '',
        proposta: {},
        opcoes: ['Sim', 'Não', 'N/A'],
        totalFBB: 0,
        totalContrapartida: 0,
        totalParceiro: 0,
        meta: {},
        perguntas: {},
        metaIndex: [],
        publicosAlvo: {},
        formasContratacao: [],
        editando: null,
        atividadeForm: {
          nr_periodo_final: null,
          itens_orcamentos: [],
          metas: {},
          ds_nome: '',
          nr_periodo_inicial: null,
          ds_documento_comprobatorio: ''
        }, // formulário de edição e nova meta os dados serão guardados aqui
        atividadeTabela: {}, // Guarda o valor do objeto atividade antes da edição
        opcao_qtde_assinaturas: 3
      }
    },
    computed: {
      ...mapGetters([
        'usuarioLogado'
      ])
    },
    watch: {
    },
    created: async function () {
      await this.buscaProposta()
      // FEP Excel
      this.fepExcel = !_.isUndefined(this.proposta.ds_numero_fep) ? 'fep_' + (this.proposta.ds_numero_fep).replace('/', '_') + '.xls' : 'fep.xls'
      this.json_data[0] = this.proposta
      this.json_data[0]['abrangencia'] = this.abrangencia
      this.json_data[0]['participantes_diretos'] = this.publicoAlvo
      console.log('participantes_diretos', this.publicoAlvo)
      this.json_data[0]['totalFBB'] = this.totalFBB
      this.json_data[0]['totalFBB'] = this.totalFBB
      this.json_data[0]['totalContrapartida'] = this.totalContrapartida
      this.json_data[0]['totalParceiro'] = this.totalParceiro
      for (let i = 0; i < this.json_data.length; i++) {
        this.json_data[i].entidade.ds_cnpj = this.json_data[i].entidade.ds_cnpj + ' '
      }
      //
      // window.print()
    },
    methods: {
      closewindow () {
        close()
      },
      troca (grupo, valor) {
        let categorizador = _.find(this.categorizadores, function (c) { return (c.grupo === grupo) && ('' + c.valor) === ('' + valor) })
        return valor + ' - ' + (_.isUndefined(categorizador) ? 'Valor não localizado entre os categorizadoes' : categorizador.codigo)
      },
      async gravaFep () {
        // Chama backend para gravar
        await axiosLaravel.post('fep', {'fk_proposta': this.proposta.id}).then((response) => {
          this.proposta.fep = {'id': response.data['id']}
          // this.$snotify.success('Número gerado sucesso!')
          let bc = new BroadcastChannel('propostas')
          // compara o id da proposta para gravar
          if (this.proposta.fep.fk_proposta === this.proposta.id) {
            bc.postMessage({acao: 'notificacaoAtualizaFep', fep: this.proposta.fep})
          }
        })
          .catch((error) => {
            this.$root.trataErro(error)
          })
      },
      async salvaFep () {
        this.$validator.validateAll().then(async (result) => {
          if (result) {
            this.$snotify.async('Salvando FEP. Por favor, aguarde...', {timeout: 0})
            // Chama backend para gravar
            await axiosLaravel.put('fep/' + this.proposta.fep.id, {'fk_proposta': this.proposta.id, 'ano': this.proposta.fep.ano, 'numero': this.proposta.fep.numero}).then((response) => {
              this.proposta.fep = response.data
              this.$snotify.clear()
              this.$snotify.success('FEP atualizada com sucesso')
              let bc = new BroadcastChannel('propostas')
              // compara o id da proposta para gravar
              if (this.proposta.fep.fk_proposta === this.proposta.id) {
                bc.postMessage({acao: 'notificacaoAtualizaFep', fep: this.proposta.fep})
              }
              // console.log('depois salvar ', this.proposta.fep)
            })
              .catch((error) => {
                this.$snotify.clear()
                this.$root.trataErro(error)
              })
          }
        })
      },
      async buscaProposta () {
        this.loading.show = true
        await axiosLaravel.get('propostas/' + this.$route.params.id).then(async (response) => {
          this.proposta = response.data
          // console.log('this.proposta', this.proposta)
          if (_.isEmpty(this.proposta.fep) || _.isNull(this.proposta.fep) || _.isUndefined(this.proposta)) {
            await this.gravaFep()
          }
          this.nome = this.proposta.ds_nome
          this.nomeEntidade = this.proposta.entidade.ds_nome
          this.cnpj = this.proposta.entidade.ds_cnpj
          // Ajuste abrangência suporte 60022 - Juliano
          this.abrangencia = ''
          if (this.proposta.bt_fep_abrangencia === '1') {
            this.abrangencia = 'TERRITÓRIO NACIONAL'
          } else {
            for (let i = 0; i < this.proposta.municipalizacao.length; i++) {
              this.abrangencia = this.proposta.municipalizacao[i].ds_municipio + '-' + this.proposta.municipalizacao[i].ds_uf + ' , ' + this.abrangencia
            }
            let removeDup = [...new Set(this.abrangencia.split(', '))].join(',')
            this.abrangencia = removeDup
            let str1 = this.abrangencia
            this.abrangencia = str1.substring(0, str1.length - 2) + ''
          }
          this.proposta.atividades.forEach((atividade) => {
            if (atividade.itens_orcamentos) {
              atividade.itens_orcamentos.forEach((item) => {
                if (item.origem === '1' || item.origem === 1) {
                  this.relatorioFep.itensFbb.push(item)
                  this.totalFBB += (item.valor_unitario * item.quantidade)
                }
                if (item.origem === '2' || item.origem === 2) {
                  this.relatorioFep.itensContrapartida.push(item)
                  this.totalContrapartida += (item.valor_unitario * item.quantidade)
                }
                if (item.origem === '5' || item.origem === 5) {
                  this.relatorioFep.itensParceiro.push(item)
                  this.totalParceiro += (item.valor_unitario * item.quantidade)
                }
              })
            }
          })
          this.publicoAlvo = ''
          for (let i = 0; i < this.proposta.publicos_alvo.length; i++) {
            this.publicoAlvo += this.proposta.publicos_alvo[i].nr_participantes_diretos + ' ' + this.proposta.publicos_alvo[i].fonte.ds_descricao
            if (i < this.proposta.publicos_alvo.length - 1) {
              this.publicoAlvo += ', '
            }
          }
          this.carregarCategorizadores()
          this.carregarVinculosParcerias()
          this.carregarProjetoDuplicador()
          this.$forceUpdate()
          this.loading.show = false
        })
          .catch((error) => {
            this.loading.show = false
            this.$root.trataErro(error)
          })
        await axiosLaravel.get('fep/consultaFepProposta/' + this.$route.params.id).then((response) => {
          this.proposta.fep = response.data
        })
      },
      carregarProjetoDuplicador () {
        axiosLaravel.get('projeto/sapiens/' + this.proposta.nr_projeto_duplicacao).then((response) => {
          this.proposta['duplicadorSapiens'] = response.data[0]
          this.carregarProjetoSuperior()
        })
          .catch((error) => {
            this.$snotify.clear()
            this.$root.trataErro(error)
          })
      },
      carregarProjetoSuperior () {
        axiosLaravel.get('projeto/sapiens/' + this.proposta.duplicadorSapiens.prjsup).then((response) => {
          this.proposta['superiorSapiens'] = response.data[0]
          this.projetoSuperior = this.proposta.superiorSapiens.numprj + ' - ' + this.proposta.superiorSapiens.nomprj
        })
          .catch((error) => {
            this.$snotify.clear()
            this.$root.trataErro(error)
          })
      },
      carregarCategorizadores () {
        axiosLaravel.get('categorizadores/').then((response) => {
          this.categorizadores = response.data
        })
          .catch((error) => {
            this.$root.trataErro(error)
          })
      },
      carregarVinculosParcerias () {
        axiosLaravel.get('vinculo_parcerias/').then((response) => {
          let vm = this
          let parceria = _.find(response.data, function (p) { return ('' + p.id) === ('' + vm.proposta.duplicadorSapiens.usu_vinculo) })
          this.vinculoParcerias = (_.isUndefined(parceria)) ? '' : parceria.id + ' - ' + parceria.desc_vinculo
        })
          .catch((error) => {
            this.$root.trataErro(error)
          })
      },
      imprimirRelatorio () {
        window.print()
      },
      print () {
        let element = document.getElementById('relatorio_fep')
        let opt = {
          margin: 1,
          filename: 'myfile.pdf',
          image: {type: 'jpeg', quality: 0.98},
          html2canvas: {scale: 2},
          jsPDF: {unit: 'in', format: 'letter', orientation: 'portrait'}
        }
        html2pdf(element, opt)
      }
    }
  }
</script>

<style>

  @page:left{
    @bottom-left {
      content: "Page " counter(page) " of " counter(pages);
    }
  }

</style>

<style scoped>
  .float{
    position:fixed;
    bottom:40px;
    z-index: 2;
    right:20px;
    color: #c1c1c1;
    text-align:center;
  }

  .titulo {
    font-size: 30px;
  }

  .fep_titulo {
    text-align: right;
    display: none;
  }

  #relatorio_fep .table .cabecalho {
    width: 400px;
    text-align: left;
  }

  #relatorio_fep .table .centralizado {
    text-align: center !important;
  }

  textarea {
    overflow: hidden !important;
    resize: none;
  }

  img.logo_relatorio {
    display: none;
  }

  .assinatura {
    float: left;
    display: none;
  }

  .bloco {
    width: 100% !important;
  }

  .opcao {
    float: right;
    color: cornflowerblue;
  }

  .rodape {
    display: none !important;
  }
  /********************************************************************************************************************************************/

  @media print {

    *:not(.titulo) {
      font-size: 18px;
    }

    .control-label {
      text-transform: uppercase;
    }

    img.logo_relatorio {
      display: block;
    }

    .table {
      margin-bottom: 0px !important;
    }

    .ressaltar {
      font-weight: bold;
    }

    .fep_titulo {
      display: block;
    }

    .juntos {
      page-break-inside: avoid;
    }

    .opcao {
      display: none;
    }

    select, input {
      border: 0;
      padding-left: 20px;
    }

    button {
      display: none;
    }

    .bloco {
      border: 1px solid #d2d6de;
    }

    .bloco textarea {
      border: 0;
    }

    .assinatura {
      display: block;
      text-align: center;
      border-top: 1px solid gray;
      width: 50%;
      margin: 50px 25% 10px 25%;
    }


    select::-ms-expand {
      display: none;
    }
    select{
      -webkit-appearance: none;
      appearance: none;
    }
    @-moz-document url-prefix(){
      .ui-select{border: 1px solid #CCC; border-radius: 4px; box-sizing: border-box; position: relative; overflow: hidden;}
      .ui-select select { width: 110%; background-position: right 30px center !important; border: none !important;}
    }

    @page {
      /*size: portrait;*/
      /*margin: 0;*/
    }

    body {
      background: white !important;
      /*margin: 2cm;*/
    }


    .rodape {
      position: fixed !important;
      bottom: 0 !important;
      width: 100% !important;
      display: block !important;
      margin-top: 10px;
      border-top: 1px solid gray;
      font-size: 10px;
      font-style: italic;
      padding: 0 10px;
      left: 0;
      right: 0;
      z-index: 1000;
    }

    .rodape .secao_esquerda {
      float: left;
      text-align: left;
      width: 35%;
    }
    .rodape .secao_centro {
      float: left;
      text-align: center;
      width: 30%;
    }
    .rodape div.secao_centro:after {
      content: "Pág. " counter(page) " de " counter(pages);
    }
    .rodape .secao_direita {
      float: right;
      text-align: right;
      width: 35%;
    }

    .content-wrapper, .box.box-primary {
      border: 0 !important;
    }

    .bloco_texto {
      width: 100% !important;
      border: 1px solid #d2d6de;
      padding: 6px 12px;
      white-space: pre-wrap
    }

    div.nao_imprimir, span.nao_imprimir {
      display: none !important;
    }
    table.nao_imprimir {
      visibility: collapse !important;
    }

    div.imprimir, span.imprimir {
      display: block !important;
    }
    table.imprimir {
      visibility: visible !important;
    }

    #Header, #Footer { display: none !important; }

    #app .content-wrapper * {
      background: white !important;
    }


  }


</style>

<style>
  .main-sidebar, .left-side {
    top: 0;
    left: 0;
    padding-top: 50px;
    min-height: 100%;
    width: 230px;
    z-index: 810;
    -webkit-transition: -webkit-transform .3s ease-in-out,width .3s ease-in-out;
    -moz-transition: -moz-transform .3s ease-in-out,width .3s ease-in-out;
    -o-transition: -o-transform .3s ease-in-out,width .3s ease-in-out;
    transition: transform .3s ease-in-out,width .3s ease-in-out;
    position: fixed !important;
  }


  .main-header {
    position: fixed !important;
    top: 0;
    width: 100%;
  }


  .skin-fbb .content-header {
    position: fixed !important;
    top: 50px;
    width: 87vw;
    z-index: 800;
    background: #ecf0f5 !important;
    border-left: 1px solid #d2d6de;
    margin-left: -1px;
    padding-bottom: 10px;
    box-shadow: 0px 1px 10px rgba(112,112,112,0.5);
    -ms-filter: "progid:DXImageTransform.Microsoft.Shadow(Strength=4, Direction=180, Color='#aaaabb')";
    filter: progid:DXImageTransform.Microsoft.Shadow(Strength=4, Direction=180, Color='#aaaabb');
  }

  .content-header>.breadcrumb {
    position: fixed !important;
    background: transparent;
    margin-top: 50px;
    margin-bottom: 0;
    font-size: 12px;
    padding: 7px 5px;
    top: 60px !important;
    right: 10px;
    border-radius: 2px;
    float: left;
  }

  .content {
    min-height: 250px;
    padding: 15px;
    margin-right: auto;
    margin-left: auto;
    padding-left: 15px;
    padding-right: 15px;
    margin-top: 100px;
  }

  .main-sidebar, .left-side {
    position: fixed !important;
    top: 0;
    left: 0;
    padding-top: 50px;
    min-height: 100%;
    width: 230px;
    z-index: 810;
    -webkit-transition: -webkit-transform .3s ease-in-out,width .3s ease-in-out;
    -moz-transition: -moz-transform .3s ease-in-out,width .3s ease-in-out;
    -o-transition: -o-transform .3s ease-in-out,width .3s ease-in-out;
    transition: transform .3s ease-in-out,width .3s ease-in-out;
  }
  .required-fep:after{
    font-weight: bold;
    color: #e32;
    content: ' *';
    display: inline;
  }
</style>
