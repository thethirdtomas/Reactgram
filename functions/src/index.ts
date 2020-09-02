import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

admin.initializeApp();

export const updateDenormalizedProfileData = functions.firestore
  .document('users/{userID}')
  .onWrite((change) => {
    const dataBefore = change.before.data();
    const dataAfter = change.after.data();

    if (dataBefore && dataAfter) {
      if (dataBefore.name !== dataAfter.name || dataBefore.photoURL !== dataAfter.photoURL) {
        const postsQuery = admin.firestore().collection('posts').where('uid', '==', change.after.id);
        return postsQuery
          .get()
          .then(querySnapshot => {
            if (querySnapshot) {
              const promises: Promise<FirebaseFirestore.WriteResult>[] = [];
              querySnapshot.forEach(doc => {
                promises.push(doc.ref.update({
                  name: dataAfter.name,
                  profileURL: dataAfter.photoURL,
                }))

                return Promise.all(promises);
              });
            }
            return null;
          });
      }
    }
    return null;
  });

export const handleLikePost = functions.https.onCall((data, context) => {
  const uid = context.auth?.uid;

  if (uid) {
    const liked = data.liked;
    const postId = data.postId;
    const updateValue = admin.firestore.FieldValue.increment(liked ? 1 : -1)

    const postRef = admin.firestore().collection('posts').doc(postId);
    const likedUserRef = postRef.collection('likesList').doc(uid);

    const batch = admin.firestore().batch();
    batch.update(postRef, { likes: updateValue });
    liked ? batch.create(likedUserRef, {}) : batch.delete(likedUserRef);

    return batch.commit();
  }

  return null;
});