"use client";

import { useUsers } from "@/hooks/useUsers";
import { useDeleteUser } from "@/hooks/useDeleteUser";

export default function UsersTable() {
  const { users, isPending, isError, error } = useUsers();
  const { removeUser, isPending: isDeleting } = useDeleteUser();

  if (isPending) {
    return (
      <div className="flex items-center justify-center py-10">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-md">
        <p className="text-red-600 dark:text-red-400">
          خطأ في تحميل البيانات: {error?.message}
        </p>
      </div>
    );
  }

  if (!users || users.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-gray-500 dark:text-gray-400">
          لا يوجد مستخدمين حالياً
        </p>
      </div>
    );
  }

  const handleDelete = (id: string) => {
    if (window.confirm("هل أنت متأكد من حذف هذا المستخدم؟")) {
      removeUser(id);
    }
  };

  return (
    <div className="trezo-card bg-white dark:bg-[#0c1427] rounded-md p-[20px] md:p-[25px]">
      <div className="trezo-card-header mb-[20px] md:mb-[25px]">
        <h5 className="!mb-0">قائمة المستخدمين</h5>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200 dark:border-[#172036]">
              <th className="text-right pb-3 text-sm font-medium text-gray-600 dark:text-gray-400">
                الاسم الكامل
              </th>
              <th className="text-right pb-3 text-sm font-medium text-gray-600 dark:text-gray-400">
                البريد الإلكتروني
              </th>
              <th className="text-right pb-3 text-sm font-medium text-gray-600 dark:text-gray-400">
                رقم الهاتف
              </th>
              <th className="text-right pb-3 text-sm font-medium text-gray-600 dark:text-gray-400">
                الوظيفة
              </th>
              <th className="text-right pb-3 text-sm font-medium text-gray-600 dark:text-gray-400">
                الإجراءات
              </th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr
                key={user.id}
                className="border-b border-gray-100 dark:border-[#172036] hover:bg-gray-50 dark:hover:bg-[#0a0e19] transition-colors"
              >
                <td className="py-4 text-black dark:text-white">
                  {user.full_name}
                </td>
                <td className="py-4 text-gray-600 dark:text-gray-400">
                  {user.email}
                </td>
                <td className="py-4 text-gray-600 dark:text-gray-400">
                  {user.phone}
                </td>
                <td className="py-4 text-gray-600 dark:text-gray-400">
                  {user.job_title || "-"}
                </td>
                <td className="py-4">
                  <div className="flex gap-2">
                    <button
                      className="text-primary-500 hover:text-primary-600 transition-colors"
                      title="تعديل"
                    >
                      <i className="ri-edit-line text-lg"></i>
                    </button>
                    <button
                      onClick={() => handleDelete(user.id!)}
                      disabled={isDeleting}
                      className="text-red-500 hover:text-red-600 transition-colors disabled:opacity-50"
                      title="حذف"
                    >
                      <i className="ri-delete-bin-line text-lg"></i>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
