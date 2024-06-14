import { create } from 'zustand';

const useTagStore = create((set) => ({
    tagItems: [],
    fetchAndSetTags: async () => {
      try {
        const response = await fetch('/api/getTags');
        const data = await response.json();
  
        // Function to transform tag data and avoid duplication
        const transformTagItem = (item) => ({
          id: item.id,
          name: item.name,
          slug: item.slug,
          order: item.order,
          children: [],
          parent: item.parentId || null,
          mainTag: item.mainTag
        });
  
        // Step 1: Transform the data
        let transformedTags = data.map(transformTagItem);
  
        // Step 2: Create a map for easy reference
        const tagMap = {};
        transformedTags.forEach(item => {
          tagMap[item.id] = item;
        });
  
        // Step 3: Assign children to their respective parents
        transformedTags.forEach(item => {
          if (item.parent) {
            if (!tagMap[item.parent].children) {
              tagMap[item.parent].children = [];
            }
            tagMap[item.parent].children.push(item);
          }
        });
  
        // Step 4: Filter root tags (those without parents)
        const rootTagItems = transformedTags.filter(item => !item.parent);
  
        // Step 5: Sort the tags by 'order' and recursively sort their children
        const sortChildren = (items) => {
          items.forEach(item => {
            if (item.children) {
              item.children.sort((a, b) => a.order - b.order);
              sortChildren(item.children);
            }
          });
        };
  
        rootTagItems.sort((a, b) => a.order - b.order);
        sortChildren(rootTagItems);
  
        console.log("rootTagItems", rootTagItems);
  
        set({ tagItems: rootTagItems });
      } catch (error) {
        console.error('Failed to fetch tags:', error);
      }
    },
    
    addTagItem: async (tagName, tagSlug) => {
      try {
        const response = await fetch("/api/createTag", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ tagName, tagSlug }),
        });
  
        const createdTag = await response.json();
        console.log("createdTag",createdTag)
        set((state) => ({
          tagItems: [...state.tagItems, createdTag],
        }));
      } catch (error) {
        console.error('Failed to add tag item:', error);
      }
    },
    deleteTagItem: async (tagName, tagId) => {
      try {
        const response = await fetch("/api/deleteTag", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ tagName }),
        });
        set((state) => ({
          tagItems: state.tagItems.filter((tag) => tag.id !== tagId),
        }));
      } catch (error) {
        console.error('Failed to delete tag item:', error);
      }
    },
    // const handleEditTag = async (oldTagName, newTagName) =>
    updateTagItem: async (oldTagName, updatedTag) => {
      const newTagName = updatedTag.name
      const newMaintag = updatedTag.mainTag
      
      console.log("updatedTag",updatedTag)
      try {
        await fetch(`/api/editTag`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({oldTagName, updatedTag }),
        });
        set((state) => ({
          tagItems: state.tagItems.map((tag) =>
            tag.id === updatedTag.id ? updatedTag : tag
          ),
        }));
      } catch (error) {
        console.error('Failed to update tag item:', error);
      }
    },
  }));
  
  export default useTagStore;