export const MENUITEMS = [
  {
   
    Items: [
      {
        path: `/dashboard`,
        icon: "home",
        type: "link",
        active: true,
        title: "Dashboard",
      },
      {
        title: "Manage Clients",
        icon: "database",
        type: "sub",
        active: false,
        children: [
          {
            path: `/clients`,
            type: "link",
            title: "Manage Clients",
          },
          {
            path: `/addclient`,
            type: "link",
            title: "Add Clients",
          },
         
        
        ],
      },
      {
        title: "Manage Sites",
        icon: "package",
        type: "sub",
        active: false,
        children: [
          {
            path: `/sites`,
            title: "Manage Sites",
            type: "link",
          },
          {
            path: `/addsite`,
            title: "Add Sites",
            type: "link",
          },
         
          
        ],
      },
      {
        title: "Manage Roles",
        icon: "package",
        type: "sub",
        active: false,
        children: [
          {
           path: `/roles`,
            title: "Manage Roles",
            type: "link",
          },
          // {
          //   // path: `manageroles/#addRoleModal`,
          //   title: "Add Roles",
          //   type: "link",
          // },
         
          
        ],
      },
      {
        title: "Manage Addons",
        icon: "package",
        type: "sub",
        active: false,
        children: [
          {
           path: `/manageaddon`,
            title: "Manage Addon",
            type: "link",
          },
          // {
          //   path: `/addaddon`,
          //   title: "Add Addon",
          //   type: "link",
          // },
         
          
        ],
      },
      {
        title: "Manage Business Types",
        icon: "package",
        type: "sub",
        active: false,
        children: [
          {
            path: `/business`,
             title: "Manage Business Types",
             type: "link",
           },
          {
           path: `/sub-business`,
            title: "Manage Sub-Business Types",
            type: "link",
          },
          {
            path: `/addbusiness`,
             title: "Add Business Types",
             type: "link",
           },
         
          
        ],
      },
    
    ],
  },

  
];
