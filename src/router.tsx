import { createBrowserRouter } from 'react-router'

import Layout from './components/Layout/Layout'
import Index from './pages/Index'
import Notfound from './pages/Notfound'
import Matches from './pages/matches'
import ContentLayout from './components/ContentLayout/ContentLayout'

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
])

export default router
