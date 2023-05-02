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
            // path: `/components/cardsDesign`,
            type: "link",
            title: "Manage Clients",
          },
          {
            // path: `/components/cardsDesign`,
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
            // path: `/elements/alerts`,
            title: "Manage Sites",
            type: "link",
          },
          {
            // path: `/elements/alerts`,
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
           path: `/manageroles`,
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
