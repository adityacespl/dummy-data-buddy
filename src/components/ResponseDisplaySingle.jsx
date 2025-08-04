import React, { useEffect, useState, useRef } from "react";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import { extractCodeAndConfig } from "../utils/parseClaudeResponse";
import { saveDeploymentToBackend } from "../utils/saveDeploymentToBackend"; // adjust the path as needed

const API_ROOT = "http://194.164.148.105:12001/api/deploy";

// Extract txhash from CLI output (plain text with "txhash: ...")
function extractTxhash(cliOutput) {
  const match = cliOutput.match(/txhash:\s*([A-F0-9]{64})/i);
  return match ? match[1] : null;
}

// Extract code_id from CLI output
function extractCodeId(cliOutput) {
  const codeIdMatch = cliOutput.match(/key: code_id[\s\S]*?value: "?(\d+)"?/);
  return codeIdMatch ? codeIdMatch[1] : null;
}

function renderDeploymentResult(data) {
  if (!data) return null;
  // If output is YAML-like string, just print it pretty
  return (
    <pre
      style={{
        fontSize: "1em",
        lineHeight: "1.5",
        wordBreak: "break-word",
        background: "#23272e",
        borderRadius: "6px",
        padding: "1em",
      }}
    >
      {data}
    </pre>
  );
}

const GENERATION_STEPS = [
  "Generating smart contract code...",
  "Parsing and validating initial token configuration...",
  "Setting up contract storage and message types...",
  "Implementing contract logic (instantiate, transfer, mint)...",
  "Building and running contract unit tests...",
  "Preparing deployment config...",
  "Creating frontend application and wallet UI...",
  "Integrating contract with frontend (CosmJS)...",
  "Finalizing project files and setup..."
];

function extractDeploymentInfoFromLog(logLine) {
  let txhash, codeId, contractAddress, contractName;
  try {
    const json = JSON.parse(logLine);

    // txhash
    if (json.txhash) txhash = json.txhash;

    // code_id and contract_address
    if (json.logs && Array.isArray(json.logs)) {
      json.logs.forEach(log => {
        log.events.forEach(event => {
          if (event.type === "instantiate" || event.type === "store_code") {
            event.attributes.forEach(attr => {
              if (attr.key === "_contract_address" || attr.key === "contract_address") contractAddress = attr.value;
              if (attr.key === "code_id") codeId = attr.value;
            });
          }
          if (event.type === "wasm") {
            event.attributes.forEach(attr => {
              if (attr.key === "token_name" || attr.key === "contract_name") contractName = attr.value;
            });
          }
        });
      });
    }
  } catch {}
  return { txhash, codeId, contractAddress, contractName };
}
function extractDeploymentArtifacts(logs) {
  let codeId, txhash, contractAddress, contractName, tokenSymbol, tokenSupply;

  logs.forEach(line => {
    // Detect JSON log lines
    let json;
    try {
      json = JSON.parse(line);
    } catch {
      return; // skip non-JSON lines
    }

    // 1. Extract codeId and txhash from store log
    if (json.txhash && json.logs && Array.isArray(json.logs)) {
      txhash = json.txhash;
      json.logs.forEach(log => {
        log.events.forEach(event => {
          if (event.type === "store_code") {
            event.attributes.forEach(attr => {
              if (attr.key === "code_id") codeId = attr.value;
            });
          }
        });
      });
    }

    // 2. Extract contractAddress and more from instantiate log
    if (json.txhash && json.logs && Array.isArray(json.logs)) {
      json.logs.forEach(log => {
        log.events.forEach(event => {
          // Contract address
          if (event.type === "instantiate") {
            event.attributes.forEach(attr => {
              if (
                attr.key === "_contract_address" ||
                attr.key === "contract_address"
              ) {
                contractAddress = attr.value;
              }
              if (attr.key === "code_id") {
                codeId = attr.value;
              }
            });
          }
          // Token info
          if (event.type === "wasm") {
            event.attributes.forEach(attr => {
              if (attr.key === "token_name" || attr.key === "contract_name") {
                contractName = attr.value;
              }
              if (attr.key === "token_symbol") {
                tokenSymbol = attr.value;
              }
              if (attr.key === "token_supply") {
                tokenSupply = attr.value;
              }
            });
          }
        });
      });
    }
  });

  return {
    codeId,
    txhash,
    contractAddress,
    contractName,
    tokenSymbol,
    tokenSupply
  };
}
const DEPLOYMENT_STEPS = [
  { key: "rustup install", label: "Install Rust Toolchain" },
  { key: "rustup override set", label: "Set Rust Toolchain Version" },
  { key: "cargo generate-lockfile", label: "Generate Cargo Lockfile" },
  { key: "docker run", label: "Build Contract with Docker" },
  { key: "/root/go/bin/seid tx wasm store", label: "Deploy Contract to SEI" },
];

