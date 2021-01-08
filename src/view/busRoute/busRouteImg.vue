<!-- \\测试也页面 -->
<style lang="less">
	@import "../../styles/table-common.less";
</style>
<template>
	<div class="search">
		<Card>
			<Row v-show="openSearch" @keydown.enter.native="handleSearch">
				<Form ref="searchForm" :model="searchForm" inline label-position="right" :label-width="70">
					<FormItem label="线路名称" prop="lineName">
						<Input v-model="searchForm.lineName" type="text" clearable placeholder="请输入线路名称" />
					</FormItem>
					<FormItem label="站点名称" prop="stationName">
						<Input v-model="searchForm.stationName" type="text" clearable placeholder="请输入站点名称" />
					</FormItem>
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
				<Button @click="add" type="primary" icon="md-add">添加线路</Button>
				<Button @click="handleFileImport" type="primary" icon="md-cloud-upload">批量导入</Button>
				<Dropdown @on-click="handleDropdown">
					<Button>
						更多操作
						<Icon type="md-arrow-dropdown" />
					</Button>
					<DropdownMenu slot="list">
						<DropdownItem name="refresh">刷新</DropdownItem>
						<DropdownItem name="exportData">导出所选数据</DropdownItem>
						<DropdownItem name="exportAll">导出全部数据</DropdownItem>
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
				<Table :loading="loading" border ref="table" :data="data" v-bind:columns="columns" sortable="custom"
				 @on-selection-change="showSelect">
				</Table>
				<Table :columns="exportColumns" :data="exportData" ref="exportTable" style="display: none">
				</Table>
			</Row>
			<Row type="flex" justify="end" class="page">
				<Page :total="pageTotal" :current="searchForm.pageNumber" :page-size="searchForm.pageSize" @on-change="changePage"
				 @on-page-size-change="changePageSize" show-total show-elevator show-sizer>
				</Page>
			</Row>
		</Card>
		<Modal 
			v-model="modalExportAll" 
			title="确认导出" 
			:loading="loadingExport" 
			@on-ok="exportAll">
			<p>您确认要导出全部 {{ pageTotal }} 条数据？</p>
		</Modal>
		<Drawer title="导入数据" closable v-model="importModalVisible" width="1000">
			<div style="display: flex;justify-content: space-between;align-items: center;">
				<Upload action :before-upload="beforeUploadImport" accept=".xls, .xlsx">
					<Button :loading="reading" icon="ios-cloud-upload-outline" style="margin-right: 10px">上传Excel文件</Button>
					<span v-if="uploadfile.name">当前选择文件：{{ uploadfile.name }}</span>
				</Upload>
				<Button @click="clearImportData" icon="md-trash">清空数据</Button>
			</div>
			<Alert type="warning" show-icon>
				导入前请下载查看导入模版数据文件查看所需字段及说明，确保数据格式正确，不得修改列英文名称
			</Alert>
			<Table :columns="importColumns" border :height="height" :data="importTableData" ref="importTable"></Table>
			<div class="drawer-footer">
				<Button @click="downloadTemple" type="info">下载导入模板</Button>
				<div style="position: absolute; right: 15px; display: inline-block">
					<Button @click="importModalVisible = false">关闭</Button>
					<Button :loading="importLoading" :disabled="importTableData.length <= 0" @click="importData" style="margin-left: 8px"
					 type="primary">
						确认导入
						<span v-if="importTableData.length > 0">{{ importTableData.length }} 条数据</span>
					</Button>
				</div>
			</div>
		</Drawer>
		<Edit
		  :data="form"
		  :type="showType"
		  v-model="showUser"
		  @on-submit="getDataList"
		/>
	</div>
