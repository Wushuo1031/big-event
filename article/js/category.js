// ----------------------------- 获取分类，渲染 ------------------------------------
function renderCategory() {
  axios.get(`/my/category/list`).then(res => {
    console.log(res);
    let { status, data } = res.data;
    if (status === 0) {
      let arr = [];
      data.forEach(item => {
        arr.push(`
        <tr>
            <td>${item.name}</td>
            <td>${item.alias}</td>
            <td>
              <button data-id="${item.id}" data-name="${item.name}" data-alias="${item.alias}" type="button" class="layui-btn layui-btn-xs">编辑</button>
              <button data-id="${item.id}" type="button" class="del layui-btn layui-btn-xs layui-btn-danger">删除</button>
            </td>
          </tr>
        `);
      });
      // 变量之后，把拼接的所有tr放到tbody中
      $('tbody').html(arr.join(''));
    }
  });
}

renderCategory();


// ----------------------------- 删除分类 ------------------------------------
$('tbody').on('click', '.del', function () {
  // 这里获取id，不要在弹层里面，因为this指向会改变
  // let id = $(this).attr('data-id');
  let id = $(this).data('id'); // jQuery的data方法，专门用于获取 data-xx 属性值
  layer.confirm('你确定要删除吗？', function (index) {
    // do something
    axios.get(`/my/category/delete?id=${id}`).then(res => {
      let { status, message } = res.data;
      if (status === 0) {
        layer.msg(message);
        renderCategory();
      }
    });
    layer.close(index);
  });
})

// ---------------------------------- 添加类别 -------------------------------
let addIndex;
// 1. 添加 添加类别 按钮，出现弹层
$('button:contains("添加类别")').on('click', function () {
  addIndex = layer.open({
    type: 1,
    title: '在线调试',
    content: $('#tpl-add').html(),
    area: ['500px', '250px']
  });
})

// 2. 表单提交，完成添加
$('body').on('submit', '#add-form', function (e) {
  e.preventDefault();
  let data = $(this).serialize();
  // console.log(data);
  axios.post(`/my/category/add`, data).then(res => {
    let { status, message } = res.data;
    if (status === 0) {
      layer.msg(message);
      renderCategory();
      // 添加成功，关闭弹出
      layer.close(addIndex);
    }
  });
});


// ---------------------------------- 编辑类别 -------------------------------
let editIndex;
// 1. 点击 编辑 按钮，出现弹层
$('tbody').on('click', 'button:contains("编辑")', function () {
  let shuju = $(this).data();
  // console.log(shuju); // { id: 3, name: '体育', alias: 'sports' }

  editIndex = layer.open({
    type: 1,
    title: '在线调试',
    content: $('#tpl-edit').html(),
    area: ['500px', '250px'],
    // 弹出出现后，才会执行下面的函数
    success: function () {
      // 2. 设置输入框的默认值（数据回填、为表单赋值）
      // 弹出出现之后，再数据回填
      // $('#edit-form input[name=name]').val(shuju.name);
      // $('#edit-form input[name=alias]').val(shuju.alias);
      let form = layui.form; // 使用layui的模块，必须先加载它
      // form.val('表单的lay-filter属性值', '对象格式的数据');
      form.val('abc', shuju); // layui文档-内置模块-表单-目录-表单赋值/取值
    }
  });
})


// 3. 表单提交，完成更新
$('body').on('submit', '#edit-form', function (e) {
  e.preventDefault();
  let data = $(this).serialize(); // name=xxx&alias=xxx&id=xxx
  // console.log(data);
  axios.post(`/my/category/update`, data).then(res => {
    let { status, message } = res.data;
    if (status === 0) {
      layer.msg(message);
      renderCategory();
      // 修改成功，关闭弹出
      layer.close(editIndex);
    }
  });
});