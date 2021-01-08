<!-- 
<template>
  <div class="content-main">
   <div class="search-con search-con-top">
      <Form ref="formInline" label-position="right" :label-width="60" inline>
        <FormItem label="工号">
          <Input class="search-input" v-model="queryData.SL_UserId" />
        </FormItem>
        <FormItem label="电话">
          <Input class="search-input" v-model="queryData.SL_PhoneNumber" />
        </FormItem>
        <FormItem>
          <Button class="search-btn" type="primary" @click="setPageData(1)">
            <Icon type="search" />&nbsp;&nbsp;搜索
          </Button>
        </FormItem>
      </Form>
    </div>

    <Card>
      <div>
        <Button class="search-btn" type="success" size="small" style="margin-right: 5px;" @click="handleAdd">
          <Icon type="md-add" />&nbsp;&nbsp;新增
        </Button>
		<Upload style="display: inline-block" action="" :before-upload="handleImport">
		  <Button type="primary" size="small" icon="ios-cloud-upload-outline">导入</Button>
		</Upload>
      </div>
      <Table ref="tables" :data="tableData1" v-bind:columns="tableColumns1" stripe></Table>
      <!-- <tables ref="tables" editable v-model="tableData1" :columns="tableColumns1" @on-delete="handleDelete" stripe />
     <div style="margin: 10px;overflow: hidden">
        <div style="float: right;">
          <Page
            :total="pageTotal"
            :current="pageCurrent"
            @on-change="changePage"
            @on-page-size-change="changePageSize"
            show-total
            show-elevator
            show-sizer
          ></Page>
        </div>
      </div> -->
<!--    </Card>

    <Modal
      title="编辑"
      :mask-closable="false"
      v-model="modelEdit"
      width="800"
      scrollable
      footer-hide
      @on-ok="saveEdit"
    >
      <Edit ref="edit" :parent="this" :edit-row="eidtRow"></Edit>
    </Modal>

  </div>
