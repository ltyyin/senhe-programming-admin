<template>
  <div class="label-container-wrapper">
    <div class="query-container">
      <el-form :inline="true" :model="searchFormData" size="mini" style="width: 100%"
        class="form-search">
        <el-form-item label="标签名称：">
          <el-input v-model="searchFormData.name"></el-input>
        </el-form-item>
        <el-form-item label="分类名称：">
          <el-select v-model.trim="searchFormData.categoryId" filterable clearable>
            <el-option v-for="category of categoryList" :key="category.id"
              :label="category.name" :value="category.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item class="btn-form-item">
          <el-button icon="el-icon-search" @click="onSubmit">查询</el-button>
          <el-button icon="el-icon-refresh" @click="onReset">重置</el-button>
          <el-button icon="el-icon-circle-plus-outline" @click="addLabel">新增</el-button>
        </el-form-item>
      </el-form>
    </div>

    <div class="label-container">
      <!-- 数据表格的展示 -->
      <el-table ref="singleTable" v-loading="loading" :data="
        listData.slice((currentPage - 1) * pageSize, currentPage * pageSize)
      " highlight-current-row style="width: 100%" stripe>
        <el-table-column align="center" :index="setIndex" type="index" min-width="50">
        </el-table-column>
        <el-table-column property="name" label="标签名称" min-width="100" align="center">
        </el-table-column>
        <el-table-column property="categoryName" label="分类名称" align="center"
          min-width="200">
        </el-table-column>
        <el-table-column label="操作" align="center" min-width="150">
          <template v-slot="{ row }">
            <el-button size="mini" @click="handlerEdit(row)">编辑</el-button>
            <el-button type="danger" size="mini" @click="handlerDel(row.id)">删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页功能模块 -->
      <div class="pagination-wrapper">
        <el-pagination @current-change="handleCurrentChange" :current-page="currentPage"
          :page-sizes="[10, 15, 20, 50]" :page-size.sync="pageSize"
          layout="total, sizes, prev, pager, next, jumper" :total="total" background
          popper-class="drop-down-box"></el-pagination>
      </div>

      <!-- 弹出的编辑框 -->
      <label-edit v-if="dialogFormVisible" :title="title"
        :dialogFormVisible.sync="dialogFormVisible" :isAdd.sync="isAdd"
        :categoryList="categoryList" @refreshList="getLabelListData"
        :labelItem="labelItem" />
    </div>
  </div>
</template>

<script>
import { getLabelListData, queryLabelList, deleteLabel } from '@/api/label'
import { getNormalList } from '@/api/category'
import { throttling } from '@/utils/limit-request'
import LabelEdit from './components/LabelEdit.vue'

export default {
	name: 'Label',
	components: {
		LabelEdit,
	},
	data() {
		return {
			listData: [],
			categoryList: [],
			searchFormData: {
				name: '',
				categoryId: '',
			},
			total: 0,
			currentPage: 1,
			pageSize: 10,
			dialogFormVisible: false,
			title: '',
			isAdd: false,
			labelItem: null,
			loading: true,
		}
	},

	async created() {
		this.getLabelListData()
		this.getNormalCategoryList()
	},

	methods: {
		// 初始化列表数据
		async getLabelListData() {
			const { data } = await getLabelListData()
			this.total = data.total
			this.listData = data.records
			this.loading = false
		},

		async getNormalCategoryList() {
			const { data } = await getNormalList()
			this.categoryList = data
		},

		// 条件插叙列表数据
		async queryLabelList() {
			let odds = {
				keyWord: this.searchFormData.name,
				categoryId: this.searchFormData.categoryId,
			}
			this.currentPage = 1
			this.pageSize = 10
			const { data } = await queryLabelList(odds)
			this.total = data.total
			this.listData = data.records
		},
		// 删除指定分类标签
		async deleteLabel(id) {
			const res = await deleteLabel(id)
		},
		// 表单提交
		onSubmit: throttling(
			function () {
				if (!this.searchFormData.name && !this.searchFormData.categoryId) {
					this.$message({
						message: '请输入或选择内容后再查询！',
						type: 'warning',
					})
					return
				}
				this.queryLabelList()
			},
			2000,
			true
		),
		// 重置按钮处理函数
		onReset: throttling(
			function () {
				this.currentPage = 1
				this.pageSize = 10
				this.searchFormData.name = ''
				this.searchFormData.categoryId = null
				this.getLabelListData()
			},
			2000,
			true
		),
		addLabel() {
			this.title = '新增标签'
			this.isAdd = true
			this.dialogFormVisible = true
		},
		setIndex(index) {
			return (this.currentPage - 1) * this.pageSize + index + 1
		},
		// 操作编辑按钮处理函数
		async handlerEdit(labelItem) {
			this.labelItem = labelItem
			this.dialogFormVisible = true
		},
		// 操作删除按钮处理函数
		handlerDel(id) {
			this.$confirm('此操作将永久删除该分类, 是否继续?', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning',
			})
				.then(async () => {
					await this.deleteLabel(id)
					this.$message({
						type: 'success',
						message: '删除成功!',
					})
					this.getLabelListData()
				})
				.catch(() => {
					this.$message({
						type: 'info',
						message: '已取消删除',
					})
				})
		},
		handleCurrentChange(currentPage) {
			this.currentPage = currentPage
		},
	},
}
</script>

<style lang="scss" scoped>
.label-container-wrapper {
	.query-container,
	.label-container {
		@include roundContainer;
		min-width: 480px;
	}
}
</style>
