import './assets/scss/style.scss'
import Vue from 'vue'
import './plugins/antd'

// ignore tistory tag
Vue.config.ignoredElements = [/^s_/]

new Vue({
	el: '#app',
	data() {
		return {
			open: window.innerWidth > 992,
		}
	},
	methods: {
		toggleOpen() {
			this.open = !this.open
		},
		onSearch(value, event) {
			if (value === '') {
				alert('검색어를 입력하세요')
				event.target.focus()
				return
			}
			// eslint-disable-next-line no-undef
			window.location.href = '/search/' + looseURIEncode(value)
		},
	},
})
