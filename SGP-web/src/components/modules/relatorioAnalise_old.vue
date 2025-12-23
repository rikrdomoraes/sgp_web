<template>

  <div class="content-wrapper" style="min-height: 870px;">
    <section class="content-header">
      <h1>Relatório de Análise
        <span v-if="!loading.show">
            <g-button-ujarak color="primary" @click.native="gravaRelatorio" type="button" v-if="!somenteLeitura"><i class="fa fa-floppy-o" aria-hidden="true"></i> Salvar</g-button-ujarak>
            <!-- Demanda 64783 - Inclusão do risco da proposta na visualização do relatório - correção -->
            <g-button-ujarak color="success" @click.native="calculaRisco" type="button" v-if="!somenteLeitura && _.includes([3], faixaDoProjeto.faixa)"><i class="fa fa-calculator" aria-hidden="true"></i> Calcular Risco</g-button-ujarak>
            <g-button-ujarak color="warning" @click.native="imprimirRelatorio" size="button--size-ss"><i class="fa fa-print" aria-hidden="true"></i> Imprimir </g-button-ujarak>
            <div class="btn-group" style="margin-bottom: -5px">
              <button type="button" class="btn btn-danger btn-sm"><i class="fa fa-sign-out" aria-hidden="true"></i>Sair</button>
              <button type="button" class="btn btn-danger dropdown-toggle btn-sm" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                <span class="caret"></span>
                <span class="sr-only">Toggle Dropdown</span>
              </button>
              <ul class="dropdown-menu">
                <li><a href="#" @click="closewindow(true)"><i class="fa fa-floppy-o" aria-hidden="true"></i>Sair e SALVAR</a></li>
                <li><a href="#" @click="closewindow(false)"><i class="fa fa-sign-out" aria-hidden="true"></i>Sair SEM SALVAR</a></li>
              </ul>
            </div>
        </span>
        <span v-else><i class="fa fa-refresh fa-spin" style="font-size: 30px"></i></span>
        <br/>
        <span v-if="proposta.ds_codigo_projeto_erp == null" class="alertaCamposPendentes"> {{proposta.ds_codigo_projeto_erp}}ALERTA: Após o preenchimento da proposta e geração do número de projeto o relatório disponibilizará todos os seus efetivos campos.</span>
      </h1>
      <b-breadcrumb :items="[{text: 'Validação',href: '/'}, {text: 'Propostas',href: '#'}, {text: 'Relatório de Análise',active: true}]"/>
    </section>

    <!-- main content -->
    <section class="content ng-scope">

      <div class="row">

        <div id="relatorio_analise">

          <div class="col-md-12">
            <fieldset :disabled="proposta.ds_fase !== 'ANALISE'">

              <div class="box box-primary">
                <div class="box-header">
                  <div v-show="loading.show" class="overlay" style="position: absolute; top: 0px; left: 0px; width: 100%; height: 100%; display: block;"><i class="fa fa-refresh fa-spin"></i></div>

                  <table class="w100">
                    <tr>
                      <td class="w30">
                        <img src="/static/img/logo-login.png" class="logo_relatorio">
                      </td>
                      <td class="w50">
                        <h4 class="titulo ressaltar">
                          <span style="font-size: 20px !important; font-family: sans-serif;">RELATÓRIO DE ANÁLISE</span>
                          <br/><br/>
                          <!--Suporte 65284 <span v-if="ehVoluntariado">Alçada de Gerentes de Divisão</span>-->
                          <span v-if="_.get(proposta, 'rating.consultas.PEP', 0) > 0">Alçada do Comitê Estratégico</span>
                          <span v-else-if="ehVoluntariado">Alçada do Comitê de Desenvolvimento Social</span>
                          <span v-else>Alçada do {{faixaDoProjeto.alcada}}</span>
                        </h4>
                      </td>
                      <td class="w20" v-if="proposta.ds_codigo_projeto_erp">
                        <h4 class="ressaltar text-right" style="font-size: 28px !important; text-transform: uppercase;">Projeto nº {{proposta.ds_codigo_projeto_erp}}</h4>
                      </td>
                    </tr>
                  </table>


                  <div v-if="_.includes([3], faixaDoProjeto.faixa) || ehPis || ehVoluntariado">
                    <div class="titulo nao_imprimir alertaCamposPendentes">Modelo de Relatório de Análise para projetos {{ehPIS ? 'do PIS' : (ehVoluntariado ? 'de Voluntariado' : '')}} entre {{faixaDoProjeto.de | real}} à {{faixaDoProjeto.para | real}}</div>
                  </div>
                  <div v-if="_.includes([1,2], faixaDoProjeto.faixa)">
                    <div class="titulo nao_imprimir alertaCamposPendentes">Modelo de Relatório de Análise para projetos até {{faixaDoProjeto.para | real}}</div>
                  </div>


<!-- Lista de Projetos --------------------------------------------------------------------------------------------->
                  <div class="box-body" v-if="false"> <!-- Desativado a pedido de Thiago -->
                    <label class="control-label">Projetos da Entidade</label>
                    <!-- grid -->
                    <div class="table-responsive" >
                      <table class="table table-condensed table-bordered table-striped">
                        <thead style="text-align: center;">
                        <tr>
                          <td class="w10"><b>N° Projeto</b></td>
                          <td><b>Nome</b></td>
                          <!--<td class="w20"><b>Valor Investido</b></td>-->
                          <td class="situacao_projeto w20"><b>Situação do Projeto</b></td>
                        </tr>
                        </thead>
                        <tbody>
                        <tr v-for="projetos in todasPropostas">
                          <td class="text-center">{{projetos.ds_codigo_projeto_erp}}</td>
                          <td class="text-center">{{projetos.ds_nome}}</td>
                          <!--<td class="text-center">{{projetos.dc_investimento | real}}</td>-->
                          <td class="situacao_projeto text-center" v-if="projetos.ds_situacao_erp !== null">{{projetos.ds_situacao_erp}}</td>
                          <td class="situacao_projeto text-center" v-if="projetos.ds_situacao_erp === null">Não aprovado, fase de
                            <span v-if="projetos.ds_fase === 'ANALISE'">Análise</span>
                            <span v-if="projetos.ds_fase === 'DEFERIMENTO'">Deferimento</span>
                            <span v-if="projetos.ds_fase === 'FORMALIZACAO'">Formalização</span>
                          </td>
                        </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>


<!-- Resumo do Projeto --------------------------------------------------------------------------------------------->
                  <div class="box-body">
                    <!--<label class="control-label">Resumo do Projeto</label>-->
                    <label class="control-label">&nbsp;</label>
                    <div>
                      <table class="table table-condensed table-bordered">
                        <tbody>
                        <tr>
                          <td class="cabecalho w30">Projeto</td>
                          <td class="ressaltar" colspan="3">{{proposta.ds_codigo_projeto_erp}} - {{proposta.ds_nome}}</td>
                        </tr>
                        <tr v-if="proposta.nr_projeto_duplicacao">
                          <td class="cabecalho w30">Projeto Superior</td>
                          <td class="ressaltar" colspan="3">{{projetoSuperior}}</td>
                        </tr>
                        <tr>
                          <td class="cabecalho w30">Tipo de Ação</td>
                          <td class="ressaltar" colspan="3">{{_.has(proposta, 'ds_fep_tipo_acao') ? (proposta.ds_fep_tipo_acao === 'AT' ? 'AT - Ação Tática' : (proposta.ds_fep_tipo_acao === 'AF' ? 'AF - Ação Finalística' : (proposta.ds_fep_tipo_acao === 'ISD' ? 'ISD - Investimento Social Direto' : 'Ação não informada'))) : 'Ação não informada'}}</td>
                        </tr>
                        <!--Ajuste abrangência - suporte 60022>-->
                        <tr v-if="proposta">
                          <td class="cabecalho w30">Abrangência Nacional</td>
                          <td class="ressaltar" colspan="3">{{proposta.bt_fep_abrangencia === '1' ? 'S - Sim' : 'N - Não'}}</td>
                        </tr>
                        <tr>
                          <td class="cabecalho w30">Período Início e Fim Projeto</td>
                          <td class="ressaltar">{{ehNulo(proposta.dt_assinatura_convenio, proposta.dt_data_inicial) | moment("MM/YYYY")}}  a  {{dataFinalProjeto }}</td>
                          <td>Prazo de execução</td>
                          <td class="ressaltar">{{proposta.nr_periodos}} meses</td>
                        </tr>

                        </tbody>
                      </table>

                      <br/>

<!-- Totais do Projeto --------------------------------------------------------------------------------------------->
                      <table class="table table-condensed table-bordered">
                        <thead>
                        <tr>
                          <th style="width: 33%">Recursos do Projeto</th>
                          <th class="ressaltar" colspan="2">{{totalContrapartida + totalFBB + totalParceiro | real}}</th>
                        </tr>
                        <tr><th class="cabecalho">Fundação</th><th class="cabecalho">Contrapartida*</th><th class="cabecalho">Parcerias</th></tr>
                        </thead>
                        <tbody>
                        <!--Suporte 60621 porcentagem apenas para a Contrapartida em função do recurso da FBB conforme previsto no SIC 13.3.1.1 item 6 -->
                        <!--<tr>-->
                          <!--<td class="ressaltar" style="width: 33%">{{totalFBB | real}}  ({{totalFBB / (totalContrapartida + totalFBB + totalParceiro) | percentage}})</td>-->
                          <!--<td class="ressaltar" style="width: 33%">{{totalContrapartida | real}}  ({{totalContrapartida / (totalContrapartida + totalFBB + totalParceiro) | percentage}})</td>-->
                          <!--<td class="ressaltar" style="width: 34%">{{totalParceiro | real}}  ({{totalParceiro / (totalContrapartida + totalFBB + totalParceiro) | percentage}})</td>-->
                        <!--</tr>-->
                        <tr>
                          <td class="ressaltar" style="width: 33%">{{totalFBB | real}} </td>
                          <td class="ressaltar" style="width: 33%">{{totalContrapartida | real}} </td>
                          <td class="ressaltar" style="width: 34%">{{totalParceiro | real}} </td>
                        </tr>
                        </tbody>
                        <!--Suporte 64094 porcentagem apenas para a Contrapartida em função do recurso da FBB conforme previsto no SIC 13.3.1.1 item 6.5 -->
                        <tr v-if="ehVoluntariado || ehEditalMN">
                          <td class="ressaltar" colspan="3">*A contrapartida corresponde a {{this.$root.formataNumero((totalContrapartida / totalFBB), 'percentual') }}% do valor aportado pela FBB.</td>
                        </tr>
                        <tr v-else>
                          <td class="ressaltar" colspan="3">*A contrapartida corresponde a {{this.$root.formataNumero((totalContrapartida / (totalContrapartida + totalFBB + totalParceiro)), 'percentual') }}% do valor total do projeto.</td>
                        </tr>
                      </table>
                    </div>
                  </div>


<!-- Entidade Proponente --------------------------------------------------------------------------------------------->
                  <div class="box-body">
                    <label class="control-label">Entidade Proponente</label>
                    <div>
                      <table class="table table-condensed table-bordered" v-if="proposta.entidade">
                        <tbody>
                        <tr>
                          <td class="cabecalho w30">Nome</td>
                          <td class="ressaltar">{{proposta.entidade.ds_nome}}</td>
                        </tr>
                        <tr>
                          <td class="cabecalho">CNPJ</td>
                          <td class="ressaltar">{{proposta.entidade.ds_cnpj | cnpj}}</td>
                        </tr>
                        <tr>
                          <td class="cabecalho">Natureza Jurídica</td>
                          <td class="ressaltar">{{formaJuridica}}</td>
                        </tr>
                        <tr>
                          <td class="cabecalho">E-mail</td>
                          <td class="ressaltar">{{proposta.entidade.ds_email}}</td>
                        </tr>
                        <tr>
                          <td class="cabecalho">Contato</td>
                          <td class="ressaltar">
                            <span v-if="_.has(proposta.entidade, 'contato') && !_.isEmpty(proposta.entidade.contato) && _.has(proposta.entidade.contato, 'ds_telefone') && !_.isEmpty(proposta.entidade.contato.ds_telefone)">{{proposta.entidade.contato.ds_telefone | telefone}}  </span>
                            <span v-if="_.has(proposta.entidade, 'contato') && !_.isEmpty(proposta.entidade.contato) && _.has(proposta.entidade.contato, 'ds_celular') && !_.isEmpty(proposta.entidade.contato.ds_celular)">celular: {{proposta.entidade.contato.ds_celular | telefone}}</span>
                          </td>
                        </tr>
                        <tr>
                          <td class="cabecalho">Endereço(s)</td>
                          <td class="ressaltar">
                          <span v-if="proposta.entidade.endereco">
                            <p v-for="endereco in proposta.entidade.endereco" v-if="endereco.bt_principal === 1" class="ressaltar">
                              {{endereco.ds_rua}}, {{endereco.ds_numero}}, {{endereco.ds_bairro}}, {{endereco.ds_complemento}}, {{endereco.ds_cidade}} / {{endereco.ds_estado}}, CEP: {{endereco.ds_cep | cep}}
                            </p>
                          </span>
                          </td>
                        </tr>
                        </tbody>
                      </table>

                    </div>
                  </div>


