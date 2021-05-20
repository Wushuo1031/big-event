
// -------------------------- 切换两个盒子 ------------------------------
// 点击登录的盒子里面的a标签，让注册的盒子显示（注册的盒子显示了，就会把登录的盒子遮挡住）
$('.login a').on('click', function () {
  $('.register').show();
})

// 点击注册的盒子里面的a标签，让注册的盒子隐藏
$('.register a').on('click', function () {
  $('.register').hide();
})


// -------------------------- 登录功能 ------------------------------
// 当表单提交的时候，阻止默认行为，收集账号和密码，ajax提交到接口
$('.login form').on('submit', function (e) {
  e.preventDefault();
  let data = $(this).serialize();
  // console.log(data); // 
  // 这里ajax提交数据，选择使用axios

  // axios.post(url, 请求体).then(函数);
  axios.post('/api/login', data).then(res => {
    // console.log(res);
    // 解构赋值，获取响应结果中的 status/message/token
    let { status, message, token } = res.data;
    if (status === 0) {
      // 保存token ==> localStorage
      localStorage.setItem('token', token);
      // 提示一下
      layer.msg(message, { time: 1500 }, () => {
        // 跳转到 index.html
        location.href = './index.html';
      });
    }
  });
})



// -------------------------- 注册功能 ------------------------------
// 当表单提交的时候，阻止默认行为，收集账号和密码，ajax提交到接口
$('.register form').on('submit', function (e) {
  e.preventDefault();
  let data = $(this).serialize();
  // console.log(data);
  // axios.post(url, 请求体).then(res => {});
  axios.post('/api/reguser', data).then(res => {
    // console.log(res);
    let { status, message } = res.data;
    if (status === 0) {
      layer.msg(message);
      // 清空输入框（重置表单）
      $('.register form')[0].reset();
      // 切换到登录的盒子
      $('.register').hide();
    }
  })
})



// -------------------------- 表单验证 ------------------------------
// 自定义验证规则
// 使用layui的内置模块，使用之前，必须先加载模块，
// 加载语法  let xxx = layui.模块名;
let form = layui.form;
// console.log(form);
form.verify({
  // 键（验证规则）: 值（怎样验证）
  // len: ['正则表达式', '验证不通过时的提示'],
  len: [/^\S{6,12}$/, '长度6~12位且不能有空格'], // ^$一起用表示匹配整个字符串  \S表示非空白  {6,12} 不是 {6, 12}

  // 函数形式，函数的形参表示 使用该验证规则的输入框的值 。
  // 案例中，确认密码使用了这个验证规则，形参val表示我们输入的确认密码
  // same: function (val) { return '验证不通过时的提示' }
  same: function (val) {
    // 获取密码
    let pwd = $('.pwd').val();
    // 判断
    if (pwd !== val) return '两次密码不一致';
  }
});