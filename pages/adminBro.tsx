import React, { useState, useEffect, useContext } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import Layout from '../components/Layout';
import { FirestoreContext } from '../contexts/FirestoreContextProvider';
import { QUESTIONS, ANSWERS, USERS } from '../consts/FirestoreCollections';
import { Table } from 'antd';
import 'antd/lib/table/style/index.css';

const columns = [
  {
    title: 'Item Name',
    dataIndex: 'name',
    key: 'name',
    render: (text) => <a>{text}</a>,
  },
  {
    title: 'Content',
    dataIndex: 'content',
    key: 'content',
  },
];

const adminBro = () => {
  const db = useContext(FirestoreContext);
  const router = useRouter();
  const loginUser = useSelector((state) => state.loginUser);
  const isLogin = useSelector((state) => state.isLogin);
  // const [userCount, setUserCount] = useState(0);
  const [questionCount, setQuestionCount] = useState(0);
  const [answerCount, setAnswerCount] = useState(0);

  const data = [
    // {
    //   key: '1',
    //   name: 'Users',
    //   content: userCount,
    // },
    {
      key: '2',
      name: 'Questions',
      content: questionCount,
    },
    {
      key: '3',
      name: 'Answers',
      content: answerCount,
    },
  ];

  useEffect(() => {
    const fetchData = async () => {
      const [
        // userSnapshot,
        questionSnapshot,
        answerSnapshot,
      ] = await Promise.all([
        // db.collection(USERS).get(),
        db.collection(QUESTIONS).get(),
        db.collection(ANSWERS).get(),
      ]);
      // setUserCount(userSnapshot.size);
      setQuestionCount(questionSnapshot.size);
      setAnswerCount(answerSnapshot.size);
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
      <Table columns={columns} dataSource={data} pagination={false} />
    </Layout>
  );
};

export default adminBro;
