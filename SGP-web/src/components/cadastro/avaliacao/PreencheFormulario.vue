<template>
  <div :class="ehAcessoExterno ? 'container' : 'content-wrapper'" style="min-height: 870px;">

    <vue-headful :title="'SGP'"/>

    <div v-if="acao !== 'novo'">
      <section class="content-header" v-bind:style="ehAcessoExterno ? 'background: #ecf0f5; margin-top: 10px;' : ''">
        <div v-if="ehAcessoExterno" class="login-logo yellow-bg" style="margin-top: 0px;"><img src="/static/img/logo-login.png"></div>

        <h1>
          <span>
            <span v-if="formularioCadastrado.opcoes.abrir.acao !== 'FORCA_SOMENTE_LEITURA'">
              {{ acao === 'impressao' ? 'Formulário em Branco para Impressão' : (acao === 'visualizacao' ? 'Visualizando Formulário' : (ultimaTarefa.nome === 'SOLICITACAO' ? 'Preencha o formulário' : (ultimaTarefa.nome === 'REVISAO' ? 'Revise o formulário' : (ultimaTarefa.nome === 'ANALISE' ? 'Análise do formulário' : '')))) }}
              {{ formularioPreenchimento.fk_processo }}
            </span>
            <span v-else>&nbsp;</span>
          </span>

          <span v-if="formularioCadastrado.opcoes.abrir.acao !== 'FORCA_SOMENTE_LEITURA'">
            <span v-if="!_.includes(['impressao', 'visualizacao'], acao)">

              <span v-if="!loading.tela && acao === 'edicao' && _.has(formularioPreenchimento, 'fk_formulario')">
                <span v-if="salvaFormulario.statusSalvamento === 'PROCESSANDO'" class='button--moema warning' style='font-size: 12px;padding: 8px 50px 10px 15px;border-radius: 2px !important;background: var(--cor-borda-dark) !important;cursor: not-allowed;'><i class='fa fa-refresh fa-spin'></i> Salvando</span>
                <span v-else-if="salvaFormulario.statusSalvamento === 'FEITO'" class='button--moema success' style='font-size: 12px;padding: 8px 10px 10px 15px;border-radius: 2px !important;background: var(--cor-verde) !important;cursor: not-allowed;'><i class='fa fa-check'></i> Formulário salvo</span>
                <span v-else><g-button-moema color="primary" @click.native="salvarPreenchimento(false)" type="button"><i class="fa fa-floppy-o" aria-hidden="true"></i> Salvar alterações</g-button-moema></span>
              </span>

              <span v-if="!loading.tela">
                <g-button-moema color="success" @click.native="validaConclusao" type="button"
                                :title="'<h5>' + (_.includes(['SOLICITACAO', 'REVISAO'], ultimaTarefa.nome) ? 'Clique para enviar seu formulário para a Fundação BB' : 'Clique para concluir sua análise') + '</h5>'" aria-hidden="true" v-tippy="{inertia:true, arrow:true, animation:'perspective', distance:'1', size:'large', arrow:true}"><i class="fa fa-check" aria-hidden="true"></i> Concluir</g-button-moema>

                <span v-if="ehSubFormulario">
                  <g-button-moema color="warning" @click.native="$router.replace('/#/inicial')" type="button"><i class="fa fa-close" aria-hidden="true"></i> Fechar</g-button-moema>
                </span>
                <span v-else>
                  <g-button-moema color="warning" @click.native="$router.go(-1) || $router.push('/#/inicial')" type="button"><i class="fa fa-chevron-circle-left" aria-hidden="true"></i> Voltar</g-button-moema>
                </span>
              </span>

              <span class="indicadores-cb-inline" v-if="!loading.tela && false">
                <div class="juntos">
                  <i @click="salvaFormulario.salvamentoAutomaticoAtivo = !salvaFormulario.salvamentoAutomaticoAtivo" :class="(salvaFormulario.salvamentoAutomaticoAtivo ? 'fa fa-check-square-o selecionado' : 'fa fa-square-o')" aria-hidden="true"></i>
                  <span :class="salvaFormulario.salvamentoAutomaticoAtivo ? 'selecionado' : ''">{{salvaFormulario.statusSalvamento}}</span>
                </div>
              </span>
            </span>

            <span v-else>
              <g-button-moema color="warning" @click.native="$router.go(-1)" type="button"><i class="fa fa-chevron-circle-left" aria-hidden="true"></i> Voltar</g-button-moema>
            </span>

            <span v-if="acao === 'impressao'">
              <div class="espacamento_botoes"></div>
              <g-button-ujarak color="warning" @click.native="imprimirRelatorio" size="button--size-ss"><i class="fa fa-print" aria-hidden="true"></i> Imprimir </g-button-ujarak>
            </span>

            <span v-if="!loading.tela && acao !== 'impressao' && !ehSubFormulario && !ehAcessoExterno">
              <div class="espacamento_botoes"></div>
              <g-button-ujarak color="success" @click.native="exportarExcel" size="button--size-ss"><i class="fa fa-download" aria-hidden="true"></i> Exportar Excel</g-button-ujarak>
            </span>
          </span>
        </h1>



      </section>

      <section class="content" v-bind:style="ehAcessoExterno ? ' background: #ecf0f5; margin-top: 0;' : ''">

  <!-- Alerta de observação -->
        <div v-if="_.has(ultimaTarefa, 'observacao') && !_.isNull(ultimaTarefa.observacao) && !ehSubFormulario && ultimaTarefa.nome !== 'SOLICITACAO'" class="alert alert-info alert-dismissible hidden-print">
          <button type="button" class="close" data-dismiss="alert" aria-hidden="true" @click="show.info = false">×</button>
          <h4><i class="fa fa-warning"></i> Atenção!</h4>
          <div v-html="ultimaTarefa.observacao"></div>
        </div>


  <!-- Formulario --------------------------------------------------------------------------------------------------------------------------------->
        <div class="row">

          <div class="col-md-12">
            <div class="box box-widget">

        <!-- Cabeçalho do formulário -->
              <div class="box-body" v-if="formularioCadastrado.opcoes.abrir.acao !== 'FORCA_SOMENTE_LEITURA'">
                <table class="w100 imprimir" style="visibility: hidden;">
                  <tr>
                    <td class="w30">
                      <img src="/static/img/logo-vertical.png">
                    </td>
                    <td class="">
                      <div style="font-size: 35px !important; font-family: sans-serif; margin-left: 20px">{{formularioCadastrado.nome}}</div>
                    </td>
                  </tr>
                  <tr><td colspan="2" style="height: 50px;">&nbsp;</td></tr><!-- espaçamento em branco na impressão e oculto na tela-->
                </table>


                <span class="hidden-print">
                  <h4>{{formularioCadastrado.nome}}</h4>
                  <hr/>
                </span>
              </div>

        <!-- Corpo do formulário -->
              <div id="corpo_formulario">

                <div v-for="(controle, idx) in formularioPreenchimento.formulario" class="box-body" v-if="controle.mostrar">

                  <div v-if="_.includes(['CONTROLE', 'PERSONALIZADO'], controle.grupo)" :ref="controle.id"
                       :class="controle.obrigatorio ? 'required-field' + (errors.first(controle.id) || (errors.first(controle.id + '-INICIO') || errors.first(controle.id + '-TERMINO')) ? ' has-error' : '') : ''">

                    <label class="control-label col-md-12 tituloControle">
                      <span class="text-gray" v-if="!_.isNull(formularioCadastrado.opcoes.numeracao) && _.has(controle, 'numeracao')">{{ controle.numeracao }})</span>

                      <span v-html="_.isEmpty(controle.titulo) ? 'Tílulo da questão não encontrado!!!' : controle.titulo"></span>
                      <i v-if="!_.isEmpty(controle.descricao)" class="fa fa-question-circle hidden-print" :title="'<h5>' + (controle.descricao) + '</h5>'" aria-hidden="true" v-tippy="{inertia:true, arrow:true, animation:'perspective', distance:'1', size:'large', arrow:true}"></i>
                    </label>
                    <span v-html="controle.descricao" class="visible-print" style="font-style: italic"></span>


            <!-- Números --------------------------------------------------->
                    <div v-if="controle.elemento === 'NUMERO'" :class="_.includes(['TELEFONE', 'CNPJ', 'CPF'], controle.configuracao.formato) ? 'col-md-4' : 'col-md-3'">

                      <span v-if="controle.configuracao.formato === 'CPF'">
                        <the-mask v-model="controle.valor" :mask="['###.###.###-##']" type="text" class="form-control" placeholder="000.000.000-00"
                                  @blur.native="controle.valor = !_.isEmpty(controle.valor) ? _.padStart(controle.valor, 11, '0') : null; validacaoElementoChave(idx); validaCpfCnpj(idx)" :disabled="_.includes(['visualizacao', 'impressao'], acao)"
                                  v-validate="controle.obrigatorio ? 'required' : ''" :name="controle.id">
                        </the-mask>
                        <!-- TODO adicionar função de verificação de CPF e CNPJ aqui -->
                      </span>

                      <span v-else-if="controle.configuracao.formato === 'CNPJ'">
                        <the-mask v-model="controle.valor" :mask="['##.###.###/####-##']" type="text" class="form-control" placeholder="00.000.000/0000-00"
                                  @blur.native="controle.valor = !_.isEmpty(controle.valor) ? _.padStart(controle.valor, 14, '0') : null; validacaoElementoChave(idx); validacaoElementoChave(idx); validaCpfCnpj(idx)" :disabled="_.includes(['visualizacao', 'impressao'], acao)"
                                  v-validate="controle.obrigatorio ? 'required' : ''" :name="controle.id">
                        </the-mask>
                      </span>

                      <span v-else-if="controle.configuracao.formato === 'TELEFONE'">
                        <the-mask v-model="controle.valor" :mask="['(##) ####-####', '(##) #####-####']" type="text" class="form-control" placeholder="(00) 00000-0000"
                                  @blur.native="controle.valor = !_.isEmpty(controle.valor) ? _.padStart(controle.valor, 11, '9') : null; validacaoElementoChave(idx)" :disabled="_.includes(['visualizacao', 'impressao'], acao)"
                                  v-validate="controle.obrigatorio ? 'required' : ''" :name="controle.id">
                        </the-mask>
                      </span>

                      <span v-else-if="controle.configuracao.formato === 'CEP'">
                        <the-mask v-model="controle.valor" :mask="['#####-###']" type="text" class="form-control" placeholder="00000-000"
                                  @blur.native="controle.valor = !_.isEmpty(controle.valor) ? _.padEnd(controle.valor, 8, '0') : null; validacaoElementoChave(idx)" :disabled="_.includes(['visualizacao', 'impressao'], acao)"
                                  v-validate="controle.obrigatorio ? 'required' : ''" :name="controle.id">
                        </the-mask>
                      </span>

                      <span v-else-if="controle.configuracao.formato === 'MOEDA'">
                        <money v-model="controle.valor" class="form-control" @blur.native="executarRegras(); validacaoElementoChave(idx)"
                               v-validate="controle.obrigatorio ? 'required' : ''" :name="controle.id">
                        </money>
                      </span>

                      <span v-else-if="controle.configuracao.formato === 'INTEIRO'">
                        <input v-model="controle.valor" class="form-control" type="number" :disabled="_.includes(['visualizacao', 'impressao'], acao)" @blur="executarRegras(); validacaoElementoChave(idx)"
                            @keyup="controle.valor = _.toSafeInteger(('' + controle.valor).replace(/\D+/g, ''))"
                            :max="!_.isNull(controle.configuracao.maximo) ? controle.configuracao.maximo : 999999999999"
                            :min="!_.isNull(controle.configuracao.minimo) ? controle.configuracao.minimo : 0"
                            v-validate="controle.obrigatorio ? 'required' : ''" :name="controle.id"/>
                      </span>

                      <span v-else-if="controle.configuracao.formato === 'DECIMAL'"><!-- TODO decimal esta com problemas -->
                        <input v-model="controle.valor" class="form-control" type="text" :disabled="_.includes(['visualizacao', 'impressao'], acao)" @blur="executarRegras(); validacaoElementoChave(idx)"
                            @keyup="controle.valor = _.toNumber(('' + controle.valor).replace(/[^.0-9]+/g, ''))"
                            :max="!_.isNull(controle.configuracao.maximo) ? controle.configuracao.maximo : 999999999999"
                            :min="!_.isNull(controle.configuracao.minimo) ? controle.configuracao.minimo : 0"
                            v-validate="controle.obrigatorio ? 'required' : ''" :name="controle.id"/>
                      </span>

                      <span v-if="errors.firstByRule(controle.id, 'required')" class="label label-danger hidden-print">{{msgErroPreenchimento['obrigatorio']}}</span>
                      <span v-if="errors.firstByRule(controle.id, 'duplicidade')" class="label label-danger hidden-print"> {{errors.firstByRule(controle.id, 'duplicidade')}}</span>

                      <span v-if="errors.firstByRule(controle.id, 'max_value')" class="label label-danger hidden-print">Número maior que o limite de {{controle.configuracao.maximo}}</span>
                      <span v-if="errors.firstByRule(controle.id, 'min_value')" class="label label-danger hidden-print">Número menor que o limite de {{controle.configuracao.minimo}}</span>

                      <span v-if="errors.firstByRule(controle.id, 'cpf_digito')"  class="label label-danger hidden-print"> {{errors.firstByRule(controle.id, 'cpf_digito')}}</span>
                      <span v-if="errors.firstByRule(controle.id, 'cnpj_digito')" class="label label-danger hidden-print"> {{errors.firstByRule(controle.id, 'cnpj_digito')}}</span>
                      <span v-if="!_.isNull(loading.duplicidade) && controle.id === loading.duplicidade"><i class="etiquetaCarregando fa fa-refresh fa-spin"></i></span>
                    </div>


            <!-- Texto simples --------------------------------------------------->
                    <div class="col-md-12" v-if="controle.elemento === 'TEXTO_SIMPLES'">
                      <input type="text" class="form-control" v-model="controle.valor" :disabled="_.includes(['visualizacao', 'impressao'], acao)" @blur="executarRegras(); validacaoElementoChave(idx)"
                             :maxlength="_.toSafeInteger(controle.configuracao.maximo) === 0 ? 250 : _.toSafeInteger(controle.configuracao.maximo)"
                             v-validate="controle.obrigatorio ? 'required' : ''" :name="controle.id"/>
                      <span v-if="errors.firstByRule(controle.id, 'required')" class="label label-danger hidden-print">{{msgErroPreenchimento['obrigatorio']}}</span>
                      <span v-if="errors.firstByRule(controle.id, 'duplicidade')" class="label label-danger hidden-print"> {{errors.firstByRule(controle.id, 'duplicidade')}}</span>
                      <span v-if="!_.isNull(loading.duplicidade) && controle.id === loading.duplicidade"><i class="etiquetaCarregando fa fa-refresh fa-spin"></i></span>
                      <i v-if="_.toSafeInteger(controle.configuracao.maximo) > 1" style="float: right; color: silver">Até {{_.toSafeInteger(controle.configuracao.maximo)}} caracteres</i>
                    </div>


            <!-- Texto longo --------------------------------------------------->
                    <div class="col-md-12" v-if="controle.elemento === 'TEXTO_LONGO'">
                      <span v-if="_.isNull(controle.configuracao.formato) || controle.configuracao.formato === 'SOMENTE_TEXTO'">
                        <textarea v-resizable class="form-control" v-model="controle.valor" :disabled="_.includes(['visualizacao', 'impressao'], acao)" @blur="executarRegras()"
                                  :maxlength="_.toSafeInteger(controle.configuracao.maximo) === 0 ? 250 : _.toSafeInteger(controle.configuracao.maximo)"
                                  v-validate="controle.obrigatorio ? 'required' : ''" :name="controle.id">
                        </textarea>
                        <i v-if="_.toSafeInteger(controle.configuracao.maximo) > 1" style="float: right; color: silver">Até {{_.toSafeInteger(controle.configuracao.maximo)}} caracteres</i>
                      </span>
                      <span v-else>
                        <quill-editor
                          v-model="controle.valor"
                          ref="refQuillEditor"
                          :disabled="controle.grupo === 'PERSONALIZADO'"
                          :options="quillOptions"
                          v-validate="controle.obrigatorio ? 'required' : ''"
                          :name="controle.id">
                        </quill-editor>
                      </span>
                      <span v-if="errors.firstByRule(controle.id, 'required')" class="label label-danger hidden-print">{{msgErroPreenchimento['obrigatorio']}}</span>
                    </div>


            <!-- Seleção simples --------------------------------------------------->
                    <div class="col-md-6" v-if="controle.elemento === 'SELECAO_SIMPLES'">
                      <span v-if="controle.configuracao.formato === 'AUTOCOMPLETE'">
                        <multiselect v-model="controle.valor"
                                     :options="_.map(controle.configuracao.conteudo.linhas, 'descricao')"
                                     placeholder="Selecione uma opção"
                                     @select="executarRegras()"
                                     selectedLabel="Selecionado"
                                     selectLabel=""
                                     deselectLabel=""
                                     :name="controle.id"
                                     class="hidden-print"
                                     :disabled="_.includes(['visualizacao', 'impressao'], acao)"
                                     v-validate="controle.obrigatorio ? 'required' : ''">
                        </multiselect>
                      </span>
                      <span v-else>
                        <select class="form-control hidden-print" v-model="controle.valor" :disabled="_.includes(['visualizacao', 'impressao'], acao)" @change="executarRegras()"
                                v-validate="controle.obrigatorio ? 'required' : ''" :name="controle.id">
                          <option v-for="item in controle.configuracao.conteudo.linhas" :value="item.valor || item.descricao" v-if="item.mostrar">{{item.descricao}}</option>
                        </select>
                      </span>

                      <span v-if="errors.firstByRule(controle.id, 'required')" class="label label-danger hidden-print">{{msgErroPreenchimento['obrigatorio']}}</span>

                      <p v-for="item in _.take(controle.configuracao.conteudo.linhas, 50)" v-if="item.mostrar" class="col-md-12 visible-print">
                        <i class="fa fa-circle-thin"></i> {{item.descricao}}
                      </p>
                      <!-- se tiver mais de 50 linhas não deve mostrar caixa de texto para digitar o que deseja-->
                      <p v-if="controle.configuracao.conteudo.linhas.length > 50" class="col-md-12 text-bold visible-print">
                        ...<br/>
                        Observação: Tem {{controle.configuracao.conteudo.linhas.length}} elementos nesta lista.<br/>
                        Informe aqui, qual resposta para localizarmos o mais próximo quando for digitado este texto no sistema
                        <input type="text" class="form-control">
                      </p>
                    </div>


            <!-- Seleção múltipla --------------------------------------------------->
                    <div class="col-md-6" v-if="controle.elemento === 'SELECAO_MULTIPLA'">
                      <!-- 65588 - Selecionar mais de uma opção sem pressionar a tecla CTRL -->
                        <multiselect v-model="controle.valor"
                                     :options="_.map(controle.configuracao.conteudo.linhas, 'descricao')"
                                     placeholder="Selecione uma ou mais opções"
                                     @select="executarRegras()"
                                     selectedLabel="Selecionado"
                                     selectLabel=""
                                     deselectLabel=""
                                     :close-on-select="false"
                                     :multiple="true"
                                     :name="controle.id"
                                     class="hidden-print"
                                     :disabled="_.includes(['visualizacao', 'impressao'], acao)"
                                     v-validate="controle.obrigatorio ? 'required' : ''">
                        </multiselect>
                      
                      <span v-if="errors.firstByRule(controle.id, 'required')" class="label label-danger hidden-print">{{msgErroPreenchimento['obrigatorio']}}</span>
                      <p v-for="item in controle.configuracao.conteudo.linhas" v-if="item.mostrar" class="col-md-12 visible-print">
                        <i class="fa fa-square-o"></i> {{item.descricao}}
                      </p>
                    </div>


            <!-- Escolha binária (S/N) ------------------------------------------------>
                    <div class="col-md-6" v-if="controle.elemento === 'BOOLEANO'">
                      <span>
                        <label class="radio-inline new-control new-control-radio" style="padding-top: 7px;"><input type="radio" :name="controle.id" v-model="controle.valor" @change="executarRegras()" :value="controle.configuracao.conteudo.linhas[0].descricao" :disabled="_.includes(['visualizacao', 'impressao'], acao)" v-validate="controle.obrigatorio ? 'required' : ''"> {{controle.configuracao.conteudo.linhas[0].descricao}} <div class="new-control-indicator"></div></label>
                        <label class="radio-inline new-control new-control-radio" style="padding-top: 7px;"><input type="radio" :name="controle.id" v-model="controle.valor" @change="executarRegras()" :value="controle.configuracao.conteudo.linhas[1].descricao" :disabled="_.includes(['visualizacao', 'impressao'], acao)" v-validate="controle.obrigatorio ? 'required' : ''"> {{controle.configuracao.conteudo.linhas[1].descricao}} <div class="new-control-indicator"></div></label>
                      </span>
                      <span v-if="errors.firstByRule(controle.id, 'required')" class="label label-danger hidden-print">{{msgErroPreenchimento['obrigatorio']}}</span>
                    </div>


            <!-- Data --------------------------------------------------->
                    <div class="col-md-3" v-if="controle.elemento === 'DATA'">
                      <datepicker  input-class="form-control datepicker" :disabled="_.includes(['visualizacao', 'impressao'], acao)"
                                   :value="controle.valor || null" @input="valorPrimitivoElemento(idx, $event)"
                                   :language="$datePickerPtBR" maxlength="20" :use-utc="true" placeholder="__ /__ /____" format="dd/MM/yyyy"
                                   v-validate="controle.obrigatorio ? 'required' : ''" :name="controle.id">
                      </datepicker>

                      <span v-if="errors.firstByRule(controle.id, 'required')" class="label label-danger hidden-print">{{msgErroPreenchimento['obrigatorio']}}</span>
                    </div>


            <!-- Período (de..até) ---------------------------------------->
                    <div class="col-md-6" v-if="controle.elemento === 'PERIODO'">
                      <div class="input-group">
                        <span class="input-group-btn"><span class="btn" style="cursor: default">De</span></span>
                        <datepicker  input-class="form-control datepicker" :language="$datePickerPtBR" maxlength="20" :use-utc="false" placeholder="__ /__ /____" format="dd/MM/yyyy"
                                     :value="_.get(controle.valor, 'inicio', null)" @input="valorArrayElemento(idx, 'inicio', $event)"
                                     :disabled="_.includes(['visualizacao', 'impressao'], acao)" :ref="controle.id + '-INICIO'" :name="controle.id + '-INICIO'"
                                     v-validate="('date_format:dd/MM/yyyy|before:' + controle.id + '-TERMINO, true') + (controle.obrigatorio ? '|required' : '')">
                        </datepicker>
                        <span v-if="errors.firstByRule(controle.id, 'before')" class="label label-danger hidden-print"> {{msgErroPreenchimento['antes']}}</span>

                        <span class="input-group-btn"><span class="btn" style="cursor: default">Até</span></span>
                        <datepicker  input-class="form-control datepicker" :language="$datePickerPtBR" maxlength="20" :use-utc="false" placeholder="__ /__ /____" format="dd/MM/yyyy"
                                     :value="_.get(controle.valor, 'termino', null)" @input="valorArrayElemento(idx, 'termino', $event)"
                                     :disabled="_.includes(['visualizacao', 'impressao'], acao)" :ref="controle.id + '-TERMINO'" :name="controle.id + '-TERMINO'"
                                     v-validate="('date_format:dd/MM/yyyy|after:' + controle.id + '-INICIO, true') + (controle.obrigatorio ? '|required' : '')">
                        </datepicker>
                      </div>
                      <span v-if="errors.firstByRule(controle.id + '-INICIO', 'after') || errors.firstByRule(controle.id + '-TERMINO', 'after')" class="label label-danger hidden-print"> {{msgErroPreenchimento['depois']}}</span>
                      <span v-if="errors.firstByRule(controle.id + '-INICIO', 'before') || errors.firstByRule(controle.id + '-TERMINO', 'before')" class="label label-danger hidden-print"> {{msgErroPreenchimento['antes']}}</span>
                      <span v-if="errors.firstByRule(controle.id + '-INICIO', 'required') || errors.firstByRule(controle.id + '-TERMINO', 'required') || errors.firstByRule(controle.id + '-INICIO', 'date_format') || errors.firstByRule(controle.id + '-TERMINO', 'date_format')" class="label label-danger hidden-print">{{msgErroPreenchimento['obrigatorios']}}</span>
                    </div>


            <!-- UF e Município ------------------------------------------->
                    <div class="col-md-6" v-if="controle.elemento === 'UF_MUNICIPIO'">
                      <multiselect v-model="controle.valor"
                                   :options="municipiosUf"
                                   :disabled="_.includes(['visualizacao', 'impressao'], acao)"
                                   placeholder="Nome do município"
                                   label="nomcid"
                                   group-values="municipios"
                                   group-label="uf"
                                   track-by="codrai"
                                   :preselect-first="false"
                                   :close-on-select="true"
                                   selectLabel="Selecionar"
                                   deselectLabel="Desselecionar"
                                   selectedLabel=""
                                   class="hidden-print"
                                   :name="controle.id"
                                   @select="executarRegras()"
                                   v-validate="controle.obrigatorio ? 'required' : ''">
                      </multiselect>
                      <p class="col-md-12 visible-print" v-if="_.has(controle.valor, 'nomcid')">{{controle.valor.nomcid}} / {{controle.valor.sigufs}}</p>
                      <span v-if="errors.firstByRule(controle.id, 'required')" class="label label-danger hidden-print">{{msgErroPreenchimento['obrigatorio']}}</span>

                    </div>



            <!-- Classificação --------------------------------------------------->
                    <div class="col-md-12" v-if="controle.elemento === 'CLASSIFICACAO'">

                      <span v-if="controle.configuracao.formato === 'NUMEROS'">
                        <span :class="(_.includes(['visualizacao', 'impressao'], acao) ? '' : 'elemento_classificacao') + ' classificacao_numeral fa fa-stack fa-2x '"
                              v-for="n in _.range(_.toSafeInteger(controle.configuracao.minimo), _.toSafeInteger(controle.configuracao.padrao) + 1)"
                              @click="!_.includes(['visualizacao', 'impressao'], acao) ? valorPrimitivoElemento(idx, valorPrimitivoElemento(idx) === n ? -1 : n) : false">
                          <i :class="'fa fa-solid fa-stack-1x ' + (n <= _.toSafeInteger(controle.valor) ? 'fa-circle' : 'fa-circle-thin text-gray')"></i>
                          <span :class="'fa fa-stack-1x ' + (n <= _.toSafeInteger(controle.valor) ? 'fa-inverse' : '')">{{n}}</span>
                        </span>
                      </span>
                      <span v-else>
                        <i v-for="n in _.range(_.toSafeInteger(controle.configuracao.minimo), _.toSafeInteger(controle.configuracao.padrao) + 1)"
                           :class="(_.includes(['visualizacao', 'impressao'], acao) ? '' : 'elemento_classificacao') + ' fa fa-2x ' +
                                                 (_.isNull(controle.configuracao.formato) ||
                                                  controle.configuracao.formato === 'ESTRELA' ? (n <= _.toSafeInteger(controle.valor) ? 'fa-star'         : 'fa-star-o text-gray'      ) :
                                                 (controle.configuracao.formato === 'CIRCULO' ? (n <= _.toSafeInteger(controle.valor) ? 'fa-circle'       : 'fa-circle-thin text-gray' ) :
                                                 (controle.configuracao.formato === 'LIKE'    ? (n <= _.toSafeInteger(controle.valor) ? 'fa-thumbs-o-up'  : 'fa-thumbs-up text-gray'   ) :
                                                 (controle.configuracao.formato === 'EMOJI'   ? (n <= _.toSafeInteger(controle.valor) ? 'fa-smile-o'      : 'fa-meh-o text-gray'       ) :
                                                 ''))))"
                           @click="!_.includes(['visualizacao', 'impressao'], acao) ? valorPrimitivoElemento(idx, valorPrimitivoElemento(idx) === n ? -1 : n) : false"></i>
                      </span>

                      <span v-if="errors.firstByRule(controle.id, 'required') && _.isNull(controle.valor)" class="label label-danger hidden-print">{{msgErroPreenchimento['obrigatorio']}}</span>
                      <input type="hidden" v-model="controle.valor" v-validate="_.isNull(controle.valor) && controle.obrigatorio ? 'required' : ''" :name="controle.id"><!-- serve para registro no bag de erros e formataçao do label -->

                    </div>


            <!-- Net Promote Scale --------------------------------------->
                    <div class="col-md-12 control-label" v-if="controle.elemento === 'NPS'">
                      <table :class="_.includes(['visualizacao', 'impressao'], acao) ? 'elemento_NPS_escala_inativo' : 'elemento_NPS_escala'" border="1">
                        <tr>
                          <td v-for="n in _.range(1, _.toSafeInteger(controle.configuracao.padrao) + 1)"
                                :class="'text-center ' + (n === _.toSafeInteger(controle.valor) ? 'bg-black' : '')"
                                @click="!_.includes(['visualizacao', 'impressao'], acao) ? valorPrimitivoElemento (idx, n) : false"> {{n}} </td>
                        </tr>
                      </table>
                      <table class="elemento_NPS_limites">
                        <tr><td class="truncar">{{controle.configuracao.conteudo.linhas[0].descricao}}</td><td class="text-right truncar">{{controle.configuracao.conteudo.linhas[1].descricao}}</td></tr>
                      </table>
                      <span v-if="errors.firstByRule(controle.id, 'required') && _.isNull(controle.valor)" class="label label-danger hidden-print">{{msgErroPreenchimento['obrigatorio']}}</span>
                      <input type="hidden" v-model="controle.valor" v-validate="_.isNull(controle.valor) && controle.obrigatorio ? 'required' : ''" :name="controle.id"><!-- serve para registro no bag de erros e formataçao do label -->
                    </div>


            <!-- Likert ------------------------------------------->
                    <div class="col-md-12 control-label" v-if="controle.elemento === 'LIKERT'">
                      <table class="elemento_likert_matrix table-hover">
                        <thead>
                          <tr>
                            <th class="w30">&nbsp;</th>
                            <th v-for="coluna in controle.configuracao.conteudo.colunas" class="elemento_likert_cabecalho_coluna"  v-if="coluna.mostrar">{{coluna.descricao}}</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr v-for="(linha, idxLinha) in controle.configuracao.conteudo.linhas">
                            <td class="elemento_likert_pergunta">{{_.isEmpty(linha.descricao) ? 'Informe uma questão ...' : linha.descricao}}</td>
                            <td v-for="(coluna, idxColuna) in controle.configuracao.conteudo.colunas" class="elemento_likert_opcoes" v-if="coluna.mostrar">
                              <i @click="!_.includes(['visualizacao', 'impressao'], acao) ? valorArrayElemento(idx, linha.descricao, coluna.descricao) : false"
                                 :class="'fa fa-2x ' + (valorArrayElemento(idx, linha.descricao) === coluna.descricao ? 'fa-circle' : 'fa-circle-thin')"></i>
                            </td>
                          </tr>
                        </tbody>
                      </table>

                      <span v-if="errors.firstByRule(controle.id, 'required') && _.isNull(controle.valor)" class="label label-danger hidden-print">{{msgErroPreenchimento['obrigatorio']}}</span>
                      <input type="hidden" v-model="controle.valor" v-validate="(_.isNull(controle.valor) || controle.configuracao.conteudo.linhas.length > (_.keys(controle.valor)).length) && controle.obrigatorio ? 'required' : ''" :name="controle.id"><!-- serve para registro no bag de erros e formataçao do label -->
                    </div>



                  </div>


    <!-- Seção de elementos de Layout --------------------------------------------------------------------------------------------------------------------------------->
                  <div v-if="_.includes(['LAYOUT'], controle.grupo)">
                    <div class="col-md-12" v-if="controle.elemento === 'TEXTO_FIXO'">
                      <div v-html="controle.titulo"/>
                    </div>

                    <div class="col-md-12" v-if="controle.elemento === 'LINHA_HORIZONTAL'">
                      <hr/>
                    </div>

                    <div class="col-md-12" v-if="controle.elemento === 'LOGOMARCA_FBB'">
                      <div v-if="!_.isEmpty(controle.descricao)">
                        <a :href="controle.descricao">
                          <img :src="_.get(controle.configuracao, 'formato', 'LOGO_HORIZONTAL') === 'LOGO_HORIZONTAL' ? '/static/img/logo-login.png' : '/static/img/logo-vertical.png'" :alt="controle.titulo" />
                        </a>
                      </div>
                      <div v-else>
                        <img :src="_.get(controle.configuracao, 'formato', 'LOGO_HORIZONTAL') === 'LOGO_HORIZONTAL' ? '/static/img/logo-login.png' : '/static/img/logo-vertical.png'" :alt="controle.titulo" />
                      </div>
                    </div>

                    <div :class="('secao_' + (_.isEmpty(controle.configuracao) ? 'padrao' : _.toLower(controle.configuracao.formato))) + ' col-md-12'" v-if="controle.elemento === 'SECAO'" v-bind:style="!_.isNull(editandoFormulario) ? 'color: black !important' : ''">
                      <span v-html="controle.titulo"></span>
                      <i v-if="_.has(controle, 'descricao') && !_.isEmpty(controle.descricao)" class="fa fa-question-circle hidden-print" :title="'<h5>' + (controle.descricao) + '</h5>'" aria-hidden="true" v-tippy="{inertia:true, arrow:true, animation:'perspective', distance:'1', size:'large', arrow:true}"></i>
                      <span v-if="!_.isEmpty(controle.descricao)" class="visible-print">
                        <span style="font-size: small !important; font-style: italic">{{controle.descricao}}</span>
                      </span>
                    </div>
                  </div>




    <!-- Seção de subformulário ------------------------------------------->
                  <div v-if="controle.grupo === 'FORMULARIO' && !_.isNull(controle.configuracao.conteudo)" class="hidden-print">

                    <label class="control-label col-md-12 tituloControle">
                      <span class="text-gray" v-if="!_.isNull(formularioCadastrado.opcoes.numeracao) && _.has(controle, 'numeracao')">{{ controle.numeracao }})</span>

                      <span v-html="_.isEmpty(controle.titulo) ? 'Tílulo não encontrado!!!' : controle.titulo"></span>
                      <i v-if="!_.isEmpty(controle.descricao)" class="fa fa-question-circle hidden-print" :title="'<h5>' + (controle.descricao) + '</h5>'" aria-hidden="true" v-tippy="{inertia:true, arrow:true, animation:'perspective', distance:'1', size:'large', arrow:true}"></i>
                    </label>
                    <span v-html="controle.descricao" class="visible-print" style="font-style: italic"></span>

                    <span v-if="_.includes(['edicao', 'visualizacao'], acao)">

                      <span v-if="!_.includes(['SOMENTE_LINK'], controle.configuracao.formato)">
                        <div class="col-md-3" v-if="_.includes(['COMPLETO_COM_LINK', 'COMPLETO_SEM_LINK'], controle.configuracao.formato) && !loading.link">
                          <span v-if="!_.includes(['visualizacao', 'impressao'], acao)">
                            <g-button-ujarak color="primary" @click.native="abreFormulario(controle.configuracao.padrao[0])" type="button"><i class="fa fa-plus-circle" aria-hidden="true"></i>  Adicionar</g-button-ujarak>
                            <g-button-ujarak color="primary" @click.native="carregaDadosSubForm(idx, controle.configuracao.padrao[0])" type="button"><i class="fa fa-refresh" aria-hidden="true"></i></g-button-ujarak>
                          </span>
                        </div>

                        <div class="col-md-3">
                          <input v-model="controle.configuracao.conteudo.filter" type="text" class="form-control" placeholder="Pesquisa...">
                          <span v-if="!_.isNull(controle.configuracao.conteudo.filter) && controle.configuracao.conteudo.filter.length > 0" class="info_discreto">{{controle.configuracao.conteudo.totalRows}} localizado(s)</span>
                        </div>

                        <div class="col-md-5" v-if="_.includes(controle.configuracao.formato, 'COM_LINK')">
                          <span v-if="!_.includes(['visualizacao', 'impressao'], acao)">
                            <span v-if="loading.link" class="etiquetaCarregando"><i class='fa fa-refresh fa-spin'></i> Gerando link ...</span>
                            <span v-else>
                              <span class="link_acesso" @click="copiaUrlSubFormulario(controle)" style="display: flex" :title="'<h5>Clique para copiar link para uso externo ao SGP</h5>'" v-tippy="{inertia:true, arrow:true, placement:'top', animation:'perspective', distance:'1', size:'large', arrow:true, delay: [500, 0]}">
                                <div class="truncar">{{controle.configuracao.padrao[0]}}</div>
                                <i class="fa fa-clone"></i>
                                <span v-if="_.has(controle.configuracao, 'link_copia')" :class="_.get(controle.configuracao, 'link_copia.classe')">{{_.get(controle.configuracao, 'link_copia.msg')}}</span>
                              </span>
                              <span style="font-size: small; color: var(--cor-alerta-dark)">{{controle.informacao}}</span>
                            </span>
                          </span>
                        </div>

                        <div class="col-md-12">&nbsp;</div> <!-- linha em branco-->

                        <div class="">
                          <b-container fluid>
                            <b-table show-empty
                                     stacked="md"
                                     striped
                                     :ref="controle.id + '(' + numeroAtualizacao + ')'"
                                     :bordered="controle.configuracao.conteudo.bordered"
                                     :items="controle.valor"
                                     :fields="controle.configuracao.conteudo.colunas"
                                     :current-page="controle.configuracao.conteudo.currentPage"
                                     :per-page="controle.configuracao.conteudo.perPage"
                                     :filter="controle.configuracao.conteudo.filter"
                                     :filter-function="filtroPorItem"
                                     @filtered="onFiltered"
                                     empty-filtered-text="Nada foi encontrado. Refaça sua pesquisa!"
                                     empty-text="Nenhum registro encontrado"
                                     :sort-by.sync="controle.configuracao.conteudo.sortBy"
                                     :sort-desc.sync="controle.configuracao.conteudo.sortDesc">

                              <template slot="actions" scope="row" v-if="!_.includes(controle.configuracao.formato, 'MINIMO')">
                                <span v-if="_.get(row.item, '_rowVariant', '') === 'form-salvando'">Salvando...</span>
                                <span v-else-if="_.get(row.item, '_rowVariant', '') === 'form-fechando'">Fechando...</span>
                                <span v-else-if="!_.includes(['visualizacao', 'impressao'], acao)">
                                  <span v-if="!_.get(row.item, '_rowVariant')">
                                    <g-button-ujarak color="primary" @click.native="abreFormulario(row.item.editar)" size="button--size-ss" v-if="_.includes(controle.configuracao.formato, 'COMPLETO')"><i class="fa fa-pencil-square-o" aria-hidden="true"></i> Editar</g-button-ujarak >
                                  </span>
                                  <span v-else>Em uso agora!</span>
                                  <g-button-ujarak color="success" @click.native="abreFormulario(row.item.visualizar)"size="button--size-ss"> <i class="fa fa-search" aria-label="false"></i> Visualizar</g-button-ujarak>
                                  <g-button-ujarak color="error"   @click.native="excluirItemSubFormulario(idx, controle.configuracao.padrao[0], row.item.excluir)"size="button--size-ss" v-if="_.includes(controle.configuracao.formato, 'COMPLETO')"><i class="fa fa-trash" aria-hidden="true"></i> Excluir</g-button-ujarak >
                                  <span style="font-size: small; color: steelblue">{{_.get(row.item, 'andamento', '')}}</span>
                                </span>
                                <span v-else>&nbsp;</span>
                              </template>

                            </b-table>

                            <b-row style="display: flex; align-items: center;">
                              <b-col md="6" class="my-1" right style="margin-top: 0">
                                <span v-if="!_.isNull(controle.valor) && controle.valor.length > 0 && controle.configuracao.conteudo.totalRows > controle.configuracao.conteudo.perPage">
                                  <b-pagination :total-rows="controle.configuracao.conteudo.totalRows" :per-page="controle.configuracao.conteudo.perPage" v-model="controle.configuracao.conteudo.currentPage" class="my-3" />
                                </span>
                                <span v-else>&nbsp;</span>
                              </b-col>
                              <b-col md="6" right class="text-right">
                                Total de <strong>{{controle.valor.length}}</strong> registro(s)
                              </b-col>
                            </b-row>

                          </b-container>
                        </div>
                      </span>

                      <span v-else>
                        <div class="col-md-12">
                          <span v-if="loading.link" class="etiquetaCarregando"><i class='fa fa-refresh fa-spin'></i> Gerando link ...</span>
                          <span v-else>
                            <g-button-ujarak color="primary" @click.native="carregaDadosSubForm(idx, controle.configuracao.padrao[0])" type="button"><i class="fa fa-refresh" aria-hidden="true"></i></g-button-ujarak>
                            Link de acesso para este formulário. Repasse para quem for preencher ele: <br/>
                            <span class="link_acesso" @click="copiaUrlSubFormulario(controle)" :title="'<h5>Clique para copiar link para uso externo ao SGP</h5>'" v-tippy="{inertia:true, arrow:true, placement:'top', animation:'perspective', distance:'1', size:'large', arrow:true, delay: [500, 0]}">
                              {{controle.configuracao.padrao[0]}}
                              <i class="fa fa-clone"></i>
                              <span v-if="_.has(controle.configuracao, 'link_copia')" :class="_.get(controle.configuracao, 'link_copia.classe')">{{_.get(controle.configuracao, 'link_copia.msg')}}</span>
                            </span>
                          </span>
                        </div>
                      </span>
                    </span>

                    <span v-else class="col-md-12"> <!-- Mostrar somente no formato de impressao -->
                      Total de <strong>{{controle.valor.length}}</strong> formulários preenchidos
                    </span>

                  </div>


                  <br class="visible-print" v-for="n in 2" v-if="controle.mostrar"/> <!-- Pula n linhas na impressão somente -->

                </div>

              </div>

              <div v-show="loading.tela" class="overlay" style="position: absolute; top: 0px; left: 0px; width: 100%; height: 100%; display: block;"><i class="fa fa-refresh fa-spin"></i></div>

            </div>
          </div>
        </div>





    <!-- Histórico ----------------------------------------------------------------------------->
        <div class="row hidden-print" v-if="!_.isNull(processo) && _.has(processo, 'tarefas') && processo.tarefas.length > 1 && (formularioCadastrado.opcoes.historico === 'TODOS' || (!ehAcessoExterno && usuarioLogado.userType === 'FUNDACAO' && formularioCadastrado.opcoes.historico === 'SOMENTE_FBB'))">
          <div class="col-md-12 form-horizontal">
            <div class="box box-primary">
              <div v-show="loading.tela" class="overlay" style="position: absolute; top: 0px; left: 0px; width: 100%; height: 100%; display: block;"><i class="fa fa-refresh fa-spin"></i></div>

              <div class="box-header with-border secaoRetratil" @click="mostrarHistorico = !mostrarHistorico">
                <h3 class="box-title"><i class="fa fa-list" aria-hidden="true"></i> Histórico</h3>
                <span><i :class="'fa fa-caret-' + (mostrarHistorico ? 'up' : 'down')"></i></span>
              </div>

              <div class="form-horizontal" v-if="mostrarHistorico">

                <div class="box-body">
                  <div class="row">
                    <div class="col-md-12 table-responsive">
                      <div class="">
                        <table class="table table-condensed table-bordered table-striped">
                          <thead>
                          <tr class="text-center text-bold">
                            <td class="w15">Enviado em</td>
                            <td class="w15">Concluído em</td>
                            <td class="w10">Fase</td>
                            <td class="w40">Observação</td>
                            <td class="w20">Usuário Responsável</td>
                          </tr>
                          </thead>
                          <tbody>
                          <tr v-for="tarefa in _.filter(processo.tarefas, ['tipo', 'USUARIO'])" class="text-center">
                            <td>{{tarefa.inicio | moment('DD/MM/YYYY hh:mm')}}</td>
                            <td>
                              <span v-if="_.isNull(tarefa.termino)">Pendente</span>
                              <span v-else>{{tarefa.termino | moment('DD/MM/YYYY hh:mm')}}</span>
                            <td>{{nomesTarefas[tarefa.nome]}}</td>
                            <td>
                              <span v-if="_.isNull(tarefa.termino)">&nbsp;</span>
                              <span v-else>{{tarefa.observacao}}</span>
                            </td>
                            <td>{{tarefa.usuario.ds_nome_usuario}}</td>
                          </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>

                    <div class="col-md-12">
                      <span v-if="processo.situacao === 'EM_EXECUCAO'">
                        Processo <span style="font-weight: bold; color: var(--cor-destaque)">Em Execução</span> desde <strong>{{processo.inicio | moment('DD/MM/YYYY hh:mm')}}</strong>
                      </span>
                      <span v-if="processo.situacao === 'FEITO'">
                        Processo foi <span style="font-weight: bold; color: var(--cor-sucesso)">Concluído</span> em <strong>{{processo.termino | moment('DD/MM/YYYY hh:mm')}}</strong>
                      </span>
                      <span v-if="processo.situacao === 'CANCELADO'">
                        Processo foi <span style="font-weight: bold; color: var(--cor-atencao)">Cancelado</span> em <strong>{{processo.termino | moment('DD/MM/YYYY hh:mm')}}</strong>
                      </span>
                    </div>

                  </div>

                </div>

              </div>

            </div>

          </div>

        </div>




    <!-- Decisões ----------------------------------------------------------------------------->
        <div class="row hidden-print" v-if="!_.includes(['SOLICITACAO', 'REVISAO'], ultimaTarefa.nome) && !ehAcessoExterno && !ehSubFormulario && usuarioLogado.userType === 'FUNDACAO'">
          <div class="col-md-12 form-horizontal">
            <div class="box box-primary">
              <div v-show="loading.tela" class="overlay" style="position: absolute; top: 0px; left: 0px; width: 100%; height: 100%; display: block;"><i class="fa fa-refresh fa-spin"></i></div>

              <div class="box-header with-border">
                <h3 class="box-title"><i class="fa fa-pencil" aria-hidden="true"></i> Decisão</h3>
              </div>

              <div class="form-horizontal">

                <div class="box-body">
                  <div class="row">
                    <div class="col-md-12">
                      <div class="form-group required col-md-12" ref="decisão">

                      <!-- Aprovação -->
                        <div class="col-md-12">
                          <label class="new-control new-control-radio" style="padding-top: 8px;">
                            <input type="radio" name="decisão" value="CONCLUSAO" :disabled="_.includes(['visualizacao', 'impressao'], acao)"
                                   v-model="aprovacao.resultadoAprovacao" v-validate="'required'"/> Aprovar formulário
                            <div class="new-control-indicator"></div>
                          </label>
                        </div>


                      <!-- Revisão da entidade -->
                        <div class="col-md-12">
                          <label class="new-control new-control-radio" style="padding-top: 8px;">
                            <input type="radio" name="decisão" value="REVISAO" :disabled="_.includes(['visualizacao', 'impressao'], acao)"
                                   v-model="aprovacao.resultadoAprovacao" v-validate="'required'"/> Encaminhar para revisão
                            <div class="new-control-indicator"></div>
                          </label>
                        </div>
                        <div v-if="errors.first('decisão')" class="label label-danger"> {{ errors.first('decisão') }}</div>


                      <!-- Observação ou Justificativa de devolução para entidade -->
                        <div class="col-md-12" v-if="!_.isNull(formularioCadastrado.opcoes.observacao)">
                          <div v-if="_.includes(['CONCLUSAO', 'REVISAO'], aprovacao.resultadoAprovacao)"
                               :class="(aprovacao.resultadoAprovacao === 'REVISAO' ? 'required-field' : '') + ' col-md-12 ' + (errors.first('observacao') ? 'has-error' : '')">
                            <label for="observacao" class="control-label">
                              {{ aprovacao.resultadoAprovacao === 'REVISAO' ? 'Motivo para revisão' : 'Observação' }}:
                            </label>
                            <textarea name="observacao" v-model="aprovacao.observacao" rows="3" id="observacao" class="form-control"
                                      v-validate="aprovacao.resultadoAprovacao === 'REVISAO' ? 'required' : ''" :disabled="_.includes(['visualizacao', 'impressao'], acao)"></textarea>
                            <span v-if="errors.first('observacao')" class="label label-danger"> {{ errors.first('observacao') }}</span>
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



  <!-- Observação opcional ----------------------------------------------------------------------------->
        <div class="row hidden-print" v-if="formularioCadastrado.opcoes.observacao === 'TODOS' && !ehSubFormulario && ((!ehAcessoExterno && usuarioLogado.userType !== 'FUNDACAO') || ehAcessoExterno)">
          <div class="col-md-12 form-horizontal">
            <div class="box box-primary">
              <div v-show="loading.tela" class="overlay" style="position: absolute; top: 0px; left: 0px; width: 100%; height: 100%; display: block;"><i class="fa fa-refresh fa-spin"></i></div>
              <div class="box-header with-border"><h3 class="box-title"><i class="fa fa-pencil" aria-hidden="true"></i> Observação</h3></div>
                <div class="box-body">
                  <div class="form-group col-md-12">
                    <div class="col-md-12">
                      <label class="control-label">Opcionalmente pode adicionar informação sobre este formulário</label>
                      <textarea v-model="aprovacao.observacao" rows="3" class="form-control" :disabled="_.includes(['visualizacao', 'impressao'], acao)"></textarea>
                    </div>
                  </div>
                </div>
            </div>
          </div>
        </div>



      </section>

    </div>

