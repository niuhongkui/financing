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
      <span>详情</span>
    </li>
  </ol>
  <div class="">
          <div class="mod">
            <div class="mod-hd">
              <h3 class="mod-text-ms">基本信息</h3>
              <div class="pull-right">
                <button v-if="basicData.CreditStatusCode>1" class="btn btn-default" data-toggle="modal" @click="dialogContinue=true">续签</button>
                <!-- 续签 -->
                <el-dialog title="续签" :visible.sync="dialogContinue" size="tiny">
                  <div class="form-horizontal">
                    <div class="form-group m0">
                      <label class="col-sm-3 control-label">有效期至：</label>
                      <div class="col-sm-9">
                        <div class="input-group">
                          <el-date-picker style="width: 100%;" format="yyyy-MM-dd"
                            type="date" v-model="updateDate"
                            placeholder="选择日期">
                          </el-date-picker>
                        </div>
                      </div>
                    </div>
                  </div>
                  <span slot="footer" class="dialog-footer">
                    <el-button @click="dialogContinue = false">取 消</el-button>
                    <el-button type="primary" @click="SaveContinue">确 定</el-button>
                  </span>
                </el-dialog>

                <button v-if="basicData.CreditStatusCode>1" class="btn btn-default" data-toggle="modal" @click="dialogChange.isShow=true">临时额度增加  </button>
                <!-- 临时额度增加 -->
                <el-dialog title="临时额度增加" :visible.sync="dialogChange.isShow" size="tiny">
                  <div class="form-horizontal">
                    <div class="form-group">
                      <label class="col-sm-3 control-label">临时额度：</label>
                      <div class="col-sm-9">
                        <div class="input-group">
                          <input v-model="dialogChange.amount" class="form-control" type="text">
                          <div class="input-group-addon">元</div>
                        </div>
                      </div>
                    </div>
                    <div class="form-group mb0">
                      <label class="col-sm-3 control-label">有效期至：</label>
                      <div class="col-sm-9">                        
                        <el-date-picker style="width: 100%;" format="yyyy-MM-dd"
                        type="date" v-model="dialogChange.date"
                        placeholder="选择日期">
                        </el-date-picker>                       
                      </div>
                    </div>
                  </div>
                  <span slot="footer" class="dialog-footer">
                    <el-button @click="dialogChange.isShow = false">取 消</el-button>
                    <el-button type="primary" @click="SaveAmount">确 定</el-button>
                  </span>
                </el-dialog>

                <button v-if="basicData.CreditStatusCode>1" class="btn btn-default" data-toggle="modal" @click="opendialogCredit">额度变更  </button>
                <!-- 额度变更 -->
                <el-dialog title="额度变更" :visible.sync="dialogCredit.isShow" size="tiny">
                  <div class="form-horizontal">
                    <div class="form-group">
                      <label class="col-sm-3 control-label">授信额度：</label>
                      <div class="col-sm-9">
                        <div class="input-group">
                          <input v-model="dialogCredit.creditLine" class="form-control" type="text">
                          <div class="input-group-addon">元</div>
                        </div>
                      </div>
                    </div>
                    <div class="form-group mb0">
                      <label class="col-sm-3 control-label">敞口额度：</label>
                      <div class="col-sm-9">
                        <div class="input-group">
                          <input v-model="dialogCredit.exposureLimit" class="form-control" type="text">
                          <div class="input-group-addon">元</div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <span slot="footer" class="dialog-footer">
                    <el-button @click="dialogCredit.isShow = false">取 消</el-button>
                    <el-button type="primary" @click="UpdateCredit">确 定</el-button>
                  </span>
                </el-dialog>

                <button v-if="basicData.CreditStatusCode>1" class="btn btn-default" data-toggle="modal" @click="dialogDeposit.isShow=true">保证金提取  </button>

                <!-- 保证金提取 -->
                <el-dialog title="保证金提取" :visible.sync="dialogDeposit.isShow" size="tiny">
                  <div class="form-horizontal">
                    <div class="form-group mb10">
                      <label class="col-sm-4 text-right">保证金余额：</label>
                      <div class="col-sm-8">{{basicData.DepositBalance|toThousands}} 元</div>
                    </div>
                    <div class="form-group mb0">
                      <label class="col-sm-4 control-label">提取金额：</label>
                      <div class="col-sm-8">
                        <div class="input-group">
                          <input v-model="dialogDeposit.Amount" class="form-control" type="text">
                          <div class="input-group-addon">元</div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <span slot="footer" class="dialog-footer">
                    <el-button @click="dialogDeposit.isShow = false">取 消</el-button>
                    <el-button type="primary" @click="UpdateDeposit">确 定</el-button>
                  </span>
                </el-dialog>
              </div>
            </div>
            <div class="mod-bd">
              <table class="table table-oversized">
                <tbody><tr>
                  <th width="20%">金融机构：</th>
                  <td width="30%">{{basicData.InstitutionName}}</td>
                  <th width="20%">申请时间：</th>
                  <td width="30%">{{basicData.ApplyTime|formatDate}}</td>
                </tr>
                <tr>
                  <th>有效期至：</th>
                  <td>{{basicData.ExpirationDate|formatDate}}</td>
                  <th>授信额度：</th>
                  <td>{{basicData.CreditLine|toThousands}}元</td>
                </tr>
                <tr>
                  <th>敞口额度：</th>
                  <td>{{basicData.ExposureLimit|toThousands}} 元</td>
                  <th>临时额度增加：</th>
                  <td>{{basicData.TemporaryLinesAdditionNumer|toThousands}}元</td>
                </tr>
                <tr>
                  <th>临时额度增加期限至：</th>
                  <td>{{basicData.TemporaryLinesExpirationDate|formatDate}} </td>
                  <th>授信总额：</th>
                  <td>{{basicData.CreditTotal|toThousands}} 元</td>
                </tr>
                <tr>
                  <th>可用额度：</th>
                  <td>{{basicData.AvaliAmount|toThousands}}  元</td>
                  <th>贷款余额：</th>
                  <td>{{basicData.LoanBalance|toThousands}} 元</td>
                </tr>
                <tr>
                  <th>保证金：</th>
                  <td>{{basicData.Deposit|toThousands}}  元</td>
                  <th>保证金余额：</th>
                  <td>{{basicData.DepositBalance|toThousands}} 元</td>
                </tr>
              </tbody></table>
            </div>
          </div>
          <div class="mod">
            <div class="mod-hd">
              <h3 class="mod-text-ms">拆分额度</h3>
              <div v-if="basicData.CreditStatusCode>1"  class="pull-right">
                <router-link   :to="'/Finance/CreditSplit/' +basicData.Id">
                    <button class="btn btn-default">拆分额度变更</button>
                </router-link>
                
              </div>
            </div>
            <div class="mod-bd">
              <div class="table-responsive no-padding">
                <table class="table table-hover table-oversized">
                  <tbody>
                    <tr>
                      <th>拆分额度（元）</th>
                      <th>金融产品</th>
                      <th>可用额度（元）</th>
                      <th class="text-right">贷款余额（元）</th>
                      <th class="text-right">保证金（元）</th>
                    </tr>
                    <tr v-for="node in basicData.SplitDetail">
                      <td>{{node.ProductCreditAmount|toThousands}}</td>
                      <td>{{node.ProductNames.join("|")}}</td>
                      <td>{{node.AvaliAmount|toThousands}}</td>
                      <td class="text-right"> <span class="mr10">{{node.LoanBalance|toThousands}}</span></td>
                      <td class="text-right"> <span class="mr10">{{node.Deposit|toThousands}}</span></td>
                    </tr>                    
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          <div class="mod mb0">
            <div class="mod-hd">
              <h3>操作记录</h3>
            </div>
            <div class="mod-bd">
              <div class="table-responsive no-padding">
                <table class="table table-hover table-oversized">
                  <tbody>
                    <tr>
                      <th>操作类型</th>
                      <th>调整内容</th>
                      <th class="text-right">操作时间</th>
                    </tr>
                    <tr v-for="node in basicData.RecordDetail">
                      <td>{{node.OperateTypeDesc}}</td>
                      <td>{{node.Content}}</td>
                      <td class="text-right">{{node.OperateTime|formatDate}}</td>
                    </tr>
                  </tbody>
                </table>
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
          basicData: {
              Id:'',
              InstitutionName:'',
              ApplyTime:'',
              ExpirationDate:'',
              CreditLine:'',
              CreditTotal:'',
              ExposureLimit:'',
              FeedbackDate:'',
              TemporaryLinesExpirationDate:'',
              TemporaryLinesAdditionNumer:'',
              AvaliAmount:'',
              LoanBalance:'',
              Deposit:'',
              DepositBalance:'',
              RecordDetail:'',
              DealerId:'',
              DealerCode:'',
              DealerName:'',
              Name:'',
              Mobile:'',
          },
          SplitData:[,
          ],
          dialogContinue:false,
          updateDate:'',
          dialogChange:{
            isShow:false,
            amount:'',
            date:''
          },
          dialogCredit:{
            isShow:false,
            creditLine:'',
            exposureLimit:''
          },
          dialogDeposit:{
            isShow:false,
            Amount:''
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
                id:vm.$route.params.id,
                source:1
            },
            url: '/FinancialCredit/GetFinancialCreditDetail',
            callback: function(data) {
                vm.basicData = data.Data;
            }
          })
        },
        SaveContinue(){
          var vm = this;
          var date=formatDate(vm.updateDate,'yyyy-MM-dd');
          this.$api.resource({
            context: vm,
            type: 'post',
            data:{
                id:vm.$route.params.id,
                renewalDate:date
            },
            url: '/FinancialCredit/Renew',
            callback: function(data) {
              if (!data.Success && data.ErrorMessage) 
                vm.$message({ message: data.ErrorMessage, type: 'warning'});
              else{
                vm.dialogContinue=false;
                vm.$message({ 
                  message: "续签成功", 
                  type: 'info' ,
                  onClose:function(){                    
                    vm.init();
                  }
                  });
              }              
            }
          })
        },
        SaveAmount(){
          var vm = this;
          var data={
            id:vm.$route.params.id,
            addNum:vm.dialogChange.amount,
            expirationTime:formatDate(vm.dialogChange.date,'yyyy-MM-dd')
          };
          this.$api.resource({
            context: vm,
            type: 'post',
            data:data,
            url: '/FinancialCredit/AddTemporaryLinesition',
            callback: function(data) {
              if (!data.Success && data.ErrorMessage) 
                vm.$message({ message: data.ErrorMessage, type: 'warning'});
              else{
                vm.dialogChange.isShow=false;
                vm.$message({
                  message: "临时额度增加成功",
                  type: 'info' ,
                  onClose:function(){                    
                    vm.init();
                  }
                });
              }              
            }
          })
        },
        opendialogCredit(){
          var vm=this;
          vm.dialogCredit.isShow=true;
          vm.dialogCredit.creditLine=vm.basicData.CreditLine;
          vm.dialogCredit.exposureLimit=vm.basicData.ExposureLimit;
        },
        UpdateCredit(){
          var vm=this;
          vm.dialogCredit.id=vm.$route.params.id;
          this.$api.resource({
            context: vm,
            type: 'post',
            data:vm.dialogCredit,
            url: '/FinancialCredit/ChangeCreditLimit',
            callback: function(data) {
              if (!data.Success && data.ErrorMessage) 
                vm.$message({ message: data.ErrorMessage, type: 'warning'});
              else{
                vm.dialogCredit.isShow=false;
                vm.$message({ message: "额度变更成功", type: 'info' });
                vm.basicData.CreditLine=vm.dialogCredit.creditLine;
                vm.basicData.ExposureLimit=vm.dialogCredit.exposureLimit;
                vm.init();
              }              
            }
          })
        },
        UpdateDeposit(){
          var vm=this;
          vm.dialogDeposit.id=vm.$route.params.id;
          this.$api.resource({
            context: vm,
            type: 'post',
            data:vm.dialogDeposit,
            url: '/FinancialCredit/WithdrawalDeposit',
            callback: function(data) {
              if (!data.Success && data.ErrorMessage) 
                vm.$message({ message: data.ErrorMessage, type: 'warning'});
              else{
                vm.dialogDeposit.isShow=false;
                vm.$message({ message: "保证金提取成功", type: 'info' });
                vm.init();
              }              
            }
          })
        }
  },    
  mounted() {
      var vm = this;
      vm.init();
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
