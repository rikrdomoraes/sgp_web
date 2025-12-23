<template>
  <div class="box-body extratoff">

    <div class="row">

      <div v-if="loading.carregando" class="col-md-12">
        <h4><i class="fa fa-refresh fa-spin"></i>  Verificando se há acertos de devolução no Sapiens e atualizando SGP...</h4>
      </div>

      <div v-else class="col-md-12">
        <div v-if="acertos.length === 0" class="col-md-12">
          <p v-if="acertoAcao === ''" class="bg-info">
            Não há registros de acertos/devolução no Contas a Pagar nem a Receber no Sapiens
          </p>
          <p v-else class="bg-danger">{{acertoAcao}}</p>
        </div>

        <div v-else class="col-md-12">

          <div v-show="loading.processando" class="overlay" style="position: absolute; top: 0px; left: 0px; width: 100%; height: 100%; display: block;"><i class="fa fa-refresh fa-spin"></i></div>

          <!--<span class="opcaoAlterar">-->
            <!--<g-button-ujarak color="primary" size="button&#45;&#45;size-ss" @click.native="formEditavel = !formEditavel"><i class="fa fa-pencil" aria-hidden="true"></i> Alterar</g-button-ujarak>-->
              <!--<i class="fa fa-question-circle" aria-hidden="true"-->
                 <!--:title="'<h5>Aqui constam os títulos de acertos registrados no Sapiens<br/><br/>Pode ser feito Recomposição de saldo de itens ou cancelamento de NF.<br/>Estas alterações são registradas <b>somente no SGP</b></h5>'"-->
                 <!--v-tippy="{inertia:true, arrow:true, animation:'perspective', distance:'1', size:'large', arrow:true}"></i>-->
          <!--</span>-->

          <div class="row">
            <div class="col-md-12">
              <table class="table table-condensed">

                <template v-for="(recurso, codigoRecurso) in _.groupBy(acertos, 'origem')">
                  <thead>
                  <tr class="cabecalho">
                    <th colspan="2" class="">Acertos por conta financeira em Recursos {{codigoRecurso === 1 ? 'da Fundação BB' : 'de Parceiro Estratégico'}}</th>
                    <th class="centralizado" style="width: 80px" :title="'<h5>Situação do título no Sapiens</h5>'" v-tippy="{inertia:true, arrow:true, animation:'perspective', distance:'1', size:'large', arrow:true}">Situação</th>
                    <th class="centralizado" style="width: 130px" :title="'<h5>Número do título criado no Sapiens</h5>'" v-tippy="{inertia:true, arrow:true, animation:'perspective', distance:'1', size:'large', arrow:true}">Nº do documento</th>
                    <th class="centralizado" style="width: 140px" :title="'<h5>Classificação do acerto se veio de um cancelamento de nota fiscal de entrada no Sapiens ou de título no contas a receber</h5>'" v-tippy="{inertia:true, arrow:true, animation:'perspective', distance:'1', size:'large', arrow:true}">Origem do acerto</th>
                    <th class="centralizado" style="width: 100px" :title="'<h5>Valor do título no Sapiens</h5>'" v-tippy="{inertia:true, arrow:true, animation:'perspective', distance:'1', size:'large', arrow:true}">Valor</th>
                    <th class="centralizado" style="width: 180px">
                      <i class="fa fa-question-circle" aria-hidden="true"
                         :title="'<h5>Aqui constam os títulos de acertos registrados no Sapiens<br/><br/>O botão de Recomposição de saldo de itens permitirá acrescebtar saldo nos itens escolhidos sem alterar seu orçamento<br/> O botão de Cancelamento de processo de NF cancelará o ID da solicitação no SGP correspondente ao título cancelado no Sapiens.<br/>O botão de visualiar permite saber para quais itens foi a recomposiação do saldo se houver<br/>Este é um formulário dinâmico que sempre lê o Sapiens e as alterações registradas aqui <b>somente afetam o SGP</b></h5>'"
                         v-tippy="{inertia:true, arrow:true, animation:'perspective', distance:'1', size:'large', arrow:true}"></i>
                    </th>
                  </tr>
                  </thead>

                  <tbody>

                  <!-- Tabela -->
                  <template v-for="(conta, numeroConta) in _.groupBy(recurso, 'numeroContaFinanceira')">
                    <tr class="atividade">
                      <td colspan="5" class="esquerda celula b1 b3 b4">{{_.first(conta)['numeroContaFinanceira']}} / {{_.first(conta)['nomeContaFinanceira']}}</td>
                      <td class="centralizado celula b1 b3 b2">{{_.sumBy(conta, function (c) { return parseFloat(c.valor) }) | real}}</td>
                      <td class="centralizado celula b1 b3 b2">&nbsp;</td>
                    </tr>

                    <template v-for="(titulo, tituloIndex) in conta">
                      <tr>
                        <td class="centralizado celula b3 b4">
                              <span :title="'<h5>Data de Entrada do título no Sapiens</h5>'" v-tippy="{inertia:true, arrow:true, animation:'perspective', distance:'1', size:'large', arrow:true}">
                                {{titulo.dataEntrada | moment("L")}}
                              </span>
                          <br/>
                          <span :title="'<h5>Data de Pagamento</h5>'" v-tippy="{inertia:true, arrow:true, animation:'perspective', distance:'1', size:'large', arrow:true}">
                                {{titulo.dataPagamento | moment("L")}}
                              </span>
                        </td>

                        <td class="celula b3 b4">
                          <strong>{{titulo.codigoClienteFornecedor}}  {{titulo.nomeClienteFornecedor}}</strong>
                          <br/>
                          <span>{{titulo.observacao}}</span>
                        </td>

                        <td class="centralizado celula b3 b4">
                            <span>{{titulo.situacaoTitulo}}</span>
                        </td>

                        <td class="centralizado celula b3 b4">
                            <span>
                              {{titulo.numeroTitulo}}<br/>
                              {{titulo.tipoTitulo}}
                            </span>
                        </td>

                        <td class="centralizado celula b3 b4">
                            <span>{{titulo.origemAcerto}}</span>
                        </td>

                        <td class="centralizado celula b3 b4">
                            <span>{{titulo.valor | real}}</span>
                        </td>

                        <td class="centralizado celula b2 b3 b4">
                            <span v-if="!mostrarListaItens">
                              <span v-if="formEditavel">

                                <span v-if="titulo.origemAcerto === 'Título - Contas a Receber'">
                                  <span v-if="_.find(_.get(titulo, 'processo.documentosliberacao[0].itens_liberados'), ['tipo', 'BASE'])">
                                    <g-button-ujarak @click.native="visualizaRecomposicaoSaldos(titulo)" color="success" size="button--size-ss"><i class="fa fa-search"></i> Visualizar</g-button-ujarak>
                                  </span>
                                  <span v-else>
                                    <g-button-ujarak @click.native="recomporSaldos(titulo)" color="primary" size="button--size-ss"><i class="fa fa-dollar"></i> <i class="fa fa-level-up" style="margin-left: -2px;"></i> Recompor saldos</g-button-ujarak>
                                  </span>
                                </span>

                                <span v-else-if="titulo.origemAcerto === 'Cancelamento NF - Contas a Pagar\''">
                                  <g-button-ujarak @click.native="cancelarSolicitacao(titulo)" color="primary" size="button--size-ss"><i class="fa fa-ban" aria-hidden="true"></i> Cancelar solicitação</g-button-ujarak>
                                </span>

                              </span>
                              <span v-else>
                                <span v-if="_.find(_.get(titulo, 'processo.documentosliberacao[0].itens_liberados'), ['tipo', 'BASE'])">
                                  <g-button-ujarak @click.native="visualizaRecomposicaoSaldos(titulo)" v-if="titulo.origemAcerto === 'Título - Contas a Receber'" color="success" size="button--size-ss"><i class="fa fa-search"></i> Visualizar</g-button-ujarak>
                                </span>
                                <span v-else>&nbsp;</span>
                              </span>
                            </span>
                        </td>

                      </tr>



                  <!--Formulario de item -------------------------------------------------------------------------->
                      <tr v-if="mostrarListaItens && acertoEdicao.chave === titulo.chave">
                        <td colspan="7">
                          <div class="quadroEdicaoItem" style="padding: 10px">

                            <!-- Lista de itens ------------------------------------------->
                            <div class="form-group">
                              <label class="control-label col-md-12" style="text-align: left">Itens com a mesma conta financeira do acerto:</label>
                              <div>
                                <div class="col-md-12">
                                  <table class="table table-condensed table-bordered table-hover">
                                    <thead>
                                    <tr class="cabecalho">
                                      <th colspan="2">&nbsp;</th>
                                      <th colspan="2" class="centralizado" :title="'<h5>Valor total contratado no projeto por Atividade e Item</h5>'" v-tippy="{inertia:true, arrow:true, animation:'perspective', distance:'1', size:'large', arrow:true}">
                                        Orçado
                                      </th>
                                      <th rowspan="2" class="centralizado" :title="'<h5>Valor para recomposição do saldo do item</h5>'" v-tippy="{inertia:true, arrow:true, animation:'perspective', distance:'1', size:'large', arrow:true}">
                                        Recomposição
                                      </th>
                                      <th colspan="2" class="centralizado" :title="'<h5>Saldo restante de cada Atividade e Item</h5>'" v-tippy="{inertia:true, arrow:true, animation:'perspective', distance:'1', size:'large', arrow:true}">
                                        Saldo
                                      </th>
                                      <th class="centralizado">&nbsp;</th>
                                    </tr>
                                    <tr class="cabecalho">
                                      <th colspan="2">Atividade / Recursos (itens do cronograma)</th>
                                      <th class="centralizado">Qtde</th>
                                      <th class="centralizado">Valor</th>
                                      <th class="centralizado">Qtde</th>
                                      <th class="centralizado">Valor</th>
                                      <th class="centralizado" :title="'<h5>Percentual aproximado já liberado<br/>Não considera Economicidade</h5>'" v-tippy="{inertia:true, arrow:true, animation:'perspective', distance:'1', size:'large', arrow:true}">
                                        Atingimento
                                      </th>
                                    </tr>
                                    </thead>
                                    <tbody>

                                      <template v-for="item in itensRecomposiacaoEdicao">
                                        <tr v-if="(acertoAcao === 'edicao') || (acertoAcao === 'visualizacao' && _.has(item, 'Valor_solicitado') && item.Valor_solicitado !== 0)">
                                          <td class="centralizado celula b3 b4">
                                            <span v-if="('' + item.origem).substring(0, 1) === '1'">Fundação</span>
                                            <span v-else-if="('' + item.origem).substring(0, 1) === '2'">Contrapartida</span>
                                            <span v-else-if="('' + item.origem).substring(0, 1) === '5'">P.Estratégico</span>

                                            <span v-if="item.adiantavel === '1' || item.adiantavel === 1"><br/>Adiantável</span>
                                          </td>


                                          <td class="celula b3 b4">
                                            <div class="item">
                                              <div class="item_despesa esquerda">({{_.upperFirst(_.lowerCase(item.item.ds_type))}})  {{item.item.ds_code + ' / ' + item.item.ds_description}}</div>
                                              <div class="conta_financeira direita">{{item.contaFinanceiraNumero}} / {{item.contaFinanceiraDescricao}}</div>
                                              <div class="observacao esquerda" v-html="'<span class=id_item>#' + item.id + '</span>  ' + item.observacao + '</span>'"/>
                                            </div>
                                          </td>

                                          <!-- Seção de orçamento -->
                                          <td class="centralizado celula b3 b4" :title="'<h5>' + (!_.has(item, 'unidade_medida') || _.isNull(item.unidade_medida) ? 'Sem unid. de medida' : (item.unidade_medida === 'Outros' && _.has(item, 'medida_outros') && !_.isNull(item.medida_outros) ? ('Outros:<br/>' + item.medida_outros) : item.unidade_medida)) + '</h5>'" v-tippy="{inertia:true, arrow:true, animation:'perspective', distance:'1', size:'large', arrow:true}">
                                            {{item.quantidadeOrcado}}
                                          </td>
                                          <td class="centralizado celula b3">{{item.valorOrcado | decimal2}}</td>


                                          <!-- Seção de solicitação / valor de recomposição de saldo -->
                                          <td class="centralizado celula b3 valorRecomposicao">
                                            <money v-model="item.Valor_solicitado" name="valor a recompor" class="form-control text-right valorSolicitacao" type="text" @keyup.native="item.Valor_solicitado = limitaFaixaEntrada(item, 0, acertoEdicao.valor)" :disabled="acertoAcao === 'visualizacao'"></money>
                                          </td>


                                          <!-- Seção de saldos -->
                                          <td class="centralizado celula b3 b4" :title="'<h5>' + (!_.has(item, 'unidade_medida') || _.isNull(item.unidade_medida) ? 'Sem unid. de medida' : (item.unidade_medida === 'Outros' && _.has(item, 'medida_outros') && !_.isNull(item.medida_outros) ? ('Outros:<br/>' + item.medida_outros) : item.unidade_medida)) + '</h5>'" v-tippy="{inertia:true, arrow:true, animation:'perspective', distance:'1', size:'large', arrow:true}">
                                            {{item.quantidadeSaldo}}
                                          </td>
                                          <td class="centralizado celula b3">{{item.valorSaldo + parseFloat(item.Valor_solicitado) | decimal2}}</td>
                                          <td class="centralizado celula b3 b2">
                                            {{item.percAtingimento | percentage}}
                                            <i v-if="('' + item.economicidade) === '1'" class="fa fa-dollar economicidade" :title="'<h5>Comprovado com Economicidade</h5>'" v-tippy="{inertia:true, arrow:true, animation:'perspective', distance:'1', size:'large', arrow:true}"></i>
                                          </td>
                                        </tr>
                                      </template>

                                    </tbody>
                                  </table>

                                </div>
                              </div>
                            </div>

                            <!-- Justificativa ----------------------------------------->
                            <div v-if="formEditavel" class="col-md-12 form-group required-field" :class="{'has-error' : errors.first('justificativa')}">
                              <label class="control-label col-md-2">Justificativa:</label>
                              <div class="col-md-10">
                                <textarea v-resizable v-model="acertoEdicao.justificativa" name="justificativa" placeholder="Descreva justificativa para recomposição dos itens deste acerto" class="form-control" rows="3" v-validate="'required'" data-vv-as="Justificativa" :disabled="acertoAcao === 'visualizacao'"></textarea>
                                <span v-if="errors.first('justificativa')" class="label label-danger"> {{ errors.first('justificativa') }}</span>
                              </div>
                            </div>


                            <!-- Botões de OK e Cancelar ----------------------------->
                            <div class="form-group">
                              <div class="col-md-10 col-md-offset-2">
                                <button @click="ok" v-if="acertoAcao !== 'visualizacao'" type="button" class="btn btn-confirm btn-flat"><i class="fa fa-check" aria-hidden="true"></i> Ok</button>
                                <button @click.once="cancelar" type="button" class="btn btn-back btn-flat"><i class="fa fa-times-circle" aria-hidden="true"></i> Cancelar</button>
                              </div>
                            </div>

                          </div>

                        </td>
                      </tr>

                    </template>

                  </template>

                  </tbody>

                </template>

              </table>

            </div>

          </div>

        </div>
      </div>

    </div>

  </div>
