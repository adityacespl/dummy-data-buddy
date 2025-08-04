import React, { useState, useEffect } from "react";

import "./chatbox.css";
import { IoIosChatboxes, IoIosSend } from "react-icons/io";
import { SiCoinmarketcap } from "react-icons/si";
import { IoGameControllerOutline } from "react-icons/io5";
import { useAgentContext } from "../../context/AgentContext";
import ResponseDisplay from "../ResponseDisplay";
import ResponseDisplaySingle from "../ResponseDisplaySingle";
import TextareaAutosize from "react-textarea-autosize";
import { useParams } from "react-router-dom";

const ChatboxArea = () => {
  const { chatId } = useParams();
  const {
    prompt,
    setPrompt,
    processPrompt,
    loading,
    error,
    conversationHistory,
    lastSubmittedId,
    loadChatById,
  } = useAgentContext();

  useEffect(() => {
    if (chatId) {
      loadChatById(chatId);
    }
  }, [chatId, loadChatById]);

  const [presetUsed, setPresetUsed] = useState(false);

  useEffect(() => {
    const chatContainer = document.getElementById("chat-scroll");
    if (chatContainer) {
      chatContainer.scrollTop = chatContainer.scrollHeight;
    }
  }, [conversationHistory]);

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    processPrompt();
  };

  return (
    <div
      className="chatbox-area d-flex flex-column"
      style={{ minHeight: "calc(100vh - 60px)", marginTop: "0px" }}
    >
      <div className="d-flex flex-column justify-content-center align-items-center h-100">
        {conversationHistory.length > 0 && (
          <div
            className="flex-grow-1 overflow-auto px-3 style-scrollbar w-100 "
            id="chat-scroll"
            style={{ height: "80vh", overflowY: "auto", maxWidth: "800px" }}
          >
            {conversationHistory.map((item, index) => (
              <div
                key={item.id || index}
                className="chat-message-pair w-100 mb-1 mt-1"
                style={{ maxWidth: "800px" }}
              >
                <div className="d-flex justify-content-end mb-1 user">
                  <div
                    className="text-white py-2 px-3 user-message"
                    style={{ background: "#222" }}
                  >
                    {item.prompt}
                  </div>
                </div>
                <div className="d-flex justify-content-start mt-1 w-100 rounded">
                  <div className="ai-response bg-dark text-white p-3 w-100">
                    {item.status === "pending" ? (
                      <div className="chat-progress-status">
                        <span>{item.progressStep || "Processing..."}</span>
                      </div>
                    ) : !error ? (
                      <ResponseDisplaySingle
                        response={item.response}
                        agentId={item.agentId}
                        timestamp={item.timestamp}
                        typewriter={item.id === lastSubmittedId}
                        chatId={chatId} // <-- Pass chatId here!
                        messageId={item._id} // <-- Pass messageId here!
                        deploymentInfo={item.deployment}
                      />
                    ) : (
                      <>
                        {" "}
                        <div
                          className="alert alert-danger  mt-1  w-100"
                          style={{ maxWidth: "800px" }}
                        >
                          {error}
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {conversationHistory.length === 0 && (
          <>
            <div className="mb-4 text-center" style={{ maxWidth: "800px" }}>
              <h1 className="fw-bold mb-3">What do you want to build?</h1>
              <p className="text-white ">
                Welcome to Framework! I’m here to help you build blockchain
                applications. <br />
                What would you like to create today?
              </p>
            </div>
          </>
        )}
        <form
          onSubmit={(e) => e.preventDefault()}
          className="chat-form w-100"
          style={{ maxWidth: "800px" }}
        >
          <div className="chat-input-wrapper w-100 px-2 pb-5">
            <div className="chat-input-box w-100 mx-auto position-relative">
              <TextareaAutosize
                className="chat-textarea form-control pe-1"
                placeholder="Describe the blockchain app you want to build..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    if (prompt.trim() && !loading) {
                      handleSubmit();
                    }
                  }
                }}
                minRows={4}
                maxRows={6}
                disabled={loading}
              />
              <button
                type="button"
                className="send-button"
                onClick={handleSubmit}
                disabled={loading || !prompt.trim()}
              >
                {loading ? (
                  <span className="spinner-border spinner-border-sm" />
                ) : (
                  <IoIosSend size={22} />
                )}
              </button>
            </div>
          </div>
        </form>
        {conversationHistory.length === 0 && (
          <div className="chat-box-bottom pt-1">
            {!presetUsed && (
              <div className="chat-options d-flex flex-wrap gap-2 justify-content-center">
                <button
                  onClick={() => {
                    setPrompt("Create a smart contract of meme coin");
                    setPresetUsed(true);
                  }}
                >
                  <IoIosChatboxes /> Create a Memecoin
                </button>
                <button
                  onClick={() => {
                    setPrompt("Predict Market Trends");
                    setPresetUsed(true);
                  }}
                >
                  <SiCoinmarketcap /> Market Prediction
                </button>
                <button
                  onClick={() => {
                    setPrompt("Create a NFT Based Game");
                    setPresetUsed(true);
                  }}
                >
                  <IoGameControllerOutline /> NFT Game
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
export default ChatboxArea;
