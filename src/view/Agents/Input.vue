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
						<FormItem label="手机号码" prop="phone">
							<Input v-model="searchForm.phone" type="text" clearable placeholder="请输入手机号码" />
						</FormItem>
						<FormItem label="性别" prop="sex">
							<Select v-model="searchForm.sex" placeholder="请选择" clearable style="width: 200px">
								<Option v-for="(item, i) in dictSex" :key="i" :value="item.value">{{ item.title }}</Option>
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
				<Button @click="modalAdd=true" type="primary" icon="md-add">新增</Button>
				<Button @click="handleFileImport" type="primary" icon="md-cloud-upload">导入</Button>
				<Button @click="handleDeleteBatch" type="primary" icon="md-trash">批量删除</Button>
				<Button @click="gotoReadCard" type="primary" icon="md-card">读卡</Button>
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

					<div class="batch">
						<span>
							批次号：{{searchForm.batchCode}} &nbsp;&nbsp;
						</span>
						<span>供应商代码：<a>{{searchForm.agentID}}</a></span>
					</div>
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
		<Modal 
			title="新增记录" 
			v-model="modalAdd" 
			width="800" 
			scrollable 
			@on-ok="handleSubmit('Row')">
			<Form 
				ref="Row" 
				label-position="right" 
				:model="Row" 
				:rules="ruleAgent" 
				:label-width="100">
				<Row>
					<Col span="12">
					<FormItem label="姓名" prop="Name">
						<Input v-model="Row.Name" />
					</FormItem>
					</Col>
					<Col span="12">
					<FormItem label="身份证号" prop="CardID">
						<Input v-model="Row.CardID" />
					</FormItem>
					</Col>
				</Row>
				<Row>
					<Col span="12">
					<FormItem label="性别" prop="Sex">
						<Select v-model="Row.Sex">
							<Option value="男" key="male">男</Option>
							<Option value="女" key="female">女</Option>
						</Select>
					</FormItem>
					</Col>
					<Col span="12">
					<FormItem label="民族" prop="Nation">
						<Input v-model="Row.Nation" />
					</FormItem>
					</Col>
				</Row>
				<Row>
					<Col span="12">
					<FormItem label="出生日期" prop="Birthday">
						<Date-picker v-model="Row.Birthday" />
					</FormItem>
					</Col>
					<Col span="12">
					<FormItem label="家庭住址" prop="HomeAddress">
						<Input v-model="Row.HomeAddress" />
					</FormItem>
					</Col>
				</Row>
				<Row>
					<Col span="12">
					<FormItem label="身份证签发机关" prop="Authority">
						<Input v-model="Row.Authority" />
					</FormItem>
					</Col>
					<Col span="12">
					<FormItem label="身份证开始有效期" prop="ValidDate">
						<Date-picker type="date" v-model="Row.ValidDate" />
					</FormItem>
					</Col>
				</Row>
				<Row>
					<Col span="12">
					<FormItem label="身份证过期时间" prop="ExpirationDate">
						<Date-picker type="date" v-model="Row.ExpirationDate" />
					</FormItem>
					</Col>
					<Col span="12">
					<FormItem label="联系电话" prop="Phone">
						<Input type="number" v-model="Row.Phone" />
					</FormItem>
					</Col>
				</Row>
				<Row>
					<Col span="12">
					<FormItem label="婚姻状态" prop="Marriage">
						<Select v-model="Row.Marriage">
							<Option value="未婚" key="unmarried">未婚</Option>
							<Option value="已婚" key="married">已婚</Option>
						</Select>
					</FormItem>
					</Col>
					<Col span="12">
					<FormItem label="利手" prop="Handedness">
						<Select v-model="Row.Handedness">
							<Option value="右手" key="right">右手</Option>
							<Option value="左手" key="left">左手</Option>
						</Select>
					</FormItem>
					</Col>
				</Row>
				<Row>
					<Col span="12">
					<FormItem label="户籍类型" prop="HouseholdType">
						<Select v-model="Row.HouseholdType">
							<Option value="市内城镇" key="innerTown">市内城镇</Option>
							<Option value="市内农村" key="innerRural">市内农村</Option>
							<Option value="市外城镇" key="outerTown">市外城镇</Option>
							<Option value="市外农村" key="outerRural">市外农村</Option>
						</Select>
					</FormItem>
					</Col>
					<Col span="12">
					<FormItem label="学历" prop="Diploma">
						<Select v-model="Row.Diploma">
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
					<FormItem label="专业" prop="Major">
						<Input v-model="Row.Major" />
					</FormItem>
					</Col>
					<Col span="12">
					<FormItem label="学校名称" prop="School">
						<Input v-model="Row.School" />
					</FormItem>
					</Col>
				</Row>
				<Row>
					<Col span="12">
					<FormItem label="入学日期" prop="EduStart">
						<Date-picker type="date" v-model="Row.EduStart" />
					</FormItem>
					</Col>
					<Col span="12">
					<FormItem label="毕业日期" prop="EduEnd">
						<Date-picker type="date" v-model="Row.EduEnd" />
					</FormItem>
					</Col>
				</Row>
				<Row>
					<Col span="12">
					<FormItem label="家庭联系人" prop="HomeContact">
						<Input v-model="Row.HomeContact" />
					</FormItem>
					</Col>
					<Col span="12">
					<FormItem label="邮编" prop="PostalCode">
						<Input v-model="Row.PostalCode" />
					</FormItem>
					</Col>
				</Row>
				<Row>
					<Col span="12">
					<FormItem label="家庭电话" prop="HomeTel">
						<Input type="number" v-model="Row.HomeTel" />
					</FormItem>
					</Col>
					<Col span="12">
					<FormItem label="政党信息" prop="PoliticalStatus">
						<Select v-model="Row.PoliticalStatus">
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
					<FormItem label="合同到期日期" prop="ContractExpDate">
						<Date-picker type="date" v-model="Row.ContractExpDate" />
					</FormItem>
					</Col>
					<Col span="12">
					<FormItem label="批次号" prop="BatchCode">
						<Input disabled v-model="Row.BatchCode" />
					</FormItem>
					</Col>
				</Row>
			</Form>
		</Modal>
		<Modal 
			title="读取身份证信息" 
			v-model="modalReadCard" 
			width="800" 
			@on-ok="handleSubmit('Row')">
			<Row>
				<Col span="16">
				<Form 
					ref="Row" 
					label-position="right" 
					:model="Row" 
					:rules="ruleAgent" 
					:label-width="100">
					<Row>
						<Col span="12">
						<FormItem label="姓名" prop="Name">
							<Input v-model="Row.Name" />
						</FormItem>
						</Col>
						<Col span="12">
						<FormItem label="身份证号" prop="CardID">
							<Input v-model="Row.CardID" />
						</FormItem>
						</Col>
					</Row>
					<Row>
						<Col span="12">
						<FormItem label="性别" prop="Sex">
							<Select v-model="Row.Sex">
								<Option value="男" key="male">男</Option>
								<Option value="女" key="female">女</Option>
							</Select>
						</FormItem>
						</Col>
						<Col span="12">
						<FormItem label="民族" prop="Nation">
							<Input v-model="Row.Nation" />
						</FormItem>
						</Col>
					</Row>
					<Row>
						<Col span="12">
						<FormItem label="出生日期" prop="Birthday">
							<Date-picker v-model="Row.Birthday" />
						</FormItem>
						</Col>
						<Col span="12">
						<FormItem label="家庭住址" prop="HomeAddress">
							<Input v-model="Row.HomeAddress" />
						</FormItem>
						</Col>
					</Row>
					<Row>
						<Col span="12">
						<FormItem label="签发机关" prop="Authority">
							<Input v-model="Row.Authority" />
						</FormItem>
						</Col>
						<Col span="12">
						<FormItem label="开始有效期" prop="ValidDate">
							<Date-picker type="date" v-model="Row.ValidDate" />
						</FormItem>
						</Col>
					</Row>
					<Row>
						<Col span="12">
						<FormItem label="过期时间" prop="ExpirationDate">
							<Date-picker type="date" v-model="Row.ExpirationDate" />
						</FormItem>
						</Col>
					</Row>
				</Form>
				</Col>
				<Col span="8" style="text-align: center;">
					<img style="width:100px; height: 100px;" src="../../assets/images/icon-social-zhihu.svg">
				</Col>
			</Row>
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
	</div>
