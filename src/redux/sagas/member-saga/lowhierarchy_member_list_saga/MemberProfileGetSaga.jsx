import { call, put, takeEvery } from "redux-saga/effects";
import axios from "axios";
import { fetchMembersMemberFailure, fetchMembersMemberRequest, fetchMembersMemberSuccess } from "../../../slices/member-slice/lowhierarchy_member_list_slice/MemberProfileGetSlice";


/** Worker saga to fetch products**/
function* fetchMembersMember(action) {
  const { roleId } = action.payload;
  console.log("roleId", roleId);
  const user = JSON.parse(localStorage.getItem('user'));
  const role = user?.role;
  const id = user?.id;

// console.log("6666", role);
const API_URL = (() => {
  switch (role) {
    case "Admin":
      return `http://88.222.245.236:3002/api/user/role-user?role_id=${roleId}`;
    case "Area Development Officer":
      return `http://88.222.245.236:3002/directMembers/users-by-ado?adoId=${id}&roleId=${roleId}`;
    case "Master Distributor":
      return `http://88.222.245.236:3002/directMembers/users-by-md?mdId=${id}&roleId=${roleId}`;
    case "Super Distributor":
      return `http://88.222.245.236:3002/directMembers/users-by-sd?sdId=${id}&roleId=${roleId}`;
    case "Distributor":
      return `http://88.222.245.236:3002/members/cs?distributorId=${id}`;
    default:
      return null;
  }
})();
  // const API_URL = `http://88.222.245.236:3002/api/user/role-user?role_id=${roleId}`;
  console.log("API_URL", API_URL);
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
    yield put(fetchMembersMemberSuccess(response.data));
    // console.log("Fetched Products:", response.data);
  } catch (error) {
    /** Dispatch failure action with the error message **/
    yield put(fetchMembersMemberFailure(error.message));
  }
}

/** Watcher saga to trigger fetchProducts on fetchProductsRequest action **/
function* watchFetchMembersMember() {
  yield takeEvery(fetchMembersMemberRequest.type, fetchMembersMember);
}

export default watchFetchMembersMember;
