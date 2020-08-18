import { useState, useContext, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Layout from '../components/Layout';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import { FirestoreContext } from '../contexts/FirestoreContextProvider';

const makersList = () => {
  const [makers, setMakers] = useState([]);
  const db = useContext(FirestoreContext);
  const router = useRouter();
  const isLogin = useSelector((state) => state.isLogin);
  const loginUser = useSelector((state) => state.loginUser);
  useEffect(() => {
    const fetchData = async () => {
      const snapshot = await db
        .collection('publicUsers')
        .orderBy('created', 'desc')
        .get();
      let makerArray = [];
      for (const doc of snapshot.docs) {
        makerArray.push(doc.data());
      }
      setMakers(makerArray);
    };
    if (!isLogin) return;
    if (loginUser.uid !== 'vlSNO4QZBeTiVQhl87Ms3rlfKGr1') router.push('/');
    fetchData();
  }, [isLogin]);
  return (
    <Layout>
      <Head>
        <meta name="robots" content="noindex" />
      </Head>
      <div className="flex flex-wrap">
        {makers.map((maker) => (
          <div className="md:flex bg-white rounded-lg p-6">
            <Link href="/[username]" as={`/${maker.username}`}>
              <a>
                <img
                  className="h-16 w-16 md:h-24 md:w-24 rounded-full mx-auto md:mx-0 md:mr-6"
                  src={maker.picture}
                />
              </a>
            </Link>
            <div className="text-center md:text-left">
              <h2 className="text-lg">
                <Link href="/[username]" as={`/${maker.username}`}>
                  <a>{maker.customName}</a>
                </Link>
              </h2>
              <div className="text-purple-500">Product Engineer</div>
              <div className="text-gray-600">erinlindford@example.com</div>
              <div className="text-gray-600">(555) 765-4321</div>
            </div>
          </div>
        ))}
      </div>
    </Layout>
  );
};

export default makersList;
