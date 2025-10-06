# دليل Backend API Endpoints المطلوبة

تم إعداد Frontend للعمل مع Backend API على `http://localhost:3000/api`

---

## 🔐 Authentication Endpoints

### 1. تسجيل الدخول (Login)

```
POST http://localhost:3000/api/auth/login
```

**Request Body** (JSON):

```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response** (JSON):

```json
{
  "user": {
    "id": "user-id",
    "email": "user@example.com",
    "full_name": "اسم المستخدم",
    "role": "admin"
  },
  "token": "jwt-token-here" // اختياري إذا كنت تستخدم JWT
}
```

**Cookies**:

- يجب أن يرسل الـ Backend cookie للـ session/token
- الـ Frontend يرسل `credentials: "include"` تلقائياً

---

### 2. تسجيل الخروج (Logout)

```
POST http://localhost:3000/api/auth/logout
```

**Headers**:

- يجب أن يحتوي على الـ session cookie

**Response**:

```json
{
  "message": "تم تسجيل الخروج بنجاح"
}
```

---

### 3. الحصول على المستخدم الحالي (Get Current User)

```
GET http://localhost:3000/api/auth/me
```

**Headers**:

- يجب أن يحتوي على الـ session cookie

**Response** (JSON):

```json
{
  "id": "user-id",
  "email": "user@example.com",
  "full_name": "اسم المستخدم",
  "role": "authenticated"
}
```

---

## 👥 Users Endpoints

### 1. جلب جميع المستخدمين (Get All Users)

```
GET http://localhost:3000/api/users
```

**Response** (JSON):

```json
[
  {
    "id": "1",
    "email": "user@example.com",
    "phone": "0123456789",
    "full_name": "اسم المستخدم",
    "job_title": "مطور",
    "address": "العنوان",
    "about": "نبذة عني",
    "profile_picture": "https://example.com/image.jpg",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  }
]
```

---

### 2. جلب مستخدم واحد (Get User By ID)

```
GET http://localhost:3000/api/users/:id
```

**Response** (JSON):

```json
{
  "id": "1",
  "email": "user@example.com",
  "phone": "0123456789",
  "full_name": "اسم المستخدم",
  "job_title": "مطور",
  "address": "العنوان",
  "about": "نبذة عني",
  "profile_picture": "https://example.com/image.jpg"
}
```

---

### 3. إنشاء مستخدم جديد (Create User / Sign Up)

```
POST http://localhost:3000/api/users
```

**Content-Type**: `multipart/form-data`

**Request Body** (FormData):

```javascript
{
  email: "user@example.com",          // مطلوب
  password: "password123",            // مطلوب
  phone: "0123456789",                // مطلوب
  full_name: "اسم المستخدم",         // مطلوب
  job_title: "مطور",                  // اختياري
  address: "العنوان",                 // اختياري
  about: "نبذة عني",                  // اختياري
  profile_picture: File               // اختياري (file upload)
}
```

**Response** (JSON):

```json
{
  "id": "new-user-id",
  "email": "user@example.com",
  "phone": "0123456789",
  "full_name": "اسم المستخدم",
  "message": "تم إنشاء المستخدم بنجاح"
}
```

**Status Codes**:

- `201 Created` - تم الإنشاء بنجاح
- `400 Bad Request` - بيانات غير صالحة
- `409 Conflict` - البريد الإلكتروني موجود مسبقاً

---

### 4. تحديث مستخدم (Update User)

```
PUT http://localhost:3000/api/users/:id
```

**Content-Type**: `multipart/form-data`

**Request Body** (FormData) - أي حقول تريد تحديثها:

```javascript
{
  full_name: "الاسم الجديد",
  job_title: "الوظيفة الجديدة",
  profile_picture: File  // اختياري
}
```

**Response** (JSON):

```json
{
  "id": "user-id",
  "email": "user@example.com",
  "full_name": "الاسم الجديد",
  "message": "تم التحديث بنجاح"
}
```

---

### 5. حذف مستخدم (Delete User)

```
DELETE http://localhost:3000/api/users/:id
```

**Response** (JSON):

```json
{
  "message": "تم حذف المستخدم بنجاح"
}
```

**Status Codes**:

- `200 OK` - تم الحذف بنجاح
- `404 Not Found` - المستخدم غير موجود

---

## 🔧 ملاحظات للـ Backend Developer

### 1. CORS Configuration

يجب تفعيل CORS للسماح للـ Frontend بالاتصال:

```javascript
// Example for Express.js
app.use(
  cors({
    origin: "http://localhost:3001", // عنوان الـ Frontend
    credentials: true,
  })
);
```

### 2. Cookie Configuration

إذا كنت تستخدم cookies للـ authentication:

```javascript
res.cookie("session", token, {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
  maxAge: 24 * 60 * 60 * 1000, // 24 hours
});
```

### 3. File Upload

استخدم middleware مثل `multer` للتعامل مع رفع الصور:

```javascript
const multer = require("multer");
const upload = multer({ dest: "uploads/" });

app.post("/api/users", upload.single("profile_picture"), createUser);
```

### 4. Validation

تأكد من التحقق من البيانات:

- البريد الإلكتروني صالح
- كلمة المرور 6 أحرف على الأقل
- رقم الهاتف 10 أرقام على الأقل

### 5. Error Responses

يجب أن تكون الأخطاء بهذا التنسيق:

```json
{
  "message": "رسالة الخطأ بالعربي",
  "error": "تفاصيل إضافية"
}
```

---

## 🧪 اختبار الـ API باستخدام cURL

### تسجيل مستخدم جديد:

```bash
curl -X POST http://localhost:3000/api/users \
  -F "email=test@example.com" \
  -F "password=password123" \
  -F "phone=0123456789" \
  -F "full_name=مستخدم تجريبي"
```

### تسجيل الدخول:

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}' \
  -c cookies.txt
```

### جلب جميع المستخدمين:

```bash
curl -X GET http://localhost:3000/api/users \
  -b cookies.txt
```

---

## 📝 قائمة التحقق للـ Backend

- [ ] `/api/auth/login` - تسجيل الدخول
- [ ] `/api/auth/logout` - تسجيل الخروج
- [ ] `/api/auth/me` - الحصول على المستخدم الحالي
- [ ] `GET /api/users` - جلب جميع المستخدمين
- [ ] `GET /api/users/:id` - جلب مستخدم واحد
- [ ] `POST /api/users` - إنشاء مستخدم (مع دعم multipart/form-data)
- [ ] `PUT /api/users/:id` - تحديث مستخدم
- [ ] `DELETE /api/users/:id` - حذف مستخدم
- [ ] CORS مفعّل مع `credentials: true`
- [ ] Cookie/Session management
- [ ] File upload support للصور
- [ ] Validation للبيانات
- [ ] Error handling بالعربي

---

تم! 🚀 الآن الـ Backend جاهز للعمل مع الـ Frontend.
