(function ($) {
  var stockList = {
    page_size: 20,
    order_by: 'desc',
    ft: true,
    pagination: {
      load: false,
      pageCount: 0
    },
    init: function () {
      this.clickzdf();
      this.getstockList();
    },
    clickzdf: function () {
      $('.zdf').click(function () {
        stockList.ft = stockList.ft ? false : true;
        stockList.order_by = stockList.ft ? 'desc' : 'asc';
        stockList.getstockList();
      })
    },
    getstockList: function (params) {
      var page_noa = '1'
      if (params) {
        page_noa = params.page_no
      };
      ajaxPost({
        url: '/v1_home/stock/hsproduct',
        data: {
          order_by: stockList.order_by,
          page_no: page_noa,
          page_size: stockList.page_size
        },
        success: function (res) {
          if (res.code == '200') {
            var list = res.data.page_data || [],
              stockListHtml, stockListHtmlData = [],
              page_count = res.data.page.page_count;
            if (list.length > 0) {
              for (var i = 0; i < list.length; i++) {
                var classStr = i % 2 == 0 ? 'class="tr-bg"' : '',
                  stock_code = list[i].stock_code ? list[i].stock_code : '',
                  stock_name = list[i].stock_name ? list[i].stock_name : '',
                  now_price = list[i].now_price ? list[i].now_price : '',
                  dif_rate = list[i].dif_rate ? list[i].dif_rate : '';
                trans_volume = list[i].trans_volume ? list[i].trans_volume : '';
                trans_amount = list[i].trans_amount ? list[i].trans_amount : '';
                high_price = list[i].high_price ? list[i].high_price : '';
                low_price = list[i].low_price ? list[i].low_price : '';
                close_price = list[i].close_price ? list[i].close_price : '';
                open_price = list[i].open_price ? list[i].open_price : '';
                var now_price_html = '';
                if (Number(now_price) > Number(close_price)) {
                  now_price_html = '<span style="color:#f00;">' + now_price + '</span>'
                }
                if (Number(now_price) == Number(close_price)) {
                  now_price_html = '<span>' + now_price + '</span>'
                }
                if (Number(now_price) < Number(close_price)) {
                  now_price_html = '<span style="color:rgb(40, 240, 100);">' + now_price + '</span>'
                }
                var dif_rate_html = '';
                if (Number(dif_rate) > 0) {
                  dif_rate_html = '<span style="color:#f00;">' + dif_rate + '</span>'
                }
                if (Number(dif_rate) == 0) {
                  dif_rate_html = '<span>' + dif_rate + '</span>'
                }
                if (Number(dif_rate) < 0) {
                  dif_rate_html = '<span style="color:rgb(40, 240, 100);">' + dif_rate + '</span>'
                }
                stockListHtml = '<tr ' + classStr + ' >' +
                  '<td>' + stock_code + '</td>' +
                  '<td>' + stock_name + '</td>' +
                  '<td>' + now_price_html + '</td>' +
                  '<td>' + dif_rate_html + '</td>' +
                  '<td>' + trans_volume + '</td>' +
                  '<td>' + trans_amount + '</td>' +
                  '<td>' + high_price + '/' + low_price + '</td>' +
                  '<td>' + close_price + '/' + open_price + '</td>' +
                  '<td><a class="loadPage" data-id="8" href="#page/strategy.html?flagid='+list[i].stock_code+'" style="display:inline-block;color:#fff;padding:5px 19px 6px;background:#C3181F;border-radius:7px;">交易</a></td>'
                  '</tr>';
                stockListHtmlData.push(stockListHtml);

              }
              if (stockListHtml.length > 0) {
                $('#detail-list tbody').html(stockListHtmlData.join(''));
                if (page_count > 0) {
                  if (!stockList.pagination.load) {
                    stockList.createPagination(page_count);
                  } else {
                    if (page_count != stockList.pagination.pageCount) {
                      stockList.createPagination(page_count, params.page_no); //页码变化，重新初始整个分页
                    }
                  }
                }
              }
              if (stockListHtmlData.length > 0) {
                $('#stockList tbody').html(stockListHtmlData.join(''));
              }
            } else {
              $('#stockList tbody').html('<tr class="tr-bg"><td colspan="8">暂无数据</td></tr>');
            }
          }
        }
      })
    },
    //添加分页
    createPagination: function (pageCount, pageNo) {
      var t = this,
        data_pagination = $('#stockList .pagination'),
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
          t.getstockList(data);
        }
      });
      t.pagination.load = true;
      t.pagination.pageCount = pageCount;
    },
  };
  stockList.init()
})(jQuery)