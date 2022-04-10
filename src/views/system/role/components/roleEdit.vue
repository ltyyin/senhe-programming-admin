<template>
  <div class="container-edit">
    <el-dialog :title="title" :visible.sync="isVisible" custom-class="dialog-container">
      <el-form :model="formData" ref="ruleForm" :rules="rules" label-position="left"
        size="small">
        <el-form-item label="角色名称：" prop="name" :label-width="formLabelWidth">
          <el-input v-model.trim="formData.name" autocomplete="off"></el-input>
        </el-form-item>

        <el-form-item label="备注：" :label-width="formLabelWidth">
          <el-input type="textarea" :row="2" v-model="formData.remark">
          </el-input>
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
// import { addLabel, updateLabel } from '@/api/label'
import { addRole, updateRole } from '@/api/role'
import { copy } from '@/utils/copy'

export default {
	name: 'roleEdit',
	props: {
		dialogFormVisible: {
			type: Boolean,
			default: false,
		},
		title: {
			type: String,
			required: true,
		},
		isAdd: {
			type: Boolean,
			required: true,
		},
		roleItem: {
			type: Object,
			default: {},
		},
	},
	watch: {
		isAdd: {
			immediate: true,
			handler(val) {
				// 为了避免引用类型数据的修改，其他所引用该对象的数据也会发生改变，所以要深拷贝一下
				if (!val) this.formData = copy(this.roleItem)
			},
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
				return this.dialogFormVisible
			},
			set(val) {
				this.$emit('update:dialogFormVisible', val)
				this.$emit('update:isAdd', false)
			},
		},
	},
	methods: {
		submitForm(formName) {
			this.$refs[formName].validate((valid) => {
				if (valid) {
					this.$confirm('确定当前所提交的内容, 是否继续?', '提示', {
						confirmButtonText: '确定',
						cancelButtonText: '取消',
						type: 'warning',
					})
						.then(async (val) => {
							if (this.isAdd) {
								const res = await addRole(this.formData)
								this.$message.success('新增角色成功！')
							} else {
								const res = await updateRole(this.formData.id)
								this.$message.success('更新角色成功！')
							}
							this.isVisible = false
							this.$emit('refreshList')
						})
						.catch(() => {
							this.$message({
								type: 'info',
								message: '已取消提交',
							})
						})
				}
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
