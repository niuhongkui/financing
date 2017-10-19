<template>
<app-layout>
  <ol slot="crumb" class="breadcrumb">
       <router-link class="back"
      :to="{ name: 'creditDetail', query: {id: form.DetailId}}"><< 返回</router-link>
    <li>
      <router-link :to="{ name: 'credit'}">自采融资管理</router-link>
    </li>
    <li>
      <router-link :to="{ name: 'credit'}">金融授信</router-link>
    </li>
    <li>
      <router-link :to="{ name: 'creditDetail', query: {id: form.DetailId}}">详情</router-link>
    </li>
    <li class="active">
      <span>拆分额度</span>
    </li>
  </ol>
<div class="">
    <div class="mod">
    <div class="mod-bd no-padding">
        <div class="mod-operation"> <strong>金融机构：{{basicData.InstitutionName}}  |  授信额度：{{basicData.CreditAmount|toThousands}}元</strong></div>
        <div class="table-responsive no-padding">
        <table class="table table-hover table-oversized">
            <tbody>
            <tr>
                <th>拆分额度（元）</th>
                <th>金融产品</th>
                <th class="text-right">操作</th>
            </tr>
            <tr v-for="node in basicData.FinancialProductCreditDetail">
                <td>{{node.ProductCreditAmount|toThousands}}</td>
                <td>{{getNames(node.ProductInfo)}}  </td>
                <td class="text-right"><a href="#" data-toggle="modal" @click="open(node)" >编辑</a></td>
            </tr>
            </tbody>
        </table>
        <!-- 修改额度 -->
        <el-dialog title="修改额度" :visible.sync="form.isShow" size="tiny">
            <div class="form-horizontal">
            <div class="form-group">
                <label class="col-sm-3 control-label">额度：</label>
                <div class="col-sm-9">
                <div class="input-group">
                    <input v-model="form.ProductCreditAmount" class="form-control" type="text">
                    <div class="input-group-addon">元</div>
                </div>
                </div>
            </div>            
            </div>
            <span slot="footer" class="dialog-footer">
            <el-button @click="form.isShow = false">取 消</el-button>
            <el-button type="primary" @click="SaveAmount">确 定</el-button>
            </span>
        </el-dialog>
        </div>        
    </div>
    </div>
</div>
</app-layout>
</template>

<script>
import {toThousands} from '../api/toThousands.js' 
export default {
  data () {
    return {
      basicData:{
        InstitutionName:'',
        CreditAmount:''
      },
      form:{
          isShow:false,
          ProductIds:[],
          ProductCreditAmount:'',
          DetailId:''
      }
    }
  },
  methods:{
    init(){
        var vm = this    
        this.$api.resource({
        context: vm,
        type: 'get',
        data:{
            creditId:vm.$route.params.id
        },
        url: '/FinancialCredit/GetFinancialProductCreditInfo',
        callback: function(data) {
            vm.basicData = data.Data;
        }
        })
    },
    getNames(arr){
        var str="";
        for(var i=0;i<arr.length;i++){
            str= arr[i].Key+"|"+str;
        }
        if(str.length>0)
            str=str.substring(0,str.length-1);
        return str;
    },
    open(obj){
        var ids=[];
        for(var i=0;i<obj.ProductInfo.length;i++){
            ids.push(obj.ProductInfo[i].Value);
        }
        var vm=this;
        vm.form.isShow=true;
        vm.form.ProductCreditAmount=obj.ProductCreditAmount;
        vm.form.DetailId=obj.DetailId;
        vm.form.ProductIds=ids;
    },
    SaveAmount(){
        var vm=this;
        var arr=new Array();
        arr=[vm.form];
        $.ajax({
        type: 'post',
        url: vm.$api.url+'/FinancialCredit/FinancialProductUpdate',
        xhrFields: {
            withCredentials: true
        },
        crossDomain: true,
        contentType: 'application/json',
        data: JSON.stringify(arr),
        success: function (data) {
            if (!data.Success && data.ErrorMessage) {
                vm.$message({
                    message: data.ErrorMessage,
                    type: 'warning'
                })
                return false
            }
            vm.form.isShow=false;
            vm.init();
            }        
        });
    }
  },    
  mounted() {
      var vm = this;
      vm.init();
  },
  beforeMount () {
    this.form.DetailId = this.$route.query.id
  },
    filters:{
        toThousands(num){
            return toThousands(num);
        }
    } 
}
</script>

<style scoped>

</style>



// WEBPACK FOOTER //
// src/components/CreditSplit.vue?f0410e66