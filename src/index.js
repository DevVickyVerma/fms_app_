import React, { Fragment, useState } from "react";
import ReactDOM from "react-dom/client";
import "./index.scss";
import "phosphor-icons/src/css/icons.css"; // Import Phosphor Icons CSS
import { BrowserRouter, Route, Routes } from "react-router-dom";
import PrivateRoutes from "./Utils/PrivateRoutes";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import dataReducer from "./Redux/dataSlice";
import withApi from "./Utils/ApiHelper";
import Loaderimg from "./Utils/Loader";
import SiteEvobossStatus from "./components/pages/EvobossStatus/SiteEvobossStatus";
import SiteEvobossStatusPage from "./components/pages/EvobossStatus/SiteEvobossStatusPage";
import Competitor from "./components/pages/Competitor/Competitor";
import AddCompetitor from "./components/pages/Competitor/AddCompetitor";
import uploadCompetitor from "./components/pages/Competitor/UploadCompititor";
import ValidateOtp from "./components/CustomPages/Login/ValidateOtp";
import StatsCompetitor from "./components/pages/Competitor/StatsCompetitor";
import ManageBank from "./components/pages/ManageBank/ManageBank";
import AddBank from "./components/pages/ManageBank/AddBank";
import EditBank from "./components/pages/ManageBank/EditBank";
import DashBoardChild from "./components/Dashboard/DashboardChild/DashBoardChild";
import CeoDashBoardChild from "./components/Dashboard/DashboardChild/CeoDashBoardChild";
import TitanDashboardChild from "./components/TitanDashboard/TitanDashboardChild";
import DashSubChild from "./components/Dashboard/DashboardSubChild/DashSubChild";
import DashSubChildBaseAPIS from "./components/Dashboard/DashboardSubChild/DashSubChildBaseAPIS";
import CronModule from "./components/pages/CronModule/CronModule";
import SingleStatsCompetitor from "./components/pages/Competitor/SingleStatsCompetitor";
import UpdateCardGroup from "./components/pages/ManageCards/UpdateCardGroup";
import AddCardGroup from "./components/pages/ManageCards/AddCardGroup";
import DepartmentAddCardGroup from "./components/pages/ManageItems/DepartmentAddCardGroup";
import DepartmentCardGroup from "./components/pages/ManageItems/DepartmentCardGroup";
import DepartmentUpdateCardGroup from "./components/pages/ManageItems/DepartmentUpdateCardGroup";
import OpeningBalance from "./components/pages/OpeningBalance/OpeningBalance";
import AddOpeningBalance from "./components/pages/OpeningBalance/AddOpeningBalance";
import EditOpeningBalance from "./components/pages/OpeningBalance/EditOpeningBalance";
import BunkeringBalance from "./components/pages/BunkeringBalance/BunkeringBalance";
import EditBunkeringBalance from "./components/pages/BunkeringBalance/EditBunkeringBalance";
import AddBunkeringBalance from "./components/pages/BunkeringBalance/AddBunkeringBalance";
import SetFuelGrades from "./components/pages/ManageSite/SetFuelGrades";
import FuturePriceLogs from "./components/pages/Emaillogs/FuturePriceLogs";
import DashboardWetStock from "./components/Dashboard/DashboardWetStock/DashboardWetStock";
import DummyPage from "./components/pages/DummyPage/DummyPage";
import UpdateFuelPrices from "./components/pages/ManageFuelPrices/UpdateFuelPrices";
import DailyDue from "./components/pages/DailyDue/DailyDue";
import SubwayFacilityFees from "./components/pages/SubwayFacilityFees/SubwayFacilityFees";
import { NavigationProvider } from "./Utils/NavigationProvider";
import ManageLevels from "./components/pages/ManageLevels/ManageLevels";
import ManageAddEditLevel from "./components/pages/ManageLevels/ManageAddEditLevel";
import FuelSellingPricesSuggestion from "./components/pages/FuelSellingPricesSuggestion/FuelSellingPricesSuggestion";
import FuelSellingSuggestionLogs from "./components/pages/FuelSellingSuggestionLogs/FuelSellingSuggestionLogs";
import CeoDashSubChildBaseAPIS from "./components/Dashboard/CeoDashboardSubChild/CeoDashSubChildBaseAPIS";
import SiteBudget from "./components/pages/ManageSite/SiteBudget";
import TitanDashSubChild from "./components/TitanDashboard/TitanDashSubChild";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import PublicCompetitorPrice from "./components/pages/ManageFuelPrices/PublicCompetitorPrice";

import CompetitorFuelPricesVersionTwo from "./components/pages/ManageFuelPrices/CompetitorFuelPricesVersionTwo";
import FuelAutomation from "./components/pages/FuelAutomation/FuelAutomation";
import AddFuelAutomation from "./components/pages/FuelAutomation/AddFuelAutomation";
import EditFuelAutomation from "./components/pages/FuelAutomation/EditFuelAutomation";
import FuelSuggestionEmailLogs from "./components/pages/FuelSuggestionLogs/FuelSuggestionEmailLogs";
import FuelSuggestionActivityLogs from "./components/pages/FuelSuggestionLogs/FuelSuggestionActivityLogs";
import FuelSuggestionHistoryLog from "./components/pages/FuelSuggestionLogs/FuelSuggestionHistoryLog";
import ManageAddEditUser from "./components/pages/ManageUsers/ManageAddEditUser";
import AddEditUsers from "./components/pages/ManageUsers/AddEditUsers";
//App

const CardReconciliation = React.lazy(
  () => import("./components/CardReconciliation/CardReconciliation")
);
const CashReconciliation = React.lazy(
  () => import("./components/CardReconciliation/CashReconciliation")
);

const App = React.lazy(() => import("./components/app"));
const Custompages = React.lazy(() => import("./components/custompages"));

//Dashboard
const Dashboard = React.lazy(() => import("./components/Dashboard/Dashboard"));
const Exceptionallogs = React.lazy(
  () => import("./components/pages/FuelSellingPricesSuggestion/Exceptionallogs")
);
const CeoDashBoard = React.lazy(
  () => import("./components/Dashboard/CeoDashBoard")
);
const CeoDashBoardTest = React.lazy(
  () => import("./components/Dashboard/CeoDashBoardTest")
);
const TitanDashBoard = React.lazy(
  () => import("./components/TitanDashboard/TitanDashboard")
);
const CEOCompetitorView = React.lazy(
  () => import("./components/Dashboard/CEOCompitiorview")
);

const PriceGraphView = React.lazy(
  () => import("./components/Dashboard/PriceGraphView")
);
const EditProfile = React.lazy(
  () => import("./components/pages/EditProfile/EditProfile")
);
const ManageRoles = React.lazy(
  () => import("./components/pages/ManageRoles/ManageRoles")
);
const ManageCompany = React.lazy(
  () => import("./components/pages/ManageCompany/ManageCompany")
);
const AddRoles = React.lazy(
  () => import("./components/pages/ManageRoles/AddRoles")
);
// client Start
const ManageClient = React.lazy(
  () => import("./components/pages/ManageClient/ManageClient")
);
const EditClient = React.lazy(
  () => import("./components/pages/ManageClient/EditClient")
);
const AddClient = React.lazy(
  () => import("./components/pages/ManageClient/AddClient")
);
// client End
// User Start
const ManageUser = React.lazy(
  () => import("./components/pages/ManageUsers/ManageUsers")
);
const FAuthentiion = React.lazy(
  () => import("./components/pages/ManageUsers/2FAUser")
);
const EditUser = React.lazy(
  () => import("./components/pages/ManageUsers/EditUser")
);
const AddUser = React.lazy(
  () => import("./components/pages/ManageUsers/AddUser")
);
// User End

