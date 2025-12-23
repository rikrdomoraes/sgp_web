// Demanda 65971 inclusão da Emissão de Documentos pré-preenchidos
import Docxtemplater from 'docxtemplater'
import PizZip from 'pizzip'
import PizZipUtils from 'pizzip/utils/index'
import { saveAs } from 'file-saver'

// Variáveis estáticas com os endereços dos arquivos a serem utilizados
const ATESTADO_CAPACIDADE = '../../static/docs/modelos/atestadoCapacidadeTecnica.docx'
const NOTIFICACAO_AVISO = '../../static/docs/modelos/NotificacaoExtrajudicialAviso.docx'
const NOTIFICACAO_FINAL = '../../static/docs/modelos/NotificacaoExtrajudicialFinal.docx'
const RELATORIO_MONITORAMENTO = '../../static/docs/modelos/RelatorioDeMonitoramento.docx'
const BRIEFING_PROJETO = '../../static/docs/modelos/BriefingTemplate.docx'
const BRIEFING_PROPOSTA = '../../static/docs/modelos/BriefingPropostaTemplate.docx'

// Função que carrega o arquivo na memória para manipulação
function loadFile (url, callback) {
  PizZipUtils.getBinaryContent(url, callback)
}

const emiteDocumento = {
  methods: {
    // Método que irá gerar o documento conforme os dados e o tipo de arquivo enviado
    geraDocumento (dados, tipoArquivo) {
      let enderecoArquivo = ''
      let nomeArquivo = ''
      // Este switch irá determinar qual template será utilizado e com qual nome ele será salvo
      switch (tipoArquivo) {
        case 'atestado':
          enderecoArquivo = ATESTADO_CAPACIDADE
          nomeArquivo = `Atestado_Capacidade_Tecnica_${dados.entidade}.docx`
          break
        case 'notificacaoAviso':
          enderecoArquivo = NOTIFICACAO_AVISO
          nomeArquivo = `Notificacao_Extrajudicial_Aviso_${dados.entidade}.docx`
          break
        case 'notificacaoFinal':
          enderecoArquivo = NOTIFICACAO_FINAL
          nomeArquivo = `Notificacao_Extrajudicial_Final_${dados.entidade}.docx`
          break
        case 'relatorioMonitoramento':
          enderecoArquivo = RELATORIO_MONITORAMENTO
          nomeArquivo = `Relatorio_de_Monitoramento_${dados.nome_entidade}.docx`
          break
        case 'briefingProjeto':
          enderecoArquivo = BRIEFING_PROJETO
          nomeArquivo = `Briefing_projeto_${dados.sobreProjeto.nome_projeto}.docx`
          break
        case 'briefingProposta':
          enderecoArquivo = BRIEFING_PROPOSTA
          nomeArquivo = `Briefing_proposta_${dados.sobreProjeto.nome_projeto}.docx`
          break
        default:
          break
      }
      // A partit desse ponto se inicia o processamento do arquivo conforme documentação da lib Docxtemplater
      loadFile(enderecoArquivo, function (error, content) {
        if (error) {
          throw error
        }
        const zip = new PizZip(content)
        const doc = new Docxtemplater(zip, {paragraphLoop: true, linebreaks: true})
        // Neste ponto os dados será inseridos nas TAGs dentro do arquivo de template
        doc.setData(dados)
        try {
          doc.render()
        } catch (error) {
          // eslint-disable-next-line
          function replaceErrors(key, value) {
            if (value instanceof Error) {
              return Object.getOwnPropertyNames(value).reduce(function
                (error, key) {
                error[key] = value[key]
                return error
              },
              {})
            }
            return value
          }
          console.log(JSON.stringify({error: error}, replaceErrors))
          if (error.properties && error.properties.errors instanceof Array) {
            const errorMessages = error.properties.errors
              .map(function (error) {
                return error.properties.explanation
              })
              .join('\n')
            console.log('errorMessages', errorMessages)
          }
          throw error
        }
        const out = doc.getZip().generate({
          type: 'blob',
          mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        })
        return saveAs(out, nomeArquivo)
      })
    }
  }
}

export default emiteDocumento
