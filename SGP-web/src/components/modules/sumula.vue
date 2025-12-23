<template>
  <div class="box box-widget" style="min-height: 200px">
    <div v-if="loading.tela">
      <div class="overlay" style="position: absolute; top: 0px; left: 0px; width: 100%; height: 100%; display: block;"><i class="fa fa-refresh fa-spin"></i></div>
    </div>

    <div v-else class="row">
      <div class="col-md-12">
        <div class="box-body">
          <div style="text-align: center; width: 100%; font-weight: bold; font-size: 18px">Súmula de Alteração em Projeto</div>
          <div style="text-align: right; width: 100%">Dides / Alteração em Projetos ID <strong>{{ this.id }}</strong></div>
          <div style="text-align: right; width: 100%">Brasília (DF),	{{ (new Date()).getDate() }} de {{ (new Date()).toLocaleString('pt-br', { month: 'long' }) }} de {{ (new Date()).getFullYear() }}</div>
          <div style="text-align: right; width: 100%; font-style: italic">#interna</div>
        </div>

        <div class="secao_sumula" v-if="!_.isEmpty(propostaBackup)">
          <table class="table">
            <tr>
              <td class="b3 pad10" style="width: 200px">Número e Título do projeto</td>
              <td class="b3 pad10 valor_lista" colspan="5">{{propostaBackup.ds_codigo_projeto_erp}} - {{propostaBackup.ds_nome}}</td>
            </tr>
            <tr>
              <td class="b3 pad10">Nome da Instituição</td>
              <td class="b3 pad10 valor_lista" colspan="5">{{propostaBackup.projetoSapiens.entidadeParceira.nomfor}}</td>
            </tr>
            <tr>
              <td class="b3 pad10">Objetivo Geral</td>
              <td class="b3 pad10 valor_lista" colspan="5">{{propostaBackup.ds_objetivo_geral}}</td>
            </tr>
            <tr>
              <td class="b3 pad10">Municípios Atendidos</td>
              <td class="b3 pad10 valor_lista" colspan="5">{{ _.join(_.uniq(_.map(propostaBackup.municipalizacao, function (m) { return m.ds_municipio + (_.isNil(m.ds_uf) ? '' : ' (' + m.ds_uf + ')') })), ', ') }}</td>
            </tr>
            <tr>
              <td class="b3 pad10">Valor do projeto</td>
              <td class="b3 pad10 valor_lista">{{ _.sumBy(_.map(_.filter(_.flatten(_.map(propostaBackup.atividades, 'itens_orcamentos')), function (i) { return _.includes(['1', '5'], ('' + i.origem).substr(0, 1)) }), 'valor_total')) | real }}</td>
              <td class="b3 pad10">Contrapartida</td>
              <td class="b3 pad10 valor_lista" colspan="3">{{ _.sumBy(_.map(_.filter(_.flatten(_.map(propostaBackup.atividades, 'itens_orcamentos')), function (i) { return _.includes(['2'], ('' + i.origem).substr(0, 1)) }), 'valor_total')) | real }}</td>
            </tr>
            <tr>
              <td class="b3 pad10">Data de Deferimento</td>
              <td class="b3 pad10 valor_lista">{{propostaBackup.projetoSapiens.usu_datdef | moment("L")}}</td>
              <td class="b3 pad10">Fim do Prazo de Execução</td>
              <td class="b3 pad10 valor_lista">{{ dataFinal }}</td>
              <td class="b3 pad10">Fim de Vigência</td>
              <td class="b3 pad10 valor_lista">{{ dataFinalVigencia | moment("L") }}</td>
            </tr>
            <tr>
              <td class="b3 pad10">Projeto superior</td>
              <td class="b3 pad10 valor_lista" colspan="5">{{ propostaBackup.projetoSapiens.projetoSuperior.numprj }} - {{ propostaBackup.projetoSapiens.projetoSuperior.nomprj }}</td>
            </tr>
            <tr>
              <td class="b3 pad10">Justificativa</td>
              <td class="b3 pad10 valor_lista" colspan="5">{{ solicitacao.justificativa }}</td>
            </tr>
          </table>
        </div>

        <div class="secao_sumula">
          <div class="titulo_secao_sumula">Tipo de alteração a ser efetuada no projeto</div>

          <div class="">
            <table class="table">
              <tr v-if="_.toNumber(solicitacao.sumula.resumoAlteracoes.metas) > 0">
                <td class="b3 pad10" colspan="2">Alteração de metas</td>
              </tr>
              <tr v-if="_.toNumber(solicitacao.sumula.resumoAlteracoes.contrapartidas) > 0">
                <td class="b3 pad10" colspan="2">Alteração da contrapartida aprovada</td>
              </tr>
              <tr v-if="_.toNumber(solicitacao.sumula.resumoAlteracoes.ajusteQuantidade) !== 0">
                <td class="b3 pad10" colspan="2">Ajustes nas quantidades dos itens de despesa</td>
              </tr>
              <tr v-if="_.toNumber(solicitacao.sumula.resumoAlteracoes.prorrogacaoExecucao[1]) > 0  || _.toNumber(solicitacao.sumula.resumoAlteracoes.prorrogacaoVigencia[1]) > 0">
                <td class="b3 pad10" colspan="2">Prorrogação de prazo(s)</td>
              </tr>
              <tr v-if="_.toNumber(solicitacao.sumula.resumoAlteracoes.prorrogacaoExecucao[0]) !== _.toNumber(solicitacao.sumula.resumoAlteracoes.prorrogacaoExecucao[1])">
                <td class="b3 pad10 pL20">Prazo de Execução</td>
                <td class="b3 pad10 text-right">
                  De <span class="valor_lista">{{ solicitacao.sumula.resumoAlteracoes.prorrogacaoExecucao[0] }}</span> meses para <span class="valor_lista">{{ solicitacao.sumula.resumoAlteracoes.prorrogacaoExecucao[1] }}</span> meses
                </td>
              </tr>
              <tr v-if="_.toNumber(solicitacao.sumula.resumoAlteracoes.prorrogacaoVigencia[0]) !== _.toNumber(solicitacao.sumula.resumoAlteracoes.prorrogacaoVigencia[1])">
                <td class="b3 pad10 pL20">Prazo de Vigência</td>
                <td class="b3 pad10 text-right">
                  De <span class="valor_lista">{{ solicitacao.sumula.resumoAlteracoes.prorrogacaoVigencia[0] }}</span> meses para <span class="valor_lista">{{ solicitacao.sumula.resumoAlteracoes.prorrogacaoVigencia[1] }}</span> meses
                </td>
              </tr>
              <template v-if="_.find(solicitacao.processos, function (prc) { return _.includes(['REMANEJAMENTO', 'SUPLEMENTACAO'], prc.nome) })">
                <tr>
                  <td class="b3 pad10">Alteração de Cronograma físico-financeiro</td>
                  <td class="b3 pad10 valor_lista text-right">{{ _.join(_.map(_.filter(solicitacao.processos, function (prc) { return _.includes(['REMANEJAMENTO', 'SUPLEMENTACAO'], prc.nome) }), 'nome'), ', ') }}</td>
                </tr>
                <tr v-if="_.toNumber(solicitacao.sumula.resumoAlteracoes.novosItens) > 0">
                  <td class="b3 pad10 pL20">
                    Inclusão de novos itens no projeto
                  </td>
                  <td class="b3 pad10 valor_lista text-right">
                    {{ solicitacao.sumula.resumoAlteracoes.novosItens }}
                  </td>
                </tr>
                <tr v-if="_.toNumber(solicitacao.sumula.resumoAlteracoes.substituicaoItens) > 0">
                  <td class="b3 pad10 pL20">
                    Substituição de itens de despesas constantes do projeto
                  </td>
                  <td class="b3 pad10 valor_lista text-right">
                    {{ solicitacao.sumula.resumoAlteracoes.substituicaoItens }}
                  </td>
                </tr>
                <tr v-if="_.toNumber(solicitacao.sumula.resumoAlteracoes.percentualRemanejamentosConcedidos) > 0 && _.find(solicitacao.processos, ['nome', 'REMANEJAMENTO'])">
                  <td class="b3 pad10 pL20">
                    Percentual dos Remanejamentos Concedidos
                  </td>
                  <td class="b3 pad10 valor_lista text-right">
                    {{ _.toNumber(solicitacao.sumula.resumoAlteracoes.percentualRemanejamentosConcedidos)/100 | percentage }}
                  </td>
                </tr>
                <tr v-if="_.toNumber(solicitacao.sumula.resumoAlteracoes.percentualRemanejamentoSolicitado) > 0 && _.find(solicitacao.processos, ['nome', 'REMANEJAMENTO'])">
                  <td class="b3 pad10 pL20">
                    Remanejamento Solicitado (Valor e Percentual)
                  </td>
                  <td class="b3 pad10 valor_lista text-right">
                    {{ _.toNumber(solicitacao.sumula.resumoAlteracoes.valorRemanejado || 0) | real }}
                    <span style="margin-left: 10px">
                      ( {{ _.toNumber(solicitacao.sumula.resumoAlteracoes.percentualRemanejamentoSolicitado) | percentage }} )
                    </span>
                  </td>
                </tr>
                <template v-if="_.find(solicitacao.processos, function (prc) { return _.includes(['REMANEJAMENTO', 'SUPLEMENTACAO'], prc.nome) })">
                  <tr>
                  <td class="b3 pad10 pL20" style="width: 50%; vertical-align: top">
                    <p class="text-bold">Débitos</p>
                    <div v-for="alteracao in _.get(_.find(solicitacao.processos, function (prc) { return _.includes(['REMANEJAMENTO', 'SUPLEMENTACAO'], prc.nome) }), 'alteracao', [])" v-if="_.toNumber(alteracao.valorAlteracao[1]) < 0">
                      <span v-for="item in [itemExtrato(alteracao.id)]">
                        <div class="itemExtrato">
                          <span class="itemInformacao">
                            <span><span class="text-muted">({{_.upperFirst(_.lowerCase(item.item.ds_type))}})  {{item.item.ds_code + ' / ' + item.item.ds_description}}</span> <span class="itemDescricao"> - {{ item.observacao }}</span></span>
                            <span v-if="alteracao.justificativa" class="text-bold">{{ alteracao.justificativa[1] ? alteracao.justificativa[1] : "" }}</span>
                            <span class="itemValores">
                              <span class="itemOrcado">{{ item.valor_total | real }}</span>
                              <span class="itemValorAlteracao text-red">{{ _.toNumber(alteracao.valorAlteracao[1]) | real }}</span>
                              <span class="itemOrcadoAlterado">{{ item.valor_total + (_.toNumber(alteracao.valorAlteracao[1])) | real }}</span>
                            </span>
                          </span>
                        </div>
                      </span>
                    </div>
                  </td>
                  <td class="b3 pad10 pL20" style="width: 50%; vertical-align: top">
                    <p class="text-bold">Créditos</p>
                    <div v-for="alteracao in _.get(_.find(solicitacao.processos, function (prc) { return _.includes(['REMANEJAMENTO', 'SUPLEMENTACAO'], prc.nome) }), 'alteracao', [])" v-if="_.toNumber(alteracao.valorAlteracao[1]) >= 0">
                      <span v-for="item in [itemExtrato(alteracao.id)]">
                        <div class="itemExtrato">
                          <span class="itemInformacao">
                            <span><span class="text-muted">({{_.upperFirst(_.lowerCase(item.item.ds_type))}})  {{item.item.ds_code + ' / ' + item.item.ds_description}}</span> <span class="itemDescricao"> - {{ item.observacao }}</span></span>
                            <span v-if="alteracao.justificativa" class="text-bold">{{ alteracao.justificativa[1] ? alteracao.justificativa[1] : "" }}</span>
                            <span class="itemValores">
                              <span class="itemOrcado">{{ item.valor_total | real }}</span>
                              <span class="itemValorAlteracao text-green">+ {{ _.toNumber(alteracao.valorAlteracao[1]) | real }}</span>
                              <span class="itemOrcadoAlterado">{{ item.valor_total + (_.toNumber(alteracao.valorAlteracao[1])) | real }}</span>
                            </span>
                          </span>
                        </div>
                      </span>
                    </div>

                    <div v-for="alteracao in _.get(_.find(solicitacao.processos, function (prc) { return _.includes(['REMANEJAMENTO', 'SUPLEMENTACAO'], prc.nome) }), 'inclusao', [])">
                      <span v-for="item in [itemExtrato(alteracao.id)]">
                        <div class="itemExtrato">
                          <span class="itemInformacao">
                            <span><span class="label label-info">Novo</span> <span class="text-muted">({{_.upperFirst(_.lowerCase(item.item.ds_type))}})  {{item.item.ds_code + ' / ' + item.item.ds_description}}</span> <span class="itemDescricao"> - {{ item.observacao }}</span></span>
                            <span class="text-bold">{{ item.justificativa }}</span>
                            <span class="itemValores">
                              <span class="itemOrcado">-</span>
                              <span class="itemValorAlteracao text-blue">{{ item.valorAlteracao | real }}</span>
                              <span class="itemOrcadoAlterado">{{ item.valorAlteracao | real }}</span>
                            </span>
                          </span>
                        </div>
                      </span>
                    </div>

                  </td>
                </tr>
                </template>
                <tr v-if="solicitacao.sumula.resumoAlteracoes.percentualRemanejamentoAcumulado > 0 && _.find(solicitacao.processos, ['nome', 'REMANEJAMENTO'])">
                  <td class="b3 pad10 pL20">
                    Percentual Acumulado
                  </td>
                  <td class="b3 pad10 valor_lista text-right">
                    {{ _.toNumber(solicitacao.sumula.resumoAlteracoes.percentualRemanejamentoAcumulado) | percentage }}
                  </td>
                </tr>
                <tr v-if="_.toNumber(solicitacao.sumula.resumoAlteracoes.valorSuplementacao) > 0 && _.find(solicitacao.processos, ['nome', 'SUPLEMENTACAO'])">
                  <td class="b3 pad10 pL20">
                    Valor solicitado de suplementação
                  </td>
                  <td class="b3 pad10 valor_lista text-right">
                    {{ _.toNumber(solicitacao.sumula.resumoAlteracoes.valorSuplementacao) | real }}
                  </td>
                </tr>
                <tr v-if="_.toNumber(solicitacao.sumula.resumoAlteracoes.valorTotalComSuplementacao) > 0 && _.find(solicitacao.processos, ['nome', 'SUPLEMENTACAO'])">

                  <td class="b3 pad10 pL20">
                    Valor do projeto após suplementação
                  </td>
                  <td class="b3 pad10 valor_lista text-right">
                    {{ _.toNumber(solicitacao.sumula.resumoAlteracoes.valorTotalComSuplementacao) | real }}
                  </td>
                </tr>
                <tr v-if="_.find(solicitacao.processos, ['nome', 'SUPLEMENTACAO'])">
                  <td class="b3 pad10 pL20">
                    Enquadramento orçamentário (FEP)
                  </td>
                  <td class="b3 pad10 valor_lista text-right">
                    {{ solicitacao.sumula.resumoAlteracoes.enquadramentoOrcamentarioFEP }}
                  </td>
                </tr>
              </template>
            </table>
          </div>

        </div>

        <div class="secao_sumula">
          <div class="titulo_secao_sumula">Verificação de conformidade</div>

          <div class="col-md-12">
            <table class="sumula_formulario">
              <tr v-for="(pergunta, idx) in _.filter(solicitacao.sumula.questionario, function(q) { return !_.includes(['Q011', 'Q012', 'Q013', 'Q014'], q.codigo) })" class="sumula_pergunta">
                <td class="sumula_codigo">{{ idx + 1 }}</td>
                <td class="sumula_questao" v-html="pergunta.questao"></td>
                <td class="sumula_resposta text-center">
                  <span class="valor_lista">{{ (pergunta.resposta === 'sim' ? 'Sim' : (pergunta.resposta === 'nao' ? 'Não' : (pergunta.resposta === 'pre' ? 'Prejudicado' : '-'))) }}</span>
                </td>
              </tr>
              <tr class="sumula_cabecalho_questoes">
                <td class="sumula_codigo">&nbsp;</td>
                <td class="sumula_questao"><label>Parceria Estratégica?</label></td>
                <td class="sumula_resposta text-center">
                  <span class="valor_lista">{{ (solicitacao.sumula.parceriaEstrategica === 'sim' ? 'Sim' : (solicitacao.sumula.parceriaEstrategica === 'nao' ? 'Não' : '-')) }}</span>
                </td>
              </tr>
              <tr v-for="(pergunta, idx) in _.filter(solicitacao.sumula.questionario, function(q) { return _.includes(['Q011', 'Q012', 'Q013', 'Q014'], q.codigo) })" class="sumula_pergunta" v-if="solicitacao.sumula.parceriaEstrategica === 'sim'">
                <td class="sumula_codigo">{{ idx + (_.filter(solicitacao.sumula.questionario, function(q) { return !_.includes(['Q011', 'Q012', 'Q013', 'Q014'], q.codigo) })).length + 1}}</td>
                <td class="sumula_questao" v-html="pergunta.questao"></td>
                <td class="sumula_resposta text-center">
                  <span class="valor_lista">{{ (pergunta.resposta === 'sim' ? 'Sim' : (pergunta.resposta === 'nao' ? 'Não' : (pergunta.resposta === 'pre' ? 'Prejudicado' : '-'))) }}</span>
                </td>
              </tr>
            </table>
          </div>

        </div>

        <div class="col-lg-12">&nbsp;</div><!-- pula linha -->

        <div class="secao_sumula">
          <div class="titulo_secao_sumula"> Análise:</div>
        </div>

        <div class="secao_sumula">
          <div class="pad10"> <!-- Contexto da análise -->
            <div class="titulo_secao_sumula">Contexto:</div>
            <div>{{ solicitacao.sumula.textoContexto }}</div>
          </div>

          <div class="pad10"> <!-- Situação Problema da análise -->
            <div class="titulo_secao_sumula">Situação Problema:</div>
            <div>{{ solicitacao.sumula.textoSituacaoProblema }}</div>
          </div>

          <div class="pad10"> <!-- Parecer da análise -->
            <div class="titulo_secao_sumula">Parecer:</div>
            <div>{{ solicitacao.sumula.textoParecer }}</div>
          </div>

          <div class="pad10"> <!-- Proposta da análise -->
            <div class="titulo_secao_sumula">Proposta:</div>
            <div>{{ solicitacao.sumula.textoProposta }}</div>
          </div>

          <div v-if="_.has(solicitacao, 'motivoAlteracao.codigo')" class="pad10"> <!-- Proposta da análise -->
            <div class="titulo_secao_sumula">Motivo:</div>
            <div>{{ solicitacao.motivoAlteracao.codigo.replace('_', ' ') }}</div>
          </div>
        </div>

        <div class="secao_sumula"> <!-- Providências de documentação para gerar -->
          <div class="titulo_secao_sumula">Providências:</div>
          <div>
            <span v-if="solicitacao.sumula.providencias.length === 0">Sem providências</span>
            <span v-else>{{ _.join(_.map(solicitacao.sumula.providencias, 'descricao'), ', ') }}</span>
          </div>
        </div>

        <div class="secao_sumula"> <!-- Alçada -->
          <div class="titulo_secao_sumula">
            Competências e Alçadas (SIC 1.4.5.1) - Resolução de Competências e Alçadas Direx 2023_00388 de 11.12.2023
          </div>
          <div>{{ solicitacao.sumula.alcada.descricao }}</div>
        </div>

        </div>
    </div>

  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import moment from 'moment'

  export default {
    name: 'sumula',
    data () {
      return {
        id: null,
        etapa: 'Solicitação',
        quillOptions: {
          theme: 'bubble'
        },
        historico: [],
        dados: {
          periodo: {
            dt_assinatura_convenio: null,
            nr_periodos: null,
            periodo_vigencia: null,
            dt_data_vigencia: null
          }
        },
        loading: {
          tela: false,
          projeto: false,
          motivosSolicitacao: false,
          aditivo: {
            lista: true,
            conteudo: true
          },
          historicos: {
            periodos: false
          }
        },
        mostrar: {
          periodo: false,
          metas: false,
          atividades: false,
          extratoProjeto: false,
          parcelasAdiantamento: false,
          municipios: false,
          sumula: true,
          aditivo: false,
          solicitacao: true,
          historicos: {
            periodos: false,
            tarefas: false
          }
        },
        justificativa: null,
        tarefas: [],
        ultimaTarefa: {},
        anexos: [],
        proposta: {},
        propostaBackup: {},
        atvSemMetas: [],
        criarAtividade: false,
        tabela: {
          historicos: {
            periodos: {
              bordered: true,
              fields: [
                { key: 'id', label: 'ID', thStyle: 'text-align: center; width: 10%', class: 'text-center' },
                { key: 'acao', label: 'Momento', thStyle: 'text-align: center; width: 15%', class: 'text-center' },
                { key: 'periodo', label: 'Períodos', thStyle: 'text-align: center; width: 20%', class: 'text-center' },
                { key: 'termino_alterado', label: 'Término do projeto', thStyle: 'text-align: center; width: 15%', class: 'text-center' }
              ]
            }
          }
        },
        numeroAtualizacao: 0,
        projetoPeriodos: 0,
        dataFinalExecucao: '',
        chamado: [],
        listaProjetos: {
          validos: [],
          demais: []
        },
        projeto: {},
        desabilitarDatasFuturas: {
          from: new Date() // Desabilitar todas as datas depois desta (neste caso não permite data depois de hoje)
        },
        desabilitarDatasPassadas: {
          to: new Date() // Desabilitar todas as datas antes desta (neste caso não permite data antes de hoje)
        },
        municipiosUf: [],
        ehProjetoEspecial: false,
        tipoAlteracaoCronograma: null,
        decisao: {
          encaminhamento: 'ANALISE'
        },
        analiseTributaria: {},
        layoutExtrato: 'classico',
        extratoFiltrosSelecionados: this.$route.name === 'solicitacao-contrapartida' ? ['saldos'] : ['saldos', 'fundacao'],
        adiantamentosFiltrosSelecionados: ['adiantamento_pendente'],
        sumarioQtdeAlteracoes: {},
        totais: {
          projeto: {
            fbb: {
              orcado: 0,
              solicitado: 0,
              saldo: 0
            },
            parceiros: {
              orcado: 0,
              solicitado: 0,
              saldo: 0
            },
            contrapartida: {
              orcado: 0,
              solicitado: 0,
              saldo: 0
            },
            total: {
              orcado: 0,
              solicitado: 0,
              saldo: 0
            }
          },
          adiantamento: {
            fbb: {
              orcado: 0,
              solicitado: 0,
              saldo: 0
            },
            parceiros: {
              orcado: 0,
              solicitado: 0,
              saldo: 0
            },
            total: {
              orcado: 0,
              solicitado: 0,
              saldo: 0
            }
          }
        },
        restricaoParaInicializar: [],
        restricaoParaConcluir: [],
        solicitacao: {
          instrumentosLidos: {
            ok: false,
            usuario: null,
            data: null
          },
          justificativa: null,
          anexos: [],
          processos: [],
          aditivo: {
            modelo: {},
            conteudo: ''
          },
          sumula: {
            textoAnalise: null,
            textoProposta: null,
            textoContexto: null,
            textoSituacaoProblema: null,
            textoParecer: null,
            questionario: [{'codigo': 'Q001', 'questao': 'Há concordância da convenente com a proposta de alteração quando de iniciativa da Fundação?', 'resposta': null}, {'codigo': 'Q002', 'questao': 'Há alteração nos objetivos específicos, metas e indicadores previstos no projeto?', 'resposta': null}, {'codigo': 'Q003', 'questao': 'Há impacto da alteração proposta no prazo de execução estabelecido?', 'resposta': null}, {'codigo': 'Q004', 'questao': 'Há impacto da alteração proposta nos resultados esperados do projeto?', 'resposta': null}, {'codigo': 'Q005', 'questao': 'Existem ocorrências restritivas para aprovação da alteração proposta, registrados no sistema informatizado da Fundação?', 'resposta': null}, {'codigo': 'Q006', 'questao': 'Foram apresentados orçamentos ou há enquadramento dos valores orçados aos parâmetros operacionais estabelecidos pela Fundação? Em caso negativo, registre a(s) justificativa(s) para apoio superior ao previsto no campo "Análise".', 'resposta': null}, {'codigo': 'Q009', 'questao': 'Há ajuste ou glosa realizados na proposta apresentada? Em caso afirmativo, registre a justificativa e itens alterados no campo "Análise".', 'resposta': null}, {'codigo': 'Q010', 'questao': 'A alteração proposta demanda formalização de termo aditivo?', 'resposta': null}, {'codigo': 'Q011', 'questao': 'Existem itens de despesas que não podem ser custeados, conforme as disposições gerais e as instruções específicas do SIC 13.3.7?', 'resposta': null}, {'codigo': 'Q012', 'questao': 'As certidões estão válidas, quando previstas em instruções específicas do SIC 13.3.7?', 'resposta': null}, {'codigo': 'Q013', 'questao': 'Consta autorização recebida do parceiro estratégico, conforme instruções específicas do SIC 13.3.7?', 'resposta': null}, {'codigo': 'Q014', 'questao': 'Foram cumpridas outras exigências previstas em instruções específicas do SIC 13.3.7?', 'resposta': null}, {'codigo': 'Q015', 'questao': 'Há compatibilidade da alteração proposta com os objetivos, as metas e as atividades do projeto?', 'resposta': null}],
            parceriaEstrategica: null,
            providencias: []
          }
        },
        registrosAlteracoes: [],
        listaMinutasAditivo: [],
        ehVisualizacao: false,
        permiteConcluir: false,
        cronogramaAlteracoes: [],
        validacao: {},
        tarefaNome: {'ANALISE': 'Análise', 'AUTORIZACAO': 'Autorização', 'REVISAO': 'Revisão', 'SOLICITACAO': 'Solicitação'},
        descricaoProcesso: {'PAGAMENTO': 'Pagamento', 'PRESTACAO_DE_CONTAS': 'Prestação de Contas', 'CONTRAPARTIDA': 'Contrapartida', 'RESSARCIMENTO': 'Ressarcimento'},
        listaRelatoriosSapiens: [{'codigo': 248, 'descricao': '248 - Monitoramento Administrativo'}, {'codigo': 300, 'descricao': '300 - Extrato de Projetos por Beneficiária'}],
        relatorioSapiensSelecionado: null,
        poderes: {
          codigo: '',
          mensagem: []
        },
        motivosSolicitacao: [],
        motivosDevolucao: []
      }
    },
    props: [
      'idProcesso', // opcional - se informado um id, será carregado os dados do processo correspondente, se não informado, então deve fornecer propsProposta e propsSolicitacao para os dados básicos da sumula
      'propsProposta', // opcional - contém o objeto básico da proposta, se informado um idProcesso, então esse parâmetro (propsProposta) será ignorado
      'propsSolicitacao' // opcional - contém o objeto básico da solicitacao, se informado um idProcesso, então esse parâmetro (propsSolicitacao) será ignorado
    ],
    computed: {
      ...mapGetters([
        'usuarioLogado'
      ]),
      dataFinalVigencia: function () {
        if (this.propostaBackup.dt_assinatura_convenio) {
          this.propostaBackup.dt_data_vigencia = moment(this.propostaBackup.dt_assinatura_convenio).add(parseInt(this.propostaBackup.periodo_vigencia), 'M').format('YYYY-MM-DD')
        } else {
          if (this.propostaBackup.dt_data_inicial) {
            this.propostaBackup.dt_data_vigencia = moment(this.propostaBackup.dt_data_inicial).add(parseInt(this.propostaBackup.periodo_vigencia), 'M').format('YYYY-MM-DD')
          }
        }
        return this.proposta.dt_data_vigencia
      },
      dataFinal: function () {
        if (this.proposta.dt_assinatura_convenio) {
          this.dataFinalExecucao = moment(this.propostaBackup.dt_assinatura_convenio).add(this.propostaBackup.nr_periodos, 'M').format('DD/MM/YYYY')
          return this.dataFinalExecucao
        }
      }
    },
    watch: {
      projeto: function () {
        if (_.has(this.projeto, 'ds_codigo_projeto_erp') && !_.isEmpty(this.projeto.ds_codigo_projeto_erp)) {
          this.carregarDados({'numero': this.projeto.ds_codigo_projeto_erp})
        }
      },
      idProcesso: function () {
        this.id = this.idProcesso
      },
      propsProposta: function () {
        if (_.isNil(this.idProcesso)) {
          this.proposta = this.propsProposta
        }
      },
      propsSolicitacao: function () {
        if (_.isNil(this.idProcesso)) {
          this.solicitacao = this.propsSolicitacao
        }
      },
      relatorioSapiensSelecionado: function () {
        this.emitir(this.relatorioSapiensSelecionado)
      }
    },
    mounted () {
    },
    created () {
      this.id = this.idProcesso
      if (_.isNil(this.idProcesso)) { // Quando id não é passado no componente, verifica se a proposta e solicitação foram passados
        if (_.isNil(this.propsProposta) || _.isNil(this.propsSolicitacao)) {
          this.$snotify.error('Não foi informado ID do processo nem dados da solicitação ou proposta')
          this.$router.go(-1)
        } else {
          if (!_.isNil(this.propsProposta)) {
            this.proposta = this.propsProposta
          }
          if (!_.isNil(this.propsSolicitacao)) {
            this.solicitacao = this.propsSolicitacao
          }
        }
      } else {
        this.carregarDados({'id': this.id}) // Caso um id tenha sido passado, então será carregado os dados do processo
      }
    },
    methods: {
      carregarDados (requisicao) {
        this.loading.tela = true
        axiosLaravel.post('projeto/alteracoes', requisicao).then((response) => {
          if (_.has(response.data, 'codigo') && response.data.codigo === 'OK') {
            let proposta = response.data.retorno.projeto
            this.propostaBackup = _.cloneDeep(proposta) // Guarda a proposta sem alterações para comparar ao final e ver se houve alterações com a original
            this.projeto = _.find(this.listaProjetos.validos, ['ds_codigo_projeto_erp', ('' + proposta.ds_codigo_projeto_erp)])
            let solicitacao = response.data.retorno.solicitacao
            if (!_.isEmpty(solicitacao)) { // Se houver solicitação então carrega este objeto e transforma a proposta com as alterações dele
              this.solicitacao = solicitacao.dados
              this.id = solicitacao.processo.id
              this.ehVisualizacao = _.includes(['FEITO', 'CANCELADO'], solicitacao.processo.situacao)
              this.tarefas = _.initial(solicitacao.tarefas) // Todos os elementos exceto o ultimo
              this.ultimaTarefa = _.last(solicitacao.tarefas) // Pega o ultimo elemento (tarefa)
              this.etapa = this.tarefaNome[this.ultimaTarefa['nome']]
              this.mostrar.solicitacao = !_.includes(['Autorização', 'Deliberação'], this.etapa) || this.ehVisualizacao // As etapas em que a solicitacao inicia 'fechada'
              let objetosRefProcesso = {'ALTERACAO_METAS': 'metas', 'ALTERACAO_ATIVIDADES': 'atividades', 'ALTERACAO_PARCELAS_ADIANTAMENTO': 'adiantamentos', 'ALTERACAO_MUNICIPIOS': 'municipalizacao', 'ALTERACAO_PERIODO_PROJETO': ''}
              this.solicitacao.processos.forEach((processo) => {
                // Processa as Alterações ------------------------------------------
                let alteracoes = _.get(processo, 'alteracao', [])
                alteracoes.forEach((alteracao) => {
                  let registroAlterado = proposta // Inicialmente é proposta que vai ser alterada
                  if (_.includes(['REMANEJAMENTO', 'SUPLEMENTACAO'], processo.nome)) {
                    proposta.atividades.forEach((atividade) => { // Caso se trate de alteração de extrato (remanejamento ou suplementacao), então deve se pegar o item específico dentro das atividades
                      registroAlterado = _.find(_.get(atividade, 'itens_orcamentos', []), ['id', alteracao.id])
                    })
                  } else if (processo.nome !== 'ALTERACAO_PERIODO_PROJETO') { // Caso não se trate de prorrogação (que altera a proposta diretamente) nem de alteração de extrato, então deve se pegar o objeto específico dentro da proposta para se alterado
                    registroAlterado = _.find(_.get(proposta, objetosRefProcesso[processo.nome], []), ['id', alteracao.id])
                  }
                  _.forIn(alteracao, function (value, key, obj) { // Passa por cada alteração reatribuindo ao objeto a ser alterado
                    if (key !== 'id') {
                      let valor = _.isNaN(_.toNumber(value[1])) ? value[1] : _.toNumber(value[1]) // Se conversível para numero então use se devolve como está
                      _.set(registroAlterado, [key], valor)
                    }
                  })
                })
                // Processa as Inclusões ------------------------------------------
                let inclusoes = _.get(processo, 'inclusao', [])
                let lista = _.get(proposta, [objetosRefProcesso[processo.nome]], [])
                inclusoes.forEach((inclusao) => {
                  if (_.includes(['REMANEJAMENTO', 'SUPLEMENTACAO'], processo.nome)) {
                    lista = _.get(_.find(proposta.atividades, ['id', inclusao.atividade.id]), 'itens_orcamentos')
                  }
                  if (_.isArray(lista)) {
                    lista.push(inclusao)
                  }
                })
              })
            }
            this.proposta = proposta
            let mesesVigencia = Math.round(moment(this.proposta.projetoSapiens.usu_datfimvig).diff(moment(this.proposta.dt_assinatura_convenio), 'months', true))
            console.log('mesesVigencia', mesesVigencia)
            this.projetoPeriodos = this.propostaBackup.nr_periodos
            // Restrições e avisos
            if (this.proposta.projetoSapiens.sitprj !== 'APR') {
              this.restricaoParaInicializar.push('Projeto tem ocorrência registrada e a solicitação pode ser indeferida caso a pendência não seja regularizada')
            }
            // Caso tenha solicitação e nela contenha remanejamento ou suplementação, então seleciona essa opção para o extrato
            let alteracaoCronogramaRealizada = _.find(_.get(this.solicitacao, 'processos', []), function (prc) { return _.includes(['REMANEJAMENTO', 'SUPLEMENTACAO'], prc.nome) })
            // Verifica quais opções são permitidas de alteração de cronograma, se somente uma é aceita (ou remanejamento ou suplementação) essa que vai para o extrato, do contrário (nenhuma opção ou mais de uma então vai null
            let tiposAlteracaoCronogramaPermitidos = alteracaoCronogramaRealizada ? [alteracaoCronogramaRealizada['nome']] : _.intersection(_.get(this.proposta, 'opcoes.alteracoesPermitidas', []), ['remanejamento', 'suplementacao'])
            this.tipoAlteracaoCronograma = tiposAlteracaoCronogramaPermitidos.length === 1 ? _.toUpper(_.head(tiposAlteracaoCronogramaPermitidos)) : null
            this.buscaCidades()
            this.$forceUpdate()
            this.loading.tela = false
          } else {
            console.log('   erro')
            this.$snotify.error(response.data.mensagem)
          }
        })
          .catch((error) => {
            this.loading.tela = false
            this.$root.trataErro(error)
          })
      },
      itemExtrato (id) {
        let item = null
        this.proposta.atividades.forEach((atividade) => {
          let itemLocalizado = _.find(_.get(atividade, 'itens_orcamentos', []), ['id', id])
          if (itemLocalizado) {
            item = _.cloneDeep(itemLocalizado)
          }
        })
        return item
      },
      imprimir () {
        window.print()
      },
      buscaCidades () {
        let lista = _.uniq(_.map(this.proposta.municipalizacao, 'ds_cep'))
        axiosLaravel.post('projeto/cidades', {'referencia': 'CEP', 'lista': lista}).then((response) => {
          this.proposta.municipalizacao.forEach((municipio) => {
            let cidade = _.find(response.data, function (cid) {
              return _.toNumber(municipio.ds_cep) >= _.toNumber(cid.nr_cep_inicio) && _.toNumber(municipio.ds_cep) <= _.toNumber(cid.nr_cep_final)
            })
            _.set(municipio, 'ds_uf', cidade.ds_uf)
          })
          this.$forceUpdate()
          if (!this.loading.tela && !this.propsSolicitacao) {
            setTimeout(() => this.imprimir(), 500)
          }
        })
          .catch((error) => {
            console.log('error cidades', error)
            this.$root.trataErro(error)
          })
      },
      ehNulo (valor, opcao) {
        return _.isNull(valor) || _.isNil(valor) || _.isUndefined(valor) ? opcao : valor
      },
      emitir (relatorio) {
        this.loading.tela = true
        let parametros = '<ECodEmp=1><ENumPrj=' + this.proposta.ds_codigo_projeto_erp + '>'
        if (relatorio === 222 || relatorio === 219) {
          parametros += ',<ESitPrj=ULT>'
        } else if (relatorio === 248) {
          parametros += ',<ECodFor=>'
        }
        if (relatorio === 222) {
          parametros += ',<EMosDes=S>'
        }
        if (relatorio === 200 && _.has(this.analiseTributaria, 'nf') && ('' + this.analiseTributaria.nf.SitNfc === '2')) { // Comunicado Interno não usa os parâmetros triviais acima, ent~çao se for este o relatório ele reescreve os parâmetros
          parametros = '<ECodFor=' + this.analiseTributaria.nf.CodFor + '>,<ENumNfc=' + this.analiseTributaria.nf.NumNfc + '>,<ECodSnf=' + this.analiseTributaria.nf.CodSnf + '>,<EForOrg=F>,<EPreCon=N>'
        }
        if (relatorio === 611) {
          parametros = `<ECodFor=${this.analiseTributaria.nf.CodFor}><ENumTit="${this.analiseTributaria.titulo.NumTit}"><ETitBai=S>`
        }
        this.$snotify.clear()
        let codigoRelatorio = (relatorio === 200 ? 'SRNF' : 'FJCF') + relatorio + '.GER'
        if (relatorio === 611) codigoRelatorio = 'FPCP' + relatorio + '.GER'
        this.$snotify.async('Gerando relatório ' + relatorio + '. Por favor, aguarde...', {timeout: 0})
        axiosLaravel.post('relatorio-erp/emitir', {erpReport: {'ds_codigo': codigoRelatorio}, params: parametros}).then((response) => {
          this.relatorioSapiensSelecionado = null
          this.onDownload(response, relatorio, this)
        })
          .catch((error) => {
            this.relatorioSapiensSelecionado = null
            this.$snotify.clear()
            this.loading.tela = false
            this.$root.trataErro(error)
          })
      },
      onDownload (response, relatorio, vm) {
        let item = response.data.arquivo
        const contentType = 'application/pdf'
        const b64Data = response.data.arquivo
        let file = this.b64toBlob(b64Data, contentType)
        // Suporte 61615 - Ajuste para definir o nome do arquivo no download no formato YYYYMMDD ID PG/PC/RE
        // Suporte 62097 - inclusão do número do projeto para o caso de PC
        let tipoProcesso = ''
        switch (vm.processo) {
          case 'PAGAMENTO':
            tipoProcesso = 'PG'
            break
          case 'PRESTACAO_DE_CONTAS':
            tipoProcesso = 'PC ' + this.proposta.ds_codigo_projeto_erp
            break
          case 'RESSARCIMENTO':
            tipoProcesso = 'RE'
            break
        }
        let ie = !!window.MSInputMethodContext && !!document.documentMode
        if (relatorio !== 200) {
          if (!ie) {
            let blob = file
            let link = document.createElement('a')
            link.href = window.URL.createObjectURL(blob)
            link.download = 'Relatório ' + relatorio + ' » ' + vm.proposta.ds_codigo_projeto_erp
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
          } else {
            let blob = file
            let link = document.createElement('blob')
            link.href = window.navigator.msSaveOrOpenBlob(blob, item.name)
            link.download = 'Relatório ' + relatorio + ' » ' + vm.proposta.ds_codigo_projeto_erp
            link.click()
          }
        } else {
          if (!ie) {
            let blob = file
            let link = document.createElement('a')
            link.href = window.URL.createObjectURL(blob)
            link.download = moment(vm.data_edicao).format('YYYYMMDD') + ' ID ' + vm.id + ' ' + tipoProcesso
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
          } else {
            let blob = file
            let link = document.createElement('blob')
            link.href = window.navigator.msSaveOrOpenBlob(blob, item.name)
            link.download = moment(vm.data_edicao).format('YYYYMMDD') + ' ID ' + vm.id + ' ' + tipoProcesso
            link.click()
          }
        }
        this.$snotify.clear()
        this.$snotify.success('Relatório gerado com sucesso!')
        this.loading.tela = false
      },
      b64toBlob (b64Data, contentType = '', sliceSize = 512) {
        const byteCharacters = atob(b64Data)
        const byteArrays = []
        for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
          const slice = byteCharacters.slice(offset, offset + sliceSize)
          const byteNumbers = new Array(slice.length)
          for (let i = 0; i < slice.length; i++) {
            byteNumbers[i] = slice.charCodeAt(i)
          }
          const byteArray = new Uint8Array(byteNumbers)
          byteArrays.push(byteArray)
        }
        const blob = new Blob(byteArrays, {type: contentType})
        return blob
      }
    }
  }
