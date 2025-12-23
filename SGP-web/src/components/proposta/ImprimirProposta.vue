<template>
  <div class="content-wrapper">

    <vue-headful title="SGP - Impressão da Proposta"/>

    <div>
      <section class="content-header">
        <h1>Impressão da Proposta
          <!-- Botões -->
          <span v-if="bloqueiaBotoes === false">
            <g-button-ujarak color="warning" :disabled="false" @click.native="imprimirRelatorio" size="button--size-ss"><i class="fa fa-print" aria-hidden="true"></i> Imprimir </g-button-ujarak>
            <g-button-ujarak color="info" @click.native="onDownloadZIP" size="button--size-ss"><i class="fa fa-print" aria-hidden="true"></i> Baixar documentos </g-button-ujarak>
            <g-button-ujarak color="error" @click.native="closewindow" size="button--size-ss"><i class="fa fa-sign-out" aria-hidden="true"></i> Sair do relatório </g-button-ujarak>
          </span>
        </h1>
        <b-breadcrumb :items="[{text: 'Inicial', href: '/'}, {text: 'Proposta', href: '/proposta/lista'}, {text: 'Imprime', active: true}]"/>
      </section>



      <section class="content">

        <div class="row">

          <div id="proposta">

            <div class="col-md-12">

              <div class="box box-primary">
                <div v-show="loading.show" class="overlay" style="position: absolute; top: 0px; left: 0px; width: 100%; height: 100%; display: block;">
                  <i class="fa fa-refresh fa-spin"></i>
                </div>
                <table class="table imprimir">
                  <tr>
                    <td><img src="/static/img/logo-login.png" class="logo_relatorio"></td>
                    <td></td>
                    <td class="direita">
                      <span style="font-size: 40px !important">Proposta</span>
                    </td>
                  </tr>
                </table>

                <!-- Envio da proposta -->
                <div class="box-body"v-if="ultimaTarefaEntidade">
                  <span v-if="_.isUndefined(ultimaTarefaEntidade) || _.isNull(ultimaTarefaEntidade.termino)" class="ressaltar atencao">Essa proposta ainda não foi enviada para Fundação BB</span>
                  <span v-else>
                    Essa proposta foi enviada por
                    <span class="ressaltar atencao" v-if="ultimaTarefaEntidade.usuario">{{ultimaTarefaEntidade.usuario.ds_nome_usuario}}</span> em
                    <span class="ressaltar atencao">{{ultimaTarefaEntidade.termino | moment("DD/MM/YYYY")}}</span> às
                    <span class="ressaltar atencao">{{ultimaTarefaEntidade.termino | moment("HH:mm")}}</span>
                  </span>
                </div>


                <!-- Resumo do Projeto -->
                <div class="box-body" v-if="proposta">
                  <label class="control-label">Resumo do Projeto</label>
                  <div>
                    <table class="table table-condensed table-bordered m0" v-if="_.isString(proposta.ds_codigo_projeto_erp)">
                      <tbody>
                      <tr>
                        <td class="cabecalho w30">Número do Projeto</td>
                        <td class="ressaltar">{{proposta.ds_codigo_projeto_erp}}</td>
                      </tr>
                      </tbody>
                    </table>

                    <table class="table table-condensed table-bordered m0">
                      <tbody>
                      <tr>
                        <td class="cabecalho w30">Nome do Projeto</td>
                        <td class="ressaltar">{{proposta.ds_nome}}</td>
                      </tr>
                      </tbody>
                    </table>

                    <table class="table table-condensed table-bordered m0">
                      <tbody>
                      <tr>
                        <td class="cabecalho w30">Período de Realização do Projeto</td>
                        <td class="ressaltar">{{ehNulo(proposta.dt_assinatura_convenio, proposta.dt_data_inicial) | moment('MM/YYYY')}}  a  {{proposta.dataFinal}}  ({{proposta.nr_periodos}} meses)</td>
                      </tr>
                      </tbody>
                    </table>

                    <table class="table table-condensed table-bordered m0">
                      <tbody>
                      <tr>
                        <td class="cabecalho w30">Recursos do Projeto</td>
                        <td class="ressaltar">{{proposta.totalProjeto | real}}</td>
                      </tr>
                      </tbody>
                    </table>

                    <table class="table table-condensed table-bordered">
                      <thead>
                      <tr><th class="cabecalho">Fundação</th><th class="cabecalho">Proponente</th><th class="cabecalho">Terceiros</th></tr>
                      </thead>
                      <tbody>
                      <tr>
                        <td class="ressaltar">{{proposta.totalFBB | real}}</td>
                        <td class="ressaltar">{{proposta.totalCtrp | real}}</td>
                        <td class="ressaltar">{{proposta.totalParc | real}}</td>
                      </tr>
                      </tbody>
                    </table>

                    <table class="table table-condensed table-bordered m0">
                      <thead>
                      <tr><th colspan="2" class="cabecalho">Municípios de Desenvolvimento do Projeto</th></tr>
                      </thead>
                      <tbody>
                      <tr v-for="municipio in _.groupBy(proposta.municipalizacao, function (m) { return m.ds_municipio + '/' + m.ds_uf })">
                        <td class="ressaltar">{{municipio[0].ds_municipio}}</td>
                        <td class="ressaltar w10">{{municipio[0].ds_uf}}</td>
                      </tr>
                      </tbody>
                    </table>
                  </div>
                </div>



                <!-- Entidade -->
                <div class="box-body" v-if="proposta && proposta.entidade">
                  <label class="control-label">Entidade Proponente</label>
                  <div>
                    <table class="table table-condensed table-bordered">
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
                        <td class="ressaltar">{{(_.has(proposta.entidade, 'contato') && !_.isEmpty(proposta.entidade.contato)) ? (ehNulo(proposta.entidade.contato.ds_telefone, proposta.entidade.contato.ds_celular) | telefone) : ''}}</td>
                      </tr>
                      </tbody>
                    </table>

                    <table class="table table-condensed table-bordered m0">
                      <thead>
                      <tr>
                        <th v-if="proposta.entidade.endereco" class="cabecalho">Endereço{{(proposta.entidade.endereco.length > 1 ? 's' : '')}}</th>
                        <th class="cabecalho">Número</th>
                        <th class="cabecalho">Bairro</th>
                        <th class="cabecalho">Complemento</th>
                        <th class="cabecalho">Cidade</th>
                        <th class="cabecalho centralizado">UF</th>
                        <th class="cabecalho centralizado">CEP</th>
                      </tr>
                      </thead>
                      <tbody>
                      <tr v-for="endereco in proposta.entidade.endereco">
                        <td class="ressaltar">{{endereco.ds_rua}}</td>
                        <td class="ressaltar">{{endereco.ds_numero}}</td>
                        <td class="ressaltar">{{endereco.ds_bairro}}</td>
                        <td class="ressaltar">{{endereco.ds_complemento}}</td>
                        <td class="ressaltar">{{endereco.ds_cidade}}</td>
                        <td class="ressaltar centralizado">{{endereco.ds_estado}}</td>
                        <td class="ressaltar centralizado">{{endereco.ds_cep | cep}}</td>
                      </tr>
                      </tbody>
                    </table>
                  </div>
                </div>



                <!-- Lista de Dirigentes -->
                <div class="box-body"  v-if="proposta && proposta.entidade">
                  <label class="control-label">Representante Legal da Entidade (que assina pela entidade e tem mandato vigente)</label>

                  <div v-for="dirigente in proposta.entidade.dirigentes">
                    <table class="table table-condensed table-bordered lista">
                      <tbody>
                      <tr v-if="dirigente.cargo">
                        <td class="cabecalho">Nome</td>
                        <td class="ressaltar w30">{{dirigente.ds_nome}}</td>
                        <td class="cabecalho">Cargo</td>
                        <td v-if="dirigente.cargo.ds_descricao" class="ressaltar">{{dirigente.cargo.ds_descricao}}</td>
                        <td class="cabecalho">CPF</td>
                        <td class="ressaltar">{{dirigente.ds_cpf | cpf}}</td>
                        <td class="cabecalho">Final do Mandato</td>
                        <td class="ressaltar">{{dirigente.dt_fim_mandato | moment("L")}}</td>
                      </tr>
                      <tr v-if="dirigente.contato">
                        <td class="cabecalho">RG</td>
                        <td class="ressaltar">{{dirigente.ds_rg}} - {{dirigente.ds_orgao_emissor}}/{{dirigente.ds_uf}}</td>
                        <td class="cabecalho">Estado Civil</td>
                        <td class="ressaltar">{{dirigente.ds_estado_civil}}</td>
                        <td class="cabecalho">Profissão</td>
                        <td class="ressaltar">{{dirigente.ds_profissao}}</td>
                        <td class="cabecalho">Telefone</td>
                        <td class="ressaltar">{{dirigente.contato.ds_telefone | telefone}}</td>
                      </tr>
                      <tr v-if="dirigente.endereco">
                        <td class="cabecalho">Endereço</td>
                        <td class="ressaltar">{{dirigente.endereco.ds_rua}}, {{dirigente.endereco.ds_numero}}, {{dirigente.endereco.ds_bairro}}, {{dirigente.endereco.ds_complemento}}</td>
                        <td class="cabecalho">CEP</td>
                        <td class="ressaltar">{{dirigente.endereco.ds_cep | cep}}</td>
                        <td class="cabecalho">Cidade/UF</td>
                        <td class="ressaltar">{{dirigente.endereco.ds_cidade}} / {{dirigente.endereco.ds_uf}}</td>
                        <td class="cabecalho">E-mail</td>
                        <td class="ressaltar">{{dirigente.contato.ds_email}}</td>
                      </tr>
                      </tbody>
                    </table>
                  </div>
                </div>



                <!-- Responsável pela Proposta -->
                <div class="box-body" v-if="proposta">
                  <label class="control-label">Responsável pela Proposta</label>
                  <table class="table table-condensed table-bordered m0">
                    <thead>
                    <tr>
                      <td class="cabecalho">Nome</td>
                      <td class="cabecalho centralizado">CPF</td>
                      <td class="cabecalho centralizado">Contato</td>
                      <td class="cabecalho centralizado">E-mail</td>
                    </tr>
                    </thead>
                    <tbody>
                    <tr>
                      <td class="ressaltar">{{proposta.ds_nome_coordenador}}</td>
                      <td class="ressaltar centralizado">{{proposta.ds_cpf_coordenador | cpf}}</td>
                      <td class="ressaltar centralizado">{{ehNulo(proposta.ds_telefone_coordenador, proposta.ds_celular_coordenador) | telefone}}</td>
                      <td class="ressaltar centralizado">{{proposta.ds_email_coordenador}}</td>
                    </tr>
                    </tbody>
                  </table>
                </div>

                <!-- 71538 - Inclusao de campos na impressao da proposta -->
                <!-- Introdução do Projeto -->
                <div class="box-body" v-if="proposta">
                  <label class="control-label">Introdução da Entidade Proponente</label>
                  <!--<textarea-autosize v-resizable data-vv-as="Apresentação do Projeto" v-model="proposta.ds_apresentacao" class="form-control" rows="4" disabled="disabled"></textarea-autosize>-->
                  <div v-html="proposta.ds_introducao" class="caixa_texto"></div>
                </div>

                <!-- 71538 - Inclusao de campos na impressao da proposta -->
                <div class="box-body" v-if="proposta">
                  <label class="control-label">Resumo</label>
                  <!--<textarea-autosize v-resizable data-vv-as="Apresentação do Projeto" v-model="proposta.ds_apresentacao" class="form-control" rows="4" disabled="disabled"></textarea-autosize>-->
                  <div v-html="proposta.ds_resumo" class="caixa_texto"></div>
                </div>

                <!-- Apresentação do Projeto -->
                <div class="box-body" v-if="proposta">
                  <label class="control-label">Apresentação da Entidade Proponente</label>
                  <!--<textarea-autosize v-resizable data-vv-as="Apresentação do Projeto" v-model="proposta.ds_apresentacao" class="form-control" rows="4" disabled="disabled"></textarea-autosize>-->
                  <div v-html="proposta.ds_apresentacao" class="caixa_texto"></div>
                </div>

                <!-- Informação sobre Território -->
                <div class="box-body" v-if="proposta">
                  <label class="control-label">Informação sobre Território de desenvolvimento do projeto</label>
                  <!--<textarea-autosize v-resizable data-vv-as="Território de Desenvolvimento do Projeto" v-model="proposta.ds_territorio" class="form-control" rows="4" disabled="disabled"></textarea-autosize>-->
                  <div v-html="proposta.ds_territorio" class="caixa_texto"></div>
                </div>



                <!-- Justificativa -->
                <div class="box-body">
                  <label class="control-label">Justificativa</label>
                  <!--<textarea-autosize v-resizable data-vv-as="Justificativa do Projeto" v-model="proposta.ds_justificativa" class="form-control" rows="4" disabled="disabled"></textarea-autosize>-->
                  <div v-html="proposta.ds_justificativa" class="caixa_texto"></div>
                </div>



                <!-- Operacionalização -->
                <div class="box-body">
                  <label class="control-label">Operacionalização</label>
                  <!--<textarea-autosize v-resizable data-vv-as="Operacionalização do Projeto" v-model="proposta.ds_operacao" class="form-control" rows="4" disabled="disabled"></textarea-autosize>-->
                  <div v-html="proposta.ds_operacao" class="caixa_texto"></div>
                </div>



                <!-- Relacionamento com a Comunidade e Parcerias -->
                <div class="box-body">
                  <label class="control-label">Relacionamento com a Comunidade e Parcerias</label>
                  <!--<textarea-autosize v-resizable data-vv-as="Parceria do Projeto" v-model="proposta.ds_parceria" class="form-control" rows="4" disabled="disabled"></textarea-autosize>-->
                  <div v-html="proposta.ds_parceria" class="caixa_texto"></div>
                </div>



                <!-- Público alvo -->
                <div class="box-body" v-if="proposta">
                  <label class="control-label">Público-alvo do projeto</label>
                  <div>
                    <table class="table table-condensed table-bordered m0">
                      <thead>
                      <tr>
                        <th class="cabecalho">Público-alvo</th>
                        <th class="cabecalho centralizado">Participantes diretos</th>
                        <th class="cabecalho centralizado">Jovens atendidos</th>
                        <th class="cabecalho centralizado">Mulheres atendidas</th>
                      </tr>
                      </thead>
                      <tbody>
                      <tr v-for="publico in proposta.publicos_alvo">
                        <td v-if="publico.fonte.ds_descricao" class="ressaltar">{{publico.fonte.ds_descricao}}</td>
                        <td class="ressaltar centralizado">{{publico.nr_participantes_diretos}}</td>
                        <td class="ressaltar centralizado">{{publico.nr_jovens}}</td>
                        <td class="ressaltar centralizado">{{publico.nr_mulheres}}</td>
                      </tr>
                      </tbody>
                    </table>
                  </div>
                </div>



                <!-- Objetivo Geral -->
                <div class="box-body">
                  <label class="control-label">Objetivo Geral</label>
                  <!--<textarea-autosize v-resizable data-vv-as="Objetivo Geral do Projeto" v-model="proposta.ds_objetivo_geral" class="form-control" rows="4" disabled="disabled"></textarea-autosize>-->
                  <div v-html="proposta.ds_objetivo_geral" class="caixa_texto"></div>
                </div>

                <!-- 71538 - Inclusao de campos na impressao da proposta -->
                <div class="box-body" v-if="proposta">
                  <label class="control-label">Ações de Comunicação</label>
                  <!--<textarea-autosize v-resizable data-vv-as="Apresentação do Projeto" v-model="proposta.ds_apresentacao" class="form-control" rows="4" disabled="disabled"></textarea-autosize>-->
                  <div v-html="proposta.ds_acoes_comunicacao" class="caixa_texto"></div>
                </div>



                <!-- Objetivos, Metas e Atividades -->
                <div class="box-body" v-if="proposta">
                  <label class="control-label">Objetivos, Metas e Atividades</label>
                  <div>

                    <table class="table table-condensed m0 obj_met_atv">
                      <tbody>
                      <!-- Objetivos -->
                      <template v-for="(objetivo, idxObjetivo) in proposta.objetivos">
                        <tr class="objetivo">
                          <td colspan="2" v-if="objetivo.ds_descricao"><span class="tag">objetivo</span>{{objetivo.ds_descricao}}</td>
                        </tr>


                        <!-- Metas -->
                        <template v-for="(meta, idxMeta) in proposta.metas" v-if="_.find(meta.objetivos, function(o) { return o.ds_descricao === objetivo.ds_descricao })">
                          <tr class="meta">
                            <td v-if="meta.ds_descricao"><span class="tag vertical">meta</span>{{meta.ds_descricao}}</td>
                            <td><span class="ressaltar">{{meta.nr_quantidade}} {{meta.ds_unidade_medida}}</span> e indicar a execução como <span class="ressaltar">{{meta.ds_indicadores_execucao}}</span></td>
                          </tr>


                          <!-- Atividades -->
                          <template v-for="(atividade, idxAtividade) in proposta.atividades" v-if="_.find(atividade.metas, function(m) { return m.ds_descricao === meta.ds_descricao })">
                            <tr class="atividade">
                              <td v-if="atividade.descricao"><span class="tag vertical">atividade</span>{{atividade.descricao}}</td>
                              <td>Executar
                                <span v-if="atividade.inicio === atividade.termino"> no {{atividade.inicio}}º </span>
                                <span v-else> do {{atividade.inicio}}º  ao  {{atividade.termino}}º </span>
                                mês e comprovar com <span class="ressaltar">{{atividade.ds_documento_comprobatorio}}</span></td>
                            </tr>
                          </template>

                          <!-- Quando Não houver Atividades para a Metas-->
                          <template v-if="!haObjetivoMeta(proposta.atividades, 'metas', meta.ds_descricao)">
                            <tr class="atividade atencao"><td colspan="2">* Não há atividades para a Meta acima</td></tr>
                          </template>

                        </template>

                        <!-- Quando Não houver Metas para o Objetivo-->
                        <template v-if="!haObjetivoMeta(proposta.metas, 'objetivos', objetivo.ds_descricao)">
                          <tr class="meta atencao"><td colspan="2">* Não há metas para o Objetivo acima</td></tr>
                        </template>

                      </template>

                      </tbody>

                    </table>

                  </div>

                </div>




                <!--Cronograma de Execução das atividades-->
                <div class="box-body" v-if="proposta">
                  <label class="control-label">Cronograma de Execução das Atividades</label>
                  <table class="table table-condensed">
                    <thead>
                    <tr>
                      <th class="cabecalho w40 b1 b4">Atividade</th>
                      <th class="cabecalho direita w10 b1">Valor total</th>
                      <th class="centralizado b1 b2 b4" v-bind:style="'zoom:' + ganttZoom" v-for="mes in _.range([start=0], proposta.nr_periodos, [step=1])" >{{mes + 1}}</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr v-for="atividade in proposta.atividades">
                      <td class="ressaltar b3 b4">{{atividade.ds_nome}}</td>
                      <td class="direita b3">{{_.sumBy(atividade.itens_orcamentos, function(a) { return parseFloat(a.quantidade) * parseFloat(a.valor_unitario) }) | real}}</td>
                      <td class="centralizado b2 b3 b4" v-for="m in _.range([start=0], proposta.nr_periodos, [step=1])" v-bind:style="(m >= (atividade.inicio -1) && m <= (atividade.termino - 1)) ? 'background: gray !important' : ''">
                        <span v-if="(m >= (atividade.inicio -1) && m <= (atividade.termino - 1))" v-bind:style="'zoom:' + ganttZoom + '; color: gray'">
                          <i class="fa fa-circle"></i>
                        </span>
                        <span v-else>&nbsp;</span>
                      </td>
                    </tr>
                    </tbody>
                  </table>
                </div>



                <!-- Cursos -->
                <div class="box-body" v-if="proposta">
                  <label class="control-label">Cursos</label>
                  <div v-for="curso in proposta.cursos">
                    <table class="table table-condensed table-bordered lista">
                      <tbody>
                      <tr>
                        <td class="cabecalho">Título</td>
                        <td colspan="3" class="ressaltar">{{curso.ds_titulo}}</td>
                        <td colspan="3" class="cabecalho">Alunos inscritos em outros cursos deste projeto?</td>
                        <td class="ressaltar">{{('' + curso.outroCurso) === '0' ? 'Não' : 'Sim'}}</td>
                      </tr>
                      <tr>
                        <td class="cabecalho">Carga Horária</td>
                        <td class="ressaltar w10">{{curso.nr_carga_horaria}}</td>
                        <td class="cabecalho">Qtde Educadores</td>
                        <td class="ressaltar w10">{{curso.nr_qt_educadores}}</td>
                        <td class="cabecalho">Qtde de Turmas</td>
                        <td class="ressaltar w10">{{curso.nr_qt_turmas}}</td>
                        <td class="cabecalho">Qtde Alunos por Turma</td>
                        <td class="ressaltar w10">{{curso.nr_qt_alunos_turma}}</td>
                      </tr>
                      <tr>
                        <td colspan="8">
                          <span class="cabecalho">Público-alvo</span><br/>
                          <span>{{curso.ds_publico_alvo}}</span>
                        </td>
                      </tr>
                      <tr>
                        <td colspan="8">
                          <span class="cabecalho">Conteúdo Programárico</span><br/>
                          <span>{{curso.ds_conteudo}}</span>
                        </td>
                      </tr>
                      <tr>
                        <td colspan="8">
                          <span class="cabecalho">Detalhamento do perfil/experiência/qualificação dos profissionais a serem contratados</span><br/>
                          <span>{{curso.ds_perfil_profissional}}</span>
                        </td>
                      </tr>
                      <tr>
                        <td colspan="8">
                          <span class="cabecalho">Especificação dos serviços a serem prestados</span><br/>
                          <span>{{curso.ds_especificacao_servico}}</span>
                        </td>
                      </tr>
                      </tbody>
                    </table>
                  </div>
                </div>



                <!-- Equipe do projeto -->
                <div class="box-body" v-if="proposta">
                  <label class="control-label">Equipe do projeto</label>
                  <div v-for="equipe in proposta.equipes">
                    <table class="table table-condensed table-bordered lista">
                      <tbody>
                      <tr>
                        <td class="cabecalho">Cargo no projeto</td>
                        <td class="ressaltar">{{equipe.ds_cargo}}</td>
                        <td class="cabecalho">Quantidade</td>
                        <td class="ressaltar">{{equipe.nr_quantidade}}</td>
                        <td class="cabecalho">É remunerado pelo projeto?</td>
                        <td class="ressaltar">{{('' + equipe.bt_remunerado) === '0' ? 'Não' : 'Sim'}}</td>
                        <td class="cabecalho">Forma de contratação</td>
                        <td class="ressaltar">{{equipe.ds_forma_contratacao}}</td>
                      </tr>
                      <tr>
                        <td class="cabecalho">Perfil profissional pretendido</td>
                        <td class="ressaltar" colspan="5">{{equipe.ds_perfil_desejado}}</td>
                        <td class="cabecalho">Carga horária semanal</td>
                        <td class="ressaltar">{{equipe.dc_carga_horaria}} horas</td>
                      </tr>
                      <tr>
                        <td class="cabecalho">Resumo das atividades</td>
                        <td class="ressaltar" colspan="7">{{equipe.ds_resumo_atividades}}</td>
                      </tr>
                      </tbody>
                    </table>
                  </div>
                </div>



                <!-- Resultados Esperados -->
                <div class="box-body">
                  <label class="control-label">Resultados esperados</label>
                  <!--<textarea-autosize v-resizable data-vv-as="Resultados Esperados do Projeto" v-model="proposta.ds_resultados" class="form-control" rows="4" disabled="disabled"></textarea-autosize>-->
                  <div v-html="proposta.ds_resultados" class="caixa_texto"></div>
                </div>



                <!-- Orçamento FF do projeto -->
                <div class="box-body" v-if="proposta">
                  <label class="control-label">Orçamento do projeto - por atividade</label>
                  <table class="" style="width: 100%">
                    <thead>
                    <tr>
                      <th class="cabecalho">Atividade / Recursos (itens do cronograma)</th>
                      <th colspan="2" class="cabecalho centralizado">Período<br/>Início / Fim</th>
                      <th class="cabecalho centralizado">Qtde</th>
                      <th class="cabecalho centralizado">Valor Unitário</th>
                      <th class="cabecalho centralizado">Valor Total</th>
                    </tr>
                    </thead>
                    <tbody>

                    <!-- Itens -->
                    <template v-for="atividade in proposta.atividades">

                      <tr class="" style="font-weight: bold">
                        <td class="esquerda nome_atividade bl1 bl3 bl4">{{atividade.ds_nome}}</td>
                        <td class="centralizado bl1 bl3">{{atividade.nr_periodo_inicial}}</td>
                        <td class="centralizado bl1 bl3">{{atividade.nr_periodo_final}}</td>
                        <td colspan="3" class="direita bl1 bl2 bl3">{{_.sumBy(atividade.itens_orcamentos, function(a) { return parseFloat(a.quantidade) * parseFloat(a.valor_unitario) }) | real}}</td>
                      </tr>
                      <tr v-for="item in atividade.itens_orcamentos">
                        <template v-if="!item.editando">
                          <td class="bl4 b3">
                            <span class="">
                              <span v-if="('' + item.origem).substr(0, 1) === '1'">Fundação</span>
                              <span v-else-if="('' + item.origem).substr(0, 1) === '2'">Contrapartida</span>
                              <span v-else-if="('' + item.origem).substr(0, 1) === '5'">P.Estratégico</span>
                              <span v-if="('' + item.adiantavel).substr(0, 1) === '1'" class="adiantavel"> (Adiantável)</span>
                            </span>

                            <span class="esmaecido">({{_.upperFirst(_.lowerCase(item.item.ds_type))}})  {{item.item.ds_code + ' / ' + item.item.ds_description}}</span>
                            <div class="observacao esquerda">{{item.observacao}}</div>
                          </td>

                          <td class="centralizado b3">{{item.periodo_inicial}}</td>
                          <td class="centralizado b3">{{item.periodo_final}}</td>
                          <td class="centralizado b3">{{item.quantidade}}</td>
                          <td class="centralizado b3">{{item.valor_unitario | real}}</td>
                          <td class="centralizado b3 bl2">{{item.quantidade * item.valor_unitario | real}}</td>
                        </template>
                      </tr>

                    </template>


                    </tbody>
                  </table>
                </div>


              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  </div>

