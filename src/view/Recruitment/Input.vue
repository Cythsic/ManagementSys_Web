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
						<FormItem label="人事范围" prop="personnelArea">
							<Select v-model="searchForm.personnelArea" placeholder="请选择" clearable style="width: 200px">
								<Option v-for="(item, i) in PersonnelAreaList" :key="i" :value="item.value">{{ item.title }}</Option>
							</Select>
						</FormItem>
						<FormItem label="招聘方式" prop="recruitmentWay">
							<Select v-model="searchForm.recruitmentWay" placeholder="请选择" clearable style="width: 200px">
								<Option v-for="(item, i) in RecruitmentWayList" :key="i" :value="item.value">{{ item.title }}</Option>
							</Select>
						</FormItem>
						<FormItem label="用工类型" prop="empolyeeType">
							<Select v-model="searchForm.empolyeeType" placeholder="请选择" clearable style="width: 200px">
								<Option v-for="(item, i) in EmpolyeeTypeList" :key="i" :value="item.value">{{ item.title }}</Option>
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
				<Upload style="display: inline-block" action="" :before-upload="handleUpdate">
					<Button type="primary" icon="ios-document">批量更新</Button>
				</Upload>
				<Button @click="handleDeleteBatch" type="primary" icon="md-trash">批量删除</Button>
				<Button @click="handleSAP" type="primary" icon="md-checkmark-circle">提交SAP</Button>
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
					{{ openSearch ? "关闭搜索" : "开启搜索"}}
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
				<Table 
					:loading="loading" 
					border 
					ref="table" 
					:data="data" 
					v-bind:columns="columns" 
					sortable="custom"
					@on-selection-change="showSelect"
				></Table>
				<Table 
					:columns="exportColumns" 
					:data="exportData" 
					ref="exportTable" 
					style="display: none"
				></Table>
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
			v-model="modalAdd" 
			title="新增记录" 
			@on-ok="handleSubmit('Row')">
			<Form 
				ref="Row" 
				label-position="right" 
				:model="Row" 
				:rules="ruleAgent" 
				:label-width="100">
				<Row>
					<Col span="12">
					<FormItem label="身份证号" prop="cardID">
						<Input v-model="Row.cardID" />
					</FormItem>
					</Col>
					<Col span="12">
					<FormItem label="姓名" prop="name">
						<Input v-model="Row.name" />
					</FormItem>
					</Col>
				</Row>
				<Row>
					<Col span="12">
					<FormItem label="人事范围" prop="personnelArea">
						<Select v-model="Row.personnelArea">
							<Option value="KF03" key="KF03">KF03</Option>
							<Option value="KF09" key="KF09">KF09</Option>
						</Select>
					</FormItem>
					</Col>
					<Col span="12">
					<FormItem label="人事子范围" prop="personnelSubArea">
						<Select v-model="Row.personnelSubArea">
							<Option value="男" key="male">男</Option>
							<Option value="女" key="female">女</Option>
						</Select>
					</FormItem>
					</Col>
				</Row>
				<Row>
					<Col span="12">
					<FormItem label="员工组" prop="workerGroup">
						<Input v-model="Row.workerGroup" />
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
						<Input v-model="Row.salaryArea" />
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
						<Input v-model="Row.rankCode" />
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
						<Input v-model="Row.communicationType" />
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
						<Input v-model="Row.probation" />个月
					</FormItem>
					</Col>
				</Row>
				<Row>
					<Col span="12">
					<FormItem label="解雇通知期" prop="fireNotePeriod">
						<Input v-model="Row.fireNotePeriod" />个月
					</FormItem>
					</Col>
					<Col span="12">
					<FormItem label="辞职通知期" prop="resignNotePeriod">
						<Input v-model="Row.resignNotePeriod" />个月
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
							<Option value="正式工" key="1">正式工</Option>
							<Option value="短期工" key="2">短期工</Option>
							<Option value="学生工" key="3">学生工</Option>
						</Select>
					</FormItem>
					</Col>
				</Row>
				<Row>
					<Col span="24">
					<div style="text-align:center;">
						<Button @click="modalAdd=false">取消</Button>
						<Button style="margin-left:20px;" type="primary" @click="handleSubmit('Row')">保存</Button>
					</div>
					</Col>
				</Row>
			</Form>
		</Modal>
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
			v-model="modalExportAll"
			title="确认导出"
			:loading="loadingExport"
			@on-ok="exportAll"
		>
		<p>您确认要导出全部 {{ pageTotal }} 条数据？</p>
		</Modal>
	</div>
