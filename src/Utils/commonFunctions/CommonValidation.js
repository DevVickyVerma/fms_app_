import * as Yup from "yup";

export const CeoDashBoardFilterValidation = Yup.object({
    client_id: Yup.string().required("Client is required"),
    company_id: Yup.string().required("Company is required"),
    // report_month: Yup.string().required("Report Month is required"),
});