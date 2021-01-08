<template>
	<div class="search">
		<Card>
			<Row v-show="openSearch" @keydown.enter.native="handleSearch">
				<Form ref="searchForm" :model="searchForm" inline label-position="right" :label-width="70">
					<FormItem label="姓名" prop="name">
						<Input v-model="searchForm.name" type="text" clearable placeholder="请输入姓名" />
					</FormItem>
					<FormItem label="身份证号" prop="cardId">
						<Input v-model="searchForm.cardId" type="text" clearable placeholder="请输入身份证号" />
					</FormItem>
					<spn v-if="drop">
						<FormItem label="体检结果" prop="examResult">
							<Select v-model="searchForm.SES_examResult" placeholder="请选择" clearable style="width: 200px">
								<Option v-for="(item, i) in dictResult" :key="i" :value="item.value">{{ item.title }}</Option>
							</Select>
						</FormItem>
					</spn>
					<FormItem>
						<Button @click="handleSearch" type="info" icon="md-search">搜索</Button>
						<Button style="margin-left: 8px;" @click="handleReset">重置</Button>
						<a class="drop-down" @click="dropDown">
							{{ dropDownContent }}
							<Icon type="ios-arrow-down"></Icon>
						</a>
					</FormItem>
				</Form>
			</Row>
			<Row class="operation">
				<Upload style="display: inline-block" action="" :before-upload="handleDeleteBatch">
					<Button icon="md-trash" type="primary">
						批量删除
					</Button>
				</Upload>
				<Upload style="display: inline-block" action="" :before-upload="handleUpdate">
					<Button icon="ios-document" type="primary">
						批量更新
					</Button>
				</Upload>
				<Button type="success" icon="md-checkmark-circle" @click="setResult(true)">合格 </Button>
				<Button type="error" icon="md-close-circle" @click="setResult(false)">不合格</Button>
				<Dropdown @on-click="handleDropdown">
					<Button>
						更多操作
						<Icon type="md-arrow-dropdown" />
					</Button>
					<DropdownMenu slot="list">
						<DropdownItem name="refresh">刷新</DropdownItem>
						<DropdownItem name="exportData">导出所选数据</DropdownItem>
						<DropdownItem name="exportAll">导出全部数据</DropdownItem>
						<DropdownItem name="importData">导入数据</DropdownItem>
					</DropdownMenu>
				</Dropdown>
				<Button type="dashed" @click="openSearch = !openSearch">
					{{ openSearch ? "关闭搜索" : "开启搜索" }}
				</Button>
				<Button type="dashed" @click="openTip = !openTip">
					{{ openTip ? "关闭提示" : "开启提示" }}
				</Button>
			</Row>
			<Row v-show="openTip">
				<Alert show-icon>
					已选择
					<span class="select-count">{{ this.selectList.length }}</span> 项
					<a class="select-clear" @click="clearSelectAll">清空</a>
				</Alert>
			</Row>
			<Row>
				<Tabs type="card" ref="tabs" @on-click="tabsClick">
					<TabPane v-for="(tab, index) in tabList" :key="index" :label="tab.label" :name="tab.name">
						<Table :loading="loading" border ref="table" :data="data" v-bind:columns="columns" sortable="custom"
						 @on-selection-change="showSelect"></Table>
					</TabPane>
				</Tabs>
				<Table :columns="exportColumns" :data="exportData" ref="exportTable" style="display: none"></Table>
			</Row>
			<Row type="flex" justify="end" class="page">
				<Page :total="pageTotal" :current="searchForm.pageNumber" :page-size="searchForm.pageSize" @on-change="changePage"
				 @on-page-size-change="changePageSize" show-total show-elevator show-sizer></Page>
			</Row>
		</Card>
		<Modal title="编辑" 
			:mask-closable="false" 
			v-model="modalEdit" 
			width="800" 
			scrollable 
			footer-hide 
			@on-ok="saveEdit">
			<Edit ref="edit" :parent="this" v-bind:edit-row="eidtRow"></Edit>
		</Modal>
	</div>
