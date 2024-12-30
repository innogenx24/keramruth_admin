import { takeLatest, call, put } from "redux-saga/effects";
import axios from "axios";
import {
    deleteClubRequest,
    deleteClubSuccess,
    deleteClubFailure,
} from "../../../slices/master-slice/club-slice/ClubDeleteSlice";
import { fetchClubsRequest } from "../../../slices/master-slice/club-slice/ClubGetSlice";

function deleteClubApi(clubId, token) {

const API_END_POINT = import.meta.env.VITE_API_ENDPOINT;

  return axios.delete(
    `${API_END_POINT}/api/club/delete/${clubId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
}

function* deleteClub(action) {
  try {
    const token = localStorage.getItem("token");
    yield call(deleteClubApi, action.payload, token);
    yield put(deleteClubSuccess());
    yield put(fetchClubsRequest());
  } catch (error) {
    yield put(deleteClubFailure(error.message));
  }
}

export function* watchDeleteClub() {
  yield takeLatest(deleteClubRequest.type, deleteClub);
}

export default watchDeleteClub;
