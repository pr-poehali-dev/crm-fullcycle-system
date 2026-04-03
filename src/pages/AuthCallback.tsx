import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useYandexAuth } from '@/components/extensions/yandex-auth/useYandexAuth';

const AUTH_URL = 'https://functions.poehali.dev/752120dd-cc58-4568-bef7-e1c3e9d5cff7';

const apiUrls = {
  authUrl: `${AUTH_URL}?action=auth-url`,
  callback: `${AUTH_URL}?action=callback`,
  refresh: `${AUTH_URL}?action=refresh`,
  logout: `${AUTH_URL}?action=logout`,
};

export default function AuthCallback() {
  const navigate = useNavigate();
  const auth = useYandexAuth({ apiUrls });
  const called = useRef(false);

  useEffect(() => {
    if (called.current) return;
    called.current = true;

    const params = new URLSearchParams(window.location.search);
    auth.handleCallback(params).then((ok) => {
      navigate(ok ? '/' : '/login', { replace: true });
    });
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
      <div className="text-center">
        <div className="w-10 h-10 border-2 border-blue-400 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-white/60 text-sm">Выполняется вход...</p>
      </div>
    </div>
  );
}
