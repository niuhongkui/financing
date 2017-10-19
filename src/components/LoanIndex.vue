<template>
<app-layout>
  <ol slot="crumb" class="breadcrumb">
    <li>
      <router-link :to="{ name: 'index'}">自采融资管理</router-link>
    </li>
    <li class="active">
      <span>金融贷款</span>
    </li>
  </ol>
<div>
    <div class="mod mod-search form-horizontal">
      <div class="mod-bd">
        <div class="row">
          <div class="col-lg-4">
            <div class="form-group">
              <label class="col-lg-4 control-label">贷款记录编号：</label>
              <div class="col-lg-8">
                <el-input v-model="form.Code"></el-input>
              </div>
            </div>
            <div class="form-group">
              <label class="col-lg-4 control-label">贷款状态：</label>
              <div class="col-lg-8">
                <el-select v-model="form.Status" placeholder="请选择" :clearable="true" style="width:100%">
                  <el-option
                  v-for="(item, index) in statusOptions"
                  :key="index"
                  :label="item.Key"
                  :value="item.Value">
                  </el-option>
                </el-select>
                </div>
            </div>
            <div class="form-group">
              <label class="col-lg-4 control-label">采购项目：</label>
              <div class="col-lg-8">
                <el-select v-model="form.ProjectCode" placeholder="请选择" :clearable="true" style="width:100%">
                  <el-option
                  v-for="(item, index) in projectOptions"
                  :key="index"
                  :label="item.Key"
                  :value="item.Value">
                  </el-option>
                </el-select>
                </div>
            </div>
          </div>
          <div class="col-lg-4">
            <div class="form-group">
              <label class="col-lg-4 control-label">金融机构编号：</label>
              <div class="col-lg-8">
                <el-input v-model="form.InsCode"></el-input>
              </div>
            </div>
            <div class="form-group">
              <label class="col-lg-4 control-label">金融产品：</label>
              <div class="col-lg-8">
                <el-input v-model="form.FinProduct"></el-input>
              </div>
            </div>
          </div>
          <div class="col-lg-4">
            <div class="form-group">
              <label class="col-lg-4 control-label">金融机构：</label>
              <div class="col-lg-8">
                <el-input v-model="form.InsName"></el-input>
              </div>
            </div>
            <div class="form-group">
              <label class="col-lg-4 control-label">申请时间：</label>
              <div class="col-lg-8">
               <el-date-picker
                  type="daterange"
                  placeholder="选择日期"
                  v-model="timeStr"
                  :clearable="true"
                  @change="changeDate"
                  style="width: 100%;">
                </el-date-picker>
              </div>
            </div>
            <div class="form-group">
              <div class="col-lg-12 text-right">
                <el-button type="primary" icon="search" class="btn-primary" @click="queryList">查询</el-button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="mod mod-search">
      <div class="mod-hd">
        <div  class="mod-operation">
          <router-link  to="/loan/add">
            <el-button type="primary" class="btn-primary" icon="add" >新增</el-button>
          </router-link>
        </div>
      </div>
    </div>
    <el-dialog title="贷款编辑" :visible.sync="editForm.isShow" size="big">
      <div class="form-horizontal">
        <table class="table table-hover table-oversized">
            <tbody>
              <tr>
                <th>车辆信息</th>
                <th class="text-right">厂商指导价格（元/台）</th>
                <th class="text-right">车俩采购价格（元/台）</th>
                <th v-if="editForm.carType==2" class="text-right">二手车估值（元/台）</th>
                <th class="text-right">监管数量（台）</th>
                <th class="text-right">总计（元）</th>
              </tr>
              <tr v-for="(node,$index) in editForm.CarList">
                <td>{{node.CarFullName}}<span v-if="editForm.carType==2"> 上牌时间:{{node.UsedCarLicensingDate}} 行驶里程:{{node.UsedCarMileage+" "+node.UsedCarStatus}} </span></td>
                <td class="text-right"> 
                  <div class="mr10">{{node.ReferPrice|toThousands}}</div>
                </td>
                <td class="text-right"> 
                  <div class="mr10">{{node.PurchasePrice|toThousands}}</div>
                </td>
                <td v-if="editForm.carType==2" class="text-right"> 
                  <div class="mr10">{{node.Assess}}</div>
                </td>
                <td class="text-right"> 
                  <input ref="txtCount" type="text"  style="width:98%;border:1px solid #ccc;" v-model="node.RegulatedCount"/>
                </td>
                <td class="text-right"> 
                  <div class="mr10">{{node.RegulatedCount*node.PurchasePrice|toThousands}}</div>
                </td>
              </tr>
            </tbody>
          </table>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editForm.isShow = false">取 消</el-button>
        <el-button type="primary" @click="updateForm">确 定</el-button>
      </span>
    </el-dialog>
    <div class="mod border-bottom pb20 mb20"  v-for="(node,$index) in tableData">
      <div class="mod-hd">
        <div class="mod-operation"><strong>贷款记录编号：{{node.Code}} |  金融机构编号：{{node.InsCode}}|  金融机构名称：{{node.InsName}}</strong>
          <div class="btn-group pull-right">            
            <div  v-if='node.Status==1'>
              <a href="#" v-if="node.ProjectOrderId" data-toggle="modal" @click="showEdit(node.Code,node.VehicleType)">编辑</a>
              <a href="#" data-toggle="modal" @click="firmLoan(node.Code)">确认</a>
              <a href="#" data-toggle="modal" @click="del(node.Code)">删除</a>
            </div>
            <div >
              <router-link :to="'/loan/detail/' + node.Code">查看详情</router-link>
            </div>
          </div>
        </div>
        <div class="mod-operation">贷款状态：<span class="label-status text-info mr5">{{node.StatusText}} </span>| 金融产品：{{node.FinProductName}}  |  质押车辆类型：{{node.VehicleTypeText}}  |  申请时间：{{node.ApplyTime|formatDate}}</div>
      </div>
      <div class="mod-bd">
        <table class="table table-bordered info-list-three">
          <tbody>
            <tr><td width="30%" v-if="node.ProjectOrderId"> <strong class="btn-block mb10">采购信息</strong>
              <dl class="dl-horizontal dl-extend">
                <dt style="width: 100px">项目名称：</dt>
                <dd :title="node.ProjectName" style="width: 200px;overflow: hidden;white-space: nowrap;text-overflow: ellipsis;margin-left:110px">{{node.ProjectName}}</dd>
                <dt>采购订单编号：</dt>
                <dd>{{node.ProjectOrderId}}</dd>
                <dt>项目编号：</dt>
                <dd>{{node.ProjectCode}}</dd>
              </dl>
            </td>
            <td width="30%"> <strong class="btn-block mb10">签约信息</strong>
              <dl class="dl-horizontal dl-extend">
                <dt>融资合同编号：</dt>
                <dd>{{node.Contracts[0].FinCode}}</dd>
                <dt>融资金额：</dt>
                <dd>{{node.Contracts[0].Total|toThousands}}元</dd>
                <dt>保证金：</dt>
                <dd>{{node.Contracts[0].Deposit|toThousands}}元</dd>
                <dt>放款时间：</dt>
                <dd>{{node.Contracts[0].LendingTime|formatDate}}</dd>
                <dt :title="node.Contracts[0].LoanRateCalcMethod">利率：</dt>
                <dd>{{node.Contracts[0].RateText}}<span v-if="node.Contracts[0].LoanRateCalcMethod">({{node.Contracts[0].LoanRateCalcMethod+"/"+node.Contracts[0].LoanRateCalcType}})</span></dd>
                <dt>还款时间：</dt>
                <dd>{{node.Contracts[0].RepaymentDate|formatDate}}</dd>
              </dl>
            </td>
            <td width="30%"> <strong class="btn-block mb10">还款信息</strong>
              <dl class="dl-horizontal dl-extend">
                <dt>未还利息金额：</dt>
                <dd>{{node.UnpaidInterest|toThousands}}元</dd>
                <dt>未还本金金额：</dt>
                <dd>{{node.UnpaidCapital|toThousands}}元</dd>
                <dt>已还利息金额：</dt>
                <dd>{{node.PaidInterest|toThousands}}元</dd>
                <dt>已还本金金额：</dt>
                <dd>{{node.PaidCapital|toThousands}}元</dd>
              </dl>
            </td>
          </tr></tbody>
        </table>
      </div>
    </div>   
    <div  class="mod ">
     <div class="mod-ft text-center">
        <el-pagination v-show="pagenum / 10 > 1"
          layout="prev, pager, next"
          @current-change="handleCurrentChange"
          :current-page="page"
          :total="pagenum">
        </el-pagination>
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
      form: {
        pageIndex: 1,
        pageSize: 10,
        OrderCode: '',
        OrderStatus: '',
        OrderTime: '',
        ProjectCode:'',
        Status:'',
        LoanType:1,
        DealerCode:''
      },
      tableData: [],
      statusOptions: {},
      projectOptions: {},
      pagenum: null,
      page: 1,
      isInfilter: false,
      timeStr: '',
      editForm:{
        isShow:false,
        Code:'',
        carType:'',
        CarList:[],
      } 
    }
  },
  methods: {
    updateForm(){
      var vm=this;
      var data=[];
      for(var i=0;i<vm.editForm.CarList.length;i++){
        var node=vm.editForm.CarList[i];
        if(node.RegulatedCount>node.CarCount){
          vm.$message({
            message: "监督数量不能大于订单数量",
            type: 'warning'
            });
            return false;
        }
        data.push({SKU:node.SKU,Number:node.RegulatedCount});
      }
      var editdata={Code:vm.editForm.Code,CarList:data};
      vm.$api.resource({
        context: vm,
        type: 'post',
        url: '/Loan/UpdateRegulatedCount',
        data:editdata,
        callback: function (data) {
          if (!data.Success && data.ErrorMessage) {
            vm.$message({ message: data.ErrorMessage, type: 'warning'});            
          }
          vm.editForm.isShow=false;
        }
      })
    },
    showEdit(code,type){
      var vm=this;
      vm.editForm.isShow=true;
      vm.editForm.Code=code;
      vm.editForm.carType=type;
      this.$api.resource({
        context: vm,
        type: 'get',
        url: '/Loan/GetCarSKU/'+code,
        callback: function (data) {
          vm.editForm.CarList = data.Data;
        }
      })
    },
    fetch (val, vm, mydata) {
      vm.$router.push('/loan/index?page=' + val)
      vm.page = val
      var cdata
      if (mydata) {
        cdata = _.extend({}, _.pick(vm.form, (val, key) => { return val !== '' }), {page: val})
      } else {
        cdata = { page: vm.page, pageSize: 10 ,LoanType:1,DealerCode:''}
      }
      if(cdata.OrderTime){
        var date=cdata.OrderTime.replace(" - ","@");
        cdata.ApplyTimeMin=date.split('@')[0];
        cdata.ApplyTimeMax=date.split('@')[1];
      }
      vm.$api.resource({
        context: vm,
        type: 'post',
        url: '/Loan/GetList',
        data: { ...cdata },
        callback: function (data) {
          vm.tableData = data.Data
          for(var i=0;i<vm.tableData.length;i++){          
            if(vm.tableData[i].Contracts.length==0){
              var arr=[{FinCode:'--',Total:0,Deposit:0,LendingTime:'',RepaymentDate:'',RateText:'0.00%'}];
              vm.tableData[i].Contracts=arr;
            }
          }          
          vm.pagenum = data.DataCount
        }
      })
    },
    getStatusOptions () {
      var vm = this
      this.$api.resource({
        context: vm,
        type: 'post',
        url: '/Loan/GetAllLoanStatus',
        callback: function (data) {
          vm.statusOptions = data.Data
        }
      })
    },
    getProjectOptions () {
      var vm = this
      this.$api.resource({
        context: vm,
        type: 'post',
        url: '/Loan/GetAllProject',
        callback: function (data) {
          vm.projectOptions = data.Data
        }
      })
    },
    queryList () {
      var vm = this
      if (_.reject(_.values(vm.form), function (num) { return num === '' }).length > 2) {
        vm.isInfilter = true
      } else {
        vm.isInfilter = false
      }
      this.fetch(1, vm, _.pick(vm.form, (val, key) => { return val !== '' }))
    },
    handleCurrentChange (val) {
      var vm = this
      if (this.isInfilter) {
        this.fetch(val, vm, _.pick(vm.form, (val, key) => { return val !== '' }))
        return false
      }
      this.fetch(val, this)
    },
    changeDate (val) {
      this.form.OrderTime = val
    },
    goDetail(code){
        this.$router.push('/loan/detail?code=' + code)
    },
    firmLoan(code){
      var vm=this;
      this.$confirm('是否确定此贷款申请, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
        }).then(() => {
          var msg=this;
          vm.$api.resource({
            context: vm,
            type: 'get',
            url: '/Loan/ConfirmLoan/'+code,
            callback: function (data) {
              if (!data.Success && data.ErrorMessage) {
                  vm.$message({
                  message: data.ErrorMessage,
                  type: 'warning'
                  })
                  return false
              }                    
              msg.$message({
                  type: 'success',
                  message: '成功确定!',
                  onClose:function(){
                    vm.fetch(vm.page, vm);
                  }
              });
            }
          });
        
        }).catch(() => {         
      });
    },
    del(obj){
      var vm=this;
      this.$confirm('是否删除此贷款申请, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
        }).then(() => {
          var msg=this;
          vm.$api.resource({
            context: vm,
            type: 'get',
            url: '/Loan/DeleteLoan/'+obj,
            callback: function (data) {
              if (!data.Success && data.ErrorMessage) {
                  vm.$message({
                  message: data.ErrorMessage,
                  type: 'warning'
                  })
                  return false
              }                    
              msg.$message({
                  type: 'success',
                  message: '成功确定!',
                  onClose:function(){
                    vm.fetch(vm.page, vm);
                  }
              });
              //vm.fetch(vm.page, vm)
              }
            });
          }).catch(() => {         
      });
    }
  },
  beforeRouteUpdate (to, from, next) {
    this.page = parseInt(to.query.page, 10)
    next()
  },
  mounted () {
    var vm = this
    $('body').trigger('click')
    this.getStatusOptions()
    this.getProjectOptions()
    if (this.$route.path === '/loan/index') {
      if (this.$route.query.page) {
        vm.page = parseInt(this.$route.query.page, 10)
      }
      this.fetch(vm.page, vm)
    }
  },
  filters:{
      formatDate(time){
          if(!time)
            return "--";
          let date = new Date(time);
          return formatDate(date,'yyyy-MM-dd');
          //此处formatDate是一个函数，将其封装在common/js/date.js里面，便于全局使用
      },
      toThousands(num){
        return toThousands(num);
      }
  }
}
</script>

<style scoped>
 .dl-horizontal dd{
       margin-left: 110px;
 }
 .dl-horizontal dt{
   width: 100px;
 }
</style>


// WEBPACK FOOTER //
// src/components/LoanIndex.vue?6fdfb09b