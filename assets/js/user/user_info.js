$(function() {
    // 1.定义校验规则
    var form = layui.form
    form.verify({
        nickname: function(value) { //value：表单的值、item：表单的DOM对象
            if (value.length > 6) {
                return '昵称在1~6位字符';
            }
        }
    })

    // 2.获取用户信息
    function initUserInfo() {
        // 发送ajax
        $.ajax({
            type: 'get',
            url: '/my/userinfo',
            success: function(res) {
                if (res.status !== 0) {
                    return layui.layer.msg(res.message)
                }
                // console.log(res);
                // 将获取到的用户信息渲染到基本资料中
                form.val('formUserInfo', res.data)
            }
        })
    }

    initUserInfo()

    // 3.表单的重置
    $('#resetForm').on('reset', function(e) {
        e.preventDefault()
        initUserInfo()
    })

    // 4.修改用户信息
    $('#resetForm').on('submit', function(e) {
        e.preventDefault()
        $.ajax({
            type: 'post',
            url: '/my/userinfo',
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layui.layer.msg(res.message)
                }
                layui.layer.msg(res.message)

                // 调用父页面的getUserInfo()方法
                window.parent.getUserInfo()
            }
        })
    })









})