<template>
<app-layout>
  <ol slot="crumb" class="breadcrumb">
    <router-link class="back"
      :to="{ name: 'index' }"><< 返回</router-link>
    <li>
    <li>
      <router-link :to="{ name: 'index'}">自采融资管理</router-link>
    </li>
    <li>
      <router-link :to="{ name: 'index'}">金融贷款</router-link>
    </li>
    <li class="active">
      <span>明细</span>
    </li>
  </ol>
<div>
    <div class="mod">
    <div class="mod-hd">
        <h3 class="mod-text-ms">基本信息</h3>
        <div v-if="basicData.Status==2" class="pull-right"> 
        <button @click="RejectLoan(basicData.Code)" class="btn btn-default btn-sm">状态管理</button>
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
    <div v-if="basicData.ProjectOrderId" class="mod-hd">
        <h3>采购信息</h3>
    </div>
    <div v-if="basicData.ProjectOrderId" class="mod-bd">
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
          <router-link  :to="{path:'/loan/contract/'+basicData.Code+'?cartype='+basicData.VehicleType}">
            <button class="btn btn-default btn-sm">添加合同</button>
          </router-link>       
        </div>
    </div>
    <div v-if="contractData.FinCode" class="mod-bd">
        <table class="table table-oversized">
        <tbody><tr>
            <th width="20%">金融机构合同编号：</th>
            <td width="30%">{{contractData.FinCode}}</td>
            <th width="20%">合同类型：</th>
            <td width="30%">{{contractData.TypeText}} </td>
        </tr>
        <tr>
            <th>融资金额：</th>
            <td> {{contractData.Total|toThousands}}元</td>
            <th>保证金：</th>
            <td> {{contractData.Deposit|toThousands}}元</td>
        </tr>
        <tr>
            <th>签约时间：</th>
            <td> {{contractData.SignTime|formatDate}}</td>
            <th>放款时间：</th>
            <td> {{contractData.LendingTime|formatDate}}</td>
        </tr>
        <tr>
            <th>还款日期：</th>
            <td> {{contractData.RepaymentDate|formatDate}}</td>
            <th>利率（{{contractData.LoanRateCalcMethod+"/"+contractData.LoanRateCalcType}}）：</th>
            <td> {{contractData.RateText}}</td>
        </tr>
        <tr>
            <th>最晚还款日期：</th>
            <td> {{contractData.LatestRepaymentDate|formatDate}}</td>
            <th>展期利率<span v-if="contractData.ExtensionRateCalcMethod">（{{(contractData.ExtensionRateCalcMethod?contractData.ExtensionRateCalcMethod:"按日计息")+"/"+(contractData.ExtensionRateCalcType?contractData.ExtensionRateCalcType:"日息")}}}）</span>：</th>
            <td>{{contractData.OverTimeRateText}}</td>
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
                <button class="btn btn-default btn-sm mt10">质押车辆</button>
            </router-link>   
        </div>
    </div>
    <div class="mod-bd">
        <div v-for="(item, index) in carData" class="indent-info">
        <div class="mb10"><strong>{{item.CarFullName}} {{item.Color}}  
            <span v-if="basicData.VehicleType==2">上牌时间:{{item.UsedCarLicensingDate}}  行驶里程:{{item.UsedCarMileage}}公里  {{item.UsedCarStatus}}</span>  {{item.RegulatedCount}}台 </strong></div>
        <div class="logistics-title"> 
            <div class="pull-right w0"><span class="state">
                <a class="switch" @click="showOrHide(item.SKU)" href="javascript:void(0)">
                    <i class="fa fa-angle-down"> </i><span>车辆明细</span></a></span></div>
            <p class="m0">厂商指导价：{{item.ReferPrice|toThousands}}  元／台  │   车辆采购价：{{item.PurchasePrice|toThousands}} 元／台 
                 │<span v-if="basicData.VehicleType==2">  二手车估值：{{item.Assess|toThousands}} 元／台  │</span>   金融机构质押价格：{{item.PledgePrice|toThousands}} 元／台</p>
        </div>
        <div v-bind:name="item.SKU" class="logistics-main">
            <div class="table-responsive no-padding">
            <table  class="table table-bordered table-custom">
                <tbody>
                <tr>
                    <th>VIN码</th>
                    <th>车辆质押时间</th>
                    <th class="text-right">车辆解压时间</th>
                    <th v-if="basicData.VehicleType!=1" class="text-right">操作</th>
                </tr>
                <tr v-for="(node, index) in carDetail">
                    <td>{{node.Vin}}</td>
                    <td>{{node.LockTime|formatDate}}</td>
                    <td class="text-right">{{node.UnLockTime|formatDate}}</td>
                    <td v-if="basicData.VehicleType!=1" class="text-right"><a data-toggle="modal" @click="downGif('',node.Vin)" href="#">下载车辆照片</a><a data-toggle="modal" @click="downFile('',node.Vin)"  href="#">下载检测报告</a></td>
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
        <div class="mod-operation">放款：{{cashData.Amount|toThousands}}元 | 保证金：{{cashData.Deposit|toThousands}}元</div>
        <div class="mod-operation mb10">已还款合计（本金／利息）：<span class="text-danger">{{cashData.ReAmount|toThousands}}元 ／{{cashData.ReInterest|toThousands}}元 </span>| 未还款合计（本金／利息）：<span class="text-danger">{{cashData.NotAmount|toThousands}}元 ／{{cashData.NotInterest|toThousands}}元  </span>
            <el-button @click="openDialogInterest" type="text">利息记录</el-button>
            <el-dialog title="利息记录" :visible.sync="dialogInterest">
                <el-table :data="Interests">
                    <el-table-column property="InterestDate" label="日期" :formatter="formatter"></el-table-column>
                    <el-table-column property="Total" align="right" :formatter="formatNum" label="利息（元）"></el-table-column>
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
                <th>利息范围</th>
                <th>结算类型</th>
                <th>应付金额</th>
                <th>实付金额</th>
                <th>关联车辆</th>
                <th class="text-right">操作</th>
            </tr>
            <tr v-for="node in cashDetail">
                <td>{{node.ClosingDate|formatDate}}</td>
                <td><span v-if="node.Type==3">{{node.RepayTime|formatDate}}以前</span></td>
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
                <el-table-column property="PledgePrice"  label="质押价格(元／台)"></el-table-column>
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
            Interests:[],
            feeShow:false,
            feeDetail:[],
            feeTotal:0,
            feeDetailPage:1,
            cId:''
        }    
    },
    filters:{
        formatDate(time){
            if(!time)
                return "--";
            if(time=="9999-12-31")
                return "--";
            let date = new Date(time);
            return formatDate(date,'yyyy-MM-dd');
            //此处formatDate是一个函数，将其封装在common/js/date.js里面，便于全局使用
        },
        toThousands(num){
            return toThousands(num);
        }
    },    
    methods:{
        formatPercent(num){
            if(!num)
                return '0%';
            else
                return num*100+"%";
        },
        formatter(row, column){
            let date = new Date(row.InterestDate);
            return formatDate(date,'yyyy-MM-dd');
        },
        formatNum(row, column){
            return toThousands(row.Total);
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
                        // vm.$message({
                        // message: data.ErrorMessage,
                        // type: 'warning'
                        // })
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
        RejectLoan(code){
            var vm=this;
            this.$confirm('是否拒绝此贷款申请, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
                }).then(() => {
                    var msg=this;
                    vm.$api.resource({
                        context: vm,
                        type: 'get',
                        url: '/Loan/RejectLoan/'+code,
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
                                message: '成功拒绝!'
                            });
                        }
                    });
               
                }).catch(() => {         
            });
        },
        downFile(key,vin){
        var vm=this;
        // var options={
        //   url:vm.$api.url+ "/Car/DownFile?fileKey="+key+"&vin="+vin,
        //   data:{
        //     fileKey:key,
        //     vin:1
        //   }
        // };
        // var config = $.extend(true, { method: 'post' }, options);
        // var $iframe = $('<iframe id="down-file-iframe" />');
        // var $form = $('<form target="down-file-iframe" method="' + config.method + '" />');
        // $form.attr('action', config.url);
        // for (var key in config.data) {
        //     $form.append('<input type="hidden" name="' + key + '" value="' + config.data[key] + '" />');
        // }
        // $iframe.append($form);
        // $(document.body).append($iframe);
        // $form[0].submit();
        // $iframe.remove(); 
        window.open(vm.$api.url+ "/Car/DownFile?fileKey="+key+"&vin="+vin);
        },
        downGif(key,vin){
            var vm=this;
            vm.$api.resource({
                context: vm,
                type: 'post',
                url: '/car/GetAllPhotoKeys/',
                data:{
                    vin:vin
                },
                callback: function (data) {
                    if (!data.Success && data.ErrorMessage) {
                        vm.$message({
                        message: data.ErrorMessage,
                        type: 'warning'
                        })
                        return false
                    }    
                    var options={
                      url:vm.$api.downurl
                    };
                    var config = $.extend(true, { method: 'post' }, options);
                    var $iframe = $('<iframe id="down-file-iframe" />');
                    var $form = $('<form target="down-file-iframe" method="' + config.method + '" />');
                    $form.attr('action', config.url);
                    for (var i=0;i<data.Data.length;i++) {
                        $form.append('<input type="hidden" name="['+i+']" value="' + data.Data[i] + '" />');
                    }
                    $iframe.append($form);
                    $(document.body).append($iframe);
                    $form[0].submit();
                    $iframe.remove(); 
                }
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
// src/components/LoanDetail.vue?d5982aa6