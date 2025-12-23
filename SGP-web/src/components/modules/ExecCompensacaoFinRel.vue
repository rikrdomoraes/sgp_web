<template>
  <div class="row">
    <div class="col-sm-12" ng-form="finComExeRepForm">

      <div class="box-body" >

        <!--Collpase-->
        <!--Lista de Propostas-->
        <div class="col-sm-16">
          <b-container fluid>
            <!-- Main table element -->
            <b-table show-empty
                     stacked="md"
                     striped
                     :bordered="tableRelatorios.bordered"
                     :items="tableRelatorios.items"
                     :fields="fieldsRelatorios"
                     :current-page="tableRelatorios.currentPage"
                     :per-page="tableRelatorios.perPage"
                     :filter="tableRelatorios.filter"
                     :sort-by.sync="tableRelatorios.sortBy"
                     :sort-desc.sync="tableRelatorios.sortDesc"
            >
              <template slot="actions" scope="row">
                <b-button @click="$router.push({name: 'edita-relatorio-execucao', params: { id: row }})" type="button" uib-tooltip="Relatório de execução" id="relExec"  class="btn btn-sm btn-flat btn-primary ng-scope">
                  <i class="fa fa-search" aria-hidden="true"></i>
                </b-button>
              </template>
            </b-table>

          </b-container>
          <div v-show="loadingShow" class="overlay" style="position: absolute; top: 0px; left: 0px; width: 100%; height: 100%; display: block;">
            <i class="fa fa-refresh fa-spin"></i>
          </div>
        </div>
      </div>

      <div class="form-group required">

        <label for="phAchProject" class="col control-label">a) A contrapartida está sendo comprovada de acordo com o previsto no Plano de Trabalho?</label>
          <div class="col form-group required" ng-class="{ 'has-error' : finComExeRepCrtl.submitted && finComExeRepForm.enumContApr.$error.required }">
            <label class="new-control new-control-radio" style="padding-top: 8px;">
              <input ng-disabled="finComExeRepCrtl.isApproval || finComExeRepCrtl.approvalState == 'VIEW_TYPE' || finComExeRepCrtl.approval.status == 'REJECTED' || finComExeRepCrtl.approval.status == 'APPROVED'"
                     type="radio"
                     name="enumContApr"
                     value="YES"
                     ng-change="finComExeRepCrtl.onChangeContApr()"
                     ng-model="finComExeRepCrtl.report.enumContApr" required/> Sim
              <div class="new-control-indicator"></div>
            </label>
            <label class="new-control new-control-radio" style="padding-top: 8px;">
              <input ng-disabled="finComExeRepCrtl.isApproval || finComExeRepCrtl.approvalState == 'VIEW_TYPE' || finComExeRepCrtl.approval.status == 'REJECTED' || finComExeRepCrtl.approval.status == 'APPROVED'"
                     type="radio"
                     name="enumContApr"
                     value="NO"
                     ng-change="finComExeRepCrtl.onChangeContApr()"
                     ng-model="finComExeRepCrtl.report.enumContApr" required/> Não
              <div class="new-control-indicator"></div>
            </label>
            <label class="new-control new-control-radio" style="padding-top: 8px;">
              <input ng-disabled="finComExeRepCrtl.isApproval || finComExeRepCrtl.approvalState == 'VIEW_TYPE' || finComExeRepCrtl.approval.status == 'REJECTED' || finComExeRepCrtl.approval.status == 'APPROVED'"
                     type="radio"
                     name="enumContApr"
                     value="PARCIAL"
                     ng-change="finComExeRepCrtl.onChangeContApr()"
                     ng-model="finComExeRepCrtl.report.enumContApr" required/> Parcialmente
              <div class="new-control-indicator"></div>
            </label>
            <ng-messages ng-if="finComExeRepCrtl.submitted" for="finComExeRepForm.enumContApr.$error" role="alert">
              <ng-message when="required"  class="label label-danger">Campo requerido</ng-message>
            </ng-messages>

            <div ng-show="finComExeRepCrtl.report.enumContApr != 'YES'">
              <div class="col form-group required" ng-class="{ 'has-error' : finComExeRepCrtl.submitted && finComExeRepForm.dsContApr.$error.required }">
                <label style="margin-top: 0px; margin-bottom: 0px;font-size: 12px;" class="control-label" uib-tooltip="{{finComExeRepCrtl.tooltip('Justifique')}}">Justifique</label>
                <textarea ng-disabled="finComExeRepCrtl.isApproval || finComExeRepCrtl.approvalState == 'VIEW_TYPE' || finComExeRepCrtl.approval.status == 'REJECTED' || finComExeRepCrtl.approval.status == 'APPROVED'" ng-model="finComExeRepCrtl.report.dsContApr" ng-blur="finComExeRepCrtl.onChangeContApr()" style="height:150px; resize:none;"
                          name="dsContApr" class="form-control" ng-required="finComExeRepCrtl.report.enumContApr != 'YES'"></textarea>
                <ng-messages ng-if="exeRepForm.$submitted" for="finComExeRepForm.dsContApr.$error" role="alert">
                  <ng-message when="required"  class="label label-danger">Campo requerido</ng-message>
                </ng-messages>
              </div>
            </div>
          </div>
        <br />

        <label for="phReceiptsProject" class="col control-label" uib-tooltip="{{finComExeRepCrtl.tooltip('b) Os comprovantes disponíveis foram enviados à FBB?')}}">b) Os comprovantes disponíveis foram enviados à FBB?</label>
        <div class="col form-group required" ng-class="{ 'has-error' : finComExeRepCrtl.submitted && finComExeRepForm.contCompr.$error.required }">
          <ssm-approval-validation name="contCompr" approval="finComExeRepCrtl.approval" state="finComExeRepCrtl.approvalState">
            <label class="new-control new-control-radio" style="padding-top: 8px;">
              <input ng-disabled="finComExeRepCrtl.isApproval || finComExeRepCrtl.approvalState == 'VIEW_TYPE' || finComExeRepCrtl.approval.status == 'REJECTED' || finComExeRepCrtl.approval.status == 'APPROVED'" type="radio" name="contCompr" ng-value="true"
                     ng-selected="finComExeRepCrtl.report.contCompr=='true'"
                     ng-change="finComExeRepCrtl.onChangeContApr(finComExeRepForm.contCompr)" ng-model="finComExeRepCrtl.report.contCompr" required/> Sim
              <div class="new-control-indicator"></div>
            </label>
            <label class="new-control new-control-radio" style="padding-top: 8px;">
              <input ng-disabled="finComExeRepCrtl.isApproval || finComExeRepCrtl.approvalState == 'VIEW_TYPE' || finComExeRepCrtl.approval.status == 'REJECTED' || finComExeRepCrtl.approval.status == 'APPROVED'" type="radio" name="contCompr" ng-value="false"
                     ng-selected="finComExeRepCrtl.report.contCompr=='false'"
                     ng-change="finComExeRepCrtl.onChangeContApr(finComExeRepForm.contCompr)" ng-model="finComExeRepCrtl.report.contCompr" required/> Não
              <div class="new-control-indicator"></div>
            </label>
          </ssm-approval-validation>
          <ng-messages ng-if="finComExeRepCrtl.submitted" for="finComExeRepForm.contCompr.$error" role="alert">
            <ng-message when="required"  class="label label-danger">Campo requerido</ng-message>
          </ng-messages>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
    export default {
        name: "ExecCompensacaoFinRel"
    }
</script>

<style scoped>

</style>
