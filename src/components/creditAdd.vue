<template>
<app-layout>
  <ol slot="crumb" class="breadcrumb">
     <router-link class="back"
      :to="{ name: 'credit' }"><< 返回</router-link>
    <li>
      <router-link :to="{ name: 'credit'}">自采融资管理</router-link>
    </li>
    <li>
      <router-link :to="{ name: 'credit'}">金融授信</router-link>
    </li>
    <li class="active">
      <span>新增</span>
    </li>
  </ol>
  <div >
    <div class="mod">
      <div class="mod-hd">
          <h3 class="mod-text-ms">基本信息</h3>
      </div>
      <div class="mod-bd form-horizontal">
        <div class="form-group m0">
          <div class="col-lg-6">
            <div class="form-group">
              <div class="col-lg-4 control-label">金融机构：</div>
              <div class="col-lg-8">
                <el-select v-model="form.FInstitutionsId" placeholder="请选择" :clearable="true" style="width:100%">
                <el-option
                v-for="(item, index) in Institutions"
                :key="index"                  
                :label="item.InstitutionName"
                :value="item.Id">
                </el-option>
              </el-select>
              </div>
            </div>
            <div class="form-group">
              <div class="col-lg-4 control-label">有效期至：</div>
              <div class="col-lg-8">
                 <el-date-picker style="width: 100%;" format="yyyy-MM-dd"
                      v-model="form.ExpirationDate "
                      type="date"
                      placeholder="选择日期">
                    </el-date-picker>
              </div>
            </div>
            <div class="form-group">
              <div class="col-lg-4 control-label">反馈时间：</div>
              <div class="col-lg-8">
                 <el-date-picker style="width: 100%;" format="yyyy-MM-dd"
                      v-model="form.FeedbackDate "
                      type="date"
                      placeholder="选择日期">
                    </el-date-picker>
              </div>
            </div>
            <div v-if="false" class="form-group">
              <div class="col-lg-4 control-label">授信总额：</div>
              <div class="col-lg-8">
              </div>
            </div>
          </div>
          <div class="col-lg-6">
            <div class="form-group">
              <div class="col-lg-4 control-label">申请时间：</div>
              <div class="col-lg-8">
                <el-date-picker style="width: 100%;" format="yyyy-MM-dd"
                v-model="form.ApplyTime "
                type="date"
                placeholder="选择日期">
              </el-date-picker>
              </div>
            </div>
            <div class="form-group">
              <div class="col-lg-4 control-label">授信额度：</div>
              <div class="col-lg-8">
                <div class="input-group">
                  <input v-model="form.CreditLine" class="form-control" type="number">
                  <div class="input-group-addon">元</div>
                </div>
              </div>
            </div>
            <div class="form-group">
              <div class="col-lg-4 control-label">敞口额度：</div>
              <div class="col-lg-8">
                <div class="input-group">
                  <input v-model="form.ExposureLimit" class="form-control" type="number">
                  <div class="input-group-addon">元</div>
                </div>
              </div>
            </div>
          </div>          
        </div>
      </div>
    </div>
    <div class="mod">
        <div class="mod-hd">
          <h3>拆分额度</h3>
        </div>
        <div class="mod-bd">
          <div class="table-responsive no-padding">
            <table class="table table-hover table-oversized">
              <tbody>
                <tr>
                  <th>拆分额度（元）</th>
                  <th>金融产品</th>
                  <th>操作</th>
                </tr>
                <tr v-for="(product, index) in form.SplitDetail">
                  <td>{{ product.Amount }}</td>
                  <td>{{ getNameByIds(product.FinancialProductsIds) }}</td>
                  <td>
                    <el-button type="text" @click="delRow(index)" size="mini">删除</el-button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="add-car-btn mb20">
            <a href="#" data-toggle="modal"  @click="open"><i class="fa fa-plus"></i>添加</a></div>
        </div>
        <div class="mod-fr border-top text-right">
          
          <button class="btn btn-primary" @click.prevent="save">保存</button>
        </div>
      </div>
      <el-dialog  title="拆分额度"  :visible.sync="dialog"  size="tiny">
      <el-form    label-width="80px">
        <el-form-item label="拆分额度">
          <el-input v-model="limitForm.Amount" type="number"></el-input>
        </el-form-item>
        <el-form-item label="金融产品" >
          <el-select multiple  
            style="width: 100%"
            v-model="limitForm.FinancialProductsIds">
            <el-option
              v-for="(node,i) in financeProducts"
              :key="i" 
              :label="node.Key"
              :value="node.Value">
              </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialog = false">取 消</el-button>
        <el-button type="primary" @click="saveToTempList">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</app-layout>
