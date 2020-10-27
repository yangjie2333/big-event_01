// 入口函数
$(function() {
    getUserInfo()

})


//获取用户信息(封装到入口函数外面,定义为全局函数)
// 原因:后面需要调用
function getUserInfo() {
    // 发送ajax
    $.ajax({
        type: 'get',
        url: '/my/userinfo',
        // 设置请求头
        // localStorage.getItem()获取不到值,返回null
        // headers: {
        //     Authorization: localStorage.getItem('token') || ''
        // },
        success: function(res) {
            // console.log(res);
            if (res.status !== 0) {
                return layui.layer.msg(res.message)
            }
            renderAvatar(res.data)
        }
    })
}
// 封装用户头像渲染函数
function renderAvatar(user) {
    // 用户名(昵称优先)
    var name = user.nickname || user.username

    // 渲染欢迎文本
    $('.welcome').html('欢迎&nbsp;&nbsp;' + name)

    // 判断用户是否有头像
    if (user.user_pic) {
        // 有头像
        $('.text-avatar').hide()
        $('.layui-nav-img').show().prop('src', user.user_pic)
    } else {
        // 没有头像,将用户名的第一个字符作为头像
        var first = name[0].toUpperCase()
        $('.text-avatar').show().html(first)
        $('.layui-nav-img').hide()

    }
}