<template>
  <div class="container-edit">
    <el-dialog :title="title" :visible.sync="isVisible" custom-class="dialog-container">
      <el-form :model="articleInfo" label-position="left">
        <el-form-item label="标题：" :label-width="formLabelWidth">
          <el-input :value="articleInfo.title" autocomplete="off" disabled></el-input>
        </el-form-item>

        <el-form-item label="标签：" :label-width="formLabelWidth">
          <el-select v-model="articleInfo.labelIds" multiple disabled style="display: block;">
          </el-select>
        </el-form-item>

        <el-form-item label="封面图：" :label-width="formLabelWidth" style="line-height:normal">
          <img :src="articleInfo.cover" alt="文章封面" style="width: 220px; height: 120px;">
          <!-- <el-avatar shape="square" :size="200" fit="cover" :src="articleInfo.cover"></el-avatar> -->
        </el-form-item>

        <el-form-item label="是否公开：" :label-width="formLabelWidth">
          <!-- 0: 不公开 1：公开 -->
          <el-switch :value="articleInfo.ispublic" disabled></el-switch>
        </el-form-item>

        <el-form-item label="简介：" :label-width="formLabelWidth">
          <el-input type="textarea" :value="articleInfo.summary" disabled></el-input>
        </el-form-item>

        <el-form-item label="内容：" :label-width="formLabelWidth">
          <!-- <el-input :type="articleInfo.summary" disabled></el-input> -->
          <div id="editor"></div>
        </el-form-item>
      </el-form>
      <div class="dialog-footer" slot="footer">
        <template v-if="isSee">
          <!-- <el-button @click="isVisible = false">取 消</el-button> -->
          <el-button type="primary" @click="isVisible = false">确 定</el-button>
        </template>
        <template v-else>
          <el-button @click="submitForm('fail')">审核不通过</el-button>
          <el-button type="primary" @click="submitForm('success')">审核通过</el-button>
        </template>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import E from 'wangeditor'
import { auditSuccess, auditFail } from '@/api/article'
import { resolve } from 'path'

export default {
	name: 'ArticleEdit',
	props: {
		dialogFormVisible: {
			type: Boolean,
			default: false,
		},
		title: {
			type: String,
			required: true,
		},
		articleInfo: {
			type: Object,
			required: true,
		},
		isSee: {
			type: Boolean,
			required: true,
		},
	},
	data() {
		return {
			formLabelWidth: '100px',
		}
	},
	computed: {
		isVisible: {
			get() {
				return this.dialogFormVisible
			},
			set(val) {
				this.$emit('update:dialogFormVisible', val)
				this.$emit('update:isSee', false)
			},
		},
	},
	async created() {
		this.$nextTick(() => {
			const editor = new E('#editor')
			// 设置编辑区域高度为 500px
			editor.config.height = 300
			editor.create()
			editor.disable()
			editor.txt.html(this.articleInfo.htmlContent)
		})
	},
	watch: {
		isSee: {
			immediate: true,
			handler(val) {
				if (val) {
					this.formData = { name: '', status: null, sort: null, remark: '' }
				} else {
					this.formData = this.editFormData
				}
			},
		},
	},
	methods: {
		submitForm(status) {
			this.$confirm('确定当前提交, 是否继续?', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning',
			})
				.then(async (val) => {
					if (status === 'success') {
						const res = await auditSuccess()
						this.$message.success(`${res.message}`)
					} else {
						const res = await auditFail()
						this.$message.success(`${res.message}`)
					}
					this.$emit('refreshList')
					this.isVisible = false
				})
				.catch(() => {
					this.$message({
						type: 'info',
						message: '已取消提交',
					})
				})
		},
		async addCategory() {
			const res = await addCategory(this.formData)
		},
		async updateCategory(id) {
			const res = await updateCategory(id)
		},
	},
}
</script>

<style lang="scss">
.dialog-container {
	min-width: 370px;
}

.el-form-item__content {
	line-height: normal;
}
</style>

