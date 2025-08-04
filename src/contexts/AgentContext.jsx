import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import axios from "axios";
import {
  parseReactDAppFiles,
  getCodeBlockLanguages,
} from "../utils/parseClaudeResponse";

const AgentContext = createContext();
const API_URL = "/api";

export const AgentContextProvider = ({ children }) => {
  const [selectedAgent, setSelectedAgent] = useState("dev");
  const [prompt, setPrompt] = useState("");
  const [conversationHistory, setConversationHistory] = useState([]);
  const [chatHistories, setchatHistories] = useState([]);
  const [currentConversationId, setCurrentConversationId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastSubmittedId, setLastSubmittedId] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token") || "");

  // useEffect(() => {
  //   console.log("Selected agent changed:", selectedAgent);
  // }, [selectedAgent]);

  const [currentProject, setCurrentProject] = useState({
    rustContract: null,
    deploymentConfig: null,
    reactDAppFiles: [],
    installLog: "",
    buildStatus: "idle",
    previewUrl: null,
  });

  const [sharedContext, setSharedContext] = useState({
    history: [],
    metadata: {
      lastUpdated: new Date().toISOString(),
      version: 1,
    },
  });

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

  useEffect(() => {
    const fetchContext = async () => {
      try {
        const res = await axios.get(`${API_URL}/agents/context`);
        setSharedContext(res.data);
      } catch (err) {
        console.error("Context fetch error:", err);
      }
    };

    const fetchAllChats = async () => {
      try {
        const res = await axios.get(`${API_URL}/conversations/history`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setchatHistories(res.data);
      } catch (err) {
        console.error("Chat history fetch error:", err);
      }
    };

    if (token) {
      fetchContext();
      fetchAllChats();
    }
  }, [token]);

  // --- Utility for robust code block parsing ---
  const parseAIResponse = (markdown) => {
    if (!markdown || typeof markdown !== "string") {
      return { rustContract: null, deploymentConfig: null, reactDApp: null };
    }
    // Get all triple-backtick code blocks with optional language
    const codeBlocks = Array.from(
      markdown.matchAll(/```(\w+)?\n([\s\S]*?)```/g)
    );
    let rustContract = null,
      deploymentConfig = null,
      reactDApp = null;

    for (const [, lang = "", code] of codeBlocks) {
      const langLower = lang.toLowerCase();
      if (!rustContract && langLower === "rust") rustContract = code.trim();
      if (!deploymentConfig && langLower === "json") {
        try {
          deploymentConfig = JSON.parse(code.trim());
        } catch {
          deploymentConfig = code.trim();
        }
      }
      if (
        !reactDApp &&
        (langLower === "react" || langLower === "jsx" || langLower === "js")
      ) {
        reactDApp = code.trim();
      }
    }
    return { rustContract, deploymentConfig, reactDApp };
  };

  const loadChatById = useCallback(
    async (conversationId) => {
      try {
        console.log(
          "loadChatById called with chatId:",
          conversationId,
          "at",
          new Date().toISOString()
        );

        const res = await axios.get(
          `${API_URL}/conversations/${conversationId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setConversationHistory(res.data.messages);
        setCurrentConversationId(conversationId);
        setSelectedAgent(res.data.agentId);

        if (
          res.data.agentId === "dev" &&
          res.data.messages &&
          res.data.messages.length > 0
        ) {
          const agentMessage = [...res.data.messages]
            .reverse()
            .find((m) => m.response);

          if (agentMessage && agentMessage.response) {
            const { rustContract, deploymentConfig, reactDApp } =
              parseAIResponse(agentMessage.response);

            const reactDAppFiles = reactDApp
              ? parseReactDAppFiles(reactDApp)
              : [];

            setCurrentProject({
              rustContract,
              deploymentConfig,
              reactDAppFiles,
              installLog: "",
              buildStatus: "idle",
              previewUrl: null,
            });
          } else {
            setCurrentProject({
              rustContract: null,
              deploymentConfig: null,
              reactDAppFiles: [],
              installLog: "",
              buildStatus: "idle",
              previewUrl: null,
            });
          }
        } else {
          setCurrentProject({
            rustContract: null,
            deploymentConfig: null,
            reactDAppFiles: [],
            installLog: "",
            buildStatus: "idle",
            previewUrl: null,
          });
        }
      } catch (err) {
        console.error("Failed to load chat:", err);
        setError("Failed to load chat");
      }
    },
    [API_URL, token]
  ); // ✅ Add any dependencies used inside the callback

  const processPrompt = async () => {
    if (!prompt.trim()) {
      setError("Please enter a prompt");
      return;
    }

    const userPrompt = prompt.trim();
    const timestamp = new Date().toISOString();
    const tempId = Date.now();

    setLastSubmittedId(tempId);
    // Add temporary entry
    setConversationHistory((prev) => [
      ...prev,
      {
        id: tempId,
        prompt: userPrompt,
        response: null,
        agentId: selectedAgent,
        timestamp,
        status: "pending",
      },
    ]);

    setPrompt("");
    setLoading(true);
    setError(null);

    try {
      // Send to AI processor
      const res = await axios.post(`${API_URL}/agents/process`, {
        agentType: selectedAgent,
        prompt: userPrompt,
        options: {},
      });

      const aiResponse = res.data.result;

      if (selectedAgent === "dev") {
        const { rustContract, deploymentConfig, reactDApp } = parseAIResponse(
          aiResponse.content || aiResponse
        );
        if (rustContract || deploymentConfig || reactDApp) {
          const reactDAppFiles = reactDApp
            ? parseReactDAppFiles(reactDApp)
            : [];
          setCurrentProject({
            rustContract,
            deploymentConfig,
            reactDAppFiles,
            installLog: "",
            buildStatus: "idle",
            previewUrl: null,
          });
        }
      }

      // Update local history
      setConversationHistory((prev) =>
        prev.map((item) =>
          item.id === tempId
            ? {
                ...item,
                response: aiResponse.content || aiResponse,
                status: "completed",
              }
            : item
        )
      );

      // Save to DB: either update or create conversation
      let saved;
      if (currentConversationId) {
        saved = await axios.put(
          `${API_URL}/conversations/${currentConversationId}`,
          {
            prompt: userPrompt,
            response: aiResponse.content || aiResponse,
            agentId: selectedAgent,
          },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
      } else {
        saved = await axios.post(
          `${API_URL}/conversations/create`,
          {
            prompt: userPrompt,
            response: aiResponse.content || aiResponse,
            agentId: selectedAgent,
          },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setCurrentConversationId(saved.data._id); // save new ID
      }

      // Refresh all conversation previews (for sidebar)
      const all = await axios.get(`${API_URL}/conversations/history`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setchatHistories(all.data);
    } catch (err) {
      console.error("Prompt error:", err);
      setError(err.response?.data?.error || "Failed to process prompt");

      setConversationHistory((prev) =>
        prev.map((item) =>
          item.id === tempId
            ? {
                ...item,
                response: "Error generating response.",
                status: "failed",
              }
            : item
        )
      );
    } finally {
      setLoading(false);
    }
  };

  // const processPrompt = async () => {
  //   if (!prompt.trim()) {
  //     setError("Please enter a prompt");
  //     return;
  //   }

  //   const userPrompt = prompt.trim();
  //   const timestamp = new Date().toISOString();
  //   const tempId = Date.now();

  //   setLastSubmittedId(tempId);
  //   setConversationHistory((prev) => [
  //     ...prev,
  //     {
  //       id: tempId,
  //       prompt: userPrompt,
  //       response: null,
  //       agentId: selectedAgent,
  //       timestamp,
  //       status: "pending",
  //       progressStep: "Processing...",
  //     },
  //   ]);
  //   setPrompt("");
  //   setLoading(true);
  //   setError(null);

  //   // --- SSE with GET & query params ---
  //   const params = new URLSearchParams({
  //     agentType: selectedAgent,
  //     prompt: userPrompt,
  //     options: JSON.stringify({}) // add to this if needed
  //   });

  //   const eventSource = new window.EventSource(
  //     `${API_URL}/agents/process/stream?${params}`
  //   );

  //   eventSource.onmessage = (event) => {
  //     const data = JSON.parse(event.data);

  //     if (data.step) {
  //       setConversationHistory((prev) =>
  //         prev.map((item) =>
  //           item.id === tempId
  //             ? { ...item, progressStep: data.step }
  //             : item
  //         )
  //       );
  //     }
  //     if (data.done) {
  //       // DEV AGENT: Update currentProject if response includes contract, config, DApp, etc
  //       if (selectedAgent === "dev") {
  //         // You need these utilities in your context file:
  //         // parseAIResponse and parseReactDAppFiles
  //         const aiResponse = data.result.content || data.result;
  //         const { rustContract, deploymentConfig, reactDApp } = parseAIResponse(aiResponse);
  //         if (rustContract || deploymentConfig || reactDApp) {
  //           const reactDAppFiles = reactDApp
  //             ? parseReactDAppFiles(reactDApp)
  //             : [];
  //           setCurrentProject({
  //             rustContract,
  //             deploymentConfig,
  //             reactDAppFiles,
  //             installLog: "",
  //             buildStatus: "idle",
  //             previewUrl: null,
  //           });
  //         }
  //       }

  //       setConversationHistory((prev) =>
  //         prev.map((item) =>
  //           item.id === tempId
  //             ? {
  //                 ...item,
  //                 response: data.result.content || data.result,
  //                 status: "completed",
  //                 progressStep: null,
  //               }
  //             : item
  //         )
  //       );
  //       eventSource.close();
  //       setLoading(false);
  //     }
  //     if (data.error) {
  //       setError(data.error);
  //       setLoading(false);
  //       setConversationHistory((prev) =>
  //         prev.map((item) =>
  //           item.id === tempId
  //             ? {
  //                 ...item,
  //                 response: "Error generating response.",
  //                 status: "failed",
  //                 progressStep: null,
  //               }
  //             : item
  //         )
  //       );
  //       eventSource.close();
  //     }
  //   };

  //   eventSource.onerror = (err) => {
  //     setError("Error receiving progress from server");
  //     setLoading(false);
  //     eventSource.close();
  //   };
  // };

  const clearContext = async () => {
    setLoading(true);
    setError(null);

    try {
      await axios.delete(`${API_URL}/agents/context`);
      const updatedContext = await axios.get(`${API_URL}/agents/context`);
      setSharedContext(updatedContext.data);
      setConversationHistory([]);
      setCurrentConversationId(null);
      setCurrentProject({
        rustContract: null,
        deploymentConfig: null,
        reactDAppFiles: [],
        installLog: "",
        buildStatus: "idle",
        previewUrl: null,
      });
    } catch (err) {
      console.error("Clear error:", err);
      setError("Failed to clear context");
    } finally {
      setLoading(false);
    }
  };

  const createNewProject = () => {
    setConversationHistory([]);
    setCurrentConversationId(null);
  };

  const deleteChatById = async (id) => {
    try {
      await axios.delete(`${API_URL}/conversations/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const res = await axios.get(`${API_URL}/conversations/history`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setchatHistories(res.data);
      if (id === currentConversationId) {
        setConversationHistory([]);
        setCurrentConversationId(null);
        setCurrentProject({
          rustContract: null,
          deploymentConfig: null,
          reactDAppFiles: [],
          installLog: "",
          buildStatus: "idle",
          previewUrl: null,
        });
      }
    } catch (err) {
      console.error("Failed to delete chat:", err);
      setError("Failed to delete chat");
    }
  };

  return (
    <AgentContext.Provider
      value={{
        selectedAgent,
        setSelectedAgent,
        prompt,
        setPrompt,
        conversationHistory,
        setConversationHistory,
        chatHistories,
        processPrompt,
        loading,
        error,
        sharedContext,
        clearContext,
        loadChatById,
        createNewProject,
        deleteChatById,
        lastSubmittedId,
        currentProject,
        setCurrentProject,
      }}
    >
      {children}
    </AgentContext.Provider>
  );
};

export const useAgentContext = () => {
  const context = useContext(AgentContext);
  if (!context) {
    throw new Error(
      "useAgentContext must be used within an AgentContextProvider"
    );
  }
  return context;
};
