import React from 'react'
import { NextPage } from 'next'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTwitter } from '@fortawesome/free-brands-svg-icons'

const TwitterIcon: NextPage<Props> = props => {
  const { name } = props
  return (
    <a
      href={`https://twitter.com/${name}`}
      target="_blank"
      className="twitter-icon-sns rounded-full w-10 h-10 block text-white"
    >
      <FontAwesomeIcon icon={faTwitter} size="xs" className="w-6 h-6" />
      <style jsx>{`
      .twitter-icon-sns {
        background-color: #1DA1F2;
        padding: 8px;
      }
      `}</style>
    </a>
  )
}

interface Props {
  name: string
}

export default TwitterIcon
