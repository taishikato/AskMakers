import React, { FC, useState, useContext } from 'react';
import ReactMde from 'react-mde';
import MarkdownIt from 'markdown-it';
import openNotificationWithIcon from '../../plugins/openNotificationWithIcon';
import { FirestoreContext } from '../../contexts/FirestoreContextProvider';

const mdParser = new MarkdownIt();

interface IProps {
  commentId: string;
  commentContent: string;
}

const CommentEditModal: FC<IProps> = ({ commentId, commentContent }) => {
  const db = useContext(FirestoreContext);
  const [comment, setComment] = useState(commentContent);
  const [hasError, setHasError] = useState(false);
  const [posting, setPosting] = useState(false);
  const [selectedTab, setSelectedTab] = useState<'write' | 'preview'>('write');

  const updateComment = async () => {
    setHasError(false);
    setPosting(true);
    if (!comment) {
      setHasError(true);
      setPosting(false);
      return;
    }
    await db.collection('comments').doc(commentId).update({ content: comment });
    openNotificationWithIcon('success', 'Updated the comment successfully!');
    setPosting(false);
  };

  return (
    <div>
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
            Updating…
          </button>
        ) : (
          <button
            className="rounded-full px-5 py-1 bg-gray-800 text-white font-semibolf text-lg focus:outline-none hover:bg-gray-600"
            onClick={updateComment}
          >
            Update
          </button>
        )}
      </div>
    </div>
  );
};

export default CommentEditModal;