</template>

<script>
import {formatDate} from '../api/date.js' 
export default {
  data () {
    return {
      dialog:false,
      Institutions:[],
      financeProducts:[],
      form:{
        id:0,
        FInstitutionsId:'',
        ApplyTime:'',
        ExpirationDate:'',
        ExposureLimit:'',
        CreditLine:'',
        FeedbackDate:'',
        SplitDetail:[],
      },
      limitForm:{
        FinancialProductsIds:[],
        Amount:''
      }
    }
  },
  methods:{
    saveToTempList(){
      var vm=this;
      vm.dialog=false;
      vm.form.SplitDetail.push({
        FinancialProductsIds:vm.limitForm.FinancialProductsIds,
        Amount:vm.limitForm.Amount,
      });     
    },
    open(){
      var vm=this;
      vm.dialog=true;
      vm.limitForm={
        FinancialProductsIds:[],
        Amount:''
      }
    },
    delRow(i){
      var vm=this;
      vm.form.SplitDetail.splice(i, 1);
    },
    getInProjects(code){
      var vm=this;
      vm.$api.resource({
        context: vm,
        type: 'get',
        url: '/FinancialProducts/GetFProducts',
        data: {
          iId: code
        },
        callback: function (data) {         
          if (!data.Success) {
            vm.$message({
              message: data.ErrorMessage,
              type: 'error'
            })
          }
           vm.financeProducts = data.Data;
        }
      })
    },
    getInstitutions () {
      var vm = this
      this.$api.resource({
        context: vm,
        type: 'post',
        url: '/Institutions/GetInstitutions',
        callback: function (data) {
          vm.Institutions = data.Data
        }
      })
    },
    getNameByIds(ids){
      var vm=this;
      var name='';
      for(var i=0;i<ids.length;i++){
        for(var j=0;j<vm.financeProducts.length;j++){
          var node=vm.financeProducts[j];
          if(ids[i]==node.Value){
            name=node.Key+","+ name;
            break;
          }
        }
      }
      return name.substring(0,name.length-1);
    },
    save(){
      var vm=this;
      // var list=[];
      // for(var i=0;i<vm.form.SplitDetail.length;i++){
      //   var node=vm.form.SplitDetail[i];
      //   if(node.selected){
      //     list.push(node);
      //   }
      // }      
      // vm.form.SplitDetail=list;
      
      vm.form.ExpirationDate=formatDate(vm.form.ExpirationDate,"yyyy-MM-dd");
      vm.form.ApplyTime=formatDate(vm.form.ApplyTime,"yyyy-MM-dd");
      vm.form.FeedbackDate=formatDate(vm.form.ApplyTime,"yyyy-MM-dd");
      
      vm.$api.resource({
      context: vm,
      type: 'Post',
      url: '/FinancialCredit/AddOrUpdateSelfCredit',
      data:vm.form,
      callback: function (mdata) {
        if (!mdata.Success && mdata.ErrorMessage) {
          vm.$message({
            message: mdata.ErrorMessage,
            type: 'warning'
          });
          return false;
        }
        else
          window.location.href=window.location.href.split("#")[0]+"#/finance/credit";    
      } 
  });
    }
  },
  mounted () {
    var vm=this;
    vm.getInstitutions();
  },
  computed:{
    FInstitutionsId(){
     return this.form.FInstitutionsId;
    }
  },
  watch:{
    FInstitutionsId(newData,oldData){
      if(!newData||newData==oldData)
        return false;
      var vm = this;
      vm.getInProjects(newData);

    }
  }
}
</script>

<style scoped>

</style>



// WEBPACK FOOTER //
// src/components/creditAdd.vue?0e5fcb9c