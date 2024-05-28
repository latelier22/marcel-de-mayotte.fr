"use client";
import React, { useState, useEffect } from 'react';
import { DndContext, closestCenter, useSensor, MouseSensor } from '@dnd-kit/core';
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
  const setMenus = useMenuStore((state) => state.setMenus);
  const [items, setItems] = useState([]);

  useEffect(() => {
    setItems(transformMenuItemsToTreeItems(menuItems));
  }, [menuItems]);

  useEffect(() => {
    console.log('Initial items:', items);
  }, []);

  const handleItemsChanged = (updatedItems) => {
    setItems(updatedItems);
    const updatedMenuItems = transformTreeItemsToMenuItems(updatedItems);
    setMenus(updatedMenuItems);
    console.log('Updated menuItems in store:', updatedMenuItems); // Log the updated state
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
  const [sample, setSample] = useState('');
  return (
    <SimpleTreeItemWrapper {...props} ref={ref} className="bg-gray-200 text-black p-2 rounded">
      <div>{props.item.value}</div>
      <input
        value={sample}
        onChange={(e) => {
          setSample(e.target.value);
        }}
        className="mt-1 p-1 rounded border"
      />
    </SimpleTreeItemWrapper>
  );
});

/*
 * Fonction pour transformer les données de menu en une structure compatible avec TreeItems
 */
const transformMenuItemsToTreeItems = (menuItems, parentId = '') => {
  return menuItems.map((item, index) => ({
    id: generateHierarchicalId(parentId, index),
    value: item.label,
    children: item.children ? transformMenuItemsToTreeItems(item.children, generateHierarchicalId(parentId, index)) : [],
  }));
};

/*
 * Fonction pour transformer les TreeItems en données de menu
 */
const transformTreeItemsToMenuItems = (treeItems) => {
  return treeItems.map(item => ({
    label: item.value,
    children: item.children ? transformTreeItemsToMenuItems(item.children) : [],
  }));
};

/*
 * Fonction pour générer des identifiants hiérarchiques uniques
 */
const generateHierarchicalId = (parentId, childId) => {
  return parentId ? `${parentId}-${childId}` : `${childId}`;
};

export default ManageTags;
