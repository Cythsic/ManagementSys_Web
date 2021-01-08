<template>
	<div>
		<!-- <Modal v-model="modal1" title="新增记录" @on-ok="handleSubmit('Row')" @on-cancel="cancel"> -->
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
				<FormItem label="体检结果" prop="examResult">
					<Select v-model="Row.examResult">
						<Option value="合格" key="0">合格</Option>
						<Option value="不合格" key="1">不合格</Option>
					</Select>
				</FormItem>
				</Col>
			</Row>
			<Row>
				<Col span="24">
				<div style="text-align:center;">
					<Button @click="parent.modelEdit=false">取消</Button>
					<Button style="margin-left:20px;" type="primary" @click="save('Row')">保存</Button>
				</div>
				</Col>
			</Row>
		</Form>
		<!-- </Modal> -->
	</div>
</template>
<script>
	import {
		add as addUser,
		edit as editUser
	} from "@/api/HealthExam";
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
					examResult: [{
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
						console.log("ROW DATA:" + JSON.stringify(this.Row))
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
