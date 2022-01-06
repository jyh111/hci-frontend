<template>
  <div>
    <v-container class="pl-16 pr-16">
      <v-row>
        <v-col>
          <form class="pa-12 grey lighten-5 mt-8">
            <div class="d-flex justify-space-between">
              <v-text-field
                class="d-inline-block"
                v-model="courseInfo.name"
                label="课程名称"
                readonly
              ></v-text-field>
              <v-btn class="mx-2 align-self-center" fab dark small color="red">
                <v-icon dark>
                  mdi-heart
                </v-icon>
              </v-btn>
              <span class="align-self-center"
                >点赞： {{ courseInfo.likes }}</span
              >
            </div>

            <v-text-field
              v-model="courseInfo.id"
              label="课程ID"
              readonly
            ></v-text-field>
            <v-select
              :items="types"
              v-model="courseInfo.type"
              label="课程分类"
              readonly
            ></v-select>
            <v-textarea
              v-model="courseInfo.intro"
              label="课程简介"
              readonly
            ></v-textarea>
            <v-text-field
              v-model="courseInfo.school"
              label="所属学校"
              readonly
            ></v-text-field>
            <v-text-field
              v-model="courseInfo.createTime"
              label="创建时间"
              readonly
            ></v-text-field>
            <v-text-field
              v-model="courseInfo.teacherName"
              label="创建教师"
              readonly
            ></v-text-field>
            <v-switch
              v-model="isCharge"
              :label="`是否为付费课程: ${isCharge.toString()}`"
              readonly
            ></v-switch>
            <v-text-field
              v-show="isCharge"
              v-model="courseInfo.cost"
              label="课程价格(元)"
              readonly
            ></v-text-field>
          </form>
        </v-col>
      </v-row>
      <el-row style="width: 100%; margin-top: 10px;" v-if="!courseInfo.bought">
        <div>
          <el-button
            type="primary"
            style="float: right;"
            @click="showDialog(courseInfo.id, courseInfo.name, courseInfo.cost)"
            >购买课程</el-button
          >
        </div>
      </el-row>
      <el-row style="width: 100%; margin-top: 10px;" v-if="courseInfo.bought">
        <div>
          <el-button type="primary" style="float: right;" @click="learn"
            >学习课程</el-button
          >
        </div>
      </el-row>
    </v-container>

    <!-- 购买结果 -->
    <v-dialog v-model="dialog_login" width="500">
      <v-card>
        <v-card-title>请先登录</v-card-title>

        <v-card-text>
          登录后可以学习更多课程哦
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" text @click="dialog_login = false">
            确认
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- 购买提示对话框 -->
    <v-dialog v-model="dialog" width="1000">
      <v-card>
        <v-card-title>购买信息确认</v-card-title>
        <v-card-text> 是否购买课程 「{{ courseInfo.name }}」？ </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" text @click="openSettleDialog">
            选择结算方案
          </v-btn>
          <v-btn color="primary" text @click="dialog = false">
            取消
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="settleDialog" width="1000">
      <v-card>
        <v-card-title v-if="msg">{{ msg }}</v-card-title>
        <div v-else>
          <v-card-title>优惠券选择</v-card-title>
          <v-data-table
            v-model="selectedCoupons"
            :headers="couponHeaders"
            :items="coupons"
            class="elevation-1"
            show-select
            @item-selected="onSelectCoupon"
          >
            <template #header.data-table-select></template>
          </v-data-table>
          <v-row justify="center" class="mt-5"> </v-row>
          <v-card-actions class="justify-space-around d-flex">
            <v-alert type="info">课程原价： {{ currentOrder.origin }}</v-alert>
            <v-alert type="success">实际付款： {{ currentOrder.cost }}</v-alert>
            <v-btn color="primary" @click="confirmPayment">确认支付</v-btn>
            <v-btn color="secondary" @click="leaveSettlement">离开</v-btn>
          </v-card-actions>
        </div>
      </v-card>
    </v-dialog>

    <!-- 购买结果 -->
    <v-dialog v-model="dialog2" width="500">
      <v-card>
        <v-card-title>购买课程</v-card-title>

        <v-card-text>
          {{ msg }}
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" text @click="dialog2 = false">
            确认
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-snackbar
      v-model="showSnackBar"
      :color="snackBarColor"
      timeout="1000"
      top
    >
      {{ snackBarMsg }}
    </v-snackbar>
  </div>
</template>

