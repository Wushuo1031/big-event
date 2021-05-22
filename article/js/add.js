// 1. 获取分类，渲染到下拉框的位置
axios.get(`/my/category/list`).then(res => {
  // console.log(res.data);
  let { status, data } = res.data;
  if (status === 0) {
    let arr = [];
    data.forEach(item => {
      arr.push(`
      <option value="${item.id}">${item.name}</option>
      `)
    });
    $('select[name=cate_id]').append(arr.join(""))
    let form = layui.form;
    // form.render('select|checkbox|radio', '表单的lay-filter属性值'); // 表单元素如果是动态添加的，需要调用这个方法进行更新渲染
    form.render('select');
  }
})

// tinymce.init({
//   selector: 'textarea', //容器，可使用css选择器
//   language: 'zh_CN', //调用放在langs文件夹内的语言包
//   height: 400
// });

initEditor();

// 1. 初始化，先实现剪裁框
let $image = $('#image');
let option = {
  // 宽度比
  aspectRatio: 400 / 280,
  // 预览区
  preview: '.img-preview'
}
$image.cropper(option);

// 2. 点击按钮，触发文件域的单击事件，能够选择图片
$('button:contains("选择")').on('click', function () {
  $('#file').trigger('click');
})

// 3. 更换剪裁区的图片
$('#file').on('change', function () {
  if (this.files.length > 0) {
    // 找到文件对象
    let fileObj = this.files[0];
    // 创建url
    let url = URL.createObjectURL(fileObj);
    $image.cropper('replace', url);
  }
});


// ------------------------ 表单提交，完成添加 -----------------------------------------
$('form').on('submit', function (e) {
  e.preventDefault();
  // 收集数据（只能用FormData）
  let fd = new FormData(this); // 传递表单的DOM对象，然后就可以根据表单各项元素的name属性收集数据
  fd.set('content', tinyMCE.activeEditor.getContent());
  // 剪裁图片，得到canvas
  let canvas = $image.cropper('getCroppedCanvas', { width: 400, height: 280 });
  // toBlob可以把canvas转换blob对象（blob对象是文件对象的父对象）
  canvas.toBlob(blob => {
    fd.append('cover_img', blob); // 把blob对象追加到FormData中，就会形成文件对象的格式

    // 验证收集到了哪些数据？？？？
    // fd.forEach((value, key) => {
    //   console.log(key, value);
    // })
    // ajax提交
    axios.post(`/my/article/add`, fd).then(res => {
      let { status, message } = res.data;
      if (status === 0) {
        layer.msg(message);
        location.href = './list.html';
      }
    });
  });

})



