
import React from "react";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { PrivateConferenceForm } from "@/components/conference/PrivateConferenceForm";


export default function PrivateConferencePage(){
  return (
    <div>
        <PageBreadcrumb pageTitle="PrivateRoom" pathname={"/conference/private room"} />
        <div>
            <PrivateConferenceForm/>
        </div>
    </div>
  );
};
