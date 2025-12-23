<template>
  <div>

<!-- Listagem de Ocorrências ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------->
    <div class="box-body" v-if="acao === 'LISTAR'">
      <div v-show="loading.tela" class="overlay" style="position: absolute; top: 0px; left: 0px; width: 100%; height: 100%; display: block;"><i class="fa fa-refresh fa-spin"></i></div>

      <div class="form-horizontal">

        <div :class="_.isNil(numeroProjeto) ? 'col-md-2' : 'col-md-3'">
          <!-- Botões de Novo e Excel -->
          <g-button-ujarak v-if="_.includes(itensLayoutTela, 'botaoNovo')" color="primary" size="button--size-ss" type="button" @click.native="acaoOcorrencia('CRIAR', 0)"><i class="fa fa-plus-circle" aria-hidden="true"></i> Nova Ocorrência </g-button-ujarak>
          <g-button-ujarak v-if="_.includes(itensLayoutTela, 'botaoExportarExcel') && ocorrencias.length > 0" color="success" size="button--size-ss" type="button" @click.native="exportarExcel()"><i class="fa fa-download" aria-hidden="true"></i> Exportar Excel </g-button-ujarak>
        </div>

        <div :class="_.isNil(numeroProjeto) ? 'col-md-10' : 'col-md-9'">
          <div class="col-md-10">
            <!-- Opções de pesquisa -->
            <div class="col-md-12" style="display: flex; justify-content: flex-end; align-items: center">

              <!-- Opções: texto de pesquisa -->
              <div v-if="_.includes(itensLayoutTela, 'caixaPesquisa')" class="w30">
                <div>
                    <input v-model="buscaTipo" type="radio" name="inlineRadioOptions" value="projeto" style="margin: 5px; padding: 5px">
                    <label class="form-check-label" for="inlineRadio1">Projeto</label>
                 
                    <input v-model="buscaTipo" type="radio" name="inlineRadioOptions" id="inlineRadio2" value="entidade" style="margin: 5px; padding: 5px">
                    <label class="form-check-label" for="inlineRadio2">Nome Entidade</label>

                    <input v-model="buscaTipo" type="radio" name="inlineRadioOptions" id="inlineRadio2" value="cnpj" style="margin: 5px; padding: 5px">
                    <label class="form-check-label" for="inlineRadio2">CNPJ</label>
                  </div>

                <div class="input-group">
                  <input v-model="filtro.pesquisa" type="text" class="form-control" :placeholder="placeholderCampoBusca.find(x => x.tipo === buscaTipo).placeholder" v-on:keyup="ajustaPesquisa"
                         :title="buscaTipo === 'projeto' ? '<h5>Informe o número do projeto</h5>' : '<h5>Informe o nome da entidade</h5>'"
                         v-tippy="{inertia:true, arrow:true, animation:'fade', distance:'1', size:'large', delay: [500, 0]}">
                  <span class="input-group-btn">
                    <button v-if="filtro.pesquisa.length > 0" @click="filtro.pesquisa = ''; ajustaPesquisa()" type="button" class="btn btn-default btn-flat"><i class="fa fa-remove"></i></button>
                  </span>
                </div>
                
              </div>

              <div class="espacamento_botoes"></div>

              <!-- Opções: carteira de projeto -->
              <div class="w30">
                <div v-if="_.includes(itensLayoutTela, 'filtroCarteira')">
                  <div class="input-group" style="margin-top: 20px;">
                    <span v-if="loading.carteiras" class="etiquetaCarregando"><i class="fa fa-refresh fa-spin"></i> Carregando carteiras ...</span>
                    <span v-else>
                                   <!--:custom-label="(option) => { return `${option.usu_codcart + option.usu_nomcart}`}"-->
                      <multiselect v-model="filtro.carteira" :options="listaCarteiras"
                                   selectLabel="" deselectLabel="" selectedLabel=""
                                   placeholder="Carteiras de projeto" name="carteiras_projeto">
                        <template slot="option" slot-scope="props">{{ props.option.usu_codcart }} - {{ props.option.usu_nomcart }}</template>
                        <template slot="singleLabel" slot-scope="props">{{ props.option.usu_codcart }} - {{ props.option.usu_nomcart }}</template>
                        <template slot="noResult">Nenhum registro localizado!</template>
                      </multiselect>
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div class="col-md-12" v-if="_.includes(itensLayoutTela, 'caixaPesquisa') || _.includes(itensLayoutTela, 'filtroCarteira')">&nbsp;</div> <!-- linha em branco -->

            <div class="col-md-12" style="display: flex; justify-content: flex-end; align-items: center">
              <!-- Opções: checkboxes de nivel -->
              <div class="indicadores-cb-inline" v-if="_.includes(itensLayoutTela, 'filtroNivelOcorrencia')" style="width: 50%">
                <div v-for="item in listaNiveis" class="juntos">
                  <i @click="checkboxNivel(item)" :class="_.find(filtro.nivel, ['nivel', item.nivel]) ? 'fa fa-check-square-o selecionado' : 'fa fa-square-o'" aria-hidden="true"></i>
                  <span :class="_.find(filtro.nivel, ['nivel', item.nivel]) ? 'selecionado' : ''"> {{ enumeradores[item.codigo] }}</span>
                </div>
              </div>

              <!-- Opções: código da ocorrencia -->
              <div class="w30" v-if="_.includes(itensLayoutTela, 'filtroCodigoOcorrencia')">
                <div class="input-group">
                  <span v-if="loading.codigos" class="etiquetaCarregando"><i class="fa fa-refresh fa-spin"></i> Carregando tipos de ocorrências ...</span>
                  <span v-else>
                    <multiselect v-model="filtro.codigo" :options="_.orderBy(_.filter(listaTiposOcorrencias, ['consultar', 1]), ['criar', 'codigo'], ['desc', 'asc'])" :multiple="true"
                                 :custom-label="(option) => { return `${option.codigo}`}" track-by="codigo"
                                 selectLabel="" deselectLabel="" selectedLabel="" :taggable="true"
                                 :title="'<h5>Códigos disponíveis para consulta<br/>Em vermelho estão os códigos <span class=\'text-red\'> impedidos de criar novas ocorrências</span></h5>'"
                                 v-tippy="{inertia:true, arrow:true, animation:'fade', distance:'1', size:'large', delay: [500, 0]}"
                                 placeholder="Cód. Ocorrências" name="tipos_ocorrencias">
                      <template slot="option" slot-scope="props"><span :class="props.option.criar === 0 ? 'text-red' : ''">{{ props.option.codigo }} - {{ props.option.descricao }}</span></template>
                      <template slot="noResult">Nenhum registro localizado!</template>
                    </multiselect>
                  </span>
                </div>
              </div>

              <div class="espacamento_botoes"></div>

              <!-- Opções: situacao da ocorrencia -->
              <div class="w20" v-if="_.includes(itensLayoutTela, 'filtroSituacaoOcorrencia')">
                <div class="input-group">
                  <multiselect v-model="filtro.situacao" :options="listaSituacoesOcorrencias"
                               selectLabel="" deselectLabel="" selectedLabel=""
                               placeholder="Situação" name="situacao_ocorrencias">
                    <template slot="option" slot-scope="props">{{ enumeradores[props.option] }}</template>
                    <template slot="singleLabel" slot-scope="props"><div class="truncar">{{ enumeradores[props.option] }}</div></template>
                    <template slot="noResult">Nenhum registro localizado!</template>
                  </multiselect>
                </div>
              </div>
            </div>
          </div>
          <div class="col-md-2" style="margin-top: 20px;">
            <!-- Botão de pesquisa -->
            <span v-if="!(_.isEmpty(filtro.id) && _.isEmpty(filtro.codigo) && _.isEmpty(filtro.situacao) && _.isEmpty(filtro.etapa) && _.isEmpty(filtro.nivel) && _.isEmpty(filtro.carteira) && _.isEmpty(filtro.observacao) && _.isEmpty(filtro.pesquisa))">
              <g-button-ujarak color="success" size="button--size-ss" type="button" @click.native="pesquisarOcorrencias()"><i class="fa fa-search" aria-hidden="true"></i> Pesquisar </g-button-ujarak>
              <button @click="limparPesquisa(); salvarConfiguracoes()" type="button" class="btn btn-default btn-flat" :title="'<h5>Limpar os parâmetros de pesquisa</h5>'" v-tippy="{inertia:true, arrow:true, animation:'fade', distance:'2', size:'large', delay: [500, 0]}"><i class="fa fa-remove"></i></button>
            </span>

            <div v-bind:style="'color: var(--cor-fraca); margin-top: ' + (_.isNil(numeroProjeto) ? 35 : 5) + 'px'">
              <span v-if="ocorrencias.length > 1">{{ ocorrencias.length + ' ocorrências localizadas' }}</span>
              <span v-else-if="ocorrencias.length === 1">{{ '1 ocorrência localizada' }}</span>
            </div>
          </div>
        </div>

      </div>

      <div class="col-md-12">&nbsp;</div> <!-- linha em branco -->

      <div class="">
        <div v-if="loading.tabelaOcorrencias"><span class="etiquetaCarregando"><i class="fa fa-refresh fa-spin"></i> Carregando tabela ...</span></div>

        <div v-else>

          <b-container fluid>
            <b-table show-empty
                     stacked="md"
                     hover
                     :bordered="true"
                     :items="ocorrencias"
                     :fields="tabelaListaOcorrencias.fields"
                     :current-page="tabelaListaOcorrencias.currentPage"
                     :per-page="tabelaListaOcorrencias.perPage"
                     :sort-by.sync="tabelaListaOcorrencias.sortBy"
                     :sort-desc.sync="tabelaListaOcorrencias.sortDesc"
                     :empty-filtered-text="'Não encontrei nada relacionado a ´' + pesquisa + '´ na pesquisa'"
                     :key="'tabelaListaOcorrencias_' + tabelaListaOcorrencias.numeroAtualizacao"
                     empty-text="Nenhum registro encontrado">

              <template slot="id" scope="row">{{ row.value }}</template>

              <template slot="codigo" scope="row">
                <div class="truncar" style="max-width: 250px">
                    <span v-for="nivel in [('' + row.item.codigo).substr(0, 1)]" v-bind:style="'color: var(--cor-' + (nivel === '4' ? 'atencao' : (nivel === '3' ? 'alerta' : (nivel === '2' ? 'destaque' : 'fraca'))) + ')'" class="text-bold">
                      {{ row.item.codigo }}
                    </span>
                  {{ row.item.descricao }}
                </div>
              </template>

              <template slot="projeto" scope="row">
                <span v-if="row.item.nomeProcesso === 'OCORRENCIA_ENTIDADE'">
                  <div class="truncar" style="max-width: 250px" :title="'<h5>' + row.item.entidade + '</h5>'" v-tippy="{inertia:true, arrow:true, animation:'fade', distance:'1', size:'large', delay: [500, 0]}"><i>{{ row.item.entidade }}</i></div>
                </span>
                <span v-else>
                  <div :title="'<h5>' + row.item.numeroProjeto + ' - ' + row.item.projeto + '</br></br>' + row.item.entidade + '</h5>'"
                       v-tippy="{inertia:true, arrow:true, animation:'fade', distance:'1', size:'large', delay: [500, 0]}">
                    <div class="truncar" style="max-width: 250px; cursor: pointer">
                      <strong class="linkProjeto" @click="abrePaginaNova('projetos/projeto/', row.item.numeroProjeto)">
                        <i class="fa fa-external-link"></i> {{ row.item.numeroProjeto }} - {{ row.item.projeto }}</strong>
                    </div>
                    <div class="truncar" style="max-width: 250px"><i>{{ row.item.entidade }}</i></div>
                  </div>
                </span>
              </template>

              <template slot="observacao" scope="row">
                <span style="line-break: anywhere; text-align: left">
                  <div v-if="(row.value).length <= 245" v-html="row.value"></div>
                  <div v-else :title="'<h5 style=\'text-align: left\'>' + row.value + '</h5>'" v-tippy="{inertia:true, arrow:true, animation:'fade', distance:'1', size:'large', delay: [500, 0]}"
                       v-html="(row.value).length > 245 ? (row.value).substr(0, 245) + ' ...' : row.value">
                  </div>
                </span>
              </template>

              <template slot="etapa" scope="row">
                {{ enumeradores[row.value] }}
              </template>

              <template slot="tarefaInicio" scope="row">
                <span v-if="('' + row.item.tarefaInicio).includes('00:00:00')" :title="'<h5>Migrado não possui hora</h5>'" v-tippy="{inertia:true, arrow:true, animation:'fade', distance:'1', size:'large', delay: [1000, 0]}">{{ row.item.tarefaInicio | moment("DD/MM/YYYY") }}</span>
                <span v-else>{{ row.item.tarefaInicio | moment("DD/MM/YYYY HH:mm") }}</span>
              </template>

              <template slot="acoes" scope="row">
                <g-button-ujarak color="primary" v-if="!_.includes(['CANCELADO', 'BAIXADO'], row.item.etapa)" size="button--size-ss" @click.native="acaoOcorrencia('EDITAR', row.item.id)"><i class="fa fa-pencil-square-o" aria-hidden="true"></i> Editar</g-button-ujarak>
                <g-button-ujarak color="success" v-if="_.includes(['CANCELADO', 'BAIXADO'], row.item.etapa)" size="button--size-ss" @click.native="acaoOcorrencia('VISUALIZAR', row.item.id)"><i class="fa fa-search" aria-hidden="true"></i> Visualizar</g-button-ujarak>
              </template>

            </b-table>

            <b-row v-if="!_.isEmpty(ocorrencias) && ocorrencias.length > tabelaListaOcorrencias.perPage && tabelaListaOcorrencias.totalRows > tabelaListaOcorrencias.perPage">
              <b-col md="12" class="my-1" right>
                <b-pagination :total-rows="tabelaListaOcorrencias.totalRows" :per-page="tabelaListaOcorrencias.perPage" v-model="tabelaListaOcorrencias.currentPage" class="my-3" />
              </b-col>
            </b-row>

          </b-container>

        </div>

      </div>

    </div>

