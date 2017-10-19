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
      <span>新增</span>
    </li>
  </ol>
<div>
    <div class="mod">
      <div class="mod-hd">
        <h3>基本信息</h3>
      </div>
      <div class="mod-bd form-horizontal">
        <div class="form-group m0">
          <div class="col-lg-6">
            <div class="form-group">
              <div class="col-lg-4 control-label">金融机构：</div>
              <div class="col-lg-8">
                <el-select v-model="form.InsCode" placeholder="请选择" :clearable="true" style="width:100%">
                  <el-option
                  v-for="(item, index) in Institutions"
                  :key="index"                  
                  :label="item.InstitutionName"
                  :value="item.InstitutionCode">
                  </el-option>
                </el-select>
              </div>
            </div>
          </div>
          <div class="col-lg-6">
            <div class="form-group">
              <div class="col-lg-4 control-label">金融产品：</div>
              <div class="col-lg-8">
                <el-select v-model="Fproduct" value-key="FProductCode" placeholder="请选择" :clearable="true" style="width:100%">
                  <el-option
                    v-for="(item, index) in FProducts"
                    :key="index"
                    :label="item.FProductName"
                    :value="item">
                  </el-option>
                </el-select>
               </div>
            </div>
          </div>
        </div>
        <table class="table table-oversized">
          <tbody><tr>
            <th width="20%">拆分额度：</th>
            <td width="30%">{{FpInfo.Amount|toThousands}}元</td>
            <th width="20%">可用额度：</th>
            <td width="30%">{{FpInfo.AvailAmount|toThousands}}元</td>
          </tr>
          <tr>
            <th>贷款余额：</th>
            <td>{{FpInfo.LoanBalance|toThousands}}元</td>
            <th>保证金：</th>
            <td>{{FpInfo.MarginAmount|toThousands}}元</td>
          </tr>
          <tr>
            <th>保证金余额：</th>
            <td colspan="3">{{FpInfo.MarginBalance|toThousands}}元</td>
          </tr>
        </tbody></table>
      </div>
    </div>
    <div class="mod" v-if="!Fproduct||(Fproduct.FProductType<3)">
      <div class="mod-hd">
        <h3>采购信息</h3>
      </div>
      <div class="mod-bd form-horizontal">
        <div class="form-group m0">
          <div class="col-lg-6">
            <div class="form-group">
              <div class="col-lg-4 control-label">质押车辆类型：</div>
              <div class="col-lg-8">
                <el-select v-model="form.VehicleType" :disabled="carTypeDisabl" placeholder="请选择" :clearable="true" style="width:100%">
                  <el-option
                    v-for="(item, index) in CarTypeList"
                    :key="index"
                    :label="item.Name"
                    :value="item.Id">
                  </el-option>
                </el-select>
              </div>
            </div>
            <div class="form-group">
              <div class="col-lg-4 control-label">采购项目编号：</div>
              <div class="col-lg-8">
                <input class="form-control" v-model="form.ProjectCode" disabled="disabled" type="text">
              </div>
            </div>
            <div class="form-group">
              <div class="col-lg-4 control-label">采购合同编号：</div>
              <div class="col-lg-8">
                <input class="form-control" v-model="form.ProjectContractCode" disabled="disabled"  type="text">
              </div>
            </div>
          </div>
          <div class="col-lg-6">
            <div class="form-group">
              <div class="col-lg-4 control-label">采购订单编号：</div>
              <div class="col-lg-8">
                <input class="form-control" v-model="form.ProjectOrderCode" @click="openOrder" readonly="true" type="text">
                <el-dialog title="选择采购订单" :visible.sync="dialogTableVisible" size="large">
                  <div  class="col-lg-12">
                    <div class="col-lg-1 control-label">订单类型：</div>
                    <div class="col-lg-3">                      
                      <el-select v-model="orderForm.OrderType" placeholder="请选择" :clearable="true" style="width:100%">
                        <el-option
                          v-for="(item, index) in orderType"
                          :key="index"
                          :label="item.Name"
                          :value="item.Id">
                        </el-option>
                      </el-select>
                    </div>

                    <div class="col-lg-1 control-label">供应商：</div>
                    <div class="col-lg-3">
                      <el-input v-model="orderForm.Supplier"></el-input>
                    </div>

                    <div class="col-lg-1 control-label">采购项目：</div>
                    <div class="col-lg-3" ><el-input  v-model="orderForm.Project"></el-input></div>
                  </div>

				          <div class="col-lg-12 mt10 mb10">
                    <div class="col-lg-1 control-label">负责人：</div>
                    <div class="col-lg-3">                      
                      <el-input v-model="orderForm.ChargeMan"></el-input>
                    </div>
                    <div class="col-lg-1 control-label"></div>
                    <div class="col-lg-3">                     
                    </div>
                    <div class="col-lg-1 control-label"></div>
                    <div class="col-lg-3">
                      <el-button type="primary" @click="queryOrder" icon="search" class="btn-primary">查询</el-button>
                    </div>
                  </div>
                  <br/>
                  <br/>
                  <br/>
                  <el-table :data="gridOrder" @row-dblclick="selectOrderRow">
                    <el-table-column property="ProjectOrderCode" label="采购订单" ></el-table-column>
                    <el-table-column property="SupplierName" label="供应商"></el-table-column>
                    <el-table-column property="OrderType" label="订单类型"></el-table-column>
                    <el-table-column property="ChargeMan" label="负责人"></el-table-column>
                    <el-table-column property="ProjectName" label="所属采购项目"></el-table-column>
                    <el-table-column property="OrderCreateTime" label="创建时间"></el-table-column>
                    <el-table-column   label="操作"  width="100">
                      <template scope="scope">
                        <el-button @click="selectOrderRow(scope.row)" type="text" size="small">选择</el-button>
                      </template>
                    </el-table-column>
                  </el-table>
                  <div class="mod-ft text-center">
                    <el-pagination v-show="orderPageTotal/ 10 > 1"
                      layout="prev, pager, next"
                      @current-change="queryOrder"
                      :current-page.sync="orderForm.Page"
                      :total="orderPageTotal">
                    </el-pagination>
                  </div>
                </el-dialog>
              </div>
            </div>
            <div class="form-group">
              <div class="col-lg-4 control-label">采购项目名称：</div>
              <div class="col-lg-8">
                <input class="form-control" disabled="disabled" v-model="form.ProjectName" type="text">
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="mod">
      <div class="mod-hd">
        <h3>车辆信息</h3>
      </div>
      <div class="mod-bd">
        <div class="table-responsive no-padding">         
          <table class="table table-hover table-oversized">
            <tbody>
              <tr>
                <th>车辆信息</th>
                <th class="text-right">厂商指导价格（元/台）</th>
                <th class="text-right">车俩采购价格（元/台）</th>
                <th v-if="form.VehicleType!=1" class="text-right">二手车估值（元/台）</th>
                <th class="text-right">监管数量（台）</th>
                <th class="text-right">总计（元）</th>
                <th class="text-right">操作</th>
              </tr>
              <tr v-for="(node,$index) in carDetail">
                <td>{{node.MasterBrandName +" "+ node.SerialName+" "+node.ModelYear+" "+node.CarName+" "+node.CarColor+"/"+node.InnerColor+" "}}
                  <span v-if="form.VehicleType==2">上牌时间:{{node.UsedCarLicensingDate}}  行驶里程:{{node.UsedCarMileage}}公里  {{node.UsedCarStatusText}}</span></td>
                <td class="text-right"> 
                  <div class="mr10">{{node.ReferPrice|toThousands}}</div>
                </td>
                <td class="text-right"> 
                  <div class="mr10">{{node.PurchasePrice|toThousands}}</div>
                </td>
                <td v-if="form.VehicleType!=1" class="text-right"> 
                  <div class="mr10">{{node.Assess|toThousands}}</div>
                </td>
                <td class="text-right"> 
                  <div class="mr10">{{node.Number}}</div>
                </td>
                <td class="text-right"> 
                  <div class="mr10">{{node.Number*node.PurchasePrice|toThousands}}</div>
                </td>
                <td class="text-right">
                  <a href="#" data-toggle="modal" @click="editNum(node,$index)">编辑</a>
                  <a href="#" data-toggle="modal" @click="removeCar($index)">删除</a></td>
              </tr>
            </tbody>
          </table>
          <el-dialog title="监管数量" :visible.sync="editNumDialog" size="tiny">
            <div class="form-horizontal">
              <div class="form-group">
                <label class="col-sm-2 control-label text-left">车辆信息：</label>
                <div class="col-sm-10">{{carInfo.MasterBrandName +" "+ carInfo.SerialName+" "+carInfo.ModelYear+" "+carInfo.CarName+"  "}}<span class="text-danger">{{carInfo.PurchasePrice|toThousands}}元</span></div>
              </div>
              <div class="form-group">
                <label class="col-sm-2 control-label text-left">监管台数：</label>
                <div class="col-sm-10">
                  <div class="input-group">
                    <input class="form-control" v-model="carInfo.Number" type="number">
                    <div class="input-group-addon">台</div>
                  </div>
                </div>
              </div>
            </div>
            <div class="modal-footer">
              <button class="btn btn-default" @click="editNumDialog=false">取消</button>
              <button class="btn btn-primary" @click="replaceNum">确定</button>
            </div>
          </el-dialog>
        </div>
        <div v-if="!Fproduct||(Fproduct.FProductType==3)" class="add-car-btn mb20">
          <el-button @click="openCar" icon="plus">添加</el-button></div>
          <el-dialog title="添加车辆" :visible.sync="dialogCarVisible" size="large">
           <div class="form-horizontal">
              <div class="form-group m0">
                <div class="col-lg-4 ">
                  <div class="form-group">
                    <div class="col-lg-4 control-label">品牌：</div>
                    <div class="col-lg-8">
                      <car-selector  :carValue.sync="car" />  
                    </div>
                  </div>
                </div>
                <div class="col-lg-4">  
                  <div class="form-group">
                    <div class="col-lg-4 control-label">质押车辆类型：</div>
                    <div class="col-lg-8">
                      <el-select v-model="form.VehicleType" placeholder="请选择"  :clearable="true" style="width:100%">
                        <el-option
                          v-for="(item, index) in CarTypeList"
                          :key="index"
                          :label="item.Name"
                          :value="item.Id">
                        </el-option>
                      </el-select>
                    </div>
                  </div>                
                </div>
                <div class="col-lg-4">   
                  <button class="btn btn-primary" @click="openCar">查询</button>              
                </div>
              </div>
            </div>
            <div>
                <el-table :data="queryCarList"  @selection-change="handleSelectionChange">
                  <el-table-column  type="selection" property="Selected" > </el-table-column>
                  <el-table-column property="VinCode" label="VIN码" ></el-table-column>
                  <el-table-column :formatter="formatName"  label="品牌／车型／车款"></el-table-column>
                  <el-table-column v-if="form.VehicleType==2" property="UsedCarLicensingDate" label="上牌时间"></el-table-column>
                  <el-table-column v-if="form.VehicleType==2" property="UsedCarMileage" label="行驶里程(公里)"></el-table-column>
                  <el-table-column v-if="form.VehicleType==2" property="UsedCarStatusText" label="是否整备"></el-table-column>
                  <el-table-column :formatter="formatColor" label="外观／内饰"></el-table-column>
                  <el-table-column property="CarSourceTypeName" label="车源类型"></el-table-column>
                  <el-table-column  :formatter="formatStatus" label="车辆状态"></el-table-column>
                  <el-table-column property="ProcurementInstockDays" label="车采购入库时间(天)"></el-table-column>
                  <el-table-column property="CurrentStorageName" label="当前所在仓库"></el-table-column>                  
                </el-table>
            </div>
            <div class="mod-ft text-center">
                    <el-pagination v-show="selCarForm.total/ 10 > 1"
                      layout="prev, pager, next"
                      @current-change="openCar"
                      :current-page.sync="selCarForm.Page"
                      :total="selCarForm.total">
                    </el-pagination>
                  </div>
            <div class="mod-fr text-right">
              <button class="btn btn-default" @click="dialogCarVisible=false">取消</button>
              <button class="btn btn-primary" @click="selectedCars">保存</button>
            </div>
          </el-dialog>
      </div>
      <div class="mod-fr border-top text-right">
        <button v-if="false" class="btn btn-default" @click="refresh" data-dismiss="modal">取消</button>
        <button class="btn btn-primary" @click="save">保存</button>
      </div>
    </div>
  </div>
