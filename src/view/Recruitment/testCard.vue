<template>
	<div>
		<Form ref="Row" label-position="right" :model="Row" :rules="ruleAgent" :label-width="100">
		</Form>
		<Card>
			<div>
				<Button class="search-btn" type="success" size="small" style="margin-right: 5px;" @click="createWorkID">
					<Icon type="md-add" />&nbsp;&nbsp;生成工号
				</Button>
				<Upload style="display: inline-block" action="" :before-upload="handleUpdate">
					<Button type="primary" style="margin-right: 5px;"><i class="iconfont icon-Upload" />&nbsp;&nbsp;导入</Button>
				</Upload>
			</div>
			<Table ref="tables" :data="tableData1" v-bind:columns="tableColumns1" size="default" on-select="selectChange"
			 on-select-cancel="selectCancle" border stripe></Table>
		
			<div style="margin: 10px;overflow: hidden">
				<div style="float: right;">
					<Page :total="pageTotal" :current="pageCurrent" @on-change="changePage" @on-page-size-change="changePageSize"
					 show-total show-elevator show-sizer></Page>
				</div>
				<Button class="search-btn" type="primary" size="large" style="float:left;" @click="save">
					&nbsp;&nbsp;提交
				</Button>
				<Button class="search-btn" type="primary" size="large" style="float:left;" @click="print">
					&nbsp;&nbsp;导出
				</Button>
			</div>
		</Card>
		<Modal title="编辑" :mask-closable="false" v-model="modelEdit" width="800" scrollable footer-hide @on-ok="saveEdit">
			<Edit ref="edit" :parent="this" v-bind:edit-row="workIDCrt"></Edit>
		</Modal>
	</div>
</template>
<script>
	import "@/assets/css/util.less";
	import Edit from "./EditCard";
	import {
		getPage,
		add as AddInfo,
		UpdateBatch
	} from "@/api/WorkCard";
	import {
		getArrayFromFile,
		getTableDataFromArray
	} from '@/libs/util'
	import {
		objEqual
	} from '@/libs/tools'
	import {
		truncate,
		truncateSync
	} from "fs";
	export default {
		props: {
			workIDCrt: Object,
			parent: Object
		},
		name: 'userManage',
		components: {
			Edit
		},
		data() {
			return {
				Row:{},
				startID: '',
				tempList: [],
				tableData1: [],
				queryData: {},
				pageTotal: 0,
				pageCurrent: 1,
				modelEdit: false,
				modelPermission: false,
				eidtRow: {},
				modal1: false,
				ruleAgent: {
					cardID: [{
							message: "身份证号必填",
							trigger: "blur"
						},
					],
					name: [{
						message: "员工名字必填",
						trigger: "blur"
					}],
					examResult: [{
						required: false,
						trigger: "blur"
					}],
					isPaperResult: [{
						required: false,
						trigger: "blur"
					}],
				},
				tableColumns1: [{
						type: 'selection',
						width: 100,
						align: 'center',
						// fixed:'left'
					},
					{
						title: "工卡号",
						key: "workCardID",
						resizable: true,
						align: 'center',
						// fixed: 'left',
						width: 200
					},
					{
						title: "姓名",
						key: "name",
						resizable: true,
						align: 'center',
						// fixed: 'left',
						width: 150
					},
					{
						title: "工号",
						key: "workID",
						align: 'center',
						resizable: true,
						width: 150
					},
					{
						title: "部门",
						key: "department",
						resizable: true,
						align: 'center',
						width: 100
					},
					{
						title: "操作",
						key: "action",
						// fixed: 'right',
						width: 300,
						align: "center",
						render: (h, params) => {
							return h("div", [
								h(
									"Button", {
										props: {
											type: "primary",
											size: "small",
											icon: "md-create"
										},
										style: {
											marginRight: "5px"
										},
										on: {
											click: () => {
												this.handleEdit(params);
											}
										}
									},
									"编辑"
								),
							]);
						}
					}
				]
			};
		},
		methods: {
			setPageData(pageNum = this.pageCurrent, pageSize = 10,order,query) {
				getPage({
						pageNum: pageNum,
						pageSize: pageSize,
						field: "workCardID",
						order: order,
						// query: this.queryData
						query: query
					})
					.then(res => {
						const resData = res.data;
						const code = resData.code;
						const msg = resData.msg;
						if (code != 1) {
							this.$Message.error(code.msg);
							return;
						}
						const data = resData.data;
						console.log(resData.data)
						// this.tableData1 = data.map(item => ({
						// 				workCardID: item.workCardID,
						// 				Name: item.Name,
						// 				ExamResult: item.ExamResult,
						// 				isPaperResult: item.isPaperResult
						// 			}));
						this.tableData1 = data;
						this.pageTotal = this.$data.tableData1.count;
						this.pageCurrent = tableData1.PageNum;
					})
					.catch(err => {});
			
			},
			//日期格式校验
			formatDate(date) {
				const y = date.getFullYear();
				let m = date.getMonth() + 1;
				m = m < 10 ? "0" + m : m;
				let d = date.getDate();
				d = d < 10 ? "0" + d : d;
				return y + "-" + m + "-" + d;
			},
			changePage(page) {
				this.setPageData(page,10,null,this.queryData);
			},
			changePageSize(pageSize) {
				this.setPageData(1, pageSize,null,this.queryData);
			},
			//文件头格式校验
			vaildFileFormat(headRow) {
				var templateHeadRow = ["WorkCardID", "WorkID", "Name"];
				return objEqual(headRow, templateHeadRow);
			},
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
						console.log("ROW DATA:"+JSON.stringify(this.Row))
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
						// console.log(this.Row)
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
			handleUpdate() {
				getArrayFromFile(file).then(data => {
					var ar = this.vaildFileFormat(data[0]);
					// console.log("头行匹配结果：" + data)
					if (ar) {
						let {
							columns,
							tableData
						} = getTableDataFromArray(data);
						UpdateBatch(tableData).then(res => {
							const resData = res.data;
							const data = resData.data;
							const code = resData.code;
							const msg = resData.msg;
							if (code == 1) {
								this.$Message.info("导入成功");
								this.setPageData(1,10,null,this.queryData);
							} else {
								this.$Message.error({
									content: msg,
									duration: 10,
									closable: true
								});
							}
						})
					} else {
						this.$Message.error({
							content: "导入的文件格式错误",
							duration: 5,
							closable: true
						});
					}
				}).catch(() => {
					this.$Notice.warning({
						title: '只能上传Csv文件',
						desc: '只能上传Csv文件，请重新上传'
					})
				})
			},
			print() {
				this.$refs.tables.exportCsv({
					filename: '制作工卡导入文件',
					columns: this.tableColumns1.filter((col, index) => index > 0 && index < 5),
					data: this.tableData1
				});
				console.log('export!!')
			},
			//生成工号
			createWorkID() {
				
				getPage({
						pageNum: this.pageCurrent,
						pageSize: 10,
						field: "workID",
						order: 'desc',
						query: {
					SL_isStop:1
				}
					})
					.then(res => {
						const resData = res.data;
						const code = resData.code;
						const msg = resData.msg;
						if (code != 1) {
							this.$Message.error(code.msg);
							return;
						}
						const data = resData.data;
				this.$data.startID = data[0].workID;
				for (let i = 0; i < this.$data.tableData1.length; i++) {
					this.$data.startID = '0'+(parseInt(this.$data.startID) + 1).toString();
					this.$data.tableData1[i].workID = this.$data.startID;
				}
				})
				.catch(err => {});
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

