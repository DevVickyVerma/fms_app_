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
        title: "Manage Roles",
        icon: "package",
        type: "sub",
        active: false,
        children: [
          {
            // path: `/elements/alerts`,
            title: "Manage Roles",
            type: "link",
          },
          {
            // path: `/elements/alerts`,
            title: "Add Roles",
            type: "link",
          },
         
          
        ],
      },
      // {
      //   title: "Advanced Elements",
      //   icon: "file",
      //   type: "sub",
      //   bookmark: true,
      //   active: false,
      //   children: [
      //     {
      //       path: `/advancedElements/mediaObject`,
      //       type: "link",
      //       title: "Media Object",
      //     },
      //     {
      //       path: `/advancedElements/accordions`,
      //       type: "link",
      //       title: "Accordions",
      //     },
      //     {
      //       path: `/advancedElements/tabs`,
      //       type: "link",
      //       title: "Tabs",
      //     },
      //     {
      //       path: `/advancedElements/charts`,
      //       type: "link",
      //       title: "Charts",
      //     },
      //     {
      //       path: `/advancedElements/modal`,
      //       type: "link",
      //       title: "Modal",
      //     },
      //     {
      //       path: `/advancedElements/tooltipandpopover`,
      //       type: "link",
      //       title: "Tooltip and popover",
      //     },
      //     {
      //       path: `/advancedElements/progress`,
      //       type: "link",
      //       title: "Progress",
      //     },
      //     {
      //       path: `/advancedElements/carousels`,
      //       type: "link",
      //       title: "Carousels",
      //     },
      //     {
      //       path: `/advancedElements/headers`,
      //       type: "link",
      //       title: "Headers",
      //     },
      //     {
      //       path: `/advancedElements/footers`,
      //       type: "link",
      //       title: "Footers",
      //     },
      //     {
      //       path: `/advancedElements/userList`,
      //       type: "link",
      //       title: "UserList",
      //     },
      //     {
      //       path: `/advancedElements/search`,
      //       type: "link",
      //       title: "Search",
      //     },
      //     {
      //       path: `/advancedElements/cryptoCurrencies`,
      //       type: "link",
      //       title: "CryptoCurrencies",
      //     },
      //   ],
      // },
    ],
  },

  
];
