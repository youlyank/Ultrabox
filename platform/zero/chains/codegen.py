"""
Code generation chain for creating project files based on specifications.
"""
import json
import os
import subprocess
from typing import Dict, List, Any
from pathlib import Path

class CodeGenerator:
    def __init__(self, ollama_base_url: str = "http://localhost:11434"):
        self.ollama_base_url = ollama_base_url
        self.model = "codellama:13b-instruct"
        self.templates = self._load_templates()
    
    def generate_project(self, plan: Dict[str, Any], output_dir: str) -> List[str]:
        """Generate complete project based on plan."""
        created_files = []
        
        # Create project structure
        os.makedirs(output_dir, exist_ok=True)
        
        # Generate based on stack
        if plan["stack"] == "nextjs":
            created_files.extend(self._generate_nextjs_project(plan, output_dir))
        elif plan["stack"] == "go":
            created_files.extend(self._generate_go_project(plan, output_dir))
        elif plan["stack"] == "python":
            created_files.extend(self._generate_python_project(plan, output_dir))
        elif plan["stack"] == "rust":
            created_files.extend(self._generate_rust_project(plan, output_dir))
        
        # Generate common files
        created_files.extend(self._generate_common_files(plan, output_dir))
        
        return created_files
    
    def _generate_nextjs_project(self, plan: Dict[str, Any], output_dir: str) -> List[str]:
        """Generate Next.js project files."""
        created_files = []
        
        # package.json
        package_json = {
            "name": plan["project_name"],
            "version": "0.1.0",
            "private": True,
            "scripts": {
                "dev": "next dev",
                "build": "next build",
                "start": "next start",
                "lint": "next lint",
                "test": "jest"
            },
            "dependencies": {
                "next": "14.0.0",
                "react": "^18.2.0",
                "react-dom": "^18.2.0"
            },
            "devDependencies": {
                "@types/node": "^20.0.0",
                "@types/react": "^18.2.0",
                "@types/react-dom": "^18.2.0",
                "autoprefixer": "^10.4.16",
                "eslint": "^8.54.0",
                "eslint-config-next": "14.0.0",
                "jest": "^29.7.0",
                "postcss": "^8.4.31",
                "tailwindcss": "^3.3.5",
                "typescript": "^5.3.2"
            }
        }
        
        # Add feature-specific dependencies
        if "auth" in plan["features"]:
            package_json["dependencies"]["next-auth"] = "^4.24.5"
        if "payments" in plan["features"]:
            package_json["dependencies"]["stripe"] = "^14.9.0"
        if "realtime" in plan["features"]:
            package_json["dependencies"]["socket.io-client"] = "^4.7.4"
        if "database" in plan["features"]:
            package_json["dependencies"]["prisma"] = "^5.6.0"
            package_json["dependencies"]["@prisma/client"] = "^5.6.0"
        
        package_file = os.path.join(output_dir, "package.json")
        with open(package_file, 'w') as f:
            json.dump(package_json, f, indent=2)
        created_files.append(package_file)
        
        # Next.js config
        next_config = '''/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
}

module.exports = nextConfig'''
        
        config_file = os.path.join(output_dir, "next.config.js")
        with open(config_file, 'w') as f:
            f.write(next_config)
        created_files.append(config_file)
        
        # TypeScript config
        tsconfig = '''{
  "compilerOptions": {
    "target": "es5",
    "lib": ["dom", "dom.iterable", "es6"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "paths": {
      "@/*": ["./*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}'''
        
        tsconfig_file = os.path.join(output_dir, "tsconfig.json")
        with open(tsconfig_file, 'w') as f:
            f.write(tsconfig)
        created_files.append(tsconfig_file)
        
        # Tailwind config
        tailwind_config = '''/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}'''
        
        tailwind_file = os.path.join(output_dir, "tailwind.config.js")
        with open(tailwind_file, 'w') as f:
            f.write(tailwind_config)
        created_files.append(tailwind_file)
        
        # Create app directory structure
        app_dir = os.path.join(output_dir, "app")
        os.makedirs(app_dir, exist_ok=True)
        
        # Layout
        layout_content = '''import './globals.css'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: \'''' + plan["project_name"] + '''',
  description: \'''' + plan["description"] + '''',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  )
}'''
        
        layout_file = os.path.join(app_dir, "layout.tsx")
        with open(layout_file, 'w') as f:
            f.write(layout_content)
        created_files.append(layout_file)
        
        # Page
        page_content = '''export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex">
        <h1 className="text-4xl font-bold">
          Welcome to ''' + plan["project_name"].replace('-', ' ').title() + '''
        </h1>
      </div>
      
      <div className="relative flex place-items-center before:absolute before:h-[300px] before:w-[480px] before:-translate-x-1/2 before:rounded-full before:bg-gradient-radial before:from-white before:to-transparent before:blur-2xl before:content-[''] after:absolute after:-z-20 after:h-[180px] after:w-[240px] after:translate-x-1/3 after:bg-gradient-conic after:from-sky-200 after:via-blue-200 after:blur-2xl after:content-[''] before:dark:bg-gradient-to-br before:dark:from-transparent before:dark:to-blue-700 before:dark:opacity-10 after:dark:from-sky-900 after:dark:via-[#0141ff] after:dark:opacity-40 before:lg:h-[360px] z-[-1]">
        <div className="relative">
          <p className="text-center text-lg">
            ''' + plan["description"] + '''
          </p>
          <div className="mt-8">
            <h2 className="text-2xl font-semibold mb-4">Features</h2>
            <ul className="list-disc list-inside space-y-2">
              ''' + '\n              '.join([f'<li>{feature.replace("-", " ").title()}</li>' for feature in plan["features"]]) + '''
            </ul>
          </div>
        </div>
      </div>
    </main>
  )
}'''
        
        page_file = os.path.join(app_dir, "page.tsx")
        with open(page_file, 'w') as f:
            f.write(page_content)
        created_files.append(page_file)
        
        # Globals CSS
        globals_css = '''@tailwind base;
@tailwind components;
@tailwind utilities;'''
        
        globals_file = os.path.join(app_dir, "globals.css")
        with open(globals_file, 'w') as f:
            f.write(globals_css)
        created_files.append(globals_file)
        
        return created_files
    
    def _generate_go_project(self, plan: Dict[str, Any], output_dir: str) -> List[str]:
        """Generate Go project files."""
        created_files = []
        
        # go.mod
        go_mod = f'''module {plan["project_name"]}

go 1.21

require (
	github.com/gin-gonic/gin v1.9.1
	github.com/joho/godotenv v1.5.1
)'''
        
        go_mod_file = os.path.join(output_dir, "go.mod")
        with open(go_mod_file, 'w') as f:
            f.write(go_mod)
        created_files.append(go_mod_file)
        
        # main.go
        main_go = '''package main

import (
	"log"
	"net/http"
	"os"

	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
)

func main() {
	// Load environment variables
	if err := godotenv.Load(); err != nil {
		log.Println("No .env file found")
	}

	// Initialize Gin router
	r := gin.Default()

	// Middleware
	r.Use(gin.Logger())
	r.Use(gin.Recovery())

	// Routes
	r.GET("/", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{
			"message": "Welcome to ''' + plan["project_name"] + '''",
			"description": "''' + plan["description"] + '''",
			"features": ''' + str(plan["features"]) + ''',
		})
	})

	// Health check
	r.GET("/health", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{
			"status": "healthy",
		})
	})

	// Get port from environment or use default
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	log.Printf("Server starting on port %s", port)
	if err := r.Run(":" + port); err != nil {
		log.Fatal("Failed to start server:", err)
	}
}'''
        
        main_go_file = os.path.join(output_dir, "main.go")
        with open(main_go_file, 'w') as f:
            f.write(main_go)
        created_files.append(main_go_file)
        
        return created_files
    
    def _generate_python_project(self, plan: Dict[str, Any], output_dir: str) -> List[str]:
        """Generate Python project files."""
        created_files = []
        
        # requirements.txt
        requirements = ["fastapi==0.104.1", "uvicorn==0.24.0", "python-dotenv==1.0.0"]
        
        if "database" in plan["features"]:
            requirements.extend(["sqlalchemy==2.0.23", "alembic==1.12.1"])
        if "auth" in plan["features"]:
            requirements.extend(["python-jose[cryptography]==3.3.0", "passlib[bcrypt]==1.7.4"])
        
        requirements_file = os.path.join(output_dir, "requirements.txt")
        with open(requirements_file, 'w') as f:
            f.write('\n'.join(requirements))
        created_files.append(requirements_file)
        
        # main.py
        main_py = '''from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import os

app = FastAPI(
    title="''' + plan["project_name"].replace('-', ' ').title() + '''",
    description="''' + plan["description"] + '''",
    version="0.1.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {
        "message": "Welcome to ''' + plan["project_name"] + '''",
        "description": "''' + plan["description"] + '''",
        "features": ''' + str(plan["features"]) + '''
    }

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

if __name__ == "__main__":
    port = int(os.getenv("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)'''
        
        main_py_file = os.path.join(output_dir, "main.py")
        with open(main_py_file, 'w') as f:
            f.write(main_py)
        created_files.append(main_py_file)
        
        return created_files
    
    def _generate_rust_project(self, plan: Dict[str, Any], output_dir: str) -> List[str]:
        """Generate Rust project files."""
        created_files = []
        
        # Cargo.toml
        cargo_toml = f'''[package]
name = "{plan["project_name"].replace("-", "_")}"
version = "0.1.0"
edition = "2021"

[dependencies]
tokio = {{ version = "1.35", features = ["full"] }}
serde = {{ version = "1.0", features = ["derive"] }}
serde_json = "1.0"
warp = "0.3"'''
        
        cargo_file = os.path.join(output_dir, "Cargo.toml")
        with open(cargo_file, 'w') as f:
            f.write(cargo_toml)
        created_files.append(cargo_file)
        
        # src/main.rs
        src_dir = os.path.join(output_dir, "src")
        os.makedirs(src_dir, exist_ok=True)
        
        main_rs = '''use serde::{Deserialize, Serialize};
use std::collections::HashMap;
use warp::Filter;

#[derive(Serialize, Deserialize)]
struct ApiResponse {
    message: String,
    description: String,
    features: Vec<String>,
}

#[tokio::main]
async fn main() {
    // GET /
    let hello = warp::path::end()
        .and(warp::get())
        .map(|| {
            warp::reply::json(&ApiResponse {
                message: "Welcome to ''' + plan["project_name"].replace('-', ' ').title() + '''".to_string(),
                description: "''' + plan["description"] + '''".to_string(),
                features: ''' + str(plan["features"]).replace("'", '"') + ''',
            })
        });

    // GET /health
    let health = warp::path("health")
        .and(warp::get())
        .map(|| {
            warp::reply::json(&HashMap::from([("status", "healthy")]))
        });

    let routes = hello.or(health);

    println!("🚀 Server starting on http://localhost:3030");
    warp::serve(routes)
        .run(([0, 0, 0, 0], 3030))
        .await;
}'''
        
        main_rs_file = os.path.join(src_dir, "main.rs")
        with open(main_rs_file, 'w') as f:
            f.write(main_rs)
        created_files.append(main_rs_file)
        
        return created_files
    
    def _generate_common_files(self, plan: Dict[str, Any], output_dir: str) -> List[str]:
        """Generate common project files."""
        created_files = []
        
        # README.md
        readme = f'''# {plan["project_name"].replace("-", " ").title()}

{plan["description"]}

## Features

{chr(10).join([f"- {feature.replace('-', ' ').title()}" for feature in plan["features"]])}

## Tech Stack

- **Framework**: {plan["stack"].title()}
- **Infrastructure**: {plan["infra"].title()}
- **Database**: {plan["db"].title()}
- **Testing**: {plan["tests"].title()}

## Getting Started

### Prerequisites

- Node.js 18+ (for Next.js)
- Python 3.11+ (for Python)
- Go 1.21+ (for Go)
- Rust 1.70+ (for Rust)

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd {plan["project_name"]}

# Install dependencies
'''
        
        if plan["stack"] == "nextjs":
            readme += "npm install\n"
        elif plan["stack"] == "python":
            readme += "pip install -r requirements.txt\n"
        elif plan["stack"] == "go":
            readme += "go mod download\n"
        elif plan["stack"] == "rust":
            readme += "cargo build\n"
        
        readme += '''

# Run the development server
'''
        
        if plan["stack"] == "nextjs":
            readme += "npm run dev\n"
        elif plan["stack"] == "python":
            readme += "python main.py\n"
        elif plan["stack"] == "go":
            readme += "go run main.go\n"
        elif plan["stack"] == "rust":
            readme += "cargo run\n"
        
        readme += '''

# Open your browser
Navigate to http://localhost:3000 (Next.js) or http://localhost:8080 (Go/Python) or http://localhost:3030 (Rust)
```

## Project Structure

```
'''
        
        if plan["stack"] == "nextjs":
            readme += '''├── app/
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
├── public/
├── next.config.js
├── package.json
├── tailwind.config.js
└── tsconfig.json'''
        else:
            readme += '''├── src/
│   └── main.''' + ("py" if plan["stack"] == "python" else "rs") + '''
├── requirements.txt / go.mod / Cargo.toml
└── README.md'''
        
        readme += '''

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Generated by Ultra DevBox Zero-Code Builder

🚀 Built with [Ultra DevBox](https://github.com/youlyank/Ultrabox)
'''
        
        readme_file = os.path.join(output_dir, "README.md")
        with open(readme_file, 'w') as f:
            f.write(readme)
        created_files.append(readme_file)
        
        # .gitignore
        gitignore_content = '''# Dependencies
node_modules/
__pycache__/
target/
vendor/

# Environment variables
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# Build outputs
dist/
build/
.next/

# IDE
.vscode/
.idea/
*.swp
*.swo

# OS
.DS_Store
Thumbs.db

# Logs
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Database
*.db
*.sqlite

# Coverage
coverage/
.nyc_output/

# Temporary files
tmp/
temp/'''
        
        gitignore_file = os.path.join(output_dir, ".gitignore")
        with open(gitignore_file, 'w') as f:
            f.write(gitignore_content)
        created_files.append(gitignore_file)
        
        return created_files
    
    def _load_templates(self) -> Dict[str, str]:
        """Load code templates (could be extended with more templates)."""
        return {
            "nextjs_auth": "// NextAuth configuration",
            "go_middleware": "// Go middleware",
            "python_fastapi": "# FastAPI app",
            "rust_warp": "// Warp server"
        }