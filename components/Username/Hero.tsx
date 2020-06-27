import React from 'react';
import TwitterIcon from '../../components/TwitterIcon';
import ProducthuntIcon from '../../components/ProducthuntIcon';
import GitHubIcon from '../../components/GitHubIcon';
import PatreonIcon from '../../components/PatreonIcon';
import IPublicUser from '../../interfaces/IPublicUser';

interface IProps {
  user: IPublicUser;
}

const Hero: React.FC<IProps> = ({ user }) => {
  return (
    <div className="bg-green-300">
      <div className="py-8 m-auto w-10/12 text-white">
        <div className="flex flex-wrap text-center md:text-left lg:text-left">
          <div className="w-full md:w-auto lg:w-auto">
            <img
              src={user.picture}
              width="100px"
              className="rounded-full m-auto md:m-0 lg:m-0"
              alt={user.customName}
            />
          </div>
          <div className="w-full md:w-7/12 lg:w-7/12 ml-0 md:ml-5 lg:ml-5">
            <h1 className="font-bold text-2xl">{user.customName}</h1>
            <div className="text-lg">{user.tagline}</div>
            {user.website !== undefined && user.website !== '' && (
              <div>
                <a
                  href={user.website}
                  target="_blank"
                  className="text-white font-light hover:underline"
                >
                  {user.website}
                </a>
              </div>
            )}
            <div className="flex flex-wrap mt-4 justify-center md:justify-start lg:justify-start">
              {user.social.twitter !== undefined && user.social.twitter !== '' && (
                <div>
                  <TwitterIcon name={user.social.twitter} />
                </div>
              )}
              {user.social.productHunt !== undefined &&
                user.social.productHunt !== '' && (
                  <div>
                    <ProducthuntIcon name={user.social.productHunt} />
                  </div>
                )}
              {user.social.gitHub !== undefined && user.social.gitHub !== '' && (
                <div>
                  <GitHubIcon name={user.social.gitHub} />
                </div>
              )}
              {user.social.patreon !== undefined && user.social.patreon !== '' && (
                <div>
                  <PatreonIcon name={user.social.patreon} />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
