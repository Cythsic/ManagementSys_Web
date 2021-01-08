<template>
  <div class="user-edit">
    <Drawer
      :title="title"
      v-model="visible"
      width="720"
      draggable
    >
      <div :style="{ maxHeight: maxHeight }" class="drawer-content">
        <div class="drawer-header">
          <div style="margin-right: 16px">上传今日班次</div>
          <Avatar :src="form.imageURL" size="large" v-show="type != '2'" />
        </div>
        <Form
          ref="form"
          :model="form"
          :rules="formValidate"
          label-position="top"
        >
       
          <Row :gutter="32">
			<Col span="12">
			  <FormItem label="图片">
			    <upload-pic-input v-model="form.img"></upload-pic-input>
			  </FormItem>
			</Col>
          </Row>
        </Form>
      </div>
      <div class="drawer-footer br">
        <Button type="primary" :loading="submitLoading" @click="submit"
          >提交</Button
        >
        <Button @click="visible = false">取消</Button>
      </div>
    </Drawer>
  </div>
</template>
<script>
import { add as addRoute} from "@/api/busRoute";
import { addImgInfo as addMenu } from "@/api/busRoute";
import uploadPicInput from "@/view/components/upload/BusRoute-upload-pic";

// import uploadPicInput from "@/view/components/upload/upload-pic-input";

export default {
  name: "carteenMenu",
  components: {
    uploadPicInput
  },		
  props: {
    value: {
      type: Boolean,
      default: false,
    },
    data: {
      type: Object,
    },
    type: {
      type: String,
      default: "0",
    }
  },
  computed: {},
  data() {
    return {
      form: {},
	  maxHeight: 510,
	  title: "",
	  visible: this.value,
	  submitLoading: false,
      formValidate: {
        name: [{
        	required: true,
        	message: "名称必填",
        	trigger: "blur"
        }],
        price: [{
        	required: true,
        	message: "价格必填",
        	trigger: "blur"
        }],
		type: [{
			required: true,
			message: "类型必填",
			trigger: "blur"
		}],
        week: [{
        	required: true,
        	message: "周期必填",
        	trigger: "blur"
        }],
        areaName: [{
        	required: true,
        	message: "区域必填",
        	trigger: "blur"
        }],
        imgUrl: [{
        	required: true,
        	message: "请选择上传图片",
        	trigger: "blur"
        }]
      }
    };
  },
  methods: {   
    submit() {
	 
      
        this.saveAdd();
      
    },
    saveAdd() {	  
      this.submitLoading = true;
	  this.saveValidate().then(r => {
        this.submitLoading = false;
		if (r) {
          addMenu(this.form)
            .then(res => {
              const resData = res.data;
              const data = resData.data;
              const code = resData.code;
              const msg = resData.msg;
              if (code == 1) {
                this.$Message.info("添加成功");
				this.$emit("on-submit", true);
				this.visible = false;
              } else {
                this.$Message.error({
                  content: msg,
                  duration: 10,
                  closable: true
                });
              }
            })
            .catch(err => {});
        }
      });
    },
    saveEdit() {
	  this.submitLoading = true;
	  this.saveValidate().then(r => {
        this.submitLoading = false;
		if (r) {
          editMenu(this.form)
            .then(res => {
              const resData = res.data;
              const data = resData.data;
              const code = resData.code;
              const msg = resData.msg;
              if (code == 1) {
                this.$Message.info("编辑成功");
				this.$emit("on-submit", true);
				this.visible = false;
              } else {
                this.$Message.error({
                  content: msg,
                  duration: 10,
                  closable: true
                });
              }
            })
            .catch(err => {});
        }
      });
    },
    saveValidate(name = "form") {
      return this.$refs[name].validate(valid => {
        if (!valid) {
          this.$Message.warning("请检查表单数据！");
          return false;
        } else {
          return true;
        }
      });
    },
	setCurrentValue(value) {
	  if (value === this.visible) {
	    return;
	  }
	  if (this.type == "1") {
	    this.title = "编辑";
	    this.maxHeight =
	      Number(document.documentElement.clientHeight - 121) + "px";
	  } else {
	    this.title = "添加";
	    this.maxHeight =
	      Number(document.documentElement.clientHeight - 121) + "px";
	  }
	  // 清空数据
	  this.$refs.form.resetFields();
	 if (this.type == "1") {
	   let data = this.data;	   
	   this.form = data;
	 }
	 this.visible = value;
	},
  },
  watch: {	  
	  value(val) {
	    this.setCurrentValue(val);
	  },
	  visible(value) {
	    this.$emit("input", value);
	  }
  }
};
</script>
<style lang="less">
@import "../../styles/drawer-common.less";

.br button {
	margin-right: 8px;
}

</style>
