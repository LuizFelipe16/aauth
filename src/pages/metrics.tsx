import Head from "next/head";
import Link from "next/link";
import { withSSRAuth } from "../functions/withSSRAuth";
import { setupAPIClient } from "../services/api";

import styles from '../styles/pages/Signin.module.scss';

// 1°
// permitir que o usuário acesse ou não a pagina por meio das suas permisões

export default function Metrics() {
  return (
    <div className={styles.sign_in}>
      <Head><title>Metrics | AAuth</title></Head>
      <h1>Métricas</h1>

      <Link href="/dashboard">
        <a>Ir para Página Dashboard</a>
      </Link>
    </div>
  );
}

export const getServerSideProps = withSSRAuth(async (ctx) => {
  const apiClient = setupAPIClient(ctx);
  const response = await apiClient.get('/me');

  // 2°
  // o meio mai fácil de pegarmos as informações necessárias é pelo token, pois o refrssh dele
  // como é mais rápido, permite ter tudo muito "fresco" pra aplicação (jwt-decode), mas
  // vamos fazer isso dentro do método SSRAuth, pois lá já temos acesso ao token, aos cookies

  return {
    props: {}
  }

  // 3º cada pagina pode ter permissões diferentes, então podemos enviar os requisitos como segundo
  // parametro
}, {
  permissions: ['metrics.list'],
  roles: ['administrator']
});