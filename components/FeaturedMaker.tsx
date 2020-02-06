import React from 'react'
import { NextPage } from 'next'
import Link from 'next/link'
import  { Tag } from 'antd'

const FeaturedMaker: NextPage<Props> = props => {
  return (
    <div className={props.class}>
      <Tag color="#68d391" className="font-semibold">FEATURED MAKERS</Tag>
      <ul>
        <li className="my-3">
          <Link href="/[username]" as="/mijustin">
            <a className="flex flex-wrap items-center">
              <img src="https://pbs.twimg.com/profile_images/932726689485828097/n86GsuLG.jpg" className="w-8 h-8 rounded-full" />
              <span className="hover:underline ml-2">
                Justin Jackson
              </span>
            </a>
          </Link>
        </li>
        <li className="my-3">
          <Link href="/[username]" as="/1HaKr">
            <a className="flex flex-wrap items-center">
              <img src="https://pbs.twimg.com/profile_images/1150157842222989312/eZfA0Oki.jpg" className="w-8 h-8 rounded-full" />
              <span className="hover:underline ml-2">
                𝙷𝚊𝙺𝚛
              </span>
            </a>
          </Link>
        </li>
        <li className="my-3">
          <Link href="/[username]" as="/hyper_yolo">
            <a className="flex flex-wrap items-center">
              <img src="https://firebasestorage.googleapis.com/v0/b/ask-makers.appspot.com/o/users%2Fe4UAYSdg99RXMzkk0yfsxqGJVzy2.jpg?alt=media&token=ad286fcf-9915-416b-a7ff-aec257382f4f" className="w-8 h-8 rounded-full" />
              <span className="hover:underline ml-2">
                Amie Chen
              </span>
            </a>
          </Link>
        </li>
        <li className="my-3">
          <Link href="/[username]" as="/jonathanbull">
            <a className="flex flex-wrap items-center">
              <img src="https://pbs.twimg.com/profile_images/860439311879155713/szwSvKLt.jpg" className="w-8 h-8 rounded-full" />
              <span className="hover:underline ml-2">
                Jonathan Bull
              </span>
            </a>
          </Link>
        </li>
      </ul>
    </div>
  )
}

interface Props {
  class: any
}

export default FeaturedMaker
