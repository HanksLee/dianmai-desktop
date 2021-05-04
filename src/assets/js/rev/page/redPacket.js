(function ($) {
    var redPacket = {
        init: function () {
            this.getList();
        },
        getList: function () {
            ajaxPost({
                url: '/v1_home/coupongrant/my',
                success: function (res) {
                    if (res.code == '200') {
                        var list = res.data.coupon || [],
                            htmlT, htmlTData = [];
                        if (list.length > 0) {
                            for (var i = 0; i < list.length; i++) {
                                var classStr = i % 2 == 0 ? 'class="tr-bg"' : '',
                                    statusClass = status == '1' ? 'class="status-color-r"' : 'class="status-color-g"',
                                    coupon_code = list[i].coupon_code ? list[i].coupon_code : '',
                                    coupon_name = list[i].coupon_name ? list[i].coupon_name : '',
                                    limit_money = list[i].limit_money ? list[i].limit_money : '',
                                    div_money = list[i].div_money ? list[i].div_money : '',
                                    create_time = list[i].create_time ? list[i].create_time : '',
                                    expire_time = list[i].expire_time ? list[i].expire_time : '',
                                    status = list[i].status ? list[i].status : '';
                                if (status == '1') {
                                    status = '已使用'
                                } else if (list[i].status == '0') {
                                    status = '未使用'
                                }
                                htmlT = '<tr ' + classStr + ' >' +
                                    '<td>' + coupon_code + '</td>' +
                                    '<td>' + coupon_name + '</td>' +
                                    '<td>' + limit_money + '</td>' +
                                    '<td>' + div_money + '</td>' +
                                    '<td>' + create_time + '</td>' +
                                    '<td>' + expire_time + '</td>' +
                                    '<td ' + statusClass + '>' + status + '</td>' +
                                    '</tr>';

                                htmlTData.push(htmlT);
                                //console.log(htmlTData);       
                            }
                            if (htmlTData.length > 0) {
                                $('#coupon-list tbody').html(htmlTData.join(''));
                            }
                        } else {
                            $('#coupon-list tbody').html('<tr class="tr-bg"><td colspan="7">暂无数据</td></tr>');
                        }
                    }
                }
            })
        }
    };
    redPacket.init()
})(jQuery)