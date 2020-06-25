interface IQuestion {
  created: number;
  fromUserId: string;
  id: string;
  image: string;
  isAnswered: boolean;
  isGeneral: boolean;
  slug: string;
  text: string;
  toUserId: string;
}

export default IQuestion;
