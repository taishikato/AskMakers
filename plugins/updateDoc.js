/* eslint-disable prefer-promise-reject-errors */
/* eslint-disable handle-callback-err */
/**
 * Firestore更新メソッド
 * @param {Object} ref docオブジェクト
 * @param {Object} data 更新するキーとデータ
 */
export default (ref, data) => {
  return new Promise((resolve, reject) => {
    ref
      .update(data)
      .then((result) => {
        resolve(result)
      })
      .catch((err) => {
        reject(false)
      })
  })
}
