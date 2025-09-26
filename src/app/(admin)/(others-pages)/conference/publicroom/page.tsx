import React from "react";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { PublicConferenceForm } from "@/components/conference/PublicConferenceForm";


export default function PublicConferencePage(){
  return (
    <div>
        <PageBreadcrumb pageTitle="PublicRoom" pathname={"/Conference/private room"} />
         <div>
            <PublicConferenceForm/>
        </div>
    </div>
  );
};
