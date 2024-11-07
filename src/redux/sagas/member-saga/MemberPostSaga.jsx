import { call, put, takeEvery } from 'redux-saga/effects';
import axios from 'axios';
import { memberPostRequest, memberPostSuccess, memberPostFailure } from '../../slices/member-slice/MemberPostSlice';
import { fetchMembersRequest } from '../../slices/member-slice/MemberGetSlice';
function* postMember(action) {
  try {
    yield put(memberPostRequest());
    const token = localStorage.getItem('token');
    const { role_id } = action.payload;
  
    const response = yield call(axios.post, 'http://88.222.245.236:3002/api/user/signup', action.payload, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    yield put(memberPostSuccess(response.data));
    yield put(fetchMembersRequest({ roleId: role_id }));
  } catch (error) {
    yield put(memberPostFailure(error.message));
  }
}

export default function* memberPostSaga() {
    /* Ensure this matches the action name */
  yield takeEvery('memberPost/makePostMember', postMember);
}
