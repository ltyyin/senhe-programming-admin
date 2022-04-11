<template>
  <div class="container-edit">
    <el-dialog title="编辑用户" :visible.sync="isVisible" custom-class="dialog-container">
      <el-form :model="formData" ref="ruleForm" label-position="left" size="small">

        <el-form-item label="用户名：" :label-width="formLabelWidth">
          <el-input v-model.trim="formData.userName" autocomplete="off" disabled>
          </el-input>
        </el-form-item>

        <el-form-item label="账号：" :label-width="formLabelWidth">
          <el-input v-model.trim="formData.account" autocomplete="off" disabled />
        </el-form-item>

        <el-form-item label="最近登录：" :label-width="formLabelWidth">
          <el-date-picker v-model="formData.latelyLoginDate" type="datetime" disabled>
          </el-date-picker>
        </el-form-item>

        <el-form-item label="是否冻结：" :label-width="formLabelWidth">
          <el-switch v-model="formData.isFreeze" :active-value="1" :inactive-value="0" />
          <span style="margin-left: 20px;">(可修改)</span>
        </el-form-item>

      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="isVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitForm('ruleForm')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { copy } from '@/utils/copy'
import { updateUserAccount } from '@/api/users'

export default {
	name: 'UserEdit',
	props: {
		showEdit: {
			type: Boolean,
			default: false,
		},
		accountInfo: {
			type: Object,
			required: true,
		},
	},
	watch: {
		showEdit(val) {
			if (val) this.formData = copy(this.accountInfo)
		},
	},
	data() {
		return {
			formLabelWidth: '100px',
			formData: {},
		}
	},
	computed: {
		isVisible: {
			get() {
				return this.showEdit
			},
			set(val) {
				this.$emit('update:showEdit', val)
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
					await updateUserAccount(this.formData)
					this.$message.success('修改成功！')
					this.isVisible = false
					this.$emit('refreshList')
				})
				.catch(() => {
					this.$message({
						type: 'info',
						message: '已取消提交',
					})
					this.isVisible = false
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
