<template>
  <div class="article-container-wrapper">
    <div class="article-container">
      <!-- 表单输出 -->
      <el-form :inline="true" :model="searchFormData" size="mini" style="width: 100%"
        class="form-search">
        <el-form-item label="分类名称：">
          <el-input v-model="searchFormData.name"></el-input>
        </el-form-item>
        <el-form-item label="公开：">
          <el-select v-model.trim="searchFormData.isPublic" filterable clearable>
            <el-option label="未公开" :value="0"></el-option>
            <el-option label="公开" :value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="状态：">
          <el-select v-model.trim="searchFormData.status" filterable clearable>
            <!-- 0:已删除, 1:未审核, 2:审核通过, 3:审核未通过 -->
            <el-option label="已删除" :value="0"></el-option>
            <el-option label="未审核" :value="1"></el-option>
            <el-option label="已通过" :value="2"></el-option>
            <el-option label="未通过" :value="3"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item class="btn-form-item">
          <el-button icon="el-icon-search" @click="onSubmit">查询</el-button>
          <el-button icon="el-icon-refresh" @click="onReset">重置</el-button>
        </el-form-item>
      </el-form>
    </div>

    <div class="article-container">
      <!-- 数据表格的展示 -->
      <el-table ref="singleTable" v-loading="loading"
        :data="dataList.slice((currentPage - 1) * pageSize, currentPage * pageSize)"
        highlight-current-row style="width: 100%" stripe>
        <el-table-column align="center" :index="setIndex" type="index" min-width="50">
        </el-table-column>
        <el-table-column property="title" label="文章标题" min-width="100" align="center">
        </el-table-column>
        <el-table-column property="viewCount" label="浏览数" align="center" min-width="100">
        </el-table-column>
        <el-table-column property="thumhup" label="点赞数" align="center" min-width="100">
        </el-table-column>
        <el-table-column label="是否公开" align="center" min-width="80">
          <template v-slot="{ row }">
            <!-- 0: 不公开 1：公开 -->
            <el-switch :value="row.isPublic === 1" disabled></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="状态" align="center" min-width="80">
          <template v-slot="{ row }">
            <!-- 0:已删除, 1:未审核, 2:审核通过, 3:审核未通过 -->
            <el-tag type="danger" v-if="row.status === 0">已删除</el-tag>
            <el-tag type="info" v-if="row.status === 1">未审核</el-tag>
            <el-tag type="success" v-if="row.status === 2">已通过</el-tag>
            <el-tag type="warning" v-if="row.status === 3">未通过</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="时间" align="center" min-width="100">
          <template v-slot="{ row }">
            <div>{{ row.updateDate | formatTime('YYYY-MM-DD') }}</div>
          </template>
        </el-table-column>

        <el-table-column label="操作" align="center" min-width="210">
          <template slot-scope="{ row }">
            <el-button size="mini" @click="handlerSee(row)">查看</el-button>
            <el-button type="info" size="mini" :disabled="!(row.status === 1)" plain
              @click="handlerCheck(row)">审核</el-button>
            <el-button type="danger" size="mini" :disabled="row.status === 0"
              @click="handlerDel(row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页功能模块 -->
      <div class="pagination-wrapper">
        <el-pagination @current-change="handleCurrentChange" :current-page="currentPage"
          :page-sizes="[10, 15, 20, 50]" :page-size.sync="pageSize"
          layout="total, sizes, prev, pager, next, jumper" :total="total" background
          popper-class="drop-down-box">
        </el-pagination>
      </div>

      <!-- 编辑功能 -->
      <article-edit v-if="dialogFormVisible" @refreshList="fetchArticleList"
        :dialogFormVisible.sync="dialogFormVisible" :isSee.sync="isSee" :title="title"
        :articleInfo="articleInfo">
      </article-edit>
    </div>
  </div>
</template>

<script>
import { getArticleList, queryArticle, deleteArticle } from '@/api/article'
import { throttling } from '@/utils/limit-request'
import ArticleEdit from './components/ArticleEdit.vue'

export default {
	name: 'Article',
	components: {
		ArticleEdit,
	},
	data() {
		return {
			dataList: [],
			total: 0,
			currentPage: 1,
			pageSize: 10,
			searchFormData: {
				name: '',
				status: '',
				isPublic: '',
			},
			isSee: false,
			dialogFormVisible: false,
			title: '',
			articleInfo: {},
			loading: true,
		}
	},

	created() {
		this.fetchArticleList()
	},

	methods: {
		async fetchArticleList() {
			const { data } = await getArticleList()
			this.total = data.total
			this.dataList = data.records
			this.loading = false
		},
		async queryArticle() {
			let odds = {
				keyWord: this.searchFormData.name,
				status: this.searchFormData.status,
				isPublic: this.searchFormData.isPublic,
			}
			this.currentPage = 1
			this.pageSize = 10
			const { data } = await queryArticle(odds)
			this.total = data.total
			this.dataList = data.records
		},

		setIndex(index) {
			return (this.currentPage - 1) * this.pageSize + index + 1
		},
		// 表单提交
		onSubmit: throttling(
			function () {
				if (
					!this.searchFormData.name &&
					this.searchFormData.status === '' &&
					this.searchFormData.isPublic === ''
				) {
					this.$message({
						message: '请输入或选择内容后再查询！',
						type: 'warning',
					})
					return
				}
				this.queryArticle()
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
				this.searchFormData.status = ''
				this.searchFormData.isPublic = ''
				this.fetchArticleList()
			},
			2000,
			true
		),
		// 操作查看按钮处理函数
		async handlerSee(item) {
			this.articleInfo = item
			this.title = '查看文章'
			this.isSee = true
			this.dialogFormVisible = true
		},
		// 操作审核按钮处理函数
		handlerCheck(item) {
			this.articleInfo = item
			this.title = '审核文章'
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
					await deleteArticle(id)
					this.$message.success('删除文章成功！')
					this.fetchArticleList()
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
.article-container {
	@include roundContainer;
	min-width: 480px;
}
</style>
