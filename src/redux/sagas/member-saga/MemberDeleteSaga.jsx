import { takeLatest, call, put } from "redux-saga/effects";
import axios from "axios";
import {
  deleteMemberRequest,
  deleteMemberSuccess,
  deleteMemberFailure,
} from "../../slices/member-slice/MemberDeleteSlice";
import { fetchMembersRequest } from "../../slices/member-slice/MemberGetSlice";

function deleteMemberApi(memberId, token) {
  // console.log("memberId", memberId);
  return axios.delete(
    `http://88.222.245.236:3002/api/user/delete/${memberId}`,
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
