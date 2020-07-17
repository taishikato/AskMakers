import React, { useState, useEffect, useContext } from 'react';
import { useRouter } from 'next/router';
import { Skeleton } from 'antd';
import Layout from '../../components/Layout';
import { FirestoreContext } from '../../contexts/FirestoreContextProvider';
import ContentCard from '../../components/Common/ContentCard';

interface IQuestionsTopic {
  questionId: string;
  topic: string;
  questionCreated: number;
}

const CategoriesName = () => {
  const router = useRouter();
  const db = useContext(FirestoreContext);
  const [questionData, setQuestionData] = useState([]);
  const [loading, setLoading] = useState(true);

  const { name } = router.query;

  useEffect(() => {
    const fetchQuestions = async () => {
      setLoading(true);
      const snapshot = await db
        .collection('questionsTopic')
        .where('topic', '==', name)
        .orderBy('questionCreated', 'desc')
        .get();
      if (snapshot.empty) {
        setLoading(false);
        return;
      }

      const questionDataArray = [];
      for (const doc of snapshot.docs) {
        const topicData = doc.data() as IQuestionsTopic;
        const [questionSnapshot, answerSnapshot] = await Promise.all([
          db.collection('questions').doc(topicData.questionId).get(),
          db
            .collection('answers')
            .where('questionId', '==', topicData.questionId)
            .get(),
        ]);
        const question = questionSnapshot.data();
        question.answerCount = answerSnapshot.size;
        questionDataArray.push({ question });
      }
      setQuestionData(questionDataArray);
      setLoading(false);
    };
    if (name) fetchQuestions();
  }, [name]);
  return (
    <Layout>
      <div className="m-auto mt-8 w-7/12">
        <h2 className="font-bold text-xl text-black mt-10 flex items-center">
          {name}
        </h2>
        {loading && (
          <>
            <Skeleton active paragraph={{ rows: 3 }} />
            <Skeleton active paragraph={{ rows: 3 }} />
            <Skeleton active paragraph={{ rows: 3 }} />
          </>
        )}

        {!loading && questionData.length > 0 && (
          <>
            {questionData.map((question, index) => (
              <ContentCard question={question} key={index} />
            ))}
          </>
        )}

        {!loading && questionData.length === 0 && (
          <div className="flex justify-center">
            <div>
              <img src="/no-question.svg" alt="No Question yet…" width="200" />
              <p className="text-center font-light">No Question yet…</p>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default CategoriesName;
