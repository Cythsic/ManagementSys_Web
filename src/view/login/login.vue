<style lang="less">
  @import './login.less';
</style>

<template>
  <div class="login">
    <div class="login-con">
      <Card icon="log-in" title="欢迎登录" :bordered="false">
        <div class="form-con">
          <login-form @on-success-valid="handleSubmit"></login-form>
          <p class="login-tip">输入任意用户名和密码即可</p>
        </div>
      </Card>
    </div>
  </div>
</template>

<script>
import LoginForm from '_c/login-form'
import { mapActions } from 'vuex'
export default {
  components: {
    LoginForm
  },
  methods: {
    ...mapActions([
      'handleLogin',
      'getUserInfo'
    ]),
    handleSubmit ({ userName, password }) {
      this.handleLogin({ userName, password }).then(res => {
        if (res.code !== 1) {
          this.$Message.error(res.message)
          return
        }
        this.getUserInfo().then(res => {
			console.log(res)
          this.$router.push({
            name: this.$config.homeName
          })
        })
      })
        .catch(err => {
          this.$Message.error('网络请求出错')
        })
    }
  }
}
</script>

<style>

</style>
