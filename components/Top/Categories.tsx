import React from 'react';
import Link from 'next/link';
import Card from '../Common/Card';

const categories = [
  {
    name: 'Idea',
    slug: 'idea',
  },
  {
    name: 'Build',
    slug: 'build',
  },
  {
    name: 'Launch',
    slug: 'launch',
  },
  {
    name: 'Grow',
    slug: 'grow',
  },
  {
    name: 'Monetize',
    slug: 'monetize',
  },
  {
    name: 'Automate',
    slug: 'automate',
  },
  {
    name: 'Exit',
    slug: 'exit',
  },
];

const Categories = () => {
  return (
    <>
      <Card header="Categories">
        <ul>
          {categories.map((category) => (
            <li>
              <Link
                href="/categories/[slug]"
                as={`/categories/${category.slug}`}
              >
                <a
                  className={`${category.slug} text-gray-800 block px-2 py-1 rounded hover:text-white`}
                >
                  {category.name}
                </a>
              </Link>
            </li>
          ))}
        </ul>
      </Card>
      <style jsx>{`
        .idea:hover {
          background: #a0d911;
        }
        .grow:hover {
          background: #52c41a;
        }
        .launch:hover {
          background: #fa541c;
        }
        .build:hover {
          background: #2f54eb;
        }
        .monetize:hover {
          background: #faad14;
        }
        .automate:hover {
          background: #fa8c16;
        }
        .exit:hover {
          background: #722ed1;
        }
      `}</style>
    </>
  );
};

export default Categories;
