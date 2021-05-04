var language = $.cookie("language") || "zh-CN";
var token_store = $.cookie("token") || "";
var baseUrl = "";
var domain = document.domain;
var firstDomain = domain.substring(domain.indexOf(".") + 1, domain.length);
if (domain === "localhost") {
  // baseUrl = "http://api2.zhongtaimarkets.com";
  // baseUrl = "https://api2.yigaomarkets.com";
  // baseUrl = "https://api2.yongfuhk.com";
  baseUrl = 'http://api.dianmai361.com'
} else {
  baseUrl = "//api2." + firstDomain;
}
var uuid = getCookieUuid();
function getCookieUuid(uuid) {
  var uuid = $.cookie("uuid");
  if (uuid) {
    return uuid;
  } else {
    uuid = new Date().getTime() + "_" + Math.random(1000);
    $.cookie("uuid", uuid, {
      expires: 365,
      path: "/",
      domain: firstDomain,
    });
    return uuid;
  }
}
/**
 * [ajaxFn]
 * @param {[url]} [接口地址]
 * @param {[data]} [接口参数]
 * @param {[async]} [是否异步]
 * @param {[success]} [成功回调]
 * @param {[error]} [错误回调]
 */
jQuery.support.cors = true;
let xhr = null;
let searchXhr = null;
let currentXhr = null;
var ajaxFn = function (param) {
  var token = $.cookie("token") || "";
  if (token_store != token) {
    console.log("检测到登录信息有变化");
    window.location.reload();
    return false;
  }
  //浏览器唯一标识
  var uuid = getCookieUuid();
  var defaultParam = {
    language: language,
    token: token,
    uuid: uuid,
  };
  var url = param.url.indexOf("http") > -1 ? param.url : baseUrl + param.url,
    dataParam = param.data
      ? $.extend(true, param.data, defaultParam)
      : defaultParam,
    type = param.type ? param.type : "GET",
    async1 = param.async == false ? false : true,
    dataType = param.dataType ? param.dataType : "json",
    successfn = param.success || null,
    errorfn = param.error || null,
    alwaysfn = param.always || null,
    isAbort = param.isAbort || null,
    specialAjax = param.specialAjax || null
  //processData = param.processData,
  contentType =
    param.contentType || "application/x-www-form-urlencoded; charset=UTF-8";
  if (window.XDomainRequest) {
    //for IE8,IE9
    contentType = "text/plain";
  }

  currentXhr = specialAjax ? searchXhr : xhr;

  if (isAbort && searchXhr) {
    searchXhr.abort()
  }

  if (specialAjax) {
    searchXhr = $.ajax({
      url: url,
      async: async1,
      type: type,
      dataType: dataType,
      data: dataParam,
      contentType: contentType,
    }).done(function (res) {
      if (res.code == "999") {
        //所有需要登录的接口若在未登录的情况下调用，code为999
        _user.gotoLogin();
      } else {
        if (successfn) {
          currentXhr = null;
          successfn(res);
        }
      }
    })
      .fail(function (XMLHttpRequest, textStatus, errorThrown) {
        if (errorfn) {
          errorfn(XMLHttpRequest, textStatus, errorThrown);
        }
      })
      .always(function () {
        if (alwaysfn) {
          alwaysfn();
        }
        //延迟登录时间
        token = $.cookie("token") || "";
        if (token) {
          _user.setUserCookie({
            token: token,
          });
        }
      });
    return searchXhr;
  } else {
    xhr = $.ajax({
      url: url,
      async: async1,
      type: type,
      dataType: dataType,
      data: dataParam,
      contentType: contentType,
    }).done(function (res) {
      if (res.code == "999") {
        //所有需要登录的接口若在未登录的情况下调用，code为999
        _user.gotoLogin();
      } else {
        if (successfn) {
          currentXhr = null;
          successfn(res);
        }
      }
    })
      .fail(function (XMLHttpRequest, textStatus, errorThrown) {
        if (errorfn) {
          errorfn(XMLHttpRequest, textStatus, errorThrown);
        }
      })
      .always(function () {
        if (alwaysfn) {
          alwaysfn();
        }
        //延迟登录时间
        token = $.cookie("token") || "";
        if (token) {
          _user.setUserCookie({
            token: token,
          });
        }
      });
    return xhr;
  }

};
var ajaxGet = function (param) {
  param.type = "GET";
  return ajaxFn(param);
};
var ajaxPost = function (param) {
  param.type = "POST";
  return ajaxFn(param);
};

