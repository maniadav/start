"use client";

import * as React from "react";
import Management from "@components/management/management";

export default function ObserverPage() {
  return <Management forRole="observer" accessedBy="organisation" />;
}
