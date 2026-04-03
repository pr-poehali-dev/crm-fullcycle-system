import { useYandexAuth } from '@/components/extensions/yandex-auth/useYandexAuth';
import { YandexLoginButton } from '@/components/extensions/yandex-auth/YandexLoginButton';

const AUTH_URL = 'https://functions.poehali.dev/752120dd-cc58-4568-bef7-e1c3e9d5cff7';

const apiUrls = {
  authUrl: `${AUTH_URL}?action=auth-url`,
  callback: `${AUTH_URL}?action=callback`,
  refresh: `${AUTH_URL}?action=refresh`,
  logout: `${AUTH_URL}?action=logout`,
};

export default function Login() {
  const auth = useYandexAuth({ apiUrls });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">

          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-blue-500 flex items-center justify-center">
              <svg viewBox="0 0 20 20" fill="white" className="w-5 h-5">
                <path d="M11.983 1.907a.75.75 0 00-1.292-.657l-8.5 9.5A.75.75 0 002.75 12h6.572l-1.305 6.093a.75.75 0 001.292.657l8.5-9.5A.75.75 0 0017.25 8h-6.572l1.305-6.093z" />
              </svg>
            </div>
            <div>
              <p className="text-white font-semibold text-lg leading-tight">SalesCRM</p>
              <p className="text-white/40 text-xs">Управление продажами</p>
            </div>
          </div>

          <h1 className="text-2xl font-bold text-white mb-2">Добро пожаловать</h1>
          <p className="text-white/50 text-sm mb-8">Войдите через Яндекс для доступа к системе</p>

          {auth.error && (
            <div className="mb-4 px-4 py-3 rounded-xl bg-red-500/15 border border-red-500/30 text-red-300 text-sm">
              {auth.error}
            </div>
          )}

          <YandexLoginButton
            onClick={auth.login}
            isLoading={auth.isLoading}
            className="w-full justify-center py-3 text-base"
          />

          <p className="mt-6 text-center text-white/25 text-xs">
            Авторизуясь, вы соглашаетесь с условиями использования системы
          </p>
        </div>
      </div>
    </div>
  );
}
