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
      <span>质押车辆</span>
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
          <td>{{basicData.RateText}} </td>
        </tr>
        <tr>
          <th>最晚还款日期：</th>
          <td>{{basicData.LastRepaymentDate|formatDate}}</td>
          <th>展期利率<span >（{{(basicData.ExtensionRateCalcMethod?basicData.ExtensionRateCalcMethod:"按日计息")+"/"+(basicData.ExtensionRateCalcType?basicData.ExtensionRateCalcType:"日息")}}）</span>：</th>
          <td>{{basicData.OverTimeRateText}} </td>
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
      <h3>车辆信息</h3>
    </div>
    <div class="mod-bd">
      <div class="mod-operation">
        <button class="btn btn-primary" @click="save" data-toggle="modal" data-target=".pledge-popup">质押</button>
        <div class="btn-group pull-right">
          <button :class="pledgeStatus==1?'btn btn-primary':'btn btn-default'" @click="pledgeStatus=1" type="button">未质押</button>
          <button :class="pledgeStatus==2?'btn btn-primary':'btn btn-default'" @click="pledgeStatus=2" type="button">已质押</button>
        </div>
      </div>
      <div v-for="(node,parentIndex) in carList" class="indent-info" name="carList">
        <div class="logistics-title"> <strong>{{node.SkuFullName +"   "}} <span v-if="basicData.CarType!='新车'">上牌时间:{{node.UsedCarLicensingDate}}  行驶里程:{{node.UsedCarMileage}}公里  {{node.UsedCarStatus}}</span> {{node.Num}}台</strong>
          <div class="pull-right"><span class="state"><span class="txt">已质押{{node.PledgeNum}}台，未质押{{node.Num-node.PledgeNum}}台</span><a class="switch" @click="showOrHide" href="javascript:void(0)"><i  class="fa fa-angle-down"> </i><span>{{showOrHideName}}</span></a></span></div>
        </div>
        <div class="logistics-main">
          <div class="table-responsive no-padding">
            <el-table ref="selTable" :data="node.CarsCopy" current-row-key="$index" @selection-change="handleSelectionChange">
              <el-table-column  type="selection"  width="50">
              </el-table-column>
              <el-table-column  prop="VinCode" label="VIN码"  >
              </el-table-column>
              <el-table-column v-if="basicData.CarType!='新车'"  label="车辆检测报告">
                <template scope="scope">
                  <span v-if="!scope.row.Belongings.length>0">
                    <el-button type="text" @click="openUpload(scope.row.VinCode)" size="small">上传</el-button>
                  </span>
                  <span v-else>
                    {{scope.row.Belongings.filter(item => item.FileType === 2)|arrToObj}}
                    <el-button type="text" :data-key="scope.row.Belongings.filter(item => item.FileType === 2)|arrToKey"  @click="downFile(scope.row.Belongings.filter(item => item.FileType === 2),scope.row.VinCode)"size="small">下载</el-button>
                    <el-button type="text"  @click="delFile(scope.row.Belongings.filter(item => item.FileType === 2))"   size="small">删除</el-button>
                  </span>
                </template>
              </el-table-column>
              <el-table-column v-if="basicData.CarType!='新车'" label="操作" width="100" >
                <template scope="scope">
                  <el-button type="text" @click="showPicManger(scope.row, scope.$index, parentIndex)" size="small">照片管理</el-button>
                </template>
              </el-table-column>
            </el-table>             
          </div>
        </div>
      </div>              
    </div>
  </div>
  <el-dialog  title="文件上传"  :visible.sync="upload.isShow"  size="tiny" @close="initialFileUploadData">
    <el-upload class="upload-demo" 
      ref="upload" :data="upload"
      :action="uploadUrl"
      :on-change="handleFileChange"
      :on-remove="handleFileRemove"
      :on-success="handleFileSuccess"
      :with-credentials="true"
      :auto-upload="false">
      <el-button slot="trigger" size="small" type="primary" v-show="canUpload">选取文件</el-button>
      <el-button size="small" type="primary" :disabled="true" v-show="!canUpload">选取文件</el-button>
      <div slot="tip" class="el-upload__tip">文件大小不超过5M</div>
    </el-upload>
    <span slot="footer" class="dialog-footer">
      <el-button @click="resetUploadDialog">取消</el-button>
      <el-button type="primary" @click="submitUploadDialog">确定</el-button>
    </span>
  </el-dialog>
