<template>
  <div class="page-register">
    <article class="header">
      <header>
        <a href="/" class="site-logo" />
        <span class="login">
          <em class="bold">已有美团账号？</em>
          <a href="/login">
            <el-button type="primary" size="small">
              登录
            </el-button>
          </a>
        </span>
      </header>
    </article>
    <section>
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
        <el-form-item label="昵称" prop="name">
          <el-input v-model="ruleForm.name"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="ruleForm.email"></el-input>
          <el-button size="mini" round @click="sendMsg">发送验证码</el-button>
          <span class="status">{{ statusMsg }}</span>
        </el-form-item>
        <el-form-item label="验证码" prop="code">
          <el-input v-model="ruleForm.code" maxlength="4"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="pwd">
          <el-input v-model="ruleForm.pwd" type="password"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="cpwd">
          <el-input v-model="ruleForm.cpwd" type="password"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button size="primary" @click="register">同意以下协议并注册</el-button>
          <div class="error">{{ error }}</div>
        </el-form-item>
      </el-form>
    </section>
  </div>
</template>

<script>
export default {
  data() {
    return {
      statusMsg: '',
      error: '',
      ruleForm: {
        name: '',
        email: '',
        code: '',
        pwd: '',
        cpwd: ''
      },
      rules: {
        name: [{
          required: true,
          trigger: 'blur',
          type: 'string',
          message: '请输入昵称'
        }],
        email: [{
          required: true,
          trigger: 'blur',
          type: 'email',
          messgae: '请输入邮箱'
        }],
        pwd: [{
          required: true,
          trigger: 'blur',
          message: '请输入密码'
        }],
        cpwd: [{
          required: true,
          trigger: 'blur',
          message: '确认密码'
        },
        {
          //自定义验证函数
          validator: (rule, value, callback) => {
            if(value === '') {
              callback(new Error('请再次输入密码'))
            }else if(value !== this.ruleForm.pwd) {
              callback(new Error('两次输入密码不一致'))
            }else {
              callback()
            }
          },
          trigger: 'blur'
        }]
      }
    }
  },
  layout: 'blank',
  methods: {
    sendMsg: function() {
      const self = this;
      let namePass
      let emailPass
      if(self.timerid) {
        return false
      }

      this.$refs['ruleForm'].validateField('name', (valid) => {
        namePass = valid
      })

      self.statusMsg = ''

      // namePass emailPass 有值说明 验证没有通过
      if(namePass) {
        return false
      }

      this.$refs['ruleForm'].validateField('email', (valid) => {
        emailPass = valid
      })

      // 中文需要编码 encodeURIComponent
      if(!namePass && !emailPass) {
        self.$axios.post('/users/verify', {
          username: encodeURIComponent(self.ruleForm.name),
          email: self.ruleForm.email
        }).then(
          ({status, data}) => {
            if(status === 200 && data && data.code === 0) {
              let count = 60
              self.statusMsg = `验证码已发送， 剩余${count--}秒`
              self.timerid = setInterval(function() {
                self.statusMsg = `验证码已发送， 剩余${count--}秒`
                if(count === 0) {
                  clearInterval(self.timerid)
                }
              }, 1000)
            }else{
              self.statusMsg = data.msg
            }
          })
      }

    },
    register: function() {

    }
  }
}
</script>

<style lang="scss">
  @import "@/assets/css/register/index.scss";
</style>
