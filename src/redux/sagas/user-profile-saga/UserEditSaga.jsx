import { call, put, takeEvery } from 'redux-saga/effects';
import axios from 'axios';
import {userEditRequest, userEditFailure, userEditSuccess } from '../../slices/user-profile-slice/UserEditSlice';
import { fetchUsersRequest } from "../../slices/user-profile-slice/UserGetSlice";

function* editAdminUser(action) {
  try {
    yield put(userEditRequest());
    const token = localStorage.getItem('token');
    const API_END_POINT = import.meta.env.VITE_API_ENDPOINT;

    console.log("action", action);
    const response = yield call(axios.put, `${API_END_POINT}/api/admin/update`, action?.payload, {
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