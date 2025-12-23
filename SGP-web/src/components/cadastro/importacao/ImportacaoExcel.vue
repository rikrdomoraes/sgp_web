<template>

  <div class="box-body" >

    <div class="row form-horizontal form_importacao">

      <!-- Botão para upload do arquivo -->
      <div class="col-sm-12 form-group">
        <div v-show="analise.length === 0">
          <label class="control-label col-sm-2">Arquivo:</label>
          <div class="col-sm-10">
            <input type="file" id="fileUpload" ref="fileUpload" @change="arquivoAlterado"/>
          </div>
        </div>
        <div v-show="analise.length > 0">
          <label class="control-label col-sm-2">
            <g-button-moema color="primary" size="button--size-ss" @click.native="limparArquivo"><i class="fa fa fa-repeat" aria-hidden="true"></i> Trocar o arquivo</g-button-moema>
          </label>
          <div class="col-sm-10 nome_arquivo">{{nomeArquivo}}</div>
        </div>
      </div>


      <!-- Div para resultado da análise -->
      <div class="col-sm-12 resultado_importacao" v-if="analise.length > 0">
        <label class="control-label col-sm-2">Resultado:</label>
        <div class="col-sm-10">
          <div v-html="verificacaoExcel"/>

          <div v-if="acaoComplementar && contadorErrosGerais === 0">
            <div class="verificacaoALERTA">
              <span v-html="textoAcaoComplementar"/>
              <span ref="respostaAcaoComplementar">
                  <g-button-ujarak color="success" @click.native="opcaoAcaoComplementar(true)">Sim</g-button-ujarak>
                  <g-button-ujarak color="error"   @click.native="opcaoAcaoComplementar(false)">Não</g-button-ujarak>
                </span>
            </div>
          </div>

        </div>
      </div>

    </div>

  </div>

</template>

