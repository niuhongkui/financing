<template>
<app-layout>
  <ol slot="crumb" class="breadcrumb">
    <li>
      <router-link :to="{ name: 'credit'}">自采融资管理</router-link>
    </li>
    <li class="active">
      <span>金融授信</span>
    </li>
  </ol>
    <div class="">    
        <div class="mod mod-search form-horizontal">    
            <div class="mod-bd">    
                <div class="row">    
                    <div class="col-lg-4">    
                        <div class="form-group">    
                            <label class="col-lg-4 control-label">金融机构编号：</label>    
                            <div class="col-lg-8">
                                    <input class="form-control" v-model="form.InstitutionsCode" type="text">    
                            </div>    
                        </div>    
                    </div>    
                    <div class="col-lg-4">    
                        <div class="form-group">    
                            <label class="col-lg-4 control-label">金融机构：</label>    
                            <div class="col-lg-8">    
                                <input class="form-control" v-model="form.InstitutionName" type="text">    
                            </div>    
                        </div>    
                    </div>    
                    <div class="col-lg-4">    
                        <div class="form-group">    
                            <label class="col-lg-4 control-label">授信状态：</label>    
                            <div class="col-lg-8">    
                                <el-select v-model="form.CreditStatusCode" placeholder="请选择" :clearable="true" style="width:100%">    
                                    <el-option v-for="(item, index) in CreditStatus" :key="index" :label="item.Description" :value="item.Code">    
                                    </el-option>    
                                </el-select>    
                            </div>    
                        </div>    
                        <div class="form-group">    
                            <div class="col-lg-12 text-right">    
                                <button class="btn btn-primary" @click="Query"><i class="fa fa-fw fa-search"></i>查询</button>    
                            </div>    
                        </div>    
                    </div>    
                </div>    
            </div>    
        </div>    
        <div class="mod border-bottom pb20 mb20">    
            <div class="mod-operation">    
               <router-link  to="/Finance/creditAdd">
                    <el-button type="primary" class="btn-primary" icon="add" >新增</el-button>
                </router-link>    
            </div>
            <div v-for="node in CreditList"  class=" pb20 mb20">
            <div  class="mod-hd no-border">
                <div class="mod-operation"><strong>金融机构编号：{{node.InstitutionsCode}} | 金融机构名称：{{node.Institution}}</strong>    
                    <div class="btn-group pull-right">
                        <a v-if="node.CreditStatusCode==1" data-toggle="modal" @click="confirm(node.Id)" href="#">确认</a>
                        <a v-if="node.CreditStatusCode==1" data-toggle="modal" @click="del(node.Id)" href="#">删除</a>
                        <router-link  :to='"/Finance/creditDetail/"+node.Id'>
                            <a data-toggle="modal" href="#">详情</a>
                        </router-link>      
                    </div>    
                </div>    
                <div class="mod-operation mb0">授信状态：<span class="label-status text-success mr5">    
                {{node.CreditStatus}}</span>| 有效期至：{{node.ExpirationDate|formatDate}} | 临时额度：{{node.TemporaryLinesAdditionNumer|toThousands}} 元 | 临时额度期限至：{{node.TemporaryLinesExpirationDate|formatDate}} | 申请时间：{{node.ApplyTime|formatDate}}</div>    
            </div>    
            <div class="mod-bd no-padding">    
                <table class="table table-bordered info-list-five">    
                    <tbody>    
                        <tr>    
                            <td width="16%"> <strong class="num">{{node.CreditTotalCount|toThousands}}</strong><span>授信总额（元）</span></td>    
                            <td width="16%"> <strong class="num">{{node.AvailableCredit|toThousands}}</strong><span>可用额度（元）</span></td>    
                            <td width="16%"> <strong class="num">{{node.LoanBalance|toThousands}}</strong><span>贷款余额（元）</span></td>    
                            <td width="16%"> <strong class="num">{{node.Deposit|toThousands}}</strong><span>保证金（元）</span></td>    
                            <td width="16%"> <strong class="num">{{node.DepositBalance|toThousands}}</strong><span>保证金余额（元）</span></td>    
                            <td width="16%"> <strong class="num">{{node.FundSupervising|toThousands}}</strong><span>监管资产总额（元） </span></td>    
                        </tr>    
                    </tbody>    
                </table>    
            </div>
            </div>
        </div>    
        <div class="mod-ft text-center">    
            <el-pagination v-show="total/ 10 > 1" layout="prev, pager, next" @current-change="Query" :current-page.sync="form.Page" :total="total">    
            </el-pagination>    
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
            form: {    
                InstitutionsCode: '',    
                InstitutionName: '',    
                CreditStatusCode: '',    
                Page: 1,    
                PageSize: 10,    
            },    
            CreditStatus: [],    
            CreditList: [],    
            total: 0    
        }    
    },    
    methods: {    
        getCreditStatus() {    
            var vm = this    
            this.$api.resource({    
                context: vm,    
                type: 'get',    
                url: '/BasicData/GetCreditStatusList?Source=1',   
                data:{
                    Source:1
                }, 
                callback: function(data) {    
                    vm.CreditStatus = data    
                }    
            })    
        },    
        Query() {    
            var vm = this;  
            var data= {    
                InstitutionsCode: vm.form.InstitutionsCode,    
                InstitutionName:  vm.form.InstitutionName,    
                CreditStatusCode:  vm.form.CreditStatusCode,    
                Page:  vm.form.Page,    
                PageSize:  vm.form.PageSize,    
            };
            if(!data.CreditStatusCode)   
                data.CreditStatusCode=0; 
            this.$api.resource({    
                context: vm,    
                type: 'post',    
                data: data,    
                url: '/FinancialCredit/GetCreditList',    
                callback: function(data) {    
                    vm.CreditList = data.Data.Data;    
                    vm.total = data.Data.Count;    
                }    
            })    
        },
        confirm(id){
            var vm = this
            this.$confirm('是否确定此授信, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {  
                vm.$api.resource({    
                    context: vm,    
                    type: 'get',    
                    data: {
                        id:id
                    },    
                    url: '/FinancialCredit/SelfCreditConfirm',    
                    callback: function(data) {    
                       if (!data.Success && data.ErrorMessage) {
                        vm.$message({
                        message: data.ErrorMessage,
                        type: 'warning'
                        })
                        return false
                        }                    
                        vm.$message({
                            type: 'success',
                            message: '确认成功!',
                            onClose:function(){
                                vm.Query();
                            }
                        });
                    }    
                }) 
            }).catch(() => {          
            });               
                
        },
        del(obj){
        var vm=this;
        this.$confirm('是否删除此授信申请, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
            }).then(() => {
            var msg=this;
            vm.$api.resource({
                context: vm,
                type: 'get',
                url: '/FinancialCredit/DeleteFinancialCredit',
                data:{
                    id:obj,
                    typeid:1
                },
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
                        message: '成功删除!',
                        onClose:function(){
                            vm.Query();
                        }
                    });
                }
                });
            }).catch(() => {         
        });
        }    
    },    
    mounted() {    
        var vm = this;    
        vm.getCreditStatus();
        vm.Query();
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
    
</style>



// WEBPACK FOOTER //
// src/components/credit.vue?64a1536b