</script>

<style scoped>
  .titulo_secao_sumula {
    font-weight: bold;
  }

  .secao_sumula {
    padding: 10px;
  }

  .secao_sumula .valor_lista {
    font-weight: bold;
  }
  .secao_sumula .b1 {
    border-top: 1px solid var(--cor-borda) !important;
  }
  .secao_sumula .b2 {
    border-right: 1px solid var(--cor-borda) !important;
  }
  .secao_sumula .b3 {
    border-bottom: 1px solid var(--cor-borda) !important;
  }
  .secao_sumula .b4 {
    border-left: 1px solid var(--cor-borda) !important;
  }
  .secao_sumula .pad10 {
    padding: 10px;
  }
  .secao_sumula .pL20 {
    padding-left: 20px;
  }
  .secao_sumula .itemExtrato {
    border-top: 1px solid var(--cor-fraca);
  }
  .secao_sumula .itemInformacao {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    flex-direction: column;
  }
  .secao_sumula .itemInformacao .itemValores {
    display: flex;
    flex-direction: row;
    justify-content: space-evenly;
    align-items: center;
    width: 100%
  }
  .secao_sumula .itemInformacao .itemDescricao {
    font-style: italic;
  }
  .secao_sumula .itemOrcado, .secao_sumula .itemValorAlteracao, .secao_sumula .itemOrcadoAlterado {
    text-align: right;
  }
</style>
