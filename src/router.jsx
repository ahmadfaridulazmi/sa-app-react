import React from 'react'
import { HashRouter as Router, Route, Switch } from 'react-router-dom'
import OrderList from './pages/orders/list'
import NewOrder from "./pages/orders/new";

const Routes = () => {
  return (
    <Router>
      <Switch>
        <Route exact path='/'>
          <OrderList />
        </Route>
        <Route exact path='/orders/new'>
          <NewOrder />
        </Route>
      </Switch>
    </Router>
  )
}
export default Routes
