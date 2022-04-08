<template>
  <div class="container-edit">
    <el-dialog
      :title="title"
      :visible.sync="isVisible"
      custom-class="dialog-container"
    >
      <el-form
        :model="formData"
        ref="ruleForm"
        :rules="rules"
        label-position="left"
      >
        <el-form-item
          label="分类名称："
          prop="name"
          :label-width="formLabelWidth"
        >
          <el-input v-model.trim="formData.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item
          label="状态："
          prop="status"
          :label-width="formLabelWidth"
        >
          <el-radio-group v-model="formData.status">
            <el-radio :label="1">正常</el-radio>
            <el-radio :label="0">禁用</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="排序：" prop="sort" :label-width="formLabelWidth">
          <el-input-number
            v-model="formData.sort"
            :min="0"
            :max="15"
          ></el-input-number>
        </el-form-item>
        <el-form-item
          label="备注："
          prop="remarks"
          :label-width="formLabelWidth"
        >
          <el-input type="textarea" v-model.trim="formData.remark"></el-input>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="isVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitForm('ruleForm')"
          >确 定</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { addCategory, updateCategory } from "@/api/article";
export default {
  name: "Edit",
  props: {
    dialogFormVisible: {
      type: Boolean,
      default: false,
    },
    title: {
      type: String,
      required: true,
    },
    editFormData: {
      type: Object,
    },
    isAddCategory: {
      type: Boolean,
      required: true,
    },
  },
  watch: {
    isAddCategory: {
      immediate: true,
      handler(val) {
        if (val) {
          this.formData = { name: "", status: null, sort: null, remark: "" };
        } else {
          this.formData = this.editFormData;
        }
      },
    },
  },
  data() {
    return {
      formLabelWidth: "100px",
      formData: {},
      rules: {
        name: [
          { required: true, message: "请输入分类名称", trigger: "blur" },
          {
            min: 1,
            max: 30,
            message: "长度在 1 到 30 个字符",
            trigger: "blur",
          },
        ],
        status: [
          { required: true, message: "请选择该分类的状态", trigger: "change" },
        ],
        sort: [
          { required: true, message: "请选择该分类的排序", trigger: "change" },
        ],
        remarks: [{ type: "string", message: "备注不能为空", trigger: "blur" }],
      },
    };
  },
  computed: {
    isVisible: {
      get() {
        return this.dialogFormVisible;
      },
      set(val) {
        this.$emit("update:dialogFormVisible", val);
        this.$emit("update:isAddCategory", false);
      },
    },
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$confirm("确定当前所提交的内容吗, 是否继续?", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
          })
            .then((val) => {
              if (this.addCategory) {
                this.addCategory();
                this.$message.success("新增分类成功！");
              } else {
                this.updateCategory(this.formData.id);
                this.$message.success("更新分类成功！");
              }
              this.isVisible = false;
              this.$emit("refreshList");
            })
            .catch(() => {
              this.$message({
                type: "info",
                message: "已取消提交",
              });
            });
        } else {
          this.$message.error("保存失败，请重新提交！");
          return false;
        }
      });
    },
    async addCategory() {
      const res = await addCategory(this.formData);
    },
    async updateCategory(id) {
      const res = await updateCategory(id);
    },
  },
};
</script>

<style lang="scss">
.dialog-container {
  min-width: 370px;
}
</style>
