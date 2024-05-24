"use client";
import React, { useState } from 'react';

const ManageTags = ({ allTags }) => {
  const [tags, setTags] = useState(allTags);
  // const [menus, setMenus] = useState(menuItems || []);

  return (
    <ul>
  {tags.map(tag => (
    <li key={tag.slug}>
      {tag.name} MAINTAG {tag.mainTag ? 'Yes' : 'No'} {tag.parentId && tag.parentId.length > 0 && `parentId ${tag.parentId}`}
    </li>
  ))}
</ul>

  );
};

export default ManageTags;



// "use client";
// // import React, { useState } from 'react';

// // const ManageTags = ({ allTags, menuItems }) => {
// //   const [tags, setTags] = useState(allTags || []);
// //   const [menus, setMenus] = useState(menuItems || []);

// //   const structureTags = (tags) => {
// //     const tagMap = new Map();

// //     tags.forEach(tag => {
// //       tagMap.set(tag.name, { ...tag, children: [] });
// //     });

// //     tags.forEach(tag => {
// //       if (tag.parentId) {
// //         const parent = tagMap.get(tag.parentId);
// //         if (parent) {
// //           parent.children.push(tagMap.get(tag.name));
// //         }
// //       }
// //     });

// //     return Array.from(tagMap.values()).filter(tag => !tag.parentId);
// //   };

// //   const structuredTags = structureTags(tags);

// //   const structureMenus = (menus) => {
// //     const menuMap = new Map();

// //     menus.forEach(menu => {
// //       menuMap.set(menu.id, { ...menu, children: [] });
// //     });

// //     menus.forEach(menu => {
// //       if (menu.parentId) {
// //         const parent = menuMap.get(menu.parentId);
// //         if (parent) {
// //           parent.children.push(menuMap.get(menu.id));
// //         }
// //       }
// //     });

// //     return Array.from(menuMap.values()).filter(menu => !menu.parentId);
// //   };

// //   const structuredMenus = structureMenus(menus);

// //   return (
// //     <div className="manage-tags">
// //       <h1>Manage Tags and Menus</h1>
// //       <TagTreeView tags={structuredTags} />
// //       <MenuTreeView menus={structuredMenus} />
// //     </div>
// //   );
// // };

// // const TagTreeView = ({ tags }) => {
// //   return (
// //     <ul>
// //       {tags.map(tag => (
// //         <li key={tag.slug}>
// //           {tag.name} MAINTAG {tag.mainTag ? 'Yes' : 'No'} {tag.parentId && tag.parentId.length > 0 && `parentId ${tag.parentId}`}
// //           {tag.children.length > 0 && <TagTreeView tags={tag.children} />}
// //         </li>
// //       ))}
// //     </ul>
// //   );
// // };

// // const MenuTreeView = ({ menus }) => {
// //   return (
// //     <ul>
// //       {menus.map(menu => (
// //         <li key={menu.id}>
// //           {menu.label}
// //           {menu.children.length > 0 && <MenuTreeView menus={menu.children} />}
// //         </li>
// //       ))}
// //     </ul>
// //   );
// // };

// // export default ManageTags;

