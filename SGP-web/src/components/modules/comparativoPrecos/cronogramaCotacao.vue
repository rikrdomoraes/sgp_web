<template>
  <div class="box-body cronogramaff" ref="cotacaoContainer">
    <div class="row">
      <div class="col-md-12">
        <button
          v-confirm="{ok: retorno => deleteTodos('ok'), cancel: doNothing, message: 'Deseja <b>APAGAR</b> todos os itens ?'}"
          type="button" class="btn btn-primary btn-sm btn-flat"> <i class="fa fa-eraser"  aria-hidden="true"></i> &nbsp; Apagar todos os itens do cronograma
        </button>
        <br>
        <br>
        <div class="row-flex centered-start legenda-container">
          <div class="row-flex all-centered gap-5">
            <div class="validado-legenda legenda-box"></div>
            <div title="CV menor de 25%">
              Validação Automática
            </div>
          </div>

          <div class="row-flex all-centered gap-5">
            <div class="validado legenda-box"></div>
            <div title="Cadastrado no Busca Preços mas com CV maior que 25% ou Remoção Manual de Itens">
              Automático com validação manual
            </div>
          </div>

          <div class="row-flex all-centered gap-5">
            <div class="validado-manual legenda-box"></div>
            <div>
              Manual Validado
            </div>
          </div>

          <div class="row-flex all-centered gap-5">
            <div class="legado-legenda legenda-box"></div>
            <div>
              Cotação Manual Antiga
            </div>
          </div>

          <div class="row-flex all-centered gap-5">
            <div class="pendente-validacao-legenda legenda-box"></div>
            <div title="CV acima de 25% / Cotação Manual / Remoções manuais">
              Pendente de validação
            </div>
          </div>
        </div>
        <table class="table table-condensed">
          <thead>
          <tr class="cabecalho">
            <th class="centralizado">Tipo Cotação</th>
            <th colspan="2">Atividade / Itens do Cronograma</th>
            <!--<th v-if="proposta.ds_fase !== 'ANALISE' && proposta.ds_fase !== 'PENDENTE_EM_ANALISE'" colspan="2" class="">Atividade / Recursos (itens do cronograma)</th>-->
            <!--<th v-if="proposta.ds_fase === 'ANALISE' || proposta.ds_fase === 'PENDENTE_EM_ANALISE'" colspan="2" class="">Atividade / Recursos (itens do cronograma)</th>-->
            <th colspan="2" class="centralizado">Período<br/>Início / Fim</th>
            <th class="centralizado">Qtde</th>
            <th class="centralizado">Valor Unitário</th>
            <th class="centralizado">Valor Total</th>
            <th>&nbsp;</th>
          </tr>
          </thead>
          <tbody>

          <!--Tabela item-->
              <template v-for="(atividade, atividadeIndex) in propsAtividades" >
                <tr class="atividade">
                  <td class="centralizado borda">
                    Tipo Cotação
                  </td>
                  <td :colspan="proposta.ds_fase === 'ANALISE' ? 2 : 2" class="esquerda borda nome_atividade">{{atividade.ds_nome}}</td>
                  <td class="centralizado borda">{{atividade.nr_periodo_inicial}}</td>
                  <td class="centralizado borda">{{atividade.nr_periodo_final}}</td>
                  <td colspan="3" class="direita borda">{{somaTotal(atividade.itens_orcamentos) | real}}</td>
                  <td class="centralizado borda">
                    <button :disable="bloqueiaBotoes" v-if="!editando && !adicionando"
                            @click="addItem(atividade, atividadeIndex)"
                            type="button"
                            class="btn btn-primary btn-sm btn-flat"
                            id="financial-physical-activity-0f">
                      <i class="fa fa-plus-circle"  aria-hidden="true"></i> Adicionar
                    </button>
                  </td>
                </tr>
                <tr v-for="(item, itemIndex) in atividade.itens_orcamentos"  prefix="activityItem" suffix="item.id" row="item" class="" style="">
                  <template v-if="!item.editando">
                    <td :class="verificaValidacao(item)" class="centralizado borda w5">
                      <div v-if="item.itemCotacao && item.itemCotacao[0] !== undefined" class="cotacao-tipo">
                        <div v-if="item.itemCotacao[0].length > 0">
                          <i class="fa fa-plus-circle"></i> Cotação Automática
                        </div>
                        <div v-if="item.itemCotacaoManual[0].length > 0">
                          <i class="fa fa-cubes"></i> Cotação Manual
                        </div>
                      </div>
                      <div v-else class="cotacao-tipo">
                        <i class="fa fa-recycle"></i> Cotação Manual Antiga
                      </div>
                    </td>
                    <td class="centralizado borda w10" :class="verificaValidacao(item)">
                      <span v-if="('' + item.origem) === '1'">Fundação</span>
                      <span v-else-if="('' + item.origem) === '2'">Contrapartida</span>
                      <span v-else-if="('' + item.origem) === '5'">Parceiro Estratégico</span>
                      <span v-if="('' + item.adiantavel) === '1'" ><br/><b><i>Adiantável</i></b></span>
                    </td>

                    <td class="borda" :class="verificaValidacao(item)">
                      <div class="item">
                        <div :class="(propostaDentroFbb && item.conta_financeira ? 'w50' : 'w100') + ' item_despesa esquerda'">({{_.upperFirst(_.lowerCase(item.item.ds_type))}})  {{item.item.ds_code + ' / ' + item.item.ds_description}}</div>
                        <div v-if="propostaDentroFbb && item.conta_financeira" class="direita">{{item.conta_financeira.numero_conta}} / {{item.conta_financeira.descricao}}</div>
                        <div class="observacao esquerda">{{item.observacao}}</div>
                      </div>
                    </td>

                    <td class="centralizado borda w5" :class="verificaValidacao(item)">{{item.periodo_inicial}}</td>
                    <td class="centralizado borda w5" :class="verificaValidacao(item)">{{item.periodo_final}}</td>
                    <td class="centralizado borda w5" :class="verificaValidacao(item)" :title="'<h5>' + (!_.has(item, 'unidade_medida') || _.isNull(item.unidade_medida) ? 'Sem unid. de medida' : (item.unidade_medida === 'Outros' && _.has(item, 'medida_outros') && !_.isNull(item.medida_outros) ? ('Outros:<br/>' + item.medida_outros) : item.unidade_medida)) + '</h5>'" v-tippy="{inertia:true, arrow:true, animation:'perspective', distance:'1', size:'large', arrow:true}">
                      {{item.quantidade}}
                    </td>
                    <td class="centralizado borda w10" :class="verificaValidacao(item)">{{item.valor_unitario | real}}</td>
                    <td class="centralizado borda w10" :class="verificaValidacao(item)">{{item.quantidade * item.valor_unitario | real}}</td>

                    <td class="row-flex all-centered gap-5 acoes-coluna" :class="verificaValidacao(item)">
                      <div v-if="!editando && !adicionando" class="row-flex all-centered gap-5">
                        <b-button type="button" @click.stop="bloqueiaBotoes ? null : editaItem(atividade, atividadeIndex, item, itemIndex)" class="btn btn-primary btn-sm btn-flat"><i class="fa fa-pencil-square-o" aria-hidden="true"></i> Editar</b-button>
                        <b-button type="button" @click="bloqueiaBotoes" class="btn btn-danger btn-sm btn-flat"
                                  v-confirm="{ok: retorno => deleteItem(atividade, atividadeIndex, item, itemIndex), cancel: doNothing,
                           message: 'Deseja <b>APAGAR</b> o item ' + item.item.ds_code + '-' + item.item.ds_description + ', da atividade ' + atividade.ds_nome + ' ?'}"><i class="fa fa-trash" aria-hidden="true"></i> Excluir</b-button>
                      </div>
                      <div v-if="!editando && !adicionando && item.itemCotacao" class="row-flex all-centered gap-5">
                        <b-button v-if="item.itemCotacaoValidado.validado" type="button" @click.stop="bloqueiaBotoes ? null : abrirCotacaoValidacao(item, true)" class="btn btn-success btn-sm btn-flat"><i class="fa fa-shopping-cart" aria-hidden="true"></i> Abrir Cotação</b-button>
                        <b-button v-if="!item.itemCotacaoValidado.validado && usuarioLogado.userType === 'FUNDACAO'" type="button" @click.stop="bloqueiaBotoes ? null : abrirCotacaoValidacao(item, false)" class="btn btn-warning btn-sm btn-flat"><i class="fa fa-exclamation-triangle" aria-hidden="true"></i> Validar Cotação</b-button>
                        <b-button v-if="!item.itemCotacaoValidado.validado && usuarioLogado.userType === 'ENTIDADE'" type="button" @click.stop="bloqueiaBotoes ? null : abrirCotacaoValidacao(item, true)" class="btn btn-warning btn-sm btn-flat"><i class="fa fa-exclamation-triangle" aria-hidden="true"></i> Abrir Cotação</b-button>
                      </div>
                    </td>
                    <!-- <td class="borda">
                    </td> -->
                  </template>
                  <!--Formulario de validação-->
                  <template>
                    <div class="animated fadeInDownOutUp edicaoItem" v-if="validarCotacao && item.itemCotacao">
                        <cotacaoItens
                          :idProposta="proposta.id"
                          :fk_cotacao="itemForm.fk_cotacao"
                          :cotacaoGravada="itemForm.itemCotacao"  
                          :cotacaoManualGravada="itemForm.itemCotacaoManual" 
                          :editarCotacao="editarCotacao"
                          :validandoCotacao="validarCotacao"
                          :visualizandoCotacao="visualizandoCotacao"
                          :cotacaoValidada="itemForm.itemCotacaoValidado" 
                          :setDescricaoValor="setDescricaoValor" 
                          :toggleCotacao="toggleCotacao"
                          :fecharValidacao="fecharValidacao"
                          :atividadeIndex="atividadeIndex" 
                          :itemIndex="itemIndex"
                          :onAdd="onAdd"
                          :atividade="atividade"
                          :item="itemForm"
                          :gravarValidacaoRow="gravarValidacaoRow"
                          ></cotacaoItens>
                      </div>  
                  </template>
                  <!--Formulario de item-->
                  <template v-if="item.editando">
                    <td colspan="10">

                      <div class="animated fadeInDownOutUp edicaoItem">
                        <cotacaoItens v-if="abrirSistemaCotacao" 
                          :idProposta="proposta.id"
                          :fk_cotacao="itemForm.fk_cotacao"
                          :cotacaoGravada="itemForm.itemCotacao"  
                          :cotacaoManualGravada="itemForm.itemCotacaoManual" 
                          :editarCotacao="editarCotacao" 
                          :cotacaoValidada="itemForm.itemCotacaoValidado" 
                          :setDescricaoValor="setDescricaoValor" 
                          :toggleCotacao="toggleCotacao"
                          :fecharValidacao="fecharValidacao" 
                          :atividadeIndex="atividadeIndex" 
                          :itemIndex="itemIndex"
                          :onAdd="onAdd"
                          :atividade="atividade"
                          :item="item"
                          :gravarValidacaoRow="gravarValidacaoRow"
                          ></cotacaoItens>
                      </div>

                      <div class="animated fadeInDownOutUp edicaoItem"  v-if="!abrirSistemaCotacao && !abrirSistemaCotacaoManual">

                        <div class="form-group row">

                          <div class="required" :class="{ 'has-error' : errors.first('origem')}">
                            <label class="control-label col-md-2">Origem:</label>
                            <div class="col-md-5">
                              <select v-model="itemForm.origem" name="origem" @change="zeraAdiantamento()" aria-label="origem" class="form-control" v-validate="'required'">
                                <option value="1">Fundação</option>
                                <option value="2">Contrapartida</option>
                                <option value="5" v-if="usuarioLogado.userType === 'FUNDACAO'">P.Estratégico</option>
                              </select>
                              <span v-if="errors.first('origem')" class="label label-danger"> {{ errors.first('origem') }}</span>
                            </div>
                          </div>

                          <div class="col-md-1">&nbsp;</div>

                          <div class="required" :class="{ 'has-error' : errors.first('inicio')}">
                            <label class="control-label col-md-1">Início:</label>
                            <div class="col-md-1">
                              <div>
                                <input type="number" v-model="itemForm.periodo_inicial" ref="periodo_inicial" name="inicio" maxlength="2" aria-label="Inicio do período"
                                       class="form-control text-right" :min="atividade.inicio" :max="atividade.termino"
                                       v-validate="'required'" @change="validaPeriodo" />
                              </div>
                              <span v-if="errors.first('inicio')" class="label label-danger"> {{ errors.first('inicio') }}</span>
                            </div>
                          </div>

                          <div class="required" :class="{ 'has-error' : errors.first('fim')}">
                            <label class="control-label col-md-1">Fim:</label>
                            <div class="col-md-1">
                              <div>
                                <input type="number" v-model="itemForm.periodo_final" name="fim" ref="periodo_final" maxlength="2" aria-label="Fim do período"
                                       class="form-control text-right" :min="atividade.inicio" :max="atividade.termino" v-validate="'required'" @change="validaPeriodo">
                              </div>
                              <span v-if="errors.first('fim')" class="label label-danger"> {{ errors.first('fim') }}</span>
                            </div>
                          </div>

                        </div> <!-- Recurso e Periodo de Inicio e Fim do Item -->

                        <div class="form-group row">
                          <!-- Item -->
                          <div class="required" :class="{ 'has-error' : errors.first('item')}">
                            <label class="control-label col-md-2">Item de despesa:</label>
                            <div class="col-md-10">
                              <div approval="finPhySchFormCtrl.approval" state="finPhySchFormCtrl.approvalState">
                                <multiselect
                                  name="item"
                                  :custom-label="itemCodigo"
                                  :searchable="true"
                                  v-model="itemForm.item" :options="items"
                                  :close-on-select='true'
                                  :hide-selected="true"
                                  :preserve-search="false"
                                  placeholder="Escolha um item"
                                  @select="buscaContasFinanceiras($event)"
                                  :disabled="itemForm.origem === null"
                                  label="ds_description" track-by="ds_code"
                                  :preselect-first="false"
                                  v-validate="'required'">
                                  <!--@open="buscaItems">-->
                                  <template slot="option" slot-scope="props">
                                    <div class="option__desc"><span class="option__title">{{ props.option.ds_code }} / {{ props.option.ds_description }}</span></div>
                                  </template>
                                  <span slot="noResult"><font color="red">Nenhum registro localizado!</font></span>
                                </multiselect>
                              </div>
                              <span v-if="errors.first('item')" class="label label-danger"> {{ errors.first('item') }}</span>
                            </div>
                          </div>

                        </div> <!-- Tipo do Item e Código do Produto ou Serviço -->

                        <div class="form-group row">

                          <div class="required" :class="{ 'has-error' : errors.first('descrição item')}">
                            <label class="control-label col-md-2">Descrição Item:</label>
                            <div>
                              <div class="col-md-10">
                                <input type="text" v-model="itemForm.observacao" name="descrição item" maxlength="255" aria-label="Descrição do item" class="form-control" v-validate="'required'"/>
                                <span v-if="errors.first('descrição item')" class="label label-danger"> {{ errors.first('descrição item') }}</span>
                              </div>
                             
                            </div>
                          </div>

                        </div> <!-- Descrição do item -->

                        <div class="form-group row">

                          <div class="required" :class="{ 'has-error' : errors.first('quantidade')}">
                            <label class="control-label col-md-2">Quantidade:</label>
                            <div class="col-md-1">
                              <div>
                                <input type="number" v-model="itemForm.quantidade" name="quantidade" min="1" maxlength="6" aria-label="Quantidade do recurso"
                                       class="form-control text-right" v-validate="'required|min_value:1'" @change="valorTotal(itemForm)"/>
                              </div>
                              <span v-if="errors.first('quantidade')" class="label label-danger"> {{ errors.first('quantidade') }}</span>
                            </div>

                            <div class="col-sm-2">
                              <select v-model="itemForm.unidade_medida" class="form-control">
                                <option :value="unidade_medida" v-for="unidade_medida in medidas">{{unidade_medida}}</option>
                              </select>
                            </div>

                            <div v-if="itemForm.unidade_medida === 'Outros'" class="col-md-2 required-field" :class="{ 'has-error' : errors.first('medida outros')}">
                              <input type="text" v-model="itemForm.medida_outros" name="medida outros" maxlength="255" aria-label="Outros" v-validate="'required'"
                                     :title="'<h5>Qual essa outra unidade de medida?</h5>'" v-tippy="{inertia:true, arrow:true, animation:'perspective', distance:'1', size:'large', arrow:true}"
                                     class="form-control text-right"/>
                              <span v-if="errors.first('medida outros')" class="label label-danger"> {{ errors.first('medida outros') }}</span>
                            </div>
                          </div>

                          <div class="required" :class="{ 'has-error' : errors.first('valor unitario')}">
                            <label class="control-label col-md-1">Valor Unitário:</label>
                            <div class="col-md-2">
                              <div>
                                <money disabled v-model="itemForm.valor_unitario" class="form-control text-right" name="valor unitario"
                                       v-validate="'required|min_value:0.01'" @change="valorTotal(itemForm)"></money>
                                       <span>Valor cotado: {{itemForm.valor_cotado | real}} <i class="fa fa-question-circle" aria-hidden="true" title="Valor médio dos preços cotados, ou da soma das médias, se houver mais de um produto/serviço"></i></span>
                              </div>
                              <span v-if="errors.first('valor unitario')" class="label label-danger"> {{ errors.first('valor unitario') }} 
                                
                              </span>
                            </div>
                            <b-button type="button" @click.stop="abrirCotacao()" class="btn btn-primary btn-sm btn-flat"><i class="fa fa-plus-circle" aria-hidden="true"></i> Adicionar/Editar Cotação</b-button>
                          </div>

                          <!-- <div v-else class="row-flex centered-start cotacao-container gap-10">
                            <b-button type="button" @click.stop="toggleCotacao(true); editarCotacao = false" class="btn btn-primary btn-sm btn-flat"><i class="fa fa-search" aria-hidden="true"></i> Cotação de Item</b-button>
                            <b-button type="button" @click.stop="toggleCotacaoManual()" class="btn btn-warning btn-sm btn-flat"><i class="fa fa-comment" aria-hidden="true"></i> Orçamento Manual</b-button>
                          </div> -->

                          <div class="row-flex all-end w-100"><!-- Total -->
                            <label class="control-label col-md-2">Valor Total: {{(itemForm.quantidade * itemForm.valor_unitario) | real}}</label>
                          </div>

                        </div> <!-- Quantidade, Valor Unitário e Total -->

                        <div class="form-group row">
                        <!-- Adiantável e Conta financeira -->
                          <div v-if="proposta.ds_fase === 'ANALISE'" class=" required"
                               :class="{ 'has-error' : errors.first('adiantavel')}">
                            <label class="control-label col-md-2">Adiantável:</label>
                            <div class="col-md-2">
                              <select :disabled="itemForm.origem === '2' || itemForm.origem === 2"
                                      v-model="itemForm.adiantavel" name="adiantavel"
                                      class="form-control" required
                                      v-validate="'required'">
                                <option value="0">Não</option>
                                <option value="1">Sim</option>
                              </select>
                              <span v-if="errors.first('adiantavel')" class="label label-danger"> {{ errors.first('adiantavel') }}</span>
                            </div>
                          </div>

                        <!-- Conta Financeira - Mostra somente nas fases de analise até aprovacao-->
                          <div v-if="propostaDentroFbb()" class="required"
                          :class="{ 'has-error' : errors.first('conta financeira')}">
                            <label class="control-label col-md-2">Conta Financeira:</label>
                            <div class="col-md-6">
                            <multiselect :disabled="blockSelect === true" name="conta financeira" :custom-label="contaCodigo" v-model="itemForm.conta_financeira"
                            :options="contasFinanceiras" :close-on-select='true' :hide-selected="true" :preserve-search="false"
                            placeholder="Escolha um item" label="numero_conta" track-by="numero_conta" :preselect-first="false" @select="selecionaConta"
                            v-validate="'required'">
                            <template slot="option" slot-scope="props">
                            <div class="option__desc"><span class="option__title">{{ props.option.numero_conta }} / {{ props.option.descricao }}</span></div>
                              </template>
                                <span slot="noResult"><font color="red">Nenhum registro localizado!</font></span>
                              </multiselect>
                              <span v-if="errors.first('conta financeira')" class="label label-danger"> {{ errors.first('conta financeira') }}</span>
                            </div>
                          </div>
                        </div>

                      <!-- Botões de OK e Cancelar -->
                        <div class="form-group row">
                          <div class="col-md-10 col-md-offset-2">
                            <button ref="financial-physical-save-item" @click="onAdd(atividade, item, itemIndex)" id="financial-physical-save-item" type="button" class="btn btn-confirm btn-flat" :class="{disabled:submitDisabled}"><i class="fa fa-check" aria-hidden="true"></i> Ok</button>
                            <button @click.once="cancelaItem(atividade, item, itemIndex)" id="financial-physical-cancel-item" type="button" class="btn btn-back btn-flat"><i class="fa fa-times-circle" aria-hidden="true"></i> Cancelar</button>
                          </div>
                        </div>

                      </div>

                    </td>
                  </template>
                </tr>
              </template>


          </tbody>
        </table>
      </div>
    </div>

    <div class="row">
      <div class="col-md-12">
        <table class="totais">
          <tr>
            <td class="centralizado"><span v-if="totais.projeto.fbb !== 0">Total Fundação</span></td>
            <td class="centralizado"><span v-if="totais.projeto.parceiros !== 0">Total Parceiro Estratégico</span></td>
            <td class="centralizado"><span v-if="totais.projeto.contrapartida !== 0">Total Contrapartida</span></td>
            <td class="centralizado"><span v-if="totais.adiantavel.total !== 0">Total Adiantável</span></td>
            <td class="centralizado">Total do Projeto</td>
          </tr>
          <tr>
            <!-- // Inclusão de toFixed(2) para formatar saída do valor com 2 casas após a vírgula -->
            <td class="centralizado valor">
                <span v-if="totais.projeto.fbb !== 0" :title="'<h5>Total da Fundação R$ <span class=\'realce\'>' + (totais.projeto.fbb).toFixed(2) + '</span> distribuídos em <span class=\'realce\'>' + totais.itens.fbb + '</span> itens, compondo aprox. <span class=\'realce\'>' + (Math.round((totais.projeto.fbb / totais.projeto.total) * 100) | percent) + '%</span> do total do projeto</h5>'" v-tippy="{ inertia:true, arrow:true, animation:'perspective', distance:'1', size:'large', arrow:true }">
                {{totais.projeto.fbb | real}}</span>
            </td>
            <td class="centralizado valor">
                <span v-if="totais.projeto.parceiros !== 0" :title="'<h5>Total de Parceiro Estratégico R$ <span class=\'realce\'>' + (totais.projeto.parceiros).toFixed(2) + '</span> distribuídos em <span class=\'realce\'>' + totais.itens.parceiros + '</span> itens, compondo aprox. <span class=\'realce\'>' + (Math.round((totais.projeto.parceiros / totais.projeto.total) * 100) | percent) + '%</span> do total do projeto</h5>'" v-tippy="{ inertia:true, arrow:true, animation:'perspective', distance:'1', size:'large', arrow:true }">
                {{totais.projeto.parceiros | real}}</span>
            </td>
            <td class="centralizado valor">
                <span v-if="totais.projeto.contrapartida !== 0" :title="'<h5>Total da Contrapartida R$ <span class=\'realce\'>' + (totais.projeto.contrapartida).toFixed(2) + '</span> distribuídos em <span class=\'realce\'>' + totais.itens.contrapartida + '</span> itens, compondo aprox. <span class=\'realce\'>' + (Math.round((totais.projeto.contrapartida / totais.projeto.total) * 100) | percent) + '%</span> do total do projeto</h5>'" v-tippy="{ inertia:true, arrow:true, animation:'perspective', distance:'1', size:'large', arrow:true }">
                {{totais.projeto.contrapartida | real}}</span>
            </td>
            <td class="centralizado valor">
                <span v-if="totais.adiantavel.total !== 0" :title="'<h5>Total Adiantável R$ <span class=\'realce\'>' + totais.adiantavel.total + '</span>, sendo R$ <span class=\'realce\'>' + totais.adiantavel.fbb + '</span> da Fundação e R$ <span class=\'realce\'>' + totais.adiantavel.parceiros + '</span> de Parc. Estratégico</h5>'" v-tippy="{ inertia:true, arrow:true, animation:'perspective', distance:'1', size:'large', arrow:true }">
                {{totais.adiantavel.total | real}}</span>
            </td>
            <td class="centralizado valor">
                <span :title="'<h5>Total do Projeto R$ <span class=\'realce\'>' + totais.projeto.total + '</span> distribuídos em <span class=\'realce\'>' + totais.itens.total + '</span> itens</h5>'" v-tippy="{ inertia:true, arrow:true, animation:'perspective', distance:'1', size:'large', arrow:true }">
                {{totais.projeto.total | real}}</span>
            </td>
          </tr>
        </table>
      </div>
    </div>

    <div class="row" v-if="usuarioLogado.userType === 'FUNDACAO'">
      <div class="col-md-8"></div>
      <div class="col-md-4">
        <table class="totais" style="margin: 10px 0;">
          <tr style="text-align: right;">
            <td style="padding: 1px;text-align: center; vertical-align: baseline;">
              <p>
                <span> Investimento <i class="fa fa-info-circle" title="Produtos, obra civil, seguros e IPVA" v-tippy="{inertia:true, arrow:true, animation:'perspective', distance:'1', size:'large', arrow:true}"></i></span>
              </p>
              <p>
                <span> <strong> {{ (totalInvestimento / (totalInvestimento + totalCusteio) * 100).toFixed(0) }}% </strong> </span>
              </p>
              <p>
                <span> {{ totalInvestimento | real }} </span>
              </p>
            </td>
            <td style="padding: 1px;text-align: center; vertical-align: baseline;">
              <p>
                <span> Custeio <i class="fa fa-info-circle" title="O que não for investimento" v-tippy="{inertia:true, arrow:true, animation:'perspective', distance:'1', size:'large', arrow:true}"></i></span>
              </p>
              <p>
                <span> <strong> {{ (totalCusteio / (totalInvestimento + totalCusteio) * 100).toFixed(0) }}% </strong> </span>
              </p>
              <p>
                <span> {{ totalCusteio | real }} </span>
              </p>
              <p>
                Capacitação e assessoria
                <br>
                <strong> {{ ((totalCapacitacao + totalAssessoria) / (totalInvestimento + totalCusteio) * 100).toFixed(0)  }}% </strong>
                ({{ totalCapacitacao + totalAssessoria | real }})
              </p>
            </td>
          </tr>
        </table>
      </div>
    </div>

  </div>



