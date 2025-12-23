<template>
  <!-- states -->
  <div>
    <div class="box-body">
      <!-- grid -->
      <div>
        <div class="row" v-if="!disable">
          <div class="col-md-2">
            <button @click="onNew()" tooltip="Adiciona um dirigente" type="button" class="btn btn-primary btn-flat"><i class="fa fa-plus-circle" aria-hidden="true"></i> Novo </button>
          </div>
          <div class="col-md-2">
            <button @click="inativosOcultados = !inativosOcultados" uib-tooltip="Oculta os dirigentes inativados ou mostra todos os dirigentes" type="button" class="btn btn-primary btn-flat"><i class="fa fa-user" aria-hidden="true"></i> {{inativosOcultados ? 'Mostrar Inativos' : 'Somente Ativos'}}</button>
          </div>


          <div class="col-md-12" v-if="mostraInclusao === true && mostraInclusao">
              <span class="fa fa-warning indicador_insercao"
                    :title="'<h5>Inclusões: ' + inclDirTexto + '</h5>'"
                    v-tippy="{ inertia : true, arrow : true,  animation : 'perspective', distance:'1', placement : 'right', size: 'large', arrow : true }">
                <label class="control-label" style="color: #000;">&nbsp Houve a inserção de novo(s) dirigentes(s)</label>
              </span>
          </div>
          <div class="col-md-12" v-if="mostraExclusao === true">
              <span class="fa fa-warning indicador_exclusao"
                    :title="'<h5>Exclusões: ' + excDirTexto + '</h5>'"
                    v-tippy="{ inertia : true, arrow : true,  animation : 'perspective', distance:'1', placement : 'right', size: 'large', arrow : true }">
                <label class="control-label" style="color: #000;">&nbsp Houve a exclusão de dirigentes(s)</label>
              </span>
          </div>

          <!-- /.col -->
        </div>
        <!-- /.row -->
        <br>
        <!-- form -->
        <div class="row">
          <div class="table-responsive">
            <b-container fluid>
              <!-- Main table element -->
              <b-table how-empty
                       ref="tableDirigentes"
                       stacked="md"
                       id="dirigentes-table"
                       :bordered="table.bordered"
                       :items="table.items"
                       :hover="table.hover"
                       :fields="table.fields"
                       :filter="table.filter"
                       :current-page="table.currentPage"
                       :per-page="table.perPage"
                       :sort-by.sync="table.sortBy"
                       :sort-desc.sync="table.sortDesc"
                       :tbody-tr-class="inativosMostrarOcultar"
                       empty-text="Nenhum registro encontrado"
              >
                <template slot="ds_nome" scope="row">{{row.value }}&nbsp;&nbsp;&nbsp;&nbsp;<span style="color: cornflowerblue">{{row.item.cargo.ds_descricao }}</span></template>
                <template slot="dt_inicio_mandato" scope="row">{{row.value | moment("L")}}</template>
                <template slot="dt_fim_mandato" scope="row">{{row.value | moment("L")}}</template>
                <template slot="actions" scope="row">
                  <div v-if="disable">
                    <b-button type="button" :disabled="false" @click.stop="edita(row)" class="btn btn-primary btn-sm btn-flat"><i class="fa fa-pencil-square-o" aria-hidden="true"></i> Detalhar</b-button>
                  </div>
                  <div v-else>
                    <b-button type="button" :disabled="false" @click.stop="edita(row)" class="btn btn-primary btn-sm btn-flat"><i class="fa fa-pencil-square-o" aria-hidden="true"></i> Editar</b-button>
                    <div class="col-sm-offset-0 fa-lg">
                      <span v-if="arr[0] == row.index || arr[1] == row.index || arr[2] == row.index || arr[3] == row.index || arr[4] == row.index || arr[5] == row.index || arr[6] == row.index || arr[7] == row.index || arr[8] == row.index"
                            class="fa fa-warning" style="position:relative; top:8px; margin-left:2px; color: #fb2916;"
                            :title="'<h5>Clique em editar para ver as mudanças.</h5>'"
                            v-tippy="{ inertia : true, arrow : true,  animation : 'perspective', distance:'1', size: 'large', arrow : true, placement:'left' }"
                      ></span>
                    </div>
                    <!--<b-button type="button" :disabled="false" @click.stop="exclui(row)" class="btn btn-danger btn-sm btn-flat"><i class="fa fa-trash" aria-hidden="true"></i> Excluir</b-button>-->
                  </div>
                </template>
                <template slot="bt_ativo" scope="row">
                  <i :class="['fa fa-circle ', row.value ? 'text-green' : 'text-red']" aria-hidden="true"></i>
                </template>
              </b-table>

              <b-row v-if="table.items.length > table.perPage">
                <b-col md="12" class="my-1" right>
                  <b-pagination :total-rows="table.items.length" :per-page="table.perPage" v-model="table.currentPage" class="" />
                </b-col>
              </b-row>

            </b-container>
          </div>
        </div>
      </div>
    </div>
    <div v-show="state === 'FORM'" style="padding-left:0" class="row well well-sm no-shadow animated fadeInDownOutUp" name="frmAddChief">
      <fieldset :disabled="disable">
        <fieldset >
          <legend><b>&nbsp Dados pessoais:</b></legend>
          <div class="row">
            <div class="col-md-6">

              <!-- Nome do dirigente -->
              <div class="form-group required-field" :class="{ 'has-error' : errors.first('Nome do dirigente')}">
                <label for="nome" class="control-label col-md-4">
                    <span v-if="_.hasIn(mudancas, 'ds_nome') && _.hasIn(texto, 'ds_nome') "  class="fa fa-warning indicador_alteracao"
                          :title="'<h5>Conteúdo anterior: ' + texto.ds_nome + '</h5>'"
                          v-tippy="{ inertia : true, arrow : true,  animation : 'perspective', distance:'1', size: 'large', arrow : true }"></span>
                  Nome:</label>
                <div class="col-md-8">
                  <input v-model="dirigentes.ds_nome" name="Nome do dirigente" class="form-control" type="text" v-validate="'required|min:5|max:255'" ref="Nome do dirigente" :disabled="bloqueioCampos === true">
                  <span v-if="errors.first('Nome do dirigente')" class="label label-danger"> {{ errors.first('Nome do dirigente') }}</span>
                </div>
              </div>
            </div>
          </div>
          <div class="row">

            <div class="col-md-6">

              <!-- Ativo -->
              <div class="form-group required-field" :class="{ 'has-error' : errors.first('active')}">
                <label for="nome" class="control-label col-md-4">
                    <span v-if="_.hasIn(mudancas, 'bt_ativo') && _.hasIn(texto, 'bt_ativo')"  class="fa fa-warning indicador_alteracao"
                          :title="'<h5>Conteúdo anterior: ' + texto.bt_ativo + '</h5>'"
                          v-tippy="{ inertia : true, arrow : true,  animation : 'perspective', distance:'1', size: 'large', arrow : true }"></span>
                  Status:</label>
                <div class="col-md-5">
                  <label class="radio-inline new-control new-control-radio">
                    <input type="radio" name="active" v-model="dirigentes.bt_ativo" :value="1" v-validate="'required'"> Ativo
                    <div class="new-control-indicator"></div>
                  </label>
                  <label class="radio-inline new-control new-control-radio">
                    <input type="radio" name="active" v-model="dirigentes.bt_ativo" :value="0" v-validate="'required'"> Inativo
                    <div class="new-control-indicator"></div>
                  </label>
                  <span v-if="errors.first('active')" class="label label-danger"> {{('O campo Status é obrigatório') }}</span>
                </div>
              </div>
            </div>
          </div>
          <div class="row">

            <div class="col-md-6">

              <!-- Estado civil -->
              <div class="form-group required-field" :class="{ 'has-error' : errors.first('Estado civil')}">
                <label for="Estado civil" class="control-label col-md-4">
                    <span v-if="_.hasIn(mudancas, 'ds_estado_civil') && _.hasIn(texto, 'ds_estado_civil')"  class="fa fa-warning indicador_alteracao"
                          :title="'<h5>Conteúdo anterior: ' + texto.ds_estado_civil + '</h5>'"
                          v-tippy="{ inertia : true, arrow : true,  animation : 'perspective', distance:'1', size: 'large', arrow : true }"></span>
                  Estado civil:</label>
                <div class="col-md-5">
                  <select v-model="dirigentes.ds_estado_civil" name="Estado civil" class="form-control" v-validate="'required'" ref="Estado civil">
                    <option value="SOLTEIRO">Solteiro(a)</option>
                    <option value="CASADO">Casado(a)</option>
                    <option value="DIVORCIADO">Divorciado(a)</option>
                    <option value="VIUVO">Viúvo(a)</option>
                  </select>
                  <span v-if="errors.first('Estado civil')" class="label label-danger"> {{('O campo Estado Civil é obrigatório') }}</span>
                </div>
              </div>

            </div>

            <div class="col-md-6">

              <!-- Data de nascimento -->
              <div class="form-group required-field" :class="{ 'has-error' : errors.first('Data de nascimento')}">
                <label for="Data de nascimento" class="control-label col-md-4">
                    <span v-if="_.hasIn(mudancas, 'dt_data_nascimento') && _.hasIn(texto, 'dt_data_nascimento')"  class="fa fa-warning indicador_alteracao"
                          :title="'<h5>Conteúdo anterior: ' + texto.dt_data_nascimento + '</h5>'"
                          v-tippy="{ inertia : true, arrow : true,  animation : 'perspective', distance:'1', size: 'large', arrow : true }"></span>
                  Data de nascimento:</label>
                <div class="col-md-5">
                  <!--<datepicker ref="Data de nascimento" name="Data de nascimento" v-model="dirigentes.dt_data_nascimento" input-class="form-control datepicker"-->
                  <!--:language="$datePickerPtBR" maxlength="20" :use-utc="true" placeholder="__ /__ /____" :disabled="bloqueioCampos === true"-->
                  <!--format="dd/MM/yyyy" v-validate="'required'">-->
                  <!--</datepicker>-->
                  <!--<div class="col-md-6 col-lg-4">-->
                  <input
                    type="text"
                    ref="Data de nascimento"
                    name="Data de nascimento"
                    v-model="dt_data_nascimento"
                    class="form-control"
                    v-mask="'##/##/####'"
                    data-vv-as="Data de nascimento"
                    :masked="masked"
                    v-validate="'required|validdate|dateeqpast|date_format:dd/MM/yyyy|after:01/01/1900'"
                  >
                  <span v-if="errors.first('Data de nascimento')" class="label label-danger"> {{ errors.first('Data de nascimento') }}</span>
                </div>
              </div>

            </div>
          </div>
          <div class="row">

            <div class="col-md-6">

              <!-- Sexo -->
              <div class="form-group required-field" :class="{ 'has-error' : errors.first('Sexo')}">
                <label for="Sexo" class="control-label col-md-4">
                    <span v-if="_.hasIn(mudancas, 'ds_gender') && _.hasIn(texto, 'ds_gender')"  class="fa fa-warning indicador_alteracao"
                          :title="'<h5>Conteúdo anterior: ' + texto.ds_gender + '</h5>'"
                          v-tippy="{ inertia : true, arrow : true,  animation : 'perspective', distance:'1', size: 'large', arrow : true }"></span>
                  Gênero:</label>
                <div class="col-md-5">
                  <select v-model="dirigentes.ds_gender" name="Sexo" class="form-control" v-validate="'required'" ref="Sexo" :disabled="bloqueioCampos === true">
                    <option value="MASCULINO">Masculino</option>
                    <option value="FEMININO">Feminino</option>
                  </select>
                  <span v-if="errors.first('Sexo')" class="label label-danger"> {{('O campo Sexo é obrigatório') }}</span>
                </div>
              </div>
            </div>

            <div class="col-md-6">

              <!-- Profissão -->
              <div class="form-group required-field" :class="{ 'has-error' : errors.first('Profissão')}" :disabled="bloqueioCampos === true">
                <label for="Profissão" class="control-label col-md-4">
                    <span v-if="_.hasIn(mudancas, 'ds_profissao') && _.hasIn(texto, 'ds_profissao')"  class="fa fa-warning indicador_alteracao"
                          :title="'<h5>Conteúdo anterior: ' + texto.ds_profissao + '</h5>'"
                          v-tippy="{ inertia : true, arrow : true,  animation : 'perspective', distance:'1', size: 'large', arrow : true }"></span>
                  Profissão:</label>
                <div class="col-md-5">
                  <input v-model="dirigentes.ds_profissao" name="Profissão" ref="Profissão" type="text" class="form-control" v-validate="'required|min:5|max:255'">
                  <span v-if="errors.first('Profissão')" class="label label-danger"> {{ errors.first('Profissão') }}</span>
                </div>
              </div>

            </div>
          </div>
          <div class="row">
            <div class="col-md-6">

              <!-- CPF -->
              <div class="form-group required-field" :class="{ 'has-error' : errors.first('CPF')}">
                <label for="CPF" class="control-label col-md-4">
                    <span v-if="_.hasIn(mudancas, 'ds_cpf') && _.hasIn(texto, 'ds_cpf')"  class="fa fa-warning indicador_alteracao"
                          :title="'<h5>Conteúdo anterior: ' + texto.ds_cpf + '</h5>'"
                          v-tippy="{ inertia : true, arrow : true,  animation : 'perspective', distance:'1', size: 'large', arrow : true }"></span>
                  CPF:</label>
                <div class="col-md-5">
                  <the-mask v-model="dirigentes.ds_cpf" ref="CPF" :disabled="bloqueioCampos === true"
                            name="CPF" class="form-control" type="text"
                            :mask="'###.###.###-##'" v-validate="'cpf|required'">
                  </the-mask>
                  <span v-if="errors.first('CPF')" class="label label-danger"> {{('O campo CPF do Dirigente é obrigatório') }}</span>
                </div>
              </div>
            </div>

            <div class="col-md-6">

              <!-- Nacionalidade -->
              <div class="form-group required-field" :class="{ 'has-error' : errors.first('Nacionalidade')}">
                <label for="Nacionalidade" class="control-label col-md-4">
                    <span v-if="_.hasIn(mudancas, 'ds_nacionalidade') && _.hasIn(texto, 'ds_nacionalidade')"  class="fa fa-warning indicador_alteracao"
                          :title="'<h5>Conteúdo anterior: ' + texto.ds_nacionalidade + '</h5>'"
                          v-tippy="{ inertia : true, arrow : true,  animation : 'perspective', distance:'1', size: 'large', arrow : true }"></span>
                  Nacionalidade:</label>
                <div class="col-md-5">
                  <input v-model="dirigentes.ds_nacionalidade" name="Nacionalidade" ref="Nacionalidade" type="text" class="form-control" v-validate="'required|min:5|max:255'" :disabled="bloqueioCampos === true">
                  <span v-if="errors.first('Nacionalidade')" class="label label-danger"> {{ errors.first('Nacionalidade') }}</span>
                </div>
              </div>

            </div>
          </div>
          <div class="row">

            <div class="col-md-6">

              <!-- RG -->
              <div class="form-group required-field" :class="{ 'has-error' : errors.first('RG')}">
                <label for="RG" class="control-label col-md-4">
                    <span v-if="_.hasIn(mudancas, 'ds_rg') && _.hasIn(texto, 'ds_rg')"  class="fa fa-warning indicador_alteracao"
                          :title="'<h5>Conteúdo anterior: ' + texto.ds_rg + '</h5>'"
                          v-tippy="{ inertia : true, arrow : true,  animation : 'perspective', distance:'1', size: 'large', arrow : true }"></span>
                  RG:</label>
                <div class="col-md-5">
                  <input v-model="dirigentes.ds_rg" name="RG" ref="RG" type="text" class="form-control" v-validate="'required|min:5||max:20'" :disabled="bloqueioCampos === true">
                  <span v-if="errors.first('RG')" class="label label-danger"> {{ errors.first('RG') }}</span>
                </div>
              </div>

            </div>

            <div class="col-md-6">

              <!-- Naturalidade  -->
              <div class="form-group required-field" :class="{ 'has-error' : errors.has('UF')}">
                <label for="placeOfBirth" class="control-label col-md-4">
                    <span v-if="_.hasIn(mudancas, 'ds_naturalidade') && _.hasIn(texto, 'ds_naturalidade')"  class="fa fa-warning indicador_alteracao"
                          :title="'<h5>Conteúdo anterior: ' + texto.ds_naturalidade + '</h5>'"
                          v-tippy="{ inertia : true, arrow : true,  animation : 'perspective', distance:'1', size: 'large', arrow : true }"></span>

                  <span v-if="_.hasIn(mudancas, 'ds_uf') && _.hasIn(texto, 'ds_uf')"  class="fa fa-warning indicador_alteracao"
                        :title="'<h5>Conteúdo anterior: ' + texto.ds_uf + '</h5>'"
                        v-tippy="{ inertia : true, arrow : true,  animation : 'perspective', distance:'1', size: 'large', arrow : true }"></span>

                  Naturalidade / UF:</label>
                <div class="col-md-6 junto">

                  <div class="col-md-5">
                    <input v-model="dirigentes.ds_naturalidade" name="Naturalidade" type="text" class="form-control" v-validate="'min:3|max:255'" :disabled="bloqueioCampos === true">
                    <span v-if="errors.first('Naturalidade')" class="label label-danger"> {{ errors.first('Naturalidade') }}</span>
                  </div>

                  <div class="col-md-5">
                    <select v-model="dirigentes.ds_uf" class="form-control" name="UF" ref="UF" v-validate="'required'" :disabled="bloqueioCampos === true">
                      <option v-for="uf in estados" :value="uf">{{uf}}</option>
                    </select>
                  </div>

                  <div class="col-md-12">
                    <span v-if="errors.has('UF')" class="label label-danger"> {{errors.first('UF')}}</span>
                  </div>

                </div>
              </div>

            </div>
          </div>
          <div class="row">

            <div class="col-md-6">

              <!-- Org. Emissor -->
              <div class="form-group required-field" :class="{ 'has-error' : errors.has('UF do RG')}">
                <label for="rgOrgaoEmissor" class="control-label col-md-4">
                    <span v-if="_.hasIn(mudancas, 'ds_orgao_emissor') && _.hasIn(texto, 'ds_orgao_emissor')"  class="fa fa-warning indicador_alteracao"
                          :title="'<h5>Conteúdo anterior: ' + texto.ds_orgao_emissor + '</h5>'"
                          v-tippy="{ inertia : true, arrow : true,  animation : 'perspective', distance:'1', size: 'large', arrow : true }"></span>

                  <span v-if="_.hasIn(mudancas, 'ds_rg_uf') && _.hasIn(texto, 'ds_rg_uf')"  class="fa fa-warning indicador_alteracao"
                        :title="'<h5>Conteúdo anterior: ' + texto.ds_rg_uf + '</h5>'"
                        v-tippy="{ inertia : true, arrow : true,  animation : 'perspective', distance:'1', size: 'large', arrow : true }"></span>

                  Org. Emissor / UF:</label>
                <div class="col-md-6 junto">

                  <div class="col-md-5">
                    <input v-model="dirigentes.ds_orgao_emissor" name="emissor" type="text" class="form-control" v-validate="'min:2|max:20'" :disabled="bloqueioCampos === true">
                  </div>

                  <div class="col-md-5">
                    <select v-model="dirigentes.ds_rg_uf" class="form-control" name="UF do RG" ref="UF do RG" v-validate="'required'" :disabled="bloqueioCampos === true">
                      <option v-for="uf in estados" :value="uf">{{uf}}</option>
                    </select>
                  </div>

                  <div class="col-md-12">
                    <span v-if="errors.has('UF do RG')" class="label label-danger"> {{ errors.first('UF do RG') }}</span>
                  </div>

                </div>
              </div>


            </div>

          </div>
          <div class="row">

          </div>

        </fieldset>

        <fieldset>
          <legend><b>&nbsp; Endereço:</b></legend>
          <div class="row">

            <div class="col-md-6">
              <!-- CEP -->
              <div class="form-group required-field" :class="{ 'has-error' : errors.first('cep')}">
                <label for="cep" class="control-label col-md-4">
                    <span v-if="_.hasIn(mudancas, 'endereco.ds_cep') && _.hasIn(texto, 'endereco.ds_cep')"  class="fa fa-warning indicador_alteracao"
                          :title="'<h5>Conteúdo anterior: ' + texto.endereco.ds_cep + '</h5>'"
                          v-tippy="{ inertia : true, arrow : true,  animation : 'perspective', distance:'1', size: 'large', arrow : true }"></span>
                  CEP:</label>
                <div class="col-md-4">
                  <the-mask v-model="dirigentes.endereco.ds_cep" name="cep" class="form-control" type="text" @blur.native="buscaCEP"
                            v-validate="'required|max:9'" mask="#####-###"></the-mask>
                  <span v-if="errors.first('cep')" class="label label-danger"> {{('O campo CEP é obrigatório') }}</span>
                </div>
              </div>

            </div>

            <div class="col-md-6">

              <!-- Endereço -->
              <div class="form-group">
                <label for="Cidade" class="control-label col-md-4">
                  Cidade / UF:</label>
                <div class="col-md-8">
                  <span v-show="!_.isUndefined(dirigentes.endereco.ds_cidade)" v-html="dirigentes.endereco.ds_cidade + ' / ' + dirigentes.endereco.ds_estado" class="form-control" disabled="disabled"></span>
                </div>
              </div>

            </div>
          </div>
          <div class="row">

            <div class="col-md-6">

              <!-- Endereço -->
              <div class="form-group required-field" :class="{ 'has-error' : errors.first('Endereço')}">
                <label for="Endereço" class="control-label col-md-4">
                    <span v-if="_.hasIn(mudancas, 'endereco.ds_rua') && _.hasIn(texto, 'endereco.ds_rua')"  class="fa fa-warning indicador_alteracao"
                          :title="'<h5>Conteúdo anterior: ' + texto.endereco.ds_rua + '</h5>'"
                          v-tippy="{ inertia : true, arrow : true,  animation : 'perspective', distance:'1', size: 'large', arrow : true }"></span>
                  Endereço:</label>
                <div class="col-md-8">
                  <input v-model="dirigentes.endereco.ds_rua" name="Endereço" ref="Endereço" class="form-control" type="text" v-validate="'required|min:5|max:60'">
                  <span v-if="errors.first('Endereço')" class="label label-danger"> {{ errors.first('Endereço') }}</span>
                </div>
              </div>

            </div>

            <div class="col-md-6">

              <!-- Número -->
              <div class="form-group required-field" :class="{ 'has-error' : errors.first('Número')}">
                <label for="Número" class="control-label col-md-4">
                    <span v-if="_.hasIn(mudancas, 'endereco.ds_numero') && _.hasIn(texto, 'endereco.ds_numero')"  class="fa fa-warning indicador_alteracao"
                          :title="'<h5>Conteúdo anterior: ' + texto.endereco.ds_numero + '</h5>'"
                          v-tippy="{ inertia : true, arrow : true,  animation : 'perspective', distance:'1', size: 'large', arrow : true }"></span>
                  Número:</label>
                <div class="col-md-4">
                  <input v-model="dirigentes.endereco.ds_numero" name="Número" ref="Número" class="form-control" required type="text" v-validate="'required|min:1|max:7'">
                  <span v-if="errors.first('Número')" class="label label-danger"> {{ errors.first('Número') }}</span>
                </div>
              </div>

            </div>

          </div>
          <div class="row">

            <div class="col-md-6">

              <!-- Complemento -->
              <div class="form-group">
                <label for="Complemento" class="control-label col-md-4">
                    <span v-if="_.hasIn(mudancas, 'endereco.ds_complemento') && _.hasIn(texto, 'endereco.ds_complemento')"  class="fa fa-warning indicador_alteracao"
                          :title="'<h5>Conteúdo anterior: ' + texto.endereco.ds_complemento + '</h5>'"
                          v-tippy="{ inertia : true, arrow : true,  animation : 'perspective', distance:'1', size: 'large', arrow : true }"></span>
                  Complemento:</label>
                <div class="col-md-8">
                  <input v-model="dirigentes.endereco.ds_complemento" name="Complemento" class="form-control" maxlength="20" type="text" v-validate="'max:20'">
                  <span v-if="errors.first('Complemento')" class="label label-danger"> {{ errors.first('Complemento') }}</span>
                </div>
              </div>

            </div>

            <div class="col-md-6">

              <!-- Bairro -->
              <div class="form-group">
                <label for="Bairro" class="control-label col-md-4">
                    <span v-if="_.hasIn(mudancas, 'endereco.ds_bairro') && _.hasIn(texto, 'endereco.ds_bairro')"  class="fa fa-warning indicador_alteracao"
                          :title="'<h5>Conteúdo anterior: ' + texto.endereco.ds_bairro + '</h5>'"
                          v-tippy="{ inertia : true, arrow : true,  animation : 'perspective', distance:'1', size: 'large', arrow : true }"></span>
                  Bairro:</label>
                <div class="col-md-4">
                  <input v-model="dirigentes.endereco.ds_bairro" name="Bairro" class="form-control" type="text" v-validate="'max:32'">
                  <span v-if="errors.first('Bairro')" class="label label-danger"> {{ errors.first('Bairro') }}</span>
                </div>
              </div>

            </div>
          </div>

        </fieldset>

        <fieldset>
          <legend><b>&nbsp; Contato:</b></legend>
          <div class="row">
            <div class="col-md-6">

              <!-- Telefone -->
              <div class="form-group required-field" :class="{ 'has-error' : errors.first('Telefone')}">
                <label for="Telefone" class="control-label col-md-4">
                    <span v-if="_.hasIn(mudancas, 'contato.ds_telefone') && _.hasIn(texto, 'contato.ds_telefone')"  class="fa fa-warning indicador_alteracao"
                          :title="'<h5>Conteúdo anterior: ' + texto.contato.ds_telefone + '</h5>'"
                          v-tippy="{ inertia : true, arrow : true,  animation : 'perspective', distance:'1', size: 'large', arrow : true }"></span>
                  Telefone:</label>
                <div class="col-md-4">
                  <the-mask v-model="dirigentes.contato.ds_telefone" name="Telefone" ref="Telefone" class="form-control" type="text"
                            v-validate="'required|min:10|max:11'" :mask="['(##) ####-####', '(##) #####-####']">
                  </the-mask>
                  <span v-if="errors.first('Telefone')" class="label label-danger"> {{ errors.first('Telefone') }}</span>
                </div>
              </div>

            </div>

            <div class="col-md-6">

              <!-- Celular -->
              <div class="form-group">
                <label for="Celular" class="control-label col-md-4">
                    <span v-if="_.hasIn(mudancas, 'contato.ds_celular') && _.hasIn(texto, 'contato.ds_celular')"  class="fa fa-warning indicador_alteracao"
                          :title="'<h5>Conteúdo anterior: ' + texto.contato.ds_celular + '</h5>'"
                          v-tippy="{ inertia : true, arrow : true,  animation : 'perspective', distance:'1', size: 'large', arrow : true }"></span>
                  Celular:</label>
                <div class="col-md-4">
                  <the-mask v-model="dirigentes.contato.ds_celular" name="Celular" class="form-control" type="text"
                            :mask="['(##) ####-####', '(##) #####-####']"></the-mask>
                </div>
              </div>

            </div>
          </div>
          <div class="row">
            <div class="col-md-6">

              <!-- Fax -->
              <div class="form-group">
                <label for="Fax" class="control-label col-md-4">
                    <span v-if="_.hasIn(mudancas, 'contato.ds_fax') && _.hasIn(texto, 'contato.ds_fax')"  class="fa fa-warning indicador_alteracao"
                          :title="'<h5>Conteúdo anterior: ' + texto.contato.ds_fax + '</h5>'"
                          v-tippy="{ inertia : true, arrow : true,  animation : 'perspective', distance:'1', size: 'large', arrow : true }"></span>
                  Fax:</label>
                <div class="col-md-4">
                  <the-mask v-model="dirigentes.contato.ds_fax" name="fax" class="form-control" type="text"
                            :mask="['(##) ####-####', '(##) #####-####']"></the-mask>
                </div>
              </div>

            </div>
            <div class="col-md-6">

              <!-- E-mail do dirigente -->
              <div class="form-group required-field" :class="{ 'has-error' : errors.first('email do dirigente')}">
                <label for="email do dirigente" class="control-label col-md-4">
                    <span v-if="_.hasIn(mudancas, 'ds_email') && _.hasIn(texto, 'ds_email')"  class="fa fa-warning indicador_alteracao"
                          :title="'<h5>Conteúdo anterior: ' + texto.ds_email + '</h5>'"
                          v-tippy="{ inertia : true, arrow : true,  animation : 'perspective', distance:'1', size: 'large', arrow : true }"></span>
                  E-mail:</label>
                <div class="col-md-6">
                  <input v-model="dirigentes.ds_email" name="email do dirigente" data-vv-as="E-mail" class="form-control" type="text" v-validate="'required|email'">
                  <span v-if="errors.first('email do dirigente')" class="label label-danger"> {{ errors.first('email do dirigente') }}</span>
                </div>
              </div>
            </div>
          </div>

        </fieldset>

        <fieldset>
          <legend><b>&nbsp Período do mandato:</b></legend>
          <div class="row">

            <div class="col-md-6">

              <!-- Data Inicial mandato -->
              <div class="form-group required-field" :class="{ 'has-error' : errors.first('Data Inicial')}">
                <label for="Data Inicial" class="control-label col-md-4">
                    <span v-if="_.hasIn(mudancas, 'dt_inicio_mandato') && _.hasIn(texto, 'dt_inicio_mandato')"  class="fa fa-warning indicador_alteracao"
                          :title="'<h5>Conteúdo anterior: ' + (texto.dt_inicio_mandato | moment('L')) + '</h5>'"
                          v-tippy="{ inertia : true, arrow : true,  animation : 'perspective', distance:'1', size: 'large', arrow : true }"></span>
                  Data Inicial:</label>
                <div class="col-md-4">
                  <!--<datepicker  name="Data Inicial" ref="Data Inicial" v-model="dirigentes.dt_inicio_mandato" input-class="form-control datepicker"-->
                  <!--:language="$datePickerPtBR" maxlength="20" :use-utc="true" placeholder="__ /__ /____"-->
                  <!--format="dd/MM/yyyy" v-validate="'required'">-->
                  <!--</datepicker>-->
                  <input
                    type="text"
                    ref="Data Inicial"
                    id="Data Inicial"
                    name="Data Inicial"
                    v-model="dt_inicio_mandato"
                    class="form-control"
                    v-mask="'##/##/####'"
                    data-vv-as="Data Inicial"
                    :masked="masked"
                    v-validate="'required|validdate|dateeqpast|date_format:dd/MM/yyyy|after:01/01/1900'"
                  >
                  <span v-if="errors.first('Data Inicial')" class="label label-danger"> {{ errors.first('Data Inicial') }}</span>
                </div>
              </div>
            </div>

            <div class="col-md-6">

              <!-- Data Final mandato -->
              <div class="form-group required-field" :class="{ 'has-error' : errors.first('Data Final')}">
                <label for="Data Final" class="control-label col-md-4">
                    <span v-if="_.hasIn(mudancas, 'dt_fim_mandato') && _.hasIn(texto, 'dt_fim_mandato')"  class="fa fa-warning indicador_alteracao"
                          :title="'<h5>Conteúdo anterior: ' + (texto.dt_fim_mandato | moment('L')) + '</h5>'"
                          v-tippy="{ inertia : true, arrow : true,  animation : 'perspective', distance:'1', size: 'large', arrow : true }"></span>
                  Data Final:</label>
                <div class="col-md-4">
                  <!--<datepicker  name="Data Final" ref="Data Final"  v-model="dirigentes.dt_fim_mandato" input-class="form-control datepicker"-->
                  <!--:language="$datePickerPtBR" maxlength="20" :use-utc="true" placeholder="__ /__ /____"-->
                  <!--format="dd/MM/yyyy" v-validate="'required'">-->
                  <!--</datepicker>-->
                  <input
                    type="text"
                    ref="Data Final"
                    id="Data Final"
                    name="Data Final"
                    v-model="dt_fim_mandato"
                    class="form-control"
                    v-mask="'##/##/####'"
                    data-vv-as="Data Final"
                    :masked="masked"
                    v-validate="'required|validdate|date_format:dd/MM/yyyy|after:Data Inicial'"
                  >
                  <span v-if="errors.first('Data Final')" class="label label-danger"> {{ errors.first('Data Final') }}</span>
                </div>
              </div>

            </div>
          </div>
          <div class="row">

            <div class="col-md-6">

              <!-- Cargo -->
              <div class="form-group required-field" :class="{ 'has-error' : errors.first('positionMandate')}">
                <label for="positionMandate" class="control-label col-md-4">
                    <span v-if="_.hasIn(mudancas, 'cargo') && _.hasIn(texto, 'cargo')"  class="fa fa-warning indicador_alteracao"
                          :title="'<h5>Conteúdo anterior: ' + texto.cargo.ds_descricao + '</h5>'"
                          v-tippy="{ inertia : true, arrow : true,  animation : 'perspective', distance:'1', size: 'large', arrow : true }"></span>
                  Cargo:</label>
                <div class="col-md-4">
                  <select v-model="dirigentes.cargo"
                          name="positionMandate"
                          ref="positionMandate"
                          class="form-control"
                          v-validate="'required'">
                    <option v-for="mandato in mandatos"
                            :value="mandato" >{{mandato.ds_codigo + ' - ' + mandato.ds_descricao}}</option>
                  </select>
                  <span v-if="errors.first('positionMandate')" class="label label-danger"> {{('O campo Cargo é obrigatório') }}</span>
                </div>
              </div>

            </div>
          </div>
          <div class="row">
            <div class="col-md-2"></div>
            <div class="col-md-8">
              <p>&nbsp;* Se o cargo for '12 - Designado(a)', incluir <a :href="urlLaravel + '/docs/modelo_termo_de_designacao.docx'"><i class="fa fa-download" aria-hidden="true"></i> Termo de Designação</a> nos Anexos do Dirigente/Designado</p>
            </div>
          </div>

          <div class="row">

            <div class="col-md-6">

              <!-- Assina pela entidade? -->
              <div class="form-group required-field" :class="{ 'has-error' : errors.first('Assina pela entidade?')}">
                <label for="Assina pela entidade?" class="control-label col-md-4">
                    <span v-if="_.hasIn(mudancas, 'bt_assinatura_entidade') && _.hasIn(texto, 'bt_assinatura_entidade')"  class="fa fa-warning indicador_alteracao"
                          :title="'<h5>Conteúdo anterior: ' + texto.bt_assinatura_entidade + '</h5>'"
                          v-tippy="{ inertia : true, arrow : true,  animation : 'perspective', distance:'1', size: 'large', arrow : true }"></span>
                  Assina pela entidade?</label>
                <div class="col-md-5" >
                  <label class="radio-inline new-control new-control-radio">
                    <input type="radio" name="Assina pela entidade?" v-model="dirigentes.bt_assinatura_entidade" :value="1" v-validate="'required'"> Sim
                    <div class="new-control-indicator"></div>
                  </label>
                  <label class="radio-inline new-control new-control-radio">
                    <input type="radio" name="Assina pela entidade?" v-model="dirigentes.bt_assinatura_entidade" :value="0" v-validate="'required'"> Não
                    <div class="new-control-indicator"></div>
                  </label>
                </div>
                <span v-if="errors.first('Assina pela entidade?')" class="label label-danger"> {{('O campo Assina pela entidade é obrigatório') }}</span>
              </div>

              <!-- Assinatura é obrigatória? -->
              <div class="form-group required-field" :class="{ 'has-error' : errors.first('Assinatura é obrigatória?')}">
                <label for="Assinatura é obrigatória?" class="control-label col-md-4">
                    <span v-if="_.hasIn(mudancas, 'bt_assinatura_requerida') && _.hasIn(texto, 'bt_assinatura_requerida')"  class="fa fa-warning indicador_alteracao"
                          :title="'<h5>Conteúdo anterior: ' + texto.bt_assinatura_requerida + '</h5>'"
                          v-tippy="{ inertia : true, arrow : true,  animation : 'perspective', distance:'1', size: 'large', arrow : true }"></span>
                  Assinatura é obrigatória?</label>
                <div class="col-md-5" >
                  <label class="radio-inline new-control new-control-radio">
                    <input type="radio" name="Assinatura é obrigatória?" v-model="dirigentes.bt_assinatura_requerida" :value="1" v-validate="'required'"> Sim
                    <div class="new-control-indicator"></div>
                  </label>
                  <label class="radio-inline new-control new-control-radio">
                    <input type="radio" name="Assinatura é obrigatória?" v-model="dirigentes.bt_assinatura_requerida" :value="0" v-validate="'required'"> Não
                    <div class="new-control-indicator"></div>
                  </label>
                </div>
                <span v-if="errors.first('Assinatura é obrigatória?')" class="label label-danger"> {{('O campo Assinatura é obrigatório') }}</span>
              </div>

              <!-- É representante legal? -->
              <div class="form-group required-field" :class="{ 'has-error' : errors.first('É representante legal?')}">
                <label for="É representante legal?" class="control-label col-md-4">
                    <span v-if="_.hasIn(mudancas, 'bt_representante_legal') && _.hasIn(texto, 'bt_representante_legal')"  class="fa fa-warning indicador_alteracao"
                          :title="'<h5>Conteúdo anterior: ' + texto.bt_representante_legal + '</h5>'"
                          v-tippy="{ inertia : true, arrow : true,  animation : 'perspective', distance:'1', size: 'large', arrow : true }"></span>
                  É representante legal?</label>
                <div class="col-md-5" >
                  <label class="radio-inline new-control new-control-radio">
                    <input type="radio" name="É representante legal?" v-model="dirigentes.bt_representante_legal" :value="1" v-validate="'required'"> Sim
                    <div class="new-control-indicator"></div>
                  </label>
                  <label class="radio-inline new-control new-control-radio">
                    <input type="radio" name="É representante legal?" v-model="dirigentes.bt_representante_legal" :value="0" v-validate="'required'"> Não
                    <div class="new-control-indicator"></div>
                  </label>
                </div>
                <span v-if="errors.first('É representante legal?')" class="label label-danger"> {{('O campo Representante legal é obrigatório') }}</span>
              </div>

            </div>
          </div>
        </fieldset>

        <fieldset v-if="!_.includes([12, 13], _.get(dirigentes, 'cargo.ds_codigo', 0))" id="cadastroEmpresasLigadasDirigentes">
          <div class="col-md-12">
            <div>
              <legend><b>&nbsp;Participação em Empresas:</b></legend>
              <span>
                Adicione abaixo participação em empresa a qual faça parte. Se nenhuma empresa for adicionada será considerado que não está ligado a nenhuma empresa exceto <i>{{ entidadeParceira.ds_nome }}</i>
              </span>
            </div>
            <table class="table table-condensed table-bordered">
              <thead>
              <tr>
                <th style="width: 150px; text-align: center">CNPJ</th>
                <th>Razão Social</th>
                <th style="width: 150px; text-align: center">Data Desligamento</th>
                <th style="width: 180px; text-align: center"><button @click="adicionaEmpresaLigada(dirigentes)" type="button" class="btn btn-primary btn-flat"><i class="fa fa-plus-circle" aria-hidden="true"></i> Adiciona empresa</button></th>
              </tr>
              </thead>
              <tbody>
              <template v-if="(_.get(dirigentes, 'dados.empresas', [])).length === 0"><tr><td colspan="3">Não esta ou esteve ligado a nenhuma empresa nos últimos 12 meses</td></tr></template>
              <template v-else>
                <tr v-for="(empresa, idxEmpresa) in _.get(dirigentes, 'dados.empresas', [])">
                  <template v-if="_.isNull(empresa.inclusao)"><!-- registro novo -->
                    <td>
                      <div class="required-field" :class="{ 'has-error' : errors.first('CNPJ_' + idxEmpresa)}">
                        <the-mask v-model="empresa.cnpj" :name="'CNPJ_' + idxEmpresa" class="form-control" type="text" v-validate="'required|min:14|max:14|cnpj'" mask="##.###.###/####-##" style="text-align: center"></the-mask>
                        <span v-if="errors.first('CNPJ_' + idxEmpresa)" class="label label-danger"> {{errors.first('CNPJ_' + idxEmpresa)}}</span>
                      </div>
                    </td>
                    <td>
                      <div class="required-field" :class="{ 'has-error' : errors.first('razao_social_empresa_' + idxEmpresa)}">
                        <input v-model="empresa.nome" type="text" :name="'razao_social_empresa_' + idxEmpresa" v-validate="'required'" maxlength="500" class="form-control" />
                        <span v-if="errors.first('razao_social_empresa_' + idxEmpresa)" class="label label-danger"> Razão Social da empresa é obrigatório</span>
                      </div>
                    </td>
                    <td>
                      <div class="input-group">
                        <datepicker ref="data_desligamento" name="data_desligamento" v-model="empresa.desligamento" input-class="form-control" :language="$datePickerPtBR" maxlength="20" placeholder="__ /__ /____" format="dd/MM/yyyy"></datepicker>
                        <span class="input-group-btn" v-if="!_.isNull(empresa.desligamento)">
                          <button type="button" @click="empresa.desligamento = null" class="btn btn-default btn-flat" :title="'<h5>Exclui data de desligamento</h5>'" v-tippy="{inertia:true, arrow:true, animation:'perspective', distance:'1', size:'large'}"><i class="fa fa-trash"></i></button>
                        </span>
                      </div>
                    </td>
                    <td style="text-align: center">
                      <button @click="dirigentes.dados.empresas.splice(idxEmpresa, 1)" type="button" class="btn btn-danger btn-flat"><i class="fa fa-trash" aria-hidden="true"></i> Excluir</button>
                    </td>
                  </template>
                  <template v-else>
                    <td style="text-align: center">{{ empresa.cnpj | cnpj}}</td>
                    <td>{{ empresa.nome }}</td>
                    <td style="text-align: center">
                      <span v-if="!_.isNull(empresa.desligamento)">
                        {{ empresa.desligamento | moment("L") }}
                      </span>
                      <span v-else>
                        <datepicker ref="data_desligamento" name="data_desligamento" v-model="empresa.desligamento" input-class="form-control" :language="$datePickerPtBR" maxlength="20" placeholder="__ /__ /____" format="dd/MM/yyyy"></datepicker>
                        <span class="input-group-btn" v-if="!_.isNull(empresa.desligamento)">
                          <button type="button" @click="empresa.desligamento = null" class="btn btn-default btn-flat" :title="'<h5>Exclui data de desligamento</h5>'" v-tippy="{inertia:true, arrow:true, animation:'perspective', distance:'1', size:'large'}"><i class="fa fa-trash"></i></button>
                        </span>
                      </span>
                    </td>
                    <td style="text-align: center; font-weight: bold; color: var(--cor-destaque)">Não pode ser excluído</td>
                  </template>
                </tr>
              </template>
              </tbody>
            </table>
          </div>
        </fieldset>

        <fieldset>
          <legend><b>&nbsp; Anexos do Dirigente/Designado:</b>
            <span v-if="_.hasIn(mudancas, 'documentos') && _.hasIn(texto, 'documentos')"  class="fa fa-warning indicador_alteracao"
                  v-tippy="{ inertia : true, arrow : true,  animation : 'perspective', distance:'1', size: 'large', arrow : true }"></span>
          </legend>
          <div class="col-md-12">
            <upload-documentos-php-novo :propDocumentos="dirigentes.documentos" :documentTypes="''" :disable="''" :localUso="listaDocDirigentes" :salvouOK="salvouOK"></upload-documentos-php-novo>
          </div>
        </fieldset>
      </fieldset>
      <div class="">
        <div class="col-md-6">

          <!-- buttons -->
          <div class="form-group">
            <div class="col-md-12">
              <button @click="onAdd(frmAddChief)" type="button" class="btn btn-confirm btn-flat"><i class="fa fa-check" aria-hidden="true"></i> Salvar Dirigente</button>
              <button @click="onCancel(frmAddChief)" type="button" class="btn btn-back btn-flat"><i class="fa fa-times-circle" aria-hidden="true"></i> Cancelar</button>
            </div>
          </div>

        </div>
        <div v-show="loading.show" class="overlay" style="position: absolute; top: 0px; left: 0px; width: 100%; height: 100%; display: block;">
          <i class="fa fa-refresh fa-spin"></i>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import UploadDocumentosPhpNovo from '../modules/uploadDocumentosPhpNovo'
  import { mapGetters } from 'vuex'
  import {detailedDiff} from 'deep-object-diff'
  import moment from 'moment'
  export default {
    components: {
      UploadDocumentosPhpNovo
    },
    name: 'dirigentes',
    data () {
      return {
        showgrid: true,
        dataMinima: '1800-01-01',
        dataMaxima: '9999-12-31',
        state: 'GRID',
        chiefs: [],
        arr: [],
        bloqueioCampos: false,
        statusEntidade: '',
        loading: {
          show: false
        },
        salvouOK: false,
        indiceAlt: -1,
        curIndex: 0,
        index: 0,
        naoAchou: 0,
        texto: [],
        dirigentes: {
          endereco: [],
          contato: [],
          documentos: []
        },
        mostraInclusao: false,
        mostraExclusao: false,
        mostraAlteracao: false,
        mudancas: [],
        listaUsu: [],
        mandatos: {},
        mandato: {},
        editandoIndex: null,
        campoErro: null,
        inativosOcultados: true,
        dt_data_nascimento: '',
        dt_inicio_mandato: '',
        dt_fim_mandato: '',
        estados: ['AC', 'AL', 'AM', 'AP', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MG', 'MS', 'MT', 'PA', 'PB', 'PE', 'PI', 'PR', 'RJ', 'RN', 'RO', 'RR', 'RS', 'SC', 'SE', 'SP', 'TO'],
        table: {
          items: this.entDirigentes,
          filter: null,
          hover: true,
          bordered: true,
          currentPage: 1,
          perPage: 50,
          fields: [
            {key: 'ds_nome', label: 'Nome', sortable: true, thStyle: 'text-align: center', class: 'text-center'},
            {key: 'dt_inicio_mandato', label: 'Inicio do mandato', sortable: true, thStyle: 'text-align: center', class: 'text-center'},
            {key: 'dt_fim_mandato', label: 'Vigência do mandato', sortable: true, thStyle: 'text-align: center', class: 'text-center'},
            {key: 'bt_ativo', label: 'Ativo', thStyle: 'text-align: center; width: 13%', class: 'text-center'},
            { key: 'actions', label: 'Ações', thStyle: 'text-align: center; width: 13%', class: 'text-center' }
          ]
        },
        listaDocDirigentes: 'CADASTRO_DIRIGENTE'
      }
    },
    props: ['entDirigentes', 'disable', 'mudaDirigente', 'diferenca', 'analise', 'revisao', 'entidadeParceira'],
    watch: {
      entDirigentes: function () {
        this.table.items = this.entDirigentes
        this.desativado = this.disable
        if (this.mudaDirigente) {
          this.mudancas = this.mudaDirigente
        }
      },
      dt_data_nascimento: function (val) {
        let newdate = moment(val, 'DD/MM/YYYY', true)
        if (newdate.isValid()) {
          this.dirigentes.dt_data_nascimento = newdate.format('YYYY-MM-DD')
        }
      },
      dt_inicio_mandato: function (val) {
        let newdate = moment(val, 'DD/MM/YYYY', true)
        if (newdate.isValid()) {
          this.dirigentes.dt_inicio_mandato = newdate.format('YYYY-MM-DD')
        }
      },
      dt_fim_mandato: function (val) {
        let newdate = moment(val, 'DD/MM/YYYY', true)
        if (newdate.isValid()) {
          this.dirigentes.dt_fim_mandato = newdate.format('YYYY-MM-DD')
        }
      },
      diferenca: function () {
        this.diferencaDir = this.diferenca
      },
      analise: function () {
        if (this.analise) {
          this.analiseDir = this.analise.dirigentes
        }
      },
      revisao: function () {
        if (this.revisao) {
          this.revisaoDir = this.revisao.dirigentes
          this.mostraExclusao = false
          this.mostraInclusao = false
          if (this.analiseDir && this.revisaoDir) {
            if (this.analiseDir.length > this.revisaoDir.length) {
              this.mostraExclusao = true
              this.mostraInclusao = false
            } else {
              this.mostraExclusao = true
            }
            if (this.analiseDir.length < this.revisaoDir.length) {
              this.mostraInclusao = true
              this.mostraExclusao = false
            } else {
              this.mostraInclusao = false
            }
            if (this.analiseDir.length === this.revisaoDir.length) {
              this.mostraExclusao = false
            }
          }
          this.adicionados = detailedDiff(this.analise, this.revisao).added
          this.excluidos = _.differenceBy(this.analise.dirigentes, this.revisao.dirigentes, 'ds_nome')
          if (this.adicionados) {
            if (this.adicionados.dirigentes) {
              this.inclDir = this.adicionados.dirigentes
              this.inclDirTexto = _.map(this.inclDir, 'ds_nome')
              this.naoExisteDir = false
            } else {
              this.naoExisteDir = true
            }
          }
          if (this.excluidos) {
            this.excDirTexto = _.map(this.excluidos, 'ds_nome')
          }
        }
      },
      mudaDirigente: function () {
        if (this.mudaDirigente) {
          this.mudancas = this.mudaDirigente.dirigentes
          console.log('this.mudancas>>>>>', this.mudancas)
          for (let i = 0; i < this.mudancas.length; i++) {
            if (this.mudancas[i].cargo) {
              this.arr.push(i)
            } else if (this.mudancas[i].contato) {
              this.arr.push(i)
            } else if (this.mudancas[i].documentos) {
              this.arr.push(i)
            } else if (this.mudancas[i].ds_estado_civil) {
              this.arr.push(i)
            } else if (this.mudancas[i].ds_gender) {
              this.arr.push(i)
            } else if (this.mudancas[i].ds_rua) {
              this.arr.push(i)
            } else if (this.mudancas[i].ds_profissao) {
              this.arr.push(i)
            } else if (this.mudancas[i].dt_fim_mandato) {
              this.arr.push(i)
            } else if (this.mudancas[i].dt_inicio_mandato) {
              this.arr.push(i)
            } else if (this.mudancas[i].bt_ativo) {
              this.arr.push(i)
            } else if (this.mudancas[i].bt_assinatura_requerida) {
              this.arr.push(i)
            } else if (this.mudancas[i].bt_assinatura_entidade) {
              this.arr.push(i)
            } else if (this.mudancas[i].bt_representante_legal) {
              this.arr.push(i)
            } else if (this.mudancas[i].endereco) {
              if (this.mudancas[i].endereco.length > 0) {
                this.arr.push(i)
              }
            }
          }
        }
        //
        console.log('this.arr', this.arr)
        //
        for (let i = 0; i < this.mudancas.length; i++) {
          if (this.mudancas && this.mostraInclusao === false) {
            console.log('caiu aqui 1')
            if (_.findKey(this.mudancas, 'cargo')) {
              this.indiceAlt = _.findKey(this.mudancas, 'cargo')
            }
            if (_.findKey(this.mudancas, 'contato')) {
              this.indiceAlt = _.findKey(this.mudancas, 'contato')
            }
            if (_.findKey(this.mudancas, 'documentos')) {
              this.indiceAlt = _.findKey(this.mudancas, 'documentos')
            }
            if (_.findKey(this.mudancas, 'ds_estado_civil')) {
              this.indiceAlt = _.findKey(this.mudancas, 'ds_estado_civil')
            }
            if (_.findKey(this.mudancas, 'ds_gender')) {
              this.indiceAlt = _.findKey(this.mudancas, 'ds_gender')
            }
            if (_.findKey(this.mudancas, 'ds_rua')) {
              this.indiceAlt = _.findKey(this.mudancas, 'ds_rua')
            }
            if (_.findKey(this.mudancas, 'ds_profissao')) {
              this.indiceAlt = _.findKey(this.mudancas, 'ds_profissao')
            }
            if (_.findKey(this.mudancas, 'dt_fim_mandato')) {
              this.indiceAlt = _.findKey(this.mudancas, 'dt_fim_mandato')
            }
            if (_.findKey(this.mudancas, 'dt_inicio_mandato')) {
              this.indiceAlt = _.findKey(this.mudancas, 'dt_inicio_mandato')
            }
            if (_.findKey(this.mudancas, 'endereco')) {
              if (this.mudancas.endereco) {
                if (this.mudancas.endereco.length > 0) {
                  this.indiceAlt = _.findKey(this.mudancas, 'endereco')
                }
              }
            }
            if (_.findKey(this.mudancas, 'bt_ativo')) {
              this.indiceAlt = _.findKey(this.mudancas, 'bt_ativo')
            }
            if (_.findKey(this.mudancas, 'bt_assinatura_requerida')) {
              this.indiceAlt = _.findKey(this.mudancas, 'bt_assinatura_requerida')
            }
            if (_.findKey(this.mudancas, 'bt_assinatura_entidade')) {
              this.indiceAlt = _.findKey(this.mudancas, 'bt_assinatura_entidade')
            }
            if (_.findKey(this.mudancas, 'bt_representante_legal')) {
              this.indiceAlt = _.findKey(this.mudancas, 'bt_representante_legal')
            }
            console.log('arr>>>>', this.indiceAlt)
            console.log('indiceAlt>>>>', this.indiceAlt)
            if (this.indiceAlt !== -1) {
              console.log('mostraAlteracao1', this.mostraAlteracao)
              this.mostraAlteracao = true
              this.texto = this.diferencaDir.dirigentes[this.indiceAlt]
              console.log('texto======================', this.texto)
              if (this.texto.bt_ativo === 1) {
                this.texto.bt_ativo = 'Ativo'
              } else {
                this.texto.bt_ativo = 'Inativo'
              }
              if (this.texto.bt_assinatura_entidade === 1) {
                this.texto.bt_assinatura_entidade = 'Sim'
              } else {
                this.texto.bt_assinatura_entidade = 'Não'
              }
              if (this.texto.bt_assinatura_requerida === 1) {
                this.texto.bt_assinatura_requerida = 'Sim'
              } else {
                this.texto.bt_assinatura_requerida = 'Não'
              }
              if (this.texto.bt_assinatura_requerida === 1) {
                this.texto.bt_assinatura_requerida = 'Sim'
              } else {
                this.texto.bt_assinatura_requerida = 'Não'
              }
              if (this.texto.bt_representante_legal === 1) {
                this.texto.bt_representante_legal = 'Sim'
              } else {
                this.texto.bt_representante_legal = 'Não'
              }
            } else {
              console.log('mostraAlteracao2', this.mostraAlteracao)
              this.texto = []
              this.mostraAlteracao = false
            }
          }
        }
      }
    },
    'table.items': function () {
      this.$emit('dirigenteAdicionado', this.table.items)
    },
    computed: {
      ...mapGetters([
        'usuarioLogado',
        'urlLaravel'
      ]),
      rows () {
        return this.table.items.length
      }
    },
    created () {
      this.mandatoDirigente()
      if (this.$route.params.entidade) {
        this.statusEntidade = this.$route.params.entidade.ds_status
        this.processoAnterior = this.$route.params.entidade.processos.length
        if (this.statusEntidade === 'COMPLETO' && this.processoAnterior > 1) {
          this.bloqueioCampos = true
        }
        if (this.$route.params.name !== 'validacao-entidades') {
          this.inativosOcultados = false
        }
      }
    },
    methods: {
      inativosMostrarOcultar (item) {
        if (this.inativosOcultados) {
          if (!item.bt_ativo) return 'linha_ocultada' // Pegar todos os inativos e atribui classe para ocultá-los
        } else {
          if (!item.bt_ativo) return ''  // Pegar todos os inativos e exclui todas as classes
        }
      },
      trataDatas () {
        if (this.dirigentes.ds_cpf) {
          this.dt_data_nascimento = moment(this.dirigentes.dt_data_nascimento).format('DD/MM/YYYY')
          this.dt_inicio_mandato = moment(this.dirigentes.dt_inicio_mandato).format('DD/MM/YYYY')
          this.dt_fim_mandato = moment(this.dirigentes.dt_fim_mandato).format('DD/MM/YYYY')
        } else {
          this.dt_data_nascimento = this.dt_inicio_mandato = this.dt_fim_mandato = ''
        }
      },
      onNew () {
        this.dirigentes = {}
        this.dirigentes.endereco = {}
        this.dirigentes.contato = {}
        this.dirigentes.documentos = []
        this.state = 'FORM'
        this.editandoIndex = null
        this.curIndex = -1
        this.bloqueioCampos = false
        this.trataDatas()
        this.$validator.reset()
      },
      mandatoDirigente () {
        axiosLaravel.get('cargos/').then((response) => {
          this.mandatos = response.data
          this.$forceUpdate()
        })
          .catch((error) => {
            this.$root.trataErro(error)
          })
      },
      onCancel () {
        this.state = 'GRID'
        this.curIndex = 0
        this.bloqueioCampos = false
        this.dt_data_nascimento = this.dt_inicio_mandato = this.dt_fim_mandato = ''
      },
      buscaCEP () {
        if (this.dirigentes.endereco.ds_cep !== undefined && this.dirigentes.endereco.ds_cep !== null && this.dirigentes.endereco.ds_cep !== '') {
          if (this.dirigentes.endereco.ds_cep) {
            this.loading.show = true
            let cep = this.dirigentes.endereco.ds_cep.replace('-', '')
            axiosLaravel.get('municipios/cep/' + cep).then((response) => {
              this.dirigentes.endereco['ds_cidade'] = response.data.ds_nome
              this.dirigentes.endereco['ds_estado'] = response.data.ds_uf
              this.$forceUpdate()
              this.loading.show = false
            })
              .catch((error) => {
                cep = _.repeat('0', 8 - ('' + cep).length) + cep
                this.$viaCep.buscarCep(cep).then((obj) => { // Buscando através do serviço ViaCEP
                  if (obj.erro) { // Se não achar através do serviço ViaCEP
                    this.$snotify.error('Não foi encontrado esse CEP. Entre em contato com a Fundação BB.')
                  } else {
                    this.dirigentes.endereco['ds_cidade'] = _.toUpper(obj.localidade)
                    this.dirigentes.endereco['ds_estado'] = _.toUpper(obj.uf)
                  }
                  this.loading.show = false
                  this.$forceUpdate()
                }).catch((errorViaCep) => {
                  this.$snotify.error('Erro ao buscar CEP externamente. Entre em contato com a Fundação BB.')
                  this.loading.show = false
                  this.$root.trataErro(error)
                })
              })
          }
        }
      },
      onAdd () {
        if (_.isEmpty(this.dirigentes.documentos)) {
          this.$snotify.error('É necessário inserir ao menos um documento para o dirigente!')
          return
        }
        this.$validator.validateAll().then((result) => {
          // Se deu tudo certo
          if (result) {
            // Se estiver editando algum item
            if (this.editandoIndex !== null) {
              // Pega o index da tabela e atualiza o item
              this.table.items[this.editandoIndex] = this.dirigentes
              // Força o refresh da tabela
              this.$refs.tableDirigentes.refresh()
            } else { // Se não
              this.table.items.push(this.dirigentes)
            }
            this.$forceUpdate()
            //
            let currentDate = new Date()
            let hoje = moment(currentDate).format('YYYYMMDD')
            let representantesValidos = []
            _.forEach(this.table.items, function (o) {
              if (o.bt_assinatura_entidade === 1 && o.bt_ativo === 1 && o.bt_representante_legal === 1 && o.bt_assinatura_requerida === 1) {
                let dataInicial = moment(o.dt_inicio_mandato).format('YYYYMMDD')
                let dataFinal = moment(o.dt_fim_mandato).format('YYYYMMDD')
                if (dataInicial <= hoje && hoje <= dataFinal) {
                  representantesValidos.push(o)
                }
              }
            })
            this.$emit('validacaoDirigente', {'tag': 'peloMenosUmRepresentante', 'ativo': representantesValidos.length === 0, 'tipo': 'restricao', 'acao': null, 'mensagem': 'Deve haver pelo menos um dirigente que é <b>representante legal com mandato vigente e ativo</b>'})
            //
            this.onCancel()
            sessionStorage.removeItem('param')
          } else {
            this.$snotify.error('O formulário de Dirigentes possui erros. Favor verificar!')
          }
        })
      },
      edita (row) {
        this.mandatoDirigente()
        if (this.$route.params.entidade) {
          this.statusEntidade = this.$route.params.entidade.ds_status
          if (this.statusEntidade === 'COMPLETO') {
            this.bloqueioCampos = true
            this.$forceUpdate()
          }
          if (row.item.ds_cod_seq_erp && row.item.id) {
            // this.bloqueioCampos = true
            this.$forceUpdate()
          } else {
            this.bloqueioCampos = false
          }
        }
        // if (!this.dirigentes.address) {
        //   console.log('caiu aqui')
        //   this.dirigentes.address['cep'] = ''
        // }
        this.state = 'FORM'
        this.editandoIndex = row.index
        this.dirigentes = _.cloneDeep(row.item)
        this.trataDatas() // Preenche o Form com as datas do dirigente no formato d/m/Y
        // Trecho abaixo comentado pois já é processado no watch na funcao mudaDirigente Suporte 61172
        // this.errors.clear()
        // this.mudancas = _.cloneDeep(this.mudaDirigente.dirigentes[row.index])
        // this.texto = this.diferencaDir.dirigentes[row.index]
        // if (this.texto.bt_ativo === 1) {
        //   this.texto.bt_ativo = 'Ativo'
        // } else {
        //   this.texto.bt_ativo = 'Inativo'
        // }
        // if (this.texto.bt_assinatura_entidade === 1) {
        //   this.texto.bt_assinatura_entidade = 'Sim'
        // } else {
        //   this.texto.bt_assinatura_entidade = 'Não'
        // }
        // if (this.texto.bt_assinatura_requerida === 1) {
        //   this.texto.bt_assinatura_requerida = 'Sim'
        // } else {
        //   this.texto.bt_assinatura_requerida = 'Não'
        // }
        // if (this.texto.bt_assinatura_requerida === 1) {
        //   this.texto.bt_assinatura_requerida = 'Sim'
        // } else {
        //   this.texto.bt_assinatura_requerida = 'Não'
        // }
        // if (this.texto.bt_representante_legal === 1) {
        //   this.texto.bt_representante_legal = 'Sim'
        // } else {
        //   this.texto.bt_representante_legal = 'Não'
        // }
        this.$forceUpdate()
        // this.dirigentes = Object.assign({}, row.item)
        // this.dirigentes = row.item
      },
      exclui (row) {
        this.table.items.splice(row.index, 1)
      },
      adicionaEmpresaLigada (dirigente) {
        if (_.isNull(_.get(dirigente, 'dados', null))) {
          _.set(dirigente, 'dados', {'empresas': []}) // Adiciona objeto com empresa se dados esta null
        }
        if (!_.has(dirigente.dados, 'empresas')) {
          _.set(dirigente.dados, 'empresas', []) // Adiciona objeto com empresa se dados esta null
        }
        dirigente.dados.empresas.push({'cnpj': null, 'nome': '', 'inclusao': null, 'desligamento': null})
        this.$forceUpdate()
      }
    }
  }
</script>

<style>
  .junto {
    padding: 0px !important;
  }
  #cadastroEmpresasLigadasDirigentes .vdp-datepicker input[placeholder="__ /__ /____"] {
    background: white;
  }
</style>