// User PPLRate
const ManagePPL = React.lazy(
  () => import("./components/pages/ManagePPLRate/ManagePPlRate")
);
const EditPPL = React.lazy(
  () => import("./components/pages/ManagePPLRate/EditPPLRate")
);
const AddPPL = React.lazy(
  () => import("./components/pages/ManagePPLRate/ManagePPlEAdd")
);
// User PPLRate
// Site Start
const Managesite = React.lazy(
  () => import("./components/pages/ManageSite/ManageSite")
);
const AddSite = React.lazy(
  () => import("./components/pages/ManageSite/AddSite")
);

const EditSite = React.lazy(
  () => import("./components/pages/ManageSite/EditSite")
);

// Site End

// Charges Start

const ManageCharges = React.lazy(
  () => import("./components/pages/ManageCharges/ManageCharges")
);

const AddCharges = React.lazy(
  () => import("./components/pages/ManageCharges/AddCharges")
);

const EditCharges = React.lazy(
  () => import("./components/pages/ManageCharges/EditCharges")
);

// Charges End

// Sage Start

const NominalActivityCodes = React.lazy(
  () => import("./components/pages/Sage/NominalActivityCodes")
);
const NominalTypes = React.lazy(
  () => import("./components/pages/Sage/NominalTypes")
);
const NominalTaxCode = React.lazy(
  () => import("./components/pages/Sage/NominalTaxCode")
);
const MapDepartmentitems = React.lazy(
  () => import("./components/pages/Sage/MapDepartmentItems")
);
const SageCharges = React.lazy(
  () => import("./components/pages/Sage/ManageSageCharges")
);
const SageDeduction = React.lazy(
  () => import("./components/pages/Sage/SageDeduction")
);
const SageCards = React.lazy(() => import("./components/pages/Sage/SageCards"));
const Sagebanking = React.lazy(
  () => import("./components/pages/Sage/SageBanking")
);

// Sage End

// Shops Start

const ManageShops = React.lazy(
  () => import("./components/pages/ManageShops/ManageShops")
);

const AddShops = React.lazy(
  () => import("./components/pages/ManageShops/AddShops")
);

const EditShops = React.lazy(
  () => import("./components/pages/ManageShops/EditShops")
);

// Shops End

// Cards Start

const ManageCards = React.lazy(
  () => import("./components/pages/ManageCards/ManageCards")
);

const AddCards = React.lazy(
  () => import("./components/pages/ManageCards/AddCards")
);

const EditCards = React.lazy(
  () => import("./components/pages/ManageCards/EditCards")
);
const CardGroup = React.lazy(
  () => import("./components/pages/ManageCards/CardGroup")
);

// Cards End

// Deductions Start

const ManageDeductions = React.lazy(
  () => import("./components/pages/ManageDeductions/ManageDeductions")
);

const AddDeductions = React.lazy(
  () => import("./components/pages/ManageDeductions/AddDeductions")
);

const EditDeductions = React.lazy(
  () => import("./components/pages/ManageDeductions/EditDeductions")
);

// Deductions End

// Suppliers Start

const ManageSuppliers = React.lazy(
  () => import("./components/pages/ManageSuppliers/ManageSuppliers")
);

const AddSuppliers = React.lazy(
  () => import("./components/pages/ManageSuppliers/AddSuppliers")
);

const EditSuppliers = React.lazy(
  () => import("./components/pages/ManageSuppliers/EditSuppliers")
);

// Suppliers End

// Manneger Start

const Assignmanneger = React.lazy(
  () => import("./components/pages/AssignManneger/Assignmanneger")
);
const AddManneger = React.lazy(
  () => import("./components/pages/AssignManneger/Addmanneger")
);
const EditManneger = React.lazy(
  () => import("./components/pages/AssignManneger/EditManager")
);
const AutoDayEnd = React.lazy(
  () => import("./components/pages/AutoDayEnd/AutoDayEnd")
);
const AddAutoDayEnd = React.lazy(
  () => import("./components/pages/AutoDayEnd/AddAutoDayEnd")
);
const EditAutoDayEnd = React.lazy(
  () => import("./components/pages/AutoDayEnd/EditAutoDayEnd")
);

const CompanyAutoReport = React.lazy(
  () => import("./components/pages/CompanyAutoReport/CompanyAutoReport")
);
const AddCompanyAutoReport = React.lazy(
  () => import("./components/pages/CompanyAutoReport/AddCompanyAutoReport")
);
const EditCompanyAutoReport = React.lazy(
  () => import("./components/pages/CompanyAutoReport/EditCompanyAutoReport")
);

// const AddSuppliers = React.lazy(() =>
//   import("./components/pages/ManageSuppliers/AddSuppliers")
// );

// const EditSuppliers = React.lazy(() =>
//   import("./components/pages/ManageSuppliers/EditSuppliers")
// );

// Suppliers End

// Pump Start

const ManageSitePump = React.lazy(
  () => import("./components/pages/ManageSitePump/ManageSitePump")
);

const AddSitePump = React.lazy(
  () => import("./components/pages/ManageSitePump/AddSitePump")
);

const EditSitePump = React.lazy(
  () => import("./components/pages/ManageSitePump/EditSitePump")
);
// Pump End

// SiteTank Start

const ManageSiteTank = React.lazy(
  () => import("./components/pages/ManageSiteTank/ManageSiteTank")
);

const AddSiteTank = React.lazy(
  () => import("./components/pages/ManageSiteTank/AddSiteTank")
);

const EditSiteTank = React.lazy(
  () => import("./components/pages/ManageSiteTank/EditSiteTank")
);

// SiteTank End

// SiteNozzle Start

const ManageSiteNozzle = React.lazy(
  () => import("./components/pages/ManageSiteNozzle/ManageSiteNozzle")
);

const AddSiteNozzle = React.lazy(
  () => import("./components/pages/ManageSiteNozzle/AddSiteNozzle")
);

const EditSiteNozzle = React.lazy(
  () => import("./components/pages/ManageSiteNozzle/EditSiteNozzle")
);

// SiteNozzle End
// Items Start

const ManageItems = React.lazy(
  () => import("./components/pages/ManageItems/ManageItems")
);

const AddItems = React.lazy(
  () => import("./components/pages/ManageItems/AddItems")
);

const EditItems = React.lazy(
  () => import("./components/pages/ManageItems/EditItems")
);

// Category Start

const ManageBusinessCategory = React.lazy(
  () => import("./components/pages/ManageCategory/ManageBusinessCategory")
);

const ManageSubBusinessCategory = React.lazy(
  () => import("./components/pages/ManageCategory/ManageSubBusinessCategory")
);

const AddBusinessCategory = React.lazy(
  () => import("./components/pages/ManageCategory/AddBusinessCategory")
);
const AddSubBusinessCategory = React.lazy(
  () => import("./components/pages/ManageCategory/AddSubBusinessCategory")
);

