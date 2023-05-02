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
        title: "Manage Role",
        icon: "package",
        type: "sub",
        active: false,
        children: [
          {
           path: `/roles`,
            title: "Manage Role",
            type: "link",
          },
          // {
          //   // path: `manageroles/#addRoleModal`,
          //   title: "Add Roles",
          //   type: "link",
          // },
         
          
        ],
      },
    
    ],
  },

  
];
