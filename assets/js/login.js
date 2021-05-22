// -------------------------- 切换两个盒子 ------------------------------
$('.login a').on('click', function () {
  // 让注册的盒子显示
  $('.register').show();
  // $('.register').show().prev().hide();
})

$('.register a').on('click', function () {
  $('.register').hide();
})


// -------------------------- 完成注册功能 ------------------------------
// 点击注册（提交表单） - 阻止默认行为 - 获取输入框的值 - Ajax提交
$('.register form').on('submit', function (e) {
  e.preventDefault();
  // serialize() -- 查询字符串格式 -- username=value&password=value
  let data = $(this).serialize();
  // console.log(data);
  // 参考接口文档，看一下接口文档要什么数据？ username password

  // axios.post(url[, data[, config]])
  axios.post(`/api/reguser`, data).then(res => {
    // console.log(res);
    // alert(res.data.message);
    layer.msg(res.data.message);
    if (res.data.status === 0) {
      // 重置表单
      $('.register form')[0].reset();
      // 切换盒子
      $('.register').hide();
    }
  });

  // $.ajax({
  //   data: data,
  //   type: 'POST',
  //   url: 'http://www.itcbc.com:8080/api/reguser',
  //   success: function (res) {
  //     alert(res.message);
  //     if (res.status === 0) {
  //       // 重置表单
  //       $('.register form')[0].reset();
  //       // 切换盒子
  //       $('.register').hide();
  //     }
  //   }
  // });
})

// --------------------------  表单验证  ------------------------------
// layui的模块系统：设计思想，用哪个模块，就加载哪个模块，按需加载
// layui也提供了加载模块的语法
// let 变量 = layui.模块名;
// 我们要做表单验证功能，需要用到form模块，所以需要先加载它
const form = layui.form;
// console.log(form); // 对象结构；对象的原型中有很多方法，比如render/verfiy等，可以直接拿来使用

// 自定义验证规则
form.verify({
  // 键: 值, // 每个键值对，就是一个验证规则
  // 键(验证规则名称): 值(验证方法)

  // 两种形式：数组形式 ['正则表达式', '验证不通过时的提示信息']
  uname: [/^\w{2,10}$/, '用户名必须是2~10位的数字字母组合'],   // \w 表示一个字符，表示数字、字母、下划线； {2,10} 不是 {2, 10}

  // 验证密码长度
  len: [/^\S{6,12}$/, '长度必须是6~12位且不能出现空格'],

  // 验证 确认密码 是否和密码相同
  same: function (x) {
    // 形参 表示使用该验证规则的输入框的值；哪个输入框使用这个规则，这个 x 表示这个输入框的值
    // 案例中，确认密码 这个input使用了这个验证规则；所以 x 表示我们输入的确认密码
    let pwd = $('.register input[name="password"]').val();
    if (x !== pwd) return '两次密码不一致';
    // return (x !== pwd) && '两次密码不一致';
    // return '验证不通过时的提示';
  }
});


// --------------------------  完成登录功能  ------------------------------
// 点击登录（提交表单） - 阻止默认行为 - 获取输入框的值 - Ajax提交
$('.login form').on('submit', function (e) {
  e.preventDefault();
  let data = $(this).serialize();
  // console.log(data); // username=xxx&password=yyy
  axios.post(`/api/login`, data).then(res => {
    // console.log(res);
    console.log(res.data);
    // res.data 表示服务器返回的结果
    if (res.data.status === 0) {

      layer.msg(res.data.message, { time: 1500 }, () => {
        // 弹出关闭后，做的事情
        // 保存token到本地存储
        localStorage.setItem('token', res.data.token);
        // 跳转到index页面（JS的跳转，不看你的js文件在哪里，看使用该js文件的html在哪里）
        location.href = './index.html';
      });
    }
  });
})
