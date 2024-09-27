"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import PageLayout from "@/components/layout";
import { AddProjectButton } from "@/components/add-project";
import { decode } from "next-auth/jwt";
import Cookies from "js-cookie";
import { useSearchParams } from "next/navigation";

const authSecret = process.env.NEXT_PUBLIC_AUTH_SECRET;

export default function Home() {
  const router = useRouter();
  const getToken = useSearchParams();
  const [ownProjects, setOwnProjects] = useState([]);
  const [sharedProjects, setSharedProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState("");
  const [fullName, setFullName] = useState("");

  useEffect(() => {
    const userToken = getToken.get("user");
    if (userToken) {
      Cookies.set("authSessionToken", userToken, { expires: 1 });
      const params = new URLSearchParams(getToken.toString());
      params.delete("user");
      router.replace(`?${params.toString()}`);
    }
    if (!Cookies.get("authSessionToken")) {
      router.push("https://reflowtech.in/login");
      return;
    }

    const decodeToken = async () => {
      try {
        const decoded = await decode({
          token: `${Cookies.get("authSessionToken")}`,
          salt: "__Secure-authjs.session-token",
          secret: authSecret,
        });

        if (decoded?.firstName && decoded?.lastName) {
          const name = `${decoded.firstName} ${decoded.lastName}`;
          setFullName(name);
          sessionStorage.setItem("fullName", name);

          sessionStorage.setItem("username", decoded.email);
          setUsername(decoded.email);
        }

        return decoded;
      } catch (error) {
        // console.error("Error decoding token:", error);
        alert("Failed to load. Try logging in again.");
        router.push("https://reflowtech.in/login");
      }
    };

    const checkOrCreateUser = async (decodedUser) => {
      try {
        const response = await fetch("/api/check-user", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ username: username, name: fullName }),
        });

        const data = await response.json();

        if (response.ok) {
          setUsername(data.user.username);
        } else {
          console.error("Error checking/creating user:", data.error);
        }
      } catch (error) {
        console.error("Error in user check/create request:", error);
      }
    };

    decodeToken().then((decoded) => {
      if (decoded) {
        checkOrCreateUser(decoded);
      }
    });
  }, [fullName, username]);

  useEffect(() => {
    if (!username) return;

    const fetchProjects = async () => {
      try {
        const response = await fetch("/api/projects", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            username: username,
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
  }, [username]);

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