</template>

<script>
  export default {
    name: 'acertos-financeiros',
    data () {
      return {
        loading: {
          carregando: false,
          processando: false
        },
        mostrarListaItens: false,
        acertos: [],
        acertoAcao: '',
        acertoEdicao: {},
        itensRecomposiacaoEdicao: [],
        formEditavel: true,
        alteracoes: []
      }
    },
    props: ['numeroProjeto', 'editavel', 'propsAtividades'],
    watch: {
      // editavel: function () {
      //   this.formEditavel = this.editavel
      //   this.alteracoes = []
      // }
    },
    computed: {
    },
    mounted () {
    },
    created () {
      this.atualizarAcertos()
    },
    methods: {
      limitaFaixaEntrada (item, minimo, maximo) {
        let valor = _.clone(item.Valor_solicitado)
        if (_.isNil(valor) && _.isNull(valor) && _.isNaN(valor)) {
          valor = minimo
          console.log('valor nulo', minimo)
        } else {
          valor = _.toNumber(('' + valor).replace(/[^.0-9]+/g, ''))
          valor = valor <= minimo ? minimo : (valor >= maximo ? maximo : valor)
        }
        this.$forceUpdate()
        return valor
      },
      itensRecomposiacao (conta, fase, itensUsados) {
      // Itens que podem ser usados ou já foram usados na recomposição de saldos
        console.log('itensUsadosNaRecomposiacao', conta, fase, itensUsados)
        let itensFiltrados = []
        this.propsAtividades.forEach((atividade) => {
          if (atividade.itens_orcamentos) {
            atividade.itens_orcamentos.forEach((item) => {
              if (('' + item.origem).substring(0, 1) === ('' + fase) && ('' + item.conta_financeira.numero_conta) === ('' + conta)) { // Se for na mesm fase e conta separe na lista de itens filtrados
                _.unset(item, 'Valor_solicitado')
                if (itensUsados.length > 0) {
                  // Se há itens usados na recomposição, então procura pelo id do orçamento usado que seja igual ao do item do cronograma com mesma conta e fase
                  let itemOrcamento = _.filter(itensUsados, function (i) {
                    return _.get(_.head(i.itens_orcamentos), 'id') === item.id
                  })
                  if (itemOrcamento.length > 0) {
                    // A operação é armazenada no BD (itens_liberados) com valor negativo porque é uma ação inversa (devolução) ao débito, mas aqui deve mostrar com o um valor absoluto para efeito de pedido
                    item['Valor_solicitado'] = Math.abs(_.get(_.head(itemOrcamento), 'valor'))
                  }
                }
                itensFiltrados.push(item)
              }
            })
          }
        })
        this.itensRecomposiacaoEdicao = itensFiltrados
      },
      atualizarAcertos () {
        this.loading.carregando = true
        axiosLaravel.get('acertos/atualizar/' + this.numeroProjeto).then((response) => {
          if (response.data.codigo === 'OK') {
            this.acertos = response.data.retorno
          } else {
            this.acertoAcao = _.join(response.data.mensagem, '; ')
          }
          this.loading.carregando = false
          this.$snotify.clear()
        })
          .catch((error) => {
            this.loading.carregando = false
            this.$root.trataErro(error)
          })
      },
      recomporSaldos (titulo) {
        this.acertoAcao = 'edicao'
        this.acertoEdicao = _.clone(titulo)
        this.itensRecomposiacao(this.acertoEdicao.numeroContaFinanceira, this.acertoEdicao.origem, _.filter(_.get(this.acertoEdicao, 'processo.documentosliberacao[0].itens_liberados'), ['tipo', 'BASE']))
        this.mostrarListaItens = true
      },
      visualizaRecomposicaoSaldos (titulo) {
        this.acertoAcao = 'visualizacao'
        this.acertoEdicao = _.clone(titulo)
        this.itensRecomposiacao(this.acertoEdicao.numeroContaFinanceira, this.acertoEdicao.origem, _.filter(_.get(this.acertoEdicao, 'processo.documentosliberacao[0].itens_liberados'), ['tipo', 'BASE']))
        this.mostrarListaItens = true
      },
      cancelarSolicitacao (titulo) {
        let vm = this
        this.$dialog.confirm('Ao confirmar, o id ' + titulo['idSolicitacaoNF'] + ' da solicitação no SGP relacionado a este título no Sapiens ficará como CANCELADO no SGP', {html: true, animation: 'fade', customClass: 'avisoConfirmacao'}).then(function (dialog) {
          vm.$snotify.async('Processando a cancelamento do id ' + titulo['idSolicitacaoNF'] + ' no SGP...', {timeout: 0})
          vm.loading.processando = true
          axiosLaravel.get('acertos/cancela_nf/' + titulo['idSolicitacaoNF']).then((response) => {
            if (_.has(response.data, 'codigo')) {
              if (response.data.codigo === 'OK') {
                vm.$snotify.success(response.data.mensagem, {timeout: 2000})
                vm.$router.go(0)
              } else {
                vm.$snotify.error(response.data.mensagem)
              }
            }
            vm.loading.processando = false
            vm.$snotify.clear()
          })
            .catch((error) => {
              vm.loading.processando = false
              vm.$root.trataErro(error)
            })
        }).catch(function () {
          console.log('Aviso de Confirmações fechado SEM confirmar cancelamento de processo')
        })
      },
      ok () {
        let restricoesConcluir = []
        let itensRecomposicao = _.filter(this.itensRecomposiacaoEdicao, function (i) { return _.has(i, 'Valor_solicitado') && i.Valor_solicitado > 0 })
        let totalInformado = _.sumBy(itensRecomposicao, 'Valor_solicitado')
        if (totalInformado === 0) {
          restricoesConcluir.push('Não foi adicionado valor em qualquer um dos itens para este acerto')
        }
        if (totalInformado > this.acertoEdicao.valor) {
          restricoesConcluir.push('O total informado de R$ ' + totalInformado + ' está superior ao valor deste acerto de R$ ' + this.acertoEdicao.valor)
        }

        if (restricoesConcluir.length > 0) {
          let mensagens = '<div class=avisoAlerta><li>' + _.join(restricoesConcluir, '<li>') + '</div>'
          this.$dialog.alert(mensagens, {html: true, animation: 'fade', customClass: 'avisoAlerta'}).then(function (dialog) {})
        }
        this.$validator.validateAll().then((result) => {
          if (result && restricoesConcluir.length === 0) {
            let vm = this
            this.$dialog.confirm('Ao confirmar, os saldos adicionados irão para os itens correspondentes no cronograma', {html: true, animation: 'fade', customClass: 'avisoConfirmacao'}).then(function (dialog) {
              vm.$snotify.async('Processando a recomposição de saldo...', {timeout: 0})
              let registroProcessamento = {'acerto': vm.acertoEdicao, 'itensRecomposicao': itensRecomposicao}
              vm.loading.processando = true
              axiosLaravel.post('/acertos/recomposicao/', registroProcessamento).then((response) => {
                vm.$snotify.clear()
                if (_.has(response.data, 'codigo')) {
                  if (response.data.codigo === 'OK') {
                    vm.$snotify.success(response.data.mensagem, {timeout: 2000})
                    vm.$router.go(0)
                  } else {
                    vm.$snotify.error(response.data.mensagem)
                  }
                }
                vm.loading.processando = false
              })
                .catch((error) => {
                  vm.loading.processando = false
                  vm.$root.trataErro(error)
                  vm.$snotify.clear()
                })
            }).catch(function () {
              console.log('Aviso de Confirmações fechado SEM confirmar gravação de itens para recomposição de saldo de acerto')
            })
          }
        })
      },
      cancelar () {
        this.acertoAcao = ''
        this.acertoEdicao = {}
        this.itensRecomposiacaoEdicao = []
        this.mostrarListaItens = false
      }
    }
  }
</script>

<style scoped>
  .valorRecomposicao {
    width: 200px;
  }
</style>
