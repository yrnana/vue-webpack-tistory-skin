/* eslint-disable no-undef */
import './assets/scss/style.scss'
import Vue from 'vue'
import './plugins/antd'

// ignore tistory tag
Vue.config.ignoredElements = [/^s_/]

new Vue({
	el: '#app',
	data() {
		return {
			open: window.matchMedia('(min-width: 992px)').matches,
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
			window.location.href = '/search/' + looseURIEncode(value)
		},
		reloadEntry(callback) {
			var pattern = /([1-9][0-9]*)/
			var id = callback.match(pattern)[0]
			reloadEntry(Number(id))
			return false
		},
	},
})
