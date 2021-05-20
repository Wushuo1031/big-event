
function getUserInfo () {
    axios.get('/my/user/userinfo',{
  
    }).then(res => {
        let { nickname, user_pic, username } = res.data.data;
        //  a || b 短路
        let name = nickname || username;
        $('.username').text(name);
        if(user_pic) {
            $('.layui-nav-img').attr('src',user_pic).show();
        }else {
            let first = name.substring(0, 1).toUpperCase();
            $('.user-avatar').text(first).css('display','inline-block')
        }
    });
}
getUserInfo();
// 退出
$('#logout').on('click',function () {
    layer.confirm('你确定退出吗' ,{icon:3,title :'提示'},function (index) {
        // 删除token
        localStorage.removeItem('token');
        // 跳转到登录页
        location.href = './login.html';
        layer.close(index);//关闭弹层
    });
});