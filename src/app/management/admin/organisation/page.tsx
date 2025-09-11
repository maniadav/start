"use client";

import * as React from "react";
import Management from "@components/management/management";

export default function OrganisationPage() {
  return <Management forRole="organisation" accessedBy="admin" />;
}
