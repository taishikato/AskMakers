import React, { FC, useState, useEffect, useContext } from 'react';
import Comment from './Comment';
import { FirestoreContext } from '../../contexts/FirestoreContextProvider';
import IComment from '../../interfaces/IComment';

interface IProps {
  answerId: string;
}

const Comments: FC<IProps> = ({ answerId }) => {
  const db = useContext(FirestoreContext);
  const [comments, setComments] = useState<IComment[]>([]);

  useEffect(() => {
    const fetchComments = async () => {
      const commentsSnapShot = await db
        .collection('comments')
        .where('answerId', '==', answerId)
        .orderBy('created', 'desc')
        .get();
      if (commentsSnapShot.empty) return;
      const commentsStack = [];
      for (const doc of commentsSnapShot.docs) {
        commentsStack.push(doc.data());
      }
      setComments(commentsStack);
    };
    if (answerId) fetchComments();
  }, [answerId]);
  return (
    <div className="mt-5">
      {comments.map((comment) => (
        <Comment comment={comment} key={comment.id} />
      ))}
    </div>
  );
};

export default Comments;
