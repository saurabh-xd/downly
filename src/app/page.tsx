"use client";

import { useEffect, useState } from "react";
import IdeaForm from "@/components/landing/Idea-form";
import IdeasList from "@/components/landing/ideas-list";
import Header from "@/components/landing/Header";

type IdeaStatus = "ALIVE" | "ON_HOLD" | "DEAD";

type Idea = {
  id: string;
  title: string;
  description?: string;
  status: IdeaStatus;
};





export default function HomePage() {




  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // 🔍 check login (simple check via ideas API)
  async function checkAuth() {
    try {
      const res = await fetch("/api/ideas");
      if (res.ok) {
        const data = await res.json();
        setIdeas(data);
        setIsLoggedIn(true);
      }
    } catch (e) {
      console.error(e)
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    checkAuth();
  }, []);



  async function handleCreateIdea(data: {
  title: string;
  description: string;
}) {
  if (isLoggedIn) {
    await fetch("/api/ideas", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    await checkAuth(); // refresh ideas
  } else {
    setIdeas((prev) => [
      {
        id: crypto.randomUUID(),
        title: data.title,
        description: data.description,
        status: "ALIVE",
      },
      ...prev,
    ]);
  }
}


  function updateGuestStatus(id: string, status: IdeaStatus) {
    setIdeas(
      ideas.map((idea) =>
        idea.id === id ? { ...idea, status } : idea
      )
    );
  }

  async function updateStatus(id: string, status: IdeaStatus) {
    if (!isLoggedIn) {
      updateGuestStatus(id, status);
      return;
    }

    await fetch(`/api/ideas/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });

    checkAuth();
  }

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    setIsLoggedIn(false);
    setIdeas([]);
    window.location.reload(); 
  }

  const getStatusBadgeVariant = (status: IdeaStatus) => {
    switch (status) {
      case "ALIVE": return "default"; // or specific color if customized
      case "ON_HOLD": return "secondary";
      case "DEAD": return "destructive";
      default: return "outline";
    }
  };

  return (
    <main className="min-h-screen bg-background p-6 md:py-12 font-sans selection:bg-primary selection:text-white">
      <div className="max-w-3xl mx-auto space-y-8">
     

<Header isLoading={isLoading} isLoggedIn={isLoggedIn} logout={logout}/>



        {/* Create idea */}
      

<IdeaForm onSubmitIdea={handleCreateIdea}/>


        {/* Idea list */}

<IdeasList ideas={ideas} updateStatus={updateStatus}  getStatusBadgeVariant={getStatusBadgeVariant} />



      </div>
    </main>
  );
}