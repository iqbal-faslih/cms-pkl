import Swal from "sweetalert2";

export const showErrorAlert = (message) => {
  Swal.fire({
    icon: 'error',
    title: 'Error',
    text: message,
    confirmButtonColor: '#3085d6',
    confirmButtonText: 'OK',
  });
};

export const showSuccessAlert = (message) => {
  return Swal.fire({
    icon: 'success',
    title: 'Berhasil!',
    text: message,
    confirmButtonColor: '#3085d6',
    confirmButtonText: 'OK',
  });
};

export const showConfirmAlert = (title, text, confirmButtonText = 'Ya') => {
  return Swal.fire({
    title,
    text,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText,
    cancelButtonText: 'Batal'
  });
};

export const showLoadingAlert = (title = 'Loading...', text = 'Please wait') => {
  Swal.fire({
    title,
    text,
    allowEscapeKey: false,
    allowOutsideClick: false,
    didOpen: () => {
      Swal.showLoading();
    }
  });
};

export const showWarningAlert = (title, text) => {
  return Swal.fire({
    icon: 'warning',
    title,
    text,
    confirmButtonColor: '#3085d6',
  });
};