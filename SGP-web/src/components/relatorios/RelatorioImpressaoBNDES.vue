<template>
  <div id="FundacaoCode12646546516581">

    <div class="fbbpage01 fbb-cabecalho-relatorio">
      <div>
        <img src="/static/img/logo-login.png">
      </div>
      <div class="titulo-relatorio">
        Relatório de Execução
      </div>
    </div>

    <RelatorioTitulo valor="Dados do Projeto" class="fbbpage01">
      <div class="fbb-grid">
        <div class="fbb-col-span-12">
          <RelatorioTextoDestaque titulo="Título do projeto" :valor="limpaCampo(dadosRelatorio.cabecalho.projeto)"/>
          <RelatorioTextoDestaque titulo="Convenente" :valor="limpaCampo(dadosRelatorio.cabecalho.entidade)"/>
        </div>
        <div class="fbb-col-span-6">
          <RelatorioTextoDestaque titulo="Número do projeto"
                                  :valor="limpaCampo(dadosRelatorio.cabecalho.numero_projeto)"/>
          <RelatorioTextoDestaque titulo="Início de execução do projeto"
                                  :valor="limpaCampo(dadosRelatorio.cabecalho.inicio)"/>
          <RelatorioTextoDestaque titulo="Percentual financeiro realizado"
                                  :valor="limpaCampo(dadosRelatorio.cabecalho.percentual_liberacao)"/>
          <RelatorioTextoDestaque titulo="E-mail de contato"
                                  :valor="limpaCampo(dadosRelatorio.cabecalho.email_contato)"/>
          <RelatorioTextoDestaque titulo="Telefone 01"
                                  :valor="limpaCampo(dadosRelatorio.cabecalho.telefone_contato_1)"/>
          <RelatorioTextoDestaque titulo="Objeto cumprido?" v-if="dadosRelatorio.objeto.length > 0"
                                  :valor="limpaCampo(dadosRelatorio.objeto)"/>
        </div>
        <div class="fbb-col-span-6">
          <RelatorioTextoDestaque titulo="Tipo de relatório" :valor="limpaCampo(dadosRelatorio.tipo_relatorio)"/>
          <RelatorioTextoDestaque titulo="Fim de execução do projeto"
                                  :valor="limpaCampo(dadosRelatorio.cabecalho.termino)"/>
          <RelatorioTextoDestaque titulo="Percentual de tempo decorrido"
                                  :valor="limpaCampo(dadosRelatorio.cabecalho.percentual_andamento)"/>
          <RelatorioTextoDestaque titulo="Contrapartida Executada" :valor="`${contrapartidaConsolidada.toFixed(2)} %`"/>
          <RelatorioTextoDestaque titulo="Telefone 02"
                                  :valor="limpaCampo(dadosRelatorio.cabecalho.telefone_contato_2)"/>
        </div>
      </div>
      <div class="html2pdf__page-break"></div>
    </RelatorioTitulo>