<!-- Lista de Dirigentes --------------------------------------------------------------------------------------------->
                  <div class="box-body" v-if="proposta && proposta.entidade">
                    <label class="control-label">Representante Legal da Entidade</label>
                    <div>
                      <table class="table table-condensed table-bordered lista">
                        <thead>
                        <tr>
                          <th class="w30">Nome</th>
                          <th style="width: 15%; text-align: center" class="text-center">Cargo</th>
                          <th style="width: 15%; text-align: center" class="text-center">CPF</th>
                          <th class="w30 text-center" style="text-align: center">Mandato</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr v-for="dirigente in proposta.entidade.dirigentes">
                          <td>{{dirigente.ds_nome}}</td>
                          <td class="text-center">{{dirigente.cargo.ds_descricao}}</td>
                          <td class="text-center">{{dirigente.ds_cpf | cpf}}</td>
                          <td class="text-center">{{dirigente.dt_inicio_mandato | moment("L")}} até {{dirigente.dt_fim_mandato | moment("L")}}</td>
                        </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>

<!-- Municípios --------------------------------------------------------------------------------------------->
                  <div class="box-body">
                    <table class="table table-condensed table-bordered" v-if="proposta.municipalizacao">
                      <thead>
                      <tr><th colspan="2" class="cabecalho">Municípios de Desenvolvimento do Projeto</th></tr>
                      </thead>
                      <tbody>
                      <tr>
                        <td colspan="2">
                            <span
                              v-for="(municipio, key, index) in municipios = _.groupBy(proposta.municipalizacao, function (m) { return m.ds_municipio + '/' + m.ds_uf })">
                              {{municipio[0].ds_municipio + (_.isUndefined(municipio[0].ds_uf) ? '' : '/' + municipio[0].ds_uf) + (index != Object.keys(municipios).length - 1 ? ',' : '.')}}
                            </span>
                        </td>
                      </tr>
                      </tbody>
                    </table>
                  </div>


<!-- Apresentação da entidade --------------------------------------------------------------------------------------------->
                  <div class="box-body" v-if="ehPIS">
                    <label class="control-label">Apresentação da entidade proponente</label>
                    <div class="required" :class="{ 'has-error' : errors.first('apresentacao_entidade')}">
                      <div class="nao_imprimir">
                        <textarea-autosize placeholder="" v-model="relatorioAnalise.apresentacao_entidade" name="ds_problemas" v-resizable @input="resizable" class="form-control"></textarea-autosize>
                      </div>
                      <div v-html="relatorioAnalise.apresentacao_entidade" class="imprimir bloco_texto"></div>
                    </div>
                  </div>


<!-- Problemas --------------------------------------------------------------------------------------------->
                  <div class="box-body" v-if="_.includes([2, 3], faixaDoProjeto.faixa) || ehPIS || ehVoluntariado">
                    <label class="control-label">Qual(is) problema(s) a proponente quer resolver ?</label>
                    <div class="required" :class="{ 'has-error' : errors.first('ds_problemas')}">
                      <div class="nao_imprimir">
                        <textarea-autosize placeholder="De forma sucinta, descreva a(s) situação(ões)-problema destacada(s) pela proponente." v-model="relatorioAnalise.ds_problemas" name="ds_problemas" v-resizable @input="resizable" class="form-control"></textarea-autosize>
                      </div>
                      <div v-html="relatorioAnalise.ds_problemas" class="imprimir bloco_texto"></div>
                    </div>
                  </div>


<!-- Solução problemas --------------------------------------------------------------------------------------------->
                  <div class="box-body" v-if="_.includes([2, 3], faixaDoProjeto.faixa) || ehPIS || ehVoluntariado">
                    <label class="control-label">O que a proponente pretende fazer para solucionar o(s) problema(s) ?</label>
                    <div class="required" :class="{ 'has-error' : errors.first('ds_solucao_problemas')}">
                      <div class="nao_imprimir">
                        <textarea-autosize @input="resizable"  placeholder="De forma sucinta, descreva o que a instituição propõe executar para solucionar o(s) problema(s) e os gastos previstos."   v-model="relatorioAnalise.ds_solucao_problemas" name="ds_solucao_problemas" v-resizable class="form-control"></textarea-autosize>
                      </div>
                      <div v-html="relatorioAnalise.ds_solucao_problemas" class="imprimir bloco_texto"></div>
                    </div>
                  </div>


<!-- Operacionalização --------------------------------------------------------------------------------------------->
                  <div class="box-body" v-if="ehPIS">
                    <label class="control-label"> Como a organização pretende operacionalizar as atividades propostas?</label>
                    <div class="required" :class="{ 'has-error' : errors.first('operacionalizacao_atividades')}">
                      <div class="nao_imprimir">
                        <textarea-autosize placeholder="" v-model="relatorioAnalise.operacionalizacao_atividades" name="ds_problemas" v-resizable @input="resizable" class="form-control"></textarea-autosize>
                      </div>
                      <div v-html="relatorioAnalise.operacionalizacao_atividades" class="imprimir bloco_texto"></div>
                    </div>
                  </div>


<!-- Resultados esperados --------------------------------------------------------------------------------------------->
                  <div class="box-body" v-if="_.includes([3], faixaDoProjeto.faixa) && !ehVoluntariado">
                    <label class="control-label">Quais os resultados esperados por meio da ação proposta ?</label>
                    <div class="required" :class="{ 'has-error' : errors.first('ds_resultados_esperados')}">
                      <div class="nao_imprimir">
                        <textarea-autosize @input="resizable" placeholder="De forma sucinta, discorra sobre a efetividade da ação proposta, descrevendo os impactos e transformações esperados no cotidiano dos participantes por meio da implementação do projeto."   v-model="relatorioAnalise.ds_resultados_esperados" name="ds_resultados_esperados" v-resizable class="form-control"></textarea-autosize>
                      </div>
                      <div v-html="relatorioAnalise.ds_resultados_esperados" class="imprimir bloco_texto"></div>
                    </div>
                  </div>


<!-- Aspectos positivos --------------------------------------------------------------------------------------------->
                  <div class="box-body" v-if="_.includes([3], faixaDoProjeto.faixa) &&  (!ehPIS && !ehVoluntariado)">
                    <label class="control-label">Principais aspectos positivos da proposta</label>
                    <div class="required" :class="{ 'has-error' : errors.first('ds_aspectos_positivos')}">
                      <div class="nao_imprimir">
                        <textarea-autosize @input="resizable" placeholder="De forma sucinta, discorra sobre os principais aspectos positivos da proposta, considerando pontos relacionados à metodologia apresentada pela proponente, ao grau de envolvimento do público participante e ao potencial de continuidade das ações após a execução das atividades (sustentabilidade do projeto)."   v-model="relatorioAnalise.ds_aspectos_positivos" name="ds_aspectos_positivos" v-resizable class="form-control"></textarea-autosize>
                      </div>
                      <div v-html="relatorioAnalise.ds_aspectos_positivos" class="imprimir bloco_texto"></div>
                    </div>
                  </div>


<!-- Preocupações --------------------------------------------------------------------------------------------->
                  <div class="box-body" v-if="_.includes([3], faixaDoProjeto.faixa) &&  (!ehPIS && !ehVoluntariado)">
                    <label class="control-label">Principais preocupações em relação à proposta</label>
                    <div class="required" :class="{ 'has-error' : errors.first('ds_preocupacoes')}">
                      <div class="nao_imprimir">
                        <textarea-autosize @input="resizable" placeholder="Se for o caso, discorra de forma sucinta sobre os principais aspectos que demandam cuidados em relação à proposta, considerando riscos relacionados às lacunas na metodologia, à qualidade das atividades propostas, aos possíveis impactos ambientais ou sociais negativos, à falta de participação da comunidade, à possível descontinuidade das ações e à ausência de parcerias/acordos com outras instituições."   v-model="relatorioAnalise.ds_preocupacoes" name="ds_preocupacoes" v-resizable class="form-control"></textarea-autosize>
                      </div>
                      <div v-html="relatorioAnalise.ds_preocupacoes" class="imprimir bloco_texto"></div>
                    </div>
                  </div>


<!-- Condições internas --------------------------------------------------------------------------------------------->
                  <div class="box-body" v-if="_.includes([3], faixaDoProjeto.faixa) && !ehPIS">
                    <label class="control-label">Análise das condições internas da proponente</label>
                    <br/>
                    <label class="control-label">Pontos Positivos:</label>
                    <div class="required" :class="{ 'has-error' : errors.first('ds_condicoes_internas_positivas')}">
                      <div class="nao_imprimir">
                        <textarea-autosize @input="resizable" placeholder="De forma sucinta, descreva os aspectos positivos sobre o ambiente INTERNO da proponente, destacando pontos como: infraestrutura, capacidade técnica, grau de organização/articulação social, etc."  v-model="relatorioAnalise.ds_condicoes_internas_positivas" name="ds_condicoes_internas_positivas" v-resizable class="form-control"></textarea-autosize>
                      </div>
                      <div v-html="relatorioAnalise.ds_condicoes_internas_positivas" class="imprimir bloco_texto"></div>
                    </div>

                    <label class="control-label" style="margin-top: 20px;">Pontos de Atenção:</label>
                    <div class="required" :class="{ 'has-error' : errors.first('ds_condicoes_internas_negativas')}">
                      <div class="nao_imprimir">
                        <textarea-autosize @input="resizable" placeholder="De forma sucinta, descreva os aspectos negativos sobre o ambiente INTERNO da proponente, destacando pontos como: infraestrutura, capacidade técnica, grau de organização/articulação social, etc."   v-model="relatorioAnalise.ds_condicoes_internas_negativas" name="ds_condicoes_internas_negativas" v-resizable class="form-control"></textarea-autosize>
                      </div>
                      <div v-html="relatorioAnalise.ds_condicoes_internas_negativas" class="imprimir bloco_texto"></div>
                    </div>
                  </div>


<!-- Condições externas --------------------------------------------------------------------------------------------->
                  <div class="box-body" v-if="_.includes([3], faixaDoProjeto.faixa) && !ehPIS">
                    <label class="control-label">Análise das condições externas da proponente</label>
                    <br/>
                    <label class="control-label">Pontos Positivos:</label>
                    <div class="required" :class="{ 'has-error' : errors.first('ds_condicoes_externas_positivas')}">
                      <div class="nao_imprimir">
                        <textarea-autosize @input="resizable" placeholder="De forma sucinta, descreva os aspectos positivos e negativos sobre o ambiente EXTERNO da proponente, destacando pontos como: relacionamento com a gestão pública, mercado local, logística do município, fatores climáticos, stakeholders, etc."   v-model="relatorioAnalise.ds_condicoes_externas_positivas" name="ds_condicoes_externas_positivas" v-resizable class="form-control"></textarea-autosize>
                      </div>
                      <div v-html="relatorioAnalise.ds_condicoes_externas_positivas" class="imprimir bloco_texto"></div>
                    </div>

                    <label class="control-label" style="margin-top: 20px;">Pontos de Atenção:</label>
                    <div class="required" :class="{ 'has-error' : errors.first('ds_condicoes_externas_negativas')}">
                      <div class="nao_imprimir">
                        <textarea-autosize @input="resizable" placeholder="De forma sucinta, descreva os aspectos negativos sobre o ambiente EXTERNO da proponente, destacando pontos como: relacionamento com a gestão pública, mercado local, logística do município, fatores climáticos, stakeholders, etc."   v-model="relatorioAnalise.ds_condicoes_externas_negativas" name="ds_condicoes_externas_negativas" v-resizable class="form-control"></textarea-autosize>
                      </div>
                      <div v-html="relatorioAnalise.ds_condicoes_externas_negativas" class="imprimir bloco_texto"></div>
                    </div>
                  </div>


