import constants from '../constants';
import {
  UserDetailsResponse,
  UserCoordinates,
  CoursesResponse,
  UserSettingsResponse,
  StudentGroupsResponse,
} from '../types';

const saveCoordinates = (
  coordinates : UserCoordinates,
) => (accessToken: string) => fetch(`${constants.DEFAULT_BACKEND_API_PATH}/v1/coordinates`, {
  method: 'PUT',
  headers: {
    Authorization: accessToken,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(coordinates),
});

const saveStudentsAttendanceFile = (
  jsonToSend : any,
) => (accessToken: string) => fetch(`${constants.DEFAULT_BACKEND_API_PATH}/attendance-register-file`, {
  method: 'POST',
  headers: {
    Authorization: accessToken,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(jsonToSend),
});

const saveAllUserSettings = (
  jsonToSend : any,
) => (accessToken: string) => (fetch(`${constants.DEFAULT_BACKEND_API_PATH}/user-settings`, {
  method: 'PUT',
  headers: {
    Authorization: accessToken,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(jsonToSend),
}));

const retrieveUserDetails = (
  accessToken: string,
): Promise<UserDetailsResponse> => extractData<UserDetailsResponse>(fetch(
  `${constants.DEFAULT_BACKEND_API_PATH}/user-details`, {
    headers: {
      Authorization: accessToken,
    },
  },
));

const fetchCourses = (
  accessToken: string,
): Promise<CoursesResponse> => extractData<CoursesResponse>(fetch(
  `${constants.DEFAULT_BACKEND_API_PATH}/courses`, {
    headers: {
      Authorization: accessToken,
    },
  },
));

const fetchSettings = (
  accessToken: string,
): Promise<UserSettingsResponse> => extractData<UserSettingsResponse>(fetch(
  `${constants.DEFAULT_BACKEND_API_PATH}/user-settings`, {
    headers: {
      Authorization: accessToken,
    },
  },
));

const fetchStudentGroups = (
  accessToken: string,
): Promise<StudentGroupsResponse> => extractData<StudentGroupsResponse>(
  fetch(
    `${constants.DEFAULT_BACKEND_API_PATH}/student-groups`, {
      headers: {
        Authorization: accessToken,
      },
    },
  ),
);

const fetchSpecialties = (
  accessToken: string,
): Promise<StudentGroupsResponse> => extractData<StudentGroupsResponse>(
  fetch(
    `${constants.DEFAULT_BACKEND_API_PATH}/specialties`, {
      headers: {
        Authorization: accessToken,
      },
    },
  ),
);

const fetchReport = (
  jsonToSend : any,
) => (
  accessToken: string,
): Promise<any> => {
  const urlParams = new URLSearchParams(jsonToSend);
  return extractData<any>(
    fetch(
      `${constants.DEFAULT_BACKEND_API_PATH}/student-attendances-report?${urlParams}`, {
        headers: {
          Authorization: accessToken,
          'Content-Type': 'application/json',
        },
      },
    ),
  );
};

const getStudentGroupById = (
  groupId : any,
) => (
  accessToken: string,
): Promise<any> => extractData<any>(
  fetch(
    `${constants.DEFAULT_BACKEND_API_PATH}/student-groups/${groupId}`, {
      headers: {
        Authorization: accessToken,
        'Content-Type': 'application/json',
      },
    },
  ),
);

const extractData = <T>(promise: Promise<Response>): Promise<T> => promise.then((response) => {
  if (!response.ok) {
    throw new Error(response.statusText);
  }
  return response.json() as Promise<T>;
});

export default {
  retrieveUserDetails,
  saveCoordinates,
  extractData,
  saveStudentsAttendanceFile,
  fetchCourses,
  fetchSettings,
  saveAllUserSettings,
  fetchStudentGroups,
  fetchReport,
  getStudentGroupById,
  fetchSpecialties,
};
