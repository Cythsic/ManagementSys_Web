<template>
	<div class="search">
		<Card>
			<Row>
				<Steps :current="currentStep" style="padding: 20px 50px 20px 50px;">
					<Step title="选择入职员工" content="请选择要制作工卡的员工"></Step>
					<Step title="输入起始工牌卡号" content="请输入起始工牌的卡号"></Step>
					<Step title="点击生成工号" content="请输入员工工号"></Step>
					<Step title="提交系统" content="确认信息,导出制卡文本"></Step>
				</Steps>
			</Row>
			<Row class="operation">
				<Button type="primary" icon="md-add" @click="openWorkCardId">
					创建卡号
				</Button>
				<Dropdown @on-click="handleDropdown">
					<Button type="primary">
						生成工号
						<Icon type="md-arrow-dropdown" />
					</Button>
					<DropdownMenu slot="list">
						<DropdownItem name="system">从系统获取</DropdownItem>
						<DropdownItem divided name="manual">手动输入</DropdownItem>
					</DropdownMenu>
				</Dropdown>
				<Button type="primary" icon="md-checkmark-circle" @click="save">
					提交系统
				</Button>
				<Button icon="md-download" @click="exportAll">
					导出
				</Button>
				<Button icon="md-refresh" @click="Refresh">
					刷新
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
				<Tabs 
					type="card" 
					ref="tabs" 
					@on-click="tabsClick">
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
		<Modal 
			title="编辑" 
			:mask-closable="false" 
			v-model="modalEdit" 
			width="800" 
			scrollable 
			footer-hide 
			@on-ok="saveEdit">
			<Edit ref="edit" :parent="this" v-bind:edit-row="eidtRow"></Edit>
		</Modal>
		<Modal 
			v-model="modalInit" 
			title="输入起始工牌卡号" 
			@on-ok="createWorkCardId('formCard')" 
			@on-cancel="cancle">
			<Form 
				ref="formCard" 
				label-position="right" 
				:model="formCard" 
				:label-width="100">
				<FormItem label="起始卡号" prop="startCardID">
					<Input v-model="formCard.startCardID" />
				</FormItem>
			</Form>
		</Modal>
		<Modal
			v-model="modalInputWorkId" 
			title="输入起始员工工号" 
			@on-ok="createWorkId('formWorkCard')" 
			@on-cancel="cancle">
			<Form 
				ref="formWorkCard" 
				label-position="right" 
				:model="formWorkCard" 
				:label-width="100">
				<FormItem label="起始工号" prop="startWorkCardID">
					<Input v-model="formWorkCard.startWorkCardID" />
				</FormItem>
			</Form>
		</Modal>
	</div>
