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

// Options for the chart
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

export const DummygetSiteStats = {
  api_response: "success",
  status_code: "200",
  message: "Site info has been fetched successfully",
  data: {
    stock_alert: {
      "D(T1)": [
        {
          date: "2024-09-26",
          days_left: "2.87",
          tank_name: "D(T1)",
          capacity: 13065.38,
          ullage: "10249.34",
          ullage_percentage: "78.44",
          fuel_left: "2816.04",
          bg_color: "#ffa801",
          font_color: "#000000",
          fuel_left_percentage: "21.55",
          status: "medium",
          message: "Tank D(T1) has low volume",
          average_sale: "978.19",
        },
        {
          date: "2024-09-27",
          days_left: "1.87",
          tank_name: "D(T1)",
          capacity: 13065.38,
          ullage: "11227.53",
          ullage_percentage: "85.93",
          fuel_left: "1837.85",
          bg_color: "#e84118",
          font_color: "#000000",
          fuel_left_percentage: "14.06",
          status: "low",
          message: "Tank D(T1) has low volume",
          average_sale: "978.19",
        },
        {
          date: "2024-09-28",
          days_left: "0.87",
          tank_name: "D(T1)",
          capacity: 13065.38,
          ullage: "12205.72",
          ullage_percentage: "93.42",
          fuel_left: "859.66",
          bg_color: "#e84118",
          font_color: "#000000",
          fuel_left_percentage: "6.57",
          status: "low",
          message: "Tank D(T1) has low volume",
          average_sale: "978.19",
        },
        {
          date: "2024-09-29",
          days_left: 0,
          tank_name: "D(T1)",
          capacity: 13065.38,
          ullage: 13065.38,
          ullage_percentage: 100,
          fuel_left: 0,
          bg_color: "#e84118",
          font_color: "#000000",
          fuel_left_percentage: 0,
          status: "low",
          message: "Stock Out D(T1)",
          average_sale: "978.19",
        },
        {
          date: "2024-09-30",
          days_left: 0,
          tank_name: "D(T1)",
          capacity: 13065.38,
          ullage: 13065.38,
          ullage_percentage: 100,
          fuel_left: 0,
          bg_color: "#e84118",
          font_color: "#000000",
          fuel_left_percentage: 0,
          status: "low",
          message: "Stock Out D(T1)",
          average_sale: "978.19",
        },
        {
          date: "2024-10-01",
          days_left: 0,
          tank_name: "D(T1)",
          capacity: 13065.38,
          ullage: 13065.38,
          ullage_percentage: 100,
          fuel_left: 0,
          bg_color: "#e84118",
          font_color: "#000000",
          fuel_left_percentage: 0,
          status: "low",
          message: "Stock Out D(T1)",
          average_sale: "978.19",
        },
        {
          date: "2024-10-02",
          days_left: 0,
          tank_name: "D(T1)",
          capacity: 13065.38,
          ullage: 13065.38,
          ullage_percentage: 100,
          fuel_left: 0,
          bg_color: "#e84118",
          font_color: "#000000",
          fuel_left_percentage: 0,
          status: "low",
          message: "Stock Out D(T1)",
          average_sale: "978.19",
        },
      ],
      "U(T2)": [
        {
          date: "2024-09-26",
          days_left: "6.11",
          tank_name: "U(T2)",
          capacity: 21053,
          ullage: "11329.33",
          ullage_percentage: "53.81",
          fuel_left: "9723.67",
          bg_color: "#009432",
          font_color: "#000000",
          fuel_left_percentage: "46.18",
          status: "high",
          message: "",
          average_sale: "1589.31",
        },
        {
          date: "2024-09-27",
          days_left: "5.11",
          tank_name: "U(T2)",
          capacity: 21053,
          ullage: "12918.64",
          ullage_percentage: "61.36",
          fuel_left: "8134.36",
          bg_color: "#009432",
          font_color: "#000000",
          fuel_left_percentage: "38.63",
          status: "high",
          message: "",
          average_sale: "1589.31",
        },
        {
          date: "2024-09-28",
          days_left: "4.11",
          tank_name: "U(T2)",
          capacity: 21053,
          ullage: "14507.95",
          ullage_percentage: "68.91",
          fuel_left: "6545.05",
          bg_color: "#ffa801",
          font_color: "#000000",
          fuel_left_percentage: "31.08",
          status: "medium",
          message: "",
          average_sale: "1589.31",
        },
        {
          date: "2024-09-29",
          days_left: "3.11",
          tank_name: "U(T2)",
          capacity: 21053,
          ullage: "16097.26",
          ullage_percentage: "76.46",
          fuel_left: "4955.74",
          bg_color: "#ffa801",
          font_color: "#000000",
          fuel_left_percentage: "23.53",
          status: "medium",
          message: "",
          average_sale: "1589.31",
        },
        {
          date: "2024-09-30",
          days_left: "2.11",
          tank_name: "U(T2)",
          capacity: 21053,
          ullage: "17686.57",
          ullage_percentage: "84.00",
          fuel_left: "3366.43",
          bg_color: "#ffa801",
          font_color: "#000000",
          fuel_left_percentage: "15.99",
          status: "medium",
          message: "",
          average_sale: "1589.31",
        },
        {
          date: "2024-10-01",
          days_left: "1.11",
          tank_name: "U(T2)",
          capacity: 21053,
          ullage: "19275.88",
          ullage_percentage: "91.55",
          fuel_left: "1777.12",
          bg_color: "#e84118",
          font_color: "#000000",
          fuel_left_percentage: "8.44",
          status: "low",
          message: "Tank U(T2) has low volume",
          average_sale: "1589.31",
        },
        {
          date: "2024-10-02",
          days_left: "0.11",
          tank_name: "U(T2)",
          capacity: 21053,
          ullage: "20865.19",
          ullage_percentage: "99.10",
          fuel_left: "187.81",
          bg_color: "#e84118",
          font_color: "#000000",
          fuel_left_percentage: "0.89",
          status: "low",
          message: "Tank U(T2) has low volume",
          average_sale: "1589.31",
        },
      ],
      "D(T3)": [
        {
          date: "2024-09-26",
          days_left: "4.79",
          tank_name: "D(T3)",
          capacity: 25072,
          ullage: "17842.65",
          ullage_percentage: "71.16",
          fuel_left: "7229.35",
          bg_color: "#ffa801",
          font_color: "#000000",
          fuel_left_percentage: "28.83",
          status: "medium",
          message: "",
          average_sale: "1508.83",
        },
        {
          date: "2024-09-27",
          days_left: "3.79",
          tank_name: "D(T3)",
          capacity: 25072,
          ullage: "19351.48",
          ullage_percentage: "77.18",
          fuel_left: "5720.52",
          bg_color: "#ffa801",
          font_color: "#000000",
          fuel_left_percentage: "22.81",
          status: "medium",
          message: "",
          average_sale: "1508.83",
        },
        {
          date: "2024-09-28",
          days_left: "2.79",
          tank_name: "D(T3)",
          capacity: 25072,
          ullage: "20860.31",
          ullage_percentage: "83.20",
          fuel_left: "4211.69",
          bg_color: "#ffa801",
          font_color: "#000000",
          fuel_left_percentage: "16.79",
          status: "medium",
          message: "",
          average_sale: "1508.83",
        },
        {
          date: "2024-09-29",
          days_left: "1.79",
          tank_name: "D(T3)",
          capacity: 25072,
          ullage: "22369.14",
          ullage_percentage: "89.21",
          fuel_left: "2702.86",
          bg_color: "#e84118",
          font_color: "#000000",
          fuel_left_percentage: "10.78",
          status: "low",
          message: "Tank D(T3) has low volume",
          average_sale: "1508.83",
        },
        {
          date: "2024-09-30",
          days_left: "0.79",
          tank_name: "D(T3)",
          capacity: 25072,
          ullage: "23877.97",
          ullage_percentage: "95.23",
          fuel_left: "1194.03",
          bg_color: "#e84118",
          font_color: "#000000",
          fuel_left_percentage: "4.76",
          status: "low",
          message: "Tank D(T3) has low volume",
          average_sale: "1508.83",
        },
        {
          date: "2024-10-01",
          days_left: 0,
          tank_name: "D(T3)",
          capacity: 25072,
          ullage: 25072,
          ullage_percentage: 100,
          fuel_left: 0,
          bg_color: "#e84118",
          font_color: "#000000",
          fuel_left_percentage: 0,
          status: "low",
          message: "Stock Out D(T3)",
          average_sale: "1508.83",
        },
        {
          date: "2024-10-02",
          days_left: 0,
          tank_name: "D(T3)",
          capacity: 25072,
          ullage: 25072,
          ullage_percentage: 100,
          fuel_left: 0,
          bg_color: "#e84118",
          font_color: "#000000",
          fuel_left_percentage: 0,
          status: "low",
          message: "Stock Out D(T3)",
          average_sale: "1508.83",
        },
      ],
      "U(T4)": [
        {
          date: "2024-09-26",
          days_left: "9.50",
          tank_name: "U(T4)",
          capacity: 25084,
          ullage: "15197.58",
          ullage_percentage: "60.58",
          fuel_left: "9886.42",
          bg_color: "#009432",
          font_color: "#000000",
          fuel_left_percentage: "39.41",
          status: "high",
          message: "",
          average_sale: "1040.53",
        },
        {
          date: "2024-09-27",
          days_left: "8.50",
          tank_name: "U(T4)",
          capacity: 25084,
          ullage: "16238.11",
          ullage_percentage: "64.73",
          fuel_left: "8845.89",
          bg_color: "#009432",
          font_color: "#000000",
          fuel_left_percentage: "35.26",
          status: "high",
          message: "",
          average_sale: "1040.53",
        },
        {
          date: "2024-09-28",
          days_left: "7.50",
          tank_name: "U(T4)",
          capacity: 25084,
          ullage: "17278.64",
          ullage_percentage: "68.88",
          fuel_left: "7805.36",
          bg_color: "#009432",
          font_color: "#000000",
          fuel_left_percentage: "31.11",
          status: "high",
          message: "",
          average_sale: "1040.53",
        },
        {
          date: "2024-09-29",
          days_left: "6.50",
          tank_name: "U(T4)",
          capacity: 25084,
          ullage: "18319.17",
          ullage_percentage: "73.03",
          fuel_left: "6764.83",
          bg_color: "#009432",
          font_color: "#000000",
          fuel_left_percentage: "26.96",
          status: "high",
          message: "",
          average_sale: "1040.53",
        },
        {
          date: "2024-09-30",
          days_left: "5.50",
          tank_name: "U(T4)",
          capacity: 25084,
          ullage: "19359.70",
          ullage_percentage: "77.17",
          fuel_left: "5724.30",
          bg_color: "#009432",
          font_color: "#000000",
          fuel_left_percentage: "22.82",
          status: "high",
          message: "",
          average_sale: "1040.53",
        },
        {
          date: "2024-10-01",
          days_left: "4.50",
          tank_name: "U(T4)",
          capacity: 25084,
          ullage: "20400.23",
          ullage_percentage: "81.32",
          fuel_left: "4683.77",
          bg_color: "#ffa801",
          font_color: "#000000",
          fuel_left_percentage: "18.67",
          status: "medium",
          message: "",
          average_sale: "1040.53",
        },
        {
          date: "2024-10-02",
          days_left: "3.50",
          tank_name: "U(T4)",
          capacity: 25084,
          ullage: "21440.76",
          ullage_percentage: "85.47",
          fuel_left: "3643.24",
          bg_color: "#ffa801",
          font_color: "#000000",
          fuel_left_percentage: "14.52",
          status: "medium",
          message: "",
          average_sale: "1040.53",
        },
      ],
      "VU(T5)": [
        {
          date: "2024-09-26",
          days_left: "2.08",
          tank_name: "VU(T5)",
          capacity: 13068.38,
          ullage: "11789.05",
          ullage_percentage: "90.21",
          fuel_left: "1279.33",
          bg_color: "#e84118",
          font_color: "#000000",
          fuel_left_percentage: "9.78",
          status: "low",
          message: "Tank VU(T5) has low volume",
          average_sale: "613.14",
        },
        {
          date: "2024-09-27",
          days_left: "1.08",
          tank_name: "VU(T5)",
          capacity: 13068.38,
          ullage: "12402.19",
          ullage_percentage: "94.90",
          fuel_left: "666.19",
          bg_color: "#e84118",
          font_color: "#000000",
          fuel_left_percentage: "5.09",
          status: "low",
          message: "Tank VU(T5) has low volume",
          average_sale: "613.14",
        },
        {
          date: "2024-09-28",
          days_left: "0.08",
          tank_name: "VU(T5)",
          capacity: 13068.38,
          ullage: "13015.33",
          ullage_percentage: "99.59",
          fuel_left: "53.05",
          bg_color: "#e84118",
          font_color: "#000000",
          fuel_left_percentage: "0.40",
          status: "low",
          message: "Tank VU(T5) has low volume",
          average_sale: "613.14",
        },
        {
          date: "2024-09-29",
          days_left: 0,
          tank_name: "VU(T5)",
          capacity: 13068.38,
          ullage: 13068.38,
          ullage_percentage: 100,
          fuel_left: 0,
          bg_color: "#e84118",
          font_color: "#000000",
          fuel_left_percentage: 0,
          status: "low",
          message: "Stock Out VU(T5)",
          average_sale: "613.14",
        },
        {
          date: "2024-09-30",
          days_left: 0,
          tank_name: "VU(T5)",
          capacity: 13068.38,
          ullage: 13068.38,
          ullage_percentage: 100,
          fuel_left: 0,
          bg_color: "#e84118",
          font_color: "#000000",
          fuel_left_percentage: 0,
          status: "low",
          message: "Stock Out VU(T5)",
          average_sale: "613.14",
        },
        {
          date: "2024-10-01",
          days_left: 0,
          tank_name: "VU(T5)",
          capacity: 13068.38,
          ullage: 13068.38,
          ullage_percentage: 100,
          fuel_left: 0,
          bg_color: "#e84118",
          font_color: "#000000",
          fuel_left_percentage: 0,
          status: "low",
          message: "Stock Out VU(T5)",
          average_sale: "613.14",
        },
        {
          date: "2024-10-02",
          days_left: 0,
          tank_name: "VU(T5)",
          capacity: 13068.38,
          ullage: 13068.38,
          ullage_percentage: 100,
          fuel_left: 0,
          bg_color: "#e84118",
          font_color: "#000000",
          fuel_left_percentage: 0,
          status: "low",
          message: "Stock Out VU(T5)",
          average_sale: "613.14",
        },
      ],
      "VD(T6)": [
        {
          date: "2024-09-26",
          days_left: "6.87",
          tank_name: "VD(T6)",
          capacity: 10000,
          ullage: "7925.82",
          ullage_percentage: "79.25",
          fuel_left: "2074.18",
          bg_color: "#009432",
          font_color: "#000000",
          fuel_left_percentage: "20.74",
          status: "high",
          message: "",
          average_sale: "301.59",
        },
        {
          date: "2024-09-27",
          days_left: "5.87",
          tank_name: "VD(T6)",
          capacity: 10000,
          ullage: "8227.41",
          ullage_percentage: "82.27",
          fuel_left: "1772.59",
          bg_color: "#009432",
          font_color: "#000000",
          fuel_left_percentage: "17.72",
          status: "high",
          message: "",
          average_sale: "301.59",
        },
        {
          date: "2024-09-28",
          days_left: "4.87",
          tank_name: "VD(T6)",
          capacity: 10000,
          ullage: "8529.00",
          ullage_percentage: "85.29",
          fuel_left: "1471.00",
          bg_color: "#ffa801",
          font_color: "#000000",
          fuel_left_percentage: "14.71",
          status: "medium",
          message: "",
          average_sale: "301.59",
        },
        {
          date: "2024-09-29",
          days_left: "3.87",
          tank_name: "VD(T6)",
          capacity: 10000,
          ullage: "8830.59",
          ullage_percentage: "88.30",
          fuel_left: "1169.41",
          bg_color: "#ffa801",
          font_color: "#000000",
          fuel_left_percentage: "11.69",
          status: "medium",
          message: "",
          average_sale: "301.59",
        },
        {
          date: "2024-09-30",
          days_left: "2.87",
          tank_name: "VD(T6)",
          capacity: 10000,
          ullage: "9132.18",
          ullage_percentage: "91.32",
          fuel_left: "867.82",
          bg_color: "#ffa801",
          font_color: "#000000",
          fuel_left_percentage: "8.67",
          status: "medium",
          message: "",
          average_sale: "301.59",
        },
        {
          date: "2024-10-01",
          days_left: "1.87",
          tank_name: "VD(T6)",
          capacity: 10000,
          ullage: "9433.77",
          ullage_percentage: "94.33",
          fuel_left: "566.23",
          bg_color: "#e84118",
          font_color: "#000000",
          fuel_left_percentage: "5.66",
          status: "low",
          message: "Tank VD(T6) has low volume",
          average_sale: "301.59",
        },
        {
          date: "2024-10-02",
          days_left: "0.87",
          tank_name: "VD(T6)",
          capacity: 10000,
          ullage: "9735.36",
          ullage_percentage: "97.35",
          fuel_left: "264.64",
          bg_color: "#e84118",
          font_color: "#000000",
          fuel_left_percentage: "2.64",
          status: "low",
          message: "Tank VD(T6) has low volume",
          average_sale: "301.59",
        },
      ],
      "AB(T7)": [
        {
          date: "2024-09-26",
          days_left: "76.95",
          tank_name: "AB(T7)",
          capacity: 1965,
          ullage: "182.00",
          ullage_percentage: "9.26",
          fuel_left: "1783.00",
          bg_color: "#009432",
          font_color: "#000000",
          fuel_left_percentage: "90.73",
          status: "high",
          message: "",
          average_sale: "23.17",
        },
        {
          date: "2024-09-27",
          days_left: "75.95",
          tank_name: "AB(T7)",
          capacity: 1965,
          ullage: "205.17",
          ullage_percentage: "10.44",
          fuel_left: "1759.83",
          bg_color: "#009432",
          font_color: "#000000",
          fuel_left_percentage: "89.55",
          status: "high",
          message: "",
          average_sale: "23.17",
        },
        {
          date: "2024-09-28",
          days_left: "74.95",
          tank_name: "AB(T7)",
          capacity: 1965,
          ullage: "228.34",
          ullage_percentage: "11.62",
          fuel_left: "1736.66",
          bg_color: "#009432",
          font_color: "#000000",
          fuel_left_percentage: "88.37",
          status: "high",
          message: "",
          average_sale: "23.17",
        },
        {
          date: "2024-09-29",
          days_left: "73.95",
          tank_name: "AB(T7)",
          capacity: 1965,
          ullage: "251.51",
          ullage_percentage: "12.79",
          fuel_left: "1713.49",
          bg_color: "#009432",
          font_color: "#000000",
          fuel_left_percentage: "87.20",
          status: "high",
          message: "",
          average_sale: "23.17",
        },
        {
          date: "2024-09-30",
          days_left: "72.95",
          tank_name: "AB(T7)",
          capacity: 1965,
          ullage: "274.68",
          ullage_percentage: "13.97",
          fuel_left: "1690.32",
          bg_color: "#009432",
          font_color: "#000000",
          fuel_left_percentage: "86.02",
          status: "high",
          message: "",
          average_sale: "23.17",
        },
        {
          date: "2024-10-01",
          days_left: "71.95",
          tank_name: "AB(T7)",
          capacity: 1965,
          ullage: "297.85",
          ullage_percentage: "15.15",
          fuel_left: "1667.15",
          bg_color: "#009432",
          font_color: "#000000",
          fuel_left_percentage: "84.84",
          status: "high",
          message: "",
          average_sale: "23.17",
        },
        {
          date: "2024-10-02",
          days_left: "70.95",
          tank_name: "AB(T7)",
          capacity: 1965,
          ullage: "321.02",
          ullage_percentage: "16.33",
          fuel_left: "1643.98",
          bg_color: "#009432",
          font_color: "#000000",
          fuel_left_percentage: "83.66",
          status: "high",
          message: "",
          average_sale: "23.17",
        },
      ],
    },
    cash_tracker: {
      alert_status: false,
      message: "",
      security_amount: "£15000",
      cash_amount: "£275.49",
      last_loomis_date: "2024-02-09",
      last_loomis_day: "Friday",
    },
    dates: [
      "2024-09-26",
      "2024-09-27",
      "2024-09-28",
      "2024-09-29",
      "2024-09-30",
      "2024-10-01",
      "2024-10-02",
    ],
    siteInfo: 7,
    site_name: "Site 1",
    site_image: "https://apis-l.credentiauk.com/splr/shell-logo.png",
    opening: "2024-09-24 17:40:56",
    closing: "2024-09-25 17:41:53",
    last_dayend: "2024-09-25",
    firstTrans: "2024-09-24 23:32:32",
    dateString: "01 Sep - 26 Sep",
  },
};

