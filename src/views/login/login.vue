<template>
  <div class="login-container">
    <!-- <img src="@/assets/login/RE4wwut.jpg" alt="背景"> -->
    <div class="img"></div>
    <div class="fuzzy"></div>

    <div class="form-wrapper">
      <div class="form-container">
        <el-form ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form"
          auto-complete="on" label-position="left">
          <div class="title-container">
            <h3 class="title">欢迎登录</h3>
          </div>

          <el-form-item prop="username">
            <span class="svg-container">
              <svg-icon icon-class="user" />
            </span>
            <el-input ref="username" v-model="loginForm.username" placeholder="请输入用户名"
              name="username" type="text" tabindex="1" autocomplete="off" clearable />
          </el-form-item>

          <el-form-item prop="password">
            <span class="svg-container">
              <svg-icon icon-class="password" />
            </span>
            <el-input ref="password" v-model="loginForm.password" type="password"
              placeholder="请输入登录密码" name="password" tabindex="2" autocomplete="off"
              clearable />
          </el-form-item>

          <el-button :loading="loading" type="primary"
            style="width: 100%; margin-bottom: 30px" @click="handleLogin">
            登录
          </el-button>

          <div class="tips">
            <span>内部注册</span>
          </div>
        </el-form>
      </div>
      <input type="text" autocomplete="off">
    </div>

  </div>
</template>

<script>
import { validUsername } from '@/utils/validate'
export default {
	name: 'Login',
	data() {
		const validateUsername = (rule, value, callback) => {
			if (!validUsername(value)) {
				callback(new Error('请输入正确用户名'))
			} else {
				callback()
			}
		}
		const validatePassword = (rule, value, callback) => {
			if (value.length < 6) {
				callback(new Error('密码不能小于6位'))
			} else {
				callback()
			}
		}
		return {
			loginForm: {
				username: 'admin',
				password: '12341234',
			},
			loginRules: {
				username: [
					{ required: true, trigger: 'blur', validator: validateUsername },
				],
				password: [
					{ required: true, trigger: 'blur', validator: validatePassword },
				],
			},
			loading: false,
			redirect: undefined,
		}
	},
	watch: {
		$route: {
			handler: function (route) {
				this.redirect = route.query && route.query.redirect
			},
			immediate: true,
		},
	},
	methods: {
		handleLogin() {
			this.$refs.loginForm.validate((valid) => {
				if (valid) {
					this.loading = true
					this.$store
						.dispatch('user/login', this.loginForm)
						.then(() => {
							this.$router.push({ path: this.redirect || '/' })
							this.loading = false
						})
						.catch(() => {
							this.loading = false
						})
				} else {
					console.log('error submit!!')
					return false
				}
			})
		},
	},
}
</script>

<style lang="scss">
.el-form-item {
	position: relative;
	input {
		padding-left: 30px;
	}
}
</style>

<style lang="scss" scoped>
.login-container {
	color: #515563;
	min-height: 100%;
	width: 100%;
	overflow: hidden;

	.img,
	.fuzzy {
		position: fixed;
		width: 100%;
		height: 100%;
	}

	.img {
		background: url(~@/assets/login/IMG_002.jpg) center;
		background-size: cover;
	}

	.fuzzy {
		background-image: radial-gradient(
				rgba(0, 0, 0, 0) 0%,
				rgba(0, 0, 0, 0.5) 100%
			),
			radial-gradient(rgba(0, 0, 0, 0) 33%, rgba(0, 0, 0, 0.3) 166%);
	}

	.form-container {
		position: absolute;
		@include flexLayout($jc: center, $ai: center);
		width: 100%;
		height: 100%;
		.login-form {
			background-color: #fff;
			padding: 20px 50px;
			width: 400px;
			border-radius: 7px;
			box-shadow: 0, 0, 10px, rgba(0, 0, 0, 0.8);

			.title-container {
				line-height: 40px;
			}

			.svg-container {
				position: absolute;
				z-index: 100;
				// color: #515563;
			}

			.svg-container {
				left: 7px;
			}

			.tips {
				text-align: center;
				font-size: 12px;
				span {
					cursor: pointer;
					user-select: none;
					&:hover {
						color: $theme-color;
					}
				}
			}
		}
	}
}
</style>