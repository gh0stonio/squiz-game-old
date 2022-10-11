import Head from 'next/head';
import Image from 'next/image';
import type { NextPage } from 'next';

import Logo from '../../../public/logo.png';

import styles from './Home.module.scss';

const Home: NextPage = () => {
  return (
    <div className={styles.container}>
      <Image
        src={Logo}
        alt="logo"
        height={150}
        width={150}
        className={styles.logo}
      />

      <h1>Squiz Game</h1>
      <h4>Coming soon...</h4>
    </div>
  );
};

export default Home;
