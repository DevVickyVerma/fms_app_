import React, { Fragment, useEffect, useState } from "react";
import ReactDOM from "react-dom/client";
import "./index.scss";
import { Navigate, BrowserRouter, Route, Routes } from "react-router-dom";
import PrivateRoutes from "./Utils/PrivateRoutes";
import * as loderdata from "./data/Component/loderdata/loderdata";
import { Provider } from "react-redux";
import store from './Redux/store';

import withApi from "./Utils/ApiHelper";

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
const Loaderimg = () => {
  return (
    <div id="global-loader">
      <loderdata.Loadersbigsizes1 />
    </div>
  );
};

const Root = () => {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const WrappedDashboard = withApi(Dashboard);
  const WrappedManageBusinessSubTypes = withApi(ManageBusinessSubTypes);
  const WrappeAddBusinessSubTypes = withApi(AddBusinessSubTypes);
  const WrappedManageClient = withApi(ManageClient);
  const WrappedAddClient = withApi(AddClient);
  const WrappeAddEditClient = withApi(EditClient);
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
  return (
    <Fragment>
      <BrowserRouter>
        <React.Suspense fallback={Loaderimg()}>
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
                    path={`editclient`}
                    element={<WrappeAddEditClient />}
                  />
                  <Route path={`addclient`} element={<WrappedAddClient />} />

                  {/* client  Components End */}

                  {/* sites  Components Start */}

                  <Route path={`addsite`} element={<WrappedAddSite />} />
                  <Route path={`editsite`} element={<WrappeAddEditSite />} />
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
                  <Route path={`/manageaddon`} element={<WrappedManageAddon />} />

                  <Route path={`/addaddon`} element={<WrappedAddAddon />} />
                  <Route path={`EditAddon`} element={<WrappeAddEditAddon />} />

                  {/* Addon  Components End */}
                  {/* Header  Components Start */}
                  <Route
                      path={`/advancedElements/headers`}
                      element={<WrappeHeader />}
                    />
                  {/* Header  Components End */}




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
