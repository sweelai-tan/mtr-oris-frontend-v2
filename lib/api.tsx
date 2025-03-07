'use client';

import axios from 'axios';
import moment from 'moment-timezone';

import {
  Event,
  Defect,
  EventPosition,
  EventStatus,
  Email,
  LoginData,
  Threshold,
  Alert,
  Inference,
  EventSource,
  EventDirection,
  EventStatusAggregate,
  User,
  UserRole,
  UserStatus,
} from './types';

const axiosInstance = axios.create({
  // baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || 'https://20.205.128.43/v1',
  timeout: 5000,
  // You can add other configurations here
  // timeout: 1000,
  // headers: {'X-Custom-Header': 'foobar'}
});

interface LoginParams {
  email: string;
  password: string;
}

export const login = async (params: LoginParams): Promise<LoginData> => {
  const response = await axiosInstance.post('/v1/auth/login', params);
  return response.data.data;
};

interface GetEventsParams {
  source: string;
  dateFrom: Date;
  dateTo: Date;
  eventDirections: string[];
  chainageFrom: number | undefined;
  chainageTo: number | undefined;
  defectGroup: string | undefined;
  defectClasses: string[] | undefined;
  carName: string | undefined;
  remark: string | undefined;
  statusFilter?: string | undefined;
  currentPage?: number | undefined;
  itemsPerPage?: number | undefined;
  sort: string;
}

export const getEvents = async (params: GetEventsParams): Promise<Event[]> => {
  const {
    source,
    dateFrom,
    dateTo,
    eventDirections,
    chainageFrom,
    chainageTo,
    defectGroup,
    defectClasses,
    carName,
    remark,
    statusFilter,
    currentPage,
    itemsPerPage,
    sort,
  } = params;
  const timeZone = 'Asia/Hong_Kong';
  const fromDate = dateFrom
    ? moment(dateFrom).tz(timeZone).format('YYYY-MM-DD hh:mm:00ZZ')
    : null;
  const toDate = dateTo
    ? moment(dateTo).tz(timeZone).format('YYYY-MM-DD hh:mm:59ZZ')
    : null;

  const queryParams = new URLSearchParams();
  if (fromDate) queryParams.append('startDate', fromDate);
  if (toDate) queryParams.append('endDate', toDate);

  if (carName) queryParams.append('carName', carName);
  if (eventDirections.length > 0) {
    queryParams.append('directions', eventDirections.join(','));
  }
  if (chainageFrom && chainageTo) {
    queryParams.append('startChainage', chainageFrom.toString());
    queryParams.append('endChainage', chainageTo.toString());
  }
  if (remark) queryParams.append('remark', remark);
  if (statusFilter) queryParams.append('statuses', statusFilter);
  if (defectGroup) queryParams.append('groups', defectGroup);
  if (defectClasses && defectClasses.length > 0) {
    queryParams.append('classes', defectClasses.join(','));
  }
  if (currentPage) queryParams.append('pageNum', currentPage.toString());
  if (itemsPerPage) queryParams.append('pageSize', itemsPerPage.toString());

  if (sort) queryParams.append('sort', sort);

  const response = await axiosInstance.get(
    `/v1//events/${source}?${queryParams.toString()}`,
    { timeout: 60000 },
  );
  return response.data.data['events'];
};

interface GetStatusCountParams {
  source: string;
  dateFrom: Date;
  dateTo: Date;
  carName?: string | undefined;
  directions?: string[] | undefined;
  chainageFrom?: number | undefined;
  chainageTo?: number | undefined;
  defectGroup?: string | undefined;
  defectClasses?: string[] | undefined;
  remark?: string | undefined;
}

export const getStatusCount = async (
  params: GetStatusCountParams,
): Promise<EventStatusAggregate> => {
  const {
    source,
    dateFrom,
    dateTo,
    carName,
    chainageFrom,
    chainageTo,
    defectGroup,
    defectClasses,
    remark,
  } = params;

  const timeZone = 'Asia/Hong_Kong';
  const fromDate = dateFrom
    ? moment(dateFrom).tz(timeZone).format('YYYY-MM-DD hh:mm:00ZZ')
    : null;
  const toDate = dateTo
    ? moment(dateTo).tz(timeZone).format('YYYY-MM-DD hh:mm:59ZZ')
    : null;

  const queryParams = new URLSearchParams();
  if (fromDate) queryParams.append('startDate', fromDate);
  if (toDate) queryParams.append('endDate', toDate);
  if (carName && carName !== '') queryParams.append('carName', carName);
  if (params.directions && params.directions.length > 0) {
    queryParams.append('directions', params.directions.join(','));
  }
  if (chainageFrom && chainageTo) {
    queryParams.append('startChainage', chainageFrom.toString());
    queryParams.append('endChainage', chainageTo.toString());
  }
  if (defectGroup) queryParams.append('groups', defectGroup);
  if (defectClasses && defectClasses.length > 0) {
    queryParams.append('classes', defectClasses.join(','));
  }
  if (remark) queryParams.append('remark', remark);

  const response = await axiosInstance.get(
    `/v1/events/${source}/status-aggregate?${queryParams.toString()}`,
    { timeout: 60000 },
  );
  return response.data.data['statusAggregate'];
};

export interface PatchEventData {
  status?: EventStatus;
  direction?: EventDirection;
  position?: EventPosition;
  chainage?: number;
  defects?: Defect[];
  remark?: string;
}
export const patchEvent = async (
  source: string,
  id: string,
  data: PatchEventData,
): Promise<Event> => {
  const response = await axiosInstance.patch(
    `/v1/events/${source}/${id}`,
    data,
  );
  return response.data.data['event'];
};