</template>

<script>
  /* eslint-disable camelcase,space-infix-ops */

  const itemFormOriginal = {
    observacao: null,
    origem: null,
    periodo_inicial: null,
    recurso: null,
    adiantavel: null,
    unidade_medida: null,
    item: {
      ds_code: '',
      ds_description: '',
      valor_unitario: null,
      status: null,
      ds_type: null
    },
    quantidade: null,
    periodo_final: null,
    valorTotal: null,
    // Adicionando a ligação da cotação
    itemCotacao: [],
    itemCotacaoManual: [],
    itemCotacaoValidado: {
      responsavel: '',
      validado: false,
      horaValidacao: new Date()
    },
    fk_cotacao: '',
    valor_unitario: 0
  }
  import { mapGetters } from 'vuex'
  import cotacaoItens from './cotacaoItens.vue'
  export default {
    name: 'cronogramaCotacao',
    components: {
      cotacaoItens
    },
    data () {
      return {
        showForm: false,
        totalCusteio: 0,
        totalInvestimento: 0,
        totalCapacitacao: 0,
        totalAssessoria: 0,
        entidadeEhFundacao: false,
        abrirSistemaCotacao: false,
        abrirSistemaCotacaoManual: false,
        bloqueiaBotoes: false, // Bloqueia botões quando estiver editando
        conta_financeira: {},
        objetivos: [],
        blockSelect: false,
        atividade: {},
        totais: {
          projeto: {
            fbb: 0,
            parceiros: 0,
            contrapartida: 0,
            total: 0
          },
          adiantavel: {
            fbb: 0,
            parceiros: 0,
            total: 0
          },
          itens: {
            fbb: 0,
            parceiros: 0,
            contrapartida: 0,
            adiantaveis: 0,
            total: 0
          }
        },
        itemForm: {
          itens_orcamentos: [],
          conta_financeira: {},
          adiantavel: null,
          item: null,
          valor_cotado: null
        },
        medidas: [
          'Caixas',
          'Capacitações',
          'Rolos',
          'Unidades',
          'Outros'
        ],
        componentKey: 0,
        itemTabela: {},
        items: [],
        formasContratacao: [],
        contasFinanceiras: [],
        editando: false,
        adicionando: false,
        // atividades: [],
        atividadeTabela: {}, // Guarda o valor do objeto atividade antes da edição
        rules: `required|min_value:1|max_value:${this.meses}`,
        submitDisabled: false,
        editarCotacao: false,
        validarCotacao: false,
        visualizarCotacao: false
      }
    },
    props: ['propsObjetivos', 'propsAtividades', 'propsMetas', 'proposta', 'meses', 'projetoDuplicacao'],
    computed: {
      ...mapGetters([
        'usuarioLogado'
      ]),
      valorTotal (itemForm) {
        itemForm.itemForm.totalValue = parseInt(itemForm.valor_unitario * itemForm.quantidade)
        return itemForm.itemForm
      }
    },
    watch: {
      propsObjetivos () { // Observa o objeto caso ele altere. envia um emit para atualizar o objeto pai
        // this.$emit('itemAdicionado', this.propsObjetivos)
        this.$forceUpdate()
      },
      valorTotal (itemForm) {
        // itemForm.itemForm.totalValue = itemForm.itemForm.quantity * itemForm.itemForm.unitaryValue
        // return itemForm.itemForm
        this.$forceUpdate()
      },
      proposta () {
      },
      projetoDuplicacao () {
        this.buscaContasFinanceiras()
      },
      meses () {
        this.$forceUpdate()
      },
      propsAtividades () {
        // console.log('propAtividades', this.propsAtividades)
        // this.componentKey += 1
        this.$forceUpdate()
      }
    },
    created: function () {
      this.entidadeEhFundacao = this.proposta.entidade.ds_cnpj === '01641000000133'
      // this.table.items = this.atividades
      // this.buscaContasFinanceiras()
      this.buscaItensDespesas()
      this.calcularTotais()
      this.$validator.extend('periodoValido')
    },
    methods: {
      calcularTotais () {
        this.totais.projeto.fbb = 0
        this.totais.projeto.parceiros = 0
        this.totais.projeto.contrapartida = 0
        this.totais.adiantavel.fbb = 0
        this.totais.adiantavel.parceiros = 0
        //
        this.totais.itens.fbb = 0
        this.totais.itens.parceiros = 0
        this.totais.itens.contrapartida = 0
        this.totais.itens.adiantaveis = 0
        //
        let vm = this
        //
        this.totais.projeto.fbb = _.sumBy(vm.propsAtividades, function (atv) {
          return _.sumBy(atv.itens_orcamentos, function (ite) {
            if (('' + ite.origem) === '1') {
              vm.totais.itens.fbb++
              return _.has(ite, 'valorOrcado') ? parseFloat(ite.valorOrcado) : parseFloat(ite.valor_unitario) * parseFloat(ite.quantidade)
            } else return 0
          })
        })
        this.totais.projeto.contrapartida = _.sumBy(vm.propsAtividades, function (atv) {
          return _.sumBy(atv.itens_orcamentos, function (ite) {
            if (('' + ite.origem) === '2') {
              vm.totais.itens.contrapartida++
              return _.has(ite, 'valorOrcado') ? parseFloat(ite.valorOrcado) : parseFloat(ite.valor_unitario) * parseFloat(ite.quantidade)
            } else return 0
          })
        })
        this.totais.projeto.parceiros = _.sumBy(vm.propsAtividades, function (atv) {
          return _.sumBy(atv.itens_orcamentos, function (ite) {
            if (('' + ite.origem) === '5') {
              vm.totais.itens.parceiros++
              return _.has(ite, 'valorOrcado') ? parseFloat(ite.valorOrcado) : parseFloat(ite.valor_unitario) * parseFloat(ite.quantidade)
            } else return 0
          })
        })
        this.totais.adiantavel.fbb = _.sumBy(vm.propsAtividades, function (atv) {
          return _.sumBy(atv.itens_orcamentos, function (ite) {
            return (('' + ite.origem) === '1' && ('' + ite.adiantavel === '1')) ? (_.has(ite, 'valorOrcado') ? parseFloat(ite.valorOrcado) : (parseFloat(ite.valor_unitario) * parseFloat(ite.quantidade))) : 0
          })
        })
        this.totais.adiantavel.parceiros = _.sumBy(vm.propsAtividades, function (atv) {
          return _.sumBy(atv.itens_orcamentos, function (ite) {
            return (('' + ite.origem) === '5' && ('' + ite.adiantavel === '1')) ? (_.has(ite, 'valorOrcado') ? parseFloat(ite.valorOrcado) : (parseFloat(ite.valor_unitario) * parseFloat(ite.quantidade))) : 0
          })
        })
        this.totalCusteio = _.sumBy(vm.propsAtividades, function (atv) {
          return _.sumBy(atv.itens_orcamentos, function (ite) {
            return (('' + ite.ds_type) === 'SERVICO' && !_.includes(['S0585', 'S0601', 'S0599'], ite.item.ds_code)) ? (_.has(ite, 'valorOrcado') ? parseFloat(ite.valorOrcado) : (parseFloat(ite.valor_unitario) * parseFloat(ite.quantidade))) : 0
          })
        })
        this.totalInvestimento = _.sumBy(vm.propsAtividades, function (atv) {
          return _.sumBy(atv.itens_orcamentos, function (ite) {
            return (('' + ite.ds_type) === 'PRODUTO' || _.includes(['S0585', 'S0601', 'S0599'], ite.item.ds_code)) ? (_.has(ite, 'valorOrcado') ? parseFloat(ite.valorOrcado) : (parseFloat(ite.valor_unitario) * parseFloat(ite.quantidade))) : 0
          })
        })
        this.totalCapacitacao = _.sumBy(vm.propsAtividades, function (atv) {
          return _.sumBy(atv.itens_orcamentos, function (ite) {
            return (ite.item.ds_code === 'S0587') ? (_.has(ite, 'valorOrcado') ? parseFloat(ite.valorOrcado) : (parseFloat(ite.valor_unitario) * parseFloat(ite.quantidade))) : 0
          })
        })
        this.totalAssessoria = _.sumBy(vm.propsAtividades, function (atv) {
          return _.sumBy(atv.itens_orcamentos, function (ite) {
            return (ite.item.ds_code === 'S0586') ? (_.has(ite, 'valorOrcado') ? parseFloat(ite.valorOrcado) : (parseFloat(ite.valor_unitario) * parseFloat(ite.quantidade))) : 0
          })
        })
        //
        this.totais.projeto.total = this.totais.projeto.fbb + this.totais.projeto.parceiros + this.totais.projeto.contrapartida
        this.totais.adiantavel.total = this.totais.adiantavel.fbb + this.totais.adiantavel.parceiros
        this.totais.itens.total = this.totais.itens.fbb + this.totais.itens.parceiros + this.totais.itens.contrapartida
        //
        this.$forceUpdate()
        //
        let bc = new BroadcastChannel('propostas')
        bc.postMessage({acao: 'notificacaoAtualizacaoCronograma', id: this.proposta.id})
        //
        let semContrapartida = this.totais.projeto.contrapartida === 0
        this.$emit('validacaoCronograma', {'tag': 'cronogramaContrapartida', 'ativo': (semContrapartida && !this.entidadeEhFundacao), 'tipo': 'restricao', 'acao': null, 'mensagem': 'É obrigatório registrar <b>Contrapartida</b> ao Cronograma'})
        //
        let itemSemContaFinanceira = _.sumBy(vm.propsAtividades, function (atv) {
          return _.sumBy(atv.itens_orcamentos, function (item) {
            return !_.has(item, 'conta_financeira') || !_.isNumber(item.conta_financeira['numero_conta']) ? 1 : 0
          })
        })
        this.$emit('validacaoCronograma', {'tag': 'cronogramaFaltaContaFinanceira', 'ativo': (itemSemContaFinanceira > 0 && this.proposta.ds_fase === 'ANALISE'), 'tipo': 'restricao', 'acao': null, 'mensagem': 'Ainda há <b>' + itemSemContaFinanceira + '</b> item(ns) sem contas financeiras indicadas'})
      },
      // Busca todos os itens de despesa permitidos para contratação de projetos
      buscaItensDespesas () {
        axiosLaravel.post('itens/contratacao', {'tipos': ['PRODUTO', 'SERVICO']}).then((response) => {
          this.$store.state.itensDespesa = response.data
        })
        this.items = this.$store.state.itensDespesa
      },
      propostaDentroFbb () { // Se a proposta está na esteira de contratação dentro de alguma das fases relativas a Fundação.
        return _.includes(['ANALISE', 'DEFERIMENTO', 'FORMALIZACAO', 'APROVACAO_PROJETO'], this.proposta.ds_fase)
      },
      itemCodigo ({ds_code, ds_description}) {
        return `${ds_code} / ${ds_description}`
      },
      contaCodigo ({numero_conta, descricao}) {
        return `${numero_conta} / ${descricao}`
      },
      buscaContasFinanceiras (row) {
        let codigoItem = ''
        if (row.ds_code) {
          codigoItem = row.ds_code
        }
        if (row.item) {
          codigoItem = row.item.ds_code
        }
        let tipoItem = codigoItem.substring(0, 1)
        this.itemForm['ds_type'] = tipoItem === 'P' ? 'PRODUTO' : (tipoItem === 'S' ? 'SERVICO' : 'ERRO')
        let projDuplicacao = this.projetoDuplicacao
        let fase = this.itemForm.origem
        let obj = {}
        obj.item = codigoItem
        obj.duplicador = projDuplicacao
        obj.fase = fase
        if (this.projetoDuplicacao) {
          axiosLaravel.post('busca_conta_financeira/', obj).then((response) => {
            this.contasFinanceiras = response.data
            if (this.contasFinanceiras.length === 1) {
              this.itemForm.conta_financeira = this.contasFinanceiras[0]
              this.blockSelect = true
            } else {
              this.blockSelect = false
            }
          })
            .catch((error) => {
              this.$root.trataErro(error)
            })
        }
      },
      cancelaItem (atividade, item, itemIndex) {
        if (this.editando !== true) {
          atividade.itens_orcamentos.pop()
        }
        this.itemForm = Object.assign({}, itemFormOriginal)
        this.itemTabela = {}
        this.editando = false
        this.adicionando = false
        item.editando = false
        this.bloqueiaBotoes = false
        // this.$forceUpdate()
      },
      validaPeriodo () {
        if (_.toSafeInteger(this.itemForm.periodo_final) < _.toSafeInteger(this.itemForm.periodo_inicial) && this.itemForm.periodo_final && this.itemForm.periodo_inicial) {
          const error = {
            field: 'inicio',
            msg: 'Período inicial não pode ser maior que o fim'
          }
          this.$validator.errors.add(error)
          this.submitDisabled = true
          return
        } else {
          this.$validator.reset()
          this.submitDisabled = false
        }
      },
      onAdd (atividade) {
        console.log('ONADD')
        if (this.submitDisabled) {
          return
        }
        // Valida produto
        if (this.itemForm.item.ds_type === null || _.isEmpty(this.itemForm.item.ds_code)) {
          const error = {
            field: 'item',
            msg: 'item não prenchido'
          }
          this.$validator.errors.add(error) // Adiciona erro no errobag
          return
        } else {
          this.$validator.errors.remove('item', 'item não prenchido') // Retira erro no errobag
        }
        // Valida se a observacao do item é unica
        // Procura o texto da observação dentro de cada item orcamento de cada objeto da PropsAtividade
        // propsAtividades > object -> itens_orcamentarios => [] -> obsercacao
        // Valida restantes dos campos
        if (this.editando === false) {
          let observacao_form = this.itemForm.observacao.trim()
          let obs_duplicada = _.find(this.propsAtividades, atividade => _.find(atividade.itens_orcamentos, item => item.observacao === observacao_form))
          if (obs_duplicada) {
            const error = {
              field: 'descrição item',
              msg: 'Descrição do item já utilizada neste cronograma. Gentileza alterar a descrição.'
            }
            this.$validator.errors.add(error) // Adiciona erro no errobag
            return
          } else {
            this.$validator.errors.remove('descrição item', 'descrição duplicada') // Retira erro no errobag
          }
        }
        this.$validator.validateAll().then((result) => {
          // console.log('result', result)
          if (result) {
            // Se estiver NÃO estiver em forma de edição então adiciona na tabela
            if (this.editando === true) {
              // aqui copia todos os atributos que esta no formulário para objeto atividade que esta dentro dos items
              // de outra forma iria só apontar para endereço de memória e
              // não é isso que queremos queremos mesmo copiar os atributos para o objeto já existente
              // 74205 - Atualizacao da checagem dos itens antes de incluir na lista
              if (this.itemForm.itemCotacao.length === 0 && this.itemForm.itemCotacaoManual.length === 0) {
                delete this.itemForm.itemCotacao
                delete this.itemForm.itemCotacaoManual
                delete this.itemForm.itemCotacaoValidado
              } else {
                // Verifica se alterou descricao, quantidade, unidade
                console.log('Verifica alteracoes', this.itemForm.observacao, this.itemTabela.observacao)
                if ((this.itemForm.observacao !== this.itemTabela.observacao) || (this.itemForm.quantidade !== this.itemTabela.quantidade) || (this.itemForm.valor_cotado !== this.itemTabela.valor_cotado)) {
                  console.log('Atualizacao pendente de validacao')
                  this.itemForm.itemCotacaoValidado = {
                    reponsavel: '',
                    validado: false,
                    horaValidacao: ''
                  }
                }
              }
              for (let i in this.itemForm) this.itemTabela[i] = this.itemForm[i]
            } else {
              atividade.itens_orcamentos.pop()
              let item = Object.assign({}, this.itemForm)
              item.editando = false
              // Verifica se itemCotacao e itemCotacaoManual estão vazios
              if (item.itemCotacao.length === 0 && item.itemCotacaoManual.length === 0) {
                delete item.itemCotacao
                delete item.itemCotacaoManual
                delete item.itemCotacaoValidado
              }
              atividade.itens_orcamentos.push(item) // adiciona nova atividade na item escolhida
            }
            this.itemForm = Object.assign({}, itemFormOriginal)
            this.itemTabela = {}
            this.editando = false
            this.adicionando = false
            this.itemForm.editando = false
            this.bloqueiaBotoes = false
            // this.$emit('itemAdicionado', this.propsObjetivos)
            this.calcularTotais()
            this.$forceUpdate()
          }
        })
        this.$forceUpdate()
      },
      somaTotal (items) {
        if (items !== undefined) {
          if (items.length > 0) {
            return items.reduce((total, item) => {
              if (item.valor_unitario) {
                return total + (item.valor_unitario * item.quantidade)
              }
            }, 0)
          }
        }
      },
      editaItem (atividade, atividadeIndex, item, itemIndex) {
        if (this.proposta.ds_fase === 'ANALISE' && _.isNil(this.projetoDuplicacao)) { // Não há duplicador selecionado, não pode editar o item
          this.$dialog.alert('Selecione um <b>Projeto de Duplicação</b> antes de Editar este item', {html: true, animation: 'fade', customClass: 'avisoInfo'})
        } else {
          this.itemForm = Object.assign({}, item)
          if (!this.itemForm.hasOwnProperty('fk_cotacao')) {
            this.itemForm.fk_cotacao = ''
          }
          if (!this.itemForm.hasOwnProperty('itemCotacao')) {
            this.itemForm.itemCotacao = []
          }
          if (!this.itemForm.hasOwnProperty('itemCotacaoManual')) {
            this.itemForm.itemCotacaoManual = []
          }
          if (!this.itemForm.hasOwnProperty('itemCotacaoValidado')) {
            this.itemForm.itemCotacaoValidado = {
              reponsavel: '',
              validado: false,
              horaValidacao: ''
            }
          }
          // console.log(this.itemForm)
          this.buscaContasFinanceiras(item)
          this.itemTabela = item
          item.editando = true
          this.editando = true
          this.bloqueiaBotoes = true
          this.$forceUpdate() // Força Vue a render o componente inteiro
          console.log('editaItem() - item: ', item)
        }
      },
      addItem (atividade, atividadeIndex) {
        if (this.proposta.ds_fase === 'ANALISE' && _.isNil(this.projetoDuplicacao)) { // Não há duplicador selecionado, não pode editar o item
          this.$dialog.alert('Selecione um <b>Projeto de Duplicação</b> antes de Adicionar item', {html: true, animation: 'fade', customClass: 'avisoInfo'})
        } else {
          this.itemForm = Object.assign({}, itemFormOriginal)
          if (!atividade.itens_orcamentos) {
            atividade.itens_orcamentos = []
            this.$forceUpdate()
          }
          this.itemForm.itemCotacao = []
          this.itemForm.itemCotacaoManual = []
          this.itemForm.editando = true
          this.adicionando = true
          atividade.itens_orcamentos.push(Object.assign({}, this.itemForm))
          this.$forceUpdate()
          this.abrirCotacao()
        }
      },
      deleteItem (atividade, atividadeIndex, item, itemIndex) {
        atividade.itens_orcamentos.splice(itemIndex, 1)
        this.calcularTotais()
      },
      deleteTodos (retorno) {
        if (retorno === 'ok') {
          this.propsAtividades.forEach((prop) => prop.itens_orcamentos.splice(prop.length))
        }
        this.calcularTotais()
      },
      selecionaConta (conta) {
        this.itemForm.conta_financeira = conta
      },
      zeraAdiantamento () {
        if (('' + this.itemForm.origem) === '2') {
          this.itemForm.adiantavel = 0
        }
        if (('' + this.itemForm.origem) === '1') {
          this.itemForm.adiantavel = 1
        }
      },
      toggleCotacao (valor) {
        this.$refs.cotacaoContainer.scrollIntoView({ behavior: 'smooth' })
        this.abrirSistemaCotacao = valor
      },
      abrirCotacao () {
        this.toggleCotacao(true)
        if (this.itemForm.itemCotacao.length > 0 || this.itemForm.itemCotacaoManual.length > 0) {
          this.editarCotacao = true
        } else {
          this.editarCotacao = false
        }
      },
      toggleCotacaoManual () {
        this.itemForm.itemCotacao = []
        this.itemForm.itemCotacaoManual = []
        this.itemForm.itemCotacao.push('Orçamento Manual')
      },
      setDescricaoValor (descricao, valor, cotacao, cotacaoManual, validacao, fk_cotacao) {
        this.itemForm.fk_cotacao = fk_cotacao
        this.itemForm.valor_unitario = valor
        this.itemForm.valor_cotado = valor
        this.itemForm.observacao = descricao
        this.itemForm.itemCotacao = []
        this.itemForm.itemCotacao.push(cotacao)
        this.itemForm.itemCotacaoManual = []
        cotacaoManual.forEach((cotacao) => {
          cotacao.anexos.forEach((anexo) => {
            anexo.file = null
          })
        })
        console.log('cotacaoManual:', cotacaoManual)
        this.itemForm.itemCotacaoManual.push(cotacaoManual)
        this.itemForm.itemCotacaoValidado = {
          responsavel: validacao.responsavel,
          validado: validacao.validado,
          horaValidacao: validacao.horaValidacao
        }
      },
      abrirCotacaoValidacao (item, visualizacao) {
        this.validarCotacao = true
        this.editarCotacao = false
        this.visualizandoCotacao = visualizacao
        this.itemForm = Object.assign({}, item)
      },
      fecharValidacao () {
        this.itemForm = Object.assign({}, itemFormOriginal)
        this.validarCotacao = false
        this.editarCotacao = false
        this.$forceUpdate()
      },
      verificaValidacao (item) {
        if (!item.hasOwnProperty('itemCotacaoValidado')) {
          return 'legado'
        } else {
          if (item.itemCotacaoValidado.validado) {
            if (item.itemCotacaoManual[0].length > 0) {
              return 'validado-manual'
            }
            if (item.itemCotacaoValidado.responsavel === 'SISTEMA / DE ACORDO COM COEFICIENTE DE VARIAÇÃO') {
              return 'validado-automatico'
            }
            return 'validado'
          } else {
            return 'pendente-validacao'
          }
        }
      },
      gravarValidacaoRow (fkCotacao, validacao) {
        this.propsAtividades.forEach((atividade) => {
          if (atividade.hasOwnProperty('itens_orcamentos')) {
            atividade.itens_orcamentos.forEach((item) => {
              if (item.hasOwnProperty('fk_cotacao')) {
                if (item.fk_cotacao === fkCotacao) {
                  if (!item.hasOwnProperty('itemCotacaoValidado')) {
                    item.itemCotacaoValidado = {
                      reponsavel: '',
                      validado: false,
                      horaValidacao: ''
                    }
                  }
                  item.itemCotacaoValidado = validacao
                }
              }
            })
          }
        })
      },
      verificaPendentesDeValidacao () {
        let resultado = true
        this.propsAtividades.forEach((atividade) => {
          if (atividade.hasOwnProperty('itens_orcamentos')) {
            atividade.itens_orcamentos.forEach((item) => {
              if (item.hasOwnProperty('itemCotacaoValidado')) {
                let itemValidado = item.itemCotacaoValidado
                console.log(item.itemCotacaoValidado)
                if (itemValidado.hasOwnProperty('validado')) {
                  if (!item.itemCotacaoValidado.validado) {
                    console.log('não tem')
                    resultado = false
                  }
                } else {
                  console.log('não tem')
                  resultado = false
                }
              }
            })
          }
        })
        return resultado
      }
    }
  }
</script>

<style scoped>
.cotacao-container {
  padding: 10px;
  width: 50%;
  height: 30px;
}
.legado {
  background-color: #f592216e;
}
.pendente-validacao {
  background-color: #f5212180;
}
.validado-automatico {
  background-color: #49934d6b;
}
.validado-manual {
  background-color: #ffe600b4;
}

.validado {
  background-color: #56a3eb83;
}

.legado-legenda {
  background-color: #f59221a2;
}

.pendente-validacao-legenda {
  background-color: #f52121a6;
}
.validado-legenda {
  background-color: #49934da2;
}

.acoes-coluna {
  min-height: 150px;
}

.legenda-container {
  width: 100%;
  gap: 10px;
  margin-bottom: 10px;
  margin-top: 10px;
}

.legenda-box {
  width: 20px;
  height: 20px;
  border-radius: 5px;
}

.cotacao-tipo {
  font-weight: 700;
  font-size: 1.2rem;
  padding: 15px;
}

</style>
