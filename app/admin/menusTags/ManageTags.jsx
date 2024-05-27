"use client";
import React, { useState } from 'react';
import { DndContext, closestCenter } from '@dnd-kit/core';
import { arrayMove, SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import useMenuStore from '../../store/useStore';

const SortableItem = ({ id, label, children, onClick }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    cursor: isDragging ? 'grabbing' : 'pointer',
  };

  return (
    <li
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={() => {
        if (!isDragging) {
          console.log(`Clicked on item ${id}`);
          onClick(id, children);
        }
      }}
      className="p-2 border mb-1 flex items-center justify-between"
    >
      <div className="flex justify-between items-center w-full">
        <span>{label} {children.length > 0 && `(${children.length})`}</span>
        {children.length > 0 && (
          <span className="ml-2">
            ▶
          </span>
        )}
      </div>
    </li>
  );
};

const ManageTags = ({ allTags }) => {
  const menuItems = useMenuStore((state) => state.menuItems);
  const [selectedSubMenus, setSelectedSubMenus] = useState([]);
  const [selectedSubSubMenus, setSelectedSubSubMenus] = useState([]);

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      const oldIndex = menuItems.findIndex((item) => item.id === active.id);
      const newIndex = menuItems.findIndex((item) => item.id === over.id);

      if (
        menuItems[oldIndex].label === 'Accueil' ||
        menuItems[oldIndex].label === 'ADMIN' ||
        menuItems[newIndex].label === 'Accueil' ||
        menuItems[newIndex].label === 'ADMIN'
      ) {
        return;
      }

      useMenuStore.setState({ menuItems: arrayMove(menuItems, oldIndex, newIndex) });
    } else {
      const Index = menuItems.findIndex((item) => item.id === active.id);
      console.log(menuItems[Index]);
      handleClick(menuItems[Index].id, menuItems[Index].children);
    }
  };

  const handleClick = (id, children) => {
    console.log("Handling click for item with id:", id);
    if (children.length > 0) {
      setSelectedSubMenus(children);
      setSelectedSubSubMenus([]);
    } else {
      setSelectedSubMenus([]);
      setSelectedSubSubMenus([]);
      console.log("Pas d'enfant");
    }
  };

  const handleSubMenuClick = (id, children) => {
    console.log("Handling sub menu click for item with id:", id);
    if (children.length > 0) {
      setSelectedSubSubMenus(children);
    } else {
      setSelectedSubSubMenus([]);
      console.log("Pas d'enfant");
    }
  };

  const MenuTreeView = ({ menus, onClick }) => (
    <ul>
      <SortableContext items={menus.map(menu => menu.id)} strategy={verticalListSortingStrategy}>
        {menus.map(menu => (
          <SortableItem key={menu.id} id={menu.id} label={menu.label} children={menu.children} onClick={onClick} />
        ))}
      </SortableContext>
    </ul>
  );

  return (
    <div className="manage-tags grid grid-cols-12 gap-4">
      <div className="col-span-9 grid grid-cols-3 gap-4">
        <div>
          <h2>Menus Principaux</h2>
          <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <MenuTreeView menus={menuItems} onClick={handleClick} />
          </DndContext>
        </div>
        <div>
          <h2>Sous-Menus</h2>
          {selectedSubMenus.length > 0 ? (
            <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
              <MenuTreeView menus={selectedSubMenus} onClick={handleSubMenuClick} />
            </DndContext>
          ) : (
            <p>Pas d'enfant</p>
          )}
        </div>
        <div>
          <h2>Sous-Sous-Menus</h2>
          {selectedSubSubMenus.length > 0 ? (
            <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
              <MenuTreeView menus={selectedSubSubMenus} onClick={() => {}} />
            </DndContext>
          ) : (
            <p>Pas d'enfant</p>
          )}
        </div>
      </div>
      <div className="col-span-3">
        <h2>Tags</h2>
        <ul>
          {allTags.map(tag => (
            <li key={tag.slug}>
              {tag.name} MAINTAG {tag.mainTag ? 'Yes' : 'No'} {tag.parentId && tag.parentId.length > 0 && `parentId ${tag.parentId}`}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ManageTags;