<!-- Público alvo --------------------------------------------------------------------------------------------->
                  <div class="box-body">
                    <div>
                      <table class="table table-condensed table-bordered m0">
                        <thead>
                        <tr>
                          <th class="cabecalho">Público-alvo</th>
                          <th class="cabecalho w20">Participantes Diretos</th>
                          <th class="cabecalho w20">Jovens</th>
                          <th class="cabecalho w20">Mulheres</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr v-for="publico in proposta.publicos_alvo">
                          <td v-if="publico.fonte.ds_descricao" class="ressaltar">{{publico.fonte.ds_descricao}}</td>
                          <td>{{publico.nr_participantes_diretos}}</td>
                          <td>{{publico.nr_jovens}}</td>
                          <td>{{publico.nr_mulheres}}</td>
                        </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>


<!-- Perguntas: Objetivos e Metas --------------------------------------------------------------------------------------------->
                  <div class="box-body">
                    <label class="control-label">Objetivos e Metas</label>
                    <table class="table table-condensed table-bordered table-striped">
                      <tbody>
                      <tr>
                        <td>O objetivo geral da proposta define o que se pretende com a implementação do projeto ?</td>
                        <td>
                          <select v-model="relatorioAnalise.ds_indicadores_objetivo_geral" class="form-control" name="ds_indicadores_objetivo_geral">
                              <option :value="opcao" v-for="opcao in opcoes">{{opcao}}</option>
                          </select>
                        </td>
                      </tr>
                      <tr>
                        <td>Os objetivos específicos e as metas do projeto propiciam o atingimento do objetivo geral ?</td>
                        <td>
                          <select v-model="relatorioAnalise.ds_indicadores_objetivo_especifico" class="form-control" name="ds_indicadores_objetivo_especifico">
                            <option :value="opcao" v-for="opcao in opcoes">{{opcao}}</option>
                          </select>
                        </td>
                      </tr>
                      <tr>
                        <td>Os objetivos da proposta, são compatíveis com as diretrizes estatutárias da FBB?</td>
                        <td>
                          <select v-model="relatorioAnalise.ds_indicadores_objetivo_compativel" class="form-control" name="ds_indicadores_objetivo_compativel">
                            <option :value="opcao" v-for="opcao in opcoes">{{opcao}}</option>
                          </select>
                        </td>
                      </tr>
                      <tr v-if="!ehPIS && !ehVoluntariado">
                        <td>Os objetivos da proposta, são compatíveis com as diretrizes de programa estruturado (se for o caso) ?</td>
                        <td>
                          <select v-model="relatorioAnalise.ds_indicadores_objetivo_estruturado" class="form-control" name="ds_indicadores_objetivo_estruturado">
                            <option :value="opcao" v-for="opcao in opcoes">{{opcao}}</option>
                          </select>
                        </td>
                      </tr>
                      <tr v-if="ehPIS || ehVoluntariado">
                        <td>Existe alguma crítica em relação aos objetivos, metas e indicadores apresentados pela proponente?</td>
                        <td>
                          <select v-model="relatorioAnalise.existe_critica_objetivos_metas_indicadores" class="form-control" name="existe_critica_objetivos_metas_indicadores">
                            <option :value="opcao" v-for="opcao in opcoes">{{opcao}}</option>
                          </select>
                        </td>
                      </tr>
                      <tr v-if="(_.has(relatorioAnalise, 'existe_critica_objetivos_metas_indicadores') && relatorioAnalise.existe_critica_objetivos_metas_indicadores === 'Sim')">
                        <td colspan="2">
                          <div class="nao_imprimir">
                            <textarea-autosize @input="resizable" v-model="relatorioAnalise.critica_objetivos_metas_indicadores" rows="7" v-resizable name="critica_objetivos_metas_indicadores" class="form-control"></textarea-autosize>
                          </div>
                          <div v-html="relatorioAnalise.critica_objetivos_metas_indicadores" class="imprimir bloco_texto"></div>
                        </td>
                      </tr>
                      <tr v-if="!ehPIS && !ehVoluntariado">
                        <td>Os objetivos da proposta, são compatíveis com as diretrizes do plano de trabalho firmado no âmbito de parcerias estratégicas (se for o caso) ?</td>
                        <td>
                          <select v-model="relatorioAnalise.ds_indicadores_objetivo_estrategico" class="form-control" name="ds_indicadores_objetivo_estrategico">
                            <option :value="opcao" v-for="opcao in opcoes">{{opcao}}</option>
                          </select>
                        </td>
                      </tr>
                      </tbody>
                    </table>
                  </div>


<!-- Objetivo Geral--------------------------------------------------------------------------------------------->
                  <div class="box-body">
                    <label class="control-label">Objetivo Geral</label>
                    <div class="nao_imprimir">
                      <textarea-autosize @input="resizable" v-resizable data-vv-as="Objetivo Geral do Projeto" v-model="proposta.ds_objetivo_geral" name="objetivo Geral" class="form-control" rows="4" :disabled="true"></textarea-autosize>
                    </div>
                    <div v-html="proposta.ds_objetivo_geral" class="imprimir bloco_texto"></div>
                  </div>


<!-- Quadro: Objetivos Específicos e Metas --------------------------------------------------------------------------------------------->
                  <div class="box-body">
                    <label class="control-label">Objetivos Específicos e Metas</label>
                    <div>
                      <table class="table table-condensed table-bordered table-striped">
                      <thead>
                      <tr>
                        <th class="w30">Objetivos Específicos</th>
                        <th>Metas</th>
                      </tr>
                      </thead>
                      <tbody>
                        <tr v-for="(objetivo) in proposta.objetivos">
                          <td style="border-bottom: 2px solid silver !important;">{{objetivo.ds_descricao}}</td>
                          <td style="border-bottom: 2px solid silver !important;">
                            <table>
                              <tr v-for="(meta) in _.filter(proposta.metas, function (m) { return _.includes(_.map(m.objetivos, 'ds_descricao'), objetivo.ds_descricao)})">
                                <td style="border: none; border-bottom: 1px solid silver;">{{meta.ds_descricao}}</td></tr>
                            </table>
                          </td>
                        </tr>
                      </tbody>
                      </table>
                    </div>
                  </div>


<!-- Indicadores de Resultado --------------------------------------------------------------------------------------------->
                  <div class="box-body">
                    <div>
                      <label class="control-label">Indicadores de Resultado</label>
                      <div class="nao_imprimir">
                        <textarea-autosize @input="resizable" v-resizable data-vv-as="Indicadores" v-model="proposta.ds_indicadores_resultado" name="indicadores" class="form-control" rows="4" :disabled="true"></textarea-autosize>
                      </div>
                      <div v-html="proposta.ds_indicadores_resultado" class="imprimir bloco_texto"></div>
                    </div>
                  </div>


<!-- Divulgação do projeto --------------------------------------------------------------------------------------------->
                  <div class="box-body">
                    <label class="control-label">Divulgação do projeto</label>
                    <table class="table table-condensed table-bordered table-striped">
                      <tbody>
                      <tr v-if="_.includes([1,2], faixaDoProjeto.faixa)">
                        <td>Os recursos para realização das ações contidas no Plano de Comunicação foram previstos na memoria de cálculo?</td>
                        <td>
                          <select v-model="relatorioAnalise.ds_acoes_comunicacao_memoria_calculo" class="form-control" name="ds_divulgacao_identificacao">
                            <option :value="opcao" v-for="opcao in opcoes">{{opcao}}</option>
                          </select>
                        </td>
                      </tr>               
                      <tr v-if="_.includes([3], faixaDoProjeto.faixa)">
                        <td>Foi previsto no projeto o uso de banner obrigatório indicativo do apoio da Fundação ?</td>
                       <td>
                          <select v-model="relatorioAnalise.ds_divulgacao_banner" class="form-control" name="ds_divulgacao_banner">
                            <option :value="opcao" v-for="opcao in opcoes">{{opcao}}</option>
                          </select>
                        </td>
                      </tr>
                      <tr v-if="_.includes([3], faixaDoProjeto.faixa)">
                        <td>Foi prevista a identificação de veículos a serem adquiridos com recursos financeiros do projeto (se for o caso) ?</td>
                        <td>
                          <select v-model="relatorioAnalise.ds_divulgacao_identificacao" class="form-control" name="ds_divulgacao_identificacao">
                            <option :value="opcao" v-for="opcao in opcoes">{{opcao}}</option>
                          </select>
                        </td>
                      </tr>
                      <tr v-if="_.includes([3], faixaDoProjeto.faixa)">
                        <td>Foi prevista a instalação de placa provisória e definitiva em obras civis a serem realizadas com recursos financeiros do projeto (se for o caso) ?</td>
                        <td>
                          <select v-model="relatorioAnalise.ds_divulgacao_placa" class="form-control" name="ds_divulgacao_placa">
                            <option :value="opcao" v-for="opcao in opcoes">{{opcao}}</option>
                          </select>
                        </td>
                      </tr>
                      <tr v-if="_.includes([3], faixaDoProjeto.faixa)">
                        <td>Foi prevista no cronograma físico a realização de atividades relativa à solenização de assinatura de convênio ?</td>
                        <td>
                          <select v-model="relatorioAnalise.ds_divulgacao_solenizacao" class="form-control" name="ds_divulgacao_solenizacao">
                            <option :value="opcao" v-for="opcao in opcoes">{{opcao}}</option>
                          </select>
                        </td>
                      </tr>
                      </tbody>
                    </table>
                  </div>


<!-- Ações de Comunicação --------------------------------------------------------------------------------------------->
                  <div class="box-body">
                    <div>
                      <label class="control-label">Ações de Comunicação</label>
                      <div class="nao_imprimir">
                        <textarea-autosize @input="resizable" v-resizable data-vv-as="Ações" v-model="proposta.ds_acoes_comunicacao" name="acoes" class="form-control " rows="4" :disabled="true"></textarea-autosize>
                      </div>
                      <div v-html="proposta.ds_acoes_comunicacao" class="imprimir bloco_texto"></div>
                    </div>
                  </div>


<!-- Valores e Contrapartidas --------------------------------------------------------------------------------------------->
                  <div class="box-body">
                    <label class="control-label">Valores e contrapartida</label>
                    <table class="table table-condensed table-bordered">
                      <thead>
                      <tr>
                        <th style="width: 33%">Recursos do Projeto</th>
                        <th class="ressaltar" colspan="2">{{totalContrapartida + totalFBB + totalParceiro | real}}</th>
                      </tr>
                      <tr><th class="cabecalho">Fundação</th><th class="cabecalho">Contrapartida</th><th class="cabecalho">Parcerias</th></tr>
                      </thead>
                      <tbody>
                      <!-- Suporte 20263 - solicitação para remover os pencentuais -->
                      <!--<tr>-->
                        <!--<td class="ressaltar" style="width: 33%">{{totalFBB | real}}  ({{totalFBB / (totalContrapartida + totalFBB + totalParceiro) | percentage}})</td>-->
                        <!--<td class="ressaltar" style="width: 33%">{{totalContrapartida | real}}  ({{totalContrapartida / (totalContrapartida + totalFBB + totalParceiro) | percentage}})</td>-->
                        <!--<td class="ressaltar" style="width: 34%">{{totalParceiro | real}}  ({{totalParceiro / (totalContrapartida + totalFBB + totalParceiro) | percentage}})</td>-->
                      <!--</tr>-->
                      <tr>
                        <td class="ressaltar" style="width: 33%">{{totalFBB | real}}  </td>
                        <td class="ressaltar" style="width: 33%">{{totalContrapartida | real}}  </td>
                        <td class="ressaltar" style="width: 34%">{{totalParceiro | real}}  </td>
                      </tr>
                      </tbody>
                    </table>
                  </div>