const EditBusinessCategory = React.lazy(
  () => import("./components/pages/ManageCategory/EditBusinessCategory")
);

const EditSubBusinessCategory = React.lazy(
  () => import("./components/pages/ManageCategory/EditSubBusinessCategory")
);
// Category End

// DSR Start

const ManageDsr = React.lazy(
  () => import("./components/pages/ManageDSR/ManageDsr")
);
const ManageDsrList = React.lazy(
  () => import("./components/pages/ManageDSR/DsrList")
);
const ManageDsrCrons = React.lazy(
  () => import("./components/pages/ManageDSR/DsrCrons")
);

// DSR End
// commisons Start

const Managecommission = React.lazy(
  () => import("./components/pages/ManageComisions/ManageComision")
);
const valetcommission = React.lazy(
  () => import("./components/pages/ManageComisions/ValetCommission")
);
const Assignaddon = React.lazy(
  () => import("./components/pages/AddonList/AddonList")
);
const ShopRevenueCommission = React.lazy(
  () => import("./components/pages/ShopRevenueCommission/ShopRevenueCommission")
);
const Assignreport = React.lazy(
  () => import("./components/pages/AssignReports/AssignReports")
);
const AssignUseraddon = React.lazy(
  () => import("./components/pages/AddonList/UserAddon")
);

// DSR End
// Reports Start

const ManageReports = React.lazy(
  () => import("./components/pages/Reports/ManageReports")
);

// Reports End
// SiteSettings Start

const SiteSettings = React.lazy(
  () => import("./components/pages/SiteSetting/SiteSettings")
);
const Assignbusiness = React.lazy(
  () =>
    import("./components/pages/AssignBusinessSubCategories/Assignbusinessubcat")
);
const AddAssignbusiness = React.lazy(
  () =>
    import(
      "./components/pages/AssignBusinessSubCategories/AddAssignbusinessubcat"
    )
);
const EditAssignbusiness = React.lazy(
  () =>
    import(
      "./components/pages/AssignBusinessSubCategories/EditAssignbusinessubcat"
    )
);

const HideBusinessCategories = React.lazy(
  () =>
    import("./components/pages/HideBusinessCategories/HideBusinessCategories")
);
const AddHideBusinessCategories = React.lazy(
  () =>
    import(
      "./components/pages/HideBusinessCategories/AddHideBusinessCategories"
    )
);
const EditAddHideBusinessCategories = React.lazy(
  () =>
    import(
      "./components/pages/HideBusinessCategories/EditHideBusinessCategories"
    )
);

const Tolerances = React.lazy(
  () => import("./components/pages/SiteSetting/Tolerances")
);

// SiteSettings End
// Other Start

const WorkFlows = React.lazy(
  () => import("./components/pages/Others/WorkFlow")
);

// Other End
const SkipDates = React.lazy(
  () => import("./components/pages/SkipDates/SkipDateList")
);
const FUELPRICE = React.lazy(
  () => import("./components/pages/ManageFuelPrices/FuelPrices")
);
const CompetitorFuelPrices = React.lazy(
  () => import("./components/pages/ManageFuelPrices/competitorfuelprices")
);
const EditCompetitorFuelPrices = React.lazy(
  () => import("./components/pages/Competitor/EditCompetitor")
);
const FuelPurchasePrices = React.lazy(
  () => import("./components/pages/ManageFuelPrices/FuelPurchasePrices")
);
const AddFuelPurchasePrices = React.lazy(
  () => import("./components/pages/ManageFuelPrices/AddFuelPurchase")
);
const ManageBusinessTypes = React.lazy(
  () => import("./components/pages/ManageBusinessTypes/ManageBusinessTypes")
);
const ManageBusinessSubTypes = React.lazy(
  () => import("./components/pages/ManageSubBussiness/ManageSubBussiness")
);
const AddBusinessSubTypes = React.lazy(
  () => import("./components/pages/ManageSubBussiness/AddSubBussiness")
);
const EditBusinessSubTypes = React.lazy(
  () => import("./components/pages/ManageSubBussiness/EditSubBussiness")
);
const AddBusiness = React.lazy(
  () => import("./components/pages/ManageBusinessTypes/AddBusiness")
);
const ManageAddon = React.lazy(
  () => import("./components/pages/ManageAddon/ManageAddon")
);
const EditAddon = React.lazy(
  () => import("./components/pages/ManageAddon/EditAddon")
);
const AddAddon = React.lazy(
  () => import("./components/pages/ManageAddon/AddAddon")
);

const AddCompany = React.lazy(
  () => import("./components/pages/ManageCompany/AddCompany")
);

const EditRoles = React.lazy(
  () => import("./components/pages/ManageRoles/EditRoles")
);

const EditCompany = React.lazy(
  () => import("./components/pages/ManageCompany/EditCompany")
);

const CompanySageFuels = React.lazy(
  () => import("./components/pages/ManageCompany/CompanySageFuels")
);
const CompanySageitesms = React.lazy(
  () => import("./components/pages/ManageCompany/SageItems")
);

const CompanySageOtherCodes = React.lazy(
  () => import("./components/pages/ManageCompany/CompanySageOtherCodes")
);
const EditBusiness = React.lazy(
  () => import("./components/pages/ManageBusinessTypes/EditBussinesType")
);

const Settings = React.lazy(
  () => import("./components/pages/Settings/Settings")
);
const Emaillogs = React.lazy(
  () => import("./components/pages/Emaillogs/Emaillogs")
);
const Activitylogs = React.lazy(
  () => import("./components/pages/Emaillogs/ActivityLogs")
);
const FuelPriceslogs = React.lazy(
  () => import("./components/pages/Emaillogs/FuelPriceLogs")
);
const DailyFacilityFees = React.lazy(
  () => import("./components/pages/DailyFacilityFees/DailyFacilityFees")
);

const FAQS = React.lazy(() => import("./components/pages/FAQS/FAQS"));
const Sitecardopening = React.lazy(
  () => import("./components/pages/ManageSite/SiteCardOpening")
);
const SiteCardAdjustment = React.lazy(
  () => import("./components/pages/ManageSite/SiteCardAdjustment")
);

//custom Pages
const Login = React.lazy(() => import("./components/CustomPages/Login/Login"));
const ResetPassword = React.lazy(
  () => import("./components/CustomPages/ResetPassword/ResetPassword")
);
const Register = React.lazy(
  () => import("./components/CustomPages/Register/Register")
);
const ForgotPassword = React.lazy(
  () => import("./components/CustomPages/ForgotPassword/ForgotPassword")
);

//Errorpages
const Errorpage400 = React.lazy(
  () => import("./components/ErrorPages/ErrorPages/400/400")
);
const UnderConstruction = React.lazy(
  () => import("./components/ErrorPages/ErrorPages/UnderConstruction")
);
const Errorpage401 = React.lazy(
  () => import("./components/ErrorPages/ErrorPages/401/401")
);
const Errorpage403 = React.lazy(
  () => import("./components/ErrorPages/ErrorPages/403/403")
);
const Errorpage500 = React.lazy(
  () => import("./components/ErrorPages/ErrorPages/500/500")
);
const Errorpage503 = React.lazy(
  () => import("./components/ErrorPages/ErrorPages/503/503")
);
const COMINGSOON = React.lazy(
  () => import("./components/ErrorPages/ErrorPages/Soon/Comingsoon")
);
const manageNotification = React.lazy(
  () => import("./layouts/Header/Notifications")
);
const managesms = React.lazy(
  () => import("./components/pages/ManageSmS/managesms")
);
const setuppayroll = React.lazy(
  () => import("./components/pages/ManageClient/SetupPayroll")
);
const canvaseditor = React.lazy(() => import("./components/pages/Canvas"));

