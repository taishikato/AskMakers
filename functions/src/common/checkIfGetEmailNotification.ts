export default async (
  uid: string,
  settingName: string,
  db: FirebaseFirestore.Firestore
) => {
  const settingSnapShot = await db
    .collection('publicUsers')
    .doc(uid)
    .collection('settings')
    .doc('notifications')
    .get();
  if (!settingSnapShot.exists) return true;
  const settings = settingSnapShot.data();
  if (settings![settingName] === undefined) return true;
  return settings![settingName] === true;
};
