import { useState, useEffect } from 'react';
import { Receipt, Eye, Calendar, DollarSign, Store } from 'lucide-react';
import {receiptService} from '../../api/receiptService';

const ReceiptHistory = () => {
  const [receipts, setReceipts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedReceipt, setSelectedReceipt] = useState(null);

  useEffect(() => {
    fetchReceiptHistory();
  }, []);

const fetchReceiptHistory = async () => {
  try {
    const response = await receiptService.getReceiptHistory();
    setReceipts(response.receipts);
  } catch (error) {
    console.error('Error fetching receipt history:', error);
  } finally {
    setLoading(false);
  }
};

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Receipt History</h1>
        <p className="text-gray-600 dark:text-gray-400">
          View all your uploaded and processed receipts
        </p>
      </div>

      {receipts.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-12 text-center">
          <Receipt className="h-16 w-16 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No receipts yet
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Upload your first receipt to get started
          </p>
          <a
            href="/receipts"
            className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
          >
            Upload Receipt
          </a>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {receipts.map((receipt) => (
            <div
              key={receipt._id}
              className="bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => setSelectedReceipt(receipt)}
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <Receipt className="h-8 w-8 text-primary-600" />
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${
                      receipt.status === 'processed'
                        ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                        : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
                    }`}
                  >
                    {receipt.status}
                  </span>
                </div>

                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {receipt.merchant || 'Unknown Merchant'}
                </h3>

                <div className="space-y-2">
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                    <DollarSign className="h-4 w-4 mr-2" />
                    <span>₹{receipt.amount?.toFixed(2) || 'N/A'}</span>
                  </div>

                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                    <Calendar className="h-4 w-4 mr-2" />
                    <span>
                      {receipt.date
                        ? new Date(receipt.date).toLocaleDateString()
                        : 'N/A'}
                    </span>
                  </div>
                </div>

                <button className="mt-4 w-full flex items-center justify-center space-x-2 px-4 py-2 border border-primary-600 text-primary-600 rounded-lg hover:bg-primary-50 dark:hover:bg-primary-900/20">
                  <Eye className="h-4 w-4" />
                  <span>View Details</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal for viewing receipt details */}
      {selectedReceipt && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedReceipt(null)}
        >
          <div
            className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Receipt Details
                </h2>
                <button
                  onClick={() => setSelectedReceipt(null)}
                  className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Merchant
                  </label>
                  <p className="text-gray-900 dark:text-white">
                    {selectedReceipt.merchant || 'Unknown'}
                  </p>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Amount
                  </label>
                  <p className="text-gray-900 dark:text-white">
                    ₹{selectedReceipt.amount?.toFixed(2) || 'N/A'}
                  </p>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Date
                  </label>
                  <p className="text-gray-900 dark:text-white">
                    {selectedReceipt.date
                      ? new Date(selectedReceipt.date).toLocaleDateString()
                      : 'N/A'}
                  </p>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Raw Text
                  </label>
                  <pre className="mt-2 p-4 bg-gray-100 dark:bg-gray-900 rounded-lg text-sm text-gray-900 dark:text-white whitespace-pre-wrap">
                    {selectedReceipt.rawText || 'No text extracted'}
                  </pre>
                </div>

                {selectedReceipt.receiptUrl && (
                  <div>
                    <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Receipt Image
                    </label>
                    <img
                      src={selectedReceipt.receiptUrl}
                      alt="Receipt"
                      className="mt-2 w-full rounded-lg"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReceiptHistory;