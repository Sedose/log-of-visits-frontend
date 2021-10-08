export interface Credentials {
  email: string,
  password: string,
}

export type UserRole = 'STUDENT' | 'LECTURER' | 'TRAINING_REPRESENTATIVE';

export interface LoginResponse {
  accessToken: string,
  role: UserRole,
  userEmail: string,
}

export interface UserDetailsResponse {
  userRole: string
}

export interface UserCoordinates {
  latitude: number,
  longitude: number,
}

export type CoursesResponse = {
    id: string,
    name: string,
}[]

export interface UserSettingsResponse {
  userSettings: {
    code: string,
    description: string,
    value: string,
    defaultValue: string,
  }[],
}

export interface StudentGroupsResponse {
  studentGroups: {
    id: string,
    name: string,
  }[],
}
