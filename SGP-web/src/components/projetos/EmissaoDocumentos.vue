<!-- Demanda 65971 -->
<template>
  <div class="content-wrapper" style="min-height: 870px;">
    <vue-headful :title="titulo"/>
    <div style="">
      <section class="content-header">
        <h1 :title="proposta.ds_codigo_projeto_erp + ' - ' + proposta.ds_nome">
          Emissão de Documentos: Projeto {{proposta.ds_codigo_projeto_erp}} - {{proposta.ds_nome}}
        </h1>
      </section>
      <section class="content" ref="botoes" v-if="!loading">
        <div class="row" v-if="this.$root.isFundacao(this.usuarioLogado) && this.loading===false">
          <b-card class="col-md-6" style="max-width: 25%;">
            <div @click="botaoDocumento($event)" id="atestado" class="botaoGerarArquivo">
              <img id="atestado" width="40" height="60" src="../../../static/img/iconeWord.png"/>
              <p id="atestado">Atestado de Capacidade Técnica</p>
            </div>
            <div @click="botaoDocumento($event)" id="notificacaoAviso" class="botaoGerarArquivo">
              <img id="notificacaoAviso" width="40" height="60" src="../../../static/img/iconeWord.png"/>
              <p id="notificacaoAviso">Notificação Extrajudicial - Aviso</p>
            </div>
            <div @click="botaoDocumento($event)" id="notificacaoFinal" class="botaoGerarArquivo">
              <img id="notificacaoFinal" width="40" height="60" src="../../../static/img/iconeWord.png"/>
              <p id="notificacaoFinal">Notificação Extrajudicial - Final</p>
            </div>
            <div @click="botaoDocumento($event)" id="relatorioMonitoramento" class="botaoGerarArquivo">
              <img id="relatorioMonitoramento" width="40" height="60" src="../../../static/img/iconeWord.png"/>
              <p id="relatorioMonitoramento">Relatório de Monitoramento Presencial</p>
            </div>
            <div @click="botaoDocumento($event)" id="briefing" class="botaoGerarArquivo">
              <img id="briefing" width="40" height="60" src="../../../static/img/iconeWord.png"/>
              <p id="briefing">Briefing</p>
            </div>
          </b-card>
          <div class="col-md-6" v-if="this.briefing">
            <h4 class="card-title">Dados que devem constar no Briefing</h4>
              <div class="checkbox-block">
                <b-form-checkbox-group
                  v-model="selecionadosBriefing"
                  :options="dadosBriefing"
                  class="mb-3"
                  value-field="id"
                  text-field="nome"
                  stacked
                ></b-form-checkbox-group>
              </div>
              <b-button
                variant="primary"
                id="briefing"
                v-on:click="gerarBriefing"
                >Gerar arquivo de Briefing
              </b-button>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>
