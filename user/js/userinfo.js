function renderUser () {
    axios.get('/my/user/userinfo').then(res => {
        // let { username, nickname, email } = res.data.data;
        // $('input[name=username]').val(username);
        // $('input[name=nickname]').val(nickname);
        // $('input[name=email]').val(email);
        let form = layui.form
        form.val('user',res.data.data);
    })
}
renderUser();
$('form').on('submit',function(e) {
    e.preventDefault();
    let data = $(this).serialize();
    axios.post('/my/user/userinfo',data).then( res => {
        let { status, message} = res.data;
        if( status === 0 ) {
            layer.msg(message)
            window.parent.getUserInfo();
        }
    })
})
// 重置表单
$('button:contains("重置")').on('click',function (e) {
    e.preventDefault();
    renderUser();
})
