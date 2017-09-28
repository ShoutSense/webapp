import NotFound from '../views/NotFound'
import Loading from '../views/Loading'
import Portal from '../views/Portal'
import Marketplace from '../views/Marketplace'
import Advertiser from '../views/Advertiser'
import Publisher from '../views/Publisher'
import Playground from '../views/Playground'
import Signup from '../views/Signup'
import Home from '../views/Home'

const routes = [
  { path: '/app',
    component: Portal,
    meta: {
      requiresAuth: true
    },
    children: [
      {
        path: 'publisher',
        component: Publisher
      },
      {
        path: 'advertiser',
        component: Advertiser
      },
      {
        path: '',
        component: Marketplace
      }
    ]
  },
  { path: '/signup', component: Signup },
  { path: '/playground', component: Playground },
  { path: '/loading', component: Loading },
  { path: '/', component: Home },
  { path: '*', component: NotFound }
]

export default routes
