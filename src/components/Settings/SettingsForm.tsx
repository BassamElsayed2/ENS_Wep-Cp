"use client";

import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import Image from "next/image";
import { zodResolver } from "@hookform/resolvers/zod";
import { profileSchema, ProfileFormData } from "@/lib/validations/auth";
import { useAdminProfile } from "@/components/MyProfile/useAdminProfile";
import { useUpdateUser } from "@/hooks/useUpdateUser";

const SettingsForm: React.FC = () => {
  const { data: profile, isLoading } = useAdminProfile();
  const { updateUserData, isPending } = useUpdateUser();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
  });

  const [profilePicture, setProfilePicture] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    if (profile) {
      reset({
        full_name: profile.full_name || "",
        email: profile.email || "",
        phone: profile.phone?.toString() || "",
        job_title: profile.job_title || "",
        address: profile.address || "",
        about: profile.about || "",
      });
      if (profile.image_url) {
        setPreviewUrl(profile.image_url);
      }
    }
  }, [profile, reset]);

  const handleProfilePictureChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setProfilePicture(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleRemoveProfilePicture = () => {
    setProfilePicture(null);
    setPreviewUrl(null);
  };

  const submit = (data: ProfileFormData) => {
    if (!profile?.user_id) {
      return;
    }

    updateUserData({
      id: profile.user_id,
      userData: {
        email: data.email,
        phone: data.phone,
        full_name: data.full_name,
        job_title: data.job_title,
        address: data.address,
        about: data.about,
        profile_picture: profilePicture || undefined,
      },
    });
  };

  if (isLoading) {
    return <div className="text-center py-10">جاري التحميل...</div>;
  }

  return (
    <>
      <form
        onSubmit={handleSubmit(submit)}
        className="trezo-card bg-white dark:bg-[#0c1427] mb-[25px] p-[20px] md:p-[25px] rounded-md"
      >
        <div className="trezo-card-header mb-[20px] md:mb-[25px]">
          <div className="trezo-card-title">
            <h5 className="!mb-0">معلومات الملف الشخصي</h5>
          </div>
        </div>

        <div className="trezo-card-content">
          <div className="sm:grid sm:grid-cols-2 sm:gap-[25px]">
            {/* Full Name */}
            <div className="mb-[20px] sm:mb-0">
              <label className="mb-[10px] block font-medium text-black dark:text-white">
                الاسم الكامل *
              </label>
              <input
                type="text"
                {...register("full_name")}
                className="h-[55px] rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[17px] block w-full outline-0 transition-all"
              />
              {errors.full_name && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.full_name.message}
                </p>
              )}
            </div>

            {/* Email */}
            <div className="mb-[20px] sm:mb-0">
              <label className="mb-[10px] block font-medium text-black dark:text-white">
                البريد الإلكتروني *
              </label>
              <input
                type="email"
                {...register("email")}
                className="h-[55px] rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[17px] block w-full outline-0 transition-all"
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Phone */}
            <div className="mb-[20px] sm:mb-0">
              <label className="mb-[10px] block font-medium text-black dark:text-white">
                رقم الهاتف
              </label>
              <input
                type="text"
                {...register("phone")}
                className="h-[55px] rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[17px] block w-full outline-0 transition-all"
              />
            </div>

            {/* Job Title */}
            <div className="mb-[20px] sm:mb-0">
              <label className="mb-[10px] block font-medium text-black dark:text-white">
                الوظيفة
              </label>
              <input
                type="text"
                {...register("job_title")}
                className="h-[55px] rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[17px] block w-full outline-0 transition-all"
              />
            </div>

            {/* Address */}
            <div className="sm:col-span-2 mb-[20px] sm:mb-0">
              <label className="mb-[10px] block font-medium text-black dark:text-white">
                العنوان
              </label>
              <input
                type="text"
                {...register("address")}
                className="h-[55px] rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[17px] block w-full outline-0 transition-all"
              />
            </div>

            {/* About */}
            <div className="sm:col-span-2 mb-[20px] sm:mb-0">
              <label className="mb-[10px] block font-medium text-black dark:text-white">
                عنك
              </label>
              <textarea
                {...register("about")}
                className="h-[140px] rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] p-[17px] block w-full outline-0 transition-all"
              ></textarea>
            </div>

            {/* Profile Picture */}
            <div className="sm:col-span-2 mb-[20px] sm:mb-0">
              <label className="mb-[10px] block font-medium text-black dark:text-white">
                صورة الملف الشخصي
              </label>
              <div className="relative flex items-center justify-center overflow-hidden rounded-md py-[88px] px-[20px] border border-gray-200 dark:border-[#172036]">
                <div className="flex items-center justify-center">
                  <div className="w-[35px] h-[35px] border border-gray-100 dark:border-[#15203c] flex items-center justify-center rounded-md text-primary-500 text-lg ltr:mr-[12px] rtl:ml-[12px]">
                    <i className="ri-upload-2-line"></i>
                  </div>
                  <p className="leading-[1.5]">
                    <strong className="text-black dark:text-white">
                      انقر للتحميل
                    </strong>
                    <br /> ملفك هنا
                  </p>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  className="absolute top-0 left-0 right-0 bottom-0 rounded-md z-[1] opacity-0 cursor-pointer"
                  onChange={handleProfilePictureChange}
                />
              </div>

              {previewUrl && (
                <div className="mt-[10px]">
                  <div className="relative w-[120px] h-[120px]">
                    <Image
                      src={previewUrl}
                      alt="profile-preview"
                      width={120}
                      height={120}
                      className="rounded-md object-cover"
                    />
                    <button
                      type="button"
                      className="absolute top-[-5px] right-[-5px] bg-orange-500 text-white w-[24px] h-[24px] flex items-center justify-center rounded-full text-xs rtl:right-auto rtl:left-[-5px]"
                      onClick={handleRemoveProfilePicture}
                    >
                      ✕
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="mt-[20px] sm:mt-[25px]">
            <button
              type="submit"
              disabled={isPending}
              className="font-medium inline-block transition-all rounded-md 2xl:text-md py-[10px] md:py-[12px] px-[20px] md:px-[22px] bg-primary-500 text-white hover:bg-primary-400 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isPending ? "جاري التحديث..." : "تحديث الملف الشخصي"}
            </button>
          </div>
        </div>
      </form>
    </>
  );
};

export default SettingsForm;
