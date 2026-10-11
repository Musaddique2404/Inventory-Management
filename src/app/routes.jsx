import { Navigate, Route, Routes } from 'react-router-dom'
import { ROUTES } from '../lib/nav.js'
import Dashboard from '../pages/Dashboard.jsx'
import Reports from '../pages/Reports.jsx'
import Products from '../pages/Products.jsx'
import ProductForm from '../pages/ProductForm.jsx'
import ProductDetail from '../pages/ProductDetail.jsx'
import StockIn from '../pages/StockIn.jsx'
import NewStockIn from '../pages/NewStockIn.jsx'
import Transfers from '../pages/Transfers.jsx'
import NewTransfer from '../pages/NewTransfer.jsx'
import TransferInvoice from '../pages/TransferInvoice.jsx'
import Adjustments from '../pages/Adjustments.jsx'
import Sales from '../pages/Sales.jsx'
import NewSale from '../pages/NewSale.jsx'
import SaleInvoice from '../pages/SaleInvoice.jsx'
import Shops from '../pages/Shops.jsx'
import ShopDetail from '../pages/ShopDetail.jsx'
import Settings from '../pages/Settings.jsx'

/**
 * The route tree. List paths come from lib/nav.js so the rail, search and the
 * router cannot disagree; detail paths hang off them. The literal `new`
 * segments are declared before `:id`, though react-router ranks static
 * segments first regardless.
 */
export function AppRoutes() {
  return (
    <Routes>
      <Route path={ROUTES.dashboard} element={<Dashboard />} />
      <Route path={ROUTES.reports} element={<Reports />} />

      <Route path={ROUTES.products} element={<Products />} />
      <Route path={ROUTES.newProduct} element={<ProductForm />} />
      <Route path={`${ROUTES.products}/:id`} element={<ProductDetail />} />
      <Route path={`${ROUTES.products}/:id/edit`} element={<ProductForm />} />

      <Route path={ROUTES.stockIn} element={<StockIn />} />
      <Route path={ROUTES.newStockIn} element={<NewStockIn />} />

      <Route path={ROUTES.transfers} element={<Transfers />} />
      <Route path={ROUTES.newTransfer} element={<NewTransfer />} />
      <Route path={`${ROUTES.transfers}/:id`} element={<TransferInvoice />} />

      <Route path={ROUTES.adjustments} element={<Adjustments />} />

      <Route path={ROUTES.sales} element={<Sales />} />
      <Route path={ROUTES.newSale} element={<NewSale />} />
      <Route path={`${ROUTES.sales}/:id`} element={<SaleInvoice />} />

      <Route path={ROUTES.shops} element={<Shops />} />
      <Route path={`${ROUTES.shops}/:id`} element={<ShopDetail />} />

      <Route path={ROUTES.settings} element={<Settings />} />

      {/* A typed URL — or a record id that doesn't exist — lands on the dashboard. */}
      <Route path="*" element={<Navigate to={ROUTES.dashboard} replace />} />
    </Routes>
  )
}
