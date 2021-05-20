 //添加拦截器
 axios.interceptors.response.use(function (response) {
     let { status, message } = response.data;
     if (status === 1) layer.msg(message);
     return response;
 }, function (error) {
     let { status, message } = error.response.data;
     layer.msg(message);
     return Promise.reject(error);
 });
 // 切换盒子
 $('.login a').on('click', function () {
     $('.register').show();
 });
 $('.register a').on('click', function () {
     $('.register').hide();
 });
 // 点击按钮收集数据阻止表单默认行为ajax提交
 $('.login form').on('submit', function (e) {
     e.preventDefault();
     let data = $(this).serialize();
     axios.post('http://www.itcbc.com:8080/api/login', data).then(res => {
         let { status, message, token } = res.data;
         if (status === 0) {
             localStorage.setItem('token', token);
             layer.msg(message, { time: 1500 }, () => {
                 location.href = './index.html'
             });
         }
     });
 });
 // 注册功能
 $('.register form').on('submit', function (e) {
    e.preventDefault();
    let data = $(this).serialize();
    axios.post('http://www.itcbc.com:8080/api/reguser',data).then(res => {
        if (status ===0) {
            layer.msg(message);
            $('.register form')[0].reset();
            $('.resigter').hide();
        }
    }) 
 });
 let form = layui.form;
 form.verify({
     len:[/^\S{6,12}$/,'长度6~12位且不能有空格'],
     same: function (val) {
           let pwd = $('.pwd').val();
           if (pwd !== val) return '两次密码不一致';
     }
 });