<script>
import CourseItem from "@/components/CourseItem.vue";
import {
  getCoursesByType,
  getCoursesByKey,
  getBoughtCourses,
  getHotCourses,
  setCourseLike,
  getCourseById,
  setCourseDislike
} from "@/api/course";
import {
  cancelCoupon,
  createOrder,
  getOrderById,
  payOrder,
  useCoupon
} from "@/api/order";
import { getAvailableCouponsForOrder } from "@/api/coupon";
import { getTestByCourse } from "@/api/test";
export default {
  name: "CoursePeek",

  data() {
    return {
      courseInfo: {},
      types: ["初级", "中级", "高级"],
      uid: "",
      dialog_login: false,
      dialog: false,
      dialog2: false,
      msg: "",
      currentCourseId: 0,
      currentCourseName: "",
      currentCoursePrice: 0,
      colorList: ["#26A69A", "#00B0FF", "#5C6BC0", "#FFB300", "#E57373"],
      currentTab: 0, // 0 1 2
      primary: {
        name: "初级",
        totalPage: 1,
        currentPage: 1,
        list: []
      },
      medium: {
        name: "中级",
        totalPage: 1,
        currentPage: 1,
        list: []
      },
      advanced: {
        name: "高级",
        totalPage: 1,
        currentPage: 1,
        list: []
      },
      searchText: "",
      searchCourse: [],
      searchTotalPage: 1,
      searchCurrentPage: 1,
      //
      boughtCoursesList: [],
      hotCourseList: [],
      showSnackBar: false,
      snackBarMsg: "",
      snackBarColor: "success",
      couponHeaders: [
        {
          text: "优惠券名称",
          value: "name"
        },
        {
          text: "优惠券类型",
          value: "type"
        },
        {
          text: "优惠券描述",
          value: "description"
        },
        {
          text: "元数据",
          value: "metadata"
        },
        {
          text: "与其他优惠券同时使用",
          value: "sharable"
        }
      ],
      coupons: [],
      selectedCoupons: [],
      settleDialog: false,
      currentOrder: {},
      testList: []
    };
  },

  computed: {
    isCharge: function() {
      return this.courseInfo.cost !== 0;
    }
  },

  methods: {
    loadCourse() {
      const { courseId } = this.$route.params;
      console.log("uid", this.uid);
      getCourseById({
        uid: this.uid,
        courseId: courseId
      }).then(res => {
        this.courseInfo = res;
        console.log(res);
      });
    },
    showDialog(courseId, courseName, coursePrice) {
      console.log(courseId, courseName, coursePrice);
      this.currentCourseId = courseId;
      this.currentCourseName = courseName;
      this.currentCoursePrice = coursePrice;
      if (this.uid == "") {
        this.dialog_login = true;
      } else {
        this.dialog = true;
      }
    },
    openSettleDialog() {
      const uid = window.localStorage.getItem("userId");
      createOrder(this.uid, this.currentCourseId).then(res => {
        if (res.code === 0) {
          this.snackBarColor = "error";
          this.snackBarMsg = res.msg;
          this.showSnackBar = true;
          this.dialog = false;
          return;
        }

        this.dialog = false;
        this.settleDialog = true;
        this.currentOrder = res.data;

        getAvailableCouponsForOrder(this.currentOrder.id).then(res => {
          this.selectedCoupons = this.currentOrder.usedCoupons
            ? this.currentOrder.usedCoupons
            : [];

          this.coupons = [...res.data, ...this.selectedCoupons]; // 将当前可用的 和 已经用的 合并起来展示，若之前创建过订单没有付款，再次进入时需要这样
        });
      });
    },

    onSelectCoupon({ item, value }) {
      if (value) {
        useCoupon(this.currentOrder, item.id).then(res => {
          this.snackBarColor = "success";
          this.snackBarMsg = res.msg;
          this.showSnackBar = true;
          getOrderById(this.currentOrder.id).then(res => {
            this.currentOrder = res.data;
          });
        });
      } else {
        cancelCoupon(this.currentOrder, item.id).then(res => {
          this.snackBarColor = "success";
          this.snackBarMsg = res.msg;
          this.showSnackBar = true;
          getOrderById(this.currentOrder.id).then(res => {
            this.currentOrder = res.data;
          });
        });
      }
    },
    confirmPayment() {
      this.settleDialog = false;
      payOrder(this.currentOrder.id).then(res => {
        this.snackBarColor = "success";
        this.snackBarMsg = res.msg;
        this.showSnackBar = true;
        location.reload();
      });
    },
    leaveSettlement() {
      this.currentOrder = {};
      this.currentCourseId = 0;
      this.currentCoursePrice = 0;
      this.currentCourseName = "";
      this.coupons = [];
      this.selectedCoupons = [];
      this.settleDialog = false;
    },

    learn() {
      this.$router.push(`/student/course/${this.courseInfo.id}`);
    }
  },

  mounted() {
    console.log(window.localStorage.getItem("userId"));
    if (window.localStorage.getItem("userId") != null) {
      this.uid = window.localStorage.getItem("userId");
    }
    this.loadCourse();
    console.log(this.uid);
  }
};
</script>

<style scoped></style>
