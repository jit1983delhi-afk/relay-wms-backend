const Excel = require('exceljs');
const { QueryTypes } = require('sequelize');
const sequelize = require('../config/db');

exports.getStockQuality = async (req, res) => {
  const { warehouse_id, brand, sku, export: exp } = req.query;
  const where = [];
  const replacements = {};

  if (warehouse_id) { where.push('w.id = :warehouse_id'); replacements.warehouse_id = warehouse_id; }
  if (brand) { where.push('p.brand ILIKE :brand'); replacements.brand = `%${brand}%`; }
  if (sku) { where.push('p.sku = :sku'); replacements.sku = sku; }

  const whereClause = where.length ? `WHERE ${where.join(' AND ')}` : '';

  const sql = `
    SELECT w.code AS warehouse_code, w.name AS warehouse_name,
           p.brand, p.sku, p.name AS product_name,
           s.opening_balance, s.total_in, s.total_out,
           (COALESCE(s.opening_balance,0) + COALESCE(s.total_in,0) - COALESCE(s.total_out,0)) AS total_in_hand,
           s.fresh_qty, s.box_damage_qty, s.material_damage_qty, s.wrong_product_qty, s.reject_qty
    FROM stock s
    JOIN products p ON p.id = s.product_id
    JOIN warehouses w ON w.id = s.warehouse_id
    ${whereClause}
    ORDER BY w.code, p.brand, p.sku
    LIMIT 20000;
  `;

  const rows = await sequelize.query(sql, { replacements, type: QueryTypes.SELECT });

  if (exp && (exp === 'xlsx' || exp === 'csv')) {
    return exports.exportStockQuality(rows, exp, res);
  }
  res.json({ count: rows.length, data: rows });
};

exports.exportStockQuality = async (rows, format, res) => {
  if (format === 'csv') {
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="stock_quality_${Date.now()}.csv"`);
    const header = ['Warehouse Code','Warehouse Name','Brand','SKU','Product','Opening Balance','Total In','Total Out','Total In Hand','Fresh','Box Damage','Material Damage','Wrong Product','Reject'];
    res.write(header.join(',') + '\n');
    for (const r of rows) {
      const row = [
        r.warehouse_code || '',
        r.warehouse_name || '',
        r.brand || '',
        r.sku || '',
        r.product_name || '',
        r.opening_balance || 0,
        r.total_in || 0,
        r.total_out || 0,
        r.total_in_hand || 0,
        r.fresh_qty || 0,
        r.box_damage_qty || 0,
        r.material_damage_qty || 0,
        r.wrong_product_qty || 0,
        r.reject_qty || 0
      ];
      res.write(row.map(v => `"${String(v).replace(/"/g,'""')}"`).join(',') + '\n');
    }
    res.end();
    return;
  }

  const workbook = new Excel.Workbook();
  const sheet = workbook.addWorksheet('Stock Quality');
  sheet.columns = [
    { header: 'Warehouse Code', key: 'warehouse_code', width: 18 },
    { header: 'Warehouse Name', key: 'warehouse_name', width: 24 },
    { header: 'Brand', key: 'brand', width: 18 },
    { header: 'SKU', key: 'sku', width: 20 },
    { header: 'Product', key: 'product_name', width: 40 },
    { header: 'Opening Balance', key: 'opening_balance', width: 14 },
    { header: 'Total In', key: 'total_in', width: 12 },
    { header: 'Total Out', key: 'total_out', width: 12 },
    { header: 'Total In Hand', key: 'total_in_hand', width: 14 },
    { header: 'Fresh', key: 'fresh_qty', width: 10 },
    { header: 'Box Damage', key: 'box_damage_qty', width: 12 },
    { header: 'Material Damage', key: 'material_damage_qty', width: 14 },
    { header: 'Wrong Product', key: 'wrong_product_qty', width: 12 },
    { header: 'Reject', key: 'reject_qty', width: 10 }
  ];
  rows.forEach(r => sheet.addRow(r));
  sheet.getRow(1).font = { bold: true };

  res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
  res.setHeader('Content-Disposition', `attachment; filename="stock_quality_${Date.now()}.xlsx"`);
  await workbook.xlsx.write(res);
  res.end();
};
