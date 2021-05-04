//@ sourceURL=recharge.js

(function ($) {
  var offLintTrans = {
    uploading: false,
    channel_id: "",
    money: "",
    img_1: "",
    init: function () {
      this.showTextByDomain();
      this.getMoney();
      this.copyText();
      this.getTransInfo();
      this.fileChange();
      this.upimgFn();
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
      if (firstDomain == "huifengstocks.com" || firstDomain == "huachihk.com") {
        $(".off-line-money").text("应付金额(HK$)");
      } else {
        $(".off-line-money").text("应付金额(￥)");
      }
    },
    getMoney: function () {
      var url = location.href;

      if (url.indexOf("?") != -1) {
        const arr1 = url.split("?");
        const arr2 = arr1[1].split("&");

        const MoneyArr = arr2[0].split("=");
        this.money = MoneyArr[1];

        const channelIdArr = arr2[1].split("=");
        this.channel_id = channelIdArr[1];

        $("#money-value").text(this.money);
      }
    },
    copyText: function () {
      const clipboard = new ClipboardJS(".copy-btn");
      clipboard.on("success", function (e) {
        utils.toast("已成功复制");
        e.clearSelection();
      });
    },
    getTransInfo: function () {
      let t = this;
      ajaxPost({
        url: "/v1_home/pay/trans",
        data: { channel_id: this.channel_id },
        success: function (res) {
          if (res.code == "200") {
            $("#account_name").text(res.data.content.trans_name);
            $("#account_bank").text(res.data.content.trans_bank);
            $("#account_branch").text(res.data.content.trans_bank_branch);
            $("#account_card").text(res.data.content.trans_bank_card);
          }
        },
      });
    },
    upimgFn: function () {
      var domain = document.domain;
      var firstDomain = domain.substring(
        domain.indexOf(".") + 1,
        domain.length
      );
      if (domain === "localhost") {
        // baseUrl = 'http://api.dianmai361.com'
        //baseUrl = "https://api2.yongfuhk.com";
        // baseUrl = "https://api2.yigaomarkets.com";
        baseUrl = "https://api2.zhongtaimarket.com";
      } else if (domain === "trader.aaclplus.com") {
        baseUrl = "//api2." + firstDomain;
      } else if (domain === "trader.zbxq360.com") {
        baseUrl = "//api2." + firstDomain;
      } else if (domain === "trader.nncyb-c.com") {
        baseUrl = "//api2." + firstDomain;
      } else if (domain === "yigaomarkets.com") {
        baseUrl = "//api2." + firstDomain;
      } else if (domain === "zhongtaimarket.com") {
        baseUrl = "//api2." + firstDomain;
      } else {
        baseUrl = "//api." + firstDomain;
      }

      const token = $.cookie("token") || "";
      const money = Number(this.money);
      const channel_id = Number(this.channel_id);
      const uuid = $.cookie("uuid");
      const that = this;

      //console.log(token, money, channel_id, uuid);

      $(".c-submit-btn").click(function () {
        const bank_user_name = $.trim(
          $('.fill-form [name="bank_user_name"]').val()
        );
        const bank_name = $.trim($('.fill-form [name="bank_name"]').val());
        const bank_card = $.trim($('.fill-form [name="bank_card"]').val());
        const trans_info = offLintTrans.img_1;
        const formData = new FormData();

        //console.log(bank_user_name, bank_name, bank_card);

        if (!bank_user_name) {
          return utils.toast("请输入付款人姓名");
        }
        if (!bank_name) {
          return utils.toast("请输入付款银行");
        }
        if (!bank_card) {
          return utils.toast("请输入付款帐号");
        }
        if (/^\d{16,19}$/.test(bank_card) === false) {
          return utils.toast("付款帐号只能输入16~19位的数字");
        }
        if (!trans_info) {
          return utils.toast("请上传已支付回单截频");
        }
        if (!that.uploading) {
          that.uploading = true;

          //console.log(
          //  money,
          //  channel_id,
          //  bank_name,
          //  bank_user_name,
          //  bank_card,
          //  trans_info,
          //  token,
          //  uuid
          //);

          formData.append("money", money);
          formData.append("channel_id", channel_id);
          formData.append("bank_name", bank_name);
          formData.append("bank_user_name", bank_user_name);
          formData.append("bank_card", bank_card);
          formData.append("trans_info", trans_info);
          formData.append("token", token);
          formData.append("uuid", uuid);
          $.ajax({
            type: "POST",
            url: baseUrl + "/v1_home/pay/preorder",
            data: formData,
            dataType: "json",
            processData: false,
            contentType: false,
            success: function (res) {
              if (res.code == "200") {
                utils.toast(res.msg);
                that.uploading = false;
              } else {
                utils.toast(res.msg);
                that.uploading = false;
              }
            },
          });
        } else {
          utils.toast(`资料上传中...`);
        }
      });
    },
    dataURLtoFile: function (dataurl, fileName) {
      var arr = dataurl.split(",");
      var mime = arr[0].match(/:(.*?);/)[1];
      var bstr = atob(arr[1]);
      var n = bstr.length;
      var u8arr = new Uint8Array(n);
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }
      return new File([u8arr], fileName, { type: mime });
    },
    fileChange: function () {
      var t = this;
      $(".uploadPic").on("change", 'input[type="file"]', function () {
        if (!window.FileReader) {
          utils.toast("您的浏览器不支持图片上传");
          return false;
        }
        var name = $(this).attr("name");
        var file = this.files[0];
        // $(".card-img img").attr('src',file.name)
        var reader = new FileReader();
        // name = $(this).attr('name');
        if (!/\.(jpg|jpeg|png|JPG|PNG)$/.test(file.name)) {
          utils.toast("文件类型必须是jpeg,jpg,png中的一种");
          return false;
        }
        if (file.size > 5 * 1024 * 1024) {
          utils.toast("图片大小不能超过5M");
          return false;
        }
        reader.onload = function (e) {
          var dataUrl = e.target.result;
          //console.log(file);
          if (name == "id_file_name1") {
            $(".card-img img").attr("src", dataUrl);
            t.img_1 = file;
            $(".card-img div").hide();
          }
          // pos = dataUrl.indexOf("4") + 2;
          // dataUrl = dataUrl.substring(pos, dataUrl.length - pos); //去掉Base64:开头的标识字符
          //t.uploadImg(dataUrl, name);
        };
        reader.readAsDataURL(file);
      });
    },
  };
  offLintTrans.init();
})(jQuery);
