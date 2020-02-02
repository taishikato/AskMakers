import React from 'react'
import { NextPage } from 'next'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPatreon } from '@fortawesome/free-brands-svg-icons'

const PatreonIcon: NextPage<Props> = props => {
  const { name } = props
  return (
    <a
      href={`https://www.patreon.com/${name}`}
      target="_blank"
      className="twitter-icon-sns rounded-full w-10 h-10 block text-white"
    >
      <FontAwesomeIcon icon={faPatreon} size="xs" className="w-6 h-6" />
      <style jsx>{`
      .twitter-icon-sns {
        background-color: #f96854;
        padding: 8px;
      }
      `}</style>
    </a>
  )
}

interface Props {
  name: string
}

export default PatreonIcon
