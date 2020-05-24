import fetch from 'cross-fetch'
import PropTypes from "prop-types";

export const REQUEST_TOPICS = 'REQUEST_TOPICS'
export const RECEIVE_TOPICS = 'RECEIVE_TOPICS'
export const INVALIDATE_SUBREDDIT = 'INVALIDATE_SUBREDDIT'
export const SELECT_SUBREDDIT = 'SELECT_SUBREDDIT'

export const GO_LIVE = 'GO_LIVE'
export const SUSPEND_TOPIC = 'SUSPEND_TOPIC'
export const DELETE_TOPIC = 'DELETE_TOPIC'
export const ADD_TOPIC = 'ADD_TOPIC'
export const DISPLAY_ERROR_MESSAGE = 'DISPLAY_ERROR_MESSAGE'

export const RECEIVE_USER = 'RECEIVE_USER'
export const REQUEST_USER = 'REQUEST_USER'


export function receiveUser (response) {
  console.log("HEY THERE")
  return {
    type: RECEIVE_USER,
    isLoggedIn: response.valid
  }
}






export function addTopic(topic) {
  return dispatch => {        
    return fetch(
          `http://localhost:8080/api/topics/create`, 
          {
            method: "post",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
          body: JSON.stringify(topic)
          })
      .then(
        this.props.history.push("/dashboard")
      //  response => window.location.reload()
      )
  }
}



export function displayErrorMessage(errorMessage) {
  return {
      type: DISPLAY_ERROR_MESSAGE,
      errorMessage
  }
};



export function deleteTopic(id) {
    return dispatch => {        
      return fetch(
            `http://localhost:8080/api/delete/${id}`, 
            {
            method: "delete",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                id: id
              })
            })
        .then(response => window.location.reload())
    }
  }

export function suspendTopic(id) {
    return dispatch => {        
      return fetch(
            `http://localhost:8080/api/suspend/${id}`, 
            {
            method: "put",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                id: id
              })
            })
        .then(response => window.location.reload())
    }
  }

export function goLiveWithTopic(id) {
    return dispatch => {        
      return fetch(
            `http://localhost:8080/api/activate/${id}`, 
            {
            method: "put",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                id: id
              })
            })
        .then(response => window.location.reload())
    }
  }
  


function requestTopics(subreddit) {
  return {
    type: REQUEST_TOPICS,
    subreddit
  }
}

function receiveTopics(subreddit, json) {
  return {
    type: RECEIVE_TOPICS,
    subreddit,
    topics: json,
    receivedAt: Date.now()
  }
}

export function fetchTopics(subreddit) {
  return dispatch => {
    dispatch(requestTopics(subreddit))
    return fetch(`http://localhost:8080/api/topics`)
      .then(response => response.json())
      .then(json => dispatch(receiveTopics(subreddit, json)))
  }
}

export function invalidateSubreddit(subreddit) {
  return {
    type: INVALIDATE_SUBREDDIT,
    subreddit
  }
}


export function selectSubreddit(subreddit) {
  return {
    type: SELECT_SUBREDDIT,
    subreddit
  }
}

export function shouldFetchTopics(state, subreddit) {
  const topics = state.topicsBySubreddit[subreddit]
  if (!topics) {
    return true
  } else if (topics.isFetching) {
    return false
  } else {
    return topics.didInvalidate
  }
}

export function fetchTopicsIfNeeded(subreddit) {
  // Note that the function also receives getState()
  // which lets you choose what to dispatch next.

  // This is useful for avoiding a network request if
  // a cached value is already available.

  return (dispatch, getState) => {
    if (shouldFetchTopics(getState(), subreddit)) {
      // Dispatch a thunk from thunk!
      return dispatch(fetchTopics(subreddit))
    } else {
      // Let the calling code know there's nothing to wait for.
      return Promise.resolve()
    }
  }



}