<template>
  <div class="banner-container">

    <el-table ref="dragTable" v-loading="listLoading" :data="list" row-key="id" fit
      highlight-current-row style="width: 100%">

      <el-table-column property="id" label="# (拖拽排序)" min-width="100" align="center" />

      <el-table-column property="sort" label="封面图" min-width="135" align="center">
        <template v-slot="{ row }">
          <!-- <el-image class="image" :src="row.cover[0]" :preview-src-list="row.cover"
            fit="contain" /> -->
          <img :src="row.cover" alt="封面图" style="width: 135px; height: 70px;">
        </template>
      </el-table-column>

      <el-table-column property="title" label="标题" min-width="100" align="center" />

      <el-table-column property="url" label="跳转URL" min-width="120" align="center" />

      <el-table-column property="remark" label="备注" min-width="100" align="center" />

      <!-- <el-table-column align="center" label="拖拽排序" min-width="80">
        <template slot-scope="{}">
          <svg-icon class="drag-handler" icon-class="drag" />
        </template>
      </el-table-column> -->

      <el-table-column label="操作" align="center" min-width="150">
        <template v-slot="{ row }">
          <el-button size="mini" @click="handlerEdit(row)">编辑</el-button>
          <el-button type="danger" size="mini" @click="handlerDel(row.id)">删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import Sortable from 'sortablejs'
import { getBannerList } from '@/api/banner'

export default {
	name: 'DragTable',
	filters: {
		statusFilter(status) {
			const statusMap = {
				published: 'success',
				draft: 'info',
				deleted: 'danger',
			}
			return statusMap[status]
		},
	},
	data() {
		return {
			list: [],
			total: 0,
			listLoading: true,
			listQuery: {
				page: 1,
				limit: 10,
			},
			sortable: null,
		}
	},
	created() {
		this.fetchListData()
	},
	methods: {
		async fetchListData() {
			try {
				const { data } = await getBannerList()
				this.list = data.records
				this.total = data.total
			} catch (err) {}
			this.listLoading = false

			this.$nextTick(() => {
				this.setSort()
			})
		},
		setSort() {
			const el = this.$refs.dragTable.$el.querySelectorAll(
				'.el-table__body-wrapper > table > tbody'
			)[0]
			this.sortable = Sortable.create(el, {
				ghostClass: 'sortable-ghost',
				onEnd: (evt) => {
					const targetRow = this.list.splice(evt.oldIndex, 1)[0]
					console.log(targetRow)
					this.list.splice(evt.newIndex, 0, targetRow)
				},
			})
		},
		handlerEdit(item) {
			console.log(item)
		},
		handlerDel(id) {
			console.log(id)
		},
	},
}
</script>

<style>
.sortable-ghost {
	opacity: 0.8;
	color: #fff !important;
	background: rgb(236, 248, 243) !important;
}
</style>

<style lang="scss" scoped>
.banner-container {
	@include roundContainer;
	min-width: 770px;
	.icon-star {
		margin-right: 2px;
	}
	.drag-handler {
		width: 20px;
		height: 20px;
		cursor: pointer;
	}
}
</style>
