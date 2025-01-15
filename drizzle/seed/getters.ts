import { TABLE_DATA } from "./data/s_purchase_head";

export const getOrders = () => {
  return Object.values(TABLE_DATA["s_purchase_head"]).map((order) => {
    return order.order_no;
  });
};
