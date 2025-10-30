const Excel = require('exceljs');
const sequelize = require('../config/db');
const Warehouse = require('../models/warehouse');
const Product = require('../models/product');
const Stock = require('../models/stock');

async function parseNumber(v) {
  if (v === null || v === undefined || v === '') return 0;
  if (typeof v === 'number') return v;
  const cleaned = String(v).replace(/,/g,'').trim();
  const n = parseFloat(cleaned);
  return isNaN(n) ? 0 : n;
}

exports.importAllStockExcel = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'Excel file required (field: file)' });

    const workbook = new Excel.Workbook();
    await workbook.xlsx.readFile(req.file.path);

    const sheet = workbook.getWorksheet('Data') || workbook.worksheets[0];
    if (!sheet) return res.status(400).json({ error: 'No sheet found' });

    const headerRow = sheet.getRow(1);
    const headers = headerRow.values.slice(1).map(h => String(h || '').trim().toLowerCase());

    const findCol = (candidates) => {
      for (const cand of candidates) {
        const idx = headers.findIndex(h => h.includes(cand));
        if (idx >= 0) return idx + 1;
      }
      return -1;
    };

    const colCity = findCol(['city','warehouse','whid','from location']);
    const colState = findCol(['state']);
    const colBrand = findCol(['brand']);
    const colModel = findCol(['model','productname','product code','sku']);
    const colDescription = findCol(['description','product name','product']);
    const colOpStock = findCol(['op stock','opening balance','opening']);
    const colTotalIn = findCol(['total in']);
    const colTotalOut = findCol(['total out']);
    const colFresh = findCol(['fresh']);
    const colBoxDamage = findCol(['box damage']);
    const colMaterialDamage = findCol(['material damage']);
    const colWrongProduct = findCol(['wrong product']);
    const colReject = findCol(['reject']);

    const rows = [];
    sheet.eachRow((row, rowNumber) => {
      if (rowNumber === 1) return;
      const cell = (col) => (col > 0 ? row.getCell(col).value : null);
      rows.push({
        city: cell(colCity),
        state: cell(colState),
        brand: cell(colBrand),
        model: cell(colModel) || cell(colDescription),
        description: cell(colDescription),
        opening_balance: cell(colOpStock),
        total_in: cell(colTotalIn),
        total_out: cell(colTotalOut),
        fresh_qty: cell(colFresh),
        box_damage_qty: cell(colBoxDamage),
        material_damage_qty: cell(colMaterialDamage),
        wrong_product_qty: cell(colWrongProduct),
        reject_qty: cell(colReject)
      });
    });

    const t = await sequelize.transaction();
    try {
      let count = 0;
      for (const r of rows) {
        const cityName = (r.city || 'UNKNOWN').toString().trim();
        const sku = (r.model || '').toString().trim() || ('SKU_' + Math.random().toString(36).slice(2,8)).toUpperCase();

        const [warehouse] = await Warehouse.findOrCreate({
          where: { name: cityName },
          defaults: { code: cityName.replace(/\s+/g,'_').toUpperCase(), location: r.state || null },
          transaction: t
        });

        const [product] = await Product.findOrCreate({
          where: { sku },
          defaults: { name: r.description || sku, brand: r.brand || null },
          transaction: t
        });

        const [stock] = await Stock.findOrCreate({
          where: { warehouse_id: warehouse.id, product_id: product.id },
          defaults: {
            opening_balance: await parseNumber(r.opening_balance),
            total_in: await parseNumber(r.total_in),
            total_out: await parseNumber(r.total_out),
            fresh_qty: await parseNumber(r.fresh_qty),
            box_damage_qty: await parseNumber(r.box_damage_qty),
            material_damage_qty: await parseNumber(r.material_damage_qty),
            wrong_product_qty: await parseNumber(r.wrong_product_qty),
            reject_qty: await parseNumber(r.reject_qty),
            last_updated: new Date()
          },
          transaction: t
        });

        if (!stock.isNewRecord) {
          stock.opening_balance = await parseNumber(r.opening_balance);
          stock.total_in = await parseNumber(r.total_in);
          stock.total_out = await parseNumber(r.total_out);
          stock.fresh_qty = await parseNumber(r.fresh_qty);
          stock.box_damage_qty = await parseNumber(r.box_damage_qty);
          stock.material_damage_qty = await parseNumber(r.material_damage_qty);
          stock.wrong_product_qty = await parseNumber(r.wrong_product_qty);
          stock.reject_qty = await parseNumber(r.reject_qty);
          stock.last_updated = new Date();
          await stock.save({ transaction: t });
        }
        count++;
      }

      await t.commit();
      res.json({ success: true, rowsImported: rows.length, processed: count });
    } catch (err) {
      await t.rollback();
      console.error(err);
      res.status(500).json({ error: 'Transaction error', details: err.message });
    }

  } catch (err) {
    console.error('Import error', err);
    res.status(500).json({ error: 'Server error', details: err.message });
  }
};
