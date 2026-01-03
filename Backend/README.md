
---

# 📬 SMS & Email Scheduler Backend

This backend system provides **asynchronous scheduling and sending of SMS and email campaigns** using Node.js, MongoDB, Redis, and BullMQ. It supports merchant credit charging, scheduling campaigns, and reliable message dispatch with queue processing.

> ⚠️ **Important:**
> Email sending behavior differs between **local development** and **deployment (Railway)**.
> Please read the **Email Configuration** section carefully.

---

## 🗂 Project Structure

```
src/
├─ config/
│  ├─ database.js          # MongoDB connection setup
│  └─ reddis.js            # Redis connection setup
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
│  └─ smsQueues.js         # BullMQ queue & worker initialization
├─ routes/
│  ├─ billingRoutes.js
│  ├─ campaignRoute.js
│  ├─ merchantRoutes.js
│  ├─ shopperRoutes.js
│  └─ smsRoutes.js
├─ utils/
│  └─ smsSender.js         # Email sender (Resend / Nodemailer)
└─ index.js                # Express app entry point
.env
package.json
README.md
```

---

## 🚀 Features

* Schedule SMS / Email campaigns for immediate or future delivery
* Charge merchants per recipient credits before sending
* Reliable message processing using BullMQ backed by Redis
* Automatic retries and failure logging for jobs
* Email sending via **Resend (deployment)** and **Nodemailer (local)**
* MongoDB for campaign, merchant, and recipient management
* JWT-based authentication and authorization
* Lazy connection handling for MongoDB & Redis

---

## 🛠 Technologies Used

* **Node.js + Express**
* **MongoDB + Mongoose**
* **Redis + BullMQ**
* **Resend (Email API – production / Railway)**
* **Nodemailer (SMTP – local development only)**
* **dotenv**

---

## 📥 Setup & Installation

### 1️⃣ Clone repository

```bash
git clone https://github.com/Harsh-3006/datmanBackend.git
cd datmanBackend
```

### 2️⃣ Install dependencies

```bash
npm install
```

---

## ⚙️ Environment Variables

### 🔹 Local Development (Nodemailer – SMTP)

> ✅ Works locally
> ❌ Does NOT work on Railway (SMTP ports are blocked)

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

---

### 🔹 Deployment (Railway – Resend)

> ✅ Works on Railway
> ⚠️ Free tier can send emails **only to the logged-in email** unless a domain is verified

```env
PORT=3000
MONGOURI=your_mongodb_connection_string
REDIS_HOST=your_redis_host
REDIS_PORT=your_redis_port
REDIS_PASSWORD=your_redis_password
JWT_SECRET=your_jwt_secret_key

RESEND_API_KEY=re_xxxxxxxxxxxxxxxxx
```

---

## 📧 Email Sending Strategy (IMPORTANT)

### 🟢 Local Development

* Uses **Nodemailer + Gmail SMTP**
* Nodemailer code is present but **commented out by default**
* Developers can uncomment it to test emails locally

### 🟡 Deployment (Railway)

* Uses **Resend (HTTP-based email API)**
* SMTP is **blocked on Railway**, so Nodemailer will NOT work
* Free Resend accounts are limited to:

  * Sending emails **only to the logged-in email address**
* To send emails to multiple recipients in production:

  * A **custom domain must be verified** in Resend

This design keeps the project:

* ✅ Open source
* ✅ Free to develop locally
* ✅ Deployable on Railway
* ✅ Production-ready with minimal configuration

---

## 📡 How it Works

* API endpoints allow merchants to create campaigns with recipient lists
* Campaigns can be scheduled immediately or for later delivery
* Jobs are added to a BullMQ queue stored in Redis
* Workers consume jobs and send messages asynchronously
* Merchant accounts are charged credits per recipient
* Email sending is handled via:

  * **Nodemailer (local)**
  * **Resend (deployment)**

---

## ⚠️ Important Notes

* **SMTP (Nodemailer) does NOT work on Railway**
* Railway blocks outbound SMTP ports (25, 465, 587)
* Resend free tier is limited to test emails unless a domain is verified
* Redis eviction policy should be `noeviction` for BullMQ stability
* Avoid committing `.env` files

---

## 🔍 Troubleshooting & Tips

* If emails work locally but fail after deployment → expected behavior
* Check Resend dashboard to verify email delivery
* If queue jobs fail randomly, verify Redis eviction policy
* For production usage, verify a custom domain in Resend
* For open-source usage, users can plug in their own email provider keys

---

## 📚 Resources

* BullMQ — [https://docs.bullmq.io/](https://docs.bullmq.io/)
* Redis — [https://redis.io/](https://redis.io/)
* MongoDB — [https://www.mongodb.com/](https://www.mongodb.com/)
* Resend — [https://resend.com](https://resend.com)
* Nodemailer — [https://nodemailer.com/](https://nodemailer.com/)

---

## 👏 Contribution

This project is **open source and extensible**.

Contributors can:

* Use Nodemailer locally
* Use Resend or any email API in production
* Replace the email layer entirely if needed

Feel free to open issues or submit pull requests 🚀

---