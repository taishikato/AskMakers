import uuid from 'uuid/v4'

const generateSlug = (aText: string): string => {
  const text = aText.toLowerCase()
  // 数字アルファベット以外を消す
  const filterdText = text.replace(/[^a-zA-Z0-9]/g, ' ')
  let textArray = filterdText.split(/\s|\n\t/g)
  textArray = textArray.filter((text) => {
    return text !== ''
  })
  const slug = textArray.join('-')
  return `${slug}-${uuid().split('-')[0]}`
}

export default generateSlug