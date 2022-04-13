<template>
  <div class="home-container">
    <!-- 面板统计组件 -->
    <panel-group :userTotal="userTotal" :articleTotal="articleTotal"
      :courseTotal="courseTotal" :questionTotal="questionTotal" />
    <el-row :gutter="40" justify="center">
      <el-col :xs="24" :sm="24" :lg="12">
        <el-card :body-style="{ marginTop: '10px',minHeight: '400px'}">
          <pie-chart :courseTypeCount="courseTypeCount"
            v-if="courseTypeCount.length !== 0" />
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="24" :lg="12">
        <el-card :body-style="{ marginTop: '10px',minHeight: '400px'}">
          <bar-chart :articleMonthCount="articleMonthCount"
            v-if="articleMonthCount.length !== 0" />
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import PieChart from './components/PieChart'
import BarChart from './components/BarChart.vue'
import PanelGroup from './components/PanelGroup'

import { getListData } from '@/api/home'

export default {
	name: 'Home',
	components: {
		PieChart,
		BarChart,
		PanelGroup,
	},
	created() {
		this.getListData()
	},
	data() {
		return {
			userTotal: 0, // 总用户
			articleTotal: 0, //总文章
			courseTotal: 0, // 总课程
			questionTotal: 0, // 总问答
			courseTypeCount: [],
			articleMonthCount: [],
		}
	},
	methods: {
		async getListData() {
			const { data } = await getListData()
			console.log(data)
			this.userTotal = data.panelGroup.userTotal
			this.courseTotal = data.panelGroup.courseTotal
			this.articleTotal = data.panelGroup.articleTotal
			this.questionTotal = data.panelGroup.questionTotal
			this.courseTypeCount = data.courseTypeCount
			this.articleMonthCount = data.articleMonthCount
		},
	},
}
</script>

<style lang="scss" scoped>
.home-container {
	// @include roundContainer;
	padding: 0 20px;
}

.el-card {
	border-radius: 7px;
}
</style>  
