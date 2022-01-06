<template>
  <div>
    <v-alert
        class="alert"
        type="success"
        text
        v-show="showSuccessDialog"
        transition="scroll-y-transition"
    >
      习题创建成功！
    </v-alert>
    <!-- alert -->
    <v-alert
        class="alert"
        type="warning"
        text
        v-show="showFailDialog"
        transition="scroll-y-transition"
    >
      {{ msg }}
    </v-alert>
    <v-container class="pl-16 pr-16">
      <v-toolbar color="deep-purple lighten-2" dark class="mt-10">
        <v-toolbar-title>题目信息</v-toolbar-title>
      </v-toolbar>
      <form class="pa-12 grey lighten-5 mt-8">
        <v-select
            :items="courseNameLists"
            v-model="courseName"
            label="所属课程"
            @change="setCourseId"
        ></v-select>
        <v-row>
          <v-col>
            <v-select
                :items="types"
                v-model="quesInfo.type"
                label="题目类型"
                @change="modeChange">
            </v-select>
          </v-col>
          <v-col>
            <v-select
                v-if="quesInfo.type =='单选'|| quesInfo.type=='多选'"
                :items="sNumber"
                v-model="tempNumber"
                label="选项数量"
                @change="initOption"
            >
            </v-select>
          </v-col>
        </v-row>

        <v-card class="pa-6" >
          <v-textarea
              v-model="tempContent"
              label="题干信息"
              placeholder=""
              clearable
          ></v-textarea>
          <div v-if="quesInfo.type =='单选'|| quesInfo.type=='多选'">
            <v-form id="select-card" v-for="op in option" :key="op.option">

              <v-text-field placeholder="请输入选项内容"
                            clearable
                            color="deep-purple"
                            v-bind:prefix="op.option"
                            :append-icon="op.isSelected?'mdi-checkbox-marked-circle':'mdi-checkbox-blank-circle-outline'"
                            @click:append="setSelected(op.option)"
                            v-model="op.content"
              >

              </v-text-field>
            </v-form>

          </div>

          <v-text-field
              clearable
              v-model="quesInfo.answer"
              label="答案"
              placeholder="请区分大小写"
              @change="fillAnswer"
          ></v-text-field>
          <v-textarea clearable v-model="quesInfo.analysis" label="题目解析"></v-textarea>
          <v-combobox
              v-model="labels"
              label="添加标签"
              multiple
              chips
              color="indigo"
          ></v-combobox>

        </v-card>

        <v-btn class="ml-0 mt-8 " color="indigo" outlined @click="submit">
          确认
        </v-btn>

      </form>


    </v-container>

    <!-- 提示对话框 -->
    <v-dialog v-model="dialog" width="500">
      <v-card>
        <v-card-title> </v-card-title>

        <v-card-text>
          专题创建成功。
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" text @click="dialog = false">
            确认
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>

</template>

<script>
import { getTeacherCourses} from "@/api/course";
import {createQuestion} from "@/api/question";
import Vue from "vue";

