"use client";
import React, { useState, useEffect } from 'react';
import { DndContext, closestCenter } from '@dnd-kit/core';
import { arrayMove, SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import useMenuStore from '../../store/useStore';
import {
  SimpleTreeItemWrapper,
  SortableTree,
  TreeItemComponentProps,
  TreeItems,
} from 'dnd-kit-sortable-tree';

const ManageTags = () => {
  const menuItems = useMenuStore((state) => state.menuItems);
  const fetchAndSetMenus = useMenuStore((state) => state.fetchAndSetMenus);
  const setMenus = useMenuStore((state) => state.setMenus);
  const updateMenuItems = useMenuStore((state) => state.updateMenuItems);
  const [items, setItems] = useState([]);

  useEffect(() => {
    fetchAndSetMenus();
  }, []);

  useEffect(() => {
    setItems(transformMenuItemsToTreeItems(menuItems));
  }, [menuItems]);

  const handleItemsChanged = async (updatedItems) => {
    setItems(updatedItems);
    const updatedMenuItems = transformTreeItemsToMenuItems(updatedItems);
    setMenus(updatedMenuItems);
    await updateMenuItems(updatedMenuItems);
    console.log('Updated menuItems in store and database:', updatedMenuItems); // Log the updated state
  };

  return (
    <SortableTree
      items={items}
      onItemsChanged={handleItemsChanged}
      TreeItemComponent={TreeItem}
    />
  );
};

type MinimalTreeItemData = {
  value: string;
};

/*
 * Here's the component that will render a single row of your tree
 */
const TreeItem = React.forwardRef<
  HTMLDivElement,
  TreeItemComponentProps<MinimalTreeItemData>
>((props, ref) => {
  return (
    <SimpleTreeItemWrapper {...props} ref={ref} className="bg-gray-200 text-black p-2 rounded">
      <div>{props.item.value}</div>
    </SimpleTreeItemWrapper>
  );
});

/*
 * Fonction pour transformer les données de menu en une structure compatible avec TreeItems
 */
const transformMenuItemsToTreeItems = (menuItems) => {
  return menuItems.map((item) => ({
    id: item.id,
    value: item.label,
    route: item.route,
    order: item.order,
    children: item.children ? transformMenuItemsToTreeItems(item.children) : [],
    parent: item.parent,
  }));
};

/*
 * Fonction pour transformer les TreeItems en données de menu
 */
const transformTreeItemsToMenuItems = (treeItems, parent = null) => {
  return treeItems.map((item, index) => ({
    id: item.id,
    label: item.value,
    route: item.route,
    order: index,  // Assurez-vous que l'ordre est correctement mis à jour ici
    children: item.children ? transformTreeItemsToMenuItems(item.children, item.id) : [],
    parent: parent,
  }));
};

export default ManageTags;
