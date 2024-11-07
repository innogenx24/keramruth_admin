import { call, put, takeEvery } from 'redux-saga/effects';
import axios from 'axios';
import { rolePostRequest, rolePostSuccess, rolePostFailure } from '../../../slices/master-slice/role-slice/RolePostSlice';
import { fetchRolesRequest } from '../../../slices/master-slice/role-slice/RoleGetSlice';
function* postRole(action) {
  try {
    yield put(rolePostRequest());
    const token = localStorage.getItem('token');
  
    const response = yield call(axios.post, 'http://88.222.245.236:3002/roles/create', action.payload, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    yield put(rolePostSuccess(response.data));
    yield put(fetchRolesRequest());
  } catch (error) {
    yield put(rolePostFailure(error.message));
  }
}

export default function* rolePostSaga() {
    /* Ensure this matches the action name */
  yield takeEvery('rolePost/makePostRole', postRole);
}