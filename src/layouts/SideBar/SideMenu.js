export const MENUITEMS = [
  {
   
    Items: [
      {
        path: `/dashboard`,
        icon: "home",
        type: "link",
        active: true,
        permission: "",
        visibility: true,
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
            permission: "user-list",
            visibility: false,
          },
        ],
      },
      {
        title: "Manage Clients",
        icon: "users",
        type: "sub",
        active: false,
        permission: "user-list",
        visibility: false,
        children: [
          {
            path: `/clients`,
            type: "link",
            title: "Manage Clients",
            permission: "user-list",
            visibility: false,
          },
          {
            path: `/addclient`,
            type: "link",
            title: "Add Clients",
            permission: "user-create",
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
            permission:"role-list",
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
      //   title: "Manage FuelSites",
      //   icon: "package",
      //   type: "sub",
      //   active: false,
      //   children: [
      //     {
      //       path: `/managefuelsites`,
      //       title: "Manage FuelSites",
      //       type: "link",
      //     },
      //     {
      //       path: `/addfuelsites`,
      //       title: "Add FuelSites",
      //       type: "link",
      //     },
      //   ],
      // },
            {
        title: "Manage DSR",
        icon: "package",
        type: "sub",
        active: false,
        permission: "supplier-create",
        visibility: false,
        children: [
          {
            path: `/data-entry`,
            title: "Manage DSR",
            type: "link",
            permission: "supplier-create",
            visibility: false,
          },
        
        ],
      },
      
      
    ],
  },

  
];
