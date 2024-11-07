// redux/sagas/rootSaga.js
import { all } from 'redux-saga/effects';
import authSaga from './auth-saga/authSaga';
import watchFetchProducts from './product-saga/ProductGetSaga';
import productPostSaga from './product-saga/ProductPostSaga';
import { watchFetchProductSingle } from './product-saga/ProductGetSingleSaga';
import { watchDeleteProduct } from './product-saga/ProductDeleteSaga';
import productEditSaga from './product-saga/ProductEditSaga';
import memberPostSaga from './member-saga/MemberPostSaga';
import watchFetchMembers from './member-saga/MemberGetSaga';
import watchFetchAllMembers from './member-saga/GetAllMemberSaga';
import watchDeleteMember from './member-saga/MemberDeleteSaga';
import memberEditSaga from './member-saga/MemberEditSaga';
import watchFetchClubs from './master-saga/club-saga/ClubGetSaga';
import watchDeleteClub from './master-saga/club-saga/ClubDeleteSaga';
import watchFetchCategorys from "./master-saga/category-saga/CategoryGetSaga";
import categoryPostSaga from "./master-saga/category-saga/CategoryPostSaga";
import categoryEditSaga from "./master-saga/category-saga/CategoryEditSaga";
import watchFetchRoles from "./master-saga/role-saga/RoleSaga";
import watchFetchUser from "./user-profile-saga/UserGetSaga";
import adminUserEditSaga from "./user-profile-saga/UserEditSaga";
import rolePostSaga from "./master-saga/role-saga/RolePostSaga";
import watchFetchAllClubs from './club-saga/GetAllClubSaga';

export default function* rootSaga() {
  yield all([
    authSaga(),
    watchFetchProducts(),
    productPostSaga(),
    watchFetchProductSingle(),
    watchDeleteProduct(),
    productEditSaga(),
    memberPostSaga(),
    watchFetchMembers(),
    watchFetchAllMembers(),
    watchDeleteMember(),
    memberEditSaga(),
    watchFetchClubs(),
    watchDeleteClub(),
    watchFetchCategorys(),
    categoryPostSaga(),
    categoryEditSaga(),
    watchFetchRoles(),
    watchFetchUser(),
    adminUserEditSaga(),
    rolePostSaga(),
    watchFetchAllClubs(),

  ]);
}
