"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import toast from "react-hot-toast";
import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react";
import {
  createDesignService,
  deleteDesignService,
  DesignService,
  getDesignServices,
  updateDesignService,
  UpdateDesignServiceDto,
  CreateDesignServiceDto,
} from "../../../services/apiDesignServices";
import { DESIGN_SERVICE_PAGES } from "../../config/designServicePages";

const DesignServicesManagement: React.FC = () => {
  const [services, setServices] = useState<DesignService[]>([]);
  const [selectedPage, setSelectedPage] = useState<number>(1);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingService, setEditingService] = useState<DesignService | null>(
    null
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  const [formData, setFormData] = useState({
    page_number: 1,
    title_ar: "",
    title_en: "",
    description_ar: "",
    description_en: "",
  });
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");

  useEffect(() => {
    fetchServices();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedPage]);

  const filteredServices = services.filter(
    (s) =>
      s.titleAr.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.titleEn.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (s.descriptionAr &&
        s.descriptionAr.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (s.descriptionEn &&
        s.descriptionEn.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredServices.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(filteredServices.length / itemsPerPage);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const fetchServices = async () => {
    setIsLoading(true);
    try {
      const data = await getDesignServices(selectedPage);
      setServices(data);
    } catch (error: unknown) {
      toast.error("حدث خطأ أثناء تحميل خدمات التصميم");
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleOpenAddModal = () => {
    setEditingService(null);
    setFormData({
      page_number: selectedPage,
      title_ar: "",
      title_en: "",
      description_ar: "",
      description_en: "",
    });
    setSelectedImage(null);
    setImagePreview("");
    setShowModal(true);
  };

  const handleOpenEditModal = (service: DesignService) => {
    setEditingService(service);
    setFormData({
      page_number: service.pageNumber,
      title_ar: service.titleAr,
      title_en: service.titleEn,
      description_ar: service.descriptionAr || "",
      description_en: service.descriptionEn || "",
    });
    setSelectedImage(null);
    setImagePreview(service.img);
    setShowModal(true);
  };

  const handleSubmit = async () => {
    if (!formData.title_ar || !formData.title_en) {
      toast.error("الرجاء إدخال العنوان بالعربية والإنجليزية");
      return;
    }
    if (!editingService && !selectedImage) {
      toast.error("الرجاء اختيار صورة للخدمة");
      return;
    }

    const loadingToast = toast.loading(
      editingService ? "جاري تحديث خدمة التصميم..." : "جاري إضافة خدمة تصميم..."
    );
    try {
      if (editingService) {
        const updateData: UpdateDesignServiceDto = {
          page_number: formData.page_number,
          title_ar: formData.title_ar,
          title_en: formData.title_en,
          description_ar: formData.description_ar,
          description_en: formData.description_en,
        };
        if (selectedImage) updateData.image = selectedImage;
        const updated = await updateDesignService(
          editingService.id,
          updateData
        );
        setServices(
          services.map((s) => (s.id === editingService.id ? updated : s))
        );
        toast.dismiss(loadingToast);
        toast.success("تم تحديث خدمة التصميم بنجاح");
      } else {
        const payload: CreateDesignServiceDto = {
          page_number: formData.page_number,
          title_ar: formData.title_ar,
          title_en: formData.title_en,
          description_ar: formData.description_ar,
          description_en: formData.description_en,
          image: selectedImage!,
        };
        const created = await createDesignService(payload);
        setServices([...services, created]);
        toast.dismiss(loadingToast);
        toast.success("تمت إضافة خدمة التصميم بنجاح");
      }
      setShowModal(false);
      fetchServices();
    } catch (error: unknown) {
      toast.dismiss(loadingToast);
      const msg =
        error instanceof Error ? error.message : "حدث خطأ أثناء حفظ خدمة التصميم";
      toast.error(msg);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("هل أنت متأكد من حذف هذه الخدمة؟")) return;
    try {
      await deleteDesignService(id);
      setServices(services.filter((s) => s.id !== id));
      toast.success("تم حذف خدمة التصميم بنجاح");
    } catch (error: unknown) {
      const msg =
        error instanceof Error ? error.message : "حدث خطأ أثناء حذف خدمة التصميم";
      toast.error(msg);
    }
  };

  return (
    <>
      <div className="trezo-card bg-white dark:bg-[#0c1427] mb-[25px] p-[20px] md:p-[25px] rounded-md">
        <div className="trezo-card-header mb-[20px] md:mb-[25px] flex flex-wrap items-center justify-between">
          <div className="trezo-card-title">
            <h5 className="!mb-0 text-black dark:text-white font-bold text-lg">
              إدارة خدمات التصميم
            </h5>
          </div>
          <div className="trezo-card-subtitle mt-[15px] sm:mt-0">
            <button
              onClick={handleOpenAddModal}
              className="inline-block transition-all rounded-md font-medium px-[13px] py-[6px] text-white bg-primary-500 border border-primary-500 hover:bg-primary-600 hover:border-primary-600"
            >
              <span className="inline-block relative ltr:pl-[22px] rtl:pr-[22px] text-white">
                <i className="material-symbols-outlined !text-[22px] absolute ltr:-left-[4px] rtl:-right-[4px] top-1/2 -translate-y-1/2">
                  add
                </i>
                إضافة خدمة تصميم
              </span>
            </button>
          </div>
        </div>

        <div className="trezo-card-content">
          <div className="mb-[20px] flex gap-[10px] flex-wrap">
            {DESIGN_SERVICE_PAGES.map((page) => (
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
              </button>
            ))}
          </div>

          <div className="mb-[20px]">
            <div className="relative">
              <input
                type="text"
                placeholder="البحث في خدمات التصميم..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="w-full ltr:pl-[40px] rtl:pr-[40px] ltr:pr-[15px] rtl:pl-[15px] py-[10px] border border-gray-200 dark:border-[#172036] rounded-md dark:bg-[#15203c] dark:text-white focus:outline-none focus:border-primary-500"
              />
              <i className="ri-search-line absolute ltr:left-[15px] rtl:right-[15px] top-1/2 -translate-y-1/2 text-gray-400"></i>
            </div>
          </div>

          {isLoading ? (
            <div className="text-center py-12 text-gray-500 dark:text-gray-400">
              جاري التحميل...
            </div>
          ) : filteredServices.length === 0 ? (
            <div className="text-center py-12 text-gray-500 dark:text-gray-400">
              {searchTerm
                ? "لا توجد خدمات تطابق البحث"
                : "لا توجد خدمات في هذه الصفحة"}
            </div>
          ) : (
            <div className="trezo-card-content -mx-[20px] md:-mx-[25px]">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 dark:bg-[#15203c]">
                    <tr>
                      <th className="px-[20px] py-[15px] text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        الصورة
                      </th>
                      <th className="px-[20px] py-[15px] text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        العنوان (عربي)
                      </th>
                      <th className="px-[20px] py-[15px] text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        العنوان (إنجليزي)
                      </th>
                      <th className="px-[20px] py-[15px] text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        الإجراءات
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-[#0c1427] divide-y divide-gray-200 dark:divide-[#172036]">
                    {currentItems.map((service) => (
                      <tr
                        key={service.id}
                        className="hover:bg-gray-50 dark:hover:bg-[#15203c]"
                      >
                        <td className="px-[20px] py-[15px] whitespace-nowrap">
                          <div className="relative h-12 w-12 bg-gray-100 dark:bg-[#15203c] rounded-md overflow-hidden">
                            <Image
                              src={service.img}
                              alt={service.titleEn}
                              fill
                              className="object-contain p-1"
                            />
                          </div>
                        </td>
                        <td className="px-[20px] py-[15px] whitespace-nowrap">
                          <div className="text-sm font-medium text-black dark:text-white">
                            {service.titleAr}
                          </div>
                        </td>
                        <td className="px-[20px] py-[15px] whitespace-nowrap">
                          <div className="text-sm text-gray-600 dark:text-gray-400">
                            {service.titleEn}
                          </div>
                        </td>
                        <td className="px-[20px] py-[15px] whitespace-nowrap text-sm font-medium">
                          <div className="flex gap-[5px]">
                            <button
                              onClick={() => handleOpenEditModal(service)}
                              className="text-warning-600 hover:text-warning-900 dark:text-warning-400 dark:hover:text-warning-300 p-1 rounded hover:bg-warning-50 dark:hover:bg-warning-900/20"
                              title="تعديل"
                            >
                              <i className="ri-edit-line text-lg"></i>
                            </button>
                            <button
                              onClick={() => handleDelete(service.id)}
                              className="text-danger-600 hover:text-danger-900 dark:text-danger-400 dark:hover:text-danger-300 p-1 rounded hover:bg-danger-50 dark:hover:bg-danger-900/20"
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

              {totalPages > 1 && (
                <div className="mt-[20px] px-[20px] py-[15px] border-t border-gray-200 dark:border-[#172036] flex items-center justify-between">
                  <div className="text-sm text-gray-700 dark:text-gray-300">
                    عرض {indexOfFirstItem + 1} إلى{" "}
                    {Math.min(indexOfLastItem, filteredServices.length)} من{" "}
                    {filteredServices.length} خدمة
                  </div>
                  <div className="flex gap-[5px]">
                    <button
                      onClick={() =>
                        setCurrentPage(Math.max(1, currentPage - 1))
                      }
                      disabled={currentPage === 1}
                      className="px-3 py-2 text-sm border border-gray-300 dark:border-[#172036] rounded-md bg-white dark:bg-[#0c1427] text-gray-700 dark:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-[#15203c]"
                    >
                      السابق
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                      (page) => (
                        <button
                          key={page}
                          onClick={() => setCurrentPage(page)}
                          className={`px-3 py-2 text-sm border rounded-md ${
                            currentPage === page
                              ? "bg-primary-500 text-white border-primary-500"
                              : "border-gray-300 dark:border-[#172036] bg-white dark:bg-[#0c1427] text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-[#15203c]"
                          }`}
                        >
                          {page}
                        </button>
                      )
                    )}
                    <button
                      onClick={() =>
                        setCurrentPage(Math.min(totalPages, currentPage + 1))
                      }
                      disabled={currentPage === totalPages}
                      className="px-3 py-2 text-sm border border-gray-300 dark:border-[#172036] rounded-md bg-white dark:bg-[#0c1427] text-gray-700 dark:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-[#15203c]"
                    >
                      التالي
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <Dialog
        open={showModal}
        onClose={() => setShowModal(false)}
        className="relative z-50"
      >
        <DialogBackdrop
          transition
          className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in"
        />
        <div className="fixed inset-0 z-50 w-screen overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
            <DialogPanel
              transition
              className="relative transform overflow-hidden rounded-xl bg-white dark:bg-[#0c1427] text-left shadow-2xl transition-all data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in w-full max-w-3xl data-[closed]:sm:translate-y-0 data-[closed]:sm:scale-95"
            >
              <div className="w-full max-h-[90vh] overflow-y-auto">
                <div className="bg-gradient-to-r from-primary-500 to-primary-600 px-[25px] py-[20px] flex items-center justify-between">
                  <div className="flex items-center gap-[15px]">
                    <div className="w-[40px] h-[40px] bg-white/20 rounded-lg flex items-center justify-center">
                      <i className="ri-paint-brush-line text-white text-xl"></i>
                    </div>
                    <div>
                      <h5 className="text-xl font-bold !text-white mb-0">
                        {editingService
                          ? "تعديل خدمة تصميم"
                          : "إضافة خدمة تصميم"}
                      </h5>
                      <p className="text-white/80 text-sm mt-1">
                        {editingService
                          ? "قم بتحديث معلومات خدمة التصميم"
                          : "أضف خدمة تصميم جديدة"}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowModal(false)}
                    className="w-[35px] h-[35px] bg-white/20 hover:bg-white/30 rounded-lg flex items-center justify-center text-white transition-all"
                  >
                    <i className="ri-close-line text-lg"></i>
                  </button>
                </div>

                <div className="p-[25px]">
                  <div className="space-y-[20px]">
                    <div>
                      <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">
                        صفحة خدمة التصميم
                      </label>
                      <select
                        value={formData.page_number}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            page_number: parseInt(e.target.value),
                          })
                        }
                        className="w-full border border-gray-300 dark:border-[#172036] rounded-lg px-[15px] py-[12px] bg-white dark:bg-[#0c1427] text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                      >
                        {DESIGN_SERVICE_PAGES.map((p) => (
                          <option key={p.id} value={p.id}>
                            {p.nameAr} ({p.nameEn})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-[20px]">
                      <div>
                        <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">
                          العنوان (عربي) *
                        </label>
                        <input
                          type="text"
                          value={formData.title_ar}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              title_ar: e.target.value,
                            })
                          }
                          className="w-full border border-gray-300 dark:border-[#172036] rounded-lg px-[15px] py-[12px] bg-white dark:bg-[#0c1427] text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                          placeholder="أدخل العنوان بالعربية"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">
                          العنوان (إنجليزي) *
                        </label>
                        <input
                          type="text"
                          value={formData.title_en}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              title_en: e.target.value,
                            })
                          }
                          className="w-full border border-gray-300 dark:border-[#172036] rounded-lg px-[15px] py-[12px] bg-white dark:bg-[#0c1427] text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                          placeholder="Enter title in English"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-[20px]">
                      <div>
                        <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">
                          الوصف (عربي)
                        </label>
                        <textarea
                          value={formData.description_ar}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              description_ar: e.target.value,
                            })
                          }
                          className="w-full border border-gray-300 dark:border-[#172036] rounded-lg px-[15px] py-[12px] bg-white dark:bg-[#0c1427] text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all resize-none"
                          rows={4}
                          placeholder="أدخل الوصف بالعربية"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">
                          الوصف (إنجليزي)
                        </label>
                        <textarea
                          value={formData.description_en}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              description_en: e.target.value,
                            })
                          }
                          className="w-full border border-gray-300 dark:border-[#172036] rounded-lg px-[15px] py-[12px] bg-white dark:bg-[#0c1427] text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all resize-none"
                          rows={4}
                          placeholder="Enter description in English"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">
                        صورة خدمة التصميم {!editingService && "*"}
                      </label>
                      <div className="border-2 border-dashed border-gray-300 dark:border-[#172036] rounded-lg p-[20px] text-center hover:border-primary-500 transition-colors">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageChange}
                          className="hidden"
                          id="ds-image-upload"
                        />
                        <label
                          htmlFor="ds-image-upload"
                          className="cursor-pointer flex flex-col items-center gap-[10px]"
                        >
                          <div className="w-[60px] h-[60px] bg-gray-100 dark:bg-[#15203c] rounded-lg flex items-center justify-center">
                            <i className="ri-image-add-line text-2xl text-gray-400"></i>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                              اضغط لاختيار صورة أو اسحب الصورة هنا
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                              PNG, JPG, GIF حتى 10MB
                            </p>
                          </div>
                        </label>
                      </div>
                      {imagePreview && (
                        <div className="mt-[15px] relative h-40 w-full bg-gray-100 dark:bg-[#15203c] rounded-lg overflow-hidden">
                          <Image
                            src={imagePreview}
                            alt="Preview"
                            fill
                            className="object-cover"
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-[15px] mt-[30px] pt-[25px] border-t border-gray-200 dark:border-[#172036]">
                    <button
                      onClick={handleSubmit}
                      className="flex-1 inline-flex items-center justify-center gap-[8px] py-[12px] px-[30px] bg-primary-500 text-white transition-all hover:bg-primary-600 rounded-lg font-medium shadow-sm hover:shadow-md"
                    >
                      <i className="ri-save-line text-lg"></i>
                      {editingService ? "تحديث الخدمة" : "إضافة الخدمة"}
                    </button>
                    <button
                      onClick={() => setShowModal(false)}
                      className="flex-1 inline-flex items-center justify-center gap-[8px] py-[12px] px-[30px] bg-gray-100 dark:bg-[#15203c] text-gray-700 dark:text-gray-300 transition-all hover:bg-gray-200 dark:hover:bg-[#1a2841] rounded-lg font-medium border border-gray-200 dark:border-[#172036]"
                    >
                      <i className="ri-close-line text-lg"></i>
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

export default DesignServicesManagement;
