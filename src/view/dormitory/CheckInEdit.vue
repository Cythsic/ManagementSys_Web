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
              <FormItem label="资产编号" prop="roomId">
                <Input v-model="form.roomId"/>
              </FormItem>
            </Col>
            <Col span="12">
			  <FormItem label="房号" prop="roomNo">
			    <Input v-model="form.roomNo"/>
			  </FormItem>
            </Col>
          </Row>
          <Row :gutter="32">
			<Col span="12">
			  <FormItem label="房型">
				<Input v-model="form.roomType"/>
			  </FormItem>
			</Col>
            <Col span="12">
              <FormItem label="用途" prop="roomUse">
                <Input v-model="form.roomUse"/>
              </FormItem>
            </Col>
          </Row>
          <Row :gutter="32">
            <Col span="12">
				<FormItem label="入住情况" prop="isUsed">
					<dict dict="bed" v-model="form.isUsed" transfer/>
				</FormItem>
            </Col>
            <Col span="12">
              <FormItem label="入住人员" prop="userName">
                <Input v-model="form.userName" />
              </FormItem>
            </Col>
          </Row>
		  <Row :gutter="32">
		    <Col span="12">
		      <FormItem label="所属单位" prop="remark">
		        <Input v-model="form.remark" />
		      </FormItem>
		    </Col>
			<Col span="12">
			  <FormItem label="备注" prop="orgCode">
			    <Input v-model="form.orgCode" />
			  </FormItem>
			</Col>
		  </Row>
		  <Divider />
		  <p class="drawer-title">个人资料</p>
		  <Row :gutter="32">
		    <Col span="12">
		      <FormItem label="工号" prop="userId">
		        <Input v-model="form.userId" />
		      </FormItem>
		    </Col>
		    <Col span="12">
		      <FormItem label="部门" prop="department">
				<dict dict="department" v-model="form.department" transfer/>
		      </FormItem>
		    </Col>
		  </Row>
		  <Row :gutter="32">
		    <Col span="12">
		      <FormItem label="性别" prop="sex">
		        <dict dict="sex" v-model="form.sex" transfer/>
		      </FormItem>
		    </Col>
		    <Col span="12">
		      <FormItem label="职级" prop="position">
				<dict dict="position" v-model="form.position" transfer/>
		      </FormItem>
		    </Col>
		  </Row>
		  <Row :gutter="32">
		    <Col span="12">
		      <FormItem label="成本中心" prop="costCenter">
		        <Input v-model="form.costCenter" />
		      </FormItem>
		    </Col>
		    <Col span="12">
		      <FormItem label="入住日期" prop="checkInTime">
				<DatePicker
				  v-model="form.checkInTime"
				  type="date"
				  format="yyyy-MM-dd"
				  clearable
				  placeholder="选择起始时间"
				  style="width: 280px"
				></DatePicker>
		      </FormItem>
		    </Col>
		  </Row>
		  <Row :gutter="32">
		    <Col span="12">
		      <FormItem label="联系电话" prop="phoneNumber">
		        <Input v-model="form.phoneNumber" />
		      </FormItem>
		    </Col>
			<Col span="12">
			  <FormItem label="离职日期" prop="dimissionTime">
				<DatePicker
				  v-model="form.dimissionTime"
				  type="date"
				  format="yyyy-MM-dd"
				  clearable
				  placeholder="选择起始时间"
				  style="width: 280px"
				></DatePicker>
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
import { add as addCheckIn, edit as editCheckIn } from "@/api/checkIn";
import uploadPicInput from "@/view/components/upload/upload-pic-input";
import dict from "@/view/components/dict/dict";

export default {
  name: "checkInManage",
  components: {
    uploadPicInput,
	dict
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
      form: {
		  isUsed: 1,
	  },
	  maxHeight: 510,
	  title: "",
	  visible: this.value,
	  submitLoading: false,
      formValidate: {
        roomId: [{
        	required: true,
        	message: "资产编号必填",
        	trigger: "blur"
        }],
        roomNo: [{
        	required: true,
        	message: "房号必填",
        	trigger: "blur"
        }],
		userName: [{
			required: true,
			message: "入住员工必填",
			trigger: "blur"
		}],
        checkInTime: [{
        	required: true,
			type: "date",
        	message: "入住日期必填",
        	trigger: "blur"
        }],
        roomType: [{
        	required: true,
        	message: "房型必填",
        	trigger: "blur"
        }],
        roomUse: [{
        	required: true,
        	message: "用途必填",
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
			console.log("form:" + JSON.stringify(this.form));
          addCheckIn(this.form)
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
          editCheckIn(this.form)
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
	}
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
