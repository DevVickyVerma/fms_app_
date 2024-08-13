import { handleError } from './ToastUtils';

const useToggleStatus = () => {

    const toggleStatus = async (postData, apiUrl, formData, handleSuccess) => {
        try {
            const response = await postData(apiUrl, formData);
            if (response.api_response === 'success') {
                handleSuccess();
            }
        } catch (error) {
            handleError(error,);
            console.error('Error toggling status:', error);
        }
    };

    return { toggleStatus };
};

export default useToggleStatus;
