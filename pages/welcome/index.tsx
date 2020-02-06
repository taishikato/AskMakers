import React from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { useSelector } from 'react-redux'
import Layout from '../../components/Layout'
import Input from '../../components/Input'
import Upload from '../../components/Upload'
import uploadToStorage from '../../plugins/uploadToStorage'
import uuid from 'uuid/v4'
import getBase64 from '../../plugins/getBase64'
import firebase from '../../plugins/firebase'
import 'firebase/firestore'

const db = firebase.firestore()

const Welcome = props => {
  const loginUser = useSelector(state => state.loginUser)
  const router = useRouter()

  const [name, setName] = React.useState('')
  const [tagline, setTagline] = React.useState('')
  const [website, setWebsite] = React.useState('')
  const [twitter, setTwitter] = React.useState('')
  const [producthunt, setProducthunt] = React.useState('')
  const [github, setGithub] = React.useState('')
  const [patreon, setPatreon] = React.useState('')
  const [isLoadingImage, setIsLoadingImage] = React.useState(false)
  const [imageUrl, setImageUrl] = React.useState('')
  const [isSaving, setIsSaving] = React.useState(false)

  const handleChangeName = e => setName(e.target.value)
  const handleChangeTagline = e => setTagline(e.target.value)
  const handleChangeWebsite = e => setWebsite(e.target.value)
  const handleChangeTwitter = e => setTwitter(e.target.value)
  const handleChangeProducthunt = e => setProducthunt(e.target.value)
  const handleChangeGithub = e => setGithub(e.target.value)
  const handleChangePatreon = e => setPatreon(e.target.value)

  React.useEffect(() => {
    setName(loginUser.customName)
    setTagline(loginUser.tagline)
    if (loginUser.social !== undefined && loginUser.social.twitter !== undefined) {
      setTwitter(loginUser.social.twitter)
    }
  }, [loginUser])

  const handleSubmit = async e => {
    e.preventDefault()
    setIsSaving(true)
    // try {
    //   const id = uuid().split('-').join('')
    //   const updateData: IUpdateData = {}
    //   let pictureImage = ''
    //   if (imageUrl !== '') {
    //     pictureImage = await uploadToStorage(id, imageUrl, firebase)
    //     updateData.picture = pictureImage
    //   }
    //   if (tagline !== '') {
    //     updateData.tagline = tagline
    //   }
    //   if (website !== '') {
    //     updateData.website = website
    //   }
    //   if (producthunt !== '') {
    //     updateData.social.productHunt = producthunt
    //   }
    //   if (github !== '') {
    //     updateData.social.gitHub = github
    //   }
    //   if (patreon !== '') {
    //     updateData.social.patreon = patreon
    //   }
    //   await db
    //     .collection('publicUsers')
    //     .doc(loginUser.uid)
    //     .update(updateData)
    // } catch (err) {
    //   console.log('err!!!')
    //   console.error(err)
    // } finally {
    //   setIsSaving(false)
    // }
    router.push('/welcome/thankyou')
    // setIsSaving(false)
  }

  const handleChangeImage = info => {
    if (info.file.status === 'uploading') {
      setIsLoadingImage(true)
      return
    }
    if (info.file.status === 'done') {
      // Get this url from response in real world.
      getBase64(info.file.originFileObj, imageUrl => {
        setImageUrl(imageUrl)
        setIsLoadingImage(false)
      })
    }
  }

  const title = 'Welcome | AskMakers - Ask experienced makers questions'
  const url = `https://askmakers.co${router.asPath}`

  return (
    <Layout>
      <Head>
        <meta key="robots" name="robots" content="noindex" />
        <title key="title">{title}</title>
        <meta
          key="og:title"
          property="og:title"
          content={title}
        />
        <meta key="og:site_name" property="og:site_name" content={title} />
        <meta key="og:url" property="og:url" content={url} />
        <link key="canonical" rel="canonical" href={url} />
      </Head>
      <div className="w-full md:w-9/12 lg:w-9/12 my-10 m-auto p-2">
        <h1 className="text-4xl font-bold">
          Welcome to AskMakers!
        </h1>
        <div className="mb-8">
          Please tell us about yourself! The AskMakers community can know you more.
        </div>
        <form onSubmit={handleSubmit}>
          <div className="flex flex-wrap justify-between -mx-3">
            <div className="w-full md:w-6/12 lg:w-6/12 px-3">
              <div className="mb-3">
                <Input label="Name" id="name" type="text" value={name} handleChange={handleChangeName} />
              </div>
              <div className="mb-3">
                <Input label="Tagline" id="tagline" type="text" value={tagline} handleChange={handleChangeTagline}/>
              </div>
              <div className="mb-3">
                <Input label="Website" placeholder="https://askmakers.co" id="website" type="url" value={website} handleChange={handleChangeWebsite}/>
              </div>
              <div className="mb-3 md:mb-0 lg:mb-0">
                <Upload label="Profile Picture" imageUrl={imageUrl} handleChange={handleChangeImage} isLoading={isLoadingImage} />
              </div>
            </div>
            <div className="w-full md:w-6/12 lg:w-6/12 px-3">
              <div className="mb-3">
                <Input label="Twitter Handle" placeholder="jack" id="twitter" type="text" value={twitter} handleChange={handleChangeTwitter} />
              </div>
              <div className="mb-3">
                <Input label="Product Hunt Handle" placeholder="rrhoover" id="producthunt" type="text" value={producthunt} handleChange={handleChangeProducthunt} />
              </div>
              <div className="mb-3">
                <Input label="GitHub Handle" placeholder="defunkt" id="github" type="text" value={github} handleChange={handleChangeGithub} />
              </div>
              <Input label="Patreon Handle" placeholder="jackconte" id="patreon" type="text" value={patreon} handleChange={handleChangePatreon} />
            </div>
          </div>
          <div className="px-2 md:px-0 lg:px-0">
            {isSaving ?
              <button
                disabled
                className="rounded px-6 py-3 bg-gray-900 text-white font-semibold mt-4 focus:outline-none"
              >
                Loading…
              </button>
              :
              <button
                type="submit"
                className="rounded px-6 py-3 bg-gray-900 text-white font-semibold mt-4 focus:outline-none"
              >
                Save
              </button>
            }
          </div>
        </form>
      </div>
    </Layout>
  )
}

interface IUpdateData {
  customName?: string,
  picture?: string,
  tagline?: string,
  website?: string,
  social?: ISocial
}

interface ISocial {
  twitter: string,
  productHunt?: string,
  gitHub?: string,
  patreon?: string
}

export default Welcome

