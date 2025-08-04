  // utils/parseClaudeResponse.js
  // export function extractCodeAndConfig(markdown) {
  //   const rustMatch = markdown.match(/```(?:rust)([\s\S]*?)```/);
  //   const jsonMatch = markdown.match(/```(?:json)([\s\S]*?)```/);

  //   return {
  //     code: rustMatch ? rustMatch[1].trim() : null,
  //     config: jsonMatch ? JSON.parse(jsonMatch[1].trim()) : null
  //   };
  // }
// Utility function to extract code and config from AI response
// Helper: Extract txhash, code_id, contract_address, contract_name from log lines




export const extractCodeAndConfig = (response) => {
  if (!response || typeof response !== 'string') {
    return { code: null, config: null };
  }

  try {
    // Simple regex to extract code blocks (this can be enhanced based on actual response format)
    const codeBlocks = response.match(/```[\s\S]*?```/g);
    
    if (!codeBlocks || codeBlocks.length < 2) {
      return { code: null, config: null };
    }

    // Extract rust code (first code block)
    const rustCode = codeBlocks[0]?.replace(/```(rust)?\n?/g, '').replace(/```$/g, '');
    
    // Extract config (second code block, typically JSON)
    const configText = codeBlocks[1]?.replace(/```(json)?\n?/g, '').replace(/```$/g, '');
    
    let config = null;
    try {
      config = JSON.parse(configText);
    } catch  {
      // If not valid JSON, return as string
      config = configText;
    }

    return {
      code: rustCode,
      config: config
    };
  } catch (error) {
    console.error('Error parsing Claude response:', error);
    return { code: null, config: null };
  }
};
// Extracts Rust contract, config (JSON), and React DApp code blocks from markdown
export function parseAIResponse(markdown) {
  if (!markdown || typeof markdown !== 'string') {
    return { rustContract: null, deploymentConfig: null, reactDApp: null };
  }



  // Grab all triple-backtick code blocks with optional language
  const codeBlocks = Array.from(markdown.matchAll(/```(\w+)?\n([\s\S]*?)```/g));
 
  let rustContract = null, deploymentConfig = null, reactDApp = null;
  for (const [, lang = '', code] of codeBlocks) {
    const langLower = lang.toLowerCase();
    if (!rustContract && langLower === 'rust') rustContract = code.trim();
    if (!deploymentConfig && langLower === 'json') {
      try { deploymentConfig = JSON.parse(code.trim()); } catch { deploymentConfig = code.trim(); }
    }
    if (!reactDApp && (langLower === 'react' || langLower === 'jsx' || langLower === 'js'))
      reactDApp = code.trim();
  }
  // In your response, reactDApp should now be the entire code block, even if it has multiple files!
  return { rustContract, deploymentConfig, reactDApp };
}

// (keep your existing parseReactDAppFiles, buildFileTree, createSimpleFileList, etc.)
 
// Parse React DApp files from concatenated code block
export function parseReactDAppFiles(reactDAppString) {


  
  //console.log("reactDAppString", reactDAppString);
  if (!reactDAppString || typeof reactDAppString !== 'string') return [];

  // Normalize line endings for safety
  const normalized = reactDAppString.replace(/\r\n/g, '\n');

  // Regex for // filename\n ...content...
  const fileRegex = /\/\/\s*([^\n]+)\n([\s\S]*?)(?=(\/\/\s*[^\n]+\n)|$)/g;
  const files = [];
  let match;

  while ((match = fileRegex.exec(normalized)) !== null) {
    files.push({
      path: match[1].trim(),
      content: match[2].trim(),
    });
  }

  // Fallback: If nothing matched, treat the whole thing as App.jsx
  if (files.length === 0 && reactDAppString.trim()) {
    files.push({ path: 'App.jsx', content: reactDAppString.trim() });
  }
  return files;
}
// export function getCodeBlockLanguages(markdown) {
//   if (!markdown || typeof markdown !== 'string') return new Set();
//   // ALLOW any non-newline after ```
//   const codeBlocks = Array.from(markdown.matchAll(/```([^\s\n]+)?[\s\n]*([\s\S]*?)```/g));
//   const langs = new Set();
//   for (const [, lang] of codeBlocks) {
//     langs.add((lang || '').toLowerCase().trim());
//   }
//   console.log("Detected code block languages:", Array.from(langs));
//   return langs;
// }

export function getCodeBlockLanguages(markdown) {
  if (!markdown || typeof markdown !== 'string') return new Set();

  const codeBlocks = Array.from(
    markdown.matchAll(/```(\w+)[\r\n]+([\s\S]*?)```/g) // use \w+ and [\s\S]*?
  );

  const langs = new Set();
  for (const [, lang] of codeBlocks) {
    if (lang) langs.add(lang.toLowerCase().trim());
  }

//  console.log("Detected code block languages:", Array.from(langs));
  return langs;
}


// Get file type based on extension
const getFileType = (filename) => {
  const ext = filename.split('.').pop()?.toLowerCase();
  
  switch (ext) {
    case 'js':
    case 'jsx':
    case 'ts':
    case 'tsx':
      return 'javascript';
    case 'json':
      return 'json';
    case 'css':
      return 'css';
    case 'html':
      return 'html';
    case 'md':
      return 'markdown';
    default:
      return 'text';
  }
};

// Build file tree structure from flat file list
export const buildFileTree = (files) => {
  const tree = {};
  
  files.forEach(file => {
    const parts = file.path.split('/');
    let current = tree;
    
    parts.forEach((part, index) => {
      if (index === parts.length - 1) {
        // This is a file
        current[part] = {
          type: 'file',
          ...file
        };
      } else {
        // This is a directory
        if (!current[part]) {
          current[part] = {
            type: 'directory',
            children: {}
          };
        }
        current = current[part].children;
      }
    });
  });
  
  return tree;
};

// Create a flat list structure for easier rendering when buildFileTree creates complex nested structures
export const createSimpleFileList = (files) => {
  // Group files by directory for simpler display
  const grouped = {
    root: [],
    directories: {}
  };
  
  files.forEach(file => {
    const pathParts = file.path.split('/');
    
    if (pathParts.length === 1) {
      // Root level file
      grouped.root.push(file);
    } else {
      // File in directory
      const dirName = pathParts[0];
      if (!grouped.directories[dirName]) {
        grouped.directories[dirName] = [];
      }
      grouped.directories[dirName].push({
        ...file,
        displayName: pathParts[pathParts.length - 1]
      });
    }
  });
  
  return grouped;
};

