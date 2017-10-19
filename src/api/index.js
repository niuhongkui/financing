// import axios from 'axios';

var dev = {
    url: 'http://184.api.kr.xingyuanauto.com/financial/api',
    user: 'http://op.kr.xingyuanauto.com/portal/WebApi/GetUser',
    auth: 'http://op.kr.xingyuanauto.com/portal/auth/login?ReturnUrl=',
    logout: 'http://op.kr.xingyuanauto.com/portal/Auth/DoLogOut',
    menu: 'http://op.kr.xingyuanauto.com/portal/WebApi/GetMenuData',
    sidebar: 'http://op.kr.xingyuanauto.com/portal/WebApi/GetApplicationData',
    downurl: "http://184.api.kr.xingyuanauto.com/fastdfs/assets/zip/iamges"
}

var prod = {
    url: 'http://api.kr.xingyuanauto.com/financial/api',
    user: 'http://kr.xingyuanauto.com/portal/WebApi/GetUser',
    auth: 'http://kr.xingyuanauto.com/portal/auth/login?ReturnUrl=',
    logout: 'http://kr.xingyuanauto.com/portal/Auth/DoLogOut',
    menu: 'http://kr.xingyuanauto.com/portal/WebApi/GetMenuData',
    sidebar: 'http://kr.xingyuanauto.com/portal/WebApi/GetApplicationData',
    downurl: "http://api.kr.xingyuanauto.com/fastdfs/assets/zip/iamges"
}

import { Notification } from 'element-ui'
$(document).ajaxComplete(function(e, xhr, settings) {
    var _location;
    if (!xhr.responseJSON && xhr.responseText) {
        if (xhr.responseText.indexOf('<!DOCTYPE html>') > -1)
            window.location.href = prod.auth + window.location.href
    }
});

export default {
    ...prod,
    // axios,
    resource: function(options) {
        var loading
        var t
        var start = new Date()
        var self = this
        var end
            // options.context.$loading.close();
        t = setTimeout(function() {
            loading = options.context.$loading({
                // target: '.content-wrapper',
                fullscreen: true,
                text: '服务器努力加载中...'
            })
        }, 500)
        $.ajax({
            type: options.type,
            url: this.url + options.url,
            xhrFields: {
                withCredentials: true
            },
            data: options.data,
            crossDomain: true,
            success: function(data) {
                if (data['ErrorCode'] === '401') {
                    window.location.href = self.auth + window.location.href
                    return false
                }

                end = new Date()

                options.callback(data)

                if (loading) {
                    loading.close()
                }
                clearTimeout(t)
            },
            error: function(data) {
                clearTimeout(t)
                if (loading) loading.close()
                    // Notification.error({
                    //   title: '错误',
                    //   message: data.statusText + '\n' + data.responseJSON.ExceptionMessage
                    // })
            }
        })

    }
}


// WEBPACK FOOTER //
// ./src/api/index.js