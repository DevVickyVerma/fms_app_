import useErrorHandler from './useErrorHandler';

const useToggleStatus = () => {
    const { handleError } = useErrorHandler();
    const toggleStatus = async (
        postData, // (url: string, body: any) => Promise<any>
        apiUrl,
        formData,
        handleSuccess
    ) => {
        try {
            const response = await postData(apiUrl, formData);
            if (response.api_response === 'success') {
                handleSuccess();
            }
        } catch (error) {
            handleError(error);
            console.error('Error toggling status:', error);
        }
    };

    return { toggleStatus };
};

export default useToggleStatus;
