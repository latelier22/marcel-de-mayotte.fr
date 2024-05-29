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
    console.log("items apres transform", items);
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
 * Function to transform the menu items to tree items
 */
const transformMenuItemsToTreeItems = (menuItems) => {
  const transform = (item) => ({
    ...item,
    value: item.label,
    children: item.children ? item.children.map(transform) : [],
  });

  return menuItems.map(transform);
};

/*
 * Function to transform tree items back to menu items
 */
const transformTreeItemsToMenuItems = (treeItems, parent = null) => {
  return treeItems.map((item, index) => ({
    id: item.id,
    label: item.value,
    route: item.route,
    order: index,  // Make sure the order is correctly updated here
    children: item.children ? transformTreeItemsToMenuItems(item.children, item.id) : [],
    parent: parent,
  }));
};

export default ManageTags;
