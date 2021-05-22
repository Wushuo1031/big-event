let form = layui.form;
// 获取地址栏的id，修改文章肯定会用到id。一定要检查地址栏是否有id
let id = location.search.substring(4);

function getArticleById() {
  return axios.get(`/my/article/${id}`);
}

function getCategory() {
  return axios.get(`/my/category/list`);
}

axios.all([getArticleById(), getCategory()])
  .then(axios.spread(function (r1, r2) {
    // 两个请求现在都执行完成
    // 先处理分类
    if (r2.data.status === 0) {
      let arr = [];
      r2.data.data.forEach(item => {
        arr.push(`
      <option value="${item.id}">${item.name}</option>
      `)
      });
      $('select[name=cate_id]').append(arr.join(""))
      // form.render('select|checkbox|radio', '表单的lay-filter属性值'); // 表单元素如果是动态添加的，需要调用这个方法进行更新渲染
      form.render('select');
      // 下拉框的分类渲染完毕，然后才能回填数据
    }
    // 再数据回填
    if (r1.data.status === 0) {
      // form.val('form的lay-filter属性值', 对象格式的参数);
      form.val('article', r1.data.data); // 能够回填内容、标题、状态、下拉框
      // 数据回填完毕，在把textarea替换成富文本编辑器
      initEditor();
      // 单独处理图片
      $image.cropper('replace', baseURL + `/${r1.data.data.cover_img}`)
    }
  }));

// function huitian() {
//   // 获取当前这篇文章的数据，做数据回填
//   axios.get(`/my/article/${id}`).then(res => {
//     console.log(res.data);
//     let { status, data } = res.data;
//     if (status === 0) {
//       // form.val('form的lay-filter属性值', 对象格式的参数);
//       form.val('article', data); // 能够回填内容、标题、状态、下拉框
//       // 数据回填完毕，在把textarea替换成富文本编辑器
//       initEditor();
//       // 单独处理图片
//       $image.cropper('replace', baseURL + `/${data.cover_img}`)
//     }
//   })
// }


// 1. 获取分类，渲染到下拉框的位置
// axios.get(`/my/category/list`).then(res => {
//   // console.log(res.data);
//   let { status, data } = res.data;
//   if (status === 0) {
//     let arr = [];
//     data.forEach(item => {
//       arr.push(`
//       <option value="${item.id}">${item.name}</option>
//       `)
//     });
//     $('select[name=cate_id]').append(arr.join(""))
//     // form.render('select|checkbox|radio', '表单的lay-filter属性值'); // 表单元素如果是动态添加的，需要调用这个方法进行更新渲染
//     form.render('select');
//     // 下拉框的分类渲染完毕，然后才能回填数据
//     huitian();
//   }
// })

// tinymce.init({
//   selector: 'textarea', //容器，可使用css选择器
//   language: 'zh_CN', //调用放在langs文件夹内的语言包
//   height: 400
// });



// 1. 初始化，先实现剪裁框
let $image = $('#image');
let option = {
  // 宽度比
  aspectRatio: 400 / 280,
  // 预览区
  preview: '.img-preview',
  autoCropArea: 1
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


// ------------------------ 表单提交，完成修改 -----------------------------------------
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

    // 修改接口需要文章id
    fd.append('id', id);
    // 验证收集到了哪些数据？？？？
    // fd.forEach((value, key) => {
    //   console.log(key, value);
    // })
    // ajax提交
    axios.post(`/my/article/update`, fd).then(res => {
      let { status, message } = res.data;
      if (status === 0) {
        layer.msg(message);
        location.href = './list.html';
      }
    });
  });

})



