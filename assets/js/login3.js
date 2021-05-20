// 添加拦截响应器
axios.interceptors.response.use(function (response) {
    let { status, message } = response.data;
    if (status === 1) layer.msg(message);
    return response;
}, function (error) {
    let { status, message } = error.response.data;
    layer.msg(message);
    return Promise.reject(error);
});
// 点击切换盒子
$('.login a').on('click', function () {
    $('.register').show();
});
$('.register a').on('click', function () {
    $('.register').hide();
});
// 点击登录 收集表单数据 ajax提交
$('.login form').on('submit', function (e) {
    e.preventDefault();
    // 收集数据
    let data = $(this).serialize();
    // 发送ajax请求
    axios.post('http://www.itcbc.com:8080/api/login', data).then(res => {
        // 解构赋值，获取响应结果中的 status/message/token
        let { status, message, token } = res.data;
        if (status === 0) {
            // 保存token ==> localStorage
            localStorage.setItem('token', token)
            // 提示一下
            layer.msg(message, { time: 1500 }, () => {
                // 跳转到 index.html
                location.href = './index.html'
            })

        }
    })
});
// 点击注册收集数据 ajax提交 阻止默认行为
$('.register form').on('submit',function (e) {
    e.preventDefault();
     let data = $(this).serialize();
     axios.post('http://www.itcbc.com:8080/api/reguser',data).then( res => {
         let { status, message} = res.data;
         if ( status === 0){
             layer.msg(message)
             $('register form')[0].reset();
             $('register').hide();
         }
     })
})
let form = layui.form
form.verify({
    len: [/^\S{6,12}$/,'长度6~12位且不能有空格'],
    same : function (val) {
     let pwd = $('.pwd').val();
     if(pwd !== val) return '两次密码不一致';     
    }
});