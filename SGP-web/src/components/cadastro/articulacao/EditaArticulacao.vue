<template>
  <div class="content-wrapper" v-bind:style="'min-height: ' + alturaContentWrapper + 'px'">

    <vue-headful :title="'SGP - Edição de Instituição Parceira'"/>

    <section class="content-header">
      <h1>
        <span>{{_.isNull(id) ? 'Novo Parceiro' : (ehVisualizacao ? 'Visualiza' : 'Edição de') + ' Parceiro Estratégico '}}</span>

        <span v-if="!ehVisualizacao">
          <span v-if="_.isNull(id)">
            <g-button-moema color="primary" @click.native="salvarEdicao()" type="button" v-if="salvaParceiro.statusSalvamento !== 'PROCESSANDO'"
                            :title="'<h5>Ao clicar ele criará este parceiro no sistema para uso. Então antes de fazê-lo verifique se não existe este parceiro ou semelhante já criado</h5>'" v-tippy="{inertia:true, arrow:true, animation:'perspective', distance:'1', size:'large', arrow:true, delay: [500, 0]}">
              <i class="fa fa-plus-circle" aria-hidden="true"></i> Cria novo parceiro</g-button-moema>
            <span v-if="salvaParceiro.statusSalvamento === 'PROCESSANDO'" class='button--moema warning' style='font-size: 12px;padding: 8px 50px 10px 15px;border-radius: 2px !important;background: var(--cor-borda-dark) !important;cursor: not-allowed;'><i class='fa fa-refresh fa-spin'></i> Criando Parceiro ...</span>
          </span>

          <span v-if="!_.isNull(id)" v-show="_.isEmpty(editando)">
            <span v-if="salvaParceiro.statusSalvamento === 'PROCESSANDO'" class='button--moema warning' style='font-size: 12px;padding: 8px 50px 10px 15px;border-radius: 2px !important;background: var(--cor-borda-dark) !important;cursor: not-allowed;'><i class='fa fa-refresh fa-spin'></i> Salvando</span>
            <span v-else-if="salvaParceiro.statusSalvamento === 'FEITO'" class='button--moema success' style='font-size: 12px;padding: 8px 10px 10px 15px;border-radius: 2px !important;background: var(--cor-verde) !important;cursor: not-allowed;'><i class='fa fa-check'></i> Cadastro salvo</span>
            <span v-else><g-button-moema color="primary" @click.native="salvarEdicao()" type="button"><i class="fa fa-floppy-o" aria-hidden="true"></i> Salvar alterações</g-button-moema></span>
          </span>
        </span>
        <span>
          <g-button-moema color="warning" @click.native="$router.push({name: 'lista-articulacoes'})" type="button"><i class="fa fa-chevron-circle-left" aria-hidden="true"></i> Voltar</g-button-moema>
        </span>
      </h1>
    </section>

    <section class="content" id="parceiro">

      <div class="row nao_imprimir">

        <div class="col-md-12">

          <div class="box box-primary">

            <div class="box-body">

              <div class="form-horizontal">

                <div class="form-group">
                  <div class="required-field" :class="{ 'has-error' : errors.first('acao')}">
                    <label class="control-label col-md-2">Nome do parceiro</label>
                    <div class="col-md-6">
                      <input v-model="parceiro.nome" type="text" name="nome_parceiro" ref="nome_parceiro" class="form-control" v-validate="'required'" :disabled="ehVisualizacao || !_.isEmpty(editando)"
                      :title="'<h5>Nome do parceiro, preferencialmente completo tal como no CNPJ</h5>'" v-tippy="{inertia:true, arrow:true, animation:'perspective', distance:'1', size:'large', arrow:true, delay: [500, 0]}" />
                      <span v-if="errors.first('nome_parceiro')" class="label label-danger"> O nome da instituição parceira é obrigatório</span>
                    </div>
                  </div>

                </div>


                <div class="form-group" v-show="_.isEmpty(editando)">
                  <div :class="{ 'has-error' : errors.first('parceiro_cnpj')}">
                    <label class="control-label col-md-2">CNPJ</label>
                    <div class="col-md-3">
                      <the-mask v-model="parceiro.cnpj" name="parceiro_cnpj" class="form-control" :mask="['##.###.###/####-##']"
                                :disabled="ehVisualizacao" :class="{ 'has-error' : errors.first('parceiro_cnpj')}" type="text" v-validate="'cnpj'"
                                :title="'<h5>CNPJ da intituição estratégica para parcerias</h5>'" v-tippy="{inertia:true, arrow:true, animation:'perspective', distance:'1', size:'large', arrow:true, delay: [500, 0]}">
                      </the-mask>
                      <span v-if="errors.first('parceiro_cnpj')" class="label label-danger"> {{ errors.first('parceiro_cnpj') }}</span>
                    </div>
                  </div>


                  <div class="required-field" :class="{ 'has-error' : errors.first('sede')}">
                    <label class="control-label col-md-1">Sede</label>
                    <div class="col-lg-3" v-if="loading.abrangencia"><span class="etiquetaCarregando"><i class="fa fa-refresh fa-spin"></i> Carregando municípios...</span></div>
                    <div class="col-lg-3" v-else>
                      <multiselect v-model="parceiro.sede"
                                   :options="listaAbrangencias[3].lista"
                                   :disabled="ehVisualizacao"
                                   :multiple="false"
                                   placeholder="Selecione a sede"
                                   label="descricao"
                                   track-by="codigo"
                                   :preselect-first="false"
                                   :close-on-select="true"
                                   selectLabel=""
                                   deselectLabel=""
                                   selectedLabel=""
                                   name="sede"
                                   v-validate="'required'">
                        <template slot="option" slot-scope="props">
                          <div v-html="props.option.descricao"></div>
                        </template>
                        <template slot="noResult">Nenhum registro localizado!</template>
                      </multiselect>
                      <span v-if="errors.first('sede')" class="label label-danger"> Deve ser informada a sede da organização</span>
                    </div>
                  </div>


                  <div class="indicadores-cb-inline">
                    <label class="control-label col-md-3">Cliente Dicor?
                      <div v-if="!ehVisualizacao">
                        <i @click="parceiro.dicor = !parceiro.dicor" :class="!parceiro.dicor ? 'fa fa-square-o' : 'fa fa-check-square-o selecionado'" aria-hidden="true"></i>
                      </div>
                      <div v-else class="text-muted selecionado">
                        {{ parceiro.dicor ? 'Sim' : 'Não' }}
                      </div>
                    </label>
                  </div>
                </div>

                <div class="form-group" v-show="_.isEmpty(editando)">
                  <div class="required-field" :class="{ 'has-error' : errors.first('abrangencia')}">
                    <label class="control-label col-md-2">Abrangência</label>
                    <div class="col-lg-10" v-if="loading.abrangencia"><span class="etiquetaCarregando"><i class="fa fa-refresh fa-spin"></i> Carregando abrangência...</span></div>
                    <div class="col-lg-10" v-else>
                        <multiselect v-model="parceiro.abrangencias"
                                     :options="listaAbrangencias"
                                     :disabled="ehVisualizacao"
                                     :multiple="true"
                                     placeholder="Selecione a abrangência"
                                     label="descricao"
                                     group-values="lista"
                                     group-label="grupo"
                                     track-by="codigo"
                                     :preselect-first="false"
                                     :close-on-select="true"
                                     selectLabel=""
                                     deselectLabel=""
                                     selectedLabel=""
                                     name="abrangencia"
                                     v-validate="'required'">
                        <template slot="option" slot-scope="props">
                          <div v-if="_.has(props.option, '$groupLabel')" v-html="props.option.$groupLabel" class="text-bold"></div>
                          <div v-else v-html="props.option.descricao" style="margin-left: 1em"></div>
                        </template>
                        <template slot="noResult">Nenhum registro localizado!</template>
                      </multiselect>
                      <span v-if="errors.first('abrangencia')" class="label label-danger"> A abrangência da parceria é obrigatória</span>
                    </div>
                  </div>
                </div>

      <!-- Valores previstos para Investimento pelo Parceiro -------------------------------------------------->
                <div class="form-group" v-show="_.isEmpty(editando)" v-if="false">
                  <label class="control-label col-md-2">Valores</label>
                  <div class="col-lg-10">
                    <table class="table table-condensed table-bordered">
                      <thead class="">
                      <tr>
                        <th>Fundação BB</th>
                        <th>Parceiro</th>
                        <th style="text-align: center">Total</th>
                      </tr>
                      </thead>
                      <tbody class="">
                      <tr class="">
                        <td>
                          <money v-model="parceiro.orcamento.fbb" class="form-control" name="valorFBB" :disabled="ehVisualizacao"></money>
                        </td>
                        <td>
                          <money v-model="parceiro.orcamento.parceiro" class="form-control" name="valorFBB" :disabled="ehVisualizacao"></money>
                        </td>
                        <td class="text-bold text-center">
                          {{_.toNumber(parceiro.orcamento.fbb) + _.toNumber(parceiro.orcamento.parceiro) | real}}
                        </td>
                      </tr>
                      </tbody>
                    </table>
                  </div>
                </div>



                <div v-if="!_.isNull(id)">
                  <!-- Contatos do Parceiro -------------------------------------------------->
                  <div class="box-body" v-show="_.isEmpty(editando) || _.has(editando, 'contato')">
                    <div class="box-header">
                      <h3 class="box-title">Contatos com a Instituição</h3>
                    </div>
                    <!-- Lista de Contatos -->
                    <div class="form-group" v-if="_.isEmpty(editando) || (!_.isEmpty(editando) && !_.has(editando, 'contato'))">
                      <div class="col-md-12">
                        <table class="table table-condensed table-bordered">
                          <thead class="">
                          <tr>
                            <th>Contato</th>
                            <th>Cargo</th>
                            <th style="width:140px; text-align: center">Telefone(s)</th>
                            <th >E-mail</th>
                            <th v-bind:style="'text-align: center;width: ' + (ehVisualizacao ? 120 : 260) + 'px;'">
                              <g-button-ujarak color="primary" size="button--size-ss" @click.native="edita(editando, 'contato', _.cloneDeep(contato), -1)" v-if="!ehVisualizacao"><i class="fa fa-plus-circle" aria-hidden="true"></i> Incluir</g-button-ujarak >
                            </th>
                          </tr>
                          </thead>
                          <tbody v-if="parceiro.contatos.length === 0" class=""><tr><td colspan="4">Nenhum contato adicionado ainda!</td></tr></tbody>
                          <tbody v-else class="">
                          <tr v-for="(contato, idxContato) in parceiro.contatos" class="">
                            <td class="text-bold">{{contato.nome}}</td>
                            <td>{{contato.cargo}}</td>
                            <td class="text-center">
                              {{contato.telefone | telefone}}
                              <span v-if="!_.isNull(contato.telefone)"><br/>{{contato.telefone2 | telefone}}</span>
                            </td>
                            <td>{{contato.email}}</td>
                            <td style="text-align: center;max-width: 200px;">
                              <span v-if="!ehVisualizacao">
                                <g-button-ujarak color="primary" size="button--size-ss" @click.native="edita(editando, 'contato', contato, idxContato)"><i class="fa fa-pencil-square-o" aria-hidden="true"></i> Editar</g-button-ujarak>
                                <g-button-ujarak color="warning" size="button--size-ss" @click.native="duplica(parceiro.contatos, idxContato)"><i class="fa fa-plus" aria-hidden="true"></i> Duplicar</g-button-ujarak>
                                <g-button-ujarak color="error" size="button--size-ss" @click.native="remove(parceiro.contatos, idxContato)"><i class="fa fa-trash" aria-hidden="true"></i> Excluir</g-button-ujarak>
                              </span>
                              <span v-else>
                                <g-button-ujarak color="success" size="button--size-ss" @click.native="edita(editando, 'contato', contato, idxContato)"><i class="fa fa-search" aria-hidden="true"></i> Visualizar</g-button-ujarak>
                              </span>
                            </td>
                          </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>

                    <!-- Criação/Edição de Contato -->
                    <div class="col-md-12 well" v-if="_.has(editando, 'contato')">
                      <div class="form-group">
                        <div class="required-field" :class="{ 'has-error' : errors.first('nome_contato')}">
                          <label class="control-label col-md-2">Nome</label>
                          <div class="col-md-6">
                            <input v-model="editando.contato.nome" type="text" name="nome_contato" ref="nome_contato" class="form-control" v-validate="'required'" :disabled="ehVisualizacao"
                                   :title="'<h5>Nome do contato na instituição parceira</h5>'" v-tippy="{inertia:true, arrow:true, animation:'perspective', distance:'1', size:'large', arrow:true, delay: [500, 0]}" />
                            <span v-if="errors.first('nome_contato')" class="label label-danger"> O nome do contato é obrigatório</span>
                          </div>
                        </div>

                        <div class="">
                          <label class="control-label col-md-2">Cargo</label>
                          <div class="col-md-2">
                            <input v-model="editando.contato.cargo" type="text" name="cargo_contato" ref="cargo_contato" class="form-control" v-validate="'required'" :disabled="ehVisualizacao"
                                   :title="'<h5>Cargo dele na instituição ou o equivalente ao cargo. Em geral (Presidente, Diretor, Coordenador de projeto, Contato, etc) </h5>'" v-tippy="{inertia:true, arrow:true, animation:'perspective', distance:'1', size:'large', arrow:true, delay: [500, 0]}" />
                          </div>
                        </div>
                      </div>

                      <div class="form-group">
                        <div class="">
                          <label class="control-label col-md-2">E-mail</label>
                          <div class="col-md-2">
                            <input  v-model="editando.contato.email" :disabled="ehVisualizacao" type="text"
                                    :title="'<h5>Diite um e-mail pessoal ou corporativo para o contato, se tiver</h5>'" v-tippy="{inertia:true, arrow:true, animation:'perspective', distance:'1', size:'large', arrow:true, delay: [500, 0]}"
                                    v-validate="'email|min:1|max:255'" name="email_contato" class="form-control">
                          </div>
                        </div>

                        <div>
                          <label class="control-label col-md-2">Telefone</label>
                          <div class="col-md-2">
                            <the-mask v-model="editando.contato.telefone" :mask="['(##) ####-####', '(##) #####-####']" type="text" class="form-control" placeholder="(00) 00000-0000"
                                      :title="'<h5>Informe um telefone ou celular para entrar em contato com esta pessoa</h5>'" v-tippy="{inertia:true, arrow:true, animation:'perspective', distance:'1', size:'large', arrow:true, delay: [500, 0]}"
                                      :disabled="ehVisualizacao" name="telefone_contato">
                            </the-mask>
                          </div>
                        </div>

                        <div>
                          <label class="control-label col-md-2">2º Telefone</label>
                          <div class="col-md-2">
                            <the-mask v-model="editando.contato.telefone2" :mask="['(##) ####-####', '(##) #####-####']" type="text" class="form-control" placeholder="(00) 00000-0000"
                                      :title="'<h5>Informe um outro telefone ou celular para contato caso haja</h5>'" v-tippy="{inertia:true, arrow:true, animation:'perspective', distance:'1', size:'large', arrow:true, delay: [500, 0]}"
                                      :disabled="ehVisualizacao" name="telefone_contato_2">
                            </the-mask>
                          </div>
                        </div>
                      </div>

                      <div class="form-group">
                        <div class="col-md-10 col-md-offset-2">
                          <button @click="ok(editando, 'contato', parceiro.contatos)" v-if="!ehVisualizacao && (!(errors.first('nome_contato') || errors.first('telefone_contato')))" type="button" class="btn btn-confirm btn-flat"><i class="fa fa-check" aria-hidden="true"></i> Ok</button>
                          <button @click.once="cancela(editando, 'contato')" type="button" class="btn btn-back btn-flat"><i class="fa fa-times-circle" aria-hidden="true"></i> Cancelar</button>
                        </div>
                      </div>

                    </div>
                  </div>


                  <!-- Histórico da instituição parceira ------------------------------------------>
                  <div class="box-body" v-show="_.isEmpty(editando) || _.has(editando, 'historico')">
                    <div class="box-header">
                      <h3 class="box-title">Histórico do parceiro</h3>
                    </div>
                    <div class="form-group" v-if="_.isEmpty(editando) || (!_.isEmpty(editando) && !_.has(editando, 'historico'))">
                      <div class="col-md-12">
                        <table class="table table-condensed table-bordered">
                          <thead class="">
                          <tr>
                            <th>Tipo</th>
                            <th>Informação</th>
                            <th class="text-center">Usuário</th>
                            <th style="text-align: center; width: 120px">Data</th>
                            <th v-bind:style="'text-align: center;width: ' + (ehVisualizacao ? 120 : 260) + 'px;'">
                              <g-button-ujarak color="primary" size="button--size-ss" @click.native="edita(editando, 'historico', _.cloneDeep(historico), -1);editando.historico.data=new Date()" v-if="!ehVisualizacao"><i class="fa fa-plus-circle" aria-hidden="true"></i> Incluir</g-button-ujarak >
                            </th>
                          </tr>
                          </thead>
                          <tbody v-if="parceiro.historicos.length === 0" class=""><tr><td colspan="3">Nenhum histórico adicionado ainda!</td></tr></tbody>
                          <tbody v-else class="">
                          <tr v-for="(historico, idxHistorico) in parceiro.historicos" class="">
                            <td class="text-bold">{{_.get(_.find(listaTipos, ['codigo', historico.tipo]), 'descricao')}}</td>
                            <td><span v-html="historico.conteudo"></span></td>
                            <td>
                              <div class="truncar" style="width: 100px;" v-if="_.has(historico, 'usuario.ds_nome_usuario')" :title="'<h5>' + historico.usuario.ds_nome_usuario + ' (id: ' + historico.usuario.id + ')</h5>'" v-tippy="{inertia:true, arrow:true, animation:'perspective', distance:'1', size:'large', arrow:true, delay: [500, 0]}">
                                {{historico.usuario.ds_nome_usuario}}
                              </div>
                            </td>
                            <td class="text-center">
                              {{historico.data | moment("L")}}
                              <span v-if="!_.isNull(historico.prazo)">
                                <p class="label label-warning">{{historico.prazo | moment("L")}}</p>
                              </span>
                            </td>
                            <td style="text-align: center;max-width: 200px;">
                              <span v-if="!ehVisualizacao">
                                <g-button-ujarak color="primary" size="button--size-ss" @click.native="edita(editando, 'historico', historico, idxHistorico)"><i class="fa fa-pencil-square-o" aria-hidden="true"></i> Editar</g-button-ujarak>
                                <g-button-ujarak color="warning" size="button--size-ss" @click.native="duplica(parceiro.historicos, idxHistorico)"><i class="fa fa-plus" aria-hidden="true"></i> Duplicar</g-button-ujarak>
                                <g-button-ujarak color="error" size="button--size-ss" @click.native="remove(parceiro.historicos, idxHistorico)"><i class="fa fa-trash" aria-hidden="true"></i> Excluir</g-button-ujarak>
                              </span>
                              <span v-else>
                                <g-button-ujarak color="success" size="button--size-ss" @click.native="edita(editando, 'historico', historico, idxHistorico)"><i class="fa fa-fa-search" aria-hidden="true"></i> Visualizar</g-button-ujarak>
                              </span>
                            </td>
                          </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>

                    <!-- Criando/Editando histórico do parceiro -->
                    <div class="col-md-12 well" v-if="_.has(editando, 'historico')">
                      <div class="form-group">
                        <div class="required-field" :class="{ 'has-error' : errors.first('tipo_historico')}">
                          <label class="control-label col-md-2">Tipo</label>
                          <div class="col-md-2">
                            <select v-model="editando.historico.tipo" type="text" name="tipo_historico" ref="tipo_historico" class="form-control" v-validate="'required'" :disabled="ehVisualizacao"
                                   :title="'<h5>O tipo do histórico permite definir ações de cobrança, lembrete, auditagem etc</h5>'" v-tippy="{inertia:true, arrow:true, animation:'perspective', distance:'1', size:'large', arrow:true, delay: [500, 0]}">
                              <option v-for="tipo in listaTipos" :value="tipo.codigo">{{tipo.descricao}}</option>
                            </select>
                            <span v-if="errors.first('tipo_historico')" class="label label-danger"> O tipo do histórico é obrigatório</span>
                          </div>
                        </div>

                        <div class="">
                          <label class="control-label col-md-1">Data</label>
                          <div class="col-md-2">
                            <datepicker  name="data_historico" v-model="editando.historico.data" input-class="form-control datepicker" :disabled="ehVisualizacao"
                                         :language="$datePickerPtBR" maxlength="20" :use-utc="true" placeholder="__ /__ /____" @input="numeroAtualizacao++"
                                         format="dd/MM/yyyy" v-validate="''">
                            </datepicker>
                          </div>
                        </div>

                        <div class="">
                          <label class="control-label col-md-1">Prazo</label>
                          <div class="col-md-2">
                            <datepicker  name="prazo_historico" v-model="editando.historico.prazo" input-class="form-control datepicker" :disabled="ehVisualizacao"
                                         :language="$datePickerPtBR" maxlength="20" :use-utc="true" @input="numeroAtualizacao++"
                                         :disabled-dates="{to: new Date(editando.historico.data) }"
                                         format="dd/MM/yyyy" v-validate="''">
                            </datepicker>
                          </div>
                        </div>
                      </div>

                      <div class="form-group">
                        <div class="required-field" :class="{ 'has-error' : errors.first('conteudo_historico')}">
                          <div class="col-md-12">
                            <quill-editor
                              v-model="editando.historico.conteudo"
                              ref="conteudo_historico"
                              :disabled="ehVisualizacao"
                              :options="quillOptionsCompleto"
                              :title="'<h5>Descreva o que foi feito ou que será feito, seja um contato, reunião, assinatura de instrumento etc</h5>'" v-tippy="{inertia:true, arrow:true, animation:'perspective', distance:'1', size:'large', arrow:true, delay: [500, 0]}"
                              name="conteudo_historico">
                            </quill-editor>
                            <span v-if="errors.first('tipo_historico')" class="label label-danger"> Registre algum conteúdo para histórico</span>
                          </div>
                        </div>

                      </div>

                      <div class="form-group">
                        <div class="col-md-10 col-md-offset-2">
                          <button @click="dadosUsuarioHistorico(editando.historico);ok(editando, 'historico', parceiro.historicos)" v-if="!ehVisualizacao && (!(errors.first('conteudo_historico') || errors.first('tipo_historico')))" type="button" class="btn btn-confirm btn-flat"><i class="fa fa-check" aria-hidden="true"></i> Ok</button>
                          <button @click.once="cancela(editando, 'historico')" type="button" class="btn btn-back btn-flat"><i class="fa fa-times-circle" aria-hidden="true"></i> Cancelar</button>
                        </div>
                      </div>

                    </div>
                  </div>


                  <!-- Dependência que atende a instituição -------------------------------------->
                  <div class="box-body" v-show="_.isEmpty(editando)">
                    <div class="box-header">
                      <h3 class="box-title">Dependência BB de relacionamento</h3>
                    </div>
                    <div class="form-group">
                      <div class="col-md-12">
                        <table class="table table-condensed table-bordered">
                          <thead class="">
                          <tr>
                            <th style="width: 30%">Dependência BB</th>
                            <th>Contato</th>
                            <th style="width: 20%">Telefone</th>
                            <th style="width: 20%">E-mail</th>
                          </tr>
                          </thead>
                          <tbody v-if="loading.dependenciasBB"><tr><td colspan="4"><span class="etiquetaCarregando"><i class="fa fa-refresh fa-spin"></i> Carregando dependências BB...</span></td></tr></tbody>
                          <tbody v-else>
                          <tr>
                            <td>
                              <multiselect v-model="parceiro.bb"
                                           :options="listaDependenciasBB"
                                           :disabled="ehVisualizacao"
                                           :multiple="false"
                                           placeholder="Selecione a dependência"
                                           label="nome"
                                           track-by="prefixo"
                                           :preselect-first="false"
                                           :close-on-select="true"
                                           selectLabel=""
                                           deselectLabel=""
                                           selectedLabel=""
                                           name="dependenciaBB">
                                <template slot="option" slot-scope="props">{{props.option.prefixo}} - {{props.option.nome}}</template>
                                <template slot="singleLabel" slot-scope="props"><strong>{{props.option.prefixo}}</strong> {{props.option.nome}}</template>
                                <template slot="noResult">Nenhum registro localizado!</template>
                              </multiselect>
                            </td>

                            <td>
                              <input v-model="parceiro.bb.contato" name="bbContato" ref="bbContato" class="form-control" :disabled="ehVisualizacao"
                                     :title="'<h5>Nome do gerente ou do contato na dependência</h5>'" v-tippy="{inertia:true, arrow:true, animation:'perspective', distance:'1', size:'large', arrow:true, delay: [500, 0]}" />
                            </td>

                            <td>
                              <input v-model="parceiro.bb.telefone" name="bbTelefone" ref="bbTelefone" class="form-control" :disabled="ehVisualizacao" type="tel"
                                     :title="'<h5>Telefone do contato ou número principal da dependência</h5>'" v-tippy="{inertia:true, arrow:true, animation:'perspective', distance:'1', size:'large', arrow:true, delay: [500, 0]}" />
                            </td>

                            <td>
                              <input v-model="parceiro.bb.email" name="bbContato" ref="bbContato" class="form-control" :disabled="ehVisualizacao" type="email"
                                     :title="'<h5>E-mail do contato na dependência</h5>'" v-tippy="{inertia:true, arrow:true, animation:'perspective', distance:'1', size:'large', arrow:true, delay: [500, 0]}" />
                            </td>

                          </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>


                  <!-- Parcerias da instituição -------------------------------------------------->
                  <div class="box-body" v-show="_.isEmpty(editando) || _.has(editando, 'parceria')">
                    <div class="box-header">
                      <h3 class="box-title">Parcerias / Ações</h3>
                    </div>
                    <!-- Lista de Parcerias -->
                    <div class="form-group" v-if="_.isEmpty(editando) || (!_.isEmpty(editando) && !_.has(editando, 'parceria'))">
                      <div class="col-md-12">
                        <table class="table table-condensed table-bordered">
                          <thead class="">
                          <tr>
                            <th>Nome</th>
                            <th>Situação</th>
                            <th style="width: 300px;">Valores</th>
                            <th v-bind:style="'text-align: center;width: ' + (ehVisualizacao ? 120 : 260) + 'px;'">
                              <g-button-ujarak color="primary" size="button--size-ss" @click.native="edita(editando, 'parceria', _.cloneDeep(parceria), -1)" v-if="!ehVisualizacao"><i class="fa fa-plus-circle" aria-hidden="true"></i> Incluir</g-button-ujarak >
                            </th>
                          </tr>
                          </thead>
                          <tbody v-if="parceiro.parcerias.length === 0"><tr><td colspan="5">Nenhuma parceria ainda!</td></tr></tbody>
                          <tbody v-else>
                          <tr v-for="(parceria, idxParceria) in parceiro.parcerias">
                            <td>{{parceria.nome}}</td>
                            <td>{{_.get(_.find(situacoesParceria, ['codigo', parceria.situacao]), 'descricao')}}</td>
                            <td>
                              <table style="width: 100%;">
                                <tr><td>Parceria</td><td>{{parceria.orcamento.fbb | real}}</td><td>{{parceria.orcamento.parceiro | real}}</td></tr>
                                <tr><td class="text-bold">{{parceria.projetos.length + ' projeto' + (parceria.projetos.length > 1 ? 's' : '')}}</td><td>{{ _.sumBy(parceria.projetos, 'orcamento.fbb') | real }}</td><td>{{ _.sumBy(parceria.projetos, 'orcamento.parceiro') | real }}</td></tr>
                              </table>
                            </td>
                            <td style="text-align: center;max-width: 225px;">
                              <span v-if="!ehVisualizacao">
                                <g-button-ujarak color="primary" size="button--size-ss" @click.native="edita(editando, 'parceria', parceria, idxParceria)"><i class="fa fa-pencil-square-o" aria-hidden="true"></i> Editar</g-button-ujarak>
                                <g-button-ujarak color="warning" size="button--size-ss" @click.native="duplica(parceiro.parcerias, idxParceria)"><i class="fa fa-plus" aria-hidden="true"></i> Duplicar</g-button-ujarak>
                                <g-button-ujarak color="error" size="button--size-ss" @click.native="remove(parceiro.parcerias, idxParceria)"><i class="fa fa-trash" aria-hidden="true"></i> Excluir</g-button-ujarak>
                              </span>
                              <span v-else>
                                <g-button-ujarak color="success" size="button--size-ss" @click.native="edita(editando, 'parceria', parceria, idxParceria)"><i class="fa fa-search" aria-hidden="true"></i> Visualizar</g-button-ujarak>
                              </span>
                            </td>
                          </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>


                  <!-- Criando/Editando parceria -->
                  <div class="col-md-12 well" v-if="_.has(editando, 'parceria')">

                    <div class="form-group">
                      <div class="required-field" :class="{ 'has-error' : errors.first('nome_parceria')}">
                        <label class="control-label col-md-2">Nome da parceria</label>
                        <div class="col-md-6">
                          <input v-model="editando.parceria.nome" type="text" name="nome_parceria" ref="nome_parceria" class="form-control" v-validate="'required'" :disabled="ehVisualizacao || (_.has(editando, 'parceria') && _.keys(editando).length > 1)"
                                 :title="'<h5>Nome da parceria, preferencialmente o nome que constará em instrumentos futuros</h5>'" v-tippy="{inertia:true, arrow:true, animation:'perspective', distance:'1', size:'large', arrow:true, delay: [500, 0]}" />
                          <span v-if="errors.first('nome_parceria')" class="label label-danger"> O nome da parceria é obrigatório</span>
                        </div>
                      </div>


                      <div class="">
                        <label class="control-label col-md-2">Situação</label>
                        <div class="col-md-2">
                          <select v-model="editando.parceria.situacao" name="parceria_situacao" class="form-control" :disabled="ehVisualizacao || (_.has(editando, 'parceria') && _.keys(editando).length > 1)"
                                  :title="'<h5>Situação em que se encontra a parceria atualmente</h5>'" v-tippy="{inertia:true, arrow:true, animation:'perspective', distance:'1', size:'large', arrow:true, delay: [500, 0]}">
                            <option v-for="situacao in situacoesParceria" :value="situacao.codigo">{{situacao.descricao}}</option>
                          </select>
                        </div>
                      </div>
                    </div>



                    <div class="form-group" v-show="_.has(editando, 'parceria') && _.keys(editando).length === 1">
                      <div class="">
                        <label class="control-label col-md-2">Abrangência</label>
                        <div class="col-lg-10" v-if="loading.abrangencia"><span class="etiquetaCarregando"><i class="fa fa-refresh fa-spin"></i> Carregando abrangência...</span></div>
                        <div class="col-lg-10" v-else>
                          <multiselect v-model="editando.parceria.abrangencias"
                                       :options="listaAbrangencias"
                                       :disabled="ehVisualizacao"
                                       :multiple="true"
                                       placeholder="Selecione a abrangência"
                                       :ref="'ABRANGENCIA-PARCERIA-' + numeroAtualizacao"
                                       label="descricao"
                                       @select="numeroAtualizacao++"
                                       group-values="lista"
                                       group-label="grupo"
                                       track-by="codigo"
                                       :preselect-first="false"
                                       :close-on-select="true"
                                       selectLabel=""
                                       deselectLabel=""
                                       selectedLabel=""
                                       name="abrangencia_parceria">
                            <template slot="option" slot-scope="props">
                              <div v-if="_.has(props.option, '$groupLabel')" v-html="props.option.$groupLabel" class="text-bold"></div>
                              <div v-else v-html="props.option.descricao" style="margin-left: 1em"></div>
                            </template>
                            <template slot="noResult">Nenhum registro localizado!</template>
                          </multiselect>
                        </div>
                      </div>
                    </div>


                    <!-- Valores previstos para a parceiro com a instituição -------------------------------------------------->
                    <div class="form-group" v-show="_.has(editando, 'parceria') && _.keys(editando).length === 1">
                      <label class="control-label col-md-2">Valores</label>
                      <div class="col-lg-10">
                        <table class="table table-condensed table-bordered">
                          <thead class="">
                          <tr>
                            <th style="text-align: center">Fundação BB</th>
                            <th style="text-align: center"> Parceiro</th>
                            <th style="text-align: center">Total</th>
                          </tr>
                          </thead>
                          <tbody class="">
                          <tr class="">
                            <td style="width: 30%">
                              <money v-model="editando.parceria.orcamento.fbb" class="form-control text-center" name="valorFBB" :disabled="ehVisualizacao" @blur.native="numeroAtualizacao++"></money>
                            </td>
                            <td style="width: 30%">
                              <money v-model="editando.parceria.orcamento.parceiro" class="form-control text-center" name="valorFBB" :disabled="ehVisualizacao" @blur.native="numeroAtualizacao++"></money>
                            </td>
                            <td class="text-bold text-center" :ref="'TOTAL-PARCERIA-' + numeroAtualizacao">
                              {{_.toNumber(editando.parceria.orcamento.fbb) + _.toNumber(editando.parceria.orcamento.parceiro) | real}}
                            </td>
                          </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>


                    <!-- Instrumentos da parceria -------------------------------------------------->
                    <div class="form-group" v-show="(_.keys(editando).length === 1 && _.has(editando, 'parceria')) || (_.keys(editando).length > 1 && _.has(editando, 'parceriaInstrumento'))">
                      <div class="box-body">
                        <div class="box-header">
                          <h3 class="box-title">Instrumentos</h3>
                        </div>

                        <div class="form-group" v-if="!_.has(editando, 'parceriaInstrumento')">
                          <div class="col-md-12">
                            <table class="table table-condensed table-bordered">
                              <thead class="">
                              <tr>
                                <th>Nome</th>
                                <th style="text-align: center;width: 100px;">Assinatura</th>
                                <th style="text-align: center;width: 100px;">Vigência</th>
                                <th style="text-align: center;width: 150px;">Valores</th>
                                <th style="text-align: center;width: 100px;">Total</th>
                                <th style="text-align: center;width: 100px;">Situação</th>
                                <th v-bind:style="'text-align: center;width: ' + (ehVisualizacao ? 120 : 260) + 'px;'">
                                  <g-button-ujarak color="primary" size="button--size-ss" @click.native="edita(editando, 'parceriaInstrumento', _.cloneDeep(instrumento), -1)" v-if="!ehVisualizacao"><i class="fa fa-plus-circle" aria-hidden="true"></i> Incluir</g-button-ujarak >
                                </th>
                              </tr>
                              </thead>
                              <tbody v-if="(_.get(editando, 'parceria.instrumentos', [])).length === 0" class=""><tr><td colspan="3">Nenhum instrumento adicionado ainda!</td></tr></tbody>
                              <tbody v-else class="">
                              <tr v-for="(instrumento, idxInstrumento) in _.get(editando, 'parceria.instrumentos', [])" class="">
                                <td>
                                  {{instrumento.nome.descricao}}
                                </td>
                                <td class="text-center">
                                  {{instrumento.dataAssinatura | moment("L")}}
                                </td>
                                <td class="text-center">
                                  {{instrumento.dataVigencia | moment("L")}}
                                </td>
                                <td>
                                  FBB: {{instrumento.orcamento.fbb| real}}<br/>
                                  Parc.: {{instrumento.orcamento.parceiro | real}}
                                </td>
                                <td class="text-center">
                                  {{instrumento.orcamento.fbb + instrumento.orcamento.parceiro | real}}
                                </td>
                                <td class="text-center">
                                  <span :class="(situacaoInstrumento(instrumento)).classe">{{(situacaoInstrumento(instrumento)).texto}}</span>
                                </td>
                                <td style="text-align: center">
                                  <span v-if="!ehVisualizacao">
                                    <g-button-ujarak color="primary" size="button--size-ss" @click.native="edita(editando, 'parceriaInstrumento', instrumento, idxInstrumento)"><i class="fa fa-pencil-square-o" aria-hidden="true"></i> Editar</g-button-ujarak>
                                    <g-button-ujarak color="warning" size="button--size-ss" @click.native="duplica(editando.parceria.instrumentos, idxInstrumento)"><i class="fa fa-plus" aria-hidden="true"></i> Duplicar</g-button-ujarak>
                                    <g-button-ujarak color="error" size="button--size-ss" @click.native="remove(editando.parceria.instrumentos, idxInstrumento)"><i class="fa fa-trash" aria-hidden="true"></i> Excluir</g-button-ujarak>
                                  </span>
                                  <span v-else>
                                    <g-button-ujarak color="success" size="button--size-ss" @click.native="edita(editando, 'parceriaInstrumento', instrumento, idxInstrumento)"><i class="fa fa-search" aria-hidden="true"></i> Visualizar</g-button-ujarak>
                                  </span>
                                </td>
                              </tr>
                              </tbody>
                            </table>
                          </div>


                          <!-- Totais nos projetos -->
                          <div class="col-md-12 extratoff">
                            <table class="totais">
                              <tr>
                                <td class="centralizado">Qtde Instrumentos</td>
                                <td class="centralizado">Total Fundação BB</td>
                                <td class="centralizado">Total Parceiros</td>
                                <td class="centralizado">Total</td>
                              </tr>
                              <tr>
                                <td class="centralizado valor">{{ _.get(editando, 'parceria.instrumentos', []).length }}</td>
                                <td class="centralizado valor">{{ _.sumBy(_.get(editando, 'parceria.instrumentos', []), function(p) { return _.toNumber(_.get(p, 'orcamento.fbb', 0)) }) | real }}</td>
                                <td class="centralizado valor">{{ _.sumBy(_.get(editando, 'parceria.instrumentos', []), function(p) { return _.toNumber(_.get(p, 'orcamento.parceiro', 0)) }) | real }}</td>
                                <td class="centralizado valor">{{ _.sumBy(_.get(editando, 'parceria.instrumentos', []), function(p) { return _.toNumber(_.get(p, 'orcamento.fbb', 0)) + _.toNumber(_.get(p, 'orcamento.parceiro', 0)) }) | real }}</td>
                              </tr>
                            </table>
                          </div>

                        </div>

                        <!-- Criando/Editando instrumento da parceria -->
                        <div class="col-md-12 well" v-if="_.has(editando, 'parceriaInstrumento')">
                          <div class="form-group">
                            <div class="required-field" :class="{ 'has-error' : errors.first('nome_instrumento')}">
                              <label class="control-label col-md-2">Instrumento</label>
                              <div class="col-md-10">
                                <multiselect v-model="editando.parceriaInstrumento.nome"
                                             :options="listaInstrumentos"
                                             :disabled="ehVisualizacao || _.has(editando, 'parceriaInstrumentoAnexo')"
                                             :multiple="false"
                                             :ref="'INSTRUMENTO-PARCERIA-' + numeroAtualizacao"
                                             @select="numeroAtualizacao++"
                                             placeholder="Selecione"
                                             label="descricao"
                                             track-by="codigo"
                                             :preselect-first="false"
                                             :close-on-select="true"
                                             selectLabel=""
                                             deselectLabel=""
                                             selectedLabel=""
                                             name="instrumento_parceria"
                                             v-validate="'required'">
                                  <template slot="option" slot-scope="props">
                                    {{props.option.descricao}}
                                  </template>
                                  <template slot="noResult">Nenhum registro localizado!</template>
                                </multiselect>
                                <span v-if="errors.first('nome_instrumento')" class="label label-danger"> O instrumento é obrigatório</span>
                              </div>
                            </div>
                          </div>

                          <div class="form-group">
                            <div class="">
                              <label class="control-label col-md-2">Data da Assinatura</label>
                              <div class="col-md-2">
                                <datepicker  name="instrumento_data_assinatura" v-model="editando.parceriaInstrumento.dataAssinatura" input-class="form-control datepicker" :disabled="ehVisualizacao || _.has(editando, 'parceriaInstrumentoAnexo')"
                                             :language="$datePickerPtBR" maxlength="20" :use-utc="true" placeholder="__ /__ /____" @input="numeroAtualizacao++"
                                             format="dd/MM/yyyy" v-validate="''">
                                </datepicker>
                              </div>
                            </div>

                            <div class="">
                              <label class="control-label col-md-2">Data da Vigência</label>
                              <div class="col-md-2">
                                <datepicker  name="instrumento_data_vigencia" v-model="editando.parceriaInstrumento.dataVigencia" input-class="form-control datepicker" :disabled="ehVisualizacao || _.has(editando, 'parceriaInstrumentoAnexo')"
                                             :language="$datePickerPtBR" maxlength="20" :use-utc="true" placeholder="__ /__ /____" @input="numeroAtualizacao++"
                                             format="dd/MM/yyyy" v-validate="''" :disabled-dates="{to: new Date(editando.parceriaInstrumento.dataAssinatura) }">
                                </datepicker>
                              </div>
                            </div>

                            <div class="">
                              <label class="control-label col-md-2" :ref="'SITUACAO-PARCERIA-' + numeroAtualizacao">
                                <span :class="(situacaoInstrumento(editando.parceriaInstrumento)).classe">{{(situacaoInstrumento(editando.parceriaInstrumento)).texto}}</span>
                              </label>
                            </div>
                          </div>

                          <!-- Valores previstos no instrumento se houver -------------------------------------------------->
                          <div class="form-group">
                            <label class="control-label col-md-2">Valores</label>
                            <div class="col-lg-10">
                              <table class="table table-condensed table-bordered">
                                <thead class="">
                                <tr>
                                  <th>Fundação BB</th>
                                  <th>Parceiro</th>
                                  <th style="text-align: center">Total</th>
                                </tr>
                                </thead>
                                <tbody class="" v-if="_.has(editando, 'parceriaInstrumento.orcamento.fbb')">
                                <tr class="">
                                  <td>
                                    <money v-model="editando.parceriaInstrumento.orcamento.fbb" class="form-control" name="valorFBB" :disabled="ehVisualizacao || _.has(editando, 'parceriaInstrumentoAnexo')"></money>
                                  </td>
                                  <td>
                                    <money v-model="editando.parceriaInstrumento.orcamento.parceiro" class="form-control" name="valorParceiro" :disabled="ehVisualizacao || _.has(editando, 'parceriaInstrumentoAnexo')"></money>
                                  </td>
                                  <td class="text-bold text-center">
                                    {{_.toNumber(editando.parceriaInstrumento.orcamento.fbb) + _.toNumber(editando.parceriaInstrumento.orcamento.parceiro) | real}}
                                  </td>
                                </tr>
                                </tbody>
                              </table>
                            </div>
                          </div>

                          <div class="col-md-12">
                            <upload-documentos-online
                              :idProcesso="idCriacao"
                              :propDocumentos="editando.parceriaInstrumento.anexos"
                              :documentTypes="''"
                              :ehVisualizacao="ehVisualizacao"
                              :secaoOrigem="'PARCERIA_INSTRUMENTO'"
                              :local-uso="'TODOS'"
                              @arquivoAnexado="editando.parceriaInstrumento.anexos.push($event)"
                              @arquivoExcluido="_.remove(editando.parceriaInstrumento.anexos, ['id', $event.id])"
                              @layoutAtual="$event === 'LISTA' ? cancela(editando, 'parceriaInstrumentoAnexo') : edita(editando, 'parceriaInstrumentoAnexo', _.cloneDeep(anexo), -1)"
                              @acaoSalvar="salvarEdicao"
                              @acaoOk="ok(editando, 'parceriaInstrumento', editando.parceria.instrumentos, false);ok(editando, 'parceria', parceiro.parcerias, false)"
                              @acaoCancelar="cancela(editando, 'parceriaInstrumentoAnexo')"
                              @acaoProcessamento="loading.tela = true"
                              @acaoAguardando="loading.tela = false">
                            </upload-documentos-online>
                          </div>

                          <div class="form-group" v-show="!_.has(editando, 'parceriaInstrumentoAnexo')">
                            <div class="col-md-10 col-md-offset-2">
                              <button @click="ok(editando, 'parceriaInstrumento', editando.parceria.instrumentos)" v-if="!ehVisualizacao" type="button" class="btn btn-confirm btn-flat"><i class="fa fa-check" aria-hidden="true"></i> Ok</button>
                              <button @click.once="cancela(editando, 'parceriaInstrumento')" type="button" class="btn btn-back btn-flat"><i class="fa fa-times-circle" aria-hidden="true"></i> Cancelar</button>
                            </div>
                          </div>

                        </div>
                      </div>
                    </div>


                    <!-- Projetos da parceria -------------------------------------------------->
                    <div class="form-group" v-show="(_.keys(editando).length === 1 && _.has(editando, 'parceria')) || (_.keys(editando).length > 1 && _.has(editando, 'parceriaProjeto'))">
                      <div class="box-body">
                        <div class="box-header">
                          <h3 class="box-title">Projetos da parceria</h3>
                        </div>
                        <!-- Lista Projetos da Parceira -->
                        <div class="form-group" v-if="!_.has(editando, 'parceriaProjeto')">
                          <div class="col-md-12">
                            <table class="table table-condensed table-bordered">
                              <thead class="">
                              <tr>
                                <th>Projeto</th>
                                <th>Situação</th>
                                <th>Valores</th>
                                <th v-bind:style="'text-align: center;width: ' + (ehVisualizacao ? 120 : 260) + 'px;'">
                                  <g-button-ujarak color="primary" size="button--size-ss" @click.native="edita(editando, 'parceriaProjeto', _.cloneDeep(projeto), -1);projetoSelecionado = null" v-if="!ehVisualizacao"><i class="fa fa-plus-circle" aria-hidden="true"></i> Incluir</g-button-ujarak >
                                </th>
                              </tr>
                              </thead>
                              <tbody v-if="(_.get(editando, 'parceria.projetos', [])).length === 0" class=""><tr><td colspan="3">Nenhum projeto foi informado ainda!</td></tr></tbody>
                              <tbody v-else class="">
                              <tr v-for="(projetoSocial, idxProjeto) in _.get(editando, 'parceria.projetos', [])" class="">
                                <td>
                                  <span v-if="!_.isEmpty(projetoSocial.numero)" class="text-bold">{{projetoSocial.numero}} - </span>{{projetoSocial.nome}}
                                </td>
                                <td>
                                  {{_.get(_.find(situacoesProjeto, ['codigo', projetoSocial.situacao]), 'descricao')}}
                                </td>
                                <td>
                                  {{projetoSocial.orcamento.fbb + projetoSocial.orcamento.parceiro | real}}<br/>
                                  {{projetoSocial.execucao.fbb + projetoSocial.execucao.parceiro | real}}
                                </td>
                                <td style="text-align: center;max-width: 200px;">
                                  <span v-if="!ehVisualizacao">
                                    <g-button-ujarak color="primary" size="button--size-ss" @click.native="edita(editando, 'parceriaProjeto', projetoSocial, idxProjeto);projetoSelecionado = _.find(listaProjetosSociais, ['numero', projetoSocial.numero])"><i class="fa fa-pencil-square-o" aria-hidden="true"></i> Editar</g-button-ujarak>
                                    <g-button-ujarak color="warning" size="button--size-ss" @click.native="duplica(editando.parceria.projetos, idxProjeto)"><i class="fa fa-plus" aria-hidden="true"></i> Duplicar</g-button-ujarak>
                                    <g-button-ujarak color="error" size="button--size-ss" @click.native="remove(editando.parceria.projetos, idxProjeto)"><i class="fa fa-trash" aria-hidden="true"></i> Excluir</g-button-ujarak>
                                  </span>
                                  <span v-else>
                                    <g-button-ujarak color="success" size="button--size-ss" @click.native="edita(editando, 'parceriaProjeto', projeto, idxProjeto);projetoSelecionado = _.find(listaProjetosSociais, ['numero', projetoSocial.numero])"><i class="fa fa-search" aria-hidden="true"></i> Visualizar</g-button-ujarak>
                                  </span>
                                </td>
                              </tr>
                              </tbody>
                            </table>
                          </div>

                        <!-- Totais nos projetos -->
                          <div class="col-md-12 extratoff">
                            <table class="totais">
                              <tr>
                                <td class="centralizado">Qtde Projetos</td>
                                <td class="centralizado">Total Fundação BB</td>
                                <td class="centralizado">Total Parceiros</td>
                                <td class="centralizado">Total</td>
                              </tr>
                              <tr>
                                <td class="centralizado valor">{{ _.get(editando, 'parceria.projetos', []).length }}</td>
                                <td class="centralizado valor">{{ _.sumBy(_.get(editando, 'parceria.projetos', []), function(p) { return _.toNumber(_.get(p, 'orcamento.fbb', 0)) }) | real }}</td>
                                <td class="centralizado valor">{{ _.sumBy(_.get(editando, 'parceria.projetos', []), function(p) { return _.toNumber(_.get(p, 'orcamento.parceiro', 0)) }) | real }}</td>
                                <td class="centralizado valor">{{ _.sumBy(_.get(editando, 'parceria.projetos', []), function(p) { return _.toNumber(_.get(p, 'orcamento.fbb', 0)) + _.toNumber(_.get(p, 'orcamento.parceiro', 0)) }) | real }}</td>
                              </tr>
                            </table>
                          </div>

                        </div>

                        <!-- Criando/Editando projetos vinculados a parceria -->
                        <div class="col-md-12 well" v-if="_.has(editando, 'parceriaProjeto')">
                          <div class="form-group">
                            <div class="">
                              <label class="control-label col-md-2">Número</label>
                              <div class="col-md-2" id="numero_projeto_parceria">
                                <multiselect v-model="projetoSelecionado"
                                             :options="listaProjetosSociais"
                                             :disabled="ehVisualizacao"
                                             :multiple="false"
                                             placeholder="Selecione"
                                             label="numero"
                                             track-by="numero"
                                             :preselect-first="false"
                                             :close-on-select="true"
                                             selectLabel=""
                                             deselectLabel=""
                                             selectedLabel=""
                                             name="numero_projeto_parceria"
                                             v-validate="'required'">
                                  <template slot="option" slot-scope="props" style="width: 500px">
                                    <div><span class="text-muted">{{props.option.situacao}}</span>  {{props.option.numero}} - {{props.option.nome}}</div>
                                  </template>
                                  <template slot="noResult">Nenhum registro localizado!</template>
                                </multiselect>
                              </div>
                            </div>

                            <div class="required-field" :class="{ 'has-error' : errors.first('nome_projeto_parceria')}">
                              <label class="control-label col-md-2">Nome</label>
                              <div class="col-md-6">
                                <input v-model="editando.parceriaProjeto.nome" type="text" name="nome_projeto_parceria" ref="nome_projeto_parceria" class="form-control" v-validate="'required'" :disabled="ehVisualizacao || !_.isNull(editando.parceriaProjeto.numero)"
                                       :title="'<h5>Nome do projeto. Se já existir, ao informar o número o SGP trará o nome e outras informações. Se não existir o projeto, use este campo para dar um nome qualquer ao projeto até sua criação</h5>'" v-tippy="{inertia:true, arrow:true, animation:'perspective', distance:'1', size:'large', arrow:true, delay: [500, 0]}" />
                                <span v-if="errors.first('nome_projeto_parceria')" class="label label-danger"> O nome para o projeto é obrigatório seja ele existente ou sugestão para nome quando for criado</span>
                              </div>
                            </div>
                          </div>

                          <div class="form-group">
                            <div class="">
                              <label class="control-label col-md-2">Situação</label>
                              <div class="col-md-2">
                                <select v-model="editando.parceriaProjeto.situacao" name="situacao_projeto_parceria" class="form-control" :disabled="ehVisualizacao || !_.isNull(editando.parceriaProjeto.numero)"
                                        :title="'<h5>Situação em que se encontra o parceiro</h5>'" v-tippy="{inertia:true, arrow:true, animation:'perspective', distance:'1', size:'large', arrow:true, delay: [500, 0]}">
                                  <option v-for="situacao in situacoesProjeto" :value="situacao.codigo">{{situacao.descricao}}</option>
                                </select>
                              </div>
                              <div class="col-md-2" v-if="!_.isEmpty(projetoSelecionado)"><div class="form-control" style="font-weight: bold;border: 0; background: none">{{projetoSelecionado.situacao}}</div></div>
                            </div>

                            <div class="etiquetaCarregando" v-if="loading.investimentoProjeto"><i class="fa fa-refresh fa-spin"></i> Carregando dados do projeto {{ editando.parceriaProjeto.numero }}...</div>
                            <div class="" v-else-if="_.has(projetoSelecionado, 'cadastro')">
                              <label class="control-label col-md-1">Assinatura</label>
                              <div class="col-md-2">
                                <div class="form-control" style="border: 0; background: none">
                                  <span v-if="_.get(projetoSelecionado, 'cadastro.usu_datcon', '1900').indexOf('1900') === -1">{{projetoSelecionado.cadastro.usu_datcon | moment("L")}}</span>
                                  <span v-else>sem data</span>
                                </div>
                              </div>

                              <label class="control-label col-md-1">Término</label>
                              <div class="col-md-2">
                                <div class="form-control" style="border: 0; background: none">
                                  <span v-if="_.get(projetoSelecionado, 'cadastro.datfpj', '1900').indexOf('1900') === -1">{{projetoSelecionado.cadastro.datfpj | moment("L")}}</span>
                                  <span v-else>sem data</span>
                                </div>
                              </div>
                            </div>

                          </div>

                          <!-- Valores do projeto ------------------------------------------------------------------>
                          <div class="box-body">
                            <table class="table table-condensed table-bordered">
                              <thead class="">
                              <tr>
                                <th class="col-md-3"><span class="etiquetaCarregando" v-if="loading.investimentoProjeto"><i class="fa fa-refresh fa-spin"></i> Carregando valores do {{ editando.parceriaProjeto.numero }}...</span></th>
                                <th class="col-md-3">Fundação BB</th>
                                <th class="col-md-3">Parceiro</th>
                                <th class="col-md-3">Total</th>
                              </tr>
                              </thead>
                              <tbody>
                              <tr class="">
                                <td class="text-bold">Orçado</td>
                                <td>
                                  <money v-model="editando.parceriaProjeto.orcamento.fbb" class="form-control" name="orcadoFBB" :disabled="ehVisualizacao || !_.isNull(editando.parceriaProjeto.numero)"></money>
                                </td>
                                <td>
                                  <money v-model="editando.parceriaProjeto.orcamento.parceiro" class="form-control" name="orcadoParceiro" :disabled="ehVisualizacao || !_.isNull(editando.parceriaProjeto.numero)"></money>
                                </td>
                                <td>
                                  <span>{{(editando.parceriaProjeto.orcamento.fbb + editando.parceriaProjeto.orcamento.parceiro) | real}}</span>
                                </td>
                              </tr>
                              <tr class="">
                                <td class="text-bold">Executado</td>
                                <td>
                                  <money v-model="editando.parceriaProjeto.execucao.fbb" class="form-control" name="executadoFBB" :disabled="ehVisualizacao || !_.isNull(editando.parceriaProjeto.numero)"></money>
                                </td>
                                <td>
                                  <money v-model="editando.parceriaProjeto.execucao.parceiro" class="form-control" name="executadoParceiro" :disabled="ehVisualizacao || !_.isNull(editando.parceriaProjeto.numero)"></money>
                                </td>
                                <td>
                                  <span>{{(editando.parceriaProjeto.execucao.fbb + editando.parceriaProjeto.execucao.parceiro) | real}}</span>
                                </td>
                              </tr>
                              </tbody>
                            </table>
                          </div>


                          <div class="box-body">
                            <div class="box-header">
                              <h3 class="box-title">Municípios - Locais de execução
                                <span class="etiquetaCarregando" v-if="loading.investimentoProjeto"><i class="fa fa-refresh fa-spin"></i> Carregando dados de municípios ...</span>
                              </h3>
                            </div>
                            <div class="form-group">
                              <b-container fluid>
                                <div style="max-height:600px; overflow-y:auto; overflow-x:hidden; margin-bottom: 1rem;">
                                  <b-table show-empty
                                           stacked="md"
                                           :per-page="5"
                                           :bordered="true"
                                           :current-page="tabelaMunicipios.currentPage"
                                           :items="editando.parceriaProjeto.municipios"
                                           :fields="tabelaMunicipios.fields"
                                           empty-text="Nenhum recurso/município cadastrado">

                                    <template slot="fase" scope="row">
                                      {{('' + row.value).substr(0, 1) === '1' ? 'Fundação BB' : ('' + row.value).substr(0, 1) === '5' ? 'Parceiro' : 'Contrapartida'}}
                                    </template>
                                    <template slot="cidade" scope="row">{{row.value}} / {{row.item.uf}}</template>
                                    <template slot="valor" scope="row">{{row.value | real}}</template>
                                  </b-table>

                                  <b-row v-if="editando.parceriaProjeto.municipios.length > 5">
                                    <b-col md="12" class="my-1" right>
                                      <b-pagination :total-rows="editando.parceriaProjeto.municipios.length" :per-page="5" v-model="tabelaMunicipios.currentPage" class="" />
                                    </b-col>
                                  </b-row>

                                </div><!-- limitador vertical da tabela de municipios -->

                              </b-container>
                            </div>
                          </div>

                          <div class="box-body">
                            <div class="box-header">
                              <h3 class="box-title">Enquadramento</h3>
                            </div>
                            <div class="form-group">
                              <!-- Ação Estratégica -->
                              <div class="">
                                <div class="col-lg-4">
                                  <multiselect v-model="editando.parceriaProjeto.enquadramento.acaoEstrategica"
                                               :options="_.filter(listaCategorizadoresEnquadramento, ['grupo', 'ACAO'])"
                                               :disabled="ehVisualizacao"
                                               placeholder="Ação Estratégica"
                                               label="descricao"
                                               track-by="codigo"
                                               name="acao_estrategica_projeto">
                                               <!--v-validate="'required'">-->
                                    <template slot="option" slot-scope="props"></template>
                                  </multiselect>
                                </div>
                              </div>


                              <!-- Tipo da Acao -->
                              <div class="">
                                <div class="col-lg-4">
                                  <multiselect v-model="editando.parceriaProjeto.enquadramento.tipoAcao"
                                               :options="_.filter(listaCategorizadoresEnquadramento, ['grupo', 'TIPO_ACAO'])"
                                               :disabled="ehVisualizacao"
                                               placeholder="Tipo da Ação"
                                               label="descricao"
                                               track-by="codigo"
                                               name="tipo_acao_projeto">
                                    <template slot="option" slot-scope="props"></template>
                                  </multiselect>
                                </div>
                              </div>


                              <!-- Programa Estruturado -->
                              <div class="">
                                <div class="col-lg-4">
                                  <multiselect v-model="editando.parceriaProjeto.enquadramento.programaEstruturado"
                                               :options="_.filter(listaCategorizadoresEnquadramento, ['grupo', 'PROGRAMA'])"
                                               :disabled="ehVisualizacao"
                                               placeholder="Programa Estruturado"
                                               label="descricao"
                                               track-by="codigo"
                                               name="programa_estruturado_projeto">
                                    <template slot="option" slot-scope="props"></template>
                                  </multiselect>
                                </div>
                              </div>


                              <!-- Projeto Superior -->
                              <div class="">
                                <div class="col-lg-4">
                                  <multiselect v-model="editando.parceriaProjeto.enquadramento.projetoSuperior"
                                               :options="_.filter(listaCategorizadoresEnquadramento, ['grupo', 'ACAO'])"
                                               :disabled="ehVisualizacao"
                                               placeholder="Projeto Superior"
                                               label="descricao"
                                               track-by="codigo"
                                               name="projeto_superior_projeto">
                                    <template slot="option" slot-scope="props"></template>
                                  </multiselect>
                                </div>
                              </div>


                              <!-- Cadeia Produtiva -->
                              <div class="">
                                <div class="col-lg-4">
                                  <multiselect v-model="editando.parceriaProjeto.enquadramento.cadeiaProdutiva"
                                               :options="_.filter(listaCategorizadoresEnquadramento, ['grupo', 'CADEIAS_PRODUTIVAS'])"
                                               :disabled="ehVisualizacao"
                                               placeholder="Cadeia Produtiva"
                                               label="descricao"
                                               track-by="codigo"
                                               name="cadeia_produtiva_projeto">
                                    <template slot="option" slot-scope="props"></template>
                                  </multiselect>
                                </div>
                              </div>


                              <!-- Eixo de Atuação -->
                              <div class="">
                                <div class="col-lg-4">
                                  <multiselect v-model="editando.parceriaProjeto.enquadramento.eixoAtuacao"
                                               :options="_.filter(listaCategorizadoresEnquadramento, ['grupo', 'AREA_ESTRATEGICA'])"
                                               :disabled="ehVisualizacao"
                                               placeholder="Eixo de Atuacao"
                                               label="descricao"
                                               track-by="codigo"
                                               name="eixo_atuacao_projeto">
                                    <template slot="option" slot-scope="props"></template>
                                  </multiselect>
                                </div>
                              </div>
                            </div>

                          </div>

                          <div class="form-group">
                            <div class="col-md-10 col-md-offset-2">
                              <button @click="ok(editando, 'parceriaProjeto', editando.parceria.projetos)" v-if="!ehVisualizacao && (!(errors.first('conteudo_historico') || errors.first('tipo_historico')))" type="button" class="btn btn-confirm btn-flat"><i class="fa fa-check" aria-hidden="true"></i> Salvar</button>
                              <button @click.once="cancela(editando, 'parceriaProjeto')" type="button" class="btn btn-back btn-flat"><i class="fa fa-times-circle" aria-hidden="true"></i> Cancelar</button>
                            </div>
                          </div>

                        </div>
                      </div>
                    </div>


                    <!-- Historico da parceria -------------------------------------------------->
                    <div class="form-group" v-show="(_.keys(editando).length === 1 && _.has(editando, 'parceria')) || (_.keys(editando).length > 1 && _.has(editando, 'parceriaHistorico'))">
                      <div class="box-body">
                        <div class="box-header">
                          <h3 class="box-title">Histórico da parceria</h3>
                        </div>
                        <!-- Lista Historico da Parceira -->
                        <div class="form-group" v-if="!_.has(editando, 'parceriaHistorico')">
                          <div class="col-md-12">
                            <table class="table table-condensed table-bordered">
                              <thead class="">
                              <tr>
                                <th>Tipo</th>
                                <th>Informação</th>
                                <th>Usuário</th>
                                <th style="text-align: center; width: 120px">Data</th>
                                <th v-bind:style="'text-align: center;width: ' + (ehVisualizacao ? 120 : 260) + 'px;'">
                                  <g-button-ujarak color="primary" size="button--size-ss" @click.native="edita(editando, 'parceriaHistorico', _.cloneDeep(historico), -1);editando.parceriaHistorico.data=new Date()" v-if="!ehVisualizacao"><i class="fa fa-plus-circle" aria-hidden="true"></i> Incluir</g-button-ujarak >
                                </th>
                              </tr>
                              </thead>
                              <tbody v-if="(_.get(editando, 'parceria.historicos', [])).length === 0" class=""><tr><td colspan="3">Nenhum histórico adicionado ainda!</td></tr></tbody>
                              <tbody v-else class="">
                              <tr v-for="(historico, idxHistorico) in _.get(editando, 'parceria.historicos', [])" class="">
                                <td class="text-bold">{{_.get(_.find(listaTipos, ['codigo', historico.tipo]), 'descricao')}}</td>
                                <td><span v-html="historico.conteudo"></span></td>
                                <td>
                                  <div class="truncar" style="width: 100px;" v-if="_.has(historico, 'usuario.ds_nome_usuario')" :title="'<h5>' + historico.usuario.ds_nome_usuario + ' (id: ' + historico.usuario.id + ')</h5>'" v-tippy="{inertia:true, arrow:true, animation:'perspective', distance:'1', size:'large', arrow:true, delay: [500, 0]}">
                                    {{historico.usuario.ds_nome_usuario}}
                                  </div>
                                </td>
                                <td class="text-center">
                                  {{historico.data | moment("L")}}
                                  <span v-if="!_.isNull(historico.prazo)">
                                    <p class="label label-warning">{{historico.prazo | moment("L")}}</p>
                                  </span>
                                </td>
                                <td style="text-align: center;max-width: 200px;">
                                  <span v-if="!ehVisualizacao">
                                    <g-button-ujarak color="primary" size="button--size-ss" @click.native="edita(editando, 'parceriaHistorico', historico, idxHistorico)"><i class="fa fa-pencil-square-o" aria-hidden="true"></i> Editar</g-button-ujarak>
                                    <g-button-ujarak color="warning" size="button--size-ss" @click.native="duplica(editando.parceria.historicos, idxHistorico)"><i class="fa fa-plus" aria-hidden="true"></i> Duplicar</g-button-ujarak>
                                    <g-button-ujarak color="error" size="button--size-ss" @click.native="remove(editando.parceria.historicos, idxHistorico)"><i class="fa fa-trash" aria-hidden="true"></i> Excluir</g-button-ujarak>
                                  </span>
                                  <span v-else>
                                    <g-button-ujarak color="success" size="button--size-ss" @click.native="edita(editando, 'parceriaHistorico', historico, idxHistorico)"><i class="fa fa-search" aria-hidden="true"></i> Visualizar</g-button-ujarak>
                                  </span>
                                </td>
                              </tr>
                              </tbody>
                            </table>
                          </div>
                        </div>

                        <!-- Criando/Editando histórico da parceria -->
                        <div class="col-md-12 well" v-if="_.has(editando, 'parceriaHistorico')">
                          <div class="form-group">
                            <div class="required-field" :class="{ 'has-error' : errors.first('tipo_historico_parceria')}">
                              <label class="control-label col-md-2">Tipo</label>
                              <div class="col-md-2">
                                <select v-model="editando.parceriaHistorico.tipo" type="text" name="tipo_historico_parceria" ref="tipo_historico_parceria" class="form-control" v-validate="'required'" :disabled="ehVisualizacao"
                                        :title="'<h5>O tipo do histórico permite definir ações de cobrança, lembrete, auditagem etc</h5>'" v-tippy="{inertia:true, arrow:true, animation:'perspective', distance:'1', size:'large', arrow:true, delay: [500, 0]}">
                                  <option v-for="tipo in listaTipos" :value="tipo.codigo">{{tipo.descricao}}</option>
                                </select>
                                <span v-if="errors.first('tipo_historico_parceria')" class="label label-danger"> O tipo do histórico dessa parceria é obrigatório</span>
                              </div>
                            </div>

                            <div class="">
                              <label class="control-label col-md-1">Data</label>
                              <div class="col-md-2">
                                <datepicker  name="data_historico_parceria" v-model="editando.parceriaHistorico.data" input-class="form-control datepicker" :disabled="ehVisualizacao"
                                             :language="$datePickerPtBR" maxlength="20" :use-utc="true" placeholder="__ /__ /____" @input="numeroAtualizacao++"
                                             format="dd/MM/yyyy" v-validate="''">
                                </datepicker>
                              </div>
                            </div>

                            <div class="">
                              <label class="control-label col-md-1">Prazo</label>
                              <div class="col-md-2">
                                <datepicker  name="prazo_historico_parceria" v-model="editando.parceriaHistorico.prazo" input-class="form-control datepicker" :disabled="ehVisualizacao"
                                             :language="$datePickerPtBR" maxlength="20" :use-utc="true" placeholder="__ /__ /____" @input="numeroAtualizacao++"
                                             :disabled-dates="{to: new Date(editando.parceriaHistorico.data) }"
                                             format="dd/MM/yyyy" v-validate="''">
                                </datepicker>
                              </div>
                            </div>
                          </div>

                          <div class="form-group">
                            <div class="required-field" :class="{ 'has-error' : errors.first('conteudo_historico_parceria')}">
                              <div class="col-md-12">
                                <quill-editor
                                  v-model="editando.parceriaHistorico.conteudo"
                                  ref="conteudo_historico_parceria"
                                  :disabled="ehVisualizacao"
                                  :options="quillOptionsCompleto"
                                  :title="'<h5>Descreva o que foi feito ou que será feito, seja um contato, reunião, assinatura de instrumento etc</h5>'" v-tippy="{inertia:true, arrow:true, animation:'perspective', distance:'1', size:'large', arrow:true, delay: [500, 0]}"
                                  name="conteudo_historico_parceria">
                                </quill-editor>
                                <span v-if="errors.first('conteudo_historico_parceria')" class="label label-danger"> Registre algum conteúdo para histórico da parceria</span>
                              </div>
                            </div>

                          </div>

                          <div class="form-group">
                            <div class="col-md-10 col-md-offset-2">
                              <button @click="ok(editando, 'parceriaHistorico', editando.parceria.historicos)" v-if="!ehVisualizacao && (!(errors.first('conteudo_historico') || errors.first('tipo_historico')))" type="button" class="btn btn-confirm btn-flat"><i class="fa fa-check" aria-hidden="true"></i> Ok</button>
                              <button @click.once="cancela(editando, 'parceriaHistorico')" type="button" class="btn btn-back btn-flat"><i class="fa fa-times-circle" aria-hidden="true"></i> Cancelar</button>
                            </div>
                          </div>

                        </div>
                      </div>
                    </div>


                    <div class="form-group" v-show="_.has(editando, 'parceria') && _.keys(editando).length === 1">
                      <div class="col-md-10 col-md-offset-2">
                        <button @click="ok(editando, 'parceria', parceiro.parcerias)" v-if="!ehVisualizacao && (!(errors.first('nome_parceria') || errors.first('parceria_situacao')))" type="button" class="btn btn-confirm btn-flat"><i class="fa fa-check" aria-hidden="true"></i> Ok</button>
                        <button @click.once="cancela(editando, 'parceria')" type="button" class="btn btn-back btn-flat"><i class="fa fa-times-circle" aria-hidden="true"></i> Cancelar</button>
                      </div>
                    </div>

                  </div>

                </div>
                <div v-else class="text-danger">
                  Crie o parceiro para poder cadastrar demais dados
                </div>

                <div v-show="loading.tela" class="overlay" style="position: absolute; top: 0px; left: 0px; width: 100%; height: 100%; display: block;"><i class="fa fa-refresh fa-spin"></i></div>

              </div>

            </div>

          </div>

        </div>

      </div>

    </section>


  </div>

