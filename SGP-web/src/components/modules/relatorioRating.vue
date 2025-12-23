<template>

  <div class="content-wrapper">

    <vue-headful title="SGP - Rating da Entidade"/>

    <section class="content-header">
      <h1>Rating da Entidade:

        <span v-if="rating.classificacao">{{rating.classificacao.nota}} </span>
        <span v-if="calculando"><i class="fa fa-refresh fa-spin" style="font-size: 30px"></i></span>
        <span v-else>
          <g-button-ujarak color="primary" @click.native="salvarRating" type="button" v-if="!somenteLeitura && !temDataErrada"><i class="fa fa-floppy-o" aria-hidden="true"></i> Salvar</g-button-ujarak>
          <g-button-ujarak color="warning" @click.native="imprimirRelatorio" type="button"><i class="fa fa-print" aria-hidden="true"></i> Imprimir</g-button-ujarak>
          <g-button-ujarak color="error" @click.native="closewindow" size="button--size-ss"><i class="fa fa-sign-out" aria-hidden="true"></i> Sair do relatório </g-button-ujarak>
          <br/>
          <span v-if="tudoPreenchido > 0" class="alertaCamposPendentes">Ainda falta preencher <b>{{tudoPreenchido}}</b> campos de Certidões ou Cadin</span>
          <span v-if="temDataErrada" class="alertaCamposPendentes"><br v-if="tudoPreenchido > 0"/>Tem data errada! Favor verifique-as.</span>
        </span>
      </h1>
      <b-breadcrumb :items="[{
              text: 'Validação',
              href: '/'
              }, {
              text: 'Propostas',
              href: '#'
              }, {
              text: 'Rating da Entidade',
              active: true
              }]"/>
    </section>

    <section class="content">
      <div id="rating" class="row">

        <div class="col-md-12">
          <div class="box box-primary">

            <div class="imprimir">
              <img src="/static/img/logo-login.png" class="logo_relatorio">
              <span class="tituloRating">Rating da Entidade</span>
            </div>

            <div v-show="calculando" class="overlay" style="position: absolute; top: 0px; left: 0px; width: 100%; height: 100%; display: block;">
              <i class="fa fa-refresh fa-spin"></i>
            </div>

            <div class="box-body">

              <!--Dados da entidade -------------------------------------------------------------------------------------------------------------------------->
              <div class="col-md-12">
                <div class="secao">Dados da entidade:</div>
              </div>

              <div class="col-md-12">
                <table class="table m0">
                  <tr>
                    <td class="etiquetas w10">Convenente:</td>
                    <td class="valores" colspan="7"><span class="dado">{{dadosGerais.entidade.ds_nome}}</span></td>
                  </tr>
                  <tr>
                    <td class="etiquetas">Código:</td>
                    <td class="valores"><span class="dado">{{dadosGerais.entidade.nr_codigo_forn_erp}}</span></td>
                    <td class="etiquetas">CNPJ:</td>
                    <td class="valores"><span class="dado">{{dadosGerais.entidade.ds_cnpj | cnpj}}</span></td>
                    <td class="etiquetas">Data de abertura:</td>
                    <td class="valores"><span class="dado">{{dadosGerais.entidade.dt_data_expedicao_cnpj | moment("L")}}</span></td>
                    <td class="etiquetas">Tempo de abertura:</td>
                    <td class="valores"><span class="dado">{{dadosGerais.entidade.dt_data_expedicao_cnpj | moment("from", "now")}}</span></td>
                  </tr>
                </table>
              </div>

              <div class="col-md-12">
                <div class="etiquetas">Dirigentes:</div>

                <table class="table table-bordered text-center nao_imprimir m0" v-if="rating.dirigentes">
                  <thead>
                  <tr>
                    <th style="width: 25%">Nome</th>
                    <th style="width: 10%">CPF</th>
                    <th style="width: 14%" class="requerido">SERASA</th>
                    <th style="width: 14%" class="requerido">SCPC</th>
                    <th style="width: 10%">Início do Mandato</th>
                    <th style="width: 10%">Vigência do Mandato</th>
                    <th style="width: 3%">Ativo</th>
                  </tr>
                  </thead>
                  <tbody>
                  <tr v-for="dirigente in rating.dirigentes">
                    <td>{{dirigente.ds_nome}}&nbsp;&nbsp;&nbsp;&nbsp;<span style="color: cornflowerblue">{{dirigente.cargo.ds_descricao }}</span></td>
                    <td>{{dirigente.ds_cpf}}</td>
                    <td><money v-model="dirigente.serasa" v-bind:onchange="totalSerasaDirigentes" :disabled="somenteLeitura" name="serasa_dirigente" class="form-control text-right" type="text" v-validate="'required'"></money></td>
                    <td><money v-model="dirigente.scpc" v-bind:onchange="totalSCPCDirigentes" :disabled="somenteLeitura" name="scpc_dirigente" class="form-control text-right" type="text" v-validate="'required'"></money></td>
                    <td>{{dirigente.dt_inicio_mandato | moment("L")}}</td>
                    <td>{{dirigente.dt_fim_mandato | moment("L")}}</td>
                    <td><i :class="['fa fa-circle ', dirigente.bt_ativo ? 'text-green' : 'text-red']" aria-hidden="true"></i></td>
                  </tr>
                  </tbody>
                </table>


                <table class="table table-bordered text-center imprimir" v-if="rating.dirigentes">
                  <thead>
                  <tr>
                    <th class="w50 p0">Dirigente</th>
                    <th class="w20 p0">Mandato</th>
                    <th class="w10 p0">SERASA</th>
                    <th class="w10 p0">SCPC</th>
                  </tr>
                  </thead>
                  <tbody>
                  <!-- Suporte 59916 - DE dadosGerais.entidade.dirigentes PARA rating.dirigentes --->
                  <tr v-for="dirigente in rating.dirigentes">
                    <td>
                      <span class="fl">
                        {{dirigente.ds_nome}}&nbsp;&nbsp;
                        <span style="color: cornflowerblue">{{dirigente.cargo.ds_descricao }}</span>
                      </span>
                      <!--({{dirigente.bt_ativo ? ' ativo' : ' inativado'}}) -->
                      <span class="fr">CPF: {{dirigente.ds_cpf}}</span>
                    </td>
                    <td>
                      {{dirigente.dt_inicio_mandato | moment("L")}} à {{dirigente.dt_fim_mandato | moment("L")}}
                    </td>
                    <td><span>{{dirigente.serasa | real}}</span></td>
                    <td><span>{{dirigente.scpc | real}}</span></td>
                  </tr>
                  </tbody>
                </table>

              </div>


              <!--Consultas cadastrais e regularidade fiscal e previdenciária -------------------------------------------------------------------------------->
              <div class="col-md-12">
                <div class="secao">Consultas cadastrais e regularidade fiscal e previdenciária:</div>
              </div>
              <div class="col-md-12">

                <table class="tabela_consultas" v-if="rating.consultas">
                  <tr>
                    <td colspan="2" class="cabecalho b">SERASA:</td> <!--SERASA-->
                    <td colspan="2" class="cabecalho b">CEPIM e Certidões:</td> <!--CEPIM e Certidões-->
                  </tr>
                  <tr>
                    <td class="etiquetas w20">Entidade:</td> <!--SERASA Entidade-->
                    <td class="valores w20">
                      <money v-model="rating.consultas.serasa.entidade" name="serasa_entidade" class="form-control text-right" type="text" v-validate="'required'" :disabled="somenteLeitura"></money>
                    </td>
                    <td class="etiquetas w30">Cepim<span class="dataConsulta"></span>:</td>
                    <td class="valores w30"> <!-- CEPIM -->
                      <div class="data w40" :title="'<h5>Informe a Data da Consulta do Cepim</h5>'" v-tippy="{inertia: true, arrow: true, animation: 'perspective', distance: '1', size: 'large', placement: 'left'}">
                        <input id="Cepim" type="text" ref="Cepim" name="Cepim" v-model="rating.consultas.certidoes.dataCepim" class="form-control" :disabled="somenteLeitura"
                               v-mask="'##/##/####'" data-vv-as="Cepim" :masked="masked" v-validate="'required|validdate|dateeqpast'" @blur="verificaData">
                        <span v-if="errors.first('Cepim')" class="label label-danger"> {{ errors.first('Cepim') }}</span>
                      </div>

                      <div class="textoLigacao w10">&nbsp;</div>

                      <div class="listaSituacao w50">
                        <select @change="calcularRating" class="form-control" v-model="rating.consultas.certidoes.Cepim" :disabled="somenteLeitura">
                          <option value="1">Com Restrição</option>
                          <option value="0">Nada Consta</option>
                        </select>
                      </div>

                    </td>
                  </tr>

                  <tr>
                    <td class="etiquetas">Dirigentes:</td> <!--SERASA Dirigentes-->
                    <td class="valores">
                      <money :disabled="true" v-model="rating.consultas.serasa.dirigentes" name="serasa_dirigentes" class="form-control text-right" type="text"></money>
                    </td>
                    <td class="etiquetas">PGFN<span class="dataValidade"></span>:</td> <!--CND-->
                    <td class="valores">
                      <div class="data w40" :title="'<h5>Informe a Data de Validade da PGFN</h5>'" v-tippy="{inertia: true, arrow: true, animation: 'perspective', distance: '1', size: 'large', placement: 'left'}">
                        <input id="CND" type="text" ref="CND" name="CND" v-model="rating.consultas.certidoes.dataCND" class="form-control" :disabled="somenteLeitura"
                               v-mask="'##/##/####'" data-vv-as="CND" :masked="masked" v-validate="'required|validdate'">
                        <span v-if="errors.first('CND')" class="label label-danger"> {{ errors.first('CND') }}</span>
                      </div>

                      <div class="textoLigacao w10">&nbsp;</div>

                      <div class="listaSituacao w50">
                        <select @change="calcularRating" class="form-control" v-model="rating.consultas.certidoes.CND" :disabled="somenteLeitura">
                          <option value="1">Vencida</option>
                          <option value="0">Vigente</option>
                        </select>
                      </div>
                    </td>
                  </tr>

                  <tr>
                    <td class="etiquetas">Dirigentes Coobrigação:</td> <!--SERASA Dirigentes Coobrigação-->
                    <td class="valores">
                      <div>
                        <money v-model="rating.consultas.serasa.coobrigacao" name="serasa_coobrigacao" class="form-control text-right" type="text" v-validate="'required'" :disabled="somenteLeitura"></money>
                      </div>
                      <span v-if="errors.first('SERASA de dirigentes coobrigação')" class="label label-danger"> {{ errors.first('SERASA de dirigentes coobrigação') }}</span>
                    </td>
                    <td class="etiquetas">CRF<span class="dataValidade"></span>:</td> <!--CRF-->
                    <td class="valores">
                      <div class="data w40" :title="'<h5>Informe a data de Validade da CRF</h5>'" v-tippy="{inertia: true, arrow: true, animation: 'perspective', distance: '1', size: 'large', placement: 'left'}">
                        <input id="CRF" type="text" ref="CRF" name="CRF" v-model="rating.consultas.certidoes.dataCRF" class="form-control" :disabled="somenteLeitura"
                               v-mask="'##/##/####'" data-vv-as="CRF" :masked="masked" v-validate="'required|validdate'">
                        <span v-if="errors.first('CRF')" class="label label-danger"> {{ errors.first('CRF') }}</span>
                      </div>

                      <div class="textoLigacao w10">&nbsp;</div>

                      <div class="listaSituacao w50">
                        <select @change="calcularRating" class="form-control" v-model="rating.consultas.certidoes.CRF" :disabled="somenteLeitura">
                          <option value="1">Vencida</option>
                          <option value="0">Vigente</option>
                        </select>
                      </div>
                    </td>
                  </tr>

                  <tr>
                    <td class="etiquetas">&nbsp;</td>
                    <td class="valores">&nbsp;</td>
                    <td class="etiquetas">CNDT<span class="dataValidade"></span>:</td>
                    <td class="valores"> <!--CNDT-->
                      <div class="data w40" :title="'<h5>Informe a data de Validade da CNDT</h5>'" v-tippy="{inertia: true, arrow: true, animation: 'perspective', distance: '1', size: 'large', placement: 'left'}">
                        <input id="CNDT" type="text" ref="CNDT" name="CNDT" v-model="rating.consultas.certidoes.dataCNDT" class="form-control" :disabled="somenteLeitura"
                               v-mask="'##/##/####'" data-vv-as="CNDT" :masked="masked" v-validate="'required|validdate'">
                        <span v-if="errors.first('CNDT')" class="label label-danger"> {{ errors.first('CNDT') }}</span>
                      </div>

                      <div class="textoLigacao w10">&nbsp;</div>

                      <div class="listaSituacao w50">
                        <select @change="calcularRating" class="form-control" v-model="rating.consultas.certidoes.CNDT" :disabled="somenteLeitura">
                          <option value="1">Vencida</option>
                          <option value="0">Vigente</option>
                        </select>
                      </div>
                    </td>
                  </tr>

                  <tr>
                    <td colspan="2" class="cabecalho b">SCPC:</td> <!--SCPC-->
                    <td colspan="2" class="cabecalho b">CADIN:</td> <!--CADIN-->
                  </tr>
                  <tr>
                    <td class="etiquetas">Entidade:</td> <!--SCPC Entidade-->
                    <td class="valores">
                      <div>
                        <money v-model="rating.consultas.scpc.entidade" name="scpc_entidade" class="form-control text-right" type="text" v-validate="'required'" :disabled="somenteLeitura"></money>
                      </div>
                      <span v-if="errors.first('SCPC da entidade')" class="label label-danger"> {{ errors.first('SCPC da entidade') }}</span>
                    </td>

                    <td class="etiquetas">Entidade<span class="dataConsulta"></span>:</td> <!--CADIN Entidade-->
                    <td class="valores">
                      <div class="data w40" :title="'<h5>Informe a Data da Consulta do CADIN da Entidade</h5>'" v-tippy="{inertia: true, arrow: true, animation: 'perspective', distance: '1', size: 'large', placement: 'left'}">
                        <input id="cadin_entidade" type="text" name="cadin_entidade" v-model="rating.consultas.cadin.dataEntidade" class="form-control" :disabled="somenteLeitura"
                               v-mask="'##/##/####'" data-vv-as="cadin_entidade" :masked="masked" v-validate="'required|validdate|dateeqpast'" @blur="verificaData">
                        <span v-if="errors.first('cadin_entidade')" class="label label-danger"> {{ errors.first('cadin_entidade') }}</span>
                      </div>

                      <div class="textoLigacao w10">&nbsp;</div>

                      <div class="listaSituacao w50">
                        <select @change="calcularRating" class="form-control" v-model="rating.consultas.cadin.entidade" :disabled="somenteLeitura">
                          <option value="1">Com Restrição</option>
                          <option value="0">Nada Consta</option>
                        </select>
                      </div>

                    </td>
                  </tr>


                  <tr>
                    <td class="etiquetas">Dirigentes:</td> <!--SCPC Dirigentes-->
                    <td class="valores">
                      <div>
                        <money :disabled="true"  v-model="rating.consultas.scpc.dirigentes" name="scpc_dirigentes" class="form-control text-right" type="text" v-validate="'required'"></money>
                      </div>
                      <span v-if="errors.first('SCPC de dirigentes')" class="label label-danger"> {{ errors.first('SCPC de dirigentes') }}</span>
                    </td>

                    <td class="etiquetas">Dirigentes<span class="dataConsulta"></span>:</td> <!--CADIN Dirigentes-->
                    <td class="valores">
                      <div class="data w40" :title="'<h5>Informe a data da Consulta do CADIN dos Dirigentes</h5>'" v-tippy="{inertia: true, arrow: true, animation: 'perspective', distance: '1', size: 'large', placement: 'left'}">
                        <input id="cadin_dirigentes" type="text" name="cadin_dirigentes" v-model="rating.consultas.cadin.dataDirigentes" class="form-control" :disabled="somenteLeitura"
                               v-mask="'##/##/####'" data-vv-as="cadin_dirigentes" :masked="masked" v-validate="'required|validdate|dateeqpast'" @blur="verificaData">
                        <span v-if="errors.first('cadin_dirigentes')" class="label label-danger"> {{ errors.first('cadin_dirigentes') }}</span>
                      </div>

                      <div class="textoLigacao w10">&nbsp;</div>

                      <div class="listaSituacao w50">
                        <select @change="calcularRating" class="form-control" v-model="rating.consultas.cadin.dirigentes" :disabled="somenteLeitura">
                          <option value="1">Com Restrição</option>
                          <option value="0">Nada Consta</option>
                        </select>
                      </div>
                    </td>
                  </tr>

                  <tr>
                    <td class="etiquetas">Dirigentes Coobrigação:</td> <!--SCPC Dirigentes Coobrigação-->
                    <td class="valores">
                      <div>
                        <money v-model="rating.consultas.scpc.coobrigacao" name="scpc_coobrigacao" class="form-control text-right" type="text" v-validate="'required'" :disabled="somenteLeitura"></money>
                      </div>
                      <span v-if="errors.first('SCPC de dirigentes coobrigação')" class="label label-danger"> {{ errors.first('SCPC de dirigentes coobrigação') }}</span>
                    </td>

                    <td class="etiquetas">Dirigentes Coobrigação<span class="dataConsulta"></span>:</td> <!--CADIN Dirigentes Coobrigação-->
                    <td class="valores">
                      <div v-if="rating.consultas.cadin.dataCoobrigacao !== 0" class="data w40">
                        <input id="cadin_dirigentes_coobrigacao" type="text" name="cadin_dirigentes_coobrigacao" v-model="rating.consultas.cadin.dataCoobrigacao" class="form-control" :disabled="somenteLeitura"
                               v-mask="'##/##/####'" data-vv-as="cadin_dirigentes_coobrigacao" :masked="masked" v-validate="'required|validdate|dateeqpast'" @blur="verificaData">
                        <span v-if="errors.first('cadin_dirigentes_coobrigacao')" class="label label-danger"> {{ errors.first('cadin_dirigentes_coobrigacao') }}</span>
                      </div>

                      <div class="textoLigacao w10">&nbsp;</div>

                      <div class="listaSituacao w50">
                        <select @change="calcularRating" class="form-control" v-model="rating.consultas.cadin.coobrigacao" :disabled="somenteLeitura">
                          <option value="1">Com Restrição</option>
                          <option value="0">Nada Consta</option>
                        </select>
                      </div>

                    </td>
                  </tr>

                </table>

              </div>

              <div class="col-md-12" v-if="rating.consultas" >
                <table class="tabela_consultas">
                  <tr>
                    <td class="etiquetas w20">Total Geral:</td>
                    <td class="valores w20"><money v-model="rating.consultas.totalGeral" name="total_scpc_serasa" class="form-control text-right" type="text" :disabled="true"></money></td>
                    <td class="etiquetas w50">Quantidade de Pessoas Politicamente Expostas (PEP):</td>
                    <td class="valores w10"><input id="pep" type="text" name="pep" v-model="rating.consultas.PEP" class="form-control" v-validate="'required'" :disabled="somenteLeitura"></td>
                  </tr>
                </table>
              </div>


              <!--Experiência com a FBB --------------------------------------------------------------------------------------------------------------------------->
              <div class="col-md-12">
                <div class="secao">Experiência com a FBB:</div>
              </div>
              <div class="col-md-12">

                <table class="tabela_consultas">
                  <tr>
                    <!--Investimento Social (ISD, últimos 3 anos)-->
                    <td class="etiquetas">Investimento Social (ISD, últimos 3 anos):</td>
                    <td class="valores w20">
                      <span class="dado" :title="'<h5>Refere-se a soma dos valores contratados e suplementados no projeto</h5>'" v-tippy="{inertia:true,arrow:true,animation:'perspective',distance:'1',size:'large',arrow:true}">
                        {{rating.experiencia.investimentoAte3Anos | real}}
                      </span>
                    </td>
                    <td class="etiquetas">&nbsp;</td>
                    <td class="valores w20">&nbsp;</td>
                  </tr>
                  <tr>
                    <!--Participantes Diretos (ISD, últimos 3 anos)-->
                    <td class="etiquetas">Participantes Diretos (ISD, últimos 3 anos):</td>
                    <td class="valores w20">
                      <span class="dado" :title="'<h5>Refere-se a quantidade total de participantes dos projetos contratados</h5>'" v-tippy="{inertia:true,arrow:true,animation:'perspective',distance:'1',size:'large',arrow:true}">
                        {{rating.experiencia.participantesAte3Anos}}
                      </span>
                    </td>
                    <td class="etiquetas">&nbsp;</td>
                    <td class="valores w20">&nbsp;</td>
                  </tr>
                  <tr>
                    <!--Nº Projetos com a FBB-->
                    <td class="etiquetas">Nº Projetos com a FBB:</td>
                    <td class="valores w20">
                      <span class="dado" :title="'<h5>Refere-se a quantidade total de participantes dos projetos contratados</h5>'" v-tippy="{inertia:true,arrow:true,animation:'perspective',distance:'1',size:'large',arrow:true}">
                        {{rating.experiencia.qtdeProjeto}}
                      </span>
                    </td>
                    <td class="etiquetas">&nbsp;</td>
                    <td class="valores w20">&nbsp;</td>
                  </tr>
                </table>
              </div>

              <!--Ocorrências --------------------------------------------------------------------------------------------------------------------------->
              <div class="col-md-12">
                <div class="secao">Ocorrências:</div>
              </div>
              <div class="col-md-12">

                <table class="tabela_consultas">
                  <tr>
                    <td v-show="false" colspan="2" class="cabecalho">Entidade:</td>
                    <td colspan="2" class="cabecalho">Projetos em Execução, ETO, SPS:</td>
                    <td colspan="2" class="cabecalho">Projetos Encerrados (3 anos):</td>
                  </tr>
                  <tr>
                    <td v-show="false" class="etiquetas w20">Ocorr. Peso 2:</td>
                    <td v-show="false" class="valores w10">
                      <span v-if="_.isNull(rating.ocorrencias.entidade.tipo2)"><i class="fa fa-refresh fa-spin"></i></span>
                      <span v-else class="dado atualizavel" @click="entidadeOcorrenciaTipo2" :title="'<h5>Atualizar consulta</h5>'" v-tippy="{inertia:true,arrow:true,animation:'perspective',distance:'1',size:'large',arrow:true}">{{rating.ocorrencias.entidade.tipo2.length}}</span>
                    </td>

                    <td class="etiquetas w20">Qtd Executando:</td>
                    <td class="valores w10">
                      <span class="dado">{{rating.ocorrencias.projetosExecutando.qtde}}</span>
                    </td>

                    <td class="etiquetas w20">Qtd Executado:</td>
                    <td class="valores w10">
                      <span class="dado">{{rating.ocorrencias.projetosEncerrados.qtde}}</span>
                    </td>
                  </tr>

                  <tr>
                    <td v-show="false" class="etiquetas w20">Ocorr. Peso 3:</td>
                    <td v-show="false" class="valores w10">
                      <span v-if="_.isNull(rating.ocorrencias.entidade.tipo3)"><i class="fa fa-refresh fa-spin"></i></span>
                      <span v-else class="dado atualizavel" @click="entidadeOcorrenciaTipo3" :title="'<h5>Atualizar consulta</h5>'" v-tippy="{inertia:true,arrow:true,animation:'perspective',distance:'1',size:'large',arrow:true}">{{rating.ocorrencias.entidade.tipo3.length}}</span>
                    </td>

                    <td class="etiquetas w20">Ocorr. Peso 2:</td>
                    <td class="valores w10">
                      <span v-if="_.isNull(rating.ocorrencias.projetosExecutando.tipo2)"><i class="fa fa-refresh fa-spin"></i></span>
                      <span v-else class="dado atualizavel" @click="projetosExecutandoOcorrenciaTipo2" :title="'<h5>Atualizar consulta</h5>'" v-tippy="{inertia:true,arrow:true,animation:'perspective',distance:'1',size:'large',arrow:true}">{{rating.ocorrencias.projetosExecutando.tipo2.length}}</span>
                    </td>

                    <td class="etiquetas w20">Ocorr. Peso 3:</td>
                    <td class="valores w10">
                      <span v-if="_.isNull(rating.ocorrencias.projetosEncerrados.tipo3)"><i class="fa fa-refresh fa-spin"></i></span>
                      <span v-else class="dado atualizavel" @click="projetosEncerradosOcorrenciaTipo3" :title="'<h5>Atualizar consulta</h5>'" v-tippy="{inertia:true,arrow:true,animation:'perspective',distance:'1',size:'large',arrow:true}">{{rating.ocorrencias.projetosEncerrados.tipo3.length}}</span>
                    </td>
                  </tr>

                  <tr>
                    <td v-show="false" class="etiquetas w20">Ocorr. Peso 4:</td>
                    <td v-show="false" class="valores w10">
                      <span v-if="_.isNull(rating.ocorrencias.entidade.tipo4)"><i class="fa fa-refresh fa-spin"></i></span>
                      <span v-else class="dado atualizavel" @click="entidadeOcorrenciaTipo4" :title="'<h5>Atualizar consulta</h5>'" v-tippy="{inertia:true,arrow:true,animation:'perspective',distance:'1',size:'large',arrow:true}">{{rating.ocorrencias.entidade.tipo4.length}}</span>
                    </td>

                    <td class="etiquetas w20">Ocorr. Peso 3:</td>
                    <td class="valores w10">
                      <span v-if="_.isNull(rating.ocorrencias.projetosExecutando.tipo3)"><i class="fa fa-refresh fa-spin"></i></span>
                      <span v-else class="dado atualizavel" @click="projetosExecutandoOcorrenciaTipo3" :title="'<h5>Atualizar consulta</h5>'" v-tippy="{inertia:true,arrow:true,animation:'perspective',distance:'1',size:'large',arrow:true}">{{rating.ocorrencias.projetosExecutando.tipo3.length}}</span>
                    </td>

                    <td class="etiquetas w20">Ocorr. Peso 4:</td>
                    <td class="valores w10">
                      <span v-if="_.isNull(rating.ocorrencias.projetosEncerrados.tipo4)"><i class="fa fa-refresh fa-spin"></i></span>
                      <span v-else class="dado atualizavel" @click="projetosEncerradosOcorrenciaTipo4" :title="'<h5>Atualizar consulta</h5>'" v-tippy="{inertia:true,arrow:true,animation:'perspective',distance:'1',size:'large',arrow:true}">{{rating.ocorrencias.projetosEncerrados.tipo4.length}}</span>
                    </td>
                  </tr>

                  <tr>
                    <td v-show="false" class="etiquetas w20">&nbsp;</td>
                    <td v-show="false" class="valores w10">&nbsp;</td>
                    <td class="etiquetas w20">Ocorr. Peso 4:</td>
                    <td class="valores w10">
                      <span v-if="_.isNull(rating.ocorrencias.projetosExecutando.tipo4)"><i class="fa fa-refresh fa-spin"></i></span>
                      <span v-else class="dado atualizavel" @click="projetosExecutandoOcorrenciaTipo4" :title="'<h5>Atualizar consulta</h5>'" v-tippy="{inertia:true,arrow:true,animation:'perspective',distance:'1',size:'large',arrow:true}">{{rating.ocorrencias.projetosExecutando.tipo4.length}}</span>
                    </td>
                    <td class="etiquetas w20">Qtd Peso 3:</td>
                    <td class="valores w10"><span class="dado">{{rating.ocorrencias.projetosEncerrados.qtdeTipo3}}</span></td>
                  </tr>

                  <tr>
                    <td v-show="false" class="etiquetas w20">&nbsp;</td>
                    <td v-show="false" class="valores w10">&nbsp;</td>
                    <td class="etiquetas w20">Qtd Peso 3:</td>
                    <td class="valores w10"><span class="dado">{{rating.ocorrencias.projetosExecutando.qtdeTipo3}}</span></td>
                    <td class="etiquetas w20">% com Peso 3:</td>
                    <td class="valores w10"><span class="dado">{{rating.ocorrencias.projetosEncerrados.percTipo3 | percentage}}</span></td>
                  </tr>

                  <tr>
                    <td v-show="false" class="etiquetas w20">&nbsp;</td>
                    <td v-show="false" class="valores w10">&nbsp;</td>
                    <td class="etiquetas w20">% com Peso 3:</td>
                    <td class="valores w10"><span class="dado">{{rating.ocorrencias.projetosExecutando.percTipo3 | percentage}}</span></td>
                    <td class="etiquetas w20">&nbsp;</td>
                    <td class="valores w10 w10">&nbsp;</td>
                  </tr>

                </table>
              </div>


              <!-- Cálculo do Rating -------------------------------------------------------------------------------------------------------------------------->
              <div class="col-md-12">
                <div class="secao">Rating:</div>
              </div>

              <div class="col-md-12">
                <table class="table">
                  <tr>
                    <td>
                      <table class="table table-condensed ratingCalculos">
                        <thead>
                        <tr>
                          <th :title="'<h5>Representa a situação da entidade e de seus dirigentes com relação a prestação de contas e ao cumprimento de seus compromisssos</h5>'"
                              v-tippy="{inertia:true,arrow:true,animation:'perspective',distance:'1',size:'large',arrow:true}">CD</th>
                          <th :title="'<h5>Reflete de maneira indireta as condições economico-financeiras da entidade</h5>'"
                              v-tippy="{inertia:true,arrow:true,animation:'perspective',distance:'1',size:'large',arrow:true}">RFP</th>
                          <th :title="'<h5>Sinaliza a capacidade de articulação da entidade considerando que quanto maior o investimento da FBB maior interesse , disposição e compentência em apresentar propostas</h5>'"
                              v-tippy="{inertia:true,arrow:true,animation:'perspective',distance:'1',size:'large',arrow:true}">IS</th>
                          <th :title="'<h5>Evidencia o aspecto social da atuação da entidade por meio da quantidade de participantes diretos atendidos</h5>'"
                              v-tippy="{inertia:true,arrow:true,animation:'perspective',distance:'1',size:'large',arrow:true}">PD</th>
                          <th :title="'<h5>Reflete a experiência da entidade com base em seu tempo de constituição</h5>'"
                              v-tippy="{inertia:true,arrow:true,animation:'perspective',distance:'1',size:'large',arrow:true}">HIS 1</th>
                          <th :title="'<h5>Experiência em projetos e o modus operandi da Fundação</h5>'"
                              v-tippy="{inertia:true,arrow:true,animation:'perspective',distance:'1',size:'large',arrow:true}">HIS 2</th>
                          <!--<th :title="'<h5>Reflete as ocorrências vigentes da entidade</h5>'"-->
                          <!--v-tippy="{inertia:true,arrow:true,animation:'perspective',distance:'1',size:'large',arrow:true}">OC 1</th>-->
                          <th :title="'<h5>Ocorrências registradas para projetos em execução</h5>'"
                              v-tippy="{inertia:true,arrow:true,animation:'perspective',distance:'1',size:'large',arrow:true}">OC 1</th>
                          <th :title="'<h5>Ocorrências registradas para projetos encerrado</h5>'"
                              v-tippy="{inertia:true,arrow:true,animation:'perspective',distance:'1',size:'large',arrow:true}">OC 2</th>
                        </tr>
                        </thead>
                        <tr class="dado">
                          <td>{{rating.ratingCalculado.CD}}</td>
                          <td>{{rating.ratingCalculado.RFP}}</td>
                          <td>{{rating.ratingCalculado.IS}}</td>
                          <td>{{rating.ratingCalculado.PD}}</td>
                          <td>{{rating.ratingCalculado.HIS1}}</td>
                          <td>{{rating.ratingCalculado.HIS2}}</td>
                          <!--<td>{{rating.ratingCalculado.OC1}}</td>-->
                          <td>{{rating.ratingCalculado.OC2}}</td>
                          <td>{{rating.ratingCalculado.OC3}}</td>
                        </tr>
                        <tr>
                          <td colspan="9"><span class="formula">{{rating.ratingCalculado.formula}} = </span><span class="dado">{{rating.ratingCalculado.total}}</span></td>
                        </tr>
                      </table>
                    </td>
                    <td class="ratingNota">Rating Entidade<br/><span :class="'dado rating' + rating.classificacao.nota">{{rating.classificacao.nota}}</span></td>
                  </tr>
                </table>
              </div>

            </div>

          </div>
        </div>
      </div>
    </section>

  </div>
