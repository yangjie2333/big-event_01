$(function() {
    // 1.点击链接显示与隐藏
    $('#link-reg').on('click', function() {
        $('.login-box').hide()
        $('.reg-box').show()
    })
    $('#link-login').on('click', function() {
        $('.reg-box').hide()
        $('.login-box').show()
    })

    // 2.表单验证
    var form = layui.form
    var layer = layui.layer
    form.verify({
        pwd: [
            /^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'
        ],

        repwd: function(value) {
            var pwd = $('.reg-box [name=password]').val()
            if (pwd !== value) {
                return '两次密码输入不一致'
            }
        }
    })

    //3. 注册
    $('#form_reg').on('submit', function(e) {
        // 阻止默认事件
        e.preventDefault()
        $.ajax({
            type: 'post',
            url: '/api/reguser',
            data: {
                username: $('.reg-box [name=username]').val(),
                password: $('.reg-box [name=password]').val()
            },
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                layer.msg('注册成功')
                $('#link-login').trigger('click')

                // 清空form表单,原生方法reset()
                $('#form_reg')[0].reset()
            }
        })
    })

    // 4.登录
    $('#form_login').on('submit', function(e) {
        // 阻止默认事件
        e.preventDefault()
            // console.log($(this).serialize());
        $.ajax({
            type: 'post',
            url: '/api/login',
            // 快速获取表单k/v数据
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                layer.msg(res.message)

                // 把获取到的token值存入本地存储
                localStorage.setItem('token', res.token)

                // 跳转到首页
                location.href = '/index.html'
            }
        })
    })


})