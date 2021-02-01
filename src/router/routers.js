import Main from '@/components/main'
import parentView from '@/components/parent-view'

/**
 * iview-admin中meta除了原生参数外可配置的参数:
 * meta: {
 *  title: { String|Number|Function }
 *         显示在侧边栏、面包屑和标签栏的文字
 *         使用'{{ 多语言字段 }}'形式结合多语言使用，例子看多语言的路由配置;
 *         可以传入一个回调函数，参数是当前路由对象，例子看动态路由和带参路由
 *  hideInBread: (false) 设为true后此级路由将不会出现在面包屑中，示例看QQ群路由配置
 *  hideInMenu: (false) 设为true后在左侧菜单不会显示该页面选项
 *  notCache: (false) 设为true后页面在切换标签后不会缓存，如果需要缓存，无需设置这个字段，而且需要设置页面组件name属性和路由配置的name一致
 *  access: (null) 可访问该页面的权限数组，当前路由设置的权限会影响子路由
 *  icon: (-) 该页面在左侧菜单、面包屑和标签导航处显示的图标，如果是自定义图标，需要在图标名称前加下划线'_'
 *  beforeCloseName: (-) 设置该字段，则在关闭当前tab页时会去'@/router/before-close.js'里寻找该字段名对应的方法，作为关闭前的钩子函数
 * }
 */

