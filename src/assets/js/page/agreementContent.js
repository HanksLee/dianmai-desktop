(function($) {
	var agreementContent = {
		init:function() {
			this.getFlag();
			this.getdetails(); 
		},
		getFlag: function() {
            var hash = window.location.hash,
                query = hash.split('?');
            query = query.length > 1 ? query[1] : '';
            agreementContent.flagid = utils.getQueryParam(query, 'flagid') || '';
          },
		getdetails:function(){
			ajaxGet({
				url: '/v1_home/cmscontent/content',
				data:{id:agreementContent.flagid},
				success:function(res){
				   if(res.code == '200'){
                      $('.details').html(res.data.data.content)
				   }
				}
			})
		},
	};
	agreementContent.init();
})(jQuery);

