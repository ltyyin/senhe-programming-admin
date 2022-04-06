<template>
	<div class="dashboard-container">
		<div class="dashboard-text">name: {{ name }}</div>
		<button @click="request">发生请求</button>
	</div>
</template>

<script>
import { mapGetters } from 'vuex'
import { testApi } from '@/api/test'

export default {
	name: 'Dashboard',
	computed: {
		...mapGetters(['name']),
	},
	methods: {
		async request() {
			const res = await testApi({ name: 'lisa' })
			console.log(res)
		},
	},
}
</script>

<style lang="scss" scoped>
.dashboard {
	&-container {
		margin: 30px;
	}
	&-text {
		font-size: 30px;
		line-height: 46px;
	}
}
</style>
