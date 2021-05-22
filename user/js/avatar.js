var $image = $('#image');

$image.cropper({
  // 设置剪裁框的宽高比
  aspectRatio: 1,
  // 设置预览
  preview: '.img-preview'
});

// Get the Cropper.js instance after initialized
var cropper = $image.data('cropper');


// ---------------------- 点击上传按钮，能够选择图片 ----------------------------------
$('button:contains("上传")').on('click', function () {
  $('#file').trigger('click'); // trigger 是jquery方法，用来触发某个元素的事件
})

// ----------------------- 文件域内容改变，图片预览 ----------------------------------
$('#file').on('change', function () {
  // console.log(123);
  // js中使用文件对象，来表示选择的文件
  // console.dir(this);
  if (this.files.length > 0) {
    // 1. 获取文件对象
    let fileObj = this.files[0];
    // 2. 使用URL对象，为文件对象创建一个url
    let url = URL.createObjectURL(fileObj);

    // console.log(url);
    // 更换剪裁区的图片
    $image.cropper('replace', url);
  }
});


// ----------------------- 点击确定，剪裁图片，完成更换 ----------------------------------
$('button:contains("确定")').on('click', function () {
  // 剪裁图片，得到canvas
  let canvas = $image.cropper('getCroppedCanvas', { width: 30, height: 30 });
  // 把canvas转换成base64格式
  let base64 = canvas.toDataURL('image/jpeg', 0.3);

  /**
   * 参数格式：key=value&key=value
   * avatar=data:%ABCD%CDEF
   */
  axios.post(`/my/user/avatar`, `avatar=${encodeURIComponent(base64)}`).then(res => {
    let { status, message } = res.data;
    if (status === 0) {
      layer.msg(message);
      // 重新更新index父页面的头像
      window.parent.getUserInfo();
    }
  });
})