</template>
<script>
import "@/assets/css/util.less";
import Edit from "./Edit";
import { getPage, Import as ImportUser, remove as removeUser } from "@/api/HRUser";
import { getArrayFromFile, getTableDataFromArray } from '@/libs/util'
import { objEqual } from '@/libs/tools'

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
      modelPermission:false,
      isAdd: true,
      eidtRow: {},
      tableColumns1: [
        {
          title: "编号",
          key: "id",
		  fixed: left
        },
        {
          title: "身份证号",
          key: "idCard"
        },
        {
          title: "姓名",
          key: "name"
        },
		{
			title: "性别",
			key: "sex"
		},
		{
			title: "民族",
			key: "nationality"
		},
		{
			title: "出生日期",
			key: "birth"
		},
		{
			title: "家庭住址",
			key: "homeAddress"
		},
		{
			title: "身份证签发机关",
			key: "issueAuthority"
		},
        {
          title: "身份证开始有效期",
          key: "beginDate"
        },
		{
		  title: "身份证过期时间",
		  key: "expiryDate"
		},
		{
			title: "婚姻状态",
			key: "marriage"
		}, -->
		// {
		// 	title: "学历",
		// 	key: "diploma"
		// },
		// {
		// 	title: "专业",
		// 	key: "majority"
		// },
		// {
		// 	title: "入学日期",
		// 	key: "entanceDate"
		// },
		// {
		// 	title: "毕业日期",
		// 	key: "graduateDate"
		// },
		// {
		// 	title: "学校名称",
		// 	key: "school"
		// },
		// {
		// 	title: "家庭联系人",
		// 	key: "contact"
		// },
		// {
		// 	title: "邮编",
		// 	key: "postCode"
		// },
		// {
		// 	title: "家庭电话",
		// 	key: "homePhone"
		// },
		// {
		// 	title: "在苏姓",
		// 	key: "lastNameSuzhou"
		// },
		// {
		// 	title: "在苏名",
		// 	key: "firstNameSuzhou"
		// },
		// {
		// 	title: "在苏联系人电话",
		// 	key: "contactSuzhou"
		// },
		// {
		// 	title: "户口类型",
		// 	key: "residenceType"
		// },
		// {
		// 	title: "政党信息",
		// 	key: "party"
		// },
		// {
		// 	title: "联系电话",
		// 	key: "phone"
		// },
  //       {
  //         title: "修改时间",
  //         key: "modifyTime"
  //       },
  //       {
  //         title: "操作",
  //         key: "action",
  //         width: 300,
  //         align: "center",
  //         render: (h, params) => {
  //           return h("div", [
  //             h(
  //               "Button",
  //               {
  //                 props: {
  //                   type: "primary",
  //                   size: "small",
  //                   icon: "md-create"
  //                 },
  //                 style: {
  //                   marginRight: "5px"
  //                 },
  //                 on: {
  //                   click: () => {
  //                     this.handleEdit(params);
  //                   }
  //                 }
  //               },
  //               "编辑"
  //             ),
  //             h(
  //               "Button",
  //               {
  //                 props: {
  //                   type: "error",
  //                   size: "small",
  //                   icon: "md-trash"
  //                 },
  //                 on: {
  //                   click: () => {
  //                     this.handleDelete(params);
  //                   }
  //                 }
  //               },
  //               "删除"
  //             )
  //           ]);
  //         }
  //       }
      ]
    };
  },
  computed: {},
 //  methods: {
 //    setPageData(pageNum = this.pageCurrent, pageSize = 10) {
 //      getPage({
 //        pageNum: pageNum,
 //        pageSize: pageSize,
 //        field: "Id",
 //        order: "asc",
 //        query: this.queryData
 //      })
 //        .then(res => {
 //          const resData = res.data;
 //          const code = resData.code;
 //          const msg = resData.msg;
 //          if (code != 1) {
 //            this.$Message.error(code.msg);
 //            return;
 //          }
 //          const data = resData.data;
 //          // this.tableData1 = data;
 //          this.pageTotal = resData.count;
 //          this.pageCurrent = resData.PageNum;
 //        })
 //        .catch(err => {});
 //    },
 //    formatDate(date) {
 //      const y = date.getFullYear();
 //      let m = date.getMonth() + 1;
 //      m = m < 10 ? "0" + m : m;
 //      let d = date.getDate();
 //      d = d < 10 ? "0" + d : d;
 //      return y + "-" + m + "-" + d;
 //    },
 //    changePage(page) {
 //      this.setPageData(page);
 //    },
 //    changePageSize(pageSize) {
 //      this.setPageData(1, pageSize);
 //    },
	// vaildFileFormat(headRow) {		
	// 	// var templateHeadRow = ["UserId","idCard","UserName","sex","nationality","birth","homeAddress","issuAuthority","beginDate","ExpiryDate","marriage","diploma","majority","entranceDate","graduateDate","school","contact","postCode","homePhone","lastNameSu","firstNameSu","contactSu","residenceType","party","PhoneNumber"];
	// 	var templateHeadRow = ["UserId","UserName","ExpiryDate","PhoneNumber"];
	
	// 	return objEqual(headRow,templateHeadRow);
	// },
 //    handleDelete(params) {
 //      var row = params.row;
 //      this.$Modal.confirm({
 //        title: "提示",
 //        content: "<p>确定要删除[" + row.id + "]?</p>",
 //        onOk: () => {
 //          this.removeUser(row);
 //        },
 //        onCancel: row => {}
 //      });
 //    },
 //    handleAdd() {
 //      this.$refs.edit.handleReset();
 //      this.modelEdit = true;
 //      this.isAdd = true;
 //      this.eidtRow = {};
 //    },
	// handleImport(file) {
	//   getArrayFromFile(file).then(data => {
	// 	var ar = this.vaildFileFormat(data[0]);
		
	// 	if (ar) {
	// 		let { columns, tableData } = getTableDataFromArray(data);
	// 		ImportUser(tableData).then(res => {
	// 			const resData = res.data;
	// 			const data = resData.data;
	// 			const code = resData.code;
	// 			const msg = resData.msg;
	// 			if (code == 1) {
	// 			  this.$Message.info("导入成功");
	// 			  this.setPageData(1);
	// 			} else {
	// 			  this.$Message.error({
	// 			    content: msg,
	// 			    duration: 10,
	// 			    closable: true
	// 			  });
	// 			}				
	// 		})
	// 	} else {
	// 		this.$Message.error({
	// 		  content: "导入的文件格式错误",
	// 		  duration: 5,
	// 		  closable: true
	// 		});
	// 	}				
	//   }).catch(() => {
	// 	this.$Notice.warning({
	//         title: '只能上传Csv文件',
	// 	    desc: '只能上传Csv文件，请重新上传'
	// 	  })
	//   })
	// },
 //    handleEdit(params) {
 //      this.modelEdit = true;
 //      this.isAdd = false;
 //      this.eidtRow = params.row;
 //    },
 //    removeUser(row) {
 //      var id = row.id;
 //      removeUser(id)
 //        .then(res => {
 //          const resData = res.data;
 //          const data = resData.data;
 //          const code = resData.code;
 //          const msg = resData.msg;
 //          if (code == 1) {
 //            this.$Message.info("删除成功");
 //            this.setPageData();
 //          } else {
 //            this.$Message.error({ content: msg, duration: 10, closable: true });
 //          }
 //        })
 //        .catch(err => {});
 //    },
 //    saveEdit() {
 //      var row = this.$refs.edit.Row;
 //    }
 //  },
<!--  mounted() {
    // this.setPageData(1);
  }
};
</script> -->

 -->