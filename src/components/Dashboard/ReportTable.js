const ReportTable = ({ reports, handleDownload }) => {


  return (
    <table className="table" style={{ width: "100%" }}>
      <thead>
        <tr>
          <th>Reports</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        {reports?.map((report) => (
          <tr key={report.id} style={{ marginBottom: '10px' }}>
            <td>{report.report_name}</td>
            <td>
              <button onClick={() => handleDownload(report)}>
                <i
                  className="fa fa-download"
                  style={{ fontSize: "18px", color: "#4663ac" }}
                ></i>
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default ReportTable;

// const handleDownload = async (report) => {
//   if (!formik?.values?.selectedMonthDetails?.value) {
//     ErrorToast("Please select Month For Reports");
//   } else {
//     setpdfisLoading(true);
//     try {
//       const formData = new FormData();

//       formData.append("report", report);
//       const superiorRole = localStorage.getItem("superiorRole");
//       if (superiorRole !== "Client") {
//         formData.append("client_id", filters.client_id);
//       } else {
//         formData.append("client_id", filters.client_id);
//       }
//       formData.append("company_id", filters.company_id);


//       let clientIDCondition =
//         superiorRole !== "Client"
//           ? `client_id=${filters.client_id}&`
//           : `client_id=${filters.client_id}&`;


//       const commonParams = `/download-report/${report?.report_code
//         }?${clientIDCondition}company_id=${filters.company_id
//         }&site_id[]=${encodeURIComponent(formik.values?.selectedSite)}&month=${formik?.values?.selectedMonthDetails?.value
//         }`;

//       // API URL for the fetch request
//       const apiUrl = `${process.env.REACT_APP_BASE_URL + commonParams}`;

//       // Fetch the data
//       const token = localStorage.getItem("token");
//       const response = await fetch(apiUrl, {
//         method: "GET",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       // Check if the response is OK
//       if (!response.ok) {
//         //
//         // Await the response body parsing first to get the actual JSON data
//         const errorData = await response.json();
//         ErrorToast(errorData?.message);
//         throw new Error(
//           `Errorsss ${response.status}: ${errorData?.message || "Something went wrong!"
//           }`
//         );
//       }

//       // Handle the file download
//       const blob = await response.blob();
//       const contentType = response.headers.get("Content-Type");
//       let fileExtension = "xlsx"; // Default to xlsx

//       if (contentType) {
//         if (contentType.includes("application/pdf")) {
//           fileExtension = "pdf";
//         } else if (
//           contentType.includes(
//             "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
//           )
//         ) {
//           fileExtension = "xlsx";
//         } else if (contentType.includes("text/csv")) {
//           fileExtension = "csv";
//         }
//       }

//       // Create a temporary URL for the Blob
//       const url = window.URL.createObjectURL(new Blob([blob]));

//       // Create a link element and trigger the download
//       const link = document.createElement("a");
//       link.href = url;
//       link.setAttribute(
//         "download",
//         `${report?.report_name}.${fileExtension}`
//       );
//       document.body.appendChild(link);
//       link.click();

//       // Cleanup
//       link.parentNode.removeChild(link);
//     } catch (error) {
//       console.error("Error downloading the file:", error);
//     } finally {
//       setpdfisLoading(false);
//     }
//   }
// };