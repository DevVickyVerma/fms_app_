import Swal from 'sweetalert2';
import { handleError } from '../../Utils/ToastUtils';

const useCustomDelete = () => {

    const customDelete = async (
        postData,
        apiUrl,
        formData,
        handleSuccess,
        text,
        confirmButtonText,
        title,
        navigate // Add navigate parameter
    ) => {
        Swal.fire({
            title: title || 'Are you sure?',
            text: text || 'You will not be able to recover this item!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: confirmButtonText || 'Yes, delete it!',
            cancelButtonText: 'Cancel',
            reverseButtons: true,
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const response = await postData(apiUrl, formData);
                    if (response.api_response === 'success') {
                        handleSuccess();
                    }
                } catch (error) {
                    handleError(error)
                }
            }
        });
    };

    return { customDelete };
};

export default useCustomDelete;
