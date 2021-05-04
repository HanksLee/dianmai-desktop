(function ($) {
  var strategy = {
    keyword: "",
    detailData: {},
    chartData: [],
    type: "1",
    chart: {
      upColor: "#ec0000",
      upBorderColor: "#8A0000",
      downColor: "#00da3c",
      downBorderColor: "#008F28",
      data: [],
      type: "candlestick"
    },
    t_policy_leverage: [],
    tList: [],
    organ: {},
    id: "",
    usermoney: {},
    tp_limit: "",
    sl_limit: "",
    service_fee: "",
    buy_commission: "",
    yinhua_tax: "",
    guohu_fee: "",
    gui_fee: "",
    jianguan_fee: "",
    delay_fee: "",
    fee_time: "",
    delay_days: "",
    policy_time_text: "",
    mc_list: "",
    policy_id: "",
    coupon_code: "",
    couponsData: [],
    js_list: [],
    page_no: 1,
    page_count: 1,
    page_size: 10,
    pagination: {
      load: false,
      pageCount: 0
    },
    sharesType: "0",
    SharesTypeVlaue: [],
    sell_type: "0", //0是T+1，1是T+0
    timeType: "daily",
    cmd: "0", //0是点买，1是点卖
    dataIndex: "",
    market: "",
    market_type: [
      { key: "0", name: "上证" },
      { key: "1", name: "深圳主板" },
      { key: "2", name: "深圳创业板" },
      { key: "3", name: "港股" },
      { key: "4", name: "美股" },
      { key: "5", name: "ETF" },
      { key: "6", name: "期货" },
      { key: "11", name: "科创板" }
    ],
    lots_size: "",
    sharesList: [],
    futuresUrl: "",
    marginValue: "",
    marginIndex: "",
    bondVal: "",
    customer: {},
    sharesListType: "",
    //新版增加的参数
    kChart: null,
    ma5_1: "",
    ma10_1: "",
    ma20_1: "",
    ma30_1: "",
    bgColor: "rgb(43,52,66)", //背景
    upColor: "#FF1E3C", //涨颜色
    downColor: "#28F064", //跌颜色
    // ma  颜色
    ma5Color: "rgb(40, 240, 100)",
    ma10Color: "rgb(36, 153, 226)",
    ma20Color: "#ffab42",
    ma30Color: "rgba(255,0,71,1)",
    tf: false,
    caopanzj: "",
    tp_rate: "", //止盈率
    sl_rate: "", //止损率
    operationFund: 0,
    tp_money: 0,
    sl_money: 0,
    now_price: "",
    inde: 1,
    timer: null,
    timer1: null,
    timer2: null,
    timer111: null,
    timer222: null,
    cleanUp: true,
    cleanUp1: true,
    tf: null,
    timerTf: true,
    handicapChart: null,
    pillarChart: null,
    fundflowData: {},
    htmlData: {},
    htmlCon: null,
    suspend_status: 0,
    gangan: null,
    tp_sl_witch: 0,
    stock_type: 0,
    flagid: null,
    yuming: null,
    styleStr: "",
    detailBtnStyle: "",
    localList: "", //本地list存储，用于更新
    stock_key: "",
    freeze_delayfee: 0,
    stock_code: localStorage.getItem("stockCode") || null,
    init: function () {
      var domain = document.domain;
      var firstDomain = domain.substring(
        domain.indexOf(".") + 1,
        domain.length
      );
      strategy.yuming = firstDomain;
      this.getFlag();
      this.getnavList();
      this.clickSearch();
      this.searchFn();
      this.getDetails();
      this.refreshFn();
      this.tabTFn();
      this.marginStatusTFn();
      this.clickTabChart();
      this.inputFn();
      this.getMyList();
      this.sellOutFn();
      this.sellOutSubmitFn();
      this.purchaseFrameFn();
      this.purchaseFn();
      this.siblingsTapFn();
      this.clickListSearchFn();
      this.sharesTabFn();
      this.getSharesType();
      this.getBuyParameter();
      this.clickMargin();
      this.newsTabFn();
      this.refreshMyList();
      this.refreshDetail();
      //新增方法
      this.adjustmentTrigger();
      this.confirmA();
      this.deferredClosure();
      this.seeEchart();
      this.f10Tab();
      if (firstDomain == "raytekasia.com") {
        strategy.detailBtnStyle =
          'style="background-color: rgb(102, 177, 255);"';
        strategy.styleStr = 'style="background-color: #F56C6C;"';
        $("#dangqian-strategy").text("持仓订单");
        $("#jiesuan-strategy").text("平仓订单");
        $(".jia-th1").text("均价/平仓价");
        $("#over-contract-time").text("平仓时间");
        // $("#contract-duo").text("做 多");
        // $("#contract-kong").text("做 空");
      } else {
        strategy.detailBtnStyle = "";
        strategy.styleStr = "";
        $(".jia-th1").text("均价/终止合约价");
        $("#over-contract-time").text("终止合约时间");
        $("#dangqian-strategy").text("当前策略");
        $("#jiesuan-strategy").text("结算策略");
        // $("#contract-duo").text("多头合约");
        // $("#contract-kong").text("空头合约");
      }
      if (firstDomain == "dingmaohongsheng.com") {
        $(".dianmai").text("创建策略");
        $(".dianmai-m").text("创建策略");
        $(".jia-th").text("开仓价格");
        $(".jia-th1").text("价格/终止合约价");
        // $('.dangqian').text('当前交易');
        // $('.jiesuan').text('结算交易');
        // $('.title em').text('我的交易');
        // $('title').text('我的交易');
      }
      if (firstDomain == "liangrong-fund.com") {
        $(".dianmai").text("融资买涨");
        $(".dianmai-m").text("融券买跌");
        $(".wodecelv-em").text("我的交易");
        $("title").text("我的交易");
        $(".dangqian").text("当前交易");
        $(".jiesuan").text("结算交易");
      }
      if (firstDomain == "boloniasia.com") {
        $(".boloniasia-hide").remove();
        $(".boloniasia-show").show();
        $(".wodecelv-em").text("我的订单");
        $("title").text("我的订单");
      } else {
        $(".boloniasia-hide").show();
        $(".boloniasia-show").remove();
      }
      // $("body").click(function () {
      //   $(".search-list,.shares-type-ul").hide();
      // });
      $("body").click(function () {
        $(".shares-type-ul").hide();
      });
      if (firstDomain == "huachihk.com" || firstDomain == "huifengstocks.com") {
        $(".caozuozijin").text("冻结资金:");
        $(".strategy-money-hk").text("港元");
        $(".strategy-diyan-hk").text("（港元/交易日）");
        $(".strategy--zongji-hk").text("总计(港元):");
      } else {
        $(".caozuozijin").text("操作资金:");
        $(".strategy-money-hk").text("元");
        $(".strategy-diyan-hk").text("（元/交易日）");
        $(".strategy--zongji-hk").text("总计(元):");
      }
      // if(firstDomain == 'liangrong-fund.com'){
      //     strategy.timer = setInterval(
      //       function () {
      //         strategy.timerTf = false
      //         var type = $('.title').attr('data-type');
      //         if (type == '1' && document.getElementById('dingshiid')) {
      //           console.info('请求detail')
      //           strategy.getDetails()
      //         } else {
      //           clearInterval(strategy.timer)
      //         }
      //       }, 1000);
      //     strategy.timer111 = setInterval(
      //       function () {
      //         var data = { page_no: strategy.page_no };
      //         var type = $('.title').attr('data-type');
      //         if (type == '1' && document.getElementById('dingshiid')) {
      //           console.info('请求mylist')
      //           strategy.getMyList(data)
      //         } else {
      //           window.clearInterval(strategy.timer111)
      //         }
      //       },1000)
      //   }else{
      //     strategy.timer = setInterval(
      //       function () {
      //         strategy.timerTf = false
      //         var type = $('.title').attr('data-type');
      //         if (type == '1' && document.getElementById('dingshiid')) {
      //           console.info('请求detail')
      //           strategy.getDetails()
      //         } else {
      //           clearInterval(strategy.timer)
      //         }
      //       }, 10000);
      //   }
    },
    getFlag: function () {
      var hash = window.location.hash,
        query = hash.split("?");
      query = query.length > 1 ? query[1] : "";
      strategy.flagid = utils.getQueryParam(query, "flagid") || "";
    },
    //点击搜索
    clickSearch: function () {
      $("#search-but").click(function () {
        if ($.trim($('.search-box [name="keyword"]').val()) == "") {
          utils.toast("请输入股票代码或股票名称");
          return false;
        }
        $("#refresh").addClass("refresh");
        $(".create-a-strategy-but span").removeClass("active");
        // strategy.timerTf = true;
        strategy.dataIndex = 0;
        strategy.getDetails();
        strategy.getBuyParameter();
        // if(strategy.inde == 1){
        //   strategy.getfiash()
        //   $('.ma-box').hide()
        // }else{
        //   strategy.getkline()
        //   $('.ma-box').show()
        // }
        //strategy.getfundflowData()
        $(".echart-con").hide();
      });
    },
    //输入搜索
    searchFn: function () {
      $('.search-box [name="keyword"]').bind(
        "input porpertychange",
        function () {
          if ($('.search-box [name="keyword"]').val() === "") {
            $(".search-list").hide();
          } else {
            $(".search-list").show();
            $(".search-list").html(
              '<li class="tr-bg" style="text-align:center;color:#999;">数据加载中...</li>'
            );
            ajaxPost({
              isAbort: true,
              specialAjax: true,
              url: "/v1_home/stock/searchall",
              data: { keyword: $.trim($('.search-box [name="keyword"]').val()) },
              success: function (res) {
                if (res.code == "200") {
                  var list = res.data.page_data || [];
                  var sHtml,
                    sHtmlData = [];
                  strategy.sharesList = list;
                  var classStr = "",
                    market_name;
                  if (list.length > 0) {
                    strategy.sharesListType = list[0].market_id;
                    for (var i = 0; i < list.length; i++) {
                      var stock_name = list[i].stock_name || "",
                        stock_code = list[i].stock_code || "",
                        market = list[i].market || "",
                        market_id = list[i].market_id || "";
                      //科创板显示SH标识
                      if (list[i].market_id == "0" || list[i].market_id == "11") {
                        classStr = 'class="sh"';
                        market_name = "SH";
                        key = "0";
                      } else if (
                        list[i].market_id == "1" ||
                        list[i].market_id == "2"
                      ) {
                        classStr = 'class="sz"';
                        market_name = "SZ";
                        key = "0";
                      } else if (list[i].market_id == "3") {
                        classStr = 'class="hk"';
                        market_name = "HK";
                        key = "0";
                      } else if (list[i].market_id == "4") {
                        classStr = 'class="us"';
                        market_name = "US";
                      } else if (list[i].market_id == "5") {
                        classStr = 'class="etf"';
                        market_name = "ETF";
                      }
                      sHtml =
                        '<li data-type="' +
                        stock_code +
                        '" data-market="' +
                        market_id +
                        '" data-abbreviation="' +
                        market +
                        '" data-index="' +
                        i +
                        '">' +
                        "<span " +
                        classStr +
                        ">" +
                        market_name +
                        "</span>" +
                        "<span>" +
                        stock_name +
                        "</span>" +
                        "<span>" +
                        stock_code +
                        "</span>" +
                        "</li>";
                      sHtmlData.push(sHtml);
                    }
                    // $(".search-list").show();

                    if (sHtmlData.length > 0) {
                      $(".search-list").html(sHtmlData.join(""));
                    }
                  } else {
                    // $(".search-list").show();
                    $(".search-list").html(
                      '<li class="tr-bg" style="text-align:center;color:#999;">暂无数据</li>'
                    );
                  }
                }
              }
            });
          }
        }
      );
      // $('.search-box [name="keyword"]').keyup(function (event) {
      //   if (event.keyCode == 13) {

      //     strategy.stock_code = $.trim($('.search-box [name="keyword"]').val());
      //     strategy.searching();

      //   }
      // });
    },
    //搜索動作
    searching: function () {
      strategy.dataIndex = 0;
      strategy.getDetails();
      strategy.getBuyParameter();
      $('.search-box [name="keyword"]').val("")
      $(".search-list").hide();
      $(".shares-type-ul").hide();
      $(".create-a-strategy-but span").removeClass("active");
      // if(strategy.inde == 2){
      //   strategy.getkline()
      // }else{
      //   strategy.getfiash()
      // }
      // strategy.getfundflowData()
      $(".echart-con").hide();
    },
    //点击列表搜索
    clickListSearchFn: function () {
      $(".search-list").on("click", "li", function () {
        var stock_code = $(this).attr("data-type");
        var i = $(this).attr("data-index");
        strategy.market = $(this).attr("data-abbreviation");
        strategy.sharesListType = $(this).attr("data-market");
        if (strategy.sharesList[i].margin_status) {
          var margin_status = strategy.sharesList[i].margin_status.split(",");
          //多头合约显示与隐藏
          if (margin_status[0] == "0" || margin_status[1] == "0") {
            $(".dianmai").show();
          } else {
            $(".dianmai").hide();
          }
          //单头合约显示与隐藏
          if (margin_status[0] == "1" || margin_status[1] == "1") {
            $(".dianmai-m").show();
          } else {
            $(".dianmai-m").hide();
          }
        }
        strategy.stock_code = stock_code;
        strategy.searching();
        // strategy.dataIndex = 0;
        // strategy.getDetails();
        // strategy.getBuyParameter();
        // $('.search-box [name="keyword"]').val("")
        // $(".search-list").hide();
        // $(".shares-type-ul").hide();
        // $(".create-a-strategy-but span").removeClass("active");
        // // if(strategy.inde == 2){
        // //   strategy.getkline()
        // // }else{
        // //   strategy.getfiash()
        // // }
        // // strategy.getfundflowData()
        // $(".echart-con").hide();
      });
    },
    //详情
    getDetails: function () {
      // strategy.keyword = $.trim($('.search-box [name="keyword"]').val());
      var stockCode = null;
      if (
        strategy.yuming == "huachihk.com" ||
        strategy.yuming == "huifengstocks.com"
      ) {
        stockCode = strategy.stock_code || "00001";
      } else if (
        strategy.yuming == "raytekasia.com" ||
        strategy.yuming == "acarpsgroup.com"
      ) {
        stockCode = strategy.stock_code || "510500";
      } else {
        stockCode = strategy.stock_code || "000001";
      }
      // var stock_code = strategy.keyword == "" ? stockCode : strategy.keyword;
      // var stock_code = strategy.keyword == "" ? stockCode : strategy.keyword;
      ajaxPost({
        url: "/v1_home/stock/detail",
        data: {
          // stock_code: stock_code,
          stock_code: strategy.stock_code,
          type: strategy.sharesListType || 0,
          stock_type: strategy.stock_type
        },
        success: function (res) {
          if (res.code == "200" || res.code == "203") {
            var data = res.data;
            localStorage.setItem("stockCode", data.stock_code);
            //港股，期货不显示5档
            if (
              data.market_id == "3" ||
              data.market_id == "6" ||
              data.market_id == "7" ||
              data.market_id == "8" ||
              data.market_id == "9" ||
              data.market_id == "10"
            ) {
              $(".business-box").hide();
              $(".f10-box").hide();
            } else {
              $(".business-box").show();
              $(".f10-box").show();
            }
            strategy.detailData = data;
            strategy.lots_size = data.lots_size;
            strategy.now_price = data.now_price;
            var margin_status = strategy.detailData.margin_status.split(",");
            // alert(margin_status.length)
            if (margin_status.length == 2) {
              $(".dianmai").show();
              $(".cmd-0").show();
              $(".dianmai-m").show();
              $(".cmd-1").show();
            } else {
              if (margin_status[0] == "0") {
                $(".dianmai").show();
                $(".cmd-0").show();
                $(".dianmai-m").hide();
                $(".cmd-1").hide();
              } else {
                $(".dianmai-m").show();
                $(".cmd-1").show();
                $(".dianmai").hide();
                $(".cmd-0").hide();
              }
            }

            if (res.data.market_id == "0" || res.data.market_id == "11") {
              $(".shic-box").html("<i class='sh'>SH</i>");
            } else if (res.data.market_id == "1" || res.data.market_id == "2") {
              $(".shic-box").html("<i class='sz'>SZ</i>");
            } else if (res.data.market_id == "3") {
              $(".shic-box").html("<i class='hk'>HK</i>");
            } else if (res.data.market_id == "4") {
              $(".shic-box").html("<i class='us'>US</i>");
            } else if (res.data.market_id == "5") {
              $(".shic-box").html("<i class='etf'>ETF</i>");
            }
            $(".stock_name").text(res.data.stock_name);
            $(".stock_code").text(res.data.stock_code);
            $(".now_price").text(res.data.now_price);
            $(".open_price").text(res.data.open_price);
            $(".high_price").text(res.data.high_price);
            $(".low_price").text(res.data.low_price);
            $(".limit_max").text(res.data.limit_max);
            $(".limit_min").text(res.data.limit_min);
            $(".limt_percent").text(res.data.swing);
            // 买
            $(".buy_1_price").text(res.data.buy_1_price);
            $(".buy_2_price").text(res.data.buy_2_price);
            $(".buy_3_price").text(res.data.buy_3_price);
            $(".buy_4_price").text(res.data.buy_4_price);
            $(".buy_5_price").text(res.data.buy_5_price);
            $(".buy_1_volume").text(res.data.buy_1_volume);
            $(".buy_2_volume").text(res.data.buy_2_volume);
            $(".buy_3_volume").text(res.data.buy_3_volume);
            $(".buy_4_volume").text(res.data.buy_4_volume);
            $(".buy_5_volume").text(res.data.buy_5_volume);
            // 卖
            $(".sell_1_price").text(res.data.sell_1_price);
            $(".sell_2_price").text(res.data.sell_2_price);
            $(".sell_3_price").text(res.data.sell_3_price);
            $(".sell_4_price").text(res.data.sell_4_price);
            $(".sell_5_price").text(res.data.sell_5_price);
            $(".sell_1_volume").text(res.data.sell_1_volume);
            $(".sell_2_volume").text(res.data.sell_2_volume);
            $(".sell_3_volume").text(res.data.sell_3_volume);
            $(".sell_4_volume").text(res.data.sell_4_volume);
            $(".sell_5_volume").text(res.data.sell_5_volume);
            $("#refresh").removeClass("refresh");
            $(".cankaohuilv").text(1);
            if (Number(res.data.open_rate) !== 1) {
              $(".cankaohuilv").text(res.data.open_rate);
              $(".cankaohuilv-box").show();
            }
            $(".tipai").text("");
            $(".tipai").hide();
            if (res.data.suspend_status == "1") {
              $(".tipai").text("(停牌)");
              $(".tipai").show();
              $(".now_price").text(res.data.close_price);
              $(".open_price").text("--");
              $(".high_price").text("--");
              $(".low_price").text("--");
              $(".limit_max").text("--");
              $(".limit_min").text("--");
              $(".limt_percent").text("--");
              $(".buy_1_price").text("--");
              $(".buy_2_price").text("--");
              $(".buy_3_price").text("--");
              $(".buy_4_price").text("--");
              $(".buy_5_price").text("--");
              $(".buy_1_volume").text("--");
              $(".buy_2_volume").text("--");
              $(".buy_3_volume").text("--");
              $(".buy_4_volume").text("--");
              $(".buy_5_volume").text("--");
              // 卖
              $(".sell_1_price").text("--");
              $(".sell_2_price").text("--");
              $(".sell_3_price").text("--");
              $(".sell_4_price").text("--");
              $(".sell_5_price").text("--");
              $(".sell_1_volume").text("--");
              $(".sell_2_volume").text("--");
              $(".sell_3_volume").text("--");
              $(".sell_4_volume").text("--");
              $(".sell_5_volume").text("--");
            }
            strategy.market = res.data.market;
          } else {
            $("#refresh").removeClass("refresh");
            //utils.toast(res.msg);
            if (strategy.timerTf) {
              utils.dialog({
                title: "提示",
                temp:
                  '<div class="msg">' +
                  res.msg +
                  '</div>\
                    <div class="c-dialog-btns">\
                        <a class="commit-btn loadPage" href="#page/strategy.html">确认</a>\
                    </div>',
                commitFn: function ($dialog) {
                  $dialog.remove();

                },
                cancelFn: function ($dialog) {
                  $dialog.remove();
                },
                closeDialog: function ($dialog) {
                  $dialog.remove();
                  // window.location.reload();
                }
              });
            }
          }
        }
      });
    },
    //刷新详情
    refreshFn: function () {
      $("#refresh").click(function () {
        $(this).addClass("refresh");
        strategy.dataIndex = 0;
        strategy.getDetails();
        strategy.getBuyParameter();
        if (strategy.inde == "1") {
          strategy.getfiash();
        } else if (strategy.inde == "2") {
          strategy.getkline();
        }
        strategy.getfundflowData();
      });
    },
    //点击分时，日k切换
    clickTabChart: function () {
      $(".ec-tab span").click(function () {
        $(this)
          .addClass("active")
          .siblings()
          .removeClass("active");
        var type = $(this).attr("data-type");
        strategy.tf = $(this).attr("data-type");
        strategy.inde = type;
        if (type == "1") {
          strategy.getfiash();
          $(".ma-box").hide();
          clearInterval(strategy.timer2);
          strategy.timer1 = setInterval(function () {
            strategy.getfiash();
          }, 60000);
        } else {
          $(".ma-box").show();
          strategy.getkline();
          clearInterval(strategy.timer1);
          strategy.timer2 = setInterval(function () {
            strategy.getkline();
          }, 300000);
        }
      });
    },
    //分时日k切换
    tabChartFn: function (index, val) {
      if (index === "1") {
        $(".echart-box").css({ "padding-top": "0" });
        strategy.getfiash();
      } else {
        $(".echart-box").css({ "padding-top": "40px" });
        strategy.getkline();
      }
    },
    //获取买入参数配置
    getBuyParameter: function () {
      // var stockCode = null;
      if (
        strategy.yuming == "huachihk.com" ||
        strategy.yuming == "huifengstocks.com"
      ) {
        stockCode =
          strategy.flagid || strategy.stock_code || "00001";
      } else if (
        strategy.yuming == "raytekasia.com" ||
        strategy.yuming == "acarpsgroup.com"
      ) {
        stockCode = strategy.stock_code || "510500";
      } else {
        stockCode =
          strategy.flagid || strategy.stock_code || "000001";
      }
      $(".create-a-strategy").hide();
      ajaxPost({
        url: "/v1_home/policy/buyfee",
        data: {
          // stock_code: strategy.keyword || stockCode,
          stock_code: strategy.stock_code,
          demo_flag: "0",
          stock_type: strategy.stock_type
        },
        success: function (res) {
          if (res.code == "200") {
            strategy.customer = res.data.customer;
            strategy.tList = res.data.policy;
            strategy.organ = res.data.organ;
            strategy.usermoney = res.data.usermoney;
            var listData = res.data.policy,
              htmlTab,
              htmlTabData = [];
            var htmlMarginStatus, htmlMarginStatusData = [];
            var t_policy_leverage = [];
            strategy.id = listData[0].id;
            strategy.tp_limit = strategy.tList[0].tp_limit || "0";
            strategy.sl_limit = strategy.tList[0].sl_limit || "0";
            strategy.service_fee = strategy.tList[0].service_fee || "";
            strategy.buy_commission = strategy.tList[0].buy_commission || "";
            strategy.yinhua_tax = strategy.tList[0].yinhua_tax || "";
            strategy.guohu_fee = strategy.tList[0].guohu_fee || "";
            strategy.gui_fee = strategy.tList[0].gui_fee || "";
            strategy.jianguan_fee = strategy.tList[0].jianguan_fee || "";
            strategy.delay_fee = strategy.tList[0].delay_fee || "";
            strategy.fee_time = strategy.tList[0].fee_time || "";
            strategy.delay_days = strategy.tList[0].delay_days || "";
            strategy.policy_time_text =
              strategy.tList[0].policy_time_text || "";
            strategy.tp_rate = strategy.tList[0].tp_rate || "";
            strategy.sl_rate = strategy.tList[0].sl_rate || "";
            strategy.freeze_delayfee = res.data.organ.freeze_delayfee;
            strategy.margin_status = strategy.tList[0].margin_status || "";
            strategy.margin_status_name = strategy.tList[0].margin_status_name || "";
            strategy.cmd = strategy.tList[0].margin_status[0];
            if (res.data.organ.tp_sl_witch == "0") {
              $(".tp_sl_witch-0").show();
              $(".tp_sl_witch-1").hide();
            } else {
              $(".tp_sl_witch-0").hide();
              $(".tp_sl_witch-1").show();
            }
            if (strategy.tp_limit == "0") {
              $(".winStopAt").hide();
            }
            if (strategy.sl_limit == "0") {
              $(".loseStopAt").hide();
            }
            var userinfo = JSON.parse(localStorage.getItem("userinfo"));
            var market_trade_type_arr = userinfo.market_trade_type.split(",");
            for (let i = 0; i < market_trade_type_arr.length; i++) {
              if (res.data.stock.market_id == market_trade_type_arr[i]) {
                $(".create-a-strategy").show();
              }
            }

            strategy.operationFund =
              Number(strategy.tList[0].policy_money) * 10000; //操作资金
            if (listData.length > 0) {
              for (var i = 0; i < listData.length; i++) {
                var policy_name = listData[i].policy_name
                  ? listData[i].policy_name
                  : "";
                htmlTab = "<li>" + policy_name + "</li>";
                htmlTabData.push(htmlTab);
              }

              for (var i = 0; i < strategy.margin_status.length; i++) {
                htmlMarginStatus = `<li data-cmd=${strategy.margin_status[i]}>${strategy.margin_status_name[i]}</li>`;
                htmlMarginStatusData.push(htmlMarginStatus);
              }
              strategy.t_policy_leverage = listData[0].policy_leverage.split(
                ","
              );
              $('.bond [name="bond"]').val(
                Number(listData[0].policy_money) * 10000
              );
            }
            if (htmlTabData.length > 0) {
              $(".product-tab ul").html(htmlTabData.join(""));
              $(".product-tab li")
                .eq(0)
                .addClass("active");
              $(".margin-status-tab ul").html(htmlMarginStatusData.join(""));

              $(".margin-status-tab li")
                .eq(0)
                .addClass("active");
            }
            $(".bond .min").text(listData[0].min_money);
            $(".bond .max").text(listData[0].max_money);
            $(".strong-leveling-line em").text(
              strategy.organ.risk_margin_limit * 100 + "%"
            );
            $(".bying-rate em.xm").text(strategy.detailData.now_price);
            $(".availableFunds em.zj").text(strategy.usermoney.can_bring_money);
            if (listData[0].policy_time == "0") {
              $(".holding-time span").html("<em>长期持有</em>");
              if (
                strategy.yuming == "huachihk.com" ||
                strategy.yuming == "huifengstocks.com"
              ) {
                $(".zbzj").text("(总计=冻结资金+服务费)");
              } else {
                $(".zbzj").text("(总计=操作资金+服务费)");
              }
            } else {
              $(".holding-time em.chic").text(listData[0].policy_time + "天");
              $(".zidong").text("(" + strategy.policy_time_text + ")");
              if (
                strategy.yuming == "huachihk.com" ||
                strategy.yuming == "huifengstocks.com"
              ) {
                $(".zbzj").text("(总计=冻结资金+服务费+递延费*天数)");
              } else if (strategy.freeze_delayfee == 1) {
                $(".zbzj").text("(总计=操作资金+服务费)");
              } else {
                $(".zbzj").text("(总计=操作资金+服务费+递延费*天数)");
              }
            }
            $(".mingxi").text("（免息时间：" + strategy.fee_time + "天）");
            if (strategy.tList[0].etf_margin) {
              var htmlData = [],
                htmlM = [];
              var etf_marginArr = strategy.tList[0].etf_margin.split(",");
              strategy.bondVal = etf_marginArr[0];
              // $('.margin-box-list-box span').eq(0).addClass('active');
              for (var i = 0; i < etf_marginArr.length; i++) {
                var value = etf_marginArr[i];
                htmlData = "<span>" + value + "</span>";
                htmlM.push(htmlData);
              }
              $(".margin-box-list-box").html(htmlM.join(""));
              $(".margin-box-list").show();
            } else {
              strategy.bondVal =
                Number($.trim($('.bond [name="bond"]').val())) === 0
                  ? 1
                  : Number($.trim($('.bond [name="bond"]').val()));
              $(".margin-box-list").hide();
            }
            strategy.tHtmlFn();
            //strategy.chufazhiying();
            //strategy.chufazhishui();
          }
        }
      });
    },
    //点击操作资金
    clickMargin: function () {
      $(".margin-box-list-box").on("click", "span", function () {
        $(this)
          .addClass("active")
          .siblings()
          .removeClass("active");
        strategy.bondVal = $(this).text();
        $('.bond [name="bond"]').val($(this).text());
        strategy.tHtmlFn();
      });
    },
    //Tab切换T+20(月盈)T+10(半月盈)T+5(周盈)T+1(日盈)
    tabTFn: function () {
      $(".product-tab").on("click", "li", function () {
        var index = $(this).index() || 0;
        var htmlMarginStatus, htmlMarginStatusData = [];
        strategy.marginIndex = index;
        $(this)
          .addClass("active")
          .siblings()
          .removeClass("active");
        strategy.id = strategy.tList[index].id;
        strategy.t_policy_leverage = strategy.tList[
          index
        ].policy_leverage.split(",");
        strategy.tp_limit = strategy.tList[index].tp_limit || 0;
        strategy.sl_limit = strategy.tList[index].sl_limit || 0;
        strategy.service_fee = strategy.tList[index].service_fee || "";
        strategy.buy_commission = strategy.tList[index].buy_commission || "";
        strategy.yinhua_tax = strategy.tList[index].yinhua_tax || "";
        strategy.guohu_fee = strategy.tList[index].guohu_fee || "";
        strategy.gui_fee = strategy.tList[index].gui_fee || "";
        strategy.jianguan_fee = strategy.tList[index].jianguan_fee || "";
        strategy.delay_fee = strategy.tList[index].delay_fee || "";
        strategy.fee_time = strategy.tList[index].fee_time || "";
        strategy.delay_days = strategy.tList[index].delay_days || "";
        strategy.policy_time_text =
          strategy.tList[index].policy_time_text || "";
        strategy.tp_rate = strategy.tList[index].tp_rate || "";
        strategy.sl_rate = strategy.tList[index].sl_rate || "";
        strategy.margin_status = strategy.tList[index].margin_status[0] === "0" ? strategy.tList[index].margin_status : strategy.tList[index].margin_status.reverse() || "";
        strategy.margin_status_name = strategy.tList[index].margin_status_name || "";
        if (strategy.margin_status.length === 1) {
          strategy.cmd = strategy.tList[index].margin_status[0];
        }
        strategy.operationFund =
          Number(strategy.tList[index].policy_money) * 10000; //操作资金
        $(".bond .min").text(strategy.tList[index].min_money);
        $(".bond .max").text(strategy.tList[index].max_money);

        for (var i = 0; i < strategy.margin_status.length; i++) {
          htmlMarginStatus = `<li data-cmd=${strategy.margin_status[i]} data-index=${i}>${strategy.margin_status_name[i]}</li>`;
          htmlMarginStatusData.push(htmlMarginStatus);
        }

        $(".margin-status-tab ul").html(htmlMarginStatusData.join(""));
        if (strategy.margin_status.length === 1) {
          strategy.dataIndex = 0;
          $(".margin-status-tab li")
            .eq(strategy.dataIndex)
            .addClass("active");
        } else {
          $(".margin-status-tab li")
            .eq(strategy.dataIndex)
            .addClass("active");
        }

        if (strategy.tList[index].policy_time == "0") {
          $(".holding-time em.chic").text("长期持有");
          if (
            strategy.yuming == "huachihk.com" ||
            strategy.yuming == "huifengstocks.com"
          ) {
            $(".zbzj").text("(准备资金=冻结资金+服务费)");
          } else {
            $(".zbzj").text("(准备资金=操作资金+服务费)");
          }
        } else {
          $(".holding-time em.chic").text(
            strategy.tList[index].policy_time + "天"
          );
          $(".zidong").text("(" + strategy.policy_time_text + ")");
          if (
            strategy.yuming == "huachihk.com" ||
            strategy.yuming == "huifengstocks.com"
          ) {
            $(".zbzj").text("(总计=冻结资金+服务费+递延费*天数)");
          } else {
            $(".zbzj").text("(总计=操作资金+服务费+递延费*天数)");
          }
        }
        $('.bond [name="bond"]').val(
          Number(strategy.tList[index].policy_money) * 10000
        );
        $(".mingxi").text("（免息时间：" + strategy.fee_time + "天）");
        if (strategy.tList[index].etf_margin) {
          var htmlData = [],
            htmlM = [];
          var etf_marginArr = strategy.tList[index].etf_margin.split(",");
          strategy.bondVal = etf_marginArr[0];
          for (var i = 0; i < etf_marginArr.length; i++) {
            var value = etf_marginArr[i];
            htmlData = "<span>" + value + "</span>";
            htmlM.push(htmlData);
          }
          $(".margin-box-list-box").html(htmlM.join(""));
          // $('.margin-box-list-box span').eq(0).addClass('active');
          $(".margin-box-list").show();
        } else {
          strategy.bondVal =
            Number($.trim($('.bond [name="bond"]').val())) === 0
              ? 1
              : Number($.trim($('.bond [name="bond"]').val()));
          $(".margin-box-list").hide();
        }

        strategy.tHtmlFn();
        //strategy.chufazhiying();
        //strategy.chufazhishui();
      });
    },
    marginStatusTFn: function () {
      $(".margin-status-tab").on("click", "li", function () {
        strategy.cmd = $(this).attr("data-cmd");
        strategy.dataIndex = $(this).attr("data-index");
        $(this)
          .addClass("active")
          .siblings()
          .removeClass("active");
      })
    },
    tHtmlFn: function () {
      var tHtml,
        tHtmlData = [];
      for (var i = 0; i < strategy.t_policy_leverage.length; i++) {
        var num =
          Number(strategy.t_policy_leverage[i]) *
          Number($.trim($('.bond [name="bond"]').val()));
        tHtml = "<span>" + num + "</span>";
        tHtmlData.push(tHtml);
      }
      $(".matching-num").html(tHtmlData.join(""));
      $(".matching-num span")
        .eq(0)
        .addClass("active");
      strategy.bondVal = $(".matching-num span")
        .eq(0)
        .text();
      strategy.caopanzj = $(".matching-num span")
        .eq(0)
        .text();
      strategy.numberofShares();
      strategy.serviceChargeFn();
      strategy.deferredChargeFn();
      strategy.totalFn();
      strategy.stopLossAndStoplossFn();
      strategy.chufazhiying();
      strategy.chufazhishui();
      $(".matching-num").on("click", "span", function () {
        $(this)
          .addClass("active")
          .siblings()
          .removeClass("active");
        strategy.bondVal = $(this).text();
        strategy.caopanzj = $(this).text();
        strategy.numberofShares();
        strategy.serviceChargeFn();
        strategy.deferredChargeFn();
        strategy.totalFn();
        strategy.stopLossAndStoplossFn();
      });
    },
    //止盈止损计算
    stopLossAndStoplossFn: function () {
      var tp = null,
        tp1 = null,
        tl = null,
        tl1 = null,
        sl_limit_value = null,
        sl_limit_value1 = null;
      var gangan =
        Number(strategy.bondVal) / Number($('.bond [name="bond"]').val());
      if (strategy.tp_limit == "0") {
        $(".winStopAt").hide();
      } else {
        $(".winStopAt").show();
      }
      if (strategy.sl_limit == "0") {
        $(".loseStopAt").hide();
      } else {
        if (gangan == "1") {
          $(".loseStopAt").hide();
        } else {
          $(".loseStopAt").show();
        }
      }
      if (
        strategy.detailData.market_id == "3" ||
        strategy.detailData.market_id == "5"
      ) {
        tp = (
          (1 + Number(strategy.tp_limit)) *
          Number(strategy.detailData.now_price)
        ).toFixed(3); //多止盈计算
        tp1 = (
          (1 - Number(strategy.tp_limit)) *
          Number(strategy.detailData.now_price)
        ).toFixed(3); //空止盈计算
        tl = (Number(strategy.detailData.now_price) * (1 - 1 / gangan)).toFixed(
          3
        ); //多止损计算
        tl1 = (
          Number(strategy.detailData.now_price) /
          (1 - 1 / gangan)
        ).toFixed(3); //空止损计算
        sl_limit_value = Number(
          strategy.detailData.now_price * (1 - strategy.sl_limit)
        ).toFixed(3);
        sl_limit_value1 = Number(
          strategy.detailData.now_price / (1 - strategy.sl_limit)
        ).toFixed(3);
      } else {
        tp = (
          (1 + Number(strategy.tp_limit)) *
          Number(strategy.detailData.now_price)
        ).toFixed(3); //多止盈计算
        tp1 = (
          (1 - Number(strategy.tp_limit)) *
          Number(strategy.detailData.now_price)
        ).toFixed(3); //空止盈计算
        tl = (Number(strategy.detailData.now_price) * (1 - 1 / gangan)).toFixed(
          2
        ); //多止损计算
        tl1 = (
          Number(strategy.detailData.now_price) /
          (1 - 1 / gangan)
        ).toFixed(3); //空止损计算
        sl_limit_value = Number(
          strategy.detailData.now_price * (1 - strategy.sl_limit)
        ).toFixed(3);
        sl_limit_value1 = Number(
          strategy.detailData.now_price / (1 - strategy.sl_limit)
        ).toFixed(3);
      }
      if (Number(tl) >= Number(sl_limit_value)) {
        tl = tl;
      } else {
        tl = sl_limit_value;
      }
      if (Number(tl1) >= Number(sl_limit_value1)) {
        tl1 = sl_limit_value1;
      } else {
        tl1 = tl1;
      }
      if (strategy.tp_limit == "0") {
        tp = 0;
        tp1 = 0;
      }
      if (strategy.sl_limit == "0") {
        tl = 0;
        tl1 = 0;
      }
      $(".target-profit-name0").val(Number(tp));
      $(".target-profit-name1").val(Number(tp1));
      $(".stop-loss-name0").val(Number(tl));
      $(".stop-loss-name1").val(Number(tl1));
    },
    //股数计算
    numberofShares: function () {
      //console.log(strategy.detailData.now_price);
      var gs = 0;
      if (Number(strategy.detailData.now_price) == 0) {
        gs = 0;
      } else {
        if (
          strategy.detailData.market_id == "6" ||
          strategy.detailData.market_id == "7" ||
          strategy.detailData.market_id == "8" ||
          strategy.detailData.market_id == "9" ||
          strategy.detailData.market_id == "10"
        ) {
          gs = Math.floor(
            Number(strategy.caopanzj) /
            Number(strategy.detailData.now_price) /
            Number(strategy.detailData.lots_size)
          );
        } else {
          gs =
            Math.floor(
              Number(strategy.caopanzj) /
              Number(strategy.detailData.now_price) /
              Number(strategy.lots_size)
            ) * Number(strategy.lots_size);
        }
      }
      $(".bying-rate .gs").text(gs);
    },
    //服务费计算
    serviceChargeFn: function () {
      var gushu = Number($(".gs").text());
      var value = Number(strategy.detailData.now_price * gushu), //股数*现价
        service_fee = Number(strategy.service_fee),
        guohu_fee = Number(strategy.guohu_fee),
        gui_fee = Number(strategy.gui_fee),
        jianguan_fee = Number(strategy.jianguan_fee),
        buy_commission = Number(strategy.buy_commission),
        guanglifei =
          (1 + Number(strategy.customer.add_service)) * service_fee * value,
        juanshangdaikou = Number((guohu_fee + gui_fee + jianguan_fee) * value),
        shouxufei =
          (1 + Number(strategy.customer.add_buy_commission)) *
          buy_commission *
          value,
        serviceCharge = Number(
          guanglifei + shouxufei + juanshangdaikou
        ).toFixed(3);
      if (Number(strategy.detailData.market_id) !== 2) {
        juanshangdaikou = Number((guohu_fee + gui_fee) * value);
      }
      //交易规费+过户费+监管费为0时，券商代收不显示
      var sumFee =
        Number(strategy.jianguan_fee) +
        Number(strategy.guohu_fee) +
        Number(strategy.jianguan_fee);
      var strTemp = "券商代收+";
      // console.info("费用" + sumFee);
      if (sumFee == 0) {
        strTemp = " ";
      }
      if (guanglifei == "0") {
        $(".service-charge span").html(
          '<em class="fuwufei">' +
          serviceCharge +
          '</em><em class="em999">(' +
          strTemp +
          "手续费)</em>"
        );
      } else {
        $(".service-charge span").html(
          '<em class="fuwufei">' +
          serviceCharge +
          '</em><em class="em999">(管理费+' +
          strTemp +
          "手续费)</em>"
        );
      }
    },
    //递延费计算
    deferredChargeFn: function () {
      var delay_fee = Number(strategy.delay_fee);
      var deferredCharge =
        Number(strategy.detailData.now_price) *
        Number($(".gs").text()) *
        delay_fee;
      var diyanfeiVal = Number(
        (1 + strategy.customer.add_delay_fee) * deferredCharge
      ).toFixed(3);
      // if (Number(strategy.detailData.market_id) !== 3 || Number(strategy.detailData.market_id) !== 4) {
      //   $('.deferred-charge').hide();
      // }
      $(".deferred-charge em.diyan").text(diyanfeiVal);
    },
    //输入操作资金
    inputFn: function () {
      $('.bond [name="bond"]').bind("input porpertychange", function () {
        strategy.bondVal =
          Number($.trim($('.bond [name="bond"]').val())) === 0
            ? 1
            : Number($.trim($('.bond [name="bond"]').val()));
        strategy.tHtmlFn();
      });
    },
    //计算共计，用户支付
    totalFn: function () {
      var baozhengjin = Number($('.bond [name="bond"]').val());
      var fuwufei = Number($(".service-charge em.fuwufei").text());
      var diyanfei = Number($(".deferred-charge .diyan").text());
      var gongji = 0;
      if (Number(strategy.delay_days) > 0) {
        if (strategy.freeze_delayfee == 1) {
          gongji = baozhengjin + fuwufei;
        } else {
          gongji =
            baozhengjin +
            fuwufei +
            diyanfei * Number(strategy.delay_days - strategy.fee_time);
        }
      } else {
        gongji = baozhengjin + fuwufei;
      }
      var huilv = Number($(".cankaohuilv").text());
      $(".total em.gj").text((Number(gongji) * huilv).toFixed(3));
    },
    purchaseFrameFn: function () {
      var height = $(".purchase-frame").height();
      $(".purchase-frame").css({ top: "50%", "margin-top": -height / 2 });
      $(".purchase-but").click(function () {
        // strategy.cmd = $(this).attr("data-cmd");
        $(".purchase-frame,.bg").fadeIn();
      });
      $(".quxiao-but,.bg").click(function () {
        $(".purchase-frame,.bg").fadeOut();
      });
    },
    //买入提交
    purchaseFn: function () {
      $("#jixu-but").click(function () {
        var tp = 0,
          sl = 0;
        var gangan =
          Number(strategy.caopanzj) / Number($('.bond [name="bond"]').val());
        if (strategy.cmd == "0") {
          tp = $(".target-profit-name0").val();
          if (gangan == "1") {
            sl = 0;
          } else {
            sl = $(".stop-loss-name0").val();
          }
        } else {
          tp = $(".target-profit-name1").val();
          if (gangan == "1") {
            sl = 0;
          } else {
            sl = $(".stop-loss-name1").val();
          }
        }
        var data = {
          stock_code: $(".stock_code").text(),
          init_margin: $('.bond [name="bond"]').val(),
          leverage: gangan,
          assign_price: strategy.now_price,
          assign_volume: $(".bying-rate .gs").text(),
          policy_type: strategy.id,
          tp: tp,
          sl: sl,
          is_demo: "0",
          coupon_code: strategy.coupon_code,
          cmd: strategy.cmd,
          tp_money: Math.abs(strategy.tp_money),
          sl_money: Math.abs(strategy.sl_money)
        };
        ajaxPost({
          url: "/v1_home/policy/buy",
          data: data,
          success: function (res) {
            if (res.code == "200") {
              utils.toast("买入成功");
              $(".purchase-frame,.bg").fadeOut();
              var data = { page_no: strategy.page_no };
              strategy.getMyList(data);
              $(".create-a-strategy-but span").each(function () {
                if ($(this).hasClass("active")) {
                  $(this).removeClass("active");
                }
              });
            } else {
              var msg = res.msg || "买入失败";
              utils.toast(msg);
            }
          }
        });
      });
    },
    //获取当前策略
    getMyList: function (params) {
      var t = this;
      var page_noa = "1";
      if (params) {
        page_noa = params.page_no;
        strategy.page_no = params.page_no;
      }
      ajaxPost({
        url: "/v1_home/policy/mylist",
        data: {
          page_no: page_noa,
          page_size: strategy.page_size
        },
        success: function (res) {
          if (res.code == "200") {
            console.log(res)
            var list = res.data.page_data,
              page_count = res.data.page.page_count,
              htmlList,
              htmlListData = [];
            (strategy.mc_list = list), (zhiHtml = ""), (diyanHtml = "");
            strategy.tp_sl_witch = res.data.organ.tp_sl_witch;
            strategy.localList = list;
            var domain = document.domain;
            var firstDomain = domain.substring(
              domain.indexOf(".") + 1,
              domain.length
            );
            if (list.length > 0) {
              strategy.stock_key = "";
              for (var i = 0; i < list.length; i++) {
                var classStr = i % 2 == 0 ? 'class="tr-bg"' : "",
                  id = list[i].id || "",
                  stock_name = list[i].stock_name || "",
                  stock_code = list[i].stock_code || "",
                  market_id = list[i].market_id
                init_margin = Number(list[i].init_margin) || 0,
                  left_volume = Number(list[i].left_volume) || 0,
                  open_price = Number(list[i].open_price) || 0,
                  now_price = Number(list[i].now_price) || 0,
                  close_profit = Number(list[i].yk_value).toFixed(3) || 0,
                  open_time = list[i].open_time || "",
                  market_name = "";
                var domain = document.domain;
                var firstDomain = domain.substring(
                  domain.indexOf(".") + 1,
                  domain.length
                );
                var cfdName = "";

                if (list[i].stock_type == "1") {
                  cfdName = "(指数.)";
                }
                if (list[i].stock_type == "2") {
                  cfdName = "(指数)";
                }
                strategy.stock_key += list[i].stock_key + ",";
                var close_profit_html = "";
                if (Number(market_id) !== 3) {
                  if (Number(close_profit) > 0) {
                    close_profit_html =
                      '<em style="color:#f00;">' +
                      close_profit +
                      "</em>";
                  } else if (Number(close_profit) === 0) {
                    close_profit_html = close_profit;
                  } else {
                    close_profit_html =
                      '<em style="color: rgb(40, 240, 100);">' + close_profit + "</em>";
                  }
                } else {
                  if (Number(close_profit) > 0) {
                    close_profit_html =
                      '<em style="color: rgb(40, 240, 100);">' +
                      close_profit +
                      "</em>";
                  } else if (Number(close_profit) === 0) {
                    close_profit_html = close_profit;
                  } else {
                    close_profit_html =
                      '<em style="color:#f00;">' + close_profit + "</em>";
                  }
                }
                if (firstDomain == "dingmaohongsheng.com") {
                  open_time = open_time.substring(0, 16);
                }
                var cmdName = "";
                if (firstDomain == "dingmaohongsheng.com") {
                  cmdName = "多头合约";
                } else if (firstDomain == "liangrong-fund.com") {
                  cmdName = list[i].cmd == "1" ? "融券买跌" : "融资买涨";
                } else {
                  cmdName = list[i].cmd == "1" ? "空头合约" : "多头合约";
                }
                if (
                  list[i].market_id == "6" ||
                  list[i].market_id == "7" ||
                  list[i].market_id == "8" ||
                  list[i].market_id == "9" ||
                  list[i].market_id == "10"
                ) {
                  left_volume = left_volume / Number(list[i].lots_size);
                }
                strategy.market_type.map(function (item) {
                  if (item.key == list[i].market_id) {
                    market_name = item.name;
                  }
                });
                zhiHtml =
                  '<span class="zhiyzhis" style="background-color:yellow;" ' +
                  strategy.styleStr +
                  ' data-type="' +
                  i +
                  '">止盈止损</span>';
                if (list[i].aoto_delay == "1") {
                  diyanHtml =
                    '<span class="guanbidiyan" style="background-color:orange;" ' +
                    strategy.styleStr +
                    ' data-type="' +
                    i +
                    '">关闭递延</span>';
                } else {
                  diyanHtml = "";
                }
                var tbHtml = "";
                if (list[i].suspend_status == "0") {
                  tbHtml =
                    '<span class="xiangqing" ' +
                    strategy.detailBtnStyle +
                    ' data-type="' +
                    i +
                    '"> <a class="loadPage" href="#page/strategyDetails.html?flagid=' +
                    list[i].id +
                    '&outid=1" data-type="' +
                    i +
                    '">详情</a></span><span class="maichu" style="background-color:#00FF7F;" ' +
                    strategy.styleStr +
                    ' data-type="' +
                    i +
                    '" data-cmd="' +
                    list[i].cmd +
                    '">终止合约</span>' +
                    zhiHtml +
                    "" +
                    diyanHtml +
                    "";
                  // tbHtml = '<span class="xiangqing" data-type="' + i + '"> <a class="loadPage" href="#page/strategyDetails.html?flagid=' + list[i].id + '&outid=1" data-type="' + i + '">详情</a></span><span class="maichu" data-type="' + i + '" data-cmd="' + list[i].cmd + '">终止合约</span>' + zhiHtml + '' + diyanHtml + ''
                } else {
                  zhiHtml = "";
                  diyanHtml = "";
                  tbHtml =
                    '<span class="xiangqing" ' +
                    strategy.detailBtnStyle +
                    ' data-type="' +
                    i +
                    '"> <a class="loadPage" href="#page/strategyDetails.html?flagid=' +
                    list[i].id +
                    '&outid=1" data-type="' +
                    i +
                    '">详情</a></span><span class="maichu" style="background-color:#00FF7F;" ' +
                    strategy.styleStr +
                    ' data-type="' +
                    i +
                    '" data-cmd="' +
                    list[i].cmd +
                    '">赎回</span>' +
                    zhiHtml +
                    "" +
                    diyanHtml +
                    "";
                }
                var diyanHtml = "";
                if (list[i].policy_time == 0) {
                  if (list[i].aoto_delay == 0) {
                    diyanHtml =
                      "<p style='color:rgb(255,255,41);font-size:12px;'>(" +
                      list[i].policy_delay_time +
                      ")<p>";
                  } else {
                    if (
                      firstDomain == "ftstrategy.net" ||
                      firstDomain == "liangrong-fund.com"
                    ) {
                      if (list[i].market_id == "3") {
                        diyanHtml =
                          "<p style='color:rgb(255,255,41);font-size:12px;'>(每天15:59扣除递延费，如可用金额不足，订单将被强制终止合约。)</p>";
                      } else {
                        diyanHtml =
                          "<p style='color:rgb(255,255,41);font-size:12px;'>(每天14:59扣除递延费，如可用金额不足，订单将被强制终止合约。)</p>";
                      }
                    } else {
                      if (list[i].market_id == "3") {
                        diyanHtml =
                          "<p style='color:rgb(255,255,41);font-size:12px;'>(每天15:40扣除递延费，如可用金额不足，订单将被强制终止合约。)</p>";
                      } else {
                        diyanHtml =
                          "<p style='color:rgb(255,255,41);font-size:12px;'>(每天14:40扣除递延费，如可用金额不足，订单将被强制终止合约。)</p>";
                      }
                    }
                  }
                } else {
                  if (list[i].aoto_delay == 0) {
                    diyanHtml =
                      "<p style='color:rgb(255,255,41);font-size:12px;'>(" +
                      list[i].policy_delay_time +
                      ")<p>";
                  } else {
                    diyanHtml = "";
                  }
                }
                htmlList =
                  "<tr " +
                  classStr +
                  " >" +
                  "<td>" +
                  tbHtml +
                  "</td>" +
                  "<td>" +
                  id +
                  "</td>" +
                  "<td>" +
                  stock_name +
                  "/" +
                  stock_code +
                  cfdName +
                  "" +
                  diyanHtml +
                  "</td>" +
                  // '<td>' + stock_code + '</td>' +
                  // '<td>' + market_name + '</td>' +
                  "<td>" +
                  cmdName +
                  "</td>" +
                  '<td class="profit_' +
                  id +
                  '">' +
                  close_profit_html +
                  "</td>" +
                  // '<td>' + init_margin.toFixed(3) + '</td>' +
                  "<td>" +
                  left_volume +
                  "</td>" +
                  "<td>" +
                  open_price.toFixed(3) +
                  "</td>" +
                  '<td class="now_price_' +
                  id +
                  '">' +
                  now_price.toFixed(3) +
                  "</td>" +
                  "<td>" +
                  open_time +
                  "</td>" +
                  "</tr>";
                htmlListData.push(htmlList);
              }
              strategy.page_count = page_count;
              if (htmlListData.length > 0) {
                $("#current-strategy-list tbody").html(htmlListData.join(""));
                if (page_count > 0) {
                  if (!t.pagination.load) {
                    t.createPagination1(page_count);
                  } else {
                    if (page_count != t.pagination.pageCount) {
                      t.createPagination1(page_count, params.page_no); //页码变化，重新初始整个分页
                    }
                  }
                }
              }
            } else {
              $("#current-strategy-list tbody").html(
                '<tr class="tr-bg"><td colspan="11">暂无数据</td></tr>'
              );
            }
          }
        }
      });
    },
    //止盈止损
    adjustmentTrigger: function () {
      $(".current-strategy-list").on("click", ".zhiyzhis", function () {
        var index = $(this).attr("data-type");
        if (strategy.organ.tp_sl_witch == "0") {
          $(".tp_sl_witch-00").css({ display: "block" });
          $(".tp_sl_witch-11").css({ display: "none" });
        } else {
          $(".tp_sl_witch-11").css({ display: "block" });
          $(".tp_sl_witch-00").css({ display: "none" });
        }
        strategy.policy_id = strategy.mc_list[index].id;
        $(".gpmc-dm span").text(
          strategy.mc_list[index].stock_name +
          "/" +
          strategy.mc_list[index].stock_code
        );
        $(".zhiying-t-0 input").val(strategy.mc_list[index].tp_money);
        $(".zhishui-t-0 input").val(strategy.mc_list[index].sl_money);
        $(".zhiying-t-1 input").val(strategy.mc_list[index].tp);
        $(".zhishui-t-1 input").val(strategy.mc_list[index].sl);
        $(".zhiying-zhishui-box,.bg").show();
      });
      $(".quxiao,.bg").click(function () {
        $(".zhiying-zhishui-box,.bg").hide();
      });
    },
    //止盈止损提交
    confirmA: function () {
      $("#zhi-but").click(function () {
        ajaxPost({
          url: "/v1_home/orderpolicy/updatetpsl",
          data: {
            tp_money: $.trim($(".zhiying-t-0 input").val()),
            sl_money: $.trim($(".zhishui-t-0 input").val()),
            tp: $.trim($(".zhiying-t-1 input").val()),
            sl: $.trim($(".zhishui-t-1 input").val()),
            id: strategy.policy_id
          },
          success: function (res) {
            if (res.code == "200") {
              utils.toast("调整成功");
              var data = { page_no: strategy.page_no };
              strategy.getMyList(data);
              $(".zhiying-zhishui-box,.bg").hide();
            } else {
              utils.toast(res.msg);
            }
          }
        });
      });
    },
    //关闭递延
    //关闭递延
    deferredClosure: function () {
      var index = 0;
      $(".current-strategy-list").on("click", ".guanbidiyan", function () {
        index = $(this).attr("data-type");
        var height = $(".guanbi-diyan").height();
        $(".guanbi-diyan").css({ top: "50%", "margin-top": -height / 2 });
        $(".guanbi-diyan,.bg").show();
        $(".guanbi-diyan p").text(
          "将会在" + strategy.mc_list[index].policy_delay_time
        );
      });
      $(".quxiao-but,.bg").click(function () {
        $(".guanbi-diyan,.bg").hide();
      });
      //关闭递延确认
      $(".guanbi-diyan").on("click", "#diyan-but", function () {
        ajaxPost({
          url: "/v1_home/orderpolicy/closeaotodelay",
          data: { id: strategy.mc_list[index].id },
          success: function (res) {
            if (res.code == "200") {
              utils.toast(res.msg);
              $(".guanbi-diyan,.bg").hide();
              var data = { page_no: strategy.page_no };
              strategy.getMyList(data);
            } else {
              utils.toast(res.msg);
            }
          }
        });
      });
    },
    //卖出弹框
    sellOutFn: function () {
      var height = $(".projectileFrame").height();
      $(".projectileFrame").css({ top: "50%", "margin-top": -height / 2 });
      $(".current-strategy-list").on("click", ".maichu", function () {
        var index = $(this).attr("data-type");
        var cmd = $(this).attr("data-cmd");
        if (cmd == "0") {
          if (
            strategy.mc_list[index].market_id == "6" ||
            strategy.mc_list[index].market_id == "7" ||
            strategy.mc_list[index].market_id == "8" ||
            strategy.mc_list[index].market_id == "9" ||
            strategy.mc_list[index].market_id == "10"
          ) {
            // $('.zhishao').text('(至少卖' + strategy.mc_list[index].sell_min_limit + '手)');
            $(".mcsl input").val(
              strategy.mc_list[index].left_volume /
              strategy.mc_list[index].lots_size
            );
          } else {
            // $('.zhishao').text('(至少卖' + strategy.mc_list[index].sell_min_limit + '股)');
            $(".mcsl input").val(strategy.mc_list[index].left_volume);
          }
        }
        if (cmd == "1") {
          if (
            strategy.mc_list[index].market_id == "6" ||
            strategy.mc_list[index].market_id == "7" ||
            strategy.mc_list[index].market_id == "8" ||
            strategy.mc_list[index].market_id == "9" ||
            strategy.mc_list[index].market_id == "10"
          ) {
            $(".zhishao").text(
              "(至少买" + strategy.mc_list[index].sell_min_limit + "手)"
            );
            $(".mcsl input").val(
              strategy.mc_list[index].left_volume /
              strategy.mc_list[index].lots_size
            );
          } else {
            $(".zhishao").text(
              "(至少买" + strategy.mc_list[index].sell_min_limit + "股)"
            );
            $(".mcsl input").val(strategy.mc_list[index].left_volume);
          }
        }
        strategy.policy_id = strategy.mc_list[index].id;
        strategy.suspend_status = strategy.mc_list[index].suspend_status;
        $(".sell-out-box,.bg").fadeIn();
        $(".gumc span").text(
          strategy.mc_list[index].stock_name +
          "/" +
          strategy.mc_list[index].stock_code
        );
        $(".zxjg span").text(strategy.mc_list[index].now_price);
      });
      $(".quxiao,.bg").click(function () {
        $(".sell-out-box,.bg").fadeOut();
      });
    },
    //卖出提交
    sellOutSubmitFn: function () {
      $("#queren").click(function () {
        ajaxPost({
          url: "/v1_home/policy/sell",
          data: {
            policy_id: strategy.policy_id,
            volume: $(".mcsl input").val(),
            suspend_status: strategy.suspend_status
          },
          success: function (res) {
            if (res.code == "200") {
              utils.toast("卖出成功");
              $(".sell-out-box,.bg").fadeOut();
              var data = { page_no: strategy.page_no };
              strategy.getMyList(data);
            } else {
              var msg = res.msg || "卖出失败";
              utils.toast(msg);
            }
          }
        });
      });
    },
    //策略列表切换
    siblingsTapFn: function () {
      var t = $(this);
      $(".strategy-tab li").click(function () {
        var index = $(this).index();
        $(this)
          .addClass("active")
          .siblings()
          .removeClass("active");
        $(".table-strategy-list")
          .eq(index)
          .show()
          .siblings()
          .hide();
        if (index == "0") {
          strategy.getMyList({
            page_size: t.page_size,
            page_no: 1
          });
          strategy.refreshMyList();
        }
        if (index == "1") {
          strategy.getMyhistory({
            page_size: t.page_size,
            page_no: 1
          });
          $(".pagination-wrap").show();
          strategy.stopRefreshMylist();
        }
      });
    },
    refreshMyList: function () {
      if (
        strategy.yuming == "liangrong-fund.com" ||
        strategy.yuming == "boloniasia.com" ||
        strategy.yuming == "raytekasia.com" ||
        strategy.yuming == "acarpsgroup.com"
      ) {
        //刷新mylist
        strategy.refreshMyListForRay();
      } else {
        var count = 0;
        strategy.timer111 = setInterval(function () {
          count++;
          var data = { page_no: strategy.page_no };
          var type = $(".title").attr("data-type");
          if (type == "1" && document.getElementById("dingshiid")) {
            // strategy.getMyList(data)
            strategy.getUpdateData();
          } else {
            window.clearInterval(strategy.timer111);
          }
          if (count > 200) {
            count = 0;
            window.clearInterval(strategy.timer111);
            strategy.getMyList(data);
            strategy.refreshMyList();
          }
        }, 10000);
      }
    },
    getUpdateData: function () {
      ajaxPost({
        url: "/v1_home/stock/price",
        data: {
          stock_key: strategy.stock_key
        },
        success: function (res) {
          //console.log(res);
          //console.log(strategy);
          if (res.code == 200) {
            var quote = 0;
            for (var i = 0; i < strategy.localList.length; i++) {
              for (var j = 0; j < res.data.length; j++) {
                if (
                  res.data[j].stock_name == strategy.localList[i].stock_name
                ) {
                  //获取报价,计算报价
                  if (strategy.localList[i].cmd == 0) {
                    quote =
                      (res.data[j].now_price -
                        Number(strategy.localList[i].open_price)) *
                      Number(strategy.localList[i].left_volume) *
                      Number(strategy.localList[i].pip_value);
                  } else {
                    quote =
                      (Number(strategy.localList[i].open_price) -
                        res.data[j].now_price) *
                      Number(strategy.localList[i].left_volume) *
                      Number(strategy.localList[i].pip_value);
                  }
                  // console.info('cmd:'+strategy.localList[i].cmd)
                  // console.info('('+res.data[j].now_price+'-'+Number(strategy.localList[i].open_price)+')'+'*'+Number(strategy.localList[i].left_volume)+'*'+Number(strategy.localList[i].pip_value)+'='+quote.toFixed(3))
                  //更新当前价
                  $(".now_price_" + strategy.localList[i].id).text(
                    res.data[j].now_price
                  );
                  //更新盈亏
                  $(".profit_" + strategy.localList[i].id).text(
                    quote.toFixed(3)
                  );
                  if (quote.toFixed(3) > 0) {
                    $(".profit_" + strategy.localList[i].id).css({
                      color: "#28F064"
                    });
                  } else {
                    $(".profit_" + strategy.localList[i].id).css({
                      color: "#FF0000"
                    });
                  }
                }
              }
            }
          }
        }
      });
    },
    refreshMyListForRay: function () {
      //两融大师，bolo,ray,aca刷新时间通过获取后台配置
      var count = 0;
      var time = 8000;
      ajaxPost({
        url: "/v1_home/activenavigate/list",
        success: function (res) {
          // console.info("111111");
          if (res.code === 200) {
            time = Number(res.data.time_t) * 1000;
            strategy.timer111 = setInterval(function () {
              count++;
              var data = { page_no: strategy.page_no };
              var type = $(".title").attr("data-type");
              if (type == "1" && document.getElementById("dingshiid")) {
                // strategy.getMyList(data)
                strategy.getUpdateData();
              } else {
                window.clearInterval(strategy.timer111);
              }
              if (count > 200) {
                //如果刷新次数达到200次，需重新获取Mylist数据与参数
                count = 0;
                window.clearInterval(strategy.timer111);
                strategy.getMyList(data);
                strategy.refreshList();
              }
            }, time);
          }
        }
      });
    },
    refreshDetail: function () {
      strategy.timerTf = false;
      if (
        strategy.yuming == "liangrong-fund.com" ||
        strategy.yuming == "boloniasia.com" ||
        strategy.yuming == "raytekasia.com" ||
        strategy.yuming == "acarpsgroup.com"
      ) {
        var count = 0;
        var time = 8000;
        ajaxPost({
          url: "/v1_home/activenavigate/list",
          success: function (res) {
            if (res.code === 200) {
              time = Number(res.data.detail_time_t) * 1000;
              strategy.timer222 = setInterval(function () {
                count++;
                var type = $(".title").attr("data-type");
                if (type == "1" && document.getElementById("dingshiid")) {
                  strategy.getDetails();
                } else {
                  window.clearInterval(strategy.timer222);
                }
                if (count > 200) {
                  //如果刷新次数达到200次，需重新获取参数
                  count = 0;
                  window.clearInterval(strategy.timer222);
                  strategy.refreshDetail();
                }
              }, time);
            }
          }
        });
      } else {
        strategy.timer222 = setInterval(function () {
          var type = $(".title").attr("data-type");
          if (type == "1" && document.getElementById("dingshiid")) {
            strategy.getDetails();
            strategy.numberofShares();
            strategy.serviceChargeFn();
            strategy.deferredChargeFn();
            strategy.totalFn();
            strategy.stopLossAndStoplossFn();
            strategy.chufazhiying();
            strategy.chufazhishui();
          } else {
            window.clearInterval(strategy.timer222);
          }
        }, 1000);
      }
    },
    stopRefreshMylist: function () {
      //console.info('停止刷新mylist')
      window.clearInterval(strategy.timer111);
    },
    //获取结算策略
    getMyhistory: function (params) {
      var t = this;
      var page_noa = "1";
      if (params) {
        page_noa = params.page_no;
      }
      ajaxPost({
        url: "/v1_home/policy/myhistory",
        data: {
          page_no: page_noa,
          page_size: strategy.page_size
        },
        success: function (res) {
          if (res.code == "200") {
            var list = res.data.page_data,
              htmlList,
              htmlListData = [],
              page_count = res.data.page.page_count;
            strategy.js_list = list;
            if (list.length > 0) {
              for (var i = 0; i < list.length; i++) {
                var classStr = i % 2 == 0 ? 'class="tr-bg"' : "",
                  id = list[i].id || "",
                  stock_name = list[i].stock_name || "",
                  stock_code = list[i].stock_code || "",
                  init_margin = Number(list[i].init_margin).toFixed(3) || "",
                  volume = list[i].volume || "",
                  open_price = Number(list[i].open_price).toFixed(3) || 0,
                  close_price = Number(list[i].close_price).toFixed(3) || 0,
                  close_profit = Number(list[i].close_profit).toFixed(3) || 0,
                  huoli = Number(list[i].huoli).toFixed(3) || "",
                  open_time = list[i].open_time || "",
                  cmdName = list[i].cmd == "1" ? "空头合约" : "多头合约",
                  close_time = list[i].close_time || "",
                  market_name = "";
                var domain = document.domain;
                var firstDomain = domain.substring(
                  domain.indexOf(".") + 1,
                  domain.length
                );
                var cfdName = "";
                if (list[i].stock_type == "1") {
                  cfdName = "(指数.)";
                }
                if (list[i].stock_type == "2") {
                  cfdName = "(指数)";
                }
                if (firstDomain == "dingmaohongsheng.com") {
                  open_time = open_time.substring(0, 16);
                  close_time = close_time.substring(0, 16);
                }
                if (firstDomain == "liangrong-fund.com") {
                  cmdName = list[i].cmd == "1" ? "融券买跌" : "融资买涨";
                }
                strategy.market_type.map(function (item) {
                  if (item.key == list[i].market_id) {
                    market_name = item.name;
                  }
                });
                htmlList =
                  "<tr " +
                  classStr +
                  " >" +
                  "<td>" +
                  id +
                  "</td>" +
                  "<td>" +
                  stock_name +
                  "/" +
                  stock_code +
                  cfdName +
                  "</td>" +
                  // '<td>' + stock_code + '</td>' +
                  "<td>" +
                  market_name +
                  "</td>" +
                  "<td>" +
                  cmdName +
                  "</td>" +
                  // '<td>' + init_margin + '</td>' +
                  "<td>" +
                  volume +
                  "</td>" +
                  "<td>" +
                  open_price +
                  "/" +
                  close_price +
                  "</td>" +
                  // '<td>'+ close_price + '</td>' +
                  "<td>" +
                  huoli +
                  "</td>" +
                  "<td>" +
                  open_time +
                  "</td>" +
                  "<td>" +
                  close_time +
                  "</td>" +
                  '<td><span class="xiangqing" data-type="' +
                  i +
                  '"> <a class="loadPage" href="#page/strategyDetails.html?flagid=' +
                  list[i].id +
                  '&outid=2" data-type="' +
                  i +
                  '">详情</a></span></td>';
                ("</tr>");
                htmlListData.push(htmlList);
              }
              if (htmlListData.length > 0) {
                $("#settlement-strategy-list tbody").html(
                  htmlListData.join("")
                );
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
              $("#settlement-strategy-list tbody").html(
                '<tr class="tr-bg"><td colspan="11">暂无数据</td></tr>'
              );
            }
          }
        }
      });
    },
    //添加分页
    createPagination: function (pageCount, pageNo) {
      var t = this,
        data_pagination = $("#strategy-table-list .pagination"),
        pageNo = pageNo || 1;
      data_pagination.pagination({
        pageCount: pageCount,
        current: pageNo,
        jump: true,
        coping: true,
        homePage: "首页",
        endPage: "末页",
        prevContent: "上页",
        nextContent: "下页",
        callback: function (api) {
          var data = {
            page_no: api.getCurrent(),
            page_size: t.page_size
          };
          t.getMyhistory(data);
        }
      });
      t.pagination.load = true;
      t.pagination.pageCount = pageCount;
    },
    //添加分页
    createPagination1: function (pageCount, pageNo) {
      var t = this,
        data_pagination = $("#strategy-table-list .pagination1"),
        pageNo = pageNo || 1;
      data_pagination.pagination({
        pageCount: pageCount,
        current: pageNo,
        jump: true,
        coping: true,
        homePage: "首页",
        endPage: "末页",
        prevContent: "上页",
        nextContent: "下页",
        callback: function (api) {
          var data = {
            page_no: api.getCurrent(),
            page_size: t.page_size
          };
          t.getMyList(data);
        }
      });
      t.pagination.load = true;
      t.pagination.pageCount = pageCount;
    },
    //股票切换
    sharesTabFn: function () {
      $(".input-name").click(function (event) {
        $(".shares-type-ul").slideToggle();
        $(".search-list").hide();
        event.stopPropagation();
      });
      $(".shares-type-ul").on("click", "li", function () {
        strategy.sharesType = $(this).attr("data-type");
        strategy.sharesListType = $(this).attr("data-type");
        $(this)
          .addClass("active")
          .siblings()
          .removeClass("active");
        $(".input-name").html(
          $(this).text() +
          '<i class="fa fa-angle-down" style="padding-left:5px;"></i>'
        );
        $(".shares-type-ul").slideToggle();
      });
    },
    //获取股票类型
    getSharesType: function () {
      ajaxPost({
        url: "/v1_home/activenavigate/list",
        success: function (res) {
          if (res.code == "200") {
            var data = res.data.value.split(",");
            for (var i = 0; i < data.length; i++) {
              if (data[i] == "0") {
                //console.log("A股");
                strategy.SharesTypeVlaue.push({ key: "0", name: "A股" });
              }
              if (data[i] == "5") {
                //console.log("T+0(融)");
                strategy.SharesTypeVlaue.push({ key: "5", name: "T+0(融)" });
              }
              if (data[i] == "6") {
                //console.log("ETF");
                strategy.SharesTypeVlaue.push({ key: "6", name: "ETF" });
              }
              if (data[i] == "7") {
                //console.log("美股");
                strategy.SharesTypeVlaue.push({ key: "7", name: "美股" });
              }
              if (data[i] == "8") {
                //console.log("港股");
                strategy.SharesTypeVlaue.push({ key: "8", name: "港股" });
              }
              if (data[i] == "9") {
                //console.log("期货");
                strategy.SharesTypeVlaue.push({ key: "9", name: "期货" });
              }
            }
            //console.log(strategy.SharesTypeVlaue);
            //shares-type-ul
            var sHtml,
              sHtmlData = [];
            for (var i = 0; i < strategy.SharesTypeVlaue.length; i++) {
              sHtml =
                '<li data-type="' +
                strategy.SharesTypeVlaue[i].key +
                '">' +
                strategy.SharesTypeVlaue[i].name +
                "</li>";
              sHtmlData.push(sHtml);
            }
            $(".shares-type-ul").html(sHtmlData.join(""));
            $(".shares-type-ul li")
              .eq(0)
              .addClass("active");
          }
        }
      });
    },
    //新增新版添加方法
    //查看行情
    seeEchart: function () {
      $(".see-echart").click(function () {
        $(".ec-tab span")
          .eq(0)
          .addClass("active")
          .siblings()
          .removeClass("active");
        $(".echart-con").toggle();
        $(".ma-box").hide();
        strategy.getfundflowData();
        if (strategy.cleanUp1) {
          strategy.cleanUp1 = false;
          strategy.timer1 = setInterval(function () {
            strategy.tabChartFn("1", strategy.tf);
          }, 60000);
        } else {
          strategy.cleanUp1 = true;
          clearInterval(strategy.timer1);
          clearInterval(strategy.timer2);
        }
        strategy.tabChartFn("1", strategy.tf);
      });
    },
    //获取k线图数据
    getkline: function () {
      $(".text-hide").show();
      var stockCode = null;
      if (
        strategy.yuming == "huachihk.com" ||
        strategy.yuming == "huifengstocks.com"
      ) {
        stockCode = strategy.stock_code || "00001";
      } else if (
        strategy.yuming == "raytekasia.com" ||
        strategy.yuming == "acarpsgroup.com"
      ) {
        stockCode = strategy.stock_code || "510500";
      } else {
        stockCode = strategy.stock_code || "000001";
      }
      var stock_code = strategy.keyword == "" ? stockCode : strategy.keyword;
      ajaxPost({
        url: "/v1_home/quoteday/kline",
        data: {
          keyword: stock_code,
          stock_type: 0,
          market_id: strategy.detailData.market_id
        },
        success: function (res) {
          $(".text-hide").hide();
          if (res.code == "200") {
            strategy.initkChart(2, res.data);
          }
        }
      });
    },
    //k线图
    chartKline: function (data) {
      var that = this;
      that.ma5_1 = strategy.calculateMA(5, data)[5];
      that.ma10_1 = strategy.calculateMA(10, data)[10];
      that.ma20_1 = strategy.calculateMA(20, data)[20];
      that.ma30_1 = strategy.calculateMA(30, data)[30];
      $(".ma5 em").text(that.ma5_1);
      $(".ma10 em").text(that.ma10_1);
      $(".ma20 em").text(that.ma20_1);
      $(".ma30 em").text(that.ma30_1);
      return {
        tooltip: {
          //弹框指示器
          trigger: "axis",
          confine: true,
          axisPointer: {
            type: "cross"
          },
          formatter: function (params, ticket, callback) {
            var color = 'style="color:#fff"';
            var html;
            if (params[0].seriesName == "price") {
              html =
                '<div class="commColor" style="padding:5px;"><div>时间 <span ' +
                color +
                " >" +
                params[0].name +
                "</span></div>";
              html +=
                '<div>开盘价 <span style="color:#FFE131">' +
                params[0].value[1] +
                "</span></div>";
              html +=
                '<div>收盘价 <span style="color:#FFE131">' +
                params[0].value[2] +
                "</span></div>";
              html +=
                "<div>最低价 <span  " +
                color +
                " >" +
                params[0].value[3] +
                "</span></div>";
              html +=
                "<div>最高价 <span  " +
                color +
                " >" +
                params[0].value[4] +
                "</span></div>";
              html +=
                "<div>成交量 <span  " +
                color +
                " >" +
                params[5].value +
                "</span></div></div>";
              $(".ma5 em").text(params[1].value);
              $(".ma10 em").text(params[2].value);
              $(".ma20 em").text(params[3].value);
              $(".ma30 em").text(params[4].value);
            } else {
              html =
                '<div class="commColor" style="padding:5px;"><div>时间 <span ' +
                color +
                " >" +
                params[0].name +
                "</span></div>";
              html +=
                '<div>开盘价 <span style="color:#FFE131">' +
                params[1].value[1] +
                "</span></div>";
              html +=
                '<div>收盘价 <span style="color:#FFE131">' +
                params[1].value[2] +
                "</span></div>";
              html +=
                "<div>最低价 <span  " +
                color +
                " >" +
                params[1].value[3] +
                "</span></div>";
              html +=
                "<div>最高价 <span  " +
                color +
                " >" +
                params[1].value[4] +
                "</span></div>";
              html +=
                "<div>成交量 <span  " +
                color +
                " >" +
                params[0].value +
                "</span></div></div>";
              $(".ma5 em").text(params[2].value);
              $(".ma10 em").text(params[3].value);
              $(".ma20 em").text(params[4].value);
              $(".ma30 em").text(params[5].value);
            }
            return html;
          }
        },
        legend: {
          //图例控件,点击图例控制哪些系列不显示
          show: false
        },
        color: [that.ma5Color, that.ma10Color, that.ma20Color, that.ma30Color],
        axisPointer: {
          show: true,
          link: { xAxisIndex: "all" }
        },
        grid: [
          {
            id: "gd1",
            left: "2%",
            right: "2%",
            height: "60.5%", //主K线的高度,
            top: "5%"
          },
          {
            left: "2%",
            right: "2%",
            top: "74%",
            height: "19%" //交易量图的高度
          }
        ],
        xAxis: [
          {
            type: "category",
            data: data.time,
            scale: true,
            boundaryGap: false,
            axisLine: {
              onZero: false,
              show: false
            },
            axisLabel: {
              show: false
            },
            splitLine: {
              show: false,
              lineStyle: {
                color: "#666"
              }
            },
            splitNumber: 20,
            min: "dataMin",
            max: "dataMax",
            axisTick: {
              show: false
            }
          },
          {
            type: "category",
            gridIndex: 1,
            data: data.time,
            axisLabel: {
              color: "#666",
              fontSize: 10
            },
            axisLine: {
              show: false
            },
            axisTick: {
              show: false
            }
          }
        ],
        yAxis: [
          {
            scale: true,
            z: 4,
            axisLabel: {
              color: "#666",
              inside: true
            },
            splitLine: {
              show: false,
              lineStyle: {
                color: "#666"
              }
            },
            axisLine: {
              show: false
            },
            axisTick: {
              show: false
            }
          },
          {
            min: Math.min.apply(null, data.volume),
            scale: true,
            gridIndex: 1,
            splitNumber: 3,
            z: 4,
            axisLine: {
              onZero: false
            },
            axisTick: {
              show: false
            },
            splitLine: {
              show: false
            },
            axisLabel: {
              color: "#666",
              inside: true,
              fontSize: 12
            },
            axisLine: {
              show: false
            },
            axisTick: {
              show: false
            }
          }
        ],
        animation: true,
        backgroundColor: strategy.bgColor,
        blendMode: "source-over",
        series: [
          {
            name: "price",
            type: "candlestick",
            data: data.data,
            barWidth: "55%",
            large: true,
            largeThreshold: 100,
            itemStyle: {
              normal: {
                color: strategy.upColor,
                color0: strategy.downColor,
                borderColor: strategy.upColor,
                borderColor0: strategy.downColor
              }
            }
          },
          {
            name: "MA5",
            type: "line",
            data: strategy.calculateMA(5, data),
            smooth: true,
            symbol: "none", //隐藏选中时有小圆点
            lineStyle: {
              normal: {
                opacity: 0.8,
                color: strategy.ma5Color,
                width: 1
              }
            }
          },
          {
            name: "MA10",
            type: "line",
            data: strategy.calculateMA(10, data),
            smooth: true,
            symbol: "none",
            lineStyle: {
              //标线的样式
              normal: {
                opacity: 0.8,
                color: strategy.ma10Color,
                width: 1
              }
            }
          },
          {
            name: "MA20",
            type: "line",
            data: strategy.calculateMA(20, data),
            smooth: true,
            symbol: "none",
            lineStyle: {
              opacity: 0.8,
              width: 1,
              color: strategy.ma20Color
            }
          },
          {
            name: "MA30",
            type: "line",
            data: strategy.calculateMA(30, data),
            smooth: true,
            symbol: "none",
            lineStyle: {
              normal: {
                opacity: 0.8,
                width: 1,
                color: strategy.ma30Color
              }
            }
          },
          {
            name: "volume",
            type: "bar",
            xAxisIndex: 1,
            yAxisIndex: 1,
            data: data.volume,
            barWidth: "60%",
            itemStyle: {
              normal: {
                color: function (params) {
                  var colorList;
                  if (
                    data.data[params.dataIndex][1] >
                    data.data[params.dataIndex][0]
                  ) {
                    colorList = strategy.upColor;
                  } else {
                    colorList = strategy.downColor;
                  }
                  return colorList;
                }
              }
            }
          }
        ]
      };
    },
    //K线图
    initkChart: function (val, data) {
      strategy.kChart = echarts.init(document.getElementById("k-line"));
      strategy.kChart.clear();
      if (val === 1) {
        strategy.kChart.setOption(strategy.chartFiash(data));
      } else {
        strategy.kChart.setOption(strategy.chartKline(data));
      }
      strategy.kChart.on("globalout", function (params) {
        $(".ma5 em").text(strategy.ma5_1);
        $(".ma10 em").text(strategy.ma10_1);
        $(".ma20 em").text(strategy.ma20_1);
        $(".ma30 em").text(strategy.ma30_1);
      });
      strategy.kChart.resize();
    },
    //================================MA计算公式
    calculateMA: function (dayCount, data) {
      var result = [];
      for (var i = 0, len = data.time.length; i < len; i++) {
        if (i < dayCount) {
          result.push("-");
          continue;
        }
        var sum = 0;
        for (var j = 0; j < dayCount; j++) {
          sum += data.data[i - j][1];
        }
        result.push((sum / dayCount).toFixed(3));
      }
      return result;
    },
    //获取分时
    getfiash: function () {
      $(".text-hide").show();
      var stockCode = null;
      if (
        strategy.yuming == "huachihk.com" ||
        strategy.yuming == "huifengstocks.com"
      ) {
        stockCode = strategy.stock_code || "00001";
      } else if (
        strategy.yuming == "raytekasia.com" ||
        strategy.yuming == "acarpsgroup.com"
      ) {
        stockCode = strategy.stock_code || "510500";
      } else {
        stockCode = strategy.stock_code || "000001";
      }
      var stock_code = strategy.keyword == "" ? stockCode : strategy.keyword;
      ajaxPost({
        url: "/v1_home/quoteday/fiash",
        data: {
          keyword: stock_code,
          stock_type: 1,
          market_id: strategy.detailData.market_id
        },
        success: function (res) {
          $(".text-hide").hide();
          if (res.code == "200") {
            strategy.initkChart(1, res.data.data);
          }
        }
      });
    },
    //分时图
    chartFiash: function (data) {
      var m_datas = data;
      m_datas.previousClose = [];
      m_datas.yestclose = strategy.detailData.close_price;
      //console.log(data);
      for (var i = 0; i < m_datas.time.length; i++) {
        m_datas.previousClose.push(m_datas.yestclose);
      }
      return {
        tooltip: {
          trigger: "axis",
          confine: true,
          axisPointer: {
            type: "cross",
            label: {
              formatter: function (val) {
                if (typeof val.value == "number") {
                  return val.value.toFixed(3);
                } else {
                  return val.value;
                }
              }
            }
          },
          formatter: function (params, ticket, callback) {
            var i = params[0].dataIndex;
            var color = 'style="color:#fff"';
            var html;
            if (m_datas.price[i] && m_datas.volume[i] !== "0") {
              html =
                '<div class="commColor" style="width:100px;"><div>时间 <span ' +
                color +
                " >" +
                m_datas.time[i] +
                "</span></div>";
              html +=
                '<div>当前价 <span style="color:#FFE131">' +
                m_datas.price[i] +
                "</span></div>";
              // html += '<div>均价 <span style="color:#FFE131">' + m_datas.avgPrice[i] + '</span></div>';
              html +=
                "<div>涨幅 <span  " +
                color +
                " >" +
                strategy.ratioCalculate(m_datas.price[i], m_datas.yestclose) +
                "%</span></div>";
              html +=
                "<div>成交量 <span  " +
                color +
                " >" +
                m_datas.volume[i] +
                "</span></div></div>";
            } else {
              return;
            }
            return html;
          }
        },
        legend: {
          show: false
        },
        axisPointer: {
          show: true,
          link: { xAxisIndex: "all" }
        },
        grid: [
          {
            id: "gd1",
            left: "0%",
            right: "1%",
            height: "67.5%", //主分时线的高度,
            top: "5%"
          },
          {
            id: "gd2",
            left: "0%",
            right: "1%",
            height: "67.5%", //主分时线的高度,
            top: "5%"
          },
          {
            id: "gd3",
            left: "0%",
            right: "1%",
            top: "73%",
            height: "19%" //交易量图的高度
          }
        ],
        xAxis: [
          {
            gridIndex: 0,
            data: m_datas.time,
            axisLabel: {
              show: false
            },
            splitLine: {
              show: false
            },
            axisTick: {
              show: false
            },
            axisLine: { show: false }
          },
          {
            gridIndex: 1,
            data: m_datas.time,
            axisLabel: {
              show: false
            },
            splitLine: {
              show: false
            },
            axisTick: {
              show: false
            },
            axisLine: { show: false }
          },
          {
            splitNumber: 2,
            type: "category",
            gridIndex: 2,
            data: m_datas.time,
            axisLabel: {
              color: "#eee",
              fontSize: 10
            },
            splitLine: {
              show: false
            },
            axisTick: {
              show: false
            },
            axisLine: { show: false }
          }
        ],
        yAxis: [
          {
            gridIndex: 0,
            scale: true,
            splitNumber: 3,
            axisLabel: {
              inside: true,
              color: function (val) {
                if (val == m_datas.yestclose) {
                  return "#eee";
                }
                return val > m_datas.yestclose
                  ? strategy.upColor
                  : strategy.downColor;
              }
            },
            z: 4,
            splitLine: {
              show: false
            },
            axisLine: { show: false },
            axisTick: {
              show: false
            }
          },
          {
            scale: true,
            gridIndex: 1,
            splitNumber: 3,
            position: "right",
            z: 4,
            axisLabel: {
              color: function (val) {
                if (val == m_datas.yestclose) {
                  return "#eee";
                }
                return val > m_datas.yestclose
                  ? strategy.upColor
                  : strategy.downColor;
              },
              inside: true,
              formatter: function (val) {
                var resul = strategy.ratioCalculate(val, m_datas.yestclose);
                return Number(resul).toFixed(3) + " %";
              }
            },
            splitLine: {
              show: false,
              lineStyle: {
                color: "#181a23"
              }
            },
            axisPointer: {
              show: true,
              label: {
                formatter: function (params) {
                  //计算右边Y轴对应的当前价的涨幅比例
                  var increase = strategy.ratioCalculate(
                    params.value,
                    m_datas.yestclose
                  );
                  return Number(increase).toFixed(3) + "%";
                }
              }
            },
            axisLine: { show: false },
            axisTick: {
              show: false
            }
          },
          {
            //交易图
            gridIndex: 2,
            z: 4,
            splitNumber: 3,
            axisLine: {
              onZero: false
            },
            axisTick: {
              show: false
            },
            splitLine: {
              show: false
            },
            axisLabel: {
              color: "#c7c7c7",
              inside: true,
              fontSize: 8
            },
            axisLine: { show: false }
          }
        ],
        animation: true,
        backgroundColor: strategy.bgColor,
        blendMode: "source-over",
        series: [
          {
            name: "当前价",
            type: "line",
            data: m_datas.price,
            smooth: true,
            symbol: "circle", //中时有小圆点
            itemStyle: {
              normal: {
                color: "#39afe6"
              }
            },
            lineStyle: {
              normal: {
                opacity: 0.8,
                color: "#39afe6",
                width: 1
              }
            },
            areaStyle: {
              normal: {
                color: new echarts.graphic.LinearGradient(
                  0,
                  0,
                  0,
                  1,
                  [
                    {
                      offset: 0,
                      color: "rgba(0, 136, 212, 0.7)"
                    },
                    {
                      offset: 0.8,
                      color: "rgba(0, 136, 212, 0.02)"
                    }
                  ],
                  false
                ),
                shadowColor: "rgba(0, 0, 0, 0.1)",
                shadowBlur: 10
              }
            }
          },
          // {
          //   name: '均价',
          //   type: 'line',
          //   data: m_datas.avgPrice,
          //   smooth: true,
          //   symbol: "circle",
          //   itemStyle:{
          //     normal:{
          //       color:'rgba(224, 140, 44,1)',
          //     }
          //   },
          //   lineStyle: {
          //     normal: {
          //       color: 'rgba(224, 140, 44,1)',
          //       width: 1
          //     }
          //   }
          // },
          {
            name: "昨收价",
            type: "line",
            data: m_datas.previousClose,
            symbol: "none",
            smooth: true,
            gridIndex: 2,
            xAxisIndex: 2,
            yAxisIndex: 2,
            lineStyle: {
              normal: {
                width: 0,
                type: "dashed",
                color: "#969696"
              }
            }
          },
          {
            type: "line",
            data: m_datas.price,
            smooth: true,
            symbol: "none",
            gridIndex: 1,
            xAxisIndex: 1,
            yAxisIndex: 1,
            lineStyle: {
              //标线的样式
              normal: {
                width: 0
              }
            }
          },
          {
            name: "Volumn",
            type: "bar",
            gridIndex: 2,
            xAxisIndex: 2,
            yAxisIndex: 2,
            data: m_datas.volume,
            barWidth: "100%",
            itemStyle: {
              normal: {
                color: function (params) {
                  var colorList;
                  if (
                    m_datas.price[params.dataIndex] >
                    m_datas.price[params.dataIndex - 1]
                  ) {
                    colorList = strategy.upColor;
                  } else {
                    colorList = strategy.downColor;
                  }
                  return colorList;
                }
              }
            }
          }
        ]
      };
    },
    //分时计算
    ratioCalculate: function (price, yclose) {
      return (((price - yclose) / yclose) * 100).toFixed(3);
    },
    //触发止盈
    chufazhiying: function () {
      //console.log(strategy.tp_rate);
      var data = strategy.tp_rate.split(","),
        zhiyingData = [],
        zhiyingjia = 0;
      if (data.length == 1 && data[0] == 0) {
        $(".zhiying").hide();
        strategy.tp_money = 0;
        return;
      } else {
        $(".zhiying").show();
      }
      for (var i = 0; i < data.length; i++) {
        zhiyingjia =
          Number(data[i]) * Number($.trim($('.bond [name="bond"]').val()));
        zhiyingData.push(parseInt(zhiyingjia));
      }
      var zhiyingHtml = [],
        zhiyingHtmlData = [];
      for (var i = 0; i < zhiyingData.length; i++) {
        zhiyingHtmlData = "<span>" + zhiyingData[i] + "</span>";
        zhiyingHtml.push(zhiyingHtmlData);
      }
      $(".zhiying-list").html(zhiyingHtml.join(""));
      $(".zhiying-list span")
        .eq(0)
        .addClass("active")
        .siblings()
        .removeClass("active");
      strategy.tp_money = $(".zhiying-list span")
        .eq(0)
        .text();
      //止盈价点击
      $(".zhiying-list").on("click", "span", function () {
        $(this)
          .addClass("active")
          .siblings()
          .removeClass("active");
        strategy.tp_money = $(this).text();
      });
    },
    //触发止损
    chufazhishui: function () {
      var data = strategy.sl_rate.split(","),
        zhishuiData = [],
        zhishuijia = 0;
      if (data.length == 1 && data[0] == 0) {
        strategy.sl_money = 0;
        $(".zhishui").hide();
        return;
      } else {
        $(".zhishui").show();
      }
      for (var i = 0; i < data.length; i++) {
        zhishuijia =
          Number(data[i]) * Number($.trim($('.bond [name="bond"]').val()));
        zhishuiData.push(parseInt(zhishuijia));
      }
      var zhishuiHtml = [],
        zhishuiHtmlData = [];
      for (var i = 0; i < zhishuiData.length; i++) {
        zhishuiHtmlData = "<span>-" + zhishuiData[i] + "</span>";
        zhishuiHtml.push(zhishuiHtmlData);
      }
      $(".zhishui-list").html(zhishuiHtml.join(""));
      $(".zhishui-list span")
        .eq(0)
        .addClass("active")
        .siblings()
        .removeClass("active");
      strategy.sl_money = $(".zhishui-list span")
        .eq(0)
        .text();
      //止盈价点击
      $(".zhishui-list").on("click", "span", function () {
        $(this)
          .addClass("active")
          .siblings()
          .removeClass("active");
        strategy.sl_money = $(this).text();
        //console.log(strategy.sl_money);
      });
    },
    //f10切换
    f10Tab: function () {
      $(".f10-box-tab").on("click", "li", function () {
        var index = $(this).index();
        $(this)
          .addClass("active")
          .siblings()
          .removeClass("active");
        $(".f10-ul-box dd")
          .eq(index)
          .show()
          .siblings()
          .hide();
        if (index === 1) {
          strategy.gettrademsg();
        }
        if (index === 0) {
          strategy.getfundflowData();
        }
      });
    },
    //盘口
    getfundflowData: function () {
      var stockCode = strategy.stock_code || "000001";
      var stock_code = strategy.keyword == "" ? stockCode : strategy.keyword;
      ajaxPost({
        url: "/v1_home/stock/fundflow",
        data: { keywords: stock_code },
        success: function (res) {
          if (res.code == "200") {
            $(".f10-box").show();
            strategy.fundflowData = res.data.page_data;
            strategy.initChart(res.data.page_data);
            strategy.initChart1(res.data.page_data);
            $(".span-22").text(Number(res.data.page_data.zhu_in).toFixed(3));
            $(".span-33").text(Number(res.data.page_data.zhu_out).toFixed(3));
            $(".span-44").text(Number(res.data.page_data.san_in).toFixed(3));
            $(".span-55").text(Number(res.data.page_data.san_out).toFixed(3));
            $(".span1-22").text(
              Number(res.data.page_data.sandan_flow).toFixed(3)
            );
            $(".span1-33").text(
              Number(res.data.page_data.xiaoda_flow).toFixed(3)
            );
            $(".span1-44").text(
              Number(res.data.page_data.dadan_flow).toFixed(3)
            );
            $(".span1-55").text(
              Number(res.data.page_data.teda_flow).toFixed(3)
            );
          } else {
            $(".f10-box").hide();
          }
        }
      });
    },
    //饼图
    timeharing: function (data) {
      return {
        title: {
          text: "主力、散户资金流向",
          x: "center",
          textStyle: {
            color: "#969696",
            fontSize: 20
          }
        },
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b} : {c} ({d}%)"
        },
        legend: {
          left: "center",
          top: "10%",
          itemWidth: 15,
          itemHeight: 10,
          textStyle: {
            color: "#969696",
            fontSize: 12
          },
          data: ["主力买入", "主力卖出", "散户买入", "散户卖出"]
        },
        color: ["#28F064", "#FF1E3C", "#FFE131", "#39afe6"],
        series: [
          {
            name: "资金流向",
            type: "pie",
            radius: "55%",
            center: ["50%", "56%"],
            data: [
              {
                value: Number(Number(data.zhu_in).toFixed(3)),
                name: "主力买入"
              },
              {
                value: Number(Number(data.zhu_out).toFixed(3)),
                name: "主力卖出"
              },
              {
                value: Number(Number(data.san_in).toFixed(3)),
                name: "散户买入"
              },
              {
                value: Number(Number(data.san_out).toFixed(3)),
                name: "散户卖出"
              }
            ],
            itemStyle: {
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: "rgba(0, 0, 0, 0.5)"
              }
            }
          }
        ]
      };
    },
    //分时图
    initChart: function (data) {
      strategy.handicapChart = echarts.init(
        document.getElementById("m-handicap")
      );
      strategy.handicapChart.setOption(strategy.timeharing(data));
      strategy.handicapChart.resize();
    },
    timeharing1: function (data) {
      return {
        title: {
          text: "分类资金净流入额",
          x: "center",
          textStyle: {
            color: "#969696",
            fontSize: 20
          }
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "shadow"
          }
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "27%",
          containLabel: true
        },
        xAxis: [
          {
            type: "category",
            data: ["散单", "小单", "大单", "特大单"],
            axisTick: {
              alignWithLabel: true
            },
            axisLabel: {
              color: "#9b9da9",
              fontSize: 12
            },
            axisTick: {
              show: false
            },
            splitLine: {
              show: false
            }
          }
        ],
        yAxis: [
          {
            type: "value",
            axisLabel: {
              show: false
            },
            splitLine: {
              show: false
            },
            axisTick: {
              show: false
            },
            axisLine: {
              show: false
            }
          }
        ],
        series: [
          {
            name: "",
            type: "bar",
            barWidth: "70%",
            data: [
              Number(Number(data.sandan_flow).toFixed(3)),
              Number(Number(data.xiaoda_flow).toFixed(3)),
              Number(Number(data.dadan_flow).toFixed(3)),
              Number(Number(data.teda_flow).toFixed(3))
            ],
            itemStyle: {
              normal: {
                color: function (params) {
                  let upColor = "";
                  if (params.data > 0) {
                    upColor = "#FF1E3C";
                    return upColor;
                  } else {
                    upColor = "#28F064";
                    return upColor;
                  }
                }
              }
            }
          }
        ]
      };
    },
    //分时图
    initChart1: function (data) {
      strategy.pillarChart = echarts.init(document.getElementById("m-pillar"));
      strategy.pillarChart.setOption(strategy.timeharing1(data));
      strategy.pillarChart.resize();
    },
    newsTabFn: function () {
      $(".news-tab").on("click", "li", function () {
        var index = $(this).index();
        $(this)
          .addClass("active")
          .siblings()
          .removeClass("active");
        $(".news-tab-box-s")
          .eq(index)
          .show()
          .siblings()
          .hide();
      });
    },
    //获取资讯
    gettrademsg: function () {
      var stockCode = strategy.stock_code || "000001";
      ajaxPost({
        url: "/v1_home/stock/trademsg",
        data: { stock_code: stockCode },
        success: function (res) {
          if (res.code == "200") {
            strategy.htmlData = res.data;
            strategy.htmlCon = strategy.htmlData.trade_tip;
            $(".news-tab-box1").html(strategy.htmlCon);
            $(".news-tab-box2").html(strategy.htmlData.invest);
            var htmlB = [],
              html;
            for (var i = 0; i < strategy.htmlData.great_hits.length; i++) {
              html =
                '<a class="loadPage" href="#page/newsDetail.html?flagid=' +
                strategy.htmlData.great_hits[i].id +
                '">' +
                strategy.htmlData.great_hits[i].title +
                "</a>";
              htmlB.push(html);
            }
            if (htmlB.length > 0) {
              $(".news-tab-box3").html(htmlB.join(""));
            } else {
              $(".news-tab-box3").html('<div class="zw">暂无数据</div>');
            }
          }
        }
      });
    },
    // 获取股票和cfd类型导航
    getnavList: function () {
      ajaxPost({
        url: "/v1_home/activenavigate/list",
        success: function (res) {
          if (res.code == "200") {
            var navListData = res.data.value.split(",");
            for (let i = 0; i < navListData.length; i++) {
              if (
                navListData[i] == "6" ||
                navListData[i] == "7" ||
                navListData[i] == "8" ||
                navListData[i] == "10"
              ) {
                $(".gupian-a").show();
              }
              if (navListData[i] == "13") {
                //指数点
                $(".zhishu-type1").show();
                $(".tab-type-box").show();
              }
              if (navListData[i] == "12") {
                //指数
                $(".zhishu-type2").show();
                $(".tab-type-box").show();
              }
            }
          }
        }
      });
    }
  };
  strategy.init();
})(jQuery);
