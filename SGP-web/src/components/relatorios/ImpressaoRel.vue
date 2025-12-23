ImpressaoRel

<template>
  <div class="content-wrapper" style="min-height: 870px;">

    <vue-headful :title="'SGP - Relatórios da Proposta'"/>

    <div ng-view="" class="fade-transition">
      <!--Breadcrumb-->
      <section class="content-header">
        <h1>Relatórios</h1>

      </section>
      <section class="content">
        <div class="row">
          <div class="col-md-12">
            <div class="box box-primary">

              <div v-show="loading.show" class="overlay" style="position: absolute; top: 0px; left: 0px; width: 100%; height: 100%; display: block;">
                <i class="fa fa-refresh fa-spin"></i>
              </div>

              <div class="box-header with-border">
                <h3 class="box-title"><i class="fa fa-file-text-o" aria-hidden="true"></i> Relatórios da Proposta</h3>
              </div>
              <div class="box-body">
                <form class="form-horizontal">
                  <div class="form-group required-field">
                    <label class="control-label col-md-3">Selecione uma proposta:</label>
                    <div class="col-md-9">

<!-- TODO acrescentar número do projeto para facilitar busca e concatenar com o nome -->

                      <multiselect v-model="projetoSelecionado" :options="projetos"
                                   :multiple="false"
                                   :close-on-select="true"
                                   :clear-on-select="true"
                                   :hide-selected="false"
                                   :preserve-search="true"
                                   @select="onSelect($event)"
                                   :custom-label="etiquetaProjeto"
                                   placeholder="Selecione uma proposta"
                                   label="ds_nome"
                                   track-by="id"
                                   selectedLabel="Selecionado"
                                   selectLabel="Aperte ENTER para selecionar"
                                   deselectLabel="Aperte ENTER para remover"
                                   name="projeto"
                                   data-vv-as="projeto"
                                   v-validate="'required'">

                        <template slot-scope="props">
                          <span class="multiselect__tag"><span>{{ props.ds_nome }}</span><span class="custom__remove" @click="props.remove(props)">❌</span></span>
                        </template>

                      </multiselect>

                    </div>
                  </div>

                  <div v-if="!_.isEmpty(projetoSelecionado)" class="col-md-12">
                    <div class="form-group">
                      <label class="control-label col-md-3">Entidade:</label>
                      <div class="col-md-8">
                        {{projetoSelecionado.ds_cnpj}} - {{projetoSelecionado.NomeEntidade}}
                      </div>
                    </div>

                    <div v-if="!_.isEmpty(projetoSelecionado.ds_numero_edital)">
                      <div class="form-group">
                        <label class="control-label col-md-3">Edital:</label>
                        <div class="col-md-8">
                          {{projetoSelecionado.ds_numero_edital}}
                        </div>
                      </div>
                    </div>

                    <div class="form-group">
                      <label class="control-label col-md-3">Fase:</label>
                      <div class="col-md-8">
                        {{projetoSelecionado.ds_fase}}
                      </div>
                    </div>
                  </div>

                </form>
                <div class="col-md-9 col-md-offset-3 box-footer d-flex flex-wrap-nowrap">
                  <div v-if="_.has(projetoSelecionado, 'id')">
                    <!-- Link para impressão da proposta -->
                    <router-link :to="{name: 'imprimir-proposta', params: { id: projetoSelecionado.id }}" target="_blank" class="btn btn-primary btn-sm btn-flat" style="text-decoration: none">
                      <i class="fa fa-file-text-o" aria-hidden="true"></i>&nbsp; Versão para impressão da Proposta
                    </router-link>

                    <!-- Condicional para exibir botões baseados na fase do projeto -->
                    <span v-if="_.includes(['ANALISE', 'DEFERIMENTO', 'FORMALIZACAO', 'APROVACAO_PROJETO', 'APROVADO'], projetoSelecionado.ds_fase)">
                      <!-- Link para relatório FEP -->
                      <router-link :to="{name: 'relatorio-fep', params: { id: projetoSelecionado.id}}" target="_blank" class="btn btn-primary btn-sm btn-flat" style="text-decoration: none">
                        <i class="fa fa-file-text-o" aria-hidden="true"></i>&nbsp; FEP
                      </router-link>

                      <!-- Link para relatório de rating -->
                      <router-link :to="{name: 'relatorio-rating', params: { id: projetoSelecionado.id }, query : { entidade: projetoSelecionado.idEntidade} }" target="_blank" class="btn btn-primary btn-sm btn-flat" style="text-decoration: none">
                        <i class="fa fa-pencil-square-o"></i>&nbsp; Rating da Entidade
                      </router-link>

                      <!-- Link para relatório de análise -->
                      <span v-if="projetoSelecionado['relatorio_analise'] == null">
                        <button :disabled="projetoSelecionado['relatorio_analise'] == null" target="_blank" class="btn btn-primary btn-sm btn-flat" style="text-decoration: none" :title="titulo" v-tippy="{ inertia:true, arrow:true, animation:'perspective', distance:'1', size:'large', arrow:true }">
                          <i class="fa fa-pencil-square-o"></i>&nbsp; Relatório de Análise
                        </button>
                      </span>
                      <span v-else>
                        <!-- Demanda 66677 - Correção na chamada da função de cálculo de risco -->
                        <router-link :to="{name: 'visualiza-relatorio-analise', params: { id: projetoSelecionado.id, projeto: projetoSelecionado.ds_codigo_projeto_erp } }" target="_blank" class="btn btn-primary btn-sm btn-flat" style="text-decoration: none">
                          <i class="fa fa-pencil-square-o"></i>&nbsp; Relatório de Análise
                        </router-link>
                      </span>

                      <!-- Link para plano de trabalho -->
                      <router-link :to="{name: 'plano-trabalho', params: { id: projetoSelecionado.id } }" target="_blank" class="btn btn-primary btn-sm btn-flat" style="text-decoration: none">
                        <i class="fa fa-pencil-square-o"></i>&nbsp; Plano de Trabalho
                      </router-link>
                    </span>

                    <!-- Botão para mostrar/esconder o card de briefing -->
                    <span v-if="_.includes(['ANALISE'], projetoSelecionado.ds_fase) && projetoSelecionado.ds_codigo_projeto_erp !== '00000'">
                      <button @click="mostrarBriefing = true" class="btn btn-primary btn-sm btn-flat" style="text-decoration: none">
                        <i class="fa fa-pencil-square-o"></i>&nbsp; Relatório de Briefing
                      </button>
                    </span>
                  </div>
                </div>

                <!-- Card para briefing (exibido condicionalmente) -->
                <div v-if="mostrarBriefing" class="row mt-3">
                  <div class="col-md-12">
                    <b-card title="Dados que devem constar no Briefing" class="mb-3">
                      <div class="checkbox-block">
                        <b-form-checkbox-group v-model="selecionadosBriefing" class="mb-3" stacked>  
                          <b-form-checkbox v-for="item in dadosBriefing" :key="item.id" :value="item.id">  
                            <span style="margin-left: 8px;">{{ item.nome }}</span>  
                          </b-form-checkbox>  
                        </b-form-checkbox-group>
                      </div>
                      <div class="d-flex justify-content-end mt-3">
                        <button   
                          class="btn btn-primary btn-sm btn-flat"   
                          :class="{ 'btn-opaco': botaoClicado }"   
                          @click="gerarBriefing"  
                          :disabled="botaoClicado"   
                        >  
                          Gerar arquivo de Briefing  
                        </button>
                        <button   
                          class="btn btn-danger btn-sm btn-flat ml-2"   
                          @click="cancelarBriefing"  
                        >  
                          Cancelar  
                        </button>  
                      </div>
                    </b-card>
                  </div>
                </div>             
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script>
  import emiteDocumento from '../../mixins/emiteDocumento'
  import moment from 'moment'

  export default {
    name: 'ImpressaoRel',
    data () {
      return {
        loading: {
          show: false
        },
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
        relatorioAnalise: {},
        briefing: false,
        mostrarBriefing: false,
        dadosBriefing: [
          { id: 'sobreProjeto', nome: 'Sobre o Projeto', disabled: true },
          { id: 'dadosEntidade', nome: 'Dados da Entidade', disabled: false },
          { id: 'dadosProjeto', nome: 'Dados do Projeto', disabled: false },
          { id: 'infosProjeto', nome: 'Informações do Projeto', disabled: false },
          { id: 'analiseProjeto', nome: 'Análise do Projeto', disabled: false }
        ],
        selecionadosBriefing: ['sobreProjeto'],
        botaoClicado: false,
        titulo: '',
        projetos: [],
        proposta: {},
        projetoSelecionado: null,
        enderecoSnapshot: {}
      }
    },
    mounted () {
      console.clear()
      this.loading.show = true
      this.$snotify.async('Listando propostas. Por favor, aguarde...', {timeout: 1000})
      axiosLaravel.get('propostas').then((response) => {
        this.projetos = _.sortBy(response.data, 'ds_nome')
        // TODO ordenar por número quando tiver número de projeto nesse objeto de retorno
        this.$snotify.clear()
        this.loading.show = false
        this.$forceUpdate()
      })
        .catch((error) => {
          this.$root.trataErro(error)
        })
    },
    methods: {
      etiquetaProjeto (option) {
        if (option.ds_codigo_projeto_erp === null) {
          option.ds_codigo_projeto_erp = '00000'
        }
        return `${(_.has(option, 'ds_codigo_projeto_erp') ? option.ds_codigo_projeto_erp + ' - ' : '')}${option.ds_nome} | ${option.ds_cnpj} - ${option.NomeEntidade}`
      },
      onSelect (evento) {
        // console.log('evento', evento)
        if (evento.relatorio_analise === null) {
          this.titulo = 'A proposta não possui relatório de análise salvo no sistema.'
        } else {
          this.titulo = 'A proposta possui relatório de análise salvo no sistema.'
        }
      },
      async buscaSnapshot () {
        await axiosLaravel.post('propostas/snapshotProposta', {'idEntidade': this.projetoSelecionado.idEntidade}).then((response) => {
          console.log('analise', response.data.snapshot)
          this.proposta = JSON.parse(response.data.snapshot)
          console.log('analise', this.proposta.ds_nome)
        })
          .catch((error) => {
            console.log(error)
            this.$snotify.clear()
            this.$root.trataErro(error)
          })
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
      async buscaEndereco () {
        try {
          const response = await axiosLaravel.get('entidades/ultimosnapshot/' + this.projetoSelecionado.idEntidade)
          this.enderecoSnapshot = response.data.endereco
          console.log('Endereco snapshot:', this.enderecoSnapshot)
        } catch (error) {
          this.$snotify.clear()
          this.$root.trataErro(error)
        }
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
      async buscaAnalise () {
        await axiosLaravel.get('propostas/' + this.projetoSelecionado.id)
          .then((response) => {
            this.relatorioAnalise = JSON.parse(response.data.relatorio_analise)
          })
          .catch((error) => {
            this.$snotify.clear()
            this.$root.trataErro(error)
          })
      },
      cancelarBriefing () {
        this.botaoClicado = false
        this.mostrarBriefing = false
        this.selecionadosBriefing = ['sobreProjeto']
      },
      async gerarBriefing () {
        this.botaoClicado = true
        this.$snotify.async('Gerando arquivo de briefing...', {timeout: 0})
        await this.buscaSnapshot()
        await this.buscaAnalise()
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
              console.log('oioioi', dados)
              Object.assign(dadosBriefing.sobreProjeto, dados)
              break
            case 'dadosEntidade':
              dadosBriefing.temDadosEntidade = true
              // eslint-disable-next-line
              try {
                let endereco = null
                let temComplemento = false
                if (!this.proposta.entidade.endereco || !this.proposta.entidade.endereco[0]) {
                  await this.buscaEndereco()
                  // Use o endereço do snapshot para o relatório
                  endereco = this.enderecoSnapshot && this.enderecoSnapshot[0] ? this.enderecoSnapshot[0] : null
                } else {
                  endereco = this.proposta.entidade.endereco[0]
                }
                temComplemento = endereco && endereco.ds_complemento
                  ? endereco.ds_complemento.trim() !== ''
                  : false
                dados = {
                  nome_entidade: this.proposta.entidade.ds_nome,
                  cnpj_entidade: this.proposta.entidade.ds_cnpj.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5'),
                  endereco_rua: endereco ? endereco.ds_rua : 'não informado',
                  endereco_numero: endereco ? endereco.ds_numero : 'não informado',
                  endereco_complemento: temComplemento ? endereco.ds_complemento : 'não informado',
                  endereco_bairro: endereco ? endereco.ds_bairro : 'não informado',
                  endereco_cep: endereco ? endereco.ds_cep : 'não informado',
                  endereco_cidade: endereco ? endereco.ds_cidade : 'não informado',
                  endereco_estado: endereco ? endereco.ds_estado : 'não informado',
                  nome_coordenador: this.proposta.ds_nome_coordenador,
                  telefone_coordenador: this.proposta.ds_celular_coordenador,
                  email_coordenador: this.proposta.ds_email_coordenador
                }
                console.log('dados', dados)
              } catch (error) {
                this.$snotify.clear()
                this.$root.trataErro(error)
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
        emiteDocumento.methods.geraDocumento(dadosBriefing, 'briefingProposta')
        this.$snotify.clear()
        this.$snotify.success('Arquivo gerado com sucesso', {timeout: 4000})
        this.loading = false
        this.botaoClicado = false
        this.mostrarBriefing = false
      }
    }
  }
</script>

<style scoped>

.btn-opaco {  
  opacity: 0.5;  
  pointer-events: none;  
}

</style>