<!--    <RelatorioTitulo valor="Usuário que enviou o relatório" class="fbbpage01">-->
<!--      <div class="fbb-grid">-->
<!--        <div class="fbb-col-span-4">-->
<!--          <RelatorioTextoDestaque titulo="Nome" :valor="dadosRelatorio.usuario_enviou.nome"/>-->
<!--        </div>-->
<!--        <div class="fbb-col-span-4">-->
<!--          <RelatorioTextoDestaque titulo="CPF" :valor="dadosRelatorio.usuario_enviou.cpf"/>-->
<!--        </div>-->
<!--        <div class="fbb-col-span-4">-->
<!--          <RelatorioTextoDestaque titulo="E-mail" :valor="dadosRelatorio.usuario_enviou.email"/>-->
<!--        </div>-->
<!--      </div>-->
<!--      <div class="html2pdf__page-break"></div>-->
<!--    </RelatorioTitulo>-->
    <RelatorioTitulo valor="Metas e Atividades" class="fbbpage02">
      <div class="fbb-grid">
        <div class="fbb-col-span-12 fbb-flex">
          <div class="titulo-tabela">metas</div>
          <div class="titulo-tabela">atividades</div>
        </div>
        <div class="fbb-col-span-12 fbb-flex">
          <div class="titulo-tabela-2" style="width: 30%;">Descrição</div>
          <div class="titulo-tabela-2" style="width: 5%;">Orçado</div>
          <div class="titulo-tabela-2" style="width: 7%;">Realizado</div>
          <div class="titulo-tabela-2" style="width: 8%;">Atingimento</div>
          <div class="titulo-tabela-2" style="width: 25%;">Descricão</div>
          <div class="titulo-tabela-2" style="width: 12.5%;">Status</div>
          <div class="titulo-tabela-2" style="width: 12.5%;">Execução</div>
          <!--          <div class="titulo-tabela-2" style="width: 10%;">Anexo</div>-->
        </div>
        <div class="fbb-col-span-12 fbb-flex" v-for="meta in dadosRelatorio.metas.row">
          <div class="tabela-body" style="width: 30%;">{{ meta.meta }}</div>
          <div class="tabela-body" style="width: 5%;">{{ meta.orcado }}</div>
          <div class="tabela-body" style="width: 7%;">{{ meta.realizado }}</div>
          <div class="tabela-body" style="width: 8%;">{{ (meta.realizado / meta.orcado) | percentage }}</div>
          <div class="tabela-body" style="width: 50%; height: 100%">
            <div class="" style="width: 100%; height: auto" v-for="atividade in meta.atividades.row">
              <div class="fbb-flex">
                <div class="tabela-body" style="width: 50%;">{{ atividade.atividade }}</div>
                <div class="tabela-body" style="width: 25%;">{{ retornaSituacao(atividade.status) }}</div>
                <div class="tabela-body" style="width: 25%;">{{ atividade.execucao }} %</div>
              </div>
              <!--              <div class="tabela-body" style="width: 20%;">Anexo</div>-->
              <div class="titulo-tabela" style="width: 100%">Arquivos</div>
              <div v-for="anexo in atividade.anexos_atividades.row">{{ anexo.ds_nome_arquivo}}</div>
            </div>
          </div>
        </div>
      </div>
      <div class="html2pdf__page-break"></div>
    </RelatorioTitulo>
    <RelatorioTitulo valor="Justificativa pelo não atingimento de meta" class="fbbpage03">
      <div class="fbb-grid">
        <div class="fbb-col-span-12 fbb-flex">
          <div class="titulo-tabela" style="width: 30%">Meta / Atividade</div>
          <div class="titulo-tabela" style="width: 30%">Objetivo</div>
          <div class="titulo-tabela" style="width: 30%">Providência</div>
          <div class="titulo-tabela" style="width: 10%">Prazo</div>
        </div>
        <div class="fbb-col-span-12 fbb-flex" v-for="executadaParcial in executadasparcial.filter(item => item.providencia != '')"
             v-if="executadasparcial && executadasparcial.length > 0">
          <div class="tabela-body" style="width: 30%; text-align: justify">
            <div> <strong>{{limpaCampo(executadaParcial.meta)}}</strong></div>
            <div>{{limpaCampo(executadaParcial.atividade)}}</div>
          </div>
          <div class="tabela-body" style="width: 30%; text-align: justify">{{ limpaCampo(executadaParcial.motivo) }}</div>
          <div class="tabela-body" style="width: 30%; text-align: justify">{{ limpaCampo(executadaParcial.providencia) }}</div>
          <div class="tabela-body" style="width: 10%; text-align: justify">{{
              executadaParcial.prazo_regularizacao_meta | formataData
            }}
          </div>
        </div>
      </div>
      <div class="html2pdf__page-break"></div>
    </RelatorioTitulo>
    <RelatorioTitulo valor="Justificativa pela não execução da atividade" class="fbbpage04"
                     v-if="executadasparcial && naoexecutadas.length > 0">
      <div class="fbb-grid">
        <div class="fbb-col-span-12 fbb-flex">
          <div class="titulo-tabela" style="width: 22.5%">Meta</div>
          <div class="titulo-tabela" style="width: 22.5%">Atividade</div>
          <div class="titulo-tabela" style="width: 22.5%">Motivo</div>
          <div class="titulo-tabela" style="width: 22.5%">Providências</div>
          <div class="titulo-tabela" style="width: 10%">Prazo</div>
        </div>
        <div class="fbb-col-span-12 fbb-flex" v-for="naoexecutada in naoexecutadas">
          <div class="tabela-body" style="width: 22.5%; text-align: justify">{{ limpaCampo(naoexecutada.meta) }}</div>
          <div class="tabela-body" style="width: 22.5%; text-align: justify">{{ limpaCampo(naoexecutada.atividade) }}</div>
          <div class="tabela-body" style="width: 22.5%; text-align: justify">{{ limpaCampo(naoexecutada.motivo) }}</div>
          <div class="tabela-body" style="width: 22.5%; text-align: justify">{{ limpaCampo(naoexecutada.providencia) }}</div>
          <div class="tabela-body" style="width: 10%; text-align: justify">{{
              naoexecutada.prazo_regularizacao_atividade | formataData
            }}
          </div>
        </div>
      </div>
      <div class="html2pdf__page-break"></div>
    </RelatorioTitulo>
    <RelatorioTitulo valor="Número de participantes envolvidos atualmente no projeto" class="fbbpage04">
      <div class="fbb-grid">
        <div class="fbb-col-span-12 fbb-flex">
          <div class="titulo-tabela">Público</div>
          <div class="titulo-tabela">Previsto</div>
          <div class="titulo-tabela">Realizado</div>
        </div>
        <div class="fbb-col-span-12 fbb-flex">
          <div class="tabela-body" style="width: 100%">Participantes</div>
          <div class="tabela-body" style="width: 100%">{{ previstoPublicoAlvo.participantes }}</div>
          <div class="tabela-body" style="width: 100%">{{ totalizadores.participantes }}</div>
        </div>
        <div class="fbb-col-span-12 fbb-flex">
          <div class="tabela-body" style="width: 100%">Jovens</div>
          <div class="tabela-body" style="width: 100%">{{ previstoPublicoAlvo.jovens }}</div>
          <div class="tabela-body" style="width: 100%">{{ totalizadores.jovens }}</div>
        </div>
        <div class="fbb-col-span-12 fbb-flex">
          <div class="tabela-body" style="width: 100%">Mulheres</div>
          <div class="tabela-body" style="width: 100%">{{ previstoPublicoAlvo.mulheres }}</div>
          <div class="tabela-body" style="width: 100%">{{ totalizadores.mulheres }}</div>
        </div>
      </div>
    </RelatorioTitulo>
    <RelatorioTitulo valor="O cronograma físico-financeiro está sendo executado conforme previsto?" class="fbbpage05">
      <div class="area-de-texto-impressao">{{
          retornaAplicacao(dadosRelatorio.cronograma_conforme_previsto.resposta)
        }}
      </div>
    </RelatorioTitulo>
    <RelatorioTitulo valor="A contrapartida está sendo comprovada de acordo com o previsto no Plano de Trabalho?" class="fbbpage05">
      <div class="area-de-texto-impressao">
        {{ retornaAplicacao(dadosRelatorio.contrapartida_comprovada_previsto.resposta) }}
      </div>
    </RelatorioTitulo>
    <RelatorioTitulo valor="Foram realizadas as ações de divulgação previstas no Projeto?" class="fbbpage05">
      <div class="area-de-texto-impressao">{{ dadosRelatorio.acoes_divulgacao_prevista.justificativa }}</div>
      <div class="html2pdf__page-break" v-if="paginas[4] && paginas[4].quebra"></div>
    </RelatorioTitulo>
    <RelatorioTitulo valor="Informar como está o desenvolvimento do Objeto do Convênio:" class="fbbpage05">
      <div class="area-de-texto-impressao">{{ dadosRelatorio.desenvolvimento_objeto_convenio.valor }}</div>
      <div class="html2pdf__page-break"></div>
    </RelatorioTitulo>
    <RelatorioTitulo valor="Informar sobre o alcance dos Objetivos do projeto:" class="fbbpage06">
      <div class="fbb-grid">
        <div class="fbb-col-span-12 fbb-flex">
          <div class="titulo-tabela">Item</div>
          <div class="titulo-tabela">Descrição</div>
          <div class="titulo-tabela">Realizado</div>
        </div>
        <div class="fbb-col-span-12 fbb-flex" v-for="objProj in dadosRelatorio.objetivos_projeto.row">
          <div class="tabela-body" style="width: 100%; text-align: justify">{{ objProj.item }}</div>
          <div class="tabela-body" style="width: 100%; text-align: justify">{{ objProj.descricao }}</div>
          <div class="tabela-body" style="width: 100%; text-align: justify">{{ objProj.realizado }}</div>
        </div>
      </div>
      <div class="html2pdf__page-break"></div>
    </RelatorioTitulo>
    <RelatorioTitulo valor="Resultados alcançados até o momento:" class="fbbpage07">
      <div class="area-de-texto-impressao">{{ dadosRelatorio.resultados_alcancados.valor }}</div>
    </RelatorioTitulo>
    <RelatorioTitulo valor="Depoimentos:" class="fbbpage07">
      <div class="area-de-texto-impressao">{{ dadosRelatorio.depoimentos.valor }}</div>
    </RelatorioTitulo>
    <RelatorioTitulo valor="O Projeto contribui para a comercialização da produção?" class="fbbpage07">
      <div class="area-de-texto-impressao">{{
          retornaAplicacao(dadosRelatorio.comercializacao_producao.resposta)
        }}
      </div>
      <div class="html2pdf__page-break"></div>
    </RelatorioTitulo>
    <RelatorioTitulo valor="O Projeto contribui para o desenvolvimento de novos conhecimentos/habilidades?" class="fbbpage08">
      <div class="area-de-texto-impressao"><span
        class="negrito">Nível de 1 a 5:  </span>{{ dadosRelatorio.questionario.questao_1.resposta }}
      </div>
      <div class="area-de-texto-impressao">{{ dadosRelatorio.questionario.questao_1.consideracoes }}</div>
    </RelatorioTitulo>
    <RelatorioTitulo valor="O Projeto contribui para o envolvimento de mulheres e jovens?" class="fbbpage08">
      <div class="area-de-texto-impressao"><span class="negrito">Nível de 1 a 5:  </span>
        {{ dadosRelatorio.questionario.questao_2.resposta }}
      </div>
      <div class="area-de-texto-impressao">{{ dadosRelatorio.questionario.questao_2.consideracoes }}</div>
    </RelatorioTitulo>
    <RelatorioTitulo valor="O Projeto contribui para a formação de novas parcerias além da Fundação Banco do Brasil?" class="fbbpage08">
      <div class="area-de-texto-impressao"><span class="negrito">Nível de 1 a 5:  </span>
        {{ dadosRelatorio.questionario.questao_3.resposta }}
      </div>
      <div class="area-de-texto-impressao">{{ dadosRelatorio.questionario.questao_3.consideracoes }}</div>
      <div class="html2pdf__page-break"></div>
    </RelatorioTitulo>
    <RelatorioTitulo valor="O Projeto contribui para o surgimento de novas oportunidades de trabalho e/ou renda?" class="fbbpage08">
      <div class="area-de-texto-impressao"><span class="negrito">Nível de 1 a 5:  </span>
        {{ dadosRelatorio.questionario.questao_4.resposta }}
      </div>
      <div class="area-de-texto-impressao">{{ dadosRelatorio.questionario.questao_4.consideracoes }}</div>
    </RelatorioTitulo>
    <RelatorioTitulo valor="O Projeto contribui para a preservação do meio ambiente e o cuidado ambiental?" class="fbbpage09">
      <div class="area-de-texto-impressao"><span
        class="negrito">Nível de 1 a 5:  </span>{{ dadosRelatorio.questionario.questao_5.resposta }}
      </div>
      <div class="area-de-texto-impressao">{{ dadosRelatorio.questionario.questao_5.consideracoes }}</div>
    </RelatorioTitulo>
    <RelatorioTitulo valor="O Projeto contribui para a valorização de questões relativas a direitos humanos?" class="fbbpage09">
      <div class="area-de-texto-impressao"><span
        class="negrito">Nível de 1 a 5:  </span>{{ dadosRelatorio.questionario.questao_6.resposta }}
      </div>
      <div class="area-de-texto-impressao">{{ dadosRelatorio.questionario.questao_6.consideracoes }}</div>
      <div class="html2pdf__page-break"></div>
    </RelatorioTitulo>
    <RelatorioTitulo valor="Conclusão do relatório" class="fbbpage09">
      <div class="area-de-texto-impressao">{{ dadosRelatorio.parecer_fbb.valor }}</div>
    </RelatorioTitulo>
  </div>