export const Tankcolors = [
  { name: "About to Finish", color: "#e84118" },
  { name: "Low Fuel", color: "#ffa801" },
  { name: "Enough Fuel", color: "#009432" },
];

export const TopPerformers = [
  {
    id: "Vk1tRWpGNlZYdDNkbkVIQlg1UTBVZz09",
    name: "Amersham ",
    image: "https://apis-l.credentia.uk/splr/shell-logo.png",
    fuel_volume: {
      gross_volume: "17493.09",
      bunkered_volume: "0.0",
      total_volume: "17493.09",
      status: "up",
      percentage: "5.98",
    },
    fuel_sales: {
      gross_value: "21305.02",
      bunkered_value: "0.0",
      total_value: "21305.02",
      status: "up",
      percentage: "9.39",
    },
    gross_profit: {
      gross_profit: 3419.35,
      gross_margin: 19.55,
      status: "up",
      percentage: "13.76",
    },
    gross_margin: {
      gross_margin: 19.55,
      is_ppl: 0,
      ppl_msg: "",
      status: "up",
      percentage: "7.36",
    },
    shop_sales: {
      shop_sales: "4306.84",
      shop_margin: "2358.7",
      status: "up",
      percentage: "13.62",
      p_status: "up",
      p_percentage: "10.08",
    },
    shop_profit: {
      shop_profit: "2358.7",
      status: "up",
      percentage: "10.08",
    },
    shop_fees: {
      shop_fee: "393.6",
      status: "up",
      percentage: "0.0",
    },
  },
  {
    id: "VEttejdBRlRMWDRnUTdlRkdLK1hrZz09",
    name: "Belgrave ",
    image: "https://apis-l.credentia.uk/splr/bp-logo.png",
    fuel_volume: {
      gross_volume: "14634.16",
      bunkered_volume: "0.0",
      total_volume: "14634.16",
      status: "down",
      percentage: "-5.66",
    },
    fuel_sales: {
      gross_value: "17249.99",
      bunkered_value: "0.0",
      total_value: "17249.99",
      status: "down",
      percentage: "-4.34",
    },
    gross_profit: {
      gross_profit: 1721.31,
      gross_margin: 11.76,
      status: "down",
      percentage: "-43.17",
    },
    gross_margin: {
      gross_margin: 11.76,
      is_ppl: 0,
      ppl_msg: "",
      status: "down",
      percentage: "-39.78",
    },
    shop_sales: {
      shop_sales: "1775.81",
      shop_margin: "813.01",
      status: "down",
      percentage: "-12.86",
      p_status: "down",
      p_percentage: "-15.49",
    },
    shop_profit: {
      shop_profit: "813.01",
      status: "down",
      percentage: "-15.49",
    },
    shop_fees: {
      shop_fee: "150.4",
      status: "up",
      percentage: "0.0",
    },
  },
  {
    id: "SERQa05pZktwNTVFL2RCMCtxdWQrdz09",
    name: "Wexham ",
    image: "https://apis-l.credentia.uk/splr/bp-logo.png",
    fuel_volume: {
      gross_volume: "17453.42",
      bunkered_volume: "0.0",
      total_volume: "17453.42",
      status: "down",
      percentage: "-47.73",
    },
    fuel_sales: {
      gross_value: "20998.55",
      bunkered_value: "0.0",
      total_value: "20998.55",
      status: "down",
      percentage: "-46.59",
    },
    gross_profit: {
      gross_profit: 2742.37,
      gross_margin: 15.71,
      status: "down",
      percentage: "-47.09",
    },
    gross_margin: {
      gross_margin: 15.71,
      is_ppl: 0,
      ppl_msg: "",
      status: "up",
      percentage: "1.22",
    },
    shop_sales: {
      shop_sales: "3122.3",
      shop_margin: "1449.06",
      status: "down",
      percentage: "-50.66",
      p_status: "down",
      p_percentage: "-55.41",
    },
    shop_profit: {
      shop_profit: "1449.06",
      status: "down",
      percentage: "-55.41",
    },
    shop_fees: {
      shop_fee: "288.0",
      status: "down",
      percentage: "-50.0",
    },
  },
  {
    id: "cDd2VGlMRzRYUE5vdEFLcEJpZVY1Zz09",
    name: "Park Royal",
    image: "https://apis-l.credentia.uk/splr/greenergy-logo.png",
    fuel_volume: {
      gross_volume: "22786.17",
      bunkered_volume: "7433.49",
      total_volume: "30219.66",
      status: "down",
      percentage: "-14.75",
    },
    fuel_sales: {
      gross_value: "27446.19",
      bunkered_value: "10845.44",
      total_value: "38291.63",
      status: "down",
      percentage: "-13.2",
    },
    gross_profit: {
      gross_profit: 5948.34,
      gross_margin: 19.68,
      status: "up",
      percentage: "1.34",
    },
    gross_margin: {
      gross_margin: 19.68,
      is_ppl: 0,
      ppl_msg: "",
      status: "up",
      percentage: "11.82",
    },
    shop_sales: {
      shop_sales: "7432.84",
      shop_margin: "3187.71",
      status: "down",
      percentage: "-11.82",
      p_status: "down",
      p_percentage: "-10.9",
    },
    shop_profit: {
      shop_profit: "3187.71",
      status: "down",
      percentage: "-10.9",
    },
    shop_fees: {
      shop_fee: "768.0",
      status: "up",
      percentage: "0.0",
    },
  },
  {
    id: "L3J6ckhTNy9ZdmFxU3djM3BwK0VBZz09",
    name: "Astwick ",
    image: "https://apis-l.credentia.uk/splr/bp-logo.png",
    fuel_volume: {
      gross_volume: "15855.06",
      bunkered_volume: "5444.89",
      total_volume: "21299.95",
      status: "down",
      percentage: "-15.0",
    },
    fuel_sales: {
      gross_value: "20210.96",
      bunkered_value: "8543.01",
      total_value: "28753.97",
      status: "down",
      percentage: "-13.99",
    },
    gross_profit: {
      gross_profit: 5226.09,
      gross_margin: 24.54,
      status: "down",
      percentage: "-5.88",
    },
    gross_margin: {
      gross_margin: 24.54,
      is_ppl: 0,
      ppl_msg: "",
      status: "up",
      percentage: "6.19",
    },
    shop_sales: {
      shop_sales: "4128.02",
      shop_margin: "2089.66",
      status: "down",
      percentage: "-25.19",
      p_status: "down",
      p_percentage: "-23.78",
    },
    shop_profit: {
      shop_profit: "2089.66",
      status: "down",
      percentage: "-23.78",
    },
    shop_fees: {
      shop_fee: "460.8",
      status: "up",
      percentage: "0.0",
    },
  },
  {
    id: "U2wrWHB3T0FOSXRvV2lDUXg3cktUdz09",
    name: "Girton",
    image: "https://apis-l.credentia.uk/splr/bp-logo.png",
    fuel_volume: {
      gross_volume: "21961.03",
      bunkered_volume: "0.0",
      total_volume: "21961.03",
      status: "up",
      percentage: "6.81",
    },
    fuel_sales: {
      gross_value: "26188.62",
      bunkered_value: "0.0",
      total_value: "26188.62",
      status: "up",
      percentage: "7.93",
    },
    gross_profit: {
      gross_profit: 3886.49,
      gross_margin: 17.7,
      status: "up",
      percentage: "15.7",
    },
    gross_margin: {
      gross_margin: 17.7,
      is_ppl: 0,
      ppl_msg: "",
      status: "up",
      percentage: "8.32",
    },
    shop_sales: {
      shop_sales: "4871.26",
      shop_margin: "2472.16",
      status: "up",
      percentage: "4.06",
      p_status: "up",
      p_percentage: "2.62",
    },
    shop_profit: {
      shop_profit: "2472.16",
      status: "up",
      percentage: "2.62",
    },
    shop_fees: {
      shop_fee: "530.4",
      status: "up",
      percentage: "0.0",
    },
  },
  {
    id: "TjlpY21FU2kzc2kyTHVJMFJUR0FPZz09",
    name: "Gravesend ",
    image: "https://apis-l.credentia.uk/splr/greenergy-logo.png",
    fuel_volume: {
      gross_volume: "13163.8",
      bunkered_volume: "580.44",
      total_volume: "13744.24",
      status: "up",
      percentage: "5.8",
    },
    fuel_sales: {
      gross_value: "15246.53",
      bunkered_value: "823.64",
      total_value: "16070.17",
      status: "up",
      percentage: "6.46",
    },
    gross_profit: {
      gross_profit: 2137.58,
      gross_margin: 15.55,
      status: "up",
      percentage: "17.2",
    },
    gross_margin: {
      gross_margin: 15.55,
      is_ppl: 0,
      ppl_msg: "",
      status: "up",
      percentage: "10.68",
    },
    shop_sales: {
      shop_sales: "3523.39",
      shop_margin: "1497.82",
      status: "down",
      percentage: "-17.56",
      p_status: "down",
      p_percentage: "-26.12",
    },
    shop_profit: {
      shop_profit: "1497.82",
      status: "down",
      percentage: "-26.12",
    },
    shop_fees: {
      shop_fee: "313.6",
      status: "up",
      percentage: "0.0",
    },
  },
  {
    id: "V0wyR0Y4YUJmM0NJcGVqNXUzUWtaQT09",
    name: "Patcham ",
    image: "https://apis-l.credentia.uk/splr/greenergy-logo.png",
    fuel_volume: {
      gross_volume: "18921.14",
      bunkered_volume: "709.43",
      total_volume: "19630.57",
      status: "up",
      percentage: "9.92",
    },
    fuel_sales: {
      gross_value: "22635.11",
      bunkered_value: "1028.59",
      total_value: "23663.7",
      status: "up",
      percentage: "11.3",
    },
    gross_profit: {
      gross_profit: 3818.99,
      gross_margin: 19.45,
      status: "up",
      percentage: "25.72",
    },
    gross_margin: {
      gross_margin: 19.45,
      is_ppl: 0,
      ppl_msg: "",
      status: "up",
      percentage: "19.69",
    },
    shop_sales: {
      shop_sales: "2378.53",
      shop_margin: "1632.03",
      status: "down",
      percentage: "-12.76",
      p_status: "down",
      p_percentage: "-11.76",
    },
    shop_profit: {
      shop_profit: "1632.03",
      status: "down",
      percentage: "-11.76",
    },
    shop_fees: {
      shop_fee: "268.8",
      status: "up",
      percentage: "0.0",
    },
  },
  {
    id: "MkJWd25aSTlDekVwcWg4azgrNVh3UT09",
    name: "Anson ",
    image: "https://apis-l.credentia.uk/splr/bp-logo.png",
    fuel_volume: {
      gross_volume: "24941.13",
      bunkered_volume: "26.35",
      total_volume: "24967.48",
      status: "down",
      percentage: "-3.77",
    },
    fuel_sales: {
      gross_value: "29451.64",
      bunkered_value: "37.65",
      total_value: "29489.29",
      status: "down",
      percentage: "-3.28",
    },
    gross_profit: {
      gross_profit: 4038.78,
      gross_margin: 16.18,
      status: "down",
      percentage: "-0.93",
    },
    gross_margin: {
      gross_margin: 16.18,
      is_ppl: 0,
      ppl_msg: "",
      status: "up",
      percentage: "2.86",
    },
    shop_sales: {
      shop_sales: "2703.01",
      shop_margin: "1265.85",
      status: "down",
      percentage: "-20.65",
      p_status: "down",
      p_percentage: "-12.12",
    },
    shop_profit: {
      shop_profit: "1265.85",
      status: "down",
      percentage: "-12.12",
    },
    shop_fees: {
      shop_fee: "240.0",
      status: "up",
      percentage: "0.0",
    },
  },
  {
    id: "YzhQcFZPRzJGcjJKQTdNV3Q0YWJQQT09",
    name: "Baddesley",
    image: "https://apis-l.credentia.uk/splr/bp-logo.png",
    fuel_volume: {
      gross_volume: "16901.18",
      bunkered_volume: "70.15",
      total_volume: "16971.33",
      status: "down",
      percentage: "-2.63",
    },
    fuel_sales: {
      gross_value: "19871.17",
      bunkered_value: "100.95",
      total_value: "19972.12",
      status: "down",
      percentage: "-2.0",
    },
    gross_profit: {
      gross_profit: 2605.88,
      gross_margin: 15.35,
      status: "up",
      percentage: "0.13",
    },
    gross_margin: {
      gross_margin: 15.35,
      is_ppl: 0,
      ppl_msg: "",
      status: "up",
      percentage: "2.54",
    },
    shop_sales: {
      shop_sales: "1929.5",
      shop_margin: "817.24",
      status: "up",
      percentage: "6.88",
      p_status: "down",
      p_percentage: "-9.48",
    },
    shop_profit: {
      shop_profit: "817.24",
      status: "down",
      percentage: "-9.48",
    },
    shop_fees: {
      shop_fee: "163.2",
      status: "down",
      percentage: "-10.53",
    },
  },
  {
    id: "Y1BYWW83YmxDSWhYNkNXQ0lwZFJRUT09",
    name: "Swanley",
    image: "https://apis-l.credentia.uk/splr/bp-logo.png",
    fuel_volume: {
      gross_volume: "17056.51",
      bunkered_volume: "0.0",
      total_volume: "17056.51",
      status: "up",
      percentage: "20.34",
    },
    fuel_sales: {
      gross_value: "20288.74",
      bunkered_value: "0.0",
      total_value: "20288.74",
      status: "up",
      percentage: "22.66",
    },
    gross_profit: {
      gross_profit: 2931.82,
      gross_margin: 17.19,
      status: "up",
      percentage: "38.58",
    },
    gross_margin: {
      gross_margin: 17.19,
      is_ppl: 0,
      ppl_msg: "",
      status: "up",
      percentage: "15.14",
    },
    shop_sales: {
      shop_sales: "5432.73",
      shop_margin: "2499.43",
      status: "down",
      percentage: "-8.38",
      p_status: "down",
      p_percentage: "-14.36",
    },
    shop_profit: {
      shop_profit: "2499.43",
      status: "down",
      percentage: "-14.36",
    },
    shop_fees: {
      shop_fee: "560.0",
      status: "up",
      percentage: "0.0",
    },
  },
  {
    id: "Zm1qRXhGeW5aQTI2YnNzMm5wekE4QT09",
    name: "Vineyard ",
    image: "https://apis-l.credentia.uk/splr/bp-logo.png",
    fuel_volume: {
      gross_volume: "22035.78",
      bunkered_volume: "0.0",
      total_volume: "22035.78",
      status: "up",
      percentage: "6.9",
    },
    fuel_sales: {
      gross_value: "26821.35",
      bunkered_value: "0.0",
      total_value: "26821.35",
      status: "up",
      percentage: "10.76",
    },
    gross_profit: {
      gross_profit: 4203.13,
      gross_margin: 19.07,
      status: "up",
      percentage: "48.69",
    },
    gross_margin: {
      gross_margin: 19.07,
      is_ppl: 0,
      ppl_msg: "",
      status: "up",
      percentage: "39.1",
    },
    shop_sales: {
      shop_sales: "2465.18",
      shop_margin: "2346.56",
      status: "up",
      percentage: "7.57",
      p_status: "up",
      p_percentage: "8.97",
    },
    shop_profit: {
      shop_profit: "2346.56",
      status: "up",
      percentage: "8.97",
    },
    shop_fees: {
      shop_fee: "163.2",
      status: "up",
      percentage: "0.0",
    },
  },
  {
    id: "OUNrS016Ym93czZsVzlMOHNkSE9hZz09",
    name: "Erith ",
    image: "https://apis-l.credentia.uk/splr/bp-logo.png",
    fuel_volume: {
      gross_volume: "23326.54",
      bunkered_volume: "1016.21",
      total_volume: "24342.75",
      status: "down",
      percentage: "-7.23",
    },
    fuel_sales: {
      gross_value: "27939.36",
      bunkered_value: "1472.5",
      total_value: "29411.86",
      status: "down",
      percentage: "-5.87",
    },
    gross_profit: {
      gross_profit: 4219.15,
      gross_margin: 17.33,
      status: "down",
      percentage: "-4.81",
    },
    gross_margin: {
      gross_margin: 17.33,
      is_ppl: 0,
      ppl_msg: "",
      status: "up",
      percentage: "6.84",
    },
    shop_sales: {
      shop_sales: "4394.48",
      shop_margin: "1330.35",
      status: "down",
      percentage: "-48.13",
      p_status: "down",
      p_percentage: "-68.2",
    },
    shop_profit: {
      shop_profit: "1330.35",
      status: "down",
      percentage: "-68.2",
    },
    shop_fees: {
      shop_fee: "518.4",
      status: "up",
      percentage: "0.0",
    },
  },
];

