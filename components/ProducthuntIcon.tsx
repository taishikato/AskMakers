import React from 'react'
import { NextPage } from 'next'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faProductHunt } from '@fortawesome/free-brands-svg-icons'

const ProducthuntIcon: NextPage<Props> = props => {
  const { name } = props
  return (
    <a
      href={`https://www.producthunt.com/@${name}`}
      target="_blank"
      className="twitter-icon-sns rounded-full w-10 h-10 block text-white"
    >
      <FontAwesomeIcon icon={faProductHunt} size="xs" className="w-6 h-6" />
      <style jsx>{`
      .twitter-icon-sns {
        background-color: #DA552F;
        padding: 8px;
      }
      `}</style>
    </a>
  )
}

interface Props {
  name: string
}

export default ProducthuntIcon
