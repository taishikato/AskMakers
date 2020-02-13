import React from 'react'
import RenderRecentAnswers from '../components/RenderRecentAnswers'
import asyncForEach from '../plugins/asyncForEach'
import firebase from '../plugins/firebase'
import 'firebase/firestore'

const db = firebase.firestore()

const RecentAnswer = () => {
  const [answerData, setAnswerData] = React.useState<any>([])
  React.useEffect(() => {
    const getData = async () => {
      const answerDataSet = []
      const recentAnswers =
        await db.collection('answers').orderBy('created', 'desc').limit(3).get()
      await asyncForEach(recentAnswers.docs, async doc => {
        const answer = doc.data()
        const [userData, questionData] = await Promise.all([
          db.collection('publicUsers').doc(answer.answerUserId).get(),
          db.collection('questions').doc(answer.questionId).get()
        ])
        answerDataSet.push({
          answer,
          user: userData.data(),
          question: questionData.data()
        })
      })
      setAnswerData(answerDataSet)
    }
    getData()
  }, [])

  return (
    <div>
      <h3 className="font-medium text-gray-700 text-sm pb-4 border-b-2 border-gray-300">
        RECENT ANSWERS
      </h3>
      <div className="mt-3 mb-5">
        <RenderRecentAnswers answerData={answerData} />
      </div>
    </div>
  )
}

export default RecentAnswer
