"use client";
import Files from "@components/files";
import { ROLE } from "@constants/role.constant";

const ObserverFilesPage = () => {
  return <Files role={ROLE.ORGANISATION} />;
};

export default ObserverFilesPage;
