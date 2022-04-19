const defaultFetchOptions: any = (params: any) => {
  const {token} = params;
  let headers: any = {
    'Content-Type': 'application/json',
  };
  let excludeTokenParams: any;
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
    // 解构赋值，因为params是usePostdata hook的引用，直接忽略掉token会导致整个hook状态丢失token
    // 所以引用新的对象
    excludeTokenParams = {...params};
    excludeTokenParams.token = '';
  } else {
    excludeTokenParams = {...params};
  }

  return {
    method: 'POST',
    mode: 'cors',
    cache: 'no-cache',
    credentials: 'same-origin',
    headers,
    redirect: 'follow',
    referrerPolicy: 'no-referrer',
    body: JSON.stringify(excludeTokenParams),
  };
};

export async function postData(url: string = '', params: object = {}, options?: any) {
  let response;
  if (options) {
    response = await fetch(url, options(params));
  } else {
    response = await fetch(url, defaultFetchOptions(params));
  }
  return response;
}
