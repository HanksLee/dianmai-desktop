/* 
 * AjaxPageParser jQuery Plugin
 * Made by Erik Terwan
 * 28 September 2015 - 0.1.3
 * 
 * This plugin is provided as-is and released under the terms of the MIT license.
 */
/*
 * 结合业务对此插件进行修改
 */

(function($){    
	$.fn.pageParser = function(options){  
		/*
		 *  VARIABLES
		 */
		
		// Set the default options
		var settings = $.extend({
			container: null, //the container for the data to be displayed in, cannot be null - required
			dynamicUrl: true, //if false, the plugin doesn't update the URL to match the loaded page
			initialElement: null, //the element that is active / the page is loaded from on initial load. Needed to go back to the first page in with popstate. Only usefull if you use dynamic urls
			parseElement: null, //the element on the page you want to implement, if empty it loads the whole page
			setTitle: true, //set the title of the page to the one you are loading
			trigger: 'click', //when to trigger the loading, default is on click
			urlAttribute: 'href', //the attribute to be checked for the url, default is href (for a tags)
			loadDelay: null, //sometimes nice for animation
			before : function(){}, //the callback that gets called before loading, say for displaying a loader. 'this' returns the clicked button
			finished : function(){}, //the callback that gets called after everything is loaded, say to hide the loader, toggle button state.  'this' returns the clicked button
			error : function(){} //the callback that gets called after an error, do custom error handling here. Returns the xhr status.
		}, options);
		
		var loadCount = 0; //make sure to not load if the element is initialy loaded via the popstate call
		var shouldCheckCount = false; //if it should check the loadCount to avoid the first popstate call
		var $thisElement = this; //for use inside private functions etc.
		
		/*
		 *  PRIVATE METHODS
		 */
		
		//initialize
		function init()
		{			
			$thisElement.each(function(count){
				//set the 'on' trigger
				var $hrefElement = $(this);
				if($.trim($hrefElement.attr('href')) == '') return false;
				$(this).attr('data-ppid', count + 1); //set unique id for the popstate
				
				$(this).on(settings.trigger, function(e){
					loadPage($hrefElement); //do the magic
					
					e.preventDefault(); //prevent default  behaviour
					
					return false; //also return false
				});
			});
			
			//check for initial element, to fix the popstate
			if(settings.initialElement != null){
				if(settings.dynamicUrl){
					shouldCheckCount = true;
					var originalUrl = settings.query ? $(settings.initialElement).attr(settings.urlAttribute) + '?' + settings.query : $(settings.initialElement).attr(settings.urlAttribute);
					var state = {name: originalUrl, page: document.title, id: $(settings.initialElement).attr('data-ppid')};
					if(originalUrl){
						history.pushState(state, document.title, originalUrl); //push the state so we can get back to this state
						loadPage($(settings.initialElement));
					}
				}
			}
			
			
			$(window).on("popstate", function(){
				//if its a pushed state we dynamicly load the previous page
				if(history.state){
					if(shouldCheckCount){
						if($("*[data-ppid="+history.state.id+"]").length > 0){ //if exists then load
							loadPage($("*[data-ppid="+history.state.id+"]"), true);
						}
					}
				}
			});
			
			return $thisElement; //return self for chaining
		}
		
		function loadPage($hrefElement, popped)
		{
			settings.before.call($hrefElement); //call the 'before' callback
			
			var originalUrl = settings.query ? $hrefElement.attr(settings.urlAttribute) + '?' + settings.query : $hrefElement.attr(settings.urlAttribute);
			var urlToLoad = originalUrl;
			var elementId = $hrefElement.attr('data-ppid');
			settings.query = '';
			if(settings.parseElement != null){
				urlToLoad += " "+settings.parseElement; //append the 
			}
			
			//alert(settings.loadDelay);
			setTimeout(function() {
				$(settings.container).load(urlToLoad.replace('#',''), function(response, status, xhr){
				  if(status == "success"){
				  	var titlePart = response.split("title>"); //dirty little trick to get an html element
				  	titlePart = titlePart[1].split("</"); //since the <title> element is always the same, this is possible
				  	var title = titlePart[0];
				  		
				  	if(settings.dynamicUrl && popped != true){
				  		var state = {name: urlToLoad, page: title, id:elementId};
				  		
				  		history.pushState(state, title, originalUrl); //change url to the one provided
				  	}
				  	
				  	if(settings.setTitle){
				  		document.title = title; //set the title
				  	}
				  	$response = $(response); 
         			$response.find("script").appendTo(settings.container);
				  	settings.finished.call($hrefElement); //call the 'finished' callback
				  } else if(status == "error"){
				    settings.error.call(xhr.status); //call the 'error' callback, 'this' = xhr.status
				  }
				});
			}, settings.loadDelay);
		}
		
		return init(); //return init > this for chaining
	};
}(jQuery));

var frame = {
	init: function(){
		this.menuInit();
	},
	menuInit: function(){
		var hash = window.location.hash,
			query = '';
		if(hash!=''){
			var onMenu = false;
			$('.left-nav a[href]').each(function(){
				var href = $.trim($(this).attr('href'));
				if(href && hash.indexOf(href) > -1){
					if(hash.split('?').length > 1){
						query = hash.split('?')[1];
					}
					onMenu = true;
					$(this).addClass('active');
				}
			});
			if(!onMenu && hash.indexOf('.html') > -1){
				loadPageFn(false, hash, '.page-content', '#container');
			}
		}else{
			$('.left-nav a[href]:eq(0)').addClass('active');
		}
		this.loadPageInit(query);
	},
	loadPageInit: function(query){
		NProgress.configure({ showSpinner: false });
		$('.left-nav a[href]').pageParser({
			query: query,
			container:$('#container'),
			initialElement: $(".left-nav a.active"),
			parseElement: ".page-content",
			before: function(){
				NProgress.start();
			},
			finished: function(){
				NProgress.done();
				$(".left-nav a").removeClass('active');
				$(this).addClass('active');
			},
			error: function(){
				console.log('Whoops, something went wrong.');
			} 
		});
		$(document).on('click', 'a.loadPage[href]', function(){
			var href = $(this).attr('href');
			if(href){
				loadPageFn(true, href, '.page-content', '#container');
				if($(this).attr('data-id') == '8'){
				  $('.left-nav a').removeClass('active');
				  $('.wodecelv-li a').addClass('active');	
				}
				return false;

			}
		});
	},
};
$(function(){
	frame.init();
});
