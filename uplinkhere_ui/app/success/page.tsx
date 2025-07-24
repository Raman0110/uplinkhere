import { CheckCircle } from 'lucide-react';

interface SuccessPageProps {
  onUploadMore: () => void;
  onClose: () => void;
}

export default function SuccessPage({ onUploadMore, onClose }: SuccessPageProps) {
  return (
    <div className="max-w-md mx-auto text-center mt-38">
      {/* Success Icon */}
      <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <CheckCircle className="w-10 h-10 text-green-500" />
      </div>

      {/* Success Message */}
      <h1 className="text-2xl font-bold text-gray-900 mb-3">Files Uploaded Successfully!</h1>
      <p className="text-gray-600 mb-8">
        Your files have been securely uploaded and are now available to the request owner.
      </p>

      {/* Action Buttons */}
      <div className="space-y-3">
        <button
          onClick={onUploadMore}
          className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 px-6 rounded-lg font-medium hover:from-blue-600 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl"
        >
          Upload More Files
        </button>
        <button
          onClick={onClose}
          className="w-full bg-gray-100 text-gray-700 py-3 px-6 rounded-lg font-medium hover:bg-gray-200 transition-colors"
        >
          Close
        </button>
      </div>
    </div>
  );
}