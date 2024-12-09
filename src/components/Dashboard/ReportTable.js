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
