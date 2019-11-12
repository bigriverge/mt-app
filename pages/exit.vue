<template>
  <div class=""/>
</template>

<script>
export default {
  layout: 'blank',
  //nuxt 工作流 中间件什么时候执行的
  middleware: async (ctx) => {
    let {status, data} = await ctx.$axios.get('/users/exit')
    if(status === 200 && data && data.code === 0) {
      window.location.href = '/'
    }
  }
}
</script>

<style>
</style>
