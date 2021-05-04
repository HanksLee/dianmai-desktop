(function ($) {
	var withdraw = {
		list: [],
		money: '',
		tipText: null,
		url: null,
		init: function () {
			var domain = document.domain;
			var firstDomain = domain.substring(
				domain.indexOf(".") + 1,
				domain.length
			);
			this.url = firstDomain;
			if (this.url == 'dingmaohongsheng.com') {
				$('.dingmaohongsheng-dl-show').show()
				$('.dingmaohongsheng-dl-hide').remove()
			} else {
				$('.dingmaohongsheng-dl-hide').show()
				$('.dingmaohongsheng-dl-show').remove()
			}
			if (this.url == 'huifengstocks.com' || this.url == 'huachihk.com') {
				$('.channel').text('港币')
			} else {
				$('.channel').text('人民币')
			}
			this.tabClick();
			this.getList();
			this.withdrawSubmit();
			this.getBankInfo();
			this.getBankList();
			this.closeBankList();
			this.getmoney();
			this.historyBanks();
		},
		tabClick: function () {
			$('.c-radio-item').click(function () {
				$(this).addClass('active').siblings().removeClass('active');
				var data_id = $(this).attr('data-id');
				if (data_id == '1') {
					$('.fill-form dl').show();
					$('.fill-form dl.hk-us').hide();
				} else {
					$('.fill-form dl').hide();
					$('.fill-form dl.hk-us').show();
				}
			})
		},
		getList: function () {
			var t = this;
			ajaxPost({
				url: '/v1_home/user/history-out-banks',
				success: function (res) {
					if (res.code == 200) {
						t.list = res.data
					}
				}
			});
		},
		getBankInfo: function () {
			var t = this;
			$('.bank-info').click(function (event) {
				//console.log(t.list);
				var bankListHtml = '',
					bankArr = t.list;
				event.stopPropagation(); // 取消事件冒泡
				if (bankArr.length > 0) {
					$('.bank-list').toggle(300);
					for (var i = 0; i < bankArr.length; i++) {
						//console.log(bankArr[i].bank_card)
						bankListHtml += '<li data-bankUserName="' + bankArr[i].user_name + '" data-bankProvince="' + bankArr[i].bank_province + '" data-bankCity="' + bankArr[i].bank_city + '" data-bankName="' + bankArr[i].bank_name + '" data-branchName="' + bankArr[i].branch_name + '" data-bankCard="' + bankArr[i].bank_card + '">' + bankArr[i].user_name + ' ' + bankArr[i].bank_name + ' ' + bankArr[i].branch_name + ' ' + bankArr[i].bank_card + '</li>';
					}
				} else {
					$('.bank-list').hide();
				}
				$('.content ul').html(bankListHtml);
				return false;
			});
		},
		getBankList: function () {
			$('.bank-list').on('click', 'li', function (e) {
				var $form = $('#withdrawForm');
				$.trim($form.find('input[name="bank_user_name"]').val($(this).attr('data-bankUserName')));
				$.trim($form.find('input[name="bank_province"]').val($(this).attr('data-bankProvince')));
				$.trim($form.find('input[name="bank_city"]').val($(this).attr('data-bankCity')));
				$.trim($form.find('input[name="bank_name"]').val($(this).attr('data-bankName')));
				$.trim($form.find('input[name="bank_branch"]').val($(this).attr('data-branchName')));
				$.trim($form.find('input[name="bank_card"]').val($(this).attr('data-bankCard')));
			});
		},
		closeBankList: function () {
			$('.close').click(function (event) {
				event.stopPropagation();
				$('.bank-list').hide(300);
			});
		},
		withdrawSubmit: function () {
			var t = this;
			$('#withdrawForm .c-submit-btn').click(function () {
				var $submitBtn = $(this),
					$form = $('#withdrawForm'),
					bank_user_name = $.trim($form.find('input[name="bank_user_name"]').val()),
					bank_province = $.trim($form.find('input[name="bank_province"]').val()),
					bank_city = $.trim($form.find('input[name="bank_city"]').val()),
					bank_name = $.trim($form.find('input[name="bank_name"]').val()),
					bank_branch = $.trim($form.find('input[name="bank_branch"]').val()),
					bank_card = $.trim($form.find('input[name="bank_card"]').val()),
					from_money = $.trim($form.find('input[name="from_money"]').val()),
					comment = $.trim($form.find('input[name="comment"]').val());
				if (bank_user_name == '') {
					utils.toast('请输入开户姓名');
				} else if (bank_name == '') {
					var text = $('.bank_name_dt').text();
					utils.toast('请输入' + text);
				} else if (bank_province == '') {
					utils.toast('请输入开户银行省份');
				} else if (bank_city == '') {
					utils.toast('请输入开户银行城市');
				} else if (bank_branch == '') {
					utils.toast('请输入开户支行');
				} else if (bank_card == '') {
					utils.toast('请输入银行卡号');
				} else if (from_money == '') {
					utils.toast('请输入出金金额');
				} else {
					if (Number(from_money) > Number(withdraw.money)) {
						utils.toast('提现金额不能大于余额');
						return
					}
					ajaxPost({
						url: '/v1_home/user/out-money',
						data: {
							//							account_id: account_id,
							bank_user_name: bank_user_name,
							bank_province: bank_province,
							bank_city: bank_city,
							bank_name: bank_name,
							branch_name: bank_branch,
							bank_card: bank_card,
							money: from_money,
							comment: comment
							//							code: code
						},
						success: function (res) {
							if (res.code == 200) {
								utils.toast(res.msg);
								//								setTimeout(function() {
								//									loadPageFn(false, '#capital/statements.html?dt=2', '.page-content', '#container');
								//								}, 1000);
							} else {
								res.msg = res.msg || '申请出金失败';
								utils.toast(res.msg);
							}
						},
						error: function () {
							utils.toast('申请出金失败');
						},
						always: function () {
							$submitBtn.removeClass('loading');
						}
					});
				}
			});
		},
		getmoney: function () {
			var t = this;
			ajaxPost({
				url: '/v1_home/user/user-info',
				success: function (res) {
					if (res.code == '200') {
						t.money = Number(res.data.user_info.can_bring_money);
						$('#withdrawForm input[name="money"]').val(t.money.toFixed(3))
					}
				}
			});
		},
		historyBanks: function () {
			ajaxPost({
				url: '/v1_home/user/history-out-banks',
				success: function (res) {
					if (res.code == '200') {
						this.tipText = res.data.tip
						$('.tip--html-box').html(this.tipText)
					}
				}
			})
		}

	};
	//点击空白处隐藏弹出层，下面为滑动消失效果和淡出消失效果。
	$(document).click(function (event) {
		var _con = $('.bank-list'); // 设置目标区域
		if (!_con.is(event.target) && _con.has(event.target).length === 0) { // Mark 1
			_con.hide(300); //滑动消失
		}
	});
	withdraw.init();
})(jQuery);
