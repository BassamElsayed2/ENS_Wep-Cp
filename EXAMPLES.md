# أمثلة عملية لاستخدام React Query مع Users API

## 1️⃣ عرض قائمة المستخدمين

```typescript
"use client";

import { useUsers } from "@/hooks/useUsers";

export default function UsersList() {
  const { users, isPending, isError, error } = useUsers();

  // حالة التحميل
  if (isPending) {
    return <div>جاري التحميل...</div>;
  }

  // حالة الخطأ
  if (isError) {
    return <div>خطأ: {error?.message}</div>;
  }

  // عرض البيانات
  return (
    <div>
      <h2>المستخدمين ({users?.length})</h2>
      <ul>
        {users?.map((user) => (
          <li key={user.id}>
            {user.full_name} - {user.email}
          </li>
        ))}
      </ul>
    </div>
  );
}
```

## 2️⃣ إنشاء مستخدم جديد مع Form

```typescript
"use client";

import { useCreateUser } from "@/hooks/useCreateUser";
import { useState } from "react";

export default function CreateUserForm() {
  const { createNewUser, isPending, isError, error } = useCreateUser();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    phone: "",
    full_name: "",
    job_title: "",
    address: "",
    about: "",
  });

  const [profilePicture, setProfilePicture] = useState<File | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    createNewUser({
      ...formData,
      profile_picture: profilePicture || undefined,
    });
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setProfilePicture(e.target.files[0]);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="email"
        name="email"
        placeholder="البريد الإلكتروني"
        value={formData.email}
        onChange={handleChange}
        required
      />

      <input
        type="password"
        name="password"
        placeholder="كلمة المرور"
        value={formData.password}
        onChange={handleChange}
        required
      />

      <input
        type="text"
        name="phone"
        placeholder="رقم الهاتف"
        value={formData.phone}
        onChange={handleChange}
        required
      />

      <input
        type="text"
        name="full_name"
        placeholder="الاسم الكامل"
        value={formData.full_name}
        onChange={handleChange}
        required
      />

      <input
        type="text"
        name="job_title"
        placeholder="الوظيفة"
        value={formData.job_title}
        onChange={handleChange}
      />

      <input
        type="text"
        name="address"
        placeholder="العنوان"
        value={formData.address}
        onChange={handleChange}
      />

      <textarea
        name="about"
        placeholder="نبذة عنك"
        value={formData.about}
        onChange={handleChange}
      />

      <input type="file" accept="image/*" onChange={handleFileChange} />

      {isError && <div className="text-red-500">خطأ: {error?.message}</div>}

      <button
        type="submit"
        disabled={isPending}
        className="bg-primary-500 text-white px-4 py-2 rounded disabled:opacity-50"
      >
        {isPending ? "جاري الإنشاء..." : "إنشاء مستخدم"}
      </button>
    </form>
  );
}
```

## 3️⃣ عرض تفاصيل مستخدم واحد

```typescript
"use client";

import { useUser } from "@/hooks/useUsers";
import { useParams } from "next/navigation";

export default function UserDetails() {
  const params = useParams();
  const userId = params.id as string;

  const { user, isPending, isError, error } = useUser(userId);

  if (isPending) {
    return <div>جاري تحميل بيانات المستخدم...</div>;
  }

  if (isError) {
    return <div>خطأ: {error?.message}</div>;
  }

  if (!user) {
    return <div>المستخدم غير موجود</div>;
  }

  return (
    <div className="space-y-4">
      <h1>{user.full_name}</h1>
      <p>البريد: {user.email}</p>
      <p>الهاتف: {user.phone}</p>
      {user.job_title && <p>الوظيفة: {user.job_title}</p>}
      {user.address && <p>العنوان: {user.address}</p>}
      {user.about && <p>نبذة: {user.about}</p>}
    </div>
  );
}
```

## 4️⃣ تحديث بيانات المستخدم

```typescript
"use client";

import { useUpdateUser } from "@/hooks/useUpdateUser";
import { useState } from "react";

export default function EditUserForm({
  userId,
  initialData,
}: {
  userId: string;
  initialData: any;
}) {
  const { updateUserData, isPending } = useUpdateUser();

  const [formData, setFormData] = useState({
    full_name: initialData.full_name,
    job_title: initialData.job_title || "",
    address: initialData.address || "",
    about: initialData.about || "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    updateUserData({
      id: userId,
      userData: formData,
    });
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="text"
        name="full_name"
        value={formData.full_name}
        onChange={handleChange}
      />

      <input
        type="text"
        name="job_title"
        value={formData.job_title}
        onChange={handleChange}
      />

      <input
        type="text"
        name="address"
        value={formData.address}
        onChange={handleChange}
      />

      <textarea name="about" value={formData.about} onChange={handleChange} />

      <button type="submit" disabled={isPending}>
        {isPending ? "جاري التحديث..." : "تحديث"}
      </button>
    </form>
  );
}
```

## 5️⃣ حذف مستخدم مع تأكيد

