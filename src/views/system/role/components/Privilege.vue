<template>
  <div class="container-edit">
    <el-dialog title="分配权限" :visible.sync="isVisible" custom-class="dialog-container">
      <el-form ref="ruleForm" label-position="left" size="small">

        <el-tree :data="powerMenuList" show-checkbox node-key="id" ref="tree"
          highlight-current accordion />

      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="isVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitForm('ruleForm')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { updateRolePowers } from '@/api/role'

export default {
	name: 'roleEdit',
	props: {
		showPrivilege: {
			type: Boolean,
			default: false,
		},
		powerMenuList: {
			type: Array,
			required: true,
		},
		rolePowers: {
			type: Array,
			required: true,
		},
	},
	watch: {
		showPrivilege(val) {
			if (val) {
				this.$nextTick(() => {
					this.$refs.tree.setCheckedKeys(this.rolePowers)
				})
			}
		},
	},
	data() {
		return {
			formLabelWidth: '100px',
			formData: { name: '', remark: '' },
			rules: {
				name: [
					{ required: true, message: '请输入角色名称', trigger: 'blur' },
					{
						min: 1,
						max: 30,
						message: '长度在 1 到 30 个字符',
						trigger: 'blur',
					},
				],
			},
		}
	},
	computed: {
		isVisible: {
			get() {
				return this.showPrivilege
			},
			set(val) {
				this.$emit('update:showPrivilege', val)
			},
		},
	},
	methods: {
		submitForm(formName) {
			this.$confirm('确定当前所提交的内容, 是否继续?', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning',
			})
				.then(async (val) => {
					await updateRolePowers(this.$refs.tree.getCheckedKeys())
					this.$message.success('修改权限成功！')
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
