<template>
  <div ref="pieCart" :style="{height:height,width:width}"></div>
</template>

<script>
import * as echarts from 'echarts/core'
import {
	TitleComponent,
	TooltipComponent,
	LegendComponent,
} from 'echarts/components'
import { PieChart } from 'echarts/charts'
import { LabelLayout } from 'echarts/features'
import { CanvasRenderer } from 'echarts/renderers'

// 自适应窗口大小改变图表的大小
import resize from './mixins/resize'

echarts.use([
	TitleComponent,
	TooltipComponent,
	LegendComponent,
	PieChart,
	CanvasRenderer,
	LabelLayout,
])

export default {
	name: 'PieChart',
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
		courseTypeCount: {
			type: Array,
			required: true,
		},
	},
	mounted() {
		this.$nextTick(() => {
			this.chart = echarts.init(this.$refs.pieCart)
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
					text: '各技术课程类型统计',
					left: 'center',
				},
				tooltip: {
					trigger: 'item',
					formatter: '{a} <br/>{b} : {c} ({d}%)',
				},
				legend: {
					orient: 'vertical',
					left: 'left',
				},
				series: [
					{
						name: '统计内容',
						type: 'pie',
						radius: '50%',
						center: ['50%', '60%'],
						data: this.courseTypeCount,
						emphasis: {
							itemStyle: {
								shadowBlur: 10,
								shadowOffsetX: 0,
								shadowColor: 'rgba(0, 0, 0, 0.5)',
							},
						},
					},
				],
			},
		}
	},
}
</script>

<style lang="scss" scoped>
</style>