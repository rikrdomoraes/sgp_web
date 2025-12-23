<template>
  <div class="content-wrapper" v-bind:style="'min-height: ' + alturaContentWrapper + 'px' + (ehAcessoPorLink ? ';margin-left: 0; background: white;' : '')">

    <vue-headful :title="'SGP - Edição de Sumário Executivo'"/>

    <section class="content-header" v-if="!ehAcessoPorLink">
      <h1>
        <span>{{_.isNull(sumarioCarregado.id) ? 'Novo Sumário' : (ehVisualizacao ? 'Visualiza' : 'Edição de') + ' sumário executivo ID ' + sumarioCarregado.id }}</span>

        <span v-if="!ehVisualizacao">
          <span v-if="_.isNull(sumarioCarregado.id)">
            <g-button-moema color="primary" @click.native="salvarEdicao()" type="button" v-if="salvaSumario.statusSalvamento !== 'PROCESSANDO'"
                            :title="'<h5>Ao clicar ele criará este sumério no sistema para uso. Então antes de fazê-lo verifique se não existe um sumário executivo desejado já criado</h5>'" v-tippy="{inertia:true, arrow:true, animation:'perspective', distance:'1', size:'large', arrow:true, delay: [500, 0]}">
              <i class="fa fa-plus-circle" aria-hidden="true"></i> Cria novo sumário</g-button-moema>
            <span v-if="salvaSumario.statusSalvamento === 'PROCESSANDO'" class='button--moema warning' style='font-size: 12px;padding: 8px 50px 10px 15px;border-radius: 2px !important;background: var(--cor-borda-dark) !important;cursor: not-allowed;'><i class='fa fa-refresh fa-spin'></i> Criando Sumário ...</span>
          </span>

          <span v-if="!_.isNull(sumarioCarregado.id)">
            <span v-if="salvaSumario.statusSalvamento === 'PROCESSANDO'" class='button--moema warning' style='font-size: 12px;padding: 8px 50px 10px 15px;border-radius: 2px !important;background: var(--cor-borda-dark) !important;cursor: not-allowed;'><i class='fa fa-refresh fa-spin'></i> Salvando</span>
            <span v-else-if="salvaSumario.statusSalvamento === 'FEITO'" class='button--moema success' style='font-size: 12px;padding: 8px 10px 10px 15px;border-radius: 2px !important;background: var(--cor-verde) !important;cursor: not-allowed;'><i class='fa fa-check'></i> Sumário salvo</span>
            <span v-else><g-button-moema color="primary" @click.native="salvarEdicao()" type="button"><i class="fa fa-floppy-o" aria-hidden="true"></i> Salvar alterações</g-button-moema></span>
          </span>
        </span>
        <span>
          <g-button-moema color="warning" @click.native="$router.push({name: 'lista-sumario-executivo'})" type="button"><i class="fa fa-chevron-circle-left" aria-hidden="true"></i> Voltar</g-button-moema>
          <div class="espacamento_botoes"></div>
          <g-button-moema color="success" @click.native="imprimir()" v-if="_.isNull(participanteEditando) && _.isNull(investimentoEditando)" type="button"><i class="fa fa-print" aria-hidden="true"></i> Imprimir</g-button-moema>
        </span>

        <span stylple="float: right; font-size: 14px;margin: 14px 10px 0 0" v-if="!_.isNull(sumarioCarregado.id)">última atualização em {{sumarioCarregado.updated_at | moment("DD/MM/YYYY HH:mm:ss")}}</span>
      </h1>
    </section>

    <section class="content" id="sumario" v-if="!ehAcessoPorLink">

      <div class="row nao_imprimir">

        <div class="col-md-12">

          <div class="box box-primary">

            <div class="box-body">

              <div class="form-horizontal">

                <div class="form-group">
                  <div class="required-field" :class="{ 'has-error' : errors.first('acao')}">
                    <label class="control-label col-md-2">Ação</label>
                    <div class="col-md-10">
                      <input v-model="sumarioCarregado.sumario.acao" type="text" name="acao" ref="acao" class="form-control" v-validate="'required'" :disabled="ehVisualizacao || !_.isNull(participanteEditando) || !_.isNull(investimentoEditando)"
                      :title="'<h5>Título do evento</h5>'" v-tippy="{inertia:true, arrow:true, animation:'perspective', distance:'1', size:'large', arrow:true, delay: [500, 0]}" />
                      <span v-if="errors.first('acao')" class="label label-danger"> O título do evento (ação) a ser realizada é obrigatório</span>
                    </div>
                  </div>
                </div>


                <div class="form-group">
                  <div class="">
                    <label class="control-label col-md-2">Data</label>
                    <div class="col-md-2">
                      <datepicker  type="date" v-model="sumarioCarregado.sumario.data" :disabled="ehVisualizacao || !_.isNull(participanteEditando) || !_.isNull(investimentoEditando)" name="data" input-class="form-control datepicker"
                                   :class="{ 'has-error' : errors.first('data')}" :language="$datePickerPtBR" maxlength="20" :use-utc="true" placeholder="__ /__ /____"
                                   :disabled-dates="{to: new Date(new Date().getTime() - 86400000)}" format="dd/MM/yyyy"
                                   :title="'<h5>Data da ação</h5>'" v-tippy="{inertia:true, arrow:true, animation:'perspective', distance:'1', size:'large', arrow:true, delay: [500, 0]}">
                      </datepicker>
                    </div>
                  </div>

                  <div class="">
                    <label class="control-label col-md-2">Horário</label>
                    <div class="col-md-2">
                      <select v-model="sumarioCarregado.sumario.inicio" name="inicio" class="form-control" :disabled="ehVisualizacao || !_.isNull(participanteEditando) || !_.isNull(investimentoEditando)" :title="'<h5>Horário de Início</h5>'" v-tippy="{inertia:true, arrow:true, animation:'perspective', distance:'1', size:'large', arrow:true, delay: [500, 0]}">
                        <option v-for="hora in horarios">{{hora}}</option>
                      </select>
                    </div>
                  </div>
                  <div class="">
                    <div class="col-md-2">
                      <select v-model="sumarioCarregado.sumario.termino" name="termino" class="form-control" :disabled="ehVisualizacao || !_.isNull(participanteEditando) || !_.isNull(investimentoEditando)"
                              :title="'<h5>Horário de término</h5>'" v-tippy="{inertia:true, arrow:true, animation:'perspective', distance:'1', size:'large', arrow:true, delay: [500, 0]}">
                        <option v-for="hora in _.takeRight(horarios, (horarios.length - (_.indexOf(horarios, sumarioCarregado.sumario.inicio))))">{{hora}}</option>
                      </select>
                    </div>
                  </div>
                </div>


                <div class="form-group">
                  <div class="">
                    <label class="control-label col-md-2">Local</label>
                    <div class="col-md-10">
                      <input v-model="sumarioCarregado.sumario.local" type="text" name="local" ref="local" class="form-control" :disabled="ehVisualizacao || !_.isNull(participanteEditando) || !_.isNull(investimentoEditando)"
                             :title="'<h5>Local onde será a ação</h5>'" v-tippy="{inertia:true, arrow:true, animation:'perspective', distance:'1', size:'large', arrow:true, delay: [500, 0]}" />
                    </div>
                  </div>
                </div>


                <div class="form-group">
                  <div class="required-field" :class="{ 'has-error' : errors.first('objeto')}">
                    <label class="control-label col-md-2">Objeto</label>
                    <div class="col-md-10">
                      <input v-model="sumarioCarregado.sumario.objeto" type="text" name="objeto" ref="objeto" class="form-control" v-validate="'required'" :disabled="ehVisualizacao || !_.isNull(participanteEditando) || !_.isNull(investimentoEditando)"
                             :title="'<h5>O objeto da ação</h5>'" v-tippy="{inertia:true, arrow:true, animation:'perspective', distance:'1', size:'large', arrow:true, delay: [500, 0]}" />
                      <span v-if="errors.first('objeto')" class="label label-danger"> O objeto da ação é obrigatório</span>
                    </div>
                  </div>
                </div>


                <div class="form-group">
                  <div class="required-field" :class="{ 'has-error' : errors.first('finalidade')}">
                    <label class="control-label col-md-2">Finalidade</label>
                    <div class="col-md-10" :title="'<h5>Finalidade da ação</h5>'" v-tippy="{inertia:true, arrow:true, animation:'perspective', distance:'1', size:'large', arrow:true, delay: [500, 0]}">
                      <quill-editor
                        v-model="sumarioCarregado.sumario.finalidade"
                        ref="refQuillEditor"
                        :disabled="ehVisualizacao || !_.isNull(participanteEditando) || !_.isNull(investimentoEditando)"
                        :options="quillOptionsCompleto"
                        v-validate="'required'"
                        name="finalidade">
                      </quill-editor>
                      <span v-if="errors.first('finalidade')" class="label label-danger"> A Finalidade da ação é obrigatória</span>
                    </div>
                  </div>
                </div>


                <div class="form-group">
                  <div class="required-field" :class="{ 'has-error' : errors.first('sinopse')}">
                    <label class="control-label col-md-2">Sinopse</label>
                    <div class="col-md-10" :title="'<h5>Sinopse da ação</h5>'" v-tippy="{inertia:true, arrow:true, animation:'perspective', distance:'1', size:'large', arrow:true, delay: [500, 0]}">
                      <quill-editor
                        v-model="sumarioCarregado.sumario.sinopse"
                        ref="refQuillEditor"
                        :disabled="ehVisualizacao || !_.isNull(participanteEditando) || !_.isNull(investimentoEditando)"
                        :options="quillOptionsCompleto"
                        v-validate="'required'"
                        name="sinopse">
                      </quill-editor>
                      <span v-if="errors.first('sinopse')" class="label label-danger"> A Sinopse da ação é obrigatória</span>
                    </div>
                  </div>
                </div>


                <div class="form-group">
                  <div class="required-field" :class="{ 'has-error' : errors.first('participantes')}">
                    <label class="control-label col-md-2">Participantes / Interlocutores</label>
                    <div class="col-md-10" v-if="_.isNull(participanteEditando)">

                      <table class="table table-condensed table-bordered table-striped">
                        <thead>
                          <tr>
                            <th class="w20">Participante</th>
                            <th>Interlocutores</th>
                            <th style="text-align: center">Mostrar / Ocultar</th>
                            <th style="text-align: center" v-if="_.isNull(investimentoEditando)">
                              <g-button-ujarak color="primary" size="button--size-ss" @click.native="novoParticipante()" v-if="!ehVisualizacao"><i class="fa fa-plus-circle" aria-hidden="true"></i> Incluir</g-button-ujarak >
                              <div class="espacamento_botoes"></div>
                              <g-button-ujarak color="warning" size="button--size-ss" @click.native="sumarioCarregado.sumario.participantes = []" v-if="!ehVisualizacao && (_.get(sumarioCarregado, 'sumario.participantes', [])).length > 0"><i class="fa fa-trash" aria-hidden="true"></i> Excluir Todos</g-button-ujarak >
                            </th>
                          </tr>
                        </thead>

                        <draggable
                          group="lista_participantes"
                          :disabled="ehVisualizacao"
                          v-model="sumarioCarregado.sumario.participantes"
                          v-bind="{animation: 200, group: 'lista_participantes', disabled: false, ghostClass: 'ghost'}"
                          tag="tbody">

                          <tr v-for="(participante, idx) in _.get(sumarioCarregado, 'sumario.participantes', [])" class="handle_conteudo" style="cursor: grab">
                            <td>{{participante.participante}}</td>
                            <td>
                              <span v-if="_.get(participante, 'interlocutores', []).length > 0" :title="'<h5>' + _.join(_.map(participante.interlocutores, function (i) { return i.nome + ' (' + i.cargo + ')' }), ', ') + '</h5>'" v-tippy="{inertia:true, arrow:true, animation:'perspective', distance:'1', size:'large', arrow:true}">
                                {{_.join(_.map(_.take(participante.interlocutores, 2), function (i) { return i.nome + ' (' + i.cargo + ')' }), ', ')}}
                                <span v-if="_.get(participante, 'interlocutores', []).length > 2"> ... mais {{participante.interlocutores.length - 2}}</span>
                              </span>
                              <span v-else class="label label-danger">Sem interlocutores</span>
                            </td>

                            <td class="text-left indicadores-cb-inline w10 text-center" :title="'<h5>Mostra ou Oculta na impressão</h5>'" v-tippy="{inertia:true, arrow:true, animation:'perspective', distance:'1', size:'large', arrow:true, delay: [500, 0]}">
                              <i v-if="!ehVisualizacao" @click="mostrarOcultar(participante, 'mostrarParticipante')" :class="(_.get(participante, 'mostrarParticipante', true) ? 'fa fa-2x fa-eye' : 'fa fa-2x fa-eye-slash') + ' mostrar_ocultar_impressao'"></i>
                              <i v-else :class="(_.get(participante, 'mostrarParticipante', true) ? 'fa fa-2x fa-eye' : 'fa fa-2x fa-eye-slash')" style="color: var(--cor-fraca)"></i>
                            </td>

                            <td class="text-right w30 text-center" v-if="!ehVisualizacao && _.isNull(investimentoEditando)">
                              <g-button-ujarak color="primary" size="button--size-ss" @click.native="editaParticipante(idx)"><i class="fa fa-pencil-square-o" aria-hidden="true"></i> Editar</g-button-ujarak>
                              <g-button-ujarak color="primary" size="button--size-ss" @click.native="duplicaParticipante(idx)"><i class="fa fa-plus" aria-hidden="true"></i> Duplicar</g-button-ujarak>
                              <g-button-ujarak color="error" size="button--size-ss" @click.native="removeParticipante(idx)"><i class="fa fa-trash" aria-hidden="true"></i> Excluir</g-button-ujarak>
                            </td>
                            <td class="text-right w30 text-center" v-else>
                              <g-button-ujarak color="warning" size="button--size-ss" @click.native="editaParticipante(idx)"><i class="fa fa-user" aria-hidden="true"></i> Detalhar</g-button-ujarak>
                            </td>
                          </tr>
                        </draggable>

                      </table>

                    </div>

                    <div v-else class="col-md-10">
                      <div class="well" v-bind:style="'background: ' + (!_.isNull(interlocutorEditando) ? '#fff' : '#f1f6ff')">

                        <div class="form-group required-field" :class="{ 'has-error' : errors.first('participante')}">
                          <label class="control-label col-md-2">Participante</label>
                          <div class="col-md-5">
                            <input v-model="participanteEditando.participante" type="text" name="participante" ref="participante" class="form-control" v-validate="'required'" :disabled="ehVisualizacao || !_.isNull(interlocutorEditando) || !_.isNull(investimentoEditando)"
                                   @keyup="buscaParticipantesJaCadastrados()" @blur="ocultaListaParticipantesJaCadastrados()"
                                   :title="'<h5>Organização participante da ação</h5>'" v-tippy="{inertia:true, arrow:true, animation:'perspective', distance:'1', size:'large', arrow:true, delay: [500, 0]}" />
                            <span v-if="errors.first('participante')" class="label label-danger"> Participante é obrigatório</span>

                            <div v-show="loading.pesquisa.participantes" style="position: absolute; top: 0px; left: 0px; display: block; font-size: 20px; color: var(--cor-destaque)"><i class="fa fa-refresh fa-spin"></i></div>
                            <div class="pesquisa_autocomplete" v-if="pesquisa.participantes.mostrar && pesquisa.participantes.lista.length > 0">
                              <ul>
                                <li v-for="item in pesquisa.participantes.lista" @click="selecionaParticipanteJaCadastrado(item)" class="truncar">{{item.nomfor}}</li>
                              </ul>
                            </div>
                          </div>


                          <label class="control-label col-md-2">Logomarca</label>
                          <div class="col-md-3">
                            <span v-if="!_.has(participanteEditando, 'logomarca.ds_nome_arquivo')">
                              <input type="file" name="logomarca" id="logomarca" ref="logomarca" @change="handleFileUpload" v-validate="{required: true, size: tamanhoPermitido, mimes: tiposPermitidos}" :disabled="ehVisualizacao || !_.isNull(interlocutorEditando) || !_.isNull(investimentoEditando)"/>
                            </span>
                            <span v-else-if="ehVisualizacao || !_.isNull(interlocutorEditando) || !_.isNull(investimentoEditando)" style="color: var(--cor-destaque);">
                              <img :src="participanteEditando.logomarca.file" style="max-height: 16px;max-width: 30px"/>
                              {{participanteEditando.logomarca.ds_nome_arquivo}}
                            </span>
                            <span v-else style="color: var(--cor-destaque); cursor: pointer" @click="participanteEditando.logomarca = {}"
                                  :title="'<h5>Clique para alterar a logomarca</h5>'" v-tippy="{inertia:true, arrow:true, animation:'perspective', distance:'1', size:'large', arrow:true, delay: [500, 0]}">
                              <img :src="participanteEditando.logomarca.file" style="max-height: 16px;max-width: 30px"/>
                              {{participanteEditando.logomarca.ds_nome_arquivo}} <i class="fa fa-pencil"></i>
                            </span>
                          </div>
                        </div>

                        <div class="form-group">
                          <label class="control-label col-md-2">Sobre
                            <i v-if="!ehVisualizacao" @click="mostrarOcultar(participanteEditando, 'mostrarSobre')" :class="(_.get(participanteEditando, 'mostrarSobre', true) ? 'fa fa-2x fa-eye' : 'fa fa-2x fa-eye-slash') + ' mostrar_ocultar_impressao'"></i>
                            <i v-else :class="(_.get(participanteEditando, 'mostrarSobre', true) ? 'fa fa-2x fa-eye' : 'fa fa-2x fa-eye-slash')" style="color: var(--cor-fraca)"></i>
                          </label>
                          <div class="col-md-10">
                            <quill-editor
                              v-model="participanteEditando.sobre"
                              ref="refQuillEditor"
                              :disabled="ehVisualizacao || !_.isNull(interlocutorEditando) || !_.isNull(investimentoEditando)"
                              :options="quillOptionsCompleto"
                              name="sobre">
                            </quill-editor>
                          </div>
                        </div>

                        <div class="form-group">
                          <label class="control-label col-md-2">Grupo/empresa(s)
                            <i v-if="!ehVisualizacao" @click="mostrarOcultar(participanteEditando, 'mostrarGrupoEmpresa')" :class="(_.get(participanteEditando, 'mostrarGrupoEmpresa', true) ? 'fa fa-2x fa-eye' : 'fa fa-2x fa-eye-slash') + ' mostrar_ocultar_impressao'"></i>
                            <i v-else :class="(_.get(participanteEditando, 'mostrarGrupoEmpresa', true) ? 'fa fa-2x fa-eye' : 'fa fa-2x fa-eye-slash')" style="color: var(--cor-fraca)"></i>
                          </label>
                          <div class="col-md-10">
                            <input v-model="participanteEditando.grupo" type="text" name="grupo" ref="grupo" class="form-control" :disabled="ehVisualizacao || !_.isNull(interlocutorEditando) || !_.isNull(investimentoEditando)"
                                   :title="'<h5>Grupo de empresas que faz parte se houver</h5>'" v-tippy="{inertia:true, arrow:true, animation:'perspective', distance:'1', size:'large', arrow:true, delay: [500, 0]}" />
                          </div>
                        </div>

                        <div class="form-group">
                          <label class="control-label col-md-2">Segmento de atuação
                            <i v-if="!ehVisualizacao" @click="mostrarOcultar(participanteEditando, 'mostrarSegmentoAtuacao')" :class="(_.get(participanteEditando, 'mostrarSegmentoAtuacao', true) ? 'fa fa-2x fa-eye' : 'fa fa-2x fa-eye-slash') + ' mostrar_ocultar_impressao'"></i>
                            <i v-else :class="(_.get(participanteEditando, 'mostrarSegmentoAtuacao', true) ? 'fa fa-2x fa-eye' : 'fa fa-2x fa-eye-slash')" style="color: var(--cor-fraca)"></i>
                          </label>
                          <div class="col-md-10">
                            <input v-model="participanteEditando.atuacao" type="text" name="atuacao" ref="atuacao" class="form-control" :disabled="ehVisualizacao || !_.isNull(interlocutorEditando) || !_.isNull(investimentoEditando)"
                                   :title="'<h5>Informar qual o segmento de atuação da organização se houver</h5>'" v-tippy="{inertia:true, arrow:true, animation:'perspective', distance:'1', size:'large', arrow:true, delay: [500, 0]}" />
                          </div>
                        </div>

                        <div class="form-group">
                          <label class="control-label col-md-2">Histórico
                            <i v-if="!ehVisualizacao" @click="mostrarOcultar(participanteEditando, 'mostrarHistorico')" :class="(_.get(participanteEditando, 'mostrarHistorico', true) ? 'fa fa-2x fa-eye' : 'fa fa-2x fa-eye-slash') + ' mostrar_ocultar_impressao'"></i>
                            <i v-else :class="(_.get(participanteEditando, 'mostrarHistorico', true) ? 'fa fa-2x fa-eye' : 'fa fa-2x fa-eye-slash')" style="color: var(--cor-fraca)"></i>
                          </label>
                          <div class="col-md-10">
                            <quill-editor
                              v-model="participanteEditando.historico"
                              ref="refQuillEditor"
                              :disabled="ehVisualizacao || !_.isNull(interlocutorEditando) || !_.isNull(investimentoEditando)"
                              :options="quillOptionsCompleto"
                              name="historico">
                            </quill-editor>
                          </div>
                        </div>


                        <div class="form-group">
                          <label class="control-label col-md-2">Interlocutores
                            <i v-if="!ehVisualizacao" @click="mostrarOcultar(participanteEditando, 'mostrarInterlocutores')" :class="(_.get(participanteEditando, 'mostrarInterlocutores', true) ? 'fa fa-2x fa-eye' : 'fa fa-2x fa-eye-slash') + ' mostrar_ocultar_impressao'"></i>
                            <i v-else :class="(_.get(participanteEditando, 'mostrarInterlocutores', true) ? 'fa fa-2x fa-eye' : 'fa fa-2x fa-eye-slash')" style="color: var(--cor-fraca)"></i>
                          </label>
                          <div class="col-md-10" v-if="_.isNull(interlocutorEditando)">
                            <table class="table table-condensed table-bordered" style="background: white">
                              <thead>
                              <tr>
                                <th>Nome</th>
                                <th>Cargo</th>
                                <th style="text-align: center" v-if="_.isNull(investimentoEditando)">
                                  <g-button-ujarak color="primary" size="button--size-ss" @click.native="novoInterlocutor()" v-if="!ehVisualizacao"><i class="fa fa-plus-o" aria-hidden="true"></i> Incluir</g-button-ujarak >
                                  <div class="espacamento_botoes"></div>
                                  <g-button-ujarak color="warning" size="button--size-ss" @click.native="participanteEditando.interlocutores = []" v-if="!ehVisualizacao && (_.get(participanteEditando, 'interlocutores', [])).length > 0"><i class="fa fa-trash" aria-hidden="true"></i> Excluir Todos</g-button-ujarak >
                                </th>
                              </tr>
                              </thead>

                              <draggable
                                group="lista_interlocutores"
                                :disabled="ehVisualizacao"
                                v-model="participanteEditando.interlocutores"
                                v-bind="{animation: 200, group: 'lista_interlocutores', disabled: false, ghostClass: 'ghost'}"
                                tag="tbody">

                                <tr v-for="(interlocutor, idx2) in _.get(participanteEditando, 'interlocutores', [])" class="handle_conteudo" style="cursor: grab">
                                  <td>{{interlocutor.nome}}</td>
                                  <td>{{interlocutor.cargo}}</td>
                                  <td class="text-right w30" style="text-align: center" v-if="!ehVisualizacao && _.isNull(investimentoEditando)">
                                    <g-button-ujarak color="primary" size="button--size-ss" @click.native="editaInterlocutor(participanteEditando, idx2)"><i class="fa fa-pencil-square-o" aria-hidden="true"></i> Editar</g-button-ujarak>
                                    <g-button-ujarak color="primary" size="button--size-ss" @click.native="duplicaInterlocutor(participanteEditando, idx2)"><i class="fa fa-plus" aria-hidden="true"></i> Duplicar</g-button-ujarak>
                                    <g-button-ujarak color="error" size="button--size-ss" @click.native="removeInterlocutor(participanteEditando, idx2)"><i class="fa fa-trash" aria-hidden="true"></i> Excluir</g-button-ujarak>
                                  </td>
                                  <td class="text-right w30" style="text-align: center" v-else>
                                    <g-button-ujarak color="warning" size="button--size-ss" @click.native="editaInterlocutor(participanteEditando, idx2)"><i class="fa fa-user" aria-hidden="true"></i> Detalhar</g-button-ujarak>
                                  </td>
                                </tr>
                              </draggable>

                            </table>
                          </div>


                          <div v-else class="col-md-10">
                            <div class="well" v-bind:style="'background: ' + (!_.isNull(interlocutorEditando) ? '#f1f6ff' : '#fff')">
                              <div class="form-group required-field" :class="{ 'has-error' : errors.first('nome')}">
                                <label class="control-label col-md-2">Nome</label>
                                <div class="col-md-10">
                                  <input v-model="interlocutorEditando.nome" type="text" name="nome" ref="nome" class="form-control" v-validate="'required'" :disabled="ehVisualizacao || !_.isNull(investimentoEditando)"
                                         :title="'<h5>Nome da pessoa que estará na ação representando o participante</h5>'" v-tippy="{inertia:true, arrow:true, animation:'perspective', distance:'1', size:'large', arrow:true, delay: [500, 0]}" />
                                  <span v-if="errors.first('nome')" class="label label-danger"> Nome do interlocutor é obrigatório</span>
                                </div>
                              </div>

                              <div class="form-group required-field" :class="{ 'has-error' : errors.first('cargo')}">
                                <label class="control-label col-md-2">Cargo</label>
                                <div class="col-md-10">
                                  <input v-model="interlocutorEditando.cargo" type="text" name="cargo" ref="cargo" class="form-control" v-validate="'required'" :disabled="ehVisualizacao || !_.isNull(investimentoEditando)"
                                         :title="'<h5>Cargo do interlocutor na organização participante</h5>'" v-tippy="{inertia:true, arrow:true, animation:'perspective', distance:'1', size:'large', arrow:true, delay: [500, 0]}" />
                                  <span v-if="errors.first('cargo')" class="label label-danger"> Cargo do interlocutor é obrigatório</span>
                                </div>
                              </div>

                              <div class="form-group">
                                <label class="control-label col-md-2">Linkedin <i class="fa fa-linkedin-square"></i></label>
                                <div class="col-md-10">
                                  <input v-model="interlocutorEditando.linkedin" type="url" name="linkedin" ref="linkedin" class="form-control" :disabled="ehVisualizacao || !_.isNull(investimentoEditando)" placeholder="https://www.linkedin.com/in/..."
                                         :title="'<h5>Url para o currículo digital no Linkedin, se houver</h5>'" v-tippy="{inertia:true, arrow:true, animation:'perspective', distance:'1', size:'large', arrow:true, delay: [500, 0]}" />
                                </div>
                              </div>

                              <div class="form-group">
                                <div class="col-md-10 col-md-offset-2">
                                  <g-button-ujarak color="success" size="button--size-ss" @click.native="okEdicaoInterlocutor(participanteEditando)"  v-if="!ehVisualizacao && _.isNull(investimentoEditando)"><i class="fa fa-check" aria-hidden="true"></i> Ok</g-button-ujarak>
                                  <g-button-ujarak color="warning" size="button--size-ss" @click.native="cancelaEdicaoInterlocutor(participanteEditando)"><i class="fa fa-times-circle" aria-hidden="true"></i> {{ehVisualizacao || !_.isNull(investimentoEditando) ? 'Fechar' : 'Cancelar'}}</g-button-ujarak>
                                </div>
                              </div>

                            </div>
                          </div>

                        </div>


                        <div class="form-group">
                          <div class="col-md-10 col-md-offset-2" v-if="_.isNull(interlocutorEditando)">
                            <g-button-ujarak color="success" size="button--size-ss" @click.native="okEdicaoParticipante()" v-if="!ehVisualizacao && _.isNull(investimentoEditando)"><i class="fa fa-check" aria-hidden="true"></i> Ok</g-button-ujarak>
                            <g-button-ujarak color="warning" size="button--size-ss" @click.native="cancelaEdicaoParticipante()"><i class="fa fa-times-circle" aria-hidden="true"></i> {{ehVisualizacao || !_.isNull(investimentoEditando) ? 'Fechar' : 'Cancelar'}}</g-button-ujarak>
                          </div>
                        </div>

                      </div>
                    </div>


                  </div>
                </div>


                <div class="form-group">
                  <div class="required-field" :class="{ 'has-error' : errors.first('investimentos')}">
                    <label class="control-label col-md-2">Investimento socioambiental</label>
                    <div class="col-md-10" v-if="_.isNull(investimentoEditando)">

                      <table class="table table-condensed table-bordered table-striped">
                        <thead>
                        <tr>
                          <th class="w20">Origem</th>
                          <th>Investimento</th>
                          <th style="text-align: center">Mostrar / Ocultar</th>
                          <th style="text-align: center" v-if="_.isNull(participanteEditando)">
                            <g-button-ujarak color="primary" size="button--size-ss" @click.native="novoInvestimento()" v-if="!ehVisualizacao"><i class="fa fa-plus-circle" aria-hidden="true"></i> Incluir</g-button-ujarak >
                            <div class="espacamento_botoes"></div>
                            <g-button-ujarak color="warning" size="button--size-ss" @click.native="sumarioCarregado.sumario.investimentos = []" v-if="!ehVisualizacao && (_.get(sumarioCarregado, 'sumario.investimentos', [])).length > 0"><i class="fa fa-trash" aria-hidden="true"></i> Excluir Todos</g-button-ujarak >
                          </th>
                        </tr>
                        </thead>

                        <draggable
                          group="lista_investimentos"
                          :disabled="ehVisualizacao"
                          v-model="sumarioCarregado.sumario.investimentos"
                          v-bind="{animation: 200, group: 'lista_investimentos', disabled: false, ghostClass: 'ghost'}"
                          tag="tbody">

                          <tr v-for="(investimento, idx) in _.get(sumarioCarregado, 'sumario.investimentos', [])" class="handle_conteudo" style="cursor: grab">
                            <td>{{investimento.origem}}</td>
                            <td>
                              <span>Próprios: {{investimento.valorFBB | real}}</span> | <span>Contrapartida: {{investimento.valorContrapartida | real}}</span>
                              <span v-if="investimento.valorParceiros > 0"> | Terceiros: {{investimento.valorParceiros | real}}</span>
                            </td>

                            <td class="text-left indicadores-cb-inline w10 text-center" :title="'<h5>Mostra ou Oculta na impressão</h5>'" v-tippy="{inertia:true, arrow:true, animation:'perspective', distance:'1', size:'large', arrow:true, delay: [500, 0]}">
                              <i v-if="!ehVisualizacao" @click="mostrarOcultar(investimento, 'mostrarInvestimento')" :class="(_.get(investimento, 'mostrarInvestimento', true) ? 'fa fa-2x fa-eye' : 'fa fa-2x fa-eye-slash') + ' mostrar_ocultar_impressao'"></i>
                              <i v-else :class="(_.get(investimento, 'mostrarInvestimento', true) ? 'fa fa-2x fa-eye' : 'fa fa-2x fa-eye-slash')" style="color: var(--cor-fraca)"></i>
                            </td>

                            <td class="text-right w30 text-center" v-if="!ehVisualizacao && _.isNull(participanteEditando)">
                              <g-button-ujarak color="primary" size="button--size-ss" @click.native="editaInvestimento(idx)"><i class="fa fa-pencil-square-o" aria-hidden="true"></i> Editar</g-button-ujarak>
                              <g-button-ujarak color="primary" size="button--size-ss" @click.native="duplicaInvestimento(idx)"><i class="fa fa-plus" aria-hidden="true"></i> Duplicar</g-button-ujarak>
                              <g-button-ujarak color="error" size="button--size-ss" @click.native="removeInvestimento(idx)"><i class="fa fa-trash" aria-hidden="true"></i> Excluir</g-button-ujarak>
                            </td>
                            <td class="text-right w30 text-center" v-else>
                              <g-button-ujarak color="warning" size="button--size-ss" @click.native="editaInvestimento(idx)"><i class="fa fa-user" aria-hidden="true"></i> Detalhar</g-button-ujarak>
                            </td>
                          </tr>
                        </draggable>
                      </table>
                    </div>


                    <div v-else class="col-md-10">
                      <div class="well" style="background: #f1f6ff">

                        <div class="form-group required-field" :class="{ 'has-error' : errors.first('origem')}">
                          <label class="control-label col-md-2">Origem</label>
                          <div class="col-md-10">
                            <input v-model="investimentoEditando.origem" type="text" name="origem" ref="origem" class="form-control" v-validate="'required'" :disabled="ehVisualizacao"
                                   @keyup="buscaProjetosAprovados()" @blur="ocultaListaProjetosAprovados()"
                                   :title="'<h5>Origem do investimento em geral é um título de projeto ou de uma articulação</h5>'" v-tippy="{inertia:true, arrow:true, animation:'perspective', distance:'1', size:'large', arrow:true, delay: [500, 0]}" />

                            <div v-show="loading.pesquisa.projetos" style="position: absolute; top: 0px; left: 0px; display: block; font-size: 20px; color: var(--cor-destaque)"><i class="fa fa-refresh fa-spin"></i></div>
                            <div class="pesquisa_autocomplete" v-if="pesquisa.projetos.mostrar && pesquisa.projetos.lista.length > 0">
                              <ul>
                                <li v-for="item in pesquisa.projetos.lista" @click="selecionaProjetosAprovados(item)" class="truncar">{{item.nomprj}}</li>
                              </ul>
                            </div>

                            <span v-if="errors.first('origem')" class="label label-danger"> Pbjeto é obrigatório</span>
                          </div>
                        </div>

                        <div class="form-group">
                          <label class="control-label col-md-2">Próprios (Fundação BB)
                            <i v-if="!ehVisualizacao" @click="mostrarOcultar(investimentoEditando, 'mostrarValorFBB')" :class="(_.get(investimentoEditando, 'mostrarValorFBB', true) ? 'fa fa-2x fa-eye' : 'fa fa-2x fa-eye-slash') + ' mostrar_ocultar_impressao'"></i>
                            <i v-else :class="(_.get(investimentoEditando, 'mostrarValorFBB', true) ? 'fa fa-2x fa-eye' : 'fa fa-2x fa-eye-slash')" style="color: var(--cor-fraca)"></i>
                          </label>
                          <div class="col-md-2">
                            <money v-model="investimentoEditando.valorFBB" class="form-control" name="valorFBB" :disabled="ehVisualizacao"></money>
                          </div>
                        </div>

                        <div class="form-group">
                          <label class="control-label col-md-2">Contrapartida
                            <i v-if="!ehVisualizacao" @click="mostrarOcultar(investimentoEditando, 'mostrarValorContrapartida')" :class="(_.get(investimentoEditando, 'mostrarValorContrapartida', true) ? 'fa fa-2x fa-eye' : 'fa fa-2x fa-eye-slash') + ' mostrar_ocultar_impressao'"></i>
                            <i v-else :class="(_.get(investimentoEditando, 'mostrarValorContrapartida', true) ? 'fa fa-2x fa-eye' : 'fa fa-2x fa-eye-slash')" style="color: var(--cor-fraca)"></i>
                          </label>
                          <div class="col-md-2">
                            <money v-model="investimentoEditando.valorContrapartida" class="form-control" name="valorContrapartida" :disabled="ehVisualizacao"></money>
                          </div>
                        </div>

                        <div class="form-group">
                          <label class="control-label col-md-2">Parceiros Estratégicos
                            <i v-if="!ehVisualizacao" @click="mostrarOcultar(investimentoEditando, 'mostrarValorParceiros')" :class="(_.get(investimentoEditando, 'mostrarValorParceiros', true) ? 'fa fa-2x fa-eye' : 'fa fa-2x fa-eye-slash') + ' mostrar_ocultar_impressao'"></i>
                            <i v-else :class="(_.get(investimentoEditando, 'mostrarValorParceiros', true) ? 'fa fa-2x fa-eye' : 'fa fa-2x fa-eye-slash')" style="color: var(--cor-fraca)"></i>
                          </label>
                          <div class="col-md-2">
                            <money v-model="investimentoEditando.valorParceiros" class="form-control" name="valorParceiros" :disabled="ehVisualizacao"></money>
                          </div>
                        </div>

                        <div class="form-group">
                          <label class="control-label col-md-2">Observação</label>
                          <div class="col-md-10" :title="'<h5>Caso haja alguma observação pertinente ao investimento</h5>'" v-tippy="{inertia:true, arrow:true, animation:'perspective', distance:'1', size:'large', arrow:true, delay: [500, 0]}">
                            <quill-editor
                              v-model="investimentoEditando.observacao"
                              ref="refQuillEditor"
                              :disabled="ehVisualizacao || !_.isNull(participanteEditando)"
                              :options="quillOptionsCompleto"
                              name="observacao">
                            </quill-editor>
                          </div>
                        </div>

                        <div class="form-group">
                          <div class="col-md-10 col-md-offset-2">
                            <g-button-ujarak color="success" size="button--size-ss" @click.native="okEdicaoInvestimento()" v-if="!ehVisualizacao && _.isNull(participanteEditando)"><i class="fa fa-check" aria-hidden="true"></i> Ok</g-button-ujarak>
                            <g-button-ujarak color="warning" size="button--size-ss" @click.native="cancelaEdicaoInvestimento()"><i class="fa fa-times-circle" aria-hidden="true"></i> {{ehVisualizacao || !_.isNull(participanteEditando) ? 'Fechar' : 'Cancelar'}}</g-button-ujarak>
                          </div>
                        </div>

                      </div>
                    </div>

                  </div>
                </div>


                <div class="form-group">
                  <div class="">
                    <label class="control-label col-md-2">Produto</label>
                    <div class="col-md-10" :title="'<h5>Se houver um produto resultado da ação, então gere descritivo sobre ele</h5>'" v-tippy="{inertia:true, arrow:true, animation:'perspective', distance:'1', size:'large', arrow:true, delay: [500, 0]}">
                      <quill-editor
                        v-model="sumarioCarregado.sumario.produto"
                        ref="refQuillEditor"
                        :disabled="ehVisualizacao || !_.isNull(participanteEditando) || !_.isNull(investimentoEditando)"
                        :options="quillOptionsCompleto"
                        name="produto">
                      </quill-editor>
                    </div>
                  </div>
                </div>


                <div v-show="loading.tela" class="overlay" style="position: absolute; top: 0px; left: 0px; width: 100%; height: 100%; display: block;"><i class="fa fa-refresh fa-spin"></i></div>

              </div>

            </div>

          </div>

        </div>

      </div>


