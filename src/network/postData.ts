const defaultFetchOptions: any = params => {
  const {token} = params;
  let headers:any = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  return {
    method: 'POST',
    mode: 'cors',
    cache: 'no-cache',
    credentials: 'same-origin',
    headers,
    redirect: 'follow',
    referrerPolicy: 'no-referrer',
    body: JSON.stringify(params),
  };
};

export async function postData(
  url: string = '',
  params: object = {},
  options?: any,
) {
  let response;
  if (options) {
    response = await fetch(url, options(params));
  } else {
    response = await fetch(url, defaultFetchOptions(params));
  }
  return response;
}