export const Losers = [
  {
    id: "Vk1tRWpGNlZYdDNkbkVIQlg1UTBVZz09",
    name: "Amersham ",
    image: "https://apis-l.credentia.uk/splr/shell-logo.png",
    fuel_volume: {
      gross_volume: "17493.09",
      bunkered_volume: "0.0",
      total_volume: "17493.09",
      status: "up",
      percentage: "5.98",
    },
    fuel_sales: {
      gross_value: "21305.02",
      bunkered_value: "0.0",
      total_value: "21305.02",
      status: "up",
      percentage: "9.39",
    },
    gross_profit: {
      gross_profit: 3419.35,
      gross_margin: 19.55,
      status: "up",
      percentage: "13.76",
    },
    gross_margin: {
      gross_margin: 19.55,
      is_ppl: 0,
      ppl_msg: "",
      status: "up",
      percentage: "7.36",
    },
    shop_sales: {
      shop_sales: "4306.84",
      shop_margin: "2358.7",
      status: "down",
      percentage: "-13.62",
      p_status: "down",
      p_percentage: "-10.08",
    },
    shop_profit: {
      shop_profit: "2358.7",
      status: "down",
      percentage: "-10.08",
    },
    shop_fees: {
      shop_fee: "393.6",
      status: "up",
      percentage: "0.0",
    },
  },
  {
    id: "VEttejdBRlRMWDRnUTdlRkdLK1hrZz09",
    name: "Belgrave ",
    image: "https://apis-l.credentia.uk/splr/bp-logo.png",
    fuel_volume: {
      gross_volume: "14634.16",
      bunkered_volume: "0.0",
      total_volume: "14634.16",
      status: "down",
      percentage: "-5.66",
    },
    fuel_sales: {
      gross_value: "17249.99",
      bunkered_value: "0.0",
      total_value: "17249.99",
      status: "down",
      percentage: "-4.34",
    },
    gross_profit: {
      gross_profit: 1721.31,
      gross_margin: 11.76,
      status: "down",
      percentage: "-43.17",
    },
    gross_margin: {
      gross_margin: 11.76,
      is_ppl: 0,
      ppl_msg: "",
      status: "down",
      percentage: "-39.78",
    },
    shop_sales: {
      shop_sales: "1775.81",
      shop_margin: "813.01",
      status: "down",
      percentage: "-12.86",
      p_status: "down",
      p_percentage: "-15.49",
    },
    shop_profit: {
      shop_profit: "813.01",
      status: "down",
      percentage: "-15.49",
    },
    shop_fees: {
      shop_fee: "150.4",
      status: "up",
      percentage: "0.0",
    },
  },
  {
    id: "SERQa05pZktwNTVFL2RCMCtxdWQrdz09",
    name: "Wexham ",
    image: "https://apis-l.credentia.uk/splr/bp-logo.png",
    fuel_volume: {
      gross_volume: "17453.42",
      bunkered_volume: "0.0",
      total_volume: "17453.42",
      status: "down",
      percentage: "-47.73",
    },
    fuel_sales: {
      gross_value: "20998.55",
      bunkered_value: "0.0",
      total_value: "20998.55",
      status: "down",
      percentage: "-46.59",
    },
    gross_profit: {
      gross_profit: 2742.37,
      gross_margin: 15.71,
      status: "down",
      percentage: "-47.09",
    },
    gross_margin: {
      gross_margin: 15.71,
      is_ppl: 0,
      ppl_msg: "",
      status: "up",
      percentage: "1.22",
    },
    shop_sales: {
      shop_sales: "3122.3",
      shop_margin: "1449.06",
      status: "down",
      percentage: "-50.66",
      p_status: "down",
      p_percentage: "-55.41",
    },
    shop_profit: {
      shop_profit: "1449.06",
      status: "down",
      percentage: "-55.41",
    },
    shop_fees: {
      shop_fee: "288.0",
      status: "down",
      percentage: "-50.0",
    },
  },
  {
    id: "cDd2VGlMRzRYUE5vdEFLcEJpZVY1Zz09",
    name: "Park Royal",
    image: "https://apis-l.credentia.uk/splr/greenergy-logo.png",
    fuel_volume: {
      gross_volume: "22786.17",
      bunkered_volume: "7433.49",
      total_volume: "30219.66",
      status: "down",
      percentage: "-14.75",
    },
    fuel_sales: {
      gross_value: "27446.19",
      bunkered_value: "10845.44",
      total_value: "38291.63",
      status: "down",
      percentage: "-13.2",
    },
    gross_profit: {
      gross_profit: 5948.34,
      gross_margin: 19.68,
      status: "up",
      percentage: "1.34",
    },
    gross_margin: {
      gross_margin: 19.68,
      is_ppl: 0,
      ppl_msg: "",
      status: "up",
      percentage: "11.82",
    },
    shop_sales: {
      shop_sales: "7432.84",
      shop_margin: "3187.71",
      status: "down",
      percentage: "-11.82",
      p_status: "down",
      p_percentage: "-10.9",
    },
    shop_profit: {
      shop_profit: "3187.71",
      status: "down",
      percentage: "-10.9",
    },
    shop_fees: {
      shop_fee: "768.0",
      status: "up",
      percentage: "0.0",
    },
  },
  {
    id: "L3J6ckhTNy9ZdmFxU3djM3BwK0VBZz09",
    name: "Astwick ",
    image: "https://apis-l.credentia.uk/splr/bp-logo.png",
    fuel_volume: {
      gross_volume: "15855.06",
      bunkered_volume: "5444.89",
      total_volume: "21299.95",
      status: "down",
      percentage: "-15.0",
    },
    fuel_sales: {
      gross_value: "20210.96",
      bunkered_value: "8543.01",
      total_value: "28753.97",
      status: "down",
      percentage: "-13.99",
    },
    gross_profit: {
      gross_profit: 5226.09,
      gross_margin: 24.54,
      status: "down",
      percentage: "-5.88",
    },
    gross_margin: {
      gross_margin: 24.54,
      is_ppl: 0,
      ppl_msg: "",
      status: "up",
      percentage: "6.19",
    },
    shop_sales: {
      shop_sales: "4128.02",
      shop_margin: "2089.66",
      status: "down",
      percentage: "-25.19",
      p_status: "down",
      p_percentage: "-23.78",
    },
    shop_profit: {
      shop_profit: "2089.66",
      status: "down",
      percentage: "-23.78",
    },
    shop_fees: {
      shop_fee: "460.8",
      status: "up",
      percentage: "0.0",
    },
  },
  {
    id: "U2wrWHB3T0FOSXRvV2lDUXg3cktUdz09",
    name: "Girton",
    image: "https://apis-l.credentia.uk/splr/bp-logo.png",
    fuel_volume: {
      gross_volume: "21961.03",
      bunkered_volume: "0.0",
      total_volume: "21961.03",
      status: "up",
      percentage: "6.81",
    },
    fuel_sales: {
      gross_value: "26188.62",
      bunkered_value: "0.0",
      total_value: "26188.62",
      status: "up",
      percentage: "7.93",
    },
    gross_profit: {
      gross_profit: 3886.49,
      gross_margin: 17.7,
      status: "up",
      percentage: "15.7",
    },
    gross_margin: {
      gross_margin: 17.7,
      is_ppl: 0,
      ppl_msg: "",
      status: "up",
      percentage: "8.32",
    },
    shop_sales: {
      shop_sales: "4871.26",
      shop_margin: "2472.16",
      status: "up",
      percentage: "4.06",
      p_status: "up",
      p_percentage: "2.62",
    },
    shop_profit: {
      shop_profit: "2472.16",
      status: "up",
      percentage: "2.62",
    },
    shop_fees: {
      shop_fee: "530.4",
      status: "up",
      percentage: "0.0",
    },
  },
  {
    id: "TjlpY21FU2kzc2kyTHVJMFJUR0FPZz09",
    name: "Gravesend ",
    image: "https://apis-l.credentia.uk/splr/greenergy-logo.png",
    fuel_volume: {
      gross_volume: "13163.8",
      bunkered_volume: "580.44",
      total_volume: "13744.24",
      status: "up",
      percentage: "5.8",
    },
    fuel_sales: {
      gross_value: "15246.53",
      bunkered_value: "823.64",
      total_value: "16070.17",
      status: "up",
      percentage: "6.46",
    },
    gross_profit: {
      gross_profit: 2137.58,
      gross_margin: 15.55,
      status: "up",
      percentage: "17.2",
    },
    gross_margin: {
      gross_margin: 15.55,
      is_ppl: 0,
      ppl_msg: "",
      status: "up",
      percentage: "10.68",
    },
    shop_sales: {
      shop_sales: "3523.39",
      shop_margin: "1497.82",
      status: "down",
      percentage: "-17.56",
      p_status: "down",
      p_percentage: "-26.12",
    },
    shop_profit: {
      shop_profit: "1497.82",
      status: "down",
      percentage: "-26.12",
    },
    shop_fees: {
      shop_fee: "313.6",
      status: "up",
      percentage: "0.0",
    },
  },
  {
    id: "V0wyR0Y4YUJmM0NJcGVqNXUzUWtaQT09",
    name: "Patcham ",
    image: "https://apis-l.credentia.uk/splr/greenergy-logo.png",
    fuel_volume: {
      gross_volume: "18921.14",
      bunkered_volume: "709.43",
      total_volume: "19630.57",
      status: "up",
      percentage: "9.92",
    },
    fuel_sales: {
      gross_value: "22635.11",
      bunkered_value: "1028.59",
      total_value: "23663.7",
      status: "up",
      percentage: "11.3",
    },
    gross_profit: {
      gross_profit: 3818.99,
      gross_margin: 19.45,
      status: "up",
      percentage: "25.72",
    },
    gross_margin: {
      gross_margin: 19.45,
      is_ppl: 0,
      ppl_msg: "",
      status: "up",
      percentage: "19.69",
    },
    shop_sales: {
      shop_sales: "2378.53",
      shop_margin: "1632.03",
      status: "down",
      percentage: "-12.76",
      p_status: "down",
      p_percentage: "-11.76",
    },
    shop_profit: {
      shop_profit: "1632.03",
      status: "down",
      percentage: "-11.76",
    },
    shop_fees: {
      shop_fee: "268.8",
      status: "up",
      percentage: "0.0",
    },
  },
  {
    id: "MkJWd25aSTlDekVwcWg4azgrNVh3UT09",
    name: "Anson ",
    image: "https://apis-l.credentia.uk/splr/bp-logo.png",
    fuel_volume: {
      gross_volume: "24941.13",
      bunkered_volume: "26.35",
      total_volume: "24967.48",
      status: "down",
      percentage: "-3.77",
    },
    fuel_sales: {
      gross_value: "29451.64",
      bunkered_value: "37.65",
      total_value: "29489.29",
      status: "down",
      percentage: "-3.28",
    },
    gross_profit: {
      gross_profit: 4038.78,
      gross_margin: 16.18,
      status: "down",
      percentage: "-0.93",
    },
    gross_margin: {
      gross_margin: 16.18,
      is_ppl: 0,
      ppl_msg: "",
      status: "up",
      percentage: "2.86",
    },
    shop_sales: {
      shop_sales: "2703.01",
      shop_margin: "1265.85",
      status: "down",
      percentage: "-20.65",
      p_status: "down",
      p_percentage: "-12.12",
    },
    shop_profit: {
      shop_profit: "1265.85",
      status: "down",
      percentage: "-12.12",
    },
    shop_fees: {
      shop_fee: "240.0",
      status: "up",
      percentage: "0.0",
    },
  },
  {
    id: "YzhQcFZPRzJGcjJKQTdNV3Q0YWJQQT09",
    name: "Baddesley",
    image: "https://apis-l.credentia.uk/splr/bp-logo.png",
    fuel_volume: {
      gross_volume: "16901.18",
      bunkered_volume: "70.15",
      total_volume: "16971.33",
      status: "down",
      percentage: "-2.63",
    },
    fuel_sales: {
      gross_value: "19871.17",
      bunkered_value: "100.95",
      total_value: "19972.12",
      status: "down",
      percentage: "-2.0",
    },
    gross_profit: {
      gross_profit: 2605.88,
      gross_margin: 15.35,
      status: "up",
      percentage: "0.13",
    },
    gross_margin: {
      gross_margin: 15.35,
      is_ppl: 0,
      ppl_msg: "",
      status: "up",
      percentage: "2.54",
    },
    shop_sales: {
      shop_sales: "1929.5",
      shop_margin: "817.24",
      status: "up",
      percentage: "6.88",
      p_status: "down",
      p_percentage: "-9.48",
    },
    shop_profit: {
      shop_profit: "817.24",
      status: "down",
      percentage: "-9.48",
    },
    shop_fees: {
      shop_fee: "163.2",
      status: "down",
      percentage: "-10.53",
    },
  },
  {
    id: "Y1BYWW83YmxDSWhYNkNXQ0lwZFJRUT09",
    name: "Swanley",
    image: "https://apis-l.credentia.uk/splr/bp-logo.png",
    fuel_volume: {
      gross_volume: "17056.51",
      bunkered_volume: "0.0",
      total_volume: "17056.51",
      status: "up",
      percentage: "20.34",
    },
    fuel_sales: {
      gross_value: "20288.74",
      bunkered_value: "0.0",
      total_value: "20288.74",
      status: "up",
      percentage: "22.66",
    },
    gross_profit: {
      gross_profit: 2931.82,
      gross_margin: 17.19,
      status: "up",
      percentage: "38.58",
    },
    gross_margin: {
      gross_margin: 17.19,
      is_ppl: 0,
      ppl_msg: "",
      status: "up",
      percentage: "15.14",
    },
    shop_sales: {
      shop_sales: "5432.73",
      shop_margin: "2499.43",
      status: "down",
      percentage: "-8.38",
      p_status: "down",
      p_percentage: "-14.36",
    },
    shop_profit: {
      shop_profit: "2499.43",
      status: "down",
      percentage: "-14.36",
    },
    shop_fees: {
      shop_fee: "560.0",
      status: "up",
      percentage: "0.0",
    },
  },
  {
    id: "Zm1qRXhGeW5aQTI2YnNzMm5wekE4QT09",
    name: "Vineyard ",
    image: "https://apis-l.credentia.uk/splr/bp-logo.png",
    fuel_volume: {
      gross_volume: "22035.78",
      bunkered_volume: "0.0",
      total_volume: "22035.78",
      status: "up",
      percentage: "6.9",
    },
    fuel_sales: {
      gross_value: "26821.35",
      bunkered_value: "0.0",
      total_value: "26821.35",
      status: "up",
      percentage: "10.76",
    },
    gross_profit: {
      gross_profit: 4203.13,
      gross_margin: 19.07,
      status: "up",
      percentage: "48.69",
    },
    gross_margin: {
      gross_margin: 19.07,
      is_ppl: 0,
      ppl_msg: "",
      status: "up",
      percentage: "39.1",
    },
    shop_sales: {
      shop_sales: "2465.18",
      shop_margin: "2346.56",
      status: "up",
      percentage: "7.57",
      p_status: "up",
      p_percentage: "8.97",
    },
    shop_profit: {
      shop_profit: "2346.56",
      status: "up",
      percentage: "8.97",
    },
    shop_fees: {
      shop_fee: "163.2",
      status: "up",
      percentage: "0.0",
    },
  },
  {
    id: "OUNrS016Ym93czZsVzlMOHNkSE9hZz09",
    name: "Erith ",
    image: "https://apis-l.credentia.uk/splr/bp-logo.png",
    fuel_volume: {
      gross_volume: "23326.54",
      bunkered_volume: "1016.21",
      total_volume: "24342.75",
      status: "down",
      percentage: "-7.23",
    },
    fuel_sales: {
      gross_value: "27939.36",
      bunkered_value: "1472.5",
      total_value: "29411.86",
      status: "down",
      percentage: "-5.87",
    },
    gross_profit: {
      gross_profit: 4219.15,
      gross_margin: 17.33,
      status: "down",
      percentage: "-4.81",
    },
    gross_margin: {
      gross_margin: 17.33,
      is_ppl: 0,
      ppl_msg: "",
      status: "up",
      percentage: "6.84",
    },
    shop_sales: {
      shop_sales: "4394.48",
      shop_margin: "1330.35",
      status: "down",
      percentage: "-48.13",
      p_status: "down",
      p_percentage: "-68.2",
    },
    shop_profit: {
      shop_profit: "1330.35",
      status: "down",
      percentage: "-68.2",
    },
    shop_fees: {
      shop_fee: "518.4",
      status: "up",
      percentage: "0.0",
    },
  },
];

