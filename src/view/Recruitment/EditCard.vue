<template>
	<div>
		<Form ref="Row" label-position="right" :model="Row" :rules="ruleAgent" :label-width="100">
			<Row>
				<Col span="12">
					<FormItem label="工牌卡号" prop="workCardID">
						<Input v-model="Row.workCardID" />
					</FormItem>
				</Col>
				<Col span="12">
					<FormItem label="员工工号" prop="workID">
						<Input v-model="Row.workID" />
					</FormItem>
				</Col>
			</Row>
			<Row>
				<Col span="12">
					<FormItem label="姓名" prop="name">
						<Input disabled v-model="Row.name" />
					</FormItem>
				</Col>
				<Col span="12">
					<FormItem label="部门" prop="department">
						<Input disabled v-model="Row.department" />
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
	} from "@/api/WorkCard";
	export default {
		props: {
			editRow: Object,
			parent: Object
		},

		data() {
			return {
				Row: {},
				ruleAgent: {
					workCardID: [{
						required: true,
						message: "工牌卡号必填",
						trigger: "blur"
					}],
					name: [{
						required: true,
						message: "员工名字必填",
						trigger: "blur",
					}],
					workID: [{
						required: true,
						message: "员工工号必填",
						trigger: "blur"
					}],
					department: [{
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
