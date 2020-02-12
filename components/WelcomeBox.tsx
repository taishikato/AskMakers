import React from 'react'
import { NextPage } from 'next'

const WelcomeBox: NextPage<Props> = props => {
  return (
    <div className={props.class}>
      <p className="font-bold">Welcome, new makers :)</p>
      <p>
        I have been working on AskMakers 2.0 for a couple of weeks.
      </p>
      <p>
        We welcome any and all feedback. Shoot me a note at taishi.k0903@gmail.com 👍
      </p>
    </div>
  )
}

interface Props {
  class: any
}

export default WelcomeBox