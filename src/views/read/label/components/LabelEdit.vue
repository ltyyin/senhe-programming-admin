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
          label="标签名称："
          prop="name"
          :label-width="formLabelWidth"
        >
          <el-input v-model.trim="formData.name" autocomplete="off"></el-input>
        </el-form-item>

        <el-form-item
          label="分类名称："
          prop="categoryName"
          :label-width="formLabelWidth"
        >
          <el-select
            v-model="formData.categoryName"
            filterable
            clearable
            placeholder="请选择"
          >
            <el-option
              v-for="category in categoryList"
              :key="category.id"
              :label="category.name"
              :value="category.name"
            >
            </el-option>
          </el-select>
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
import { addLabel, updateLabel } from "@/api/label";
export default {
  name: "LabelEdit",
  props: {
    dialogFormVisible: {
      type: Boolean,
      default: false,
    },
    title: {
      type: String,
      required: true,
    },
    categoryList: {
      type: Array,
      required: true,
    },
    isAdd: {
      type: Boolean,
      required: true,
    },
    labelItem: {
      type: Object,
      default: {},
    },
  },
  watch: {
    isAdd: {
      immediate: true,
      handler(val) {
        if (val) {
          this.formData = { name: "", categoryName: "" };
        } else {
          this.formData = this.labelItem;
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
          { required: true, message: "请输入标签名称", trigger: "blur" },
          {
            min: 1,
            max: 30,
            message: "长度在 1 到 30 个字符",
            trigger: "blur",
          },
        ],
        categoryName: [
          { required: true, message: "请选择该分类名称", trigger: "change" },
        ],
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
        this.$emit("update:isAdd", false);
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
              if (this.isAdd) {
                this.addLabel();
                this.$message.success("新增标签成功！");
              } else {
                this.updateLabel(this.formData.id);
                this.$message.success("更新标签成功！");
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
        }
      });
    },
    async addLabel() {
      const res = await addLabel(this.formData);
    },
    async updateLabel(id) {
      const res = await updateLabel(id);
    },
  },
};
</script>

<style lang="scss">
.dialog-container {
  min-width: 370px;
}
</style>
