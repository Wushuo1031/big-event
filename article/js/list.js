
// 全局变量设置ajax请求参数，因为这些参数后续还会动态修改
let params = {
  pagenum: 1, // 页码，默认1，表示获取第1页的数据
  pagesize: 2, // 每页显示几条数据，这里的2表示每页两条数据
  // state: '', // 可填 已发布 草稿
  // cate_id:  // 分类id
}
// ----------------------------- 获取文章列表数据，渲染 -------------------------
function renderArticle() {
  axios.get(`/my/article/list`, { params }).then(res => {
    console.log(res.data);
    let { status, data, total } = res.data;
    if (status === 0) {
      let arr = [];
      data.forEach(item => {
        arr.push(`
        <tr>
            <td>${item.title}</td>
            <td>${item.cate_name}</td>
            <td>${item.pub_date}</td>
            <td>${item.state}</td>
            <td>
              <a href="./edit.html?id=${item.id}" type="button" class="layui-btn layui-btn-xs">编辑</a>
              <button data-id="${item.id}" type="button" class="layui-btn layui-btn-xs layui-btn-danger">删除</button>
            </td>
          </tr>
        `);
      });
      // 循环完毕，把数组转成字符串，放到tbody中
      $('tbody').html(arr.join('')); // jQuery的html方法比较怪，传递数组参数，html方法自动把数组转字符串
      // ajax请求成功后，再分页。因为分页的时候使用了数据总数，总数得等到ajax请求成功后才能得到
      showPage(total);
    }
  });
}

renderArticle();



// -----------------------------  分页  ---------------------------------------
function showPage(t) {
  let laypage = layui.laypage;
  //执行一个laypage实例
  laypage.render({
    elem: 'page', // 注意，这里的 test1 是 ID，不用加 # 号
    count: t, // 数据总数，从服务端得到
    limit: params.pagesize, // 表示每页几条数据
    curr: params.pagenum, // 当前页;获取的是第几页，这里就应该显示第几页
    limits: [2, 3, 5, 10],
    layout: ['limit', 'prev', 'page', 'next', 'count', 'skip'],
    jump: function (obj, first) {
      // obj包含了当前分页的所有参数，比如：
      // console.log(obj.curr); // 得到当前页，以便向服务端请求对应页的数据。
      // console.log(obj.limit); // 得到每页显示的条数

      // 首次不执行
      // console.log(first); // 第一次运行代码，first是true；后续切换页码的时候，first=undefined
      if (!first) {
        // do something
        // console.log(123); // 打开页面，这个代码不会运行；切换页码的时候，它会运行
        // 当切换页码的时候，比如切换到第3页。我们需要把请求参数 pagenum 改为3.最后，调用renderArticle()获取第3页的数据并渲染
        params.pagenum = obj.curr;
        params.pagesize = obj.limit;
        renderArticle();
      }
    }
  });
}


// -----------------------------  筛选  ---------------------------------------
// 1. 获取分类，渲染到下拉框的位置
axios.get(`/my/category/list`).then(res => {
  // console.log(res.data);
  let { status, data } = res.data;
  if (status === 0) {
    let arr = [];
    data.forEach(item => {
      arr.push(`
      <option value="${item.id}">${item.name}</option>
      `)
    });
    $('#category').append(arr.join(""))
    let form = layui.form;
    // form.render('select|checkbox|radio', '表单的lay-filter属性值'); // 表单元素如果是动态添加的，需要调用这个方法进行更新渲染
    form.render('select');
  }
})

// 2. 完成筛选
$('#search').on('submit', function (e) {
  e.preventDefault();
  // 获取下拉框的值
  let cate_id = $('#category').val();
  let state = $('#state').val();
  // 如果是全部分类，获取的值就是 空；如果是全部状态，值也是 空
  if (cate_id) {
    params.cate_id = cate_id;
  } else {
    delete params.cate_id; // 如果是全部分类，删除请求参数中的 cate_id
  }

  if (state) {
    params.state = state;
  } else {
    delete params.state;
  }

  // 重置pagenum=1
  params.pagenum = 1;

  // 修改了ajax请求参数，只需要发送请求获取数据即可
  renderArticle();
})


// -----------------------------  删除文章  ---------------------------------------
$('tbody').on('click', 'button:contains("删除")', function () {
  let that = $(this);
  let id = that.data('id');
  layer.confirm('你确定要删除吗？', function (index) {
    // 确定删除，通过DOM的方式移除当前的tr
    that.parents('tr').remove();

    // 完成删除文章
    axios.get(`/my/article/delete/${id}`).then(res => {
      let { status, message } = res.data;
      if (status === 0) {
        layer.msg(message);
        // 计算tbody里，还有没有子元素（tr），如果没有tr，params.pagenum--。再发送请求获取上一页的数据
        let trs = $('tbody').children();
        if (trs.length === 0 && params.pagenum !== 1) {
          params.pagenum--;
        }
        renderArticle();
      }
    })
    layer.close(index);
  })
})