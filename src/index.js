import './assets/scss/style.scss'
import Vue from 'vue'
import { Button, message } from 'ant-design-vue'

// ignore tistory tag
Vue.config.ignoredElements = [/^s_/]

// antd
Vue.use(Button)
Vue.prototype.$message = message

new Vue({
	el: '#app',
})
