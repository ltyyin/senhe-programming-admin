<template>
  <div class="navbar">
    <hamburger :is-active="sidebar.opened" class="hamburger-container"
      @toggleClick="toggleSideBar" />

    <breadcrumb class="breadcrumb-container" />

    <div class="right-menu">
      <div class="avatar-container">
        <img :src="avatar" alt="avatar" style="width: 40px; height: 40px" />
        <span>{{name}}</span>
        <span @click="logout">[退出]</span>
      </div>
    </div>

    <!-- <div class="right-menu">
      <el-dropdown class="avatar-container" trigger="click">
        <el-dropdown-menu slot="dropdown" class="user-dropdown">
          <el-dropdown-item divided @click.native="logout">
            <span style="display: block">退出登录</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div> -->
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'

export default {
	components: {
		Breadcrumb,
		Hamburger,
	},
	computed: {
		...mapGetters(['sidebar', 'avatar', 'name']),
	},
	methods: {
		toggleSideBar() {
			this.$store.dispatch('app/toggleSideBar')
			console.log(this.avatar)
		},
		logout() {
			this.$confirm('此操作将退出登录, 是否继续?', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning',
			})
				.then(async () => {
					this.$message({
						type: 'success',
						message: '已退出登录!',
					})
					await this.$store.dispatch('user/logout')
					this.$router.push(`/login?redirect=${this.$route.fullPath}`)
				})
				.catch(() => {})
		},
	},
}
</script>

<style lang="scss" scoped>
.navbar {
	height: 50px;
	overflow: hidden;
	position: relative;
	background: #fff;
	// box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
	border-bottom: 1px solid rgb(240, 240, 240);

	.hamburger-container {
		line-height: 46px;
		height: 100%;
		float: left;
		cursor: pointer;
		transition: background 0.3s;
		-webkit-tap-highlight-color: transparent;

		&:hover {
			background: rgba(0, 0, 0, 0.025);
		}
	}

	.breadcrumb-container {
		float: left;
	}

	.right-menu {
		float: right;
		height: 100%;
		@include flexLayout($ai: center);

		.avatar-container {
			@include flexLayout($ai: center);
			margin-right: 30px;
			cursor: pointer;
			img {
				border-radius: 20px;
			}
			span {
				color: #1d2837;
				margin-left: 5px;
				&:last-child {
					font-size: 13px;
					transition: 0.3s;
					margin-left: 10px;
					&:hover {
						color: red;
					}
				}
			}
		}

		// 	&:focus {
		// 		outline: none;
		// 	}

		// 	.right-menu-item {
		// 		display: inline-block;
		// 		padding: 0 8px;
		// 		height: 100%;
		// 		font-size: 18px;
		// 		color: #5a5e66;
		// 		vertical-align: text-bottom;

		// 		&.hover-effect {
		// 			cursor: pointer;
		// 			transition: background 0.3s;

		// 			&:hover {
		// 				background: rgba(0, 0, 0, 0.025);
		// 			}
		// 		}
		// 	}

		// 	.avatar-container {
		// 		margin-right: 30px;

		// 		.avatar-wrapper {
		// 			margin-top: 5px;
		// 			position: relative;

		// 			.user-avatar {
		// 				cursor: pointer;
		// 				width: 40px;
		// 				height: 40px;
		// 				border-radius: 10px;
		// 			}

		// 			.el-icon-caret-bottom {
		// 				cursor: pointer;
		// 				position: absolute;
		// 				right: -20px;
		// 				top: 25px;
		// 				font-size: 12px;
		// 			}
		// 		}
		// 	}
	}
}
</style>
