/**
 * AI CONFIGURATION FILE
 * ====================
 * 
 * This file shows the environment variables needed for AI integration.
 * 
 * TO USE THIS:
 * 1. Create a file named ".env" in the project root (same folder as package.json)
 * 2. Copy the content below into that .env file
 * 3. Update the values as needed
 * 4. Restart your dev server
 * 
 * IMPORTANT: .env files are hidden by default in most file explorers!
 * 
 */

// ====================================================================
// COPY EVERYTHING BELOW THIS LINE INTO YOUR .env FILE
// ====================================================================

/*

# AI Image Generation Configuration
# =================================

# MODE: Set to "true" for mock/demo mode, "false" for real AI
VITE_USE_MOCK_API=true

# AI PROVIDER: Which AI service to use (openai, gemini, or stability)
VITE_AI_PROVIDER=openai

# API KEYS: Uncomment and add your keys when using real AI
# VITE_OPENAI_API_KEY=sk-proj-xxxxxxxxxxxxx
# VITE_GOOGLE_API_KEY=xxxxxxxxxxxxx
# VITE_STABILITY_API_KEY=sk-xxxxxxxxxxxxx

*/

// ====================================================================
// END OF .env FILE CONTENT
// ====================================================================

/**
 * How to create .env file:
 * 
 * OPTION 1 - Using Terminal:
 * ```bash
 * # Create the file
 * touch .env
 * 
 * # Open it in VS Code
 * code .env
 * 
 * # Paste the content above (without the comment slashes)
 * ```
 * 
 * OPTION 2 - Using VS Code:
 * 1. File → New File
 * 2. Save as ".env" in the root folder
 * 3. Paste the content above
 * 
 * OPTION 3 - Command Line:
 * ```bash
 * cat > .env << 'EOF'
 * VITE_USE_MOCK_API=true
 * VITE_AI_PROVIDER=openai
 * # VITE_OPENAI_API_KEY=your-key-here
 * # VITE_GOOGLE_API_KEY=your-key-here
 * # VITE_STABILITY_API_KEY=your-key-here
 * EOF
 * ```
 */

export default {
  // This is a reference file only
  // The actual configuration should be in .env file
  mockMode: true,
  provider: 'openai',
  note: 'Create .env file in project root with the configuration above'
};
