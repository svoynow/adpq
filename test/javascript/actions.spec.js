import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import * as actions from 'actions'
import * as ActionTypes from 'constants/ActionTypes'
import * as RemoteDataStates from 'constants/RemoteDataStates'
import * as reactRouter from 'react-router';
import fetchMock from 'fetch-mock'

const middlewares = [ thunk ]
const mockStore = configureMockStore(middlewares)

describe('Auth Actions', () => {
  beforeEach(function() {
    global.sessionStorage = jest.genMockFunction();
    global.sessionStorage.setItem = jest.genMockFunction();
    global.sessionStorage.getItem = jest.genMockFunction().mockReturnValue(JSON.stringify({id: 1}));
    reactRouter.browserHistory = {
      push: jest.genMockFunction()
    };
  })

  afterEach(fetchMock.restore)

  it('loginRequest creates a LOGIN_REQUEST action', () => {
    expect(actions.loginRequest().type).toEqual(ActionTypes.LOGIN_REQUEST)
  })

  describe('loginUser', () => {
    it('does nothing if auth request is already in-flight', () => {
      const store = mockStore({auth: {remoteDataState: RemoteDataStates.LOADING}})
      store.dispatch(actions.loginUser())
      expect(store.getActions()).toEqual([])
    })

    it('does nothing if auth data is already present', () => {
      const store = mockStore({auth: {remoteDataState: RemoteDataStates.LOADED}})
      store.dispatch(actions.loginUser())
      expect(store.getActions()).toEqual([])
    })

    it('dispatches a login request and handles the response data', (done) => {
      const store = mockStore({auth: {remoteDataState: RemoteDataStates.NOT_REQUESTED}})
      const mockResponse = {id: 0, name: 'Joe', role: 'ADMIN'}
      const expectedActions = [
        { type: ActionTypes.LOGIN_REQUEST },
        { type: ActionTypes.LOGIN_SUCCESS, auth: mockResponse }
      ]
      fetchMock.mock('/api/auth', mockResponse, {method: "POST"})

      store.dispatch(actions.loginUser()).then(() => {
        expect(fetchMock.called('/api/auth')).toBe(true)
        expect(store.getActions()).toEqual(expectedActions)
        done();
      })
    })

    it('dispatches a login request and handles any error', (done) => {
      const store = mockStore({auth: {remoteDataState: RemoteDataStates.NOT_REQUESTED}})
      const expectedActions = [
        { type: ActionTypes.LOGIN_REQUEST },
        { type: ActionTypes.LOGIN_ERROR, error: 'something' }
      ]
      fetchMock.mock('/api/auth', 409, {method: "POST"})

      store.dispatch(actions.loginUser()).then(() => {
        expect(fetchMock.called('/api/auth')).toBe(true)
        expect(store.getActions()[0]).toEqual(expectedActions[0])
        expect(store.getActions()[1].type).toEqual(expectedActions[1].type)
        done();
      })
    })
  })

  describe('fetchCart', () => {
    let store;
    let mockResponse
    beforeEach(() => {
      store = mockStore({})
      mockResponse = [{id: 0, name: 'Computer'}]
      fetchMock.mock('/api/user/1/cart_items', mockResponse, {method: "GET"})
    })

    it('dispatches requestCart', (done) => {
      const expectedActions = [
        { type: ActionTypes.REQUEST_CART }
      ]

      store.dispatch(actions.fetchCart()).then(() => {
        expect(store.getActions()[0]).toEqual(expectedActions[0])
        done();
      })
    })

    it('fetches cart items', (done) => {
      store.dispatch(actions.fetchCart()).then(() => {
        expect(fetchMock.called('/api/user/1/cart_items')).toBe(true)
        done();
      })
    })

    it('dispatches success', (done) => {
      const expectedActions = [
        { type: ActionTypes.REQUEST_CART },
        { type: ActionTypes.FETCH_CART_SUCCESS, data: mockResponse }
      ]

      fetchMock.mock('/api/user/1/cart_items', mockResponse, {method: "GET"})

      store.dispatch(actions.fetchCart()).then(() => {
        expect(store.getActions()).toEqual(expectedActions)
        done();
      })
    })

    it('dispatches failure', (done) => {
      const expectedActions = [
        { type: ActionTypes.REQUEST_CART },
        { type: ActionTypes.FETCH_CART_ERROR, error: 409 }
      ]

      fetchMock.mock('/api/user/1/cart_items', 409, {method: "GET"})

      store.dispatch(actions.fetchCart()).then(() => {
        expect(store.getActions()[0].type).toEqual(expectedActions[0].type)
        done();
      })
    })
  })

  describe('addToCart', () => {
    let store, id, quantity, mockResponse

    beforeEach(() => {
      id = 1
      quantity = 2
      store = mockStore({})
      fetchMock.mock('/api/user/1/cart_items', {}, {method: "GET"})
      mockResponse = {id: 0, name: 'Computer'}
      fetchMock.mock('/api/user/1/cart_items', mockResponse, {method: "POST"})
    })

    it('dispatches requestAddToCart', (done) => {
      const expectedActions = [
        { type: ActionTypes.ADD_TO_CART, id, quantity }
      ]

      store.dispatch(actions.addToCart(id, quantity)).then(() => {
        expect(store.getActions()[0]).toEqual(expectedActions[0])
        done();
      })
    })

    it('dispatches success', (done) => {
      const expectedActions = [
        { type: ActionTypes.ADD_TO_CART, id, quantity },
        { type: ActionTypes.ADD_TO_CART_SUCCESS, data: mockResponse }
      ]
      
      store.dispatch(actions.addToCart(id, quantity)).then(() => {
        expect(store.getActions()[1]).toEqual(expectedActions[1])
        done();
      })
    })

    it('dispatches fetchCart', (done) => {
      const expectedActions = [
        { type: ActionTypes.ADD_TO_CART, id, quantity },
        { type: ActionTypes.ADD_TO_CART_SUCCESS, data: mockResponse },
        { type: ActionTypes.REQUEST_CART }
      ]
      
      store.dispatch(actions.addToCart(id, quantity)).then(() => {
        expect(store.getActions()[2]).toEqual(expectedActions[2])
        done();
      })
    })

  })

})