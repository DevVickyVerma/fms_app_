export const Bardata = {
  labels: ["January", "February", "March", "April", "May", "June"],
  datasets: [
    {
      label: "Sales",
      data: [65, 59, 80, 81, 56, 55],
      backgroundColor: "#AFDC8F",
      borderColor: "#AFDC8F",
      borderWidth: 1,
    },
    {
      label: "Sales1",
      data: [65, 59, 80, 81, 56, 55],
      backgroundColor: "#92C5F9",
      borderColor: "#92C5F9",
      borderWidth: 1,
    },
  ],
};
export const Baroptions = {
  responsive: true,
  plugins: {
    legend: {
      display: true,
      position: "top",
    },
    title: {
      display: true,
      text: "",
    },
  },
};
export const countryCodes = [
  { code: "+44", name: "United Kingdom", flag: "🇬🇧", shortName: "UK" },
  { code: "+1", name: "United States", flag: "🇺🇸", shortName: "USA" },
  { code: "+61", name: "Australia", flag: "🇦🇺", shortName: "AUS" },
  { code: "+49", name: "Germany", flag: "🇩🇪", shortName: "GER" },
  { code: "+33", name: "France", flag: "🇫🇷", shortName: "FRA" },
  { code: "+91", name: "India", flag: "🇮🇳", shortName: "IND" },
  { code: "+86", name: "China", flag: "🇨🇳", shortName: "CHN" },
  { code: "+55", name: "Brazil", flag: "🇧🇷", shortName: "BRA" },
  { code: "+81", name: "Japan", flag: "🇯🇵", shortName: "JPN" },
];
export const priceLogData = [
  {
    id: 1,
    productName: "Diesel",
    oldPrice: 100,
    newPrice: 120,
    updatedBy: "Admin",
    updateDate: "2024-11-01",
  },
  {
    id: 2,
    productName: "Unleaded",
    oldPrice: 250,
    newPrice: 230,
    updatedBy: "Manager",
    updateDate: "2024-11-05",
  },
  {
    id: 3,
    productName: "Adblue",
    oldPrice: 400,
    newPrice: 410,
    updatedBy: "Admin",
    updateDate: "2024-11-10",
  },
  {
    id: 4,
    productName: "Super Diesel",
    oldPrice: 80,
    newPrice: 85,
    updatedBy: "Admin",
    updateDate: "2024-11-15",
  },
];
export const Doughnutdata = {
  labels: ["Site 1", "Site 2", "Site 3"],
  datasets: [
    {
      label: "Votes",
      data: [12, 19, 3],
      backgroundColor: ["#92C5F9", "#AFDC8F", "#B6A6E9"],
      borderColor: ["#92C5F9", "#AFDC8F", "#B6A6E9"],
      borderWidth: 1,
    },
  ],
};
export const Doughnutoptions = {
  responsive: true,
  plugins: {
    legend: {
      position: "bottom", // Place the legend at the top
    },
    tooltip: {
      enabled: true, // Enable tooltips on hover
    },
  },
  cutout: "80%", // Adjust the cutout size to make it a donut
};
export const StackedBarChartdata = {
  labels: ["January", "February", "March", "April", "May", "June"],
  datasets: [
    {
      label: "Site 1",
      data: [10, 20, 30, 40, 50, 60],
      backgroundColor: "#92C5F9", // Red
    },
    {
      label: "Site 2",
      data: [15, 25, 35, 45, 55, 65],
      backgroundColor: "#AFDC8F", // Blue
    },
    {
      label: "Site 3",
      data: [5, 10, 15, 20, 25, 30],
      backgroundColor: "#B6A6E9", // Green
    },
  ],
};
export const StackedBarChartoptions = {
  responsive: true,
  plugins: {
    legend: {
      position: "bottom",
    },
    tooltip: {
      enabled: true,
    },
  },
  scales: {
    x: {
      stacked: true, // Stack the X-axis
    },
    y: {
      stacked: true, // Stack the Y-axis
      beginAtZero: true, // Ensure the Y-axis starts at 0
    },
  },
};
export const stockAgingDetails = [
  {
    id: 1,
    itemName: "Site 1",
    quantity: 100,
    stockAge: "30 days",
    lastUpdated: "2024-11-01",
    category: "Electronics",
    status: "Available",
  },
  {
    id: 2,
    itemName: "Site 2",
    quantity: 50,
    stockAge: "60 days",
    lastUpdated: "2024-10-15",
    category: "Furniture",
    status: "Low Stock",
  },
  {
    id: 3,
    itemName: "Site 3",
    quantity: 200,
    stockAge: "15 days",
    lastUpdated: "2024-11-10",
    category: "Clothing",
    status: "Available",
  },
  {
    id: 4,
    itemName: "Site 4",
    quantity: 10,
    stockAge: "90 days",
    lastUpdated: "2024-08-20",
    category: "Food",
    status: "Critical",
  },
];
export const visit = [
  {
    id: 1,
    icon: "fa-firefox",
    heading: "Total Visit",
    data: "834",
    color: "primary",
  },
  {
    id: 2,
    icon: "fa-dollar",
    heading: "Cost per Click",
    data: "$34,516",
    color: "secondary",
  },
  {
    id: 3,
    icon: "fa-comment-o",
    heading: "Investment",
    data: "80%",
    color: "success",
  },
  {
    id: 4,
    icon: "fa-pie-chart",
    heading: "Revenue",
    data: "70k",
    color: "info",
  },
];

export const Tankcolors = [
  { name: "About to Finish", color: "#e84118" },
  { name: "Low Fuel", color: "#ffa801" },
  { name: "Enough Fuel", color: "#009432" },
];

export const StockData = {
  stock_graph_data: {
    labels: [
      "Ramsey Service Station G401",
      "Brewster Street Service Station G400",
      "S. and G.L. Aswat and Sons Ltd.",
    ],
    datasets: [
      {
        label: "Votes",
        data: [46, 79, 15],
        backgroundColor: ["#92C5F9", "#AFDC8F", "#B6A6E9"],
        borderColor: ["#92C5F9", "#AFDC8F", "#B6A6E9"],
        borderWidth: 1,
      },
    ],
  },
  stock_graph_options: {
    responsive: true,
    maintainAspectRatio: false, // Allow custom height and width
    plugins: {
      legend: {
        position: "bottom",
      },
      tooltip: {
        enabled: true,
      },
    },
    cutout: "80%", // Inner cutout for the donut chart
    layout: {
      padding: {
        left: 10,
        right: 10,
        top: 10,
        bottom: 10,
      },
    },
  },
  stock_details: [
    {
      id: "1",
      stock: "Ramsey Service Station G401",
      quantiry: "175",
      aging: "40 days",
    },
    {
      id: "2",
      stock: "Brewster Street Service Station G400",
      quantiry: "145",
      aging: "60 days",
    },
    {
      id: "3",
      stock: "S. and G.L. Aswat and Sons Ltd.",
      quantiry: "115",
      aging: "20 days",
    },
    {
      id: "4",
      stock: "UK Fast Fuels Ltd.",
      quantiry: "215",
      aging: "39 days",
    },
    {
      id: "5",
      stock: "Oakham Service Station",
      quantiry: "86",
      aging: "52 days",
    },
    {
      id: "6",
      stock: "SPALDING SERVICE STATION",
      quantiry: "132",
      aging: "25 days",
    },
    {
      id: "7",
      stock: "Wali`s Enterprises Ltd.",
      quantiry: "40",
      aging: "10 days",
    },
  ],
};
