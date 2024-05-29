"use client";
import React, { useState, useEffect, forwardRef } from 'react';
import useMenuStore from '../../store/useStore';
import {
  SimpleTreeItemWrapper,
  SortableTree,
  TreeItemComponentProps,
} from 'dnd-kit-sortable-tree';
import NonSSRWrapper from '../../components/NonSSRWrapper';

const ManageTags: React.FC = () => {
  const menuItems = useMenuStore((state) => state.menuItems);
  const fetchAndSetMenus = useMenuStore((state) => state.fetchAndSetMenus);
  const addMenuItem = useMenuStore((state) => state.addMenuItem);
  const deleteMenuItem = useMenuStore((state) => state.deleteMenuItem);
  const [items, setItems] = useState([]);
  const [newLabel, setNewLabel] = useState('');
  const [newRoute, setNewRoute] = useState('/catalogue');

  useEffect(() => {
    fetchAndSetMenus();
  }, [fetchAndSetMenus]); // Ajout de la dépendance manquante

  useEffect(() => {
    setItems(transformMenuItemsToTreeItems(menuItems));
  }, [menuItems]);

  const handleItemsChanged = async (updatedItems) => {
    setItems(updatedItems);
    const updatedMenuItems = transformTreeItemsToMenuItems(updatedItems);
    await useMenuStore.getState().updateMenuItems(updatedMenuItems);
  };

  const handleAddItem = async () => {
    const newItem = {
      label: newLabel,
      route: newRoute,
      order: items.length, // Add the new item at the end
      children: [],
      parent: null,
    };

    try {
      await addMenuItem(newItem);
      // Refetch and set the menus to update the state with the new item
      await fetchAndSetMenus();
      // Clear the input fields after adding the item
      setNewLabel('');
      setNewRoute('/catalogue');
    } catch (error) {
      console.error('Failed to add new menu item:', error);
    }
  };

  const handleDeleteItem = async (itemId) => {
    try {
      await deleteMenuItem(itemId);
      // Refetch and set the menus to update the state after deletion
      await fetchAndSetMenus();
    } catch (error) {
      console.error('Failed to delete menu item:', error);
    }
  };

  const TreeItemComponent = forwardRef<HTMLDivElement, TreeItemComponentProps<MinimalTreeItemData>>((props, ref) => (
    <TreeItem {...props} ref={ref} onRemove={() => handleDeleteItem(props.item.id)} />
  ));

  TreeItemComponent.displayName = 'TreeItemComponent';

  return (
    <NonSSRWrapper>
      <div className="container mx-auto my-8 p-4 shadow-lg rounded">
        <div className="flex flex-row justify-start items-center my-8 p-4 gap-2 text-black">
          <input
            type="text"
            placeholder="Label"
            value={newLabel}
            onChange={(e) => setNewLabel(e.target.value)}
            className="border p-2 rounded"
          />
          <input
            type="text"
            placeholder="Route"
            value={newRoute}
            onChange={(e) => setNewRoute(e.target.value)}
            className="border p-2 rounded"
          />
          <button
            onClick={handleAddItem}
            className="bg-green-500 text-white px-4 py-2 rounded"
          >
            Add Item
          </button>
        </div>
        <SortableTree
          items={items}
          onItemsChanged={handleItemsChanged}
          TreeItemComponent={TreeItemComponent}
        />
      </div>
    </NonSSRWrapper>
  );
};

type MinimalTreeItemData = {
  value: string;
  id: string;
};

type TreeItemProps = TreeItemComponentProps<MinimalTreeItemData> & {
  onRemove: () => void;
};

/*
 * Here's the component that will render a single row of your tree
 */
const TreeItem = forwardRef<HTMLDivElement, TreeItemProps>((props, ref) => {
  return (
    <SimpleTreeItemWrapper {...props} ref={ref} className="bg-gray-200 text-black p-2 rounded flex justify-between items-center">
      <div>{props.item.value}</div>
      <button
        onClick={(e) => {
          e.stopPropagation();
          props.onRemove();
        }}
        className="text-red-500 ml-4"
      >
        ✖
      </button>
    </SimpleTreeItemWrapper>
  );
});

TreeItem.displayName = 'TreeItem';

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
