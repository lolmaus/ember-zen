import fetch from 'ember-network/fetch'



export function fetchGithub (url, params = {}) {
  const effectiveURL = `https://api.github.com/${url}`

  const headers = {
    ...(params.headers || {}),
    Accept : 'application/vnd.github.mercy-preview+json',
  }

  return fetch(effectiveURL, {
    ...params,
    headers,
  })
}



export function fetchGithubAuth (url, token, params = {}) {
  const headers = {
    ...(params.headers || {}),
    ...(token ? {Authorization : `token ${token}`} : {}),
  }

  const body =
    params.body
      ? JSON.stringify(params.body, null, 2)
      : params.body

  return fetchGithub(url, {
    ...params,
    headers,
    body,
  })
}



export function fetchGithubJson (...args) {
  return fetchGithub(...args).then(result => result.json())
}

export function fetchGithubAuthJson (...args) {
  return fetchGithubAuth(...args).then(result => result.json())
}

export function fetchGithubText (...args) {
  return fetchGithub(...args).then(result => result.text())
}

export function fetchGithubAuthText (...args) {
  return fetchGithubAuth(...args).then(result => result.text())
}
