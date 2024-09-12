"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import PageLayout from "@/components/layout";
import { AddProjectButton } from "@/components/add-project";
import { decode } from "next-auth/jwt";

export default function Home() {
  const router = useRouter();
  const [ownProjects, setOwnProjects] = useState([]);
  const [sharedProjects, setSharedProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState("");

  useEffect(() => {
    const decoded = decode({
      token: "eyJhbGciOiJkaXIiLCJlbmMiOiJBMjU2Q0JDLUhTNTEyIiwia2lkIjoiNnpOQ2xIYTFDVkZwX21SRWdSZDJlUXEyMlgtYW9sUW1QOVViVC1reWpwd2FxZUJYY25pSWZBTXBOanlyR1pEMjFZbVJtOVg3c3B4M005eUlMWHJpUFEifQ..NXM8Z4-oM0v0A8ZBnhrIeQ.3KRty9WhUxS9ma2sNDdYPvyD06UiGNxjy9NYbmwqdZAMOF9TyegS4KTNKW06HvxEnn25MH7NWdYwx7hZ2FHaefEe7-tvTBB1OIcBpLnhXymOrwBYQ34PipUrNtPcGt0DT-ipDPhsVAVegPnDA6OBvHTjIQ5C_R25ikSHRd50HLnsCigXGSaPUEaYMhACRZZdn-ClO3L5q0oV_etfU-ZscUMvNvt50Tc5h28nxbk43bzl3DMZk2Hm4m3UxP29c6sdywOpno03s1xDIe2Pvd4lRVVBBh3za9_6e1BommZlqsSNjMRV7aJQFTQQTN2fVkmE.uEOKu3oYk1zF1YKoKUYh8DLCxYsZ-Kq8_ya1a-7zVFM",
      secret: "0MI/SmxJyhIk2GPSoE5h3es2h7rxTudrQpmOLilwd9w=",
    });
    console.log(decoded);
  }, []);

  useEffect(() => {
    const storedUsername = sessionStorage.getItem("username");
    if (!storedUsername) {
      router.push("/username");
      return;
    }
    setUsername(storedUsername);



    const fetchProjects = async () => {
      try {
        const response = await fetch("/api/projects", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            username: storedUsername,
          },
        });

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setOwnProjects(data.ownProjects || []);
        setSharedProjects(data.sharedProjects || []);
      } catch (error) {
        console.error("Error fetching projects:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [router]);

  return (
    <PageLayout pageName={"My Projects"}>
      <div className="p-10 flex flex-wrap gap-4 justify-start items-stretch">
        {loading ? (
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500"></div>
          </div>
        ) : (
          <>
            <div className="w-full">
              <h2 className="text-xl font-bold text-theme_black mb-4">
                Your Projects
              </h2>
              <div className="flex flex-wrap gap-4">
                {ownProjects.map((project) => (
                  <button
                    key={project._id}
                    className="flex flex-col gap-1 py-6 h-[250px] justify-center items-center bg_project_card rounded-2xl w-[400px]"
                    onClick={() => {
                      sessionStorage.setItem(
                        "selectedProjectID",
                        JSON.stringify(project)
                      );
                      router.push("/viewproject");
                    }}
                  >
                    <span className="text-2xl text-theme_white font-bold">
                      {project.name}
                    </span>
                    <span className="text-sm font-medium tracking-wide text-gray-300">
                      ID: {project._id}
                    </span>
                  </button>
                ))}
                <AddProjectButton
                  addProjectFunction={() => router.push("/addproject")}
                />
              </div>
            </div>

            <div className="w-full mt-8">
              <h2 className="text-xl font-bold text-theme_black mb-4">
                Shared Projects
              </h2>
              <div className="flex flex-wrap gap-4">
                {sharedProjects.length > 0 ? (
                  sharedProjects.map((project) => (
                    <button
                      key={project._id}
                      className="flex flex-col gap-1 py-6 h-[250px] justify-center items-center bg_project_card rounded-2xl w-[400px]"
                      onClick={() => {
                        sessionStorage.setItem(
                          "selectedProjectID",
                          JSON.stringify(project)
                        );
                        router.push("/viewproject");
                      }}
                    >
                      <span className="text-2xl text-theme_white font-bold">
                        {project.name}
                      </span>
                      <span className="text-sm font-medium tracking-wide text-gray-300">
                        ID: {project._id}
                      </span>
                      <span className="text-sm font-medium tracking-wide text-gray-300">
                        Owner: {project.owner}
                      </span>
                    </button>
                  ))
                ) : (
                  <div className="flex flex-col gap-1 py-6 h-[250px] justify-center items-center bg-gray-200 rounded-2xl w-[400px]">
                    <span className="text-xl text-gray-500 font-semibold">
                      No shared projects available
                    </span>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </PageLayout>
  );
}
