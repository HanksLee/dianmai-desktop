(function($){
	var login = {
		timeout: null,
		seconds:60,
		init: function() {
			this.getBg();
			this.obtainHeight();
			this.getVcode(); //获取图形验证码
			this.changeVcode(); //刷新图形验证码
			this.loginFn(); //登陆
			this.revisePw();
			var token = $.cookie('token') || '';
			if(token) {
				window.location.href = "admin/index.html#page/account.html";
			}
		},
		getBg:function(){
           ajaxPost({
           	   url:'/v1_home/user/indexbg',
           	   success:function(res){
           	   	   if(res.code == '200'){
                        $('.login-con').css({
                        	'background-image': 'url('+res.data.data.login_bg+')'
                        })
           	   	   }
           	   }
           })
		},
		obtainHeight: function() {
			var height = $('.login-box').outerHeight();
			$('.login-box').css({
				'top': '50%',
				'margin-top': -height / 2
			});
		},
		getVcode: function() {
			var $loginVcode = $('#loginVcode');
			$loginVcode.attr('src', baseUrl + '/v1/code/captcha?uuid=' + uuid + '&t=' + new Date().getTime());
			$loginVcode.load(function() {
				$(this).show();
				$loginVcode.off('load');
			});
		},
		changeVcode: function() {
			var t = this;
			$('#loginVcode').click(function() {
				$(this).attr('src', baseUrl + '/v1/code/captcha?uuid=' + uuid + '&t=' + new Date().getTime());
			});
		},
	    loginFn:function(){
		   	$(".login-box").on('keydown', 'input', function(event) {
					if(event.keyCode == 13) {
						$('#login-but').click();
					}
			});
		   	$('#login-but').click(function(){
		   	  	 var data = {
	                    mobile: $.trim($('.login-box [name="mobile"]').val()),
	                    password: $.trim($('.login-box [name="password"]').val()),
	                    code: $.trim($('.login-box [name="code"]').val()),
	                    pwd_type: '0',
		   	  	 };
		   	  	ajaxPost({
		   	  	  	url: '/v1/user/login',
		   	  	  	data: data,
		   	  	  	success:function(res){
	                   if(res.code == '200'){
	                      var token = res.data.token || '';
                          localStorage.setItem('userinfo',JSON.stringify(res.data))
	                      _user.setUserCookie({
							token: token
						});
	                    window.location.href = 'admin/index.html#page/account.html';
	                   }else {
						var msg = res.msg || '登录失败，请重试';
						utils.toast(msg);
	                   }
	                }
	            });
	        })
		},
		//忘记密码
		revisePw:function(){
		   $('.li-box em').click(function(){
			   $('#mobile').val('');
			   $('#code').val('');
			   $('#newPpassword').val('');
			   $('#confirmPassword').val('');
			   $('.projectileFrame,.bg').show();
		   });
		   $('.bg').click(function(){
			$('.projectileFrame,.bg').fadeOut();
		   });
		   $('#yanzhengma').click(function(){
			if(!$.trim($('#mobile').val())){
				utils.toast('请输入手机号');
				return false;
			   };
			$('#mobileCode').text('60s重新发送').removeClass('hide');
			$(this).addClass('hide');
			login.seconds = 60;
			login.countDownFP();
              ajaxPost({
				  url:'/v1/code/smscode',
				  data:{
					mobile: $.trim($('#mobile').val())
				  },
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
		   });
		   $('#submitPw').click(function(){
			   if(!$.trim($('#mobile').val())){
				utils.toast('请输入手机号');
				return false;
			   };
			   if(!$.trim($('#code').val())){
				utils.toast('请输入验证码');
				return false;
			   };
			   if(!$.trim($('#newPpassword').val())){
				utils.toast('请输入新密码');
				return false;
			   };
			   if($.trim($('#newPpassword').val()) !== $.trim($('#confirmPassword').val())){
				utils.toast('两次密码输入不一致');
				return false;
			   };
			   ajaxPost({
				   url:'/v1/user/get-back-pwd',
				   data:{
					mobile: $.trim($('#mobile').val()),
					password: $.trim($('#newPpassword').val()),
					repassword: $.trim($('#confirmPassword').val()),
					smscode: $.trim($('#code').val())
				    },
					success:function(res){
						if(res.code == '200'){
							utils.toast('重置成功');
							$('.projectileFrame,.bg').fadeOut();
							login.getVcode()
						 }else{
							var msg = res.msg || '重置失败'; 
							utils.toast(msg);
						 }
				   }
			   })
		   })	
		},
		countDownFP: function() {
			login.timeout = setTimeout(function() {
				login.seconds = login.seconds - 1;
			  if(login.seconds > 0) {
				$('#mobileCode').html(login.seconds + 's重新发送');
				login.countDownFP();
			  } else {
				$('#yanzhengma').html('发送验证码').removeClass('hide');
				$('#mobileCode').addClass('hide');
				clearTimeout(login.timeout);
			  }
			}, 1000);
		  },
	};
	login.init()
})(jQuery)
