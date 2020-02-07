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
      className="patreon-icon-sns rounded-full w-10 h-10 block text-white"
    >
      <FontAwesomeIcon icon={faPatreon} size="xs" className="w-6 h-6" />
    </a>
  )
}

interface Props {
  name: string
}

export default PatreonIcon