<!-- Formulario para edição, criação, visualização, aprovação e baixa de ocorrência -------------------------------------------------------------------------------------------------------------------------------------------------------------->
    <div class="box-body" v-if="acao !== 'LISTAR'">
      <div v-show="loading.tela" class="overlay" style="position: absolute; top: 0px; left: 0px; width: 100%; height: 100%; display: block;"><i class="fa fa-refresh fa-spin"></i></div>

      <div class="row">
      <div class="form-horizontal">
        <div class="col-md-12">

          <div :class="(_.includes(itensLayoutTela, 'formatacaoCaixa') ? 'box' : '') + ' box-widget'">

            <div class="box-body">

              <div class="form-horizontal">

                <div class="form-group">
                  <div class="required-field">
                    <label class="control-label col-md-2">Tipo:</label>
                    <span>
                      <div v-if="ehVisualizacao || etapa !== 'SOLICITACAO' || !_.isNil(numeroProjeto)" class="text-bold col-md-2" style="margin-top: 8px">{{ ocorrencia.tipo }}</div>
                      <div v-else class="col-md-2 form-control-static" style="display: flex; justify-content: space-between;">
                        <span><input type="radio" v-model="ocorrencia.tipo" name="tipoOcorrencia" id="tipoOcorrenciaProjeto" :value="'PROJETO'"/> <label for="tipoOcorrenciaProjeto">Projeto</label></span>
                        <span><input type="radio" v-model="ocorrencia.tipo" name="tipoOcorrencia" id="tipoOcorrenciaEntidade" :value="'ENTIDADE'"/> <label for="tipoOcorrenciaEntidade">Entidade</label></span>
                      </div>
                    </span>
                    <div class="col-md-8">
                      <div v-if="loading.listaProjetosEntidades"><span class="etiquetaCarregando"><i class="fa fa-refresh fa-spin"></i> Carregando lista de projetos e entidades...</span></div>
                      <div v-else :ref="'projeto_entidade_' + numeroAtualizacao">
                        <span v-if="ocorrencia.tipo === 'PROJETO'">
                          <multiselect v-model="ocorrencia.alvo" :options="listaProjetosEntidades['projetos']" :disabled="ehVisualizacao || etapa !== 'SOLICITACAO' || !_.isNil(numeroProjeto)"
                                       :custom-label="(option) => { return `${option.ds_codigo_projeto_erp + option.sitprj + option.ds_nome}`}"
                                       @select="alteraListaTiposOcorrencias($event)"
                                       selectLabel="" deselectLabel="" selectedLabel=""
                                       placeholder="Selecione um projeto" name="projeto_entidade"
                                       v-validate="'required'">
                            <template slot="option" slot-scope="props"><div class="truncar"><span class="text-bold">{{props.option.ds_codigo_projeto_erp}}</span> ({{ props.option.sitprj }}) {{props.option.ds_nome}}</div></template>
                            <template slot="singleLabel" slot-scope="props"><div class="truncar"><span class="identificadorIDProjeto">{{props.option.ds_codigo_projeto_erp}}</span> <span class="identificadorIDProjeto text-muted">{{ props.option.sitprj }}</span> {{props.option.ds_nome}}</div></template>
                            <template slot="noResult">Nenhum registro localizado!</template>
                          </multiselect>
                          <span v-if="errors.first('projeto_entidade')" class="label label-danger"> Deve selecionar um projeto na lista</span>
                        </span>
                        <span v-else>
                          <multiselect v-model="ocorrencia.alvo" :options="listaProjetosEntidades['entidades']" :disabled="ehVisualizacao || etapa !== 'SOLICITACAO'"
                                       :custom-label="(option) => { return `${option.ds_cnpj + option.ds_nome}`}"
                                       @select="alteraListaTiposOcorrencias($event)"
                                       selectLabel="" deselectLabel="" selectedLabel=""
                                       placeholder="Selecione uma entidade" name="projeto_entidade"
                                       v-validate="'required'">
                            <template slot="option" slot-scope="props"><div class="truncar"><span class="text-bold">{{props.option.ds_cnpj | cnpj}}</span> {{props.option.ds_nome}}</div></template>
                            <template slot="singleLabel" slot-scope="props"><div class="truncar"><span class="identificadorIDProjeto">{{props.option.ds_cnpj | cnpj}}</span> {{props.option.ds_nome}}</div></template>
                            <template slot="noResult">Nenhum registro localizado!</template>
                          </multiselect>
                          <span v-if="errors.first('projeto_entidade')" class="label label-danger"> Deve selecionar uma entidade na lista</span>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Ocorrências ------------------------------------------------------------------------------------>
                <div class="form-group">
                  <div class="required-field" :class="{ 'has-error' : errors.first('codigo_ocorrencia') || errors.first('grupo_ocorrencia')}">
                    <label class="control-label col-md-2">Código:</label>
                    <span v-if="loading.listaOcorrencias" class="etiquetaCarregando"><i class="fa fa-refresh fa-spin"></i> Carregando lista de ocorrências...</span>
                    <span v-else>
                      <div class="col-md-2">
                        <select v-model="grupoOcorrencia" class="form-control" @change="ocorrencia.enquadramento = null" :disabled="ehVisualizacao || etapa !== 'SOLICITACAO'" name="grupo_ocorrencia" v-validate="'required'">
                          <option value="1">Informativa</option>
                          <option value="2">Alerta</option>
                          <option value="3" v-if="ocorrencia.tipo === 'PROJETO'">Restritiva Relativa</option>
                          <option value="4" v-if="ocorrencia.tipo === 'ENTIDADE'">Restritiva Absoluta</option>
                        </select>
                        <span v-if="errors.first('grupo_ocorrencia')" class="label label-danger"> Selecione qual o grupo de ocorrências deseja</span>
                      </div>
                      <div class="col-md-8">
                        <multiselect v-model="ocorrencia.enquadramento" v-if="!_.isNull(grupoOcorrencia)"
                                     :options="_.orderBy(_.filter(listaTiposOcorrencias, {'tipo_ocorrencia': _.toNumber(grupoOcorrencia), 'criar': 1, 'automatico': 0}), ['codigo', 'ASC'])"
                                     :disabled="ehVisualizacao || etapa !== 'SOLICITACAO'"
                                     :multiple="false"
                                     placeholder="Selecione uma ocorrência"
                                     label="descricao"
                                     track-by="codigo"
                                     @select="ocorrencia.prazo = null"
                                     :custom-label="(option) => { return `${option.codigo + option.descricao}`}"
                                     :preselect-first="false"
                                     :close-on-select="true"
                                     selectLabel=""
                                     deselectLabel=""
                                     selectedLabel=""
                                     name="codigo_ocorrencia"
                                     v-validate="'required'">

                          <template slot="option" slot-scope="props">
                            <strong>{{props.option.codigo}}</strong> {{props.option.descricao}}
                          </template>
                          <template slot="singleLabel" slot-scope="props"><div class="truncar"><span class="identificadorIDProjeto">{{props.option.codigo}}</span> {{props.option.descricao}}</div></template>
                          <template slot="noResult">Nenhum registro localizado!</template>
                        </multiselect>
                        <span v-if="errors.first('codigo_ocorrencia')" class="label label-danger"> Deve selecionar o código da ocorrência desejada na lista</span>
                      </div>
                    </span>
                  </div>
                </div>


                <!-- Observação ------------------------------------------------------------------------------------>
                <div class="form-group">
                  <div class="required-field" :class="{ 'has-error' : errors.first('observacao_ocorrencia')}">
                    <label class="control-label col-md-2">Observação:</label>
                    <div class="col-md-10">
                      <textarea-autosize v-model="ocorrencia.observacao" name="observacao_ocorrencia" id="observacao_ocorrencia"
                                         v-resizable class="form-control" v-validate="'required'" :disabled="ehVisualizacao || etapa !== 'SOLICITACAO'"
                                         :placeholder="!_.isEmpty(_.get(ocorrencia.enquadramento, 'informacao', '')) ? ocorrencia.enquadramento.informacao : 'Informe o detalhamento da situação que gerou a ocorrência'">
                      </textarea-autosize>
                      <span class="label label-warning" v-if="!_.isNil(ocorrencia.observacao) && ocorrencia.observacao.length > 245 && _.includes(['SOLICITACAO', 'REVISAO'], etapa)">Atenção! O SGP guardará essa observação com {{ ocorrencia.observacao.length }} caracteres, mas no Sapiens só os 245 primeiros caracteres serão gravados</span>
                      <span class="label label-info" v-if="!_.isNil(ocorrencia.observacao) && ocorrencia.observacao.length > 1000 && _.includes(['SOLICITACAO', 'REVISAO'], etapa)">Atenção! O texto esta muito grande, indicamos que o resuma</span>
                      <span v-if="errors.first('observacao_ocorrencia')" class="label label-danger"> Informe o quê se refere essa ocorrência</span>
                    </div>
                  </div>
                </div>


                <!-- Prazo ------------------------------------------------------------------------------------>
                <!-- Suporte 76052 aumentar prazo da flexibilização de 5 para 10 dias -->
                <div class="form-group" v-if="_.includes([2200, 2201, 2202, 2203], _.get(ocorrencia, 'enquadramento.codigo', 0))">
                  <div class="required-field" :class="{ 'has-error' : errors.first('prazo_ocorrencia')}">
                    <label class="control-label col-md-2">Prazo para baixa:</label>
                    <div class="col-md-2">
                      <!-- O prazo fica disponível só para alguns código e editável somente na criação da ocorrência ou na aprovação se for gestor -->
                      <datepicker  name="prazo_ocorrencia" v-model="ocorrencia.prazo" input-class="form-control datepicker"
                                   :disabled="ehVisualizacao || !_.includes(['SOLICITACAO', 'AGUARDA_APROVACAO'], etapa) || (_.includes(['AGUARDA_APROVACAO'], etapa) && !ehGestor)"
                                   :language="$datePickerPtBR" maxlength="20" :use-utc="true" placeholder="__ /__ /____"
                                   format="dd/MM/yyyy" v-validate="'required'" :disabled-dates="{to: new Date(hoje.getTime() - 86400000), from: new Date(hoje.getTime() + 864000000)}">
                      </datepicker>
                      <span v-if="errors.first('prazo_ocorrencia')" class="label label-danger"> O prazo é obrigatório para ocorrência {{ _.get(ocorrencia, 'enquadramento.codigo') }}</span>
                    </div>
                  </div>
                </div>

                <!-- Anexos diversos ------------------------------------------------------------------------------------>
                <div class="form-group">
                  <div>
                    <label class="control-label col-md-2">Anexos:</label>
                    <div class="col-md-10" style="margin-top: -10px">
                      <upload-documentos-php-novo :propDocumentos="ocorrencia.anexos" :documentTypes="''" :disable="ehVisualizacao || (etapa !== 'SOLICITACAO' && ocorrencia.acao !== 'ASSENTAMENTO')"></upload-documentos-php-novo>
                    </div>
                  </div>
                </div>

              <!-- Historico ------------------------------------------------------------------------------------>
                <div class="form-group" v-if="!_.includes(['SOLICITACAO', 'REVISAO'], etapa)">

                  <label class="control-label col-md-2">Histórico:<br/>
                    <a href="#" style="font-weight: normal;font-style: italic;" @click="layoutHistorico = layoutHistorico === 'RESUMIDO' ? 'COMPLETO' : 'RESUMIDO'">Mostrando {{ _.toLower(layoutHistorico) }}</a>
                  </label>

                  <div class="col-md-10">
                    <table class="table table-condensed table-bordered table-striped table-hover">
                      <thead style="text-align: center;">
                      <tr>
                        <th style="width: 150px; text-align: center">Etapa</th>
                        <th style="width: 200px; text-align: center">Usuário</th>
                        <th style="width: 120px; text-align: center">Data</th>
                        <th style="text-align: center">Observação</th>
                      </tr>
                      </thead>
                      <tbody v-if="_.has(itemOcorrencia, 'historico') && !_.includes(['SOLICITACAO', 'REVISAO'], etapa)">
                      <tr v-for="item in itemOcorrencia.historico" v-if="layoutHistorico === 'COMPLETO' || (layoutHistorico === 'RESUMIDO' && !_.includes(['CRIACAO_OCORRENCIA_SAPIENS', 'ATUALIZACAO_OCORRENCIA_SAPIENS', 'MIGRADO_MODULO_ACOMPANHAMENTO', 'AGUARDA_APROVACAO', 'AGUARDA_BAIXA', 'ENCAMINHAR_APROVACAO', 'BAIXAR', 'APROVAR'], item.nome))" style="text-align: center">
                        <td>{{ enumeradores[item.nome] + (item.nome === 'ASSENTAMENTO' ? ' nº ' + (_.findIndex(_.filter(itemOcorrencia.historico, ['nome', 'ASSENTAMENTO']), item) + 1) : '')}}</td>
                        <td><div class="truncar" style="width: 90%">{{ item.ds_nome_usuario }}</div></td>
                        <td>{{ _.isNull(item.termino) ? item.inicio : item.termino | moment("DD/MM/YYYY HH:mm") }}</td>
                        <td style="text-align: left">
                          <div v-if="!_.isNil(item.observacao)" v-html="item.observacao"></div>
                        </td>
                      </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

              </div>

            </div>

          </div>

        </div>

        <!-- Decisões ------------------------------------------------------------------------------------>
        <div class="col-md-12">
          <div class="col-md-12" v-if="!_.includes(['VISUALIZAR', 'CRIAR'], acao) && !ehVisualizacao && !_.includes(['CANCELADO', 'BAIXADO'], etapa)">
            <div class="form-group">
              <label class="control-label col-md-2">Decisão:</label>

              <div class="col-md-10">
                <div>
                  <!--Opção para ASSENTAMENTO-->
                  <label class="new-control new-control-radio" style="padding-top: 8px;"><input type="radio" name="decisão" value="ASSENTAMENTO" :disabled="ehVisualizacao" v-model="ocorrencia.acao" v-validate="'required'"/> {{ enumeradores['ASSENTAMENTO'] }} <div class="new-control-indicator"></div></label>
                </div>

                <div v-if="etapa === 'LIBERADO'">
                  <div v-if="(('' + ocorrencia.enquadramento.codigo)[0] === '2' && _.includes([2200, 2201, 2202, 2203], ocorrencia.enquadramento.codigo)) || _.includes(['3', '4'], ('' + ocorrencia.enquadramento.codigo)[0])">
                    <!--Opção para ENCAMINHAR_BAIXA-->
                    <label class="new-control new-control-radio" style="padding-top: 8px;"><input type="radio" name="decisão" value="ENCAMINHAR_BAIXA" :disabled="ehVisualizacao" v-model="ocorrencia.acao" v-validate="'required'"/> {{ enumeradores['ENCAMINHAR_BAIXA'] }} <div class="new-control-indicator"></div></label>
                  </div>

                  <div v-if="(('' + ocorrencia.enquadramento.codigo)[0] === '2' && !_.includes([2200, 2201, 2202, 2203], ocorrencia.enquadramento.codigo))">
                    <!--Opção para BAIXAR-->
                    <label class="new-control new-control-radio" style="padding-top: 8px;"><input type="radio" name="decisão" value="BAIXAR" :disabled="ehVisualizacao" v-model="ocorrencia.acao" v-validate="'required'"/> {{ enumeradores['BAIXAR'] }} <div class="new-control-indicator"></div></label>
                  </div>

                  <div v-show="false" v-if="('' + ocorrencia.enquadramento.codigo)[0] === '1' || (('' + ocorrencia.enquadramento.codigo)[0] === '2' && !_.includes([2200, 2201, 2202, 2203], ocorrencia.enquadramento.codigo))">
                    <!--Opção para CANCELAR-->
                    <label class="new-control new-control-radio" style="padding-top: 8px;"><input type="radio" name="decisão" value="CANCELAR" :disabled="ehVisualizacao" v-model="ocorrencia.acao" v-validate="'required'"/> {{ enumeradores['CANCELAR'] }} <div class="new-control-indicator"></div></label>
                  </div>
                </div>

                <div v-if="etapa === 'AGUARDA_APROVACAO' && ehGestor">
                  <div v-if="(('' + ocorrencia.enquadramento.codigo)[0] === '2' && _.includes([2200, 2201, 2202, 2203], ocorrencia.enquadramento.codigo)) || _.includes(['3', '4'], ('' + ocorrencia.enquadramento.codigo)[0])">
                    <!--Opção para APROVAR-->
                    <label class="new-control new-control-radio" style="padding-top: 8px;"><input type="radio" name="decisão" value="APROVAR" :disabled="ehVisualizacao" v-model="ocorrencia.acao" v-validate="'required'"/> {{ enumeradores['APROVAR'] }} <div class="new-control-indicator"></div></label>
                  </div>

                  <div v-if="(('' + ocorrencia.enquadramento.codigo)[0] === '2' && _.includes([2200, 2201, 2202, 2203], ocorrencia.enquadramento.codigo)) || _.includes(['3', '4'], ('' + ocorrencia.enquadramento.codigo)[0])">
                    <!--Opção para CANCELAR-->
                    <label class="new-control new-control-radio" style="padding-top: 8px;"><input type="radio" name="decisão" value="CANCELAR" :disabled="ehVisualizacao" v-model="ocorrencia.acao" v-validate="'required'"/> {{ enumeradores['CANCELAR'] }} <div class="new-control-indicator"></div></label>
                  </div>
                </div>

                <div v-if="etapa === 'AGUARDA_BAIXA' && ehGestor">
                  <div v-if="(('' + ocorrencia.enquadramento.codigo)[0] === '2' && _.includes([2200, 2201, 2202, 2203], ocorrencia.enquadramento.codigo)) || _.includes(['3', '4'], ('' + ocorrencia.enquadramento.codigo)[0])">
                    <!--Opção para BAIXAR-->
                    <label class="new-control new-control-radio" style="padding-top: 8px;"><input type="radio" name="decisão" value="BAIXAR" :disabled="ehVisualizacao" v-model="ocorrencia.acao" v-validate="'required'"/> {{ enumeradores['BAIXAR'] }} <div class="new-control-indicator"></div></label>
                  </div>

                  <div v-if="(('' + ocorrencia.enquadramento.codigo)[0] === '2' && _.includes([2200, 2201, 2202, 2203], ocorrencia.enquadramento.codigo)) || _.includes(['3', '4'], ('' + ocorrencia.enquadramento.codigo)[0])">
                    <!--Opção para CANCELAR-->
                    <label class="new-control new-control-radio" style="padding-top: 8px;"><input type="radio" name="decisão" value="CANCELAR" :disabled="ehVisualizacao" v-model="ocorrencia.acao" v-validate="'required'"/> {{ enumeradores['CANCELAR'] }} <div class="new-control-indicator"></div></label>
                  </div>
                </div>


                <!-- Observação para a decisão -->
                <div class="col-md-12" v-if="enumeradores[ocorrencia.acao]">
                  <div :class="'col-md-12' + (_.includes(['CANCELAR', 'ASSENTAMENTO'], ocorrencia.acao) ? ' required-field ' : ' ') + (errors.first('observacao_decisao') ? ' has-error ' : '')">
                    <label for="observacao_decisao" class="control-label">Observação para {{ enumeradores[ocorrencia.acao] }}:</label>
                    <textarea-autosize v-model="ocorrencia.observacaoDecisao" :placeholder="(_.includes(['CANCELAR', 'ASSENTAMENTO'], ocorrencia.acao) ? 'Informe' : 'Opcionalmente pode informar') + ' o motivo para ' + _.toLower(enumeradores[ocorrencia.acao]) + ' esta ocorrência'" :disabled="ehVisualizacao"
                                       name="observacao_decisao" id="observacao_decisao" v-resizable class="form-control" v-validate="_.includes(['CANCELAR', 'ASSENTAMENTO'], ocorrencia.acao) ? 'required' : ''">
                    </textarea-autosize>
                    <span class="label label-warning" v-if="!_.isNil(ocorrencia.observacaoDecisao) && ocorrencia.observacaoDecisao.length > 245">Atenção! O SGP guardará esse motivo com {{ ocorrencia.observacaoDecisao.length }} caracteres, mas no Sapiens só os 245 primeiros caracteres serão gravados</span>
                    <span class="label label-info" v-if="!_.isNil(ocorrencia.observacaoDecisao) && ocorrencia.observacaoDecisao.length > 1000">Atenção! O texto esta muito grande, indicamos que o resuma</span>
                    <span v-if="errors.first('observacao_decisao')" class="label label-danger"> Ao {{ enumeradores[ocorrencia.acao] }} é obrigatório informar um motivo para constar na observação da tarefa</span>
                  </div>
                </div>

              </div>
            </div>
          </div>

          <div class="col-md-7 col-md-offset-2">
            <span v-if="ehGestor || _.includes(['SOLICITACAO', 'LIBERADO'], etapa) || ocorrencia.acao === 'ASSENTAMENTO'">
              <g-button-ujarak color="success" size="button--size-ss" v-if="acao !== 'VISUALIZAR'" @click.native="validaConclusao()"><i class="fa fa-check-circle-o" aria-hidden="true"></i> Concluir</g-button-ujarak>
            </span>
            <span v-if="botaoVoltar"><g-button-ujarak color="warning" @click.native="$router.go(-1)" type="button"><i class="fa fa-chevron-circle-left" aria-hidden="true"></i> Voltar</g-button-ujarak></span>
            <span v-else><g-button-ujarak color="warning" @click.native="acaoOcorrencia('LISTAR', null)" type="button"><i class="fa fa-list" aria-hidden="true"></i> Volta para lista</g-button-ujarak></span>
          </div>

          <!-- tags de infomações sobre a situação da ocorrência ocultadas a pedido do cliente -->
          <div v-show="false" class="col-md-3 text-right" v-if="!_.isNull(id) && !loading.tela && !_.includes(['SOLICITACAO', 'REVISAO'], etapa)">
            <span :title="'<h5>Ocorrência Ativa afeta o projeto/entidade. Inativa não afeta, pois foi baixada, cancelada ou ainda aguarda aprovação</h5>'" v-tippy="{inertia:true, arrow:true, animation:'fade', distance:'1', size:'large'}">
              <span v-if="enumeradores[ativo] === 1" class="label label-success">Ativo</span>
              <span v-else class="label label-default">Inativo</span>
            </span>
            <span :title="'<h5>Mostra a situação do processo <span class=\'realce\'>' + id + '</span> ligada a ocorrência. Em geral ficará em execução até ser baixada (passa para feito) ou cancelada</h5>'" v-tippy="{inertia:true, arrow:true, animation:'fade', distance:'1', size:'large'}">
              <span v-if="_.includes(['FEITO', 'CANCELADO'], itemOcorrencia.situacao)" class="label label-default">Processo {{ enumeradores[itemOcorrencia.situacao] }}</span>
              <span v-else class="label label-primary" style="background: var(--cor-alerta-light) !important">Processo {{ enumeradores[itemOcorrencia.situacao] }}</span>
            </span>
            <span :title="'<h5>Mostra a etapa atual/situação em que se encontra a ocorrência. Poder Liberada, Aguardando aprovção ou baixa, baixada ou cancelada</h5>'" v-tippy="{inertia:true, arrow:true, animation:'fade', distance:'1', size:'large'}">
              <span v-if="_.includes(['BAIXADO', 'CANCELADO'], etapa)" class="label label-default">{{ enumeradores[etapa] }}</span>
              <span v-else class="label label-info">{{ enumeradores[etapa] }}</span>
            </span>
          </div>

        </div>

      </div>
    </div>
  </div>

  </div>