export default Vue.extend({
  name: "QuestionCreate",//创建问题页面
  data() {
    return {
      quesInfo: {
        type: null,
        content:null,
        analysis: null,
        courseId: null,
        answer:null,
        teacherId:null,
      },
      optStr:"ABCDEFGHIJKLMN",
      tempContent:null,
      courseName:this.$route.query.courseName.length>0? this.$route.query.courseName:null,
      types: ["单选", "多选","填空"],
      sNumber:[3,4,5,6,7],
      tempNumber:null,
      option:[],
      courseNameLists:[],
      courseList:[],
      dialog: false,
      showSuccessDialog: false,
      showFailDialog: false,
      msg: "",
      isSelected:false,
      labels:["必考","软件工程","期末","单元测试",]
    };
  },
  mounted() {
    const uid = window.localStorage.getItem("userId");
    if (uid) {
      getTeacherCourses(uid).then(res => {
        //console.log(res); 按教师ID获取教师的课程，便于按课程添加页面
        for(var i=0;i<res.length;i++){
          console.log(res[i])
          this.courseNameLists.push(res[i].name);
          this.courseList.push({"name":res[i].name,"id":res[i].id})
        }
      });
    }

  },
  methods:{
    fillAnswer(){
      if(this.quesInfo.type==="单选" && this.quesInfo.answer.length>1) {
        this.showFailDialog = true;
        this.msg = "单选题答案选项不能超过一个";
        setTimeout(() => {
          this.showFailDialog = false;
        }, 1000);
        return;
      }else if(this.quesInfo.type==="多选" && this.quesInfo.answer.length===1){
        this.showFailDialog = true;
        this.msg = "多选题答案选项仅设置了一个";
        setTimeout(() => {
          this.showFailDialog = false;
        }, 1000);
        return;
      }
      var str = this.quesInfo.answer;
      for(let i = 0; i < this.tempNumber; i++){
        if(str.indexOf(this.option[i].option)!==-1){
          console.log("yes")
          this.option[i].isSelected=true;
        }else{
          console.log("no")
          this.option[i].isSelected=false;
        }
      }
    },
    modeChange(){
      if(this.quesInfo.type==='单选'){
        this.quesInfo.answer="";
        for(let i = 0; i < this.tempNumber ;i++){
          this.option[i].isSelected=false;
        }
      }
    },
    initOption(){

      this.option=[];
      for(let i=0;i<this.tempNumber;i++){
        this.option.push({"option":this.optStr[i],"content":"","isSelected":false})
      }
      console.log(this.option)
    },
    setSelected(option){
      console.log(option)
      this.quesInfo.answer="";
      if(this.quesInfo.type==="单选"){
        for(let i = 0; i < this.tempNumber; i++){
          if(this.option[i].option === option){
            if(this.option[i].isSelected===false){
              this.option[i].isSelected=true;
            }else{
              this.option[i].isSelected=false;
            }
          }
          else{
            if(this.option[i].isSelected===true){
              this.option[i].isSelected=false;
            }
          }
        }
        this.quesInfo.answer=option;
      }else{
        for(let i = 0; i < this.tempNumber; i++){
          if(this.option[i].option === option){
            this.option[i].isSelected=!this.option[i].isSelected;
          }
          if(this.option[i].isSelected===true){
            this.quesInfo.answer=this.quesInfo.answer+this.option[i].option
          }
        }
      }

      console.log(this.option)
    },
    contentProcess(){
      if(this.quesInfo.type==="填空"){
        this.quesInfo.content=this.tempContent;
        return;
      }
      console.log(this.option)
      var str = this.tempContent+"#~#";
      for(let i = 0 ;i < this.tempNumber ;i++){
        str = str+this.option[i].option+'.'+this.option[i].content+"#~#";
      }
      this.quesInfo.content=str;
    },
    setCourseId(){
      //获取课程id，用于创建题目
      for(let i=0;i<this.courseList.length;i++){
        if(this.courseName===this.courseList[i].name){
          this.quesInfo.courseId=this.courseList[i].id;
          console.log(this.quesInfo.courseId)
        }
      }
    },
    submit() {
      this.setCourseId();
      this.contentProcess();
      if(this.quesInfo.analysis==="" || this.quesInfo.analysis===null){
        this.quesInfo.analysis="暂无";
      }
      console.log("I'm submiting")
      if(this.quesInfo.content===null || this.quesInfo.content===""||
      this.quesInfo.courseId===null||
      this.quesInfo.answer===null||this.quesInfo.answer===""||
      this.quesInfo.type===null||this.quesInfo.answer==="") {
        this.showFailDialog = true;
        this.msg = "必填信息不能为空";//题干，答案，题目所属课程，题目类型不能为空
        setTimeout(() => {
          this.showFailDialog = false;
        }, 1000);
      }else if(!this.checkAnswerFormat()){
        //检查答案格式是否符合题目类型
        this.showFailDialog = true;
        setTimeout(() => {
          this.showFailDialog = false;
        }, 1000);
      }else{

        const uid= window.localStorage.getItem("userId");
        this.quesInfo.teacherId=uid;
        const payload={
          ...this.quesInfo,
        }
        console.log(payload)
        if(uid){
          //创建题目
          createQuestion(payload).then(res=>{
            console.log(res);
            if (res.code === 1) {
              this.showSuccessDialog = true;
              setTimeout(() => {
                this.showSuccessDialog = false;
              }, 1000);
            } else {
              this.showFailDialog = true;
              this.msg = res.msg;
              setTimeout(() => {
                this.showFailDialog = false;
              }, 1000);
            }
          });
        }
      }
    },
    checkAnswerFormat(){
      if(this.quesInfo.type==='填空'){
        return true;
      }
      if(this.quesInfo.type==="单选"&&this.quesInfo.answer.length>1){
        this.msg="单选题答案选项数不能多于1";
        return false;
      }
      var answerBodyList=this.quesInfo.content.split("#~#").slice(1);
      var answerOpList=[];
      this.quesInfo.content=this.quesInfo.content.split("#~#")[0]
      for(let i=0;i<answerBodyList.length;i++){
        let op = answerBodyList[i].split('.',1)[0];
        console.log(op.length)
        if(op.length>1){
          this.msg="选项格式非法";//选项格式应该为 X（单个字母）.选项内容
          return false;
        }else if(op.length===0){//选项标识为空
          continue;
        }else{
          answerOpList.push(op)
          this.quesInfo.content+="#~#"+answerBodyList[i]}
      }
      console.log(answerOpList)
      var answerList=this.quesInfo.answer.split('');
      if(answerOpList.length<=1){
        this.msg="选择题至少包含两个选项";
        return false;
      }
      for(let i=0;i<answerList.length;i++){
        if(answerOpList.indexOf(answerList[i])===-1){
          console.log(answerList[i])
          this.msg="答案不包括在设置的选项内，请检查"
          return false;
        }
      }
      return true;
    },

  },

})

</script>

<style scoped>
.alert {
  position: fixed;
  left: 50%;
  top: 200px;
  z-index: 999;
}
</style>