<template>
    <div class="content-wrapper" style="min-height: 870px;">

      <vue-headful :title="'SGP - ' + (_.isUndefined(chamado.id) ? 'Abrindo chamado' : 'Chamado de n° ' + chamado.id)"/>

      <div class="fade-transition" style=""><!-- content header (page header) -->
          <!--Breadcrumb-->
        <section class="content-header">
          <h1>Chamados</h1>
          <b-breadcrumb :items="[{
          text: 'Inicial',
          href: '/'
          }, {
          text: 'Cadastro',
          href: '#'
          }, {
          text: 'Chamados',
          active: true
          }]"/>
        </section>

        <!-- main content -->
        <!-- <section class="content" v-if="usuarioLogado.userType === 'FUNDACAO' || usuarioLogado.entidade.ds_cnpj === chamado.entidade.ds_cnpj"> -->
          <section class="content">
          <div class="row" id="row1">
            <div class="col-md-12">
             <div class="">
               <div class="box box-primary">
              <div class="box-header with-border">
                <h3 class="box-title"><i class="fa fa-pencil" aria-hidden="true"></i> Editando Chamado</h3>
              </div>
                 <div class="text-left box-header">
                   <a href="" v-if="esconderDados=== false" @click.prevent="esconderDados = true"><i class="fa fa-caret-down" aria-hidden="true"></i> Mostrar detalhes do Chamado - <span  v-if="chamado.id" style="color: steelblue;font-weight: bold;">{{chamado.id}} ({{chamado.status.status}})</span></a>
                   <a href="" v-if="esconderDados === true" @click.prevent="esconderDados = false"><i class="fa fa-caret-up" aria-hidden="true"></i> Ocultar detalhes do Chamado</a>
                 </div>
              <div class="box-body" >
                <div v-show="loading.show" class="overlay" style="position: absolute; top: 0px; left: 0px; width: 100%; height: 100%; display: block;">
                  <i class="fa fa-refresh fa-spin"></i>
                </div>
                <div class="col-md-12" v-if="esconderDados === true">
                  <form name="frmCommonRegister" class="form-horizontal" novalidate >
                    <div class="col-md-7" id="column1">
                    <div class="form-group required-field">
                      <label for="id" class="col-md-2">N° Chamado:</label>
                      <div class="col-md-4">
                      <input v-validate="{required: true}" v-model="chamado.id" name="numerochamado" :disabled="true" class="form-control" type="text" minlength="1" ng-maxlength="255">
                    </div>
                      <div class="row" style="position: relative;  top: 5px; color: #0f7b9f" v-if="diasEmAberto >= 0 && usuarioLogado.userType === 'FUNDACAO' && chamado.status.id !== 5"> Aberto há: <b>{{diasEmAberto}}</b> <span v-if="diasEmAberto > 1">dias</span><span v-else>dia</span>, <b>{{horasEmAberto}}</b>h <b>{{minutosEmAberto}}</b> min
                      </div>
                  </div>


                  <div class="form-group required-field">
                    <label for="parametro" class="col-md-2">Descrição:</label>
                    <div class="col-md-7">
                      <textarea v-model="chamado.descricao" style="height:200px;resize:none;border: #0a568c;border: 1px solid #a8a3a5;" name="descricao" class="form-control" :disabled="true"
                                v-validate="'required'"></textarea>
                    </div>
                  </div>

                  <div class="form-group required-field">
                        <label v-if="chamado.projeto || chamado.processo_id" for="projeto" class="col-md-2">Projeto / ID:</label>
                        <div class="col-md-3" v-if="chamado.projeto || chamado.processo_id">
                          <div class="input-group">
                            <input v-model="chamado.projeto"  name="usuarioNome" class="form-control" :disabled="true"/>
                          </div>
                        </div>
                    <div class="col-md-3" v-if="chamado.projeto || chamado.processo_id">
                      <div class="input-group">
                        <input v-model="chamado.processo_id"  name="processo" class="form-control" :disabled="true"/>
                      </div>
                    </div>
                  </div>

                  <div v-if="usuarioLogado.userType === 'FUNDACAO' && (chamado.projeto || chamado.processo_id)" class="form-group required-field">
                        <label for="carteira" class="col-md-2">Carteira:</label>
                        <div class="col-md-7">
                          <div class="input-group">
                            <input v-model="carteira" name="usuarioNome" class="form-control" :disabled="true"/>
                          </div>
                        </div>                    
                  </div>

                  <div class="form-group required-field">
                    <label for="parametro" class="col-md-2">Aberto por:</label>
                    <div class="col-md-4">
                      <div class="input-group">
                      <input v-model="usuarioNome"  name="usuarioNome" class="form-control" :disabled="true"
                                v-validate="'required'"/>
                      </div>
                    </div>
                    <label style="position: relative;  top: 5px; " v-if="chamado.usuario_abertura && !_.isNull(chamado.usuario_abertura.fk_entidade)" for="parametro" class="col-md-3">Representante Legal?</label>
                    <div  style="position: relative;  top: 6px; right: 70px ;color: #0f7b9f"  v-if="chamado.usuario_abertura && !_.isNull(chamado.usuario_abertura.fk_entidade)">
                     <span v-if="chamado.dirigente && chamado.dirigente.bt_representante_legal === 1" style="color: #0a568c"
                           :title="'<h5><span style=\'color: #7adddd\'>Início Mandato: </span>' + formata(chamado.dirigente.dt_inicio_mandato) + '</h5>' +
                              '<h5><span style=\'color: #7adddd\'>&nbsp&nbsp&nbspFim Mandato: </span>' + formata(chamado.dirigente.dt_fim_mandato) + '</h5>'"
                           v-tippy="{ inertia : true, arrow : true,  animation : 'perspective', distance:'1', size: 'large', arrow : true }">
                       <b>Sim</b>
                     </span>
                      <span v-if="chamado.dirigente && chamado.dirigente.bt_representante_legal === 0"  style="color: #0a568c"
                            :title="'<h5><span style=\'color: #7adddd\'>Início Mandato: </span>' + formata(chamado.dirigente.dt_inicio_mandato) + '</h5>' +
                              '<h5><span style=\'color: #7adddd\'>&nbsp&nbsp&nbspFim Mandato: </span>' + formata(chamado.dirigente.dt_fim_mandato) + '</h5>'"
                            v-tippy="{ inertia : true, arrow : true,  animation : 'perspective', distance:'1', size: 'large', arrow : true }">
                        <b>Não</b>
                     </span>
                    </div>
                  </div>
                  <div v-if="chamado.entidade" class="form-group required-field">
                    <label for="parametro" class="col-md-2">Entidade:</label>
                    <div class="col-md-7">
                      <div class="input-group">
                      <input v-model="chamado.entidade.ds_nome"  name="entidade" class="form-control" :disabled="true"
                                v-validate="'required'"/>
                      </div>
                    </div>
                  </div>


                  <div class="form-group required-field" :class="{ 'has-error' : errors.first('dataInicial')}">
                    <label for="data_inclusao" class="col-md-2">Data abertura: </label>
                    <div class="col-md-7">
                      <div class="input-group">

                        <input
                          type="text"
                          ref="dtInicial"
                          name="dataInicial"
                          v-model="chamado.data_inclusao"
                          class="form-control"
                          data-vv-as="Data Inclusão"
                          :disabled="true"
                        >
                      </div>
                      <span v-if="errors.first('dataInicial')" class="label label-danger"> {{ errors.first('dataInicial') }}</span>
                    </div>
                  </div>

                   <div class="form-group required-field" v-if="chamado.usuario_atendimento">
                     <label for="parametro" class="col-md-2">Em atendimento por:</label>
                     <div class="col-md-7">
                       <div class="input-group">
                         <input v-model="chamado.usuario_atendimento.ds_nome_usuario"  name="usuarioNome" class="form-control" :disabled="true"
                                v-validate="'required'"/>
                       </div>
                     </div>
                   </div>

                      <div class="form-group required-field" v-if="chamado.data_atendimento">
                        <label for="data_atendimento" class="col-md-2">Inicio atendimento: </label>
                        <div class="col-md-7">
                          <div class="input-group">
                            <input
                              type="text"
                              ref="dtInicial"
                              name="dataInicial"
                              v-model="chamado.data_atendimento"
                              class="form-control"
                              data-vv-as="Data Atendimento"
                              :disabled="true">
                          </div>
                        </div>
                      </div>

                  <div class="form-group required-field" :class="{ 'has-error' : errors.first('dataFinal')}" v-if="chamado.data_encerramento">
                    <label for="data_encerramento" class="col-md-2">Data Encerramento:</label>
                    <div class="col-md-7">
                      <div class="input-group">

                        <input
                          type="text"
                          ref="Data Final"
                          name="dataFinal"
                          v-model="chamado.data_encerramento"
                          class="form-control"
                          data-vv-as="Data Final"
                          :disabled="true"
                        >
                      </div>
                    </div>
                  </div>
                      <div class="form-group required-field">
                        <label for="parametro" class="col-md-2">Assunto:</label>
                        <div class="col-md-7">
                          <div class="input-group">
                            <!--<input v-model="chamado.assunto.assunto"  name="assunto" class="form-control" :disabled="true"/>-->
                            <multiselect v-model="chamado.assunto" :options="assuntos"
                                         :multiple="false"
                                         :close-on-select="true"
                                         :clear-on-select="false"
                                         :hide-selected="false"
                                         :preserve-search="true"
                                         placeholder="Selecione um assunto"
                                         @select="changeAssunto($event)"
                                         :custom-label="etiquetaAssunto"
                                         :preselect-first="false"
                                         selectLabel=""
                                         label="assunto"
                                         track-by="id"
                                         deselectLabel=""
                                         selectedLabel="Selecionado"
                                         name="assunto"
                                         data-vv-as="assunto"
                                         :disabled="habilita === false"
                                         v-validate="'required'">
                              <span slot="noOptions"><font color="red">Nenhum registro localizado!</font></span>
                            </multiselect>
                          </div>
                          <span v-if="habilita === true" class="arrow blueArrow margemAssunto"></span>
                        </div>
                      </div>
                      <div class="form-group required-field" v-if="chamado.assunto.area_responsavel">
                        <label for="parametro" class="col-md-2">Área Responsável:</label>
                        <div class="col-md-7">
                          <div class="input-group">
                            <input v-model="chamado.assunto.area_responsavel"  name="assunto" class="form-control" :disabled="true"/>
                          </div>
                        </div>
                      </div>
                  <div class="form-group required-field">
                    <label for="status" class="col-md-2">Status:</label>
                    <div class="col-md-7">
                      <div class="input-group">
                        <input v-model="chamado.status.status" v-if="chamado.status.status === 'Aguardando Atendimento'" name="status" class="form-control bordaAguardandoAtendimento" :disabled="true"/>
                        <input v-model="chamado.status.status" v-if="chamado.status.status === 'Em Atendimento'" name="status" class="form-control bordaEmAtendimento" :disabled="true"/>
                        <input v-model="chamado.status.status" v-if="chamado.status.status === 'Aguardando Avaliação'" name="status" class="form-control bordaAguardandoAvaliacao" :disabled="true"/>
                        <input v-model="chamado.status.status" v-if="chamado.status.status === 'Chamado Avaliado'" name="status" class="form-control bordaChamadoAvaliado" :disabled="true"/>
                        <input v-model="chamado.status.status" v-if="chamado.status.status === 'Chamado Encerrado'" name="status" class="form-control bordaChamadoEncerrado" :disabled="true"/>
                      </div>
                    </div>
                  </div>
                  <div class="form-group required-field" v-if="chamado.documento">
                    <label for="status" class="col-md-2">Anexo:</label>
                    <div class="col-md-7">
                      <div class="input-group">
                        <a @click="onDownload(chamado.documento)" href="javascript:void(0)" class=""><i
                          class="fa fa-download" aria-hidden="true"></i> {{chamado.documento.ds_nome_arquivo}}</a>
                      </div>
                    </div>
                  </div>
                    </div>
                    <div id="column2">
                      <!--<span style="color: red" v-if="usuarioLogado.userType === 'FUNDACAO' && usuarioLogado.uor !== chamado.assunto.uor_area && chamado.status.id !== 5"> * Atenção: A área responsável pelo chamado é diferente da sua.</span>-->
                      <!--<span style="color: red" v-if="usuarioLogado.userType === 'FUNDACAO' && chamado.usuario_atendimento && usuarioLogado.id !== chamado.usuario_atendimento.id && chamado.status.id !== 5"> * Atenção: O chamado já está em atendimento por <b>{{chamado.usuario_atendimento.ds_nome_usuario}}</b> </span>-->
                      <fieldset v-if="chamado.status.id !== 5">
                        <legend>
                          Opções do chamado:
                        </legend>
                        <div class="col-md-7" v-if="chamado.status.id === 1 && usuarioLogado.userType === 'FUNDACAO'">
                          <div class="input-group">
                            <button @click="iniciarAtendimento()"
                                    uib-tooltip="Inclui um evento"
                                    type="button"
                                    class="btn btn-flat relevo"
                                    style="margin-top:10px; color: #048019;"
                                    :title="'<h5>' + '<span style=\'color: #7adddd\'>' + 'O atendimento do chamado será iniciado.' + '</span>' + '</h5>'"
                                    v-tippy='{ inertia : true, arrow : true,  animation : "scale", distance:"1", size: "large", interactive: true, theme: "dark",  placement : "right"}'                                   >
                              <i class="fa fa-hourglass-1" aria-hidden="true"></i> &nbsp; Iniciar Atendimento</button>
                          </div>
                        </div>
                        <div class="col-md-7" v-if="chamado.status.id == 2 && usuarioLogado.userType === 'FUNDACAO'">
                          <div class="input-group">
                            <button @click="devolveAguardandoAtendimento()"
                                    uib-tooltip="Inclui um evento"
                                    type="button"
                                    class="btn btn-flat"
                                    style="margin-top:10px; color: #048019;"
                                    :title="'<h5>' + '<span style=\'color: #7adddd\'>' + 'O chamado será devolvido para o status Aguardando Atendimento.' + '</span>' + '</h5>'"
                                    v-tippy='{ inertia : true, arrow : true,  animation : "scale", distance:"1", size: "large", interactive: true, theme: "dark",  placement : "right"}'
                            >
                              <i class="fa fa-backward" aria-hidden="true"></i> &nbsp; Devolver para Aguardando Atendimento</button>
                          </div>
                        </div>
                        <div class="col-md-7" v-if="chamado.status.id !== 3 && chamado.status.id !== 4 && chamado.status.id !== 5 && habilitaSalvarReclassificacao === false && usuarioLogado.userType === 'FUNDACAO'">
                          <div class="input-group">
                            <button @click="reclassificarAssunto()"
                                    uib-tooltip="Inclui um evento"
                                    type="button"
                                    class="btn btn-flat"
                                    style="margin-top:10px; color: #af8760;"
                                    :title="'<h5>' + '<span style=\'color: #7adddd\'>' + 'Haverá a reclassificação do assunto do chamado.' + '</span>' + '</h5>'"
                                    v-tippy='{ inertia : true, arrow : true,  animation : "scale", distance:"1", size: "large", interactive: true, theme: "dark",  placement : "right"}'>
                              <i class="fa fa-refresh" aria-hidden="true"></i> &nbsp;Reclassificar Assunto</button>
                          </div>
                        </div>
                        <div class="col-md-7" v-if="chamado.status.id !== 1 && chamado.status.id !== 4 && chamado.status.id !== 5 && usuarioLogado.userType === 'FUNDACAO' && botaoSalvaAnalista === false">
                          <div class="input-group">
                            <button @click="mostraAlterarAnalista()"
                                    uib-tooltip="Inclui um evento"
                                    type="button"
                                    class="btn btn-flat"
                                    style="margin-top:10px; color: #020202;"
                                    :title="'<h5>' + '<span style=\'color: #7adddd\'>' + 'Ocorrerá a mudança do analista responsável pelo atendimento do chamado.' + '</span>' + '</h5>'"
                                    v-tippy='{ inertia : true, arrow : true,  animation : "scale", distance:"1", size: "large", interactive: true, theme: "dark",  placement : "right"}'                            >
                              <i class="fa fa-users" aria-hidden="true"></i> &nbsp;Alterar Analista</button>
                          </div>
                        </div>
                        <br>
                        <br>
                        <div class="col-md-7" v-if="chamado.status.id !== 4 && chamado.status.id !== 5 && usuarioLogado.userType === 'FUNDACAO' && botaoSalvaAnalista ===  true">
                          <div class="input-group">
                            <button @click="salvaNovoAnalista()"
                                    uib-tooltip="Inclui um evento"
                                    type="button"
                                    class="btn btn-flat"
                                    style="margin-top:10px; color: #020202;"
                            >
                              <i class="fa fa-users" aria-hidden="true"></i> &nbsp;Salva Troca Analista</button>
                          </div>
                          <span class="arrow redArrow margemTrocaAnalista"></span>
                        </div>
                        <br>
                        <div class="col-md-7" v-if="chamado.status.id === 3 && usuarioLogado.userType === 'FUNDACAO'">
                          <div class="input-group">
                            <button @click="encerrarAtendimentoSemAvaliacao()"
                                    uib-tooltip="Inclui um evento"
                                    type="button"
                                    class="btn  btn-flat"
                                    style="margin-top:10px; color: #f40022;"
                                    :title="'<h5>' + '<span style=\'color: #7adddd\'>' + 'O chamado será encerrado mesmo sem a avaliação do usuário e estará disponível somente para consulta.' + '</span>' + '</h5>'"
                                    v-tippy='{ inertia : true, arrow : true,  animation : "scale", distance:"1", size: "large", interactive: true, theme: "dark",  placement : "right"}'                            >
                              <i class="fa fa-check-square-o" aria-hidden="true"></i> &nbsp; Encerrar Atendimento Sem Avaliação</button>
                            <span class="arrow blueArrow margemEncerraSemAvaliacao"></span>
                          </div>
                        </div>
                        <br>
                        <br>
                        <br>
                        <br>
                        <div class="col-md-7" v-if="chamado.status.id !== 4 && chamado.status.id !== 5 && usuarioLogado.userType === 'FUNDACAO' && mostraListaUsuarios ===  true">
                          <div>
                          <label for="parametro" class="col-md-7">Selecione um usuário:</label>
                            <div class="input-group">
                              <!--<input v-model="chamado.assunto.assunto"  name="assunto" class="form-control" :disabled="true"/>-->
                              <multiselect v-model="usuarioAlterado" :options="usuarios"
                                           :multiple="false"
                                           :close-on-select="true"
                                           :clear-on-select="false"
                                           :hide-selected="false"
                                           :preserve-search="true"
                                           placeholder="Selecione um assunto"
                                           @select="changeUsuario($event)"
                                           :custom-label="etiquetaUsuario"
                                           :preselect-first="false"
                                           selectLabel=""
                                           label="usuarioAlterado"
                                           track-by="id"
                                           deselectLabel=""
                                           selectedLabel="Selecionado"
                                           name="usuarioAlterado"
                                           data-vv-as="usuarioAlterado"
                                           v-validate="'required'">
                                <span slot="noOptions"><font color="red">Nenhum registro localizado!</font></span>
                              </multiselect>
                            </div>
                          </div>
                        </div>
                        <div class="col-md-7" v-if="chamado.status.id !== 3 && chamado.status.id !== 4 && chamado.status.id !== 5 && habilitaSalvarReclassificacao === true && usuarioLogado.userType === 'FUNDACAO'">
                          <div class="input-group">
                            <button @click="salvaReclassificacao()"
                                    type="button"
                                    class="btn btn-flat"
                                    :title="'<h5>' + '<span style=\'color: #7adddd\'>' + 'Confirma a reclassificação do chamado' + '</span>' + '</h5>'"
                                    v-tippy='{ inertia : true, arrow : true,  animation : "scale", distance:"1", size: "large", interactive: true, theme: "dark",  placement : "right"}'
                                    style="margin-top:10px; color: #af8760;">
                              <i class="fa fa-floppy-o" aria-hidden="true"></i> &nbsp;Salvar Reclassificação</button>
                          </div>
                          <span class="arrow redArrow margemTrocaAnalista"></span>
                          <br>
                        </div>
                        <div class="col-md-7" v-if="chamado.status.id === 4 && usuarioLogado.userType === 'FUNDACAO'">
                          <div class="input-group">
                            <button @click="encerrarAtendimento()"
                                    uib-tooltip="Inclui um evento"
                                    type="button"
                                    class="btn  btn-flat"
                                    style="margin-top:10px; color: #f40022;"
                                    :title="'<h5>' + '<span style=\'color: #7adddd\'>' + 'O chamado será encerrado e estará disponível somente para consulta.' + '</span>' + '</h5>'"
                                    v-tippy='{ inertia : true, arrow : true,  animation : "scale", distance:"1", size: "large", interactive: true, theme: "dark",  placement : "right"}'                            >
                              <i class="fa fa-check-square-o" aria-hidden="true"></i> &nbsp; Encerrar Atendimento</button>
                            <span class="arrow blueArrow margemTrocaAnalista"></span>
                          </div>
                        </div>

                        <!-- <div class="col-md-7 " v-if="chamado.status.id === 2 && resolucaoPreenchida === false && usuarioLogado.userType === 'FUNDACAO'">
                          <div class="input-group">
                            <button @click="liberaParaAvaliacao()"
                                    uib-tooltip="Inclui um evento"
                                    type="button"
                                    class="btn  btn-flat"
                                    style="margin-top:10px; color: #001eff;"
                                    :title="'<h5>' + '<span style=\'color: #7adddd\'>' + 'Após ter solucionado o problema, preencha a solução e envie o chamado para avaliação do usuário.' + '</span>' + '</h5>'"
                                    v-tippy='{ inertia : true, arrow : true,  animation : "scale", distance:"1", size: "large", interactive: true, theme: "dark",  placement : "right"}'                            >
                              <i class="fa fa-star-o" aria-hidden="true"></i> &nbsp; Enviar para Avaliação</button>
                          </div>
                        </div>
                        <div class="col-md-7 " v-if="chamado.status.id === 2 && resolucaoPreenchida === true && usuarioLogado.userType === 'FUNDACAO'">
                          <div class="input-group">
                            <button @click="enviarAvaliacao()"
                                    uib-tooltip="Inclui um evento"
                                    type="button"
                                    class="btn  btn-flat"
                                    style="margin-top:10px; color: #001eff;"
                            >
                              <i class="fa fa-star-o" aria-hidden="true"></i> &nbsp; Confirmar e Enviar para Avaliação</button>
                          </div>
                          <span class="arrow redArrow margemEnviaAvaliacao"></span>
                        </div> -->
                        <br>
                        <br>
                        <br>
                        <br>
                        <!-- <div class="col-md-7 form-group required-field" v-if="chamado.status.id === 2 && preencheResolucao === true && usuarioLogado.userType === 'FUNDACAO'">
                          <br>
                          <b style="color:red;">Retorno para Entidade:</b>
                        <textarea v-model="resolucao" style="height:200px;resize:both;border: #0a568c;border: 1px solid #a8a3a5;" name="resolucao" class="form-control" @keyup="resolucaoPreenchida = true"
                                  :placeholder="placeFBB"
                                  v-validate="'required'"></textarea>
                          <span v-if="errors.first('resolucao')" class="label label-danger"> {{ errors.first('resolucao') }}</span>
                        </div> -->
                        <div class="col-md-7" v-if="chamado.status.id === 3 && usuarioLogado.userType === 'ENTIDADE'">
                          <legend>
                            O seu problema foi solucionado?
                          </legend>
                          <div class="row">
                            <div class="box-body" style="padding-top: 0px;">
                              <div class="col-md-2 form-group required" :class="{ 'has-error' : errors.first('problemaSN')}">
                                <label class="new-control new-control-radio" style="padding-top: 8px;">
                                  <input v-validate="'required'" type="radio" name="problemaSN" v-model="problemaResolvido" value="SIM" class=""> Sim
                                  <div class="new-control-indicator"></div>
                                </label>
                                <label class="new-control new-control-radio" style="padding-top: 8px;">
                                  <input v-validate="'required'" type="radio" name="problemaSN"  v-model="problemaResolvido" value="NAO" class=""> Não
                                  <div class="new-control-indicator"></div>
                                </label>
                                <span v-if="errors.first('problemaSN')" class="label label-danger"> {{('O campo acima deve ser marcado com Sim ou Não') }}</span>
                              </div>
                            </div>
                          </div>
                          <br>
                        </div>
                        <div class="col-md-7 form-group required-field" v-if="chamado.status.id === 3 && rating === 0 && problemaResolvido === 'NAO'">
                          <b style="color:red;">Informe o que faltou para a resolução:</b>
                          <textarea v-model="resolucaoNOK" style="height:200px;resize:both;border: #0a568c;border: 1px solid #a8a3a5;" name="resolucao" class="form-control"
                                    :placeholder="place"
                                    v-validate="'required'"></textarea>
                          <span v-if="errors.first('resolucaoNOK')" class="label label-danger"> {{ errors.first('resolucaoNOK') }}</span>
                        </div>
                        <div class="col-md-7" v-if="chamado.status.id === 3 && rating === 0 && problemaResolvido === 'NAO' && resolucaoNOK.length > 0">
                          <div class="input-group">
                            <button @click="devolverChamado()"
                                    uib-tooltip="Inclui um evento"
                                    type="button"
                                    class="btn  btn-flat"
                                    style="margin-top:10px; color: #001eff;"
                            >
                              <i class="fa fa-backward" aria-hidden="true"></i> &nbsp; Devolver Chamado</button>
                          </div>
                          <span v-if="problemaResolvido === 'NAO' && chamado.status.id !== 4 && chamado.status.id !== 5" class="arrow redArrow margemTrocaAnalista"></span>
                        </div>
                        <div class="col-md-7" v-if="chamado.status.id === 3 && rating === 0 && problemaResolvido === 'SIM'">
                          <div class="input-group">
                            <button @click="avaliarChamado()"
                                    uib-tooltip="Inclui um evento"
                                    type="button"
                                    class="btn  btn-flat"
                                    style="margin-top:10px; color: #001eff;"
                                    :title="'<h5>' + '<span style=\'color: #7adddd\'>' + 'Após a FBB informar que o chamado foi solucionado, clique aqui para efetuar a avaliação.' + '</span>' + '</h5>'"
                                    v-tippy='{ inertia : true, arrow : true,  animation : "scale", distance:"1", size: "large", interactive: true, theme: "dark",  placement : "right"}'                            >
                              <i class="fa fa-star-o" aria-hidden="true"></i> &nbsp; Avaliar Chamado</button>
                          </div>
                        </div>
                        <div class="col-md-7">
                          <button @click="enviarAvaliacaoEEncerrar()" v-if="chamado.status.id === 3 && rating > 0 && mostraAvaliacao === true && problemaResolvido === 'SIM'"
                                  uib-tooltip="Inclui um evento"
                                  type="button"
                                  class="btn  btn-flat"
                                  style="margin-top:10px; color: #001eff;"
                                  :title="'<h5>' + '<span style=\'color: #7adddd\'>' + 'Após efetuar a avaliação, seu chamado será encaminhado para encerramento da FBB.' + '</span>' + '</h5>'"
                                  v-tippy='{ inertia : true, arrow : true,  animation : "scale", distance:"1", size: "large", interactive: true, theme: "dark",  placement : "right"}'                          >
                            <i class="fa fa-floppy-o" aria-hidden="true"></i> &nbsp; Avaliar e enviar para encerramento</button>
                          <span v-if="problemaResolvido === 'SIM' && chamado.status.id !== 4 && chamado.status.id !== 5" class="arrow redArrow margemEncerramento"></span>
                          <br>
                          <br>
                          <br>
                          <div v-if="chamado.status.id === 3 && mostraAvaliacao === true && problemaResolvido === 'SIM'">
                          <div><span>Sua opinião é muito importante! Avalie este atendimento.</span></div>
                          <span style="font-size: x-small"><i class="fa fa-star" style="color: red"></i>: Muito ruim | <i class="fa fa-star" style="color: #ff6600"></i><i class="fa fa-star" style="color: #ff6600"></i>: Ruim | <i class="fa fa-star" style="color: #eead2d"></i><i class="fa fa-star" style="color: #eead2d"></i><i class="fa fa-star" style="color: #eead2d"></i>: Regular | <i class="fa fa-star" style="color: #74B72E"></i><i class="fa fa-star" style="color: #74B72E"></i><i class="fa fa-star" style="color: #74B72E"></i><i class="fa fa-star" style="color: #74B72E"></i>: Bom | <i class="fa fa-star" style="color: green"></i><i class="fa fa-star" style="color: green"></i><i class="fa fa-star" style="color: green"></i><i class="fa fa-star" style="color: green"></i><i class="fa fa-star" style="color: green"></i>: Ótimo.</span>
                          </div>
                          <star-rating text-class="custom-text" :active-color="['red','#ff6600','#eead2d','#74B72E','green']"  animate="true" @update:rating ="setRating" v-model="rating" v-if="chamado.status.id === 3 && mostraAvaliacao === true && problemaResolvido === 'SIM'"></star-rating>
                        </div>
                        <br>
                        <br>
                      </fieldset>
                      <div class="col-md-7" v-if="((chamado.status.id === 5 || chamado.status.id === 4) && (chamado.nota && chamado.nota.nota && !_.isNull(chamado.nota.nota)))">
                        <span style="color: #3d3d3d; font-weight: bolder">Chamado avaliado:</span>
                        <div>
                          <span style="font-size: x-small"><i class="fa fa-star" style="color: red"></i>: Muito ruim | <i class="fa fa-star" style="color: #ff6600"></i><i class="fa fa-star" style="color: #ff6600"></i>: Ruim | <i class="fa fa-star" style="color: #eead2d"></i><i class="fa fa-star" style="color: #eead2d"></i><i class="fa fa-star" style="color: #eead2d"></i>: Regular | <i class="fa fa-star" style="color: #74B72E"></i><i class="fa fa-star" style="color: #74B72E"></i><i class="fa fa-star" style="color: #74B72E"></i><i class="fa fa-star" style="color: #74B72E"></i>: Bom | <i class="fa fa-star" style="color: green"></i><i class="fa fa-star" style="color: green"></i><i class="fa fa-star" style="color: green"></i><i class="fa fa-star" style="color: green"></i><i class="fa fa-star" style="color: green"></i>: Ótimo.</span>
                        </div>
                        <star-rating class="custom-text" :active-color="['red','#ff6600','#eead2d','#74B72E','green']" :read-only="true" v-model="chamado.nota.nota" v-if="chamado.status.id === 5 || chamado.status.id === 4"></star-rating>
                      </div>
                    </div>
                </form>
                </div>
                <div class="col-md-12">
                  <div class=""><div class="box box-primary">
                    <div class="box-header with-border">
                      <h3 class="box-title"><i class="fa fa-list-alt" aria-hidden="true"></i> Retorno para a Entidade</h3>
                      <div class="center">
                        <span v-if="table.totalRows > 0 && table.totalRows < 2"> O chamado possui <b> {{table.totalRows}} </b> assentamento </span>
                        <span v-else-if="table.totalRows > 0"> O chamado possui <b> {{table.totalRows}} </b> assentamentos </span>
                      </div>
                    </div>
                    <button @click="mostraNovo = true" @click.prevent="irAte()" v-if="chamado.status.id !== 5 && apertouSalvar === false"
                            :disabled="chamado.status.id == 1 && usuarioLogado.userType === 'FUNDACAO'"
                            uib-tooltip="Inclui um evento na tabela abaixo"
                            type="button"
                            class="btn btn-primary btn-flat"
                            style="margin-top:10px">
                      <i class="fa fa-plus-circle" aria-hidden="true"></i> Incluir Assentamento</button>
                    <!--Lista de Chamados-->
                    <br>
                    <br>
                    <div class="col-sm-12">
                      <b-container fluid>
                        <!-- Main table element -->
                        <b-table show-empty
                                 stacked="md"
                                 ref="table"
                                 :bordered="table.bordered"
                                 :items="table.items"
                                 :hover="table.hover"
                                 :fields="table.fields"
                                 :filter="table.filter"
                                 :current-page="table.currentPage"
                                 @filtered="onFiltered"
                                 :per-page="table.perPage"
                                 :sort-by.sync="table.sortBy"
                                 :sort-desc.sync="table.sortDesc"
                                 empty-text="Nenhum registro encontrado"
                        >
                          <template slot="empty">
                            <div v-if="carregou === false" class="text-center">
                              <div class="overlay" style="position: absolute; top: 0px; left: 0px; width: 100%; height: 100%; display: block;">
                                <i class="fa fa-refresh fa-spin"></i>
                              </div>
                            </div>
                          </template>
                          <template slot="data_inclusao" scope="row">{{row.value | moment('DD/MM/YYYY HH:mm:ss')}}</template>
                          <template slot="descricao" scope="row"><span v-html="row.value"></span></template>
                          <template slot="usuario.ds_nome_usuario" scope="row">
                            <span v-if="row.item.usuario && row.item.usuario.ds_tipo_usuario === 'ENTIDADE'"> {{row.value}} <br> <span style="font-style: italic; color: #0a568c;" v-if="chamado.entidade">({{chamado.entidade.ds_nome}})</span></span>
                            <span v-else-if="row.item.usuario && row.item.usuario.ds_tipo_usuario === 'FUNDACAO'"> {{row.value}} <br> <span style="font-style: italic; color: #0a568c;">(Fundação Banco do Brasil)</span></span>
                          </template>
                          <template slot="anexos" scope="row">
                            <!-- 1. Container principal que verifica se o array 'anexos' (row.value) existe e não está vazio -->
                            <div v-if="row.value && row.value.length > 0">

                              <!-- 2. Loop v-for para iterar sobre cada 'documento' no array 'anexos' -->
                              <!-- O :key é importante para o Vue otimizar a renderização -->
                              <div v-for="documento in row.value" :key="documento.id" class="documento-item">
                                <a @click="onDownload(documento)" href="javascript:void(0)">
                                  <span v-if="documento.ds_nome_arquivo">
                                    <i class="fa fa-download" aria-hidden="true"></i>&nbsp;{{ documento.ds_nome_arquivo }}
                                  </span>
                                  <!-- Se o nome do arquivo não existir, não mostra nada -->
                                  <span v-else></span>
                                </a>

                              </div>
                            </div>

                            <!-- Opcional: Mensagem para quando não há documentos -->
                            <span v-else>
                              Nenhum anexo
                            </span>
                          </template>
                        </b-table>
                        <b-row>
                          <b-col md="6" class="my-1" right>
                            <b-pagination :total-rows="table.totalRows" :per-page="table.perPage" v-model="table.currentPage" class="my-3" />
                          </b-col>
                        </b-row>
                      </b-container>
                    </div>
                    <div class="box-body" v-if="mostraNovo === true" >
                      <div class="form-group required-field" :class="{ 'has-error' : errors.first('assentamento')}">
                        <label for="parametro" class="control-label col-md-2">Assentamento:</label>
                        <div class="col-md-4" v-if="mostraNovo === true" ref="assentamentoNovo">
                        <textarea v-model="assentamento.descricao" style="height:200px;resize:none;border: #0a568c;border: 1px solid #a8a3a5;" name="assentamento" class="form-control" :placeholder="placeAssentamento"
                                v-validate="'required'"></textarea>
                          <span v-if="errors.first('assentamento')" class="label label-danger"> {{ errors.first('assentamento') }}</span>
                          <div v-if="usuarioLogado.userType === 'FUNDACAO'">
                            <br>
                          <label>Deixar visível para a Entidade?</label>
                          <select v-model="assentamento.visivel_entidade" class="form-control" name="visivel_entidade">
                            <option value=0>Não</option>
                            <option value=1>Sim</option>
                          </select>
                            <br>
                          </div>
                          <div class="box-header with-border">
                            <h3 class="box-title">Anexo</h3>
                          </div>
                          <upload-documentos-chamado :propDocumentos="assentamento.anexos"></upload-documentos-chamado>

                        </div>
                      </div>
                      <button @click="adicionaAssentamento" v-if="mostraNovo === true"
                              uib-tooltip="Inclui um evento na tabela abaixo"
                              type="button"
                              class="btn btn-success btn-flat"
                              style="margin-top:10px">
                        <i class="fa fa-floppy-o" aria-hidden="true"></i>&nbsp;&nbsp; Salvar</button>
                      <br>
                      <button @click="fechaAssentamento" v-if="mostraNovo === true"
                              uib-tooltip="Inclui um evento na tabela abaixo"
                              type="button"
                              class="btn btn-primary btn-flat"
                              style="margin-top:10px">
                        <i class="fa fa-close" aria-hidden="true"></i>&nbsp;&nbsp; Fechar</button>

                        <div v-if="chamado.status.id === 2 && usuarioLogado.userType === 'FUNDACAO'">
                         <!--<div class="input-group">--> 
                            <button @click="enviarAvaliacao()"
                                    uib-tooltip="Inclui um evento"
                                    type="button"
                                    class="btn  btn-flat"
                                    style="margin-top:10px; color: #001eff;"
                                    :title="'<h5>' + '<span style=\'color: #7adddd\'>' + 'Após ter solucionado o problema, preencha o assentamento e envie o chamado para avaliação do usuário.' + '</span>' + '</h5>'"
                                    v-tippy='{ inertia : true, arrow : true,  animation : "scale", distance:"1", size: "large", interactive: true, theme: "dark",  placement : "right"}' :disabled="!assentamento.descricao"  
                                    :class="{ 'botao-desabilitado': !assentamento.descricao }">                            
                              <i class="fa fa-star-o" aria-hidden="true"></i> &nbsp; Salvar e Enviar para Avaliação</button>
                          
                        </div>
                        <!-- <div  v-if="chamado.status.id === 2 && usuarioLogado.userType === 'FUNDACAO'">
                          <div class="input-group">
                            <button @click="enviarAvaliacao()"
                                    uib-tooltip="Inclui um evento"
                                    type="button"
                                    class="btn  btn-flat"
                                    style="margin-top:10px; color: #001eff;"
                            >
                              <i class="fa fa-star-o" aria-hidden="true"></i> &nbsp; Confirmar e Enviar para Avaliação</button>
                          </div>
                          <span class="arrow redArrow margemEnviaAvaliacao"></span>
                        </div> -->
                        <br>
                        <br>
                        <br>
                        <br>
                        
                    </div>
                  </div>
                  </div>
                </div>
              </div>
               <div class="box-footer">
                 <!--<g-button-moema v-if="chamado.status.id !== 5 && !_.isEmpty(assentamento.descricao)" color="primary" size="button&#45;&#45;size-ss" @click.native="salvaAssentamento"><i class="fa fa-floppy-o" aria-hidden="true"></i> Salvar Assentamento</g-button-moema>-->
                 <g-button-moema color="warning" size="button--size-ss" @click.native="$router.push({ name: 'cadastro-chamado-lista'})"><i class="fa fa-chevron-circle-left" aria-hidden="true"></i> Voltar </g-button-moema>
               </div>
            </div>
            </div>
            </div>
          </div>
        </section>
      </div>
      <vue-snotify></vue-snotify>
      </div>