</template>

<script>
  // eslint-disable-next-line no-unused-vars
  import { mapGetters } from 'vuex'
  import moment from 'moment'
  import * as XLSX from 'xlsx'
  import UploadDocumentosPhpNovo from '../../modules/uploadDocumentosPhpNovo'

  export default {
    components: {
      UploadDocumentosPhpNovo
    },
    name: 'EditaOcorrencias',
    data () {
      return {
        acao: 'LISTAR', // EDITAR, CRIAR, VISUALIZAR, APROVAR, BAIXAR
        loading: {
          tela: false,
          carteiras: false,
          codigos: false,
          detalhes: false,
          listaOcorrencias: false,
          listaProjetosEntidades: false
        },
        filtro: {
          id: [],
          codigo: [],
          situacao: [],
          etapa: [],
          nivel: [],
          carteira: null,
          observacao: '',
          pesquisa: ''
        },
        tabelaListaOcorrencias: {
          currentPage: 1,
          perPage: 6,
          totalRows: 0,
          sortBy: 'tarefaInicio',
          sortDesc: true,
          filter: null,
          bordered: true,
          numeroAtualizacao: 0,
          // 70667 - Reorganizar o Layout de apresentação de Ocorrências com Data criação no inicio em ordem decrescente
          fields: [
            {key: 'tarefaInicio', label: 'Data criação', thStyle: 'text-align: center; width: 110px', class: 'text-center'},
            {key: 'id', label: 'ID', sortable: true, thStyle: 'text-align: center; width: 50px', class: 'text-center'},
            {key: 'codigo', label: 'Ocorrência', sortable: true, thStyle: 'text-align: center', class: 'text-left'},
            {key: 'projeto', label: 'Projeto / Entidade', sortable: true, thStyle: 'text-align: center', class: 'text-left'},
            {key: 'observacao', label: 'Observação', sortable: true, thStyle: 'text-align: center; width: 30%', class: 'text-center'},
            {key: 'etapa', label: 'Situação', sortable: true, thStyle: 'text-align: center; width: 100px', class: 'text-center'},
            {key: 'acoes', label: 'Ações', thStyle: 'text-align: center; width: 110px', class: 'text-center'}
          ]
        },
        pesquisa: '',
        hoje: new Date(),
        enumeradores: {'ANALISE': 'Análise', 'PENDENCIAS': 'Pendências', 'AUTORIZACAO': 'Autorização', 'REVISAO': 'Revisão', 'APROVACAO': 'Aprovação', 'ENTIDADE': 'Entidade', 'PROJETO': 'Projeto', 'OCORRENCIAS': 'Ocorrências', 'OCORRENCIA_PROJETO': 'Ocorrência em projetos', 'OCORRENCIA_ENTIDADE': 'Ocorrência em entidade', 'FLEXIBILIZACAO': 'Flexibilização', 'SOLICITACAO': 'Registro', 'ENCAMINHAR_APROVACAO': 'Encaminhar para Aprovação', 'ENCAMINHAR_BAIXA': 'Encaminhar para Baixa', 'APROVAR': 'Aprovar', 'BAIXAR': 'Aprovar Baixa', 'CANCELAR': 'Cancelar', 'LIBERADO': 'Liberado', 'AGUARDA_APROVACAO': 'Aguardando Aprovação', 'AGUARDA_BAIXA': 'Aguardando Baixa', 'BAIXADO': 'Baixado', 'CANCELADO': 'Cancelado', 'FEITO': 'Feito', 'EM_EXECUCAO': 'Em Execução', 'CRIACAO_OCORRENCIA_SAPIENS': 'Gerando ocorrência no Sapiens', 'ATUALIZACAO_OCORRENCIA_SAPIENS': 'Atualizando ocorrência no Sapiens', 'MIGRADO_MODULO_ACOMPANHAMENTO': 'Migrado do módulo de Acompanhamento', 'ASSENTAMENTO': 'Assentamento', 'INFORMATIVAS': 'Informativas', 'ALERTAS': 'Alertas', 'RESTRITIVAS_RELATIVAS': 'Restritivas Relativas', 'RESTRITIVAS_ABSOLUTAS': 'Restritivas Absolutas'},
        itensLayoutTela: ['botaoNovo', 'botaoExportarExcel', 'caixaPesquisa', 'filtroTexto', 'filtroCarteira', 'filtroNivelOcorrencia', 'filtroCodigoOcorrencia', 'filtroSituacaoOcorrencia', 'totalizador', 'colunaId', 'colunaCodigo', 'colunaObservacao', 'colunaProjeto', 'colunaUsuarioCriador', 'colunaSituacao', 'colunaDataCriacao', 'colunaAcoes'],
        listaNiveis: [{'nivel': 1, 'codigo': 'INFORMATIVAS'}, {'nivel': 2, 'codigo': 'ALERTAS'}, {'nivel': 3, 'codigo': 'RESTRITIVAS_RELATIVAS'}, {'nivel': 4, 'codigo': 'RESTRITIVAS_ABSOLUTAS'}],
        listaSituacoesOcorrencias: ['LIBERADO', 'AGUARDA_APROVACAO', 'AGUARDA_BAIXA', 'BAIXADO'],
        listaCarteiras: [],
        id: null,
        ocorrencias: [],
        itemOcorrencia: {}, // Se refere ao item da lista de ocorrencias que tem onde ela esta ligada, a etapa, historico etc
        ocorrencia: {
          acao: 'SALVAR',
          tipo: 'PROJETO',
          alvo: null,
          enquadramento: null,
          observacao: '',
          observacaoDecisao: '',
          prazo: null,
          anexos: []
        }, // Parte do itemOcorrencia que trata dos dados que compoe a ocorrencia como código, descricao, observacoes, prazos, anexos etc
        grupoOcorrencia: null,
        listaTiposOcorrencias: [],
        listaTiposOcorrenciasBackup: [],
        listaProjetosEntidades: [],
        etapa: 'SOLICITACAO',
        aprovacao: {},
        numeroAtualizacao: 0,
        layoutHistorico: 'RESUMIDO', // 'RESUMIDO' ou 'COMPLETO'
        ehVisualizacao: false,
        ehGestor: false,
        buscaTipo: 'projeto', // ['projeto', 'entidade', 'cnpj']
        placeholderCampoBusca: [
          { tipo: 'projeto', placeholder: 'Número do projeto' },
          { tipo: 'entidade', placeholder: 'Nome do projeto' },
          { tipo: 'cnpj', placeholder: 'CNPJ da entidade' }
        ]

      }
    },
    props: [
      'ids', // opcional - array com ids dos processos
      'idEntidade', // opcional - id da entidade parceira
      'idProcesso', // opcional - id da entidade parceira
      'botaoVoltar', // opcional - quando informado substituirá o botão de ir para lista de ocorrência para um de voltar a página anterior
      'numeroProjeto', // opcional - inteiro número do projeto, ex. 20036
      'situacaoOcorrencia', // opcional - inteiro, ex. 0 para inativos, 1 para ativos
      'codigoOcorrencia', // opcional - inteiro código de quatro números da ocorrência, ex. 1005
      'nivelOcorrencia', // opcional - inteiro equivale ao primeiro número do código, ex. 1, 2, 3 ou 4
      'visualizacao', // opcional - true/false, default false
      'informacao', // opcional - dados da consulta, ex. 'SIMPLIFICADO' para dados minimos para listagens, 'COMPLETO' com todos os dados e historico de tarefas
      'itensLayout' // opcional - array com os elementos de tela, se não informado virá com todos. Itens ['botaoNovo', 'botaoExportarExcel', 'caixaPesquisa', 'filtroColuna', 'totalizador', 'colunaId', 'colunaCodigo', 'colunaObservacao', 'colunaProjeto', 'colunaUsuarioCriador', 'colunaDataCriacao', 'colunaAcoes', 'filtroCarteira']
    ],
    created () {
      let vm = this
      this.ehVisualizacao = (this.visualizacao || this.$route.params.visualizacao) || false
      // 70724 - Adicionar novo código da função de gerente de soluções
      this.ehGestor = this.usuarioLogado.perfis.some(perfil => perfil.ds_nome === 'Gerentes')
      this.id = (this.idProcesso || this.$route.params.id) || null
      this.limparPesquisa()
      if (_.isNil(this.numeroProjeto) && _.has(this.usuarioLogado, 'configuracoes.tela_ocorrencias.filtro')) {
        let filtroBackup = this.filtro
        _.forEach(this.usuarioLogado.configuracoes.tela_ocorrencias.filtro, function (v, p) {
          vm.filtro[p] = _.isEmpty(v) ? filtroBackup[p] : v
        })
        this.$forceUpdate()
      }
      // Eliminar colunas se houver props itensLayout, mantendo as colunas do props
      if (this.itensLayout && this.itensLayout.length > 0) {
        let colunasParaRemover = _.filter(_.xor(this.itensLayoutTela, this.itensLayout), function (i) { return i.indexOf('coluna') !== -1 })
        colunasParaRemover.forEach((item) => {
          _.remove(this.tabelaListaOcorrencias.fields, ['key', _.toLower(item.replace('coluna', ''))])
        })
        if (!_.includes(this.itensLayout, 'colunaProjeto') && _.includes(this.itensLayout, 'colunaObservacao')) {
          _.set(_.find(this.tabelaListaOcorrencias.fields, ['key', 'observacao']), 'thStyle', 'text-align: center; width: auto')
        }
      }
      this.itensLayoutTela = this.itensLayout || this.itensLayoutTela
      if (!_.isNull(this.id)) {
        this.acaoOcorrencia('EDITAR', this.id)
      } else if (!_.isNil(this.numeroProjeto)) {
        this.buscaOcorrencias()
      }
      this.carregarListaTiposOcorrencias()
      this.carregarListaProjetosEntidades()
      this.buscaCarteiras()
    },
    watch: {
      'ocorrencia.tipo': function () {
        if (!this.ehVisualizacao && this.etapa === 'SOLICITACAO') {
          this.ocorrencia.alvo = null
          this.grupoOcorrencia = null
          this.ocorrencia.enquadramento = null
          this.$forceUpdate()
        }
      },
      'ocorrencia.acao': function () {
        this.ocorrencia.observacaoDecisao = null
        this.$forceUpdate()
      },
      'ocorrencia.enquadramento': function () {
        let padrao = _.get(this.ocorrencia.enquadramento, 'padrao', '')
        if (!_.isEmpty(padrao)) {
          this.ocorrencia.observacao = padrao
        }
        this.$forceUpdate()
      },
      'idProcesso': function () {
        this.id = this.idProcesso || null
        if (!_.isNull(this.id)) {
          this.carregaOcorrencia()
        }
        this.$forceUpdate()
      }
    },
    computed: {
      ...mapGetters([
        'usuarioLogado',
        'urlLaravel'
      ])
    },
    mounted: function () {
    },
    methods: {
      alteraListaTiposOcorrencias (item) {
        this.ocorrencia.enquadramento = null
        this.listaTiposOcorrencias = []
        let lista = _.cloneDeep(this.listaTiposOcorrenciasBackup)
        let situacaoProjeto = _.get(item, 'sitprj', '')
        if (!_.includes(['SO3', 'SO4'], situacaoProjeto)) {
          _.remove(lista, function (o) {
            return _.includes([2200, 2201, 2202], o.codigo)
          })
        }
        this.listaTiposOcorrencias = _.cloneDeep(lista)
        this.$forceUpdate()
      },
      limparPesquisa () {
        this.filtro = {id: [], codigo: [], situacao: [], etapa: [], nivel: [], carteira: null, observacao: '', pesquisa: ''}
        if (_.isNil(this.numeroProjeto)) {
          this.ocorrencias = []
        }
      },
      pesquisarOcorrencias () {
        let pesquisa = {'informacao': this.layout || 'SIMPLIFICADO'}
        _.set(pesquisa, 'projeto', this.numeroProjeto) // Adiciona o número do projeto se estivier informado (no caso que esta na tela de Projeto)
        switch (this.buscaTipo) {
          case ('entidade'):
            _.set(pesquisa, 'entidadenome', this.filtro.pesquisa)
            break
          case ('projeto'):
            _.set(pesquisa, 'projeto', this.numeroProjeto || this.filtro.pesquisa)
            break
          case ('cnpj'):
            _.set(pesquisa, 'cnpj', this.filtro.pesquisa)
            break
        }
        if (!_.isEmpty(this.filtro.codigo)) {
          _.set(pesquisa, 'codigo', _.map(this.filtro.codigo, 'codigo'))
        }
        if (!_.isEmpty(this.filtro.nivel)) {
          _.set(pesquisa, 'nivel', _.map(this.filtro.nivel, 'nivel'))
        }
        if (!_.isNull(this.filtro.carteira)) {
          _.set(pesquisa, 'carteira', this.filtro.carteira.usu_codcart)
        }
        if (!_.isEmpty(this.filtro.situacao)) {
          _.set(pesquisa, 'situacao', this.filtro.situacao)
        }
        this.buscaOcorrencias(pesquisa)
        this.salvarConfiguracoes()
      },
      buscaOcorrencias (pesquisa) {
        this.loading.tela = true
        let consulta = {'informacao': this.layout || 'SIMPLIFICADO'}
        _.set(consulta, 'projeto', this.numeroProjeto)
        _.set(consulta, 'entidade', this.idEntidade)
        _.set(consulta, 'ativo', this.situacaoOcorrencia)
        _.set(consulta, 'codigo', this.codigoOcorrencia)
        _.set(consulta, 'nivel', this.nivelOcorrencia)
        _.set(consulta, 'ids', this.ids)
        console.log('consulta', consulta)
        axiosLaravel.post('ocorrencia/busca', pesquisa || consulta).then((response) => {
          if (_.get(response.data, 'codigo', '') === 'OK') {
            this.ocorrencias = response.data.retorno
            this.tabelaListaOcorrencias.totalRows = this.ocorrencias.length
            this.tabelaListaOcorrencias.currentPage = 1
          } else {
            this.$snotify.error(response.data.mensagem)
          }
          this.$forceUpdate()
          this.loading.tela = false
        })
          .catch((error) => {
            this.$snotify.clear()
            this.$root.trataErro(error)
            this.loading.tela = false
          })
      },
      carregaOcorrencia () {
        this.loading.tela = true
        axiosLaravel.post('ocorrencia/busca/', {'ids': [this.id], 'informacao': 'COMPLETO', 'historico': true}).then((response) => {
          if (_.get(response.data, 'codigo', '') === 'OK') {
            if (response.data.retorno.length > 1) {
              this.$snotify.error('Retornou mais de um registro. Procure o administrador do sistema!')
            } else {
              let retorno = response.data.retorno[0]
              this.id = retorno.id
              this.itemOcorrencia = retorno
              this.ocorrencia = JSON.parse(this.itemOcorrencia.requisicao)
              this.ocorrencia.acao = null // LImpara a ação para escolha do usuário
              this.etapa = this.itemOcorrencia.etapa
              this.grupoOcorrencia = _.toNumber(('' + this.ocorrencia.enquadramento.codigo).substr(0, 1))
              this.loading.tela = false
            }
          } else {
            this.$snotify.error(response.data.mensagem)
          }
          this.$emit('ocorrencia', this.ocorrencia)
          this.$forceUpdate()
        })
          .catch((error) => {
            this.$root.trataErro(error)
            this.loading.tela = false
          })
      },
      carregarListaTiposOcorrencias () {
        this.loading.listaOcorrencias = true
        if (typeof Storage !== 'undefined') { // Ver se o browser suporta localStorage/sessionStorage.
          // Se sim, guardará a lista de codigos de ocorrência (raramente muda) junto com um timestamp da ultima atualizacao
          let listaTiposOcorrencias = JSON.parse(window.localStorage.getItem('codigos-ocorrencia'))
          // Calcula a diferenca em dias do timestamp de agora e do que foi gravadp no storage (que se não tiver ainda considera o inicio de 2023 para forçar atualização)
          let diferenca = Math.floor((((new Date()).getTime()) / 43200000) - ((_.get(listaTiposOcorrencias, 'atualizado', (new Date('2023-01-01')).getTime())) / 43200000))
          if (diferenca >= 1 || _.isEmpty(listaTiposOcorrencias)) { // Se não tiver lista, ou lista vazia ou a lista estiver desatualizada (com mais de 1 dia).. atualiza ela
            axiosLaravel.get('tipo-ocorrencia/').then((response) => {
              this.listaTiposOcorrencias = _.cloneDeep(response.data)
              this.listaTiposOcorrenciasBackup = _.cloneDeep(response.data)
              window.localStorage.setItem('codigos-ocorrencia', JSON.stringify({'atualizado': Math.floor((new Date()).getTime()), 'lista': this.listaTiposOcorrencias}))
              this.loading.listaOcorrencias = false
              this.$forceUpdate()
            })
              .catch((error) => {
                this.loading.listaOcorrencias = false
                if (error) {
                  this.$root.trataErro(error)
                }
              })
          } else {
            this.listaTiposOcorrencias = _.cloneDeep(listaTiposOcorrencias.lista)
            this.listaTiposOcorrenciasBackup = _.cloneDeep(listaTiposOcorrencias.lista)
            this.loading.listaOcorrencias = false
          }
        }
      },
      carregarListaProjetosEntidades () {
        this.loading.listaProjetosEntidades = true
        axiosLaravel.get('consulta/projetos-entidades/lista/').then((response) => {
          if (_.get(response.data, 'codigo', '') === 'OK') {
            this.listaProjetosEntidades = response.data.retorno
            this.selecionaProjetoEntidadeLista()
          } else {
            this.$snotify.error(response.data.mensagem)
          }
          this.loading.listaProjetosEntidades = false
          this.$forceUpdate()
        })
          .catch((error) => {
            this.loading.listaProjetosEntidades = false
            if (error) {
              this.$root.trataErro(error)
            }
          })
      },
      selecionaProjetoEntidadeLista () {
        if (_.isNull(_.get(this.ocorrencia, 'alvo', null))) {
          let numero = !_.isNull(_.get(this.ocorrencia, 'numero', null)) ? this.ocorrencia.numero : (!_.isNil(this.numeroProjeto) ? this.numeroProjeto : 0)
          this.ocorrencia.alvo = _.find(_.get(this.listaProjetosEntidades, this.ocorrencia.tipo === 'PROJETO' ? 'projetos' : 'entidades'), [this.ocorrencia.tipo === 'PROJETO' ? 'ds_codigo_projeto_erp' : 'id', ('' + numero)])
          this.alteraListaTiposOcorrencias(this.ocorrencia.alvo)
        }
      },
      acaoOcorrencia (acao, id) {
        if (acao === 'LISTAR' && !_.isNull(id)) { // Se foi pedido para ir para a Lista e tem um id é porque algo foi alterado e precisar atualizar as ocorrências
          this.pesquisarOcorrencias()
          id = null
        }
        this.limparOcorrencia()
        this.id = id
        this.ehVisualizacao = acao === 'VISUALIZAR'
        this.acao = _.isNull(id) ? 'LISTAR' : acao
        if (!_.isNull(this.id) && !_.includes(['CRIAR', 'LISTAR'], this.acao)) {
          this.carregaOcorrencia()
        }
        this.$forceUpdate()
      },
      limparOcorrencia () {
        this.etapa = 'SOLICITACAO'
        this.grupoOcorrencia = null
        this.ocorrencia = {acao: 'SALVAR', tipo: 'PROJETO', alvo: null, enquadramento: null, observacao: '', prazo: null, anexos: []}
        this.selecionaProjetoEntidadeLista()
      },
      filtroPorItem (row, filter) {
        let saida = true
        if (filter !== 'retornar_todos_registros') { // Se receber a string para filtrar tudo, então retorna o filtro como '' e não acrescenta a pesquisa por termo
          let termos = _.split(_.toLower(filter), ' ')
          termos.forEach((termo) => {
            saida = saida && ((_.toLower('' + row.id + row.codigo + row.numeroProjeto + row.projeto + row.entidade + row.observacao + this.enumeradores[row.etapa])).indexOf(termo) !== -1 ||
              (('' + this.filtro.carteira) === ('' + row.codigoCarteira)))
          })
        }
        return saida
      },
      onFiltered (filteredItems) {
        this.tabelaListaOcorrencias.totalRows = filteredItems.length
        this.tabelaListaOcorrencias.currentPage = 1
        this.$forceUpdate()
      },
      ajustaPesquisa () {
        // Para o b-table uma string vazia significa "não pesquise", então para efeito de forçar pesquisa deve sempre ter um valor quando for ''
        this.tabelaListaOcorrencias.filter = (_.isNull(this.filtro.pesquisa) || this.filtro.pesquisa === '') ? 'retornar_todos_registros' : this.filtro.pesquisa
      },
      validaConclusao () {
        this.$validator.validateAll().then(validado => {
          if (validado && this.errors.items.length === 0) {
            this.processaOcorrencias()
          } else {
            this.$snotify.error('Atenção', {timeout: 1000})
          }
        })
      },
      processaOcorrencias () {
        this.loading.tela = true
        this.$snotify.async('Registrando ocorrências. Por favor, aguarde...', {timeout: 3000})
        let ocorrencia = _.clone(this.ocorrencia)
        _.set(ocorrencia, 'id', this.id)
        axiosLaravel.post('ocorrencia/encaminhar/', {'lista': [ocorrencia]}).then((response) => {
          this.$snotify.clear()
          if (_.get(response.data, 'codigo', '') === 'OK') {
            this.$snotify.success('Ocorrência registrada com sucesso', {timeout: 2000})
            if (!_.isNil(this.botaoVoltar) && this.botaoVoltar) {
              this.$router.go(-1)
            } else {
              this.acaoOcorrencia('LISTAR', this.id)
            }
          } else {
            this.$snotify.error(response.data.mensagem)
            this.loading.tela = false
          }
        })
          .catch((error) => {
            this.$snotify.clear()
            this.loading.tela = false
            this.$root.trataErro(error)
          })
      },
      buscaCarteiras () {
        this.loading.carteiras = true
        if (typeof Storage !== 'undefined') { // Ver se o browser suporta localStorage/sessionStorage.
          // Se sim, guardará a lista de codigos de ocorrência (raramente muda) junto com um timestamp da ultima atualizacao
          let carteirasProjeto = JSON.parse(window.localStorage.getItem('carteiras-projeto'))
          // Calcula a diferenca em dias do timestamp de agora e do que foi gravadp no storage (que se não tiver ainda considera o inicio de 2023 para forçar atualização)
          let diferenca = Math.floor((((new Date()).getTime()) / 86400000) - ((_.get(carteirasProjeto, 'atualizado', (new Date('2023-01-01')).getTime())) / 86400000))
          if (diferenca >= 1 || _.isEmpty(carteirasProjeto)) { // Se não tiver lista ou a lista estiver desatualizada (com mais de 1 dia).. atualiza ela
            axiosLaravel.get('carteira/projeto/1500').then((response) => {
              this.listaCarteiras = response.data.retorno['carteiras']
              window.localStorage.setItem('carteiras-projeto', JSON.stringify({'atualizado': Math.floor((new Date()).getTime()), 'lista': this.listaCarteiras}))
              this.loading.carteiras = false
              this.$forceUpdate()
            })
              .catch((error) => {
                this.loading.carteiras = false
                if (error) {
                  this.$root.trataErro(error)
                }
              })
          } else {
            this.listaCarteiras = _.cloneDeep(carteirasProjeto.lista)
            this.loading.carteiras = false
          }
        }
      },
      abrePaginaNova (url, numero) {
        window.open(location.protocol + '//' + location.host + '/' + url + numero, '_blank')
      },
      salvarConfiguracoes () {
        _.set(this.usuarioLogado, 'configuracoes.tela_ocorrencias.filtro', this.filtro)
        axiosLaravel.post('/usuario/configuracoes', {'configuracoes': this.usuarioLogado.configuracoes}).then((response) => {
          console.log('configuracoes', this.usuarioLogado.configuracoes)
        })
          .catch((error) => {
            if (error) {
              console.log('error', error)
              this.$root.trataErro(error)
            }
          })
      },
      checkboxNivel (item) {
        if (_.find(this.filtro.nivel, ['nivel', item.nivel])) {
          _.remove(this.filtro.nivel, item)
        } else {
          this.filtro.nivel.push(item)
        }
        this.$forceUpdate()
      },
      exportarExcel () {
        let vm = this
        let listaOcorrencias = []
        this.ocorrencias.forEach(function (o) {
          if (_.get(o, 'mostrar', true)) {
            listaOcorrencias.push({
              'Projeto': o.numeroProjeto + ' - ' + o.projeto,
              'Entidade': o.entidade,
              'Tipo': o.nome === 'OCORRENCIA_PROJETO' ? 'Projeto' : 'Entidade',
              'Etapa atual': vm.enumeradores[o.etapa],
              'Ocorrência': o.codigo + ' - ' + o.descricao,
              'Usuário Registro': o.usuarioCriadorNome,
              'Data Criação': moment(o.inicio).format('DD/MM/YYYY HH:mm:ss'),
              'Data Baixa': _.isEmpty(o.dataBaixa) ? '' : moment(o.dataBaixa).format('DD/MM/YYYY HH:mm:ss'),
              'Carteira': o.nomeCarteira,
              'Id': o.id,
              'Observação': o.observacao,
              'Sequência no Sapiens': o.sequencia
            })
          }
        })
        let principal = XLSX.utils.json_to_sheet(listaOcorrencias)
        let wb = XLSX.utils.book_new() // Cria a pasta de trabalho (conjunto de planilhas) no Excel
        XLSX.utils.book_append_sheet(wb, principal, 'Lista de Ocorrências') // A primeira planilha será a que contém a listagem das ocorrências
        XLSX.writeFile(wb, 'ocorrencias.xlsx') // Cria o arquivo com a pasta de trabalho do Excel e faz download
      }
    }
  }
</script>

<style scoped>
  .linkProjeto .fa-external-link {
    display: none;
  }
  .linkProjeto:hover {
    cursor: pointer;
    color: var(--cor-destaque);
  }
  .linkProjeto:hover .fa-external-link {
    display: inline;
  }
</style>
