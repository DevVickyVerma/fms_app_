import React, { Fragment, useEffect, useState } from "react";
import ReactDOM from "react-dom/client";
import "./index.scss";
import { Navigate, BrowserRouter, Route, Routes } from "react-router-dom";
import PrivateRoutes from "./Utils/PrivateRoutes";
import * as loderdata from "./data/Component/loderdata/loderdata";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import dataReducer, { fetchData } from "./Redux/dataSlice";

import withApi from "./Utils/ApiHelper";
import Loaderimg from "./Utils/Loader";

const Switcherlayout = React.lazy(() => import("./components/switcherlayout"));
//App
const App = React.lazy(() => import("./components/app"));
const Custompages = React.lazy(() => import("./components/custompages"));

//Dashboard
const Dashboard = React.lazy(() => import("./components/Dashboard/Dashboard"));

const Accordions = React.lazy(() =>
  import("./components/Advanced-Elements/Accordion/Accordions")
);
const Charts = React.lazy(() =>
  import("./components/Advanced-Elements/Charts/Charts")
);
const Footer = React.lazy(() =>
  import("./components/Advanced-Elements/Footers/Footers")
);
const Header = React.lazy(() =>
  import("./components/Advanced-Elements/Headers/Headers")
);

//pages
const Profile = React.lazy(() => import("./components/pages/Profile/Profile"));
const EditProfile = React.lazy(() =>
  import("./components/pages/EditProfile/EditProfile")
);
const ManageRoles = React.lazy(() =>
  import("./components/pages/ManageRoles/ManageRoles")
);
const ManageCompany = React.lazy(() =>
  import("./components/pages/ManageCompany/ManageCompany")
);
const AddRoles = React.lazy(() =>
  import("./components/pages/ManageRoles/AddRoles")
);
// client Start
const ManageClient = React.lazy(() =>
  import("./components/pages/ManageClient/ManageClient")
);
const EditClient = React.lazy(() =>
  import("./components/pages/ManageClient/EditClient")
);
const AddClient = React.lazy(() =>
  import("./components/pages/ManageClient/AddClient")
);
// client End
// User Start
const ManageUser = React.lazy(() =>
  import("./components/pages/ManageUsers/ManageUsers")
);
const EditUser = React.lazy(() =>
  import("./components/pages/ManageUsers/EditUser")
);
const AddUser = React.lazy(() =>
  import("./components/pages/ManageUsers/AddUser")
);
// User End
// Site Start
const Managesite = React.lazy(() =>
  import("./components/pages/ManageSite/ManageSite")
);
const AddSite = React.lazy(() =>
  import("./components/pages/ManageSite/AddSite")
);

const EditSite = React.lazy(() =>
  import("./components/pages/ManageSite/EditSite")
);

// Site End

// Charges Start

const ManageCharges = React.lazy(() =>
  import("./components/pages/ManageCharges/ManageCharges")
);

const AddCharges = React.lazy(() =>
  import("./components/pages/ManageCharges/AddCharges")
);

const EditCharges = React.lazy(() =>
  import("./components/pages/ManageCharges/EditCharges")
);

// Charges End

// Shops Start

const ManageShops = React.lazy(() =>
  import("./components/pages/ManageShops/ManageShops")
);

const AddShops = React.lazy(() =>
  import("./components/pages/ManageShops/AddShops")
);

const EditShops = React.lazy(() =>
  import("./components/pages/ManageShops/EditShops")
);

// Shops End

// Cards Start

const ManageCards = React.lazy(() =>
  import("./components/pages/ManageCards/ManageCards")
);

const AddCards = React.lazy(() =>
  import("./components/pages/ManageCards/AddCards")
);

const EditCards = React.lazy(() =>
  import("./components/pages/ManageCards/EditCards")
);

// Cards End

// Deductions Start

const ManageDeductions = React.lazy(() =>
  import("./components/pages/ManageDeductions/ManageDeductions")
);

const AddDeductions = React.lazy(() =>
  import("./components/pages/ManageDeductions/AddDeductions")
);

const EditDeductions = React.lazy(() =>
  import("./components/pages/ManageDeductions/EditDeductions")
);

// Deductions End

// Suppliers Start

const ManageSuppliers = React.lazy(() =>
  import("./components/pages/ManageSuppliers/ManageSuppliers")
);

const AddSuppliers = React.lazy(() =>
  import("./components/pages/ManageSuppliers/AddSuppliers")
);

const EditSuppliers = React.lazy(() =>
  import("./components/pages/ManageSuppliers/EditSuppliers")
);

// Suppliers End

// Pump Start

const ManageSitePump = React.lazy(() =>
  import("./components/pages/ManageSitePump/ManageSitePump")
);

const AddSitePump = React.lazy(() =>
  import("./components/pages/ManageSitePump/AddSitePump")
);

