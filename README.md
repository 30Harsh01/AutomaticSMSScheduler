
---

# 📬 BulkSMSScheduler

**Hosted Link:** https://bulksmsscheduler.netlify.app/login

**BulkSMSScheduler** is a system to **schedule and send SMS & email campaigns** asynchronously.

* **Backend:** Node.js + Express + MongoDB + Redis + BullMQ
* **Frontend:** React (Vite) + Tailwind CSS

> ⚠️ **Important:** Email sending behaves differently in **local development** and **production (Railway)**. See **Email Configuration**.

---

## 🔹 Backend

### Project Structure

```
src/
├─ config/
│  ├─ database.js
│  └─ redis.js
├─ controllers/
│  ├─ billingController.js
│  ├─ campaignController.js
│  ├─ merchantController.js
│  ├─ shopperController.js
│  └─ smsRoutesController.js
├─ middleware/
│  └─ authMiddleware.js
├─ models/
│  ├─ billingSchema.js
│  ├─ campaignSchema.js
│  ├─ merchantSchema.js
│  └─ shopperSchema.js
├─ queue/
│  └─ smsQueues.js
├─ routes/
│  ├─ billingRoutes.js
│  ├─ campaignRoute.js
│  ├─ merchantRoutes.js
│  ├─ shopperRoutes.js
│  └─ smsRoutes.js
├─ utils/
│  └─ smsSender.js
└─ index.js
.env
package.json
README.md
```

---

### Features

* Schedule SMS/email campaigns (immediate or future)
* Charge merchants per recipient
* Queue-based reliable processing using **BullMQ + Redis**
* Retry and failure logging
* Email sending via **Nodemailer (local)** and **Resend (production)**
* JWT authentication & authorization
* MongoDB stores campaigns, merchants, and recipients

---

### Environment Variables

#### Local (Nodemailer)

```env
PORT=3000
MONGOURI=your_mongodb_connection_string
REDIS_HOST=your_redis_host
REDIS_PORT=your_redis_port
REDIS_PASSWORD=your_redis_password
JWT_SECRET=your_jwt_secret_key

MAIL=your_gmail_address
MAILPASS=your_gmail_app_password
```

> ✅ Works locally
> ❌ Does NOT work on Railway (SMTP ports blocked)

#### Deployment (Railway / Resend)

```env
PORT=3000
MONGOURI=your_mongodb_connection_string
REDIS_HOST=your_redis_host
REDIS_PORT=your_redis_port
REDIS_PASSWORD=your_redis_password
JWT_SECRET=your_jwt_secret_key

RESEND_API_KEY=re_xxxxxxxxxxxxxxxxx
```

> ✅ Works on Railway
> ⚠️ Free tier can send emails only to logged-in email unless domain is verified

---

### Email Sending Strategy

* **Local:** Nodemailer + Gmail SMTP (uncomment code in `smsSender.js`)
* **Production:** Resend API (SMTP blocked, free tier limited)

> To send emails to multiple recipients in production: verify a domain in Resend.

---

### Notes

* Redis eviction policy must be `noeviction` for BullMQ stability
* Avoid committing `.env` files
* Free Resend tier is limited; verify a domain for production

---

## 🔹 Frontend

### Project Structure

```
src/
├─ components/
├─ pages/
└─ main.jsx
public/
.env
package.json
```

---

### Features

* Connects to backend API
* Displays campaigns and recipient management
* Allows merchants to schedule SMS/email

---

### Environment Variables

Create a `.env` file:

```env
VITE_API_BASE_URL=http://localhost:3000
```

> Replace with deployed backend URL for production

---

### Run Frontend

```bash
npm install
npm run dev
```

Frontend runs at:

```
http://localhost:5173
```

---

### Deployment (Netlify)

1. Connect repository to Netlify
2. Add environment variable:

```
Key:   VITE_API_BASE_URL
Value: https://your-backend-domain
```

3. Redeploy site

---

### Resources

* BullMQ — [https://docs.bullmq.io/](https://docs.bullmq.io/)
* Redis — [https://redis.io/](https://redis.io/)
* MongoDB — [https://www.mongodb.com/](https://www.mongodb.com/)
* Resend — [https://resend.com](https://resend.com)
* Nodemailer — [https://nodemailer.com/](https://nodemailer.com/)

---

### Contribution

* Use Nodemailer locally
* Use Resend or any email API in production
* Replace the email layer entirely if needed

Open issues or submit pull requests 🚀

---
