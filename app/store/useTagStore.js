import { create } from 'zustand';

const useTagStore = create((set) => ({
    tagItems: [],
    fetchAndSetTags: async () => {
      try {
        const response = await fetch('/api/getTags');
        const data = await response.json();
    
        // Fonction récursive pour transformer les données et ajouter les parents
        const transformTagItem = (item) => {
          return {
            id: item.id,
            name: item.name,
            slug: item.slug,
            order: item.order,
            children: item.childTags ? item.childTags.map(transformTagItem) : [],
            parent: item.parentId || null,
            mainTag : item.mainTag
          };
        };
    
        // Appliquer la transformation aux données des tags
        let tagItems = data.map(transformTagItem);
    
        // Créer une map des éléments de tags par ID pour faciliter l'assignation des enfants aux parents
        const tagMap = {};
        tagItems.forEach(item => {
          tagMap[item.id] = item;
        });
    
        // Construire l'arbre des tags
        tagItems.forEach(item => {
          if (item.parent) {
            if (!tagMap[item.parent].children) {
              tagMap[item.parent].children = [];
            }
            tagMap[item.parent].children.push(item);
          }
        });
    
        // Filtrer les éléments de tags pour ne garder que ceux sans parent
        const rootTagItems = tagItems.filter(item => !item.parent);
    
        // Trier les éléments de tags par le champ "order"
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
    
        set({ tagItems: rootTagItems });
      } catch (error) {
        console.error('Failed to fetch tags:', error);
      }
    }
    ,
    
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