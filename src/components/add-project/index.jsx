const AddProjectButton = ({ addProjectFunction }) => {
  return (
    <button
      className="flex flex-col gap-2 items-center justify-center p-6 bg-theme_black text-white font-bold rounded-2xl shadow-md hover:bg-gray-950 w-[300px] h-[187px]"
      onClick={addProjectFunction}
    >
      <svg
        className="w-8 h-auto"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M12 5v14m-7-7h14" />
      </svg>
      <span className="text-lg tracking-wide">Add Project</span>
    </button>
  );
};

const ProjectButton = ({ project_id, project_name }) => {
  return (
    <button className="flex flex-col items-center justify-center p-6 bg-gray-500 text-white font-bold rounded-lg shadow-md hover:bg-gray-600 w-full max-w-sm">
      <span className="text-xl mt-20">{project_name}</span>
      <small className="text-xs text-gray-300 mb-20">ID: {project_id}</small>
    </button>
  );
};

const AddProjectButtons = ({ projects }) => {
  return (
    <div className="relative min-h-screen p-4 flex flex-col items-center">
      {/* Background SVG */}
      {/* <img
        className="absolute bottom-0 right-0 w-1/4 h-1/4 object-contain opacity-50"
        src="/assets/add-project-ui-icon.svg" // Correct path
        alt="Background"
      /> */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-4xl">
        {projects.map((project) => (
          <div
            key={project.project_id}
            className="flex items-center justify-center"
          >
            <ProjectButton
              project_id={project.project_id}
              project_name={project.project_name}
            />
          </div>
        ))}
        <div className="flex items-center justify-center mt-4">
          <AddProjectButton />
        </div>
      </div>
    </div>
  );
};

export { AddProjectButton, AddProjectButtons };
