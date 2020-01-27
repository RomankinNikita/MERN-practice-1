import {useCallback, useState, useEffect} from 'react';
import {useHttp} from './http.hook';

const storageName = 'userData';

export const useAuth = () => {
  const [token, setToken] = useState(null);
  const {request} = useHttp();
  const [ready, setReady] = useState(false);
  const [userId, setUserId] = useState(null);

  const login = useCallback((jwtToken, id) => {
    setToken(jwtToken);
    setUserId(id);
    localStorage.setItem(storageName, JSON.stringify({userId: id, token: jwtToken}));
  }, []);

  const logout = useCallback(() => {
    setToken(null);
    setUserId(null);
    localStorage.removeItem(storageName);
  }, []);

  const checkTokenVerified = useCallback(async () => {
    const data = JSON.parse(localStorage.getItem(storageName));

    if (data && data.token) {
      try {
        await request('/api/auth', 'GET', null, {
          Authorization: `Bearer ${data.token}`
        });
        login(data.token, data.userId);
      } catch (error) {
        logout();
      }
    }
    setReady(true);
  }, [login, request]);

  useEffect(() => {
    checkTokenVerified();
  }, [checkTokenVerified]);

  return {login, logout, token, userId, ready};
};