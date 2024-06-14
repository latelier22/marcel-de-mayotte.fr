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
  const updateMenuItems = useMenuStore((state) => state.updateMenuItems);
  const [newLabel, setNewLabel] = useState('');
  const [newRoute, setNewRoute] = useState('/catalogue');
  const [collapsedItems, setCollapsedItems] = useState({});

  useEffect(() => {
    fetchAndSetMenus();
  }, [fetchAndSetMenus]);

  const handleItemsChanged = async (updatedItems) => {
    const updatedMenuItems = transformTreeItemsToMenuItems(updatedItems);
    await updateMenuItems(updatedMenuItems);
    await fetchAndSetMenus();
  };

  const handleAddItem = async () => {
    const newItem = {
      label: newLabel,
      route: newRoute,
      order: menuItems.length,
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

  const handleCollapse = (itemId) => {
    setCollapsedItems(prev => ({
      ...prev,
      [itemId]: !prev[itemId]
    }));
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
    const item = findItemById(menuItems, itemId);
    if (!item) {
      console.error(`Item with id ${itemId} not found`);
      return;
    }
   

    if (item.label === newLabel && item.route === newRoute) {
      return;
    }

    const updatedItem = {
      ...item,
      label: newLabel,
      route: newRoute,
    };

    try {
      await updateMenuItem(updatedItem);
      await fetchAndSetMenus();
    } catch (error) {
      console.error('Failed to update menu item:', error);
    }
  };

  const TreeItemComponent = forwardRef<HTMLDivElement, TreeItemComponentProps<MinimalTreeItemData>>((props, ref) => (
    <TreeItem
      {...props}
      ref={ref}
      onRemove={() => handleDeleteItem(props.item.id)}
      onSave={(newLabel, newRoute) => handleUpdateItem(props.item.id, newLabel, newRoute)}
      onCollapse={() => handleCollapse(props.item.id)}
      collapsed={collapsedItems[props.item.id]}
    />
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
          items={menuItems}
          onItemsChanged={handleItemsChanged}
          TreeItemComponent={TreeItemComponent}
        />
      </div>
    </NonSSRWrapper>
  );
};

type MinimalTreeItemData = {
  label: string;
  id: string;
  route: string;
};

type TreeItemProps = TreeItemComponentProps<MinimalTreeItemData> & {
  onRemove: () => void;
  onSave: (newLabel: string, newRoute: string) => void;
  onCollapse: () => void;
  collapsed: boolean;
};

const TreeItem = forwardRef<HTMLDivElement, TreeItemProps>((props, ref) => {
  const { onRemove, onSave, onCollapse, collapsed, ...restProps } = props;
  const [isEditing, setIsEditing] = useState(false);
  const [editedLabel, setEditedLabel] = useState(props.item.label);
  const [editedRoute, setEditedRoute] = useState(props.item.route);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = (e) => {
    e.stopPropagation();
    onSave(editedLabel, editedRoute);
    setIsEditing(false);
  };

  const handleCancel = (e) => {
    e.stopPropagation();
    setIsEditing(false);
    setEditedLabel(props.item.label);
    setEditedRoute(props.item.route);
  };

  return (
    <SimpleTreeItemWrapper {...restProps} ref={ref} className="bg-gray-200 text-black p-2 rounded flex justify-between items-center">
      {isEditing ? (
        <div className="flex items-center" onClick={(e) => e.stopPropagation()}>
          <input
            type="text"
            value={editedLabel}
            onChange={(e) => setEditedLabel(e.target.value)}
            className="border p-1 rounded"
            onFocus={(e) => e.stopPropagation()} // Prevent exiting edit mode on click
          />
          <input
            type="text"
            value={editedRoute}
            onChange={(e) => setEditedRoute(e.target.value)}
            className="border p-1 rounded"
            onFocus={(e) => e.stopPropagation()} // Prevent exiting edit mode on click
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
         {props.item.children && props.item.children.length > 0 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onCollapse();
                }}
                className="text-black ml-4"
              >
                {collapsed ? '▶' : '▼'}
              </button>
            )}
          <div>{props.item.label}</div>
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

export default ManageTags;

/*
 * Function to transform tree items back to menu items
 */
const transformTreeItemsToMenuItems = (treeItems, parent = null) => {
  return treeItems.map((item, index) => ({
    id: item.id,
    label: item.label,
    route: item.route,
    order: index,
    children: item.children ? transformTreeItemsToMenuItems(item.children, item.id) : [],
    parent: parent,
  }));
};