</template>
<script>
	import "@/assets/css/util.less";
	import Edit from "./EditExam";
	import {
		getUserListData,
		remove as removeUser,
		deleteBatch,
		UpdateBatch as UpdateUser
	} from "@/api/HealthExam";
	import {
		remove,
		deleteBatch as deleteBatchAgent
	} from "@/api/AgentInputs";
	import {
		getArrayFromFile,
		getTableDataFromArray
	} from '@/libs/util'
	import {
		objEqual
	} from '@/libs/tools'

	export default {
		name: 'userManage',
		components: {
			Edit
		},
		data() {
			return {
				height: 510,
				data: [],
				exportData: [],
				exportColumns: [
					{
						title: "身份证号",
						key: "CardID",
					},
					{
						title: "姓名",
						key: "Name",
					},
					{
						title: "体检结果",
						key: "ExamResult",
					},
					{
						title: "体检时间",
						key: "CreateTime",
					}
				],
				loading: false,
				openSearch: true,
				openTip: true,
				loadingExport: true,
				drop: false,
				dropDownContent: "展开",
				selectList: [],
				dictResult: [
					{
						title: '待检查',
						value: '待检查'
					}, 
					{
						title: '合格',
						value: '合格',
					}, 
					{
						title: '不合格',
						value: '不合格',
					},
				],
				searchForm: {
					cardId: "",
					name: "",
					SES_examResult: "待检查",
					pageNumber: 1,
					pageSize: 10,
					sort: "CreateTime",
					order: "desc"
				},
				pageTotal: 0,
				eidtRow: {},
				modalInit: false,
				modalEdit: false,
				modalExportAll: false,
				tabList: [
					{
						label: "待检查",
						name: "待检查"
					}, 
					{
						label: "合格",
						name: "合格"
					}, 
					{
						label: "不合格",
						name: "不合格"
					},
				],
				formCard: {
					startCardID: '',
				},
				Row: {
					cardID: '',
					name: '',
					examResult: '',
				},
				ruleAgent: {
					cardID: [{
						trigger: "blur"
					}],
					name: [{
						trigger: "blur"
					}],
					examResult: [{
						required: false,
						trigger: "blur"
					}],
				},
				columns: [
					{
						type: 'selection',
						width: 60,
						align: 'center',
					},
					{
						title: "序号",
						type: 'index',
						width: 80,
						align: 'center',
					},
					{
						title: "姓名",
						key: "name",
						align: 'center',
						width: 150
					},
					{
						title: "身份证号",
						key: "cardID",
						align: 'center',
						width: 220

					},
					{
						title: "部门",
						key: "department",
						align: 'center',
						width: 150
					},
					{
						title: "体检结果",
						key: "examResult",
						align: 'center',
						resizable: true,
						width: 150,
					},
					{
						title: "创建时间",
						key: "modifyDate",
						align: 'center',
						resizable: true,
						width: 220,
					}
					// ,
					// {
					// 	title: "操作",
					// 	key: "action",
					// 	// fixed: 'right',
					// 	width: 300,
					// 	align: "center",
					// 	render: (h, params) => {
					// 		return h("div", [
					// 			h(
					// 				"Button", {
					// 					props: {
					// 						type: "primary",
					// 						size: "small",
					// 						icon: "md-create"
					// 					},
					// 					style: {
					// 						marginRight: "5px"
					// 					},
					// 					on: {
					// 						click: () => {
					// 							this.handleEdit(params);
					// 						}
					// 					}
					// 				},
					// 				"编辑"
					// 			),
					// 			h(
					// 				"Button", {
					// 					props: {
					// 						type: "error",
					// 						size: "small",
					// 						icon: "md-trash"
					// 					},
					// 					on: {
					// 						click: () => {
					// 							this.handleDelete(params);
					// 						}
					// 					}
					// 				},
					// 				"删除"
					// 			)
					// 		]);
					// 	}
					// }
				]
			};
		},
		methods: {
			init() {
				this.getDataList();
			},
			getDataList() {
				getUserListData(this.searchForm).then((res) => {
					const resData = res.data;
					const code = resData.code;
					if (code != 1) {
						this.$Message.error(code.msg);
						return;
					}
					const data = resData.data;
					console.log(data)
					this.data = data;
					this.pageTotal = resData.count;
					if (this.data.length == 0 && this.searchForm.pageNumber > 1) {
						this.searchForm.pageNumber -= 1;
						this.getDataList();
					}
				});
			},
			formatDate(date) {
				const y = date.getFullYear();
				let m = date.getMonth() + 1;
				m = m < 10 ? "0" + m : m;
				let d = date.getDate();
				d = d < 10 ? "0" + d : d;
				return y + "-" + m + "-" + d;
			},
			changePage(page) {
				this.searchForm.pageNumber = page;
				this.getDataList();
				this.clearSelectAll();
			},
			changePageSize(pageSize) {
				this.searchForm.pageSize = pageSize;
				this.getDataList();
			},
			vaildFileFormat(headRow) {
				var templateHeadRow = ["身份证号码", "姓名", "体检结果"];
				return objEqual(headRow, templateHeadRow);
			},
			handleReset() {
				this.$refs.searchForm.resetFields();
				this.searchForm.cardId = "";
				this.searchForm.name = "";
				this.searchForm.examResult = "";
				this.searchForm.pageNumber = 1;
				this.searchForm.pageSize = 10;
				// 重新加载数据
				this.getDataList();
			},
			handleSearch() {
				this.searchForm.pageNumber = 1;
				this.searchForm.pageSize = 10;
				this.getDataList();
			},
			dropDown() {
				if (this.drop) {
					this.dropDownContent = "展开";
					this.dropDownIcon = "ios-arrow-down";
				} else {
					this.dropDownContent = "收起";
					this.dropDownIcon = "ios-arrow-up";
				}
				this.drop = !this.drop;
			},
			showSelect(e) {
				this.exportData = e;
				this.selectList = e;
				this.selectList.length = e.length;
			},
			clearSelectAll() {
				this.$refs.table.selectAll(false);
			},
			handleDropdown(name) {
				if (name == "refresh") {
					this.handleReset();
				} else if (name == "exportData") {
					if (this.selectList.length <= 0) {
						this.$Message.warning("您还未选择要导出的数据");
						return;
					}
					this.$Modal.confirm({
						title: "确认导出",
						content: "您确认要导出所选 " + this.selectList.length + " 条数据?",
						onOk: () => {
							this.$refs.exportTable.exportCsv({
								filename: "员工身份信息数据",
							});
						},
					});
				} else if (name == "exportAll") {
					this.modalExportAll = true;
				} else if (name == "importData") {

				}
			},
			exportAll() {
				setPageData().then((res) => {
					this.modalExportAll = false;
					if (res.success) {
						this.exportData = res.result;
						setTimeout(() => {
							this.$refs.exportTable.exportCsv({
								filename: "用户全部数据",
							});
						}, 1000);
					}
				});
			},
			tabsClick(name) {
				this.searchForm.SES_examResult = name;
				console.log(JSON.stringify(this.searchForm));
				this.getDataList();
			},
			//删除记录提醒
			handleDelete(params) {
				var row = params.row;
				this.$Modal.confirm({
					title: "提示",
					content: "<p>确定要删除[" + row.name + "]?</p>",
					onOk: () => {
						this.removeUser(row);
					},
					onCancel: row => {}
				});
			},
			//删除记录
			removeUser(row) {
				var id = row.cardID;
				removeUser(id)
					.then(res => {
						const resData = res.data;
						const data = resData.data;
						const code = resData.code;
						const msg = resData.msg;
						if (code == 1) {
							this.$Message.info("删除成功");
							remove(id).then(res => {
								console.log("Agent删除成功")
							});
							this.getDataList()();
						} else {
							this.$Message.error({
								content: msg,
								duration: 10,
								closable: true
							});
						}
					})
					.catch(err => {});
			},
			//批量删除
			handleDeleteBatch(file) {
				getArrayFromFile(file).then(data => {
					var ar = this.vaildFileFormat(data[0]);
					data[0] = ["CardID", "Name", "ExamResult"];
					// console.log("头行匹配结果：" + data)
					if (ar) {
						let {
							columns,
							tableData
						} = getTableDataFromArray(data);
						console.log("读取数据结果：" + JSON.stringify(tableData))
						deleteBatch(tableData).then(res => {
							const resData = res.data;
							const data = resData.data;
							const code = resData.code;
							const msg = resData.msg;
							if (code == 1) {
								this.$Message.info("批量删除成功");
								let templist = tableData.map(item => ({
									CardID: item.CardID,
									Name: item.Name,
								}));
								deleteBatchAgent(templist).then(res => {
									console.log("Agent表批量删除成功")
								});
								this.getDataList();
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
			//批量更新
			handleUpdate(file) {
				getArrayFromFile(file).then(data => {
					var ar = this.vaildFileFormat(data[0]);
					data[0] = ["CardID", "Name", "ExamResult"];

					if (ar) {
						let { tableData } = getTableDataFromArray(data);		
						UpdateBatch(tableData).then(res => {
							const resData = res.data;
							const code = resData.code;
							const msg = resData.msg;
							if (code == 1) {
								this.$Message.info("导入成功");
								this.getDataList();
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
			//更新记录
			handleEdit(params) {
				this.modalEdit = true;
				this.isAdd = false;
				this.eidtRow = params.row;
			},
			saveEdit() {
				var row = this.$refs.edit.Row;
			},
			saveValidate(name = "Row") {
				return this.$refs[name].validate(valid => {
					if (!valid) {
						this.$Message.warning("请检查表单数据！");
						return false;
					}
				});
			},
			setResult(status) {
				if (this.selectList.length == 0) {
					this.$Message.warning("请选择需要操作的行！");
					return;
				}

				this.selectList.forEach(function(item) {
					item.examResult = status == true ? "合格" : "不合格";
				})

				UpdateUser(this.selectList)
					.then(res => {
						const resData = res.data;
						const code = resData.code;
						const msg = resData.msg;
						if (code == 1) {
							this.$Message.info("更新成功");
							this.getDataList();
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
		},
		mounted() {
			this.height = Number(document.documentElement.clientHeight - 230);
			this.init();
		}
	}
</script>

<style lang = "less">
	.operation {
		height: 40px;
	}

	.operation button {
		margin-right: 8px;
	}

	.search .drop-down {
		margin-left: 12px;
	}
</style>
