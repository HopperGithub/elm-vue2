### 数据来源

项目数据是使用 http-proxy-middleware 反向代理解决跨域问题，抓取官网真实数据进行展示，最大限度靠近官网的功能交互。

### 技术栈
vue2 + vue-rotuer2 + vuex + webpack + ES6/7 + fetch + sass + flex + svg + http-proxy-middleware 

### 目标功能
- [x] 定位功能 -- 完成
- [x] 选择城市 -- 完成
- [x] 搜索地址 -- 完成
- [x] 天气情况 -- 完成
- [x] 附近商家列表 -- 完成
- [x] 搜索商家、商品 -- 完成
- [x] 对商家、商品排序和筛选 -- 完成
- [x] 餐馆食品列表页 -- 完成
- [x] 购物车功能 -- 完成
- [x] 店铺评价页 -- 完成
- [x] 单个食品详情页 -- 完成
- [x] 商家详情页 -- 完成
- [x] 登陆、注册 -- 完成
- [x] 修改密码 -- 完成
- [x] 个人中心 -- 完成
- [x] 发送短信、语音验证 -- 完成
- [x] 下单功能 -- 完成 
- [x] 订单列表 -- 完成
- [ ] 订单详情
- [ ] 帐户信息
- [ ] 上传头像，修改用户名
- [ ] 积分商城
- [ ] 服务中心
- [ ] 添加、删除、修改收货地址
- [ ] 付款(很难实现)


### 项目布局
```
|-- build                            // webpack配置文件
|-- config                           // 项目打包路径
|-- elm                           	 // 上线项目文件，放在服务器即可正常访问
|-- screenshots                      // 项目截图
|-- src                              // 源码目录
|   |-- components                   // 组件
|       |-- common                   // 公共组件
|			|-- buyCart.js           // 购物车组件
|			|-- loading.js           // 页面初始化加载数据的动画组件
|			|-- mixin.js             // 组件混合(包括：指令-下拉加载更多，处理图片地址)
|			|-- ratingStar.js        // 评论的五颗星组件
|			|-- shoplist.js          // msite和shop页面的餐馆列表公共组件
|       |-- footer                   // 底部公共组件
|       |-- header                 	 // 头部公共组件
|   |-- config                       // 基本配置
|       |-- env.js                   // 环境切换配置
|       |-- fetch.js                 // 获取数据
|       |-- mUtils.js                // 常用的js方法
|       |-- rem.js                   // px转换rem
|   |-- images                       // 公共图片
|   |-- pages                        // 页面组件
|       |-- city                     // 当前城市页
|		|-- food                 	 // 食品筛选排序页
|		|-- confirmOrder             // 确认订单页
|		  |--children
|			|--invoice			     //	选择发票页
|			|--remark			     //	订单备注页
|			|--payment			     //	付款页
|			|--userValidation		 //	用户验证页
|			|--chooseAddress         //	选择地址页
|		      |--children
|				|--addAddress        //	添加地址页
|				  |--children
|					|--searchAddress // 搜索地址页
|       |-- find                     // 发现页
|       |-- forget                   // 忘记密码，修改密码页
|       |-- home                     // 首页
|       |-- login                    // 登陆注册页
|       |-- msite                    // 商铺列表页
|       |-- order                    // 订单列表页
|       |-- profile                  // 个人中心
|			|--children
|				|--balance			 // 我的余额
|				|--benefit			 // 我的优惠
|				|--info				 // 帐户信息
|				|--points			 // 我的积分
|				|--service			 // 服务中心
|       |-- search                   // 搜索页
|       |-- shop                     // 商铺筛选页
|			|-- children             
|			  	|-- foodDetail       // 商铺信息页     
|			  	|-- shopDetail       // 单个商铺信息页
|					|-- children             
|				  		|-- shopSafe // 商铺认证信息页     
|       |-- vipcard                  // vip办理页
|
|   |-- plugins                      // 引用的插件
|
|   |-- router                       // 路由配置
|
|   |-- service                      // 数据交互统一调配
|		|-- template                 // 开发阶段的临时数据
|		|-- getData.js               // 获取数据的统一调配文件，对接口进行统一管理
|
|   |-- store                        // vuex的状态管理
|       |-- modules                  // store模块
|       |-- action.js                // 配置actions
|       |-- getters.js               // 配置getters
|       |-- index.js                 // 引用vuex，创建store
|       |-- mutation-types.js        // 定义常量muations名
|       |-- mutations.js             // 配置mutations
|
|   |-- style                        // 各种样式文件
|       |-- common.scss              // 公共样式文件
|       |-- mixin.scss               // 样式配置文件
|
|   |-- App.vue                      // 页面入口文件
|
|   |-- main.js                      // 程序入口文件，加载各种公共组件
|
|-- .babelrc                         // ES6语法编译配置
|-- .editorconfig                    // 代码编写规格
|-- .gitignore                       // 忽略的文件
|-- favicon.ico                      // 页面左上角小图标
|-- index.html                       // 入口html文件
|-- package.json                     // 项目及工具的依赖配置文件
|-- README.md                        // 说明
```



### 项目运行
```
安装依赖
npm install
```

### 编译环境
```

开启本地服务器
npm run dev

访问 http://localhost:8088
```

### 线上版本
```
npm run build

生成的elm文件夹放在服务器即可正常访问
```

##### 如果觉得不错，请丢下你的star吧 ^_^
