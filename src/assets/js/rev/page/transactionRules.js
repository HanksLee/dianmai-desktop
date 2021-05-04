(function($) {
	var agreementContent = {
		init:function() {
			this.getdetails(); 
		},
		getdetails:function(){
			ajaxPost({
				url: '/v1_home/cmscontent/tradingrule',
				data:{},
				success:function(res){
				   if(res.code == '200'){
                      $('.transactionRules').html(res.data.content)
				   }
				}
			})
		},
	};
	agreementContent.init();
})(jQuery);

