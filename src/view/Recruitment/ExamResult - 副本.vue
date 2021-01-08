<template>
	<div class="search">
		<Card>
			<Row>
				<Steps :current="currentStep" style="padding: 20px 50px 20px 50px;">
					<!-- 上左下右 -->
					<Step title="选择入职员工" content="请选择要制作工卡的员工"></Step>
					<Step title="输入起始工牌卡号" content="请输入起始工牌的卡号"></Step>
					<Step title="制作工卡" content="确认信息,导出制卡文本"></Step>
				</Steps>
			</Row>
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
					<spn v-if="drop">
						<FormItem label="体检结果" prop="examResult">
						  <Select
						    v-model="searchForm.examResult"
						    placeholder="请选择"
						    clearable
						    style="width: 200px"
						  >
						    <Option
						      v-for="(item, i) in dictResult"
						      :key="i"
						      :value="item.value"
						      >{{ item.title }}</Option
						    >
						  </Select>
						</FormItem>
					</spn>
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
				<Upload action="" :before-upload="handleDeleteBatch">
					<Button type="primary">
						<i class="iconfont icon-delete" />批量删除</i>
					</Button>
				</Upload>
				<Upload action="" :before-upload="handleUpdate">
					<Button type="primary">
						<i class="iconfont icon-Upload" />批量更新</i>
					</Button>
				</Upload>
				<Button type="success" @click="setResult(true)">合格 </Button>
				<Button type="error" @click="setResult(false)">不合格</Button>
				<Button type="primary" @click="next">下一步</Button>
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
					show-sizer
				></Page>
			</Row>
		</Card>

		

		<Card>
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
							<Icon type="search" />搜索
						</Button>
					</FormItem>
				</Form>
			</div>
			<div class="function-btn">				
				<Upload class="upload-btn" action="" :before-upload="handleDeleteBatch">
					<Button class="batchdelete-btn" type="primary">
						<i class="iconfont icon-delete" />批量删除</i>
					</Button>
				</Upload>
				<Upload class="upload-btn" action="" :before-upload="handleUpdate">
					<Button class="batchupdate-btn" type="primary">
						<i class="iconfont icon-Upload" />批量更新</i>
					</Button>
				</Upload>
				<Button class="success-btn" type="success" @click="setResult(true)">合格 </Button>
				<Button class="error-btn" type="error" @click="setResult(false)">不合格</Button>
				<Button class="next-btn" type="primary" @click="next">下一步</Button>
			</div>
			<Table ref="tables" @on-selection-change="setSelectedData" :data="tableData1" v-bind:columns="tableColumns1" border stripe></Table>
			<div style="margin: 10px; overflow: hidden">
				<div style="float:right;">
					<Page 
					:total="pageTotal" 
					:current="pageCurrent" 
					@on-change="changePage" 
					@on-page-size-change="changePageSize"
					show-total 
					show-elevator
					show-sizer>
					</Page>
				</div>
			</div>

		</Card>
		<Modal 
			v-model="modalInit" 
			title="输入起始卡号" 
			@on-ok="print('formCard')" 
			@on-cancel="cancle">
				<Form 
					ref="formCard" 
					label-position="right" 
					:model="formCard" 
					:label-width="100" 
					inline>
					<FormItem label="起始卡号" prop="startCardID">
						<Input v-model="formCard.startCardID" />
					</FormItem>
				</Form>
		</Modal>
		
		<Modal 
			title="编辑" 
			:mask-closable="false" 
			v-model="modelEdit" 
			width="800" 
			scrollable 
			footer-hide 
			@on-ok="saveEdit"
			><Edit ref="edit" :parent="this" v-bind:edit-row="eidtRow"></Edit>
		</Modal>		
	</div>
