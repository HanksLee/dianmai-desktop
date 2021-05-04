(function ($) {
	var account = {
		real_wallet: '',
		init: function () {
			this.getList();
			this.getCapital();
			var domain = document.domain;
			var firstDomain = domain.substring(domain.indexOf('.') + 1, domain.length);
			if (firstDomain == 'dingmaohongsheng.com' || firstDomain == 'ftstrategy.net' || firstDomain == 'zhongtaimarkets.com') {
				$('.hide-shares-type').hide()
			} else {
				$('.hide-shares-type').show()
			};
			//花旗和汇丰平台显示为港元
			if (firstDomain == 'huifengstocks.com' || firstDomain == 'huachihk.com') {
				$('.money-hk').text('港元')
			} else {
				$('.money-hk').text('元')
			}
		},
		getList: function () {
			var t = this;
			ajaxPost({
				url: '/v1_home/user/user-money',
				success: function (res) {
					if (res.code == '200') {
						t.real_wallet = res.data.real_wallet;
						$('.balance').text(res.data.real_wallet);
						$('.zichan').text(res.data.zichan);
						$('.yingkui').text(res.data.yingkui);
						$('.frozen_money').text(res.data.frozen_money);
						$('.fengxian').text(Number(res.data.fengxian * 100).toFixed(3));
					}
				}
			});
		},
		getCapital: function () {
			var t = this;
			ajaxPost({
				url: '/v1_home/policy/mylist',
				success: function (res) {
					if (res.code == '200') {
						t.real_wallet = res.data.real_wallet;
						$('.aStock').text(res.data.a_market_value);
						$('.kongStocks').text(res.data.hk_market_value);
						$('.americanStock').text(res.data.us_market_value);
					}
				}
			});
		},
	}
	account.init();
})(jQuery);
