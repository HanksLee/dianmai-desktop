(function ($) {
  var detail = {
    type:'1',
    page_size: 10,
    pagination: {
      load: false,
      pageCount: 0
    },
    init: function () {
      this.tabFn();
      this.getList({
        page_size: this.page_size,
        page_no: 1
      });
      var domain = document.domain;
      var firstDomain = domain.substring(domain.indexOf('.') + 1, domain.length);
      if(firstDomain=='huifengstocks.com'||firstDomain=='huachihk.com'){
        $('.money-detail').text('HK$'+'资金明细')
      }else{
        $('.money-detail').text('￥'+'资金明细')
      }
    },
    tabFn:function(){
      $('.detail-tab li').click(function(){
         $(this).addClass('active').siblings().removeClass('active');
         detail.type = $(this).attr('data-type');
         var data = {
          page_no: 1,
         };
         detail.getList(data)
      })
    },
    getList: function (params) {
      var t = this;
      var page_noa = '1'
      if (params) {
        page_noa = params.page_no
      };
      ajaxPost({
        url: '/v1_home/user/customer-pay-detail',
        data: {
          page_no: page_noa,
          page_size: detail.page_size,
          status: 1,
          type:detail.type
        },
        success: function (res) {
          if (res.code == '200') {
            var list = res.data.page_data || [],
              htmlT, htmlTData = [],
              page_count = res.data.page.page_count;
            if (list.length > 0) {
              for (var i = 0; i < list.length; i++) {
                var classStr = i % 2 == 0 ? 'class="tr-bg"' : '',
                  money = list[i].money ? list[i].money : '',
                  time = list[i].time ? list[i].time : '',
                  desc = list[i].desc ? list[i].desc : '',
                  comment = list[i].comment ? list[i].comment : '',
                  status = list[i].status ? list[i].status : '';
                htmlT = '<tr ' + classStr + ' >' +
                  '<td>' + money + '</td>' +
                  '<td>' + time + '</td>' +
                  '<td>' + desc + '</td>' +
                  '<td>' + status + '</td>' +
                  '</tr>';
                htmlTData.push(htmlT);
              }
              if (htmlTData.length > 0) {
                $('#detail-list tbody').html(htmlTData.join(''));
                if (page_count > 0) {
                  if (!t.pagination.load) {
                    t.createPagination(page_count);
                  } else {
                    if (page_count != t.pagination.pageCount) {
                      t.createPagination(page_count, params.page_no); //页码变化，重新初始整个分页
                    }
                  }
                }
              }
            } else {
              $('#detail-list tbody').html('<tr class="tr-bg"><td colspan="4">暂无数据</td></tr>');
            }
          }
        }
      })
    },
    //添加分页
    createPagination: function (pageCount, pageNo) {
      var t = this,
        data_pagination = $('#detail-list .pagination'),
        pageNo = pageNo || 1;
        data_pagination.pagination({
        pageCount: pageCount,
        current: pageNo,
        jump: true,
        coping: true,
        homePage: '首页',
        endPage: '末页',
        prevContent: '上页',
        nextContent: '下页',
        callback: function (api) {
          var data = {
            page_no: api.getCurrent(),
            page_size: t.page_size
          };
          t.getList(data);
        }
      });
      t.pagination.load = true;
      t.pagination.pageCount = pageCount;
    },
  };
  detail.init()
})(jQuery)
