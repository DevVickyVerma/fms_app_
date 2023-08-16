export const MENUITEMS = [
  {
    Items: [
      {
        path: `/dashboard`,
        icon: "home",
        type: "link",
        active: false,

        permission: "dashboard-view",
        visibility: false,
        title: "Dashboard",
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
        ],
      },
      {
        title: "Manage Clients",
        icon: "users",
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
            title: "Add Clients",
            permission: "client-create",
            visibility: false,
          },
        ],
      },

      {
        title: "Manage Company",
        icon: "building",
        type: "sub",
        active: false,
        permission: "company-list",
        visibility: false,
        children: [
          {
            path: `/managecompany`,
            title: "Manage Company",
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
        title: "Manage Sites",
        icon: "university",
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
            title: "Add Sites",
            type: "link",
            permission: "site-create",
            visibility: false,
          },
        ],
      },
      {
        title: "Manage DRS",
        icon: "globe",
        type: "sub",
        active: false,
        permission: "drs-menu-list",
        visibility: false,
        children: [
          {
            path: `/data-entry`,
            title: "Manage DRS",
            type: "link",
            permission: "drs-menu-list",
            visibility: false,
          },
          {
            path: `/workflows`,
            title: "WorkFlows",
            type: "link",
            permission: "workflow-list",
            visibility: false,
          },
        ],
      },
      {
        title: "Manage Roles",
        icon: "unlock-alt",
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
            path: `/addroles`,
            title: "Add Roles",
            type: "link",
            permission: "role-create",
            visibility: false,
          },
        ],
      },
      {
        title: "Manage Addons",
        icon: "unlock",
        type: "sub",
        active: false,
        permission: "addons-list",
        visibility: false,

        children: [
          {
            path: `/manageaddon`,
            title: "Manage Addon",
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
      {
        title: "Manage Tolerances",
        icon: "handshake-o",
        type: "sub",
        active: false,
        permission: "tolerance-list",
        visibility: false,
        children: [
          {
            path: `/tolerances`,
            title: "Tolerances",
            type: "link",
            permission: "tolerance-list",
            visibility: false,
          },
        ],
      },
      {
        title: "Manage Commissions",
        icon: "tags",
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
        ],
      },

      {
        title: "Manage Business Types",
        icon: "th-large",
        type: "sub",
        active: false,
        permission: "business-type-list",
        visibility: false,
        children: [
          {
            path: `/business`,
            title: "Manage Business Types",
            type: "link",
            permission: "business-type-list",
            visibility: false,
          },

          {
            path: `/addbusiness`,
            title: "Add Business Types",
            type: "link",
            permission: "business-type-create",
            visibility: false,
          },
        ],
      },
      // {
      //   title: "Manage Sub-Business Types",
      //   icon: "th",
      //   type: "sub",
      //   active: false,
      //   permission: "business-sub-type-list",
      //   visibility: false,
      //   children: [

      //     {
      //      path: `/sub-business`,
      //       title: "Manage Sub-Business Types",
      //       type: "link",
      //       permission: "business-sub-type-list",
      //       visibility: false,
      //     },
      //     {
      //       path: `/addsub-business`,
      //        title: "Add Sub-Business Types",
      //        type: "link",
      //        permission: "business-sub-type-create",
      //        visibility: false,
      //      },

      //   ],
      // },

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
            title: "Add Charges",
            type: "link",
            permission: "charges-create",
            visibility: false,
          },
        ],
      },
      {
        title: "Manage Shops",
        icon: "shopping-cart",
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
            title: "Add Shops",
            type: "link",
            permission: "shop-create",
            visibility: false,
          },
        ],
      },
      {
        title: "Manage Cards",
        icon: "credit-card-alt",
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
            title: "Add Cards",
            type: "link",
            permission: "card-create",
            visibility: false,
          },
        ],
      },
      {
        title: "Manage Deductions",
        icon: "percent",
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
            title: "Add Deductions",
            type: "link",
            permission: "deduction-create",
            visibility: false,
          },
        ],
      },
      {
        title: "Manage Suppliers",
        icon: "tint",
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
            title: "Add Suppliers",
            type: "link",
            permission: "supplier-create",
            visibility: false,
          },
        ],
      },
      // {
      //   title: "Business Category",
      //   icon: "package",
      //   type: "sub",
      //   active: false,
      //   children: [
      //     {
      //       path: `/managebusinesscategory`,
      //       title: "Manage Business Category",
      //       type: "link",
      //     },
      //     {
      //       path: `/addbusinesscategory`,
      //       title: "Add Business Category",
      //       type: "link",
      //     },
      //   ],
      // },

      {
        title: "Manage Category",
        icon: "check-square",
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
            title: "Manage Sub Business Category",
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

      {
        title: "Manage Reports",
        icon: "pie-chart",
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
      {
        title: "Others",
        icon: "tasks",
        type: "sub",
        active: false,
        permission: "workflow-list",
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
        ],
      },

      {
        title: " Manage Site Fuels",
        icon: "flask",
        type: "sub",
        active: false,
        permission: "tank-list",
        visibility: false,
        children: [
          {
            path: `/managesitetank`,
            title: "Manage Site Tank",
            type: "link",
            permission: "tank-list",
            visibility: false,
          },
          {
            path: `/managesitepump`,
            title: "Manage Site Pump",
            type: "link",
            permission: "pump-list",
            visibility: false,
          },
          {
            path: `/managesitenozzle`,
            title: "Manage Site Nozzle",
            type: "link",
            permission: "nozzle-list",
            visibility: false,
          },
          {
            path: `/fuelprice`,
            title: "Fuel Prices",
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
        ],
      },

      // {
      //   title: "Assign manger",
      //   icon: "shopping-cart",
      //   type: "sub",
      //   active: false,
      //   permission: "item-type-list",
      //   visibility: false,
      //   children: [
      //     {
      //       path: `/assignmanger`,
      //       title: "Assign manger",
      //       type: "link",
      //       permission: "item-type-list",
      //       visibility: false,
      //     },
      //     {
      //       path: `/addmanger`,
      //       title: "Add manger",
      //       type: "link",
      //       permission: "item-type-create",
      //       visibility: false,
      //     },
      //   ],
      // },

      {
        title: "Manage Department Items",
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
            title: "Add Department Items",
            type: "link",
            permission: "department-item-create",
            visibility: false,
          },
        ],
      },
      {
        title: "Email Logs",
    
        icon: "envelope-o",
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
      
        ],
      
      },

      // {
      //   title: "Manage Import Types",
      //   icon: "filter",
      //   type: "sub",
      //   active: false,
      //   permission: "charges-list",
      //   visibility: false,
      //   children: [
      //     {
      //       path: `/manageimporttypes`,
      //       title: "Manage Import Types",
      //       type: "link",
      //       permission: "charges-list",
      //       visibility: false,
      //     },
      //     {
      //       path: `/addimporttypes`,
      //       title: "Add Import Types",
      //       type: "link",
      //       permission: "charges-create",
      //       visibility: false,
      //     },

      //   ],
      // },
    ],
  },
];
