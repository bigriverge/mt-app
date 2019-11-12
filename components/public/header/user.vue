<template>
  <div class="m-user">
    <template v-if="user">
      欢迎您， <span class="username">{{ user }}</span>
      [<nuxt-link to="/exit">退出</nuxt-link>]
    </template>
    <template v-else>
      <nuxt-link to="/login" class="login">立即登录</nuxt-link>
      <nuxt-link to="/register" class="register">注册</nuxt-link>
    </template>
  </div>
</template>

<script>
export default {
  data() {
    return {
      user: ''
    }
  },
  // vue声明周期钩子函数 组件 挂载到页面上 渲染完毕 再去请求 达到异步的效果
  async mounted() {
    const {status, data: {user}} = await this.$axios.get('/users/getUser')
    if(status === 200) {
      this.user = user
    }
  }
}
</script>

<style>
</style>
