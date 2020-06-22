import ISocial from './ISocial';

interface IUpdateData {
  username: string;
  customName?: string;
  picture?: string;
  tagline?: string;
  website?: string;
  social?: ISocial;
}

export default IUpdateData;