const EditSitePump = React.lazy(() =>
  import("./components/pages/ManageSitePump/EditSitePump")
);
// Pump End

// SiteTank Start

const ManageSiteTank = React.lazy(() =>
  import("./components/pages/ManageSiteTank/ManageSiteTank")
);

const AddSiteTank = React.lazy(() =>
  import("./components/pages/ManageSiteTank/AddSiteTank")
);

const EditSiteTank = React.lazy(() =>
  import("./components/pages/ManageSiteTank/EditSiteTank")
);

// SiteTank End

// SiteNozzle Start

const ManageSiteNozzle = React.lazy(() =>
  import("./components/pages/ManageSiteNozzle/ManageSiteNozzle")
);

const AddSiteNozzle = React.lazy(() =>
  import("./components/pages/ManageSiteNozzle/AddSiteNozzle")
);

const EditSiteNozzle = React.lazy(() =>
  import("./components/pages/ManageSiteNozzle/EditSiteNozzle")
);

// SiteNozzle End
// Items Start

const ManageItems = React.lazy(() =>
  import("./components/pages/ManageItems/ManageItems")
);

const AddItems = React.lazy(() =>
  import("./components/pages/ManageItems/AddItems")
);

const EditItems = React.lazy(() =>
  import("./components/pages/ManageItems/EditItems")
);

// Items End

// Items Start

const ManageImportTypes = React.lazy(() =>
  import("./components/pages/ManageImportTypes/ManageImportTypes")
);

const AddImportTypes = React.lazy(() =>
  import("./components/pages/ManageImportTypes/AddImportTypes")
);

const EditImportTypes = React.lazy(() =>
  import("./components/pages/ManageImportTypes/EditImportTypes")
);

// Items End

// Category Start

const ManageBusinessCategory = React.lazy(() =>
  import("./components/pages/ManageCategory/ManageBusinessCategory")
);

const ManageSubBusinessCategory = React.lazy(() =>
  import("./components/pages/ManageCategory/ManageSubBusinessCategory")
);

const AddBusinessCategory = React.lazy(() =>
  import("./components/pages/ManageCategory/AddBusinessCategory")
);
const AddSubBusinessCategory = React.lazy(() =>
  import("./components/pages/ManageCategory/AddSubBusinessCategory")
);

const EditBusinessCategory = React.lazy(() =>
  import("./components/pages/ManageCategory/EditBusinessCategory")
);

const EditSubBusinessCategory = React.lazy(() =>
  import("./components/pages/ManageCategory/EditSubBusinessCategory")
);
// Category End

// DSR Start

const ManageDsr = React.lazy(() =>
  import("./components/pages/ManageDSR/ManageDsr")
);

// DSR End
// Reports Start

const ManageReports = React.lazy(() =>
  import("./components/pages/Reports/ManageReports")
);

// Reports End
// SiteSettings Start

const SiteSettings = React.lazy(() =>
  import("./components/pages/SiteSetting/SiteSettings")
);

const Tolerances = React.lazy(() =>
  import("./components/pages/SiteSetting/Tolerances")
);

// SiteSettings End
// Other Start

const WorkFlows = React.lazy(() =>
  import("./components/pages/Others/WorkFlow")
);

// Other End

const ManageBusinessTypes = React.lazy(() =>
  import("./components/pages/ManageBusinessTypes/ManageBusinessTypes")
);
const ManageBusinessSubTypes = React.lazy(() =>
  import("./components/pages/ManageSubBussiness/ManageSubBussiness")
);
const AddBusinessSubTypes = React.lazy(() =>
  import("./components/pages/ManageSubBussiness/AddSubBussiness")
);
const EditBusinessSubTypes = React.lazy(() =>
  import("./components/pages/ManageSubBussiness/EditSubBussiness")
);
const AddBusiness = React.lazy(() =>
  import("./components/pages/ManageBusinessTypes/AddBusiness")
);
const ManageAddon = React.lazy(() =>
  import("./components/pages/ManageAddon/ManageAddon")
);
const EditAddon = React.lazy(() =>
  import("./components/pages/ManageAddon/EditAddon")
);
const AddAddon = React.lazy(() =>
  import("./components/pages/ManageAddon/AddAddon")
);

const AddCompany = React.lazy(() =>
  import("./components/pages/ManageCompany/AddCompany")
);

const EditRoles = React.lazy(() =>
  import("./components/pages/ManageRoles/EditRoles")
);

const EditCompany = React.lazy(() =>
  import("./components/pages/ManageCompany/EditCompany")
);
const EditBusiness = React.lazy(() =>
  import("./components/pages/ManageBusinessTypes/EditBussinesType")
);

const Settings = React.lazy(() =>
  import("./components/pages/Settings/Settings")
);

