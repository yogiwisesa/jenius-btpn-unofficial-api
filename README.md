# [Jenius BTPN](https://www.jenius.com/en) - Unofficial REST API

### DO IT WITH YOUR OWN RISK!!!!

#### 1. Run
1. Development
`npm run dev`
2. Production
`npm run start`
#### 2. Endpoints
Before accessing the endpoints, you need to deploy this project on your own server.

1. Login

POST `{base-url}/jenius/login`

Body (JSON):
```
{
    "email": "your-email",
    "password": "your-password"
}
```

Response:
```
{
  "code": "ok",
  "message": null,
  "data": "OTP Sent"
}
```
2. OTP
POST `{base-url}/jenius/otp/your-otp`

Body: Empty
Response:
```
{
  "code": "ok",
  "message": null,
  "data": "Auth success!"
}
```
3. Get Transaction
GET `{base-url}/jenius/transaction`
4. Get Save It
GET `{base-url}/jenius/save-it`
5. Get Card Center
GET `{base-url}/jenius/card-center`

---
Ideas:
- Telegram bot to check transactions, saldo, etc.
- Auto sync transaction with [money lover](https://moneylover.me/).