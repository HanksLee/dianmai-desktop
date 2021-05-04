(function ($) {
  var certification = {
    list: [],
    img_1: "",
    img_2: "",
    card_id: "",
    real_name: "",
    init: function () {
      this.getInfo();
      this.fileChange();
      this.upimgFn();
    },
    getInfo: function () {
      ajaxPost({
        url: "/v1_home/user/real-auth-info",
        success: function (res) {
          if (res.code == "200") {
            var userInfo = res.data.user_info;
            $('.fill-form [name="card_id"]').val(userInfo.card_id);
            $('.fill-form [name="real_name"]').val(userInfo.real_name);
            $(".card-img img").attr(
              "src",
              "data:image/png;base64," + userInfo.img_1_content
            );
            $(".card-img1 img").attr(
              "src",
              "data:image/png;base64," + userInfo.img_2_content
            );
            if (userInfo.img_1_content) {
              $(".card-img div").hide();
            }
            if (userInfo.img_2_content) {
              $(".card-img1 div").hide();
            }
            var id_card_front_img =
              "data:image/png;base64," + userInfo.img_1_content;
            var id_card_back_img =
              "data:image/png;base64," + userInfo.img_2_content;
            certification.img_1 = certification.dataURLtoFile(
              id_card_front_img,
              "img_1.png"
            );
            certification.img_2 = certification.dataURLtoFile(
              id_card_back_img,
              "img_2.png"
            );
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
        baseUrl = "https://api2.yigaomarkets.com";
      } else if (domain === "trader.aaclplus.com") {
        baseUrl = "//api2." + firstDomain;
      } else if (domain === "trader.zbxq360.com") {
        baseUrl = "//api2." + firstDomain;
      } else if (domain === "trader.nncyb-c.com") {
        baseUrl = "//api2." + firstDomain;
      } else if (domain === "yigaomarkets.com") {
        baseUrl = "//api2." + firstDomain;
      } else {
        baseUrl = "//api." + firstDomain;
      }
      var token = $.cookie("token") || "";
      $(".c-submit-btn").click(function () {
        var card_id = $.trim($('.fill-form [name="card_id"]').val()),
          real_name = $.trim($('.fill-form [name="real_name"]').val()),
          img_1 = certification.img_1,
          img_2 = certification.img_2;
        var formData = new FormData();
        formData.append("real_name", real_name);
        formData.append("card_id", card_id);
        formData.append("img_1", img_1);
        formData.append("img_2", img_2);
        formData.append("token", token);
        $.ajax({
          type: "POST",
          url: baseUrl + "/v1_home/user/real-auth",
          data: formData,
          dataType: "json",
          processData: false,
          contentType: false,
          success: function (res) {
            if (res.code == "200") {
              utils.toast(res.msg);
            } else {
              utils.toast(res.msg);
            }
          },
        });
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
            certification.img_1 = file;
            $(".card-img div").hide();
          }
          if (name == "id_file_name2") {
            $(".card-img1 img").attr("src", dataUrl);
            certification.img_2 = file;
            $(".card-img1 div").hide();
          }
          // pos = dataUrl.indexOf("4") + 2;
          // dataUrl = dataUrl.substring(pos, dataUrl.length - pos); //去掉Base64:开头的标识字符
          //t.uploadImg(dataUrl, name);
        };
        reader.readAsDataURL(file);
      });
    },
  };
  certification.init();
})(jQuery);