<script>
  import { mapGetters } from 'vuex'
  import * as XLSX from 'xlsx'
  import CnpjValidator from '../../i18n/cnpj.validator'
  import CpfValidator from '../../i18n/cpf.validator'
  //
  export default {
    name: 'ImportacaoExcel',
    data () {
      return {
        loading: {
          show: false
        },
        resultadoAnalise: false,
        analise: [],
        acaoComplementar: false,
        textoAcaoComplementar: '',
        contadorErrosGerais: 0,
        verificacaoExcel: '',
        cadastroEntidade: {},
        nomeArquivo: '',
        store: this.$store,
        breadcrumb: [{
          text: 'Inicial',
          href: '/'
        }, {
          text: 'Cadastro',
          href: '#'
        }, {
          text: 'Importação',
          active: true
        }]
      }
    },
    props: ['modelo'],
    created: function () {
    },
    computed: {
      ...mapGetters([
        'usuarioLogado'
      ])
    },
    mounted: function () {
    },
    methods: {
      //
      lerExcel () {
        let vm = this
        let fileUpload = document.getElementById('fileUpload')
        var regex = /^([a-zA-Z0-9\s_\\.\-:])+(.xls|.xlsx)$/
        if (regex.test(fileUpload.value.toLowerCase())) {
          if (typeof (FileReader) !== 'undefined') {
            let reader = new FileReader()
            //
            // For Browsers other than IE.
            if (reader.readAsBinaryString) {
              reader.onload = function (e) {
                vm.analisarExcel(e.target.result)
              }
              reader.readAsBinaryString(fileUpload.files[0])
            } else {
              // For IE Browser.
              reader.onload = function (e) {
                let data = ''
                let bytes = new Uint8Array(e.target.result)
                for (let i = 0; i < bytes.byteLength; i++) {
                  data += String.fromCharCode(bytes[i])
                }
                vm.analisarExcel(data)
              }
              reader.readAsArrayBuffer(fileUpload.files[0])
            }
          } else {
            vm.adicionaValidacao('navegador_invalido', false, '<p><span class="verificacaoERRO">O navegador de internet que está usando não suportado a operação. Favor usar um dos recomendados.</span></p>')
          }
        } else {
          vm.adicionaValidacao('arquivo_invalido', false, '<p><span class="verificacaoERRO">Esse arquivo não é do Excel (XLS ou XLSX)</span></p>')
        }
        vm.resultado()
      },
      //
      //
      analisarExcel (data) {
        let vm = this
        vm.resultadoAnalise = true
        // Read the Excel File data.
        let workbook = XLSX.read(data, {
          type: 'binary'
        })
        vm.verificacaoExcel = ''
        //
        let codigoModelo = _.find(XLSX.utils.sheet_to_row_object_array(workbook.Sheets['Dados Básicos']), ['valor', this.modelo])
        //
        if (_.isUndefined(codigoModelo)) { // Não é o modelo correto
          vm.adicionaValidacao('modelo_invalido', false, '<span class="verificacaoERRO">Ops! Esse Excel não é a planilha correta</span>')
        } else {
          // O arquivo selecionado é o mesmo do modelo
          vm.cadastroEntidade['dadosBasicos'] = XLSX.utils.sheet_to_row_object_array(workbook.Sheets['Dados Básicos'])
          vm.cadastroEntidade['enderecos'] = XLSX.utils.sheet_to_row_object_array(workbook.Sheets['Endereços'])
          vm.cadastroEntidade['dirigentes'] = XLSX.utils.sheet_to_row_object_array(workbook.Sheets['Dirigentes'])
          vm.cadastroEntidade['usuarios'] = XLSX.utils.sheet_to_row_object_array(workbook.Sheets['Usuários do Sistema'])
          //
          // Limpar a lista retirando registros não preenchidos corretamente
          vm.cadastroEntidade['usuarios'] = _.pullAllBy(vm.cadastroEntidade['usuarios'], [{ 'Nome': 0 }], 'Nome') // Retirar os registros que tiverem o campo nome = 0 (nome é uma fórmula)
          vm.cadastroEntidade['enderecos'] = _.filter(vm.cadastroEntidade['enderecos'], function (o) { return o['Endereço'] }) // Os registros que pelo menos tiverem o campo Endereço preenchido
          vm.cadastroEntidade['dirigentes'] = _.filter(vm.cadastroEntidade['dirigentes'], function (o) { return o['Nome'] }) // Os registros que pelo menos tiverem o campo Endereço preenchido
          vm.cadastroEntidade['representanteLegal'] = _.filter(vm.cadastroEntidade['dirigentes'], {'bt_representante_legal': 1}) // Representante legal, ou seja os dirigentes marcados como SIM no campo com esse nome
          //
          // Verificar os dados básicos
          let dadosBasicoEmBranco = vm.cadastroEntidade['dadosBasicos'][1]['valor'] // Campo de Obrigatoriedade no Excel guia dados básicos
          if (dadosBasicoEmBranco > 0) {
            vm.adicionaValidacao('dados_basicos', false, '<p><span class="verificacaoERRO"><strong>Dados Básicos</strong> com ' + dadosBasicoEmBranco + (dadosBasicoEmBranco > 1 ? ' campos não preenchidos' : ' campo não preenchido') + '</span></p>')
          } else {
            vm.adicionaValidacao('dados_basicos', true, '<p><span class="verificacaoOK">Dados Básicos preenchidos</span></p>')
          }
          //
          // Verificar o CNPJ
          vm.cadastroEntidade['dadosBasicos'][3]['valor'] = ('' + vm.cadastroEntidade['dadosBasicos'][3]['valor']).replace(/\.|-|\/| /g, '')
          let CNPJvalidado = CnpjValidator.validate(vm.cadastroEntidade['dadosBasicos'][3]['valor']) // Campo de CNPJ no Excel guia dados básicos
          if (!CNPJvalidado && vm.cadastroEntidade['dadosBasicos'][3]['valor'] !== '') {
            vm.adicionaValidacao('validacao_cnpj', false, '<p><span class="verificacaoERRO">O CNPJ \'<strong>' + vm.cadastroEntidade['dadosBasicos'][3]['valor'] + '</strong>\' informado na planilha, não é um CNPJ válido</span></p>')
          }
          //
          // Verificar os endereços
          let enderecosIncompletos = _.filter(vm.cadastroEntidade['enderecos'], function (o) { return o['Obrigatoriedade'] > 0 }) // Campo de Obrigatoriedade no Excel guia de enderecos
          if (enderecosIncompletos.length > 0) {
            let camposEnderecoEmBranco = _.sumBy(enderecosIncompletos, function (o) { return o['Obrigatoriedade'] })
            vm.adicionaValidacao('enderecos', false, '<p><span class="verificacaoERRO">Há ' + enderecosIncompletos.length + ' endereço' + (enderecosIncompletos.length > 1 ? 's' : '') + ' com ' + camposEnderecoEmBranco + (camposEnderecoEmBranco > 1 ? ' campos não preenchidos' : ' campo não preenchido') + '</span></p>')
          } else if (vm.cadastroEntidade['enderecos'].length === 0) {
            vm.adicionaValidacao('enderecos', false, '<p><span class="verificacaoERRO">Nenhum <strong>Endereço</strong> foi cadastrado. Pelo menos da sede deve constar na planilha</span></p>')
          } else {
            vm.adicionaValidacao('enderecos', true, '<p><span class="verificacaoOK">' + vm.cadastroEntidade['enderecos'].length + (vm.cadastroEntidade['enderecos'].length > 1 ? ' Endereços informados' : ' Endereço informado') + ' </span></p>')
          }
          //
          // Limpar '.' e '-' se colocado indevidamente
          _.forEach(vm.cadastroEntidade['dirigentes'], function (dirigente, id) {
            dirigente['CPF'] = ('' + dirigente['CPF']).replace(/\.|-|\/| /g, '')
          })
          // Verificar os dirigentes
          let dirigentesIncompletos = _.filter(vm.cadastroEntidade['dirigentes'], function (o) { return o['Obrigatoriedade'] > 0 }) // Campo de Obrigatoriedade no Excel guia de dirigentes
          if (dirigentesIncompletos.length > 0) {
            let camposDirigentesEmBranco = _.sumBy(dirigentesIncompletos, function (o) { return o['Obrigatoriedade'] })
            vm.adicionaValidacao('dirigentes', false, '<p><span class="verificacaoERRO">Há ' + dirigentesIncompletos.length + ' dirigente' + (dirigentesIncompletos.length > 1 ? 's' : '') + ' com ' + camposDirigentesEmBranco + (camposDirigentesEmBranco > 1 ? ' campos não preenchidos' : ' campo não preenchido') + '</span></p>')
          } else if (vm.cadastroEntidade['dirigentes'].length === 0) {
            vm.adicionaValidacao('dirigentes', false, '<p><span class="verificacaoERRO">Nenhum <strong>Dirigente</strong> foi cadastrado. Pelo menos, um dirigente da entidade deve ser adicionado na planilha</span></p>')
          } else {
            vm.adicionaValidacao('dirigentes', true, '<p><span class="verificacaoOK">' + vm.cadastroEntidade['dirigentes'].length + (vm.cadastroEntidade['dirigentes'].length > 1 ? ' Dirigentes informados' : ' Dirigente informado') + ' </span></p>')
          }
          //
          // Verificar os usuários
          _.forEach(vm.cadastroEntidade['usuarios'], function (usuario, id) {
            axiosLaravel.post('/verifica-usuario/', {'parametro': usuario['Login']}).then((response) => { // verificando login repetido e criando um novo se ocorrer repetido
              if (response.data.length > 0) {
                vm.cadastroEntidade['usuarios'][id].Login = _.split(_.lowerCase(vm.cadastroEntidade['usuarios'][id].Login), ' ', 1) + _.toString(_.now()).substr(-5)
              }
            })
              .catch((error) => {
                if (error) {
                  this.$root.trataErro(error)
                }
              })
            // Limpar '.' e '-' se colocado indevidamente
            usuario['CPF'] = usuario['CPF'].replace(/\.|-|\/| /g, '')
            //
            // Verificar se CPF é válido
            let CPFvalidado = CpfValidator.validate(usuario['CPF'])
            if (!CPFvalidado) {
              vm.adicionaValidacao('usuario' + usuario['CPF'], false, '<p><span class="verificacaoERRO">O CPF \'<strong>' + usuario['CPF'] + '</strong>\' de ' + usuario['Nome'] + ', não é um CPF válido</span></p>')
            }
            //
            // Verifica se e-mail já está sendo usado
            vm.adicionaValidacao('usuario' + usuario['E-mail'], false, '<p><span class="verificacaoANALISANDO">Analisando <strong>' + usuario['Nome'] + '</strong>...</span></p>')
            axiosLaravel.post('/verifica-usuario/', {'parametro': usuario['E-mail']}).then((response) => { // verificando e-mail repetido e pedindo para alterar
              if (response.data.length > 0) {
                vm.adicionaValidacao('usuario' + usuario['E-mail'], false, '<p><span class="verificacaoERRO">O e-mail <strong>' + usuario['E-mail'] + '</strong> de <i>' + usuario['Nome'] + '</i> já esta sendo usado. Informe outro e-mail na planilha</span></p>')
              } else {
                vm.adicionaValidacao('usuario' + usuario['E-mail'], true, null)
              }
              vm.resultado()
            })
              .catch((error) => {
                if (error) {
                  this.$root.trataErro(error)
                }
              })
          })
          //
          // Verificar repetição de CPF
          let cpfs = _.map(_.countBy(vm.cadastroEntidade['usuarios'], 'CPF'), function (o) { return o > 1 })
          if (_.remove(cpfs, function (n) { return n }).length !== 0) {
            vm.adicionaValidacao('cpf_repetidos', false, '<p><span class="verificacaoERRO">Há <strong>CPF</strong> repetido na planilha</span></p>')
          }
          //
          // Pegar o representante legal
          if (vm.cadastroEntidade['representanteLegal'].length < 1) {
            vm.adicionaValidacao('representanteLegal', false, '<p><span class="verificacaoERRO">Deve haver pelo menos um Dirigente marcado com \'SIM\' na coluna de <strong>Representante Legal</strong></span></p>')
            // vm.resultado()
          }
          //
          // Verificar se entidade já existe
          let cnpj = vm.cadastroEntidade['dadosBasicos'][3]['valor']
          if (cnpj.length > 3) {
            axiosLaravel.post('entidade/existe', {'cnpj': cnpj}).then((response) => {
              if (response.data > 0) {
                this.acaoComplementar = true
                this.textoAcaoComplementar = 'Esta instituição já está cadastrada. Se prosseguir, substituirá o cadastro atual! Em caso de dúvidas, encaminhe mensagem para <strong>chamadaspublicas@fbb.org.br</strong>  '
                this.adicionaValidacao('entidade', false, null)
              } else {
                this.adicionaValidacao('entidade', true, null)
              }
              this.resultado()
            })
              .catch((error) => {
                if (error) {
                  this.$root.trataErro(error)
                }
              })
          }
        }
        //
        console.log('Excel - Cadastro Entidade', vm.cadastroEntidade)
        vm.resultado()
      },
      verificarModelo () {
        this.lerExcel()
      },
      adicionaValidacao (i, v, h) {
        let obj = {item: i, validacao: v, html: h}
        _.remove(this.analise, ['item', i])
        this.analise.push(obj)
      },
      opcaoAcaoComplementar (opcao) {
        this.adicionaValidacao('entidade', opcao, null)
        this.$refs.respostaAcaoComplementar.innerHTML = opcao ? 'SIM' : 'NÃO'
        this.resultado()
      },
      limparArquivo () {
        this.analise = []
        this.$refs.fileUpload.value = null
        this.verificacaoExcel = ''
        this.acaoComplementar = false
        this.textoAcaoComplementar = ''
        this.resultado()
      },
      arquivoAlterado (e) {
        this.analise = []
        if (e.target.value !== '') {
          this.verificarModelo()
          this.nomeArquivo = e.target.value
        } else {
          this.verificacaoExcel = ''
        }
      },
      resultado () {
        this.verificacaoExcel = _.join(_.map(this.analise, 'html'), '')
        this.contadorErrosGerais = _.filter(_.reject(this.analise, {'item': 'entidade', 'validacao': false}), ['validacao', false]).length // Conta todos os erros menos de 'entidade' já cadastrada para mostrar ou não a pergunta
        let analiseExcel = !(_.filter(this.analise, ['validacao', false]).length > 0 || this.analise.length === 0) // Verifica se há erros
        this.$emit('analiseExcel', analiseExcel)
        this.$emit('objetoExcel', analiseExcel ? this.cadastroEntidade : {})
      }
    }
  }
</script>

<style>
  .resultado_importacao {
    margin: 10px;
    padding: 10px 0px;
    background: #eee;
    border: 1px solid #ddd;
    border-radius: 5px;
    width: 90% !important
  }

  .resultado_importacao .verificacaoANALISANDO {
    color: dodgerblue;
  }

  .resultado_importacao .verificacaoOK {
    color: green;
  }

  .resultado_importacao span.verificacaoOK:after {
    content: "  \2713";
    font-weight: bold;
    color: mediumseagreen;
  }

  .resultado_importacao .verificacaoERRO {
    color: red;
  }

  .resultado_importacao span.verificacaoERRO:after {
    content: "  \2717";
    font-weight: bold;
    color: orangered;
  }

  .resultado_importacao .verificacaoALERTA {
    background: darkorange;
    color: white;
    padding: 5px 10px;
    border-radius: 5px;
  }

  .form_importacao .nome_arquivo {
    margin-top: 15px;
  }

</style>
