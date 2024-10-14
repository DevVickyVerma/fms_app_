import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import withApi from '../../../Utils/ApiHelper';
import { handleError } from '../../../Utils/ToastUtils';
import LoaderImg from '../../../Utils/Loader';

const ManageClient = (props) => {
  const { isLoading, getData, postData } = props;
  const [data, setData] = useState();
  const [selectedIds, setSelectedIds] = useState([]);



  const { id } = useParams();

  useEffect(() => {
    try {
      GetSiteData();
    } catch (error) {
      handleError(error);
    }
    console.clear();
  }, [id]);

  const GetSiteData = async () => {
    try {
      const response = await getData(`/payroll/setup/${id}`);

      if (response) {
        setData(response?.data?.data);
      } else {
        throw new Error('No data available in the response');
      }
    } catch (error) {
      console.error('API error:', error);
    }
  };

  const handleCompanyCheckboxChange = (companyId) => {
    const company = data?.companies.find((c) => c.id === companyId);
    const siteIds = company?.sites.map((site) => site.id) || [];

    const updatedSelectedIds = [...selectedIds];
    const index = updatedSelectedIds.indexOf(companyId);

    if (index === -1) {
      updatedSelectedIds.push(companyId, ...siteIds);
    } else {
      updatedSelectedIds.splice(index, 1, ...siteIds);

      // If the company checkbox is unchecked, uncheck all site checkboxes
      if (index !== -1) {
        siteIds.forEach((siteId) => {
          const siteIndex = updatedSelectedIds.indexOf(siteId);
          if (siteIndex !== -1) {
            updatedSelectedIds.splice(siteIndex, 1);
          }
        });
      }
    }

    setSelectedIds(updatedSelectedIds);
  };

  const handleSiteCheckboxChange = (siteId) => {
    const updatedSelectedIds = [...selectedIds];
    const index = updatedSelectedIds.indexOf(siteId);

    if (index === -1) {
      updatedSelectedIds.push(siteId);
    } else {
      updatedSelectedIds.splice(index, 1);
    }

    setSelectedIds(updatedSelectedIds);
  };

  const renderSites = (sites) => {
    return sites.map((site) => (
      <div key={site.id} className="site">
        <input
          type="checkbox"
          id={site.id}
          checked={selectedIds.includes(site.id)}
          onChange={() => handleSiteCheckboxChange(site.id)}
        />
        <label htmlFor={site.id}>{site.site_name}</label>
      </div>
    ));
  };

  const renderCompanies = () => {
    return data?.companies.map((company) => (
      <div key={company.id} className="company">
        <div className="company-header" style={{ background: "Black", color: "#fff" }}>
          <input
            type="checkbox"
            id={`company_${company.id}`}
            checked={selectedIds.includes(company.id)}
            onChange={() => handleCompanyCheckboxChange(company.id)}
          />
          <label htmlFor={`company_${company.id}`}>{company.company_name}</label>
        </div>
        {renderSites(company.sites)}
      </div>
    ));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Assuming you want to make a POST request with selected IDs
      // eslint-disable-next-line no-unused-vars
      const response = await postData('/your/api/endpoint', { selectedIds });
      // Handle the response as needed
    } catch (error) {
      handleError(error);
    }
  };

  return (
    <>
      {isLoading ? <LoaderImg /> : null}
      <form onSubmit={handleSubmit}>
        {renderCompanies()}
        <button type="submit">Submit</button>
      </form>
    </>
  );
};

export default withApi(ManageClient);