<script>
  import emiteDocumento from '../../mixins/emiteDocumento'
  import { mapGetters } from 'vuex'
  import moment from 'moment'

  export default {
    name: 'emissao-documentos',
    data () {
      return {
        titulo: 'Emissão de Documentos',
        loading: false,
        briefing: false,
        dadosBriefing: [
          { id: 'sobreProjeto', nome: '1. Sobre o Projeto', disabled: true },
          { id: 'dadosEntidade', nome: '2. Dados da Entidade', disabled: false },
          { id: 'dadosProjeto', nome: '3. Dados do Projeto', disabled: false },
          { id: 'infosProjeto', nome: '4. Informações do Projeto', disabled: false },
          { id: 'analiseProjeto', nome: '5. Análise do Projeto', disabled: false },
          { id: 'relatoriosProjeto', nome: '6. Download Relatório 222', disabled: false }
        ],
        selecionadosBriefing: ['sobreProjeto'],
        proposta: {},
        listaCarteiras: [],
        codigoCarteiraProjeto: null,
        carteiraSelecionada: null,
        totais: {
          fbb: {
            aprovado: 0,
            atual: 0
          },
          contrapartida: {
            aprovado: 0,
            atual: 0
          },
          parceiro: {
            aprovado: 0,
            atual: 0
          },
          aprovado: 0,
          atual: 0
        },
        relatorioAnalise: {}
      }
    },

    async created () {
      await this.buscaProposta()
      console.clear()
    },

    computed: {
      ...mapGetters([
        'usuarioLogado'
      ])
    },

    methods: {
      async buscaAnalise () {
        await axiosLaravel.get('propostas/' + this.proposta.id)
          .then((response) => {
            this.relatorioAnalise = JSON.parse(response.data.relatorio_analise)
          })
          .catch((error) => {
            this.$snotify.clear()
            this.$root.trataErro(error)
          })
      },
      async buscaProposta () {
        this.loading = true
        this.$snotify.async('Carregando dados do projeto...', {timeout: 0})
        await axiosLaravel.get('projeto/numero/' + this.$route.params.numero)
        .then((response) => {
          this.proposta = response.data
        })
          .catch((error) => {
            this.$snotify.clear()
            this.$root.trataErro(error)
          })
        await this.buscaCarteiras()
        await this.buscaAnalise()
        if (this.relatorioAnalise === null || this.relatorioAnalise === undefined) {
          this.dadosBriefing.find(item => {
            if (item.id === 'analiseProjeto') {
              item.disabled = true
            }
          })
        }
        this.$snotify.clear()
        this.$forceUpdate()
        this.$snotify.success('Projeto carregado!', {timeout: 2000})
        this.loading = false
      },
      async buscaCarteiras () {
        await axiosLaravel.get('carteira/projeto/' + this.$route.params.numero).then((response) => {
          if (_.has(response.data, 'codigo') && response.data.codigo === 'OK') {
            this.listaCarteiras = response.data.retorno['carteiras']
            this.codigoCarteiraProjeto = response.data.retorno['carteira_projeto']['usu_codcart']
            this.carteiraSelecionada = this.listaCarteiras.find(carteira => {
              if (carteira.usu_codcart === this.codigoCarteiraProjeto) {
                return carteira.usu_nomcart
              } else {
                return undefined
              }
            })
          } else {
            this.$snotify.error(response.data.mensagem)
          }
        })
          .catch((error) => {
            this.loading.show = false
            console.log('error', error)
            this.$root.trataErro(error)
          })
      },
      async botaoDocumento (event) {
        this.loading = true
        this.$snotify.clear()
        let dadosParaArquivo = {}
        const dataHoje = moment().format('LL')
        switch (event.target.id) {
          case 'atestado':
            dadosParaArquivo = {
              entidade: this.proposta.entidade.ds_nome,
              cnpj_entidade: this.proposta.entidade.ds_cnpj.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5'),
              data_inicial_projeto: moment(this.proposta.dt_assinatura_convenio, 'YYYY-MM-DD').format('DD-MM-YYYY'),
              data_final_projeto: moment(this.proposta.dt_assinatura_convenio, 'YYYY-MM-DD').add(this.proposta.nr_periodos, 'M').format('DD-MM-YYYY'),
              data_hoje: dataHoje
            }
            emiteDocumento.methods.geraDocumento(dadosParaArquivo, 'atestado')
            this.$snotify.clear()
            this.$snotify.success('Arquivo gerado com sucesso', {timeout: 1000})
            break
          case 'notificacaoAviso':
            dadosParaArquivo = this.salvaDadosNotificacao()
            emiteDocumento.methods.geraDocumento(dadosParaArquivo, 'notificacaoAviso')
            this.$snotify.clear()
            this.$snotify.success('Arquivo gerado com sucesso', {timeout: 1000})
            break
          case 'notificacaoFinal':
            dadosParaArquivo = this.salvaDadosNotificacao()
            emiteDocumento.methods.geraDocumento(dadosParaArquivo, 'notificacaoFinal')
            this.$snotify.clear()
            this.$snotify.success('Arquivo gerado com sucesso', {timeout: 1000})
            break
          case 'relatorioMonitoramento':
            for (let i = 0; i < this.proposta.objetivos.length; i++) {
              Object.assign(this.proposta.objetivos[i], {cont: i + 1})
            }
            dadosParaArquivo = {
              numero_projeto: this.proposta.ds_codigo_projeto_erp,
              projeto_nome: this.proposta.ds_nome,
              data_inicial_projeto: moment(this.proposta.dt_assinatura_convenio, 'YYYY-MM-DD').format('DD-MM-YYYY'),
              data_final_projeto: moment(this.proposta.dt_assinatura_convenio, 'YYYY-MM-DD').add(this.proposta.nr_periodos, 'M').format('DD-MM-YYYY'),
              nome_entidade: this.proposta.entidade.ds_nome,
              email_contato: this.proposta.ds_email_coordenador,
              telefones_contato: this.proposta.ds_celular_coordenador,
              atividades: this.proposta.atividades,
              metas: this.proposta.metas,
              objetivo_geral: this.proposta.ds_objetivo_geral,
              objetivos: this.proposta.objetivos,
              data_hoje: dataHoje
            }
            emiteDocumento.methods.geraDocumento(dadosParaArquivo, 'relatorioMonitoramento')
            this.$snotify.clear()
            this.$snotify.success('Arquivo gerado com sucesso', {timeout: 1000})
            break
          case 'briefing':
            this.briefing = !this.briefing
            break
          default:
            break
        }
        this.loading = false
      },
      salvaDadosNotificacao () {
        const dataHoje = moment().format('LL')
        // eslint-disable-next-line
        let temComplemento = this.proposta.entidade.endereco[0].ds_complemento === null || this.proposta.entidade.endereco[0].ds_complemento.isEmpty ? false : true
        const dados = {
          entidade: this.proposta.entidade.ds_nome,
          cnpj_entidade: this.proposta.entidade.ds_cnpj.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5'),
          endereco_rua: this.proposta.entidade.endereco[0].ds_rua,
          endereco_numero: this.proposta.entidade.endereco[0].ds_numero,
          endereco_complemento: temComplemento ? this.proposta.entidade.endereco[0].ds_complemento : null,
          endereco_bairro: this.proposta.entidade.endereco[0].ds_bairro,
          endereco_cep: this.proposta.entidade.endereco[0].ds_cep,
          endereco_cidade: this.proposta.entidade.endereco[0].ds_cidade,
          endereco_estado: this.proposta.entidade.endereco[0].ds_estado,
          numero_projeto: this.proposta.ds_codigo_projeto_erp,
          projeto_nome: this.proposta.ds_nome,
          data_hoje: dataHoje
        }
        return dados
      },
      async gerarBriefing () {
        this.$snotify.async('Gerando arquivo de briefing...', {timeout: 0})
        this.loading = true
        let dadosBriefing = {
          temSobreProjeto: false,
          temDadosEntidade: false,
          temDadosProjeto: false,
          temInfosProjeto: false,
          temAnaliseProjeto: false,
          temRelatoriosProjeto: false,
          sobreProjeto: {
          },
          dadosEntidade: {
          },
          dadosProjeto: {
          },
          infosProjeto: {
          },
          analiseProjeto: {
          },
          relatoriosProjeto: {
          },
          data_hoje: moment().format('LL')
        }
        for (let i = 0; i < this.selecionadosBriefing.length; i++) {
          let dados = {}
          switch (this.selecionadosBriefing[i]) {
            case 'sobreProjeto':
              dadosBriefing.temSobreProjeto = true
              dados = {
                nome_projeto: this.proposta.ds_nome,
                numero_projeto: this.proposta.ds_codigo_projeto_erp,
                status_projeto: this.proposta.ds_situacao_erp,
                data_inicial_projeto: moment(this.proposta.dt_assinatura_convenio, 'YYYY-MM-DD').format('DD-MM-YYYY'),
                data_final_execucao_projeto: moment(this.proposta.dt_assinatura_convenio, 'YYYY-MM-DD').add(this.proposta.nr_periodos, 'M').format('DD-MM-YYYY'),
                meses_projeto: this.proposta.nr_periodos,
                data_final_vigencia_projeto: moment(this.proposta.dt_data_vigencia, 'YYYY-MM-DD').format('DD-MM-YYYY'),
                meses_vigencia_projeto: this.proposta.periodo_vigencia,
                carteira_projeto: this.carteiraSelecionada ? this.carteiraSelecionada.usu_nomcart : 'Projeto não encarteirado',
                projeto_superior: this.proposta.ds_projeto_superior,
                origem_recurso_projeto: {
                  total_FBB: this.$root.formataNumero(this.totalizar(1), 'moeda'),
                  total_contrapartida: this.$root.formataNumero(this.totalizar(2), 'moeda'),
                  total_parceiro: this.$root.formataNumero(this.totalizar(5), 'moeda'),
                  total_projeto: this.$root.formataNumero(this.totalizar(0), 'moeda')
                }
              }
              Object.assign(dadosBriefing.sobreProjeto, dados)
              break
            case 'dadosEntidade':
              dadosBriefing.temDadosEntidade = true
              // eslint-disable-next-line
              let temComplemento = this.proposta.entidade.endereco[0].ds_complemento === null || this.proposta.entidade.endereco[0].ds_complemento.isEmpty ? false : true
              dados = {
                nome_entidade: this.proposta.entidade.ds_nome,
                cnpj_entidade: this.proposta.entidade.ds_cnpj.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5'),
                endereco_rua: this.proposta.entidade.endereco[0].ds_rua,
                endereco_numero: this.proposta.entidade.endereco[0].ds_numero,
                endereco_complemento: temComplemento ? this.proposta.entidade.endereco[0].ds_complemento : null,
                endereco_bairro: this.proposta.entidade.endereco[0].ds_bairro,
                endereco_cep: this.proposta.entidade.endereco[0].ds_cep,
                endereco_cidade: this.proposta.entidade.endereco[0].ds_cidade,
                endereco_estado: this.proposta.entidade.endereco[0].ds_estado,
                nome_coordenador: this.proposta.ds_nome_coordenador,
                telefone_coordenador: this.proposta.ds_celular_coordenador,
                email_coordenador: this.proposta.ds_email_coordenador
              }
              Object.assign(dadosBriefing.dadosEntidade, dados)
              break
            case 'dadosProjeto':
              await this.buscaCronograma()
              this.proposta.municipalizacao.forEach((item) => {
                switch (item.ds_fase) {
                  case '1':
                    item['origem'] = 'Fundação'
                    break
                  case '2':
                    item['origem'] = 'Contrapartidada'
                    break
                  case '5':
                    item['origem'] = 'Parceiro'
                    break
                  default:
                    break
                }
              })
              dadosBriefing.temDadosProjeto = true
              for (let i = 0; i < this.proposta.objetivos.length; i++) {
                Object.assign(this.proposta.objetivos[i], {cont: i + 1})
              }
              this.proposta.municipalizacao.map(item => {
                item.dc_valor_municipio = this.$root.formataNumero(item.dc_valor_municipio, 'moeda')
              })
              dados = {
                objetivo_geral: this.proposta.ds_objetivo_geral,
                objetivos: this.proposta.objetivos,
                metas: this.proposta.metas,
                atividades: this.proposta.atividades,
                valor_aprovado: {
                  projeto: this.$root.formataNumero(this.totais.aprovado, 'moeda'),
                  fbb: this.$root.formataNumero(this.totais.fbb.aprovado, 'moeda'),
                  contrapartida: this.$root.formataNumero(this.totais.contrapartida.aprovado, 'moeda'),
                  parceiro: this.$root.formataNumero(this.totais.parceiro.aprovado, 'moeda')
                },
                valor_atual: {
                  projeto: this.$root.formataNumero(this.totais.atual, 'moeda'),
                  fbb: this.$root.formataNumero(this.totais.fbb.atual, 'moeda'),
                  contrapartida: this.$root.formataNumero(this.totais.contrapartida.atual, 'moeda'),
                  parceiro: this.$root.formataNumero(this.totais.parceiro.atual, 'moeda')
                },
                publico_alvo: this.proposta.publicos_alvo,
                local_execucao: this.proposta.municipalizacao
                // participantes: // Buscar participantes do projeto e verificar quais informações podem constar no briefing
              }
              Object.assign(dadosBriefing.dadosProjeto, dados)
              break
            case 'infosProjeto':
              dadosBriefing.temInfosProjeto = true
              dados = {
                introducao: this.proposta.ds_introducao,
                apresentacao: this.proposta.ds_apresentacao,
                territorio: this.proposta.ds_territorio,
                justificativa: this.proposta.ds_justificativa,
                objetivo_geral: this.proposta.ds_objetivo_geral,
                resultados_esperados: this.proposta.ds_resultados,
                operacionalizacao: this.proposta.ds_operacao,
                parcerias: this.proposta.ds_parceria,
                resumo: this.proposta.ds_resumo,
                acoes_comunicacao: this.proposta.ds_acoes_comunicacao
              }
              Object.assign(dadosBriefing.infosProjeto, dados)
              break
            case 'analiseProjeto':
              dadosBriefing.temAnaliseProjeto = true
              dados = {
                parecer: this.relatorioAnalise.ds_parecer,
                observacao_valores: this.relatorioAnalise.ds_valores_observacoes,
                observacao_regularidade: this.relatorioAnalise.ds_regularidade_observacoes,
                observacao_licenciamento: this.relatorioAnalise.ds_licenciamento_observacoes,
                indicadores_resultado: this.relatorioAnalise.ds_indicadores_resultado,
                acoes_comunicacao: this.relatorioAnalise.ds_acoes_comunicacao
              }
              Object.assign(dadosBriefing.analiseProjeto, dados)
              // }
              break
            case 'relatoriosProjeto':
              await this.buscaRelatorioErp()
              break
            default:
              break
          }
        }
        emiteDocumento.methods.geraDocumento(dadosBriefing, 'briefingProjeto')
        this.$snotify.clear()
        this.$snotify.success('Arquivo gerado com sucesso', {timeout: 4000})
        this.loading = false
      },
      totalizar (origem) {
        let t = 0
        _.forEach(this.proposta.atividades, function (a) {
          t += _.sumBy(a.itens_orcamentos, function (i) {
            return ('' + origem === '0') ? parseFloat(i.quantidade) * parseFloat(i.valor_unitario) : (('' + origem === ('' + i.origem).substr(0, 1)) ? parseFloat(i.quantidade) * parseFloat(i.valor_unitario) : 0)
          })
        })
        return t
      },
      valorProjetoOrigem (origem) {
        let valorAprovado = 0
        let valorAtual = 0
        this.proposta.atividades.forEach((atividade) => {
          if (atividade.itens_orcamentos.length !== 0) {
            atividade.itens_orcamentos.forEach((item) => {
              if (item.origem === origem) {
                valorAprovado += parseFloat(item.valorOrcado)
                valorAtual += parseFloat(item.valorSaldo)
              }
            })
          }
        })
        return { aprovado: valorAprovado, atual: valorAtual }
      },
      calculaTotais () {
        let fbb = this.valorProjetoOrigem(1)
        let contrapartida = this.valorProjetoOrigem(2)
        let parceiro = this.valorProjetoOrigem(5)
        this.totais.fbb.aprovado = fbb.aprovado
        this.totais.fbb.atual = fbb.atual
        this.totais.contrapartida.aprovado = contrapartida.aprovado
        this.totais.contrapartida.atual = contrapartida.atual
        this.totais.parceiro.aprovado = parceiro.aprovado
        this.totais.parceiro.atual = parceiro.atual
        this.totais.aprovado = fbb.aprovado + contrapartida.aprovado + parceiro.aprovado
        this.totais.atual = fbb.atual + contrapartida.atual + parceiro.atual
      },
      async buscaCronograma () {
        this.loading = true
        await axiosLaravel.post('processos/cronograma/projeto/', {
          'proposta': this.proposta.id,
          'processo': 'PAGAMENTO',
          'aglutinado': 'Completo',
          'documento': 0})
          .then((response) => {
            let saldos = response.data
            this.proposta.atividades.forEach((atividade) => {
              if (atividade.itens_orcamentos.length !== 0) {
                atividade.itens_orcamentos.forEach((item) => {
                  item['valorOrcado'] = _.sumBy(item.orcamentos_mensalizados, (vo) => { return vo.valor })
                  //
                  item['valorSaldo'] = _.sumBy(saldos.itens, (vs) => { return (item.id === vs['Id_item']) ? vs['Valor_saldo'] : 0 })
                  //
                  // Ajustes de diferenças entre Dados da Proposta e do Cronograma
                  let valorOrcado = _.sumBy(saldos.itens, (i) => { return (item.id === i['Id_item']) ? i['Valor_orcado'] : 0 })
                  item['valorOrcado'] = (item['valorOrcado'] !== valorOrcado) ? valorOrcado : item['valorOrcado']
                })
              }
            })
          })
          .catch((error) => {
            console.log('error', error)
            this.$root.trataErro(error)
          })
        this.calculaTotais()
        this.loading = false
      },
      async buscaRelatorioErp () {
        this.loading = true
        // this.$snotify.clear()
        this.$snotify.async('Gerando relatório. Por favor, aguarde...', {timeout: 0})
        const dadosSolicitacao = {
          erpReport: {
            ds_codigo: 'FJCF222.GER'
          },
          params: `<ENumPrj=${this.proposta.ds_codigo_projeto_erp}>,<ESitPrj=ULT>,`
        }
        await axiosLaravel.post('relatorio-erp/emitir', dadosSolicitacao).then((response) => {
          this.onDownload(response)
        })
        this.loading = false
      },
      onDownload (response) {
        this.item = response.data.arquivo
        const contentType = 'application/pdf'
        const b64Data = response.data.arquivo
        this.file = this.b64toBlob(b64Data, contentType)
        let ie = !!window.MSInputMethodContext && !!document.documentMode
        if (!ie) {
          let blob = this.file
          let link = document.createElement('a')
          link.href = window.URL.createObjectURL(blob)
          link.download = `Numero do projeto-${this.proposta.ds_codigo_projeto_erp}/222_extrato_projetos_analitico`
          document.body.appendChild(link)
          link.click()
          document.body.removeChild(link)
        } else {
          let blob = this.file
          let link = document.createElement('blob')
          link.href = window.navigator.msSaveOrOpenBlob(blob, this.item.name)
          link.download = `Numero do projeto-${this.proposta.ds_codigo_projeto_erp}/222_extrato_projetos_analitico`
          link.click()
        }
        this.$snotify.clear()
        this.$snotify.success('Relatório gerado com sucesso!')
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
<style>
.botaoGerarArquivo {
  display: flex;
  flex-direction: row;
  align-content: center;
  align-items: center;
  border-radius: 10px;
  margin-bottom: 10px;
  padding-top: 5px;
  padding-bottom: 5px;
}

.botaoGerarArquivo:hover {
  cursor: pointer;
  transform: translateY(-0.25em);
}

.botaoGerarArquivo img {
  margin-left: 6px;
}

.botaoGerarArquivo p {
  align-self: end;
  margin-left: 6px;
  font-weight: bold;
}
</style>