</template>
<script>
	import "@/assets/css/util.less";
	import Edit from "./Edit";
	import excel from "@/libs/excel";
	// 模版导入文件表数据
	import { userColumns, userData } from "./importTemplate";
	import {
		add,
		searchCardId,
		getUserListData,
		Import as ImportUser,
		remove,
		deleteBatch as deleteData
	} from "@/api/AgentInputs";
	import {
		getAgentInfosByDeptCode
	} from "@/api/AgentInfos";
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
				exportColumns: [{
						title: "身份证号",
						key: "cardID",
					},
					{
						title: "姓名",
						key: "name",
					},
					{
						title: "性别",
						key: "sex",
					},
					{
						title: "民族",
						key: "nation",
					},
					{
						title: "出生日期",
						key: "birthday",
					},
					{
						title: "家庭地址",
						key: "homeAddress",
					},
					{
						title: "身份证签发机关",
						key: "authority",
					},
					{
						title: "身份证开始有效期",
						key: "validDate",
					},
					{
						title: "身份证过期时间",
						key: "expirationDate",
					},
					{
						title: "联系电话",
						key: "phone",
					},
					{
						title: "婚姻状态",
						key: "marriage",
					},
					{
						title: "利手",
						key: "handedness",
					},
					{
						title: "户籍类型",
						key: "householdType",
					},
					{
						title: "学历",
						key: "diploma",
					},
					{
						title: "专业",
						key: "major",
					},
					{
						title: "入学日期",
						key: "eduStart",
					},
					{
						title: "毕业日期",
						key: "eduEnd",
					},
					{
						title: "学校名称",
						key: "school",
					},
					{
						title: "家庭联系人",
						key: "homeContact",
					},
					{
						title: "邮编",
						key: "postalCode",
					},
					{
						title: "家庭电话",
						key: "homeTel",
					},
					{
						title: "紧急联系人",
						key: "emergentContact",
					},
					{
						title: "紧急联络电话",
						key: "emergentPhone",
					},
					{
						title: "政党信息",
						key: "politicalStatus",
					},
					{
						title: "合同到期日期",
						key: "contractExpDate",
					}
				],
				searchForm: {
					cardId: "",
					name: "",
					phone: "",
					sex: "",
					batchCode: "",
					agentID: "",
					pageNumber: 1,
					pageSize: 10,
					sort: "CreateDate",
					order: "desc"
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
				batchInfo: '',
				reading: false,
				importLoading: false,
				openSearch: true,
				openTip: true,
				loadingExport: true,
				importModalVisible: false,
				modalExportAll: false,
				modalAdd: false,
				modalEdit: false,
				modalReadCard: false,
				drop: false,
				dropDownContent: "展开",
				dictSex: [{
						title: '男',
						value: '男'
					},
					{
						title: '女',
						value: '女',
					},
				],
				selectList: [],
				Row: {
					CardID: '',
					Name: '',
					Sex: '',
					Nation: '',
					Birthday: '',
					HomeAddress: '',
					Authority: '',
					ValidDate: '',
					ExpirationDate: '',
					Phone: '',
					Marriage: '',
					Handedness: '',
					HouseholdType: '',
					Diploma: '',
					Major: '',
					EduStart: '',
					EduEnd: '',
					School: '',
					HomeContact: '',
					PostalCode: '',
					HomeTel: '',
					EmergentContact: '',
					EmergentPhone: '',
					PoliticalStatus: '',
					ContractExpDate: '',
					BatchCode: '',
					AgentID: ''
				},
				ruleAgent: {
					CardID: [{
							required: true,
							message: "身份证号必填",
							// trigger: "blur"
						},
						{
							min: 18,
							message: "填写18位身份证号",
							// trigger: "blur"
						}
					],
					Name: [{
						required: true,
						message: "员工名字必填",
						trigger: "blur"
					}],
					Sex: [{
						required: true,
						message: "性别必填",
						trigger: "blur"
					}],
					Nation: [{
						required: true,
						message: "民族必填",
						trigger: "blur"
					}],
					Birthday: [{
						required: true,
						type: "date",
						message: "生日必填",
						trigger: "blur"
					}],
					HomeAddress: [{
						required: true,

						message: "家庭住址必填",
						trigger: "blur"
					}],
					Authority: [{
						required: true,

						message: "身份证签发机关必填",
						trigger: "blur"
					}],
					ValidDate: [{
						required: true,
						type: "date",
						message: "身份证开始有效期必填",
						trigger: "blur"
					}],
					ExpirationDate: [{
						required: true,
						type: "date",
						message: "身份证过期时间必填",
						trigger: "blur"
					}],
					Phone: [{
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
					Marriage: [{
						required: false,

						trigger: "blur"
					}],
					Handedness: [{
						required: false,

						trigger: "blur"
					}],
					HouseholdType: [{
						required: false,
						trigger: "blur"
					}],
					Diploma: [{
						required: false,
						trigger: "blur"
					}],
					Major: [{
						required: false,
						trigger: "blur"
					}],
					EduStart: [{
						type: "date",
						required: false,
						trigger: "blur"
					}],
					EduEnd: [{
						type: "date",
						required: false,
						trigger: "blur"
					}],
					School: [{
						required: false,
						trigger: "blur"
					}],
					HomeContact: [{
						required: false,
						trigger: "blur"
					}],
					PostalCode: [{
						required: false,
						trigger: "blur"
					}],
					HomeTel: [{
						required: false,
						trigger: "blur"
					}],
					EmergentContact: [{
						required: false,
						trigger: "blur"
					}],
					EmergentPhone: [{
						required: false,
						trigger: "blur"
					}],
					PoliticalStatus: [{
						required: false,
						trigger: "blur"
					}],
					ContractExpDate: [{
						type: "date",
						required: false,
						trigger: "blur"
					}],
					BatchCode: [{
						required: false,
						trigger: "blur",
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
						fixed: 'left',
						align: 'center',
						width: 80,
					},
					{
						title: "姓名",
						key: "name",
						fixed: 'left',
						align: 'center',
						width: 100
					},
					{
						title: "身份证号",
						key: "cardID",
						fixed: 'left',
						align: 'center',
						width: 200

					},
					{
						title: "性别",
						key: "sex",
						align: 'center',
						width: 70
					},
					{
						title: "民族",
						key: "nation",
						align: 'center',
						width: 70
					},
					{
						title: "出生日期",
						key: "birthday",
						align: 'center',
						width: 120,
						render: (h, params) => {
							return h('div', this.formatDate(new Date(params.row.birthday)))
						}
					},
					{
						title: "家庭住址",
						key: "homeAddress",
						align: 'center',
						width: 300
					},
					{
						title: "身份证签发机关",
						key: "authority",
						align: 'center',
						width: 200
					},
					{
						title: "身份证开始有效期",
						key: "validDate",
						align: 'center',
						width: 150,
						render: (h, params) => {
							return h('div', this.formatDate(new Date(params.row.validDate)))
						}
					},
					{
						title: "身份证过期时间",
						key: "expirationDate",
						align: 'center',
						width: 150,
						render: (h, params) => {
							return h('div', this.formatDate(new Date(params.row.expirationDate)))
						}
					},
					{
						title: "联系电话",
						key: "phone",
						align: 'center',
						width: 125
					},
					{
						title: "婚姻状态",
						key: "marriage",
						align: 'center',
						width: 100
					},
					{
						title: "利手",
						key: "handedness",
						align: 'center',
						width: 80
					},
					{
						title: "户籍类型",
						key: "householdType",
						align: 'center',
						width: 100
					},
					{
						title: "学历",
						key: "diploma",
						align: 'center',
						width: 100
					},
					{
						title: "专业",
						key: "major",
						align: 'center',
						width: 120
					},
					{
						title: "入学日期",
						key: "eduStart",
						align: 'center',
						width: 120,
						render: (h, params) => {
							return h('div', this.formatDate(new Date(params.row.eduStart)))
						}
					},
					{
						title: "毕业日期",
						key: "eduEnd",
						align: 'center',
						width: 120,
						render: (h, params) => {
							return h('div', this.formatDate(new Date(params.row.eduEnd)))
						}
					},
					{
						title: "学校名称",
						key: "school",
						align: 'center',
						width: 150
					},
					{
						title: "家庭联系人",
						key: "homeContact",
						align: 'center',
						width: 120
					},
					{
						title: "邮编",
						key: "postalCode",
						align: 'center',
						width: 100
					},
					{
						title: "家庭电话",
						key: "homeTel",
						align: 'center',
						width: 130
					},
					// {
					// 	title: "在苏联系人",
					// 	key: "emergentContact",
					// 	align:'center',
					// 	width: 120
					// },
					// {
					// 	title: "在苏联系人电话",
					// 	key: "emergentPhone",
					// 	align:'center',
					// 	width: 150
					// },
					{
						title: "政党信息",
						key: "politicalStatus",
						align: 'center',
						width: 100
					},
					{
						title: "合同到期日期",
						key: "contractExpDate",
						align: 'center',
						width: 150,
						render: (h, params) => {
							return h('div', this.formatDate(new Date(params.row.contractExpDate)))
						}
					},
					{
						title: "批次",
						key: "batchCode",
						align: 'center',
						width: 130,
					},
					{
						title: "操作",
						key: "action",
						fixed: 'right',
						align: 'center',
						width: 300,
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
			getAgentInfos(deptCode) {
				getAgentInfosByDeptCode(deptCode)
					.then(res => {
						const resData = res.data;
						const data = resData.data;
						const code = resData.code;
						const msg = resData.msg;
						if (code == 1) {
							this.Row.AgentID = data.agentID;
							this.searchForm.agentID = data.agentID;

							//创建批次号
							this.Row.BatchCode = this.Row.AgentID +
								this.getDate(new Date());

							this.searchForm.batchCode = this.Row.AgentID +
								this.getDate(new Date());

							this.init();

						} else {
							this.$Message.error({
								content: msg,
								duration: 10,
								closable: true
							});
						}
					})
					.catch(err => {
						this.$Notice.warning({
							title: '获取中介id失败',
							desc: '获取中介id失败'
						})
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
			getDate(date) {
				const y = date.getFullYear();
				let m = date.getMonth() + 1;
				m = m < 10 ? "0" + m : m;
				let d = date.getDate();
				d = d < 10 ? "0" + d : d;
				return y + "" + m + "" + d;
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
			vaildFileFormat(headRow, type = "add") {
				var templateHeadRow = [
					"身份证号码", "姓名", "性别", "民族", "出生日期",
					"家庭住址", "签发机关", "开始有效期", "截止有效期",
					"联系电话", "婚姻状况", "利手", "户籍性质", "最高学历",
					"专业", "教育开始时间", "教育结束时间", "毕业院校",
					"家庭联系人", "邮编", "家庭电话", "政治面貌", "合同到期日期"
				];

				if (type == 'deleteBatch') {
					templateHeadRow = ["身份证号码"];
				}
				return objEqual(headRow, templateHeadRow);
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
			gotoReadCard() {
				// 记录返回路由
				let query = {
					batchCode: this.searchForm.batchCode,
					agentId: this.searchForm.agentID,
					backRoute: this.$route.name,
				};

				this.$router.push({
					name: 'ReadIdCard',
					query: query
				});
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
				var row = params.row;
				this.$Modal.confirm({
					title: "提示",
					content: "<p>确定要删除[" + row.name + "]?</p>",
					onOk: () => {
						this.remove(row);
					},
					onCancel: row => {}
				});
			},
			//单条新建
			handleSubmit() {
				const agentInputs = this.Row;
				let key = this.Row.CardID;

				searchCardId(key).then(res => {
					const resData = res.data;
					const code = resData.code;
					const msg = resData.msg;
					if (code == 1) {
						this.saveValidate().then(r => {
							if (r) {
								add(agentInputs).then(res => {
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
								}).catch(err => {});
							}
						});
					} else {
						this.$Message.error(msg);
						return;
					}
				})
			},
			//批量删除
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
					filename: "导入用户数据模版",
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
			handleImport(file) {
				getArrayFromFile(file)
					.then(data => {
						var ar = this.vaildFileFormat(data[0]);
						if (ar) {
							data[0] = [
								"CardID", "Name", "Sex", "Nation", "Birthday",
								"HomeAddress", "Authority", "ValidDate",
								"ExpirationDate", "Phone", "Marriage", "Handedness",
								"HouseholdType", "Diploma", "Major", "EduStart",
								"EduEnd", "School", "HomeContact", "PostalCode",
								"HomeTel", "PoliticalStatus", "ContractExpDate"
							];

							let {
								tableData
							} = getTableDataFromArray(data);
							for (let k in tableData) {
								tableData[k].BatchCode = this.searchForm.batchCode;
								tableData[k].AgentID = this.searchForm.agentID;
							}
							ImportUser(tableData).then(res => {
								const resData = res.data;
								const code = resData.code;
								if (code == 1) {
									this.$Message.info("导入成功");
									this.getDataList();
								}
							}).catch(() => {
								this.$Notice.warning({
									title: '信息录入导入失败',
									desc: '存入AgentInputs表失败'
								})
							})
						}
					})
			},
			handleEdit(params) {
				this.modalEdit = true;
				this.isAdd = false;
				this.eidtRow = params.row;
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
			// 计算高度
			this.height = Number(document.documentElement.clientHeight - 230);

			//获取agentId和批次号 
			var deptCode = this.$store.state.user.deptCode;
			this.getAgentInfos(deptCode);
		}
	};
</script>

<style lang="less">
	@import "../../styles/table-common.less";
	
	.operation button {
		margin-right: 8px;
	}

	.search .drop-down {
		margin-left: 12px;
	}

	.batch {
		float: right;
	}

	.ivu-alert.ivu-alert-with-icon {
		padding-right: 15px;
	}
</style>