<!-- Valores: Recursos da Fundação  --------------------------------------------------------------------------------------------->
                  <div class="box-body">
                    <label class="control-label">Recursos da Fundação</label>
                    <table class="table table-condensed table-bordered">
                      <thead>
                      <tr>
                        <th class="text-left">Conta Financeira</th>
                        <th class="text-center w20">Valor</th>
                        <th class="text-center w10">% Total</th>
                      </tr>
                      </thead>

                      <tbody v-for="conta in relatorioAnalise.itensFbb">
                      <!-- v-if para eliminar linhas do array em branco --->
                      <tr class="conta" v-if="conta.valor > 0">
                        <td>{{conta.conta}}</td>
                        <td>{{conta.valor | real}}</td>
                        <td>{{(conta.valor) / (totalFBB) | percentage}}</td>
                      </tr>
                      </tbody>
                    </table>
                  </div>


<!-- Valores: Recursos de Contrapartida --------------------------------------------------------------------------------------------->
                  <div class="box-body">
                    <label class="control-label">Contrapartida</label>
                    <table class="table table-condensed table-bordered">
                      <thead>
                        <tr>
                          <th class="text-left">Conta Financeira</th>
                          <th class="text-center w20">Valor</th>
                          <th class="text-center w10">% Total</th>
                        </tr>
                      </thead>

                      <tbody v-for="contra in relatorioAnalise.itensContrapartida">
                      <!-- v-if para eliminar linhas do array em branco --->
                      <tr class="conta" v-if="contra.conta">
                        <td>{{contra.conta}}</td>
                        <td>{{_.sumBy(_.values(contra.item), function (i) { return i.valor }) | real}}</td>
                        <td>{{(_.sumBy(_.values(contra.item), function (i) { return i.valor })) / (totalContrapartida) | percentage}}</td>
                      </tr>
                      </tbody>
                    </table>
                  </div>


<!-- Valores: Recursos de          --------------------------------------------------------------------------------------------->
                  <div class="box-body" v-if="totalParceiro > 0">
                    <label class="control-label">Recursos de Parcerias</label>
                    <table class="table table-condensed table-bordered">
                      <thead>
                      <tr>
                        <th class="text-left">Conta Financeira</th>
                        <th class="text-center w20">Valor</th>
                        <th class="text-center w10">% Total</th>
                      </tr>
                      </thead>

                      <tbody v-for="conta in relatorioAnalise.itensParceiro">
                      <!-- v-if para eliminar linhas do array em branco --->
                      <tr class="conta" v-if="conta.valor > 0">
                        <td>{{conta.conta}}</td>
                        <td>{{conta.valor | real}}</td>
                        <td>{{(conta.valor) / (totalParceiro) | percentage}}</td>
                      </tr>
                      </tbody>
                    </table>
                  </div>


<!-- Perguntas: Valores e Contrapartidas --------------------------------------------------------------------------------------------->
                  <div class="box-body">
                    <table class="table table-condensed table-bordered table-striped">
                      <tbody>
                      <tr>
                        <td>Os itens de despesa propostos são compatíveis com os objetivos, metas e atividades do projeto ?</td>
                        <td>
                          <select v-model="relatorioAnalise.ds_valores_itens" class="form-control" name="ds_valores_itens">
                            <option :value="opcao" v-for="opcao in opcoes">{{opcao}}</option>
                          </select>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          {{faixaDoProjeto.faixa === 1 ? 'A contrapartida proposta atende aos critérios específicos definidos para projetos abaixo de R$ 100 mil?' :
                          'A contrapartida proposta atende aos critérios definidos nos normativos vigentes?'}}
                        </td>
                        <td>
                          <select v-model="relatorioAnalise.ds_valores_contrapartida" class="form-control" name="ds_valores_contrapartida">
                            <option :value="opcao" v-for="opcao in opcoes">{{opcao}}</option>
                          </select>
                        </td>
                      </tr>
                      <tr v-if="!ehPIS && !_.includes([2], faixaDoProjeto.faixa)">
                        <td>
                          {{faixaDoProjeto.faixa === 1 ? 'Os valores apresentados na memória de cálculo estão de acordo com os preços praticados no mercado ou com os parâmetros operacionais estabelecidos pela FBB?' :
                          'Os valores orçados na proposta, inclusive contrapartida, estão de acordo com os praticados no mercado, conforme orçamentos apresentados ?'}}
                        </td>
                        <td>
                          <select v-model="relatorioAnalise.ds_valores_deacordo" class="form-control" name="ds_valores_deacordo">
                            <option :value="opcao" v-for="opcao in opcoes">{{opcao}}</option>
                          </select>
                        </td>
                      </tr>
                      <tr v-if="_.includes([3], faixaDoProjeto.faixa)">
                        <td>Os itens de despesa, cujos orçamentos não foram apresentados, enquandram-se nas diretrizes de dispensa ou nos parâmetros estabelecidos pela Fundação ?</td>
                        <td>
                          <select v-model="relatorioAnalise.ds_valores_enquadrados" class="form-control" name="ds_valores_enquadrados">
                            <option :value="opcao" v-for="opcao in opcoes">{{opcao}}</option>
                          </select>
                        </td>
                      </tr>
                      <tr v-if="_.includes([2, 3], faixaDoProjeto.faixa)">
                        <td>Foram observadas as vedações de itens de despesa, conforme norma vigente ?</td>
                        <td>
                          <select v-model="relatorioAnalise.ds_valores_vedacoes" class="form-control" name="ds_valores_vedacoes">
                            <option :value="opcao" v-for="opcao in opcoes">{{opcao}}</option>
                          </select>
                        </td>
                      </tr>
                      <tr v-if="_.includes([2], faixaDoProjeto.faixa)">
                        <td>Foram observados os itens necessários para propostas que envolvam obra civil e/ou aquisição de bens fixos de uso industrial ?</td>
                        <td>
                          <select v-model="relatorioAnalise.ds_valores_industrial" class="form-control" name="ds_valores_industrial">
                            <option :value="opcao" v-for="opcao in opcoes">{{opcao}}</option>
                          </select>
                        </td>
                      </tr>
                      <tr v-if="_.includes([2], faixaDoProjeto.faixa)">
                        <td>Foram observados os itens necessários para propostas que envolvam ações de formação, capacitação e/ou consultorias ?</td>
                        <td>
                          <select v-model="relatorioAnalise.ds_valores_formacao" class="form-control" name="ds_valores_formacao">
                            <option :value="opcao" v-for="opcao in opcoes">{{opcao}}</option>
                          </select>
                        </td>
                      </tr>
                      <tr v-if="!ehPIS">
                        <td>Foi verificado conformidade específica para obra civil?</td>
                        <td>
                          <select v-model="relatorioAnalise.conforme_obra_civil" class="form-control" name="conforme_obra_civil">
                            <option :value="opcao" v-for="opcao in opcoes">{{opcao}}</option>
                          </select>
                        </td>
                      </tr>
                      <tr>
                        <td>Foi realizado algum ajuste nos valores apresentados ?</td>
                        <td>
                          <select v-model="relatorioAnalise.ds_valores_ajustes" class="form-control" name="ds_valores_ajustes">
                            <option :value="opcao" v-for="opcao in opcoes">{{opcao}}</option>
                          </select>
                        </td>
                      </tr>
                      </tbody>
                    </table>
                    <div class="nao_imprimir">
                      <textarea-autosize v-model="relatorioAnalise.ds_valores_observacoes" placeholder="Descreva a seguir as observações e ajustes realizados nos valores, bem como demais justificativas pertinentes." name="ds_valores_observacoes" v-resizable class="form-control ressaltar juntos"></textarea-autosize>
                    </div>
                    <div v-html="relatorioAnalise.ds_valores_observacoes" class="imprimir bloco_texto"></div>
                  </div>


<!-- Liberação e Adiantamento --------------------------------------------------------------------------------------------->
                  <div class="box-body" v-if="!ehVoluntariado">
                    <label class="control-label">Liberação de recursos</label>
                    <table class="table table-condensed table-bordered table-striped">
                      <tbody>
                      <tr>
                        <td>Os parâmetros para concessão da modalidade de adiantamento de recursos foram atendidos conforme normativos vigentes ?</td>
                        <td>
                          <select v-model="relatorioAnalise.ds_liberacao_adiantamentos" class="form-control" name="ds_liberacao_adiantamentos">
                            <option :value="opcao" v-for="opcao in opcoes">{{opcao}}</option>
                          </select>
                        </td>
                      </tr>
                      </tbody>
                    </table>
                    <div class="nao_imprimir">
                      <textarea-autosize v-model="relatorioAnalise.ds_liberacao_observacoes" placeholder="Descreva a seguir, se for o caso, justificativa pela concessão de adiantamento." name="ds_liberacao_observacoes" v-resizable class="form-control ressaltar juntos"></textarea-autosize>
                    </div>
                    <div v-html="relatorioAnalise.ds_liberacao_observacoes" class="imprimir bloco_texto"></div>

                    <br/>

                <!-- Grid de Adiantamento -->
                    <div class="table-responsive" >
                      <table class="table table-condensed table-bordered table-striped" v-if="proposta.adiantamentos">
                        <thead style="text-align: center;">
                        <tr>
                          <td><b>Parcela</b></td>
                          <td><b>Origem</b></td>
                          <td><b>Valor</b></td>
                        </tr>
                        </thead>
                        <tbody>
                        <tr v-for="adiantamento in proposta.adiantamentos">
                          <td class="text-center w20">{{adiantamento.parcela}}</td>
                          <td class="text-center w40">
                            <span v-if="adiantamento.origem === 1">Fundação</span>
                            <span v-if="adiantamento.origem === 5">Parceiro Estratégico</span>
                          </td>
                          <td class="text-center w40">{{adiantamento.valor | real}}</td>
                        </tr>
                        <tr>
                          <td colspan="2" class="ressaltar">Total adiantável</td>
                          <td class="text-center ressaltar">{{_.sumBy(proposta.adiantamentos, function (p) { return p.valor }) | real}}   ({{ ( (_.sumBy(proposta.adiantamentos, function (p) { return p.valor }))/(totalFBB + totalParceiro) ) | percentage}})</td>
                        </tr>
                        </tbody>
                        <tr v-if="((proposta.adiantamentos && proposta.adiantamentos.length === 0) || (!proposta.adiantamentos))">
                          <td colspan="100%" class="text-center">Nenhuma parcela de adiantamento cadastrada.</td>
                        </tr>
                      </table>
                    </div>
                  </div>


<!-- Prazo de Execução --------------------------------------------------------------------------------------------->
                  <div class="box-body">
                    <label class="control-label">Prazo de execução e periodicidade de relatórios</label>
                    <table class="table table-condensed table-bordered table-striped">
                      <tbody>
                      <tr>
                        <td>Há compatibilidade entre o prazo de execução indicado na proposta e as atividades a serem realizadas ?</td>
                        <td>
                          <select v-model="relatorioAnalise.ds_execucao_compatibilidade" class="form-control" name="ds_execucao_compatibilidade">
                            <option :value="opcao" v-for="opcao in opcoes">{{opcao}}</option>
                          </select>
                        </td>
                      </tr>
                      <tr>
                        <td>Qual o prazo de execução do projeto ?
                        </td>
                        <td>
                          <input v-model="relatorioAnalise.ds_execucao_prazo" name="ds_titulo" class="form-control" :disabled="true" id="ds_execucao_prazo" type="text" maxlength="255">
                        </td>
                      </tr>
                      <tr>
                        <td>Qual o prazo de vigência do projeto?</td>
                        <td>
                          <input v-model="proposta.periodo_vigencia" name="ds_titulo" class="form-control" :disabled="true" id="prazo_vigencia" type="text" maxlength="255">
                        </td>
                      </tr>
                      </tbody>
                    </table>

                <!-- Periodicidade dos Relatórios -->
                    <table class="table table-condensed table-bordered table-striped">
                      <tbody>
                      <tr>
                        <td>Qual a periodicidade dos relatórios de execução ?
                        </td>
                        <td style="width: 145px;">
                          <input v-model="relatorioAnalise.ds_execucao_relatorios" name="ds_execucao_relatorios" class="form-control" id="ds_execucao_relatorios" type="text" maxlength="255" :disabled="true">
                        </td>
                      </tr>
                      </tbody>
                    </table>

                    <div class="nao_imprimir">
                      <textarea-autosize @input="resizable" v-model="relatorioAnalise.ds_execucao_observacoes" placeholder="Informe observações relevantes referente ao prazo de execução do projeto." name="ds_execucao_observacoes" v-resizable class="form-control ressaltar juntos"></textarea-autosize>
                    </div>
                    <div v-html="relatorioAnalise.ds_execucao_observacoes" class="imprimir bloco_texto" v-if="!ehVoluntariado"></div>
                  </div>


