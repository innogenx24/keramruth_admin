import { call, put, takeEvery } from 'redux-saga/effects';
import axios from 'axios';
import {userEditRequest, userEditFailure, userEditSuccess } from '../../slices/user-profile-slice/UserEditSlice';
import { fetchUsersRequest } from "../../slices/user-profile-slice/UserGetSlice";

function* editAdminUser(action) {
  try {
    yield put(userEditRequest());
    const token = localStorage.getItem('token');
    console.log("action", action);
    const response = yield call(axios.put, `http://88.222.245.236:3002/api/admin/update`, action?.payload, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    yield put(userEditSuccess(response.data));
    yield put(fetchUsersRequest());
  } catch (error) {
    yield put(userEditFailure(error.message));
  }
}

export default function* adminUserEditSaga() {
  yield takeEvery('userEdit/makeEditUser', editAdminUser);
}