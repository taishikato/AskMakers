import React, { useState, useEffect, useContext } from 'react';
import { useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBookmark } from '@fortawesome/free-solid-svg-icons';
import { message, Skeleton } from 'antd';
import Layout from '../components/Layout';
import AnswerWrapper from '../components/AnswersSlugId/AnswerWrapper';
import { FirestoreContext } from '../contexts/FirestoreContextProvider';
import asycForEach from '../plugins/asyncForEach';
import { IInitialState } from '../store/store';
import IAnswer from '../interfaces/IAnswer';
import IBookmark from '../interfaces/IBookmark';
import IQuestion from '../interfaces/IQuestion';

const NoBookmark = () => (
  <div className="flex justify-center">
    <div>
      <img src="/no-bookmark.svg" width="250" alt="Bo Bookmark yet…" />
      <p className="text-center mt-3 font-light">No Bookmark yet…</p>
    </div>
  </div>
);

const Bookmarks = () => {
  const [answersData, setAnswerData] = useState([]);
  const [loading, setLoading] = useState(true);
  const db = useContext(FirestoreContext);
  const loginUser = useSelector<IInitialState, IInitialState['loginUser']>(
    (state) => state.loginUser
  );

  const handleDeleteAnswer = async (answerId) => {
    if (!window.confirm('Are you sure to delete this answer?')) {
      return;
    }
    await db.collection('answers').doc(answerId).delete();
    message.success('Deleted successfully');
  };

  useEffect(() => {
    const fetchBookmarks = async () => {
      setLoading(true);
      const bookmarksSnapShot = await db
        .collection('publicUsers')
        .doc(loginUser.uid)
        .collection('bookmarks')
        .get();
      if (bookmarksSnapShot.empty) {
        setLoading(false);
        return;
      }

      const answerData = [];
      await asycForEach(bookmarksSnapShot.docs, async (doc) => {
        const bookmark = doc.data() as IBookmark;
        const answerSnapShot = await db
          .collection('answers')
          .doc(bookmark.answerId)
          .get();
        const answer = answerSnapShot.data() as IAnswer;
        const user = await db
          .collection('publicUsers')
          .doc(answer.answerUserId)
          .get();
        const question = await db
          .collection('questions')
          .doc(answer.questionId)
          .get();
        answerData.push({
          answer,
          user: user.data(),
          question: question.data() as IQuestion,
        });
      });
      setAnswerData(answerData);
      setLoading(false);
    };
    if (Object.keys(loginUser).length > 0) fetchBookmarks();
  }, [loginUser]);

  return (
    <Layout>
      <div className="w-10/12 m-auto mt-8">
        <h2 className="font-bold text-xl text-black flex items-center mb-4">
          <FontAwesomeIcon
            icon={faBookmark}
            className="h-4 w-4 text-green-500 mr-2"
          />
          Bookmarked Answers
        </h2>
        {loading && (
          <>
            <Skeleton active paragraph={{ rows: 3 }} />
            <Skeleton active paragraph={{ rows: 3 }} />
          </>
        )}
        {!loading && answersData.length > 0 && (
          <>
            {answersData.map((answerData) => (
              <div key={answerData.answer.id} className="mb-4">
                <AnswerWrapper
                  handleDeleteAnswer={handleDeleteAnswer}
                  answerData={answerData}
                  questionSlug={answerData.question.slug}
                  questionTitle={answerData.question.text}
                />
              </div>
            ))}
          </>
        )}
        {!loading && answersData.length === 0 && <NoBookmark />}
      </div>
    </Layout>
  );
};

export default Bookmarks;