</template>

<script>
import RelatorioTitulo from '../shared/RelatorioTitulo.vue'
import RelatorioTextoDestaque from '../shared/RelatorioTextoDestaque.vue'

export default {
  name: 'relatorioBNDES',
  components: {RelatorioTextoDestaque, RelatorioTitulo},
  props: [
    'dadosRelatorio',
    'previstoPublicoAlvo',
    'totalizadores',
    'executadasparcial',
    'naoexecutadas',
    'contrapartida'
  ],
  data () {
    return {
      paginas: Array
    }
  },
  methods: {
    retornaSituacao (situacao) {
      if (situacao === 1) {
        return 'Executada'
      } else if (situacao === 2) {
        return 'Em Execução'
      } else if (situacao === 3) {
        return 'Não Executada'
      }
      return ''
    },
    retornaAplicacao (situacao) {
      if (situacao === 'NAO-SE-APLICA') {
        return 'Não se aplica'
      } else if (situacao === 'SIM') {
        return 'Sim'
      } else if (situacao === 'NÂO') {
        return 'Não'
      }
      return ''
    },
    limpaCampo (campo) {
      if (Array.isArray(campo) && campo.length === 0) {
        return ''
      }
      return campo
    },
    calculaTamanhoDePagina (atributo, lista) {
      return lista
        .filter(item => item.class === atributo)
        .reduce((accumulator, object) => {
          return accumulator + object.altura
        }, 0)
    },
    verificaTamanhos (elemento) {
      let divs = Array.from(elemento.childNodes)
        .map(item => {
          return {
            'tipo': item.nodeName,
            'largura': item.clientWidth,
            'altura': item.clientHeight,
            'class': item.classList && item.classList.length > 0 ? Array.from(item.classList)
              .filter(item => String(item).includes('fbbpage'))[0] : ''
          }
        })
        .filter(item => item.tipo === 'DIV')
      let listaTamanhosDePagina = []
      let altura = 0
      for (let i = 0; i < 20; i++) {
        altura = this.calculaTamanhoDePagina(`fbbpage${i < 10 ? '0' : ''}${i + 1}`, divs)
        listaTamanhosDePagina.push({
          'pagina': i + 1,
          'altura': altura,
          'largura': 750,
          'quebra': altura > 900
        })
      }
      this.paginas = listaTamanhosDePagina
    }
  },
  computed: {
    contrapartidaConsolidada () {
      const somaInicial = this.contrapartida.reduce((accumulator, currentValue) => {
        return accumulator + parseFloat(String(currentValue.atingimento).replace('%', '').trim())
      }, 0.0)
      return somaInicial / this.contrapartida.length
    }
  }
}
</script>

