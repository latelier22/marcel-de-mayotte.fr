"use client";
import React, { useState, useEffect } from 'react';
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
  const setMenus = useMenuStore((state) => state.setMenus);
  const updateMenuItems = useMenuStore((state) => state.updateMenuItems);
  const [items, setItems] = useState([]);

  useEffect(() => {
    fetchAndSetMenus();
  }, []);

  useEffect(() => {
    setItems(menuItems);
    console.log("items after set", items);
  }, [menuItems]);

  const handleItemsChanged = async (updatedItems) => {
    setItems(updatedItems);
    setMenus(updatedItems);
    await updateMenuItems(updatedItems);
    console.log('Updated menuItems in store and database:', updatedItems); // Log the updated state
  };

  return (
    <NonSSRWrapper>
      <SortableTree
        items={items}
        onItemsChanged={handleItemsChanged}
        TreeItemComponent={TreeItem}
      />
    </NonSSRWrapper>
  );
};

type MinimalTreeItemData = {
  label: string;
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
      <div>{props.item.label}</div>
    </SimpleTreeItemWrapper>
  );
});

TreeItem.displayName = 'TreeItem';

export default ManageTags;
