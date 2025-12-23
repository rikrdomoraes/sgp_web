<template>

  <div class="box box-widget">
    <div class="box-header with-border">
      <h3 class="box-title">Agência condutora do projeto</h3>
    </div>

    <div class="box-body">
      <div>
        <div class="box-body">
          <div v-show="loading.show" class="overlay"
               style="position: absolute; top: 0px; left: 0px; width: 100%; height: 100%; display: block;">
            <i class="fa fa-refresh fa-spin"></i>
          </div>
          <div class="row">
            <div class="col-md-12 form-horizontal">
              <div class="col-md-4">
                <h2 class="h4" @click="mostrar = false">Agência</h2>

                <!--Agência-->
                <div class="form-group">
                  <div class="form-group required col-md-12" uib-tooltip="Prefixo da Agência"
                       :class="{ 'has-error' : errors.first('agencia')}">
                    <label for="agencia" @click="mostrar = false" class="control-label">Agência:</label>
                    <!--<div v-if="proposta.ds_agencia_nome">-->
                      <!--<span>{{proposta.ds_agencia_nome}}</span>-->
                    <!--</div>-->
                    <div v-if="propsProposta.ds_agencia_nome && mostrar === false">
                      <input v-model="proposta.ds_agencia_nome" name="prefixo" class="form-control" @click="mostrar = true" type="text"  maxlength="255">
                    </div>
                    <div v-else-if="mostrar === true">
                      <multiselect v-model="agenciaSelecionada" :options="agencias" style="font-size: 4px"
                                   :custom-label="numeroNomeAgencia"
                                   placeholder="Selecione uma agência"
                                   label="type" track-by="type"
                                   :preselect-first="false"
                                   selectLabel="Aperte ENTER para selecionar"
                                   deselectLabel="Aperte ENTER para remover"
                                   selectedLabel=""
                                   name="agencia"
                                   v-validate="'required'"
                                   @open="buscaAgencias"
                                   @select="buscaAgencia">
                        <template slot-scope="props"><span class="multiselect__tag"><span>{{ props.option.type }}</span><span class="custom__remove" @click="props.remove(props.option)">❌</span></span></template>
                        <template slot="noOptions"><font color="red">Nenhum registro localizado!</font></template>
                      </multiselect>
                    </div>
                    <span v-if="errors.first('agencia')" class="label label-danger"> {{ errors.first('agencia') }}</span>
                  </div>
                </div>

                <!--CNPJ-->
                <div class="form-group">
                  <div  class="form-group required-field col-md-12" uib-tooltip="CNPJ da Agência"
                        :class="{ 'has-error' : errors.first('CNPJ agência')}">
                    <label for="CNPJ agência" class="control-label">CNPJ:</label>
                    <div>
                      <the-mask v-model="proposta.ds_agencia_cnpj" name="CNPJ agência" id="CNPJ agência" class="form-control"
                                :mask="['##.###.###/####-##']"
                                v-validate="'required|max:255|cnpj'">
                      </the-mask>
                    </div>
                    <span v-if="errors.first('CNPJ agência')" class="label label-danger"> {{ errors.first('CNPJ agência') }}</span>
                  </div>
                </div>

                <!--Endereço da agência-->
                <div class="form-group">
                  <div class="form-group required-field col-md-12"
                       :class="{ 'has-error' : errors.first('endereço da agência')}">
                    <label for="endereço da agência" class="control-label">Endereço da agência:</label>
                    <div>
                      <input v-model="proposta.ds_agencia_endereco" name="endereço da agência" class="form-control" type="text"  maxlength="255"
                             v-validate="'required|max:255'">
                    </div>
                    <span v-if="errors.first('endereço da agência')" class="label label-danger"> {{ errors.first('endereço da agência') }}</span>
                  </div>
                </div>

                <!--Telefone agência-->
                <div class="form-group">
                  <div  class="form-group required-field col-md-12" uib-tooltip="Telefone da agência"
                        :class="{ 'has-error' : errors.first('telefone agência')}">
                    <label for="telefone agência" class="control-label">Telefone da agência:</label>
                    <div >
                      <the-mask v-model="proposta.ds_agencia_telefone"
                                name="telefone agência"
                                id="telefone agência" :mask="['####-####', '(##) ####-####', '(##) #####-####']" class="form-control" type="text"   maxlength="255"
                                v-validate="'required'">
                      </the-mask>
                    </div>
                    <span v-if="errors.first('telefone agência')" class="label label-danger"> {{ errors.first('telefone agência') }}</span>
                  </div>
                </div>

                <!--email agência-->
                <div class="form-group">
                  <div  class="form-group required-field col-md-12" uib-tooltip="E-mail da agência"
                        :class="{ 'has-error' : errors.first('email agência')}">
                    <label for="email agência" class="control-label">E-mail da agência:</label>
                    <div >
                      <input v-model="proposta.ds_agencia_email" name="email agência" class="form-control" type="email" maxlength="255"
                             v-validate="'required|max:255|email'">
                    </div>
                    <span v-if="errors.first('email agência')" class="label label-danger"> {{ errors.first('email agência') }}</span>
                  </div>
                </div>
              </div>

              <div class="col-md-4">
                <h2 class="h4">Gerente</h2>
