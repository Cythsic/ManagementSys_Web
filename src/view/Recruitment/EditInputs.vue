<template>
	<div>
		<Form ref="Row" label-position="right" :model="Row" :rules="ruleAgent" :label-width="150">
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
				<FormItem label="人事范围" prop="personnelArea">
					<Select v-model="Row.personnelArea" @on-select="personnelAreaSelect">
						<Option value="KF03" key="KF03">KF03</Option>
						<Option value="KF09" key="KF09">KF09</Option>
					</Select>
				</FormItem>
				</Col>
				<Col span="12">
				<FormItem label="人事子范围" prop="personnelSubArea">
					<Select v-model="Row.personnelSubArea">
						<Option value="SU70" key="SU70">SU70</Option>
						<Option value="JG70" key="JG70">JG70</Option>
					</Select>
				</FormItem>
				</Col>
			</Row>
			<Row>
				<Col span="12">
				<FormItem label="员工组" prop="workerGroup">
					<Input v-model="Row.workerGroup" value="1"/>
				</FormItem>
				</Col>
				<Col span="12">
				<FormItem label="员工子组" prop="workerSubGroup">
					<Select v-model="Row.workerSubGroup">
						<Option value="R1" key="male">正式工</Option>
						<Option value="R7" key="female">外包工</Option>
					</Select>
				</FormItem>
				</Col>
			</Row>
			<Row>
				<Col span="12">
				<FormItem label="工资范围" prop="salaryArea">
					<Input v-model="Row.salaryArea" value="SU"/>					
				</FormItem>
				</Col>
				<Col span="12">
				<FormItem label="职位" prop="occupation">
					<Select v-model="Row.occupation">
						<Option value="普工" key="1">普工</Option>
						<Option value="技工" key="2">技工</Option>
						<Option value="工程师" key="3">工程师</Option>
						<Option value="高级工程师" key="4">高级工程师</Option>
					</Select>
				</FormItem>
				</Col>
			</Row>
			<Row>
				<Col span="12">
				<FormItem label="职级编码" prop="rankCode">
					<Input v-model="Row.rankCode" value="03001000"/>
				</FormItem>
				</Col>
				<Col span="12">
				<FormItem label="招聘渠道" prop="recruitmentSource">
					<Select v-model="Row.recruitmentSource">
						<Option value="现场招聘" key="1">现场招聘</Option>
						<Option value="网络招聘" key="2">网络招聘</Option>
						<Option value="外部推荐" key="3">外部推荐</Option>
						<Option value="内部推荐" key="4">内部推荐</Option>
						<Option value="离职返聘" key="5">离职返聘</Option>
						<Option value="成批招聘" key="6">成批招聘</Option>
						<Option value="其他" key="7">其他</Option>
						<Option value="派遣转正" key="16">派遣转正</Option>
					</Select>
				</FormItem>
				</Col>
			</Row>
			<Row>
				<Col span="12">
				<FormItem label="通讯类型" prop="communicationType">
					<Input v-model="Row.communicationType" value="PHO"/>
				</FormItem>
				</Col>
				<Col span="12">
				<FormItem label="离职日期" prop="endDate">
					<Input v-model="Row.endDate" />
				</FormItem>
				</Col>
			</Row>
			<Row>
				<Col span="12">
				<FormItem label="合同类型" prop="contractType">
					<Input v-model="Row.contractType" />
				</FormItem>
				</Col>
				<Col span="12">
				<FormItem label="试用期时长" prop="probation">
					<Input v-model="Row.probation"><span slot="append">个月</span></Input>
				</FormItem>
				</Col>
			</Row>
			<Row>
				<Col span="12">
				<FormItem label="解雇通知期" prop="fireNotePeriod">
					<Input v-model="Row.fireNotePeriod"><span slot="append">个月</span></Input>
				</FormItem>
				</Col>
				<Col span="12">
				<FormItem label="辞职通知期" prop="resignNotePeriod">
					<Input v-model="Row.resignNotePeriod"><span slot="append">个月</span></Input>
				</FormItem>
				</Col>
			</Row>
			<Row>
				<Col span="12">
				<FormItem label="招聘方式" prop="recruitmentWay">
					<Select v-model="Row.recruitmentWay">
						<Option value="社会招聘" key="1">社会招聘</Option>
						<Option value="应届生招聘" key="2">应届生招聘</Option>
						<Option value="集团内调动" key="3">集团内调动</Option>
					</Select>
				</FormItem>
				</Col>
				<Col span="12">
				<FormItem label="用工类型" prop="empolyeeType">
					<Select v-model="Row.empolyeeType">
						<Option value="正式工1" key="1">正式工1</Option>
						<Option value="短期工2" key="3">短期工2</Option>
						<Option value="学生工2" key="5">学生工2</Option>
					</Select>
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
	import { add as addUser, edit as editUser } from "@/api/HRInputs";

	export default {
		props: {
			editRow: Object,
			parent: Object
		},
		data() {
			return {
				personnelArea: '',
				Row: {},
				ruleAgent: {
					cardID: [{
						message: "身份证号必填",
						trigger: "blur"
					}, ],
					name: [{
						message: "员工名字必填",
						trigger: "blur"
					}],
					personnelArea: [{
						message: "填写人事范围",
						trigger: "blur"
					}],
					personnelSubArea: [{
						trigger: "blur"
					}, ],
					workerGroup: [{
						trigger: "blur"
					}],
					workerSubGroup: [{
						trigger: "blur"
					}],
					salaryGroup: [{
						trigger: "blur"
					}],
					occupation: [{
						trigger: "blur"
					}],
					rankCode: [{
						trigger: "blur"
					}],
					recruitmentSource: [{
						trigger: "blur"
					}],
					communicationType: [{
						trigger: "blur"
					}],
					endDate: [{
						trigger: "blur"
					}],
					contractType: [{
						trigger: "blur"
					}],
					probation: [{
						required: false,
						trigger: "blur"
					}],
					fireNotePeriod: [{
						required: false,
						trigger: "blur"
					}],
					resignNotePeriod: [{
						required: false,
						trigger: "blur"
					}],
					recruitmentWay: [{
						type: "date",
						required: false,
						trigger: "blur"
					}],
					empolyeeType: [{
						type: "date",
						required: false,
						trigger: "blur"
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
			personnelAreaSelect(val) {
				this.$data.personnelArea = val.value;
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
