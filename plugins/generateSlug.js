/* eslint-disable unicorn/escape-case,no-useless-escape */
import uuid from 'uuid/v4'
import firebase from '~/plugins/firebase'
// Use firestore
import 'firebase/firestore'
const firestore = firebase.firestore()

const generateSlug = async (aText) => {
  const text = aText.toLowerCase()
  // 数字アルファベット以外を消す
  const filterdText = text.replace(/[^a-zA-Z0-9]/g, ' ')
  let textArray = filterdText.split(/\s|\n\t/g)
  textArray = textArray.filter((text) => {
    return text !== ''
  })
  const slug = textArray.join('-')
  const questionData = await firestore
    .collection('questions')
    .where('slug', '==', slug)
    .get()
  if (questionData.size === 0) {
    return slug
  }

  // すでに同一slugが存在した場合
  return `${slug}-${uuid().split('-')[0]}`
}

export default generateSlug
