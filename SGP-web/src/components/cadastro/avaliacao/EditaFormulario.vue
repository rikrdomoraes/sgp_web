<template>
  <div class="content-wrapper" v-bind:style="'min-height: ' + alturaContentWrapper + 'px'">

    <vue-headful :title="'SGP - Edição de Formulário'"/>

    <section class="content-header">
      <h1>
        <span>{{_.isNull(formularioCarregado.id) ? 'Novo Formulário' : (ehVisualizacao ? 'Visualiza' : 'Edição de') + ' formulário  ID ' + formularioCarregado.id }}</span>

        <span v-if="!loading.tela && !ehVisualizacao">
          <span v-if="_.isNull(formularioCarregado.id)">
            <g-button-moema color="primary" @click.native="salvarEdicao()" type="button" v-if="salvaFormulario.statusSalvamento !== 'PROCESSANDO'"
                            :title="'<h5>Ao clicar ele criará este formulário no sistema para uso. Então antes de fazê-lo verifique se não existe um formulário desejado já criado</h5>'" v-tippy="{inertia:true, arrow:true, animation:'perspective', distance:'1', size:'large', arrow:true, delay: [500, 0]}"
            ><i class="fa fa-plus-circle" aria-hidden="true"></i> Cria novo formulário</g-button-moema>
            <span v-if="salvaFormulario.statusSalvamento === 'PROCESSANDO'" class='button--moema warning' style='font-size: 12px;padding: 8px 50px 10px 15px;border-radius: 2px !important;background: var(--cor-borda-dark) !important;cursor: not-allowed;'><i class='fa fa-refresh fa-spin'></i> Criando o formulário</span>
          </span>

          <span v-if="!_.isNull(formularioCarregado.id)">
            <span v-if="salvaFormulario.statusSalvamento === 'PROCESSANDO'" class='button--moema warning' style='font-size: 12px;padding: 8px 50px 10px 15px;border-radius: 2px !important;background: var(--cor-borda-dark) !important;cursor: not-allowed;'><i class='fa fa-refresh fa-spin'></i> Salvando</span>
            <span v-else-if="salvaFormulario.statusSalvamento === 'FEITO'" class='button--moema success' style='font-size: 12px;padding: 8px 10px 10px 15px;border-radius: 2px !important;background: var(--cor-verde) !important;cursor: not-allowed;'><i class='fa fa-check'></i> Formulário salvo</span>
            <span v-else><g-button-moema color="primary" @click.native="salvarEdicao()" type="button"><i class="fa fa-floppy-o" aria-hidden="true"></i> Salvar alterações</g-button-moema></span>
          </span>

        </span>

        <span v-if="!loading.tela">
          <g-button-moema color="warning" @click.native="$router.push({name: 'cadastro-formulario'})" type="button"><i class="fa fa-chevron-circle-left" aria-hidden="true"></i> Voltar</g-button-moema>

          <div class="espacamento_botoes"></div>

          <span v-if="!_.isNull(formularioCarregado.id)">
            <g-button-moema color="warning" @click.native="abreFormulario(_.split(formularioCarregado.link_acesso, '-')[3])" type="button"><i class="fa fa-external-link-square" aria-hidden="true"></i> Visualizar form em branco</g-button-moema>
            <g-button-moema color="warning" @click.native="abreFormulario(_.split(formularioCarregado.link_acesso, '-')[2])" type="button"><i class="fa fa-external-link-square" aria-hidden="true"></i>  Visualização</g-button-moema>
          </span>
        </span>
      </h1>

      <b-breadcrumb :items="[{text: 'Inicial', href: '/'}, {text: 'Cadastro', href: '#'}, {text: _.isNull(formularioCarregado.id) ? 'Novo' : (ehVisualizacao ? 'Visualização' : 'Edição'), active: true}]"/>
    </section>

    <section class="content">

      <div class="row">

        <div class="col-md-12">

          <div class="box box-primary">
            <div class="box-body form-horizontal" v-show="mostrarTitulo">
              <div class="required-field" :class="{ 'has-error' : errors.first('nome')}">
                <label class="control-label col-md-2">Título do Formulário</label>
                <div class="col-md-6">
                  <input v-model="formularioCarregado.nome" type="text" name="nome" ref="nome" class="form-control" v-validate="'required'" :disabled="ehVisualizacao" @blur="verificaNomeJaExiste" @keydown.esc="fecharEdicao"
                         :title="'<h5>O nome do formulário aparecerá como título ao preencher.<br/>O SGP não permitirá duplicidade de nomes.</h5>'" v-tippy="{inertia:true, arrow:true, animation:'perspective', distance:'1', size:'large', arrow:true, delay: [500, 0]}" />
                  <span v-if="errors.first('nome')" class="label label-danger"> Nome do formulário é obrigatório e não deve ser repetir</span>
                  <span v-if="errors.first('nome_existe')" class="label label-danger"> {{errors.first('nome_existe')}}</span>
                </div>
              </div>

              <div class="required-field" :class="{ 'has-error' : errors.first('tipo')}">
                <label class="control-label col-md-2">Tipo</label>
                <div class="col-md-2">
                  <select v-model="formularioCarregado.tipo" name="tipo" ref="tipo" class="form-control" v-validate="'required'" :disabled="ehVisualizacao"
                          @change="formularioCarregado.opcoes.periodicidade = null; formularioCarregado.opcoes.bi = !_.includes(['AVALIACAO_GENERICO', 'AVALIACAO_PARTICIPANTE'], formularioCarregado.tipo)"
                          :title="'<h5>O tipo do formulário define seu fluxo e tratamento pelo sistema: <span style=\'text-align: left\'>' +
                          '<p><span class=\'realce\'>Marco 0</span> ou <span class=\'realce\'>Marco 1</span> são enviados menualmente pela FBB ou automaticamente pelo SGP, aparecem para Validação (Análise) e podem ser devolvidos para Revisão</p>' +
                          '<p><span class=\'realce\'>Genérico</span> é enviado só manualmente, não possui Validação (é encerrado ao Concluir) e pode ser usado como sub formulário</p>' +
                          '<p><span class=\'realce\'>Participante</span> é iguai ao Genérico, mas é usado no cálculo de amostragem quando está como um sub formulário em outro do tipo Marco 0 ou 1</p>' +
                          '</span></h5>'" v-tippy="{inertia:true, arrow:true, animation:'perspective', distance:'1', size:'large', arrow:true, delay: [500, 0]}">
                    <option v-for="tipo in tipoFormulario" :value="tipo.codigo">{{tipo.descricao}}</option>
                  </select>
                  <span v-if="errors.first('tipo')" class="label label-danger"> {{ errors.first('tipo') }}</span>

                  <span v-if="errors.first('tipo_programa_existe')" class="label label-danger"> {{ errors.first('tipo_programa_existe') }}</span>
                </div>
              </div>
            </div>

            <div class="box-body form-horizontal" v-show="mostrarTitulo">
              <span v-if="loading.programas" class="etiquetaCarregando"><i class='fa fa-refresh fa-spin'></i> Carregando programas ...</span>
              <span v-if="!loading.programas">

                <div :class="(_.includes(['AVALIACAO_APROVACAO', 'AVALIACAO_ENCERRAMENTO'], formularioCarregado.tipo) ? 'required-field' : '') + (errors.first('programas_sociais') ? ' has-error' : '')">

                  <label class="control-label col-md-2">Programas</label>
                  <div :class="_.includes(['AVALIACAO_APROVACAO', 'AVALIACAO_ENCERRAMENTO'], formularioCarregado.tipo) ? 'col-md-6' : 'col-md-10'">

                    <multiselect v-model="formularioCarregado.opcoes.vinculo.programas"
                                 :options="programasSociais"
                                 :multiple="true"
                                 :close-on-select="true"
                                 :placeholder="'Pode vincular opcionalmente programas a este formulário'"
                                 track-by="id"
                                 :custom-label="(option) => { return `${option.id + ' - ' + option.descricao}`}"
                                 label="descricao"
                                 selectedLabel="Selecionado"
                                 selectLabel="Clique ou ENTER para selecionar"
                                 deselectLabel="Clique ou ENTER para remover"
                                 name="programas_sociais"
                                 ref="programas_sociais"
                                 data-vv-as="programas_sociais"
                                 v-validate="_.includes(['AVALIACAO_APROVACAO', 'AVALIACAO_ENCERRAMENTO'], formularioCarregado.tipo) ? 'required' : false"
                                 :disabled="ehVisualizacao"
                                 :title="'<h5>' + (_.includes(['AVALIACAO_APROVACAO', 'AVALIACAO_ENCERRAMENTO'], formularioCarregado.tipo) ?
                                 'É obrigatório quando o tipo for Marco 0 ou 1<br/> Deve escolher somente um programa neste caso' :
                                 'É opcional quando o tipo for Genérico ou Particiapnte. Pode deixar em branco ou escolher um ou mais programas') +
                                 '<p>O(s) programa(s) escolhido(s) limitam quais projetos do SGP podem ser vinculados ao formulário que será preenchido</p>' +
                                 '</h5>'" v-tippy="{inertia:true, arrow:true, animation:'perspective', distance:'1', size:'large', arrow:true, delay: [500, 0]}">

                      <template slot="option" slot-scope="props">
                        <span class="text-gray">{{ props.option.id }} </span> {{ props.option.descricao }}
                      </template>
                    </multiselect>

                    <span v-if="errors.first('programas_sociais')" class="label label-danger"> {{ errors.first('programas_sociais') }}</span>
                  </div>
                </div>
              </span>

              <div v-if="_.includes(['AVALIACAO_APROVACAO', 'AVALIACAO_ENCERRAMENTO'], formularioCarregado.tipo)">
                <label class="control-label col-md-2">Prazo resposta</label>
                <div class="col-md-2">
                  <select v-model="formularioCarregado.opcoes.periodicidade" name="periodicidade" class="form-control" :disabled="ehVisualizacao"
                          :title="'<h5>Definir prazo para cobrança de preenchimento da entidade</h5>'"
                          v-tippy="{inertia:true, arrow:true, animation:'perspective', distance:'1', size:'large', arrow:true, delay: [500, 0]}">
                    <option :value="null">Sem aviso</option>
                    <option v-for="n in 12" :value="n">{{n}} {{n > 1 ? 'meses' : 'mês'}}</option>
                  </select>
                </div>
              </div>
            </div>

            <div class="box-body form-horizontal" v-show="mostrarTitulo">
              <div class="required-field" :class="{ 'has-error' : (errors.first('apos abrir') )}">
                <label class="control-label col-md-2">Após abrir</label>
                <div class="col-md-3">
                  <select v-model="formularioCarregado.opcoes.abrir.acao" name="apos abrir" ref="apos abrir" class="form-control" v-validate="'required'" :disabled="ehVisualizacao"
                          :title="'<h5>Logo que um formulário abrir para preenchimento ele pode estar:<span style=\'text-align: left\'>' +
                          '<p><span class=\'realce\'>Normal</span> onde todos os campos e funcionalidades estarão disponíveis</p>' +
                          '<p><span class=\'realce\'>Somente Leitura</span> força para que todo o conteúdo não possa ser alterado. Ideal para formulários (telas) de <b>agradecimento</b></p>' +
                          '</span></h5>'" v-tippy="{inertia:true, arrow:true, animation:'perspective', distance:'1', size:'large', arrow:true, delay: [500, 0]}">
                    <option v-for="acao in acoesAposAbrir" :value="acao.codigo">{{acao.descricao}}</option>
                  </select>
                  <span v-if="errors.first('apos abrir')" class="label label-danger"> {{ errors.first('apos abrir') }}</span>
                </div>
              </div>

              <div class="required-field" :class="{ 'has-error' : errors.first('elemento chave')}">
                <label class="control-label col-md-2">Elemento chave</label>
                <div class="col-md-5">
                  <select v-model="formularioCarregado.opcoes.elemento_chave" name="elemento chave" class="form-control" :disabled="ehVisualizacao"
                          :title="'<h5>Nesta lista aparecerão todos os elementos do tipo <i>TEXTO_SIMPLES</i> ou <i>NUMERO</i> que constam no formulário<br/><br/>' +
                          '<p>Se um elemento desta lista for escolhido como chave, o sistema não permitirá durante o preenchimento que o formulário seja concluído se já houver outro entregue antes com o mesmo valor informado</p>' +
                          '<p>Ideal para campos como CPF em formulários tipo Participante, por exemplo</p>' +
                          '</h5>'" v-tippy="{inertia:true, arrow:true, animation:'perspective', distance:'1', size:'large', arrow:true, delay: [500, 0]}">
                    <option :value="null">Não há</option>
                    <option v-for="(controle, idx) in _.filter(editandoFormulario, function(c) {return _.includes(['NUMERO', 'TEXTO_SIMPLES'], c.elemento)})" :value="controle.id">({{controle.id}}) {{removerTagHtmlString(controle.titulo)}}</option>
                  </select>
                </div>
              </div>
            </div>

            <div class="box-body form-horizontal" v-show="mostrarTitulo">
              <div class="required-field" :class="{ 'has-error' : (errors.first('apos concluir') || errors.first('concluir_url') || errors.first('concluir_formulario'))}">
                <label class="control-label col-md-2">Após Concluir</label>
                <div class="col-md-3">
                  <select v-model="formularioCarregado.opcoes.concluir.acao" name="apos concluir" ref="apos concluir" class="form-control" v-validate="'required'" :disabled="ehVisualizacao"
                          @change="formularioCarregado.opcoes.concluir.parametro = null"
                          :title="'<h5>Logo que o preenchimento de um formulário for concluído, o SGP:<span style=\'text-align: left\'>' +
                          '<p><span class=\'realce\'>Sai da tela</span> de preenchimento e vai para a tela inicial ou SGP (comportamento padrão)</p>' +
                          '<p><span class=\'realce\'>Abre o formulário</span> já criado para que inicie outro preenchimento (útil para <b>agradecimentos</b> ou encadeamento de formulários diferentes)</p>' +
                          '<p><span class=\'realce\'>Vai para o endereço</span> defindo, por exemplo a página oficial da FBB ou outra url (útil para agregar valor ao formulário com outro site)</p>' +
                          '</span></h5>'" v-tippy="{inertia:true, arrow:true, animation:'perspective', distance:'1', size:'large', arrow:true, delay: [500, 0]}">
                    <option v-for="acao in acoesAposConcluir" :value="acao.codigo">{{acao.descricao}}</option>
                  </select>
                  <span v-if="errors.first('apos concluir')" class="label label-danger"> Escolha um item da lista</span>
                </div>

                <div class="col-md-7" v-if="formularioCarregado.opcoes.concluir.acao === 'ABRIR_URL'">
                  <input v-model="formularioCarregado.opcoes.concluir.parametro" type="text" name="concluir_url" ref="concluir_url" class="form-control" v-validate="'required'" :disabled="ehVisualizacao" placeholder="https://www.fbb.org.br"
                         :title="'<h5>Informe um url válida, exemplo <i>https://www.fbb.org.br</i><br/> que o SGP irá, logo após o preenchimento seja concluído pelo usuário<br/><br/>' +
                         'Útil para complementar informação direcionando para páginas de parceiros ou notícias ou agradecimentos ou outro formulário (do SGP ou não) etc</h5>'"
                         v-tippy="{inertia:true, arrow:true, animation:'perspective', distance:'1', size:'large', arrow:true, delay: [500, 0]}" />
                  <span v-if="errors.first('concluir_url')" class="label label-danger"> Informe um endereço web para o qual o usuário que estiver preenchedo será direcionado após concluir</span>
                </div>

                <div class="col-md-7" v-if="formularioCarregado.opcoes.concluir.acao === 'ABRIR_FORMULARIO'">
                  <select v-model="formularioCarregado.opcoes.concluir.parametro" name="concluir_formulario" ref="concluir_formulario" class="form-control" v-validate="'required'" :disabled="ehVisualizacao"
                          :title="'<h5>Escolha nesta lista, um dos formulário ativos já cadastrados no SGP<br/><br/>' +
                          '<p>Logo após o preenchimento seja concluído pelo usuário, o SGP abrirá o formulário selecionado</p>' +
                          '<p>Atente que: o formulário novo aberto não faz parte do fluxo do formulário anterior</p>' +
                          '<p>Assim, o novo não terá informações sensíveis ao processo anterior, que é útil para telas de agradecimento ou quando se quer separar informações e fluxos bem distintos (como um formulário sendo de proposta e outro de cadastro de entidade, por exemplo)</p>' +
                          '</h5>'"
                          v-tippy="{inertia:true, arrow:true, animation:'perspective', distance:'1', size:'large', arrow:true, delay: [500, 0]}">
                    <option v-for="formulario in _.filter(controles, ['grupo', 'FORMULARIO'])" :value="formulario.configuracao.padrao[0]">{{formulario.informacao}}</option>
                  </select>
                  <span v-if="errors.first('concluir_formulario')" class="label label-danger"> Deve informar um formulário que abrirá logo após concluir preenchimento deste formulário</span>
                </div>
              </div>
            </div>

            <div class="box-body form-horizontal" v-show="mostrarTitulo">
              <div>
                <label class="control-label col-md-2">Numeração automática</label>
                <div class="col-md-2">
                  <select v-model="formularioCarregado.opcoes.numeracao" name="numeracao automatica" class="form-control" :disabled="ehVisualizacao" @change="numeracaoAutomatica"
                          :title="'<h5>Selecione a opção desejada quanto numeração das questões do form.</p>' +
                          '<p>Atente que a numeração é atribuída a todos os elementos (exceto de layout), independentemente do elemento estar visível ou ocultado, ou seja,<br/>' +
                          'se um formulário tiver elementos ocultos, a numeração vai aparentar que está \'quebrada\' ou não sequencial</p></h5>'"
                          v-tippy="{inertia:true, arrow:true, animation:'perspective', distance:'1', size:'large', arrow:true, delay: [500, 0]}">
                    <option v-for="acao in opcoesNumeracaoAutomatica" :value="acao.codigo">{{acao.descricao}}</option>
                  </select>
                </div>
              </div>

              <div>
                <label class="control-label col-md-2">Permitir observações</label>
                <div class="col-md-2">
                  <select v-model="formularioCarregado.opcoes.observacao" name="observacao" class="form-control" :disabled="ehVisualizacao"
                          :title="'<h5>Se desejar que haja um campo de observação opcional para o usuário fazer apontamentos, mas que não devem constar nos dados do formulário (não irão para O BI nem para o Excel), então escolha uma das opções abaixo de quem pode usar este campo</p>' +
                          '<p>Atente para o que for informado neste campo ficará em destaque no topo do formulário preenchido e no histórico do fluxo do processo</p></h5>'"
                          v-tippy="{inertia:true, arrow:true, animation:'perspective', distance:'1', size:'large', arrow:true, delay: [500, 0]}">
                    <option v-for="acao in opcoesObservacao" :value="acao.codigo">{{acao.descricao}}</option>
                  </select>
                </div>
              </div>

              <div>
                <label class="control-label col-md-2">Exibir histórico</label>
                <div class="col-md-2">
                  <select v-model="formularioCarregado.opcoes.historico" name="historico" class="form-control" :disabled="ehVisualizacao"
                          :title="'<h5>O fluxo do processo gera um histórico de etapas concluídas (solicitação, revisão, análise etc) que podem ser vistos <b>por todos</b>, <b>só pela FBB</b> ou não exibidos</p>' +
                          '<p>Observação: mesmo que o histórico não seja exibido, ele é gerado e guardado para conferência e auditoria, se necessário</p></h5>'"
                          v-tippy="{inertia:true, arrow:true, animation:'perspective', distance:'1', size:'large', arrow:true, delay: [500, 0]}">
                    <option v-for="acao in opcoesHistorico" :value="acao.codigo">{{acao.descricao}}</option>
                  </select>
                </div>
              </div>

            </div>

            <div class="box-body">

              <div class="col-md-9 alca_mostrar_ocultar" @click="mostrarTitulo = !mostrarTitulo"><div></div><i :class="'fa fa-chevron-' + (mostrarTitulo ? 'up' : 'down')" style="padding: 2px"></i>&nbsp;</div>
              <div class="col-md-3 alca_mostrar_ocultar" @click="mostrarComponentes = !mostrarComponentes"><div></div><i :class="'fa fa-chevron-' + (mostrarComponentes ? 'right' : 'left')" style="padding: 2px 4px"></i>&nbsp;</div>

              <div class="row">

        <!-- Seção de edição do formulário ------------------------------------------------------------------------>
                <div :class="mostrarComponentes ? 'col-md-9' : 'col-md-12'" id="edicao_formulario" v-bind:style="'overflow-y: auto; height: ' + (alturaContentWrapper - (mostrarTitulo ? 372 : 94)) + 'px;'">

                  <span v-if="editandoFormulario.length === 0">
                    <draggable tag="div" class="list-group" handle=".handle" group="edicao" v-bind="{animation: 200, group: 'edicao', disabled: false, ghostClass: 'ghost'}" @start="dragging = true" @end="dragging = false" :list="editandoFormulario">
                      <p style="margin: 20px; font-style: italic; color: var(--cor-destaque);">
                        <span v-if="errors.first('edicao_formulario')" class="label label-danger">{{ errors.first('edicao_formulario') }}</span>
                        <span v-else>Conteúdo do formulário aqui<br/>Arraste para cá ou Clique num dos controles à direta</span>
                      </p>
                    </draggable>
                  </span>

                  <span v-else>
                    <draggable
                      tag="div"
                      class="list-group"
                      handle=".handle"
                      group="edicao"
                      v-bind="{animation: 200, group: 'edicao', disabled: false, ghostClass: 'ghost'}"
                      @start="dragging = true"
                      @end="dragging = false"
                      :list="editandoFormulario">

                        <div v-for="(controle, idx) in editandoFormulario"
                             :class="'box-body elemento' + (!controle.mostrar ? ' marcar_oculto' : '') +
                                (!_.isNull(editandoElemento) ? (editandoElemento.id !== controle.id ? ' controle_esmaecido' : ' caixa_propriedades') : '')">

                      <!-- Botões de ação do elemento -->
                          <div class="botoes_acao_elemento">
                            <span style="color: var(--cor-fraca); padding: 0 5px; cursor: default">{{controle.id}}</span>
                            <span class="botao_acao_elemento elemento_fechar" @click="fecharEdicao" v-show="!_.isNull(editandoElemento) && editandoElemento.id === controle.id"><i class="fa fa-close"></i></span>
                            <span class="botao_acao_elemento elemento_mover" @click="moveElemento(idx, -1, editandoFormulario)" v-show="idx > 0"><i class="fa fa-arrow-up"></i></span>
                            <span class="botao_acao_elemento elemento_mover" @click="moveElemento(idx, 1, editandoFormulario)" v-show="idx < editandoFormulario.length - 1"><i class="fa fa-arrow-down"></i></span>
                            <span class="botao_acao_elemento elemento_duplicar" @click="duplicaElemento(idx, controle)" v-show="!_.find(editandoFormulario, ['id', controle.bi])"><i class="fa fa-files-o"></i></span>
                            <span class="botao_acao_elemento elemento_excluir" @click="removeElemento(idx)"><i class="fa fa-trash"></i></span>
                          </div>


                      <!-- Elementos do formulário -->
                          <div v-if="_.includes(['CONTROLE', 'PERSONALIZADO'], controle.grupo)" @click="editaElemento(idx)" v-show="!(!_.isNull(editandoElemento) && editandoElemento.id === controle.id && !dragging)">

                            <div :id="controle.id" :ref="controle.id" :class="'row handle' + (controle.obrigatorio ? ' required-field' : '')">

                              <label class="control-label col-md-12 tituloControle">
                                <span class="text-gray" v-if="!_.isNull(formularioCarregado.opcoes.numeracao) && _.has(controle, 'numeracao')">{{ controle.numeracao }})</span>

                                <span v-html="_.isEmpty(controle.titulo) ? 'Informe o tílulo' : controle.titulo"></span>
                                <i v-if="_.has(controle, 'descricao') && !_.isEmpty(controle.descricao)" class="fa fa-question-circle" :title="'<h5>' + (controle.descricao) + '</h5>'" aria-hidden="true" v-tippy="{inertia:true, arrow:true, animation:'perspective', distance:'1', size:'large', arrow:true}"></i>
                              </label>


                              <div :class="_.includes(['TELEFONE', 'CNPJ', 'CPF'], controle.configuracao.formato) ? 'col-md-4' : 'col-md-3'" v-if="controle.elemento === 'NUMERO'">
                                <input class="form-control" type="text" :disabled="true"
                                       :placeholder="controle.configuracao.formato === 'CPF' ? '000.000.000-00' :
                                       (controle.configuracao.formato === 'CNPJ' ? '00.000.000/0000-00' :
                                       (controle.configuracao.formato === 'TELEFONE' ? '(00) 0000-0000' :
                                       (controle.configuracao.formato === 'INTEIRO' ? '0' :
                                       (controle.configuracao.formato === 'CEP' ? '00000-000' :
                                       (controle.configuracao.formato === 'DECIMAL' ? '0,0000' : 'R$ 0,00')))))"/>
                              </div>

                              <div class="col-md-12" v-if="controle.elemento === 'TEXTO_SIMPLES'">
                                <input type="text" class="form-control" :disabled="true" :maxlength="_.toSafeInteger(controle.configuracao.maximo) === 0 ? 250 : _.toSafeInteger(controle.configuracao.maximo)" />
                                <i v-if="_.toSafeInteger(controle.configuracao.maximo) > 1" style="float: right; color: silver">Até {{_.toSafeInteger(controle.configuracao.maximo)}} caracteres</i>
                              </div>

                              <div class="col-md-12" v-if="controle.elemento === 'TEXTO_LONGO'">
                                <textarea v-resizable class="form-control" :disabled="true"></textarea>
                                <i v-if="_.toSafeInteger(controle.configuracao.maximo) > 1 && controle.configuracao.formato === 'SOMENTE_TEXTO'" style="float: right; color: silver">Até {{_.toSafeInteger(controle.configuracao.maximo)}} caracteres</i>
                              </div>

                              <div class="col-md-6" v-if="controle.elemento === 'SELECAO_SIMPLES'">
                                <select class="form-control" :disabled="true"></select>
                              </div>

                              <div class="col-md-6" v-if="controle.elemento === 'SELECAO_MULTIPLA'">
                                <select class="form-control" :disabled="true"></select>
                              </div>

                              <div class="col-md-6" v-if="controle.elemento === 'BOOLEANO'">
                                <span>
                                  <label class="radio-inline new-control new-control-radio" style="padding-top: 7px;"><input type="radio" :disabled="true"> {{controle.configuracao.conteudo.linhas[0].descricao}} <div class="new-control-indicator"></div></label>
                                  <label class="radio-inline new-control new-control-radio" style="padding-top: 7px;"><input type="radio" :disabled="true"> {{controle.configuracao.conteudo.linhas[1].descricao}} <div class="new-control-indicator"></div></label>
                                </span>
                              </div>

                              <div class="col-md-12" v-if="controle.elemento === 'CLASSIFICACAO'">
                                <span v-if="controle.configuracao.formato === 'NUMEROS'">
                                  <span class="fa fa-stack fa-2x elemento_classificacao classificacao_numeral" v-for="n in _.range(_.toSafeInteger(controle.configuracao.minimo), _.toSafeInteger(controle.configuracao.padrao) + 1)">
                                    <i class="fa fa-solid fa-circle-thin fa-stack-1x"></i>
                                    <span class="fa fa-stack-1x">{{n}}</span>
                                  </span>
                                </span>
                                <span v-else>
                                  <i :class="'elemento_classificacao fa fa-2x ' + (_.isNull(controle.configuracao.formato) || controle.configuracao.formato === 'ESTRELA' ? 'fa-star-o' : (controle.configuracao.formato === 'CIRCULO' ? 'fa-circle-thin' : (controle.configuracao.formato === 'LIKE' ? 'fa-thumbs-o-up' : 'fa-smile-o')))"
                                     v-for="n in _.range(_.toSafeInteger(controle.configuracao.minimo), _.toSafeInteger(controle.configuracao.padrao) + 1)"></i>
                                </span>
                              </div>

                              <div class="col-md-4" v-if="controle.elemento === 'DATA'">
                                <input type="date" class="form-control" :disabled="true"/>
                              </div>

                              <div class="col-md-8" v-if="controle.elemento === 'PERIODO'">
                                <div class="input-group">
                                  <span class="input-group-btn"><span class="btn" style="cursor: default">De</span></span>
                                  <input type="date" class="form-control" :disabled="true"/>
                                  <span class="input-group-btn"><span class="btn" style="cursor: default">Até</span></span>
                                  <input type="date" class="form-control" :disabled="true"/>
                                </div>
                              </div>

                              <div class="col-md-12" v-if="controle.elemento === 'NPS'">
                                <table class="elemento_NPS_escala" border="1">
                                  <tr><td v-for="n in _.range(1, _.toSafeInteger(controle.configuracao.padrao) + 1)" class="text-center"> {{n}} </td></tr>
                                </table>
                                <table class="elemento_NPS_limites">
                                  <tr><td class="truncar">{{controle.configuracao.conteudo.linhas[0].descricao}}</td><td class="text-right truncar">{{controle.configuracao.conteudo.linhas[1].descricao}}</td></tr>
                                </table>
                              </div>


                              <div class="col-md-12" v-if="controle.elemento === 'LIKERT'">
                                <table class="elemento_likert_matrix table-hover">
                                  <thead>
                                  <tr>
                                    <th class="w30">&nbsp;</th>
                                    <th v-for="coluna in controle.configuracao.conteudo.colunas" class="elemento_likert_cabecalho_coluna"  v-if="coluna.mostrar">{{coluna.descricao}}</th>
                                  </tr>
                                  </thead>
                                  <tr v-for="linha in controle.configuracao.conteudo.linhas">
                                    <td class="elemento_likert_pergunta">{{_.isEmpty(linha.descricao) ? 'Informe uma questão ...' : linha.descricao}}</td>
                                     <td v-for="coluna in controle.configuracao.conteudo.colunas" class="elemento_likert_opcoes" v-if="coluna.mostrar"><i class="fa fa-circle-thin fa-2x"></i></td>
                                  </tr>
                                </table>
                              </div>


                              <div class="col-md-6" v-if="controle.elemento === 'UF_MUNICIPIO'">
                                <multiselect placeholder="Nome do município" :options="[]" :disabled="true"></multiselect>
                              </div>

                            </div>

                          </div>



                      <!-- Elementos de Layout no formulário -->
                          <div v-if="_.includes(['LAYOUT'], controle.grupo)" @click="editaElemento(idx)" v-show="!(!_.isNull(editandoElemento) && editandoElemento.id === controle.id && !dragging)">

                            <div v-if="controle.elemento === 'TEXTO_FIXO'" class="row handle">
                              <div class="col-md-12" v-html="controle.titulo"/>
                            </div>

                            <div v-if="controle.elemento === 'LINHA_HORIZONTAL'" class="row handle">
                              <hr/>
                            </div>

                            <div v-if="controle.elemento === 'LOGOMARCA_FBB'" class="row handle">
                              <div class="col-md-12" v-if="!_.isEmpty(controle.descricao)">
                                <a :href="controle.descricao">
                                  <img :src="_.get(controle.configuracao, 'formato', 'LOGO_HORIZONTAL') === 'LOGO_HORIZONTAL' ? '/static/img/logo-login.png' : '/static/img/logo-vertical.png'" :alt="controle.titulo" />
                                </a>
                              </div>
                              <div class="col-md-12" v-else>
                                <img :src="_.get(controle.configuracao, 'formato', 'LOGO_HORIZONTAL') === 'LOGO_HORIZONTAL' ? '/static/img/logo-login.png' : '/static/img/logo-vertical.png'" :alt="controle.titulo" />
                              </div>
                            </div>

                            <div :class="('secao_' + (_.isEmpty(controle.configuracao) ? 'padrao' : _.toLower(controle.configuracao.formato))) + ' row handle'" v-if="controle.elemento === 'SECAO'" v-bind:style="!_.isNull(editandoFormulario) ? 'color: black !important' : ''">
                              <div class="col-md-12">
                                <span v-html="controle.titulo"></span>
                                <i v-if="_.has(controle, 'descricao') && !_.isEmpty(controle.descricao)" class="fa fa-question-circle" :title="'<h5>' + (controle.descricao) + '</h5>'" aria-hidden="true" v-tippy="{inertia:true, arrow:true, animation:'perspective', distance:'1', size:'large', arrow:true}"></i>
                              </div>
                            </div>

                          </div>



                      <!-- Elementos de Subformulário no formulário -->
                          <div v-if="controle.grupo === 'FORMULARIO'" @click="editaElemento(idx)" v-show="!(!_.isNull(editandoElemento) && editandoElemento.id === controle.id && !dragging)">

                            <div class="row handle">
                              <label class="control-label col-md-12">
                                <span class="text-gray" v-if="!_.isNull(formularioCarregado.opcoes.numeracao) && _.has(controle, 'numeracao')">{{ controle.numeracao }})</span>

                                <span v-html="_.isEmpty(controle.titulo) ? 'Informe o tílulo' : controle.titulo"></span>
                                <i v-if="_.has(controle, 'descricao') && !_.isEmpty(controle.descricao)" class="fa fa-question-circle" :title="'<h5>' + (controle.descricao) + '</h5>'" aria-hidden="true" v-tippy="{inertia:true, arrow:true, animation:'perspective', distance:'1', size:'large', arrow:true}"></i>
                              </label>

                              <span v-if="!_.includes(['SOMENTE_LINK'], controle.configuracao.formato)">

                                <div class="col-md-2" v-if="_.includes(['COMPLETO_COM_LINK', 'COMPLETO_SEM_LINK'], controle.configuracao.formato)">
                                  <g-button-ujarak color="primary" type="button"><i class="fa fa-plus-circle" aria-hidden="true"></i>  Adicionar</g-button-ujarak>
                                </div>

                                <div class="col-md-4">
                                  <input type="text" class="form-control" placeholder="Pesquisa..." :disabled="true">
                                </div>

                                <div class="col-md-6" v-if="_.includes(controle.configuracao.formato, 'COM_LINK')">
                                  Link para este formulário: <br/>
                                  <a href="#">{{urlLaravel + '/formulario/' + controle.configuracao.padrao[0]}}</a>
                                  <br/>
                                </div>

                                <div class="col-md-12">&nbsp;</div> <!-- linha em branco-->

                                <div class="">
                                  <b-container fluid>
                                    <b-table show-empty
                                             stacked="md"
                                             striped
                                             :bordered="controle.configuracao.conteudo.bordered"
                                             :items="controle.valor"
                                             :fields="controle.configuracao.conteudo.colunas"
                                             :current-page="controle.configuracao.conteudo.currentPage"
                                             :per-page="controle.configuracao.conteudo.perPage"
                                             empty-filtered-text="Nada foi encontrado. Refaça sua pesquisa!"
                                             empty-text="Nenhum registro encontrado"
                                             :sort-by.sync="controle.configuracao.conteudo.sortBy"
                                             :sort-desc.sync="controle.configuracao.conteudo.sortDesc">

                                      <template slot="actions" scope="row" v-if="!_.includes(controle.configuracao.formato, 'MINIMO')">
                                        <g-button-ujarak color="primary" size="button--size-ss" v-if="_.includes(controle.configuracao.formato, 'COMPLETO')"><i class="fa fa-pencil-square-o" aria-hidden="true"></i> Editar</g-button-ujarak >
                                        <g-button-ujarak color="error" size="button--size-ss" v-if="_.includes(controle.configuracao.formato, 'COMPLETO')"><i class="fa fa-trash" aria-hidden="true"></i> Excluir</g-button-ujarak >
                                        <g-button-ujarak color="success" size="button--size-ss"> <i class="fa fa-search" aria-label="false"></i> Visualizar</g-button-ujarak>
                                      </template>

                                    </b-table>

                                    <b-row>
                                      <b-col md="6" class="my-1" right>
                                        <b-pagination :total-rows="controle.configuracao.conteudo.totalRows" :per-page="controle.configuracao.conteudo.perPage" v-model="controle.configuracao.conteudo.currentPage" class="my-3" />
                                      </b-col>
                                    </b-row>

                                  </b-container>
                                </div>
                              </span>

                              <span v-else>
                                <div class="col-md-12">
                                  Link de acesso para este formulário. Repasse para quem for preencher ele: <br/>
                                  <a href="#">{{urlLaravel + '/formulario/' + controle.configuracao.padrao[0]}}</a>
                                </div>
                              </span>

                            </div>

                          </div>



                      <!-- Propriedades dos elementos do formulário em edição --------------------------------------------------------------->
                          <div class="elemento_propriedades well-sm form-horizontal" v-if="!_.isNull(editandoElemento) && editandoElemento.id === controle.id && !dragging">

                            <div class="form-group required-field">
                              <label class="control-label col-md-2">{{controle.elemento === 'TEXTO_FIXO' ? 'Texto' : 'Título'}}</label>

                              <div class="col-md-10">
                                <quill-editor
                                  v-model="controle.titulo"
                                  ref="refQuillEditor"
                                  :disabled="controle.grupo === 'PERSONALIZADO'"
                                  :options="controle.elemento === 'TEXTO_FIXO' ? quillOptionsCompleto : quillOptionsTitulo"
                                  @keydown.esc="fecharEdicao"
                                >
                                </quill-editor>
                              </div>
                            </div>


                            <div class="form-group" v-if="controle.elemento !== 'TEXTO_FIXO'">
                              <label class="control-label col-md-2">Ajuda</label>
                              <div class="col-md-10">
                                <div class="input-group">
                                  <input type="text" class="form-control" v-model="controle.descricao" @keydown.esc="fecharEdicao"/>
                                  <span class="input-group-btn" v-if="!_.isEmpty(controle.descricao) || controle.grupo !== 'PERSONALIZADO'">
                                    <button @click="controle.descricao = null" type="button" class="btn" style="background: white; border-color: #d2d6de; border-width: 1px 1px 1px 0px;"><i class="fa fa-remove"></i></button>
                                  </span>
                                </div>
                              </div>
                            </div>


                            <div class="form-group">
                              <label class="control-label col-md-2">Opções</label>
                              <div class="col-md-10 indicadores-cb-inline">
                                <div class="juntos" v-if="_.includes(['CONTROLE', 'PERSONALIZADO'], controle.grupo)">
                                  <i @click="controle.obrigatorio = !controle.obrigatorio"
                                     :class="(controle.obrigatorio ? 'fa fa-check-square-o selecionado' : 'fa fa-square-o')" aria-hidden="true"></i>
                                  <span :class="controle.obrigatorio ? 'selecionado' : ''"> Obrigatório</span>
                                </div>


                                <div class="juntos">
                                  <span v-if="controle.elemento === 'SECAO'">
                                    <i @click="mostraOcultaElemento(idx)"
                                       :class="(controle.mostrar ? 'fa fa-check-square-o selecionado' : 'fa fa-square-o')" aria-hidden="true"></i>
                                    <span :class="controle.mostrar ? 'selecionado' : ''"> {{ 'Mostrará ou Ocultará ' + (elementosSecao(idx).length === 0 ? 'esta seção' : 'os elementos nesta seção') }}</span>
                                  </span>
                                  <span v-else>
                                    <span v-if="_.isNull(elementosSecao(idx)) || _.get(elementosSecao(idx), 'mostrar')">
                                      <i @click="mostraOcultaElemento(idx)" :class="(controle.mostrar ? 'fa fa-check-square-o selecionado' : 'fa fa-square-o')" aria-hidden="true"></i>
                                      <span :class="controle.mostrar ? 'selecionado' : ''"> Mostrar</span>
                                    </span>
                                    <span v-else :title="'<h5>Este elemento está em uma seção oculta, então não pode ser mostrado isoladamente</h5>'" v-tippy="{inertia:true, arrow:true, animation:'perspective', distance:'1', size:'large', arrow:true}">
                                      <i class="fa fa-square"></i> Seção ocultada
                                    </span>
                                  </span>
                                </div>

                              </div>
                            </div>


                            <span v-if="!_.isEmpty(controle.configuracao)">

                              <div class="form-group" v-if="_.includes(['NUMERO', 'LOGOMARCA_FBB', 'CLASSIFICACAO', 'TEXTO_LONGO', 'SUB_FORMULARIO', 'SELECAO_SIMPLES', 'SECAO'], controle.elemento)">
                                <label class="control-label col-md-2">Formato</label>
                                <div class="col-md-4">
                                  <select v-model="controle.configuracao.formato" class="form-control" :disabled="controle.grupo === 'PERSONALIZADO'">
                                    <option v-for="item in _.get(_.find(formatoValores, ['elemento', controle.elemento]), 'formatos')" :value="item.valor">{{item.descricao}} </option>
                                  </select>
                                </div>
                                <span v-if="controle.grupo === 'FORMULARIO'">
                                  {{ _.get(_.find(_.get(_.find(formatoValores, ['elemento', 'SUB_FORMULARIO']), 'formatos'), ['valor', controle.configuracao.formato]), 'info') }}
                                </span>
                              </div>


                              <div class="form-group" v-if="_.includes(['TEXTO_SIMPLES', 'CLASSIFICACAO', 'NPS'], controle.elemento) || (controle.elemento === 'NUMERO' && _.includes(['INTEIRO', 'DECIMAL', 'MOEDA'], controle.configuracao.formato)) || (controle.elemento === 'TEXTO_LONGO' && _.includes(['SOMENTE_TEXTO'], controle.configuracao.formato))">
                                <label class="control-label col-md-2">Quantidade</label>
                                <div class="col-md-10" v-if="_.includes(['CLASSIFICACAO', 'NPS'], controle.elemento)">
                                  <input class="form-control" type="number" v-model="controle.configuracao.padrao" :min="controle.configuracao.minimo" :max="controle.configuracao.maximo" :disabled="controle.grupo === 'PERSONALIZADO'" @keydown.esc="fecharEdicao"
                                         :title="'<h5>Limite de <b>' + controle.configuracao.minimo + '</b> até <b>' + controle.configuracao.maximo + '</b></h5>'" v-tippy="{inertia:true, arrow:true, animation:'perspective', distance:'1', size:'large', arrow:true}" />
                                </div>

                                <div class="col-md-10" v-else-if="_.includes(['TEXTO_SIMPLES', 'TEXTO_LONGO'], controle.elemento)">
                                  <input class="form-control" type="number" v-model="controle.configuracao.maximo" :min="controle.configuracao.minimo" max="2147483647" :disabled="controle.grupo === 'PERSONALIZADO'" @keydown.esc="fecharEdicao"
                                         :title="'<h5>' + (_.toSafeInteger(controle.configuracao.maximo) === 0 ? 'Sem limite de caracteres' : (_.toSafeInteger(controle.configuracao.maximo) > 1 ? 'Limitado a ' + _.toSafeInteger(controle.configuracao.maximo) + ' caracteres' : '1 caractere somente')) + '</h5>'" v-tippy="{inertia:true, arrow:true, animation:'perspective', distance:'1', size:'large', arrow:true}" />
                                </div>

                                <div class="col-md-10" v-else-if="(controle.elemento === 'NUMERO' && _.includes(['INTEIRO', 'DECIMAL', 'MOEDA'], controle.configuracao.formato))">
                                  <div class="col-md-1">De</div>
                                  <div class="col-md-3"><input class="form-control" type="number" v-model="controle.configuracao.minimo" min="0" :max="controle.configuracao.maximo" :disabled="controle.grupo === 'PERSONALIZADO'" @keydown.esc="fecharEdicao" /></div>
                                  <div class="col-md-2">Até</div>
                                  <div class="col-md-3"><input class="form-control" type="number" v-model="controle.configuracao.maximo" :min="controle.configuracao.minimo" max="2147483647" :disabled="controle.grupo === 'PERSONALIZADO'" @keydown.esc="fecharEdicao" /></div>
                                </div>
                              </div>



                        <!-- Seção de Conteúdo das listas dinâmicas (seleção simples e multipla, likert, booleano, nps) --------------------------------------------------------------->
                              <div v-if="_.includes(['SELECAO_SIMPLES', 'SELECAO_MULTIPLA', 'BOOLEANO', 'NPS', 'LIKERT'], controle.elemento) && !_.isNull(controle.configuracao.conteudo)">
                                <div class="form-group" v-if="!_.isNull(controle.configuracao.conteudo.linhas)">
                                  <label class="control-label col-md-2">Conteúdo</label>


                            <!-- Elementos da lista (opções para seleções, questões para likert, nomes para booleano e nps)-->
                                  <div class="col-md-10">
                                    <table :class="'table table-condensed ' + (controle.grupo === 'PERSONALIZADO' ? '' : 'table-hover')">
                                      <template v-if="controle.configuracao.formato === 'CONTEUDO_FIXO'">
                                        <tr v-for="(item, idx) in controle.configuracao.conteudo.linhas">
                                          <td style="width: 40%">
                                            <input class="form-control" type="text" v-model="item.descricao" :disabled="controle.grupo === 'PERSONALIZADO'" @keydown.esc="fecharEdicao" />
                                          </td>
                                          <td v-if="!_.isNull(item.valor) && item.valor !== ''" style="width: 20%">
                                            <input class="form-control" type="text" v-model="item.valor" :disabled="controle.grupo === 'PERSONALIZADO'" @keydown.esc="fecharEdicao" />
                                          </td>
                                          <td></td>
                                        </tr>
                                      </template>

                                      <template v-else>
                                        <draggable
                                          group="lista_conteudo"
                                          :disabled="controle.grupo === 'PERSONALIZADO'"
                                          v-model="controle.configuracao.conteudo.linhas"
                                          v-bind="{animation: 200, group: 'lista_conteudo', disabled: false, ghostClass: 'ghost'}"
                                          tag="tbody">

                                          <tr v-for="(item, idx) in controle.configuracao.conteudo.linhas" :class="controle.grupo !== 'PERSONALIZADO' ? 'item_conteudo handle_conteudo' : ''">
                                            <td class="w40" v-bind:style="!item.mostrar ? 'border-left: 5px solid slategray;' : ''">
                                              <input class="form-control" type="text" v-model="item.descricao" :disabled="controle.grupo === 'PERSONALIZADO'" @keydown.esc="fecharEdicao" />
                                            </td>
                                            <td v-if="!_.isNull(item.valor) && item.valor !== ''">
                                              <input class="form-control" type="text" v-model="item.valor" :disabled="controle.grupo === 'PERSONALIZADO'" @keydown.esc="fecharEdicao" />
                                            </td>
                                            <td class="text-left indicadores-cb-inline w20" v-if="false" style="padding: 0 10px">
                                              <i @click="item.mostrar = !item.mostrar" :class="(item.mostrar ? 'fa fa-check-square-o selecionado' : 'fa fa-square-o')" aria-hidden="true"></i>
                                              <span :class="controle.mostrar ? 'selecionado' : ''"> Mostrar</span>
                                            </td>
                                            <td class="text-right w40">
                                              <div class="botoes_acao_conteudo" v-if="controle.grupo !== 'PERSONALIZADO'">
                                                <span class="botao_acao_conteudo elemento_duplicar" @click="controle.configuracao.conteudo.linhas.splice(idx, 0, {descricao: '' + (controle.configuracao.conteudo.linhas.length + 1), valor: null, mostrar: true})"><i class="fa fa-plus"></i></span>
                                                <span class="botao_acao_elemento elemento_mover" @click="moveElemento(idx, -1, controle.configuracao.conteudo.linhas)" v-show="idx > 0"><i class="fa fa-arrow-up"></i></span>
                                                <span class="botao_acao_elemento elemento_mover" @click="moveElemento(idx, 1, controle.configuracao.conteudo.linhas)" v-show="idx < controle.configuracao.conteudo.linhas.length - 1"><i class="fa fa-arrow-down"></i></span>
                                                <span class="botao_acao_conteudo elemento_excluir" @click="controle.configuracao.conteudo.linhas.splice(idx, 1)" v-if="controle.configuracao.conteudo.linhas.length > 1"><i class="fa fa-trash"></i></span>
                                              </div>
                                              <div v-else>&nbsp;</div>
                                            </td>
                                          </tr>
                                        </draggable>
                                      </template>
                                    </table>
                                  </div>
                                </div>


                          <!-- Elementos de colunas (opções para as questões no likert) -->
                                <div class="form-group" v-if="!_.isNull(controle.configuracao.conteudo.colunas)">
                                  <label class="control-label col-md-2">Colunas</label>
                                  <div class="col-md-10">
                                    <table :class="'table table-condensed ' + (controle.grupo === 'PERSONALIZADO' ? '' : 'table-hover')">
                                      <template>
                                        <draggable
                                          group="lista_conteudo"
                                          :disabled="controle.grupo === 'PERSONALIZADO'"
                                          v-model="controle.configuracao.conteudo.colunas"
                                          v-bind="{animation: 200, group: 'lista_conteudo', disabled: false, ghostClass: 'ghost'}"
                                          tag="tbody">

                                          <tr v-for="(item, idx) in controle.configuracao.conteudo.colunas" :class="controle.grupo !== 'PERSONALIZADO' ? 'item_conteudo handle_conteudo' : ''">
                                            <td class="w40" v-bind:style="!item.mostrar ? 'border-left: 5px solid slategray;' : ''">
                                              <input class="form-control" type="text" v-model="item.descricao" :disabled="controle.grupo === 'PERSONALIZADO'" @keydown.esc="fecharEdicao" />
                                            </td>
                                            <td v-if="!_.isNull(item.valor) && item.valor !== ''">
                                              <input class="form-control" type="text" v-model="item.valor" :disabled="controle.grupo === 'PERSONALIZADO'" @keydown.esc="fecharEdicao" />
                                            </td>
                                            <td class="text-left indicadores-cb-inline w20" v-if="false" style="padding: 0 10px">
                                              <i @click="item.mostrar = !item.mostrar" :class="(item.mostrar ? 'fa fa-check-square-o selecionado' : 'fa fa-square-o')" aria-hidden="true"></i>
                                              <span :class="controle.mostrar ? 'selecionado' : ''"> Mostrar</span>
                                            </td>
                                            <td class="text-right w40">
                                              <div class="botoes_acao_conteudo" v-if="controle.grupo !== 'PERSONALIZADO'">
                                                <span class="botao_acao_conteudo elemento_duplicar" @click="controle.configuracao.conteudo.colunas.splice(idx, 0, {descricao: 'Item novo ...', valor: null, mostrar: true})"><i class="fa fa-plus"></i></span>
                                                <span class="botao_acao_elemento elemento_mover" @click="moveElemento(idx, -1, controle.configuracao.conteudo.colunas)" v-show="idx > 0"><i class="fa fa-arrow-up"></i></span>
                                                <span class="botao_acao_elemento elemento_mover" @click="moveElemento(idx, 1, controle.configuracao.conteudo.colunas)" v-show="idx < controle.configuracao.conteudo.colunas.length - 1"><i class="fa fa-arrow-down"></i></span>
                                                <span class="botao_acao_conteudo elemento_excluir" @click="controle.configuracao.conteudo.colunas.splice(idx, 1)" v-if="controle.configuracao.conteudo.colunas.length > 1"><i class="fa fa-trash"></i></span>
                                              </div>
                                              <div v-else>&nbsp;</div>
                                            </td>
                                          </tr>
                                        </draggable>
                                      </template>
                                    </table>
                                  </div>
                                </div>

                              </div>



                          <!-- Seção de Formatação de Subformulário ------------------------------------------------------------------------------------->
                              <div v-if="controle.elemento === 'SUB_FORMULARIO'">
                                <div class="form-group">
                                  <label class="control-label col-md-2">Colunas</label>

                                  <!-- Lista com as colunas para ordenar e definir cabeçalho -->
                                  <div class="col-md-10">
                                    <table class="table table-condensed table-hover">

                                        <draggable
                                          group="lista_conteudo"
                                          v-model="controle.configuracao.conteudo.colunas"
                                          v-bind="{animation: 200, group: 'lista_conteudo', disabled: false, ghostClass: 'ghost'}"
                                          tag="tbody">

                                          <template v-if="_.isEmpty(editandoColunaSubFormulario)">
                                            <tr v-for="(item, idx) in _.filter(controle.configuracao.conteudo.colunas, function(c) {return c.key != 'actions'} )" class="item_conteudo handle_conteudo">
                                              <td class="w30 truncar"><span style="color: var(--cor-destaque)">{{item.key}}</span> {{removerTagHtmlString(item.label)}}</td>
                                              <td class="text-right w20">
                                                <div class="botoes_acao_conteudo" v-if="controle.configuracao.conteudo.colunas.length > 1">
                                                  <span class="botao_acao_elemento elemento_fechar" @click="editandoColunaSubFormulario = controle.configuracao.conteudo.colunas[idx]"><i class="fa fa-pencil"></i></span>
                                                  <span class="botao_acao_elemento elemento_mover" @click="moveElemento(idx, -1, controle.configuracao.conteudo.colunas)" v-show="idx > 0"><i class="fa fa-arrow-up"></i></span>
                                                  <span class="botao_acao_elemento elemento_mover" @click="moveElemento(idx, 1, controle.configuracao.conteudo.colunas)" v-show="idx < controle.configuracao.conteudo.colunas.length - 1"><i class="fa fa-arrow-down"></i></span>
                                                  <span class="botao_acao_conteudo elemento_excluir" @click="controle.configuracao.conteudo.colunas.splice(idx, 1)" v-if="controle.configuracao.conteudo.colunas.length > 1"><i class="fa fa-trash"></i></span>
                                                </div>
                                              </td>
                                            </tr>
                                            <tr>
                                              <td colspan="2" class="adicionaComponente">
                                                <select class="form-control" v-model="colunaParaAdicionarSubFormulario"
                                                        @change="adicionaColunaSubFormulario(idx)">
                                                  <option v-for="item in controle.configuracao.conteudo.formulario" v-if="_.includes(['CONTROLE', 'PERSONALIZADO'], item.grupo)" :value="item">
                                                    ({{item.id}}) {{removerTagHtmlString(item.titulo)}}
                                                  </option>
                                                </select>
                                              </td>
                                            </tr>
                                          </template>

                                        </draggable>

                                        <template v-if="!_.isEmpty(editandoColunaSubFormulario)">
                                          <tr>
                                            <td><input v-model="editandoColunaSubFormulario.label" type="text" class="form-control" @keydown.esc="editandoColunaSubFormulario = {}"/></td>
                                            <td><span class="botao_acao_elemento elemento_fechar" @click="editandoColunaSubFormulario = {}"><i class="fa fa-close"></i></span></td>
                                          </tr>
                                          <tr><td colspan="2">Muda o nome da coluna acima. Isto só altera a coluna, não o titulo da questão no formulário.</td></tr>
                                        </template>
                                    </table>
                                  </div>
                                </div>

                              </div>



                          <!-- Seção de Regras dos elementos do formulário --------------------------------------------------------------->
                              <div id="regras_formulario" v-if="_.includes(['TEXTO_SIMPLES', 'TEXTO_LONGO', 'SELECAO_SIMPLES', 'SELECAO_MULTIPLA', 'BOOLEANO', 'CLASSIFICACAO', 'NPS', 'LIKERT'], controle.elemento) || (controle.elemento === 'NUMERO' && _.includes(['INTEIRO', 'DECIMAL', 'MOEDA'], controle.configuracao.formato))">
                                <div :class="'col-md-12' + (_.sumBy(controle.configuracao.regras, function(r) { return _.isNull(r.valor) || r.valor === '' || r.id.length === 0 ? 1 : 0 }) > 0 ? ' regras_erro' : (controle.configuracao.regras.length > 0 ? ' regras_ok' : ''))">

                                  <div class="btn-primary cabecalho_regras">
                                    <span class="text-bold">
                                      <span v-if="controle.configuracao.regras.length === 0">Nenhuma Regra</span>
                                      <span v-else>
                                        Há {{controle.configuracao.regras.length}} regra(s)

                                        <span class="text-danger" v-if="_.sumBy(controle.configuracao.regras, function(r) { return _.isNull(r.valor) || r.valor === '' ? 1 : 0 }) > 0">
                                          <div class="espacamento_botoes"></div>
                                          <i class="fa fa-exclamation-circle"></i> {{ _.sumBy(controle.configuracao.regras, function(r) { return _.isNull(r.valor) || r.valor === '' ? 1 : 0 }) }} sem valor informado
                                        </span>

                                        <span class="text-danger" v-if="_.sumBy(controle.configuracao.regras, function(r) { return r.id.length === 0 ? 1 : 0 }) > 0">
                                        <div class="espacamento_botoes"></div>
                                          <i class="fa fa-exclamation-circle"></i> {{ _.sumBy(controle.configuracao.regras, function(r) { return r.id.length === 0 ? 1 : 0 }) }} sem destino da ação selecionado
                                        </span>
                                      </span>
                                    </span>

                                    <span class="botoes_acao_conteudo" style="display: block">
                                      <span class="botao_acao_conteudo elemento_duplicar" @click="controle.configuracao.regras.push({condicao: (_.includes(['NUMERO'], controle.elemento) ? 'IGUAL' : (_.includes(['TEXTO_SIMPLES', 'TEXTO_LONGO'], controle.elemento) ? 'CONTEM' : 'ITEM_SELECIONADO')), valor: null, acao: 'MOSTRAR', id: []})"><i class="fa fa-plus"></i></span>
                                      <span class="botao_acao_conteudo elemento_excluir" @click="controle.configuracao.regras = []" v-if="controle.configuracao.regras.length > 0"><i class="fa fa-trash"></i></span>
                                    </span>
                                  </div>

                                  <table class="table lista_regras" v-if="controle.configuracao.regras.length > 0">
                                    <tr v-for="(regra, idxRegra) in controle.configuracao.regras"
                                        :title="_.isNull(regra.valor) || regra.valor === '' || regra.id.length === 0 ?
                                        '<h5>Regra inválida. Complete ou exclua ela</h5>' :

                                        '<h5>Se a resposta da questão ' +
                                        (_.includes(['CONTEM', 'NAO_CONTEM'], regra.condicao) ? '' : (_.includes(['VAZIO', 'NAO_VAZIO', 'ENTRE'], regra.condicao) ? 'está' : (_.includes(['ITEM_SELECIONADO', 'ITEM_NAO_SELECIONADO'], regra.condicao) ? 'tem o' : 'é'))) + ' ' +
                                        '<span class=\'realce\'>' + (_.toLower(_.replace(regra.condicao, '_', ' '))) + '</span> ' +
                                        (_.includes(['CONTEM', 'NAO_CONTEM'], regra.condicao) ? 'o valor' : (_.includes(['VAZIO', 'NAO_VAZIO', 'ENTRE'], regra.condicao) ? '' : (_.includes(['ITEM_SELECIONADO', 'ITEM_NAO_SELECIONADO'], regra.condicao) ? 'com a opção' : (regra.condicao === 'IGUAL' ? 'a' : (regra.condicao === 'DIFERENTE' ? 'de' : 'que'))))) + ' ' +
                                        '<span class=\'realce\'>' + ((_.includes(['VAZIO', 'NAO_VAZIO'], regra.condicao) ? '' : regra.valor) + (regra.condicao === 'ENTRE' ? ' e ' + regra.valor2 : '')) + '</span>' + (controle.elemento === 'LIKERT' ? ' para a pergunta <span class=\'realce\'>' + regra.valor2 + '</span>' : '') + ', ' +
                                        'então deve <span class=\'realce\'>' + _.toLower(regra.acao) + '</span> ' + (regra.id.length > 1 ? 'estes' : 'este') + '<span class=\'realce\'> ' + regra.id.length + ' </span>' + (regra.id.length > 1 ? 'elementos' : 'elemento') + '</h5>'"
                                        v-tippy="{inertia:true, arrow:true, animation:'perspective', distance:'20', size:'large', arrow:true, followCursor:true}">

                                    <!-- Condição lógica -->
                                      <td class="w20">
                                        <span v-if="_.includes(['TEXTO_SIMPLES', 'TEXTO_LONGO'], controle.elemento)">
                                          <select class="form-control b0" v-model="regra.condicao">
                                            <option value="CONTEM">Contém</option>
                                            <option value="NAO_CONTEM">Não contém</option>
                                            <option value="VAZIO">Vazio</option>
                                            <option value="NAO_VAZIO">Não vazio</option>
                                          </select>
                                        </span>

                                        <span v-if="_.includes(['CLASSIFICACAO', 'NPS', 'NUMERO'], controle.elemento)">
                                          <select class="form-control b0" v-model="regra.condicao">
                                            <option value="VAZIO">Está vazio</option>
                                            <option value="NAO_VAZIO">Não está vazio</option>
                                            <option value="ENTRE">Entre</option>
                                            <option value="IGUAL">Igual</option>
                                            <option value="DIFERENTE">Diferente</option>
                                            <option value="MAIOR">Maior que</option>
                                            <option value="MAIOR_IGUAL">Maior ou igual que</option>
                                            <option value="MENOR">Menor que</option>
                                            <option value="MENOR_IGUAL">Menor ou igual que</option>
                                          </select>
                                        </span>

                                        <span v-if="_.includes(['SELECAO_SIMPLES', 'SELECAO_MULTIPLA', 'BOOLEANO', 'LIKERT'], controle.elemento)">
                                          <select class="form-control b0" v-model="regra.condicao" :disabled="true">
                                            <option value="ITEM_SELECIONADO">Se selecionado</option>
                                            <option value="ITEM_NAO_SELECIONADO" v-if="false">Se Não selecionado</option>
                                          </select>
                                        </span>
                                      </td>

                                      <!-- Valor -->
                                      <td class="w20" :class="(_.isNull(regra.valor) || regra.valor === '') || (_.has(regra, 'valor2') && (_.isNull(regra.valor2) || regra.valor2 === '')) ? 'has-error' : ''">
                                        <span v-if="!_.includes(['VAZIO', 'NAO_VAZIO'], regra.condicao)">
                                          <span v-if="_.includes(['CLASSIFICACAO', 'NPS', 'NUMERO'], controle.elemento)" class="regraEntre">
                                            <input v-model="regra.valor"  class="form-control b0" type="text" @keyup="regra.valor = _.toSafeInteger(('' + regra.valor).replace(/\D+/g, ''))"/>
                                            <span v-if="regra.condicao === 'ENTRE'"> e </span>
                                            <input v-model="regra.valor2" v-if="regra.condicao === 'ENTRE'" class="form-control b0" type="text" @keyup="regra.valor2 = _.toSafeInteger(('' + regra.valor2).replace(/\D+/g, ''))"/>
                                          </span>

                                          <span v-if="_.includes(['TEXTO_SIMPLES', 'TEXTO_LONGO'], controle.elemento)">
                                            <input v-model="regra.valor" class="form-control b0" type="text" @keyup="regra.valor = _.toLower(regra.valor)"/>
                                          </span>

                                          <span v-if="_.includes(['SELECAO_SIMPLES', 'SELECAO_MULTIPLA', 'BOOLEANO'], controle.elemento)">
                                            <select v-model="regra.valor" class="form-control b0">
                                              <option v-for="item in controle.configuracao.conteudo.linhas">{{item.descricao}}</option>
                                            </select>
                                          </span>

                                          <span v-if="_.includes(['LIKERT'], controle.elemento)">
                                            <select v-model="regra.valor2" class="form-control b0">
                                              <option v-for="item in controle.configuracao.conteudo.linhas">{{item.descricao}}</option>
                                            </select>
                                            <select v-model="regra.valor" class="form-control b0">
                                              <option v-for="item in controle.configuracao.conteudo.colunas">{{item.descricao}}</option>
                                            </select>
                                          </span>
                                        </span>
                                        <span v-else>&nbsp;</span>
                                      </td>

                                      <!-- Ação -->
                                      <td>
                                        <i @click="regra.acao = regra.acao === 'MOSTRAR' ? 'OCULTAR' : 'MOSTRAR'" style="color: var(--cor-destaque); cursor: pointer; text-align: center"
                                        :class="(regra.acao === 'MOSTRAR' ? 'fa fa-2x fa-eye' : 'fa fa-2x fa-eye-slash')" aria-hidden="true"></i>
                                      </td>

                                      <!-- Id's que receberão a ação -->
                                      <td :class="regra.id.length === 0 ? 'regra_error' : ''">
                                        <multiselect v-model="regra.id"
                                                     :options="_.filter(editandoFormulario, function(o) { return o.id !== controle.id })"
                                                     :multiple="true"
                                                     :close-on-select="true"
                                                     :placeholder="'Selecione ao menos um elemento'"
                                                     track-by="id"
                                                     label="id"
                                                     selectedLabel=""
                                                     selectLabel=""
                                                     deselectLabel=""
                                                     name="id_elementos"
                                                     data-vv-as="id_elementos">

                                          <template slot="option" slot-scope="props">
                                            <span class="text-gray">{{ props.option.id }}</span> <span v-html="props.option.titulo" class="ocultarLinhaAdicionalQuill"></span>
                                          </template>
                                        </multiselect>
                                      </td>

                                      <!-- Botões de ação -->
                                      <td>
                                        <div class="botoes_acao_conteudo" style="display: block">
                                          <span class="botao_acao_conteudo elemento_duplicar" @click="controle.configuracao.regras.splice(idxRegra, 0, _.clone(controle.configuracao.regras[idxRegra]))"><i class="fa fa-files-o"></i></span>
                                          <span class="botao_acao_conteudo elemento_excluir" @click="controle.configuracao.regras.splice(idxRegra, 1)"><i class="fa fa-trash"></i></span>
                                        </div>
                                      </td>
                                    </tr>
                                  </table>

                                </div>
                              </div>



                            </span>

                          </div>

                        </div>

                    </draggable>
                  </span>

                </div>