<!-- Regularidade da proposta e da proponente --------------------------------------------------------------------------------------------->
                  <div class="box-body">
                    <label class="control-label">Regularidade da proposta e da proponente</label>
                    <table class="table table-condensed table-bordered table-striped">
                      <tbody>
                      <tr>
                        <td>A proposta é compatível com os objetivos estatutários e regimentais da entidade proponente?</td>
                        <td>
                          <select v-model="relatorioAnalise.ds_regularidade_objetivos" class="form-control" name="ds_regularidade_objetivos">
                            <option :value="opcao" v-for="opcao in opcoes">{{opcao}}</option>
                          </select>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          {{faixaDoProjeto.faixa === 1 ? 'A proponente apresentou toda a documentação exigida para a análise de projetos abaixo de R$ 100 mil?' :
                          'A proponente apresentou toda a documentação exigida para a análise de projetos?'}}
                        </td>
                        <td>
                          <select v-model="relatorioAnalise.ds_regularidade_documentação" class="form-control" name="ds_regularidade_documentação">
                            <option :value="opcao" v-for="opcao in opcoes">{{opcao}}</option>
                          </select>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          {{faixaDoProjeto.faixa === 1 ? 'A proponente encontra-se em regularidade cadastral, de acordo com as exigências específicas para projetos abaixo de R$ 100 mil?' :
                          'A proponente encontra-se em regularidade cadastral?'}}
                        </td>
                        <td>
                          <select v-model="relatorioAnalise.ds_regularidade_cadastral" class="form-control" name="ds_regularidade_cadastral">
                            <option :value="opcao" v-for="opcao in opcoes">{{opcao}}</option>
                          </select>
                        </td>
                      </tr>
                      <tr v-if="_.includes([2, 3], faixaDoProjeto.faixa) && !ehPIS">
                        <td>A proponente encontra-se em conformidade (fiscal e documental) e relação a exigências específicas no âmbito de parceria estratégica (se for o caso) ?</td>
                        <td>
                          <select v-model="relatorioAnalise.ds_regularidade_fiscal" class="form-control" name="ds_regularidade_fiscal">
                            <option :value="opcao" v-for="opcao in opcoes">{{opcao}}</option>
                          </select>
                        </td>
                      </tr>
                      <tr>
                        <td>A proponente já executou projetos com a FBB ?</td>
                        <td>
                          <select v-model="relatorioAnalise.ds_regularidade_projetos" class="form-control" name="ds_regularidade_projetos">
                            <option :value="opcao" v-for="opcao in opcoes">{{opcao}}</option>
                          </select>
                        </td>
                      </tr>
                      <tr>
                        <td>A proponente encontra-se em regularidades junto à FBB (inexistência de ocorrências impeditivas) ?</td>
                        <td>
                          <select v-model="relatorioAnalise.ds_regularidade_ocorrencias" class="form-control" name="ds_regularidade_ocorrencias">
                            <option :value="opcao" v-for="opcao in opcoes">{{opcao}}</option>
                          </select>
                        </td>
                      </tr>
                      <tr v-if="_.includes([3], faixaDoProjeto.faixa)">
                        <td>
                          <span>Rating calculado para a proponente</span>
                        </td>
                        <td v-if="relatorioAnalise.ds_regularidade_rating">
                          <input v-model="relatorioAnalise.ds_regularidade_rating.ds_descricao" name="ds_titulo" class="form-control" id="ds_regularidade_rating" type="text" maxlength="255" :disabled="true">
                        </td>
                      </tr>
                      <!-- Demanda 64783 - Inclusão do risco da proposta na visualização do relatório -->
                      <tr>
                        <td>
                          <span>Risco Calculado do Projeto</span>
                        </td>
                        <td v-if="_.includes([1,2], faixaDoProjeto.faixa)">
                          <input :readonly="somenteLeitura" :value='"C"' class="form-control" type="text" maxlength="255" :disabled="true">
                        </td>
                        <td v-else>
                          <input :readonly="somenteLeitura" :value="!riscoCalculado ? 'Risco ainda não calculado' : riscoCalculado" class="form-control" type="text" maxlength="255" :disabled="true">
                        </td>
                      </tr>
                      </tbody>
                    </table>
                    <div class="nao_imprimir">
                      <textarea-autosize @input="resizable" v-model="relatorioAnalise.ds_regularidade_observacoes" placeholder="Descreva a seguir possíveis comentários acerca da regularidade da proposta, proponente e condicionantes, se for o caso." name="ds_regularidade_observacoes" v-resizable class="form-control ressaltar juntos"></textarea-autosize>
                    </div>
                    <div v-html="relatorioAnalise.ds_regularidade_observacoes" class="imprimir bloco_texto"></div>
                  </div>


<!-- Licenciamento ambiental --------------------------------------------------------------------------------------------->
                  <div class="box-body">
                    <label class="control-label">Licenciamento ambiental</label>
                    <table class="table table-condensed table-bordered table-striped">
                      <tbody>
                      <tr>
                        <td>As atividades propostas para o projeto são passíveis de dispensa, ou licenciamento ambiental (conforme Anexo I da Resolução CONAMA n° 237 - IN-BB 671) ?</td>
                        <td>
                          <select v-model="relatorioAnalise.ds_licenciamento_conforme" class="form-control" name="ds_licenciamento_conforme">
                            <option :value="opcao" v-for="opcao in opcoes">{{opcao}}</option>
                          </select>
                        </td>
                      </tr>
                      <tr>
                        <td>Qual documentação foi apresentada (se for o caso) ?</td>
                        <td>
                          <input v-model="relatorioAnalise.ds_licenciamento_documentacao" name="ds_titulo" class="form-control" id="ds_licenciamento_documentacao" type="text" maxlength="255">
                        </td>
                      </tr>
                      </tbody>
                    </table>
                    <div class="nao_imprimir">
                      <textarea-autosize v-model="relatorioAnalise.ds_licenciamento_observacoes" placeholder="Descreva qual a documentação apresentada, inexigibilidade ou dispensa, conforme o caso." name="ds_licenciamento_observacoes" v-resizable class="form-control ressaltar juntos"></textarea-autosize>
                    </div>
                    <div v-html="relatorioAnalise.ds_licenciamento_observacoes" class="imprimir bloco_texto"></div>
                  </div>


<!-- Enquadramento e parecer juridico --------------------------------------------------------------------------------------------->
                  <div class="box-body">
                    <label class="control-label">Enquadramento e Parecer jurídico</label>
                    <table class="table table-condensed table-bordered table-striped">
                      <tbody>
                      <tr>
                        <td>A proposta foi enquadrada no controle orçamentário da FBB ?</td>
                        <td>
                          <select v-model="relatorioAnalise.ds_enquadramento_orcamento" class="form-control" name="ds_enquadramento_orcamento">
                            <option :value="opcao" v-for="opcao in opcoes">{{opcao}}</option>
                          </select>
                        </td>
                      </tr>
                      <tr>
                        <td>Número da FEP?
                        </td>
                        <td class="text-center">
                          <span v-if="_.has(proposta, 'fep') && _.has(proposta.fep, 'numero') && _.has(proposta.fep, 'ano')" class="form-control" style="border: none" name="ds_enquadramento_fep" id="ds_enquadramento_fep">{{proposta.fep.ano + "/" + proposta.fep.numero}}</span>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          {{faixaDoProjeto.faixa === 1 ? 'Foi utilizada a minuta padrão aprovada para projetos abaixo de R$ 100 mil?' :
                          'Foi utilizada a minuta padrão aprovada que contemple as necessidades do projeto ?'}}
                        </td>
                        <td>
                          <select v-model="relatorioAnalise.ds_enquadramento_minuta" class="form-control" name="ds_enquadramento_minuta">
                            <option :value="opcao" v-for="opcao in opcoes">{{opcao}}</option>
                          </select>
                        </td>
                      </tr>
                      </tbody>
                    </table>
                    <div class="nao_imprimir">
                      <textarea-autosize @input="resizable" v-model="relatorioAnalise.ds_enquadramento_observacoes" placeholder="Informe o embasamento jurídico, parecer e/ou minuta padrão utilizados para amparo legal da minuta de convênio." name="ds_enquadramento_observacoes" v-resizable class="form-control ressaltar juntos"></textarea-autosize>
                    </div>
                    <div v-html="relatorioAnalise.ds_enquadramento_observacoes" class="imprimir bloco_texto"></div>
                  </div>

                  <!-- ODS --------------------------------------------------------------------------------------------->
                  <div class="box-body">
                    <label class="control-label">Objetivos de Desenvolvimento Sustentável (ODS)</label>
                    <table class="table table-condensed table-bordered table-striped">
                        <div v-if="odsCadastrado.length > 0" class="column all-start gap-5 container-padding">
                          <div v-for="ods in odsCadastrado">
                            {{ ods.descricao }}
                            <div v-for="meta in ods.metasDescricao">
                              <i>Meta {{ meta.descricao }}</i>
                            </div>
                          </div>
                        </div>
                        <div v-else class="column all-start gap-5 container-padding">
                          Não Possui ODS cadastrado.
                        </div>
                    </table>
                  </div>

                  <!-- Tecnologia Social --------------------------------------------------------------------------------------------->
                  <div class="box-body">
                    <label class="control-label">Tecnologia Social</label>
                    <table class="table table-condensed table-bordered table-striped">
                      <div v-if="possuiTecnologiaSocial" class="column all-start gap-5 container-padding">
                        <div v-for="tecnologia in tecnologiasCadastradas">
                          {{tecnologia.nome}}
                        </div>
                      </div>
                      <div v-else class="column all-start gap-5 container-padding">
                        Não possui Tecnologias cadastradas.
                      </div>
                    </table>
                  </div>

                  <!-- Público-alvo Previsto --------------------------------------------------------------------------------------------->
                  <div class="box-body">
                    <label class="control-label">Público-Alvo Previsto</label>
                    <table class="table table-condensed table-bordered table-striped">
                      <div v-if="publicoAlvoDefinicoes.length > 0" class="column  all-start gap-5 container-padding">
                        <div v-for="definicao in publicoAlvoDefinicoes">
                           - {{definicao}}
                        </div>
                      </div>
                      <div v-else class="column all-start gap-5 container-padding">
                        Não possui Público-Alvo Previsto cadastrado.
                      </div>
                    </table>
                  </div>

                  <!-- Indicativo de Avaliação --------------------------------------------------------------------------------------------->
                  <div class="box-body">
                    <label class="control-label">Avaliação do Projeto</label>
                    <div v-if="questoesAvaliacao.length > 0">
                      <table class="table table-condensed table-bordered table-striped">
                        <div class="column all-start gap-5 container-padding">
                          <b>{{questoesAvaliacao[0].resposta}}</b>
                        </div>
                      </table>
                      <table class="table table-condensed table-bordered table-striped">
                        <thead>
                          <tr>
                            <!-- <th>ID Questão</th> -->
                            <th>Questão</th>
                            <th>Resposta</th>
                            <!-- <th>Pontuação</th>
                            <th>Peso</th> -->
                          </tr>
                        </thead>
                        <tbody>
                          <tr v-for="(questao, index) in questoesAvaliacao" :key="index" v-if="index > 0">
                            <!-- <td>{{ questao.id_questao }}</td> -->
                            <td>{{ questao.questao || 'N/A' }}</td>
                            <td>{{ questao.resposta }}</td>
                            <!-- <td>{{ questao.pontuacao }}</td>
                            <td>{{ questao.peso || 'N/A' }}</td> -->
                          </tr>
                        </tbody>
                      </table>
                    </div>

                    <div v-else class="column all-start gap-5 container-padding">
                      -
                    </div>
                  </div>