/*用户相关操作*/
var _user = {
  userInfo: null,
  setUserCookie: function (data) {
    var date = new Date();
    date.setTime(date.getTime() + 2 * 60 * 60 * 1000);
    $.cookie("token", data.token, {
      expires: date,
      path: "/",
      domain: firstDomain,
    });
  },
  clearUserCookie: function () {
    $.cookie("token", "", {
      path: "/",
      domain: firstDomain,
    });
  },
  gotoLogin: function () {
    _user.clearUserCookie();
    //localStorage.setItem('conHeight','');
    //$('.header_b_btn,div.log_in_out,div.log_in_out', window.parent.document).show();
    localStorage.setItem("userinfo", "");
    window.location.href =
      window.location.protocol + "//" + window.location.host + "/login.html";
  },
};

/*input textarea placeholder*/
var placeholderHack = function () {
  function isPlaceholer() {
    var input = document.createElement("input");
    return "placeholder" in input;
  }
  if (isPlaceholer()) return false;
  $("input[placeholder], textarea[placeholder]").focus().blur().placeholder();
};

/*load page*/
/**
 * [加载页面]
 * @param {[isElementA]} [是否是a标签点击加载]
 * @param {[urlToLoad]} [地址]
 * @param {[parseElement]} [加载页的内容]
 * @param {[container]} [放置容器]
 */
var loadPageFn = function (
  isElementA,
  urlToLoad,
  parseElement,
  container,
  popped
) {
  var pageUrl = urlToLoad + " " + parseElement;
  NProgress.start();
  if (history.pushState && !this.bindPopstate) {
    this.bindPopstate = true;
    $(window).on("popstate", function () {
      if (history.state && history.state.initiative) {
        loadPageFn(
          history.state.isElementA,
          history.state.urlToLoad,
          history.state.parseElement,
          history.state.container,
          true
        );
      }
    });
  }
  $(container).load(pageUrl.replace("#", ""), function (response, status, xhr) {
    NProgress.done();
    if (status == "success") {
      if (history.pushState && popped != true) {
        var state = {
          initiative: true,
          isElementA: isElementA,
          urlToLoad: urlToLoad,
          parseElement: parseElement,
          container: container,
        };
        history.pushState(state, null, urlToLoad);
      }
      var startIndex = response.indexOf("<title>") + 7,
        endIndex = response.indexOf("</title>");
      document.title = response.substring(startIndex, endIndex);
      $response = $(response);
      $response.find("script").appendTo(container);
    }
  });
};