<!--                <div class="col-md-12">-->

                  <!--Nome do Gerente-->
                  <div class="form-group">
                    <div  class="form-group required-field col-md-12" uib-tooltip="Nome do Gerente"
                          :class="{ 'has-error' : errors.first('nome gerente')}">
                      <label for="nome gerente" class="control-label">Nome do Gerente:</label>
                      <div>
                        <input v-model="proposta.ds_gerente_nome" name="nome gerente" id="nome gerente" class="form-control" type="text" maxlength="255"
                               v-validate="'required|max:255'">
                      </div>
                      <span v-if="errors.first('nome gerente')" class="label label-danger"> {{ errors.first('nome gerente') }}</span>
                    </div>
                  </div>


                  <!--profissão do gerente-->
                  <div class="form-group">
                    <div  class="form-group required-field col-md-12" uib-tooltip="Profissão do Gerente"
                          :class="{ 'has-error' : errors.first('profissão do gerente')}">
                      <label for="profissão do gerente" class="control-label">Profissão:</label>
                      <div name="proposal.managerOccupation" approval="propSimpleCtrl.approval" state="propSimpleCtrl.approvalState">
                        <input v-model="proposta.ds_gerente_profissao" name="profissão do gerente" id="profissão do gerente" class="form-control" type="text" maxlength="255"
                               v-validate="'required|max:255'">
                      </div>
                      <span v-if="errors.first('profissão do gerente')" class="label label-danger"> {{ errors.first('profissão do gerente') }}</span>
                    </div>
                  </div>

                  <!--uf gerente-->
                  <div class="form-group">
                    <div class="form-group required-field col-md-12"
                         :class="{ 'has-error' : errors.first('uf gerente')}">
                      <label for="uf gerente" class="control-label"> UF: </label>
                      <div >
                        <select v-model="proposta.ds_gerente_uf"
                                class="form-control" name="uf gerente" id="uf gerente" v-validate="'required'">
                          <option :value="proposta.ds_gerente_uf" :selected="proposta.ds_gerente_uf">{{proposta.ds_gerente_uf}}</option>
                          <option value="AC">AC</option>
                          <option value="AL">AL</option>
                          <option value="AM">AM</option>
                          <option value="AP">AP</option>
                          <option value="BA">BA</option>
                          <option value="CE">CE</option>
                          <option value="DF">DF</option>
                          <option value="ES">ES</option>
                          <option value="GO">GO</option>
                          <option value="MA">MA</option>
                          <option value="MG">MG</option>
                          <option value="MS">MS</option>
                          <option value="MT">MT</option>
                          <option value="PA">PA</option>
                          <option value="PB">PB</option>
                          <option value="PE">PE</option>
                          <option value="PI">PI</option>
                          <option value="PR">PR</option>
                          <option value="RJ">RJ</option>
                          <option value="RN">RN</option>
                          <option value="RO">RO</option>
                          <option value="RR">RR</option>
                          <option value="RS">RS</option>
                          <option value="SC">SC</option>
                          <option value="SE">SE</option>
                          <option value="SP">SP</option>
                          <option value="TO">TO</option>
                        </select>
                      </div>
                      <span v-if="errors.first('uf gerente')" class="label label-danger"> {{ errors.first('uf gerente') }}</span>
                    </div>
                  </div>

                  <!--cidade do gerente-->
                  <div class="form-group">
                    <div  class="form-group required-field col-md-12" uib-tooltip="Cidade do Gerente"
                          :class="{ 'has-error' : errors.first('cidade do gerente')}">
                      <label for="cidade do gerente" class="control-label">Cidade:</label>
                      <div>
                        <input v-model="proposta.ds_gerente_cidade" name="cidade do gerente" id="cidade do gerente" class="form-control" type="text" maxlength="255"
                               v-validate="'required|max:255'">
                      </div>
                      <span v-if="errors.first('cidade do gerente')" class="label label-danger"> {{ errors.first('cidade do gerente') }}</span>
                    </div>
                  </div>

                  <!--estado civil gerente-->
                  <div class="form-group">
                    <div class="form-group required-field col-md-12"
                         :class="{ 'has-error' : errors.first('estado civil gerente')}">
                      <label for="estado civil gerente" class="control-label">Estado Civil:</label>
                      <div>
                        <select v-model="proposta.ds_gerente_estado_civil" name="estado civil gerente" id="estado civil gerente" class="form-control"
                                v-validate="'required'">
                          <option :value="proposta.ds_gerente_estado_civil" :selected="proposta.ds_gerente_estado_civil">{{proposta.ds_gerente_estado_civil}}</option>
                          <option value="SOLTEIRO">Solteiro(a)</option>
                          <option value="CASADO">Casado(a)</option>
                          <option value="DIVORCIADO">Divorciado(a)</option>
                          <option value="VIUVO">Viúvo(a)</option>
                        </select>
                      </div>
                      <span v-if="errors.first('estado civil gerente')" class="label label-danger"> {{ errors.first('estado civil gerente') }}</span>
                    </div>
                  </div>

                  <!--CPF gerente-->
                  <div class="form-group">
                    <div class="form-group required-field col-md-12"
                         :class="{ 'has-error' : errors.first('CPF gerente')}">
                      <label for="managerCpf" class="control-label"> CPF: </label>
                      <div >
                        <the-mask v-model="proposta.ds_gerente_cpf" name="CPF gerente" id="CPF gerente"  :mask="['###.###.###-##']" class="form-control"
                                  v-validate="'required|max:11|cpf'">
                        </the-mask>
                      </div>
                      <span v-if="errors.first('CPF gerente')" class="label label-danger"> {{ errors.first('CPF gerente') }}</span>
                    </div>
                  </div>
                </div>
              <div class="col-md-4">
                <h2 class="h4">Funcionário agência</h2>
                <div class="col-md-12" >

                  <!--matrícula do funcionário-->
                  <div class="form-group">
                    <div class="form-group required-field col-md-12"
                         :class="{ 'has-error' : errors.first('matrícula do funcionário')}">
                      <label for="matrícula do funcionário" class="control-label"> Matrícula do funcionário: </label>
                      <div >
                        <the-mask v-model="proposta.ds_funcionario_matricula" name="matrícula do funcionário" class="form-control"
                                  @change.native="selectFuncionario(proposta.ds_funcionario_matricula)"
                                  placeholder="Insira a matricula. Somente números e sem dígito."
                                  :mask="'#######'"
                                  v-validate="'required|length:7'">
                        </the-mask>
                      </div>
                      <span v-if="errors.first('matrícula do funcionário')" class="label label-danger"> {{ errors.first('matrícula do funcionário') }}</span>
                    </div>
                  </div>

                  <!--funcionário responsável-->
                  <div class="form-group">
                    <div class="form-group required-field col-md-12"
                         :class="{ 'has-error' : errors.first('funcionário responsável')}">
                      <label for="funcionário responsável" class="control-label"> Funcionário responsável pelo projeto: </label>
                      <div>
                        <input v-model="proposta.ds_funcionario_nome" name="funcionário responsável" class="form-control" type="text" maxlength="255"
                               v-validate="'required|max:255'">
                      </div>
                      <span v-if="errors.first('funcionário responsável')" class="label label-danger"> {{ errors.first('funcionário responsável') }}</span>
                    </div>
                  </div>

                  <!--telefone do funcionário-->
                  <div class="form-group">
                    <div class="form-group required-field col-md-12"
                         :class="{ 'has-error' : errors.first('telefone do funcionário')}">
                      <label for="telefone do funcionário" class="control-label"> Telefone fixo: </label>
                      <div>
                        <the-mask v-model="proposta.ds_funcionario_telefone" :mask="['(##) ####-####', '(##) #####-####']" name="telefone do funcionário" class="form-control" type="text"
                                  v-validate="'required'">
                        </the-mask>
                      </div>
                      <span v-if="errors.first('telefone do funcionário')" class="label label-danger"> {{ errors.first('telefone do funcionário') }}</span>
                    </div>
                  </div>

                  <!--e-mail funcionário-->
                  <div class="form-group">
                    <div  class="form-group required col-md-12">