<!-- Versão para Impressão -------------------------------------------------------------------------------------------------------------------------->
      <div class="row imprimir" id="sumario_impresso" style="font-family: 'BancoDoBrasil Textos'">

        <div class="cabecalho_sumario_executivo">
          <span>Sumário Executivo</span>
          <span v-if="!_.isNull(sumarioCarregado.id)">última atualização em {{sumarioCarregado.updated_at | ''}}</span>
          <span class="sumario_criticidade">#interna</span>
        </div>
        <br/>

        <div class="titulo_sumario_executivo" style="font-family: 'BancoDoBrasil Titulos ExtraBold'">
          {{sumarioCarregado.sumario.acao}}
        </div>

        <div class="bloco_sumario_executivo">
          <strong>Ação: {{sumarioCarregado.sumario.acao}}</strong><br/>
          <strong>Data/horário:</strong> {{moment(sumarioCarregado.sumario.data).add(1, 'day').format('DD/MM/YYYY')}} - {{sumarioCarregado.sumario.inicio | moment("HH:mm")}} as {{sumarioCarregado.sumario.termino | moment("HH:mm")}}<br/>
          <strong>Local:</strong> {{sumarioCarregado.sumario.local}}
        </div>


        <div class="bloco_sumario_executivo" v-if="sumarioCarregado.sumario.participantes.length > 0">
          <strong>Participantes/Interlocutores</strong>
          <div style="display: flex;justify-content: space-between;margin-bottom: 20px;" v-for="participante in sumarioCarregado.sumario.participantes" v-if="_.get(participante, 'mostrarParticipante', true)">
            <span>
              <span class="participante_sumario_executivo text-bold">{{participante.participante}}</span><br/>
              <span v-for="interlocutor in participante.interlocutores" v-if="_.get(participante, 'mostrarInterlocutores', true)">
                <span class="interlocutor_sumario_executivo">{{interlocutor.nome}} - {{interlocutor.cargo}}</span><br/>
              </span>
            </span>
            <span v-if="_.has(participante, 'logomarca.file')">
                <img :src="participante.logomarca.file" style="max-height: 70px"/>
            </span>
          </div>
        </div>

        <hr/>

        <div class="bloco_sumario_executivo">
          <strong>Objeto:</strong> {{sumarioCarregado.sumario.objeto}}
        </div>

        <div class="bloco_sumario_executivo">
          <strong>Finalidade:</strong> <span v-html="sumarioCarregado.sumario.finalidade"></span>
        </div>

        <div class="bloco_sumario_executivo">
          <strong>Sinopse:</strong> <span v-html="sumarioCarregado.sumario.sinopse"></span>
        </div>


        <span v-if="(_.get(sumarioCarregado, 'sumario.investimentos', [])).length > 0">
          <div class="bloco_sumario_executivo">
            <strong>Investimento socioambiental:</strong><br/>

            <span v-for="investimento in sumarioCarregado.sumario.investimentos" v-if="_.get(investimento, 'mostrarInvestimento', true)">
              <span class="investimento_sumario_executivo">{{investimento.origem}}</span><br/>
              <ul>
                <li v-if="_.get(investimento, 'mostrarValorFBB', true)">Próprios: {{investimento.valorFBB | real}}</li>
                <li v-if="_.get(investimento, 'mostrarValorContrapartida', true)">Contrapartida: {{investimento.valorContrapartida | real}}</li>
                <li v-if="_.get(investimento, 'mostrarValorParceiros', true)">Terceiros: {{investimento.valorParceiros | real}}</li>
              </ul><br/>
              <span v-if="_.get(investimento, 'observacao')" v-html="_.get(investimento, 'observacao', '')"></span>
              <br/>
            </span>

          </div>
        </span>

        <span v-if="sumarioCarregado.sumario.participantes.length > 0">
          <div v-for="participante in sumarioCarregado.sumario.participantes" v-if="_.get(participante, 'mostrarParticipante', true) && (_.get(participante, 'mostrarSobre', true) || _.get(participante, 'mostrarGrupoEmpresa', true) || _.get(participante, 'mostrarSegmentoAtuacao', true) || _.get(participante, 'mostrarHistorico', true))">
            <div class="titulo_sumario_executivo">
              Sobre {{participante.participante}}
            </div>

            <div class="bloco_sumario_executivo" v-if="_.get(participante, 'mostrarSobre', true)">
              <span v-html="participante.sobre"></span>
            </div>

            <div class="bloco_sumario_executivo">
              <table class="table table-condensed table-bordered table-striped">
                <thead><tr><th>Visão Geral</th></tr></thead>
                <tbody>
                  <tr v-if="_.get(participante, 'mostrarGrupoEmpresa', true)"><td><strong>Grupo/empresa(s):</strong> {{participante.grupo}}</td></tr>
                  <tr v-if="_.get(participante, 'mostrarSegmentoAtuacao', true)"><td><strong>Segmento de atuação:</strong> {{participante.atuacao}}</td></tr>
                  <tr v-if="_.get(participante, 'mostrarHistorico', true)"><td><strong>Histórico/Destaques mercadológicos e institucionais/Estratégia do grupo:</strong> <span v-html="participante.historico"></span></td></tr>
                </tbody>
              </table>
            </div>
          </div>
        </span>


        <div class="bloco_sumario_executivo" v-if="_.has(sumarioCarregado, 'sumario.produto') && !_.isEmpty(sumarioCarregado.sumario.produto)">
          <strong>Sobre o produto</strong> <span v-html="sumarioCarregado.sumario.produto"></span>
        </div>

      </div>

    </section>