</template>
<script>
	import "@/assets/css/util.less";
	import Edit from "./EditCard";
	import { getUserListData, searchWorkId, UpdateBatch } from "@/api/WorkCard";

	export default {
		name: 'workCard',
		components: {
			Edit
		},
		data() {
			return {
				currentStep: 0,
				startID: '',
				height: 510,
				data: [],
				exportData: [],
				exportColumns: [{
						title: "姓名",
						key: "Name",
					},
					{
						title: "部门",
						key: "Department",
					},
					{
						title: "工牌卡号",
						key: "WorkCardID",
					},
					{
						title: "员工工号",
						key: "WorkID",
					},
					{
						title: "创建时间",
						key: "CreateTime",
					}
				],
				selectList: [],
				loading: false,
				openTip: true,
				pageTotal: 0,
				pageCurrent: 1,
				searchForm: {
					pageNumber: 1,
					pageSize: 10,
					isCard: 0,
					isStop: 0,
					sort: "ModifyDate",
					order: "desc"
				},
				modalInit: false,
				modalEdit: false,
				modalInputWorkId:false,
				eidtRow: {},
				formCard: {
					startCardID: '',
				},
				formWorkCard: {
					startWorkCardID: '',
				},
				tabList: [
					{
						label: "待制卡",
						name: "unproduced"
					},
					{
						label: "已制卡",
						name: "produced"
					},
				],
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
						title: "工牌卡号",
						key: "workCardID",
						resizable: true,
						align: 'center',
						width: 150
					},
					{
						title: "员工工号",
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
						width: 103
					},
					{
						title: "姓名",
						key: "name",
						resizable: true,
						align: 'center',
						width: 145
					},
					{
						title: "创建时间",
						key: "modifyDate",
						resizable: true,
						align: 'center',
						width: 220
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
			},
			changePageSize(pageSize) {
				this.searchForm.pageSize = pageSize;
				this.getDataList();
			},
			tabsClick(name) {
				if (name == "unproduced") {
					this.searchForm.isCard = 0;
				} else if (name == "produced") {
					this.searchForm.isCard = 1;
				}
				this.handleReset();
			},
			showSelect(e) {
				this.exportData = e;
				this.selectList = e;
				this.selectList.length = e.length;
				console.log("changed:" + e);
				console.log("selectList:" + this.selectList.length);
				
				if(this.selectList.length == 0) {
					this.currentStep -= 1;
				}else {
					if(this.currentStep == 0) {
						this.currentStep += 1;
					}
				}
			},
			clearSelectAll() {
				this.$refs.table.selectAll(false);
			},
			handleReset() {
				this.searchForm.pageNumber = 1;
				this.searchForm.pageSize = 10;
				this.currentStep = 0;
				// 重新加载数据
				this.getDataList();
			},
			handleEdit(params) {
				this.modalEdit = true;
				this.isAdd = false;
				this.eidtRow = params.row;
			},
			handleDropdown(name) {
				if (name == "system") {
					this.createWorkId();
				} else if (name == "manual") {
					if(this.currentStep == 2) {
						this.modalInputWorkId = true;
					}
				}
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
			//生成员工工号
			createWorkId() {
				if (this.currentStep != 2) {
					this.$Message.warning("请先创建工牌卡号");
					return;
				}
				if(this.formWorkCard.startWorkCardID != "") {
					this.startID = this.formWorkCard.startWorkCardID;
					let start = this.startID;
					for (let i = 0; i < this.data.length; i++) {
						for (let j = 0; j < this.selectList.length; j++) {
							if (this.data[i].name === this.selectList[j].name) {
								this.data[i].workID = start;
								this.selectList[j].workID = start;
								start = '0'+(parseInt(start) + 1).toString();
							}
						}
					}
					this.currentStep += 1;
				} else {
					searchWorkId().then(res => {
						const resData = res.data;
						const code = resData.code;
						if (code != 1) {
							this.$Message.warning("请手动输入初始工号");
							return;
						}
						const data = resData.data;
						this.startID = data.workID;
						
						let start = this.startID;
						for (let i = 0; i < this.data.length; i++) {
							for (let j = 0; j < this.selectList.length; j++) {
								if (this.data[i].name === this.selectList[j].name) {
									this.data[i].workID = start;
									this.selectList[j].workID = start;
									start = '0'+(parseInt(start) + 1).toString();
								}
							}
						}
						this.currentStep += 1;						
					})
				}
			},
			openWorkCardId() {
				if (this.selectList.length == 0) {
					this.$Message.warning("请先选择待制卡员工");
					return;
				}
				this.modalInit = true;
			},
			//生成工牌卡号
			createWorkCardId() {
				let start = this.formCard.startCardID;
				//自动生成工牌卡号
				for (let i = 0; i < this.data.length; i++) {
					for (let j = 0; j < this.selectList.length; j++) {
						if (this.data[i].name === this.selectList[j].name) {
							this.data[i].workCardID = start;
							this.selectList[j].workCardID = start;
							start = (parseInt(start) + 1).toString();
						}
					}
				}
				this.currentStep += 1;
			},
			cancle() {
				if (this.currentStep > 0) {
					this.currentStep -= 1;
				}					
			},
			save() {
				UpdateBatch(this.selectList).then(res => {
					const resData = res.data;
					const code = resData.code;
					const msg = resData.msg;
					if (code == 1) {
						this.$Message.info("提交成功");
						this.getDataList();
					} else {
						this.$Message.error({
							content: msg,
							duration: 10,
							closable: true
						});
					}
				})
			},
			exportAll() {
				this.$refs.exportTable.exportCsv({
					filename: '制作工卡数据',
					columns: this.exportColumns,
					data: this.exportData
				});
			},
			Refresh() {
				this.handleReset();
			}
		},
		mounted() {
			this.height = Number(document.documentElement.clientHeight - 230);
			this.init();
		}
	};
</script>

<style lang="less">
	.operation {
		height: 40px;
	}

	.operation button {
		margin-right: 8px;
	}
</style>
