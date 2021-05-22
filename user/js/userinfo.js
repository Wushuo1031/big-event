const form = layui.form;
// --------------------------- 数据回填 ------------------------------
// 获取用户信息，设置输入框的默认值
function renderUser() {
  axios.get(`/my/user/userinfo`).then(res => {
    // console.log(res);
    // $('input[name=username]').val(res.data.data.username);
    // $('input[name=nickname]').val(res.data.data.nickname);
    // $('input[name=email]').val(res.data.data.email);

    // layui提供了快速回填数据的方法
    // form.val(参数1, 参数2);
    /**
     * 参数1：表示表单；这里填表单（form）的 lay-filter 属性值
     * 参数2：回填的数据，对象格式。对象的 键 和 input 的 name 同名，才能回填
     */
    form.val('user', res.data.data);
  });
}

renderUser();



// --------------------------- 提交数据、修改 ------------------------------
$('form').on('submit', function (e) {
  e.preventDefault();
  let data = $(this).serialize(); // serialize不能收集到 禁用状态的值
  // console.log(data);
  axios.post(`/my/user/userinfo`, data).then(res => {
    // console.log(res);
    let { status, message } = res.data;
    if (status === 0) {
      layer.msg(message);
      // 跨页面掉函数
      window.parent.getUserInfo();
    }
  });
})


// --------------------------- 重置，再次数据回填 ------------------------------
$('button[type=reset]').on('click', function (e) {
  e.preventDefault(); // 重置默认会清空输入框，阻止默认行为
  renderUser();
})