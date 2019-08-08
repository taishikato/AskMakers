/* eslint-disable prefer-promise-reject-errors */
/* eslint-disable handle-callback-err */
/**
 * documentにデータを保存する
 * @param {*} doc Firestoreのdocument ref
 * @param {Object} data 保存データ
 */

export default (doc, data) => {
  return new Promise((resolve, reject) => {
    doc
      .set(data)
      .then((result) => {
        resolve(result)
      })
      .catch((err) => {
        reject(false)
      })
  })
}
