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
  const updateMenuItem = useMenuStore((state) => state.updateMenuItem);
  const [items, setItems] = useState([]);
  const [newLabel, setNewLabel] = useState('');
  const [newRoute, setNewRoute] = useState('/catalogue');

  useEffect(() => {
    fetchAndSetMenus();
  }, [fetchAndSetMenus]);

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
      order: items.length,
      children: [],
      parent: null,
    };

    try {
      await addMenuItem(newItem);
      await fetchAndSetMenus();
      setNewLabel('');
      setNewRoute('/catalogue');
    } catch (error) {
      console.error('Failed to add new menu item:', error);
    }
  };

  const handleDeleteItem = async (itemId) => {
    try {
      await deleteMenuItem(itemId);
      await fetchAndSetMenus();
    } catch (error) {
      console.error('Failed to delete menu item:', error);
    }
  };

  const findItemById = (items, id) => {
    for (let item of items) {
      if (item.id === id) return item;
      if (item.children) {
        const found = findItemById(item.children, id);
        if (found) return found;
      }
    }
    return null;
  };

  const handleUpdateItem = async (itemId, newLabel, newRoute) => {
    const item = findItemById(items, itemId);
    if (!item) {
      console.error(`Item with id ${itemId} not found`);
      return;
    }

    const updatedItem = {
      id: itemId,
      label: newLabel,
      route: newRoute,
      order: item.order,
      parent: item.parent,
    };

    try {
      await updateMenuItem(updatedItem);
      await fetchAndSetMenus();
    } catch (error) {
      console.error('Failed to update menu item:', error);
    }
  };

  const TreeItemComponent = forwardRef<HTMLDivElement, TreeItemComponentProps<MinimalTreeItemData>>((props, ref) => (
    <TreeItem {...props} ref={ref} onRemove={() => handleDeleteItem(props.item.id)} onSave={(newLabel, newRoute) => handleUpdateItem(props.item.id, newLabel, newRoute)} />
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
  route: string;
};

type TreeItemProps = TreeItemComponentProps<MinimalTreeItemData> & {
  onRemove: () => void;
  onSave: (newLabel: string, newRoute: string) => void;
};

/*
 * Here's the component that will render a single row of your tree
 */
const TreeItem = forwardRef<HTMLDivElement, TreeItemProps>((props, ref) => {
  const { onRemove, onSave, ...restProps } = props;
  const [isEditing, setIsEditing] = useState(false);
  const [editedLabel, setEditedLabel] = useState(props.item.value);
  const [editedRoute, setEditedRoute] = useState(props.item.route);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    onSave(editedLabel, editedRoute);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedLabel(props.item.value);
    setEditedRoute(props.item.route);
  };

  return (
    <SimpleTreeItemWrapper {...restProps} ref={ref} className="bg-gray-200 text-black p-2 rounded flex justify-between items-center">
      {isEditing ? (
        <div className="flex items-center">
          <input
            type="text"
            value={editedLabel}
            onChange={(e) => setEditedLabel(e.target.value)}
            className="border p-1 rounded"
          />
          <input
            type="text"
            value={editedRoute}
            onChange={(e) => setEditedRoute(e.target.value)}
            className="border p-1 rounded"
          />
          <button onClick={handleSave} className="bg-blue-500 text-white px-2 py-1 rounded ml-2">
            Save
          </button>
          <button onClick={handleCancel} className="bg-gray-500 text-white px-2 py-1 rounded ml-2">
            Cancel
          </button>
        </div>
      ) : (
        <>
          <div>{props.item.value}</div>
          <div className="flex items-center">
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleEdit();
              }}
              className="text-blue-500 ml-4"
            >
              ✎
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onRemove();
              }}
              className="text-red-500 ml-4"
            >
              ✖
            </button>
          </div>
        </>
      )}
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
    order: index,
    children: item.children ? transformTreeItemsToMenuItems(item.children, item.id) : [],
    parent: parent,
  }));
};

export default ManageTags;
