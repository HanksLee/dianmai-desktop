(function ($) {
    var strategyDetails = {
        strategyDetailsList: [],
        flagid: '',
        timer: null,
        ft: true,
        ft1: false,
        data: {},
        url: null,
        stock_key: '',
        init: function () {
            if (this.timer !== null) {
                window.clearInterval(this.timer)
            }
            this.getFlag();
            this.getDetails();
            var domain = document.domain;
            var firstDomain = domain.substring(domain.indexOf('.') + 1, domain.length);
            if (firstDomain == 'ruthinks.com') {
                $('.noRuthinks').hide();
            };
            if (firstDomain == 'zggjcenter.com') {
                $('.title em').text('交易详情');
            };
            if (firstDomain == 'liangrong-fund.com') {
                // $('#celvxiangq').text('交易详情');
                document.title = '交易详情'
            };
            if (firstDomain == 'boloniasia.com') {
                // $('#celvxiangq').text('订单详情');
                document.title = '订单详情'
            };
            if (firstDomain == 'huachihk.com' || firstDomain == 'huifengstocks.com') {
                $('.bond_name').text('冻结资金：')
            } else {
                $('.bond_name').text('操作资金：')
            }
            $('.transfer-profit-dl em').click(function () {
                $('.guanbi-diyan,.bg').show()
            });
            $('.profit-dl em').click(function () {
                $('.profit-modal,.bg').show()
            });
            $('#diyan-but,.bg,.profit-modal').click(function () {
                $('.guanbi-diyan,.bg,.profit-modal').hide()
            });
            if (firstDomain == 'dingmaohongsheng.com') {
                $('.duo-kong-hide').hide()
                $('.jia-strong-kai').text('开仓价格：');
                $('.jia-strong-ping').text('平仓价格：');
            } else {
                $('.duo-kong-hide').show()
                $('.duo-kong-hide').text('多头')
            };

        },
        getFlag: function () {
            var hash = window.location.hash,
                query = hash.split('?');
            query = query.length > 1 ? query[1] : '';
            strategyDetails.flagid = utils.getQueryParam(query, 'flagid') || '';
            strategyDetails.outid = utils.getQueryParam(query, 'outid') || '';
            //console.log(strategyDetails.flagid);
            //console.log(strategyDetails.outid);
            if (strategyDetails.outid == '1') {
                strategyDetails.url = '/v1_home/policy/posdetail';
                $('.close-rates').hide();
                $('.selling-dl').hide()
                $('.curent').show()
                $('.offset').hide()
                $('.guanbi-diyan-bt').text("当前盈亏")
                $('.guanbi-diyan p').text("当前盈亏不包含建仓费用以及递延费用")
                $('.profit-modal p').text("当前盈亏-买入费用-卖出费用-递延费")
            }
            if (strategyDetails.outid == '2') {
                strategyDetails.url = '/v1_home/policy/hisdetail';
                $('.close-rates').show();
                $('.selling-dl').show()
                $('.curent').hide()
                $('.offset').show()
                $('.guanbi-diyan-bt').text("平仓盈亏")
                $('.guanbi-diyan p').text("平仓盈亏不包含平仓费用以及递延费用")
                $('.profit-modal p').text("平仓盈亏-买入费用-卖出费用-递延费")
            }
        },
        getDetails: function () {
            ajaxPost({
                url: strategyDetails.url,
                data: { id: strategyDetails.flagid },
                success: function (res) {
                    if (res.code == '200') {
                        var data = res.data;
                        strategyDetails.data = data;
                        strategyDetails.stock_key = data.stock_key;
                        // strategyDetails.stock_key=data.stock_code+'_'+data.stock_type+'_'+data.market_id
                        var domain = document.domain;
                        var firstDomain = domain.substring(domain.indexOf('.') + 1, domain.length);
                        $('.name-code').text(data.stock_name + '/' + data.stock_code);
                        $('.product-type').text(data.policy_type);
                        $('.capitalRatio').text(data.leverage);
                        $('.eduction').text(Number(data.coupon_money).toFixed(3));
                        if (firstDomain == 'huifengstocks.com' || firstDomain == 'huachihk.com') {
                            $('.bond').text('HK$' + Number(data.init_margin).toFixed(3));
                            $('.profiting-amount').text('HK$' + Number(data.huoli).toFixed(3));
                        } else {
                            $('.bond').text('￥' + Number(data.init_margin).toFixed(3));
                            $('.profiting-amount').text('￥' + Number(data.huoli).toFixed(3));
                        }
                        if (firstDomain == 'zggjcenter.com') {
                            $('.direction').text(data.cmd == 0 ? '买涨/做多' : '买跌/做空');
                        } else {
                            $('.direction').text(data.cmd == 0 ? '多头合约' : '空头合约');
                        }
                        if (firstDomain == 'dingmaohongsheng.com') {
                            $('.buying-time').text(data.open_time.substring(0, 16));
                            $('.direction').text('多头合约');
                        } else {
                            $('.buying-time').text(data.open_time);
                        }
                        if (firstDomain == 'liangrong-fund.com') {
                            $('.direction').text(data.cmd == 0 ? '融资买涨' : '融券买跌');
                        }

                        //$('.buy-average').text(Number(data.open_price));
                        if (data.market_id == '6' || data.market_id == '7' || data.market_id == '8' || data.market_id == '9' || data.market_id == '10') {
                            $('.buying-quantity').text(Number(data.volume) / Number(data.lots_size));
                        } else {
                            $('.buying-quantity').text(data.volume)
                        };
                        //$('.buy-amount').text(Number(data.open_market_value).toFixed(3));
                        if (data.market_id == '6' || data.market_id == '7' || data.market_id == '8' || data.market_id == '9' || data.market_id == '10') {
                            $('.sell-quantity').text(Number(data.left_volume) / Number(data.lots_size));
                        } else {
                            $('.sell-quantity').text(Number(data.left_volume));
                        }
                        if (firstDomain == 'dingmaohongsheng.com') {
                            $('.selling-time').text(data.close_time.substring(0, 16));
                        } else {
                            $('.selling-time').text(data.close_time);
                        }
                        //$('.transfer-profit-and-loss').text(Number(data.close_profit.toFixed(3)));
                        //$('.current-price').text(Number(data.now_price));
                        //$('.current-market-value').text(Number(data.now_market_value).toFixed(3));
                        //$('.current-profit-and-loss').text(Number(data.now_profit).toFixed(3));
                        var str = '￥'
                        if (data.market_id == '3') {
                            str = 'HK$'
                        }
                        var num2 = Number(data.buy_commission) + Number(data.service_fee) + Number(data.buy_securities_fee);
                        var num = Number(data.buy_commission) + '+' + Number(data.service_fee) + '+' + Number(data.buy_securities_fee) + '=' + str + num2.toFixed(3)
                        //$('.buy-cost').text(num);
                        var num1 = Number(data.sell_commission) + Number(data.sell_securities_fee);
                        var num3 = Number(data.sell_commission) + '+' + Number(data.sell_securities_fee) + '=' + str + num1.toFixed(3)
                        //$('.selling-cost').text(num3);
                        // $('.fer').text(Number(data.delay_fee).toFixed(3) + '/' + data.delay_days);
                        //$('.platform-profit-sharing').text(Number(data.real_div_profit).toFixed(3));
                        if (Number(data.open_rate) !== 1) {
                            $('.buy-exchange-rate').text(data.open_rate);
                        }
                        if (Number(data.close_rate) !== 1) {
                            $('.close-rate').text(data.close_rate);
                        }
                        if (strategyDetails.ft) {
                            strategyDetails.showHideFn();
                        }
                        // $('.tp-jin').text(data.tp_money);
                        // $('.sl-jin').text(data.sl_money);
                        // $('.tp-jia').text(data.tp);
                        // $('.sl-jia').text(data.sl);
                        if (data.stock_type == '1') {
                            $('.jiaoyi-type').show()
                            $('.dl-gupian').hide()
                            $('.dl-diancha').show()
                            $('.jiaoyi-type1').hide()
                        } else if (data.stock_type == '2') {
                            $('.jiaoyi-type1').show()
                            $('.jiaoyi-type').hide()
                            $('.dl-gupian').hide()
                            $('.dl-diancha').show()
                        } else {
                            $('.jiaoyi-type1').hide()
                            $('.jiaoyi-type').hide()
                            $('.dl-gupian').show()
                            $('.dl-diancha').hide()
                        }
                        if (data.market_id == '3') {
                            $('.mairushouxufei').text('HK$' + data.buy_commission);
                            $('.maichushouxufei').text('HK$' + data.sell_commission);
                            $('.diyanfei').text('HK$' + data.delay_fee + '/' + data.delay_days);
                            $('.sell-the-average-price').text('HK$' + Number(data.close_price).toFixed(3));
                            $('.buy-amount').text('HK$' + Number(data.open_market_value).toFixed(3));
                            $('.buy-average').text('HK$' + Number(data.open_price));
                            $('.transfer-profit-and-loss').text('HK$' + Number(data.close_profit.toFixed(3)));
                            $('.current-market-value').text('HK$' + Number(data.now_market_value).toFixed(3));
                            $('.current-price').text('HK$' + Number(data.now_price));
                            if (Number(data.now_profit) > 0) {
                                $('.current-profit-and-loss').html('<span style="color:#f00;">HK$' + Number(data.now_profit).toFixed(3) + '</span>');
                            } else if (Number(data.now_profit) === 0) {
                                $('.current-profit-and-loss').text('HK$' + Number(data.now_profit).toFixed(3))
                            } else {
                                $('.current-profit-and-loss').html('<span style="color:rgb(40, 240, 100);">HK$' + Number(data.now_profit).toFixed(3) + '</span>');
                            }
                            if (Number(data.close_profit) > 0) {
                                $('.offset-profit-and-loss').html('<span style="color:#f00;">HK$' + Number(data.close_profit).toFixed(3) + '</span>');
                            } else if (Number(data.close_profit) === 0) {
                                $('.offset-profit-and-loss').text('HK$' + Number(data.close_profit).toFixed(3))
                            } else {
                                $('.offset-profit-and-loss').html('<span style="color:rgb(40, 240, 100);">HK$' + Number(data.close_profit).toFixed(3) + '</span>');
                            }
                            $('.buy-cost').text(num);
                            $('.selling-cost').text(num3);
                            $('.fer').text('HK$' + Number(data.delay_fee).toFixed(3) + '/' + data.delay_days);
                            $('.platform-profit-sharing').text('HK$' + Number(data.real_div_profit).toFixed(3));
                            $('.tp-jin').text('HK$' + data.tp_money);
                            $('.sl-jin').text('HK$' + data.sl_money);
                            $('.tp-jia').text('HK$' + data.tp);
                            $('.sl-jia').text('HK$' + data.sl);
                        } else {
                            $('.mairushouxufei').text('￥' + data.buy_commission);
                            $('.maichushouxufei').text('￥' + data.sell_commission);
                            $('.diyanfei').text('￥' + data.delay_fee + '/' + data.delay_days);
                            $('.sell-the-average-price').text('￥' + Number(data.close_price).toFixed(3));
                            $('.buy-amount').text('￥' + Number(data.open_market_value).toFixed(3));
                            $('.buy-average').text('￥' + Number(data.open_price));
                            $('.transfer-profit-and-loss').text('￥' + Number(data.close_profit.toFixed(3)));
                            $('.current-market-value').text('￥' + Number(data.now_market_value).toFixed(3));
                            $('.current-price').text('￥' + Number(data.now_price));
                            $('.current-profit-and-loss').text('￥' + Number(data.now_profit).toFixed(3));
                            if (Number(data.now_profit) > 0) {
                                $('.current-profit-and-loss').html('<span style="color:#f00;">￥' + Number(data.now_profit).toFixed(3) + '</span>');
                            } else if (Number(data.now_profit) === 0) {
                                $('.current-profit-and-loss').text('￥' + Number(data.now_profit).toFixed(3))
                            } else {
                                $('.current-profit-and-loss').html('<span style="color:rgb(40, 240, 100);">￥' + Number(data.now_profit).toFixed(3) + '</span>');
                            }
                            if (Number(data.close_profit) > 0) {
                                $('.offset-profit-and-loss').html('<span style="color:#f00;">￥' + Number(data.close_profit).toFixed(3) + '</span>');
                            } else if (Number(data.close_profit) === 0) {
                                $('.offset-profit-and-loss').text('￥' + Number(data.close_profit).toFixed(3))
                            } else {
                                $('.offset-profit-and-loss').html('<span style="color:rgb(40, 240, 100);">￥' + Number(data.close_profit).toFixed(3) + '</span>');
                            }
                            $('.buy-cost').text(num);
                            $('.selling-cost').text(num3);
                            $('.fer').text('￥' + Number(data.delay_fee).toFixed(3) + '/' + data.delay_days);
                            $('.platform-profit-sharing').text('￥' + Number(data.real_div_profit).toFixed(3));
                            $('.tp-jin').text('￥' + data.tp_money);
                            $('.sl-jin').text('￥' + data.sl_money);
                            $('.tp-jia').text('￥' + data.tp);
                            $('.sl-jia').text('￥' + data.sl);
                        }
                        if (data.organ.tp_sl_witch == '0') {
                            $('.jiner').show()
                            if (data.tp_money > 0) {
                                $('.zhiyingjin').show()
                            }
                            if (data.sl_money > 0) {
                                $('.zhisuijin').show()
                            }
                        } else {
                            $('.jiage').show()
                            if (data.tp > 0) {
                                $('.zhiyingjia').show()
                            }
                            if (data.sl > 0) {
                                $('.zhisuijia').show()
                            }
                            if (data.tp <= 0 && data.sl <= 0) {
                                $('.jiage').hide()
                            }
                        }
                        if (data.stop_redeem_rate > 0) {
                            $('.tingpai').text('停牌')
                            $('.tingpai,.shuhui').show()
                            $('.shuhui-cost').text(data.stop_fee)
                            $('.shuhui-feilv').text(Number(data.stop_redeem_rate) * 100 + '%')
                        }
                        var markeType = data.market_id
                        var markeName = ''
                        if (markeType == 1) {
                            markeName = '深圳主板'
                        } else if (markeType == 2) {
                            markeName = '深圳创业板'
                        } else if (markeType == 3) {
                            markeName = '港股'
                        } else if (markeType == 4) {
                            markeName = '美股'
                        } else if (markeType == 5) {
                            markeName = 'ETF'
                        } else {
                            markeName = '上证'
                        }
                        $('.market-type').text(markeName);

                    }
                }
            })
        },
        showHideFn: function () {
            if (Number(strategyDetails.data.open_rate) !== 1) {
                $('.buy-exchange-rate-box').show()
            } else {
                $('.buy-exchange-rate-box').hide()
            }
            if (Number(strategyDetails.data.close_rate) !== 1) {
                //console.log(45678909876)
                $('.close-rates-box').css({ 'display': 'block' })
            } else {
                $('.close-rates-box').hide()
            }
            var count = 0;
            if (Number(strategyDetails.outid) == 1) {
                var domain = document.domain;
                var firstDomain = domain.substring(domain.indexOf('.') + 1, domain.length);
                if (firstDomain == 'liangrong-fund.com' || firstDomain == 'boloniasia.com' || firstDomain == 'raytekasia.com' || firstDomain == 'acarpsgroup.com') {
                    strategyDetails.refreshDetail();
                } else {
                    strategyDetails.timer = setInterval(
                        function () {
                            count++;
                            if (document.getElementById('strategyDetails')) {
                                strategyDetails.ft = false
                                // strategyDetails.getDetails()
                                strategyDetails.updateData()
                            } else {
                                strategyDetails.ft = true
                                window.clearInterval(strategyDetails.timer)
                            }
                            if (count > 200) {
                                count = 0;
                                window.clearInterval(strategyDetails.timer)
                                strategyDetails.getDetails()
                                strategyDetails.refreshDetail();
                            }
                        }, 10000);
                }
            }

        },
        //根据产品报价进行当前市值，当前价格，当前盈亏计算与更新
        updateData() {
            ajaxPost({
                url: '/v1_home/stock/price',
                data: {
                    stock_key: strategyDetails.stock_key
                },
                success: function (res) {
                    if (res.code == 200) {
                        // console.info('更新数据获取成功')
                        var quote1 = 0; var quote2 = 0; var quote3 = 0;
                        // for(var i=0;i<res.data.length;i++){
                        if (strategyDetails.data.stock_name == res.data[0].stock_name) {
                            //获取报价,计算报价
                            quote1 = res.data[0].now_price * Number(strategyDetails.data.left_volume) * Number(strategyDetails.data.pip_value)
                            quote2 = res.data[0].now_price
                            if (strategyDetails.data.cmd == 0) {
                                quote3 = (res.data[0].now_price - Number(strategyDetails.data.open_price)) * Number(strategyDetails.data.left_volume) * Number(strategyDetails.data.pip_value)
                            } else {
                                quote3 = (Number(strategyDetails.data.open_price) - res.data[0].now_price) * Number(strategyDetails.data.left_volume) * Number(strategyDetails.data.pip_value)
                            }
                            var str = '￥'
                            if (strategyDetails.data.market_id == '3') {
                                str = 'HK$'
                            }
                            //更新当前市值
                            $('.current-market-value').text(str + quote1.toFixed(3))
                            // if(quote1.toFixed(3)<0){
                            //     $('.current-market-value').css({ 'color': '#28F064' })
                            //   }else{
                            //     $('.current-market-value').css({ 'color': '#FF0000' })
                            // }
                            //更新当前价格
                            $('.current-price').text(str + quote2)
                            // if(quote2.toFixed(3)<0){
                            //     $('.current-price').css({ 'color': '#28F064' })
                            //   }else{
                            //     $('.current-price').css({ 'color': '#FF0000' })
                            // }
                            //更新当前盈亏
                            $('.current-profit-and-loss').text(str + quote3.toFixed(3))
                            if (quote3.toFixed(3) < 0) {
                                $('.current-profit-and-loss').css({ 'color': '#28F064' })
                            } else {
                                $('.current-profit-and-loss').css({ 'color': '#FF0000' })
                            }
                        }
                        // }
                    }
                }
            })
        },
        refreshDetail: function () {
            var count = 0;
            ajaxPost({
                url: '/v1_home/activenavigate/list',
                success: function (res) {
                    if (res.code === 200) {
                        var time = Number(res.data.order_time_t) * 1000
                        strategyDetails.timer = setInterval(
                            function () {
                                count++;
                                if (document.getElementById('strategyDetails')) {
                                    strategyDetails.ft = false
                                    // strategyDetails.getDetails()
                                    strategyDetails.updateData()
                                } else {
                                    strategyDetails.ft = true
                                    window.clearInterval(strategyDetails.timer)
                                }
                                if (count > 200) {
                                    count = 0;
                                    window.clearInterval(strategyDetails.timer)
                                    strategyDetails.getDetails()
                                    strategyDetails.refreshDetail();
                                }
                            }, time);
                    }
                }
            })
        }
    };
    strategyDetails.init()
})(jQuery)
