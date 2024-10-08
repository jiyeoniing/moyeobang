import axios from 'axios';
import { useAuthContext } from '@/contexts/AuthContext';

// axios 인스턴스를 반환하는 함수
function useAxiosLogin() {
  const {
    accessToken,
    setAccessToken,
    refreshToken,
    handleLogout,
    loginProvider,
  } = useAuthContext();

  const axiosLogin = axios.create({
    baseURL: import.meta.env.VITE_BASEURL + '/api',
    responseType: 'json',
    timeout: 4000,
  });

  // 요청 인터셉터 설정
  axiosLogin.interceptors.request.use(
    async config => {
      if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
      }
      return config;
    },
    error => {
      return Promise.reject(error);
    }
  );

  // 응답 인터셉터 설정
  axiosLogin.interceptors.response.use(
    response => response,
    async error => {
      const originalRequest = error.config;

      if (error.response && error.response.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;

        if (!refreshToken) {
          console.error('No refresh token available');
          handleLogout();
          return Promise.reject(error);
        }

        try {
          let response;
          if (loginProvider === 'google') {
            response = await axiosLogin.get(`/oauth2/authorization/google`, {
              params: { refreshToken },
            });
          } else if (loginProvider === 'kakao') {
            response = await axiosLogin.get(`/oauth2/authorization/kakao`, {
              params: { refreshToken },
            });
          }

          if (response) {
            const newAccessToken = response.data.accessToken;
            setAccessToken(newAccessToken);

            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
            return axiosLogin(originalRequest);
          }
        } catch (refreshError) {
          console.error('Failed to refresh access token:', refreshError);
          handleLogout();
        }
      }
      return Promise.reject(error);
    }
  );

  return axiosLogin;
}

export default useAxiosLogin;