import withApi from '../../Utils/ApiHelper';

const BlankDashboard = () => {
    return (
        <div className='w-100 d-flex justify-content-center align-items-center' style={{ height: "100vh" }}>
            <img
                src={require("../../assets/images/brand/logo.png")}
                alt="Logo"
                className='blank-icon-image'
                id="icon"
                style={{ maxWidth: "180px" }}
            />
        </div>
    );
};

export default withApi(BlankDashboard);
