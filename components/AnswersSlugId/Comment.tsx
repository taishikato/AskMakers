import React, { FC, useState, useEffect, useContext } from 'react';
import moment from 'moment';
import Modal from 'react-modal';
import ImageAndName from '../Common/ImageAndName';
import { useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt } from '@fortawesome/free-regular-svg-icons';
import { faEdit } from '@fortawesome/free-solid-svg-icons';
import { FirestoreContext } from '../../contexts/FirestoreContextProvider';
import IComment from '../../interfaces/IComment';
import openNotificationWithIcon from '../../plugins/openNotificationWithIcon';
import CommentEditModal from './CommentEditModal';
import IPublicUser from '../../interfaces/IPublicUser';

interface IProps {
  comment: IComment;
}

const Comment: FC<IProps> = ({ comment }) => {
  const db = useContext(FirestoreContext);
  const loginUser = useSelector((state) => state.loginUser);
  const [user, setUser] = useState<IPublicUser>({} as IPublicUser);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const deleteComment = async () => {
    try {
      if (!window.confirm('Are you sure to delete this comment?')) return;
      await db.collection('comments').doc(comment.id).delete();
      openNotificationWithIcon('success', 'Deleted successfully');
    } catch (err) {
      openNotificationWithIcon('error', 'An error occured. Please try again.');
    }
  };

  useEffect(() => {
    const fetchUser = async () => {
      const userSnapShot = await db
        .collection('publicUsers')
        .doc(comment.userId)
        .get();
      setUser(userSnapShot.data() as IPublicUser);
    };
    if (comment.userId) fetchUser();
  }, [comment]);

  return (
    <>
      <div className="p-3 border rounded mb-3">
        <div className="flex items-center justify-between">
          <ImageAndName user={user} />
          <span className="text-xs text-gray-600">
            {moment.unix(comment.created).format('LL')}
          </span>
        </div>
        <div className="mt-3">{comment.content}</div>
        {loginUser.uid === comment.userId && (
          <div className="flex items-center justify-end">
            <button
              className="block focus:outline-none"
              onClick={() => setIsModalOpen(true)}
            >
              <FontAwesomeIcon
                icon={faEdit}
                className="h-5 w-5 text-gray-600"
              />
            </button>
            <button
              className="ml-3 block focus:outline-none"
              onClick={deleteComment}
            >
              <FontAwesomeIcon
                icon={faTrashAlt}
                className="h-5 w-5 text-gray-600"
              />
            </button>
          </div>
        )}
      </div>
      <Modal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        ariaHideApp={false}
        style={{
          overlay: {
            zIndex: 100,
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
            backgroundColor: '#ffffff',
          },
        }}
      >
        <div>
          <CommentEditModal
            commentId={comment.id}
            commentContent={comment.content}
          />
        </div>
      </Modal>
    </>
  );
};

export default Comment;
