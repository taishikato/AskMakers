import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { NextPage } from 'next';
import { useSelector, connect } from 'react-redux';
import Link from 'next/link';
import NotFound from '../../components/Common/NotFound';
import Layout from '../../components/Layout';
import Input from '../../components/Input';
import getUnixTime from '../../plugins/getUnixTime';
import openNotificationWithIcon from '../../plugins/openNotificationWithIcon';
import ReactMde from 'react-mde';
import MarkdownIt from 'markdown-it';
import { Checkbox } from 'antd';
import topicOptions from '../../consts/topicOptions';
import IQuestion from '../../interfaces/IQuestion';
import firebase from '../../plugins/firebase';
import 'firebase/firestore';
import { wrapper, IInitialState } from '../../store/store';

const db = firebase.firestore();

const mdParser = new MarkdownIt();

const resetTopic = async (
  db: firebase.firestore.Firestore,
  question,
  topic: string[]
) => {
  const topicsSnapShot = await db
    .collection('questionsTopic')
    .where('questionId', '==', question.id)
    .get();
  if (!topicsSnapShot.empty) {
    for (const doc of topicsSnapShot.docs) {
      await db.collection('questionsTopic').doc(doc.id).delete();
    }
  }
  for (const t of topic) {
    await db.collection('questionsTopic').add({
      topic: t,
      questionId: question.id,
      questionCreated: question.created,
    });
  }
};

const EditQuestionSlug: NextPage = () => {
  const router = useRouter();
  const loginUser = useSelector((state) => state.loginUser);

  const [question, setQuestion] = useState<IQuestion>({} as IQuestion);
  const [noAuth, setNoAuth] = useState(false);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [topic, setTopic] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedTab, setSelectedTab] = useState<'write' | 'preview'>('write');

  useEffect(() => {
    const getQuestion = async () => {
      const slug = router.query.slug;
      const questionData = await db
        .collection('questions')
        .where('slug', '==', slug)
        .get();
      const question = questionData.docs[0].data();
      setQuestion(question as IQuestion);
    };
    if (Object.keys(router.query).length > 0) getQuestion();
  }, [router.query]);

  useEffect(() => {
    const getTopics = async () => {
      const topicData = await db
        .collection('questionsTopic')
        .where('questionId', '==', question.id)
        .get();
      if (topicData.empty) return;

      const topicArray = [];
      for (const doc of topicData.docs) {
        const topic = doc.data();
        topicArray.push(topic.topic);
      }
      setTopic(topicArray);
    };
    if (question.id !== undefined) getTopics();

    if (question.id === undefined) return;
    if (loginUser.uid !== question.fromUserId) {
      setNoAuth(true);
      return;
    }
    setTitle(question.text);
    setBody(question.body);
  }, [question]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    const ref = db.collection('questions').doc(question.id);
    try {
      await ref.update({
        updated: getUnixTime(),
        text: title,
        body,
      });
      // Topic
      await resetTopic(db, question, topic);
      openNotificationWithIcon('success', 'Updated successfully');
    } catch (err) {
      openNotificationWithIcon('error', 'An error occured. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const pagetitle = `Edit question | AskMakers - Ask experienced makers questions`;
  const url = `https://askmakers.co${router.asPath}`;
  const description = 'Check out this question and post your answer!';

  return (
    <Layout>
      <Head>
        <meta key="robots" name="robots" content="noindex" />
        <title key="title">{pagetitle}</title>
        <meta key="og:title" property="og:title" content={pagetitle} />
        <meta key="og:site_name" property="og:site_name" content={pagetitle} />
        <meta key="og:url" property="og:url" content={url} />
        <link key="canonical" rel="canonical" href={url} />
        <meta key="description" name="description" content={description} />
        <meta
          key="og:description"
          property="og:description"
          content={description}
        />
      </Head>
      {noAuth ? (
        <NotFound />
      ) : (
        <div className="w-full p-2 md:p-0 lg:p-0 md:w-8/12 lg:w-8/12 m-auto my-10">
          <h1 className="text-3xl font-medium mb-5">Edit a question</h1>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <Input
                value={title}
                id="title"
                type="text"
                handleChange={(e) => setTitle(e.target.value)}
                label="Title"
                placeholder="How do you validate your idea?"
                requied={true}
              />
            </div>
            <div className="mb-3">
              <label className="font-semibold mb-2 block">Body</label>
              <ReactMde
                value={body}
                onChange={setBody}
                classes={{ textArea: 'focus:outline-none' }}
                selectedTab={selectedTab}
                onTabChange={setSelectedTab}
                generateMarkdownPreview={(markdown) =>
                  Promise.resolve(mdParser.render(markdown))
                }
              />
            </div>
            <div className="mb-5">
              <label className="font-semibold mb-2 block">Topic</label>
              <div className="flex flex-wrap">
                <Checkbox.Group
                  options={topicOptions}
                  onChange={(checkedValues) => setTopic(checkedValues)}
                  value={topic}
                />
              </div>
            </div>
            <div className="flex flex-wrap">
              {!isSubmitting && title === '' && (
                <button className="w-full md:w-auto lg:w-auto px-6 py-3 bg-green-300 rounded text-white font-semibold cursor-not-allowed focus:outline-none">
                  Update your question
                </button>
              )}
              {!isSubmitting && title !== '' && (
                <button
                  className="w-full md:w-auto lg:w-auto px-6 py-3 bg-green-400 rounded text-white font-semibold hover:bg-green-500 focus:outline-none"
                  type="submit"
                >
                  Update your question
                </button>
              )}
              {isSubmitting && (
                <button
                  disabled
                  className="w-full md:w-auto lg:w-auto px-6 py-3 bg-green-300 rounded text-white font-semibold focus:outline-none"
                >
                  Submitting…
                </button>
              )}
              <Link href="/questions/[slug]" as={`/questions/${question.slug}`}>
                <a className="w-full md:w-auto lg:w-auto block text-center md:text-left lg:text-left px-6 py-3 bg-white rounded font-semibold hover:underline">
                  Go back to the question page
                </a>
              </Link>
            </div>
          </form>
        </div>
      )}
    </Layout>
  );
};

// EditQuestionSlug.getInitialProps = ({ store }: NextPageContext) => {
//   console.log({ store });
//   // console.log(store.getState().loginUser);
//   return {};
// };

export default connect((state: IInitialState) => state)(EditQuestionSlug);
