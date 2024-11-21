// formConfig.js
import * as Yup from "yup";
 

export const AddSitevalidationSchema = Yup.object({
  site_code: Yup.string().required("Site Code is required"),
  site_name: Yup.string()
    .max(150, "Must be 150 characters or less")
    .required("Site Name is required"),
  site_Address: Yup.string().required("Site Address is required"),
  company_id: Yup.string().required("Company is required"),
  Site_Status: Yup.string().required("Site Status is required"),
  display_name: Yup.string().required("Display Name is required"),
  bussiness_Type: Yup.string().required("Business Type is required"),
  consider_keyfules_cards: Yup.string().required(
    "Consider Keyfules Cards is required"
  ),
  supplier: Yup.string().required("Supplier is required"),
  DRS_Start_Date: Yup.string().required("DRS Start Date is required"),
  Select_machine_type: Yup.string().required("Data Import Types is required"),
  Saga_department_code: Yup.string().required("Sage Department Code is required"),
  Saga_department_name: Yup.string().required("Saga Department Name is required"),
  Drs_upload_status: Yup.string().required("Drs Upload Status is required"),
  Bp_nctt_site_no: Yup.string().required("Bp Nctt Site No is required"),
  bank_ref: Yup.string().required("Bank Reference is required"),
  security_amount: Yup.string().required("Security Amount is required"),
  loomis_status: Yup.string().required("Loomis Status is required"),
  cashback_status: Yup.string().required("Cashback Status is required"),
  apply_sc: Yup.string().required("Apply Add Shop is required"),
  is_reconciled: Yup.string().required("Reconciled Data is required"),
  d_deduction: Yup.string().required("Deduct Deduction is required"),
  display_all_sales: Yup.string().required("Display All Sales is required"),
  cashback_enable: Yup.string().required("Cashback Enable is required"),
  update_tlm_price: Yup.string().required("Update TLM Price is required"),
  to_emails: Yup.array()
    .of(Yup.string().email("Invalid email format"))
    .min(1, "At least one email is required"),
});