const FAQS = React.lazy(() => import("./components/pages/FAQS/FAQS"));
const Terms = React.lazy(() => import("./components/pages/Terms/Terms"));

//custom Pages
const Login = React.lazy(() => import("./components/CustomPages/Login/Login"));
const ResetPassword = React.lazy(() =>
  import("./components/CustomPages/ResetPassword/ResetPassword")
);
const Register = React.lazy(() =>
  import("./components/CustomPages/Register/Register")
);
const ForgotPassword = React.lazy(() =>
  import("./components/CustomPages/ForgotPassword/ForgotPassword")
);
const LockScreen = React.lazy(() =>
  import("./components/CustomPages/LockScreen/LockScreen")
);
//Errorpages
const Errorpage400 = React.lazy(() =>
  import("./components/ErrorPages/ErrorPages/400/400")
);
const Errorpage401 = React.lazy(() =>
  import("./components/ErrorPages/ErrorPages/401/401")
);
const Errorpage403 = React.lazy(() =>
  import("./components/ErrorPages/ErrorPages/403/403")
);
const Errorpage500 = React.lazy(() =>
  import("./components/ErrorPages/ErrorPages/500/500")
);
const Errorpage503 = React.lazy(() =>
  import("./components/ErrorPages/ErrorPages/503/503")
);
const COMINGSOON = React.lazy(() =>
  import("./components/ErrorPages/ErrorPages/Soon/Comingsoon")
);

