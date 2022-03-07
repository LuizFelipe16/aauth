import { ReactNode, createContext, useState } from "react";
import Router from "next/router";
import { setCookie, parseCookies, destroyCookie } from 'nookies';
import { api } from "../services/apiClient";
import { useEffect } from "react";

type User = {
  email: string;
  permissions: string[];
  roles: string[];
}

type SignInCredentials = {
  email: string;
  password: string;
}

type AuthContextData = {
  signIn: (credentials: SignInCredentials) => Promise<void>;
  signOut: () => void;
  user: User;
  isAuthenticated: boolean;
}

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthContext = createContext({} as AuthContextData);

let authChannel: BroadcastChannel; // abertura do canal do browser

export function signOut() {
  destroyCookie(undefined, 'nextauth.token');
  destroyCookie(undefined, 'nextauth.refreshToken');

  authChannel.postMessage('signOut');

  Router.push('/');
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User>();
  const isAuthenticated = !!user;

  useEffect(() => {
    authChannel = new BroadcastChannel('auth'); // para ser criado e funcionado apenas no browser

    authChannel.onmessage = (message) => {
      switch (message.data) {
        case 'signOut':
          signOut();
          break;
        default:
          break;
      }
    }
  }, []);

  useEffect(() => {
    const { 'nextauth.token': token } = parseCookies(); // retorna todos meus cookies;

    if (token) {
      api.get('/me')
        // Buscar sempre as informações mais atualizados do usuário
        .then(response => {
          const { email, permissions, roles } = response.data;

          setUser({ email, permissions, roles });
        })
        .catch(() => { signOut() });
    }
  }, []);

  async function signIn({ email, password }: SignInCredentials) {
    try {
      const response = await api.post('/sessions', {
        email,
        password
      });

      const {
        token,
        refreshToken,
        permissions,
        roles
      } = response.data;

      setCookie(undefined, 'nextauth.token', token, {
        maxAge: 60 * 60 * 24 * 30, // quanto tempo quero manter ele salvo no navegador;
        path: '/' // quais caminhos podem ter acesso a ele, '/' = todos
      });
      setCookie(undefined, 'nextauth.refreshToken', refreshToken, {
        maxAge: 60 * 60 * 24 * 30,
        path: '/'
      });
      // quando trabalhamos com os cookies dentro do browser, esse primeiro parametro 
      // é sempre undefined, só é usado pelo lado do servidor.

      setUser({
        email,
        permissions,
        roles
      });

      // no primeiro momento em que carrega o dashboard, o token não vai tá ali, vai se undefined,
      // então precisamos atualizar isso manualmente
      api.defaults.headers['Authorization'] = `Bearer ${token}`;

      Router.push('/dashboard');
    } catch (err) {
      console.log('Ocorreu um erro.');
    }
  }

  return (
    <AuthContext.Provider value={{
      isAuthenticated,
      signIn,
      signOut,
      user
    }}>
      {children}
    </AuthContext.Provider>
  );
}