<!--Quando se trata de ação para novo form, ou seja, veio de um form cadastro (não esta vinculado a projeto) ----------------------------------------------------------------------->
    <div v-else-if="!loading.tela">
      <section class="content-header" v-bind:style="ehAcessoExterno ? 'background: #ecf0f5; margin-top: 10px;' : ''">
        <div v-if="ehAcessoExterno" class="login-logo yellow-bg" style="margin-top: 0px;"><img src="/static/img/logo-login.png"></div>
        <h1>{{formularioCadastrado.nome}}</h1>
      </section>
      <section class="content" v-bind:style="ehAcessoExterno ? ' background: #ecf0f5; margin-top: 0;' : ''">
        <div class="row">
          <div class="col-md-12">
            <div class="box box-widget">
              <div class="box-body">
                <div class="col-md-12">
                  <h5>
                    Esta abrindo um formulário novo. <br/>
                    Se continuar, então abrirá um novo link para que possa preencher, salvar e enviar o formulário para FBB.
                    <br/><br/>
                    Deseja continuar?
                    <br/><br/>
                  </h5>
                </div>
                <div class="col-md-12">
                  <g-button-moema color="success" @click.native="gerarNovoFormularioPreenchimento" type="button"><i class="fa fa-check" aria-hidden="true"></i> Sim</g-button-moema>
                  <div class="espacamento_botoes"></div>
                  <g-button-moema color="error" @click.native="$router.replace('/#/inicial')" type="button"><i class="fa fa-ban" aria-hidden="true"></i> Não</g-button-moema>
                </div>

                <div v-show="loading.tela" class="overlay" style="position: absolute; top: 0px; left: 0px; width: 100%; height: 100%; display: block;"><i class="fa fa-refresh fa-spin"></i></div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>



  </div>

