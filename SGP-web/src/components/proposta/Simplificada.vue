<template>
    <div class="content-wrapper" style="min-height: 870px;">
        <div ng-view="" class="fade-transition ng-scope" style=""><!-- content header (page header) -->
        <section class="content-header ng-scope">
          <h1>Proposta Simplificada </h1>
          <b-breadcrumb :items="[{
          text: 'Inicial',
          href: '/'
          }, {
          text: 'Cadastro',
          href: '#'
          }, {
          text: 'Perfis',
          active: true
          }]"/>
        </section>

        <!-- main content -->
        <section class="content ng-scope">

          <div class="row">
            <div class="col-md-12">
             <div class="ng-scope ng-isolate-scope"><div class="box box-primary">
                  <div class="box-header with-border">
                    <h3 class="box-title"><i class="fa fa-pencil" aria-hidden="true"></i> Cadastro da Proposta Simplificada</h3>
                    <div class="row">
                  <div class="col-md-6">
                    <br>
                    <h3 class="box-title"><i class="fa fa-caret-right" aria-hidden="true"></i> Processo: </h3>
                    <select class="form-control ng-pristine ng-untouched ng-valid ng-empty" id="processo" name="processo" v-model="processos.simplifiedNumber" @change="escolhido">
                      <option value=""></option>
                      <option v-for="processo in processos" :value="processo">{{processo.simplifiedNumber}}</option>
                    </select>
                    <span v-if="errors.first('simplificado')" class="label label-danger"> {{ errors.first('simplificado') }}</span>
                  </div>
                </div>
              </div>

              <div class="box-body" v-if="procSelecionado">
                <div class="row">
                  <div class="col-md-12 form-horizontal">
                    <h2 class="h4">Projeto</h2>

                    <!--Nome do projeto-->
                    <div class="col-md-6">
                      <div class="form-group">
                        <div class="form-group required-field col-md-12"
                             :class="{ 'has-error' : errors.first('nome da proposta')}">
                          <label for="nome da proposta" class="control-label">Nome do Projeto:</label>
                          <div>
                            <input v-model="propostaSimplificada.name" name="nome da proposta" id="nome da proposta" class="form-control" type="text"
                                   v-validate="'required|max:255'">
                          </div>
                          <span v-if="errors.first('nome da proposta')" class="label label-danger"> {{ errors.first('nome da proposta') }}</span>
                        </div>
                      </div>
                    </div>

                    <!--Investimento previsto-->
                    <div class="col-md-6">
                      <div class="form-group">
                        <div class="form-group required-field col-md-12"
                             :class="{ 'has-error' : errors.first('investimento previsto')}">
                          <label for="investimento previsto" class="control-label">Investimento Previsto:</label>
                          <div name="investimento previsto" approval="propSimpleCtrl.approval" state="propSimpleCtrl.approvalState">
                            <money v-model="propostaSimplificada.investment" name="investimento previsto" id="investimento previsto" class="form-control text-right" maxlength="20" type="text"
                                   v-validate="'required|max:20'"></money>
                          </div>
                          <span v-if="errors.first('investimento previsto')" class="label label-danger"> {{ errors.first('investimento previsto') }}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <br />

                <div class="row">
                  <div class="col-md-12 form-horizontal">
                    <h2 class="h4">Agência condutora do projeto</h2>
                    <div class="col-md-3">
                      <h2 class="h4">Agência</h2>

                      <!--Agência-->
                        <div class="form-group">
                          <div class="form-group required col-md-12" uib-tooltip="Prefixo da Agência"
                               :class="{ 'has-error' : errors.first('agencia')}">
                            <label for="agencia" class="control-label">Agência:</label>
                            <div>
                              <multiselect v-model="agenciaSelecionada" :options="agencias" style="font-size: 4px"
                                           :custom-label="numeroNomeAgencia"
                                           placeholder="Selecione uma agência"
                                           label="type" track-by="type"
                                           :preselect-first="false"
                                           selectLabel="Aperte ENTER para selecionar"
                                           deselectLabel="Aperte ENTER para remover"
                                           selectedLabel=""
                                           name="agencia"
                                           @search-change="buscaAgencias"
                                           v-validate="'required'"
                                           @blur.native="buscaAgencia(agenciaSelecionada.code)">
                                <template slot-scope="props"><span class="multiselect__tag"><span>{{ props.option.type }}</span><span class="custom__remove" @click="props.remove(props.option)">❌</span></span></template>
                                <span slot="noResult"><font color="red">Nenhum registro localizado!</font></span>
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
                              <the-mask v-model="propostaSimplificada.agencyCNPJ" name="CNPJ agência" id="CNPJ agência" class="form-control"
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
                              <input v-model="propostaSimplificada.agencyAddress" name="endereço da agência" class="form-control" type="text"  maxlength="255"
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
                              <the-mask v-model="propostaSimplificada.agencyPhone"
                                        name="telefone agência"
                                        id="telefone agência" :mask="['(##) ####-####', '(##) #####-####']" class="form-control" type="text"   maxlength="255"
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
                              <input v-model="propostaSimplificada.agencyEmail" name="email agência" class="form-control" type="email" maxlength="255"
                                     v-validate="'required|max:255|email'">
                            </div>
                            <span v-if="errors.first('email agência')" class="label label-danger"> {{ errors.first('email agência') }}</span>
                          </div>
                        </div>
                      </div>

                    <div class="col-md-6">
                      <h2 class="h4">Gerente</h2>
                      <div class="col-md-6">

                        <!--Nome do Gerente-->
                        <div class="form-group">
                          <div  class="form-group required-field col-md-12" uib-tooltip="Nome do Gerente"
                                :class="{ 'has-error' : errors.first('nome gerente')}">
                            <label for="nome gerente" class="control-label">Nome do Gerente:</label>
                            <div>
                              <input v-model="propostaSimplificada.managerName" name="nome gerente" id="nome gerente" class="form-control" type="text" maxlength="255"
                                     v-validate="'required|max:255'">
                            </div>
                            <span v-if="errors.first('nome gerente')" class="label label-danger"> {{ errors.first('nome gerente') }}</span>
                          </div>
                        </div>

                        <!--nacionalidade do gerente-->
                        <div class="form-group">
                          <div  class="form-group required-field col-md-12" uib-tooltip="Nacionalidade do Gerente"
                                :class="{ 'has-error' : errors.first('nacionalidade do gerente')}">
                            <label for="nacionalidade do gerente" class="control-label">Nacionalidade:</label>
                            <div>
                              <input v-model="propostaSimplificada.managerNationality" name="nacionalidade do gerente" id="nacionalidade do gerente" class="form-control" type="text"  maxlength="255"
                                     v-validate="'required|max:255'">
                            </div>
                            <span v-if="errors.first('nacionalidade do gerente')" class="label label-danger"> {{ errors.first('nacionalidade do gerente') }}</span>
                          </div>
                        </div>

                        <!--profissão do gerente-->
                        <div class="form-group">
                          <div  class="form-group required-field col-md-12" uib-tooltip="Profissão do Gerente"
                                :class="{ 'has-error' : errors.first('profissão do gerente')}">
                            <label for="profissão do gerente" class="control-label">Profissão:</label>
                            <div name="proposal.managerOccupation" approval="propSimpleCtrl.approval" state="propSimpleCtrl.approvalState">
                              <input v-model="propostaSimplificada.managerOccupation" name="profissão do gerente" id="profissão do gerente" class="form-control" type="text" maxlength="255"
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
                              <select v-model="propostaSimplificada.managerUf"
                                      class="form-control" name="uf gerente" id="uf gerente" v-validate="'required'">
                                <option :value="propostaSimplificada.managerUf" :selected="propostaSimplificada.managerUf">{{propostaSimplificada.managerUf}}</option>
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
                              <input v-model="propostaSimplificada.managerCity" name="cidade do gerente" id="cidade do gerente" class="form-control" type="text" maxlength="255"
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
                              <select v-model="propostaSimplificada.managerCivilStatus" name="estado civil gerente" id="estado civil gerente" class="form-control"
                                      v-validate="'required'">
                                <option :value="propostaSimplificada.managerCivilStatus" :selected="propostaSimplificada.managerCivilStatus">{{propostaSimplificada.managerCivilStatus}}</option>
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
                              <the-mask v-model="propostaSimplificada.managerCpf" name="CPF gerente" id="CPF gerente"  :mask="['###.###.###-##']" class="form-control"
                                        v-validate="'required|max:11|cpf'">
                              </the-mask>
                            </div>
                            <span v-if="errors.first('CPF gerente')" class="label label-danger"> {{ errors.first('CPF gerente') }}</span>
                          </div>
                        </div>
                      </div>

                      <!--número rg-->
                      <div class="col-md-6">
                        <div class="form-group">
                          <div  class="form-group required-field col-md-12"
                                :class="{ 'has-error' : errors.first('número rg')}">
                            <label for="número rg" class="control-label"> Número do RG: </label>
                            <div >
                              <input v-model="propostaSimplificada.managerRg" name="número rg" id="número rg" class="form-control" type="text"  maxlength="255"
                                     v-validate="'required|max:255'">
                            </div>
                            <span v-if="errors.first('número rg')" class="label label-danger"> {{ errors.first('número rg') }}</span>
                          </div>
                        </div>

                        <!--orgão emissor-->
                        <div class="form-group">
                          <div  class="form-group required-field col-md-12"
                                :class="{ 'has-error' : errors.first('orgão emissor')}">
                            <label for="orgão emissor" class="control-label"> Orgão Emissor: </label>
                            <div >
                              <input v-model="propostaSimplificada.managerRgIssuer" name="orgão emissor" id="orgão emissor" class="form-control" type="text" maxlength="255"
                                     v-validate="'required|max:255'">
                            </div>
                            <span v-if="errors.first('orgão emissor')" class="label label-danger"> {{ errors.first('orgão emissor') }}</span>
                          </div>
                        </div>

                        <!--uf RG-->
                        <div class="form-group">
                          <div class="form-group required-field col-md-12"
                               :class="{ 'has-error' : errors.first('uf RG')}">
                            <label for="uf RG" class="control-label"> UF: </label>
                            <div>
                              <select v-model="propostaSimplificada.managerRgUF"
                                      class="form-control" name="uf RG" id="uf RG" v-validate="'required'">
                                <option :value="propostaSimplificada.managerRgUF" :selected="propostaSimplificada.managerRgUF">{{propostaSimplificada.managerRgUF}}</option>
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
                            <span v-if="errors.first('uf RG')" class="label label-danger"> {{ errors.first('uf RG') }}</span>
                          </div>
                        </div>
                      </div>
                      </div>

                    <div class="col-md-3">
                      <h2 class="h4">Funcionário agência</h2>
                      <div class="col-md-12" >

                        <!--matrícula do funcionário-->
                        <div class="form-group">
                          <div class="form-group required-field col-md-12"
                               :class="{ 'has-error' : errors.first('matrícula do funcionário')}">
                            <label for="matrícula do funcionário" class="control-label"> Matrícula do funcionário: </label>
                            <div >
                              <the-mask v-model="propostaSimplificada.employeeRegistration" name="matrícula do funcionário" class="form-control"
                                        @blur.native="selectFuncionario(propostaSimplificada.employeeRegistration)"
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
                              <input v-model="propostaSimplificada.employeeName" name="funcionário responsável" class="form-control" type="text" maxlength="255"
                                     v-validate="'required|max:255'">
                            </div>
                            <span v-if="errors.first('funcionário responsável')" class="label label-danger"> {{ errors.first('funcionário responsável') }}</span>
                          </div>
                        </div>

                        <!--telefone do funcionário-->
                        <div class="form-group">
                          <div class="form-group required col-md-12"
                               :class="{ 'has-error' : errors.first('telefone do funcionário')}">
                            <label for="telefone do funcionário" class="control-label"> Telefone fixo: </label>
                            <div>
                              <the-mask v-model="propostaSimplificada.employeePhone" :mask="['(##) ####-####', '(##) #####-####']" name="telefone do funcionário" class="form-control" type="text"
                                       v-validate="'required'">
                              </the-mask>
                            </div>
                            <span v-if="errors.first('telefone do funcionário')" class="label label-danger"> {{ errors.first('telefone do funcionário') }}</span>
                          </div>
                        </div>

                        <!--e-mail funcionário-->
                        <div class="form-group">
                          <div  class="form-group required col-md-12"
                                :class="{ 'has-error' : errors.first('e-mail funcionário')}">
                            <label for="e-mail funcionário" class="control-label"> E-mail do funcionário: </label>
                            <div>
                              <input v-model="propostaSimplificada.employeeEmail" name="employeeEmail" id="e-mail funcionário" class="form-control"
                                     type="email" v-validate="'required|max:255|email'">
                            </div>
                            <span v-if="errors.first('e-mail funcionário')" class="label label-danger"> {{ errors.first('e-mail funcionário') }}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    </div>
                </div>

                <div class="row">
                  <div class="col-md-12">
                    <h2 class="h4">Informações</h2>
                    <div class="col-md-6">

                      <!--locais de execução do projeto-->
                      <div class="form-group">
                        <div class="form-group required-field col-md-12"
                             :class="{ 'has-error' : errors.first('locais de execução do projeto')}">
                          <label for="locais de execução do projeto" class="control-label"> Locais de execução do projeto: </label>
                          <div class="ng-isolate-scope">
                            <textarea v-model="propostaSimplificada.executePlaces" name="locais de execução do projeto" id="locais de execução do projeto" class="form-control" rows="3"
                                      v-validate="'required'"></textarea>
                          </div>
                          <span v-if="errors.first('locais de execução do projeto')" class="label label-danger"> {{ errors.first('locais de execução do projeto') }}</span>
                        </div>
                      </div>

                      <!--objetivo geral-->
                      <div class="form-group">
                        <div class="form-group required-field col-md-12" :class="{ 'has-error' : errors.first('objetivo geral')}">
                          <label for="objetivo geral" class="control-label"> Objetivo Geral: </label>
                          <div class="ng-isolate-scope">
                            <textarea v-model="propostaSimplificada.generalObjective" name="objetivo geral" id="objetivo geral"
                                      class="form-control" rows="3" v-validate="'required'"></textarea>
                          </div>
                          <span v-if="errors.first('objetivo geral')" class="label label-danger"> {{ errors.first('objetivo geral') }}</span>
                        </div>
                      </div>
                    </div>
                    <div class="col-md-6">
                      <!--objetivo-->
                      <div class="form-group">
                        <div class="form-group required-field col-md-12"
                             :class="{ 'has-error' : errors.first('objetivo')}">
                          <label for="infoObjectives" class="control-label"> Objetivo: </label>
                          <div class="ng-isolate-scope">
                            <textarea v-model="propostaSimplificada.infoObjectives" name="objetivo" id="objetivo" class="form-control " rows="3"
                                      v-validate="'required'"></textarea>
                          </div>
                          <span v-if="errors.first('objetivo')" class="label label-danger"> {{ errors.first('objetivo') }}</span>
                        </div>
                      </div>
                      <!--resumo-->
                      <div class="form-group">
                        <div class="form-group required-field col-md-12"
                             :class="{ 'has-error' : errors.first('resumo')}">
                          <label for="resumo" class="control-label"> Resumo: </label>
                          <div class="ng-isolate-scope">
                            <textarea v-model="propostaSimplificada.summary" name="resumo" id="resumo" class="form-control" rows="3"
                                      v-validate="'required'"></textarea>
                          </div>
                          <span v-if="errors.first('resumo')" class="label label-danger"> {{ errors.first('resumo') }}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="row">
                  <div class="col-md-12">
                    <h2 class="h4">Número de Participantes</h2>
                    <div class="col-md-6">
                      <!--participantes diretos-->
                      <div class="form-group">
                        <div class="form-group required col-md-12"
                             :class="{ 'has-error' : errors.first('participantes diretos')}">
                          <label for="participantes diretos" class="control-label"> Participantes diretos: </label>
                          <div>
                            <input v-model="propostaSimplificada.participants" name="participantes diretos" id="participantes diretos"
                                   class="form-control text-right" type="number"
                                   v-validate="'required|min_value:1'">
                          </div>
                          <span v-if="errors.first('participantes diretos')" class="label label-danger"> {{ errors.first('participantes diretos') }}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <br />
                <!--Publico alvo-->
                <div class="col-md-12 form-horizontal">
                  <div class="box box-widget">
                    <div class="box-header">
                      <h3 class="box-title">Público-alvo</h3>
                    </div>
                  </div>
                  <publico-alvo :propsPublicosGrid="propostaSimplificada.audiences" @publicoAlvoAdicionado="propostaSimplificada.audiences = $event"></publico-alvo>
                </div>

                <!--Documentos-->
                <div class="col-md-12 form-horizontal">
                  <div class="box box-widget">
                    <div class="box-header">
                      <h3 class="box-title">Documentos Upload</h3>
                    </div>
                  </div>
                  <upload-documentos :propDocumentos="propostaSimplificada.documents" :documentTypes="documentos" :documentosObrigatorios="documentosObrigatorios" @documentoAtualizado="propostaSimplificada.documents = $event"></upload-documentos>
                </div>

                <!--Declaração de Adimplência e Inexistência de Outras Fontes:-->
                <div class="col-md-12 form-horizontal">
                  <div class="box box-widget">
                    <div class="box-header">
                      <h3 class="box-title">Declaração de Adimplência e Inexistência de Outras Fontes:</h3>
                    </div>
                  </div>
                  <upload-documentos :propDocumentos="propostaSimplificada.documentStatements" :documentTypes="adimplencia" :documentosObrigatorios="''" @documentoAtualizado="propostaSimplificada.documentStatements = $event"></upload-documentos>
                </div>

                <!-- buttons -->
                <div class="col-md-12">
                  <g-button-moema color="success" size="button--size-ss" @click.native="onConclude"><i class="fa fa-check-circle-o" aria-hidden="true"></i> Concluir</g-button-moema>
                  <g-button-moema color="warning" size="button--size-ss" @click.native="$router.go(-1)"><i class="fa fa-chevron-circle-left" aria-hidden="true"></i> Voltar à lista</g-button-moema>
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
    import PublicoAlvo from '../modules/publicoAlvo'
    import UploadDocumentos from '../modules/uploadDocumentos'
    import { mapGetters } from 'vuex'

    export default {
      components: {
        UploadDocumentos,
        PublicoAlvo},
      name: 'simplificada',
      data () {
        return {
          entity: {},
          procSelecionado: null,
          processoSimplificado: null,
          simplificados: [],
          simplificado: [],
          configuracoes: {},
          propostaSimplificada: {
            documents: [],
            documentStatements: [],
            audiences: []
          },
          filtros: {
            beginAdded: null,
            beginAddedDate: null,
            endAddedDate: null,
            beginInactivateDate: null,
            endInactivateDate: null,
            type: null
          },
          agencias: [],
          processos: [],
          processo: [],
          agenciaSelecionada: null,
          documentos: [],
          documentosObrigatorios: ['Memória de cálculo', 'Declaração'],
          adimplenciaObrigatoria: ['Declaração de Adimplência e Inexistência de outras fontes']
        }
      },
      created () {
        this.buscaSimplificado()
        this.buscaEntidade()
        this.buscaConfiguracoes()
        this.buscaAgencias()
        this.buscaDocumentos()
        this.buscaTodosDctos()
      },
      computed: {
        ...mapGetters([
          'usuarioLogado'
        ])
      },
      watch: {
        agenciaSelecionada () {
          this.propostaSimplificada.agencyName = this.agenciaSelecionada.name
          this.buscaAgencia(this.agenciaSelecionada.code)
        }
      },
      methods: {
        buscaEntidade () {
          axios.get('proxy/account/entities/' + this.$route.params.id).then((response) => {
            this.entity = response.data.value
          })
            .catch((error) => {
              this.$root.trataErro(error)
            })
        },
        buscaConfiguracoes () {
          axios.get('proxy/account/config/general-system-config').then((response) => {
            this.configuracoes = response.data.value
          })
            .catch((error) => {
              this.$root.trataErro(error)
            })
        },
        buscaAgencias (searchQuery) {
          let filter = null
          if (searchQuery) {
            filter = searchQuery
          }
          axios.post('proxy/account/agencies/tiny/list', filter).then((response) => {
            this.agencias = response.data.value
          })
            .catch((error) => {
              this.$root.trataErro(error)
            })
        },
        numeroNomeAgencia ({ code, name }) {
          return `${code} / ${name}`
        },
        selectFuncionario (matricula) {
          axios.post('proxy/project/proposal/search/func/' + matricula).then((response) => {
            let funcionario = response.data.value[0]
            this.propostaSimplificada.employeeName = funcionario.NomeFunc
            this.propostaSimplificada.employeePhone = funcionario.DddAge + funcionario.TelAge
            this.propostaSimplificada.employeeEmail = 'F' + funcionario.MatrFunc + '@bb.com.br'
            this.$forceUpdate()
          })
            .catch((error) => {
              this.$root.trataErro(error)
            })
        },
        buscaSimplificado () {
          axios.get('proxy/document/simplified/active/list').then((response) => {
            this.processos = response.data.value
          })
            .catch((error) => {
              this.$root.trataErro(error)
            })
        },
        escolhido () {
          this.procSelecionado = this.processos.simplifiedNumber.simplifiedNumber
          this.propostaSimplificada.simplified = this.processos.simplifiedNumber.id
        },
        buscaAgencia (agencia) {
          axios.post('proxy/project/proposal/search/agencia/' + agencia).then((response) => {
            let agencia = response.data.value[0]
            this.propostaSimplificada.agencyAddress = agencia.EndAge
            this.propostaSimplificada.agencyCNPJ = agencia.CnpjAge
            this.propostaSimplificada.agencyEmail = agencia.CodAge.substr(0, agencia.CodAge.indexOf('-')) + '@BB.COM.BR'
            this.propostaSimplificada.agencyName = agencia.NomAge
            this.propostaSimplificada.agencyPhone = agencia.TelAge
            this.propostaSimplificada.managerCity = agencia.MunGer
            this.propostaSimplificada.managerCivilStatus = agencia.EcGer
            this.propostaSimplificada.managerCpf = agencia.CpfGer
            this.propostaSimplificada.managerName = agencia.NomGer
            this.propostaSimplificada.managerNationality = 'Brasileiro'
            this.propostaSimplificada.managerOccupation = 'Bancário'
            this.propostaSimplificada.managerRg = agencia.RgGer.split(' - ')[0]
            this.propostaSimplificada.managerRgIssuer = agencia.RgGer.split(' - ')[1]
            this.propostaSimplificada.managerRgUF = agencia.RgGer.split(' - ')[2].replace(/\s/g, '')
            this.propostaSimplificada.managerUf = agencia.UfGer

            this.$forceUpdate()
          })
            .catch((error) => {
              console.log('error', error)
              this.$root.trataErro(error)
            })
        },
        buscaDocumentos () {
          axios.get('proxy/account/config/general-system-config').then((response) => {
            this.documentos = response.data.value.proposalConfig.documentTypes
          })
            .catch((error) => {
              this.$root.trataErro(error)
            })
        },
        buscaTodosDctos () {
          this.filtros.type = 'Declaração de Adimplência e Inexistência de outras fontes'
          axios.post('proxy/document/documents/type/search', this.filtros).then((response) => {
            this.adimplencia = response.data.value
            this.totalRows = this.items.length
            this.loading.show = false
            this.filtros = {}
          })
            .catch((error) => {
              this.$root.trataErro(error)
            })
        },
        // Valida se todos os documentos foram adicionados
        verificaDocumentosCarregados () {
          if (this.propostaSimplificada.documents.length === this.documentos.length) {
            return true
          } else {
            return false
          }
          // if (!this.propostaSimplificada.documents) {
          //   return false
          // }
          // let documentosCarregados = this.propostaSimplificada.documents.map((item) => {
          //   console.log('item', item)
          //   console.log('documentosCarregados', documentosCarregados)
          //   return item.documentType.type
          // })
          // return _.isEqual(this.documentosObrigatorios.sort(), documentosCarregados.sort())
        },
        validaPublicoAlvo () {
          if (this.propostaSimplificada.audiences && this.propostaSimplificada.audiences.length > 0) {
            return true
          } else {
            return false
          }
        },
        verificaDeclaracaoAdimplencia () {
          if (this.propostaSimplificada.documentStatements.length > 0) {
            return true
          } else {
            return false
          }
        },
        onConclude () {
          if (!this.verificaDeclaracaoAdimplencia()) { // Valida se os documentos obrigatórios foram enviados
            this.$snotify.error('Existe Declaração de Adimplência pendentes!')
            return
          }
          if (!this.validaPublicoAlvo()) { // Valida se publico alvo
            this.$snotify.error('É obrigatório o preenchimento do público-alvo!')
            return
          }
          if (!this.verificaDocumentosCarregados()) { // Valida se os documentos obrigatórios foram enviados
            this.$snotify.error('Existem documentos pendentes')
            return
          }
          this.$validator.validateAll().then((result) => {
            if (result) {
              this.propostaSimplificada.documentTypes = this.documentos
              this.propostaSimplificada.createdBy = this.usuarioLogado
              this.propostaSimplificada.entity = this.entity
              this.propostaSimplificada.proposalPhase = 'CADASTRO'
              axios.post('proxy/project/proposal/simplified', this.propostaSimplificada).then((response) => {
                this.$snotify.success('Proposta simplificada cadastrada com sucesso')
                setTimeout(() => {
                  this.$router.push({name: 'cadastro-entidade-lista'})
                }, 2000)
              })
                .catch((error) => {
                  console.log('error', error)
                  this.$root.trataErro(error)
                })
            } else {
              this.$snotify.error('Existem pendências no formulário. Favor verificar')
            }
          })
        }
      }
    }
</script>

<style scoped>

</style>
