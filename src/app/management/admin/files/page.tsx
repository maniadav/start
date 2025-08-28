"use client";
import Files from "@components/files";
import { ROLE } from "@constants/role.constant";

const AdminFilesPage = () => {
  return <Files role={ROLE.ADMIN} />;
};

export default AdminFilesPage;
