
import { configureStore } from '@reduxjs/toolkit';
import createSagaMiddleware from 'redux-saga';
import rootSaga from './sagas/rootSaga';
import authReducer from './slices/authSlice';
import productReducer from './slices/product-slice/ProductGetSlice';
import productPostReducer from './slices/product-slice/ProductPostSlice';
import memberPostReducer from './slices/member-slice/MemberPostSlice';
import memberReducer from './slices/member-slice/MemberGetSlice';
import allmemberReducer from './slices/member-slice/GetAllmemberSlices';
import ProductGetSingleSlice from './slices/product-slice/ProductGetSingleSlice';
import ProductDeleteSlice from './slices/product-slice/ProductDeleteSlice';
import MemberDeleteSlice from './slices/member-slice/MemberDeleteSlice';
import ClubGetSlice from "./slices/master-slice/club-slice/ClubGetSlice";
import clubDeleteSlice from "./slices/master-slice/club-slice/ClubDeleteSlice";
import CategoryGetSlice from "./slices/master-slice/categort-slice/CategortGetSlice";
import CategoryDeleteSlice from "./slices/master-slice/categort-slice/CategoryDeleteSlice";
import categoryEditSlice from "./slices/master-slice/categort-slice/CategoryEditSlice";
import RoleGetSlice from "./slices/master-slice/role-slice/RoleGetSlice";
import UserGetSlice from "./slices/user-profile-slice/UserGetSlice";
import userEditSlice from "./slices/user-profile-slice/UserEditSlice";
import rolePostSlice from "./slices/master-slice/role-slice/RolePostSlice";
import GetAllClubSlices from "./slices/club-slice/GetAllClubSlices"
const sagaMiddleware = createSagaMiddleware();

const store = configureStore({
  reducer: {
    auth: authReducer,
    products: productReducer,
    productPost: productPostReducer,
    productGetSingle:ProductGetSingleSlice,
    productDelete:ProductDeleteSlice,
    memberPost: memberPostReducer,
    members: memberReducer,
    allmembers: allmemberReducer,
    memberDelete: MemberDeleteSlice,
    clubs: ClubGetSlice,
    clubDelete: clubDeleteSlice,
    categorys: CategoryGetSlice,
    categoryDelete: CategoryDeleteSlice,
    categoryEdit: categoryEditSlice,
    roles: RoleGetSlice,
    users: UserGetSlice,
    userEdit: userEditSlice,
    rolePost: rolePostSlice,
    allclubs: GetAllClubSlices, 

  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(sagaMiddleware),
});

sagaMiddleware.run(rootSaga);

export default store;
