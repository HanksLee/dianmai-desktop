(function ($) {
  var spread = {
    spreadList: [],
    init: function () {
      var domain = document.domain;
      var firstDomain = domain.substring(domain.indexOf('.') + 1, domain.length);
      if (firstDomain == 'zggjcenter.com' || firstDomain == 'liangrong-fund.com') {
        $('.celvbishu').text('交易笔数');
        $('.celvshijian').text('交易最后发布时间');
        $('.zuoricelv').text('昨日策略');
        $('.celvzongji').text('策略总计');
      }
      this.getShareFn();
      window._bd_share_config = { "common": { "bdSnsKey": {}, "bdText": "", "bdMini": "2", "bdPic": "", "bdStyle": "0", "bdSize": "16" }, "share": {}, "image": { "viewList": ["qzone", "tsina", "tqq", "renren", "weixin"], "viewText": "分享到：", "viewSize": "16" }, "selectShare": { "bdContainerClass": null, "bdSelectMiniList": ["qzone", "tsina", "tqq", "renren", "weixin"] } }; with (document) 0[(getElementsByTagName('head')[0] || body).appendChild(createElement('script')).src = 'http://bdimg.share.baidu.com/static/api/js/share.js?v=89860593.js?cdnversion=' + ~(-new Date() / 36e5)];
    },
    getShareFn: function () {
      ajaxPost({
        url: '/v1_home/user/invite',
        success: function (res) {
          if (res.code == '200') {
            var list = res.data || {};
            spread.spreadList = list.invite_list || [];
            //console.log(list);
            $('.renshu').text(list.inviter + '人');
            $('.zuoriticheng').text(list.yesterday_profit + '元');
            $('.tichengzongji').text(list.total_profit + '元');
            $('.zuoricel').text(list.yesterday_order + '笔');
            $('.celzongji').text(list.yesterday_order_total + '笔');
            $('.tuiguanglianjie').text(list.invite_url);
            $('.yaoqingmadizi').html('<img src="' + list.invite_code + '">');
            $('.company').text(list.company);
            spread.spreadListFn();
          }
        }
      })
    },
    spreadListFn: function () {
      var dataList = spread.spreadList,
        shtml, shtmlData = [];
      if (dataList.length > 0) {
        for (var i = 0; i < dataList.length; i++) {
          var classStr = i % 2 == 0 ? 'class="tr-bg"' : '',
            real_name = dataList[i].real_name ? dataList[i].real_name : '',
            add_time = dataList[i].add_time ? dataList[i].add_time : '',
            order_num = dataList[i].order_num ? dataList[i].order_num : '',
            order_time = dataList[i].order_time ? dataList[i].order_time : '',
            shtml = '<tr ' + classStr + ' >' +
              '<td>' + real_name + '</td>' +
              '<td>' + add_time + '</td>' +
              '<td>' + order_num + '</td>' +
              '<td>' + order_time + '</td>' +
              '</tr>';
          shtmlData.push(shtml);
        }
        if (shtmlData.length > 0) {
          $('#spread-List tbody').html(shtmlData.join(''));
        }
      } else {
        $('#spread-List tbody').html('<tr class="tr-bg"><td colspan="4">暂无数据</td></tr>');
      }
    }
  };
  spread.init()
})(jQuery)