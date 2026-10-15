import React, { useCallback, useEffect, useState } from "react";
import AdminLayout from "../common/AdminLayout";
import Listing from "@/pages/api/Listing";
import AdminReturnDetailsModal from "@/components/admin/AdminReturnDetailsModal";
import toast from "react-hot-toast";
import {
  HiOutlineArrowPath,
  HiOutlineMagnifyingGlass,
  HiOutlineEye,
  HiOutlineInformationCircle,
} from "react-icons/hi2";

const statusOptions = [
  "requested",
  "under_review",
  "approved",
  "rejected",
  "pickup_scheduled",
  "picked_up",
  "in_transit",
  "received",
  "quality_check",
  "refund_initiated",
  "refund_completed",
  "replacement_created",
  "replacement_shipped",
  "replacement_delivered",
  "cancelled",
  "completed",
];

function getMessage(error) {
  return error?.response?.data?.message || error?.message || "Failed to load return requests.";
}

function unwrapResponse(response) {
  return response?.data?.data || response?.data || {};
}

function getRequestId(request) {
  return request?._id || request?.id || request?.returnId;
}

function getOrderNumber(request) {
  return request?.orderNumber || request?.order?.orderNumber || request?.order?.orderId || "—";
}

function getCustomer(request) {
  return request?.customer?.name ||
    request?.user?.name ||
    request?.customerName ||
    request?.user?.fullName ||
    "—";
}

function getStatusClass(status) {
  if (["approved", "completed", "refund_completed", "replacement_delivered"].includes(status)) {
    return "bg-emerald-100 text-emerald-800";
  }
  if (["rejected", "cancelled"].includes(status)) return "bg-red-100 text-red-800";
  if (["requested", "under_review"].includes(status)) return "bg-amber-100 text-amber-800";
  return "bg-blue-100 text-blue-800";
}