<!-- Versão para Acesso Externo (mobile) -------------------------------------------------------------------------------------------------------------------------->
    <section class="content" id="sumario_acesso_externo" v-if="ehAcessoPorLink">
      <div class="row">

        <div class="cabecalho_sumario_executivo">
          <span class="text-bold">Sumário Executivo</span><br/>
          <span v-if="!_.isNull(sumarioCarregado.id)">atualizado em {{sumarioCarregado.updated_at | moment("DD/MM/YYYY HH:mm:ss")}}</span>
          <span class="sumario_criticidade">#interna</span>
        </div>
        <br/>

        <div class="titulo_sumario_executivo">{{sumarioCarregado.sumario.acao}}</div>

        <div class="bloco_sumario_executivo">
          <strong>Ação: {{sumarioCarregado.sumario.acao}}</strong><br/>
          <strong>Data/horário:</strong> {{sumarioCarregado.sumario.data | moment("L")}} - {{sumarioCarregado.sumario.inicio | moment("HH:mm")}} as {{sumarioCarregado.sumario.termino | moment("HH:mm")}}<br/>
          <strong>Local:</strong> {{sumarioCarregado.sumario.local}}
        </div>

        <div class="bloco_sumario_executivo" v-if="sumarioCarregado.sumario.participantes.length > 0">
          <strong>Participantes/Interlocutores</strong>
          <div style="display: flex;justify-content: space-between;margin-bottom: 20px;" v-for="participante in sumarioCarregado.sumario.participantes" v-if="_.get(participante, 'mostrarParticipante', true)">
            <span>
              <span class="participante_sumario_executivo text-bold">{{participante.participante}}</span><br/>
              <span v-for="interlocutor in participante.interlocutores" v-if="_.get(participante, 'mostrarInterlocutores', true)">
                <span class="interlocutor_sumario_executivo" v-if="_.has(interlocutor, 'linkedin') && !_.isEmpty(interlocutor.linkedin)">
                  <a :href="interlocutor.linkedin"> {{interlocutor.nome}} <span style="font-style: italic">({{interlocutor.cargo}}) <i class="fa fa-linkedin-square"></i></span></a>
                </span>
                <span class="interlocutor_sumario_executivo" v-else>{{interlocutor.nome}}  <span style="font-style: italic">({{interlocutor.cargo}})</span></span>
                <br/><br/>
              </span>
            </span>
            <span v-if="_.has(participante, 'logomarca.file')">
                <img :src="participante.logomarca.file" style="max-height: 70px"/>
            </span>
          </div>
        </div>

        <div class="titulo_sumario_executivo">&nbsp;</div>

        <div class="bloco_sumario_executivo"><strong>Objeto:</strong> {{sumarioCarregado.sumario.objeto}}</div>

        <div class="bloco_sumario_executivo"><strong>Finalidade:</strong> <span v-html="sumarioCarregado.sumario.finalidade"></span></div>

        <div class="bloco_sumario_executivo"><strong>Sinopse:</strong> <span v-html="sumarioCarregado.sumario.sinopse"></span></div>


        <span v-if="(_.get(sumarioCarregado, 'sumario.investimentos', [])).length > 0">
          <div class="bloco_sumario_executivo">
            <strong>Investimento socioambiental:</strong><br/>

            <span v-for="investimento in sumarioCarregado.sumario.investimentos" v-if="_.get(investimento, 'mostrarInvestimento', true)">
              <span class="investimento_sumario_executivo text-bold">{{investimento.origem}}</span><br/>
              <ul>
                <li v-if="_.get(investimento, 'mostrarValorFBB', true)">Próprios: {{investimento.valorFBB | real}}</li>
                <li v-if="_.get(investimento, 'mostrarValorContrapartida', true)">Contrapartida: {{investimento.valorContrapartida | real}}</li>
                <li v-if="_.get(investimento, 'mostrarValorParceiros', true)">Terceiros: {{investimento.valorParceiros | real}}</li>
              </ul><br/>
              <span v-if="_.get(investimento, 'observacao')" v-html="_.get(investimento, 'observacao', '')"></span>
              <br/>
            </span>

          </div>
        </span>


        <span v-if="sumarioCarregado.sumario.participantes.length > 0">
          <div v-for="participante in sumarioCarregado.sumario.participantes" v-if="_.get(participante, 'mostrarParticipante', true) && (_.get(participante, 'mostrarSobre', true) || _.get(participante, 'mostrarGrupoEmpresa', true) || _.get(participante, 'mostrarSegmentoAtuacao', true) || _.get(participante, 'mostrarHistorico', true))">
            <div class="titulo_sumario_executivo">Sobre {{participante.participante}}</div>

            <div class="bloco_sumario_executivo" v-if="_.get(participante, 'mostrarSobre', true)">
              <span v-html="participante.sobre"></span>
            </div>

            <div class="bloco_sumario_executivo">
              <table class="table table-condensed">
                <thead><tr><th>Visão Geral</th></tr></thead>
                <tbody>
                  <tr v-if="_.get(participante, 'mostrarGrupoEmpresa', true)"><td><strong>Grupo/empresa(s):</strong> {{participante.grupo}}</td></tr>
                  <tr v-if="_.get(participante, 'mostrarSegmentoAtuacao', true)"><td><strong>Segmento de atuação:</strong> {{participante.atuacao}}</td></tr>
                  <tr v-if="_.get(participante, 'mostrarHistorico', true)"><td><strong>Histórico/Destaques mercadológicos e institucionais/Estratégia do grupo:</strong> <span v-html="participante.historico"></span></td></tr>
                </tbody>
              </table>
            </div>
          </div>
        </span>

        <div class="bloco_sumario_executivo" v-if="_.has(sumarioCarregado, 'sumario.produto') && !_.isEmpty(sumarioCarregado.sumario.produto)">
          <strong>Sobre o produto</strong> <span v-html="sumarioCarregado.sumario.produto"></span>
        </div>


        <div style="font-size: 10px; font-style: italic; border-top: 1px solid silver">Término do Sumário Executivo</div>

      </div>
    </section>

  </div>

