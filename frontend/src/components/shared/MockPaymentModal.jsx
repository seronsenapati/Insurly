import React, { useState } from 'react';
import { formatCurrency } from '../../utils/formatters';

const MockPaymentModal = ({ amount, onSuccess, onCancel }) => {
  const [loading, setLoading] = useState(false);

  const handlePay = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onSuccess({ transactionId: 'INS' + Date.now() });
    }, 2000);
  };

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm'>
      <div className='bg-white rounded-2xl p-8 w-full max-w-md shadow-2xl relative animate-in fade-in zoom-in-95 duration-200'>
        <div className='text-center mb-6'>
          <h2 className='text-2xl font-serif font-bold text-[#1A1A2E] mb-2'>Complete Payment</h2>
          <p className='text-[#4A4A6A] text-sm'>Secure simulated transaction for demo purposes</p>
        </div>

        <div className='bg-[#FAF7F2] p-6 rounded-xl mb-6 flex flex-col items-center'>
          <span className='text-[#4A4A6A] text-sm font-medium mb-1'>Amount to Pay</span>
          <span className='text-4xl font-bold text-[#1A1A2E]'>{formatCurrency(amount)}</span>
        </div>

        <div className='space-y-4 mb-8'>
          <div className='flex justify-between items-center border-b border-gray-100 pb-3'>
            <span className='text-gray-500 text-sm'>Payment Mode</span>
            <span className='font-medium text-[#1A1A2E]'>UPI Simulated</span>
          </div>
          <div className='flex justify-between items-center pb-3'>
            <span className='text-gray-500 text-sm'>Status</span>
            <span className='text-blue-600 font-medium bg-blue-50 px-2 py-0.5 rounded text-xs'>Ready</span>
          </div>
        </div>

        <div className='flex flex-col gap-3'>
          <button 
            onClick={handlePay}
            disabled={loading}
            className='w-full bg-[#1A1A2E] text-white py-3.5 rounded-full font-bold hover:bg-[#2D2D4E] transition-all flex justify-center items-center h-[52px]'
          >
            {loading ? (
              <svg className='animate-spin h-5 w-5 text-white' fill='none' viewBox='0 0 24 24'>
                <circle className='opacity-25' cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='4'></circle>
                <path className='opacity-75' fill='currentColor' d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'></path>
              </svg>
            ) : (
              `Pay ${formatCurrency(amount)}`
            )}
          </button>
          
          <button 
            onClick={onCancel}
            disabled={loading}
            className='w-full border border-gray-200 text-[#4A4A6A] py-3.5 rounded-full font-medium hover:bg-gray-50 transition-all'
          >
            Cancel
          </button>
        </div>
        
        <p className='text-xs text-center text-gray-400 mt-6 mt-4'>
          Disclaimer: This is a demo payment gateway. No real money will be deducted.
        </p>
      </div>
    </div>
  );
};

export default MockPaymentModal;
