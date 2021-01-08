<template>
	<div class="content-main">
		<div class="search-con search-con-top">
			<Form ref="formInline" label-position="right" :label-width="100" inline>
				<FormItem label="身份证号">
					<Input class="search-input" v-model="queryData.SL_CardID" />
				</FormItem>
				<FormItem label="姓名">
					<Input class="search-input" v-model="queryData.SL_Name" />
				</FormItem>
				<FormItem>
					<Button class="search-btn" type="info" @click="setPageData(1)">
						<Icon type="md-search" />&nbsp;&nbsp;搜索
					</Button>
					<Button class="reset-btn" style="margin-left: 5px;" @click="reSet">
						<Icon type="search" />&nbsp;&nbsp;重置
					</Button>
					<span style="margin-left: 15px;color: #2D8CF0;">展开<Icon type="ios-arrow-down" /></span>
				</FormItem>
			</Form>
		</div>

		<Card>
			<div>
				<Button class="search-btn" type="primary" style="margin-right: 5px;" @click="modal1=true">
					<Icon type="md-add" />新增
				</Button>
				<Upload style="display: inline-block" action="" :before-upload="handleImport">
					<Button type="primary" style="margin-right: 5px;"><i class="iconfont icon-Upload" />导入</Button>
				</Upload>
				<Upload style="display: inline-block" action="" :before-upload="handleDeleteBatch">
					<Button type="primary" style="margin-right: 5px;"><i class="iconfont icon-delete" />批量删除</Button>
				</Upload>
				<Button class="fun-btn" type="primary" style="margin-right: 5px;" @click="readCardModal=true">
					<Icon type="md-card" />读卡
				</Button>
				<Button class="fun-btn" style="margin-left: 5px;" @click="">
					<Icon type="ios-refresh" />&nbsp;&nbsp;刷新
				</Button>
				<Button class="fun-btn" type="dashed" style="margin-left: 5px;" @click="">
					关闭收搜
				</Button>
				<Button class="fun-btn" type="dashed" style="margin-left: 5px;" @click="">
					关闭提示
				</Button>
				<p style="float: right;">
					<span margin-right: 15px; v-if="Row.BatchCode == null">批次号：未选择批次</span>
					<span v-else>批次号：{{Row.BatchCode}}</span>
					<span v-if="batchInfo == '' || batchInfo == null">批次信息：暂无信息</span>
					<span v-else>批次信息：{{batchInfo}}</span>
				</p>
			</div>
			<div class="tabtip"></div>
			<Table ref="tables" :data="tableData1" v-bind:columns="tableColumns1" stripe></Table>
			<div style="margin: 10px;overflow: hidden">
				<div style="float: right;">
					<Page :total="pageTotal" :current="pageCurrent" @on-change="changePage" @on-page-size-change="changePageSize"
					 show-total show-elevator show-sizer></Page>
				</div>
			</div>
		</Card>

		<Modal title="新增记录" 
			v-model="modal1" 
			width="800"
			scrollable 
			@on-ok="handleSubmit('Row')">
			<Form ref="Row" label-position="right" :model="Row" :rules="ruleAgent" :label-width="100">
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
		
		<Modal title="读取身份证信息" 
			v-model="readCardModal" 
			width="800"
			@on-ok="handleSubmit('Row')">
			<Row>
				<Col span="16">
					<Form ref="Row" label-position="right" :model="Row" :rules="ruleAgent" :label-width="100">
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

		<Modal title="编辑" 
			:mask-closable="false" 
			v-model="modelEdit" 
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
	import Edit from "./Edit";
	import {
		getPage,
		add,
		Import as ImportUser,
		remove,
		deleteBatch
	} from "@/api/AgentInputs";
	import {
		add as AddInfo,
		Import as ImportInfo,
		remove as removeUser,
		deleteBatch as deleteFromFile
	} from "@/api/HRInputs";
	import {
		add as AddBatch,
	} from "@/api/Batches";
	import {
		getPage as getAgent,
	} from "@/api/AgentInfos";
	import {
		getArrayFromFile,
		getTableDataFromArray
	} from '@/libs/util'
	import {
		objEqual
	} from '@/libs/tools'
	import qs from "qs"

	export default {
		name: 'userManage',
		components: {
			Edit
		},
		data() {
			return {
				tableData1: [],
				queryData: {},
				pageTotal: 0,
				pageCurrent: 1,
				modelEdit: false,
				modelPermission: false,
				eidtRow: {},
				batchInfo: '',
				modal1: false,
				readCardModal: false,
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
				},
				ruleAgent: {
					CardID: [{
							required: true,
							message: "身份证号必填",
							// trigger: "blur"
						},
						{
							min: 18,
							message: "填写身份证号",
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
					}, ],
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
				tableColumns1: [
						{
							title:"序号",
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
							width: 100,
						},
						{
							title: "操作",
							key: "action",
							fixed: 'right',
							align: 'center',
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
					setPageData(pageNum = this.pageCurrent, pageSize = 10) {
						getPage({
								pageNum: pageNum,
								pageSize: pageSize,
								field: "CardID",
								order: null,
								query: this.queryData
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
								console.log(data)
								this.tableData1 = data;
								console.log("table1:" + this.tableData1)
								this.pageTotal = resData.count;
								this.pageCurrent = resData.PageNum;
							})
							.catch(err => {});
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
						this.setPageData(page);
					},
					changePageSize(pageSize) {
						this.setPageData(1, pageSize);
					},
					vaildFileFormat(headRow) {
						var templateHeadRow = ["身份证号码", "姓名", "性别", "民族", "出生日期", "家庭住址", "签发机关", "开始有效期", "截止有效期", "联系电话",
							"婚姻状况", "利手", "户籍性质", "最高学历", "专业", "教育开始时间", "教育结束时间", "毕业院校", "家庭联系人",
							"邮编", "家庭电话", "政治面貌", "合同到期日期"
						];
						return objEqual(headRow, templateHeadRow);
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
						const modal = this.Row;
						this.saveValidate().then(r => {
							if (r) {
								add(modal).then(res => {
										console.log(modal)
										const resData = res.data;
										const data = resData.data;
										const code = resData.code;
										const msg = resData.msg;
										if (code == 1) {
											this.$Message.info("创建成功");
											this.setPageData(1);
											const modal1 = {
												CardID: modal.CardID,
												Name: modal.Name
											};

											//将姓名插入HR信息统计表中，建立连接
											AddInfo(modal1).then(res => {
													const resData = res.data;
													const data = resData.data;
													const code = resData.code;
													const msg = resData.msg;
													if (code == 1) {
														// this.$Message.info("HR创建成功");
													} else {
														this.$Message.error({
															content: msg,
															duration: 10,
															closable: true
														});
													}
												})
												.catch(err => {});
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
					//批量删除
					handleDeleteBatch(file) {
						getArrayFromFile(file).then(data => {
							var ar = this.vaildFileFormat(data[0]);
							data[0] = ["CardID", "Name", "Sex", "Nation", "Birthday", "HomeAddress", "Authority", "ValidDate",
								"ExpirationDate", "Phone", "Marriage", "Handedness", "HouseholdType", "Diploma", "Major", "EduStart",
								"EduEnd",
								"School", "HomeContact", "PostalCode", "HomeTel", "PoliticalStatus",
								"ContractExpDate", "BatchCode", "AgentID", "CreateDate", "CreateUser", "ModifyDate", "ModifyUser", "isStop"
							];
							// console.log("头行匹配结果：" + data)
							if (ar) {
								let {
									columns,
									tableData
								} = getTableDataFromArray(data);
								// console.log("读取数据列："+JSON.stringify(columns))
								for (let k in tableData) {
									tableData[k].BatchCode = this.$route.query.batch;
									console.log("k,A[k]:" + k, tableData[k])
								}
								console.log("读取数据结果：" + JSON.stringify(tableData))
								deleteBatch(tableData).then(res => {
									const resData = res.data;
									const data = resData.data;
									const code = resData.code;
									const msg = resData.msg;
									if (code == 1) {
										this.$Message.info("批量删除成功");
										const tableData3 = tableData.map(item => ({
											CardID: item.CardID,
											Name: item.Name,
										}));
										deleteFromFile(tableData3).then(res => {
											const resData = res.data;
											const data = resData.data;
											const code = resData.code;
											const msg = resData.msg;
										})
										this.setPageData(1);
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
					handleImport(file) {
						getArrayFromFile(file)
							.then(data => {
								var ar = this.vaildFileFormat(data[0]);
								if (ar) {
									data[0] = ["CardID", "Name", "Sex", "Nation", "Birthday", "HomeAddress", "Authority", "ValidDate",
										"ExpirationDate", "Phone", "Marriage", "Handedness", "HouseholdType", "Diploma", "Major", "EduStart",
										"EduEnd",
										"School", "HomeContact", "PostalCode", "HomeTel", "PoliticalStatus",
										"ContractExpDate", "BatchCode", "AgentID", "CreateDate", "CreateUser", "ModifyDate", "ModifyUser", "isStop"
									];
									let {
										columns,
										tableData
									} = getTableDataFromArray(data);
									//获取中介ID
									getAgent({
										pageNum: 1,
										pageSize: 10,
										field: "DeptCode",
										order: null,
										query: {
											SL_DeptCode: this.$store.state.user.deptCode
										},
										//getAgent
									}).then(res => {
										const resData = res.data;
										const data = resData.data;
										const code = resData.code;
										const msg = resData.msg;
										if (code == 1) {

											console.log("data:", data[0])

											AddBatch(data[0]).then(res => {
												console.log("批次创建成功")
												//存入AgentInputs表
												ImportUser(tableData, data[0].agentID).then(res => {
													const resData = res.data;
													const data = resData.data;
													const code = resData.code;
													const msg = resData.msg;
													if (code == 1) {
														this.$Message.info("导入成功");
														this.setPageData(1);
														const tableData2 = tableData.map(item => ({
															CardID: item.CardID,
															Name: item.Name,
														}))
														//同步存入HRInputs表
														ImportInfo(tableData2).then(res => {
															const resData = res.data;
															const data = resData.data;
															const code = resData.code;
															const msg = resData.msg;
															if (code == 1) {
																this.$Message.info("HR系统导入成功");
															}
														}).catch(() => { //ImportInfo-then
															this.$Notice.warning({
																title: '存入HRInputs表失败',
																desc: '存入HRInputs表失败'
															})
														}) //ImportInfo-catch
													};
												}).catch(() => { //ImportUser-then
													this.$Notice.warning({
														title: '存入AgentInputs表失败',
														desc: '存入AgentInputs表失败'
													})
												}) //ImportUser-catch
											}).catch(() => { //getAgent-then
												this.$Notice.warning({
													title: '获取中介id失败',
													desc: '获取中介id失败'
												})
											}) //getAgent-catch;

										}

									})
								}
							})
					},
					handleEdit(params) {
						this.modelEdit = true;
						this.isAdd = false;
						this.eidtRow = params.row;
					},
					remove(row) {
						var id = row.cardID;
						remove(id)
							.then(res => {
								const resData = res.data;
								const data = resData.data;
								const code = resData.code;
								const msg = resData.msg;
								if (code == 1) {
									this.$Message.info("删除成功");
									removeUser(id)
										.then(res => {

										})
									this.setPageData(1);
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
							} else {}
						});
					},
				},
				mounted() {
					this.setPageData(1);
				}
		};
</script>

<style lang="less">
	.fun-btn {
		margin-left: 5px;
	}
	.tabtip {
		height: 35px;
		margin: 10px 0px;
		background-color: #F0FAFF;
		border: 1px solid #ABDCFF;
		border-radius: 3px;
	}
</style>