<!-- Considerações finais --------------------------------------------------------------------------------------------->
                  <div class="box-body juntos" v-if="ehPIS || ehVoluntariado">
                    <label class="control-label">Considerações finais</label>
                    <table class="bloco">
                      <tr>
                        <td>
                          <div class="nao_imprimir">
                            <textarea-autosize @input="resizable" v-model="relatorioAnalise.ds_consideracoes_finais" rows="7" v-resizable name="ds_consideracoes_finais" class="form-control"></textarea-autosize>
                          </div>
                          <div v-html="relatorioAnalise.ds_consideracoes_finais" class="imprimir bloco_texto"></div>
                        </td>
                      </tr>
                    </table>
                  </div>


<!-- Proposta --------------------------------------------------------------------------------------------->
                  <div class="juntos">
                    <div class="box-body">
                      <div class="box-header">
                        <label class="control-label">Proposta</label>
                      </div>
                      <table class="bloco">
                        <tr>
                          <td>
                            <div class="nao_imprimir">
                              <textarea-autosize @input="resizable" v-model="relatorioAnalise.ds_parecer" rows="7" v-resizable name="ds_parecer" class="form-control"></textarea-autosize>
                            </div>
                            <div v-html="relatorioAnalise.ds_parecer" class="imprimir bloco_texto"></div>
                          </td>
                        </tr>
                      </table>
                    </div>


<!-- Despacho --------------------------------------------------------------------------------------------->
                    <div class="box-body">
                      <div class="box-header">
                        <label class="control-label" v-if="ehVoluntariado">Despacho dos Gerentes de Divisão</label>
                        <label class="control-label" v-else>Despacho do {{faixaDoProjeto.alcada}}</label>
                      </div>

                      <table class="bloco">
                        <tr>
                          <td>
                            <div class="nao_imprimir">
                              <textarea-autosize @input="resizable" v-model="relatorioAnalise.ds_despacho_observacoes" rows="7" v-resizable name="ds_despacho_observacoes" class="form-control"></textarea-autosize>
                            </div>
                            <div v-html="relatorioAnalise.ds_despacho_observacoes" class="imprimir bloco_texto"></div>
                          </td>
                        </tr>
                      </table>
                    </div>

                  </div>

                </div>

              </div>

            </fieldset>

          </div>

        </div>

      </div>

    </section>

  </div>

</template>