<!--                          :class="{ 'has-error' : errors.first('e-mail funcionário')}"-->
                      <label for="e-mail funcionário" class="control-label"> E-mail do funcionário: </label>
                      <div>
                        <input v-model="proposta.ds_funcionario_email" name="e-mail funcionário" id="e-mail funcionário" class="form-control"
                               type="email"
                        >
                        <!--                               v-validate="'required|max:255|email'"-->
                      </div>
<!--                      <span v-if="errors.first('e-mail funcionário')" class="label label-danger"> {{ errors.first('e-mail funcionário') }}</span>-->
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

</template>

<script>
  /* eslint-disable camelcase */
    export default {
      name: 'agencia-condutora-projeto',
      data () {
        return {
          agencias: [],
          loading: {
            show: false
          },
          mostrar: true,
          agenciaSelecionada: [],
          proposta: {}
        }
      },
      inject: ['$validator'],
      provide () {
        return {
          $validator: this.$validator
        }
      },
      props: ['propsProposta'],
      mounted () {
        this.proposta = this.propsProposta
        if (this.propsProposta.ds_agencia_nome) {
          this.mostrar = false
        }
      },
      watch: {
        propsProposta () {
          this.proposta = this.propsProposta
          if (this.propsProposta.ds_agencia_nome) {
            this.mostrar = false
          }
          // this.buscaAgencias
          // this.buscaAgencia
          // if (this.proposta.ds_agencia_nome) {
          //   this.buscaAgencias(this.proposta.ds_agencia_nome)
          //   this.agenciaSelecionada = this.agencias
          // }
        }
      },
      methods: {
        buscaAgencias (searchQuery) {
          let filter = null
          if (searchQuery) {
            filter = searchQuery
          }
          this.loading.show = true
          axiosLaravel.get('agencias/', filter).then(async(response) => {
            console.log('response.data', response.data)
            this.agencias = response.data
            this.loading.show = false
          })
            .catch((error) => {
              console.log('error', error)
              this.$root.trataErro(error)
              this.loading.show = false
            })
        },
        buscaAgencia (agencia) {
          let parm = ''
          if (agencia === undefined || agencia === 'undefined') {
            parm = this.propsProposta.ds_agencia_nome
          } else {
            parm = agencia.ds_codigo_agencia
          }
          console.log('agencia.ds_codigo_agencia', parm)
          axiosLaravel.get('agencia/' + parm).then((response) => {
            let agencia = response.data
            this.proposta.ds_agencia_endereco = agencia.logradouro
            this.proposta.ds_agencia_cnpj = agencia.cnpj
            this.proposta.ds_agencia_email = agencia.CodAge.substr(0, agencia.CodAge.indexOf('-')) + '@BB.COM.BR'
            this.proposta.ds_agencia_nome = agencia.CodAge.substr(0, agencia.CodAge.indexOf('-'))
            this.proposta.ds_agencia_telefone = agencia.ddd + '' + agencia.fone
            this.proposta.ds_gerente_cidade = agencia.nome1
            this.proposta.ds_gerente_estado_civil = agencia.ec_adm
            this.proposta.ds_gerente_cpf = agencia.cpf
            this.proposta.ds_gerente_nome = agencia.nome
            this.proposta.ds_gerente_nacionalidade = 'Brasileiro'
            this.proposta.ds_gerente_profissao = 'Bancário'
            this.proposta.ds_gerente_rg = agencia.rg_adm.split(' - ')[0]
            this.proposta.ds_gerente_orgao_emissor = agencia.rg_adm.split(' - ')[1]
            this.proposta.ds_gerente_rg_uf = agencia.rg_adm.split(' - ')[2].replace(/\s/g, '')
            this.proposta.ds_gerente_uf = agencia.uf
            // console.log('agenciaSelecionada', this.agenciaSelecionada)
            // this.$emit('agenciaSelecionada', this.proposta)
            this.$forceUpdate()
          })
            .catch((error) => {
              console.log('error', error)
              // this.$root.trataErro(error)
              this.$snotify.error('Erro ao localizar agência!')
              this.proposta.ds_agencia_endereco = ''
              this.proposta.ds_agencia_cnpj = ''
              this.proposta.ds_agencia_email = ''
              this.proposta.ds_agencia_nome = ''
              this.proposta.ds_agencia_telefone = ''
              this.proposta.ds_gerente_cidade = ''
              this.proposta.ds_gerente_estado_civil = ''
              this.proposta.ds_gerente_cpf = ''
              this.proposta.ds_gerente_nome = ''
              this.proposta.ds_gerente_nacionalidade = ''
              this.proposta.ds_gerente_profissao = ''
              this.proposta.ds_gerente_rg = ''
              this.proposta.ds_gerente_orgao_emissor = ''
              this.proposta.ds_gerente_rg_uf = ''
              this.proposta.ds_gerente_uf = ''
            })
        },
        numeroNomeAgencia ({ ds_codigo_agencia, ds_nome }) {
          return `${ds_codigo_agencia} / ${ds_nome}`
        },
        selectFuncionario (matricula) {
          axiosLaravel.get('funci/' + matricula).then((response) => {
            console.log('response.data', response.data)
            let funcionario = response.data
            this.proposta.ds_funcionario_nome = funcionario.nome
            this.proposta.ds_funcionario_telefone = funcionario.ddd + '' + funcionario.fone
            this.proposta.ds_funcionario_email = 'F' + funcionario.matr_func + '@bb.com.br'
            this.$forceUpdate()
          })
            .catch((error) => {
              this.$root.trataErro(error)
            })
        }
      }
    }
</script>

<style scoped>

</style>