const ResponseDisplaySingle = ({
  response,
  agentId,
  timestamp,
  typewriter,
  chatId,
  messageId,
  deploymentInfo,
}) => {
  const [isDeployed, setIsDeployed] = useState(false);
  useEffect(() => {
    if (deploymentInfo && deploymentInfo.status === "success") {
      setIsDeployed(true);
      lastDeployedResponse.current = response;
    } else {
      setIsDeployed(false);
    }
  }, [deploymentInfo, response]);
// console.log(deploymentInfo);
  const lastDeployedResponse = useRef(response);
  const [isEdited, setIsEdited] = useState(false);

const [deploymentInfo2, setDeploymentInfo] = useState(deploymentInfo || null);


  const [generationStepIndex, setGenerationStepIndex] = useState(0);
const [showGenerationSteps, setShowGenerationSteps] = useState(typewriter);

  const [displayedText, setDisplayedText] = useState(
    typewriter ? "" : response
  );
  const [logs, setLogs] = useState([]);
  const [deploying, setDeploying] = useState(false);
  const [error, setError] = useState("");
  const eventSourceRef = useRef(null);
  const logsEndRef = useRef(null);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const deploymentDone = useRef(false);
  const { code, config } = extractCodeAndConfig(response); 
  // Typewriter effect
  useEffect(() => {
    if (!typewriter) return;

    let index = 0;
    const speed = 1;
    const interval = setInterval(() => {
      setDisplayedText((prev) => prev + response.charAt(index));
      index++;
      if (index >= response.length) clearInterval(interval);
    }, speed);

    return () => clearInterval(interval);
  }, [response, typewriter]);

  // Clean up EventSource on unmount
  useEffect(() => {
    return () => {
      if (eventSourceRef.current) eventSourceRef.current.close();
    };
  }, []);

  // Auto-scroll logs
  useEffect(() => {
    if (logsEndRef.current) {
      logsEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [logs]);
  // const deployCode = async () => {
  //   if (!code || !config) {
  //     setError("Missing code or config in response.");
  //     return;
  //   }
  //   setDeploying(true);
  //   setLogs([]);
  //   setError(""); 

  //   try {
  //     // Step 1: POST to /start to get deploymentId
  //     const resp = await fetch(`${API_ROOT}/start`, {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify({ code, config }),
  //     });
  //     if (!resp.ok) {
  //       const result = await resp.json();
  //       setError(result.error || "Failed to start deployment.");
  //       setDeploying(false);
  //       return;
  //     }
  //     const { deploymentId } = await resp.json();
  //     if (!deploymentId) {
  //       setError("No deploymentId returned from server.");
  //       setDeploying(false);
  //       return;
  //     }

  //     // Step 2: Open SSE EventSource to stream logs
  //     eventSourceRef.current = new window.EventSource(
  //       `${API_ROOT}/stream/${deploymentId}`
  //     );

  //     eventSourceRef.current.addEventListener("log", (e) => {
  //       setLogs((prev) => [...prev, e.data]);
  //     });

  //     eventSourceRef.current.addEventListener("done", async (e) => {
  //       let data,
  //         txhash = null,
  //         codeId = null,
  //         output = "",
  //         status = "success",
  //         errorMsg = "";
  //       try {
  //         data = JSON.parse(e.data);
  //         output = data.output || "";
  //       } catch {
  //         output = e.data;
  //       }
  //       setDeploymentInfo({ ...data, output });
  //       setDeploying(false);
  //       setIsDeployed(true);
  //       setIsEdited(false);
  //       lastDeployedResponse.current = response;
  //       eventSourceRef.current.close();

  //       // Extract txhash and codeId from output
  //       txhash = extractTxhash(output);
  //       codeId = extractCodeId(output);

  //       // Prepare deployment info for backend
  //       const deployment = {
  //         txhash,
  //         codeId,
  //         logs, // use the logs state variable
  //         output,
  //         status,
  //         error: errorMsg,
  //       };

  //       // ------ SAVE TO BACKEND ------
  //       try {
  //         await saveDeploymentToBackend({
  //           chatId, // Get this from context/props
  //           messageId, // Get this from context/props or last message in chat
  //           deployment,
  //           // token,    // Include if you use JWT
  //         });

  //         // Optionally, show a toast or update UI
  //       } catch (err) {
  //         // You can show a toast, but don't block the UI
  //         console.error("Saving deployment info failed:", err);
  //       }
  //     });

  //     eventSourceRef.current.addEventListener("error", (e) => {
  //       setLogs((prev) => [...prev, `Error: ${e.data || "Unknown error"}`]);
  //       setError(e.data || "Error during deployment.");
  //       setDeploying(false);
  //       eventSourceRef.current.close();

  //       // ------ SAVE ERROR TO BACKEND ------
  //       const deployment = {
  //         txhash: null,
  //         codeId: null,
  //         logs,
  //         output: "",
  //         status: "error",
  //         error: e.data || "Error during deployment.",
  //       };
  //       saveDeploymentToBackend({
  //         chatId,
  //         messageId,
  //         deployment,
  //         // token,
  //       }).catch((err) => {
  //         console.error("Saving deployment error info failed:", err);
  //       });
  //     });

  //     eventSourceRef.current.onopen = () => {
  //       setLogs((prev) => [...prev, "Connected to deployment log stream..."]);
  //     };
  //     eventSourceRef.current.onerror = (e) => {
  //       setError("Connection to log stream failed.");
  //       setDeploying(false);
  //       if (eventSourceRef.current) eventSourceRef.current.close();
  //     };
  //   } catch (err) {
  //     setError("Deployment error: " + err.message);
  //     setDeploying(false);

  //     // ------ SAVE FATAL ERROR TO BACKEND ------
  //     const deployment = {
  //       txhash: null,
  //       codeId: null,
  //       logs,
  //       output: "",
  //       status: "error",
  //       error: err.message || "Deployment error",
  //     };
  //     saveDeploymentToBackend({
  //       chatId,
  //       messageId,
  //       deployment,
  //       // token,
  //     }).catch((err) => {
  //       console.error("Saving deployment error info failed:", err);
  //     });
  //   }
  // };


const deployCode = async () => {
  if (!code || !config) {
    setError("Missing code or config in response.");
    return;
  }
  setDeploying(true);
  setLogs([]);
  setError(""); 
  deploymentDone.current = false; // reset flag
  try {
    // Step 1: POST to /start to get deploymentId
    const resp = await fetch(`${API_ROOT}/start`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code, config }),
    });
    if (!resp.ok) {
      const result = await resp.json();
      setError(result.error || "Failed to start deployment.");
      setDeploying(false);
      return;
    }
    const { deploymentId } = await resp.json();
    if (!deploymentId) {
      setError("No deploymentId returned from server.");
      setDeploying(false);
      return;
    }

    // ---- NEW: For collecting deployment info ----
    let deploymentInfoCollector = {
      txhash: null,
      codeId: null,
      contractAddress: null,
      contractName: null,
      logs: [],
    };

    // Step 2: Open SSE EventSource to stream logs
    eventSourceRef.current = new window.EventSource(
      `${API_ROOT}/stream/${deploymentId}`
    );

    eventSourceRef.current.addEventListener("log", (e) => {
      setLogs((prev) => [...prev, e.data]);
      deploymentInfoCollector.logs.push(e.data);

      // Try to extract info from each log line!
      const extracted = extractDeploymentInfoFromLog(e.data);
      if (extracted.txhash) deploymentInfoCollector.txhash = extracted.txhash;
      if (extracted.codeId) deploymentInfoCollector.codeId = extracted.codeId;
      if (extracted.contractAddress) deploymentInfoCollector.contractAddress = extracted.contractAddress;
      if (extracted.contractName) deploymentInfoCollector.contractName = extracted.contractName;
    });

    eventSourceRef.current.addEventListener("done", async (e) => {
      deploymentDone.current = true;
      let data = {};
      let output = "";
      let status = "success";
      let errorMsg = "";
      try {
        data = JSON.parse(e.data);
        output = data.output || "";
      } catch {
        output = e.data;
      }
      setDeploymentInfo({ ...data, output });
      setDeploying(false);
      setIsDeployed(true);
      setIsEdited(false);
      lastDeployedResponse.current = response;
      eventSourceRef.current.close();

      // ---- Merge info from done event ----
      deploymentInfoCollector.codeId = deploymentInfoCollector.codeId || data.codeId;
      deploymentInfoCollector.contractAddress = deploymentInfoCollector.contractAddress || data.contractAddress;
      deploymentInfoCollector.contractName = deploymentInfoCollector.contractName || data.contractName;
      deploymentInfoCollector.logs = deploymentInfoCollector.logs || [];
      deploymentInfoCollector.status = status;
      deploymentInfoCollector.error = errorMsg;
      deploymentInfoCollector.output = output;

    console.log("final Data to send for deployment", deploymentInfoCollector);

      // Optionally, you can also extract from output string if needed

      // ------ SAVE TO BACKEND ------
      try {
        await saveDeploymentToBackend({
          chatId,
          messageId,
          deployment: deploymentInfoCollector,
        });
      } catch (err) {
        console.error("Saving deployment info failed:", err);
      }
    });

    eventSourceRef.current.addEventListener("error", (e) => {
      setLogs((prev) => [...prev, `Error: ${e.data || "Unknown error"}`]);
      setError(e.data || "Error during deployment.");
      setDeploying(false);
      eventSourceRef.current.close();
        const artifacts = extractDeploymentArtifacts(logs);
      // ------ SAVE ERROR TO BACKEND ------
      const deployment = {
         ...artifacts,
        ...deploymentInfoCollector,
        status: "error",
        error: e.data || "Error during deployment.",
      };
      saveDeploymentToBackend({
        chatId,
        messageId,
        deployment,
      }).catch((err) => {
        console.error("Saving deployment error info failed:", err);
      });
    });

    eventSourceRef.current.onopen = () => {
      setLogs((prev) => [...prev, "Connected to deployment log stream..."]);
    };
    eventSourceRef.current.onerror = (e) => {
      setError("Connection to log stream failed.");
      setDeploying(false);
      if (eventSourceRef.current) eventSourceRef.current.close();
    };
  } catch (err) {
    setError("Deployment error: " + err.message);
    setDeploying(false);

    // ------ SAVE FATAL ERROR TO BACKEND ------
    const deployment = {
      status: "error",
      error: err.message || "Deployment error",
    };
    saveDeploymentToBackend({
      chatId,
      messageId,
      deployment,
    }).catch((err) => {
      console.error("Saving deployment error info failed:", err);
    });
  }
};

  // Extract txhash and code_id from deploymentInfo.output
  let txhash = null;
  let codeId = null;
  if (deploymentInfo && deploymentInfo.output) {
    txhash = extractTxhash(deploymentInfo.output);
    codeId = extractCodeId(deploymentInfo.output);
  }
  useEffect(() => {
    if (logs.length === 0) {
      setCurrentStepIndex(0);
      return;
    }
    // Find the latest step in logs
    let index = 0;
    for (let i = 0; i < DEPLOYMENT_STEPS.length; i++) {
      if (logs.some((log) => log.includes(DEPLOYMENT_STEPS[i].key))) {
        index = i;
      }
    }
    setCurrentStepIndex(index);
  }, [logs]);

  useEffect(() => {
    // Set isDeployed based on loaded deployment status
    if (deploymentInfo && deploymentInfo.status === "success") {
      setIsDeployed(true);
      lastDeployedResponse.current = response;
    } else {
      setIsDeployed(false);
    }
  }, [deploymentInfo, response]);

  useEffect(() => {
    if (isDeployed && response !== lastDeployedResponse.current) {
      setIsDeployed(false);
    }
  }, [response, isDeployed]);

  useEffect(() => {
  if (!typewriter) return; // only animate if typewriter is enabled

  setShowGenerationSteps(true);
  setGenerationStepIndex(0);
  setDisplayedText(""); // clear previous

  let step = 0;
  const stepDelay = 700; // ms per step, adjust as you like

  const stepper = setInterval(() => {
    setGenerationStepIndex(step);
    step++;
    if (step >= GENERATION_STEPS.length) {
      clearInterval(stepper);
      // After steps, show the real response
      setTimeout(() => {
        setShowGenerationSteps(false);
        setDisplayedText(response);
      }, 600); // short pause before showing the real output
    }
  }, stepDelay);

  return () => clearInterval(stepper);
}, [response, typewriter]);

  return (
    <div className="response-display-single text-white">
      <div className="markdown-content">
        <ReactMarkdown
          components={{
            code({ node, inline, className, children, ...props }) {
              const match = /language-(\w+)/.exec(className || "");
              return !inline && match ? (
                <SyntaxHighlighter
                  style={vscDarkPlus}
                  language={match[1]}
                  PreTag="div"
                  {...props}
                >
                  {String(children).replace(/\n$/, "")}
                </SyntaxHighlighter>
              ) : (
                <code className={className} {...props}>
                  {children}
                </code>
              );
            },
          }}
        >
          {displayedText}
        </ReactMarkdown>      
        
        {code &&  config && !isDeployed && !showGenerationSteps && (
          <button
            onClick={deployCode}
            className={`mt-2 bg-blue-600 px-3 py-1 rounded ${
              deploying ? "opacity-60 cursor-not-allowed" : ""
            }`}
            disabled={deploying}
          >
            {deploying ? "Deploying..." : "Deploy Code"}
          </button>
        )}
        {error && (
          <div className="mt-2 p-2 bg-red-800 text-white rounded">{error}</div>
        )}
        {/* Logs Section, auto-scrolled */}
        {(deploying || logs.length > 0) && (
          <div
            className="mt-4 p-4 bg-gray-800 text-white rounded-lg shadow"
            style={{ maxHeight: 250, overflowY: "auto" }}
          >
            <div className="font-bold mb-2">Deployment Logs:</div>
            <pre style={{ margin: 0 }}>
              {logs.map((log, i) => (
                <div key={i}>{log}</div>
              ))}
              <div ref={logsEndRef} />
            </pre>
          </div>
        )}
        {/* Loader / Progress Bar */}
        {deploying && (
          <div
            style={{
              margin: "1em 0",
              padding: "1em",
              background: "#222",
              borderRadius: "0.5em",
              boxShadow: "0 0 8px #111",
            }}
          >
            <div style={{ fontWeight: "bold", marginBottom: "0.5em" }}>
              Deployment Progress:
            </div>
            <div>
              {DEPLOYMENT_STEPS.map((step, idx) => (
                <div
                  key={step.key}
                  style={{
                    color:
                      idx < currentStepIndex
                        ? "#7ffeaf"
                        : idx === currentStepIndex
                        ? "#ffd700"
                        : "#888",
                    fontWeight: idx === currentStepIndex ? "bold" : "normal",
                    marginBottom: ".3em",
                  }}
                >
                  {idx < currentStepIndex
                    ? "✓"
                    : idx === currentStepIndex
                    ? "→"
                    : ""}{" "}
                  {step.label}
                </div>
              ))}
            </div>
            <div
              style={{
                marginTop: "0.7em",
                height: "8px",
                background: "#333",
                borderRadius: "4px",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  width: `${
                    ((currentStepIndex + 1) / DEPLOYMENT_STEPS.length) * 100
                  }%`,
                  height: "100%",
                  background: "#7ffeaf",
                  transition: "width 0.3s",
                }}
              />
            </div>
            <div
              style={{ marginTop: "0.5em", color: "#ccc", fontSize: "0.95em" }}
            >
              {currentStepIndex < DEPLOYMENT_STEPS.length - 1
                ? `${
                    DEPLOYMENT_STEPS.length - currentStepIndex - 1
                  } step(s) remaining`
                : "Final step in progress..."}
            </div>
          </div>
        )}
        {/* Deployment Info */}
        {deploymentInfo && (
          <div className="mt-4 p-4 bg-gray-800 text-white rounded-lg shadow">
            {(deploymentInfo.success || deploymentInfo.status==="success") && (
              <div
                style={{
                  background: "#154c18",
                  color: "#7ffeaf",
                  padding: "0.7em 1em",
                  borderRadius: "0.5em",
                  marginBottom: "1em",
                  fontWeight: "bold",
                }}
              >
                🎉 Deployment Successful!
              </div>
            )}
            {txhash && (
              <div
                style={{
                  background: "#243a5a",
                  color: "#ffffffff",
                  padding: "0.6em 1em",
                  borderRadius: "0.5em",
                  marginBottom: "1em",
                  fontWeight: "bold",
                }}
              >
                <span>
                  This is your hash code (<b>txhash</b>):
                </span>
                <div
                  style={{
                    wordBreak: "break-all",
                    marginTop: "0.5em",
                    marginBottom: "1.5em",
                    fontSize: "1.1em",
                  }}
                >
                  {txhash}
                </div>
                <span style={{ marginTop: "20px" }}>
                  You can check You Transaction Here :
                </span>
                <div
                  style={{
                    wordBreak: "break-all",
                    marginTop: "1.5em",
                    fontSize: "1.1em",
                  }}
                >
                  <a
                    href={`https://testnet.seistream.app/transactions/${txhash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      wordBreak: "break-all",
                      marginTop: "0.5em",
                      fontSize: "1.1em",
                      color: "#ffffff", // Optional: style for link color
                      textDecoration: "underline", // Optional: style for link appearance
                    }}
                  >
                    https://testnet.seistream.app/
                  </a>
                </div>
              </div>
            )}
            {codeId && (
              <div
                style={{
                  background: "#23272e",
                  color: "#fd0",
                  padding: "0.4em 1em",
                  borderRadius: "0.5em",
                  marginBottom: "1em",
                  fontWeight: "bold",
                }}
              >                
              </div>
            )}
        
          </div>
        )}
      </div>
    </div>
  );
};

export default ResponseDisplaySingle;
