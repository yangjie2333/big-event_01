$(function() {
    // 1.1 获取裁剪区域的 DOM 元素
    var $image = $('#image')
        // 1.2 配置选项
    const options = {
        // 纵横比
        aspectRatio: 1,
        // 指定预览区域
        preview: '.img-preview'
    }

    // 1.3 创建裁剪区域
    $image.cropper(options)

    // 2.点击按钮选择图片
    $('#btnChooseImage').on('click', function() {
        $('#file').click()
    })

    // 3.更换裁剪区域图片
    $('#file').on('change', function() {
        // 获取上传图片
        // files属性是一个伪数组
        var file = this.files
        if (file === undefined) {
            return layui.layer.msg('请选择图片!')
        }
        // console.log(file);
        var imgUrl = URL.createObjectURL(file[0])

        $image
            .cropper('destroy') // 销毁旧的裁剪区域
            .attr('src', imgUrl) // 重新设置图片路径
            .cropper(options) // 重新初始化裁剪区域
    })


    $('#btnUpload').on('click', function() {
        var dataURL = $image //$image===$('#image')
            .cropper('getCroppedCanvas', {
                // 创建一个 Canvas 画布
                width: 100,
                height: 100
            })
            .toDataURL('image/png')
        $.ajax({
            type: 'post',
            url: '/my/update/avatar',
            data: {
                avatar: dataURL
            },
            success: function(res) {
                if (res.status !== 0) {
                    return layui.layer.msg(res.message)
                }
                layui.layer.msg(res.message)

                // 刷新渲染页面
                window.parent.getUserInfo()
            }
        })
    })
})