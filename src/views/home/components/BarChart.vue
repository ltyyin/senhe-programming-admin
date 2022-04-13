<template >
  <div ref="barChart" :style="{height:height,width:width}"></div>
</template>

<script>
import * as echarts from 'echarts/core'
import { TooltipComponent, GridComponent } from 'echarts/components'
import { BarChart } from 'echarts/charts'
import { CanvasRenderer } from 'echarts/renderers'

echarts.use([TooltipComponent, GridComponent, BarChart, CanvasRenderer])

// 自适应窗口大小改变图表的大小
import resize from './mixins/resize'

export default {
	name: 'BarChart',
	mixins: [resize],
	props: {
		width: {
			type: String,
			default: '100%',
		},
		height: {
			type: String,
			default: '400px',
		},
		articleMonthCount: {
			type: Array,
			required: true,
		},
	},
	mounted() {
		this.$nextTick(() => {
			this.chart = echarts.init(this.$refs.barChart)
			this.chart.setOption(this.option)
		})
	},
	destroyed() {
		this.chart.dispose()
		this.chart = null
	},
	data() {
		return {
			chart: null,
			option: {
				title: {
					text: '近8个月发布的文章数',
					left: 'center',
				},
				tooltip: {
					trigger: 'axis',
					axisPointer: {
						type: 'shadow',
					},
				},
				grid: {
					left: '3%',
					right: '4%',
					bottom: '3%',
					containLabel: true,
				},
				xAxis: [
					{
						type: 'category',
						data: [
							'近1月',
							'近2月',
							'近3月',
							'近4月',
							'近5月',
							'近6月',
							'近7月',
							'近8月',
						],
						axisTick: {
							alignWithLabel: true,
						},
					},
				],
				yAxis: [
					{
						type: 'value',
					},
				],
				series: [
					{
						name: '发布数',
						type: 'bar',
						barWidth: '60%',
						data: this.articleMonthCount,
					},
				],
			},
		}
	},
}
</script>