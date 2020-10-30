$(function() {
    // 渲染表格内容
    function initArtCateList() {
        $.ajax({
            type: 'get',
            url: '/my/article/cates',
            success: function(res) {
                // console.log(res);
                if (res.status !== 0) {
                    return layui.layer.msg(res.message)
                }

                // 使用模板引擎渲染tbody页面
                var htmlStr = template('tpl-table', res)
                $('tbody').html(htmlStr)
            }
        })
    }

    initArtCateList()


    var indexAdd = null
    var indexEdit = null
    var layer = layui.layer
    var form = layui.form
    $('#btnAddCate').on('click', function() {
        indexAdd = layer.open({
            type: 1,
            area: ['500px', '249px'],
            title: '添加文章分类',
            content: $('#diaLogAdd').html()
        });
    })


    // 表单是动态创建的,通过事件委托绑定事件
    $('body').on('submit', '#form-add', function(e) {
        e.preventDefault()
        $.ajax({
            type: 'post',
            url: '/my/article/addcates',
            data: $(this).serialize(),
            success: function(res) {
                // console.log(res);
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                layer.msg(res.message)
                initArtCateList()

                // 关闭弹出层
                layer.close(indexAdd)
            }
        })
    })

    // 点击编辑,输入框渲染数据
    $('body').on('click', '.btn-edit', function() {
        indexEdit = layer.open({
            type: 1,
            area: ['500px', '249px'],
            title: '修改文章分类',
            content: $('#diaLogEdit').html(),
        });

        var id = $(this).data('id')

        $.ajax({
            type: 'get',
            url: '/my/article/cates/' + id,
            success: function(res) {
                // console.log(res);
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                form.val('form-edit', res.data)
            }
        })
    })

    // 确认修改-提交
    $('body').on('submit', '#form-edit', function(e) {
        e.preventDefault()

        $.ajax({
            type: 'post',
            url: '/my/article/updatecate',
            data: $(this).serialize(),
            success: function(res) {
                // console.log(res);
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                layer.msg(res.message)
                initArtCateList()
                layer.close(indexEdit)
            }
        })
    })

    // 删除
    var indexDel = null
    $('body').on('click', '.btn-del', function() {

        var id = $(this).data('id')
        indexDel = layer.confirm('确认删除?', { icon: 3, title: '提示' }, function(index) {
            //do something
            $.ajax({
                url: "/my/article/deletecate/" + id,
                type: 'get',
                success: function(res) {
                    console.log(res);
                    if (res.status !== 0) {
                        return layer.msg(res.message)
                    }
                    layer.msg(res.message)
                    initArtCateList()
                    layer.close(indexDel)
                }
            })

        });
    })
})