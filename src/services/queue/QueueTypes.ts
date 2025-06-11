export interface IQueueList {
  c_cron: any;
  cron: any;
  created_at: string;
  created_user_id: string | number;
  created_user_name: string;
  modified_at: string;
  modified_user_id: number;
  modified_user_name: string;
  purpose: number;
  purpose_name: string;
  queue_id: number;
  queue_number: string;
  status: number;
  status_name: string;
}

export interface IQueueFilterParams {
  queue_number?: number;
  status?: number;
  purpose?: number;
  start_date?: string;
  end_date?: string;
}

export interface IQueueConditions {
  queue_rule_action: number;
  rule: number;
  rule_name: string;
  rule_action: number;
  queue_number: string;
  pcc: string;
  status: number;
  status_name: string;
}

export interface QueueCondTnterface {
  // queue_rule_action: number;
  rule_action: number;
  queue_number: string;
  pcc: string;
  status: number;
}
export interface QueueDataInterface {
  airline: number;
  queue_number: string;
  pcc: string;
  cron_frequency: number;
  purpose: number;
  status: number;
  queue_conditions: QueueCondTnterface[];
}
export interface UpdateQueueRequestInterface {
  queue: QueueDataInterface;
  queue_id: string;
}

export interface IQueueData extends IQueueList {
  pcc?: string;
  cron_frequency_id?: number;
  cron_frequency?: string;
  queue_conditions?: IQueueConditions[];
}

export interface IQueueMasterIfo {
  cron_frequency?: any[];
}

// add queue error response
// type: response body
// method: -
// path: /queue
export interface queueErrorResponse {
  queue: { [K in keyof IQueueData]?: string[] };
}

// update queue request
// type: request body
// method: -
// path: /queue/{queue_id}
// note: same as 'add queue request'
export interface UpdateQueueRequest {
  queue: IQueueData;
  queue_id: string;
}

// Interface to get the data of recent action from masterInfo services
export interface RecentAction {
  serviceData: any;
  option: any;
}
