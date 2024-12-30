import { call, put, takeEvery } from "redux-saga/effects";
import axios from "axios";
import {
  fetchMembersRequest,
  fetchMembersSuccess,
  fetchMembersFailure,
} from "../../slices/member-slice/MemberGetSlice"; 


/** Worker saga to fetch products**/
function* fetchMembers(action) {
  const { roleId } = action.payload;
  console.log("roleId", roleId);
  const user = JSON.parse(localStorage.getItem('user'));
  const role = user?.role;
  const id = user?.id;
  const API_END_POINT = import.meta.env.VITE_API_ENDPOINT;

// console.log("6666", role);
const API_URL = (() => {
  switch (role) {
    case "Admin":
      return `${API_END_POINT}/api/user/role-user?role_id=${roleId}`;
    case "Area Development Officer":
      return `${API_END_POINT}/directMembers/users-by-ado?adoId=${id}&roleId=${roleId}`;
    case "Master Distributor":
      return `${API_END_POINT}/directMembers/users-by-md?mdId=${id}&roleId=${roleId}`;
    case "Super Distributor":
      return `${API_END_POINT}/directMembers/users-by-sd?sdId=${id}&roleId=${roleId}`;
    case "Distributor":
      return `${API_END_POINT}/members/cs?distributorId=${id}`;
    default:
      return null;
  }
})();

  try {
    /** Retrieve the token from localStorage **/
    const token = localStorage.getItem("token");
    if (!token) throw new Error("Token not found");

    /** Make API request with the token in the Authorization header**/
    const response = yield call(axios.get, API_URL, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    /** Dispatch success action with the fetched data **/
    yield put(fetchMembersSuccess(response.data));
    // console.log("Fetched Products:", response.data);
  } catch (error) {
    /** Dispatch failure action with the error message **/
    yield put(fetchMembersFailure(error.message));
  }
}

/** Watcher saga to trigger fetchProducts on fetchProductsRequest action **/
function* watchFetchMembers() {
  yield takeEvery(fetchMembersRequest.type, fetchMembers);
}

export default watchFetchMembers;
