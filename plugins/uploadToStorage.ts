/**
 * Upload image to storage
 * @param id String image file name
 * @param imageUrl base64
 * @param firebase 
 */
const uploadToStorage = async (id: string, imageUrl: string, firebase) => {
  const storageRef = firebase.storage().ref()
  const uploadRef = storageRef.child(`users/${id}.png`)
  await uploadRef.putString(imageUrl, 'data_url')
  const url = await uploadRef.getDownloadURL()
  return url
}

export default uploadToStorage
