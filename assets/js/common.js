// 全局配置请求根路径
let baseURL = 'http://www.itcbc.com:8080';
axios.defaults.baseURL = baseURL;

// 添加请求拦截器
axios.interceptors.request.use(function (config) {
  // 在发送请求之前做些什么
  // 统一加请求头 Authorization
  // console.log(config);
  let url = config.url;
  if (url.includes('/my/')) {
    config.headers['Authorization'] = localStorage.getItem('token');
  }
  return config;
}, function (error) {
  // 对请求错误做些什么
  return Promise.reject(error);
});

// 添加响应拦截器
// axios.interceptors.response.use(函数1, 函数2);
// 函数1，处理的是成功状态（状态码是2xx, 300）的响应
// 函数2，处理的失败状态（响应状态码是4xx, 5xx）的响应
axios.interceptors.response.use(
  function (response) {
    // 对响应数据做点什么
    // console.log(response);
    let { status, message } = response.data;
    if (status === 1) layer.msg(message);
    return response;
  },
  function (error) {
    // 对响应错误做点什么
    // console.log(error.response);
    let { status, message } = error.response.data;
    if (status === 1 && message === '身份认证失败！') {
      // 移除过期的，或者假的token
      localStorage.removeItem('token');
      // 跳转到登录页
      location.href = './login.html';
    }
    layer.msg(message)
    return Promise.reject(error);
  }
);