## sht5 Ticket Dispenser
Stupid Hackathon 5 Ticket Dispenser.

## Documentation
- [POST] /dispenser/:dispenser

Brief: Made a reservation for reserving a passcode which can take to reserve the ticket on EventPop.

### Path name
`:dispenser` is variable which 
- should match in Firebase Console under:
    - Collection: reserve
    - Document: <name>

### Body
Any request send to this endpoint should meet the requirement of:
- Header:
    - `Content-Type`: `application/json`
- Body:
    - key: `string`
        - Unique password which is set under document in Firestore.
        - To prevent somebody create a random request to endpoint.
        - If not match with the Database, the request will failed.
    - email: `string`
        - For reservation record in case of if the user accidentally refresh or something happend to error which lead the user to unable to see the ticket passcode.
        - The user can resubmit and form and re-gain the ticket passcode which can be proceed to reserve the ticket.
        - Also to prevent user to submit same email address to reserving multiple ticket in case of multiple request due to any error (eg. Race conditaion).
    - production: `boolean`
        - Optional, (Default: false)
        - For testing the API, when set to `true`, the reserve ticket won't be removed from Database.
        - However, the reservation is still continue to write.

### Return Type
Return type is `strong-typed` response which can be used in any strong-typed language if need.

- Header `application/json`
- Type:
    - success: `boolean`
        - Indicate if reservation is success.
    - info: `string`
        - If `success` is `true`
            - Information about the reservation.
        - If `success` is `false`
            - Error message, explaining why the request is failed.
    - ticket: `string` | `null`
        - If `success` is `true`
            - Ticket code.
            - Can't be duplicated by design.
        - If `success` is `false`
            - `null`

### Note
If something is not clear or you're looking for more explaination, feels free to message me.

![Enterprise dancing](https://tenor.com/bivHN.gif)
