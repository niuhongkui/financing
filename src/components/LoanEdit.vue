<template>
<div>
    <div class="mod">
    <div class="mod-hd">
        <h3 class="mod-text-ms">基本信息</h3>
        <div v-if="basicData.Status==1" class="pull-right"> 
        <button @click="firmLoan(basicData.Code)" class="btn btn-default btn-sm">状态管理</button>
        </div>
    </div>
    <div class="mod-bd">
        <table class="table table-oversized">
        <tbody><tr>
            <th width="20%">贷款记录编号：</th>
            <td width="30%">{{basicData.Code}}</td>
            <th width="20%">金融机构：</th>
            <td width="30%">{{basicData.InsName}}</td>
        </tr>
        <tr>
            <th>金融产品：</th>
            <td>{{basicData.FinProductName}}</td>
            <th>申请时间：</th>
            <td>{{basicData.ApplyTime|formatDate}}</td>
        </tr>
        <tr>
            <th>贷款状态：</th>
            <td colspan="3"><span class="label-status text-success">{{basicData.StatusText}}</span></td>
        </tr>
        </tbody></table>
    </div>
    </div>
    <div class="mod">
    <div class="mod-hd">
        <h3>采购信息</h3>
    </div>
    <div class="mod-bd">
        <table class="table table-oversized">
        <tbody><tr>
            <th width="20%">质押车俩类型：</th>
            <td width="30%">{{basicData.VehicleTypeText}} </td>
            <th width="20%">采购订单编号：</th>
            <td width="30%"> {{basicData.ProjectOrderId}}</td>
        </tr>
        <tr>
            <th>采购项目编号：</th>
            <td> {{basicData.ProjectCode}}</td>
            <th>采购项目名称：</th>
            <td> {{basicData.ProjectName}}</td>
        </tr>
        <tr>
            <th>采购合同编号：</th>
            <td colspan="3">{{basicData.ProjectContractCode}}</td>
        </tr>
        </tbody></table>
    </div>
    </div>
    <div class="mod">
    <div class="mod-hd">
        <h3 class="mod-text-ms">合同信息</h3>
        <div v-if="contractData.Type!=1&&basicData.Status==2" class="pull-right">            
          <router-link  :to="{path:'/loan/contract/'+basicData.Code}">
            <button class="btn btn-default btn-sm">添加合同</button>
          </router-link>       
        </div>
    </div>
    <div class="mod-bd">
        <table class="table table-oversized">
        <tbody><tr>
            <th width="20%">金融机构合同编号：</th>
            <td width="30%">{{contractData.FinCode}}</td>
            <th width="20%">合同类型：</th>
            <td width="30%">{{contractData.TypeText}} </td>
        </tr>
        <tr>
            <th>融资金额：</th>
            <td> {{contractData.Total}}</td>
            <th>保证金：</th>
            <td> {{contractData.Deposit}}</td>
        </tr>
        <tr>
            <th>签约时间：</th>
            <td> {{contractData.SignTime}}</td>
            <th>放款时间：</th>
            <td> {{contractData.LendingTime}}</td>
        </tr>
        <tr>
            <th>还款日期：</th>
            <td> {{contractData.RepaymentDate}}</td>
            <th>利率：</th>
            <td> {{contractData.Rate}}</td>
        </tr>
        <tr>
            <th>最晚还款日期：</th>
            <td> {{contractData.OvertimeRepaymentDate}}</td>
            <th>展期利率：</th>
            <td>{{contractData.OverTimeRate}} </td>
        </tr>
        <tr>
            <th>约定还息日：</th>
            <td>{{contractData.PaidInterestDate}} </td>
            <th>行圆合同编号：</th>
            <td> {{contractData.XYCode}}</td>
        </tr>
        </tbody></table>
    </div>
    </div>
    <div class="mod">
    <div class="mod-hd">
        <h3 class="mod-text-ms">车辆信息</h3>        
        <div v-if="basicData.Status==3" class="pull-right"> 
            <router-link  :to="{path:'/loan/pledgedcar/'+basicData.Id+'/'+basicData.Code}">
                <button class="btn btn-default btn-sm">质押车辆</button>
            </router-link>   
        </div>
    </div>
    <div class="mod-bd">
        <div v-for="(item, index) in carData" class="indent-info">
        <div class="mb10"><strong>{{item.CarFullName}}    {{item.CarCount}}台</strong></div>
        <div class="logistics-title"> 
            <div class="pull-right w0"><span class="state">
                <a class="switch" @click="showOrHide(item.SKU)" href="javascript:void(0)">
                    <i class="fa fa-angle-down"> </i><span>车辆明细</span></a></span></div>
            <p class="m0">厂商指导价：{{item.ReferPrice}}  万元／台  │   车辆采购价：{{item.PurchasePrice}} 万元／台  │  二手车估值：{{item.Assess}} 万元／台  │   金融机构质押价格：{{item.PledgePrice}} 万元／台</p>
        </div>
        <div v-bind:name="item.SKU" class="logistics-main">
            <div class="table-responsive no-padding">
            <table  class="table table-bordered table-custom">
                <tbody>
                <tr>
                    <th>VIN码</th>
                    <th>车辆质押时间</th>
                    <th class="text-right">车辆解压时间</th>
                    <th class="text-right">操作</th>
                </tr>
                <tr v-for="(node, index) in carDetail">
                    <td>{{node.Vin}}</td>
                    <td>{{node.LockTime|formatDate}}</td>
                    <td class="text-right">{{node.UnLockTime|formatDate}}</td>
                    <td class="text-right"><a href="#">下载车辆照片</a><a href="#">下载检测报告</a></td>
                </tr>                
                </tbody>
            </table>
            </div>
        </div>
        </div>  
    </div>
    </div>
    <div class="mod mb0">
    <div class="mod-hd">
        <h3 class="mod-text-ms">费用信息</h3>
        <div v-if="basicData.Status==3" class="pull-right"> 
            <router-link  :to="{path:'/loan/LoanFee/'+basicData.Id+'/'+basicData.Code}">
                <button class="btn btn-default btn-sm">费用管理</button>
            </router-link> 
        </div>
    </div>
    <div class="mod-bd">
        <div class="mod-operation">放款：{{cashData.Amount}}元 | 保证金：{{cashData.Deposit}}元</div>
        <div class="mod-operation mb10">已还款合计（本金／利息）：<span class="text-danger">{{cashData.ReAmount}}元 ／{{cashData.ReInterest}}元 </span>| 未还款合计（本金／利息）：<span class="text-danger">{{cashData.NotAmount}}元 ／{{cashData.NotInterest}}元  </span>
            <el-button @click="openDialogInterest" type="text">利息记录</el-button>
            <el-dialog title="利息记录" :visible.sync="dialogInterest">
                <el-table :data="Interests">
                    <el-table-column property="InterestDate" label="日期" ></el-table-column>
                    <el-table-column property="Total" align="right" label="利息（元）"></el-table-column>
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
        <div class="mod-operation">还款记录：</div>
        <div class="table-responsive no-padding">
        <table class="table table-hover table-oversized">
            <tbody>
            <tr>
                <th>发生时间</th>
                <th>结算类型</th>
                <th>金额</th>
                <th>关联车辆</th>
                <th class="text-right">操作</th>
            </tr>
            <tr v-for="node in cashDetail">
                <td>{{node.ClosingDate|formatDate}}</td>
                <td>{{node.TypeText}}</td>
                <td> 
                <div class="text-danger">{{node.Total}}</div>
                </td>
                <td>{{node.CarCount}}台</td>
                <td class="text-right"><a href="#"  data-toggle="modal" @click="openDialogInterest" type="text">查看详情</a></td>
            </tr>            
            </tbody>
        </table>
        </div>
    </div>
    </div>
