import React, { useEffect } from 'react';
import RenderRecentAnswers from '../components/RenderRecentAnswers';
import asyncForEach from '../plugins/asyncForEach';
import Card from './Common/Card';
import firebase from '../plugins/firebase';
import 'firebase/firestore';

const db = firebase.firestore();

const RecentAnswer = () => {
  const [answerData, setAnswerData] = React.useState<any>([]);
  useEffect(() => {
    const getData = async () => {
      const answerDataSet = [];
      const recentAnswers = await db
        .collection('answers')
        .orderBy('created', 'desc')
        .limit(5)
        .get();
      await asyncForEach(recentAnswers.docs, async (doc) => {
        const answer = doc.data();
        const [userData, questionData] = await Promise.all([
          db.collection('publicUsers').doc(answer.answerUserId).get(),
          db.collection('questions').doc(answer.questionId).get(),
        ]);
        answerDataSet.push({
          answer,
          user: userData.data(),
          question: questionData.data(),
        });
      });
      setAnswerData(answerDataSet);
    };
    getData();
  }, []);

  return (
    <Card header="Recent Answers">
      <div className="mt-3">
        <RenderRecentAnswers answerData={answerData} />
      </div>
    </Card>
  );
};

export default RecentAnswer;
