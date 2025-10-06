"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import toast from "react-hot-toast";
import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react";
import {
  createService,
  deleteService,
  getServices,
  Service,
  updateService,
  UpdateServiceDto,
  CreateServiceDto,
} from "../../../services/apiServices";
import { SERVICE_PAGES } from "../../config/servicePages";

const ServicesManagement: React.FC = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [selectedPage, setSelectedPage] = useState<number>(1);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    page_number: 1,
    title_ar: "",
    title_en: "",
    description_ar: "",
    description_en: "",
    display_order: 0,
  });
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");

  // Fetch services by page
  useEffect(() => {
    fetchServices();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedPage]);

  const fetchServices = async () => {
    setIsLoading(true);
    try {
      const data = await getServices(selectedPage);
      setServices(data);
    } catch (error) {
      console.error("Error fetching services:", error);
      toast.error("حدث خطأ أثناء تحميل الخدمات");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle image file selection
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Open modal for adding new service
  const handleOpenAddModal = () => {
    setEditingService(null);
    setFormData({
      page_number: selectedPage,
      title_ar: "",
      title_en: "",
      description_ar: "",
      description_en: "",
      display_order: 0,
    });
    setSelectedImage(null);
    setImagePreview("");
    setShowModal(true);
  };

  // Open modal for editing service
  const handleOpenEditModal = (service: Service) => {
    setEditingService(service);
    setFormData({
      page_number: service.pageNumber,
      title_ar: service.titleAr,
      title_en: service.titleEn,
      description_ar: service.descriptionAr || "",
      description_en: service.descriptionEn || "",
      display_order: service.displayOrder,
    });
    setSelectedImage(null);
    setImagePreview(service.img);
    setShowModal(true);
  };

  // Handle form submission
  const handleSubmit = async () => {
    // Validation
    if (!formData.title_ar || !formData.title_en) {
      toast.error("الرجاء إدخال العنوان بالعربية والإنجليزية");
      return;
    }

    if (!editingService && !selectedImage) {
      toast.error("الرجاء اختيار صورة للخدمة");
      return;
    }

    // Show loading toast
    const loadingToast = toast.loading(
      editingService ? "جاري تحديث الخدمة..." : "جاري إضافة الخدمة..."
    );

    try {
      if (editingService) {
        // Update existing service
        const updateData: UpdateServiceDto = {
          page_number: formData.page_number,
          title_ar: formData.title_ar,
          title_en: formData.title_en,
          description_ar: formData.description_ar,
          description_en: formData.description_en,
          display_order: formData.display_order,
        };

        if (selectedImage) {
          updateData.image = selectedImage;
        }

        const updatedService = await updateService(
          editingService.id,
          updateData
        );
        setServices(
          services.map((s) => (s.id === editingService.id ? updatedService : s))
        );
        toast.dismiss(loadingToast);
        toast.success("تم تحديث الخدمة بنجاح");
      } else {
        // Create new service
        console.log("📝 Creating service with data:", {
          page_number: formData.page_number,
          title_ar: formData.title_ar,
          title_en: formData.title_en,
          image_name: selectedImage?.name,
          image_size: selectedImage?.size,
          image_type: selectedImage?.type,
        });

        const createData: CreateServiceDto = {
          page_number: formData.page_number,
          title_ar: formData.title_ar,
          title_en: formData.title_en,
          description_ar: formData.description_ar,
          description_en: formData.description_en,
          display_order: formData.display_order,
          image: selectedImage!,
        };

        const newService = await createService(createData);
        setServices([...services, newService]);
        toast.dismiss(loadingToast);
        toast.success("تمت إضافة الخدمة بنجاح");
      }

      setShowModal(false);
      fetchServices();
    } catch (error) {
      toast.dismiss(loadingToast);
      console.error("❌ Error saving service:", error);
      const errorMessage =
        error instanceof Error ? error.message : "حدث خطأ أثناء حفظ الخدمة";
      toast.error(errorMessage);
    }
  };

  // Handle delete service
  const handleDelete = async (id: number) => {
    if (!confirm("هل أنت متأكد من حذف هذه الخدمة؟")) {
      return;
    }

    try {
      await deleteService(id);
      setServices(services.filter((s) => s.id !== id));
      toast.success("تم حذف الخدمة بنجاح");
    } catch (error) {
      console.error("Error deleting service:", error);
      const errorMessage =
        error instanceof Error ? error.message : "حدث خطأ أثناء حذف الخدمة";
      toast.error(errorMessage);
    }
  };

  return (
    <>
      <div className="trezo-card bg-white dark:bg-[#0c1427] p-[20px] md:p-[25px] rounded-md">
        <div className="trezo-card-header mb-[20px] md:mb-[25px] flex items-center justify-between">
          <div className="trezo-card-title">
            <h5 className="!mb-0 text-xl font-bold text-black dark:text-white">
              إدارة الخدمات
            </h5>
          </div>
          <button
            onClick={handleOpenAddModal}
            className="inline-block py-[10px] px-[30px] bg-primary-500 text-white transition-all hover:bg-primary-600 rounded-md border border-primary-500 hover:border-primary-600"
          >
            إضافة خدمة جديدة
          </button>
        </div>

        {/* Page Selection */}
        <div className="trezo-card-content">
          <div className="mb-[20px] flex gap-[10px] flex-wrap">
            {SERVICE_PAGES.map((page) => (
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

          {/* Services Grid */}
          {isLoading ? (
            <div className="text-center py-12 text-gray-500 dark:text-gray-400">
              جاري التحميل...
            </div>
          ) : services.length === 0 ? (
            <div className="text-center py-12 text-gray-500 dark:text-gray-400">
              لا توجد خدمات في هذه الصفحة
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[20px] md:gap-[25px]">
              {services.map((service) => (
                <div
                  key={service.id}
                  className="bg-white dark:bg-[#0c1427] rounded-md shadow-md overflow-hidden border border-gray-200 dark:border-[#172036] transition-all hover:shadow-lg"
                >
                  <div className="relative h-48 w-full">
                    <Image
                      src={service.img}
                      alt={service.titleEn}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="p-[20px] md:p-[25px]">
                    <h3 className="text-lg font-semibold mb-[10px] text-black dark:text-white">
                      {service.titleAr}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-[10px]">
                      {service.titleEn}
                    </p>
                    {service.descriptionAr && (
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-[15px] line-clamp-2">
                        {service.descriptionAr}
                      </p>
                    )}
                    <div className="text-xs text-gray-400 mb-[15px]">
                      الترتيب: {service.displayOrder}
                    </div>
                    <div className="flex gap-[10px]">
                      <button
                        onClick={() => handleOpenEditModal(service)}
                        className="flex-1 bg-warning-500 hover:bg-warning-600 text-white px-[15px] py-[10px] rounded-md text-sm transition-all"
                      >
                        تعديل
                      </button>
                      <button
                        onClick={() => handleDelete(service.id)}
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
              className="relative transform overflow-hidden rounded-lg bg-white dark:bg-[#0c1427] text-left shadow-xl transition-all data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in sm:my-8 sm:w-full sm:max-w-2xl data-[closed]:sm:translate-y-0 data-[closed]:sm:scale-95"
            >
              <div className="trezo-card w-full bg-white dark:bg-[#0c1427] p-[20px] md:p-[25px] rounded-md max-h-[85vh] overflow-y-auto">
                <div className="trezo-card-header bg-gray-50 dark:bg-[#15203c] mb-[20px] md:mb-[25px] flex items-center justify-between -mx-[20px] md:-mx-[25px] -mt-[20px] md:-mt-[25px] p-[20px] md:p-[25px] rounded-t-md">
                  <div className="trezo-card-title">
                    <h5 className="!mb-0 text-xl font-bold text-black dark:text-white">
                      {editingService ? "تعديل الخدمة" : "إضافة خدمة جديدة"}
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
                  <div className="space-y-[15px] md:space-y-[20px]">
                    {/* Page Number */}
                    <div>
                      <label className="block text-sm font-medium mb-2 text-black dark:text-white">
                        صفحة الخدمة
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
                        {SERVICE_PAGES.map((page) => (
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

                    {/* Description Arabic */}
                    <div>
                      <label className="block text-sm font-medium mb-2 text-black dark:text-white">
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
                        className="w-full border border-gray-300 dark:border-[#172036] rounded-md px-[15px] py-[10px] bg-white dark:bg-[#0c1427] text-black dark:text-white focus:outline-none focus:border-primary-500"
                        rows={3}
                        placeholder="أدخل الوصف بالعربية"
                      />
                    </div>

                    {/* Description English */}
                    <div>
                      <label className="block text-sm font-medium mb-2 text-black dark:text-white">
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
                        className="w-full border border-gray-300 dark:border-[#172036] rounded-md px-[15px] py-[10px] bg-white dark:bg-[#0c1427] text-black dark:text-white focus:outline-none focus:border-primary-500"
                        rows={3}
                        placeholder="Enter description in English"
                      />
                    </div>

                    {/* Display Order */}
                    <div>
                      <label className="block text-sm font-medium mb-2 text-black dark:text-white">
                        ترتيب العرض
                      </label>
                      <input
                        type="number"
                        value={formData.display_order}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            display_order: parseInt(e.target.value) || 0,
                          })
                        }
                        className="w-full border border-gray-300 dark:border-[#172036] rounded-md px-[15px] py-[10px] bg-white dark:bg-[#0c1427] text-black dark:text-white focus:outline-none focus:border-primary-500"
                      />
                    </div>

                    {/* Image Upload */}
                    <div>
                      <label className="block text-sm font-medium mb-2 text-black dark:text-white">
                        صورة الخدمة {!editingService && "*"}
                      </label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="w-full border border-gray-300 dark:border-[#172036] rounded-md px-[15px] py-[10px] bg-white dark:bg-[#0c1427] text-black dark:text-white focus:outline-none focus:border-primary-500"
                      />
                      {imagePreview && (
                        <div className="mt-2 relative h-32 w-full">
                          <Image
                            src={imagePreview}
                            alt="Preview"
                            fill
                            className="object-contain"
                          />
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
                      {editingService ? "تحديث" : "إضافة"}
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

export default ServicesManagement;
