import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

admin.initializeApp();

export const updateDenormalizedProfileData = functions.firestore
  .document('users/{userID}')
  .onWrite((change, context) => {
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

