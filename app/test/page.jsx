import AppInitializer from "../components/AppInitializer"
import fetchMenus from "../components/fetchMenus"


export default async function Page() {
    async function getMenus() {
      'use server'
      const res = await fetchMenus()
      return res
    }
  
    const menuItems = await getMenus()
   
    return (
      <AppInitializer menuItems={menuItems}>
        <h1>Hello {menuItems[0].label}</h1>
      </AppInitializer>
    )
  }