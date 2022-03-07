import { GetServerSideProps, GetServerSidePropsContext, GetServerSidePropsResult } from "next";
import { destroyCookie, parseCookies } from "nookies";
import decode from 'jwt-decode';
import { AuthTokenError } from "../errors/AuthTokenError";
import { validateUserPermissions } from "../utils/validateUserPermissions";

// É pra garantir que uma pagina que pode ser acessada para um usuário logado, verifique o log pelo servidor

type WithSSRAuthOptions = {
  permissions?: string[];
  roles?: string[];
}

// Esse P é pra ajudar na tipagem e no retorno, garantindo que a funçaõ tá bem tipada;
// options é pra no servidor poder ver se o usuário logado tem tudo que é necessário
// pra acessar a pagina, antes mesmo de ser renderizada
export function withSSRAuth<P>(fn: GetServerSideProps<P>, options?: WithSSRAuthOptions) {
  // retorna uma função pq pro next a função que ele executa la no serverside tem que ser uma função
  return async (ctx: GetServerSidePropsContext): Promise<GetServerSidePropsResult<P>> => {
    const cookies = parseCookies(ctx);
    // por estar do lado do servidor precisamos passar o contexto;

    const token = cookies['nextauth.token'];

    if (!token) {
      return {
        redirect: {
          destination: '/',
          permanent: false,
        }
      }
    }

    if (!!options) {
      const user = decode<{ permissions: string[], roles: string[] }>(token); // retorna permissions, roles, exp, sub // pode dar um erro pq o decode não sabe o formato do token
      const { permissions, roles } = options;

      const userHasValidPermissions = validateUserPermissions({
        user,
        permissions,
        roles
      });

      if (!userHasValidPermissions) {
        return {
          // redirecionar para uma pagina que todos podem acessar
          redirect: {
            destination: '/dashboard',
            permanent: false,
          }
        }
      }
    }

    try {
      return await fn(ctx);
    } catch (err) {
      if (err instanceof AuthTokenError) {
        destroyCookie(ctx, 'nextauth.token');
        destroyCookie(ctx, 'nextauth.refreshToken');

        return {
          redirect: {
            destination: '/',
            permanent: false
          }
        }
      }
    }
  }
}