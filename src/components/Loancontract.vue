<template>
<app-layout>
  <ol slot="crumb" class="breadcrumb">
    <router-link class="back"
      :to="{ path: '/loan/detail/'+form.LoanCode}"><< 返回</router-link>
    <li>
    <li>
      <router-link :to="{ name: 'index'}">自采融资管理</router-link>
    </li>
    <li>
      <router-link :to="{ name: 'index'}">金融贷款</router-link>
    </li>    
    <li>
      <router-link :to="{ path: '/loan/detail/'+form.LoanCode}">详情</router-link>
    </li>
    <li class="active">
      <span>添加合同</span>
    </li>
  </ol>
  <div class="">
    <div class="mod">
      <div class="mod-hd">
        <h3>基本信息</h3>
      </div>
      <div class="mod-bd form-horizontal">
        <div class="form-group m0">
          <div class="col-lg-6">
            <div class="form-group">
              <div class="col-lg-4 control-label">金融机构合同编号：</div>
              <div class="col-lg-8">
                <input v-model="form.FinCode" class="form-control" type="text">
              </div>
            </div>
            <div class="form-group">
              <div class="col-lg-4 control-label">融资金额：</div>
              <div class="col-lg-8">
                <div class="input-group">
                  <input v-model="form.Total" disabled="disabled" class="form-control" type="text">
                  <div class="input-group-addon">元</div>
                </div>
              </div>
            </div>
            <div class="form-group">
              <div class="col-lg-4 control-label">签约时间：</div>
              <div class="col-lg-8">
                <el-date-picker style="width: 100%;" format="yyyy-MM-dd"
                  v-model="form.SignTime"
                  type="date"
                  placeholder="选择日期">
                </el-date-picker>
              </div>
            </div>
            <div class="form-group">
              <div class="col-lg-4 control-label">还款日期：</div>
              <div class="col-lg-8">
                <el-date-picker style="width: 100%;" format="yyyy-MM-dd"
                  v-model="form.RepaymentDate"
                  type="date"
                  placeholder="选择日期">
                </el-date-picker>
              </div>
            </div>
            <div class="form-group">
              <div class="col-lg-4 control-label">最晚还款日期：</div>
              <div class="col-lg-8">
                <el-date-picker style="width: 100%;" format="yyyy-MM-dd"
                  v-model="form.LatestRepaymentDate"
                  type="date"
                  placeholder="选择日期">
                </el-date-picker>
              </div>
            </div>
            <div class="form-group">
              <div class="col-lg-4 control-label">约定还息日：</div>
              <div class="col-lg-8">
                <input   v-model="form.PaidInterestDate" class="form-control" type="text">
              </div>
            </div>
          </div>
          <div class="col-lg-6">
            <div class="form-group">
              <div class="col-lg-4 control-label">合同类型：</div>
              <div class="col-lg-8"> 
                <el-select v-model="form.Type" placeholder="请选择" :clearable="true" style="width:100%">
                  <el-option
                  v-for="(item, index) in ContractType"
                  :key="index"                  
                  :label="item.Key"
                  :value="item.Value">
                  </el-option>
                </el-select>  
              </div>
            </div>
            <div class="form-group">
              <div  class="col-lg-4 control-label">保证金：</div>
              <div class="col-lg-8">
                <div class="input-group">
                  <input v-model="form.Deposit" class="form-control" type="text">
                  <div class="input-group-addon">元</div>
                </div>
              </div>
            </div>
            <div class="form-group">
              <div class="col-lg-4 control-label">放款时间：</div>
              <div class="col-lg-8">
                <el-date-picker style="width: 100%;" format="yyyy-MM-dd"
                  v-model="form.LendingTime"
                  type="date"
                  placeholder="选择日期">
                </el-date-picker>
              </div>
            </div>
            <div class="form-group">
              <div class="col-lg-4 control-label">利率（{{loan.LoanRateMethod+"/"+loan.LoanRateUnit}}）：</div>
              <div class="col-lg-8">
                <div class="input-group">
                  <input v-model="form.Rate" class="form-control" type="text">
                  <div class="input-group-addon">%</div>
                </div>
              </div>
            </div>
            <div class="form-group">
              <div class="col-lg-4 control-label">展期利率（{{loan.LoanExtRateMethod+"/"+loan.LoanExtRateUnit}}）：</div>
              <div class="col-lg-8">
                <div class="input-group">
                  <input v-model="form.OverTimeRate" class="form-control" type="text">
                  <div class="input-group-addon">%</div>
                </div>
              </div>
            </div>
            <div class="form-group">
              <div class="col-lg-4 control-label">行圆合同编号：</div>
              <div class="col-lg-8">
                <input v-model="form.XYCode" class="form-control" type="text">
              </div>
            </div>
          </div>
        </div>
        <div class="table-responsive no-padding">
          <table class="table table-hover table-oversized">
            <tbody>
              <tr>
                <th>车辆信息</th>
                <th class="text-right">厂商指导价格（元/台）</th>
                <th class="text-right">车俩采购价格（元/台）</th>
                <th class="text-right">监管台数（台）</th>
                <th v-if="$route.query.cartype==2" class="text-right">二手车估值（元/台）</th>
                <th class="text-right">金融机构质押价格（元／台）</th>
              </tr>
              <tr v-for="node in carList">
                <td>{{node.CarFullName}}<span v-if="$route.query.cartype==2"> 上牌时间:{{node.UsedCarLicensingDate}} 行驶里程:{{node.UsedCarMileage+" "+node.UsedCarStatus}} </span></td>
                <td class="text-right"> <span class="mr5">{{node.ReferPrice|toThousands}}</span></td>
                <td class="text-right"> <span class="mr5">{{node.PurchasePrice|toThousands}}</span></td>
                <td class="text-right"><span class="mr5">{{node.RegulatedCount}}</span></td>
                <td v-if="$route.query.cartype==2" class="text-right"><span class="mr5">{{node.Assess|toThousands}}</span></td>
                <td class="text-right"> 
                  <input @change="sumPrice" v-model="node.PledgePrice" class="form-control form-control-mini pull-right text-right" type="text">
                </td>
              </tr>              
            </tbody>
          </table>
        </div>
      </div>
      <div class="mod-fr  text-right mt20">
        <button class="btn btn-default" v-if="false" data-dismiss="modal">取消</button>
        <button class="btn btn-primary" @click="save">保存</button>
      </div>
    </div>
  </div>
