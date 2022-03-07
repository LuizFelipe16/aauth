import Head from "next/head";
import { FormEvent, useState } from "react";
import { withSSRGuest } from "../functions/withSSRGuest";
import { useAuth } from "../hooks/useAuth";

import styles from '../styles/pages/Signin.module.scss';

export default function SignIn() {
  const [email, setEmail] = useState('felipefelizatti@ignite.rocketseat');
  const [password, setPassword] = useState('123456');

  const { signIn } = useAuth();

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    const data = {
      email,
      password
    }

    await signIn(data);
  }

  return (
    <form onSubmit={handleSubmit} className={styles.sign_in}>
      <Head><title>Login | AAuth</title></Head>

      <h1>Autenticação e Autorização</h1>
      <h2>Login</h2>

      <input
        type="email"
        value={email}
        onChange={e => setEmail(e.target.value)}
      />
      <input
        type="password"
        value={password}
        onChange={e => setPassword(e.target.value)}
      />
      <button type="submit">
        Entrar
      </button>
    </form>
  );
}

export const getServerSideProps = withSSRGuest(async (ctx) => {
  return {
    props: {}
  }
});