import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import CustomerProvider from './customer.provider';
import { MainLayout } from './layout';
import {
  AddressEdit,
  AddressList,
  AddressNew,
  AddressView,
  Cart,
  CheckoutReview,
  CheckoutPayment,
  CheckoutShipping,
  Home,
  Product,
  ProductSearch,
  Signin,
  Signup,
  CheckoutSuccess,
  OrderView,
  OrderList,
  History,
  Bookmark,
} from './pages';

const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: 'product/search',
        element: <ProductSearch />,
      },
      {
        path: 'product/:id/:slug',
        element: <Product />,
      },
      {
        path: 'account/address/list',
        element: <AddressList />,
      },
      {
        path: 'account/address/new',
        element: <AddressNew />,
      },
      {
        path: 'account/address/:id/view',
        element: <AddressView />,
      },
      {
        path: 'account/address/:id/edit',
        element: <AddressEdit />,
      },
      {
        path: 'cart',
        element: <Cart />,
      },
      {
        path: 'checkout/shipping',
        element: <CheckoutShipping />,
      },
      {
        path: 'checkout/payment',
        element: <CheckoutPayment />,
      },
      {
        path: 'checkout/review',
        element: <CheckoutReview />,
      },
      {
        path: 'checkout/success/:id',
        element: <CheckoutSuccess />,
      },
      {
        path: 'order/list',
        element: <OrderList />,
      },
      {
        path: 'order/:id/view',
        element: <OrderView />,
      },
      {
        path: 'history/list',
        element: <History />,
      },
      {
        path: 'bookmark/list',
        element: <Bookmark />,
      },
    ],
  },
  {
    path: '/signin',
    element: <Signin />,
  },
  {
    path: '/signup',
    element: <Signup />,
  },
]);

const App = () => {
  return (
    <CustomerProvider>
      <RouterProvider router={router} />
    </CustomerProvider>
  );
};

export default App;
