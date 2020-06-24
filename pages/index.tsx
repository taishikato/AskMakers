import React from 'react';
import Link from 'next/link';
import { NextPage } from 'next';
import { useSelector } from 'react-redux';
import Layout from '../components/Layout';
import Hero from '../components/Hero';
import FeaturedMaker from '../components/FeaturedMaker';
import WelcomeBox from '../components/WelcomeBox';
import QuestionWrapper from '../components/QuestionWrapper';
import RecentAnswer from '../components/RecentAnswer';
import asyncForEach from '../plugins/asyncForEach';
import firebase from '../plugins/firebase';
import 'firebase/firestore';

const db = firebase.firestore();

const Home: NextPage<Props> = (props) => {
  const { questions } = props;
  const [quesionsContainer, setQuesionsContainer] = React.useState(questions);
  const [lastQuestion, setLastQuestion] = React.useState<ISingleQuestion>();
  const isLogin = useSelector((state) => state.isLogin);

  React.useEffect(() => {
    setLastQuestion(quesionsContainer[quesionsContainer.length - 1].question);
  }, [quesionsContainer]);

  const loadQuestions = async (e) => {
    e.preventDefault();
    const quesionsContainerCopy = quesionsContainer.concat();
    console.log({ quesionsContainerCopy });
    const questionData = await db
      .collection('questions')
      .where('isGeneral', '==', true)
      .orderBy('created', 'desc')
      .startAfter(lastQuestion.created)
      .limit(10)
      .get();
    await asyncForEach(questionData.docs, async (doc) => {
      const question = doc.data();
      const [userData, answerData, upvoteData] = await Promise.all([
        db.collection('publicUsers').doc(question.fromUserId).get(),
        db.collection('answers').where('questionId', '==', question.id).get(),
        db
          .collection('questionUpvotes')
          .where('questionId', '==', question.id)
          .get(),
      ]);
      const user = userData.data();
      question.answerCount = answerData.size;
      question.questionUpvoteCount = upvoteData.size;
      quesionsContainerCopy.push({ question, user });
    });
    setQuesionsContainer(quesionsContainerCopy);
  };

  return (
    <Layout>
      {!isLogin && <Hero />}
      <div className="w-full md:w-10/12 lg:w-10/12 mt-5 mb-10 m-auto">
        <div className="w-full flex flex-wrap px-2 md:-mx-4 lg:-mx-4">
          <div className="w-full mb-5 md:w-8/12 lg:w-8/12 md:px-4 lg:px-4">
            {quesionsContainer.map((question, index) => (
              <QuestionWrapper question={question} key={index} />
            ))}
            {/* <button onClick={loadQuestions}>Load more</button> */}
          </div>
          <aside
            className="w-full md:w-4/12 lg:w-4/12 md:px-4 lg:px-4
          "
          >
            <WelcomeBox />
            <FeaturedMaker />
            <RecentAnswer />
            <div className="text-xs text-gray-600">
              <div className="mb-3">
                <Link href="/">
                  <a>AskMakers</a>
                </Link>
                , made by{' '}
                <a href="https://twitter.com/askmakers_app" target="_blank">
                  Taishi Kato
                </a>{' '}
                Ⓒ 2020
              </div>
              <Link href="/terms-privacy">
                <a>Terms of Service & Privacy</a>
              </Link>
            </div>
          </aside>
        </div>
      </div>
    </Layout>
  );
};

Home.getInitialProps = async () => {
  const questionData = await db
    .collection('questions')
    .where('isGeneral', '==', true)
    .orderBy('created', 'desc')
    .limit(10)
    .get();
  const questions: any = [];
  await asyncForEach(questionData.docs, async (doc) => {
    const question = doc.data();
    const [userData, answerData, upvoteData] = await Promise.all([
      db.collection('publicUsers').doc(question.fromUserId).get(),
      db.collection('answers').where('questionId', '==', question.id).get(),
      db
        .collection('questionUpvotes')
        .where('questionId', '==', question.id)
        .get(),
    ]);
    const user = userData.data();
    question.answerCount = answerData.size;
    question.questionUpvoteCount = upvoteData.size;
    questions.push({ question, user });
  });
  return { questions };
};

interface Props {
  questions: any;
}

interface ISingleQuestion {
  created: number;
  fromUserId: string;
  id: string;
  image: string;
  isAnswered: boolean;
  isGeneral: boolean;
  slug: string;
  text: string;
  topics: {};
  answerCount: number;
  questionUpvoteCount: number;
}

export default Home;
