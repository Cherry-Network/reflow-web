"use client";
import PageLayout from "@/components/layout";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Form from "@/components/forms";


const AddDevice = () => {
  const router = useRouter();
  const [currentProject, setCurrentProject] = useState(null);

  useEffect(() => {
    const projectData = JSON.parse(sessionStorage.getItem("selectedProjectID"));
    setCurrentProject(projectData);
  }, []);

  const handleFormSuccess = () => {
    router.push("/");
  };

  

  return (
    <PageLayout pageName={"My Projects"} routeToDashboard={true}>
      <div className="">
        <div className="p-10">
          <div className="p-10 bg-theme_black/5 rounded-2xl">
            <Form
              projectID={currentProject?._id}
              onSuccess={handleFormSuccess}
            />
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default AddDevice;
