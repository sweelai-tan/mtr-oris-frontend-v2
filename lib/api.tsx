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
  statusFilter: string | undefined;
  currentPage: number;
  itemsPerPage: number;
}

export const getEvents = async (params: GetEventsParams): Promise<any> => {
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

  const response = await axiosInstance.get(
    `/v1//events/${source}?${queryParams.toString()}`,
  );
  return response;
};

interface GetStatusCountParams {
  source: string;
  dateFrom: Date;
  dateTo: Date;
  carName?: string;
  directions?: string[];
  chainageFrom: number | undefined;
  chainageTo: number | undefined;
  defectGroup?: string;
  defectClasses: string[] | undefined;
}

export const getStatusCount = async (
  params: GetStatusCountParams,
): Promise<any> => {
  const {
    source,
    dateFrom,
    dateTo,
    carName,
    chainageFrom,
    chainageTo,
    defectGroup,
    defectClasses,
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

  const response = await axiosInstance.get(
    `/v1/events/${source}/status-aggregate?${queryParams.toString()}`,
  );
  return response;
};

export interface PatchEventData {
  status?: EventStatus;
  position?: EventPosition;
  chainage?: number;
  defects?: Defect[];
  remark?: string;
}
export const patchEvent = async (
  source: string,
  id: string,
  data: PatchEventData,
): Promise<any> => {
  const response = await axiosInstance.patch(
    `/v1/events/${source}/${id}`,
    data,
  );
  return response;
};

export const generateCsv = async (exportEvents: Event[]): Promise<any> => {
  const response = await axiosInstance.post('/v1/events/generateCsv', {
    events: exportEvents,
  });
  return response;
};

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

export const getEmails = async (source: string): Promise<any> => {
  const response = await axiosInstance.get(`/v1/alerts/${source}/emails`);
  return response;
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

export const updateEmail = async (
  source: string,
  email: Email,
): Promise<Email> => {
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

export const deleteEmail = async (source: string, id: string): Promise<any> => {
  const response = await axiosInstance.delete(`/v1/alerts/emails/${id}`);
  return response.data;
};
