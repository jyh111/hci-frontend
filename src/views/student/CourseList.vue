<template>
  <div>
    <v-container class="ma-8 pa-4">
      <!-- 热门课程 -->
      <el-row style="height: 400px; display: flex;margin-bottom: 50px;">
        <el-col :span="18">
          <el-carousel height="400px">
            <el-carousel-item v-for="course in hotCourses" :key="course.id">
              <el-card
                style="width: 100%; height: 100%;"
                @click.native="handlePeek(course.id)"
              >
                <div
                  slot="header"
                  style="height: 200px; text-align: center; font-size: xx-large; line-height: 300px;"
                >
                  {{ course.name }}
                </div>
                <div
                  style="text-align: right; padding-right: 50px; font-size: medium;"
                >
                  {{ course.intro }}
                </div>
              </el-card>
            </el-carousel-item>
          </el-carousel>
        </el-col>
        <el-col :span="6" class="side" v-if="!isLogin">
          <div class="intro">免费学习来自名校名师<br />的精品课程</div>
          <div class="avatar">
            <el-avatar :size="100" :src="circleUrl"></el-avatar>
          </div>
          <div class="btn">
            <el-button type="primary" plain>登录/注册</el-button>
          </div>
        </el-col>
        <el-col
          :span="6"
          class="side"
          v-if="isLogin && userInfo.userRole == 'STUDENT'"
        >
          <div class="intro">
            {{ userInfo.username
            }}{{ userInfo.userRole == "STUDENT" ? "同学" : "老师" }}, 您好
          </div>
          <div class="avatar">
            <el-avatar :size="100" src="/default_avatar.png"></el-avatar>
          </div>
          <div style="height: 120px;">
            <div class="btn1">
              <el-button type="primary" plain @click="myCourse"
                >我的课程</el-button
              >
            </div>
			<div class="btn2">
				<el-button type="success" plain @click="myTest">我的测试</el-button>
			</div>
          </div>
        </el-col>

        <el-col
          :span="6"
          class="side"
          v-if="isLogin && userInfo.userRole == 'TEACHER'"
        >
          <div class="intro">
            {{ userInfo.username
            }}{{ userInfo.userRole == "STUDENT" ? "同学" : "老师" }}, 您好
          </div>
          <div class="avatar" style="height: 120px; padding-top: 0px;">
            <el-avatar :size="100" src="/default_avatar.png"></el-avatar>
          </div>
          <div style="height: 170px;">
            <div class="btn1">
              <el-button type="primary" plain @click="myCourse"
                >我的课程</el-button
              >
            </div>
            <div class="btn2" style="height: 50px;">
              <el-button type="success" plain @click="myTest"
                >我的测试</el-button
              >
            </div>
        
            <div class="btn2">
              <el-button plain @click="courseManage">课程管理</el-button>
            </div>
          </div>
        </el-col>
      </el-row>

      <template>
        <!-- 分类课程 -->
        <v-row class="mt-2 mb-8">
          <v-chip
            class="ma-2"
            color="deep-purple lighten-3"
            label
            text-color="white"
          >
            <v-icon left>
              mdi-label
            </v-icon>
            分类课程
          </v-chip>
        </v-row>
        <v-card>
          <v-tabs color="deep-purple accent-4" right v-model="currentTab">
            <v-tab>初级课程</v-tab>
            <v-tab>中级课程</v-tab>
            <v-tab>高级课程</v-tab>

            <v-tab-item v-for="c in [primary, medium, advanced]" :key="c.name">
              <v-container fluid>
                <v-row class="ma-4">
                  <course-item
                    cols="12"
                    md="4"
                    v-for="course in c.list"
                    :key="course.id"
                    :courseName="course.name"
                    :courseId="course.id"
                    :description="course.intro"
                    :type="course.type"
                    :cost="course.cost"
                    :bought="course.bought"
                    :manageable="course.manageable"
                    :course-color="colorList[course.id % colorList.length]"
                    :course-likes="course.likes"
                    :liked="course.liked"
                    @buy-course="showDialog"
                    @set-like="setLikeOrDislike"
                  >
                  </course-item>
                </v-row>
                <v-pagination
                  v-model="c.currentPage"
                  :length="c.totalPage"
                  circle
                ></v-pagination>
              </v-container>
            </v-tab-item>
          </v-tabs>
        </v-card>
      </template>

      <v-row class="ma-12">
        <v-divider></v-divider>
      </v-row>

      <!-- 已购课程 -->
      <v-row class="mt-8 mb-2">
        <v-chip
          class="ma-2"
          color="deep-purple lighten-3"
          label
          text-color="white"
        >
          <v-icon left>
            mdi-label
          </v-icon>
          我的已购课程
        </v-chip>
      </v-row>
	  <v-row v-if="boughtCoursesList.length == 0">
	    <v-col
	      cols="12"
	      style="font-size: 20px; text-align: center; line-height: 100%;"
	    >
	      您还未选购任何课程哦！
	    </v-col>
	  </v-row>
      <v-row>
        <course-item
          cols="12"
          md="4"
          v-for="course in boughtCoursesList"
          :key="course.id"
          :courseName="course.name"
          :courseId="course.id"
          :description="course.intro"
          :type="course.type"
          :cost="course.cost"
          :bought="course.bought"
          :manageable="course.manageable"
          :course-color="colorList[course.id % colorList.length]"
          :course-likes="course.likes"
          :liked="course.liked"
          @buy-course="showDialog"
          @set-like="setLikeOrDislike"
        >
        </course-item>
      </v-row>
      <v-row class="mt-8 mb-2">
        <v-chip
          class="ma-2"
          color="deep-purple lighten-3"
          label
          text-color="white"
        >
          <v-icon left>
            mdi-label
          </v-icon>
          我的测试
        </v-chip>
      </v-row>
	  <v-row v-if="testList.length == 0">
	    <v-col
	      cols="12"
	      style="font-size: 20px; text-align: center; line-height: 100%;"
	    >
	      您还没有任何测试哦！
	    </v-col>
	  </v-row>
      <v-row>
        <test-item
          v-for="test in testList"
          :key="test.id"
          :test-name="test.testName"
          :test-id="test.id"
          :end-time="test.endTime"
          :start-time="test.startTime"
          :test-state="test.state"
          :test-length="test.length"
          :course-name="test.courseName"
        ></test-item>
      </v-row>
    </v-container>

    <!-- 购买提示对话框 -->
    <v-dialog v-model="dialog" width="1000">
      <v-card>
        <v-card-title>购买信息确认</v-card-title>
        <v-card-text> 是否购买课程 「{{ currentCourseName }}」？ </v-card-text>

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
import TestItem from "@/components/TestItem";
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
  name: "StudentCourseList",

  components: {
    CourseItem,
    TestItem
  },

  data() {
    return {
      dialog: false,
      dialog2: false,
      msg: "",
      circleUrl:
        "https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png",
      isLogin: false,
      userInfo: {},
      hotCourses: null,
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

  watch: {
    "primary.currentPage": {
      handler: function(val) {
        this.handleGetCoursesByType(val, "primary");
      }
    },

    "medium.currentPage": {
      handler: function(val) {
        this.handleGetCoursesByType(val, "medium");
      }
    },

    "advance.currentPage": {
      handler: function(val) {
        this.handleGetCoursesByType(val, "advanced");
      }
    },

    searchCurrentPage: function() {
      this.handleSearchCourse();
    },

    searchText: function() {
      this.handleSearchCourse();
    }
  },

  methods: {
    showDialog(courseId, courseName, coursePrice) {
      this.currentCourseId = courseId;
      this.currentCourseName = courseName;
      this.currentCoursePrice = coursePrice;
      this.dialog = true;
    },
    handleHotCourses() {
      getHotCourses("").then(res => {
        console.log(res);
        this.hotCourses = res.list;
      });
    },
    openSettleDialog() {
      const uid = window.localStorage.getItem("userId");
      createOrder(uid, this.currentCourseId).then(res => {
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
    handleGetCoursesByType(page, type) {
      const uid = window.localStorage.getItem("userId");
      const typeMap = { primary: "初级", medium: "中级", advanced: "高级" };
      getCoursesByType({ uid, type: typeMap[type], page }).then(res => {
        this[type].totalPage = res.pages;
        this[type].list = res.list;
      });
    },

    handleSearchCourse() {
      const uid = window.localStorage.getItem("userId");
      getCoursesByKey({
        uid,
        key: this.searchText,
        page: this.searchCurrentPage
      }).then(res => {
        this.searchCourse = res.list;
        this.searchTotalPage = res.pages;
      });
    },

    getUserBoughtCourses() {
      const uid = window.localStorage.getItem("userId");
      getBoughtCourses(uid).then(res => {
        this.boughtCoursesList = res || [];
        console.log(this.boughtCoursesList);

        for (let i = 0; i < this.boughtCoursesList.length; i++) {
          console.log("in");
          getTestByCourse(this.boughtCoursesList[i].id).then(res => {
            console.log(res);
            for (let j = 0; j < res.length; j++) {
              this.testList.push(res[j]);
            }
          });
        }
        console.log(this.testList);
      });
    },

    fetchData() {
      ["primary", "medium", "advanced"].forEach(t => {
        this.handleGetCoursesByType(1, t);
      });
      this.handleSearchCourse();
      this.getUserBoughtCourses();
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
    // 该方法绑定到了课程卡牌的心形按钮上
    setLikeOrDislike(courseId) {
      const uid = window.localStorage.getItem("userId");
      // 通过一个接口来获取该用户对当前课程的点赞情况，根据结果进入不同的分支
      // TODO Add your code here
      getCourseById({ courseId, uid }).then(res => {
        if (res.liked) {
          // 分支2：若当前用户已经为该课程点过赞了，则调用取消点赞接口完成相关操作，可以仿照分支1的示例进行
          // TODO Add your code here
          setCourseDislike(uid, courseId).then(res => {
            if (res.code === 1) {
              this.snackBarMsg = res.msg;
              this.snackBarColor = "success";
              this.showSnackBar = true;
              this.fetchData();
            }
          });
        } else {
          // 分支1：若当前用户没有对该课程点赞则调用点赞接口
          setCourseLike(uid, courseId).then(res => {
            if (res.code === 1) {
              //点赞成功，设置提示条的内容，颜色，并显示
              this.snackBarMsg = res.msg;
              this.snackBarColor = "success";
              this.showSnackBar = true;
              // 点赞成功后，课程的点赞数会变化，也会影响热门课程的排序，因此调用以下方法更新页面中的数据
              this.fetchData();
            } else {
              // 点赞失败，设置提示条的内容、颜色，并显示。目前这里显示的内容是： 点赞失败、请勿重复点赞。
              // 如果你的代码实现正确（以及后端代码） 应当不会出现这种情况。
              // 原因是在重复点赞前，你应当在这里已经判断出点过赞，因此应当跳转到分支2去执行取消点赞的逻辑
              this.snackBarMsg = res.msg;
              this.snackBarColor = "warning";
              this.showSnackBar = true;
            }
          });
        }
      });
    },
    handlePeek(courseId) {
      this.$router.push(`/student/peek/${courseId}`);
    },
    confirmPayment() {
      this.settleDialog = false;
      payOrder(this.currentOrder.id).then(res => {
        this.snackBarColor = "success";
        this.snackBarMsg = res.msg;
        this.showSnackBar = true;
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
    myCourse() {
      this.$router.push("/myCourse");
    },
	myTest(){
		this.$router.push("/myTest");
	},
    courseManage() {
      this.$router.push("/teacher");
    }
  },

  mounted() {
    console.log("mounted");
    this.fetchData();
    this.handleHotCourses();
    if (
      window.localStorage.getItem("userId") == null ||
      window.localStorage.getItem("userId") == ""
    ) {
      this.isLogin = false;
    } else {
      this.isLogin = true;
      this.userInfo = {
        userId: window.localStorage.getItem("userId"),
        userPhone: window.localStorage.getItem("userPhone"),
        username: window.localStorage.getItem("username"),
        userRole: window.localStorage.getItem("userRole")
      };
      console.log(this.userInfo);
    }
  }
};
</script>

<style scoped>
.side {
  border-bottom: 1px solid #ebeef5;
  border-right: 1px solid #ebeef5;
  border-top: 1px solid #ebeef5;
}
.intro {
  height: 100px;
  text-align: center;
  font-size: medium;
  padding-top: 70px;
}
.avatar {
  height: 180px;
  padding-top: 50px;
  padding-left: 30%;
}
.btn {
  height: 120px;
  padding-left: 30%;
}

.btn1 {
  height: 60px;
  padding-left: 30%;
  padding-top: 10px;
  /* padding-bottom: 10px; */
}

.btn2 {
  height: 60px;
  padding-left: 30%;
  padding-top: 0px;
}
</style>
