import React, { Fragment } from "react";
import ReactDOM from "react-dom/client";
import "./index.scss";
import { Navigate, BrowserRouter, Route, Routes } from "react-router-dom";

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
const Modal = React.lazy(() =>
  import("./components/Advanced-Elements/Modal/Modal")
);
const Tabs = React.lazy(() =>
  import("./components/Advanced-Elements/Tabs/Tabs")
);
const UserList = React.lazy(() =>
  import("./components/Advanced-Elements/UserList/UserList")
);
const TooltipandPopover = React.lazy(() =>
  import("./components/Advanced-Elements/TooltipandPopover/TooltipandPopover")
);

//pages
const Profile = React.lazy(() => import("./components/pages/Profile/Profile"));
const EditProfile = React.lazy(() =>
  import("./components/pages/EditProfile/EditProfile")
);
const MailInbox = React.lazy(() =>
  import("./components/pages/MailInbox/MailInbox")
);
const MailCompose = React.lazy(() =>
  import("./components/pages/MailCompose/MailCompose")
);

const FAQS = React.lazy(() => import("./components/pages/FAQS/FAQS"));
const Terms = React.lazy(() => import("./components/pages/Terms/Terms"));

//custom Pages
const Login = React.lazy(() => import("./components/CustomPages/Login/Login"));
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

const Loaderimg = () => {
  return (
    <div id="global-loader">
      <img
        src={require("./assets/images/loader.svg").default}
        className="loader-img"
        alt="Loader"
      />
    </div>
  );
};
const Root = () => {

  const isLoggedIn = localStorage.getItem('token');
  return isLoggedIn ? (
    <Fragment>
    
      <BrowserRouter>
        <React.Suspense fallback={Loaderimg()}>
        
          <Routes>
            <Route path={`/`} element={<App />}>
              <Route index element={<Dashboard />} />
              <Route path={`/dashboard`} element={<Dashboard />} />

              <Route>
                <Route
                  path={`/advancedElements/accordions`}
                  element={<Accordions />}
                />

                <Route
                  path={`/advancedElements/tooltipandPopover`}
                  element={<TooltipandPopover />}
                />

                <Route
                  path={`/advancedElements/headers`}
                  element={<Header />}
                />

                <Route
                  path={`/advancedElements/footers`}
                  element={<Footer />}
                />
              </Route>

             

              <Route>
                <Route path={`/pages/profile`} element={<Profile />} />

                <Route path={`/pages/editProfile`} element={<EditProfile />} />

                <Route path={`/pages/mailInbox`} element={<MailInbox />} />

                <Route path={`/pages/mailCompose`} element={<MailCompose />} />

                

               
               

                <Route path={`/pages/faqs`} element={<FAQS />} />

                <Route path={`/pages/terms`} element={<Terms />} />
              </Route>
            </Route>

            <Route path={`/`} element={<Custompages />}>
              <Route path={`/login`} element={<Login />} />
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
              <Route
                path={`/custompages/errorpages/errorpage403`}
                element={<Errorpage403 />}
              />
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
          </Routes>
        </React.Suspense>
      </BrowserRouter>
    </Fragment>
  ): (
    <BrowserRouter>
        <React.Suspense fallback={Loaderimg()}>
        
          <Routes>
          <Route path={`/`} element={<Login />} />
          <Route   path={`/custompages/forgotPassword`}
                element={<ForgotPassword />} />
          </Routes>
          </React.Suspense>
          </BrowserRouter>
  
  );
};
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Root />);
