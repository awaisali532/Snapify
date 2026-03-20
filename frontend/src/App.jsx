import {
  BrowserRouter as Router,
  Routes,
  Route,
  UNSAFE_getTurboStreamSingleFetchDataStrategy,
} from "react-router-dom";
import PublicLayout from "./components/Public/PublicLayout";
import HomePage from "./pages/Public/HomePage";
import RegisterPage from "./pages/Public/Auth/RegisterPage";
import LoginPage from "./pages/Public/Auth/LoginPage";
import ProtectedRoute from "./components/ProtectedRoute";
import ProfilePage from "./pages/ProfilePage";
import AccountsPage from "./pages/Public/AccountsPage";
import { CurrencyProvider } from "./context/CurrencyContext";
import { AuthProvider } from "./context/AuthContext";
import AccountDetailsPage from "./pages/Public/AccountDetailsPage";

import AdminRoute from "./components/AdminRoute";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import AdminLayout from "./components/Admin/Layout/AdminLayout";
import AddAccountPage from "./pages/Admin/AddAccountPage";
import ManageAccountsPage from "./pages/Admin/ManageAccountsPage";
import { LoaderProvider } from "./context/LoaderContext";
import EditAccountPage from "./pages/Admin/EditAccountPage";
import CheckoutPage from "./pages/Public/CheckoutPage";
import ManageOrdersPage from "./pages/Admin/ManageOrdersPage";
import MyOrdersPage from "./pages/Public/MyOrdersPage";
import ManageReviewsPage from "./pages/Admin/ManageReviewsPage";
import ReviewsPage from "./pages/Public/ReviewPage";
import ScoreBoostingPage from "./pages/Public/ScoreBoostingPage";
import ManageScorePackages from "./pages/Admin/ManageScorePackages";
import BoostingCheckoutPage from "./pages/Public/BoostingCheckoutPage";
import ManagePaymentMethods from "./pages/Admin/ManagePaymentMethods";

function App() {
  return (
    <LoaderProvider>
      <AuthProvider>
        <CurrencyProvider>
          <Router>
            <Routes>
              <Route element={<PublicLayout />}>
                <Route path="/" element={<HomePage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/accounts" element={<AccountsPage />} />
                <Route path="/account/:id" element={<AccountDetailsPage />} />
                <Route path="/checkout/:id" element={<CheckoutPage />} />
                <Route path="/my-orders" element={<MyOrdersPage />} />
                <Route path="/reviews" element={<ReviewsPage />} />
                <Route path="/boosting" element={<ScoreBoostingPage />} />
                <Route
                  path="/boosting/checkout/:id"
                  element={<BoostingCheckoutPage />}
                />
                <Route
                  path="/profile"
                  element={
                    <ProtectedRoute>
                      <ProfilePage />
                    </ProtectedRoute>
                  }
                />
              </Route>
              {/* Admin Routes */}
              <Route
                path="/admin"
                element={
                  <AdminRoute>
                    <AdminLayout />
                  </AdminRoute>
                }
              >
                <Route index element={<AdminDashboard />} />
                <Route path="add-account" element={<AddAccountPage />} />
                <Route path="edit-account/:id" element={<EditAccountPage />} />
                <Route path="manage-orders" element={<ManageOrdersPage />} />
                <Route path="manage-reviews" element={<ManageReviewsPage />} />
                <Route
                  path="/admin/payment-methods"
                  element={<ManagePaymentMethods />}
                />

                <Route
                  path="manage-packages"
                  element={<ManageScorePackages />}
                />

                <Route
                  path="manage-accounts"
                  element={<ManageAccountsPage />}
                />
              </Route>
            </Routes>
          </Router>
        </CurrencyProvider>
      </AuthProvider>
    </LoaderProvider>
  );
}

export default App;
