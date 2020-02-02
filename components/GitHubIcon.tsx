import React from 'react'
import { NextPage } from 'next'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGithub } from '@fortawesome/free-brands-svg-icons'

const GitHubIcon: NextPage<Props> = props => {
  const { name } = props
  return (
    <a
      href={`https://github.com/${name}`}
      target="_blank"
      className="twitter-icon-sns rounded-full w-10 h-10 block text-white"
    >
      <FontAwesomeIcon icon={faGithub} size="xs" className="w-6 h-6" />
      <style jsx>{`
      .twitter-icon-sns {
        background-color: #000000;
        padding: 8px;
      }
      `}</style>
    </a>
  )
}

interface Props {
  name: string
}

export default GitHubIcon
