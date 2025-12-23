<template>
    <!-- 66201 - Licenciamento Ambiental -->
   <div class="box-body">
      <div v-show="loading.show" class="overlay" style="position: absolute;top: 0px;left: 0px;width: 100%;height: 100%;display: none; background: rgba(255, 255, 255, 0.7); z-index: 1000">
          <i class="fa fa-refresh fa-spin" style="top: 50%; left: 50%; position: absolute; font-size: 30px"></i>
      </div>
      
      <legend style="background-color: #fcfcfc">
            Licenciamento Ambiental
      </legend>

      <!------------------ Informativo ----------------->
      <div class="form-group box-body">
        <div class="column start-centered">
          <label class="control-label f-required label-head">1 - As atividades propostas para o projeto são passíveis de licenciamento ambiental obrigatório?</label>

          <div class="row-flex centered-start indicativo-container">
            <label class="radio-inline new-control new-control-radio" style="padding-top: 7px;">
              <input type="radio" value="Sim" v-model="indicativo"> Sim
              <div class="new-control-indicator"></div>
            </label>
            <label class="radio-inline new-control new-control-radio" style="padding-top: 7px;">
              <input type="radio" value="Não"  v-model="indicativo" @input="changeIndicativo()"> Não
              <div class="new-control-indicator"></div>
            </label>
          </div>
          
          <div v-if="indicativo === 'Não'" class="w-100">
              <label class="control-label f-required">Justificativa:</label>
              <input v-model="justificativaIndicativo" placeholder="Justificativa da Seleção" class="form-control col" type="text">
          </div>
          
          <div class="w-100 column start-centered gap-10" v-if="indicativo === 'Sim'">

              <div class="w-100" v-if="!editarLicencaInformativa">
                <label class="control-label f-required">Selecione:</label>
                <select name="Tipo de Ação"
                      :disabled="!_.isEmpty(tableInformativa.items) && !cadastroProposta"
                      v-model="licencaInformativa.licenca"
                      class="form-control"
                      placeholder="Selecione"
                      aria-hidden="true"
                      @change="changeLicencaInformativa()"
                  >
                  <option value="" disabled>Selecione</option>
                  <option v-for="tipo in tiposInformativa" :value="tipo.licenca">{{tipo.licenca}}</option>
                </select>
              </div>

              <label class="control-label f-required" v-if="licencaInformativa.licenca === 'Licença' && !editarLicencaInformativa">Selecione o Tipo de Licença:</label>
              <select v-if="licencaInformativa.licenca === 'Licença' && !editarLicencaInformativa"
                    name="Tipo de Ação"
                    v-model="licencaInformativa.licencaSelecao"
                    class="form-control"
                    placeholder="Selecione"
                    aria-hidden="true"
                    @change="changeLicencaInformativaSelecao()"
                >
                <option value="" disabled>Selecione</option>
                <option v-for="tipo in tiposSelecaoInformativa" :value="tipo.licenca">{{tipo.licenca}}</option>
              </select>

              <!-- v-if="!_.includes(['Obrigatório durante o prazo de execução do projeto', ''], licencaInformativa.licenca) && (!_.includes(['Prévia (LP)', 'Instalação (LI)', 'Licença de Alteração (LA)', '',  licencaInformativa.licencaSelecao]))"> -->
              <div class="column start-centered w-100" 
                v-if="!_.includes(['Obrigatório durante o prazo de execução do projeto', 'Licença', ''], licencaInformativa.licenca) && !editarLicencaInformativa && _.isEmpty(tableInformativa.items)">
                <g-button-ujarak color="primary" @click.native="toggleInformativo(true)" class="botao-editar-publico"><i class="fa fa-pencil" aria-hidden="true"></i>
                    {{ textoAnexoInformativo }}
                </g-button-ujarak>
              </div>
              <div class="column start-centered w-100" 
                v-if="!_.includes(['Obrigatório durante o prazo de execução do projeto', 'Licença', ''], licencaInformativa.licenca) && !editarLicencaInformativa && cadastroProposta">
                <g-button-ujarak color="primary" @click.native="toggleInformativo(true)" class="botao-editar-publico"><i class="fa fa-pencil" aria-hidden="true"></i>
                    {{ textoAnexoInformativo }}
                </g-button-ujarak>
              </div>
              <div class="column start-centered w-100" 
                v-if="_.includes(['Licença'], licencaInformativa.licenca) && (!_.includes(['Prévia (LP)', 'Instalação (LI)', 'Licença de Alteração (LA)', ''], licencaInformativa.licencaSelecao)) && !editarLicencaInformativa && !cadastroProposta  &&_.isEmpty(tableInformativa.items)">
                <g-button-ujarak color="primary" @click.native="toggleInformativo(true)" class="botao-editar-publico"><i class="fa fa-pencil" aria-hidden="true"></i>
                    {{ textoAnexoInformativo }}
                </g-button-ujarak>
              </div>
              <div class="column start-centered w-100" 
                v-if="_.includes(['Licença'], licencaInformativa.licenca) && (!_.includes(['Prévia (LP)', 'Instalação (LI)', 'Licença de Alteração (LA)', ''], licencaInformativa.licencaSelecao)) && !editarLicencaInformativa && cadastroProposta && _.isEmpty(tableInformativa.items)">
                <g-button-ujarak color="primary" @click.native="toggleInformativo(true)" class="botao-editar-publico"><i class="fa fa-pencil" aria-hidden="true"></i>
                    {{ textoAnexoInformativo }}
                </g-button-ujarak>
              </div>

              <div class="column start-centered w-100" v-if="!_.includes(['Obrigatório durante o prazo de execução do projeto', ''], licencaInformativa.licenca) && !editarLicencaInformativa">
                <label class="control-label">Documento cadastrado:</label>
                <b-table
                      show-empty
                      stacked="md"
                      striped
                      :bordered="tableInformativa.bordered"
                      :items="tableInformativa.items"
                      :hover="tableInformativa.hover"
                      :fields="tableInformativa.fields"
                      :filter="tableInformativa.filter"
                      :current-page="tableInformativa.currentPage"
                      :per-page="tableInformativa.perPage"
                      :sort-by.sync="tableInformativa.sortBy"
                      :sort-desc.sync="tableInformativa.sortDesc"
                      empty-text="Nenhum registro encontrado"
                >
                  <template slot="actions" scope="row">
                    <div>
                      <b-button type="button" @click="toggleInformativo(true, true)" class="btn btn-primary btn-sm btn-flat"
                              data-cy='edita-licenca-procedimento'><i class="fa fa-pencil" aria-hidden="true"></i> Editar</b-button>
                        <b-button type="button" v-confirm="{ok: retorno => excluiInformativa(row.item, row.index), cancel: doNothing,
                                message: 'Confirma Exclusão?'}" class="btn btn-danger btn-sm btn-flat"
                                data-cy='exclui-licenca-procedimento'><i class="fa fa-trash" aria-hidden="true"></i> Excluir</b-button>
                    </div>
                  </template>
                  <template  slot="validade" scope="row">
                    {{ row.value !== '' ? moment.utc(row.value).format('DD/MM/YYYY') : '-' }}
                  </template>
                  <template  slot="inclusao" scope="row">
                    {{ moment.utc(row.value).format('DD/MM/YYYY') }}
                  </template>
                  <template  slot="anexo" scope="row">
                    <a @click="onDownload(row.value[0])" href="javascript:void(0)" class="ng-binding"><i
                      class="fa fa-download" aria-hidden="true"></i> {{row.value[0].ds_nome_arquivo}}</a>
                  </template>

                </b-table>
              </div>

              <div v-if="editarLicencaInformativa" class="column start-centered edicao-container">

                  <label class="control-label">Anexo:</label>
                  <uploadLicencas 
                    :propDocumentos="licencaInformativa.anexo" 
                    class="w-100" 
                    localUso="LICENCIAMENTO_AMBIENTAL"
                    :maxFiles="1"
                  ></uploadLicencas>

                  <div v-if="licencaInformativa.licenca === 'Isento com base em legislação estadual/municipal'" class="w-100">
                    
                    <label class="control-label">Data da Vigência:</label>
                    <datepicker name="dataInicial" v-model="licencaInformativa.validade" input-class="form-control datepicker"
                                                        :language="$datePickerPtBR" maxlength="20" :use-utc="true" placeholder="__ /__ /____"
                                                        format="dd/MM/yyyy" v-validate="'required'">
                    </datepicker>

                    <label class="control-label f-required">Embasamento Legal:</label>
                    <input v-model="licencaInformativa.observacoes" placeholder="Embasamento da legislação local" class="form-control col" type="text">

                  </div>

                  <div v-if="licencaInformativa.licenca === 'Dispensa com base na legislação estadual/municipal'" class="w-100">
                    
                    <label class="control-label">Vigência da Dispensa:</label>
                    <datepicker name="dataInicial" v-model="licencaInformativa.validade" input-class="form-control datepicker"
                                                        :language="$datePickerPtBR" maxlength="20" :use-utc="true" placeholder="__ /__ /____"
                                                        format="dd/MM/yyyy" v-validate="'required'">
                    </datepicker>

                  </div>

                  <div v-if="licencaInformativa.licenca === 'Licença'" class="w-100">
                    
                    <label class="control-label">Data de Vigência:</label>
                    <datepicker name="dataInicial" v-model="licencaInformativa.validade" input-class="form-control datepicker"
                                                        :language="$datePickerPtBR" maxlength="20" :use-utc="true" placeholder="__ /__ /____"
                                                        format="dd/MM/yyyy" v-validate="'required'">
                    </datepicker>

                  </div>

                  <div class="row-flex centered-end w-100 sessao-salvar" v-if="editarLicencaInformativa">
                    <g-button-ujarak color="warning" @click.native="toggleInformativo(false, true)"><i class="fa fa-close" aria-hidden="true"></i>
                      Cancelar </g-button-ujarak>
                    <g-button-ujarak color="success" @click.native="adicionaInformativa()"><i class="fa fa-save" aria-hidden="true"></i>
                      Salvar </g-button-ujarak>
                  </div>

              </div>
    
              <!-- <div class="column start-centered f-mv-20">
                <label class="control-label" :class="licencaInformativa.licenca === 'Isento com base em legislação local' ? 'f-required' : ''">Possui Anexo?</label>
                <span>
                  <label class="radio-inline new-control new-control-radio" style="padding-top: 7px;">
                    <input type="radio" v-model="licencaInformativa.possuiAnexo" value="S" :disabled="licencaInformativa.licenca === 'Isento com base em legislação local'"> Sim
                    <div class="new-control-indicator"></div>
                  </label> 
                  <label class="radio-inline new-control new-control-radio" style="padding-top: 7px;">
                    <input type="radio" v-model="licencaInformativa.possuiAnexo" value="N" :disabled="licencaInformativa.licenca === 'Isento com base em legislação local'"> Não
                    <div class="new-control-indicator"></div>
                  </label>
                </span>
              </div>

              <div class="column start-centered w-100" v-if="licencaInformativa.possuiAnexo === 'S'">
                <label class="control-label">Anexo:</label>
                <uploadLicencas 
                  :propDocumentos="licencaInformativa.anexo" 
                  class="w-100" 
                  localUso="LICENCIAMENTO_AMBIENTAL"
                  :maxFiles="1"
                ></uploadLicencas>
              </div> -->

            </div>
          </div>
      </div>
      <!------------------ Informativo ----------------->

      <legend style="background-color: #fcfcfc"  v-if="mostrarDemaisLicencas">
        Procedimentos
      </legend>
      <label class="control-label f-required label-head"  v-if="mostrarDemaisLicencas">2 - Procedimento(s) de Licença(s) Ambiental(is) apresentada(s) na fase de análise (se houver condicionante de publicação para validade, esta comprovação deve ser anexada conjuntamente):</label>
        <!------------------ Procedimentos ----------------->
        
        <div class="column all-centered w-100 gap-10"  v-if="mostrarDemaisLicencas">
          <div class="column start-centered w-100" v-if="!editarLicencaProcedimentos">
            <g-button-ujarak color="primary" @click.native="toggleProcedimento(true)" class="botao-editar-publico"><i class="fa fa-pencil" aria-hidden="true"></i>
              Adicionar Procedimento 
            </g-button-ujarak>
          </div>
          <b-container fluid class="w-100" v-if="!editarLicencaProcedimentos">
            <!-- Main table element -->
            <b-table show-empty
                    stacked="md"
                    striped
                    :bordered="tableProcedimento.bordered"
                    :items="tableProcedimento.items"
                    :hover="tableProcedimento.hover"
                    :fields="tableProcedimento.fields"
                    :filter="tableProcedimento.filter"
                    :current-page="tableProcedimento.currentPage"
                    :per-page="tableProcedimento.perPage"
                    :sort-by.sync="tableProcedimento.sortBy"
                    :sort-desc.sync="tableProcedimento.sortDesc"
                    empty-text="Nenhum registro encontrado"
            >
              <template slot="actions" scope="row">
                <div>
                  <b-button type="button" @click="editaProcedimento(row.item, row.index)" class="btn btn-primary btn-sm btn-flat"
                          data-cy='edita-licenca-procedimento'><i class="fa fa-pencil" aria-hidden="true"></i> Editar</b-button>
                    <b-button type="button" v-confirm="{ok: retorno => excluiProcedimento(row.item, row.index), cancel: doNothing,
                            message: 'Confirma Exclusão?'}" class="btn btn-danger btn-sm btn-flat"
                            data-cy='exclui-licenca-procedimento'><i class="fa fa-trash" aria-hidden="true"></i> Excluir</b-button>
                </div>
              </template>
              <template  slot="validade" scope="row">
                {{ moment.utc(row.value).format('DD/MM/YYYY') }}
              </template>
              <template  slot="anexo" scope="row">
                <a @click="onDownload(row.value[0])" href="javascript:void(0)" class="ng-binding"><i
                  class="fa fa-download" aria-hidden="true"></i> {{row.value[0].ds_nome_arquivo}}</a>
              </template>
            </b-table>
          </b-container>
          
          <div v-if="editarLicencaProcedimentos" class="column start-centered edicao-container">
            <label class="control-label">Cadastro de procedimento </label>
            <div class="column start-centered w-100">
              <label class="control-label f-required">2 - Selecione o Procedimento: </label>
              <select name="Tipo de Ação"
                v-model="licencaTemplateProcedimento.licenca"
                class="form-control"
                placeholder="Selecione"
                aria-hidden="true"
              >
                <option value="" disabled>Selecione</option>
                <option v-for="tipo in tiposProcedimento" :value="tipo.licenca">{{tipo.licenca}}</option>
              </select>
            </div>
            <div class="column start-centered w-100">
              <label class="control-label f-required">Tipo de Procedimento: </label>
              <select name="Tipo de Ação"
                v-model="licencaTemplateProcedimento.tipo_procedimento"
                class="form-control"
                placeholder="Selecione"
                aria-hidden="true"
              >
                <option value="" disabled>Selecione</option>
                <option value="Monitoramento e Alteração">Monitoramento e Alteração</option>
                <option value="Tipo de Licença">Tipo de Licença</option>
                
              </select>
            </div>

            <div class="column start-centered w-100">
              <label class="control-label f-required">Anexo:</label>
              <uploadLicencas 
                :propDocumentos="licencaTemplateProcedimento.anexo" 
                class="w-100" 
                localUso="LICENCIAMENTO_AMBIENTAL"
                :maxFiles="1"
              ></uploadLicencas>
            </div>

            <div class="row-flex all-centered w-100 gap-10">
              <div class="w-20">
                <label class="control-label f-required">Vigência:</label>
                <!-- <input type="date" class="form-control" v-model="licencaTemplateProcedimento.validade"/> -->
                <datepicker name="dataInicial" v-model="licencaTemplateProcedimento.validade" input-class="form-control datepicker"
                                                   :language="$datePickerPtBR" maxlength="20" :use-utc="true" placeholder="__ /__ /____"
                                                   format="dd/MM/yyyy" v-validate="'required'">
                </datepicker>
              </div>
              <div class="w-80">
                <label class="control-label f-required">Justificativa:</label>
                <input type="text" class="form-control" placeholder="Justificativa da seleção" v-model="licencaTemplateProcedimento.observacoes"/>
              </div>
            </div>

            <div class="row-flex centered-end w-100 sessao-salvar" v-if="editarLicencaProcedimentos && !editandoLinhaProcedimento">
              <g-button-ujarak color="warning" @click.native="toggleProcedimento(false)"><i class="fa fa-close" aria-hidden="true"></i>
                Cancelar </g-button-ujarak>
              <g-button-ujarak color="success" @click.native="adicionarProcedimento()"><i class="fa fa-save" aria-hidden="true"></i>
                Adicionar </g-button-ujarak>
            </div>
            <div class="row-flex centered-end w-100 sessao-salvar" v-if="editarLicencaProcedimentos && editandoLinhaProcedimento">
              <g-button-ujarak color="warning" @click.native="toggleProcedimento(false)"><i class="fa fa-close" aria-hidden="true"></i>
                Cancelar </g-button-ujarak>
              <g-button-ujarak color="success" @click.native="salvarEdicaoProcedimento()"><i class="fa fa-save" aria-hidden="true"></i>
                Salvar Edição </g-button-ujarak>
            </div>
          </div>

        </div>
      <!------------------ Procedimentos ----------------->

      <!-- Licenciamento Ambiental -->
      <legend style="background-color: #fcfcfc"  v-if="mostrarDemaisLicencas">
            Licenças (ao decorrer ou ao final do projeto)
      </legend>
      <label class="control-label f-required label-head"  v-if="mostrarDemaisLicencas">3 - Quais Licenças Ambientais devem ser apresentadas no decorrer ou ao final da execução do projeto?</label>

      <div class="column all-centered w-100 gap-10"  v-if="mostrarDemaisLicencas">
          <div class="column start-centered w-100" v-if="!editarLicencaAmbiental">
            <g-button-ujarak color="primary" @click.native="toggleLicencaAmbiental(true)" class="botao-editar-publico"><i class="fa fa-pencil" aria-hidden="true"></i>
              Adicionar Licença 
            </g-button-ujarak>
          </div>
          <b-container fluid class="w-100" v-if="!editarLicencaAmbiental">
            <!-- Main table element -->
            <b-table show-empty
                    stacked="md"
                    striped
                    :bordered="tableLicencaAmbiental.bordered"
                    :items="tableLicencaAmbiental.items"
                    :hover="tableLicencaAmbiental.hover"
                    :fields="tableLicencaAmbiental.fields"
                    :filter="tableLicencaAmbiental.filter"
                    :current-page="tableLicencaAmbiental.currentPage"
                    :per-page="tableLicencaAmbiental.perPage"
                    :sort-by.sync="tableLicencaAmbiental.sortBy"
                    :sort-desc.sync="tableLicencaAmbiental.sortDesc"
                    empty-text="Nenhum registro encontrado"
            >
              <template slot="actions" scope="row">
                <div>
                  <b-button type="button" @click="editaLicencaAmbiental(row.item, row.index)" class="btn btn-primary btn-sm btn-flat"
                          data-cy='edita-licenca-procedimento'><i class="fa fa-pencil" aria-hidden="true"></i> Editar</b-button>
                    <b-button type="button" v-confirm="{ok: retorno => excluirLicencaAmbiental(row.item, row.index), cancel: doNothing,
                            message: 'Confirma Exclusão?'}" class="btn btn-danger btn-sm btn-flat"
                            data-cy='exclui-licenca-procedimento'><i class="fa fa-trash" aria-hidden="true"></i> Excluir</b-button>
                </div>
              </template>
              <template  slot="prazo_apresentacao" scope="row">
                {{ moment.utc(row.value).format('DD/MM/YYYY') }}
              </template>
              <template  slot="prazo_renovacao" scope="row">
                {{ row.value !== '' ? moment.utc(row.value).format('DD/MM/YYYY') : '-' }}
              </template>
              <template  slot="anexo" scope="row">
                <a @click="onDownload(row.value[0])" href="javascript:void(0)" class="ng-binding"><i
                  class="fa fa-download" aria-hidden="true"></i> {{row.value[0].ds_nome_arquivo}}</a>
              </template>
            </b-table>            
          </b-container>

          
          <div v-if="editarLicencaAmbiental" class="column start-centered edicao-container">
            <label class="control-label">Cadastro de Licença </label>
            <div class="column start-centered w-100">
              <label class="control-label f-required">2 - Selecione a Licença: </label>
              <select name="Tipo de Ação"
                v-model="licencaAmbientalTemplate.licenca"
                class="form-control"
                placeholder="Selecione"
                aria-hidden="true"
              >
                <option value="" disabled>Selecione</option>
                <option v-for="tipo in tiposAmbientais" :value="tipo.licenca">{{tipo.licenca}}</option>
              </select>
            </div>

            <div class="row-flex all-centered w-100 gap-10">
              <div class="w-20">
                <label class="control-label f-required">Vigência:</label>
                <!-- <input type="date" class="form-control" v-model="licencaTemplateProcedimento.validade"/> -->
                <datepicker name="dataInicial" v-model="licencaAmbientalTemplate.prazo_apresentacao" input-class="form-control datepicker"
                                                   :language="$datePickerPtBR" maxlength="20" :use-utc="true" placeholder="__ /__ /____"
                                                   format="dd/MM/yyyy" v-validate="'required'">
                </datepicker>
              </div>
              <div class="w-20"  v-if="licencaAmbientalTemplate.licenca === 'Licença de Operação (LO)'">
                <label class="control-label">Prazo de Renovação:</label>
                <!-- <input type="date" class="form-control" v-model="licencaTemplateProcedimento.validade"/> -->
                <datepicker name="dataInicial" v-model="licencaAmbientalTemplate.prazo_renovacao" input-class="form-control datepicker"
                                                   :language="$datePickerPtBR" maxlength="20" :use-utc="true" placeholder="__ /__ /____"
                                                   format="dd/MM/yyyy" v-validate="'required'">
                </datepicker>
              </div>


              <div class="column start-centered w-80">
                <label class="control-label f-required">Período de apresentação:</label>
                <span>
                  <label class="radio-inline new-control new-control-radio" style="padding-top: 7px;">
                    <input type="radio" v-model="licencaAmbientalTemplate.periodo_apresentacao" value="Ao decorrer do projeto"> Ao decorrer do projeto
                    <div class="new-control-indicator"></div>
                  </label> 
                  <label class="radio-inline new-control new-control-radio" style="padding-top: 7px;">
                    <input type="radio" v-model="licencaAmbientalTemplate.periodo_apresentacao" value="Ao final do projeto"> Ao final do projeto
                    <div class="new-control-indicator"></div>
                  </label>
                </span>
              </div>

            </div>

            <div class="row-flex centered-end w-100 sessao-salvar" v-if="editarLicencaAmbiental && !editandoLinhaLicencaAmbiental">
              <g-button-ujarak color="warning" @click.native="toggleLicencaAmbiental(false)"><i class="fa fa-close" aria-hidden="true"></i>
                Cancelar </g-button-ujarak>
              <g-button-ujarak color="success" @click.native="adicionarLicencaAmbiental()"><i class="fa fa-save" aria-hidden="true"></i>
                Adicionar </g-button-ujarak>
            </div>
            <div class="row-flex centered-end w-100 sessao-salvar" v-if="editarLicencaAmbiental && editandoLinhaLicencaAmbiental">
              <g-button-ujarak color="warning" @click.native="toggleLicencaAmbiental(false)"><i class="fa fa-close" aria-hidden="true"></i>
                Cancelar </g-button-ujarak>
              <g-button-ujarak color="success" @click.native="salvarEdicaoLicencaAmbiental()"><i class="fa fa-save" aria-hidden="true"></i>
                Salvar Edição </g-button-ujarak>
            </div>
            <label class="control-label label-head label-aviso"><b>Atenção</b>: o prazo de execução/vigência precisa abranger este período previsto para não haver futuros aditivos de prorrogação.</label>
          </div>
        </div>
      <!-- Licenciamento Ambiental -->

      <!-- Outras Licenças -->
      <legend style="background-color: #fcfcfc"  v-if="mostrarDemaisLicencas">
            Outras Licenças
      </legend>
      <label class="control-label label-head" v-if="mostrarDemaisLicencas">4 - Outros licenciamentos ou autorizações ou certificações a serem apresentados no decorrer ou ao final da execução do projeto:</label>

      <!-- Outras Licenças -->
      <div class="column all-centered w-100 gap-10" v-if="mostrarDemaisLicencas">
          <div class="column start-centered w-100" v-if="!editarLicencaOutras">
            <g-button-ujarak color="primary" @click.native="toggleLicencaOutras(true)" class="botao-editar-publico"><i class="fa fa-pencil" aria-hidden="true"></i>
              Adicionar Licença ou Autorização
            </g-button-ujarak>
          </div>
          <b-container fluid class="w-100" v-if="!editarLicencaOutras">
            <!-- Main table element -->
            <b-table show-empty
                    stacked="md"
                    striped
                    :bordered="tableLicencaOutra.bordered"
                    :items="tableLicencaOutra.items"
                    :hover="tableLicencaOutra.hover"
                    :fields="tableLicencaOutra.fields"
                    :filter="tableLicencaOutra.filter"
                    :current-page="tableLicencaOutra.currentPage"
                    :per-page="tableLicencaOutra.perPage"
                    :sort-by.sync="tableLicencaOutra.sortBy"
                    :sort-desc.sync="tableLicencaOutra.sortDesc"
                    empty-text="Nenhum registro encontrado"
            >
              <template slot="actions" scope="row">
                <div>
                  <b-button type="button" @click="editaLicencaOutras(row.item, row.index)" class="btn btn-primary btn-sm btn-flat"
                          data-cy='edita-licenca-procedimento'><i class="fa fa-pencil" aria-hidden="true"></i> Editar</b-button>
                    <b-button type="button" v-confirm="{ok: retorno => excluirLicencaOutro(row.item, row.index), cancel: doNothing,
                            message: 'Confirma Exclusão?'}" class="btn btn-danger btn-sm btn-flat"
                            data-cy='exclui-licenca-procedimento'><i class="fa fa-trash" aria-hidden="true"></i> Excluir</b-button>
                </div>
              </template>
              <template  slot="prazo_apresentacao" scope="row">
                {{ moment.utc(row.value).format('DD/MM/YYYY') }}
              </template>
              <template  slot="anexo" scope="row">
                <a @click="onDownload(row.value[0])" href="javascript:void(0)" class="ng-binding"><i
                  class="fa fa-download" aria-hidden="true"></i> {{row.value[0].ds_nome_arquivo}}</a>
              </template>
            </b-table>  
          </b-container>

          
          <div v-if="editarLicencaOutras" class="column start-centered edicao-container">
            <label class="control-label">Cadastro de outras Licenças ou autorizações </label>
            <div class="column start-centered w-100">
              <label class="control-label f-required">2 - Selecione a Licença ou Autorização: </label>
              <select name="Tipo de Ação"
                v-model="licencaOutrasTemplate.licenca"
                class="form-control"
                placeholder="Selecione"
                aria-hidden="true"
              >
                <option value="" disabled>Selecione</option>
                <option v-for="tipo in tiposOutras" :value="tipo.licenca">{{tipo.licenca}}</option>
              </select>
            </div>

            <div class="row-flex all-centered w-100 gap-10">
              <div class="w-20">
                <label class="control-label f-required">Data de Apresentação da Licença:</label>
                <datepicker name="dataInicial" v-model="licencaOutrasTemplate.prazo_apresentacao" input-class="form-control datepicker"
                                                   :language="$datePickerPtBR" maxlength="20" :use-utc="true" placeholder="__ /__ /____"
                                                   format="dd/MM/yyyy" v-validate="'required'">
                </datepicker>
              </div>


              <div class="column start-centered w-80">
                <label class="control-label f-required">Período de apresentação:</label>
                <span>
                  <label class="radio-inline new-control new-control-radio" style="padding-top: 7px;">
                    <input type="radio" v-model="licencaOutrasTemplate.periodo_apresentacao" value="Ao decorrer do projeto"> Ao decorrer do projeto
                    <div class="new-control-indicator"></div>
                  </label> 
                  <label class="radio-inline new-control new-control-radio" style="padding-top: 7px;">
                    <input type="radio" v-model="licencaOutrasTemplate.periodo_apresentacao" value="Ao final do projeto"> Ao final do projeto
                    <div class="new-control-indicator"></div>
                  </label>
                </span>
              </div>

              
            </div>
            <div class="w-100">
              <label class="control-label f-required">Justificativa:</label>
              <input type="text" class="form-control" placeholder="Justificativa da seleção" v-model="licencaOutrasTemplate.observacoes"/>
            </div>

            <div class="row-flex centered-end w-100 sessao-salvar" v-if="editarLicencaOutras && !editandoLinhaLicencaOutras">
              <g-button-ujarak color="warning" @click.native="toggleLicencaOutras(false)"><i class="fa fa-close" aria-hidden="true"></i>
                Cancelar </g-button-ujarak>
              <g-button-ujarak color="success" @click.native="adicionarLicencaOutra()"><i class="fa fa-save" aria-hidden="true"></i>
                Adicionar </g-button-ujarak>
            </div>
            <div class="row-flex centered-end w-100 sessao-salvar" v-if="editarLicencaOutras && editandoLinhaLicencaOutras">
              <g-button-ujarak color="warning" @click.native="toggleLicencaOutras(false)"><i class="fa fa-close" aria-hidden="true"></i>
                Cancelar </g-button-ujarak>
              <g-button-ujarak color="success" @click.native="salvarEdicaoLicencaOutros()"><i class="fa fa-save" aria-hidden="true"></i>
                Salvar Edição </g-button-ujarak>
            </div>
            <label class="control-label label-head label-aviso"><b>Atenção</b>: o prazo de execução/vigência precisa abranger este período previsto para não haver futuros aditivos de prorrogação.</label>
          </div>
        </div>


      <legend style="background-color: #fcfcfc" v-if="!cadastroProposta">
        Estoque
      </legend>
      <label class="control-label label-head" v-if="!cadastroProposta">5 - Estoque Passivo GEIMP:</label>
        <!------------------ Estoque ----------------->
        
        <div class="column all-centered w-100 gap-10">
          <div class="column start-centered w-100" v-if="!editarLicencaEstoque && !cadastroProposta">
            <g-button-ujarak color="primary" @click.native="toggleEstoque(true)" class="botao-editar-publico"><i class="fa fa-pencil" aria-hidden="true"></i>
              Adicionar Licença Estoque 
            </g-button-ujarak>
          </div>
          <b-container fluid class="w-100" v-if="!editarLicencaEstoque && !cadastroProposta">
            <!-- Main table element -->
            <b-table show-empty
                    stacked="md"
                    striped
                    :bordered="tableEstoque.bordered"
                    :items="tableEstoque.items"
                    :hover="tableEstoque.hover"
                    :fields="tableEstoque.fields"
                    :filter="tableEstoque.filter"
                    :current-page="tableEstoque.currentPage"
                    :per-page="tableEstoque.perPage"
                    :sort-by.sync="tableEstoque.sortBy"
                    :sort-desc.sync="tableEstoque.sortDesc"
                    empty-text="Nenhum registro encontrado"
            >
              <template slot="actions" scope="row">
                <div>
                  <b-button type="button" @click="editaEstoque(row.item, row.index)" class="btn btn-primary btn-sm btn-flat"
                          data-cy='edita-licenca-procedimento'><i class="fa fa-pencil" aria-hidden="true"></i> Editar</b-button>
                    <b-button type="button" v-confirm="{ok: retorno => excluiEstoque(row.item, row.index), cancel: doNothing,
                            message: 'Confirma Exclusão?'}" class="btn btn-danger btn-sm btn-flat"
                            data-cy='exclui-licenca-procedimento'><i class="fa fa-trash" aria-hidden="true"></i> Excluir</b-button>
                </div>
              </template>
              <template  slot="validade" scope="row">
                {{ moment.utc(row.value).format('DD/MM/YYYY') }}
              </template>
              <template  slot="anexo" scope="row">
                <a @click="onDownload(row.value)" href="javascript:void(0)" class="ng-binding"><i
                  class="fa fa-download" aria-hidden="true"></i> {{row.value.ds_nome_arquivo}}</a>
              </template>
            </b-table>
          </b-container>
          
          <div v-if="editarLicencaEstoque" class="column start-centered edicao-container">
            <label class="control-label">Cadastro de procedimento </label>
            <div class="column start-centered w-100">
              <label class="control-label f-required">Selecione o Documento: </label>
              <select name="Tipo de Ação"
                v-model="licencaTemplateEstoque.licenca"
                class="form-control"
                placeholder="Selecione"
                aria-hidden="true"
              >
                <option value="" disabled>Selecione</option>
                <option v-for="tipo in tiposLicencaTodos" :value="tipo.licenca">{{tipo.licenca}}</option>
              </select>
            </div>

            <div class="column start-centered w-100">
              <label class="control-label f-required">Anexo:</label>
              <uploadLicencas 
                :propDocumentos="licencaTemplateEstoque.anexo" 
                class="w-100" 
                localUso="LICENCIAMENTO_AMBIENTAL"
                :maxFiles="1"
              ></uploadLicencas>
            </div>

            <div class="row-flex all-centered w-100 gap-10">
              <div class="w-20">
                <label class="control-label f-required">Vigência:</label>
                <datepicker name="dataInicial" v-model="licencaTemplateEstoque.validade" input-class="form-control datepicker"
                                                   :language="$datePickerPtBR" maxlength="20" :use-utc="true" placeholder="__ /__ /____"
                                                   format="dd/MM/yyyy" v-validate="'required'">
                </datepicker>
              </div>
              <div class="w-80">
                <label class="control-label f-required">Observação:</label>
                <input type="text" class="form-control" placeholder="Justificativa da seleção" v-model="licencaTemplateEstoque.observacoes"/>
              </div>
            </div>

            <div class="row-flex centered-end w-100 sessao-salvar" v-if="editarLicencaEstoque && !editandoLinhaEstoque">
              <g-button-ujarak color="warning" @click.native="toggleEstoque(false)"><i class="fa fa-close" aria-hidden="true"></i>
                Cancelar </g-button-ujarak>
              <g-button-ujarak color="success" @click.native="adicionarEstoque()"><i class="fa fa-save" aria-hidden="true"></i>
                Adicionar </g-button-ujarak>
            </div>
            <div class="row-flex centered-end w-100 sessao-salvar" v-if="editarLicencaEstoque && editandoLinhaEstoque">
              <g-button-ujarak color="warning" @click.native="toggleEstoque(false)"><i class="fa fa-close" aria-hidden="true"></i>
                Cancelar </g-button-ujarak>
              <g-button-ujarak color="success" @click.native="salvarEdicaoEstoque()"><i class="fa fa-save" aria-hidden="true"></i>
                Salvar Edição </g-button-ujarak>
            </div>
          </div>

        </div>
      <!------------------ Estoque ----------------->


      <div class="row end-centered">
        <g-button-ujarak color="success" @click.native="salvarLicencas()" class="botao-editar-publico"><i class="fa fa-save" aria-hidden="true"></i>
          Salvar Licenças </g-button-ujarak>
      </div>
   </div>
 </template>
   
 <script>
 import uploadLicencas from './uploadLicencas.vue'
 import moment from 'moment'
 import download from 'downloadjs'
 import { mapGetters } from 'vuex'

 export default {
   name: 'cadastroLicencas',
   components: {
     uploadLicencas
   },
   data () {
     return {
       moment: moment,
       loading: {
         show: false
       },
       documentos: [],
       editarLicencas: false,
       editarLicencaInformativa: false,
       editarLicencaProcedimentos: false,
       editarLicencaEstoque: false,
       editandoLinhaProcedimento: false,
       editarLicencaAmbiental: false,
       editandoLinhaLicencaAmbiental: false,
       editarLicencaOutras: false,
       editandoLinhaLicencaOutras: false,
       editandoLinhaEstoque: false,
       indicativo: '',
       textoAnexoInformativo: '',
       justificativaIndicativo: '',
       mostrarDemaisLicencas: false,
       indexEdicao: 0,
       tiposLicenca: [],
       tiposLicencaTodos: [],
       tiposSelecaoInformativa: [],
       tiposInformativa: [],
       tiposProcedimento: [],
       tiposAmbientais: [],
       tiposOutras: [],
       licencaInformativa: {
         id: null,
         licenca: '',
         licencaSelecao: '',
         tipo_licenca: 'INFORMATIVA',
         fase_proposta: 'ANALISE',
         periodo_apresentacao: 'Análise',
         status: 'Informado pela Analise',
         data_apresentacao: '',
         possuiAnexo: 'N',
         validade: '',
         documento: null,
         anexo: [],
         inclusao: '',
         observacoes: '',
         responsavel: ''
       },
       licencaTemplateBackup: {},
       licencaTemplateProcedimento: {
         id: null,
         licenca: '',
         tipo_licenca: 'PROCEDIMENTO',
         fase_proposta: 'ANALISE',
         periodo_apresentacao: 'Análise',
         tipo_procedimento: '',
         prazo_apresentacao: '',
         data_apresentacao: '',
         validade: '',
         status: 'Informado pela Analise',
         documento: null,
         anexo: [],
         observacoes: '',
         responsavel: ''
       },
       licencaTemplateEstoque: {
         id: null,
         licenca: '',
         tipo_licenca: 'PROCEDIMENTO',
         fase_proposta: 'ESTOQUE',
         periodo_apresentacao: 'Estoque',
         tipo_procedimento: '',
         prazo_apresentacao: '',
         data_apresentacao: '',
         validade: '',
         status: 'Informado pela FBB',
         documento: null,
         anexo: [],
         observacoes: '',
         responsavel: ''
       },
       licencaAmbientalTemplate: {
         id: null,
         licenca: '',
         tipo_licenca: 'LICENCA_AMBIENTAL',
         fase_proposta: '',
         periodo_apresentacao: '',
         prazo_apresentacao: '',
         prazo_renovacao: '',
         validade: '',
         status: 'Aguardando Envio',
         documento: null,
         anexo: [],
         observacoes: '',
         responsavel: ''
       },
       licencaOutrasTemplate: {
         id: null,
         licenca: '',
         tipo_licenca: 'OUTRAS',
         fase_proposta: '',
         periodo_apresentacao: '',
         prazo_apresentacao: '',
         validade: '',
         status: 'Aguardando Envio',
         documento: null,
         anexo: [],
         observacoes: '',
         responsavel: ''
       },
       licencasProcedimento: [],
       licencasAmbientais: [],
       licencasOutras: [],
       licencasEstoque: [],
       licencasGravadas: [],
       tableInformativa: {
         items: this.licencaInformativa,
         filter: null,
         hover: true,
         bordered: true,
         currentPage: 1,
         perPage: 10,
         fields: [
             { key: 'licenca', label: 'Licença/Informativo', sortable: true, thStyle: 'text-align: center', class: 'text-center' },
             { key: 'validade', label: 'Data de Validade', sortable: true, thStyle: 'text-align: center', class: 'text-center' },
             { key: 'inclusao', label: 'Data de Inclusão', sortable: true, thStyle: 'text-align: center', class: 'text-center' },
             { key: 'anexo', label: 'Documento', sortable: true, thStyle: 'text-align: center', class: 'text-center' },
             { key: 'actions', label: 'Ações', thStyle: 'text-align: center', class: 'text-center' }
         ]
       },
       tableProcedimento: {
         items: this.licencasProcedimento,
         filter: null,
         hover: true,
         bordered: true,
         currentPage: 1,
         perPage: 10,
         fields: [
             { key: 'licenca', label: 'Procedimento', sortable: true, thStyle: 'text-align: center', class: 'text-center' },
             { key: 'validade', label: 'Vigência', sortable: true, thStyle: 'text-align: center', class: 'text-center' },
             { key: 'anexo', label: 'Documento', sortable: true, thStyle: 'text-align: center', class: 'text-center' },
             { key: 'actions', label: 'Ações', thStyle: 'text-align: center', class: 'text-center' }
         ]
       },
       tableEstoque: {
         items: this.licencasProcedimento,
         filter: null,
         hover: true,
         bordered: true,
         currentPage: 1,
         perPage: 10,
         fields: [
             { key: 'licenca', label: 'Procedimento', sortable: true, thStyle: 'text-align: center', class: 'text-center' },
             { key: 'validade', label: 'Vigência', sortable: true, thStyle: 'text-align: center', class: 'text-center' },
             { key: 'anexo', label: 'Documento', sortable: true, thStyle: 'text-align: center', class: 'text-center' },
             { key: 'actions', label: 'Ações', thStyle: 'text-align: center', class: 'text-center' }
         ]
       },
       tableLicencaAmbiental: {
         items: this.licencasAmbientais,
         filter: null,
         hover: true,
         bordered: true,
         currentPage: 1,
         perPage: 10,
         fields: [
             { key: 'licenca', label: 'Licença', sortable: true, thStyle: 'text-align: center', class: 'text-center' },
             { key: 'prazo_apresentacao', label: 'Vigência', sortable: true, thStyle: 'text-align: center', class: 'text-center' },
             { key: 'prazo_renovacao', label: 'Prazo Renovação', sortable: true, thStyle: 'text-align: center', class: 'text-center' },
             { key: 'periodo_apresentacao', label: 'Período Apresentação', sortable: true, thStyle: 'text-align: center', class: 'text-center' },
             { key: 'actions', label: 'Ações', thStyle: 'text-align: center', class: 'text-center' }
         ]
       },
       tableLicencaOutra: {
         items: this.licencasOutras,
         filter: null,
         hover: true,
         bordered: true,
         currentPage: 1,
         perPage: 10,
         fields: [
             { key: 'licenca', label: 'Licença', sortable: true, thStyle: 'text-align: center', class: 'text-center' },
             { key: 'prazo_apresentacao', label: 'Prazo Apresentação', sortable: true, thStyle: 'text-align: center', class: 'text-center' },
             { key: 'periodo_apresentacao', label: 'Período Apresentação', sortable: true, thStyle: 'text-align: center', class: 'text-center' },
             { key: 'actions', label: 'Ações', thStyle: 'text-align: center', class: 'text-center' }
         ]
       }
     }
   },
   props: {
     idProposta: Number,
     cadastroProposta: {
       type: Boolean,
       default: false
     },
     fecharAnalise: {
       type: Function,
       default: () => {
         return () => {
           console.log('Função padrão')
         }
       }
     }
   },
   computed: {
     ...mapGetters([
       'usuarioLogado'
     ])
   },
   watch: {
    //  indicativo () {
    //    this.changeIndicativo()
    //  }
     idProposta () {
       this.consultaIndicativoLicenciamento()
       this.buscaTipoLicencas()
       this.consultaLicencasProposta()
     }
   },
   mounted: function () {
     this.consultaIndicativoLicenciamento()
     this.buscaTipoLicencas()
     this.consultaLicencasProposta()
   },
   methods: {
     buscaTipoLicencas () {
       this.loading.show = true
       axiosLaravel.get('/licenciamento/tiposLicenca').then((response) => {
         this.tiposLicenca = response.data
         this.tiposLicenca = _.groupBy(this.tiposLicenca, 'tipo')
         this.tiposInformativa = this.tiposLicenca['Informativa']
         this.tiposSelecaoInformativa = this.tiposLicenca['Seleção']
         this.tiposProcedimento = this.tiposLicenca['Procedimento']
         this.tiposAmbientais = this.tiposLicenca['Licença Ambiental']
         this.tiposOutras = this.tiposLicenca['Outros']
         this.tiposLicencaTodos = [].concat(
            this.tiposInformativa,
            this.tiposProcedimento,
            this.tiposAmbientais,
            this.tiposOutras
          )
         this.loading.show = false
       })
        .catch((error) => {
          this.$root.trataErro(error)
          this.loading.show = false
        })
     },
     changeLicencaInformativa () {
       if (this.licencaInformativa.licenca === 'Isento com base em legislação estadual/municipal' || this.licencaInformativa.licenca === 'Dispensa com base na legislação estadual/municipal') {
         this.textoAnexoInformativo = 'Anexar Documento Legal'
       }
       if (this.licencaInformativa.licenca === 'Licença') {
         this.textoAnexoInformativo = 'Anexar Licença'
         this.licencaInformativa.licencaSelecao = ''
       }
       if (this.licencaInformativa.licenca === 'Obrigatório durante o prazo de execução do projeto' && !this.cadastroProposta) {
         this.mostrarDemaisLicencas = true
       } else {
         this.mostrarDemaisLicencas = false
       }
     },
     changeLicencaInformativaSelecao () {
       if (_.includes(['Prévia (LP)', 'Instalação (LI)', 'Licença de Alteração (LA)'], this.licencaInformativa.licencaSelecao)) {
         this.licencaInformativa.licenca = 'Obrigatório durante o prazo de execução do projeto'
         this.mostrarDemaisLicencas = true
       } else {
         this.mostrarDemaisLicencas = false
       }
     },
     salvarLicencas () {
      // Verifica campos requeridos
       if (this.indicativo === 'Não') {
         if (this.justificativaIndicativo === '') {
           this.$snotify.error('Preencha a justificativa antes de continuar.')
           return false
         }
         this.gravarIndicativoLicenciamento()
         this.consultaLicencasProposta()
         return
       } else if (this.indicativo === 'Sim') {
         if (this.licencaInformativa.licenca === 'Obrigatório durante o prazo de execução do projeto' && !this.cadastroProposta && (this.licencasAmbientais.length === 0 || this.licencasProcedimento.length === 0)) {
           this.$snotify.error('Cadastre as demais Licenças Obrigatórias durante o prazo de execução do projeto para continuar.')
           return false
         }
       }
       if (!this.verificaCampos()) {
         this.$snotify.error('[LICENCIAMENTO]Existem campos obrigatórios não preenchidos, favor verificar.')
         return false
       }
       if (this.gravarIndicativoLicenciamento() === false) {
         this.$snotify.error('Selecione o Indicativo de Licenciamento e tente novamente.')
         return false
       }
      //  this.licencasProcedimento.forEach((procedimento) => {
      //    procedimento.validade = moment.utc(procedimento.validade).format('DD/MM/YYYY')
      //  })

       if (this.licencaInformativa.validade !== '') {
         this.licencaInformativa.validade = moment.utc(this.licencaInformativa.validade).format('YYYY-MM-DD')
       }
       if (this.cadastroProposta) {
         this.licencaInformativa.status = 'Informado pela Entidade'
       }
       this.loading.show = true
      // Cria objeto de request
       let licencas = {
         idProposta: this.idProposta,
         licencaInformativa: this.licencaInformativa,
         licencasProcedimento: this.licencasProcedimento,
         licencasAmbientais: this.licencasAmbientais,
         licencasOutras: this.licencasOutras,
         licencasEstoque: this.licencasEstoque,
         responsavel: this.usuarioLogado.ds_nome_usuario
       }
       this.$snotify.clear()
       this.$snotify.async('Gravando informações de Licenciamento Ambiental na base. Por favor, aguarde...', {timeout: 0})
       axiosLaravel.post('/licenciamento/gravarLicencas', licencas).then((response) => {
         this.$snotify.clear()
         this.$snotify.success(response.data)
         this.fecharAnalise()
         this.consultaLicencasProposta()
         return true
        //  this.loading.show = false
       })
        .catch((error) => {
          this.$root.trataErro(error)
          this.$snotify.clear()
          this.$snotify.error(error)
          this.loading.show = false
        })
     },
     verificaCampos () {
       console.log('Verificando campos das Licenças ...')
       // Verifica campos da Licença Informativa
       if (this.licencaInformativa.licenca === '') {
         return false
       }
       if (this.licencaInformativa.licenca === 'Licença' && this.licencaInformativa.licencaSelecao === '') {
         return false
       }
       if (this.licencaInformativa.possuiAnexo === 'S' && this.licencaInformativa.anexo.length === 0) {
         return false
       }
       // Verifica se existem outras licenças nos demais objetos
       return true
     },
     consultaLicencasProposta () {
       console.log('Consulta licenças')
       this.loading.show = true
       axiosLaravel.get('/licenciamento/consultaLicencasProposta/' + this.idProposta).then((response) => {
         // console.log(response.data)
         // this.loading.show = false
         if (response.data.length > 0) {
           this.initLicencas(response.data)
         } else {
           this.loading.show = false
         }
       })
        .catch((error) => {
          this.$root.trataErro(error)
          this.loading.show = false
        })
     },
     initLicencas (licencasBase) {
       console.log('Init Licenças')
       // Separa as licenças gravadas por tipo
       this.licencasGravadas = _.groupBy(licencasBase, 'tipo_licenca')
       console.log('Licencas Gravadas', this.licencasGravadas)
       // Licença informativa
       if (_.has(this.licencasGravadas, 'INFORMATIVA')) {
         let informativa = this.licencasGravadas['INFORMATIVA'][0]
         this.licencaInformativa = {
           id: informativa.id,
           licenca: _.includes(['Licença de Operação (LO)', 'Licença Simplificada (LS)', 'Licença Única (LU)'], informativa.licenca) ? 'Licença' : informativa.licenca,
           licencaSelecao: _.includes(['Licença de Operação (LO)', 'Licença Simplificada (LS)', 'Licença Única (LU)'], informativa.licenca) ? informativa.licenca : '',
           tipo_licenca: 'INFORMATIVA',
           fase_proposta: 'ANALISE',
           periodo_apresentacao: 'Análise',
           status: 'Informado pela Analise',
           possuiAnexo: _.isNull(informativa.documento) ? 'N' : 'S',
           documento: _.isNull(informativa.documento) ? null : informativa.documento,
           anexo: _.isNull(informativa.documento) ? [] : [informativa.anexo],
           validade: _.isNull(informativa.validade) ? '' : informativa.validade,
           inclusao: _.isNull(informativa.documento) ? '' : informativa.anexo.dt_criado,
           observacoes: informativa.observacoes
         }
         if (_.includes(['Licença de Operação (LO)', 'Licença Simplificada (LS)', 'Licença Única (LU)'], informativa.licenca)) {
           this.tableInformativa.items = [this.licencaInformativa]
         }
       }
       if (_.has(this.licencasGravadas, 'PROCEDIMENTO')) {
         let procedimentos = this.licencasGravadas['PROCEDIMENTO']
         procedimentos.forEach((procedimento) => {
           procedimento.anexo = [procedimento.anexo]
         })
         this.licencasProcedimento = procedimentos
       }
       if (_.has(this.licencasGravadas, 'LICENCA_AMBIENTAL')) {
         let licencasAmbientais = this.licencasGravadas['LICENCA_AMBIENTAL']
         this.licencasAmbientais = licencasAmbientais
       }
       if (_.has(this.licencasGravadas, 'OUTRAS')) {
         let licencasOutras = this.licencasGravadas['OUTRAS']
         this.licencasOutras = licencasOutras
       }
       if (_.has(this.licencasGravadas, 'ESTOQUE')) {
         let licencasEstoque = this.licencasGravadas['ESTOQUE']
         this.licencasEstoque = licencasEstoque
       }
       console.log('licença informativa', this.licencaInformativa)
       console.log('licenca Procedimento', this.licencasProcedimento)
       console.log('licenca Ambiental', this.licencasAmbientais)
       console.log('Outras licenças', this.licencasOutras)
       console.log('Estoque ', this.licencasEstoque)
       this.loading.show = false
       this.tableProcedimento.items = this.licencasProcedimento
       this.tableLicencaAmbiental.items = this.licencasAmbientais
       this.tableLicencaOutra.items = this.licencasOutras
       this.tableEstoque.items = this.licencasEstoque

       if (this.licencaInformativa.licenca === 'Obrigatório durante o prazo de execução do projeto' && !this.cadastroProposta) {
         this.mostrarDemaisLicencas = true
       } else {
         this.mostrarDemaisLicencas = false
       }

       this.$forceUpdate()
     },
     toggleInformativo (valor, edicao = false) {
       this.editarLicencaInformativa = valor
       if (edicao === false) {
         this.licencaInformativa.validade = ''
         this.licencaInformativa.observacoes = ''
       }
     },
     toggleProcedimento (valor, edicao = false) {
       this.editandoLinhaProcedimento = false
       this.editarLicencaProcedimentos = valor
       if (edicao === false) {
         this.limparCamposProcedimento()
       }
     },
     toggleEstoque (valor, edicao = false) {
       this.editandoLinhaEstoque = false
       this.editarLicencaEstoque = valor
       if (edicao === false) {
         this.limparCamposEstoque()
       }
     },
     toggleLicencaAmbiental (valor, edicao = false) {
       this.editandoLinhaLicencaAmbiental = false
       this.editarLicencaAmbiental = valor
       if (edicao === false) {
         this.limparCamposLicencaAmbiental()
       }
     },
     toggleLicencaOutras (valor, edicao = false) {
       this.editandoLinhaLicencaOutras = false
       this.editarLicencaOutras = valor
       if (edicao === false) {
         this.limparCamposLicencaOutras()
       }
     },
     adicionarProcedimento () {
       // Verifica campos preenchidos
       if (!this.verificaCamposProcedimento()) {
         this.$snotify.error('[LICENCIAMENTO]Existem campos obrigatórios não preenchidos, favor verificar antes de adicionar um procedimento.')
         return
       }
       this.licencaTemplateProcedimento.validade = moment.utc(this.licencaTemplateProcedimento.validade).format('YYYY-MM-DD')
       this.licencaTemplateProcedimento.data_apresentacao = moment.utc(new Date()).format('YYYY-MM-DD')
       // Grava a linha do procedimento no array
       this.licencasProcedimento.push(this.licencaTemplateProcedimento)
       // Reseta linha
       this.licencaTemplateProcedimento = {
         id: null,
         licenca: '',
         tipo_licenca: 'PROCEDIMENTO',
         fase_proposta: 'ANALISE',
         periodo_apresentacao: 'Análise',
         tipo_procedimento: '',
         prazo_apresentacao: '',
         data_apresentacao: '',
         validade: '',
         status: 'Informado pela Analise',
         documento: null,
         anexo: [],
         observacoes: ''
       }
       this.tableProcedimento.items = this.licencasProcedimento
       this.toggleProcedimento(false)
       this.$forceUpdate()
     },
     adicionarEstoque () {
       // Verifica campos preenchidos
       if (!this.verificaCamposEstoque()) {
         this.$snotify.error('[LICENCIAMENTO]Existem campos obrigatórios não preenchidos, favor verificar antes de adicionar um procedimento.')
         return
       }
       this.licencaTemplateEstoque.validade = moment.utc(this.licencaTemplateEstoque.validade).format('YYYY-MM-DD')
       this.licencaTemplateEstoque.data_apresentacao = moment.utc(new Date()).format('YYYY-MM-DD')
       // Grava a linha do procedimento no array
       this.licencasEstoque.push(this.licencaTemplateEstoque)
       // Reseta linha
       this.licencaTemplateEstoque = {
         id: null,
         licenca: '',
         tipo_licenca: 'PROCEDIMENTO',
         fase_proposta: 'ESTOQUE',
         periodo_apresentacao: 'Estoque',
         tipo_procedimento: '',
         prazo_apresentacao: '',
         data_apresentacao: '',
         validade: '',
         status: 'Informado pela FBB',
         documento: null,
         anexo: [],
         observacoes: '',
         responsavel: ''
       }
       this.tableEstoque.items = this.licencasEstoque
       this.toggleEstoque(false)
       this.$forceUpdate()
     },
     adicionaInformativa () {
       // Verifica campos preenchidos
       if (!this.verificaCamposInformativa()) {
         this.$snotify.error('[LICENCIAMENTO]Existem campos obrigatórios não preenchidos, favor verificar antes de adicionar um procedimento.')
         return
       }
       console.log('validade', this.licencaInformativa.validade)
       if (this.licencaInformativa.validade !== '') {
         this.licencaInformativa.validade = moment.utc(this.licencaInformativa.validade).format('YYYY-MM-DD')
       }
       this.licencaInformativa.data_apresentacao = moment.utc(new Date()).format('YYYY-MM-DD')
       this.licencaInformativa.inclusao = moment.utc(this.licencaInformativa.anexo[0].dt_criado).format('YYYY-MM-DD')
       // Grava a linha do procedimento no array
       //  this.licencasProcedimento.push(this.licencaTemplateProcedimento)
       // Reseta linha
      //  this.licencaTemplateProcedimento = {
      //    id: null,
      //    licenca: '',
      //    tipo_licenca: 'PROCEDIMENTO',
      //    fase_proposta: 'ANALISE',
      //    periodo_apresentacao: 'Análise',
      //    prazo_apresentacao: '',
      //    data_apresentacao: '',
      //    validade: '',
      //    status: 'Informado pela Analise',
      //    documento: null,
      //    anexo: [],
      //    observacoes: ''
      //  }
       this.tableInformativa.items = [this.licencaInformativa]
       this.toggleInformativo(false, true)
       this.$forceUpdate()
     },
     adicionarLicencaAmbiental () {
       // Verifica campos preenchidos
       console.log(this.licencaAmbientalTemplate)
       if (!this.verificaCamposLicencaAmbiental()) {
         this.$snotify.error('[LICENCIAMENTO]Existem campos obrigatórios não preenchidos, favor verificar antes de adicionar um procedimento.')
         return
       }
       if (this.licencaAmbientalTemplate.periodo_apresentacao === 'Ao decorrer do projeto') {
         this.licencaAmbientalTemplate.fase_proposta = 'PROJETO'
       } else {
         this.licencaAmbientalTemplate.fase_proposta = 'ENCERRAMENTO'
       }
       this.licencaAmbientalTemplate.prazo_apresentacao = moment.utc(this.licencaAmbientalTemplate.prazo_apresentacao).format('YYYY-MM-DD')
       if (this.licencaAmbientalTemplate.prazo_renovacao !== '') {
         this.licencaAmbientalTemplate.prazo_renovacao = moment.utc(this.licencaAmbientalTemplate.prazo_renovacao).format('YYYY-MM-DD')
       }
       // Grava a linha do procedimento no array
       this.licencasAmbientais.push(this.licencaAmbientalTemplate)
       // Reseta linha
       this.licencaAmbientalTemplate = {
         id: null,
         licenca: '',
         tipo_licenca: 'LICENCA_AMBIENTAL',
         fase_proposta: '',
         periodo_apresentacao: '',
         prazo_apresentacao: '',
         prazo_renovacao: '',
         validade: '',
         status: 'Aguardando Envio',
         documento: null,
         anexo: [],
         observacoes: ''
       }
       this.tableLicencaAmbiental.items = this.licencasAmbientais
       this.toggleLicencaAmbiental(false)
       this.$forceUpdate()
     },
     adicionarLicencaOutra () {
       // Verifica campos preenchidos
       console.log(this.licencaOutrasTemplate)
       if (!this.verificaCamposLicencaOutras()) {
         this.$snotify.error('[LICENCIAMENTO]Existem campos obrigatórios não preenchidos, favor verificar antes de adicionar um procedimento.')
         return
       }
       if (this.licencaOutrasTemplate.periodo_apresentacao === 'Ao decorrer do projeto') {
         this.licencaOutrasTemplate.fase_proposta = 'PROJETO'
       } else {
         this.licencaOutrasTemplate.fase_proposta = 'ENCERRAMENTO'
       }
       this.licencaOutrasTemplate.prazo_apresentacao = moment.utc(this.licencaOutrasTemplate.prazo_apresentacao).format('YYYY-MM-DD')
       // Grava a linha do procedimento no array
       this.licencasOutras.push(this.licencaOutrasTemplate)
       // Reseta linha
       this.licencaOutrasTemplate = {
         id: null,
         licenca: '',
         tipo_licenca: 'LICENCA_AMBIENTAL',
         fase_proposta: '',
         periodo_apresentacao: '',
         prazo_apresentacao: '',
         validade: '',
         status: 'Aguardando Envio',
         documento: null,
         anexo: [],
         observacoes: ''
       }
       this.tableLicencaOutra.items = this.licencasOutras
       this.toggleLicencaOutras(false)
       this.$forceUpdate()
     },
     verificaCamposInformativa () {
       if (this.licencaInformativa.licenca === '') {
         return false
       }
       if (this.licencaInformativa.anexo.length === 0) {
         return false
       }
       if (this.licencaInformativa.licenca === 'Isento com base em legislação estadual/municipal') {
         if (this.licencaInformativa.observacoes === '') {
           return false
         }
       }
      //  if (this.licencaTemplateProcedimento.validade === '') {
      //    return false
      //  }
       return true
     },
     verificaCamposProcedimento () {
       if (this.licencaTemplateProcedimento.licenca === '') {
         console.log(this.licencaTemplateProcedimento.licenca)
         return false
       }
       if (this.licencaTemplateProcedimento.anexo.length === 0) {
         return false
       }
       if (this.licencaTemplateProcedimento.validade === '') {
         return false
       }
       if (this.licencaTemplateProcedimento.tipo_procedimento === '') {
         return false
       }
       return true
     },
     verificaCamposEstoque () {
       if (this.licencaTemplateEstoque.licenca === '') {
         console.log(this.licencaTemplateEstoque.licenca)
         return false
       }
       if (this.licencaTemplateEstoque.anexo.length === 0) {
         return false
       }
       return true
     },
     verificaCamposLicencaAmbiental () {
       if (this.licencaAmbientalTemplate.licenca === '') {
         console.log(this.licencaAmbientalTemplate.licenca)
         return false
       }
       if (this.licencaAmbientalTemplate.periodo_apresentacao === '') {
         return false
       }
       if (this.licencaAmbientalTemplate.prazo_apresentacao === '') {
         return false
       }
       return true
     },
     verificaCamposLicencaOutras () {
       if (this.licencaOutrasTemplate.licenca === '') {
         console.log(this.licencaOutrasTemplate.licenca)
         return false
       }
       if (this.licencaOutrasTemplate.periodo_apresentacao === '') {
         return false
       }
       if (this.licencaOutrasTemplate.observacoes === '') {
         return false
       }
       if (this.licencaOutrasTemplate.prazo_apresentacao === '') {
         return false
       }
       return true
     },
     excluiProcedimento (licenca, index) {
       // Verifica se existe licença gravada no banco de dados e exclui (soft delete)
       if (licenca.id !== null) {
         // Atualiza banco de dados e apaga da tabela
         this.excluiLicenca(licenca.id)
         this.tableProcedimento.items.splice(index, 1)
       } else {
         // Apaga da tabela
         this.tableProcedimento.items.splice(index, 1)
       }
     },
     excluiEstoque (licenca, index) {
       // Verifica se existe licença gravada no banco de dados e exclui (soft delete)
       if (licenca.id !== null) {
         // Atualiza banco de dados e apaga da tabela
         this.excluiLicenca(licenca.id)
         this.tableEstoque.items.splice(index, 1)
       } else {
         // Apaga da tabela
         this.tableEstoque.items.splice(index, 1)
       }
     },
     excluiInformativa (licenca, index) {
       // Verifica se existe licença gravada no banco de dados e exclui (soft delete)
       if (licenca.id !== null) {
         // Atualiza banco de dados e apaga da tabela
         this.excluiLicenca(licenca.id)
         this.tableInformativa.items.splice(index, 1)
         this.limparCamposLicencaInformativa()
       } else {
         // Apaga da tabela
         this.tableInformativa.items.splice(index, 1)
         this.limparCamposLicencaInformativa()
       }
     },
     excluirLicencaAmbiental (licenca, index) {
       // Verifica se existe licença gravada no banco de dados e exclui (soft delete)
       if (licenca.id !== null) {
         // Atualiza banco de dados e apaga da tabela
         this.excluiLicenca(licenca.id)
         this.tableLicencaAmbiental.items.splice(index, 1)
       } else {
         // Apaga da tabela
         this.tableLicencaAmbiental.items.splice(index, 1)
       }
     },
     excluirLicencaOutro (licenca, index) {
       // Verifica se existe licença gravada no banco de dados e exclui (soft delete)
       if (licenca.id !== null) {
         // Atualiza banco de dados e apaga da tabela
         this.excluiLicenca(licenca.id)
         this.tableLicencaOutra.items.splice(index, 1)
       } else {
         // Apaga da tabela
         this.tableLicencaOutra.items.splice(index, 1)
       }
     },
     editaProcedimento (licenca, index) {
       // Preenche a licença selecionada no template
       this.licencaTemplateProcedimento = {
         id: licenca.id,
         licenca: licenca.licenca,
         tipo_licenca: licenca.tipo_licenca,
         tipo_procedimento: licenca.tipo_procedimento,
         fase_proposta: licenca.fase_proposta,
         periodo_apresentacao: licenca.periodo_apresentacao,
         prazo_apresentacao: licenca.prazo_apresentacao,
         data_apresentacao: moment.utc(new Date()).format('YYYY-MM-DD'),
         validade: licenca.validade,
         status: licenca.status,
         documento: licenca.documento,
         anexo: licenca.anexo,
         observacoes: licenca.observacoes
       }
      //  console.log('validade', this.licencaTemplateProcedimento.validade)
      //  console.log('validade', this.licencaTemplateProcedimento.validade)
       this.licencaTemplateBackup = _.cloneDeep(this.licencaTemplateProcedimento)
       this.toggleProcedimento(true, true)
       this.indexEdicao = index
       this.editandoLinhaProcedimento = true
       this.$forceUpdate()
     },
     editaEstoque (licenca, index) {
       // Preenche a licença selecionada no template
       this.licencaTemplateEstoque = {
         id: licenca.id,
         licenca: licenca.licenca,
         tipo_licenca: licenca.tipo_licenca,
         tipo_procedimento: licenca.tipo_procedimento,
         fase_proposta: licenca.fase_proposta,
         periodo_apresentacao: licenca.periodo_apresentacao,
         prazo_apresentacao: licenca.prazo_apresentacao,
         data_apresentacao: moment.utc(new Date()).format('YYYY-MM-DD'),
         validade: licenca.validade,
         status: licenca.status,
         documento: licenca.documento,
         anexo: licenca.anexo,
         observacoes: licenca.observacoes
       }
      //  console.log('validade', this.licencaTemplateProcedimento.validade)
      //  console.log('validade', this.licencaTemplateProcedimento.validade)
       // this.licencaTemplateBackup = _.cloneDeep(this.licencaTemplateProcedimento)
       this.toggleEstoque(true, true)
       this.indexEdicao = index
       this.editandoLinhaEstoque = true
       this.$forceUpdate()
     },
     editaLicencaAmbiental (licenca, index) {
       // Preenche a licença selecionada no template
       this.licencaAmbientalTemplate = {
         id: licenca.id,
         licenca: licenca.licenca,
         tipo_licenca: licenca.tipo_licenca,
         fase_proposta: licenca.fase_proposta,
         periodo_apresentacao: licenca.periodo_apresentacao,
         prazo_apresentacao: licenca.prazo_apresentacao,
         prazo_renovacao: licenca.prazo_renovacao,
         validade: licenca.validade,
         status: licenca.status,
         documento: licenca.documento,
         anexo: licenca.anexo,
         observacoes: licenca.observacoes
       }
       this.toggleLicencaAmbiental(true, true)
       this.indexEdicao = index
       this.editandoLinhaLicencaAmbiental = true
       this.$forceUpdate()
     },
     editaLicencaOutras (licenca, index) {
       // Preenche a licença selecionada no template
       this.licencaOutrasTemplate = {
         id: licenca.id,
         licenca: licenca.licenca,
         tipo_licenca: licenca.tipo_licenca,
         fase_proposta: licenca.fase_proposta,
         periodo_apresentacao: licenca.periodo_apresentacao,
         prazo_apresentacao: licenca.prazo_apresentacao,
         validade: licenca.validade,
         status: licenca.status,
         documento: licenca.documento,
         anexo: licenca.anexo,
         observacoes: licenca.observacoes
       }
       this.toggleLicencaOutras(true, true)
       this.indexEdicao = index
       this.editandoLinhaLicencaOutras = true
       this.$forceUpdate()
     },
     salvarEdicaoProcedimento () {
       // Atualiza registro no indice gravado
      //  console.log('ORIGINAL', this.licencasProcedimento[this.indexEdicao])
      //  console.log('EDICAO', this.licencaTemplateProcedimento)
       this.licencaTemplateProcedimento.validade = moment.utc(this.licencaTemplateProcedimento.validade).format('YYYY-MM-DD')
       this.licencaTemplateProcedimento.responsavel = this.usuarioLogado.ds_nome_usuario
       if (this.licencaTemplateProcedimento.id !== null) {
         // verifica se o documento possui ID, se não possuir (está adicionando um novo e excluindo o antigo) seta documento como null
         if (!_.has(this.licencaTemplateProcedimento.anexo[0], 'id')) {
           this.licencaTemplateProcedimento.documento = null
         }
         this.$snotify.clear()
         this.$snotify.async('Gravando informações de Licenciamento Ambiental na base. Por favor, aguarde...', {timeout: 0})
         axiosLaravel.post('/licenciamento/atualizaLicencaProcedimento', this.licencaTemplateProcedimento).then((response) => {
           this.$snotify.clear()
           this.$snotify.success(response.data)
           this.consultaLicencasProposta()
          //  this.loading.show = false
         })
          .catch((error) => {
            this.$root.trataErro(error)
            this.$snotify.clear()
            this.$snotify.error(error)
            this.loading.show = false
          })
       }
       this.licencasProcedimento[this.indexEdicao] = this.licencaTemplateProcedimento
       this.tableProcedimento.items = this.licencasProcedimento
       this.toggleProcedimento(false)
       this.indexEdicao = 0
       this.editandoLinhaProcedimento = false
       this.$forceUpdate()
     },
     salvarEdicaoEstoque () {
       // Atualiza registro no indice gravado
      //  console.log('ORIGINAL', this.licencasProcedimento[this.indexEdicao])
      //  console.log('EDICAO', this.licencaTemplateProcedimento)
       this.licencaTemplateEstoque.validade = moment.utc(this.licencaTemplateEstoque.validade).format('YYYY-MM-DD')
       this.licencaTemplateEstoque.responsavel = this.usuarioLogado.ds_nome_usuario
       if (this.licencaTemplateEstoque.id !== null) {
         // verifica se o documento possui ID, se não possuir (está adicionando um novo e excluindo o antigo) seta documento como null
         if (!_.has(this.licencaTemplateEstoque.anexo, 'id')) {
           this.licencaTemplateEstoque.documento = null
         }
         this.$snotify.clear()
         this.$snotify.async('Gravando informações de Licenciamento Ambiental na base. Por favor, aguarde...', {timeout: 0})
         axiosLaravel.post('/licenciamento/atualizaLicencaEstoque', this.licencaTemplateEstoque).then((response) => {
           this.$snotify.clear()
           this.$snotify.success(response.data)
           this.consultaLicencasProposta()
          //  this.loading.show = false
         })
          .catch((error) => {
            this.$root.trataErro(error)
            this.$snotify.clear()
            this.$snotify.error(error)
            this.loading.show = false
          })
       }
       this.licencasEstoque[this.indexEdicao] = this.licencaTemplateEstoque
       this.tableEstoque.items = this.licencasEstoque
       this.toggleEstoque(false)
       this.indexEdicao = 0
       this.editandoLinhaEstoque = false
       this.$forceUpdate()
     },
     salvarEdicaoLicencaAmbiental () {
       // Atualiza registro no indice gravado
      //  console.log('ORIGINAL', this.licencasProcedimento[this.indexEdicao])
      //  console.log('EDICAO', this.licencaTemplateProcedimento)

       if (this.licencaAmbientalTemplate.periodo_apresentacao === 'Ao decorrer do projeto') {
         this.licencaAmbientalTemplate.fase_proposta = 'PROJETO'
       } else {
         this.licencaAmbientalTemplate.fase_proposta = 'ENCERRAMENTO'
       }
       this.licencaAmbientalTemplate.prazo_apresentacao = moment.utc(this.licencaAmbientalTemplate.prazo_apresentacao).format('YYYY-MM-DD')
       if (this.licencaAmbientalTemplate.prazo_renovacao !== '') {
         this.licencaAmbientalTemplate.prazo_renovacao = moment.utc(this.licencaAmbientalTemplate.prazo_renovacao).format('YYYY-MM-DD')
       }
       this.licencaAmbientalTemplate.responsavel = this.usuarioLogado.ds_nome_usuario
       if (this.licencaAmbientalTemplate.id !== null) {
         // verifica se o documento possui ID, se não possuir (está adicionando um novo e excluindo o antigo) seta documento como null
         this.$snotify.clear()
         this.$snotify.async('Gravando informações de Licenciamento Ambiental na base. Por favor, aguarde...', {timeout: 0})
         axiosLaravel.post('/licenciamento/atualizaLicencaAmbiental', this.licencaAmbientalTemplate).then((response) => {
           this.$snotify.clear()
           this.$snotify.success(response.data)
           this.consultaLicencasProposta()
          //  this.loading.show = false
         })
          .catch((error) => {
            this.$root.trataErro(error)
            this.$snotify.clear()
            this.$snotify.error(error)
            this.loading.show = false
          })
       }
       this.licencasAmbientais[this.indexEdicao] = this.licencaAmbientalTemplate
       this.tableLicencaAmbiental.items = this.licencasAmbientais
       this.toggleLicencaAmbiental(false)
       this.indexEdicao = 0
       this.editandoLinhaLicencaAmbiental = false
       this.$forceUpdate()
     },
     salvarEdicaoLicencaOutros () {
       // Atualiza registro no indice gravado
      //  console.log('ORIGINAL', this.licencasProcedimento[this.indexEdicao])
      //  console.log('EDICAO', this.licencaTemplateProcedimento)
       if (this.licencaOutrasTemplate.periodo_apresentacao === 'Ao decorrer do projeto') {
         this.licencaOutrasTemplate.fase_proposta = 'PROJETO'
       } else {
         this.licencaOutrasTemplate.fase_proposta = 'ENCERRAMENTO'
       }
       this.licencaOutrasTemplate.prazo_apresentacao = moment.utc(this.licencaOutrasTemplate.prazo_apresentacao).format('YYYY-MM-DD')
       this.licencaOutrasTemplate.responsavel = this.usuarioLogado.ds_nome_usuario
       if (this.licencaOutrasTemplate.id !== null) {
         // verifica se o documento possui ID, se não possuir (está adicionando um novo e excluindo o antigo) seta documento como null
         this.$snotify.clear()
         this.$snotify.async('Gravando informações de Licenciamento Ambiental na base. Por favor, aguarde...', {timeout: 0})
         axiosLaravel.post('/licenciamento/atualizaLicencaOutros', this.licencaOutrasTemplate).then((response) => {
           this.$snotify.clear()
           this.$snotify.success(response.data)
           this.consultaLicencasProposta()
          //  this.loading.show = false
         })
          .catch((error) => {
            this.$root.trataErro(error)
            this.$snotify.clear()
            this.$snotify.error(error)
            this.loading.show = false
          })
       }
       this.licencasOutras[this.indexEdicao] = this.licencaOutrasTemplate
       this.tableLicencaOutra.items = this.licencasOutras
       this.toggleLicencaOutras(false)
       this.indexEdicao = 0
       this.editandoLinhaLicencaOutras = false
       this.$forceUpdate()
     },
     limparCamposProcedimento () {
       this.licencaTemplateProcedimento = {
         id: null,
         licenca: '',
         tipo_licenca: 'PROCEDIMENTO',
         fase_proposta: 'ANALISE',
         tipo_procedimento: '',
         periodo_apresentacao: 'Análise',
         prazo_apresentacao: '',
         data_apresentacao: '',
         validade: '',
         status: 'Informado pela Analise',
         documento: null,
         anexo: [],
         observacoes: ''
       }
     },
     limparCamposEstoque () {
       this.licencaTemplateEstoque = {
         id: null,
         licenca: '',
         tipo_licenca: 'ESTOQUE',
         fase_proposta: 'ESTOQUE',
         periodo_apresentacao: 'Estoque',
         tipo_procedimento: '',
         prazo_apresentacao: '',
         data_apresentacao: '',
         validade: '',
         status: 'Informado pela FBB',
         documento: null,
         anexo: [],
         observacoes: '',
         responsavel: ''
       }
     },
     limparCamposLicencaInformativa () {
       this.licencaInformativa = {
         id: null,
         licenca: '',
         licencaSelecao: '',
         tipo_licenca: 'INFORMATIVA',
         fase_proposta: 'ANALISE',
         periodo_apresentacao: 'Análise',
         status: 'Informado pela Analise',
         data_apresentacao: '',
         possuiAnexo: 'N',
         validade: '',
         documento: null,
         anexo: [],
         inclusao: '',
         observacoes: '',
         responsavel: ''
       }
     },
     limparCamposLicencaAmbiental () {
       this.licencaAmbientalTemplate = {
         id: null,
         licenca: '',
         tipo_licenca: 'LICENCA_AMBIENTAL',
         fase_proposta: '',
         periodo_apresentacao: '',
         prazo_apresentacao: '',
         prazo_renovacao: '',
         validade: '',
         status: 'Aguardando Envio',
         documento: null,
         anexo: [],
         observacoes: ''
       }
     },
     limparCamposLicencaOutras () {
       this.licencaOutrasTemplate = {
         id: null,
         licenca: '',
         tipo_licenca: 'OUTRAS',
         fase_proposta: '',
         periodo_apresentacao: '',
         prazo_apresentacao: '',
         validade: '',
         status: 'Aguardando Envio',
         documento: null,
         anexo: [],
         observacoes: ''
       }
     },
     excluiLicenca (id) {
       this.$snotify.clear()
       this.$snotify.async('Excluindo licença na base de dados...', {timeout: 0})
       let obj = {
         responsavel: this.usuarioLogado.ds_nome_usuario
       }
       axiosLaravel.post('/licenciamento/excluirLicenca/' + id, obj).then((response) => {
         this.$snotify.clear()
         this.$snotify.success(response.data)
         this.consultaLicencasProposta()
        //  this.loading.show = false
       })
        .catch((error) => {
          this.$root.trataErro(error)
          this.$snotify.clear()
          this.$snotify.error(error)
          this.loading.show = false
        })
     },
     // Download de arquivos
     onDownload (documento) {
       if (documento.file) {
         download(documento.file, documento.ds_nome_arquivo, documento.ds_content_type)
       } else {
         axiosLaravel.get('documentos/download/' + documento.id, {responseType: 'arraybuffer'}).then((response) => {
           let ie = !!window.MSInputMethodContext && !!document.documentMode
           if (!ie) {
             let blob = new Blob([response.data], {type: documento.ds_content_type})
             let link = document.createElement('a')
             link.href = window.URL.createObjectURL(blob)
             link.download = documento.ds_nome_arquivo
             document.body.appendChild(link)
             link.click()
             document.body.removeChild(link)
           } else {
             var bytes = new Uint8Array(resultByte)
             let blob = new Blob([bytes], {type: documento.ds_content_type})
             let link = document.createElement('blob')
             link.href = window.navigator.msSaveOrOpenBlob(blob, documento.ds_nome_arquivo)
             link.download = documento.ds_nome_arquivo
             link.click()
           }
         })
           .catch((error) => {
             this.$root.trataErro(error)
           })
       }
     },
     consultaIndicativoLicenciamento () {
       this.loading.show = true
       this.consultandoIndicativo = true
       axiosLaravel.get('/licenciamento/consultarIndicativoLicenciamento/' + this.idProposta).then((response) => {
         if (!_.isEmpty(response.data)) {
           this.indicativo = response.data.status
           this.justificativaIndicativo = response.data.observacoes
         }
         this.loading.show = false
         this.consultandoIndicativo = false
         return true
       })
        .catch((error) => {
          this.$root.trataErro(error)
          this.$snotify.clear()
          this.$snotify.error(error)
          this.loading.show = false
          this.consultandoIndicativo = false
          return false
        })
     },
     gravarIndicativoLicenciamento () {
       console.log('gravaIndicativoLicenciamento ')
       this.loading.show = true
       if (this.indicativo === '') {
         this.loading.show = false
         return false
       }
       if (this.indicativo === 'Sim') {
         if (this.licencaInformativa.licenca === '' && this.cadastroProposta) {
           this.loading.show = false
           return false
         }
         this.justificativaIndicativo = '-'
       }
       let indicativo = {
         idProposta: this.idProposta,
         indicativo: this.indicativo,
         justificativa: this.justificativaIndicativo
       }
       axiosLaravel.post('/licenciamento/gravarIndicativoLicenciamento', indicativo).then((response) => {
         this.$snotify.clear()
         this.$snotify.success(response.data)
         this.loading.show = false
         return true
       })
        .catch((error) => {
          this.$root.trataErro(error)
          this.$snotify.clear()
          this.$snotify.error(error)
          this.loading.show = false
          return false
        })
     },
     apagarTodasLicencas () {
       console.log('apagaTodasLicencas')
       this.loading.show = true
       if (this.gravarIndicativoLicenciamento() === false) {
         this.$snotify.error('Ocorreu um problema.')
         return
       }
       let obj = {
         idProposta: this.idProposta,
         responsavel: this.usuarioLogado.ds_nome_usuario
       }
       axiosLaravel.post('/licenciamento/apagarTodasLicencas', obj).then((response) => {
         this.$snotify.clear()
         this.$snotify.success(response.data)
         this.loading.show = false
         this.limparCamposLicencaInformativa()
         this.consultaLicencasProposta()
       })
        .catch((error) => {
          this.$root.trataErro(error)
          this.$snotify.clear()
          this.$snotify.error(error)
          this.loading.show = false
        })
     },
     changeIndicativo () {
       // Verifica se o já existem licenças e marca todas elas como excluído 'S'
       this.$dialog.confirm('<b>Se existirem licenças prévias cadastradas, serão excluídas. Confirma indicativo de Licenciamento para NÃO ?</b>', {html: true, animation: 'fade', customClass: 'avisoConfirmacao'})
        .then((dialog) => {
          this.apagarTodasLicencas()
        }).catch(() => {
          this.indicativo = 'Sim'
        })
     }

   }
 }
 </script>
   
 <style scoped>
  .edicao-container {
    width: 100%;
    gap: 10px;
    background-color: #f5f5f5;
    box-sizing: border-box;
    padding: 50px;
  }

  .sessao-salvar {
    gap: 5px;
  }

  .label-head {
    padding-bottom: 10px;
  }

  .label-aviso {
    font-size: 1.6rem;
    font-weight: 400;
  }

  .indicativo-container {
    width: 10%;
    gap: 10px;
    height: 30px;
    padding: 20px;
    padding-bottom: 30px;
    margin-bottom: 20px;
    border: 1px solid #DDDDDD;
  }

 </style>

<style src="../../../../static/css/flexAux.css"></style>