export const ReportList = [
  {
    "id": "Vk1tRWpGNlZYdDNkbkVIQlg1UTBVZz09",
    "report_name": "Monthly Sales Report (DRS)",
    "report_code": "msr"
  },
  {
    "id": "OUNrS016Ym93czZsVzlMOHNkSE9hZz09",
    "report_name": "Fuel Deliveries Report",
    "report_code": "dfdr"
  },
  {
    "id": "MkJWd25aSTlDekVwcWg4azgrNVh3UT09",
    "report_name": "Stock Loss Report",
    "report_code": "dsmr"
  },
  {
    "id": "L3J6ckhTNy9ZdmFxU3djM3BwK0VBZz09",
    "report_name": "Credit Card Reconciliation Report",
    "report_code": "htccrr"
  },
  {
    "id": "U2dXNXN4OG5rSkdsOGZ0TXhTR0ZQZz09",
    "report_name": "Fuel Margin Report",
    "report_code": "fmmrfas"
  },
  {
    "id": "NnFJaGVzRGlwaGtQY3FKTTJYUkhJZz09",
    "report_name": "DRS Vs Fairbank Report",
    "report_code": "fbr"
  },
  {
    "id": "YmxmOHE4VTRYNitkaHQwQ29QYmQ1QT09",
    "report_name": "Phonecard Report",
    "report_code": "dpcr"
  },
  {
    "id": "VEttejdBRlRMWDRnUTdlRkdLK1hrZz09",
    "report_name": "Lottery Reconciliation Report",
    "report_code": "lrr"
  },
  {
    "id": "NnRMWitrM2srMXBXT25GSEVzYjY3dz09",
    "report_name": "Valet Commission Report",
    "report_code": "vcr"
  },
  {
    "id": "eWNRc01TcTRKaVdRZTVtQzZ3WjZoZz09",
    "report_name": "Combined Monthly Sales Report",
    "report_code": "cmsr"
  },
  {
    "id": "cDd2VGlMRzRYUE5vdEFLcEJpZVY1Zz09",
    "report_name": "Coffee Reconciliation Report",
    "report_code": "hsrlcrr"
  },
  {
    "id": "TjlpY21FU2kzc2kyTHVJMFJUR0FPZz09",
    "report_name": "Car Wash Reconciliation Report",
    "report_code": "hsrlcwrr"
  },
  {
    "id": "V0wyR0Y4YUJmM0NJcGVqNXUzUWtaQT09",
    "report_name": "Management Accounts Report",
    "report_code": "hmar"
  },
  {
    "id": "U2wrWHB3T0FOSXRvV2lDUXg3cktUdz09",
    "report_name": "Scheduled Report",
    "report_code": "hsr"
  },
  {
    "id": "SERQa05pZktwNTVFL2RCMCtxdWQrdz09",
    "report_name": "VAT Return Report",
    "report_code": "pvrr"
  },
  {
    "id": "Zm1qRXhGeW5aQTI2YnNzMm5wekE4QT09",
    "report_name": "Draft Bank Copy Report",
    "report_code": "dbcr"
  },
  {
    "id": "RlI4SisyaWlNaExQV3ZSYVoyOGFYUT09",
    "report_name": "Cash Monitoring Monthly Report",
    "report_code": "htcmmr"
  },
  {
    "id": "Y1BYWW83YmxDSWhYNkNXQ0lwZFJRUT09",
    "report_name": "Monthly Department Shop Sales Report",
    "report_code": "mdssr"
  },
  {
    "id": "YzhQcFZPRzJGcjJKQTdNV3Q0YWJQQT09",
    "report_name": "Sales Comparison Report",
    "report_code": "scr"
  },
  {
    "id": "Q0hXRGNkeTllN1JSVWg1NFdDNjJodz09",
    "report_name": "Daily Summary Sale (CLDO)",
    "report_code": "dsrr"
  },
  {
    "id": "anJ4dUNUZjdQOXdRK1ErcVFwM3pUUT09",
    "report_name": "Sage Stock Movement Report",
    "report_code": "ssmr"
  },
  {
    "id": "V2Z4dC9FRGp3VzRFNGZQYnlSTVpkZz09",
    "report_name": "Sage Petty Cash Report(Fuels,Valet Summary etc.)",
    "report_code": "mspcr"
  }
];
export const DashboardData = {
  "gross_volume": {
    "gross_volume": "266003.86",
    "bunkered_volume": "15280.96",
    "total_volume": "281284.82",
    "status": "up",
    "percentage": "0.68"
  },
  "fuel_sales": {
    "gross_value": "319024.48",
    "bunkered_value": "22851.78",
    "total_value": "341876.26",
    "status": "up",
    "percentage": "2.24"
  },
  "gross_profit": {
    "gross_profit": 50537.88,
    "gross_margin": 17.97,
    "status": "up",
    "percentage": "7.72"
  },
  "gross_margin": {
    "gross_margin": 17.97,
    "is_ppl": 0,
    "ppl_msg": "",
    "status": "up",
    "percentage": "7.41"
  },
  "shop_sales": {
    "shop_sales": "51156.63",
    "shop_margin": "25178.95",
    "status": "down",
    "percentage": "-15.98",
    "p_status": "down",
    "p_percentage": "-18.88"
  },
  "line_graph": {
    "labels": [
      "Nov 2024",
      "Dec 2024"
    ],
    "datasets": [
      {
        "label": "Fuel Volume (ℓ)",
        "data": [
          "4240786.1",
          "266003.86"
        ],
        "borderColor": "#7e95e4",
        "backgroundColor": "#7e95e4",
        "type": "line",
        "yAxisID": "y1"
      },
      {
        "label": "Gross Margin (ppl)",
        "data": [
          "16.81",
          "17.97"
        ],
        "borderColor": "#3b60ac",
        "backgroundColor": "#3b60ac",
        "type": "bar",
        "yAxisID": "y"
      },
      {
        "label": "Shop Sales (£)",
        "data": [
          "870812.62",
          "51156.63"
        ],
        "borderColor": "#938ddf",
        "backgroundColor": "#938ddf",
        "type": "line",
        "yAxisID": "y1"
      }
    ]
  },
  "pi_graph": {
    "label": [
      "Shop Sales",
      "Fuel Sales",
      "Bunkered Sales"
    ],
    "colors": [
      "rgba(126, 149, 228, 1)",
      "rgba(59, 96, 172, 1)",
      "rgba(147, 141, 223, 1)"
    ],
    "series": [
      "51156.63",
      "319024.48",
      "22851.78"
    ]
  },
  "shop_fees": {
    "shop_fee": "5106.4",
    "status": "down",
    "percentage": "-0.37"
  },
  "dateString": "01 Dec - 02 Dec",
  "d_line_graph": {
    "series": [
      {
        "name": "Fuel Volume (ℓ)",
        "type": "line",
        "data": [
          "117403.57",
          "148600.29"
        ],
        "borderColor": "#7e95e4",
        "backgroundColor": "#7e95e4"
      },
      {
        "name": "Gross Margin (ppl)",
        "type": "line",
        "data": [
          "18.02",
          "17.92"
        ],
        "borderColor": "#3b60ac",
        "backgroundColor": "#3b60ac"
      },
      {
        "name": "Shop Sales (£)",
        "type": "line",
        "data": [
          "24656.53",
          "26500.1"
        ],
        "borderColor": "#938ddf",
        "backgroundColor": "#938ddf"
      }
    ],
    "option": {
      "labels": [
        "01 Dec 2024",
        "02 Dec 2024"
      ]
    }
  },
  "shop_profit": {
    "shop_profit": "25178.95",
    "status": "down",
    "percentage": "-18.88"
  }
}
export const StockData = {
  "stock_graph_data": {
    "labels": [
      "Ramsey Service Station G401",
      "Brewster Street Service Station G400",
      "S. and G.L. Aswat and Sons Ltd."
    ],
    "datasets": [
      {
        "label": "Votes",
        "data": [
          46,
          79,
          15
        ],
        "backgroundColor": [
          "#92C5F9",
          "#AFDC8F",
          "#B6A6E9"
        ],
        "borderColor": [
          "#92C5F9",
          "#AFDC8F",
          "#B6A6E9"
        ],
        "borderWidth": 1
      }
    ]
  },
  "stock_graph_options": {
    "responsive": true,
    "maintainAspectRatio": false,  // Allow custom height and width
    "plugins": {
      "legend": {
        "position": "bottom"
      },
      "tooltip": {
        "enabled": true
      }
    },
    "cutout": "80%", // Inner cutout for the donut chart
    "layout": {
      "padding": {
        "left": 10,
        "right": 10,
        "top": 10,
        "bottom": 10
      }
    }
  },
  "stock_details": [
    {
      "id": "1",
      "stock": "Ramsey Service Station G401",
      "quantiry": "175",
      "aging": "40 days"
    },
    {
      "id": "2",
      "stock": "Brewster Street Service Station G400",
      "quantiry": "145",
      "aging": "60 days"
    },
    {
      "id": "3",
      "stock": "S. and G.L. Aswat and Sons Ltd.",
      "quantiry": "115",
      "aging": "20 days"
    },
    {
      "id": "4",
      "stock": "UK Fast Fuels Ltd.",
      "quantiry": "215",
      "aging": "39 days"
    },
    {
      "id": "5",
      "stock": "Oakham Service Station",
      "quantiry": "86",
      "aging": "52 days"
    },
    {
      "id": "6",
      "stock": "SPALDING SERVICE STATION",
      "quantiry": "132",
      "aging": "25 days"
    },
    {
      "id": "7",
      "stock": "Wali`s Enterprises Ltd.",
      "quantiry": "40",
      "aging": "10 days"
    }
  ]
}

