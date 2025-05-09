import { createBrowserRouter } from 'react-router'

import Layout from './components/Layout/Layout'
import Index from './pages/Index'
import Notfound from './pages/Notfound'
import Matches from './pages/matches'
import ContentLayout from './components/ContentLayout/ContentLayout'
import LiveMatch from './pages/LiveMatch'

const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <Layout>
        <Index />
      </Layout>
    ),
  },
  {
    path: '*',
    element: (
      <Layout>
        <Notfound />
      </Layout>
    ),
  },
  {
    path: '/matches',
    element: (
      <ContentLayout>
        <Matches />
      </ContentLayout>
    ),
  },
  {
    path: '/live-match',
    element: (
      <ContentLayout>
        <LiveMatch />
      </ContentLayout>
    ),
  },
])

export default router
