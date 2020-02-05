import React from 'react'
import Link from 'next/link'

const SearchHit = props => {
  return (
    <div className="p-2 text-gray-800 hover:bg-gray-100">
      <Link href="/questions/[slug]" as={`/questions/${props.hit.slug}`}>
        <a className="block flex flex-wrap items-center">
          {/* <div className="w-3/12">
            <div className="search-img">
              <img src={props.hit.picture} alt={props.hit.picture} />
            </div>
          </div> */}
          <div className="w-full text-base">
            <div className="font-bold">{props.hit.text}</div>
            <div>{props.hit.body}</div>
          </div>
        </a>
      </Link>
      <style jsx>{`
        .search-img {
          height: 106px;
          line-height: 106px;
        }
        .search-img img {
          display: inline-block;
        }
      `}</style>
    </div>
  )
}

export default SearchHit
