import React, { Fragment } from "react";
import ReactDOM from "react-dom/client";
import "./index.scss";
import { BrowserRouter, Route, Routes } from "react-router-dom";

const Switcherlayout = React.lazy(()=>import("./components/switcherlayout"));
//App
const App = React.lazy(() => import("./components/app"));
const Custompages = React.lazy(() => import("./components/custompages"));

//Dashboard
const Dashboard = React.lazy(()=> import("./components/Dashboard/Dashboard"));
//Widgets
const Widgets = React.lazy(()=> import("./components/Widgets/Widgets"));
//Components
const CardDesign = React.lazy(() =>import("./components/Components/CardDesign/CardDesign"));
const ContentScrollBar = React.lazy(()=>import("./components/Components/ContentScrollBar/ContentScrollBar"));
const Counters = React.lazy(()=>import("./components/Components/Counters/Counters"));
const DefaultCalendar = React.lazy(()=>import("./components/Components/DefaultCalendar/DefaultCalendar"));
const DefaultChat = React.lazy(()=>import("./components/Components/DefaultChat/DefaultChat"));
const FullCalendar = React.lazy(()=>import("./components/Components/FullCalendar/FullCalendar"));
// const Loader = React.lazy(()=>import("./components/Components/Loaders/Loaders"));
const Notifications = React.lazy(()=>import("./components/Components/Notifications/Notifications"));
const RangeSlider = React.lazy(()=>import("./components/Components/RangeSlider/RangeSlider"));
const Rating = React.lazy(()=>import("./components/Components/Rating/Rating"));
const SweetAlerts = React.lazy(()=>import("./components/Components/SweetAlerts/SweetAlerts"));
const Timeline = React.lazy(()=>import("./components/Components/Timeline/Timeline"));
const Treeview = React.lazy(()=>import("./components/Components/Treeview/Treeview"));
//Elements
const Alerts = React.lazy(() => import("./components/Elements/Alerts/Alerts"));
const AvatarRounded = React.lazy(()=>import("./components/Elements/AvatarRounded/AvatarRounded"));
const AvatarSquares = React.lazy(()=>import("./components/Elements/AvatarSquares/AvatarSquares"));
const AvatarRadius = React.lazy(()=>import("./components/Elements/AvatarRadius/AvatarRadius"));
const Badges = React.lazy(()=>import("./components/Elements/Badges/Badges"));
const Buttons = React.lazy(()=>import("./components/Elements/Buttons/Buttons"));
const Breadcrumbs = React.lazy(()=>import("./components/Elements/Breadcrumbs/Breadcrumbs"));
const Colors = React.lazy(()=>import("./components/Elements/Colors/Colors"));
const DropDowns = React.lazy(()=>import("./components/Elements/DropDowns/DropDowns"));
const List = React.lazy(()=>import("./components/Elements/List/List"));
const Navigation = React.lazy(()=>import("./components/Elements/Navigation/Navigation"));
const Paginations = React.lazy(()=>import("./components/Elements/Paginations/Paginations"));
const Panels = React.lazy(()=>import("./components/Elements/Panels/Panels"));
const Tags = React.lazy(()=>import("./components/Elements/Tags/Tags"));
const Thumbnails = React.lazy(()=>import("./components/Elements/Thumbnails/Thumbnails"));
const Typography = React.lazy(()=>import("./components/Elements/Typography/Typography"));
//Advanced-Elements
const Mediaobject = React.lazy(() =>import("./components/Advanced-Elements/Mediaobject/Mediaobject"));
const Accordions = React.lazy(()=>import("./components/Advanced-Elements/Accordion/Accordions"));
const Carousels = React.lazy(()=>import("./components/Advanced-Elements/Carousel/Carousels"));
const Charts = React.lazy(()=>import("./components/Advanced-Elements/Charts/Charts"));
const Cryptocurrencies = React.lazy(()=>import("./components/Advanced-Elements/Crypto-currencies/Crypto-currencies"));
const Footer = React.lazy(()=>import("./components/Advanced-Elements/Footers/Footers"));
const Header = React.lazy(()=>import("./components/Advanced-Elements/Headers/Headers"));
const Modal = React.lazy(()=>import("./components/Advanced-Elements/Modal/Modal"));
const Progress = React.lazy(()=>import("./components/Advanced-Elements/Progress/Progress"));
const Search = React.lazy(()=>import("./components/Advanced-Elements/Search/Search"));
const Tabs = React.lazy(()=>import("./components/Advanced-Elements/Tabs/Tabs"));
const UserList = React.lazy(()=>import("./components/Advanced-Elements/UserList/UserList"));
const TooltipandPopover = React.lazy(()=>import("./components/Advanced-Elements/TooltipandPopover/TooltipandPopover"));
//Charts
const ChartJs = React.lazy(() => import("./components/Charts/ChartJs/ChartJs"));
const PieCharts = React.lazy(()=>import("./components/Charts/PieCharts/PieCharts"));
const Echarts = React.lazy(()=>import("./components/Charts/Echarts/Echarts"));
const Nvd3charts = React.lazy(()=>import("./components/Charts/Nvd3Charts/Nvd3charts"));
//Table
const DefaultTables = React.lazy(() =>import("./components/Table/DefaultTables/DefaultTables"));
const DataTables = React.lazy(()=>import("./components/Table/DataTables/DataTables"));
//Form
const FormElements = React.lazy(() =>import("./components/Form/FormElements/FormElements"));
const FormAdvanced = React.lazy(()=>import("./components/Form/FormAdvanced/FormAdvanced"));
const FormEditor = React.lazy(()=>import("./components/Form/FormEditor/FormEditor"));
const FormValidation = React.lazy(()=>import("./components/Form/FormValidation/FormValidation"));
const FormWizard = React.lazy(()=>import("./components/Form/FormWizard/FormWizard"));
//Icons
const FontAwesome = React.lazy(() =>import("./components/Icons/FontAwesomes/FontAwesomes"));
const MaterialDesignIcons = React.lazy(()=>import("./components/Icons/MaterialDesignIcons/MaterialDesignIcons"));
const SimpleLineIcons = React.lazy(()=>import("./components/Icons/SimplelineIcons/SimplelineIcons"));
const FeatherIcons = React.lazy(()=>import("./components/Icons/FeatherIcons/FeatherIcons"));
const IonicIcons = React.lazy(()=>import("./components/Icons/IonicIcons/IonicIcons"));
const FlagIcons = React.lazy(()=>import("./components/Icons/FlagsIcons/FlagsIcons"));
const Pe7Icons = React.lazy(()=>import("./components/Icons/Pe7Icons/Pe7Icons"));
const ThemifyIcons = React.lazy(()=>import("./components/Icons/ThemifyIcons/ThemifyIcons"));
const TypiconsIcons = React.lazy(()=>import("./components/Icons/TypiconsIcons/TypiconsIcons"));
const WeatherIcons = React.lazy(()=>import("./components/Icons/WeatherIcons/WeatherIcons"));
//pages
const Profile = React.lazy(() => import("./components/pages/Profile/Profile"));
const EditProfile = React.lazy(()=>import("./components/pages/EditProfile/EditProfile"));
const MailInbox = React.lazy(()=>import("./components/pages/MailInbox/MailInbox"));
const MailCompose = React.lazy(()=>import("./components/pages/MailCompose/MailCompose"));
const Gallery = React.lazy(()=>import("./components/pages/Gallery/Gallery"));
const AboutCompany = React.lazy(()=>import("./components/pages/AboutCompany/AboutCompany"));
const Services = React.lazy(()=>import("./components/pages/Services/Services"));
const FAQS = React.lazy(()=>import("./components/pages/FAQS/FAQS"));
const Terms = React.lazy(()=>import("./components/pages/Terms/Terms"));
const Invoice = React.lazy(()=>import("./components/pages/Invoice/Invoice"));
const PricingTables = React.lazy(()=>import("./components/pages/PricingTables/PricingTables"));
const Empty = React.lazy(()=>import("./components/pages/Empty/Empty"));
const UnderConstruction = React.lazy(()=>import("./components/pages/UnderConstruction/UnderConstruction"));
//Blog
const Blog = React.lazy(() => import("./components/pages/Blog/Blog/Blog"));
const BlogDetails = React.lazy(()=>import("./components/pages/Blog/BlogDetails/BlogDetails"));
const BlogPost = React.lazy(()=>import("./components/pages/Blog/BlogPost/BlogPost"));
//Maps
const LeafletMaps = React.lazy(() =>import("./components/Maps/LeafletMaps/LeafletMaps"));
const VectorMaps = React.lazy(()=>import("./components/Maps/VectorMaps/VectorMaps"));
//E-Commerce
const Shop = React.lazy(() =>import("./components/pages/E-Commerce/Shop/Shop"));
const Checkout = React.lazy(()=>import("./components/pages/E-Commerce/Checkout/Checkout"));
const ProductDetails = React.lazy(()=>import("./components/pages/E-Commerce/ProductDetails/ProductDetails"));
const ShoppingCarts = React.lazy(()=>import("./components/pages/E-Commerce/ShoppingCarts/ShoppingCarts"));
const Wishlist = React.lazy(()=>import("./components/pages/E-Commerce/Wishlist/Wishlist"));
//FileManger
const FileManager = React.lazy(()=>import("./components/pages/FileManager/FileManager/FileManager"));
const FileAttachments = React.lazy(()=>import("./components/pages/FileManager/FileAttachments/FileAttachments"));
const FileDetails = React.lazy(()=>import("./components/pages/FileManager/FileDetails/FileDetails"));
const FileManagerList = React.lazy(()=>import("./components/pages/FileManager/FileManagerList/FileManagerList"));