export default function AdminReturnsPage() {
  const [requests, setRequests] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState("");
  const [type, setType] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedReturnId, setSelectedReturnId] = useState(null);

  const fetchRequests = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const listing = new Listing();
      const params = { page, limit: 20 };
      if (status) params.status = status;
      if (type) params.type = type;
      if (search.trim()) params.search = search.trim();
      const response = await listing.adminGetReturns(params);
      const payload = unwrapResponse(response);
      if (response?.data?.success === false) {
        throw new Error(response.data.message || "Failed to load requests.");
      }
      setRequests(payload.returns || payload.requests || payload.items || []);
      setPagination(payload.pagination || { page, totalPages: 1, total: 0 });
    } catch (fetchError) {
      console.error("Failed to load admin return requests:", fetchError);
      const message = getMessage(fetchError);
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }, [page, status, type, search]);

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  const submitSearch = (event) => {
    event.preventDefault();
    setPage(1);
    setSearch(searchInput);
  };

  const changeFilter = (setter) => (event) => {
    setter(event.target.value);
    setPage(1);
  };

  const totalPages = Math.max(
    1,
    Number(pagination.totalPages || pagination.pages || 1)
  );
  const currentPage = Number(pagination.page || page);

  return (
    <AdminLayout>
      <main className="min-h-screen bg-slate-50 px-4 py-8 sm:px-8">
        <div className="mx-auto max-w-7xl space-y-6">
          <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-emerald-700">
                Order management
              </p>
              <h1 className="mt-2 text-2xl font-extrabold text-gray-900 sm:text-3xl">
                Returns &amp; Replacements
              </h1>
              <p className="mt-2 text-sm text-gray-500">
                Review customer requests and manage return and replacement progress.
              </p>
            </div>
            <button
              type="button"
              onClick={fetchRequests}
              disabled={loading}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm font-bold text-gray-700 hover:bg-gray-50 disabled:opacity-50"
            >
              <HiOutlineArrowPath className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
              Refresh
            </button>
          </header>

          <section className="rounded-2xl border border-amber-200 bg-amber-50 p-4 sm:p-5">
            <div className="flex items-start gap-3">
              <HiOutlineInformationCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-amber-700" />
              <p className="text-sm leading-6 text-amber-950">
                Status transitions, approval, rejection, reverse pickup, refund, and replacement creation
                are validated by the backend. Refund completion must only be recorded after payment-provider confirmation.
              </p>
            </div>
          </section>

          <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
            <div className="flex flex-col gap-4 border-b border-gray-100 p-4 sm:p-5 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
                  <HiOutlineArrowPath className="h-5 w-5" />
                </span>
                <div>
                  <h2 className="font-bold text-gray-900">Customer requests</h2>
                  <p className="text-xs text-gray-500">
                    {pagination.total ?? pagination.totalItems ?? requests.length} request(s)
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <form onSubmit={submitSearch} className="flex min-w-0 flex-1">
                  <label htmlFor="return-search" className="sr-only">Search return requests</label>
                  <input
                    id="return-search"
                    value={searchInput}
                    onChange={(event) => setSearchInput(event.target.value)}
                    placeholder="Search order, request, product, customer"
                    className="min-w-0 flex-1 rounded-l-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-gray-500"
                  />
                  <button
                    type="submit"
                    aria-label="Search"
                    className="rounded-r-lg bg-gray-900 px-3 text-white hover:bg-gray-700"
                  >
                    <HiOutlineMagnifyingGlass className="h-5 w-5" />
                  </button>
                </form>
                <label className="sr-only" htmlFor="return-type-filter">Request type</label>
                <select
                  id="return-type-filter"
                  value={type}
                  onChange={changeFilter(setType)}
                  className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm"
                >
                  <option value="">All types</option>
                  <option value="return">Return</option>
                  <option value="replacement">Replacement</option>
                </select>
                <label className="sr-only" htmlFor="return-status-filter">Request status</label>
                <select
                  id="return-status-filter"
                  value={status}
                  onChange={changeFilter(setStatus)}
                  className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm"
                >
                  <option value="">All statuses</option>
                  {statusOptions.map((item) => (
                    <option key={item} value={item}>{item.replace(/_/g, " ")}</option>
                  ))}
                </select>
              </div>
            </div>

            {error && (
              <div role="alert" className="m-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-800">
                {error}
              </div>
            )}

            <div className="overflow-x-auto">
              <table className="w-full min-w-[860px] text-left text-sm">
                <thead className="bg-gray-50 text-xs uppercase tracking-wider text-gray-500">
                  <tr>
                    <th className="px-5 py-3 font-bold sm:px-6">Order / Product</th>
                    <th className="px-5 py-3 font-bold">Customer</th>
                    <th className="px-5 py-3 font-bold">Request</th>
                    <th className="px-5 py-3 font-bold">Reason</th>
                    <th className="px-5 py-3 font-bold">Submitted</th>
                    <th className="px-5 py-3 font-bold">Status / Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {loading ? (
                    <tr><td colSpan={6} className="px-5 py-14 text-center text-gray-500">Loading requests...</td></tr>
                  ) : requests.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-5 py-14 text-center">
                        <div className="mx-auto flex max-w-md flex-col items-center">
                          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 text-gray-500">
                            <HiOutlineArrowPath className="h-6 w-6" />
                          </span>
                          <p className="mt-4 font-bold text-gray-800">No return requests found</p>
                          <p className="mt-1 text-sm text-gray-500">
                            Requests will appear here once submitted by customers.
                          </p>
                        </div>
                      </td>
                    </tr>
                  ) : requests.map((request) => {
                    const requestStatus = String(request.status || "requested").toLowerCase();
                    return (
                      <tr key={getRequestId(request)} className="hover:bg-gray-50/70">
                        <td className="px-5 py-4 sm:px-6">
                          <p className="font-bold text-gray-900">{getOrderNumber(request)}</p>
                          <p className="mt-1 text-xs text-gray-500">
                            {request.productTitle || request.product?.title || "Product"}
                          </p>
                          <p className="mt-1 font-mono text-[11px] text-gray-400">{request.returnId || ""}</p>
                        </td>
                        <td className="px-5 py-4 text-gray-700">
                          <p>{getCustomer(request)}</p>
                          <p className="mt-1 text-xs text-gray-500">
                            {request.customer?.phone || request.user?.phone || request.customerPhone || ""}
                          </p>
                        </td>
                        <td className="px-5 py-4 capitalize text-gray-700">
                          {request.requestType || request.type || "return"}
                        </td>
                        <td className="max-w-[220px] truncate px-5 py-4 text-gray-700" title={request.reason}>
                          {request.reason || "—"}
                        </td>
                        <td className="px-5 py-4 text-gray-600">
                          {request.requestedAt ? new Date(request.requestedAt).toLocaleDateString("en-IN") : "—"}
                        </td>
                        <td className="px-5 py-4">
                          <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-bold capitalize ${getStatusClass(requestStatus)}`}>
                            {requestStatus.replace(/_/g, " ")}
                          </span>
                          <button
                            type="button"
                            onClick={() => setSelectedReturnId(getRequestId(request))}
                            className="mt-2 flex items-center gap-1 text-xs font-bold text-blue-700 hover:text-blue-900"
                          >
                            <HiOutlineEye className="h-4 w-4" />
                            Review / Manage
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {!loading && requests.length > 0 && (
              <div className="flex flex-col items-center justify-between gap-3 border-t border-gray-100 px-5 py-4 sm:flex-row sm:px-6">
                <p className="text-sm text-gray-500">
                  Page {currentPage} of {totalPages}
                </p>
                <div className="flex gap-2">
                  <button
                    type="button"
                    disabled={currentPage <= 1}
                    onClick={() => setPage((current) => Math.max(current - 1, 1))}
                    className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Previous
                  </button>
                  <button
                    type="button"
                    disabled={currentPage >= totalPages}
                    onClick={() => setPage((current) => Math.min(current + 1, totalPages))}
                    className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </section>
        </div>
      </main>
      {selectedReturnId && (
        <AdminReturnDetailsModal
          returnId={selectedReturnId}
          onClose={() => setSelectedReturnId(null)}
          onUpdated={fetchRequests}
        />
      )}
    </AdminLayout>
  );
}
