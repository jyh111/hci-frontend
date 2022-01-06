import Vue from "vue";
import VueRouter from "vue-router";
// admin
import AdminLayout from "@/layouts/adminLayout.vue";
import CouponList from "@/views/admin/CouponList.vue";
import CouponCreate from "@/views/admin/CouponCreate.vue";
import CouponDeliver from "@/views/admin/CouponDeliver.vue";
// teacher
import TeacherLayout from "@/layouts/teacherLayout.vue";
import CourseList from "@/views/teacher/CourseList.vue";
import CourseCreate from "@/views/teacher/CourseCreate.vue";
import CourseEdit from "@/views/teacher/CourseEdit.vue";
import TeacherCenter from "@/views/teacher/UserCenter.vue";
// student
import StudentLayout from "@/layouts/studentLayout.vue";
import StudentCourseList from "@/views/student/CourseList.vue";
import UserCenter from "@/views/student/UserCenter.vue";
import HistoryOrder from "@/views/student/HistoryOrder.vue";
import CourseStudy from "@/views/student/CourseStudy.vue";
import CoursePeek from "@/views/student/CoursePeek.vue";
// default
import DefaultLayout from "@/layouts/defaultLayout.vue";
import Login from "@/views/Login.vue";
import Register from "@/views/Register.vue";
import Search from "@/views/Search.vue";
import MyCourse from "@/views/MyCourse.vue";
import MyTest from "@/views/MyTest.vue";
// import Home from "@/views/Home.vue";
import Home2 from "@/views/Home2.vue";
// authentication
import { judgeTeacher, judgeStudent } from "@/util/auth";
import TestCreate from "@/views/teacher/TestCreate";
import QuestionCreate from "@/views/teacher/QuestionCreate";
import TestEdit from "@/views/teacher/TestEdit";
import Testing from "@/views/student/Testing";
import CourseQuestionBase from "@/views/teacher/CourseQuestionBase";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Home",
    component: DefaultLayout,
    children: [
      {
        path: "/",
        name: "Home",
        component: Home2
      },
      {
        path: "login",
        name: "Login",
        component: Login
      },
      {
        path: "register",
        name: "Register",
        component: Register
      },
      {
        path: "search",
        name: "Search",
        component: Search
      },
      {
        path: "myCourse",
        name: "MyCourse",
        component: MyCourse
      },
      {
        path: "myTest",
        name: "MyTest",
        component: MyTest
      }
    ]
  },
  {
    path: "/admin",
    name: "Admin",
    component: DefaultLayout,
    children: [
      {
        path: "/",
        name: "CouponList",
        redirect: "coupon"
      },
      {
        path: "coupon",
        name: "CouponList",
        exact: true,
        component: CouponList
      },
      {
        path: "coupon/create",
        name: "CouponCreate",
        component: CouponCreate
      },
      {
        path: "coupon/deliver",
        name: "CouponDeliver",
        component: CouponDeliver
      }
    ]
  },
  {
    path: "/teacher",
    name: "Teacher",
    component: DefaultLayout,
    children: [
      {
        path: "/",
        name: "TeacherCourseList",
        component: CourseList
      },
      {
        path: "user/:userId",
        name: "TeacherCenter",
        component: TeacherCenter
      },
      {
        path: "create",
        name: "TeacherCourseCreate",
        component: CourseCreate
      },
      {
        path: "edit/:courseId",
        name: "TeacherCourseEdit",
        component: CourseEdit
      },
      {
        path: "showCourseBase/:courseId",
        name: "TeacherQuestionBase",
        component: CourseQuestionBase
      },
      {
        path: "createTest",
        name: "TeacherTestCreate",
        component: TestCreate
      },
      {
        path: "createQuestion",
        name: "TeacherQuestionCreate",
        component: QuestionCreate
      },
      {
        path: "editTest/:testId",
        name: "TeacherTestEdit",
        component: TestEdit
      }
    ]
  },
  {
    path: "/student",
    name: "Student",
    component: DefaultLayout,
    children: [
      {
        path: "/",
        name: "StudentCourseList",
        component: StudentCourseList
      },
      {
        path: "user/:userId",
        name: "StudentUserCenter",
        component: UserCenter
      },
      {
        path: "history",
        name: "HistoryOrder",
        component: HistoryOrder
      },
      {
        path: "course/:courseId",
        name: "CourseStudy",
        component: CourseStudy
      },
      {
        path: "peek/:courseId",
        name: "CoursePeek",
        component: CoursePeek
      },
      {
        path: "testing/:testId",
        name: "StudentTesting",
        component: Testing
      }
    ]
  }
];

const router = new VueRouter({
  mode: "hash",
  base: process.env.BASE_URL,
  routes
});

router.beforeEach((to, from, next) => {
  let legal = false;
  if (!to.path.startsWith("/student") && !to.path.startsWith("/teacher"))
    legal = true;
  if (to.path.startsWith("/student")) legal = true;
  if (to.path.startsWith("/teacher") && judgeTeacher()) legal = true;
  if (to.name === "CoursePeek") legal = true;
  if (legal) {
    next();
  } else {
    next({ name: "Login" });
  }
});

export default router;
