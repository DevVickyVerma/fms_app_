export const MENUITEMS = [
  {
    Items: [
      //dashboard
      {
        path: `/dashboard`,
        icon: "house",
        type: "link",
        active: false,
        permission: "dashboard-view",
        visibility: false,
        title: "Dashboard",
      },
      // {
      //   path: `/ceodashboard-test`,
      //   icon: "house",
      //   type: "link",
      //   active: false,
      //   permission: "ceodashboard-view",
      //   visibility: false,
      //   title: "CEO Dashboard Old",
      // },
      {
        path: `/ceodashboard`,
        icon: "crown",
        type: "link",
        active: false,
        permission: "ceodashboard-view",
        visibility: false,
        title: "CEO Dashboard ",
      },
      {
        path: `/titandashboard`,
        icon: "crown",
        type: "link",
        active: false,
        permission: "titandashboard-view",
        visibility: false,
        title: "Titan  Dashboard ",
      },

      // {
      //   path: `/fuelprice`,
      //   icon: "home",
      //   type: "link",
      //   active: false,

      //   permission: "dashboard-view",
      //   visibility: false,
      //   title: "Fuel Selling Price",
      // },

      {
        title: "Manage Levels",
        icon: "graduation-cap",
        type: "sub",
        active: false,
        permission: "level-list",
        visibility: false,
        children: [
          {
            path: `/manage-levels`,
            type: "link",
            title: "Manage Levels",
            permission: "level-list",
            visibility: false,
          },
          {
            path: `/manage-levels/add-level`,
            type: "link",
            title: "Add Level",
            permission: "level-create",
            visibility: false,
          },
        ],
      },
      {
        title: "Manage Users",
        icon: "users",
        type: "sub",
        active: false,
        permission: "user-list",
        visibility: false,
        children: [
          {
            path: `/users`,
            type: "link",
            title: "Manage Users",
            permission: "user-list",
            visibility: false,
          },
          {
            path: `/addusers`,
            type: "link",
            title: "Add User",
            permission: "user-create",
            visibility: false,
          },
          {
            path: `/2FA-authentication`,
            type: "link",
            title: "2FA Authentication",
            // permission: "2fa-user-list",
            permission: "2fa-user-list",
            visibility: false,
          },
        ],
      },
      //client
      {
        title: "Manage Clients",
        icon: "users-three",
        type: "sub",
        active: false,
        permission: "client-list",
        visibility: false,
        children: [
          {
            path: `/clients`,
            type: "link",
            title: "Manage Clients",
            permission: "client-list",
            visibility: false,
          },
          {
            path: `/addclient`,
            type: "link",
            title: "Add Client",
            permission: "client-create",
            visibility: false,
          },
        ],
      },
      //compitior
      {
        title: "Manage Competitors",
        icon: "flag",
        type: "sub",
        active: false,
        permission: "competitor-list",
        visibility: false,
        children: [
          {
            path: `/competitor`,
            type: "link",
            title: " Manage Competitors",
            permission: "competitor-list",
            visibility: false,
          },
          {
            path: `/addCompetitor`,
            type: "link",
            title: "Add Competitor",
            permission: "competitor-create",
            visibility: false,
          },
          {
            path: `/competitorstats`,
            type: "link",
            title: "Competitor Stats",
            permission: "competitor-stats",
            visibility: false,
          },
        ],
      },
      //Company
      {
        title: "Manage Companies",
        icon: "building",
        type: "sub",
        active: false,
        permission: "company-list",
        visibility: false,
        children: [
          {
            path: `/managecompany`,
            title: "Manage Companies",
            type: "link",
            permission: "company-list",
            visibility: false,
          },
          {
            path: `/addcompany`,
            title: "Add Company",
            type: "link",
            permission: "company-create",
            visibility: false,
          },
        ],
      },

      {
        title: "Manage Sage",
        icon: "coda-logo",
        type: "sub",
        active: false,
        permission: "nominalcode-list",
        visibility: false,
        children: [
          {
            path: `/nominal-activity-codes`,
            title: "Nominal Activity Codes",
            type: "link",
            permission: "nominalcode-list",
            visibility: false,
          },
          {
            path: `/nominal-tax-code`,
            title: "Nominal Tax Codes",
            type: "link",
            permission: "nominal-taxcode-list",
            visibility: false,
          },
          {
            path: `/nominal-types`,
            title: "Nominal Types",
            type: "link",
            permission: "nominal-types-list",
            visibility: false,
          },
          {
            path: `/manage-items`,
            title: "Manage Items",
            type: "link",
            permission: "itemhead-list",
            visibility: false,
          },
          {
            path: `/manage-sage-charges`,
            title: "Manage Charges",
            type: "link",
            permission: "chargehead-list",
            visibility: false,
          },
          {
            path: `/manage-sage-deduction`,
            title: "Manage Deductions",
            type: "link",
            permission: "deductionhead-list",
            visibility: false,
          },
          {
            path: `/manage-sage-cards`,
            title: "Manage Cards",
            type: "link",
            permission: "cardgroup-list",
            visibility: false,
          },
          {
            path: `/manage-sage-banking`,
            title: "Manage Banking ",
            type: "link",
            permission: "bankinghead-list",
            visibility: false,
          },
        ],
      },
      //Sites
      {
        title: "Manage Sites",
        icon: "browsers",
        type: "sub",
        active: false,
        permission: "site-list",
        visibility: false,
        children: [
          {
            path: `/sites`,
            title: "Manage Sites",
            type: "link",
            permission: "site-list",
            visibility: false,
          },
          {
            path: `/addsite`,
            title: "Add Site",
            type: "link",
            permission: "site-create",
            visibility: false,
          },
        ],
      },
      //Workflows
      {
        title: "Manage  Workflows",
        icon: "globe",
        type: "sub",
        active: false,
        permission: "drs-menu-list",
        visibility: false,
        children: [
          {
            path: `/data-entry`,
            title: "Manage Daily Workflow",
            type: "link",
            permission: "drs-menu-list",
            visibility: false,
          },
          {
            path: `/workflows`,
            title: "Workflow Status",
            type: "link",
            permission: "workflow-list",
            visibility: false,
          },
          {
            path: `/dsr-exception`,
            title: "Workflow Exception",
            type: "link",
            permission: "drs-exception",
            visibility: false,
          },
          {
            path: `/drs-api-logs`,
            title: "DRS Api Logs",
            type: "link",
            permission: "drs-logs",

            visibility: false,
          },
        ],
      },
      //Roles
      {
        title: "Manage Roles",
        icon: "lock-key-open",
        type: "sub",
        active: false,
        permission: "role-list",
        visibility: false,
        children: [
          {
            path: `/roles`,
            title: "Manage Roles",
            type: "link",
            permission: "role-list",
            visibility: false,
          },
          {
            path: `/addrole`,
            title: "Add Role",
            type: "link",
            permission: "role-create",
            visibility: false,
          },
        ],
      },
      //Addons
      {
        title: "Manage Addons",
        icon: "user-plus",
        type: "sub",
        active: false,
        permission: "addons-list",
        visibility: false,

        children: [
          {
            path: `/manageaddon`,
            title: "Manage Addons",
            type: "link",
            permission: "addons-list",
            visibility: false,
          },
          {
            path: `/addaddon`,
            title: "Add Addon",
            type: "link",
            permission: "addons-create",
            visibility: false,
          },
        ],
      },
      //Site Fuels
      {
        title: "Manage Site Fuels",
        icon: "gas-pump",
        type: "sub",
        active: false,
        permission: "tank-list",
        visibility: false,
        children: [
          {
            path: `/managesitetank`,
            title: "Manage Site Tanks",
            type: "link",
            permission: "tank-list",
            visibility: false,
          },
          {
            path: `/managesitepump`,
            title: "Manage Site Pumps",
            type: "link",
            permission: "pump-list",
            visibility: false,
          },
          {
            path: `/managesitenozzle`,
            title: "Manage Site Nozzles",
            type: "link",
            permission: "nozzle-list",
            visibility: false,
          },
          {
            path: `/fuelprice`,
            title: "Fuel Selling Price",
            type: "link",
            permission: "fuel-price-update",
            visibility: false,
          },
          {
            path: `/fuel-purchase-prices`,
            title: "Fuel Purchase Prices",
            type: "link",
            permission: "fuel-purchase-price",
            visibility: false,
          },
          {
            path: `/competitor-fuel-price`,
            title: "Competitor Fuel Prices",
            type: "link",
            permission: "competitor-price-update",
            visibility: false,
          },
          {
            path: `/competitor-fuel-price-v2`,
            title: "Competitor Fuel Prices Version 2",
            type: "link",
            permission: "competitor-suggestion-update",
            visibility: false,
          },
          // {
          //   path: `/fuel-selling-prices-suggestion`,
          //   title: "Fuel Selling Prices Suggestion",
          //   type: "link",
          //   permission: "competitor-price-update",
          //   // permission: "fuel-suggestion-list",
          //   visibility: false,
          // },
        ],
      },
      //Tolerances
      {
        title: "Manage Tolerance",
        icon: "target",
        type: "sub",
        active: false,
        permission: "tolerance-list",
        visibility: false,
        children: [
          {
            path: `/tolerances`,
            title: "Manage Tolerance",
            type: "link",
            permission: "tolerance-list",
            visibility: false,
          },
        ],
      },
      //Commissions
      {
        title: "Manage Commissions",
        icon: "currency-gbp",
        type: "sub",
        active: false,
        permission: "shop-item-commission-list",
        visibility: false,
        children: [
          {
            path: `/Managecommission`,
            title: "Shop Commission",
            type: "link",
            permission: "shop-item-commission-list",
            visibility: false,
          },
          {
            path: `/valetcommission`,
            title: "Valet Commission",
            type: "link",
            permission: "valet-item-commission-list",
            visibility: false,
          },
          {
            path: `/shop-revenue`,
            title: "Shop Revenue Commission",
            type: "link",
            permission: "revenuecommission-list",
            visibility: false,
          },
        ],
      },
      //Business Type
      {
        title: " Business Type",
        icon: "eject-simple",
        type: "sub",
        active: false,
        permission: "business-type-list",
        visibility: false,
        children: [
          {
            path: `/business`,
            title: " Business Type",
            type: "link",
            permission: "business-type-list",
            visibility: false,
          },

          {
            path: `/addbusiness`,
            title: "Add Business Type",
            type: "link",
            permission: "business-type-create",
            visibility: false,
          },
        ],
      },
      //Charges
      {
        title: "Manage Charges",
        icon: "money",
        type: "sub",
        active: false,
        permission: "charges-list",
        visibility: false,
        children: [
          {
            path: `/managecharges`,
            title: "Manage Charges",
            type: "link",
            permission: "charges-list",
            visibility: false,
          },
          {
            path: `/addcharges`,
            title: "Add Charge",
            type: "link",
            permission: "charges-create",
            visibility: false,
          },
        ],
      },
      //Shops
      {
        title: "Manage Shops",
        icon: "shopping-bag",
        type: "sub",
        active: false,
        permission: "shop-list",
        visibility: false,
        children: [
          {
            path: `/manageshops`,
            title: "Manage Shops",
            type: "link",
            permission: "shop-list",
            visibility: false,
          },
          {
            path: `/addshops`,
            title: "Add Shop",
            type: "link",
            permission: "shop-create",
            visibility: false,
          },
        ],
      },
      //Cards
      {
        title: "Manage Cards",
        icon: "cards",
        type: "sub",
        active: false,
        permission: "card-list",
        visibility: false,
        children: [
          {
            path: `/manageCards`,
            title: "Manage Cards",
            type: "link",
            permission: "card-list",
            visibility: false,
          },
          {
            path: `/addcards`,
            title: "Add Card",
            type: "link",
            permission: "card-create",
            visibility: false,
          },
          {
            path: `/card-group`,
            title: "Card  Group",
            type: "link",
            permission: "cardgroup-list",
            visibility: false,
          },
        ],
      },
      //Deductions
      {
        title: "Manage Deductions",
        icon: "trend-down",
        type: "sub",
        active: false,
        permission: "deduction-list",
        visibility: false,
        children: [
          {
            path: `/managedeductions`,
            title: "Manage Deductions",
            type: "link",
            permission: "deduction-list",
            visibility: false,
          },
          {
            path: `/addDeductions`,
            title: "Add Deduction",
            type: "link",
            permission: "deduction-create",
            visibility: false,
          },
        ],
      },
      //Suppliers
      {
        title: "Manage Suppliers",
        icon: "handshake",
        type: "sub",
        active: false,
        permission: "supplier-list",
        visibility: false,
        children: [
          {
            path: `/managesuppliers`,
            title: "Manage Suppliers",
            type: "link",
            permission: "supplier-list",
            visibility: false,
          },
          {
            path: `/addSuppliers`,
            title: "Add Supplier",
            type: "link",
            permission: "supplier-create",
            visibility: false,
          },
        ],
      },

      //Category
      {
        title: "Manage Category",
        icon: "user-list",
        type: "sub",
        active: false,
        permission: "business-category-list",
        visibility: false,
        children: [
          {
            path: `/managebusinesscategory`,
            title: "Manage Business Category",
            type: "link",
            permission: "business-category-list",
            visibility: false,
          },
          {
            path: `/addbusinesscategory`,
            title: "Add Business Category",
            type: "link",
            permission: "business-category-list",
            visibility: false,
          },
          {
            path: `/managesubbusinesscategory`,
            title: "Manage SubBusiness Category",
            type: "link",
            permission: "business-sub-category-list",
            visibility: false,
          },
          {
            path: `/addsubbusinesscategory`,
            title: "Add Sub Business Category",
            type: "link",
            permission: "business-sub-category-create",
            visibility: false,
          },
        ],
      },
      //Reports
      {
        title: "Manage Reports",
        icon: "file-text",
        type: "sub",
        active: false,
        permission: "report-type-list",
        visibility: false,
        children: [
          {
            path: `/reports`,
            title: "Manage Reports",
            type: "link",
            permission: "report-type-list",
            visibility: false,
          },
        ],
      },
      //Others
      {
        title: "Others",
        icon: "circuitry",
        type: "sub",
        active: false,
        permission: "ppl-list",
        visibility: false,
        children: [
          {
            path: `/assignppl`,
            title: "Site PPL Rate",
            type: "link",
            permission: "ppl-list",
            visibility: false,
          },
          {
            path: `/dailyfacilityfees`,
            title: "Daily Facility Fees",
            type: "link",
            permission: "shop-facility-fees",
            visibility: false,
          },
          {
            path: `/subway-facility-fees`,
            title: "Subway Facility Fees",
            type: "link",
            permission: "subway-facility-fees",
            visibility: false,
          },
        ],
      },
      //Department Items
      {
        title: " Department Items",
        icon: "shopping-cart",
        type: "sub",
        active: false,
        permission: "department-item-list",
        visibility: false,
        children: [
          {
            path: `/manageitems`,
            title: "Manage Department Items",
            type: "link",
            permission: "department-item-list",
            visibility: false,
          },
          {
            path: `/additems`,
            title: "Add Department Item",
            type: "link",
            permission: "department-item-create",
            visibility: false,
          },
          {
            path: `/department-item-group`,
            title: "Manage Item Group",
            type: "link",
            permission: "department-item-group",
            visibility: false,
          },
        ],
      },
      //Logs
      {
        title: "Logs",
        icon: "notebook",
        type: "sub",
        active: false,
        permission: "email-logs",
        visibility: false,
        children: [
          {
            path: `/email-logs`,
            title: "Email Logs",
            type: "link",
            permission: "email-logs",
            visibility: false,
          },
          {
            path: `/activity-logs`,
            title: "Activity Logs",
            type: "link",
            permission: "activity-logs",
            visibility: false,
          },
          {
            path: `/site-evobos-status`,
            title: "EvoBOS Sites",
            type: "link",
            permission: "site-evobos-status",
            visibility: false,
          },
          {
            path: `/cron-module`,
            title: "Cron Jobs",
            type: "link",
            permission: "cronjob-list",
            visibility: false,
          },
          {
            path: `/fuel-price-logs`,
            title: "Fuel Price Logs",
            type: "link",
            permission: "fuel-price-logs",
            visibility: false,
          },
          {
            path: `/future-price-logs`,
            title: "Future Price Logs",
            type: "link",
            permission: "fuel-price-history",
            visibility: false,
          },
          // {
          //   path: `/fuel-selling-price-logs`,
          //   title: "Fuel Selling Price Suggestion Logs",
          //   type: "link",
          //   permission: "fuel-price-history",
          //   visibility: false,
          // },
        ],
      },
      //Sms
      {
        title: "Manage SMS",
        icon: "chat-text",
        type: "sub",
        active: false,
        permission: "sms-list",
        visibility: false,
        children: [
          {
            path: `/manage-sms`,
            title: "Manage SMS",
            type: "link",
            permission: "sms-list",
            visibility: false,
          },
        ],
      },
    ],
  },
];