export const PerformanceData = {
  "top": [
    {
      "id": 16,
      "name": "Vineyard ",
      "image": "https://apis-l.credentia.uk/splr/bp-logo.png",
      "fuel_volume": {
        "gross_volume": "22035.78",
        "bunkered_volume": "0.0",
        "total_volume": "22035.78",
        "status": "up",
        "percentage": "6.9"
      },
      "fuel_sales": {
        "gross_value": "26821.35",
        "bunkered_value": "0.0",
        "total_value": "26821.35",
        "status": "up",
        "percentage": "10.76"
      },
      "gross_profit": {
        "gross_profit": 4203.13,
        "gross_margin": 19.07,
        "status": "up",
        "percentage": "48.69"
      },
      "gross_margin": {
        "gross_margin": 19.07,
        "is_ppl": 0,
        "ppl_msg": "",
        "status": "up",
        "percentage": "39.1"
      },
      "shop_sales": {
        "shop_sales": "2465.18",
        "shop_margin": "2346.56",
        "status": "up",
        "percentage": "7.57",
        "p_status": "up",
        "p_percentage": "8.97"
      },
      "shop_profit": {
        "shop_profit": "2346.56",
        "status": "up",
        "percentage": "8.97"
      },
      "shop_fees": {
        "shop_fee": "163.2",
        "status": "up",
        "percentage": "0.0"
      },
      "date": "2024-12-02"
    },
    {
      "id": 18,
      "name": "Swanley",
      "image": "https://apis-l.credentia.uk/splr/bp-logo.png",
      "fuel_volume": {
        "gross_volume": "17056.51",
        "bunkered_volume": "0.0",
        "total_volume": "17056.51",
        "status": "up",
        "percentage": "20.34"
      },
      "fuel_sales": {
        "gross_value": "20288.74",
        "bunkered_value": "0.0",
        "total_value": "20288.74",
        "status": "up",
        "percentage": "22.66"
      },
      "gross_profit": {
        "gross_profit": 2931.82,
        "gross_margin": 17.19,
        "status": "up",
        "percentage": "38.58"
      },
      "gross_margin": {
        "gross_margin": 17.19,
        "is_ppl": 0,
        "ppl_msg": "",
        "status": "up",
        "percentage": "15.14"
      },
      "shop_sales": {
        "shop_sales": "5432.73",
        "shop_margin": "2499.43",
        "status": "down",
        "percentage": "-8.38",
        "p_status": "down",
        "p_percentage": "-14.36"
      },
      "shop_profit": {
        "shop_profit": "2499.43",
        "status": "down",
        "percentage": "-14.36"
      },
      "shop_fees": {
        "shop_fee": "560.0",
        "status": "up",
        "percentage": "0.0"
      },
      "date": "2024-12-02"
    },
    {
      "id": 13,
      "name": "Patcham ",
      "image": "https://apis-l.credentia.uk/splr/greenergy-logo.png",
      "fuel_volume": {
        "gross_volume": "18921.14",
        "bunkered_volume": "709.43",
        "total_volume": "19630.57",
        "status": "up",
        "percentage": "9.92"
      },
      "fuel_sales": {
        "gross_value": "22635.11",
        "bunkered_value": "1028.59",
        "total_value": "23663.7",
        "status": "up",
        "percentage": "11.3"
      },
      "gross_profit": {
        "gross_profit": 3818.99,
        "gross_margin": 19.45,
        "status": "up",
        "percentage": "25.72"
      },
      "gross_margin": {
        "gross_margin": 19.45,
        "is_ppl": 0,
        "ppl_msg": "",
        "status": "up",
        "percentage": "19.69"
      },
      "shop_sales": {
        "shop_sales": "2378.53",
        "shop_margin": "1632.03",
        "status": "down",
        "percentage": "-12.76",
        "p_status": "down",
        "p_percentage": "-11.76"
      },
      "shop_profit": {
        "shop_profit": "1632.03",
        "status": "down",
        "percentage": "-11.76"
      },
      "shop_fees": {
        "shop_fee": "268.8",
        "status": "up",
        "percentage": "0.0"
      },
      "date": "2024-12-02"
    }
  ],
  "bottom": [
    {
      "id": 15,
      "name": "Wexham ",
      "image": "https://apis-l.credentia.uk/splr/bp-logo.png",
      "fuel_volume": {
        "gross_volume": "17453.42",
        "bunkered_volume": "0.0",
        "total_volume": "17453.42",
        "status": "down",
        "percentage": "-47.73"
      },
      "fuel_sales": {
        "gross_value": "20998.55",
        "bunkered_value": "0.0",
        "total_value": "20998.55",
        "status": "down",
        "percentage": "-46.59"
      },
      "gross_profit": {
        "gross_profit": 2742.37,
        "gross_margin": 15.71,
        "status": "down",
        "percentage": "-47.09"
      },
      "gross_margin": {
        "gross_margin": 15.71,
        "is_ppl": 0,
        "ppl_msg": "",
        "status": "up",
        "percentage": "1.22"
      },
      "shop_sales": {
        "shop_sales": "3122.3",
        "shop_margin": "1449.06",
        "status": "down",
        "percentage": "-50.66",
        "p_status": "down",
        "p_percentage": "-55.41"
      },
      "shop_profit": {
        "shop_profit": "1449.06",
        "status": "down",
        "percentage": "-55.41"
      },
      "shop_fees": {
        "shop_fee": "288.0",
        "status": "down",
        "percentage": "-50.0"
      },
      "date": "2024-12-02"
    },
    {
      "id": 4,
      "name": "Astwick ",
      "image": "https://apis-l.credentia.uk/splr/bp-logo.png",
      "fuel_volume": {
        "gross_volume": "15855.06",
        "bunkered_volume": "5444.89",
        "total_volume": "21299.95",
        "status": "down",
        "percentage": "-15.0"
      },
      "fuel_sales": {
        "gross_value": "20210.96",
        "bunkered_value": "8543.01",
        "total_value": "28753.97",
        "status": "down",
        "percentage": "-13.99"
      },
      "gross_profit": {
        "gross_profit": 5226.09,
        "gross_margin": 24.54,
        "status": "down",
        "percentage": "-5.88"
      },
      "gross_margin": {
        "gross_margin": 24.54,
        "is_ppl": 0,
        "ppl_msg": "",
        "status": "up",
        "percentage": "6.19"
      },
      "shop_sales": {
        "shop_sales": "4128.02",
        "shop_margin": "2089.66",
        "status": "down",
        "percentage": "-25.19",
        "p_status": "down",
        "p_percentage": "-23.78"
      },
      "shop_profit": {
        "shop_profit": "2089.66",
        "status": "down",
        "percentage": "-23.78"
      },
      "shop_fees": {
        "shop_fee": "460.8",
        "status": "up",
        "percentage": "0.0"
      },
      "date": "2024-12-02"
    },
    {
      "id": 2,
      "name": "Erith ",
      "image": "https://apis-l.credentia.uk/splr/bp-logo.png",
      "fuel_volume": {
        "gross_volume": "23326.54",
        "bunkered_volume": "1016.21",
        "total_volume": "24342.75",
        "status": "down",
        "percentage": "-7.23"
      },
      "fuel_sales": {
        "gross_value": "27939.36",
        "bunkered_value": "1472.5",
        "total_value": "29411.86",
        "status": "down",
        "percentage": "-5.87"
      },
      "gross_profit": {
        "gross_profit": 4219.15,
        "gross_margin": 17.33,
        "status": "down",
        "percentage": "-4.81"
      },
      "gross_margin": {
        "gross_margin": 17.33,
        "is_ppl": 0,
        "ppl_msg": "",
        "status": "up",
        "percentage": "6.84"
      },
      "shop_sales": {
        "shop_sales": "4394.48",
        "shop_margin": "1330.35",
        "status": "down",
        "percentage": "-48.13",
        "p_status": "down",
        "p_percentage": "-68.2"
      },
      "shop_profit": {
        "shop_profit": "1330.35",
        "status": "down",
        "percentage": "-68.2"
      },
      "shop_fees": {
        "shop_fee": "518.4",
        "status": "up",
        "percentage": "0.0"
      },
      "date": "2024-12-02"
    }
  ]
}
export const PriceLogsData = [
  {
    "id": "RGxodzg4MXY0UXNBZmtVc2pxSy8yQT09",
    "user": "Tony Head",
    "site": "Amersham ",
    "type": "Created",
    "name": "Adblue",
    "price": 1.799,
    "prev_price": 0,
    "is_checked": "Forcefully",
    "date": "2024-03-27 00:00:00",
    "created": "2024-03-26 14:59:52"
  },
  {
    "id": "cWpuQmJrWGVIRDZpZzV3RDNLOFZRUT09",
    "user": "Tony Head",
    "site": "Amersham ",
    "type": "Created",
    "name": "Super Diesel",
    "price": 1.759,
    "prev_price": 0,
    "is_checked": "Forcefully",
    "date": "2024-03-27 00:00:00",
    "created": "2024-03-26 14:59:52"
  },
  {
    "id": "RTZHcGUxSFZEUHBETzBrL2RYQW1iUT09",
    "user": "Tony Head",
    "site": "Amersham ",
    "type": "Created",
    "name": "Diesel",
    "price": 1.559,
    "prev_price": 0,
    "is_checked": "Forcefully",
    "date": "2024-03-27 00:00:00",
    "created": "2024-03-26 14:59:52"
  },
  {
    "id": "eE5FWWdrUGhoMlFqeHdMaWxKMExaQT09",
    "user": "Tony Head",
    "site": "Amersham ",
    "type": "Created",
    "name": "Super Unleaded",
    "price": 1.669,
    "prev_price": 0,
    "is_checked": "Forcefully",
    "date": "2024-03-27 00:00:00",
    "created": "2024-03-26 14:59:52"
  },
  {
    "id": "SjByWjFFTE8wcFhrSW12MUN1OHEyUT09",
    "user": "Tony Head",
    "site": "Amersham ",
    "type": "Created",
    "name": "Unleaded",
    "price": 1.469,
    "prev_price": 0,
    "is_checked": "Forcefully",
    "date": "2024-03-27 00:00:00",
    "created": "2024-03-26 14:59:52"
  }
] 