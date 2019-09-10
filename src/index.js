/* eslint-disable no-undef */
import './assets/scss/style.scss'
import Vue from 'vue'
import './plugins/antd'

// ignore tistory tag
Vue.config.ignoredElements = [/^s_/]

const vm = new Vue({
	el: '#app',
	data() {
		return {
			open: window.matchMedia('(min-width: 992px)').matches,
			name: '',
			password: '',
			secret: false,
			comment: '',
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
		addComment(callback) {
			var pattern = /([1-9][0-9]*)/
			var id = callback.match(pattern)[0]
			addComment(this.$refs.addCmtBtn.$el, id)
			return false
		},
	},
})

/**
 * 티스토리 함수
 *
 * @param {*} caller
 * @param {*} entryId
 */
function addComment2(caller, entryId) {
	;(function($) {
		var oForm = findFormObject(caller)
		if (!oForm) {
			return false
		}

		var data = {
			key: 'tistory',
		}

		var $captchaInput = $('#inputCaptcha')
		if ($captchaInput.length > 0) {
			if (!$captchaInput.val()) {
				alert('그림문자를 입력해 주세요.')
				return false
			}

			data.captcha = $captchaInput.val()
		}

		if (oForm['name']) {
			data.name = oForm['name'].value
		}

		if (oForm['password']) {
			var passwd = oForm['password'].value.trim()
			if (passwd.length == 0) {
				alert('비밀번호를 입력해 주세요.')
				return false
			}

			var shaObj = new jsSHA('SHA-256', 'TEXT')
			shaObj.update(md5(encodeURIComponent(passwd)))
			data.password = shaObj.getHash('HEX')
		}

		if (oForm['homepage']) {
			data.homepage = oForm['homepage'].value
		}

		if (oForm['secret'] && oForm['secret'].checked) {
			data.secret = 1
		}

		if (oForm['comment']) {
			data.comment = oForm['comment'].value
		}

		$.ajax({
			url: oForm.action + '?__T__=' + new Date().getTime(),
			method: 'post',
			data: data,
		})
			.done(function(r) {
				if (entryId == 0) {
					window.location = blogURL + '/guestbook'
					return
				}

				var data = r.data
				var $comments = $('#entry' + entryId + 'Comment .commentList'),
					$recentComments = $('#recentComments'),
					$commentCountOnRecentEntries = $('#commentCountOnRecentEntries' + entryId)

				$comments.html(data.commentBlock.split('/form>')[1])
				$recentComments.html(data.recentCommentBlock)
				for (var i = 0; i < data.commentViews.length; i++) {
					$('#commentCount' + entryId + '_' + i).html(data.commentViews[i])
				}
				$commentCountOnRecentEntries.html('(' + data.commentCount + ')')

				if (typeof window.needCommentCaptcha !== 'undefined') {
					captchaPlugin.init('complete')
				}

				// vm.name = ''
				// vm.password = ''
				vm.comment = ''
				vm.secret = false
			})
			.fail(function(r) {
				alert(r.responseJSON.data)
			})
	})(tjQuery)
}

window.addComment = addComment2
