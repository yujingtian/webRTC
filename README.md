# wap_vue

> A Vue.js project
> UI 组件 vux(https://doc.vux.li/zh-CN/components/actionsheet.html)

添加新的路由 需要在文件 webpack.prod.conf.js 文件中添加预渲染的路由信息
[ '/','/404','你的新增路由']

#### 命名约定：

- 文件夹命名： 一律小写(例如 a*b 下划线*)
- Vue 文件命名： 大驼峰式命名法，即每个单词的首字母大写 CamelCase.vue
- css,js,image 等文件命名：一律小写(只允许小写字母,csss、js 中横杠、image 下划线)第三方除外
- 如条件允许： import 进来的变量名及 export 都采用大驼峰形式命名，如 import VueRouter from 'vue-router' 及 export default Common
- 如条件允许： var，let，const 命名的变量及方法名尽量采用小驼峰形式命名， 如 countDown

```
什么叫“如条件允许”：比如我们需要
import routes from './routers/router'
const router = new VueRouter({
routes
})这种情况下，routes可以用小写，事实上，上面的范例可以换一种写法：
import Routes from './routers/router'
const router = new VueRouter({
routes: Routes
})
```

## Build Setup

```bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report
```

For a detailed explanation on how things work, check out the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).

## Package to Test

```code
# test url 27环境
http://10.10.13.119:2000/#/

# test url 77环境
http://10.10.13.119:2001/#/

# package code
npm run build
scp -r 22 wap/* root@10.10.13.119:/home/nginxweb/wap-vue/wap(Zajk6688)

# nginx路径
/etc/nginx/conf.d/3333.conf

# nginx命令
nginx (启动)
nginx -s reload (重启)
```

##新增 rem 转化
在页面中直接使用 UI 稿/2 px，wabpack 会自动转化为 rem，低于 12px 不会被转化，如下所示：

````css
	p {
		width: 375px;
		border-bottom: 1px solid #ddd;
		border-radius: 5px;
	}
	```
自动编译后为：
```css
	p {
		width: 5rem;
		border-bottom: 1px solid #ddd;
		border-radius: 5px;
	}
	```
但是有些我们不需要转化为rem，直接PX即可
```css
	p {
		width: 750PX;
		border-bottom: 1px solid #ddd;
		border-radius: 5px;
	}
	```
自动编译后为：
```css
	p {
		width: 750PX;
		border-bottom: 1px solid #ddd;
		border-radius: 5px;
	}
	```

##页面地址
好车推荐 `/recommend`
APP下载 `/download`
````