</template>

<script>
    import moment from 'moment'
    import UploadDocumentosPhpNovo from '../../modules/uploadDocumentosPhpNovo'
    import UploadDocumentosChamado from '../../modules/uploadDocumentosChamado'
    import { mapGetters } from 'vuex'
    import StarRating from 'vue-star-rating'
    export default {
      components: {
        StarRating,
        UploadDocumentosPhpNovo,
        UploadDocumentosChamado
      },
      name: 'editar-chamado',
      computed: {
        ...mapGetters([
          'usuarioLogado'
        ])
      },
      data () {
        return {
          rating: 0,
          carregou: false,
          chamado: {
            entidade: {},
            assunto: [],
            status: {},
            documento: {
              tipo_documento: []
            },
            data_atendimento: null,
            usuario_atendimento: null
          },
          esconderDados: true,
          place: 'Descreva para a FBB o que faltou para que o chamado fosse atentido.\nObs: O chamado retornará para Em Atendimento da FBB.',
          placeFBB: 'Informe para o solicitante o que foi feito para resolução do chamado.\nObs: O chamado irá para o status Aguardando Avaliação.',
          placeAssentamento: 'Descreva de forma clara e objetiva o assentamento.',
          assuntoAntigo: '',
          areaAssuntoNovo: '',
          areaAssuntoAntigo: '',
          problemaResolvido: '',
          resolucao: '',
          resolucaoNOK: '',
          documento: [],
          habilita: false,
          chamadoAtualiza: {
            usuario_atendimento: null
          },
          habilitaSalvarReclassificacao: false,
          apertouSalvar: false,
          mostraAvaliacao: false,
          assentamentos: [],
          assentamento: {
            fk_documento: null,
            usuario: null,
            descricao: null,
            data_inclusao: null,
            visivel_entidade: 1,
            anexos: []
          },
          usuarioAlterado: {},
          assentamentoEnvio: {
            descricao: null
          },
          loading: {
            show: false
          },
          usuarios: [],
          botaoSalvaAnalista: false,
          mostraListaUsuarios: false,
          preencheResolucao: false,
          resolucaoPreenchida: false,
          assuntos: [],
          diasEmAberto: '',
          mostraNovo: false,
          table: {
            items: [],
            filter: null,
            hover: true,
            bordered: true,
            currentPage: 1,
            perPage: 10,
            sortBy: 'data_inclusao',
            sortDesc: true,
            fields: [
              { key: 'usuario.ds_nome_usuario', label: 'Usuário', sortable: true, thStyle: 'text-align: center; width: 20%', class: 'text-center' },
              { key: 'data_inclusao', label: 'Data', sortable: true, thStyle: 'text-align: center; width: 15%', class: 'text-center' },
              { key: 'descricao', label: 'Observações', sortable: true, thStyle: 'text-align: center; width: 40%', class: 'text-center' },
              { key: 'anexos', label: 'Anexo', sortable: true, thStyle: 'text-align: center; width: 10%', class: 'text-center' }
            ]
          },
          carteira: ''
        }
      },
      created () {
        this.assentamento.descricao = ''
        if (this.$route.params.id) {
          this.loading.show = true
          this.buscaChamado()
          this.buscaAssentamento()
          this.buscaAssunto()
        }
      },
      mounted () {
        this.buscaUsuarios()
      },
      methods: {
        verificaUsuarioLogado () {
          if (this.usuarioLogado.userType === 'FUNDACAO' || this.usuarioLogado.entidade.ds_cnpj === this.chamado.entidade.ds_cnpj) {
            return true
          } else {
            this.$router.push({name: 'dashboard'})
          }
        },
        formata (row) {
          return moment(row).format('DD/MM/YYYY')
        },
        onFiltered (filteredItems) {
          this.table.totalRows = filteredItems.length
          this.table.currentPage = 1
        },
        buscaChamado () {
          let now = moment().format('YYYY-MM-DD HH:mm:ss')
          if (this.$route.params.id) {
            this.loading.show = true
            axiosLaravel.get('chamado/' + this.$route.params.id).then((response) => {
              this.chamado = response.data
              this.verificaUsuarioLogado()
              if (moment(this.chamado.data_inclusao).format('YYYYMMDD') === moment(now).format('YYYYMMDD')) {
                this.diasEmAberto = 0
              } else {
                this.diasEmAberto = moment.utc(moment(now).diff(moment(this.chamado.data_inclusao))).format('DD')
              }
              this.horasEmAberto = moment.utc(moment(now).diff(moment(this.chamado.data_inclusao))).format('HH')
              this.minutosEmAberto = moment.utc(moment(now).diff(moment(this.chamado.data_inclusao))).format('mm')
              this.documento = this.chamado.documento
              if (this.chamado.data_inclusao) {
                this.chamado.data_inclusao = moment(this.chamado.data_inclusao).format('DD/MM/YYYY HH:mm:ss')
              }
              if (this.chamado.data_encerramento) {
                this.chamado.data_encerramento = moment(this.chamado.data_encerramento).format('DD/MM/YYYY HH:mm:ss')
              }
              if (this.chamado.data_atendimento) {
                this.chamado.data_atendimento = moment(this.chamado.data_atendimento).format('DD/MM/YYYY HH:mm:ss')
              }
              this.assuntoAntigo = this.chamado.assunto.assunto
              this.areaAssuntoAntigo = this.chamado.assunto.area_responsavel
              this.usuarioNome = this.chamado.usuario_abertura.ds_nome_usuario
              this.$forceUpdate()
              this.loading.show = false
              this.buscaCarteira()
            })
              .catch((error) => {
                this.$root.trataErro(error)
                this.loading.show = false
              })
          }
        },
        buscaAssentamento () {
          console.log('busca assentamentos')
          this.carregou = false
          if (this.$route.params.id) {
            this.loading.show = true
            axiosLaravel.post('assentamento/busca/', {'parametro': this.$route.params.id}).then((response) => {
              this.assentamentos = response.data
              this.table.items = _.cloneDeep(this.assentamentos)
              this.table.totalRows = this.table.items.length
              this.$forceUpdate()
              this.$refs.table.refresh()
              this.carregou = true
              this.loading.show = false
            })
              .catch((error) => {
                this.$root.trataErro(error)
                this.loading.show = false
              })
          }
          console.log('assentamentos', this.table.items)
        },
        adicionaAssentamento () {
          this.$validator.validateAll().then((result) => {
            if (result) {
              this.apertouSalvar = true
              this.assentamento.usuario = this.usuarioLogado
              this.assentamento.data_inclusao = moment().format('YYYY-MM-DD HH:mm:ss')
              this.table.items.push(this.assentamento)
              this.mostraNovo = false
              this.$forceUpdate()
              this.salvaAssentamento()
            } else {
              this.$snotify.error('É necessário preencher o campo Assentamento. Favor verificar!')
            }
          })
        },
        fechaAssentamento () {
          this.mostraNovo = false
          this.assentamento.descricao = ''
          this.assentamento.anexos = []
        },
        salvaAssentamento () {
          this.apertouSalvar = true
          this.carregou = false
          console.log('anexos', this.assentamento.anexos)
          this.$snotify.async('Salvando o assentamento. Por favor, aguarde...', {timeout: 0})
          axiosLaravel.post('assentamento/grava/', {'parametro': this.$route.params.id, 'descricao': this.assentamento.descricao, 'anexos': this.assentamento.anexos, 'visivel_entidade': this.assentamento.visivel_entidade}).then((response) => {
            this.$snotify.clear()
            this.$snotify.success('Assentamento salvo com sucesso!')
            this.apertouSalvar = false
            this.assentamento.descricao = ''
            this.assentamento.visivel_entidade = null
            this.assentamento.anexos = []
            this.buscaAssentamento()
          })
            .catch((error) => {
              this.$snotify.clear()
              this.$root.trataErro(error)
            })
        },
        salvaAssentamentoAutomatico (descricao) {
          this.apertouSalvar = false
          axiosLaravel.post('assentamento/grava/', {'parametro': this.$route.params.id, 'descricao': descricao}).then((response) => {
            this.buscaAssentamento()
          })
            .catch((error) => {
              this.$snotify.clear()
              this.$root.trataErro(error)
            })
        },
        iniciarAtendimento () {
          let descricao = 'Atendimento Iniciado'
          this.$snotify.async('Salvando o Chamado. Por favor, aguarde...', {timeout: 0})
          axiosLaravel.post('chamado/iniciaAtendimento/', {'parametro': this.$route.params.id}).then((response) => {
            this.salvaAssentamentoAutomatico(descricao)
            this.$snotify.clear()
            this.$snotify.success('Chamado salvo com sucesso!')
            this.buscaChamado()
          })
            .catch((error) => {
              this.$snotify.clear()
              this.$root.trataErro(error)
            })
        },
        devolveAguardandoAtendimento () {
          let descricao = 'Devolvido para o status Aguardando Atendimento'
          this.$snotify.async('Salvando o Chamado. Por favor, aguarde...', {timeout: 0})
          axiosLaravel.post('chamado/devolveAguardandoAtendimento/', {'parametro': this.$route.params.id}).then((response) => {
            this.salvaAssentamentoAutomatico(descricao)
            this.$snotify.clear()
            this.$snotify.success('Chamado salvo com sucesso!')
            this.buscaChamado()
          })
            .catch((error) => {
              this.$snotify.clear()
              this.$root.trataErro(error)
            })
        },
        liberaParaAvaliacao () {
          this.preencheResolucao = true
          this.resolucaoPreenchida = false
        },
        enviarAvaliacao () {
          this.adicionaAssentamento()
          let descricaoAux = 'Chamado enviado para avaliação do usuário.'
          let descricao = '<b>' + this.resolucao + '</b>' + '<br/>' + descricaoAux
          this.$snotify.async('Salvando o Chamado. Por favor, aguarde...', {timeout: 0})
          axiosLaravel.post('chamado/enviarAvaliacao/', {'parametro': this.$route.params.id}).then((response) => {
            this.salvaAssentamentoAutomatico(descricao)
            this.$snotify.clear()
            this.$snotify.success('Chamado salvo com sucesso!')
            this.buscaChamado()
          })
            .catch((error) => {
              this.$snotify.clear()
              this.$root.trataErro(error)
            })
        },
        avaliarChamado () {
          this.mostraAvaliacao = true
        },
        enviarEncerramento () {
          let descricao = ''
          if (this.problemaResolvido === 'SIM') {
            descricao = 'O chamado foi solucionado e a Avaliação foi efetuada.'
          } else {
            descricao = 'O chamado não foi solucionado'
          }
          this.$snotify.async('Salvando o Chamado. Por favor, aguarde...', {timeout: 0})
          axiosLaravel.post('chamado/enviarEncerramento/', {'parametro': this.$route.params.id, 'rating': this.rating}).then((response) => {
            this.salvaAssentamentoAutomatico(descricao)
            this.$snotify.clear()
            this.$snotify.success('Chamado salvo com sucesso!')
            this.buscaChamado()
          })
            .catch((error) => {
              this.$snotify.clear()
              this.$root.trataErro(error)
            })
        },
        enviarAvaliacaoEEncerrar () {
          let descricao = ''
          if (this.problemaResolvido === 'SIM') {
            descricao = 'O chamado avaliado e encerrado.'
            this.$snotify.async('Enviado avaliação e encerramento o Chamado. Por favor, aguarde...', {timeout: 0})
            axiosLaravel.post('chamado/avaliarEEncerrarChamado/', {'parametro': this.$route.params.id, 'rating': this.rating}).then((response) => {
              this.salvaAssentamentoAutomatico(descricao)
              this.$snotify.clear()
              this.$snotify.success('Chamado salvo com sucesso!')
              this.buscaChamado()
            })
              .catch((error) => {
                this.$snotify.clear()
                this.$root.trataErro(error)
              })
          }
        },
        devolverChamado () {
          let descricaoAux = 'Chamado devolvido para Aguardando Atendimento.'
          let descricao = '<b>' + this.resolucaoNOK + '</b>' + '<br/>' + descricaoAux
          this.$snotify.async('Salvando o Chamado. Por favor, aguarde...', {timeout: 0})
          axiosLaravel.post('chamado/devolverChamado/', {'parametro': this.$route.params.id}).then((response) => {
            this.salvaAssentamentoAutomatico(descricao)
            this.$snotify.clear()
            this.$snotify.success('Chamado salvo com sucesso!')
            this.resolucaoPreenchida = false
            this.preencheResolucao = false
            this.resolucao = ''
            this.buscaChamado()
          })
            .catch((error) => {
              this.$snotify.clear()
              this.$root.trataErro(error)
            })
        },
        salvaReclassificacao () {
          let descricao = ''
          if (this.areaAssuntoNovo !== this.areaAssuntoAntigo) {
            descricao = 'Chamado reclassificado de ' + '<b>' + this.assuntoAntigo + '</b>' + ' para ' + '<b>' + this.assuntoNovo + '</b>' + '.' + '<br>' + 'Status alterado para Aguardando Atendimento'
            this.$snotify.async('Reclassificando o Chamado. Por favor, aguarde...', {timeout: 0})
            axiosLaravel.post('chamado/salvaReclassificacaoOutraArea/', {
              'parametro': this.$route.params.id,
              'assunto': this.assuntoNovoId
            }).then((response) => {
              this.salvaAssentamentoAutomatico(descricao)
              this.$snotify.clear()
              this.$snotify.success('Chamado salvo com sucesso!')
              this.habilitaSalvarReclassificacao = false
              this.habilita = false
              this.buscaChamado()
            })
              .catch((error) => {
                this.$snotify.clear()
                this.$root.trataErro(error)
              })
          } else {
            descricao = 'Chamado reclassificado de ' + '<b>' + this.assuntoAntigo + '</b>' + ' para ' + '<b>' + this.assuntoNovo + '</b>'
            this.$snotify.async('Reclassificando o Chamado. Por favor, aguarde...', {timeout: 0})
            axiosLaravel.post('chamado/salvaReclassificacao/', {
              'parametro': this.$route.params.id,
              'assunto': this.assuntoNovoId
            }).then((response) => {
              this.salvaAssentamentoAutomatico(descricao)
              this.$snotify.clear()
              this.$snotify.success('Chamado salvo com sucesso!')
              this.habilitaSalvarReclassificacao = false
              this.habilita = false
              this.buscaChamado()
            })
              .catch((error) => {
                this.$snotify.clear()
                this.$root.trataErro(error)
              })
          }
        },
        encerrarAtendimento () {
          let descricao = 'Chamado Encerrado'
          this.$snotify.async('Salvando o Chamado. Por favor, aguarde...', {timeout: 0})
          axiosLaravel.post('chamado/encerrarAtendimento/', {'parametro': this.$route.params.id}).then((response) => {
            this.salvaAssentamentoAutomatico(descricao)
            this.$snotify.clear()
            this.$snotify.success('Chamado salvo com sucesso!')
            this.buscaChamado()
          })
            .catch((error) => {
              this.$snotify.clear()
              this.$root.trataErro(error)
            })
        },
        encerrarAtendimentoSemAvaliacao () {
          let descricao = 'Chamado Encerrado sem a avaliação do usuário'
          this.$snotify.async('Salvando o Chamado. Por favor, aguarde...', {timeout: 0})
          axiosLaravel.post('chamado/encerrarAtendimento/', {'parametro': this.$route.params.id}).then((response) => {
            this.salvaAssentamentoAutomatico(descricao)
            this.$snotify.clear()
            this.$snotify.success('Chamado salvo com sucesso!')
            this.buscaChamado()
          })
            .catch((error) => {
              this.$snotify.clear()
              this.$root.trataErro(error)
            })
        },
        mostraAlterarAnalista () {
          this.mostraListaUsuarios = true
        },
        salvaNovoAnalista () {
          let descricao = 'Alteração do Analista responsável de ' + '<b>' + this.chamado.usuario_atendimento.ds_nome_usuario + '</b>' + ' para ' + '<b>' + this.usuarioAlterado.ds_nome_usuario + '</b>'
          this.$snotify.async('Reclassificando o Chamado. Por favor, aguarde...', {timeout: 0})
          axiosLaravel.post('chamado/salvaNovoAnalista/', {'parametro': this.$route.params.id, 'analista': this.usuarioAlterado.id}).then((response) => {
            this.salvaAssentamentoAutomatico(descricao)
            this.$snotify.clear()
            this.$snotify.success('Chamado salvo com sucesso!')
            this.mostraListaUsuarios = false
            this.botaoSalvaAnalista = false
            this.buscaChamado()
          })
            .catch((error) => {
              this.$snotify.clear()
              this.$root.trataErro(error)
            })
        },
        buscaUsuarios () {
          axiosLaravel.post('chamado/buscaUsuarios').then((response) => {
            this.usuarios = response.data
          })
            .catch((error) => {
              this.$root.trataErro(error)
              this.loading.show = false
            })
        },
        reclassificarAssunto () {
          this.habilita = true
        },
        setRating (rating) {
          this.rating = rating
        },
        buscaAssunto () {
          axiosLaravel.post('assuntos/ativos').then((response) => {
            this.assuntos = response.data
          })
            .catch((error) => {
              this.$root.trataErro(error)
            })
        },
        changeUsuario (parametro) {
          this.botaoSalvaAnalista = true
        },
        etiquetaAssunto (option) {
          return `${option.assunto}`
        },
        etiquetaUsuario (option) {
          return `${option.ds_nome_usuario}`
        },
        changeAssunto: async function (assunto) {
          console.log('assunto', assunto)
          this.areaAssuntoNovo = assunto.area_responsavel
          this.habilita = false
          this.assuntoNovo = assunto.assunto
          this.assuntoNovoId = assunto.id
          this.habilitaSalvarReclassificacao = true
        },
        irAte () {
          this.$nextTick(() => {
            this.$refs['assentamentoNovo'].scrollIntoView()
          })
        },
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
        buscaCarteira () {
          if (this.chamado.projeto) { // Se o chamado tiver algum projeto vinculado, busca sua carteira
            axiosLaravel.get('carteira/projeto/' + this.chamado.projeto).then((response) => {
              const idCarteiraProjeto = response.data.retorno.carteira_projeto.usu_codcart
              const carteiraProjeto = response.data.retorno.carteiras.find(e => e.usu_codcart === idCarteiraProjeto)
              this.carteira = carteiraProjeto.usu_nomcart // this.carteira recebe o nome da carteira que será exibido nas informações do chamado
            })
          } else {
            return
          }
        }
      }
    }
