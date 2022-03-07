import { GetServerSideProps, GetServerSidePropsContext, GetServerSidePropsResult } from "next";
import { parseCookies } from "nookies";

// É pra garantir que uma pagina que não pode ser acesso para um usuário logado, não seja acessada

// Esse P é pra ajudar na tipagem e no retorno, garantindo que a funçaõ tá bem tipada;
// Segundo motivo disso é para deixar claro o que precisa ser retornado quando a função ser chamada (ver-code-print-6)
export function withSSRGuest<P>(fn: GetServerSideProps<P>) {
  // retorna uma função pq pro next a função que ele executa la no serverside tem que ser uma função
  return async (ctx: GetServerSidePropsContext): Promise<GetServerSidePropsResult<P>> => {
    const cookies = parseCookies(ctx);
    // por estar do lado do servidor precisamos passar o contexto;

    if (cookies['nextauth.token']) {
      return {
        redirect: {
          destination: '/dashboard',
          permanent: false,
        }
      }
    }

    return await fn(ctx); // esse fn é a função, o código que foi passado para ela executar no método get server props
  }
}