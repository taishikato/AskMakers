import React from 'react';
import Link from 'next/link';

const PickedUpAnswer = () => {
  return (
    <ul>
      <li className="my-5">
        <div className="flex">
          <div className="flex-shrink-0 mr-3">
            <Link href="/[username]" as="/mijustin">
              <a>
                <img
                  src="https://firebasestorage.googleapis.com/v0/b/ask-makers.appspot.com/o/users%2FNOmUokm7wWgWi9Pdfz9hvry4j3k2.jpg?alt=media&token=6692a94c-d6c3-4ed6-ad89-4ba816b3dae7"
                  className="w8 h-8 rounded-full"
                />
              </a>
            </Link>
          </div>
          <div>
            <div className="text-sm mb-3">
              <Link href="/[username]" as="/mijustin">
                <a className="text-gray-600">Justin Jackson</a>
              </Link>
            </div>
            <div>
              <Link
                href="/answers/[slug]/[id]"
                as="/answers/how-did-you-get-a-first-paying-customer-and-how/ff79165c4f724c09ac8ef52e58a9b58c"
              >
                <a>
                  The first paying customers for Transistor.fm came from our
                  existing network. In the beginning the two most important
                  traits are: "who do you know?" and "who knows you?"
                </a>
              </Link>
              <div className="text-xs mt-1">
                <span>Question: </span>
                <Link
                  href="/questions/[slug]"
                  as="/questions/how-did-you-get-a-first-paying-customer-and-how"
                >
                  <a className="text-gray-800 hover:underline">
                    Whats the best way in your opinion to get some feedback on a
                    working prototype before you maybe put it up on product
                    hunt? Some private groups/ or…
                  </a>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </li>
      <li className="my-5">
        <div className="flex">
          <div className="flex-shrink-0 mr-3">
            <Link href="/[username]" as="/1HaKr">
              <a>
                <img
                  src="https://pbs.twimg.com/profile_images/1150157842222989312/eZfA0Oki.jpg"
                  className="w8 h-8 rounded-full"
                />
              </a>
            </Link>
          </div>
          <div>
            <div className="text-sm mb-3">
              <Link href="/[username]" as="/1HaKr">
                <a className="text-gray-600">𝙷𝚊𝙺𝚛</a>
              </Link>
            </div>
            <div>
              <Link
                href="/answers/[slug]/[id]"
                as="/answers/whats-the-best-way-in-your-opinion-to-get-some-feedback-on-a-working-prototype-before-you-maybe-put-it-up-on-product-hunt/3825a7cedf544f9a9c913a30b1503481"
              >
                <a>
                  I usually ask for feedback on solo founders group on telegram
                  https://t.me/solofounders
                </a>
              </Link>
              <div className="text-xs mt-1">
                <span>Question: </span>
                <Link
                  href="/questions/[slug]"
                  as="/questions/whats-the-best-way-in-your-opinion-to-get-some-feedback-on-a-working-prototype-before-you-maybe-put-it-up-on-product-hunt"
                >
                  <a className="text-gray-800 hover:underline">
                    Whats the best way in your opinion to get some feedback on a
                    working prototype before you maybe put it up on product
                    hunt? Some private groups/ or…
                  </a>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </li>
      <li className="my-5">
        <div className="flex">
          <div className="flex-shrink-0 mr-3">
            <Link href="/[username]" as="/hyper_yolo">
              <a>
                <img
                  src="https://firebasestorage.googleapis.com/v0/b/ask-makers.appspot.com/o/users%2Fe4UAYSdg99RXMzkk0yfsxqGJVzy2.jpg?alt=media&token=ad286fcf-9915-416b-a7ff-aec257382f4f"
                  className="w8 h-8 rounded-full"
                />
              </a>
            </Link>
          </div>
          <div>
            <div className="text-sm mb-3">
              <Link href="/[username]" as="/hyper_yolo">
                <a className="text-gray-600">Amie Chen</a>
              </Link>
            </div>
            <div>
              <Link
                href="/answers/[slug]/[id]"
                as="/answers/when-is-the-best-to-release-the-producton-product-hunt-i-have-never-seen-the-product-like-mvp-there-all-of-the-products/3aa142f1a60d43b390e70b22fcd92d39"
              >
                <a>
                  I think it's up to you as the maker. Like anything creative,
                  you as the creator makes the call of when you think it's ready
                  to show to people. I say find the balance between
                  perfectionism and impatience (of seeing the fruit of labor) -
                  release when YOU feel ready. People naturally want something
                  polished and bugless, so that's why eventhough there're lots
                  of MVP on PH but you don't see them right away because they
                  weren't been upvoted.
                </a>
              </Link>
              <div className="text-xs mt-1">
                <span>Question: </span>
                <Link
                  href="/questions/[slug]"
                  as="/questions/when-is-the-best-to-release-the-producton-product-hunt-i-have-never-seen-the-product-like-mvp-there-all-of-the-products"
                >
                  <a className="text-gray-800 hover:underline">
                    When is the best to release the product on Product Hunt? I
                    have never seen the product like MVP there. All of the
                    products are high quality.
                  </a>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </li>
    </ul>
  );
};

export default PickedUpAnswer;
