// app/admin/test/page.jsx

import AppInitializer from "../../components/AppInitializer"
import fetchMenus from "../../components/fetchMenus"


export default async function Page() {
    async function getMenus() {
      'use server'
      const res = await fetchMenus()
      return res
    }
  
    const menuItems = await getMenus()
   
    return (
      <AppInitializer menuItems={menuItems}>
        <div className=" pt-64">
        <h1>Menu Items</h1>
        {menuItems.map( (m) => (<div key={m.id}> {m.label} </div>))}
        </div>
      </AppInitializer>
    )
  }