//@ sourceURL=recharge.js

(function ($) {
  var recharge = {
    channel_id: "",
    type: "",
    max: "",
    min: "",
    listData: [],
    microcodeType: null,
    url: "",
    time: "",
    seconds: 91,
    moneyA: "",
    init: function () {
      this.getCashdesk();
      this.getRadio();
      this.rechargeSubmit();
      this.selectedFn();
      this.microcodeSubmissionFn();
      this.showTextByDomain();
    },
    showTextByDomain: function () {
      var domain = document.domain;
      var firstDomain = domain.substring(
        domain.indexOf(".") + 1,
        domain.length
      );
      if (firstDomain == "boloniasia.com" || firstDomain == "raytekasia.net") {
        $("#infoshow").show();
      } else {
        $("#infoshow").hide();
      }
      if (
        (firstDomain == "zhongtaimarket.com" || firstDomain == "localhost") &&
        this.type == "6"
      ) {
        $("#off_line_show").show();
      } else {
        $("#off_line_show").hide();
      }
      if (firstDomain == "huifengstocks.com" || firstDomain == "huachihk.com") {
        $(".money").text("金额(HK$)");
      } else {
        $(".money").text("金额(￥)");
      }
    },
    getCashdesk: function () {
      var t = this;
      ajaxPost({
        url: "/v1_home/pay/cashdesk2",
        success: function (res) {
          if (res.code == "200") {
            var list = res.data.content;
            recharge.listData = list;
            var id = "",
              list_len = list.length,
              payList = [],
              channel_name = "",
              rate = "",
              max = "",
              min = "",
              type = "";
            for (var i = 0; i < list_len; i++) {
              channel_id = list[i].id;
              channel_name = list[i].name;
              rate = list[i].rate;
              max = list[i].max;
              min = list[i].min;
              type = list[i].type;
              if (channel_name == null) {
                channel_name = "";
              }
              payList.push(
                '<div class="c-radio-item"><input id="' +
                channel_id +
                '" class="c-radio-icon" type="radio" name="pay" value="' +
                channel_id +
                '" data-rate="' +
                rate +
                '" data-max="' +
                max +
                '" data-min="' +
                min +
                '" data-demo="' +
                type +
                '" data-index="' +
                i +
                '" /><label class="channel" for="' +
                channel_id +
                '">' +
                channel_name +
                "</label></div>"
              );
            }
            $(".c-radio").on("click", ".c-radio-icon", function (e) {
              t.channel_id = $(this).val();
              $(".rate").text($(this).attr("data-rate"));
              $(".max").text($(this).attr("data-max"));
              $(".min").text($(this).attr("data-min"));
              t.type = $(this).attr("data-demo");
              t.max = Number($(this).attr("data-max"));
              t.min = Number($(this).attr("data-min"));
              $("#depositLimit").show();
              var clickId = t.channel_id;
              var index = 0;
              for (var k = 0; k < list_len; k++) {
                if (list[k].id == clickId) {
                  index = k;
                  break;
                }
              }
              var bankList = list[index].banks,
                bankListLen = bankList.length,
                j = 0,
                bankTempList = [];
              // console.log(bankList);
              for (; j < bankListLen; j++) {
                bank_url = bankList[j].logo;
                bankTempList.push(
                  '<li bid="' +
                  bankList[j].id +
                  '"><div class="img"><img src="' +
                  bank_url +
                  '" alt="" /></div></li>'
                );
              }
              $(".deposit-bank-list").html(bankTempList.join(""));
              //							$('.deposit-bank-list li').eq(0).addClass('active');
              $("#bank_name").val(bankList[0]);
              if ($(this).attr("data-demo") == "6") {
                t.showTextByDomain();
              }
              var dataIndex = $(this).attr("data-index");
              if ($(this).attr("data-demo") == "3") {
                var moneyHtml = [];
                if (recharge.listData[dataIndex].set_money.length > 0) {
                  for (
                    var i = 0;
                    i < recharge.listData[dataIndex].set_money.length;
                    i++
                  ) {
                    moneyHtml.push(
                      "<span>" +
                      recharge.listData[dataIndex].set_money[i] +
                      "</span>"
                    );
                  }
                }
                $(".choice-money").html(moneyHtml.join(""));
                $(".weimazhifu").show();
                $("#rechargeSubmit1").show();
                $("#rechargeSubmit").hide();
              } else {
                $(".weimazhifu").hide();
                $("#rechargeSubmit").show();
                $("#rechargeSubmit1").hide();
              }
            });
            $("#rechargeForm .paylist").html(payList.join(""));
            $(".deposit-bank-list").on("click", "li", function () {
              $(this).addClass("active").siblings().removeClass("active");
              var bid = $(this).attr("bid");
              $("#bank_name").val(bid);
            });
          }
        },
      });
    },
    getRadio: function () {
      var t = this;
      //			$('.c-radio').on('click', '.c-radio-icon', function(e) {
      //				t.channel_id = $(this).val();
      //				$('.rate').text($(this).attr('data-rate'));
      //				$('.max').text($(this).attr('data-max'));
      //				$('#depositLimit').show();
      //				var clickId = t.channel_id;
      //				var index = 0;
      //				for(var k = 0; k < list_len; k++) {
      //					if(list[k].id == clickId) {
      //						index = k;
      //						break;
      //					}
      //				}
      //			});
    },
    rechargeSubmit: function () {
      var t = this;

      $("#rechargeSubmit").click(function () {
        let $form = $("#rechargeForm");
        let to_money = Number($.trim($form.find('input[name="to_money"]').val()));
        if (to_money == "") {
          return utils.toast("请输入入金金额");
        }
        if (t.channel_id == "") {
          return utils.toast("请选择支付通道");
        }
        if (to_money < t.min) {
          return utils.toast(`充值金额下限：${t.min}，请重新输入`);
        }
        if (to_money > t.max) {
          return utils.toast(`充值金额上限：${t.max}，请重新输入`);
        }

        if (t.type == 6) {
          window.location.href = `#page/offLineTrans.html?money=${to_money}&channel_id=${t.channel_id}`;
          window.location.reload();
        } else {
          // var $form = $("#rechargeForm"),
          //   to_money = $.trim($form.find('input[name="to_money"]').val()),
          ($t = $(this)), (success_url = "");

          ajaxPost({
            url: "/v1_home/pay/preorder",
            async: false,
            data: {
              channel_id: t.channel_id,
              money: to_money,
              bank_code: $("#bank_name").val(),
            },
            success: function (res) {
              if (res.code == "200") {
                success_url = res.data.content.url;
                $t.attr("href", success_url);
                utils.dialog({
                  title: "提示",
                  temp:
                    '<div class="msg"></div>\
										<div class="c-dialog-btns" id="payStatus">\
											<a class="commit-btn loadPage" href="#page/detail.html">成功</a>\
											<a class="cancel-btn loadPage" href="#page/detail.html">失败</a>\
										</div>',
                  commitFn: function ($dialog) {
                    $dialog.remove();
                  },
                  cancelFn: function ($dialog) {
                    $dialog.remove();
                  },
                });
              } else {
                utils.toast(res.msg);
              }
            },
          });
        }
      });
    },
    selectedFn: function () {
      $(".choice-money").on("click", "span", function () {
        $(this).addClass("active").siblings().removeClass("active");
        $('#rechargeForm input[name="to_money"]').val($(this).text());
      });
      $(".choice-payment-method").on("click", "span", function () {
        $(this).addClass("active").siblings().removeClass("active");
        recharge.microcodeType = $(this).attr("data-type");
      });
    },
    microcodeSubmissionFn: function () {
      $("#rechargeSubmit1").click(function () {
        recharge.seconds = 91;
        var money = $.trim($('#rechargeForm input[name="to_money"]').val());
        recharge.moneyA = (
          Number(money) + Number(Math.random().toFixed(3))
        ).toFixed(3);
        if (money == "") {
          utils.toast("请输入金额或选择入金金额");
          return;
        }
        if (!recharge.microcodeType) {
          utils.toast("请选择支付方式");
          return;
        }
        ajaxPost({
          url: "/v1_home/pay/preorder",
          data: {
            scan_type: recharge.microcodeType,
            channel_id: recharge.channel_id,
            money: recharge.moneyA,
          },
          success: function (res) {
            if (res.code == "200") {
              var url = res.data.content.url;
              recharge.getPaymentQRCode(url, recharge.microcodeType);
              $(".bg").show();
            }
          },
        });
      });
    },
    getPaymentQRCode: function (url, scan_type) {
      $(".wenzitishi").fadeIn();
      $(".wenzitishi").text("提交中，请等候...");
      $(".bg").unbind();
      ajaxPost({
        url: url,
        data: { scan_type: scan_type },
        success: function (res) {
          if (res.code == "200") {
            var money = $.trim($('#rechargeForm input[name="to_money"]').val());
            $(".payment-box").fadeIn();
            $(".payment-content span").text(recharge.moneyA);
            $(".payment-content img").attr("src", res.data.data);
            if (scan_type == "1") {
              $(".payment-content p").text("请用微信扫码支付");
            }
            if (scan_type == "2") {
              $(".payment-content p").text("请用支付宝扫码支付");
            }
            $(".wenzitishi").fadeOut();
            $(".bg,.payment-title i").click(function () {
              $(".count-down").text("");
              $(".payment-box,.wenzitishi,.bg").fadeOut();
              clearTimeout(recharge.time);
            });
            recharge.countDown();
          } else {
            $(".wenzitishi").text(res.msg + " ,请刷新页面，重新下单！");
            $(".bg,.payment-title i").click(function () {
              $(".count-down").text("");
              $(".payment-box,.wenzitishi,.bg").fadeOut();
              clearTimeout(recharge.time);
            });
          }
        },
      });
    },
    countDown: function () {
      this.time = setTimeout(function () {
        recharge.seconds = recharge.seconds - 1;
        if (recharge.seconds === 0) {
          $(".payment-box,.bg").fadeOut();
          $(".count-down").text("");
          clearTimeout(recharge.time);
        } else {
          $(".count-down").text("(" + recharge.seconds + "s)");
          recharge.countDown();
        }
      }, 1000);
    },
  };
  recharge.init();
})(jQuery);
