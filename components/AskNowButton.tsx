import Link from 'next/link'

const AskNowButton = () => {
  return (
    <Link href="/login">
      <a className="px-6 py-3 bg-green-500 rounded font-semibold">
        Ask Now
      </a>
    </Link>
  )
}

export default AskNowButton
