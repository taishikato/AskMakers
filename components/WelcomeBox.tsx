import React from 'react'
import { NextPage } from 'next'

const WelcomeBox: NextPage<Props> = props => {
  return (
    <div className={props.class}>
      <p className="font-bold">Welcome, new makers :)</p>
      <p>
        The Product Hunt team and I have been quietly working on YourStack. Now it's time to build in public. Welcome to the beta.
      </p>
      <p>
        We welcome any and all feedback. Shoot me a note here or at ryan@yourstack.com 😄
      </p>
    </div>
  )
}

interface Props {
  class: any
}

export default WelcomeBox