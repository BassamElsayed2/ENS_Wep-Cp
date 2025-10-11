"use client";

import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react";
import {
  getAppVersionPricings,
  createAppVersionPricing,
  updateAppVersionPricing,
  deleteAppVersionPricing,
  type AppVersionPricing,
  type CreateAppVersionPricingDto,
  type UpdateAppVersionPricingDto,
} from "../../../services/apiAppVersionPricings";
import { APP_VERSION_PAGES } from "../../config/appVersionPages";

const AppVersionPricingsManagement: React.FC = () => {
  const [pricings, setPricings] = useState<AppVersionPricing[]>([]);
  const [selectedPage, setSelectedPage] = useState<number>(1);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingPricing, setEditingPricing] =
    useState<AppVersionPricing | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    page_number: 1,
    title_ar: "",
    title_en: "",
    price: 0,
    items: [] as Array<{
      text_ar: string;
      text_en: string;
      display_order?: number;
    }>,
  });

  // Fetch pricings by page
  useEffect(() => {
    fetchPricings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedPage]);

  const fetchPricings = async () => {
    setIsLoading(true);
    try {
      const data = await getAppVersionPricings(selectedPage);
      setPricings(data);
    } catch (error: unknown) {
      toast.error("حدث خطأ أثناء تحميل أسعار الإصدارات البرمجية");
    } finally {
      setIsLoading(false);
    }
  };

  // Open modal for adding new pricing
  const handleOpenAddModal = () => {
    setEditingPricing(null);
    setFormData({
      page_number: selectedPage,
      title_ar: "",
      title_en: "",
      price: 0,
      items: [],
    });
    setShowModal(true);
  };

  // Open modal for editing pricing
  const handleOpenEditModal = (pricing: AppVersionPricing) => {
    setEditingPricing(pricing);
    setFormData({
      page_number: pricing.pageNumber,
      title_ar: pricing.titleAr,
      title_en: pricing.titleEn,
      price: pricing.price,
      items:
        pricing.items?.map((it) => ({
          text_ar: it.textAr,
          text_en: it.textEn,
          display_order: it.displayOrder,
        })) || [],
    });
    setShowModal(true);
  };

  // Handle form submission
  const handleSubmit = async () => {
    // Validation
    if (!formData.title_ar || !formData.title_en) {
      toast.error("الرجاء إدخال العنوان بالعربية والإنجليزية");
      return;
    }

    if (formData.price <= 0) {
      toast.error("الرجاء إدخال سعر صحيح");
      return;
    }

    try {
      if (editingPricing) {
        // Update existing pricing
        const updateData: UpdateAppVersionPricingDto = {
          page_number: formData.page_number,
          title_ar: formData.title_ar,
          title_en: formData.title_en,
          price: formData.price,
          items: formData.items,
        };

        const updatedPricing = await updateAppVersionPricing(
          editingPricing.id,
          updateData
        );
        setPricings(
          pricings.map((p) => (p.id === editingPricing.id ? updatedPricing : p))
        );
        toast.success("تم تحديث السعر بنجاح");
      } else {
        // Create new pricing
        const createData: CreateAppVersionPricingDto = {
          page_number: formData.page_number,
          title_ar: formData.title_ar,
          title_en: formData.title_en,
          price: formData.price,
          items: formData.items,
        };

        const newPricing = await createAppVersionPricing(createData);
        setPricings([...pricings, newPricing]);
        toast.success("تمت إضافة السعر بنجاح");
      }

      setShowModal(false);
      fetchPricings();
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "حدث خطأ أثناء حفظ السعر";
      toast.error(errorMessage);
    }
  };

  // Handle delete pricing
  const handleDelete = async (id: number) => {
    if (!confirm("هل أنت متأكد من حذف هذا السعر؟")) {
      return;
    }

    try {
      await deleteAppVersionPricing(id);
      setPricings(pricings.filter((p) => p.id !== id));
      toast.success("تم حذف السعر بنجاح");
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "حدث خطأ أثناء حذف السعر";
      toast.error(errorMessage);
    }
  };

  return (
    <>
      <div className="trezo-card bg-white dark:bg-[#0c1427] p-[20px] md:p-[25px] rounded-md">
        <div className="trezo-card-header mb-[20px] md:mb-[25px] flex items-center justify-between">
          <div className="trezo-card-title">
            <h5 className="!mb-0 text-xl font-bold text-black dark:text-white">
              إدارة أسعار الإصدارات البرمجية
            </h5>
          </div>
          <button
            onClick={handleOpenAddModal}
            className="inline-block py-[10px] px-[30px] bg-primary-500 text-white transition-all hover:bg-primary-600 rounded-md border border-primary-500 hover:border-primary-600"
          >
            إضافة سعر جديد
          </button>
        </div>

        {/* Page Selection */}
        <div className="trezo-card-content">
          <div className="mb-[20px] flex gap-[10px] flex-wrap">
            {APP_VERSION_PAGES.map((page) => (
              <button
                key={page.id}
                onClick={() => setSelectedPage(page.id)}
                className={`px-[20px] py-[12px] rounded-md transition-all border ${
                  selectedPage === page.id
                    ? "bg-primary-500 text-white border-primary-500"
                    : "bg-gray-100 dark:bg-[#15203c] text-gray-700 dark:text-gray-300 border-gray-200 dark:border-[#172036] hover:bg-primary-100 dark:hover:bg-[#1a2841]"
                }`}
              >
                <div className="font-semibold">{page.nameAr}</div>
                <div className="text-xs opacity-75">{page.nameEn}</div>
              </button>
            ))}
          </div>

          {/* Pricings Grid */}
          {isLoading ? (
            <div className="text-center py-12 text-gray-500 dark:text-gray-400">
              جاري التحميل...
            </div>
          ) : pricings.length === 0 ? (
            <div className="text-center py-12 text-gray-500 dark:text-gray-400">
              لا توجد أسعار في هذه الصفحة
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[20px] md:gap-[25px]">
              {pricings.map((pricing) => (
                <div
                  key={pricing.id}
                  className={`bg-white dark:bg-[#0c1427] rounded-md shadow-md overflow-hidden border-2 transition-all hover:shadow-lg border-gray-200 dark:border-[#172036]`}
                >
                  <div className="p-[20px] md:p-[25px]">
                    <h3 className="text-xl font-bold mb-[10px] text-black dark:text-white">
                      {pricing.titleAr}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-[10px]">
                      {pricing.titleEn}
                    </p>

                    <div className="mb-[20px] py-[15px] border-t border-b border-gray-200 dark:border-[#172036]">
                      <span className="text-3xl font-bold text-primary-500">
                        {pricing.price}
                      </span>
                    </div>
                    {pricing.items && pricing.items.length > 0 && (
                      <div className="mb-[15px]">
                        <p className="text-sm font-semibold mb-[10px] text-black dark:text-white">
                          المميزات:
                        </p>
                        <ul className="list-disc mr-5 text-sm text-gray-600 dark:text-gray-400">
                          {pricing.items.map((it) => (
                            <li key={it.id}>{it.textAr}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    <div className="flex gap-[10px]">
                      <button
                        onClick={() => handleOpenEditModal(pricing)}
                        className="flex-1 bg-warning-500 hover:bg-warning-600 text-white px-[15px] py-[10px] rounded-md text-sm transition-all"
                      >
                        تعديل
                      </button>
                      <button
                        onClick={() => handleDelete(pricing.id)}
                        className="flex-1 bg-danger-500 hover:bg-danger-600 text-white px-[15px] py-[10px] rounded-md text-sm transition-all"
                      >
                        حذف
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      <Dialog
        open={showModal}
        onClose={() => setShowModal(false)}
        className="relative z-50"
      >
        <DialogBackdrop
          transition
          className="fixed inset-0 bg-gray-500/75 transition-opacity data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in"
        />

        <div className="fixed inset-0 z-50 w-screen overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <DialogPanel
              transition
              className="relative transform overflow-hidden rounded-lg bg-white dark:bg-[#0c1427] text-left shadow-xl transition-all data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in sm:my-8 sm:w-full sm:max-w-3xl data-[closed]:sm:translate-y-0 data-[closed]:sm:scale-95"
            >
              <div className="trezo-card w-full bg-white dark:bg-[#0c1427] p-[20px] md:p-[25px] rounded-md max-h-[85vh] overflow-y-auto">
                <div className="trezo-card-header bg-gray-50 dark:bg-[#15203c] mb-[20px] md:mb-[25px] flex items-center justify-between -mx-[20px] md:-mx-[25px] -mt-[20px] md:-mt-[25px] p-[20px] md:p-[25px] rounded-t-md">
                  <div className="trezo-card-title">
                    <h5 className="!mb-0 text-xl font-bold text-black dark:text-white">
                      {editingPricing ? "تعديل السعر" : "إضافة سعر جديد"}
                    </h5>
                  </div>
                  <button
                    onClick={() => setShowModal(false)}
                    className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
                  >
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>

                <div className="trezo-card-content">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-[15px] md:gap-[20px]">
                    {/* Page Number */}
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium mb-2 text-black dark:text-white">
                        نوع التطبيق
                      </label>
                      <select
                        value={formData.page_number}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            page_number: parseInt(e.target.value),
                          })
                        }
                        className="w-full border border-gray-300 dark:border-[#172036] rounded-md px-[15px] py-[10px] bg-white dark:bg-[#0c1427] text-black dark:text-white focus:outline-none focus:border-primary-500"
                      >
                        {APP_VERSION_PAGES.map((page) => (
                          <option key={page.id} value={page.id}>
                            {page.nameAr} ({page.nameEn})
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Title Arabic */}
                    <div>
                      <label className="block text-sm font-medium mb-2 text-black dark:text-white">
                        العنوان (عربي) *
                      </label>
                      <input
                        type="text"
                        value={formData.title_ar}
                        onChange={(e) =>
                          setFormData({ ...formData, title_ar: e.target.value })
                        }
                        className="w-full border border-gray-300 dark:border-[#172036] rounded-md px-[15px] py-[10px] bg-white dark:bg-[#0c1427] text-black dark:text-white focus:outline-none focus:border-primary-500"
                        placeholder="أدخل العنوان بالعربية"
                      />
                    </div>

                    {/* Title English */}
                    <div>
                      <label className="block text-sm font-medium mb-2 text-black dark:text-white">
                        العنوان (إنجليزي) *
                      </label>
                      <input
                        type="text"
                        value={formData.title_en}
                        onChange={(e) =>
                          setFormData({ ...formData, title_en: e.target.value })
                        }
                        className="w-full border border-gray-300 dark:border-[#172036] rounded-md px-[15px] py-[10px] bg-white dark:bg-[#0c1427] text-black dark:text-white focus:outline-none focus:border-primary-500"
                        placeholder="Enter title in English"
                      />
                    </div>

                    {/* Price */}
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium mb-2 text-black dark:text-white">
                        السعر *
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        value={formData.price}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            price: parseFloat(e.target.value) || 0,
                          })
                        }
                        className="w-full border border-gray-300 dark:border-[#172036] rounded-md px-[15px] py-[10px] bg-white dark:bg-[#0c1427] text-black dark:text-white focus:outline-none focus:border-primary-500"
                      />
                    </div>

                    {/* Dynamic Features (price items) */}
                    <div className="md:col-span-2">
                      <div className="flex items-center justify-between mb-2">
                        <label className="block text-sm font-medium text-black dark:text-white">
                          المميزات (أضف ميزة)
                        </label>
                        <button
                          type="button"
                          onClick={() =>
                            setFormData({
                              ...formData,
                              items: [
                                ...formData.items,
                                { text_ar: "", text_en: "" },
                              ],
                            })
                          }
                          className="px-3 py-1 text-sm bg-primary-500 text-white rounded-md"
                        >
                          إضافة ميزة
                        </button>
                      </div>
                      {formData.items.length > 0 && (
                        <div className="space-y-3">
                          {formData.items.map((it, idx) => (
                            <div
                              key={idx}
                              className="grid grid-cols-1 md:grid-cols-2 gap-3"
                            >
                              <input
                                type="text"
                                placeholder="الميزة (عربي)"
                                value={it.text_ar}
                                onChange={(e) => {
                                  const next = [...formData.items];
                                  next[idx] = {
                                    ...next[idx],
                                    text_ar: e.target.value,
                                  };
                                  setFormData({ ...formData, items: next });
                                }}
                                className="w-full border border-gray-300 dark:border-[#172036] rounded-md px-[15px] py-[10px] bg-white dark:bg-[#0c1427] text-black dark:text-white focus:outline-none focus:border-primary-500"
                              />
                              <div className="flex gap-3">
                                <input
                                  type="text"
                                  placeholder="Feature (English)"
                                  value={it.text_en}
                                  onChange={(e) => {
                                    const next = [...formData.items];
                                    next[idx] = {
                                      ...next[idx],
                                      text_en: e.target.value,
                                    };
                                    setFormData({ ...formData, items: next });
                                  }}
                                  className="flex-1 border border-gray-300 dark:border-[#172036] rounded-md px-[15px] py-[10px] bg-white dark:bg-[#0c1427] text-black dark:text-white focus:outline-none focus:border-primary-500"
                                />
                                <button
                                  type="button"
                                  onClick={() => {
                                    const next = formData.items.filter(
                                      (_, i) => i !== idx
                                    );
                                    setFormData({ ...formData, items: next });
                                  }}
                                  className="px-3 py-2 text-sm bg-danger-500 hover:bg-danger-600 text-white rounded-md"
                                >
                                  حذف
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-[15px] mt-[25px] pt-[25px] border-t border-gray-200 dark:border-[#172036]">
                    <button
                      onClick={handleSubmit}
                      className="flex-1 inline-block py-[10px] px-[30px] bg-primary-500 text-white transition-all hover:bg-primary-600 rounded-md border border-primary-500 hover:border-primary-600"
                    >
                      {editingPricing ? "تحديث" : "إضافة"}
                    </button>
                    <button
                      onClick={() => setShowModal(false)}
                      className="flex-1 inline-block py-[10px] px-[30px] bg-gray-300 dark:bg-[#15203c] text-gray-700 dark:text-gray-300 transition-all hover:bg-gray-400 dark:hover:bg-[#1a2841] rounded-md border border-gray-300 dark:border-[#172036]"
                    >
                      إلغاء
                    </button>
                  </div>
                </div>
              </div>
            </DialogPanel>
          </div>
        </div>
      </Dialog>
    </>
  );
};

export default AppVersionPricingsManagement;
