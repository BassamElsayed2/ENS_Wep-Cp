"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { changePassword } from "../../../services/apiauth";

const ChangePasswordForm: React.FC = () => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const router = useRouter();

  const changePasswordMutation = useMutation({
    mutationFn: async ({
      current,
      newPass,
    }: {
      current: string;
      newPass: string;
    }) => {
      return await changePassword(current, newPass);
    },
    onSuccess: () => {
      setMessage({ type: "success", text: "✅ تم تحديث كلمة المرور بنجاح!" });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");

      // Redirect after 2 seconds
      setTimeout(() => {
        router.push("/dashboard/my-profile");
      }, 2000);
    },
    onError: (error: Error) => {
      setMessage({ type: "error", text: error.message });
    },
  });

  const handleChangePassword = async () => {
    setMessage(null);

    // Validation
    if (!currentPassword || !newPassword || !confirmPassword) {
      setMessage({ type: "error", text: "يرجى ملء جميع الحقول." });
      return;
    }

    if (newPassword.length < 6) {
      setMessage({
        type: "error",
        text: "كلمة المرور الجديدة يجب أن تكون 6 أحرف على الأقل.",
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      setMessage({ type: "error", text: "كلمة المرور الجديدة غير متطابقة." });
      return;
    }

    // Call API
    changePasswordMutation.mutate({
      current: currentPassword,
      newPass: newPassword,
    });
  };

  return (
    <>
      <form>
        <div className="sm:grid sm:grid-cols-2 sm:gap-[25px]">
          <div className="mb-[20px] sm:mb-0 relative" id="passwordHideShow">
            <label className="mb-[10px] text-black dark:text-white font-medium block">
              الرقم السري الحالي
            </label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="h-[55px] rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[17px] block w-full outline-0 transition-all placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-primary-500"
              id="password"
              placeholder="Type password"
            />
          </div>

          <div className="mb-[20px] sm:mb-0 relative" id="passwordHideShow2">
            <label className="mb-[10px] text-black dark:text-white font-medium block">
              الرقم السري الجديد
            </label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="h-[55px] rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[17px] block w-full outline-0 transition-all placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-primary-500"
              id="password2"
              placeholder="Type password"
            />
          </div>

          <div
            className="sm:col-span-2 mb-[20px] sm:mb-0 relative"
            id="passwordHideShow3"
          >
            <label className="mb-[10px] text-black dark:text-white font-medium block">
              تاكيد الرقم السري
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="h-[55px] rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[17px] block w-full outline-0 transition-all placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-primary-500"
              id="password3"
              placeholder="Type password"
            />
          </div>
        </div>

        {message && (
          <div
            className={`text-sm mt-4 p-3 rounded-md ${
              message.type === "success"
                ? "bg-green-100 text-green-700 border border-green-300"
                : "bg-red-100 text-red-700 border border-red-300"
            }`}
          >
            {message.text}
          </div>
        )}

        <div className="mt-[20px] md:mt-[25px]">
          <button
            type="button"
            onClick={handleChangePassword}
            disabled={changePasswordMutation.isPending}
            className="font-medium inline-block transition-all rounded-md md:text-md py-[10px] md:py-[12px] px-[20px] md:px-[22px] bg-primary-500 text-white hover:bg-primary-400 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span className="inline-block relative ltr:pl-[29px] rtl:pr-[29px]">
              <i className="material-symbols-outlined ltr:left-0 rtl:right-0 absolute top-1/2 -translate-y-1/2">
                {changePasswordMutation.isPending ? "sync" : "check"}
              </i>
              {changePasswordMutation.isPending ? "جاري التحديث..." : "تأكيد"}
            </span>
          </button>
        </div>
      </form>
    </>
  );
};

export default ChangePasswordForm;
