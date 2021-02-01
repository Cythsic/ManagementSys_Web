<template>
	<div>
		<Form ref="Row" label-position="right" :model="Row" :rules="ruleAgent" :label-width="100">
			<Row>
				<Col span="12">
				<FormItem label="身份证号" prop="cardID">
					<Input disabled v-model="Row.cardID" />
				</FormItem>
				</Col>
				<Col span="12">
				<FormItem label="姓名" prop="name">
					<Input disabled v-model="Row.name" />
				</FormItem>
				</Col>
			</Row>
			<Row>
				<Col span="12">
				<FormItem label="性别" prop="sex">
					<!-- <Select v-model="Row.sex">
						<Option value="男" key="male">男</Option>
						<Option value="女" key="female">女</Option>
					</Select> -->
					<Input disabled v-model="Row.sex" />
				</FormItem>
				</Col>
				<Col span="12">
				<FormItem label="民族" prop="nation">
					<Input disabled v-model="Row.nation" />
				</FormItem>
				</Col>
			</Row>
			<Row>
				<Col span="12">
				<FormItem label="出生日期" prop="birthday">
					<Date-picker disabled v-model="Row.birthday" />
					<!-- <Input disabled v-model="Row.birthday" /> -->
				</FormItem>
				</Col>
				<Col span="12">
				<FormItem label="家庭住址" prop="homeAddress">
					<Input disabled v-model="Row.homeAddress" />
				</FormItem>
				</Col>
			</Row>
			<Row>
				<Col span="12">
				<FormItem label="身份证签发机关" prop="authority">
					<Input disabled v-model="Row.authority" />
				</FormItem>
				</Col>
				<Col span="12">
				<FormItem label="身份证开始有效期" prop="validDate">
					<Date-picker disabled type="date" v-model="Row.validDate" />
					<!-- <Input disabled v-model="Row.validDate" /> -->
				</FormItem>
				</Col>
			</Row>
			<Row>
				<Col span="12">
				<FormItem label="身份证过期时间" prop="expirationDate">
					<Date-picker disabled type="date" v-model="Row.expirationDate" />
					<!-- <Input disabled v-model="Row.expirationDate" /> -->
				</FormItem>
				</Col>
				<Col span="12">
				<FormItem label="联系电话" prop="phone">
					<Input type="number" v-model="Row.phone" />
				</FormItem>
				</Col>
			</Row>
			<Row>
				<Col span="12">
				<FormItem label="婚姻状态" prop="marriage">
					<Select v-model="Row.marriage">
						<Option value="未婚" key="unmarried">未婚</Option>
						<Option value="已婚" key="married">已婚</Option>
					</Select>
				</FormItem>
				</Col>
				<Col span="12">
				<FormItem label="利手" prop="handedness">
					<Select v-model="Row.handedness">
						<Option value="右手" key="right">右手</Option>
						<Option value="左手" key="left">左手</Option>
					</Select>
				</FormItem>
				</Col>
			</Row>
			<Row>
				<Col span="12">
				<FormItem label="户籍类型" prop="householdType">
					<Select v-model="Row.householdType">
						<Option value="市内城镇" key="innerTown">市内城镇</Option>
						<Option value="市内农村" key="innerRural">市内农村</Option>
						<Option value="市外城镇" key="outerTown">市外城镇</Option>
						<Option value="市外农村" key="outerRural">市外农村</Option>
					</Select>
				</FormItem>
				</Col>
				<Col span="12">
				<FormItem label="学历" prop="diploma">
					<Select v-model="Row.diploma">
						<Option value="研究生" key="1">研究生</Option>
						<Option value="本科" key="2">本科</Option>
						<Option value="大专" key="3">大专</Option>
						<Option value="中专" key="4">中专</Option>
						<Option value="中技/职高" key="5">中技/职高</Option>
						<Option value="高中" key="6">高中</Option>
						<Option value="初中" key="7">初中</Option>
						<Option value="小学" key="8">小学</Option>
					</Select>
				</FormItem>
				</Col>
			</Row>
			<Row>
				<Col span="12">
				<FormItem label="专业" prop="major">
					<Input v-model="Row.major" />
				</FormItem>
				</Col>
				<Col span="12">
				<FormItem label="学校名称" prop="school">
					<Input v-model="Row.school" />
				</FormItem>
				</Col>
			</Row>
			<Row>
				<Col span="12">
				<FormItem label="入学日期" prop="eduStart">
					<!-- <Date-picker type="date" @on-change="Row.eduStart=$event" /> -->
					<Date-picker type="date" v-model="Row.eduStart" />
				</FormItem>
				</Col>
				<Col span="12">
				<FormItem label="毕业日期" prop="eduEnd">
					<Date-picker type="date" v-model="Row.eduEnd" />
				</FormItem>
				</Col>
			</Row>
			<Row>
				<Col span="12">
				<FormItem label="家庭联系人" prop="homeContact">
					<Input v-model="Row.homeContact" />
				</FormItem>
				</Col>
				<Col span="12">
				<FormItem label="邮编" prop="postalCode">
					<Input v-model="Row.postalCode" />
				</FormItem>
				</Col>
			</Row>
			<Row>
				<Col span="12">
				<FormItem label="家庭电话" prop="homeTel">
					<Input type="number" v-model="Row.homeTel" />
				</FormItem>
				</Col>
				<Col span="12">
				<FormItem label="政党信息" prop="politicalStatus">
					<Select v-model="Row.politicalStatus">
						<Option value="群众" key="public">群众</Option>
						<Option value="党员" key="partyMember">党员</Option>
					</Select>
				</FormItem>
				</Col>
			</Row>
			<Row>
				<!-- <Col span="12">
				<FormItem label="在苏联系人" prop="EmergentContact">
					<Input v-model="Row.EmergentContact" />
				</FormItem>
				</Col> -->
				<!-- <Col span="12">
				<FormItem label="在苏联系人电话" prop="EmergentPhone">
					<Input type="number" v-model="Row.EmergentPhone" />
				</FormItem>
				</Col> -->
			</Row>
			<Row>
				<Col span="12">
				<FormItem label="合同到期日期" prop="contractExpDate">
					<Date-picker type="date" v-model="Row.contractExpDate" />
				</FormItem>
				</Col>
				<Col span="12">
				<FormItem label="批次号" prop="batchCode">
					<Input disabled v-model="Row.batchCode" />
				</FormItem>
				</Col>
			</Row>
			<Row>
				<Col span="24">
				<div style="text-align:center;">
					<Button @click="parent.modalEdit=false">取消</Button>
					<Button style="margin-left:20px;" type="primary" @click="save('Row')">保存</Button>
				</div>
				</Col>
			</Row>
		</Form>
	</div>