</template>


<script>
  /* eslint-disable no-unused-vars */
  import { mapGetters } from 'vuex'
  import * as XLSX from 'xlsx'
  import { cpf, cnpj } from 'cpf-cnpj-validator'
  import moment from 'moment'

  export default {
    name: 'PreencheFormulario',
    data () {
      return {
        quillOptions: {
          modules: {
            toolbar: [
              ['bold', 'italic', 'underline', 'strike'],
              [{'list': 'ordered'}, {'list': 'bullet'}],
              [{'script': 'sub'}, {'script': 'super'}],
              [{'color': []}, {'background': []}],
              ['video', 'image'],
              ['clean']
            ],
            imageResize: {
              displaySize: true
            },
            imageCompress: {
              quality: 0.7,
              maxWidth: 800,
              imageType: 'image/jpeg'
            }
          },
          theme: 'bubble',
          readonly: false
        },
        loading: {
          tela: false,
          programas: false,
          link: false,
          excluindo: false,
          duplicidade: null
        },
        msgErroPreenchimento: {obrigatorio: 'Este campo é obrigatório', obrigatorios: 'Estes campos são obrigatórios', antes: 'Deve ser igual ou antes da data anterior', depois: 'Deve ser igual ou após a data seguinte'},
        salvaFormulario: {
          salvamentoAutomaticoAtivo: false,
          statusSalvamento: 'AGUARDANDO', // 'AGUARDANDO', 'PROCESSANDO', 'FEITO', 'ERRO'
          idTimerSalvamentoAutomatico: null,
          tempoSalvamentoAutomatico: 60000, // A cada 1 min
          contador: 0
        },
        programasSociais: [],
        acao: null,
        projeto: null,
        processo: null,
        ehAcessoExterno: false,
        ehSubFormulario: false,
        municipiosUf: [],
        formularioBackup: [],
        formularioPreenchimento: {
          id: null,
          origem: '',
          formulario: [],
          fk_processo: null
        },
        formularioPreenchimentoTemp: {}, // Se trata de uma cópia temporária do formulário para comparação se houve alteração ou não para efeito de salvamento automático
        ultimaTarefa: {
          nome: 'SOLICITACAO'
        },
        aprovacao: {
          resultadoAprovacao: null,
          observacao: null
        },
        formularioCadastrado: {
          id: null,
          nome: '',
          tipo: '',
          link_acesso: '',
          formulario: [],
          opcoes: {
            elemento_chave: null,
            abrir: {acao: 'FORCA_SOMENTE_LEITURA'},
            concluir: {acao: 'SAIR_FORMULARIO', parametro: null}
          }
        },
        formulario: [],
        pesquisa: '',
        editandoElemento: null,
        dragging: false,
        numeroAtualizacao: 0,
        mostrarHistorico: false,
        tipoFormulario: [{codigo: 'AVALIACAO_APROVACAO', descricao: 'Marco zero'}, {codigo: 'AVALIACAO_ENCERRAMENTO', descricao: 'Marco um'}, {codigo: 'AVALIACAO_GENERICO', descricao: 'Genérico'}, {codigo: 'AVALIACAO_PARTICIPANTE', descricao: 'Participante'}],
        nomesTarefas: {'FEITO': 'Feito', 'CANCELADO': 'Cancelado', 'EM_EXECUCAO': 'Em Execução', 'SOLICITACAO': 'Solicitação', 'ANALISE': 'Análise FBB', 'REVISAO': 'Revisão', 'REABILITA': 'Processo Reabilitado', 'CANCELA': 'Processo Cancelado', 'CONCLUSAO': 'Conclusão'}
      }
    },
    watch: {
    },
    computed: {
      ...mapGetters([
        'usuarioLogado',
        'urlLaravel'
      ])
    },
    mounted () {
    },
    created: function () {
      this.ehAcessoExterno = _.isNull(this.usuarioLogado) // Sem usuário logado significa que o acesso é externo, sem autenticação
      if (!_.isNull(this.$route.params.id)) {
        this.carregaFormulario()
      }
      this.salvamentoAutomatico()
    },
    beforeDestroy () {
      if (this.ehSubFormulario) {
        this.notificacaoDeFormPreenchimento('sub', this.formularioPreenchimento.id, {acao: 'SUB_FORMULARIO_FECHADO', valor: this.formularioPreenchimento['id_elemento']})
        if (!this.ehAcessoExterno) { // Ainda não há canal (rota) sem autenticação, então quando é externo não precisa deixar o canal que não foi assinado
          Echo.leave('formulario.sub.' + this.formularioPreenchimento.id)
        }
      } else {
        this.notificacaoDeFormPreenchimento('preenchido', this.formularioPreenchimento.id, {acao: 'FORMULARIO_FECHADO', valor: null})
        if (!this.ehAcessoExterno) { // Ainda não há canal (rota) sem autenticação, então quando é externo não precisa deixar o canal que não foi assinado
          Echo.leave('formulario.preenchido.' + this.formularioPreenchimento.id)
        }
      }
      clearInterval(this.salvaFormulario.idTimerSalvamentoAutomatico)
    },
    methods: {
      carregaFormulario () {
        this.loading.tela = true
        axiosLaravel.get('formulario/acesso/' + this.$route.params.id).then((response) => {
          if (_.has(response.data, 'codigo') && response.data.codigo === 'OK') {
            this.acao = response.data.retorno.acao
            if (this.acao === 'inativo') { // Verifica se a ação é referente a um form Inativo, nesta caso avisa e sai da tela
              if (this.ehAcessoExterno) { // acesso externo não tem snotify, usar o alert
                alert('Este formulário foi inativado')
              } else {
                this.$snotify.error('Este formulário foi inativado')
              }
              this.$router.replace('/#/inicial')
            } else {
              this.formularioCadastrado = response.data.retorno.formularioCadastrado
              this.processo = _.get(response.data.retorno, 'processo', null)
              this.acao = this.formularioCadastrado.opcoes.abrir.acao === 'FORCA_SOMENTE_LEITURA' || (_.has(this.processo, 'situacao') && this.processo.situacao !== 'EM_EXECUCAO') ? 'visualizacao' : this.acao // 'novo', 'edita', 'visualizacao', 'impressao'
              let edicaoComPreenchimento = this.acao === 'edicao' && _.has(response.data.retorno, 'formularioPreenchido')
              //
              // Verifica se a ação é para novo preenchimento, ou seja só há form cadastrado e não há form preenchimento (link de form cadastrado)
              if (this.acao === 'novo') {
                this.formularioCadastrado = response.data.retorno.formularioCadastrado
                if (typeof Storage !== 'undefined') {
                  // Ver se o browser suporta localStorage/sessionStorage.
                  let formulariosJaAcessadosLocalmente = JSON.parse(window.localStorage.getItem('formularios-sgp'))
                  if (_.isNull(formulariosJaAcessadosLocalmente)) {
                    // Cria registro da url acessada em 'cadastro' no storage
                    window.localStorage.setItem('formularios-sgp', JSON.stringify([{cadastro: this.$route.params.id}]))
                  } else {
                    // Se já tiver algum registro localmente no navegador (storage), então vai redirecionar para o form preenchimento
                    _.uniq(formulariosJaAcessadosLocalmente)
                    let formsCadastrados = _.filter(formulariosJaAcessadosLocalmente, ['cadastro', this.$route.params.id])
                    if (formsCadastrados.length > 0) {
                      let ultimoPreenchido = _.findLast(formulariosJaAcessadosLocalmente, function (form) { return _.has(form, 'preenchido') })
                      if (ultimoPreenchido && _.has(ultimoPreenchido, 'situacao')) {
                        if (ultimoPreenchido.situacao === 'concluido') {
                          // Se o que está no storage é de  que já foi concluído, então avisa e sai
                          alert('Jà concluiu este formulario nesta máquina')
                          this.$router.replace('/#/inicial')
                        } else if (_.includes(['iniciado', 'preenchendo'], ultimoPreenchido.situacao)) {
                          window.open(location.protocol + '//' + location.host + '/' + (this.ehAcessoExterno ? 'form' : 'formulario') + '/' + ultimoPreenchido.preenchido, '_self')
                        } else {
                          alert('Situacao não prevista para este formulário')
                          this.$router.replace('/#/inicial')
                        }
                      }
                    }
                  }
                }
              } else {
                edicaoComPreenchimento = this.acao === 'edicao' && _.has(response.data.retorno, 'formularioPreenchido')
                this.formularioPreenchimento = _.get(response.data.retorno, 'formularioPreenchido', response.data.retorno.formularioCadastrado)
                this.projeto = response.data.retorno['projeto'] || null// se vier projeto no response, se não mantém null
                this.ehSubFormulario = !_.isNull(this.formularioPreenchimento['fk_pai'])
                this.ultimaTarefa = response.data.retorno.ultimaTarefa || this.ultimaTarefa // TODO excluir esta linha
                this.acao = (this.ehAcessoExterno || this.usuarioLogado.userType !== 'FUNDACAO') && !_.includes(['SOLICITACAO', 'REVISAO'], this.ultimaTarefa.nome) ? 'visualizacao' : this.acao // Força a visualização caso não seja usuario da Fundação (entidade ou externo) e a etapa seja outra que não as que entidade e externo podem preencher
                if (_.isNull(this.formularioPreenchimento.formulario) || _.isEmpty(this.formularioPreenchimento.formulario) || this.formularioPreenchimento.formulario.length === 0) {
                  this.formularioPreenchimento.formulario = _.cloneDeep(_.isNull(this.formularioCadastrado.formulario) ? [] : this.formularioCadastrado.formulario)
                }
                this.formularioPreenchimento['link_acesso'] = this.$route.params.id
                this.formularioPreenchimento.formulario.forEach((controle, idx) => {
                  // Seleção Multipla (html) obriga que o valor seja um array, caso seja null (padrão) será alterado para []
                  if (controle.elemento === 'SELECAO_MULTIPLA' && _.isNull(controle.valor)) {
                    controle.valor = []
                  }
                  // Deve tratar o conteúdo dos sub formulários
                  if (controle.grupo === 'FORMULARIO') {
                    controle.informacao = ''
                    _.remove(controle.valor, ['actions', '...']) // Excluir 'actions ...' que é adicionado na edição para fins estéticos
                    if ((controle.configuracao.padrao[0]).length > 15) {
                      // Se já tiver url de sub form então atualiza ele
                      this.carregaDadosSubForm(idx, controle.configuracao.padrao[0])
                    } else {
                      // Se não tiver ainda url de sub form, então cria uma e depois atualiza o sub form
                      this.loading.link = true
                      let base = this.formularioPreenchimento.id + '|' + controle.configuracao.padrao[0] + '|' + controle.id
                      axiosLaravel.post('formulario/link/', {'texto': base}).then((response) => {
                        controle.configuracao.padrao[0] = response.data
                        this.loading.link = false
                        this.carregaDadosSubForm(idx, controle.configuracao.padrao[0])
                      })
                        .catch((error) => {
                          this.loading.link = false
                          this.$root.trataErro(error)
                        })
                    }
                  }
                })
                if (_.find(this.formularioPreenchimento.formulario, ['elemento', 'UF_MUNICIPIO'])) {
                  let listaMunicipios = []
                  axiosLaravel.get('formulario/municipios/lista/').then((response) => {
                    let listaAgrupada = _.groupBy(response.data, 'sigufs')
                    _.forEach(listaAgrupada, function (municipios, uf) {
                      listaMunicipios.push({'uf': uf, 'municipios': municipios})
                    })
                    this.municipiosUf = _.sortBy(listaMunicipios, ['uf'])
                  })
                }
                this.formularioBackup = _.cloneDeep(this.formularioCadastrado.formulario)
                this.formularioPreenchimentoTemp = _.cloneDeep(this.formularioPreenchimento) // Copia temporaria para comparacao no salvamento automatico
                if (this.acao === 'edicao') {
                  // Enviando notificações de abertura de formulario, somente para edição. Visualização e Impressão não precisam notificar
                  if (this.ehSubFormulario) {
                    let idOuChaveAcesso = (this.formularioPreenchimento['link_acesso']).length > 15 ? this.formularioPreenchimento['link_acesso'] : this.formularioPreenchimento.id
                    this.notificacaoDeFormPreenchimento('sub', idOuChaveAcesso, {acao: 'SUB_FORMULARIO_ABERTO', valor: this.formularioPreenchimento['id_elemento']})
                  } else {
                    this.notificacaoDeFormPreenchimento('preenchido', this.formularioPreenchimento.id, {acao: 'FORMULARIO_ABERTO', valor: null})
                  }
                }
              }
              // Ação de impressão já abre a janela de imprimir do navegador
              if (this.acao === 'impressao') {
                setTimeout(() => { window.print() }, 500)
              }
              // Quando se trata de edição com algo já preenchido, então ativa o salvamento automático, senão continuará o padrão: esperqando o primeiro clique no botão de salvar para iniciar o automático
              if (edicaoComPreenchimento) {
                this.salvaFormulario.salvamentoAutomaticoAtivo = true
                this.salvaFormulario.contador = 1
              }
            }
            this.assinaCanais()
          } else { // Quando o retorno não é OK
            this.aviso(response.data)
          }
          this.loading.tela = false
          this.$forceUpdate()
        })
          .catch((error) => {
            this.$root.trataErro(error)
            this.loading.tela = false
          })
      },
      carregaDadosSubForm (idx, chave) {
        axiosLaravel.get('formulario/subform/' + chave).then((response) => {
          if (_.has(response.data, 'codigo') && response.data.codigo === 'OK') {
            let saida = []
            let subForms = response.data.retorno
            subForms.forEach((subForm) => {
              // Cada sub formulario preenchido (linha)
              let formValores = {}
              subForm.formulario.forEach((elemento) => {
                // Cada elemento do sub formulario preenchido (coluna)
                if (!_.isNull(elemento.valor)) {
                  if (elemento.elemento === 'UF_MUNICIPIO' && _.has(elemento.valor, 'nomcid') && _.has(elemento.valor, 'sigufs')) {
                    elemento.valor = elemento.valor.nomcid + ' (' + elemento.valor.sigufs + ')'
                  } else if (elemento.elemento === 'DATA') {
                    elemento.valor = moment(elemento.valor).add(1, 'day').format('DD/MM/YYYY')
                  } else if (elemento.elemento === 'PERIODO' && _.has(elemento.valor, 'inicio') && _.has(elemento.valor, 'termino')) {
                    elemento.valor = moment(elemento.valor.inicio).format('DD/MM/YYYY') + ' - ' + moment(elemento.valor.termino).format('DD/MM/YYYY')
                  } else if (elemento.elemento === 'LIKERT' && _.values(elemento.valor).length > 0) {
                    elemento.valor = ((((JSON.stringify(_.countBy(_.values(elemento.valor)))).replaceAll('{', '')).replaceAll('}', '')).replaceAll('"', ''))
                  }
                }
                _.set(formValores, elemento.id, _.toString(elemento.valor))
              })
              let acessos = _.split(subForm.link_acesso, '-')
              _.set(formValores, 'idSubFormulario', subForm.id)
              _.set(formValores, 'idElemento', subForm.id_elemento)
              _.set(formValores, 'editar', acessos[1])
              _.set(formValores, 'visualizar', acessos[2])
              _.set(formValores, 'excluir', acessos[3])
              saida.push(formValores)
            })
            _.set(this.formularioPreenchimento.formulario[idx], 'valor', saida)
          //
          } else {
            this.aviso(response.data)
          }
          this.assinaCanaisRegistrosSubFormularios(idx)
          this.$forceUpdate()
        })
          .catch((error) => {
            this.$root.trataErro(error)
          })
      },
      assinaCanaisRegistrosSubFormularios (idx) {
        if (!this.ehAcessoExterno) { // Ainda não há canal (rota) sem autenticação, então quando é externo não se assina nem notifica canal
          // Notificações do(s) canal(is) do(s) SUB FORMULÁRIO(s) que já estão vinculado, se houver, a este formulário que está sendo preenchido
          let subFormularios = []
          if (idx) { // Informe idx se quiser que assine os canais somente de um controle de sub form somente. Se idx não informado, erá feito para todos controles de sub form
            subFormularios.push(this.formularioPreenchimento.formulario[idx])
          } else {
            subFormularios = _.filter(this.formularioPreenchimento.formulario, ['grupo', 'FORMULARIO'])
          }
          subFormularios.forEach((formulario) => {
            // Canais para subforms com chave "grande" (recebido quando se trata de novo reguistro)
            let canalSubFormRegistroNovo = 'formulario.sub.' + formulario.configuracao.padrao[0]
            window.Echo.channel(canalSubFormRegistroNovo)
              .listen('FormularioEvents', (notificacao) => {
                let acao = notificacao.mensagem.acao
                if (_.includes(['SUB_FORMULARIO_ABERTO', 'SUB_FORMULARIO_SALVANDO'], acao)) {
                  let chaveAcessoFormulario = notificacao.id
                  let idx = _.findIndex(this.formularioPreenchimento.formulario, ['configuracao.padrao.0', chaveAcessoFormulario])
                  let controle = this.formularioPreenchimento.formulario[idx]
                  controle.informacao = acao === 'SUB_FORMULARIO_ABERTO' ? 'Registro novo iniciado!' : (acao === 'SUB_FORMULARIO_SALVANDO' ? 'Atualizando...' : '')
                  setTimeout(() => {
                    controle.informacao = ''
                    this.numeroAtualizacao += 1
                  }, 2000)
                  if (acao === 'SUB_FORMULARIO_SALVANDO') {
                    this.carregaDadosSubForm(idx, chaveAcessoFormulario)
                  }
                }
              })
            //
            // Canais para cada registro do subform
            _.map(formulario.valor, 'idSubFormulario').forEach((idSubFormPreenchido) => {
              let canalSubForm = 'formulario.sub.' + idSubFormPreenchido
              window.Echo.channel(canalSubForm)
                .listen('FormularioEvents', (notificacao) => {
                  let acao = notificacao.mensagem.acao
                  let idFormulario = notificacao.id
                  let idElemento = notificacao.mensagem.valor // Pegar o id do elemento Ex.: "SUB_FORMULARIO-15" do valor e se não for null deve seguir
                  if (!_.isNull(idElemento)) {
                    let idx = _.findIndex(this.formularioPreenchimento.formulario, ['id', idElemento]) // Buscar o idx do elemento acima
                    let controle = this.formularioPreenchimento.formulario[idx]
                    let registro = _.find(controle.valor, ['idSubFormulario', idFormulario]) // Buscar nos valores resgiatrados no sub formulario, em qual deles o id do dub formulário é o id do form recebido na mensagem
                    if (registro) {
                      if (acao === 'SUB_FORMULARIO_ABERTO') {
                        _.set(registro, '_rowVariant', 'form-aberto')
                      } else if (acao === 'SUB_FORMULARIO_FECHADO') {
                        _.set(registro, '_rowVariant', 'form-fechando')
                        setTimeout(() => {
                          _.unset(registro, '_rowVariant')
                          this.numeroAtualizacao += 1
                        }, 4000)
                      } else if (acao === 'SUB_FORMULARIO_SALVANDO') {
                        _.set(registro, '_rowVariant', 'form-salvando')
                        controle.informacao = 'Atualizando...'
                        this.carregaDadosSubForm(idx, controle.configuracao.padrao[0])
                        setTimeout(() => {
                          _.set(registro, '_rowVariant', 'form-aberto')
                          controle.informacao = ''
                          this.numeroAtualizacao += 1
                        }, 2000)
                      } else if (acao === 'SUB_FORMULARIO_EDITANDO') {
                        let andamento = _.get(form, 'andamento')
                        _.set(registro, 'andamento', 'Preenchendo...')
                        setTimeout(() => {
                          _.set(registro, 'andamento', andamento)
                          this.numeroAtualizacao += 1
                        }, 800)
                      } else if (acao === 'PERCENTUAL_PREENCHIDO') {
                        _.set(registro, 'andamento', notificacao.mensagem.percentagem)
                      }
                      this.numeroAtualizacao += 1
                    }
                  }
                })
            })
          })
        }
      },
      salvamentoAutomatico () {
        this.salvaFormulario.idTimerSalvamentoAutomatico = setInterval(() => {
          // Somente salva automático se a funcionalidade estiver ativa, se já foi salvo alguma vez, se tem um id (não é para criar novo) e se houve alguma alteração entre o salvamento atual e o anterior
          if (this.salvaFormulario.salvamentoAutomaticoAtivo && this.salvaFormulario.contador > 0 && !_.isNull(this.formularioPreenchimento.id) && !_.isEqual(this.formularioPreenchimentoTemp, this.formularioPreenchimento)) {
            this.salvarPreenchimento(false)
          }
        }, this.salvaFormulario.tempoSalvamentoAutomatico)
      },
      validaConclusao () {
        if (_.isNull(this.loading.duplicidade) && this.errors.items.length === 0) { // Só valida o form se não estiver validando duplicidade e se não existir alguma validação já feita
          this.$validator.validateAll().then(validado => {
            if (!_.isNull(this.formularioCadastrado.opcoes.elemento_chave)) {
              // Atualiza a validação do campo chave por precaução para evitar duplicidade
              this.validacaoElementoChave(this.formularioCadastrado.opcoes.elemento_chave)
            }
            this.formularioPreenchimento.formulario.forEach((controle, idx) => { // Validações especiais
              if (_.has(controle.configuracao, 'formato') && _.includes(['CPF', 'CNPJ'], controle.configuracao.formato)) {
                this.validaCpfCnpj(idx) // Valida o digito do CPF ou CNPJ se houvererm no formulário
              }
            })
            if (validado && this.errors.items.length === 0) {
              this.loading.tela = true
              // TODO atualizar todos os subforms .... PROBLEMA: é assincrono e deve continuar assim, mas os dados devem vir de imediato... talvez seja melhor criar uma rota só para isto
              this.formularioPreenchimento.formulario.forEach((controle, idx) => {
                if (controle.grupo === 'FORMULARIO' && (controle.configuracao.padrao[0]).length === 15) {
                  this.carregaDadosSubForm(idx, controle.configuracao.padrao[0])
                }
              })
              //
              let formsParticipantes = _.filter(this.formularioPreenchimento.formulario, function (controle) { // Pega todos os sub forms de participantes que houverem no formulario
                return controle.grupo === 'FORMULARIO' && controle.configuracao.conteudo.tipo === 'AVALIACAO_PARTICIPANTE'
              })
              if (_.includes(['SOLICITACAO', 'REVISAO'], this.ultimaTarefa.nome)) { // VAlidações que só ocorrem na Solicitação ou Revisão
                if (!_.isNull(this.projeto) && formsParticipantes.length > 0) { // Se o formulário tem projeto vinculado e possui pelo menos um sub formulário de participantes
                  let participantesProjeto = _.sumBy(this.projeto['publicos_alvo'], 'nr_participantes_diretos')
                  if (participantesProjeto > 0) {
                    let totalRegistradoSubFormsParticipante = _.sumBy(formsParticipantes, 'valor.length')
                    let percentualRegistradoSobreContratado = participantesProjeto === 0 ? 0 : (totalRegistradoSubFormsParticipante / participantesProjeto)
                    //
                    // Cálculo de tamanho amostral de acordo com calculadora definida por Clayton (código-fonte na página https://comentto.com/calculadora-amostral/)
                    let intervaloConfianca = 0.95 // Percentual do nível de confiança da amostra
                    let margemErro = 0.05 // Percentual de erro na amostra
                    let distribuicao = 50 // Use 50 para distribuição heterogência e 80 para distribuição homogênia
                    let populacao = participantesProjeto
                    let Y, Real1, Real2, variavelPadronizadaPorNivelSignificancia
                    let PN = [0, -0.322232431088, -1.0, -0.342242088547, -0.0204231210245, -0.453642210148E-4]
                    let QN = [0, 0.0993484626060, 0.588581570495, 0.531103462366, 0.103537752850, 0.38560700634E-2]
                    let Pr = 0.5 - intervaloConfianca / 2
                    if (Pr <= 1.0E-8) variavelPadronizadaPorNivelSignificancia = 6
                    else {
                      if (Pr === 0.5) variavelPadronizadaPorNivelSignificancia = 0
                      else {
                        Y = Math.sqrt(Math.log(1.0 / Math.pow(Pr, 2)))
                        Real1 = PN[5]
                        Real2 = QN[5]
                        for (let i = 4; i >= 1; i--) {
                          Real1 = Real1 * Y + PN[i]
                          Real2 = Real2 * Y + QN[i]
                        }
                        variavelPadronizadaPorNivelSignificancia = Y + Real1 / Real2
                      }
                    }
                    let dividendo = Math.pow(variavelPadronizadaPorNivelSignificancia, 2) * distribuicao * (100.0 - distribuicao) // Significância da amostra calculada
                    let divisor = (populacao - 1.0) * (Math.pow(margemErro * 100, 2)) + dividendo // Erro da amostra calculado
                    let tamanhoAmostraMinimo = divisor > 0.0 ? Math.ceil(populacao * dividendo / divisor) : 0 // Caso o divisor seja zero, retorna 0, do contrário executa a divisão e aplique a população arredondando para cima
                    //
                    if (totalRegistradoSubFormsParticipante < tamanhoAmostraMinimo) { // Se a qtde de registros de participantes não alcançou a qtde mínima para amostra
                      let vm = this
                      this.$dialog.confirm('<b>' + participantesProjeto + '</b> foram previstos na contratação deste projeto<br/><br/>' +
                        '<b>' + tamanhoAmostraMinimo + '</b> participantes é o mínimo esperado para esta avaliação<br/><br/>' +
                        '<b>' + totalRegistradoSubFormsParticipante + '</b> participantes foram registrados nesta avaliação, até agora<br/><br/>' +
                        'Deseja concluir mesmo assim e enviar este formulário para a Fundação BB?', {html: true, animation: 'fade', customClass: 'avisoConfirmacao'})
                        .then(function (dialog) {
                          vm.salvarPreenchimento(true) // Salva e de lá conclui a etapa atual movendo-se para a próxima etapa
                        }).catch(function () {
                          vm.loading.tela = false
                        })
                    }
                  } else {
                    this.salvarPreenchimento(true)
                  }
                } else {
                  this.salvarPreenchimento(true)
                }
              } else {
                this.salvarPreenchimento(true)
              }
              //
            } else {
              let elementoErro = this.$refs[_.join(_.split(_.get(_.head(this.errors.items), 'field'), '-', 2), '-')] // Separa o id e pega só as duas primeiras partes (elemento e numero), junta de novo na string, daí procura o $ref correspondente
              elementoErro = _.isArray(elementoErro) ? elementoErro[0] : elementoErro // OU ASSIM  ... TESTAR  "elementoErro[0] || elementoErro"
              elementoErro.scrollIntoView() // Rola a tela para o primeiro erro da lista
            }
          })
        } else {
          let elementoErro = this.$refs[_.join(_.split(_.get(_.head(this.errors.items), 'field'), '-', 2), '-')] // Separa o id e pega só as duas primeiras partes (elemento e numero), junta de novo na string, daí procura o $ref correspondente
          elementoErro = _.isArray(elementoErro) ? elementoErro[0] : elementoErro
          elementoErro.scrollIntoView() // Rola a tela para o primeiro erro da lista
        }
      },
      salvarPreenchimento (concluirEtapa) {
        this.loading.tela = concluirEtapa
        this.salvaFormulario.statusSalvamento = 'PROCESSANDO'
        axiosLaravel.post('formulario/id/' + this.$route.params.id + '/' + (this.ehAcessoExterno ? 'salva' : 'salvar') + '/', {'id': this.formularioPreenchimento.id, 'formulario': this.formularioPreenchimento.formulario, 'link_acesso': this.$route.params.id}).then((response) => {
          if (_.has(response.data, 'codigo') && response.data.codigo === 'OK') {
            // Notificação de salvamento (ou criação)
            if (this.ehSubFormulario) {
              let idOuChaveAcesso = (this.formularioPreenchimento['link_acesso']).length > 15 ? this.formularioPreenchimento['link_acesso'] : this.formularioPreenchimento.id
              this.notificacaoDeFormPreenchimento('sub', idOuChaveAcesso, {acao: 'SUB_FORMULARIO_SALVANDO', valor: this.formularioPreenchimento['id_elemento']})
            } else {
              this.notificacaoDeFormPreenchimento('preenchido', this.formularioPreenchimento.id, {acao: 'FORMULARIO_SALVANDO', valor: null})
            }
            //
            this.salvaFormulario.statusSalvamento = 'FEITO'
            setTimeout(() => {
              this.salvaFormulario.statusSalvamento = 'AGUARDANDO'
              this.salvaFormulario.salvamentoAutomaticoAtivo = true // Depois de salvo manualmente a primeira vez ele já ativa para as demais focarem automaticas
              this.salvaFormulario.contador++
            }, 2000)
            this.formularioPreenchimentoTemp = _.cloneDeep(this.formularioPreenchimento) // Copia o que foi salvo para um temp que servirá de comparação para o salvamento automático
            if (concluirEtapa) {
              if (!this.ehSubFormulario) {
                this.concluir()
              }
              if (this.formularioCadastrado.opcoes.concluir.acao === 'SAIR_FORMULARIO') {
                if (_.includes(['ANALISE'], this.ultimaTarefa.nome)) {
                  this.$router.push({name: 'validacao-solicitacoes-lista', params: {fase: 'AVALIACOES'}})
                } else {
                  this.$router.replace('/#/inicial')
                }
              } else if (this.formularioCadastrado.opcoes.concluir.acao === 'ABRIR_URL') {
                window.open(this.formularioCadastrado.opcoes.concluir.parametro, '_blank')
              } else if (this.formularioCadastrado.opcoes.concluir.acao === 'ABRIR_FORMULARIO') {
                window.open(location.protocol + '//' + location.host + '/' + (this.ehAcessoExterno ? 'form' : 'formulario') + '/' + this.formularioCadastrado.opcoes.concluir.parametro, '_self')
              }
            }
          } else {
            this.aviso(response.data)
            this.salvaFormulario.statusSalvamento = 'AGUARDANDO'
          }
          this.loading.tela = false
        })
          .catch((error) => {
            this.$root.trataErro(error)
            this.loading.tela = false
            this.salvaFormulario.statusSalvamento = 'AGUARDANDO'
            this.salvaFormulario.statusSalvamento = 'ERRO'
          })
      },
      concluir () {
        this.loading.tela = true
        // Se é o fluxo 'PREENCHIMENTO_FORMULARIO' então só tem solicitação, então a próxima tarefa é sempre a conclusão. Nos demias deve mandar para Análise
        let proximaEtapa = this.processo.nome === 'PREENCHIMENTO_FORMULARIO' ? 'CONCLUSAO' : _.isNull(this.aprovacao.resultadoAprovacao) ? 'ANALISE' : this.aprovacao.resultadoAprovacao
        if (proximaEtapa !== this.ultimaTarefa.nome) {
          let observacao = this.aprovacao.observacao
          axiosLaravel.post('formulario/id/' + this.formularioPreenchimento.id + '/' + (this.ehAcessoExterno ? 'conclui' : 'concluir') + '/', {'id': this.formularioPreenchimento.id, 'formulario': this.formularioPreenchimento.formulario, 'proximaEtapa': proximaEtapa, 'observacao': observacao}).then((response) => {
            this.aviso(response.data)
            if (_.has(response.data, 'codigo') && response.data.codigo === 'OK') {
              if (this.formularioCadastrado.opcoes.concluir.acao === 'SAIR_FORMULARIO') {
                if (this.ehAcessoExterno) this.$router.replace('/#/inicial') // Serve para evitar que o usuário externo facilmente retorne para um formulário concluído (botão de voltar do navegador)
                else this.$router.push('/#/inicial')
              }
            }
            this.loading.tela = false
          })
            .catch((error) => {
              this.$root.trataErro(error)
              this.loading.tela = false
              this.salvaFormulario.statusSalvamento = 'ERRO'
            })
        } else {
          this.$snotify.error('Erro. A próxima etapa é a mesma que a tarefa atual')
        }
      },
      aviso (retorno) {
        if (_.has(retorno, 'codigo')) {
          let mensagens = (_.has(retorno, 'mensagem') && !_.isNull(retorno.mensagem) && !_.isEmpty(retorno.mensagem)) ? (typeof retorno.mensagem === string ? [retorno.mensagem] : retorno.mensagem) : ['Erro de processamento. Não sei o que houve']
          mensagens.forEach((msg) => {
            if (retorno.codigo === 'ERRO') {
              this.$snotify.error(msg)
            } else if (_.includes(['OK', 'AVISO'], retorno.codigo)) {
              this.$snotify.success(msg, {timeout: 3000})
            }
          })
        }
      },
      gerarNovoFormularioPreenchimento () {
        this.loading.tela = true
        axiosLaravel.get('formulario/novo/' + this.$route.params.id).then((response) => {
          if (_.has(response.data, 'codigo') && response.data.codigo === 'OK') {
            let formulariosJaAcessadosLocalmente = JSON.parse(window.localStorage.getItem('formularios-sgp'))
            formulariosJaAcessadosLocalmente.push({cadastro: this.$route.params.id, preenchido: response.data.retorno, situacao: 'iniciado', data: new Date()})
            // Grva no localstorage e redirecionar para o novo form (link acesso form preenchimento)
            window.localStorage.setItem('formularios-sgp', JSON.stringify(formulariosJaAcessadosLocalmente))
            window.open(location.protocol + '//' + location.host + '/' + (this.ehAcessoExterno ? 'form' : 'formulario') + '/' + response.data.retorno, '_self')
          }
        })
          .catch((error) => {
            this.$root.trataErro(error)
            this.loading.tela = false
            this.salvaFormulario.statusSalvamento = 'ERRO'
          })
      },
      imprimirRelatorio () {
        window.print()
      },
      valorArrayElemento (idx, elemento, valor = null) {
        if (!_.isNull(valor)) {
          _.set(this.formularioPreenchimento.formulario[idx], ['valor', elemento], valor === '' ? null : valor)
          this.executarRegras()
          this.$forceUpdate()
        }
        return _.isNull(this.formularioPreenchimento.formulario[idx].valor) ? -1 : this.formularioPreenchimento.formulario[idx].valor[elemento]
      },
      valorPrimitivoElemento (idx, valor = null) {
        if (!_.isNull(valor)) {
          _.set(this.formularioPreenchimento.formulario[idx], ['valor'], valor)
          this.$forceUpdate()
          this.executarRegras()
        }
        return this.formularioPreenchimento.formulario[idx].valor
      },
      validacaoElementoChave (idx) {
        let elemento = _.isNumber(idx) ? this.formularioPreenchimento.formulario[idx] : _.find(this.formularioPreenchimento.formulario, ['id', idx])
        if (!_.isNull(this.formularioCadastrado.opcoes.elemento_chave) && this.formularioCadastrado.opcoes.elemento_chave === elemento.id) {
          this.loading.duplicidade = elemento.id
          this.errors.removeById(elemento.id) // Elimina o erro específoco (por Id) do campo caso já tenha sido adicionado abaixo
          axiosLaravel.post('formulario/validacao/duplicidade/valor/', {'link_acesso': this.formularioPreenchimento.link_acesso, 'elemento': elemento.id, 'valor': elemento.valor}).then((response) => {
            if (_.has(response.data, 'codigo') && response.data.codigo === 'ERRO') {
              this.errors.add({field: elemento.id, rule: 'duplicidade', msg: 'Este campo não aceita repetição e o valor \'' + elemento.valor + '\' já foi informado', id: elemento.id})
            }
            this.aviso(response.data)
            this.loading.duplicidade = null
          })
            .catch((error) => {
              this.loading.duplicidade = null
              this.$root.trataErro(error)
            })
        }
      },
      assinaCanais () {
        if (!this.ehAcessoExterno) { // Ainda não há canal (rota) sem autenticação, então quando é externo não se assina nem notifica canal
          // Notificações do canal do formulário de CADASTRO que é o modelo/base para este em preenchimento
          let canalFormCadastro = 'formulario.cadastro.' + this.formularioCadastrado.id
          window.Echo.channel(canalFormCadastro)
            .listen('FormularioEvents', (notificacao) => {
              if (notificacao.mensagem.acao === 'SITUACAO_FORMULARIO_CADASTRO_ALTERADA' && notificacao.mensagem.valor === 'Inativo') {
                // Se a situação do form de cadastro foi alterada e passou para Inativo, então deve:
                this.salvarPreenchimento(false) // Salvar
                this.$snotify.error('Este formulário foi inativado!') // Avisar
                this.$router.replace('/#/inicial') // Sair
              }
            })
          //
          // Notificações do canal do formulário que esta sendo PREENCHIDO
          let idOuChaveAcesso = this.ehSubFormulario && (this.formularioPreenchimento['link_acesso']).length > 15 ? this.formularioPreenchimento['link_acesso'] : this.formularioPreenchimento.id
          let canalFormPreenchimento = 'formulario.' + (this.ehSubFormulario ? 'sub' : 'preenchido') + '.' + idOuChaveAcesso
          window.Echo.channel(canalFormPreenchimento)
            .listen('FormularioEvents', (notificacao) => {
              if (_.includes(['SUB_FORMULARIO_EXCLUIDO', 'FORMULARIO_EXCLUIDO', 'FORMULARIO_CANCELADO'], notificacao.mensagem.acao) && idOuChaveAcesso === notificacao.id) {
                this.$snotify.error('O preenchimento desse formulário foi excluído/cancelado!') // Avisar
                this.$router.replace('/#/inicial') // Sair
              }
            })
        }
      },
      notificacaoDeFormPreenchimento (canal, id, mensagem) {
        if (!this.ehAcessoExterno) { // Ainda não há canal (rota) sem autenticação, então quando é externo não se assina nem notifica canal
          axiosLaravel.post('formulario/mensageria', {canal: canal, id: id, mensagem: mensagem}).then((response) => {
            if (_.has(response.data, 'codigo') && response.data.codigo === 'OK') {
              console.log('Mensagem enviada')
            } else {
              console.log('Erro de mensageria')
              this.$snotify.error(response.data.mensagem)
            }
          })
            .catch((error) => {
              this.$snotify.clear()
              this.$root.trataErro(error)
            })
        }
      },
      executarRegras () {
        let formulario = _.cloneDeep(this.formularioBackup)
        //
        this.formularioPreenchimento.formulario.forEach(elemento => {
          if (_.has(elemento.configuracao, 'regras')) {
            elemento.configuracao.regras.forEach(regra => {
              if (
                (regra.condicao === 'ENTRE' && _.toNumber(elemento.valor) >= _.toNumber(regra.valor) && _.toNumber(elemento.valor) <= _.toNumber(regra.valor2) && !_.isNull(elemento.valor)) ||
                (regra.condicao === 'MENOR' && _.toNumber(elemento.valor) < _.toNumber(regra.valor) && _.toNumber(elemento.valor) > -1 && !_.isNull(elemento.valor)) ||
                (regra.condicao === 'MENOR_IGUAL' && _.toNumber(elemento.valor) <= _.toNumber(regra.valor) && _.toNumber(elemento.valor) > -1 && !_.isNull(elemento.valor)) ||
                (regra.condicao === 'MAIOR' && _.toNumber(elemento.valor) > _.toNumber(regra.valor) && !_.isNull(elemento.valor)) ||
                (regra.condicao === 'MAIOR_IGUAL' && _.toNumber(elemento.valor) >= _.toNumber(regra.valor) && !_.isNull(elemento.valor)) ||

                (regra.condicao === 'NAO_CONTEM' && !_.includes(('' + elemento.valor), _.toLower(regra.valor))) ||
                (regra.condicao === 'CONTEM' && _.includes(('' + elemento.valor), _.toLower(regra.valor))) ||
                (regra.condicao === 'NAO_VAZIO' && !_.isEmpty('' + elemento.valor)) ||
                (regra.condicao === 'VAZIO' && _.isEmpty('' + elemento.valor)) ||
                (regra.condicao === 'IGUAL' && _.toLower('' + elemento.valor) === _.toLower('' + regra.valor)) ||
                (regra.condicao === 'DIFERENTE' && _.toLower('' + elemento.valor) !== _.toLower('' + regra.valor)) ||

                (regra.condicao === 'ITEM_SELECIONADO' && (
                  (!_.has(regra, 'valor2') && ((_.isArray(elemento.valor) && _.includes(elemento.valor, regra.valor)) || regra.valor === elemento.valor)) || // Há seleções que podem retonar array (select multiple) daí usar o includes, do contrário fazer comparação simples
                  (_.has(regra, 'valor2') && !_.isNull(elemento.valor) && elemento.valor[regra.valor2] === regra.valor))) // Quando há um segundo valor de lista, como em Likert (linha e coluna)
              ) {
                regra.id.forEach(itemOndeAplicarRegra => {
                  _.set(_.find(formulario, ['id', itemOndeAplicarRegra.id]), ['mostrar'], regra.acao === 'MOSTRAR') // Mostra/Oculta o item indicado na regra
                  if (itemOndeAplicarRegra.elemento === 'SECAO') { // Se o item onde será aplicada a regra, for um elemento tipo seção
                    let idx = _.findIndex(this.formularioPreenchimento.formulario, ['id', itemOndeAplicarRegra.id]) // Pegar a posição desta seção na lista de elementos
                    for (let i = idx + 1; i < this.formularioPreenchimento.formulario.length; i++) {
                      // Mostrar/Ocultar para cada elemento dentro da seção até a próxima seção ou até o final da lista de elementos do formulário
                      if (this.formularioPreenchimento.formulario[i].elemento === 'SECAO') break
                      _.set(formulario, [i, 'mostrar'], regra.acao === 'MOSTRAR')
                    }
                  }
                })
              }
            })
          }
        })
        //
        let totalElementos = 0
        let totalElementosNaoPreenchidos = 0
        this.formularioPreenchimento.formulario.forEach(elemento => {
          elemento.mostrar = _.get(_.find(formulario, ['id', elemento.id]), 'mostrar')
          if (!elemento.mostrar) { // Se o elemento estiver oculto então seu valor é null
            elemento.valor = null
          }
          // Conta considerando todos os elementos (exceto de Layout), os que são visíveis e obrigatorios
          if (elemento['grupo'] !== 'LAYOUT' && _.has(elemento, 'mostrar') && elemento.mostrar && elemento.obrigatorio) {
            totalElementos += 1
            totalElementosNaoPreenchidos += (_.isNull(elemento.valor) || elemento.valor === [] || elemento.valor === '') ? 1 : 0
          }
        })
        // Calculando o percentual preenchido do formulário
        let percentualPreenchimento = totalElementos === 0 ? 0 : Math.ceil(((totalElementos - totalElementosNaoPreenchidos) / totalElementos) * 100)
        percentualPreenchimento = percentualPreenchimento < 0 ? 0 : (percentualPreenchimento > 100 ? 100 : percentualPreenchimento)
        this.notificacaoDeFormPreenchimento((this.ehSubFormulario ? 'sub' : 'preenchido'), this.formularioPreenchimento.id, {acao: 'PERCENTUAL_PREENCHIDO', valor: this.formularioPreenchimento['id_elemento'], percentagem: percentualPreenchimento + '%'})
        this.$forceUpdate()
      },
      validaCpfCnpj (idx) {
        let controle = this.formularioPreenchimento.formulario[idx]
        this.errors.removeById(controle.id) // Limpa erros no bag para o controle
        // Valida se setrata de CPF ou CNPJ inválidos e adiciona erro no bag com rule e msg próprias
        if ((controle.configuracao.formato === 'CPF' && !cpf.isValid(controle.valor)) || (controle.configuracao.formato === 'CNPJ' && !cnpj.isValid(controle.valor))) {
          this.errors.add({field: controle.id, rule: _.lowerCase(controle.configuracao.formato) + '_digito', msg: 'Dígito verificador do ' + controle.configuracao.formato + ' inválido'})
        }
      },
      abreFormulario (chave) {
        window.open(location.protocol + '//' + location.host + '/' + (this.ehAcessoExterno ? 'form' : 'formulario') + '/' + chave, '_blank')
      },
      excluirItemSubFormulario (idx, chaveSubForm, chave) {
        // TODO ver o loading usado no b-table
        axiosLaravel.post('formulario/id/' + this.formularioPreenchimento.id + '/excluir/', {'chave': chave}).then((response) => {
          if (_.has(response.data, 'codigo') && response.data.codigo === 'OK') {
            this.notificacaoDeFormPreenchimento('sub', this.formularioPreenchimento.id, {acao: 'SUB_FORMULARIO_EXCLUIDO', valor: this.formularioPreenchimento['id_elemento']})
            let registroExcluido = _.find(this.formularioPreenchimento[idx].valor, function (item) {
              return item.excluir === idRegistro || item.editar === idRegistro || item.visualizar === idRegistro
            })
            if (!this.ehAcessoExterno) { // Ainda não há canal (rota) sem autenticação, então quando é externo não precisa deixar o canal que não foi assinado
              Echo.leave('formulario.sub.' + registroExcluido.id)
            }
            this.carregaDadosSubForm(idx, chaveSubForm)
          } else {
            this.aviso(response.data)
          }
        })
          .catch((error) => {
            this.$root.trataErro(error)
          })
      },
      filtroPorItem (row, filter) {
        let encontrado = 0
        if (filter !== 'retornar_todos_registros') { // Se receber a string para filtrar tudo, então retorna o filtro como '' e não acrescenta a pesquisa por termo
          row = _.join(_.values(_.omit(row, ['idSubFormulario', 'idElemento', 'editar', 'excluir', 'visualizar'])), '|') // Pegando somente os valores de campos (sem propriedades adicionadas) e 'stringificando' o array
          let termos = _.split(_.toLower(filter), ' ')
          termos.forEach((termo) => {
            encontrado += (_.toLower(row).indexOf(termo) !== -1) ? 1 : 0
          })
        }
        return encontrado > 0
      },
      onFiltered (filteredItems) {
        if (filteredItems.length > 0) {
          let conteudo = _.find(this.formularioPreenchimento.formulario, ['id', filteredItems[0].idElemento])['configuracao']['conteudo']
          conteudo.totalRows = filteredItems.length
          conteudo.currentPage = 1
        }
      },
      exportarExcel () {
        this.loading.tela = true
        axiosLaravel.post('formulario/completo/', {'lista': [this.formularioPreenchimento['fk_processo']]}).then((response) => {
          if (_.has(response.data, 'codigo') && response.data.codigo === 'OK') {
            let planilhaPrincipal = []
            response.data.retorno.listaFormulariosPrincipais.forEach((form) => {
              let formularioTemp = {}
              _.set(formularioTemp, 'ID Processo', form['fk_processo'])
              //
              form.formulario.forEach((controle) => {
                if (_.includes(['CONTROLE', 'PERSONALIZADO'], controle.grupo)) {
                  if (!_.isNull(controle.valor)) {
                    if (controle.elemento === 'UF_MUNICIPIO' && _.has(controle.valor, 'nomcid') && _.has(controle.valor, 'sigufs')) {
                      controle.valor = controle.valor.nomcid + ' (' + controle.valor.sigufs + ')'
                    } else if (controle.elemento === 'DATA') {
                      controle.valor = moment(controle.valor).add(1, 'day').format('DD/MM/YYYY')
                    } else if (controle.elemento === 'PERIODO' && _.has(controle.valor, 'inicio') && _.has(controle.valor, 'termino')) {
                      controle.valor = moment(controle.valor.inicio).format('DD/MM/YYYY') + ' - ' + moment(controle.valor.termino).format('DD/MM/YYYY')
                    } else if (controle.elemento === 'LIKERT' && _.values(controle.valor).length > 0) {
                      // O likert já é uma matriz de perguntas e respostas, então aqui já é convertido cada par pergunta x resposta em colunas e linhas para o Excel
                      _.forEach(controle.valor, function (resposta, pergunta) {
                        _.set(formularioTemp, [('' + pergunta).replace(/(<([^>]+)>)/ig, '')], resposta)
                      })
                    } else if (controle.elemento === 'SELECAO_MULTIPLA') {
                      // 65587 - Correção na exportação de excel para componentes de múltipla escolha
                      controle.valor = _.toString(controle.valor)
                    }
                  }
                  if (controle.elemento !== 'LIKERT') { // O Likert já adicionaou as colunas necessárias para cada pergunta dele, acima e não precisa fazer aqui de novo
                    _.set(formularioTemp, [('' + controle.titulo).replace(/(<([^>]+)>)/ig, '')], controle.valor)
                  }
                }
              })
              planilhaPrincipal.push(formularioTemp)
            })
            let principal = XLSX.utils.json_to_sheet(planilhaPrincipal)
            //
            let wb = XLSX.utils.book_new() // Cria a pasta de trabalho (conjunto de planilhas) no Excel
            XLSX.utils.book_append_sheet(wb, principal, 'Formulario Principal') // A primeira planilha será a que contém os dados do formulário
            //
            response.data.retorno.subformularios.forEach((subForm) => {
              // Adiciona as planilhas a pasta de trabalho
              let planilhaSubForm = XLSX.utils.json_to_sheet(subForm.preenchido) // Coverte o json para planilha
              let tituloPlanilhaSubForm = subForm.titulo.substring(0, 30) // Corta o titulo por limitação do Excel
              tituloPlanilhaSubForm = _.isNull(tituloPlanilhaSubForm) ? tituloPlanilhaSubForm : ('' + tituloPlanilhaSubForm).replace(/(<([^>]+)>)/ig, '') // Titulo não pode ter tag html que impede a conversão para Excel
              XLSX.utils.book_append_sheet(wb, planilhaSubForm, tituloPlanilhaSubForm) // Adiciona esta planilha de subformulario a pasta de trabalho (arquivo) Excel
            })
            //
            // Gerando dados para registro de download (extração de informação do SGP)
            let dados = [
              {'Registro': 'ID do formulário', 'Informação': response.data.retorno.listaFormulariosPrincipais[0]['fk_formulario']},
              {'Registro': 'Quem gerou a planilha', 'Informação': this.usuarioLogado.userName},
              {'Registro': 'Quando foi gerada', 'Informação': (Date(Date.now())).toString()},
              {'Registro': 'Autenticação', 'Informação': response.data.retorno.autenticacao}
            ]
            let extracao = XLSX.utils.json_to_sheet(dados)
            XLSX.utils.book_append_sheet(wb, extracao, 'Extração') // Esta planilha conterá os dados de quem e quando foi feita a extração destas informações do SGP para Excel
            //
            XLSX.writeFile(wb, 'Formulario_processo_id_' + this.formularioPreenchimento.fk_processo + '.xlsx') // Cria o arquivo com a pasta de trabalho do Excel e faz download
          } else {
            this.$snotify.error(response.data.mensagem)
          }
          this.loading.tela = false
        })
          .catch((error) => {
            this.$snotify.clear()
            this.$root.trataErro(error)
            this.loading.tela = false
          })
      },
      copiaUrlSubFormulario (controle) {
        let linkCompleto = location.protocol + '//' + location.host + '/form/' + controle.configuracao.padrao[0]
        navigator.clipboard.writeText(linkCompleto)
          .then(() => {
            _.set(controle.configuracao, 'link_copia', {classe: 'label label-success', msg: 'Copiado!'})
            this.$forceUpdate()
            setTimeout(() => { _.unset(controle.configuracao, 'link_copia'); this.$forceUpdate() }, 2000)
          })
          .catch(err => {
            _.set(controle.configuracao, 'link_copia', {classe: 'label label-danger', msg: 'Erro: ' + err})
            this.$forceUpdate()
          })
      }
    }
  }
