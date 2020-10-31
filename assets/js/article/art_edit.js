$(function() {
    var layer = layui.layer
    var form = layui.form


    // console.log(123);
    // console.log(location.search.split('=')[1]);
    var id = location.search.split('=')[1]

    // 渲染表单内容
    function editForm() {
        $.ajax({
            type: 'get',
            url: '/my/article/' + id,
            success: function(res) {
                console.log(res);
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                form.val('form-edit', res.data)
                    // console.log(res.data.content);
                tinyMCE.activeEditor.setContent(res.data.content)

                if (!res.data.cover_img) {
                    return layer.msg('未上传头像')
                }

                var imgUrl = baseUrl + res.data.cover_img
                console.log(imgUrl);
                $image
                    .cropper('destroy') // 销毁旧的裁剪区域
                    .attr('src', imgUrl) // 重新设置图片路径
                    .cropper(options) // 重新初始化裁剪区域
            }
        })
    }
    editForm()



    // 初始化富文本编辑器
    initEditor()

    function initCate() {
        $.ajax({
            type: 'get',
            url: '/my/article/cates',
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                var htmlStr = template('tpl-cate', res)
                $('[name=cate_id]').html(htmlStr)

                form.render()
                editForm()
            }
        })
    }

    initCate()

    // 1. 初始化图片裁剪器
    var $image = $('#image')

    // 2. 裁剪选项
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }

    // 3. 初始化裁剪区域
    $image.cropper(options)

    // 为选择封面的按钮，绑定点击事件处理函数
    $('#btnChooseImage').on('click', function() {
        $('#coverFile').click()
    })

    // 监听 coverFile 的 change 事件，获取用户选择的文件列表
    $('#coverFile').on('change', function(e) {
        // 获取到文件的列表数组
        var files = this.files
            // 判断用户是否选择了文件
        if (files.length === 0) {
            return
        }
        // 根据文件，创建对应的 URL 地址
        var newImgURL = URL.createObjectURL(files[0])
            // 为裁剪区域重新设置图片
        $image
            .cropper('destroy') // 销毁旧的裁剪区域
            .attr('src', newImgURL) // 重新设置图片路径
            .cropper(options) // 重新初始化裁剪区域
    })

    // 设置状态
    var state = '已发布'

    // $('#btnSave1').on('click',function () {
    //     state = '已发布'
    // })
    $('#btnSave2').on('click', function() {
        state = '草稿'
    })

    // 添加文章
    $('#form-edit').on('submit', function(e) {
        e.preventDefault()
        var fd = new FormData(this)
        fd.append('state', state)
            // console.log(...fd);

        // 生成图片文件是一个异步操作
        $image
            .cropper('getCroppedCanvas', {
                // 创建一个 Canvas 画布
                width: 400,
                height: 280
            })
            .toBlob(function(blob) {
                // 将 Canvas 画布上的内容，转化为文件对象
                // 得到文件对象后，进行后续的操作
                // 5. 将文件对象，存储到 fd 中
                fd.append('cover_img', blob)

                // 6. 发起 ajax 数据请求
                publishArticle(fd)
            })
    })


    function publishArticle(fd) {
        $.ajax({
            type: 'post',
            url: '/my/article/edit',
            data: fd,
            contentType: false,
            processData: false,
            success: function(res) {
                console.log(res);
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                layer.msg(res.message)

                // location.href = '/article/art_list.html'
                //    优化
                setTimeout(function() {
                    window.parent.document.getElementById('art-list').click()
                }, 5000)

            }
        })
    }
})