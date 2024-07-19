<template>
    <div class="container">
        <el-form ref="mainform"  :model="form" label-width="110px" :rules="formRules">
          <el-row :gutter="20">
             <el-col :span="13"> <h3>员工请假单</h3></el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="6">
                <el-form-item label="姓名:"  prop="name">
                  <el-input v-model="form.name"  placeholder="请输入姓名" ></el-input>
                </el-form-item>
            </el-col>
  
          </el-row>
          <el-row :gutter="20">
            <el-col :span="6">
                <el-form-item label="请假天数:" prop="leaveDays">
                    <el-input v-model="form.leaveDays" style="width: 90%;" placeholder="请输入请假天数"></el-input><span style="margin-left: 10px;">天</span>
                </el-form-item>
            </el-col>
             <el-col :span="6">
                <el-form-item label="请假模型:" prop="leaveType">
                  <el-select v-model="form.leaveType" placeholder="请选择请假模型">
                      <el-option
                          v-for="( item, index ) in leaveTypeList"
                          :key="index"
                          :label="item.name"
                          :value="item.modelKey"
                          >
                          <span style="float: left">{{ item.name }}</span>
                        </el-option>
                  </el-select>
                </el-form-item>
            </el-col>
          </el-row>
          
          <el-row :gutter="20">
              <el-col :span="12">
                  <el-form-item label="请假事由:"  prop="leaveDes">
                    <el-input type="textarea" v-model="form.leaveDes" placeholder="请输入请假事由"  :autosize="{ minRows: 4, maxRows: 4}" show-word-limit></el-input>
                  </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="13"><el-button type="primary"  @click="submitData()">提交请假</el-button></el-col>
            </el-row>
        </el-form>
    </div>
  </template>
  <script>
  import axios from 'axios'
  export default {
    name: "Leave",
    data() {
      return {
        leaveTypeList:[],
        type:'add',
        form: {
          name: '',
          leaveType:'',
          leaveDays:'',
          leaveDes:'',
          id:''
        },
        formRules: {
          name: [ {required: true, message: "请输入姓名", trigger: "blur"}],
          leaveType: [ {required: true, message: "请选择请假类型", trigger: "blur"}],
          leaveDays: [ {required: true, message: "请输入请假天数", trigger: "blur"}],
          leaveDes: [ {required: true, message: "请输入请假事由", trigger: "blur"}]
        }
      }
    },
  
    created() {
      this.init();
      let { type, name, reason, day, modelKey, id } = this.$route.query
      if(type == 'edit'){
        this.type = type;
        this.form.name = name;
        this.form.leaveType = modelKey;
        this.form.leaveDays = day;
        this.form.leaveDes = reason;
        this.form.id = id;
      }
    },
    methods: {
      init(){
        axios.get(`/flowable/definition/list?pageNum=1&pageSize=100&suspensionState=1`).then(res => {
              if(res && res.data && res.data.code == 200){
                  this.leaveTypeList = res.data.data.data;
                  return false;
              }
          })
          .then(err => {
              console.log(err)
          })
      },
      submitData(){
        this.$refs['mainform'].validate(valid => {
            if (valid) {
                let params = {
                  day: this.form.leaveDays,
                  name: this.form.name,
                  reason: this.form.leaveDes,
                  modelKey:this.form.leaveType,
                  id: this.form.id || '',
                }
                if(this.type == 'edit'){
                  axios.post(`/other/modifyForm`, params).then(res => {
                      if(res && res.data && res.data.code == 200){
                          this.$message({
                            type: 'success',
                            message: '修改请假流程成功'
                          });
                          // 页面调整
                          this.$router.push({ path:"/launch" })
                      }
                  }).then(err => {
                      console.log(err)
                  })
                }else {
                  axios.post(`/other/addForm`, params).then(res => {
                      if(res && res.data && res.data.code == 200){
                          this.$message({
                            type: 'success',
                            message: '提交请假流程成功'
                          });
                          // 页面调整
                          this.$router.push({ path:"/launch" })
                      }
                  }).then(err => {
                      console.log(err)
                  })
                }
                
            }
        })
      }
    }
  }
  </script>
  <style lang="less">
  
  </style>
  
  
  