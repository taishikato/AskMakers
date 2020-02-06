import React from 'react'
import Head from 'next/head'
import { useSelector, useDispatch } from 'react-redux'
import { loginUser as loginUserAction } from '../store/action'
import Layout from '../components/Layout'
import Input from '../components/Input'
import Upload from '../components/Upload'
import getBase64 from '../plugins/getBase64'
import uploadToStorage from '../plugins/uploadToStorage'
import { message } from 'antd'
import uuid from 'uuid/v4'
import firebase from '../plugins/firebase'
import 'firebase/firestore'

const db = firebase.firestore()

const Settings = () => {
  const loginUser = useSelector(state => state.loginUser)
  const dispatch = useDispatch()

  const [tagline, setTagline] = React.useState('')
  const [twitter, setTwitter] = React.useState('')
  const [producthunt, setProducthunt] = React.useState('')
  const [github, setGithub] = React.useState('')
  const [patreon, setPatreon] = React.useState('')
  const [imageUrl, setImageUrl] = React.useState('')
  const [isSaving, setIsSaving] = React.useState(false)
  const [name, setName] = React.useState('')
  const [website, setWebsite] = React.useState('')
  const [isLoadingImage, setIsLoadingImage] = React.useState(false)

  React.useEffect(() => {
    console.log({loginUser})
    setName(loginUser.customName)
    if (loginUser.tagline !== undefined) {
      setTagline(loginUser.tagline)
    }
    if (loginUser.website !== undefined) {
      setWebsite(loginUser.website)
    }
    if (loginUser.social !== undefined && loginUser.social.twitter !== undefined) {
      setTwitter(loginUser.social.twitter)
    }
    if (loginUser.social !== undefined && loginUser.social.productHunt !== undefined) {
      setProducthunt(loginUser.social.productHunt)
    }
    if (loginUser.social !== undefined && loginUser.social.gitHub !== undefined) {
      setGithub(loginUser.social.gitHub)
    }
    if (loginUser.social !== undefined && loginUser.social.patreon !== undefined) {
      setPatreon(loginUser.social.patreon)
    }
  }, [loginUser])

  const handleSubmit = async e => {
    e.preventDefault()
    setIsSaving(true)
    try {
      const updateData: IUpdateData = {}

      if (name === '') {
        message.error('Please put your name')
        return
      }

      updateData.customName = name

      // Pictureのみここで設定
      if (loginUser.picture !== undefined) {
        updateData.picture = loginUser.picture
      }

      let pictureImage = ''
      if (imageUrl !== '') {
        const id = uuid().split('-').join('')
        pictureImage = await uploadToStorage(id, imageUrl, firebase)
        updateData.picture = pictureImage
      }
      updateData.tagline = tagline
      updateData.website = website
      updateData.social = {}
      updateData.social.twitter = twitter
      updateData.social.productHunt = producthunt
      updateData.social.gitHub = github
      updateData.social.patreon = patreon
      updateData.username = loginUser.username
      updateData.uid = loginUser.uid
      await db
        .collection('publicUsers')
        .doc(loginUser.uid)
        .update(updateData)
      message.success('Updated successfully')
      dispatch(loginUserAction(updateData))
    } catch (err) {
      console.log('err!!!')
      console.error(err)
      message.error('An error occured. Please try again.')
    } finally {
      setIsSaving(false)
    }
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
  const title = 'Settings | AskMakers - Ask experienced makers questions'

  return (
    <>
    <Head>
      <meta key="robots" name="robots" content="noindex" />
      <title key="title">{title}</title>
      <meta
        key="og:title"
        property="og:title"
        content={title}
      />
      <meta key="og:site_name" property="og:site_name" content={title} />
    </Head>
    <Layout>
      <div className="w-full md:w-9/12 lg:w-9/12 my-10 m-auto p-2">
        <h1 className="text-4xl font-bold mb-8">
          Settings
        </h1>
        <form onSubmit={handleSubmit}>
          <div className="flex flex-wrap justify-between -mx-3">
            <div className="w-full md:w-6/12 lg:w-6/12 px-3">
              <div className="mb-3">
                <Input label="Name" id="name" type="text" value={name} handleChange={e => setName(e.target.value)} />
              </div>
              <div className="mb-3">
                <Input label="Tagline" id="tagline" type="text" value={tagline} handleChange={e => setTagline(e.target.value)}/>
              </div>
              <div className="mb-3">
                <Input label="Website" placeholder="https://askmakers.co" id="website" type="url" value={website} handleChange={e => setWebsite(e.target.value)}/>
              </div>
              <div className="mb-3 md:mb-0 lg:mb-0">
                <Upload label="Profile Picture" imageUrl={imageUrl} handleChange={handleChangeImage} isLoading={isLoadingImage} />
              </div>
            </div>
            <div className="w-full md:w-6/12 lg:w-6/12 px-3">
              <div className="mb-3">
                <Input label="Twitter Handle" placeholder="jack" id="twitter" type="text" value={twitter} handleChange={e => setTwitter(e.target.value)} />
              </div>
              <div className="mb-3">
                <Input label="Product Hunt Handle" placeholder="rrhoover" id="producthunt" type="text" value={producthunt} handleChange={e => setProducthunt(e.target.value)} />
              </div>
              <div className="mb-3">
                <Input label="GitHub Handle" placeholder="defunkt" id="github" type="text" value={github} handleChange={e => setGithub(e.target.value)} />
              </div>
              <Input label="Patreon Handle" placeholder="jackconte" id="patreon" type="text" value={patreon} handleChange={e => setPatreon(e.target.value)} />
            </div>
          </div>
          <div className="px-2 md:px-0 lg:px-0">
            {isSaving ?
              <button
                disabled
                className="rounded px-6 py-3 bg-gray-500 text-white font-semibold mt-4 cursor-not-allowed focus:outline-none"
              >
                Submitting…
              </button>
              :
              <button
                type="submit"
                className="rounded px-6 py-3 bg-gray-900 text-white font-semibold mt-4 focus:outline-none"
              >
                Update
              </button>
            }
          </div>
        </form>
      </div>
    </Layout>
    </>
  )
}

interface IUpdateData {
  customName?: string
  picture?: string
  tagline?: string
  website?: string
  username?: string
  uid?: string
  social?: ISocial
}

interface ISocial {
  twitter?: string,
  productHunt?: string,
  gitHub?: string,
  patreon?: string
}

export default Settings