</div>
<!-- 图片管理  -->
  <el-dialog
    title="图片管理"
    :visible.sync="dialogPicManagement">
    <el-tabs v-model="pic.tabActiveName">
      <el-tab-pane label="车辆照片" name="pic">
        <el-carousel indicator-position="outside">
          <el-carousel-item v-for="(item, index) in picFileList" :key="index">
            <img :src="item.url" alt="">
          </el-carousel-item>
        </el-carousel>
      </el-tab-pane>
      <el-tab-pane label="上传照片" name="upload">
        <el-upload
          class="upload-demo"
          :action="uploadUrl"
          :data="pic.data"
          list-type="picture-card"
          :file-list="picFileList.filter(item => item.FileSource === 2)"
          :on-remove="handlePicRemove"
          :on-success="handlePicSuccess"
          :multiple="true"
          >
          <i class="el-icon-plus"></i>
        </el-upload>
        <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
      </el-tab-pane>
    </el-tabs>
  </el-dialog>
  <!-- 质押车辆 -->
  <el-dialog title="质押车辆"  :visible.sync="diapledged">
    <div class="modal-body">
        <form class="form-horizontal">
          <div class="form-group">
            <label class="col-sm-3 text-right">车辆信息：</label>
            <div class="col-sm-9">
              <span v-for="(node ,index) in $refs.selTable" class="btn-block mb10">
                {{carList[index].SkuFullName +"   "}} <span v-if="basicData.CarType!='新车'">上牌时间:{{carList[index].UsedCarLicensingDate}}  
                  行驶里程:{{carList[index].UsedCarMileage}}公里  {{carList[index].UsedCarStatus}}</span> {{node.selection.length}}台
                </span>
            </div>
          </div>
          <div class="form-group">
            <label class="col-sm-3 control-label">质押时间：</label>
            <div class="col-sm-9">
              <el-date-picker style="width: 100%;" format="yyyy-MM-dd"
                type="date" v-model="creatDate"
                placeholder="选择日期">
              </el-date-picker>
            </div>
          </div>
        </form>
      </div>
      <div class="modal-footer">
        <button class="btn btn-default" @click="diapledged=false" data-dismiss="modal">取消</button>
        <button class="btn btn-primary" @click="submitdata">质押 </button>
      </div>
    </div>
  </el-dialog>
