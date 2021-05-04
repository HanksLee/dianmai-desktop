(function ($) {
    var notify = {
        init: function () {
            this.getnotifyList();
        },
        getnotifyList: function () {
            ajaxPost({
                url: '/v1_home/user/alertmsg',
                data: {},
                success: function (res) {
                    if (res.code == '200') {
                        var list = res.data.data;
                        if (list.length > 0) {
                            var listHtml = [], lihtml = '', text = '';
                            for (var i = 0; i < list.length; i++) {
                                if (list[i].status == '0') {
                                    text = '<i>新</i>'
                                } else {
                                    text = ''
                                }
                                if (list[i].msg_type == '0') {
                                    var val = (Number(list[i].real_wallet) - Number(list[i].lock_money)).toFixed(2);
                                    lihtml = '<li>' +
                                        '<div class="li-title"><strong>风控平仓预警通知' + text + '</strong><span>' + list[i].create_time + '</span></div>' +
                                        '<div class="li-p">' +
                                        '<p>由于您的风险值(可用资金:<b style="color: rgb(255,255,0);">' + val + '</b>,' +
                                        '冻结资金:<b style="color: rgb(255,255,0);">' + list[i].lock_money + '</b>),盈亏:<b>' + list[i].profit_money + '</b>' +
                                        '低于平台设定的<b>' + Number(list[i].line) * 100 + '%</b>,请及时追加可用资金；' +
                                        '根据平台风控规则，达到爆仓线时将会强平所有持仓。' +
                                        '</p></div></li>';
                                };
                                if (list[i].msg_type == '1') {
                                    var val1 = (Number(list[i].real_wallet) - Number(list[i].lock_money)).toFixed(2);
                                    lihtml = '<li>' +
                                        '<div class="li-title"><strong>风控自动平仓通知' + text + '</strong><span>' + list[i].create_time + '</span></div>' +
                                        '<div class="li-p">' +
                                        '<p>由于您的风险值(可用资金:<b style="color: rgb(255,255,0);">' + val1 + '</b>,' +
                                        '冻结资金:<b style="color: rgb(255,255,0);">' + list[i].lock_money + '</b>),盈亏: <b>' + list[i].profit_money + '</b>' +
                                        '低于平台设定的<b>' + Number(list[i].line) * 100 + '%</b>，' +
                                        '根据平台风控规则，系统将自动为您做平仓处理——订单有：<b>' + list[i].msg + '</b>。' +
                                        '</p></div></li>'
                                };
                                if (list[i].msg_type == '2') {
                                    lihtml = '<li>' +
                                        '<div class="li-title"><strong>可用资金不足自动平仓' + text + '</strong><span>' + list[i].create_time + '</span></div>' +
                                        '<div class="li-p">' +
                                        '<p>由于您的可用余额不足以抵扣递延费(订单名称：<b style="color: rgb(255,255,0);">' + list[i].msg + '</b>,' +
                                        '订单号：<b style="color: rgb(255,255,0);">' + list[i].order_id + '</b>),' +
                                        '根据平台风控规则，系统将自动为您做平仓处理。' +
                                        '</p></div></li>'
                                };
                                if (list[i].msg_type == '3') {
                                    lihtml = '<li>' +
                                        '<div class="li-title"><strong>到达止盈线自动平仓' + text + '</strong><span>' + list[i].create_time + '</span></div>' +
                                        '<div class="li-p">' +
                                        '<p>由于您的单子(订单名称：<b style="color: rgb(255,255,0);">' + list[i].msg + '</b>,' +
                                        '订单号：<b style="color: rgb(255,255,0);">' + list[i].order_id + '</b>),' +
                                        '达到了所设置的止盈线<b>' + list[i].line_money + '</b>,根据平台风控规则，系统将自动为您做止盈平仓处理(<b style="color: rgb(255,255,0);">' + list[i].profit_money + '' +
                                        '</b>)。</p></div></li>'
                                };
                                if (list[i].msg_type == '4') {
                                    lihtml = '<li>' +
                                        '<div class="li-title"><strong>到达止损线自动平仓' + text + '</strong><span>' + list[i].create_time + '</span></div>' +
                                        '<div class="li-p">' +
                                        '<p>由于您的单子(订单名称：<b style="color: rgb(255,255,0);">' + list[i].msg + '</b>,' +
                                        '订单号：<b style="color: rgb(255,255,0);">' + list[i].order_id + '</b>),' +
                                        '达到了所设置的止损线<b>' + list[i].line_money + '</b>,根据平台风控规则，系统将自动为您做止损平仓处理(<b style="color: rgb(255,255,0);">' + list[i].profit_money + '' +
                                        '</b>)。</p></div></li>'
                                };
                                if (list[i].msg_type == '5') {
                                    lihtml = '<li>' +
                                        '<div class="li-title"><strong>递延到期自动平仓' + text + '</strong><span>' + list[i].create_time + '</span></div>' +
                                        '<div class="li-p">' +
                                        '<p>由于您的单子(订单名称：<b style="color: rgb(255,255,0);">' + list[i].msg + '</b>,' +
                                        '订单号：<b style="color: rgb(255,255,0);">' + list[i].order_id + '</b>),' +
                                        '自动递延时间已到期，根据平台风控规则，系统将自动为您做平仓处理' +
                                        '。</p></div></li>'
                                };
                                if (list[i].msg_type == '6') {
                                    lihtml = '<li>' +
                                        '<div class="li-title"><strong>除权除息' + text + '</strong><span>' + list[i].create_time + '</span></div>' +
                                        '<div class="li-p">' +
                                        '<p>' + list[i].msg +
                                        '。</p></div></li>'
                                };
                                if (list[i].msg_type == '7') {
                                    lihtml = '<li>' +
                                        '<div class="li-title"><strong>出金审核成功' + text + '</strong><span>' + list[i].create_time + '</span></div>' +
                                        '<div class="li-p">' +
                                        '<p>' + `出金金额：${list[i].real_wallet}，${list[i].msg}，已审核成功` +
                                        '。</p></div></li>'
                                };
                                if (list[i].msg_type == '8') {
                                    lihtml = '<li>' +
                                        '<div class="li-title"><strong>出金审核失败' + text + '</strong><span>' + list[i].create_time + '</span></div>' +
                                        '<div class="li-p">' +
                                        '<p>' + `出金金额：${list[i].real_wallet}，审核失败原因·：${list[i].msg}` +
                                        '。</p></div></li>'
                                };

                                listHtml.push(lihtml);
                            };
                            $('.detail-list ul').html(listHtml.join(''));
                        }
                    }
                }
            })
        }
    };
    notify.init()
})(jQuery)