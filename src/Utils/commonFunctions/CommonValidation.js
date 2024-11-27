export const CeoDashBoardFilterValidation = Yup.object({
    client_id: isNotClient
      ? Yup.string().required("Client is required")
      : Yup.mixed().notRequired(),
    company_id: Yup.string().required("Company is required"),
    // report_month: Yup.string().required("Report Month is required"),
  });