var utils = {
  toast: function (text, params) {
    $("global-toast").remove();
    params = params || {};
    var classStr = params.bg ? params.bg + "-toast" : "blue-toast";
    var marginLeft = 0;
    var $toast = $(
      '<div class="global-toast ' + classStr + '">' + text + "</div>"
    );
    $("body").append($toast);
    marginLeft = -0.5 * $toast.width();
    $toast
      .css({
        marginLeft: marginLeft,
        opacity: 0,
      })
      .animate(
        {
          top: 40,
          opacity: 1,
        },
        400
      );
    setTimeout(function () {
      $toast.animate(
        {
          top: 10,
          opacity: 0,
        },
        200
      );
    }, 3000);
  },
  tip: function (param) {
    var position = param.position || "bottom",
      msg = param.msg,
      obj = param.obj,
      cssStyle = {},
      $tip = $('<div class="global-tip">' + msg + "</div>");
    $(obj).append($tip);
    cssStyle.position = position;
    if (position == "bottom") {
      var tip_w = $tip[0].clientWidth,
        tip_h = $tip[0].clientHeight;
      cssStyle.bottom = -1 * (tip_h + 5);
      cssStyle.left = "50%";
      cssStyle.marginLeft = -0.5 * tip_w;
      $tip.css(cssStyle);
    }
  },
  removeTip: function (obj) {
    $(obj).find(".global-tip").remove();
  },
  dialog: function (param) {
    /*
			如果是模板写在html里，需传参isHtmlTemp = 1, wrap传模板的标识，比如id，class,需具唯一性
			init 弹窗生成后的执行的事件，如果模板写在html，此事件仅会执行一次。////<i class="iconfont icon-close"></i>关闭按钮标签
		 */
    var t = this,
      width = param.width,
      height = param.height,
      title = param.title || "",
      wrap = param.wrap || "body",
      isHtmlTemp = param.isHtmlTemp || 0,
      temp = param.temp || "",
      closeBtn = param.closeBtn == false ? false : true,
      dialog_closeBtn = closeBtn
        ? '<a href="javascript:;" class="loadPage close-btn"></a>'
        : "",
      dialog_title = title
        ? '<div class="c-dialog-title"><span>' +
        title +
        "</span>" +
        dialog_closeBtn +
        "</div>"
        : "",
      $dialog,
      $dialog_temp,
      dialog_temp = "",
      cssStyle = {};
    if ($(wrap).attr("isDialog") == 1 && isHtmlTemp == 1) {
      //已经把temp初始成dialog了，显示出来就行
      $(wrap).show();
      return $(wrap + " .c-dialog");
    }
    if (dialog_title) {
      dialog_temp =
        '<div class="c-dialog">' +
        '<a href="javascript:;" class="loadPage mask"></a>' +
        '<div class="c-dialog-m">' +
        dialog_title +
        '<div class="c-dialog-con">' +
        temp +
        "</div></div>" +
        "</div>";
    } else {
      dialog_temp =
        '<div class="c-dialog">' +
        '<a href="javascript:;" class="loadPage mask"></a>' +
        '<div class="c-dialog-m">' +
        dialog_closeBtn +
        '<div class="c-dialog-con">' +
        temp +
        "</div></div>" +
        "</div>";
    }
    $dialog = $(dialog_temp);
    if (isHtmlTemp == 1) {
      $(wrap).html($dialog).show().attr("isDialog", 1);
    } else {
      $(wrap).append($dialog);
    }
    $dialog_temp = $dialog.find(".c-dialog-m");
    if (width) {
      cssStyle.width = width;
      $dialog_temp.width(width);
    }
    cssStyle.right = "50%";
    cssStyle.top = "50%";
    cssStyle.marginRight = -0.5 * $dialog_temp.width();
    cssStyle.marginTop = -0.5 * $dialog_temp.height();
    $dialog_temp.css(cssStyle);
    if (param.commitFn) {
      $dialog_temp.find(".commit-btn").click(function () {
        param.commitFn($dialog);
      });
    }
    if (param.cancelFn) {
      $dialog_temp.find(".cancel-btn").click(function () {
        param.cancelFn($dialog);
      });
    }
    $dialog_temp.find(".close-btn").click(function () {
      utils.closeDialog($dialog);
    });
    $dialog.find(".mask").click(function () {
      utils.closeDialog($dialog);
    });
    $dialog.data("param", param);
    if (param.init) {
      //窗口生成后执行的事件
      param.init($dialog);
    }
    return $dialog;
  },
  closeDialog: function (dialog) {
    var param = $(dialog).data("param");
    if (param.isHtmlTemp == 1) {
      $(param.wrap).hide();
    } else {
      $(dialog).remove();
    }
  },
  loading: function (container) {
    container = container || ".page-content";
    var $container = $(container),
      c_w = $container.width(),
      c_h = $container.height(),
      cssStyle = {},
      $load = $(
        '<div class="c-loading"><div class="mask"></div><div class="c-load-icon"></div></div>'
      );
    $container.append($load);
  },
  removeLoading: function () {
    $(".c-loading").remove();
  },
  getQueryString: function (name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]);
    return null;
  },
  getQueryParam: function (str, name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = str.match(reg);
    if (r != null) return unescape(r[2]);
    return null;
  },
  goPage: function (url) {
    loadPage(url, ".page-content", "#container");
  },
};
