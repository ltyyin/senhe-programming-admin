<template>
  <div class="course-container-wrapper">
    <div class="course-container">
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

    <div class="course-container">
      <!-- 数据表格的展示 -->
      <el-table ref="singleTable" v-loading="loading" :data="
        dataList.slice((currentPage - 1) * pageSize, currentPage * pageSize)
      " highlight-current-row style="width: 100%" stripe>
        <el-table-column label="#" :index="setIndex" type="index" width="100"
          align="center" />

        <el-table-column property="title" label="课程标题" min-width="100" align="center" />

        <el-table-column property="sort" label="封面图" min-width="135" align="center">
          <template v-slot="{ row }">
            <!-- <el-image class="image" :src="row.cover[0]" :preview-src-list="row.cover"
            fit="contain" /> -->
            <img :src="row.cover" alt="课程主封面" style="width: 135px; height: 70px;">
          </template>
        </el-table-column>

        <el-table-column property="authorName" label="作者" align="center"
          min-width="100" />

        <el-table-column label="原价" align="center" min-width="80">
          <template v-slot="{ row }">
            <el-tag type="info" effect="plain">
              {{ row.isFree ? "免 费" : row.priceOriginal}}
            </el-tag>
          </template>
        </el-table-column>

        <el-table-column label="优惠价" align="center" min-width="80">
          <template v-slot="{ row }">
            <el-tag type="warning" effect="plain">
              {{ row.isFree ?	"无优惠" : row.priceDiscount}}
            </el-tag>
          </template>
        </el-table-column>

        <el-table-column label="状态" align="center" min-width="80">
          <template v-slot="{ row }">
            <el-tag v-if="!row.isAudit" type="warning">未审核</el-tag>
            <el-tag v-else type="success">已审核</el-tag>
          </template>
        </el-table-column>

        <el-table-column label="操作" align="center" min-width="210">
          <template v-slot="{ row }">
            <el-button size="mini" @click="detail(row)">详情</el-button>
            <el-button type="info" plain size="mini" :disabled="row.isAudit === 1"
              @click="handlerAudit(row)">审核
            </el-button>
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

      <!-- 课程审核组件 -->
      <course-edit :courseInfo="courseInfo" :dialogFormVisible.sync="dialogFormVisible"
        @refreshList="fetchCourseList" />
    </div>
  </div>
</template>

<script>
import { getCourseList, queryCourse, deleteCourse } from '@/api/course'
import { throttling } from '@/utils/limit-request'
import CourseEdit from './components/CourseEdit.vue'

export default {
	name: 'Course',
	components: {
		CourseEdit,
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
		this.fetchCourseList()
	},

	methods: {
		// 初始化列表数据
		async fetchCourseList() {
			try {
				const { data } = await getCourseList()
				this.total = data.total
				this.dataList = data.records
			} catch (err) {}
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
				this.queryCourse()
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
				this.fetchCourseList()
			},
			2000,
			true
		),
		setIndex(index) {
			return (this.currentPage - 1) * this.pageSize + index + 1
		},
		// 操作中的详情按钮处理函数
		detail() {
			this.$message('详情内容')
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
					await deleteCourse(id)
					this.$message.success('删除课程成功！')
					this.fetchCourseList()
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
.course-container {
	@include roundContainer;
	min-width: 770px;

	.image {
		width: 160px;
		height: 80px;
	}
}
</style>
