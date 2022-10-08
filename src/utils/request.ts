import axios, {AxiosRequestConfig} from 'axios';
const timeout = 12000;
const services = axios.create({
  timeout,
});
services.interceptors.response.use(
  response => {
    // 拦截响应，做统一处理
    if (response.status === 200) {
      return Promise.resolve(response.data);
    } else {
      return Promise.reject(response);
    }
  },
  // 接口错误状态处理，也就是说无响应时的处理
  error => {
    return Promise.reject(error); // 返回接口返回的错误信息
  },
);
function request<T>(option: AxiosRequestConfig): Promise<T> {
  return new Promise((resolve, reject) => {
    services(option)
      .then(res => {
        const response = res as any;
        resolve(response);
      })
      .catch(err => {
        return reject(err);
      });
  });
}
export default request;
