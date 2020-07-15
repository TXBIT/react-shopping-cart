import { FETCH_PRODUCTS } from '../types';

export const fetchProducts = () => async (dispatch) => {
  const res = await fetch(`http://localhost:5000/api/products`);
  // const res = await fetch(`/api/products`);
  const data = await res.json();
  dispatch({
    type: FETCH_PRODUCTS,
    payload: data,
  });
};
