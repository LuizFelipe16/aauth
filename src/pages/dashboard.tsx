import Head from "next/head";
import Link from "next/link";
import { useEffect } from "react";
import { Can } from "../components/Can";
import { withSSRAuth } from "../functions/withSSRAuth";
import { useAuth } from "../hooks/useAuth";
import { useCan } from "../hooks/useCan";
import { setupAPIClient } from "../services/api";
import { api } from "../services/apiClient";

import styles from '../styles/pages/Signin.module.scss';

export default function Dashboard() {
  const { user, signOut } = useAuth();

  const userCanSeeMetrics = useCan({
    permissions: ['metrics.list']
  });

  useEffect(() => {
    api.get('/me').then(response => console.log('ok'));
  }, []);

  return (
    <div className={styles.sign_in}>
      <Head><title>Dash | AAuth</title></Head>
      <h1>Hello {user?.email}!</h1>

      {userCanSeeMetrics && (<p>Esse usuário pode ver Métricas (Hook)</p>)}
      {/* ou melhor: */}
      <Can permissions={['metrics.list']}>
        <p>Esse usuário pode ver Métricas (Componente)</p>
      </Can>

      <Link href="/metrics">
        <a>Ir para Página Métricas</a>
      </Link>

      <button onClick={signOut}>Sair</button>
    </div>
  );
}

// como a verificação acontece no servidor, a aplicação não chega nem ao menos renderizar os
// componentes da tela.
// Se fizermos pelo lado do cliente a verificação usando o useEffect, o que acontece é que,
// se o usuário desabilita o js, o user consegue ver o que tem em tela 
export const getServerSideProps = withSSRAuth(async (ctx) => {
  const apiClient = setupAPIClient(ctx);

  const response = await apiClient.get('/me');

  return {
    props: {}
  }
});