import React, { useEffect, useState } from "react";
import Listing from "../api/Listing";
import toast from "react-hot-toast";
import { MdAdd, MdDelete, MdEdit } from "react-icons/md";
import Popup from "../common/Popup";

const TeacherFaq = () => {
    const [faqs, setFaqs] = useState([]);
    const [processing, setProcessing] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedFaq, setSelectedFaq] = useState(null);
    const closePopup = () => setModalOpen(false);
    const openEditModal = (faq) => {
        setSelectedFaq({ ...faq });
        setModalOpen(true);
    };
    useEffect(() => {
        fetchFaqs();
    }, []);

    const fetchFaqs = async () => {
        setProcessing(true);
        try {
            const main = new Listing();
            const res = await main.TeacherFaqList();
            const faqArray = res?.data?.data || [];
            const validFaqs = faqArray.filter(faq => faq.question && faq.answer);
            setFaqs(validFaqs.length ? validFaqs : [{ question: "", answer: "" }]);
        } catch {
            setFaqs([{ question: "", answer: "" }]); // fallback in case of error
        } finally {
            setProcessing(false);
        }
    };


    const handleFaqChange = (index, field, value) => {
        const updatedFaqs = [...faqs];
        updatedFaqs[index][field] = value;
        setFaqs(updatedFaqs);
    };

    const addFaq = () => {
        // Only add if no empty one exists
        const hasEmpty = faqs.some(f => !f.question && !f.answer);
        if (!hasEmpty) {
            setFaqs([...faqs, { question: "", answer: "" }]);
        } else {
            toast.error("Please fill in the existing empty FAQ before adding another.");
        }
    };


    const deleteFaq = async (index) => {
        const target = faqs[index];
        const updatedFaqs = [...faqs];
        updatedFaqs.splice(index, 1);

        // Ensure at least one blank entry remains
        setFaqs(updatedFaqs.length ? updatedFaqs : [{ question: "", answer: "" }]);

        if (target._id) {
            try {
                const main = new Listing();
                const res = await main.TeacherFaqDelete({ _id: target._id });
                toast.success(res?.data?.message || "FAQ deleted.");
            } catch {
                toast.error("Failed to delete FAQ.");
            }
        }
    };


    const handleFaqSubmit = async (index) => {
        const target = faqs[index];
        if (!target?.question?.trim() || !target?.answer?.trim()) {
            toast.error("Question and Answer cannot be empty.");
            return;
        }

        if (processing) return;
        setProcessing(true);

        try {
            const main = new Listing();
            const payload = {
                question: target.question,
                answer: target.answer,
            };
            const response = await main.TeacherFaqAdd(payload);

            toast.success(response?.data?.message || "FAQ saved.");
            fetchFaqs();
        } catch (error) {
            const status = error?.response?.status;
            const message = error?.response?.data?.message || "Error occurred.";
            toast.error({
                401: "Unauthorized",
                403: "Access denied.",
                404: message,
                500: "Server error.",
            }[status] || message);
        } finally {
            setProcessing(false);
        }
    };


    const saveFaqFromModal = async () => {
        if (!selectedFaq.question.trim() || !selectedFaq.answer.trim()) {
            toast.error("Both fields are required.");
            return;
        }
        setProcessing(true);
        try {
            const main = new Listing();
            const res = await main.TeacherFaqUpdate(selectedFaq)
            toast.success(res?.data?.message || "FAQ saved.");
            setModalOpen(false);
            fetchFaqs();
        } catch {
            toast.error("Error saving FAQ.");
        } finally {
            setProcessing(false);
        }
    };

    return (
        <div className="px-5 lg:px-[30px] pb-5 lg:pb-[30px] space-y-6">
            <div className="w-full lg:w-6/12  lg:pl-0 mb-4">
                <h2 className="text-[#000000] text-xl lg:text-2xl font-semibold tracking-[-0.04em]">Become a Teacher Page FAQ</h2>
            </div>


            {faqs.map((faq, index) => (
                <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                    <div>
                        <label className="block text-[#000000] font-medium mb-2">Question</label>
                        <input
                            type="text"
                            disabled={faq?._id}
                            value={faq.question}
                            onChange={(e) => handleFaqChange(index, 'question', e.target.value)}
                            placeholder="Enter question"
                            className="w-full bg-[#F4F6F8] text-[#727272] border border-[#F4F6F8] rounded-[10px] px-4 py-2 focus:outline-none"
                        />
                    </div>

                    <div>
                        <div className="flex justify-between items-center mb-2">
                            <label className="block text-[#000000] font-medium">Answer</label>
                            <div className="flex items-center gap-2">
                                {faq._id ? (
                                    <button
                                        onClick={() => openEditModal(faq)}
                                        className="bg-red-500 text-white rounded-full p-1 hover:bg-[#ffffff] hover:text-black"
                                        title="Edit FAQ"
                                    >
                                        <MdEdit />
                                    </button>
                                ) : (
                                    <button
                                        onClick={() => handleFaqSubmit(index)}

                                        className="bg-red-500 text-white rounded-full p-1 hover:bg-[#ffffff] hover:text-black"
                                        title="Save FAQ"
                                    >
                                        <MdAdd />
                                    </button>
                                )}
                                <span className="text-[#b1a9a9]">|</span>
                                <button
                                    onClick={() => deleteFaq(index)}
                                    className="bg-red-500 text-white rounded-full p-1 hover:bg-[#ffffff] hover:text-black"
                                    title="Delete FAQ"
                                >
                                    <MdDelete />
                                </button>
                            </div>
                        </div>
                        <input
                            type="text"
                            value={faq.answer}
                            disabled={faq?._id}
                            onChange={(e) => handleFaqChange(index, 'answer', e.target.value)}
                            placeholder="Enter answer"
                            className="w-full bg-[#F4F6F8] text-[#727272] border border-[#F4F6F8] rounded-[10px] px-4 py-2 focus:outline-none"
                        />
                    </div>
                </div>
            ))}

            <div className="flex justify-center ">
                <button
                    onClick={addFaq}
                    className="w-full max-w-[170px] border border-[#CC2828] bg-[#000000] hover:bg-[#ffffff] hover:text-black text-white py-3 rounded-[10px] text-base xl:text-lg transition"
                >
                    + Add More
                </button>
            </div>

            {modalOpen && (
                <Popup isOpen={modalOpen} onClose={closePopup} size={"max-w-[510px]"}>
                    <h3 className="text-xl font-semibold mb-4 text-[#000000]">Edit FAQ</h3>
                    <div className="mb-4">
                        <label className="block text-base font-medium text-[#727272] tracking-[-0.06em] mb-1">Question</label>
                        <textarea
                            rows={5}
                            type="text"
                            value={selectedFaq?.question || ""}
                            onChange={(e) =>
                                setSelectedFaq(prev => ({ ...prev, question: e.target.value }))
                            }
                            className="w-full border rounded px-4 py-2"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-base font-medium text-[#727272] tracking-[-0.06em] mb-1">Answer</label>
                        <textarea
                            rows={5}
                            type="text"
                            value={selectedFaq?.answer || ""}
                            onChange={(e) =>
                                setSelectedFaq(prev => ({ ...prev, answer: e.target.value }))
                            }
                            className="w-full border rounded px-4 py-2"
                        />
                    </div>
                    <div className="flex justify-end gap-2">
                        <button
                            onClick={saveFaqFromModal}
                            className="px-4 py-2 bg-[#000000] text-white rounded hover:bg-[#ffffff] hover:text-black cursor-pointer"
                        >
                            Save
                        </button>
                    </div>
                </Popup>
            )}
        </div>
    );
};

export default TeacherFaq;
