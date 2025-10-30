import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function StockQuality() {
  const [data, setData] = useState([]);
  const [brand, setBrand] = useState('');
  const [warehouse, setWarehouse] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    const token = localStorage.getItem('token');
    try {
      const res = await axios.get('/api/reports/stock-quality', {
        headers: { Authorization: `Bearer ${token}` },
        params: { brand, warehouse_id: warehouse }
      });
      setData(res.data.data || res.data);
    } catch (err) {
      alert('Error: ' + (err.response?.data?.error || err.message));
    } finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  const exportXlsx = () => {
    const params = new URLSearchParams();
    if (brand) params.append('brand', brand);
    if (warehouse) params.append('warehouse_id', warehouse);
    params.append('export', 'xlsx');
    window.open(`/api/reports/stock-quality?${params.toString()}`, '_blank');
  };

  return (
    <div style={{padding:20}}>
      <h2>Stock Quality</h2>
      <div style={{marginBottom:12}}>
        <input placeholder="Brand" value={brand} onChange={e=>setBrand(e.target.value)} style={{marginRight:8}}/>
        <input placeholder="Warehouse ID" value={warehouse} onChange={e=>setWarehouse(e.target.value)} style={{marginRight:8}}/>
        <button onClick={fetchData}>View</button>
        <button onClick={exportXlsx} style={{marginLeft:8}}>Export XLSX</button>
      </div>
      {loading ? <div>Loading…</div> :
        <table border="1" cellPadding="6">
          <thead>
            <tr>
              <th>Warehouse</th><th>Brand</th><th>SKU</th><th>Product</th><th>In Hand</th><th>Fresh</th><th>Box Damage</th><th>Material</th><th>Wrong</th><th>Reject</th>
            </tr>
          </thead>
          <tbody>
            {data.map((r,i) => (
              <tr key={i}>
                <td>{r.warehouse_name}</td><td>{r.brand}</td><td>{r.sku}</td><td>{r.product_name}</td><td>{r.total_in_hand}</td><td>{r.fresh_qty}</td><td>{r.box_damage_qty}</td><td>{r.material_damage_qty}</td><td>{r.wrong_product_qty}</td><td>{r.reject_qty}</td>
              </tr>
            ))}
          </tbody>
        </table>
      }
    </div>
  );
}
