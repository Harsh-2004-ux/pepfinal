import { useEffect, useState } from 'react';
import { getProducts } from '../api/products.api.js';

export default function useProducts(token, q) {
  const [products, setProducts] = useState([]);
  useEffect(() => {
    if (!token) return;
    (async () => {
      const rows = await getProducts(token, q);
      setProducts(rows);
    })();
  }, [token, q]);

  return products;
}

