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
      <span>费用管理</span>
    </li>
  </ol>
  <div class="">
          <div class="mod">
            <div class="mod-hd">
              <h3>基本信息</h3>
            </div>
            <div class="mod-bd">
              <table class="table table-oversized">
                <tbody><tr>
                  <th width="20%">贷款记录编号：</th>
                  <td width="30%">{{basicData.LoanCode}}</td>
                  <th width="20%">金融机构编号：</th>
                  <td width="30%">{{basicData.InstitutionCode}} </td>
                </tr>
                <tr>
                  <th>金融机构：</th>
                  <td>{{basicData.InstitutionName}} </td>
                  <th>金融产品：</th>
                  <td>{{basicData.InstitutionProduct}} </td>
                </tr>
                <tr>
                  <th>金融业务类型：</th>
                  <td>{{basicData.ProductType}} </td>
                  <th>质押车辆类型：</th>
                  <td>{{basicData.CarType}} </td>
                </tr>
                <tr>
                  <th>采购订单编号：</th>
                  <td>{{basicData.OrderNo}} </td>
                  <th>采购项目：</th>
                  <td>{{basicData.Project}} </td>
                </tr>
                <tr>
                  <th>融资金额：</th>
                  <td>{{basicData.Amount|toThousands}} 元</td>
                  <th>保证金：</th>
                  <td>{{basicData.Deposit|toThousands}} 元</td>
                </tr>
                <tr>
                  <th>签约时间：</th>
                  <td>{{basicData.SignTime|formatDate}} </td>
                  <th>放款时间：</th>
                  <td>{{basicData.LendingTime|formatDate}} </td>
                </tr>
                <tr>
                  <th>还款日期：</th>
                  <td>{{basicData.RepaymentDate|formatDate}} </td>
                  <th>贷款利率（{{basicData.LoanRateCalcMethod+"/"+basicData.LoanRateCalcType}}）：</th>
                  <td>{{basicData.RateText}}</td>
                </tr>
                <tr>
                  <th>最晚还款日期：</th>
                  <td>{{basicData.LastRepaymentDate|formatDate}}</td>
                  <th>展期利率<span >（{{(basicData.ExtensionRateCalcMethod?basicData.ExtensionRateCalcMethod:"按日计息")+"/"+(basicData.ExtensionRateCalcType?basicData.ExtensionRateCalcType:"日息")}}）</span>：</th>
                  <td>{{basicData.OverTimeRateText}}</td>
                </tr>
                <tr>
                  <th>约定还息日：</th>
                  <td colspan="3">{{basicData.RepaymentInterestDate}} </td>
                </tr>
              </tbody></table>
              
            </div>
          </div>
          <div class="mod mb0">
            <div class="mod-hd">
              <h3>费用管理</h3>
            </div>
            <div class="mod-bd">
              <div class="mod-operation">放款：{{cost.Amount|toThousands}}元 | 保证金：{{cost.Deposit|toThousands}}元</div>
              <div class="mod-operation mb20">已还款合计（本金／利息）：
                  <span class="text-danger">{{cost.ReAmount|toThousands}}元 ／{{cost.ReInterest|toThousands}}元 </span>未还款合计（本金／利息）：
                  <span class="text-danger">{{cost.NotAmount|toThousands}}元 ／ {{cost.NotInterest|toThousands}}元  </span>
                  <el-button @click="openDialogInterest" type="text">利息记录</el-button>
                    <el-dialog title="利息记录" :visible.sync="dialogInterest">
                        <el-table :data="Interests">
                            <el-table-column property="InterestDate" :formatter="formatter" label="日期" ></el-table-column>
                            <el-table-column property="Total" align="right" :formatter="formatNum"  label="利息（元）"></el-table-column>
                        </el-table>
                        <div class="mod-ft text-center">
                            <el-pagination v-show="pageInterestSize/ 10 > 1"
                            layout="prev, pager, next"
                            @current-change="queryInterest"
                            :current-page.sync="pageInterest"
                            :total="pageInterestSize">
                            </el-pagination>
                        </div>
                    </el-dialog>
                  </div>
              <div class="mod-operation">
                <div class="pull-right">
                  <button class="btn btn-default" data-toggle="modal" @click="openCar">单车结清  </button>
                  <el-dialog title="单车结清" :visible.sync="oneCar">
                      <el-table :data="carList" @selection-change="handleSelectionChange">
                         <el-table-column  type="selection" property="Selected" > </el-table-column>
                          <el-table-column property="Vin" label="VIN码" ></el-table-column>
                          <el-table-column property="CarFullName"  label="车型"></el-table-column>
                          <el-table-column property="Color"  label="外观／内饰车型"></el-table-column>
                          <el-table-column :formatter="formatPrice" label="质押价格(元／台)"></el-table-column>
                      </el-table>
                      <div class="modal-footer">
                          <button class="btn btn-default" @click="oneCar=false" >取消</button>
                          <button class="btn btn-primary" @click="payCar">确定</button>
                        </div>
                  </el-dialog>
                  <button class="btn btn-default" data-toggle="modal" @click="openSettle">一次结清  </button>
                  <el-dialog title="一次结清" :visible.sync="oneSettle">
                      <div class="modal-body">
                        <div class="form-horizontal">
                          <div class="form-group">
                            <label class="col-sm-3 control-label">借款本金：</label>
                            <div class="col-sm-9 control-label text-left">{{cost.NotAmount|toThousands}}元</div>
                          </div>
                          <div class="form-group">
                            <label class="col-sm-3 control-label">未还利息：</label>
                            <div class="col-sm-5">
                              <el-date-picker style="width: 100%;" format="yyyy-MM-dd"
                              v-model="feeInt.date" @change="getIntFee"
                              type="date"
                              placeholder="选择日期">
                            </el-date-picker > 
                            </div>
                            <div class="col-sm-4 control-label text-left">日前，共计：<span class="text-danger">{{feeInt.cost|toThousands}}元</span></div>
                          </div> 
                          <div class="form-group">
                            <label class="col-sm-3 control-label">还款金额合计：</label>
                            <div class="col-sm-9 control-label text-left"> 
                              <div class="text-danger">{{cost.NotAmount-(-feeInt.cost)|toThousands}}元</div>
                            </div>
                          </div>
                          <div class="form-group">
                            <label class="col-sm-3 control-label">实际结算：</label>
                            <div class="col-sm-5">
                              <div class="input-group">
                                <input class="form-control" v-model="cost.InterestTotal" type="text" >
                                <div class="input-group-addon">元</div>
                              </div>
                            </div>
                            <div class="col-sm-4 control-label text-left"> </div>
                          </div>
                          <div class="form-group">
                            <label class="col-sm-3 control-label">发生时间：</label>
                            <div class="col-sm-5">
                              <div class="input-group">
                                <el-date-picker style="width: 100%;" format="yyyy-MM-dd"
                                  v-model="feeDate"
                                  type="date"
                                  placeholder="选择日期">
                                </el-date-picker>
                              </div>
                            </div>
                            <div class="col-sm-4 control-label text-left"></div>
                          </div>
                        </div>
                        <div class="modal-footer">
                          <button class="btn btn-default" @click="oneSettle=false">取消</button>
                          <button class="btn btn-primary" @click="PayOff">确定</button>
                        </div>
                      </div>
                  </el-dialog>
                  <button class="btn btn-default" data-toggle="modal" @click="openInterest">还息  </button>
                  <el-dialog title="还息" :visible.sync="interestPopup">
                    <div class="modal-body">
                      <div class="form-horizontal">
                        <div class="form-group">
                          <label class="col-sm-2 control-label">未还利息：</label>
                          <div class="col-sm-6">
                            <el-date-picker style="width: 100%;" format="yyyy-MM-dd"
                              v-model="feeInt.date" @change="getIntFee"
                              type="date"
                              placeholder="选择日期">
                            </el-date-picker >  
                          </div>
                          <div class="col-sm-4 control-label text-left">日前，共计：<span class="text-danger">{{feeInt.cost|toThousands}}元</span></div>
                        </div>
                        <div class="form-group">
                          <label class="col-sm-2 control-label">实际结算：</label>
                          <div class="col-sm-6">
                            <div class="input-group">
                              <input class="form-control" v-model="feeInterest" type="text" name="datepicker">
                              <div class="input-group-addon">元</div>
                            </div>
                          </div>
                          <div class="col-sm-4 control-label text-left"> </div>
                        </div>
                        <div class="form-group">
                          <label class="col-sm-2 control-label">发生时间：</label>
                          <div class="col-sm-6">                           
                            <el-date-picker style="width: 100%;" format="yyyy-MM-dd"
                              v-model="feeDate"
                              type="date"
                              placeholder="选择日期">
                            </el-date-picker >                            
                          </div>
                          <div class="col-sm-4 control-label text-left"></div>
                        </div>
                      </div>
                    </div>
                    <div class="modal-footer">
                      <button class="btn btn-default" @click="interestPopup=false">取消</button>
                      <button class="btn btn-primary" @click="RepayInterest">确定</button>
                    </div>
                  </el-dialog>
                </div>还款记录：
              </div>
              <div class="table-responsive no-padding">
                <table class="table table-hover table-oversized">
                  <tbody>
                    <tr>
                      <th>发生时间</th>
                      <th>利息范围</th>
                      <th>结算类型</th>
                      <th>应付金额</th>
                      <th>实付金额</th>
                      <th>关联车辆</th>
                      <th class="text-right">操作</th>
                    </tr>
                    <tr v-for="node in feeList ">
                      <td>{{node.ClosingDate|formatDate}}</td>
                      <td>{{node.RepayTime|formatDate}}以前</td>
                      <td>{{node.TypeText}}</td>
                      <td> {{node.ShouldPaid|toThousands}}</td>
                      <td> 
                        <div class="text-danger">{{node.Total|toThousands}}</div>
                      </td>
                      <td>{{node.CarCount}}台</td>
                      <td class="text-right"><a v-if="node.Type!=3" data-toggle="modal" href="#" @click="showCarDetail(node.Id)">查看详情</a></td>
                    </tr>                    
                  </tbody>
                </table>
                <el-dialog title="单车结清" :visible.sync="feeShow" size="large">
                  <el-table :data="feeDetail" >
                      <el-table-column property="Vin" label="VIN码" ></el-table-column>
                      <el-table-column property="CarFullName"  label="车型"></el-table-column>
                      <el-table-column property="Color"  label="外观／内饰车型"></el-table-column>
                      <el-table-column :formatter="formatPrice"  label="质押价格(元／台)"></el-table-column>
                      <el-table-column property="ImportType"  label="车源类型"></el-table-column>
                      <el-table-column property="CarStatus"  label="车辆状态"></el-table-column>
                      <el-table-column property="InStockDays"  label="车采购入库时间（天）"></el-table-column>
                      <el-table-column property="Warehouse"  label="当前所在仓库"></el-table-column>
                  </el-table>
                  <div class="mod-ft text-center">
                    <el-pagination v-show="feeTotal/ 10 > 1"
                      layout="prev, pager, next"
                      @current-change="queryCarDetail"
                      :current-page.sync="feeDetailPage"
                      :total="feeTotal">
                    </el-pagination>
                  </div>
              </el-dialog>
              </div>
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
      feeDate:'',
      feeInterest:'',
      feeInt:{
        date:'',
        cost:''
      },
      form:{
        LoanCode:''
      },      
      basicData:{},
      feeList:[],
      carList:[],
      feeShow:false,
      feeDetail:[],
      feeTotal:0,
      feeDetailPage:1,
      cId:'',
      carListCopy:[],
      cost:{},
      dialogInterest:false,
      pageInterest:1,
      pageInterestSize:0,
      Interests:[],
      oneCar:false,
      oneSettle:false,
      interestPopup:false
      }
  },
  methods: { 
    getIntFee(){
      var vm=this;
      this.$api.resource({
      context: vm,
      type: 'post',
      url: '/Cost/GetNoYetInteres',
      data:{
        LoanCode:vm.$route.params.code,
        Date:formatDate(vm.feeInt.date,"yyyy-MM-dd")
      },
      callback: function (data) {
          vm.feeInt.cost=data.Data;
        }        
      });
    },
    showCarDetail(id){
      var vm=this;
      vm.feeShow=true;
      vm.cId=id;
      vm.queryCarDetail();
    },
    queryCarDetail(){
      var vm=this;
      this.$api.resource({
      context: vm,
      type: 'post',
      url: '/Cost/GetRepaymentCar',
      data:{
        repaymentId:vm.cId,
        page:vm.feeDetailPage,
        pageSize:10
      },
      callback: function (data) {
        if (!data.Success && data.ErrorMessage) {
            vm.feeDetail=[];
            vm.feeTotal=0;
              return false
          }
          vm.feeDetail=data.Data.Item1;
          vm.feeTotal=data.Data.Item2;
        }        
      });
    },
    payCar(){
      var vm=this;
      var vins=[];
      for(var i=0;i<vm.carListCopy.length;i++){
        vins.push(vm.carListCopy[i].Vin);
      }
      this.$api.resource({
      context: vm,
      type: 'post',
      url: '/Cost/RepayCars',
      data:{
        loanCode:vm.$route.params.code,
        vins:vins,
        repayTime:formatDate(new Date(),"yyyy-MM-dd")
      },
      callback: function (data) {
        if (!data.Success && data.ErrorMessage) {
              vm.$message({
              message: data.ErrorMessage,
              type: 'warning'
              })
              return false
          }
          vm.oneCar=false;
          vm.init();
        }        
      });
    },
    RepayInterest(){
      var vm=this;
      this.$api.resource({
      context: vm,
      type: 'post',
      url: '/Cost/RepayInterest',
      data:{
        loanCode:vm.$route.params.code,
        interest:vm.feeInterest,
        CostDeadlineTime :formatDate(vm.feeDate,"yyyy-MM-dd"),
        repayTime:formatDate(vm.feeInt.date,"yyyy-MM-dd")
      },
      callback: function (data) {
        if (!data.Success && data.ErrorMessage) {
              vm.$message({
              message: data.ErrorMessage,
              type: 'warning'
              })
              return false
          }
          vm.interestPopup=false;
          vm.init();
        }        
      });
    },
    PayOff(){
      var vm=this;
      this.$api.resource({
      context: vm,
      type: 'post',
      url: '/Cost/PayOff',
      data:{
        loanCode:vm.$route.params.code,
        interest:vm.cost.NotInterest,
        principal:vm.cost.NotAmount,
        repayTime:formatDate(vm.feeDate,"yyyy-MM-dd"),
        CostDeadlineTime:formatDate(vm.feeInt.date,"yyyy-MM-dd")
      },
      callback: function (data) {
        if (!data.Success && data.ErrorMessage) {
              vm.$message({
              message: data.ErrorMessage,
              type: 'warning'
              })
              return false
          }
          vm.oneSettle=false;
          vm.init();
        }        
      });
    },
    openCar(){
      var vm=this;
      vm.oneCar=true;
      vm.queryCar();
    },
    queryCar(){
      var vm=this;
      this.$api.resource({
      context: vm,
      type: 'post',
      url: '/Cost/GetPledgeCarList',
      data:{
        LoanId:vm.$route.params.id,
        Page:1,
        PageSize:10
      },
      callback: function (data) {
        if (!data.Success && data.ErrorMessage) {
              vm.$message({
              message: data.ErrorMessage,
              type: 'warning'
              })
              return false
          }
          vm.carList=data.Data.Item1;
        }        
      });
    },
    openSettle(){
      var vm=this;
      vm.oneSettle=true;
    },
    openInterest(){
      var vm=this;
      vm.interestPopup=true;
    },
    openDialogInterest(){
        var vm=this;
        vm.queryInterest();
        vm.dialogInterest=true;
    },
    queryInterest(){
        var vm=this;
        vm.$api.resource({
        context: vm,
        type: 'Post',
        url: '/Cost/GetInterests',
        data:{
            loanCode:vm.$route.params.code,
            page:vm.pageInterest,
            pageSize:10
        },
        callback: function (mdata) {
            if (!mdata.Success && mdata.ErrorMessage) {
                vm.$message({
                message: mdata.ErrorMessage,
                type: 'warning'
                })
                return false
            }                    
            if(mdata.Data!=null){
                vm.Interests=mdata.Data.Item1;
                vm.pageInterestSize=mdata.Data.Item2;
            }
        } 
    });
    },
    init(){
      var vm=this;
      this.$api.resource({
        context: vm,
        type: 'post',
        url: '/Car/GetLoanById',
        data:{
          LoanId:vm.$route.params.id
        },
        callback: function (data) {
        if (!data.Success && data.ErrorMessage) {
              vm.$message({
              message: data.ErrorMessage,
              type: 'warning'
              })
              return false
          }
          vm.basicData=data.Data;
        }        
      });

      this.$api.resource({
        context: vm,
        type: 'post',
        url: '/Cost/GetCosts',
        data:{
          LoanId:vm.$route.params.id
        },
        callback: function (data) {
        if (!data.Success && data.ErrorMessage) {
              vm.$message({
              message: data.ErrorMessage,
              type: 'warning'
              })
              return false
          }
          vm.feeList=data.Data;
        }        
      });

      this.$api.resource({
        context: vm,
        type: 'post',
        url: '/Cost/GetCostStatistics',
        data:{
          LoanId:vm.$route.params.id
        },
        callback: function (data) {
        if (!data.Success && data.ErrorMessage) {
              vm.$message({
              message: data.ErrorMessage,
              type: 'warning'
              })
              return false
          }
          vm.cost=data.Data;
        }        
      });
    },
    handleSelectionChange(val){
      this.carListCopy=val;
    },
    formatter(row, column){
        let date = new Date(row.InterestDate);
        return formatDate(date,'yyyy-MM-dd');
    },
    formatNum(row, column){
        return toThousands(row.Total);
    },
    formatPrice(row, column){
        return toThousands(row.PledgePrice);
    }
  },
  mounted () {
    var vm=this;
    vm.init();
  },
  beforeMount () {
    this.form.LoanCode = this.$route.params.code;
  },
  filters:{
      formatDate(time){
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

</style>



// WEBPACK FOOTER //
// src/components/LoanFee.vue?42ad5063