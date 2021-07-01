import admin from 'firebase-admin'

const config = process.env.firebase_service_account

if (typeof config === 'undefined')
    throw new Error('firebase_service_account is required')

admin.initializeApp({
    credential: admin.credential.cert(JSON.parse(config))
})

export const firestore = admin.firestore()

export default admin
