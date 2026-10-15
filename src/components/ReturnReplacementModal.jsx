import React, { useEffect, useRef, useState } from "react";
import { FaTimes } from "react-icons/fa";

const RETURN_REASONS = [
  "Product is damaged",
  "Wrong product received",
  "Product is defective",
  "Product does not match description",
  "No longer needed",
  "Other",
];

export default function ReturnReplacementModal({
  isOpen,
  onClose,
  orderId,
  product,
  pickupAddress,
  deliveryDeadline,
  onSubmit,
}) {
  const [requestType, setRequestType] = useState("return");
  const [reason, setReason] = useState("");
  const [comments, setComments] = useState("");
  const [address, setAddress] = useState({
    name: pickupAddress?.name || "",
    address: pickupAddress?.address || "",
    phone: pickupAddress?.phone || "",
  });
  const [confirmedAddress, setConfirmedAddress] = useState(false);
  const [images, setImages] = useState([]);
  const [imageError, setImageError] = useState("");
  const [submitError, setSubmitError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const fileInputRef = useRef(null);
  const imagesRef = useRef([]);

  useEffect(() => {
    imagesRef.current = images;
  }, [images]);

  useEffect(() => {
    return () => imagesRef.current.forEach((image) => URL.revokeObjectURL(image.preview));
  }, []);

  if (!isOpen) return null;

  const handleImageChange = (event) => {
    const selectedFiles = Array.from(event.target.files || []);
    const availableSlots = 5 - images.length;
    const allowedImage = /\.(jpe?g|png|webp)$/i;
    const validFiles = selectedFiles.filter((file) =>
      allowedImage.test(file.name) && file.size <= 5 * 1024 * 1024
    );

    if (validFiles.length !== selectedFiles.length) {
      setImageError("Only JPG, JPEG, PNG, and WEBP images up to 5 MB each are allowed.");
    } else if (selectedFiles.length > availableSlots) {
      setImageError("You can attach up to 5 images.");
    } else {
      setImageError("");
    }

    setImages((current) => [
      ...current,
      ...validFiles.slice(0, availableSlots).map((file) => ({
        file,
        preview: URL.createObjectURL(file),
      })),
    ]);
    event.target.value = "";
  };

  const removeImage = (index) => {
    setImages((current) => {
      const removed = current[index];
      if (removed) URL.revokeObjectURL(removed.preview);
      return current.filter((_, imageIndex) => imageIndex !== index);
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!confirmedAddress) {
      setSubmitError("Please confirm the pickup address.");
      return;
    }

    setSubmitting(true);
    setSubmitError("");
    const formData = new FormData();
    formData.append("orderId", String(orderId));
    formData.append("productId", String(product?.productId || product?._id || product?.id || ""));
    formData.append("quantity", String(product?.quantity || 1));
    formData.append("requestType", requestType);
    formData.append("reason", reason);
    formData.append("comments", comments.trim());
    formData.append("pickupAddress", JSON.stringify({
      name: address.name.trim(),
      phone: address.phone.trim(),
      fullAddress: address.address.trim(),
    }));
    formData.append("pickupAddressConfirmed", "true");
    images.forEach(({ file }) => formData.append("supportingImages", file));

    try {
      await onSubmit(formData);
      onClose();
    } catch (error) {
      setSubmitError(
        error?.response?.data?.message ||
        error?.message ||
        "Unable to submit your request. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[100000] flex items-center justify-center bg-black/60 p-3 backdrop-blur-sm sm:p-6"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="return-request-title"
        className="flex max-h-[94vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl"
      >
        <header className="flex items-start justify-between gap-4 border-b border-gray-100 p-5 sm:p-6">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-emerald-700">
              Order #{orderId}
            </p>
            <h2 id="return-request-title" className="mt-1 text-xl font-extrabold text-gray-900">
              Return or replacement
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              {product?.title || product?.name || "Ordered product"}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close return request"
            className="rounded-full p-2 text-gray-500 transition hover:bg-gray-100"
          >
            <FaTimes />
          </button>
        </header>

        <form onSubmit={handleSubmit} className="overflow-y-auto p-5 sm:p-6">
          <p className="mb-5 rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
            Return or Replacement available within 7 days of delivery.
            {deliveryDeadline && (
              <span className="mt-1 block font-semibold">
                Request by {deliveryDeadline.toLocaleString("en-IN", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                  hour: "numeric",
                  minute: "2-digit",
                })}
              </span>
            )}
          </p>

          <fieldset>
            <legend className="mb-2 text-sm font-bold text-gray-800">What would you like to do?</legend>
            <div className="grid grid-cols-2 gap-3">
              {[
                { value: "return", title: "Return", description: "Send the product back" },
                { value: "replacement", title: "Replacement", description: "Request another product" },
              ].map((option) => (
                <label
                  key={option.value}
                  className={`cursor-pointer rounded-xl border p-4 transition ${
                    requestType === option.value
                      ? "border-gray-900 bg-gray-50 ring-1 ring-gray-900"
                      : "border-gray-200 hover:border-gray-400"
                  }`}
                >
                  <input
                    type="radio"
                    name="requestType"
                    value={option.value}
                    checked={requestType === option.value}
                    onChange={() => setRequestType(option.value)}
                    className="sr-only"
                  />
                  <span className="block text-sm font-bold text-gray-900">{option.title}</span>
                  <span className="mt-1 block text-xs text-gray-500">{option.description}</span>
                </label>
              ))}
            </div>
          </fieldset>

          <div className="mt-5">
            <label htmlFor="return-reason" className="mb-2 block text-sm font-bold text-gray-800">
              Reason <span className="text-red-500">*</span>
            </label>
            <select
              id="return-reason"
              required
              value={reason}
              onChange={(event) => setReason(event.target.value)}
              className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-gray-500"
            >
              <option value="">Select a reason</option>
              {RETURN_REASONS.map((item) => <option key={item} value={item}>{item}</option>)}
            </select>
          </div>

          <div className="mt-5">
            <label htmlFor="return-comments" className="mb-2 block text-sm font-bold text-gray-800">
              Comments <span className="font-normal text-gray-500">(optional)</span>
            </label>
            <textarea
              id="return-comments"
              value={comments}
              onChange={(event) => setComments(event.target.value)}
              maxLength={1000}
              rows={3}
              placeholder="Add any details that will help us review your request"
              className="w-full resize-y rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-gray-500"
            />
          </div>

          <div className="mt-5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <label className="text-sm font-bold text-gray-800">
                Supporting images <span className="font-normal text-gray-500">(optional, up to 5)</span>
              </label>
              <input
                ref={fileInputRef}
                type="file"
                accept=".jpg,.jpeg,.png,.webp"
                multiple
                onChange={handleImageChange}
                className="sr-only"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={images.length >= 5}
                className="rounded-lg border border-gray-300 px-3 py-2 text-xs font-bold text-gray-700 hover:bg-gray-50 disabled:opacity-50"
              >
                Add photos
              </button>
            </div>
            <p className="mt-1 text-xs text-gray-500">Image files only, maximum 5 MB each.</p>
            {images.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-3">
                {images.map((image, index) => (
                  <div key={image.preview} className="relative">
                    <img
                      src={image.preview}
                      alt={`Supporting image ${index + 1}`}
                      className="h-16 w-16 rounded-lg border border-gray-200 object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      aria-label={`Remove image ${index + 1}`}
                      className="absolute -right-2 -top-2 rounded-full bg-gray-900 px-1.5 py-0.5 text-xs text-white"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
            {imageError && <p role="alert" className="mt-2 text-xs text-red-700">{imageError}</p>}
          </div>

          <fieldset className="mt-5 rounded-xl border border-gray-200 p-4">
            <legend className="px-1 text-sm font-bold text-gray-800">Pickup address</legend>
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="text-xs font-semibold text-gray-600">
                Name
                <input
                  required
                  value={address.name}
                  onChange={(event) => setAddress((current) => ({ ...current, name: event.target.value }))}
                  className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm font-normal text-gray-900"
                />
              </label>
              <label className="text-xs font-semibold text-gray-600">
                Phone
                <input
                  required
                  value={address.phone}
                  onChange={(event) => setAddress((current) => ({ ...current, phone: event.target.value }))}
                  className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm font-normal text-gray-900"
                />
              </label>
              <label className="text-xs font-semibold text-gray-600 sm:col-span-2">
                Full address
                <textarea
                  required
                  rows={2}
                  value={address.address}
                  onChange={(event) => setAddress((current) => ({ ...current, address: event.target.value }))}
                  className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm font-normal text-gray-900"
                />
              </label>
            </div>
            <label className="mt-3 flex items-start gap-2 text-sm text-gray-700">
              <input
                type="checkbox"
                required
                checked={confirmedAddress}
                onChange={(event) => setConfirmedAddress(event.target.checked)}
                className="mt-0.5 accent-gray-900"
              />
              I confirm this address is correct for pickup.
            </label>
          </fieldset>

          {submitError && (
            <p role="alert" className="mt-4 rounded-lg bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
              {submitError}
            </p>
          )}

          <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="rounded-xl border border-gray-300 px-5 py-3 text-sm font-bold text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="rounded-xl bg-gray-900 px-5 py-3 text-sm font-bold text-white hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting
                ? "Submitting..."
                : `Submit ${requestType === "return" ? "return" : "replacement"} request`}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
