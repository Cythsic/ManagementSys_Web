<template>
	<div class="search">
		<Card>
			<div slot="title">
				<div class="edit-head">
					<a @click="close" class="back-title">
						<Icon type="ios-arrow-back" />返回
					</a>
					<div class="head-name">读卡</div>
					<span></span>
					<a @click="close" class="window-close">
						<Icon type="ios-close" size="31" class="ivu-icon-ios-close" />
					</a>
				</div>
			</div>
			<Row>
				<Col span="16">
				<Form ref="Row" label-position="left" class="fontsize" :model="Row" :rules="ruleAgent" :label-width="100">
					<Row :gutter="16">
						<Col span="10">
						<FormItem label="姓名" prop="Name">
							<Input v-model="Row.Name" />
						</FormItem>
						</Col>
						<Col span="10">
						<FormItem label="身份证号" prop="CardID">
							<Input v-model="Row.CardID" />
						</FormItem>
						</Col>
					</Row>
					<Row :gutter="16">
						<Col span="10">
						<FormItem label="性别" prop="Sex">
							<Select v-model="Row.Sex">
								<Option value="男" key="male">男</Option>
								<Option value="女" key="female">女</Option>
							</Select>
						</FormItem>
						</Col>
						<Col span="10">
						<FormItem label="民族" prop="Nation">
							<Input v-model="Row.Nation" />
						</FormItem>
						</Col>
					</Row>
					<Row :gutter="16">
						<Col span="10">
						<FormItem label="出生日期" prop="Birthday">
							<Date-picker v-model="Row.Birthday" />
						</FormItem>
						</Col>
						<Col span="10">
						<FormItem label="家庭住址" prop="HomeAddress">
							<Input v-model="Row.HomeAddress" />
						</FormItem>
						</Col>
					</Row>
					<Row :gutter="16">
						<Col span="10">
						<FormItem label="开始有效期" prop="ValidDate">
							<Date-picker type="date" v-model="Row.ValidDate" />
						</FormItem>
						</Col>
						<Col span="10">
						<FormItem label="过期时间" prop="ExpirationDate">
							<Date-picker type="date" v-model="Row.ExpirationDate" />
						</FormItem>
						</Col>
					</Row>
					<Row :gutter="16">
						<Col span="10">
						<FormItem label="签发机关" prop="Authority">
							<Input v-model="Row.Authority" />
						</FormItem>
						</Col>
					</Row>
				</Form>
				</Col>
				<Col span="8">
				<img style="width:102px; height: 126px;" v-bind:src="PhotoId">
				</Col>
			</Row>
			<Row class="operation">
				<Button @click="handleReset" icon="md-card">清除信息</Button>
				<Button @click="readIDCard" type="primary" icon="md-card">读身份证</Button>
				<Button @click="autoReadIDCard" type="primary" icon="md-card">自动读卡</Button>
				<Button @click="stopAutoReadIDCard" icon="md-card">停止读卡</Button>
				<Checkbox v-model="clearInput">定时清除</Checkbox>
				<InputNumber :max="20" :min="1" v-model="interval"></InputNumber>
				<span style="margin-left: 8px;">秒</span>
			</Row>
			<Row>
				<Alert show-icon>
					<span>{{msg}}</span>
					<div class="batch" v-show="showBatch">
						<span>
							批次号：{{searchForm.batchCode}} &nbsp;&nbsp;
						</span>
						<span>供应商代码：<a>{{searchForm.agentId}}</a></span>
					</div>
				</Alert>
			</Row>
			<Row>
				<Table border ref="table" :data="data" v-bind:columns="columns" sortable="custom" @on-selection-change="showSelect"></Table>
				<Table :columns="exportColumns" :data="exportData" ref="exportTable" style="display: none"></Table>
			</Row>
			<Row type="flex" justify="end" class="page">
				<Page :total="pageTotal" :current="searchForm.pageNumber" :page-size="searchForm.pageSize" @on-change="changePage"
				 @on-page-size-change="changePageSize" show-total show-elevator show-sizer></Page>
			</Row>
		</Card>
	</div>
</template>

