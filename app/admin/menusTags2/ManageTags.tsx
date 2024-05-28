"use client";
import React, { useState, useEffect } from 'react';
import { DndContext, closestCenter, useSensor, MouseSensor } from '@dnd-kit/core';
import { arrayMove, SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import useMenuStore from '../../store/useStore';
import myFetch from '../../components/myFetch';

import {
  SimpleTreeItemWrapper,
  SortableTree,
  TreeItemComponentProps,
  TreeItems,
} from 'dnd-kit-sortable-tree';

const ManageTags = () => {
  const menuItems = useMenuStore((state) => state.menuItems);
  const setMenus = useMenuStore((state) => state.setMenus);
  const [items, setItems] = useState([]);

  useEffect(() => {
    setItems(transformMenuItemsToTreeItems(menuItems));
  }, [menuItems]);

  const handleItemsChanged = (updatedItems) => {
    setItems(updatedItems);
    const updatedMenuItems = transformTreeItemsToMenuItems(updatedItems);
    setMenus(updatedMenuItems);
    persistMenus(updatedMenuItems);
    console.log('Updated menuItems in store:', updatedMenuItems); // Log the updated state
  };

  const persistMenus = async (menus) => {
    const payload = { data: menus };
    try {
      await myFetch(`/api/menus/  `, 'PUT', payload);
      console.log('Menus updated successfully.');
    } catch (error) {
      console.error('Failed to update menus:', error);
    }
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
    children: item.children ? transformMenuItemsToTreeItems(item.children) : [],
  }));
};

/*
 * Fonction pour transformer les TreeItems en données de menu
 */
const transformTreeItemsToMenuItems = (treeItems) => {
  return treeItems.map(item => ({
    id: item.id,
    label: item.value,
    route: item.route,
    children: item.children ? transformTreeItemsToMenuItems(item.children) : [],
  }));
};

export default ManageTags;
