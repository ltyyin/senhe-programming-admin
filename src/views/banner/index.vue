<template>
  <div class="banner-container-wrapper">

    <div class="banner-container">
      <el-form :inline="true" size="mini" style="width: 100%" class="form-search">
        <el-form-item class="btn-form-item">
          <el-button icon="el-icon-circle-plus-outline" @click="onAdd">新增</el-button>
        </el-form-item>
      </el-form>
    </div>

    <div class="banner-container">
      <el-table ref="dragTable" v-loading="listLoading" :data="list" row-key="id" fit
        highlight-current-row style="width: 100%">

        <el-table-column property="id" label="# (拖拽排序)" min-width="100" align="center" />

        <el-table-column property="sort" label="封面图" min-width="120" align="center">
          <template v-slot="{ row }">
            <img :src="row.cover" alt="封面图" style="width: 135px; height: 70px;">
          </template>
        </el-table-column>

        <el-table-column property="title" label="标题" min-width="100" align="center" />

        <el-table-column property="url" label="跳转URL" min-width="120" align="center" />

        <el-table-column property="remark" label="备注" min-width="130" align="center" />

        <el-table-column label="操作" align="center" min-width="150">
          <template v-slot="{ row }">
            <el-button size="mini" @click="handlerEdit(row)">编辑</el-button>
            <el-button type="danger" size="mini" @click="handlerDel(row.id)">删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 编辑框 -->
    <banner-edit :dialogFormVisible.sync="dialogFormVisible" :title="title"
      :bannerItem="bannerItem" :isAdd.sync="isAdd" @refreshList="fetchListData" />
  </div>
</template>

<script>
import Sortable from 'sortablejs'
import { getBannerList, deleteBanner } from '@/api/banner'
import BannerEdit from './components/BannerEdit.vue'

export default {
	name: 'DragTable',
	components: {
		BannerEdit,
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
			dialogFormVisible: false,
			bannerItem: {},
			title: '',
			isAdd: false,
		}
	},
	created() {
		this.fetchListData()
	},
	methods: {
		// 获取banner列表数据
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
		// sortable 的配置
		setSort() {
			const el = this.$refs.dragTable.$el.querySelectorAll(
				'.el-table__body-wrapper > table > tbody'
			)[0]
			this.sortable = Sortable.create(el, {
				ghostClass: 'sortable-ghost',
				onEnd: (evt) => {
					const targetRow = this.list.splice(evt.oldIndex, 1)[0]
					this.list.splice(evt.newIndex, 0, targetRow)
					console.log(this.list)
				},
			})
		},
		// 处理编辑按钮函数
		handlerEdit(item) {
			this.bannerItem = item
			this.title = '编辑轮播图'
			this.dialogFormVisible = true
		},
		// 处理删除按钮函数
		handlerDel(id) {
			this.$confirm('此操作将永久删除该分类, 是否继续?', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning',
			})
				.then(async () => {
					await deleteBanner(id)
					this.$message({
						type: 'success',
						message: '删除成功!',
					})
					this.fetchListData()
				})
				.catch(() => {
					this.$message({
						type: 'info',
						message: '已取消删除',
					})
				})
		},
		// 添加新banner函数
		onAdd() {
			this.title = '新增轮播图'
			this.isAdd = true
			this.dialogFormVisible = true
		},
	},
}
</script>

<style>
.sortable-ghost {
	opacity: 0.8;
	color: #fff !important;
	background: rgb(198, 255, 230) !important;
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