</template>

<script>
  import Dirigentes from './dirigentes'
  import moment from 'moment'
  export default {
    name: 'relatorio-rating',
    components: {
      Dirigentes
    },
    data () {
      return {
        somenteLeitura: false,
        temDataErrada: false,
        idEntidade: 0,
        calculando: true,
        dadosGerais: {
          entidade: {
            dirigentes: []
          }
        },
        proposta: {},
        rating: {
          idProposta: 0,
          tudoPreenchido: 0,
          dirigentes: [],
          classificacao: {
            nota: ''
          },
          ratingCalculado: {
            CD: 0,
            RFP: 0,
            IS: 0,
            PD: 0,
            HIS1: 0,
            HIS2: 0,
            // OC1: 0,
            OC2: 0,
            OC3: 0,
            // formula: 'R = (3,5 * CD) + (3,5 * RFP) + (IS) + (1,5 * PD) + (3,5 * HIS 1) + (1,5 * HIS 2) + (2,5 * OC 1) + (2 * OC 2) + (OC 3)',
            formula: 'R = (3,5 * CD) + (3,5 * RFP) + (IS) + (1,5 * PD) + (2,5 * HIS 1) + (2,5 * HIS 2) + (3,5 * OC 1) + (2 * OC 2)',
            total: 0
          },
          consultas: {
            serasa: {},
            certidoes: {
              Cepim: null,
              dataCepim: null,
              CND: null,
              dataCND: null,
              CRF: null,
              dataCRF: null,
              CNDT: null,
              dataCNDT: null
            },
            scpc: {},
            cadin: {
              entidade: null,
              dataEntidade: null,
              dirigentes: null,
              dataDirigentes: null,
              coobrigacao: null,
              dataCoobrigacao: null
            },
            totalGeral: 0,
            PEP: 0
          },
          ocorrencias: {
            entidade: {
              tipo2: null,
              tipo3: null,
              tipo4: null
            },
            projetosExecutando: {
              qtde: null,
              tipo2: null,
              tipo3: null,
              tipo4: null,
              qtdeTipo3: null,
              percTipo3: null
            },
            projetosEncerrados: {
              qtde: null,
              tipo3: null,
              tipo4: null,
              qtdeTipo3: null,
              percTipo3: null
            }
          },
          experiencia: {
            investimentoAte3Anos: 0,
            participantesAte3Anos: 0,
            qtdeProjeto: 0
          }
        },
        analise: {},
        ratingCarregado: null,
        classificacaoRating: [{'nota': 'A', 'de': 90, 'para': 100}, {'nota': 'B', 'de': 70.1, 'para': 89.9}, {'nota': 'C', 'de': 55.1, 'para': 70}, {'nota': 'D', 'de': 40.1, 'para': 55}, {'nota': 'E', 'de': 0, 'para': 40}]
      }
    },
    props: ['propsAnalise'],
    watch: {
      propsAnalise () {
        this.analise = this.propsAnalise
        // this.idEntidade = this.propsAnalise.entidade.id
      }
    },
    computed: {
      async cadinDirigente () {
        let dirigentesCadin = _.filter(this.rating.dirigentes, function (o) {
          return _.has(o, 'cadin') && o.cadin !== 0
        })
        this.rating.consultas.cadin.dirigentes = (dirigentesCadin.length > 0) ? '9999-12-31' : 0
        await this.totalSCPSSerasa()
      },
      async totalSerasaDirigentes () {
        let dirigentesSerasa = _.sumBy(this.rating.dirigentes, 'serasa') || 0
        this.rating.consultas.serasa.dirigentes = dirigentesSerasa
        await this.totalSCPSSerasa()
      },
      async totalSCPCDirigentes () {
        let dirigentesSCPC = _.sumBy(this.rating.dirigentes, 'scpc') || 0
        this.rating.consultas.scpc.dirigentes = dirigentesSCPC
        await this.totalSCPSSerasa()
      }
    },
    mounted () {
      this.consultaEntidade()
      let bc = new BroadcastChannel('propostas')
      let vm = this
      bc.onmessage = function (e) {
        let mensagem = e.data
        if ((mensagem.acao === 'notificarSalvamento') && ('' + mensagem.id) === ('' + vm.$route.params.id)) {
          vm.calculando = false
        }
      }
    },
    async created () {
      this.rating.idProposta = this.$route.params.id
      this.calculando = true
      await this.buscaProposta()
      // await this.carregaRating()
    },
    methods: {
      closewindow () {
        close()
      },
      async totalSCPSSerasa () {
        this.rating.consultas.totalGeral = (this.rating.consultas.serasa.entidade + this.rating.consultas.serasa.dirigentes + this.rating.consultas.serasa.coobrigacao + this.rating.consultas.scpc.entidade + this.rating.consultas.scpc.dirigentes + this.rating.consultas.scpc.coobrigacao)
        await this.calcularRating()
      },
      salvarRating () {
        this.calculando = true
        axiosLaravel.post('rating/salvar/', {'rating': this.rating}).then((response) => {
          this.salvar()
          this.calculando = false
          this.$snotify.success('Rating salvo')
        })
          .catch((error) => {
            this.calculando = false
            this.$root.trataErro(error)
          })
      },
      async carregaRating () {
        await axiosLaravel.post('rating/carregar/', {'idProposta': this.$route.params.id}).then(async (response) => {
          this.ratingCarregado = response.data
          if (!_.isNull(this.ratingCarregado) && this.ratingCarregado !== '') {
            // verifica se o ratingCarregado está na versão do objeto mais recente
            if (_.has(this.ratingCarregado, 'classificacao')) {
              this.rating = _.clone(this.ratingCarregado)
            }
          } else {
            if (!_.has(this.proposta, 'rating') || !_.has(this.proposta.rating, 'ratingCalculado')) {
              this.proposta.rating = this.rating
            } else {
              if (_.has(this.proposta, 'rating') && _.has(this.proposta.rating, 'ratingCalculado') && this.proposta.rating.classificacao.nota !== '') {
                this.rating = this.proposta.rating
              }
            }
          }
          this.$forceUpdate()
        })
          .catch((error) => {
            this.$root.trataErro(error)
          })
      },
      //
      async entidadeOcorrenciaTipo2 () {
        this.rating.ocorrencias.entidade.tipo2 = null
        this.rating.ocorrencias.entidade.tipo2 = await this.buscaOcorrencias('entidade', {'id_entidade': this.idEntidade, 'tipo': 2, 'situacao_ocorrencia': 'vigentes'})
      },
      async entidadeOcorrenciaTipo3 () {
        this.rating.ocorrencias.entidade.tipo3 = null
        this.rating.ocorrencias.entidade.tipo3 = await this.buscaOcorrencias('entidade', {'id_entidade': this.idEntidade, 'tipo': 3, 'situacao_ocorrencia': 'vigentes'})
      },
      async entidadeOcorrenciaTipo4 () {
        this.rating.ocorrencias.entidade.tipo4 = null
        this.rating.ocorrencias.entidade.tipo4 = await this.buscaOcorrencias('entidade', {'id_entidade': this.idEntidade, 'tipo': 4, 'situacao_ocorrencia': 'vigentes'})
      },
      async projetosExecutandoOcorrenciaTipo2 () {
        this.rating.ocorrencias.projetosExecutando.tipo2 = null
        this.rating.ocorrencias.projetosExecutando.tipo2 = await this.buscaOcorrencias('projeto', {'id_entidade': this.idEntidade, 'tipo': 2, 'situacao_ocorrencia': 'vigentes', 'situacao_projeto': 'executando', 'dias': 1095})
      },
      async projetosExecutandoOcorrenciaTipo3 () {
        this.rating.ocorrencias.projetosExecutando.tipo3 = null
        this.rating.ocorrencias.projetosExecutando.tipo3 = await this.buscaOcorrencias('projeto', {'id_entidade': this.idEntidade, 'tipo': 3, 'situacao_ocorrencia': 'vigentes', 'situacao_projeto': 'executando', 'dias': 1095})
      },
      async projetosExecutandoOcorrenciaTipo4 () {
        this.rating.ocorrencias.projetosExecutando.tipo4 = null
        this.rating.ocorrencias.projetosExecutando.tipo4 = await this.buscaOcorrencias('projeto', {'id_entidade': this.idEntidade, 'tipo': 4, 'situacao_ocorrencia': 'vigentes', 'situacao_projeto': 'executando', 'dias': 1095})
      },
      async projetosEncerradosOcorrenciaTipo2 () {
        this.rating.ocorrencias.projetosEncerrados.tipo2 = null
        this.rating.ocorrencias.projetosEncerrados.tipo2 = await this.buscaOcorrencias('projeto', {'id_entidade': this.idEntidade, 'tipo': 2, 'situacao_ocorrencia': 'vigentes', 'situacao_projeto': 'encerrado', 'dias': 1095})
      },
      async projetosEncerradosOcorrenciaTipo3 () {
        this.rating.ocorrencias.projetosEncerrados.tipo3 = null
        this.rating.ocorrencias.projetosEncerrados.tipo3 = await this.buscaOcorrencias('projeto', {'id_entidade': this.idEntidade, 'tipo': 3, 'situacao_ocorrencia': 'vigentes', 'situacao_projeto': 'encerrado', 'dias': 1095})
      },
      async projetosEncerradosOcorrenciaTipo4 () {
        this.rating.ocorrencias.projetosEncerrados.tipo4 = null
        this.rating.ocorrencias.projetosEncerrados.tipo4 = await this.buscaOcorrencias('projeto', {'id_entidade': this.idEntidade, 'tipo': 4, 'situacao_ocorrencia': 'vigentes', 'situacao_projeto': 'encerrado', 'dias': 1095})
      },
      //
      //
      async buscaOcorrencias (origem, consulta) {
        let resultado = []
        origem = origem === 'projeto' ? 'consulta/ocorrencias/projeto/' : 'consulta/ocorrencias/entidade/'
        await axiosLaravel.post(origem, consulta).then((response) => {
          resultado = response.data
        })
          .catch((error) => {
            this.$root.trataErro(error)
          })
        return resultado
      },
      //
      //
      async atualizarTodasOcorrencias () {
        await this.entidadeOcorrenciaTipo2()
        await this.entidadeOcorrenciaTipo3()
        await this.entidadeOcorrenciaTipo4()
        await this.projetosExecutandoOcorrenciaTipo2()
        await this.projetosExecutandoOcorrenciaTipo3()
        await this.projetosExecutandoOcorrenciaTipo4()
        await this.projetosEncerradosOcorrenciaTipo3()
        await this.projetosEncerradosOcorrenciaTipo4()
        //
        await this.calcularRating()
      },
      // TODO excluir rating.vue (antigo e gera confusçao com esse atual)
      async buscaProposta () {
        this.$snotify.async('Carregando dados do Rating. Por favor, aguarde...', {timeout: 0})
        await axiosLaravel.get('propostas/' + this.$route.params.id).then(async (response) => {
          this.proposta = response.data
          this.idEntidade = this.proposta.entidade.id
          await this.carregaRating()
          if (this.somenteLeitura === false) {
            await this.atualizarTodasOcorrencias()
            // await this.carregaRating()
            if ((_.has(this.proposta, 'ds_situacao_erp') && !_.isNull(this.proposta.ds_situacao_erp) && !_.includes(['ANA', 'DEF', 'OPE'], this.proposta.ds_situacao_erp)) || (this.proposta.ds_fase === 'DEFERIMENTO' || this.proposta.ds_fase === 'APROVACAO_PROJETO')) {
              this.somenteLeitura = true
            } else {
              this.somenteLeitura = false
            }
          }
          this.$snotify.clear()
          // Suporte 65207 atualizado local da chamada durante a carga da entidade
          // this.atualizarListaDirigentes()
          this.$forceUpdate()
          this.atualizarListaDirigentes()
        })
          .catch((error) => {
            this.$snotify.clear()
            this.$root.trataErro(error)
          })
      },
      //
      consultaEntidade () {
        axiosLaravel.post('consulta/geral/entidade/', {'id': this.$route.query.entidade, 'tipo': 'entidade', 'dias': 1095}).then((response) => {
          this.dadosGerais = response.data
          this.$forceUpdate()
          this.dadosGerais.entidade['anosAbertura'] = moment().diff(moment(this.dadosGerais.entidade.dt_data_expedicao_cnpj), 'years', true)
          //
          let dirigentes = _.filter(this.dadosGerais.entidade.dirigentes, ['bt_ativo', 1])
          dirigentes.forEach((dirigente) => {
            this.rating.dirigentes.forEach((dirigenteRating) => {
              if (dirigente.id === dirigenteRating.id) {
                dirigente['scpc'] = dirigenteRating.scpc
                dirigente['serasa'] = dirigenteRating.serasa
              }
            })
          })
          // this.rating.dirigentes = dirigentes
          console.log('consultaEntidade - dirigentes atualizados - this.rating.dirigentes: ', this.rating.dirigentes)
          // Suporte 65207 atualizado local da chamada durante a carga da entidade
          // this.atualizarListaDirigentes()
          //
          this.rating.experiencia.investimentoAte3Anos = _.sumBy(this.dadosGerais.projetos, function (o) { return parseFloat(o.investimento) })
          this.rating.experiencia.participantesAte3Anos = _.sumBy(this.dadosGerais.projetos, function (o) { return o.participantes })
          this.rating.experiencia.qtdeProjeto = this.dadosGerais.projetos.length
          this.calcularRating()
        })
          .catch((error) => {
            this.$root.trataErro(error)
          })
      },
      //
      //
      calcularRating () {
        this.calculando = true
        let vm = this
        this.rating.ratingCalculado.CD = this.regua1()
        this.rating.ratingCalculado.RFP = this.regua2()
        this.rating.ratingCalculado.IS = this.regua3(vm)
        this.rating.ratingCalculado.PD = this.regua4(vm)
        this.rating.ratingCalculado.HIS1 = this.regua5(vm)
        this.rating.ratingCalculado.HIS2 = this.regua6(vm)
        // this.rating.ratingCalculado.OC1 = this.regua7()
        this.rating.ratingCalculado.OC2 = this.regua8()
        this.rating.ratingCalculado.OC3 = this.regua9()
        //
        this.rating.ratingCalculado.total = (3.5 * this.rating.ratingCalculado.CD) + (3.5 * this.rating.ratingCalculado.RFP) + (this.rating.ratingCalculado.IS) + (1.5 * this.rating.ratingCalculado.PD) + (2.5 * this.rating.ratingCalculado.HIS1) + (2.5 * this.rating.ratingCalculado.HIS2) + (3.5 * this.rating.ratingCalculado.OC2) + (2 * this.rating.ratingCalculado.OC3)
        //
        let nota = _.find(this.classificacaoRating, function (o) { return o.de <= vm.rating.ratingCalculado.total && vm.rating.ratingCalculado.total <= o.para })
        //
        if (!_.isUndefined(nota)) {
          this.rating.classificacao = nota
        }
        this.calculando = false
        this.tudoPreenchido = _.sumBy(_.map(vm.rating.consultas.certidoes), function (certidao) { return _.isNull(certidao) || _.isEmpty(certidao) ? 1 : 0 }) + _.sumBy(_.map(vm.rating.consultas.cadin), function (cadin) { return _.isNull(cadin) || _.isEmpty(cadin) ? 1 : 0 })
        this.$forceUpdate()
      },
      vigente (data) {
        return ('' + data) === '0'
      },
      regua1 () {
        if (!this.vigente(this.rating.consultas.certidoes.Cepim)) {
          return 0
        } else {
          let totalSerasaSCPCEntidade = this.rating.consultas.serasa.entidade + this.rating.consultas.scpc.entidade
          let totalSerasaSCPCDirigentes = this.rating.consultas.serasa.dirigentes + this.rating.consultas.serasa.coobrigacao + this.rating.consultas.scpc.dirigentes + this.rating.consultas.scpc.coobrigacao
          //
          // Demanda 65976 Alterações realizadas para correção de cálculo de Rating da Entidade
          // Correção na lógica e na ordem dos retornos
          if (totalSerasaSCPCDirigentes > 1000.01 && totalSerasaSCPCEntidade === 0) {
            return 2
          }
          if (totalSerasaSCPCDirigentes === 0 && totalSerasaSCPCEntidade === 0) {
            return 5
          }
          if (totalSerasaSCPCDirigentes + totalSerasaSCPCEntidade > 1000.01) {
            return 1
          }
          if ((totalSerasaSCPCDirigentes >= 0 && totalSerasaSCPCEntidade >= 0) && totalSerasaSCPCDirigentes + totalSerasaSCPCEntidade > 500) {
            return 3
          }
          if ((totalSerasaSCPCDirigentes >= 0 && totalSerasaSCPCEntidade >= 0) && totalSerasaSCPCDirigentes + totalSerasaSCPCEntidade <= 500) {
            return 4
          }
        }
      },
      regua2 () {
        if (!this.vigente(this.rating.consultas.cadin.entidade) && !this.vigente(this.rating.consultas.cadin.dirigentes) && !this.vigente(this.rating.consultas.cadin.coobrigacao) && (!this.vigente(this.rating.consultas.certidoes.CND) || !this.vigente(this.rating.consultas.certidoes.CNDT))) {
          return 0
        }
        if (this.vigente(this.rating.consultas.cadin.entidade) && !this.vigente(this.rating.consultas.cadin.dirigentes) || !this.vigente(this.rating.consultas.cadin.coobrigacao) && this.vigente(this.rating.consultas.certidoes.CND) && (!this.vigente(this.rating.consultas.certidoes.CRF) || !this.vigente(this.rating.consultas.certidoes.CNDT))) {
          return 1
        }
        if (this.vigente(this.rating.consultas.cadin.entidade) && this.vigente(this.rating.consultas.cadin.dirigentes) && this.vigente(this.rating.consultas.cadin.coobrigacao) && this.vigente(this.rating.consultas.certidoes.CND) && !this.vigente(this.rating.consultas.certidoes.CRF) && !this.vigente(this.rating.consultas.certidoes.CNDT)) {
          return 2
        }
        if (this.vigente(this.rating.consultas.cadin.entidade) && this.vigente(this.rating.consultas.cadin.dirigentes) && this.vigente(this.rating.consultas.cadin.coobrigacao) && this.vigente(this.rating.consultas.certidoes.CND) && this.XOR(this.vigente(this.rating.consultas.certidoes.CRF), this.vigente(this.rating.consultas.certidoes.CNDT))) {
          return 3
        }
        if (this.vigente(this.rating.consultas.cadin.entidade) && (!this.vigente(this.rating.consultas.cadin.dirigentes) || !this.vigente(this.rating.consultas.cadin.coobrigacao)) && this.vigente(this.rating.consultas.certidoes.CND) && this.vigente(this.rating.consultas.certidoes.CRF) && this.vigente(this.rating.consultas.certidoes.CNDT)) {
          return 4
        }
        if (this.vigente(this.rating.consultas.cadin.entidade) && this.vigente(this.rating.consultas.cadin.dirigentes) && this.vigente(this.rating.consultas.cadin.coobrigacao) && this.vigente(this.rating.consultas.certidoes.CND) && this.vigente(this.rating.consultas.certidoes.CRF) && this.vigente(this.rating.consultas.certidoes.CNDT)) {
          return 5
        }
        return 0
      },
      regua3 (vm) {
        let regua3 = [{'nota': 0, 'valor': 0}, {'nota': 1, 'valor': 70000}, {'nota': 2, 'valor': 100000}, {'nota': 3, 'valor': 200000}, {'nota': 4, 'valor': 300000}, {'nota': 5, 'valor': 999999999}]
        return (_.find(regua3, function (o) { return o.valor >= vm.rating.experiencia.investimentoAte3Anos }))['nota']
      },
      regua4 (vm) {
        let regua4 = [{'nota': 0, 'valor': 0}, {'nota': 1, 'valor': 50}, {'nota': 2, 'valor': 80}, {'nota': 3, 'valor': 100}, {'nota': 4, 'valor': 200}, {'nota': 5, 'valor': 999999999}]
        return (_.find(regua4, function (o) { return o.valor >= vm.rating.experiencia.participantesAte3Anos }))['nota']
      },
      regua5 (vm) {
        let regua5 = [{'nota': 1, 'valor': 2}, {'nota': 2, 'valor': 4}, {'nota': 3, 'valor': 6}, {'nota': 4, 'valor': 9}, {'nota': 5, 'valor': 999999999}]
        return (_.find(regua5, function (o) { return o.valor >= _.floor(vm.dadosGerais.entidade.anosAbertura) }))['nota']
      },
      regua6 (vm) {
        let regua6 = [{'nota': 0, 'valor': 0}, {'nota': 1, 'valor': 1}, {'nota': 2, 'valor': 2}, {'nota': 3, 'valor': 3}, {'nota': 4, 'valor': 4}, {'nota': 5, 'valor': 999999999}]
        return (_.find(regua6, function (o) { return o.valor >= vm.rating.experiencia.qtdeProjeto }))['nota']
      },
      // regua7 () {
      //   return (this.rating.ocorrencias.entidade.tipo4 > 0 ? 0 : (this.rating.ocorrencias.entidade.tipo3 > 0 ? 1 : (this.rating.ocorrencias.entidade.tipo2 > 0 ? 3 : 5)))
      // },
      regua8 () {
        this.rating.ocorrencias.projetosExecutando.qtde = (_.filter(this.dadosGerais.projetos, ['situacao', 'executando'])).length
        let projetos = _.map(this.dadosGerais.projetos, 'numero')
        let ocorrenciasTipos3 = _.map(this.rating.ocorrencias.projetosExecutando.tipo3, 'numprj')
        this.rating.ocorrencias.projetosExecutando.qtdeTipo3 = (_.intersection(projetos, ocorrenciasTipos3)).length
        this.rating.ocorrencias.projetosExecutando.percTipo3 = this.rating.ocorrencias.projetosExecutando.qtdeTipo3 / (this.rating.ocorrencias.projetosExecutando.qtde === 0 || this.ehNulo(this.rating.ocorrencias.projetosExecutando.qtde, true) ? 1 : this.rating.ocorrencias.projetosExecutando.qtde)
        //
        if (this.rating.ocorrencias.projetosExecutando.qtde === 0) {
          return 3
        }
        if (this.rating.ocorrencias.projetosExecutando.tipo2.length + this.rating.ocorrencias.projetosExecutando.tipo3.length + this.rating.ocorrencias.projetosExecutando.tipo4.length === 0) {
          return 5
        }
        if (this.rating.ocorrencias.projetosExecutando.tipo4.length > 0) {
          return 0
        } else {
          if (this.rating.ocorrencias.projetosExecutando.percTipo3 > 0.5) {
            return 1
          } else {
            return 3
          }
        }
      },
      regua9 () {
        this.rating.ocorrencias.projetosEncerrados.qtde = (_.filter(this.dadosGerais.projetos, ['situacao', 'executando'])).length
        let projetos = _.map(this.dadosGerais.projetos, 'numero')
        let ocorrenciasTipos3 = _.map(this.rating.ocorrencias.projetosEncerrados.tipo3, 'numprj')
        this.rating.ocorrencias.projetosEncerrados.qtdeTipo3 = (_.intersection(projetos, ocorrenciasTipos3)).length
        this.rating.ocorrencias.projetosExecutando.percTipo3 = this.rating.ocorrencias.projetosExecutando.qtdeTipo3 / (this.rating.ocorrencias.projetosEncerrados.qtde === 0 || this.ehNulo(this.rating.ocorrencias.projetosEncerrados.qtde, true) ? 1 : this.rating.ocorrencias.projetosEncerrados.qtde)
        //
        if (this.rating.ocorrencias.projetosEncerrados.qtde === 0) {
          return 3
        }
        if (this.rating.ocorrencias.projetosEncerrados.tipo3.length + this.rating.ocorrencias.projetosEncerrados.tipo4.length === 0) {
          return 5
        }
        if (this.rating.ocorrencias.projetosEncerrados.tipo4.length > 0) {
          return 0
        } else {
          if (this.rating.ocorrencias.projetosEncerrados.percTipo3 > 0.5) {
            return 1
          } else {
            return 3
          }
        }
      },
      ehNulo (valor, opcao) {
        return _.isNull(valor) || _.isNil(valor) || _.isUndefined(valor) ? opcao : valor
      },
      salvar () {
        this.$snotify.async('Salvando proposta. Por favor, aguarde...', {timeout: 0})
        this.calculando = true
        let bc = new BroadcastChannel('propostas')
        console.log('Enviando rating para propostas')
        //
        bc.postMessage({acao: 'set', objeto: 'proposta.rating', id: this.$route.params.id, valor: this.rating})
        console.log('|--> set:', {acao: 'set', objeto: 'proposta.rating', id: this.$route.params.id, valor: this.rating})
        //
        bc.postMessage({acao: 'salvarProposta', id: this.$route.params.id})
        console.log('|--> salvando proposta:', {acao: 'salvarProposta', id: this.$route.params.id})
        this.$snotify.clear()
        this.$snotify.success('Rating atualizado com sucesso!')
      },
      //
      imprimirRelatorio () {
        window.print()
      },
      XOR (a, b) {
        return (a || b) && !(a && b)
      },
      async verificaData () {
        this.temDataErrada = !_.isUndefined(this.errors.firstByRule('Cepim', 'dateeqpast')) ||
          !_.isUndefined(this.errors.firstByRule('cadin_entidade', 'dateeqpast')) ||
          !_.isUndefined(this.errors.firstByRule('cadin_dirigentes', 'dateeqpast')) ||
          !_.isUndefined(this.errors.firstByRule('cadin_dirigentes_coobrigacao', 'dateeqpast'))
      },
      // Suporte 62454 - Atualiza a lista dos dirigentes & Suporte 65207 atualizado local da chamada durante a carga da entidade (estava substituindo valores de serasa e spc).
      atualizarListaDirigentes () {
        let dirigentes = _.filter(this.dadosGerais.entidade.dirigentes, ['bt_ativo', 1])
        dirigentes.forEach((dirigente) => {
          this.rating.dirigentes.forEach((dirigenteRating) => {
            if (dirigente.id === dirigenteRating.id) {
              dirigente['scpc'] = dirigenteRating.scpc
              dirigente['serasa'] = dirigenteRating.serasa
            }
          })
        })
        this.rating.dirigentes = dirigentes
        console.log('atualizarListaDirigentes - dirigentes (this.dadosGerais.entidade.dirigentes): ', this.dadosGerais.entidade.dirigentes)
        console.log('atualizarListaDirigentes - dirigentes (this.rating.dirigentes): ', this.rating.dirigentes)
      }
    }
  }
