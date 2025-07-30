import { FileRequest } from "@/app/types";
import { Calendar, Globe, Link, MoreHorizontal, ShieldCheck, Upload } from "lucide-react";

interface RequestCardProps {
  request: FileRequest;
}

export default function RequestCard({ request }: RequestCardProps) {
  const isExpiringSoon = request.expiresAt ? new Date(request.expiresAt).getTime() - Date.now() < 2 * 24 * 60 * 60 * 1000 : false;
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-all duration-200 group">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
            {request.title}
          </h3>
          <p className="text-gray-600 text-sm mt-1">{request.description}</p>
        </div>
        <div className="flex items-center space-x-2">
          <div className={`w-2 h-2 rounded-full ${isExpiringSoon ? 'bg-yellow-400' : 'bg-green-400'}`} />
          <span className="text-xs text-gray-500">
            {isExpiringSoon ? 'Expiring Soon' : 'Active'}
          </span>
        </div>
      </div>

      <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
        <span className="flex items-center space-x-1">
          <Link className="w-4 h-4" />
          <span>{`${process.env.NEXT_PUBLIC_API_URL}/r/${request.slug}`}</span>
        </span>
        <span className="flex items-center space-x-1">
          <Calendar className="w-4 h-4" />
          <span>Expires {request.expiresAt ? new Date(request.expiresAt).toLocaleDateString() : 'No Expiry'}</span>
        </span>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4 text-sm">
          <span className="flex items-center space-x-1 text-blue-600">
            <Upload className="w-4 h-4" />
            <span>{request.uploads ? request.uploads.length : 0} uploads</span>
          </span>
          <span className="flex items-center space-x-1 text-gray-500">
            {request.passwordHash !== "" ? (
              <>
                <ShieldCheck className="w-4 h-4" />
                <span>Protected</span>
              </>
            ) : (
              <>
                <Globe className="w-4 h-4" />
                <span>Public</span>
              </>
            )}
          </span>
        </div>
        <button className="text-gray-400 hover:text-gray-600 transition-colors">
          <MoreHorizontal className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}