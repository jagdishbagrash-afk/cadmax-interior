import AuthLayout from './AuthLayout';
import React from 'react'
import SideBar from './sidebar';

export default function AdminLayout({ children, page }) {
  return (
    <AuthLayout sidebar={<SideBar />} page={page}>
      {children}
    </AuthLayout>
  );
}
