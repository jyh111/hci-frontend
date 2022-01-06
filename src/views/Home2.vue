<template>
  <div>
    <v-container class="ma-8 pa-4">
      <el-row style="height: 400px; display: flex;margin-bottom: 50px;">
        <el-col :span="18">
          <el-carousel height="400px">
            <el-carousel-item v-for="course in hotCourses" :key="course.id">
              <!--          <course-item
            cols="12"
            md="4"
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
          </course-item> -->
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
            <el-button type="primary" plain @click="direct('/login')"
              >登录/注册</el-button
            >
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
          <div style="height: 100px;">
            <div class="btn">
              <el-button type="primary" plain @click="myCourse"
                >我的课程</el-button
              >
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
          <div class="avatar">
            <el-avatar :size="100" src="/default_avatar.png"></el-avatar>
          </div>
          <div style="height: 100px;">
            <div class="btn1">
              <el-button type="primary" plain @click="myCourse"
                >我的课程</el-button
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
                    :bought="false"
                    :manageable="course.manageable"
                    :course-color="colorList[course.id % colorList.length]"
                    :hasLogin="false"
                    :course-likes="course.likes"
                    @buy-course="showDialog"
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
    </v-container>

    <!-- 购买结果 -->
    <v-dialog v-model="dialog" width="500">
      <v-card>
        <v-card-title>请先登录</v-card-title>

        <v-card-text>
          登录后可以学习更多课程哦
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
import CourseItem from "@/components/CourseItem.vue";
import { getCoursesByType, getCoursesByKey, getHotCourses } from "@/api/course";

export default {
  name: "Home2",
  components: {
    CourseItem
  },
  data() {
    return {
      dialog: false,
      dialog2: false,
      dialog3: false,
      hotCourses: null,
      circleUrl:
        "https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png",
      colorList: ["#26A69A", "#00B0FF", "#5C6BC0", "#FFB300", "#E57373"],
      currentTab: 0, // 0 1 2
      primary: {
        name: "初级",
        totalPage: 1,
        currentPage: 1,
        list: []
      },
      isLogin: false,
      userInfo: {},
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
      searchCurrentPage: 1
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
    showDialog() {
      this.dialog = true;
    },

    handleBuyCourse() {
      Promise.resolve(1).then(res => {
        this.dialog = false;
        if (res) {
          this.dialog2 = true;
        } else {
          this.dialog3 = true;
        }
      });
    },

    handleGetCoursesByType(page, type) {
      const typeMap = { primary: "初级", medium: "中级", advanced: "高级" };
      getCoursesByType({ uid: "", type: typeMap[type], page }).then(res => {
        console.log(res);
        this[type].totalPage = res.pages;
        this[type].list = res.list;
      });
    },

    handleSearchCourse() {
      getCoursesByKey({
        uid: "",
        key: this.searchText,
        page: this.searchCurrentPage
      }).then(res => {
        console.log(res);
        this.searchCourse = res.list;
        this.searchTotalPage = res.pages;
      });
    },

    handleHotCourses() {
      getHotCourses("").then(res => {
        console.log(res);
        this.hotCourses = res.list;
      });
    },

    handlePeek(courseId) {
      this.$router.push(`/student/peek/${courseId}`);
    },

    myCourse() {
      this.$router.push("/myCourse");
    },

    courseManage() {
      this.$router.push("/teacher");
    },

    direct(path) {
      if (this.$route.path != path) {
        this.$router.push(path);
      }
    }
  },

  mounted() {
    ["primary", "medium", "advanced"].forEach(t => {
      this.handleGetCoursesByType(1, t);
    });
    this.handleSearchCourse();
    this.handleHotCourses();
    console.log("userid:", window.localStorage.getItem("userId"));
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
