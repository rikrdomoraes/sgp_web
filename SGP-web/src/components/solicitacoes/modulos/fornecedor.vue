<template>
  <div class="col-md-12" >
    <div class="box box-widget" >
      <div class="box-header with-border">
        <h3 class="box-title">Fornecedor</h3>
      </div>
      <div class="box-body">
        <div class="row" >
          <div class="col-md-6">
            <!-- formas de pagamento -->
            <div class="form-group required-field-field"
                 :class="{ 'has-error' : errors.first('tipo de pessoa')}">
              <label for="tipo de pessoa" class="control-label col-md-4">Tipo de pessoa:</label>
              <div class="col-md-7 ">

                <div>
                  <select id="tipo de pessoa" v-model="nota.tipoFornecedor" name="tipo de pessoa" @change="bloqueiaCampos = 0, nota.nomeFornecedor = '', nota.cepFornecedor = '', nota.enderecoFornecedor = ''" class="form-control" v-validate="'required'">
                    <option value="Pessoa Física">Pessoa Física</option>
                    <option value="Pessoa Jurídica">Pessoa Jurídica</option>
                  </select>
                </div>
                <span v-if="errors.first('tipo de pessoa')" class="label label-danger"> {{ errors.first('tipo de pessoa') }}</span>
              </div>
            </div>

            <!-- nome -->
            <div class="form-group required-field"
                 :class="{ 'has-error' : errors.first('nome')}">
              <label for="nome" class="control-label col-md-4">Nome:</label>
              <div class="col-md-7 ">
                <div>
                  <input id="nome"  v-model="nota.nomeFornecedor" :disabled="bloqueiaCampos === 1" name="nome" class="form-control" type="text"
                         maxlength="255" v-validate="'required'">
                </div>
                <span v-if="errors.first('nome')" class="label label-danger"> {{ errors.first('nome') }}</span>
              </div>
            </div>

            <!-- cep -->
            <div class="form-group required-field row"
                 :class="{ 'has-error' : errors.first('cep')}">
              <label for="cep" class="control-label col-md-4">CEP:</label>
              <div class="col-md-4 ">
                <div>
                  <the-mask  id="cep" v-model="nota.cepFornecedor" name="cep" :mask="['#####-###']" :disabled="bloqueiaCampos === 1" class="form-control"
                             @blur.native="loadCityAndState" v-validate="'required'">
                  </the-mask>
                </div>
                <span v-if="errors.first('cep')" class="label label-danger"> {{ errors.first('cep') }}</span>
              </div>
              <div class="col-md-4" style="padding:7px;" v-if="nota.cepFornecedor">
                {{nota.cidadeFornecedor}} {{(nota.estadoFornecedor)?'/ '+nota.estadoFornecedor:''}}
              </div>
            </div>
          </div>

          <div class="col-md-6">

            <!-- cnpj -->
            <div v-if="nota.tipoFornecedor === 'Pessoa Jurídica'" class="form-group required-field"
                 :class="{ 'has-error' : errors.first('cnpj')}">
              <label for="cnpj" class="control-label col-md-4">CNPJ:</label>
              <div class="col-md-7">
                <div>
                  <the-mask id="cnpj" v-model="nota.cnpjFornecedor" :disabled="bloqueiaCampos === 1" name="cnpj" class="form-control" :mask="['##.###.###/####-##']"
                            @blur.native="onBlurCpfCnpj(nota.cnpjFornecedor)" type="text"
                            v-validate="'required|cnpj'">
                  </the-mask>
                </div>
                <span v-if="errors.first('cnpj')" class="label label-danger"> {{ errors.first('cnpj') }}</span>
              </div>
            </div>

            <!-- CPF -->
            <div v-if="nota.tipoFornecedor === 'Pessoa Física'" class="form-group required-field"
                 :class="{ 'has-error' : errors.first('cpf')}">
              <label for="cpf" class="control-label col-md-4">CPF:</label>
              <div class="col-md-7 ">
                <div>
                  <the-mask id="cpf" v-model="nota.cpfFornecedor" name="cpf" :disabled="bloqueiaCampos === 1" :mask="['###.###.###-##']" class="form-control" type="text"
                         @blur.native="onBlurCpfCnpj(nota.cpfFornecedor)" v-validate="'required'">
                  </the-mask>
                </div>
                <span v-if="errors.first('cpf')" class="label label-danger"> {{ errors.first('cpf') }}</span>
              </div>
            </div>

            <!-- endereço -->
            <div  class="form-group required-field"
                  :class="{ 'has-error' : errors.first('endereço')}">
              <label for="endereço" class="control-label col-md-4">Endereço:</label>
              <div class="col-md-7 ">
                <div>
                  <input id="endereço" v-model="nota.enderecoFornecedor" :disabled="bloqueiaCampos === 1" name="endereço" class="form-control" type="text"
                          v-validate="'required|max:255'">
                </div>
                <span v-if="errors.first('endereço ')" class="label label-danger"> {{ errors.first('endereço') }}</span>
              </div>
            </div>

          </div>
        </div>
      </div> <!-- ./box-body -->
    </div>
  </div>