</div>
</template>

<script>
import {formatDate} from '../api/date.js' 
export default {    
    data() {    
        return {
            basicData:{},
            contractData:{},
            carData:{},
            carDetail:[],
            cashData:{},
            cashDetail:[],
            dialogInterest:false,
            pageInterest:1,
            pageInterestSize:0,
            Interests:[]
        }    
    },
    filters:{
        formatDate(time){
            if(!time)
                return "";
            let date = new Date(time);
            return formatDate(date,'yyyy-MM-dd');
            //此处formatDate是一个函数，将其封装在common/js/date.js里面，便于全局使用
        }
    },    
    methods:{
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
                    loanCode:vm.basicData.Code,
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
        getCash(vm){
             //费用管理
            vm.$api.resource({
                context: vm,
                type: 'Post',
                url: '/Cost/GetCostStatistics',
                data:{
                    LoanId:vm.basicData.Id
                },
                callback: function (mdata) {
                    if (!mdata.Success && mdata.ErrorMessage) {
                        // vm.$message({
                        // message: mdata.ErrorMessage,
                        // type: 'warning'
                        // })
                        return false
                    }                    
                    if(mdata.Data!=null){
                        vm.cashData=mdata.Data;
                    }
                } 
            });
             //费用列表
            vm.$api.resource({
                context: vm,
                type: 'Post',
                url: '/Cost/GetCosts',
                data:{
                    LoanId:vm.basicData.Id
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
                        vm.cashDetail=mdata.Data;
                    }
                } 
            });
        },
        init(){
            var vm = this
            //基本信息
            vm.$api.resource({
                context: vm,
                type: 'get',
                url: '/Loan/GetBasicInfo/'+vm.$route.params.id,
                callback: function (data) {
                    if (!data.Success && data.ErrorMessage) {
                        vm.$message({
                        message: data.ErrorMessage,
                        type: 'warning'
                        })
                        return false
                    }
                    vm.basicData=data.Data;
                    vm.getCash(vm);                   
                }
            });
            //合同信息
            vm.$api.resource({
                context: vm,
                type: 'get',
                url: '/Loan/GetContractInfo/'+vm.$route.params.id,
                callback: function (data) {
                    if (!data.Success && data.ErrorMessage) {
                        vm.$message({
                        message: data.ErrorMessage,
                        type: 'warning'
                        })
                        return false
                    }                    
                    if(data.Data!=null){
                       vm.contractData=data.Data;
                    }
                }
            });
             //车辆信息
            vm.$api.resource({
                context: vm,
                type: 'get',
                url: '/Loan/GetCarSKU/'+vm.$route.params.id,
                callback: function (data) {
                    if (!data.Success && data.ErrorMessage) {                        
                        return false
                    }                    
                    if(data.Data!=null){
                       vm.carData=data.Data;
                    }
                }
            });
        },
        showOrHide:function (code) {
            var vm=this;
            var main= $('[name='+code+']');
            var _el=$(event.currentTarget);           
            if(main.is(':hidden')){
                vm.$api.resource({
                context: vm,
                type: 'post',
                url: '/Loan/GetCarDetail',
                data:{
                    Code:vm.$route.params.id,
                    SKU:code
                },
                callback: function (data) {
                    if (!data.Success && data.ErrorMessage) {
                        vm.$message({
                        message: data.ErrorMessage,
                        type: 'warning'
                        })
                        return false
                    }                    
                    if(data.Data!=null){
                       vm.carDetail=data.Data;
                    }
                }
            })
                $('.logistics-main').hide();
                main.show();
                _el.find("span").text('收藏明细');
                _el.find("i").prop("class","fa fa-angle-up");
            }else{
                main.hide();
                _el.find("span").text('车辆明细');
                _el.find("i").prop("class","fa fa-angle-down")
            }
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
                                message: '成功确定!'
                            });
                        }
                    });
               
                }).catch(() => {         
            });
        }
    },

    mounted(){
        var vm = this;
        vm.init();
    }  
}
</script>

<style scoped>
</style>



// WEBPACK FOOTER //
// src/components/LoanEdit.vue?385106b8