<script>
	import "@/assets/css/util.less";
	import "../../styles/single-common.less";
	import {
		mapMutations
	} from 'vuex'
	import {
		add,
		searchCardId,
		getUserListData
	} from "@/api/AgentInputs";

	export default {
		name: 'readIdCard',
		data() {
			return {
				socket: null,
				host: "ws://127.0.0.1:33666",
				msg: "",
				PhotoId: "",
				PhotoIDFront: "",
				PhotoIDBack: "",
				backRoute: "",
				showBatch: false,
				height: 510,
				interval: 3,
				clearInput: true,
				data: [],
				eidtRow: {},
				exportData: [],
				searchForm: {
					pageNumber: 1,
					pageSize: 10,
					batchCode: '',
					agentId: '',
					sort: "CreateDate",
					order: "desc"
				},
				pageTotal: 0,
				modalEdit: false,
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
					}
				],
				Row: {
					CardID: '',
					Name: '',
					Sex: '',
					Nation: '',
					Birthday: '',
					HomeAddress: '',
					Authority: '',
					ValidDate: '',
					ExpirationDate: ''
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
					}]
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
						title: "批次",
						key: "batchCode",
						align: 'center',
						width: 130,
					}
				]
			};
		},
		computed: {},
		created: function() {
			// 默认页面打开，就自动打开设备
			this.openReader();
		},
		methods: {
			...mapMutations([
				'closeTag'
			]),
			init() {
				this.handleReset();
				this.backRoute = this.$route.query.backRoute;
				this.Row.BatchCode = this.$route.query.batchCode;
				this.Row.AgentId = this.$route.query.agentId;
				this.searchForm.batchCode = this.$route.query.batchCode;
				this.searchForm.agentId = this.$route.query.agentId;
			},
			//提示信息
			resultMsg(msg) {
				if (msg != "" && msg != undefined) this.msg = msg;
			},
			//打开socket连接
			openReader() {
				var host = "ws://127.0.0.1:33666"; //客户端电脑本地IP，非服务器IP，无需修改
				if (this.socket == null) {
					this.socket = new WebSocket(host);
				} else {
					this.resultMsg("已初始化.");
				}
				try {
					var _this = this;
					this.socket.onopen = function() {

						_this.resultMsg("初始化成功."); //可以注释
						_this.$options.methods.getVersion(); //可以注释：控件版本号
						_this.$options.methods.readSAMID(); //可以注释：读卡器芯片号，全球唯一，通常可用来授权管理
						//autoReadIDCard(); //自动读卡可以放这里，自动读卡放身份证的间隔要>300ms，否则会不读卡
					};
					this.socket.onclose = function() {
						_this.resultMsg("读卡服务已经断开.");
					};
					this.socket.onerror = function() {
						_this.resultMsg("请检查控件是否正常安装.");
					};
					this.socket.onmessage = function(msg) {
						if (typeof msg.data == "string") {
							var msgM = msg.data + "";
							var msgJson = JSON.parse(msgM);
							switch (msgJson.fun) {
								case "EST_GetVersion#": // 获取版本号
									_this.resultMsg("版本号：" + msgJson.errMsg);
									break;
								case "EST_Reader_ReadIDCard#": //单词 -> 读卡
									if (msgJson.rCode == "0") {
										_this.Row.Name = msgJson.name; //姓名  
										_this.Row.Sex = msgJson.sex; //性别             
										_this.Row.Nation = msgJson.nation; //民族                      
										_this.Row.Birthday = msgJson.birth; //出生日期                  
										_this.Row.HomeAddress = msgJson.address; //住址  
										_this.Row.CardID = msgJson.certNo; //身份证号码      
										_this.Row.Authority = msgJson.department; //签发机关    
										_this.Row.ValidDate = msgJson.effectData; //有效期开始
										_this.Row.ExpirationDate = msgJson.expire; //有效期结束
										//身份证头像，base64格式数据，实际尺寸：102x126px
										_this.PhotoId = "data:image/jpeg;base64," + msgJson.base64Data;
										//身份证正面照片，实际尺寸：540x340px，如无需使用，建议注释掉
										_this.PhotoIDFront = "data:image/jpeg;base64," + msgJson.imageFront;
										//身份证反面照片，实际尺寸：540x340px，如无需使用，建议注释掉
										_this.PhotoIDBack = "data:image/jpeg;base64," + msgJson.imageBack;
										_this.handleSubmit();
										setTimeout(() => {
											_this.$refs['Row'].resetFields();
											_this.PhotoId = "";
										}, _this.interval * 1000);
									} else if (msgJson.rCode == "1") {
										_this.resultMsg("已停止自动读卡");
									} else if (msgJson.rCode == "-2") {
										_this.resultMsg("请放身份证");
									} else {
										_this.resultMsg(msgJson.errMsg);
									}
									break;

								case "EST_GetCertFrontImage#": //身份证正面照片，base64格式数据
									if (msgJson.rCode == "0") {
										_this.PhotoIDFront = "data:image/jpeg;base64," + msgJson.imageFront;
									}
									break;
								case "EST_GetCertBackImage#": //身份证反面照片，base64格式数据
									if (msgJson.rCode == "0") {
										_this.PhotoIDBack = "data:image/jpeg;base64," + msgJson.imageBack;
									}
									break;
								case "EST_ReadCertID#": //身份证物理ID
									if (msgJson.rCode == "0") {
										_this.text_ID = msgJson.UID;
									} else {
										_this.resultMsg(msgJson.errMsg);
									}
									break;
								case "EST_IDRequest#":
									if (msgJson.rCode == "0") {
										_this.resultMsg("找到身份证");
									} else {
										_this.resultMsg(msgJson.errMsg);
									}
									break;
								case "EST_FindCardM1#":
									if (msgJson.rCode == "0") {
										_this.resultMsg("寻卡成功，M1卡UID：" + msgJson.Uid);
									} else {
										_this.resultMsg(msgJson.errMsg);
									}
									break;
								case "EST_VerifyKeyM1#":
									if (msgJson.rCode == "0") {
										_this.resultMsg("秘钥认证成功");
									} else {
										_this.resultMsg(msgJson.errMsg);
									}
									break;
								case "EST_ReadCardM1#":
									if (msgJson.rCode == "0") {
										_this.resultMsg("读卡成功，数据为：" + msgJson.readData);
									} else {
										_this.resultMsg(msgJson.errMsg);
									}
									break;
								case "EST_WriteCardM1#":
									if (msgJson.rCode == "0") {
										_this.resultMsg("写卡成功");
									} else {
										_this.resultMsg(msgJson.errMsg);
									}
									break;
								case "EST_PowerOnCpu#": //非接CPU卡上电信息
									if (msgJson.rCode == "0") {
										_this.resultMsg("复位信息：" + msgJson.ATR);
									} else {
										_this.resultMsg(msgJson.errMsg);
									}
									break;
								case "EST_WriteCpu#": //非接CPU卡APDU指令响应信息
									if (msgJson.rCode == "0") {
										_this.resultMsg("响应数据：" + msgJson.Resp);
									} else {
										_this.resultMsg(msgJson.errMsg);
									}
									break;
								case "EST_ReaderGertSAMID#": //获得读卡器芯片系列号，读卡器授权可以放这里来判断
									if (msgJson.rCode == "0") {
										_this.resultMsg("系列号：" + msgJson.SAMID);
									} else {
										_this.resultMsg(msgJson.errMsg);
									}
									break;
								default:
									break;
							}
						} else {
							alert("连接异常,请检查是否成功安装控件.");
						}
					};
				} catch (ex) {
					alert("连接异常,请检查是否成功安装控件.");
				}
			},
			//控件版本号
			getVersion() {
				this.socket.send("EST_GetVersion#");
			},
			//蜂鸣器控制，可以自己选择是否蜂鸣
			posBeep() {
				if (this.socket.readyState == 1) {
					this.socket.send("EST_PosBeep#");
				} else {
					this.resultMsg("未找到控件，请检查控件是否安装.");
				}
			},
			//单次读取身份证信息
			readIDCard() {
				try {
					if (this.socket.readyState == 1) {
						this.socket.send("EST_Reader_ReadIDCard#");
					} else {
						this.resultMsg("未找到控件，请检查控件是否安装.");
					}
				} catch (ex) {
					this.resultMsg("连接异常,请检查是否成功安装控件.");
				}
			},
			//自动读取身份证信息
			autoReadIDCard() {
				try {
					if (this.socket.readyState == 1) {
						this.socket.send("EST_Reader_ReadIDCard#|1");
						this.resultMsg("自动读卡，请放身份证...");
					} else {
						this.resultMsg("未找到控件，请检查控件是否安装.");
					}
				} catch (ex) {
					this.resultMsg("连接异常,请检查是否成功安装控件.");
				}
			},
			//停止连续读取身份证信息
			stopAutoReadIDCard() {
				try {
					if (this.socket.readyState == 1) {
						this.socket.send("EST_StopReadIDCard#");
					} else {
						this.resultMsg("未找到控件，请检查控件是否安装.");
					}
				} catch (ex) {
					this.resultMsg("连接异常,请检查是否成功安装控件.");
				}
			},
			//读取身份证正反面照片
			readIDCardImage() {
				try {
					if (this.socket.readyState == 1) {
						this.socket.send("EST_GetCertFrontImage#");
						this.socket.send("EST_GetCertBackImage#");
					} else {
						this.resultMsg("未找到控件，请检查控件是否安装.");
					}
				} catch (ex) {
					this.resultMsg("连接异常,请检查是否成功安装控件.");
				}
			},
			//读取身份证物理ID，16位16进制数据，一般情况用不到，可以注释掉
			ReadCertID() {
				try {
					if (this.socket.readyState == 1) {
						this.socket.send("EST_ReadCertID#");
					} else {
						this.resultMsg("未找到控件，请检查控件是否安装.");
					}
				} catch (ex) {
					this.resultMsg("连接异常,请检查是否成功安装控件.");
				}
			},
			//关闭soket
			closeSocket() {
				try {
					if (this.socket != undefined) {
						this.socket.close();
						this.socket = undefined;
					}
				} catch (ex) {}
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
				this.$refs['Row'].resetFields();
				this.PhotoId = "";
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
			close() {
				let {
					name,
					params,
					query
				} = {};
				name = this.$route.name;
				params = this.$route.params;
				query = this.$route.query;
				this.closeTag({
					name,
					params,
					query
				});
				this.$router.push({
					name: this.backRoute
				});
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
								filename: "身份信息全部数据",
							});
						}, 1000);
					}
				});
			},
			saveValidate(name = "Row") {
				return this.$refs[name].validate(valid => {
					if (!valid) {
						this.$Message.warning("请检查表单数据！");
						return false;
					}
				});
			}
		},
		mounted() {
			// 计算高度		
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

	.batch {
		float: right;
	}

	.ivu-alert.ivu-alert-with-icon {
		padding-right: 15px;
	}
</style>
