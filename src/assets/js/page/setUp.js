(function($){
	var setUp = {
    dataType: '',//1为修改登陆密码，2为修改资金密码
    is_open: '',//0关闭,1开启
    text: '',
		init:function(){
      var domain = document.domain;
      var firstDomain = domain.substring(domain.indexOf('.') + 1, domain.length);
      if (firstDomain == 'ftstrategy.net') {
        $('.shipan-hide').hide()
      };
            this.switchFn();
            this.changePasswordTk();
            this.getSmscode();
            this.changePasswordSubmit();
		},
    //实盘开关
		switchFn:function(){
			$('.set_kf').click(function(){
               $(this).toggleClass('active');
               $(this).parent().find('span').toggleClass('active');
               if($(this).parent().find('span').hasClass('active')){
                    $(this).parent().find('i').addClass('fa-check-circle');
                    $(this).parent().find('i').removeClass('fa-exclamation-circle')
                    setUp.is_open = '1';
                    setUp.text = '开启';
               }else{
               	$(this).parent().find('i').addClass('fa-exclamation-circle');
                    $(this).parent().find('i').removeClass('fa-check-circle')
                    setUp.is_open = '0';
                    setUp.text = '关闭';
               };
               setUp.isItOpen();
			})
		},
    changePasswordTk:function(){
               var height = $('.projectileFrame').height();
               $('.projectileFrame').css({'top': '50%','margin-top':-height/2})
               $('.login-pw').click(function(){
                    var type = $(this).attr('data-type'),data = {}; 
                    setUp.dataType = type;
                    $('.projectileFrame,.bg').fadeIn();
                    if(type == '1'){
                         $('.bt').html('修改登陆密码<i class="fa fa-close"></i>');    
                     }
                    if(type == '2'){
                         $('.bt').html('修改资金密码<i class="fa fa-close"></i>');    
                     };
                    });
               $('.bg').click(function(){
                    $('.projectileFrame,.bg').fadeOut();
               });
               $('.bt').on('click','i',function(){
                  $('.projectileFrame,.bg').fadeOut();
               })
    },
    getSmscode:function(){
      var t = this;
      $('.yanzhengma').click(function(){
        if($.trim($('.input-box [name="mobile"]').val()) == ''){
             utils.toast('请输入正确的手机号码');
             return;
        }
        $('#mobileCode').text('60s重新发送').removeClass('hide');
        $(this).addClass('hide');
        t.seconds = 60;
        t.countDownFP();
        ajaxPost({
          url:'/v1/code/smscode',
          data: {mobile:$.trim($('.input-box [name="mobile"]').val())},
          success:function(res){
             if(res.code == '200'){
                utils.toast('验证码发送成功，请注意查收');
             }else{
                utils.toast('验证码发送失败，请重试');
                $('#yanzhengma').html('发送验证码').removeClass('hide');
                $('#mobileCode').addClass('hide');
             }
          }
        })
      })
    },
    countDownFP: function() {
      var t = this;
      this.timeout = setTimeout(function() {
        t.seconds = t.seconds - 1;
        if(t.seconds > 0) {
          $('#mobileCode').html(t.seconds + 's重新发送');
          t.countDownFP();
        } else {
          $('#yanzhengma').html('发送验证码').removeClass('hide');
          $('#mobileCode').addClass('hide');
          clearTimeout(t.timeout);
        }
      }, 1000);
    },
    //提交密码修改
    changePasswordSubmit:function(){
     $('#submitPw').click(function(){
          var oldPassword = $.trim($('.input-box [name="oldPassword"]').val()),
              newPpassword = $.trim($('.input-box [name="newPpassword"]').val()),
              confirmPassword = $.trim($('.input-box [name="confirmPassword"]').val()),
              smscode = $.trim($('.input-box [name="code"]').val());
          if(newPpassword != confirmPassword){
             utils.toast('新密码两次输入不一样，请重新输入');
             return;
           }
           var data = {},url = '';
           if(setUp.dataType == '1'){
               data = {password: newPpassword,repassword: confirmPassword,smscode:smscode};
               url = '/v1_home/user/reset-pwd';
           }else if(setUp.dataType == '2'){
               data = {fund_pwd: newPpassword,re_fund_pwd: confirmPassword,smscode:smscode};
               url = '/v1_home/user/set-fund-pwd';
           }
           ajaxPost({
               url:url,
               data:data,
               success:function(res){
                 if(res.code == '200'){
                    utils.toast('修改成功');
                    $('.projectileFrame,.bg').fadeOut();
                 }else{
                    var msg = res.msg || '修改失败'; 
                    utils.toast(msg);
                 }
               }
           })
     }) 
    },
    isItOpen:function(){
      ajaxPost({
         url:'/v1_home/user/set-open',
         data:{is_open: setUp.is_open},
         success:function(res){
            if(res.code == '200'){
                 utils.toast(setUp.text+'成功');
            }else{
                 var msg = res.msg || setUp.text+'失败'; 
                    utils.toast(msg);
            }
         }
      })
    },    
	};
	setUp.init()
})(jQuery)