</script>

<style>
  #rating .data, #rating .listaSituacao, #rating .textoLigacao {
    float: left;
    text-align: center;
  }

  #rating .textoLigacao {
    padding: 0 5px;
  }

  #rating .dado {
    color: steelblue;
    font-weight: bold;
    font-size: 16px;
  }

  #rating .nada_consta {
    width: 150px;
    float: left;
    margin-right: 5px;
    padding: 5px 0;
  }

  #rating .bt_nada_consta {
    float: right;
  }

  #rating .atualizavel:hover {
    cursor: pointer;
    color: deepskyblue;
  }

  #rating .ratingCalculos th, .ratingCalculos td, .ratingCalculos {
    text-align: center;
  }

  #rating .ratingNota {
    text-align: center;
    vertical-align: top;
  }

  #rating .ratingNota span {
    font-size: 40px;
    font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
  }

  #rating .ratingA {
    color: green !important;
  }
  #rating .ratingB {
    color: #ceb700 !important;
  }
  #rating .ratingC {
    color: orange !important;
  }
  #rating .ratingD {
    color: orangered !important;
  }
  #rating .ratingE {
    color: red !important;
  }

  #rating .requerido:after {
    color: #dd4b39;
    content: "*";
  }

  div.nao_imprimir {
    display: block !important;
  }

  table.nao_imprimir {
    visibility: visible !important;
  }

  div.imprimir {
    display: none !important;
  }
  table.imprimir {
    visibility: collapse !important;
  }


  .tabela_consultas {
    width: 100%;
  }

  #rating .secao {
    font-size: 18px;
    margin: 10px 0 10px 0;
    line-height: 1;
    border-bottom: 1px solid #f4f4f4;
    padding: 10px 0;
  }
  .tabela_consultas .cabecalho {
    padding-left: 1em;
    font-size: 18px;
    /*font-weight: bold;*/
  }
  .tabela_consultas .etiquetas {
    /*width: 30%;*/
    /*border: 1px solid blue;*/
    padding: 5px 2em;
  }
  .tabela_consultas .valores {
    /*width: 20%;*/
    /*border: 1px solid red;*/
  }

  .w5 {
    width: 5%;
  }

  .w10 {
    width: 10%;
  }

  .w15 {
    width: 15%;
  }

  .w20 {
    width: 20%;
  }

  .w30 {
    width: 30%;
  }

  .w40 {
    width: 40%;
  }

  .w50 {
    width: 50%;
  }

  .w100 {
    width: 100% !important;
  }

  span.dataConsulta:before {
    content: ' Data da Consulta';
    color: silver;
    float: right;
  }
  span.dataValidade:before {
    content: ' Data da Validade';
    color: silver;
    float: right;
  }

  #rating .b {
    font-weight: bold;
  }

  .alertaCamposPendentes {
    color: red;
    font-size: 16px;
  }

  .tituloRating {
    font-size: 25px;
    float: left;
    margin-top: 15px;
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

    #rating .secao {
      margin: 10px 0 0 0 !important;
      border-top: 1px solid silver !important;
      padding: 5px 0 0 0 !important;
    }
    #rating .tabela_consultas, #rating .table {
      border: 0px;
    }
    #rating .tabela_consultas .cabecalho {
      padding-left: 1em;
      font-size: 18px;
    }
    #rating .tabela_consultas .etiquetas {
      padding: 0px 2em !important;
    }
    #rating .tabela_consultas .valores input {
      padding: 0px !important;
      height: 14px !important;
      font-weight: bold !important;
    }

    #rating div.textoLigacao:before {
      content: '\2192';
    }

    #rating div.textoLigacao {
      margin-top: 8px;
      height: 18px;
    }

    #rating .data input {
      margin-top: 10px;
    }

    #rating .data input, #rating .listaSituacao select {
      border: 0 !important;
    }

    select::-ms-expand {
      display: none;
    }
    select{
      -webkit-appearance: none;
      appearance: none;
    }

    #rating .p0 {
      padding: 0px !important;
    }
    #rating .m0 {
      margin: 0px !important;
    }
    #rating .dado {
      font-weight: bold !important;
    }
    #rating .formula {
      font-size: xx-small !important;
    }

    span.dataConsulta:before {
      content: ' Consultado em';
      float: right;
      font-size: 12px !important;
    }
    span.dataValidade:before {
      content: ' Válido até';
      float: right;
      font-size: 12px !important;
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
      margin-left: 20px !important;
    }

    #Header, #Footer { display: none !important; }

    #app .content-wrapper * {
      background: white !important;
    }

  }

  @media screen {
    .reduz70 {
      width: 70% !important;
    }

  }
</style>
