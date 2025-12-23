import Docxtemplater from 'docxtemplater'
import PizZip from 'pizzip'
import PizZipUtils from 'pizzip/utils/index'
import { saveAs } from 'file-saver'
import extenso from 'extenso'

const SIMPLIFICADA = '../../static/docs/modelos/Minuta Convenio RP - Modelo Processo Simplificado.docx'
const SIMPLIFICADA_PUBLICA = '../../static/docs/modelos/Minuta Convenio RP - Modelo Processo Simplificado_-_Entidade_publica.docx'
const SIMPLIFICADA_PRIVADA = '../../static/docs/modelos/Minuta Convenio RP - Modelo Processo Simplificado_-_Entidade_privada.docx'
const COM_ADIANTAMENTO_PRIVADA = '../../static/docs/modelos/Minuta_Convenio_RP_-_COM_Adiant_-_Entidade_privada.docx'
const COM_ADIANTAMENTO_PUBLICA = '../../static/docs/modelos/Minuta_Convenio_RP_-_COM_Adiant_-_Entidade_publica.docx'
const SEM_ADIANTAMENTO_PRIVADA = '../../static/docs/modelos/Minuta_Convenio_RP_-_SEM_Adiant_-_Entidade_privada.docx'
const SEM_ADIANTAMENTO_PUBLICA = '../../static/docs/modelos/Minuta_Convenio_RP_-_SEM_Adiant_-_Entidade_publica.docx'
// const MULHERES_NEGRAS = '../../static/docs/modelos/Minuta_Edital_Mulheres_Negras.docx'
const MULHERES_NEGRAS_CONVENIO = '../../static/docs/modelos/Minuta_de_Convenio_Mulheres_Negras_simplificado.docx'
const CATAFORTE = '../../static/docs/modelos/Minuta_Edital_Cataforte.docx'
const ECOFORTE = '../../static/docs/modelos/Minuta_Edital_Ecoforte.docx'
const ECOFORTE_AMAZONIA = '../../static/docs/modelos/Minuta_Edital_Ecoforte_Fundo_Amazonia.docx'
// Função que carrega o arquivo na memória para manipulação

function loadFile (url, callback) {
  PizZipUtils.getBinaryContent(url, callback)
}
function formatarNumero (numero) {
  return numero.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')
}
function formatarRG (rg) {
  // Remove qualquer caractere que não seja número
  rg = rg.replace(/\D/g, '')
  // Formata o RG no padrão XX.XXX.XXX-X
  return rg.replace(/(\d{2})(\d{3})(\d{3})(\d{1})/, '$1.$2.$3-$4')
}
function formatarCEP (cep) {
  // Remove qualquer caractere que não seja número
  cep = cep.replace(/\D/g, '')
  // Formata o CEP no padrão XXXXX-XXX
  return cep.replace(/(\d{5})(\d{3})/, '$1-$2')
}
function numeroPorExtenso (numero, tipo = 'INTEIRO') {
  let numeroExtenso = ''
  if (tipo === 'MOEDA') {
    numero = '' + (_.toNumber(numero)).toFixed(2).replace('.', ',')
    // numero = '' + (_.toNumber(numero)).toLocaleString('pt-BR')
    // numero += numero.indexOf(',') !== -1 ? '' : ',00'
    numeroExtenso = extenso(numero, {mode: 'currency', number: {decimalSeparator: 'comma'}})
  } else if (tipo === 'INTEIRO') {
    numero = '' + (_.toNumber(numero)).toLocaleString('en-US')
    numeroExtenso = extenso(numero)
  }
  return numeroExtenso
}
function formatarMoeda (numero) {
  return (_.toNumber(numero)).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}