<!-- Seção dos componentes (Banco de Questões) ------------------------------------------------------------------------>
                <div class="col-md-3" id="componentes_formulario" v-bind:style="'overflow-y: auto; height: ' + (alturaContentWrapper - (mostrarTitulo ? 372 : 94)) + 'px;'" v-if="mostrarComponentes">
                  <span v-if="loading.componentes" class="etiquetaCarregando"><i class='fa fa-refresh fa-spin'></i> Carregando banco de questões ...</span>

                  <span v-if="!loading.componentes">
                    <div class="form-horizontal">
                      <div class="form-group">
                        <div class="col-md-12">
                          <div class="input-group">
                            <input v-model="pesquisa.termo" v-on:keyup="filtrar" type="text" class="form-control" placeholder="Pesquisa..." ref="pesquisaControle" @keydown.esc="pesquisa.termo = ''"
                                   :title="'<h5>Digite algo</h5>'" v-tippy="{inertia:true, arrow:true, animation:'perspective', distance:'1', size:'large', arrow:true, delay: [500, 0]}">

                            <span class="input-group-btn" v-if="pesquisa.termo.length > 0" :title="'<h5>Limpar essa pesquisa [ESC]</h5>'" v-tippy="{inertia:true, arrow:true, animation:'perspective', distance:'1', size:'large', arrow:true}">
                              <button @click="pesquisa.termo = ''" type="button" class="btn" style="background: white; border-color: #d2d6de; border-width: 1px 0px;"><i class="fa fa-remove"></i></button>
                            </span>

                            <span class="input-group-btn">
                              <button @click="pesquisa.personalizado = !pesquisa.personalizado" type="button" :class="'btn btn-default btn-flat' + (pesquisa.personalizado ? ' bg-gray' : '')"
                                      :title="'<h5>Questões fechadas/personalizadas da FBB</h5>'" v-tippy="{inertia:true, arrow:true, animation:'perspective', distance:'1', size:'large', arrow:true}">
                                <i :class="pesquisa.personalizado ? 'fa fa-file-text fa-inverse' : 'fa fa-file-text'"></i>
                              </button>
                            </span>

                            <span class="input-group-btn">
                              <button @click="pesquisa.formulario = !pesquisa.formulario" type="button" :class="'btn btn-default btn-flat' + (pesquisa.formulario ? ' bg-gray' : '')"
                                      :title="'<h5>Formulários genéricos ou participantes</h5>'" v-tippy="{inertia:true, arrow:true, animation:'perspective', distance:'1', size:'large', arrow:true}">
                                <i :class="pesquisa.formulario ? 'fa fa-list-alt fa-inverse' : 'fa fa-list-alt'"></i>
                              </button>
                            </span>
                          </div>

                        </div>
                      </div>
                    </div>


                    <template v-for="(controlesLista, grupo) in _.groupBy(_.filter(_.orderBy(controles, ['informacao'], ['asc']), {'mostrar': true}), 'grupo')">
                      <div class="text-muted text-bold">{{ gruposControles[grupo] }}<span class="contador">{{ controlesLista.length }}</span></div>
                      <draggable
                        tag="ul"
                        class="list-group"
                        :list="controlesLista"
                        :group="{ name: 'edicao', pull: 'clone', put: false }"
                        :clone="clonarControle"
                        :move="mover">

                        <li v-for="controle in controlesLista" :class="'list-group-item ' + (_.find(editandoFormulario, ['id', controle.bi]) ? 'bi_repetido' : '')" @click="adicionaControle(controle)">
                          <div class="truncar">
                            <i class="fa fa-pie-chart" v-if="controle.bi"></i>
                            <i :class="'text-gray fa ' + (controle.grupo === 'FORMULARIO' ? icones[controle.configuracao.conteudo.tipo] : (controle.elemento === 'NUMERO' ? icones[controle.configuracao.formato] : icones[controle.elemento]))"></i>
                            {{controle.informacao}}
                          </div>
                          <i class="fa fa-question-circle text-gray" style="margin-left: 5px" v-if="!_.isEmpty(controle.descricao)"
                             :title="'<h5>' + (_.find(editandoFormulario, ['id', controle.bi]) ? '<span class=\'realce\'>Elementos de BI com este só podem ter um no formulário</span><br/>' : '') + controle.descricao + '</h5>'"
                             v-tippy="{inertia:true, arrow:true, animation:'perspective', distance: 15, size:'large', arrow:true}"></i>
                        </li>
                      </draggable>
                    </template>
                    <p class="text-muted font-italic" v-if="!_.find(controles, {'mostrar': true})">Não encontrei!</p>

                  </span>

                </div>


              </div>

            </div>

            <div v-show="loading.tela" class="overlay" style="position: absolute; top: 0px; left: 0px; width: 100%; height: 100%; display: block;"><i class="fa fa-refresh fa-spin"></i></div>
          </div>
        </div>
      </div>


    </section>

  </div>

