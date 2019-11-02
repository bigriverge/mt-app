<template>
  <div class="m-menu">
    <dt>全部分类</dt>
    <dd v-for="(item, index) in menu" :key="index">
      <i :class="item.type"/>{{ item.title }}
      <span class="arrow"/>
    </dd>
  </div>
</template>

<script>
export default {
  data() {
    return {
      menu: [{
       type: 'food',
       title: '美食'
      },
      {
        type: 'takeout',
        title: '外卖'
      }]
    }
  }
}
</script>

<style lang="css">
</style>
