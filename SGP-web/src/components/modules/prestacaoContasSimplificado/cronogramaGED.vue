  <!-- 74213 - Módulo de Prestação de Contas para Processo Simplificado-->
  <template>
    <!-- Cronograma ------------------------------------------------------------------------------------------------------------------------------>
    <div class="prest-modulo-container" id="cronogramaPagamento">
      <div>
        <h3 class="prest-box-title row-flex centered-start">Cronograma <i class="fa fa-calendar-check-o" aria-hidden="true" ></i></h3>
      </div>
      <div>
        Encontre o item do cronograma que deseja vincular o documento fiscal e clique em <b>Inserir</b>.
      </div>
      <div id="solicitacao">
        <div class="row">
          <div class="col-md-12">
            <table class="table table-condensed">
              <thead>
              <tr class="cabecalho">
                <th>&nbsp;</th>
                <th colspan="1" class="centralizado" :title="'<h5>Valor total contratado no projeto por Atividade e Item</h5>'" v-tippy="{inertia:true, arrow:true, animation:'perspective', distance:'1', size:'large', arrow:true}">Orçado</th>
                <th colspan="1" class="centralizado" :title="'<h5>Informe o que consta no documento (quantidade e valor)</h5>'" v-tippy="{inertia:true, arrow:true, animation:'perspective', distance:'1', size:'large', arrow:true}">Valor Documentos</th>
                <th colspan="1" class="centralizado" :title="'<h5>Saldo restante de cada Atividade e Item</h5>'" v-tippy="{inertia:true, arrow:true, animation:'perspective', distance:'1', size:'large', arrow:true}">Saldo</th>
              </tr>
              <tr class="cabecalho">
                <th>Atividade / Recursos (itens do cronograma)</th>
                <!-- <th class="centralizado">-</th>
                <th class="centralizado">Valor</th>
                <th class="centralizado">-</th>
                <th class="centralizado">Valor</th>
                <th class="centralizado">-</th>
                <th class="centralizado">Valor</th>
                <th class="centralizado">Adicionar Nota</th> -->
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
                        <!-- <td class="centralizado celula b3 b4" :title="'<h5>' + (!_.has(item, 'Item_Unidade_medida') || _.isNull(item.Item_Unidade_medida) ? 'Sem unid. de medida' : (item.Item_Unidade_medida === 'Outros' && _.has(item, 'Item_Unidade_medida_outros') && !_.isNull(item.Item_Unidade_medida_outros) ? ('Outros:<br/>' + item.Item_Unidade_medida_outros) : item.Item_Unidade_medida)) + '</h5>'" v-tippy="{inertia:true, arrow:true, animation:'perspective', distance:'1', size:'large', arrow:true}">
                          {{item.Qtde_orcado}}
                        </td> -->
                        <td class="centralizado celula b3 b4">
                          {{item.Valor_orcado | decimal2}}
                        </td>


                        <!-- Seção de solicitação -->
                        <!-- <td class="centralizado celula b3 b4 qtdeSolicitacao" :class="parseFloat(item.Qtde_solicitado) === 0 && parseFloat(item.Valor_solicitado) !== 0 ? 'qtde_pendente' : ''">
                          <input v-model="item.Qtde_solicitado" name="quantidade a solicitar" class="form-control text-right qtdeSolicitacao" type="text" @keyup="item.Qtde_solicitado = limitaFaixaEntrada('inteiro', item.Qtde_solicitado, 0, item.Qtde_saldo)" @blur="verificaCorrigeDados" :disabled="true"/>
                        </td> -->
                        <td class="centralizado celula b3 b4 valorSolicitacao">
                          <money v-model="item.Valor_solicitado" name="valor a solicitar" class="form-control text-right valorSolicitacao" type="text" @keyup.native="item.Valor_solicitado = limitaFaixaEntrada('decimal', item.Valor_solicitado, 0, item.Valor_saldo)" :disabled="true"></money>
                        </td>


                        <!-- Seção de saldos -->
                        <!-- <td class="centralizado celula b3 b4" :title="'<h5>' + (!_.has(item, 'Item_Unidade_medida') || _.isNull(item.Item_Unidade_medida) ? 'Sem unid. de medida' : (item.Item_Unidade_medida === 'Outros' && _.has(item, 'Item_Unidade_medida_outros') && !_.isNull(item.Item_Unidade_medida_outros) ? ('Outros:<br/>' + item.Item_Unidade_medida_outros) : item.Item_Unidade_medida)) + '</h5>'" v-tippy="{inertia:true, arrow:true, animation:'perspective', distance:'1', size:'large', arrow:true}">
                          {{item.Qtde_saldo - parseFloat(item.Qtde_solicitado)}}
                        </td> -->
                        <td class="centralizado celula b2 b3 b4">
                          {{item.Valor_saldo - parseFloat(item.Valor_solicitado) | decimal2}}
                        </td>
                        <!-- Seção de Inserção de Nova Nota -->
                        <td class="centralizado celula b2 b3 b4" v-if="usuarioLogado.userType == 'ENTIDADE'">
                          <!-- <g-button-ujarak v-if="parseFloat(item.Valor_saldo - item.Valor_solicitado) > 0 && parseFloat(item.Qtde_saldo - item.Qtde_solicitado) > 0" color="primary" size="button--size-ss" @click.native="toggleEdicao(true, item)" -->
                          <g-button-ujarak v-if="parseFloat(item.Valor_saldo - item.Valor_solicitado) > 0" color="primary" size="button--size-ss" @click.native="toggleEdicao(true, item)"
                                          :title="'<h5>Clique para Inserir um Novo Documento Fiscal</h5>'" v-tippy="{inertia:true, arrow:true, animation:'perspective', distance:'1', size:'large', arrow:true, placement:'bottom'}">
                            <i class="fa fa-plus-circle" aria-hidden="true"></i> Inserir
                          </g-button-ujarak>
                          <div v-else class="prest-max-solicitado">
                            <i>Valores totais já informados.</i>
                          </div>
                        </td>
                      </tr>

                    </template>

                  </template>

                </template>

              </template>

              </tbody>

            </table>
            
            <div class="row-flex all-end prest-valor-total">
                <div class="row-flex all-end">
                  <div class="col-md-12">
                    <span class="prest-valor-total">Valor total do cronograma: <b>{{ cronograma.totais.valor_total_contratado | real }}</b></span>
                  </div>
                </div>
            </div>

          </div>
        </div>

      </div>

      <div v-if="editando" class="column all-start prest-fade" :class="editandoNotaCadastrada ? 'prest-edicao-nota-container':'prest-cadastro-nota-container'" id="solicitacao">
        <div v-if="loading.documentos" class="overlay-loading"><i class="fa fa-refresh fa-spin"></i></div>
        <div class="prest-title" id="cadastroDocumento">
          {{ editandoNotaCadastrada ? 'Edição de Nota' : 'Cadastro de Nota' }} <i class="fa fa-file-text-o" aria-hidden="true"></i>
        </div>
        <div>
          {{nota.fornecedor_tipo}}
        </div>
        <div class="column centered-start prest-nota-atividade-container">
          <div class="prest-atividade-row">
            <i class="fa fa-bookmark"></i> {{ this.nota.itemOrcamento.Atividade_nome }}
          </div>
          <div class="row-flex centered-start prest-atividade-row">
            <span class="prest-id-item">#{{ this.nota.itemOrcamento.Id_item }}</span>
            [{{ this.nota.itemOrcamento.Item }}] {{ this.nota.itemOrcamento.Item_Descricao }} - {{ this.nota.itemOrcamento.Item_Observacao }}
          </div>
          <div class="row-flex centered-start prest-atividade-row">
            <!-- <b>Quantidade Orçada:</b> {{ this.nota.itemOrcamento.Qtde_orcado }} -->
            <b>Valor Orçado:</b> {{ this.nota.itemOrcamento.Valor_orcado | real }}
            <u><b>Saldo Restante:</b> {{ (this.nota.itemOrcamento.Valor_saldo - this.nota.itemOrcamento.Valor_solicitado) - this.nota.valor_documento | real }}</u>
            <!-- <b>Saldo Quantidade:</b> {{ this.nota.itemOrcamento.Qtde_saldo }} -->
          </div>
          <div class="row-flex centered-start prest-atividade-row">
            Período Execução do Projeto: 
            <b>Inicio:</b> {{ dataInicial }} 
            e
            <b>Fim:</b> {{ dataFinal }}
          </div>
        </div>
        <!-- Dados do Documento ------------------------------------------------------------------------------------------------------------------------->
          <div class="box-header">
            <h3 class="box-title">Dados do Documento</h3>
          </div>

          <div class="row-flex w-100">
            <div class="col-md-12">
              <div class="form-group required-field" :class="(errors.first('número da nota') ? ' has-error' : '')">
                <label class="control-label">Descreva o Item do Documento:
                </label>
                <input type="text" v-model="nota.item" class="form-control">
                <span v-if="errors.first('número da nota')" class="label label-danger"> {{ errors.first('número da nota') }}</span>
              </div>
            </div>
            <div class="col-md-12">
              <div class="form-group required-field" :class="(errors.first('número da nota') ? ' has-error' : '')">
                <label class="control-label">Valor:
                </label>
                <money v-model="nota.valor_documento" name="valorNota" class="form-control text-right" type="text" @keyup.native="nota.valor_documento = limitaFaixaEntradaInput('decimal', nota.valor_documento, 0, (nota.itemOrcamento.Valor_saldo - nota.itemOrcamento.Valor_solicitado))"></money>
                <span v-if="errors.first('número da nota')" class="label label-danger"> {{ errors.first('número da nota') }}</span>
              </div>
            </div>
          </div>

          <div class="row-flex w-100">

            <!-- Número do documento -->
            <div class="col-md-12">
              <div class="form-group required-field" :class="(errors.first('número da nota') ? ' has-error' : '')">
                <label class="control-label">Número do Documento (apenas números):
                </label>
                <input v-model="nota.numero_documento" name="número da nota" class="form-control text-right" type="text"
                          v-validate="'required'" @input="formatarNumeroDocumento">
              </input>
                <span v-if="errors.first('número da nota')" class="label label-danger"> {{ errors.first('número da nota') }}</span>
              </div>
            </div>

            <!-- Série -->
            <div class="col-md-12">
              <div class="form-group required-field" :class="{ 'has-error' : errors.first('série')}">
                <label class="control-label">Série:</label>
                <div>
                  <div>
                    <select v-model="nota.serie_documento" class="form-control" name="série" v-validate="'required'">
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
                      <datepicker  name="data de emissão" v-model="nota.data_emissao_documento" input-class="form-control datepicker"
                                  :language="$datePickerPtBR" maxlength="20" :use-utc="true" placeholder="__ /__ /____"
                                  :disabled-dates="{to: new Date(dataInicioSapiens), from: new Date()}"

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
                    <datepicker  v-model="nota.data_validade_documento" input-class="form-control datepicker" 
                                :language="$datePickerPtBR" maxlength="20" :use-utc="true" placeholder="__ /__ /____"
                                format="dd/MM/yyyy">
                    </datepicker>
                  </div>
                </div>
              </div>

            </div>

          </div>




        <!-- Dados do Fornecedor ------------------------------------------------------------------------------------------------------------------->
        <div class="column all-start prest-cadastro-nota-container" id="solicitacao">
          <div class="box-header">
            <h3 class="box-title">Fornecedor</h3>
          </div>
          <div v-if="loading.tela" class="overlay-loading"><i class="fa fa-refresh fa-spin"></i></div>
          <div class="row-flex w-100">
            <div class="col-md-12">
              <!-- Tipo de pessoa (Jurídica ou Fisica) -->
              <div class="form-group required-field" :class="{'has-error': errors.first('tipo de pessoa')}">
                <label class="control-label">Tipo de pessoa:</label>
                <div>
                  <div>
                    <select v-model="nota.fornecedor_tipo" name="tipo de pessoa" class="form-control" v-validate="'required'"
                            @change="bloqueiaCamposFornecedorExistente = false, nota.fornecedor_nome = '', nota.fornecedor_cep = '', nota.fornecedor_endereco = '', nota.fornecedor_cpf_cnpj = '', nota.fornecedor_codigo = ''"
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
              <div v-if="nota.fornecedor_tipo === 'Pessoa Jurídica'" class="form-group required-field" :class="{'has-error': errors.first('cnpj')}">
                <label class="control-label">CNPJ:</label>
                <div>
                  <div class="row-flex">
                    <the-mask v-model="nota.fornecedor_cpf_cnpj" name="cnpj" class="form-control" :mask="['##.###.###/####-##']"
                              :disabled="bloqueiaCamposFornecedorExistente"
                              @blur.native="verificaCpfCnpjSapiens(nota.fornecedor_cpf_cnpj)" type="text" v-bind:style="usuarioLogado.userType === 'FUNDACAO' ? 'width: 65%; float: left' : ''"
                              v-validate="false">
                    </the-mask>
                    <input type="text" v-if="usuarioLogado.userType === 'FUNDACAO'" class="form-control" disabled="disabled" style="width: 35%; float: left; margin-left: 1%; " :value="nota.fornecedor_codigo">
                  </div>
                  <span v-if="errors.first('cnpj')" class="label label-danger"> {{ errors.first('cnpj') }}</span>
                  <span v-if="errors.first('cnpj vinculado a dirigente')" class="label label-danger"> {{ errors.first('cnpj vinculado a dirigente') }}</span>
                </div>
              </div>

              <!-- CPF -->
              <div v-if="nota.fornecedor_tipo === 'Pessoa Física'" class="form-group required-field" :class="{'has-error': errors.first('cpf')}">
                <label class="control-label">CPF:</label>
                <div>
                  <div>
                    <the-mask v-model="nota.fornecedor_cpf_cnpj" name="cpf" class="form-control" :mask="['###.###.###-##']"
                              :disabled="bloqueiaCamposFornecedorExistente"
                              @blur.native="verificaCpfCnpjSapiens(nota.fornecedor_cpf_cnpj)" type="text" v-bind:style="usuarioLogado.userType === 'FUNDACAO' ? 'width: 65%; float: left' : ''"
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
              <div class="form-group required-field" v-if="_.has(nota, 'fornecedor_tipo') && !_.isNull(nota.fornecedor_tipo)" :class="{'has-error': errors.first('nome')}">
                <label class="control-label">Nome:</label>
                <div>
                  <div>
                    <input v-model="nota.fornecedor_nome" name="nome" class="form-control" type="text"
                          :disabled="bloqueiaCamposFornecedorExistente"
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
              <div  class="form-group required-field" v-if="_.has(nota, 'fornecedor_tipo') && !_.isNull(nota.fornecedor_tipo)" :class="{'has-error': errors.first('endereço')}">
                <label class="control-label">Endereço:</label>
                <div>
                  <div>
                    <input v-model="nota.fornecedor_endereco" name="endereço" class="form-control" type="text"
                          :disabled="bloqueiaCamposFornecedorExistente"
                          v-validate="'required|max:255'">
                  </div>
                  <span v-if="errors.first('endereço ')" class="label label-danger"> {{ errors.first('endereço') }}</span>
                </div>
              </div>
            </div>
            <div class="col-md-12">
              <!-- CEP -->
              <div class="form-group required-field" v-if="_.has(nota, 'fornecedor_tipo') && !_.isNull(nota.fornecedor_tipo)" :class="{'has-error': errors.first('cep')}">
                <label class="control-label">CEP:</label>
                <div>
                  <div>
                    <the-mask  v-model="nota.fornecedor_cep" name="cep" :mask="['#####-###']" class="form-control"
                              :disabled="bloqueiaCamposFornecedorExistente"
                              @blur.native="procurandoCidadeUF" v-validate="'required'">
                    </the-mask>
                  </div>
                  <span v-if="errors.first('cep')" class="label label-danger"> {{ errors.first('cep') }}</span>
                </div>
              </div>
            </div> 
          </div>
          <div class="col-md-12">
            <div v-if="nota.cidadeFornecedor" class="prest-municipio">
              <i class="fa fa-map-marker" aria-hidden="true"></i> 
              {{nota.cidadeFornecedor}} {{(nota.estadoFornecedor) ? ' / ' + nota.estadoFornecedor : ''}}
            </div>
          </div>
          <div class="box-body prest-upload-container">
            <h4 class="prest-box-title row-flex centered-start">Documento Fiscal <i class="fa fa-paperclip" aria-hidden="true" ></i></h4>
            <uploadDocumentosPhpPrestacao :propDocumentos="nota.anexos" :documentTypes="''" :local-uso="'SOLICITACAO_PAGAMENTO'" :desvinculaAnexo="desvinculaAnexo" :restricaoArquivo="true"></uploadDocumentosPhpPrestacao>
          </div>

        </div>

          <!-- Aviso aos Usuários

          Ao cadastrar um documento que já existe, informe apenas o valor do ITEM da nota fiscal. Utilize o formato abaixo:

          Exemplo: Nota Fiscal 11 com vários itens:

          Item 1: Valor do item 1, Número da nota 11A
          Item 2: Valor do item 2, Número da nota 11B
          Item 3: Valor do item 3, Número da nota 11C 
          Vamos criar esse aviso abaixo
          -->
          <div class="column start-centered prest-aviso-repetido-container" v-if="notaJaCadastradaNestaPrestacao">
            <div class="row-flex start-between prest-aviso-close">
              <h3><strong><i class="fa fa-exclamation-triangle" aria-hidden="true"></i> Atenção</strong></h3>
              <i class="fa fa-close" aria-hidden="true" style="cursor: pointer;" @click="notaJaCadastrada = false"></i>
            </div>
            <div>
              Atenção! Este documento já foi lançado anteriormente:
              <!-- Checkbox de ciencia -->
               <div class="row-flex centered-start prest-checkbox-container">
                 <div class="f-required">
                   Há necessidade de lançar novamente:
                  </div>
                  <input type="checkbox" v-model="notaRepetida.necessidade" id="notaJaCadastrada" name="notaJaCadastrada" class="form-check-input" @change="verificaValidacao()">
               </div>
               <div class="row-flex centered-start prest-checkbox-container">
                 <div class="f-required">
                   Está ciente da responsabilidade pelas informações prestadas:
                  </div>
                  <input type="checkbox" v-model="notaRepetida.responsabilidade" id="notaJaCadastrada" name="notaJaCadastrada" class="form-check-input" @change="verificaValidacao()">
               </div>
               <div>
                *Informe apenas o valor do ITEM da nota fiscal.
               </div>
              <br/>
            </div>
            <!-- <div>
              Caso seja necessário cadastrar um documento que já existe na base de dados por conta de diversos itens que podem estar discriminados na nota fiscal, informe apenas o valor do ITEM da nota fiscal. Utilize o formato abaixo:
            </div>
            <div>
              Exemplo: Nota Fiscal de número <b>11</b> com vários itens que se enquadram em atividades e itens de orçamento diferentes:
            </div>
            <div>
              - Item <b>1</b>: Valor do item 1; Número da nota: <b>11A</b>.
            </div>
            <div>
              - Item <b>2</b>: Valor do item 2; Número da nota: <b>11B</b>.
            </div>
            <div>
              - Item <b>3</b>: Valor do item 3; Número da nota: <b>11C</b>.
            </div> -->
          </div>

        <div class="row-flex centered-start prest-button-container">
          <g-button-ujarak :color="editandoNotaCadastrada ? 'primary' : 'success'" size="button--size-ss" @click.native="salvarNota()"
                        :title="editandoNotaCadastrada ? '<h5>Clique para Salvar Edição</h5>' : '<h5>Clique para Adicionar a Nota</h5>'" v-tippy="{inertia:true, arrow:true, animation:'perspective', distance:'1', size:'large', arrow:true, placement:'bottom'}">
            <i :class="editandoNotaCadastrada ? 'fa fa-save' : 'fa fa-plus-circle'" aria-hidden="true"></i> {{ editandoNotaCadastrada ? 'Salvar Edição' : 'Adicionar'}}
          </g-button-ujarak>
          <g-button-ujarak color="warning" size="button--size-ss" @click.native="toggleEdicao(false, null, true)"
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
    import uploadDocumentosPhpPrestacao from './uploadDocumentosPhpPrestacao.vue'
    // import BankAccountValidator from 'br-bank-account-validator'
    import { cpf, cnpj } from 'cpf-cnpj-validator'
    export default {
      components: {
        uploadDocumentosPhpPrestacao
      },
      name: 'cronogramaGED',
      data () {
        return {
          loading: {
            tela: false,
            documentos: false
          },
          moment: moment,
          notaRepetida: {
            necessidade: false,
            responsabilidade: false
          },
          layoutExtrato: 'classico',
          processo: 'PRESTACAO_DE_CONTAS',
          editando: false,
          notaJaCadastrada: false,
          notaJaCadastradaNestaPrestacao: false,
          editandoNotaCadastrada: false,
          cancelandoEdicao: false,
          nota: {
            fk_prestacao_simplificada: null,
            numero_documento: null,
            serie_documento: null,
            data_emissao_documento: null,
            data_validade_documento: null,
            valor_documento: null,
            fornecedor_tipo: null,
            fornecedor_cpf_cnpj: null,
            fornecedor_nome: null,
            fornecedor_endereco: null,
            fornecedor_cep: null,
            fornecedor_codigo: null,
            cidadeFornecedor: null,
            estadoFornecedor: null,
            item: null,
            item_cronograma: null,
            fk_item_cronograma: null,
            anexos: []
          },
          notaBackup: {},
          extratoFiltrosSelecionados: [],
          entidade: {},
          projeto: {},
          restricaoParaConcluir: []
        }
      },
      props: {
        cronograma: Object,
        setNota: Function,
        dataInicioSapiens: String,
        dataInicial: String,
        dataFinal: String,
        cnpjEntidade: String,
        fkPrestacaoSimplificada: Number,
        notasCadastradas: Array,
        acertoValoresCancelamentoEdicaoCronograma: Function,
        idEntidade: Number
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
        this.addErrors()
      },
      mounted: function () {
      },
      methods: {
        initEdicao (nota) {
          this.nota = _.cloneDeep(nota)
          this.notaBackup = _.cloneDeep(nota)
          this.cronograma.itens.forEach((item) => {
            if (String(item.Id_item) === String(this.nota.fk_item_cronograma)) {
              this.nota.itemOrcamento = _.cloneDeep(item)
            }
          })
          this.nota.valor_documento = parseFloat(this.nota.valor_documento)
          this.loading.documentos = false
          this.loading.tela = false
          this.editando = true
          this.editandoNotaCadastrada = true
          this.scrollToDiv()
          // Encontra item de orçamento
        },
        verificaValidacao () {
          // Verifica se os dois checkbox estão marcados
          if (this.notaRepetida.necessidade && this.notaRepetida.responsabilidade) {
            this.$validator.validateAll().then((result) => {
              if (result) {
                this.notaJaCadastradaNestaPrestacao = false
                // Pega o número da nota e adiciona um sufixo para diferenciar, de A a Z depois de A1 a A1, A2, A3...
                let sufixo = this.pegaProximoSulfixoNota()
                this.nota.numero_documento = this.nota.numero_documento + sufixo
                this.$snotify.success('Sulfixo adicionado a nota, tente adicionar novamente.')
              } else {
                this.$snotify.warning('Por favor, preencha os campos obrigatórios.')
              }
            })
          } else {
            this.$snotify.warning('Por favor, marque os dois campos de ciência.')
          }
        },
        async desvinculaAnexo (idAnexo) {
          console.log('desvinculando anexo')
          this.loading.documentos = true
          await axiosLaravel.post('prestacaoSimplificada/desvinculaAnexo/' + idAnexo).then((response) => {
            if (response.data.codigo === 'OK') {
              this.$snotify.success('Anexo excluído com sucesso')
              // remove anexo da lista de anexos da nota
              this.nota.anexos = _.filter(this.nota.anexos, function (anexo) {
                return anexo.id !== idAnexo
              })
              this.loading.documentos = false
            } else {
              this.$snotify.error(response.data.mensagem)
            }
          })
            .catch((error) => {
              console.error(error)
              this.loading.documentos = false
              this.$snotify.clear()
              this.$root.trataErro(error)
            })
        },
        pegaProximoSulfixoNota () {
          let sulfixo = ''
          let numeroDocumento = this.nota.numero_documento
          // Regex pra pegar número base + sufixo
          // Ex: 12345A => base: 12345, sufixo: A
          let regexNumero = /^(\d+)([A-Z]\d*|)$/ // Pega prefixo numérico e sufixo (A, A1, ...)
          let matchNota = numeroDocumento.match(regexNumero)
          let numeroBase = matchNota ? matchNota[1] : numeroDocumento
          // Filtra notas que têm mesmo número base e mesmo CNPJ
          let notasComMesmoNumero = this.notasCadastradas.filter(nota => {
            let match = nota.numero_documento.match(regexNumero)
            let baseNota = match ? match[1] : nota.numero_documento
            return baseNota === numeroBase && nota.fornecedor_cpf_cnpj === this.nota.fornecedor_cpf_cnpj
          })
          if (notasComMesmoNumero.length === 0) {
            return 'A'
          }
          // Pega todos os sufixos encontrados (A, A1, ...)
          let sufixos = notasComMesmoNumero.map(nota => {
            let match = nota.numero_documento.match(regexNumero)
            return match ? match[2] || '' : ''
          })
          sufixos = sufixos.filter(s => s) // Remove vazios
          console.log('Sufixos limpos:', sufixos)
          // Ordena (A, B, ..., Z, A1, A2, ...)
          sufixos.sort((a, b) => {
            const regex = /^([A-Z])(\d*)$/
            const matchA = a.match(regex)
            const matchB = b.match(regex)
            if (matchA && matchB) {
              if (matchA[1] !== matchB[1]) {
                return matchA[1].localeCompare(matchB[1])
              }
              const numA = parseInt(matchA[2] || '0', 10)
              const numB = parseInt(matchB[2] || '0', 10)
              return numA - numB
            }
            return a.localeCompare(b)
          })
          let ultimoSufixo = sufixos[sufixos.length - 1]
          console.log('Último sufixo limpo:', ultimoSufixo)
          // Calcula o próximo
          if (/^[A-Z]$/.test(ultimoSufixo)) {
            if (ultimoSufixo === 'Z') {
              sulfixo = 'A1'
            } else {
              sulfixo = String.fromCharCode(ultimoSufixo.charCodeAt(0) + 1)
            }
          } else if (/^[A-Z]\d+$/.test(ultimoSufixo)) {
            let letra = ultimoSufixo.charAt(0)
            let numero = parseInt(ultimoSufixo.substring(1), 10)
            sulfixo = letra + (numero + 1)
          } else {
            sulfixo = 'A'
          }
          console.log('Próximo sufixo:', sulfixo)
          return sulfixo
        },
        toggleEdicao (valor, item = null, cancelando = false) {
          if (this.editandoNotaCadastrada && cancelando) {
            this.acertoValoresCancelamentoEdicaoCronograma(this.notaBackup)
          }
          this.loading.documentos = false
          this.loading.tela = false
          this.editandoNotaCadastrada = false
          this.editando = valor
          // Limpa Campos
          this.limparCamposNota()
          console.log('TOGGLE EDICAO')
          // Inicializa valores
          if (valor) {
            // Qual Atividade e Qual item de orçamento a nota está sendo registrada
            this.nota.itemOrcamento = _.cloneDeep(item)
            this.notaRepetida.necessidade = false
            this.notaRepetida.responsabilidade = false
            this.scrollToDiv()
          }
        },
        scrollToDiv () {
          setTimeout(() => {
            const element = document.getElementById('cadastroDocumento')
            if (element) {
              const elementPosition = element.getBoundingClientRect().top + window.pageYOffset
              const offset = -200
              const targetPosition = elementPosition + offset
              window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
              })
            }
          }, 200)
        },
        addErrors (field) {
          this.$validator.extend('required', {
            getMessage: (field) => {
              return 'Campo obrigatório'
            },
            validate: (value) => {
              return !!value
            }
          })
        },
        // TODO HOJE - LIMPAR
        limparCamposNota () {
          this.nota = {
            fk_prestacao_simplificada: null,
            numero_documento: null,
            serie_documento: null,
            data_emissao_documento: null,
            data_validade_documento: null,
            valor_documento: 0,
            fornecedor_tipo: null,
            fornecedor_cpf_cnpj: null,
            fornecedor_nome: null,
            fornecedor_endereco: null,
            fornecedor_cep: null,
            fornecedor_codigo: null,
            cidadeFornecedor: null,
            estadoFornecedor: null,
            item: null,
            item_cronograma: null,
            fk_item_cronograma: null,
            anexos: []
          }
          this.notaBackup = {}
        },
        async salvarNota () {
          // Valida Campos
          this.loading.documentos = true
          let validacao = await this.validaCamposNota()
          if (validacao === false) {
            this.loading.documentos = false
            return
          }
          // Pega Demais dados para complementar
          this.nota.fk_prestacao_simplificada = this.fkPrestacaoSimplificada
          this.nota.fk_item_cronograma = this.nota.itemOrcamento.Id_item
          this.nota.item_cronograma = this.nota.itemOrcamento.Item + ' / ' + this.nota.itemOrcamento.Item_Descricao
          if (this.nota.data_emissao_documento) {
            this.nota.data_emissao_documento = moment(this.nota.data_emissao_documento).format('YYYY-MM-DD')
          }
          if (this.nota.data_validade_documento) {
            this.nota.data_validade_documento = moment(this.nota.data_validade_documento).format('YYYY-MM-DD')
          }
          let usuario = this.usuarioLogado.userType === 'FUNDACAO' ? this.usuarioLogado.ds_nome_usuario + ' (' + this.usuarioLogado.ds_login + ')' : this.usuarioLogado.ds_nome_usuario
          // Salva nota na base
          let obj = {
            idProposta: this.$route.params.id,
            nota: this.nota,
            usuario: usuario
          }
          // Verifica se é um novo registro ou uma atualização:
          if (this.editandoNotaCadastrada) {
            let alteracao = this.verificarCamposAlterados()
            if (alteracao === false) {
              this.loading.documentos = false
              this.$snotify.warning('Não foram encontradas diferenças de Edição. Clique em CANCELAR ou verifique os campos e tente novamente.')
              return
            }
            obj = {
              idProposta: this.$route.params.id,
              nota: this.nota,
              notaBackup: this.notaBackup,
              usuario: usuario
            }
            this.$snotify.async('Editando Alterações no Documento Fiscal. Por favor, aguarde...', {timeout: 0})
            await axiosLaravel.post('prestacaoSimplificada/atualizaNota', obj).then((response) => {
              if (response.data.codigo === 'OK') {
                this.$snotify.clear()
                this.$snotify.success('Nota atualizada com sucesso')
                console.log('response', response.data)
                // Retorna a nota com o ID gravado na base
                this.nota = response.data.nota
                // Adiciona a nota na lista de notas cadastradas (componente pai)
                this.setNota(this.nota, true)
                this.toggleEdicao(false)
                this.loading.documentos = false
              } else {
                this.$snotify.error(response.data.mensagem)
              }
            })
              .catch((error) => {
                console.error(error.data)
                if (error.response.status === 413) {
                  this.$snotify.error('O tamanho do arquivo é muito grande. O tamanho máximo permitido é de 4MB.')
                } else {
                  this.$snotify.error('Erro ao tentar salvar a nota. Tente novamente mais tarde.')
                }
                this.loading.documentos = false
                this.$snotify.clear()
                this.$root.trataErro(error)
              })
            return
          } else {
            this.$snotify.async('Gravando Documento Fiscal. Por favor, aguarde...', {timeout: 0})
            await axiosLaravel.post('prestacaoSimplificada/gravaNota', obj).then((response) => {
              if (response.data.codigo === 'OK') {
                this.$snotify.clear()
                this.$snotify.success('Nota adicionada com sucesso')
                console.log('response', response.data)
                // Retorna a nota com o ID gravado na base
                this.nota = response.data.nota
                // Adiciona a nota na lista de notas cadastradas (componente pai)
                this.setNota(this.nota, false)
                this.toggleEdicao(false)
                this.loading.documentos = false
              } else {
                this.loading.documentos = false
                this.$snotify.error(response.data.mensagem)
              }
            })
              .catch((error) => {
                this.loading.documentos = false
                console.error(error.data.status)
                if (error.response.status === 413) {
                  this.$snotify.error('O tamanho do arquivo é muito grande. O tamanho máximo permitido é de 4MB.')
                } else {
                  this.$snotify.error('Erro ao tentar salvar a nota. Tente novamente mais tarde.')
                }
                this.$snotify.clear()
                this.$root.trataErro(error)
              })
          }
          // this.toggleEdicao(false)
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
        limitaFaixaEntradaInput (tipo, valor, minimo, maximo) {
          if (_.isNil(valor) && _.isNull(valor) && _.isNaN(valor)) {
            valor = minimo
          } else {
            if (tipo === 'inteiro') {
              valor = _.toSafeInteger(('' + valor).replace(/\D+/g, ''))
            } else if (tipo === 'decimal') {
              valor = _.toNumber(('' + valor).replace(/[^.0-9]+/g, ''))
            }
            console.log(valor, maximo)
            if (valor > maximo) {
              this.$snotify.warning('Valor máximo permitido é R$' + maximo.toFixed(2))
              return 0
            }
            valor = valor <= minimo ? minimo : (valor >= maximo ? maximo : valor)
          }
          return tipo === 'inteiro' ? parseInt(valor) : tipo === 'decimal' ? parseFloat(valor) : valor
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
                this.nota.fornecedor_endereco = response.data.EndFor
                this.nota.fornecedor_nome = response.data.NomFor
                this.nota.fornecedor_cep = response.data.CepFor
                this.nota.fornecedor_codigo = response.data.CodFor
                this.bloqueiaCamposFornecedorExistente = true
                this.procurandoCidadeUF()
              }
              this.loading.tela = false
              this.$forceUpdate()
            })
              .catch((error) => {
                this.loading.tela = false
                console.error(error)
                this.$snotify.clear()
              })
          }
        },
        // verificaCnpjEmpresaLigada (cnpj) {
        //   // Verificará se o CNPJ está em lista de empresas ligadas aos dirigentes da entidade parceira nos últimos 12 meses após seu desligamento, se houver
        //   console.log('verificaCnpjEmpresaLigada', cnpj)
        //   this.loading.tela = true
        //   axiosLaravel.post('consulta/empresas-ligadas', {'id': this.idProjeto, 'cnpj': cnpj}).then((response) => {
        //     console.log(response.data)
        //     if (_.has(response.data, 'codigo') && response.data.codigo === 'OK') {
        //       let qtdeDirigentesEmpresasLigadas = response.data.retorno
        //       this.errors.remove('cnpj vinculado a dirigente')
        //       if (qtdeDirigentesEmpresasLigadas > 0) {
        //         this.errors.add({field: 'cnpj vinculado a dirigente', rule: 'cnpj_empresa_ligada', msg: 'Não pode usar esse CNPJ, pois esta vinculado a ' + (qtdeDirigentesEmpresasLigadas + ' ' + (qtdeDirigentesEmpresasLigadas > 1 ? 'dirigentes' : 'dirigente'))})
        //       }
        //       this.adicionaRestricao({'tag': 'temEmpresaLigada', 'ativo': qtdeDirigentesEmpresasLigadas > 0, 'tipo': 'restricao', 'acao': null, 'mensagem': 'Não pode prosseguir com esse CNPJ, pois está vinculado a ' + (qtdeDirigentesEmpresasLigadas + ' ' + (qtdeDirigentesEmpresasLigadas > 1 ? 'dirigentes ativos' : 'dirigente ativo')) + ' a menos de 12 meses'})
        //     } else {
        //       this.$snotify.error(response.data.mensagem)
        //     }
        //     this.$forceUpdate()
        //     this.loading.tela = false
        //   })
        //     .catch((error) => {
        //       this.loading.tela = false
        //       console.log('error', error)
        //       this.$root.trataErro(error)
        //     })
        // },
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
          if (this.nota.fornecedor_cep) {
            axiosLaravel.get('municipios/cep/' + this.nota.fornecedor_cep).then((response) => {
              if (!_.isEmpty(response.data) && !_.isString(response.data)) {
                this.nota.cidadeFornecedor = response.data.ds_nome
                this.nota.estadoFornecedor = response.data.ds_uf
                this.$forceUpdate()
              }
            })
              .catch((error) => {
                this.$root.trataErro(error)
                this.$forceUpdate()
              })
          } else {
            this.nota.cidadeFornecedor = ''
            this.nota.estadoFornecedor = ''
            this.$forceUpdate()
          }
        },
        adicionaRestricao (ev) {
          if (!_.isNil(ev) && _.has(ev, 'tag')) {
            // Se já existe, remova da lista
            _.remove(this.restricaoParaConcluir, function (i) {
              return i.tag === ev.tag
            })
            // Adiciona a restrição
            this.restricaoParaConcluir.push(ev)
          }
        },
        removeRestricao (ev) {
          _.remove(this.restricaoParaConcluir, function (i) {
            return i.tag === ev.tag
          })
        },
        async validaCamposNota () {
          // Verificaçoes: ============================================================================
          // 1 - Verifica se já existe nota cadastrada com o mesmo número
          // 2 - Verifica se está dentro do limite máximo de cada conta financeira  // Automático no input
          // 3 - Verifica se a emissão está dentro do prazo de execução do projeto
          // 4 - Verifica se existe documento anexado
          // N - Demais verificações que já são feitas
          // ===========================================================================================
          // 0 - Verifica se campos da nota estão preenchidos (conforme os controles)
          this.notaJaCadastrada = false
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
          // 00 - Verifica se nota já existe no Sapiens
          // Verifica se é edicao e se mudou o numero da nota
          // 1 - Verifica se já existe nota cadastrada com o mesmo número e mesmo cpf/cnpj do fornecedor
          if (this.notasCadastradas.length > 0) {
            let notaExistente = this.notasCadastradas.find((item) => {
              return item.numero_documento === this.nota.numero_documento && item.fornecedor_cpf_cnpj === this.nota.fornecedor_cpf_cnpj
            })
            if (notaExistente && !this.editandoNotaCadastrada) {
              this.notaJaCadastradaNestaPrestacao = true
              this.$snotify.error('Já existe uma nota cadastrada com o mesmo número: ' + this.nota.numero_documento + ' e mesmo CPF/CNPJ do fornecedor: ' + this.nota.fornecedor_cpf_cnpj)
              return false
            }
          }

          let notaExisteSapiens = false
          if (!this.editandoNotaCadastrada || (this.editandoNotaCadastrada && this.nota.numero_documento !== this.notaBackup.numero_documento)) {
            notaExisteSapiens = await this.verificaExisteNota()
            console.log('NOTA EXISTE NO SISTEMA', notaExisteSapiens)
            if (notaExisteSapiens) {
              return false
            }
          }
          console.log('NOTA NAO EXISTE NO SISTEMA')
          // Verificará se o CNPJ está em lista de empresas ligadas aos dirigentes da entidade parceira nos últimos 12 meses após seu desligamento, se houver
          console.log('verificaCnpjEmpresaLigada', this.nota.fornecedor_tipo)
          if (this.nota.fornecedor_tipo === 'Pessoa Jurídica') {
            let temEmpresaLigada = false
            temEmpresaLigada = await this.verificaEmpresaLigada()
            console.log('temEmpresaLigada', temEmpresaLigada)
            if (temEmpresaLigada) {
              return false
            }
          } else if (this.nota.fornecedor_tipo === 'Pessoa Física') {
            let cpfVinculadoEntidade = false
            // Verifica se o CPF é válido
            cpfVinculadoEntidade = await this.validaDirigentes()
            console.log('cpfVinculadoEntidade', cpfVinculadoEntidade)
            if (cpfVinculadoEntidade) {
              return false
            }
          }

          // 3 - Verifica se a emissão está dentro do prazo de execução do projeto
          if (this.nota.data_emissao_documento) {
            let dataEmissao = moment(this.nota.data_emissao_documento).utc()
            // let dataInicio = moment(this.projeto.dateInicioSapiens).utc()
            // let dataFim = moment(this.projeto.dateFimSapiens).utc()
            if (moment(dataEmissao, 'DD/MM/YYYY').isBefore(moment(this.dataInicial, 'DD/MM/YYYY')) || moment(dataEmissao, 'DD/MM/YYYY').isAfter(moment(this.dataFinal, 'DD/MM/YYYY'))) {
              this.$snotify.error('Data de Emissão da Nota fora do prazo de execução do projeto')
              return false
            }
          }
          // 4 - Verifica se foram anexados documentos
          if (this.nota.anexos.length === 0) {
            this.$snotify.error('Anexe o documento fiscal.')
            return false
          }
          return true
        },
        async verificaExisteNota () {
          // Verifica se já existe nota cadastrada no sistema
          if (this.notaRepetida.necessidade && this.notaRepetida.responsabilidade) {
            return false
          }
          this.$snotify.async('Verificando se já existe nota cadastrada no sistema...', {timeout: 0})
          let obj = {
            nota: this.nota
          }
          try {
            const resp = await axiosLaravel.post('prestacaoSimplificada/verificaExisteNota', obj)
            this.$snotify.clear()
            console.log('RESPONSE: ', resp.data)
            if (resp.data.codigo === 'OK') {
              return false
            } else {
              this.$snotify.error(resp.data.mensagem)
              return true
            }
          } catch (error) {
            this.$snotify.clear()
            console.error(error)
            // pega o status do error
            console.log('ERROR', error.response.status)
            if (error.response.status === 413) {
              this.$snotify.error('O tamanho do arquivo é muito grande. O tamanho máximo permitido é de 4MB.')
            } else {
              this.$snotify.error('Erro ao tentar salvar a nota. Tente novamente mais tarde.')
            }
            return true
          }
        },
        async verificaEmpresaLigada () {
          // Verifica se o CNPJ está em lista de empresas ligadas aos dirigentes da entidade parceira nos últimos 12 meses após seu desligamento, se houver
          this.$snotify.async('Verificando se o CNPJ está em lista de empresas ligadas aos dirigentes da entidade parceira nos últimos 12 meses após seu desligamento...', {timeout: 0})
          let obj = {
            id: this.idEntidade,
            cnpj: this.nota.fornecedor_cpf_cnpj
          }
          try {
            const resp = await axiosLaravel.post('prestacaoSimplificada/verificaEmpresaLigada', obj)
            this.$snotify.clear()
            console.log('RESPONSE: ', resp.data)
            if (resp.data.codigo === 'OK') {
              if (resp.data.retorno > 0) {
                this.$snotify.error('CNPJ vinculado a dirigente ativo, não é possível cadastrar.')
                return true
              } else {
                return false
              }
            } else {
              this.$snotify.error(resp.data.mensagem)
              return true
            }
          } catch (error) {
            this.$snotify.clear()
            console.error(error)
            this.$root.trataErro(error)
            return true
          }
        },
        async validaDirigentes () {
          // Verifica se o CPF é válido
          this.$snotify.async('Verificando CPF do Fornecedor...', {timeout: 0})
          let obj = {
            cpf: this.nota.fornecedor_cpf_cnpj,
            cnpj: this.cnpjEntidade
          }
          try {
            const resp = await axiosLaravel.post('prestacaoSimplificada/validaDirigentes', obj)
            this.$snotify.clear()
            console.log('RESPONSE: ', resp.data)
            if (resp.data.codigo === 'OK') {
              return false
            } else {
              this.$snotify.error(resp.data.mensagem)
              return true
            }
          } catch (error) {
            this.$snotify.clear()
            console.error(error)
            this.$root.trataErro(error)
            return true
          }
        },
        verificarCamposAlterados () {
          console.log('Verificando campos alterados')
          console.log('NOTA', this.nota)
          console.log('NOTA BACKUP', this.notaBackup)
          let diferencas = this.encontrarDiferencas(this.nota, this.notaBackup)
          console.log('DIFS JS', diferencas)
          if (Object.keys(diferencas).length > 0) {
            return true
          }
          return false
        },
        encontrarDiferencas (obj1, obj2) {
          const difs = {}
          for (const key in obj1) {
            if (String(obj1[key]) !== String(obj2[key])) {
              difs[key] = { valor1: obj1[key], valor2: obj2[key] }
            }
          }
          _.unset(difs, 'itemOrcamento')
          return difs
        },
        formatarNumeroDocumento (event) {
          let valor = event.target.value
          // Remove tudo que não for número
          valor = valor.replace(/\D/g, '')
          // Remove zeros à esquerda
          valor = valor.replace(/^0+/, '')
          // Atualiza o v-model
          this.nota.numero_documento = valor
        }
      }
    }
  </script>
  
  <style src="../../../../static/css/prestacaoContasNovo.css">
  </style>
  