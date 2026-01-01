"use client";
import React, { useState, useEffect, forwardRef } from 'react';
import useTagStore from '../../store/useTagStore';
import {
  SimpleTreeItemWrapper,
  SortableTree,
  TreeItemComponentProps,
} from 'dnd-kit-sortable-tree';
import NonSSRWrapper from '../../components/NonSSRWrapper';

const TagsTree: React.FC<{}> = () => {
  const tagItems = useTagStore((state) => state.tagItems);
  const fetchAndSetTags = useTagStore((state) => state.fetchAndSetTags);
  const addTagItem = useTagStore((state) => state.addTagItem);
  const deleteTagItem = useTagStore((state) => state.deleteTagItem);
  const updateTagItem = useTagStore((state) => state.updateTagItem);
  const [newTagName, setNewTagName] = useState('');

  useEffect(() => {
    fetchAndSetTags();
  }, [fetchAndSetTags]);

  const handleAddTagItem = async () => {
    const newTag = {
      name: newTagName,
      slug: newTagName.toLowerCase().replace(/\s+/g, '-'),
      mainTag: false, // Default value for new tag
    };
    try {
      await addTagItem(newTag.name, newTag.slug);
      setNewTagName('');
    } catch (error) {
      console.error('Failed to add new tag:', error);
    }
  };

  const handleDeleteTagItem = async (tagName, tagId) => {
    try {
      await deleteTagItem(tagName, tagId);
    } catch (error) {
      console.error('Failed to delete tag:', error);
    }
  };

  const handleUpdateTagItem = async (tagItem, newName, newMainTag) => {
    const updatedTag = {
      id: tagItem.id,
      name: newName,
      slug: newName.toLowerCase().replace(/\s+/g, '-'),
      mainTag: newMainTag,
    };
    try {
      await updateTagItem(tagItem.name, updatedTag);
    } catch (error) {
      console.error('Failed to update tag:', error);
    }
  };

  const TreeItemComponent = forwardRef<HTMLDivElement, TreeItemComponentProps<TagItemData>>((props, ref) => (
    <TreeItem
      {...props}
      ref={ref}
      onRemove={() => handleDeleteTagItem(props.item.name, props.item.id)}
      onSave={(newName, newMainTag) => handleUpdateTagItem(props.item, newName, newMainTag)}
    />
  ));

  TreeItemComponent.displayName = 'TreeItemComponent';

  return (
    <NonSSRWrapper>
      <div className="container mx-auto my-8 p-4 shadow-lg rounded">
        <div className="flex flex-row justify-start items-center my-8 p-4 gap-2 text-black">
          <input
            type="text"
            placeholder="Tag Name"
            value={newTagName}
            onChange={(e) => setNewTagName(e.target.value)}
            className="border p-2 rounded"
          />
          <button
            onClick={handleAddTagItem}
            className="bg-green-500 text-white px-4 py-2 rounded"
          >
            Add Tag
          </button>
        </div>
        <SortableTree
          items={tagItems}
          onItemsChanged={(updatedItems) => updateTagItem(updatedItems)}
          TreeItemComponent={TreeItemComponent}
        />
      </div>
    </NonSSRWrapper>
  );
};

type TagItemData = {
  name: string;
  id: string;
  slug: string;
  order: number;
  mainTag: boolean; // Ajouter cette ligne
};

type TreeItemProps = TreeItemComponentProps<TagItemData> & {
  onRemove: () => void;
  onSave: (newName: string, newMainTag: boolean) => void;
};

const TreeItem = forwardRef<HTMLDivElement, TreeItemProps>((props, ref) => {
  const { onRemove, onSave, ...restProps } = props;
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(props.item.name);
  const [editedMainTag, setEditedMainTag] = useState(props.item.mainTag);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async (e) => {
    e.stopPropagation();
    try {
      await onSave(editedName, editedMainTag);
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to save tag:', error);
    }
  };

  const handleCancel = (e) => {
    e.stopPropagation();
    setIsEditing(false);
    setEditedName(props.item.name);
    setEditedMainTag(props.item.mainTag);
  };

  return (
    <SimpleTreeItemWrapper {...restProps} ref={ref} className="bg-gray-200 text-black p-2 rounded flex justify-between items-center">
      {isEditing ? (
        <div className="flex items-center" onClick={(e) => e.stopPropagation()}>
          <input
            type="text"
            value={editedName}
            onChange={(e) => setEditedName(e.target.value)}
            className="border p-1 rounded"
            onFocus={(e) => e.stopPropagation()} // Prevent exiting edit mode on click
          />
          <input
            type="checkbox"
            checked={editedMainTag}
            onChange={(e) => setEditedMainTag(e.target.checked)}
            className="ml-2"
            onClick={(e) => e.stopPropagation()} // Prevent exiting edit mode on click
          />
          <label className="ml-1">Main Tag</label>
          <button onClick={handleSave} className="bg-blue-500 text-white px-2 py-1 rounded ml-2">
            Save
          </button>
          <button onClick={handleCancel} className="bg-gray-500 text-white px-2 py-1 rounded ml-2">
            Cancel
          </button>
        </div>
      ) : (
        <>
          <div>ID: {props.item.id} / </div>
          <div> order({props.item.order}) / </div>
          <div>{props.item.name}</div>
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={props.item.mainTag}
              disabled
              className="ml-2"
            />
            <label className="ml-1">Main Tag</label>
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

export default TagsTree;
