import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import SignIn from "./components/signin-signup/SignIn";
import ForgotPassword from "./components/signin-signup/ForgotPassword";
import CreateNewPassword from "./components/signin-signup/CreateNewPassword";
import SignUp from "./components/signin-signup/SignUp";
import AdminDashboard from "./pages/dashboard/AdminDashboard";
import SalesPage from "./pages/home-page/SalesPage";
import ProductPage from "./pages/products/ProductPage";
import ViewMember from "./pages/member/ViewMember";
import AdminList from "./pages/admin-page/AdminList";
import SalesTarget from "./pages/sales-target/SalesTarget";
import AnnouncementTable from "./pages/announcement/AnnouncementTable";
import AddAnnouncementForm from "./pages/announcement/AddAnnouncementForm";
import EditAnnouncementForm from "./pages/announcement/EditAnnouncementForm";
import Documents from "./pages/documents/Documents";
import ClubTable from "./pages/club/ClubTable";
import CategoryTable from "./pages/category/CategoryTable";
import AddCategoryForm from "./pages/category/AddCategoryForm";
import EditCategoryForm from "./pages/category/EditCategoryForm";
import RoleTable from "./pages/role/RoleTable";
import AddRoleForm from "./pages/role/AddRoleForm";
import EditRoleForm from "./pages/role/EditRoleForm";
import MinimumStockTable from "./pages/minimumstock/MinimumStockTable";
import EditRequestTable from "./pages/requests/EditRequestTable";
import DeleteRequestTable from "./pages/requests/DeleteRequestTable";
import ReportTable from "./pages/reports/ReportTable";
import UserProfile from "./pages/dashboard/UserProfile";
import EditUserProfile from "./pages/dashboard/EditUserProfile";
import EditProductForm from "./pages/products/EditProductForm";
import AddProductForm from "./pages/products/AddProductForm";
import AddMemberForm from "./components/sales-components/member-ado/AddMemberForm";
import EditMemberForm from "./components/sales-components/member-ado/EditMemberForm";
import DocumentForm from "./pages/documents/DocumentForm ";
import EditDocumentForm from "./pages/documents/EditDocumentForm";
import AddUserForm from "./pages/admin-page/AddUserForm";
import EditUserForm from "./pages/admin-page/EditUserForm";
import AddSalesTargetForm from "./pages/sales-target/AddSalesTargetForm";

import AddMinimumStockForm from "./pages/minimumstock/AddMinimumStockForm";
// import AddClubForm from "./pages/club/AddClubForm";
import EditClubForm from "./pages/club/EditClubForm";
import PrivateRoute from "./PrivateRoute";
import EditSalesTargetForm from "./pages/sales-target/EditSalesTargetForm";
import EditMinimumStockForm from "./pages/minimumstock/EditMinimumStockForm";
import AddClubForm from "./pages/club/AddClubForm";
import OrderLimitTable from "./pages/club/OrderLimitTable";
import EditOrderLimit from "./pages/club/EditOrderLimit";

const RoutesConfig = () => {
  return (
    <div>
      <Router>
        <Routes>
          {/* Redirect to /signin if no route matches */}
          <Route path="/" element={<Navigate to="/signin" />} />

          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/create-password" element={<CreateNewPassword />} />

          {/* Protected dashboard routes */}
          <Route
            path="/dashboard/*"
            element={
              <PrivateRoute>
                <AdminDashboard />
              </PrivateRoute>
            }
          >
            <Route path="*" element={<SalesPage />} />
            <Route path="products" element={<ProductPage />} />
            <Route path="profile" element={<UserProfile />} />
            <Route path="edit-profile" element={<EditUserProfile />} />
            <Route path="members" element={<ViewMember />} />
            <Route path="announcement" element={<AnnouncementTable />} />
            <Route
              path="announcement/add-announcement"
              element={<AddAnnouncementForm />}
            />
            <Route
              path="announcement/edit-announcement"
              element={<EditAnnouncementForm />}
            />
            <Route path="documents" element={<Documents />} />
            <Route path="documents/add-document" element={<DocumentForm />} />
            <Route
              path="documents/edit-document"
              element={<EditDocumentForm />}
            />
            <Route path="orders_time_set" element={<OrderLimitTable />} />
            <Route path="report" element={<ReportTable />} />
            <Route path="members/add-members" element={<AddMemberForm />} />
            <Route path="members/edit-members" element={<EditMemberForm />} />
            <Route path="add-list" element={<AdminList />} />
            <Route path="add-list/add-user" element={<AddUserForm />} />
            <Route path="add-list/edit-user" element={<EditUserForm />} />
            <Route path="sales-target" element={<SalesTarget />} />
            <Route
              path="sales-target/add-sales-target"
              element={<AddSalesTargetForm />}
            />
            <Route
              path="sales-target/edit-sales-target"
              element={<EditSalesTargetForm />}
            />
            <Route path="category" element={<CategoryTable />} />
            <Route path="category/add-category" element={<AddCategoryForm />} />
            <Route path="category/edit-category" element={<EditCategoryForm />} />
            <Route path="club" element={<ClubTable />} />
            <Route path="club/add-club" element={<AddClubForm />} />
            <Route path="club/edit-club" element={<EditClubForm />} />
            <Route path="minimum-stock" element={<MinimumStockTable />} />
            <Route path="role" element={<RoleTable />} />
            <Route path="role/add-role" element={<AddRoleForm />} />
            <Route path="role/edit-role" element={<EditRoleForm />} />
            <Route
              path="minimum-stock/add-minimum-stock"
              element={<AddMinimumStockForm />}
            />
            <Route
              path="minimum-stock/edit-minimum-stock"
              element={<EditMinimumStockForm />}
            />
            <Route path="orders_time_set/edit-form" element={<EditOrderLimit />} />

            <Route path="edit-request" element={<EditRequestTable />} />
            <Route path="delete-request" element={<DeleteRequestTable />} />
            <Route path="products/edit-product" element={<EditProductForm />} />
            <Route path="products/add-product" element={<AddProductForm />} />
          </Route>
        </Routes>
      </Router>
    </div>
  );
};

export default RoutesConfig;
