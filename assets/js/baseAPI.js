// $.ajaxPrefilter需要绑定在所有ajax之前,会在ajax请求执行后再执行,只有这个方法执行完成,ajax才会去真正发送

// 注意：每次调用 $.get() 或 $.post() 或 $.ajax() 的时候，
// 会先调用 ajaxPrefilter 这个函数
// 在这个函数中，可以拿到我们给Ajax提供的配置对象
// 开发环境
var baseUrl = 'http://ajax.frontend.itheima.net'

// 测试环境
// var baseUrl = 'http://ajax.frontend.itheima.net'
// 生产环境
// var baseUrl = 'http://ajax.frontend.itheima.net'
$.ajaxPrefilter(function(options) {
    // 1.拼接url
    // 在发起真正的 Ajax 请求之前，统一拼接请求的根路径
    options.url = baseUrl + options.url

    // 2.添加身份认证
    // 统一为需要有权限的接口加headers
    // 判断接口url是否有/my/字符串,有的话添加headers
    if (options.url.indexOf('/my/') !== -1) {
        options.headers = {
            Authorization: localStorage.getItem('token') || ''
        }
    }

    // 3.登录拦截
    options.complete = function(res) {
        console.log(res);
        if (res.responseJSON.status === 1 && res.responseJSON.message === "身份认证失败！") {
            // 强制清除token
            localStorage.removeItem('token')

            // 跳转到login.html
            location.href = '/login.html'
        }
    }
})