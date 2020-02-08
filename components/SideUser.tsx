import { NextPage } from 'next'
import Link from 'next/link'

const SideUser: NextPage<Props> = props => {
  const { name, username, picture, classes } = props
  return(
    <div className={classes}>
      <Link href="/[username]" as={`/${username}`}>
        <a className="flex flex-wrap items-center">
          <img src={picture} className="w-10 h-10 rounded-full" alt={name} />
          <span className="hover:underline ml-3 font-semibold hover:no-underline">
            {name}
          </span>
        </a>
      </Link>
    </div>
  )
}

interface Props {
  username: string
  picture: string
  name: string
  classes: string
}

export default SideUser