export default [{
		path: '/login',
		name: 'login',
		meta: {
			title: 'Login - 登录',
			hideInMenu: true
		},
		component: () => import('@/view/login/login.vue')
	},
	{
		path: '/',
		name: '_home',
		redirect: '/home',
		component: Main,
		meta: {
			hideInMenu: true,
			notCache: true
		},
		children: [{
			path: '/home',
			name: 'home',
			meta: {
				hideInMenu: true,
				title: '首页',
				notCache: true,
				icon: 'md-home'
			},
			component: () => import('@/view/chart/dashboard1/dashboard1.vue')
		}]
	},

	{
		path: '/message',
		name: 'message',
		component: Main,
		meta: {
			hideInBread: false,
			hideInMenu: true
		},
		children: [{
			path: 'message_page',
			name: 'message_page',
			meta: {
				icon: 'md-notifications',
				title: '消息中心'
			},
			component: () => import('@/view/single-page/message/index.vue')
		}]
	},
	{

		path: '/baseSet',
		name: 'baseSet',
		meta: {
			icon: 'logo-buffer',
			access: ["FC001"],
			title: '权限设置'
		},
		component: Main,
		children: [{

				path: 'userManage',
				name: 'userManage',
				meta: {
					icon: 'md-arrow-dropdown-circle',
					notCache: false,
					access: ["FC001001"],
					title: '用户信息'
				},
				component: () => import('@/view/User/List.vue')
			},
			{
				path: 'roleManage',
				name: 'roleManage',
				meta: {
					icon: 'md-trending-up',
					access: ["FC001002"],
					title: '角色信息'
				},
				component: () => import('@/view/Role/List.vue')
			},
			{
				path: 'functionManage',
				name: 'functionManage',
				meta: {
					icon: 'ios-infinite',
					access: ["FC001003"],
					title: '权限信息'
				},
				component: () => import('@/view/Permission/List.vue')
			},
			{
				path: 'companyManage',
				name: 'companyManage',
				meta: {
					icon: 'ios-people',
					access: ["FC001004"],
					title: '组织结构'
				},
				component: () => import('@/view/Dept/List.vue')
			}
		]
	},
	{
		path: '/HRSet',
		name: 'HRSet',
		meta: {
			icon: 'logo-buffer',
			access: ["FC002","FC002006","FC002007"],
			title: '人事信息'
		},
		component: Main,
		children: [{
				path: 'IdCard',
				name: 'IdCard',
				meta: {
					icon: 'md-arrow-dropdown-circle',
					notCache: false,
					access: ["FC002006"],
					title: '身份证过期提醒'
				},
				component: () => import('@/view/HR/List.vue')
			},
			{
				path: 'hrCard',
				name: 'hrCard',
				meta: {
					icon: 'md-trending-up',
					title: '拍照登记'
				},
				component: () => import('@/view/HRCard/List.vue')
			}
		]
	},
	{
		path: '/dormitory',
		name: 'dormitory',
		meta: {
			icon: 'logo-buffer',
			// access: ["FC002","FC002006","FC002007"],
			title: '宿舍管理'
		},
		component: Main,
		children: [{
				path: 'checkIn',
				name: 'checkIn',
				meta: {
					icon: 'md-arrow-dropdown-circle',
					notCache: false,
					// access: ["FC002006"],
					title: '住宿信息'
				},
				component: () => import('@/view/dormitory/checkIn.vue')
			},
			{
				path: 'maintain',
				name: 'maintain',
				meta: {
					icon: 'md-arrow-dropdown-circle',
					notCache: false,
					title: '维修单'
				},
				component: () => import('@/view/dormitory/maintain.vue')
			},
			{
				path: 'detail',
				name: 'detail',
				meta: {
					icon: 'md-arrow-dropdown-circle',
					hideInMenu: true,
					notCache: false,
					title: '维修单详情'
				},
				component: () => import('@/view/dormitory/detail.vue')
			}
		]
	},
	{
		path: '/ALS',
		name: 'ALS',
		meta: {
			icon: 'logo-buffer',
			// access: ["FC002","FC002006","FC002007"],
			title: '后勤管理'
		},
		component: Main,
		children: [{
				path: 'carteen',
				name: 'carteen',
				meta: {
					icon: 'md-arrow-dropdown-circle',
					notCache: false,
					// access: ["FC002006"],
					title: '食堂餐单'
				},
				component: () => import('@/view/carteen/List.vue')
			},
			{
				path: 'bus',
				name: 'bus',
				meta: {
					icon: 'md-arrow-dropdown-circle',
					notCache: false,
					title: '班车线路'
				},
				component: () => import('@/view/busRoute/List.vue')
			},
			// {
			// 	path: 'bus_route',
			// 	name: 'bus_route',
			// 	meta: {
			// 		icon: 'md-arrow-dropdown-circle',
			// 		notCache: false,
			// 		title: '班次上传'
			// 	},
			// 	component: () => import('@/view/busRoute/busRouteImg.vue')
			// }
		]
	},
	{
		path: '/systemset',
		name: 'systemset',
		meta: {
			icon: 'logo-buffer',
			access: ["FC003","FC003001","FC003002"],
			title: '系统设置'
		},
		component: Main,
		children: [
			{
				path: 'dictManage',
				name: 'dictManage',
				meta: {
					icon: 'md-arrow-dropdown-circle',
					notCache: false,
					access: ["FC003001"],
					title: '数据字典管理'
				},
				component: () => import('@/view/dict-manage/dictManage.vue')
			},
			{
				path: 'infoManage',
				name: 'infoManage',
				meta: {
					icon: 'md-arrow-dropdown-circle',
					notCache: false,
					access: ["FC003002"],
					title: '系统配置'
				},
				component: () => import('@/view/setting-manage/setting-manage.vue')
			}
		]
	},
	{
		path: '/recruitmentset',
		name: 'recruitmentset',
		meta: {
			icon: 'logo-buffer',
			access: ["FC004","FC004001","FC004002","FC004003","FC003001","FC003002"],
			title: '入职管理'
		},
		component: Main,
		children: [
			{
				path: 'cardIdInfo',
				name: 'cardIdInfo',
				meta: {
					// icon: 'md-arrow-dropdown-circle',
					notCache: false,
					access: ["FC003001"],
					title: '信息录入'
				},
				component: () => import('@/view/Agents/Input.vue')
			},
			{
				path: 'interview',
				name: 'interview',
				meta: {
					// icon: 'md-arrow-dropdown-circle',
					title: '面试筛选',
					access: ["FC003002"]
				},
				component: () => import('@/view/Agents/interview.vue')
			},
			{
				path: 'healthExam',
				name: 'healthExam',
				meta: {
					// icon: 'md-arrow-dropdown-circle',
					notCache: false,
					access: ["FC004002"],
					title: '体检记录'
				},
				component: () => import('@/view/Recruitment/ExamResult.vue')
			},
			{
				path: 'workCard',
				name: 'workCard',
				meta: {
					// icon: 'md-arrow-dropdown-circle',
					notCache: false,
					access: ["FC004003"],
					title: '制作工卡'
				},
				component: () => import('@/view/Recruitment/WorkCard.vue')
			},
			{
				path: 'RecruitmentInfos',
				name: 'RecruitmentInfos',
				meta: {
					// icon: 'md-arrow-dropdown-circle',
					access: ["FC004001"],
					title: '信息管理'
				},
				component: () => import('@/view/Recruitment/Input.vue')
			},
			{
				path: 'ReadIdCard',
				name: 'ReadIdCard',
				meta: {
					// icon: 'md-arrow-dropdown-circle',
					hideInMenu: true,
					title: '读身份证信息'
				},
				component: () => import('@/view/Agents/ReadIdCard.vue')
			}
		]
	},
	{
		path: '/argu',
		name: 'argu',
		meta: {
			hideInMenu: true
		},
		component: Main,
		children: [{
				path: 'params/:id',
				name: 'params',
				meta: {
					icon: 'md-flower',
					title: route => `{{ params }}-${route.params.id}`,
					notCache: true,
					// beforeCloseNamebeforeCloseName: 'before_close_normal'
				},
				component: () => import('@/view/argu-page/params.vue')
			},
			{
				path: 'query',
				name: 'query',
				meta: {
					icon: 'md-flower',
					title: route => `{{ query }}-${route.query.id}`,
					notCache: true
				},
				component: () => import('@/view/argu-page/query.vue')
			}
		]
	},
	{
		path: '/401',
		name: 'error_401',
		meta: {
			hideInMenu: true
		},
		component: () => import('@/view/error-page/401.vue')
	},
	{
		path: '/500',
		name: 'error_500',
		meta: {
			hideInMenu: true
		},
		component: () => import('@/view/error-page/500.vue')
	},
	{
		path: '*',
		name: 'error_404',
		meta: {
			hideInMenu: true
		},
		component: () => import('@/view/error-page/404.vue')
	}
]