</app-layout>
</template>

<script>
import CitySelector from './widget/CitySelector';
import CarSelector from './widget/CarSelector';
import {toThousands} from '../api/toThousands.js' ;
import {formatDate} from '../api/date.js' ;
export default {
  name: 'hello',
  data () {
    return {
      gridOrder: [],
      queryCarList:[],
      selCarForm:{
        Page:1,
        PageSize:10,
        VehicleType:1,
        MasterBrandID:'',
        SerialID:'',
        CarID:'',
        total:0
      },
      Institutions:[],
      FProducts:[],
      dialogTableVisible:false,
      dialogCarVisible:false,
      carDetail:[],
      form:{
        InsCode:'',
        FinProductCode:'',
        VehicleType:'',
        ProjectOrderCode:null,
        Type:1,
        CarList:[],
        Code:'',
        DealrCode:'',
        action:1,
        Source:1
      },
      orderForm:{
        OrderType:'',
        Page:1,
        PageSize:10,
        Supplier:'',
        Project:'',
        ChargeMan:'',
      },
      orderPageTotal:0,
      Fproduct:{
        FProductCode:'',
        FProductName:'',
        FProductType:1
      },
      FpInfo:{
      },
      CarTypeList:[
        {Id:1,Name:'新车'},
        {Id:2,Name:'二手车'}
      ],
      orderType:[
        {Id:1,Name:'直接采购'},
        {Id:2,Name:'已销定采'}
      ],
      editNumDialog:false,
      carInfo:{
        CarName:'',
      },
      car:{
        CarId:''
      },
      carTypeDisabl:false
    }
  },
  methods:{
      formatColor(row,col){
        return row.AppearanceColor+"/"+row.InnerColor;
      },
      formatName(row,col){
        return row.MasterBrandName+"/"+row.SerialName+"/"+row.CarName;
      },
      refresh(){
        window.location.reload();
      },
      formatStatus(row,col){
        var status='';
        if(row.CarSourceStatus==1)
          status="可售";
        else if(row.CarSourceStatus==2)
          status="预锁车";
        else if(row.CarSourceStatus==3)
          status="预定";
        else if(row.CarSourceStatus==4)
          status="售出";
        else if(row.CarSourceStatus==5)
          status="交车";
        return status;
      },
      save(){
        var vm =this;
        for(var i=0;i<vm.carDetail.length;i++){
          vm.carDetail[i].Vins.splice(vm.carDetail[i].Number-1,vm.carDetail[i].Vins.length-vm.carDetail[i].Number);
        }       
        vm.form.CarList=vm.carDetail;
        vm.form.FinProductCode=vm.Fproduct.FProductCode;
        this.$api.resource({
        context: vm,
        type: 'post',
        url: '/Loan/SaveLoan',
        data:vm.form,
        callback: function (data) {
          if (!data.Success && data.ErrorMessage) {
              vm.$message({
              message: data.ErrorMessage,
              type: 'warning'
              })
              return false;
          }  
          vm.$message({
            message: "添加成功!",
            type: 'warning',
            onClose:function(){
              vm.$router.push('/loan/index?page=1');
            }
          });
        }
      })
      },
    editNum(row,i){
      var vm=this;
      vm.editNumDialog=true;
      vm.carInfo=row;
      vm.carListIndex=i;
    },
    replaceNum(){
      var vm=this;
      if(vm.carInfo.Number>vm.carInfo.MaxNumber){
        vm.$message({
          message: "质押数量不能大于总数量。",
          type: 'warning'
          });
        return false
      }
      vm.carDetail.splice(vm.carListIndex, 1, vm.carInfo);
      vm.editNumDialog=false;
    },
    removeCar(i){
      var vm=this;
      vm.carDetail.splice(i, 1);
    },
    openOrder(){
      var vm=this;
      if(!vm.form.VehicleType){
        vm.$message({
          message: "请先选择质押车辆类型",
          type: 'warning'
          });
        return false
      }
      vm.dialogTableVisible=true;
      if(!vm.orderForm.OrderType)
        vm.orderForm.OrderType=1;
      vm.queryOrder();
    },
    openCar(){
      var vm=this;
      if(!vm.form.VehicleType){
        vm.form.VehicleType=1;
      }
      vm.dialogCarVisible=true;
      vm.selCarForm.VehicleType=vm.form.VehicleType;
      if(vm.car){
        if(vm.car.masterBrand)
          vm.selCarForm.MasterBrandID=vm.car.masterBrand.id;
        else
          vm.selCarForm.MasterBrandID=0;
        if(vm.car.serial)
          vm.selCarForm.SerialID=vm.car.serial.id;
        else
          vm.selCarForm.SerialID=0;
        if(vm.car.basic)
          vm.selCarForm.CarID=vm.car.basic.id;
        else
          vm.selCarForm.CarID=0;
      }
      this.$api.resource({
        context: vm,
        type: 'post',
        data:vm.selCarForm,
        url: '/Loan/GetCarList',
        callback: function (data) {
          if (!data.Success && data.ErrorMessage) {
              vm.$message({
              message: data.ErrorMessage,
              type: 'warning'
              })
              return false
          } 
          vm.queryCarList = data.Data.PageData;
          vm.selCarForm.total=data.Data.TotalCount;
        }
      })
    },
    selectedCars(){
      var vm=this;
      vm.dialogCarVisible=false;
      for(var i=0;i<vm.carDetailCopy.length;i++){
        var node=vm.carDetailCopy[i];
       
        for(var j=0;j<vm.carDetail.length;j++){
          var vins=[];
          for(var n=0;n<vm.carDetail.length;n++){
            vins=vins.concat(vm.carDetail[n].Vins);
          }
          if($.inArray(node.VinCode,vins)>-1) continue;
          var y=vm.carDetail[j];
          if(node.GuidancePrice==y.ReferPrice&&node.CarId==y.CarId&&node.InnerColor==y.InnerColor&&node.CarColor==y.AppearanceColor&&vm.form.VehicleType==1){
            if($.inArray(node.VinCode,vins)==-1){
              debugger
              vm.carDetail[j].Vins.push(node.VinCode);
              vm.carDetail[j].Number=vm.carDetail[j].Number+1;
            }
          }
          else if(node.GuidancePrice==y.ReferPrice&&node.CarId==y.CarId&&node.InnerColor==y.InnerColor&&node.CarColor==y.AppearanceColor&&vm.form.VehicleType==2 &&node.UsedCarLicensingDate==y.UsedCarLicensingDate &&node.UsedCarMileage==y.UsedCarMileage &&node.UsedCarStatusText==y.UsedCarStatusText){
            if($.inArray(node.VinCode,vins)==-1){
              debugger
              vm.carDetail[j].Vins.push(node.VinCode);
            vm.carDetail[j].Number=vm.carDetail[j].Number+1;
            }
          }
          else{
            vm.carDetail.push({
              Number:1,
              Assess:0,
              PurchasePrice:node.ProcurementPrice,
              ReferPrice:node.GuidancePrice,
              CarColor:node.AppearanceColor,
              CarColorId:node.AppearanceColorId,
              ModelYear:node.Year,
              InnerColor:node.InnerColor,
              InnerColorId:node.InnerColorId,
              CarName:node.CarName,
              CarId:node.CarId,
              SerialName:node.SerialName,
              BrandName:node.BrandName,
              MasterBrandName:node.MasterBrandName,
              UsedCarStatusText:node.UsedCarStatusText,
              UsedCarMileage:node.UsedCarMileage,
              UsedCarLicensingDate:node.UsedCarLicensingDate,
              Vins:[node.VinCode]
            });
          }
        }
        if(vm.carDetail.length==0){
          vm.carDetail.push({
            Number:1,
            Assess:0,
            PurchasePrice:node.ProcurementPrice,
            ReferPrice:node.GuidancePrice,
            CarColor:node.AppearanceColor,
            CarColorId:node.AppearanceColorId,
            ModelYear:node.Year,
            InnerColor:node.InnerColor,
              InnerColorId:node.InnerColorId,
            CarName:node.CarName,
            CarId:node.CarId,
            SerialName:node.SerialName,
            BrandName:node.BrandName,
            MasterBrandName:node.MasterBrandName,
            UsedCarStatusText:node.UsedCarStatusText,
            UsedCarMileage:node.UsedCarMileage,
            UsedCarLicensingDate:node.UsedCarLicensingDate,
            Vins:[node.VinCode]
          });
        }
      }
    },
    handleSelectionChange(val){
      var vm=this;
      vm.carDetailCopy=val;
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
    queryOrder(){
     var vm = this;
     vm.orderForm.VehicleType=vm.form.VehicleType;
      this.$api.resource({
        context: vm,
        type: 'Post',
        url: '/Loan/GetOrderList',
        data:vm.orderForm,
        callback: function (data) {
          if (!data.Success && data.ErrorMessage) {
              vm.$message({
              message: data.ErrorMessage,
              type: 'warning'
              })
              return false
          }  
          vm.gridOrder=data.Data.PageData;
          for(var i=0;i<vm.gridOrder.length;i++){
            vm.gridOrder[i].OrderType =vm.gridOrder[i].OrderType==1?"直接采购":"已销定采";
            let date = new Date(vm.gridOrder[i].OrderCreateTime);
            vm.gridOrder[i].OrderCreateTime=formatDate(date,"yyyy-MM-dd");
          }
          vm.orderPageTotal=data.Data.TotalCount;
        }
      });
    },
    selectOrderRow(row){     
      var vm = this;
      vm.dialogTableVisible=false;
      vm.form.ProjectOrderId=row.ProjectOrderCode;
      vm.form.ProjectCode=row.ProjectCode;
      vm.form.ProjectOrderCode=row.ProjectOrderCode;
      vm.form.ProjectContractCode=row.ProjectContractCode;
      vm.form.ProjectName=row.ProjectName;
    }
  },
  mounted () {
    var vm=this;
    vm.getInstitutions();
  },
  watch:{
    ProjectOrderCode(newData,oldData){
      if(!newData||newData==oldData)
        return false;
      var vm = this
      this.$api.resource({
        context: vm,
        type: 'post',
        url: '/Loan/GetOrderDetail',
        data:{
          code:newData
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
            data.Data[i].MaxNumber=data.Data[i].Number;
          }
          vm.carDetail = data.Data;
        }
      });
    },
    InsCode(newData,oldData){
      if(!newData||newData==oldData)
        return false;
      var vm = this
      this.$api.resource({
        context: vm,
        type: 'get',
        url: '/FinancialProducts/GetFProductByICode',
        data:{
          iCode:newData
        },
        callback: function (data) {
          if (!data.Success && data.ErrorMessage) {
              vm.$message({
              message: data.ErrorMessage,
              type: 'warning'
              })
              return false
          } 
          vm.FProducts = data.Data;
          vm.Fproduct=null;
        }
      });
    },
    FProductCode(newData,oldData){
      if(!newData||newData==oldData)
        return false;
      var vm = this;
      vm.form.VehicleType="";
      vm.form.ProjectCode="";
      vm.form.ProjectContractCode="";
      vm.form.ProjectOrderCode="";
      vm.form.ProjectName="";
      if(vm.Fproduct.VehicleType.length==1){
        vm.form.VehicleType=vm.Fproduct.VehicleType[0];
        vm.carTypeDisabl=true;
      }
      this.$api.resource({
        context: vm,
        type: 'get',
        url: '/FinancialCredit/GetSelfProductCreditInfo',
        data:{
          productCode:newData
        },
        callback: function (data) {
          if (!data.Success && data.ErrorMessage) {
              vm.$message({
              message: data.ErrorMessage,
              type: 'warning'
              })
              return false
          }  
          vm.FpInfo=data.Data;
          vm.carDetail=[];
        }
      });
    }
  },
  computed:{
    InsCode(){
      return this.form.InsCode
    },
    FProductCode(){
      if(!this.Fproduct)
        return false;
      return this.Fproduct.FProductCode
    },
    ProjectOrderCode(){
      return this.form.ProjectOrderCode
    }
  },
  components: {
    CitySelector,
    CarSelector
  },
  filters:{
      toThousands(num){
        return toThousands(num);
      }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>


// WEBPACK FOOTER //
// src/components/LoanAdd.vue?5ebdc99c