
<template>
  <div class="content-main">
	<Drawer title="设置串口" :closable="false" v-model="openSerialPort">
        <Form :label-position="labelPosition" label-width="80px">
            <FormItem  label="端口">
                <Select  v-model="com" :disabled="isOpen" placeholder="请选择">
                    <Option  v-for="port in ports" :label="port.label" :value="port.value"
                               :key="port.value"></Option >
                </Select >
            </FormItem >
            <FormItem  label="波特率">
                <Select  v-model="options.baudRate" :disabled="isOpen" placeholder="请选择">
                    <Option  v-for="baudRate in baudRateList" :label="baudRate.label" :value="baudRate.value"
                               :key="baudRate.value"></Option >
                </Select >
            </FormItem >
            <FormItem  label="校验位">
                <Select  v-model="options.parity" :disabled="isOpen" placeholder="请选择">
                    <Option  v-for="parity in parityList" :label="parity.label" :value="parity.value"
                               :key="parity.value"></Option >
                </Select >
            </FormItem >
            <FormItem  label="数据位">
                <Select  v-model="options.dataBits" :disabled="isOpen" placeholder="请选择">
                    <Option  v-for="dataBit in dataBitList" :label="dataBit.label" :value="dataBit.value"
                               :key="dataBit.value"></Option >
                </Select >
            </FormItem >
            <FormItem  label="停止位">
                <Select  v-model="options.stopBits" :disabled="isOpen" placeholder="请选择">
                    <Option  v-for="stopBit in stopBitList" :label="stopBit.label" :value="stopBit.value"
                               :key="stopBit.value"></Option >
                </Select >
            </FormItem >
        </Form>
    </Drawer>
    <div class="search-con search-con-top">
      <Form ref="formInline" label-position="right" :label-width="60" inline>
        <FormItem label="起始卡号">
          <Input class="search-input" v-model="startCardID" />
        </FormItem>
        <FormItem label="结束卡号">
          <Input class="search-input" v-model="endCardID" />
        </FormItem>
        <FormItem>
          <Button class="search-btn" type="primary" @click="setPageData(1)">
            <Icon type="search" />&nbsp;&nbsp;批量生成卡号
          </Button>
        </FormItem>
		<FormItem>
		  <Button class="search-btn" type="primary" @click="openSerialPort = true">
		    <Icon type="search" />&nbsp;&nbsp;串口设置
		  </Button>
		</FormItem>
      </Form>
    </div>

    <Card>
      <div>
        <Button class="search-btn" type="success" size="small" style="margin-right: 5px;" @click="handleAdd">
          <Icon type="md-add" />&nbsp;&nbsp;单个新增
        </Button>
		<Upload style="display: inline-block" action="">
		  <Button type="primary" size="small" icon="ios-cloud-upload-outline">批次接收</Button>
		</Upload>
      </div>
      <Table ref="tables" :data="tableData1" v-bind:columns="tableColumns1" stripe></Table>
      <!-- <tables ref="tables" editable v-model="tableData1" :columns="tableColumns1" @on-delete="handleDelete" stripe /> -->
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
      </div>
    </Card>

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

	<Modal
	  title="拍照"
	  :mask-closable="false"
	  v-model="modelPhoto"
	  width="800"
	  scrollable
	  footer-hide
	>
	  <Photo ref="Photo" :parent="this" :edit-row="eidtRow"></Photo>
	</Modal>

  </div>
</template>
<script>
import '@/assets/css/util.less'
import Edit from './Edit'
import Photo from './Photo'
import { getPage, remove as removeUser } from '@/api/HRUser'

