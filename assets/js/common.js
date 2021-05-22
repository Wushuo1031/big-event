// axios 全局配置
const baseURL = 'http://www.itcbc.com:8080'
// const baseURL = 'http://localhost:3000'
axios.defaults.baseURL = baseURL;
// axios.defaults.headers['Authorization'] = localStorage.getItem('token')

// 请求拦截器
axios.interceptors.request.use(
  config => {
    // 在发送请求之前做些什么
    // console.log(config);
    if (config.url.includes('/my/')) {
      config.headers['Authorization'] = localStorage.getItem('token');
    }
    return config;
  },
  error => {
    // 对请求错误做些什么
    return Promise.reject(error);
  }
);

// 添加响应拦截器
axios.interceptors.response.use(
  response => {
    // 响应状态码 2xx 或 3xx , 进入这里
    // 拦截住响应结果(response)，可以对响应结果进行处理
    // response.aa = 'hello world';
    // console.log(response);
    let { status, message } = response.data;
    if (status === 1) {
      layer.msg(message);
    }
    return response;
  },
  error => {
    // 响应状态码 4xx 或 5xx ,进这里
    // 拦截住响应结果，出错时的结果，进行错误处理
    // 如果有响应结果的话，获取响应结果，根据响应结果判断 token 是否是假的或者是过期的
    // console.log(error.response); // 表示响应结果
    if (error.response) {
      // let {name, age} = {name: 'zs', age: 20};
      let { status, message } = error.response.data;
      if (status === 1 && message === '身份认证失败！') {
        // 满足这个条件，说明用户使用了一个假的token或者过期的token
        localStorage.removeItem('token'); // 移除假token
        location.href = './login.html';
        if (location.pathname === '/index.html') {
          location.href = './login.html';
        } else {
          window.parent.location.href = '../login.html';
        }
      } else {
        // 其他错误，直接给出提示即可
        layer.msg(message);
      }
    }
    return Promise.reject(error);
  }
);