# API Contract

## authRouter
POST - /signup
POST - /login
POST - /logout

## profileRouter
GET - /profile/view
PATCH - /profile/edit
PATCH - /profile/password

## connectionRequestRouter
POST - /request/send/ignore/:userId
POST - /request/send/interest/:userId
POST - /request/review/accept/:requestId
POST - /request/review/reject/:requestId

## userRouter
GET - /user/feed
GET - /user/connection
GET - /user/request