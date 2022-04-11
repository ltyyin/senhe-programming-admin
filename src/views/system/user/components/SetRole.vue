<template>
  <div class="set-role-container">
    <el-dialog title="编辑用户" :visible.sync="isVisible" custom-class="dialog-container">

      <el-table border ref="multipleTable" :data="roleList" tooltip-effect="dark"
        style="width: 100%" @selection-change="handleSelectionChange">

        <el-table-column type="selection" width="55" align="center" />

        <el-table-column label="#" type="index" width="60" align="center" />

        <el-table-column prop="name" align="center" label="角色名称：" min-width="120" />

        <el-table-column prop="remark" align="center" label="备注：" min-width="120" />
      </el-table>

      <div slot="footer" class="dialog-footer">
        <el-button @click="isVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitForm('ruleForm')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
// import { copy } from '@/utils/copy'
import { setRole } from '@/api/users'

export default {
	name: 'SetRole',
	props: {
		showSetRole: {
			type: Boolean,
			default: false,
		},
		roleList: {
			type: Array,
			required: true,
		},
		roleTotal: {
			type: Number,
			required: true,
		},
	},
	watch: {
		showSetRole(val) {
			if (val) {
				// this.formData = copy(this.accountInfo)
			} else {
				this.$nextTick(() => {
					this.$refs.multipleTable.clearSelection()
				})
			}
		},
	},
	data() {
		return {
			formLabelWidth: '100px',
			multipleSelection: [],
			currentPage: 1,
			pageSize: 10,
		}
	},
	computed: {
		isVisible: {
			get() {
				return this.showSetRole
			},
			set(val) {
				this.$emit('update:showSetRole', val)
			},
		},
	},
	methods: {
		handleSelectionChange(val) {
			this.multipleSelection = val
		},
		submitForm(formName) {
			this.$confirm('确定当前所提交的内容, 是否继续?', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning',
			})
				.then(async (val) => {
					await setRole(this.multipleSelection)
					this.$message.success('设置成功！')
					this.isVisible = false
					this.$emit('refreshList')
				})
				.catch(() => {
					this.$message({
						type: 'info',
						message: '已取消提交',
					})
				})
		},
	},
}
</script>

<style lang="scss">
.dialog-container {
	min-width: 370px;
}
</style>
