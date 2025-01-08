import { takeLatest, call, put } from "redux-saga/effects";
import axios from "axios";
import {
  deleteMemberRequest,
  deleteMemberSuccess,
  deleteMemberFailure,
} from "../../slices/member-slice/MemberDeleteSlice";
import { fetchMembersRequest } from "../../slices/member-slice/MemberGetSlice";

function deleteMemberApi(memberId, token) {

  const API_END_POINT = import.meta.env.VITE_API_ENDPOINT;

  return axios.delete(
    // `${API_END_POINT}/api/user/delete/${memberId}`,
    `${API_END_POINT}/user/delete/${memberId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
}

function* deleteMember(action) {
  try {
    const token = localStorage.getItem("token");
    yield call(deleteMemberApi, action.payload, token);
    yield put(deleteMemberSuccess());
    yield put(fetchMembersRequest());
  } catch (error) {
    yield put(deleteMemberFailure(error.message));
  }
}

export function* watchDeleteMember() {
  yield takeLatest(deleteMemberRequest.type, deleteMember);
}

export default watchDeleteMember;