</script>

<style scoped>
  #row1{
    display:flex;
    flex-direction:row;
    justify-content: space-around;
  }

  #column1{
    display:flex;
    flex-direction:column;

  }

  #column2{
    display:flex;
    flex-direction:column;
  }
  .custom-text {
    font-weight: bold;
    font-size: 1.9em;
    border: 1px solid #cfcfcf;
    padding-left: 10px;
    padding-right: 10px;
    border-radius: 5px;
    color: #999;
    background: #fff;
  }
  .arrow.blueArrow:before{
    position: absolute;
    content: "";
    height: 2px;
    width: 12px;
    background: #7ac2ff;
    left: -1px;
    transform: rotate(45deg);
    top: 4px;
  }
  .arrow.redArrow:before{
    position: absolute;
    content: "";
    height: 2px;
    width: 12px;
    background: red;
    left: -1px;
    transform: rotate(45deg);
    top: 4px;
  }
  .arrow.blueArrow:after{
    position: absolute;
    content: "";
    height: 2px;
    width: 12px;
    background: #7ac2ff;
    left: -1px;
    transform: rotate(135deg);
    top: -4px;
  }
  .arrow.redArrow:after{
    position: absolute;
    content: "";
    height: 2px;
    width: 12px;
    background: red;
    left: -1px;
    transform: rotate(135deg);
    top: -4px;
  }
  .arrow {
    display:block;
    height: 2px;
    width: 35px;
    position: sticky;
  }
  .arrow.redArrow {background-color: red;}
  .arrow.blueArrow {background-color: #7ac2ff;}

  .margemTrocaAnalista {
    margin-left: 180px;
    margin-top: -18px;
  }
  .margemEncerramento {
    margin-left: 265px;
    margin-top: -18px;
  }
  .margemEnviaAvaliacao {
    margin-left: 260px;
    margin-top: -18px;
  }
  .margemEncerraSemAvaliacao {
    margin-left: 270px;
    margin-top: -18px;
  }
  .margemAssunto {
    margin-left: 600px;
    margin-top: -20px;
  }
  .bordaAguardandoAtendimento {
    border: 2px dotted #f40022;
    border-radius: 2px;
  }
  .bordaEmAtendimento {
    border: 2px dotted #67af6a;
    border-radius: 2px;
  }
  .bordaAguardandoAvaliacao {
    border: 2px dotted #00569f;
    border-radius: 2px;
  }
  .bordaChamadoAvaliado {
    border: 2px dotted #50afff;
    border-radius: 2px;
  }
  .bordaChamadoEncerrado {
    border: 2px dotted #020202;
    border-radius: 2px;
  }
  .arrowWrapper { margin-right: -20px; margin-left: -20px;}
</style>
