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
          <div style="margin-right: 16px">基本信息</div>
        </div>
        <Form
          ref="form"
          :model="form"
          :rules="formValidate"
          label-position="top"
        >
          <Row :gutter="32">
            <Col span="12">
              <FormItem label="线路名称" prop="lineName">
                <Input v-model="form.lineName"/>
              </FormItem>
            </Col>
            <Col span="12">
			  <FormItem label="序号" prop="lineItem">
			    <Input v-model="form.lineItem"/>
			  </FormItem>
            </Col>
          </Row>
          <Row :gutter="32">
			<Col span="12">
			  <FormItem label="站点名称">
				<Input v-model="form.stationName"/>
			  </FormItem>
			</Col>
            <Col span="12">
              <FormItem label="乘车位置" prop="location">
                <Input v-model="form.location"/>
              </FormItem>
            </Col>
          </Row>
          <Row :gutter="32">
            <Col span="12">
              <FormItem label="白班乘车时间" prop="dayTime">
                <Input v-model="form.dayTime" />
              </FormItem>
            </Col>
            <Col span="12">
              <FormItem label="夜班乘车时间" prop="nightTime">
                <Input v-model="form.nightTime" />
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
import { add as addMenu, edit as editMenu } from "@/api/maintain";
import uploadPicInput from "@/view/components/upload/upload-pic-input";

export default {
  name: "maintainManage",
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
        lineName: [{
        	required: true,
        	message: "线路名称必填",
        	trigger: "blur"
        }],
        lineItem: [{
        	required: true,
        	message: "序号必填",
        	trigger: "blur"
        }],
		stationName: [{
			required: true,
			message: "站点名称必填",
			trigger: "blur"
		}],
        location: [{
        	required: true,
        	message: "乘车位置必填",
        	trigger: "blur"
        }],
        dayTime: [{
        	required: true,
        	message: "白班发车时间必填",
        	trigger: "blur"
        }],
        nightTime: [{
        	required: true,
        	message: "夜班发车时间必填",
        	trigger: "blur"
        }]
      }
    };
  },
  methods: {   
    submit() {
	  if (this.type == "1") {
        this.saveEdit();
      } else {
        this.saveAdd();
      }
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
