
// 马上发送请求，获取用户信息
/**
 * axios 里面也可以配置请求。
 * axios.get(url, {配置项});   ----- 配置项去axios文档中查看
 */
axios.get('/my/user/userinfo').then(res => {
  let { nickname, user_pic, username } = res.data.data;
  // console.log(nickname, username);
  // 1. 设置欢迎你xxx
  // a || b  ，返回值是a或者b。到底是哪个呢？找第一个真值
  // 如果nickname是真，直接返回它；如果是nickname是假，则返回后面的username
  let name = nickname || username;
  $('.username').text(name);
  // 2. 显示头像（新注册的账号没有头像，获取name，取得第一个字符，转大写）
  if (user_pic) {
    // 说明用户有头像
    $('.layui-nav-img').attr('src', user_pic).show();
  } else {
    // 说明用户没有头像
    let first = name.substring(0, 1).toUpperCase();
    // show() 通过设置display样式，让一个元素显示；设置的值是inline/inline-block/block 呢？
    // 元素如果是行内元素，show()之后，会设置display:inline；如果是div，show()之后，会设置display:block
    $('.user-avatar').text(first).css('display', 'inline-block');
  }
});



// -------------------------------- 退出功能 -------------------------------
$('#logout').on('click', function () {
  // 询问是否要退出？
  layer.confirm('你确定退出吗？', { icon: 3, title: '提示' }, function (index) {
    // do something
    // 如果点击了确定，会执行这个函数
    // 1. 删除token
    localStorage.removeItem('token');
    // 2. 跳转到登录页
    location.href = './login.html';
    layer.close(index); // 关闭弹层
  });
})