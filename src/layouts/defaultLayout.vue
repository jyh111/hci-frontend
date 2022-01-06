<template>
  <!--  <div>
    <v-app-bar color="cyan darken-3" dense dark>
      <v-app-bar-nav-icon @click="direct('/')">
        <v-icon>mdi-home</v-icon></v-app-bar-nav-icon
      >

      <v-toolbar-title @click="direct('/')" class="cursor">
        Course Learning
      </v-toolbar-title>

      <v-spacer></v-spacer>

      <v-btn text @click="direct('/login')">
        登录/注册
      </v-btn>
    </v-app-bar>
    <router-view />
  </div> -->
  <div>
    <el-row class="header">
      <el-col :span="4"></el-col>
      <img src="/icon.jpeg" class="icon" @click="direct('/')" />
      <el-col :span="3" class="title" @click.native="direct('/')">
        CourseLearning
      </el-col>
      <el-col :span="4"></el-col>
      <el-col :span="6">
        <el-input
          placeholder="请输入感兴趣的课程"
          v-model="searchText"
          style="height: 50px;"
        >
          <el-button
            slot="append"
            icon="el-icon-search"
            @click="search"
          ></el-button>
        </el-input>
      </el-col>

      <el-col :span="4"></el-col>
      <el-col
        :span="2"
        @click.native="direct('/login')"
        class="login"
        v-show="!isLogin"
        >登录/注册</el-col
      >
      <el-col :span="2" v-show="isLogin">
        <!--        <v-menu left bottom>
          <template v-slot:activator="{ on, attrs }">
            <v-btn icon v-bind="attrs" v-on="on">
              <v-icon>mdi-dots-vertical</v-icon>
            </v-btn>
          </template>

          <v-list>
            <v-list-item
              v-for="opt in optionList"
              :key="opt.optionName"
              @click="direct(opt.link)"
            >
              <v-list-item-title>{{ opt.optionName }}</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu> -->
        <el-dropdown>
          <span class="el-dropdown-link">
            <el-avatar :size="50" src="/default_avatar.png"></el-avatar>
            <i class="el-icon-arrow-down el-icon--right"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item
              v-for="(option, i) in optionList"
              :key="i"
              @click.native="direct(option.link)"
            >
              {{ option.optionName }}
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </el-col>
    </el-row>
    <router-view @update="update" />
  </div>
</template>

<script>
export default {
  name: "DefaultLayout",
  data() {
    return {
      searchText: "",
      optionList: [
        {
          optionName: "历史订单",
          link: "/student/history"
        },
        {
          optionName: "个人中心",
          link: `/student/user/${window.localStorage.getItem("userId")}`
        },
        {
          optionName: "登出",
          link: "/logout"
        }
      ],
      isLogin: false
    };
  },
  methods: {
    direct(link) {
      console.log(link);
      if (link === "/logout") {
        this.logout();
		this.update();
        link = "/";
      }
      if (this.$route.path !== link) {
        this.$router.push(link);
      } else {
        location.reload();
      }
    },
    update() {
      if (window.localStorage.getItem("userId") == null) {
        this.isLogin = false;
      } else {
        this.isLogin = true;
      }
    },
    logout() {
      window.localStorage.removeItem("userId");
      window.localStorage.removeItem("userPhone");
      window.localStorage.removeItem("username");
      window.localStorage.removeItem("userRole");
    },
    search() {
      console.log("search" + this.$route.path);
      if (this.$route.path == "/search") {
        console.log("replace");
        this.$router.push({
          path: "/search",
          query: {
            str: this.searchText
          }
        });
        location.reload();
      } else {
        this.$router.push({
          path: "/search",
          query: {
            str: this.searchText
          }
        });
      }
    }
  },

  mounted() {
    console.log("mounted:");
    if (window.localStorage.getItem("userId") == null) {
      this.isLogin = false;
    } else {
      this.isLogin = true;
    }
  }
};
</script>

<style scoped>
.cursor {
  cursor: pointer;
}

.header {
  background-color: #00838f;
  height: 50px;
  display: flex;
}
.icon {
  width: 50px;
  height: 50px;
}

.title {
  text-align: center;
  font-size: large;
  line-height: 50px;
  color: white;
}

>>> .el-input__inner {
  height: 50px;
}

.login {
  text-align: center;
  font-size: medium;
  line-height: 50px;
  color: white;
}

.el-dropdown-link {
  cursor: pointer;
  color: white;
  height: 50px;
}

.el-icon-arrow-down {
  font-size: 20px;
  text-align: center;
  line-height: 50px;
}
</style>