</template>
<script>
	import "@/assets/css/util.less";
	import Edit from "./Edit.vue";
	import excel from "@/libs/excel";
	import "viewerjs/dist/viewer.css";
	import Viewer from "viewerjs";
	import { userColumns, userData } from "./BusRouteTemplate";
	import {
		add,
		getUserListData,
		Import as ImportUser,
		remove,
		deleteBatch
	} from "@/api/busRoute";

	export default {
		name: 'busRouteManage',
		components: {
			Edit
		},
		data() {
			return {
				height: 510,
				showUser: false,
				showType: "0",
				form: {},
				data: [],
				exportData: [],
				exportColumns: [
					{
						title: "线路名称",
						key: "lineName",
					},
					{
						title: "序号",
						key: "lineItem",
					},
					{
						title: "站点名称",
						key: "stationName",
					},
					{
						title: "乘车位置",
						key: "busLoc",
					},
					{
						title: "白班发车时间",
						key: "dayTime",
					},
					{
						title: "夜班发车时间",
						key: "nightTime",
					},
					{
						title: "创建时间",
						key: "createTime",
					},
					{
						title: "创建账号",
						key: "createUser",
					}
				],
				searchForm: {
					lineName: "",
					stationName: "",
					isStop:0,
					pageNumber: 1,
					pageSize: 10,
					sort: "lineName,createTime",
					order: "asc"
				},
				importTableData: [],
				importColumns: [],
				uploadfile: {
					name: "",
				},
				tempColumns: userColumns,
				tempData: userData,
				pageTotal: 0,
				loading: false,
				eidtRow: {},
				reading: false,
				importLoading: false,
				openSearch: true,
				openTip: true,
				loadingExport: true,
				importModalVisible: false,
				modalExportAll: false,
				drop: false,
				dropDownContent: "展开",
				selectList: [],
				columns: [{
						type: "selection",
						width: 60,
						align: "center",
					},
					{
						title: "序号",
						type: 'index',
						align: 'center',
						width: 80,
					},
					{
						title: "线路名称",
						key: "lineName",
						align: 'center',
						width: 120
					},
					{
						title: "序号",
						key: "lineItem",
						align: 'center',
						width: 80,						
					},
					{
						title: "站点名称",
						key: "stationName",
						align: 'center',
						width: 120
					},
					{
						title: "乘车位置",
						key: "busLoc",
						align: 'center',
						width: 303
					
					},
					{
						title: "白班发车时间",
						key: "dayTime",
						align: 'center',
						width: 100
					},
					{
						title: "夜班发车时间",
						key: "nightTime",
						align: 'center',
						width: 100
					},
					{
						title: "操作",
						key: "action",
						align: 'center',
						width: 245,
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
												this.handleEdit(params.row);
											}
										}
									},
									"编辑"
								),
								h(
									"Button", {
										props: {
											type: "error",
											size: "small",
											icon: "md-trash"
										},
										on: {
											click: () => {
												this.handleDelete(params.row);
											}
										}
									},
									"删除"
								)
							]);
						}
					}
				]
			};
		},
		computed: {},
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
			changePage(page) {
				this.searchForm.pageNumber = page;
				this.getDataList();
				this.clearSelectAll();
			},
			changePageSize(pageSize) {
				this.searchForm.pageSize = pageSize;
				this.getDataList();
			},
			handleReset() {
				this.$refs.searchForm.resetFields();
				this.searchForm.pageNumber = 1;
				this.searchForm.pageSize = 10;
				this.searchForm.cardId = "";
				this.searchForm.name = "";
				this.searchForm.phone = "";
				this.searchForm.sex = "";
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
								filename: "身份信息数据",
							});
						},
					});
				} else if (name == "exportAll") {
					this.modalExportAll = true;
				}
			},
			exportAll() {
				getUserListData(this.searchForm).then((res) => {
					this.modalExportAll = false;
					const resData = res.data;
					const code = resData.code;
					if (code == 1) {
						this.exportData = resData.data;
						setTimeout(() => {
							this.$refs.exportTable.exportCsv({
								filename: "身份信息全部数据",
							});
						}, 1000);
					}
				});
			},
			handleDelete(params) {
				var row = params;
				this.$Modal.confirm({
					title: "提示",
					content: "<p>确定要删除[" + row.id + "]?</p>",
					onOk: () => {
						this.remove(row);
					},
					onCancel: row => {}
				});
			},
			beforeUploadImport(file) {
				this.uploadfile = file;
				const fileExt = file.name.split(".").pop().toLocaleLowerCase();
				if (fileExt == "xlsx" || fileExt == "xls") {
					this.readFile(file);
					this.file = file;
				} else {
					this.$Notice.warning({
						title: "文件类型错误",
						desc: "所选文件‘ " +
							file.name +
							" ’不是EXCEL文件，请选择后缀为.xlsx或者.xls的EXCEL文件。",
					});
				}
				return false;
			},
			// 读取文件
			readFile(file) {
				this.reading = true;
				const reader = new FileReader();
				reader.readAsArrayBuffer(file);
				reader.onerror = (e) => {
					this.reading = false;
					this.$Message.error("文件读取出错");
				};
				reader.onload = (e) => {
					const data = e.target.result;
					const {
						header,
						results
					} = excel.read(data, "array");
					const tableTitle = header.map((item) => {
						return {
							title: item,
							key: item,
							minWidth: 130,
							align: "center"
						};
					});
					this.importTableData = results;
					this.importColumns = tableTitle;
					this.reading = false;
					this.$Message.success("读取数据成功");
				};
			},
			clearImportData() {
				this.importTableData = [];
				this.importColumns = [];
				this.uploadfile = {};
			},
			downloadTemple() {
				let title = [];
				let key = [];
				userColumns.forEach((e) => {
					title.push(e.title);
					key.push(e.key);
				});
				const params = {
					title: title,
					key: key,
					data: userData,
					autoWidth: true,
					filename: "班车线路数据模版",
				};
				excel.export_array_to_excel(params);
			},
			importData() {
				this.importLoading = true;
				for (let k in this.importTableData) {
					this.importTableData[k].BatchCode = this.searchForm.batchCode;
					this.importTableData[k].AgentID = this.searchForm.agentID;
				}
				ImportUser(this.importTableData).then(res => {
					this.importLoading = false;
					const resData = res.data;
					const code = resData.code;
					if (code == 1) {
						this.$Message.info("导入成功");
						this.getDataList();
					}
				}).catch(() => {
					this.$Notice.warning({
						title: '信息录入导入失败',
						desc: '信息录入导入失败'
					})
				})
			},
			handleFileImport() {
				this.importModalVisible = true;
			},			
			handleEdit(v) {
				for (let attr in v) {
				  if (v[attr] == null) {
				    v[attr] = "";
				  }
				}
				let str = JSON.stringify(v);
				let data = JSON.parse(str);
				
				this.form = data;
				this.showType = "1";
				this.showUser = true;
			},
			add() {
				this.showType = "2";
				this.showUser = true;
			},
			remove(row) {
				var id = row.id;
				remove(id)
					.then(res => {
						const resData = res.data;
						const code = resData.code;
						const msg = resData.msg;
						if (code == 1) {
							this.$Message.info("删除成功");
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
			// 计算高度
			this.height = Number(document.documentElement.clientHeight - 230);
			this.getDataList();
		}
	};
</script>