</script>

<style scoped>
  #corpo_formulario li.list-group-item:hover, #edicao_formulario .box-body.elemento:hover {
    cursor: default;
    background: #fffced;
  }

  #corpo_formulario input[type="number"] {
    width: 100px;
  }

  #corpo_formulario .list-group {
    border: 1px dotted steelblue;
    border-radius: 4px;
    min-height: 40px;
  }
  #corpo_formulario .elemento {
    display: flex;
    flex-direction: column;
  }
  #corpo_formulario .elemento_controle {
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    justify-content: center;
    align-items: center;
    margin-bottom: 10px;
  }
  #corpo_formulario .elemento_botao {
    flex-grow: 0;
    flex-shrink: 0;
  }
  #corpo_formulario .elemento_corpo {
    flex-grow: 1;
    flex-shrink: 1;
  }
  #corpo_formulario .elemento_propriedades {
    background: whitesmoke;
  }

  #corpo_formulario .elemento_classificacao:hover {
    cursor: pointer;
    color: var(--cor-destaque);
  }
  #corpo_formulario .classificacao_numeral {
    width: 1em;
  }
  #corpo_formulario .classificacao_numeral span {
    font-size: .6em;
    font-family: monospace;
    font-weight: bold;
  }

  #corpo_formulario .elemento_NPS_escala {
    table-layout: fixed;
    width: 100%;
    border-collapse: collapse;
  }
  #corpo_formulario .elemento_NPS_escala td:hover {
    background: var(--cor-destaque);
    cursor: pointer;
  }
  #corpo_formulario .elemento_NPS_escala_inativo {
    table-layout: fixed;
    width: 100%;
    border-collapse: collapse;
    background: var(--cor-fraca);
    cursor: default;
  }
  #corpo_formulario .elemento_NPS_limites {
    table-layout: fixed;
    width: 100%;
    border-collapse: collapse;
    font-style: italic;
  }
  #corpo_formulario .elemento_likert_matrix {
    table-layout: fixed;
    width: 100%;
    border-collapse: collapse;
  }
  #corpo_formulario .elemento_likert_cabecalho_coluna {
    text-align: center;
  }
  #corpo_formulario .elemento_likert_pergunta {
    font-weight: normal;
    padding: 10px 0px;
    border-bottom: 1px solid var(--cor-fraca);
  }
  #corpo_formulario .elemento_likert_opcoes {
    text-align: center;
    border-bottom: 1px solid var(--cor-fraca);
  }
  #corpo_formulario .elemento_likert_opcoes i:hover {
    cursor: pointer;
    color: var(--cor-destaque);
  }
  #corpo_formulario .elemento_classificacao {
    margin-right: 5px;
  }

  #corpo_formulario .secao_padrao {
    font-size: 16px;
    padding: 10px 0px;
    background: silver;
  }
  #corpo_formulario .secao_simples {
    font-size: 16px;
    padding: 10px 0px;
    border-top: 2px solid silver;
  }
  #corpo_formulario .secao_oculto {
    font-size: 0px;
    padding: 10px 0px;
    border-bottom: 2px solid silver;
  }

  .secaoRetratil {
    cursor: pointer;
  }

  #corpo_formulario .required-field label.control-label:after {
    /* formatação padrão de obrigatoriedade duplicado aqui porque forms externos não tem skin-fbb */
    font-weight: bold;
    color: #e32;
    content: ' *';
    display: inline;
  }

  /********************************************************************************************************************************************/

  @media print {

    * {
      font-size: 14px !important;
    }

    .control-label {
      text-transform: none;
    }

    div.nao_imprimir {
      display: none !important;
    }
    table.nao_imprimir {
      visibility: collapse !important;
    }

    div.imprimir {
      display: block !important;
    }
    table.imprimir {
      visibility: visible !important;
    }

    button {
      display: none !important;
    }

    input {
      border: 0px;
      border-bottom: 1px solid gray;
      padding-left: 20px;
    }
    select {
      border: 0;
      padding-left: 20px;
    }

    @page {
      /*size: landscape;*/
      margin-left: 0px !important;
    }

    @page paisagem {
      /*size: landscape;*/
    }

    body, .col-md-12, .box-body {
      padding: 0px !important;
      background: white !important;
    }

    .content-wrapper, .box.box-primary {
      border: 0 !important;
    }
    .content {
      margin: 0px !important;
    }

    #Header, #Footer { display: none !important; }

    .sidebar-mini.sidebar-collapse .content-wrapper, .sidebar-mini.sidebar-collapse .right-side, .sidebar-mini.sidebar-collapse .main-footer {
      margin-left: 0px !important;
    }

    #app .content-wrapper * {
      background: white !important;
    }

  }
</style>

<style>
  #corpo_formulario .tituloControle span > p:last-child {
    /* "Elimina" a linha adicional que o Quill Editor sempre adiciona */
    display: inline;
  }
  #corpo_formulario .tituloControle span > p:last-child br {
    /* "Elimina" a quebra de linha que o Quill Editor adiciona quando se acrescenta video no final do texto */
    display: none;
  }
</style>
