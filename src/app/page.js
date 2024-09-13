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

  {/*
    useEffect(() => {
      const decodeToken = async () => {
        try {
          const decoded = await decode({
            token:
              "eyJhbGciOiJkaXIiLCJlbmMiOiJBMjU2Q0JDLUhTNTEyIiwia2lkIjoiMmtiOVRkOG5FWS1pX2hKNldRbVF1ZkV6V0VXRzF1Szh1cnVnQlpZMmhPcWZLTEJoRlNHR1VURk5RNDVRZHRXR0p5WXpiMHV1YWMxMGkzWDB6U0Vic0EifQ..ZfJoSCssC2qjLIkWNlvzmA.lI-z99yWd94XPN1e9iAYB1C6fxwP7KWq-QU55i9A7daDfgO5qOAmBGwIgEDD4BJXhvZugrFid69LNUfmBUp76nTYuf7mFN2RMsTpw8qZI2bu90u6n19SigTeu58CQmmIJW4LB0UBVtwxoYGkl-5g_QQ4QFYsexl03vdFnCJsc8JmYL7zpqRGOkCHaKVOPvdcPqoqplc7g-vE97FEjaH0v1jPb0s6Fvh-LwhV9hUVARWRk43lJyxJhz-izatwbANEioXmX7rDqHJGTvEaJeqzN_3QjNBzSc6ry3OGUUj-Gz_ExneqR46cSGVd4SnTY7rQTc7q0bLsAx2j-6WqhHDEjA.NqGaRnKzXfaHjjcQktTjAKGMDa5oM2Q9qDyjI7EVwVo",
            salt: "__Secure-authjs.session-token",
            secret: "0MI/SmxJyhIk2GPSoE5h3es2h7rxTudrQpmOLilwd9w=",
          });
          console.log(decoded);
        } catch (error) {
          console.error("Error decoding token:", error);
        }
      };

      decodeToken();
    }, []);
  */}

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
