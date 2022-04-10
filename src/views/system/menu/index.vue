<template>
  <div class="menu-container-wrapper">
    <div class="menu-container">
      <el-form :inline="true" :model="searchFormData" size="mini" style="width: 100%"
        class="form-search">
        <el-form-item label="课程名称：">
          <el-input v-model="searchFormData.title"></el-input>
        </el-form-item>
        <el-form-item label="价格：">
          <el-select v-model.trim="searchFormData.isFree" filterable clearable>
            <el-option label="收费" :value="0"></el-option>
            <el-option label="免费" :value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="状态：">
          <el-select v-model.trim="searchFormData.isAudit" filterable clearable>
            <el-option label="未审核" :value="0"></el-option>
            <el-option label="已审核" :value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item class="btn-form-item">
          <el-button icon="el-icon-search" @click="onSubmit">查询</el-button>
          <el-button icon="el-icon-refresh" @click="onReset">重置</el-button>
          <!-- <el-button icon="el-icon-circle-plus-outline" @click="addCategory">新增</el-button> -->
        </el-form-item>
      </el-form>
    </div>

    <div class="menu-container">
      <!-- 数据表格的展示 -->
      <el-table ref="singleTable" v-loading="loading" :data="dataList"
        highlight-current-row style="width: 100%" row-key="id">
        <!-- <el-table-column align="center" type="index" min-width="50" /> -->

        <el-table-column property="name" label="名称" min-width="100" align="center" />

        <el-table-column property="code" label="权限标识" min-width="100" align="center" />

        <el-table-column property="code" label="类型" min-width="100" align="center">
          <template v-slot="{ row }">
            <!-- 类型(1目录，2菜单，3按钮) -->
            <!-- <div v-if="row.type === 1">目录</div>
            <div v-if="row.type === 2">菜单</div>
            <div v-if="row.type === 3">按钮</div> -->
            <div>{{row.type}}</div>
          </template>
        </el-table-column>

        <!-- <el-table-column property="sort" label="封面图" width="135" align="center">
          <template v-slot="{ row }">
          </template>
        </el-table-column> -->

        <el-table-column label="操作" align="center" min-width="210">
          <template v-slot="{ row }">
            <el-button icon="el-icon-circle-plus-outline" size="mini"
              @click="handlerAdd(row)">
              新增
            </el-button>
            <el-button type="info" plain size="mini" :disabled="row.isAudit === 1"
              @click="handlerAudit(row)">审核
            </el-button>
            <el-button type="danger" size="mini" @click="handlerDel(row.id)">删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 课程审核组件 -->
      <!-- <course-edit :courseInfo="courseInfo" :dialogFormVisible.sync="dialogFormVisible"
        @refreshList="fetchMenuList" /> -->
    </div>
  </div>
</template>

<script>
// import { getCourseList, queryCourse, deleteCourse } from '@/api/course'
import { getMenuList } from '@/api/menu'
import { throttling } from '@/utils/limit-request'

export default {
	name: 'Course',
	components: {
		// CourseEdit,
	},
	data() {
		return {
			dataList: [],
			searchFormData: {
				title: '',
				isFree: '',
				isAudit: '',
			},
			total: 0,
			currentPage: 1,
			pageSize: 10,
			dialogFormVisible: false,
			courseInfo: {},
			loading: true,
		}
	},

	async created() {
		this.fetchMenuList()
	},

	methods: {
		// 初始化列表数据
		async fetchMenuList() {
			const { data } = await getMenuList()
			this.dataList = data
			this.loading = false
		},
		// 条件查询列表数据
		async queryCourse() {
			let odds = {
				keyWord: this.searchFormData.title,
				isFree: this.searchFormData.isFree,
				isAudit: this.searchFormData.isAudit,
			}
			this.currentPage = 1
			this.pageSize = 10
			const { data } = await queryCourse(odds)
			this.total = data.total
			this.dataList = data.records
		},
		// 表单提交
		onSubmit: throttling(
			function () {
				if (
					!this.searchFormData.title &&
					this.searchFormData.isFree === '' &&
					this.searchFormData.isAudit === ''
				) {
					this.$message({
						message: '请输入或选择内容后再查询！',
						type: 'warning',
					})
					return
				}
				// this.queryCourse()
			},
			2000,
			true
		),
		// 重置按钮处理函数
		onReset: throttling(
			function () {
				this.currentPage = 1
				this.pageSize = 10
				this.searchFormData.title = ''
				this.searchFormData.isFree = ''
				this.searchFormData.isAudit = ''
				this.fetchMenuList()
			},
			2000,
			true
		),
		setIndex(index) {
			return (this.currentPage - 1) * this.pageSize + index + 1
		},
		// 操作中的新增按钮处理函数
		handlerAdd() {
			this.$message('新增内容')
		},
		// 操作审核按钮处理函数
		handlerAudit(item) {
			this.courseInfo = item
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
					// await deleteCourse(id)
					this.$message.success('删除课程成功！')
					this.fetchMenuList()
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
.menu-container {
	@include roundContainer;
	min-width: 770px;
}
</style>