</template>


<script>
  /* eslint-disable no-unused-vars */
  import { mapGetters } from 'vuex'

  export default {
    name: 'EditaFormulario',
    data () {
      return {
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
          componentes: false,
          programas: false
        },
        mostrarTitulo: true,
        mostrarComponentes: true,
        salvaFormulario: {
          salvamentoAutomaticoAtivo: false,
          statusSalvamento: 'AGUARDANDO', // 'AGUARDANDO', 'PROCESSANDO', 'FEITO', 'ERRO'
          idTimerSalvamentoAutomatico: null,
          tempoSalvamentoAutomatico: 60000, // A cada 1 min
          contador: 0
        },
        formatoValores: [
          {'elemento': 'NUMERO', 'formatos': [{'valor': 'INTEIRO', 'descricao': 'Inteiro'}, {'valor': 'DECIMAL', 'descricao': 'Decimal'}, {'valor': 'MOEDA', 'descricao': 'Reais (R$)'}, {'valor': 'CPF', 'descricao': 'CPF'}, {'valor': 'CNPJ', 'descricao': 'CNPJ'}, {'valor': 'TELEFONE', 'descricao': 'Telefone'}, {'valor': 'CEP', 'descricao': 'CEP'}]},
          {'elemento': 'TEXTO_LONGO', 'formatos': [{'valor': 'SOMENTE_TEXTO', 'descricao': 'Somente Texto'}, {'valor': 'TEXTO_FORMATADO', 'descricao': 'Texto com formatação'}]},
          {'elemento': 'CLASSIFICACAO', 'formatos': [{'valor': 'ESTRELA', 'descricao': 'Estrelas'}, {'valor': 'EMOJI', 'descricao': 'Expressões'}, {'valor': 'CIRCULO', 'descricao': 'Círculos'}, {'valor': 'LIKE', 'descricao': 'Gostei'}, {'valor': 'NUMEROS', 'descricao': 'Círculos Numerados'}]},
          {'elemento': 'LOGOMARCA_FBB', 'formatos': [{'valor': 'LOGO_HORIZONTAL', 'descricao': 'Marca FBB'}, {'valor': 'LOGO_VERTICAL', 'descricao': 'Logo Grande FBB'}]},
          {'elemento': 'SELECAO_SIMPLES', 'formatos': [{'valor': 'AUTOCOMPLETE', 'descricao': 'Lista com opção de busca'}, {'valor': 'NORMAL', 'descricao': 'Lista simples'}]},
          {'elemento': 'SECAO', 'formatos': [{'valor': 'PADRAO', 'descricao': 'Padrão: Título com fundo cinza'}, {'valor': 'SIMPLES', 'descricao': 'Simples: Linha sobre título'}, {'valor': 'OCULTO', 'descricao': 'Oculto: Só linha sem título'}]},
          {'elemento': 'SUB_FORMULARIO', 'formatos': [{'valor': 'COMPLETO_COM_LINK', 'descricao': 'Completo Com link', 'info': 'Pode ver, alterar, incluir e excluir qualquer dado diretamente e tem link para acesso externo'}, {'valor': 'COMPLETO_SEM_LINK', 'descricao': 'Completo Sem link', 'info': 'Pode ver, alterar, incluir e excluir qualquer dado diretamente somente para usuários do SGP'}, {'valor': 'VISUALIZACAO_COM_LINK', 'descricao': 'Visualização Com link', 'info': 'Pode ver todo o conteúdo do sub formulário e tem link para acesso externo'}, {'valor': 'VISUALIZACAO_SEM_LINK', 'descricao': 'Visualização Sem link', 'info': 'Pode ver todo o conteúdo do sub formulário somente para usuários do SGP'}, {'valor': 'MINIMO_COM_LINK', 'descricao': 'Mínimo Com link', 'info': 'Pode ver somente as colunas selecionadas deste sub formulário e tem link para acesso externo'}, {'valor': 'MINIMO_SEM_LINK', 'descricao': 'Mínimo Sem link', 'info': 'Pode ver somente as colunas selecionadas deste sub formulário para usuários do SGP'}, {'valor': 'SOMENTE_LINK', 'descricao': 'Só link', 'info': 'Há somente o link de acesso ao sub formulário assim qualquer um (usuário do SGP ou não) terá acesso ao formulário'}]}
        ],
        colunaParaAdicionarSubFormulario: null,
        programasSociais: [],
        dados: [],
        pesquisa: {
          termo: '',
          personalizado: false,
          formulario: false
        },
        ehVisualizacao: false,
        controles: [],
        formularioCarregado: {
          id: null,
          nome: '',
          tipo: '',
          link_acesso: '',
          formulario: [],
          fk_criacao: null,
          fk_processo: null,
          opcoes: {
            bi: true,
            vinculo: {
              programas: []
            },
            elemento_chave: null,
            abrir: {acao: 'FORMULARIO_NORMAL'},
            concluir: {acao: 'SAIR_FORMULARIO', parametro: null},
            numeracao: null,
            observacao: null,
            historico: null
          },
          situacao: '',
          cadastro: null
        },
        formularioCarregadoTemp: {}, // Se trata de uma cópia temporária do formulário para comparação se houve alteração ou não para efeito de salvamento automático
        editandoFormulario: [],
        editandoColunaSubFormulario: {},
        editandoElemento: null,
        dragging: false,
        tipoFormulario: [{codigo: 'AVALIACAO_APROVACAO', descricao: 'Marco zero'}, {codigo: 'AVALIACAO_ENCERRAMENTO', descricao: 'Marco um'}, {codigo: 'AVALIACAO_GENERICO', descricao: 'Genérico'}, {codigo: 'AVALIACAO_PARTICIPANTE', descricao: 'Participante'}],
        acoesAposAbrir: [{codigo: 'FORMULARIO_NORMAL', descricao: 'Normal', info: 'Todos os botões de acordo com a regra atual'}, {codigo: 'FORCA_SOMENTE_LEITURA', descricao: 'Só leitura', info: 'Modo de visualização sem botão algum'}],
        acoesAposConcluir: [{codigo: 'SAIR_FORMULARIO', descricao: 'Sai da tela'}, {codigo: 'ABRIR_FORMULARIO', descricao: 'Abre o formulário'}, {codigo: 'ABRIR_URL', descricao: 'Vai para o endereço'}],
        opcoesNumeracaoAutomatica: [{codigo: null, descricao: 'Não numerar'}, {codigo: 'INTEIROS', descricao: 'Números inteiros'}, {codigo: 'ROMANOS', descricao: 'Números romanos'}],
        opcoesHistorico: [{codigo: null, descricao: 'Não mostrar'}, {codigo: 'SOMENTE_FBB', descricao: 'Mostrar só para FBB'}, {codigo: 'TODOS', descricao: 'Todos veem'}],
        opcoesObservacao: [{codigo: null, descricao: 'Não mostrar'}, {codigo: 'SOMENTE_FBB', descricao: 'Disponível para FBB'}, {codigo: 'TODOS', descricao: 'Disponível para todos'}],
        icones: {'TEXTO_SIMPLES': 'fa-text-width', 'TEXTO_LONGO': 'fa-file-text-o', 'SELECAO_SIMPLES': 'fa-list', 'SELECAO_MULTIPLA': 'fa-indent', 'NUMERO': 'fa-numero', 'BOOLEANO': 'fa-dot-circle-o', 'CLASSIFICACAO': 'fa-star', 'DATA': 'fa-calendar', 'PERIODO': 'fa-arrows-h', 'NPS': 'fa-thumbs-o-up', 'LIKERT': 'fa-server', 'UF_MUNICIPIO': 'fa-map-marker', 'TEXTO_FIXO': 'fa-font', 'SECAO': 'fa-credit-card', 'LINHA_HORIZONTAL': 'fa-minus', 'LOGOMARCA_FBB': 'fa-minus-square', 'AVALIACAO_GENERICO': 'fa-list-alt', 'AVALIACAO_PARTICIPANTE': 'fa-male', 'INTEIRO': 'fa-inteiro', 'MOEDA': 'fa-dollar', 'DECIMAL': 'fa-decimal', 'TELEFONE': 'fa-phone', 'CPF': 'fa-user', 'CNPJ': 'fa-industry', 'CEP': 'fa-map-signs'},
        gruposControles: {'PERSONALIZADO': 'Questões fixas', 'CONTROLE': '+Adicionar nova', 'LAYOUT': 'Layout', 'FORMULARIO': 'Subformulários'},
        alturaContentWrapper: window.innerHeight - 151
      }
    },
    watch: {
      'pesquisa.personalizado' () {
        this.filtrar()
        this.$refs['pesquisaControle'].focus()
      },
      'pesquisa.formulario' () {
        this.filtrar()
        this.$refs['pesquisaControle'].focus()
      },
      editandoFormulario () {
        // Executado ao adicionar ou excluir elementos nos formulário
        this.numeracaoAutomatica()
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
      this.formularioCarregado.id = this.$route.params.id
      this.ehVisualizacao = this.$route.params.visualizacao || false
      if (!_.isNull(this.formularioCarregado.id)) {
        this.carregaFormulario()
      } else {
        this.carregaControles()
      }
      this.salvamentoAutomatico()
      this.carregaProgramas()
      let vm = this
      window.addEventListener('resize', function () {
        vm.mostrarTitulo = vm.mostrarTitulo && (window.innerHeight - 180) > 400
        vm.alturaContentWrapper = window.innerHeight - 151
      })
    },
    beforeDestroy () {
      clearInterval(this.salvaFormulario.idTimerSalvamentoAutomatico) // "Desligar" o salvamento automático
    },
    methods: {
      carregaFormulario () {
        this.loading.tela = true
        axiosLaravel.get('formulario/edita/' + this.formularioCarregado.id).then((response) => {
          if (_.has(response.data, 'codigo') && response.data.codigo === 'OK') {
            this.formularioCarregado = response.data.retorno
            this.editandoFormulario = _.isNull(this.formularioCarregado.formulario) ? [] : _.cloneDeep(this.formularioCarregado.formulario)
            this.salvaFormulario.salvamentoAutomaticoAtivo = true
            this.salvaFormulario.contador = 1
            this.formularioCarregadoTemp = _.cloneDeep(this.formularioCarregado) // Este temp vai ficar atualizado a cada salvamento para comparar se houve ou não alteração entre um salvamento e outro
            this.carregaControles()
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
      carregaProgramas () {
        this.loading.programas = true
        axiosLaravel.get('categorizadores').then((response) => {
          let demais = _.filter(response.data, ['grupo', 'PROGRAMA'])
          let atuais = _.remove(demais, function (p) {
            return _.includes([16, 17, 18, 20, 21], p.id)
          })
          this.programasSociais = _.union(atuais, [{id: '', descricao: '', $isDisabled: true}], demais)
          this.loading.programas = false
          this.$forceUpdate()
        })
          .catch((error) => {
            this.$root.trataErro(error)
            this.loading.programas = false
          })
      },
      carregaControles () {
        this.loading.componentes = true
        axiosLaravel.get('formulario/componentes').then((response) => {
          this.controles = response.data
          this.loading.componentes = false
          this.carregaOutrosFormularios()
          this.$forceUpdate()
        })
          .catch((error) => {
            this.$root.trataErro(error)
            this.loading.componentes = false
          })
      },
      carregaOutrosFormularios () {
        this.loading.componentes = true
        let vm = this
        axiosLaravel.get('formulario/lista/completo').then((response) => {
          let formsAtivos = _.filter(response.data, function (f) {
            // Somente forms genéricos ou de particiapntes, ativos que não sejam o que está sendo editado
            return f.situacao === 'Ativo' && _.includes(['AVALIACAO_GENERICO', 'AVALIACAO_PARTICIPANTE'], f.tipo) && f.id !== vm.formularioCarregado.id
          })
          // Preparando os componentes para representar o formulário, como amostra e nomes das colunas
          formsAtivos.forEach((formulario) => {
            let subformulario = _.isNull(formulario.formulario) ? [] : formulario.formulario
            if (subformulario.length > 0) { // Tem conteúdo
              let colunas = []
              subformulario.every((elemento) => { // 'every' ao invés de 'forEach', pois permite parar no meio do loop quando o return é false
                if (_.includes(['NUMERO', 'TEXTO_SIMPLES', 'DATA'], elemento.elemento)) {
                  colunas.push({key: elemento.id, label: this.removerTagHtmlString(elemento.titulo), thStyle: 'text-align: center', sortable: true, 'class': 'text-center'})
                }
                return colunas.length <= 3 // A amostragem é só para até as primeiras 3 colunas inseridas
              })
              colunas.push({key: 'actions', label: 'Ações', thStyle: 'text-align: center', sortable: true, 'class': 'text-center'})
              //
              let conteudo = _.clone({colunas: colunas, formulario: subformulario, tipo: formulario.tipo, currentPage: 1, perPage: 10, totalRows: 1, sortBy: colunas[0]['key'], sortDesc: true, bordered: true, filter: null})
              //
              this.controles.push({
                'grupo': 'FORMULARIO',
                'elemento': 'SUB_FORMULARIO',
                'titulo': formulario.nome,
                'descricao': _.find(this.tipoFormulario, ['codigo', formulario.tipo])['descricao'],
                'informacao': formulario.nome,
                'bi': null,
                'mostrar': true,
                'obrigatorio': true,
                'valor': [{'actions': '...'}],
                'configuracao': {
                  'minimo': null,
                  'maximo': null,
                  'padrao': _.split(formulario['link_acesso'], '-'),
                  'formato': 'COMPLETO_COM_LINK',
                  'conteudo': conteudo,
                  'regras': []
                }
              })
            }
          })
          this.$forceUpdate()
          this.loading.componentes = false
        })
          .catch((error) => {
            this.$snotify.clear()
            this.$root.trataErro(error)
            this.loading.componentes = false
          })
      },
      salvamentoAutomatico () {
        this.salvaFormulario.idTimerSalvamentoAutomatico = setInterval(() => {
          // Somente salva automático se a funcionalidade estiver ativa, se já foi salvo alguma vez e se houve alteração entre o salvamento atual e o anterior
          if (this.salvaFormulario.salvamentoAutomaticoAtivo && this.salvaFormulario.contador > 0 && !_.isEqual(this.formularioCarregadoTemp, this.formularioCarregado)) {
            this.salvarEdicao()
          }
        }, this.salvaFormulario.tempoSalvamentoAutomatico)
      },
      salvarEdicao (redirecionarChave = null) {
        this.errors.remove('edicao_formulario')
        if (this.errors.items.length === 0) {
          this.$validator.validateAll().then(validado => {
            if (this.editandoFormulario.length === 0) { // Verifica se esta vazio o formulário e adiciona erro se tiver
              this.errors.add({field: 'edicao_formulario', rule: 'form_vazio', msg: 'Não pode criar nem salvar um formulário sem elemento algum'})
            }
            if (validado && this.errors.items.length === 0) {
              _.set(this.formularioCarregado, 'formulario', _.clone(this.editandoFormulario))
              this.salvaFormulario.statusSalvamento = 'PROCESSANDO'
              let rota = _.isNull(this.formularioCarregado.id) ? 'formulario/cria/' : 'formulario/salva/'
              this.loading.tela = !_.isNull(redirecionarChave)
              // Criando/Salvando formulário
              axiosLaravel.post(rota, this.formularioCarregado).then((response) => {
                if (_.has(response.data, 'codigo') && response.data.codigo === 'OK') {
                  ['id', 'nome', 'tipo', 'situacao', 'opcoes'].forEach(p => {
                    _.set(this.formularioCarregado, p, _.get(response.data.retorno, p))
                  })
                  this.salvaFormulario.statusSalvamento = 'FEITO'
                  setTimeout(() => {
                    this.salvaFormulario.statusSalvamento = 'AGUARDANDO'
                    this.salvaFormulario.salvamentoAutomaticoAtivo = true // Depois de salvo manualmente a primeira vez ele já ativa para as demais focarem automaticas
                    this.salvaFormulario.contador++ // É só pra registrar a qantidade de vezes que já foi salvo
                    console.log('salvamento feito! contador', this.salvaFormulario.contador)
                  }, 2000)
                  this.formularioCarregadoTemp = _.cloneDeep(this.formularioCarregado) // Copia o que foi salvo para um temp que servirá de comparação para o salvamento automático
                  if (!_.isNull(redirecionarChave)) {
                    window.open(location.protocol + '//' + location.host + '/formulario/' + redirecionarChave, '_blank')
                  }
                } else {
                  this.aviso(response.data)
                }
                this.loading.tela = false
              })
                .catch((error) => {
                  this.$root.trataErro(error)
                  this.salvaFormulario.statusSalvamento = 'ERRO'
                })
            } else {
              this.mostrarTitulo = true
              this.$refs[_.get(_.head(this.errors.items), 'field')].scrollIntoView({block: 'start', behavior: 'smooth'}) // Rola a tela para o primeiro erro da lista
            }
          })
        } else {
          this.mostrarTitulo = true
          this.$refs[_.get(_.head(this.errors.items), 'field')].scrollIntoView({block: 'start', behavior: 'smooth'}) // Rola a tela para o primeiro erro da lista
        }
      },
      abreFormulario (chave) {
        // Salva o formulário passando a chave para redirecionar a abertura de nova janela com esta chave de acesso
        this.salvarEdicao(chave)
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
      adicionaControle (controle) {
        if (!_.find(this.editandoFormulario, ['id', controle.bi])) {
          this.editandoFormulario.push(this.clonarControle(controle))
        }
      },
      // Ações dos botões de elemento
      removeElemento (idx) {
        this.editandoFormulario.splice(idx, 1)
        this.editandoElemento = null
      },
      duplicaElemento (idx, controle) {
        let controleDuplicado = this.clonarControle(controle)
        this.editandoFormulario.splice(idx, 0, controleDuplicado)
      },
      moveElemento (idx, passo, lista) {
        let elemento = lista[idx]
        lista.splice(idx, 1)
        lista.splice(idx + passo, 0, elemento)
      },
      // Métodos de tratamento dos elementos do formulario
      clonarControle (controle) {
        let controleClonado = _.cloneDeep(controle)
        let id = _.isNull(controleClonado.bi) ? _.uniqueId(controleClonado.elemento + '-') : controleClonado.bi
        // Checa duplicidade de id para elementos de BI
        let repetido = _.find(this.editandoFormulario, ['id', id])
        if (repetido) {
          return undefined
        } else {
          _.set(controleClonado, 'id', id)
          return controleClonado
        }
      },
      editaElemento (idx) {
        this.editandoElemento = this.editandoFormulario[idx]
        console.log('editandoElemento idx', idx, this.editandoElemento)
        this.$refs[this.editandoElemento.id][0].scrollIntoView(true)
        this.$forceUpdate()
      },
      filtrar () {
        let lista = _.cloneDeep(this.controles)
        let termo = _.toLower(this.pesquisa.termo)
        lista.forEach((item) => {
          item.mostrar = true
          item.mostrar = _.includes(_.toLower(item.titulo), termo) || _.includes(_.toLower(item.descricao), termo) || _.includes(_.toLower(item.informacao), termo)
          if (this.pesquisa.personalizado && item.grupo !== 'PERSONALIZADO') {
            item.mostrar = item.mostrar && (this.pesquisa.formulario && item.grupo === 'FORMULARIO')
          }
          if (this.pesquisa.formulario && item.grupo !== 'FORMULARIO') {
            item.mostrar = item.mostrar && (this.pesquisa.personalizado && item.grupo === 'PERSONALIZADO')
          }
        })
        this.controles = lista
      },
      mostraOcultaElemento (idx) {
        let verificacaoSessao = this.elementosSecao(idx)
        if (this.editandoFormulario[idx].elemento === 'SECAO') { // Se o elemento é uma seção
          verificacaoSessao.forEach((elemento) => { elemento.mostrar = !this.editandoFormulario[idx].mostrar }) // Então troque todos os elementos e a seção entre "mostrar/ocultar"
          this.editandoFormulario[idx].mostrar = !this.editandoFormulario[idx].mostrar
        } else { // Se o elemento Não é uma seção retorna null ou objeto da sessão
          // Então deve trocar livremente, exceto se a seção já for oculta, daí o elemento deve ficar oculto também
          this.editandoFormulario[idx].mostrar = _.isNull(verificacaoSessao) || verificacaoSessao.mostrar ? !this.editandoFormulario[idx].mostrar : false
        }
      },
      elementosSecao (idx) {
        let lista = []
        if (this.editandoFormulario[idx].elemento === 'SECAO') { // Se o elemento é uma seção
          // Retornará array com os elementos da seção (até a próxima ou final do formulário) ou vazio se não tiver elementos na seção
          for (let i = idx + 1; i < this.editandoFormulario.length; i++) {
            if (this.editandoFormulario[i].elemento === 'SECAO') break
            lista.push(this.editandoFormulario[i])
          }
        } else { // Se o elemento Não é uma seção
          // Retornará a sessão (objeto do elemento sessão) ao qual faz parte ou null se não fizer parte de nenhuma sessão
          lista = idx - 1 < 0 ? null : (_.findLast(this.editandoFormulario, function (n) { return n.elemento === 'SECAO' }, idx - 1) || null)
        }
        return lista
      },
      adicionaColunaSubFormulario (idx) {
        let listaColunas = this.editandoFormulario[idx].configuracao.conteudo.colunas
        let colunaNova = {key: this.colunaParaAdicionarSubFormulario.id, label: this.colunaParaAdicionarSubFormulario.informacao, thStyle: 'text-align: center', sortable: true, 'class': 'text-center'}
        let colunaAcoes = _.head(_.remove(listaColunas, ['key', 'actions']))
        listaColunas.push(colunaNova)
        listaColunas.push(colunaAcoes)
        this.colunaParaAdicionarSubFormulario = null
        this.$forceUpdate()
      },
      verificaNomeJaExiste () {
        this.errors.remove('nome_existe')
        axiosLaravel.post('formulario/validacao/duplicidade/nome', {id: this.formularioCarregado.id, nome: this.formularioCarregado.nome}).then((response) => {
          if (response.data > 0) {
            this.errors.add({field: 'nome_existe', msg: 'Este nome já esta sendo usado por um formulário'})
          }
        })
          .catch((error) => {
            this.$root.trataErro(error)
          })
      },
      removerTagHtmlString (str) {
        return _.isNull(str) ? str : ('' + str).replace(/(<([^>]+)>)/ig, '')
      },
      numeracaoAutomatica () {
        if (!_.isNull(this.formularioCarregado.opcoes.numeracao)) {
          let map = {M: 1000, CM: 900, D: 500, CD: 400, C: 100, XC: 90, L: 50, XL: 40, X: 10, IX: 9, V: 5, IV: 4, I: 1}
          let controles = _.filter(this.editandoFormulario, function (c) { return c.grupo !== 'LAYOUT' })
          controles.forEach((controle, idx) => {
            let numeral = idx + 1
            if (this.formularioCarregado.opcoes.numeracao === 'ROMANOS') {
              let convertidoRomano = ''
              _.forEach(map, (numero, romano) => {
                convertidoRomano += romano.repeat(Math.floor(numeral / numero))
                numeral %= numero
              })
              _.set(controle, 'numeracao', convertidoRomano)
            } else {
              _.set(controle, 'numeracao', '' + numeral)
            }
          })
        }
      },
      mover () {
        this.numeracaoAutomatica()
      },
      fecharEdicao () {
        this.editandoElemento = null
        this.editandoColunaSubFormulario = {}
      }
    }
  }
</script>

<style scoped>
  #edicao_formulario .handle, #edicao_formulario .handle_conteudo {
    cursor: grab;
  }
  #edicao_formulario .ghost {
    opacity: 0.5;
    background: #c8ebfb;
  }
  #edicao_formulario li.list-group-item:hover, #edicao_formulario .box-body.elemento:hover {
    cursor: default;
    background: #fffced;
  }
  #edicao_formulario .edicao:hover {
    color: blue;
    cursor: pointer;
  }
  #edicao_formulario .excluir:hover {
    color: blue;
    cursor: pointer;
  }

  #edicao_formulario input[type="number"] {
    width: 100px;
  }

  #edicao_formulario .list-group {
    border: 1px dotted steelblue;
    border-radius: 4px;
    min-height: 40px;
  }
  #edicao_formulario .adicionaComponente {
    border: 1px dashed red;
    border-radius: 4px;
    min-height: 40px;
  }
  #edicao_formulario .elemento {
    display: flex;
    flex-direction: column;
  }
  #edicao_formulario .elemento_controle {
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    justify-content: center;
    align-items: center;
    margin-bottom: 10px;
  }
  #edicao_formulario .elemento_propriedades {
    background: #dfeaf9;
    margin-top: 10px;
  }

  #edicao_formulario .botoes_acao_elemento {
    position: absolute;
    right: 25px;
    margin: -8px;
    background: white;
    border-radius: 20px;
    z-index: 1000;
    color: gray;
    height: 32px;
    padding: 5px 2px;
    cursor: pointer;
    border: 1px solid lightgray;
    display: none;
    box-shadow: 0px 2px 8px lightsteelblue;
  }
  #edicao_formulario .botoes_acao_conteudo {
    width: fit-content;
    float: right;
    background: rgb(255 255 255 / 80%);
    border-radius: 20px;
    z-index: 1000;
    color: gray;
    height: 32px;
    padding: 5px 2px;
    cursor: pointer;
    border: 1px solid lightgray;
    display: none;
  }

  #edicao_formulario .botao_acao_elemento, #edicao_formulario .botao_acao_conteudo {
    padding: 5px 8px;
    border-radius: 20px;
  }

  #edicao_formulario .elemento:hover .botoes_acao_elemento, #edicao_formulario .item_conteudo:hover .botoes_acao_conteudo {
    display: block;
  }

  #edicao_formulario .elemento_fechar:hover {
    background: gray;
    color: white;
  }
  #edicao_formulario .elemento_mover:hover {
    background: steelblue;
    color: white;
  }
  #edicao_formulario .elemento_duplicar:hover {
    background: green;
    color: white;
  }
  #edicao_formulario .elemento_excluir:hover {
    background: tomato;
    color: white;
  }

  #edicao_formulario .secao_padrao {
    font-size: 16px;
    padding: 10px 0px;
    background: silver;
  }
  #edicao_formulario .secao_simples {
    font-size: 16px;
    padding: 10px 0px;
    border-top: 2px solid silver;
  }
  #edicao_formulario .secao_oculto {
    font-size: 0px;
    padding: 10px 0px;
    border-bottom: 2px solid silver;
  }

  #edicao_formulario .indicadores-cb-inline i {
    cursor: pointer;
  }

  .caixa_propriedades {
    box-shadow: 0px 0px 20px 2px rgb(0 0 0 / 40%) !important;
    margin: 10px 0px;
    background: white !important;
  }

  .controle_esmaecido {
    background: whitesmoke;
    color: silver;
  }

  .marcar_oculto .handle {
    border-left: 5px solid slategray;
  }


  /* Formatação de elementos *******************************/
  #edicao_formulario .elemento_NPS_escala {
    table-layout: fixed;
    width: 100%;
    border-collapse: collapse;
  }
  #edicao_formulario .elemento_NPS_limites {
    table-layout: fixed;
    width: 100%;
    border-collapse: collapse;
    font-style: italic;
  }
  #edicao_formulario .elemento_likert_matrix {
    table-layout: fixed;
    width: 100%;
    border-collapse: collapse;
  }
  #edicao_formulario .elemento_likert_cabecalho_coluna {
    text-align: center;
  }
  #edicao_formulario .elemento_likert_pergunta {
    font-weight: normal;
    padding: 10px 0px;
    border-bottom: 1px solid var(--cor-fraca);
  }
  #edicao_formulario .elemento_likert_opcoes {
    text-align: center;
    border-bottom: 1px solid var(--cor-fraca);
  }
  #edicao_formulario .elemento_classificacao {
    margin-right: 5px;
  }
  #edicao_formulario .classificacao_numeral {
    width: 1em;
  }
  #edicao_formulario .classificacao_numeral span {
    font-size: .6em;
    font-family: monospace;
    font-weight: bold;
  }


  /* Lista de Componentes do Formulário *******************************/
  #componentes_formulario .list-group-item:hover {
    cursor: grab;
    background: #c8ebfb;
  }

  #componentes_formulario .bi_repetido {
    cursor: not-allowed !important;
    background: var(--cor-fraca);
    color: white;
  }

  #componentes_formulario li {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
  }

  #componentes_formulario i.fa.fa-question-circle, #edicao_formulario i.fa.fa-question-circle {
    cursor: help;
  }

  #componentes_formulario .list-group-item {
    padding-left: 5px;
    padding-right: 5px;
  }

  #componentes_formulario .fa-inteiro::before {
    content: "123";
    font-family: sans-serif;
    letter-spacing: -2px;
  }
  #componentes_formulario .fa-decimal::before {
    content: "0,2";
    font-family: sans-serif;
    letter-spacing: -2px;
  }

  /* Seção de Regras dos elementos do formulário *******************************/
  #regras_formulario .cabecalho_regras {
    font-size: 12px;
    padding: 10px;
    width: 100%;
    float: left;
    border-radius: 2px !important;
    background: #c8dcf7 !important;
    color: black !important;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }

  #regras_formulario .regras_ok .cabecalho_regras, #regras_formulario .regras_ok .lista_regras {
    background: #cff7c8 !important;
  }
  #regras_formulario .regras_erro .cabecalho_regras, #regras_formulario .regras_erro .lista_regras {
    background: #f7c8c8 !important;
  }

  #regras_formulario td.regra_error {
    border: 1px solid #ffe4e4;
  }
  #regras_formulario td.regra_error:hover {
    box-shadow: inset 0 1px 1px rgb(0 0 0 / 8%), 0 0 6px #ce8483;
  }

  #regras_formulario .lista_regras select, #regras_formulario .lista_regras input {
    background: transparent;
  }

  #regras_formulario input.b0, #regras_formulario select.b0 {
    border: 0px;
  }

  #regras_formulario .regraEntre {
    display: inline-flex;
    align-items: center;
  }

  #regras_formulario .regraEntre input, #regras_formulario .regraEntre span {
    text-align: center;
  }


  /* Alças para alterar mostrar/ocultar seção *******************************/
  .content .alca_mostrar_ocultar {
    text-align: center;
    background: white;
    cursor: pointer;
  }
  .content .alca_mostrar_ocultar div {
    border-bottom: 1px solid var(--cor-fraca);
  }
  .content .alca_mostrar_ocultar i {
    position: absolute;
    border: 1px solid;
    border-radius: 10px;
    top: -10px;
    background: white;
    color: var(--cor-fraca);
  }
  .content .alca_mostrar_ocultar:hover > div {
    border-color: var(--cor-destaque);
  }
  .content .alca_mostrar_ocultar:hover > i {
    color: var(--cor-destaque);
  }


</style>

<style>
  /* Personalização do Quill Text Editor *******************************/
  .quill-editor .ql-bubble .ql-tooltip {
    z-index: 1000 !important;
    background: rgba(0, 0, 0, 0.7) !important;;
  }

  .quill-editor .ql-editor {
    background: white;
    border: 1px solid rgb(210, 214, 222);
  }
  .quill-editor .ql-editor:focus {
    border: 1px solid rgb(60, 141, 188);
  }
  .quill-editor .ql-disabled > .ql-editor {
    background: #eeeeee;
  }

  #edicao_formulario .tituloControle span > p:last-child, span.ocultarLinhaAdicionalQuill > p:last-child {
    /* "Elimina" a linha adicional que o Quill Editor sempre adiciona */
    display: inline;
  }
  #edicao_formulario .tituloControle span > p:last-child br, span.ocultarLinhaAdicionalQuill > p:last-child br {
    /* "Elimina" a quebra de linha que o Quill Editor adiciona quando se acrescenta video no final do texto */
    display: none;
  }
</style>