</template>
<script>
	import "@/assets/css/util.less";
	import Edit from "./EditInputs";
	import {
		getUserListData,
		add as AddInfo,
		remove as removeUser,
		deleteBatch as deleteData,
		UpdateBatch
	} from "@/api/HRInputs";
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
						title: "姓名",
						key: "name",
					},
					{
						title: "身份证号",
						key: "cardID",
					},
					{
						title: "人事范围",
						key: "personnelArea",
					},
					{
						title: "人事子范围",
						key: "personnelSubArea",
					},
					{
						title: "员工组",
						key: "workerGroup",
					},
					{
						title: "员工子组",
						key: "workerSubGroup",
					},
					{
						title: "工资范围",
						key: "salaryGroup",
					},
					{
						title: "职位",
						key: "occupation",
					},
					{
						title: "职级编码",
						key: "rankCode",
					},
					{
						title: "招聘渠道",
						key: "recruitmentSource",
					},
					{
						title: "通讯类型",
						key: "communicationType",
					},
					{
						title: "离职日期",
						key: "endDate",
					},
					{
						title: "合同类型",
						key: "contractType",
					},
					{
						title: "试用期时长",
						key: "probation",
					},
					{
						title: "合同类型",
						key: "contractType",
					},
					{
						title: "解雇通知期",
						key: "fireNotePeriod",
					},
					{
						title: "辞职通知期",
						key: "resignNotePeriod",
					},
					{
						title: "招聘方式",
						key: "recruitmentWay",
					},
					{
						title: "用工类型",
						key: "empolyeeType",
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
					personnelArea: "",
					recruitmentWay: "",
					empolyeeType: "",
					pageNumber: 1,
					pageSize: 10,
					sort: "ModifyDate",
					order: "desc"
				},
				pageTotal: 0,
				selectList: [], //选中的行数
				modalAdd: false,
				modalEdit: false,
				PersonnelAreaList: [
					{
						title: 'KF03',
						value: 'KF03'
					}, 
					{
						title: 'KF09',
						value: 'KF09',
					},
				],
				RecruitmentWayList: [
					{
						title: '社会招聘',
						value: '社会招聘'
					}, 
					{
						title: '应届生招聘',
						value: '应届生招聘',
					}, 
					{
						title: '集团内调动',
						value: '集团内调动',
					},
				],
				EmpolyeeTypeList: [
					{
						title: '正式工',
						value: '正式工'
					}, 
					{
						title: '短期工',
						value: '短期工',
					}, 
					{
						title: '学生工',
						value: '学生工',
					},
				],
				eidtRow: {},
				Row: {
					cardID: '',
					name: '',
					personnelArea: '',
					personnelSubArea: '',
					workerGroup: '',
					workerSubGroup: '',
					salaryGroup: '',
					occupation: '',
					rankCode: '',
					recruitmentSource: '',
					communicationType: '',
					endDate: '',
					contractType: '',
					probation: '',
					fireNotePeriod: '',
					resignNotePeriod: '',
					recruitmentWay: '',
					empolyeeType: '',
					// BatchCode: this.$route.query.batch,
				},
				ruleAgent: {
					cardID: [{
						trigger: "blur"
					}],
					name: [{
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
				columns: [{
						type: "selection",
						width: 60,
						align: "center",
						fixed: "left",
					},
					{
						title: "序号",
						type: 'index',
						width: 80,
						align: 'center',
						fixed: 'left',
					},
					{
						title: "姓名",
						key: "name",
						fixed: 'left',
						align: 'center',
						width: 150
					},
					{
						title: "身份证号",
						key: "cardID",
						fixed: 'left',
						align: 'center',
						width: 200

					},
					{
						title: "人事范围",
						key: "personnelArea",
						width: 100,
						align: 'center'
					},
					{
						title: "人事子范围",
						key: "personnelSubArea",
						width: 120,
						align: 'center'
					},
					{
						title: "员工组",
						key: "workerGroup",
						width: 100,
						align: 'center',
						value: "1"
					},
					{
						title: "员工子组",
						key: "workerSubGroup",
						width: 100,
						align: 'center'
					},
					{
						title: "工资范围",
						key: "salaryGroup",
						width: 100,
						align: 'center'
					},
					{
						title: "职位",
						key: "occupation",
						width: 100,
						align: 'center'
					},
					{
						title: "职级编码",
						key: "rankCode",
						width: 100,
						align: 'center',
						value: "03001000"
					},
					{
						title: "招聘渠道",
						key: "recruitmentSource",
						width: 100,
						align: 'center'
					},
					{
						title: "通讯类型",
						key: "communicationType",
						width: 100,
						align: 'center',
						value: "PHO"
					},
					{
						title: "离职日期",
						key: "endDate",
						width: 120,
						align: 'center'
					},
					{
						title: "合同类型",
						key: "contractType",
						width: 100,
						align: 'center'
					},
					{
						title: "试用期时长",
						key: "probation",
						width: 150,
						align: 'center'
					},
					{
						title: "解雇通知期",
						key: "fireNotePeriod",
						width: 150,
						align: 'center'
					},
					{
						title: "辞职通知期",
						key: "resignNotePeriod",
						width: 150,
						align: 'center'
					},
					{
						title: "招聘方式",
						key: "recruitmentWay",
						width: 100,
						align: 'center'
					},
					{
						title: "用工类型",
						key: "empolyeeType",
						width: 100,
						align: 'center'
					},
					{
						title: "操作",
						key: "action",
						fixed: 'right',
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
												// console.log("params:" + JSON.stringify(params))
												this.handleEdit(params);
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
												this.handleDelete(params);
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
				var templateHeadRow = [
					"身份证号码", "姓名", "人事范围", "人事子范围", 
					"员工组", "员工子组", "工资范围",
					"职位", "职级编码", "招聘渠道", "通讯类型", "离职日期", 
					"合同类型", "试用期时长", "解雇通知期", "辞职通知期",
					"招聘方式", "用工类型"
				];
				return objEqual(headRow, templateHeadRow);
			},
			handleReset() {
				this.$refs.searchForm.resetFields();
				this.searchForm.pageNumber = 1;
				this.searchForm.pageSize = 10;
				this.searchForm.cardId = "";
				this.searchForm.name = "";
				this.searchForm.personnelArea = "";
				this.searchForm.recruitmentWay = "";
				this.searchForm.empolyeeType = "";
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
				getUserListData(this.searchForm).then((res) => {
					this.modalExportAll = false;
					const resData = res.data;
					const code = resData.code;
					if (code == 1) {
						this.exportData = resData.data;
						setTimeout(() => {
							this.$refs.exportTable.exportCsv({
								filename: "用户全部数据",
							});
						}, 1000);
					}
				});
			},
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
			handleSubmit() {
				const modal = this.Row;
				this.saveValidate().then(r => {
					if (r) {
						AddInfo(modal).then(res => {
								const resData = res.data;
								const code = resData.code;
								const msg = resData.msg;
								if (code == 1) {
									this.$Message.info("创建成功");
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
				});
			},
			handleDeleteBatch() {
				if (this.selectList.length <= 0) {
				  this.$Message.warning("您还未选择要删除的数据");
				  return;
				}
				this.$Modal.confirm({
				  title: "确认删除",
				  content: "您确认要删除所选的 " + this.selectList.length + " 条数据?",
				  loading: true,
				  onOk: () => {
				    let ids = "";
				    this.selectList.forEach(function (e) {
				      ids += e.id + ",";
				    });
				    ids = ids.substring(0, ids.length - 1);
				    // 批量删除
				    deleteData(ids).then((res) => {
				      this.$Modal.remove();
				      const resData = res.data;
				      var code = resData.code;			  
				      if (code == 1) {
				        this.$Message.success("操作成功");
				        this.clearSelectAll();
				        this.getDataList();
				      }
				    });
				  },
				});
			},
			//批量更新
			handleUpdate(file) {
				getArrayFromFile(file).then(data => {
					var ar = this.vaildFileFormat(data[0]);
					data[0] = [
						"CardID", "Name", "PersonnelArea", "PersonnelSubArea", 
						"WorkerGroup", "WokerSubGroup","SalaryArea", "Occupation",
						"RankCode", "RecruitmentSource", "CommunicationType", 
						"EndDate", "ContractType", "Probation", "FireNotePeriod",
						"ResignNotePeriod", "RecruitmentWay","EmpolyeeType", 
						"ExamResult"
					];
					if (ar) {
						let { tableData } = getTableDataFromArray(data);
						console.log("批量结果：", tableData)
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
			handleEdit(params) {
				this.modalEdit = true;
				this.isAdd = false;
				this.eidtRow = params.row;
			},
			handleSAP() {
				this.$Message.info("开发中...");
			},
			removeUser(row) {
				var id = row.id;
				removeUser(id)
					.then(res => {
						const resData = res.data;
						const code = resData.code;
						const msg = resData.msg;
						if (code == 1) {
							this.$Message.info("删除成功");
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

	.search .drop-down {
		margin-left: 12px;
	}
</style>