//custom Pages
const Login = React.lazy(()=>import("./components/CustomPages/Login/Login"));
const Register = React.lazy(()=>import("./components/CustomPages/Register/Register"));
const ForgotPassword = React.lazy(()=>import("./components/CustomPages/ForgotPassword/ForgotPassword"));
const LockScreen = React.lazy(()=>import("./components/CustomPages/LockScreen/LockScreen"));
//Errorpages
const Errorpage400 = React.lazy(()=>import("./components/ErrorPages/ErrorPages/400/400"));
const Errorpage401 = React.lazy(()=>import("./components/ErrorPages/ErrorPages/401/401"));
const Errorpage403 = React.lazy(()=>import("./components/ErrorPages/ErrorPages/403/403"));
const Errorpage500 = React.lazy(()=>import("./components/ErrorPages/ErrorPages/500/500"));
const Errorpage503 = React.lazy(()=>import("./components/ErrorPages/ErrorPages/503/503"));

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
  return (
    <Fragment>
      <BrowserRouter>
      <React.Suspense fallback={Loaderimg()}>
        <Routes>
          <Route
            path={`/`}
            element={<App />}
          >
            <Route index element={<Dashboard />} />
            <Route
              path={`/dashboard`}
              element={<Dashboard />}
            />
            <Route
              path={`/widgets`}
              element={<Widgets />}
            />
            <Route>
              <Route
                path={`/components/cardsDesign`}
                element={<CardDesign />}
              />
              <Route
                path={`/components/defaultCalendar`}
                element={<DefaultCalendar />}
              />

              <Route
                path={`/components/fullCalendar`}
                element={<FullCalendar />}
              />

              <Route
                path={`/components/defaultChat`}
                element={<DefaultChat />}
              />

              <Route
                path={`/components/notifications`}
                element={<Notifications />}
              />

              <Route
                path={`/components/sweetAlerts`}
                element={<SweetAlerts />}
              />

              <Route
                path={`/components/rangeSlider`}
                element={<RangeSlider />}
              />

              <Route
                path={`/components/contentScrollBar`}
                element={<ContentScrollBar />}
              />

              {/* <Route
                path={`/components/loader`}
                element={<Loader />}
              /> */}
              <Route
                path={`/components/counters`}
                element={<Counters />}
              />

              <Route
                path={`/components/rating`}
                element={<Rating />}
              />
              <Route
                path={`/components/timeline`}
                element={<Timeline />}
              />
              <Route
                path={`/components/treeview`}
                element={<Treeview />}
              />
            </Route>
            <Route>
              <Route
                path={`/elements/alerts`}
                element={<Alerts />}
              />
              <Route
                path={`/elements/buttons`}
                element={<Buttons />}
              />

              <Route
                path={`/elements/colors`}
                element={<Colors />}
              />

              <Route
                path={`/elements/avatarSquares`}
                element={<AvatarSquares />}
              />

              <Route
                path={`/elements/avatarRounded`}
                element={<AvatarRounded />}
              />

              <Route
                path={`/elements/avatarRadius`}
                element={<AvatarRadius />}
              />

              <Route
                path={`/elements/dropDowns`}
                element={<DropDowns />}
              />

              <Route
                path={`/elements/list`}
                element={<List />}
              />

              <Route
                path={`/elements/tags`}
                element={<Tags />}
              />

              <Route
                path={`/elements/paginations`}
                element={<Paginations />}
              />

              <Route
                path={`/elements/navigation`}
                element={<Navigation />}
              />

              <Route
                path={`/elements/typography`}
                element={<Typography />}
              />

              <Route
                path={`/elements/breadcrumbs`}
                element={<Breadcrumbs />}
              />

              <Route
                path={`/elements/badges`}
                element={<Badges />}
              />

              <Route
                path={`/elements/panels`}
                element={<Panels />}
              />

              <Route
                path={`/elements/thumbnails`}
                element={<Thumbnails />}
              />
            </Route>
            <Route>
              <Route
                path={`/advancedElements/mediaObject`}
                element={<Mediaobject />}
              />

              <Route
                path={`/advancedElements/accordions`}
                element={<Accordions />}
              />

              <Route
                path={`/advancedElements/tabs`}
                element={<Tabs />}
              />

              <Route
                path={`/advancedElements/charts`}
                element={<Charts />}
              />

              <Route
                path={`/advancedElements/modal`}
                element={<Modal />}
              />

              <Route
                path={`/advancedElements/tooltipandPopover`}
                element={<TooltipandPopover />}
              />

              <Route
                path={`/advancedElements/progress`}
                element={<Progress />}
              />

              <Route
                path={`/advancedElements/carousels`}
                element={<Carousels />}
              />

              <Route
                path={`/advancedElements/headers`}
                element={<Header />}
              />

              <Route
                path={`/advancedElements/footers`}
                element={<Footer />}
              />

              <Route
                path={`/advancedElements/userList`}
                element={<UserList />}
              />

              <Route
                path={`/advancedElements/search`}
                element={<Search />}
              />

              <Route
                path={`/advancedElements/cryptoCurrencies`}
                element={<Cryptocurrencies />}
              />
            </Route>
            <Route>
              <Route
                path={`/charts/chartJs`}
                element={<ChartJs />}
              />

              <Route
                path={`/charts/echarts`}
                element={<Echarts />}
              />

              <Route
                path={`/charts/nvd3charts`}
                element={<Nvd3charts />}
              />

              <Route
                path={`/charts/PieCharts`}
                element={<PieCharts />}
              /> 
            </Route>
            <Route>
              <Route
                path={`/tables/defaultTables`}
                element={<DefaultTables />}
              />

              <Route
                path={`/tables/dataTables`}
                element={<DataTables />}
              />
            </Route>
            <Route>
              <Route
                path={`/form/formElements`}
                element={<FormElements />}
              />

              <Route
                path={`/form/formAdvanced`}
                element={<FormAdvanced />}
              />

              <Route
                path={`/form/formEditor`}
                element={<FormEditor />}
              />

              <Route
                path={`/form/formWizard`}
                element={<FormWizard />}
              />

              <Route
                path={`/form/formValidation`}
                element={<FormValidation />}
              />
            </Route>
            <Route>
              <Route
                path={`/icon/fontAwesome`}
                element={<FontAwesome />}
              />

              <Route
                path={`/icon/materialDesignIcons`}
                element={<MaterialDesignIcons />}
              />

              <Route
                path={`/icon/simpleLineIcons`}
                element={<SimpleLineIcons />}
              />

              <Route
                path={`/icon/featherIcons`}
                element={<FeatherIcons />}
              />

              <Route
                path={`/icon/ionicIcons`}
                element={<IonicIcons />}
              />

              <Route
                path={`/icon/flagIcons`}
                element={<FlagIcons />}
              />

              <Route
                path={`/icon/pe7Icons`}
                element={<Pe7Icons />}
              />

              <Route
                path={`/icon/themifyIcons`}
                element={<ThemifyIcons />}
              />

              <Route
                path={`/icon/typiconsIcons`}
                element={<TypiconsIcons />}
              />

              <Route
                path={`/icon/weatherIcons`}
                element={<WeatherIcons />}
              />

              <Route
                path={`/icon/typiconsIcons`}
                element={<TypiconsIcons />}
              />
            </Route>
            <Route>
              <Route
                path={`/pages/profile`}
                element={<Profile />}
              />

              <Route
                path={`/pages/editProfile`}
                element={<EditProfile />}
              />

              <Route
                path={`/pages/mailInbox`}
                element={<MailInbox />}
              />

              <Route
                path={`/pages/mailCompose`}
                element={<MailCompose />}
              />

              <Route
                path={`/pages/gallery`}
                element={<Gallery />}
              />

              <Route
                path={`/pages/aboutCompany`}
                element={<AboutCompany />}
              />

              <Route
                path={`/pages/services`}
                element={<Services />}
              />

              <Route
                path={`/pages/faqs`}
                element={<FAQS />}
              />

              <Route
                path={`/pages/terms`}
                element={<Terms />}
              />

              <Route
                path={`/pages/invoice`}
                element={<Invoice />}
              />

              <Route
                path={`/pages/pricingTables`}
                element={<PricingTables />}
              />
              <Route
                path={`/pages/Blog/blog`}
                element={<Blog />}
              />
              <Route
                path={`/pages/Blog/blogDetails`}
                element={<BlogDetails />}
              />
              <Route
                path={`/pages/Blog/blogPost`}
                element={<BlogPost />}
              />

              <Route
                path={`/pages/empty`}
                element={<Empty />}
              />

              <Route
                path={`/pages/maps/leafletMaps`}
                element={<LeafletMaps />}
              />

              <Route
                path={`/pages/maps/vectorMaps`}
                element={<VectorMaps />}
              />

              <Route
                path={`/pages/e-commerce/shop`}
                element={<Shop />}
              />

              <Route
                path={`/pages/e-commerce/productDetails`}
                element={<ProductDetails />}
              />

              <Route
                path={`/pages/e-commerce/shoppingCart`}
                element={<ShoppingCarts />}
              />

              <Route
                path={`/pages/e-commerce/wishlist`}
                element={<Wishlist />}
              />

              <Route
                path={`/pages/e-commerce/checkout`}
                element={<Checkout />}
              />
              <Route
                path={`/pages/FileManager/FileAttachments/FileAttachments`}
                element={<FileAttachments />}
              />
              <Route
                path={`/pages/FileManager/FileDetails/FileDetails`}
                element={<FileDetails />}
              />
              <Route
                path={`/pages/FileManagerFileManager/FileManager`}
                element={<FileManager />}
              />
              <Route
                path={`/pages/FileManager/FileManagerList/FileManagerList`}
                element={<FileManagerList />}
              />
            </Route>
          </Route>
          <Route
            path={`/pages/themeStyle`}
            element={<Switcherlayout />}
          />
          <Route
            path={`/`}
            element={<Custompages />}
          >
            <Route
              path={`/pages/underConstruction`}
              element={<UnderConstruction />}
            />
            <Route
              path={`/login`}
              element={<Login />}
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
  );
};
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Root />);
