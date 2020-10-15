import { useState, useEffect, useCallback } from 'react'

const fetchApi = async (url, options = {}, callback = () => {}) => {
  let response = null
  let error = null
  try {
    const res = await fetch(url, {
      ...options,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      }
    })
    if (res.status >= 200 && res.status < 300) {
      if (res.status === 204) {
        response = true
      } else {
        response = await res.json()
      }
    } else {
      error = await res.json()
    }
  } catch (err) {
    error = err.message
  }

  callback instanceof Function && callback(response, error)
  return { response, error }
}

const useFetch = (path, { id, params, immediate = true } = {}, fetch_options = {}) => {
  const [state, setState] = useState({
    response: null,
    error: null,
    isLoading: false
  })

  useEffect(() => {
    if (immediate) {
      setState({
        ...state,
        isLoading: true
      })
      send()
    }
  }, [])

  const execute = (...args) => {
    setState({
      ...state,
      isLoading: true
    })
    return send(...args)
  }

  const updateState = (response, error) => {
    setState({
      isLoading: false,
      response: response,
      error: error
    })
  }

  const send = useCallback(
    (opts = {}) => {
      const url_params = { ...params, ...opts.params }
      const request_body = opts.body || fetch_options.body
      let finalPath = path
      finalPath = finalPath.replace(':id', opts.id || id)
      if (url_params) finalPath = `${finalPath}?${new URLSearchParams(url_params)}`
      const url = `http://localhost:4000/api/${finalPath}`
      return fetchApi(url, { ...fetch_options, body: request_body }, updateState)
    },
    [fetch_options, id, params, path]
  )

  return {
    response: state.response,
    error: state.error,
    isLoading: state.isLoading,
    send: execute
  }
}

export { useFetch }
