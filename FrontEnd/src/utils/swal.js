import Swal from 'sweetalert2'
export const toast = (title, icon = 'success') =>
    Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 2500,
        timerProgressBar: true,
    }).fire({ icon, title })

export const confirm = (title, text = '', confirmText = 'Yes, delete') =>
    Swal.fire({
        title,
        text,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#e74c3c',
        cancelButtonColor: '#aaa',
        confirmButtonText: confirmText,
        cancelButtonText: 'Cancel',
    })

export const success = (title, text = '') =>
    Swal.fire({ icon: 'success', title, text, confirmButtonColor: '#1a1a2e' })

export const error = (title, text = '') =>
    Swal.fire({ icon: 'error', title, text, confirmButtonColor: '#1a1a2e' })

export default Swal
