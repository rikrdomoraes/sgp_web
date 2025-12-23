<template>
  <div class="box-body" id="rating">

    <div class="box-header with-border">
      <h3 class="box-title">Rating da Entidade</h3>
    </div>

    <div class="row" v-show="!edicaoCalculo">
      <div class="box-body">

        <div v-show="calculando" class="overlay" style="top: 0px; left: 0px; width: 100%; height: 100%; display: block;">
          <i class="fa fa-refresh fa-spin"></i>
        </div>

        <div class="row">
          <div class="col-md-12">
            <div class="col-md-1">
              <g-button-moema v-show="!calculando" color="primary" @click.native="edicaoCalculo = true" type="button"><i class="fa fa-pencil-square-o" aria-hidden="true"></i> Editar</g-button-moema>
            </div>

            <div class="col-md-9">
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
                  <th :title="'<h5>Reflete as ocorrências vigentes da entidade</h5>'"
                      v-tippy="{inertia:true,arrow:true,animation:'perspective',distance:'1',size:'large',arrow:true}">OC 1</th>
                  <th :title="'<h5>Ocorrências registradas para projetos em execução</h5>'"
                      v-tippy="{inertia:true,arrow:true,animation:'perspective',distance:'1',size:'large',arrow:true}">OC 2</th>
                  <th :title="'<h5>Ocorrências registradas para projetos encerrado</h5>'"
                      v-tippy="{inertia:true,arrow:true,animation:'perspective',distance:'1',size:'large',arrow:true}">OC 3</th>
                </tr>
                </thead>
                <tr class="dado">
                  <td>{{rating.ratingCalculado.CD}}</td>
                  <td>{{rating.ratingCalculado.RFP}}</td>
                  <td>{{rating.ratingCalculado.IS}}</td>
                  <td>{{rating.ratingCalculado.PD}}</td>
                  <td>{{rating.ratingCalculado.HIS1}}</td>
                  <td>{{rating.ratingCalculado.HIS2}}</td>
                  <td>{{rating.ratingCalculado.OC1}}</td>
                  <td>{{rating.ratingCalculado.OC2}}</td>
                  <td>{{rating.ratingCalculado.OC3}}</td>
                </tr>
                <tr>
                  <td colspan="9">{{rating.ratingCalculado.formula}} = <span class="dado">{{rating.ratingCalculado.total}}</span></td>
                </tr>
              </table>
            </div>

            <div class="col-md-2 ratingCalculos">
              <span v-if="!calculando" class="dado ratingNota">{{rating.classificacao.nota}}</span>
              <span v-else class="dado ratingNota"><i class="fa fa-refresh fa-spin"></i></span>
            </div>

          </div>
        </div>
      </div>
    </div>




    <div class="row well well-sm no-shadow animated fadeInDownOutUp" v-show="edicaoCalculo">

    <!--Dados da entidade -------------------------------------------------------------------------------------------------------------------------->
      <div class="row">
        <div class="col-md-12">
          <legend><b>Dados da entidade:</b></legend>
        </div>

        <div class="col-md-11">

          <div>
            <label class="control-label col-md-2">Convenente:</label>
            <div class="col-md-10">
              <span class="dado">{{dadosGerais.entidade.ds_nome}}</span>
            </div>
          </div>

          <div>
            <label class="control-label col-md-2">Código:</label>
            <div class="col-md-10">
              <span class="dado">{{dadosGerais.entidade.nr_codigo_forn_erp}}</span>
            </div>
          </div>

          <div>
            <label class="control-label col-md-2">CNPJ:</label>
            <div class="col-md-10">
              <span class="dado">{{dadosGerais.entidade.ds_cnpj | cnpj}}</span>
            </div>
          </div>

          <div>
            <label class="control-label col-md-2">Data de abertura:</label>
            <div class="col-md-10">
              <span class="dado">{{dadosGerais.entidade.dt_data_expedicao_cnpj | moment("L")}}</span>
            </div>
          </div>

          <div>
            <label class="control-label col-md-2">Tempo de abertura:</label>
            <div class="col-md-10">
              <span class="dado">{{dadosGerais.entidade.dt_data_expedicao_cnpj | moment("from", "now")}}</span>
            </div>
          </div>


          <div class="form-group">
            <label class="control-label col-md-2">Dirigentes:</label>
            <div class="col-md-12">

              <table class="table table-bordered text-center">
                <thead>
                  <tr>
                    <th>Nome</th>
                    <th>CPF</th>
                    <th class="requerido">SERASA</th>
                    <th class="requerido">SCPC</th>
                    <th class="requerido">CADIN</th>
                    <th>Início do Mandato</th>
                    <th>Vigência do Mandato</th>
                    <th>Ativo</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="dirigente in dadosGerais.entidade.dirigentes">
                    <td>{{dirigente.ds_nome}}&nbsp;&nbsp;&nbsp;&nbsp;<span style="color: cornflowerblue">{{dirigente.cargo.ds_descricao }}</span></td>
                    <td>{{dirigente.ds_cpf}}</td>
                    <td><money v-model="dirigente.serasa" v-bind:onchange="totalSerasaDirigentes" name="serasa_dirigente" class="form-control text-right" type="text" v-validate="'required'"></money></td>
                    <td><money v-model="dirigente.scpc" v-bind:onchange="totalSCPCDirigentes" name="scpc_dirigente" class="form-control text-right" type="text" v-validate="'required'"></money></td>
                    <td>
                      <div v-if="dirigente.cadin !== 0" class="data">
                               <!--@change="cadinDirigente"-->
                        <input type="text" v-model="dirigente.cadin" class="form-control"
                               v-bind:onchange="cadinDirigente"
                               v-mask="'##/##/####'" :data-vv-as="cadin_dirigente" :masked="masked" v-validate="'required|validdate|dateeqfuture'">
                        <span v-if="errors.first('cadin_dirigente')" class="label label-danger"> {{ errors.first('cadin_dirigente') }}</span>
                      </div>
                      <div v-else class="nada_consta dado">NADA CONSTA</div>
                      <g-button-ujarak color="warning" size="button--size-ss" @click.native="dirigente.cadin = (dirigente.cadin === 0 ? null : 0)" class="bt_nada_consta"
                                       :title="'<h5>' + (dirigente.cadin === 0 ? 'Se houver certidão, clique para informar a data de validade' : 'Clique para Nada Consta no Cadin!') + '</h5>'"
                                       v-tippy="{inertia:true,arrow:true,animation:'perspective',distance:'1',size:'large',arrow:true}">
                        <i class="fa fa-exclamation" aria-hidden="true"></i>
                      </g-button-ujarak>
                    </td>
                    <td>{{dirigente.dt_inicio_mandato | moment("L")}}</td>
                    <td>{{dirigente.dt_fim_mandato | moment("L")}}</td>
                    <td><i :class="['fa fa-circle ', dirigente.bt_ativo ? 'text-green' : 'text-red']" aria-hidden="true"></i></td>
                  </tr>
                </tbody>
              </table>

            </div>
          </div>

        </div>
      </div>

    <!--Consultas cadastrais e regularidade fiscal e previdenciária -------------------------------------------------------------------------------->
      <div class="row">
        <div class="col-md-12">
          <legend><b>Consultas cadastrais e regularidade fiscal e previdenciária:</b></legend>
        </div>

        <div class="col-md-offset-1 col-md-8">

        <!--SERASA-->
          <div class="col-md-6">
            <legend><b>SERASA:</b></legend>

          <!--SERASA Entidade-->
            <div class="form-group required-field" :class="{ 'has-error' : errors.first('SERASA da entidade')}">
              <label class="control-label col-md-6">Entidade:</label>
              <div class="col-md-6">
                <div>
                  <money v-model="rating.consultas.serasa.entidade" name="serasa_entidade" class="form-control text-right" type="text" v-validate="'required'"></money>
                </div>
                <span v-if="errors.first('SERASA da entidade')" class="label label-danger"> {{ errors.first('SERASA da entidade') }}</span>
              </div>
            </div>


          <!--SERASA Dirigentes-->
            <div class="form-group required-field" :class="{ 'has-error' : errors.first('SERASA de dirigentes')}">
              <label class="control-label col-md-6">Dirigentes:</label>
              <div class="col-md-6">
                <div>
                  <money :disabled="true" v-model="rating.consultas.serasa.dirigentes" name="serasa_dirigentes" class="form-control text-right" type="text" v-validate="'required'"></money>
                </div>
                <span v-if="errors.first('SERASA de dirigentes')" class="label label-danger"> {{ errors.first('SERASA de dirigentes') }}</span>
              </div>
            </div>


          <!--SERASA Dirigentes Coobrigação-->
            <div class="form-group required-field" :class="{ 'has-error' : errors.first('SERASA de dirigentes coobrigação')}">
              <label class="control-label col-md-6">Dirigentes Coobrigação:</label>
              <div class="col-md-6">
                <div>
                  <money v-model="rating.consultas.serasa.coobrigacao" name="serasa_coobrigacao" class="form-control text-right" type="text" v-validate="'required'"></money>
                </div>
                <span v-if="errors.first('SERASA de dirigentes coobrigação')" class="label label-danger"> {{ errors.first('SERASA de dirigentes coobrigação') }}</span>
              </div>
            </div>

          </div>


        <!--CEPIM e Certidões-->
          <div class="col-md-6">
            <legend><b>CEPIM e Certidões:</b></legend>

              <!-- CEPIM -->
              <div class="form-group required-field" :class="{ 'has-error' : errors.first('Cepim')}">
                <label for="Cepim" class="control-label col-md-6">Cepim:</label>
                <div class="col-md-6">
                  <div v-if="rating.consultas.certidoes.Cepim !== 0" class="data">
                    <input id="Cepim" type="text" ref="Cepim" name="Cepim" v-model="rating.consultas.certidoes.Cepim" class="form-control"
                           v-mask="'##/##/####'" data-vv-as="Cepim" :masked="masked" v-validate="'required|validdate|dateeqfuture'">
                    <span v-if="errors.first('Cepim')" class="label label-danger"> {{ errors.first('Cepim') }}</span>
                  </div>
                  <div v-else class="nada_consta dado">NADA CONSTA</div>
                  <g-button-ujarak color="warning" size="button--size-ss" @click.native="rating.consultas.certidoes.Cepim = (rating.consultas.certidoes.Cepim === 0 ? null : 0)" class="bt_nada_consta"
                                   :title="'<h5>' + (rating.consultas.certidoes.Cepim === 0 ? 'Há certidão! Informe a data de validade' : 'Nada Consta !') + '</h5>'"
                                   v-tippy="{inertia : true, arrow : true, animation : 'perspective', distance:'1', size: 'large', arrow : true}">
                    <i class="fa fa-exclamation" aria-hidden="true"></i>
                  </g-button-ujarak>
                </div>
              </div>

            <!--CND-->
            <div class="form-group required-field" :class="{ 'has-error' : errors.first('CND')}">
              <label for="CND" class="control-label col-md-6">CND ou CPD-EN:</label>
              <div class="col-md-6">
                <div v-if="rating.consultas.certidoes.CND !== 0" class="data">
                  <input id="CND" type="text" ref="CND" name="CND" v-model="rating.consultas.certidoes.CND" class="form-control"
                         v-mask="'##/##/####'" data-vv-as="CND" :masked="masked" v-validate="'required|validdate|dateeqfuture'">
                  <span v-if="errors.first('CND')" class="label label-danger"> {{ errors.first('CND') }}</span>
                </div>
                <div v-else class="nada_consta dado">NADA CONSTA</div>
                <g-button-ujarak color="warning" size="button--size-ss" @click.native="rating.consultas.certidoes.CND = (rating.consultas.certidoes.CND === 0 ? null : 0)" class="bt_nada_consta"
                                 :title="'<h5>' + (rating.consultas.certidoes.CND === 0 ? 'Há certidão! Informe a data de validade' : 'Nada Consta !') + '</h5>'"
                                 v-tippy="{inertia : true, arrow : true, animation : 'perspective', distance:'1', size: 'large', arrow : true}">
                  <i class="fa fa-exclamation" aria-hidden="true"></i>
                </g-button-ujarak>
              </div>
            </div>

            <!--CRF-->
            <div class="form-group required-field" :class="{ 'has-error' : errors.first('CRF')}">
              <label for="CRF" class="control-label col-md-6">CRF:</label>
              <div class="col-md-6">
                <div v-if="rating.consultas.certidoes.CRF !== 0" class="data">
                  <input id="CRF" type="text" ref="CRF" name="CRF" v-model="rating.consultas.certidoes.CRF" class="form-control"
                         v-mask="'##/##/####'" data-vv-as="CRF" :masked="masked" v-validate="'required|validdate|dateeqfuture'">
                  <span v-if="errors.first('CRF')" class="label label-danger"> {{ errors.first('CRF') }}</span>
                </div>
                <div v-else class="nada_consta dado">NADA CONSTA</div>
                <g-button-ujarak color="warning" size="button--size-ss" @click.native="rating.consultas.certidoes.CRF = (rating.consultas.certidoes.CRF === 0 ? null : 0)" class="bt_nada_consta"
                                 :title="'<h5>' + (rating.consultas.certidoes.CRF === 0 ? 'Há certidão! Informe a data de validade' : 'Nada Consta !') + '</h5>'"
                                 v-tippy="{inertia : true, arrow : true, animation : 'perspective', distance:'1', size: 'large', arrow : true}">
                  <i class="fa fa-exclamation" aria-hidden="true"></i>
                </g-button-ujarak>
              </div>
            </div>

            <!--CNDT-->
            <div class="form-group required-field" :class="{ 'has-error' : errors.first('CNDT')}">
              <label for="CNDT" class="control-label col-md-6">CNDT:</label>
              <div class="col-md-6">
                <div v-if="rating.consultas.certidoes.CNDT !== 0" class="data">
                  <input id="CNDT" type="text" ref="CNDT" name="CNDT" v-model="rating.consultas.certidoes.CNDT" class="form-control"
                         v-mask="'##/##/####'" data-vv-as="CNDT" :masked="masked" v-validate="'required|validdate|dateeqfuture'">
                  <span v-if="errors.first('CNDT')" class="label label-danger"> {{ errors.first('CNDT') }}</span>
                </div>
                <div v-else class="nada_consta dado">NADA CONSTA</div>
                <g-button-ujarak color="warning" size="button--size-ss" @click.native="rating.consultas.certidoes.CNDT = (rating.consultas.certidoes.CNDT === 0 ? null : 0)" class="bt_nada_consta"
                                 :title="'<h5>' + (rating.consultas.certidoes.CNDT === 0 ? 'Há certidão! Informe a data de validade' : 'Nada Consta !') + '</h5>'"
                                 v-tippy="{inertia : true, arrow : true, animation : 'perspective', distance:'1', size: 'large', arrow : true}">
                  <i class="fa fa-exclamation" aria-hidden="true"></i>
                </g-button-ujarak>
              </div>
            </div>

          </div>

        </div>
        
      </div>


      <div class="row">

        <!--SCPC-->
        <div class="col-md-offset-1 col-md-8">

          <div class="col-md-6">
            <legend><b>SCPC:</b></legend>

            <!--SCPC Entidade-->
            <div class="form-group required-field" :class="{ 'has-error' : errors.first('SCPC da entidade')}">
              <label class="control-label col-md-6">Entidade:</label>
              <div class="col-md-6">
                <div>
                  <money v-model="rating.consultas.scpc.entidade" name="scpc_entidade" class="form-control text-right" type="text" v-validate="'required'"></money>
                </div>
                <span v-if="errors.first('SCPC da entidade')" class="label label-danger"> {{ errors.first('SCPC da entidade') }}</span>
              </div>
            </div>


            <!--SCPC Dirigentes-->
            <div class="form-group required-field" :class="{ 'has-error' : errors.first('SCPC de dirigentes')}">
              <label class="control-label col-md-6">Dirigentes:</label>
              <div class="col-md-6">
                <div>
                  <money :disabled="true"  v-model="rating.consultas.scpc.dirigentes" name="scpc_dirigentes" class="form-control text-right" type="text" v-validate="'required'"></money>
                </div>
                <span v-if="errors.first('SCPC de dirigentes')" class="label label-danger"> {{ errors.first('SCPC de dirigentes') }}</span>
              </div>
            </div>


            <!--SCPC Dirigentes Coobrigação-->
            <div class="form-group required-field" :class="{ 'has-error' : errors.first('SCPC de dirigentes coobrigação')}">
              <label class="control-label col-md-6">Dirigentes Coobrigação:</label>
              <div class="col-md-6">
                <div>
                  <money v-model="rating.consultas.scpc.coobrigacao" name="scpc_coobrigacao" class="form-control text-right" type="text" v-validate="'required'"></money>
                </div>
                <span v-if="errors.first('SCPC de dirigentes coobrigação')" class="label label-danger"> {{ errors.first('SCPC de dirigentes coobrigação') }}</span>
              </div>
            </div>

          </div>


        <!--CADIN-->
          <div class="col-md-6">
            <legend><b>CADIN:</b></legend>

            <!--CADIN Entidade-->
            <div class="form-group required-field" :class="{ 'has-error' : errors.first('CADIN da entidade')}">
              <label for="cadin_entidade" class="control-label col-md-6">Entidade:</label>
              <div class="col-md-6">
                <div v-if="rating.consultas.cadin.entidade !== 0" class="data">
                  <input id="cadin_entidade" type="text" name="cadin_entidade" v-model="rating.consultas.cadin.entidade" class="form-control"
                         v-mask="'##/##/####'" data-vv-as="cadin_entidade" :masked="masked" v-validate="'required|validdate|dateeqfuture'">
                  <span v-if="errors.first('CADIN da entidade')" class="label label-danger"> {{ errors.first('CADIN da entidade') }}</span>
                </div>
                <div v-else class="nada_consta dado">NADA CONSTA</div>
                <g-button-ujarak color="warning" size="button--size-ss" @click.native="rating.consultas.cadin.entidade = (rating.consultas.cadin.entidade === 0 ? null : 0)" class="bt_nada_consta"
                                 :title="'<h5>' + (rating.consultas.cadin.entidade === 0 ? 'Há certidão! Informe a data de validade' : 'Nada Consta !') + '</h5>'"
                                 v-tippy="{inertia : true, arrow : true, animation : 'perspective', distance:'1', size: 'large', arrow : true}">
                  <i class="fa fa-exclamation" aria-hidden="true"></i>
                </g-button-ujarak>
              </div>
            </div>

            <!--CADIN Dirigentes-->
            <div class="form-group required-field" :class="{ 'has-error' : errors.first('CADIN de dirigentes')}">
              <label class="control-label col-md-6">Dirigentes:</label>
              <div class="col-md-6">
                <div v-if="rating.consultas.cadin.dirigentes !== 0" class="nada_consta dado">CONSTA</div>
                <div v-else class="nada_consta dado">NADA CONSTA</div>
              </div>
            </div>

            <!--CADIN Dirigentes Coobrigação-->
            <div class="form-group required-field" :class="{ 'has-error' : errors.first('CADIN de dirigentes coobrigação')}">
              <label for="cadin_dirigentes_coobrigacao" class="control-label col-md-6">Dirigentes Coobrigação:</label>
              <div class="col-md-6">
                <div v-if="rating.consultas.cadin.coobrigacao !== 0" class="data">
                  <input id="cadin_dirigentes_coobrigacao" type="text" name="cadin_dirigentes_coobrigacao" v-model="rating.consultas.cadin.coobrigacao" class="form-control"
                         v-mask="'##/##/####'" data-vv-as="cadin_dirigentes_coobrigacao" :masked="masked" v-validate="'required|validdate|dateeqfuture'">
                  <span v-if="errors.first('CADIN de dirigentes coobrigação')" class="label label-danger"> {{ errors.first('CADIN de dirigentes coobrigação') }}</span>
                </div>
                <div v-else class="nada_consta dado">NADA CONSTA</div>
                <g-button-ujarak color="warning" size="button--size-ss" @click.native="rating.consultas.cadin.coobrigacao = (rating.consultas.cadin.coobrigacao === 0 ? null : 0)" class="bt_nada_consta"
                                 :title="'<h5>' + (rating.consultas.cadin.coobrigacao === 0 ? 'Há certidão! Informe a data de validade' : 'Nada Consta !') + '</h5>'"
                                 v-tippy="{inertia : true, arrow : true, animation : 'perspective', distance:'1', size: 'large', arrow : true}">
                  <i class="fa fa-exclamation" aria-hidden="true"></i>
                </g-button-ujarak>
              </div>
            </div>

          </div>

        </div>

      </div>

    <!--Total Geral-->
      <div class="row">
        <div class="col-md-offset-1 col-md-8">

          <div class="col-md-6">
            <div class="form-group">
              <label class="control-label col-md-6">Total Geral:</label>
              <div class="col-md-6">
                <money v-model="rating.consultas.totalGeral" name="total_scpc_serasa" class="form-control text-right" type="text" :disabled="true"></money>
              </div>
            </div>
          </div>

          <div class="col-md-6">
            <div class="form-group">
              <label for="pep" class="control-label col-md-6">Quantidade de Pessoas Politicamente Expostas (PEP):</label>
              <div class="col-md-6">
                <input id="pep" type="text" name="pep" v-model="rating.consultas.PEP" class="form-control" v-validate="'required'">
              </div>
            </div>
          </div>

          <div class="col-md-12">
            As restrições que apresentam SCPC e SERASA para a mesma ocorrência são consideradas somente uma única vez no cálculo
          </div>
        </div>
      </div>
      


    <!--Experiência com a FBB --------------------------------------------------------------------------------------------------------------------------->
      <div class="row">
        <div class="col-md-12">
          <legend><b>Experiência com a FBB:</b></legend>
        </div>

        <div class="col-md-6">

          <!--Investimento Social (ISD, últimos 3 anos)-->
          <div>
            <label class="control-label col-md-6">Investimento Social (ISD, últimos 3 anos):</label>
            <div class="col-md-6">
              <span class="dado" :title="'<h5>Refere-se a soma dos valores contratados e suplementados no projeto</h5>'" v-tippy="{inertia:true,arrow:true,animation:'perspective',distance:'1',size:'large',arrow:true}">
                {{rating.experiencia.investimentoAte3Anos | real}}
              </span>
            </div>
          </div>

        <!--Participantes Diretos (ISD, últimos 3 anos)-->
          <div>
            <label class="control-label col-md-6">Participantes Diretos (ISD, últimos 3 anos):</label>
            <div class="col-md-6">
              <span class="dado" :title="'<h5>Refere-se a quantidade total de participantes dos projetos contratados</h5>'" v-tippy="{inertia:true,arrow:true,animation:'perspective',distance:'1',size:'large',arrow:true}">
                {{rating.experiencia.participantesAte3Anos}}
              </span>
            </div>
          </div>

        <!--Nº Projetos com a FBB-->
          <div>
            <label class="control-label col-md-6">Nº Projetos com a FBB:</label>
            <div class="col-md-6">
              <span class="dado" :title="'<h5>É a quantidade de projetos contratados dessa entidade</h5>'" v-tippy="{inertia:true,arrow:true,animation:'perspective',distance:'1',size:'large',arrow:true}">
                {{rating.experiencia.qtdeProjeto}}
              </span>
            </div>
          </div>

        </div>

      </div>


    <!--Ocorrências --------------------------------------------------------------------------------------------------------------------------->
      <div class="row">
        <div class="col-md-12">
          <legend><b>Ocorrências:</b></legend>
        </div>

        <div class="col-md-offset-1 col-md-8">

        <!--Ocorrências Entidade-->
          <div class="col-md-4">
            <legend><b>Entidade:</b></legend>

            <!--Tipo 2-->
            <div>
              <label class="control-label col-md-6">Ocorr. Peso 2:</label>
              <div class="col-md-6">
                <span v-if="_.isNull(rating.ocorrencias.entidade.tipo2)"><i class="fa fa-refresh fa-spin"></i></span>
                <span v-else class="dado atualizavel" @click="entidadeOcorrenciaTipo2, calcularRating" :title="'<h5>Atualizar consulta</h5>'" v-tippy="{inertia:true,arrow:true,animation:'perspective',distance:'1',size:'large',arrow:true}">{{rating.ocorrencias.entidade.tipo2.length}}</span>
              </div>
            </div>

            <!--Tipo 3-->
            <div>
              <label class="control-label col-md-6">Ocorr. Peso 3:</label>
              <div class="col-md-6">
                <span v-if="_.isNull(rating.ocorrencias.entidade.tipo3)"><i class="fa fa-refresh fa-spin"></i></span>
                <span v-else class="dado atualizavel" @click="entidadeOcorrenciaTipo3, calcularRating" :title="'<h5>Atualizar consulta</h5>'" v-tippy="{inertia:true,arrow:true,animation:'perspective',distance:'1',size:'large',arrow:true}">{{rating.ocorrencias.entidade.tipo3.length}}</span>
              </div>
            </div>

            <!--Tipo 4-->
            <div>
              <label class="control-label col-md-6">Ocorr. Peso 4:</label>
              <div class="col-md-6">
                <span v-if="_.isNull(rating.ocorrencias.entidade.tipo4)"><i class="fa fa-refresh fa-spin"></i></span>
                <span v-else class="dado atualizavel" @click="entidadeOcorrenciaTipo4, calcularRating" :title="'<h5>Atualizar consulta</h5>'" v-tippy="{inertia:true,arrow:true,animation:'perspective',distance:'1',size:'large',arrow:true}">{{rating.ocorrencias.entidade.tipo4.length}}</span>
              </div>
            </div>

          </div>



        <!--Projetos em Execução, ETO, SPS-->
          <div class="col-md-4">
            <legend><b>Projetos em Execução, ETO, SPS:</b></legend>

            <!--Qtde Executando-->
            <div>
              <label class="control-label col-md-6">Qtd Executando:</label>
              <div class="col-md-6">
                <span class="dado">{{rating.ocorrencias.projetosExecutando.qtde}}</span>
              </div>
            </div>

            <!--Tipo 2-->
            <div>
              <label class="control-label col-md-6">Ocorr. Peso 2:</label>
              <div class="col-md-6">
                <span v-if="_.isNull(rating.ocorrencias.projetosExecutando.tipo2)"><i class="fa fa-refresh fa-spin"></i></span>
                <span v-else class="dado atualizavel" @click="projetosExecutandoOcorrenciaTipo2, calcularRating" :title="'<h5>Atualizar consulta</h5>'" v-tippy="{inertia:true,arrow:true,animation:'perspective',distance:'1',size:'large',arrow:true}">{{rating.ocorrencias.projetosExecutando.tipo2.length}}</span>
              </div>
            </div>

            <!--Tipo 3-->
            <div>
              <label class="control-label col-md-6">Ocorr. Peso 3:</label>
              <div class="col-md-6">
                <span v-if="_.isNull(rating.ocorrencias.projetosExecutando.tipo3)"><i class="fa fa-refresh fa-spin"></i></span>
                <span v-else class="dado atualizavel" @click="projetosExecutandoOcorrenciaTipo3, calcularRating" :title="'<h5>Atualizar consulta</h5>'" v-tippy="{inertia:true,arrow:true,animation:'perspective',distance:'1',size:'large',arrow:true}">{{rating.ocorrencias.projetosExecutando.tipo3.length}}</span>
              </div>
            </div>

            <!--Tipo 4-->
            <div>
              <label class="control-label col-md-6">Ocorr. Peso 4:</label>
              <div class="col-md-6">
                <span v-if="_.isNull(rating.ocorrencias.projetosExecutando.tipo4)"><i class="fa fa-refresh fa-spin"></i></span>
                <span v-else class="dado atualizavel" @click="projetosExecutandoOcorrenciaTipo4, calcularRating" :title="'<h5>Atualizar consulta</h5>'" v-tippy="{inertia:true,arrow:true,animation:'perspective',distance:'1',size:'large',arrow:true}">{{rating.ocorrencias.projetosExecutando.tipo4.length}}</span>
              </div>
            </div>

            <!--Qtde Tipo 3-->
            <div>
              <label class="control-label col-md-6">Qtd Peso 3:</label>
              <div class="col-md-6">
                <span class="dado">{{rating.ocorrencias.projetosExecutando.qtdeTipo3}}</span>
              </div>
            </div>

            <!--Percentual Tipo 3-->
            <div>
              <label class="control-label col-md-6">% com Peso 3:</label>
              <div class="col-md-6">
                <span class="dado">{{rating.ocorrencias.projetosExecutando.percTipo3 | percentage}}</span>
              </div>
            </div>

          </div>

        <!--Projetos Encerrados (3 anos)-->
          <div class="col-md-4">
            <legend><b>Projetos Encerrados (3 anos):</b></legend>

            <!--Qtde Executando-->
            <div>
              <label class="control-label col-md-6">Qtd Executado:</label>
              <div class="col-md-6">
                <span class="dado">{{rating.ocorrencias.projetosEncerrados.qtde}}</span>
              </div>
            </div>

            <!--Tipo 3-->
            <div>
              <label class="control-label col-md-6">Ocorr. Peso 3:</label>
              <div class="col-md-6">
                <span v-if="_.isNull(rating.ocorrencias.projetosEncerrados.tipo3)"><i class="fa fa-refresh fa-spin"></i></span>
                <span v-else class="dado atualizavel" @click="projetosEncerradosOcorrenciaTipo3, calcularRating" :title="'<h5>Atualizar consulta</h5>'" v-tippy="{inertia:true,arrow:true,animation:'perspective',distance:'1',size:'large',arrow:true}">{{rating.ocorrencias.projetosEncerrados.tipo3.length}}</span>
              </div>
            </div>

            <!--Tipo 4-->
            <div>
              <label class="control-label col-md-6">Ocorr. Peso 4:</label>
              <div class="col-md-6">
                <span v-if="_.isNull(rating.ocorrencias.projetosEncerrados.tipo4)"><i class="fa fa-refresh fa-spin"></i></span>
                <span v-else class="dado atualizavel" @click="projetosEncerradosOcorrenciaTipo4, calcularRating" :title="'<h5>Atualizar consulta</h5>'" v-tippy="{inertia:true,arrow:true,animation:'perspective',distance:'1',size:'large',arrow:true}">{{rating.ocorrencias.projetosEncerrados.tipo4.length}}</span>
              </div>
            </div>

            <!--Qtde Tipo 3-->
            <div>
              <label class="control-label col-md-6">Qtd Peso 3:</label>
              <div class="col-md-6">
                <span class="dado">{{rating.ocorrencias.projetosEncerrados.qtdeTipo3}}</span>
              </div>
            </div>

            <!--Percentual Tipo 3-->
            <div>
              <label class="control-label col-md-6">% com Peso 3:</label>
              <div class="col-md-6">
                <span class="dado">{{rating.ocorrencias.projetosEncerrados.percTipo3 | percentage}}</span>
              </div>
            </div>

          </div>

        </div>
      </div>


      <div class="row">

        <div class="col-md-12">
          <legend><b>Rating:</b></legend>
          <div class="col-md-1">
            <g-button-ujarak color="primary" @click.native="calcularRating" type="button"><i class="fa fa-chevron-circle-left" aria-hidden="true"></i> Recalcular Rating</g-button-ujarak>
          </div>

          <div class="col-md-9">
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
                  <th :title="'<h5>Reflete as ocorrências vigentes da entidade</h5>'"
                    v-tippy="{inertia:true,arrow:true,animation:'perspective',distance:'1',size:'large',arrow:true}">OC 1</th>
                  <th :title="'<h5>Ocorrências registradas para projetos em execução</h5>'"
                    v-tippy="{inertia:true,arrow:true,animation:'perspective',distance:'1',size:'large',arrow:true}">OC 2</th>
                  <th :title="'<h5>Ocorrências registradas para projetos encerrado</h5>'"
                    v-tippy="{inertia:true,arrow:true,animation:'perspective',distance:'1',size:'large',arrow:true}">OC 3</th>
                </tr>
              </thead>
              <tr class="dado">
                <td>{{rating.ratingCalculado.CD}}</td>
                <td>{{rating.ratingCalculado.RFP}}</td>
                <td>{{rating.ratingCalculado.IS}}</td>
                <td>{{rating.ratingCalculado.PD}}</td>
                <td>{{rating.ratingCalculado.HIS1}}</td>
                <td>{{rating.ratingCalculado.HIS2}}</td>
                <td>{{rating.ratingCalculado.OC1}}</td>
                <td>{{rating.ratingCalculado.OC2}}</td>
                <td>{{rating.ratingCalculado.OC3}}</td>
              </tr>
              <tr>
                <td colspan="9">{{rating.ratingCalculado.formula}} = <span class="dado">{{rating.ratingCalculado.total}}</span></td>
              </tr>
            </table>
          </div>

          <div class="col-md-2 ratingCalculos">
            Rating Entidade <br/>
            <span class="dado ratingNota">{{rating.classificacao.nota}}</span>
          </div>

        </div>
      </div>

      <div class="row">
        <div class="col-md-10">
          <div>
            <g-button-ujarak color="success" @click.native="salvar" type="button"><i class="fa fa-check-circle-o" aria-hidden="true"></i> OK</g-button-ujarak>
            <g-button-ujarak color="warning" @click.native="cancelar" type="button"><i class="fa fa-times-circle" aria-hidden="true"></i> Cancelar</g-button-ujarak>
          </div>
        </div>
      </div>

    </div>

  </div>
