"use client";
import { ROLE } from "@constants/role.constant";
import Files from "@components/files";

const ObserverFilesPage = () => {
  return <Files role={ROLE.OBSERVER} />;
};

export default ObserverFilesPage;
