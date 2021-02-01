<template>
	<div class="class">
		<Card>
			<Row v-show="openSearch" @keydown.enter.native="handleSearch">
				<Form ref="searchForm" :model="searchForm" inline label-position="right" :label-width="70" inline>
					<FormItem label="姓名" prop="name">
						<Input 
							v-model="searchForm.name" 
							type="text"
							clearable
							placeholder="请输入姓名"
						/>
					</FormItem>
					<FormItem label="身份证号" prop="cardId">
						<Input 
							v-model="searchForm.cardId" 
							type="text"
							clearable
							placeholder="请输入身份证号"
						/>
					</FormItem>
					<FormItem>
						<Button @click="handleSearch" type="info" icon="md-search">搜索</Button>
						<Button style="margin-left: 5px;" @click="handleReset">重置</Button>
						<a class="drop-down" @click="dropDown">
						  {{ dropDownContent }}
						  <Icon type="ios-arrow-down"></Icon>
						</a>						
					</FormItem>
				</Form>
			</Row>	
			<Row class="operation">
				<Upload action="" :before-upload="handleUpdate">
					<Button type="primary"><i class="iconfont icon-Upload" />批量更新</Button>
				</Upload>
				<Button type="primary" size="default"  @click="">分配部门
				</Button>
				<Select v-model="selectedInterviewer" placeholder="请选择面试官">
					<Option v-for="item in interviewerList" :value="item.value" :key="item.value">
						{{ item.label }}
					</Option>
				</Select>
				<Button type="success" size="default"  @click="setResult(true)">通过 </Button>
				<Button type="error" size="default"  @click="setResult(false)">失败 </Button>
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
					<Table
						:loading="loading"
						border
						ref="table" 
						:data="data" 
						v-bind:columns="columns" 
						sortable="custom"
						@on-selection-change="showSelect"
					></Table>
					</TabPane>
				</Tabs>	
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
					show-sizer
				></Page>
			</Row>
		</Card>
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
						<Icon type="ios-search" />&nbsp;&nbsp;搜索
					</Button>
					<Button class="reset-btn" style="margin-left: 5px;" @click="reSet">
						<Icon type="search" />&nbsp;&nbsp;重置
					</Button>
				</FormItem>
			</Form>
		</div>
		<div class="function-btn">
			<Upload class="upload-btn" action="" :before-upload="handleUpdate">
				<Button class="batch-btn" type="primary"><i class="iconfont icon-Upload" />批量更新</Button>
			</Upload>
			<Button class="fengpei-btn" type="primary" size="default"  @click="">分配部门
			</Button>
			<Select v-model="selectedInterviewer" style="width:130px;" placeholder="请选择面试官">
				<Option v-for="item in interviewerList" :value="item.value" :key="item.value">
					{{ item.label }}
				</Option>
			</Select>
			<Button class="pass-btn" type="success" size="default"  @click="setResult(true)">通过 </Button>
			<Button class="fail-btn" type="error" size="default"  @click="setResult(false)">失败 </Button>
		</div>
		<Card>
			<Tabs type="card" ref="tabs" @on-click="tabsClick">
				<TabPane v-for="(tab, index) in tabList" :key="index" :label="tab.label" :name="tab.name">
					<Table ref="tables" 
					:data="tableData1" 
					@on-selection-change="setSelectedData" 
					v-bind:columns="tableColumns1" 
					stripe>
					</Table>
				</TabPane>
			</Tabs>
			<div style="margin: 10px;overflow: hidden">
				<div style="float: right;">
					<Page 
					:total="pageTotal" 
					:current="pageCurrent" 
					@on-change="changePage" 
					@on-page-size-change="changePageSize"
					 show-total 
					 show-elevator 
					 show-sizer></Page>
				</div>
			</div>
		</Card>
	</div>
</template>

<script>
	import "@/assets/css/util.less";
	import Edit from "./Edit";
	import {
		getPage,
		UpdateBatch as UpdateUser,
		Import as ImportUser,
		remove as removeUser,
		add as AddBatch
	} from "@/api/Interview";
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
			Edit,
		},
		data() {
			return {
				height:510,
				data: [],
				exportData: [],
				openSearch: true,
				openTip: true,
				loadingExport: true,
				modalExportAll: false,
				drop: false,
				searchForm: {
					cardId:"",
					name:"",
					pageNumber: 1,
					pageSize: 10,
					sort: "CreateDate",
					order: "desc"
				},
				pageTotal: 0,
				pageCurrent: 1,
				currentTabName:'通过', //当前页面名称
				selectedRows:[], //选中的行数
				selectedInterviewer:'', //选择的面试官
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
						width: 200

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
				],
				tabList: [{
						label: "通过",
						name: "通过"
					},
					{
						label: "未通过",
						name: "失败"
					}
				],
				interviewerList:[{
                        value: '大飞',
                        label: '大飞'
                    },
                    {
                        value: '小鹏',
                        label: '小鹏'
                    }]
			}
		},
		methods: {
			setPageData(pageNum = this.pageCurrent, pageSize = 1000, querydata) {
				getPage({
						pageNum: pageNum,
						pageSize: pageSize,
						field: "CardID",
						order: "",
						query: querydata
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
						this.tableData1 = data;
						this.pageTotal = resData.count;
						this.pageCurrent = resData.PageNum;
					})
					.catch(err => {});
			},
			init() {
			  this.getDataList();
			},
			getDataList() {
			  getUserListData(this.searchForm).then((res) => {
				  const resData = res.data;
				  const code = resData.code;
				  const msg = resData.msg;
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
				this.searchForm.pageNumber = page;
				this.getDataList();
				this.clearSelectAll();
			},
			changePageSize(pageSize) {
				this.searchForm.pageSize = pageSize;
				this.getDataList();
			},
			//文件头格式校验
			vaildFileFormat(headRow) {
				var templateHeadRow = ["身份证号码", "姓名", "面试结果", "面试官"];
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
			setSelectedData(selection , row) {
				this.selectedRows = selection;
			},
			tabsClick(name) {
				this.setPageData(this.pageCurrent, 1000, { SL_InterviewResult: name });				
				this.currentTabName = name;				
			},
			handleUpdate() {
				
			},
			handleEdit(params) {
				this.modelEdit = true;
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
					} else {}
				});
			},
			setResult(status) {
				if(this.selectedRows.length == 0) {
					this.$Message.warning("请选择需要操作的行！");
					return false;
				}
				if(this.selectedInterviewer == "") {
					this.$Message.warning("请选择面试官！");
					return false;
				}

				var ids = [];
				var interviewer = this.selectedInterviewer;
				this.selectedRows.forEach(function(item){
					item.interviewResult = status == true ?"通过":"失败";
					item.interviewer = interviewer;
				})

				UpdateUser(this.selectedRows)
					.then(res => {
						const resData = res.data;
						const data = resData.data;
						const code = resData.code;
						const msg = resData.msg;
						if (code == 1) {
							this.$Message.info("更新成功");
							this.setPageData(this.pageCurrent, 1000, { SL_InterviewResult: this.currentTabName });
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
	.operation button {
		margin-right: 8px;
	}
	.search .drop-down {
		margin-left: 5px;
	}	
</style>
