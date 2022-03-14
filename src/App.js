import {
  Router,
  Switch,
  Route,
  Redirect
} from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import HomePage from './pages/HomePage';
import ProductDetailPage from './pages/ProductDetailPage';
import CategoryPage from './pages/CategoryPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import ProductTable from '../src/features/Admin/ProductTable';
import CategoryTable from '../src/features/Admin/CategoryTable';
import FavoriteProducts from '../src/features/User/FavoriteProducts';
import UserProfile from './features/User/UserProfile';
import AutionProductsHisory from './features/User/AutionProductsHisory';
import AutionProducts from './features/User/AutionProducts';
import ReviewProduct from './features/User/ReviewProducts';
import PostProduct from './features/User/PostProduct';
import AdminPage from './pages/AdminPage';
import OtpPage from './pages/OtpPage';
import NotFoundPage from './pages/NotFoundPage';
import SearchResultPage from './pages/SearchResultPage';
import WaitUpgrade from '../src/features/Admin/WaitUpgrade';
import BidderTable from './features/Admin/BidderTable';
import SellerTable from './features/Admin/SellerTable';
import { createBrowserHistory } from 'history';
import UserDashboard from './features/User/UserDashboard';
import { store } from './app/store';
import { Provider } from 'react-redux';
import UpdateProfile from './features/User/UpdateProfile';
import UpadtePostProduct from './features/User/UpdatePostProduct';
import OtpResetPasswordPage from './pages/OtpResetPasswordPage';
import InputEmailPage from './pages/InputEmailPage';
import InputNewPasswordPage from './pages/InputNewPasswordPage';
import ViewInfoReviewPage from './pages/ViewInfoReviewPage';
import WonProducts from './features/User/WonProducts';
import SoldProducts from './features/User/SoldProducts';

// common --------------------------------------------------------------------------------->
import eventBus from './common/EvenBus';
import AuthVerify from './common/AuthVerify';
import { useEffect, useCallback, useState } from 'react';
import logout from '../src/actions/auth';
import jwt_decode from 'jwt-decode';

function App() {
  const history = createBrowserHistory();
  
  const logOut = () => {
    logout();
  };

  

  //effect -------------------------------------------------------------------------------------->
  useEffect(() => {
    if (localStorage.x_accessToken) {
      const user = jwt_decode(localStorage.x_accessToken);
      if (user) {
          if (new Date(user.exp) * 1000 <  Date.now()) {
              localStorage.removeItem("x_accessToken");
              localStorage.removeItem("x_refreshToken");
              
          }
      }
  }
    eventBus.on("logout", () => {
      logOut();
    });


    return () => {
      eventBus.remove("logout");
    };
  }, []);

  return (
    <Router history={history}>
      <Provider store={store}>
        <Switch>
          <Route path="/" exact>
            <HomePage />
          </Route>
          <Route path="/login" exact>
            <LoginPage />
          </Route>
          <Route path="/signup" exact>
            <SignupPage />
          </Route>
          <Route path="/signup/otp" exact>
            <OtpPage />
          </Route>
          <Route path="/otp-reset-password/:email" exact>
            <OtpResetPasswordPage />
          </Route>
          <Route path="/input-new-password/:accountid" exact>
            <InputNewPasswordPage />
          </Route>
          <Route path="/input-email" exact>
            <InputEmailPage />
          </Route>
          <Route path="/reviews/:accountid" exact>
            <ViewInfoReviewPage />
          </Route>
          <Route path="/product/search" exact component={SearchResultPage}>
          </Route>
          <Route path="/product/detail" exact component={ProductDetailPage}>
          </Route>
          <Route path="/category/:id" exact  component={CategoryPage}>
          </Route>
          <PrivateRoute path="/user/dashboard" exact>
            <UserDashboard />
          </PrivateRoute>
          <PrivateRoute path="/user/favorite" exact>
            <FavoriteProducts />
          </PrivateRoute>
          <PrivateRoute path="/user/aution-history" exact>
            <AutionProductsHisory />
          </PrivateRoute>
          <PrivateRoute path="/user/profile" exact>
            <UserProfile />
          </PrivateRoute>
          <PrivateRoute path="/user/aution" exact>
            <AutionProducts />
          </PrivateRoute>
          <PrivateRoute path="/user/review" exact>
            <ReviewProduct />
          </PrivateRoute>
          <PrivateRoute path="/user/post" exact>
            <PostProduct />
          </PrivateRoute>
          <PrivateRoute path="/user/win-products" exact>
            <WonProducts/>
          </PrivateRoute>
          <PrivateRoute path="/user/sold-products" exact>
            <SoldProducts/>
          </PrivateRoute>
          <PrivateRoute path="/user/update-profile" exact>
            <UpdateProfile />
          </PrivateRoute>
          <PrivateRoute path="/user/update-post-product" exact>
            <UpadtePostProduct />
          </PrivateRoute>
          <PrivateRoute path="/admin" exact>
            <AdminPage />
          </PrivateRoute>
          <PrivateRoute path="/admin/product" exact>
            <ProductTable />
          </PrivateRoute>
          <PrivateRoute path="/admin/category" exact>
            <CategoryTable />
          </PrivateRoute>
          <PrivateRoute path="/admin/seller" exact>
            <SellerTable />
          </PrivateRoute>
          <PrivateRoute path="/admin/bidder" exact>
            <BidderTable />
          </PrivateRoute>
          <PrivateRoute path="/admin/upgrade" exact>
            <WaitUpgrade />
          </PrivateRoute>
          <Route path="*" component={NotFoundPage}>
            {/* <CategoryPage/> */}
          </Route>
        </Switch>
        <AuthVerify logOut={logout} />
      </Provider>

    </Router>

  );
}


function PrivateRoute({ children, ...rest }) {
  return (
    <Route {...rest} render={function () {
      return localStorage.x_accessToken ?
        children :
        <Redirect to={{ pathname: '/login' }} />;
    }} />
  );
}



export default App;
