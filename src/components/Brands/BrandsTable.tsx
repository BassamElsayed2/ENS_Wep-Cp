"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import toast from "react-hot-toast";

interface Brand {
  id: number;
  img: string;
  order?: number;
}

const BrandsTable: React.FC = () => {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingBrand, setEditingBrand] = useState<Brand | null>(null);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");

  // Fetch data from API
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await fetch("http://localhost:4010/api/brands");
        const data = await response.json();

        // Ensure data is an array
        if (Array.isArray(data)) {
          setBrands(data);
        } else if (data && data.data && Array.isArray(data.data)) {
          // In case API returns { success: true, data: [...] }
          setBrands(data.data);
        } else {
          setBrands([]);
          toast.error("تنسيق البيانات غير صحيح");
        }
      } catch (error: unknown) {
        setBrands([]); // Set empty array on error
        toast.error("حدث خطأ أثناء تحميل البيانات");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter items based on search term
  const filteredItems = brands.filter((item) =>
    item.img.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredItems.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);

  // Change page
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  // Handle search input
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
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

  // Handle add brand
  const handleAdd = async () => {
    if (!selectedImage) {
      toast.error("الرجاء اختيار صورة");
      return;
    }

    const formData = new FormData();
    formData.append("image", selectedImage);

    try {
      const response = await fetch("http://localhost:4010/api/brands", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        // Handle both direct brand object or { success: true, data: brand }
        const newBrand = result.data || result;
        setBrands([...brands, newBrand]);
        setShowAddModal(false);
        setSelectedImage(null);
        setImagePreview("");
        toast.success("تمت إضافة الشعار بنجاح");
      } else {
        const error = await response.json();
        toast.error(error.error || "حدث خطأ أثناء إضافة الشعار");
      }
    } catch (error: unknown) {
      toast.error("حدث خطأ أثناء إضافة الشعار");
    }
  };

  // Handle update brand
  const handleUpdate = async () => {
    if (!editingBrand) return;

    const formData = new FormData();
    if (selectedImage) {
      formData.append("image", selectedImage);
    }
    formData.append("order", String(editingBrand.order || 0));

    try {
      const response = await fetch(
        `http://localhost:4010/api/brands/${editingBrand.id}`,
        {
          method: "PUT",
          body: formData,
        }
      );

      if (response.ok) {
        const result = await response.json();
        // Handle both direct brand object or { success: true, data: brand }
        const updatedBrand = result.data || result;
        setBrands(
          brands.map((brand) =>
            brand.id === editingBrand.id ? updatedBrand : brand
          )
        );
        setShowEditModal(false);
        setEditingBrand(null);
        setSelectedImage(null);
        setImagePreview("");
        toast.success("تم تحديث الشعار بنجاح");
      } else {
        const error = await response.json();
        toast.error(error.error || "حدث خطأ أثناء تحديث الشعار");
      }
    } catch (error: unknown) {
      toast.error("حدث خطأ أثناء تحديث الشعار");
    }
  };

  // Handle delete brand
  const handleDelete = async (brand: Brand) => {
    if (window.confirm("هل أنت متأكد من حذف هذا الشعار؟")) {
      try {
        const response = await fetch(
          `http://localhost:4010/api/brands/${brand.id}`,
          {
            method: "DELETE",
          }
        );

        if (response.ok) {
          setBrands(brands.filter((b) => b.id !== brand.id));
          toast.success("تم حذف الشعار بنجاح");
        } else {
          toast.error("حدث خطأ أثناء حذف الشعار");
        }
      } catch (error: unknown) {
        toast.error("حدث خطأ أثناء حذف الشعار");
      }
    }
  };

  // Open edit modal
  const openEditModal = (brand: Brand) => {
    setEditingBrand(brand);
    setImagePreview(brand.img);
    setShowEditModal(true);
  };

  // Close modals and reset state
  const closeModals = () => {
    setShowEditModal(false);
    setShowAddModal(false);
    setEditingBrand(null);
    setSelectedImage(null);
    setImagePreview("");
  };

  return (
    <>
      <div className="trezo-card bg-white dark:bg-[#0c1427] mb-[25px] p-[20px] md:p-[25px] rounded-md">
        <div className="trezo-card-header mb-[20px] md:mb-[25px] flex flex-wrap items-center justify-between">
          <div className="trezo-card-title">
            <h5 className="!mb-0 text-black dark:text-white font-bold text-lg">
              إدارة شعارات البراند
            </h5>
          </div>

          <div className="trezo-card-subtitle mt-[15px] sm:mt-0">
            <button
              onClick={() => setShowAddModal(true)}
              className="inline-block transition-all rounded-md font-medium px-[13px] py-[6px] text-white bg-primary-500 border border-primary-500 hover:bg-primary-600 hover:border-primary-600"
            >
              <span className="inline-block relative ltr:pl-[22px] rtl:pr-[22px]">
                <i className="material-symbols-outlined !text-[22px] absolute ltr:-left-[4px] rtl:-right-[4px] top-1/2 -translate-y-1/2">
                  add
                </i>
                إضافة شعار جديد
              </span>
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mb-[20px]">
          <div className="relative">
            <input
              type="text"
              placeholder="البحث عن شعار..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="w-full ltr:pl-[40px] rtl:pr-[40px] ltr:pr-[15px] rtl:pl-[15px] py-[10px] border border-gray-200 dark:border-[#172036] rounded-md dark:bg-[#15203c] dark:text-white focus:outline-none focus:border-primary-500"
            />
            <i className="ri-search-line absolute ltr:left-[15px] rtl:right-[15px] top-1/2 -translate-y-1/2 text-gray-400"></i>
          </div>
        </div>

        {/* Table */}
        <div className="trezo-card-content -mx-[20px] md:-mx-[25px]">
          {isLoading ? (
            <div className="text-center py-10">
              <p>جاري التحميل...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="table-auto w-full">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-[#172036]">
                    <th className="text-start px-[20px] md:px-[25px] py-[15px] font-medium text-gray-600 dark:text-gray-400">
                      #
                    </th>
                    <th className="text-start px-[20px] md:px-[25px] py-[15px] font-medium text-gray-600 dark:text-gray-400">
                      الصورة
                    </th>

                    <th className="text-start px-[20px] md:px-[25px] py-[15px] font-medium text-gray-600 dark:text-gray-400">
                      الترتيب
                    </th>
                    <th className="text-start px-[20px] md:px-[25px] py-[15px] font-medium text-gray-600 dark:text-gray-400">
                      الإجراءات
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {currentItems.length > 0 ? (
                    currentItems.map((brand, index) => (
                      <tr
                        key={brand.id}
                        className="border-b border-gray-200 dark:border-[#172036]"
                      >
                        <td className="px-[20px] md:px-[25px] py-[15px]">
                          {indexOfFirstItem + index + 1}
                        </td>
                        <td className="px-[20px] md:px-[25px] py-[15px]">
                          <div className="w-[100px] h-[60px] relative border border-gray-200 dark:border-[#172036] rounded-md overflow-hidden bg-gray-50 dark:bg-[#15203c]">
                            <Image
                              src={brand.img}
                              alt="Brand logo"
                              fill
                              className="object-contain p-1"
                            />
                          </div>
                        </td>

                        <td className="px-[20px] md:px-[25px] py-[15px]">
                          {brand.order || "-"}
                        </td>
                        <td className="px-[20px] md:px-[25px] py-[15px]">
                          <div className="flex gap-2">
                            <button
                              onClick={() => openEditModal(brand)}
                              className="w-[32px] h-[32px] rounded-md flex items-center justify-center bg-primary-50 text-primary-500 hover:bg-primary-500 hover:text-white transition-all dark:bg-primary-500/10"
                              title="تعديل"
                            >
                              <i className="ri-edit-line text-lg"></i>
                            </button>
                            <button
                              onClick={() => handleDelete(brand)}
                              className="w-[32px] h-[32px] rounded-md flex items-center justify-center bg-red-50 text-red-500 hover:bg-red-500 hover:text-white transition-all dark:bg-red-500/10"
                              title="حذف"
                            >
                              <i className="ri-delete-bin-line text-lg"></i>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={5}
                        className="text-center px-[20px] md:px-[25px] py-[30px]"
                      >
                        لا توجد بيانات
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex flex-wrap items-center justify-between gap-[10px] mt-[20px] px-[20px] md:px-[25px]">
            <div className="text-sm text-gray-500 dark:text-gray-400">
              عرض {indexOfFirstItem + 1} إلى{" "}
              {Math.min(indexOfLastItem, filteredItems.length)} من{" "}
              {filteredItems.length} نتيجة
            </div>

            <div className="flex items-center gap-[5px]">
              <button
                onClick={() => paginate(currentPage - 1)}
                disabled={currentPage === 1}
                className="w-[32px] h-[32px] rounded-md border border-gray-200 dark:border-[#172036] flex items-center justify-center transition-all hover:bg-primary-500 hover:text-white hover:border-primary-500 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-gray-500"
              >
                <i className="ri-arrow-right-s-line text-xl"></i>
              </button>

              {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }

                return (
                  <button
                    key={pageNum}
                    onClick={() => paginate(pageNum)}
                    className={`w-[32px] h-[32px] rounded-md border flex items-center justify-center transition-all ${
                      currentPage === pageNum
                        ? "bg-primary-500 text-white border-primary-500"
                        : "border-gray-200 dark:border-[#172036] hover:bg-primary-500 hover:text-white hover:border-primary-500"
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}

              <button
                onClick={() => paginate(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="w-[32px] h-[32px] rounded-md border border-gray-200 dark:border-[#172036] flex items-center justify-center transition-all hover:bg-primary-500 hover:text-white hover:border-primary-500 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-gray-500"
              >
                <i className="ri-arrow-left-s-line text-xl"></i>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[999] p-4">
          <div className="bg-white dark:bg-[#0c1427] rounded-lg w-[90%] max-w-[600px] max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white dark:bg-[#0c1427] border-b border-gray-200 dark:border-[#172036] px-6 py-4 flex items-center justify-between">
              <h3 className="text-xl font-bold text-black dark:text-white">
                إضافة شعار جديد
              </h3>
              <button
                onClick={closeModals}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <i className="ri-close-line text-2xl"></i>
              </button>
            </div>

            <div className="p-6">
              <div className="mb-6">
                <label className="block mb-2 text-sm font-medium text-black dark:text-white">
                  صورة الشعار <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="w-full p-3 border border-gray-200 dark:border-[#172036] rounded-md dark:bg-[#15203c] dark:text-white focus:outline-none focus:border-primary-500"
                  />
                </div>
                {imagePreview && (
                  <div className="mt-4 w-full h-[200px] relative border border-gray-200 dark:border-[#172036] rounded-md overflow-hidden bg-gray-50 dark:bg-[#15203c]">
                    <Image
                      src={imagePreview}
                      alt="Preview"
                      fill
                      className="object-contain p-2"
                    />
                  </div>
                )}
              </div>

              <div className="flex gap-3 justify-end pt-4 border-t border-gray-200 dark:border-[#172036]">
                <button
                  onClick={closeModals}
                  className="px-5 py-2.5 border border-gray-200 dark:border-[#172036] rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-[#15203c] transition-all"
                >
                  إلغاء
                </button>
                <button
                  onClick={handleAdd}
                  className="px-5 py-2.5 bg-primary-500 text-white rounded-md hover:bg-primary-600 transition-all"
                >
                  إضافة الشعار
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && editingBrand && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[999] p-4">
          <div className="bg-white dark:bg-[#0c1427] rounded-lg w-[90%] max-w-[600px] max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white dark:bg-[#0c1427] border-b border-gray-200 dark:border-[#172036] px-6 py-4 flex items-center justify-between">
              <h3 className="text-xl font-bold text-black dark:text-white">
                تعديل الشعار
              </h3>
              <button
                onClick={closeModals}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <i className="ri-close-line text-2xl"></i>
              </button>
            </div>

            <div className="p-6">
              <div className="mb-6">
                <label className="block mb-2 text-sm font-medium text-black dark:text-white">
                  الصورة الحالية
                </label>
                <div className="w-full h-[200px] relative border border-gray-200 dark:border-[#172036] rounded-md overflow-hidden bg-gray-50 dark:bg-[#15203c] mb-4">
                  <Image
                    src={imagePreview}
                    alt="Current"
                    fill
                    className="object-contain p-2"
                  />
                </div>

                <label className="block mb-2 text-sm font-medium text-black dark:text-white">
                  تغيير الصورة (اختياري)
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="w-full p-3 border border-gray-200 dark:border-[#172036] rounded-md dark:bg-[#15203c] dark:text-white focus:outline-none focus:border-primary-500"
                />
              </div>

              <div className="mb-6">
                <label className="block mb-2 text-sm font-medium text-black dark:text-white">
                  ترتيب العرض
                </label>
                <input
                  type="number"
                  min="0"
                  value={editingBrand.order || 0}
                  onChange={(e) =>
                    setEditingBrand({
                      ...editingBrand,
                      order: parseInt(e.target.value),
                    })
                  }
                  className="w-full p-3 border border-gray-200 dark:border-[#172036] rounded-md dark:bg-[#15203c] dark:text-white focus:outline-none focus:border-primary-500"
                  placeholder="أدخل رقم الترتيب"
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  الشعارات ذات الأرقام الأقل تظهر أولاً
                </p>
              </div>

              <div className="flex gap-3 justify-end pt-4 border-t border-gray-200 dark:border-[#172036]">
                <button
                  onClick={closeModals}
                  className="px-5 py-2.5 border border-gray-200 dark:border-[#172036] rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-[#15203c] transition-all"
                >
                  إلغاء
                </button>
                <button
                  onClick={handleUpdate}
                  className="px-5 py-2.5 bg-primary-500 text-white rounded-md hover:bg-primary-600 transition-all"
                >
                  حفظ التعديلات
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default BrandsTable;
