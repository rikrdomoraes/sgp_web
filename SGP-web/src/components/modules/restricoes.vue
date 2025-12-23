<template>
  <div class="box box-widget">
    <div class="box-header with-border">
      <h3 class="box-title">Restrições</h3>
    </div>

    <div class="box-body">
      <div class="box-body">
        <div class="row">

          <!-- Serasa -->
          <div class="col-md-2">
            <div class="form-group required-field col-md-12" :class="{ 'has-error' : errors.first('serasa')}">
              <label for="serasa" class="control-label">Serasa/SPC</label>
              <div style="height:34px">
                <label class="radio-inline new-control new-control-radio">
                  <input type="radio" name="serasa" id="serasa" :value="1" v-model="preAnalise.bt_serasa"
                         v-validate="'required'" /> Sim
                  <div class="new-control-indicator"></div>
                </label>
                <label class="radio-inline new-control new-control-radio">
                  <input type="radio" name="serasa" :value="0" v-model="preAnalise.bt_serasa"
                         v-validate="'required'" /> Não
                  <div class="new-control-indicator"></div>
                </label>
              </div>
              <span v-if="errors.first('serasa')" class="label label-danger"> {{ errors.first('serasa') }}</span>
            </div>
            <div class="form-group col-md-12" v-if="preAnalise.bt_serasa === 1" :class="{ 'has-error' : errors.first('valor monetário')}">
              <label for="valor monetário" class="control-label">Valor monetário</label>
              <money v-model="preAnalise.ds_valor_monetario" id="valor monetário" name="valor monetário" class="form-control" type="text" placeholder="Valor Monetário" maxlength="255"></money>
              <span v-if="errors.first('valor monetário')" class="label label-danger"> {{ errors.first('valor monetário') }}</span>
            </div>
            <div class="form-group col-md-12">
              <label for="serasa" class="control-label">Observações</label>
              <textarea v-model="preAnalise.ds_serasa" style="height:100px;resize:none;" name="serasa" class="form-control"
                        ></textarea>
            </div>
          </div>

          <!-- Cadin -->
          <div class="col-md-2">
            <div class="form-group required-field col-md-12" :class="{ 'has-error' : errors.first('cadin')}">
              <label for="cadin" class="control-label">Cadin</label>
              <div style="height:34px">
                <label class="radio-inline new-control new-control-radio">
                  <input type="radio" name="cadin" id="cadin" :value="1" v-model="preAnalise.bt_cadin"
                         v-validate="'required'" /> Sim
                  <div class="new-control-indicator"></div>
                </label>
                <label class="radio-inline new-control new-control-radio">
                  <input type="radio" name="cadin" :value="0" v-model="preAnalise.bt_cadin"
                         v-validate="'required'" /> Não
                  <div class="new-control-indicator"></div>
                </label>
              </div>
              <span v-if="errors.first('cadin')" class="label label-danger"> {{ errors.first('cadin') }}</span>
            </div>
            <div class="form-group col-md-12" >
              <label for="observação cadin" class="control-label">Observações</label>
              <textarea v-model="preAnalise.ds_cadin" style="height:100px; resize:none;" name="observação cadin" class="form-control"
                        ></textarea>
            </div>
          </div>

          <!-- Cepim -->
          <div class="col-md-2">
            <div class="form-group required-field col-md-12" :class="{ 'has-error' : errors.first('cepim')}">
              <label for="cepim" class="control-label">Cepim</label>
              <div style="height:34px">
                <label class="radio-inline new-control new-control-radio">
                  <input type="radio" name="cepim" id="cepim" :value="1" v-model="preAnalise.bt_cepim"
                         v-validate="'required'" /> Sim
                  <div class="new-control-indicator"></div>
                </label>
                <label class="radio-inline new-control new-control-radio">
                  <input type="radio" name="cepim" :value="0" v-model="preAnalise.bt_cepim"
                         v-validate="'required'" /> Não
                  <div class="new-control-indicator"></div>
                </label>
              </div>
              <span v-if="errors.first('cepim')" class="label label-danger"> {{ errors.first('cepim') }}</span>
            </div>
            <div class="form-group col-md-12" >
              <label for="observação cepim" class="control-label">Observações</label>
              <textarea v-model="preAnalise.ds_cepim" id="observação cepim" style="height:100px; resize:none;" name="observação cepim" class="form-control"
                        ></textarea>
            </div>
          </div>

          <!-- CND ou CPD-EM -->
          <div class="col-md-2">
            <div class="form-group required-field col-md-12" :class="{ 'has-error' : errors.first('CND')}">
              <label for="CND" class="control-label">CND ou CPD-EM</label>
              <div style="height:34px">
                <label class="radio-inline new-control new-control-radio">
                  <input type="radio" name="CND" id="CND" :value="1" v-model="preAnalise.bt_cnd"
                         v-validate="'required'" /> Sim
                  <div class="new-control-indicator"></div>
                </label>
                <label class="radio-inline new-control new-control-radio">
                  <input type="radio" name="CND" :value="0" v-model="preAnalise.bt_cnd"
                         v-validate="'required'" /> Não
                  <div class="new-control-indicator"></div>
                </label>
              </div>
              <span v-if="errors.first('CND')" class="label label-danger"> {{ errors.first('CND') }}</span>
            </div>
            <div class="form-group col-md-12" >
              <label for="observação CND" class="control-label">Observações</label>
              <textarea v-model="preAnalise.ds_cnd" id="observação CND" style="height:100px; resize:none;" name="observação CND" class="form-control"
                        ></textarea>
            </div>
          </div>

          <!-- CNDT -->
          <div class="col-md-2">
            <div class="form-group required-field col-md-12" :class="{ 'has-error' : errors.first('CNDT')}">
              <label for="CNDT" class="control-label">CNDT</label>
              <div style="height:34px">
                <label class="radio-inline new-control new-control-radio">
                  <input type="radio" name="CNDT" id="CNDT" :value="1" v-model="preAnalise.bt_cndt"
                         v-validate="'required'" /> Sim
                  <div class="new-control-indicator"></div>
                </label>
                <label class="radio-inline new-control new-control-radio">
                  <input type="radio" name="CNDT" :value="0" v-model="preAnalise.bt_cndt"
                         v-validate="'required'" /> Não
                  <div class="new-control-indicator"></div>
                </label>
              </div>
              <span v-if="errors.first('CNDT')" class="label label-danger"> {{ errors.first('CNDT') }}</span>
            </div>
            <div class="form-group col-md-12" >
              <label for="observação CNDT" class="control-label">Observações</label>
              <textarea v-model="preAnalise.ds_cndt" style="height:100px; resize:none;" name="observação CNDT" id="observação CNDT" class="form-control"
                        ></textarea>
            </div>
          </div>

          <!-- CRF -->
          <div class="col-md-2">
            <div class="form-group required-field col-md-12" :class="{ 'has-error' : errors.first('crf')}">
              <label for="crf" class="control-label">CRF</label>
              <div style="height:34px">
                <label class="radio-inline new-control new-control-radio">
                  <input type="radio" name="crf" id="crf" :value="1" v-model="preAnalise.bt_crf"
                         v-validate="'required'" /> Sim
                  <div class="new-control-indicator"></div>
                </label>
                <label class="radio-inline new-control new-control-radio">
                  <input type="radio" name="crf" :value="0" v-model="preAnalise.bt_crf"
                         v-validate="'required'" /> Não
                  <div class="new-control-indicator"></div>
                </label>
              </div>
              <span v-if="errors.first('crf')" class="label label-danger"> {{ errors.first('crf') }}</span>
            </div>
            <div class="form-group col-md-12" >
              <label for="observação crf" class="control-label">Observações</label>
              <textarea v-model="preAnalise.ds_crf" id="observação crf" style="height:100px; resize:none;" name="observação crf" class="form-control"
                        ></textarea>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
    export default {
      name: 'restricoes',
      data () {
        return {
          preAnalise: {
            proposal: {}
          }
        }
      },
      inject: ['$validator'],
      provide () {
        return {
          $validator: this.$validator
        }
      },
      props: ['propsPreAnalise'],
      watch: {
        propsPreAnalise () {
          this.preAnalise = this.propsPreAnalise
          this.$forceUpdate()
        }
      }
    }
</script>

<style scoped>

</style>
