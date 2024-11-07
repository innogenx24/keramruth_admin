////redux/sagas/memebr-saga/EditMemberSaga.jsx



import { call, put, takeEvery } from 'redux-saga/effects';
import axios from 'axios';
import { memberEditRequest, memberEditSuccess, memberEditFailure, } from '../../slices/member-slice/MemberEditSlices';
import { fetchMembersRequest } from "../../slices/member-slice/MemberGetSlice";

function* editMember(action) {
  try {
    yield put(memberEditRequest());
    const token = localStorage.getItem('token');
    const response = yield call(axios.put, `http://88.222.245.236:3002/api/user/update/${action?.payload?.id}`, action?.payload, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    yield put(memberEditSuccess(response.data));
    yield put(fetchMembersRequest());
  } catch (error) {
    yield put(memberEditFailure(error.message));
  }
}

export default function* memberEditSaga() {
  yield takeEvery('memberEdit/makeEditMember', editMember);
}