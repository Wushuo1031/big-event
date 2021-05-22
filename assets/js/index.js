// ------------------------------ 获取用户信息，处理头像和名字 -------------------------
// 多次复用才会封装成函数
function getUserInfo() {
  // 要想请求成功，1.先登录获取token(有效期两个小时)  2.这次请求需要在请求头中携带 Authorization: token
  axios.get(`/my/user/userinfo`).then(res => {
    console.log(res);
    // 获取昵称、账号、头像
    let nickname = res.data.data.nickname;
    let username = res.data.data.username;
    // 有昵称优先使用昵称，没有昵称只能使用头像 (|| 找第一个真值)
    let name = nickname || username;
    // console.log(name);
    $('.username').text(name);


    let user_pic = res.data.data.user_pic;
    // 有图片类型的头像，优先使用图片；没有图片，使用name的第一个字符，转大写
    if (user_pic) {
      $('.layui-nav-img').attr('src', user_pic).show();
    } else {
      let first = name.substring(0, 1).toUpperCase();
      $('.user-avatar').text(first).css('display', 'inline-block');
      // jQuery的show()方法 让元素显示，并且是恢复元素本来的显示特点
      //（元素是div是块级元素，show会恢复div为display:block）
      //（元素是span是行内元素，show会恢复span为display:inline）
    }
  });
}

getUserInfo();


// ------------------------------- 退出功能 -----------------------------------------
$('#logout').on('click', function () {
  // 询问是否要删除
  layer.confirm('你确定退出吗？', { icon: 3, title: '提示' }, function (index) {
    // do something
    // 确定，会运行这个回调函数
    // 删除token
    localStorage.removeItem('token');
    // 跳转到登录页
    location.href = './login.html';
    // 下面的layer.close(index) 表示关闭弹层的意思
    layer.close(index);
  });
});