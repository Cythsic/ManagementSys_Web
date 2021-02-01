<style lang="less">
</style>
<template>
	<div class="search">
		<Card>
			<p slot="title">
				<span>查看报修申请详情</span>
			</p>
			<Row>
				<Form 
					ref="form" 
					:model="form" 
					:label-width="100" 
					style="position: relative">
					<FormItem label="报修申请人" prop="userName">
						{{ form.userName }}
					</FormItem>
					<FormItem label="房号" prop="roomNum">
						<Input v-model="form.roomNum" style="width: 550px" />
					</FormItem>
					<FormItem label="报障内容" prop="record">
						<Input type="textarea" v-model="form.record" :rows="5" placeholder="请输入详细情况" style="width: 550px" />
					</FormItem>
					<FormItem label="图片" prop="picture">
						<img :src="url" @click="showPic" style="width: 150px;height: 150px;">
					</FormItem>
					<FormItem label="申请时间">
						<DatePicker 
							v-model="form.startTime" 
							type="date" 
							format="yyyy-MM-dd HH:mm" 
							clearable 
							placeholder="选择起始时间" 
							style="width: 550px">
						</DatePicker>
					</FormItem>
					<!-- <FormItem label="申请已过时长">{{ duration }} 小时</FormItem> -->
					<FormItem class="br">
						<Button @click="handelCancel">关闭</Button>
					</FormItem>
					<Spin size="large" fix v-if="loading"></Spin>
				</Form>
			</Row>
		</Card>
	</div>
</template>

<script>
	import {
		getMaintainData
	} from "@/api/maintain";
	import {
		mapMutations
	} from 'vuex'
	import "viewerjs/dist/viewer.css";
	import Viewer from "viewerjs";

	export default {
		name: "detail",
		components: {},
		data() {
			return {
				loading: false,
				url:"",
				duration: "1",
				modalVisible: false,
				form: {},
				submitLoading: false,
				backRoute: "",
			};
		},
		methods: {
			...mapMutations([
				'closeTag'
			]),
			init() {
				this.backRoute = this.$route.query.backRoute;
				this.form.id = this.$route.query.id;
			},
			getData() {
				this.loading = true;
				getMaintainData(this.form.id).then((res) => {
					this.loading = false;
					const resData = res.data;
					const code = resData.code;
					if (code == 1) {
						let v = resData.data;
						for (let attr in v) {
							if (v[attr] == null) {
								v[attr] = "";
							}
						}
						let str = JSON.stringify(v);
						let data = JSON.parse(str);
						this.form = data;
						this.url ="http://" + data.picture;
					}
				});
			},
			showPic(v) {
			  let image = new Image();
			  image.src = v.currentTarget.src;
			  let viewer = new Viewer(image, {
			    hidden: function () {
			      viewer.destroy();
			    },
			  });
			  viewer.show();
			},
			handelCancel() {
				this.closeCurrentPage();
			},
			// 关闭当前页面
			closeCurrentPage() {
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
		},
		mounted() {
			this.init();
			this.getData();
		},
		watch: {
			// 监听路由变化
			$route(to, from) {
				if (to.name == "detail") {
					this.backRoute = this.$route.query.backRoute;
					this.$refs.form.resetFields();
				}
			},
		},
	};
</script>
