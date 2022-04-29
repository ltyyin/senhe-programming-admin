<template>
  <div class="container-edit">
    <el-dialog :title="title" :visible.sync="isVisible" custom-class="dialog-container">

      <el-form :model="formData" ref="ruleForm" :rules="rules" label-position="right"
        size="small">
        <el-form-item label="标题：" prop="title" :label-width="formLabelWidth">
          <el-input v-model.trim="formData.title" autocomplete="off"></el-input>
        </el-form-item>

        <el-form-item label="图片：" prop="cover" :label-width="formLabelWidth">
          <el-upload class="avatar-uploader" action="#" :show-file-list="false"
            :auto-upload="false" :on-change="onChange">
            <img v-if="formData.cover" :src="formData.cover" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>

        <el-form-item label="跳转URL：" prop="url" :label-width="formLabelWidth">
          <el-input v-model.trim="formData.url" autocomplete="off"></el-input>
        </el-form-item>

        <el-form-item label="备注：" prop="remark" :label-width="formLabelWidth">
          <el-input type="textarea" v-model.trim="formData.remark"></el-input>
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
import { addBanner, updateBanner } from '@/api/banner'
const formObj = { title: '', cover: '', url: '', remark: '' }

export default {
	name: 'BannerEdit',
	props: {
		dialogFormVisible: {
			type: Boolean,
			default: false,
		},
		title: {
			type: String,
			required: true,
		},
		bannerItem: {
			type: Object,
		},
		isAdd: {
			type: Boolean,
			required: true,
		},
	},
	watch: {
		dialogFormVisible: {
			handler(val) {
				if (val && !this.isAdd) {
					this.formData = copy(this.bannerItem)
				} else {
					Object.assign(this.formData, formObj)
				}
			},
		},
	},
	data() {
		return {
			imageUrl: '',
			formLabelWidth: '100px',
			formData: Object.assign({}, formObj),
			rules: {
				title: [
					{ required: true, message: '请输入标题名称', trigger: 'blur' },
					{
						min: 1,
						max: 30,
						message: '长度在 1 到 30 个字符',
						trigger: 'blur',
					},
				],
				cover: [{ required: true, message: '请上传轮播图片', trigger: 'blur' }],
				url: [{ required: true, message: '请输入URL路径', trigger: 'blur' }],
				sort: [
					{ required: true, message: '请选择该分类的排序', trigger: 'change' },
				],
				remark: [{ type: 'string', message: '备注不能为空', trigger: 'blur' }],
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
					this.$confirm('确定当前所提交的内容吗, 是否继续?', '提示', {
						confirmButtonText: '确定',
						cancelButtonText: '取消',
						type: 'warning',
					})
						.then(async (val) => {
							if (this.isAdd) {
								await addCategory(this.formData)
								this.$message.success('添加成功！')
							} else {
								await updateBanner(this.formData)
								this.$message.success('修改成功')
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
				} else {
					this.$message.error('保存失败，请重新提交！')
					return false
				}
			})
		},
		onChange(file) {
			const isLt2M = file.size / 1024 / 1024 < 2
			if (!isLt2M) {
				this.$message.error('上传头像图片大小不能超过 2MB!')
				return
			}

			const blob = window.URL.createObjectURL(file.raw)
			this.formData.cover = blob
		},
	},
}
</script>


<style lang="scss">
.avatar-uploader .el-upload {
	border: 1px dashed #d9d9d9;
	border-radius: 6px;
	cursor: pointer;
	position: relative;
	overflow: hidden;
}
.avatar-uploader .el-upload:hover {
	border-color: $theme-color;
}
.avatar-uploader-icon {
	font-size: 28px;
	color: #8c939d;
	width: 178px;
	height: 100px;
	line-height: 100px;
	text-align: center;
}
.avatar {
	width: 178px;
	height: 100px;
	display: block;
}
</style>

<style lang="scss" scoped>
.dialog-container {
	min-width: 370px;
}
</style>