</template>

<script>
  import Dirigentes from './dirigentes'
  import moment from 'moment'
  export default {
    name: 'rating-entidade',
    components: {
      Dirigentes
    },
    data () {
      return {
        idEntidade: 0,
        calculando: true,
        dadosGerais: {},
        rating: {
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
            OC1: 0,
            OC2: 0,
            OC3: 0,
            formula: 'R = (3,5 * CD) + (3,5 * RFP) + (IS) + (1,5 * PD) + (2,5 * HIS 1) + (2,5 * HIS 2) + (3,5 * OC 2) + (2,0 * OC 3)',
            total: 0
          },
          consultas: {
            serasa: {},
            certidoes: {
              Cepim: null,
              CND: null,
              CRF: null,
              CNDT: null
            },
            scpc: {},
            cadin: {
              entidade: null,
              dirigentes: null,
              coobrigacao: null
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
        edicaoCalculo: false,
        analise: {},
        classificacaoRating: [{'nota': 'A', 'de': 90, 'para': 100}, {'nota': 'B', 'de': 70.1, 'para': 89.9}, {'nota': 'C', 'de': 55.1, 'para': 70}, {'nota': 'D', 'de': 40.1, 'para': 55}, {'nota': 'E', 'de': 0, 'para': 40}]
      }
    },
    props: ['propsAnalise'],
    watch: {
      propsAnalise () {
        this.analise = this.propsAnalise
        this.idEntidade = this.propsAnalise.entidade.id
      }
    },
    computed: {
      cadinDirigente () {
        let dirigentesCadin = _.filter(this.dadosGerais.entidade.dirigentes, function (o) {
          return _.has(o, 'cadin') && o.cadin !== 0
        })
        this.rating.consultas.cadin.dirigentes = (dirigentesCadin.length > 0) ? '9999-12-31' : 0
        this.totalSCPSSerasa()
      },
      totalSerasaDirigentes () {
        let dirigentesSerasa = _.sumBy(this.dadosGerais.entidade.dirigentes, 'serasa')
        this.rating.consultas.serasa.dirigentes = dirigentesSerasa
        this.totalSCPSSerasa()
      },
      totalSCPCDirigentes () {
        let dirigentesSCPC = _.sumBy(this.dadosGerais.entidade.dirigentes, 'scpc')
        this.rating.consultas.scpc.dirigentes = dirigentesSCPC
        this.totalSCPSSerasa()
      }
    },
    mounted () {
    },
    created () {
      this.calculando = true
      this.consultaEntidade()
      this.atualizarTodasOcorrencias()
    },
    methods: {
      totalSCPSSerasa () {
        this.rating.consultas.totalGeral = (this.rating.consultas.serasa.entidade + this.rating.consultas.serasa.dirigentes + this.rating.consultas.serasa.coobrigacao + this.rating.consultas.scpc.entidade + this.rating.consultas.scpc.dirigentes + this.rating.consultas.scpc.coobrigacao)
        this.calcularRating()
      },
      carregaRating () {
        axiosLaravel.post('rating/', this.idProjeto).then((response) => {
          console.log('carregaRating', response.data)
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
        this.calcularRating()
      },
      //
      //
      consultaEntidade () {
        axiosLaravel.post('consulta/geral/entidade/', {'id_entidade': this.idEntidade, 'dias': 1095}).then((response) => {
          console.log('consultaEntidade', response.data)
          this.dadosGerais = response.data
          this.dadosGerais.entidade['anosAbertura'] = moment().diff(moment(this.dadosGerais.entidade.dt_data_expedicao_cnpj), 'years', true)
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
        this.rating.ratingCalculado.OC1 = this.regua7()
        this.rating.ratingCalculado.OC2 = this.regua8()
        this.rating.ratingCalculado.OC3 = this.regua9()
        //
        this.rating.ratingCalculado.total = (3.5 * this.rating.ratingCalculado.CD) + (3.5 * this.rating.ratingCalculado.RFP) + (this.rating.ratingCalculado.IS) + (1.5 * this.rating.ratingCalculado.PD) + (3.5 * this.rating.ratingCalculado.HIS1) + (1.5 * this.rating.ratingCalculado.HIS2) + (2.5 * this.rating.ratingCalculado.OC1) + (2 * this.rating.ratingCalculado.OC2) + (this.rating.ratingCalculado.OC3)
        //
        this.rating.classificacao = _.find(this.classificacaoRating, function (o) { return o.de <= vm.rating.ratingCalculado.total && vm.rating.ratingCalculado.total <= o.para })
        //
        this.calculando = false
        this.$forceUpdate()
        console.log('rating re-calculado:', this.rating)
      },
      vigente (data) {
        return (data === 0 || moment(data).diff(moment(), 'days', true) > 0)
      },
      regua1 () {
        // TODO avaliar quando null
        // if (!_.isNull(this.rating.consultas.certidoes.Cepim)) {
        //   return false
        // }
        if (this.rating.consultas.certidoes.Cepim !== 0) {
          return 0
        } else {
          let totalSerasaSCPC = _.sumBy(_.map(this.rating.consultas.serasa)) + _.sumBy(_.map(this.rating.consultas.scpc))
          let totalSerasaSCPCDirigentes = this.rating.consultas.serasa.dirigentes + this.rating.consultas.serasa.coobrigacao + this.rating.consultas.scpc.dirigentes + this.rating.consultas.scpc.coobrigacao
          if (totalSerasaSCPCDirigentes > 0 && totalSerasaSCPCDirigentes === totalSerasaSCPC) {
            return 2
          }
          let regua = [{'nota': 5, 'valor': 0}, {'nota': 4, 'valor': 500}, {'nota': 3, 'valor': 1000}, {'nota': 1, 'valor': 999999999}]
          return (_.find(regua, function (o) { return totalSerasaSCPC <= o.valor }))['nota']
        }
      },
      regua2 () {
        if (!this.vigente(this.rating.consultas.cadin.entidade) || !this.vigente(this.rating.consultas.cadin.dirigentes) || !this.vigente(this.rating.consultas.cadin.coobrigacao) || !this.vigente(this.rating.consultas.certidoes.CND)) {
          return 0
        }
        if (this.vigente(this.rating.consultas.cadin.entidade) && !this.vigente(this.rating.consultas.cadin.dirigentes) || !this.vigente(this.rating.consultas.cadin.coobrigacao) && this.vigente(this.rating.consultas.certidoes.CND) && (!this.vigente(this.rating.consultas.certidoes.CRF) || !this.vigente(this.rating.consultas.certidoes.CNDT))) {
          return 1
        }
        if (this.vigente(this.rating.consultas.cadin.entidade) && this.vigente(this.rating.consultas.cadin.dirigentes) && this.vigente(this.rating.consultas.cadin.coobrigacao) && this.vigente(this.rating.consultas.certidoes.CND) && !this.vigente(this.rating.consultas.certidoes.CRF) && !this.vigente(this.rating.consultas.certidoes.CNDT)) {
          return 2
        }
        if (this.vigente(this.rating.consultas.cadin.entidade) && this.vigente(this.rating.consultas.cadin.dirigentes) && this.vigente(this.rating.consultas.cadin.coobrigacao) && this.vigente(this.rating.consultas.certidoes.CND) && (this.vigente(this.rating.consultas.certidoes.CRF) || this.vigente(this.rating.consultas.certidoes.CNDT))) {
          return 3
        }
        if (this.vigente(this.rating.consultas.cadin.entidade) && (!this.vigente(this.rating.consultas.cadin.dirigentes) || !this.vigente(this.rating.consultas.cadin.coobrigacao)) && this.vigente(this.rating.consultas.certidoes.CND) && this.vigente(this.rating.consultas.certidoes.CRF) && this.vigente(this.rating.consultas.certidoes.CNDT)) {
          return 4
        }
        if (this.vigente(this.rating.consultas.cadin.entidade) && this.vigente(this.rating.consultas.cadin.dirigentes) && this.vigente(this.rating.consultas.cadin.coobrigacao) && this.vigente(this.rating.consultas.certidoes.CND) && this.vigente(this.rating.consultas.certidoes.CRF) && this.vigente(this.rating.consultas.certidoes.CNDT)) {
          return 5
        }
        return 999
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
      regua7 () {
        return (this.rating.ocorrencias.entidade.tipo4 > 0 ? 0 : (this.rating.ocorrencias.entidade.tipo3 > 0 ? 1 : (this.rating.ocorrencias.entidade.tipo2 > 0 ? 3 : 5)))
      },
      regua8 () {
        this.rating.ocorrencias.projetosExecutando.qtde = (_.filter(this.dadosGerais.projetos, ['situacao', 'executando'])).length
        let projetos = _.map(this.dadosGerais.projetos, 'numero')
        let ocorrenciasTipos3 = _.map(this.rating.ocorrencias.projetosExecutando.tipo3, 'numprj')
        this.rating.ocorrencias.projetosExecutando.qtdeTipo3 = (_.intersection(projetos, ocorrenciasTipos3)).length
        this.rating.ocorrencias.projetosExecutando.percTipo3 = this.rating.ocorrencias.projetosExecutando.qtdeTipo3 / this.rating.ocorrencias.projetosExecutando.qtde
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
        this.rating.ocorrencias.projetosEncerrados.percTipo3 = this.rating.ocorrencias.projetosEncerrados.qtdeTipo3 / this.rating.ocorrencias.projetosEncerrados.qtde
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
      salvar () {
        alert('salvar...')
        this.cancelar()
      },
      cancelar () {
        this.edicaoCalculo = false
      }
    }
  }
</script>

<style scoped>
  #rating .data {
    width: 75%;
    float: left;
  }

  #rating .dado {
    color: steelblue;
    font-weight: bold;
    font-size: 20px;
  }

  #rating .nada_consta {
    width: 150px;
    float: left;
    margin-right: 5px;
    padding: 5px;
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
    font-size: 40px;
    font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
  }

  #rating .requerido:after {
    color: #dd4b39;
    content: "*";
  }
</style>
