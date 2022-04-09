<template>
  <div class="container-edit">
    <el-dialog title="审核课程" :visible.sync="isVisible" custom-class="dialog-container">
      <el-form :model="courseInfo" label-position="left" size="small">
        <el-form-item label="课程标题：" :label-width="formLabelWidth">
          <el-input :value="courseInfo.title" autocomplete="off" disabled />
        </el-form-item>

        <el-form-item label="封面图：" :label-width="formLabelWidth"
          style="line-height:normal">
          <img :src="courseInfo.cover " alt="课程主封面" style="width: 220px; height: 120px;">
        </el-form-item>

        <el-form-item label="作者：" :label-width="formLabelWidth">
          <el-input :value="courseInfo.authorName" autocomplete="off" disabled />
        </el-form-item>

        <el-form-item label="视频详情：" :label-width="formLabelWidth">
          <el-button size="mini">详情</el-button>
        </el-form-item>

        <el-form-item label="原价：" :label-width="formLabelWidth">
          <el-input :value="courseInfo.isFree ? '免 费' : courseInfo.priceOriginal"
            autocomplete="off" disabled />
        </el-form-item>

        <el-form-item label="优惠价：" :label-width="formLabelWidth">
          <el-input :value="courseInfo.isFree ? '无优惠' : courseInfo.priceDiscount"
            autocomplete="off" disabled />
        </el-form-item>

        <el-form-item label="提交日期：" :label-width="formLabelWidth">
          <el-input :value="courseInfo.createDate | formatTime('YYYY-MM-DD HH:mm:ss')"
            disabled />
        </el-form-item>

      </el-form>
      <div class="dialog-footer" slot="footer">
        <el-button @click="submitForm('fail')">审核不通过</el-button>
        <el-button type="primary" @click="submitForm('success')">审核通过</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { auditSuccess, auditFail } from '@/api/course'

export default {
	name: 'CourseEdit',
	props: {
		dialogFormVisible: {
			type: Boolean,
			default: false,
		},
		courseInfo: {
			type: Object,
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
	created() {},
	methods: {
		submitForm(status) {
			this.$confirm('确定当前提交, 是否继续?', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning',
			})
				.then(async (val) => {
					// this.$message.success(`${res.message}`)
					// this.$emit('refreshList')
					// this.isVisible = false
					if (status === 'success') {
						await auditSuccess(this.courseInfo.id)
					} else {
						await auditFail(this.courseInfo.id)
					}
					this.$message.success('提交成功！')
					this.$emit('refreshList')
					this.isVisible = false
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

