<template>
  <div>
    <Form ref="formInline" label-position="right" :model="Row" :rules="ruleUser" :label-width="100">
      <Row>
        <Col span="12">
          <FormItem label="身份证编号" prop="cardID">
            <Input v-model="Row.cardID" />
          </FormItem>
        </Col>
        <Col span="12">
          <FormItem label="读卡时间" prop="readCardTime">
            <Date-picker type="date" v-model="Row.readCardTime" />
          </FormItem>
        </Col>
      </Row>
      <Row>
        <Col span="8">
          <FormItem label="姓名" prop="userName">
            <Input v-model="Row.userName" />
          </FormItem>
        </Col>
        <Col span="8">
			<FormItem label="性别" prop="sex">
				 <Input v-model="Row.sex" />
			</FormItem>
        </Col>
		<Col span="8">
			<FormItem label="民族" prop="nation">
				 <Input v-model="Row.nation" />
			</FormItem>
		</Col>
      </Row>
	  <Row>
	    <Col span="8">
	      <FormItem label="出生日期" prop="birthdate">
	        <Date-picker type="date" v-model="Row.birthdate" />
	      </FormItem>
	    </Col>
	    <Col span="16">
			<FormItem label="家庭地址" prop="homeAddress">
				 <Input v-model="Row.homeAddress" />
			</FormItem>
	    </Col>
	  </Row>
	  <Row>
	    <Col span="8">
	      <FormItem label="签发机构" prop="authority">
	        <Input v-model="Row.authority" />
	      </FormItem>
	    </Col>
	    <Col span="8">
			<FormItem label="有效开始时间" prop="validDate">
				 <Date-picker type="date" v-model="Row.validDate" />
			</FormItem>
	    </Col>
		<Col span="8">
			<FormItem label="截止有效时间" prop="expirationDate">
				 <Date-picker type="date" v-model="Row.expirationDate" />
			</FormItem>
		</Col>
	  </Row>
	  <Row>
        <Col span="24">
          <div style="text-align:center;">
            <Button @click="parent.modelEdit=false">取消</Button>
            <Button style="margin-left:20px;" type="primary" @click="save('formInline')">保存</Button>
          </div>
        </Col>
      </Row>
    </Form>
  </div>
</template>
<script>
import { add as addUser, edit as editUser } from "@/api/HRCardID";
import { truncate, truncateSync } from "fs";
export default {
  props: { editRow: Object, parent: Object },
  computed: {},
  data() {
    return {
      Row: {},
      ruleUser: {
        CardID: [
          {
            required: true,
            message: "身份证编号必填",
            trigger: "blur"
          },
          {
            type: "string",
            min: 18,
            message: "填写18位身份证编号",
            trigger: "blur"
          }
        ],
        userName: [
          {
            required: true,
            message: "姓名必填",
            trigger: "blur"
          }
        ],
		Sex: [
		  {
		    required: true,
		    message: "性别",
		    trigger: "blur"
		  }
		],
		Nation: [
		  {
		    required: true,
		    message: "民族",
		    trigger: "blur"
		  }
		],
		ValidDate: [
		  {
		    required: true,
			type:"date",
		    message: "有效开始时间必填",
		    trigger: "blur"
		  }
		],
		ExpirationDate: [
		  {
		    required: true,
			type:"date",
		    message: "截止有效时间必填",
		    trigger: "blur"
		  }
		]
      }
    };
  },
  methods: {   
    save() {
      if (this.parent.isAdd) {
        this.saveAdd();
      } else {
        this.saveEdit();
      }
    },
    saveAdd() {
      this.saveValidate().then(r => {
        if (r) {
          addUser(this.Row)
            .then(res => {
              const resData = res.data;
              const data = resData.data;
              const code = resData.code;
              const msg = resData.msg;
              if (code == 1) {
                this.$Message.info("添加成功");
                this.parent.modelEdit = false;
                this.parent.setPageData(1);
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
      this.saveValidate().then(r => {
        if (r) {
          editUser(this.Row)
            .then(res => {
              const resData = res.data;
              const data = resData.data;
              const code = resData.code;
              const msg = resData.msg;
              if (code == 1) {
                this.$Message.info("编辑成功");
                this.parent.modelEdit = false;
                this.parent.setPageData();
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
    saveValidate(name = "formInline") {
      return this.$refs[name].validate(valid => {
        if (!valid) {
          this.$Message.warning("请检查表单数据！");
          return false;
        } else {
          return true;
        }
      });
    },
    handleReset(name = "formInline") {
      this.$refs[name].resetFields();
    }
  },
  watch: {
    editRow(newVal, oldVal) {
      this.handleReset();
      this.Row = Object.assign({}, newVal);
    }
  }
};
</script>