```typescript
"use client";

import { useDeleteUser } from "@/hooks/useDeleteUser";
import { useState } from "react";

export default function DeleteUserButton({
  userId,
  userName,
}: {
  userId: string;
  userName: string;
}) {
  const { removeUser, isPending } = useDeleteUser();
  const [showConfirm, setShowConfirm] = useState(false);

  const handleDelete = () => {
    removeUser(userId);
    setShowConfirm(false);
  };

  return (
    <>
      <button
        onClick={() => setShowConfirm(true)}
        className="text-red-500 hover:text-red-700"
      >
        حذف
      </button>

      {showConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg">
            <h3>تأكيد الحذف</h3>
            <p>هل تريد حذف المستخدم {userName}؟</p>

            <div className="flex gap-2 mt-4">
              <button
                onClick={handleDelete}
                disabled={isPending}
                className="bg-red-500 text-white px-4 py-2 rounded"
              >
                {isPending ? "جاري الحذف..." : "نعم، احذف"}
              </button>

              <button
                onClick={() => setShowConfirm(false)}
                className="bg-gray-300 px-4 py-2 rounded"
              >
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
```

## 6️⃣ جدول المستخدمين مع جميع العمليات

```typescript
"use client";

import { useUsers } from "@/hooks/useUsers";
import { useDeleteUser } from "@/hooks/useDeleteUser";
import Link from "next/link";

export default function UsersTable() {
  const { users, isPending, isError } = useUsers();
  const { removeUser, isPending: isDeleting } = useDeleteUser();

  const handleDelete = (userId: string) => {
    if (confirm("هل أنت متأكد من الحذف؟")) {
      removeUser(userId);
    }
  };

  if (isPending) return <div>جاري التحميل...</div>;
  if (isError) return <div>حدث خطأ</div>;

  return (
    <table className="w-full">
      <thead>
        <tr>
          <th>الاسم</th>
          <th>البريد</th>
          <th>الهاتف</th>
          <th>الوظيفة</th>
          <th>الإجراءات</th>
        </tr>
      </thead>
      <tbody>
        {users?.map((user) => (
          <tr key={user.id}>
            <td>{user.full_name}</td>
            <td>{user.email}</td>
            <td>{user.phone}</td>
            <td>{user.job_title || "-"}</td>
            <td>
              <Link href={`/dashboard/users/${user.id}`}>عرض</Link>
              <Link href={`/dashboard/users/${user.id}/edit`}>تعديل</Link>
              <button
                onClick={() => handleDelete(user.id!)}
                disabled={isDeleting}
              >
                حذف
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
```

## 7️⃣ استخدام مع React Hook Form

```typescript
"use client";

import { useCreateUser } from "@/hooks/useCreateUser";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const userSchema = z.object({
  email: z.string().email("بريد إلكتروني غير صالح"),
  password: z.string().min(6, "كلمة المرور يجب أن تكون 6 أحرف على الأقل"),
  phone: z.string().min(10, "رقم هاتف غير صالح"),
  full_name: z.string().min(2, "الاسم قصير جداً"),
  job_title: z.string().optional(),
  address: z.string().optional(),
  about: z.string().optional(),
});

type UserFormData = z.infer<typeof userSchema>;

export default function UserFormWithValidation() {
  const { createNewUser, isPending } = useCreateUser();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
  });

  const onSubmit = (data: UserFormData) => {
    createNewUser(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <input
          type="email"
          {...register("email")}
          placeholder="البريد الإلكتروني"
        />
        {errors.email && (
          <span className="text-red-500">{errors.email.message}</span>
        )}
      </div>

      <div>
        <input
          type="password"
          {...register("password")}
          placeholder="كلمة المرور"
        />
        {errors.password && (
          <span className="text-red-500">{errors.password.message}</span>
        )}
      </div>

      <div>
        <input type="text" {...register("phone")} placeholder="رقم الهاتف" />
        {errors.phone && (
          <span className="text-red-500">{errors.phone.message}</span>
        )}
      </div>

      <div>
        <input
          type="text"
          {...register("full_name")}
          placeholder="الاسم الكامل"
        />
        {errors.full_name && (
          <span className="text-red-500">{errors.full_name.message}</span>
        )}
      </div>

      <button type="submit" disabled={isPending}>
        {isPending ? "جاري الحفظ..." : "حفظ"}
      </button>
    </form>
  );
}
```

## 8️⃣ Infinite Scroll / Pagination (مثال متقدم)

```typescript
"use client";

import { useInfiniteQuery } from "@tanstack/react-query";

// هذا مثال للتطوير المستقبلي إذا احتجت pagination
async function getUsersPaginated({ pageParam = 1 }) {
  const response = await fetch(
    `http://localhost:3000/api/users?page=${pageParam}&limit=10`
  );
  return response.json();
}

export default function InfiniteUsersList() {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isPending } =
    useInfiniteQuery({
      queryKey: ["users", "infinite"],
      queryFn: getUsersPaginated,
      getNextPageParam: (lastPage, pages) => {
        return lastPage.hasMore ? pages.length + 1 : undefined;
      },
      initialPageParam: 1,
    });

  if (isPending) return <div>جاري التحميل...</div>;

  return (
    <div>
      {data?.pages.map((page, i) => (
        <div key={i}>
          {page.users.map((user: any) => (
            <div key={user.id}>{user.full_name}</div>
          ))}
        </div>
      ))}

      {hasNextPage && (
        <button onClick={() => fetchNextPage()} disabled={isFetchingNextPage}>
          {isFetchingNextPage ? "جاري التحميل..." : "تحميل المزيد"}
        </button>
      )}
    </div>
  );
}
```

---

## 💡 نصائح مهمة

1. **استخدم `isPending`** للتحقق من حالة التحميل
2. **استخدم `isError`** للتحقق من الأخطاء
3. **React Query تحدث الـ cache تلقائياً** بعد العمليات الناجحة
4. **جميع الـ Hooks تدعم TypeScript** بالكامل
5. **Toast notifications** تعمل تلقائياً عند النجاح أو الفشل
