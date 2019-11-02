<template>
  <div class="m-menu">
     <dl class="nav" @mouseleave="mouseleave">
        <dt>全部分类</dt>
      <dd
        v-for="(item, index) in menu"
        @mouseenter="enter"
        :key="index">
        <i :class="item.type"/>{{ item.title }}
        <span class="arrow"/>
      </dd>
    </dl>
    <div
      class="detail"
      v-if="kind"
      @mouseenter="sover"
      @mouseleave="sout">
        <template v-for="(item, index) in curdetail.child">
           <h4 :key="index">{{ item.title }}</h4>
           <span v-for="v in item.child" :key="v">{{ v }}</span>
        </template>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      kind: '',
      menu: [{
       type: 'food',
       title: '美食',
       child: [{
         title: '美食',
         child: ['代金券', '甜品', '火锅', '自助餐']
       }]
      },
      {
        type: 'takeout',
        title: '外卖',
        child: [{
          title: '外卖',
          child: ['美团外卖', '百度外卖']
        }]
      }]
    }
  },
  computed: {
    curdetail: function() {
      //console.log(this.menu.filter((item) => item.type === this.kind)[0])
      return this.menu.filter((item) => item.type === this.kind)[0]
    }
  },
  methods: {
    mouseleave: function() {
      let self = this;
      self._timer = setTimeout(function() {
        self.kind = ''
      }, 150)
    },
    enter: function(e) {
      this.kind = e.target.querySelector('i').className
      //console.log(this.kind)
    },
    sover: function() {
      clearTimeout(this._timer)
    },
    sout: function() {
      this.kind = ''
    }
  }
}
</script>

<style lang="css">
</style>