</template>

<script>
    // import { cpf, cnpj } from 'cpf-cnpj-validator'
    export default {
      name: 'fornecedor',
      data () {
        return {
          nota: {},
          validacao: {},
          validoCPF: true
        }
      },
      props: ['propsNota', 'propsValidacao'],
      watch: {
        propsNota () {
          this.nota = this.propsNota
        },
        propsValidacao () {
          var $cpfcnpjold = $('.cpfcnpj').val()
          if ($cpfcnpjold) {
            $cpfcnpjold = $cpfcnpjold.replaceAll('.', '').replaceAll('-', '')
            if ($cpfcnpjold.length > 11) {
              $cpfcnpjold = $cpfcnpjold.replaceAll('/', '')
            }
          }
          if ($cpfcnpjold !== this.nota.dados_bancarios.fornecedor.identificador && $cpfcnpjold) {
            console.log('CPF/CNPJ alterado')
            return
          }
          this.validacao = this.propsValidacao
          if (this.nota.dados_bancarios) {
            if (this.nota.dados_bancarios.fornecedor) {
              this.nota.enderecoFornecedor = this.nota.dados_bancarios.fornecedor.endereco
              this.nota.cepFornecedor = this.nota.dados_bancarios.fornecedor.cep
              this.nota.nomeFornecedor = this.nota.dados_bancarios.fornecedor.nome
              if (this.nota.dados_bancarios.fornecedor.identificador.length >= 14) {
                this.nota.tipoFornecedor = 'Pessoa Jurídica'
                this.nota.cnpjFornecedor = this.nota.dados_bancarios.fornecedor.identificador
                this.onBlurCpfCnpj(this.nota.cnpjFornecedor)
              } else {
                this.nota.tipoFornecedor = 'Pessoa Física'
                this.nota.cpfFornecedor = this.nota.dados_bancarios.fornecedor.identificador
                this.onBlurCpfCnpj(this.nota.cpfFornecedor)
              }
            }
          }
          // Suporte 60841 - Não estava carregando dados da Cidade/UF
          this.loadCityAndState()
          this.$forceUpdate()
        }
      },
      created () {
      },
      mounted () {
        this.nota = _.cloneDeep(this.propsNota)
        this.validacao = _.cloneDeep(this.propsValidacao)
      },
      methods: {
        loadCityAndState () {
          if (this.nota.cepFornecedor === '0') {
            this.nota.cidadeFornecedor = 'CEP inválido.'
            this.nota.estadoFornecedor = ''
            this.$forceUpdate()
          }
          if (this.nota.cepFornecedor) {
            axiosLaravel.get('municipios/cep/' + this.nota.cepFornecedor).then((response) => {
              if (!_.isEmpty(response.data)) {
                if (this.nota.cepFornecedor === '0') {
                  this.nota.cidadeFornecedor = 'Atualize o CEP no cadastro do Fornecedor.'
                  this.nota.estadoFornecedor = ''
                  this.$snotify.warning('Atenção: CEP inválido. Por gentileza atualize o CEP no cadastro do fornecedor.')
                } else {
                  this.nota.cidadeFornecedor = response.data.ds_nome
                  this.nota.estadoFornecedor = response.data.ds_uf
                }
                this.$forceUpdate()
              }
            })
              .catch((error) => {
                if (this.nota.cepFornecedor === 0) {
                  this.nota.cidadeFornecedor = 'CEP inválido.'
                  this.nota.estadoFornecedor = ''
                } else {
                  this.$root.trataErro(error)
                }
              })
          } else {
            this.nota.cidadeFornecedor = ''
            this.nota.estadoFornecedor = ''
            this.$forceUpdate()
          }
        },
        onBlurCpfCnpj (value) {
          if (_.isNull(value) || _.isEmpty(value) || _.isUndefined(value)) {
            return
          } else {
            if (value.length <= 11) {
              this.validoCPF = cpf.isValid(value)
            } else {
              this.validoCPF = cnpj.isValid(value)
            }
          }
          if (this.validoCPF === false) {
            let field = this.$validator.fields.find({ name: 'cpf' })
            field.setFlags({invalid: true})
            this.errors.add({
              field: 'cpf',
              msg: 'O campo CPF/CNPJ está incorreto.',
              id: field.id,
              scope: field.scope
            })
            this.$snotify.error('O campo CPF/CNPJ está incorreto.')
          } else {
            this.bloqueiaCampos = 0
            axiosLaravel.get('consulta/busca-fornecedor/' + value).then((response) => {
              if (!_.isEmpty(response.data)) {
                this.nota.enderecoFornecedor = response.data.EndFor
                this.nota.nomeFornecedor = response.data.NomFor
                this.nota.cepFornecedor = response.data.CepFor
                this.bloqueiaCampos = 1
                this.$forceUpdate()
              }
            })
              .catch((error) => {
                this.$root.trataErro(error)
              })
          }
        }
      }
    }
</script>

<style scoped>

</style>
