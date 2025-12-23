  <!-- 74213 - Módulo de Prestação de Contas para Processo Simplificado-->
  <template>
    <!-- Cronograma ------------------------------------------------------------------------------------------------------------------------------>
    <div class="prest-modulo-container" id="cronogramaPagamento">
      <div>
        <h3 class="prest-box-title row-flex centered-start">Cronograma <i class="fa fa-calendar-check-o" aria-hidden="true" ></i><span v-if="loading.cronograma" class="etiquetaCarregando"><i class="fa fa-refresh fa-spin"></i> Carregando...</span></h3>
      </div>


      <div v-if="!loading.cronograma && !editando" id="solicitacao">
        <div class="row">
          <div class="col-md-12">

            <div class="form-group">
              <div class="col-md-10">

                <span v-if="totais.projeto.fbb.orcado > 0 && totais.projeto.parceiros.orcado > 0">
                  <label class="radio-inline new-control new-control-radio" style="padding-top: 7px;" :title="'<h5>' + (processo === 'PRESTACAO_DE_CONTAS' && totais.adiantamento.fbb.saldo <= 0 ? 'Não há pendência de prestação de contas com recursos da Fundação BB' : 'Mostrar o(s) item(ns) relacionados a Fundação BB') + '</h5>'" v-tippy="{inertia:true, arrow:true, animation:'perspective', distance:'1', size:'large', arrow:true}">
                    <input type="radio" name="filtro_origem_recurso"  @click="filtrarPorOrigemRecurso('fundacao')" :checked="_.includes(extratoFiltrosSelecionados, 'fundacao')" :disabled="ehVisualizacao || (processo === 'PRESTACAO_DE_CONTAS' && totais.adiantamento.fbb.saldo <= 0) || !_.includes(['Solicitação', 'Revisão', 'Análise'], etapa)"> Fundação <div class="new-control-indicator"></div>
                  </label>
                  <label class="radio-inline new-control new-control-radio" style="padding-top: 7px;" :title="'<h5>' + (processo === 'PRESTACAO_DE_CONTAS' && totais.adiantamento.parceiros.saldo <= 0 ? 'Não há pendência de prestação de contas com recursos de Parceiro Estratégico' : 'Mostrar o(s) item(ns) relacionados ao Parceiro Estratégico') + '</h5>'" v-tippy="{inertia:true, arrow:true, animation:'perspective', distance:'1', size:'large', arrow:true}">
                    <input type="radio" name="filtro_origem_recurso" @click="filtrarPorOrigemRecurso('parceiro')" :checked="_.includes(extratoFiltrosSelecionados, 'parceiro')" :disabled="ehVisualizacao || (processo === 'PRESTACAO_DE_CONTAS' && totais.adiantamento.parceiros.saldo <= 0) || !_.includes(['Solicitação', 'Revisão', 'Análise'], etapa)"> Parceiro Estratégico <div class="new-control-indicator"></div>
                  </label>
                </span>

              </div>
              </div>
          </div>
          <div class="col-md-offset-2 col-md-10" style="color: var(--cor-destaque); margin-top: -10px" v-if="totais.projeto.fbb.orcado > 0 && totais.projeto.parceiros.orcado > 0">
            Atenção: Selecione os itens relacionados a Fundação <strong>OU</strong> ao Parceiro Estratégico
          </div>
        </div>

        <div class="row">
          <div class="col-md-12">
            <table class="table table-condensed">
              <thead>
              <tr class="cabecalho">
                <th>&nbsp;</th>
                <th colspan="2" class="centralizado" :title="'<h5>Valor total contratado no projeto por Atividade e Item</h5>'" v-tippy="{inertia:true, arrow:true, animation:'perspective', distance:'1', size:'large', arrow:true}">Orçado</th>
                <th colspan="2" class="centralizado" :title="'<h5>Informe o que consta no documento (quantidade e valor)</h5>'" v-tippy="{inertia:true, arrow:true, animation:'perspective', distance:'1', size:'large', arrow:true}">{{processo === 'CONTRAPARTIDA' ? 'Comprovação' : 'Solicitação'}}</th>
                <th colspan="2" class="centralizado" :title="'<h5>Saldo restante de cada Atividade e Item</h5>'" v-tippy="{inertia:true, arrow:true, animation:'perspective', distance:'1', size:'large', arrow:true}">Saldo</th>
                <th v-if="processo === 'CONTRAPARTIDA' && _.includes(['Análise'], etapa)"></th>
              </tr>
              <tr class="cabecalho">
                <th>{{(layoutExtrato === 'porOrigem' ? 'Origem do Recurso' : 'Atividade')}} / Recursos (itens do cronograma)</th>
                <th class="centralizado">Qtde</th>
                <th class="centralizado">Valor</th>
                <th class="centralizado">Qtde</th>
                <th class="centralizado">Valor</th>
                <th class="centralizado">Qtde</th>
                <th class="centralizado">Valor</th>
                <th class="centralizado">Adicionar Nota</th>
              </tr>
              </thead>

              <tbody>

              <!-- Tabela -->
              <template v-for="origem in (layoutExtrato === 'classico' ? [['1', '5', '2']] : (layoutExtrato === 'porOrigem') ? [['1', '5']] : [['2']])">

                <tr v-if="layoutExtrato === 'porOrigem'">
                  <td colspan="8" class="atividade">{{(_.includes(origem, '2')) ? 'Recursos de Contrapartida' : 'Recursos da Fundação BB'}}</td>
                </tr>

                <template v-for="(atividade) in cronograma.atividades" v-if="(_.filter(cronograma.itens, function (i) { return i.Atividade_nome === atividade.Nome && _.includes((processo === 'CONTRAPARTIDA' ? ['2'] : ['1', '5']), ('' + i.Item_Origem).substring(0, 1)) && (!_.has(i, 'mostrar') || i.mostrar)})).length > 0">
                  <tr class="atividade" v-if="layoutExtrato === 'classico'">
                    <!-- <tr class="atividade" v-if="layoutExtrato === 'porOrigem'"> -->
                    <td class="esquerda celula b1 b3 b4 nome_atividade">{{atividade.Nome}}</td>
                    <td class="centralizado celula b1 b3 b4">&nbsp;</td>
                    <td class="centralizado celula b1 b3">&nbsp;</td>
                    <td class="centralizado celula b1 b3 b4">&nbsp;</td>
                    <td class="centralizado celula b1 b3">&nbsp;</td>
                    <td class="centralizado celula b1 b3 b4">&nbsp;</td>
                    <td class="centralizado celula b1 b3 b2">&nbsp;</td>
                    <td class="centralizado celula b1 b3 b2">&nbsp;</td>
                  </tr>

                  <template v-for="item in _.filter(cronograma.itens, {'Atividade_nome': atividade.Nome})" v-if="_.includes((processo === 'CONTRAPARTIDA' ? ['2'] : ['1', '5']), ('' + item.Item_Origem).substring(0, 1))">

                    <template v-if="!_.has(item, 'mostrar') || item.mostrar">

                      <tr>
                        <td class="celula b3 b4">
                          <div class="item" v-bind:style="usuarioLogado.userType === 'FUNDACAO' ? 'width: 80%; float: left;' : ''">
                            <div class="item_despesa esquerda">({{_.upperFirst(_.lowerCase(item.Item_Tipo))}})  {{item.Item + ' / ' + item.Item_Descricao}}</div>
                            <div class="observacao esquerda" v-html="'<span class=id_item>#' + item.Id_item + '</span>  ' + item.Item_Observacao + '</span>'"/>
                          </div>
                          <div v-if="usuarioLogado.userType === 'FUNDACAO'" style="width: 20%; text-align: right; float: right; color: var(--cor-fraca)">{{item.Item_Conta}}</div>
                        </td>

                        <!-- Seção de orçamento -->
                        <td class="centralizado celula b3 b4" :title="'<h5>' + (!_.has(item, 'Item_Unidade_medida') || _.isNull(item.Item_Unidade_medida) ? 'Sem unid. de medida' : (item.Item_Unidade_medida === 'Outros' && _.has(item, 'Item_Unidade_medida_outros') && !_.isNull(item.Item_Unidade_medida_outros) ? ('Outros:<br/>' + item.Item_Unidade_medida_outros) : item.Item_Unidade_medida)) + '</h5>'" v-tippy="{inertia:true, arrow:true, animation:'perspective', distance:'1', size:'large', arrow:true}">
                          {{item.Qtde_orcado}}
                        </td>
                        <td class="centralizado celula b3">
                          {{item.Valor_orcado | decimal2}}
                        </td>


                        <!-- Seção de solicitação -->
                        <td class="centralizado celula b3 b4 qtdeSolicitacao" :class="parseFloat(item.Qtde_solicitado) === 0 && parseFloat(item.Valor_solicitado) !== 0 ? 'qtde_pendente' : ''">
                          <!-- <input v-model="item.Qtde_solicitado" name="quantidade a solicitar" class="form-control text-right qtdeSolicitacao" type="text" @keyup="item.Qtde_solicitado = limitaFaixaEntrada('inteiro', item.Qtde_solicitado, 0, item.Qtde_saldo)" @blur="verificaCorrigeDados" :disabled="parseFloat(item.Qtde_saldo) <= 0 || parseFloat(item.Valor_saldo) <= 0 || ehVisualizacao || _.includes(['Análise Tributária', 'Autorização', 'Liquidação'], etapa)"/> -->
                          <input v-model="item.Qtde_solicitado" name="quantidade a solicitar" class="form-control text-right qtdeSolicitacao" type="text" @keyup="item.Qtde_solicitado = limitaFaixaEntrada('inteiro', item.Qtde_solicitado, 0, item.Qtde_saldo)" @blur="verificaCorrigeDados" :disabled="true"/>
                        </td>
                        <td class="centralizado celula b3 valorSolicitacao" :class="parseFloat(item.Qtde_solicitado) !== 0 && parseFloat(item.Valor_solicitado) === 0 ? 'valor_pendente' : ''">
                          <!-- <money v-model="item.Valor_solicitado" name="valor a solicitar" class="form-control text-right valorSolicitacao" type="text" @keyup.native="item.Valor_solicitado = limitaFaixaEntrada('decimal', item.Valor_solicitado, 0, item.Valor_saldo)" @blur.native="calcularTotaisExtato" :disabled="parseFloat(item.Qtde_saldo) <= 0 || parseFloat(item.Valor_saldo) <= 0 || ehVisualizacao || _.includes(['Análise Tributária', 'Autorização', 'Liquidação'], etapa)"></money> -->
                          <money v-model="item.Valor_solicitado" name="valor a solicitar" class="form-control text-right valorSolicitacao" type="text" @keyup.native="item.Valor_solicitado = limitaFaixaEntrada('decimal', item.Valor_solicitado, 0, item.Valor_saldo)" @blur.native="calcularTotaisExtato" :disabled="true"></money>
                        </td>


                        <!-- Seção de saldos -->
                        <td class="centralizado celula b3 b4" :title="'<h5>' + (!_.has(item, 'Item_Unidade_medida') || _.isNull(item.Item_Unidade_medida) ? 'Sem unid. de medida' : (item.Item_Unidade_medida === 'Outros' && _.has(item, 'Item_Unidade_medida_outros') && !_.isNull(item.Item_Unidade_medida_outros) ? ('Outros:<br/>' + item.Item_Unidade_medida_outros) : item.Item_Unidade_medida)) + '</h5>'" v-tippy="{inertia:true, arrow:true, animation:'perspective', distance:'1', size:'large', arrow:true}">
                          {{item.Qtde_saldo - parseFloat(item.Qtde_solicitado)}}
                        </td>
                        <td class="centralizado celula b2 b3">
                          {{item.Valor_saldo - parseFloat(item.Valor_solicitado) | decimal2}}
                        </td>
                        <!-- Seção de Inserção de Nova Nota -->
                        <td class="centralizado celula b2 b3 b4">
                          <g-button-ujarak v-if="parseFloat(item.Valor_saldo - item.Valor_solicitado) > 0 && parseFloat(item.Qtde_saldo - item.Qtde_solicitado) > 0" color="primary" size="button--size-ss" @click.native="toggleEdicao(true, item)"
                                          :title="'<h5>Clique para Inserir uma Nova Nota</h5>'" v-tippy="{inertia:true, arrow:true, animation:'perspective', distance:'1', size:'large', arrow:true, placement:'bottom'}">
                            <i class="fa fa-plus-circle" aria-hidden="true"></i> Inserir
                          </g-button-ujarak>
                          <div v-else class="prest-max-solicitado">
                            <i>Valores máximos já solicitados.</i>
                          </div>
                        </td>
                      </tr>

                    </template>

                  </template>

                </template>

              </template>

              </tbody>

            </table>

          </div>
        </div>

        <!-- Totais -->
        <div class="row" v-if="!loading.cronograma">
          <div class="col-md-12">
            <table class="totais">
              <tr>
                <td class="centralizado"><span v-if="totais.projeto.fbb.orcado !== 0">Total Fundação</span></td>
                <td class="centralizado"><span v-if="totais.projeto.parceiros.orcado !== 0">Total Parceiro Estratégico</span></td>
                <td class="centralizado"><span v-if="totais.projeto.contrapartida.orcado !== 0">Total Contrapartida</span></td>
                <td class="centralizado">Total do Projeto</td>
                <td class="centralizado"><span v-if="totais.adiantamento.total.orcado !== 0">Total Adiantável</span></td>
                <td class="centralizado" v-if="processo === 'PRESTACAO_DE_CONTAS'">Limite pendente</td>
                <td class="centralizado">Total desta Solicitação</td>
              </tr>
              <tr>
                <td class="centralizado valor">
                  <span v-if="totais.projeto.fbb.orcado !== 0" :title="'<h5>Valor total orçado com recursos da Fundação</h5>'" v-tippy="{ inertia:true, arrow:true, animation:'perspective', distance:'1', size:'large', arrow:true }">
                    {{totais.projeto.fbb.orcado | real}}
                  </span>
                </td>
                <td class="centralizado valor">
                  <span v-if="totais.projeto.parceiros.orcado !== 0" :title="'<h5>Valor total orçado com recursos de Parceiro Estratégico</h5>'" v-tippy="{ inertia:true, arrow:true, animation:'perspective', distance:'1', size:'large', arrow:true }">
                    {{totais.projeto.parceiros.orcado | real}}
                  </span>
                </td>
                <td class="centralizado valor">
                  <span v-if="totais.projeto.contrapartida.orcado !== 0" :title="'<h5>Valor total orçado com recursos da Contrapartida</h5>'" v-tippy="{ inertia:true, arrow:true, animation:'perspective', distance:'1', size:'large', arrow:true }">
                    {{totais.projeto.contrapartida.orcado | real}}
                  </span>
                </td>
                <td class="centralizado valor">
                  <span :title="'<h5>Valor total orçado para este projeto</h5>'" v-tippy="{ inertia:true, arrow:true, animation:'perspective', distance:'1', size:'large', arrow:true }">
                    {{totais.projeto.total.orcado | real}}
                  </span>
                </td>
                <td class="centralizado valor">
                  <span v-if="totais.adiantamento.total.orcado !== 0" :title="'<h5>Valor total orçado para Adiantamento</h5>'" v-tippy="{ inertia:true, arrow:true, animation:'perspective', distance:'1', size:'large', arrow:true }">
                    {{totais.adiantamento.total.orcado | real}}
                  </span>
                </td>

                <td v-if="processo === 'PRESTACAO_DE_CONTAS'" class="centralizado valor">
                  <span v-if="_.includes(extratoFiltrosSelecionados, 'fundacao')" :title="'<h5>Saldo máximo disponível sobre o(s) adiantamento(s) liberados(s) com recursos da <span class=\'realce\'>Fundação</span> para prestar contas ou devolver</h5>'" v-tippy="{inertia:true, arrow:true, animation:'perspective', distance:'1', size:'large', arrow:true}">{{totais.adiantamento.fbb.saldo | real}}</span>
                  <span v-else-if="_.includes(extratoFiltrosSelecionados, 'parceiro')" :title="'<h5>Saldo máximo disponível sobre o(s) adiantamento(s) liberados(s) com recursos de <span class=\'realce\'>Parceiro Estratégicos</span> para prestar contas ou devolver</h5>'" v-tippy="{inertia:true, arrow:true, animation:'perspective', distance:'1', size:'large', arrow:true}">{{totais.adiantamento.parceiros.saldo | real}}</span>
                  <span v-else class="realce">Deve selecionar Fundação ou Parceiro no filtro</span>
                </td>

                <td class="centralizado valor" rowspan="2">
                  <span class="label label-danger" style="font-style: unset"
                        v-if="processo === 'PRESTACAO_DE_CONTAS' && (
                                  (_.includes(extratoFiltrosSelecionados, 'fundacao') && totais.projeto.fbb.solicitado > totais.adiantamento.fbb.saldo) ||
                                  (_.includes(extratoFiltrosSelecionados, 'parceiro') && totais.projeto.parceiros.solicitado > totais.adiantamento.parceiros.saldo))"
                        :title="'<h5>O total desta solicitação ultrapassou o limite pendente (saldo máximo disponível) para prestar contas</h5>'" v-tippy="{inertia:true, arrow:true, animation:'perspective', distance:'1', size:'large', arrow:true}">
                    {{totais.projeto.total.solicitado | real}}
                  </span>
                  <span v-else :title="'<h5>Valor total desta solicitação</h5>'" v-tippy="{ inertia:true, arrow:true, animation:'perspective', distance:'1', size:'large', arrow:true }">
                    {{totais.projeto.total.solicitado | real}}
                  </span>
                </td>
              </tr>
              <tr>
                <td class="centralizado valor">
                  <span v-if="totais.projeto.fbb.orcado !== 0" class="saldo" :title="'<h5>Saldo dos recursos da Fundação com <span class=\'realce\'>' + (Math.round(100 - ((totais.projeto.fbb.saldo / totais.projeto.fbb.orcado) * 100)) | percent) + '%</span> de atingimento</h5>'" v-tippy="{ inertia:true, arrow:true, animation:'perspective', distance:'1', size:'large', arrow:true }">
                    {{totais.projeto.fbb.saldo | real}}
                  </span>
                </td>
                <td class="centralizado valor">
                  <span v-if="totais.projeto.parceiros.orcado !== 0" class="saldo" :title="'<h5>Saldo dos recursos de Parceiro Estratégico com <span class=\'realce\'>' + (Math.round(100 - ((totais.projeto.parceiros.saldo / totais.projeto.parceiros.orcado) * 100)) | percent) + '%</span> de atingimento</h5>'" v-tippy="{ inertia:true, arrow:true, animation:'perspective', distance:'1', size:'large', arrow:true }">
                    {{totais.projeto.parceiros.saldo | real}}
                  </span>
                </td>
                <td class="centralizado valor">
                  <span v-if="totais.projeto.contrapartida.orcado !== 0" class="saldo" :title="'<h5>Saldo dos recursos da Contrapartida com <span class=\'realce\'>' + (Math.round(100 - ((totais.projeto.contrapartida.saldo / totais.projeto.contrapartida.orcado) * 100)) | percent) + '%</span> de atingimento</h5>'" v-tippy="{ inertia:true, arrow:true, animation:'perspective', distance:'1', size:'large', arrow:true }">
                    {{totais.projeto.contrapartida.saldo | real}}
                  </span>
                </td>
                <td class="centralizado valor">
                  <span class="saldo" :title="'<h5>Saldo total do projeto com <span class=\'realce\'>' + (Math.round(100 - ((totais.projeto.total.saldo / totais.projeto.total.orcado) * 100)) | percent) + '%</span> de atingimento</h5>'" v-tippy="{ inertia:true, arrow:true, animation:'perspective', distance:'1', size:'large', arrow:true }">
                    {{totais.projeto.total.saldo | real}}
                  </span>
                </td>
                <td class="centralizado valor">
                  <span v-if="totais.adiantamento.total.orcado !== 0 && false" class="saldo" :title="'<h5>Saldo dos Adiantamento não solicitados ainda</h5>'" v-tippy="{ inertia:true, arrow:true, animation:'perspective', distance:'1', size:'large', arrow:true }">
                    {{totais.adiantamento.total.saldo | real}}
                  </span>
                </td>
                <td class="centralizado valor">&nbsp;</td>

                <td class="centralizado valor">&nbsp;</td>
              </tr>
            </table>
          </div>
        </div>
      </div>

      <div v-if="editando" class="column all-start prest-cadastro-nota-container prest-fade" id="solicitacao">
        <div class="prest-title">
          Adicionando Nova Nota para Prestação de Contas
        </div>
        <div class="column centered-start prest-nota-atividade-container">
          <div class="prest-atividade-row">
            <i class="fa fa-bookmark"></i> {{ this.nota.itemOrcamento.Atividade_nome }}
          </div>
          <div class="row-flex centered-start prest-atividade-row">
            <span class="prest-id-item">#{{ this.nota.itemOrcamento.Id_item }}</span>
            [{{ this.nota.itemOrcamento.Item }}] {{ this.nota.itemOrcamento.Item_Descricao }}
          </div>
          <div class="row-flex centered-start prest-atividade-row">
            <b>Quantidade Orçada:</b> {{ this.nota.itemOrcamento.Qtde_orcado }}
            <b>Valor Orçado:</b> {{ this.nota.itemOrcamento.Valor_orcado | real }}
            <u><b>Saldo Restante:</b> {{ (this.nota.itemOrcamento.Valor_saldo - this.nota.itemOrcamento.Valor_solicitado) - this.nota.valor | real }}</u>
            <b>Saldo Quantidade:</b> {{ this.nota.itemOrcamento.Qtde_saldo }}
          </div>
          <div class="row-flex centered-start prest-atividade-row">
            Data de Emissão deve estar entre: 
            <b>Inicio:</b> {{ moment(projeto.dateInicioSapiens).utc().format('DD/MM/YYYY') }} 
            e
            <b>Fim:</b> {{ moment(projeto.dateFimSapiens).utc().format('DD/MM/YYYY') }}
          </div>
        </div>
        <!-- Dados do Documento ------------------------------------------------------------------------------------------------------------------------->
          <div class="box-header">
            <h3 class="box-title">Dados do Documento</h3>
          </div>

          <div class="row-flex w-100">
            <div class="col-md-12">
              <div class="form-group required-field" :class="(errors.first('número da nota') ? ' has-error' : '')">
                <label class="control-label">Item:
                  <i class="fa fa-question-circle text-gray" aria-hidden="true" v-if="processo === 'RESSARCIMENTO' && _.includes(['Solicitação', 'Revisão', 'Análise'], etapa)"
                    :title="'<h5>Informe o número quando se tratar de documento fiscal ou um RPA com numeração<br/>Se for um documento sem numeração fiscal, como contra-cheque etc, pode deixar em branco</h5>'"
                    v-tippy="{inertia:true, arrow:true, animation:'perspective', distance:'1', size:'large', arrow:true, placement:'top'}"></i>
                </label>
                <input type="text" v-model="nota.itemNome" class="form-control">
                <span v-if="errors.first('número da nota')" class="label label-danger"> {{ errors.first('número da nota') }}</span>
              </div>
            </div>
            <div class="col-md-12">
              <div class="form-group required-field" :class="(errors.first('número da nota') ? ' has-error' : '')">
                <label class="control-label">Valor:
                  <i class="fa fa-question-circle text-gray" aria-hidden="true" v-if="processo === 'RESSARCIMENTO' && _.includes(['Solicitação', 'Revisão', 'Análise'], etapa)"
                    :title="'<h5>Informe o número quando se tratar de documento fiscal ou um RPA com numeração<br/>Se for um documento sem numeração fiscal, como contra-cheque etc, pode deixar em branco</h5>'"
                    v-tippy="{inertia:true, arrow:true, animation:'perspective', distance:'1', size:'large', arrow:true, placement:'top'}"></i>
                </label>
                <money v-model="nota.valor" name="valorNota" class="form-control text-right" type="text" @keyup.native="nota.valor = limitaFaixaEntrada('decimal', nota.valor, 0, (nota.itemOrcamento.Valor_saldo - nota.itemOrcamento.Valor_solicitado))" @blur.native="calcularTotaisExtato"></money>
                <span v-if="errors.first('número da nota')" class="label label-danger"> {{ errors.first('número da nota') }}</span>
              </div>
            </div>
          </div>

          <div class="row-flex w-100">

            <!-- Número do documento -->
            <div class="col-md-12">
              <div class="form-group required-field" :class="(errors.first('número da nota') ? ' has-error' : '')">
                <label class="control-label">Número do Documento:
                  <i class="fa fa-question-circle text-gray" aria-hidden="true" v-if="processo === 'RESSARCIMENTO' && _.includes(['Solicitação', 'Revisão', 'Análise'], etapa)"
                    :title="'<h5>Informe o número quando se tratar de documento fiscal ou um RPA com numeração<br/>Se for um documento sem numeração fiscal, como contra-cheque etc, pode deixar em branco</h5>'"
                    v-tippy="{inertia:true, arrow:true, animation:'perspective', distance:'1', size:'large', arrow:true, placement:'top'}"></i>
                </label>
                <the-mask v-model="nota.numeroNota" name="número da nota" class="form-control text-right" type="text" :mask="processo !== 'RESSARCIMENTO' ? '#########' : '##########'"
                          min="1" max="2147483647" v-validate="'required'">
                </the-mask>
                <span v-if="errors.first('número da nota')" class="label label-danger"> {{ errors.first('número da nota') }}</span>
              </div>
            </div>

            <!-- Série -->
            <div class="col-md-12">
              <div class="form-group required-field" :class="{ 'has-error' : errors.first('série')}">
                <label class="control-label">Série:</label>
                <div>
                  <div>
                    <select v-model="nota.serieNota" class="form-control" name="série" v-validate="'required'" :disabled="ehNFe || ehVisualizacao || _.includes(['Análise Tributária', 'Autorização', 'Liquidação'], etapa)">
                      <option value="NOTA_FISCAL">1 - Nota fiscal</option>
                      <option value="RECIBO_PAGAMENTO_AUTONOMO">10 - Recibo de pagamento a autônomo</option>
                      <option value="DOCUMENTO_NAO_FISCAL">DNF - Documento não fiscal</option>
                    </select>
                  </div>
                  <span v-if="errors.first('série')" class="label label-danger"> {{ errors.first('série') }}</span>
                </div>
              </div>
            </div>

          </div>

          <div class="row-flex w-100">

            <!-- Data de emissão -->
            <div class="col-md-12">
              <div class="form-group required-field" :class="{ 'has-error' : errors.first('data de emissão')}">
                <label class="control-label">Data de emissão do documento:</label>
                <div>
                  <div>
                    <div class="input-group">
                      <datepicker  name="data de emissão" v-model="nota.dataInclusao" input-class="form-control datepicker" :disabled="ehNFe || ehVisualizacao || _.includes(['Análise Tributária', 'Autorização', 'Liquidação'], etapa)"
                                  :language="$datePickerPtBR" maxlength="20" :use-utc="true" placeholder="__ /__ /____"
                                  :disabled-dates="{to: new Date(projeto.dateInicioSapiens), max: new Date(projeto.dateFimSapiens)}"

                                  format="dd/MM/yyyy" v-validate="'required'">
                      </datepicker>
                    </div>
                  </div>
                  <span v-if="errors.first('data de emissão')" class="label label-danger"> {{ errors.first('data de emissão') }}</span>
                </div>
              </div>
            </div>

            <!-- Data de validade -->
            <div class="col-md-12">
              <div class="form-group">
                <label class="control-label">Data de validade do documento: (Somente informe se possuir a data)</label>
                <div>
                  <div class="input-group">
                    <datepicker  v-model="nota.dataValidade" input-class="form-control datepicker" :disabled="ehNFe || ehVisualizacao || _.includes(['Análise Tributária', 'Autorização', 'Liquidação'], etapa)"
                                :language="$datePickerPtBR" maxlength="20" :use-utc="true" placeholder="__ /__ /____" :disabled-dates="desabilitarDatasPassadas"
                                format="dd/MM/yyyy">
                    </datepicker>
                  </div>
                </div>
              </div>

            </div>

          </div>




        <!-- Dados do Fornecedor ------------------------------------------------------------------------------------------------------------------->
        <div class="column all-start prest-cadastro-nota-container" id="solicitacao">
          <div v-if="loading.tela" class="overlay-loading"><i class="fa fa-refresh fa-spin"></i></div>
          <div class="box-header">
            <h3 class="box-title">Fornecedor</h3>
          </div>

          <div class="row-flex w-100">
            <div class="col-md-12">
              <!-- Tipo de pessoa (Jurídica ou Fisica) -->
              <div class="form-group required-field" :class="{'has-error': errors.first('tipo de pessoa')}">
                <label class="control-label">Tipo de pessoa:</label>
                <div>
                  <div>
                    <select v-model="nota.tipoFornecedor" name="tipo de pessoa" class="form-control" v-validate="'required'"
                            @change="bloqueiaCamposFornecedorExistente = false, nota.nomeFornecedor = '', nota.cepFornecedor = '', nota.enderecoFornecedor = '', nota.cnpjFornecedor = '', nota.cpfFornecedor = '', nota.codigoFornecedor = ''"
                            :disabled="ehNFe || ehVisualizacao || _.includes(['Análise', 'Análise Tributária', 'Autorização', 'Liquidação'], etapa)">
                      <option value="Pessoa Física">Pessoa Física</option>
                      <option value="Pessoa Jurídica">Pessoa Jurídica</option>
                    </select>
                  </div>
                  <span v-if="errors.first('tipo de pessoa')" class="label label-danger"> {{ errors.first('tipo de pessoa') }}</span>
                </div>
              </div>
            </div>
          </div>

          <div class="row-flex w-100">
            <div class="col-md-12">
              <!-- CNPJ -->
              <div v-if="nota.tipoFornecedor === 'Pessoa Jurídica'" class="form-group required-field" :class="{'has-error': errors.first('cnpj')}">
                <label class="control-label">CNPJ:</label>
                <div>
                  <div class="row-flex">
                    <the-mask v-model="nota.cnpjFornecedor" name="cnpj" class="form-control" :mask="['##.###.###/####-##']"
                              :disabled="bloqueiaCamposFornecedorExistente || ehNFe || ehVisualizacao || _.includes(['Análise','Análise Tributária', 'Autorização', 'Liquidação'], etapa)"
                              @blur.native="verificaCpfCnpjSapiens(nota.cnpjFornecedor)" type="text" v-bind:style="usuarioLogado.userType === 'FUNDACAO' ? 'width: 65%; float: left' : ''"
                              v-validate="false">
                    </the-mask>
                    <input type="text" v-if="usuarioLogado.userType === 'FUNDACAO'" class="form-control" disabled="disabled" style="width: 35%; float: left; margin-left: 1%; " :value="nota.codigoFornecedor">
                  </div>
                  <span v-if="errors.first('cnpj')" class="label label-danger"> {{ errors.first('cnpj') }}</span>
                  <span v-if="errors.first('cnpj vinculado a dirigente')" class="label label-danger"> {{ errors.first('cnpj vinculado a dirigente') }}</span>
                </div>
              </div>

              <!-- CPF -->
              <div v-if="nota.tipoFornecedor === 'Pessoa Física'" class="form-group required-field" :class="{'has-error': errors.first('cpf')}">
                <label class="control-label">CPF:</label>
                <div>
                  <div>
                    <the-mask v-model="nota.cpfFornecedor" name="cpf" class="form-control" :mask="['###.###.###-##']"
                              :disabled="bloqueiaCamposFornecedorExistente || ehNFe || ehVisualizacao || _.includes(['Análise','Análise Tributária', 'Autorização', 'Liquidação'], etapa)"
                              @blur.native="verificaCpfCnpjSapiens(nota.cpfFornecedor)" type="text" v-bind:style="usuarioLogado.userType === 'FUNDACAO' ? 'width: 65%; float: left' : ''"
                              v-validate="false">
                    </the-mask>
                    <input type="text" v-if="usuarioLogado.userType === 'FUNDACAO'" class="form-control" disabled="disabled" style="width: 30%; float: left; margin-left: 5%; " :value="nota.codigoFornecedor">
                  </div>
                  <span v-if="errors.first('cpf')" class="label label-danger"> {{ errors.first('cpf') }}</span>
                </div>
              </div>

            </div>
            <div class="col-md-12">
              <!-- Nome -->
              <div class="form-group required-field" v-if="_.has(nota, 'tipoFornecedor') && !_.isNull(nota.tipoFornecedor)" :class="{'has-error': errors.first('nome')}">
                <label class="control-label">Nome:</label>
                <div>
                  <div>
                    <input v-model="nota.nomeFornecedor" name="nome" class="form-control" type="text"
                          :disabled="bloqueiaCamposFornecedorExistente || ehNFe || ehVisualizacao || _.includes(['Análise','Análise Tributária', 'Autorização', 'Liquidação'], etapa)"
                          maxlength="255" v-validate="'required'">
                  </div>
                  <span v-if="errors.first('nome')" class="label label-danger"> {{ errors.first('nome') }}</span>
                </div>
              </div>
            </div>
          </div>

          <div class="row-flex w-100">
            <div class="col-md-12">
              <!-- Endereço -->
              <div  class="form-group required-field" v-if="_.has(nota, 'tipoFornecedor') && !_.isNull(nota.tipoFornecedor)" :class="{'has-error': errors.first('endereço')}">
                <label class="control-label">Endereço:</label>
                <div>
                  <div>
                    <input v-model="nota.enderecoFornecedor" name="endereço" class="form-control" type="text"
                          :disabled="bloqueiaCamposFornecedorExistente || ehNFe || ehVisualizacao || _.includes(['Análise','Análise Tributária', 'Autorização', 'Liquidação'], etapa)"
                          v-validate="'required|max:255'">
                  </div>
                  <span v-if="errors.first('endereço ')" class="label label-danger"> {{ errors.first('endereço') }}</span>
                </div>
              </div>
            </div>
            <div class="col-md-12">
              <!-- CEP -->
              <div class="form-group required-field" v-if="_.has(nota, 'tipoFornecedor') && !_.isNull(nota.tipoFornecedor)" :class="{'has-error': errors.first('cep')}">
                <label class="control-label">CEP:</label>
                <div>
                  <div>
                    <the-mask  v-model="nota.cepFornecedor" name="cep" :mask="['#####-###']" class="form-control"
                              :disabled="bloqueiaCamposFornecedorExistente || ehNFe || ehVisualizacao || _.includes(['Análise','Análise Tributária', 'Autorização', 'Liquidação'], etapa)"
                              @blur.native="procurandoCidadeUF" v-validate="'required'">
                    </the-mask>
                  </div>
                  <span v-if="errors.first('cep')" class="label label-danger"> {{ errors.first('cep') }}</span>
                </div>
                <div v-if="nota.cepFornecedor">
                  {{nota.cidadeFornecedor}} {{(nota.estadoFornecedor) ? ' / ' + nota.estadoFornecedor : ''}}
                </div>
              </div>
            </div> 
          </div>

        </div>

        <!-- Forma e Prioridade de pagamento e Dados Bancários ----------------------------------------------------------------------------------------->
        <div class="column all-start prest-cadastro-nota-container" id="solicitacao">
          <div class="box-header">
            <h3 class="box-title">Dados Bancários {{processo === 'RESSARCIMENTO' ? ' de Beneficiário' : ''}} <span v-if="loading.favorecido" class="etiquetaCarregando"><i class="fa fa-refresh fa-spin"></i> Carregando...</span></h3>
          </div>


            <div class="row-flex w-100">
              <!-- Forma de pagamento -->
              <div class="col-md-12">
                <div class="form-group required-field" :class="{'has-error': errors.first('forma de pagamento')}" v-if="usuarioLogado.userType === 'FUNDACAO' || (usuarioLogado.userType !== 'FUNDACAO' && processo !== 'RESSARCIMENTO')">
                  <label class="control-label">Forma de pagamento:</label>
                  <div>
                    <div>
                      <select v-model="nota.forma_pagamento" name="forma de pagamento" class="form-control" v-validate="'required'"
                              :disabled="_.includes(['PRESTACAO_DE_CONTAS', 'RESSARCIMENTO'], processo) || ehVisualizacao || _.includes(['Análise Tributária', 'Autorização', 'Liquidação'], etapa)">
                        <option v-for="fp in listaFormasPagamento" :value="fp.CodFpg">{{fp.DesFpg}}</option>
                      </select>
                    </div>
                    <span v-if="errors.first('forma de pagamento')" class="label label-danger"> {{ errors.first('forma de pagamento') }}</span>
                  </div>
                </div>
              </div>


              <!--Prioridade do Pagamento -->
              <div class="col-md-12" v-if="usuarioLogado.userType === 'FUNDACAO'">
                <div class="form-group required-field" :class="{'has-error': errors.first('pagamento prioritário')}">
                  <label class="control-label">Pagamento Prioritário:</label>
                  <div>
                    <div>
                      <select v-model="nota.pagamentoPrioritario" class="form-control" name="pagamento prioritário" v-validate="'required'"
                              :disabled="ehVisualizacao || _.includes(['Análise Tributária', 'Autorização', 'Liquidação'], etapa)">
                        <option value="0">Não</option>
                        <option value="1">Sim</option>
                      </select>
                    </div>
                    <span v-if="errors.first('pagamento prioritário')" class="label label-danger"> {{ errors.first('pagamento prioritário') }}</span>
                  </div>
                </div>
              </div>
              
          </div>

        </div>

        <div class="row-flex centered-start prest-button-container">
          <g-button-ujarak color="primary" size="button--size-ss" @click.native="salvarNota()"
                        :title="'<h5>Clique para Salvar a Nota</h5>'" v-tippy="{inertia:true, arrow:true, animation:'perspective', distance:'1', size:'large', arrow:true, placement:'bottom'}">
            <i class="fa fa-save" aria-hidden="true"></i> Salvar
          </g-button-ujarak>
          <g-button-ujarak color="warning" size="button--size-ss" @click.native="toggleEdicao(false)"
                        :title="'<h5>Clique para Cancelar</h5>'" v-tippy="{inertia:true, arrow:true, animation:'perspective', distance:'1', size:'large', arrow:true, placement:'bottom'}">
            <i class="fa fa-remove" aria-hidden="true"></i> Cancelar
          </g-button-ujarak>
        </div>

      </div>

    </div>
  </template>
  
  <script>
    import { mapGetters } from 'vuex'
    import moment from 'moment'
    import BankAccountValidator from 'br-bank-account-validator'
    import { cpf, cnpj } from 'cpf-cnpj-validator'
    export default {
      components: {
      },
      name: 'cronogramaPrestacaoSimplificada',
      data () {
        return {
          moment: moment,
          layoutExtrato: 'classico',
          processo: 'PRESTACAO_DE_CONTAS',
          editando: false,
          nota: {
            itemOrcamento: null,
            valor: 0,
            quantidade: 1,
            status: 'Pendente',
            itemNome: null,
            item: null,
            numeroNota: null,
            serieNota: null,
            dataInclusao: null,
            dataValidade: null,
            observacao: null,
            dados_bancarios: {
              banco: null,
              agencia: null,
              conta: null,
              tipo: 1
            },
            tipoFornecedor: null,
            codigoFornecedor: '',
            cpfFornecedor: '',
            cnpjFornecedor: '',
            nomeFornecedor: '',
            enderecoFornecedor: '',
            cepFornecedor: '',
            anexos: [],
            forma_pagamento: null,
            pagamentoPrioritario: 0,
            bypass: '',
            dadosComplementares: [],
            suporteFbb: [],
            tributacao: '',
            valorTributado: '',
            parametros_documento: [],
            boleto: {
              sucesso: false,
              mensagem: null,
              tipoCodigoInput: null,
              tipoBoleto: null,
              codigoBarras: null,
              linhaDigitavel: null,
              numeroInformadoTela: null,
              vencimento: null,
              valor: null
            },
            favorecido: {
              CodBan: '',
              CodAge: '',
              CcbFav: '',
              contas: [],
              incluidos: [],
              excluidos: [],
              resultado: [],
              dadosBancariosSelecionados: null
            }
          },
          listaFormasPagamento: [{'CodFpg': '1', 'DesFpg': 'Dinheiro'}, {'CodFpg': '2', 'DesFpg': 'Crédito Conta Beneficiário'}, {'CodFpg': '3', 'DesFpg': 'Crédito Conta Fornecedor'}, {'CodFpg': '4', 'DesFpg': 'Docum. Código de Barras'}, {'CodFpg': '5', 'DesFpg': 'DDA - Débito direto autorizado'}, {'CodFpg': '6', 'DesFpg': 'Recibo/Orpag'}, {'CodFpg': '7', 'DesFpg': 'Em teste Pgto TED e DOC'}]
        }
      },
      props: {
        projeto: Object,
        cronograma: Object,
        totais: Object,
        loading: Object,
        entidade: Object,
        extratoFiltrosSelecionados: Array,
        calcularTotaisExtato: Function,
        verificaCorrigeDados: Function,
        adicionaRestricao: Function,
        setArrayNotas: Function,
        notasCadastradas: Array
      },
      computed: {
        ...mapGetters([
          'usuarioLogado'
        ]),
        chiefActive () {
          return this.usuarioLogado.entity.chiefs.some(chefe => {
            return chefe.active === true && moment(new Date()).isSameOrAfter(moment(chefe.initialMandateDate)) && moment(new Date()).isSameOrBefore(moment(chefe.endMandateDate))
          })
        }
      },
      created: function () {
      },
      mounted: function () {
        this.nota.forma_pagamento = this.listaFormasPagamento[1]['CodFpg']
      },
      methods: {
        toggleEdicao (valor, item = null) {
          this.editando = valor
          // Limpa Campos
          this.limparCamposNota()
          console.log('TOGGLE EDICAO')
          // Inicializa valores
          if (valor) {
            // Qual Atividade e Qual item de orçamento a nota está sendo registrada
            this.nota.itemOrcamento = _.cloneDeep(item)
          }
        },
        async salvarNota () {
          // Salva nota cadastrada no array de notas
          // Envia nota para o componente pai
          // Atualiza registros
          // NUMERO DA NOTA, TIPO DE DOC, CPF/CNPJ, NOME EMITENTE, ITEM, QUANTIDADE, VALOR, ATIVIDADE
          let validacao = await this.validaCamposNota()
          if (validacao === false) {
            return
          }
          this.nota.item = this.nota.itemOrcamento.Item
          this.nota.dados_bancarios.banco = '000'
          this.nota.dados_bancarios.agencia = '0'
          this.nota.dados_bancarios.conta = '0'
          this.nota.dados_bancarios.conta = 1
          if (this.nota.tipoFornecedor === 'Pessoa Jurídica') {
            _.unset(this.nota, 'cpfFornecedor')
          } else if (this.nota.tipoFornecedor === 'Pessoa Física') {
            _.unset(this.nota, 'cnpjFornecedor')
          }
          // Faz o acerto de valor
          this.nota.itemOrcamento.Valor_solicitado = this.nota.valor
          this.nota.itemOrcamento.Qtde_solicitado = 1
          this.nota.items = []
          this.nota.items.push(this.nota.itemOrcamento)
          this.setArrayNotas(this.nota)
          this.toggleEdicao(false)
          this.$snotify.success('Nota adicionada com sucesso')
        },
        async validaCamposNota () {
          // Verificaçoes: ============================================================================
          // 1 - Verifica se já existe nota cadastrada com o mesmo número
          // 2 - Verifica se está dentro do limite máximo de cada conta financeira  // Automático no input
          // 3 - Verifica se a emissão está dentro do prazo de execução do projeto
          // 4 - Demais verificações que já são feitas
          // ===========================================================================================
          // 0 - Verifica se campos da nota estão preenchidos (conforme os controles)
          let valido = await this.$validator.validateAll().then(validado => {
            if (!validado) {
              this.$snotify.error('Preencha todos os campos obrigatórios')
              const errors = this.$validator.errors.items
              console.log(errors)
              return false
            } else {
              return true
            }
          })
          if (valido === false) {
            return false
          }
          // 1 - Verifica se já existe nota cadastrada com o mesmo número
          if (this.notasCadastradas.length > 0) {
            let notaExistente = this.notasCadastradas.find((item) => {
              return item.numeroNota === this.nota.numeroNota
            })
            if (notaExistente) {
              this.$snotify.error('Já existe uma nota cadastrada com o mesmo número: ' + this.nota.numeroNota)
              return false
            }
          }
          // 3 - Verifica se a emissão está dentro do prazo de execução do projeto
          if (this.nota.dataInclusao) {
            let dataInclusao = moment(this.nota.dataInclusao).utc()
            let dataInicio = moment(this.projeto.dateInicioSapiens).utc()
            let dataFim = moment(this.projeto.dateFimSapiens).utc()
            if (dataInclusao.isBefore(dataInicio) || dataInclusao.isAfter(dataFim)) {
              this.$snotify.error('Data de Emissão da Nota fora do prazo de execução do projeto')
              return false
            }
          }
          return true
        },
        limparCamposNota () {
          this.nota = {
            itemOrcamento: null,
            valor: 0,
            quantidade: 1,
            status: 'Pendente',
            itemNome: null,
            item: null,
            numeroNota: null,
            serieNota: null,
            dataInclusao: null,
            dataValidade: null,
            observacao: null,
            dados_bancarios: {
              banco: null,
              agencia: null,
              conta: null,
              tipo: 1
            },
            tipoFornecedor: null,
            codigoFornecedor: '',
            cpfFornecedor: '',
            cnpjFornecedor: '',
            nomeFornecedor: '',
            enderecoFornecedor: '',
            cepFornecedor: '',
            anexos: [],
            forma_pagamento: this.listaFormasPagamento[1]['CodFpg'],
            pagamentoPrioritario: 0,
            bypass: '',
            dadosComplementares: [],
            suporteFbb: [],
            tributacao: '',
            valorTributado: '',
            parametros_documento: [],
            boleto: {
              sucesso: false,
              mensagem: null,
              tipoCodigoInput: null,
              tipoBoleto: null,
              codigoBarras: null,
              linhaDigitavel: null,
              numeroInformadoTela: null,
              vencimento: null,
              valor: null
            },
            favorecido: {
              CodBan: '',
              CodAge: '',
              CcbFav: '',
              contas: [],
              incluidos: [],
              excluidos: [],
              resultado: [],
              dadosBancariosSelecionados: null
            }
          }
        },
        limitaFaixaEntrada (tipo, valor, minimo, maximo) {
          if (_.isNil(valor) && _.isNull(valor) && _.isNaN(valor)) {
            valor = minimo
          } else {
            if (tipo === 'inteiro') {
              valor = _.toSafeInteger(('' + valor).replace(/\D+/g, ''))
            } else if (tipo === 'decimal') {
              valor = _.toNumber(('' + valor).replace(/[^.0-9]+/g, ''))
            }
            valor = valor <= minimo ? minimo : (valor >= maximo ? maximo : valor)
          }
          return tipo === 'inteiro' ? parseInt(valor) : tipo === 'decimal' ? parseFloat(valor) : valor
        },
        validandoCpfCnpj () {
          if (this.nota.tipoFornecedor === 'Pessoa Física') {
            this.nota.cpfFornecedor = _.padStart(this.nota.cpfFornecedor, 11, '0')
            return cpf.isValid(this.nota.cpfFornecedor) ? true : 'CPF inválido'
          }
          if (this.nota.tipoFornecedor === 'Pessoa Jurídica') {
            this.nota.cnpjFornecedor = _.padStart(this.nota.cnpjFornecedor, 14, '0')
            return cnpj.isValid(this.nota.cnpjFornecedor) ? true : 'CNPJ inválido'
          }
        },
        procurandoCidadeUF () {
          if (this.nota.cepFornecedor) {
            axiosLaravel.get('municipios/cep/' + this.nota.cepFornecedor).then((response) => {
              if (!_.isEmpty(response.data) && !_.isString(response.data)) {
                this.nota.cidadeFornecedor = response.data.ds_nome
                this.nota.estadoFornecedor = response.data.ds_uf
                this.$forceUpdate()
              }
            })
              .catch((error) => {
                this.$root.trataErro(error)
                // this.nota.cidadeFornecedor = ''
                // this.nota.estadoFornecedor = ''
                this.$forceUpdate()
              })
          } else {
            this.nota.cidadeFornecedor = ''
            this.nota.estadoFornecedor = ''
            this.$forceUpdate()
          }
        },
        buscaDadosbancariosFornecedor (cpfcgc) {
          axiosLaravel.get('pagamento/dadosBancariosFornecedores/' + cpfcgc).then((response) => {
            let dadosBancarios = response.data
            // formata dados para filtro único
            let dadosBancariosFormat = dadosBancarios.map((item) => {
              item.banco = item.banco.replace(/^0+/, '')
              item.banco = item.banco.padStart(3, '0')
              if (item.banco === '104' && item.agencia.length > 4) {
                item.agencia = item.agencia.slice(0, -1)
              }
              item.agencia = item.agencia.replace('-', '').toUpperCase()
              item.conta = parseInt(item.conta.replace('-', ''), 10)
              return item
            })

            // filtra registros potencialmente repetidos
            let arrayUnique = _.uniqBy(dadosBancariosFormat, ({agencia, conta}) => agencia + ':' + conta)

            // formata dados para apresentação ao usuário (digitos de agencia e conta)
            let dadosFormatados = arrayUnique.map((item) => {
              if (item.agencia.length > 4) {
                item.agencia = item.agencia.substring(0, item.agencia.length - 1) + '-' + item.agencia.substring(item.agencia.length - 1)
              }
              item.conta = String(item.conta)
              item.conta = item.conta.substring(0, item.conta.length - 1) + '-' + item.conta.substring(item.conta.length - 1)
              return item
            })

            // valida dados
            for (let i = 0; i < dadosFormatados.length; i++) {
              if (!this.validaDadosBancariosFornecedor(dadosFormatados[i].banco, dadosFormatados[i].agencia, dadosFormatados[i].conta)) {
                console.log(dadosFormatados[i])
                dadosFormatados.splice(i, 1)
              }
            }
            console.log('dados bancarios lenght: ', dadosBancarios.length)
            console.log(dadosBancarios)
            console.log('dados bancarios unicos lenght: ', dadosFormatados.length)
            console.log(dadosFormatados)
            this.dadosBancariosFornecedores = dadosFormatados
          })
            .catch((error) => {
              this.$snotify.clear()
              this.$root.trataErro(error)
            })
        },
        validaDadosBancariosFornecedor (bancoVer, agenciaVer, contaVer) {
          let banco = bancoVer

          let conta = _.words(contaVer)
          let digitosConta = _.get(_.head(_.filter(this.listaBancos, ['codigo', banco])), 'caracteresConta') // Se tiver o tamanho da conta na lista de bancos então completa com zeros para o usuário não ter que fazer
          let contaSemDV = digitosConta ? _.padStart(conta[0], digitosConta, '0') : conta[0]
          let contaDV = conta[1] || ''

          let agencia = _.words(agenciaVer)
          let agenciaSemDV = agencia[0] || ''
          let agenciaDV = agencia[1] || ''

          // console.log('banco: ', banco)
          // console.log('digitosConta ', digitosConta)
          // console.log('contaSemDV ', contaSemDV)
          // console.log('contaDV ', contaDV)
          // console.log('agencia ', agencia)
          // console.log('agenciaSemDV ', agenciaSemDV)
          // console.log('agenciaDV ', agenciaDV)
          try {
            BankAccountValidator.validate({
              bankNumber: banco,
              agencyNumber: agenciaSemDV,
              agencyCheckNumber: agenciaDV,
              accountNumber: contaSemDV,
              accountCheckNumber: contaDV
            })
            console.log('Validado')
            return true
          } catch (e) {
            console.log('Conta incorreta')
            return false
          }
        },
        verificaCnpjEmpresaLigada (cnpj) {
          // Verificará se o CNPJ está em lista de empresas ligadas aos dirigentes da entidade parceira nos últimos 12 meses após seu desligamento, se houver
          this.loading.tela = true
          axiosLaravel.post('consulta/empresas-ligadas', {'id': this.projeto.fk_entidade, 'cnpj': cnpj}).then((response) => {
            if (_.has(response.data, 'codigo') && response.data.codigo === 'OK') {
              let qtdeDirigentesEmpresasLigadas = response.data.retorno
              this.errors.remove('cnpj vinculado a dirigente')
              if (qtdeDirigentesEmpresasLigadas > 0) {
                this.errors.add({field: 'cnpj vinculado a dirigente', rule: 'cnpj_empresa_ligada', msg: 'Não pode usar esse CNPJ, pois esta vinculado a ' + (qtdeDirigentesEmpresasLigadas + ' ' + (qtdeDirigentesEmpresasLigadas > 1 ? 'dirigentes' : 'dirigente'))})
              }
              this.adicionaRestricao({'tag': 'temEmpresaLigada', 'ativo': qtdeDirigentesEmpresasLigadas > 0, 'tipo': 'restricao', 'acao': null, 'mensagem': 'Não pode prosseguir com esse CNPJ, pois está vinculado a ' + (qtdeDirigentesEmpresasLigadas + ' ' + (qtdeDirigentesEmpresasLigadas > 1 ? 'dirigentes ativos' : 'dirigente ativo')) + ' a menos de 12 meses'})
            } else {
              this.$snotify.error(response.data.mensagem)
            }
            this.$forceUpdate()
            this.loading.tela = false
          })
            .catch((error) => {
              this.loading.tela = false
              console.log('error', error)
              this.$root.trataErro(error)
            })
        },
        verificaCpfCnpjSapiens (CpfCnpj) {
          console.log(CpfCnpj)
          if (_.isNull(CpfCnpj) || _.isEmpty(CpfCnpj) || _.isUndefined(CpfCnpj)) {
            return
          }
          if (_.isString(this.validandoCpfCnpj())) {
            // Mostrar a validação do CNPJ ou CPF
          } else {
            this.loading.tela = true
            axiosLaravel.get('consulta/busca-fornecedor/' + CpfCnpj).then((response) => {
              if (!_.isEmpty(response.data)) {
                this.nota.enderecoFornecedor = response.data.EndFor
                this.nota.nomeFornecedor = response.data.NomFor
                this.nota.cepFornecedor = response.data.CepFor
                this.nota.codigoFornecedor = response.data.CodFor
                this.bloqueiaCamposFornecedorExistente = true
                this.procurandoCidadeUF()
                this.buscaDadosbancariosFornecedor(CpfCnpj)
              }
              if (_.isNull(_.get(this.projeto, 'edital', null)) && this.nota.tipoFornecedor === 'Pessoa Jurídica' && ('' + this.entidade.nr_codigo_forn_erp !== '' + this.nota.codigoFornecedor) && _.includes(['Solicitação', 'Revisão'], this.etapa)) {
                this.verificaCnpjEmpresaLigada(CpfCnpj)
              }
              this.loading.tela = false
              this.$forceUpdate()
            })
              .catch((error) => {
                this.loading.tela = false
                console.error(error)
                this.$snotify.clear()
                // this.$root.trataErro(error)
              })
            // Suporte 62054 - Validação do dirigente segundo a regra 536
            if (this.nota.tipoFornecedor === 'Pessoa Física') {
              axiosLaravel.post('entidades/verificaDirigente', { 'cpf': CpfCnpj, 'cnpj': this.entidade.ds_cnpj }).then((response) => {
              })
                .catch((error) => {
                  console.error(error)
                  this.$snotify.clear()
                  // this.$root.trataErro(error)
                })
            }
          }
        }
      }
    }
  </script>
  
  <style src="../../../../static/css/prestacaoContasNovo.css">
  </style>
  