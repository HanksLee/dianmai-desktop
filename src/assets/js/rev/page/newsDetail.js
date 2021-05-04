(function($){
	var newsDetail = {
        flagid: '',
  		init:function(){
           this.getFlag();
        },
        getFlag: function() {
            var hash = window.location.hash,
                query = hash.split('?');
            query = query.length > 1 ? query[1] : '';
            newsDetail.flagid = utils.getQueryParam(query, 'flagid') || '';
            newsDetail.getDetails(newsDetail.flagid);
        },
        getDetails:function(id){
           ajaxPost({
               url:'/v1_home/stock/greathit',
               data:{id: id},
               success:function(res){
                   if(res.code == '200'){
                    var content = res.data.article
                    var title = res.data.title
                    $('.news-details-box-title').html(title);
                    $('.news-details-box-con').html(content);
                   }
               }
           }) 
        }
	};
	newsDetail.init()
})(jQuery)
