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
						<FormItem label="面试官" prop="interviewer">
							<Select v-model="searchForm.interviewer" placeholder="请选择" clearable style="width: 200px">
								<Option v-for="(item, i) in interviewerList" :key="i" :value="item.value">{{ item.title }}</Option>
							</Select>
						</FormItem>
						<FormItem label="面试结果" prop="interviewResult">
							<Select v-model="searchForm.interviewResult" placeholder="请选择" clearable style="width: 200px">
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
				<Select class="select" v-model="selectedDepartment" placeholder="请选择部门">
					<Option 
						v-for="item in departmentList" 
						:value="item.value" 
						:key="item.value">{{ item.value }}
					</Option>
				</Select>
				<Select class="select" v-model="selectedInterviewer" placeholder="请选择面试官">
					<Option 
						v-for="item in interviewerList" 
						:value="item.value" 
						:key="item.value">{{ item.value }}
					</Option>
				</Select>
				<Button type="success" icon="md-checkmark-circle" @click="setResult(true)">通过 </Button>
				<Button type="error" icon="md-close-circle" @click="setResult(false)">失败 </Button>
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
				<Button type="dashed" @click="openSearch = !openSearch">{{
				  openSearch ? "关闭搜索" : "开启搜索"
				}}</Button>
				<Button type="dashed" @click="openTip = !openTip">{{
				  openTip ? "关闭提示" : "开启提示"
				}}</Button>
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
					<TabPane 
						v-for="(tab, index) in tabList" 
						:key="index" 
						:label="tab.label" 
						:name="tab.name">
						<Table 
							:loading="loading" 
							border ref="table" 
							:data="data" 
							v-bind:columns="columns" 
							sortable="custom"
							@on-selection-change="showSelect">
						</Table>
					</TabPane>
				</Tabs>
				<Table 
					:columns="exportColumns" 
					:data="exportData" 
					ref="exportTable" 
					style="display: none">
				</Table>
			</Row>
			<Row type="flex" justify="end" class="page">
				<Page 
					:total="pageTotal" 
					:current="searchForm.pageNumber" 
					:page-size="searchForm.pageSize" 
					@on-change="changePage"
					@on-page-size-change="changePageSize" 
					show-total 
					show-elevator 
					show-sizer>
				</Page>
			</Row>
		</Card>
	</div>
</template>

<script>
	import "@/assets/css/util.less";
	import { getUserListData, UpdateBatch as UpdateUser } from "@/api/Interview";	
	import { searchDictData } from "@/api/dict";
	import { objEqual } from '@/libs/tools'

	export default {
		name: 'userManage',
		components: {
		},
		data() {
			return {
				height: 510,
				data: [],
				exportData: [],
				exportColumns: [{
						title: "身份证号",
						key: "CardID",
					},
					{
						title: "姓名",
						key: "Name",
					},
					{
						title: "面试结果",
						key: "InterviewResult",
					},
					{
						title: "面试官",
						key: "Interviewer",
					},
					{
						title: "面试时间",
						key: "CreateTime",
					}
				],
				loading: false,
				openSearch: true,
				openTip: true,
				loadingExport: true,
				modalExportAll: false,
				drop: false,
				dropDownContent: "展开",				
				searchForm: {
					cardId: "",
					name: "",
					interviewResult: "待面试",
					interviewer: "",
					pageNumber: 1,
					pageSize: 10,
					sort: "CreateTime",
					order: "desc"
				},
				pageTotal: 0,
				selectList: [], //选中的行数
				selectedDepartment:'',  //部门
				selectedInterviewer: '', //选择的面试官
				dictResult: [
					{
						title: '待面试',
						value: '待面试'
					}, 
					{
						title: '通过',
						value: '通过',
					}, 
					{
						title: '失败',
						value: '失败',
					},
				],
				columns: [{
						type: 'selection',
						width: 60,
						align: 'center',
						fixed: "left",
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
						title: "面试结果",
						key: "interviewResult",
						align: 'center',
						width: 150
					},
					{
						title: "面试官",
						key: "interviewer",
						align: 'center',
						width: 150
					},
					{
						title: "创建时间",
						key: "modifyDate",
						align: 'center',
						width: 220
					}
				],
				tabList: [
					{
						label: "待面试",
						name: "待面试"
					},
					{
						label: "通过",
						name: "通过"
					},
					{
						label: "未通过",
						name: "失败"
					}
				],
				departmentList:{},
				interviewerList: {},
			}
		},
		methods: {
			init() {
				this.getDataList();
				this.loadDictData();
			},
			loadDictData() {
				const key = "10"; //部门
				const key2 = "11"; //面试官
				searchDictData(key).then((res) => {
					const resData = res.data;
					const code = resData.code;
					if (code == 1) {
						this.departmentList = resData.data;
					}
				});
				
				searchDictData(key2).then((res) => {
					const resData = res.data;
					const code = resData.code;
					if (code == 1) {
						this.interviewerList = resData.data;
					}
				});
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
			handleReset() {
				this.$refs.searchForm.resetFields();
				this.$refs.dep.clearSelect();
				this.searchForm.pageNumber = 1;
				this.searchForm.pageSize = 10;
				this.searchForm.cardId = "";
				this.searchForm.name = "";
				this.searchForm.interviewer = "";
				this.searchForm.interviewResult = "";
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
				}
			},
			exportAll() {
				getUserListData().then((res) => {
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
				this.searchForm.interviewResult = name;
				this.getDataList();
			},
			setResult(status) {
				if (this.selectList.length == 0) {
					this.$Message.warning("请选择需要操作的行！");
					return false;
				}
				if (this.selectedDepartment == "") {
					this.$Message.warning("请选择部门！");
					return false;
				}
				if (this.selectedInterviewer == "") {
					this.$Message.warning("请选择面试官！");
					return false;
				}

				var department = this.selectedDepartment;
				var interviewer = this.selectedInterviewer;
				this.selectList.forEach(function(item) {
					item.interviewResult = status == true ? "通过" : "失败";
					item.interviewer = interviewer;
					item.department = department;
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
			// 计算高度
			this.height = Number(document.documentElement.clientHeight - 230);
			this.init();
		}
	}
</script>

<style lang="less">
	.operation {
		height: 40px;
	}
	
	.select {
		display: inline-block;
		width: 150px; 
		margin-right: 8px;
	}

	.operation button {
		margin-right: 8px;
	}

	.search .drop-down {
		margin-left: 12px;
	}
</style>