const Root = () => {
  const store = configureStore({
    reducer: {
      data: dataReducer,
    },
  });

  store.dispatch(fetchData());
  const [token, setToken] = useState(localStorage.getItem("token"));
  const WrappedDashboard = withApi(Dashboard);
  const WrappedManageBusinessSubTypes = withApi(ManageBusinessSubTypes);
  const WrappeAddBusinessSubTypes = withApi(AddBusinessSubTypes);
  const WrappedManageClient = withApi(ManageClient);
  const WrappedAddClient = withApi(AddClient);
  const WrappeAddEditClient = withApi(EditClient);
  const WrappedManageUser = withApi(ManageUser);
  const WrappedAddUser = withApi(AddUser);
  const WrappeAddEditUser = withApi(EditUser);
  const WrappedManageSite = withApi(Managesite);
  const WrappedAddSite = withApi(AddSite);
  const WrappeAddEditSite = withApi(EditSite);
  const WrappedManageCompany = withApi(ManageCompany);
  const WrappedAddCompany = withApi(AddCompany);
  const WrappeAddEditCompany = withApi(EditCompany);
  const WrappedManageRoles = withApi(ManageRoles);
  const WrappedAddRoles = withApi(AddRoles);
  const WrappeAddEditRoles = withApi(EditRoles);
  const WrappedManageAddon = withApi(ManageAddon);
  const WrappedAddAddon = withApi(AddAddon);
  const WrappeAddEditAddon = withApi(EditAddon);
  const WrappeHeader = withApi(Header);
  const WrappedManageCharges = withApi(ManageCharges);
  const WrappedAddCharges = withApi(AddCharges);
  const WrappedEditCharges = withApi(EditCharges);
  const WrappedManageShops = withApi(ManageShops);
  const WrappedAddShops = withApi(AddShops);
  const WrappedEditShops = withApi(EditShops);
  const WrappedManageCards = withApi(ManageCards);
  const WrappedAddCards = withApi(AddCards);
  const WrappedEditCards = withApi(EditCards);
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
  const WrappedManageReports = withApi(ManageReports);
  const WrappedWorkFlows = withApi(WorkFlows);
  const WrappedSiteSettings = withApi(SiteSettings);
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

  const WrappedManageImportTypes = withApi(ManageImportTypes);
  const WrappedAddImportTypes = withApi(AddImportTypes);
  const WrappedEditImportTypes = withApi(EditImportTypes);



  return (
    <Fragment>
      <BrowserRouter>
        <React.Suspense fallback={<Loaderimg />}>
          <Provider store={store}>
            <Routes>
              <Route element={<PrivateRoutes token={token} />}>
                <Route path={`/`} element={<App />}>
                  {/* <Route  path={`/login`} element={<Login />} /> */}
                  <Route index element={<Dashboard />} />
                  <Route path={`/dashboard`} element={<WrappedDashboard />} />
                  {/* client  Components Start */}
                  <Route path={`/clients`} element={<WrappedManageClient />} />
                  <Route
               path={`editclient/:id`}
                    element={<WrappeAddEditClient />}
                  />
                  <Route path={`addclient`} element={<WrappedAddClient />} />

                  {/* client  Components End */}

                  {/* User  Components Start */}
                  <Route path={`/users`} element={<WrappedManageUser />} />
                  <Route
                    path={`/editusers/:id`}
                    element={<WrappeAddEditUser />}
                  />

                  <Route path={`addusers`} element={<WrappedAddUser />} />

                  {/* User  Components End */}

                  {/* sites  Components Start */}

                  <Route path={`addsite`} element={<WrappedAddSite />} />
                  <Route path={`editsite/:id`} element={<WrappeAddEditSite />} />
                  <Route path={`/sites`} element={<Managesite />} />
                  {/* sites  Components End */}

                  {/* Company  Components Start */}
                  <Route path={`/addcompany`} element={<WrappedAddCompany />} />
                  <Route
                    path={`/managecompany`}
                    element={<WrappedManageCompany />}
                  />
                  <Route
                    path={`/editcompany`}
                    element={<WrappeAddEditCompany />}
                  />

                  {/* Company  Components End */}

                  {/* Role  Components Start */}
                  <Route path={`/roles`} element={<WrappedManageRoles />} />
                  <Route path={`/addroles`} element={<WrappedAddRoles />} />

                  <Route path={`/editrole`} element={<WrappeAddEditRoles />} />

                  {/* Role  Components End */}

                  {/* Addon  Components Start */}
                  <Route
                    path={`/manageaddon`}
                    element={<WrappedManageAddon />}
                  />

                  <Route path={`/addaddon`} element={<WrappedAddAddon />} />
                  <Route path={`EditAddon`} element={<WrappeAddEditAddon />} />

                  {/* Addon  Components End */}
                  {/* Header  Components Start */}
                  <Route
                    path={`/advancedElements/headers`}
                    element={<WrappeHeader />}
                  />
                  {/* Header  Components End */}

                  {/* DSR  Components Start */}
                  <Route path={`/data-entry`} element={<WrappedManageDsr />} />
                  {/* DSR  Components End */}

                  {/* Others  Components Start */}
                  <Route path={`/workflows`} element={<WrappedWorkFlows />} />
                  {/* Others  Components End */}
                  
                  {/* Reports  Components Start */}
                  <Route path={`/reports`} element={<WrappedManageReports />} />
                  {/* Reports  Components End */}
                  {/* Reports  Components Start */}
                  <Route path={`/site-setting`} element={<WrappedSiteSettings />} />
                  <Route path={`/tolerances`} element={<WrappedTolerances />} />
                  {/* Reports  Components End */}
                  {/* Charges  Components Start  */}
                  <Route
                    path={`/managecharges`}
                    element={<WrappedManageCharges />}
                  />

                  <Route path={`/addcharges`} element={<WrappedAddCharges />} />
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
                    path={`/editshops/:id`}
                    element={<WrappedEditShops />}
                  />

                  {/* Shops components end */}

                  {/* Cards components start */}

                  <Route
                    path={`/managecards`}
                    element={<WrappedManageCards />}
                  />

                  <Route path={`/addcards`} element={<WrappedAddCards />} />
                  <Route
                    path={`/editcard/:id`}
                    element={<WrappedEditCards />}
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

                  <Route
                    path={`/additems`}
                    element={<WrappedAddItems />}
                  />
                  <Route
                    path={`/edititems/:id`}
                    element={<WrappedEditItems />}
                  />

                  {/* Import Types components end */}

                  <Route
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
                  />

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

                  <Route>
                    <Route
                      path={`/advancedElements/accordions`}
                      element={<Accordions />}
                    />

                    <Route
                      path={`/advancedElements/footers`}
                      element={<Footer />}
                    />
                  </Route>

                  <Route>
                    <Route path={`/pages/profile`} element={<Profile />} />

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

                    <Route path={`/pages/terms`} element={<Terms />} />
                  </Route>
                </Route>
              </Route>

              <Route path={`/`} element={<Custompages />}>
                <Route path="/login" element={<Login token={token} />} />

                <Route
                  path={`/reset-password/:token`}
                  element={<ResetPassword />}
                />
                <Route path={`/custompages/register`} element={<Register />} />
                <Route
                  path={`/custompages/forgotPassword`}
                  element={<ForgotPassword />}
                />
                <Route
                  path={`/custompages/lockScreen`}
                  element={<LockScreen />}
                />
                <Route
                  path={`/custompages/errorpages/errorpage401`}
                  element={<Errorpage401 />}
                />
                <Route path={`/errorpage403`} element={<Errorpage403 />} />
                <Route
                  path={`/custompages/errorpages/errorpage500`}
                  element={<Errorpage500 />}
                />
                <Route
                  path={`/custompages/errorpages/errorpage503`}
                  element={<Errorpage503 />}
                />
                <Route path="*" element={<Errorpage400 />} />
              </Route>
              <Route path="/login" element={<Login token={token} />} />
            </Routes>
          </Provider>
        </React.Suspense>
      </BrowserRouter>
    </Fragment>
  );
};
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Root />);
