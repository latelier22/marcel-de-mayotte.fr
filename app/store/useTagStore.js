import { create } from 'zustand';

const useTagStore = create((set) => ({
    tagItems: [],
    fetchAndSetTags: async () => {
      try {
        const response = await fetch('/api/getTags');
        const data = await response.json();
        set({ tagItems: data });
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
      console.log("oldTagName, newTagName",oldTagName, newTagName)
      console.log("updatedTag",updatedTag)
      try {
        await fetch(`/api/editTag`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({oldTagName, newTagName }),
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