export default {
  name: 'userManage',
  components: {
    Edit,
    Photo
  },
  data () {
    return {
      tableData1: [],
	  port: null, // 串口实体
	  isOpen: false,  // 串口打开状态
	  state: 0,   // 串口状态 0: 未打开, 1: 打开
	  com: '',    // 串口路径 COM1
	  options: {  // 串口配置信息
	      baudRate: 9600,
	      parity: 'none',
	      dataBits: 8,
	      stopBits: 1,
	      autoOpen: false
	  },	  
	  ports: [],  // 本机串口列表
	  baudRateList: [
	      {
	          label: '300',
	          value: 300
	      },
	      {
	          label: '600',
	          value: 600
	      },
	      {
	          label: '1200',
	          value: 1200
	      },
	      {
	          label: '2400',
	          value: 2400
	      },
	      {
	          label: '4800',
	          value: 4800
	      },
	      {
	          label: '9600',
	          value: 9600
	      },
	      {
	          label: '19200',
	          value: 19200
	      },
	      {
	          label: '38400',
	          value: 38400
	      },
	      {
	          label: '43000',
	          value: 43000
	      },
	      {
	          label: '56000',
	          value: 56000
	      },
	      {
	          label: '57600',
	          value: 57600
	      },
	      {
	          label: '115200',
	          value: 115200
	      },
	      {
	          label: '128000',
	          value: 128000
	      },
	      {
	          label: '230400',
	          value: 230400
	      },
	      {
	          label: '256000',
	          value: 256000
	      },
	      {
	          label: '460800',
	          value: 460800
	      }
	  ],
	  parityList: [
	      {
	          label: 'None',
	          value: 'none'
	      },
	      {
	          label: 'Odd',
	          value: 'odd'
	      },
	      {
	          label: 'Even',
	          value: 'even'
	      },
	      {
	          label: 'Mark',
	          value: 'mark'
	      },
	      {
	          label: 'Space',
	          value: 'space'
	      }
	  ],
	  dataBitList: [
	      {
	          label: '5',
	          value: 5
	      },
	      {
	          label: '6',
	          value: 6
	      },
	      {
	          label: '7',
	          value: 7
	      },
	      {
	          label: '8',
	          value: 8
	      }
	  ],
	  stopBitList: [
	      {
	          label: '1',
	          value: 1
	      },
	      {
	          label: '1.5',
	          value: 1.5
	      },
	      {
	          label: '2',
	          value: 2
	      }
	  ],
	  openSerialPort:false,
	  startCardID:'',
	  endCardID:'',
      queryData: {},
      pageTotal: 0,
      pageCurrent: 1,
      modelEdit: false,
      modelPhoto: false,
      isAdd: true,
      eidtRow: {},
      tableColumns1: [
        {
          title: '编号',
          key: 'id'
        },
        {
          title: '工号',
          key: 'userId'
        },
        {
          title: '姓名',
          key: 'userName'
        },
        {
          title: '电话',
          key: 'phoneNumber'
        },
        {
		  title: '身份证过期时间',
		  key: 'expiryDate'
        },
        {
          title: '修改时间',
          key: 'modifyTime'
        },
        {
          title: '操作',
          key: 'action',
          width: 300,
          align: 'center',
          render: (h, params) => {
            return h('div', [
              h(
                'Button',
                {
                  props: {
                    type: 'primary',
                    size: 'small',
                    icon: 'md-create'
                  },
                  style: {
                    marginRight: '5px'
                  },
                  on: {
                    click: () => {
                      this.handleEdit(params)
                    }
                  }
                },
                '编辑'
              ),
              h(
                'Button',
                {
                  props: {
                    type: 'error',
                    size: 'small',
                    icon: 'md-trash'
                  },
				  style: {
				    marginRight: '5px'
				  },
                  on: {
                    click: () => {
                      this.handleDelete(params)
                    }
                  }
                },
                '删除'
              ),
			  h(
			    'Button',
			    {
			      props: {
			        type: 'warning',
			        size: 'small',
			        icon: 'md-trash'
			      },
			      on: {
			        click: () => {
			          this.handleTakePhoto(params)
			        }
			      }
			    },
			    '拍照'
			  )
            ])
          }
        }
      ]
    }
  },
  computed: {},
  methods: {
    setPageData (pageNum = this.pageCurrent, pageSize = 10) {
      getPage({
        pageNum: pageNum,
        pageSize: pageSize,
        field: 'Id',
        order: 'asc',
        query: this.queryData
      })
        .then(res => {
          const resData = res.data
          const code = resData.code
          const msg = resData.msg
          if (code != 1) {
            this.$Message.error(code.msg)
            return
          }
          const data = resData.data
          this.tableData1 = data
          this.pageTotal = resData.count
          this.pageCurrent = resData.PageNum
        })
        .catch(err => {})
    },
    changePage (page) {
      this.setPageData(page)
    },
    changePageSize (pageSize) {
      this.setPageData(1, pageSize)
    },
    handleDelete (params) {
      var row = params.row
      this.$Modal.confirm({
        title: '提示',
        content: '<p>确定要删除[' + row.id + ']?</p>',
        onOk: () => {
          this.removeUser(row)
        },
        onCancel: row => {}
      })
    },
    handleAdd () {
      this.$refs.edit.handleReset()
      this.modelEdit = true
      this.isAdd = true
      this.eidtRow = {}
    },
    handleEdit (params) {
      this.modelEdit = true
      this.isAdd = false
      this.eidtRow = params.row
    },
    removeUser (row) {
      var id = row.id
      removeUser(id)
        .then(res => {
          const resData = res.data
          const data = resData.data
          const code = resData.code
          const msg = resData.msg
          if (code == 1) {
            this.$Message.info('删除成功')
            this.setPageData()
          } else {
            this.$Message.error({ content: msg, duration: 10, closable: true })
          }
        })
        .catch(err => {})
    },
    handleTakePhoto (params) {
	  this.modelPhoto = true
	  this.isAdd = false
	  this.eidtRow = params.row
    },
    saveEdit () {
      var row = this.$refs.edit.Row
    }
  },
  mounted () {
    this.setPageData(1)
  }
}
</script>
