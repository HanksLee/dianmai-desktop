(function($){
	var protocol = {
		init:function(){
        this.getProtocolList();
		},
    getProtocolList:function(){
        ajaxPost({
          url:'/v1_home/user/protocol',
          data:{},
          success:function(res){
            if(res.code == '200'){
                var list = res.data.data || [],
                    protocolHtml,protocolHtmlData=[];
                if(list.length > 0){
                      for(var i=0;i<list.length;i++){
                         var classStr = i % 2 == 0 ? 'class="tr-bg"' : '',
                             title = list[i].title ? list[i].title : '',
                             version = list[i].version ? list[i].version : '',
                             release_time = list[i].release_time ? list[i].release_time : '',
                             sign_time = list[i].sign_time ? list[i].sign_time : '';
                        protocolHtml = '<tr ' + classStr + ' >'+
                                '<td>' + title + '</td>' +
                                '<td>' + version + '</td>' +
                                '<td>' + release_time + '</td>' +
                                '<td>'+sign_time+'</td>' +
                                '<td><a class="loadPage" href="#page/agreementContent.html?flagid='+list[i].id+'" style="display:inline-block;color:#fff;padding:5px 19px 6px;background:#C3181F;border-radius:7px;">详情</a></td>' +
                                '</tr>';
                         protocolHtmlData.push(protocolHtml); 
                      }  
                      if(protocolHtmlData.length > 0) {
                            $('#protocol tbody').html(protocolHtmlData.join(''));
                        }
                }else{
                  $('#protocol tbody').html('<tr class="tr-bg"><td colspan="4">暂无数据</td></tr>');
                }
            } 
          }
        })
    }
	};
	protocol.init()
})(jQuery)