<script>
  import html2pdf from 'html2pdf.js'
  import {mapGetters} from 'vuex'
  import PublicoAlvo from '../modules/publicoAlvo'
  import ObjetivoEspecifico from '../modules/objetivoEspecifico'
  import Metas from '../modules/metas'
  import moment from 'moment'

  export default {
    name: 'relatorio-analise',
    components: {
      PublicoAlvo,
      Metas,
      ObjetivoEspecifico
    },
    data () {
      return {
        riscoCalculado: '',
        showgrid: true,
        somenteLeitura: false,
        relatorioAnalise: {
          itensFbb: [],
          itensContrapartida: [],
          itensParceiro: [],
          dirigentes: [],
          ds_regularidade_rating: {
            ds_descricao: null
          },
          ds_indicadores_resultado: null,
          ds_acoes_comunicacao: null,
          ds_indicadores_publico: []
        },
        loading: {
          show: false
        },
        contra: {
          conta: {
            obs: ''
          }
        },
        editavel: false,
        ds_regularidade_ratingSim: false,
        ds_execucao_prazoSim: false,
        ds_execucao_relatoriosSim: false,
        ds_indicadores_participantesSim: false,
        ds_enquadramento_fepSim: false,
        adiantamento: [],
        todasPropostas: [],
        ds_indicadores_participantesCiente: false,
        proposta: {},
        projetoSuperior: '',
        participantes: 0,
        opcoes: ['Sim', 'Não', 'N/A'],
        totalFBB: 0,
        totalContrapartida: 0,
        totalParceiro: 0,
        meta: {},
        perguntas: {},
        metaIndex: [],
        publicosAlvo: {},
        publico: [],
        formasContratacao: [],
        editando: '',
        contrapartida: [{
          item: null,
          valor: null
        }],
        faixasInvestimento: [{faixa: 1, de: 0, para: 100000, alcada: 'Comitê de Desenvolvimento Social'}, {faixa: 2, de: 100000.01, para: 300000.00, alcada: 'Comitê de Desenvolvimento Social'}, {faixa: 3, de: 300000.01, para: 1000000000, alcada: 'Comitê Estratégico'}],
        ehPIS: false,
        ehVoluntariado: false,
        ehEdital: false,
        ehEditalMN: false,
        faixaDoProjeto: {},
        formaJuridica: '',
        atividadeForm: {
          nr_periodo_final: null,
          itens_orcamentos: [],
          metas: {},
          ds_nome: '',
          nr_periodo_inicial: null,
          ds_documento_comprobatorio: ''
        }, // formulário de edição e nova meta os dados serão guardados aqui
        atividadeTabela: {}, // Guarda o valor do objeto atividade antes da edição
        opcao_qtde_assinaturas: 3,
        // Demanda 65294 - Salvar dados do relatório em [Imprimir] e [Sair do Relatório]
        sairRelatorio: false,
        odsCadastrado: [],
        odsSelecionado: [],
        tecSocialCadastrado: [],
        publicoAlvoCadastrado: [],
        odsTodaBase: [],
        tecnologiasCadastradas: [],
        publicoAlvoPrevisto: [],
        publicoAlvoDefinicoes: [],
        definicaoPublicoAlvo: [],
        possuiTecnologiaSocial: false,
        questoesAvaliacao: [],
        tabID: '',
        navegador: '',
        usuarioSalvamento: ''
      }
    },
    props: ['propsProposta'],
    computed: {
      ...mapGetters([
        'usuarioLogado'
      ]),
      // Inclusão de função para imprimir a data de vigência que estava quebrando MM e DD
      dataFinalProjeto: function () {
        if (this.proposta.dt_assinatura_convenio) {
          return moment(this.proposta.dt_assinatura_convenio).add(this.proposta.periodo_vigencia, 'M').format('MM/YYYY')
        } else {
          if (this.proposta.dt_data_inicial) {
            return moment(this.proposta.dt_data_inicial).add(this.proposta.periodo_vigencia, 'M').format('MM/YYYY')
          }
        }
      }
    },
    watch: {
      propsProposta: function () {
        this.proposta = this.propsProposta
      }
    },
    mounted () {
      // autosize(document.querySelectorAll('textarea'))
      this.buscaPublicoAlvo()
    },
    created: async function () {
      this.initLogVar()
      await this.buscaProposta()
      // Juliano 20200904 - migrei a carga da buscaEntidades para o corpo da função do buscaProposta
      // await this.buscaEntidades()
    },
    methods: {
      async closewindow (salvar) {
        // Demanda 65294 - Salvar dados do relatório em [Imprimir] e [Sair do Relatório]
        this.sairRelatorio = true
        if (salvar === false) {
          close()
        } else {
          this.gravaRelatorio()
        }
      },
      initLogVar () {
        // Demanda 65294 - Salvar dados do relatório em [Imprimir] e [Sair do Relatório]
        if (!sessionStorage.getItem('tabId')) {
          const tabId = Date.now().toString() + Math.random().toString(36).substr(2)
          sessionStorage.setItem('tabId', tabId)
        }
        this.tabID = sessionStorage.getItem('tabId')
        this.navegador = this.verificaNavegador()
        this.usuarioSalvamento = this.usuarioLogado.ds_login + ' ' + this.usuarioLogado.ds_nome_usuario
        console.log('Logvar', this.tabID, this.navegador, this.usuarioSalvamento)
      },
      verificaNavegador () {
        console.log('Verifica Navegador...')
        const ua = navigator.userAgent
        let navegador = ''
        if (ua.includes('Chrome') && !ua.includes('Edg') && !ua.includes('OPR')) {
          navegador = 'Chrome'
        } else if (ua.includes('Firefox')) {
          navegador = 'Firefox'
        } else if (ua.includes('Safari') && !ua.includes('Chrome')) {
          navegador = 'Safari'
        } else if (ua.includes('Edg')) {
          navegador = 'Edge'
        } else if (ua.includes('OPR') || ua.includes('Opera')) {
          navegador = 'Opera'
        } else {
          navegador = 'Desconhecido'
        }
        return navegador
      },
      ehNulo (valor, opcao) {
        return _.isNull(valor) || _.isNil(valor) || _.isUndefined(valor) ? opcao : valor
      },
      haObjetivoMeta (listaOrigem, vinculo, descricao) {
        let c = 0
        _.forEach(_.map(listaOrigem, vinculo), function (o) {
          _.forEach(o, function (d) {
            c += (_.has(d, 'ds_descricao') && d.ds_descricao === descricao) || (_.has(d, 'descricao') && d.descricao === descricao) ? 1 : 0
          })
        })
        return c > 0
      },
      async buscaProposta () {
        console.log('BUSCANDO PROPOSTA ...')
        this.loading.show = true
        // 65695 - Gravar risco calculado no campo ds_risco_calculado na tb_proposta
        this.buscarBaseODS()
        this.consultaTecnologiasCadastradas()
        this.buscaDefinicaoPublicoAlvo()
        this.buscaIndicadorAvaliacao()
        this.consultaRiscoCalculado()
        await axiosLaravel.get('propostas/' + this.$route.params.id).then(async (response) => {
          this.proposta = response.data
          this.somenteLeitura = (_.has(this.proposta, 'ds_situacao_erp') && !_.isNull(this.proposta.ds_situacao_erp) && !_.includes(['ANA', 'DEF', 'OPE'], this.proposta.ds_situacao_erp)) || (this.proposta.ds_fase === 'DEFERIMENTO' || this.proposta.ds_fase === 'APROVACAO_PROJETO')
          this.carregaRating()
          this.carregarProjetoDuplicador()
          // Inclusão do bustaEntidades a partir deste ponto e não do método Create
          this.buscaEntidades()
          if (this.proposta.relatorio_analise) {
            this.relatorioAnalise = JSON.parse(this.proposta.relatorio_analise)
            // await this.buscaDadosProposta()  // Desativado a pedido do Thiago
          }
          // Demanda 64783 - Inclusão do risco da proposta na visualização do relatório - correção
          if (this.somenteLeitura) {
            await axiosLaravel.put('propostas/' + this.$route.params.id + '/calcula-risco').then(async (response) => {
              this.riscoCalculado = response.data
              this.$forceUpdate()
            })
          }

          this.proposta['projetoAprovado'] = (_.has(this.proposta, 'ds_situacao_erp') && !_.isNull(this.proposta.ds_situacao_erp) &&
            !_.includes(['ANA', 'DEF', 'ANU', 'CAN', 'IND', 'ENC', 'DLG', 'JUD', 'OPE'], this.proposta.ds_situacao_erp))
          let metas = []
          let objetivosFormatado = ''
          let objetivoGeral = ''
          let objetivoEspecificoFinal = ''
          let metasFormatado = ''
          let metasFinal = ''
          if (this.proposta.ds_indicadores_resultado) {
            this.relatorioAnalise.ds_indicadores_resultado = _.cloneDeep(this.proposta.ds_indicadores_resultado)
          }
          if (this.proposta.ds_acoes_comunicacao) {
            this.relatorioAnalise.ds_acoes_comunicacao = _.cloneDeep(this.proposta.ds_acoes_comunicacao)
          }
          if (this.proposta.questionario_respostas) {
            if (this.proposta.questionario_respostas.rating) {
              this.relatorioAnalise.ds_regularidade_rating = this.proposta.questionario_respostas.rating
            }
          }
          if (this.proposta.ds_numero_fep) {
            this.relatorioAnalise.ds_enquadramento_fep = this.proposta.ds_numero_fep
          }
          let itemFBB = []
          let itemParceria = []
          this.proposta.atividades.forEach((atividade) => {
            // se a atividade tem itens_orcamento sem valor ignora!
            if (atividade.itens_orcamentos) {
              atividade.itens_orcamentos.forEach((item) => {
                if (('' + item.origem) === '1') {
                  this.relatorioAnalise.itensFbb.push(item)
                  itemFBB.push(item)
                  this.totalFBB += (item.valor_unitario * item.quantidade)
                }
                if (('' + item.origem) === '2') {
                  if (this.relatorioAnalise.itensContrapartida) {
                    this.relatorioAnalise.itensContrapartida.push(item)
                  } else {
                    for (let i = 0; i < this.relatorioAnalise.itensContrapartida.length; i++) {
                      if (this.relatorioAnalise.itensContrapartida[i].item.obs === null) {
                        this.relatorioAnalise.itensContrapartida[i].item.obs = ''
                      }
                    }
                  }
                  this.totalContrapartida += (item.valor_unitario * item.quantidade)
                }
                if (('' + item.origem) === '5') {
                  this.relatorioAnalise.itensParceiro.push(item)
                  itemParceria.push(item)
                  this.totalParceiro += (item.valor_unitario * item.quantidade)
                }
              })
            }
          })
          //
          // let agrupadoContasFBB = _.groupBy(itemFBB, function (g) { return g.conta_financeira.numero_conta + ' - ' + g.conta_financeira.descricao })
          let agrupadoContasFBB = _.groupBy(itemFBB, function (g) { return g.conta_financeira.descricao })
          let contasValorFBB = []
          _.forEach(agrupadoContasFBB, function (conta, contaNome) {
            contasValorFBB.push({ 'conta': contaNome, 'valor': _.sumBy(conta, function (item) { return parseFloat(parseFloat(item.quantidade) * parseFloat(item.valor_unitario)) }) })
          })
          this.relatorioAnalise.itensFbb = contasValorFBB
          //
          let agrupadoContasParcerias = _.groupBy(itemParceria, function (g) { return g.conta_financeira.descricao })
          let contasValorParcerias = []
          _.forEach(agrupadoContasParcerias, function (conta, contaNome) {
            contasValorParcerias.push({ 'conta': contaNome, 'valor': _.sumBy(conta, function (item) { return parseFloat(parseFloat(item.quantidade) * parseFloat(item.valor_unitario)) }) })
          })
          this.relatorioAnalise.itensParceiro = contasValorParcerias
          //
          let somenteComContaFinanceira = _.filter(this.relatorioAnalise.itensContrapartida, function (c) { return _.has(c.conta_financeira, 'numero_conta') && _.has(c.conta_financeira, 'descricao') })
          let ordenado = _.sortBy(somenteComContaFinanceira, ['item.ds_code'])
          let ordenadoAgrupado = _.groupBy(ordenado, function (value) {
            return value.conta_financeira.descricao
          })
          for (let key in ordenadoAgrupado) {
            ordenadoAgrupado[key] = ordenadoAgrupado[key].reduce(function (acc, curr) {
              acc[curr.item.ds_code + ' - ' + curr.item.ds_description] ? acc[curr.item.ds_code + ' - ' + curr.item.ds_description] += (curr.valor_unitario * curr.quantidade) : acc[curr.item.ds_code + ' - ' + curr.item.ds_description] = (curr.valor_unitario * curr.quantidade)
              return acc
            }, [])
          }
          let myNewArray = []
          myNewArray = _.map(ordenadoAgrupado, (item, key) => {
            return {
              conta: key,
              item: _.mapValues(item, (value, key) => {
                return {
                  item: key,
                  valor: value
                }
              })
            }
          })
          this.relatorioAnalise.itensContrapartida = _.cloneDeep(myNewArray)
          objetivosFormatado = _.map(this.proposta.objetivos, 'ds_descricao')
          objetivosFormatado = objetivosFormatado.join(',')
          objetivoEspecificoFinal = 'Objetivo(s) Específico(s): \n' + objetivosFormatado.split(',').join('\n')
          objetivoGeral = 'Objetivo Geral: \n' + this.proposta.ds_objetivo_geral
          //
          this.proposta.metas.forEach((meta) => {
            metas.push(meta.ds_descricao)
          })
          metasFormatado = _.map(metas).join(',')
          metasFinal = 'Meta(s): \n' + metasFormatado.split(',').join('\n')
          //
          this.relatorioAnalise.ds_indicadores_resumo = objetivoGeral + '\n\n' + objetivoEspecificoFinal + '\n\n' + metasFinal
          if (this.proposta.publicos_alvo) {
            for (let i = 0; i < this.proposta.publicos_alvo.length; i++) {
              this.participantes = this.participantes + this.proposta.publicos_alvo[i].nr_participantes_diretos
            }
            this.relatorioAnalise.ds_indicadores_participantes = parseInt(this.participantes)
            this.relatorioAnalise.ds_indicadores_publico = this.proposta.publicos_alvo[0].fonte
          }
          //
          this.relatorioAnalise.ds_execucao_prazo = this.proposta.nr_periodos
          this.relatorioAnalise.ds_execucao_relatorios = this.proposta.ds_periodicidade_formulario
          if (this.proposta.ds_alcada) {
            this.relatorioAnalise.ds_alcada = this.proposta.ds_alcada
          }
          //
          let totalProjeto = this.totalFBB + this.totalParceiro
          this.faixaDoProjeto = _.find(this.faixasInvestimento, function (faixa) { return faixa.de <= totalProjeto && totalProjeto <= faixa.para })
          // Suporte 62484 - inclusão do projeto superior 18206 para enquadrar nos mesmos campos do PIS
          this.ehPIS = _.includes(['15114', '15120', '15126', '15132', '15094', '15575', '18140', '18206'], ('' + this.proposta.superiorSapiens.numprj))
          this.ehEditalMN = _.includes(['18286'], ('' + this.proposta.superiorSapiens.numprj))
          this.ehVoluntariado = _.includes(['15577', '18182'], ('' + this.proposta.superiorSapiens.numprj))
          // console.log('voluntariado?', this.ehVoluntariado)
          if (_.includes([1, 2], this.faixaDoProjeto.faixa)) {
            this.riscoCalculado = 'C'
          }
          this.$forceUpdate()
          this.loading.show = false
        })
          .catch((error) => {
            this.loading.show = false
            console.log('ERRO: ', error)
            this.$root.trataErro(error)
            console.log('ERRO: ', error)
          })
      },
      carregarProjetoDuplicador () {
        axiosLaravel.get('projeto/sapiens/' + this.proposta.nr_projeto_duplicacao).then((response) => {
          this.proposta['duplicadorSapiens'] = response.data[0]
          this.carregarProjetoSuperior()
        })
          .catch((error) => {
            this.$snotify.clear()
            this.$root.trataErro(error)
            console.log('ERRO: ', error)
          })
      },
      carregarProjetoSuperior () {
        axiosLaravel.get('projeto/sapiens/' + this.proposta.duplicadorSapiens.prjsup).then((response) => {
          this.proposta['superiorSapiens'] = response.data[0]
          this.projetoSuperior = this.proposta.superiorSapiens.numprj + ' - ' + this.proposta.superiorSapiens.nomprj
        })
          .catch((error) => {
            this.$snotify.clear()
            this.$root.trataErro(error)
            console.log('ERRO: ', error)
          })
      },
      async buscarBaseODS () {
        this.loading.show = true
        await axiosLaravel.get('/ods').then((response) => {
          // this.baseODS = []
          this.initListaODS(response.data)
          this.carregarODS()
          // this.loading.show = false
          this.$forceUpdate()
        })
          .catch((error) => {
            // this.loading.show = false
            this.$root.trataErro(error)
            console.log('ERRO: ', error)
          })
      },
      initListaODS (lista) {
        let ods = lista
        ods.forEach(itemODS => {
          // Cria objeto de grupo
          let odsItem = {
            odsId: itemODS.id,
            ods: itemODS.descricao,
            metas: []
          }
          itemODS.metas.forEach(meta => {
            let metaItem = {
              numeroMeta: meta.numero_meta,
              descricao: meta.descricao,
              odsFk: meta.ods_fk
            }
            odsItem.metas.push(metaItem)
          })
          this.odsTodaBase.push(odsItem)
          this.$forceUpdate()
        })
      },
      async carregarODS () {
        await axiosLaravel.get('/ods/getMetasODS/' + this.$route.params.id).then((response) => {
          let cadastro = response.data
          this.loading.show = true
          if (cadastro.length > 0) {
            let idsODs = [...new Set(cadastro.map(item => item.ods_fk))]
            idsODs.forEach(id => {
              let ods = {
                idOds: id,
                descricao: '',
                metas: ''
              }
              this.odsTodaBase.forEach(item => {
                if (item.odsId === Number(id)) {
                  ods.descricao = item.ods
                }
              })
              cadastro.forEach(selecionado => {
                if (selecionado.ods_fk === id) {
                  ods.metas = ods.metas + ', ' + selecionado.numero_meta
                }
              })
              ods.metas = ods.metas.substring(1)
              this.odsCadastrado.push(ods)
            })
            this.$forceUpdate()
            this.loading.show = true
            this.odsCadastrado.forEach(ods => {
              let metas = ods.metas.split(', ')
              let metasDescricao = []
              metas.forEach(meta => {
                // Cria lista de selecionados
                let selecionado = {
                  descricao: '',
                  numeroMeta: '',
                  odsFk: ods.idOds
                }
                selecionado.numeroMeta = meta.trim()
                this.odsTodaBase.forEach(ods => {
                  ods.metas.forEach(meta => {
                    if (meta.numeroMeta === selecionado.numeroMeta) {
                      selecionado.descricao = meta.descricao
                    }
                  })
                })
                metasDescricao.push(selecionado)
              })
              ods.metasDescricao = metasDescricao
            })
          } else {
            this.odsCadastrado = []
          }
        })
          .catch((error) => {
            this.$snotify.clear()
            console.log('ERRO: ', error)
            this.$root.trataErro(error)
            console.log('ERRO: ', error)
          })
      },
      async consultaTecnologiasCadastradas () {
        this.loading.show = true
        await axiosLaravel.get('/tecnologiasocial/consultarTecnologiaPorProposta/' + this.$route.params.id).then((response) => {
          this.tecnologiasCadastradas = response.data
          if (response.data.length > 0) {
            this.possuiTecnologiaSocial = true
          } else {
            this.possuiTecnologiaSocial = false
          }
          this.loading.show = false
          this.$forceUpdate()
        })
        .catch((error) => {
          this.$root.trataErro(error)
          console.log('ERRO: ', error)
          this.loading.show = false
          this.$forceUpdate()
        })
      },
      async buscaDefinicaoPublicoAlvo () {
        this.loading.show = true
        await axiosLaravel.get('definicaoparticipante').then((response) => {
          this.definicaoPublicoAlvo = response.data
          this.buscaPublicoAlvoPrevisto()
        })
        .catch((error) => {
          this.$root.trataErro(error)
          console.log('ERRO: ', error)
          this.loading.show = false
        })
      },
      async buscaPublicoAlvoPrevisto () {
        this.loading.show = true
        await axiosLaravel.get('/definicaoparticipante/getPrevistosProjeto/' + this.$route.params.id).then((response) => {
          this.publicoAlvoPrevisto = response.data
          this.publicoAlvoPrevisto.forEach(item => {
            this.definicaoPublicoAlvo.forEach(definicao => {
              definicao.subgrupos.forEach(subgrupo => {
                if (subgrupo.id === item) {
                  this.publicoAlvoDefinicoes.push(subgrupo.subgrupo)
                }
              })
            })
          })
          this.loading.show = false
          this.$forceUpdate()
        })
        .catch((error) => {
          this.$root.trataErro(error)
          console.log('ERRO: ', error)
          this.loading.show = false
          this.$forceUpdate()
        })
      },
      async buscaIndicadorAvaliacao () {
        this.loading.show = true
        await axiosLaravel.get('/avaliacao/carregarRespostasRelatorioAnalise/' + this.$route.params.id).then((response) => {
          this.questoesAvaliacao = response.data
          this.loading.show = false
          this.$forceUpdate()
        })
        .catch((error) => {
          this.$root.trataErro(error)
          console.log('ERRO: ', error)
          this.loading.show = false
          this.$forceUpdate()
        })
      },
      async buscaEntidades () {
        let currentDate = new Date()
        let hoje = moment(currentDate).format('YYYYMMDD')
        axiosLaravel.get('entidades/' + this.proposta.entidade.id).then((response) => {
          this.proposta.entidade = response.data
          let codigo = this.proposta.entidade.fk_forma_juridica
          let descricao = this.ehNulo(_.find(this.$store.state.formasJuridicas, ['codigo', codigo])['descricao'], '!')
          this.formaJuridica = codigo + ' - ' + descricao
          let array = _.filter(response.data.dirigentes, function (o) {
            if (o.bt_assinatura_entidade === 1 && o.bt_ativo === 1 && o.bt_representante_legal === 1 && o.bt_assinatura_requerida === 1) {
              let dataInicial = moment(o.dt_inicio_mandato).format('YYYYMMDD')
              let dataFinal = moment(o.dt_fim_mandato).format('YYYYMMDD')
              if (dataInicial <= hoje && hoje <= dataFinal) {
                o.ds_cpf = ('00000000000' + o.ds_cpf).slice(-11)
                return o
              }
            }
          })
          this.proposta.entidade.dirigentes = array
          this.$forceUpdate
        })
          .catch((error) => {
            if (error) {
              this.$snotify.clear()
              this.$root.trataErro(error)
              console.log('ERRO: ', error)
            }
          })
      },
      buscaPublicoAlvo () {
        axiosLaravel.get('publico-alvo-fonte').then((response) => {
          this.publicosAlvo = response.data
        })
          .catch((error) => {
            this.$root.trataErro(error)
            console.log('ERRO: ', error)
          })
      },
      buscaDadosProposta () {
        if (this.proposta.entidade) {
          let array = []
          axiosLaravel.get('/entidades/' + this.proposta.entidade.id + '/propostas').then((response) => {
            for (let i = 0; i < response.data.length; i++) {
              if (response.data[i].ds_codigo_projeto_erp !== null) {
                array.push(response.data[i])
              }
            }
            this.todasPropostas = _.cloneDeep(array)
            this.$forceUpdate()
          })
            .catch((error) => {
              if (error) {
                this.$snotify.clear()
                this.$root.trataErro(error)
                console.log('ERRO: ', error)
              }
            })
        }
      },
      atualizaProposta () {
        let bc = new BroadcastChannel('proposta-' + this.$route.params.id)
        console.log('>>>> BROADCAST: ' + 'proposta-' + this.$route.params.id)
        let dadosRelatorio = JSON.stringify(this.relatorioAnalise)
        bc.postMessage({acao: 'set', objeto: 'proposta.relatorio_analise', id: this.$route.params.id, valor: dadosRelatorio})
        // console.log('|--> set:', {acao: 'set', objeto: 'proposta.relatorio_analise', id: this.$route.params.id, valor: dadosRelatorio})
        bc.postMessage({acao: 'salvarProposta', id: this.$route.params.id})
        // console.log('|--> salvando proposta:', {acao: 'salvarProposta', id: this.$route.params.id})
        bc.close()
      },
      gravaRelatorio () {
        this.$validator.validateAll().then((result) => {
          if (result) {
            let idProposta = this.$route.params.id
            this.$snotify.async('Salvando o Relatório da Análise. Por favor, aguarde...', {timeout: 0})
            axiosLaravel.post('propostas/grava-relatorio/' + idProposta, this.relatorioAnalise).then((response) => {
              this.atualizaProposta()
              this.$snotify.clear()
              this.$snotify.success('Relatório da Análise salvo com sucesso')
              // Grava o Log do Relatótio de Analise
              this.gravarLogRelatorioAnalise()
               // Demanda 65294 - Salvar dados do relatório em [Imprimir] e [Sair do Relatório]
              // if (this.sairRelatorio) {
              //   close()
              // }
            })
              .catch((error) => {
                this.$snotify.clear()
                this.$root.trataErro(error)
                console.log('ERRO: ', error)
              })
          } else {
            if (this.$validator.errors.items.length > 0) {
              this.$validator.errors.items.forEach((item) => {
                this.$snotify.error('O campo ' + item.field + ' não foi preenchido. Favor verificar')
              })
            }
          }
        })
      },
      async gravarLogRelatorioAnalise () {
        let obj = {
          idProposta: this.$route.params.id,
          relatorioAnalise: this.relatorioAnalise,
          navegador: this.navegador,
          usuarioSalvamento: this.usuarioSalvamento,
          tabID: this.tabID
        }
        this.$snotify.async('Salvando o LOG do Relatório da Análise. Por favor, aguarde...', {timeout: 0})
        await axiosLaravel.post('propostas/gravaLogSnapshotRelatorioAnalise/', obj).then((response) => {
          this.$snotify.clear()
          this.$snotify.success(response.data)
          if (this.sairRelatorio) {
            close()
          }
        })
          .catch((error) => {
            this.$snotify.clear()
            this.$root.trataErro(error)
            console.log('ERRO: ', error)
          })
      },
      imprimirRelatorio () {
        if (this.riscoCalculado === '' && !_.includes([1, 2], faixaDoProjeto.faixa)) {
          this.$snotify.clear()
          this.$snotify.warning('Atenção: Risco do Projeto ainda não calculdo')
        }
        // Demanda 65294 - Salvar dados do relatório em [Imprimir] e [Sair do Relatório]
        this.gravaRelatorio()
        window.print()
      },
      print () {
        let element = document.getElementById('relatorio_analise')
        let opt = {
          margin: 1,
          filename: 'myfile.pdf',
          image: {type: 'jpeg', quality: 0.98},
          html2canvas: {scale: 2},
          jsPDF: {unit: 'in', format: 'letter', orientation: 'portrait'}
        }
        html2pdf(element, opt)
      },
      passaParams (data) {
        for (let i = 0; i < this.relatorioAnalise.itensContrapartida.length; i++) {
          if (data.conta === this.relatorioAnalise.itensContrapartida[i].conta) {
            if (data.item.obs) {
              this.relatorioAnalise.itensContrapartida[i].item.obs = data.item.obs
            }
          }
        }
        // this.relatorioAnalise.itensContrapartida = _.cloneDeep(data)
        this.$forceUpdate()
        // console.log('depois', this.relatorioAnalise.itensContrapartida)
      },
      confirmacao (event) {
        if (event === true) {
          this.$swal({
            title: '<font color="red"><b>Confirmação!</b></font>',
            html:
              '<div align="left"> Estou ciente do conteúdo retornado automaticamente pelo sistema.' + '</div>',
            showCloseButton: true,
            showCancelButton: false,
            showLoaderOnConfirm: true,
            focusConfirm: false
          })
        }
      },
      carregaRating () {
        axiosLaravel.post('rating/carregar/', {'idProposta': this.proposta.id}).then(async (response) => {
          if (!_.isNil(response.data) && !_.isEmpty(response.data)) {
            _.set(this.proposta, 'rating', response.data)
          }
          this.$forceUpdate()
        })
          .catch((error) => {
            this.$root.trataErro(error)
            console.log('ERRO: ', error)
          })
      },
      // Demanda 64783 - Inclusão do risco da proposta na visualização do relatório - correção
      calculaRisco () {
        // 65695 - Gravar risco calculado no campo ds_risco_calculado na tb_proposta
        this.$snotify.async('Calculando risco da proposta...', {timeout: 0})
        axiosLaravel.put('propostas/' + this.$route.params.id + '/calcula-risco').then(async (response) => {
          this.riscoCalculado = response.data
          this.$snotify.clear()
          this.$forceUpdate()
          // 65695 - Gravar risco calculado no campo ds_risco_calculado na tb_proposta
          this.gravaRelatorio()
        }).catch(() => {
          this.$snotify.clear()
          this.$snotify.warning('Pendências na proposta: Falta preencher o Questionário de Risco e calcular o Rating da Entidade na edição da proposta.')
        })
      },
      // 65695 - Gravar risco calculado no campo ds_risco_calculado na tb_proposta
      consultaRiscoCalculado () {
        axiosLaravel.get('propostas/' + this.$route.params.id + '/consulta-risco-calculado').then(async (response) => {
          this.riscoCalculado = response.data
          this.$forceUpdate()
        })
      }
    }
  }