</template>
<script>
	import {
		add as addUser,
		edit as editUser
	} from "@/api/AgentInputs";
	import {
		truncate,
		truncateSync
	} from "fs";
	export default {
		props: {
			editRow: Object,
			parent: Object
		},
		
		data() {
			return {
				Row:{},
				ruleAgent: {
					cardID: [{
							required: false,
							message: "身份证号必填",
							// trigger: "blur"
						},
						{
				
							min: 18,
							message: "填写18位身份证号",
							// trigger: "blur"
						}
					],
					name: [{
						required: false,
						message: "员工名字必填",
						trigger: "blur"
					}],
					sex: [{
						required: false,
						message: "性别必填",
						trigger: "blur"
					}, ],
					nation: [{
						required: false,
						message: "民族必填",
						trigger: "blur"
					}],
					birthday: [{
						required: false,
						type: "date",
						message: "生日必填",
						trigger: "blur"
					}],
					homeAddress: [{
						required: false,
				
						message: "家庭住址必填",
						trigger: "blur"
					}],
					authority: [{
						required: false,
				
						message: "身份证签发机关必填",
						trigger: "blur"
					}],
					validDate: [{
						required: false,
						type: "date",
						message: "身份证开始有效期必填",
						trigger: "blur"
					}],
					expirationDate: [{
						required: false,
						type: "date",
						message: "身份证过期时间必填",
						trigger: "blur"
					}],
					phone: [{
							required: true,
							message: "电话必填",
							trigger: "blur"
						},
						{
							min: 11,
							message: "填写11位电话号码",
							trigger: "blur"
						}
					],
					marriage: [{
						required: false,
				
						trigger: "blur"
					}],
					handedness: [{
						required: false,
				
						trigger: "blur"
					}],
					householdType: [{
						required: false,
						trigger: "blur"
					}],
					diploma: [{
						required: false,
						trigger: "blur"
					}],
					major: [{
						required: false,
						trigger: "blur"
					}],
					eduStart: [{
						type: "date",
						required: false,
						trigger: "blur"
					}],
					eduEnd: [{
						type: "date",
						required: false,
						trigger: "blur"
					}],
					school: [{
						required: false,
						trigger: "blur"
					}],
					homeContact: [{
						required: false,
						trigger: "blur"
					}],
					postalCode: [{
						required: false,
						trigger: "blur"
					}],
					homeTel: [{
						required: false,
						trigger: "blur"
					}],
					emergentContact: [{
						required: false,
						trigger: "blur"
					}],
					emergentPhone: [{
						required: false,
						trigger: "blur"
					}],
					politicalStatus: [{
						required: false,
						trigger: "blur"
					}],
					contractExpDate: [{
						type: "date",
						required: false,
						trigger: "blur"
					}],
					batchCode: [{
						required: false,
						trigger: "blur",
					}],
				},
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
									this.parent.modalEdit = false;
									this.parent.getDataList();
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
				console.log(this.$data.Row)
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
									this.parent.modalEdit = false;
									this.parent.getDataList();
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
			saveValidate(name = "Row") {
				return this.$refs[name].validate(valid => {
					if (!valid) {
						this.$Message.warning("请检查表单数据！");
						return false;
					} else {
						return true;
					}
				});
			},
			handleReset(name = "Row") {
				this.$refs[name].resetFields();
			},
		},
		watch: {
			editRow(newVal, oldVal) {
				this.handleReset();
				this.Row = Object.assign({}, newVal);
			}
		}
	};
</script>
