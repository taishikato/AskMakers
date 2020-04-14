import React from 'react'
import { NextPage } from 'next'
import { Tag } from 'antd'
import SideUser from './SideUser'

const FeaturedMaker: NextPage<Props> = (props) => {
  return (
    <div className={props.class}>
      <h2>
        <Tag color="#68d391" className="font-semibold">
          FEATURED MAKERS
        </Tag>
      </h2>
      <div>
        <SideUser
          classes="py-4 border-b border-gray-300"
          name="Justin Jackson"
          username="mijustin"
          picture="https://pbs.twimg.com/profile_images/932726689485828097/n86GsuLG.jpg"
          intro={
            <div>
              Maker of{' '}
              <a
                href="https://transistor.fm/"
                target="_blank"
                className="text-blue-500"
              >
                Transistor
              </a>
            </div>
          }
        />
        <SideUser
          classes="py-4 border-b border-gray-300"
          name="𝙷𝚊𝙺𝚛"
          username="1HaKr"
          picture="https://pbs.twimg.com/profile_images/1150157842222989312/eZfA0Oki.jpg"
          intro={
            <div>
              Maker of{' '}
              <a
                href="https://visalist.io/"
                target="_blank"
                className="text-blue-500"
              >
                Visa List
              </a>
            </div>
          }
        />
        <SideUser
          classes="py-4 border-b border-gray-300"
          name="Amie Chen"
          username="hyper_yolo"
          picture="https://firebasestorage.googleapis.com/v0/b/ask-makers.appspot.com/o/users%2Fe4UAYSdg99RXMzkk0yfsxqGJVzy2.jpg?alt=media&token=ad286fcf-9915-416b-a7ff-aec257382f4f"
          intro={
            <div>
              Maker of{' '}
              <a
                href="https://tryspider.com/"
                target="_blank"
                className="text-blue-500"
              >
                Spider Pro
              </a>
            </div>
          }
        />
        <SideUser
          classes="py-4 border-b border-gray-300"
          name="Jonathan Bull"
          username="jonathanbull"
          picture="https://pbs.twimg.com/profile_images/860439311879155713/szwSvKLt.jpg"
          intro={
            <div>
              Maker of{' '}
              <a
                href="https://emailoctopus.com/"
                target="_blank"
                className="text-blue-500"
              >
                EmailOctopus
              </a>
            </div>
          }
        />
        <SideUser
          classes="py-4 border-b border-gray-300"
          name="Jaime Tatsubana"
          username="jtatsubana"
          picture="https://pbs.twimg.com/profile_images/1207030389291663360/SXCrFkCv.jpg"
          intro={
            <div>
              Maker of{' '}
              <a
                href="https://footystats.org/"
                target="_blank"
                className="text-blue-500"
              >
                FootyStats
              </a>
            </div>
          }
        />
      </div>
    </div>
  )
}

interface Props {
  class: any
}

export default FeaturedMaker