const Root = () => {
  const store = configureStore({
    reducer: {
      data: dataReducer,
    },
  });
  const [token] = useState(localStorage.getItem("token"));
  const WrappedTitanDashSubChild = withApi(TitanDashSubChild);
  const WrappedDashboard = withApi(Dashboard);
  const WrappedCeoDashBoard = withApi(CeoDashBoard);
  const WrappedCeoDashBoardTest = withApi(CeoDashBoardTest);
  const Wrappedcanvaseditor = withApi(canvaseditor);
  const WrappedManageBusinessSubTypes = withApi(ManageBusinessSubTypes);
  const WrappeAddBusinessSubTypes = withApi(AddBusinessSubTypes);
  const WrappedManageClient = withApi(ManageClient);
  const WrappedAddClient = withApi(AddClient);
  const WrappeAddEditClient = withApi(EditClient);
  const WrappedManageUser = withApi(ManageUser);
  const Wrapped2FAuthentiion = withApi(FAuthentiion);
  const WrappedAddUser = withApi(AddUser);
  const WrappedManageAddEditUser = withApi(ManageAddEditUser);
  const WrappeAddEditUser = withApi(EditUser);
  const WrappedAddSite = withApi(AddSite);
  const WrappedSitecardopening = withApi(Sitecardopening);
  const WrappedSiteCardAdjustment = withApi(SiteCardAdjustment);
  const WrappeAddEditSite = withApi(EditSite);
  const WrappedManageCompany = withApi(ManageCompany);
  const WrappedAddCompany = withApi(AddCompany);
  const WrappeAddEditCompany = withApi(EditCompany);
  const WrappedCompanySageFuels = withApi(CompanySageFuels);
  const WrappedCompanySageitesms = withApi(CompanySageitesms);
  const WrappedCompanySageOtherCodes = withApi(CompanySageOtherCodes);
  const WrappedManageRoles = withApi(ManageRoles);
  const WrappedAddRoles = withApi(AddRoles);
  const WrappeAddEditRoles = withApi(EditRoles);
  const WrappedManageAddon = withApi(ManageAddon);
  const WrappedAddAddon = withApi(AddAddon);
  const WrappeAddEditAddon = withApi(EditAddon);
  const WrappeCEOCompetitorView = withApi(CEOCompetitorView);
  // const WrappeHeader = withApi(Header);
  const WrappedManageCharges = withApi(ManageCharges);
  const WrappedAddCharges = withApi(AddCharges);
  const WrappedEditCharges = withApi(EditCharges);
  const WrappedManageShops = withApi(ManageShops);
  const WrappedAddShops = withApi(AddShops);
  const WrappedSiteEvobossStatus = withApi(SiteEvobossStatus);
  const WrappedSiteEvobossStatusPage = withApi(SiteEvobossStatusPage);
  const WrappedEditShops = withApi(EditShops);
  const WrappedManageCards = withApi(ManageCards);
  const WrappedAddCards = withApi(AddCards);
  const WrappedEditCards = withApi(EditCards);
  const WrappedCardGroup = withApi(CardGroup);
  const WrappedDepartmentCardGroup = withApi(DepartmentCardGroup);
  const WrappedUpdateCardGroup = withApi(UpdateCardGroup);
  const WrappedDepartmentUpdateCardGroup = withApi(DepartmentUpdateCardGroup);
  const WrappedAddCardGroup = withApi(AddCardGroup);
  const WrappedDepartmentAddCardGroup = withApi(DepartmentAddCardGroup);
  const WrappedManageDeductions = withApi(ManageDeductions);
  const WrappedAddDeductions = withApi(AddDeductions);
  const WrappedEditDeductions = withApi(EditDeductions);
  const WrappedManageSuppliers = withApi(ManageSuppliers);
  const WrappedAddSuppliers = withApi(AddSuppliers);
  const WrappedEditSuppliers = withApi(EditSuppliers);

  const WrappedManageBusinessCategory = withApi(ManageBusinessCategory);
  const WrappedManageSubBusinessCategory = withApi(ManageSubBusinessCategory);
  const WrappedAddBusinessCategory = withApi(AddBusinessCategory);
  const WrappedEditBusinessCategory = withApi(EditBusinessCategory);
  const WrappedAddSubBusinessCategory = withApi(AddSubBusinessCategory);
  const WrappedEditSubBusinessCategory = withApi(EditSubBusinessCategory);

  const WrappedManageDsr = withApi(ManageDsr);
  const WrappedManageManageDsrList = withApi(ManageDsrList);
  const WrappedManageManageDsrCrons = withApi(ManageDsrCrons);
  const WrappedManageReports = withApi(ManageReports);
  const WrappedWorkFlows = withApi(WorkFlows);
  const WrappedSiteSettings = withApi(SiteSettings);
  const WrappedSetFuelGrades = withApi(SetFuelGrades);
  const Wrappedassignbusiness = withApi(Assignbusiness);
  const WrappedAddAssignbusiness = withApi(AddAssignbusiness);
  const WrappedEditAssignbusiness = withApi(EditAssignbusiness);
  const WrappedHideBusinessCategories = withApi(HideBusinessCategories);
  const WrappedAddHideBusinessCategoriess = withApi(AddHideBusinessCategories);
  const WrappedEditAddHideBusinessCategories = withApi(
    EditAddHideBusinessCategories
  );
  const WrappedTolerances = withApi(Tolerances);

  const WrappedManageSitePump = withApi(ManageSitePump);
  const WrappedAddSitePump = withApi(AddSitePump);
  const WrappedEditSitePump = withApi(EditSitePump);

  const WrappedManageSiteTank = withApi(ManageSiteTank);
  const WrappedAddSiteTank = withApi(AddSiteTank);
  const WrappedEditSiteTank = withApi(EditSiteTank);

  const WrappedManageSiteNozzle = withApi(ManageSiteNozzle);
  const WrappedAddSiteNozzle = withApi(AddSiteNozzle);
  const WrappedEditSiteNozzle = withApi(EditSiteNozzle);

  const WrappedManageItems = withApi(ManageItems);
  const WrappedAddItems = withApi(AddItems);
  const WrappedEditItems = withApi(EditItems);

  const WrappedFUELPRICE = withApi(FUELPRICE);
  const WrappedUpdateFuelPrices = withApi(UpdateFuelPrices);
  const WrappedFuelPurchasePrices = withApi(FuelPurchasePrices);
  const WrappedAddFuelPurchase = withApi(AddFuelPurchasePrices);
  const WrappedAssignmanneger = withApi(Assignmanneger);
  const WrappedAddManneger = withApi(AddManneger);
  const WrappedEditManneger = withApi(EditManneger);
  const WrappedAddAutoDayEnd = withApi(AddAutoDayEnd);
  const WrappedAutoDayEnd = withApi(AutoDayEnd);
  const WrappedEditAutoDayEnd = withApi(EditAutoDayEnd);
  const WrappedAddCompanyAutoReport = withApi(AddCompanyAutoReport);
  const WrappedCompanyAutoReport = withApi(CompanyAutoReport);
  const WrappedEditCompanyAutoReport = withApi(EditCompanyAutoReport);
  const WrappedManagecommission = withApi(Managecommission);
  const Wrappedvaletcommission = withApi(valetcommission);
  const WrappedAssignaddon = withApi(Assignaddon);
  const WrappedAssignreport = withApi(Assignreport);
  const WrappedAssignUseraddon = withApi(AssignUseraddon);
  const WrappedAssignManagePPL = withApi(ManagePPL);
  const WrappedAssignEditPPL = withApi(EditPPL);
  const WrappedAssignAddPPL = withApi(AddPPL);
  const WrappedDailyFacilityFees = withApi(DailyFacilityFees);
  const WrappedSubwayFacilityFees = withApi(SubwayFacilityFees);
  const WrappedDashBoardChild = withApi(DashBoardChild);
  const WrappedCeoDashBoardChild = withApi(CeoDashBoardChild);
  const WrappedTitanDashboardChild = withApi(TitanDashboardChild);
  const WrappedDashBoardSubChild = withApi(DashSubChild);
  const WrappedDashBoardSiteDetail = withApi(DashSubChildBaseAPIS);
  const WrappedCeoDashBoardSiteDetail = withApi(CeoDashSubChildBaseAPIS);
  const WrappedEmaillogs = withApi(Emaillogs);
  const WrappedFuelSuggestionEmailLogs = withApi(FuelSuggestionEmailLogs);
  const WrappedFuelPriceslogs = withApi(FuelPriceslogs);
  const WrappedFuturePricelogs = withApi(FuturePriceLogs);
  const WrappedCompetitorFuelPrices = withApi(CompetitorFuelPrices);
  const WrappedCompetitorFuelPricesVersionTwo = withApi(
    CompetitorFuelPricesVersionTwo
  );
  const WrappedCompetitor = withApi(Competitor);
  const WrappedAddCompetitor = withApi(AddCompetitor);
  const WrappedStatsCompetitor = withApi(StatsCompetitor);
  const WrappedSingleStatsCompetitor = withApi(SingleStatsCompetitor);

  const WrappeduploadCompetitor = withApi(uploadCompetitor);
  const WrappedManageBank = withApi(ManageBank);
  const WrappedAddBank = withApi(AddBank);
  const WrappedAddFuelAutomation = withApi(AddFuelAutomation);
  const WrappedEditFuelAutomation = withApi(EditFuelAutomation);
  const WrappedFuelAutomation = withApi(FuelAutomation);
  const WrappedEditBankManneger = withApi(EditBank);

  const WrappedOpeningBalance = withApi(OpeningBalance);
  const WrappedAddOpeningBalance = withApi(AddOpeningBalance);

  const WrappedEditOpeningBalance = withApi(EditOpeningBalance);
  const WrappedBunkeringBalance = withApi(BunkeringBalance);
  const WrappedAddBunkeringBalance = withApi(AddBunkeringBalance);
  const WrappedEditBunkeringBalance = withApi(EditBunkeringBalance);
  const WrappedmanageNotification = withApi(manageNotification);
  const WrappedEditCompetitorFuelPrices = withApi(EditCompetitorFuelPrices);
  const Wrappedsetuppayroll = withApi(setuppayroll);
  const WrappedSkipDates = withApi(SkipDates);
  const WrappedCronModule = withApi(CronModule);
  const WrappedNominalActivityCodes = withApi(NominalActivityCodes);
  const WrappedNominalMapDepartmentitems = withApi(MapDepartmentitems);
  const WrappedNominalSageCharges = withApi(SageCharges);
  const WrappedNominalSageDeduction = withApi(SageDeduction);
  const WrappedNominalSageCards = withApi(SageCards);
  const WrappedNominalSagebanking = withApi(Sagebanking);
  const WrappedNominalTypes = withApi(NominalTypes);
  const WrappedNominalTaxCode = withApi(NominalTaxCode);
  const WrappedActivitylogs = withApi(Activitylogs);
  const WrappedFuelSuggestionActivityLogs = withApi(FuelSuggestionActivityLogs);
  const WrappedFuelSuggestionHistoryLog = withApi(FuelSuggestionHistoryLog);
  const Wrappedmanagesms = withApi(managesms);
  const WrappedShopRevenueCommission = withApi(ShopRevenueCommission);
  const WrappedDashboardWetStock = withApi(DashboardWetStock);
  const WrappedDailyDue = withApi(DailyDue);
  const WrappedManageLevels = withApi(ManageLevels);
  const WrappedManageAddLevel = withApi(ManageAddEditLevel);
  const WrappedFuelSellingPricesSuggestion = withApi(
    FuelSellingPricesSuggestion
  );
  const WrappedFuelSellingSuggestionLogs = withApi(FuelSellingSuggestionLogs);
  const WrappedCashReconciliation = withApi(CashReconciliation);
  const WrappedCardReconciliation = withApi(CardReconciliation);
  return (
    <>
      <BrowserRouter>
        <React.Suspense fallback={<Loaderimg />}>
          <Provider store={store}>
            <NavigationProvider>
              <Routes>
                <Route element={<PrivateRoutes token={token} />}>
                  <Route path={`/`} element={<App />}>
                    <Route index={true} element={<Dashboard />} />

                    <Route path={`/dashboard`} element={<WrappedDashboard />} />
                    <Route
                      path={`/card-reconciliation`}
                      element={<WrappedCardReconciliation />}
                    />
                    <Route
                      path={`/cash-reconciliation`}
                      element={<WrappedCashReconciliation />}
                    />
                    <Route
                      path={`/competitor-view`}
                      element={<WrappeCEOCompetitorView />}
                    />
                    <Route
                      path={`/pricegraph-view`}
                      element={<PriceGraphView />}
                    />
                    <Route path={`/site-budget/:id`} element={<SiteBudget />} />
                    <Route
                      path={`/ceodashboard-test`}
                      element={<WrappedCeoDashBoard />}
                    />
                    <Route
                      path={`/ceodashboard`}
                      element={<WrappedCeoDashBoardTest />}
                    />
                    <Route
                      path={`/titandashboard-details/:id`}
                      element={<WrappedTitanDashSubChild />}
                    />
                    <Route
                      path={`/titandashboard`}
                      element={<TitanDashBoard />}
                    />
                    {/* client  Components Start */}
                    <Route
                      path={`/clients`}
                      element={<WrappedManageClient />}
                    />
                    <Route
                      path={`editclient/:id`}
                      element={<WrappeAddEditClient />}
                    />
                    <Route path={`addclient`} element={<WrappedAddClient />} />
                    <Route
                      path={`/wet-stock-dashboard/`}
                      element={<WrappedDashboardWetStock />}
                    />

                    {/* client  Components End */}

                    {/* User  Components Start */}
                    <Route path={`/users`} element={<WrappedManageUser />} />
                    <Route
                      path={`/2FA-authentication`}
                      element={<Wrapped2FAuthentiion />}
                    />
                    <Route
                      path={`/editusers/:id`}
                      element={<WrappeAddEditUser />}
                    />
                    <Route
                      path={`/daily-due/:id`}
                      element={<WrappedDailyDue />}
                    />
                    <Route
                      path={`/manage-levels`}
                      element={<WrappedManageLevels />}
                    />
                    <Route
                      path={`/manage-levels/add-level`}
                      element={<WrappedManageAddLevel />}
                    />
                    <Route
                      path={`/manage-levels/edit-level/:id`}
                      element={<WrappedManageAddLevel />}
                    />

                    <Route path={`addusers`} element={<WrappedAddUser />} />

                    <Route
                      path={`add-edit-user`}
                      element={<WrappedManageAddEditUser />}
                    />
                    <Route path={`add-user`} element={<AddEditUsers />} />
                    <Route path={`edit-user/:id`} element={<AddEditUsers />} />

                    <Route
                      path={`/competitor`}
                      element={<WrappedCompetitor />}
                    />
                    <Route
                      path={`/fuel-selling-price-logs`}
                      element={<WrappedFuelSellingSuggestionLogs />}
                    />
                    <Route
                      path={`/fuel-price-exceptional-logs`}
                      element={<Exceptionallogs />}
                    />
                    <Route
                      path={`/addCompetitor`}
                      element={<WrappedAddCompetitor />}
                    />
                    <Route
                      path={`/competitorstats`}
                      element={<WrappedStatsCompetitor />}
                    />
                    <Route
                      path={`/sitecompetitor/:id`}
                      element={<WrappedSingleStatsCompetitor />}
                    />
                    <Route
                      path={`/uploadCompetitor-price`}
                      element={<WrappeduploadCompetitor />}
                    />

                    {/* User  Components End */}

                    {/* sites  Components Start */}

                    <Route path={`addsite`} element={<WrappedAddSite />} />
                    <Route
                      path={`editsite/:id`}
                      element={<WrappeAddEditSite />}
                    />
                    <Route
                      path={`site-card-opening/:id`}
                      element={<WrappedSitecardopening />}
                    />
                    <Route
                      path={`site-card-adjustment/:id`}
                      element={<WrappedSiteCardAdjustment />}
                    />
                    <Route
                      path={`/site-setting/:id`}
                      element={<WrappedSiteSettings />}
                    />
                    <Route
                      path={`/set-fuel-grades/:id`}
                      element={<WrappedSetFuelGrades />}
                    />
                    <Route
                      path={`/assign-business-sub-categories/:id`}
                      element={<Wrappedassignbusiness />}
                    />
                    <Route
                      path={`/addassign-business-sub-categories/:siteName/:id`}
                      element={<WrappedAddAssignbusiness />}
                    />
                    <Route
                      path={`/editassign-business-sub-categories/:id`}
                      element={<WrappedEditAssignbusiness />}
                    />
                    <Route
                      path={`/hide-business-categories/:id`}
                      element={<WrappedHideBusinessCategories />}
                    />
                    <Route
                      path={`/addhide-business-categories/:siteName/:id`}
                      element={<WrappedAddHideBusinessCategoriess />}
                    />
                    <Route
                      path={`/edithide-business-categories/:id`}
                      element={<WrappedEditAddHideBusinessCategories />}
                    />

                    <Route path={`/sites`} element={<Managesite />} />

                    <Route
                      path={`/managebank/:id`}
                      element={<WrappedManageBank />}
                    />

                    <Route
                      path={`/addbank/:siteName/:id`}
                      element={<WrappedAddBank />}
                    />

                    <Route
                      path={`/editbankmanager/:id`}
                      element={<WrappedEditBankManneger />}
                    />

                    <Route
                      path={`/manage-fuel-automation/`}
                      element={<WrappedFuelAutomation />}
                    />

                    <Route
                      path={`/add-fuel-automation/:id`}
                      element={<WrappedAddFuelAutomation />}
                    />
                    <Route
                      path={`/edit-fuel-automation/:id`}
                      element={<WrappedEditFuelAutomation />}
                    />

                    <Route
                      path={`/opening-balance/:id`}
                      element={<WrappedOpeningBalance />}
                    />
                    <Route
                      path={`/add-opening-balance/:siteName/:id`}
                      element={<WrappedAddOpeningBalance />}
                    />
                    <Route
                      path={`/edit-opening-balance/:id`}
                      element={<WrappedEditOpeningBalance />}
                    />
                    <Route
                      path={`/bunkering-balance/:id`}
                      element={<WrappedBunkeringBalance />}
                    />
                    <Route
                      path={`/add-bunkering-balance/:siteName/:id`}
                      element={<WrappedAddBunkeringBalance />}
                    />
                    <Route
                      path={`/edit-bunkering-balance/:id`}
                      element={<WrappedEditBunkeringBalance />}
                    />
                    <Route
                      path={`/dailyfacilityfees`}
                      element={<WrappedDailyFacilityFees />}
                    />
                    <Route
                      path={`/subway-facility-fees`}
                      element={<WrappedSubwayFacilityFees />}
                    />
                    {/* sites  Components End */}

                    {/* Company  Components Start */}
                    <Route
                      path={`/addcompany`}
                      element={<WrappedAddCompany />}
                    />
                    <Route
                      path={`/managecompany`}
                      element={<WrappedManageCompany />}
                    />
                    <Route
                      path={`/editcompany`}
                      element={<WrappeAddEditCompany />}
                    />

                    <Route
                      path={`/company/sage-fuels/:id`}
                      element={<WrappedCompanySageFuels />}
                    />
                    <Route
                      path={`/company/sage-items/:id`}
                      element={<WrappedCompanySageitesms />}
                    />

                    <Route
                      path={`/company/sage-other-codes/:id`}
                      element={<WrappedCompanySageOtherCodes />}
                    />

                    {/* Company  Components End */}

                    {/* Role  Components Start */}
                    <Route path={`/roles`} element={<WrappedManageRoles />} />
                    <Route path={`/addrole`} element={<WrappedAddRoles />} />

                    <Route
                      path={`/editrole/:id`}
                      element={<WrappeAddEditRoles />}
                    />

                    {/* Role  Components End */}
                    <Route
                      path={`/assignclientaddon/:id`}
                      element={<WrappedAssignaddon />}
                    />
                    <Route
                      path={`/assignreport/:id`}
                      element={<WrappedAssignreport />}
                    />
                    <Route
                      path={`/assigusernaddon/:id`}
                      element={<WrappedAssignUseraddon />}
                    />
                    {/* Role  Components Start */}

                    <Route
                      path={`/assignmanger/:id`}
                      element={<WrappedAssignmanneger />}
                    />
                    <Route
                      path={`/addmanager/:siteName/:id`}
                      element={<WrappedAddManneger />}
                    />
                    <Route
                      path={`/editmanager/:id`}
                      element={<WrappedEditManneger />}
                    />
                    <Route
                      path={`/autodayend/:id`}
                      element={<WrappedAutoDayEnd />}
                    />
                    <Route
                      path={`/addautodayend/:siteName/:id`}
                      element={<WrappedAddAutoDayEnd />}
                    />
                    <Route
                      path={`/editautodayend/:id`}
                      element={<WrappedEditAutoDayEnd />}
                    />
                    <Route
                      path={`/companyautoreport/:id`}
                      element={<WrappedCompanyAutoReport />}
                    />
                    <Route
                      path={`/addcompanyautoreport/:siteName/:id`}
                      element={<WrappedAddCompanyAutoReport />}
                    />
                    <Route
                      path={`/editcompanyautoreport/:id`}
                      element={<WrappedEditCompanyAutoReport />}
                    />

                    {/* Role  Components End */}

                    {/* Addon  Components Start */}
                    <Route
                      path={`/manageaddon`}
                      element={<WrappedManageAddon />}
                    />

                    <Route path={`/addaddon`} element={<WrappedAddAddon />} />
                    <Route
                      path={`EditAddon/:id`}
                      element={<WrappeAddEditAddon />}
                    />

                    {/* Addon  Components End */}
                    <Route
                      path={`/email-logs`}
                      element={<WrappedEmaillogs />}
                    />
                    <Route
                      path={`/fuel-suggestion-email-logs`}
                      element={<WrappedFuelSuggestionEmailLogs />}
                    />
                    <Route
                      path={`/fuel-price-logs`}
                      element={<WrappedFuelPriceslogs />}
                    />
                    <Route
                      path={`/future-price-logs`}
                      element={<WrappedFuturePricelogs />}
                    />
                    <Route
                      path={`/activity-logs`}
                      element={<WrappedActivitylogs />}
                    />
                    <Route
                      path={`/fuel-suggestion-activity-logs`}
                      element={<WrappedFuelSuggestionActivityLogs />}
                    />
                    <Route
                      path={`/fuel-suggestion-history-logs`}
                      element={<WrappedFuelSuggestionHistoryLog />}
                    />
                    {/* Header  Components Start */}
                    {/* <Route
                    path={`/advancedElements/headers`}
                    element={<WrappeHeader />}
                  /> */}
                    {/* Header  Components End */}
                    {/* Header  Components Start */}
                    <Route
                      path={`/Managecommission`}
                      element={<WrappedManagecommission />}
                    />
                    <Route
                      path={`/Managecommission`}
                      element={<WrappedManagecommission />}
                    />
                    <Route
                      path={`/valetcommission`}
                      element={<Wrappedvaletcommission />}
                    />
                    {/* Header  Components End */}

                    {/* DSR  Components Start */}
                    <Route
                      path={`/data-entry`}
                      element={<WrappedManageDsr />}
                    />
                    <Route
                      path={`/dsr-exception`}
                      element={<WrappedManageManageDsrList />}
                    />
                    <Route
                      path={`/drs-api-logs`}
                      element={<WrappedManageManageDsrCrons />}
                    />
                    {/* DSR  Components End */}

                    {/* Others  Components Start */}
                    <Route path={`/workflows`} element={<WrappedWorkFlows />} />
                    {/* Others  Components End */}

                    {/* Reports  Components Start */}
                    <Route
                      path={`/reports`}
                      element={<WrappedManageReports />}
                    />
                    {/* Reports  Components End */}
                    {/* Reports  Components Start */}

                    <Route
                      path={`/tolerances`}
                      element={<WrappedTolerances />}
                    />
                    {/* Reports  Components End */}
                    {/* Charges  Components Start  */}
                    <Route
                      path={`/managecharges`}
                      element={<WrappedManageCharges />}
                    />

                    <Route
                      path={`/addcharges`}
                      element={<WrappedAddCharges />}
                    />
                    <Route
                      path={`/editcharges/:id`}
                      element={<WrappedEditCharges />}
                    />

                    {/* Charges  Components End  */}

                    {/* Shops components start */}

                    <Route
                      path={`/manageshops`}
                      element={<WrappedManageShops />}
                    />

                    <Route path={`/addshops`} element={<WrappedAddShops />} />
                    <Route
                      path={`/site-evobos-status`}
                      element={<WrappedSiteEvobossStatus />}
                    />
                    <Route
                      path="/site-evobos-status/:siteName"
                      element={<WrappedSiteEvobossStatusPage />}
                    />

                    <Route
                      path={`/editshops/:id`}
                      element={<WrappedEditShops />}
                    />

                    {/* Shops components end */}

                    {/* Cards components start */}

                    <Route
                      path={`/managecards`}
                      element={<WrappedManageCards />}
                    />
                    <Route path={`/editor`} element={<Wrappedcanvaseditor />} />
                    <Route
                      path={`/fuel-selling-prices-suggestion`}
                      element={<WrappedFuelSellingPricesSuggestion />}
                    />

                    <Route path={`/addcards`} element={<WrappedAddCards />} />
                    <Route
                      path={`/editcard/:id`}
                      element={<WrappedEditCards />}
                    />
                    <Route
                      path={`/card-group`}
                      element={<WrappedCardGroup />}
                    />
                    <Route
                      path={`/card-group/:id`}
                      element={<WrappedUpdateCardGroup />}
                    />

                    <Route
                      path={`/add-group`}
                      element={<WrappedAddCardGroup />}
                    />
                    <Route path={`/dummy-page`} element={<DummyPage />} />

                    <Route
                      path={`/department-item-group`}
                      element={<WrappedDepartmentCardGroup />}
                    />
                    <Route
                      path={`/department-item-group/:id`}
                      element={<WrappedDepartmentUpdateCardGroup />}
                    />

                    <Route
                      path={`/department-add-group/:id`}
                      element={<WrappedDepartmentAddCardGroup />}
                    />
                    <Route
                      path={`/shop-revenue`}
                      element={<WrappedShopRevenueCommission />}
                    />

                    {/* Cards components end */}

                    {/* Deductions components start */}

                    <Route
                      path={`/managedeductions`}
                      element={<WrappedManageDeductions />}
                    />

                    <Route
                      path={`/adddeductions`}
                      element={<WrappedAddDeductions />}
                    />
                    <Route
                      path={`/editdeductions/:id`}
                      element={<WrappedEditDeductions />}
                    />
                    <Route
                      path={`/notifications`}
                      element={<WrappedmanageNotification />}
                    />

                    {/* Deduction components end */}

                    {/* Suppliers components start */}

                    <Route
                      path={`/managesuppliers`}
                      element={<WrappedManageSuppliers />}
                    />

                    <Route
                      path={`/addsuppliers`}
                      element={<WrappedAddSuppliers />}
                    />
                    <Route
                      path={`/editsuppliers/:id`}
                      element={<WrappedEditSuppliers />}
                    />

                    {/* Suppliers components end */}

                    {/* SitePump components start */}

                    <Route path={`/fuelprice`} element={<WrappedFUELPRICE />} />
                    <Route
                      path={`/update-fuel-price/:id`}
                      element={<WrappedUpdateFuelPrices />}
                    />

                    <Route
                      path={`/competitor-fuel-price`}
                      element={<WrappedCompetitorFuelPrices />}
                    />

                    <Route
                      path={`/competitor-fuel-price-v2`}
                      element={<WrappedCompetitorFuelPricesVersionTwo />}
                    />

                    <Route
                      path={`/fuel-purchase-prices`}
                      element={<WrappedFuelPurchasePrices />}
                    />
                    <Route
                      path={`/Add-purchase-prices`}
                      element={<WrappedAddFuelPurchase />}
                    />
                    <Route
                      path={`/managesitepump`}
                      element={<WrappedManageSitePump />}
                    />

                    <Route
                      path={`/addsitepump`}
                      element={<WrappedAddSitePump />}
                    />
                    <Route
                      path={`/editsitepump/:id`}
                      element={<WrappedEditSitePump />}
                    />

                    <Route
                      path={`/assignppl`}
                      element={<WrappedAssignManagePPL />}
                    />
                    <Route path={`/addppl`} element={<WrappedAssignAddPPL />} />
                    <Route
                      path={`/editppl/:id`}
                      element={<WrappedAssignEditPPL />}
                    />

                    {/* SitePump components end */}

                    {/* SiteTank components start */}

                    <Route
                      path={`/managesitetank`}
                      element={<WrappedManageSiteTank />}
                    />

                    <Route
                      path={`/addsitetank`}
                      element={<WrappedAddSiteTank />}
                    />
                    <Route
                      path={`/editsitetank/:id`}
                      element={<WrappedEditSiteTank />}
                    />

                    {/* SiteTank components end */}

                    {/* SiteNozzle components start */}

                    <Route
                      path={`/managesitenozzle`}
                      element={<WrappedManageSiteNozzle />}
                    />

                    <Route
                      path={`/addsitenozzle`}
                      element={<WrappedAddSiteNozzle />}
                    />
                    <Route
                      path={`/editsitenozzle/:id`}
                      element={<WrappedEditSiteNozzle />}
                    />

                    {/* SiteNozzle components end */}

                    {/* Items components start */}

                    <Route
                      path={`/manageitems`}
                      element={<WrappedManageItems />}
                    />

                    <Route path={`/additems`} element={<WrappedAddItems />} />
                    <Route
                      path={`/edititems/:id`}
                      element={<WrappedEditItems />}
                    />
                    <Route
                      path={`/edit-competitor/:id`}
                      element={<WrappedEditCompetitorFuelPrices />}
                    />
                    <Route
                      path={`/setup-payroll/:id`}
                      element={<Wrappedsetuppayroll />}
                    />

                    {/* Import Types components end */}

                    {/* <Route
                    path={`/manageimporttypes`}
                    element={<WrappedManageImportTypes />}
                  />

                  <Route
                    path={`/addimporttypes`}
                    element={<WrappedAddImportTypes />}
                  />
                  <Route
                    path={`/editimporttypes/:id`}
                    element={<WrappedEditImportTypes />}
                  /> */}

                    {/* Import Types components end */}

                    {/* Category components start */}

                    <Route
                      path={`/managebusinesscategory`}
                      element={<WrappedManageBusinessCategory />}
                    />

                    <Route
                      path={`/managesubbusinesscategory`}
                      element={<WrappedManageSubBusinessCategory />}
                    />

                    <Route
                      path={`/addbusinesscategory`}
                      element={<WrappedAddBusinessCategory />}
                    />

                    <Route
                      path={`/dashboard-details`}
                      element={<WrappedDashBoardChild />}
                    />
                    <Route
                      path={`/ceodashboard-details`}
                      element={<WrappedCeoDashBoardChild />}
                    />
                    <Route
                      path={`/titandashboard-details`}
                      element={<WrappedTitanDashboardChild />}
                    />
                    <Route
                      path={`/dashboardSubChild`}
                      element={<WrappedDashBoardSubChild />}
                    />
                    <Route
                      path={`/dashboard-details/:id`}
                      element={<WrappedDashBoardSiteDetail />}
                    />
                    <Route
                      path={`/ceodashboard-details/:id`}
                      element={<WrappedCeoDashBoardSiteDetail />}
                    />

                    <Route
                      path={`/addsubbusinesscategory`}
                      element={<WrappedAddSubBusinessCategory />}
                    />

                    <Route
                      path={`/editbusinesscategory/:id`}
                      element={<WrappedEditBusinessCategory />}
                    />
                    <Route
                      path={`/editsubbusinesscategory/:id`}
                      element={<WrappedEditSubBusinessCategory />}
                    />

                    {/* Category components end */}
                    <Route
                      path={`/skipdates/:id`}
                      element={<WrappedSkipDates />}
                    />

                    <Route
                      path={`/cron-module`}
                      element={<WrappedCronModule />}
                    />

                    <Route
                      path={`/manage-items`}
                      element={<WrappedNominalMapDepartmentitems />}
                    />
                    <Route
                      path={`/manage-sage-charges`}
                      element={<WrappedNominalSageCharges />}
                    />
                    <Route
                      path={`/manage-sage-deduction`}
                      element={<WrappedNominalSageDeduction />}
                    />
                    <Route
                      path={`/manage-sage-cards`}
                      element={<WrappedNominalSageCards />}
                    />
                    <Route
                      path={`/manage-sage-banking`}
                      element={<WrappedNominalSagebanking />}
                    />
                    <Route
                      path={`/nominal-activity-codes`}
                      element={<WrappedNominalActivityCodes />}
                    />
                    <Route
                      path={`/nominal-types`}
                      element={<WrappedNominalTypes />}
                    />
                    <Route
                      path={`/nominal-tax-code`}
                      element={<WrappedNominalTaxCode />}
                    />
                    <Route
                      path={`/manage-sms`}
                      element={<Wrappedmanagesms />}
                    />
                    <Route>
                      <Route path={`/editprofile`} element={<EditProfile />} />

                      <Route
                        path={`/business`}
                        element={<ManageBusinessTypes />}
                      />
                      <Route path={`/comingsoon`} element={<COMINGSOON />} />
                      <Route
                        path={`/sub-business`}
                        element={<WrappedManageBusinessSubTypes />}
                      />
                      <Route
                        path={`/addsub-business`}
                        element={<WrappeAddBusinessSubTypes />}
                      />
                      <Route
                        path={`/editsub-business/:id`}
                        element={<EditBusinessSubTypes />}
                      />
                      <Route path={`/addbusiness`} element={<AddBusiness />} />

                      <Route
                        path={`/editbusiness/:id`}
                        element={<EditBusiness />}
                      />

                      <Route path={`/settings`} element={<Settings />} />

                      <Route path={`/pages/faqs`} element={<FAQS />} />
                    </Route>
                  </Route>
                </Route>

                <Route path={`/`} element={<Custompages />}>
                  <Route path="/login" element={<Login token={token} />} />

                  <Route
                    path="/validateOtp"
                    element={<ValidateOtp token={token} />}
                  />

                  <Route
                    path={`/reset-password/:token`}
                    element={<ResetPassword />}
                  />
                  <Route
                    path={`/custompages/register`}
                    element={<Register />}
                  />
                  <Route
                    path={`/custompages/forgotPassword`}
                    element={<ForgotPassword />}
                  />

                  <Route
                    path={`/custompages/errorpages/errorpage401`}
                    element={<Errorpage401 />}
                  />
                  <Route
                    path={`/custompages/errorpages/errorpage500`}
                    element={<Errorpage500 />}
                  />

                  <Route
                    path={`/custompages/errorpages/errorpage503`}
                    element={<Errorpage503 />}
                  />
                  <Route
                    path={`/under-construction`}
                    element={<UnderConstruction />}
                  />
                  <Route path="*" element={<Errorpage400 />} />
                </Route>

                <Route path={`/errorpage403`} element={<Errorpage403 />} />
                <Route path="/login" element={<Login token={token} />} />
                <Route
                  path="/auto-approval/:id"
                  element={<PublicCompetitorPrice />}
                />
              </Routes>
            </NavigationProvider>
          </Provider>
        </React.Suspense>
      </BrowserRouter>
      <ToastContainer />
    </>
  );
};
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Root />);