</app-layout>
</template>

<script>
import {formatDate} from '../api/date.js' 
import {toThousands} from '../api/toThousands.js' 
export default {
  data () {
    return {
      form:{
        FinCode :'',
        Type:1,
        Total:0,
        LoanCode:'',
        Deposit:'',
        IsDeductDepositFromBanlance:false,
        SignTime:'',
        LendingTime:'',
        RepaymentDate:'',
        Rate:'',
        RateTemp:'',
        LatestRepaymentDate:'',
        OverTimeRate:'',
        OverTimeRateTemp:'',
        PaidInterestDate:'',
        XYCode:'',
        CarSkus:[]
      },
      Institutions:[],
      ContractType:[],
      carList:[],
      loan:{

      }
    }
  },
  filters:{
      formatDate(time){
        if(!time)
          return "";
        let date = new Date(time);
        return formatDate(date,'yyyy-MM-dd');
          //此处formatDate是一个函数，将其封装在common/js/date.js里面，便于全局使用
      },
      toThousands(num){
          return toThousands(num);
      }
  }, 
  methods: {
    formatNum(row, column){
        return toThousands(row.Total);
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
    getLoanRange(){
      var vm = this
      this.$api.resource({
        context: vm,
        type: 'get',
        url: '/Loan/GetContractRequire',
        data:{
          LoanCode:vm.$route.params.code
        },
        callback: function (data) {
          vm.loan = data.Data;
          if(vm.loan.LoanExtRateUnit){
            vm.loan.LoanExtRateUnit="日息";
            vm.loan.LoanExtRateMethod="按日计息";
          }
        }
      })
    },
    getContractType(){
      var vm = this;
      this.$api.resource({
        context: vm,
        type: 'post',
        url: '/Loan/GetContractType',
        callback: function (data) {
          vm.ContractType = data.Data
        }
      });
    },
    getCar(){
      var vm = this;
      this.$api.resource({
        context: vm,
        type: 'get',
        url: '/Loan/GetCarSKU/'+vm.$route.params.code,
        callback: function (data) {
          vm.carList = data.Data
        }
      });
    },
    sumPrice(){
      var vm = this;
      var sum=0;
      for(var i=0;i<vm.carList.length;i++){
        var node=vm.carList[i];
        if(node.PledgePrice){
           sum=sum+node.PledgePrice*node.RegulatedCount;
        }
      }
      vm.form.Total=sum;
    },
    save(){
      var vm = this;
      if(!vm.form.Rate){
        vm.$message({
          message: "利率输入有误。",
          type: 'warning'
        });
        return false;
      }

      if(!vm.form.SignTime){
        vm.$message({
          message: "签约时间输入有误。",
          type: 'warning'
        });
        return false;
      }

      if(!vm.form.LendingTime){
        vm.$message({
          message: "放款时间输入有误。",
          type: 'warning'
        });
        return false;
      }

      if(!vm.form.RepaymentDate){
        vm.$message({
          message: "还款日期输入有误。",
          type: 'warning'
        });
        return false;
      }

      if(!vm.form.XYCode){
        vm.$message({
          message: "行圆合同编号输入有误。",
          type: 'warning'
        });
        return false;
      }

      if(!vm.form.XYCode){
        vm.$message({
          message: "行圆合同编号输入有误。",
          type: 'warning'
        });
        return false;
      }

      if(!vm.form.OverTimeRate){
        vm.$message({
          message: "展期利率输入有误。",
          type: 'warning'
        });
        return false;
      }

      if(!vm.form.LatestRepaymentDate){
        vm.$message({
          message: "最晚还款日期输入有误。",
          type: 'warning'
        });
        return false;
      }

      if(!vm.form.PaidInterestDate){
        vm.$message({
          message: "约定还息日输入有误。",
          type: 'warning'
        });
        return false;
      }

      vm.form.LoanCode=vm.$route.params.code;        

      if(!vm.form.Deposit){
        vm.form.Deposit=0;
      }
      // vm.form.Rate=vm.form.RateTemp;      
      // vm.form.OverTimeRate=vm.form.OverTimeRateTemp;
      
      vm.form.SignTime=formatDate(vm.form.SignTime,'yyyy-MM-dd');
      vm.form.LendingTime=formatDate(vm.form.LendingTime,'yyyy-MM-dd');
      vm.form.RepaymentDate=formatDate(vm.form.RepaymentDate,'yyyy-MM-dd');
      vm.form.LatestRepaymentDate=formatDate(vm.form.LatestRepaymentDate,'yyyy-MM-dd');

      vm.form.CarSkus=[];
      for(var i=0;i<vm.carList.length;i++){
        var node=vm.carList[i];
        if(!node.PledgePrice){
           vm.$message({
              message: data.ErrorMessage,
              type: 'warning'
            });
            return false;
        }
        vm.form.CarSkus.push({
          SkuCode:node.SKU,PledgePrice:node.PledgePrice});
      }
      this.$api.resource({
        context: vm,
        type: 'post',
        url: '/Loan/SaveContract',
        data:vm.form,
        callback: function (data) {
          if (!data.Success && data.ErrorMessage) {
            vm.$message({
            message: data.ErrorMessage,
            type: 'warning'
            })
            return false
          }
          vm.$router.push('/loan/detail/' + vm.$route.params.code)
        }        
      });
    }
  },
  mounted () {
    var vm=this;
    vm.getInstitutions();
    vm.getContractType();
    vm.getCar();
    vm.getLoanRange();
  },
  beforeMount () {
    this.form.LoanCode = this.$route.params.code;
  }
}
</script>

<style scoped>

</style>



// WEBPACK FOOTER //
// src/components/Loancontract.vue?79e461ae