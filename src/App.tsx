/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Research from './pages/Research';
import Members from './pages/Members';
import Publications from './pages/Publications';
import Photos from './pages/Photos';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import { DataProvider } from './context/DataContext';

import ResearchDetail from './pages/ResearchDetail';

export default function App() {
  return (
    <DataProvider>
      <Router>
        <Routes>
          {/* Admin Routes - without global layout */}
          <Route path="/admin" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          
          {/* Public Routes - with global layout */}
          <Route
            path="*"
            element={
              <Layout>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/research" element={<Research />} />
                  <Route path="/research/:id" element={<ResearchDetail />} />
                  <Route path="/members" element={<Members />} />
                  <Route path="/publications" element={<Publications />} />
                  <Route path="/photos" element={<Photos />} />
                </Routes>
              </Layout>
            }
          />
        </Routes>
      </Router>
    </DataProvider>
  );
}