</app-layout>
</template>
<script>
import {formatDate} from '../api/date.js' 
import {toThousands} from '../api/toThousands.js' 
export default {
  data () {
    return {
      dialogPicManagement:false,
      showOrHideName:'展开',
      basicData:{},
      carList:[],
      carListCopy:'',
      pledgeStatus:1,
      uploadUrl: this.$api.url + '/Car/PostFile',
      pic: {
        parent: '',
        sub: '',
        data: {
          loanid: this.$route.params.id,
          vin: '',
          fileType: 1
        },
        tabActiveName: 'pic',
        list: []
      },
      form:{
        LoanCode:''
      },
      upload:{
        vin:'',
        filetype:'',
        loanId:'',
        isShow:false
      },
      fileList:[],
      downloadUrl: this.$api.url + '/Car/DownFile',
      uploadUrl: this.$api.url + '/Car/PostFile',
      canUpload:true,
      diapledged:false,
      creatDate:'',
    }
  },
  methods: {
    submitdata(){
      var vm=this;
      var form={
        LoanId:vm.$route.params.id,
        Date:formatDate(vm.creatDate,"yyyy-MM-dd"),
        Cars:[]
      }
      for(var i=0;i<vm.$refs.selTable.length;i++){
        var node=vm.$refs.selTable[i];
        for(var j=0;j<node.selection.length;j++){
          var temp=node.selection[j];
          form.Cars.push(temp);
        }
        
      }
      this.$api.resource({
        context: vm,
        type: 'post',
        url: '/Car/BatchPledge',
        data:form,
        callback: function (data) {
         if (!data.Success && data.ErrorMessage) {
              vm.$message({
              message: data.ErrorMessage,
              type: 'warning',
              onClose:function(){
                vm.diapledged=false;
              }
              });
              return false;
          }
          else{
             vm.$message({
              message: "质押成功。",
              type: 'info',
              onClose:function(){    
                vm.diapledged=false;            
                vm.$router.push('/loan/detail/' + vm.$route.params.code)
              }
              });
          }
        }        
      });
    },
    save(){
      var vm=this;      
      vm.diapledged=true;      
    },
    showOrHide(){
      var vm=this;
      var _el=$(event.currentTarget); 
      var css= _el.parents("[name='carList']").prop("class");
      if(css.indexOf("active")>-1){
        _el.parents("[name='carList']").prop("class","indent-info");
        vm.showOrHideName="展开";
      }else{
        _el.parents("[name='carList']").prop("class","indent-info active");
        vm.showOrHideName="收起";
      }
    },
    // 图片管理
    showPicManger (car, subIndex, parentIndex) {
      if (!car.Belongings.filter(item => item.FileType === 2).length) {
        this.pic.tabActiveName = 'upload'
      } else {
        this.pic.tabActiveName = 'pic'
      }
      this.pic.parent = parentIndex
      this.pic.sub = subIndex
      this.dialogPicManagement = true
      this.pic.data.vin = car.VinCode
      this.pic.list = car.Belongings
    },
    handlePicSuccess (res, file, fileList) {
      this.pic.list.push({
        Key: res.Data,
        Type: 2,
        FileSource: 2
      })
    },
    handlePicRemove (file, fileList) {
      var vm = this
      this.$api.resource({
        type: 'post',
        url: '/Car/RemoveCarFile',
        data: {
          key: file.Key,
          LoanId: this.$route.query.id
        },
        callback: function (data) {
          if (!data.Success && data.ErrorMessage) {
            vm.$message({
              message: data.ErrorMessage,
              type: 'error'
            })
            return false
          }
          vm.pic.list.splice(_.findIndex(vm.pic.list, {Key: file.Key}), 1)
        }
      })
    },
    handleFileChange (file, fileList) {
      this.detectFileData.file = file.raw
      this.canUpload = false
    },
    handleFileRemove (file, fileList) {
      this.canUpload = true
    },
    handleFileSuccess (response, file, fileList) {
      var vm = this
      if (!file.response.Data) {
        this.$message({
          message: file.response.ErrorMessage,
          type: 'error',
          duration: 1000,
          onClose: function () {
            vm.canUpload = true
          }
        })
      } else {
        window.location.reload()
        this.dialogUpload = false
      }
      this.canUpload = true
      this.$refs.upload.clearFiles()
    },
    submitUploadDialog () {
      this.canUpload = true
      this.$refs.upload.submit()
    },
    downFile(arr,vin){
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
      var  key="";
      if(arr.length>0)
        key=arr[0].Key;
      window.open(vm.$api.url+ "/Car/DownFile?fileKey="+key+"&vin="+vin);
    },
    uploadFile(){

    },
    delFile(arr){
      var vm=this;
      var  key="";
      if(arr.length>0)
        key=arr[0].Key;
      var _el=$(event.currentTarget); 
      this.$api.resource({
        context: vm,
        type: 'post',
        url: '/Car/RemoveCarFile',
        data:{
          LoanId:vm.$route.params.id,
          key:key
        },
        callback: function (data) {
         if (!data.Success && data.ErrorMessage) {
              vm.$message({
              message: data.ErrorMessage,
              type: 'warning'
              })
              return false
          }
          _el.parent().remove();
        }        
      });
    },
    handleSelectionChange(val,row){
      this.carListCopy=val;
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
        url: '/Car/GetCar',
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
          for(var i=0;i<data.Data.length;i++){
            data.Data[i].CarsCopy=vm.getCars(data.Data[i].Cars);
          }
          vm.carList=data.Data;
        }        
      });
    },
    getCars(data){
      var vm =this;
      var cars=[];
      for(var i=0;i<data.length;i++){
        if(data[i].PledgeStatus==vm.pledgeStatus){
          cars.push(data[i]);
        }
      }
      return cars;
    },
    getImg(row){
      var arr=row.Belongings;
      if(arr.length==0)
        return "";
      for(var i=0;i<arr.length;i++){
        if(arr[i].FileType==1){
          var node1={Name:arr[i].Name,Key:arr[i].Key};
          return node1;
        }
      }
      return "";
    },
    getImg1(row){
      var arr=row.Belongings;
      if(arr.length==0)
        return "";
      for(var i=0;i<arr.length;i++){
        if(arr[i].FileType==1){
          var node1={Name:arr[i].Name,Key:arr[i].Key};
          return node1;
        }
      }
      return "";
    },
    openUpload(vin){
      var vm=this;
      vm.upload.isShow=true;
      vm.upload.vin=vin;
      vm.upload.loanId=vm.basicData.Id;
      vm.upload.filetype=1;
    },
    initialFileUploadData () {
      this.dialogUpload = false
      this.canUpload = true
      this.$refs.upload.clearFiles()
    },
    handleFileChange (file, fileList) {
      this.canUpload = false
    },
    handleFileSuccess (response, file, fileList) {
      var vm = this
      if (!file.response.Data) {
        this.$message({
          message: file.response.ErrorMessage,
          type: 'error',
          duration: 1000,
          onClose: function () {
            vm.canUpload = true
          }
        })
      } else {
        this.form.DealerCreditMaterialInput.push({
          CreditConfigId: this.tplId,
          FileName: file.name,
          FileKey: file.response.Data
        })
        this.dialogUpload = false
      }
      this.canUpload = true
      this.$refs.upload.clearFiles()
    },
    handleFileRemove (file, fileList) {
      this.canUpload = true
    },
    submitUploadDialog () {
      this.canUpload = true
      this.$refs.upload.submit()
    },
    resetUploadDialog () {
      this.upload.isShow = false
    }
  },
  watch:{
    pledgeStatus(newData,oldData){
      if(!newData||newData==oldData)
        return false;
      var vm=this;
      for(var i=0;i<vm.carList.length;i++){
        vm.carList[i].CarsCopy=vm.getCars(vm.carList[i].Cars);
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
      filterObj(arr){
        var list=[];
        for(var i=0;i<arr.length;i++){
          if(arr[i].pledgeStatus==pledgeStatus){
            list.push(arr[i])
          }          
        }
        return list;
      },
      toThousands(num){
          return toThousands(num);
      },
      arrToObj(arr){
        if(arr.length>0)
          return arr[0].Name;
        else
         return "";
      },
      arrToKey(arr){
        if(arr.length>0)
          return arr[0].Key;
        else
         return "";
      }
    },
  mounted () {
    var vm=this;
    vm.init();
   
  },
  computed: {
    picFileList () {
      var list=_.map(this.pic.list.filter(sub => sub.FileType !== 1), (item) => {
        return {
          vin: this.pic.data.vin,
          Key: item.Key,
          url: this.downloadUrl + '?fileKey=' + item.Key + '&vin=' + this.pic.data.vin,
          FileSource: item.FileSource
        }
      });
      return list;
    }
  },
  beforeMount () {
    this.form.LoanCode = this.$route.params.code;
  }
}

</script>

<style scoped>
</style>



// WEBPACK FOOTER //
// src/components/LoanPledgedCar.vue?83cdbd10