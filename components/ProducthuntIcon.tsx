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
      className="producthunt-icon-sns rounded-full w-10 h-10 block text-white"
    >
      <FontAwesomeIcon icon={faProductHunt} size="xs" className="w-6 h-6" />
    </a>
  )
}

interface Props {
  name: string
}

export default ProducthuntIcon