<style scoped>

#FundacaoCode12646546516581 {
  display: none;
}

.fbb-grid {
  display: grid;
  grid-template-columns: repeat(12, minmax(0, 1fr));
}

.fbb-col-span-1 {
  grid-column: span 1 / span 1;
}

.fbb-col-span-2 {
  grid-column: span 2 / span 2;
}

.fbb-col-span-3 {
  grid-column: span 3 / span 3;
}

.fbb-col-span-4 {
  grid-column: span 4 / span 4;
}

.fbb-col-span-5 {
  grid-column: span 5 / span 5;
}

.fbb-col-span-6 {
  grid-column: span 6 / span 6;
}

.fbb-col-span-7 {
  grid-column: span 7 / span 7;
}

.fbb-col-span-8 {
  grid-column: span 8 / span 8;
}

.fbb-col-span-9 {
  grid-column: span 9 / span 9;
}

.fbb-col-span-10 {
  grid-column: span 10 / span 10;
}

.fbb-col-span-11 {
  grid-column: span 11 / span 11;
}

.fbb-col-span-12 {
  grid-column: span 12 / span 12;
}

.fbb-flex {
  display: flex;
}

.fbb-justify-normal {
  justify-content: normal;
}

.fbb-justify-start {
  justify-content: flex-start;
}