export interface CreateEventData {
  chainage: number;
  defects: Defect[];
  direction: EventDirection;
  eventAt: string;
  parentId?: string | undefined;
  image: string;
  originalHeight: number;
  originalWidth: number;
  position: EventPosition;
  source: EventSource;
  sysDefects: Defect[];
  sysMetadata?: string | undefined;
  carName: string;
}

export const createEvent = async (
  source: string,
  data: PatchEventData,
): Promise<Event> => {
  const response = await axiosInstance.post(`/v1/events/${source}`, data);
  return response.data.data['event'];
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const generateCsv = async (exportEvents: Event[]): Promise<any> => {
  const response = await axiosInstance.post('/v1/events/generateCsv', {
    events: exportEvents,
  });
  return response;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const generatePdf = async (exportEvents: Event[]): Promise<any> => {
  const response = await axiosInstance.post(
    '/v1/events/generatePdf',
    {
      events: exportEvents,
    },
    {
      responseType: 'blob',
    },
  );
  return response;
};

export const getThresholds = async (source: string): Promise<Threshold[]> => {
  const response = await axiosInstance.get(`/v1/thresholds/${source}`);
  return response.data.data['thresholds'];
};

export const updateThreshold = async (
  source: string,
  threshold: Threshold,
): Promise<Threshold> => {
  const response = await axiosInstance.patch(
    `/v1/thresholds/${source}/${threshold.id}`,
    threshold.setting,
  );
  return response.data.data['threshold'];
};

interface GetAlertsParams {
  dateFrom: Date;
  dateTo: Date;
  source: string;
}

export const getAlerts = async (params: GetAlertsParams): Promise<Alert[]> => {
  const { dateFrom, dateTo, source } = params;

  const timeZone = 'Asia/Hong_Kong';
  const fromDate = dateFrom
    ? moment(dateFrom).tz(timeZone).format('YYYY-MM-DD hh:mm:00ZZ')
    : null;
  const toDate = dateTo
    ? moment(dateTo).tz(timeZone).format('YYYY-MM-DD hh:mm:59ZZ')
    : null;

  const queryParams = new URLSearchParams();
  if (fromDate) queryParams.append('startDate', fromDate);
  if (toDate) queryParams.append('endDate', toDate);

  const response = await axiosInstance.get(
    `/v1/alerts/${source}?${queryParams.toString()}`,
  );
  return response.data.data['alerts'];
};

export const getEmails = async (source: string): Promise<Email[]> => {
  const response = await axiosInstance.get(`/v1/alerts/${source}/emails`);
  return response.data.data['emails'];
};

export const addEmail = async (
  source: string,
  email: Email,
): Promise<Email> => {
  const response = await axiosInstance.post(
    `/v1/alerts/${source}/emails`,
    email,
  );
  return response.data.data['email'];
};

export const updateEmail = async (email: Email): Promise<Email> => {
  const updateData = {
    name: email.name,
    settings: email.settings,
  };
  const response = await axiosInstance.patch(
    `/v1/alerts/emails/${email.id}`,
    updateData,
  );
  return response.data.data['email'];
};

export const deleteEmail = async (id: string): Promise<Email> => {
  const response = await axiosInstance.delete(`/v1/alerts/emails/${id}`);
  return response.data.data['email'];
};

export const getPresignedUploadUri = async (
  source: EventSource,
  filename: string,
): Promise<string> => {
  const queryParams = new URLSearchParams();
  queryParams.append('filename', filename);
  queryParams.append('source', source);
  const response = await axiosInstance.get(
    `/v1/s3/presignedUploadUri?${queryParams.toString()}`,
  );
  return response.data.data['uri'];
};

interface CreateInferenceData {
  eventAt: string;
  comment: string;
}

export const createInference = async (
  source: EventSource,
  data: CreateInferenceData,
): Promise<Inference> => {
  const response = await axiosInstance.post(`/v1/inference/${source}`, data);
  return response.data.data['inference'];
};

interface UpdateInferenceData {
  videoFilename: string;
}

export const updateInference = async (
  source: EventSource,
  inferenceId: string,
  data: UpdateInferenceData,
): Promise<Inference> => {
  const response = await axiosInstance.patch(
    `/v1/inference/${source}/${inferenceId}`,
    data,
  );
  return response.data.data['inference'];
};

export const getInferences = async (
  source: EventSource,
): Promise<Inference[]> => {
  const response = await axiosInstance.get(`/v1/inference/${source}`);
  return response.data.data['inferences'];
};

export const deleteInference = async (source: EventSource, id: string) => {
  const response = await axiosInstance.delete(`/v1/inference/${source}/${id}`);
  return response.data.data['inference'];
};

export const getUsers = async (): Promise<User[]> => {
  const response = await axiosInstance.get('/v1/users');
  return response.data.data['users'];
};

export const getUser = async (id: string): Promise<User> => {
  const response = await axiosInstance.get(`/v1/users/${id}`);
  return response.data.data['user'];
};

interface CreateUserData {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  status: UserStatus;
}

export const createUser = async (data: CreateUserData): Promise<User> => {
  const response = await axiosInstance.post('/v1/auth/register', data);
  return response.data.data['user'];
};

interface UpdateUserData {
  name: string;
  role: UserRole;
  status: UserStatus;
  password?: string | undefined;
}

export const updateUser = async (
  data: UpdateUserData,
  id: string,
): Promise<User> => {
  const response = await axiosInstance.patch(`/v1/users/${id}`, data);
  return response.data.data['user'];
};
