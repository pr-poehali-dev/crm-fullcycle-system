import func2url from '../../backend/func2url.json';

const CLIENTS_URL = (func2url as Record<string, string>)['crm-clients'];
const DEALS_URL = (func2url as Record<string, string>)['crm-deals'];
const COMMS_URL = (func2url as Record<string, string>)['crm-communications'];

const MANAGER = 'Алексей Иванов';

async function req(url: string, method = 'GET', body?: unknown, params?: Record<string, string>) {
  const qs = params ? '?' + new URLSearchParams(params).toString() : '';
  const res = await fetch(url + qs, {
    method,
    headers: {
      'Content-Type': 'application/json',
      'X-Manager': MANAGER,
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  return res.json();
}

export const clientsApi = {
  list: (params?: Record<string, string>) => req(CLIENTS_URL, 'GET', undefined, params),
  create: (data: unknown) => req(CLIENTS_URL, 'POST', data),
  update: (id: number, data: unknown) => req(CLIENTS_URL, 'PATCH', data, { id: String(id) }),
};

export const dealsApi = {
  list: (params?: Record<string, string>) => req(DEALS_URL, 'GET', undefined, params),
  create: (data: unknown) => req(DEALS_URL, 'POST', data),
  update: (id: number, data: unknown) => req(DEALS_URL, 'PATCH', data, { id: String(id) }),
};

export const commsApi = {
  list: (params?: Record<string, string>) => req(COMMS_URL, 'GET', undefined, params),
  create: (data: unknown) => req(COMMS_URL, 'POST', data),
  audit: (params?: Record<string, string>) =>
    req(COMMS_URL, 'GET', undefined, { endpoint: 'audit', ...params }),
};