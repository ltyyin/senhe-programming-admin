<template>
  <div class="category-container-wrapper">
    <div class="category-container">
      <el-form :inline="true" :model="searchFormData" size="mini" style="width: 100%"
        class="form-search">
        <el-form-item label="分类名称：">
          <el-input v-model="searchFormData.name"></el-input>
        </el-form-item>
        <el-form-item label="状态：">
          <el-select v-model.trim="searchFormData.status" filterable clearable>
            <el-option label="禁用" :value="0"></el-option>
            <el-option label="正常" :value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item class="btn-form-item">
          <el-button icon="el-icon-search" @click="onSubmit">查询</el-button>
          <el-button icon="el-icon-refresh" @click="onReset">重置</el-button>
          <el-button icon="el-icon-circle-plus-outline" @click="addCategory">新增
          </el-button>
        </el-form-item>
      </el-form>
    </div>

    <div class="category-container">
      <!-- 数据表格的展示 -->
      <el-table ref="singleTable" v-loading="loading" :data="
        listData.slice((currentPage - 1) * pageSize, currentPage * pageSize)
      " highlight-current-row style="width: 100%" stripe>
        <el-table-column label="#" align="center" :index="setIndex" type="index"
          width="100" />

        <el-table-column property="name" label="分类名称" min-width="100" align="center" />

        <el-table-column property="sort" label="排序" width="60" align="center" />

        <el-table-column property="remark" label="备注" align="center" min-width="200" />

        <el-table-column label="状态" align="center" width="80">
          <template v-slot="{ row }">
            <el-tag :type="row.status | statusFilter" size="small">
              {{ row.status === 0 ? "禁用" : "正常" }}</el-tag>
          </template>
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

      <category-edit v-if="dialogFormVisible" :title="title"
        :dialogFormVisible.sync="dialogFormVisible" :isAddCategory.sync="isAddCategory"
        :editFormData="editFormData" @refreshList="getCategoryListData"></category-edit>
    </div>
  </div>
</template>

<script>
import {
	getCategoryListData,
	queryCategory,
	deleteCategory,
} from '@/api/category'
import { throttling } from '@/utils/limit-request'
import CategoryEdit from './components/CategoryEdit.vue'

export default {
	name: 'Category',
	components: {
		CategoryEdit,
	},
	data() {
		return {
			listData: [],
			searchFormData: {
				name: '',
				status: '',
			},
			total: 0,
			currentPage: 1,
			pageSize: 10,
			dialogFormVisible: false,
			title: '',
			isAddCategory: false,
			editFormData: null,
			loading: true,
		}
	},

	async created() {
		this.getCategoryListData()
	},

	methods: {
		// 初始化列表数据
		async getCategoryListData() {
			try {
				const { data } = await getCategoryListData()
				this.total = data.total
				this.listData = data.records
			} catch (error) {}
			this.loading = false
		},
		// 条件插叙列表数据
		async queryCategory() {
			let odds = {
				keyWord: this.searchFormData.name,
				status: this.searchFormData.status,
			}
			this.currentPage = 1
			this.pageSize = 10
			const { data } = await queryCategory(odds)
			this.total = data.total
			this.listData = data.records
		},
		// 删除指定分类标签
		async deleteCategory(id) {
			const res = await deleteCategory(id)
		},
		// 表单提交
		onSubmit: throttling(
			function () {
				if (!this.searchFormData.name && this.searchFormData.status === '') {
					this.$message({
						message: '请输入或选择内容后再查询！',
						type: 'warning',
					})
					return
				}
				this.queryCategory()
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
				this.searchFormData.status = null
				this.getCategoryListData()
			},
			2000,
			true
		),
		addCategory() {
			this.title = '新增分类'
			this.isAddCategory = true
			this.dialogFormVisible = true
		},
		setIndex(index) {
			return (this.currentPage - 1) * this.pageSize + index + 1
		},
		// 操作编辑按钮处理函数
		async handlerEdit(categoryItem) {
			this.title = '编辑分类'
			this.editFormData = categoryItem
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
					await this.deleteCategory(id)
					this.$message({
						type: 'success',
						message: '删除成功!',
					})
					this.getCategoryListData()
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
	filters: {
		statusFilter(val) {
			return val === 0 ? 'danger' : 'success'
		},
	},
}
</script>

<style lang="scss" scoped>
.category-container {
	@include roundContainer;
	min-width: 770px;
}
</style>
