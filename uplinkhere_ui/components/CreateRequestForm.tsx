import { useState } from 'react';
import { ArrowLeft, RefreshCw, Eye, EyeOff, Calendar, Globe, Lock, Zap, CheckCircle, Copy, ExternalLink, X } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

interface CreateRequestFormProps {
  onBack: () => void;
}

export default function CreateRequestForm({ onBack }: CreateRequestFormProps) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    slug: '',
    password: '',
    expiryDate: '',
    isPasswordProtected: false,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [shareableLink, setShareableLink] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/file-request`, formData);

      // Generate the shareable link
      const link = `http://localhost:3000/r/${formData.slug || response.data.slug}`;
      setShareableLink(link);

      toast.success("File request created successfully");
      setShowSuccessModal(true);
    } catch (error) {
      toast.error("Unable to create request");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const generateSlug = () => {
    const slug = formData.title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .trim();
    setFormData({ ...formData, slug });
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareableLink);
      toast.success("Link copied to clipboard!");
    } catch (error) {
      toast.error("Failed to copy link");
    }
  };

  const openLink = () => {
    window.open(shareableLink, '_blank');
  };

  const handleNewRequest = () => {
    setShowSuccessModal(false);
    setFormData({
      title: '',
      description: '',
      slug: '',
      password: '',
      expiryDate: '',
      isPasswordProtected: false,
    });
    setShareableLink('');
  };

  return (
    <div className="min-h-screen -mt-6">
      {/* Header Section */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200/50">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <button
            onClick={onBack}
            className="cursor-pointer inline-flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors group"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span className="font-medium">Back to Dashboard</span>
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl mb-6 shadow-lg">
            <Zap className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-5xl font-bold text-gray-900 mb-4 tracking-tight">
            Create File Request
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Set up a beautiful, secure file upload portal that your team and clients will love to use
          </p>
        </div>

        {/* Main Form Container */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Form Section */}
          <div className="lg:col-span-2">
            <div className="bg-white/70 backdrop-blur-sm rounded-3xl border border-gray-200/50 shadow-xl p-10">
              <div className="space-y-8">
                {/* Title & Description Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <label htmlFor="title" className="block text-sm font-semibold text-gray-900 uppercase tracking-wide">
                      Request Title
                    </label>
                    <input
                      type="text"
                      id="title"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder="Project Assets Collection"
                      className="w-full px-6 py-4 text-lg border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none bg-white/80"
                      required
                    />
                  </div>

                  <div className="space-y-3">
                    <label htmlFor="description" className="block text-sm font-semibold text-gray-900 uppercase tracking-wide">
                      Description
                    </label>
                    <textarea
                      id="description"
                      rows={4}
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Share instructions and details for your file uploaders..."
                      className="w-full px-6 py-4 text-lg border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none resize-none bg-white/80"
                    />
                  </div>
                </div>

                {/* Custom URL Section */}
                <div className="space-y-4">
                  <label htmlFor="slug" className="block text-sm font-semibold text-gray-900 uppercase tracking-wide">
                    Custom URL
                  </label>
                  <div className="flex items-center bg-white/80 border-2 border-gray-200 rounded-2xl p-2 focus-within:ring-4 focus-within:ring-blue-500/20 focus-within:border-blue-500 transition-all">
                    <div className="flex items-center px-4 py-2 bg-gray-100 rounded-xl mr-3">
                      <Globe className="w-5 h-5 text-gray-500 mr-2" />
                      <span className="text-gray-600 font-medium">uplinkhere.com/upload/</span>
                    </div>
                    <input
                      type="text"
                      id="slug"
                      value={formData.slug}
                      onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                      placeholder="my-awesome-project"
                      className="flex-1 px-4 py-2 text-lg bg-transparent outline-none"
                    />
                    <button
                      type="button"
                      onClick={generateSlug}
                      className="ml-2 p-3 text-blue-600 hover:bg-blue-100 rounded-xl transition-colors group"
                      title="Generate from title"
                    >
                      <RefreshCw className="w-5 h-5 group-hover:rotate-180 transition-transform duration-300" />
                    </button>
                  </div>
                  <p className="text-sm text-gray-500 ml-1">Leave empty to auto-generate from your title</p>
                </div>

                {/* Security & Expiry Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Password Protection */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <label htmlFor="passwordToggle" className="text-sm font-semibold text-gray-900 uppercase tracking-wide">
                        Password Protection
                      </label>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          id="passwordToggle"
                          checked={formData.isPasswordProtected}
                          onChange={(e) => setFormData({ ...formData, isPasswordProtected: e.target.checked })}
                          className="sr-only peer"
                        />
                        <div className="w-14 h-7 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300/50 rounded-full peer peer-checked:after:translate-x-7 peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-blue-500 peer-checked:to-purple-600 shadow-lg"></div>
                      </label>
                    </div>

                    {formData.isPasswordProtected && (
                      <div className="flex items-center">
                        <input
                          type={showPassword ? "text" : "password"}
                          value={formData.password}
                          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                          placeholder="Enter secure password"
                          className="w-full px-6 py-4 text-lg border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none bg-white/80"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className=" text-gray-400 hover:text-gray-600 transition-colors -ml-10"
                        >
                          {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Expiry Date */}
                  <div className="space-y-4">
                    <label htmlFor="expiryDate" className="block text-sm font-semibold text-gray-900 uppercase tracking-wide">
                      Expiry Date
                    </label>
                    <div className="relative">
                      <input
                        type="datetime-local"
                        id="expiryDate"
                        value={formData.expiryDate}
                        onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                        className="w-full px-6 py-4 text-lg border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none bg-white/80"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="pt-8">
                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="cursor-pointer w-full bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-600 text-white py-5 px-8 rounded-2xl font-bold text-lg hover:from-blue-600 hover:via-purple-600 hover:to-indigo-700 transition-all duration-300 shadow-2xl hover:shadow-blue-500/25 hover:-translate-y-1 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    {isSubmitting ? (
                      <div className="flex items-center justify-center">
                        <RefreshCw className="w-5 h-5 animate-spin mr-2" />
                        Creating Request...
                      </div>
                    ) : (
                      'Create File Request'
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Preview/Info Sidebar */}
          <div className="space-y-8">
            {/* Live Preview Card */}
            <div className="bg-white/70 backdrop-blur-sm rounded-3xl border border-gray-200/50 shadow-xl p-8">
              <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-blue-500 rounded-lg mr-3 flex items-center justify-center">
                  <Eye className="w-4 h-4 text-white" />
                </div>
                Live Preview
              </h3>

              <div className="space-y-4 p-6 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-300">
                <h4 className="text-lg font-semibold text-gray-900">
                  {formData.title || "Your Request Title"}
                </h4>
                <p className="text-gray-600 text-sm">
                  {formData.description || "Description will appear here..."}
                </p>
                <div className="flex items-center space-x-2 text-xs text-gray-500">
                  <span>uplinkhere.com/upload/{formData.slug || "auto-generated"}</span>
                </div>
                <div className="flex items-center space-x-4 text-xs">
                  <span className={`px-2 py-1 rounded-full ${formData.isPasswordProtected ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
                    {formData.isPasswordProtected ? 'Password Protected' : 'Public Access'}
                  </span>
                </div>
              </div>
            </div>

            {/* Tips Card */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-3xl border border-blue-200/50 p-8">
              <h3 className="text-lg font-bold text-gray-900 mb-4">💡 Pro Tips</h3>
              <ul className="space-y-3 text-sm text-gray-700">
                <li className="flex items-start space-x-2">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Use descriptive titles to help uploaders understand the purpose</span>
                </li>
                <li className="flex items-start space-x-2">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Add password protection for sensitive file collections</span>
                </li>
                <li className="flex items-start space-x-2">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Set reasonable expiry dates to maintain security</span>
                </li>
                <li className="flex items-start space-x-2">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Custom URLs make sharing easier and more professional</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="p-8 pb-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-600 rounded-2xl flex items-center justify-center">
                    <CheckCircle className="w-6 h-6 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">Request Created Successfully!</h2>
                </div>
                <button
                  onClick={() => setShowSuccessModal(false)}
                  className="p-2 text-gray-400 hover:text-gray-600 transition-colors rounded-lg hover:bg-gray-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <p className="text-gray-600 mb-8">
                Your file request "{formData.title}" has been created. Share this link with people who need to upload files.
              </p>

              {/* Shareable Link Section */}
              <div className="space-y-4">
                <label className="block text-sm font-semibold text-gray-900 uppercase tracking-wide">
                  Shareable Link
                </label>

                <div className="flex items-center bg-gray-50 border-2 border-gray-200 rounded-2xl p-4">
                  <div className="flex-1 px-2">
                    <p className="text-gray-900 font-mono text-sm break-all">
                      {shareableLink}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2 ml-4">
                    <button
                      onClick={copyToClipboard}
                      className="cursor-pointer px-4 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors flex items-center space-x-2"
                      title="Copy to clipboard"
                    >
                      <Copy className="w-4 h-4" />
                      <span className="hidden sm:inline">Copy</span>
                    </button>
                    <button
                      onClick={openLink}
                      className="px-4 py-2 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-colors flex items-center space-x-2"
                      title="Open link"
                    >
                      <ExternalLink className="w-4 h-4" />
                      <span className="hidden sm:inline">Open</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Request Details */}
              <div className="mt-8 p-6 bg-gray-50 rounded-2xl">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Request Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Title:</span>
                    <p className="font-medium text-gray-900">{formData.title}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Custom URL:</span>
                    <p className="font-medium text-gray-900">{formData.slug || 'Auto-generated'}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Protection:</span>
                    <p className="font-medium text-gray-900">
                      {formData.isPasswordProtected ? 'Password Protected' : 'Public Access'}
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-500">Expires:</span>
                    <p className="font-medium text-gray-900">
                      {formData.expiryDate ? new Date(formData.expiryDate).toLocaleDateString() : 'No expiry'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-8 pb-8">
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={handleNewRequest}
                  className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 px-6 rounded-xl font-semibold hover:from-blue-600 hover:to-purple-700 transition-all duration-300"
                >
                  Create Another Request
                </button>
                <button
                  onClick={onBack}
                  className="flex-1 bg-gray-100 text-gray-700 py-3 px-6 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
                >
                  Back to Dashboard
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}