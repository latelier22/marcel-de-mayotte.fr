import myFetch from './myFetch';

async function fetchPhotoTagOrders(id = null) {
  const endpoint = id ? `/api/photo-tag-orders?filters[tagId][$eq]=${id}&sort=order:asc` : `/api/photo-tag-orders`;
  const response = await myFetch(endpoint, 'GET', null, 'orders');

  let { data: strapiOrders } = response;

    const orders = strapiOrders.map(item => ({
      id: item.id,
      ...item.attributes
  }));

  console.log(orders)

  return orders;
}

export default fetchPhotoTagOrders;
