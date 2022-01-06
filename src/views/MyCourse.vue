<template>
  <v-container class="ma-8 pa-4">
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
        我的课程
      </v-chip>
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
</template>

<script>
import CourseItem from "@/components/CourseItem.vue";
import TestItem from "@/components/TestItem";
import { getBoughtCourses, getCourseById } from "@/api/course";
import { getTestByCourse } from "@/api/test";
export default {
  name: "MyCourse",
  components: {
    CourseItem,
    TestItem
  },
  data() {
    return {
      boughtCoursesList: [],
      userInfo: {},
      colorList: ["#26A69A", "#00B0FF", "#5C6BC0", "#FFB300", "#E57373"],
      testList: []
    };
  },
  methods: {
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
      this.getUserBoughtCourses();
    },

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
    }
  },

  mounted() {
    console.log("mounted");
    this.fetchData();
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

<style scoped></style>
