import { useState } from 'react';
import { receiptService } from '../../api/receiptService';
import { transactionService } from '../../api/transactionService';
import { Upload, FileText, CheckCircle } from 'lucide-react';

const UploadReceipt = () => {
  const [file, setFile] = useState(null);
  const [extractedData, setExtractedData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      if (selectedFile.type.startsWith('image/')) {
        setPreview(URL.createObjectURL(selectedFile));
      }
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    
    setLoading(true);
    try {
      const response = await receiptService.uploadReceipt(file);
      if (response.success) {
        setExtractedData(response.data);
      }
    } catch (error) {
      console.error('Error uploading receipt:', error);
      alert('Error uploading receipt');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveAsTransaction = async () => {
    if (!extractedData) return;

    try {
      await transactionService.createTransaction({
        amount: extractedData.amount,
        type: 'expense',
        category: 'Other',
        date: extractedData.date || new Date(),
        description: `From receipt: ${extractedData.merchant}`,
      });
      alert('Transaction saved successfully!');
      setFile(null);
      setExtractedData(null);
      setPreview(null);
    } catch (error) {
      console.error('Error saving transaction:', error);
      alert('Error saving transaction');
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Upload Receipt</h1>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center">
          <Upload className="h-12 w-12 mx-auto text-gray-400 mb-4" />
          <input
            type="file"
            accept="image/*,application/pdf"
            onChange={handleFileChange}
            className="hidden"
            id="receipt-upload"
          />
          <label
            htmlFor="receipt-upload"
            className="cursor-pointer inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
          >
            Choose File
          </label>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Supports: Images (JPG, PNG) and PDF files
          </p>
        </div>

        {file && (
          <div className="mt-4">
            <p className="text-sm text-gray-900 dark:text-white mb-2">
              Selected: {file.name}
            </p>
            <button
              onClick={handleUpload}
              disabled={loading}
              className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50"
            >
              {loading ? 'Processing...' : 'Upload & Extract'}
            </button>
          </div>
        )}
      </div>

      {preview && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Preview</h2>
          <img src={preview} alt="Receipt preview" className="max-w-full h-auto rounded-lg" />
        </div>
      )}

      {extractedData && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center space-x-2 mb-4">
            <CheckCircle className="h-6 w-6 text-green-500" />
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Extracted Data
            </h2>
          </div>

          <div className="space-y-3">
            <div>
              <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Merchant</label>
              <p className="text-gray-900 dark:text-white">{extractedData.merchant}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Amount</label>
              <p className="text-gray-900 dark:text-white">₹{extractedData.amount?.toFixed(2) || 'N/A'}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Date</label>
              <p className="text-gray-900 dark:text-white">
                {extractedData.date ? new Date(extractedData.date).toLocaleDateString() : 'N/A'}
              </p>
            </div>
          </div>

          <button
            onClick={handleSaveAsTransaction}
            className="mt-6 w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            Save as Transaction
          </button>
        </div>
      )}
    </div>
  );
};

export default UploadReceipt;