(function ($) {
  var register = {
    timeout: null,
    seconds: 60,
    init: function () {
      this.getBg();
      this.obtainHeight();
      this.identifyingCode();
      this.registerFn();
      this.toggleProtocal();
      this.getHzxy();
    },
    getBg: function () {
      ajaxPost({
        url: "/v1_home/user/indexbg",
        success: function (res) {
          if (res.code == "200") {
            $(".login-con").css({
              "background-image": "url(" + res.data.data.login_bg + ")",
            });
          }
        },
      });
    },
    obtainHeight: function () {
      var height = $(".login-box").outerHeight();
      $(".login-box").css({ top: "50%", "margin-top": -height / 2 });
    },
    identifyingCode: function () {
      var t = this;
      $(".yanzhengma").click(function () {
        var mobile = $.trim($('.login-box [name="mobile"]').val());
        $("#mobileCode").text("60s重新发送").removeClass("hide");
        $(this).addClass("hide");
        t.seconds = 60;
        t.countDownFP();
        ajaxPost({
          url: "/v1/code/smscode",
          data: { mobile: mobile },
          success: function (res) {
            if (res.code == "200") {
              utils.toast("验证码发送成功，请注意查收");
            } else {
              utils.toast(res.msg);
              $("#yanzhengma").html("发送验证码").removeClass("hide");
              $("#mobileCode").addClass("hide");
            }
          },
        });
      });
    },
    countDownFP: function () {
      var t = this;
      this.timeout = setTimeout(function () {
        t.seconds = t.seconds - 1;
        if (t.seconds > 0) {
          $("#mobileCode").html(t.seconds + "s重新发送");
          t.countDownFP();
        } else {
          $("#yanzhengma").html("发送验证码").removeClass("hide");
          $("#mobileCode").addClass("hide");
          clearTimeout(t.timeout);
        }
      }, 1000);
    },
    registerFn: function () {
      $("#register").click(function () {
        var real_name = $.trim($('.login-box [name="real_name"]').val()),
          mobile = $.trim($('.login-box [name="mobile"]').val()),
          password = $.trim($('.login-box [name="password"]').val()),
          smscode = $.trim($('.login-box [name="smscode"]').val()),
          inviter_id = $.trim($('.login-box [name="inviter_id"]').val()),
          password1 = $.trim($('.login-box [name="password1"]').val()),
          hzxy_check = $("#hzxy-check").val();
        if (real_name == "") {
          utils.toast("请输入您的姓名");
          return false;
        }
        if (mobile == "") {
          utils.toast("请输入您的手机号");
          return false;
        }
        if (password == "" || password1 == "") {
          utils.toast("请输入您的登陆密码");
          return false;
        }
        if (password != password1) {
          utils.toast("两次输入的密码不一致");
          return false;
        }
        if (hzxy_check == "" || hzxy_check == false) {
          utils.toast("尚未勾选同意合作协议");
          return false;
        }

        var data = {
          real_name: real_name,
          mobile: mobile,
          password: password,
          smscode: smscode,
          inviter_id: inviter_id,
        };
        ajaxPost({
          url: "/v1/user/register",
          data: data,
          success: function (res) {
            if (res.code == "200") {
              utils.toast("注册成功");
              window.location.href = "login.html";
            } else {
              utils.toast(res.msg);
            }
          },
        });
      });
    },
    toggleProtocal: function () {
      if ($(".protocol")) {
        $(".protocol").click(function () {
          $(this).toggleClass("active");
          if ($(this).hasClass("active")) {
            $("#hzxy-check").val("true");
          } else {
            $("#hzxy-check").val("false");
          }
        });
      }
    },
    getHzxy: function () {
      ajaxPost({
        url: "/v1_home/cmscontent/registerrule",
        success: function (res) {
          if (res.code == "200") {
            $("#hzxy-content").html(res.data.content);
          }
        },
      });
    },
  };
  register.init();
})(jQuery);