</template>

<script>
  import { mapGetters } from 'vuex'
  import HistoricoProposta from '../modules/historicoProposta'
  import moment from 'moment'

  export default {
    components: {
      HistoricoProposta
    },
    name: 'imprimir-proposta',
    data () {
      return {
        progressBar: {
          stepAtual: null,
          stepTotal: null,
          tarefaAtual: null
        },
        loading: {
          show: false
        },
        tel: '',
        array: [],
        esconder: true,
        fluxo: {},
        elementos: {
          visivel: ''
        },
        carregou: false,
        dirigentes: [],
        documentosProposta: [],
        bloqueiaBotoes: false,
        ganttZoom: 1,
        proposta: {
          dataFinal: '',
          totalProjeto: 0,
          totalFBB: 0,
          totalParc: 0,
          totalCtrp: 0,
          entidade: {},
          documentos: {
            proposta: []
          }
        },
        formaJuridica: '',
        componentKey: 0,
        ultimaTarefaEntidade: {},
        estados: ['AC', 'AL', 'AM', 'AP', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MG', 'MS', 'MT', 'PA', 'PB', 'PE', 'PI', 'PR', 'RJ', 'RN', 'RO', 'RR', 'RS', 'SC', 'SE', 'SP', 'TO']
      }
    },
    watch: {
    },
    computed: {
      ...mapGetters([
        'usuarioLogado'
      ])
    },
    async created () {
      this.$snotify.async('Abrindo a proposta. Por favor, aguarde...', {timeout: 0})
      await this.$root.buscaFormasJuridicas(this.$store)
      axiosLaravel.post('processos/historico/', {'id_proposta': this.$route.params.id, 'tipo': 'USUARIO'}).then((response) => {
        // Pega a última tarefa de Solicitação ou Revisão da proposta ordenada por id
        this.ultimaTarefaEntidade = _.last(_.sortBy(_.filter(response.data, function (t) { return t.nome === 'SOLICITACAO' || t.nome === 'REVISAO' }), ['id']))
        //
        // Verifica se a há última tarefa de solicitação ou revisão e se tem data de término, então pega a requisição dessa última tarefa do contrário traz a proposta atual
        let rotaProposta = (_.isUndefined(this.ultimaTarefaEntidade) || _.isNull(this.ultimaTarefaEntidade.termino)) ? 'propostas/' + this.$route.params.id : 'processos/tarefas/buscahistorico/' + this.ultimaTarefaEntidade.id
        //
        console.log('ROTA', rotaProposta)
        axiosLaravel.get('propostas/' + this.$route.params.id).then((response) => {
          this.proposta = response.data
          this.buscaEntidades()
          this.buscaFluxo()
          this.proposta.totalProjeto = this.totalizar(0)
          this.proposta.totalFBB = this.totalizar(1)
          this.proposta.totalParc = this.totalizar(5)
          this.proposta.totalCtrp = this.totalizar(2)
          this.proposta.dataFinal = moment(this.ehNulo(this.proposta.dt_assinatura_convenio, this.proposta.dt_data_inicial)).add(this.proposta.nr_periodos, 'M').format('MM/YYYY')
          this.ganttZoom = (parseInt(this.proposta.nr_periodos) > 24 ? (1 - (parseInt(this.proposta.nr_periodos) - 24) * 0.035) : 1)
          this.$forceUpdate()
          this.carregou = true
          this.$snotify.clear()
          let codigo = this.proposta.entidade.fk_forma_juridica
          let descricao = this.ehNulo(_.find(this.$store.state.formasJuridicas, ['codigo', codigo])['descricao'], '!')
          this.formaJuridica = codigo + ' - ' + descricao
          setTimeout(() => { this.$snotify.success('Proposta carregada com sucesso!', {timeout: 4000}) }, 4000)
        })
          .catch((error) => {
            this.$root.trataErro(error)
          })
      })
        .catch((error) => {
          this.$root.trataErro(error)
        })
    },
    methods: {
      closewindow () {
        close()
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
      totalizar (origem) {
        let t = 0
        _.forEach(this.proposta.atividades, function (a) {
          t += _.sumBy(a.itens_orcamentos, function (i) {
            return ('' + origem === '0') ? parseFloat(i.quantidade) * parseFloat(i.valor_unitario) : (('' + origem === ('' + i.origem).substr(0, 1)) ? parseFloat(i.quantidade) * parseFloat(i.valor_unitario) : 0)
          })
        })
        return t
      },
      mostrarRef (ref) {
        return _.filter(this.elementos, item => item.nome === ref).some((item) => { return item.visivel })
      },
      async buscaEntidades () {
        let currentDate = new Date()
        let hoje = moment(currentDate).format('YYYYMMDD')
        await axiosLaravel.get('entidades/' + this.proposta.entidade.id).then(async (response) => {
          this.proposta.entidade = response.data
          let representantesValidos = []
          _.forEach(response.data.dirigentes, function (o) {
            if (o.bt_assinatura_entidade === 1 && o.bt_ativo === 1 && o.bt_representante_legal === 1 && o.bt_assinatura_requerida === 1) {
              let dataInicial = moment(o.dt_inicio_mandato).format('YYYYMMDD')
              let dataFinal = moment(o.dt_fim_mandato).format('YYYYMMDD')
              if (dataInicial <= hoje && hoje <= dataFinal) {
                o.ds_cpf = ('00000000000' + o.ds_cpf).slice(-11)
                representantesValidos.push(o)
              }
            }
          })
          this.proposta.entidade.dirigentes = representantesValidos
          this.$forceUpdate
        })
          .catch((error) => {
            if (error) {
              this.$snotify.clear()
              this.$root.trataErro(error)
            }
          })
      },
      buscaFluxo () {
        //  Verificar no retorno se a atividade atual é referente a esta página se não então erro
        //  Carregar array de refs de elementos ou não (v-if)
        axiosLaravel.post('fluxo/', {'id_proposta': this.$route.params.id, 'atividade': 'SOLICITACAO'}).then((response) => {
          this.fluxo = response.data
          this.elementos = this.fluxo.elementos
          this.loading.show = false
          this.$forceUpdate()
        })
          .catch((error) => {
            this.$root.trataErro(error)
          })
      },
      // async buscaProposta () {
      //   this.loading.show = true
      //   await axiosLaravel.get('propostas/' + this.$route.params.id).then(async (response) => {
      //     this.proposta = response.data
      //     this.buscaEntidades()
      //     // if (this.proposta.documentos) {
      //     //   if (!_.isUndefined(this.proposta.documentos.proposta) && this.proposta.documentos.proposta.length > 0) {
      //     //     this.documentosProposta = this.proposta.documentos.proposta
      //     //   }
      //     // }
      //     this.buscaFluxo()
      //     this.proposta.totalProjeto = this.totalizar(0)
      //     this.proposta.totalFBB = this.totalizar(1)
      //     this.proposta.totalParc = this.totalizar(5)
      //     this.proposta.totalCtrp = this.totalizar(2)
      //     this.proposta.dataFinal = moment(this.ehNulo(this.proposta.dt_assinatura_convenio, this.proposta.dt_data_inicial)).add(this.proposta.nr_periodos, 'M').format('MM/YYYY')
      //     this.ganttZoom = (parseInt(this.proposta.nr_periodos) > 24 ? (1 - (parseInt(this.proposta.nr_periodos) - 24) * 0.035) : 1)
      //     this.$forceUpdate()
      //     this.carregou = true
      //     this.$snotify.clear()
      //     setTimeout(() => { this.$snotify.success('Proposta carregada com sucesso!', {timeout: 4000}) }, 4000)
      //   })
      //     .catch((error) => {
      //       this.$snotify.clear()
      //       this.$root.trataErro(error)
      //     })
      // setTimeout(() => { window.print() }, 10000)
      // },
      irTopo () {
        this.$nextTick(() => {
          this.$refs['topo'].scrollIntoView()
        })
      },
      imprimirRelatorio () {
        window.print()
      },
      onDownloadZIP () {
        console.log('this.$route.params.id: ', this.$route.params.id)
        let propostaEncodedBase64 = btoa(this.$route.params.id)
        window.open('https://projetos.fbb.org.br:5443/edital/proposta/' + propostaEncodedBase64 + '/arquivos', '_blank')
      }
    }
  }
</script>

<style scoped>
  .m0 {
    margin: 0px !important;
  }

  #proposta {
    --cor-padrao: black;
    --cor-fraca: silver;
    --cor-destaque: cornflowerblue;
    --cor-alerta: darkgoldenrod;
    --cor-atencao: firebrick;
    --cor-borda: rgb(221, 221, 221);
  }

  #proposta .cabecalho {
    text-align: left;
    font-weight: normal;
    font-size: x-small !important;
  }

  #proposta .ressaltar {
    font-weight: bold;
  }

  #proposta .box-body {
    margin-top: 20px;
  }

  #proposta .objetivo td:nth-child(1) {
    vertical-align: top;
  }
  #proposta .meta td:nth-child(1) {
    padding-left: 35px !important;
    vertical-align: top;
  }
  #proposta .atividade td:nth-child(1) {
    padding-left: 50px !important;
    vertical-align: top;
  }
  #proposta span.tag {
    padding: 0 10px 0 0;
    margin-right: 5px;
    color: silver;
    font-weight: bold;
    font-size: small;
  }

  #proposta .atencao {
    color: var(--cor-atencao);
    font-weight: bold;
  }

  #proposta .obj_met_atv td, #proposta .obj_met_atv th {
    border: 0px 1px solid silver;
  }

  #proposta .b1 {
    border-top: 1px solid var(--cor-borda) !important;
  }
  #proposta .b2 {
    border-right: 1px solid var(--cor-borda) !important;
  }
  #proposta .b3 {
    border-bottom: 1px solid var(--cor-borda) !important;
  }
  #proposta .b4 {
    border-left: 1px solid var(--cor-borda) !important;
  }
  #proposta .bl1 {
    border-top: 2px solid var(--cor-borda) !important;
  }
  #proposta .bl2 {
    border-right: 2px solid var(--cor-borda) !important;
  }
  #proposta .bl3 {
    border-bottom: 2px solid var(--cor-borda) !important;
  }
  #proposta .bl4 {
    border-left: 2px solid var(--cor-borda) !important;
  }
  #proposta .direita, #proposta .esquerda, #proposta .centralizado {
    padding: 1px 3px;
  }

  #proposta .direita {
    text-align: right;
  }
  #proposta .esquerda {
    text-align: left;
  }
  #proposta .centralizado {
    text-align: center;
  }

  #proposta .lista tr td:first-child {
    border-left: 3px solid silver;
  }

  #proposta .caixa_texto {
    border: 1px solid var(--cor-borda);
    padding: 6px 12px;
    white-space: pre-wrap
  }
  /********************************************************************************************************************************************/

  @media print {

    * {
      font-size: 14px !important;
    }

    .control-label {
      text-transform: uppercase;
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

    .tabela_consultas .valores input {
      text-align: left;
      border: 0;
    }

    .juntos {
      page-break-inside: avoid;
    }

    button {
      display: none !important;
    }

    select, input {
      border: 0;
      padding-left: 20px;
    }

    .bloco {
      border: 1px solid #d2d6de;
    }

    @page {
      /*size: portrait;*/
      margin-left: 0px !important;
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

    #app .content-wrapper * {
      background: white !important;
    }

  }

</style>
