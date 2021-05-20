// 找到图片
let image = $('#image')
// 剪裁图片
let option = {
    aspectRatio :1 ,
    preview : '.img-preview'
}
// 调用方法
image.cropper(option)
// 点击上传触发文件域的单击事件
$('button:contains("上传")').on('click',function () {
    $('#file').trigger('click');
})
// 选择图片更换
$('#file').on('change',function () {
    if(this.isDefaultNamespace.length > 0) {
        let fileObj = this.files[0];
        let url = URL.createObjectURL(fileObj);
        image.cropper('replace',url);
    }
});
// 点击确认按钮 实现更换头像
$('button:contains("确定")').on('click',function () {
   let canvas = image.cropper('getCroppedCanvas',{width:30,height:30});
   let base64 = canvas.toDataURL();
   axios.post('/my/user/avatar',`avatar=${encodeURIComponent(base64)}`).then( res => {
       let { status, message} = res.data;
       if (status ===0){
           layer.msg(message)
           window.parent.getUserInfo();
       }
   })
});