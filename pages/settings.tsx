import React, { useState, useEffect, useContext } from 'react';
import Head from 'next/head';
import { useSelector, useDispatch } from 'react-redux';
import openNotificationWithIcon from '../plugins/openNotificationWithIcon';
import { loginUser as loginUserAction } from '../store/action';
import Layout from '../components/Layout';
import Input from '../components/Input';
import Upload from '../components/Upload';
import { FirestoreContext } from '../contexts/FirestoreContextProvider';
import getBase64 from '../plugins/getBase64';
import uploadToStorage from '../plugins/uploadToStorage';
import SignUpModal from '../components/Navbar/SignUpModal';
import firebase from '../plugins/firebase';
import 'firebase/storage';

const notificationDocName = 'notifications';

const Settings = () => {
  const db = useContext(FirestoreContext);
  const loginUser = useSelector((state) => state.loginUser);
  const isLogin = useSelector((state) => state.isLogin);
  const dispatch = useDispatch();

  const [tagline, setTagline] = useState('');
  const [twitter, setTwitter] = useState('');
  const [producthunt, setProducthunt] = useState('');
  const [github, setGithub] = useState('');
  const [patreon, setPatreon] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [getNewQuestionNotification, setGetNewQuestionNotification] = useState(
    true
  );
  const [getNewCommentNotification, setGetNewCommentNotification] = useState(
    true
  );
  const [getNewanswerNotification, setGetNewanswerNotification] = useState(
    true
  );
  const [isSaving, setIsSaving] = useState(false);
  const [name, setName] = useState('');
  const [website, setWebsite] = useState('');
  const [isLoadingImage, setIsLoadingImage] = useState(false);
  const [hasSettingsDoc, setHasSettingsDoc] = useState(true);

  useEffect(() => {
    setName(loginUser.customName);
    if (loginUser.tagline !== undefined) {
      setTagline(loginUser.tagline);
    }
    if (loginUser.website !== undefined) {
      setWebsite(loginUser.website);
    }
    if (
      loginUser.social !== undefined &&
      loginUser.social.twitter !== undefined
    ) {
      setTwitter(loginUser.social.twitter);
    }
    if (
      loginUser.social !== undefined &&
      loginUser.social.productHunt !== undefined
    ) {
      setProducthunt(loginUser.social.productHunt);
    }
    if (
      loginUser.social !== undefined &&
      loginUser.social.gitHub !== undefined
    ) {
      setGithub(loginUser.social.gitHub);
    }
    if (
      loginUser.social !== undefined &&
      loginUser.social.patreon !== undefined
    ) {
      setPatreon(loginUser.social.patreon);
    }
  }, [loginUser]);

  useEffect(() => {
    const fetchSettings = async () => {
      const settingsSnapShot = await db
        .collection('publicUsers')
        .doc(loginUser.uid)
        .collection('settings')
        .doc(notificationDocName)
        .get();
      if (!settingsSnapShot.exists) {
        setHasSettingsDoc(false);
        return;
      }
      const settings = settingsSnapShot.data();
      if (settings.getNewQuestionNotification === undefined) return;
      setGetNewQuestionNotification(settings.getNewQuestionNotification);
      if (settings.getNewCommentNotification === undefined) return;
      setGetNewCommentNotification(settings.getNewCommentNotification);
      if (settings.getNewanswerNotification === undefined) return;
      setGetNewanswerNotification(settings.getNewanswerNotification);
    };
    if (loginUser.uid !== undefined) fetchSettings();
  }, [loginUser]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const updateData: IUpdateData = {};

      if (name === '') {
        openNotificationWithIcon('error', 'Please put your name');
        return;
      }

      updateData.customName = name;

      // Pictureのみここで設定
      if (loginUser.picture !== undefined) {
        updateData.picture = loginUser.picture;
      }

      let pictureImage = '';
      if (imageUrl !== '') {
        pictureImage = await uploadToStorage(loginUser.uid, imageUrl, firebase);
        updateData.picture = pictureImage;
      }
      updateData.tagline = tagline;
      updateData.website = website;
      updateData.social = {};
      updateData.social.twitter = twitter;
      updateData.social.productHunt = producthunt;
      updateData.social.gitHub = github;
      updateData.social.patreon = patreon;
      updateData.username = loginUser.username;
      updateData.uid = loginUser.uid;
      await db.collection('publicUsers').doc(loginUser.uid).update(updateData);
      if (hasSettingsDoc) {
        await db
          .collection('publicUsers')
          .doc(loginUser.uid)
          .collection('settings')
          .doc(notificationDocName)
          .update({
            getNewQuestionNotification,
            getNewCommentNotification,
            getNewanswerNotification,
          });
      } else {
        await db
          .collection('publicUsers')
          .doc(loginUser.uid)
          .collection('settings')
          .doc(notificationDocName)
          .set({
            getNewQuestionNotification,
            getNewCommentNotification,
            getNewanswerNotification,
          });
      }
      setHasSettingsDoc(true);
      openNotificationWithIcon('success', 'Updated successfully');
      dispatch(loginUserAction(updateData));
    } catch (err) {
      console.error(err);
      openNotificationWithIcon('error', 'An error occured. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const NoLogin = () => (
    <div className="border-2 rounded w-8/12 m-auto">
      <SignUpModal />
    </div>
  );

  const handleChangeImage = (info) => {
    if (info.file.status === 'uploading') {
      setIsLoadingImage(true);
      return;
    }
    if (info.file.status === 'done') {
      // Get this url from response in real world.
      getBase64(info.file.originFileObj, (imageUrl) => {
        setImageUrl(imageUrl);
        setIsLoadingImage(false);
      });
    }
  };
  const title = 'Settings | AskMakers - Ask experienced makers questions';

  return (
    <>
      <Head>
        <meta key="robots" name="robots" content="noindex" />
        <title key="title">{title}</title>
        <meta key="og:title" property="og:title" content={title} />
        <meta key="og:site_name" property="og:site_name" content={title} />
      </Head>
      <Layout>
        <div className="w-full md:w-9/12 lg:w-9/12 my-10 m-auto p-2">
          {isLogin ? (
            <>
              <h1 className="text-4xl font-bold mb-8">Settings</h1>
              <h2 className="text-2xl font-bold mt-6 mb-2">Basic</h2>
              <form onSubmit={handleSubmit}>
                <div className="flex flex-wrap justify-between -mx-3">
                  <div className="w-full md:w-6/12 lg:w-6/12 px-3">
                    <div className="mb-3">
                      <Input
                        label="Name"
                        id="name"
                        type="text"
                        value={name}
                        handleChange={(e) => setName(e.target.value)}
                      />
                    </div>
                    <div className="mb-3">
                      <Input
                        label="Tagline"
                        id="tagline"
                        type="text"
                        value={tagline}
                        handleChange={(e) => setTagline(e.target.value)}
                      />
                    </div>
                    <div className="mb-3">
                      <Input
                        label="Website"
                        placeholder="https://askmakers.co"
                        id="website"
                        type="url"
                        value={website}
                        handleChange={(e) => setWebsite(e.target.value)}
                      />
                    </div>
                    <div className="mb-3 md:mb-0 lg:mb-0">
                      <Upload
                        label="Profile Picture"
                        imageUrl={imageUrl}
                        handleChange={handleChangeImage}
                        isLoading={isLoadingImage}
                      />
                    </div>
                  </div>
                  <div className="w-full md:w-6/12 lg:w-6/12 px-3">
                    <div className="mb-3">
                      <Input
                        label="Twitter Handle"
                        placeholder="jack"
                        id="twitter"
                        type="text"
                        value={twitter}
                        handleChange={(e) => setTwitter(e.target.value)}
                      />
                    </div>
                    <div className="mb-3">
                      <Input
                        label="Product Hunt Handle"
                        placeholder="rrhoover"
                        id="producthunt"
                        type="text"
                        value={producthunt}
                        handleChange={(e) => setProducthunt(e.target.value)}
                      />
                    </div>
                    <div className="mb-3">
                      <Input
                        label="GitHub Handle"
                        placeholder="defunkt"
                        id="github"
                        type="text"
                        value={github}
                        handleChange={(e) => setGithub(e.target.value)}
                      />
                    </div>
                    <Input
                      label="Patreon Handle"
                      placeholder="jackconte"
                      id="patreon"
                      type="text"
                      value={patreon}
                      handleChange={(e) => setPatreon(e.target.value)}
                    />
                  </div>
                </div>
                <h2 className="text-2xl font-bold mt-6 mb-2">
                  Email Notifications
                </h2>
                <div className="flex flex-wrap justify-between -mx-3">
                  <div className="w-full md:w-6/12 lg:w-6/12 px-3">
                    <div className="mb-4">
                      <label
                        className="font-semibold mb-1 block"
                        htmlFor="new-question-notification"
                      >
                        New Question Notification
                      </label>
                      <input
                        id="new-question-notification"
                        checked={getNewQuestionNotification}
                        type="checkbox"
                        onChange={() =>
                          setGetNewQuestionNotification(
                            !getNewQuestionNotification
                          )
                        }
                        className="form-checkbox text-green-500 h-5 w-5"
                      />
                    </div>
                    <div className="mb-4">
                      <label
                        className="font-semibold block"
                        htmlFor="new-comment-notification"
                      >
                        New Comment Notification
                      </label>
                      <p className="text-sm mb-1">
                        You get this notification when someone comments on your
                        answer.
                      </p>
                      <input
                        id="new-comment-notification"
                        checked={getNewCommentNotification}
                        type="checkbox"
                        onChange={() =>
                          setGetNewCommentNotification(
                            !getNewCommentNotification
                          )
                        }
                        className="form-checkbox text-green-500 h-5 w-5"
                      />
                    </div>
                    <div className="mb-4">
                      <label
                        className="font-semibold block"
                        htmlFor="new-answer-notification"
                      >
                        New Answer Notification
                      </label>
                      <p className="text-sm mb-1">
                        You get this notification when someone answers your
                        question.
                      </p>
                      <input
                        id="new-answer-notification"
                        checked={getNewanswerNotification}
                        type="checkbox"
                        onChange={() =>
                          setGetNewanswerNotification(!getNewanswerNotification)
                        }
                        className="form-checkbox text-green-500 h-5 w-5"
                      />
                    </div>
                  </div>
                </div>
                <div className="px-2 md:px-0 lg:px-0">
                  {isSaving ? (
                    <button
                      disabled
                      className="rounded px-6 py-3 bg-gray-500 text-white font-semibold mt-4 cursor-not-allowed focus:outline-none"
                    >
                      Submitting…
                    </button>
                  ) : (
                    <button
                      type="submit"
                      className="rounded px-6 py-3 bg-gray-900 text-white font-semibold mt-4 focus:outline-none"
                    >
                      Update
                    </button>
                  )}
                </div>
              </form>
            </>
          ) : (
            <NoLogin />
          )}
        </div>
      </Layout>
    </>
  );
};

interface IUpdateData {
  customName?: string;
  picture?: string;
  tagline?: string;
  website?: string;
  username?: string;
  uid?: string;
  social?: ISocial;
}

interface ISocial {
  twitter?: string;
  productHunt?: string;
  gitHub?: string;
  patreon?: string;
}

export default Settings;