</template>


<script>
  /* eslint-disable no-unused-vars */
  import { mapGetters } from 'vuex'
  import UploadDocumentosOnline from './UploadDocumentosOnline'
  // import moment from 'moment'

  export default {
    components: {
      UploadDocumentosOnline
    },
    name: 'EditaArticulacao',
    data () {
      return {
        id: null,
        idCriacao: null,
        numeroAtualizacao: 0,
        parceiroTemp: {},
        parceiro: {
          nome: null,
          cnpj: null,
          dicor: null,
          parcerias: [],
          sede: {
            codigoIbge: null,
            uf: null,
            municipio: null
          },
          contatos: [],
          abrangencias: [],
          historicos: [],
          bb: {
            prefixo: null,
            nome: null,
            contato: null,
            telefone: null,
            email: null
          },
          enquadramentos: [],
          orcamento: {
            fbb: 0,
            parceiro: 0,
            outro: 0
          }
        },
        contato: {
          nome: null,
          cargo: null,
          telefone: null,
          telefone2: null,
          email: null
        },
        abrangencia: {
          tipo: null,
          codigo: null,
          descricao: null
        },
        historico: {
          tipo: null,
          conteudo: null,
          usuario: null,
          data: null,
          prazo: null
        },
        parceria: {
          nome: null,
          situacao: 'ATIVA',
          enquadramentos: [],
          projetos: [],
          instrumentos: [],
          historicos: [],
          abrangencias: [],
          orcamento: {
            fbb: 0,
            parceiro: 0,
            outro: 0
          }
        },
        projeto: {
          nome: null,
          numero: null,
          idPropostaSGP: null,
          situacao: null,
          enquadramento: {
            acaoEstrategica: null,
            tipoAcao: null,
            programaEstruturado: null,
            projetoSuperior: null,
            cadeiaProdutiva: null,
            eixoAtuacao: null
          },
          orcamento: {
            fbb: 0,
            parceiro: 0
          },
          execucao: {
            fbb: 0,
            parceiro: 0
          },
          historicos: [],
          municipios: [],
          abrangencias: []
        },
        instrumento: {
          nome: null,
          dataAssinatura: null,
          dataVigencia: null,
          situacao: null,
          anexos: [],
          orcamento: {
            fbb: 0,
            parceiro: 0,
            outro: 0
          }
        },
        municipio: {
          fase: null,
          codigoIBGE: null,
          valor: 0,
          cidade: null,
          uf: null
        },
        anexo: {
          ds_nome_arquivo: ''
        },
        editando: {},
        edicao: {
          codigo: null,
          mensagem: ''
        },
        situacoesParceria: [{'codigo': 'EM_NEGOCIACAO', 'descricao': 'Em Negociação'}, {'codigo': 'ATIVA', 'descricao': 'Ativa'}, {'codigo': 'ENCERRADA', 'descricao': 'Encerrada'}],
        situacoesProjeto: [{'codigo': 'NAO_CONTRATADO', 'descricao': 'Não contratado ainda'}, {'codigo': 'ATIVO', 'descricao': 'Ativo'}, {'codigo': 'EM_ENCERRAMENTO', 'descricao': 'Em Encerramento'}, {'codigo': 'ENCERRADA', 'descricao': 'Encerrada'}, {'codigo': 'CANCELADO', 'descricao': 'Cancelado'}],
        listaAbrangencias: [{'grupo': 'País', 'lista': [{'tipo': 'pais', 'codigo': 'BR', 'descricao': 'Abrangência Nacional'}]}, {'grupo': 'Regiões', 'lista': [{'tipo': 'regiao', codigo: 'CO', descricao: 'Centro-Oeste'}, {'tipo': 'regiao', codigo: 'NE', descricao: 'Nordeste'}, {'tipo': 'regiao', codigo: 'NO', descricao: 'Norte'}, {'tipo': 'regiao', codigo: 'SE', descricao: 'Sudeste'}, {'tipo': 'regiao', codigo: 'SU', descricao: 'Sul'}]}, {'grupo': 'UF', 'lista': [{'tipo': 'uf', codigo: 'AC', descricao: 'Acre'}, {'tipo': 'uf', codigo: 'AL', descricao: 'Alagoas'}, {'tipo': 'uf', codigo: 'AP', descricao: 'Amapá'}, {'tipo': 'uf', codigo: 'AM', descricao: 'Amazonas'}, {'tipo': 'uf', codigo: 'BA', descricao: 'Bahia'}, {'tipo': 'uf', codigo: 'CE', descricao: 'Ceará'}, {'tipo': 'uf', codigo: 'DF', descricao: 'Distrito Federal'}, {'tipo': 'uf', codigo: 'ES', descricao: 'Espírito Santo'}, {'tipo': 'uf', codigo: 'GO', descricao: 'Goiás'}, {'tipo': 'uf', codigo: 'MA', descricao: 'Maranhão'}, {'tipo': 'uf', codigo: 'MT', descricao: 'Mato Grosso'}, {'tipo': 'uf', codigo: 'MS', descricao: 'Mato Grosso do Sul'}, {'tipo': 'uf', codigo: 'MG', descricao: 'Minas Gerais'}, {'tipo': 'uf', codigo: 'PA', descricao: 'Pará'}, {'tipo': 'uf', codigo: 'PB', descricao: 'Paraíba'}, {'tipo': 'uf', codigo: 'PR', descricao: 'Paraná'}, {'tipo': 'uf', codigo: 'PE', descricao: 'Pernambuco'}, {'tipo': 'uf', codigo: 'PI', descricao: 'Piauí'}, {'tipo': 'uf', codigo: 'RJ', descricao: 'Rio de Janeiro'}, {'tipo': 'uf', codigo: 'RN', descricao: 'Rio Grande do Norte'}, {'tipo': 'uf', codigo: 'RS', descricao: 'Rio Grande do Sul'}, {'tipo': 'uf', codigo: 'RO', descricao: 'Rondônia'}, {'tipo': 'uf', codigo: 'RR', descricao: 'Roraima'}, {'tipo': 'uf', codigo: 'SC', descricao: 'Santa Catarina'}, {'tipo': 'uf', codigo: 'SP', descricao: 'São Paulo'}, {'tipo': 'uf', codigo: 'SE', descricao: 'Sergipe'}, {'tipo': 'uf', codigo: 'TO', descricao: 'Tocantins'}]}, {'grupo': 'Municípios', 'lista': [{'tipo': 'municipio', 'codigo': '', 'descricao': '<i class=\'fa fa-refresh fa-spin\'></i> Carregando municípios...', $isDisabled: true}]}],
        listaTipos: [{'codigo': 'CONTATO', 'descricao': 'Contato'}, {'codigo': 'REUNIAO', 'descricao': 'Reunião'}, {'codigo': 'COBRANCA', 'descricao': 'Cobrança'}, {'codigo': 'TELEFONEMA', 'descricao': 'Telefonema'}],
        listaInstrumentos: [{'codigo': 'ACORDO_COOPERACAO', 'descricao': 'Acordo de Cooperação Técnica'}, {'codigo': 'DOACAO_MODAL', 'descricao': 'Doação Modal'}, {'codigo': 'CONTRATO', 'descricao': 'Contrato'}],
        listaSituacoesInstrumento: [{'codigo': 'ELABORACAO', 'descricao': 'Em elaboração'}, {'codigo': 'PENDENTE_ASSINATURA', 'descricao': 'Pendente Assinatura'}, {'codigo': 'APROVADO', 'descricao': 'Aprovado'}],
        listaProjetosSociais: [],
        listaDependenciasBB: [],
        listaCategorizadoresEnquadramento: [],
        loading: {
          tela: false,
          abrangencia: false,
          parcerias: false,
          projetos: false,
          investimentoProjeto: false,
          enquadramento: false,
          dependenciasBB: false
        },
        salvaParceiro: {
          salvamentoAutomaticoAtivo: false,
          statusSalvamento: 'AGUARDANDO', // 'AGUARDANDO', 'PROCESSANDO', 'FEITO', 'ERRO'
          idTimerSalvamentoAutomatico: null,
          tempoSalvamentoAutomatico: 30000, // A cada 1 min
          contador: 0
        },
        projetoSelecionado: null,
        tabelaMunicipios: {
          fields: [
            { key: 'fase', label: 'Origem', sortable: true, thStyle: 'width: 20%; text-align: center', class: 'text-center' },
            { key: 'cidade', label: 'Município', sortable: true, thStyle: 'width: 50%; text-align: left', class: 'text-left' },
            { key: 'valor', label: 'Valor Total', sortable: true, thStyle: 'width: 30%; text-align: rigth', class: 'text-rigth' }
          ],
          currentPage: 1
        },
        quillOptionsCompleto: {
          theme: 'bubble'
        },
        ehVisualizacao: false,
        alturaContentWrapper: window.innerHeight - 151
      }
    },
    watch: {
      projetoSelecionado: function () {
        this.selecionaProjeto()
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
      this.id = this.$route.params.id
      this.ehVisualizacao = this.$route.params.visualizacao || false
      if (!_.isNull(this.id)) {
        this.carregaParceiro()
      }
      this.listaMunicipios()
      this.listaAgencias()
      this.listaProjetos()
      this.listaCategorizadores()
      if (!this.ehVisualizacao) {
        this.salvamentoAutomatico()
      }
      let vm = this
      window.addEventListener('resize', function () {
        vm.alturaContentWrapper = window.innerHeight - 151
      })
    },
    beforeDestroy () {
      clearInterval(this.salvaParceiro.idTimerSalvamentoAutomatico) // "Desligar" o salvamento automático
    },
    methods: {
      carregaParceiro () {
        this.loading.tela = true
        axiosLaravel.post('articulacao/edita/', {'id': this.id}).then((response) => {
          if (_.has(response.data, 'codigo') && response.data.codigo === 'OK') {
            this.id = response.data.retorno.id
            this.idCriacao = response.data.retorno.fk_criacao
            this.parceiro = response.data.retorno.dados
            this.parceiroTemp = _.cloneDeep(this.parceiro) // Este temp vai ficar atualizado a cada salvamento para comparar se houve ou não alteração entre um salvamento e outro
            this.salvaParceiro.salvamentoAutomaticoAtivo = true
            this.salvaParceiro.contador = 1
            this.atualizaProjetos()
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
        this.salvaParceiro.idTimerSalvamentoAutomatico = setInterval(() => {
          // Somente salva automático se a funcionalidade estiver ativa, se já foi salvo alguma vez e se houve alteração entre o salvamento atual e o anterior
          if (this.salvaParceiro.salvamentoAutomaticoAtivo && this.salvaParceiro.contador > 0 && !_.isEqual(this.parceiroTemp, this.parceiro)) {
            this.salvarEdicao()
          }
        }, this.salvaParceiro.tempoSalvamentoAutomatico)
      },
      salvarEdicao (redirecionarChave = null) {
        console.log('salvarEdicao')
        if (this.errors.items.length === 0) {
          this.$validator.validateAll().then(validado => {
            if (validado && this.errors.items.length === 0) {
              this.salvaParceiro.statusSalvamento = 'PROCESSANDO'
              let rota = _.isNull(this.id) ? 'articulacao/cria/' : 'articulacao/salva/'
              this.loading.tela = !_.isNull(redirecionarChave)
              // Criando/Salvando sumário
              axiosLaravel.post(rota, {'id': this.id, 'articulacao': this.parceiro}).then((response) => {
                if (_.has(response.data, 'codigo') && response.data.codigo === 'OK') {
                  this.salvaParceiro.statusSalvamento = 'FEITO'
                  setTimeout(() => {
                    this.salvaParceiro.statusSalvamento = 'AGUARDANDO'
                    this.salvaParceiro.salvamentoAutomaticoAtivo = true // Depois de salvo manualmente a primeira vez ele já ativa para as demais focarem automaticas
                    this.salvaParceiro.contador++ // É só pra registrar a qantidade de vezes que já foi salvo
                    console.log('salvamento feito! contador', this.salvaParceiro.contador)
                  }, 2000)
                  this.id = response.data.retorno.id
                  this.idCriacao = response.data.retorno.fk_criacao
                  this.parceiro = _.cloneDeep(response.data.retorno.dados)
                  this.parceiroTemp = _.cloneDeep(this.parceiro) // Copia o que foi salvo para um temp que servirá de comparação para o salvamento automático
                } else {
                  this.aviso(response.data)
                }
                this.loading.tela = false
              })
                .catch((error) => {
                  this.$root.trataErro(error)
                  this.salvaParceiro.statusSalvamento = 'ERRO'
                })
            }
          })
        }
      },
      listaMunicipios () {
        axiosLaravel.get('formulario/municipios/lista/').then((response) => {
          // console.log('listaAbrangencias', _.clone(this.listaAbrangencias))
          let municipios = []
          response.data.forEach((municipio) => {
            municipios.push({'codigo': municipio.codrai, 'descricao': municipio.sigufs + ' / ' + municipio.nomcid, 'tipo': 'municipio'})
          })
          _.set(this.listaAbrangencias, '[3].lista', municipios)
          // console.log('listaAbrangencias', _.clone(this.listaAbrangencias))
        })
          .catch((error) => {
            this.$snotify.clear()
            this.$root.trataErro(error)
          })
      },
      listaCategorizadores () {
        this.loading.enquadramento = true
        axiosLaravel.get('categorizadores/').then((response) => {
          this.listaCategorizadoresEnquadramento = _.orderBy(response.data, ['grupo', 'descricao'], ['asc', 'asc'])
          this.loading.enquadramento = false
        })
          .catch((error) => {
            this.loading.enquadramento = false
            this.$snotify.clear()
            this.$root.trataErro(error)
          })
      },
      listaAgencias () {
        this.loading.dependenciasBB = true
        axiosLaravel.get('articulacao/agencias/').then((response) => {
          if (_.has(response.data, 'codigo') && response.data.codigo === 'OK') {
            this.listaDependenciasBB = response.data.retorno
          } else {
            this.aviso(response.data)
          }
          this.loading.dependenciasBB = false
        })
          .catch((error) => {
            this.loading.dependenciasBB = false
            this.$snotify.clear()
            this.$root.trataErro(error)
          })
      },
      atualizaProjetos () {
        this.parceiro.parcerias.forEach((parceria) => {
          parceria.projetos.forEach((projeto) => {
            if (!_.isEmpty(projeto.numero)) {
              console.log('projeto', projeto)
              this.loading.investimentoProjeto = true
              axiosLaravel.post('articulacao/dados/projeto', {'projeto': projeto.numero, 'dados': ['orcamento', 'executado', 'cadastro']}).then((response) => {
                console.log('dados projeto', response.data)
                if (_.has(response.data, 'codigo') && response.data.codigo === 'OK') {
                  let orcamento = response.data.retorno.orcamento
                  projeto.orcamento.fbb = orcamento.valorFBB
                  projeto.orcamento.parceiro = orcamento.valorParceiros
                  let executado = response.data.retorno.executado
                  projeto.execucao.fbb = executado.ExecutadoRP
                  projeto.execucao.parceiro = executado.ExecutadoRT
                  let cadastro = response.data.retorno.cadastro
                  projeto.situacao = cadastro.sitprj === 'ENC' ? 'ENCERRADA' : (cadastro.sitprj === 'ETO' ? 'EM_ENCERRAMENTO' : (_.includes(['ANU', 'CAN', 'REP', 'IND'], cadastro.sitprj) ? 'CANCELADO' : (_.includes(['ANN', 'DEF'], cadastro.sitprj) ? 'NAO_CONTRATADO' : ('ATIVO'))))
                  this.$forceUpdate()
                }
                this.loading.investimentoProjeto = false
              })
                .catch((error) => {
                  this.$root.trataErro(error)
                  this.loading.investimentoProjeto = false
                })
            }
          })
        })
      },
      selecionaProjeto () {
        let selecionado = this.projetoSelecionado
        console.log('selecionado', selecionado)
        if (_.has(selecionado, 'numero')) {
          this.loading.investimentoProjeto = true
          this.editando.parceriaProjeto.numero = selecionado.numero
          this.editando.parceriaProjeto.nome = selecionado.nome
          axiosLaravel.post('articulacao/dados/projeto', {'projeto': selecionado.numero, 'dados': ['orcamento', 'executado', 'cadastro', 'categorizadores', 'municipios']}).then((response) => {
            console.log('dados projeto', response.data)
            if (_.has(response.data, 'codigo') && response.data.codigo === 'OK') {
              let orcamento = response.data.retorno.orcamento
              this.editando.parceriaProjeto.orcamento.fbb = orcamento.valorFBB
              this.editando.parceriaProjeto.orcamento.parceiro = orcamento.valorParceiros
              let executado = response.data.retorno.executado
              this.editando.parceriaProjeto.execucao.fbb = executado.ExecutadoRP
              this.editando.parceriaProjeto.execucao.parceiro = executado.ExecutadoRT
              let cadastro = response.data.retorno.cadastro
              this.editando.parceriaProjeto.situacao = cadastro.sitprj === 'ENC' ? 'ENCERRADA' : (cadastro.sitprj === 'ETO' ? 'EM_ENCERRAMENTO' : (_.includes(['ANU', 'CAN', 'REP', 'IND'], cadastro.sitprj) ? 'CANCELADO' : (_.includes(['ANN', 'DEF'], cadastro.sitprj) ? 'NAO_CONTRATADO' : ('ATIVO'))))
              this.editando.parceriaProjeto.municipios = response.data.retorno.municipios
              this.projetoSelecionado.cadastro = _.clone(cadastro)
              this.$forceUpdate()
            }
            this.loading.investimentoProjeto = false
          })
            .catch((error) => {
              this.$root.trataErro(error)
              this.loading.investimentoProjeto = false
            })
        } else {
          this.editando.parceriaProjeto.numero = null
          this.editando.parceriaProjeto.nome = null
          this.editando.parceriaProjeto.orcamento.fbb = 0
          this.editando.parceriaProjeto.orcamento.parceiro = 0
        }
      },
      listaProjetos () {
        this.loading.projetos = true
        axiosLaravel.get('articulacao/projetos').then((response) => {
          console.log('listaProjetos', response.data)
          if (_.has(response.data, 'codigo') && response.data.codigo === 'OK') {
            this.listaProjetosSociais = response.data.retorno
            this.$forceUpdate()
          }
          this.loading.projetos = false
        })
          .catch((error) => {
            this.$root.trataErro(error)
            this.loading.projetos = false
          })
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
      dadosUsuarioHistorico (destino) {
        console.log('dadosUsuarioHistorico')
        _.set(destino, 'usuario.id', this.usuarioLogado.id)
        _.set(destino, 'usuario.ds_login', this.usuarioLogado.ds_login)
        _.set(destino, 'usuario.ds_nome_usuario', this.usuarioLogado.ds_nome_usuario)
      },
      //
      ok (objetoPai, local, destino, apagarEdicao = true) {
        console.log('ok')
        // Pega o idx adicionado na edição e depois exclui o idx do objeto
        let idx = _.get(objetoPai, [local, 'idx'])
        let valor = _.clone(_.get(objetoPai, [local]))
        _.unset(valor, 'idx')
        // Se for um registro existente (alteração idx = X) ou novo (inclusão idx = -1)
        if (idx >= 0) {
          destino[idx] = valor
        } else {
          destino.push(valor)
        }
        if (apagarEdicao) {
          this.cancela(objetoPai, local)
        }
      },
      cancela (objetoPai, local) {
        console.log('cancela :: objetoPai, local', objetoPai, local)
        _.unset(objetoPai, local)
        this.$forceUpdate()
      },
      edita (objetoPai, local, modelo, idx) {
        console.log('edita :: idx, objetoPai, local, modelo', idx, objetoPai, local, modelo)
        _.set(objetoPai, local, modelo)
        _.set(objetoPai, [local, 'idx'], idx) // Adiciona o idx no objeto durante a edição para ver se trata de alteração ou inclusão
        this.$forceUpdate()
      },
      duplica (lista, idx) {
        console.log('duplica :: lista, idx, ', lista, idx)
        lista.push(_.clone(lista[idx]))
        this.$forceUpdate()
      },
      remove (lista, idx) {
        console.log('remove :: lista, idx, ', lista, idx)
        lista.splice(idx, 1)
        this.$forceUpdate()
      },
      situacaoInstrumento (instrumento) {
        let situacao = {'texto': 'Situaçao não prevista', 'classe': ''}
        if ((_.isNull(instrumento.dataAssinatura) && _.isNull(instrumento.dataVigencia)) || (!_.isNull(instrumento.dataAssinatura) && new Date() < instrumento.dataAssinatura)) {
          situacao = {'texto': 'Em Negociação', 'classe': 'label label-primary'}
        } else if (!_.isNull(instrumento.dataAssinatura) && new Date() >= instrumento.dataAssinatura && (_.isNull(instrumento.dataVigencia) || new Date() <= instrumento.dataVigencia)) {
          situacao = {'texto': 'Ativo', 'classe': 'label label-success'}
        } else if (!_.isNull(instrumento.dataVigencia) && new Date() > instrumento.dataVigencia) {
          situacao = {'texto': 'Encerrado', 'classe': 'label label-danger'}
        }
        return situacao
      }
    }
  }
</script>

<style>
  #numero_projeto_parceria .multiselect__content-wrapper {
    width: 300px;
  }
</style>

