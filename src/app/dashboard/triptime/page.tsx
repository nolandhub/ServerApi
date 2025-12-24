

export default function Page() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
            <div className="max-w-xl w-full mx-4">
                <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
                    {/* Icon */}
                    <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-slate-100">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-8 w-8 text-slate-600"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                        </svg>
                    </div>

                    {/* Title */}
                    <h1 className="text-2xl font-semibold text-slate-800 mb-2">
                        Tính năng đang được phát triển
                    </h1>

                    {/* Description */}
                    <p className="text-slate-600 mb-6 leading-relaxed">
                        Chúng tôi đang nỗ lực hoàn thiện tính năng này để mang lại trải nghiệm
                        tốt nhất cho bạn. Vui lòng quay lại sau.
                    </p>

                    {/* Divider */}
                    <div className="h-px w-full bg-slate-200 mb-6" />
                </div>

                {/* Footer note */}
                <p className="mt-6 text-center text-xs text-slate-500">
                    © {new Date().getFullYear()} ProbusVN Ve Xe Limousine. All rights reserved.
                </p>
            </div>
        </div>
    )

}