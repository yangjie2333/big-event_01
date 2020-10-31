$(function() {
    var layer = layui.layer
    var laypage = layui.laypage;

    template.defaults.imports.dataFormat = function(date) {
        var date = new Date(date)
        var y = date.getFullYear()
        var m = padZero(date.getMonth() + 1)
        var d = padZero(date.getDate())
        var h = padZero(date.getHours())
        var mm = padZero(date.getMinutes())
        var ss = padZero(date.getSeconds())
        return y + '-' + m + '-' + d + ' ' + h + ':' + mm + ':' + ss
    }

    function padZero(n) {
        return n < 10 ? '0' + n : n
    }

    var q = {
        pagenum: 1, // 页码值
        pagesize: 2, // 每页显示多少条数据
        cate_id: '', // 文章分类的 Id
        state: '', // 文章的状态， 可选值有： 已发布、 草稿   
    }


    // 获取文章列表数据
    function initTable() {
        $.ajax({
            url: '/my/article/list',
            data: q,
            success: function(res) {
                // console.log(res);
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                layer.msg(res.message)
                var htmlStr = template('tpl-table', res)
                $('tbody').html(htmlStr)
                renderPage(res.total)
            }
        })
    }

    initTable()
    initCate()

    var form = layui.form
        // 渲染分类
    function initCate() {
        $.ajax({
            url: "/my/article/cates",
            success: function(res) {
                // console.log(res);
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                layer.msg(res.message)

                // 传递对象,使用属性
                var htmlStr = template('tpl-cate', res)
                $('[name=cate_id]').html(htmlStr)
                form.render()
            }
        })
    }

    // 筛选
    $('#form-search').on('submit', function(e) {
        e.preventDefault()

        // 修改查询参数
        q.state = $('[name=state]').val()
        q.cate_id = $('[name=cate_id]').val()
            // console.log(q.state, q.cate_id);
            // 重新渲染表格数据
        initTable()
    })

    // 分页
    function renderPage(total) {
        // console.log(total);

        laypage.render({
            //注意，这里的 test1 是 ID，不用加 # 号
            elem: 'pageBox',
            //数据总数，从服务端得到
            count: total,
            // 每页显示的条数
            limit: q.pagesize,
            // 数据总数
            curr: q.pagenum,
            // jump触发的两种方式
            // 1.点击分页的时候
            // 2.调用 laypage.render方法会执行jump回调
            jump: function(obj, first) {
                //obj包含了当前分页的所有参数，比如：
                // console.log(obj.curr); //得到当前页，以便向服务端请求对应页的数据。
                // console.log(obj.limit); //得到每页显示的条数


                //首次不执行
                if (!first) {
                    //do something
                    q.pagenum = obj.curr
                    q.pagesize = obj.limit
                    initTable()
                }
            },
            // 分页功能项
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            // 每页条数的选择项
            limits: [2, 3, 5, 7, 10]
        })
    }

    // 删除
    $('body').on('click', '.btn-del', function() {
        var id = $(this).data('id')
        layer.confirm('确定删除?', { icon: 3, title: '提示' }, function(index) {
            //do something
            $.ajax({
                type: 'get',
                url: '/my/article/delete/' + id,
                success: function(res) {
                    // console.log(res);

                    if (res.status !== 0) {
                        return layer.msg(res.message)
                    }
                    layer.msg(res.message)

                    // 页面-1的条件,页面只有一个删除,且页码大于1
                    if ($('.btn-del').length === 1 && q.pagenum > 1) q.pagenum--

                        // 重新渲染表格
                        initTable()
                }
            })
            layer.close(index);
        });

    })

})