import React from "react";
import { Link } from "react-router"; // keep consistent with your project setup
import { UsersIcon, HomeIcon, MessageCircleIcon, BellIcon, GithubIcon, LinkedinIcon, Code2Icon } from "lucide-react";

function AboutDev() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-10">

      <div className="flex items-center gap-3 mb-6">
        <UsersIcon className="size-7 text-primary" />
        <h1 className="text-3xl font-bold">About The Developer</h1>
      </div>

      {/* Developer Info */}
      <div className="card bg-base-200 shadow-md mb-8">
        <div className="card-body">
          <h2 className="card-title flex items-center gap-2">
            <Code2Icon className="size-6 text-secondary" />
            Jayesh Rewani
          </h2>
          <p className="text-base-content text-lg">🚀 Full Stack Developer</p>
        </div>
      </div>


      <p className="text-base leading-relaxed text-base-content mb-6">
        Hi 👋 I am <span className="font-semibold">Jayesh Rewani</span>, the developer of 
        <span className="font-semibold"> Convoo</span>.  
        This app is built with <span className="text-primary">React, TailwindCSS, DaisyUI</span>, 
        and other modern web technologies.  
        I specialize in <span className="font-semibold">frontend + backend development</span>, 
        delivering scalable and user-friendly apps.
      </p>


      <div className="space-y-3 mb-10">
        <h2 className="text-xl font-semibold">Quick Links</h2>
        <div className="flex flex-col gap-2">
          <Link to="/" className="btn btn-outline btn-sm w-fit flex items-center gap-2">
            <HomeIcon className="size-4" /> Home
          </Link>

          <Link to="/notifications" className="btn btn-outline btn-sm w-fit flex items-center gap-2">
            <BellIcon className="size-4" /> Notifications
          </Link>

          <Link to="/chat" className="btn btn-outline btn-sm w-fit flex items-center gap-2">
            <MessageCircleIcon className="size-4" /> Chat
          </Link>
        </div>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-3">Connect with me:</h2>
        <div className="flex flex-col gap-2">
          <a href="https://github.com/JayeshRewani" target="_blank" rel="noreferrer"
            className="btn btn-outline btn-sm w-fit flex items-center gap-2">
            <GithubIcon className="size-4" /> GitHub
          </a>

          <a href="https://www.linkedin.com/in/jayesh-rewani-9b463632a/" target="_blank" rel="noreferrer"
            className="btn btn-outline btn-sm w-fit flex items-center gap-2">
            <LinkedinIcon className="size-4" /> LinkedIn
          </a>
        </div>
      </div>
    </div>
  );
}

export default AboutDev;
