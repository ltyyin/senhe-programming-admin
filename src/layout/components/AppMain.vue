<template>
  <section class="app-main">
    <div class="app-main-inner">
      <transition name="fade-transform" mode="out-in">
        <keep-alive :include="cachedViews">
          <router-view :key="key" />
        </keep-alive>
      </transition>
    </div>
  </section>
</template>

<script>
export default {
	name: 'AppMain',
	computed: {
		key() {
			return this.$route.path
		},
		cachedViews() {
			return this.$store.state.tagsView.cachedViews
		},
	},
}
</script>

<style lang="scss" scoped>
.app-main {
	/*50 = navbar  */
	min-height: calc(100vh - 50px);
	width: 100%;
	position: relative;
	overflow: hidden;
	background-color: #f3f3f3;
	// padding: 20px 15px 0;

	.app-main-inner {
		width: 100%;
		overflow-x: auto;
	}
}
// .fixed-header + .app-main {
/* padding-top: 50px; */
// padding-top: 100px;
// }

.hasTagsView {
	.app-main {
		/* 84 = navbar + tags-view = 50 + 34 */
		min-height: calc(100vh);
	}
	.fixed-header + .app-main {
		padding-top: 90px;
	}
}
</style>

<style lang="scss">
// fix css style bug in open el-dialog
.el-popup-parent--hidden {
	.fixed-header {
		padding-right: 15px;
	}
}
</style>