</template>


<script>
  /* eslint-disable no-unused-vars */
  import { mapGetters } from 'vuex'
  import moment from 'moment'

  export default {
    name: 'EditaSumarioExecutivo',
    data () {
      return {
        moment: moment,
        quillOptionsTitulo: {
          modules: {
            toolbar: [
              ['italic', 'underline', 'strike'],
              [{'list': 'ordered'}, {'list': 'bullet'}],
              [{'script': 'sub'}, {'script': 'super'}],
              [{'color': []}, {'background': []}],
              ['video', 'image'],
              ['clean']
            ]
          },
          placeholder: 'Informe o tílulo',
          theme: 'bubble',
          readonly: false
        },
        quillOptionsCompleto: {
          theme: 'bubble'
        },
        //
        loading: {
          tela: false,
          pesquisa: {
            participantes: false,
            projetos: false
          }
        },
        mostrarTitulo: true,
        salvaSumario: {
          salvamentoAutomaticoAtivo: false,
          statusSalvamento: 'AGUARDANDO', // 'AGUARDANDO', 'PROCESSANDO', 'FEITO', 'ERRO'
          idTimerSalvamentoAutomatico: null,
          tempoSalvamentoAutomatico: 60000, // A cada 1 min
          contador: 0
        },
        pesquisa: {
          participantes: {
            lista: [],
            mostrar: false
          },
          projetos: {
            lista: [],
            mostrar: false
          }
        },
        ehVisualizacao: false,
        ehAcessoPorLink: false,
        participantesJaCadastrados: [],
        sumarioCarregado: {
          id: null,
          tipo: '',
          link_acesso: '',
          sumario: {
            participantes: [],
            investimentos: []
          },
          fk_criacao: null,
          fk_processo: null,
          situacao: 'ATIVO'
        },
        horarios: ['00:00', '00:30', '01:00', '01:30', '02:00', '02:30', '03:00', '03:30', '04:00', '04:30', '05:00', '05:30', '06:00', '06:30', '07:00', '07:30', '08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30', '18:00', '18:30', '19:00', '19:30', '20:00', '20:30', '21:00', '21:30', '22:00', '22:30', '23:00', '23:30'],
        sumarioCarregadoTemp: {}, // Se trata de uma cópia temporária do sumário para comparação se houve alteração ou não para efeito de salvamento automático
        editandoSumario: [],
        participanteEditando: null,
        idParticipanteEditando: 1,
        interlocutorEditando: null,
        idInterlocutorEditando: 1,
        investimentoEditando: null,
        idInvestimentoEditando: 1,
        editandoColunaSubSumario: {},
        editandoElemento: null,
        dragging: false,
        alturaContentWrapper: window.innerHeight - 151
      }
    },
    watch: {
      editandoSumario () {
        // Executado ao adicionar ou excluir elementos nos sumário
        // this.numeracaoAutomatica()
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
    created: function () {
      this.ehAcessoPorLink = this.$route.path.indexOf('/se/') >= 0
      this.sumarioCarregado.id = this.$route.params.id
      this.ehVisualizacao = this.$route.params.visualizacao || false
      if (!_.isNull(this.sumarioCarregado.id)) {
        this.carregaSumario()
      }
      if (!this.ehVisualizacao) {
        this.salvamentoAutomatico()
      }
      let vm = this
      window.addEventListener('resize', function () {
        vm.mostrarTitulo = vm.mostrarTitulo && (window.innerHeight - 180) > 400
        vm.alturaContentWrapper = window.innerHeight - 151
      })
    },
    beforeDestroy () {
      clearInterval(this.salvaSumario.idTimerSalvamentoAutomatico) // "Desligar" o salvamento automático
    },
    methods: {
      carregaSumario () {
        this.loading.tela = true
        axiosLaravel.get('sumario_executivo/edita/' + this.sumarioCarregado.id).then((response) => {
          if (_.has(response.data, 'codigo') && response.data.codigo === 'OK') {
            this.sumarioCarregado = response.data.retorno
            this.editandoSumario = _.isNull(this.sumarioCarregado.sumario) ? [] : _.cloneDeep(this.sumarioCarregado.sumario)
            this.salvaSumario.salvamentoAutomaticoAtivo = true
            this.salvaSumario.contador = 1
            this.sumarioCarregadoTemp = _.cloneDeep(this.sumarioCarregado) // Este temp vai ficar atualizado a cada salvamento para comparar se houve ou não alteração entre um salvamento e outro
          } else {
            this.aviso(response.data)
            this.$router.go(-1)
          }
          this.loading.tela = false
          this.$forceUpdate()
        })
          .catch((error) => {
            this.$root.trataErro(error)
            this.loading.tela = false
          })
      },
      salvamentoAutomatico () {
        this.salvaSumario.idTimerSalvamentoAutomatico = setInterval(() => {
          // Somente salva automático se a funcionalidade estiver ativa, se já foi salvo alguma vez e se houve alteração entre o salvamento atual e o anterior
          if (this.salvaSumario.salvamentoAutomaticoAtivo && this.salvaSumario.contador > 0 && !_.isEqual(this.sumarioCarregadoTemp, this.sumarioCarregado)) {
            this.salvarEdicao()
          }
        }, this.salvaSumario.tempoSalvamentoAutomatico)
      },
      salvarEdicao (redirecionarChave = null) {
        this.errors.remove('edicao_sumario')
        if (this.errors.items.length === 0) {
          this.$validator.validateAll().then(validado => {
            if (validado && this.errors.items.length === 0) {
              this.salvaSumario.statusSalvamento = 'PROCESSANDO'
              let rota = _.isNull(this.sumarioCarregado.id) ? 'sumario_executivo/cria/' : 'sumario_executivo/salva/'
              this.loading.tela = !_.isNull(redirecionarChave)
              // Criando/Salvando sumário
              axiosLaravel.post(rota, this.sumarioCarregado).then((response) => {
                if (_.has(response.data, 'codigo') && response.data.codigo === 'OK') {
                  // ['id', 'nome', 'tipo', 'situacao', 'opcoes'].forEach(p => {
                  //   _.set(this.sumarioCarregado, p, _.get(response.data.retorno, p))
                  // })
                  this.salvaSumario.statusSalvamento = 'FEITO'
                  setTimeout(() => {
                    this.salvaSumario.statusSalvamento = 'AGUARDANDO'
                    this.salvaSumario.salvamentoAutomaticoAtivo = true // Depois de salvo manualmente a primeira vez ele já ativa para as demais focarem automaticas
                    this.salvaSumario.contador++ // É só pra registrar a qantidade de vezes que já foi salvo
                    console.log('salvamento feito! contador', this.salvaSumario.contador)
                  }, 2000)
                  this.sumarioCarregado = _.cloneDeep(response.data.retorno)
                  this.sumarioCarregadoTemp = _.cloneDeep(this.sumarioCarregado) // Copia o que foi salvo para um temp que servirá de comparação para o salvamento automático
                } else {
                  this.aviso(response.data)
                }
                this.loading.tela = false
              })
                .catch((error) => {
                  this.$root.trataErro(error)
                  this.salvaSumario.statusSalvamento = 'ERRO'
                })
            }
          })
        }
      },
      aviso (retorno) {
        if (_.has(retorno, 'codigo')) {
          let mensagens = (_.has(retorno, 'mensagem') && !_.isNull(retorno.mensagem) && !_.isEmpty(retorno.mensagem)) ? retorno.mensagem : ['Erro de processamento. Não sei o que houve']
          mensagens.forEach((msg) => {
            if (retorno.codigo === 'ERRO') {
              this.$snotify.error(msg)
            } else if (_.includes(['OK', 'AVISO'], retorno.codigo)) {
              this.$snotify.success(msg, {timeout: 3000})
            }
          })
        }
      },
      mostrarOcultar (item, opcao) {
        _.set(item, [opcao], !_.get(item, [opcao], true))
        this.$forceUpdate()
      },
      novoParticipante () {
        this.participanteEditando = {'id': null, 'participante': '', 'mostrar': true, 'sobre': null, 'grupo': null, 'atuacao': null, 'historico': null}
      },
      removeParticipante (idx) {
        this.participanteEditando = null
        this.sumarioCarregado.sumario.participantes.splice(idx, 1)
        this.$forceUpdate()
      },
      duplicaParticipante (idx) {
        let participante = _.clone(this.sumarioCarregado.sumario.participantes[idx])
        this.sumarioCarregado.sumario.participantes.splice(idx, 0, participante)
        this.$forceUpdate()
      },
      editaParticipante (idx) {
        this.participanteEditando = _.clone(this.sumarioCarregado.sumario.participantes[idx])
      },
      okEdicaoParticipante () {
        let participante = _.clone(this.participanteEditando)
        if (_.isNull(participante.id)) {
          _.set(participante, 'id', ++this.idParticipanteEditando)
          this.sumarioCarregado.sumario.participantes.push(participante)
        } else {
          this.sumarioCarregado.sumario.participantes[_.findIndex(this.sumarioCarregado.sumario.participantes, ['id', participante.id])] = _.clone(participante)
        }
        this.participanteEditando = null
      },
      cancelaEdicaoParticipante () {
        this.participanteEditando = null
      },
      //
      //
      novoInterlocutor () {
        this.interlocutorEditando = {'id': null, 'nome': '', 'cargo': null}
      },
      removeInterlocutor (participante, idx) {
        this.interlocutorEditando = null
        participante.interlocutores.splice(idx, 1)
        this.$forceUpdate()
      },
      duplicaInterlocutor (participante, idx) {
        let interlocutor = _.clone(participante.interlocutores[idx])
        participante.interlocutores.splice(idx, 0, interlocutor)
        this.$forceUpdate()
      },
      editaInterlocutor (participante, idx) {
        this.interlocutorEditando = _.clone(participante.interlocutores[idx])
      },
      okEdicaoInterlocutor (participante) {
        let interlocutor = _.clone(this.interlocutorEditando)
        if (!_.has(this.participanteEditando, 'interlocutores')) {
          _.set(this.participanteEditando, 'interlocutores', [])
        }
        if (_.isNull(interlocutor.id)) {
          _.set(interlocutor, 'id', ++this.idInterlocutorEditando)
          participante.interlocutores.push(interlocutor)
        } else {
          participante.interlocutores[_.findIndex(participante.interlocutores, ['id', interlocutor.id])] = interlocutor
        }
        this.interlocutorEditando = null
      },
      cancelaEdicaoInterlocutor () {
        this.interlocutorEditando = null
      },
      //
      //
      novoInvestimento () {
        this.investimentoEditando = {'id': null, 'origem': '', 'valorFBB': 0, 'valorContrapartida': 0, 'valorParceiros': 0}
      },
      removeInvestimento (idx) {
        this.investimentoEditando = null
        this.sumarioCarregado.sumario.investimentos.splice(idx, 1)
        this.$forceUpdate()
      },
      duplicaInvestimento (idx) {
        let investimento = _.clone(this.sumarioCarregado.sumario.investimentos[idx])
        this.sumarioCarregado.sumario.investimentos.splice(idx, 0, investimento)
        this.$forceUpdate()
      },
      editaInvestimento (idx) {
        this.investimentoEditando = _.clone(this.sumarioCarregado.sumario.investimentos[idx])
      },
      okEdicaoInvestimento () {
        let investimento = _.clone(this.investimentoEditando)
        if (_.isNull(investimento.id)) {
          _.set(investimento, 'id', ++this.idInvestimentoEditando)
          if (!_.has(this.sumarioCarregado, 'sumario.investimentos')) {
            _.set(this.sumarioCarregado, 'sumario.investimentos', [])
          }
          this.sumarioCarregado.sumario.investimentos.push(investimento)
        } else {
          this.sumarioCarregado.sumario.investimentos[_.findIndex(this.sumarioCarregado.sumario.investimentos, ['id', investimento.id])] = _.clone(investimento)
        }
        this.investimentoEditando = null
      },
      cancelaEdicaoInvestimento () {
        this.investimentoEditando = null
      },
      //
      //
      buscaParticipantesJaCadastrados () {
        console.log('busca')
        this.pesquisa.participantes.mostrar = false
        if (!_.isEmpty(this.participanteEditando.participante) && this.participanteEditando.participante.length > 3) {
          this.loading.pesquisa.participantes = true
          axiosLaravel.post('sumario_executivo/participantes/', {'termo': this.participanteEditando.participante}).then((response) => {
            console.log('buscaParticipantesJaCadastrados', response.data)
            if (_.has(response.data, 'codigo') && response.data.codigo === 'OK') {
              this.pesquisa.participantes.lista = response.data.retorno
              this.pesquisa.participantes.mostrar = true
              this.$forceUpdate()
            }
            this.loading.pesquisa.participantes = false
          })
            .catch((error) => {
              this.$root.trataErro(error)
              this.loading.pesquisa.participantes = false
            })
        }
      },
      ocultaListaParticipantesJaCadastrados () {
        setTimeout(() => { this.pesquisa.participantes.mostrar = false }, 500)
      },
      selecionaParticipanteJaCadastrado (selecionado) {
        this.participanteEditando.participante = selecionado.nomfor
        this.pesquisa.participantes.lista = []
        if (selecionado.contatos > 0) {
          let vm = this
          this.$dialog.confirm('Deseja adicionar <b>' + selecionado.contatos + '</b> contato(s) de <b>' + selecionado.nomfor + '</b> como interlocutores?', {html: true, animation: 'fade', customClass: 'avisoConfirmacao'})
            .then(function (dialog) {
              vm.adicionarInterlocutoresDeParticipanteSelecionado(selecionado.codfor)
            }).catch(function () {
            })
        }
      },
      adicionarInterlocutoresDeParticipanteSelecionado (codigo) {
        this.loading.tela = true
        axiosLaravel.post('sumario_executivo/interlocutores/', {'codigo': codigo}).then((response) => {
          console.log('adicionarInterlocutoresDeParticipanteSelecionado response', response.data)
          if (_.has(response.data, 'codigo') && response.data.codigo === 'OK') {
            if (!_.has(this.participanteEditando, 'interlocutores')) {
              _.set(this.participanteEditando, 'interlocutores', [])
            }
            response.data.retorno.forEach((contato) => {
              this.participanteEditando.interlocutores.push({'id': ++this.idInterlocutorEditando, 'nome': contato.nomcto, 'cargo': contato.desniv})
            })
            this.$forceUpdate()
          }
          this.loading.tela = false
        })
          .catch((error) => {
            this.$root.trataErro(error)
            this.loading.tela = false
          })
      },
      //
      //
      buscaProjetosAprovados () {
        console.log('busca')
        this.pesquisa.projetos.mostrar = false
        if (!_.isEmpty(this.investimentoEditando.origem) && this.investimentoEditando.origem.length > 3) {
          this.loading.pesquisa.projetos = true
          axiosLaravel.post('sumario_executivo/projetos/', {'termo': this.investimentoEditando.origem}).then((response) => {
            console.log('buscaProjetosAprovados', response.data)
            if (_.has(response.data, 'codigo') && response.data.codigo === 'OK') {
              this.pesquisa.projetos.lista = response.data.retorno
              this.pesquisa.projetos.mostrar = true
              this.$forceUpdate()
            }
            this.loading.pesquisa.projetos = false
          })
            .catch((error) => {
              this.$root.trataErro(error)
              this.loading.pesquisa.projetos = false
            })
        }
      },
      ocultaListaProjetosAprovados () {
        setTimeout(() => { this.pesquisa.projetos.mostrar = false }, 500)
      },
      selecionaProjetosAprovados (selecionado) {
        this.investimentoEditando.origem = selecionado.nomprj
        this.pesquisa.projetos.lista = []
        this.loading.tela = true
        axiosLaravel.post('sumario_executivo/projeto/investimento', {'projeto': selecionado.numprj}).then((response) => {
          console.log('buscaProjetosAprovados', response.data)
          if (_.has(response.data, 'codigo') && response.data.codigo === 'OK') {
            this.investimentoEditando.valorFBB = response.data.retorno.valorFBB
            this.investimentoEditando.valorContrapartida = response.data.retorno.valorContrapartida
            this.investimentoEditando.valorParceiros = response.data.retorno.valorParceiros
            this.$forceUpdate()
          }
          this.loading.tela = false
        })
          .catch((error) => {
            this.$root.trataErro(error)
            this.loading.tela = false
          })
      },
      imprimir () {
        window.print()
      },
      removerTagHtmlString (str) {
        return _.isNull(str) ? str : ('' + str).replace(/(<([^>]+)>)/ig, '')
      },
      handleFileUpload (e) {
        let files = e.target.files || e.dataTransfer.files
        // Transforma o arquivo em base64 para passar no json
        this.carregaArquivo(files[0])
        // Pega o nome do arquivo
        _.set(this.participanteEditando, 'logomarca.ds_nome_arquivo', files[0].name)
        // Pega o tipo do arquivo
        _.set(this.participanteEditando, 'logomarca.ds_content_type', files[0].type)
      },
      carregaArquivo (file) {
        let reader = new FileReader()
        let vm = this
        reader.onload = (e) => {
          _.set(vm.participanteEditando, 'logomarca.file', e.target.result)
          // vm.participanteEditando.logomarca.file = e.target.result
        }
        reader.readAsDataURL(file)
      }
    }
  }
</script>

<style scoped>
  #sumario_impresso {
    font-size: 16px !important;
  }

  #sumario_acesso_externo {
    font-size: 14px !important;
    margin: 0 5%;
    background: white;
  }

  #sumario .bloco_sumario_executivo {
    margin-bottom: 20px;
    margin-left: 60px;
    margin-right: 60px;
  }

  #sumario_acesso_externo .bloco_sumario_executivo {
    margin-bottom: 20px;
  }

  #sumario .titulo_sumario_executivo, #sumario_acesso_externo .titulo_sumario_executivo {
    border-bottom: 2px solid black;
    font-weight: bold;
    text-align: left;
    margin-bottom: 20px;
  }

  #sumario .cabecalho_sumario_executivo {
    display: flex;
    justify-content: space-between;
    flex-direction: row;
  }

  #sumario .sumario_criticidade, #sumario_acesso_externo .sumario_criticidade {
    font-style: italic;
  }
  #sumario_acesso_externo .sumario_criticidade {
    float: right;
  }

  #sumario .mostrar_ocultar_impressao {
    color: var(--cor-padrao-light);
    cursor: pointer;
  }

  #sumario .pesquisa_autocomplete {
    position: absolute;
    background: white;
    border: 1px solid #e8e8e8;
    width: 100%;
    z-index: 1000;
    max-height: 300px;
    overflow: auto;
  }
  #sumario .pesquisa_autocomplete ul {
    list-style: none;
    display: inline-block;
    padding: 0;
    margin: 0;
    width: 100%;
    vertical-align: top;
  }
  #sumario .pesquisa_autocomplete ul li {
    width: 100%;
    padding: 5px;
  }
  #sumario .pesquisa_autocomplete ul li:hover {
    cursor: pointer;
    background: var(--cor-fraca-light);
  }

</style>

