import { takeLatest, call, put } from "redux-saga/effects";
import axios from "axios";
import {
    deleteClubRequest,
    deleteClubSuccess,
    deleteClubFailure,
} from "../../../slices/master-slice/club-slice/ClubDeleteSlice";
import { fetchClubsRequest } from "../../../slices/master-slice/club-slice/ClubGetSlice";

function deleteClubApi(clubId, token) {
//   console.log("clubId", clubId);
  return axios.delete(
    `http://88.222.245.236:3002/api/club/delete/${clubId}`,
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