</script>

<style>

  @page:left{
    @bottom-left {
      content: "Page " counter(page) " of " counter(pages);
    }
  }

</style>

<style scoped>
  #relatorio_analise .titulo {
    margin: 10px;
    text-align: center;
  }

  #relatorio_analise .m0 {
    margin: 0px;
  }

  textarea {
    overflow: hidden !important;
    resize: none;
    padding-bottom: 2.0cm;
    width: 18cm;
  }

  img.logo_relatorio {
    display: none;
  }

  .bloco {
    width: 100% !important;
  }

  .rodape {
    display: none !important;
  }
  textarea {
    width: 100% !important;
  }

  #relatorio_analise .objetivo td:nth-child(1) {
    vertical-align: top;
  }
  #relatorio_analise .meta td:nth-child(1) {
    padding-left: 35px !important;
    vertical-align: top;
  }
  #relatorio_analise span.tag {
    padding: 0 10px 0 0;
    margin-right: 5px;
    color: silver;
    font-weight: bold;
    font-size: small;
  }
  #relatorio_analise .atencao {
    color: var(--cor-atencao);
    font-weight: bold;
  }
  /********************************************************************************************************************************************/

  @media print {

    .box-body {
      margin-bottom: 20px;
    }

    .bloco_texto {
      width: 100% !important;
      border: 1px solid #d2d6de;
      padding: 6px 12px;
      white-space: pre-wrap
    }

    div.nao_imprimir, span.nao_imprimir {
      display: none !important;
    }
    table.nao_imprimir {
      visibility: collapse !important;
    }

    div.imprimir, span.imprimir {
      display: block !important;
    }
    table.imprimir {
      visibility: visible !important;
    }

    * {
      font-size: 18px;
    }

    .control-label {
      text-transform: uppercase;
    }

    img.logo_relatorio {
      display: block;
    }

    tbody td:nth-child(n+2) {
      width: 100px;
    }

    .table {
      margin-bottom: 0px !important;
    }

    .ressaltar {
      font-weight: bold;
    }

    .juntos {
      page-break-inside: avoid;
    }

    .opcao {
      display: none;
    }

    select, input {
      border: 0;
      padding-left: 20px;
    }

    button {
      display: none;
    }

    .bloco {
      border: 1px solid #d2d6de;
    }

    .bloco textarea {
      border: 0;
    }

    .assinatura {
      display: block;
      text-align: center;
      border-top: 1px solid gray;
      width: 50%;
      margin: 50px 30% 10px 10%;
    }

    select::-ms-expand {
      display: none;
    }
    select{
      -webkit-appearance: none;
      appearance: none;
    }
    @-moz-document url-prefix(){
      .ui-select{border: 1px solid #CCC; border-radius: 4px; box-sizing: border-box; position: relative; overflow: hidden;}
      .ui-select select { width: 110%; background-position: right 30px center !important; border: none !important;}
    }

    @page {
      /*size: portrait;*/
      /*margin: 0;*/
    }

    body {
      background: white !important;
      /*margin: 2cm;*/
    }

    .rodape {
      position: fixed !important;
      bottom: 0 !important;
      width: 100% !important;
      display: block !important;
      margin-top: 10px;
      border-top: 1px solid gray;
      font-size: 10px;
      font-style: italic;
      padding: 0 10px;
      left: 0;
      right: 0;
      z-index: 1000;
    }

    .rodape .secao_esquerda {
      float: left;
      text-align: left;
      width: 35%;
    }
    .rodape .secao_centro {
      float: left;
      text-align: center;
      width: 30%;
    }
    .rodape div.secao_centro:after {
      content: "Pág. " counter(page) " de " counter(pages);
    }
    .rodape .secao_direita {
      float: right;
      text-align: right;
      width: 35%;
    }

    .content-wrapper, .box.box-primary {
      border: 0 !important;
    }

    #Header, #Footer { display: none !important; }

    #app .content-wrapper * {
      background: white !important;
    }

    .situacao_projeto {
      display: none;
    }

  }
</style>
