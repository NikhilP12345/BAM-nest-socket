import admin from 'firebase-admin';
const SDK =  require('./be-a-man-dev-firebase-adminsdk-gw3wd-7b6c81f21e');
admin.initializeApp({
    credential: admin.credential.cert(SDK.default),
    databaseURL: "https://be-a-man-dev-default-rtdb.firebaseio.com"
});

export default admin