</template>
<script>
	import "@/assets/css/util.less";
	import Edit from "./EditExam";
	import {
		getPage,
		remove as removeUser,
		deleteBatch,
		UpdateBatch as UpdateUser
	} from "@/api/HealthExam";
	import {
		remove,
		deleteBatch as deleteBatchAgent
	} from "@/api/AgentInputs";
	import {
		Import as ImportWorkCard,
	} from "@/api/WorkCard";
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
				currentStep: 0,
				nameList: [],
				arr: [],
				tableData1: [],
				queryData: {},
				pageTotal: 0,
				pageCurrent: 1,
				modelEdit: false,
				modelPermission: false,
				eidtRow: {},
				modalInit: false,
				selectedRows:[], //选中的行数
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
				tableColumns1: [{
						type: 'selection',
						width: 100,
						align: 'center',
					},
					{
						title:"序号",
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
						title: "体检结果",
						key: "examResult",
						align: 'center',
						resizable: true,
						width: 150,
						// render: (h, params) => {
						// 	if (params.row.examResult === null) {
						// 		resultStr = '是'
						// 		} else if (params.row.isPaperResult === 0) {
						// 			resultStr = '否'
						// 		}
						// 	return h('RadioGroup', {
						// 			props: {
						// 				value: params.row.examResult //这里的value值对应Radio中的label中的值
						// 			},
						// 			on: {
						// 				"on-change": (val) => {
						// 					params.row.examResult = val;
						// 					console.log(val, "测试radio选中的项", params.row.examResult);
						// 				}
						// 			}
						// 		},
						// 		[
						// 			h('Radio', {
						// 				style: {
						// 					'margin-right': '20px'
						// 				},
						// 				props: {
						// 					"label": "1"
						// 				},
						// 			}, '合格'),
						// 			h('Radio', {
						// 				props: {
						// 					"label": "2"
						// 				},
						// 			}, '待查'),
						// 			h('Radio', {
						// 				props: {
						// 					"label": "3"
						// 				}
						// 			}, '不合格')
						// 		]);
						// }
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
		methods: {
			//记录查询
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
						// this.tableData1 = data.map(item => ({
						// 				CardID: item.CardID,
						// 				Name: item.Name,
						// 				ExamResult: item.ExamResult,
						// 				isPaperResult: item.isPaperResult
						// 			}));
						this.tableData1 = data;
						this.pageTotal = resData.count;
						console.log("resData:", resData)
						this.pageCurrent = resData.PageNum;
					})
					.catch(err => {});
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
				this.setPageData(page);
			},
			changePageSize(pageSize) {
				this.setPageData(1, pageSize);
			},
			//文件头格式校验
			vaildFileFormat(headRow) {
				var templateHeadRow = ["身份证号码","姓名","体检结果"];
				return objEqual(headRow, templateHeadRow);
			},
			setSelectedData(selection , row) {
				this.selectedRows = selection;
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
							remove(id).then(res =>{
								console.log("Agent删除成功")
							});
							this.setPageData();
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
					data[0]=["CardID", "Name", "ExamResult"];
					// console.log("头行匹配结果：" + data)
					if (ar) {
						let {
							columns,
							tableData
						} = getTableDataFromArray(data);
						// console.log("读取数据列："+JSON.stringify(columns))
						console.log("读取数据结果：" + JSON.stringify(tableData))
						deleteBatch(tableData).then(res => {
							const resData = res.data;
							const data = resData.data;
							const code = resData.code;
							const msg = resData.msg;
							if (code == 1) {
								this.$Message.info("批量删除成功");
								let templist=tableData.map(item => ({
										CardID: item.CardID,
										Name: item.Name,
									}));
								deleteBatchAgent(templist).then(res => {
									console.log("Agent表批量删除成功")
								});
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
			//批量更新
			handleUpdate(file) {
				getArrayFromFile(file).then(data => {
					var ar = this.vaildFileFormat(data[0]);
					data[0]=["CardID", "Name", "ExamResult"];
					// console.log("头行匹配结果：" + data)
					if (ar) {
						let {
							columns,
							tableData
						} = getTableDataFromArray(data);
						console.log('tableData',tableData)
						UpdateBatch(tableData).then(res => {
							const resData = res.data;
							const data = resData.data;
							const code = resData.code;
							const msg = resData.msg;
							if (code == 1) {
								this.$Message.info("导入成功");
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
			//更新记录
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
			handleSelectAll(status) {
				this.$refs.selection.selectAll(status);
			},
			//输入起始卡号，自动生成剩余卡号并跳至制卡界面
			print() {
				let start = this.formCard.startCardID;
				console.log(start)
				let that = this;
				const selections = this.$refs.tables.getSelection() //获取所选行数据
				that.$data.nameList = selections.map(item => ({
					name: item.name,
					workCardID: '',
					isStop: 0
				}));
				let len = that.$data.nameList.length;
				//自动生成工牌卡号
				for (let index = 0; index < len; index++) {
					that.$data.nameList[index].workCardID = start;
					start = '00' + (parseInt(start) + 1).toString();
				}
				console.log("namelist:",that.$data.nameList)
				//将卡号和姓名存入WorkIDInfos表中
				ImportWorkCard(that.$data.nameList).then(res => {
					const resData = res.data;
					const data = resData.data;
					const code = resData.code;
					const msg = resData.msg;
					if (code == 1) {
						this.$data.currentStep+=1;
						this.$Message.info("工牌卡号导入成功");
						this.$router.push({
							path: 'WorkCardProduce', query: {currentStep: this.$data.currentStep}
						})
					} else {
						this.$Message.error({
							content: msg,
							duration: 10,
							closable: true
						});
					}
				})
			
			},
			cancle(){
				this.$data.currentStep-=1;
			},			
			next(){
				this.$data.currentStep += 1;
				if(this.$data.currentStep === 1) {
					this.$data.modalInit=true;
				}
			},
			setResult(status) {
				if(this.selectedRows.length == 0) {
					this.$Message.warning("请选择需要操作的行！");
					return false;
				}
				
				var ids = [];
				this.selectedRows.forEach(function(item){
					item.examResult = status == true ?"合格":"不合格";
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
			this.setPageData(1);
		}
	}
</script>

<style lang="less">
	.function-btn {
		height: 30px;
		margin-bottom: 10px;
		.upload-btn {
			padding-left: 10px;
			display: inline-block
		}
		.batchupdate-btn {
			margin-right: 5px;
		}
		.error-btn {
			margin-left: 5px;
		}
		.next-btn {
			margin-right: 5px;
			float:right;
		}
	}	
	
</style>
