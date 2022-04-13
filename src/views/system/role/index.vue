<template>
  <div class="role-container-wrapper">
    <div class="role-container">
      <el-form :inline="true" :model="searchFormData" size="mini" style="width: 100%"
        class="form-search">
        <el-form-item label="角色名称：">
          <el-input v-model="searchFormData.name"></el-input>
        </el-form-item>
        <el-form-item class="btn-form-item">
          <el-button icon="el-icon-search" @click="onSubmit">查询</el-button>
          <el-button icon="el-icon-refresh" @click="onReset">重置</el-button>
          <el-button icon="el-icon-circle-plus-outline" @click="onAdd">新增</el-button>
        </el-form-item>
      </el-form>
    </div>

    <div class="role-container">
      <!-- 数据表格的展示 -->
      <el-table ref="singleTable" v-loading="loading" :data="dataList"
        highlight-current-row style="width: 100%" stripe>

        <el-table-column align="center" label="#" type="index" width="100" />

        <el-table-column property="name" label="角色名称" min-width="100" align="center" />

        <el-table-column property="remark" label="备注" align="center" min-width="100" />

        <el-table-column label="操作" align="center" min-width="210">
          <template v-slot="{ row }">
            <el-button size="mini" @click="handlerPower(row.powers)">分配权限
            </el-button>
            <el-button type="info" plain size="mini" @click="handlerEdit(row)">编辑
            </el-button>
            <el-button type="danger" size="mini" @click="handlerDel(row.id)">删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 编辑或新增组件 -->
      <role-edit v-if="dialogFormVisible" :dialogFormVisible.sync="dialogFormVisible"
        :title="title" :isAdd.sync="isAdd" :roleItem="roleItem"
        @refreshList="fetchRoleList" />

      <privilege :showPrivilege.sync="showPrivilege" :powerMenuList="powerMenuList"
        :rolePowers="rolePowers" @refreshList="fetchRoleList" />
    </div>
  </div>
</template>

<script>
import {
	getRoleList,
	queryRole,
	deleteRole,
	getPowerMenuList,
} from '@/api/role'
import { throttling } from '@/utils/limit-request'
import RoleEdit from './components/RoleEdit'
import Privilege from './components/Privilege'

export default {
	name: 'Role',
	components: {
		RoleEdit,
		Privilege,
	},
	data() {
		return {
			dataList: [],
			searchFormData: {
				name: '',
			},
			showPrivilege: false,
			dialogFormVisible: false,
			roleItem: {},
			title: '',
			isAdd: false,
			loading: true,
			powerMenuList: [],
			rolePowers: [],
		}
	},

	async created() {
		this.fetchRoleList()
		this.fetchPowerMenuList()
	},

	methods: {
		// 初始化列表数据
		async fetchRoleList() {
			try {
				const { data } = await getRoleList()
				this.total = data.total
				this.dataList = data.records
			} catch (error) {}
			this.loading = false
		},
		// 条件查询列表数据
		async queryRole() {
			let odds = {
				keyWord: this.searchFormData.name,
			}

			this.currentPage = 1
			this.pageSize = 10
			const { data } = await queryRole(odds)
			this.total = data.total
			this.dataList = data.records
		},
		async fetchPowerMenuList() {
			const { data } = await getPowerMenuList()
			this.powerMenuList = data
		},
		// 表单提交
		onSubmit: throttling(
			function () {
				if (!this.searchFormData.name) {
					this.$message({
						message: '请输入或选择内容后再查询！',
						type: 'warning',
					})
					return
				}
				this.queryRole()
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
				this.fetchRoleList()
			},
			2000,
			true
		),
		// 表单新增角色按钮
		onAdd() {
			this.isAdd = true
			this.title = '新增角色'
			this.dialogFormVisible = true
		},
		setIndex(index) {
			return (this.currentPage - 1) * this.pageSize + index + 1
		},
		// 操作中的分配权限按钮处理函数
		handlerPower(powers) {
			this.rolePowers = powers
			this.showPrivilege = true
		},
		// 操作中的编辑按钮处理函数
		handlerEdit(row) {
			this.title = '编辑角色'
			this.roleItem = row
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
					await deleteRole(id)
					this.$message.success('删除课程成功！')
					this.fetchRoleList()
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
.role-container {
	@include roundContainer;
	min-width: 770px;
}
</style>
