import React, { FC, useState, useContext } from 'react';
import { useSelector } from 'react-redux';
import ReactMde from 'react-mde';
import MarkdownIt from 'markdown-it';
import Modal from 'react-modal';
import { FirestoreContext } from '../../contexts/FirestoreContextProvider';
import generateUuid from '../../plugins/generateUuid';
import getUnixTime from '../../plugins/getUnixTime';
import openNotificationWithIcon from '../../plugins/openNotificationWithIcon';
import SignUpModal from '../Navbar/SignUpModal';
import IComment from '../../interfaces/IComment';

const mdParser = new MarkdownIt();

interface IProps {
  answerId: string;
}

const CommentForm: FC<IProps> = ({ answerId }) => {
  const [comment, setComment] = useState('');
  const [hasError, setHasError] = useState(false);
  const [posting, setPosting] = useState(false);
  const [isSignupModalOpen, setIsSignupModalOpen] = useState(false);
  const [selectedTab, setSelectedTab] = useState<'write' | 'preview'>('write');
  const loginUser = useSelector((state) => state.loginUser);
  const isLogin = useSelector((state) => state.isLogin);

  const db = useContext(FirestoreContext);

  const PostComment = async () => {
    setHasError(false);
    setPosting(true);
    if (!comment) {
      setHasError(true);
      setPosting(false);
      return;
    }
    const id = generateUuid();
    const commentObj: IComment = {
      id,
      content: comment,
      userId: loginUser.uid,
      created: getUnixTime(),
      level: 1,
      answerId,
    };
    await db.collection('comments').doc(id).set(commentObj);
    openNotificationWithIcon('success', 'Posted a comment successfully!');
    setPosting(false);
    setComment('');
  };
  return (
    <>
      {isLogin ? (
        <div>
          <div className="font-bold text-lg mb-3">Add a comment</div>
          <ReactMde
            value={comment}
            onChange={setComment}
            classes={{ textArea: 'focus:outline-none' }}
            selectedTab={selectedTab}
            onTabChange={setSelectedTab}
            generateMarkdownPreview={(markdown) =>
              Promise.resolve(mdParser.render(markdown))
            }
          />
          {hasError && (
            <div className="text-sm text-red-500 italic">
              You need to write some comment.
            </div>
          )}
          <div className="flex justify-end mt-2">
            {posting ? (
              <button className="rounded-full px-5 py-1 bg-gray-300 text-white font-semibolf text-lg focus:outline-none">
                Post…
              </button>
            ) : (
              <button
                className="rounded-full px-5 py-1 bg-gray-800 text-white font-semibolf text-lg focus:outline-none hover:bg-gray-600"
                onClick={PostComment}
              >
                Post
              </button>
            )}
          </div>
        </div>
      ) : (
        <>
          <div>
            <button
              className="w-full p-2 border rounded text-gray-600 text-left focus:outline-none"
              onClick={() => setIsSignupModalOpen(true)}
            >
              Add a comment…
            </button>
          </div>
          <Modal
            isOpen={isSignupModalOpen}
            onRequestClose={() => setIsSignupModalOpen(false)}
            ariaHideApp={false}
            style={{
              overlay: {
                zIndex: 100000,
                backgroundColor: 'rgba(0, 0, 0, 0.7)',
              },
              content: {
                padding: '1.25rem',
                width: '600px',
                maxWidth: '100%',
                position: 'absolute',
                top: '40%',
                left: '50%',
                bottom: 'none',
                transform: 'translateY(-50%)translateX(-50%)',
                border: 'none',
                backgroundColor: '#f9f9f9',
              },
            }}
          >
            <SignUpModal />
          </Modal>
        </>
      )}
    </>
  );
};

export default CommentForm;