function formatarCPF (cpf) {
  // Remove qualquer caractere que não seja número
  cpf = cpf.replace(/\D/g, '')
  // Formata o CPF no padrão XXX.XXX.XXX-XX
  return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')
}
function formatarCNPJ (cnpj) {
  // Remove qualquer caractere que não seja número
  cnpj = cnpj.replace(/\D/g, '')
  // Formata o CNPJ no padrão XX.XXX.XXX/XXXX-XX
  return cnpj.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5')
}
const OBJETOBASE = {
  data_extenso: '[DATA POR EXTENSO]',
  entidade_personjuridica: '[PERSONALIDADE JURÍDICA]',
  agencia_prefixo: '[AGÊNCIA PREFIXO]',
  agencia_nome_uf: '[AGÊNCIA NOME UF]',
  agencia_cnpj: '[AGÊNCIA CNPJ]',
  entidade_municipio: '[ENTIDADE MUNICIPIO]',
  entidade_endereco: '[ENTIDADE ENDEREÇO]',
  entidade_cep: '[ENTIDADE CEP]',
  entidade_cnpj: '[ENTIDADE CNPJ]',
  gerente_nome: '[GERENTE NOME]',
  gerente_estcivil: '[GERENTE EST.CIVIL]',
  gerente_tipodoc: '[GERENTE TIPO DOCUMENTO]',
  gerente_numerodoc: '[GERENTE NUMERO DOCUMENTO]',
  gerente_cpf: '[GERENTE CPF]',
  gerente_municipio: '[GERENTE MUNICÍPIO]',
  representante_funcao: '[REPRESENTANTE FUNÇÃO]',
  representante_nome: '[REPRESENTANTE NOME]',
  representante_estcivil: '[REPRESENTANTE EST.CIVIL]',
  representante_profissao: '[REPRESENTANTE PROFISSÃO]',
  representante_tipodoc: '[REPRESENTANTE TIPO DOCUMENTO]',
  representante_numerodoc: '[REPRESENTANTE NUMERO DOCUMENTO]',
  representante_municipio: '[REPRESENTANTE MUNICÍPIO]',
  representante_cpf: '[REPRESENTANTE CPF]',
  representante_fundacao_funcao: '[REPRESENTANTE FUNDAÇÃO FUNÇÃO]',
  representante_fundacao_nome: '[REPRESENTANTE FUNDAÇÃO NOME]',
  representante_fundacao_estcivil: '[REPRESENTANTE FUNDAÇÃO EST.CIVIL]',
  representante_fundacao_profissao: '[REPRESENTANTE FUNDAÇÃO PROFISSÃO]',
  representante_fundacao_tipodoc: '[REPRESENTANTE FUNDAÇÃO TIPO DOCUMENTO]',
  representante_fundacao_numerodoc: '[REPRESENTANTE FUNDAÇÃO NUMERO DOCUMENTO]',
  representante_fundacao_municipio: '[REPRESENTANTE FUNDAÇÃO MUNICÍPIO]',
  representante_fundacao_cpf: '[REPRESENTANTE FUNDACAO CPF]',
  proposta_edital: '[EDITAL DA PROPOSTA]',
  projeto_numero: '[No DO PROJETO]',
  projeto_titulo: '[TITULO DO PROJETO]',
  proposta_objeto_resumo: '[RESUMO DA PROPOSTA]',
  valor_total: '[VALOR TOTAL]',
  valor_total_extenso: '[VALOR TOTAL POR EXTENSO]',
  valor_fundacao: '[VALOR FUNDAÇÃO]',
  valor_fundacao_extenso: '[VALOR FUNDAÇÃO POR EXTENSO]',
  valor_terceiros: '[VALOR TERCEIROS]',
  valor_terceiros_extenso: '[VALOR TERCEIROS POR EXTENSO]',
  valor_convenente: '[VALOR CONVENENTE]',
  valor_convenente_extenso: '[VALOR CONVENENTE POR EXTENSO]',
  proposta_vigencia: '[PROPOSTA VIGÊNCIA]',
  proposta_vigencia_extenso: '[PROPOSTA VIGÊNCIA POR EXTENSO]',
  periodicidade_de_relatorio_meses: '[PERIODICIDADE DE RELATORIO EM MESES]',
  total_adiantamento: '[TOTAL ADIANTAMENTO]',
  numero_parcelas: '[NUMERO PARCELAS]',
  total_adiantamento_extenso: '[TOTAL ADIANTAMENTO POR EXTENSO]',
  parcelas_adiantamento: '[PARCELAS ADIANTAMENTO]',
  primeira_testemunha_nome: '[NOME TESTEMUNHA]',
  primeira_testemunha_cpf: '[CPF TESTEMUNHA]',
  segunda_testemunha_nome: '[NOME TESTEMUNHA]',
  segunda_testemunha_cpf: '[CPF TESTEMUNHA]',
  proposta_conta_adiantamento: '[CONTA DE ADIANTAMENTO DA PROPOSTA]',
  proposta_agencia_adiantamento: '[AGENCIA DE ANDIANTAMENTO DA PROPOSTA]',
  proposta_conta_deb: '[CONTA DEB]',
  proposta_agencia_deb: '[AGENCIA DEB]',
  representantes: '[REPRESENTANTES]'
}
function adaptaObjeto (objeto, isPublica) {
  let novoObjeto = OBJETOBASE
  // Data atual por extenso
  const dataAtual = new Date()
  const opcoes = { year: 'numeric', month: 'long', day: 'numeric' }
  novoObjeto.data_extenso = dataAtual.toLocaleDateString('pt-BR', opcoes)
  // Dados da entidade
  objeto.entidade_nome ? novoObjeto.entidade_nome = objeto.entidade_nome.trimStart().toUpperCase() : null
  objeto.entidade_municipio ? novoObjeto.entidade_municipio = objeto.entidade_municipio + ' (' + objeto.entidade_uf + ')' : null
  objeto.entidade_cep ? novoObjeto.entidade_cep = formatarCEP(objeto.entidade_cep) : null
  objeto.entidade_cnpj ? novoObjeto.entidade_cnpj = formatarCNPJ(objeto.entidade_cnpj) : null
  objeto.entidade_endereco ? novoObjeto.entidade_endereco = objeto.entidade_endereco : null
  // objeto.entidade_forma_juridica ? novoObjeto.entidade_personjuridica = objeto.entidade_forma_juridica : null
  objeto.entidade_forma_juridica ? novoObjeto.entidade_personjuridica = (isPublica ? 'público' : 'privado') : null
  // Dados da Agencia
  // TODO - Pegar CNPJ da Agencia?
  if (objeto.agencia) {
    objeto.agencia.cnpj ? novoObjeto.agencia_cnpj = formatarCNPJ(objeto.agencia.cnpj) : null
    objeto.agencia.nomeAgencia ? novoObjeto.agencia_nome_uf = objeto.agencia.nomeAgencia : null
    objeto.agencia.agencia ? novoObjeto.agencia_prefixo = objeto.agencia.agencia : null
    // Informações do Gerente Geral
    objeto.agencia.informacoesGerenteGeral.nome ? novoObjeto.gerente_nome = objeto.agencia.informacoesGerenteGeral.nome : null
    objeto.agencia.informacoesGerenteGeral.cpf ? novoObjeto.gerente_cpf = formatarCPF(objeto.agencia.informacoesGerenteGeral.cpf) : null
    if (objeto.agencia.informacoesGerenteGeral.estadoCivil) {
      let estadoCivil = objeto.agencia.informacoesGerenteGeral.estadoCivil
      estadoCivil = estadoCivil.charAt(0).toUpperCase() + estadoCivil.slice(1) + '(a)'
      novoObjeto.gerente_estcivil = estadoCivil
    } else {
      novoObjeto.gerente_estcivil = null
    }
    objeto.agencia.informacoesGerenteGeral.municipioResidencia ? novoObjeto.gerente_municipio = objeto.agencia.informacoesGerenteGeral.municipioResidencia : null
    // TODO - Pegar RG do gerente geral?
    objeto.agencia.informacoesGerenteGeral.rg ? novoObjeto.gerente_numerodoc = formatarRG(objeto.agencia.informacoesGerenteGeral.rg) : null
    objeto.agencia.informacoesGerenteGeral.rg ? novoObjeto.gerente_tipodoc = 'RG' : null
  }
  // // Representante Entidade
  // objeto.representantes_entidade.ds_cpf ? novoObjeto.representante_cpf = formatarCPF(objeto.representantes_entidade.ds_cpf) : null
  // objeto.representantes_entidade.ds_profissao ? novoObjeto.representante_profissao = objeto.representantes_entidade.ds_profissao : null
  // objeto.representantes_entidade.ds_nome ? novoObjeto.representante_nome = objeto.representantes_entidade.ds_nome : null
  // objeto.representantes_entidade.ds_estado_civil ? novoObjeto.representante_estcivil = objeto.representantes_entidade.ds_estado_civil.toLowerCase() : null
  // objeto.representantes_entidade.cargo.ds_descricao ? novoObjeto.representante_funcao = objeto.representantes_entidade.cargo.ds_descricao : null
  // objeto.representantes_entidade.ds_rg ? novoObjeto.representante_tipodoc = 'RG' : null
  // objeto.representantes_entidade.ds_rg ? novoObjeto.representante_numerodoc = formatarRG(objeto.representantes_entidade.ds_rg) : null
  // Representante fundação
  objeto.representante_fundacao_nome ? novoObjeto.representante_fundacao_nome = objeto.representante_fundacao_nome : null
  objeto.representante_fundacao_cargo ? novoObjeto.representante_fundacao_cargo = objeto.representante_fundacao_cargo : null
  if (objeto.representante_fundacao_estado_civil) {
    let estadoCivil = objeto.representante_fundacao_estado_civil
    estadoCivil = estadoCivil.charAt(0).toUpperCase() + estadoCivil.slice(1) + '(a)'
    novoObjeto.representante_fundacao_estcivil = estadoCivil
  } else {
    novoObjeto.representante_fundacao_estcivil = null
  }
  objeto.representante_fundacao_tipo_documento ? novoObjeto.representante_fundacao_tipodoc = objeto.representante_fundacao_tipo_documento : null
  objeto.representante_fundacao_numero_documento ? novoObjeto.representante_fundacao_numerodoc = objeto.representante_fundacao_numero_documento : null
  objeto.representante_fundacao_cpf ? novoObjeto.representante_fundacao_cpf = formatarCPF(objeto.representante_fundacao_cpf) : null
  objeto.representante_fundacao_endereco ? novoObjeto.representante_fundacao_endereco = objeto.representante_fundacao_endereco : null
  objeto.representante_fundacao_municipio ? novoObjeto.representante_fundacao_municipio = objeto.representante_fundacao_municipio : null
  // TODO - Municipio de Residencia do Representante da Entidade
  objeto.representantes_entidade.endereco.ds_cidade ? novoObjeto.representante_municipio = objeto.representantes_entidade.endereco.ds_cidade : null
  // Informaçoes da Proposta
  objeto.proposta_edital ? novoObjeto.proposta_edital = objeto.proposta_edital : novoObjeto.proposta_edital = 'N/A'
  objeto.projeto_numero ? novoObjeto.projeto_numero = formatarNumero(objeto.projeto_numero) : null
  objeto.projeto_titulo ? novoObjeto.projeto_titulo = objeto.projeto_titulo : null
  if (objeto.proposta_objeto_resumo) {
    let resumo = objeto.proposta_objeto_resumo
    resumo = resumo.substring(0, 1).toLowerCase() + resumo.substring(1)
    if (resumo.endsWith('.')) {
      resumo = resumo.slice(0, -1) + ','
    } else {
      resumo += ','
    }
    novoObjeto.proposta_objeto_resumo = resumo
  } else {
    novoObjeto.proposta_objeto_resumo = null
  }
  // Valores Proposta
  objeto.proposta_valor_fbb ? novoObjeto.valor_fundacao = formatarMoeda(objeto.proposta_valor_fbb) : null
  objeto.proposta_valor_fbb ? novoObjeto.valor_fundacao_extenso = numeroPorExtenso(objeto.proposta_valor_fbb, 'MOEDA') : null
  objeto.proposta_valor_terceiros ? novoObjeto.valor_terceiros = formatarMoeda(objeto.proposta_valor_terceiros) : null
  objeto.proposta_valor_terceiros ? novoObjeto.valor_terceiros_extenso = numeroPorExtenso(objeto.proposta_valor_terceiros, 'MOEDA') : null
  objeto.proposta_valor_contrapartida ? novoObjeto.valor_convenente = formatarMoeda(objeto.proposta_valor_contrapartida) : null
  objeto.proposta_valor_contrapartida ? novoObjeto.valor_convenente_extenso = numeroPorExtenso(objeto.proposta_valor_contrapartida, 'MOEDA') : null
  // Verifica valor total
  if (objeto.proposta_valor_fbb && objeto.proposta_valor_contrapartida) {
    novoObjeto.valor_total = formatarMoeda(_.toNumber(objeto.proposta_valor_fbb) + _.toNumber(objeto.proposta_valor_contrapartida))
    novoObjeto.valor_total_extenso = numeroPorExtenso(_.toNumber(objeto.proposta_valor_fbb) + _.toNumber(objeto.proposta_valor_contrapartida), 'MOEDA')
  } else if (objeto.proposta_valor_fbb && !objeto.proposta_valor_contrapartida) {
    novoObjeto.valor_total = formatarMoeda(objeto.proposta_valor_fbb)
    novoObjeto.valor_total_extenso = numeroPorExtenso(objeto.proposta_valor_fbb, 'MOEDA')
  } else if (!objeto.proposta_valor_fbb && objeto.proposta_valor_contrapartida && !objeto.proposta_valor_terceiros) {
    novoObjeto.valor_total = formatarMoeda(objeto.proposta_valor_contrapartida)
    novoObjeto.valor_total_extenso = numeroPorExtenso(objeto.proposta_valor_contrapartida, 'MOEDA')
  } else if (objeto.proposta_valor_contrapartida && objeto.proposta_valor_terceiros) {
    novoObjeto.valor_total = formatarMoeda(_.toNumber(objeto.proposta_valor_contrapartida) + _.toNumber(objeto.proposta_valor_terceiros))
    novoObjeto.valor_total_extenso = numeroPorExtenso(_.toNumber(objeto.proposta_valor_contrapartida) + _.toNumber(objeto.proposta_valor_terceiros), 'MOEDA')
  } else {
    novoObjeto.valor_total = null
    novoObjeto.valor_total_extenso = null
  }

  objeto.proposta_periodicidade_formulario ? novoObjeto.periodicidade_de_relatorio_meses = objeto.proposta_periodicidade_formulario : null
  objeto.proposta_vigencia_meses ? novoObjeto.proposta_vigencia = objeto.proposta_vigencia_meses : null
  objeto.proposta_vigencia_meses ? novoObjeto.proposta_vigencia_extenso = numeroPorExtenso(objeto.proposta_vigencia_meses) : null
  objeto.testemunhas[0] ? objeto.testemunhas[0].nome ? novoObjeto.primeira_testemunha_nome = objeto.testemunhas[0].nome : null : null
  objeto.testemunhas[0] ? objeto.testemunhas[0].cpf ? novoObjeto.primeira_testemunha_cpf = formatarCPF(objeto.testemunhas[0].cpf) : null : null
  objeto.testemunhas[1] ? objeto.testemunhas[1].nome ? novoObjeto.segunda_testemunha_nome = objeto.testemunhas[1].nome : null : null
  objeto.testemunhas[1] ? objeto.testemunhas[1].cpf ? novoObjeto.segunda_testemunha_cpf = formatarCPF(objeto.testemunhas[1].cpf) : null : null

  // Numero de parcelas
  if (objeto.proposta_parcelas_adiantamento) {
    let numeroParcelas = objeto.proposta_parcelas_adiantamento.length
    // Total Parcelas
    let totalParcelas = 0
    // Texto Parcelas
    let stringParcelas = ''
    objeto.proposta_parcelas_adiantamento.forEach((parcela, index) => {
      // criar a string:
      // 1ª parcela: até R$ undefined (undefined);
      // 2ª parcela: até R$ undefined (undefined);
      // 3ª parcela: até R$ undefined (undefined);
      // 4ª parcela: até R$ undefined (undefined);
      // [...]
      totalParcelas += parcela.valor
      // Cria a string para a parcela atual
      stringParcelas += `${index + 1}ª parcela: até R$ ${formatarMoeda(parcela.valor)} (${numeroPorExtenso(parcela.valor, 'MOEDA')});\n\n`
    })
    novoObjeto.total_adiantamento = formatarMoeda(totalParcelas)
    novoObjeto.numero_parcelas = numeroParcelas
    let totalParcelasFormatado = totalParcelas.toFixed(2).replace('.', ',')
    novoObjeto.total_adiantamento_extenso = extenso(totalParcelasFormatado, { mode: 'currency', number: { decimalSeparator: 'comma' } })
    novoObjeto.parcelas_adiantamento = stringParcelas
  }
  // Contas do projeto
  objeto.proposta_conta_corrente_deb ? novoObjeto.proposta_conta_deb = objeto.proposta_conta_corrente_deb : null
  objeto.proposta_agencia_deb ? novoObjeto.proposta_agencia_deb = objeto.proposta_agencia_deb : null
  objeto.proposta_agencia_adiantamento ? novoObjeto.proposta_agencia_adiantamento = objeto.proposta_agencia_adiantamento : null
  objeto.proposta_conta_corrente_adiantamento ? novoObjeto.proposta_conta_adiantamento = objeto.proposta_conta_corrente_adiantamento : null
  if (Array.isArray(objeto.responsavel_assinatura)) {
    novoObjeto.representantes = objeto.responsavel_assinatura.map(rep => ({
      representante_assina_nome: rep.ds_nome,
      representante_assina_funcao: rep.cargo.ds_descricao
    }))
    novoObjeto.representantes_info = objeto.responsavel_assinatura.map((rep, index, array) => ({
      representante_cpf: formatarCPF(rep.ds_cpf),
      representante_profissao: rep.ds_profissao,
      representante_municipio: rep.endereco.ds_cidade + ' (' + rep.endereco.ds_estado + ')',
      representante_nome: rep.ds_nome,
      representante_estcivil: rep.ds_estado_civil.charAt(0).toUpperCase() + rep.ds_estado_civil.slice(1).toLowerCase() + '(a)',
      representante_funcao: rep.cargo.ds_descricao,
      representante_tipodoc: 'RG',
      representante_numerodoc: formatarRG(rep.ds_rg),
      e_o: index < array.length - 1 ? 'e; o(a)' : ''
    }))
  }
  return novoObjeto
}
const geraMinuta = {
  methods: {
    async gerarMinuta (projetoId, minutaSimplificada, fkEdital, tipoEcoforte) {
      // 1 - Pegar o ID da proposta
      // let projetoId = 4379
      // 2 - Consumir Endpoint do kennedy
      console.log('consultando dados...', projetoId)
      let entidade = await axiosLaravel.get(`dadosMinutaPorProposta/${projetoId}`)
      // let entidade = await axiosLaravel.get(`dadosMinutaPorProposta/3894`)
      console.log(entidade.data)
      // Verificar se tem ou não adiantamento
      let isAdiantado
      if (!_.isNull(entidade.data.proposta_parcelas_adiantamento)) {
        isAdiantado = entidade.data.proposta_parcelas_adiantamento.length > 0
      } else {
        isAdiantado = false
      }
      // Verificar se é Entidade PRIVADA OU PUBLICA
      let isPublica = entidade.data.entidade_ente_publico
      // let isPublica = true
      // Verificar se é o processo simplificado
      // let isSimplificado = ((_.toNumber(entidade.data.proposta_valor_fbb) + _.toNumber(entidade.data.proposta_valor_parceiros)) <= 300000)
      let isSimplificado = minutaSimplificada
      // Verificar faixa do projeto simplificado (até 300 mil)
      console.log('ADIANTAMENTO', isAdiantado)
      console.log('PUBLICA', isPublica)
      console.log('SIMPLIFICADA', isSimplificado)
      console.log('EDITAL', fkEdital)
      console.log('FAIXA PROJETO FBB: ', entidade.data.proposta_valor_fbb)
      console.log('FAIXA PROJETO PARCEIRO: ', entidade.data.proposta_valor_parceiros)
      console.log('FAIXA PROJETO: ', (_.toNumber(entidade.data.proposta_valor_fbb) + _.toNumber(entidade.data.proposta_valor_parceiros)))
      // 3 - Preencher a Minuta Automática de Acordo com o Modelo
      let enderecoArquivo = ''
      let nomeArquivo = ''
      // Alterar nome do arquivo para MINUTA_ADT_NUMERO DO PROJETO ETC
      switch (true) {
        case isAdiantado && isPublica:
          enderecoArquivo = COM_ADIANTAMENTO_PUBLICA
          nomeArquivo = `Minuta_ADT_${entidade.data.projeto_numero}.docx`
          console.log(COM_ADIANTAMENTO_PUBLICA)
          break
        case isAdiantado && !isPublica:
          enderecoArquivo = COM_ADIANTAMENTO_PRIVADA
          nomeArquivo = `Minuta_ADT_${entidade.data.projeto_numero}.docx`
          console.log(COM_ADIANTAMENTO_PRIVADA)
          break
        case !isAdiantado && isPublica:
          enderecoArquivo = SEM_ADIANTAMENTO_PUBLICA
          nomeArquivo = `Minuta_SEM_ADT_${entidade.data.projeto_numero}.docx`
          console.log(SEM_ADIANTAMENTO_PUBLICA)
          break
        case !isAdiantado && !isPublica:
          enderecoArquivo = SEM_ADIANTAMENTO_PRIVADA
          nomeArquivo = `Minuta_SEM_ADT_${entidade.data.projeto_numero}.docx`
          console.log(SEM_ADIANTAMENTO_PRIVADA)
          break
        default:
          console.log(SIMPLIFICADA)
          break
      }
      if (isSimplificado && isPublica) {
        enderecoArquivo = SIMPLIFICADA_PUBLICA
        nomeArquivo = `Minuta_${entidade.data.projeto_numero}.docx`
        console.log(SIMPLIFICADA_PUBLICA)
      } else if (isSimplificado && !isPublica) {
        enderecoArquivo = SIMPLIFICADA_PRIVADA
        nomeArquivo = `Minuta_${entidade.data.projeto_numero}.docx`
        console.log(SIMPLIFICADA_PRIVADA)
      }
      if (fkEdital === 12 && !isSimplificado) {
        enderecoArquivo = MULHERES_NEGRAS_CONVENIO
        nomeArquivo = `Minuta_Edital_${entidade.data.projeto_numero}.docx`
        console.log(MULHERES_NEGRAS_CONVENIO)
      }
      if (fkEdital === 10 && !isSimplificado) {
        enderecoArquivo = CATAFORTE
        nomeArquivo = `Minuta_Edital_CATAFORTE_${entidade.data.projeto_numero}.docx`
        console.log(CATAFORTE)
      }
      if (fkEdital === 9 && !isSimplificado && tipoEcoforte === 1) {
        enderecoArquivo = ECOFORTE
        nomeArquivo = `Minuta_Edital_ECOFORTE_${entidade.data.projeto_numero}.docx`
        console.log(ECOFORTE)
      }
      if (fkEdital === 9 && !isSimplificado && tipoEcoforte === 2) {
        enderecoArquivo = ECOFORTE_AMAZONIA
        nomeArquivo = `Minuta_Edital_ECOFORTE_FUNDO_AMAZONIA_${entidade.data.projeto_numero}.docx`
        console.log(ECOFORTE_AMAZONIA)
      }

      // } else if (fkEdital === 12 && isSimplificado) {
      //   enderecoArquivo = MULHERES_NEGRAS_CONVENIO
      //   nomeArquivo = `Minuta_Edital_${entidade.data.projeto_numero}_simplificado.docx`
      //   console.log(MULHERES_NEGRAS_CONVENIO)
      // }
      loadFile(enderecoArquivo, function (error, content) {
        if (error) {
          throw error
        }
        const zip = new PizZip(content)
        const doc = new Docxtemplater(zip, {paragraphLoop: true, linebreaks: true})
        // Neste ponto os dados será inseridos nas TAGs dentro do arquivo de template
        doc.setData(adaptaObjeto(entidade.data, isPublica))
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
        // 4 - Devolver o Arquivo para Download para o usuário
        return saveAs(out, nomeArquivo)
      })
      return true
    }
  }
}

export default geraMinuta
