import { ReactNode } from 'react'
import { NextPage } from 'next'
import Link from 'next/link'

const SideUser: NextPage<Props> = props => {
  const { name, username, picture, classes, intro } = props
  return(
    <div className={classes}>
      <div className="flex flex-wrap">
        <Link href="/[username]" as={`/${username}`}>
          <a>
            <img src={picture} className="w-10 h-10 rounded-full" alt={name} />
          </a>
        </Link>
        <div className="ml-3">
          <Link href="/[username]" as={`/${username}`}>
            <a>
              <span className="hover:underline font-semibold hover:no-underline">
                {name}
              </span>
            </a>
          </Link>
          <div className="text-sm text-gray-700">
            {intro}
          </div>
        </div>
      </div>
    </div>
  )
}

interface Props {
  username: string
  picture: string
  name: string
  classes: string
  intro: ReactNode
}

export default SideUser
