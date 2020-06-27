import React, { useContext } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Layout from '../components/Layout';
import Input from '../components/Input';
import getUnixTime from '../plugins/getUnixTime';
import generateSlug from '../plugins/generateSlug';
import { useSelector } from 'react-redux';
import uuid from 'uuid/v4';
import ReactMde from 'react-mde';
import MarkdownIt from 'markdown-it';
import { Checkbox, message } from 'antd';
import { FirestoreContext } from '../contexts/FirestoreContextProvider';
import topicOptions from '../consts/topicOptions';

const mdParser = new MarkdownIt();

const AskQuestion = () => {
  const db = useContext(FirestoreContext);
  const loginUser = useSelector((state) => state.loginUser);
  const router = useRouter();
  const [title, setTitle] = React.useState('');
  const [body, setBody] = React.useState('');
  const [topic, setTopic] = React.useState([]);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [selectedTab, setSelectedTab] = React.useState<'write' | 'preview'>(
    'write'
  );
  const handleTitleChange = (e) => setTitle(e.target.value);

  const onChange = (checkedValues) => setTopic(checkedValues);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const id = uuid().split('-').join('');
      const slug = await generateSlug(title);
      await db.collection('questions').doc(id).set({
        id,
        created: getUnixTime(),
        text: title,
        body,
        fromUserId: loginUser.uid,
        slug,
        topics: topic,
        isGeneral: true,
      });
      message.success('Submitted successfully');
      router.push('/questions/[slug]', `/questions/${slug}`);
    } catch (err) {
      console.log({ err });
      message.error('An error occured. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout>
      <Head>
        <meta key="robots" name="robots" content="noindex" />
      </Head>
      <div className="w-full p-2 md:p-0 lg:p-0 md:w-8/12 lg:w-8/12 m-auto my-10">
        <h1 className="text-3xl font-medium mb-5">Ask a question</h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <Input
              value={title}
              id="title"
              type="text"
              handleChange={handleTitleChange}
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
              <Checkbox.Group options={topicOptions} onChange={onChange} />
            </div>
          </div>
          <div>
            {!isSubmitting && title === '' && (
              <button className="px-6 py-3 bg-green-300 rounded text-white font-semibold cursor-not-allowed focus:outline-none">
                Post your question
              </button>
            )}
            {!isSubmitting && title !== '' && (
              <button
                className="px-6 py-3 bg-green-400 rounded text-white font-semibold hover:bg-green-500 focus:outline-none"
                type="submit"
              >
                Post your question
              </button>
            )}
            {isSubmitting && (
              <button
                disabled
                className="px-6 py-3 bg-green-300 rounded text-white font-semibold focus:outline-none"
              >
                Submitting…
              </button>
            )}
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default AskQuestion;
