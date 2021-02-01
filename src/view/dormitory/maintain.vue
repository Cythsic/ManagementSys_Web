<style lang="less">
	@import "../../styles/table-common.less";
</style>
<template>
	<div class="search">
		<Card>
			<Row v-show="openSearch" @keydown.enter.native="handleSearch">
				<Form ref="searchForm" :model="searchForm" inline label-position="right" :label-width="70">
					<FormItem label="报修单号" prop="eventNumber">
						<Input v-model="searchForm.eventNumber" type="text" clearable placeholder="请输入报修单号" />
					</FormItem>
					<FormItem label="房号" prop="roomNum">
						<Input v-model="searchForm.roomNum" type="text" clearable placeholder="请输入站点名称" />
					</FormItem>
					<spn v-if="drop">
						<FormItem label="状态" prop="eventStatus">
							<Select v-model="searchForm.eventStatus" placeholder="请选择" clearable style="width: 200px">
								<Option v-for="(item, i) in dictEventStatus" :key="i" :value="item.value">{{ item.title }}</Option>
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
				<Button @click="exportAll" type="primary" icon="md-download">导出数据</Button>
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
		<Modal
		  :title="modalTitle"
		  v-model="modalVisible"
		  :mask-closable="false"
		  :width="500"
		>
		  <Form ref="form" :model="form" :rules="ruleAgent" :label-width="85">
		    <FormItem label="处理记录" prop="reason">
		      <Input type="textarea" v-model="form.processContent" :rows="4" />
		    </FormItem>
		    <FormItem label="维修人员">
				<dict dict="sex" v-model="form.processID" transfer/>
		    </FormItem>
		  </Form>
		  <div slot="footer">
		    <Button type="text" @click="modalVisible = false">取消</Button>
		    <Button type="primary" :loading="submitLoading" @click="handelFinish"
		      >提交</Button
		    >
		  </div>
		</Modal>
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
	import Edit from "./MaintainEdit.vue";
	import excel from "@/libs/excel";
	import "viewerjs/dist/viewer.css";
	import Viewer from "viewerjs";
	import dict from "@/view/components/dict/dict";
	import { userColumns, userData } from "./checkInTemplate";
	import {
		add,
		edit,
		apply,
		reject,
		getUserListData,
	} from "@/api/maintain";

	export default {
		name: 'maintainManage',
		components: {
			Edit,
			dict
		},
		data() {
			return {
				height: 510,
				showUser: false,
				showType: "0",
				modalTitle:"",
				modalVisible:false,
				form: {},
				data: [],
				exportData: [],
				exportColumns: [
					{
						title: "报修单号",
						key: "eventNumber",
					},
					{
						title: "房号",
						key: "roomNum",
					},
					{
						title: "图片",
						key: "picture",
					},
					{
						title: "创建时间",
						key: "startTime",
					}
				],
				searchForm: {
					eventNumber: "",
					roomNum: "",
					isStop:0,
					pageNumber: 1,
					pageSize: 10,
					sort: "startTime",
					order: "desc"
				},
				importTableData: [],
				importColumns: [],
				uploadfile: {
					name: "",
				},
				tempColumns: userColumns,
				tempData: userData,
				ruleAgent: {
					processContent: [{
						required: true,
						message: "处理记录必填",
						trigger: "blur"
					}],
					processID: [{
						required: true,
						message: "处理的人员必填",
						trigger: "blur"
					}]
				},
				pageTotal: 0,
				loading: false,
				eidtRow: {},
				reading: false,
				importLoading: false,
				openSearch: true,
				openTip: true,
				loadingExport: true,
				submitLoading:false,
				importModalVisible: false,
				modalExportAll: false,
				drop: false,
				dropDownContent: "展开",
				selectList: [],
				dictEventStatus: [{
						title: '已申请',
						value: '0'
					},
					{
						title: '接单中',
						value: '1',
					},
					{
						title: '已撤销',
						value: '2',
					},
					{
						title: '已完成',
						value: '3',
					},
				],
				columns: [{
						type: "selection",
						width: 60,
						align: "center",
					},
					{
						title: "报修单号",
						key: "eventNumber",
						align: 'center',
						width: 130
					},
					{
						title: "房号",
						key: "roomNum",
						width: 120,						
					},
					{
						title: "报障人",
						key: "userName",
						align: 'center',
						width: 120,						
					},
					{
						title: "报障内容",
						key: "record",
						align: 'center',
						width: 200,						
					},
					{
						title: "状态",
						key: "eventStatus",
						align: 'center',
						width: 100,
						render: (h, params) => {							
							let eventStatus = "", 
							color = "";
							if (params.row.eventStatus == 0) {
								eventStatus ="已申请"
								color = "green"
							} else if(params.row.eventStatus == 1) {
								eventStatus ="接单中"
								color = "geekblue";
							} else if(params.row.eventStatus == 2) {
								eventStatus ="已撤销"
								color = "orange";
							} else if(params.row.eventStatus == 3) {
								eventStatus ="已完成"
								color = "blue";
							}
							return h("div", [
							   h(
							     "Tag",
								 {
								   props: {
								     color: color,
								   },
								 },
							     eventStatus
							   ),
							]);
					    }						
					},					
					{
						title: "报修时间",
						key: "startTime",
						align: 'center',
						width: 200					
					},
					{
						title: "操作",
						key: "action",
						align: 'center',
						width: 250,
						render: (h, params) => {
						  let re = "";
						  if (params.row.eventStatus == 0) {
						    re = [
						      h(
						        "a",
						        {
						          on: {
						            click: () => {
						              this.apply(params.row);
						            },
						          },
						        },
						        "接收故障单"
						      ),
							  h("Divider", {
							    props: {
							      type: "vertical",
							    },
							  }),
							  h(
							    "a",
							    {
							      on: {
							        click: () => {
							          this.detail(params.row);
							        },
							      },
							    },
							    "申请详情"
							  ),
						    ];
						  } else if (params.row.eventStatus == 1) {
						    re = [
						      h(
						        "a",
						        {
						          on: {
						            click: () => {
						              this.reject(params.row);
						            },
						          },
						        },
						        "撤回"
						      ),
						      h("Divider", {
						        props: {
						          type: "vertical",
						        },
						      }),
						      h(
						        "a",
						        {
						          on: {
						            click: () => {
						              this.finish(params.row);
						            },
						          },
						        },
						        "关闭"
						      ),
						      h("Divider", {
						        props: {
						          type: "vertical",
						        },
						      }),
						      h(
						        "a",
						        {
						          on: {
						            click: () => {
						              this.detail(params.row);
						            },
						          },
						        },
						        "申请详情"
						      ),
						    ];
						  } else if (params.row.eventStatus == 2) {
						    re = [
						      h(
						        "a",
						        {
						          on: {
						            click: () => {
						              this.apply(params.row);
						            },
						          },
						        },
						        "重新接单"
						      ),
							  h("Divider", {
							    props: {
							      type: "vertical",
							    },
							  }),
							  h(
							    "a",
							    {
							      on: {
							        click: () => {
							          this.process(params.row);
							        },
							      },
							    },
							    "关闭"
							  ),	
						      h("Divider", {
						        props: {
						          type: "vertical",
						        },
						      }),
						      h(
						        "a",
						        {
						          on: {
						            click: () => {
						              this.detail(params.row);
						            },
						          },
						        },
						        "申请详情"
						      ),
						    ];
						  } 
						
						  return h("div", re);
						},
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
			showPic(v) {
			  let image = new Image();
			  image.src = v.imgUrl;
			  let viewer = new Viewer(image, {
			    hidden: function () {
			      viewer.destroy();
			    },
			  });
			  viewer.show();
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
			apply(params) {
				var row = params;
				this.$Modal.confirm({
					title: "提示",
					content: "<p>确定要接单[" + row.eventNumber + "]?</p>",
					onOk: () => {
						this.handleApply(row);
					},
					onCancel: row => {}
				});
			},
			reject(params) {
				var row = params;
				this.$Modal.confirm({
					title: "提示",
					content: "<p>确定要撤单[" + row.eventNumber + "]?</p>",
					onOk: () => {
						this.handleReject(row);
					},
					onCancel: row => {}
				});
			},
			finish(params) {
				this.form = params;
				this.modalVisible = true;
				this.modalTitle ="填写" +params.roomNum+"房号的处理记录";				
			},
			detail(v) {
			  let query = {
			    id: v.id,
			    backRoute: this.$route.name,
			  };
			  this.$router.push({
			    name: "detail",
			    query: query,
			  });
			},
			handelFinish() {
				this.submitLoading = true;
				this.form.eventStatus = 3;
				this.form.isStop = 1;
				const maintain = this.form;	
				this.formValidate().then(r => {
					if (r) {
						this.submitLoading = false;
						edit(maintain).then(res => {
							const resData = res.data;
							const code = resData.code;
							const msg = resData.msg;
							if (code == 1) {
								this.modalVisible = false;
								this.$Message.info("操作成功");
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
			handleApply(row) {
				var id = row.id;
				apply(id)
					.then(res => {
						const resData = res.data;
						const code = resData.code;
						const msg = resData.msg;
						if (code == 1) {
							this.$Message.info("接单成功");
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
			handleReject(row) {
				var id = row.id;
				reject(id)
					.then(res => {
						const resData = res.data;
						const code = resData.code;
						const msg = resData.msg;
						if (code == 1) {
							this.$Message.info("撤单成功");
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
			formValidate(name = "form") {
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
			this.getDataList();
		}
	};
</script>
