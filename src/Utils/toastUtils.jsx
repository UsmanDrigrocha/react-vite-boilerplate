import { toast } from 'react-toastify';

export const showSuccessToast = (message, duration = 3000) => {
    toast.success(message, {
      autoClose: duration,
      hideProgressBar: false,
    });
  };
  
  export const showErrToast = (message, duration = 3000) => {
    toast.error(message, {
      autoClose: duration,
      hideProgressBar: false,
    });
  };