.fbb-justify-end {
  justify-content: flex-end;
}

.fbb-justify-center {
  justify-content: center;
}

.fbb-justify-between {
  justify-content: space-between;
}

.fbb-justify-around {
  justify-content: space-around;
}

.fbb-justify-evenly {
  justify-content: space-evenly;
}

.fbb-justify-stretch {
  justify-content: stretch;
}

.titulo-tabela {
  border-style: solid;
  border-width: 1px;
  border-color: rgb(0 0 0);
  width: 50%;
  text-align: center;
  background-color: grey;
  color: white;
  font-weight: bold;
  font-size: 10px;
}

.titulo-tabela-2 {
  border-style: solid;
  border-width: 1px;
  border-color: rgb(0 0 0);
  text-align: center;
  font-weight: bold;
  font-size: 10px;
}

.tabela-body {
  border-style: solid;
  border-width: 1px;
  border-color: rgb(0 0 0);
  text-align: center;
  font-size: 10px;
}

.area-de-texto-impressao {
  text-align: justify;
  font-size: 12px;
}

.fbb-cabecalho-relatorio {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.fbb-cabecalho-relatorio > div > img {
  width: 150px;
}

.fbb-cabecalho-relatorio > .titulo-relatorio {
  font-size: 20px;
}

.negrito {
  font-weight: bold;
}

</style>
