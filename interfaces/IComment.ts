interface IComment {
  parentId?: string;
  childId?: string;
  content: string;
  id: string;
  userId: string;
  created: number;
  level: number;
  answerId: string;
}

export default IComment;
