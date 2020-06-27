import ISocial from './ISocial';

interface IPublicUser {
  created?: number;
  customName: string;
  isEmailNewQuestionNotification?: boolean;
  isEnabletoShareOnTwitter?: boolean;
  picture: string;
  social?: ISocial;
  tagline?: string;
  uid?: string;
  username?: string;
  website?: string;
}

export default IPublicUser;
